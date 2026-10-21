import { TRANSMISSION_DURATION, crossedEvents, transmissionEvents } from './chapter.js';

export function createTransmission({ overlay, canvas, caption, audio, onFinish }) {
  const context = canvas.getContext('2d');
  let active = false, elapsed = 0, lastFrame = 0, raf = 0, events = [], pulses = [], reduced = false;
  const dotAt = (time, w, h) => {
    const travel = Math.min(1, Math.max(0, time / TRANSMISSION_DURATION * (reduced ? .38 : 1.9)));
    return { x: w * (.12 + travel * .54), y: h * .52 + (reduced ? 0 : Math.sin(time * .9) * h * .07) };
  };
  document.addEventListener('visibilitychange', () => { lastFrame = 0; });
  const resize = () => {
    const scale = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * scale));
    const height = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width === width && canvas.height === height) return;
    const oldWidth = canvas.width, oldHeight = canvas.height;
    for (const pulse of pulses) if (!pulse.answer) {
      pulse.x *= width / Math.max(1, oldWidth);
      pulse.y *= height / Math.max(1, oldHeight);
    }
    canvas.width = width; canvas.height = height;
    if (active) draw();
  };
  new ResizeObserver(resize).observe(overlay);
  function draw() {
    const w = canvas.width, h = canvas.height, scale = Math.min(w, h) / 700;
    context.fillStyle = '#050b19'; context.fillRect(0, 0, w, h);
    const dot = dotAt(elapsed, w, h);
    // The tail follows visited positions only, fading toward its older end.
    const tailLength = reduced ? 2.5 : 7;
    const first = Math.max(0, elapsed - tailLength), step = .12;
    for (let time = first + step; time <= elapsed + step / 2; time += step) {
      const a = dotAt(Math.max(first, time - step), w, h), b = dotAt(Math.min(elapsed, time), w, h);
      const strength = Math.max(0, 1 - (elapsed - time) / tailLength);
      context.strokeStyle = `rgba(111,238,225,${.03 + strength * .42})`;
      context.lineWidth = Math.max(1.2, scale * (1.5 + strength * 2.5));
      context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
    }
    // Soft light around the traveling point, with tiny sparks of the same material.
    const halo = context.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 70 * scale);
    halo.addColorStop(0, 'rgba(180,255,243,.62)'); halo.addColorStop(.13, 'rgba(111,245,226,.28)');
    halo.addColorStop(.55, 'rgba(68,220,223,.08)'); halo.addColorStop(1, 'rgba(68,220,223,0)');
    context.fillStyle = halo; context.beginPath(); context.arc(dot.x, dot.y, 70 * scale, 0, Math.PI * 2); context.fill();
    if (!reduced) for (let i = 0; i < 7; i++) {
      const angle = i * 2.399 + elapsed * .7, radius = (11 + (i * 11 + elapsed * 7) % 27) * scale;
      context.fillStyle = `rgba(149,255,238,${.1 + .2 * (1 + Math.sin(elapsed * 2 + i)) / 2})`;
      context.beginPath(); context.arc(dot.x + Math.cos(angle) * radius, dot.y + Math.sin(angle) * radius, Math.max(.8, scale * (i % 3 === 0 ? 1.6 : .9)), 0, Math.PI * 2); context.fill();
    }
    for (const pulse of pulses) {
      const age = elapsed - pulse.at;
      const duration = pulse.answer ? 3.1 : 2.4;
      if (age < 0 || age > duration) continue;
      const px = pulse.answer ? w * (1.03 - Math.min(1, age / duration) * (reduced ? .12 : .44)) : pulse.x;
      const py = pulse.answer ? h * (.32 + Math.sin(age * 1.7) * (reduced ? 0 : .025)) : pulse.y;
      const radius = (pulse.answer ? 45 + age * 125 : 12 + age * 55) * scale;
      context.beginPath(); context.arc(px, py, radius, 0, Math.PI * 2);
      context.strokeStyle = pulse.answer ? `rgba(199,172,255,${.7 * (1-age/duration)})` : `rgba(126,244,229,${.8 * (1-age/duration)})`;
      context.lineWidth = Math.max(2, scale * (pulse.answer ? 5 : 3)); context.stroke();
      if (pulse.answer) {
        const haze = context.createRadialGradient(px, py, radius * .25, px, py, radius * 1.2);
        haze.addColorStop(0, 'rgba(189,161,255,0)'); haze.addColorStop(.7, `rgba(163,134,239,${.12 * (1-age/duration)})`); haze.addColorStop(1, 'rgba(163,134,239,0)');
        context.fillStyle = haze; context.beginPath(); context.arc(px, py, radius * 1.2, 0, Math.PI * 2); context.fill();
      }
    }
    context.fillStyle = '#effff9'; context.shadowColor = '#65f4e2'; context.shadowBlur = 30 * scale;
    context.beginPath(); context.arc(dot.x, dot.y, Math.max(4, 7 * scale), 0, Math.PI * 2); context.fill(); context.shadowBlur = 0;
  }
  function finish(restore = true) {
    if (!active) return;
    active = false; cancelAnimationFrame(raf); audio.stopScene(); overlay.classList.add('hidden'); overlay.inert = true;
    if (restore) onFinish();
  }
  function tick(now) {
    if (!active) return;
    if (!lastFrame) lastFrame = now;
    if (!document.hidden) {
      const previous = elapsed;
      elapsed = Math.min(TRANSMISSION_DURATION, elapsed + Math.max(0, (now - lastFrame) / 1000));
      for (const event of crossedEvents(events, previous, elapsed)) {
        if (event.type === 'call') { audio.sceneCall(event.note); const at = dotAt(event.at, canvas.width, canvas.height); pulses.push({ at: event.at, answer: false, x: at.x, y: at.y }); }
        if (event.type === 'earned') audio.sceneEarned(event.note);
        if (event.type === 'answerSound') audio.sceneAnswer();
        if (event.type === 'answerPulse') { pulses.push({ at: event.at, answer: true }); caption.textContent = 'SOMETHING ANSWERED'; }
        if (event.type === 'end') { finish(); return; }
      }
      draw();
    }
    lastFrame = now; raf = requestAnimationFrame(tick);
  }
  return {
    get active() { return active; },
    start(notes) {
      if (active) finish(false);
      active = true; elapsed = 0; lastFrame = 0; pulses = []; events = transmissionEvents(notes);
      reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      overlay.inert = false; overlay.classList.remove('hidden'); resize(); draw();
      caption.textContent = 'A CALL INTO THE DARK'; audio.startScene(); raf = requestAnimationFrame(tick);
    },
    stop: finish,
    resize,
  };
}
