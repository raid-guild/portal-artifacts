"""Repair only the fused sweater's skin weights in an existing Vitalik blend.

Run on both the baked and unbaked editable files. Set VITALIK_EXPORT_GLB to
export the baked file after saving; geometry, UVs, and materials are untouched.
"""
import bpy
import os
import sys
from pathlib import Path
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vitalik_weights import weights

scene = bpy.data.scenes['Vitalik_Study']
bpy.context.window.scene = scene
mesh = bpy.data.objects['Vitalik_Stylized_SkinnedMesh']
rig = bpy.data.objects['Vitalik_Ragdoll_Rig']
assert mesh.type == 'MESH' and rig.type == 'ARMATURE'
assert len(rig.data.bones) == 13
bpy.context.view_layer.update()

# The sweater remains one connected island after the character parts are joined.
# Seed at the front of the torso to avoid relying on material slots after bake.
sample = Vector((0, -.09, 1.38))
seed = min(mesh.data.vertices, key=lambda v: (mesh.matrix_world @ v.co - sample).length_squared)
assert (mesh.matrix_world @ seed.co - sample).length < .10
adjacent = [[] for _ in mesh.data.vertices]
for edge in mesh.data.edges:
    a, b = edge.vertices
    adjacent[a].append(b)
    adjacent[b].append(a)
component = {seed.index}
frontier = [seed.index]
while frontier:
    for neighbor in adjacent[frontier.pop()]:
        if neighbor not in component:
            component.add(neighbor)
            frontier.append(neighbor)
assert 1500 < len(component) < 4500, f'Unexpected sweater island size: {len(component)}'
assert any(abs(mesh.data.vertices[i].co.x) > .45 for i in component)

# Reweight the sweater only. Other body parts retain their authored influences.
bone_names = {bone.name for bone in rig.data.bones}
groups = {name: mesh.vertex_groups.get(name) for name in bone_names}
assert all(groups.values())
indices = list(component)
for group in groups.values(): group.remove(indices)
for index in indices:
    point = mesh.matrix_world @ mesh.data.vertices[index].co
    mapping = {name: amount for name, amount in weights('sweater', point).items() if amount > 1e-6}
    total = sum(mapping.values())
    assert abs(total - 1) < 1e-5
    for name, amount in mapping.items(): groups[name].add([index], amount, 'REPLACE')
mesh.data.update()
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)

export_path = os.environ.get('VITALIK_EXPORT_GLB')
if export_path:
    bpy.ops.object.select_all(action='DESELECT')
    mesh.select_set(True); rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.export_scene.gltf(filepath=export_path, export_format='GLB', use_selection=True,
        use_active_scene=True, export_animations=False, export_skins=True, export_yup=True)
result = {'blend': bpy.data.filepath, 'sweaterVertices': len(component), 'exportedGLB': export_path}
