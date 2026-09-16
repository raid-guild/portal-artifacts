import bpy, math, json
from pathlib import Path
out=Path(__file__).resolve().parents[1]
scene=bpy.data.scenes.new('Lunar Republic — asset workshop')
colors={'ivory':(0.91,0.8,0.59,1),'teal':(0.19,0.46,0.45,1),'coral':(0.76,0.3,0.19,1),'ink':(0.08,0.16,0.2,1)}
mats={}
for name,c in colors.items():
 m=bpy.data.materials.new('LR '+name);m.diffuse_color=c;mats[name]=m
objects=[]
def add(name,verts,faces,color):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
 obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj);obj.data.materials.append(mats[color]);objects.append(obj);return obj
def ring(name,x,y,z,r,inner,depth,color):
 verts=[]
 for yy,rr in [(y-depth/2,r),(y+depth/2,r),(y-depth/2,inner),(y+depth/2,inner)]:
  for i in range(16):
   a=i*math.tau/16;verts.append((x+math.cos(a)*rr,yy,z+math.sin(a)*rr))
 faces=[]
 for i in range(16):
  j=(i+1)%16
  faces.extend([(i,j,16+j,16+i),(32+i,48+i,48+j,32+j),(i,32+i,32+j,j),(16+i,16+j,48+j,48+i)])
 return add(name,verts,faces,color)
def box(name,x,y,z,w,d,h,color):
 verts=[(x+sx*w/2,y+sy*d/2,z+sz*h/2) for sx,sy,sz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
 return add(name,verts,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],color)
for i in range(4):
 ring('Accelerator collar '+str(i),0,22+i*1.4,3,3.35,2.65,.65,'ivory' if i%2 else 'coral')
 for x in [-3.4,3.4]:box('Collar support',x,22+i*1.4,1.4,.7,.8,2.8,'teal')
for x in [-2.7,2.7]:box('Magnetic guide',x,24,3,.35,9,.35,'ink')
box('Terminal bed',0,24,.1,8,9,.7,'teal')
for x in [-4,4]:
 box('Terminal wing',x,24,3,.5,8,1.3,'ivory')
 for y in [21,23,25,27]:box('Cooling fin',x*1.13,y,3,.7,.18,2.2,'coral')
# Compact excavation head, intentionally distinct from the launcher.
box('Excavator body',-22,-7,1.5,4,6,2,'teal')
box('Excavator canopy',-22,-6,3.2,3,2.5,1.5,'ivory')
for x in [-24,-20]:box('Excavator tread',x,-7,.65,.9,7,1.3,'ink')
ring('Excavation wheel',-22,-2,1.5,2.1,1.2,.9,'coral')
for i in range(12):
 a=i*math.tau/12;box('Excavator tooth',-22+math.cos(a)*2,-2,1.5+math.sin(a)*2,.5,1.3,.5,'ivory')
# Save a reusable Blender source without replacing the user's open file.

meshes=[]
for obj in objects:
 mesh=obj.data;mesh.calc_loop_triangles();pos=[]
 for tri in mesh.loop_triangles:
  for idx in tri.vertices:
   v=obj.matrix_world@mesh.vertices[idx].co;pos.extend([round(v.x,4),round(v.z,4),round(-v.y,4)])
 c=obj.data.materials[0].diffuse_color
 meshes.append({'name':obj.name,'positions':pos,'color':(round(c[0]*255)<<16)+(round(c[1]*255)<<8)+round(c[2]*255)})
(out/'dist/assets/catapult.json').write_text(json.dumps(meshes,separators=(',',':')))
result={'meshes':len(meshes),'asset':str(out/'dist/assets/catapult.json'),'source':str(out/'authoring/catapult.blend')}

bpy.context.window.scene=scene
bpy.ops.wm.save_as_mainfile(filepath=str(out/'authoring/catapult.blend'))
