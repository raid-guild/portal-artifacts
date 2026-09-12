import bpy, math, os
from mathutils import Vector
OUT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('Morrow_Water_Harvester');bpy.context.window.scene=scene

def mat(name,hex):
    rgb=[int(hex[i:i+2],16)/255 for i in (0,2,4)]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1);m.use_nodes=True;m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*rgb,1);m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.7;return m
cream=mat('Harvester • enamel','e9c79a');teal=mat('Harvester • hull','527777');dark=mat('Harvester • iron','354453');brass=mat('Harvester • brass','b89461');rust=mat('Harvester • oxide','af6451');glass=mat('Harvester • windows','315a69');light=mat('Harvester • luminous','b7f7dc');silk=mat('Harvester • bladder','bcdcd1')
def mesh(name,vs,fs,m):
    me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new(name,me);scene.collection.objects.link(o);o.data.materials.append(m);return o

def box(name,loc,scale,m,bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
    if bevel:mod=o.modifiers.new('Rolled edges','BEVEL');mod.width=bevel;mod.segments=2
    return o

def cyl(name,loc,r,depth,m,rotation=None,vertices=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(m)
    if rotation:o.rotation_euler=rotation
    return o

def ball(name,loc,scale,m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(m)
    for p in o.data.polygons:p.use_smooth=True
    return o

def ring(name,r,t,z,m,xy=(0,0)):
    bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=8,major_radius=r,minor_radius=t,location=(*xy,z));o=bpy.context.object;o.name=name;o.data.materials.append(m);return o

def pipe(name,points,r,m):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=10;c.bevel_depth=r;c.bevel_resolution=2
    s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);o.data.materials.append(m);return o

# Stepped annular hull with a genuinely open central moon pool.
vs=[];fs=[];n=96;profile=[(1.65,.72),(3.65,.72),(3.95,.40),(3.75,-.12),(1.75,-.12)]
for r,z in profile:
    for i in range(n):a=i/n*math.tau;vs.append((r*math.cos(a),r*math.sin(a),z))
for j in range(len(profile)):
    for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,((j+1)%len(profile))*n+(i+1)%n,((j+1)%len(profile))*n+i))
o=mesh('Annular_working_deck',vs,fs,cream);o.data.materials.append(teal);o.data.materials.append(dark)
for p in o.data.polygons:p.material_index=0 if p.index<n else (2 if p.index>=4*n else 1)
ring('Outer_rubbing_strake',3.87,.085,.35,dark);ring('Inside_safety_lip',1.69,.07,.78,brass)
# Radial plating, rivets and lifelines.
for i in range(32):
    a=i/32*math.tau
    pipe('Deck_plate_seam',[(1.8*math.cos(a),1.8*math.sin(a),.733),(3.57*math.cos(a),3.57*math.sin(a),.733)],.011,dark)
    for r in (1.84,3.52):ball('Deck_rivet',(r*math.cos(a),r*math.sin(a),.745),(.04,.04,.018),brass)
for i in range(24):
    a=i/24*math.tau;cyl('Guardrail_stanchion',(3.62*math.cos(a),3.62*math.sin(a),.96),.025,.46,brass,vertices=8)
ring('Perimeter_lifeline',3.62,.026,1.18,brass)
for a in (0,math.pi/2,math.pi,math.pi*1.5):
    b=ball('Float_sponson',(3.62*math.cos(a),3.62*math.sin(a),.05),(.47,1.05,.44),teal);b.rotation_euler.z=a
# Port-side wheelhouse, wraparound glazing and a cantilevered cream roof.
box('Wheelhouse_lower',(-2.68,0,1.02),(1.65,2.06,.64),rust,.13)
box('Wheelhouse_body',(-2.68,0,1.79),(1.5,1.88,1.0),cream,.16)
box('Wheelhouse_roof',(-2.68,0,2.38),(1.95,2.2,.20),cream,.12)
for y in (-.58,0,.58):box('Side_window',(-1.914,y,1.94),(.024,.43,.44),glass,.055)
for x in (-3.15,-2.68,-2.21):box('Front_window',(x,-.954,1.94),(.36,.024,.44),glass,.05)
box('Wheelhouse_door',(-3.446,0,1.50),(.025,.65,1.05),dark,.03)
box('Door_glass',(-3.462,0,1.82),(.025,.49,.32),glass,.025)
for z in (.86,1.02,1.18):box('Access_step',(-2.7,-1.27,z),(.8,.4,.07),dark,.025)
cyl('Radio_mast',(-3,.48,2.98),.025,1.2,brass,vertices=8);pipe('Aerial',[(-3.45,.48,3.45),(-2.55,.48,3.45)],.016,dark)
ball('Cabin_beacon',(-2.2,.4,2.59),(.10,.10,.14),light)
# Exposed rear engine, exhausts, vents and a ducted impeller.
box('Engine_cradle',(0,3.01,.95),(1.6,1.52,.5),dark,.12)
box('Engine_block',(0,3.05,1.38),(1.25,1.25,.58),teal,.15)
for i in range(6):box('Cooling_fin',(-.53+i*.21,3.02,1.73),(.07,1.0,.09),cream,.018)
for x in (-.48,.48):
    pipe('Exhaust_stack',[(x,3.42,1.45),(x,3.55,1.95),(x,3.55,2.25)],.075,dark)
    cyl('Exhaust_collar',(x,3.55,2.05),.11,.12,brass)
