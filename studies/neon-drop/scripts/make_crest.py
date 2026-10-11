import bpy, math
from pathlib import Path
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic=.6, roughness=.25, emission=0):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metallic
    bs.inputs['Roughness'].default_value=roughness
    bs.inputs['Emission Color'].default_value=(*color,1)
    bs.inputs['Emission Strength'].default_value=emission
    return m
cyan=material('Cyan anodized light',(.02,.72,.92),.15,.2,2.5)
gold=material('Gold edge',(.92,.55,.12),.8,.2,.8)
steel=material('Dark steel',(.025,.07,.12),.85,.22)

def torus(name,major,minor,loc,mat,rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=64,minor_segments=12,location=loc,rotation=rot)
    o=bpy.context.object;o.name=name;o.data.materials.append(mat)
    return o

def box(name,loc,scale,mat,bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name=name;o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat)
    if bevel:
        b=o.modifiers.new('soft metal edges','BEVEL');b.width=bevel;b.segments=3
        n=o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
    return o

box('crest dark bar',(0,0,0),(4.2,.56,.12),steel,.12)
for x in (-1.9,1.9):
    torus('gold ring',.18,.034,(x,0,.09),gold,(-math.pi/2,0,0))
for x in (-1.35,1.35):
    box('cyan light segment',(x,0,.091),(.7,.045,.025),cyan,.016)
# Diamond emblem above the word mark, view-facing in XY plane
for angle in (math.pi/4,-math.pi/4):
    pass
for i in range(4):
    a=i*math.pi/2+math.pi/4
    x1,y1=math.cos(a)*.33,math.sin(a)*.33
    x2,y2=math.cos(a+math.pi/2)*.33,math.sin(a+math.pi/2)*.33
    dx,dy=x2-x1,y2-y1
    o=box('diamond edge',((x1+x2)/2,(y1+y2)/2,.13),(math.hypot(dx,dy),.055,.055),gold,.02)
    o.rotation_euler[2]=math.atan2(dy,dx)
# horizontal insignia bars
for y,w in ((.28,1.0),(-.28,1.0)):
    box('light slash',(0,y,.12),(w,.045,.04),cyan,.015)

# GLB forward is +Y in Blender. Rotate object assembly to lie on cabinet backdrop.
for obj in list(bpy.context.scene.objects):
    obj.rotation_euler[0]+=math.pi/2
    obj.rotation_euler[2]+=0
bpy.ops.export_scene.gltf(filepath=str(Path(__file__).resolve().parents[1]/'assets'/'arcade-crest.glb'),export_format='GLB')
