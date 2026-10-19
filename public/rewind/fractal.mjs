// Port of Yohei Nishitsuji's MIT-licensed GLSL sketch (source and attribution
// in vendor/fractal-LICENSE.txt). Only initialization, a finite radius guard,
// a standard HSV helper, and a teal/copper/chrome color grade adapt the published expression.
const VERT = `#version 300 es
precision highp float;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;
const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 r;
uniform float t;
vec3 hsv(float h,float s,float v){vec3 rgb=clamp(abs(fract(h+vec3(0.0,2.0/3.0,1.0/3.0))*6.0-3.0)-1.0,0.0,1.0);return v*mix(vec3(1.0),rgb,s);}
void main(){
  vec4 o=vec4(0.0);
  vec2 FC=gl_FragCoord.xy;
  float i=0.0,e=0.0,g=0.0,R=1.0,s=0.0;
  vec3 q=vec3(0.0),p=vec3(0.0),d=vec3((FC.xy*2.0-r)/r.y+vec2(0.0,1.0),1.0);
  q.zy--;
  for(int iter=0;iter<99;iter++){
    i+=1.0;
    e+=i/9e9;
    o.rgb+=hsv(.6,.8,min(e*i,.04));
    s=3.0;
    p=q+=d*e*R*.35+1e-5;
    g+=p.y/s;
    R=max(length(p),1e-6);
    p=vec3(log2(R)+t*.2,exp(mod(-p.z,s)/R-.4),p.x);
    e=--p.y;
    for(int inner=0;inner<11;inner++){
      if(s>=6e3)break;
      e-=abs(dot(sin(p.xz*s),cos(p.zy*s))/s*.3);
      s+=s;
    }
  }
  // Grade the original accumulated light; ray geometry and motion are unchanged.
  float light=max(o.b,0.0);
  vec3 teal=vec3(0.075,0.55,0.51);
  vec3 copper=vec3(0.94,0.43,0.19);
  vec3 chrome=vec3(0.86,0.92,0.90);
  vec3 tint=mix(teal,copper,smoothstep(0.18,0.72,light));
  tint=mix(tint,chrome,smoothstep(0.70,1.18,light));
  vec3 graded=tint*pow(light,0.82);
  outColor=vec4(graded,1.0);
}`;
export function createFractal(canvas){
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true});
  if(!gl)throw new Error('WebGL2 unavailable');
  const resources=[];let disposed=false,w=0,h=0;
  function shader(type,source){const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);if(!gl.getShaderParameter(item,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(item);gl.deleteShader(item);throw new Error(error);}resources.push(['shader',item]);return item;}
  let program;
  try{program=gl.createProgram();resources.push(['program',program]);gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));}
  catch(error){for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);throw error;}
  const resolution=gl.getUniformLocation(program,'r'),time=gl.getUniformLocation(program,'t');
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  function resize(width,height){if(disposed)return;const maxPixels=matchMedia('(max-width:620px)').matches?200000:350000;const scale=Math.min(1,Math.sqrt(maxPixels/(width*height)));w=Math.max(1,Math.round(width*scale));h=Math.max(1,Math.round(height*scale));canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
  function render(seconds,reduced=false){if(disposed||!w)return;gl.viewport(0,0,w,h);gl.disable(gl.BLEND);gl.useProgram(program);gl.uniform2f(resolution,w,h);gl.uniform1f(time,reduced?0:Math.max(0,seconds));gl.drawArrays(gl.TRIANGLES,0,3);}
  function dispose(){if(disposed)return;disposed=true;gl.deleteVertexArray(vao);for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);}
  return {resize,render,dispose};
}
