"""Build the editable Vitalik-inspired rest mesh, rig, profile and projection renders.

Run inside Blender 5.2 with the Vitalik_Study scene in outputs/vitalik-rigged.blend.
The original default Scene is retained. The companion bake script uses this exact rest mesh.
"""
import bpy, json, math, os
from pathlib import Path
from mathutils import Vector

SITE = Path(os.environ.get('VITALIK_SITE_ROOT', Path(__file__).resolve().parents[1]))
OUT = Path(os.environ.get('VITALIK_OUTPUT_ROOT', SITE / 'outputs'))
ASSETS = SITE / 'dist/assets'
OUT.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)
SCENE = bpy.data.scenes.get('Vitalik_Study') or bpy.data.scenes.new('Vitalik_Study')
bpy.context.window.scene = SCENE
for obj in list(SCENE.objects): bpy.data.objects.remove(obj, do_unlink=True)
SCENE.unit_settings.system = 'METRIC'

def mat(name, color):
    m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=.86
    return m

SKIN=mat('Warm skin neutral',(.67,.49,.39))
NAVY=mat('Striped sweater guide navy',(.085,.13,.23))
PANTS=mat('Dark trousers',(.035,.043,.057))
HAIR=mat('Short chestnut hair',(.21,.13,.085))
EYE=mat('Brown facial details',(.095,.061,.045))
LIP=mat('Muted lip',(.39,.22,.19))
SHOE=mat('Offwhite sneakers',(.72,.72,.68))
SOLE=mat('Shoe soles',(.52,.53,.52))

def mesh(name, verts, faces, material):
    data=bpy.data.meshes.new(name)
    data.from_pydata(verts,[],faces)
    data.update()
    obj=bpy.data.objects.new(name,data)
    SCENE.collection.objects.link(obj)
    obj.data.materials.append(material)
    for poly in obj.data.polygons: poly.use_smooth=True
    return obj

def loft(name, rings, material, segments=24):
    # Each ring: (center X,Y,Z, radius X,Y). One continuous limb, including elbows/knees.
    verts=[]; faces=[]
    for cx,cy,cz,rx,ry in rings:
        for j in range(segments):
            a=2*math.pi*j/segments
            verts.append((cx+rx*math.cos(a),cy+ry*math.sin(a),cz))
    faces.append(tuple(reversed(range(segments))))
    for i in range(len(rings)-1):
        for j in range(segments):
            a=i*segments+j;b=i*segments+(j+1)%segments
            faces.append((a,b,b+segments,a+segments))
    faces.append(tuple((len(rings)-1)*segments+j for j in range(segments)))
    return mesh(name,verts,faces,material)

def ellipsoid(name, pos, scale, material, segments=20, rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=pos)
    obj=bpy.context.object;obj.name=name
    obj.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.append(material)
    for poly in obj.data.polygons: poly.use_smooth=True
    return obj

