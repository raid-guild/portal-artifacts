/* Procedural ambience and a user-supplied cockpit radio track. */
window.createWalkerAudio = function () {
  "use strict";
  const volume = document.querySelector("#sound-volume");
  const output = document.querySelector("#volume-value");
  const radio = document.querySelector("#cockpit-radio");
  const radioVolume = document.querySelector("#radio-volume");
  const radioStatus = document.querySelector("#radio-status");
  const radioChannel = document.querySelector("#radio-channel");
  let context, master, windGain, windFilter, engineGain, servoGain, servo, noise;
  let staticGain;
  const channels = {
    walker: {src:"./assets/walker-radio.mp3",label:"CH 01 · Walker Radio"},
    orbital: {src:"./assets/orbital-rad.mp3",label:"CH 02 · Orbital Rad"},
    docking: {src:"./assets/docking-lights.mp3",label:"CH 03 · Docking Lights"}
  };
  let inCockpit = false, radioPlaying = false, playbackRequest = 0;
  function tunedChannel() { return Math.round(Number(radioChannel.value)); }
  function betweenStations() { return Math.abs(Number(radioChannel.value)-tunedChannel())>.16; }
  function stationLabel() {
    radioStatus.textContent=betweenStations()?"··· Searching · Static ···":channels[["walker","orbital","docking"][tunedChannel()-1]].label;
    radioChannel.setAttribute("aria-valuetext",radioStatus.textContent);
  }
  let currentChannel=1;
  radioChannel.addEventListener("input",function () {
    if(currentChannel!==tunedChannel()){
      currentChannel=tunedChannel();playbackRequest++;radio.pause();radioPlaying=false;
      radio.src=channels[["walker","orbital","docking"][currentChannel-1]].src;
    }
    stationLabel();syncRadio();
  });
  function staticLevel() {
    if(!staticGain)return;
    const audible=betweenStations() && inCockpit && !document.hidden;
    const now=context.currentTime;
    staticGain.gain.cancelScheduledValues(now);staticGain.gain.setValueAtTime(staticGain.gain.value,now);
    staticGain.gain.linearRampToValueAtTime(audible?Number(radioVolume.value)/100*.18:0,now+.035);
  }
  function syncStatic() {
    if(betweenStations() && inCockpit && !document.hidden && Number(radioVolume.value)>0){
      try {if(!context)initialize(); if(context.state!=="running")context.resume().then(staticLevel).catch(()=>{});}catch(error){return;}
    }
    staticLevel();
  }
  function syncRadio() {
    syncStatic();
    const play = Number(radioVolume.value)>0 && inCockpit && !document.hidden && !betweenStations();
    if (play === radioPlaying) return;
    const request=++playbackRequest;
    radioPlaying = play;
    if (!play) { radio.pause(); return; }
    radio.play().catch(function (error) {
      if (request!==playbackRequest || error.name === "AbortError" || !radioPlaying) return;
      radioPlaying = false; radioVolume.value = "0";
      document.querySelector("#radio-volume-value").textContent = "Off";
      radioStatus.textContent = "Playback unavailable. Raise volume to retry.";
    });
  }
  function radioLevel() {
    radio.volume = Number(radioVolume.value)/100;
    document.querySelector("#radio-volume-value").textContent = Number(radioVolume.value)>0 ? radioVolume.value+"%" : "Off";
    inCockpit = document.body.classList.contains("cockpit-view");
    stationLabel();
    syncRadio();
  }
  radioVolume.addEventListener("input",radioLevel);
  document.addEventListener("visibilitychange",syncRadio);
  document.addEventListener("cockpit-view-change",function (event) { inCockpit=event.detail; syncRadio(); });
  radioLevel();

  let previousWalk = null, lastLanding = -1;
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
    const staticSource=context.createBufferSource();staticSource.buffer=noise;staticSource.loop=true;
    const staticFilter=filter("bandpass",1900,.65);staticGain=gain(0);
    staticSource.connect(staticFilter);staticFilter.connect(staticGain);staticGain.connect(context.destination);staticSource.start();
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
    output.textContent=Number(volume.value)>0 ? volume.value+"%" : "Off";
    if(context) {
      const now=context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value,now);
      master.gain.linearRampToValueAtTime(!document.hidden ? Number(volume.value)/100*0.65 : 0,now+0.04);
    }
  }
  volume.addEventListener("input", async function () {
    setLevel();
    if(Number(volume.value)===0)return;
    try {
      if(!context)initialize();
      if(context.state!=="running")await context.resume();
      setLevel();
    } catch(error) {
      volume.value="0";setLevel();output.textContent="Unavailable";
    }
  });
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
    rumble: function (giant) {
      if(!context || Number(volume.value)===0 || document.hidden || context.state!=="running")return;
      impact(giant?52:75,giant?3.2:1.8,giant?.32:.22,0,false);
      impact(giant?32:44,giant?2.8:1.4,giant?.18:.12,0,true);
    },
    update: function (delta,state) {
      if (inCockpit !== state.cockpit) { inCockpit = state.cockpit; syncRadio(); }
      const walk=state.walkTime;
      moving=previousWalk!==null && walk>previousWalk;
      previousWalk=walk;
      const landing=Math.floor((walk/1.2)-0.85);
      const landed=landing>lastLanding;lastLanding=landing;
      if(!context || Number(volume.value)===0 || document.hidden || context.state!=="running")return;
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
