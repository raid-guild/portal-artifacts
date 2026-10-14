// Adapted from Inkwash by Jonathan Whitaker (MIT). See inkwash-LICENSE.txt.
// Original WebGL2 fluid/pigment shaders and simulation pipeline retained; interaction
// is driven by the music visualizer instead of the upstream pointer UI.
export function createInkwash(canvas) {
  const gl = canvas.getContext('webgl2', {alpha:false, depth:false, stencil:false, antialias:false});
  if (!gl) throw new Error('WebGL2 unavailable');
  if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('Floating point render targets unavailable');
  if (!gl.getExtension('EXT_float_blend')) throw new Error('Floating point blending unavailable');
  gl.disable(gl.BLEND);
  const inkFilter = gl.getExtension('OES_texture_float_linear') ? gl.LINEAR : gl.NEAREST;
  const shaders = [], programs = [], targets = [];
  const SIM_BASE = 112, DYE_BASE = 384, PRESSURE_ITER = 12;
  const P = {FLOW:.9, DRY:.35, BLEED:.6, COLOR:.5};
  let disposed = false;
  let monochrome = false;
  let simClock = 0, accumulator = 0, renderDirty = true;
  const emitters = [
    {hue:0,phase:0}, {hue:1,phase:2.09}, {hue:2,phase:4.18}
  ];
  function destroyTargets() {
    for (const t of targets) { gl.deleteFramebuffer(t.fbo); gl.deleteTexture(t.tex); }
    targets.length = 0;
  }
const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

function compile(type, src){
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
  shaders.push(s);
  return s;
}
const quadVS = compile(gl.VERTEX_SHADER, VERT);
function program(fsSrc){
  const p = gl.createProgram();
  gl.attachShader(p, quadVS);
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++){ const inf = gl.getActiveUniform(p, i); u[inf.name] = gl.getUniformLocation(p, inf.name); }
  programs.push(p);
  return { p, u, bind(){ gl.useProgram(p); } };
}

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

