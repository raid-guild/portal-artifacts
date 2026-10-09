import bpy, math, random, json
from mathutils import Vector, Matrix
from pathlib import Path
out=Path('/home/dekanjbrown/Documents/Codex/2026-10-09/can/outputs')
scene=bpy.data.scenes.new('Chance Pint • Product Prototype')
bpy.context.window.scene=scene
scene.unit_settings.system='METRIC'; scene.unit_settings.scale_length=.001

def mat(name,col,metal=0,rough=.3,trans=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*col,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*col,1); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal; p.inputs['Transmission Weight'].default_value=trans; p.inputs['IOR'].default_value=1.46
 return m
glass=mat('Clear glass',(.88,.96,1),rough=.08,trans=1)
ink=mat('Ivory fired print',(.9,.83,.64),rough=.4)
colors=[(.28,.8,.72),(.94,.62,.2),(.45,.65,1),(.92,.42,.48),(.7,.48,.9),(.76,.84,.44)]
inks=[mat('Die color '+str(n),c) for n,c in zip([4,6,8,10,12,20],colors)]
floor=mat('Midnight stage',(.018,.032,.048),rough=.28)

def lathe(name,profile,material,x):
 verts=[]; faces=[]; n=128
 for r,z in profile:
  verts.extend([(x+r*math.cos(2*math.pi*j/n),r*math.sin(2*math.pi*j/n),z) for j in range(n)])
 for k in range(len(profile)-1):
  for j in range(n): a=k*n+j; b=k*n+(j+1)%n; faces.append((a,b,b+n,a+n))
 mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
 ob=bpy.data.objects.new(name,mesh); scene.collection.objects.link(ob); ob.data.materials.append(material)
 for p in mesh.polygons:p.use_smooth=True
 bevel=ob.modifiers.new('Soft glass edges','BEVEL'); bevel.width=.6; bevel.segments=3
 return ob

def text(name,body,pos,size,material,angle=None):
 curve=bpy.data.curves.new(name,'FONT');curve.body=body;curve.align_x='CENTER';curve.align_y='CENTER';curve.size=size;curve.extrude=.025
 ob=bpy.data.objects.new(name,curve);scene.collection.objects.link(ob);ob.location=pos;ob.data.materials.append(material)
 if angle is not None:
  tangent=Vector((-math.sin(angle),math.cos(angle),0)); up=Vector((0,0,1)); normal=Vector((math.cos(angle),math.sin(angle),0))
  ob.rotation_euler=Matrix((tangent,up,normal)).transposed().to_euler()
 return ob

def line(name,coords,material,width=.15):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=width;c.bevel_resolution=2
 s=c.splines.new('POLY');s.points.add(len(coords)-1)
 for p,co in zip(s.points,coords):p.co=(*co,1)
 ob=bpy.data.objects.new(name,c);scene.collection.objects.link(ob);ob.data.materials.append(material)

rng=random.Random(7319); tracks=[]
for repeat in range(2):
 for d in [4,6,8,10,12,20]:
  vals=list(range(1,d+1));rng.shuffle(vals);tracks.append((d,vals))
# Equal liquid-volume bands over the usable reading region.
def rad(z):return 27+16*z/150
def inner_volume(z):
 t=max(0,z-6);r=24+16*t/144
 return math.pi*t*(24**2+24*r+r*r)/3
def height_at(v):
 lo,hi=6,150
 for _ in range(40):
  mid=(lo+hi)/2
  if inner_volume(mid)<v:lo=mid
  else:hi=mid
 return (lo+hi)/2
v0,v1=inner_volume(15),inner_volume(128)
for view,(x,rotation) in enumerate([(-110,0),(0,2*math.pi/3),(110,4*math.pi/3)]):
 ob=lathe('Pint glass '+str(view+1),[(0,0),(26,0),(27,2),(43,150),(40,150),(24,6),(0,6)],glass,x)
 ob['nominal_capacity_ml']=round(inner_volume(150)/1000,1);ob['height_mm']=150;ob['rim_diameter_mm']=86
 for k,(d,vals) in enumerate(tracks):
  a=-math.pi/2+k*2*math.pi/12+rotation; material=inks[[4,6,8,10,12,20].index(d)]
  z=138;r=rad(z)+.35;text('Track header',f'd{d}',(x+r*math.cos(a),r*math.sin(a),z),4.2,material,a)
  for j,value in enumerate(vals):
   low=height_at(v0+(v1-v0)*j/d); high=height_at(v0+(v1-v0)*(j+1)/d);z=(low+high)/2;r=rad(z)+.4
   text(f'd{d} track {k} value {value}',str(value),(x+r*math.cos(a),r*math.sin(a),z),3.1 if d==20 else 3.8,ink,a)
   pts=[]
   for q in range(9):
    aa=a-.13+.26*q/8;rr=rad(low)+.35;pts.append((x+rr*math.cos(aa),rr*math.sin(aa),low))
   line('Band boundary',pts,material,.12)
  line('Track upper boundary',[(x+(rad(128)+.35)*math.cos(a+t),(rad(128)+.35)*math.sin(a+t),128) for t in [-.13,0,.13]],material,.12)
 # Small brand mark in front bottom, below reading area
 a=-math.pi/2;r=rad(9)+.4;text('Brand','CHANCE',(x,r*math.sin(a),9),3,ink,a)

bpy.ops.mesh.primitive_plane_add(size=2000,location=(0,0,-.8));bpy.context.object.data.materials.append(floor)
# Editorial labels facing the camera, added later in a separate flat overview.
bpy.ops.object.camera_add(location=(240,-640,310));camera=bpy.context.object;camera.name='Product Camera';camera.rotation_euler=(Vector((0,0,76))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=430;camera.data.clip_end=3000;scene.camera=camera
for pos,power,size in [((0,-220,380),1800000,240),((-280,0,220),1300000,220),((240,170,300),2200000,180)]:
 bpy.ops.object.light_add(type='AREA',location=pos);l=bpy.context.object;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.rotation_euler=(Vector((0,0,75))-l.location).to_track_quat('-Z','Y').to_euler()
scene.world=bpy.data.worlds.new('Studio world');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.12,.17,.23,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=1500;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.render.filepath=str(out/'chance-pint.png')
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.wm.save_as_mainfile(filepath=str(out/'chance-pint.blend'))
(out/'number-layout.json').write_text(json.dumps({'seed':7319,'tracks':[{'die':d,'bottom_to_top':vals} for d,vals in tracks]},indent=2))
bpy.ops.render.render(write_still=True)
result={'blend':str(out/'chance-pint.blend'),'render':str(out/'chance-pint.png'),'capacity_ml':inner_volume(150)/1000,'tracks':12}
