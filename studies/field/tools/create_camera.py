"""Old analog CCTV head; exported front is +Z in Three.js, pivot at origin."""
import bpy, math, os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Surveillance');bpy.context.window.scene=scene
parent=bpy.data.objects.new('CameraHead',None);scene.collection.objects.link(parent)
def mat(name,color,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*color,1);b.inputs['Roughness'].default_value=.8;b.inputs['Metallic'].default_value=metal
 return m
cream=mat('Aged_ivory_enamel',(.42,.40,.30));black=mat('Rubber_lens_rings',(.018,.021,.018));steel=mat('Oxidized_metal',(.12,.14,.12),.6);glass=mat('Dark_glass',(.015,.045,.04),.6);paper=mat('Inventory_label',(.60,.57,.43))
def finish(o,name,material):
 o.name=name;o.parent=parent;o.data.materials.append(material);return o
def box(name,p,size,material,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,name,material)
 if bevel:
  m=o.modifiers.new('Soft_cast_edges','BEVEL');m.width=bevel;m.segments=2;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=m.name)
 return o
def cylinder(name,p,r,depth,material):
 bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=r,depth=depth,location=p,rotation=(math.pi/2,0,0));return finish(bpy.context.object,name,material)
box('Cast_camera_housing',(0,.035,.07),(.36,.60,.28),cream,.018)
box('Front_plate',(0,-.27,.07),(.34,.028,.25),steel,.005)
box('Sun_hood',(0,-.08,.235),(.41,.79,.035),cream,.009)
for x in [-.196,.196]:box('Hood_lip',(x,-.08,.20),(.025,.79,.07),cream,.006)
for y,r,depth in [(-.31,.112,.07),(-.37,.099,.07),(-.42,.108,.03)]:cylinder('Lens_barrel',(0,y,.065),r,depth,black)
cylinder('Lens_glass',(0,-.438,.065),.078,.008,glass)
for x in [-.14,.14]:
 for z in [-.025,.16]:cylinder('Face_screw',(x,-.288,z),.012,.008,black)
for side in [-1,1]:
 for y in [.10,.15,.20,.25]:box('Cooling_slot',(side*.181,y,.08),(.004,.025,.105),black)
box('Serial_label',(.183,-.06,.065),(.006,.17,.065),paper)
box('Label_lines',(.187,-.06,.065),(.006,.125,.011),black)
box('Pivot_lug',(0,.015,-.115),(.13,.15,.10),steel,.008)
# Indicator is a separately named mesh so runtime can blink it without a light source.
cylinder('CameraIndicator',(.133,-.289,.10),.018,.012,mat('Indicator_red',(.45,.025,.008)))
box('Rear_connector',(0,.35,.03),(.12,.05,.10),black,.005)
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/surveillance-camera.glb',export_format='GLB',use_active_scene=True,export_animations=False)
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(1.1,-1.7,.9));scene.camera=bpy.context.object;aim(scene.camera,(0,0,.06));scene.camera.data.type='ORTHO';scene.camera.data.ortho_scale=1.15
for loc,power in [((-2,-3,4),350),((2,2,2),250)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.size=3;aim(o,(0,0,0))
scene.world=bpy.data.worlds.new('Camera_studio');scene.world.color=(.13,.13,.11)
scene.render.engine='CYCLES';scene.cycles.samples=16;scene.render.resolution_x=800;scene.render.resolution_y=600;scene.render.resolution_percentage=100
scene.render.filepath=root+'/outputs/camera-study.png'
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-surveillance-camera.blend',copy=True);bpy.ops.render.render(write_still=True)
