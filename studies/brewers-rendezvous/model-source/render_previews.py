"""Render quick orthographic contact sheets from the editable source blends."""
from pathlib import Path
import sys
import bpy
from mathutils import Vector

here = Path(__file__).resolve().parent
names = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else ("character-fox", "character-bear", "character-rabbit", "cottonwood")
for name in names:
    bpy.ops.wm.open_mainfile(filepath=str(here / (name + ".blend")))
    scene = bpy.context.scene
    world = bpy.data.worlds.new("preview sky")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (.72,.81,.83,1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = .8
    scene.world = world
    bpy.ops.object.camera_add(location=(2.2,-3.8,2.0) if name != "cottonwood" else (20,-25,18))
    camera = bpy.context.object
    target = Vector((0,0,.63) if name != "cottonwood" else (0,0,7))
    camera.rotation_euler = (target-camera.location).to_track_quat("-Z","Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 1.8 if name != "cottonwood" else 19
    scene.camera = camera
    bpy.ops.object.light_add(type="AREA", location=(-3,-4,6) if name != "cottonwood" else (-12,-15,28))
    light=bpy.context.object
    light.data.energy=500 if name != "cottonwood" else 7000
    light.data.shape="DISK"
    light.data.size=5 if name != "cottonwood" else 15
    scene.render.engine="BLENDER_EEVEE"
    scene.render.resolution_x=750
    scene.render.resolution_y=750
    scene.render.resolution_percentage=100
    scene.render.image_settings.file_format="PNG"
    scene.render.film_transparent=True
    scene.render.filepath=str(here/(name+"-preview.png"))
    bpy.ops.render.render(write_still=True)
