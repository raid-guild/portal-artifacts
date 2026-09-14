"""Empty CONTINUITY meeting furniture and gallery posters."""
import bpy,math,random,os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Meeting');bpy.context.window.scene=scene
rng=random.Random(5)
def mat(name,c):
 m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*c,1);b.inputs['Roughness'].default_value=.86;return m
wood=mat('Meeting_walnut',(.18,.115,.058));edge=mat('Dark_table_edge',(.055,.037,.018));steel=mat('Meeting_steel',(.075,.083,.065));paper=mat('Aged_paper',(.67,.65,.51));ink=mat('Faded_ink',(.12,.15,.10));ceramic=mat('Coffee_cup_ivory',(.48,.45,.32));coffee=mat('Cold_coffee',(.025,.012,.006));brass=mat('Dull_brass',(.28,.23,.10))
def group(name):
 o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);return o
def box(name,p,size,m,g,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);o.parent=g
 if bevel:
  b=o.modifiers.new('Worn_edge','BEVEL');b.width=bevel;b.segments=2;bpy.ops.object.modifier_apply(modifier=b.name)
 return o
def text(body,x,z,size,g):
 c=bpy.data.curves.new('Poster_type','FONT');c.body=body;c.size=size;c.align_x='CENTER';c.extrude=.0001;o=bpy.data.objects.new('Poster_type',c);scene.collection.objects.link(o);o.parent=g;o.location=(x,-.047,z);o.rotation_euler=(math.pi/2,0,0);c.materials.append(ink)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
table=group('MeetingTable')
box('Walnut_top',(0,0,.79),(2.05,4.50,.085),wood,table,.025)
box('Table_edge',(0,0,.737),(2.06,4.51,.035),edge,table,.012)
for y in [-1.55,1.55]:
 box('Pedestal',(0,y,.37),(.22,.28,.70),wood,table,.012);box('Pedestal_foot',(0,y,.045),(1.45,.44,.09),steel,table,.014)
for i,(x,y) in enumerate([(-.65,-1.45),(.63,-1.0),(-.65,.1),(.58,.55),(-.50,1.50),(.05,1.85)]):
 g=group('Paper_group');g.parent=table;g.location=(x,y,.838);g.rotation_euler.z=rng.uniform(-.3,.3)
 for j in range(2 if i%2 else 4):box('Meeting_minutes',(rng.uniform(-.015,.015),rng.uniform(-.01,.01),j*.002),(.22,.30,.0015),paper,g)
 for j in range(8):box('Typed_line',(-.015,j*.025-.09,.010),(.14 if j else .17,.002,.0006),ink,g)
 box('Paper_heading',(-.025,.125,.010),(.12,.006,.0006),ink,g)
# Hollow ceramic cup, coffee surface, rim and a real loop handle.
v=[];f=[];n=28;cx,cy=.59,-1.65
for radius,z in [(.061,.839),(.077,.99),(.066,.99),(.055,.863)]:
 for i in range(n):a=i*math.tau/n;v.append((cx+radius*math.cos(a),cy+radius*math.sin(a),z))
for j in range(3):
 for i in range(n):a=j*n+i;b=j*n+(i+1)%n;f.append((a,b,b+n,a+n))
d=bpy.data.meshes.new('Cup_shell');d.from_pydata(v,[],f);d.materials.append(ceramic);o=bpy.data.objects.new('Coffee_cup',d);scene.collection.objects.link(o);o.parent=table
bpy.ops.mesh.primitive_cylinder_add(vertices=28,radius=.059,depth=.002,location=(cx,cy,.944));o=bpy.context.object;o.name='Cold_coffee_surface';o.data.materials.append(coffee);o.parent=table
bpy.ops.mesh.primitive_torus_add(major_segments=20,minor_segments=8,location=(cx+.078,cy,.913),rotation=(math.pi/2,0,0),major_radius=.043,minor_radius=.011);o=bpy.context.object;o.name='Cup_handle';o.data.materials.append(ceramic);o.parent=table
# Additional corporate posters: real mesh lettering, no font or image requests.
for name,lines in [
 ('NeverLookBackPoster',[('CONTINUITY',.49,.115),('CAREER DEVELOPMENT',.32,.048),('NEVER LOOK',.08,.12),('BACK.',-.12,.18),('YOUR FUTURE REQUIRES',-.36,.045),('YOUR FULL ATTENTION.',-.44,.045)]),
 ('ObservationPoster',[('CONTINUITY',.49,.115),('QUALITY ASSURANCE',.32,.053),('EXCELLENCE',.10,.105),('IS OBSERVED.',-.045,.095),('PLEASE REMAIN VISIBLE.',-.40,.052)]),
 ('AttendancePoster',[('CONTINUITY',.49,.115),('PERSONNEL SERVICES',.32,.050),('ALL SEATS',.10,.13),('ACCOUNTED FOR.',-.065,.085),('ABSENCE IS A DISCREPANCY.',-.40,.042)]),
 ('LegacyPoster',[('CONTINUITY',.49,.115),('LONG-TERM PLANNING',.32,.048),('YOUR WORK',.10,.12),('OUTLIVES YOU.',-.065,.095),('THANK YOU FOR YOUR SERVICE.',-.40,.038)])]:
 g=group(name);box('Poster_board',(0,0,0),(1.05,.04,1.40),paper,g)
 for x in [-.535,.535]:box('Poster_frame',(x,-.03,0),(.035,.045,1.44),brass,g)
 for z in [-.71,.71]:box('Poster_frame',(0,-.03,z),(1.10,.045,.035),brass,g)
 for body,z,size in lines:text(body,0,z,size,g)
