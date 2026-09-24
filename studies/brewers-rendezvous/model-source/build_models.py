"""Build the original Rendezvous miniature cast and cottonwood.

Run: blender --background --factory-startup --python build_models.py
The script uses its own temporary Blender process and never opens a user's scene.
Blender is Z-up / -Y forward; the glTF exporter converts this to Y-up / +Z.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

import bpy
from mathutils import Vector


HERE = Path(__file__).resolve().parent
MODELS = HERE.parent / "dist" / "assets" / "models"
MODELS.mkdir(parents=True, exist_ok=True)


def material(name, color, roughness=1.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    principled = mat.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = (*color, 1)
    principled.inputs["Roughness"].default_value = roughness
    return mat


M = {
    "dark": material("warm charcoal", (.075, .07, .067)),
    "nose": material("soft black nose", (.105, .085, .08)),
    "eye": material("espresso eyes", (.13, .075, .045), .65),
    "glint": material("eye glint", (1, .91, .75)),
    "cream": material("vanilla muzzle", (.94, .82, .65)),
    "blush": material("subtle warm blush", (.91, .54, .43)),
    "shirt_fox": material("fox lake blue shirt", (.22, .51, .56)),
    "shirt_bear": material("bear marigold shirt", (.89, .58, .20)),
    "shirt_rabbit": material("rabbit sky shirt", (.43, .64, .69)),
    "shorts": material("olive charcoal shorts", (.25, .28, .24)),
    "shoes": material("trail shoe leather", (.30, .23, .17)),
    "soles": material("trail shoe soles", (.15, .13, .12)),
    "button": material("shirt buttons", (.9, .79, .58)),
    "bark": material("cottonwood warm gray bark", (.58, .55, .48)),
    "bark_shadow": material("cottonwood furrow shadow", (.40, .40, .36)),
    "bark_light": material("cottonwood bark highlight", (.72, .69, .60)),
    "leaf_dark": material("cottonwood deep green", (.22, .37, .22)),
    "leaf_mid": material("cottonwood summer green", (.38, .54, .25)),
    "leaf_light": material("cottonwood sunlit leaves", (.64, .69, .27)),
    "leaf_lime": material("cottonwood lime tips", (.52, .64, .28)),
}


def parent_keep(obj, parent):
    obj.parent = parent
    return obj


def empty(name, parent=None, loc=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    if parent:
        obj.parent = parent
    return obj


def mesh_material(obj, mat):
    obj.data.materials.append(mat)
    return obj


def uv_ball(name, loc, scale, mat, parent=None, segments=12, rings=8):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    mesh_material(o, mat)
    if parent:
        parent_keep(o, parent)
    return o


def ico(name, loc, scale, mat, parent=None, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    mesh_material(o, mat)
    if parent:
        parent_keep(o, parent)
    return o


def cube(name, loc, scale, mat, parent=None, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    if bevel:
        mod = o.modifiers.new("gentle rounded edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        mod.affect = "EDGES"
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier=mod.name)
        o.data.polygons.foreach_set("use_smooth", [True] * len(o.data.polygons))
    mesh_material(o, mat)
    if parent:
        parent_keep(o, parent)
    return o


def cone(name, loc, radius1, radius2, depth, mat, parent=None, vertices=9):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius1, radius2=radius2, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    mesh_material(o, mat)
    if parent:
        parent_keep(o, parent)
    return o


def tapered_segment(name, start, end, r0, r1, mat, parent=None, vertices=9):
    a, b = Vector(start), Vector(end)
    d = b-a
    o = cone(name, (a+b)/2, r0, r1, d.length, mat, parent, vertices)
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return o


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def head_features(root, species, fur, inner, muzzle):
    # Head pivot is at the neck. Eyes are toward Blender -Y (glTF +Z).
    if species == "fox":
        uv_ball("Fox head / broad cheeks", (0, -.005, .165), (.258, .206, .232), fur, root)
        uv_ball("Fox ivory lower face", (0, -.135, .073), (.207, .115, .122), muzzle, root)
        for side in (-1, 1):
            o = cone("Fox pointed ear", (side*.176, .008, .403), .103, .008, .298, fur, root)
            o.rotation_euler[1] = side * -.12
            o = cone("Fox inner ear", (side*.176, -.080, .402), .055, .005, .215, inner, root)
            o.rotation_euler[1] = side * -.12
            uv_ball("Fox cheek ruff", (side*.196, -.101, .062), (.095, .091, .068), muzzle, root)
        uv_ball("Fox snout", (0, -.205, .108), (.105, .12, .075), muzzle, root)
    elif species == "bear":
        uv_ball("Bear rounded head", (0, 0, .15), (.246, .215, .242), fur, root)
        for side in (-1, 1):
            uv_ball("Bear round ear", (side*.202, 0, .345), (.083, .068, .086), fur, root)
            uv_ball("Bear inner ear", (side*.210, -.056, .351), (.048, .028, .049), inner, root)
        uv_ball("Bear muzzle", (0, -.195, .065), (.143, .111, .104), muzzle, root)
    else:
        uv_ball("Rabbit rounded head", (0, -.005, .13), (.222, .183, .224), fur, root)
        for side in (-1, 1):
            ear = uv_ball("Rabbit tall ear", (side*.118, .021, .508), (.092, .067, .284), fur, root)
            ear.rotation_euler[1] = side*-.12
            ear = uv_ball("Rabbit inner pink ear", (side*.118, -.040, .515), (.056, .023, .222), inner, root)
            ear.rotation_euler[1] = side*-.12
        uv_ball("Rabbit twin muzzle L", (-.057, -.17, .046), (.074, .072, .062), muzzle, root)
        uv_ball("Rabbit twin muzzle R", (.057, -.17, .046), (.074, .072, .062), muzzle, root)
    eye_x = .102 if species == "rabbit" else .111
    for side in (-1, 1):
        uv_ball("Eye", (side*eye_x, -.208, .178), (.038, .021, .051), M["eye"], root)
        uv_ball("Eye light", (side*eye_x-.010, -.229, .195), (.011, .008, .014), M["glint"], root, 8, 6)
        uv_ball("Warm cheek", (side*.165, -.189, .075), (.038, .012, .021), M["blush"], root, 8, 6)
    uv_ball("Little nose", (0, -.295 if species == "fox" else -.275, .112 if species == "fox" else .082),
            (.049, .035, .032), M["nose"], root)
    smile_y = {"fox": -.325, "bear": -.304, "rabbit": -.242}[species]
    for side in (-1, 1):
        tapered_segment("Small friendly smile", (0, smile_y, .016),
                        (side*.060, smile_y+.009, .034), .005, .004, M["nose"], root, 6)


def build_character(species):
    reset_scene()
    fur = material(species+" fur", {"fox":(.79,.32,.12), "bear":(.18,.16,.15), "rabbit":(.70,.59,.45)}[species])
    inner = material(species+" ear inner", {"fox":(.91,.65,.50), "bear":(.40,.30,.28), "rabbit":(.80,.49,.45)}[species])
    muzzle = M["cream"] if species != "bear" else material("bear honey muzzle", (.69,.50,.31))
    shirt = M["shirt_"+species]
    root = empty("CharacterRoot")
    body = empty("Body", root, (0,0,0))
    uv_ball("Camp shirt body", (0, .005, .657), (.240, .151, .235), shirt, body)
    cube("Shirt straight hem", (0, -.005, .532), (.405,.276,.065), shirt, body, .026)
    for side in (-1,1):
        o = cube("Open camp collar", (side*.087,-.144,.842), (.155,.045,.070), shirt, body, .012)
        o.rotation_euler[1] = side*.28
        cube("Shirt pocket", (side*.136,-.154,.681), (.080,.018,.073), shirt, body, .006)
    cube("Open collar neckline", (0,-.145,.824), (.085,.030,.061), fur, body, .014)
    for z in (.73,.64,.55):
        uv_ball("Button", (0,-.165,z), (.010,.010,.010), M["button"], body, 8, 6)
    uv_ball("Shorts waistband", (0,.008,.443), (.208,.144,.083), M["shorts"], body)
    for side in (-1,1):
        cube("Shorts leg", (side*.109,0,.380), (.172,.275,.120), M["shorts"], body, .025)
        arm = empty("ArmL" if side==-1 else "ArmR", root, (side*.224,0,.783))
        upper = uv_ball("Sleeve", (side*.041, .005, -.064), (.108,.113,.114), shirt, arm)
        upper.rotation_euler[1] = side*.22
        tapered_segment("Exposed forearm", (side*.083,0,-.130), (side*.105,-.003,-.271), .062,.049,fur,arm)
        uv_ball("Mitten paw", (side*.105,-.013,-.299), (.065,.062,.068), fur, arm)
        leg = empty("LegL" if side==-1 else "LegR", root, (side*.105,0,.393))
        tapered_segment("Short leg", (0,0,-.064),(0,0,-.279),.063,.048,fur,leg)
        uv_ball("Little ankle sock", (0,0,-.268),(.052,.050,.026),M["cream"],leg)
        shoe = uv_ball("Hiking shoe", (0,-.045,-.343),(.092,.140,.052),M["shoes"],leg)
        uv_ball("Shoe sole", (0,-.049,-.386),(.094,.143,.018),M["soles"],leg)
    head = empty("Head", root, (0,-.006,.941))
    head_features(head, species, fur, inner, muzzle)
    if species == "fox":
        tail = empty("Tail", root, (0,.105,.43))
        o = uv_ball("Fox plume", (0,.187,-.035), (.134,.237,.134), fur, tail)
        o.rotation_euler[0] = -.20
        uv_ball("Fox white tail tip", (0,.370,-.075), (.095,.083,.095), muzzle, tail)
    elif species == "rabbit":
        tail = empty("Tail", root, (0,.14,.43))
        uv_ball("Rabbit cotton tail", (0,.090,-.032), (.080,.082,.080), muzzle, tail)
    else:
        tail = empty("Tail", root, (0,.14,.41))
        uv_ball("Bear nub tail", (0,.05,-.02), (.052,.05,.05), fur, tail)
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE / f"character-{species}.blend"))
    export(root, MODELS / f"character-{species}.glb")


def bark_line(parent, start, end, radius=.012, pale=False):
    tapered_segment("Bark furrow" if not pale else "Pale bark ridge", start, end, radius, radius*.65,
                    M["bark_light"] if pale else M["bark_shadow"], parent, 6)


def build_cottonwood():
    reset_scene()
    rng = random.Random(32026)
    root = empty("CottonwoodRoot")
    root.scale = (.80, .80, 1.0)
    # Slightly crooked, deeply forked mature trunk. Five major arms span 12.8 m.
    trunk_pts = [(-.12,.10,0),(-.17,.06,1.9),(.14,-.10,4.1),(.29,-.18,6.0),(.13,-.12,8.0)]
    trunk_rs = [.83,.68,.52,.39,.26]
    for i in range(4):
        tapered_segment("Great cottonwood trunk",trunk_pts[i],trunk_pts[i+1],trunk_rs[i],trunk_rs[i+1],M["bark"],root,13)
    # Root flare gives the old tree its grounded weight.
    for a in range(7):
        ang=a*2*math.pi/7
        tapered_segment("Root flare",(.0,0,.76),(.9*math.cos(ang),.85*math.sin(ang),.06),.23,.045,M["bark"],root,7)
    for j in range(26):
        ang=j*2.4
        x=.48*math.cos(ang); y=.47*math.sin(ang)
        pale=j%5==0
        bark_line(root,(x,y,.3+rng.random()),(x*.75,y*.75,3.2+rng.random()*2.1),.012 if pale else .018,pale)
    crown_tips=[]
    branches=[
        ((.17,-.1,5.4),(-4.9,-.6,8.55),(-6.1,-.3,10.2)),
        ((.18,-.15,5.8),(4.6,-.9,8.8),(6.2,-.7,10.2)),
        ((.19,-.2,6.0),(-2.9,-3.4,9.0),(-3.8,-4.8,10.7)),
        ((.17,-.2,6.2),(2.8,-3.0,9.3),(3.7,-4.7,10.8)),
        ((.10,.0,6.1),(-2.9,3.3,9.0),(-4.0,4.9,11.0)),
        ((.17,.0,6.0),(2.9,3.2,9.1),(4.1,5.0,10.8)),
        ((.18,-.1,6.4),(-.5,-.5,10.3),(-.8,-.5,12.8)),
        ((.17,-.1,6.4),(1.2,.9,10.4),(1.8,1.4,12.8)),
    ]
    for a,b,c in branches:
        tapered_segment("Mighty spreading fork",a,b,.29,.16,M["bark"],root,9)
        tapered_segment("High cottonwood branch",b,c,.16,.055,M["bark"],root,8)
        crown_tips.append(Vector(c))
        for k in (-1,1):
            delta=Vector((k*rng.uniform(.4,1.2),rng.uniform(-.9,.9),rng.uniform(.45,1.15)))
            tip=Vector(c)+delta
            tapered_segment("Small high branch",c,tip,.060,.018,M["bark"],root,6)
            crown_tips.append(tip)
    # Dappled, asymmetrical crown: layered small clumps reveal branch structure.
    palettes=[M["leaf_dark"],M["leaf_mid"],M["leaf_lime"],M["leaf_light"]]
    for n, tip in enumerate(crown_tips):
        count=8 if n%3 else 11
        for k in range(count):
            p=tip+Vector((rng.gauss(0,.63),rng.gauss(0,.65),rng.gauss(.15,.40)))
            p.z=max(9.0,p.z)
            radius=rng.uniform(.42,.85)
            mat=palettes[rng.choices(range(4),weights=(3,5,3,2))[0]]
            o=ico("Leaf cluster",p,(radius,radius*rng.uniform(.8,1.12),radius*rng.uniform(.65,.98)),mat,root,2 if k%5==0 else 1)
            o.rotation_euler=(rng.random()*.5,rng.random()*.5,rng.random()*6.28)
    # Interwoven mid-crown layers give a continuous green roof over the park.
    for i in range(175):
        a = rng.random() * math.tau
        r = math.sqrt(rng.random())
        x, y = 5.35*r*math.cos(a), 4.12*r*math.sin(a)
        z = rng.uniform(10.45, 12.9) - .40*r
        radius = rng.uniform(.43, .82)
        mat = palettes[rng.choices(range(4), weights=(2,6,4,2))[0]]
        o = ico("Interwoven leaf crown", (x,y,z),
                (radius*1.11,radius,radius*.75),mat,root,1)
        o.rotation_euler = (rng.random()*.6,rng.random()*.6,rng.random()*math.tau)
    # A few brighter scallops around the sunlit crown silhouette.
    for i in range(50):
        a=rng.random()*math.tau
        x=rng.uniform(3.1,5.8)*math.cos(a)
        y=rng.uniform(2.9,4.6)*math.sin(a)
        z=rng.uniform(9.9,13.2)
        ico("Sunlit leaf tuft",(x,y,z),(.22,.26,.20),M["leaf_light"] if i%2 else M["leaf_lime"],root,1)
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE / "cottonwood.blend"))
    # The editable source keeps every tuft separate. The delivered GLB groups
    # geometry by material so a few trees do not cost hundreds of draw calls.
    for mat in (M["bark"], M["bark_shadow"], M["bark_light"],
                M["leaf_dark"], M["leaf_mid"], M["leaf_lime"], M["leaf_light"]):
        members = [o for o in bpy.data.objects if o.type == "MESH" and o.data.materials and o.data.materials[0] == mat]
        if len(members) < 2:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        for o in members:
            o.select_set(True)
        bpy.context.view_layer.objects.active = members[0]
        bpy.ops.object.join()
        members[0].name = mat.name + " combined"
    export(root, MODELS / "cottonwood.glb")


def export(root, path):
    bpy.ops.object.select_all(action="DESELECT")
    for o in bpy.data.objects:
        ancestor = o.parent
        under_root = False
        while ancestor:
            if ancestor == root:
                under_root = True
                break
            ancestor = ancestor.parent
        if o == root or under_root:
            o.select_set(True)
    bpy.context.view_layer.objects.active=root
    bpy.ops.export_scene.gltf(filepath=str(path),export_format="GLB",use_selection=True,
                              export_yup=True,export_apply=False,export_materials="EXPORT",
                              export_cameras=False,export_lights=False)
    print("EXPORTED", path, path.stat().st_size)


for animal in ("fox","bear","rabbit"):
    build_character(animal)
build_cottonwood()