def active_only(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active=obj

def fuse(name, objects, target_faces):
    active_only(objects[0])
    for obj in objects[1:]: obj.select_set(True)
    bpy.ops.object.join()
    obj=bpy.context.object;obj.name=name
    obj.data.remesh_voxel_size=.011
    bpy.ops.object.voxel_remesh()
    smooth=obj.modifiers.new('Soften voxel joins','SMOOTH');smooth.factor=1.35;smooth.iterations=3
    bpy.ops.object.modifier_apply(modifier=smooth.name)
    faces=len(obj.data.polygons)
    if faces>target_faces:
        dec=obj.modifiers.new('Controlled triangle budget','DECIMATE')
        dec.ratio=max(.1,min(1,target_faces/faces))
        bpy.ops.object.modifier_apply(modifier=dec.name)
    for poly in obj.data.polygons: poly.use_smooth=True
    return obj

torso=loft('Sweater torso',[(0,0,.94,.145,.082),(0,0,1.02,.158,.087),(0,0,1.17,.158,.09),(0,0,1.36,.183,.098),(0,0,1.52,.215,.108),(0,0,1.60,.164,.085),(0,0,1.625,.075,.064)],NAVY)
sweater_parts=[torso]
for s,n in [(-1,'left'),(1,'right')]:
    sweater_parts.append(loft(f'{n} seamless sleeve',[(s*.19,0,1.615,.025,.035),(s*.205,0,1.595,.07,.064),(s*.215,0,1.55,.092,.079),(s*.25,0,1.48,.081,.072),(s*.298,-.006,1.32,.069,.065),(s*.333,-.014,1.18,.062,.059),(s*.386,-.016,1.03,.055,.052),(s*.443,-.015,.91,.051,.049)],NAVY,20))
sweater=fuse('Continuous sweater and sleeves',sweater_parts,2050)

hips=loft('Trouser hips',[(0,0,.88,.143,.079),(0,0,.97,.16,.083),(0,0,1.05,.158,.083)],PANTS)
pant_parts=[hips]
for s,n in [(-1,'left'),(1,'right')]:
    pant_parts.append(loft(f'{n} continuous trouser leg',[(s*.091,0,1.00,.076,.074),(s*.105,-.006,.87,.071,.07),(s*.115,-.008,.71,.062,.062),(s*.116,-.012,.57,.057,.057),(s*.12,-.008,.42,.054,.056),(s*.126,-.004,.25,.049,.053),(s*.128,-.005,.115,.047,.051)],PANTS,20))
pants=fuse('Continuous trousers and knees',pant_parts,1150)

neck=loft('Neck',[(0,-.013,1.59,.055,.052),(0,-.015,1.67,.051,.05),(0,-.016,1.70,.054,.053)],SKIN)
face=loft('Long narrow face',[(0,-.018,1.665,.045,.047),(0,-.018,1.685,.064,.056),(0,-.02,1.713,.078,.067),(0,-.017,1.751,.094,.076),(0,-.013,1.79,.096,.079),(0,-.01,1.825,.085,.078),(0,-.004,1.859,.068,.066),(0,-.002,1.882,.035,.037)],SKIN,32)
skin_parts=[neck,face,ellipsoid('Nose bridge',(0,-.091,1.749),(.018,.039,.043),SKIN),ellipsoid('Nose tip',(0,-.118,1.728),(.027,.024,.018),SKIN)]
for s,n in [(-1,'left'),(1,'right')]:
    skin_parts.append(ellipsoid(f'{n} ear',(s*.098,-.005,1.747),(.015,.021,.034),SKIN))
head=fuse('Sculpted face neck ears and nose',skin_parts,750)

hair=loft('Short sculpted haircut',[(0,-.012,1.802,.085,.11),(0,-.008,1.833,.096,.094),(0,-.003,1.861,.083,.078),(0,.002,1.886,.056,.051),(0,.005,1.901,.008,.012)],HAIR,32)
# The front hairline lifts over the brows; sides and back remain close cropped.
for v in hair.data.vertices:
    if v.co.y<-.035 and v.co.z<1.845: v.co.z+=.022

details=[]
for s,n in [(-1,'left'),(1,'right')]:
    details.append(ellipsoid(f'{n} eye',(s*.037,-.086,1.778),(.012,.005,.007),EYE,12,8))
    details.append(ellipsoid(f'{n} brow',(s*.038,-.088,1.797),(.029,.005,.004),HAIR,12,8))
    details.append(ellipsoid(f'{n} simple hand',(s*.465,-.014,.84),(.042,.03,.078),SKIN))
    details.append(ellipsoid(f'{n} shoe',(s*.128,-.072,.071),(.077,.144,.064),SHOE,24,12))
    details.append(ellipsoid(f'{n} sole',(s*.128,-.075,.026),(.078,.147,.026),SOLE,24,10))
details.append(ellipsoid('Soft lip',(0,-.092,1.699),(.028,.005,.005),LIP,12,8))

parts=[sweater,pants,head,hair]+details

def ramp(z,a,b):
    t=max(0,min(1,(z-a)/(b-a)))
    return t*t*(3-2*t)
def weights(part,p):
    x,y,z=p;side='left' if x<0 else 'right'
    if part=='sweater':
        if abs(x)>.22 and z<1.56:
            fore=1-ramp(z,1.15,1.27)
            shoulder=ramp(abs(x),.22,.31)
            return {side+'-forearm':fore,side+'-upper-arm':(1-fore)*shoulder,'chest':(1-fore)*(1-shoulder)}
        return {'pelvis':1-ramp(z,1.12,1.36),'chest':ramp(z,1.12,1.36)}
    if part=='pants':
        if abs(x)<.05 and z>.84:return {'pelvis':1}
        thigh=ramp(z,.49,.61)
        hip=ramp(z,.91,1.04)
        return {side+'-shin':1-thigh,side+'-thigh':thigh*(1-hip),'pelvis':thigh*hip}
    if part=='head':return {'head':ramp(z,1.62,1.68),'chest':1-ramp(z,1.62,1.68)}
    if part=='hand':return {side+'-forearm':1}
    if part=='shoe':return {side+'-foot':1}
    return {'head':1}

for obj in parts:
    kind='sweater' if obj==sweater else 'pants' if obj==pants else 'head' if obj==head else 'hand' if 'hand' in obj.name else 'shoe' if ('shoe' in obj.name or 'sole' in obj.name) else 'detail'
    groups={}
    for v in obj.data.vertices:
        # Primitive spheres store vertices around a local origin even though
        # their object location is a left or right hand/shoe. Use world space.
        mapping={name:value for name,value in weights(kind,obj.matrix_world @ v.co).items() if value>1e-5}
        total=sum(mapping.values())
        for name,value in mapping.items():
            if name not in groups:groups[name]=obj.vertex_groups.new(name=name)
            groups[name].add([v.index],value/total,'REPLACE')

active_only(parts[0])
for obj in parts[1:]: obj.select_set(True)
bpy.ops.object.join()
character=bpy.context.object;character.name='Vitalik_Stylized_SkinnedMesh'
active_only(character)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(island_margin=.006)
bpy.ops.object.mode_set(mode='OBJECT')

bone_specs=[('pelvis',None,(0,0,.99),(0,0,1.22)),('chest','pelvis',(0,0,1.22),(0,0,1.58)),('head','chest',(0,0,1.58),(0,-.01,1.86))]
for s,n in [(-1,'left'),(1,'right')]:
    shoulder=(s*.205,0,1.56);elbow=(s*.333,-.014,1.18);wrist=(s*.443,-.015,.91)
    hip=(s*.09,0,.99);knee=(s*.116,-.012,.57);ankle=(s*.128,-.005,.14)
    bone_specs += [(n+'-upper-arm','chest',shoulder,elbow),(n+'-forearm',n+'-upper-arm',elbow,wrist),(n+'-thigh','pelvis',hip,knee),(n+'-shin',n+'-thigh',knee,ankle),(n+'-foot',n+'-shin',ankle,(s*.128,-.1,.045))]

bpy.ops.object.armature_add(enter_editmode=True,location=(0,0,0))
arm=bpy.context.object;arm.name='Vitalik_Ragdoll_Rig';arm.data.name='Vitalik_13_Bone_Skeleton'
arm.data.edit_bones.remove(arm.data.edit_bones[0])
for name,parent,h,t in bone_specs:
    b=arm.data.edit_bones.new(name);b.head=h;b.tail=t
    if parent:b.parent=arm.data.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
arm.show_in_front=True
mod=character.modifiers.new('Ragdoll skin','ARMATURE');mod.object=arm
character.parent=arm

# Authoring camera and neutral-light projection guide, using the exact rest mesh.
cam_data=bpy.data.cameras.new('Exact orthographic projection')
cam_data.type='ORTHO';cam_data.ortho_scale=2.34
cam=bpy.data.objects.new('Projection_Camera',cam_data);SCENE.collection.objects.link(cam)
SCENE.camera=cam
world=bpy.data.worlds.new('Neutral studio white')
world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.88,.89,.9,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.9
SCENE.world=world
light_data=bpy.data.lights.new('Neutral softbox','AREA');light_data.energy=270;light_data.shape='DISK';light_data.size=4
light=bpy.data.objects.new('Neutral softbox',light_data);SCENE.collection.objects.link(light)
light.location=(1,-3,4);light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
SCENE.render.engine='BLENDER_EEVEE'
SCENE.render.resolution_x=1024;SCENE.render.resolution_y=2048;SCENE.render.resolution_percentage=100
SCENE.render.image_settings.file_format='PNG'
SCENE.render.film_transparent=False
SCENE.render.use_file_extension=True
SCENE.view_settings.view_transform='Standard'
SCENE.render.image_settings.color_mode='RGBA'
SCENE.camera=cam

def camera_pose(side):
    cam.location=(0,-6 if side=='front' else 6,.95)
    target=Vector((0,0,.95))
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
    bpy.context.view_layer.update()
    return [list(row) for row in cam.matrix_world]

guide={}
for side in ['front','back']:
    matrix=camera_pose(side)
    light.location=(0,-3 if side=='front' else 3,4)
    light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
    SCENE.render.filepath=str(OUT/f'vitalik-{side}-projection.png')
    bpy.ops.render.render(write_still=True)
    guide[side]={'cameraWorldMatrix':matrix,'panelRect':[0 if side=='front' else 1024,0,1024,2048],'orthoScaleMeters':cam_data.ortho_scale}

bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'vitalik-rigged.blend'))

