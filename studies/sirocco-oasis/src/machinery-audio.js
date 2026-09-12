// Recorded diesel / mechanical foley, layered and driven by the harvest state.
const beds=[
 [['generator',.62,.3],['ratchet',.65,.15]],
 [['diesel',1.24,.4],['ratchet',1.55,.22]],
 [['diesel',.86,.78],['generator',.72,.24]],
 [['generator',.7,.2],['air',.72,.25]],
 [['ratchet',.85,.48],['generator',.55,.16]]
];
export function createMachineryAudio({state,root,camera}){
 const slider=document.querySelector('#machinery-volume'),output=document.querySelector('#machinery-volume-value');
 let context,master,tone,distanceGain,analyser,loading,armed=false,failed=false,activeStep=-1,view='vista',lastRunning=false,lastStep=state.step,mutedByPage=false;
 let volume=70;try{const saved=localStorage.getItem('sirocco.machinery.volume');if(saved!==null)volume=Math.max(0,Math.min(100,Number(saved)||0));}catch{}
 slider.value=String(volume);output.textContent=volume+'%';
 const buffers=new Map(),loops=[],voices=new Set();
 function ramp(param,v,time=.12){const now=context.currentTime;param.cancelScheduledValues(now);param.setTargetAtTime(v,now,time);}
 function stopLoops(){for(const {source,gain} of loops){ramp(gain.gain,0,.07);try{source.stop(context.currentTime+.35);}catch{}}loops.length=0;activeStep=-1;}
 function sample(name,rate,gainValue,loop=false,delay=0){if(!context||!buffers.has(name))return;if(voices.size>=12){if(!loop)return;const oldest=voices.values().next().value;oldest.stop();voices.delete(oldest);}const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffers.get(name);source.loop=loop;source.playbackRate.value=rate;gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(gainValue,context.currentTime+delay+(loop?.15:.006));source.connect(gain).connect(tone);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};source.start(context.currentTime+delay);if(loop)loops.push({source,gain,name,rate});return source;}
 function startStage(){stopLoops();if(!armed||!state.running||!volume||document.hidden||buffers.size!==5)return;activeStep=state.step;for(const [name,rate,gain] of beds[activeStep])sample(name,rate,gain,true);sample('clunk',activeStep===2?.66:.85,.5);if(activeStep===0||activeStep===3)sample('air',.75,.27);if(activeStep===4)sample('clunk',1.1,.32,false,.35);}
 function mix(){if(!context)return;view=document.body.classList.contains('room-view')?'room':document.body.classList.contains('ship-view')?'ship':'vista';const distance=camera.position.distanceTo(root.position);const near=view==='room'?.82:view==='ship'?Math.min(1,4/Math.max(2,distance)):.12;
  ramp(master.gain,document.hidden?0:volume/100*.8,.08);ramp(distanceGain.gain,near,.22);ramp(tone.frequency,view==='room'?2100:view==='ship'?6500:900,.2);
  if(activeStep===2)for(const loop of loops)ramp(loop.source.playbackRate,loop.rate*(.72+state.rate*.28),.18);
 }
 async function arm(){armed=true;if(!volume)return;if(!context){context=new AudioContext();tone=context.createBiquadFilter();tone.type='lowpass';tone.frequency.value=6500;const bass=context.createBiquadFilter();bass.type='lowshelf';bass.frequency.value=110;bass.gain.value=5;distanceGain=context.createGain();master=context.createGain();master.gain.value=0;const compressor=context.createDynamicsCompressor();compressor.threshold.value=-13;compressor.knee.value=15;compressor.ratio.value=5;compressor.attack.value=.006;compressor.release.value=.2;analyser=context.createAnalyser();analyser.fftSize=2048;tone.connect(bass).connect(distanceGain).connect(compressor).connect(master).connect(analyser).connect(context.destination);}
  try{await context.resume();if(!loading||failed){failed=false;output.textContent='Loading…';loading=Promise.all(['diesel','generator','ratchet','clunk','air'].map(async name=>{const response=await fetch(`${import.meta.env.BASE_URL}audio/machinery/${name}.mp3`);if(!response.ok)throw new Error('Recording unavailable');buffers.set(name,await context.decodeAudioData(await response.arrayBuffer()));}));}await loading;output.textContent=volume+'%';mix();if(activeStep!==state.step&&state.running)startStage();}catch{failed=true;output.textContent='Unavailable · adjust to retry';}
 }
 slider.addEventListener('input',()=>{volume=Number(slider.value);output.textContent=volume?' '+volume+'%':'Off';try{localStorage.setItem('sirocco.machinery.volume',String(volume));}catch{}if(volume)void arm();else stopLoops();mix();});
 document.addEventListener('visibilitychange',()=>{mutedByPage=document.hidden;if(context){if(mutedByPage){stopLoops();master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);void context.suspend();}else if(armed&&volume){void arm();}}});
 return {arm,update(){
  if(context&&armed&&!document.hidden&&volume&&buffers.size===5){
   if(state.running&&activeStep!==state.step)startStage();
   if(!state.running&&lastRunning){stopLoops();sample('clunk',.72,.5);if(state.step!==lastStep&&(lastStep===3||lastStep===4))sample('air',lastStep===4?.55:.8,lastStep===4?.48:.28);if(lastStep===4&&state.step===0){sample('clunk',.6,.42,false,.4);}}
   mix();
  }lastRunning=state.running;lastStep=state.step;
 },stats(){let rms=0;if(analyser){const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);rms=Math.sqrt(data.reduce((s,v)=>s+v*v,0)/data.length);}return {armed,loaded:buffers.size,stage:activeStep,loops:loops.length,voices:voices.size,volume,view,context:context?.state||'uninitialized',rms};}};
}