function blit(target){
  if (target == null){
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  } else {
    gl.viewport(0, 0, target.w, target.h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
  }
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function createFBO(w, h, internal, format, type, filter){
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  targets.push({tex, fbo});
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Ink wash framebuffer incomplete");
  return { tex, fbo, w, h, texel: [1/w, 1/h],
           attach(unit){ gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, this.tex); return unit; } };
}
function createDouble(w, h, internal, format, type, filter){
  let a = createFBO(w, h, internal, format, type, filter);
  let b = createFBO(w, h, internal, format, type, filter);
  return { w, h, texel: [1/w, 1/h],
           get read(){ return a; }, get write(){ return b; },
           swap(){ const t = a; a = b; b = t; } };
}

function getRes(base){
  const ar = canvas.width / canvas.height;
  return ar > 1 ? { w: Math.round(base * ar), h: base }
                : { w: base, h: Math.round(base / ar) };
}

const copyFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform float uValue;
void main(){ o = texture(uTex, vUv) * uValue; }`;

// drawn with additive (or MAX) blending straight into the live texture
const splatFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform float uAspect; uniform vec2 uPoint;
uniform vec4 uColor; uniform float uRadius;
void main(){
  vec2 p = vUv - uPoint; p.x *= uAspect;
  o = uColor * exp(-dot(p,p) / uRadius);
}`;

// velocity: self-advect, damp, and confine to wet paper
const advectVelFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity, uWet;
uniform vec2 uTexel;
uniform float uDt, uDissipation;
void main(){
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  vec2 vel = texture(uVelocity, coord).xy * uDissipation;
  float w = texture(uWet, vUv).x;
  float mask = smoothstep(0.005, 0.2, w);
  o = vec4(vel * mask, 0., 1.);
}`;

// water: carried by the flow, creeps outward, evaporates
const advectWetFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity, uWet;
uniform vec2 uTexel, uSrcTexel;
uniform float uDt, uDecay, uSpread, uBaseline;
void main(){
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel * 0.6;
  float w = texture(uWet, coord).x;
  vec2 b = uSrcTexel * 1.6;
  float n = (texture(uWet, coord + vec2(b.x, 0.)).x + texture(uWet, coord - vec2(b.x, 0.)).x
           + texture(uWet, coord + vec2(0., b.y)).x + texture(uWet, coord - vec2(0., b.y)).x) * 0.25;
  w = mix(w, n, uSpread);
  o = vec4(max(w * uDecay, uBaseline), 0., 0., 1.);
}`;

// pigment: mobile only where wet; chromatic bleed pulls blue/violet halos out of the ink
const advectInkFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity, uSource, uWet;
uniform vec2 uTexel, uSrcTexel;
uniform float uDt, uBleed, uAspect, uPigmentDecay;
uniform vec3 uChroma;
uniform vec3 uBrush;     // x, y, radius (radius <= 0 -> inactive)
void main(){
  float w = texture(uWet, vUv).x;
  float mob = smoothstep(0.02, 0.45, w);
  vec4 cur = texture(uSource, vUv);
  if (mob < 0.002){ o = cur * uPigmentDecay; return; }
  vec2 vel = texture(uVelocity, vUv).xy;
  vec2 coord = vUv - uDt * vel * uTexel * mob;
  vec4 adv = texture(uSource, coord);
  float brush = 0.;
  if (uBrush.z > 0.){
    vec2 d = vUv - uBrush.xy; d.x *= uAspect;
    brush = exp(-dot(d,d) / (uBrush.z * uBrush.z));
  }
  vec2 b = uSrcTexel * 1.6;
  vec4 n = (texture(uSource, coord + vec2(b.x, 0.)) + texture(uSource, coord - vec2(b.x, 0.))
          + texture(uSource, coord + vec2(0., b.y)) + texture(uSource, coord - vec2(0., b.y))) * 0.25;
  vec4 bleedAmt = clamp(uBleed * (0.25 + 1.3 * brush) * mob * vec4(uChroma, 1.05), 0., 0.92);
  vec4 mixed = mix(adv, n, bleedAmt);
  o = mix(cur, mixed, mob) * uPigmentDecay;
}`;

const divergenceFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform vec2 uTexel;
void main(){
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.)).x;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uVelocity, vUv - vec2(0., uTexel.y)).y;
  float T = texture(uVelocity, vUv + vec2(0., uTexel.y)).y;
  o = vec4(0.5 * (R - L + T - B), 0., 0., 1.);
}`;

const pressureFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uPressure, uDivergence; uniform vec2 uTexel;
void main(){
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uPressure, vUv - vec2(0., uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0., uTexel.y)).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((L + R + B + T - div) * 0.25, 0., 0., 1.);
}`;

const gradSubFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uPressure, uVelocity; uniform vec2 uTexel;
void main(){
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uPressure, vUv - vec2(0., uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0., uTexel.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy - 0.5 * vec2(R - L, T - B);
  o = vec4(vel, 0., 1.);
}`;

const curlFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity; uniform vec2 uTexel;
void main(){
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.)).y;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.)).y;
  float B = texture(uVelocity, vUv - vec2(0., uTexel.y)).x;
  float T = texture(uVelocity, vUv + vec2(0., uTexel.y)).x;
  o = vec4(0.5 * ((R - L) - (T - B)), 0., 0., 1.);
}`;

const vorticityFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity, uCurl;
uniform vec2 uTexel; uniform float uCurlAmt, uDt;
void main(){
  float L = texture(uCurl, vUv - vec2(uTexel.x, 0.)).x;
  float R = texture(uCurl, vUv + vec2(uTexel.x, 0.)).x;
  float B = texture(uCurl, vUv - vec2(0., uTexel.y)).x;
  float T = texture(uCurl, vUv + vec2(0., uTexel.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 1e-4;
  force *= uCurlAmt * C * vec2(1., -1.);
  vec2 vel = texture(uVelocity, vUv).xy + force * uDt;
  o = vec4(clamp(vel, -1000., 1000.), 0., 1.);
}`;