# Blender Z-up -> glTF Y-up, with the character facing +Z after export.
def g(v):return [float(v[0]),float(v[2]),float(-v[1])]
def body(name,mass,pos,shape,q=None):return dict(id=name,bone=name,mass=mass,position=g(pos),quaternion=q or [0,0,0,1],shape=shape)
def capsule(name,mass,start,end,radius):
    a=Vector(g(start));b=Vector(g(end));q=Vector((0,1,0)).rotation_difference((b-a).normalized())
    return dict(id=name,bone=name,mass=mass,position=list((a+b)*.5),quaternion=[q.x,q.y,q.z,q.w],shape=dict(type='capsule',radius=radius,totalLength=(b-a).length))
bodies=[body('pelvis',9,(0,0,1.00),dict(type='box',halfExtents=[.14,.12,.08])),body('chest',13,(0,0,1.41),dict(type='box',halfExtents=[.20,.21,.10])),body('head',4,(0,-.015,1.76),dict(type='box',halfExtents=[.092,.14,.09]))]
joints=[]
def joint(a,b,anchor,swing,twist,axis=(0,0,1)):
    ax=Vector(g(axis)).normalized();ta=ax.cross(Vector((1,0,0)))
    if ta.length<.01:ta=ax.cross(Vector((0,1,0)))
    ta.normalize();joints.append(dict(parent=a,child=b,anchor=g(anchor),axis=list(ax),tangent=list(ta),swingDegrees=swing,twistDegrees=twist))
