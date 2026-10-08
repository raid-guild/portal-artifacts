/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const c1=0,l1=1,h1=2;const ja="attached",Fh="detached";const u1=1e3,f1=1001,d1=1002,p1=1003,m1=1004,g1=1005,x1=1006,_1=1007,y1=1008;const v1=2300,M1=2301;const S1=0,b1=1,T1=2;const Ye="srgb",Hi="srgb-linear",kr="linear",se="srgb";const Qa="300 es";class qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let tc=1234567;const ki=Math.PI/180,Wi=180/Math.PI;function nn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Wt(i,t,e){return Math.max(t,Math.min(e,i))}function Ea(i,t){return(i%t+t)%t}function zh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Bh(i,t,e){return i!==t?(e-i)/(t-i):0}function ys(i,t,e){return(1-e)*i+e*t}function Oh(i,t,e,n){return ys(i,t,1-Math.exp(-e*n))}function Vh(i,t=1){return t-Math.abs(Ea(i,t*2)-t)}function kh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Gh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Hh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Wh(i,t){return i+Math.random()*(t-i)}function Xh(i){return i*(.5-Math.random())}function Zh(i){i!==void 0&&(tc=i);let t=tc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function qh(i){return i*ki}function Yh(i){return i*Wi}function $h(i){return(i&i-1)===0&&i!==0}function Jh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Kh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jh(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*x,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*x,a*l);break;case"ZYZ":i.set(c*x,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ne(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const E1={DEG2RAD:ki,RAD2DEG:Wi,generateUUID:nn,clamp:Wt,euclideanModulo:Ea,mapLinear:zh,inverseLerp:Bh,lerp:ys,damp:Oh,pingpong:Vh,smoothstep:kh,smootherstep:Gh,randInt:Hh,randFloat:Wh,randFloatSpread:Xh,seededRandom:Zh,degToRad:qh,radToDeg:Yh,isPowerOfTwo:$h,ceilPowerOfTwo:Jh,floorPowerOfTwo:Kh,setQuaternionFromProperEuler:jh,normalize:ne,denormalize:cn};class at{constructor(t=0,e=0){at.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],x=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=x,t[e+3]=v;return}if(u!==v||c!==f||l!==d||h!==x){let _=1-a;const p=c*f+l*d+h*x+u*v,y=p>=0?1:-1,m=1-p*p;if(m>Number.EPSILON){const M=Math.sqrt(m),T=Math.atan2(M,p*y);_=Math.sin(_*T)/M,a=Math.sin(a*T)/M}const g=a*y;if(c=c*_+f*g,l=l*_+d*g,h=h*_+x*g,u=u*_+v*g,_===1-a){const M=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=M,l*=M,h*=M,u*=M}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],x=r[o+3];return t[e]=a*x+h*u+c*d-l*f,t[e+1]=c*x+h*f+l*u-a*d,t[e+2]=l*x+h*d+a*f-c*u,t[e+3]=h*x-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u-f*d*x;break;case"YXZ":this._x=f*h*u+l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u+f*d*x;break;case"ZXY":this._x=f*h*u-l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u-f*d*x;break;case"ZYX":this._x=f*h*u-l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u+f*d*x;break;case"YZX":this._x=f*h*u+l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u-f*d*x;break;case"XZY":this._x=f*h*u-l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u+f*d*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ec.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ec.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ao.copy(this).projectOnVector(t),this.sub(ao)}reflect(t){return this.sub(ao.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ao=new L,ec=new Yi;class Yt{constructor(t,e,n,s,r,o,a,c,l){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],x=n[8],v=s[0],_=s[3],p=s[6],y=s[1],m=s[4],g=s[7],M=s[2],T=s[5],A=s[8];return r[0]=o*v+a*y+c*M,r[3]=o*_+a*m+c*T,r[6]=o*p+a*g+c*A,r[1]=l*v+h*y+u*M,r[4]=l*_+h*m+u*T,r[7]=l*p+h*g+u*A,r[2]=f*v+d*y+x*M,r[5]=f*_+d*m+x*T,r[8]=f*p+d*g+x*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,x=e*u+n*f+s*d;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/x;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=f*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=d*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(co.makeScale(t,e)),this}rotate(t){return this.premultiply(co.makeRotation(-t)),this}translate(t,e){return this.premultiply(co.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const co=new Yt;function Ol(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Es(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Qh(){const i=Es("canvas");return i.style.display="block",i}const nc={};function As(i){i in nc||(nc[i]=!0,console.warn(i))}function tu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const ic=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sc=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function eu(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===se&&(s.r=In(s.r),s.g=In(s.g),s.b=In(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===se&&(s.r=Gi(s.r),s.g=Gi(s.g),s.b=Gi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===""?kr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return As("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return As("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:t,whitePoint:n,transfer:kr,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ye},outputColorSpaceConfig:{drawingBufferColorSpace:Ye}},[Ye]:{primaries:t,whitePoint:n,transfer:se,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ye}}}),i}const Qt=eu();function In(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Gi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let fi;class nu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{fi===void 0&&(fi=Es("canvas")),fi.width=t.width,fi.height=t.height;const s=fi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=fi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Es("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=In(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(In(e[n]/255)*255):e[n]=In(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let iu=0;class Aa{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=nn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(lo(s[o].image)):r.push(lo(s[o]))}else r=lo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function lo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?nu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let su=0;const ho=new L;class Le extends qi{constructor(t=Le.DEFAULT_IMAGE,e=Le.DEFAULT_MAPPING,n=1001,s=1001,r=1006,o=1008,a=1023,c=1009,l=Le.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=nn(),this.name="",this.source=new Aa(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ho).x}get height(){return this.source.getSize(ho).y}get depth(){return this.source.getSize(ho).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==300)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case 1e3:t.x=t.x-Math.floor(t.x);break;case 1001:t.x=t.x<0?0:1;break;case 1002:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case 1e3:t.y=t.y-Math.floor(t.y);break;case 1001:t.y=t.y<0?0:1;break;case 1002:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=300;Le.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,s=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],x=c[9],v=c[2],_=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(x-_)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(x+_)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const m=(l+1)/2,g=(d+1)/2,M=(p+1)/2,T=(h+f)/4,A=(u+v)/4,E=(x+_)/4;return m>g&&m>M?m<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(m),s=T/n,r=A/n):g>M?g<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),n=T/s,r=E/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=A/r,s=E/r),this.set(n,s,r,e),this}let y=Math.sqrt((_-x)*(_-x)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(_-x)/y,this.y=(u-v)/y,this.z=(f-h)/y,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ru extends qi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Le(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Aa(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends ru{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Vl extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ou extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ie{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(r,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(t.matrixWorld),this.union(zs)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qi),Bs.subVectors(this.max,Qi),di.subVectors(t.a,Qi),pi.subVectors(t.b,Qi),mi.subVectors(t.c,Qi),Un.subVectors(pi,di),Nn.subVectors(mi,pi),Jn.subVectors(di,mi);let e=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-Jn.z,Jn.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,Jn.z,0,-Jn.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-Jn.y,Jn.x,0];return!uo(e,di,pi,mi,Bs)||(e=[1,0,0,0,1,0,0,0,1],!uo(e,di,pi,mi,Bs))?!1:(Os.crossVectors(Un,Nn),e=[Os.x,Os.y,Os.z],uo(e,di,pi,mi,Bs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const _n=[new L,new L,new L,new L,new L,new L,new L,new L],sn=new L,zs=new Ie,di=new L,pi=new L,mi=new L,Un=new L,Nn=new L,Jn=new L,Qi=new L,Bs=new L,Os=new L,Kn=new L;function uo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Kn.fromArray(i,r);const a=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),c=t.dot(Kn),l=e.dot(Kn),h=n.dot(Kn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const au=new Ie,ts=new L,fo=new L;class mn{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):au.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ts.subVectors(t,this.center);const e=ts.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ts,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ts.copy(t.center).add(fo)),this.expandByPoint(ts.copy(t.center).sub(fo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const yn=new L,po=new L,Vs=new L,Fn=new L,mo=new L,ks=new L,go=new L;class hi{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,yn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=yn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yn.copy(this.origin).addScaledVector(this.direction,e),yn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){po.copy(t).add(e).multiplyScalar(.5),Vs.copy(e).sub(t).normalize(),Fn.copy(this.origin).sub(po);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Vs),a=Fn.dot(this.direction),c=-Fn.dot(Vs),l=Fn.lengthSq(),h=Math.abs(1-o*o);let u,f,d,x;if(h>0)if(u=o*c-a,f=o*a-c,x=r*h,u>=0)if(f>=-x)if(f<=x){const v=1/h;u*=v,f*=v,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-x?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=x?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(po).addScaledVector(Vs,f),d}intersectSphere(t,e){yn.subVectors(t.center,this.origin);const n=yn.dot(this.direction),s=yn.dot(yn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,yn)!==null}intersectTriangle(t,e,n,s,r){mo.subVectors(e,t),ks.subVectors(n,t),go.crossVectors(mo,ks);let o=this.direction.dot(go),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,t);const c=a*this.direction.dot(ks.crossVectors(Fn,ks));if(c<0)return null;const l=a*this.direction.dot(mo.cross(Fn));if(l<0||c+l>o)return null;const h=-a*Fn.dot(go);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ht{constructor(t,e,n,s,r,o,a,c,l,h,u,f,d,x,v,_){Ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,d,x,v,_)}set(t,e,n,s,r,o,a,c,l,h,u,f,d,x,v,_){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=x,p[11]=v,p[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ht().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/gi.setFromMatrixColumn(t,0).length(),r=1/gi.setFromMatrixColumn(t,1).length(),o=1/gi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,x=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+x*l,e[5]=f-v*l,e[9]=-a*c,e[2]=v-f*l,e[6]=x+d*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,x=l*h,v=l*u;e[0]=f+v*a,e[4]=x*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-x,e[6]=v+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,x=l*h,v=l*u;e[0]=f-v*a,e[4]=-o*u,e[8]=x+d*a,e[1]=d+x*a,e[5]=o*h,e[9]=v-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,d=o*u,x=a*h,v=a*u;e[0]=c*h,e[4]=x*l-d,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=d*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*l,x=a*c,v=a*l;e[0]=c*h,e[4]=v-f*u,e[8]=x*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+x,e[10]=f-v*u}else if(t.order==="XZY"){const f=o*c,d=o*l,x=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+v,e[5]=o*h,e[9]=d*u-x,e[2]=x*u-d,e[6]=a*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(cu,t,lu)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),zn.crossVectors(n,Ze),zn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),zn.crossVectors(n,Ze)),zn.normalize(),Gs.crossVectors(Ze,zn),s[0]=zn.x,s[4]=Gs.x,s[8]=Ze.x,s[1]=zn.y,s[5]=Gs.y,s[9]=Ze.y,s[2]=zn.z,s[6]=Gs.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],x=n[2],v=n[6],_=n[10],p=n[14],y=n[3],m=n[7],g=n[11],M=n[15],T=s[0],A=s[4],E=s[8],b=s[12],S=s[1],w=s[5],R=s[9],I=s[13],U=s[2],F=s[6],B=s[10],k=s[14],z=s[3],X=s[7],J=s[11],rt=s[15];return r[0]=o*T+a*S+c*U+l*z,r[4]=o*A+a*w+c*F+l*X,r[8]=o*E+a*R+c*B+l*J,r[12]=o*b+a*I+c*k+l*rt,r[1]=h*T+u*S+f*U+d*z,r[5]=h*A+u*w+f*F+d*X,r[9]=h*E+u*R+f*B+d*J,r[13]=h*b+u*I+f*k+d*rt,r[2]=x*T+v*S+_*U+p*z,r[6]=x*A+v*w+_*F+p*X,r[10]=x*E+v*R+_*B+p*J,r[14]=x*b+v*I+_*k+p*rt,r[3]=y*T+m*S+g*U+M*z,r[7]=y*A+m*w+g*F+M*X,r[11]=y*E+m*R+g*B+M*J,r[15]=y*b+m*I+g*k+M*rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],x=t[3],v=t[7],_=t[11],p=t[15];return x*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*d-n*c*d)+v*(+e*c*d-e*l*f+r*o*f-s*o*d+s*l*h-r*c*h)+_*(+e*l*u-e*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],x=t[12],v=t[13],_=t[14],p=t[15],y=u*_*l-v*f*l+v*c*d-a*_*d-u*c*p+a*f*p,m=x*f*l-h*_*l-x*c*d+o*_*d+h*c*p-o*f*p,g=h*v*l-x*u*l+x*a*d-o*v*d-h*a*p+o*u*p,M=x*u*c-h*v*c-x*a*f+o*v*f+h*a*_-o*u*_,T=e*y+n*m+s*g+r*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=y*A,t[1]=(v*f*r-u*_*r-v*s*d+n*_*d+u*s*p-n*f*p)*A,t[2]=(a*_*r-v*c*r+v*s*l-n*_*l-a*s*p+n*c*p)*A,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*d-n*c*d)*A,t[4]=m*A,t[5]=(h*_*r-x*f*r+x*s*d-e*_*d-h*s*p+e*f*p)*A,t[6]=(x*c*r-o*_*r-x*s*l+e*_*l+o*s*p-e*c*p)*A,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*d+e*c*d)*A,t[8]=g*A,t[9]=(x*u*r-h*v*r-x*n*d+e*v*d+h*n*p-e*u*p)*A,t[10]=(o*v*r-x*a*r+x*n*l-e*v*l-o*n*p+e*a*p)*A,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*d-e*a*d)*A,t[12]=M*A,t[13]=(h*v*s-x*u*s+x*n*f-e*v*f-h*n*_+e*u*_)*A,t[14]=(x*a*s-o*v*s-x*n*c+e*v*c+o*n*_-e*a*_)*A,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,x=r*u,v=o*h,_=o*u,p=a*u,y=c*l,m=c*h,g=c*u,M=n.x,T=n.y,A=n.z;return s[0]=(1-(v+p))*M,s[1]=(d+g)*M,s[2]=(x-m)*M,s[3]=0,s[4]=(d-g)*T,s[5]=(1-(f+p))*T,s[6]=(_+y)*T,s[7]=0,s[8]=(x+m)*A,s[9]=(_-y)*A,s[10]=(1-(f+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=gi.set(s[0],s[1],s[2]).length();const o=gi.set(s[4],s[5],s[6]).length(),a=gi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const l=1/r,h=1/o,u=1/a;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,e.setFromRotationMatrix(rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=2e3,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let x,v;if(c)x=r/(o-r),v=o*r/(o-r);else if(a===2e3)x=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===2001)x=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=2e3,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),d=-(n+s)/(n-s);let x,v;if(c)x=1/(o-r),v=o/(o-r);else if(a===2e3)x=-2/(o-r),v=-(o+r)/(o-r);else if(a===2001)x=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=x,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const gi=new L,rn=new Ht,cu=new L(0,0,0),lu=new L(1,1,1),zn=new L,Gs=new L,Ze=new L,rc=new Ht,oc=new Yi;class ln{constructor(t=0,e=0,n=0,s=ln.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Wt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return rc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(rc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return oc.setFromEuler(this),this.setFromQuaternion(oc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ln.DEFAULT_ORDER="XYZ";class wa{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let hu=0;const ac=new L,xi=new Yi,vn=new Ht,Hs=new L,es=new L,uu=new L,fu=new Yi,cc=new L(1,0,0),lc=new L(0,1,0),hc=new L(0,0,1),uc={type:"added"},du={type:"removed"},_i={type:"childadded",child:null},xo={type:"childremoved",child:null};class ge extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hu++}),this.uuid=nn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ge.DEFAULT_UP.clone();const t=new L,e=new ln,n=new Yi,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ht},normalMatrix:{value:new Yt}}),this.matrix=new Ht,this.matrixWorld=new Ht,this.matrixAutoUpdate=ge.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.multiply(xi),this}rotateOnWorldAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.premultiply(xi),this}rotateX(t){return this.rotateOnAxis(cc,t)}rotateY(t){return this.rotateOnAxis(lc,t)}rotateZ(t){return this.rotateOnAxis(hc,t)}translateOnAxis(t,e){return ac.copy(t).applyQuaternion(this.quaternion),this.position.add(ac.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cc,t)}translateY(t){return this.translateOnAxis(lc,t)}translateZ(t){return this.translateOnAxis(hc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Hs.copy(t):Hs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(es,Hs,this.up):vn.lookAt(Hs,es,this.up),this.quaternion.setFromRotationMatrix(vn),s&&(vn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(vn),this.quaternion.premultiply(xi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(uc),_i.child=t,this.dispatchEvent(_i),_i.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(du),xo.child=t,this.dispatchEvent(xo),xo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),vn.multiply(t.parent.matrixWorld)),t.applyMatrix4(vn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(uc),_i.child=t,this.dispatchEvent(_i),_i.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,t,uu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,fu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ge.DEFAULT_UP=new L(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new L,Mn=new L,_o=new L,Sn=new L,yi=new L,vi=new L,fc=new L,yo=new L,vo=new L,Mo=new L,So=new te,bo=new te,To=new te;class Re{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),on.subVectors(t,e),s.cross(on);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){on.subVectors(s,e),Mn.subVectors(n,e),_o.subVectors(t,e);const o=on.dot(on),a=on.dot(Mn),c=on.dot(_o),l=Mn.dot(Mn),h=Mn.dot(_o),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,x=(o*h-a*c)*f;return r.set(1-d-x,x,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Sn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Sn.x),c.addScaledVector(o,Sn.y),c.addScaledVector(a,Sn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return So.setScalar(0),bo.setScalar(0),To.setScalar(0),So.fromBufferAttribute(t,e),bo.fromBufferAttribute(t,n),To.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(So,r.x),o.addScaledVector(bo,r.y),o.addScaledVector(To,r.z),o}static isFrontFacing(t,e,n,s){return on.subVectors(n,e),Mn.subVectors(t,e),on.cross(Mn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return on.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),on.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Re.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Re.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Re.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Re.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Re.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;yi.subVectors(s,n),vi.subVectors(r,n),yo.subVectors(t,n);const c=yi.dot(yo),l=vi.dot(yo);if(c<=0&&l<=0)return e.copy(n);vo.subVectors(t,s);const h=yi.dot(vo),u=vi.dot(vo);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(yi,o);Mo.subVectors(t,r);const d=yi.dot(Mo),x=vi.dot(Mo);if(x>=0&&d<=x)return e.copy(r);const v=d*l-c*x;if(v<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(n).addScaledVector(vi,a);const _=h*x-d*u;if(_<=0&&u-h>=0&&d-x>=0)return fc.subVectors(r,s),a=(u-h)/(u-h+(d-x)),e.copy(s).addScaledVector(fc,a);const p=1/(_+v+f);return o=v*p,a=f*p,e.copy(n).addScaledVector(yi,o).addScaledVector(vi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function Eo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Qt.workingColorSpace){if(t=Ea(t,1),e=Wt(e,0,1),n=Wt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Eo(o,r,t+1/3),this.g=Eo(o,r,t),this.b=Eo(o,r,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ye){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ye){const n=kl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=In(t.r),this.g=In(t.g),this.b=In(t.b),this}copyLinearToSRGB(t){return this.r=Gi(t.r),this.g=Gi(t.g),this.b=Gi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ye){return Qt.workingToColorSpace(Ue.copy(this),t),Math.round(Wt(Ue.r*255,0,255))*65536+Math.round(Wt(Ue.g*255,0,255))*256+Math.round(Wt(Ue.b*255,0,255))}getHexString(t=Ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,r=Ue.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Ye){Qt.workingToColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==Ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Bn),this.setHSL(Bn.h+t,Bn.s+e,Bn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Bn),t.getHSL(Ws);const n=ys(Bn.h,Ws.h,e),s=ys(Bn.s,Ws.s,e),r=ys(Bn.l,Ws.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Xt;Xt.NAMES=kl;let pu=0;class qn extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=nn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ra extends qn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ye=new L,Xs=new at;let mu=0;class ve{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Xs.fromBufferAttribute(this,e),Xs.applyMatrix3(t),this.setXY(e,Xs.x,Xs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),r=ne(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==35044&&(t.usage=this.usage),t}}class Gl extends ve{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Hl extends ve{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Jt extends ve{constructor(t,e,n){super(new Float32Array(t),e,n)}}let gu=0;const je=new Ht,Ao=new ge,Mi=new L,qe=new Ie,ns=new Ie,we=new L;class xe extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gu++}),this.uuid=nn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ol(t)?Hl:Gl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return je.makeRotationFromQuaternion(t),this.applyMatrix4(je),this}rotateX(t){return je.makeRotationX(t),this.applyMatrix4(je),this}rotateY(t){return je.makeRotationY(t),this.applyMatrix4(je),this}rotateZ(t){return je.makeRotationZ(t),this.applyMatrix4(je),this}translate(t,e,n){return je.makeTranslation(t,e,n),this.applyMatrix4(je),this}scale(t,e,n){return je.makeScale(t,e,n),this.applyMatrix4(je),this}lookAt(t){return Ao.lookAt(t),Ao.updateMatrix(),this.applyMatrix4(Ao.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Jt(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ie);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ns.setFromBufferAttribute(a),this.morphTargetsRelative?(we.addVectors(qe.min,ns.min),qe.expandByPoint(we),we.addVectors(qe.max,ns.max),qe.expandByPoint(we)):(qe.expandByPoint(ns.min),qe.expandByPoint(ns.max))}qe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)we.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(we));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)we.fromBufferAttribute(a,l),c&&(Mi.fromBufferAttribute(t,l),we.add(Mi)),s=Math.max(s,n.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ve(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let E=0;E<n.count;E++)a[E]=new L,c[E]=new L;const l=new L,h=new L,u=new L,f=new at,d=new at,x=new at,v=new L,_=new L;function p(E,b,S){l.fromBufferAttribute(n,E),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,S),f.fromBufferAttribute(r,E),d.fromBufferAttribute(r,b),x.fromBufferAttribute(r,S),h.sub(l),u.sub(l),d.sub(f),x.sub(f);const w=1/(d.x*x.y-x.x*d.y);isFinite(w)&&(v.copy(h).multiplyScalar(x.y).addScaledVector(u,-d.y).multiplyScalar(w),_.copy(u).multiplyScalar(d.x).addScaledVector(h,-x.x).multiplyScalar(w),a[E].add(v),a[b].add(v),a[S].add(v),c[E].add(_),c[b].add(_),c[S].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let E=0,b=y.length;E<b;++E){const S=y[E],w=S.start,R=S.count;for(let I=w,U=w+R;I<U;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const m=new L,g=new L,M=new L,T=new L;function A(E){M.fromBufferAttribute(s,E),T.copy(M);const b=a[E];m.copy(b),m.sub(M.multiplyScalar(M.dot(b))).normalize(),g.crossVectors(T,b);const w=g.dot(c[E])<0?-1:1;o.setXYZW(E,m.x,m.y,m.z,w)}for(let E=0,b=y.length;E<b;++E){const S=y[E],w=S.start,R=S.count;for(let I=w,U=w+R;I<U;I+=3)A(t.getX(I+0)),A(t.getX(I+1)),A(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ve(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,u=new L;if(t)for(let f=0,d=t.count;f<d;f+=3){const x=t.getX(f+0),v=t.getX(f+1),_=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,_),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,_),a.add(h),c.add(h),l.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(_,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,x=0;for(let v=0,_=c.length;v<_;v++){a.isInterleavedBufferAttribute?d=c[v]*a.data.stride+a.offset:d=c[v]*h;for(let p=0;p<h;p++)f[x++]=l[d++]}return new ve(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dc=new Ht,jn=new hi,Zs=new mn,pc=new L,qs=new L,Ys=new L,$s=new L,wo=new L,Js=new L,mc=new L,Ks=new L;class He extends ge{constructor(t=new xe,e=new Ra){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Js.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(wo.fromBufferAttribute(u,t),o?Js.addScaledVector(wo,h):Js.addScaledVector(wo.sub(e),h))}e.add(Js)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(r),jn.copy(t.ray).recast(t.near),!(Zs.containsPoint(jn.origin)===!1&&(jn.intersectSphere(Zs,pc)===null||jn.origin.distanceToSquared(pc)>(t.far-t.near)**2))&&(dc.copy(r).invert(),jn.copy(t.ray).applyMatrix4(dc),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,jn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,v=f.length;x<v;x++){const _=f[x],p=o[_.materialIndex],y=Math.max(_.start,d.start),m=Math.min(a.count,Math.min(_.start+_.count,d.start+d.count));for(let g=y,M=m;g<M;g+=3){const T=a.getX(g),A=a.getX(g+1),E=a.getX(g+2);s=js(this,p,t,n,l,h,u,T,A,E),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{const x=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let _=x,p=v;_<p;_+=3){const y=a.getX(_),m=a.getX(_+1),g=a.getX(_+2);s=js(this,o,t,n,l,h,u,y,m,g),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,v=f.length;x<v;x++){const _=f[x],p=o[_.materialIndex],y=Math.max(_.start,d.start),m=Math.min(c.count,Math.min(_.start+_.count,d.start+d.count));for(let g=y,M=m;g<M;g+=3){const T=g,A=g+1,E=g+2;s=js(this,p,t,n,l,h,u,T,A,E),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{const x=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let _=x,p=v;_<p;_+=3){const y=_,m=_+1,g=_+2;s=js(this,o,t,n,l,h,u,y,m,g),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}}}function xu(i,t,e,n,s,r,o,a){let c;if(t.side===1?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===0,a),c===null)return null;Ks.copy(a),Ks.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ks);return l<e.near||l>e.far?null:{distance:l,point:Ks.clone(),object:i}}function js(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,qs),i.getVertexPosition(c,Ys),i.getVertexPosition(l,$s);const h=xu(i,t,e,n,qs,Ys,$s,mc);if(h){const u=new L;Re.getBarycoord(mc,qs,Ys,$s,u),s&&(h.uv=Re.getInterpolatedAttribute(s,a,c,l,u,new at)),r&&(h.uv1=Re.getInterpolatedAttribute(r,a,c,l,u,new at)),o&&(h.normal=Re.getInterpolatedAttribute(o,a,c,l,u,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new L,materialIndex:0};Re.getNormal(qs,Ys,$s,f.normal),h.face=f,h.barycoord=u}return h}class Is extends xe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(h,3)),this.setAttribute("uv",new Jt(u,2));function x(v,_,p,y,m,g,M,T,A,E,b){const S=g/A,w=M/E,R=g/2,I=M/2,U=T/2,F=A+1,B=E+1;let k=0,z=0;const X=new L;for(let J=0;J<B;J++){const rt=J*w-I;for(let mt=0;mt<F;mt++){const _t=mt*S-R;X[v]=_t*y,X[_]=rt*m,X[p]=U,l.push(X.x,X.y,X.z),X[v]=0,X[_]=0,X[p]=T>0?1:-1,h.push(X.x,X.y,X.z),u.push(mt/A),u.push(1-J/E),k+=1}}for(let J=0;J<E;J++)for(let rt=0;rt<A;rt++){const mt=f+rt+F*J,_t=f+rt+F*(J+1),At=f+(rt+1)+F*(J+1),Rt=f+(rt+1)+F*J;c.push(mt,_t,Rt),c.push(_t,At,Rt),z+=6}a.addGroup(d,z,b),d+=z,f+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Is(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Xi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=Xi(i[e]);for(const s in n)t[s]=n[s]}return t}function _u(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Wl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const yu={clone:Xi,merge:Ve};var vu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Mu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xn extends qn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vu,this.fragmentShader=Mu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=_u(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Xl extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ht,this.projectionMatrix=new Ht,this.projectionMatrixInverse=new Ht,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const On=new L,gc=new at,xc=new at;class $e extends Xl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Wi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ki*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wi*2*Math.atan(Math.tan(ki*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){On.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(On.x,On.y).multiplyScalar(-t/On.z),On.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(On.x,On.y).multiplyScalar(-t/On.z)}getViewSize(t,e){return this.getViewBounds(t,gc,xc),e.subVectors(xc,gc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ki*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Si=-90,bi=1;class Su extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new $e(Si,bi,t,e);s.layers=this.layers,this.add(s);const r=new $e(Si,bi,t,e);r.layers=this.layers,this.add(r);const o=new $e(Si,bi,t,e);o.layers=this.layers,this.add(o);const a=new $e(Si,bi,t,e);a.layers=this.layers,this.add(a);const c=new $e(Si,bi,t,e);c.layers=this.layers,this.add(c);const l=new $e(Si,bi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Zl extends Le{constructor(t=[],e=301,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class bu extends ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Zl(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Is(5,5,5),r=new Xn({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=e;const o=new He(s,r),a=e.minFilter;return e.minFilter===1008&&(e.minFilter=1006),new Su(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Qs extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Tu={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const _=e.getJointPose(v,n),p=this._getHandJoint(l,v);_!==null&&(p.matrix.fromArray(_.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=_.radius),p.visible=_!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,x=.005;l.inputState.pinching&&f>d+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Tu)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Qs;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class A1 extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class w1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=nn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=nn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Oe=new L;class ql{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ne(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=cn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=cn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=cn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=cn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),n=ne(n,this.array),s=ne(s,this.array),r=ne(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new ve(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ql(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const _c=new L,yc=new te,vc=new te,Eu=new L,Mc=new Ht,tr=new L,Co=new mn,Sc=new Ht,Po=new hi;class R1 extends He{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ja,this.bindMatrix=new Ht,this.bindMatrixInverse=new Ht,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ie),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,tr),this.boundingBox.expandByPoint(tr)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,tr),this.boundingSphere.expandByPoint(tr)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Co.copy(this.boundingSphere),Co.applyMatrix4(s),t.ray.intersectsSphere(Co)!==!1&&(Sc.copy(s).invert(),Po.copy(t.ray).applyMatrix4(Sc),!(this.boundingBox!==null&&Po.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Po)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new te,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===ja?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Fh?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;yc.fromBufferAttribute(s.attributes.skinIndex,t),vc.fromBufferAttribute(s.attributes.skinWeight,t),_c.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const o=vc.getComponent(r);if(o!==0){const a=yc.getComponent(r);Mc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Eu.copy(_c).applyMatrix4(Mc),o)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Au extends ge{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ca extends Le{constructor(t=null,e=1,n=1,s,r,o,a,c,l=1003,h=1003,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const bc=new Ht,wu=new Ht;class Yl{constructor(t=[],e=[]){this.uuid=nn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ht)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Ht;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){const a=t[r]?t[r].matrixWorld:wu;bc.multiplyMatrices(a,e[r]),bc.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Yl(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Ca(e,t,t,1023,1015);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Au),this.bones.push(o),this.boneInverses.push(new Ht().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const o=e[s];t.bones.push(o.uuid);const a=n[s];t.boneInverses.push(a.toArray())}return t}}class Tc extends ve{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ti=new Ht,Ec=new Ht,er=[],Ac=new Ie,Ru=new Ht,is=new He,ss=new mn;class C1 extends He{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Tc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ru)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ie),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ti),Ac.copy(t.boundingBox).applyMatrix4(Ti),this.boundingBox.union(Ac)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ti),ss.copy(t.boundingSphere).applyMatrix4(Ti),this.boundingSphere.union(ss)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),t.ray.intersectsSphere(ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ti),Ec.multiplyMatrices(n,Ti),is.matrixWorld=Ec,is.raycast(t,er);for(let o=0,a=er.length;o<a;o++){const c=er[o];c.instanceId=r,c.object=this,e.push(c)}er.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Tc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ca(new Float32Array(s*this.count),s,this.count,1028,1015));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Io=new L,Cu=new L,Pu=new Yt;class En{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Io.subVectors(n,e).cross(Cu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Io),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Pu.getNormalMatrix(t),s=this.coplanarPoint(Io).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new mn,Iu=new at(.5,.5),nr=new L;class Pa{constructor(t=new En,e=new En,n=new En,s=new En,r=new En,o=new En){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=2e3,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],x=r[8],v=r[9],_=r[10],p=r[11],y=r[12],m=r[13],g=r[14],M=r[15];if(s[0].setComponents(l-o,d-h,p-x,M-y).normalize(),s[1].setComponents(l+o,d+h,p+x,M+y).normalize(),s[2].setComponents(l+a,d+u,p+v,M+m).normalize(),s[3].setComponents(l-a,d-u,p-v,M-m).normalize(),n)s[4].setComponents(c,f,_,g).normalize(),s[5].setComponents(l-c,d-f,p-_,M-g).normalize();else if(s[4].setComponents(l-c,d-f,p-_,M-g).normalize(),e===2e3)s[5].setComponents(l+c,d+f,p+_,M+g).normalize();else if(e===2001)s[5].setComponents(c,f,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(t){Qn.center.set(0,0,0);const e=Iu.distanceTo(t.center);return Qn.radius=.7071067811865476+e,Qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(nr.x=s.normal.x>0?t.max.x:t.min.x,nr.y=s.normal.y>0?t.max.y:t.min.y,nr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(nr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ia extends qn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Gr=new L,Hr=new L,wc=new Ht,rs=new hi,ir=new mn,Lo=new L,Rc=new L;class $l extends ge{constructor(t=new xe,e=new Ia){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Gr.fromBufferAttribute(e,s-1),Hr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Gr.distanceTo(Hr);t.setAttribute("lineDistance",new Jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(s),ir.radius+=r,t.ray.intersectsSphere(ir)===!1)return;wc.copy(s).invert(),rs.copy(t.ray).applyMatrix4(wc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),x=Math.min(h.count,o.start+o.count);for(let v=d,_=x-1;v<_;v+=l){const p=h.getX(v),y=h.getX(v+1),m=sr(this,t,rs,c,p,y,v);m&&e.push(m)}if(this.isLineLoop){const v=h.getX(x-1),_=h.getX(d),p=sr(this,t,rs,c,v,_,x-1);p&&e.push(p)}}else{const d=Math.max(0,o.start),x=Math.min(f.count,o.start+o.count);for(let v=d,_=x-1;v<_;v+=l){const p=sr(this,t,rs,c,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=sr(this,t,rs,c,x-1,d,x-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function sr(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(Gr.fromBufferAttribute(a,s),Hr.fromBufferAttribute(a,r),e.distanceSqToSegment(Gr,Hr,Lo,Rc)>n)return;Lo.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Lo);if(!(l<t.near||l>t.far))return{distance:l,point:Rc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const Cc=new L,Pc=new L;class Lu extends $l{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Cc.fromBufferAttribute(e,s),Pc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Cc.distanceTo(Pc);t.setAttribute("lineDistance",new Jt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class P1 extends $l{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Du extends qn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ic=new Ht,aa=new hi,rr=new mn,or=new L;class I1 extends ge{constructor(t=new xe,e=new Du){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,t.ray.intersectsSphere(rr)===!1)return;Ic.copy(s).invert(),aa.copy(t.ray).applyMatrix4(Ic);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let x=f,v=d;x<v;x++){const _=l.getX(x);or.fromBufferAttribute(u,_),Lc(or,_,c,s,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let x=f,v=d;x<v;x++)or.fromBufferAttribute(u,x),Lc(or,x,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Lc(i,t,e,n,s,r,o){const a=aa.distanceSqToPoint(i);if(a<e){const c=new L;aa.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Uu extends Le{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jl extends Le{constructor(t,e,n=1014,s,r,o,a=1003,c=1003,l,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Aa(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Kl extends Le{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class jl extends xe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new L,h=new at;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;l.x=t*Math.cos(d),l.y=t*Math.sin(d),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Jt(o,3)),this.setAttribute("normal",new Jt(a,3)),this.setAttribute("uv",new Jt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Jr extends xe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let x=0;const v=[],_=n/2;let p=0;y(),o===!1&&(t>0&&m(!0),e>0&&m(!1)),this.setIndex(h),this.setAttribute("position",new Jt(u,3)),this.setAttribute("normal",new Jt(f,3)),this.setAttribute("uv",new Jt(d,2));function y(){const g=new L,M=new L;let T=0;const A=(e-t)/n;for(let E=0;E<=r;E++){const b=[],S=E/r,w=S*(e-t)+t;for(let R=0;R<=s;R++){const I=R/s,U=I*c+a,F=Math.sin(U),B=Math.cos(U);M.x=w*F,M.y=-S*n+_,M.z=w*B,u.push(M.x,M.y,M.z),g.set(F,A,B).normalize(),f.push(g.x,g.y,g.z),d.push(I,1-S),b.push(x++)}v.push(b)}for(let E=0;E<s;E++)for(let b=0;b<r;b++){const S=v[b][E],w=v[b+1][E],R=v[b+1][E+1],I=v[b][E+1];(t>0||b!==0)&&(h.push(S,w,I),T+=3),(e>0||b!==r-1)&&(h.push(w,R,I),T+=3)}l.addGroup(p,T,0),p+=T}function m(g){const M=x,T=new at,A=new L;let E=0;const b=g===!0?t:e,S=g===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,_*S,0),f.push(0,S,0),d.push(.5,.5),x++;const w=x;for(let R=0;R<=s;R++){const U=R/s*c+a,F=Math.cos(U),B=Math.sin(U);A.x=b*B,A.y=_*S,A.z=b*F,u.push(A.x,A.y,A.z),f.push(0,S,0),T.x=F*.5+.5,T.y=B*.5*S+.5,d.push(T.x,T.y),x++}for(let R=0;R<s;R++){const I=M+R,U=w+R;g===!0?h.push(U,U+1,I):h.push(U+1,U,I),E+=3}l.addGroup(p,E,g===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jr(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ql extends Jr{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ql(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Kr extends xe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new Jt(r,3)),this.setAttribute("normal",new Jt(r.slice(),3)),this.setAttribute("uv",new Jt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){const m=new L,g=new L,M=new L;for(let T=0;T<e.length;T+=3)d(e[T+0],m),d(e[T+1],g),d(e[T+2],M),c(m,g,M,y)}function c(y,m,g,M){const T=M+1,A=[];for(let E=0;E<=T;E++){A[E]=[];const b=y.clone().lerp(g,E/T),S=m.clone().lerp(g,E/T),w=T-E;for(let R=0;R<=w;R++)R===0&&E===T?A[E][R]=b:A[E][R]=b.clone().lerp(S,R/w)}for(let E=0;E<T;E++)for(let b=0;b<2*(T-E)-1;b++){const S=Math.floor(b/2);b%2===0?(f(A[E][S+1]),f(A[E+1][S]),f(A[E][S])):(f(A[E][S+1]),f(A[E+1][S+1]),f(A[E+1][S]))}}function l(y){const m=new L;for(let g=0;g<r.length;g+=3)m.x=r[g+0],m.y=r[g+1],m.z=r[g+2],m.normalize().multiplyScalar(y),r[g+0]=m.x,r[g+1]=m.y,r[g+2]=m.z}function h(){const y=new L;for(let m=0;m<r.length;m+=3){y.x=r[m+0],y.y=r[m+1],y.z=r[m+2];const g=_(y)/2/Math.PI+.5,M=p(y)/Math.PI+.5;o.push(g,1-M)}x(),u()}function u(){for(let y=0;y<o.length;y+=6){const m=o[y+0],g=o[y+2],M=o[y+4],T=Math.max(m,g,M),A=Math.min(m,g,M);T>.9&&A<.1&&(m<.2&&(o[y+0]+=1),g<.2&&(o[y+2]+=1),M<.2&&(o[y+4]+=1))}}function f(y){r.push(y.x,y.y,y.z)}function d(y,m){const g=y*3;m.x=t[g+0],m.y=t[g+1],m.z=t[g+2]}function x(){const y=new L,m=new L,g=new L,M=new L,T=new at,A=new at,E=new at;for(let b=0,S=0;b<r.length;b+=9,S+=6){y.set(r[b+0],r[b+1],r[b+2]),m.set(r[b+3],r[b+4],r[b+5]),g.set(r[b+6],r[b+7],r[b+8]),T.set(o[S+0],o[S+1]),A.set(o[S+2],o[S+3]),E.set(o[S+4],o[S+5]),M.copy(y).add(m).add(g).divideScalar(3);const w=_(M);v(T,S+0,y,w),v(A,S+2,m,w),v(E,S+4,g,w)}}function v(y,m,g,M){M<0&&y.x===1&&(o[m]=y.x-1),g.x===0&&g.z===0&&(o[m]=M/2/Math.PI+.5)}function _(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kr(t.vertices,t.indices,t.radius,t.details)}}const ar=new L,cr=new L,Do=new L,lr=new Re;class L1 extends xe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(ki*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let x=0;x<c;x+=3){o?(l[0]=o.getX(x),l[1]=o.getX(x+1),l[2]=o.getX(x+2)):(l[0]=x,l[1]=x+1,l[2]=x+2);const{a:v,b:_,c:p}=lr;if(v.fromBufferAttribute(a,l[0]),_.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),lr.getNormal(Do),u[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,u[1]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const m=(y+1)%3,g=u[y],M=u[m],T=lr[h[y]],A=lr[h[m]],E=`${g}_${M}`,b=`${M}_${g}`;b in f&&f[b]?(Do.dot(f[b].normal)<=r&&(d.push(T.x,T.y,T.z),d.push(A.x,A.y,A.z)),f[b]=null):E in f||(f[E]={index0:l[y],index1:l[m],normal:Do.clone()})}}for(const x in f)if(f[x]){const{index0:v,index1:_}=f[x];ar.fromBufferAttribute(a,v),cr.fromBufferAttribute(a,_),d.push(ar.x,ar.y,ar.z),d.push(cr.x,cr.y,cr.z)}this.setAttribute("position",new Jt(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class gn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new at:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new L,s=[],r=[],o=[],a=new L,c=new Ht;for(let d=0;d<=t;d++){const x=d/t;s[d]=this.getTangentAt(x,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const x=Math.acos(Wt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,x))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Wt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],d*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class La extends gn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new at){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Nu extends La{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Da(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const hr=new L,Uo=new Da,No=new Da,Fo=new Da;class Fu extends gn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(hr.subVectors(s[0],s[1]).add(s[0]),l=hr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(hr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=hr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let x=Math.pow(l.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),x<1e-4&&(x=v),_<1e-4&&(_=v),Uo.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,x,v,_),No.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,x,v,_),Fo.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,x,v,_)}else this.curveType==="catmullrom"&&(Uo.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),No.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Fo.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Uo.calc(c),No.calc(c),Fo.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Dc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function zu(i,t){const e=1-i;return e*e*t}function Bu(i,t){return 2*(1-i)*i*t}function Ou(i,t){return i*i*t}function vs(i,t,e,n){return zu(i,t)+Bu(i,e)+Ou(i,n)}function Vu(i,t){const e=1-i;return e*e*e*t}function ku(i,t){const e=1-i;return 3*e*e*i*t}function Gu(i,t){return 3*(1-i)*i*i*t}function Hu(i,t){return i*i*i*t}function Ms(i,t,e,n,s){return Vu(i,t)+ku(i,e)+Gu(i,n)+Hu(i,s)}class th extends gn{constructor(t=new at,e=new at,n=new at,s=new at){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new at){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ms(t,s.x,r.x,o.x,a.x),Ms(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wu extends gn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ms(t,s.x,r.x,o.x,a.x),Ms(t,s.y,r.y,o.y,a.y),Ms(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class eh extends gn{constructor(t=new at,e=new at){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new at){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new at){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xu extends gn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nh extends gn{constructor(t=new at,e=new at,n=new at){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new at){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(vs(t,s.x,r.x,o.x),vs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ih extends gn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(vs(t,s.x,r.x,o.x),vs(t,s.y,r.y,o.y),vs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class sh extends gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new at){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Dc(a,c.x,l.x,h.x,u.x),Dc(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new at().fromArray(s))}return this}}var Wr=Object.freeze({__proto__:null,ArcCurve:Nu,CatmullRomCurve3:Fu,CubicBezierCurve:th,CubicBezierCurve3:Wu,EllipseCurve:La,LineCurve:eh,LineCurve3:Xu,QuadraticBezierCurve:nh,QuadraticBezierCurve3:ih,SplineCurve:sh});class Zu extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Wr[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Wr[s.type]().fromJSON(s))}return this}}class Uc extends Zu{constructor(t){super(),this.type="Path",this.currentPoint=new at,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new eh(this.currentPoint.clone(),new at(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new nh(this.currentPoint.clone(),new at(t,e),new at(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new th(this.currentPoint.clone(),new at(t,e),new at(n,s),new at(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new sh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new La(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class rh extends Uc{constructor(t){super(t),this.uuid=nn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Uc().fromJSON(s))}return this}}function qu(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=oh(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=ju(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){const d=i[f],x=i[f+1];d<a&&(a=d),x<c&&(c=x),d>h&&(h=d),x>u&&(u=x)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return ws(r,o,e,a,c,l,0),o}function oh(i,t,e,n,s){let r;if(s===hf(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Nc(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Nc(o/n|0,i[o],i[o+1],r);return r&&Zi(r,r.next)&&(Cs(r),r=r.next),r}function li(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Zi(e,e.next)||de(e.prev,e,e.next)===0)){if(Cs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ws(i,t,e,n,s,r,o){if(!i)return;!o&&r&&sf(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?$u(i,n,s,r):Yu(i)){t.push(c.i,i.i,l.i),Cs(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Ju(li(i),t),ws(i,t,e,n,s,r,2)):o===2&&Ku(i,t,e,n,s,r):ws(li(i),t,e,n,s,r,1);break}}}function Yu(i){const t=i.prev,e=i,n=i.next;if(de(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),f=Math.max(s,r,o),d=Math.max(a,c,l);let x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=f&&x.y>=u&&x.y<=d&&gs(s,a,r,c,o,l,x.x,x.y)&&de(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function $u(i,t,e,n){const s=i.prev,r=i,o=i.next;if(de(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,c,l),x=Math.min(h,u,f),v=Math.max(a,c,l),_=Math.max(h,u,f),p=ca(d,x,t,e,n),y=ca(v,_,t,e,n);let m=i.prevZ,g=i.nextZ;for(;m&&m.z>=p&&g&&g.z<=y;){if(m.x>=d&&m.x<=v&&m.y>=x&&m.y<=_&&m!==s&&m!==o&&gs(a,h,c,u,l,f,m.x,m.y)&&de(m.prev,m,m.next)>=0||(m=m.prevZ,g.x>=d&&g.x<=v&&g.y>=x&&g.y<=_&&g!==s&&g!==o&&gs(a,h,c,u,l,f,g.x,g.y)&&de(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;m&&m.z>=p;){if(m.x>=d&&m.x<=v&&m.y>=x&&m.y<=_&&m!==s&&m!==o&&gs(a,h,c,u,l,f,m.x,m.y)&&de(m.prev,m,m.next)>=0)return!1;m=m.prevZ}for(;g&&g.z<=y;){if(g.x>=d&&g.x<=v&&g.y>=x&&g.y<=_&&g!==s&&g!==o&&gs(a,h,c,u,l,f,g.x,g.y)&&de(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function Ju(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Zi(n,s)&&ch(n,e,e.next,s)&&Rs(n,s)&&Rs(s,n)&&(t.push(n.i,e.i,s.i),Cs(e),Cs(e.next),e=i=s),e=e.next}while(e!==i);return li(e)}function Ku(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&af(o,a)){let c=lh(o,a);o=li(o,o.next),c=li(c,c.next),ws(o,t,e,n,s,r,0),ws(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ju(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=oh(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(of(l))}s.sort(Qu);for(let r=0;r<s.length;r++)e=tf(s[r],e);return e}function Qu(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function tf(i,t){const e=ef(i,t);if(!e)return t;const n=lh(e,i);return li(n,n.next),li(e,e.next)}function ef(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Zi(i,e))return e;do{if(Zi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&ah(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Rs(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&nf(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function nf(i,t){return de(i.prev,i,t.prev)<0&&de(t.next,i,i.next)<0}function sf(i,t,e,n){let s=i;do s.z===0&&(s.z=ca(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,rf(s)}function rf(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function ca(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function of(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ah(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function gs(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&ah(i,t,e,n,s,r,o,a)}function af(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!cf(i,t)&&(Rs(i,t)&&Rs(t,i)&&lf(i,t)&&(de(i.prev,i,t.prev)||de(i,t.prev,t))||Zi(i,t)&&de(i.prev,i,i.next)>0&&de(t.prev,t,t.next)>0)}function de(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Zi(i,t){return i.x===t.x&&i.y===t.y}function ch(i,t,e,n){const s=fr(de(i,t,e)),r=fr(de(i,t,n)),o=fr(de(e,n,i)),a=fr(de(e,n,t));return!!(s!==r&&o!==a||s===0&&ur(i,e,t)||r===0&&ur(i,n,t)||o===0&&ur(e,i,n)||a===0&&ur(e,t,n))}function ur(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function fr(i){return i>0?1:i<0?-1:0}function cf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ch(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Rs(i,t){return de(i.prev,i,i.next)<0?de(i,t,i.next)>=0&&de(i,i.prev,t)>=0:de(i,t,i.prev)<0||de(i,i.next,t)<0}function lf(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function lh(i,t){const e=la(i.i,i.x,i.y),n=la(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Nc(i,t,e,n){const s=la(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Cs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function la(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function hf(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class uf{static triangulate(t,e,n=2){return qu(t,e,n)}}class Cn{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Cn.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Fc(t),zc(n,t);let o=t.length;e.forEach(Fc);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,zc(n,e[c]);const a=uf.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Fc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function zc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class hh extends xe{constructor(t=new rh([new at(.5,.5),new at(-.5,.5),new at(-.5,-.5),new at(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new Jt(s,3)),this.setAttribute("uv",new Jt(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,_=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:ff;let m,g=!1,M,T,A,E;p&&(m=p.getSpacedPoints(h),g=!0,f=!1,M=p.computeFrenetFrames(h,!1),T=new L,A=new L,E=new L),f||(_=0,d=0,x=0,v=0);const b=a.extractPoints(l);let S=b.shape;const w=b.holes;if(!Cn.isClockWise(S)){S=S.reverse();for(let it=0,et=w.length;it<et;it++){const tt=w[it];Cn.isClockWise(tt)&&(w[it]=tt.reverse())}}function I(it){const tt=10000000000000001e-36;let j=it[0];for(let dt=1;dt<=it.length;dt++){const V=dt%it.length,st=it[V],gt=st.x-j.x,Dt=st.y-j.y,D=gt*gt+Dt*Dt,C=Math.max(Math.abs(st.x),Math.abs(st.y),Math.abs(j.x),Math.abs(j.y)),W=tt*C*C;if(D<=W){it.splice(V,1),dt--;continue}j=st}}I(S),w.forEach(I);const U=w.length,F=S;for(let it=0;it<U;it++){const et=w[it];S=S.concat(et)}function B(it,et,tt){return et||console.error("THREE.ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(et,tt)}const k=S.length;function z(it,et,tt){let j,dt,V;const st=it.x-et.x,gt=it.y-et.y,Dt=tt.x-it.x,D=tt.y-it.y,C=st*st+gt*gt,W=st*D-gt*Dt;if(Math.abs(W)>Number.EPSILON){const Y=Math.sqrt(C),ot=Math.sqrt(Dt*Dt+D*D),K=et.x-gt/Y,Ut=et.y+st/Y,pt=tt.x-D/ot,Pt=tt.y+Dt/ot,It=((pt-K)*D-(Pt-Ut)*Dt)/(st*D-gt*Dt);j=K+st*It-it.x,dt=Ut+gt*It-it.y;const ct=j*j+dt*dt;if(ct<=2)return new at(j,dt);V=Math.sqrt(ct/2)}else{let Y=!1;st>Number.EPSILON?Dt>Number.EPSILON&&(Y=!0):st<-Number.EPSILON?Dt<-Number.EPSILON&&(Y=!0):Math.sign(gt)===Math.sign(D)&&(Y=!0),Y?(j=-gt,dt=st,V=Math.sqrt(C)):(j=st,dt=gt,V=Math.sqrt(C/2))}return new at(j/V,dt/V)}const X=[];for(let it=0,et=F.length,tt=et-1,j=it+1;it<et;it++,tt++,j++)tt===et&&(tt=0),j===et&&(j=0),X[it]=z(F[it],F[tt],F[j]);const J=[];let rt,mt=X.concat();for(let it=0,et=U;it<et;it++){const tt=w[it];rt=[];for(let j=0,dt=tt.length,V=dt-1,st=j+1;j<dt;j++,V++,st++)V===dt&&(V=0),st===dt&&(st=0),rt[j]=z(tt[j],tt[V],tt[st]);J.push(rt),mt=mt.concat(rt)}let _t;if(_===0)_t=Cn.triangulateShape(F,w);else{const it=[],et=[];for(let tt=0;tt<_;tt++){const j=tt/_,dt=d*Math.cos(j*Math.PI/2),V=x*Math.sin(j*Math.PI/2)+v;for(let st=0,gt=F.length;st<gt;st++){const Dt=B(F[st],X[st],V);Tt(Dt.x,Dt.y,-dt),j===0&&it.push(Dt)}for(let st=0,gt=U;st<gt;st++){const Dt=w[st];rt=J[st];const D=[];for(let C=0,W=Dt.length;C<W;C++){const Y=B(Dt[C],rt[C],V);Tt(Y.x,Y.y,-dt),j===0&&D.push(Y)}j===0&&et.push(D)}}_t=Cn.triangulateShape(it,et)}const At=_t.length,Rt=x+v;for(let it=0;it<k;it++){const et=f?B(S[it],mt[it],Rt):S[it];g?(A.copy(M.normals[0]).multiplyScalar(et.x),T.copy(M.binormals[0]).multiplyScalar(et.y),E.copy(m[0]).add(A).add(T),Tt(E.x,E.y,E.z)):Tt(et.x,et.y,0)}for(let it=1;it<=h;it++)for(let et=0;et<k;et++){const tt=f?B(S[et],mt[et],Rt):S[et];g?(A.copy(M.normals[it]).multiplyScalar(tt.x),T.copy(M.binormals[it]).multiplyScalar(tt.y),E.copy(m[it]).add(A).add(T),Tt(E.x,E.y,E.z)):Tt(tt.x,tt.y,u/h*it)}for(let it=_-1;it>=0;it--){const et=it/_,tt=d*Math.cos(et*Math.PI/2),j=x*Math.sin(et*Math.PI/2)+v;for(let dt=0,V=F.length;dt<V;dt++){const st=B(F[dt],X[dt],j);Tt(st.x,st.y,u+tt)}for(let dt=0,V=w.length;dt<V;dt++){const st=w[dt];rt=J[dt];for(let gt=0,Dt=st.length;gt<Dt;gt++){const D=B(st[gt],rt[gt],j);g?Tt(D.x,D.y+m[h-1].y,m[h-1].x+tt):Tt(D.x,D.y,u+tt)}}}$(),Q();function $(){const it=s.length/3;if(f){let et=0,tt=k*et;for(let j=0;j<At;j++){const dt=_t[j];vt(dt[2]+tt,dt[1]+tt,dt[0]+tt)}et=h+_*2,tt=k*et;for(let j=0;j<At;j++){const dt=_t[j];vt(dt[0]+tt,dt[1]+tt,dt[2]+tt)}}else{for(let et=0;et<At;et++){const tt=_t[et];vt(tt[2],tt[1],tt[0])}for(let et=0;et<At;et++){const tt=_t[et];vt(tt[0]+k*h,tt[1]+k*h,tt[2]+k*h)}}n.addGroup(it,s.length/3-it,0)}function Q(){const it=s.length/3;let et=0;ft(F,et),et+=F.length;for(let tt=0,j=w.length;tt<j;tt++){const dt=w[tt];ft(dt,et),et+=dt.length}n.addGroup(it,s.length/3-it,1)}function ft(it,et){let tt=it.length;for(;--tt>=0;){const j=tt;let dt=tt-1;dt<0&&(dt=it.length-1);for(let V=0,st=h+_*2;V<st;V++){const gt=k*V,Dt=k*(V+1),D=et+j+gt,C=et+dt+gt,W=et+dt+Dt,Y=et+j+Dt;Bt(D,C,W,Y)}}}function Tt(it,et,tt){c.push(it),c.push(et),c.push(tt)}function vt(it,et,tt){Ot(it),Ot(et),Ot(tt);const j=s.length/3,dt=y.generateTopUV(n,s,j-3,j-2,j-1);N(dt[0]),N(dt[1]),N(dt[2])}function Bt(it,et,tt,j){Ot(it),Ot(et),Ot(j),Ot(et),Ot(tt),Ot(j);const dt=s.length/3,V=y.generateSideWallUV(n,s,dt-6,dt-3,dt-2,dt-1);N(V[0]),N(V[1]),N(V[3]),N(V[1]),N(V[2]),N(V[3])}function Ot(it){s.push(c[it*3+0]),s.push(c[it*3+1]),s.push(c[it*3+2])}function N(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return df(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Wr[s.type]().fromJSON(s)),new hh(n,t.options)}}const ff={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new at(r,o),new at(a,c),new at(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],x=t[s*3+2],v=t[r*3],_=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new at(o,1-c),new at(l,1-u),new at(f,1-x),new at(v,1-p)]:[new at(a,1-c),new at(h,1-u),new at(d,1-x),new at(_,1-p)]}};function df(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class uh extends Kr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new uh(t.radius,t.detail)}}class Ua extends Kr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ua(t.radius,t.detail)}}class jr extends xe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],x=[],v=[],_=[];for(let p=0;p<h;p++){const y=p*f-o;for(let m=0;m<l;m++){const g=m*u-r;x.push(g,-y,0),v.push(0,0,1),_.push(m/a),_.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<a;y++){const m=y+l*p,g=y+l*(p+1),M=y+1+l*(p+1),T=y+1+l*p;d.push(m,g,T),d.push(g,M,T)}this.setIndex(d),this.setAttribute("position",new Jt(x,3)),this.setAttribute("normal",new Jt(v,3)),this.setAttribute("uv",new Jt(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jr(t.width,t.height,t.widthSegments,t.heightSegments)}}class fh extends xe{constructor(t=new rh([new at(0,.5),new at(-.5,-.5),new at(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new Jt(s,3)),this.setAttribute("normal",new Jt(r,3)),this.setAttribute("uv",new Jt(o,2));function l(h){const u=s.length/3,f=h.extractPoints(e);let d=f.shape;const x=f.holes;Cn.isClockWise(d)===!1&&(d=d.reverse());for(let _=0,p=x.length;_<p;_++){const y=x[_];Cn.isClockWise(y)===!0&&(x[_]=y.reverse())}const v=Cn.triangulateShape(d,x);for(let _=0,p=x.length;_<p;_++){const y=x[_];d=d.concat(y)}for(let _=0,p=d.length;_<p;_++){const y=d[_];s.push(y.x,y.y,0),r.push(0,0,1),o.push(y.x,y.y)}for(let _=0,p=v.length;_<p;_++){const y=v[_],m=y[0]+u,g=y[1]+u,M=y[2]+u;n.push(m,g,M),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return pf(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new fh(n,t.curveSegments)}}function pf(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class dh extends xe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new L,f=new L,d=[],x=[],v=[],_=[];for(let p=0;p<=n;p++){const y=[],m=p/n;let g=0;p===0&&o===0?g=.5/e:p===n&&c===Math.PI&&(g=-.5/e);for(let M=0;M<=e;M++){const T=M/e;u.x=-t*Math.cos(s+T*r)*Math.sin(o+m*a),u.y=t*Math.cos(o+m*a),u.z=t*Math.sin(s+T*r)*Math.sin(o+m*a),x.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),_.push(T+g,1-m),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const m=h[p][y+1],g=h[p][y],M=h[p+1][y],T=h[p+1][y+1];(p!==0||o>0)&&d.push(m,g,T),(p!==n-1||c<Math.PI)&&d.push(g,M,T)}this.setIndex(d),this.setAttribute("position",new Jt(x,3)),this.setAttribute("normal",new Jt(v,3)),this.setAttribute("uv",new Jt(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dh(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ph extends xe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new L,u=new L,f=new L;for(let d=0;d<=n;d++)for(let x=0;x<=s;x++){const v=x/s*r,_=d/n*Math.PI*2;u.x=(t+e*Math.cos(_))*Math.cos(v),u.y=(t+e*Math.cos(_))*Math.sin(v),u.z=e*Math.sin(_),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(x/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let x=1;x<=s;x++){const v=(s+1)*d+x-1,_=(s+1)*(d-1)+x-1,p=(s+1)*(d-1)+x,y=(s+1)*d+x;o.push(v,_,y),o.push(_,p,y)}this.setIndex(o),this.setAttribute("position",new Jt(a,3)),this.setAttribute("normal",new Jt(c,3)),this.setAttribute("uv",new Jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ph(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class mh extends xe{constructor(t=new ih(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new L,c=new L,l=new at;let h=new L;const u=[],f=[],d=[],x=[];v(),this.setIndex(x),this.setAttribute("position",new Jt(u,3)),this.setAttribute("normal",new Jt(f,3)),this.setAttribute("uv",new Jt(d,2));function v(){for(let m=0;m<e;m++)_(m);_(r===!1?e:0),y(),p()}function _(m){h=t.getPointAt(m/e,h);const g=o.normals[m],M=o.binormals[m];for(let T=0;T<=s;T++){const A=T/s*Math.PI*2,E=Math.sin(A),b=-Math.cos(A);c.x=b*g.x+E*M.x,c.y=b*g.y+E*M.y,c.z=b*g.z+E*M.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let m=1;m<=e;m++)for(let g=1;g<=s;g++){const M=(s+1)*(m-1)+(g-1),T=(s+1)*m+(g-1),A=(s+1)*m+g,E=(s+1)*(m-1)+g;x.push(M,T,E),x.push(T,A,E)}}function y(){for(let m=0;m<=e;m++)for(let g=0;g<=s;g++)l.x=m/e,l.y=g/s,d.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new mh(new Wr[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class mf extends qn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class D1 extends mf{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new at(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Wt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Xt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Xt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Xt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class U1 extends qn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class gf extends qn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class xf extends qn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class N1 extends Ia{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function dr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function _f(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function yf(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function Bc(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=e[r]*t;for(let c=0;c!==t;++c)s[o++]=i[a+c]}return s}function gh(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=i[s++];while(r!==void 0)}class Qr{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){const a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){const a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class vf extends Qr{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case 2401:r=t,a=2*e-n;break;case 2402:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case 2401:o=t,c=2*n-e;break;case 2402:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}const l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,x=(n-e)/(s-e),v=x*x,_=v*x,p=-f*_+2*f*v-f*x,y=(1+f)*_+(-1.5-2*f)*v+(-.5+f)*x+1,m=(-1-d)*_+(1.5+d)*v+.5*x,g=d*_-d*v;for(let M=0;M!==a;++M)r[M]=p*o[h+M]+y*o[l+M]+m*o[c+M]+g*o[u+M];return r}}class Mf extends Qr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}}class Sf extends Qr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class un{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=dr(e,this.TimeBufferType),this.values=dr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:dr(t.times,Array),values:dr(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Sf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Mf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new vf(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case 2300:e=this.InterpolantFactoryMethodDiscrete;break;case 2301:e=this.InterpolantFactoryMethodLinear;break;case 2302:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&_f(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===2302,r=t.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{const u=a*n,f=u-n,d=u+n;for(let x=0;x!==n;++x){const v=e[u+x];if(v!==e[f+x]||v!==e[d+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];const u=a*n,f=o*n;for(let d=0;d!==n;++d)e[f+d]=e[u+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}un.prototype.ValueTypeName="";un.prototype.TimeBufferType=Float32Array;un.prototype.ValueBufferType=Float32Array;un.prototype.DefaultInterpolation=2301;class $i extends un{constructor(t,e,n){super(t,e,n)}}$i.prototype.ValueTypeName="bool";$i.prototype.ValueBufferType=Array;$i.prototype.DefaultInterpolation=2300;$i.prototype.InterpolantFactoryMethodLinear=void 0;$i.prototype.InterpolantFactoryMethodSmooth=void 0;class xh extends un{constructor(t,e,n,s){super(t,e,n,s)}}xh.prototype.ValueTypeName="color";class Xr extends un{constructor(t,e,n,s){super(t,e,n,s)}}Xr.prototype.ValueTypeName="number";class bf extends Qr{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e);let l=t*a;for(let h=l+a;l!==h;l+=4)Yi.slerpFlat(r,0,o,l-a,o,l,c);return r}}class to extends un{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new bf(this.times,this.values,this.getValueSize(),t)}}to.prototype.ValueTypeName="quaternion";to.prototype.InterpolantFactoryMethodSmooth=void 0;class Ji extends un{constructor(t,e,n){super(t,e,n)}}Ji.prototype.ValueTypeName="string";Ji.prototype.ValueBufferType=Array;Ji.prototype.DefaultInterpolation=2300;Ji.prototype.InterpolantFactoryMethodLinear=void 0;Ji.prototype.InterpolantFactoryMethodSmooth=void 0;class Zr extends un{constructor(t,e,n,s){super(t,e,n,s)}}Zr.prototype.ValueTypeName="vector";class F1{constructor(t="",e=-1,n=[],s=2500){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=nn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(Ef(n[o]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,o=n.length;r!==o;++r)e.push(un.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const h=yf(c);c=Bc(c,1,h),l=Bc(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new Xr(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){const l=t[a],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let f=s[u];f||(s[u]=f=[]),f.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,n));return o}static parseAnimation(t,e){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,f,d,x,v){if(d.length!==0){const _=[],p=[];gh(d,_,p,x),_.length!==0&&v.push(new u(f,_,p))}},s=[],r=t.name||"default",o=t.fps||30,a=t.blendMode;let c=t.length||-1;const l=t.hierarchy||[];for(let u=0;u<l.length;u++){const f=l[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let x;for(x=0;x<f.length;x++)if(f[x].morphTargets)for(let v=0;v<f[x].morphTargets.length;v++)d[f[x].morphTargets[v]]=-1;for(const v in d){const _=[],p=[];for(let y=0;y!==f[x].morphTargets.length;++y){const m=f[x];_.push(m.time),p.push(m.morphTarget===v?1:0)}s.push(new Xr(".morphTargetInfluence["+v+"]",_,p))}c=d.length*o}else{const d=".bones["+e[u].name+"]";n(Zr,d+".position",f,"pos",s),n(to,d+".quaternion",f,"rot",s),n(Zr,d+".scale",f,"scl",s)}}return s.length===0?null:new this(r,c,s,a)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function Tf(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Xr;case"vector":case"vector2":case"vector3":case"vector4":return Zr;case"color":return xh;case"quaternion":return to;case"bool":case"boolean":return $i;case"string":return Ji}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Ef(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=Tf(i.type);if(i.times===void 0){const e=[],n=[];gh(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}const Pn={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Af{constructor(t,e,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){const d=l[u],x=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const wf=new Af;class Ls{constructor(t){this.manager=t!==void 0?t:wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Ls.DEFAULT_MATERIAL_NAME="__DEFAULT";const bn={};class Rf extends Error{constructor(t,e){super(t),this.response=e}}class z1 extends Ls{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=Pn.get(`file:${t}`);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(bn[t]!==void 0){bn[t].push({onLoad:e,onProgress:n,onError:s});return}bn[t]=[],bn[t].push({onLoad:e,onProgress:n,onError:s});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=bn[t],u=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,x=d!==0;let v=0;const _=new ReadableStream({start(p){y();function y(){u.read().then(({done:m,value:g})=>{if(m)p.close();else{v+=g.byteLength;const M=new ProgressEvent("progress",{lengthComputable:x,loaded:v,total:d});for(let T=0,A=h.length;T<A;T++){const E=h[T];E.onProgress&&E.onProgress(M)}p.enqueue(g),y()}},m=>{p.error(m)})}}});return new Response(_)}else throw new Rf(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(x=>d.decode(x))}}}).then(l=>{Pn.add(`file:${t}`,l);const h=bn[t];delete bn[t];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(l)}}).catch(l=>{const h=bn[t];if(h===void 0)throw this.manager.itemError(t),l;delete bn[t];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ei=new WeakMap;class Cf extends Ls{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Pn.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let u=Ei.get(o);u===void 0&&(u=[],Ei.set(o,u)),u.push({onLoad:e,onError:s})}return o}const a=Es("img");function c(){h(),e&&e(this);const u=Ei.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}Ei.delete(this),r.manager.itemEnd(t)}function l(u){h(),s&&s(u),Pn.remove(`image:${t}`);const f=Ei.get(this)||[];for(let d=0;d<f.length;d++){const x=f[d];x.onError&&x.onError(u)}Ei.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Pn.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}}class Pf extends Ls{constructor(t){super(t)}load(t,e,n,s){const r=new Le,o=new Cf(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class eo extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class B1 extends eo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const zo=new Ht,Oc=new L,Vc=new L;class Na{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pa,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oc),Vc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vc),e.updateMatrixWorld(),zo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zo,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class If extends Na{constructor(){super(new $e(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=Wi*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class O1 extends eo{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new If}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const kc=new Ht,os=new L,Bo=new L;class Lf extends Na{constructor(){super(new $e(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new at(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),os.setFromMatrixPosition(t.matrixWorld),n.position.copy(os),Bo.copy(n.position),Bo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Bo),n.updateMatrixWorld(),s.makeTranslation(-os.x,-os.y,-os.z),kc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(kc,n.coordinateSystem,n.reversedDepth)}}class V1 extends eo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Lf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class _h extends Xl{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Df extends Na{constructor(){super(new _h(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class k1 extends eo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new Df}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class G1{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}const Oo=new WeakMap;class H1 extends Ls{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Pn.get(`image-bitmap:${t}`);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{if(Oo.has(o)===!0)s&&s(Oo.get(o)),r.manager.itemError(t),r.manager.itemEnd(t);else return e&&e(l),r.manager.itemEnd(t),l});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Pn.add(`image-bitmap:${t}`,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){s&&s(l),Oo.set(c,l),Pn.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});Pn.add(`image-bitmap:${t}`,c),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class Uf extends $e{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const Fa="\\[\\]\\.:\\/",Nf=new RegExp("["+Fa+"]","g"),za="[^"+Fa+"]",Ff="[^"+Fa.replace("\\.","")+"]",zf=/((?:WC+[\/:])*)/.source.replace("WC",za),Bf=/(WCOD+)?/.source.replace("WCOD",Ff),Of=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",za),Vf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",za),kf=new RegExp("^"+zf+Bf+Of+Vf+"$"),Gf=["material","materials","bones","map"];class Hf{constructor(t,e,n){const s=n||re.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class re{constructor(t,e,n){this.path=e,this.parsedPath=n||re.parseTrackName(e),this.node=re.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new re.Composite(t,e,n):new re(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Nf,"")}static parseTrackName(t){const e=kf.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Gf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===e||a.uuid===e)return a;const c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=re.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}const o=t[s];if(o===void 0){const l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}re.Composite=Hf;re.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};re.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};re.prototype.GetterByBindingType=[re.prototype._getValue_direct,re.prototype._getValue_array,re.prototype._getValue_arrayElement,re.prototype._getValue_toArray];re.prototype.SetterByBindingTypeAndVersioning=[[re.prototype._setValue_direct,re.prototype._setValue_direct_setNeedsUpdate,re.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[re.prototype._setValue_array,re.prototype._setValue_array_setNeedsUpdate,re.prototype._setValue_array_setMatrixWorldNeedsUpdate],[re.prototype._setValue_arrayElement,re.prototype._setValue_arrayElement_setNeedsUpdate,re.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[re.prototype._setValue_fromArray,re.prototype._setValue_fromArray_setNeedsUpdate,re.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Gc=new Ht;class W1{constructor(t,e,n=0,s=1/0){this.ray=new hi(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new wa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Gc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gc),this}intersectObject(t,e=!0,n=[]){return ha(t,this,n,e),n.sort(Hc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ha(t[s],this,n,e);return n.sort(Hc),n}}function Hc(i,t){return i.distance-t.distance}function ha(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)ha(r[o],t,e,!0)}}const Wc=new L,pr=new L,Ai=new L,wi=new L,Vo=new L,Wf=new L,Xf=new L;class Ln{constructor(t=new L,e=new L){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Wc.subVectors(t,this.start),pr.subVectors(this.end,this.start);const n=pr.dot(pr);let r=pr.dot(Wc)/n;return e&&(r=Wt(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=Wf,n=Xf){const s=10000000000000001e-32;let r,o;const a=this.start,c=t.start,l=this.end,h=t.end;Ai.subVectors(l,a),wi.subVectors(h,c),Vo.subVectors(a,c);const u=Ai.dot(Ai),f=wi.dot(wi),d=wi.dot(Vo);if(u<=s&&f<=s)return e.copy(a),n.copy(c),e.sub(n),e.dot(e);if(u<=s)r=0,o=d/f,o=Wt(o,0,1);else{const x=Ai.dot(Vo);if(f<=s)o=0,r=Wt(-x/u,0,1);else{const v=Ai.dot(wi),_=u*f-v*v;_!==0?r=Wt((v*d-x*f)/_,0,1):r=0,o=(v*r+d)/f,o<0?(o=0,r=Wt(-x/u,0,1)):o>1&&(o=1,r=Wt((v-x)/u,0,1))}}return e.copy(a).add(Ai.multiplyScalar(r)),n.copy(c).add(wi.multiplyScalar(o)),e.sub(n),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function Xc(i,t,e,n){const s=Zf(n);switch(e){case 1021:return i*t;case 1028:return i*t/s.components*s.byteLength;case 1029:return i*t/s.components*s.byteLength;case 1030:return i*t*2/s.components*s.byteLength;case 1031:return i*t*2/s.components*s.byteLength;case 1022:return i*t*3/s.components*s.byteLength;case 1023:return i*t*4/s.components*s.byteLength;case 1033:return i*t*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(t,8)/2;case 36196:case 37492:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case 37496:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Zf(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function yh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function qf(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,x)=>d.start-x.start);let f=0;for(let d=1;d<u.length;d++){const x=u[f],v=u[d];v.start<=x.start+x.count+1?x.count=Math.max(x.count,v.start+v.count-x.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,x=u.length;d<x;d++){const v=u[d];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Yf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$f=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,td=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ed=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,id=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,od=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ad=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,md=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,xd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_d=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,yd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Md=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Td="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ed=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ad=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Rd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Id=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ld=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ud=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Od=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,kd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Zd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$d=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ep=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,np=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ip=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,op=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ap=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,up=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,fp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_p=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ep=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ap=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Pp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ip=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Up=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Np=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,zp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Op=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,kp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,em=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,om=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,am=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,um=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_m=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ym=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Em=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Am=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:Yf,alphahash_pars_fragment:$f,alphamap_fragment:Jf,alphamap_pars_fragment:Kf,alphatest_fragment:jf,alphatest_pars_fragment:Qf,aomap_fragment:td,aomap_pars_fragment:ed,batching_pars_vertex:nd,batching_vertex:id,begin_vertex:sd,beginnormal_vertex:rd,bsdfs:od,iridescence_fragment:ad,bumpmap_pars_fragment:cd,clipping_planes_fragment:ld,clipping_planes_pars_fragment:hd,clipping_planes_pars_vertex:ud,clipping_planes_vertex:fd,color_fragment:dd,color_pars_fragment:pd,color_pars_vertex:md,color_vertex:gd,common:xd,cube_uv_reflection_fragment:_d,defaultnormal_vertex:yd,displacementmap_pars_vertex:vd,displacementmap_vertex:Md,emissivemap_fragment:Sd,emissivemap_pars_fragment:bd,colorspace_fragment:Td,colorspace_pars_fragment:Ed,envmap_fragment:Ad,envmap_common_pars_fragment:wd,envmap_pars_fragment:Rd,envmap_pars_vertex:Cd,envmap_physical_pars_fragment:Vd,envmap_vertex:Pd,fog_vertex:Id,fog_pars_vertex:Ld,fog_fragment:Dd,fog_pars_fragment:Ud,gradientmap_pars_fragment:Nd,lightmap_pars_fragment:Fd,lights_lambert_fragment:zd,lights_lambert_pars_fragment:Bd,lights_pars_begin:Od,lights_toon_fragment:kd,lights_toon_pars_fragment:Gd,lights_phong_fragment:Hd,lights_phong_pars_fragment:Wd,lights_physical_fragment:Xd,lights_physical_pars_fragment:Zd,lights_fragment_begin:qd,lights_fragment_maps:Yd,lights_fragment_end:$d,logdepthbuf_fragment:Jd,logdepthbuf_pars_fragment:Kd,logdepthbuf_pars_vertex:jd,logdepthbuf_vertex:Qd,map_fragment:tp,map_pars_fragment:ep,map_particle_fragment:np,map_particle_pars_fragment:ip,metalnessmap_fragment:sp,metalnessmap_pars_fragment:rp,morphinstance_vertex:op,morphcolor_vertex:ap,morphnormal_vertex:cp,morphtarget_pars_vertex:lp,morphtarget_vertex:hp,normal_fragment_begin:up,normal_fragment_maps:fp,normal_pars_fragment:dp,normal_pars_vertex:pp,normal_vertex:mp,normalmap_pars_fragment:gp,clearcoat_normal_fragment_begin:xp,clearcoat_normal_fragment_maps:_p,clearcoat_pars_fragment:yp,iridescence_pars_fragment:vp,opaque_fragment:Mp,packing:Sp,premultiplied_alpha_fragment:bp,project_vertex:Tp,dithering_fragment:Ep,dithering_pars_fragment:Ap,roughnessmap_fragment:wp,roughnessmap_pars_fragment:Rp,shadowmap_pars_fragment:Cp,shadowmap_pars_vertex:Pp,shadowmap_vertex:Ip,shadowmask_pars_fragment:Lp,skinbase_vertex:Dp,skinning_pars_vertex:Up,skinning_vertex:Np,skinnormal_vertex:Fp,specularmap_fragment:zp,specularmap_pars_fragment:Bp,tonemapping_fragment:Op,tonemapping_pars_fragment:Vp,transmission_fragment:kp,transmission_pars_fragment:Gp,uv_pars_fragment:Hp,uv_pars_vertex:Wp,uv_vertex:Xp,worldpos_vertex:Zp,background_vert:qp,background_frag:Yp,backgroundCube_vert:$p,backgroundCube_frag:Jp,cube_vert:Kp,cube_frag:jp,depth_vert:Qp,depth_frag:tm,distanceRGBA_vert:em,distanceRGBA_frag:nm,equirect_vert:im,equirect_frag:sm,linedashed_vert:rm,linedashed_frag:om,meshbasic_vert:am,meshbasic_frag:cm,meshlambert_vert:lm,meshlambert_frag:hm,meshmatcap_vert:um,meshmatcap_frag:fm,meshnormal_vert:dm,meshnormal_frag:pm,meshphong_vert:mm,meshphong_frag:gm,meshphysical_vert:xm,meshphysical_frag:_m,meshtoon_vert:ym,meshtoon_frag:vm,points_vert:Mm,points_frag:Sm,shadow_vert:bm,shadow_frag:Tm,sprite_vert:Em,sprite_frag:Am},yt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},pn={basic:{uniforms:Ve([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ve([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ve([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ve([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ve([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ve([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ve([yt.points,yt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ve([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ve([yt.common,yt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ve([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ve([yt.sprite,yt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ve([yt.common,yt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ve([yt.lights,yt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};pn.physical={uniforms:Ve([pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const mr={r:0,b:0,g:0},ti=new ln,wm=new Ht;function Rm(i,t,e,n,s,r,o){const a=new Xt(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function x(m){let g=m.isScene===!0?m.background:null;return g&&g.isTexture&&(g=(m.backgroundBlurriness>0?e:t).get(g)),g}function v(m){let g=!1;const M=x(m);M===null?p(a,c):M&&M.isColor&&(p(M,1),g=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(m,g){const M=x(g);M&&(M.isCubeTexture||M.mapping===306)?(h===void 0&&(h=new He(new Is(1,1,1),new Xn({name:"BackgroundCubeMaterial",uniforms:Xi(pn.backgroundCube.uniforms),vertexShader:pn.backgroundCube.vertexShader,fragmentShader:pn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ti.copy(g.backgroundRotation),ti.x*=-1,ti.y*=-1,ti.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(wm.makeRotationFromEuler(ti)),h.material.toneMapped=Qt.getTransfer(M.colorSpace)!==se,(u!==M||f!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new He(new jr(2,2),new Xn({name:"BackgroundMaterial",uniforms:Xi(pn.background.uniforms),vertexShader:pn.background.vertexShader,fragmentShader:pn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(M.colorSpace)!==se,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,d=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function p(m,g){m.getRGB(mr,Wl(i)),n.buffers.color.setClear(mr.r,mr.g,mr.b,g,o)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(m,g=1){a.set(m),c=g,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,p(a,c)},render:v,addToRenderList:_,dispose:y}}function Cm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(S,w,R,I,U){let F=!1;const B=u(I,R,w);r!==B&&(r=B,l(r.object)),F=d(S,I,R,U),F&&x(S,I,R,U),U!==null&&t.update(U,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,g(S,w,R,I),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function u(S,w,R){const I=R.wireframe===!0;let U=n[S.id];U===void 0&&(U={},n[S.id]=U);let F=U[w.id];F===void 0&&(F={},U[w.id]=F);let B=F[I];return B===void 0&&(B=f(c()),F[I]=B),B}function f(S){const w=[],R=[],I=[];for(let U=0;U<e;U++)w[U]=0,R[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:R,attributeDivisors:I,object:S,attributes:{},index:null}}function d(S,w,R,I){const U=r.attributes,F=w.attributes;let B=0;const k=R.getAttributes();for(const z in k)if(k[z].location>=0){const J=U[z];let rt=F[z];if(rt===void 0&&(z==="instanceMatrix"&&S.instanceMatrix&&(rt=S.instanceMatrix),z==="instanceColor"&&S.instanceColor&&(rt=S.instanceColor)),J===void 0||J.attribute!==rt||rt&&J.data!==rt.data)return!0;B++}return r.attributesNum!==B||r.index!==I}function x(S,w,R,I){const U={},F=w.attributes;let B=0;const k=R.getAttributes();for(const z in k)if(k[z].location>=0){let J=F[z];J===void 0&&(z==="instanceMatrix"&&S.instanceMatrix&&(J=S.instanceMatrix),z==="instanceColor"&&S.instanceColor&&(J=S.instanceColor));const rt={};rt.attribute=J,J&&J.data&&(rt.data=J.data),U[z]=rt,B++}r.attributes=U,r.attributesNum=B,r.index=I}function v(){const S=r.newAttributes;for(let w=0,R=S.length;w<R;w++)S[w]=0}function _(S){p(S,0)}function p(S,w){const R=r.newAttributes,I=r.enabledAttributes,U=r.attributeDivisors;R[S]=1,I[S]===0&&(i.enableVertexAttribArray(S),I[S]=1),U[S]!==w&&(i.vertexAttribDivisor(S,w),U[S]=w)}function y(){const S=r.newAttributes,w=r.enabledAttributes;for(let R=0,I=w.length;R<I;R++)w[R]!==S[R]&&(i.disableVertexAttribArray(R),w[R]=0)}function m(S,w,R,I,U,F,B){B===!0?i.vertexAttribIPointer(S,w,R,U,F):i.vertexAttribPointer(S,w,R,I,U,F)}function g(S,w,R,I){v();const U=I.attributes,F=R.getAttributes(),B=w.defaultAttributeValues;for(const k in F){const z=F[k];if(z.location>=0){let X=U[k];if(X===void 0&&(k==="instanceMatrix"&&S.instanceMatrix&&(X=S.instanceMatrix),k==="instanceColor"&&S.instanceColor&&(X=S.instanceColor)),X!==void 0){const J=X.normalized,rt=X.itemSize,mt=t.get(X);if(mt===void 0)continue;const _t=mt.buffer,At=mt.type,Rt=mt.bytesPerElement,$=At===i.INT||At===i.UNSIGNED_INT||X.gpuType===1013;if(X.isInterleavedBufferAttribute){const Q=X.data,ft=Q.stride,Tt=X.offset;if(Q.isInstancedInterleavedBuffer){for(let vt=0;vt<z.locationSize;vt++)p(z.location+vt,Q.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let vt=0;vt<z.locationSize;vt++)_(z.location+vt);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let vt=0;vt<z.locationSize;vt++)m(z.location+vt,rt/z.locationSize,At,J,ft*Rt,(Tt+rt/z.locationSize*vt)*Rt,$)}else{if(X.isInstancedBufferAttribute){for(let Q=0;Q<z.locationSize;Q++)p(z.location+Q,X.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Q=0;Q<z.locationSize;Q++)_(z.location+Q);i.bindBuffer(i.ARRAY_BUFFER,_t);for(let Q=0;Q<z.locationSize;Q++)m(z.location+Q,rt/z.locationSize,At,J,rt*Rt,rt/z.locationSize*Q*Rt,$)}}else if(B!==void 0){const J=B[k];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(z.location,J);break;case 3:i.vertexAttrib3fv(z.location,J);break;case 4:i.vertexAttrib4fv(z.location,J);break;default:i.vertexAttrib1fv(z.location,J)}}}}y()}function M(){E();for(const S in n){const w=n[S];for(const R in w){const I=w[R];for(const U in I)h(I[U].object),delete I[U];delete w[R]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const w=n[S.id];for(const R in w){const I=w[R];for(const U in I)h(I[U].object),delete I[U];delete w[R]}delete n[S.id]}function A(S){for(const w in n){const R=n[w];if(R[S.id]===void 0)continue;const I=R[S.id];for(const U in I)h(I[U].object),delete I[U];delete R[S.id]}}function E(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:b,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:_,disableUnusedAttributes:y}}function Pm(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let x=0;x<u;x++)d+=h[x];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let x=0;x<l.length;x++)o(l[x],h[x],f[x]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let x=0;for(let v=0;v<u;v++)x+=h[v]*f[v];e.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Im(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==1023&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const E=A===1016&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==1009&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==1015&&!E)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),m=i.getParameter(i.MAX_VARYING_VECTORS),g=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=x>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:x,maxTextureSize:v,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:y,maxVaryings:m,maxFragmentUniforms:g,vertexTextures:M,maxSamples:T}}function Lm(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new En,a=new Yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const x=u.clippingPlanes,v=u.clipIntersection,_=u.clipShadows,p=i.get(u);if(!s||x===null||x.length===0||r&&!_)r?h(null):l();else{const y=r?0:n,m=y*4;let g=p.clippingState||null;c.value=g,g=h(x,f,m,d);for(let M=0;M!==m;++M)g[M]=e[M];p.clippingState=g,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,x){const v=u!==null?u.length:0;let _=null;if(v!==0){if(_=c.value,x!==!0||_===null){const p=d+v*4,y=f.matrixWorldInverse;a.getNormalMatrix(y),(_===null||_.length<p)&&(_=new Float32Array(p));for(let m=0,g=d;m!==v;++m,g+=4)o.copy(u[m]).applyMatrix4(y,a),o.normal.toArray(_,g),_[g+3]=o.constant}c.value=_,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,_}}function Dm(i){let t=new WeakMap;function e(o,a){return a===303?o.mapping=301:a===304&&(o.mapping=302),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===303||a===304)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new bu(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Oi=4,Zc=[.125,.215,.35,.446,.526,.582],oi=20,ko=new _h,qc=new Xt;let Go=null,Ho=0,Wo=0,Xo=!1;const ri=(1+Math.sqrt(5))/2,Ri=1/ri,Yc=[new L(-ri,Ri,0),new L(ri,Ri,0),new L(-Ri,0,ri),new L(Ri,0,ri),new L(0,ri,-Ri),new L(0,ri,Ri),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Um=new L;class $c{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Um}=r;Go=this._renderer.getRenderTarget(),Ho=this._renderer.getActiveCubeFace(),Wo=this._renderer.getActiveMipmapLevel(),Xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Go,Ho,Wo),this._renderer.xr.enabled=Xo,t.scissorTest=!1,gr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===301||t.mapping===302?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Go=this._renderer.getRenderTarget(),Ho=this._renderer.getActiveCubeFace(),Wo=this._renderer.getActiveMipmapLevel(),Xo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Hi,depthBuffer:!1},s=Jc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Nm(r)),this._blurMaterial=Fm(r,t,e)}return s}_compileMaterial(t){const e=new He(this._lodPlanes[0],t);this._renderer.compile(e,ko)}_sceneToCubeUV(t,e,n,s,r){const c=new $e(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(qc),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Ra({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),_=new He(new Is,v);let p=!1;const y=t.background;y?y.isColor&&(v.color.copy(y),t.background=null,p=!0):(v.color.copy(qc),p=!0);for(let m=0;m<6;m++){const g=m%3;g===0?(c.up.set(0,l[m],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[m],r.y,r.z)):g===1?(c.up.set(0,0,l[m]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[m],r.z)):(c.up.set(0,l[m],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[m]));const M=this._cubeSize;gr(s,g*M,m>2?M:0,M,M),u.setRenderTarget(s),p&&u.render(_,c),u.render(t,c)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===301||t.mapping===302;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=jc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new He(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;gr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ko)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Yc[(s-r-1)%Yc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new He(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*oi-1),v=r/x,_=isFinite(r)?1+Math.floor(h*v):oi;_>oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${oi}`);const p=[];let y=0;for(let A=0;A<oi;++A){const E=A/v,b=Math.exp(-E*E/2);p.push(b),A===0?y+=b:A<_&&(y+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;f.envMap.value=t.texture,f.samples.value=_,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:m}=this;f.dTheta.value=x,f.mipInt.value=m-n;const g=this._sizeLods[s],M=3*g*(s>m-Oi?s-m+Oi:0),T=4*(this._cubeSize-g);gr(e,M,T,3*g,2*g),c.setRenderTarget(e),c.render(u,ko)}}function Nm(i){const t=[],e=[],n=[];let s=i;const r=i-Oi+1+Zc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Oi?c=Zc[o-i+Oi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,x=6,v=3,_=2,p=1,y=new Float32Array(v*x*d),m=new Float32Array(_*x*d),g=new Float32Array(p*x*d);for(let T=0;T<d;T++){const A=T%3*2/3-1,E=T>2?0:-1,b=[A,E,0,A+2/3,E,0,A+2/3,E+1,0,A,E,0,A+2/3,E+1,0,A,E+1,0];y.set(b,v*x*T),m.set(f,_*x*T);const S=[T,T,T,T,T,T];g.set(S,p*x*T)}const M=new xe;M.setAttribute("position",new ve(y,v)),M.setAttribute("uv",new ve(m,_)),M.setAttribute("faceIndex",new ve(g,p)),t.push(M),s>Oi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Jc(i,t,e){const n=new ci(i,t,e);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function gr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Fm(i,t,e){const n=new Float32Array(oi),s=new L(0,1,0);return new Xn({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Kc(){return new Xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function jc(){return new Xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ba(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===303||c===304,h=c===301||c===302;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new $c(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new $c(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Bm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&As("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Om(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const x in f.attributes)t.remove(f.attributes[x]);f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const d in f)t.update(f[d],i.ARRAY_BUFFER)}function l(u){const f=[],d=u.index,x=u.attributes.position;let v=0;if(d!==null){const y=d.array;v=d.version;for(let m=0,g=y.length;m<g;m+=3){const M=y[m+0],T=y[m+1],A=y[m+2];f.push(M,T,T,A,A,M)}}else if(x!==void 0){const y=x.array;v=x.version;for(let m=0,g=y.length/3-1;m<g;m+=3){const M=m+0,T=m+1,A=m+2;f.push(M,T,T,A,A,M)}}else return;const _=new(Ol(f)?Hl:Gl)(f,1);_.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,_)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Vm(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*o),e.update(d,n,1)}function l(f,d,x){x!==0&&(i.drawElementsInstanced(n,d,r,f*o,x),e.update(d,n,x))}function h(f,d,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,x);let _=0;for(let p=0;p<x;p++)_+=d[p];e.update(_,n,1)}function u(f,d,x,v){if(x===0)return;const _=t.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],v[p]);else{_.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,v,0,x);let p=0;for(let y=0;y<x;y++)p+=d[y]*v[y];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function km(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Gm(i,t,e){const n=new WeakMap,s=new te;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let b=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let m=0;d===!0&&(m=1),x===!0&&(m=2),v===!0&&(m=3);let g=a.attributes.position.count*m,M=1;g>t.maxTextureSize&&(M=Math.ceil(g/t.maxTextureSize),g=t.maxTextureSize);const T=new Float32Array(g*M*4*u),A=new Vl(T,g,M,u);A.type=1015,A.needsUpdate=!0;const E=m*4;for(let S=0;S<u;S++){const w=_[S],R=p[S],I=y[S],U=g*M*4*S;for(let F=0;F<w.count;F++){const B=F*E;d===!0&&(s.fromBufferAttribute(w,F),T[U+B+0]=s.x,T[U+B+1]=s.y,T[U+B+2]=s.z,T[U+B+3]=0),x===!0&&(s.fromBufferAttribute(R,F),T[U+B+4]=s.x,T[U+B+5]=s.y,T[U+B+6]=s.z,T[U+B+7]=0),v===!0&&(s.fromBufferAttribute(I,F),T[U+B+8]=s.x,T[U+B+9]=s.y,T[U+B+10]=s.z,T[U+B+11]=I.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new at(g,M)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let v=0;v<l.length;v++)d+=l[v];const x=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Hm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const vh=new Le,Qc=new Jl(1,1),Mh=new Vl,Sh=new ou,bh=new Zl,tl=[],el=[],nl=new Float32Array(16),il=new Float32Array(9),sl=new Float32Array(4);function Ki(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=tl[s];if(r===void 0&&(r=new Float32Array(s),tl[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function no(i,t){let e=el[t];e===void 0&&(e=new Int32Array(t),el[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Wm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function Zm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function Ym(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;sl.set(n),i.uniformMatrix2fv(this.addr,!1,sl),Ae(e,n)}}function $m(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;il.set(n),i.uniformMatrix3fv(this.addr,!1,il),Ae(e,n)}}function Jm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;nl.set(n),i.uniformMatrix4fv(this.addr,!1,nl),Ae(e,n)}}function Km(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function jm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function Qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function eg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function ig(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function sg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function rg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Qc.compareFunction=515,r=Qc):r=vh,e.setTexture2D(t||r,s)}function og(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Sh,s)}function ag(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||bh,s)}function cg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Mh,s)}function lg(i){switch(i){case 5126:return Wm;case 35664:return Xm;case 35665:return Zm;case 35666:return qm;case 35674:return Ym;case 35675:return $m;case 35676:return Jm;case 5124:case 35670:return Km;case 35667:case 35671:return jm;case 35668:case 35672:return Qm;case 35669:case 35673:return tg;case 5125:return eg;case 36294:return ng;case 36295:return ig;case 36296:return sg;case 35678:case 36198:case 36298:case 36306:case 35682:return rg;case 35679:case 36299:case 36307:return og;case 35680:case 36300:case 36308:case 36293:return ag;case 36289:case 36303:case 36311:case 36292:return cg}}function hg(i,t){i.uniform1fv(this.addr,t)}function ug(i,t){const e=Ki(t,this.size,2);i.uniform2fv(this.addr,e)}function fg(i,t){const e=Ki(t,this.size,3);i.uniform3fv(this.addr,e)}function dg(i,t){const e=Ki(t,this.size,4);i.uniform4fv(this.addr,e)}function pg(i,t){const e=Ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function mg(i,t){const e=Ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function gg(i,t){const e=Ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function xg(i,t){i.uniform1iv(this.addr,t)}function _g(i,t){i.uniform2iv(this.addr,t)}function yg(i,t){i.uniform3iv(this.addr,t)}function vg(i,t){i.uniform4iv(this.addr,t)}function Mg(i,t){i.uniform1uiv(this.addr,t)}function Sg(i,t){i.uniform2uiv(this.addr,t)}function bg(i,t){i.uniform3uiv(this.addr,t)}function Tg(i,t){i.uniform4uiv(this.addr,t)}function Eg(i,t,e){const n=this.cache,s=t.length,r=no(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||vh,r[o])}function Ag(i,t,e){const n=this.cache,s=t.length,r=no(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Sh,r[o])}function wg(i,t,e){const n=this.cache,s=t.length,r=no(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||bh,r[o])}function Rg(i,t,e){const n=this.cache,s=t.length,r=no(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Mh,r[o])}function Cg(i){switch(i){case 5126:return hg;case 35664:return ug;case 35665:return fg;case 35666:return dg;case 35674:return pg;case 35675:return mg;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return _g;case 35668:case 35672:return yg;case 35669:case 35673:return vg;case 5125:return Mg;case 36294:return Sg;case 36295:return bg;case 36296:return Tg;case 35678:case 36198:case 36298:case 36306:case 35682:return Eg;case 35679:case 36299:case 36307:return Ag;case 35680:case 36300:case 36308:case 36293:return wg;case 36289:case 36303:case 36311:case 36292:return Rg}}class Pg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=lg(e.type)}}class Ig{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Cg(e.type)}}class Lg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Zo=/(\w+)(\])?(\[|\.)?/g;function rl(i,t){i.seq.push(t),i.map[t.id]=t}function Dg(i,t,e){const n=i.name,s=n.length;for(Zo.lastIndex=0;;){const r=Zo.exec(n),o=Zo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){rl(e,l===void 0?new Pg(a,i,t):new Ig(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Lg(a),rl(e,u)),e=u}}}class Fr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Dg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function ol(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Ug=37297;let Ng=0;function Fg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const al=new Yt;function zg(i){Qt._getMatrix(al,Qt.workingColorSpace,i);const t=`mat3( ${al.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(i)){case kr:return[t,"LinearTransferOETF"];case se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function cl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Fg(i.getShaderSource(t),a)}else return r}function Bg(i,t){const e=zg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Og(i,t){let e;switch(t){case 1:e="Linear";break;case 2:e="Reinhard";break;case 3:e="Cineon";break;case 4:e="ACESFilmic";break;case 6:e="AgX";break;case 7:e="Neutral";break;case 5:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const xr=new L;function Vg(){Qt.getLuminanceCoefficients(xr);const i=xr.x.toFixed(4),t=xr.y.toFixed(4),e=xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function kg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xs).join(`
`)}function Gg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Hg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function xs(i){return i!==""}function ll(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Wg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ua(i){return i.replace(Wg,Zg)}const Xg=new Map;function Zg(i,t){let e=$t[t];if(e===void 0){const n=Xg.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ua(e)}const qg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(i){return i.replace(qg,Yg)}function Yg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function fl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function $g(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(t="SHADOWMAP_TYPE_VSM"),t}function Jg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:t="ENVMAP_TYPE_CUBE";break;case 306:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Kg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:t="ENVMAP_MODE_REFRACTION";break}return t}function jg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:t="ENVMAP_BLENDING_MULTIPLY";break;case 1:t="ENVMAP_BLENDING_MIX";break;case 2:t="ENVMAP_BLENDING_ADD";break}return t}function Qg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function t0(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=$g(e),l=Jg(e),h=Kg(e),u=jg(e),f=Qg(e),d=kg(e),x=Gg(r),v=s.createProgram();let _,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(_=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(xs).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(xs).join(`
`),p.length>0&&(p+=`
`)):(_=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),p=[fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==0?"#define TONE_MAPPING":"",e.toneMapping!==0?$t.tonemapping_pars_fragment:"",e.toneMapping!==0?Og("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,Bg("linearToOutputTexel",e.outputColorSpace),Vg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xs).join(`
`)),o=ua(o),o=ll(o,e),o=hl(o,e),a=ua(a),a=ll(a,e),a=hl(a,e),o=ul(o),a=ul(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",e.glslVersion===Qa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Qa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const m=y+_+o,g=y+p+a,M=ol(s,s.VERTEX_SHADER,m),T=ol(s,s.FRAGMENT_SHADER,g);s.attachShader(v,M),s.attachShader(v,T),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(w){if(i.debug.checkShaderErrors){const R=s.getProgramInfoLog(v)||"",I=s.getShaderInfoLog(M)||"",U=s.getShaderInfoLog(T)||"",F=R.trim(),B=I.trim(),k=U.trim();let z=!0,X=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,M,T);else{const J=cl(s,M,"vertex"),rt=cl(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+F+`
`+J+`
`+rt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(B===""||k==="")&&(X=!1);X&&(w.diagnostics={runnable:z,programLog:F,vertexShader:{log:B,prefix:_},fragmentShader:{log:k,prefix:p}})}s.deleteShader(M),s.deleteShader(T),E=new Fr(s,v),b=Hg(s,v)}let E;this.getUniforms=function(){return E===void 0&&A(this),E};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,Ug)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ng++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=M,this.fragmentShader=T,this}let e0=0;class n0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new i0(t),e.set(t,n)),n}}class i0{constructor(t){this.id=e0++,this.code=t,this.usedTimes=0}}function s0(i,t,e,n,s,r,o){const a=new wa,c=new n0,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function _(b,S,w,R,I){const U=R.fog,F=I.geometry,B=b.isMeshStandardMaterial?R.environment:null,k=(b.isMeshStandardMaterial?e:t).get(b.envMap||B),z=k&&k.mapping===306?k.image.height:null,X=x[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const J=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,rt=J!==void 0?J.length:0;let mt=0;F.morphAttributes.position!==void 0&&(mt=1),F.morphAttributes.normal!==void 0&&(mt=2),F.morphAttributes.color!==void 0&&(mt=3);let _t,At,Rt,$;if(X){const ee=pn[X];_t=ee.vertexShader,At=ee.fragmentShader}else _t=b.vertexShader,At=b.fragmentShader,c.update(b),Rt=c.getVertexShaderID(b),$=c.getFragmentShaderID(b);const Q=i.getRenderTarget(),ft=i.state.buffers.depth.getReversed(),Tt=I.isInstancedMesh===!0,vt=I.isBatchedMesh===!0,Bt=!!b.map,Ot=!!b.matcap,N=!!k,it=!!b.aoMap,et=!!b.lightMap,tt=!!b.bumpMap,j=!!b.normalMap,dt=!!b.displacementMap,V=!!b.emissiveMap,st=!!b.metalnessMap,gt=!!b.roughnessMap,Dt=b.anisotropy>0,D=b.clearcoat>0,C=b.dispersion>0,W=b.iridescence>0,Y=b.sheen>0,ot=b.transmission>0,K=Dt&&!!b.anisotropyMap,Ut=D&&!!b.clearcoatMap,pt=D&&!!b.clearcoatNormalMap,Pt=D&&!!b.clearcoatRoughnessMap,It=W&&!!b.iridescenceMap,ct=W&&!!b.iridescenceThicknessMap,bt=Y&&!!b.sheenColorMap,kt=Y&&!!b.sheenRoughnessMap,Nt=!!b.specularMap,Mt=!!b.specularColorMap,qt=!!b.specularIntensityMap,O=ot&&!!b.transmissionMap,ut=ot&&!!b.thicknessMap,xt=!!b.gradientMap,wt=!!b.alphaMap,lt=b.alphaTest>0,nt=!!b.alphaHash,Lt=!!b.extensions;let Zt=0;b.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const ae={shaderID:X,shaderType:b.type,shaderName:b.name,vertexShader:_t,fragmentShader:At,defines:b.defines,customVertexShaderID:Rt,customFragmentShaderID:$,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:vt,batchingColor:vt&&I._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&I.instanceColor!==null,instancingMorph:Tt&&I.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Hi,alphaToCoverage:!!b.alphaToCoverage,map:Bt,matcap:Ot,envMap:N,envMapMode:N&&k.mapping,envMapCubeUVHeight:z,aoMap:it,lightMap:et,bumpMap:tt,normalMap:j,displacementMap:f&&dt,emissiveMap:V,normalMapObjectSpace:j&&b.normalMapType===1,normalMapTangentSpace:j&&b.normalMapType===0,metalnessMap:st,roughnessMap:gt,anisotropy:Dt,anisotropyMap:K,clearcoat:D,clearcoatMap:Ut,clearcoatNormalMap:pt,clearcoatRoughnessMap:Pt,dispersion:C,iridescence:W,iridescenceMap:It,iridescenceThicknessMap:ct,sheen:Y,sheenColorMap:bt,sheenRoughnessMap:kt,specularMap:Nt,specularColorMap:Mt,specularIntensityMap:qt,transmission:ot,transmissionMap:O,thicknessMap:ut,gradientMap:xt,opaque:b.transparent===!1&&b.blending===1&&b.alphaToCoverage===!1,alphaMap:wt,alphaTest:lt,alphaHash:nt,combine:b.combine,mapUv:Bt&&v(b.map.channel),aoMapUv:it&&v(b.aoMap.channel),lightMapUv:et&&v(b.lightMap.channel),bumpMapUv:tt&&v(b.bumpMap.channel),normalMapUv:j&&v(b.normalMap.channel),displacementMapUv:dt&&v(b.displacementMap.channel),emissiveMapUv:V&&v(b.emissiveMap.channel),metalnessMapUv:st&&v(b.metalnessMap.channel),roughnessMapUv:gt&&v(b.roughnessMap.channel),anisotropyMapUv:K&&v(b.anisotropyMap.channel),clearcoatMapUv:Ut&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:pt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:It&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ct&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:bt&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:kt&&v(b.sheenRoughnessMap.channel),specularMapUv:Nt&&v(b.specularMap.channel),specularColorMapUv:Mt&&v(b.specularColorMap.channel),specularIntensityMapUv:qt&&v(b.specularIntensityMap.channel),transmissionMapUv:O&&v(b.transmissionMap.channel),thicknessMapUv:ut&&v(b.thicknessMap.channel),alphaMapUv:wt&&v(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(j||Dt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!F.attributes.uv&&(Bt||wt),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ft,skinning:I.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:rt,morphTextureStride:mt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:Bt&&b.map.isVideoTexture===!0&&Qt.getTransfer(b.map.colorSpace)===se,decodeVideoTextureEmissive:V&&b.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(b.emissiveMap.colorSpace)===se,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===2,flipSided:b.side===1,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Lt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&b.extensions.multiDraw===!0||vt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ae.vertexUv1s=l.has(1),ae.vertexUv2s=l.has(2),ae.vertexUv3s=l.has(3),l.clear(),ae}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const w in b.defines)S.push(w),S.push(b.defines[w]);return b.isRawShaderMaterial===!1&&(y(S,b),m(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function y(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function m(b,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),b.push(a.mask)}function g(b){const S=x[b.type];let w;if(S){const R=pn[S];w=yu.clone(R.uniforms)}else w=b.uniforms;return w}function M(b,S){let w;for(let R=0,I=h.length;R<I;R++){const U=h[R];if(U.cacheKey===S){w=U,++w.usedTimes;break}}return w===void 0&&(w=new t0(i,S,b,r),h.push(w)),w}function T(b){if(--b.usedTimes===0){const S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function A(b){c.remove(b)}function E(){c.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:g,acquireProgram:M,releaseProgram:T,releaseShaderCache:A,programs:h,dispose:E}}function r0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function o0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function dl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function pl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,x,v,_){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:x,renderOrder:u.renderOrder,z:v,group:_},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=x,p.renderOrder=u.renderOrder,p.z=v,p.group=_),t++,p}function a(u,f,d,x,v,_){const p=o(u,f,d,x,v,_);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,x,v,_){const p=o(u,f,d,x,v,_);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||o0),n.length>1&&n.sort(f||dl),s.length>1&&s.sort(f||dl)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function a0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new pl,i.set(n,[o])):s>=r.length?(o=new pl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function c0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Xt};break;case"SpotLight":e={position:new L,direction:new L,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function l0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let h0=0;function u0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f0(i){const t=new c0,e=l0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,r=new Ht,o=new Ht;function a(l){let h=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,x=0,v=0,_=0,p=0,y=0,m=0,g=0,M=0,T=0,A=0;l.sort(u0);for(let b=0,S=l.length;b<S;b++){const w=l[b],R=w.color,I=w.intensity,U=w.distance,F=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=R.r*I,u+=R.g*I,f+=R.b*I;else if(w.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(w.sh.coefficients[B],I);A++}else if(w.isDirectionalLight){const B=t.get(w);if(B.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const k=w.shadow,z=e.get(w);z.shadowIntensity=k.intensity,z.shadowBias=k.bias,z.shadowNormalBias=k.normalBias,z.shadowRadius=k.radius,z.shadowMapSize=k.mapSize,n.directionalShadow[d]=z,n.directionalShadowMap[d]=F,n.directionalShadowMatrix[d]=w.shadow.matrix,y++}n.directional[d]=B,d++}else if(w.isSpotLight){const B=t.get(w);B.position.setFromMatrixPosition(w.matrixWorld),B.color.copy(R).multiplyScalar(I),B.distance=U,B.coneCos=Math.cos(w.angle),B.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),B.decay=w.decay,n.spot[v]=B;const k=w.shadow;if(w.map&&(n.spotLightMap[M]=w.map,M++,k.updateMatrices(w),w.castShadow&&T++),n.spotLightMatrix[v]=k.matrix,w.castShadow){const z=e.get(w);z.shadowIntensity=k.intensity,z.shadowBias=k.bias,z.shadowNormalBias=k.normalBias,z.shadowRadius=k.radius,z.shadowMapSize=k.mapSize,n.spotShadow[v]=z,n.spotShadowMap[v]=F,g++}v++}else if(w.isRectAreaLight){const B=t.get(w);B.color.copy(R).multiplyScalar(I),B.halfWidth.set(w.width*.5,0,0),B.halfHeight.set(0,w.height*.5,0),n.rectArea[_]=B,_++}else if(w.isPointLight){const B=t.get(w);if(B.color.copy(w.color).multiplyScalar(w.intensity),B.distance=w.distance,B.decay=w.decay,w.castShadow){const k=w.shadow,z=e.get(w);z.shadowIntensity=k.intensity,z.shadowBias=k.bias,z.shadowNormalBias=k.normalBias,z.shadowRadius=k.radius,z.shadowMapSize=k.mapSize,z.shadowCameraNear=k.camera.near,z.shadowCameraFar=k.camera.far,n.pointShadow[x]=z,n.pointShadowMap[x]=F,n.pointShadowMatrix[x]=w.shadow.matrix,m++}n.point[x]=B,x++}else if(w.isHemisphereLight){const B=t.get(w);B.skyColor.copy(w.color).multiplyScalar(I),B.groundColor.copy(w.groundColor).multiplyScalar(I),n.hemi[p]=B,p++}}_>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=yt.LTC_FLOAT_1,n.rectAreaLTC2=yt.LTC_FLOAT_2):(n.rectAreaLTC1=yt.LTC_HALF_1,n.rectAreaLTC2=yt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const E=n.hash;(E.directionalLength!==d||E.pointLength!==x||E.spotLength!==v||E.rectAreaLength!==_||E.hemiLength!==p||E.numDirectionalShadows!==y||E.numPointShadows!==m||E.numSpotShadows!==g||E.numSpotMaps!==M||E.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=_,n.point.length=x,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=m,n.pointShadowMap.length=m,n.spotShadow.length=g,n.spotShadowMap.length=g,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=m,n.spotLightMatrix.length=g+M-T,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,E.directionalLength=d,E.pointLength=x,E.spotLength=v,E.rectAreaLength=_,E.hemiLength=p,E.numDirectionalShadows=y,E.numPointShadows=m,E.numSpotShadows=g,E.numSpotMaps=M,E.numLightProbes=A,n.version=h0++)}function c(l,h){let u=0,f=0,d=0,x=0,v=0;const _=h.matrixWorldInverse;for(let p=0,y=l.length;p<y;p++){const m=l[p];if(m.isDirectionalLight){const g=n.directional[u];g.direction.setFromMatrixPosition(m.matrixWorld),s.setFromMatrixPosition(m.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(_),u++}else if(m.isSpotLight){const g=n.spot[d];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),g.direction.setFromMatrixPosition(m.matrixWorld),s.setFromMatrixPosition(m.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(_),d++}else if(m.isRectAreaLight){const g=n.rectArea[x];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),o.identity(),r.copy(m.matrixWorld),r.premultiply(_),o.extractRotation(r),g.halfWidth.set(m.width*.5,0,0),g.halfHeight.set(0,m.height*.5,0),g.halfWidth.applyMatrix4(o),g.halfHeight.applyMatrix4(o),x++}else if(m.isPointLight){const g=n.point[f];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),f++}else if(m.isHemisphereLight){const g=n.hemi[v];g.direction.setFromMatrixPosition(m.matrixWorld),g.direction.transformDirection(_),v++}}}return{setup:a,setupView:c,state:n}}function ml(i){const t=new f0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function d0(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new ml(i),t.set(s,[a])):r>=o.length?(a=new ml(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const p0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function g0(i,t,e){let n=new Pa;const s=new at,r=new at,o=new te,a=new gf({depthPacking:3201}),c=new xf,l={},h=e.maxTextureSize,u={0:1,1:0,2:2},f=new Xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:p0,fragmentShader:m0}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const x=new xe;x.setAttribute("position",new ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new He(x,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(T,A,E){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),R=i.state;R.setBlending(0),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const I=p!==3&&this.type===3,U=p===3&&this.type!==3;for(let F=0,B=T.length;F<B;F++){const k=T[F],z=k.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const X=z.getFrameExtents();if(s.multiply(X),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,z.mapSize.y=r.y)),z.map===null||I===!0||U===!0){const rt=this.type!==3?{minFilter:1003,magFilter:1003}:{};z.map!==null&&z.map.dispose(),z.map=new ci(s.x,s.y,rt),z.map.texture.name=k.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const J=z.getViewportCount();for(let rt=0;rt<J;rt++){const mt=z.getViewport(rt);o.set(r.x*mt.x,r.y*mt.y,r.x*mt.z,r.y*mt.w),R.viewport(o),z.updateMatrices(k,rt),n=z.getFrustum(),g(A,E,z.camera,k,this.type)}z.isPointLightShadow!==!0&&this.type===3&&y(z,E),z.needsUpdate=!1}p=this.type,_.needsUpdate=!1,i.setRenderTarget(b,S,w)};function y(T,A){const E=t.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new ci(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,E,f,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,E,d,v,null)}function m(T,A,E,b){let S=null;const w=E.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(w!==void 0)S=w;else if(S=E.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const R=S.uuid,I=A.uuid;let U=l[R];U===void 0&&(U={},l[R]=U);let F=U[I];F===void 0&&(F=S.clone(),U[I]=F,A.addEventListener("dispose",M)),S=F}if(S.visible=A.visible,S.wireframe=A.wireframe,b===3?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:u[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,E.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const R=i.properties.get(S);R.light=E}return S}function g(T,A,E,b,S){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===3)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,T.matrixWorld);const I=t.update(T),U=T.material;if(Array.isArray(U)){const F=I.groups;for(let B=0,k=F.length;B<k;B++){const z=F[B],X=U[z.materialIndex];if(X&&X.visible){const J=m(T,X,b,S);T.onBeforeShadow(i,T,A,E,I,J,z),i.renderBufferDirect(E,null,I,J,T,z),T.onAfterShadow(i,T,A,E,I,J,z)}}}else if(U.visible){const F=m(T,U,b,S);T.onBeforeShadow(i,T,A,E,I,F,null),i.renderBufferDirect(E,null,I,F,T,null),T.onAfterShadow(i,T,A,E,I,F,null)}}const R=T.children;for(let I=0,U=R.length;I<U;I++)g(R[I],A,E,b,S)}function M(T){T.target.removeEventListener("dispose",M);for(const E in l){const b=l[E],S=T.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const x0={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function _0(i,t){function e(){let O=!1;const ut=new te;let xt=null;const wt=new te(0,0,0,0);return{setMask:function(lt){xt!==lt&&!O&&(i.colorMask(lt,lt,lt,lt),xt=lt)},setLocked:function(lt){O=lt},setClear:function(lt,nt,Lt,Zt,ae){ae===!0&&(lt*=Zt,nt*=Zt,Lt*=Zt),ut.set(lt,nt,Lt,Zt),wt.equals(ut)===!1&&(i.clearColor(lt,nt,Lt,Zt),wt.copy(ut))},reset:function(){O=!1,xt=null,wt.set(-1,0,0,0)}}}function n(){let O=!1,ut=!1,xt=null,wt=null,lt=null;return{setReversed:function(nt){if(ut!==nt){const Lt=t.get("EXT_clip_control");nt?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),ut=nt;const Zt=lt;lt=null,this.setClear(Zt)}},getReversed:function(){return ut},setTest:function(nt){nt?Q(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function(nt){xt!==nt&&!O&&(i.depthMask(nt),xt=nt)},setFunc:function(nt){if(ut&&(nt=x0[nt]),wt!==nt){switch(nt){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}wt=nt}},setLocked:function(nt){O=nt},setClear:function(nt){lt!==nt&&(ut&&(nt=1-nt),i.clearDepth(nt),lt=nt)},reset:function(){O=!1,xt=null,wt=null,lt=null,ut=!1}}}function s(){let O=!1,ut=null,xt=null,wt=null,lt=null,nt=null,Lt=null,Zt=null,ae=null;return{setTest:function(ee){O||(ee?Q(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(ee){ut!==ee&&!O&&(i.stencilMask(ee),ut=ee)},setFunc:function(ee,xn,fn){(xt!==ee||wt!==xn||lt!==fn)&&(i.stencilFunc(ee,xn,fn),xt=ee,wt=xn,lt=fn)},setOp:function(ee,xn,fn){(nt!==ee||Lt!==xn||Zt!==fn)&&(i.stencilOp(ee,xn,fn),nt=ee,Lt=xn,Zt=fn)},setLocked:function(ee){O=ee},setClear:function(ee){ae!==ee&&(i.clearStencil(ee),ae=ee)},reset:function(){O=!1,ut=null,xt=null,wt=null,lt=null,nt=null,Lt=null,Zt=null,ae=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],x=null,v=!1,_=null,p=null,y=null,m=null,g=null,M=null,T=null,A=new Xt(0,0,0),E=0,b=!1,S=null,w=null,R=null,I=null,U=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,k=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(z)[1]),B=k>=1):z.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),B=k>=2);let X=null,J={};const rt=i.getParameter(i.SCISSOR_BOX),mt=i.getParameter(i.VIEWPORT),_t=new te().fromArray(rt),At=new te().fromArray(mt);function Rt(O,ut,xt,wt){const lt=new Uint8Array(4),nt=i.createTexture();i.bindTexture(O,nt),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<xt;Lt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ut,0,i.RGBA,1,1,wt,0,i.RGBA,i.UNSIGNED_BYTE,lt):i.texImage2D(ut+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,lt);return nt}const $={};$[i.TEXTURE_2D]=Rt(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(i.DEPTH_TEST),o.setFunc(3),tt(!1),j(1),Q(i.CULL_FACE),it(0);function Q(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function ft(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function Tt(O,ut){return u[O]!==ut?(i.bindFramebuffer(O,ut),u[O]=ut,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ut),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ut),!0):!1}function vt(O,ut){let xt=d,wt=!1;if(O){xt=f.get(ut),xt===void 0&&(xt=[],f.set(ut,xt));const lt=O.textures;if(xt.length!==lt.length||xt[0]!==i.COLOR_ATTACHMENT0){for(let nt=0,Lt=lt.length;nt<Lt;nt++)xt[nt]=i.COLOR_ATTACHMENT0+nt;xt.length=lt.length,wt=!0}}else xt[0]!==i.BACK&&(xt[0]=i.BACK,wt=!0);wt&&i.drawBuffers(xt)}function Bt(O){return x!==O?(i.useProgram(O),x=O,!0):!1}const Ot={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};Ot[103]=i.MIN,Ot[104]=i.MAX;const N={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function it(O,ut,xt,wt,lt,nt,Lt,Zt,ae,ee){if(O===0){v===!0&&(ft(i.BLEND),v=!1);return}if(v===!1&&(Q(i.BLEND),v=!0),O!==5){if(O!==_||ee!==b){if((p!==100||g!==100)&&(i.blendEquation(i.FUNC_ADD),p=100,g=100),ee)switch(O){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case 3:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}y=null,m=null,M=null,T=null,A.set(0,0,0),E=0,_=O,b=ee}return}lt=lt||ut,nt=nt||xt,Lt=Lt||wt,(ut!==p||lt!==g)&&(i.blendEquationSeparate(Ot[ut],Ot[lt]),p=ut,g=lt),(xt!==y||wt!==m||nt!==M||Lt!==T)&&(i.blendFuncSeparate(N[xt],N[wt],N[nt],N[Lt]),y=xt,m=wt,M=nt,T=Lt),(Zt.equals(A)===!1||ae!==E)&&(i.blendColor(Zt.r,Zt.g,Zt.b,ae),A.copy(Zt),E=ae),_=O,b=!1}function et(O,ut){O.side===2?ft(i.CULL_FACE):Q(i.CULL_FACE);let xt=O.side===1;ut&&(xt=!xt),tt(xt),O.blending===1&&O.transparent===!1?it(0):it(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);const wt=O.stencilWrite;a.setTest(wt),wt&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),V(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(O){S!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),S=O)}function j(O){O!==0?(Q(i.CULL_FACE),O!==w&&(O===1?i.cullFace(i.BACK):O===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),w=O}function dt(O){O!==R&&(B&&i.lineWidth(O),R=O)}function V(O,ut,xt){O?(Q(i.POLYGON_OFFSET_FILL),(I!==ut||U!==xt)&&(i.polygonOffset(ut,xt),I=ut,U=xt)):ft(i.POLYGON_OFFSET_FILL)}function st(O){O?Q(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function gt(O){O===void 0&&(O=i.TEXTURE0+F-1),X!==O&&(i.activeTexture(O),X=O)}function Dt(O,ut,xt){xt===void 0&&(X===null?xt=i.TEXTURE0+F-1:xt=X);let wt=J[xt];wt===void 0&&(wt={type:void 0,texture:void 0},J[xt]=wt),(wt.type!==O||wt.texture!==ut)&&(X!==xt&&(i.activeTexture(xt),X=xt),i.bindTexture(O,ut||$[O]),wt.type=O,wt.texture=ut)}function D(){const O=J[X];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function C(){try{i.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Y(){try{i.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ot(){try{i.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ut(){try{i.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function pt(){try{i.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pt(){try{i.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function It(){try{i.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ct(){try{i.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function bt(O){_t.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),_t.copy(O))}function kt(O){At.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),At.copy(O))}function Nt(O,ut){let xt=l.get(ut);xt===void 0&&(xt=new WeakMap,l.set(ut,xt));let wt=xt.get(O);wt===void 0&&(wt=i.getUniformBlockIndex(ut,O.name),xt.set(O,wt))}function Mt(O,ut){const wt=l.get(ut).get(O);c.get(ut)!==wt&&(i.uniformBlockBinding(ut,wt,O.__bindingPointIndex),c.set(ut,wt))}function qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},X=null,J={},u={},f=new WeakMap,d=[],x=null,v=!1,_=null,p=null,y=null,m=null,g=null,M=null,T=null,A=new Xt(0,0,0),E=0,b=!1,S=null,w=null,R=null,I=null,U=null,_t.set(0,0,i.canvas.width,i.canvas.height),At.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Q,disable:ft,bindFramebuffer:Tt,drawBuffers:vt,useProgram:Bt,setBlending:it,setMaterial:et,setFlipSided:tt,setCullFace:j,setLineWidth:dt,setPolygonOffset:V,setScissorTest:st,activeTexture:gt,bindTexture:Dt,unbindTexture:D,compressedTexImage2D:C,compressedTexImage3D:W,texImage2D:It,texImage3D:ct,updateUBOMapping:Nt,uniformBlockBinding:Mt,texStorage2D:pt,texStorage3D:Pt,texSubImage2D:Y,texSubImage3D:ot,compressedTexSubImage2D:K,compressedTexSubImage3D:Ut,scissor:bt,viewport:kt,reset:qt}}function y0(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new at,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(D,C){return d?new OffscreenCanvas(D,C):Es("canvas")}function v(D,C,W){let Y=1;const ot=Dt(D);if((ot.width>W||ot.height>W)&&(Y=W/Math.max(ot.width,ot.height)),Y<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const K=Math.floor(Y*ot.width),Ut=Math.floor(Y*ot.height);u===void 0&&(u=x(K,Ut));const pt=C?x(K,Ut):u;return pt.width=K,pt.height=Ut,pt.getContext("2d").drawImage(D,0,0,K,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ot.width+"x"+ot.height+") to ("+K+"x"+Ut+")."),pt}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ot.width+"x"+ot.height+")."),D;return D}function _(D){return D.generateMipmaps}function p(D){i.generateMipmap(D)}function y(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function m(D,C,W,Y,ot=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let K=C;if(C===i.RED&&(W===i.FLOAT&&(K=i.R32F),W===i.HALF_FLOAT&&(K=i.R16F),W===i.UNSIGNED_BYTE&&(K=i.R8)),C===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(K=i.R8UI),W===i.UNSIGNED_SHORT&&(K=i.R16UI),W===i.UNSIGNED_INT&&(K=i.R32UI),W===i.BYTE&&(K=i.R8I),W===i.SHORT&&(K=i.R16I),W===i.INT&&(K=i.R32I)),C===i.RG&&(W===i.FLOAT&&(K=i.RG32F),W===i.HALF_FLOAT&&(K=i.RG16F),W===i.UNSIGNED_BYTE&&(K=i.RG8)),C===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(K=i.RG8UI),W===i.UNSIGNED_SHORT&&(K=i.RG16UI),W===i.UNSIGNED_INT&&(K=i.RG32UI),W===i.BYTE&&(K=i.RG8I),W===i.SHORT&&(K=i.RG16I),W===i.INT&&(K=i.RG32I)),C===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(K=i.RGB8UI),W===i.UNSIGNED_SHORT&&(K=i.RGB16UI),W===i.UNSIGNED_INT&&(K=i.RGB32UI),W===i.BYTE&&(K=i.RGB8I),W===i.SHORT&&(K=i.RGB16I),W===i.INT&&(K=i.RGB32I)),C===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),W===i.UNSIGNED_INT&&(K=i.RGBA32UI),W===i.BYTE&&(K=i.RGBA8I),W===i.SHORT&&(K=i.RGBA16I),W===i.INT&&(K=i.RGBA32I)),C===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),C===i.RGBA){const Ut=ot?kr:Qt.getTransfer(Y);W===i.FLOAT&&(K=i.RGBA32F),W===i.HALF_FLOAT&&(K=i.RGBA16F),W===i.UNSIGNED_BYTE&&(K=Ut===se?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function g(D,C){let W;return D?C===null||C===1014||C===1020?W=i.DEPTH24_STENCIL8:C===1015?W=i.DEPTH32F_STENCIL8:C===1012&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===1014||C===1020?W=i.DEPTH_COMPONENT24:C===1015?W=i.DEPTH_COMPONENT32F:C===1012&&(W=i.DEPTH_COMPONENT16),W}function M(D,C){return _(D)===!0||D.isFramebufferTexture&&D.minFilter!==1003&&D.minFilter!==1006?Math.log2(Math.max(C.width,C.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?C.mipmaps.length:1}function T(D){const C=D.target;C.removeEventListener("dispose",T),E(C),C.isVideoTexture&&h.delete(C)}function A(D){const C=D.target;C.removeEventListener("dispose",A),S(C)}function E(D){const C=n.get(D);if(C.__webglInit===void 0)return;const W=D.source,Y=f.get(W);if(Y){const ot=Y[C.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&b(D),Object.keys(Y).length===0&&f.delete(W)}n.remove(D)}function b(D){const C=n.get(D);i.deleteTexture(C.__webglTexture);const W=D.source,Y=f.get(W);delete Y[C.__cacheKey],o.memory.textures--}function S(D){const C=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(C.__webglFramebuffer[Y]))for(let ot=0;ot<C.__webglFramebuffer[Y].length;ot++)i.deleteFramebuffer(C.__webglFramebuffer[Y][ot]);else i.deleteFramebuffer(C.__webglFramebuffer[Y]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[Y])}else{if(Array.isArray(C.__webglFramebuffer))for(let Y=0;Y<C.__webglFramebuffer.length;Y++)i.deleteFramebuffer(C.__webglFramebuffer[Y]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let Y=0;Y<C.__webglColorRenderbuffer.length;Y++)C.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[Y]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const W=D.textures;for(let Y=0,ot=W.length;Y<ot;Y++){const K=n.get(W[Y]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(W[Y])}n.remove(D)}let w=0;function R(){w=0}function I(){const D=w;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),w+=1,D}function U(D){const C=[];return C.push(D.wrapS),C.push(D.wrapT),C.push(D.wrapR||0),C.push(D.magFilter),C.push(D.minFilter),C.push(D.anisotropy),C.push(D.internalFormat),C.push(D.format),C.push(D.type),C.push(D.generateMipmaps),C.push(D.premultiplyAlpha),C.push(D.flipY),C.push(D.unpackAlignment),C.push(D.colorSpace),C.join()}function F(D,C){const W=n.get(D);if(D.isVideoTexture&&st(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&W.__version!==D.version){const Y=D.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,D,C);return}}else D.isExternalTexture&&(W.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+C)}function B(D,C){const W=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){$(W,D,C);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+C)}function k(D,C){const W=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&W.__version!==D.version){$(W,D,C);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+C)}function z(D,C){const W=n.get(D);if(D.version>0&&W.__version!==D.version){Q(W,D,C);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+C)}const X={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},J={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},rt={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function mt(D,C){if(C.type===1015&&t.has("OES_texture_float_linear")===!1&&(C.magFilter===1006||C.magFilter===1007||C.magFilter===1005||C.magFilter===1008||C.minFilter===1006||C.minFilter===1007||C.minFilter===1005||C.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,X[C.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,X[C.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,X[C.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,J[C.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,J[C.minFilter]),C.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,rt[C.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===1003||C.minFilter!==1005&&C.minFilter!==1008||C.type===1015&&t.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function _t(D,C){let W=!1;D.__webglInit===void 0&&(D.__webglInit=!0,C.addEventListener("dispose",T));const Y=C.source;let ot=f.get(Y);ot===void 0&&(ot={},f.set(Y,ot));const K=U(C);if(K!==D.__cacheKey){ot[K]===void 0&&(ot[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ot[K].usedTimes++;const Ut=ot[D.__cacheKey];Ut!==void 0&&(ot[D.__cacheKey].usedTimes--,Ut.usedTimes===0&&b(C)),D.__cacheKey=K,D.__webglTexture=ot[K].texture}return W}function At(D,C,W){return Math.floor(Math.floor(D/W)/C)}function Rt(D,C,W,Y){const K=D.updateRanges;if(K.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,C.width,C.height,W,Y,C.data);else{K.sort((ct,bt)=>ct.start-bt.start);let Ut=0;for(let ct=1;ct<K.length;ct++){const bt=K[Ut],kt=K[ct],Nt=bt.start+bt.count,Mt=At(kt.start,C.width,4),qt=At(bt.start,C.width,4);kt.start<=Nt+1&&Mt===qt&&At(kt.start+kt.count-1,C.width,4)===Mt?bt.count=Math.max(bt.count,kt.start+kt.count-bt.start):(++Ut,K[Ut]=kt)}K.length=Ut+1;const pt=i.getParameter(i.UNPACK_ROW_LENGTH),Pt=i.getParameter(i.UNPACK_SKIP_PIXELS),It=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,C.width);for(let ct=0,bt=K.length;ct<bt;ct++){const kt=K[ct],Nt=Math.floor(kt.start/4),Mt=Math.ceil(kt.count/4),qt=Nt%C.width,O=Math.floor(Nt/C.width),ut=Mt,xt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),e.texSubImage2D(i.TEXTURE_2D,0,qt,O,ut,xt,W,Y,C.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,It)}}function $(D,C,W){let Y=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(Y=i.TEXTURE_3D);const ot=_t(D,C),K=C.source;e.bindTexture(Y,D.__webglTexture,i.TEXTURE0+W);const Ut=n.get(K);if(K.version!==Ut.__version||ot===!0){e.activeTexture(i.TEXTURE0+W);const pt=Qt.getPrimaries(Qt.workingColorSpace),Pt=C.colorSpace===""?null:Qt.getPrimaries(C.colorSpace),It=C.colorSpace===""||pt===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let ct=v(C.image,!1,s.maxTextureSize);ct=gt(C,ct);const bt=r.convert(C.format,C.colorSpace),kt=r.convert(C.type);let Nt=m(C.internalFormat,bt,kt,C.colorSpace,C.isVideoTexture);mt(Y,C);let Mt;const qt=C.mipmaps,O=C.isVideoTexture!==!0,ut=Ut.__version===void 0||ot===!0,xt=K.dataReady,wt=M(C,ct);if(C.isDepthTexture)Nt=g(C.format===1027,C.type),ut&&(O?e.texStorage2D(i.TEXTURE_2D,1,Nt,ct.width,ct.height):e.texImage2D(i.TEXTURE_2D,0,Nt,ct.width,ct.height,0,bt,kt,null));else if(C.isDataTexture)if(qt.length>0){O&&ut&&e.texStorage2D(i.TEXTURE_2D,wt,Nt,qt[0].width,qt[0].height);for(let lt=0,nt=qt.length;lt<nt;lt++)Mt=qt[lt],O?xt&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Mt.width,Mt.height,bt,kt,Mt.data):e.texImage2D(i.TEXTURE_2D,lt,Nt,Mt.width,Mt.height,0,bt,kt,Mt.data);C.generateMipmaps=!1}else O?(ut&&e.texStorage2D(i.TEXTURE_2D,wt,Nt,ct.width,ct.height),xt&&Rt(C,ct,bt,kt)):e.texImage2D(i.TEXTURE_2D,0,Nt,ct.width,ct.height,0,bt,kt,ct.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){O&&ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Nt,qt[0].width,qt[0].height,ct.depth);for(let lt=0,nt=qt.length;lt<nt;lt++)if(Mt=qt[lt],C.format!==1023)if(bt!==null)if(O){if(xt)if(C.layerUpdates.size>0){const Lt=Xc(Mt.width,Mt.height,C.format,C.type);for(const Zt of C.layerUpdates){const ae=Mt.data.subarray(Zt*Lt/Mt.data.BYTES_PER_ELEMENT,(Zt+1)*Lt/Mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,Zt,Mt.width,Mt.height,1,bt,ae)}C.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Mt.width,Mt.height,ct.depth,bt,Mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,lt,Nt,Mt.width,Mt.height,ct.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?xt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Mt.width,Mt.height,ct.depth,bt,kt,Mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,lt,Nt,Mt.width,Mt.height,ct.depth,0,bt,kt,Mt.data)}else{O&&ut&&e.texStorage2D(i.TEXTURE_2D,wt,Nt,qt[0].width,qt[0].height);for(let lt=0,nt=qt.length;lt<nt;lt++)Mt=qt[lt],C.format!==1023?bt!==null?O?xt&&e.compressedTexSubImage2D(i.TEXTURE_2D,lt,0,0,Mt.width,Mt.height,bt,Mt.data):e.compressedTexImage2D(i.TEXTURE_2D,lt,Nt,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?xt&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Mt.width,Mt.height,bt,kt,Mt.data):e.texImage2D(i.TEXTURE_2D,lt,Nt,Mt.width,Mt.height,0,bt,kt,Mt.data)}else if(C.isDataArrayTexture)if(O){if(ut&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Nt,ct.width,ct.height,ct.depth),xt)if(C.layerUpdates.size>0){const lt=Xc(ct.width,ct.height,C.format,C.type);for(const nt of C.layerUpdates){const Lt=ct.data.subarray(nt*lt/ct.data.BYTES_PER_ELEMENT,(nt+1)*lt/ct.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,nt,ct.width,ct.height,1,bt,kt,Lt)}C.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ct.width,ct.height,ct.depth,bt,kt,ct.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Nt,ct.width,ct.height,ct.depth,0,bt,kt,ct.data);else if(C.isData3DTexture)O?(ut&&e.texStorage3D(i.TEXTURE_3D,wt,Nt,ct.width,ct.height,ct.depth),xt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ct.width,ct.height,ct.depth,bt,kt,ct.data)):e.texImage3D(i.TEXTURE_3D,0,Nt,ct.width,ct.height,ct.depth,0,bt,kt,ct.data);else if(C.isFramebufferTexture){if(ut)if(O)e.texStorage2D(i.TEXTURE_2D,wt,Nt,ct.width,ct.height);else{let lt=ct.width,nt=ct.height;for(let Lt=0;Lt<wt;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,Nt,lt,nt,0,bt,kt,null),lt>>=1,nt>>=1}}else if(qt.length>0){if(O&&ut){const lt=Dt(qt[0]);e.texStorage2D(i.TEXTURE_2D,wt,Nt,lt.width,lt.height)}for(let lt=0,nt=qt.length;lt<nt;lt++)Mt=qt[lt],O?xt&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,bt,kt,Mt):e.texImage2D(i.TEXTURE_2D,lt,Nt,bt,kt,Mt);C.generateMipmaps=!1}else if(O){if(ut){const lt=Dt(ct);e.texStorage2D(i.TEXTURE_2D,wt,Nt,lt.width,lt.height)}xt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,kt,ct)}else e.texImage2D(i.TEXTURE_2D,0,Nt,bt,kt,ct);_(C)&&p(Y),Ut.__version=K.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function Q(D,C,W){if(C.image.length!==6)return;const Y=_t(D,C),ot=C.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+W);const K=n.get(ot);if(ot.version!==K.__version||Y===!0){e.activeTexture(i.TEXTURE0+W);const Ut=Qt.getPrimaries(Qt.workingColorSpace),pt=C.colorSpace===""?null:Qt.getPrimaries(C.colorSpace),Pt=C.colorSpace===""||Ut===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const It=C.isCompressedTexture||C.image[0].isCompressedTexture,ct=C.image[0]&&C.image[0].isDataTexture,bt=[];for(let nt=0;nt<6;nt++)!It&&!ct?bt[nt]=v(C.image[nt],!0,s.maxCubemapSize):bt[nt]=ct?C.image[nt].image:C.image[nt],bt[nt]=gt(C,bt[nt]);const kt=bt[0],Nt=r.convert(C.format,C.colorSpace),Mt=r.convert(C.type),qt=m(C.internalFormat,Nt,Mt,C.colorSpace),O=C.isVideoTexture!==!0,ut=K.__version===void 0||Y===!0,xt=ot.dataReady;let wt=M(C,kt);mt(i.TEXTURE_CUBE_MAP,C);let lt;if(It){O&&ut&&e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,qt,kt.width,kt.height);for(let nt=0;nt<6;nt++){lt=bt[nt].mipmaps;for(let Lt=0;Lt<lt.length;Lt++){const Zt=lt[Lt];C.format!==1023?Nt!==null?O?xt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt,0,0,Zt.width,Zt.height,Nt,Zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt,qt,Zt.width,Zt.height,0,Zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt,0,0,Zt.width,Zt.height,Nt,Mt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt,qt,Zt.width,Zt.height,0,Nt,Mt,Zt.data)}}}else{if(lt=C.mipmaps,O&&ut){lt.length>0&&wt++;const nt=Dt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,qt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(ct){O?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,bt[nt].width,bt[nt].height,Nt,Mt,bt[nt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,qt,bt[nt].width,bt[nt].height,0,Nt,Mt,bt[nt].data);for(let Lt=0;Lt<lt.length;Lt++){const ae=lt[Lt].image[nt].image;O?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt+1,0,0,ae.width,ae.height,Nt,Mt,ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt+1,qt,ae.width,ae.height,0,Nt,Mt,ae.data)}}else{O?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Nt,Mt,bt[nt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,qt,Nt,Mt,bt[nt]);for(let Lt=0;Lt<lt.length;Lt++){const Zt=lt[Lt];O?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt+1,0,0,Nt,Mt,Zt.image[nt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Lt+1,qt,Nt,Mt,Zt.image[nt])}}}_(C)&&p(i.TEXTURE_CUBE_MAP),K.__version=ot.version,C.onUpdate&&C.onUpdate(C)}D.__version=C.version}function ft(D,C,W,Y,ot,K){const Ut=r.convert(W.format,W.colorSpace),pt=r.convert(W.type),Pt=m(W.internalFormat,Ut,pt,W.colorSpace),It=n.get(C),ct=n.get(W);if(ct.__renderTarget=C,!It.__hasExternalTextures){const bt=Math.max(1,C.width>>K),kt=Math.max(1,C.height>>K);ot===i.TEXTURE_3D||ot===i.TEXTURE_2D_ARRAY?e.texImage3D(ot,K,Pt,bt,kt,C.depth,0,Ut,pt,null):e.texImage2D(ot,K,Pt,bt,kt,0,Ut,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),V(C)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,ot,ct.__webglTexture,0,dt(C)):(ot===i.TEXTURE_2D||ot>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,ot,ct.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(D,C,W){if(i.bindRenderbuffer(i.RENDERBUFFER,D),C.depthBuffer){const Y=C.depthTexture,ot=Y&&Y.isDepthTexture?Y.type:null,K=g(C.stencilBuffer,ot),Ut=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=dt(C);V(C)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pt,K,C.width,C.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,pt,K,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,K,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ut,i.RENDERBUFFER,D)}else{const Y=C.textures;for(let ot=0;ot<Y.length;ot++){const K=Y[ot],Ut=r.convert(K.format,K.colorSpace),pt=r.convert(K.type),Pt=m(K.internalFormat,Ut,pt,K.colorSpace),It=dt(C);W&&V(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,It,Pt,C.width,C.height):V(C)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,It,Pt,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function vt(D,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(C.depthTexture);Y.__renderTarget=C,(!Y.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),F(C.depthTexture,0);const ot=Y.__webglTexture,K=dt(C);if(C.depthTexture.format===1026)V(C)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ot,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ot,0);else if(C.depthTexture.format===1027)V(C)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ot,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ot,0);else throw new Error("Unknown depthTexture format")}function Bt(D){const C=n.get(D),W=D.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==D.depthTexture){const Y=D.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),Y){const ot=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,Y.removeEventListener("dispose",ot)};Y.addEventListener("dispose",ot),C.__depthDisposeCallback=ot}C.__boundDepthTexture=Y}if(D.depthTexture&&!C.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const Y=D.texture.mipmaps;Y&&Y.length>0?vt(C.__webglFramebuffer[0],D):vt(C.__webglFramebuffer,D)}else if(W){C.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[Y]),C.__webglDepthbuffer[Y]===void 0)C.__webglDepthbuffer[Y]=i.createRenderbuffer(),Tt(C.__webglDepthbuffer[Y],D,!1);else{const ot=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=C.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,K)}}else{const Y=D.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),Tt(C.__webglDepthbuffer,D,!1);else{const ot=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ot,i.RENDERBUFFER,K)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(D,C,W){const Y=n.get(D);C!==void 0&&ft(Y.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Bt(D)}function N(D){const C=D.texture,W=n.get(D),Y=n.get(C);D.addEventListener("dispose",A);const ot=D.textures,K=D.isWebGLCubeRenderTarget===!0,Ut=ot.length>1;if(Ut||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=C.version,o.memory.textures++),K){W.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(C.mipmaps&&C.mipmaps.length>0){W.__webglFramebuffer[pt]=[];for(let Pt=0;Pt<C.mipmaps.length;Pt++)W.__webglFramebuffer[pt][Pt]=i.createFramebuffer()}else W.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){W.__webglFramebuffer=[];for(let pt=0;pt<C.mipmaps.length;pt++)W.__webglFramebuffer[pt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Ut)for(let pt=0,Pt=ot.length;pt<Pt;pt++){const It=n.get(ot[pt]);It.__webglTexture===void 0&&(It.__webglTexture=i.createTexture(),o.memory.textures++)}if(D.samples>0&&V(D)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let pt=0;pt<ot.length;pt++){const Pt=ot[pt];W.__webglColorRenderbuffer[pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[pt]);const It=r.convert(Pt.format,Pt.colorSpace),ct=r.convert(Pt.type),bt=m(Pt.internalFormat,It,ct,Pt.colorSpace,D.isXRRenderTarget===!0),kt=dt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,kt,bt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,W.__webglColorRenderbuffer[pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),Tt(W.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),mt(i.TEXTURE_CUBE_MAP,C);for(let pt=0;pt<6;pt++)if(C.mipmaps&&C.mipmaps.length>0)for(let Pt=0;Pt<C.mipmaps.length;Pt++)ft(W.__webglFramebuffer[pt][Pt],D,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Pt);else ft(W.__webglFramebuffer[pt],D,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);_(C)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let pt=0,Pt=ot.length;pt<Pt;pt++){const It=ot[pt],ct=n.get(It);let bt=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(bt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(bt,ct.__webglTexture),mt(bt,It),ft(W.__webglFramebuffer,D,It,i.COLOR_ATTACHMENT0+pt,bt,0),_(It)&&p(bt)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(pt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(pt,Y.__webglTexture),mt(pt,C),C.mipmaps&&C.mipmaps.length>0)for(let Pt=0;Pt<C.mipmaps.length;Pt++)ft(W.__webglFramebuffer[Pt],D,C,i.COLOR_ATTACHMENT0,pt,Pt);else ft(W.__webglFramebuffer,D,C,i.COLOR_ATTACHMENT0,pt,0);_(C)&&p(pt),e.unbindTexture()}D.depthBuffer&&Bt(D)}function it(D){const C=D.textures;for(let W=0,Y=C.length;W<Y;W++){const ot=C[W];if(_(ot)){const K=y(D),Ut=n.get(ot).__webglTexture;e.bindTexture(K,Ut),p(K),e.unbindTexture()}}}const et=[],tt=[];function j(D){if(D.samples>0){if(V(D)===!1){const C=D.textures,W=D.width,Y=D.height;let ot=i.COLOR_BUFFER_BIT;const K=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ut=n.get(D),pt=C.length>1;if(pt)for(let It=0;It<C.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer);const Pt=D.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let It=0;It<C.length;It++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ot|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ot|=i.STENCIL_BUFFER_BIT)),pt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ct=n.get(C[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ct,0)}i.blitFramebuffer(0,0,W,Y,0,0,W,Y,ot,i.NEAREST),c===!0&&(et.length=0,tt.length=0,et.push(i.COLOR_ATTACHMENT0+It),D.depthBuffer&&D.resolveDepthBuffer===!1&&(et.push(K),tt.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,et))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pt)for(let It=0;It<C.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,Ut.__webglColorRenderbuffer[It]);const ct=n.get(C[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ut.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,ct,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const C=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function dt(D){return Math.min(s.maxSamples,D.samples)}function V(D){const C=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function st(D){const C=o.render.frame;h.get(D)!==C&&(h.set(D,C),D.update())}function gt(D,C){const W=D.colorSpace,Y=D.format,ot=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||W!==Hi&&W!==""&&(Qt.getTransfer(W)===se?(Y!==1023||ot!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),C}function Dt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=R,this.setTexture2D=F,this.setTexture2DArray=B,this.setTexture3D=k,this.setTextureCube=z,this.rebindTextures=Ot,this.setupRenderTarget=N,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=Bt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=V}function v0(i,t){function e(n,s=""){let r;const o=Qt.getTransfer(s);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(o===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===36196||n===37492)return o===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===37496)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===37808)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===36492)return o===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const M0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,S0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class b0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Kl(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Xn({vertexShader:M0,fragmentShader:S0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new He(new jr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class T0 extends qi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,x=null;const v=typeof XRWebGLBinding<"u",_=new b0,p={},y=e.getContextAttributes();let m=null,g=null;const M=[],T=[],A=new at;let E=null;const b=new $e;b.viewport=new te;const S=new $e;S.viewport=new te;const w=[b,S],R=new Uf;let I=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Q=M[$];return Q===void 0&&(Q=new Ro,M[$]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function($){let Q=M[$];return Q===void 0&&(Q=new Ro,M[$]=Q),Q.getGripSpace()},this.getHand=function($){let Q=M[$];return Q===void 0&&(Q=new Ro,M[$]=Q),Q.getHandSpace()};function F($){const Q=T.indexOf($.inputSource);if(Q===-1)return;const ft=M[Q];ft!==void 0&&(ft.update($.inputSource,$.frame,l||o),ft.dispatchEvent({type:$.type,data:$.inputSource}))}function B(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",k);for(let $=0;$<M.length;$++){const Q=T[$];Q!==null&&(T[$]=null,M[$].disconnect(Q))}I=null,U=null,_.reset();for(const $ in p)delete p[$];t.setRenderTarget(m),d=null,f=null,u=null,s=null,g=null,Rt.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",B),s.addEventListener("inputsourceschange",k),y.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ft=null,Tt=null,vt=null;y.depth&&(vt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ft=y.stencil?1027:1026,Tt=y.stencil?1020:1014);const Bt={colorFormat:e.RGBA8,depthFormat:vt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Bt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),g=new ci(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new Jl(f.textureWidth,f.textureHeight,Tt,void 0,void 0,void 0,void 0,void 0,void 0,ft),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const ft={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,ft),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),g=new ci(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Rt.setContext(s),Rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k($){for(let Q=0;Q<$.removed.length;Q++){const ft=$.removed[Q],Tt=T.indexOf(ft);Tt>=0&&(T[Tt]=null,M[Tt].disconnect(ft))}for(let Q=0;Q<$.added.length;Q++){const ft=$.added[Q];let Tt=T.indexOf(ft);if(Tt===-1){for(let Bt=0;Bt<M.length;Bt++)if(Bt>=T.length){T.push(ft),Tt=Bt;break}else if(T[Bt]===null){T[Bt]=ft,Tt=Bt;break}if(Tt===-1)break}const vt=M[Tt];vt&&vt.connect(ft)}}const z=new L,X=new L;function J($,Q,ft){z.setFromMatrixPosition(Q.matrixWorld),X.setFromMatrixPosition(ft.matrixWorld);const Tt=z.distanceTo(X),vt=Q.projectionMatrix.elements,Bt=ft.projectionMatrix.elements,Ot=vt[14]/(vt[10]-1),N=vt[14]/(vt[10]+1),it=(vt[9]+1)/vt[5],et=(vt[9]-1)/vt[5],tt=(vt[8]-1)/vt[0],j=(Bt[8]+1)/Bt[0],dt=Ot*tt,V=Ot*j,st=Tt/(-tt+j),gt=st*-tt;if(Q.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(gt),$.translateZ(st),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),vt[10]===-1)$.projectionMatrix.copy(Q.projectionMatrix),$.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const Dt=Ot+st,D=N+st,C=dt-gt,W=V+(Tt-gt),Y=it*N/D*Dt,ot=et*N/D*Dt;$.projectionMatrix.makePerspective(C,W,Y,ot,Dt,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function rt($,Q){Q===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Q.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Q=$.near,ft=$.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(ft=_.depthFar)),R.near=S.near=b.near=Q,R.far=S.far=b.far=ft,(I!==R.near||U!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),I=R.near,U=R.far),R.layers.mask=$.layers.mask|6,b.layers.mask=R.layers.mask&3,S.layers.mask=R.layers.mask&5;const Tt=$.parent,vt=R.cameras;rt(R,Tt);for(let Bt=0;Bt<vt.length;Bt++)rt(vt[Bt],Tt);vt.length===2?J(R,b,S):R.projectionMatrix.copy(b.projectionMatrix),mt($,R,Tt)};function mt($,Q,ft){ft===null?$.matrix.copy(Q.matrixWorld):($.matrix.copy(ft.matrixWorld),$.matrix.invert(),$.matrix.multiply(Q.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Q.projectionMatrix),$.projectionMatrixInverse.copy(Q.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Wi*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function($){c=$,f!==null&&(f.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(R)},this.getCameraTexture=function($){return p[$]};let _t=null;function At($,Q){if(h=Q.getViewerPose(l||o),x=Q,h!==null){const ft=h.views;d!==null&&(t.setRenderTargetFramebuffer(g,d.framebuffer),t.setRenderTarget(g));let Tt=!1;ft.length!==R.cameras.length&&(R.cameras.length=0,Tt=!0);for(let N=0;N<ft.length;N++){const it=ft[N];let et=null;if(d!==null)et=d.getViewport(it);else{const j=u.getViewSubImage(f,it);et=j.viewport,N===0&&(t.setRenderTargetTextures(g,j.colorTexture,j.depthStencilTexture),t.setRenderTarget(g))}let tt=w[N];tt===void 0&&(tt=new $e,tt.layers.enable(N),tt.viewport=new te,w[N]=tt),tt.matrix.fromArray(it.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(it.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(et.x,et.y,et.width,et.height),N===0&&(R.matrix.copy(tt.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Tt===!0&&R.cameras.push(tt)}const vt=s.enabledFeatures;if(vt&&vt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const N=u.getDepthInformation(ft[0]);N&&N.isValid&&N.texture&&_.init(N,s.renderState)}if(vt&&vt.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let N=0;N<ft.length;N++){const it=ft[N].camera;if(it){let et=p[it];et||(et=new Kl,p[it]=et);const tt=u.getCameraImage(it);et.sourceTexture=tt}}}}for(let ft=0;ft<M.length;ft++){const Tt=T[ft],vt=M[ft];Tt!==null&&vt!==void 0&&vt.update(Tt,Q,l||o)}_t&&_t($,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),x=null}const Rt=new yh;Rt.setAnimationLoop(At),this.setAnimationLoop=function($){_t=$},this.dispose=function(){}}}const ei=new ln,E0=new Ht;function A0(i,t){function e(_,p){_.matrixAutoUpdate===!0&&_.updateMatrix(),p.value.copy(_.matrix)}function n(_,p){p.color.getRGB(_.fogColor.value,Wl(i)),p.isFog?(_.fogNear.value=p.near,_.fogFar.value=p.far):p.isFogExp2&&(_.fogDensity.value=p.density)}function s(_,p,y,m,g){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(_,p):p.isMeshToonMaterial?(r(_,p),u(_,p)):p.isMeshPhongMaterial?(r(_,p),h(_,p)):p.isMeshStandardMaterial?(r(_,p),f(_,p),p.isMeshPhysicalMaterial&&d(_,p,g)):p.isMeshMatcapMaterial?(r(_,p),x(_,p)):p.isMeshDepthMaterial?r(_,p):p.isMeshDistanceMaterial?(r(_,p),v(_,p)):p.isMeshNormalMaterial?r(_,p):p.isLineBasicMaterial?(o(_,p),p.isLineDashedMaterial&&a(_,p)):p.isPointsMaterial?c(_,p,y,m):p.isSpriteMaterial?l(_,p):p.isShadowMaterial?(_.color.value.copy(p.color),_.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(_,p){_.opacity.value=p.opacity,p.color&&_.diffuse.value.copy(p.color),p.emissive&&_.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(_.map.value=p.map,e(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.bumpMap&&(_.bumpMap.value=p.bumpMap,e(p.bumpMap,_.bumpMapTransform),_.bumpScale.value=p.bumpScale,p.side===1&&(_.bumpScale.value*=-1)),p.normalMap&&(_.normalMap.value=p.normalMap,e(p.normalMap,_.normalMapTransform),_.normalScale.value.copy(p.normalScale),p.side===1&&_.normalScale.value.negate()),p.displacementMap&&(_.displacementMap.value=p.displacementMap,e(p.displacementMap,_.displacementMapTransform),_.displacementScale.value=p.displacementScale,_.displacementBias.value=p.displacementBias),p.emissiveMap&&(_.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,_.emissiveMapTransform)),p.specularMap&&(_.specularMap.value=p.specularMap,e(p.specularMap,_.specularMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest);const y=t.get(p),m=y.envMap,g=y.envMapRotation;m&&(_.envMap.value=m,ei.copy(g),ei.x*=-1,ei.y*=-1,ei.z*=-1,m.isCubeTexture&&m.isRenderTargetTexture===!1&&(ei.y*=-1,ei.z*=-1),_.envMapRotation.value.setFromMatrix4(E0.makeRotationFromEuler(ei)),_.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,_.reflectivity.value=p.reflectivity,_.ior.value=p.ior,_.refractionRatio.value=p.refractionRatio),p.lightMap&&(_.lightMap.value=p.lightMap,_.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,_.lightMapTransform)),p.aoMap&&(_.aoMap.value=p.aoMap,_.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,_.aoMapTransform))}function o(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,p.map&&(_.map.value=p.map,e(p.map,_.mapTransform))}function a(_,p){_.dashSize.value=p.dashSize,_.totalSize.value=p.dashSize+p.gapSize,_.scale.value=p.scale}function c(_,p,y,m){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.size.value=p.size*y,_.scale.value=m*.5,p.map&&(_.map.value=p.map,e(p.map,_.uvTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function l(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.rotation.value=p.rotation,p.map&&(_.map.value=p.map,e(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function h(_,p){_.specular.value.copy(p.specular),_.shininess.value=Math.max(p.shininess,1e-4)}function u(_,p){p.gradientMap&&(_.gradientMap.value=p.gradientMap)}function f(_,p){_.metalness.value=p.metalness,p.metalnessMap&&(_.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,_.metalnessMapTransform)),_.roughness.value=p.roughness,p.roughnessMap&&(_.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,_.roughnessMapTransform)),p.envMap&&(_.envMapIntensity.value=p.envMapIntensity)}function d(_,p,y){_.ior.value=p.ior,p.sheen>0&&(_.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),_.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(_.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,_.sheenColorMapTransform)),p.sheenRoughnessMap&&(_.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,_.sheenRoughnessMapTransform))),p.clearcoat>0&&(_.clearcoat.value=p.clearcoat,_.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(_.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,_.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(_.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&_.clearcoatNormalScale.value.negate())),p.dispersion>0&&(_.dispersion.value=p.dispersion),p.iridescence>0&&(_.iridescence.value=p.iridescence,_.iridescenceIOR.value=p.iridescenceIOR,_.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(_.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,_.iridescenceMapTransform)),p.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),p.transmission>0&&(_.transmission.value=p.transmission,_.transmissionSamplerMap.value=y.texture,_.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(_.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,_.transmissionMapTransform)),_.thickness.value=p.thickness,p.thicknessMap&&(_.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=p.attenuationDistance,_.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(_.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(_.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=p.specularIntensity,_.specularColor.value.copy(p.specularColor),p.specularColorMap&&(_.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,_.specularColorMapTransform)),p.specularIntensityMap&&(_.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,_.specularIntensityMapTransform))}function x(_,p){p.matcap&&(_.matcap.value=p.matcap)}function v(_,p){const y=t.get(p).light;_.referencePosition.value.setFromMatrixPosition(y.matrixWorld),_.nearDistance.value=y.shadow.camera.near,_.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function w0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,m){const g=m.program;n.uniformBlockBinding(y,g)}function l(y,m){let g=s[y.id];g===void 0&&(x(y),g=h(y),s[y.id]=g,y.addEventListener("dispose",_));const M=m.program;n.updateUBOMapping(y,M);const T=t.render.frame;r[y.id]!==T&&(f(y),r[y.id]=T)}function h(y){const m=u();y.__bindingPointIndex=m;const g=i.createBuffer(),M=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,g),i.bufferData(i.UNIFORM_BUFFER,M,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,m,g),g}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const m=s[y.id],g=y.uniforms,M=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,m);for(let T=0,A=g.length;T<A;T++){const E=Array.isArray(g[T])?g[T]:[g[T]];for(let b=0,S=E.length;b<S;b++){const w=E[b];if(d(w,T,b,M)===!0){const R=w.__offset,I=Array.isArray(w.value)?w.value:[w.value];let U=0;for(let F=0;F<I.length;F++){const B=I[F],k=v(B);typeof B=="number"||typeof B=="boolean"?(w.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,R+U,w.__data)):B.isMatrix3?(w.__data[0]=B.elements[0],w.__data[1]=B.elements[1],w.__data[2]=B.elements[2],w.__data[3]=0,w.__data[4]=B.elements[3],w.__data[5]=B.elements[4],w.__data[6]=B.elements[5],w.__data[7]=0,w.__data[8]=B.elements[6],w.__data[9]=B.elements[7],w.__data[10]=B.elements[8],w.__data[11]=0):(B.toArray(w.__data,U),U+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,R,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,m,g,M){const T=y.value,A=m+"_"+g;if(M[A]===void 0)return typeof T=="number"||typeof T=="boolean"?M[A]=T:M[A]=T.clone(),!0;{const E=M[A];if(typeof T=="number"||typeof T=="boolean"){if(E!==T)return M[A]=T,!0}else if(E.equals(T)===!1)return E.copy(T),!0}return!1}function x(y){const m=y.uniforms;let g=0;const M=16;for(let A=0,E=m.length;A<E;A++){const b=Array.isArray(m[A])?m[A]:[m[A]];for(let S=0,w=b.length;S<w;S++){const R=b[S],I=Array.isArray(R.value)?R.value:[R.value];for(let U=0,F=I.length;U<F;U++){const B=I[U],k=v(B),z=g%M,X=z%k.boundary,J=z+X;g+=X,J!==0&&M-J<k.storage&&(g+=M-J),R.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=g,g+=k.storage}}}const T=g%M;return T>0&&(g+=M-T),y.__size=g,y.__cache={},this}function v(y){const m={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(m.boundary=4,m.storage=4):y.isVector2?(m.boundary=8,m.storage=8):y.isVector3||y.isColor?(m.boundary=16,m.storage=12):y.isVector4?(m.boundary=16,m.storage=16):y.isMatrix3?(m.boundary=48,m.storage=48):y.isMatrix4?(m.boundary=64,m.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),m}function _(y){const m=y.target;m.removeEventListener("dispose",_);const g=o.indexOf(m.__bindingPointIndex);o.splice(g,1),i.deleteBuffer(s[m.id]),delete s[m.id],delete r[m.id]}function p(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class X1{constructor(t={}){const{canvas:e=Qh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const x=new Uint32Array(4),v=new Int32Array(4);let _=null,p=null;const y=[],m=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let M=!1;this._outputColorSpace=Ye;let T=0,A=0,E=null,b=-1,S=null;const w=new te,R=new te;let I=null;const U=new Xt(0);let F=0,B=e.width,k=e.height,z=1,X=null,J=null;const rt=new te(0,0,B,k),mt=new te(0,0,B,k);let _t=!1;const At=new Pa;let Rt=!1,$=!1;const Q=new Ht,ft=new L,Tt=new te,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Bt=!1;function Ot(){return E===null?z:1}let N=n;function it(P,G){return e.getContext(P,G)}try{const P={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r180"),e.addEventListener("webglcontextlost",xt,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),N===null){const G="webgl2";if(N=it(G,P),N===null)throw it(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let et,tt,j,dt,V,st,gt,Dt,D,C,W,Y,ot,K,Ut,pt,Pt,It,ct,bt,kt,Nt,Mt,qt;function O(){et=new Bm(N),et.init(),Nt=new v0(N,et),tt=new Im(N,et,t,Nt),j=new _0(N,et),tt.reversedDepthBuffer&&f&&j.buffers.depth.setReversed(!0),dt=new km(N),V=new r0,st=new y0(N,et,j,V,tt,Nt,dt),gt=new Dm(g),Dt=new zm(g),D=new qf(N),Mt=new Cm(N,D),C=new Om(N,D,dt,Mt),W=new Hm(N,C,D,dt),ct=new Gm(N,tt,st),pt=new Lm(V),Y=new s0(g,gt,Dt,et,tt,Mt,pt),ot=new A0(g,V),K=new a0,Ut=new d0(et),It=new Rm(g,gt,Dt,j,W,d,c),Pt=new g0(g,W,tt),qt=new w0(N,dt,tt,j),bt=new Pm(N,et,dt),kt=new Vm(N,et,dt),dt.programs=Y.programs,g.capabilities=tt,g.extensions=et,g.properties=V,g.renderLists=K,g.shadowMap=Pt,g.state=j,g.info=dt}O();const ut=new T0(g,N);this.xr=ut,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const P=et.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=et.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(P){P!==void 0&&(z=P,this.setSize(B,k,!1))},this.getSize=function(P){return P.set(B,k)},this.setSize=function(P,G,Z=!0){if(ut.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=P,k=G,e.width=Math.floor(P*z),e.height=Math.floor(G*z),Z===!0&&(e.style.width=P+"px",e.style.height=G+"px"),this.setViewport(0,0,P,G)},this.getDrawingBufferSize=function(P){return P.set(B*z,k*z).floor()},this.setDrawingBufferSize=function(P,G,Z){B=P,k=G,z=Z,e.width=Math.floor(P*Z),e.height=Math.floor(G*Z),this.setViewport(0,0,P,G)},this.getCurrentViewport=function(P){return P.copy(w)},this.getViewport=function(P){return P.copy(rt)},this.setViewport=function(P,G,Z,q){P.isVector4?rt.set(P.x,P.y,P.z,P.w):rt.set(P,G,Z,q),j.viewport(w.copy(rt).multiplyScalar(z).round())},this.getScissor=function(P){return P.copy(mt)},this.setScissor=function(P,G,Z,q){P.isVector4?mt.set(P.x,P.y,P.z,P.w):mt.set(P,G,Z,q),j.scissor(R.copy(mt).multiplyScalar(z).round())},this.getScissorTest=function(){return _t},this.setScissorTest=function(P){j.setScissorTest(_t=P)},this.setOpaqueSort=function(P){X=P},this.setTransparentSort=function(P){J=P},this.getClearColor=function(P){return P.copy(It.getClearColor())},this.setClearColor=function(){It.setClearColor(...arguments)},this.getClearAlpha=function(){return It.getClearAlpha()},this.setClearAlpha=function(){It.setClearAlpha(...arguments)},this.clear=function(P=!0,G=!0,Z=!0){let q=0;if(P){let H=!1;if(E!==null){const ht=E.texture.format;H=ht===1033||ht===1031||ht===1029}if(H){const ht=E.texture.type,St=ht===1009||ht===1014||ht===1012||ht===1020||ht===1017||ht===1018,Ct=It.getClearColor(),Et=It.getClearAlpha(),Vt=Ct.r,Gt=Ct.g,Ft=Ct.b;St?(x[0]=Vt,x[1]=Gt,x[2]=Ft,x[3]=Et,N.clearBufferuiv(N.COLOR,0,x)):(v[0]=Vt,v[1]=Gt,v[2]=Ft,v[3]=Et,N.clearBufferiv(N.COLOR,0,v))}else q|=N.COLOR_BUFFER_BIT}G&&(q|=N.DEPTH_BUFFER_BIT),Z&&(q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",xt,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),It.dispose(),K.dispose(),Ut.dispose(),V.dispose(),gt.dispose(),Dt.dispose(),W.dispose(),Mt.dispose(),qt.dispose(),Y.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",fn),ut.removeEventListener("sessionend",Za),Yn.stop()};function xt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const P=dt.autoReset,G=Pt.enabled,Z=Pt.autoUpdate,q=Pt.needsUpdate,H=Pt.type;O(),dt.autoReset=P,Pt.enabled=G,Pt.autoUpdate=Z,Pt.needsUpdate=q,Pt.type=H}function lt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function nt(P){const G=P.target;G.removeEventListener("dispose",nt),Lt(G)}function Lt(P){Zt(P),V.remove(P)}function Zt(P){const G=V.get(P).programs;G!==void 0&&(G.forEach(function(Z){Y.releaseProgram(Z)}),P.isShaderMaterial&&Y.releaseShaderCache(P))}this.renderBufferDirect=function(P,G,Z,q,H,ht){G===null&&(G=vt);const St=H.isMesh&&H.matrixWorld.determinant()<0,Ct=Ph(P,G,Z,q,H);j.setMaterial(q,St);let Et=Z.index,Vt=1;if(q.wireframe===!0){if(Et=C.getWireframeAttribute(Z),Et===void 0)return;Vt=2}const Gt=Z.drawRange,Ft=Z.attributes.position;let Kt=Gt.start*Vt,ie=(Gt.start+Gt.count)*Vt;ht!==null&&(Kt=Math.max(Kt,ht.start*Vt),ie=Math.min(ie,(ht.start+ht.count)*Vt)),Et!==null?(Kt=Math.max(Kt,0),ie=Math.min(ie,Et.count)):Ft!=null&&(Kt=Math.max(Kt,0),ie=Math.min(ie,Ft.count));const pe=ie-Kt;if(pe<0||pe===1/0)return;Mt.setup(H,q,Ct,Z,Et);let ce,oe=bt;if(Et!==null&&(ce=D.get(Et),oe=kt,oe.setIndex(ce)),H.isMesh)q.wireframe===!0?(j.setLineWidth(q.wireframeLinewidth*Ot()),oe.setMode(N.LINES)):oe.setMode(N.TRIANGLES);else if(H.isLine){let zt=q.linewidth;zt===void 0&&(zt=1),j.setLineWidth(zt*Ot()),H.isLineSegments?oe.setMode(N.LINES):H.isLineLoop?oe.setMode(N.LINE_LOOP):oe.setMode(N.LINE_STRIP)}else H.isPoints?oe.setMode(N.POINTS):H.isSprite&&oe.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)As("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),oe.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))oe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const zt=H._multiDrawStarts,he=H._multiDrawCounts,jt=H._multiDrawCount,We=Et?D.get(Et).bytesPerElement:1,ui=V.get(q).currentProgram.getUniforms();for(let Xe=0;Xe<jt;Xe++)ui.setValue(N,"_gl_DrawID",Xe),oe.render(zt[Xe]/We,he[Xe])}else if(H.isInstancedMesh)oe.renderInstances(Kt,pe,H.count);else if(Z.isInstancedBufferGeometry){const zt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,he=Math.min(Z.instanceCount,zt);oe.renderInstances(Kt,pe,he)}else oe.render(Kt,pe)};function ae(P,G,Z){P.transparent===!0&&P.side===2&&P.forceSinglePass===!1?(P.side=1,P.needsUpdate=!0,Fs(P,G,Z),P.side=0,P.needsUpdate=!0,Fs(P,G,Z),P.side=2):Fs(P,G,Z)}this.compile=function(P,G,Z=null){Z===null&&(Z=P),p=Ut.get(Z),p.init(G),m.push(p),Z.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),P!==Z&&P.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const q=new Set;return P.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const ht=H.material;if(ht)if(Array.isArray(ht))for(let St=0;St<ht.length;St++){const Ct=ht[St];ae(Ct,Z,H),q.add(Ct)}else ae(ht,Z,H),q.add(ht)}),p=m.pop(),q},this.compileAsync=function(P,G,Z=null){const q=this.compile(P,G,Z);return new Promise(H=>{function ht(){if(q.forEach(function(St){V.get(St).currentProgram.isReady()&&q.delete(St)}),q.size===0){H(P);return}setTimeout(ht,10)}et.get("KHR_parallel_shader_compile")!==null?ht():setTimeout(ht,10)})};let ee=null;function xn(P){ee&&ee(P)}function fn(){Yn.stop()}function Za(){Yn.start()}const Yn=new yh;Yn.setAnimationLoop(xn),typeof self<"u"&&Yn.setContext(self),this.setAnimationLoop=function(P){ee=P,ut.setAnimationLoop(P),P===null?Yn.stop():Yn.start()},ut.addEventListener("sessionstart",fn),ut.addEventListener("sessionend",Za),this.render=function(P,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(G),G=ut.getCamera()),P.isScene===!0&&P.onBeforeRender(g,P,G,E),p=Ut.get(P,m.length),p.init(G),m.push(p),Q.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),At.setFromProjectionMatrix(Q,2e3,G.reversedDepth),$=this.localClippingEnabled,Rt=pt.init(this.clippingPlanes,$),_=K.get(P,y.length),_.init(),y.push(_),ut.enabled===!0&&ut.isPresenting===!0){const ht=g.xr.getDepthSensingMesh();ht!==null&&ro(ht,G,-1/0,g.sortObjects)}ro(P,G,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort(X,J),Bt=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,Bt&&It.addToRenderList(_,P),this.info.render.frame++,Rt===!0&&pt.beginShadows();const Z=p.state.shadowsArray;Pt.render(Z,P,G),Rt===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=_.opaque,H=_.transmissive;if(p.setupLights(),G.isArrayCamera){const ht=G.cameras;if(H.length>0)for(let St=0,Ct=ht.length;St<Ct;St++){const Et=ht[St];Ya(q,H,P,Et)}Bt&&It.render(P);for(let St=0,Ct=ht.length;St<Ct;St++){const Et=ht[St];qa(_,P,Et,Et.viewport)}}else H.length>0&&Ya(q,H,P,G),Bt&&It.render(P),qa(_,P,G);E!==null&&A===0&&(st.updateMultisampleRenderTarget(E),st.updateRenderTargetMipmap(E)),P.isScene===!0&&P.onAfterRender(g,P,G),Mt.resetDefaultState(),b=-1,S=null,m.pop(),m.length>0?(p=m[m.length-1],Rt===!0&&pt.setGlobalState(g.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?_=y[y.length-1]:_=null};function ro(P,G,Z,q){if(P.visible===!1)return;if(P.layers.test(G.layers)){if(P.isGroup)Z=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(G);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||At.intersectsSprite(P)){q&&Tt.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Q);const St=W.update(P),Ct=P.material;Ct.visible&&_.push(P,St,Ct,Z,Tt.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||At.intersectsObject(P))){const St=W.update(P),Ct=P.material;if(q&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Tt.copy(P.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Tt.copy(St.boundingSphere.center)),Tt.applyMatrix4(P.matrixWorld).applyMatrix4(Q)),Array.isArray(Ct)){const Et=St.groups;for(let Vt=0,Gt=Et.length;Vt<Gt;Vt++){const Ft=Et[Vt],Kt=Ct[Ft.materialIndex];Kt&&Kt.visible&&_.push(P,St,Kt,Z,Tt.z,Ft)}}else Ct.visible&&_.push(P,St,Ct,Z,Tt.z,null)}}const ht=P.children;for(let St=0,Ct=ht.length;St<Ct;St++)ro(ht[St],G,Z,q)}function qa(P,G,Z,q){const H=P.opaque,ht=P.transmissive,St=P.transparent;p.setupLightsView(Z),Rt===!0&&pt.setGlobalState(g.clippingPlanes,Z),q&&j.viewport(w.copy(q)),H.length>0&&Ns(H,G,Z),ht.length>0&&Ns(ht,G,Z),St.length>0&&Ns(St,G,Z),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function Ya(P,G,Z,q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new ci(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));const ht=p.state.transmissionRenderTarget[q.id],St=q.viewport||w;ht.setSize(St.z*g.transmissionResolutionScale,St.w*g.transmissionResolutionScale);const Ct=g.getRenderTarget(),Et=g.getActiveCubeFace(),Vt=g.getActiveMipmapLevel();g.setRenderTarget(ht),g.getClearColor(U),F=g.getClearAlpha(),F<1&&g.setClearColor(16777215,.5),g.clear(),Bt&&It.render(Z);const Gt=g.toneMapping;g.toneMapping=0;const Ft=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),Rt===!0&&pt.setGlobalState(g.clippingPlanes,q),Ns(P,Z,q),st.updateMultisampleRenderTarget(ht),st.updateRenderTargetMipmap(ht),et.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let ie=0,pe=G.length;ie<pe;ie++){const ce=G[ie],oe=ce.object,zt=ce.geometry,he=ce.material,jt=ce.group;if(he.side===2&&oe.layers.test(q.layers)){const We=he.side;he.side=1,he.needsUpdate=!0,$a(oe,Z,q,zt,he,jt),he.side=We,he.needsUpdate=!0,Kt=!0}}Kt===!0&&(st.updateMultisampleRenderTarget(ht),st.updateRenderTargetMipmap(ht))}g.setRenderTarget(Ct,Et,Vt),g.setClearColor(U,F),Ft!==void 0&&(q.viewport=Ft),g.toneMapping=Gt}function Ns(P,G,Z){const q=G.isScene===!0?G.overrideMaterial:null;for(let H=0,ht=P.length;H<ht;H++){const St=P[H],Ct=St.object,Et=St.geometry,Vt=St.group;let Gt=St.material;Gt.allowOverride===!0&&q!==null&&(Gt=q),Ct.layers.test(Z.layers)&&$a(Ct,G,Z,Et,Gt,Vt)}}function $a(P,G,Z,q,H,ht){P.onBeforeRender(g,G,Z,q,H,ht),P.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),H.onBeforeRender(g,G,Z,q,P,ht),H.transparent===!0&&H.side===2&&H.forceSinglePass===!1?(H.side=1,H.needsUpdate=!0,g.renderBufferDirect(Z,G,q,H,P,ht),H.side=0,H.needsUpdate=!0,g.renderBufferDirect(Z,G,q,H,P,ht),H.side=2):g.renderBufferDirect(Z,G,q,H,P,ht),P.onAfterRender(g,G,Z,q,H,ht)}function Fs(P,G,Z){G.isScene!==!0&&(G=vt);const q=V.get(P),H=p.state.lights,ht=p.state.shadowsArray,St=H.state.version,Ct=Y.getParameters(P,H.state,ht,G,Z),Et=Y.getProgramCacheKey(Ct);let Vt=q.programs;q.environment=P.isMeshStandardMaterial?G.environment:null,q.fog=G.fog,q.envMap=(P.isMeshStandardMaterial?Dt:gt).get(P.envMap||q.environment),q.envMapRotation=q.environment!==null&&P.envMap===null?G.environmentRotation:P.envMapRotation,Vt===void 0&&(P.addEventListener("dispose",nt),Vt=new Map,q.programs=Vt);let Gt=Vt.get(Et);if(Gt!==void 0){if(q.currentProgram===Gt&&q.lightsStateVersion===St)return Ka(P,Ct),Gt}else Ct.uniforms=Y.getUniforms(P),P.onBeforeCompile(Ct,g),Gt=Y.acquireProgram(Ct,Et),Vt.set(Et,Gt),q.uniforms=Ct.uniforms;const Ft=q.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Ft.clippingPlanes=pt.uniform),Ka(P,Ct),q.needsLights=Lh(P),q.lightsStateVersion=St,q.needsLights&&(Ft.ambientLightColor.value=H.state.ambient,Ft.lightProbe.value=H.state.probe,Ft.directionalLights.value=H.state.directional,Ft.directionalLightShadows.value=H.state.directionalShadow,Ft.spotLights.value=H.state.spot,Ft.spotLightShadows.value=H.state.spotShadow,Ft.rectAreaLights.value=H.state.rectArea,Ft.ltc_1.value=H.state.rectAreaLTC1,Ft.ltc_2.value=H.state.rectAreaLTC2,Ft.pointLights.value=H.state.point,Ft.pointLightShadows.value=H.state.pointShadow,Ft.hemisphereLights.value=H.state.hemi,Ft.directionalShadowMap.value=H.state.directionalShadowMap,Ft.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ft.spotShadowMap.value=H.state.spotShadowMap,Ft.spotLightMatrix.value=H.state.spotLightMatrix,Ft.spotLightMap.value=H.state.spotLightMap,Ft.pointShadowMap.value=H.state.pointShadowMap,Ft.pointShadowMatrix.value=H.state.pointShadowMatrix),q.currentProgram=Gt,q.uniformsList=null,Gt}function Ja(P){if(P.uniformsList===null){const G=P.currentProgram.getUniforms();P.uniformsList=Fr.seqWithValue(G.seq,P.uniforms)}return P.uniformsList}function Ka(P,G){const Z=V.get(P);Z.outputColorSpace=G.outputColorSpace,Z.batching=G.batching,Z.batchingColor=G.batchingColor,Z.instancing=G.instancing,Z.instancingColor=G.instancingColor,Z.instancingMorph=G.instancingMorph,Z.skinning=G.skinning,Z.morphTargets=G.morphTargets,Z.morphNormals=G.morphNormals,Z.morphColors=G.morphColors,Z.morphTargetsCount=G.morphTargetsCount,Z.numClippingPlanes=G.numClippingPlanes,Z.numIntersection=G.numClipIntersection,Z.vertexAlphas=G.vertexAlphas,Z.vertexTangents=G.vertexTangents,Z.toneMapping=G.toneMapping}function Ph(P,G,Z,q,H){G.isScene!==!0&&(G=vt),st.resetTextureUnits();const ht=G.fog,St=q.isMeshStandardMaterial?G.environment:null,Ct=E===null?g.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Hi,Et=(q.isMeshStandardMaterial?Dt:gt).get(q.envMap||St),Vt=q.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Gt=!!Z.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ft=!!Z.morphAttributes.position,Kt=!!Z.morphAttributes.normal,ie=!!Z.morphAttributes.color;let pe=0;q.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(pe=g.toneMapping);const ce=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,oe=ce!==void 0?ce.length:0,zt=V.get(q),he=p.state.lights;if(Rt===!0&&($===!0||P!==S)){const Be=P===S&&q.id===b;pt.setState(q,P,Be)}let jt=!1;q.version===zt.__version?(zt.needsLights&&zt.lightsStateVersion!==he.state.version||zt.outputColorSpace!==Ct||H.isBatchedMesh&&zt.batching===!1||!H.isBatchedMesh&&zt.batching===!0||H.isBatchedMesh&&zt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&zt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&zt.instancing===!1||!H.isInstancedMesh&&zt.instancing===!0||H.isSkinnedMesh&&zt.skinning===!1||!H.isSkinnedMesh&&zt.skinning===!0||H.isInstancedMesh&&zt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&zt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&zt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&zt.instancingMorph===!1&&H.morphTexture!==null||zt.envMap!==Et||q.fog===!0&&zt.fog!==ht||zt.numClippingPlanes!==void 0&&(zt.numClippingPlanes!==pt.numPlanes||zt.numIntersection!==pt.numIntersection)||zt.vertexAlphas!==Vt||zt.vertexTangents!==Gt||zt.morphTargets!==Ft||zt.morphNormals!==Kt||zt.morphColors!==ie||zt.toneMapping!==pe||zt.morphTargetsCount!==oe)&&(jt=!0):(jt=!0,zt.__version=q.version);let We=zt.currentProgram;jt===!0&&(We=Fs(q,G,H));let ui=!1,Xe=!1,ji=!1;const ue=We.getUniforms(),Je=zt.uniforms;if(j.useProgram(We.program)&&(ui=!0,Xe=!0,ji=!0),q.id!==b&&(b=q.id,Xe=!0),ui||S!==P){j.buffers.depth.getReversed()&&P.reversedDepth!==!0&&(P._reversedDepth=!0,P.updateProjectionMatrix()),ue.setValue(N,"projectionMatrix",P.projectionMatrix),ue.setValue(N,"viewMatrix",P.matrixWorldInverse);const Ge=ue.map.cameraPosition;Ge!==void 0&&Ge.setValue(N,ft.setFromMatrixPosition(P.matrixWorld)),tt.logarithmicDepthBuffer&&ue.setValue(N,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ue.setValue(N,"isOrthographic",P.isOrthographicCamera===!0),S!==P&&(S=P,Xe=!0,ji=!0)}if(H.isSkinnedMesh){ue.setOptional(N,H,"bindMatrix"),ue.setOptional(N,H,"bindMatrixInverse");const Be=H.skeleton;Be&&(Be.boneTexture===null&&Be.computeBoneTexture(),ue.setValue(N,"boneTexture",Be.boneTexture,st))}H.isBatchedMesh&&(ue.setOptional(N,H,"batchingTexture"),ue.setValue(N,"batchingTexture",H._matricesTexture,st),ue.setOptional(N,H,"batchingIdTexture"),ue.setValue(N,"batchingIdTexture",H._indirectTexture,st),ue.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&ue.setValue(N,"batchingColorTexture",H._colorsTexture,st));const Ke=Z.morphAttributes;if((Ke.position!==void 0||Ke.normal!==void 0||Ke.color!==void 0)&&ct.update(H,Z,We),(Xe||zt.receiveShadow!==H.receiveShadow)&&(zt.receiveShadow=H.receiveShadow,ue.setValue(N,"receiveShadow",H.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Je.envMap.value=Et,Je.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&G.environment!==null&&(Je.envMapIntensity.value=G.environmentIntensity),Xe&&(ue.setValue(N,"toneMappingExposure",g.toneMappingExposure),zt.needsLights&&Ih(Je,ji),ht&&q.fog===!0&&ot.refreshFogUniforms(Je,ht),ot.refreshMaterialUniforms(Je,q,z,k,p.state.transmissionRenderTarget[P.id]),Fr.upload(N,Ja(zt),Je,st)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Fr.upload(N,Ja(zt),Je,st),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ue.setValue(N,"center",H.center),ue.setValue(N,"modelViewMatrix",H.modelViewMatrix),ue.setValue(N,"normalMatrix",H.normalMatrix),ue.setValue(N,"modelMatrix",H.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Be=q.uniformsGroups;for(let Ge=0,oo=Be.length;Ge<oo;Ge++){const $n=Be[Ge];qt.update($n,We),qt.bind($n,We)}}return We}function Ih(P,G){P.ambientLightColor.needsUpdate=G,P.lightProbe.needsUpdate=G,P.directionalLights.needsUpdate=G,P.directionalLightShadows.needsUpdate=G,P.pointLights.needsUpdate=G,P.pointLightShadows.needsUpdate=G,P.spotLights.needsUpdate=G,P.spotLightShadows.needsUpdate=G,P.rectAreaLights.needsUpdate=G,P.hemisphereLights.needsUpdate=G}function Lh(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(P,G,Z){const q=V.get(P);q.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),V.get(P.texture).__webglTexture=G,V.get(P.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Z,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,G){const Z=V.get(P);Z.__webglFramebuffer=G,Z.__useDefaultFramebuffer=G===void 0};const Dh=N.createFramebuffer();this.setRenderTarget=function(P,G=0,Z=0){E=P,T=G,A=Z;let q=!0,H=null,ht=!1,St=!1;if(P){const Et=V.get(P);if(Et.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(N.FRAMEBUFFER,null),q=!1;else if(Et.__webglFramebuffer===void 0)st.setupRenderTarget(P);else if(Et.__hasExternalTextures)st.rebindTextures(P,V.get(P.texture).__webglTexture,V.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Ft=P.depthTexture;if(Et.__boundDepthTexture!==Ft){if(Ft!==null&&V.has(Ft)&&(P.width!==Ft.image.width||P.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");st.setupDepthRenderbuffer(P)}}const Vt=P.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(St=!0);const Gt=V.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Gt[G])?H=Gt[G][Z]:H=Gt[G],ht=!0):P.samples>0&&st.useMultisampledRTT(P)===!1?H=V.get(P).__webglMultisampledFramebuffer:Array.isArray(Gt)?H=Gt[Z]:H=Gt,w.copy(P.viewport),R.copy(P.scissor),I=P.scissorTest}else w.copy(rt).multiplyScalar(z).floor(),R.copy(mt).multiplyScalar(z).floor(),I=_t;if(Z!==0&&(H=Dh),j.bindFramebuffer(N.FRAMEBUFFER,H)&&q&&j.drawBuffers(P,H),j.viewport(w),j.scissor(R),j.setScissorTest(I),ht){const Et=V.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,Et.__webglTexture,Z)}else if(St){const Et=G;for(let Vt=0;Vt<P.textures.length;Vt++){const Gt=V.get(P.textures[Vt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Vt,Gt.__webglTexture,Z,Et)}}else if(P!==null&&Z!==0){const Et=V.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Et.__webglTexture,Z)}b=-1},this.readRenderTargetPixels=function(P,G,Z,q,H,ht,St,Ct=0){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=V.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&St!==void 0&&(Et=Et[St]),Et){j.bindFramebuffer(N.FRAMEBUFFER,Et);try{const Vt=P.textures[Ct],Gt=Vt.format,Ft=Vt.type;if(!tt.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=P.width-q&&Z>=0&&Z<=P.height-H&&(P.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ct),N.readPixels(G,Z,q,H,Nt.convert(Gt),Nt.convert(Ft),ht))}finally{const Vt=E!==null?V.get(E).__webglFramebuffer:null;j.bindFramebuffer(N.FRAMEBUFFER,Vt)}}},this.readRenderTargetPixelsAsync=async function(P,G,Z,q,H,ht,St,Ct=0){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=V.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&St!==void 0&&(Et=Et[St]),Et)if(G>=0&&G<=P.width-q&&Z>=0&&Z<=P.height-H){j.bindFramebuffer(N.FRAMEBUFFER,Et);const Vt=P.textures[Ct],Gt=Vt.format,Ft=Vt.type;if(!tt.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Kt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Kt),N.bufferData(N.PIXEL_PACK_BUFFER,ht.byteLength,N.STREAM_READ),P.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ct),N.readPixels(G,Z,q,H,Nt.convert(Gt),Nt.convert(Ft),0);const ie=E!==null?V.get(E).__webglFramebuffer:null;j.bindFramebuffer(N.FRAMEBUFFER,ie);const pe=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await tu(N,pe,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Kt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ht),N.deleteBuffer(Kt),N.deleteSync(pe),ht}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,G=null,Z=0){const q=Math.pow(2,-Z),H=Math.floor(P.image.width*q),ht=Math.floor(P.image.height*q),St=G!==null?G.x:0,Ct=G!==null?G.y:0;st.setTexture2D(P,0),N.copyTexSubImage2D(N.TEXTURE_2D,Z,0,0,St,Ct,H,ht),j.unbindTexture()};const Uh=N.createFramebuffer(),Nh=N.createFramebuffer();this.copyTextureToTexture=function(P,G,Z=null,q=null,H=0,ht=null){ht===null&&(H!==0?(As("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ht=H,H=0):ht=0);let St,Ct,Et,Vt,Gt,Ft,Kt,ie,pe;const ce=P.isCompressedTexture?P.mipmaps[ht]:P.image;if(Z!==null)St=Z.max.x-Z.min.x,Ct=Z.max.y-Z.min.y,Et=Z.isBox3?Z.max.z-Z.min.z:1,Vt=Z.min.x,Gt=Z.min.y,Ft=Z.isBox3?Z.min.z:0;else{const Ke=Math.pow(2,-H);St=Math.floor(ce.width*Ke),Ct=Math.floor(ce.height*Ke),P.isDataArrayTexture?Et=ce.depth:P.isData3DTexture?Et=Math.floor(ce.depth*Ke):Et=1,Vt=0,Gt=0,Ft=0}q!==null?(Kt=q.x,ie=q.y,pe=q.z):(Kt=0,ie=0,pe=0);const oe=Nt.convert(G.format),zt=Nt.convert(G.type);let he;G.isData3DTexture?(st.setTexture3D(G,0),he=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(st.setTexture2DArray(G,0),he=N.TEXTURE_2D_ARRAY):(st.setTexture2D(G,0),he=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);const jt=N.getParameter(N.UNPACK_ROW_LENGTH),We=N.getParameter(N.UNPACK_IMAGE_HEIGHT),ui=N.getParameter(N.UNPACK_SKIP_PIXELS),Xe=N.getParameter(N.UNPACK_SKIP_ROWS),ji=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ce.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ce.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Vt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Gt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ft);const ue=P.isDataArrayTexture||P.isData3DTexture,Je=G.isDataArrayTexture||G.isData3DTexture;if(P.isDepthTexture){const Ke=V.get(P),Be=V.get(G),Ge=V.get(Ke.__renderTarget),oo=V.get(Be.__renderTarget);j.bindFramebuffer(N.READ_FRAMEBUFFER,Ge.__webglFramebuffer),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,oo.__webglFramebuffer);for(let $n=0;$n<Et;$n++)ue&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,V.get(P).__webglTexture,H,Ft+$n),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,V.get(G).__webglTexture,ht,pe+$n)),N.blitFramebuffer(Vt,Gt,St,Ct,Kt,ie,St,Ct,N.DEPTH_BUFFER_BIT,N.NEAREST);j.bindFramebuffer(N.READ_FRAMEBUFFER,null),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||P.isRenderTargetTexture||V.has(P)){const Ke=V.get(P),Be=V.get(G);j.bindFramebuffer(N.READ_FRAMEBUFFER,Uh),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,Nh);for(let Ge=0;Ge<Et;Ge++)ue?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ke.__webglTexture,H,Ft+Ge):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ke.__webglTexture,H),Je?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Be.__webglTexture,ht,pe+Ge):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Be.__webglTexture,ht),H!==0?N.blitFramebuffer(Vt,Gt,St,Ct,Kt,ie,St,Ct,N.COLOR_BUFFER_BIT,N.NEAREST):Je?N.copyTexSubImage3D(he,ht,Kt,ie,pe+Ge,Vt,Gt,St,Ct):N.copyTexSubImage2D(he,ht,Kt,ie,Vt,Gt,St,Ct);j.bindFramebuffer(N.READ_FRAMEBUFFER,null),j.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Je?P.isDataTexture||P.isData3DTexture?N.texSubImage3D(he,ht,Kt,ie,pe,St,Ct,Et,oe,zt,ce.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(he,ht,Kt,ie,pe,St,Ct,Et,oe,ce.data):N.texSubImage3D(he,ht,Kt,ie,pe,St,Ct,Et,oe,zt,ce):P.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ht,Kt,ie,St,Ct,oe,zt,ce.data):P.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ht,Kt,ie,ce.width,ce.height,oe,ce.data):N.texSubImage2D(N.TEXTURE_2D,ht,Kt,ie,St,Ct,oe,zt,ce);N.pixelStorei(N.UNPACK_ROW_LENGTH,jt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,We),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ui),N.pixelStorei(N.UNPACK_SKIP_ROWS,Xe),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ji),ht===0&&G.generateMipmaps&&N.generateMipmap(he),j.unbindTexture()},this.initRenderTarget=function(P){V.get(P).__webglFramebuffer===void 0&&st.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?st.setTextureCube(P,0):P.isData3DTexture?st.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?st.setTexture2DArray(P,0):st.setTexture2D(P,0),j.unbindTexture()},this.resetState=function(){T=0,A=0,E=null,j.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}const Th=0,R0=1,C0=2,gl=2,qo=1.25,xl=1,Fe=32,Se=Fe/4,Eh=65535,zr=Math.pow(2,-24),Oa=Symbol("SKIP_GENERATION"),Ah={strategy:Th,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[Oa]:!1};function me(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function fa(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){const s=i[n+3]-i[n];s>e&&(e=s,t=n)}return t}function _l(i,t){t.set(i)}function yl(i,t,e){let n,s;for(let r=0;r<3;r++){const o=r+3;n=i[r],s=t[r],e[r]=n<s?n:s,n=i[o],s=t[o],e[o]=n>s?n:s}}function _r(i,t,e){for(let n=0;n<3;n++){const s=t[i+2*n],r=t[i+2*n+1],o=s-r,a=s+r;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function as(i){const t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function _e(i,t){return t[i+15]===Eh}function Pe(i,t){return t[i+6]}function ze(i,t){return t[i+14]}function be(i){return i+Se}function Te(i,t){const e=t[i+6];return i+e*Se}function Va(i,t){return t[i+7]}function Yo(i,t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0,u=1/0,f=1/0,d=1/0,x=-1/0,v=-1/0,_=-1/0;const p=i.offset||0;for(let y=(t-p)*6,m=(t+e-p)*6;y<m;y+=6){const g=i[y+0],M=i[y+1],T=g-M,A=g+M;T<r&&(r=T),A>c&&(c=A),g<u&&(u=g),g>x&&(x=g);const E=i[y+2],b=i[y+3],S=E-b,w=E+b;S<o&&(o=S),w>l&&(l=w),E<f&&(f=E),E>v&&(v=E);const R=i[y+4],I=i[y+5],U=R-I,F=R+I;U<a&&(a=U),F>h&&(h=F),R<d&&(d=R),R>_&&(_=R)}n[0]=r,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=h,s[0]=u,s[1]=f,s[2]=d,s[3]=x,s[4]=v,s[5]=_}const Tn=32,P0=(i,t)=>i.candidate-t.candidate,Vn=new Array(Tn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),yr=new Float32Array(6);function I0(i,t,e,n,s,r){let o=-1,a=0;if(r===Th)o=fa(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(r===R0)o=fa(i),o!==-1&&(a=L0(e,n,s,o));else if(r===C0){const c=as(i);let l=qo*s;const h=e.offset||0,u=(n-h)*6,f=(n+s-h)*6;for(let d=0;d<3;d++){const x=t[d],p=(t[d+3]-x)/Tn;if(s<Tn/4){const y=[...Vn];y.length=s;let m=0;for(let M=u;M<f;M+=6,m++){const T=y[m];T.candidate=e[M+2*d],T.count=0;const{bounds:A,leftCacheBounds:E,rightCacheBounds:b}=T;for(let S=0;S<3;S++)b[S]=1/0,b[S+3]=-1/0,E[S]=1/0,E[S+3]=-1/0,A[S]=1/0,A[S+3]=-1/0;_r(M,e,A)}y.sort(P0);let g=s;for(let M=0;M<g;M++){const T=y[M];for(;M+1<g&&y[M+1].candidate===T.candidate;)y.splice(M+1,1),g--}for(let M=u;M<f;M+=6){const T=e[M+2*d];for(let A=0;A<g;A++){const E=y[A];T>=E.candidate?_r(M,e,E.rightCacheBounds):(_r(M,e,E.leftCacheBounds),E.count++)}}for(let M=0;M<g;M++){const T=y[M],A=T.count,E=s-T.count,b=T.leftCacheBounds,S=T.rightCacheBounds;let w=0;A!==0&&(w=as(b)/c);let R=0;E!==0&&(R=as(S)/c);const I=xl+qo*(w*A+R*E);I<l&&(o=d,l=I,a=T.candidate)}}else{for(let g=0;g<Tn;g++){const M=Vn[g];M.count=0,M.candidate=x+p+g*p;const T=M.bounds;for(let A=0;A<3;A++)T[A]=1/0,T[A+3]=-1/0}for(let g=u;g<f;g+=6){let A=~~((e[g+2*d]-x)/p);A>=Tn&&(A=Tn-1);const E=Vn[A];E.count++,_r(g,e,E.bounds)}const y=Vn[Tn-1];_l(y.bounds,y.rightCacheBounds);for(let g=Tn-2;g>=0;g--){const M=Vn[g],T=Vn[g+1];yl(M.bounds,T.rightCacheBounds,M.rightCacheBounds)}let m=0;for(let g=0;g<Tn-1;g++){const M=Vn[g],T=M.count,A=M.bounds,b=Vn[g+1].rightCacheBounds;T!==0&&(m===0?_l(A,yr):yl(A,yr,yr)),m+=T;let S=0,w=0;m!==0&&(S=as(yr)/c);const R=s-m;R!==0&&(w=as(b)/c);const I=xl+qo*(S*m+w*R);I<l&&(o=d,l=I,a=M.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${r} used.`);return{axis:o,pos:a}}function L0(i,t,e,n){let s=0;const r=i.offset;for(let o=t,a=t+e;o<a;o++)s+=i[(o-r)*6+n*2];return s/e}class $o{constructor(){this.boundingData=new Float32Array(6)}}function D0(i,t,e,n,s,r){let o=n,a=n+s-1;const c=r.pos,l=r.axis*2,h=e.offset||0;for(;;){for(;o<=a&&e[(o-h)*6+l]<c;)o++;for(;o<=a&&e[(a-h)*6+l]>=c;)a--;if(o<a){for(let u=0;u<t;u++){let f=i[o*t+u];i[o*t+u]=i[a*t+u],i[a*t+u]=f}for(let u=0;u<6;u++){const f=o-h,d=a-h,x=e[f*6+u];e[f*6+u]=e[d*6+u],e[d*6+u]=x}o++,a--}else return o}}let wh,Br,da,Rh;const U0=Math.pow(2,32);function pa(i){return"count"in i?1:1+pa(i.left)+pa(i.right)}function N0(i,t,e){return wh=new Float32Array(e),Br=new Uint32Array(e),da=new Uint16Array(e),Rh=new Uint8Array(e),ma(i,t)}function ma(i,t){const e=i/4,n=i/2,s="count"in t,r=t.boundingData;for(let o=0;o<6;o++)wh[e+o]=r[o];if(s)return t.buffer?(Rh.set(new Uint8Array(t.buffer),i),i+t.buffer.byteLength):(Br[e+6]=t.offset,da[n+14]=t.count,da[n+15]=Eh,i+Fe);{const{left:o,right:a,splitAxis:c}=t,l=i+Fe;let h=ma(l,o);const u=i/Fe,d=h/Fe-u;if(d>U0)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return Br[e+6]=d,Br[e+7]=c,ma(h,a)}}function F0(i,t,e,n,s,r){const{maxDepth:o,verbose:a,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:h,onProgress:u}=s,f=i.primitiveBuffer,d=i.primitiveBufferStride,x=new Float32Array(6);let v=!1;const _=new $o;return Yo(t,e,n,_.boundingData,x),y(_,e,n,x),_;function p(m){u&&u((m-r.offset)/r.count)}function y(m,g,M,T=null,A=0){!v&&A>=o&&(v=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));const E=M>l;if(M<=c&&!E||A>=o)return p(g+M),m.offset=g,m.count=M,m;const b=I0(m.boundingData,T,t,g,M,h);let S=b.axis===-1?-1:D0(f,d,t,g,M,b);if(b.axis===-1||S===g||S===g+M){if(!E)return p(g+M),m.offset=g,m.count=M,m;b.axis=Math.max(0,fa(m.boundingData)),S=g+Math.max(1,Math.floor(M/2))}m.splitAxis=b.axis;const w=new $o,R=g,I=S-g;m.left=w,Yo(t,R,I,w.boundingData,x),y(w,R,I,x,A+1);const U=new $o,F=S,B=M-I;return m.right=U,Yo(t,F,B,U.boundingData,x),y(U,F,B,x,A+1),m}}function z0(i,t){const e=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=i.getRootRanges(t.range),s=n[0],r=n[n.length-1],o={offset:s.offset,count:r.offset+r.count-s.offset},a=new Float32Array(6*o.count);a.offset=o.offset,i.computePrimitiveBounds(o.offset,o.count,a),i._roots=n.map(c=>{const l=F0(i,a,c.offset,c.count,t,o),h=pa(l),u=new e(Fe*h);return N0(0,l,u),u})}class ka{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){const t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}}class B0{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const t=[];let e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}}const le=new B0;let Hn,Vi;const Ci=[],vr=new ka(()=>new Ie);function O0(i,t,e,n,s,r){Hn=vr.getPrimitive(),Vi=vr.getPrimitive(),Ci.push(Hn,Vi),le.setBuffer(i._roots[t]);const o=ga(0,i.geometry,e,n,s,r);le.clearBuffer(),vr.releasePrimitive(Hn),vr.releasePrimitive(Vi),Ci.pop(),Ci.pop();const a=Ci.length;return a>0&&(Vi=Ci[a-1],Hn=Ci[a-2]),o}function ga(i,t,e,n,s=null,r=0,o=0){const{float32Array:a,uint16Array:c,uint32Array:l}=le;let h=i*2;if(_e(h,c)){const f=Pe(i,l),d=ze(h,c);return me(i,a,Hn),n(f,d,!1,o,r+i/Se,Hn)}else{let S=function(R){const{uint16Array:I,uint32Array:U}=le;let F=R*2;for(;!_e(F,I);)R=be(R),F=R*2;return Pe(R,U)},w=function(R){const{uint16Array:I,uint32Array:U}=le;let F=R*2;for(;!_e(F,I);)R=Te(R,U),F=R*2;return Pe(R,U)+ze(F,I)};const f=be(i),d=Te(i,l);let x=f,v=d,_,p,y,m;if(s&&(y=Hn,m=Vi,me(x,a,y),me(v,a,m),_=s(y),p=s(m),p<_)){x=d,v=f;const R=_;_=p,p=R,y=m}y||(y=Hn,me(x,a,y));const g=_e(x*2,c),M=e(y,g,_,o+1,r+x/Se);let T;if(M===gl){const R=S(x),U=w(x)-R;T=n(R,U,!0,o+1,r+x/Se,y)}else T=M&&ga(x,t,e,n,s,r,o+1);if(T)return!0;m=Vi,me(v,a,m);const A=_e(v*2,c),E=e(m,A,p,o+1,r+v/Se);let b;if(E===gl){const R=S(v),U=w(v)-R;b=n(R,U,!0,o+1,r+v/Se,m)}else b=E&&ga(v,t,e,n,s,r,o+1);return!!b}}const Ss=new le.constructor,qr=new le.constructor,kn=new ka(()=>new Ie),Pi=new Ie,Ii=new Ie,Jo=new Ie,Ko=new Ie;let jo=!1;function V0(i,t,e,n){if(jo)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");jo=!0;const s=i._roots,r=t._roots;let o,a=0,c=0;const l=new Ht().copy(e).invert();for(let h=0,u=s.length;h<u;h++){Ss.setBuffer(s[h]),c=0;const f=kn.getPrimitive();me(0,Ss.float32Array,f),f.applyMatrix4(l);for(let d=0,x=r.length;d<x&&(qr.setBuffer(r[d]),o=an(0,0,e,l,n,a,c,0,0,f),qr.clearBuffer(),c+=r[d].byteLength/Fe,!o);d++);if(kn.releasePrimitive(f),Ss.clearBuffer(),a+=s[h].byteLength/Fe,o)break}return jo=!1,o}function an(i,t,e,n,s,r=0,o=0,a=0,c=0,l=null,h=!1){let u,f;h?(u=qr,f=Ss):(u=Ss,f=qr);const d=u.float32Array,x=u.uint32Array,v=u.uint16Array,_=f.float32Array,p=f.uint32Array,y=f.uint16Array,m=i*2,g=t*2,M=_e(m,v),T=_e(g,y);let A=!1;if(T&&M)h?A=s(Pe(t,p),ze(t*2,y),Pe(i,x),ze(i*2,v),c,o+t/Se,a,r+i/Se):A=s(Pe(i,x),ze(i*2,v),Pe(t,p),ze(t*2,y),a,r+i/Se,c,o+t/Se);else if(T){const E=kn.getPrimitive();me(t,_,E),E.applyMatrix4(e);const b=be(i),S=Te(i,x);me(b,d,Pi),me(S,d,Ii);const w=E.intersectsBox(Pi),R=E.intersectsBox(Ii);A=w&&an(t,b,n,e,s,o,r,c,a+1,E,!h)||R&&an(t,S,n,e,s,o,r,c,a+1,E,!h),kn.releasePrimitive(E)}else{const E=be(t),b=Te(t,p);me(E,_,Jo),me(b,_,Ko);const S=l.intersectsBox(Jo),w=l.intersectsBox(Ko);if(S&&w)A=an(i,E,e,n,s,r,o,a,c+1,l,h)||an(i,b,e,n,s,r,o,a,c+1,l,h);else if(S)if(M)A=an(i,E,e,n,s,r,o,a,c+1,l,h);else{const R=kn.getPrimitive();R.copy(Jo).applyMatrix4(e);const I=be(i),U=Te(i,x);me(I,d,Pi),me(U,d,Ii);const F=R.intersectsBox(Pi),B=R.intersectsBox(Ii);A=F&&an(E,I,n,e,s,o,r,c,a+1,R,!h)||B&&an(E,U,n,e,s,o,r,c,a+1,R,!h),kn.releasePrimitive(R)}else if(w)if(M)A=an(i,b,e,n,s,r,o,a,c+1,l,h);else{const R=kn.getPrimitive();R.copy(Ko).applyMatrix4(e);const I=be(i),U=Te(i,x);me(I,d,Pi),me(U,d,Ii);const F=R.intersectsBox(Pi),B=R.intersectsBox(Ii);A=F&&an(b,I,n,e,s,o,r,c,a+1,R,!h)||B&&an(b,U,n,e,s,o,r,c,a+1,R,!h),kn.releasePrimitive(R)}}return A}const Qo=new class{constructor(){let i=null,t=null,e=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(r,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=i=r._roots[o],this.uint16Array=e=new Uint16Array(i),this.uint32Array=t=new Uint32Array(i)},this.reset=()=>{this.root=null,this.buffer=i=null,this.uint16Array=e=null,this.uint32Array=t=null},this.getRangeStart=r=>{let o=r*2;for(;!_e(o,e);)r=be(r),o=r*2;return Pe(r,t)},this.getRangeEnd=r=>{let o=r*2;for(;!_e(o,e);)r=Te(r,t),o=r*2;return Pe(r,t)+ze(o,e)};const s=(r,o,a)=>{const c=o*2,l=_e(c,e);if(!r(a,l,o)&&!l){const u=be(o),f=Te(o,t);s(r,u,a+1),s(r,f,a+1)}};this.traverseBuffer=r=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{s(r,0,0)}finally{n=!1}},this.traverse=r=>{this.traverseBuffer((o,a,c)=>{if(a){const l=c*2,h=t[c+6],u=e[l+14];return r(o,a,new Float32Array(i,c*4,6),h,u)}else{const l=Va(c,t);return r(o,a,new Float32Array(i,c*4,6),l)}})}}},vl=new Ie,Li=new Float32Array(6);class k0{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(t){t={...Ah,...t},"maxLeafSize"in t&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafSize}),z0(this,t)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0;for(let u=t,f=t+e;u<f;u++){this.writePrimitiveBounds(u,Li,0);const[d,x,v,_,p,y]=Li;d<r&&(r=d),_>c&&(c=_),x<o&&(o=x),p>l&&(l=p),v<a&&(a=v),y>h&&(h=y)}return n[s+0]=r,n[s+1]=o,n[s+2]=a,n[s+3]=c,n[s+4]=l,n[s+5]=h,n}computePrimitiveBounds(t,e,n){const s=n.offset||0;for(let r=t,o=t+e;r<o;r++){this.writePrimitiveBounds(r,Li,0);const[a,c,l,h,u,f]=Li,d=(a+h)/2,x=(c+u)/2,v=(l+f)/2,_=(h-a)/2,p=(u-c)/2,y=(f-l)/2,m=(r-s)*6;n[m+0]=d,n[m+1]=_+(Math.abs(d)+_)*zr,n[m+2]=x,n[m+3]=p+(Math.abs(x)+p)*zr,n[m+4]=v,n[m+5]=y+(Math.abs(v)+y)*zr}return n}shiftPrimitiveOffsets(t){const e=this._indirectBuffer;if(e)for(let n=0,s=e.length;n<s;n++)e[n]+=t;else{const n=this._roots;for(let s=0;s<n.length;s++){const r=n[s],o=new Uint32Array(r),a=new Uint16Array(r),c=r.byteLength/Fe;for(let l=0;l<c;l++){const h=Se*l,u=2*h;_e(u,a)&&(o[h+6]+=t)}}}}traverse(t,e=0){Qo.setBVH(this,e),Qo.traverse(t),Qo.reset()}refit(){const t=this._roots;for(let e=0,n=t.length;e<n;e++){const s=t[e],r=new Uint32Array(s),o=new Uint16Array(s),a=new Float32Array(s),c=s.byteLength/Fe;for(let l=c-1;l>=0;l--){const h=l*Se,u=h*2;if(_e(u,o)){const d=Pe(h,r),x=ze(u,o);this.writePrimitiveRangeBounds(d,x,Li,0),a.set(Li,h)}else{const d=be(h),x=Te(h,r);for(let v=0;v<3;v++){const _=a[d+v],p=a[d+v+3],y=a[x+v],m=a[x+v+3];a[h+v]=_<y?_:y,a[h+v+3]=p>m?p:m}}}}}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{me(0,new Float32Array(n),vl),t.union(vl)}),t}shapecast(t){let{boundsTraverseOrder:e,intersectsBounds:n,intersectsRange:s,intersectsPrimitive:r,scratchPrimitive:o,iterate:a}=t;if(s&&r){const u=s;s=(f,d,x,v,_)=>u(f,d,x,v,_)?!0:a(f,d,this,r,x,v,o)}else s||(r?s=(u,f,d,x)=>a(u,f,this,r,d,x,o):s=(u,f,d)=>d);let c=!1,l=0;const h=this._roots;for(let u=0,f=h.length;u<f;u++){const d=h[u];if(c=O0(this,u,n,s,e,l),c)break;l+=d.byteLength/Fe}return c}bvhcast(t,e,n){let{intersectsRanges:s}=n;return V0(this,t,e,s)}}function G0(){return typeof SharedArrayBuffer<"u"}function Ga(i){return i.index?i.index.count:i.attributes.position.count}function io(i){return Ga(i)/3}function H0(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function W0(i,t){if(!i.index){const e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=H0(e,n);i.setIndex(new ve(s,1));for(let r=0;r<e;r++)s[r]=r}}function X0(i,t,e){const n=Ga(i)/e,s=t||i.drawRange,r=s.start/e,o=(s.start+s.count)/e,a=Math.max(0,r),c=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(c)}}function Z0(i,t){return i.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function Ml(i,t,e){const n=X0(i,t,e),s=Z0(i,e);if(!s.length)return[n];const r=[],o=n.offset,a=n.offset+n.count,c=Ga(i)/e,l=[];for(const f of s){const{offset:d,count:x}=f,v=d,_=isFinite(x)?x:c-d,p=d+_;v<a&&p>o&&(l.push({pos:Math.max(o,v),isStart:!0}),l.push({pos:Math.min(a,p),isStart:!1}))}l.sort((f,d)=>f.pos!==d.pos?f.pos-d.pos:f.type==="end"?-1:1);let h=0,u=null;for(const f of l){const d=f.pos;h!==0&&d!==u&&r.push({offset:u,count:d-u}),h+=f.isStart?1:-1,u=d}return r}function q0(i,t){const e=i[i.length-1],n=e.offset+e.count>2**16,s=i.reduce((l,h)=>l+h.count,0),r=n?4:2,o=t?new SharedArrayBuffer(s*r):new ArrayBuffer(s*r),a=n?new Uint32Array(o):new Uint16Array(o);let c=0;for(let l=0;l<i.length;l++){const{offset:h,count:u}=i[l];for(let f=0;f<u;f++)a[c+f]=h+f;c+=u}return a}class Y0 extends k0{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(t){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(t){}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(e.useSharedArrayBuffer&&!G0())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=t,this.resolvePrimitiveIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,e={...Ah,...e},e[Oa]||this.init(e)}init(t){const{geometry:e,primitiveStride:n}=this;if(t.indirect){const s=Ml(e,t.range,n),r=q0(s,t.useSharedArrayBuffer);this._indirectBuffer=r}else W0(e,t);super.init(t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new Ie))}getRootRanges(t){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:Ml(this.geometry,t,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}}class Dn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,s=-1/0;for(let r=0,o=t.length;r<o;r++){const c=t[r][e];n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}setFromPoints(t,e){let n=1/0,s=-1/0;for(let r=0,o=e.length;r<o;r++){const a=e[r],c=t.dot(a);n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}isSeparated(t){return this.min>t.max||t.min>this.max}}Dn.prototype.setFromBox=(function(){const i=new L;return function(e,n){const s=n.min,r=n.max;let o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){i.x=s.x*c+r.x*(1-c),i.y=s.y*l+r.y*(1-l),i.z=s.z*h+r.z*(1-h);const u=e.dot(i);o=Math.min(u,o),a=Math.max(u,a)}this.min=o,this.max=a}})();const $0=(function(){const i=new L,t=new L,e=new L;return function(s,r,o){const a=s.start,c=i,l=r.start,h=t;e.subVectors(a,l),i.subVectors(s.end,s.start),t.subVectors(r.end,r.start);const u=e.dot(h),f=h.dot(c),d=h.dot(h),x=e.dot(c),_=c.dot(c)*d-f*f;let p,y;_!==0?p=(u*f-x*d)/_:p=0,y=(u+p*f)/d,o.x=p,o.y=y}})(),Ha=(function(){const i=new at,t=new L,e=new L;return function(s,r,o,a){$0(s,r,i);let c=i.x,l=i.y;if(c>=0&&c<=1&&l>=0&&l<=1){s.at(c,o),r.at(l,a);return}else if(c>=0&&c<=1){l<0?r.at(0,a):r.at(1,a),s.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?s.at(0,o):s.at(1,o),r.closestPointToPoint(o,!0,a);return}else{let h;c<0?h=s.start:h=s.end;let u;l<0?u=r.start:u=r.end;const f=t,d=e;if(s.closestPointToPoint(u,!0,t),r.closestPointToPoint(h,!0,e),f.distanceToSquared(u)<=d.distanceToSquared(h)){o.copy(f),a.copy(u);return}else{o.copy(h),a.copy(d);return}}}})(),J0=(function(){const i=new L,t=new L,e=new En,n=new Ln;return function(r,o){const{radius:a,center:c}=r,{a:l,b:h,c:u}=o;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a||(n.start=l,n.end=u,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a)||(n.start=h,n.end=u,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a))return!0;const v=o.getPlane(e);if(Math.abs(v.distanceToPoint(c))<=a){const p=v.projectPoint(c,t);if(o.containsPoint(p))return!0}return!1}})(),K0=["x","y","z"],An=1e-15,Sl=An*An;function Qe(i){return Math.abs(i)<An}class hn extends Re{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new L),this.satBounds=new Array(4).fill().map(()=>new Dn),this.points=[this.a,this.b,this.c],this.plane=new En,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new Ln,this.needsUpdate=!0}intersectsSphere(t){return J0(t,this)}update(){const t=this.a,e=this.b,n=this.c,s=this.points,r=this.satAxes,o=this.satBounds,a=r[0],c=o[0];this.getNormal(a),c.setFromPoints(a,s);const l=r[1],h=o[1];l.subVectors(t,e),h.setFromPoints(l,s);const u=r[2],f=o[2];u.subVectors(e,n),f.setFromPoints(u,s);const d=r[3],x=o[3];d.subVectors(n,t),x.setFromPoints(d,s);const v=l.length(),_=u.length(),p=d.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,v<An?_<An||p<An?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(n)):_<An?p<An?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(t)):p<An&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(e)),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}}hn.prototype.closestPointToSegment=(function(){const i=new L,t=new L,e=new Ln;return function(s,r=null,o=null){const{start:a,end:c}=s,l=this.points;let h,u=1/0;for(let f=0;f<3;f++){const d=(f+1)%3;e.start.copy(l[f]),e.end.copy(l[d]),Ha(e,s,i,t),h=i.distanceToSquared(t),h<u&&(u=h,r&&r.copy(i),o&&o.copy(t))}return this.closestPointToPoint(a,i),h=a.distanceToSquared(i),h<u&&(u=h,r&&r.copy(i),o&&o.copy(a)),this.closestPointToPoint(c,i),h=c.distanceToSquared(i),h<u&&(u=h,r&&r.copy(i),o&&o.copy(c)),Math.sqrt(u)}})();hn.prototype.intersectsTriangle=(function(){const i=new hn,t=new Dn,e=new Dn,n=new L,s=new L,r=new L,o=new L,a=new Ln,c=new Ln,l=new L,h=new at,u=new at;function f(m,g,M,T){const A=n;!m.isDegenerateIntoPoint&&!m.isDegenerateIntoSegment?A.copy(m.plane.normal):A.copy(g.plane.normal);const E=m.satBounds,b=m.satAxes;for(let R=1;R<4;R++){const I=E[R],U=b[R];if(t.setFromPoints(U,g.points),I.isSeparated(t)||(o.copy(A).cross(U),t.setFromPoints(o,m.points),e.setFromPoints(o,g.points),t.isSeparated(e)))return!1}const S=g.satBounds,w=g.satAxes;for(let R=1;R<4;R++){const I=S[R],U=w[R];if(t.setFromPoints(U,m.points),I.isSeparated(t)||(o.crossVectors(A,U),t.setFromPoints(o,m.points),e.setFromPoints(o,g.points),t.isSeparated(e)))return!1}return M&&(T||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),M.start.set(0,0,0),M.end.set(0,0,0)),!0}function d(m,g,M,T,A,E,b,S,w,R,I){let U=b/(b-S);R.x=T+(A-T)*U,I.start.subVectors(g,m).multiplyScalar(U).add(m),U=b/(b-w),R.y=T+(E-T)*U,I.end.subVectors(M,m).multiplyScalar(U).add(m)}function x(m,g,M,T,A,E,b,S,w,R,I){if(A>0)d(m.c,m.a,m.b,T,g,M,w,b,S,R,I);else if(E>0)d(m.b,m.a,m.c,M,g,T,S,b,w,R,I);else if(S*w>0||b!=0)d(m.a,m.b,m.c,g,M,T,b,S,w,R,I);else if(S!=0)d(m.b,m.a,m.c,M,g,T,S,b,w,R,I);else if(w!=0)d(m.c,m.a,m.b,T,g,M,w,b,S,R,I);else return!0;return!1}function v(m,g,M,T){const A=g.degenerateSegment,E=m.plane.distanceToPoint(A.start),b=m.plane.distanceToPoint(A.end);return Qe(E)?Qe(b)?f(m,g,M,T):(M&&(M.start.copy(A.start),M.end.copy(A.start)),m.containsPoint(A.start)):Qe(b)?(M&&(M.start.copy(A.end),M.end.copy(A.end)),m.containsPoint(A.end)):m.plane.intersectLine(A,n)!=null?(M&&(M.start.copy(n),M.end.copy(n)),m.containsPoint(n)):!1}function _(m,g,M){const T=g.a;return Qe(m.plane.distanceToPoint(T))&&m.containsPoint(T)?(M&&(M.start.copy(T),M.end.copy(T)),!0):!1}function p(m,g,M){const T=m.degenerateSegment,A=g.a;return T.closestPointToPoint(A,!0,n),A.distanceToSquared(n)<Sl?(M&&(M.start.copy(A),M.end.copy(A)),!0):!1}function y(m,g,M,T){if(m.isDegenerateIntoSegment)if(g.isDegenerateIntoSegment){const A=m.degenerateSegment,E=g.degenerateSegment,b=s,S=r;A.delta(b),E.delta(S);const w=n.subVectors(E.start,A.start),R=b.x*S.y-b.y*S.x;if(Qe(R))return!1;const I=(w.x*S.y-w.y*S.x)/R,U=-(b.x*w.y-b.y*w.x)/R;if(I<0||I>1||U<0||U>1)return!1;const F=A.start.z+b.z*I,B=E.start.z+S.z*U;return Qe(F-B)?(M&&(M.start.copy(A.start).addScaledVector(b,I),M.end.copy(A.start).addScaledVector(b,I)),!0):!1}else return g.isDegenerateIntoPoint?p(m,g,M):v(g,m,M,T);else{if(m.isDegenerateIntoPoint)return g.isDegenerateIntoPoint?g.a.distanceToSquared(m.a)<Sl?(M&&(M.start.copy(m.a),M.end.copy(m.a)),!0):!1:g.isDegenerateIntoSegment?p(g,m,M):_(g,m,M);if(g.isDegenerateIntoPoint)return _(m,g,M);if(g.isDegenerateIntoSegment)return v(m,g,M,T)}}return function(g,M=null,T=!1){this.needsUpdate&&this.update(),g.isExtendedTriangle?g.needsUpdate&&g.update():(i.copy(g),i.update(),g=i);const A=y(this,g,M,T);if(A!==void 0)return A;const E=this.plane,b=g.plane;let S=b.distanceToPoint(this.a),w=b.distanceToPoint(this.b),R=b.distanceToPoint(this.c);Qe(S)&&(S=0),Qe(w)&&(w=0),Qe(R)&&(R=0);const I=S*w,U=S*R;if(I>0&&U>0)return!1;let F=E.distanceToPoint(g.a),B=E.distanceToPoint(g.b),k=E.distanceToPoint(g.c);Qe(F)&&(F=0),Qe(B)&&(B=0),Qe(k)&&(k=0);const z=F*B,X=F*k;if(z>0&&X>0)return!1;s.copy(E.normal),r.copy(b.normal);const J=s.cross(r);let rt=0,mt=Math.abs(J.x);const _t=Math.abs(J.y);_t>mt&&(mt=_t,rt=1),Math.abs(J.z)>mt&&(rt=2);const Rt=K0[rt],$=this.a[Rt],Q=this.b[Rt],ft=this.c[Rt],Tt=g.a[Rt],vt=g.b[Rt],Bt=g.c[Rt];if(x(this,$,Q,ft,I,U,S,w,R,h,a))return f(this,g,M,T);if(x(g,Tt,vt,Bt,z,X,F,B,k,u,c))return f(this,g,M,T);if(h.y<h.x){const Ot=h.y;h.y=h.x,h.x=Ot,l.copy(a.start),a.start.copy(a.end),a.end.copy(l)}if(u.y<u.x){const Ot=u.y;u.y=u.x,u.x=Ot,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return h.y<u.x||u.y<h.x?!1:(M&&(u.x>h.x?M.start.copy(c.start):M.start.copy(a.start),u.y<h.y?M.end.copy(c.end):M.end.copy(a.end)),!0)}})();hn.prototype.distanceToPoint=(function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();hn.prototype.distanceToTriangle=(function(){const i=new L,t=new L,e=["a","b","c"],n=new Ln,s=new Ln;return function(o,a=null,c=null){const l=a||c?n:null;if(this.intersectsTriangle(o,l,!0))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let h=1/0;for(let u=0;u<3;u++){let f;const d=e[u],x=o[d];this.closestPointToPoint(x,i),f=x.distanceToSquared(i),f<h&&(h=f,a&&a.copy(i),c&&c.copy(x));const v=this[d];o.closestPointToPoint(v,i),f=v.distanceToSquared(i),f<h&&(h=f,a&&a.copy(v),c&&c.copy(i))}for(let u=0;u<3;u++){const f=e[u],d=e[(u+1)%3];n.set(this[f],this[d]);for(let x=0;x<3;x++){const v=e[x],_=e[(x+1)%3];s.set(o[v],o[_]),Ha(n,s,i,t);const p=i.distanceToSquared(t);p<h&&(h=p,a&&a.copy(i),c&&c.copy(t))}}return Math.sqrt(h)}})();class ke{constructor(t,e,n){this.isOrientedBox=!0,this.min=new L,this.max=new L,this.matrix=new Ht,this.invMatrix=new Ht,this.points=new Array(8).fill().map(()=>new L),this.satAxes=new Array(3).fill().map(()=>new L),this.satBounds=new Array(3).fill().map(()=>new Dn),this.alignedSatBounds=new Array(3).fill().map(()=>new Dn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}}ke.prototype.update=(function(){return function(){const t=this.matrix,e=this.min,n=this.max,s=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let u=0;u<=1;u++){const f=1*l|2*h|4*u,d=s[f];d.x=l?n.x:e.x,d.y=h?n.y:e.y,d.z=u?n.z:e.z,d.applyMatrix4(t)}const r=this.satBounds,o=this.satAxes,a=s[0];for(let l=0;l<3;l++){const h=o[l],u=r[l],f=1<<l,d=s[f];h.subVectors(a,d),u.setFromPoints(h,s)}const c=this.alignedSatBounds;c[0].setFromPointsField(s,"x"),c[1].setFromPointsField(s,"y"),c[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();ke.prototype.intersectsBox=(function(){const i=new Dn;return function(e){this.needsUpdate&&this.update();const n=e.min,s=e.max,r=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(i.min=n.x,i.max=s.x,a[0].isSeparated(i)||(i.min=n.y,i.max=s.y,a[1].isSeparated(i))||(i.min=n.z,i.max=s.z,a[2].isSeparated(i)))return!1;for(let c=0;c<3;c++){const l=o[c],h=r[c];if(i.setFromBox(l,e),h.isSeparated(i))return!1}return!0}})();ke.prototype.intersectsTriangle=(function(){const i=new hn,t=new Array(3),e=new Dn,n=new Dn,s=new L;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(i.copy(o),i.update(),o=i);const a=this.satBounds,c=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let f=0;f<3;f++){const d=a[f],x=c[f];if(e.setFromPoints(x,t),d.isSeparated(e))return!1}const l=o.satBounds,h=o.satAxes,u=this.points;for(let f=0;f<3;f++){const d=l[f],x=h[f];if(e.setFromPoints(x,u),d.isSeparated(e))return!1}for(let f=0;f<3;f++){const d=c[f];for(let x=0;x<4;x++){const v=h[x];if(s.crossVectors(d,v),e.setFromPoints(s,t),n.setFromPoints(s,u),e.isSeparated(n))return!1}}return!0}})();ke.prototype.closestPointToPoint=(function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}})();ke.prototype.distanceToPoint=(function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();ke.prototype.distanceToBox=(function(){const i=["x","y","z"],t=new Array(12).fill().map(()=>new Ln),e=new Array(12).fill().map(()=>new Ln),n=new L,s=new L;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(s),this.closestPointToPoint(s,n),o.closestPointToPoint(n,s),c&&c.copy(n),l&&l.copy(s)),0;const h=a*a,u=o.min,f=o.max,d=this.points;let x=1/0;for(let _=0;_<8;_++){const p=d[_];s.copy(p).clamp(u,f);const y=p.distanceToSquared(s);if(y<x&&(x=y,c&&c.copy(p),l&&l.copy(s),y<h))return Math.sqrt(y)}let v=0;for(let _=0;_<3;_++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){const m=(_+1)%3,g=(_+2)%3,M=p<<m|y<<g,T=1<<_|p<<m|y<<g,A=d[M],E=d[T];t[v].set(A,E);const S=i[_],w=i[m],R=i[g],I=e[v],U=I.start,F=I.end;U[S]=u[S],U[w]=p?u[w]:f[w],U[R]=y?u[R]:f[w],F[S]=f[S],F[w]=p?u[w]:f[w],F[R]=y?u[R]:f[w],v++}for(let _=0;_<=1;_++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){s.x=_?f.x:u.x,s.y=p?f.y:u.y,s.z=y?f.z:u.z,this.closestPointToPoint(s,n);const m=s.distanceToSquared(n);if(m<x&&(x=m,c&&c.copy(n),l&&l.copy(s),m<h))return Math.sqrt(m)}for(let _=0;_<12;_++){const p=t[_];for(let y=0;y<12;y++){const m=e[y];Ha(p,m,n,s);const g=n.distanceToSquared(s);if(g<x&&(x=g,c&&c.copy(n),l&&l.copy(s),g<h))return Math.sqrt(g)}}return Math.sqrt(x)}})();class j0 extends ka{constructor(){super(()=>new hn)}}const en=new j0,cs=new L,ta=new L;function Q0(i,t,e={},n=0,s=1/0){const r=n*n,o=s*s;let a=1/0,c=null;if(i.shapecast({boundsTraverseOrder:h=>(cs.copy(t).clamp(h.min,h.max),cs.distanceToSquared(t)),intersectsBounds:(h,u,f)=>f<a&&f<o,intersectsTriangle:(h,u)=>{h.closestPointToPoint(t,cs);const f=t.distanceToSquared(cs);return f<a&&(ta.copy(cs),a=f,c=u),f<r}}),a===1/0)return null;const l=Math.sqrt(a);return e.point?e.point.copy(ta):e.point=ta.clone(),e.distance=l,e.faceIndex=c,e}const Mr=parseInt("180")>=169,tx=parseInt("180")<=161,ni=new L,ii=new L,si=new L,Sr=new at,br=new at,Tr=new at,bl=new L,Tl=new L,El=new L,ls=new L;function ex(i,t,e,n,s,r,o,a){let c;if(r===1?c=i.intersectTriangle(n,e,t,!0,s):c=i.intersectTriangle(t,e,n,r!==2,s),c===null)return null;const l=i.origin.distanceTo(s);return l<o||l>a?null:{distance:l,point:s.clone()}}function Al(i,t,e,n,s,r,o,a,c,l,h){ni.fromBufferAttribute(t,r),ii.fromBufferAttribute(t,o),si.fromBufferAttribute(t,a);const u=ex(i,ni,ii,si,ls,c,l,h);if(u){if(n){Sr.fromBufferAttribute(n,r),br.fromBufferAttribute(n,o),Tr.fromBufferAttribute(n,a),u.uv=new at;const d=Re.getInterpolation(ls,ni,ii,si,Sr,br,Tr,u.uv);Mr||(u.uv=d)}if(s){Sr.fromBufferAttribute(s,r),br.fromBufferAttribute(s,o),Tr.fromBufferAttribute(s,a),u.uv1=new at;const d=Re.getInterpolation(ls,ni,ii,si,Sr,br,Tr,u.uv1);Mr||(u.uv1=d),tx&&(u.uv2=u.uv1)}if(e){bl.fromBufferAttribute(e,r),Tl.fromBufferAttribute(e,o),El.fromBufferAttribute(e,a),u.normal=new L;const d=Re.getInterpolation(ls,ni,ii,si,bl,Tl,El,u.normal);u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1),Mr||(u.normal=d)}const f={a:r,b:o,c:a,normal:new L,materialIndex:0};if(Re.getNormal(ni,ii,si,f.normal),u.face=f,u.faceIndex=r,Mr){const d=new L;Re.getBarycoord(ls,ni,ii,si,d),u.barycoord=d}}return u}function wl(i){return i&&i.isMaterial?i.side:i}function so(i,t,e,n,s,r,o){const a=n*3;let c=a+0,l=a+1,h=a+2;const{index:u,groups:f}=i;i.index&&(c=u.getX(c),l=u.getX(l),h=u.getX(h));const{position:d,normal:x,uv:v,uv1:_}=i.attributes;if(Array.isArray(t)){const p=n*3;for(let y=0,m=f.length;y<m;y++){const{start:g,count:M,materialIndex:T}=f[y];if(p>=g&&p<g+M){const A=wl(t[T]),E=Al(e,d,x,v,_,c,l,h,A,r,o);if(E)if(E.faceIndex=n,E.face.materialIndex=T,s)s.push(E);else return E}}}else{const p=wl(t),y=Al(e,d,x,v,_,c,l,h,p,r,o);if(y)if(y.faceIndex=n,y.face.materialIndex=0,s)s.push(y);else return y}return null}function Me(i,t,e,n){const s=i.a,r=i.b,o=i.c;let a=t,c=t+1,l=t+2;e&&(a=e.getX(a),c=e.getX(c),l=e.getX(l)),s.x=n.getX(a),s.y=n.getY(a),s.z=n.getZ(a),r.x=n.getX(c),r.y=n.getY(c),r.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function nx(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,u=n+s;h<u;h++)so(c,t,e,h,r,o,a)}function ix(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let u=n,f=n+s;u<f;u++){let d;d=so(a,t,e,u,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function sx(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,u=t+i;h<u;h++){let f;if(f=h,Me(o,f*3,c,l),o.needsUpdate=!0,n(o,f,s,r))return!0}return!1}function rx(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),u(0,l),l+=r.byteLength;function u(f,d,x=!1){const v=f*2;if(_e(v,a)){const _=Pe(f,o),p=ze(v,a);let y=1/0,m=1/0,g=1/0,M=-1/0,T=-1/0,A=-1/0;for(let E=3*_,b=3*(_+p);E<b;E++){let S=n[E];const w=s.getX(S),R=s.getY(S),I=s.getZ(S);w<y&&(y=w),w>M&&(M=w),R<m&&(m=R),R>T&&(T=R),I<g&&(g=I),I>A&&(A=I)}return c[f+0]!==y||c[f+1]!==m||c[f+2]!==g||c[f+3]!==M||c[f+4]!==T||c[f+5]!==A?(c[f+0]=y,c[f+1]=m,c[f+2]=g,c[f+3]=M,c[f+4]=T,c[f+5]=A,!0):!1}else{const _=be(f),p=Te(f,o);let y=x,m=!1,g=!1;if(t){if(!y){const S=_/Se+d/Fe,w=p/Se+d/Fe;m=t.has(S),g=t.has(w),y=!m&&!g}}else m=!0,g=!0;const M=y||m,T=y||g;let A=!1;M&&(A=u(_,d,y));let E=!1;T&&(E=u(p,d,y));const b=A||E;if(b)for(let S=0;S<3;S++){const w=_+S,R=p+S,I=c[w],U=c[w+3],F=c[R],B=c[R+3];c[f+S]=I<F?I:F,c[f+S+3]=U>B?U:B}return b}}}function Zn(i,t,e,n,s){let r,o,a,c,l,h;const u=1/e.direction.x,f=1/e.direction.y,d=1/e.direction.z,x=e.origin.x,v=e.origin.y,_=e.origin.z;let p=t[i],y=t[i+3],m=t[i+1],g=t[i+3+1],M=t[i+2],T=t[i+3+2];return u>=0?(r=(p-x)*u,o=(y-x)*u):(r=(y-x)*u,o=(p-x)*u),f>=0?(a=(m-v)*f,c=(g-v)*f):(a=(g-v)*f,c=(m-v)*f),r>c||a>o||((a>r||isNaN(r))&&(r=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(M-_)*d,h=(T-_)*d):(l=(T-_)*d,h=(M-_)*d),r>h||l>o)?!1:((l>r||r!==r)&&(r=l),(h<o||o!==o)&&(o=h),r<=s&&o>=n)}function ox(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,u=n+s;h<u;h++){let f=l?l[h]:h;so(c,t,e,f,r,o,a)}}function ax(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let u=n,f=n+s;u<f;u++){let d;d=so(a,t,e,c?c[u]:u,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function cx(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,u=t+i;h<u;h++){let f;if(f=e.resolveTriangleIndex(h),Me(o,f*3,c,l),o.needsUpdate=!0,n(o,f,s,r))return!0}return!1}function lx(i,t,e,n,s,r,o){le.setBuffer(i._roots[t]),xa(0,i,e,n,s,r,o),le.clearBuffer()}function xa(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=le,h=i*2;if(_e(h,c)){const f=Pe(i,l),d=ze(h,c);nx(t,e,n,f,d,s,r,o)}else{const f=be(i);Zn(f,a,n,r,o)&&xa(f,t,e,n,s,r,o);const d=Te(i,l);Zn(d,a,n,r,o)&&xa(d,t,e,n,s,r,o)}}const hx=["x","y","z"];function ux(i,t,e,n,s,r){le.setBuffer(i._roots[t]);const o=_a(0,i,e,n,s,r);return le.clearBuffer(),o}function _a(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=le;let l=i*2;if(_e(l,a)){const u=Pe(i,c),f=ze(l,a);return ix(t,e,n,u,f,s,r)}else{const u=Va(i,c),f=hx[u],x=n.direction[f]>=0;let v,_;x?(v=be(i),_=Te(i,c)):(v=Te(i,c),_=be(i));const y=Zn(v,o,n,s,r)?_a(v,t,e,n,s,r):null;if(y){const M=y.point[f];if(x?M<=o[_+u]:M>=o[_+u+3])return y}const g=Zn(_,o,n,s,r)?_a(_,t,e,n,s,r):null;return y&&g?y.distance<=g.distance?y:g:y||g||null}}const Er=new Ie,Di=new hn,Ui=new hn,hs=new Ht,Rl=new ke,Ar=new ke;function fx(i,t,e,n){le.setBuffer(i._roots[t]);const s=ya(0,i,e,n);return le.clearBuffer(),s}function ya(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=le;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),Rl.set(e.boundingBox.min,e.boundingBox.max,n),s=Rl),_e(c,o)){const h=t.geometry,u=h.index,f=h.attributes.position,d=e.index,x=e.attributes.position,v=Pe(i,a),_=ze(c,o);if(hs.copy(n).invert(),e.boundsTree)return me(i,r,Ar),Ar.matrix.copy(hs),Ar.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:y=>Ar.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(n),y.b.applyMatrix4(n),y.c.applyMatrix4(n),y.needsUpdate=!0;for(let m=v*3,g=(_+v)*3;m<g;m+=3)if(Me(Ui,m,u,f),Ui.needsUpdate=!0,y.intersectsTriangle(Ui))return!0;return!1}});{const p=io(e);for(let y=v*3,m=(_+v)*3;y<m;y+=3){Me(Di,y,u,f),Di.a.applyMatrix4(hs),Di.b.applyMatrix4(hs),Di.c.applyMatrix4(hs),Di.needsUpdate=!0;for(let g=0,M=p*3;g<M;g+=3)if(Me(Ui,g,d,x),Ui.needsUpdate=!0,Di.intersectsTriangle(Ui))return!0}}}else{const h=be(i),u=Te(i,a);return me(h,r,Er),!!(s.intersectsBox(Er)&&ya(h,t,e,n,s)||(me(u,r,Er),s.intersectsBox(Er)&&ya(u,t,e,n,s)))}}const wr=new Ht,ea=new ke,us=new ke,dx=new L,px=new L,mx=new L,gx=new L;function xx(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),ea.set(t.boundingBox.min,t.boundingBox.max,e),ea.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,u=t.index,f=en.getPrimitive(),d=en.getPrimitive();let x=dx,v=px,_=null,p=null;s&&(_=mx,p=gx);let y=1/0,m=null,g=null;return wr.copy(e).invert(),us.matrix.copy(wr),i.shapecast({boundsTraverseOrder:M=>ea.distanceToBox(M),intersectsBounds:(M,T,A)=>A<y&&A<o?(T&&(us.min.copy(M.min),us.max.copy(M.max),us.needsUpdate=!0),!0):!1,intersectsRange:(M,T)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:E=>us.distanceToBox(E),intersectsBounds:(E,b,S)=>S<y&&S<o,intersectsRange:(E,b)=>{for(let S=E,w=E+b;S<w;S++){Me(d,3*S,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let R=M,I=M+T;R<I;R++){Me(f,3*R,l,c),f.needsUpdate=!0;const U=f.distanceToTriangle(d,x,_);if(U<y&&(v.copy(x),p&&p.copy(_),y=U,m=R,g=S),U<r)return!0}}}});{const A=io(t);for(let E=0,b=A;E<b;E++){Me(d,3*E,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let S=M,w=M+T;S<w;S++){Me(f,3*S,l,c),f.needsUpdate=!0;const R=f.distanceToTriangle(d,x,_);if(R<y&&(v.copy(x),p&&p.copy(_),y=R,m=S,g=E),R<r)return!0}}}}}),en.releasePrimitive(f),en.releasePrimitive(d),y===1/0?null:(n.point?n.point.copy(v):n.point=v.clone(),n.distance=y,n.faceIndex=m,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(wr),v.applyMatrix4(wr),s.distance=v.sub(s.point).length(),s.faceIndex=g),n)}function _x(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),u(0,l),l+=r.byteLength;function u(f,d,x=!1){const v=f*2;if(_e(v,a)){const _=Pe(f,o),p=ze(v,a);let y=1/0,m=1/0,g=1/0,M=-1/0,T=-1/0,A=-1/0;for(let E=_,b=_+p;E<b;E++){const S=3*i.resolveTriangleIndex(E);for(let w=0;w<3;w++){let R=S+w;R=n?n[R]:R;const I=s.getX(R),U=s.getY(R),F=s.getZ(R);I<y&&(y=I),I>M&&(M=I),U<m&&(m=U),U>T&&(T=U),F<g&&(g=F),F>A&&(A=F)}}return c[f+0]!==y||c[f+1]!==m||c[f+2]!==g||c[f+3]!==M||c[f+4]!==T||c[f+5]!==A?(c[f+0]=y,c[f+1]=m,c[f+2]=g,c[f+3]=M,c[f+4]=T,c[f+5]=A,!0):!1}else{const _=be(f),p=Te(f,o);let y=x,m=!1,g=!1;if(t){if(!y){const S=_/Se+d/Fe,w=p/Se+d/Fe;m=t.has(S),g=t.has(w),y=!m&&!g}}else m=!0,g=!0;const M=y||m,T=y||g;let A=!1;M&&(A=u(_,d,y));let E=!1;T&&(E=u(p,d,y));const b=A||E;if(b)for(let S=0;S<3;S++){const w=_+S,R=p+S,I=c[w],U=c[w+3],F=c[R],B=c[R+3];c[f+S]=I<F?I:F,c[f+S+3]=U>B?U:B}return b}}}function yx(i,t,e,n,s,r,o){le.setBuffer(i._roots[t]),va(0,i,e,n,s,r,o),le.clearBuffer()}function va(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=le,h=i*2;if(_e(h,c)){const f=Pe(i,l),d=ze(h,c);ox(t,e,n,f,d,s,r,o)}else{const f=be(i);Zn(f,a,n,r,o)&&va(f,t,e,n,s,r,o);const d=Te(i,l);Zn(d,a,n,r,o)&&va(d,t,e,n,s,r,o)}}const vx=["x","y","z"];function Mx(i,t,e,n,s,r){le.setBuffer(i._roots[t]);const o=Ma(0,i,e,n,s,r);return le.clearBuffer(),o}function Ma(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=le;let l=i*2;if(_e(l,a)){const u=Pe(i,c),f=ze(l,a);return ax(t,e,n,u,f,s,r)}else{const u=Va(i,c),f=vx[u],x=n.direction[f]>=0;let v,_;x?(v=be(i),_=Te(i,c)):(v=Te(i,c),_=be(i));const y=Zn(v,o,n,s,r)?Ma(v,t,e,n,s,r):null;if(y){const M=y.point[f];if(x?M<=o[_+u]:M>=o[_+u+3])return y}const g=Zn(_,o,n,s,r)?Ma(_,t,e,n,s,r):null;return y&&g?y.distance<=g.distance?y:g:y||g||null}}const Rr=new Ie,Ni=new hn,Fi=new hn,fs=new Ht,Cl=new ke,Cr=new ke;function Sx(i,t,e,n){le.setBuffer(i._roots[t]);const s=Sa(0,i,e,n);return le.clearBuffer(),s}function Sa(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=le;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),Cl.set(e.boundingBox.min,e.boundingBox.max,n),s=Cl),_e(c,o)){const h=t.geometry,u=h.index,f=h.attributes.position,d=e.index,x=e.attributes.position,v=Pe(i,a),_=ze(c,o);if(fs.copy(n).invert(),e.boundsTree)return me(i,r,Cr),Cr.matrix.copy(fs),Cr.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:y=>Cr.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(n),y.b.applyMatrix4(n),y.c.applyMatrix4(n),y.needsUpdate=!0;for(let m=v,g=_+v;m<g;m++)if(Me(Fi,3*t.resolveTriangleIndex(m),u,f),Fi.needsUpdate=!0,y.intersectsTriangle(Fi))return!0;return!1}});{const p=io(e);for(let y=v,m=_+v;y<m;y++){const g=t.resolveTriangleIndex(y);Me(Ni,3*g,u,f),Ni.a.applyMatrix4(fs),Ni.b.applyMatrix4(fs),Ni.c.applyMatrix4(fs),Ni.needsUpdate=!0;for(let M=0,T=p*3;M<T;M+=3)if(Me(Fi,M,d,x),Fi.needsUpdate=!0,Ni.intersectsTriangle(Fi))return!0}}}else{const h=be(i),u=Te(i,a);return me(h,r,Rr),!!(s.intersectsBox(Rr)&&Sa(h,t,e,n,s)||(me(u,r,Rr),s.intersectsBox(Rr)&&Sa(u,t,e,n,s)))}}const Pr=new Ht,na=new ke,ds=new ke,bx=new L,Tx=new L,Ex=new L,Ax=new L;function wx(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),na.set(t.boundingBox.min,t.boundingBox.max,e),na.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,u=t.index,f=en.getPrimitive(),d=en.getPrimitive();let x=bx,v=Tx,_=null,p=null;s&&(_=Ex,p=Ax);let y=1/0,m=null,g=null;return Pr.copy(e).invert(),ds.matrix.copy(Pr),i.shapecast({boundsTraverseOrder:M=>na.distanceToBox(M),intersectsBounds:(M,T,A)=>A<y&&A<o?(T&&(ds.min.copy(M.min),ds.max.copy(M.max),ds.needsUpdate=!0),!0):!1,intersectsRange:(M,T)=>{if(t.boundsTree){const A=t.boundsTree;return A.shapecast({boundsTraverseOrder:E=>ds.distanceToBox(E),intersectsBounds:(E,b,S)=>S<y&&S<o,intersectsRange:(E,b)=>{for(let S=E,w=E+b;S<w;S++){const R=A.resolveTriangleIndex(S);Me(d,3*R,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let I=M,U=M+T;I<U;I++){const F=i.resolveTriangleIndex(I);Me(f,3*F,l,c),f.needsUpdate=!0;const B=f.distanceToTriangle(d,x,_);if(B<y&&(v.copy(x),p&&p.copy(_),y=B,m=I,g=S),B<r)return!0}}}})}else{const A=io(t);for(let E=0,b=A;E<b;E++){Me(d,3*E,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let S=M,w=M+T;S<w;S++){const R=i.resolveTriangleIndex(S);Me(f,3*R,l,c),f.needsUpdate=!0;const I=f.distanceToTriangle(d,x,_);if(I<y&&(v.copy(x),p&&p.copy(_),y=I,m=S,g=E),I<r)return!0}}}}}),en.releasePrimitive(f),en.releasePrimitive(d),y===1/0?null:(n.point?n.point.copy(v):n.point=v.clone(),n.distance=y,n.faceIndex=m,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(Pr),v.applyMatrix4(Pr),s.distance=v.sub(s.point).length(),s.faceIndex=g),n)}function Pl(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}const Ir=new ke,Lr=new hi,Il=new L,Ll=new Ht,Dl=new L,ia=["getX","getY","getZ"];class Yr extends Y0{static serialize(t,e={}){e={cloneBuffers:!0,...e};const n=t.geometry,s=t._roots,r=t._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return e.cloneBuffers?(a.roots=s.map(c=>c.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=r?r.slice():null):(a.roots=s,a.index=o?o.array:null,a.indirectBuffer=r),a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};const{index:s,roots:r,indirectBuffer:o}=t;t.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),c(r));const a=new Yr(e,{...n,[Oa]:!0});if(a._roots=r,a._indirectBuffer=o||null,n.setIndex){const l=e.getIndex();if(l===null){const h=new ve(t.index,1,!1);e.setIndex(h)}else l.array!==s&&(l.array.set(s),l.needsUpdate=!0)}return a;function c(l){for(let h=0;h<l.length;h++){const u=l[h],f=new Uint32Array(u),d=new Uint16Array(u);for(let x=0,v=u.byteLength/Fe;x<v;x++){const _=Se*x,p=2*_;_e(p,d)||(f[_+6]=f[_+6]/Se-x)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(t,e={}){e.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafTris}),super(t,e)}shiftTriangleOffsets(t){return super.shiftPrimitiveOffsets(t)}writePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,l=(r?r[t]:t)*3;let h=l+0,u=l+1,f=l+2;a&&(h=a[h],u=a[u],f=a[f]);for(let d=0;d<3;d++){const x=o[ia[d]](h),v=o[ia[d]](u),_=o[ia[d]](f);let p=x;v<p&&(p=v),_<p&&(p=_);let y=x;v>y&&(y=v),_>y&&(y=_),e[n+d]=p,e[n+d+3]=y}return e}computePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,c=o.normalized;if(t<0||e+t-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");const l=o.array,h=o.offset||0;let u=3;o.isInterleavedBufferAttribute&&(u=o.data.stride);const f=["getX","getY","getZ"],d=n.offset;for(let x=t,v=t+e;x<v;x++){const p=(r?r[x]:x)*3,y=(x-d)*6;let m=p+0,g=p+1,M=p+2;a&&(m=a[m],g=a[g],M=a[M]),c||(m=m*u+h,g=g*u+h,M=M*u+h);for(let T=0;T<3;T++){let A,E,b;c?(A=o[f[T]](m),E=o[f[T]](g),b=o[f[T]](M)):(A=l[m+T],E=l[g+T],b=l[M+T]);let S=A;E<S&&(S=E),b<S&&(S=b);let w=A;E>w&&(w=E),b>w&&(w=b);const R=(w-S)/2,I=T*2;n[y+I+0]=S+R,n[y+I+1]=R+(Math.abs(S)+R)*zr}}return n}raycastObject3D(t,e,n=[]){const{material:s}=t;if(s===void 0)return;Ll.copy(t.matrixWorld).invert(),Lr.copy(e.ray).applyMatrix4(Ll),Dl.setFromMatrixScale(t.matrixWorld),Il.copy(Lr.direction).multiply(Dl);const r=Il.length(),o=e.near/r,a=e.far/r;if(e.firstHitOnly===!0){let c=this.raycastFirst(Lr,s,o,a);c=Pl(c,t,e),c&&n.push(c)}else{const c=this.raycast(Lr,s,o,a);for(let l=0,h=c.length;l<h;l++){const u=Pl(c[l],t,e);u&&n.push(u)}}return n}refit(t=null){return(this.indirect?_x:rx)(this,t)}raycast(t,e=0,n=0,s=1/0){const r=this._roots,o=[],a=this.indirect?yx:lx;for(let c=0,l=r.length;c<l;c++)a(this,c,e,t,o,n,s);return o}raycastFirst(t,e=0,n=0,s=1/0){const r=this._roots;let o=null;const a=this.indirect?Mx:ux;for(let c=0,l=r.length;c<l;c++){const h=a(this,c,e,t,n,s);h!=null&&(o==null||h.distance<o.distance)&&(o=h)}return o}intersectsGeometry(t,e){let n=!1;const s=this._roots,r=this.indirect?Sx:fx;for(let o=0,a=s.length;o<a&&(n=r(this,o,t,e),!n);o++);return n}shapecast(t){const e=en.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsTriangle,scratchPrimitive:e,iterate:this.indirect?cx:sx});return en.releasePrimitive(e),n}bvhcast(t,e,n){let{intersectsRanges:s,intersectsTriangles:r}=n;const o=en.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?x=>{const v=this.resolveTriangleIndex(x);Me(o,v*3,a,c)}:x=>{Me(o,x*3,a,c)},h=en.getPrimitive(),u=t.geometry.index,f=t.geometry.attributes.position,d=t.indirect?x=>{const v=t.resolveTriangleIndex(x);Me(h,v*3,u,f)}:x=>{Me(h,x*3,u,f)};if(r){if(!(t instanceof Yr))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');const x=(v,_,p,y,m,g,M,T)=>{for(let A=p,E=p+y;A<E;A++){d(A),h.a.applyMatrix4(e),h.b.applyMatrix4(e),h.c.applyMatrix4(e),h.needsUpdate=!0;for(let b=v,S=v+_;b<S;b++)if(l(b),o.needsUpdate=!0,r(o,h,b,A,m,g,M,T))return!0}return!1};if(s){const v=s;s=function(_,p,y,m,g,M,T,A){return v(_,p,y,m,g,M,T,A)?!0:x(_,p,y,m,g,M,T,A)}}else s=x}return super.bvhcast(t,e,{intersectsRanges:s})}intersectsBox(t,e){return Ir.set(t.min,t.max,e),Ir.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Ir.intersectsBox(n),intersectsTriangle:n=>Ir.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},s={},r=0,o=1/0){return(this.indirect?wx:xx)(this,t,e,n,s,r,o)}closestPointToPoint(t,e={},n=0,s=1/0){return Q0(this,t,e,n,s)}}const $r=new Map,bs=new L,Rx=new L,ai=new hi,Cx={point:new L},Ul=new L(.992,.121,.032).normalize();function Ds(i){if(!i||i.type!=="editor-solid-mesh")return null;const t=$r.get(i.revision);if(t)return t;if(!i.vertices||!i.indices||!i.indices.length)return null;const e=new xe;e.setAttribute("position",new ve(i.vertices,3)),e.setIndex(new ve(i.indices,1)),e.computeBoundingBox();const n={geometry:e,bvh:new Yr(e),bounds:e.boundingBox};return $r.set(i.revision,n),n}function Z1(i){const t=$r.get(i);t&&(t.geometry.dispose(),$r.delete(i))}function Wn(i,t,e,n){const s=Ds(i);if(!s||(bs.set(t,e,n),!s.bounds.containsPoint(bs)))return!1;ai.origin.copy(bs),ai.direction.copy(Ul);const r=s.bvh.raycastFirst(ai,2);if(!r)return!1;const o=r.face.normal.dot(Ul);if(Math.abs(o)>1e-6&&r.distance>1e-5)return o>0;const a=s.bvh.raycast(ai,2).sort((h,u)=>h.distance-u.distance);let c=0,l=-1/0;for(const h of a)h.distance-l>1e-5&&(c++,l=h.distance);return c%2===1}function Or(i,t,e,n,s=1/0){const r=Ds(i);if(!r)return null;const o=r.bounds;if(t<o.min.x-s||t>o.max.x+s||e<o.min.y-s||e>o.max.y+s||n<o.min.z-s||n>o.max.z+s)return null;bs.set(t,e,n);const a=r.bvh.closestPointToPoint(bs,Cx,0,s);return a?{x:a.point.x,y:a.point.y,z:a.point.z,distance:a.distance}:null}function Us(i,t,e,n=1/0){const s=Ds(i);if(!s)return null;ai.origin.set(t.x,t.y,t.z),ai.direction.copy(Rx.set(e.x,e.y,e.z).normalize());const r=s.bvh.raycastFirst(ai,2,0,n);return r?{distance:r.distance,x:r.point.x,y:r.point.y,z:r.point.z,normal:r.face?.normal?.clone()}:null}const Ts={roof:{type:"roof",minX:-.35,maxX:.35,minZ:-2.3,maxZ:2.3,bottom:.32,top:1.35},leftWall:{type:"box",minX:-.42,maxX:.42,minY:0,maxY:1.3,minZ:-3.2,maxZ:-2.3},rightWall:{type:"box",minX:-.42,maxX:.42,minY:0,maxY:1.3,minZ:2.3,maxZ:3.2}},Px=[Ts.roof,Ts.leftWall,Ts.rightWall],sa={type:"boundary",minX:-7.45,maxX:7.45,minZ:-4.15,maxZ:4.15},ps={type:"funnel",x:-2.5,z:0,radius:1.5,bottomRadius:.62,depth:.85};function Ce(i,t,e=[]){let n=0,s=0,r=0;const o=e.find(h=>h.type==="terraces");if(o){n=o.height;for(const h of o.steps){const u=Math.max(0,Math.min(1,(i-h.x)/h.width));n-=h.drop*u,u>0&&u<1&&(s-=h.drop/h.width)}}const a=e.find(h=>h.type==="switchback");if(a){const h=a.stairs;if(t<=a.frontZ)n=a.upperHeight;else if(i>=h.minX&&i<=h.maxX&&t<h.endZ){n=a.upperHeight;for(const f of h.steps){const d=Math.max(0,Math.min(1,(t-f.z)/f.width));n-=f.drop*d,d>0&&d<1&&(r-=f.drop/f.width)}}const u=a.startTier;if(u&&i>=u.minX&&i<=u.maxX&&t>=u.minZ&&t<=u.maxZ)for(const f of u.steps){const d=Math.max(0,Math.min(1,(i-f.x)/f.width));n+=f.rise*d,d>0&&d<1&&(s+=f.rise/f.width)}}const c=e.find(h=>h.type==="depth-terraces");if(c){const h=c.descendZ??-1,u=h*t;n=u<=h*c.frontZ?c.frontHeight:u<=h*c.rearZ?c.middleHeight:0;for(const[f,d]of[[c.leftStairs,c.frontHeight],[c.rightStairs,c.middleHeight]])if(!(i<f.minX||i>f.maxX||u<h*f.startZ||u>h*f.endZ)){n=d,r=0;for(const x of f.steps){const v=ba((u-h*x.z)/x.width,0,1);n-=x.drop*v,v>0&&v<1&&(r-=h*x.drop/x.width)}break}}const l=c&&e.find(h=>h.type==="grip-ramp"&&i>=h.minX&&i<=h.maxX&&t>=h.minZ&&t<=h.maxZ);if(l)if(l.axis==="x"){const h=(l.maxHeight-l.minHeight)/(l.maxX-l.minX);n=l.minHeight+h*(i-l.minX),s=h,r=0}else{const h=(l.southHeight-l.northHeight)/(l.maxZ-l.minZ);n=l.northHeight+h*(t-l.minZ),s=0,r=h}for(const h of e){if(h.type!=="editor-stairs"||i<h.minX||i>h.maxX||t<h.minZ||t>h.maxZ)continue;const u=h.axis==="x"?h.maxX-h.minX:h.maxZ-h.minZ;let f=h.axis==="x"?(i-h.minX)/u:(t-h.minZ)/u;h.reverse&&(f=1-f);const d=h.base+h.rise*f;d>n&&(n=d,s=h.axis==="x"?(h.reverse?-1:1)*h.rise/u:0,r=h.axis==="z"?(h.reverse?-1:1)*h.rise/u:0)}for(const h of e){if(h.type!=="funnel"||h.raised)continue;const u=i-h.x,f=t-h.z,d=Math.hypot(u,f);if(d>=h.radius)continue;if(d<=h.bottomRadius)return{height:n-h.depth,dx:s,dz:r};const x=h.depth/(h.radius-h.bottomRadius);return{height:n-h.depth+(d-h.bottomRadius)*x,dx:s+x*u/d,dz:r+x*f/d}}return{height:n,dx:s,dz:r}}function Ix(i,t,e,n=.06){if(e.type!=="editor-solid-mesh")return null;const s=Us(e,{x:i.x,y:i.y+t+.06,z:i.z},{x:0,y:-1,z:0},40);return s&&s.normal?.y>.35&&Math.abs(i.y-s.y-t)<=n?s.y:null}function Bi(i,t,e=[]){let n=Ce(i.x,i.z,e).height;for(const s of e)if(!s.csgControl){if(s.type==="editor-solid-mesh"){const r=Us(s,{x:i.x,y:i.y+t+.06,z:i.z},{x:0,y:-1,z:0},40);r&&r.normal?.y>.35&&i.y>=r.y+t-.06&&(n=Math.max(n,r.y));continue}!(s.gripPlatform||s.walkableTop)||i.y<s.maxY+t-.06||i.x<s.minX+t||i.x>s.maxX-t||i.z<s.minZ+t||i.z>s.maxZ-t||(n=Math.max(n,s.maxY))}return n}const ba=(i,t,e)=>Math.max(t,Math.min(e,i));function Rn(i,t,e,n=0){const s=(c,l,h,u,f)=>{if(Math.abs(l)<1e-9)return c>h&&c<u?f:null;const d=(h-c)/l,x=(u-c)/l,v=[Math.max(f[0],Math.min(d,x)),Math.min(f[1],Math.max(d,x))];return v[0]<v[1]?v:null},r=t.x-i.x,o=t.y-i.y,a=t.z-i.z;for(const c of e)if(c.type!=="boundary"){if(c.type==="editor-solid-mesh"){const l=Ds(c)?.bounds;if(!l||Math.max(i.x,t.x)<l.min.x-n||Math.min(i.x,t.x)>l.max.x+n||Math.max(i.y,t.y)<l.min.y-n||Math.min(i.y,t.y)>l.max.y+n||Math.max(i.z,t.z)<l.min.z-n||Math.min(i.z,t.z)>l.max.z+n)continue;const h=Math.hypot(r,o,a),u=h>1e-8?Us(c,i,{x:r,y:o,z:a},h+n):null;if(u&&u.distance>1e-4||Wn(c,i.x,i.y,i.z)||Wn(c,t.x,t.y,t.z))return!0;continue}if(c.type==="terraces"||c.type==="switchback"||c.type==="depth-terraces"||c.type==="grip-ramp"||c.type==="editor-stairs"){const l=Math.max(2,Math.ceil(Math.hypot(r,o,a)/.08));for(let h=0;h<=l;h++){const u=h/l;if(i.y+o*u<Ce(i.x+r*u,i.z+a*u,e).height+n)return!0}continue}if(c.type==="funnel"){if(c.raised)continue;const l=Ce(c.x+c.radius,c.z,e).height;if(Math.min(i.y,t.y)>=l+n)continue;const h=Math.max(2,Math.ceil(Math.hypot(r,o,a)/.06));for(let u=0;u<=h;u++){const f=u/h,d=i.x+r*f,x=i.z+a*f;if(i.y+o*f<Ce(d,x,e).height+n)return!0}continue}if(c.type==="box"||c.type==="roof"){let l=[0,1];if(l=s(i.x,r,c.minX-n,c.maxX+n,l),!l||(l=s(i.y,o,(c.type==="roof"?c.bottom:c.minY)-n,(c.type==="roof"?c.top:c.maxY)+n,l),!l))continue;if(l=s(i.z,a,c.minZ-n,c.maxZ+n,l),l)return!0}else if(c.type==="cylinder"){const l=i.x-c.x,h=i.z-c.z,u=c.radius+n,f=r*r+a*a,d=2*(l*r+h*a),x=l*l+h*h-u*u;let v;if(f<1e-9){if(x>=0)continue;v=[0,1]}else{const _=d*d-4*f*x;if(_<=0)continue;const p=Math.sqrt(_),y=(-d-p)/(2*f),m=(-d+p)/(2*f);if(v=[Math.max(0,y),Math.min(1,m)],v[0]>=v[1])continue}if(s(i.y,o,(c.base??0)-n,c.height+n,v))return!0}else if(c.type==="slip")continue}return!1}function Dr(i,t,e){let n=0;const s=e.find(o=>o.type==="switchback");if(s){const o=s.stairs,a=s.frontZ,c=s.upperHeight,l=s.startTier;if(l&&i.x>=l.minX&&i.x<=l.maxX){const u=Ce(i.x,(l.minZ+l.maxZ)/2,[s]).height;i.pz>l.maxZ-t&&i.z<l.maxZ+t&&i.y+t<u-.02&&(i.z=l.maxZ+t,n++),i.pz<l.minZ+t&&i.z>l.minZ-t&&i.y+t<u-.02&&(i.z=l.minZ-t,n++)}if((i.x<o.minX||i.x>o.maxX)&&i.pz>=a-t&&i.z<a+t&&i.y+t<c-.02&&(i.z=a+t,n++),i.z>a-t&&i.z<o.endZ+t){const u=Ce((o.minX+o.maxX)/2,i.z,[s]).height;i.px>=o.maxX-t&&i.x<o.maxX+t&&i.y+t<u-.02&&(i.x=o.maxX+t,n++),i.px<=o.minX+t&&i.x>o.minX-t&&i.y+t<u-.02&&(i.x=o.minX-t,n++)}}const r=e.find(o=>o.type==="depth-terraces");if(r){const o=r.descendZ??-1,a=o*i.pz;for(const[c,l,h]of[[r.leftStairs,r.frontZ,r.frontHeight],[r.rightStairs,r.rearZ,r.middleHeight]]){const u=i.x<c.minX||i.x>c.maxX,f=o*l,d=o*i.z;if(u&&a>=f&&d<f+t&&i.y+t<h-.02&&(i.z=o*(f+t),n++),o*i.z>o*c.startZ-t&&o*i.z<o*c.endZ+t){const x=Ce((c.minX+c.maxX)/2,i.z,[r]).height;i.px>=c.maxX-t&&i.x<c.maxX+t&&i.y+t<x-.02&&(i.x=c.maxX+t,n++),i.px<=c.minX+t&&i.x>c.minX-t&&i.y+t<x-.02&&(i.x=c.minX-t,n++)}}}for(const o of e){if(o.type!=="editor-stairs")continue;const a=i.x>o.minX-t&&i.x<o.maxX+t,c=i.z>o.minZ-t&&i.z<o.maxZ+t;if(!a||!c)continue;const l=Ce(Math.max(o.minX,Math.min(o.maxX,i.x)),Math.max(o.minZ,Math.min(o.maxZ,i.z)),[o]).height;if(!(i.y+t>=l-.02))if(o.axis==="x"){i.pz<o.minZ-t&&i.z>o.minZ-t&&(i.z=o.minZ-t,n++),i.pz>o.maxZ+t&&i.z<o.maxZ+t&&(i.z=o.maxZ+t,n++);const h=o.reverse?o.minX:o.maxX;o.reverse&&i.px<h-t&&i.x>h-t&&(i.x=h-t,n++),!o.reverse&&i.px>h+t&&i.x<h+t&&(i.x=h+t,n++)}else{i.px<o.minX-t&&i.x>o.minX-t&&(i.x=o.minX-t,n++),i.px>o.maxX+t&&i.x<o.maxX+t&&(i.x=o.maxX+t,n++);const h=o.reverse?o.minZ:o.maxZ;o.reverse&&i.pz<h-t&&i.z>h-t&&(i.z=h-t,n++),!o.reverse&&i.pz>h+t&&i.z<h+t&&(i.z=h+t,n++)}}for(let o=0;o<3;o++){const a=Ce(i.x,i.z,e),c=1+a.dx*a.dx+a.dz*a.dz,l=a.height+t*Math.sqrt(c)+.008-i.y;if(l<=0)break;const h=l/c;i.x-=a.dx*h,i.z-=a.dz*h,i.y+=h,c===1&&i.vy<0&&(i.vy=0),n++}for(const o of e){if(o.type==="boundary"){const _=ba(i.x,o.minX+t,o.maxX-t),p=ba(i.z,o.minZ+t,o.maxZ-t);(_!==i.x||p!==i.z)&&(i.x=_,i.z=p,n++);continue}if(o.type==="editor-solid-mesh"){const _=Ds(o)?.bounds;if(!_||Math.max(i.x,i.px)<_.min.x-t||Math.min(i.x,i.px)>_.max.x+t||Math.max(i.y,i.py)<_.min.y-t||Math.min(i.y,i.py)>_.max.y+t||Math.max(i.z,i.pz)<_.min.z-t||Math.min(i.z,i.pz)>_.max.z+t)continue;const p=i.x-i.px,y=i.y-i.py,m=i.z-i.pz,g=Math.hypot(p,y,m),M=g>1e-6&&!Wn(o,i.px,i.py,i.pz)?Us(o,{x:i.px,y:i.py,z:i.pz},{x:p,y,z:m},g):null;if(M&&M.distance>1e-4){const E=M.normal;i.x=M.x+(E?.x??0)*(t+.003),i.y=M.y+(E?.y??1)*(t+.003),i.z=M.z+(E?.z??0)*(t+.003),E?.y>.35&&i.vy<0&&(i.vy=0),n++}else if(!M&&g>t*.5){const E=Math.min(200,Math.ceil(g/(t*.45)));for(let b=1;b<=E;b++){const S=b/E,w=i.px+p*S,R=i.py+y*S,I=i.pz+m*S,U=Or(o,w,R,I,t+.003);if(!U||U.distance>=t||Wn(o,w,R,I))continue;const F=(b-1)/E;i.x=i.px+p*F,i.y=i.py+y*F,i.z=i.pz+m*F,n++;break}}let T=Or(o,i.x,i.y,i.z,t+.01);const A=Wn(o,i.x,i.y,i.z);if(A&&!T&&(T=Or(o,i.x,i.y,i.z)),T&&(A||T.distance<t)){let E=i.x-T.x,b=i.y-T.y,S=i.z-T.z;A&&(E=-E,b=-b,S=-S);const w=Math.hypot(E,b,S)||1;E/=w,b/=w,S/=w,i.x=T.x+E*(t+.003),i.y=T.y+b*(t+.003),i.z=T.z+S*(t+.003),b>.35&&i.vy<0&&(i.vy=0),n++}continue}if(o.type==="cylinder"){const _=i.x-o.x,p=i.z-o.z,y=Math.hypot(_,p),m=o.radius+t;if(y>=m||i.y-t>=o.height||i.y+t<=(o.base??0))continue;i.py-t>=o.height-.035?(i.y=o.height+t+.003,i.vy<0&&(i.vy=0)):(i.x=o.x+(y?_/y*m:m),i.z=o.z+(y?p/y*m:0)),n++;continue}if(o.type!=="roof"&&o.type!=="box")continue;const a=o.minX-t,c=o.maxX+t,l=(o.type==="roof"?o.bottom:o.minY)-t,h=(o.type==="roof"?o.top:o.maxY)+t,u=o.minZ-t,f=o.maxZ+t;if(i.x<=a||i.x>=c||i.y<=l||i.y>=h||i.z<=u||i.z>=f)continue;const d=[["x",a,i.x-a],["x",c,c-i.x],["y",l,i.y-l],["y",h,h-i.y],["z",u,i.z-u],["z",f,f-i.z]];let x=null;i.px<=a+.02?x=d[0]:i.px>=c-.02?x=d[1]:i.py<=l+.02?x=d[2]:i.py>=h-.02?x=d[3]:i.pz<=u+.02?x=d[4]:i.pz>=f-.02&&(x=d[5]);const v=x||d.reduce((_,p)=>_[2]<p[2]?_:p);i[v[0]]=v[1],v[0]==="y"&&i.vy<0&&v[1]===h&&(i.vy=0),n++}return n}function Lx(i,t,e,n,s=0){for(const r of n)if(r.type==="editor-solid-mesh"&&Wn(r,i,t,e)&&(!s||Or(r,i,t,e)?.distance>s)||r.type==="roof"&&i>r.minX+s&&i<r.maxX-s&&e>r.minZ+s&&e<r.maxZ-s&&t>r.bottom+s&&t<r.top-s||r.type==="cylinder"&&t>(r.base??0)+s&&t<r.height-s&&Math.hypot(i-r.x,e-r.z)<r.radius-s||r.type==="box"&&i>r.minX+s&&i<r.maxX-s&&e>r.minZ+s&&e<r.maxZ-s&&t>r.minY+s&&t<r.maxY-s)return!0;return!1}const Wa=i=>i?.axis==="x"?"x":"z";function Dx(i,t,e){return Wa(i)==="x"?e.x<t.minX?"D":"A":e.z<t.minZ?"S":"W"}const Ux={type:"switchback",upperHeight:1.62,frontZ:-.6,startTier:{minX:5.35,maxX:9.4,minZ:-4.5,maxZ:-1,steps:[5.35,5.8].map(i=>({x:i,rise:.27,width:.32}))},stairs:{minX:-8.8,maxX:-6.2,endZ:2.1,steps:[-.6,-.15,.3,.75,1.2,1.65].map(i=>({z:i,drop:.27,width:.32}))}},Nx={type:"roof",minX:.1,maxX:.65,minZ:.7,maxZ:3.7,bottom:.32,top:1.06},Fx=()=>[3,4.035].flatMap(i=>Array.from({length:5},(t,e)=>({type:"cylinder",x:i,z:.03+e*1.035,radius:.42,height:.65}))),tn={id:1,name:"Gathering Garden",start:{x:7,z:-2.6},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-4.8,maxZ:4.8},terrain:Ux,roof:Nx,posts:Fx(),exit:{type:"funnel",x:7.6,z:2.8,radius:.95,bottomRadius:.36,depth:.9},pools:[[4.8,-2.6],[2.5,-2.6],[-5.5,2.2],[5.15,2.2]],gems:[{x:0,z:-2.6},{x:-3,z:2.2},{x:6,z:2.2}],gold:[[6,-2.6],[4.8,-2.6],[3.4,-2.6],[2,-2.6],[.5,-2.6],[-1.2,-2.6],[-3.5,-2.6],[-6,-2.6],[-7.5,.3],[-7.5,1.4],[-5.5,2.2],[-3.6,2.2],[-1.5,2.2],[1.1,2.2],[3.5,2.6175],[5.5,2.2],[7.1,2.2]]},Ch={id:2,name:"Weight Garden",start:{x:7.6,z:-2.8},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{type:"depth-terraces",descendZ:1,frontHeight:2.16,middleHeight:1.08,frontZ:-1.3,rearZ:2,leftStairs:{minX:-8.8,maxX:-6.2,startZ:-1.3,endZ:.1,steps:[-1.3,-.95,-.6,-.25].map(i=>({z:i,drop:.27,width:.26}))},rightStairs:{minX:6.2,maxX:8.8,startZ:2,endZ:3.4,steps:[2,2.35,2.7,3.05].map(i=>({z:i,drop:.27,width:.26}))}},basin:{type:"funnel",x:-2.5,z:.35,radius:1.15,bottomRadius:.52,depth:.75,holdsFeedstock:!0},gate:{x:1.5,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:48,releaseThreshold:36,rate:42,base:1.08},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-2.8],[2.6,-2.8],[-5.4,.35],[5.1,3.6]],gems:[{x:-1.5,z:-2.8},{x:4,z:.35},{x:-3.5,z:3.6}],gold:[[7.1,-2.8],[5.3,-2.8],[3.8,-2.8],[2.6,-2.8],[.5,-2.8],[-1.5,-2.8],[-3.7,-2.8],[-6,-2.8],[-7.5,-.95],[-7.5,-.25],[-5.4,.35],[-4.2,1.45],[.4,.35],[4,.35],[7.5,2.7],[5.1,3.6],[-3.5,3.6]]},wn={id:3,name:"Passage Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{...Ch.terrain},basin:{type:"funnel",x:-2.3,z:.45,radius:1.15,bottomRadius:.72,depth:.75,holdsFeedstock:!0},gate:{x:1.7,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:64,releaseThreshold:48,rate:42,base:1.08},passage:{type:"roof",minX:-1.15,maxX:1.15,minZ:2.05,maxZ:4.8,bottom:.3,top:1.2,approachBothSides:!0},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.1,-3.2],[2.2,-3.2],[3.1,.45],[5.2,3.55]],poolCounts:[58,58,88,28],gems:[{x:-2,z:-3.2},{x:4.3,z:.45},{x:-4.3,z:3.55}],gold:[[6.7,-3.2],[5.1,-3.2],[3.6,-3.2],[2.2,-3.2],[.1,-3.2],[-2,-3.2],[-5.5,-3.2],[-7.5,-.95],[-7.5,-.25],[-5.2,.45],[-3.7,1.55],[.5,.45],[4.3,.45],[7.5,2.7],[5.2,3.55],[0,3.55],[-4.3,3.55]]},zx={id:4,name:"Reach Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,tendrils:!0,boundary:{...wn.boundary},terrain:{...wn.terrain},channels:[[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]].map(([i,t])=>({type:"funnel",x:i,z:t,radius:.85,bottomRadius:.45,depth:.32})),castingBank:{x:.7,z:-3.65},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-3.2],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]],gems:[{x:-4.8,z:-3.5},{x:4.2,z:.45},{x:-3.8,z:3.55}],gold:[[6.7,-3.2],[5.3,-3.2],[3.6,-3.2],[.7,-3.65],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9],[-4.8,-3.5],[-6,-3.5],[-7.5,-.95],[-7.5,-.25],[-5,.45],[0,.45],[4.2,.45],[7.5,2.7],[3.5,3.55],[-3.8,3.55]]},Bx={id:5,name:"Grip Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,boundary:{...wn.boundary},terrain:{...wn.terrain,frontZ:-2.1,leftStairs:{...wn.terrain.leftStairs,startZ:wn.terrain.leftStairs.startZ-.8,endZ:wn.terrain.leftStairs.endZ-.8,steps:wn.terrain.leftStairs.steps.map(i=>({...i,z:i.z-.8}))}},grip:{ramp:{type:"grip-ramp",axis:"x",minX:-1.65,maxX:-.55,minZ:-1.35,maxZ:1.25,minHeight:1.08,maxHeight:1.44},platform:{type:"box",gripPlatform:!0,minX:-.55,maxX:1.65,minZ:-1.95,maxZ:1.85,minY:1.08,maxY:3.78},climbHeight:2.34},slip:{type:"slip",minX:3,maxX:5.4,minZ:-2.1,maxZ:2},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-3.2],[2.7,-3.2],[-4.8,.55],[5.2,3.55]],gems:[{x:-3.8,z:-3.2},{x:.55,z:-.05},{x:-3.8,z:3.55}],gold:[[6.7,-3.2],[5.3,-3.2],[3.8,-3.2],[2.7,-3.2],[-.5,-3.2],[-3.8,-3.2],[-6,-3.2],[-7.5,-.95],[-7.5,-.25],[-4.8,.55],[-1.4,-.05],[-.75,-.05],[.55,-.05],[4.2,1.15],[7.5,2.7],[5.2,3.55],[-3.8,3.55]]},Vr=[tn,Ch,wn,zx,Bx],Nl=i=>!!i&&(!!i.editorCustom||Vr.some(t=>t.id===i.id)||!!i.tendrils),q1=i=>i.filter(t=>t.feedstock&&t.patchId===void 0);function Ta(i,t,e){if(i.csgSolid){const r=Ce(t,e,Ps(i)).height,o=Us(i.csgSolid,{x:t,y:20,z:e},{x:0,y:-1,z:0},40);return Math.max(r,o&&o.normal?.y>.2?o.y:r)}const n=i.grip?.platform;let s=Ce(t,e,Ps(i)).height;n&&t>n.minX&&t<n.maxX&&e>n.minZ&&e<n.maxZ&&(s=Math.max(s,n.maxY));for(const r of i.editorFixtures||[])r.type==="box"&&r.walkableTop&&t>r.minX&&t<r.maxX&&e>r.minZ&&e<r.maxZ&&(s=Math.max(s,r.maxY));return s}function Ps(i=tn,t=0){const e=i.editorFixtures||[],n=s=>i.csgSolid?[...s.filter(r=>!r.csgManaged),i.csgSolid,...i.grip?[{...i.grip.ramp,type:"grip-ramp-control"},{...i.grip.platform,type:"grip-platform-control",csgControl:!0}]:[]]:s;if(i.id===1)return n([i.boundary,i.terrain,...i.exit?[i.exit]:[],...i.roof?[i.roof]:[],...i.roofSupports??(i.roof?[i.roof.minZ-.14,i.roof.maxZ+.14].map(s=>({type:"box",minX:0,maxX:.75,minY:0,maxY:1.06,minZ:s-.14,maxZ:s+.14})):[]),...i.posts||[],...i.channels||[],...e]);if(i.grip&&!i.gate)return n([i.boundary,i.terrain,i.grip.ramp,i.grip.platform,...i.slip?[i.slip]:[],...i.channels||[],...i.exit?[i.exit]:[],...i.roof?[i.roof]:[],...i.posts||[],...e]);if(i.tendrils&&!i.gate)return n([i.boundary,i.terrain,...i.channels||[],...i.exit?[i.exit]:[],...i.basin?[i.basin]:[],...i.roof?[i.roof]:[],...i.posts||[],...e]);if(i.gate){const s=i.gate,r=s.width/2;return n([i.boundary,i.terrain,...i.basin?[i.basin]:[],...i.exit?[i.exit]:[],{type:"roof",minX:s.x-r,maxX:s.x+r,minZ:s.minZ,maxZ:s.maxZ,bottom:s.base+t,top:s.base+t+s.height},{type:"box",minX:s.x-r,maxX:s.x+r,minY:s.base,maxY:s.base+s.height+s.opening,minZ:i.terrain.frontZ,maxZ:s.minZ},{type:"box",minX:s.x-r,maxX:s.x+r,minY:s.base,maxY:s.base+s.height+s.opening,minZ:s.maxZ,maxZ:i.terrain.rearZ},...i.passage&&!i.csgSolid?[i.passage,{type:"box",minX:i.passage.minX,maxX:i.passage.maxX,minY:0,maxY:i.passage.top,minZ:i.passage.minZ,maxZ:i.passage.minZ+.16},{type:"box",minX:i.passage.minX,maxX:i.passage.maxX,minY:0,maxY:i.passage.top,minZ:i.passage.maxZ-.16,maxZ:i.passage.maxZ}]:[],...i.channels||[],...i.posts||[],...e])}return n([i.boundary,i.terrain,...i.exit?[i.exit]:[],...i.roof?[i.roof,...[i.roof.minZ-.14,i.roof.maxZ+.14].map(s=>({type:"box",minX:0,maxX:.75,minY:0,maxY:1.06,minZ:s-.14,maxZ:s+.14}))]:[],...i.posts||[],...i.channels||[],...e])}function Ox(i=tn){return Ps(i),{phase:"title",elapsed:0,drainTime:0,moved:0,grew:!1,contracted:!1,enteredGap:!1,under:!1,levelId:i.id,arrivalTime:0,settleTime:0,gems:(i.gems||[]).map((t,e)=>({...t,id:e,y:Ta(i,t.x,t.z)+.34,radius:.31,coverage:0,progress:0,collected:!1})),gold:(i.gold||[]).map(([t,e],n)=>({x:t,z:e,id:n,y:Ta(i,t,e)+.13,collected:!1})),goldCount:0,gemCount:0,notice:"",noticeUntil:0}}function Vx(i,t=tn){const e=Ps(t);for(const n of i.particles)n.y+=Math.max(Ce(n.x,n.z,e).height,t.start.y??0),n.py=n.y;(t.pools||[]).forEach(([n,s],r)=>{for(let o=0;o<(t.poolCounts?.[r]??58);o++){const a=o*2.39996323,c=.45*Math.sqrt(o%29/28),l=i.addParticle({x:n+Math.cos(a)*c,z:s+Math.sin(a)*c,y:Ta(t,n,s)+i.radius+.015+Math.floor(o/29)*.12},{feedstock:!0});l.patchId=r}}),i.samplePairs(),i.updateComponents(e)}function kx(i){const t=[];for(let e=0;e<8;e++){const n=e*Math.PI/4;t.push({x:i.x+Math.cos(n)*.3,y:i.y-.08,z:i.z+Math.sin(n)*.3})}for(let e=0;e<4;e++){const n=e*Math.PI/2+Math.PI/4;t.push({x:i.x+Math.cos(n)*.16,y:i.y+.19,z:i.z+Math.sin(n)*.16})}return t.push({x:i.x,y:i.y+.31,z:i.z}),t}function Gx(i,t,e,n){const s=t.filter(c=>Math.hypot(c.x-i.x,c.z-i.z)<.8&&Math.abs(c.y-i.y)<.85);if(s.length<32)return 0;const r=n+.15,o=kx(i).map(c=>s.some(l=>Math.hypot(l.x-c.x,l.y-c.y,l.z-c.z)<r&&!Rn(l,c,e))),a=o.filter(Boolean).length;return o.at(-1)?a/o.length:Math.min(.8,a/o.length)}function ra(i,t){const e=i.garden,n=i.fluid,s=n.brain,r=i.activeColliders(),o=i.gardenLevel||tn;if(e.elapsed+=t,e.phase==="arriving"){e.arrivalTime+=t,e.arrivalTime>=1.1&&(e.phase="settling",e.settleTime=0);return}if(e.phase==="settling"){e.settleTime+=t,e.settleTime>=.42&&(e.phase="playing");return}if(e.phase==="draining"){e.drainTime+=t,e.drainTime>=2.8&&(e.phase="complete");return}if(e.phase!=="playing")return;e.moved=Math.max(e.moved,Math.hypot(s.x-o.start.x,s.z-o.start.z)),e.grew||=n.attachedCount>=110,e.contracted||=!!n.contractAnchor,o.roof&&(e.enteredGap||=s.x>o.roof.minX-.2&&s.x<o.roof.maxX+.2&&s.z>o.roof.minZ&&s.z<o.roof.maxZ&&s.y<o.roof.bottom,e.under||=e.enteredGap&&s.x>o.roof.maxX+.3);const a=n.particles.filter((c,l)=>l!==n.brainIndex&&!c.feedstock&&c.component===s.component);for(const c of e.gold)c.collected||a.some(l=>Math.hypot(l.x-c.x,l.y-c.y,l.z-c.z)<n.radius+.19&&!Rn(l,c,r))&&(c.collected=!0,c.collectedAt=e.elapsed,e.goldCount++);for(const c of e.gems)c.collected||(c.coverage=Gx(c,a,r,n.radius),c.progress=Math.max(0,Math.min(1,c.progress+t*(c.coverage>=12/13?1/.65:-1.3))),c.progress>=1&&(c.collected=!0,c.collectedAt=e.elapsed,e.gemCount++,e.notice="Gem absorbed",e.noticeUntil=e.elapsed+2));Math.hypot(s.x-o.exit.x,s.z-o.exit.z)<o.exit.radius*.7&&(e.phase="draining",e.drainTime=0,n.contractAnchor=null,i.tendril.release())}function Y1(i){const t=i.garden,e=i.brain,n=i.gardenLevel||tn;if(t.phase==="arriving"||t.phase==="settling")return["FLOW DOWN","The living body pours through the opening above."];if(t.phase==="draining")return["DOWN THE DRAIN","Taking the soft way down."];if(n.editorCustom)return["EXPLORE YOUR GARDEN","Move through your authored fixtures, gather flesh, and flow into the exit."];if(n.grip){const r=n.grip.platform,o=n.grip.ramp,a=n.slip;if(t.moved<.8)return["01 / GATHER YOURSELF","Flow left along the high rear lane, collecting flesh and gold before the stair turn."];if(e.z<n.terrain.frontZ)return["02 / LEFT STAIR TURN","Descend the left stairs and gather the middle green pool."];if(e.x>Math.min(r.minX,o.minX)-.3&&e.x<Math.max(r.maxX,o.maxX)+.75&&e.z>Math.min(r.minZ,o.minZ)-.3&&e.z<Math.min(n.terrain.rearZ,Math.max(r.maxZ,o.maxZ)+.3)){if(i.fluid.gripClimbing)return["GRIPPING THE WALL",`Keep pressing ${Dx(o,r,e)} toward the platform. Your connected flesh follows the ribbed face.`];if(Wa(o)==="x"){if(e.x<r.minX)return["03 / FIND THE GRIP","Flow up the sage ramp and press D against the west ribbed face."];if(e.x>r.maxX)return["03 / FIND THE GRIP","Press A against the east ribbed face. Release to slide back down."]}else{if(e.z>r.maxZ)return["03 / FIND THE GRIP","Flow up the sage ramp and press W against the south ribbed face."];if(e.z<r.minZ)return["03 / FIND THE GRIP","Press S against the north ribbed face. Release to slide back down."]}return["SURROUND THE HIGH GEM","On the platform, gather your living flesh around the violet gem."]}return e.x>=a.minX-.5&&e.x<=a.maxX+.5&&e.z>=a.minZ-.4&&e.z<=a.maxZ+.4?["04 / SMOOTH STONE","This pale turquoise strip has little grip. Slow down early or let momentum carry you over the edge."]:e.z<n.terrain.rearZ?["05 / RIGHT STAIR TURN","Cross the middle terrace toward the right stairs, then descend to the low front lane."]:["THE WAY DOWN","Follow the low return left, gather the last flesh and gem, and enter the dark funnel."]}if(n.id===4){const r=i.tendril;return r.feedback&&i.fluid.time<r.feedbackUntil?["CAST STATUS",r.feedback]:t.moved<.8?["01 / REACH THE BANK","Move left across the high rear lane. The green flesh in the shallow channels can be reached with tendrils."]:e.z<n.terrain.frontZ?r.recalling?["RECALLING FLESH",`${r.count} / 3 strands drawing loose flesh back. Tap Space to pause; hold to contract.`]:r.count?["STRANDS EXTENDED",`${r.count} / 3 strands. Click a channel or press E to cast another; tap Space to recall all.`]:["02 / REACH THE CHANNELS","Stand near the casting bank and click the loose flesh in a channel, or press E for the nearest. Tap Space to recall; hold to gather."]:e.z<n.terrain.rearZ?["03 / MIDDLE TURN","Descend the left stairs, flow right across the middle terrace, and surround the second gem."]:["04 / FRONT RETURN","Descend the right stairs, follow the low front lane left, and enter the exit funnel."]}if(n.gate){if(t.moved<.8)return["01 / HIGH REAR LANE","Flow left across the high terrace. The garden descends toward you twice before the exit."];if(!t.grew)return["02 / GATHER FLESH","Gather the green pools along the high rear lane before the left stair turn."];const r=t.gems.filter(o=>!o.collected).sort((o,a)=>Math.hypot(o.x-e.x,o.z-e.z)-Math.hypot(a.x-e.x,a.z-e.z))[0];return r&&Math.hypot(r.x-e.x,r.z-e.z)<1.6?["SURROUND THE GEM",`Hold Space to rise around the gem. Covered ${Math.round(r.coverage*100)}%.`]:e.z<n.terrain.frontZ?["03 / LEFT STAIR TURN","Continue left, then descend the four shallow steps toward the middle terrace."]:!i.pressure.active&&i.pressure.weight<n.gate.threshold?["04 / LEAVE SOME WEIGHT",`Hold F at the middle basin rim. ${i.pressure.weight} / ${n.gate.threshold} shed particles on the plate.`]:e.x<n.gate.x?["05 / CROSS RIGHT","The deposit lifts the gate. Go around the basin, then flow right beneath the opening."]:n.passage&&e.x<4.2&&e.z<n.terrain.rearZ?["06 / GROW AGAIN","Gather the green pool beyond the gate, then surround the middle gem before the right stair turn."]:e.z<n.terrain.rearZ?["06 / FRONT STAIR TURN","Continue right to the second stair corridor and descend toward the front lane."]:n.passage&&e.x>n.passage.minX-.5&&e.z>n.passage.minZ-.4?["07 / THE LOW PASSAGE","Release Space and flow left through the low stone passage. Even a full body can flatten to pass."]:["THE WAY DOWN","Follow the low front lane left for the last flesh and gem, then enter the dark funnel."]}if(t.moved<.8)return["01 / FIND YOUR FEET","Move left down two short steps from the start platform, then follow the upper gold trail."];if(t.goldCount<2)return["02 / A LITTLE GOLD","Flow left over the gold. Your living flesh collects it by touch."];if(!t.grew)return["03 / GATHER YOURSELF","Touch the green pools on the upper lane. Their flesh becomes yours."];const s=t.gems.filter(r=>!r.collected).sort((r,o)=>Math.hypot(r.x-e.x,r.z-e.z)-Math.hypot(o.x-e.x,o.z-e.z))[0];return s&&Math.hypot(s.x-e.x,s.z-e.z)<1.6?["SURROUND THE GEM",`Move over the gem, then hold Space to gather into a mound. Surround it on every side. Covered ${Math.round(s.coverage*100)}%.`]:t.gemCount?e.z<tn.terrain.frontZ?["05 / REACH THE LEFT TURN","Continue left to the broad stair corridor. The open ledge offers a shortcut down, but leaves gold and flesh behind."]:e.x<tn.terrain.stairs.maxX+.5&&e.z<tn.terrain.stairs.endZ?["06 / DOWN THE STEPS","Turn toward the front and spill down six shallow ramps to the lower lane."]:!t.under&&e.x<tn.roof.maxX+.3?["07 / TAKE A SOFTER SHAPE","Follow the lower gold trail right. Release Space to flatten beneath the low lintel."]:e.x<4?["08 / FOLLOW THE RETURN","Keep moving right along the lower lane. Gather flesh and surround the remaining gems."]:["THE WAY DOWN",t.gemCount===3&&t.goldCount===t.gold.length?"Everything gathered. Flow into the dark funnel to finish.":"Explore the lower terrace, then flow into the dark funnel. All three gems and every gold piece earn 100%."]:["04 / BECOME A MOUND","The first violet gem is ahead on the high lane. Move onto it and hold Space to rise around it."]}function $1(i,t,e=tn){const n=Math.min(1,Math.max(0,t/1.45)),s=n*n*(3-2*n),r=Math.min(1,Math.max(0,(t-1.45)/1.35));return{...i,x:i.x+(e.exit.x-i.x)*s,z:i.z+(e.exit.z-i.z)*s,y:i.y-r*2.8}}function J1(i,t,e,n=tn,s=[]){const o=Math.min(1,Math.max(0,e/1.1)),a=t===0||s.includes(t),c=t===0?0:a?.025+t%13*.004:.1+t*37%47/47*.43,l=Math.min(1,Math.max(0,(o-c)/(1-c))),h=l*l*(3-2*l),u=t*2.39996323,f=a?.035:.075,d=n.start.z;return{...i,x:n.start.x+Math.cos(u)*f+(i.x-n.start.x)*h,z:d+Math.sin(u)*f+(i.z-d)*h,y:i.y+(n.id>1?2.3:4.4)*(1-l)*(1-l)}}const Ur=(i,t,e)=>Math.max(t,Math.min(e,i)),Gn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);class Hx{constructor(t){this.fluid=t,this.state="ready",this.indices=[],this.members=new Set,this.cargo=new Set,this.length=0,this.recovered=0,this.strain=0}get active(){return this.indices.length>0}cast(t,e,n=new Set){if(this.active)return!1;const s=this.fluid,r=s.brain,o=t.x-r.x,a=t.z-r.z,c=Math.hypot(o,a);if(!Number.isFinite(c)||c<.45)return!1;s.samplePairs(),s.updateComponents(e);const l=s.particles.map((u,f)=>({p:u,i:f})).filter(({p:u,i:f})=>f!==s.brainIndex&&!s.coatIndices.includes(f)&&!n.has(f)&&!u.feedstock&&u.component===r.component&&Gn(u,r)<1.55*s.size);if(l.length<12)return this.state="need flesh",!1;this.ux=o/c,this.uz=a/c;const h=Math.min(l.length-4,40,Math.max(12,Math.ceil(c/.14)+3));return this.reach=Math.min(c,4.8*s.size,(h-2)*.15*s.size),l.sort((u,f)=>{const d=x=>Math.abs((x.x-r.x)*this.uz-(x.z-r.z)*this.ux)+Math.abs(x.y-r.y)*.4;return d(u.p)-d(f.p)}),this.indices=l.slice(0,h).sort((u,f)=>(u.p.x-f.p.x)*this.ux+(u.p.z-f.p.z)*this.uz).map(u=>u.i),this.members=new Set(this.indices),this.cargo.clear(),this.length=Math.min(.8*s.size,this.reach),this.state="casting",this.strain=0,this.recovered=0,this.age=0,this.target={x:r.x+this.ux*this.reach,z:r.z+this.uz*this.reach},this.brainAnchor={x:r.x,z:r.z},!0}release(t="ready"){this.indices=[],this.members.clear(),this.cargo.clear(),this.state=t,this.strain=0}prepare(t,e,n,s=!1){if(!this.active)return;this.age+=t,this.pulling=e;const r=this.fluid.brain;s&&(this.brainAnchor={x:r.x,z:r.z});const o=Math.hypot(this.target.x-r.x,this.target.z-r.z);if(o>this.reach+1.1*this.fluid.size){this.release("broken");return}this.ux=(this.target.x-r.x)/(o||1),this.uz=(this.target.z-r.z)/(o||1),e?(this.state="retrieving",this.length=Math.max(.15,this.length-t*.8),this.target={x:r.x+this.ux*this.length,z:r.z+this.uz*this.length}):(this.length=Math.min(o,this.length+t*4.2),this.state=this.length<o-.05?"casting":this.cargo.size?"contact":"extended"),this.colliders=n,e&&this.length<.3&&[...this.cargo].every(a=>Gn(a,r)<.8)&&this.release()}controls(t){return this.active&&(this.members.has(t)||this.cargo.has(this.fluid.particles[t]))}guide(t){const e=this.fluid,n=e.brain,s=n.x+this.ux*this.length*t,r=n.z+this.uz*this.length*t,o=Ce(s,r,this.colliders).height+e.radius+.055;return{x:s,z:r,y:Math.max(o,n.y+(o-n.y)*Math.min(1,this.length*t/.8))}}forces(t,e,n){if(!this.active)return;let s;if(this.members.has(e))s=this.guide((this.indices.indexOf(e)+1)/this.indices.length);else if(this.cargo.has(t)){if(!this.pulling){t.vx*=.9,t.vz*=.9;return}const o=this.fluid.brain,a=(t.x-o.x)*this.ux+(t.z-o.z)*this.uz;s=this.guide(Ur((a-.35)/Math.max(.1,this.length),0,1))}else return;const r=this.members.has(e)?85:65;t.vx+=Ur((s.x-t.x)*r-t.vx*11,-42,42)*n,t.vy+=(Ur((s.y-t.y)*r-t.vy*11,-32,42)+7.2)*n,t.vz+=Ur((s.z-t.z)*r-t.vz*11,-42,42)*n}solve(){if(!this.active)return;const t=this.fluid;for(let e=0;e<this.indices.length;e++){const n=e?t.particles[this.indices[e-1]]:t.brain,s=t.particles[this.indices[e]],r=Gn(n,s),o=e?.23*t.size:.3*t.size;if(r<=o||Rn(n,s,this.colliders,t.radius*.3))continue;const a=Math.min(.035,(r-o)*.4),c=e?.5:0,l=(s.x-n.x)/r*a,h=(s.y-n.y)/r*a,u=(s.z-n.z)/r*a;e&&(n.x+=l*c,n.y+=h*c,n.z+=u*c),s.x-=l*(1-c),s.y-=h*(1-c),s.z-=u*(1-c)}}finish(t,e){if(!this.active)return;const n=this.fluid,s=n.brain;for(const o of this.cargo)(o.feedstock||Gn(o,s)<.45)&&this.cargo.delete(o);let r=this.age>1.4&&Gn(n.particles[this.indices.at(-1)],this.guide(1))>.75*n.size;for(let o=0;o<this.indices.length;o++){const a=n.particles[this.indices[o]],c=o?n.particles[this.indices[o-1]]:s;(a.feedstock||Gn(a,c)>.5*n.size||Rn(a,c,e,n.radius*.3))&&(r=!0)}this.strain=r?this.strain+t:Math.max(0,this.strain-t*2),this.age>.7&&this.strain>.4&&this.release("broken")}}class Wx{constructor(t){this.fluid=t,this.strands=[],this.recalling=!1,this.lastState="ready",this.feedback="",this.feedbackUntil=0,this.recovered=0}get active(){return this.strands.some(t=>t.active)}get count(){return this.strands.filter(t=>t.active).length}get indices(){return this.strands.flatMap(t=>t.indices)}get length(){return this.strands.reduce((t,e)=>t+e.length,0)}get state(){return this.active?this.recalling?"retrieving":this.strands.some(t=>t.state==="casting")?"casting":this.strands.some(t=>t.cargo.size)?"contact":"extended":this.lastState}reject(t){return this.feedback=t,this.feedbackUntil=this.fluid.time+2,!1}cast(t,e){if(this.count>=3)return this.reject("Three tendrils out — recall to free one");const n=new Set(this.indices);this.strands.forEach(r=>r.cargo.forEach(o=>n.add(this.fluid.particles.indexOf(o))));const s=new Hx(this.fluid);return s.cast(t,e,n)?(this.active||(this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z}),this.strands.push(s),this.recalling=!1,this.feedback="",this.lastState="ready",!0):(this.active||(this.lastState=s.state),this.reject(s.state==="need flesh"?"Not enough flesh — gather or recall":"Aim farther from the body"))}toggleRecall(){this.active&&(this.recalling=!this.recalling)}release(t="ready"){this.strands.forEach(e=>e.release(t)),this.strands=[],this.recalling=!1,this.lastState=t,this.feedback=""}controls(t){return this.strands.some(e=>e.controls(t))}prepare(t,e,n,s=!1){this.active&&(e&&(this.recalling=!0),s&&(this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z}),this.wasLoose=new Set(this.fluid.particles.filter(r=>r.feedstock)),this.strands.forEach(r=>r.prepare(t,this.recalling,n,s)))}forces(t,e,n){this.strands.find(r=>r.controls(e))?.forces(t,e,n)}solve(){this.strands.forEach(t=>t.solve())}finish(t,e){const n=this.fluid,s=n.brain,r=this.strands.filter(a=>a.active);for(const a of this.wasLoose||[]){if(a.feedstock||a.component!==s.component||Gn(a,s)<.45||r.some(h=>h.cargo.has(a)))continue;let c=null,l=1/0;for(const h of r)for(const u of h.indices){const f=Gn(a,n.particles[u]);f<l&&(l=f,c=h)}c&&(c.cargo.add(a),c.recovered++,this.recovered++)}this.strands.forEach(a=>a.finish(t,e));const o=this.strands.filter(a=>!a.active);o.some(a=>a.state==="broken")?(this.lastState="broken",this.reject(this.active?"A tendril broke — the others are still available":"Tendril broke — gather flesh and cast again")):o.length&&(this.lastState="ready"),this.strands=this.strands.filter(a=>a.active),this.active||(this.recalling=!1),this.wasLoose=null}}const Xx=(i,t,e)=>t>=i.minX&&t<=i.maxX&&e>=i.minZ&&e<=i.maxZ;function Zx(i,t,e,n=[]){const s=i.owner;if(!s)return Ce(t,e,n).height;if(s.type==="cylinder")return Math.hypot(t-s.x,e-s.z)<=s.radius?s.height:null;if(!Xx(s,t,e))return null;if(s.type==="box")return s.maxY;if(s.type==="roof")return s.top;if(s.type==="editor-stairs"){const r=s.axis==="x"?s.maxX-s.minX:s.maxZ-s.minZ;let o=s.axis==="x"?(t-s.minX)/r:(e-s.minZ)/r;return s.reverse&&(o=1-o),s.base+s.rise*o}return s.type==="grip-ramp"?s.axis==="x"?s.minHeight+(s.maxHeight-s.minHeight)*(t-s.minX)/(s.maxX-s.minX):s.northHeight+(s.southHeight-s.northHeight)*(e-s.minZ)/(s.maxZ-s.minZ):s.maxY??null}function ms(i,t,e,n,s=1,r){if(i.face&&i.face!=="floor"||t.x<i.minX||t.x>i.maxX||t.z<i.minZ||t.z>i.maxZ)return!1;const o=Zx(i,t.x,t.z,n);if(o===null||!Number.isFinite(o)||!i.targetId&&i.base!==void 0&&Math.abs(o-i.base)>.2)return!1;const a=r??Bi(t,e,n);return Math.abs(a-o)<.16&&t.y<a+e+.34*s}const fe=(i,t,e)=>Math.max(t,Math.min(e,i)),qx=(i,t,e)=>`${i},${t},${e}`;class Yx{constructor({x:t=-2.1,z:e=0,size:n=1,seedCount:s=null,massReferenceCount:r=null}={}){this.size=n,this.radius=.067*n,this.range=.35*n,this.particles=[];const o=.155*n;for(let h=0;h<3;h++)for(let u=-5;u<=5;u++)for(let f=-6;f<=6;f++){const d=f/6,x=u/5;if(d*d+x*x>1.04)continue;const v=.105+.08*(1-d*d)*(1-x*x),_=t+f*o,p=e+u*o,y=this.radius+.012+h*v*n;this.particles.push({x:_,y,z:p,px:_,py:y,pz:p,vx:0,vy:0,vz:0,component:0,lastMain:0,lastBrain:0})}this.brainIndex=this.particles.findIndex(h=>Math.abs(h.x-t)<1e-6&&Math.abs(h.z-e)<1e-6&&h.y>this.radius+.1*n),this.brainIndex<0&&(this.brainIndex=Math.floor(this.particles.length/2));const a=this.particles.length;if(s!==null&&s<a){const h=this.particles[this.brainIndex],u=this.particles.map((f,d)=>({p:f,i:d,d:Math.hypot(f.x-h.x,f.y-h.y,f.z-h.z)})).sort((f,d)=>f.d-d.d).slice(0,Math.max(17,s));this.brainIndex=u.findIndex(f=>f.i===this.brainIndex),this.particles=u.map(f=>f.p)}this.initialCount=this.particles.length,this.massReferenceCount=r??this.initialCount,this.coatIndices=this.particles.map((h,u)=>({i:u,d:Math.hypot(h.x-this.brain.x,h.y-this.brain.y,h.z-this.brain.z)})).filter(h=>h.i!==this.brainIndex).sort((h,u)=>h.d-u.d).slice(0,16).map(h=>h.i),this.coatReach=.25*n,this.attachedCount=0,this.attachedMass=0,this.brainPower=0,this.restDensity=0,this.time=0,this.contacts=0,this.mainComponent=0,this.contractAnchor=null,this.brainDrive={x:0,z:0},this.brainAirborne=!1,this.components=[],this.pairs=[],this.cohesion=.16,this.viscosity=.22,this.edgeReach=n>=1.2?2.9:2.4,this.edgeStrength=.012*n,this.samplePairs();const c=new Float32Array(this.particles.length);for(const[h,u,f]of this.pairs){const d=1-f/this.range;c[h]+=d*d,c[u]+=d*d}const l=[...c].sort((h,u)=>h-u);this.restDensity=l[Math.floor(l.length*.55)],this.updateComponents()}centroid(){let t=0,e=0,n=0;for(const r of this.particles)t+=r.x,e+=r.y,n+=r.z;const s=this.particles.length||1;return{x:t/s,y:e/s,z:n/s}}get brain(){return this.particles[this.brainIndex]}addParticle(t,{feedstock:e=!1}={}){const n={...t,px:t.x,py:t.y,pz:t.z,vx:0,vy:0,vz:0,component:-1,lastMain:-1/0,lastBrain:-1/0,feedstock:e};return this.particles.push(n),n}field(t,e=1.9*this.size){const n=t/e;return 1/(1+n*n)}coatContacts(t=[]){const e=this.brain,n=this.coatReach+1e-5;return this.coatIndices.filter(s=>{const r=this.particles[s];return Math.hypot(r.x-e.x,r.y-e.y,r.z-e.z)<=n&&!Rn(e,r,t,this.radius*.35)})}constrainCoat(t){const e=this.brain,n=this.coatReach*.9;for(let s=0;s<8;s++){for(const r of this.coatIndices){const o=this.particles[r],a=o.x-e.x,c=o.y-e.y,l=o.z-e.z,h=Math.hypot(a,c,l);if(o.component!==e.component&&h>2*n||h<=n||h<1e-8)continue;const u=Math.min(h-n,.035*this.size),f=.05;e.x+=a/h*u*f,e.y+=c/h*u*f,e.z+=l/h*u*f,o.x-=a/h*u*(1-f),o.y-=c/h*u*(1-f),o.z-=l/h*u*(1-f),this.contacts+=Dr(e,this.radius,t)+Dr(o,this.radius,t)}if(this.coatContacts(t).length>=8)break}}startContract(t=[],e=()=>!1){this.samplePairs(),this.updateComponents(t);const n=(this.components.find(r=>r.includes(this.brainIndex))||[]).filter(r=>r!==this.brainIndex&&!e(r)),s=n.length||1;this.contractAnchor={x:n.length?n.reduce((r,o)=>r+this.particles[o].x,0)/s:this.brain.x,z:n.length?n.reduce((r,o)=>r+this.particles[o].z,0)/s:this.brain.z}}moveBrain(t,e,n){const s=this.brain,r=this.size,o=this.contractAnchor,a=Math.hypot(e.x||0,e.z||0),c=a?(e.x||0)/a:0,l=a?(e.z||0)/a:0,h=o&&Math.hypot(o.x-s.x,o.z-s.z)>.08*r,u=this.brainPower,f=(e.push?4.8:3.6)*Math.max(r,1)*u,d=24*Math.max(r,1)*u,x=(V,st,gt)=>V+fe(st-V,-gt,gt),v=Bi(s,this.radius,n),_=n.find(V=>V.type==="slip"&&ms(V,s,this.radius,n,r,v)),p=n.find(V=>V.type==="sticky-paint"&&ms(V,s,this.radius,n,r,v));this.brainSlipping=!!_;const y=_?d*.12:p?d*.65:d,m=p?f*.78:f;this.brainDrive.x=u?x(this.brainDrive.x,h?0:c*m,y*t):0,this.brainDrive.z=u?x(this.brainDrive.z,h?0:l*m,y*t):0;const g=o||e.holdPosition,M=g?{x:g.x-s.x,z:g.z-s.z}:{x:0,z:0},T={x:this.brainDrive.x+fe(M.x*3.3,-1.8*r,1.8*r)*u,z:this.brainDrive.z+fe(M.z*3.3,-1.8*r,1.8*r)*u},A=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1)),E=Bi(s,this.radius,n);let b=E+(o?this.radius+.16*r+(1.25*r-this.radius-.16*r)*Math.cbrt(A):this.radius+.16*r);if(o){const V=this.particles.filter((gt,Dt)=>Dt!==this.brainIndex&&!this.coatIndices.includes(Dt)&&!gt.feedstock&&gt.component===s.component&&Math.hypot(gt.x-o.x,gt.z-o.z)<.53*r).map(gt=>gt.y).sort((gt,Dt)=>gt-Dt),st=V.length>=8?V[Math.floor(V.length*.65)]+.23*r:E+this.radius+.18*r;b=Math.min(b,st)}const w=n.filter(V=>V.type==="roof"&&s.z>V.minZ-.2&&s.z<V.maxZ+.2).reduce((V,st)=>{const gt=Math.max(st.minX-s.x,0,s.x-st.maxX),Dt=V?Math.max(V.minX-s.x,0,s.x-V.maxX):1/0;return gt<Dt?st:V},null);let R=0;if(w){const V=fe((s.x-(w.minX-1.8*r))/(1.25*r),0,1),st=w.approachBothSides?fe((w.maxX+1.8*r-s.x)/(1.25*r),0,1):fe((w.maxX+.75*r-s.x)/(.5*r),0,1);R=V*st;const gt=E+Math.max(this.radius+.018,Math.min(this.radius+.025,w.bottom-E-.105*r-.022));b=b*(1-R)+gt*R}const I=n.find(V=>V.type==="grip-ramp"||V.type==="grip-ramp-control"),U=n.find(V=>V.gripPlatform&&I),F=n.find(V=>V.type==="editor-solid-mesh"),B=n.filter(V=>V.type==="sticky-wall").find(V=>{const st=V.face==="west"?V.minX:V.face==="east"?V.maxX:V.face==="north"?V.minZ:V.maxZ,gt=V.face==="west"||V.face==="north"?-1:1,Dt=["west","east"].includes(V.face)?s.x:s.z,D=["west","east"].includes(V.face)?s.z:s.x,C=["west","east"].includes(V.face)?V.minZ:V.minX,W=["west","east"].includes(V.face)?V.maxZ:V.maxX,Y=st-gt*.035;return F&&!Wn(F,["west","east"].includes(V.face)?Y:s.x,fe(s.y,V.minY+.04,V.maxY-.04),["north","south"].includes(V.face)?Y:s.z)?!1:(Dt-st)*gt>=this.radius-.08&&(Dt-st)*gt<.75*r&&D>=C+this.radius&&D<=W-this.radius&&s.y>=V.minY+this.radius-.12&&s.y<V.maxY+this.radius+.1}),k=B||U,z=B?B.axis:Wa(I),X=z==="x"?s.x:s.z,J=z==="x"?c:l,rt=k?.[z==="x"?"minX":"minZ"],mt=k?.[z==="x"?"maxX":"maxZ"],_t=k&&(X<rt||X>mt)?{coordinate:X<rt?rt:mt,normal:X<rt?-1:1}:null,At=B?{coordinate:B.face==="west"||B.face==="north"?rt:mt,normal:B.face==="west"||B.face==="north"?-1:1}:_t||(k&&Math.abs(J)>.4?{coordinate:J<0?mt:rt,normal:J<0?1:-1}:null),Rt=At?(X-At.coordinate)*At.normal:1/0,$=k&&(z==="x"?s.z>=k.minZ+this.radius&&s.z<=k.maxZ-this.radius:s.x>=k.minX+this.radius&&s.x<=k.maxX-this.radius),Q=!F||!k?.csgControl||!At||Wn(F,z==="x"?At.coordinate-At.normal*.035:s.x,fe(s.y,k.minY+.04,k.maxY-.04),z==="z"?At.coordinate-At.normal*.035:s.z),ft=At&&$&&Q&&Rt>=this.radius-.03&&Rt<=.62*r&&s.y>=k.minY+this.radius-.12&&s.y<k.maxY+this.radius+.1,Tt=ft?this.particles.filter((V,st)=>st!==this.brainIndex&&!this.coatIndices.includes(st)&&!V.feedstock&&V.component===s.component&&(z==="x"?V.z>=k.minZ&&V.z<=k.maxZ:V.x>=k.minX&&V.x<=k.maxX)&&((z==="x"?V.x:V.z)-At.coordinate)*At.normal>=-this.radius&&((z==="x"?V.x:V.z)-At.coordinate)*At.normal<=.58*r&&Math.abs(V.y-s.y)<.55*r).length:0,vt=!!(ft&&J*At.normal<-.4&&!o&&Tt>=6&&this.coatContacts(n).length>=8),Bt=!!(At&&Math.abs(J)>.4&&!o&&s.x>=k.minX&&s.x<=k.maxX&&s.z>=k.minZ&&s.z<=k.maxZ&&s.y>=k.maxY+this.radius-.04);this.gripClimbing=vt||Bt,this.gripFace=this.gripClimbing?{...At,axis:z,minY:k.minY}:null;const Ot=V=>{const st=Bi(V,this.radius,n);if(V.y<=st+this.radius+.065*r)return!0;for(const gt of n){if(gt.type==="editor-solid-mesh"&&Ix(V,this.radius,gt,.065*r)!==null)return!0;let Dt=null,D=!1;if(gt.type==="cylinder"?(Dt=gt.height,D=Math.hypot(V.x-gt.x,V.z-gt.z)<=gt.radius+this.radius):(gt.type==="box"||gt.type==="roof")&&(Dt=gt.type==="roof"?gt.top:gt.maxY,D=V.x>=gt.minX-this.radius&&V.x<=gt.maxX+this.radius&&V.z>=gt.minZ-this.radius&&V.z<=gt.maxZ+this.radius),D&&Math.abs(V.y-Dt-this.radius)<.065*r)return!0}return!1},N=s.y<=E+this.radius+.24*r||Ot(s);let it=0;if(!N)for(let V=0;V<this.particles.length;V++){if(V===this.brainIndex||this.coatIndices.includes(V))continue;const st=this.particles[V];if(!(st.feedstock||st.component!==s.component||st.y>s.y-.04*r||s.y-st.y>1.05*r||Math.hypot(st.x-s.x,st.z-s.z)>.78*r||!Ot(st))&&++it>=4)break}const et=ft&&Tt>=6&&this.coatContacts(n).length>=8;this.brainAirborne=!N&&it<4&&!et&&!Bt;let tt=fe((b-s.y)*(R?6:3.2),-1.8*r,1.8*r)*u;this.brainAirborne?tt=fe((s.vy-7.2*t)*.995,-5,5):vt?tt=3.6/(1+3*(this.attachedCount/Math.max(1,this.massReferenceCount-1)))*r*u:ft&&s.y>b&&(tt=Math.max(tt,-.42*r));const j={x:s.x,y:s.y,z:s.z},dt=Math.max(1,Math.ceil(Math.hypot(T.x,tt,T.z)*t/(this.radius*.45)));for(let V=0;V<dt;V++)s.px=s.x,s.py=s.y,s.pz=s.z,s.x+=T.x*t/dt,s.y+=tt*t/dt,s.z+=T.z*t/dt,this.contacts+=Dr(s,this.radius,n);if(s.px=j.x,s.py=j.y,s.pz=j.z,s.vx=(s.x-j.x)/t,s.vy=(s.y-j.y)/t,s.vz=(s.z-j.z)/t,o&&a&&!h){const V=fe((s.x-j.x)*c+(s.z-j.z)*l,0,f*t);o.x+=c*V,o.z+=l*V}Math.abs(s.x-j.x)<Math.abs(T.x*t)*.3&&(this.brainDrive.x=0),Math.abs(s.z-j.z)<Math.abs(T.z*t)*.3&&(this.brainDrive.z=0)}samplePairs(){const t=this.range,e=this.particles;let n=1/0,s=1/0,r=1/0,o=-1/0,a=-1/0,c=-1/0;for(const g of e){const M=Math.floor(g.x/t),T=Math.floor(g.y/t),A=Math.floor(g.z/t);n=Math.min(n,M),s=Math.min(s,T),r=Math.min(r,A),o=Math.max(o,M),a=Math.max(a,T),c=Math.max(c,A)}n--,s--,r--,o++,a++,c++;const l=a-s+1,h=c-r+1,u=(o-n+1)*l*h,f=Number.isSafeInteger(u),d=f&&u<=25e4,x=f?(g,M,T)=>(g-n)*l*h+(M-s)*h+(T-r):qx;let v,_,p,y;if(d){const g=this._pairGrid||{};(!g.head||g.head.length<u)&&(g.head=new Int32Array(u),g.tail=new Int32Array(u)),(!g.next||g.next.length<e.length)&&(g.next=new Int32Array(e.length)),this._pairGrid=g,v=g.head,_=g.tail,p=g.next,v.fill(-1,0,u),_.fill(-1,0,u)}else y=new Map;for(let g=0;g<e.length;g++){const M=e[g],T=Math.floor(M.x/t),A=Math.floor(M.y/t),E=Math.floor(M.z/t),b=x(T,A,E);d?(p[g]=-1,v[b]===-1?v[b]=g:p[_[b]]=g,_[b]=g):(y.has(b)||y.set(b,[]),y.get(b).push(g))}const m=[];for(let g=0;g<e.length;g++){const M=e[g],T=Math.floor(M.x/t),A=Math.floor(M.y/t),E=Math.floor(M.z/t);for(let b=-1;b<=1;b++)for(let S=-1;S<=1;S++)for(let w=-1;w<=1;w++){const R=T+b,I=A+S,U=E+w;if(f&&(R<n||R>o||I<s||I>a||U<r||U>c))continue;const F=x(R,I,U);if(d)for(let B=v[F];B!==-1;B=p[B]){if(B<=g)continue;const k=e[B],z=Math.hypot(M.x-k.x,M.y-k.y,M.z-k.z);z<t&&m.push([g,B,z])}else{const B=y.get(F);if(!B)continue;for(const k of B){if(k<=g)continue;const z=e[k],X=Math.hypot(M.x-z.x,M.y-z.y,M.z-z.z);X<t&&m.push([g,k,X])}}}}return this.pairs=m,m}updateComponents(t=[]){const e=this.particles.length,n=Array.from({length:e},(l,h)=>h),s=l=>{for(;n[l]!==l;)n[l]=n[n[l]],l=n[l];return l};for(const[l,h,u]of this.pairs)if(u<this.range*.84&&!!this.particles[l].feedstock==!!this.particles[h].feedstock){const f=s(l),d=s(h);f!==d&&(!t.length||!Rn(this.particles[l],this.particles[h],t,this.radius*.35))&&(n[d]=f)}const r=new Int32Array(e),o=new Map;for(let l=0;l<e;l++){const h=s(l);r[l]=h,o.has(h)||o.set(h,[]),o.get(h).push(l)}this.components=[...o.values()].sort((l,h)=>h.length-l.length);const a=new Int32Array(e);for(let l=0;l<this.components.length;l++)a[r[this.components[l][0]]]=l;const c=a[r[this.brainIndex]];for(let l=0;l<e;l++){const h=a[r[l]];this.particles[l].component=h,h===0&&(this.particles[l].lastMain=this.time),h===c&&(this.particles[l].lastBrain=this.time)}return this.mainComponent=this.components[0]?.length||0,this.attachedCount=Math.max(0,(this.components[c]?.length||1)-1),this.attachedMass=this.attachedCount*this.size**3/Math.max(1,this.massReferenceCount-1),this.brainPower=this.attachedMass/(this.attachedMass+.35),this.components}attractExposedEdges(t,e,n=!1){if(this.cohesion<=0||this.edgeReach<=0||this.edgeStrength<=0)return;const s=this.particles,r=s.length,o=this.range,a=new Float32Array(r),c=new Float32Array(r),l=new Float32Array(r);for(const[p,y,m]of this.pairs){if(n&&(p===this.brainIndex||y===this.brainIndex)||n&&!!s[p].feedstock!=!!s[y].feedstock)continue;const g=s[p],M=s[y],T=M.x-g.x,A=M.z-g.z,E=Math.hypot(T,A);if(E<.045*this.size)continue;const b=1-m/o,S=T/E,w=A/E;a[p]+=S*b,c[p]+=w*b,a[y]-=S*b,c[y]-=w*b,l[p]+=b,l[y]+=b}const h=[];for(let p=0;p<r;p++){if(l[p]<.35||Math.hypot(a[p],c[p])/l[p]<.38)continue;const m=Math.hypot(a[p],c[p]);h.push({i:p,nx:-a[p]/m,nz:-c[p]/m})}const u=[],f=Math.max(o*1.25,.44*this.size),d=this.edgeReach;for(let p=0;p<h.length;p++)for(let y=p+1;y<h.length;y++){const m=h[p],g=h[y],M=s[m.i],T=s[g.i];if(M.feedstock&&T.feedstock&&M.patchId!==T.patchId)continue;const A=T.x-M.x,E=T.z-M.z,b=Math.hypot(A,E);if(b<f||b>d||Math.abs(T.y-M.y)>.36*this.size)continue;const S=A/b,w=E/b;m.nx*S+m.nz*w<.65||g.nx*S+g.nz*w>-.65||u.push({i:m.i,j:g.i,d:b,ux:S,uz:w})}u.sort((p,y)=>p.d-y.d);const x=new Uint8Array(r),v=new Float32Array(r),_=t*60*this.cohesion/.16;for(const p of u){const{i:y,j:m,d:g,ux:M,uz:T}=p;if(x[y]>=2||x[m]>=2||n&&(y===this.brainIndex||m===this.brainIndex)||n&&!!s[y].feedstock!=!!s[m].feedstock||Rn(s[y],s[m],e,this.radius*.35))continue;const A=Math.min((.45+.55*(1-g/d))*this.edgeStrength,this.edgeStrength-v[y],this.edgeStrength-v[m]);if(A<=0)continue;x[y]++,x[m]++,v[y]+=A,v[m]+=A;const E=A*_;s[y].x+=M*E,s[y].z+=T*E,s[m].x-=M*E,s[m].z-=T*E}}step(t,e,n,s={}){if(!(t>0))return;const r=1,o=t/r,a=this.particles,c=this.radius,l=n.filter(u=>u.type==="slip"),h=n.filter(u=>u.type==="sticky-paint"&&u.face==="floor");this.contacts=0,e.puddle&&(e.contract&&!this.contractAnchor&&this.startContract(n,s.controls),e.contract||(this.contractAnchor=null));for(let u=0;u<r;u++){this.time+=o,e.puddle&&this.moveBrain(o,e,n);const f=e.puddle?this.brain:this.centroid(),d=Math.hypot(e.x||0,e.z||0),x=new Set;if(e.puddle&&e.contract){const y=a.map((m,g)=>({p:m,i:g})).filter(({p:m,i:g})=>g!==this.brainIndex&&!this.coatIndices.includes(g)&&!m.feedstock&&m.component===this.brain.component&&!s.controls?.(g)).sort((m,g)=>m.p.y-g.p.y);for(let m=0;m<Math.ceil(y.length*.25);m++)x.add(y[m].i)}const v=d?(e.x||0)/d:0,_=d?(e.z||0)/d:0;for(let y=0;y<a.length;y++){const m=a[y];if(e.puddle&&y===this.brainIndex)continue;m.px=m.x,m.py=m.y,m.pz=m.z;const g=Bi(m,c,n),M=this.time-m.lastMain<2.5,T=this.brain.component,A=e.puddle?m.component===T:m.component===0||M&&this.components[m.component]?.length>this.initialCount*.1,E=((m.x-f.x)*v+(m.z-f.z)*_)/this.size,b=fe(1+.1*E,.82,1.14);if(A&&!e.puddle){const U=e.push?6:1;m.vx+=v*7.5*d*b*U*o,m.vz+=_*7.5*d*b*U*o}if(e.puddle&&!m.feedstock&&!e.contract&&!s.controls?.(y)){const U=f.x-m.x,F=f.z-m.z,B=Math.hypot(U,F),k=.19*this.size,z=Math.hypot(U,f.y-m.y,F),X=m.component===T,J=this.field(z);if(B>k){const mt=fe((B-k)/(.4*this.size),0,1),_t=(X?12:8)*this.brainPower*J*mt;m.vx+=(U/B*_t-m.vx*.8*J)*o,m.vz+=(F/B*_t-m.vz*.8*J)*o}const rt=l.some(mt=>ms(mt,m,c,n,this.size,g));if(d&&U*v+F*_>-.08*this.size&&X&&!e.holdPosition&&!this.gripClimbing&&!this.brainSlipping&&!rt&&z<2.4*this.size&&(!n.length||!Rn(m,f,n,c*.35))){const mt=12*this.brainPower*J,_t=24*Math.max(this.size,1)*this.brainPower;m.vx+=fe((f.vx-m.vx)*mt,-_t,_t)*o,m.vz+=fe((f.vz-m.vz)*mt,-_t,_t)*o}}if(this.gripClimbing&&!m.feedstock&&m.component===T&&!this.coatIndices.includes(y)&&Math.abs(this.gripFace.axis==="x"?m.z-f.z:m.x-f.x)<.9*this.size&&((this.gripFace.axis==="x"?m.x:m.z)-this.gripFace.coordinate)*this.gripFace.normal>-.45*this.size&&((this.gripFace.axis==="x"?m.x:m.z)-this.gripFace.coordinate)*this.gripFace.normal<.9*this.size&&m.y>this.gripFace.minY-.2*this.size&&m.y<f.y+.6*this.size&&(m.vy+=fe((f.y+.18*this.size-m.y)*54-m.vy*2,-4,42)*o),e.contract&&!m.feedstock&&y!==this.brainIndex&&!s.controls?.(y)){const U=m.component===T,F=U&&this.contractAnchor||f,B=F.x-m.x,k=F.z-m.z,z=Math.hypot(B,k),X=.12*this.size;if(z>X){const J=this.field(Math.hypot(B,f.y-m.y,k)),rt=fe((z-X)/(.5*this.size),0,1),mt=(U?48:52)*this.brainPower*J*rt;m.vx+=(B/z*mt-m.vx*3.2*J)*o,m.vz+=(k/z*mt-m.vz*3.2*J)*o}if(e.puddle&&!this.brainAirborne&&U&&!this.coatIndices.includes(y)&&!x.has(y)&&this.contractAnchor){const J=Math.hypot(m.x-F.x,m.z-F.z),rt=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1)),mt=(.62+.34*Math.cbrt(rt))*this.size,_t=fe(1-J/mt,0,1),At=Bi({x:F.x,y:f.y,z:F.z},this.radius,n)+this.radius+.014*this.size+_t*(.16+.9*Math.cbrt(rt))*this.size;if(_t>0){const Rt=fe((At-m.y)*48-m.vy*4,-12*this.size,24*this.size);m.vy+=Rt*o}}}s.forces?.(m,y,o),m.vy-=7.2*o;const S=m.y<=g+c+.02,w=l.some(U=>ms(U,m,c,n,this.size,g)),R=h.some(U=>ms(U,m,c,n,this.size,g)),I=S?w?.994:R?.94:.968:.993;m.vx*=I,m.vy*=.995,m.vz*=I,S&&!d&&(m.vx*=w?.99:R?.68:.88,m.vz*=w?.99:R?.68:.88),m.x+=m.vx*o,m.y+=m.vy*o,m.z+=m.vz*o}s.preSubstep?.(o,a),this.samplePairs(),this.attractExposedEdges(o,n,e.puddle);for(let y=0;y<(e.contract?4:2);y++){this.samplePairs();const m=new Float32Array(a.length),g=new Float32Array(a.length);for(const[M,T,A]of this.pairs){const E=1-A/this.range,b=E*E,S=b*E;m[M]+=b,m[T]+=b,g[M]+=S,g[T]+=S}for(const[M,T,A]of this.pairs){const E=a[M],b=a[T],S=1-A/this.range,w=(b.x-E.x)/(A||1),R=(b.y-E.y)/(A||1),I=(b.z-E.z)/(A||1),U=Math.max(-.004,(m[M]-this.restDensity)*.0037),F=Math.max(-.004,(m[T]-this.restDensity)*.0037),B=(g[M]+g[T])*.0026;let k=((U+F)*S+B*S*S)*.5;A<c*1.78&&(k+=Math.min(.006,(c*1.78-A)*.06)),A>c*2.45&&(k-=this.cohesion*.02*S),k=fe(k,-.005,.007),e.puddle&&M===this.brainIndex?(b.x+=w*k*2,b.y+=R*k*2,b.z+=I*k*2):e.puddle&&T===this.brainIndex?(E.x-=w*k*2,E.y-=R*k*2,E.z-=I*k*2):(E.x-=w*k,E.y-=R*k,E.z-=I*k,b.x+=w*k,b.y+=R*k,b.z+=I*k)}s.solve?.(o,a);for(const M of a)this.contacts+=Dr(M,c,n);e.puddle&&this.constrainCoat(n)}this.samplePairs();const p=e.puddle?5*Math.max(this.size,1):5;for(const y of a)y.vx=fe((y.x-y.px)/o,-p,p),y.vy=fe((y.y-y.py)/o,-5,5),y.vz=fe((y.z-y.pz)/o,-p,p);for(const[y,m,g]of this.pairs){if(e.puddle&&(y===this.brainIndex||m===this.brainIndex))continue;const M=a[y],T=a[m],A=this.viscosity*(1-g/this.range)*.045,E=(T.vx-M.vx)*A,b=(T.vy-M.vy)*A,S=(T.vz-M.vz)*A;M.vx+=E,M.vy+=b,M.vz+=S,T.vx-=E,T.vy-=b,T.vz-=S}s.postSubstep?.(o,a)}if(this.samplePairs(),e.puddle&&e.growth){this.updateComponents(n);const u=a.map(f=>!!f.feedstock);e.expireFragments&&this.expireFragments(),e.shed||this.claimFeedstock(n),u.some((f,d)=>f!==!!a[d].feedstock)&&this.updateComponents(n)}else this.updateComponents(e.puddle?n:[])}expireFragments(t=2.5){for(let e=0;e<this.particles.length;e++){const n=this.particles[e];e===this.brainIndex||this.coatIndices.includes(e)||n.feedstock||n.component===this.brain.component||this.time-n.lastBrain>=t&&(n.feedstock=!0,n.shedLocked=!1)}}claimFeedstock(t){const e=this.particles.filter(o=>!o.feedstock&&o.component===this.brain.component);if(!e.length)return;const n=this.range*.75,s=t.find(o=>o.type==="funnel"&&o.holdsFeedstock),r=s?Ce(s.x,s.z,t).height:0;for(const o of this.particles)if(o.feedstock&&!(s&&o.shedAt!==void 0&&Math.hypot(o.x-s.x,o.z-s.z)<s.bottomRadius+.04&&o.y<r+this.radius+.23)){if(o.shedLocked){const a=!this.particles.some(c=>!c.feedstock&&Math.hypot(c.x-o.x,c.y-o.y,c.z-o.z)<this.range);if(!a&&this.time-(o.shedAt??this.time)<1.2||(o.shedLocked=!1,a))continue}e.some(a=>Math.hypot(a.x-o.x,a.y-o.y,a.z-o.z)<n&&!Rn(a,o,t,this.radius*.35))&&(o.feedstock=!1)}}}const Fl=1/60,Ne={startX:-2.4,spoutX:2.4,spoutZ:0,spoutY:1.3,seedCount:17,capacity:297,interval:.5,perDrip:4,goal:120},zi={startX:-6.4,seedCount:17,capacity:297,patches:[[-4.6,-2.7],[-4.6,0],[-4.6,2.7],[-1.05,-2.7],[-1.05,0],[-1.05,2.7],[2.5,-2.7],[2.5,0],[2.5,2.7],[6.05,-2.7],[6.05,0],[6.05,2.7]]},dn={startX:-4.8,rate:42,threshold:48,releaseThreshold:36,gateX:1.5,gateWidth:.42,gateHeight:1.3,opening:.58},zl=(i,t,e)=>Math.max(t,Math.min(e,i));class K1{constructor({size:t=1}={}){this.selectedTest="puddle",this.gardenLevelId=1,this.completedLevels={},this.practiceLevel=!1,this.reset(t)}get body(){return this.fluid.centroid()}get brain(){return this.fluid.brain}get gardenLevel(){return this.localRun?.level||Vr[this.gardenLevelId-1]||null}get isLocalGarden(){return!!this.localRun}startGarden(t=1,{newGame:e=!1,practice:n=!1}={}){return!Number.isInteger(t)||!Vr[t-1]?!1:(this.localRun=null,e&&(this.completedLevels={},this.practiceLevel=n),this.selectedTest="garden",this.gardenLevelId=t,this.descending=!1,this.reset(1),this.gardenInputArmed=!1,this.garden.phase="arriving",this.garden.arrivalTime=0,!0)}startLocalGarden(t,{id:e,revision:n}={}){return!t?.start||!t?.exit||!e||!Number.isInteger(n)||n<1?!1:(this.localRun={id:e,revision:n,level:t},this.selectedTest="garden",this.gardenLevelId=1,this.practiceLevel=!1,this.descending=!1,this.reset(1),this.gardenInputArmed=!1,this.garden.phase="arriving",this.garden.arrivalTime=0,!0)}restartGarden(){return this.localRun?this.startLocalGarden(this.localRun.level,this.localRun):this.startGarden(this.gardenLevelId)}continueGarden(){if(this.localRun||this.gardenLevelId>=Vr.length||this.garden.phase!=="complete")return!1;const t=this.gardenLevelId+1;return this.completedLevels[this.gardenLevelId]={gems:this.garden.gemCount,gold:this.garden.goldCount,totalGold:this.garden.gold.length},this.startGarden(t),this.descending=!0,!0}reset(t=this.size){this.size=t,this.gardenInputArmed=!0;const e=this.selectedTest==="garden"?this.gardenLevel.start.x:this.selectedTest==="field"?zi.startX:this.selectedTest==="growth"?Ne.startX:this.selectedTest==="pressure"?dn.startX:this.selectedTest==="gap"?-2.1*t:0,n=this.selectedTest==="garden"?this.gardenLevel:this.selectedTest==="field"?zi:this.selectedTest==="growth"?Ne:null;this.fluid=new Yx({x:e,z:this.selectedTest==="garden"?this.gardenLevel.start.z:0,size:t,...n?{seedCount:n.seedCount,massReferenceCount:n.capacity}:{}}),this.tendril=new Wx(this.fluid),this.gardenTendrilUsed=!1,this.growth={elapsed:0,emitted:0,absorbed:0,complete:!1},this.field={absorbed:0,loose:zi.capacity-zi.seedCount},this.pressure={shed:0,credit:0,weight:0,active:!1,opening:0,complete:!1},this.oozeForward=!1,this.materialState="oozing",this.relaxTime=0,this.fleshThrough=0,this.brainThrough=!1,this.gapStage="approach",this.selectedTest==="field"&&this.seedField(),this.selectedTest==="garden"&&(this.garden=Ox(this.gardenLevel),Vx(this.fluid,this.gardenLevel))}selectTest(t){return["field","growth","gap","pressure","puddle","garden"].includes(t)?(this.retrievalSetup=!1,this.selectedTest=t,this.reset(t==="gap"?this.size:1),!0):!1}seedField(){zi.patches.forEach(([t,e],n)=>{const s=23+(n<4?1:0);for(let r=0;r<s;r++){const o=r===0?0:r<=8?1:2,a=o===1?r-1:r-9,c=o===1?8:s-9,l=o===0?0:2*Math.PI*(a+(o===2?.25:0))/c,h=o===0?0:o===1?.18:.37,u=this.fluid.addParticle({x:t+Math.cos(l)*h,y:this.fluid.radius+.013,z:e+Math.sin(l)*h},{feedstock:!0});u.patchId=n}}),this.fluid.samplePairs(),this.fluid.updateComponents(this.activeColliders())}emitGrowth(t){if(!(this.selectedTest!=="growth"||this.growth.emitted>=Ne.capacity-Ne.seedCount))for(this.growth.elapsed+=t;this.growth.elapsed>=Ne.interval&&this.growth.emitted<Ne.capacity-Ne.seedCount;){this.growth.elapsed-=Ne.interval;for(let e=0;e<Ne.perDrip&&this.growth.emitted<Ne.capacity-Ne.seedCount;e++){const n=this.growth.emitted++,s=n*2.39996323;this.fluid.addParticle({x:Ne.spoutX+Math.cos(s)*(.035+.034*(n%3)),y:Ne.spoutY+e%2*.12,z:Ne.spoutZ+Math.sin(s)*(.035+.034*(n%3))},{feedstock:!0})}}}setupRetrieval(){this.selectTest("pressure");const t=this.fluid,e=2.6-t.brain.x;for(const s of t.particles)s.x+=e,s.px=s.x;t.particles.map((s,r)=>({p:s,i:r})).filter(({i:s})=>s!==t.brainIndex&&!t.coatIndices.includes(s)).sort((s,r)=>Math.hypot(r.p.x-t.brain.x,r.p.z)-Math.hypot(s.p.x-t.brain.x,s.p.z)).slice(0,145).forEach(({p:s},r)=>{const o=r*2.39996323,a=.5*Math.sqrt(r%49/48);s.x=ps.x+Math.cos(o)*a,s.z=ps.z+Math.sin(o)*a,s.y=-ps.depth+t.radius+.02+Math.floor(r/49)*.13,s.px=s.x,s.py=s.y,s.pz=s.z,s.vx=s.vy=s.vz=0,s.feedstock=!0}),t.samplePairs(),t.updateComponents(this.activeColliders()),this.updatePressure(1),this.retrievalSetup=!0}castTendril(t){if(!t||!(this.selectedTest==="pressure"||this.selectedTest==="garden"&&Nl(this.gardenLevel)&&this.garden.phase==="playing"&&this.gardenInputArmed))return!1;const e=this.tendril.cast(t,this.activeColliders());return e&&this.selectedTest==="garden"&&(this.gardenTendrilUsed=!0),e}shed(t){const e=this.selectedTest==="garden"&&this.gardenLevel.gate||dn;this.pressure.credit+=t*e.rate;const n=this.fluid,s=n.brain,r=n.particles.map((a,c)=>({p:a,i:c})).filter(({p:a,i:c})=>c!==n.brainIndex&&!n.coatIndices.includes(c)&&!a.feedstock&&a.component===s.component).sort((a,c)=>a.p.y-Math.hypot(a.p.x-s.x,a.p.z-s.z)*.35-(c.p.y-Math.hypot(c.p.x-s.x,c.p.z-s.z)*.35)),o=Math.min(Math.floor(this.pressure.credit),r.length);for(let a=0;a<o;a++){const c=r[a].p;c.feedstock=!0,c.shedLocked=!0,c.shedAt=n.time,delete c.patchId,this.pressure.shed++}this.pressure.credit-=o,r.length||(this.pressure.credit=0)}updatePressure(t){const e=this.pressure,n=this.fluid.radius,s=this.selectedTest==="garden"?this.gardenLevel.gate:dn,r=this.selectedTest==="garden"?this.gardenLevel.basin:ps,o=Ce(r.x,r.z,this.activeColliders()).height;e.weight=this.fluid.particles.filter(c=>(this.selectedTest!=="garden"||c.feedstock&&c.shedAt!==void 0)&&Math.hypot(c.x-r.x,c.z-r.z)<r.bottomRadius+.04&&c.y<o+n+.23).length,e.weight>=s.threshold?e.active=!0:e.weight<s.releaseThreshold&&(e.active=!1);let a=e.active?s.opening:0;a<e.opening&&this.fluid.particles.some(c=>Math.abs(c.x-(s.gateX??s.x))<(s.gateWidth??s.width)/2+n+.05&&c.z>(s.minZ??-2.3)-n&&c.z<(s.maxZ??2.3)+n&&c.y+n>(s.base??0)+a&&c.y-n<(s.base??0)+e.opening)&&(a=e.opening),e.opening+=zl(a-e.opening,-t*.65,t*.65),e.complete=this.selectedTest==="garden"?this.brain.x>s.x+.8:this.brain.x>dn.gateX+.8}activeColliders(){return this.selectedTest==="garden"?Ps(this.gardenLevel,this.pressure.opening):this.selectedTest==="pressure"?[sa,ps,{type:"roof",minX:dn.gateX-dn.gateWidth/2,maxX:dn.gateX+dn.gateWidth/2,minZ:-2.3,maxZ:2.3,bottom:this.pressure.opening,top:this.pressure.opening+dn.gateHeight},...[-1,1].map(t=>({type:"box",minX:1.25,maxX:1.75,minY:0,maxY:1.3,minZ:t<0?-4.3:2.3,maxZ:t<0?-2.3:4.3}))]:this.selectedTest==="gap"?[sa,...Px]:[sa]}step(t={},e=Fl){if(!(e>0))return this;if(this.selectedTest==="garden"&&!["playing","draining","arriving","settling"].includes(this.garden.phase))return this;if(e=zl(e,0,Fl),this.selectedTest==="garden"&&this.garden.phase==="arriving")return ra(this,e),this;if(this.selectedTest==="garden"&&this.garden.phase==="draining")return ra(this,e),this;const n=this.selectedTest==="garden"&&this.garden.phase==="settling";n&&(t={}),this.selectedTest==="garden"&&!n&&!this.gardenInputArmed&&(t.x||t.z||t.contract||t.shed||t.push||t.recallToggle?t={}:this.gardenInputArmed=!0);const s=this.selectedTest==="garden"&&!!this.gardenLevel.gate,r=this.selectedTest==="garden"&&!!this.gardenLevel.editorCanShed,o=(this.selectedTest==="pressure"||s||r)&&!!t.shed;o?(this.tendril.active&&this.tendril.release("released"),this.shed(e)):this.pressure.credit=0,t.recallToggle&&!o&&(this.selectedTest==="pressure"||this.selectedTest==="garden"&&Nl(this.gardenLevel))&&this.tendril.toggleRecall();const a=!!t.contract&&!o,c=this.activeColliders(),l=this.selectedTest==="gap"&&this.oozeForward?{x:1,z:0}:t,h=Math.hypot(l.x||0,l.z||0);if(this.tendril.prepare(e,a,c,h>0),this.emitGrowth(e),a?(this.materialState="contracting",this.relaxTime=1.5):this.relaxTime>0?(this.relaxTime=Math.max(0,this.relaxTime-e),this.materialState="relaxing"):this.materialState="oozing",this.fluid.step(e,{x:h?(l.x||0)/h:0,z:h?(l.z||0)/h:0,holdPosition:this.tendril.active?this.tendril.brainAnchor:null,push:!!t.push,shed:o,expireFragments:this.selectedTest==="pressure"||s||r||this.selectedTest==="garden"&&!!(this.gardenLevel.tendrils||this.gardenLevel.grip||this.gardenTendrilUsed),puddle:!0,growth:this.selectedTest!=="gap",contract:a},c,this.tendril.active?{controls:u=>this.tendril.controls(u),forces:(u,f,d)=>this.tendril.forces(u,f,d),solve:()=>this.tendril.solve()}:{}),this.tendril.finish(e,c),(this.selectedTest==="pressure"||s)&&this.updatePressure(e),o&&(this.materialState="shedding"),this.selectedTest==="growth"&&(this.growth.absorbed=Math.max(0,this.fluid.attachedCount-(Ne.seedCount-1)),this.growth.complete=this.fluid.attachedCount>=Ne.goal),this.selectedTest==="field"&&(this.field.absorbed=Math.max(0,this.fluid.attachedCount-(zi.seedCount-1)),this.field.loose=this.fluid.particles.filter(u=>u.feedstock).length),this.selectedTest==="gap"){const u=Ts.roof.maxX+this.fluid.radius+.04;this.brainThrough=this.brain.x>u,this.fleshThrough=this.fluid.particles.filter((f,d)=>d!==this.fluid.brainIndex&&f.x>u).length/Math.max(1,this.fluid.particles.length-1),this.gapStage=this.brainThrough&&this.fleshThrough>=.9?"through":this.brain.x>Ts.roof.minX-this.fluid.radius?"under":"approach",this.gapStage==="through"&&(this.oozeForward=!1)}return this.selectedTest==="garden"&&ra(this,e),this}}const $x="modulepreload",Jx=function(i){return"/puddle-study/"+i},Bl={},j1=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let o=function(l){return Promise.all(l.map(h=>Promise.resolve(h).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=o(e.map(l=>{if(l=Jx(l),l in Bl)return;Bl[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":$x,h||(f.as="script"),f.crossOrigin="",f.href=l,c&&f.setAttribute("nonce",c),document.head.appendChild(f),h)return new Promise((d,x)=>{f.addEventListener("load",d),f.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};function Q1(i,t="gem"){const e=new Ua(i,0),n=e.index?e.toNonIndexed():e;e!==n&&e.dispose();const s=n.attributes.position,r=new Float32Array(s.count*3),o=new L,a=new L,c=new L,l=new L;for(let h=0;h<s.count;h+=3){o.fromBufferAttribute(s,h),a.fromBufferAttribute(s,h+1),c.fromBufferAttribute(s,h+2),l.subVectors(a,o).cross(new L().subVectors(c,o)).normalize();const u=.83+.08*Math.sin(h*2.17),f=l.y>.4?1.08:l.y<-.4?.7:u,d=t==="gem"?[f*.97,f*.98,Math.min(1.18,f*1.08)]:[Math.min(1.2,f*1.09),f*.97,f*.68];for(let x=0;x<3;x++)r.set(d,h*3+x*3)}return n.setAttribute("color",new Jt(r,3)),n}function t_(i,t){const e=new Jr(i,i,t,48,1,!1),n=e.attributes.position,s=new Float32Array(n.count*3);for(let r=0;r<n.count;r++){const o=n.getX(r),a=n.getZ(r),c=Math.atan2(a,o),l=.5+.5*Math.cos(c*12),h=1-.047*l;n.setXYZ(r,o*h,n.getY(r),a*h);const u=r>=98,f=u?1.08:.82+.15*(1-l);s.set([f,f,f],r*3)}return e.setAttribute("color",new Jt(s,3)),e.computeVertexNormals(),e}function e_(i,t,e){const n=[],s=[],o=(g,M)=>n.push(...g,...M),a=(g,M,T)=>{for(let A=0;A<T;A++){if(A%7===4)continue;const E=w=>g.map((R,I)=>R+(M[I]-R)*w),b=E((A+.06)/T),S=E((A+.72)/T);if(o(b,S),A%6===0){const w=E((A+.45)/T);s.push(...w,w[0]+.025,w[1]-.016,w[2]-.022,w[0]+.061,w[1]-.003,w[2]+.014)}}},c=t.terrain,l=t.boundary,h=c.frontZ,u=c.upperHeight??c.frontHeight,f=c.stairs??c.leftStairs,d=(g,M)=>Ce(g,M,e).height+.025;for(const[g,M]of[[l.minX,f.minX],[f.maxX,l.maxX]])a([g,u+.025,h],[M,u+.025,h],Math.ceil((M-g)*3));for(const g of f.steps){const M=g.z+g.width,T=d((f.minX+f.maxX)/2,M);a([f.minX,T,M],[f.maxX,T,M],10)}if(c.startTier)for(const g of c.startTier.steps){const M=g.x+g.width,T=d(M,(c.startTier.minZ+c.startTier.maxZ)/2);a([M,T,c.startTier.minZ],[M,T,c.startTier.maxZ],12)}if(c.rightStairs){const g=c.rightStairs;for(const[M,T]of[[l.minX,g.minX],[g.maxX,l.maxX]])a([M,c.middleHeight+.025,c.rearZ],[T,c.middleHeight+.025,c.rearZ],Math.ceil((T-M)*3));for(const M of g.steps){const T=M.z+M.width,A=d((g.minX+g.maxX)/2,T);a([g.minX,A,T],[g.maxX,A,T],10)}}if(t.grip){const g=t.grip.platform,M=g.maxY+.024;a([g.minX,M,g.minZ],[g.maxX,M,g.minZ],14),a([g.minX,M,g.maxZ],[g.maxX,M,g.maxZ],14)}let x=t.id*19753+421;const v=()=>(x=Math.imul(x,1664525)+1013904223>>>0)/4294967296;for(let g=0;g<20;g++){const M=l.minX+.5+v()*(l.maxX-l.minX-1),T=l.minZ+.5+v()*(l.maxZ-l.minZ-1);if(Math.hypot(M-t.exit.x,T-t.exit.z)<1.3)continue;const A=.25+v()*.36,E=v()*Math.PI*2,b=Math.cos(E),S=Math.sin(E),w=[M+A*.56*b,T+A*.56*S],R=[M+A*b-.045*S,T+A*S+.045*b],I=d(M,T),U=d(...w),F=d(...R);if(Math.max(Math.abs(U-I),Math.abs(F-I))>.09)continue;const B=[M,I+.003,T],k=[w[0],U+.003,w[1]];if(o(B,k),o(k,[R[0],F+.003,R[1]]),g%3===0){const z=w[0]+A*.32*(b*.4-S*.92),X=w[1]+A*.32*(S*.4+b*.92),J=d(z,X);Math.abs(J-U)<.09&&o(k,[z,J+.003,X])}}const _=new xe;_.setAttribute("position",new Jt(n,3));const p=new Lu(_,new Ia({color:5333853,transparent:!0,opacity:.43,depthWrite:!1}));p.userData.stoneEdges=t.id,i.add(p);const y=new xe;y.setAttribute("position",new Jt(s,3)),y.computeVertexNormals();const m=new He(y,new Ra({color:10392968,side:2,transparent:!0,opacity:.33}));return m.userData.stoneChips=t.id,i.add(m),[p,m]}const Kx={floor:{pattern:"stone",scale:3.8,grain:.055,pore:.24,crack:.54,art:.84,space:"world"},wall:{pattern:"stone",scale:4.1,grain:.07,pore:.3,crack:.82,art:.9,space:"world"},violetStone:{pattern:"stone",scale:5.2,grain:.04,pore:.16,crack:.46,art:.43,space:"world"},lintel:{pattern:"stone",scale:3.8,grain:.035,pore:.16,crack:.43,art:.38,space:"world"},gem:{pattern:"gem",scale:1.15,grain:.02,pore:.07,crack:.48,space:"local"},gold:{pattern:"gold",scale:.6,grain:.015,pore:.03,crack:.39,space:"local"}};function jx(i){if(typeof document>"u"){const u=new Uint8Array(4096);let f=i==="stone"?385172:i==="gem"?58271:130217;for(let x=0;x<u.length;x+=4)f=Math.imul(f,1664525)+1013904223>>>0,u[x]=170+(f>>>27),u[x+1]=248,u[x+2]=248,u[x+3]=255;const d=new Ca(u,32,32,1023);return d.colorSpace="",d.wrapS=d.wrapT=1e3,d.minFilter=1008,d.magFilter=1006,d.generateMipmaps=!0,d.needsUpdate=!0,d}const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=512;const s=n.getContext("2d");let r=i==="stone"?385172:i==="gem"?58271:130217;const o=()=>(r=Math.imul(r,1664525)+1013904223>>>0)/4294967296,a=e.createImageData(512,512);for(let h=0;h<a.data.length;h+=4)a.data[h]=i==="stone"?170+Math.floor(o()*86):210+Math.floor(o()*46),a.data[h+1]=a.data[h+2]=a.data[h+3]=255;const c=(h,u)=>{s.clearRect(0,0,512,512),u();const f=s.getImageData(0,0,512,512).data;for(let d=0;d<f.length;d+=4)a.data[d+h]=255-f[d+3]};i==="stone"?(c(1,()=>{for(let h=0;h<58;h++){const u=o()*512,f=o()*512,d=2+Math.floor(o()*5);for(let x=0;x<d;x++)s.beginPath(),s.arc(u+(o()-.5)*22,f+(o()-.5)*18,1.4+o()*3.2,0,Math.PI*2),s.fillStyle=`rgba(0,0,0,${.45+o()*.35})`,s.fill()}}),c(2,()=>{for(let h=0;h<7;h++){let u=o()*512,f=o()*512;const d=2+Math.floor(o()*3),x=o()*Math.PI*2;s.beginPath(),s.moveTo(u,f);for(let v=0;v<d;v++){const _=10+o()*17;u+=Math.cos(x+(o()-.5)*.65)*_,f+=Math.sin(x+(o()-.5)*.65)*_,s.lineTo(u,f)}s.strokeStyle=`rgba(0,0,0,${.7+o()*.24})`,s.lineWidth=2.2+o()*1.4,s.stroke(),h%3===0&&(s.beginPath(),s.moveTo(u,f),s.lineTo(u+11,f+14),s.strokeStyle="rgba(0,0,0,.66)",s.lineWidth=1.8,s.stroke())}})):(c(2,()=>{const h=i==="gem"?11:6;for(let u=0;u<h;u++){const f=o()*512,d=o()*512,x=(i==="gem"?32:15)+o()*(i==="gem"?50:26);s.beginPath(),s.moveTo(f,d),s.lineTo(f+x,d-x*(.2+o()*.4)),s.strokeStyle=`rgba(0,0,0,${i==="gem"?.72:.65})`,s.lineWidth=i==="gem"?5.2:4,s.stroke()}}),i==="gem"&&c(1,()=>{for(let h=0;h<22;h++)s.beginPath(),s.arc(o()*512,o()*512,2+o()*2,0,Math.PI*2),s.fillStyle="rgba(0,0,0,.6)",s.fill()})),e.putImageData(a,0,0);const l=new Uu(t);return l.colorSpace="",l.wrapS=l.wrapT=1e3,l.minFilter=1008,l.magFilter=1006,l.generateMipmaps=!0,l.anisotropy=4,l}function n_(){const i=new Map;let t=!1;const e={value:null},n={value:0},s=r=>{if(t)throw new Error("Printed material library was disposed");return i.has(r)||i.set(r,jx(r)),i.get(r)};if(typeof Image<"u"){const r="/puddle-study/".replace(/\/?$/,"/");new Pf().load(`${r}art/textures/stone-ink-v1.png`,o=>{if(t){o.dispose();return}o.colorSpace=Ye,o.wrapS=o.wrapT=1002,o.minFilter=1008,o.magFilter=1006,o.generateMipmaps=!0,o.anisotropy=4,o.needsUpdate=!0,i.set("artStone",o),e.value=o,n.value=1},void 0,()=>{})}return{decorate(r,o){const a=Kx[o];if(!a)return r;const c=s(a.pattern),l=r.onBeforeCompile;a.pattern==="stone"&&!e.value&&(e.value=c);const h=r.customProgramCacheKey.bind(r);return r.onBeforeCompile=(u,f)=>{l.call(r,u,f),u.uniforms.printMask=a.pattern==="stone"?e:{value:c},u.uniforms.printArtReady=a.pattern==="stone"?n:{value:0};const d=a.space==="local"?"position":"(modelMatrix*vec4(position,1.0)).xyz",x=a.space==="local"?"normal":"mat3(modelMatrix)*normal";u.vertexShader=u.vertexShader.replace("void main() {",`varying vec3 vPrintPosition; varying vec3 vPrintNormal;
void main() {
 vPrintPosition=${d}; vPrintNormal=${x};`),u.fragmentShader=u.fragmentShader.replace("void main() {",`uniform sampler2D printMask; uniform float printArtReady; varying vec3 vPrintPosition; varying vec3 vPrintNormal;
void main() {`),u.fragmentShader=u.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
           vec3 printNormal=length(vPrintNormal)>0.0001?normalize(vPrintNormal):vec3(0.0,1.0,0.0);
           vec3 printWeight=pow(abs(printNormal),vec3(4.0));
           printWeight/=max(dot(printWeight,vec3(1.0)),0.0001);
           vec3 printP=vPrintPosition/${a.scale.toFixed(3)};
           vec3 printTone=texture2D(printMask,printP.yz).rgb*printWeight.x
             +texture2D(printMask,printP.xz).rgb*printWeight.y
             +texture2D(printMask,printP.xy).rgb*printWeight.z;
           float printInk=${a.grain.toFixed(3)}*(1.0-printTone.r)
             +${a.pore.toFixed(3)}*(1.0-printTone.g)
             +${a.crack.toFixed(3)}*(1.0-printTone.b);
           float artLuma=dot(printTone,vec3(0.30,0.59,0.11));
           float artInk=clamp((0.94-artLuma)*${(a.art??0).toFixed(3)},0.0,0.38);
           printInk=mix(printInk,artInk,printArtReady);
           diffuseColor.rgb*=1.0-clamp(printInk,0.0,0.6);`)},r.customProgramCacheKey=()=>`${h()}|print-v4:${o}:${a.space}`,r.userData.printRole=o,r.needsUpdate=!0,r},dispose(){if(!t){t=!0;for(const r of i.values())r.dispose();i.clear()}}}}class Qx extends He{constructor(t,e,n=!1,s=!1,r=1e4){const o=new xe;super(o,e),this.isMarchingCubes=!0;const a=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(y){this.resolution=y,this.isolation=80,this.size=y,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const m=r*3;this.positionArray=new Float32Array(m*3);const g=new ve(this.positionArray,3);g.setUsage(35048),o.setAttribute("position",g),this.normalArray=new Float32Array(m*3);const M=new ve(this.normalArray,3);if(M.setUsage(35048),o.setAttribute("normal",M),this.enableUvs){this.uvArray=new Float32Array(m*2);const T=new ve(this.uvArray,2);T.setUsage(35048),o.setAttribute("uv",T)}if(this.enableColors){this.colorArray=new Float32Array(m*3);const T=new ve(this.colorArray,3);T.setUsage(35048),o.setAttribute("color",T)}o.boundingSphere=new mn(new L,1)};function u(y,m,g){return y+(m-y)*g}function f(y,m,g,M,T,A,E,b,S,w){const R=(g-E)/(b-E),I=a.normal_cache;c[m+0]=M+R*a.delta,c[m+1]=T,c[m+2]=A,l[m+0]=u(I[y+0],I[y+3],R),l[m+1]=u(I[y+1],I[y+4],R),l[m+2]=u(I[y+2],I[y+5],R),h[m+0]=u(a.palette[S*3+0],a.palette[w*3+0],R),h[m+1]=u(a.palette[S*3+1],a.palette[w*3+1],R),h[m+2]=u(a.palette[S*3+2],a.palette[w*3+2],R)}function d(y,m,g,M,T,A,E,b,S,w){const R=(g-E)/(b-E),I=a.normal_cache;c[m+0]=M,c[m+1]=T+R*a.delta,c[m+2]=A;const U=y+a.yd*3;l[m+0]=u(I[y+0],I[U+0],R),l[m+1]=u(I[y+1],I[U+1],R),l[m+2]=u(I[y+2],I[U+2],R),h[m+0]=u(a.palette[S*3+0],a.palette[w*3+0],R),h[m+1]=u(a.palette[S*3+1],a.palette[w*3+1],R),h[m+2]=u(a.palette[S*3+2],a.palette[w*3+2],R)}function x(y,m,g,M,T,A,E,b,S,w){const R=(g-E)/(b-E),I=a.normal_cache;c[m+0]=M,c[m+1]=T,c[m+2]=A+R*a.delta;const U=y+a.zd*3;l[m+0]=u(I[y+0],I[U+0],R),l[m+1]=u(I[y+1],I[U+1],R),l[m+2]=u(I[y+2],I[U+2],R),h[m+0]=u(a.palette[S*3+0],a.palette[w*3+0],R),h[m+1]=u(a.palette[S*3+1],a.palette[w*3+1],R),h[m+2]=u(a.palette[S*3+2],a.palette[w*3+2],R)}function v(y){const m=y*3;a.normal_cache[m]===0&&(a.normal_cache[m+0]=a.field[y-1]-a.field[y+1],a.normal_cache[m+1]=a.field[y-a.yd]-a.field[y+a.yd],a.normal_cache[m+2]=a.field[y-a.zd]-a.field[y+a.zd])}function _(y,m,g,M,T){const A=M+1,E=M+a.yd,b=M+a.zd,S=A+a.yd,w=A+a.zd,R=M+a.yd+a.zd,I=A+a.yd+a.zd;let U=0;const F=a.field[M],B=a.field[A],k=a.field[E],z=a.field[S],X=a.field[b],J=a.field[w],rt=a.field[R],mt=a.field[I];F<T&&(U|=1),B<T&&(U|=2),k<T&&(U|=8),z<T&&(U|=4),X<T&&(U|=16),J<T&&(U|=32),rt<T&&(U|=128),mt<T&&(U|=64);const _t=t1[U];if(_t===0)return 0;const At=a.delta,Rt=y+At,$=m+At,Q=g+At;_t&1&&(v(M),v(A),f(M*3,0,T,y,m,g,F,B,M,A)),_t&2&&(v(A),v(S),d(A*3,3,T,Rt,m,g,B,z,A,S)),_t&4&&(v(E),v(S),f(E*3,6,T,y,$,g,k,z,E,S)),_t&8&&(v(M),v(E),d(M*3,9,T,y,m,g,F,k,M,E)),_t&16&&(v(b),v(w),f(b*3,12,T,y,m,Q,X,J,b,w)),_t&32&&(v(w),v(I),d(w*3,15,T,Rt,m,Q,J,mt,w,I)),_t&64&&(v(R),v(I),f(R*3,18,T,y,$,Q,rt,mt,R,I)),_t&128&&(v(b),v(R),d(b*3,21,T,y,m,Q,X,rt,b,R)),_t&256&&(v(M),v(b),x(M*3,24,T,y,m,g,F,X,M,b)),_t&512&&(v(A),v(w),x(A*3,27,T,Rt,m,g,B,J,A,w)),_t&1024&&(v(S),v(I),x(S*3,30,T,Rt,$,g,z,mt,S,I)),_t&2048&&(v(E),v(R),x(E*3,33,T,y,$,g,k,rt,E,R)),U<<=4;let ft,Tt,vt,Bt=0,Ot=0;for(;Nr[U+Ot]!=-1;)ft=U+Ot,Tt=ft+1,vt=ft+2,p(c,l,h,3*Nr[ft],3*Nr[Tt],3*Nr[vt]),Ot+=3,Bt++;return Bt}function p(y,m,g,M,T,A){const E=a.count*3;if(a.positionArray[E+0]=y[M],a.positionArray[E+1]=y[M+1],a.positionArray[E+2]=y[M+2],a.positionArray[E+3]=y[T],a.positionArray[E+4]=y[T+1],a.positionArray[E+5]=y[T+2],a.positionArray[E+6]=y[A],a.positionArray[E+7]=y[A+1],a.positionArray[E+8]=y[A+2],a.material.flatShading===!0){const b=(m[M+0]+m[T+0]+m[A+0])/3,S=(m[M+1]+m[T+1]+m[A+1])/3,w=(m[M+2]+m[T+2]+m[A+2])/3;a.normalArray[E+0]=b,a.normalArray[E+1]=S,a.normalArray[E+2]=w,a.normalArray[E+3]=b,a.normalArray[E+4]=S,a.normalArray[E+5]=w,a.normalArray[E+6]=b,a.normalArray[E+7]=S,a.normalArray[E+8]=w}else a.normalArray[E+0]=m[M+0],a.normalArray[E+1]=m[M+1],a.normalArray[E+2]=m[M+2],a.normalArray[E+3]=m[T+0],a.normalArray[E+4]=m[T+1],a.normalArray[E+5]=m[T+2],a.normalArray[E+6]=m[A+0],a.normalArray[E+7]=m[A+1],a.normalArray[E+8]=m[A+2];if(a.enableUvs){const b=a.count*2;a.uvArray[b+0]=y[M+0],a.uvArray[b+1]=y[M+2],a.uvArray[b+2]=y[T+0],a.uvArray[b+3]=y[T+2],a.uvArray[b+4]=y[A+0],a.uvArray[b+5]=y[A+2]}a.enableColors&&(a.colorArray[E+0]=g[M+0],a.colorArray[E+1]=g[M+1],a.colorArray[E+2]=g[M+2],a.colorArray[E+3]=g[T+0],a.colorArray[E+4]=g[T+1],a.colorArray[E+5]=g[T+2],a.colorArray[E+6]=g[A+0],a.colorArray[E+7]=g[A+1],a.colorArray[E+8]=g[A+2]),a.count+=3}this.addBall=function(y,m,g,M,T,A){const E=Math.sign(M);M=Math.abs(M);const b=A!=null;let S=new Xt(y,m,g);if(b)try{S=A instanceof Xt?A:Array.isArray(A)?new Xt(Math.min(Math.abs(A[0]),1),Math.min(Math.abs(A[1]),1),Math.min(Math.abs(A[2]),1)):new Xt(A)}catch{S=new Xt(y,m,g)}const w=this.size*Math.sqrt(M/T),R=g*this.size,I=m*this.size,U=y*this.size;let F=Math.floor(R-w);F<1&&(F=1);let B=Math.floor(R+w);B>this.size-1&&(B=this.size-1);let k=Math.floor(I-w);k<1&&(k=1);let z=Math.floor(I+w);z>this.size-1&&(z=this.size-1);let X=Math.floor(U-w);X<1&&(X=1);let J=Math.floor(U+w);J>this.size-1&&(J=this.size-1);let rt,mt,_t,At,Rt,$,Q,ft,Tt,vt,Bt;for(_t=F;_t<B;_t++)for(Rt=this.size2*_t,ft=_t/this.size-g,Tt=ft*ft,mt=k;mt<z;mt++)for(At=Rt+this.size*mt,Q=mt/this.size-m,vt=Q*Q,rt=X;rt<J;rt++)if($=rt/this.size-y,Bt=M/(1e-6+$*$+vt+Tt)-T,Bt>0){this.field[At+rt]+=Bt*E;const Ot=Math.sqrt((rt-U)*(rt-U)+(mt-I)*(mt-I)+(_t-R)*(_t-R))/w,N=1-Ot*Ot*Ot*(Ot*(Ot*6-15)+10);this.palette[(At+rt)*3+0]+=S.r*N,this.palette[(At+rt)*3+1]+=S.g*N,this.palette[(At+rt)*3+2]+=S.b*N}},this.addPlaneX=function(y,m){const g=this.size,M=this.yd,T=this.zd,A=this.field;let E,b,S,w,R,I,U,F=g*Math.sqrt(y/m);for(F>g&&(F=g),E=0;E<F;E++)if(I=E/g,w=I*I,R=y/(1e-4+w)-m,R>0)for(b=0;b<g;b++)for(U=E+b*M,S=0;S<g;S++)A[T*S+U]+=R},this.addPlaneY=function(y,m){const g=this.size,M=this.yd,T=this.zd,A=this.field;let E,b,S,w,R,I,U,F,B=g*Math.sqrt(y/m);for(B>g&&(B=g),b=0;b<B;b++)if(I=b/g,w=I*I,R=y/(1e-4+w)-m,R>0)for(U=b*M,E=0;E<g;E++)for(F=U+E,S=0;S<g;S++)A[T*S+F]+=R},this.addPlaneZ=function(y,m){const g=this.size,M=this.yd,T=this.zd,A=this.field;let E,b,S,w,R,I,U,F,B=g*Math.sqrt(y/m);for(B>g&&(B=g),S=0;S<B;S++)if(I=S/g,w=I*I,R=y/(1e-4+w)-m,R>0)for(U=T*S,b=0;b<g;b++)for(F=U+b*M,E=0;E<g;E++)A[F+E]+=R},this.setCell=function(y,m,g,M){const T=this.size2*g+this.size*m+y;this.field[T]=M},this.getCell=function(y,m,g){const M=this.size2*g+this.size*m+y;return this.field[M]},this.blur=function(y=1){const m=this.field,g=m.slice(),M=this.size,T=this.size2;for(let A=0;A<M;A++)for(let E=0;E<M;E++)for(let b=0;b<M;b++){const S=T*b+M*E+A;let w=g[S],R=1;for(let I=-1;I<=1;I+=2){const U=I+A;if(!(U<0||U>=M))for(let F=-1;F<=1;F+=2){const B=F+E;if(!(B<0||B>=M))for(let k=-1;k<=1;k+=2){const z=k+b;if(z<0||z>=M)continue;const X=T*z+M*B+U,J=g[X];R++,w+=y*(J-w)/R}}}m[S]=w}},this.reset=function(){for(let y=0;y<this.size3;y++)this.normal_cache[y*3]=0,this.field[y]=0,this.palette[y*3]=this.palette[y*3+1]=this.palette[y*3+2]=0},this.update=function(){this.count=0;const y=this.size-2;for(let m=1;m<y;m++){const g=this.size2*m,M=(m-this.halfsize)/this.halfsize;for(let T=1;T<y;T++){const A=g+this.size*T,E=(T-this.halfsize)/this.halfsize;for(let b=1;b<y;b++){const S=(b-this.halfsize)/this.halfsize,w=A+b;_(S,E,M,w,this.isolation)}}}this.geometry.setDrawRange(0,this.count),o.getAttribute("position").needsUpdate=!0,o.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(o.getAttribute("uv").needsUpdate=!0),this.enableColors&&(o.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const t1=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Nr=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function e1(i,t=48){const e=new Qx(t,i,!1,!1,22e3);e.isolation=.72,e.frustumCulled=!1;const n=t,s=e.field;let r=null;function o(a,c,l=.067,{maskTerrain:h=!0}={}){const u=JSON.stringify(c.map(z=>z.type==="editor-solid-mesh"?{type:z.type,revision:z.revision}:z));if(r&&r.radius===l&&r.maskTerrain===h&&r.colliderKey===u&&r.particles.length===a.length&&a.every((z,X)=>z===r.particles[X]&&z.x===r.coords[X*3]&&z.y===r.coords[X*3+1]&&z.z===r.coords[X*3+2]))return;const d=new Float64Array(a.length*3);for(let z=0;z<a.length;z++){const X=a[z];d[z*3]=X.x,d[z*3+1]=X.y,d[z*3+2]=X.z}if(r={radius:l,maskTerrain:h,colliderKey:u,particles:[...a],coords:d},!a.length){e.reset(),e.update();return}const x=Math.max(.21,l*3.4);let v=1/0,_=-1/0,p=1/0,y=-1/0,m=1/0,g=-1/0;for(const z of a)v=Math.min(v,z.x),_=Math.max(_,z.x),p=Math.min(p,z.y),y=Math.max(y,z.y),m=Math.min(m,z.z),g=Math.max(g,z.z);const M=x+.1,T=Math.max(.55,(_-v)/2+M),A=Math.max(.42,(y-p)/2+M),E=Math.max(.55,(g-m)/2+M),b=(v+_)/2,S=(p+y)/2,w=(m+g)/2;e.position.set(b,S,w),e.scale.set(T,A,E),e.reset();const R=(z,X,J)=>Math.floor(((z-X)/J+1)*n/2),I=2*T/n,U=2*A/n,F=2*E/n,B=x*x;for(const z of a){const X=Math.max(1,R(z.x-x,b,T)),J=Math.min(n-2,R(z.x+x,b,T)+1),rt=Math.max(1,R(z.y-x,S,A)),mt=Math.min(n-2,R(z.y+x,S,A)+1),_t=Math.max(1,R(z.z-x,w,E)),At=Math.min(n-2,R(z.z+x,w,E)+1);for(let Rt=_t;Rt<=At;Rt++){const $=w-E+Rt*F-z.z,Q=$*$;if(!(Q>=B))for(let ft=rt;ft<=mt;ft++){const Tt=S-A+ft*U-z.y,vt=Q+Tt*Tt;if(vt>=B)continue;const Bt=Rt*n*n+ft*n;for(let Ot=X;Ot<=J;Ot++){const N=b-T+Ot*I-z.x,it=1-(vt+N*N)/B;it>0&&(s[Bt+Ot]+=it*it)}}}}const k=h?new Float64Array(n*n).fill(NaN):null;for(let z=1;z<n-1;z++)for(let X=1;X<n-1;X++)for(let J=1;J<n-1;J++){const rt=z*n*n+X*n+J;if(s[rt]<e.isolation*.2)continue;const mt=b-T+J*I,_t=S-A+X*U,At=w-E+z*F;let Rt=!1;if(h){const $=z*n+J;let Q=k[$];Number.isNaN(Q)&&(Q=Ce(mt,At,c).height,k[$]=Q),Rt=_t<Q+.01}(Rt||Lx(mt,_t,At,c,.012))&&(s[rt]=0)}e.update()}return{mesh:e,update:o}}const n1=()=>new Worker(new URL("/puddle-study/assets/particle-surface-worker-BPFC8hx_.js",import.meta.url),{type:"module"});function i_({createWorker:i=typeof Worker>"u"?null:n1}={}){const t=new Map,e=new Map;let n=null,s=!i,r=null,o=0,a=1,c=1,l=0;const h=new Set,u={completed:0,bodyCompleted:0,discarded:0,failed:0,buildMs:0,lastAgeMs:0,bodyAgeMs:0,bodyBuildMs:0};function f(){if(!s){if(s=!0,n?.terminate(),n=null,r&&r.generation===o){const p=t.get(r.surfaceId);p&&p.sync.update(r.particles,r.originalColliders,r.radius,{maskTerrain:r.maskTerrain})}r=null;for(const[p,y]of e){const m=t.get(p);m&&m.sync.update(y.particles,y.originalColliders,y.radius,{maskTerrain:y.maskTerrain})}for(const p of t.values())p.completedCentroid=null,p.completedPosition=null;e.clear()}}if(!s)try{n=i(),n.onmessage=({data:p})=>{if(!r||p.id!==r.id)return;const y=r;if(p.error){u.failed++,f();return}if(r=null,p.generation!==o||!t.has(p.surfaceId))u.discarded++;else{const m=t.get(p.surfaceId),g=m.mesh,M=g.geometry.attributes.position,T=g.geometry.attributes.normal;M.array.set(p.positions,0),T.array.set(p.normals,0),M.clearUpdateRanges(),T.clearUpdateRanges(),M.addUpdateRange(0,p.count*3),T.addUpdateRange(0,p.count*3),M.needsUpdate=!0,T.needsUpdate=!0,g.count=p.count,g.geometry.setDrawRange(0,p.count),g.position.fromArray(p.position),g.scale.fromArray(p.scale),m.completedCentroid=y.centroid,m.completedPosition=p.position,m.completedAt=performance.now(),u.completed++,u.buildMs=p.buildMs,u.lastAgeMs=m.completedAt-y.queuedAt,m.priority===0&&(u.bodyCompleted++,u.bodyAgeMs=u.lastAgeMs,u.bodyBuildMs=p.buildMs)}d()},n.onerror=()=>{u.failed++,f()},n.onmessageerror=()=>{u.failed++,f()}}catch{f()}function d(){if(s||r||!e.size)return;const p=[...e.values()].sort((m,g)=>m.priority-g.priority||m.queuedAt-g.queuedAt),y=l>=4&&p.some(m=>m.priority>0)?p.find(m=>m.priority>0):p[0];l=y.priority===0?l+1:0,e.delete(y.surfaceId),r=y;try{n.postMessage({type:"build",id:y.id,generation:y.generation,surfaceId:y.surfaceId,resolution:y.resolution,coords:y.coords,colliders:y.colliders,radius:y.radius,maskTerrain:y.maskTerrain,sentAt:performance.now()},[y.coords.buffer])}catch{u.failed++,f()}}function x(p,y=48,{priority:m=1}={}){const g=e1(p,y),M=c++,T={mesh:g.mesh,sync:g,completedCentroid:null,completedPosition:null,completedAt:0,priority:m,update(A,E,b=.067,{maskTerrain:S=!0}={}){if(s){g.update(A,E,b,{maskTerrain:S});return}const w=E.map(X=>X.type==="editor-solid-mesh"?{type:X.type,revision:X.revision}:X),R=JSON.stringify(w),I=T.previous;if(I&&I.radius===b&&I.maskTerrain===S&&I.colliderKey===R&&I.particles.length===A.length&&A.every((X,J)=>X===I.particles[J]&&X.x===I.coords[J*3]&&X.y===I.coords[J*3+1]&&X.z===I.coords[J*3+2]))return;const U=new Float64Array(A.length*3);let F=0,B=0,k=0;for(let X=0;X<A.length;X++){const J=A[X];U[X*3]=J.x,U[X*3+1]=J.y,U[X*3+2]=J.z,F+=J.x,B+=J.y,k+=J.z}const z=A.length||1;T.previous={radius:b,maskTerrain:S,colliderKey:R,particles:[...A],coords:U.slice()};for(const X of E)if(X.type==="editor-solid-mesh"&&!h.has(X.revision)){h.add(X.revision);const J=X.vertices.slice(),rt=X.indices.slice();try{n.postMessage({type:"register-solid",revision:X.revision,vertices:J,indices:rt},[J.buffer,rt.buffer])}catch{u.failed++,f();return}}e.set(M,{id:a++,generation:o,surfaceId:M,resolution:y,coords:U,colliders:w,originalColliders:E,radius:b,maskTerrain:S,priority:m,queuedAt:performance.now(),centroid:{x:F/z,y:B/z,z:k/z},particles:A}),d()},dispose(){e.delete(M),t.delete(M),g.mesh.geometry.dispose()}};return t.set(M,T),T}function v(){if(o++,e.clear(),l=0,h.clear(),n&&!s)try{n.postMessage({type:"clear-solids"})}catch{u.failed++,f()}for(const p of t.values())p.previous=null,p.completedCentroid=null,p.completedPosition=null,p.mesh.count=0,p.mesh.geometry.setDrawRange(0,0)}function _(){o++,e.clear(),n?.terminate(),n=null;for(const p of[...t.values()])p.dispose();t.clear(),s=!0}return{create:x,invalidate:v,dispose:_,stats:u,get workerEnabled(){return!s},get pendingCount(){return e.size+(r?1:0)}}}class s_{constructor(t,e=220){this.onTap=t,this.threshold=e,this.cancel()}down(t,e){this.sources.has(t)||(this.sources.size||(this.started=e,this.holding=!1),this.sources.add(t))}update(t){return this.sources.size&&t-this.started>=this.threshold&&(this.holding=!0),this.sources.size>0&&this.holding}up(t,e){this.sources.has(t)&&(this.update(e),this.sources.delete(t),this.sources.size||(this.holding||this.onTap(),this.holding=!1))}cancelSource(t){this.sources.delete(t)&&(this.sources.size||(this.started=0,this.holding=!1))}cancel(){this.sources=new Set,this.started=0,this.holding=!1}}function r_(i,t,e,n,s){return i==="gap"?{x:t,z:-e}:{x:n.x*t+s.x*e,z:n.z*t+s.z*e}}function o_(){const i=document.querySelector("#soundtrack"),t=document.querySelector("#music-toggle"),e=document.querySelector("#music-volume"),n=document.querySelector("#music-status");i.src="/puddle-study/audio/soft-signal.mp3",i.volume=Number(e.value)/100;let s=!1,r=0,o=!1;function a(x){t.textContent=s?"MUSIC ON":"MUSIC OFF",t.setAttribute("aria-pressed",String(s)),n.textContent=x||(s?"Soft Signal · playing":"Soft Signal · tap to listen")}async function c(){const x=++r;a("Soft Signal · loading");try{if(i.error&&i.load(),await i.play(),x!==r){(!s||document.hidden)&&i.pause();return}a()}catch{if(x!==r)return;s=!1,i.pause(),a("Tap Music to retry playback")}}function l(){o=!0,s=!s,s?c():(r++,i.pause(),a())}function h(){i.volume=Number(e.value)/100}function u(){document.hidden?(r++,i.pause(),s&&a("Soft Signal · paused while away")):s&&c()}function f(){r++,s=!1,i.pause(),a("Music unavailable · tap to retry")}t.addEventListener("click",l),e.addEventListener("input",h),document.addEventListener("visibilitychange",u),i.addEventListener("error",f),a();const d=()=>{r++,s=!1,i.pause(),t.removeEventListener("click",l),e.removeEventListener("input",h),document.removeEventListener("visibilitychange",u),i.removeEventListener("error",f)};return d.begin=()=>{o||(s=!0),s&&i.paused&&c()},d}function a_(){let i=null,t=null,e=!0,n=null,s=new Set;const r=document.createElement("button");r.id="effects-toggle",r.title="Pickup sounds",r.textContent="SOUND ON",r.setAttribute("aria-pressed","true"),document.querySelector(".music-controls").append(r);function o(){const h=window.AudioContext||window.webkitAudioContext;h&&(i||(i=new h,t=i.createGain(),t.gain.value=e?1:0,t.connect(i.destination)),i.state==="suspended"&&i.resume().catch(()=>{}))}function a(){e=!e,r.textContent=e?"SOUND ON":"SOUND OFF",r.setAttribute("aria-pressed",String(e)),e&&o(),t&&t.gain.setValueAtTime(e?1:0,i.currentTime)}r.addEventListener("click",a);function c(h,u,f,d,x=1){const v=i.createOscillator(),_=i.createGain();v.type="sine",v.frequency.setValueAtTime(h*x,u),v.frequency.exponentialRampToValueAtTime(h,u+.065),_.gain.setValueAtTime(0,u),_.gain.linearRampToValueAtTime(d,u+.012),_.gain.exponentialRampToValueAtTime(1e-4,u+f),v.connect(_),_.connect(t),v.start(u),v.stop(u+f+.025),v.onended=()=>{v.disconnect(),_.disconnect()}}function l(h,u,f){if(!e||!i||i.state!=="running"||document.hidden)return;const d=i.currentTime+f,x=[587.33,880,932.33,659.25,587.33];if(h==="gold"){const v=x[u%x.length];c(v,d,.2,.045,1.18),c(v/2,d,.12,.022,.7)}else[293.66,440,466.16,659.25,587.33].forEach((v,_)=>c(v,d+_*.065,.55,.04,1.025)),c(146.83,d,.42,.035,.65)}return{unlock:o,update(h){if(h!==n&&(n=h,s=new Set),!h)return;let u=0;for(const[f,d]of[["gold",h.gold],["gem",h.gems]])for(const x of d){const v=`${f}-${x.id}`;x.collected&&!s.has(v)&&(s.add(v),h.elapsed-x.collectedAt<.3&&(l(f,x.id,u),u+=.035))}},dispose(){r.removeEventListener("click",a),r.remove(),i&&i.close()}}}const i1="puddle.local-levels.v1",s1="puddle.local-progress.v1",r1=["puddle-level-workshop-v3","puddle-level-workshop-v2","puddle-level-workshop-v1"],_s=i=>JSON.parse(JSON.stringify(i)),Xa=()=>{try{return globalThis.localStorage}catch{return null}};function c_(i=globalThis.location?.search||""){const t=new URLSearchParams(i),e=t.get("storage");if(e==="memory")return null;const n=Xa();if(e!=="test")return n;const s=(t.get("session")||"local-level-qa").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,60);return n?{getItem:r=>n.getItem(`puddle.test.${s}.${r}`),setItem:(r,o)=>n.setItem(`puddle.test.${s}.${r}`,o),removeItem:r=>n.removeItem(`puddle.test.${s}.${r}`)}:null}function l_(i=globalThis.location?.search||""){const t=new URLSearchParams(i);return t.get("storage")==="test"?`?storage=test&session=${encodeURIComponent(t.get("session")||"local-level-qa")}`:t.get("storage")==="memory"?"?storage=memory":""}const o1=()=>globalThis.crypto?.randomUUID?.()||`local-${Date.now()}-${Math.random().toString(36).slice(2)}`,a1=i=>i&&typeof i.id=="string"&&i.id.length>0&&typeof i.document=="string"&&Number.isInteger(i.revision)&&i.revision>0&&typeof i.name=="string",oa=i=>{const t=JSON.parse(i);if(t?.format!=="puddle-level"||![1,2,3].includes(t.version))throw new Error("Save a Puddle workshop level.");const e=t.draft||t.level;if(!e||typeof e!="object")throw new Error("The level has no source draft.");const n=String(e.name||"Untitled garden").trim().slice(0,60)||"Untitled garden",s=_s(e);return delete s.name,Array.isArray(s.objects)&&(s.objects=s.objects.filter(r=>r.kind!=="label")),delete s.nextObjectId,{name:n,fingerprint:JSON.stringify({version:t.version,gameplay:s})}};function h_({storage:i=Xa(),key:t=i1,legacyKeys:e=r1,idFactory:n=o1,now:s=()=>Date.now()}={}){let r={version:1,migratedDraft:!1,entries:[]},o="";const a=()=>{try{const l=i?.getItem(t);if(!l||l===o)return;const h=JSON.parse(l);if(h?.version===1&&Array.isArray(h.entries)){const u=new Set;r={version:1,migratedDraft:!!h.migratedDraft,entries:h.entries.filter(f=>!a1(f)||u.has(f.id)?!1:(u.add(f.id),!0))},o=l}}catch{}},c=()=>{const l=JSON.stringify(r);if(l===o)return!0;try{return i?.setItem(t,l),i&&(o=l),!!i}catch{return!1}};if(a(),!r.migratedDraft){let l=null;try{for(const h of e)if(l=i?.getItem(h),l)break}catch{}if(l)try{const h=oa(l),u=s();r.entries.push({id:n(),name:h.name,createdAt:u,updatedAt:u,revision:1,document:l}),r.migratedDraft=!0,c()}catch{}else r.migratedDraft=!0,c()}return{list(){return a(),r.entries.map(l=>_s(l)).sort((l,h)=>h.updatedAt-l.updatedAt||l.name.localeCompare(h.name))},get(l){a();const h=r.entries.find(u=>u.id===l);return h?_s(h):null},save(l,{id:h=null,asNew:u=!1}={}){const f=oa(l);a();const d=s(),x=!u&&h?r.entries.find(_=>_.id===h):null;if(h&&!u&&!x)throw new Error("That local level no longer exists. Save as new instead.");if(x){const _=oa(x.document);if(x.revision+=+(_.fingerprint!==f.fingerprint),x.name=f.name,x.updatedAt=d,x.document=l,!c())throw new Error("Local storage is unavailable; export JSON instead.");return _s(x)}const v={id:n(),name:f.name,createdAt:d,updatedAt:d,revision:1,document:l};for(;r.entries.some(_=>_.id===v.id);)v.id=n();if(r.entries.push(v),!c())throw new Error("Local storage is unavailable; export JSON instead.");return _s(v)},refresh(){return a(),this.list()}}}function u_({storage:i=Xa(),key:t=s1}={}){let e={};try{const o=JSON.parse(i?.getItem(t)||"null");o?.version===1&&o.best&&typeof o.best=="object"&&(e=o.best)}catch{}let n=!1;const s=o=>{const{gold:a,gems:c,totalGold:l,totalGems:h}=o||{};if(![a,c,l,h].every(f=>Number.isInteger(f)&&f>=0)||a>l||c>h)return null;const u=l+h;return u?Math.round((a+c)/u*100):100},r=(o,a)=>`${o}:${a}`;return{get saveFailed(){return n},getBest(o,a){const c=e[r(o,a)];return s(c)===null?null:{...c,percent:s(c)}},recordCompletion(o,a,c){if(!o||!Number.isInteger(a)||a<1||s(c)===null)return!1;const l=r(o,a),h=e[l];if(h&&s(h)>=s(c))return!1;e[l]={gold:c.gold,gems:c.gems,totalGold:c.totalGold,totalGems:c.totalGems};try{if(!i?.setItem)throw new Error("storage unavailable");return i.setItem(t,JSON.stringify({version:1,best:e})),n=!1,!0}catch{return n=!0,!1}}}}class f_{constructor({onDoubleTap:t=()=>{},onChange:e=()=>{},deadzone:n=10,radius:s=48,tapMs:r=220,doubleMs:o=300,tapDistance:a=28}={}){Object.assign(this,{onDoubleTap:t,onChange:e,deadzone:n,radius:s,tapMs:r,doubleMs:o,tapDistance:a}),this.cancel()}down(t,e,n,s){return this.touches.has(t)?!1:(this.touches.set(t,{x:e,y:n,startX:e,startY:n,started:s,dragged:!1}),this.owner===null&&(this.owner=t,this.origin={x:e,y:n},this.vector={x:0,y:0},this.onChange(this)),!0)}move(t,e,n){const s=this.touches.get(t);if(!s||(s.x=e,s.y=n,Math.hypot(e-s.startX,n-s.startY)>this.deadzone&&(s.dragged=!0),t!==this.owner))return;const r=e-this.origin.x,o=n-this.origin.y,a=Math.hypot(r,o);this.vector=a<=this.deadzone?{x:0,y:0}:{x:r/a,y:o/a},this.onChange(this)}up(t,e,n,s){const r=this.touches.get(t);if(r){if(this.move(t,e,n),this.touches.delete(t),t===this.owner&&(this.owner=null,this.vector={x:0,y:0},this.onChange(this)),r.dragged||s-r.started>this.tapMs){this.lastTap=null;return}this.lastTap&&s-this.lastTap.time<=this.doubleMs&&Math.hypot(e-this.lastTap.x,n-this.lastTap.y)<=this.tapDistance?(this.lastTap=null,this.onDoubleTap(e,n)):this.lastTap={x:e,y:n,time:s}}}cancel(t){if(t===void 0)this.touches=new Map,this.owner=null,this.origin=null,this.vector={x:0,y:0},this.lastTap=null;else{if(!this.touches.has(t))return;this.touches.delete(t),this.owner===t&&(this.owner=null,this.origin=null,this.vector={x:0,y:0}),this.lastTap=null}this.onChange(this)}}function d_(i,t){const e=new Set;i.addEventListener("pointerdown",n=>{t()&&(n.preventDefault(),e.add(n.pointerId),i.setPointerCapture(n.pointerId))});for(const n of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(n,s=>e.delete(s.pointerId));return{get active(){return e.size>0},clear(){e.clear()}}}function p_(i,t,e,n=()=>performance.now()){const s=new Set,r=o=>`pointer-${o}`;i.addEventListener("pointerdown",o=>{e()&&(o.preventDefault(),s.add(o.pointerId),t.down(r(o.pointerId),n()),i.setPointerCapture(o.pointerId))}),i.addEventListener("pointerup",o=>{s.delete(o.pointerId)&&(e()?t.up(r(o.pointerId),n()):t.cancelSource(r(o.pointerId)))});for(const o of["pointercancel","lostpointercapture"])i.addEventListener(o,a=>{s.delete(a.pointerId)&&t.cancelSource(r(a.pointerId))});return{clear(){for(const o of s)t.cancelSource(r(o));s.clear()}}}export{Wa as $,Uc as A,Is as B,Xt as C,Fl as D,hh as E,xe as F,Qs as G,Jt as H,Ia as I,e_ as J,$l as K,Lu as L,Ra as M,t_ as N,L1 as O,$e as P,Jr as Q,W1 as R,A1 as S,f_ as T,jl as U,L as V,X1 as W,Q1 as X,fh as Y,h1 as Z,Ch as _,l_ as a,u_ as a$,jr as a0,Ta as a1,ve as a2,S1 as a3,T1 as a4,b1 as a5,Ls as a6,G1 as a7,z1 as a8,D1 as a9,P1 as aA,I1 as aB,_h as aC,Yl as aD,F1 as aE,Au as aF,v1 as aG,M1 as aH,ql as aI,Le as aJ,Zr as aK,Xr as aL,to as aM,Qt as aN,c1 as aO,Qr as aP,Ie as aQ,mn as aR,wn as aS,zx as aT,Bx as aU,uh as aV,l1 as aW,Fu as aX,mh as aY,Nl as aZ,Dx as a_,Hi as aa,O1 as ab,V1 as ac,k1 as ad,Ht as ae,C1 as af,Yi as ag,Tc as ah,ge as ai,Pf as aj,H1 as ak,w1 as al,y1 as am,g1 as an,_1 as ao,m1 as ap,x1 as aq,p1 as ar,u1 as as,d1 as at,f1 as au,Du as av,qn as aw,mf as ax,re as ay,R1 as az,Ye as b,j1 as b0,K1 as b1,ps as b2,dn as b3,Ts as b4,Ne as b5,U1 as b6,B1 as b7,zi as b8,N1 as b9,Rn as ba,q1 as bb,Ds as bc,Ua as bd,Ql as be,Z1 as bf,Wn as bg,Zx as bh,Us as bi,h_ as c,n_ as d,dh as e,ph as f,He as g,i_ as h,a_ as i,s_ as j,p_ as k,c_ as l,d_ as m,at as n,En as o,Ce as p,Ps as q,r_ as r,o_ as s,E1 as t,Y1 as u,J1 as v,$1 as w,Vr as x,tn as y,rh as z};
