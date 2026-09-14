"""FIELD Second Look: faceted, stationary silhouette. Front is Blender -Y."""
import bpy, math, os
from mathutils import Vector
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Second_Look');bpy.context.window.scene=scene
parent=bpy.data.objects.new('Goatman',None);scene.collection.objects.link(parent)
def material(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=.98
 return m
skin=material('Ash_charcoal',(.043,.047,.039));horn=material('Horn_charcoal',(.032,.034,.028));void=material('Unlit_sockets',(.002,.003,.002))
def mesh(name,verts,faces,mat=skin):
 d=bpy.data.meshes.new(name);d.from_pydata(verts,[],faces);d.materials.append(mat)
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.parent=parent;return o
# Elliptical anatomical sections form connected torso and skull silhouettes.
def rings(name,sections,n=12,mat=skin):
 v=[];f=[]
 for j,(x,y,z,rx,ry) in enumerate(sections):
  for i in range(n):
   a=math.tau*i/n;v.append((x+rx*math.cos(a),y+ry*math.sin(a),z))
 for j in range(len(sections)-1):
  for i in range(n):a=j*n+i;b=j*n+(i+1)%n;f.extend([(a,b,a+n),(b,b+n,a+n)])
 f.extend([tuple(reversed(range(n))),tuple((len(sections)-1)*n+i for i in range(n))]);return mesh(name,v,f,mat)
def tube(name,points,radii,n=8,mat=skin):
 v=[];f=[]
 for j,p in enumerate(points):
  p=Vector(p);t=Vector(points[min(j+1,len(points)-1)])-Vector(points[max(0,j-1)])
  t.normalize();u=t.cross(Vector((0,1,0))).normalized();w=t.cross(u).normalized()
  for i in range(n):v.append(tuple(p+radii[j]*(u*math.cos(i*math.tau/n)+w*math.sin(i*math.tau/n))))
 for j in range(len(points)-1):
  for i in range(n):a=j*n+i;b=j*n+(i+1)%n;f.append((a,b,b+n,a+n))
 f.extend([tuple(reversed(range(n))),tuple((len(points)-1)*n+i for i in range(n))]);return mesh(name,v,f,mat)
rings('Ribcage_and_pelvis',[(0,.04,.96,.17,.13),(0,.035,1.13,.23,.15),(0,.035,1.28,.16,.11),(0,.015,1.45,.21,.13),(0,.025,1.65,.32,.16),(0,.07,1.79,.29,.13),(0,.09,1.91,.12,.10)])
rings('Bent_neck',[(0,.09,1.77,.13,.12),(0,.025,1.96,.12,.11),(0,-.03,2.06,.115,.10)])
rings('Long_caprine_skull',[(0,-.235,1.87,.045,.055),(0,-.225,1.96,.065,.105),(0,-.18,2.07,.09,.14),(0,-.07,2.19,.18,.125),(0,-.025,2.31,.145,.09),(0,.005,2.35,.09,.07)],10)
for s in [-1,1]:
 tube('Upper_arm',[(s*.28,.06,1.75),(s*.37,.035,1.58),(s*.41,-.015,1.36)],[.125,.105,.064])
 tube('Forearm',[(s*.41,-.015,1.36),(s*.455,-.065,1.16),(s*.49,-.08,.99)],[.074,.068,.038])
 rings('Long_hand',[(s*.50,-.08,.83,.052,.035),(s*.495,-.08,.98,.064,.043)],8)
 for i in range(4):
  x=s*(.456+i*.027);z=.855-abs(i-1.5)*.01
  tube('Tapered_finger',[(x,-.085,z),(x+s*.012,-.11,z-.12),(x+s*.006,-.145,z-.19)],[.014,.011,.003],6)
 tube('Thumb',[(s*.45,-.08,.95),(s*.413,-.12,.88),(s*.42,-.17,.84)],[.022,.016,.004],6)
 tube('Thigh',[(s*.14,.04,1.09),(s*.20,-.025,.83),(s*.19,-.045,.61)],[.13,.12,.068])
 tube('Angled_shin',[(s*.19,-.045,.61),(s*.21,.10,.33),(s*.205,.10,.22)],[.07,.052,.039])
 tube('Pastern',[(s*.205,.10,.26),(s*.20,-.005,.10)],[.04,.055])
 for split in [-1,1]:rings('Cloven_hoof',[(s*.20+split*.037,-.05,.025,.033,.115),(s*.20+split*.033,-.03,.12,.033,.085),(s*.20+split*.027,.01,.16,.027,.052)],8,horn)
 tube('Swept_horn',[(s*.115,.01,2.29),(s*.19,.035,2.43),(s*.29,.07,2.59),(s*.41,.105,2.70),(s*.51,.08,2.71),(s*.58,.025,2.64)],[.068,.061,.049,.035,.02,.001],10,horn)
 mesh('Pointed_ear',[(s*.14,-.015,2.19),(s*.35,.015,2.28),(s*.26,-.025,2.13),(s*.18,.06,2.16)],[(0,1,2),(0,3,1),(1,3,2),(2,3,0)])
 # Recessed black almond sockets beneath a heavy ridge: no luminous eyes.
 mesh('Empty_socket',[(s*.075,-.177,2.17),(s*.158,-.139,2.215),(s*.135,-.159,2.135),(s*.079,-.18,2.13)],[(0,1,2,3)],void)
 tube('Brow_ridge',[(s*.067,-.166,2.20),(s*.14,-.142,2.24),(s*.185,-.09,2.21)],[.025,.028,.012],6)
mesh('Nasal_void',[(-.025,-.28,1.98),(0,-.3,1.925),(.025,-.28,1.98),(0,-.295,2.00)],[(0,1,2,3)],void)
# Export only this scene, with no lights/camera and no animation.
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/goatman.glb',export_format='GLB',use_active_scene=True,export_animations=False)
# A neutral studio camera/light setup is retained for inspection in Blender.
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3,-7,2.7));camera=bpy.context.object;aim(camera,(0,0,1.38));camera.data.type='ORTHO';camera.data.ortho_scale=3.2;scene.camera=camera
for loc,power,size in [((-3,-4,5),700,4),((3,1,4),900,3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;aim(o,(0,0,1.4))
scene.world=bpy.data.worlds.new('Second_Look_studio');scene.world.color=(.10,.11,.09)
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=650;scene.render.resolution_y=850;scene.render.resolution_percentage=100
scene.render.filepath=root+'/outputs/goatman-study.png'
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-goatman.blend',copy=True)
bpy.ops.render.render(write_still=True)
result={'asset_bytes':os.path.getsize(root+'/dist/assets/goatman.glb'),'triangles':sum(len(p.vertices)-2 for o in parent.children if o.type=='MESH' for p in o.data.polygons),'preview':scene.render.filepath}
