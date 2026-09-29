import bpy,json,math
from pathlib import Path
from mathutils import Vector,Quaternion
from mathutils.kdtree import KDTree
study=Path(__file__).resolve().parents[1]
repo=study.parents[1]
out=repo/'public/ragdoll-lab/assets'
out.mkdir(parents=True,exist_ok=True)
# Append the approved FIELD source into an isolated scene; preserve all existing scenes.
with bpy.data.libraries.load(str(repo/'studies/field/outputs/FIELD-goatman-fur.blend'),link=False) as (available,loaded):
 loaded.scenes=['Goatman_GLB_Inspection']
source=loaded.scenes[0]
scene=bpy.data.scenes.new('Goatman_Ragdoll_Study')
bpy.context.window.scene=scene
bpy.ops.import_scene.gltf(filepath=str(repo/'public/field/assets/goatman.glb'))
bpy.context.window.scene=source
bpy.context.view_layer.update()
deps=bpy.context.evaluated_depsgraph_get()
points=[]
for o in source.objects:
 if o.type!='MESH' or o.hide_render: continue
 eo=o.evaluated_get(deps); me=eo.to_mesh()
 for v in me.vertices: points.append((eo.matrix_world@v.co,o.name))
 eo.to_mesh_clear()
kd=KDTree(len(points))
for i,(p,n) in enumerate(points): kd.insert(p,i)
kd.balance()
bpy.context.window.scene=scene
bpy.context.view_layer.update()
meshes=[o for o in scene.objects if o.type=='MESH']
# Apply only the imported copy's object transforms, retaining its exact baked UV atlas.
for o in meshes:
 m=o.matrix_world.copy();o.parent=None;o.data.transform(m);o.matrix_world.identity()
# Thirteen deform bones, head and tail measured in the approved model's Blender rest space.
bones=[('pelvis',None,(0,.035,1.04),(0,.035,1.30)),('chest','pelvis',(0,.035,1.30),(0,.06,1.84)),('head','chest',(0,.06,1.84),(0,-.09,2.29))]
for s,side in [(-1,'left'),(1,'right')]:
 shoulder=(s*.215,.05,1.75);elbow=(s*.287,-.015,1.36);wrist=(s*.343,-.08,.99)
 hip=(s*.098,.04,1.08);knee=(s*.133,-.045,.61);ankle=(s*.1435,.10,.24)
 bones += [(side+'-upper-arm','chest',shoulder,elbow),(side+'-forearm',side+'-upper-arm',elbow,wrist),(side+'-thigh','pelvis',hip,knee),(side+'-shin',side+'-thigh',knee,ankle),(side+'-foot',side+'-shin',ankle,(s*.14,-.10,.06))]
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.object.armature_add(enter_editmode=True,location=(0,0,0))
arm=bpy.context.object;arm.name='Goatman_Ragdoll_Rig';arm.data.name='Goatman_13_Bone_Skeleton'
arm.data.edit_bones.remove(arm.data.edit_bones[0])
for name,parent,h,t in bones:
 b=arm.data.edit_bones.new(name);b.head=h;b.tail=t
 if parent:b.parent=arm.data.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
arm.show_in_front=True

def ramp(z,a,b):
 t=max(0,min(1,(z-a)/(b-a)));return t*t*(3-2*t)
def mix(a,b,t):return {a:1-t,b:t}
def weight(name,p):
 x,y,z=p;side='left' if x<0 else 'right'
 if name.startswith('Ribcage'):return mix('pelvis','chest',ramp(z,1.15,1.45))
 if name.startswith('Bent_neck'):return mix('chest','head',ramp(z,1.78,2.02))
 if name.startswith('Rounded_deltoid'):return mix(side+'-upper-arm','chest',ramp(z,1.68,1.87)*.75)
 if name.startswith('Upper_arm'):
  if z>1.66:return mix(side+'-upper-arm','chest',ramp(z,1.66,1.84)*.7)
  return mix(side+'-forearm',side+'-upper-arm',ramp(z,1.29,1.43))
 if name.startswith('Forearm'):return mix(side+'-forearm',side+'-upper-arm',ramp(z,1.29,1.43))
 if name.startswith(('Long_hand','Tapered_finger','Thumb')):return {side+'-forearm':1}
 if name.startswith('Thigh'):
  if z>1.00:return mix(side+'-thigh','pelvis',ramp(z,1.,1.15))
  return mix(side+'-shin',side+'-thigh',ramp(z,.55,.68))
 if name.startswith('Angled_shin'):
  if z>.5:return mix(side+'-shin',side+'-thigh',ramp(z,.55,.68))
  return mix(side+'-foot',side+'-shin',ramp(z,.19,.30))
 if name.startswith(('Pastern','Cloven_hoof')):return {side+'-foot':1}
 return {'head':1}
