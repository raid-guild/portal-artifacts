import bpy, math, random, os
from mathutils import Vector
random.seed(19)
OUT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(OUT+'/public/models',exist_ok=True)
# A dedicated scene preserves the existing Blender scene.
scene=bpy.data.scenes.new('Sirocco_Asset_Studio')
bpy.context.window.scene=scene

def material(name, color):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Roughness'].default_value=.85
    return m
sand=material('Sandstone • peach',(0.77,.32,.20)); rocklight=material('Sandstone • gold',(.96,.49,.26)); rockdark=material('Sandstone • mauve',(.34,.27,.43))
trunk=material('Palm • bark',(.25,.29,.30)); leaf=material('Palm • blue spruce',(.13,.32,.34)); leaflit=material('Palm • sage',(.29,.43,.38)); bushmat=material('Shrub • dusty sage',(.30,.40,.38)); shipmat=material('Airship • ivory silk',(.95,.65,.43)); metal=material('Airship • bronze',(.36,.25,.29)); glow=material('Airship • windows',(.62,.95,.86))
assets={}
def mesh(name,vs,fs,mat):
    me=bpy.data.meshes.new(name); me.from_pydata(vs,[],fs); me.update(); ob=bpy.data.objects.new(name,me); scene.collection.objects.link(ob); ob.data.materials.append(mat); return ob

def cone(name,r1,r2,depth,loc,mat,verts=10):
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r1,radius2=r2,depth=depth,location=loc); o=bpy.context.object; o.name=name; o.data.materials.append(mat); return o

def sphere(name,loc,scale,mat,segments=24,rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc); o=bpy.context.object; o.name=name; o.scale=scale; o.data.materials.append(mat); return o

def torus(name,major,minor,z,mat):
    bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=6,location=(0,0,z),major_radius=major,minor_radius=minor); o=bpy.context.object; o.name=name; o.data.materials.append(mat); return o

def export(name,obs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in obs:o.select_set(True)
    bpy.context.view_layer.objects.active=obs[0]
    bpy.ops.export_scene.gltf(filepath=OUT+'/public/models/'+name+'.glb',export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True,export_yup=True)
    assets[name]=[o.name for o in obs]
    for o in obs:o.hide_set(True)

# The shore is a continuous annulus, leaving the center for the runtime shader.
vs=[]; fs=[]; n=128
for ring in range(4):
    for i in range(n):
        a=i/n*math.tau; wob=1+.035*math.sin(a*5)+.018*math.cos(a*9)
        r=[.99,1.04,1.16,1.25][ring]*wob; z=[-.04,.16,.13,-.08][ring]
        vs.append((r*12*math.cos(a),r*8*math.sin(a),z))
for k in range(3):
    for i in range(n): j=k*n+i; q=k*n+(i+1)%n; fs.append((j,q,q+n,j+n))
export('basin',[mesh('Oasis_Shore',vs,fs,sand)])

# Curving palm trunks and individual folded, tapering fronds.
for variant,height in enumerate([3.5,4.5,5.7]):
    obs=[]; vs=[];fs=[]; rings=12; sides=8
    for j in range(rings):
        t=j/(rings-1); x=.32*t*t; rad=.14*(1-.45*t)*(1+.08*math.sin(j*3))
        for i in range(sides):
            a=i/sides*math.tau; vs.append((x+rad*math.cos(a),rad*math.sin(a),height*t))
    for j in range(rings-1):
        for i in range(sides):a=j*sides+i;b=j*sides+(i+1)%sides;fs.append((a,b,b+sides,a+sides))
    obs.append(mesh('Palm_Trunk_'+str(variant),vs,fs,trunk))
    vs=[];fs=[]
    for f in range(11):
        angle=f*math.tau/11+variant*.4; length=1.6+random.random()*.65; start=len(vs)
        for j in range(10):
            t=j/9; r=length*t; z=height+.62*math.sin(t*math.pi*.95)-.47*t*t
            width=.23*math.sin(math.pi*t)**.65*(1-.4*t)
            # Serrated contours evoke leaflets without a heavy tree mesh.
            width*=1 if j%2 else .72
            for side in [-1,0,1]:
                vs.append((.32+math.cos(angle)*r-math.sin(angle)*width*side,math.sin(angle)*r+math.cos(angle)*width*side,z+(.065 if side==0 else 0)))
        for j in range(9):
            a=start+j*3; fs.extend([(a,a+3,a+4,a+1),(a+1,a+4,a+5,a+2)])
    crown=mesh('Palm_Crown_'+str(variant),vs,fs,leaf);crown.data.materials.append(leaflit)
    for p in crown.data.polygons:p.material_index=1 if p.index%5==0 else 0
    obs.append(crown);export('palm-'+str(variant),obs)

for variant in range(2):
    obs=[]
    for i in range(7):
        a=i*2.4; r=.55*math.sqrt(i/7)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1,location=(r*math.cos(a),r*math.sin(a),.3+random.random()*.16))
        o=bpy.context.object;o.name='Bush_Clump';o.scale=(.48,.4,.36+random.random()*.17);o.data.materials.append(bushmat if i%3 else leaflit);sub=o.modifiers.new('Soft foliage masses','SUBSURF');sub.levels=1
        for p in o.data.polygons:p.use_smooth=True
        obs.append(o)
    export('bush-'+str(variant),obs)