// pigment exchange between the mobile ink and the fixed (dried) layer:
// fixing settles mobile ink down; water (and scrubbing) slowly lifts fixed ink back up
const exchangeFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uFixed, uInk, uWet;
uniform float uSettle, uDt, uAspect, uMode;
uniform vec3 uBrush;
void main(){
  vec4 F = texture(uFixed, vUv);
  vec4 M = texture(uInk, vUv);
  float w = clamp(texture(uWet, vUv).x, 0., 1.);
  float brush = 0.;
  if (uBrush.z > 0.){
    vec2 d = vUv - uBrush.xy; d.x *= uAspect;
    brush = exp(-dot(d,d) / (uBrush.z * uBrush.z));
  }
  // re-wetting lift disabled: it haloed fresh strokes drawn over fixed work and
  // desaturated multi-layer paintings. Restore the line below to bring it back.
  // float lift = clamp(w * (0.04 + 0.35 * brush) * uDt, 0., 0.25);
  float lift = 0.0;
  if (uMode < 0.5){
    vec3 fd = F.rgb * (1.0 - lift) + M.rgb * uSettle;
    float fw = F.a * (1.0 - lift) + M.a * uSettle;
    if (uSettle > 0.0){
      // baking: white bleaches the ink beneath it and becomes part of the paper,
      // so fresh ink can be drawn over it afterwards
      float c = (1.0 - exp(-2.2 * fw)) * uSettle;
      vec3 T = exp(-fd);
      fd = -log(clamp(T * (1.0 - c) + c, 1e-4, 1.0));
      fw *= 1.0 - uSettle;
    }
    o = vec4(fd, fw);
  } else {
    o = M * (1.0 - uSettle) + F * lift;
  }
}`;

const displayFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uInk, uFixed;
uniform float uInkStrength, uMonochrome;
void main(){
  vec3 paper = vec3(.951, .928, .884);
  vec3 absorption = max(vec3(0.), (texture(uInk,vUv).rgb + texture(uFixed,vUv).rgb) * uInkStrength);
  vec3 color = paper * exp(-absorption);
  float luminance = dot(color, vec3(.2126,.7152,.0722));
  color = mix(color, vec3(luminance), uMonochrome);
  o = vec4(color,1.);
}`;

