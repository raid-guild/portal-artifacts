"""Bake approved front/back artwork to Vitalik's ordinary 2K UV atlas."""
import bpy
import bmesh
import hashlib
import json
import os
from pathlib import Path
import numpy as np
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector

SITE = Path(os.environ.get('VITALIK_SITE_ROOT', Path(__file__).resolve().parents[1]))
ROOT = Path(os.environ.get('VITALIK_OUTPUT_ROOT', SITE / 'outputs'))
SOURCE = Path(os.environ.get('VITALIK_IMAGE_SOURCE', ROOT / 'vitalik-texture-work/vitalik-front-back-imagegen.png'))
ASSETS = SITE / 'dist/assets'
GUIDE = json.loads((ROOT / 'vitalik-projection.json').read_text())
scene = bpy.data.scenes['Vitalik_Study']
bpy.context.window.scene = scene
mesh = bpy.data.objects['Vitalik_Stylized_SkinnedMesh']
rig = bpy.data.objects['Vitalik_Ragdoll_Rig']
camera = bpy.data.objects['Projection_Camera']
assert mesh.type == 'MESH' and rig.type == 'ARMATURE'
assert mesh.data.uv_layers.get('UVMap') is not None
assert SOURCE.is_file(), SOURCE

# The artwork has its own brows, eyes and mouth. Remove the preliminary guide
# ornaments (separate mesh islands) so the rendered face has one set of features.
names_before = [m.name for m in mesh.data.materials]
detail_faces = {p.index for p in mesh.data.polygons if 'facial details' in names_before[p.material_index].lower() or 'lip' in names_before[p.material_index].lower()}
hair_faces = {p.index for p in mesh.data.polygons if 'hair' in names_before[p.material_index].lower()}
incident = {}
for p in mesh.data.polygons:
    if p.index in hair_faces:
        for vertex in p.vertices: incident.setdefault(vertex, set()).add(p.index)
components = []
remaining = set(hair_faces)
while remaining:
    component = set()
    frontier = [remaining.pop()]
    while frontier:
        index = frontier.pop()
        if index in component: continue
        component.add(index)
        for vertex in mesh.data.polygons[index].vertices:
            for neighbor in incident[vertex]:
                if neighbor in remaining: remaining.remove(neighbor); frontier.append(neighbor)
    components.append(component)
if components:
    largest = max(components, key=len)
    for component in components:
        if component is not largest: detail_faces.update(component)
bm = bmesh.new(); bm.from_mesh(mesh.data); bm.faces.ensure_lookup_table()
bmesh.ops.delete(bm, geom=[bm.faces[index] for index in detail_faces], context='FACES')
bm.to_mesh(mesh.data); bm.free(); mesh.data.update()

art = bpy.data.images.load(str(SOURCE), check_existing=False)
art.colorspace_settings.name = 'sRGB'
w, h = art.size
assert w == h and w >= 1024, f'Expected square front/back sheet, got {w}×{h}'
pixels = np.asarray(art.pixels[:], dtype=np.float32).reshape((h, w, 4))
material_names = [m.name for m in mesh.data.materials]
material_colors = [tuple(m.diffuse_color[:3]) for m in mesh.data.materials]
original_indices = [polygon.material_index for polygon in mesh.data.polygons]

scene.render.resolution_x = 1024
scene.render.resolution_y = 2048
scene.render.resolution_percentage = 100
camera.data.type = 'ORTHO'
camera.data.ortho_scale = GUIDE['panels']['front']['orthoScaleMeters']
poses = {side: Matrix(GUIDE['panels'][side]['cameraWorldMatrix']) for side in ('front', 'back')}

def projection(side, point):
    camera.matrix_world = poses[side]
    view = world_to_camera_view(scene, camera, point)
    return ((0 if side == 'front' else .5) + view.x*.5, view.y)

def sample(u, v):
    x = max(0, min(w-1, int(u*w)))
    y = max(0, min(h-1, int(v*h)))
    return pixels[y, x, :3]

def background(color):
    return color.min() > .57 and color.max()-color.min() < .11

projection_uv = mesh.data.uv_layers.new(name='ProjectionUV')
target = bpy.data.images.new('Vitalik 2K baked base color', width=2048, height=2048, alpha=True)
target.generated_color = (0, 0, 0, 0)
target.colorspace_settings.name = 'sRGB'

