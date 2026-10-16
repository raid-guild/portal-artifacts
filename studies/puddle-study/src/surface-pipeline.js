import {createParticleSurface} from './particle-surface.js';

// One worker owns the expensive scalar-field builds. The main thread always
// renders the most recent completed geometry, while pending jobs coalesce.
const defaultWorker=()=>new Worker(new URL('./particle-surface-worker.js',import.meta.url),{type:'module'});
export function createSurfacePipeline({createWorker=typeof Worker==='undefined'?null:defaultWorker,
  now=()=>performance.now()}={}){
  const surfaces=new Map(),pending=new Map();
  let worker=null,disabled=!createWorker,inFlight=null,generation=0,nextId=1,nextSurfaceId=1,bodyStreak=0;
  const registeredSolids=new Set();
  const stats={completed:0,bodyCompleted:0,discarded:0,failed:0,buildMs:0,lastAgeMs:0,
    bodyAgeMs:0,bodyBuildMs:0,bodyFallbacks:0,bodyFallbackMs:0};
  function showGeometry(s,source,count,position,scale){
    const mesh=s.mesh,pa=mesh.geometry.attributes.position,na=mesh.geometry.attributes.normal;
    pa.array.set(source.geometry.attributes.position.array.subarray(0,count*3),0);
    na.array.set(source.geometry.attributes.normal.array.subarray(0,count*3),0);
    pa.clearUpdateRanges();na.clearUpdateRanges();
    pa.addUpdateRange(0,count*3);na.addUpdateRange(0,count*3);
    pa.needsUpdate=true;na.needsUpdate=true;
    mesh.count=count;mesh.geometry.setDrawRange(0,count);
    mesh.position.fromArray(position);mesh.scale.fromArray(scale);
  }
  const poseTolerance=radius=>Math.max(.18,radius*2.7);
  const poseDistance=(a,b)=>a&&b?Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z):0;
  function refreshStaleBody(s,particles,colliders,radius,maskTerrain,centroid,snapshotAt,
    displaced=false){
    if(s.priority!==0||!particles.length||!s.freshnessSurface||
      s.displayedSeq===s.nextSeq)return false;
    const age=now()-(s.lastWorkerSnapshotAt??s.firstQueuedAt??snapshotAt);
    if((age<100&&!displaced)||now()-s.lastFallbackAt<40)return false;
    const started=now();
    s.freshnessSurface.update(particles,colliders,radius,{maskTerrain});
    const fresh=s.freshnessSurface.mesh;
    showGeometry(s,fresh,fresh.count,fresh.position.toArray(),fresh.scale.toArray());
    s.completedCentroid=centroid;s.completedPosition=fresh.position.toArray();
    s.completedAt=now();s.displayedSnapshotAt=snapshotAt;s.displayedSeq=s.nextSeq;
    s.lastFallbackAt=now();stats.bodyFallbacks++;stats.bodyFallbackMs=now()-started;
    return true;
  }
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
        const s=surfaces.get(data.surfaceId);
        const displaced=s?.priority===0&&job.seq<s.nextSeq&&s.previous&&
          poseDistance(job.centroid,s.previous.centroid)>poseTolerance(job.radius);
        if(data.generation===generation&&displaced){
          const latest=s.previous;
          refreshStaleBody(s,latest.particles,latest.colliders,latest.radius,
            latest.maskTerrain,latest.centroid,latest.snapshotAt,true);
        }
        if(data.generation!==generation||!s||job.seq<s.displayedSeq||displaced)stats.discarded++;
        else{
          const mesh=s.mesh;
          const pa=mesh.geometry.attributes.position,na=mesh.geometry.attributes.normal;
          pa.array.set(data.positions,0);na.array.set(data.normals,0);
          pa.clearUpdateRanges();na.clearUpdateRanges();
          pa.addUpdateRange(0,data.count*3);na.addUpdateRange(0,data.count*3);
          pa.needsUpdate=true;na.needsUpdate=true;
          mesh.count=data.count;mesh.geometry.setDrawRange(0,data.count);
          mesh.position.fromArray(data.position);mesh.scale.fromArray(data.scale);
          s.completedCentroid=job.centroid;s.completedPosition=data.position;s.completedAt=now();
          s.displayedSeq=job.seq;s.displayedSnapshotAt=job.queuedAt;
          if(s.priority===0)s.lastWorkerSnapshotAt=job.queuedAt;
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
        radius:chosen.radius,maskTerrain:chosen.maskTerrain,sentAt:now()},[chosen.coords.buffer]);
    }catch{stats.failed++;fallback();}
  }
  function create(material,resolution=48,{priority=1}={}){
    const sync=createParticleSurface(material,resolution),surfaceId=nextSurfaceId++;
    const freshnessSurface=priority===0&&resolution>28?createParticleSurface(material,28):null;
    const s={mesh:sync.mesh,sync,freshnessSurface,completedCentroid:null,completedPosition:null,
      completedAt:0,displayedSnapshotAt:null,lastWorkerSnapshotAt:null,
      displayedSeq:0,nextSeq:0,firstQueuedAt:null,
      lastFallbackAt:-Infinity,priority,
      update(particles,colliders,radius=.067,{maskTerrain=true}={}){
        if(disabled){sync.update(particles,colliders,radius,{maskTerrain});return;}
        const workerColliders=colliders.map(c=>c.type==='editor-solid-mesh'?{type:c.type,revision:c.revision}:c);
        const colliderKey=JSON.stringify(workerColliders);
        const prev=s.previous;
        if(prev&&prev.radius===radius&&prev.maskTerrain===maskTerrain&&prev.colliderKey===colliderKey&&
          prev.particles.length===particles.length&&particles.every((p,i)=>p===prev.particles[i]&&
            p.x===prev.coords[i*3]&&p.y===prev.coords[i*3+1]&&p.z===prev.coords[i*3+2])){
          refreshStaleBody(s,particles,colliders,radius,maskTerrain,prev.centroid,prev.snapshotAt,
            poseDistance(s.completedCentroid,prev.centroid)>poseTolerance(radius));
          return;
        }
        const coords=new Float64Array(particles.length*3);let x=0,y=0,z=0;
        for(let i=0;i<particles.length;i++){const p=particles[i];coords[i*3]=p.x;coords[i*3+1]=p.y;coords[i*3+2]=p.z;x+=p.x;y+=p.y;z+=p.z;}
        const n=particles.length||1;
        const snapshotAt=now(),centroid={x:x/n,y:y/n,z:z/n};
        s.previous={radius,maskTerrain,colliderKey,colliders,particles:[...particles],coords:coords.slice(),
          centroid,snapshotAt};
        s.nextSeq++;
        if(s.firstQueuedAt===null)s.firstQueuedAt=snapshotAt;
        for(const c of colliders)if(c.type==='editor-solid-mesh'&&!registeredSolids.has(c.revision)){
          registeredSolids.add(c.revision);
          const vertices=c.vertices.slice(),indices=c.indices.slice();
          try{worker.postMessage({type:'register-solid',revision:c.revision,vertices,indices},
            [vertices.buffer,indices.buffer]);}catch{stats.failed++;fallback();return;}
        }
        pending.set(surfaceId,{id:nextId++,generation,surfaceId,resolution,coords,colliders:workerColliders,
          originalColliders:colliders,radius,maskTerrain,
          priority,queuedAt:snapshotAt,centroid,particles,seq:s.nextSeq});
        dispatch();
        refreshStaleBody(s,particles,colliders,radius,maskTerrain,centroid,snapshotAt,
          poseDistance(s.completedCentroid,centroid)>poseTolerance(radius));
      },
      dispose(){pending.delete(surfaceId);surfaces.delete(surfaceId);sync.mesh.geometry.dispose();
        freshnessSurface?.mesh.geometry.dispose();}
    };
    surfaces.set(surfaceId,s);return s;
  }
  function invalidate(){generation++;pending.clear();bodyStreak=0;registeredSolids.clear();
    if(worker&&!disabled)try{worker.postMessage({type:'clear-solids'});}catch{stats.failed++;fallback();}
    for(const s of surfaces.values()){
    s.previous=null;s.completedCentroid=null;s.completedPosition=null;
    s.displayedSnapshotAt=null;s.lastWorkerSnapshotAt=null;
    s.displayedSeq=0;s.nextSeq=0;s.firstQueuedAt=null;s.lastFallbackAt=-Infinity;
    s.mesh.count=0;s.mesh.geometry.setDrawRange(0,0);
  }}
  function dispose(){generation++;pending.clear();worker?.terminate();worker=null;for(const s of [...surfaces.values()])s.dispose();surfaces.clear();disabled=true;}
  return {create,invalidate,dispose,stats,get workerEnabled(){return !disabled;},get pendingCount(){return pending.size+(inFlight?1:0);}};
}
