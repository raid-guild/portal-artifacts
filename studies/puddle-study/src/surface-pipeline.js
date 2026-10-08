import {createParticleSurface} from './particle-surface.js';

// One worker owns the expensive scalar-field builds. The main thread always
// renders the most recent completed geometry, while pending jobs coalesce.
const defaultWorker=()=>new Worker(new URL('./particle-surface-worker.js',import.meta.url),{type:'module'});
export function createSurfacePipeline({createWorker=typeof Worker==='undefined'?null:defaultWorker}={}){
  const surfaces=new Map(),pending=new Map();
  let worker=null,disabled=!createWorker,inFlight=null,generation=0,nextId=1,nextSurfaceId=1,bodyStreak=0;
  const registeredSolids=new Set();
  const stats={completed:0,bodyCompleted:0,discarded:0,failed:0,buildMs:0,lastAgeMs:0,bodyAgeMs:0,bodyBuildMs:0};
  function fallback(){
    if(disabled)return;
    disabled=true;worker?.terminate();worker=null;
    if(inFlight&&inFlight.generation===generation){const s=surfaces.get(inFlight.surfaceId);
      if(s)s.sync.update(inFlight.particles,inFlight.originalColliders,inFlight.radius,{maskTerrain:inFlight.maskTerrain});}
    inFlight=null;
    for(const [id,job] of pending){const s=surfaces.get(id);if(s)s.sync.update(job.particles,job.originalColliders,job.radius,{maskTerrain:job.maskTerrain});}
    for(const s of surfaces.values()){s.completedCentroid=null;s.completedPosition=null;}
    pending.clear();
  }
  if(!disabled){
    try{
      worker=createWorker();
      worker.onmessage=({data})=>{
        if(!inFlight||data.id!==inFlight.id)return;
        const job=inFlight;
        if(data.error){stats.failed++;fallback();return;}
        inFlight=null;
        if(data.generation!==generation||!surfaces.has(data.surfaceId))stats.discarded++;
        else{
          const s=surfaces.get(data.surfaceId),mesh=s.mesh;
          const pa=mesh.geometry.attributes.position,na=mesh.geometry.attributes.normal;
          pa.array.set(data.positions,0);na.array.set(data.normals,0);
          pa.clearUpdateRanges();na.clearUpdateRanges();
          pa.addUpdateRange(0,data.count*3);na.addUpdateRange(0,data.count*3);
          pa.needsUpdate=true;na.needsUpdate=true;
          mesh.count=data.count;mesh.geometry.setDrawRange(0,data.count);
          mesh.position.fromArray(data.position);mesh.scale.fromArray(data.scale);
          s.completedCentroid=job.centroid;s.completedPosition=data.position;s.completedAt=performance.now();
          stats.completed++;stats.buildMs=data.buildMs;stats.lastAgeMs=s.completedAt-job.queuedAt;
          if(s.priority===0){stats.bodyCompleted++;stats.bodyAgeMs=stats.lastAgeMs;stats.bodyBuildMs=data.buildMs;}
        }
        dispatch();
      };
      worker.onerror=()=>{stats.failed++;fallback();};
      worker.onmessageerror=()=>{stats.failed++;fallback();};
    }catch{fallback();}
  }
  function dispatch(){
    if(disabled||inFlight||!pending.size)return;
    const jobs=[...pending.values()].sort((a,b)=>a.priority-b.priority||a.queuedAt-b.queuedAt);
    // The living body wins normally; supply still gets a turn after four body builds.
    const chosen=bodyStreak>=4&&jobs.some(j=>j.priority>0)?jobs.find(j=>j.priority>0):jobs[0];
    bodyStreak=chosen.priority===0?bodyStreak+1:0;
    pending.delete(chosen.surfaceId);inFlight=chosen;
    try{
      worker.postMessage({type:'build',id:chosen.id,generation:chosen.generation,surfaceId:chosen.surfaceId,
        resolution:chosen.resolution,coords:chosen.coords,colliders:chosen.colliders,
        radius:chosen.radius,maskTerrain:chosen.maskTerrain,sentAt:performance.now()},[chosen.coords.buffer]);
    }catch{stats.failed++;fallback();}
  }
  function create(material,resolution=48,{priority=1}={}){
    const sync=createParticleSurface(material,resolution),surfaceId=nextSurfaceId++;
    const s={mesh:sync.mesh,sync,completedCentroid:null,completedPosition:null,completedAt:0,priority,
      update(particles,colliders,radius=.067,{maskTerrain=true}={}){
        if(disabled){sync.update(particles,colliders,radius,{maskTerrain});return;}
        const workerColliders=colliders.map(c=>c.type==='editor-solid-mesh'?{type:c.type,revision:c.revision}:c);
        const colliderKey=JSON.stringify(workerColliders);
        const prev=s.previous;
        if(prev&&prev.radius===radius&&prev.maskTerrain===maskTerrain&&prev.colliderKey===colliderKey&&
          prev.particles.length===particles.length&&particles.every((p,i)=>p===prev.particles[i]&&
            p.x===prev.coords[i*3]&&p.y===prev.coords[i*3+1]&&p.z===prev.coords[i*3+2]))return;
        const coords=new Float64Array(particles.length*3);let x=0,y=0,z=0;
        for(let i=0;i<particles.length;i++){const p=particles[i];coords[i*3]=p.x;coords[i*3+1]=p.y;coords[i*3+2]=p.z;x+=p.x;y+=p.y;z+=p.z;}
        const n=particles.length||1;
        s.previous={radius,maskTerrain,colliderKey,particles:[...particles],coords:coords.slice()};
        for(const c of colliders)if(c.type==='editor-solid-mesh'&&!registeredSolids.has(c.revision)){
          registeredSolids.add(c.revision);
          const vertices=c.vertices.slice(),indices=c.indices.slice();
          try{worker.postMessage({type:'register-solid',revision:c.revision,vertices,indices},
            [vertices.buffer,indices.buffer]);}catch{stats.failed++;fallback();return;}
        }
        pending.set(surfaceId,{id:nextId++,generation,surfaceId,resolution,coords,colliders:workerColliders,
          originalColliders:colliders,radius,maskTerrain,
          priority,queuedAt:performance.now(),centroid:{x:x/n,y:y/n,z:z/n},particles});
        dispatch();
      },
      dispose(){pending.delete(surfaceId);surfaces.delete(surfaceId);sync.mesh.geometry.dispose();}
    };
    surfaces.set(surfaceId,s);return s;
  }
  function invalidate(){generation++;pending.clear();bodyStreak=0;registeredSolids.clear();
    if(worker&&!disabled)try{worker.postMessage({type:'clear-solids'});}catch{stats.failed++;fallback();}
    for(const s of surfaces.values()){
    s.previous=null;s.completedCentroid=null;s.completedPosition=null;s.mesh.count=0;s.mesh.geometry.setDrawRange(0,0);
  }}
  function dispose(){generation++;pending.clear();worker?.terminate();worker=null;for(const s of [...surfaces.values()])s.dispose();surfaces.clear();disabled=true;}
  return {create,invalidate,dispose,stats,get workerEnabled(){return !disabled;},get pendingCount(){return pending.size+(inFlight?1:0);}};
}
