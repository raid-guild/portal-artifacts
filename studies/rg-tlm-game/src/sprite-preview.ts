import { TravelerSprite, type Facing } from './traveler';
import './sprite-preview.css';

const directions: { facing: Facing; title: string; note: string }[] = [
  { facing: 'right', title: 'Heading right', note: 'Side view' },
  { facing: 'left', title: 'Heading left', note: 'Mirrored side view' },
  { facing: 'up', title: 'Walking away', note: 'Back view' },
  { facing: 'down', title: 'Coming closer', note: 'Front view' },
];
document.querySelector('.poses')!.innerHTML = directions.map(({ facing, title, note }) => `<article><div class="canvas-stage"><span class="ground-shadow"></span><canvas id="pose-${facing}" aria-label="${title}" role="img"></canvas></div><div class="caption"><h2>${title}</h2><span>${note}</span></div></article>`).join('');
const sprites = directions.map(({ facing }) => ({ facing, sprite: new TravelerSprite(document.querySelector<HTMLCanvasElement>(`#pose-${facing}`)!, `${import.meta.env.BASE_URL}art/sprites/`) }));
const pause = document.querySelector<HTMLButtonElement>('#pause')!;
const idle = document.querySelector<HTMLButtonElement>('#idle')!;
const pace = document.querySelector<HTMLInputElement>('#pace')!;
let running = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let standing = false;
let elapsed = 0;
let previous = 0;
pause.textContent = running ? 'Pause' : 'Play';
Promise.all(sprites.map(({ sprite }) => sprite.ready)).then(() => {
  pause.disabled = false; idle.disabled = false;
  document.querySelector('#status')!.textContent = 'Ready to explore.';
  sprites.forEach(({ sprite, facing }) => sprite.walk(facing, 0));
  const tick = (now: number) => {
    if (running && !standing) {
      elapsed += Math.min(100, previous ? now - previous : 0) * Number(pace.value);
      sprites.forEach(({ sprite }) => sprite.draw(elapsed));
    }
    previous = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}).catch(() => { document.querySelector('#status')!.textContent = 'The sprite artwork could not load. Refresh to try again.'; });
pause.addEventListener('click', () => { running = !running; pause.textContent = running ? 'Pause' : 'Play'; });
idle.addEventListener('click', () => {
  standing = !standing;
  idle.textContent = standing ? 'Show walking poses' : 'Show standing poses';
  sprites.forEach(({ sprite, facing }) => standing ? sprite.stand(facing) : sprite.walk(facing, elapsed));
});
pace.addEventListener('input', () => { document.querySelector('#pace-value')!.textContent = `${pace.value}×`; });
