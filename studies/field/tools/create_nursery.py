"""Nursery furniture, turf and framed user-supplied family collage."""
import bpy, math, random, os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Nursery');bpy.context.window.scene=scene
rng=random.Random(9)
def mat(name,c):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*c,1);b.inputs['Roughness'].default_value=.93;return m
wood=mat('Nursery_faded_wood',(.38,.28,.15));paint=mat('Crib_cream',(.63,.60,.45));linen=mat('Old_mattress',(.52,.50,.34));fabric=mat('Recliner_moss_fabric',(.16,.19,.105));seam=mat('Recliner_seams',(.065,.08,.04));dark=mat('Foot_mechanism',(.04,.045,.028));red=mat('Block_red',(.32,.075,.035));blue=mat('Block_blue',(.075,.15,.20));yellow=mat('Block_yellow',(.48,.36,.095))
def group(name):
 o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);return o
def box(name,p,size,m,parent,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.parent=parent;o.data.materials.append(m)
 if bevel:
  b=o.modifiers.new('Worn_edges','BEVEL');b.width=bevel;b.segments=3;bpy.ops.object.modifier_apply(modifier=b.name)
 return o
crib=group('NurseryCrib')
for x in [-.78,.78]:
 for y in [-.43,.43]:box('Crib_post',(x,y,.59),(.065,.065,1.18),paint,crib,.012)
for y in [-.43,.43]:
 for z in [.38,1.11]:box('Crib_rail',(0,y,z),(1.60,.065,.075),paint,crib,.012)
 for i in range(13):box('Crib_slat',(-.70+i*.1167,y,.745),(.035,.035,.66),paint,crib,.006)
for x in [-.78,.78]:
 for z in [.38,1.11]:box('End_rail',(x,0,z),(.065,.87,.075),paint,crib,.01)
 for i in range(7):box('End_slat',(x,-.35+i*.1167,.745),(.035,.035,.66),paint,crib,.006)
box('Bed_base',(0,0,.37),(1.52,.80,.085),wood,crib)
box('Mattress',(0,0,.46),(1.48,.77,.14),linen,crib,.035)
box('Folded_blanket',(.39,0,.54),(.45,.76,.035),fabric,crib,.014)
chair=group('NurseryRecliner')
box('Recliner_base',(0,.06,.20),(.94,.90,.32),dark,chair,.03)
box('Seat_cushion',(0,-.08,.48),(.80,.82,.24),fabric,chair,.095)
o=box('Reclining_back',(0,.36,.90),(.90,.28,.88),fabric,chair,.10);o.rotation_euler.x=math.radians(-12)
box('Head_cushion',(0,.43,1.25),(.78,.26,.23),fabric,chair,.07)
for x in [-.52,.52]:box('Overstuffed_arm',(x,-.015,.65),(.27,.92,.37),fabric,chair,.105)
box('Raised_footrest',(0,-.67,.36),(.78,.43,.18),fabric,chair,.05)
for x in [-.26,0,.26]:box('Back_stitch',(x,.203,.96),(.012,.014,.38),seam,chair,.004)
box('Recline_lever',(.674,.16,.44),(.045,.06,.23),wood,chair,.015)
blocks=group('NurseryBlocks')
for i in range(21):
 x=rng.uniform(-.72,.72);y=rng.uniform(-.6,.6);z=.09
 if i<6:x=(i%3-1)*.19;y=.1;z=.09+(i//3)*.18
 o=box('Toy_block',(x,y,z),(.17,.17,.17),[wood,red,blue,yellow][i%4],blocks,.012);o.rotation_euler.z=0 if i<6 else rng.uniform(-1,1)
# A whole-room vertex-colored floor avoids repeated square dirt textures.
ground=group('NurseryGround');v=[];f=[];colors=[];n=64
patches=[(-2.7,1.1,1.05),(1.0,-1.7,.85),(3.5,3.5,.7),(-.6,3.6,.55)]
def soil(x,y):return min(1,sum(math.exp(-((x-a)**2+(y-b)**2)/(r*r)) for a,b,r in patches))
for j in range(n+1):
 for i in range(n+1):
  x=-5+i*10/n;y=-5+j*10/n;s=soil(x,y);noise=rng.uniform(.72,1.17);green=(.075,.145,.033);dirt=(.16,.105,.045);c=tuple((green[k]*(1-s)+dirt[k]*s)*noise for k in range(3));v.append((x,y,.005));colors.append((*c,1))
for j in range(n):
 for i in range(n):a=j*(n+1)+i;f.extend([(a,a+1,a+n+2),(a,a+n+2,a+n+1)])
for i in range(2600):
 x=rng.uniform(-4.98,4.98);y=rng.uniform(-4.98,4.98)
 if rng.random()<soil(x,y)*1.2:continue
 h=rng.uniform(.025,.085);a=rng.random()*math.tau;dx=math.cos(a)*.012;dy=math.sin(a)*.012;k=len(v);v.extend([(x-dx,y-dy,.005),(x+dx,y+dy,.005),(x+dx*.4,y+dy*.4,h)]);f.append((k,k+1,k+2));c=(rng.uniform(.055,.095),rng.uniform(.105,.18),.026,1);colors.extend([c,c,c])
d=bpy.data.meshes.new('Living_turf');d.from_pydata(v,[],f);attribute=d.color_attributes.new(name='Turf',type='FLOAT_COLOR',domain='POINT')
for i,c in enumerate(colors):attribute.data[i].color=c
m=mat('Turf_vertex_color',(1,1,1));nodes=m.node_tree.nodes;vertex=nodes.new('ShaderNodeVertexColor');vertex.layer_name='Turf';m.node_tree.links.new(vertex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color']);m.use_backface_culling=False;d.materials.append(m)
o=bpy.data.objects.new('Grass_and_bare_soil',d);scene.collection.objects.link(o);o.parent=ground
# Keep the supplied image intact; UV windows place its photographs in separate frames.
image=bpy.data.images.load(root+'/references/nursery-family.png');image.pack()
photo=mat('Nursery_family_photographs',(1,1,1));tex=photo.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;photo.node_tree.links.new(tex.outputs['Color'],photo.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
for name,crop,w,h in [('NurseryPictureBlocks',(30,20,628,417),1.65,1.10),('NurseryPictureReading',(33,451,308,750),.90,.98),('NurseryPictureLab',(326,632,748,1143),.90,1.09)]:
 g=group(name);box('Picture_back',(0,0,0),(w+.10,.06,h+.10),wood,g,.006)
 for x in [-w/2-.025,w/2+.025]:box('Picture_frame',(x,-.046,0),(.05,.045,h+.10),paint,g,.005)
 for z in [-h/2-.025,h/2+.025]:box('Picture_frame',(0,-.046,z),(w+.10,.045,.05),paint,g,.005)
 data=bpy.data.meshes.new('Photograph');data.from_pydata([(-w/2,-.035,-h/2),(w/2,-.035,-h/2),(w/2,-.035,h/2),(-w/2,-.035,h/2)],[],[(0,1,2,3)]);data.materials.append(photo)
 uv=data.uv_layers.new();x0,y0,x1,y1=crop;W,H=image.size
 for loop,coord in zip(data.loops,[(x0/W,1-y1/H),(x1/W,1-y1/H),(x1/W,1-y0/H),(x0/W,1-y0/H)]):uv.data[loop.index].uv=coord
 o=bpy.data.objects.new('Family_photo',data);scene.collection.objects.link(o);o.parent=g
# Consolidate repeated furniture parts into material batches.
for g in [crib,chair,blocks]:
 children=list(g.children)
 batches={}
 for o in children:batches.setdefault(o.data.materials[0],[]).append(o)
 for parts in batches.values():
  bpy.ops.object.select_all(action='DESELECT')
  for o in parts:o.select_set(True)
  bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/nursery-kit.glb',export_format='GLB',use_active_scene=True,export_animations=False)
# Arrange a preview after export so library assets retain origin-centered transforms.
crib.location=(-3.55,2.3,0);crib.rotation_euler.z=math.pi/2
other=crib.copy();other.data=None;scene.collection.objects.link(other);other.location=(-3.55,-2.3,0)
for child in crib.children:
 c=child.copy();c.data=child.data;scene.collection.objects.link(c);c.parent=other
chair.location=(3.35,1.7,0);chair.rotation_euler.z=-math.pi/2;blocks.location=(.6,.8,0)
for name,p,rot in [('NurseryPictureBlocks',(0,4.95,1.9),0),('NurseryPictureReading',(-2.7,4.95,1.9),0),('NurseryPictureLab',(2.7,4.95,1.9),0)]:bpy.data.objects[name].location=p
# Back wall and floor context for asset inspection.
wall=box('Preview_wall',(0,5.08,1.5),(10,.16,3),linen,None)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(7,-10,7));scene.camera=bpy.context.object;aim(scene.camera,(0,1,.75));scene.camera.data.type='ORTHO';scene.camera.data.ortho_scale=12
for p,power in [((0,0,6),1700),((-4,-4,5),1100)]:
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.size=6;aim(o,(0,0,0))
scene.world=bpy.data.worlds.new('Nursery_studio');scene.world.color=(.14,.14,.11);scene.render.engine='CYCLES';scene.cycles.samples=20;scene.render.resolution_x=1000;scene.render.resolution_y=750;scene.render.resolution_percentage=100;scene.render.filepath=root+'/outputs/nursery-study.png'
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-nursery.blend',copy=True);bpy.ops.render.render(write_still=True)