o=ring('Engine_duct',.56,.13,0,teal);o.location=(0,4.01,.45);o.rotation_euler.x=math.pi/2
cyl('Propeller_hub',(0,4.01,.45),.12,.25,brass,(math.pi/2,0,0))
for a in (0,math.tau/3,2*math.tau/3):
    o=box('Impeller_blade',(.26*math.cos(a),4.01,.45+.26*math.sin(a)),(.48,.045,.13),dark,.03);o.rotation_euler.y=-a
# Intake machinery bends into the open water well.
cyl('Centrifugal_pump',(-1.92,-.65,1.08),.27,.4,teal,(0,math.pi/2,0))
pipe('Intake_riser',[(-2,-.65,1.04),(-1.5,-.65,1.14),(-1.25,-.55,.6),(-1.25,-.55,-.38)],.12,brass)
ring('Intake_filter',.24,.045,-.25,dark,(-1.25,-.55))
# Three gravitic fill stations around the opposite side of the well.
anchors=[]
for i,a in enumerate((-math.pi*5/12,0,math.pi*5/12)):
    x,y=2.9*math.cos(a),2.9*math.sin(a);anchors.append((x,y,1.12))
    cyl('Grav_cradle_'+str(i),(x,y,.88),.61,.23,teal)
    ring('Grav_collar_'+str(i),.57,.055,1.03,brass,(x,y));ring('Grav_field_'+str(i),.44,.022,1.03,light,(x,y))
    pipe('Fill_hose_'+str(i),[(1.6*math.cos(a),1.6*math.sin(a),.9),(2.3*math.cos(a),2.3*math.sin(a),.99),(x,y,1.08)],.063,brass)
    for b in (0,math.pi):
        xx,yy=x+.69*math.cos(a+b),y+.69*math.sin(a+b)
        pipe('Cradle_arm',[(xx,yy,.82),(xx,yy,1.47),(x+.5*math.cos(a+b),y+.5*math.sin(a+b),1.58)],.035,dark)
# High-contrast hull identity marks.
for i in range(4):box('Bow_chevron',(-.5+i*.28,-3.52,.77),(.12,.28,.018),rust,.005)
# Export all ship components, excluding the other Blender scenes.
shipobs=list(scene.objects)
bpy.ops.object.select_all(action='DESELECT')
for o in shipobs:o.select_set(True)
bpy.context.view_layer.objects.active=shipobs[0]
bpy.ops.export_scene.gltf(filepath=OUT+'/public/models/harvester.glb',export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True)
# A reusable pear-shaped water bladder with an antigravity neck and harness.
for o in shipobs:o.hide_set(True);o.hide_render=True;o.select_set(False)
vs=[];fs=[];n=40;profile=[(0,.04),(.12,.16),(.27,.4),(.54,.61),(.91,.72),(1.30,.64),(1.60,.4),(1.73,.02)]
for z,r in profile:
    for i in range(n):a=i/n*math.tau;vs.append((r*math.cos(a),r*math.sin(a),z))
for j in range(len(profile)-1):
    for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
o=mesh('Water_bladder',vs,fs,silk)
for p in o.data.polygons:p.use_smooth=True
for a in (0,math.pi/2,math.pi,math.pi*1.5):
    pipe('Balloon_harness',[(r*math.cos(a),r*math.sin(a),z) for z,r in profile[1:-1]],.016,brass)
ring('Balloon_equator',.721,.018,.91,brass)
ring('Lift_engine',.16,.045,.12,teal);ring('Lift_luminous_core',.165,.016,.11,light)
cyl('Water_valve',(0,0,.02),.065,.10,dark)
balloonobs=[o for o in scene.objects if o not in shipobs]
for o in balloonobs:o.select_set(True)
bpy.context.view_layer.objects.active=balloonobs[0]
bpy.ops.export_scene.gltf(filepath=OUT+'/public/models/water-balloon.glb',export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True)
# Assembly preview: prototypes parented in place, exported files remain at origin.
for o in shipobs:o.hide_set(False);o.hide_render=False
for i,(x,y,z) in enumerate(anchors):
    root=bpy.data.objects.new('Water_cell_station_'+str(i),None);scene.collection.objects.link(root);root.location=(x,y,z)
    for ob in balloonobs:
        clone=ob.copy();clone.data=ob.data;scene.collection.objects.link(clone);clone.parent=root
for ob in balloonobs:ob.hide_render=True;ob.hide_set(True)
scene.world=bpy.data.worlds.new('Harvester_studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.16,.22,.28,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7
bpy.ops.object.camera_add(location=(10,-13,12));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=12;scene.camera=cam
bpy.ops.object.light_add(type='AREA',location=(-5,-6,12));bpy.context.object.data.energy=2400;bpy.context.object.data.size=10
scene.render.resolution_x=1200;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.filepath=OUT+'/blender/harvester-preview.png'
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/blender/harvester.blend',copy=True);bpy.ops.render.render(write_still=True)
result={'exported':['harvester.glb','water-balloon.glb'],'stations':anchors,'preview':scene.render.filepath}
