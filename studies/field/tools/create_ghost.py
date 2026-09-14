import bpy, math, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes.new('FIELD_Draped_Shadow');bpy.context.window.scene=scene
parent=bpy.data.objects.new('SeatedShadow_Draped',None);scene.collection.objects.link(parent)
mat=bpy.data.materials.new('Charcoal_robe');mat.diffuse_color=(.025,.029,.033,1);mat.use_nodes=True
bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(.025,.029,.033,1);bs.inputs['Roughness'].default_value=.98
noise=mat.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=150
bump=mat.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.008
mat.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);mat.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
def mesh(name,verts,faces):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.materials.append(mat)
 o=bpy.data.objects.new(name,data);scene.collection.objects.link(o);o.parent=parent
 for p in data.polygons:p.use_smooth=True
 return o
# One continuous robe, widening over the seated knees and falling to an uneven hem.
verts=[];faces=[];n=64
rings=[(.065,-.22,.37,.43),(.15,-.22,.36,.42),(.32,-.23,.34,.40),(.48,-.23,.34,.37),(.55,-.20,.33,.32),(.63,-.10,.29,.24),(.76,-.01,.25,.19),(.92,.025,.30,.20),(1.04,.02,.32,.18),(1.13,.02,.21,.14)]
for j,(z,y,rx,ry) in enumerate(rings):
 for i in range(n):
  a=i*math.tau/n;fold=(.015*math.cos(12*a+j*.16)+.009*math.sin(19*a))*(1 if j<6 else .5)
  verts.append(((rx+fold)*math.cos(a),y+(ry+fold)*math.sin(a),z+(.022*math.sin(7*a) if j==0 else .005*math.cos(8*a))))
for j in range(len(rings)-1):
 for i in range(n):a=j*n+i;b=j*n+(i+1)%n;faces.append((a,b,b+n,a+n))
mesh('Continuous_folded_robe',verts,faces)
# Long sleeves bend inward and rest together on the lap.
for side in [-1,1]:
 verts=[];faces=[]
 for j,(x,y,z,r) in enumerate([(.265,.02,1.00,.13),(.31,-.055,.84,.12),(.30,-.19,.69,.115),(.23,-.29,.62,.10),(.12,-.34,.60,.075)]):
  for i in range(32):
   a=i*math.tau/32;rr=r+.007*math.sin(a*7+j);verts.append((side*x+rr*math.cos(a),y+rr*.7*math.sin(a),z+rr*.65*math.sin(a)))
 for j in range(4):
  for i in range(32):a=j*32+i;b=j*32+(i+1)%32;faces.append((a,b,b+32,a+32))
 mesh('Folded_sleeve',verts,faces)
# Hood opening, deep crown and an inner lining: no head or face.
verts=[];faces=[];n=64
for j,(y,rx,rz,zc) in enumerate([(-.24,.215,.30,1.31),(-.21,.235,.325,1.31),(-.10,.255,.33,1.32),(.045,.24,.31,1.32),(.16,.15,.24,1.32),(.205,.025,.04,1.33)]):
 for i in range(n):
  a=i*math.tau/n;fold=.004*math.sin(a*9+j)
  verts.append(((rx+fold)*math.cos(a)*(1-.13*max(0,math.sin(a))),y,zc+(rz+fold)*math.sin(a)))
for j in range(5):
 for i in range(n):a=j*n+i;b=j*n+(i+1)%n;faces.append((a,b,b+n,a+n))
mesh('Deep_empty_hood',verts,faces)
# Recess lies behind the opening, leaving a deep, uninterrupted void.
verts=[(0,.16,1.31)]+[(.18*math.cos(i*math.tau/64),.155,1.31+.26*math.sin(i*math.tau/64)) for i in range(64)]
mesh('Hood_dark_lining',verts,[(0,i+1,(i+1)%64+1) for i in range(64)])
bpy.ops.export_scene.gltf(filepath=root+'/dist/assets/seated-shadow.glb',export_format='GLB',use_active_scene=True,export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=root+'/outputs/FIELD-seated-shadow.blend',copy=True)
result={'scene':scene.name,'bytes':os.path.getsize(root+'/dist/assets/seated-shadow.glb')}
