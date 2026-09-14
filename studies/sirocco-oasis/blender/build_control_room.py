import bpy, os, math
from mathutils import Vector
OUT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Reuse authoring helpers in a separate scene, preserving the existing barge.
p=OUT+'/blender/build_harvester.py'
exec(compile(open(p).read().split('# Stepped annular hull')[0],p,'exec'))
scene.name='Morrow_Control_Room'
# Coordinates: operator sits toward +Y in Blender, looking out toward -Y.
box('Cabin_floor',(0,.4,.02),(1.8,1.5,.10),dark,.03)
box('Console_plinth',(0,0,.4),(1.65,.46,.78),teal,.07)
box('Console_instrument_face',(0,.245,.82),(1.68,.065,.54),dark,.025)
box('Console_top_rail',(0,.25,1.11),(1.77,.1,.07),brass,.025)
for x in (-.88,.88):
    box('Window_pillar',(x,-.08,1.23),(.065,.10,.78),cream,.018)
    box('Side_sill',(x,.38,.88),(.09,.95,.07),brass,.02)
    pipe('Safety_grab',[(x,.2,.95),(x,.25,1.17),(x,.5,1.17),(x,.55,.95)],.021,brass)
box('Window_brow',(0,-.08,1.61),(1.85,.18,.12),cream,.025)
box('Roof_lining',(0,.35,1.7),(1.85,1.1,.06),teal,.02)
# A squat field receiver rests on the left-hand sill.
box('Radio_receiver',(-.57,-.04,1.25),(.52,.3,.28),rust,.025)
box('Radio_face',(-.57,.12,1.25),(.47,.018,.235),dark,.008)
for i in range(7):box('Speaker_grille',(-.77+i*.026,.135,1.25),(.008,.014,.14),brass,.003)
pipe('Receiver_antenna',[(-.8,-.1,1.4),(-.81,-.1,1.53)],.008,brass)
for x in (-.78,.78):
    for z in (.6,1.04):cyl('Panel_screw',(x,.288,z),.013,.015,brass,(math.pi/2,0,0),12)
# Sleeved cable runs behind the console.
for x in (-.5,0,.5):pipe('Cable_loom',[(x,-.18,.8),(x,-.27,.4),(x+.12,-.28,.08)],.024,dark)
bpy.ops.object.select_all(action='SELECT');bpy.context.view_layer.objects.active=next(iter(scene.objects))
bpy.ops.export_scene.gltf(filepath=OUT+'/public/models/control-room.glb',export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True)
scene.world=bpy.data.worlds.new('Cabin_studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
bpy.ops.object.camera_add(location=(2,3,2.2));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.85))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3;scene.camera=cam
bpy.ops.object.light_add(type='AREA',location=(0,2,4));bpy.context.object.data.energy=200;bpy.context.object.data.size=3
scene.render.resolution_x=1100;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.render.filepath=OUT+'/blender/control-room-preview.png'
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/blender/control-room.blend',copy=True);bpy.ops.render.render(write_still=True)
result={'exported':'control-room.glb','preview':scene.render.filepath}