g=group('ExcellencePoster');w,h=1.34,2.0
box('Portrait_back',(0,.015,0),(w+.055,.055,h+.055),edge,g,.005)
d=bpy.data.meshes.new('Excellence_print');d.from_pydata([(-w/2,-.018,-h/2),(w/2,-.018,-h/2),(w/2,-.018,h/2),(-w/2,-.018,h/2)],[],[(0,1,2,3)])
uv=d.uv_layers.new()
for loop,coord in zip(d.loops,[(0,0),(1,0),(1,1),(0,1)]):uv.data[loop.index].uv=coord
m=mat('Excellence_portrait',(1,1,1));image=bpy.data.images.load(root+'/references/excellence-portrait.png');image.pack();t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=image;m.node_tree.links.new(t.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);d.materials.append(m);o=bpy.data.objects.new('Framed_excellence',d);scene.collection.objects.link(o);o.parent=g
# Landscape boardroom photograph supplied by the user, mounted as a gallery print.
g=group('BoardroomPoster');w,h=2.40,2.40*1152/1712
box('Boardroom_back',(0,.015,0),(w+.07,.055,h+.07),edge,g,.005)
d=bpy.data.meshes.new('Boardroom_print');d.from_pydata([(-w/2,-.018,-h/2),(w/2,-.018,-h/2),(w/2,-.018,h/2),(-w/2,-.018,h/2)],[],[(0,1,2,3)])
uv=d.uv_layers.new()
for loop,coord in zip(d.loops,[(0,0),(1,0),(1,1),(0,1)]):uv.data[loop.index].uv=coord
m=mat('Boardroom_photo',(1,1,1));image=bpy.data.images.load(root+'/references/boardroom-poster.png');image.pack();t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=image;m.node_tree.links.new(t.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);d.materials.append(m);o=bpy.data.objects.new('Boardroom_photograph',d);scene.collection.objects.link(o);o.parent=g
# Merge table parts by material while preserving their world transforms.
parts=[o for o in scene.objects if o.type=='MESH' and (o.parent==table or o.parent and o.parent.parent==table)]
bpy.context.view_layer.update();batches={}
for o in parts:
 matrix=o.matrix_world.copy();o.parent=table;o.matrix_world=matrix;batches.setdefault(o.data.materials[0],[]).append(o)
for batch in batches.values():
 bpy.ops.object.select_all(action='DESELECT')
 for o in batch:o.select_set(True)
 bpy.context.view_layer.objects.active=batch[0];bpy.ops.object.join()
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/meeting-kit.glb',export_format='GLB',use_active_scene=True,export_animations=False)
# Simple staged study; runtime uses existing office chairs around this table.
for name,x in [('ExcellencePoster',0),('ObservationPoster',-2.4),('AttendancePoster',2.4),('LegacyPoster',4.0),('NeverLookBackPoster',-4.0),('BoardroomPoster',6.1)]:bpy.data.objects[name].location=(x,4,1.6)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(5,-7,5));scene.camera=bpy.context.object;aim(scene.camera,(0,0,.8));scene.camera.data.type='ORTHO';scene.camera.data.ortho_scale=7.8
for p,power in [((0,0,5),1000),((-4,-3,4),850)]:
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.size=5;aim(o,(0,0,.7))
scene.world=bpy.data.worlds.new('Meeting_studio');scene.world.color=(.14,.14,.11);scene.render.engine='CYCLES';scene.cycles.samples=20;scene.render.resolution_x=1000;scene.render.resolution_y=750;scene.render.resolution_percentage=100;scene.render.filepath=root+'/outputs/meeting-study.png'
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-meeting.blend',copy=True);bpy.ops.render.render(write_still=True)