// Broad water currents, added before the pressure projection.
// The target is measured in velocity-grid cells per second; two moving
// counter-rotating eddies create visible curls without accumulating force.
const stirringFS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uVelocity;
uniform float uTime, uDt, uAspect, uHeight, uStrength;
void main(){
  vec2 field = vec2(.032, .009) * uHeight;
  for (int i=0; i<3; i++){
    float j=float(i), t=uTime;
    vec2 center=vec2(.50+.27*sin(t*(.31+.06*j)+j*2.1),
                     .51+.22*cos(t*(.36+.04*j)+j*2.3));
    vec2 d=vUv-center;
    d.x*=uAspect;
    float radius=.23+.04*sin(t*.35+j);
    float envelope=exp(-dot(d,d)/(radius*radius));
    vec2 tangent=vec2(-d.y,d.x)/(length(d)+.015);
    float signDir=(i==1)?-1.:1.;
    field+=tangent*envelope*signDir*(.16*uHeight);
  }
  vec2 current=texture(uVelocity,vUv).xy;
  vec2 result=mix(current,field*uStrength,1.-exp(-uDt*2.5));
  o=vec4(result,0.,1.);
}`;

const progCopy = program(copyFS);
const progSplat = program(splatFS);
const progAdvVel = program(advectVelFS);
const progAdvWet = program(advectWetFS);
const progAdvInk = program(advectInkFS);
const progExch = program(exchangeFS);
const progDiv = program(divergenceFS);
const progPressure = program(pressureFS);
const progGradSub = program(gradSubFS);
const progCurl = program(curlFS);
const progVort = program(vorticityFS);
const progDisplay = program(displayFS);
const progStir = program(stirringFS);

const HF = gl.HALF_FLOAT;
let velocity, divergence, curl, pressure, ink, fixed, wet;

function initTargets(){
  const sim = getRes(SIM_BASE), dye = getRes(DYE_BASE);
  velocity  = createDouble(sim.w, sim.h, gl.RG16F, gl.RG, HF, inkFilter);
  divergence= createFBO(sim.w, sim.h, gl.R16F, gl.RED, HF, gl.NEAREST);
  curl      = createFBO(sim.w, sim.h, gl.R16F, gl.RED, HF, gl.NEAREST);
  pressure  = createDouble(sim.w, sim.h, gl.R16F, gl.RED, HF, gl.NEAREST);
  ink       = createDouble(dye.w, dye.h, gl.RGBA16F, gl.RGBA, HF, inkFilter);
  fixed     = createDouble(dye.w, dye.h, gl.RGBA16F, gl.RGBA, HF, inkFilter);
  wet       = createDouble(dye.w, dye.h, gl.R16F, gl.RED, HF, inkFilter);
}
initTargets();

function copyInto(srcTex, dst){
  progCopy.bind();
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, srcTex);
  gl.uniform1i(progCopy.u.uTex, 0);
  gl.uniform1f(progCopy.u.uValue, 1.0);
  blit(dst);
}

function clearAll(){
  for (const d of [velocity, pressure, ink, fixed, wet]){
    for (const f of [d.read, d.write]){
      gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }
}

/* ---------------- splats (blended, scissored) ---------------- */

function splat(target, x, y, r, c, useMax){
  const f = target.read;
  gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
  gl.viewport(0, 0, f.w, f.h);
  const ex = Math.ceil(r * 4.5 * f.h) + 2;
  const cx = Math.round(x * f.w), cy = Math.round(y * f.h);
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(Math.max(cx - ex, 0), Math.max(cy - ex, 0), ex * 2, ex * 2);
  gl.enable(gl.BLEND);
  if (useMax) gl.blendEquation(gl.MAX);
  else { gl.blendEquation(gl.FUNC_ADD); gl.blendFunc(gl.ONE, gl.ONE); }
  progSplat.bind();
  gl.uniform1f(progSplat.u.uAspect, canvas.width / canvas.height);
  gl.uniform2f(progSplat.u.uPoint, x, y);
  gl.uniform4f(progSplat.u.uColor, c[0], c[1], c[2], c[3]);
  gl.uniform1f(progSplat.u.uRadius, r * r);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.blendEquation(gl.FUNC_ADD);
  gl.disable(gl.BLEND);
  gl.disable(gl.SCISSOR_TEST);
}

function step(dt, active, mid, bass, calm){
  const fixing = false;

  // velocity: advect + damp, confined to wet paper (frozen hard while fixing)
  progAdvVel.bind();
  gl.uniform1i(progAdvVel.u.uVelocity, velocity.read.attach(0));
  gl.uniform1i(progAdvVel.u.uWet, wet.read.attach(1));
  gl.uniform2f(progAdvVel.u.uTexel, velocity.texel[0], velocity.texel[1]);
  gl.uniform1f(progAdvVel.u.uDt, dt);
  gl.uniform1f(progAdvVel.u.uDissipation,
               Math.exp(-dt * (3.0 - P.FLOW * 2.4)) * (fixing ? Math.exp(-dt * 7) : 1));
  blit(velocity.write); velocity.swap();

  progCurl.bind();
  gl.uniform1i(progCurl.u.uVelocity, velocity.read.attach(0));
  gl.uniform2f(progCurl.u.uTexel, velocity.texel[0], velocity.texel[1]);
  blit(curl);

  progVort.bind();
  gl.uniform1i(progVort.u.uVelocity, velocity.read.attach(0));
  gl.uniform1i(progVort.u.uCurl, curl.attach(1));
  gl.uniform2f(progVort.u.uTexel, velocity.texel[0], velocity.texel[1]);
  gl.uniform1f(progVort.u.uCurlAmt, 4 + P.FLOW * 22);
  gl.uniform1f(progVort.u.uDt, dt);
  blit(velocity.write); velocity.swap();

  if (active) {
    progStir.bind();
    gl.uniform1i(progStir.u.uVelocity, velocity.read.attach(0));
    gl.uniform1f(progStir.u.uTime, simClock);
    gl.uniform1f(progStir.u.uDt, dt);
    gl.uniform1f(progStir.u.uAspect, canvas.width / canvas.height);
    gl.uniform1f(progStir.u.uHeight, velocity.h);
    gl.uniform1f(progStir.u.uStrength, (1 + mid*.8 + bass*.5) * (1 - calm*.58));
    blit(velocity.write); velocity.swap();
  }

  progDiv.bind();
  gl.uniform1i(progDiv.u.uVelocity, velocity.read.attach(0));
  gl.uniform2f(progDiv.u.uTexel, velocity.texel[0], velocity.texel[1]);
  blit(divergence);

  progCopy.bind();
  gl.uniform1i(progCopy.u.uTex, pressure.read.attach(0));
  gl.uniform1f(progCopy.u.uValue, 0.8);
  blit(pressure.write); pressure.swap();

  progPressure.bind();
  gl.uniform1i(progPressure.u.uDivergence, divergence.attach(1));
  gl.uniform2f(progPressure.u.uTexel, velocity.texel[0], velocity.texel[1]);
  for (let i = 0; i < PRESSURE_ITER; i++){
    gl.uniform1i(progPressure.u.uPressure, pressure.read.attach(0));
    blit(pressure.write); pressure.swap();
  }

  progGradSub.bind();
  gl.uniform1i(progGradSub.u.uPressure, pressure.read.attach(0));
  gl.uniform1i(progGradSub.u.uVelocity, velocity.read.attach(1));
  gl.uniform2f(progGradSub.u.uTexel, velocity.texel[0], velocity.texel[1]);
  blit(velocity.write); velocity.swap();

  // water dries; DRY slider sets the timescale (flash-dries while fixing)
  const dryTau = fixing ? 0.25 : 2 + (1 - P.DRY) * 16;
  progAdvWet.bind();
  gl.uniform1i(progAdvWet.u.uVelocity, velocity.read.attach(0));
  gl.uniform1i(progAdvWet.u.uWet, wet.read.attach(1));
  gl.uniform2f(progAdvWet.u.uTexel, velocity.texel[0], velocity.texel[1]);
  gl.uniform2f(progAdvWet.u.uSrcTexel, wet.texel[0], wet.texel[1]);
  gl.uniform1f(progAdvWet.u.uDt, dt);
  gl.uniform1f(progAdvWet.u.uDecay, Math.exp(-dt / dryTau));
  gl.uniform1f(progAdvWet.u.uSpread, 0.18);
  gl.uniform1f(progAdvWet.u.uBaseline, active ? .45 + bass*.12 : 0);
  blit(wet.write); wet.swap();

  // pigment: flows and bleeds only where wet
  const C = P.COLOR;
  progAdvInk.bind();
  gl.uniform1i(progAdvInk.u.uVelocity, velocity.read.attach(0));
  gl.uniform1i(progAdvInk.u.uSource, ink.read.attach(1));
  gl.uniform1i(progAdvInk.u.uWet, wet.read.attach(2));
  gl.uniform2f(progAdvInk.u.uTexel, velocity.texel[0], velocity.texel[1]);
  gl.uniform2f(progAdvInk.u.uSrcTexel, ink.texel[0], ink.texel[1]);
  gl.uniform1f(progAdvInk.u.uDt, dt);
  gl.uniform1f(progAdvInk.u.uBleed, P.BLEED);
  gl.uniform1f(progAdvInk.u.uAspect, canvas.width / canvas.height);
  gl.uniform3f(progAdvInk.u.uChroma, 1.0 + 0.85 * C, 1.0 + 0.15 * C, Math.max(0.25, 1.0 - 0.65 * C));
  gl.uniform3f(progAdvInk.u.uBrush, 0, 0, 0);
  gl.uniform1f(progAdvInk.u.uPigmentDecay, Math.exp(-dt / 17));
  blit(ink.write); ink.swap();

  // fixing is always false, so settle and lift are both zero. The exchange
  // shader would copy fixed→fixed and ink→ink; omitting those two passes is exact.
}

function render(){
  if (disposed || !renderDirty) return;
  renderDirty = false;
  progDisplay.bind();
  gl.uniform1i(progDisplay.u.uInk, ink.read.attach(0));
  gl.uniform1i(progDisplay.u.uWet, wet.read.attach(1));
  gl.uniform1i(progDisplay.u.uFixed, fixed.read.attach(2));
  gl.uniform2f(progDisplay.u.uTexel, ink.texel[0], ink.texel[1]);
  gl.uniform2f(progDisplay.u.uRes, canvas.width, canvas.height);
  gl.uniform1f(progDisplay.u.uInkStrength, 2.25);
  gl.uniform1f(progDisplay.u.uEdge, 1.35);
  gl.uniform1f(progDisplay.u.uGrain, 0.55);
  gl.uniform1f(progDisplay.u.uWhiteTint, P.COLOR * 0.35);
  gl.uniform1f(progDisplay.u.uMonochrome, monochrome ? 1.0 : 0.0);
  blit(null);
}


  function resize(width, height) {
    if (disposed) return;
    const scale = Math.min(devicePixelRatio || 1, 1.5, 960 / Math.max(width, height));
    const w = Math.max(2, Math.round(width * scale));
    const h = Math.max(2, Math.round(height * scale));
    if (canvas.width === w && canvas.height === h && ink) return;
    canvas.width = w; canvas.height = h;
    destroyTargets();
    initTargets();
    renderDirty = true;
    accumulator = 0;
    seed(simClock);
    render();
  }
  function inject(x, y, radius, amount, flowX = 0, flowY = 0, hue = 0, water = .82) {
    if (disposed) return;
    // Optical absorption, approximately -log(target color / paper color).
    const palette = [[.64,.30,.28], [.66,.47,.19], [.17,.62,.82], [.40,.26,.31]];
    const c = palette[hue % palette.length];
    const pigment = Math.min(.07, amount * (hue === 2 ? 1.8 : 1.5));
    splat(ink, x, y, radius, [c[0]*pigment,c[1]*pigment,c[2]*pigment,0], false);
    splat(wet, x, y, radius*2.5, [water,0,0,0], true);
    if (flowX || flowY) splat(velocity, x, y, radius*1.1, [flowX,flowY,0,0], false);
  }
  function seed(time = 0) {
    // Curved washes are visible before playback begins.
    for (let i=0;i<emitters.length;i++) {
      for (let j=0;j<15;j++) {
        const a=j/14;
        const x=.24+a*.5+.025*Math.sin(a*8+i*2.1+time*.13);
        const y=.35+i*.14+.045*Math.sin(a*5+i-time*.11);
        inject(x,y,.033,.022,0,0,i,.74);
      }
    }
  }
  function reset(time = 0) {
    simClock = Math.max(0, time);
    accumulator = 0;
    clearAll();
    seed(simClock);
    renderDirty = true;
    render();
  }
  function update(dt, bands = {}, calm = 0, playing = false) {
    if (disposed) return;
    const bass=Math.max(0,bands.bass||0), mid=Math.max(0,bands.mid||0), high=Math.max(0,bands.treble||0);
    accumulator=Math.min(.1,accumulator+Math.min(dt,.05));
    const interval=1/30;
    while (accumulator>=interval) {
      accumulator-=interval;
      simClock+=interval;
      if (playing) {
        const strength=1-calm*.65;
        for (let i=0;i<emitters.length;i++) {
          const e=emitters[i], t=simClock, phase=e.phase;
          const x=.5+.32*Math.sin(t*(.32+i*.08)+phase);
          const y=.5+.27*Math.sin(t*(.43+i*.05)+phase*.8);
          const radius=.050+bass*.025+.008*Math.sin(t*.6+phase);
          const amount=(.0028+bass*.006+mid*.0024)*strength;
          inject(x,y,radius,amount,0,0,e.hue,.75+bass*.2);
          if (high>.08 && i<2 && Math.sin(t*4+i*3)>.1)
            inject(x+.07*Math.sin(t*1.7+i),y+.055*Math.cos(t*1.9+i),.009,.001+high*.003,0,0,e.hue,.45);
        }
      }
      step(interval,playing,mid,bass,calm);
      renderDirty=true;
    }
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    destroyTargets();
    for (const p of programs) gl.deleteProgram(p);
    for (const s of shaders) gl.deleteShader(s);
    gl.deleteBuffer(vbo); gl.deleteVertexArray(vao);
  }
  function setMonochrome(value) {
    monochrome = !!value;
    renderDirty = true;
  }
  return {resize, reset, inject, update, render, setMonochrome, dispose};
}
