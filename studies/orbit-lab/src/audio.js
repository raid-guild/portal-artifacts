// Original procedural tones: no samples or external audio requests.
export class OrbitAudio {
  constructor() { this.enabled = true; this.step = 0; }
  unlock() {
    if (!this.enabled) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    if (!this.context) {
      const c = this.context = new Audio();
      this.master = c.createGain(); this.master.gain.value = .32;
      const limiter = c.createDynamicsCompressor();
      this.master.connect(limiter); limiter.connect(c.destination);
      // Quiet, continuous tail voice with a smoothly controlled envelope.
      this.tail = c.createOscillator(); this.tail.type = 'triangle';
      this.tailGain = c.createGain(); this.tailGain.gain.value = 0;
      this.tail.connect(this.tailGain); this.tailGain.connect(this.master); this.tail.start();
      // Orb voice: a low fundamental and a soft beating overtone, independent of flight.
      this.humGain = c.createGain(); this.humGain.gain.value = 0; this.humGain.connect(this.master);
      this.hum = c.createOscillator(); this.hum.type = 'triangle'; this.hum.frequency.value = 196; this.hum.connect(this.humGain); this.hum.start();
      this.humOvertone = c.createOscillator(); this.humOvertone.frequency.value = 392.35;
      const overtoneGain = c.createGain(); overtoneGain.gain.value = .3;
      this.humOvertone.connect(overtoneGain); overtoneGain.connect(this.humGain); this.humOvertone.start();
      const noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = noiseBuffer;
      this.air = c.createBufferSource(); this.air.buffer = noiseBuffer; this.air.loop = true;
      const airFilter = c.createBiquadFilter(); airFilter.type = 'bandpass'; airFilter.frequency.value = 1600; airFilter.Q.value = .8;
      this.airGain = c.createGain(); this.airGain.gain.value = 0;
      this.air.connect(airFilter); airFilter.connect(this.airGain); this.airGain.connect(this.master); this.air.start();
    }
    if (this.context.state === 'suspended') this.context.resume().catch(() => {});
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) this.unlock();
    if (this.context) this.master.gain.setTargetAtTime(enabled ? .32 : 0, this.context.currentTime, .04);
  }
  tone(frequency, delay = 0, duration = 1.4, volume = .16, endFrequency = frequency) {
    if (!this.enabled || !this.context) return;
    const c = this.context, time = c.currentTime + delay;
    const oscillator = c.createOscillator(), gain = c.createGain();
    oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), time + duration);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(this.master);
    oscillator.start(time); oscillator.stop(time + duration + .05);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  placement() {
    this.unlock();
    // A repeating, spacious five-note call, composed for this experiment.
    const notes = [293.665, 440, 329.628, 523.251, 391.995];
    const note = notes[this.step++ % notes.length];
    this.tone(note, 0, 1.9, .19);
    this.tone(note * 2, .08, 1.3, .045);
    this.tone(note, .32, 1.5, .045);
  }
  trail(running, speed, age) {
    if (!this.context) return;
    const time = this.context.currentTime;
    const fade = Math.exp(-Math.max(0, age) / 10);
    const active = running && this.enabled;
    this.tailGain.gain.setTargetAtTime(active ? Math.min(.11, .035 + speed * .009) * fade : 0, time, .16);
    this.airGain.gain.setTargetAtTime(active ? Math.min(.13, speed * .018) * fade : 0, time, .2);
    this.tail.frequency.setTargetAtTime(260 + Math.min(speed, 15) * 16, time, .3);
  }
  orb(present, time) {
    const pulse = .5 + .5 * Math.sin(time * Math.PI * 2 * .65);
    if (this.context) this.humGain.gain.setTargetAtTime(present && this.enabled ? .04 + pulse * .085 : 0, this.context.currentTime, .08);
    return pulse;
  }
  noise(duration, frequency, volume) {
    if (!this.enabled || !this.context) return;
    const c = this.context, time = c.currentTime;
    const source = c.createBufferSource(), filter = c.createBiquadFilter(), gain = c.createGain();
    source.buffer = this.noiseBuffer; filter.type = 'lowpass'; filter.frequency.setValueAtTime(frequency, time);
    filter.frequency.exponentialRampToValueAtTime(80, time + duration);
    gain.gain.setValueAtTime(volume, time); gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    source.connect(filter); filter.connect(gain); gain.connect(this.master);
    source.start(); source.stop(time + duration);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }
  death() { this.noise(.45, 1800, .17); this.tone(150, 0, .4, .17, 42); }
  portal() {
    [261.626, 329.628, 391.995, 523.251].forEach((note, i) => this.tone(note, i * .11, 2.6, .1));
    this.noise(.8, 4200, .035);
  }
  reset() { this.step = 0; this.trail(false, 0, 0); this.orb(false, 0); }
}
