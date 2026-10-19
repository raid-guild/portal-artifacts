// Port of Yohei Nishitsuji's 2025 MIT-licensed GLSL sketch.
// Exact published expression and attribution: vendor/fold-LICENSE.txt.
// Clouds retains the published field expression; the optional structures
// transform its mapped coordinates before the same accumulation loop.
const VERT = `#version 300 es
precision highp float;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;
const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 r;
uniform float t;
uniform float uRoll;
uniform int uStructure;
void main(){
  vec4 o=vec4(0.0);
  vec2 FC=gl_FragCoord.xy;
  if(uRoll!=0.0){float cs=cos(uRoll),sn=sin(uRoll);FC=r*.5+mat2(cs,-sn,sn,cs)*(FC-r*.5);}
  float i=0.0,e=0.0,R=1.0,s=0.0;
  vec3 q=vec3(0.0),p=vec3(0.0),d=vec3(-FC.yx/r.y*.8*(abs(cos(t*.3)*.3+.1+.8)),1.0);
  q--;
  for(int iter=0;iter<119;iter++){
    i+=1.0;
    e+=i/5e3;
    o+=e*e/25.0;
    s=1.0;
    p=q+=d*e*R*.16;
    R=max(length(p),1e-6);
    p=vec3(log2(R)-2.0-t*.3,-p.z/R,atan(p.x,p.y));
    if(uStructure==1){
      // Broad angular chambers with a slower change along the travel axis.
      p.x*=.58;
      p.z=.55*sin(p.z*2.0);
      p.y=p.y*.58+.22*cos(p.x*1.6)*cos(p.z*2.4);
    }else if(uStructure==2){
      // Compressed travel and stretched angular coordinates make long bands.
      p.x=p.x*.3+.12*sin(p.z*2.0);
      p.z=p.z*1.7+.35*sin(p.x*.8);
      p.y+=.12*sin(p.x*1.3+p.z*.4);
    }
    e=--p.y;
    for(int inner=0;inner<17;inner++){
      if(s>=1e5)break;
      e+=cos(dot(cos(p.zyy*s),cos(p.xyx*s)))/s;
      s+=s;
    }
    if(i>89.0)d/=-d;
  }
  // Only the final scalar color grade differs from the published grayscale light.
  float light=max(o.r,0.0);
  vec3 teal=vec3(0.07,0.55,0.53),copper=vec3(0.91,0.43,0.20),chrome=vec3(0.83,0.92,0.91);
  vec3 tint=mix(teal,copper,smoothstep(0.45,1.05,light));
  tint=mix(tint,chrome,smoothstep(1.02,1.80,light));
  outColor=vec4(tint*pow(light,0.82),1.0);
}`;
export function createFold(canvas){
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true});
  if(!gl)throw new Error('WebGL2 unavailable');
  const resources=[];let disposed=false,w=0,h=0;
  function shader(type,source){const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);if(!gl.getShaderParameter(item,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(item);gl.deleteShader(item);throw new Error(error);}resources.push(['shader',item]);return item;}
  let program;
  try{program=gl.createProgram();resources.push(['program',program]);gl.attachShader(program,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));}
  catch(error){for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);throw error;}
  const resolution=gl.getUniformLocation(program,'r'),time=gl.getUniformLocation(program,'t'),roll=gl.getUniformLocation(program,'uRoll'),structure=gl.getUniformLocation(program,'uStructure');
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  function resize(width,height){if(disposed)return;const maxPixels=matchMedia('(max-width:620px)').matches?140000:240000;const scale=Math.min(1,Math.sqrt(maxPixels/(width*height)));w=Math.max(1,Math.round(width*scale));h=Math.max(1,Math.round(height*scale));canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
  function render(seconds,reduced=false,bank=0,selectedStructure=0){if(disposed||!w)return;gl.viewport(0,0,w,h);gl.disable(gl.BLEND);gl.useProgram(program);gl.uniform2f(resolution,w,h);gl.uniform1f(time,reduced?0:Math.max(0,seconds));gl.uniform1f(roll,bank);gl.uniform1i(structure,selectedStructure);gl.drawArrays(gl.TRIANGLES,0,3);}
  function dispose(){if(disposed)return;disposed=true;gl.deleteVertexArray(vao);for(const [type,item] of resources)type==='shader'?gl.deleteShader(item):gl.deleteProgram(item);}
  return {resize,render,dispose};
}
