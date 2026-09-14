import bpy, random, math, os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Office_Kit')
bpy.context.window.scene=scene
scene.unit_settings.system='METRIC'
scene.render.engine='CYCLES'
scene.cycles.samples=16
random.seed(38)

def material(name,base,noise=0.03,kind='plain'):
    mat=bpy.data.materials.new(name); mat.use_nodes=True
    nodes=mat.node_tree.nodes; p=nodes.get('Principled BSDF'); p.inputs['Roughness'].default_value=.94
    if noise:
        size=256; im=bpy.data.images.new(name+'_Surface',width=size,height=size)
        pixels=[]
        for y in range(size):
            for x in range(size):
                n=random.uniform(-noise,noise)
                if kind=='wall':
                    n+=.012*math.sin(x*.21)+.009*math.sin(y*.08+x*.024)
                    n-=.11*math.exp(-y/18)-.012
                if kind=='carpet': n+=.022*math.sin(x*2)*math.sin(y*2)
                if kind=='ceiling' and random.random()<.025:n-=.16
                pixels.extend([max(.01,min(1,c+n)) for c in base]+[1])
        im.pixels.foreach_set(pixels); im.pack()
        tex=nodes.new('ShaderNodeTexImage');tex.image=im
        mat.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
    else:p.inputs['Base Color'].default_value=(*base,1)
    return mat
wall=material('FIELD_Warm_Beige_Paint',(.59,.55,.39),.026,'wall')
carpet=material('FIELD_Olive_Taupe_Carpet',(.26,.25,.19),.085,'carpet')
ceiling=material('FIELD_Acoustic_Tile',(.62,.61,.51),.035,'ceiling')
trim=material('FIELD_Rubber_Skirting',(.19,.18,.13),0)
metal=material('FIELD_Aged_Ceiling_Grid',(.37,.38,.32),0)
lamp=material('FIELD_Fluorescent_Diffuser',(.8,.81,.58),0)
p=lamp.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(.85,.89,.63,1);p.inputs['Emission Strength'].default_value=2.8

def group(name):
    o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);return o

def box(name,loc,dim,mat,parent):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name=name;o.dimensions=dim
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat);o.parent=parent
    # World-oriented UVs keep the wall's subtle grime at skirting level.
    for poly in o.data.polygons:
        normal=poly.normal
        for li in poly.loop_indices:
            co=o.data.vertices[o.data.loops[li].vertex_index].co
            if abs(normal.y)>.5:uv=(co.x/dim[0]+.5,co.z/dim[2]+.5)
            elif abs(normal.z)>.5:uv=(co.x/dim[0]+.5,co.y/dim[1]+.5)
            else:uv=(co.y/dim[1]+.5,co.z/dim[2]+.5)
            o.data.uv_layers.active.data[li].uv=uv
    return o
w=group('Wall')
box('Painted_panel',(0,0,1.5),(1,.12,3),wall,w)
box('Rubber_baseboard',(0,-.073,.075),(1,.035,.15),trim,w)
box('Ceiling_edge',(0,-.065,2.97),(1,.03,.055),metal,w)
f=group('Floor');box('Carpet',(0,0,-.04),(1,1,.08),carpet,f)
c=group('Ceiling');box('Acoustic_tile',(0,0,3.035),(.986,.986,.07),ceiling,c)
box('Grid_X',(0,.495,3.005),(1,.014,.025),metal,c);box('Grid_Y',(.495,0,3.005),(.014,1,.025),metal,c)
l=group('Fixture');box('Recessed_housing',(0,0,2.99),(.55,.95,.06),metal,l);box('Diffuser',(0,0,2.951),(.49,.87,.02),lamp,l)
for x in [-.17,0,.17]:box('Diffuser_rib',(x,0,2.935),(.008,.87,.01),ceiling,l)
d=group('DoorFrame')
for x in [-.54,.54]:box('Door_jamb',(x,0,1.2),(.08,.2,2.4),trim,d)
box('Door_header',(0,0,2.39),(1.16,.2,.09),trim,d)
box('Transom',(0,0,2.72),(1.16,.12,.56),wall,d)
o=group('Outlet');box('Outlet_plate',(0,-.08,.35),(.09,.025,.14),ceiling,o)
for z in [.32,.38]:
    for x in [-.018,.018]:box('Socket',(x,-.095,z),(.009,.01,.019),trim,o)
bpy.context.view_layer.update()
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/office-kit.glb',export_format='GLB',use_active_scene=True,export_animations=False,export_extras=True)
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-office-kit.blend',copy=True)
result={'scene':scene.name,'objects':len(scene.objects),'glb':root+'/dist/assets/office-kit.glb','bytes':os.path.getsize(root+'/dist/assets/office-kit.glb')}