blended=0;maxdist=0
for o in meshes:
 groups={n:o.vertex_groups.new(name=n) for n,_,_,_ in bones}
 for v in o.data.vertices:
  _,i,d=kd.find(v.co);maxdist=max(maxdist,d)
  weights=weight(points[i][1],v.co)
  if sum(w>1e-5 for w in weights.values())>1:blended+=1
  for name,w in weights.items():
   if w>0:groups[name].add([v.index],w,'REPLACE')
 mod=o.modifiers.new('Ragdoll skin','ARMATURE');mod.object=arm
 o.parent=arm
# Export scene exclusively; retain original scenes in the editable study file.
bpy.ops.object.select_all(action='DESELECT')
for o in meshes+[arm]:o.select_set(True)
bpy.context.view_layer.objects.active=arm
bpy.context.view_layer.update()
bpy.ops.export_scene.gltf(filepath=str(out/'goatman-rigged.glb'),export_format='GLB',use_selection=True,use_active_scene=True,export_animations=False,export_skins=True,export_yup=True)
bpy.ops.wm.save_as_mainfile(filepath=str(study/'outputs/goatman-rigged.blend'))
# glTF coordinates: (x,z,-y). Capsule longitudinal axis is Y.
def g(v):return [v[0],v[2],-v[1]]
def body(name,mass,pos,shape,q=None):return dict(id=name,bone=name,mass=mass,position=g(pos),quaternion=q or [0,0,0,1],shape=shape)
def capsule(name,mass,start,end,r):
 a=Vector(g(start));b=Vector(g(end));q=Vector((0,1,0)).rotation_difference((b-a).normalized())
 return dict(id=name,bone=name,mass=mass,position=list((a+b)*.5),quaternion=[q.x,q.y,q.z,q.w],shape=dict(type='capsule',radius=r,totalLength=(b-a).length))
bodies=[body('pelvis',9,(0,.035,1.12),dict(type='box',halfExtents=[.135,.135,.10])),body('chest',13,(0,.04,1.57),dict(type='box',halfExtents=[.175,.20,.115])),body('head',4,(0,-.11,2.13),dict(type='box',halfExtents=[.12,.22,.13]))]
joints=[]
def joint(a,b,anchor,swing,twist,axis=(0,0,1)):
 ax=Vector(g(axis)).normalized();ta=ax.cross(Vector((1,0,0)))
 if ta.length<.01:ta=ax.cross(Vector((0,1,0)))
 ta.normalize();joints.append(dict(parent=a,child=b,anchor=g(anchor),axis=list(ax),tangent=list(ta),swingDegrees=swing,twistDegrees=twist))
joint('pelvis','chest',(0,.035,1.32),20,14)
joint('chest','head',(0,.06,1.84),30,22)
for s,side in [(-1,'left'),(1,'right')]:
 shoulder=(s*.215,.05,1.75);elbow=(s*.287,-.015,1.36);hip=(s*.098,.04,1.08);knee=(s*.133,-.045,.61);ankle=(s*.1435,.10,.24)
 bodies += [capsule(side+'-upper-arm',2.2,shoulder,elbow,.065),capsule(side+'-forearm',1.6,elbow,(s*.350,-.105,.76),.05),capsule(side+'-thigh',6,hip,knee,.075),capsule(side+'-shin',4,knee,ankle,.041),body(side+'-foot',1.2,(s*.14,-.01,.125),dict(type='box',halfExtents=[.061,.105,.105]))]
 joint('chest',side+'-upper-arm',shoulder,75,35,(s,0,0))
 joint(side+'-upper-arm',side+'-forearm',elbow,65,25,(0,0,1))
 joint('pelvis',side+'-thigh',hip,50,25)
 joint(side+'-thigh',side+'-shin',knee,65,20)
 joint(side+'-shin',side+'-foot',ankle,20,15)
coords=[g(o.matrix_world@v.co) for o in meshes for v in o.data.vertices]
profile=dict(version=1,id='goatman',asset='./assets/goatman-rigged.glb',coordinateSystem='gltf-y-up',units='meters',bounds=dict(min=[min(p[i] for p in coords) for i in range(3)],max=[max(p[i] for p in coords) for i in range(3)]),bodies=bodies,joints=joints)
(out/'goatman-ragdoll.json').write_text(json.dumps(profile,indent=2)+'\n')
result={'blendedVertices':blended,'vertices':len(coords),'maxSourceMatchError':maxdist,'bones':len(bones),'bounds':profile['bounds'],'glbBytes':(out/'goatman-rigged.glb').stat().st_size,'blend':str(study/'outputs/goatman-rigged.blend')}