joint('pelvis','chest',(0,0,1.22),20,14)
joint('chest','head',(0,0,1.58),30,22)
for s,n in [(-1,'left'),(1,'right')]:
    shoulder=(s*.205,0,1.56);elbow=(s*.333,-.014,1.18);wrist=(s*.443,-.015,.91)
    hip=(s*.09,0,.99);knee=(s*.116,-.012,.57);ankle=(s*.128,-.005,.14)
    bodies += [capsule(n+'-upper-arm',2.2,shoulder,elbow,.061),capsule(n+'-forearm',1.6,elbow,(s*.466,-.014,.77),.049),capsule(n+'-thigh',6,hip,knee,.069),capsule(n+'-shin',4,knee,ankle,.052),body(n+'-foot',1.2,(s*.128,-.073,.075),dict(type='box',halfExtents=[.075,.075,.145]))]
    joint('chest',n+'-upper-arm',shoulder,75,35,(s,0,0))
    joint(n+'-upper-arm',n+'-forearm',elbow,65,25,(0,0,1))
    joint('pelvis',n+'-thigh',hip,50,25)
    joint(n+'-thigh',n+'-shin',knee,65,20)
    joint(n+'-shin',n+'-foot',ankle,20,15)
coords=[g(v.co) for v in character.data.vertices]
profile=dict(version=1,id='vitalik',asset='./assets/vitalik-rigged.glb',coordinateSystem='gltf-y-up',units='meters',bounds=dict(min=[min(p[i] for p in coords) for i in range(3)],max=[max(p[i] for p in coords) for i in range(3)]),bodies=bodies,joints=joints)
(ASSETS/'vitalik-ragdoll.json').write_text(json.dumps(profile,indent=2)+'\n')
projection=dict(version=1,canvas=[2048,2048],layout='front-left/back-right',model='vitalik-stylized-rest-pose',sourceReference='user-provided portrait reference (not bundled)',panels=guide,restBoundsGltf=profile['bounds'],restBoundsBlender={'min':[min(v.co[i] for v in character.data.vertices) for i in range(3)],'max':[max(v.co[i] for v in character.data.vertices) for i in range(3)]},frontAxisBlender='-Y',upAxisBlender='+Z',uvAtlasResolution=[2048,2048],meshObject=character.name)
(OUT/'vitalik-projection.json').write_text(json.dumps(projection,indent=2)+'\n')
result={'scene':SCENE.name,'triangles':sum(len(p.vertices)-2 for p in character.data.polygons),'vertices':len(character.data.vertices),'bones':len(bone_specs),'bounds':profile['bounds'],'blend':str(OUT/'vitalik-rigged.blend'),'front':str(OUT/'vitalik-front-projection.png'),'back':str(OUT/'vitalik-back-projection.png')}
