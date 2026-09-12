import bpy, json, struct, os
from mathutils import Vector
OUT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scene=bpy.data.scenes['Sirocco_Asset_Studio'];bpy.context.window.scene=scene
layout={'basin':(0,22,0),'palm-0':(-18,0,0),'palm-1':(-11,0,0),'palm-2':(-4,0,0),'bush-0':(-17,-8,0),'bush-1':(-11,-8,0),'spire':(32,24,0),'mesa':(19,0,0),'boulder':(9,-8,0),'agave':(0,-8,0),'airship':(-25,26,10)}
for key,xyz in layout.items():
    path=OUT+'/public/models/'+key+'.glb';b=open(path,'rb').read();n=struct.unpack_from('<I',b,12)[0];doc=json.loads(b[20:20+n])
    names=[x.get('name') for x in doc['nodes']]
    col=bpy.data.collections.new('KIT • '+key);scene.collection.children.link(col)
    parent=bpy.data.objects.new('Asset • '+key,None);col.objects.link(parent);parent.location=xyz
    for name in names:
        ob=scene.objects.get(name)
        if not ob or ob.type!='MESH':continue
        ob.hide_set(False);ob.hide_render=False
        for previous in list(ob.users_collection):previous.objects.unlink(ob)
        col.objects.link(ob);ob.parent=parent
scene.camera.location=(75,-90,75);scene.camera.rotation_euler=(Vector((1,15,8))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.ortho_scale=95
scene.render.resolution_x=1400;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.filepath=OUT+'/blender/asset-kit.png'
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/blender/oasis-assets.blend',copy=True)
bpy.ops.render.render(write_still=True)
result={'saved':OUT+'/blender/oasis-assets.blend','preview':scene.render.filepath}