def bake_material(name, color=None):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    emission = nodes.new('ShaderNodeEmission')
    output = nodes.new('ShaderNodeOutputMaterial')
    if color is None:
        uv = nodes.new('ShaderNodeUVMap'); uv.uv_map = 'ProjectionUV'
        source = nodes.new('ShaderNodeTexImage'); source.image = art
        material.node_tree.links.new(uv.outputs['UV'], source.inputs['Vector'])
        material.node_tree.links.new(source.outputs['Color'], emission.inputs['Color'])
    else:
        emission.inputs['Color'].default_value = (*color, 1)
    material.node_tree.links.new(emission.outputs[0], output.inputs['Surface'])
    bake_target = nodes.new('ShaderNodeTexImage'); bake_target.image = target
    nodes.active = bake_target
    return material

projected_material = bake_material('Projected artwork during bake')
fallback_materials = [bake_material(f'Fallback {name}', color) for name,color in zip(material_names,material_colors)]
mesh.data.materials.clear()
mesh.data.materials.append(projected_material)
for material in fallback_materials: mesh.data.materials.append(material)

fallback_polygons = 0
projected_polygons = 0
for poly, old_index in zip(mesh.data.polygons, original_indices):
    name = material_names[old_index].lower()
    side = 'front' if poly.normal.y <= 0 else 'back'
    points = [mesh.matrix_world @ mesh.data.vertices[mesh.data.loops[loop].vertex_index].co for loop in poly.loop_indices]
    center = sum(points, Vector()) / len(points)
    center_uv = projection(side, center)
    invalid = background(sample(*center_uv)) or any(background(sample(*projection(side, point))) for point in points)
    side_facing = abs(poly.normal.y) < .4
    sweater = 'sweater' in name
    upper_shoulder = sweater and center.z > 1.54
    use_stripe = sweater and (side_facing or invalid or abs(center.x) > .35) and not upper_shoulder
    use_fallback = upper_shoulder or ((side_facing or invalid) and not sweater) or 'facial details' in name or 'lip' in name or 'hair' in name
    if use_fallback:
        poly.material_index = old_index + 1
        fallback_polygons += 1
    else:
        poly.material_index = 0
        projected_polygons += 1
    for loop, point in zip(poly.loop_indices, points):
        uv = projection(side, Vector((0, point.y, point.z))) if use_stripe else projection(side, point)
        projection_uv.data[loop].uv = uv

mesh.data.uv_layers.active = mesh.data.uv_layers['UVMap']
scene.render.engine = 'CYCLES'
scene.cycles.samples = 1
scene.render.bake.use_selected_to_active = False
scene.render.bake.margin = 16
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True)
bpy.context.view_layer.objects.active = mesh
bpy.ops.object.bake(type='EMIT')

atlas = ROOT / 'vitalik-baked-atlas.png'
target.filepath_raw = str(atlas)
target.file_format = 'PNG'
target.save()
target.pack()
material = bpy.data.materials.new('Vitalik painted base color')
material.use_nodes = True
principled = material.node_tree.nodes.get('Principled BSDF')
principled.inputs['Roughness'].default_value = .82
texture = material.node_tree.nodes.new('ShaderNodeTexImage')
texture.image = target
material.node_tree.links.new(texture.outputs['Color'], principled.inputs['Base Color'])
mesh.data.materials.clear()
mesh.data.materials.append(material)
mesh.data.uv_layers.remove(projection_uv)
mesh.data.uv_layers.active = mesh.data.uv_layers['UVMap']

bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'vitalik-rigged.blend'))
bpy.ops.object.select_all(action='DESELECT')
mesh.select_set(True); rig.select_set(True)
bpy.context.view_layer.objects.active = rig
glb = ASSETS / 'vitalik-rigged.glb'
bpy.ops.export_scene.gltf(filepath=str(glb), export_format='GLB', use_selection=True,
    use_active_scene=True, export_animations=False, export_skins=True, export_yup=True)
provenance = {
    'version': 1, 'artwork': os.path.relpath(SOURCE, ROOT),
    'artworkSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'artworkDimensions': [w, h], 'guide': 'vitalik-projection.json',
    'atlas': 'vitalik-baked-atlas.png', 'atlasDimensions': [2048, 2048],
    'projection': 'Exact orthographic front/back rest-pose projectors; side sweater stripe continuation and material fallback',
    'bake': 'Cycles emission texture sampling, UVMap, 16 px margin',
    'projectedPolygons': projected_polygons, 'fallbackPolygons': fallback_polygons,
    'exportedGLB': 'dist/assets/vitalik-rigged.glb',
    'exportedGLBRelativeTo': 'VITALIK_SITE_ROOT',
}
(ROOT / 'vitalik-bake-provenance.json').write_text(json.dumps(provenance, indent=2))
result = provenance
