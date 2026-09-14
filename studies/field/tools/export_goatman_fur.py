"""Bake the approved Blender inspection scene to a self-contained web GLB."""
import bpy, os
from mathutils import Matrix
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source=bpy.data.scenes['Goatman_GLB_Inspection'];bpy.context.window.scene=source
bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get()
# Evaluate shape keys/rounding/socket cuts, retaining the editable source scene.
geometry=[]
for o in source.objects:
 if o.type!='MESH' or o.hide_render:continue
 mesh=bpy.data.meshes.new_from_object(o.evaluated_get(deps),depsgraph=deps)
 mesh.transform(o.matrix_world)
 geometry.append((o.name,mesh))
scene=bpy.data.scenes.new('Goatman_Web_Export');bpy.context.window.scene=scene
objects=[]
for name,mesh in geometry:
 o=bpy.data.objects.new(name,mesh);scene.collection.objects.link(o);objects.append(o)
fur=[o for o in objects if o.data.materials and o.data.materials[0].name.startswith('Goatman_Dark_Fur')]
for o in objects:o.select_set(o in fur)
bpy.context.view_layer.objects.active=fur[0];bpy.ops.object.join();body=bpy.context.object;body.name='Goatman_Fur'
# One atlas for the body, skull, hands and rounded shoulders.
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15192,island_margin=.018);bpy.ops.object.mode_set(mode='OBJECT')
mat=body.data.materials[0].copy();body.data.materials.clear();body.data.materials.append(mat)
for poly in body.data.polygons:poly.material_index=0
scene.render.engine='CYCLES';scene.cycles.samples=8
scene.render.bake.margin=8;scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False;scene.render.bake.use_pass_color=True
scene.render.bake.use_selected_to_active=False
textures={}
for name,kind in [('Goatman_Fur_Color','DIFFUSE'),('Goatman_Fur_Normal','NORMAL')]:
 im=bpy.data.images.new(name,width=1024,height=1024,alpha=False)
 if kind=='NORMAL':im.colorspace_settings.name='Non-Color'
 node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=im;mat.node_tree.nodes.active=node
 bpy.ops.object.bake(type=kind)
 im.filepath_raw=root+'/outputs/'+name+'.png';im.file_format='PNG';im.save();im.pack();textures[kind]=im
web=bpy.data.materials.new('Goatman_Baked_Dark_Fur');web.use_nodes=True;n=web.node_tree.nodes;l=web.node_tree.links;bs=n.get('Principled BSDF');bs.inputs['Roughness'].default_value=.94
color=n.new('ShaderNodeTexImage');color.image=textures['DIFFUSE'];l.new(color.outputs['Color'],bs.inputs['Base Color'])
normal=n.new('ShaderNodeTexImage');normal.image=textures['NORMAL'];mapping=n.new('ShaderNodeNormalMap');mapping.inputs['Strength'].default_value=.65;l.new(normal.outputs['Color'],mapping.inputs['Color']);l.new(mapping.outputs['Normal'],bs.inputs['Normal'])
body.data.materials.clear();body.data.materials.append(web)
# Collapse same-material pieces into four draw calls, preserving separate eye emission.
for prefix in ['Horn_charcoal','Unlit_sockets','Goatman_Ember_Red_Eyes']:
 selected=[o for o in scene.objects if o.type=='MESH' and o.data.materials and o.data.materials[0].name.startswith(prefix)]
 for o in scene.objects:o.select_set(o in selected)
 if selected:
  bpy.context.view_layer.objects.active=selected[0]
  if len(selected)>1:bpy.ops.object.join()
  bpy.context.object.name='Goatman_'+prefix
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/goatman.glb',export_format='GLB',use_active_scene=True,export_animations=False,export_morph=False)
result={'bytes':os.path.getsize(root+'/dist/assets/goatman.glb'),'meshes':len(list(scene.objects)),'triangles':sum(len(p.vertices)-2 for o in scene.objects if o.type=='MESH' for p in o.data.polygons)}
print(result)
