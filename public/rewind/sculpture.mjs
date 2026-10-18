// Continuous interior fluid-chrome field. The nested noise technique is
// inspired by Torin Blankensmith's Shader Park tutorial; this is independent
// GLSL with no Shader Park or Three.js runtime dependency.
const VERT = `#version 300 es
precision highp float;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p*2.0-1.0,0.0,1.0);
}`;
const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform vec4 uEnergy; // bass, mids, treble, upper-mid attack
uniform float uDrive; // steady playback-time flow; no attack-driven movement
float hash(vec3 p) { p=fract(p*0.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float noise(vec3 x) {
  vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float roundedBox(vec3 p,vec3 halfSize,float radius) {
  vec3 q=abs(p)-halfSize;
  return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-radius;
}
float field(vec3 p) {
  vec3 flow=vec3(uDrive*0.31,-uDrive*0.19,uDrive*0.23);
  float first=noise(p*0.46+flow);
  float second=noise(p*0.91+vec3(first*1.46,-first*1.19,first*0.82)+flow*0.57);
  float tension=1.12;
  vec3 q=p+tension*vec3(first-0.5,second-0.5,0.42*sin(p.y*0.90+second*4.3+uDrive*0.18));
  float sphere=(length(q/vec3(3.82,3.20,4.44))-1.0)*3.4;
  float box=roundedBox(q,vec3(3.54,2.85,4.12),0.76);
  float ridge=sin(q.y*1.43+q.x*0.57+second*4.4+uDrive*0.23)*0.26;
  return mix(sphere,box,0.48)+ridge;
}
vec3 normalAt(vec3 p) {
  const float e=0.018;
  // Tetrahedral gradient uses four field samples instead of six.
  return normalize(vec3( 1, -1, -1)*field(p+e*vec3( 1,-1,-1))+
                   vec3(-1, -1,  1)*field(p+e*vec3(-1,-1, 1))+
                   vec3(-1,  1, -1)*field(p+e*vec3(-1, 1,-1))+
                   vec3( 1,  1,  1)*field(p+e*vec3( 1, 1, 1)));
}
void main() {
  vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
  // Warp the viewing direction first, then project into the spatially warped
  // field. Every ray shades a final projection, even when it has not converged.
  float seed=noise(vec3(uv*1.64,uDrive*0.11));
  vec2 rayFold=vec2(noise(vec3(uv*2.18+seed*0.7,uDrive*0.13)),
                    noise(vec3(uv.yx*1.91-seed*0.6,-uDrive*0.09)))-0.5;
  vec3 rd=normalize(vec3(uv+rayFold*0.125,-1.42));
  float travel=3.55;
#ifdef MOBILE
  const int PROJECT_STEPS=5;
#else
  const int PROJECT_STEPS=7;
#endif
  for(int i=0;i<PROJECT_STEPS;i++) {
    float distance=field(rd*travel);
    travel=clamp(travel-clamp(distance,-0.72,0.72)*0.72,1.75,7.5);
  }
  vec3 pos=rd*travel;
  vec3 n=normalAt(pos);
  if(dot(n,-rd)<0.0)n=-n;
  vec3 reflected=reflect(rd,n);
  float broadPanel=exp(-pow((reflected.x+0.36)/0.35,4.0))*smoothstep(-0.48,-0.06,reflected.y);
  float upperPanel=exp(-pow((reflected.y-0.54)/0.20,4.0))*smoothstep(-0.9,-0.25,reflected.x);
  float sidePanel=exp(-pow((dot(reflected,normalize(vec3(0.78,0.19,0.59)))-0.69)/0.26,4.0));
  float darkRibbon=exp(-pow((reflected.y+0.10+0.14*reflected.x)/0.19,4.0));
  vec3 flow=vec3(uDrive*0.13,-uDrive*0.09,uDrive*0.08);
  float region=noise(pos*0.33+flow);
  vec3 teal=vec3(0.20,0.62,0.65), slate=vec3(0.34,0.47,0.67), copper=vec3(0.65,0.36,0.27);
  vec3 body=mix(teal,slate,smoothstep(0.43,0.82,region+0.10*sin(pos.x*0.37)));
  float copperBand=smoothstep(0.50,0.76,noise(pos*0.37+flow.yzx))*0.48;
  body=mix(body,copper,copperBand);
  float broadLight=max(dot(n,normalize(vec3(-0.44,0.70,0.57))),0.0);
  float fresnel=pow(1.0-max(dot(n,-rd),0.0),2.0);
  vec3 color=body*(0.53+0.28*broadLight);
  color+=vec3(0.98,0.93,0.82)*(0.43*broadPanel+0.32*upperPanel+0.23*sidePanel)*(0.74+0.18*uEnergy.z);
  color-=body*darkRibbon*0.22;
  color=mix(color,body*1.08,0.13);
  color=mix(color,copper*0.64,darkRibbon*copperBand*0.17);
  color+=mix(vec3(0.32,0.64,0.67),vec3(0.80,0.58,0.43),region)*fresnel*0.19;
  // Slightly quiet the center under the wall while preserving the surface.
  float center=exp(-dot(uv*vec2(2.15,1.85),uv*vec2(2.15,1.85)));
  color=mix(color,vec3(0.84,0.84,0.80),0.12*center);
  outColor=vec4(pow(clamp(color,0.0,1.0),vec3(0.94)),1.0);
}`;
export function createSculpture(canvas) {
  // Preserve the exact last projected frame while playback is paused.
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true});
  if(!gl)throw new Error('WebGL2 unavailable');
  const resources=[];
  let disposed=false,w=0,h=0;
  function shader(type,source) {
    const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);
    if(!gl.getShaderParameter(item,gl.COMPILE_STATUS)) {const error=gl.getShaderInfoLog(item);gl.deleteShader(item);throw new Error(error);}
    resources.push(['shader',item]);return item;
  }
  let program;
  try {
    program=gl.createProgram();resources.push(['program',program]);
    const mobile=matchMedia('(max-width: 620px)').matches;
    gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,mobile?FRAG.replace('#version 300 es','#version 300 es\n#define MOBILE'):FRAG));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
  } catch(error) {for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);throw error;}
  const uniforms={resolution:gl.getUniformLocation(program,'uResolution'),energy:gl.getUniformLocation(program,'uEnergy'),drive:gl.getUniformLocation(program,'uDrive')};
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  function resize(width,height) {
    if(disposed)return;
    const maxPixels=matchMedia('(max-width: 620px)').matches?350000:550000;
    const scale=Math.min(1,Math.sqrt(maxPixels/(width*height)));
    w=Math.max(1,Math.round(width*scale));h=Math.max(1,Math.round(height*scale));
    canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);
  }
  function render(_time,energy,reduced=false) {
    if(disposed||!w)return;
    const e=reduced?{bass:0,mid:0,treble:0,pulse:0,drive:0}:energy;
    gl.viewport(0,0,w,h);gl.disable(gl.BLEND);gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,w,h);
    gl.uniform4f(uniforms.energy,e.bass||0,e.mid||0,e.treble||0,e.pulse||0);
    gl.uniform1f(uniforms.drive,e.drive||0);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function dispose() {if(disposed)return;disposed=true;gl.deleteVertexArray(vao);for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);}
  return {resize,render,dispose};
}
