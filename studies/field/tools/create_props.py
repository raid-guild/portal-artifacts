import bpy, math, os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Continuity_Props');bpy.context.window.scene=scene;scene.unit_settings.system='METRIC'
def mat(n,c,metal=0):
 m=bpy.data.materials.new('CONT_'+n);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.78;p.inputs['Metallic'].default_value=metal;return m
wood=mat('Laminate',(.31,.23,.13));steel=mat('Steel',(.13,.15,.13),.5);cloth=mat('Upholstery',(.16,.23,.20));paper=mat('Paper',(.78,.76,.63));ink=mat('Forest_ink',(.075,.14,.12));black=mat('Bakelite',(.025,.035,.03));brass=mat('Brass',(.36,.30,.15),.5);cream=mat('Plastic',(.53,.52,.40))
def group(n):
 o=bpy.data.objects.new(n,None);scene.collection.objects.link(o);return o
def box(n,loc,dim,m,parent):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);o.parent=parent;return o
def cylinder(n,loc,r,depth,m,parent):
 bpy.ops.mesh.primitive_cylinder_add(vertices=10,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=n;o.data.materials.append(m);o.parent=parent;return o
def text(n,body,x,z,size,parent,m=ink):
 c=bpy.data.curves.new(n,'FONT');c.body=body;c.size=size;c.align_x='CENTER';c.extrude=.00015;o=bpy.data.objects.new(n,c);scene.collection.objects.link(o);o.parent=parent;o.location=(x,-.035,z);o.rotation_euler=(math.pi/2,0,0);c.materials.append(m)
 # Export real mesh typography, so signage does not depend on browser font loading.
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
d=group('Desk');box('Top',(0,0,.76),(1.6,.8,.055),wood,d)
for x in [-.66,.66]:
 for y in [-.28,.28]:box('Leg',(x,y,.36),(.045,.045,.72),steel,d)
box('Modesty_panel',(0,.28,.46),(1.35,.035,.38),wood,d);box('Drawer_pedestal',(.52,0,.41),(.39,.68,.58),cream,d)
for z in [.24,.44,.64]:box('Drawer_handle',(.52,-.352,z),(.14,.024,.015),steel,d)
box('Paper_stack',(-.24,-.05,.806),(.28,.36,.035),paper,d);box('Phone',(.36,-.1,.825),(.23,.18,.075),black,d);box('Handset',(.36,-.1,.89),(.28,.06,.055),black,d)
c=group('Chair');box('Seat',(0,0,.45),(.48,.46,.07),cloth,c);box('Backrest',(0,.22,.73),(.46,.065,.48),cloth,c)
for x in [-.20,.20]:
 for y in [-.17,.17]:box('Chair_leg',(x,y,.225),(.025,.025,.45),steel,c)
for x in [-.2,.2]:box('Back_support',(x,.21,.55),(.022,.024,.40),steel,c)
a=group('Cabinet');box('Archive_case',(0,0,.67),(.48,.65,1.34),cream,a)
for z in [.23,.65,1.07]:
 box('Drawer',(0,-.334,z),(.43,.023,.38),steel,a);box('Label',(0,-.35,z+.09),(.13,.01,.045),paper,a);box('Pull',(0,-.369,z),(.16,.025,.018),brass,a)
for name,heading,lines in [('IncidentPoster','CONTINUITY',[('WORKPLACE SYSTEMS',.80,.045),('DAYS SINCE',.58,.075),('LAST INCIDENT',.46,.068),('000',.18,.23),('PLEASE CONTINUE',-.02,.05),('RECORDING YOUR PROGRESS.',-.10,.037)]),('WellnessPoster','CONTINUITY',[('PEOPLE & PLACES',.80,.05),('YOU ARE',.58,.1),('STILL HERE.',.43,.1),('Your presence matters.',.22,.055),('Your absence is recorded.',.09,.043),('PERSONNEL SERVICES',-.10,.04)]),('DirectionPoster','CONTINUITY',[('FACILITIES DIVISION',.80,.047),('ALL ROUTES',.56,.084),('LEAD TO WORK.',.43,.08),('DO NOT MEASURE',.16,.055),('UNASSIGNED SPACE.',.05,.048),('FORM 00 / REVISION 00',-.11,.035)])]:
 g=group(name);box('Poster_board',(0,0,.48),(.92,.04,1.38),paper,g);text('Brand',heading,0,1.0,.105,g)
 for body,z,size in lines:text('Notice',body,0,z,size,g)
 for x in [-.46,.46]:box('Frame',(x,-.027,.48),(.025,.035,1.42),brass,g)
 for z in [-.22,1.18]:box('Frame',(0,-.027,z),(.94,.035,.025),brass,g)
g=group('Portrait');box('Portrait_back',(0,0,.60),(1.1,.04,.85),black,g)
for x in [-.56,.56]:box('Portrait_frame',(x,-.025,.60),(.045,.06,.94),wood,g)
for z in [.15,1.05]:box('Portrait_frame',(0,-.025,z),(1.16,.06,.045),wood,g)
# An architectural relief: nested empty doorways floating in a black field.
for i in range(5):
 scale=.78**i;xx=.14*i/5
 for x in [-.32,.32]:box('Empty_doorway',(xx+x*scale,-.04-i*.008,.6),(.018,.012,.60*scale),cream,g)
 box('Doorway_header',(xx,-.04-i*.008,.6+.30*scale),(.66*scale,.012,.018),cream,g)
text('Caption','OUR FOUNDERS',0,.04,.055,g,paper)
g=group('Door');box('Door_leaf',(0,0,1.15),(.94,.075,2.3),wood,g);box('Door_pushplate',(.33,-.045,1.1),(.075,.02,.3),brass,g);box('Door_handle',(.28,-.09,1.10),(.18,.04,.025),steel,g);box('Door_number',(0,-.047,1.75),(.23,.01,.10),paper,g);text('Number','000',0,1.72,.065,g)
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/continuity-props.glb',export_format='GLB',use_active_scene=True,export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-continuity-props.blend',copy=True)
result={'scene':scene.name,'objects':len(scene.objects),'bytes':os.path.getsize(root+'/dist/assets/continuity-props.glb')}