# Rock towers: uneven radial profiles create carved fins rather than generic cones.
for kind in ['spire','mesa','boulder']:
    obs=[]
    count=9 if kind=='spire' else 3
    for part in range(count):
        if kind=='spire':
            h=[25,17,12,9,14,7,6,10,5][part];cx=[0,-3,-6,5,3,7,-8,-1,9][part];cy=[0,1,2,0,3,3,-1,-4,0][part];base=h*.24
            profile=[(0,1.65),(.07,1),(.18,.63),(.4,.39),(.67,.25),(.91,.11),(1,.012)]
        elif kind=='mesa':h=3+part*1.4;cx=part*1.4;cy=part*.3;base=3;profile=[(0,1.5),(.15,1),(.78,.65),(1,.57)]
        else:h=.6+part*.3;cx=part*.5;cy=part*.2;base=.8;profile=[(0,.9),(.3,1),(.8,.7),(1,.3)]
        vs=[];fs=[];sides=9;phase=random.random()*2
        for k,(z,r) in enumerate(profile):
            for j in range(sides):
                a=j/sides*math.tau+phase; rough=1+.19*math.sin(j*7+part)
                vs.append((cx+math.cos(a)*base*r*rough+.06*h*z,cy+math.sin(a)*base*r*rough,h*z))
        for k in range(len(profile)-1):
            for j in range(sides):a=k*sides+j;b=k*sides+(j+1)%sides;fs.append((a,b,b+sides,a+sides))
        fs.append(tuple(range((len(profile)-1)*sides,len(profile)*sides)))
        o=mesh(kind+'_'+str(part),vs,fs,rocklight);o.data.materials.append(sand);o.data.materials.append(rockdark)
        for p in o.data.polygons:p.material_index=2 if p.normal.x>.2 else (1 if p.normal.y>.4 else 0)
        obs.append(o)
    export(kind,obs)

vs=[];fs=[]
for i in range(19):
    a=i*2.399; length=1.2+(i%4)*.23;start=len(vs)
    for j in range(8):
        t=j/7;r=length*t*.83;z=length*(math.sin(t*1.2)*.9);w=.19*math.sin(math.pi*t)**.6
        for s in [-1,0,1]:vs.append((math.cos(a)*r-math.sin(a)*w*s,math.sin(a)*r+math.cos(a)*w*s,z+(.09 if s==0 else 0)))
    for j in range(7):a0=start+j*3;fs.extend([(a0,a0+3,a0+4,a0+1),(a0+1,a0+4,a0+5,a0+2)])
export('agave',[mesh('Agave_Hero',vs,fs,leaf)])

obs=[sphere('Airship_Envelope',(0,0,0),(4.1,4.1,4.4),shipmat,64,32)]
for o in obs:
    for p in o.data.polygons:p.use_smooth=True
for z in [-3.6,-2.9,-2,-.9,.4,1.8,3]:
    r=4.1*math.sqrt(1-(z/4.4)**2);obs.append(torus('Airship_Latitude',r+.01,.027,z,metal))
obs.append(torus('Airship_Equatorial_Gallery',4.15,.09,-1.45,metal))
obs.append(cone('Airship_Keel',.62,1.05,.48,(0,0,-4.4),metal,32))
obs.append(sphere('Airship_Gondola',(0,0,-4.7),(.85,.48,.24),metal,24,8))
for i in range(10):
    a=i/10*math.tau;obs.append(sphere('Airship_Lantern',(math.cos(a)*.69,math.sin(a)*.41,-4.68),(.075,.075,.075),glow,8,4))
for x in [-1,1]:
    o=cone('Airship_Suspension',.035,.035,.8,(x*.55,0,-4.12),metal,6);obs.append(o)
export('airship',obs)
# Keep the editable asset library with a simple studio camera.
for o in scene.objects:o.hide_set(False);o.hide_render=True
for name in assets['palm-2']:bpy.data.objects[name].hide_render=False
bpy.ops.object.camera_add(location=(10,-15,8));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,2.8))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=9;scene.camera=cam
bpy.ops.object.light_add(type='AREA',location=(-4,-6,10));bpy.context.object.data.energy=1800;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=7
scene.world=bpy.data.worlds.new('Studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.25,.29,.38,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7
scene.render.resolution_x=700;scene.render.resolution_y=700;scene.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/blender/oasis-assets.blend',copy=True)
scene.render.filepath=OUT+'/blender/palm-preview.png';bpy.ops.render.render(write_still=True)
result={'assets':assets,'output':OUT,'preview':scene.render.filepath}
