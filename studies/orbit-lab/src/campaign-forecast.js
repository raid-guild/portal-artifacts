import { STEP } from './physics.js';
import { BLOB_RADIUS, SPEED_CAP, capVelocity, firstImpact, mazeAcceleration } from './level.js';
import { entityAcceleration, releaseEntityHold, stepEntityRuntime } from './entity-runtime.js';

// A short, deliberately bounded view of the next uninterrupted flight. Runtime
// state is cloned so prediction cannot collect anything or move an ember in play.
export function predictCampaignPath(state, wells, time, level, entities, runtime, seconds = 3) {
  const simulated = structuredClone(runtime);
  const body = { position: { x: state.x, y: state.y }, velocity: { x: state.vx, y: state.vy } };
  if (simulated?.held) releaseEntityHold(simulated, body, time);
  const points = [{ x: body.position.x, y: body.position.y }];
  const limit = Math.ceil(Math.min(3, Math.max(0, seconds)) / STEP);
  for (let i = 0; i < limit; i++) {
    const at = time + i * STEP;
    const before = { ...body.position };
    const a = mazeAcceleration(before, wells, at, 'fade', level);
    const extra = simulated ? entityAcceleration(before, entities, simulated) : { x: 0, y: 0 };
    body.velocity.x += (a.x + extra.x) * STEP;
    body.velocity.y += (a.y + extra.y) * STEP;
    const capped = capVelocity(body.velocity, Math.max(SPEED_CAP, ...entities.filter(e => e.type === 'impulse').map(e => e.speed)));
    body.velocity.x = capped.x; body.velocity.y = capped.y;
    body.position.x += body.velocity.x * STEP;
    body.position.y += body.velocity.y * STEP;
    const hit = firstImpact(before, body.position, level);
    if (simulated) {
      const interaction = stepEntityRuntime(simulated, entities, before, body, at, STEP, level.bounds);
      if (interaction.died || interaction.teleported || interaction.tones.length || simulated.held || interaction.energyDelta || interaction.companions.length) {
        points.push({ x: body.position.x, y: body.position.y });
        return { points, impact: interaction.died ? 'ember' : 'interaction' };
      }
    }
    if (hit) {
      points.push({ x: hit.x, y: hit.y });
      return { points, impact: hit.type };
    }
    if ((i + 1) % 5 === 0) points.push({ ...body.position });
  }
  points.push({ ...body.position });
  return { points, impact: null };
}
