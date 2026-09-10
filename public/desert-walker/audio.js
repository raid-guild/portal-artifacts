/* Procedural soundscape: no downloads or third-party audio assets. */
window.createWalkerAudio = function () {
  "use strict";
  const toggle = document.querySelector("#sound-toggle");
  const volume = document.querySelector("#sound-volume");
  const output = document.querySelector("#volume-value");
  let context, master, windGain, windFilter, engineGain, servoGain, servo, noise;
  let enabled = false, busy = false, previousWalk = null, lastLanding = -1;
  let moving = false;
  function gain(value) { const n=context.createGain(); n.gain.value=value; return n; }
  function filter(type,frequency,q) {
    const n=context.createBiquadFilter(); n.type=type; n.frequency.value=frequency; n.Q.value=q; return n;
  }
  function initialize() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error("Web Audio unavailable");
    context = new Audio();
    master=gain(0);
    const limiter=context.createDynamicsCompressor();
    limiter.threshold.value=-18; limiter.knee.value=12; limiter.ratio.value=8;
    limiter.attack.value=0.006; limiter.release.value=0.2;
    master.connect(limiter); limiter.connect(context.destination);
    noise=context.createBuffer(1,context.sampleRate*4,context.sampleRate);
    const data=noise.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
    const wind=context.createBufferSource(); wind.buffer=noise; wind.loop=true;
    windFilter=filter("lowpass",850,0.5); windGain=gain(0);
    const windCut=filter("highpass",65,0.5);
    wind.connect(windCut); windCut.connect(windFilter); windFilter.connect(windGain);windGain.connect(master);wind.start();
    engineGain=gain(0); const engineFilter=filter("lowpass",190,0.6); engineFilter.connect(engineGain);engineGain.connect(master);
    [43,64.8,87.5].forEach(function (frequency) {
      const oscillator=context.createOscillator();oscillator.type="triangle";oscillator.frequency.value=frequency;
      const level=gain(0.23);oscillator.connect(level);level.connect(engineFilter);oscillator.start();
    });
    servo=context.createOscillator();servo.type="sawtooth";servo.frequency.value=135;
    const servoFilter=filter("bandpass",460,1.1);servoGain=gain(0);
    servo.connect(servoFilter);servoFilter.connect(servoGain);servoGain.connect(master);servo.start();
  }
  function setLevel() {
    output.textContent=volume.value+"%";
    if(context)master.gain.setTargetAtTime(enabled && !document.hidden ? Number(volume.value)/100*0.65 : 0,context.currentTime,0.08);
  }
  toggle.addEventListener("click", async function () {
    if(busy)return; busy=true;
    try {
      if(!context)initialize();
      if(context.state!=="running")await context.resume();
      enabled=!enabled; toggle.textContent=enabled?"Sound on":"Sound off";
      toggle.setAttribute("aria-pressed",String(enabled));setLevel();
    } catch(error) {
      enabled=false;toggle.textContent="Sound unavailable";toggle.setAttribute("aria-pressed","false");setLevel();
    } finally {busy=false;}
  });
  volume.addEventListener("input",setLevel);
  document.addEventListener("visibilitychange",setLevel);
  setLevel();
  function impact(frequency,duration,level,pan,metallic) {
    const now=context.currentTime;
    const envelope=gain(0);const panner=context.createStereoPanner();panner.pan.value=pan;
    envelope.connect(panner);panner.connect(master);
    envelope.gain.setValueAtTime(0,now);envelope.gain.linearRampToValueAtTime(level,now+0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001,now+duration);
    const source=metallic?context.createOscillator():context.createBufferSource();
    let shaping;
    if(metallic){source.type="sine";source.frequency.setValueAtTime(frequency,now);source.frequency.exponentialRampToValueAtTime(frequency*0.55,now+duration);source.connect(envelope);}
    else {source.buffer=noise;shaping=filter("bandpass",frequency,1.4);source.connect(shaping);shaping.connect(envelope);}
    source.start(now);source.stop(now+duration+0.01);
    source.onended=function(){source.disconnect();if(shaping)shaping.disconnect();envelope.disconnect();panner.disconnect();};
  }
  return {
    update: function (delta,state) {
      const walk=state.walkTime;
      moving=previousWalk!==null && walk>previousWalk;
      previousWalk=walk;
      const landing=Math.floor((walk/1.2)-0.85);
      const landed=landing>lastLanding;lastLanding=landing;
      if(!context || !enabled || document.hidden || context.state!=="running")return;
      const now=context.currentTime,storm=state.storm;
      const proximity=state.cockpit?1:Math.min(1,24/Math.max(10,state.distance));
      const gust=0.83+Math.sin(now*0.7)*0.11+Math.sin(now*1.63)*0.06;
      windGain.gain.setTargetAtTime((0.05+storm*0.46)*gust*(state.cockpit?0.55:1),now,0.15);
      windFilter.frequency.setTargetAtTime((400+storm*1500)*(state.cockpit?0.5:1),now,0.15);
      engineGain.gain.setTargetAtTime((moving?0.14:0.065)*proximity,now,0.1);
      const phase=(walk/1.2)%1;
      servoGain.gain.setTargetAtTime(moving?Math.sin(Math.min(1,phase/0.85)*Math.PI)*0.055*proximity:0,now,0.04);
      servo.frequency.setTargetAtTime(120+Math.sin(phase*Math.PI)*110,now,0.05);
      if(landed && moving){
        impact(82,0.32,0.22*proximity,0,true);
        impact(850,0.12,0.12*proximity,landing%2?0.25:-0.25,false);
      }
      if(Math.random()<Math.min(delta,0.05)*storm*storm*28){
        impact(state.cockpit?1200:2600,0.025+Math.random()*0.04,(0.012+storm*0.045)*proximity,Math.random()*1.6-0.8,false);
      }
    }
  };
};
