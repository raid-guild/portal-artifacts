/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const D1=0,U1=1,N1=2;const xc="attached",jh="detached";const F1=1e3,z1=1001,B1=1002,O1=1003,k1=1004,V1=1005,G1=1006,H1=1007,X1=1008;const W1=2300,Z1=2301;const Y1=0,q1=1,$1=2;const Je="srgb",Qi="srgb-linear",jr="linear",re="srgb";const _c="300 es";class ss{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yc=1234567;const Ji=Math.PI/180,ts=180/Math.PI;function rn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Wt(i,t,e){return Math.max(t,Math.min(e,i))}function Wa(i,t){return(i%t+t)%t}function Qh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function tu(i,t,e){return i!==t?(e-i)/(t-i):0}function Is(i,t,e){return(1-e)*i+e*t}function eu(i,t,e,n){return Is(i,t,1-Math.exp(-e*n))}function nu(i,t=1){return t-Math.abs(Wa(i,t*2)-t)}function iu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function su(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function ru(i,t){return i+Math.floor(Math.random()*(t-i+1))}function ou(i,t){return i+Math.random()*(t-i)}function au(i){return i*(.5-Math.random())}function cu(i){i!==void 0&&(yc=i);let t=yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function lu(i){return i*Ji}function hu(i){return i*ts}function uu(i){return(i&i-1)===0&&i!==0}function fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function du(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function pu(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),f=o((t-n)/2),d=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*x,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*x,a*l);break;case"ZYZ":i.set(c*x,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function un(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const bo={DEG2RAD:Ji,RAD2DEG:ts,generateUUID:rn,clamp:Wt,euclideanModulo:Wa,mapLinear:Qh,inverseLerp:tu,lerp:Is,damp:eu,pingpong:nu,smoothstep:iu,smootherstep:su,randInt:ru,randFloat:ou,randFloatSpread:au,seededRandom:cu,degToRad:lu,radToDeg:hu,isPowerOfTwo:uu,ceilPowerOfTwo:fu,floorPowerOfTwo:du,setQuaternionFromProperEuler:pu,normalize:ie,denormalize:un};class pt{constructor(t=0,e=0){pt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class rs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],d=r[o+1],x=r[o+2],M=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=x,t[e+3]=M;return}if(u!==M||c!==f||l!==d||h!==x){let _=1-a;const p=c*f+l*d+h*x+u*M,v=p>=0?1:-1,m=1-p*p;if(m>Number.EPSILON){const S=Math.sqrt(m),E=Math.atan2(S,p*v);_=Math.sin(_*E)/S,a=Math.sin(a*E)/S}const g=a*v;if(c=c*_+f*g,l=l*_+d*g,h=h*_+x*g,u=u*_+M*g,_===1-a){const S=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=S,l*=S,h*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],d=r[o+2],x=r[o+3];return t[e]=a*x+h*u+c*d-l*f,t[e+1]=c*x+h*f+l*u-a*d,t[e+2]=l*x+h*d+a*f-c*u,t[e+3]=h*x-a*u-c*f-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),d=c(s/2),x=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u-f*d*x;break;case"YXZ":this._x=f*h*u+l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u+f*d*x;break;case"ZXY":this._x=f*h*u-l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u-f*d*x;break;case"ZYX":this._x=f*h*u-l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u+f*d*x;break;case"YZX":this._x=f*h*u+l*d*x,this._y=l*d*u+f*h*x,this._z=l*h*x-f*d*u,this._w=l*h*u-f*d*x;break;case"XZY":this._x=f*h*u-l*d*x,this._y=l*d*u-f*h*x,this._z=l*h*x+f*d*u,this._w=l*h*u+f*d*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>u){const d=2*Math.sqrt(1+n-a-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-n-u);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+u-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return To.copy(this).projectOnVector(t),this.sub(To)}reflect(t){return this.sub(To.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Wt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const To=new D,vc=new rs;class $t{constructor(t,e,n,s,r,o,a,c,l){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],x=n[8],M=s[0],_=s[3],p=s[6],v=s[1],m=s[4],g=s[7],S=s[2],E=s[5],w=s[8];return r[0]=o*M+a*v+c*S,r[3]=o*_+a*m+c*E,r[6]=o*p+a*g+c*w,r[1]=l*M+h*v+u*S,r[4]=l*_+h*m+u*E,r[7]=l*p+h*g+u*w,r[2]=f*M+d*v+x*S,r[5]=f*_+d*m+x*E,r[8]=f*p+d*g+x*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,d=l*r-o*c,x=e*u+n*f+s*d;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return t[0]=u*M,t[1]=(s*l-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=f*M,t[4]=(h*e-s*c)*M,t[5]=(s*r-a*e)*M,t[6]=d*M,t[7]=(n*c-l*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Eo.makeScale(t,e)),this}rotate(t){return this.premultiply(Eo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Eo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Eo=new $t;function oh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Bs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function mu(){const i=Bs("canvas");return i.style.display="block",i}const Mc={};function Os(i){i in Mc||(Mc[i]=!0,console.warn(i))}function gu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Sc=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bc=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function xu(){const i={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===re&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===re&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===""?jr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Os("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Os("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Qi]:{primaries:t,whitePoint:n,transfer:jr,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:t,whitePoint:n,transfer:re,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),i}const Qt=xu();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let vi;class _u{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{vi===void 0&&(vi=Bs("canvas")),vi.width=t.width,vi.height=t.height;const s=vi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=vi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Bs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Nn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Nn(e[n]/255)*255):e[n]=Nn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let yu=0;class Za{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=rn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ao(s[o].image)):r.push(Ao(s[o]))}else r=Ao(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ao(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?_u.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let vu=0;const wo=new D;class Ue extends ss{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=1001,s=1001,r=1006,o=1008,a=1023,c=1009,l=Ue.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vu++}),this.uuid=rn(),this.name="",this.source=new Za(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(wo).x}get height(){return this.source.getSize(wo).y}get depth(){return this.source.getSize(wo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==300)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case 1e3:t.x=t.x-Math.floor(t.x);break;case 1001:t.x=t.x<0?0:1;break;case 1002:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case 1e3:t.y=t.y-Math.floor(t.y);break;case 1001:t.y=t.y<0?0:1;break;case 1002:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=300;Ue.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,s=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],x=c[9],M=c[2],_=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-M)<.01&&Math.abs(x-_)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+M)<.1&&Math.abs(x+_)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const m=(l+1)/2,g=(d+1)/2,S=(p+1)/2,E=(h+f)/4,w=(u+M)/4,A=(x+_)/4;return m>g&&m>S?m<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(m),s=E/n,r=w/n):g>S?g<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),n=E/s,r=A/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=w/r,s=A/r),this.set(n,s,r,e),this}let v=Math.sqrt((_-x)*(_-x)+(u-M)*(u-M)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(_-x)/v,this.y=(u-M)/v,this.z=(f-h)/v,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Wt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Mu extends ss{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ue(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Za(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gi extends Mu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ah extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Su extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Le{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(on.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(on.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=on.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,on):on.fromBufferAttribute(r,o),on.applyMatrix4(t.matrixWorld),this.expandByPoint(on);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(t.matrixWorld),this.union($s)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,on),on.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(us),Js.subVectors(this.max,us),Mi.subVectors(t.a,us),Si.subVectors(t.b,us),bi.subVectors(t.c,us),On.subVectors(Si,Mi),kn.subVectors(bi,Si),ni.subVectors(Mi,bi);let e=[0,-On.z,On.y,0,-kn.z,kn.y,0,-ni.z,ni.y,On.z,0,-On.x,kn.z,0,-kn.x,ni.z,0,-ni.x,-On.y,On.x,0,-kn.y,kn.x,0,-ni.y,ni.x,0];return!Ro(e,Mi,Si,bi,Js)||(e=[1,0,0,0,1,0,0,0,1],!Ro(e,Mi,Si,bi,Js))?!1:(Ks.crossVectors(On,kn),e=[Ks.x,Ks.y,Ks.z],Ro(e,Mi,Si,bi,Js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,on).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(on).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Mn=[new D,new D,new D,new D,new D,new D,new D,new D],on=new D,$s=new Le,Mi=new D,Si=new D,bi=new D,On=new D,kn=new D,ni=new D,us=new D,Js=new D,Ks=new D,ii=new D;function Ro(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ii.fromArray(i,r);const a=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),c=t.dot(ii),l=e.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const bu=new Le,fs=new D,Co=new D;class _n{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):bu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fs.subVectors(t,this.center);const e=fs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(fs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Co.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fs.copy(t.center).add(Co)),this.expandByPoint(fs.copy(t.center).sub(Co))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Sn=new D,Po=new D,js=new D,Vn=new D,Io=new D,Qs=new D,Lo=new D;class _i{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Sn.copy(this.origin).addScaledVector(this.direction,e),Sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Po.copy(t).add(e).multiplyScalar(.5),js.copy(e).sub(t).normalize(),Vn.copy(this.origin).sub(Po);const r=t.distanceTo(e)*.5,o=-this.direction.dot(js),a=Vn.dot(this.direction),c=-Vn.dot(js),l=Vn.lengthSq(),h=Math.abs(1-o*o);let u,f,d,x;if(h>0)if(u=o*c-a,f=o*a-c,x=r*h,u>=0)if(f>=-x)if(f<=x){const M=1/h;u*=M,f*=M,d=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;else f<=-x?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=x?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Po).addScaledVector(js,f),d}intersectSphere(t,e){Sn.subVectors(t.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Sn)!==null}intersectTriangle(t,e,n,s,r){Io.subVectors(e,t),Qs.subVectors(n,t),Lo.crossVectors(Io,Qs);let o=this.direction.dot(Lo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Vn.subVectors(this.origin,t);const c=a*this.direction.dot(Qs.crossVectors(Vn,Qs));if(c<0)return null;const l=a*this.direction.dot(Io.cross(Vn));if(l<0||c+l>o)return null;const h=-a*Vn.dot(Lo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xt{constructor(t,e,n,s,r,o,a,c,l,h,u,f,d,x,M,_){Xt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,d,x,M,_)}set(t,e,n,s,r,o,a,c,l,h,u,f,d,x,M,_){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=x,p[11]=M,p[15]=_,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ti.setFromMatrixColumn(t,0).length(),r=1/Ti.setFromMatrixColumn(t,1).length(),o=1/Ti.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,d=o*u,x=a*h,M=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=d+x*l,e[5]=f-M*l,e[9]=-a*c,e[2]=M-f*l,e[6]=x+d*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,d=c*u,x=l*h,M=l*u;e[0]=f+M*a,e[4]=x*a-d,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-x,e[6]=M+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,d=c*u,x=l*h,M=l*u;e[0]=f-M*a,e[4]=-o*u,e[8]=x+d*a,e[1]=d+x*a,e[5]=o*h,e[9]=M-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,d=o*u,x=a*h,M=a*u;e[0]=c*h,e[4]=x*l-d,e[8]=f*l+M,e[1]=c*u,e[5]=M*l+f,e[9]=d*l-x,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,d=o*l,x=a*c,M=a*l;e[0]=c*h,e[4]=M-f*u,e[8]=x*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*u+x,e[10]=f-M*u}else if(t.order==="XZY"){const f=o*c,d=o*l,x=a*c,M=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+M,e[5]=o*h,e[9]=d*u-x,e[2]=x*u-d,e[6]=a*h,e[10]=M*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Tu,t,Eu)}lookAt(t,e,n){const s=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),Gn.crossVectors(n,qe),Gn.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),Gn.crossVectors(n,qe)),Gn.normalize(),tr.crossVectors(qe,Gn),s[0]=Gn.x,s[4]=tr.x,s[8]=qe.x,s[1]=Gn.y,s[5]=tr.y,s[9]=qe.y,s[2]=Gn.z,s[6]=tr.z,s[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],x=n[2],M=n[6],_=n[10],p=n[14],v=n[3],m=n[7],g=n[11],S=n[15],E=s[0],w=s[4],A=s[8],T=s[12],b=s[1],y=s[5],R=s[9],C=s[13],I=s[2],N=s[6],z=s[10],k=s[14],B=s[3],$=s[7],j=s[11],q=s[15];return r[0]=o*E+a*b+c*I+l*B,r[4]=o*w+a*y+c*N+l*$,r[8]=o*A+a*R+c*z+l*j,r[12]=o*T+a*C+c*k+l*q,r[1]=h*E+u*b+f*I+d*B,r[5]=h*w+u*y+f*N+d*$,r[9]=h*A+u*R+f*z+d*j,r[13]=h*T+u*C+f*k+d*q,r[2]=x*E+M*b+_*I+p*B,r[6]=x*w+M*y+_*N+p*$,r[10]=x*A+M*R+_*z+p*j,r[14]=x*T+M*C+_*k+p*q,r[3]=v*E+m*b+g*I+S*B,r[7]=v*w+m*y+g*N+S*$,r[11]=v*A+m*R+g*z+S*j,r[15]=v*T+m*C+g*k+S*q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],d=t[14],x=t[3],M=t[7],_=t[11],p=t[15];return x*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*d-n*c*d)+M*(+e*c*d-e*l*f+r*o*f-s*o*d+s*l*h-r*c*h)+_*(+e*l*u-e*a*d-r*o*u+n*o*d+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],d=t[11],x=t[12],M=t[13],_=t[14],p=t[15],v=u*_*l-M*f*l+M*c*d-a*_*d-u*c*p+a*f*p,m=x*f*l-h*_*l-x*c*d+o*_*d+h*c*p-o*f*p,g=h*M*l-x*u*l+x*a*d-o*M*d-h*a*p+o*u*p,S=x*u*c-h*M*c-x*a*f+o*M*f+h*a*_-o*u*_,E=e*v+n*m+s*g+r*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/E;return t[0]=v*w,t[1]=(M*f*r-u*_*r-M*s*d+n*_*d+u*s*p-n*f*p)*w,t[2]=(a*_*r-M*c*r+M*s*l-n*_*l-a*s*p+n*c*p)*w,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*d-n*c*d)*w,t[4]=m*w,t[5]=(h*_*r-x*f*r+x*s*d-e*_*d-h*s*p+e*f*p)*w,t[6]=(x*c*r-o*_*r-x*s*l+e*_*l+o*s*p-e*c*p)*w,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*d+e*c*d)*w,t[8]=g*w,t[9]=(x*u*r-h*M*r-x*n*d+e*M*d+h*n*p-e*u*p)*w,t[10]=(o*M*r-x*a*r+x*n*l-e*M*l-o*n*p+e*a*p)*w,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*d-e*a*d)*w,t[12]=S*w,t[13]=(h*M*s-x*u*s+x*n*f-e*M*f-h*n*_+e*u*_)*w,t[14]=(x*a*s-o*M*s-x*n*c+e*M*c+o*n*_-e*a*_)*w,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*w,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,d=r*h,x=r*u,M=o*h,_=o*u,p=a*u,v=c*l,m=c*h,g=c*u,S=n.x,E=n.y,w=n.z;return s[0]=(1-(M+p))*S,s[1]=(d+g)*S,s[2]=(x-m)*S,s[3]=0,s[4]=(d-g)*E,s[5]=(1-(f+p))*E,s[6]=(_+v)*E,s[7]=0,s[8]=(x+m)*w,s[9]=(_-v)*w,s[10]=(1-(f+M))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ti.set(s[0],s[1],s[2]).length();const o=Ti.set(s[4],s[5],s[6]).length(),a=Ti.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],an.copy(this);const l=1/r,h=1/o,u=1/a;return an.elements[0]*=l,an.elements[1]*=l,an.elements[2]*=l,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=u,an.elements[9]*=u,an.elements[10]*=u,e.setFromRotationMatrix(an),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=2e3,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s);let x,M;if(c)x=r/(o-r),M=o*r/(o-r);else if(a===2e3)x=-(o+r)/(o-r),M=-2*o*r/(o-r);else if(a===2001)x=-o/(o-r),M=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=2e3,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),d=-(n+s)/(n-s);let x,M;if(c)x=1/(o-r),M=o/(o-r);else if(a===2e3)x=-2/(o-r),M=-(o+r)/(o-r);else if(a===2001)x=-1/(o-r),M=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=x,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ti=new D,an=new Xt,Tu=new D(0,0,0),Eu=new D(1,1,1),Gn=new D,tr=new D,qe=new D,Tc=new Xt,Ec=new rs;class fn{constructor(t=0,e=0,n=0,s=fn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Wt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Tc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Tc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fn.DEFAULT_ORDER="XYZ";class Ya{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Au=0;const Ac=new D,Ei=new rs,bn=new Xt,er=new D,ds=new D,wu=new D,Ru=new rs,wc=new D(1,0,0),Rc=new D(0,1,0),Cc=new D(0,0,1),Pc={type:"added"},Cu={type:"removed"},Ai={type:"childadded",child:null},Do={type:"childremoved",child:null};class xe extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new D,e=new fn,n=new rs,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xt},normalMatrix:{value:new $t}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ya,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ei.setFromAxisAngle(t,e),this.quaternion.multiply(Ei),this}rotateOnWorldAxis(t,e){return Ei.setFromAxisAngle(t,e),this.quaternion.premultiply(Ei),this}rotateX(t){return this.rotateOnAxis(wc,t)}rotateY(t){return this.rotateOnAxis(Rc,t)}rotateZ(t){return this.rotateOnAxis(Cc,t)}translateOnAxis(t,e){return Ac.copy(t).applyQuaternion(this.quaternion),this.position.add(Ac.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(wc,t)}translateY(t){return this.translateOnAxis(Rc,t)}translateZ(t){return this.translateOnAxis(Cc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?er.copy(t):er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(ds,er,this.up):bn.lookAt(er,ds,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Ei.setFromRotationMatrix(bn),this.quaternion.premultiply(Ei.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Pc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Cu),Do.child=t,this.dispatchEvent(Do),Do.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(bn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Pc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,t,wu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ds,Ru,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}xe.DEFAULT_UP=new D(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new D,Tn=new D,Uo=new D,En=new D,wi=new D,Ri=new D,Ic=new D,No=new D,Fo=new D,zo=new D,Bo=new te,Oo=new te,ko=new te;class Pe{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),cn.subVectors(t,e),s.cross(cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){cn.subVectors(s,e),Tn.subVectors(n,e),Uo.subVectors(t,e);const o=cn.dot(cn),a=cn.dot(Tn),c=cn.dot(Uo),l=Tn.dot(Tn),h=Tn.dot(Uo),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*c-a*h)*f,x=(o*h-a*c)*f;return r.set(1-d-x,x,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,En)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,En.x),c.addScaledVector(o,En.y),c.addScaledVector(a,En.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return Bo.setScalar(0),Oo.setScalar(0),ko.setScalar(0),Bo.fromBufferAttribute(t,e),Oo.fromBufferAttribute(t,n),ko.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Bo,r.x),o.addScaledVector(Oo,r.y),o.addScaledVector(ko,r.z),o}static isFrontFacing(t,e,n,s){return cn.subVectors(n,e),Tn.subVectors(t,e),cn.cross(Tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),cn.cross(Tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Pe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Pe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Pe.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Pe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Pe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;wi.subVectors(s,n),Ri.subVectors(r,n),No.subVectors(t,n);const c=wi.dot(No),l=Ri.dot(No);if(c<=0&&l<=0)return e.copy(n);Fo.subVectors(t,s);const h=wi.dot(Fo),u=Ri.dot(Fo);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(wi,o);zo.subVectors(t,r);const d=wi.dot(zo),x=Ri.dot(zo);if(x>=0&&d<=x)return e.copy(r);const M=d*l-c*x;if(M<=0&&l>=0&&x<=0)return a=l/(l-x),e.copy(n).addScaledVector(Ri,a);const _=h*x-d*u;if(_<=0&&u-h>=0&&d-x>=0)return Ic.subVectors(r,s),a=(u-h)/(u-h+(d-x)),e.copy(s).addScaledVector(Ic,a);const p=1/(_+M+f);return o=M*p,a=f*p,e.copy(n).addScaledVector(wi,o).addScaledVector(Ri,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},nr={h:0,s:0,l:0};function Vo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Qt.workingColorSpace){if(t=Wa(t,1),e=Wt(e,0,1),n=Wt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Vo(o,r,t+1/3),this.g=Vo(o,r,t),this.b=Vo(o,r,t-1/3)}return Qt.colorSpaceToWorking(this,s),this}setStyle(t,e=Je){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Je){const n=ch[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Nn(t.r),this.g=Nn(t.g),this.b=Nn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Je){return Qt.workingToColorSpace(Fe.copy(this),t),Math.round(Wt(Fe.r*255,0,255))*65536+Math.round(Wt(Fe.g*255,0,255))*256+Math.round(Wt(Fe.b*255,0,255))}getHexString(t=Je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.workingToColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Je){Qt.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==Je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Hn),this.setHSL(Hn.h+t,Hn.s+e,Hn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Hn),t.getHSL(nr);const n=Is(Hn.h,nr.h,e),s=Is(Hn.s,nr.s,e),r=Is(Hn.l,nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Ht;Ht.NAMES=ch;let Pu=0;class Qn extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pu++}),this.uuid=rn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class me extends Qn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new D,ir=new pt;let Iu=0;class Se{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Iu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ir.fromBufferAttribute(this,e),ir.applyMatrix3(t),this.setXY(e,ir.x,ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=un(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=un(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=un(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=un(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==35044&&(t.usage=this.usage),t}}class lh extends Se{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class hh extends Se{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Zt extends Se{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Lu=0;const tn=new Xt,Go=new xe,Ci=new D,$e=new Le,ps=new Le,Ce=new D;class ne extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(oh(t)?hh:lh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return Go.lookAt(t),Go.updateMatrix(),this.applyMatrix4(Go.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ci).negate(),this.translate(Ci.x,Ci.y,Ci.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Zt(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Le);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];$e.setFromBufferAttribute(r),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _n);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];ps.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors($e.min,ps.min),$e.expandByPoint(Ce),Ce.addVectors($e.max,ps.max),$e.expandByPoint(Ce)):($e.expandByPoint(ps.min),$e.expandByPoint(ps.max))}$e.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ce.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ce));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ce.fromBufferAttribute(a,l),c&&(Ci.fromBufferAttribute(t,l),Ce.add(Ci)),s=Math.max(s,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Se(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let A=0;A<n.count;A++)a[A]=new D,c[A]=new D;const l=new D,h=new D,u=new D,f=new pt,d=new pt,x=new pt,M=new D,_=new D;function p(A,T,b){l.fromBufferAttribute(n,A),h.fromBufferAttribute(n,T),u.fromBufferAttribute(n,b),f.fromBufferAttribute(r,A),d.fromBufferAttribute(r,T),x.fromBufferAttribute(r,b),h.sub(l),u.sub(l),d.sub(f),x.sub(f);const y=1/(d.x*x.y-x.x*d.y);isFinite(y)&&(M.copy(h).multiplyScalar(x.y).addScaledVector(u,-d.y).multiplyScalar(y),_.copy(u).multiplyScalar(d.x).addScaledVector(h,-x.x).multiplyScalar(y),a[A].add(M),a[T].add(M),a[b].add(M),c[A].add(_),c[T].add(_),c[b].add(_))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let A=0,T=v.length;A<T;++A){const b=v[A],y=b.start,R=b.count;for(let C=y,I=y+R;C<I;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const m=new D,g=new D,S=new D,E=new D;function w(A){S.fromBufferAttribute(s,A),E.copy(S);const T=a[A];m.copy(T),m.sub(S.multiplyScalar(S.dot(T))).normalize(),g.crossVectors(E,T);const y=g.dot(c[A])<0?-1:1;o.setXYZW(A,m.x,m.y,m.z,y)}for(let A=0,T=v.length;A<T;++A){const b=v[A],y=b.start,R=b.count;for(let C=y,I=y+R;C<I;C+=3)w(t.getX(C+0)),w(t.getX(C+1)),w(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Se(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,o=new D,a=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let f=0,d=t.count;f<d;f+=3){const x=t.getX(f+0),M=t.getX(f+1),_=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,_),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,x),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,_),a.add(h),c.add(h),l.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(_,l.x,l.y,l.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let d=0,x=0;for(let M=0,_=c.length;M<_;M++){a.isInterleavedBufferAttribute?d=c[M]*a.data.stride+a.offset:d=c[M]*h;for(let p=0;p<h;p++)f[x++]=l[d++]}return new Se(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ne,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],d=t(f,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lc=new Xt,si=new _i,sr=new _n,Dc=new D,rr=new D,or=new D,ar=new D,Ho=new D,cr=new D,Uc=new D,lr=new D;class He extends xe{constructor(t=new ne,e=new me){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){cr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Ho.fromBufferAttribute(u,t),o?cr.addScaledVector(Ho,h):cr.addScaledVector(Ho.sub(e),h))}e.add(cr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(r),si.copy(t.ray).recast(t.near),!(sr.containsPoint(si.origin)===!1&&(si.intersectSphere(sr,Dc)===null||si.origin.distanceToSquared(Dc)>(t.far-t.near)**2))&&(Lc.copy(r).invert(),si.copy(t.ray).applyMatrix4(Lc),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,si)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,M=f.length;x<M;x++){const _=f[x],p=o[_.materialIndex],v=Math.max(_.start,d.start),m=Math.min(a.count,Math.min(_.start+_.count,d.start+d.count));for(let g=v,S=m;g<S;g+=3){const E=a.getX(g),w=a.getX(g+1),A=a.getX(g+2);s=hr(this,p,t,n,l,h,u,E,w,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{const x=Math.max(0,d.start),M=Math.min(a.count,d.start+d.count);for(let _=x,p=M;_<p;_+=3){const v=a.getX(_),m=a.getX(_+1),g=a.getX(_+2);s=hr(this,o,t,n,l,h,u,v,m,g),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let x=0,M=f.length;x<M;x++){const _=f[x],p=o[_.materialIndex],v=Math.max(_.start,d.start),m=Math.min(c.count,Math.min(_.start+_.count,d.start+d.count));for(let g=v,S=m;g<S;g+=3){const E=g,w=g+1,A=g+2;s=hr(this,p,t,n,l,h,u,E,w,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=_.materialIndex,e.push(s))}}else{const x=Math.max(0,d.start),M=Math.min(c.count,d.start+d.count);for(let _=x,p=M;_<p;_+=3){const v=_,m=_+1,g=_+2;s=hr(this,o,t,n,l,h,u,v,m,g),s&&(s.faceIndex=Math.floor(_/3),e.push(s))}}}}function Du(i,t,e,n,s,r,o,a){let c;if(t.side===1?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===0,a),c===null)return null;lr.copy(a),lr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(lr);return l<e.near||l>e.far?null:{distance:l,point:lr.clone(),object:i}}function hr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,rr),i.getVertexPosition(c,or),i.getVertexPosition(l,ar);const h=Du(i,t,e,n,rr,or,ar,Uc);if(h){const u=new D;Pe.getBarycoord(Uc,rr,or,ar,u),s&&(h.uv=Pe.getInterpolatedAttribute(s,a,c,l,u,new pt)),r&&(h.uv1=Pe.getInterpolatedAttribute(r,a,c,l,u,new pt)),o&&(h.normal=Pe.getInterpolatedAttribute(o,a,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new D,materialIndex:0};Pe.getNormal(rr,or,ar,f.normal),h.face=f,h.barycoord=u}return h}class Ln extends ne{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,d=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Zt(l,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(u,2));function x(M,_,p,v,m,g,S,E,w,A,T){const b=g/w,y=S/A,R=g/2,C=S/2,I=E/2,N=w+1,z=A+1;let k=0,B=0;const $=new D;for(let j=0;j<z;j++){const q=j*y-C;for(let nt=0;nt<N;nt++){const ft=nt*b-R;$[M]=ft*v,$[_]=q*m,$[p]=I,l.push($.x,$.y,$.z),$[M]=0,$[_]=0,$[p]=E>0?1:-1,h.push($.x,$.y,$.z),u.push(nt/w),u.push(1-j/A),k+=1}}for(let j=0;j<A;j++)for(let q=0;q<w;q++){const nt=f+q+N*j,ft=f+q+N*(j+1),ot=f+(q+1)+N*(j+1),W=f+(q+1)+N*j;c.push(nt,ft,W),c.push(ft,ot,W),B+=6}a.addGroup(d,B,T),d+=B,f+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function es(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=es(i[e]);for(const s in n)t[s]=n[s]}return t}function Uu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function uh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const Nu={clone:es,merge:Ge};var Fu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends Qn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fu,this.fragmentShader=zu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=es(t.uniforms),this.uniformsGroups=Uu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class fh extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new D,Nc=new pt,Fc=new pt;class Ke extends fh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ts*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ji*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Xn.x,Xn.y).multiplyScalar(-t/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xn.x,Xn.y).multiplyScalar(-t/Xn.z)}getViewSize(t,e){return this.getViewBounds(t,Nc,Fc),e.subVectors(Fc,Nc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ji*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Pi=-90,Ii=1;class Bu extends xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ke(Pi,Ii,t,e);s.layers=this.layers,this.add(s);const r=new Ke(Pi,Ii,t,e);r.layers=this.layers,this.add(r);const o=new Ke(Pi,Ii,t,e);o.layers=this.layers,this.add(o);const a=new Ke(Pi,Ii,t,e);a.layers=this.layers,this.add(a);const c=new Ke(Pi,Ii,t,e);c.layers=this.layers,this.add(c);const l=new Ke(Pi,Ii,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class dh extends Ue{constructor(t=[],e=301,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ou extends gi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new dh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ln(5,5,5),r=new Kn({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});r.uniforms.tEquirect.value=e;const o=new He(s,r),a=e.minFilter;return e.minFilter===1008&&(e.minFilter=1006),new Bu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Yi extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ku={type:"move"};class Xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const M of t.hand.values()){const _=e.getJointPose(M,n),p=this._getHandJoint(l,M);_!==null&&(p.matrix.fromArray(_.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=_.radius),p.visible=_!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,x=.005;l.inputState.pinching&&f>d+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=d-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ku)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Yi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class J1 extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class K1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=rn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ve=new D;class ph{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.applyMatrix4(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.applyNormalMatrix(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ve.fromBufferAttribute(this,e),Ve.transformDirection(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=un(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=un(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=un(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=un(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=un(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Se(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ph(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const zc=new D,Bc=new te,Oc=new te,Vu=new D,kc=new Xt,ur=new D,Wo=new _n,Vc=new Xt,Zo=new _i;class j1 extends He{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=xc,this.bindMatrix=new Xt,this.bindMatrixInverse=new Xt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Le),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ur),this.boundingBox.expandByPoint(ur)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new _n),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ur),this.boundingSphere.expandByPoint(ur)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wo.copy(this.boundingSphere),Wo.applyMatrix4(s),t.ray.intersectsSphere(Wo)!==!1&&(Vc.copy(s).invert(),Zo.copy(t.ray).applyMatrix4(Vc),!(this.boundingBox!==null&&Zo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Zo)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new te,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===xc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===jh?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;Bc.fromBufferAttribute(s.attributes.skinIndex,t),Oc.fromBufferAttribute(s.attributes.skinWeight,t),zc.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const o=Oc.getComponent(r);if(o!==0){const a=Bc.getComponent(r);kc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(Vu.copy(zc).applyMatrix4(kc),o)}}return e.applyMatrix4(this.bindMatrixInverse)}}class Gu extends xe{constructor(){super(),this.isBone=!0,this.type="Bone"}}class qa extends Ue{constructor(t=null,e=1,n=1,s,r,o,a,c,l=1003,h=1003,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Gc=new Xt,Hu=new Xt;class mh{constructor(t=[],e=[]){this.uuid=rn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Xt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Xt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){const a=t[r]?t[r].matrixWorld:Hu;Gc.multiplyMatrices(a,e[r]),Gc.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new mh(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new qa(e,t,t,1023,1015);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Gu),this.bones.push(o),this.boneInverses.push(new Xt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const o=e[s];t.bones.push(o.uuid);const a=n[s];t.boneInverses.push(a.toArray())}return t}}class Hc extends Se{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Li=new Xt,Xc=new Xt,fr=[],Wc=new Le,Xu=new Xt,ms=new He,gs=new _n;class Zc extends He{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Hc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Xu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Le),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Li),Wc.copy(t.boundingBox).applyMatrix4(Li),this.boundingBox.union(Wc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new _n),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Li),gs.copy(t.boundingSphere).applyMatrix4(Li),this.boundingSphere.union(gs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ms.geometry=this.geometry,ms.material=this.material,ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gs.copy(this.boundingSphere),gs.applyMatrix4(n),t.ray.intersectsSphere(gs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Li),Xc.multiplyMatrices(n,Li),ms.matrixWorld=Xc,ms.raycast(t,fr);for(let o=0,a=fr.length;o<a;o++){const c=fr[o];c.instanceId=r,c.object=this,e.push(c)}fr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Hc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new qa(new Float32Array(s*this.count),s,this.count,1028,1015));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Yo=new D,Wu=new D,Zu=new $t;class Rn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Yo.subVectors(n,e).cross(Wu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Yo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Zu.getNormalMatrix(t),s=this.coplanarPoint(Yo).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new _n,Yu=new pt(.5,.5),dr=new D;class $a{constructor(t=new Rn,e=new Rn,n=new Rn,s=new Rn,r=new Rn,o=new Rn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=2e3,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],x=r[8],M=r[9],_=r[10],p=r[11],v=r[12],m=r[13],g=r[14],S=r[15];if(s[0].setComponents(l-o,d-h,p-x,S-v).normalize(),s[1].setComponents(l+o,d+h,p+x,S+v).normalize(),s[2].setComponents(l+a,d+u,p+M,S+m).normalize(),s[3].setComponents(l-a,d-u,p-M,S-m).normalize(),n)s[4].setComponents(c,f,_,g).normalize(),s[5].setComponents(l-c,d-f,p-_,S-g).normalize();else if(s[4].setComponents(l-c,d-f,p-_,S-g).normalize(),e===2e3)s[5].setComponents(l+c,d+f,p+_,S+g).normalize();else if(e===2001)s[5].setComponents(c,f,_,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(t){ri.center.set(0,0,0);const e=Yu.distanceTo(t.center);return ri.radius=.7071067811865476+e,ri.applyMatrix4(t.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(dr.x=s.normal.x>0?t.max.x:t.min.x,dr.y=s.normal.y>0?t.max.y:t.min.y,dr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(dr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ji extends Qn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Qr=new D,to=new D,Yc=new Xt,xs=new _i,pr=new _n,qo=new D,qc=new D;class gh extends xe{constructor(t=new ne,e=new ji){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Qr.fromBufferAttribute(e,s-1),to.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Qr.distanceTo(to);t.setAttribute("lineDistance",new Zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(s),pr.radius+=r,t.ray.intersectsSphere(pr)===!1)return;Yc.copy(s).invert(),xs.copy(t.ray).applyMatrix4(Yc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),x=Math.min(h.count,o.start+o.count);for(let M=d,_=x-1;M<_;M+=l){const p=h.getX(M),v=h.getX(M+1),m=mr(this,t,xs,c,p,v,M);m&&e.push(m)}if(this.isLineLoop){const M=h.getX(x-1),_=h.getX(d),p=mr(this,t,xs,c,M,_,x-1);p&&e.push(p)}}else{const d=Math.max(0,o.start),x=Math.min(f.count,o.start+o.count);for(let M=d,_=x-1;M<_;M+=l){const p=mr(this,t,xs,c,M,M+1,M);p&&e.push(p)}if(this.isLineLoop){const M=mr(this,t,xs,c,x-1,d,x-1);M&&e.push(M)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function mr(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(Qr.fromBufferAttribute(a,s),to.fromBufferAttribute(a,r),e.distanceSqToSegment(Qr,to,qo,qc)>n)return;qo.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(qo);if(!(l<t.near||l>t.far))return{distance:l,point:qc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const $c=new D,Jc=new D;class Zn extends gh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)$c.fromBufferAttribute(e,s),Jc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+$c.distanceTo(Jc);t.setAttribute("lineDistance",new Zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Q1 extends gh{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class qu extends Qn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Kc=new Xt,Aa=new _i,gr=new _n,xr=new D;class t_ extends xe{constructor(t=new ne,e=new qu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere),gr.applyMatrix4(s),gr.radius+=r,t.ray.intersectsSphere(gr)===!1)return;Kc.copy(s).invert(),Aa.copy(t.ray).applyMatrix4(Kc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const f=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let x=f,M=d;x<M;x++){const _=l.getX(x);xr.fromBufferAttribute(u,_),jc(xr,_,c,s,t,e,this)}}else{const f=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let x=f,M=d;x<M;x++)xr.fromBufferAttribute(u,x),jc(xr,x,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function jc(i,t,e,n,s,r,o){const a=Aa.distanceSqToPoint(i);if(a<e){const c=new D;Aa.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class $u extends Ue{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class xh extends Ue{constructor(t,e,n=1014,s,r,o,a=1003,c=1003,l,h=1026,u=1){if(h!==1026&&h!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Za(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class _h extends Ue{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ja extends ne{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new D,h=new pt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const d=n+u/e*s;l.x=t*Math.cos(d),l.y=t*Math.sin(d),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Zt(o,3)),this.setAttribute("normal",new Zt(a,3)),this.setAttribute("uv",new Zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ja(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class mi extends ne{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let x=0;const M=[],_=n/2;let p=0;v(),o===!1&&(t>0&&m(!0),e>0&&m(!1)),this.setIndex(h),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(f,3)),this.setAttribute("uv",new Zt(d,2));function v(){const g=new D,S=new D;let E=0;const w=(e-t)/n;for(let A=0;A<=r;A++){const T=[],b=A/r,y=b*(e-t)+t;for(let R=0;R<=s;R++){const C=R/s,I=C*c+a,N=Math.sin(I),z=Math.cos(I);S.x=y*N,S.y=-b*n+_,S.z=y*z,u.push(S.x,S.y,S.z),g.set(N,w,z).normalize(),f.push(g.x,g.y,g.z),d.push(C,1-b),T.push(x++)}M.push(T)}for(let A=0;A<s;A++)for(let T=0;T<r;T++){const b=M[T][A],y=M[T+1][A],R=M[T+1][A+1],C=M[T][A+1];(t>0||T!==0)&&(h.push(b,y,C),E+=3),(e>0||T!==r-1)&&(h.push(y,R,C),E+=3)}l.addGroup(p,E,0),p+=E}function m(g){const S=x,E=new pt,w=new D;let A=0;const T=g===!0?t:e,b=g===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,_*b,0),f.push(0,b,0),d.push(.5,.5),x++;const y=x;for(let R=0;R<=s;R++){const I=R/s*c+a,N=Math.cos(I),z=Math.sin(I);w.x=T*z,w.y=_*b,w.z=T*N,u.push(w.x,w.y,w.z),f.push(0,b,0),E.x=N*.5+.5,E.y=z*.5*b+.5,d.push(E.x,E.y),x++}for(let R=0;R<s;R++){const C=S+R,I=y+R;g===!0?h.push(I,I+1,C):h.push(I+1,I,C),A+=3}l.addGroup(p,A,g===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ka extends mi{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ka(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fo extends ne{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new Zt(r,3)),this.setAttribute("normal",new Zt(r.slice(),3)),this.setAttribute("uv",new Zt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const m=new D,g=new D,S=new D;for(let E=0;E<e.length;E+=3)d(e[E+0],m),d(e[E+1],g),d(e[E+2],S),c(m,g,S,v)}function c(v,m,g,S){const E=S+1,w=[];for(let A=0;A<=E;A++){w[A]=[];const T=v.clone().lerp(g,A/E),b=m.clone().lerp(g,A/E),y=E-A;for(let R=0;R<=y;R++)R===0&&A===E?w[A][R]=T:w[A][R]=T.clone().lerp(b,R/y)}for(let A=0;A<E;A++)for(let T=0;T<2*(E-A)-1;T++){const b=Math.floor(T/2);T%2===0?(f(w[A][b+1]),f(w[A+1][b]),f(w[A][b])):(f(w[A][b+1]),f(w[A+1][b+1]),f(w[A+1][b]))}}function l(v){const m=new D;for(let g=0;g<r.length;g+=3)m.x=r[g+0],m.y=r[g+1],m.z=r[g+2],m.normalize().multiplyScalar(v),r[g+0]=m.x,r[g+1]=m.y,r[g+2]=m.z}function h(){const v=new D;for(let m=0;m<r.length;m+=3){v.x=r[m+0],v.y=r[m+1],v.z=r[m+2];const g=_(v)/2/Math.PI+.5,S=p(v)/Math.PI+.5;o.push(g,1-S)}x(),u()}function u(){for(let v=0;v<o.length;v+=6){const m=o[v+0],g=o[v+2],S=o[v+4],E=Math.max(m,g,S),w=Math.min(m,g,S);E>.9&&w<.1&&(m<.2&&(o[v+0]+=1),g<.2&&(o[v+2]+=1),S<.2&&(o[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function d(v,m){const g=v*3;m.x=t[g+0],m.y=t[g+1],m.z=t[g+2]}function x(){const v=new D,m=new D,g=new D,S=new D,E=new pt,w=new pt,A=new pt;for(let T=0,b=0;T<r.length;T+=9,b+=6){v.set(r[T+0],r[T+1],r[T+2]),m.set(r[T+3],r[T+4],r[T+5]),g.set(r[T+6],r[T+7],r[T+8]),E.set(o[b+0],o[b+1]),w.set(o[b+2],o[b+3]),A.set(o[b+4],o[b+5]),S.copy(v).add(m).add(g).divideScalar(3);const y=_(S);M(E,b+0,v,y),M(w,b+2,m,y),M(A,b+4,g,y)}}function M(v,m,g,S){S<0&&v.x===1&&(o[m]=v.x-1),g.x===0&&g.z===0&&(o[m]=S/2/Math.PI+.5)}function _(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fo(t.vertices,t.indices,t.radius,t.details)}}const _r=new D,yr=new D,$o=new D,vr=new Pe;class Jo extends ne{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(Ji*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),f={},d=[];for(let x=0;x<c;x+=3){o?(l[0]=o.getX(x),l[1]=o.getX(x+1),l[2]=o.getX(x+2)):(l[0]=x,l[1]=x+1,l[2]=x+2);const{a:M,b:_,c:p}=vr;if(M.fromBufferAttribute(a,l[0]),_.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),vr.getNormal($o),u[0]=`${Math.round(M.x*s)},${Math.round(M.y*s)},${Math.round(M.z*s)}`,u[1]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let v=0;v<3;v++){const m=(v+1)%3,g=u[v],S=u[m],E=vr[h[v]],w=vr[h[m]],A=`${g}_${S}`,T=`${S}_${g}`;T in f&&f[T]?($o.dot(f[T].normal)<=r&&(d.push(E.x,E.y,E.z),d.push(w.x,w.y,w.z)),f[T]=null):A in f||(f[A]={index0:l[v],index1:l[m],normal:$o.clone()})}}for(const x in f)if(f[x]){const{index0:M,index1:_}=f[x];_r.fromBufferAttribute(a,M),yr.fromBufferAttribute(a,_),d.push(_r.x,_r.y,_r.z),d.push(yr.x,yr.y,yr.z)}this.setAttribute("position",new Zt(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class yn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new pt:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],o=[],a=new D,c=new Xt;for(let d=0;d<=t;d++){const x=d/t;s[d]=this.getTangentAt(x,new D)}r[0]=new D,o[0]=new D;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const x=Math.acos(Wt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,x))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Wt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let x=1;x<=t;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],d*x)),o[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ja extends yn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new pt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Ju extends ja{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Qa(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Mr=new D,Ko=new Qa,jo=new Qa,Qo=new Qa;class Ku extends yn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Mr.subVectors(s[0],s[1]).add(s[0]),l=Mr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Mr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Mr),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let x=Math.pow(l.distanceToSquared(u),d),M=Math.pow(u.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(h),d);M<1e-4&&(M=1),x<1e-4&&(x=M),_<1e-4&&(_=M),Ko.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,x,M,_),jo.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,x,M,_),Qo.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,x,M,_)}else this.curveType==="catmullrom"&&(Ko.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),jo.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Qo.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Ko.calc(c),jo.calc(c),Qo.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Qc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function ju(i,t){const e=1-i;return e*e*t}function Qu(i,t){return 2*(1-i)*i*t}function tf(i,t){return i*i*t}function Ls(i,t,e,n){return ju(i,t)+Qu(i,e)+tf(i,n)}function ef(i,t){const e=1-i;return e*e*e*t}function nf(i,t){const e=1-i;return 3*e*e*i*t}function sf(i,t){return 3*(1-i)*i*i*t}function rf(i,t){return i*i*i*t}function Ds(i,t,e,n,s){return ef(i,t)+nf(i,e)+sf(i,n)+rf(i,s)}class yh extends yn{constructor(t=new pt,e=new pt,n=new pt,s=new pt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new pt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ds(t,s.x,r.x,o.x,a.x),Ds(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class of extends yn{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Ds(t,s.x,r.x,o.x,a.x),Ds(t,s.y,r.y,o.y,a.y),Ds(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class vh extends yn{constructor(t=new pt,e=new pt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new pt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new pt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class af extends yn{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mh extends yn{constructor(t=new pt,e=new pt,n=new pt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new pt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ls(t,s.x,r.x,o.x),Ls(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sh extends yn{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ls(t,s.x,r.x,o.x),Ls(t,s.y,r.y,o.y),Ls(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bh extends yn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new pt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Qc(a,c.x,l.x,h.x,u.x),Qc(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new pt().fromArray(s))}return this}}var eo=Object.freeze({__proto__:null,ArcCurve:Ju,CatmullRomCurve3:Ku,CubicBezierCurve:yh,CubicBezierCurve3:of,EllipseCurve:ja,LineCurve:vh,LineCurve3:af,QuadraticBezierCurve:Mh,QuadraticBezierCurve3:Sh,SplineCurve:bh});class cf extends yn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new eo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new eo[s.type]().fromJSON(s))}return this}}class no extends cf{constructor(t){super(),this.type="Path",this.currentPoint=new pt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new vh(this.currentPoint.clone(),new pt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Mh(this.currentPoint.clone(),new pt(t,e),new pt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new yh(this.currentPoint.clone(),new pt(t,e),new pt(n,s),new pt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new bh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new ja(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class io extends no{constructor(t){super(t),this.uuid=rn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new no().fromJSON(s))}return this}}function lf(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Th(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=pf(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){const d=i[f],x=i[f+1];d<a&&(a=d),x<c&&(c=x),d>h&&(h=d),x>u&&(u=x)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return ks(r,o,e,a,c,l,0),o}function Th(i,t,e,n,s){let r;if(s===Ef(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=tl(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=tl(o/n|0,i[o],i[o+1],r);return r&&ns(r,r.next)&&(Gs(r),r=r.next),r}function xi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ns(e,e.next)||ge(e.prev,e,e.next)===0)){if(Gs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ks(i,t,e,n,s,r,o){if(!i)return;!o&&r&&yf(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?uf(i,n,s,r):hf(i)){t.push(c.i,i.i,l.i),Gs(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=ff(xi(i),t),ks(i,t,e,n,s,r,2)):o===2&&df(i,t,e,n,s,r):ks(xi(i),t,e,n,s,r,1);break}}}function hf(i){const t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),f=Math.max(s,r,o),d=Math.max(a,c,l);let x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=f&&x.y>=u&&x.y<=d&&Rs(s,a,r,c,o,l,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function uf(i,t,e,n){const s=i.prev,r=i,o=i.next;if(ge(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,c,l),x=Math.min(h,u,f),M=Math.max(a,c,l),_=Math.max(h,u,f),p=wa(d,x,t,e,n),v=wa(M,_,t,e,n);let m=i.prevZ,g=i.nextZ;for(;m&&m.z>=p&&g&&g.z<=v;){if(m.x>=d&&m.x<=M&&m.y>=x&&m.y<=_&&m!==s&&m!==o&&Rs(a,h,c,u,l,f,m.x,m.y)&&ge(m.prev,m,m.next)>=0||(m=m.prevZ,g.x>=d&&g.x<=M&&g.y>=x&&g.y<=_&&g!==s&&g!==o&&Rs(a,h,c,u,l,f,g.x,g.y)&&ge(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;m&&m.z>=p;){if(m.x>=d&&m.x<=M&&m.y>=x&&m.y<=_&&m!==s&&m!==o&&Rs(a,h,c,u,l,f,m.x,m.y)&&ge(m.prev,m,m.next)>=0)return!1;m=m.prevZ}for(;g&&g.z<=v;){if(g.x>=d&&g.x<=M&&g.y>=x&&g.y<=_&&g!==s&&g!==o&&Rs(a,h,c,u,l,f,g.x,g.y)&&ge(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function ff(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ns(n,s)&&Ah(n,e,e.next,s)&&Vs(n,s)&&Vs(s,n)&&(t.push(n.i,e.i,s.i),Gs(e),Gs(e.next),e=i=s),e=e.next}while(e!==i);return xi(e)}function df(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Sf(o,a)){let c=wh(o,a);o=xi(o,o.next),c=xi(c,c.next),ks(o,t,e,n,s,r,0),ks(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function pf(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=Th(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Mf(l))}s.sort(mf);for(let r=0;r<s.length;r++)e=gf(s[r],e);return e}function mf(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function gf(i,t){const e=xf(i,t);if(!e)return t;const n=wh(e,i);return xi(n,n.next),xi(e,e.next)}function xf(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(ns(i,e))return e;do{if(ns(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Eh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Vs(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&_f(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function _f(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function yf(i,t,e,n){let s=i;do s.z===0&&(s.z=wa(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vf(s)}function vf(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function wa(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Mf(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Eh(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Rs(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&Eh(i,t,e,n,s,r,o,a)}function Sf(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!bf(i,t)&&(Vs(i,t)&&Vs(t,i)&&Tf(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||ns(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ns(i,t){return i.x===t.x&&i.y===t.y}function Ah(i,t,e,n){const s=br(ge(i,t,e)),r=br(ge(i,t,n)),o=br(ge(e,n,i)),a=br(ge(e,n,t));return!!(s!==r&&o!==a||s===0&&Sr(i,e,t)||r===0&&Sr(i,n,t)||o===0&&Sr(e,i,n)||a===0&&Sr(e,t,n))}function Sr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function br(i){return i>0?1:i<0?-1:0}function bf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ah(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Vs(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function Tf(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function wh(i,t){const e=Ra(i.i,i.x,i.y),n=Ra(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function tl(i,t,e,n){const s=Ra(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Gs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ra(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ef(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Af{static triangulate(t,e,n=2){return lf(t,e,n)}}class Dn{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Dn.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];el(t),nl(n,t);let o=t.length;e.forEach(el);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,nl(n,e[c]);const a=Af.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function el(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function nl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Rh extends ne{constructor(t=new io([new pt(.5,.5),new pt(-.5,.5),new pt(-.5,-.5),new pt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new Zt(s,3)),this.setAttribute("uv",new Zt(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,x=e.bevelSize!==void 0?e.bevelSize:d-.1,M=e.bevelOffset!==void 0?e.bevelOffset:0,_=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:wf;let m,g=!1,S,E,w,A;p&&(m=p.getSpacedPoints(h),g=!0,f=!1,S=p.computeFrenetFrames(h,!1),E=new D,w=new D,A=new D),f||(_=0,d=0,x=0,M=0);const T=a.extractPoints(l);let b=T.shape;const y=T.holes;if(!Dn.isClockWise(b)){b=b.reverse();for(let rt=0,st=y.length;rt<st;rt++){const it=y[rt];Dn.isClockWise(it)&&(y[rt]=it.reverse())}}function C(rt){const it=10000000000000001e-36;let tt=rt[0];for(let yt=1;yt<=rt.length;yt++){const G=yt%rt.length,ct=rt[G],Mt=ct.x-tt.x,Nt=ct.y-tt.y,U=Mt*Mt+Nt*Nt,P=Math.max(Math.abs(ct.x),Math.abs(ct.y),Math.abs(tt.x),Math.abs(tt.y)),Y=it*P*P;if(U<=Y){rt.splice(G,1),yt--;continue}tt=ct}}C(b),y.forEach(C);const I=y.length,N=b;for(let rt=0;rt<I;rt++){const st=y[rt];b=b.concat(st)}function z(rt,st,it){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),rt.clone().addScaledVector(st,it)}const k=b.length;function B(rt,st,it){let tt,yt,G;const ct=rt.x-st.x,Mt=rt.y-st.y,Nt=it.x-rt.x,U=it.y-rt.y,P=ct*ct+Mt*Mt,Y=ct*U-Mt*Nt;if(Math.abs(Y)>Number.EPSILON){const Q=Math.sqrt(P),ut=Math.sqrt(Nt*Nt+U*U),et=st.x-Mt/Q,Ft=st.y+ct/Q,St=it.x-U/ut,Lt=it.y+Nt/ut,Dt=((St-et)*U-(Lt-Ft)*Nt)/(ct*U-Mt*Nt);tt=et+ct*Dt-rt.x,yt=Ft+Mt*Dt-rt.y;const mt=tt*tt+yt*yt;if(mt<=2)return new pt(tt,yt);G=Math.sqrt(mt/2)}else{let Q=!1;ct>Number.EPSILON?Nt>Number.EPSILON&&(Q=!0):ct<-Number.EPSILON?Nt<-Number.EPSILON&&(Q=!0):Math.sign(Mt)===Math.sign(U)&&(Q=!0),Q?(tt=-Mt,yt=ct,G=Math.sqrt(P)):(tt=ct,yt=Mt,G=Math.sqrt(P/2))}return new pt(tt/G,yt/G)}const $=[];for(let rt=0,st=N.length,it=st-1,tt=rt+1;rt<st;rt++,it++,tt++)it===st&&(it=0),tt===st&&(tt=0),$[rt]=B(N[rt],N[it],N[tt]);const j=[];let q,nt=$.concat();for(let rt=0,st=I;rt<st;rt++){const it=y[rt];q=[];for(let tt=0,yt=it.length,G=yt-1,ct=tt+1;tt<yt;tt++,G++,ct++)G===yt&&(G=0),ct===yt&&(ct=0),q[tt]=B(it[tt],it[G],it[ct]);j.push(q),nt=nt.concat(q)}let ft;if(_===0)ft=Dn.triangulateShape(N,y);else{const rt=[],st=[];for(let it=0;it<_;it++){const tt=it/_,yt=d*Math.cos(tt*Math.PI/2),G=x*Math.sin(tt*Math.PI/2)+M;for(let ct=0,Mt=N.length;ct<Mt;ct++){const Nt=z(N[ct],$[ct],G);dt(Nt.x,Nt.y,-yt),tt===0&&rt.push(Nt)}for(let ct=0,Mt=I;ct<Mt;ct++){const Nt=y[ct];q=j[ct];const U=[];for(let P=0,Y=Nt.length;P<Y;P++){const Q=z(Nt[P],q[P],G);dt(Q.x,Q.y,-yt),tt===0&&U.push(Q)}tt===0&&st.push(U)}}ft=Dn.triangulateShape(rt,st)}const ot=ft.length,W=x+M;for(let rt=0;rt<k;rt++){const st=f?z(b[rt],nt[rt],W):b[rt];g?(w.copy(S.normals[0]).multiplyScalar(st.x),E.copy(S.binormals[0]).multiplyScalar(st.y),A.copy(m[0]).add(w).add(E),dt(A.x,A.y,A.z)):dt(st.x,st.y,0)}for(let rt=1;rt<=h;rt++)for(let st=0;st<k;st++){const it=f?z(b[st],nt[st],W):b[st];g?(w.copy(S.normals[rt]).multiplyScalar(it.x),E.copy(S.binormals[rt]).multiplyScalar(it.y),A.copy(m[rt]).add(w).add(E),dt(A.x,A.y,A.z)):dt(it.x,it.y,u/h*rt)}for(let rt=_-1;rt>=0;rt--){const st=rt/_,it=d*Math.cos(st*Math.PI/2),tt=x*Math.sin(st*Math.PI/2)+M;for(let yt=0,G=N.length;yt<G;yt++){const ct=z(N[yt],$[yt],tt);dt(ct.x,ct.y,u+it)}for(let yt=0,G=y.length;yt<G;yt++){const ct=y[yt];q=j[yt];for(let Mt=0,Nt=ct.length;Mt<Nt;Mt++){const U=z(ct[Mt],q[Mt],tt);g?dt(U.x,U.y+m[h-1].y,m[h-1].x+it):dt(U.x,U.y,u+it)}}}O(),H();function O(){const rt=s.length/3;if(f){let st=0,it=k*st;for(let tt=0;tt<ot;tt++){const yt=ft[tt];ht(yt[2]+it,yt[1]+it,yt[0]+it)}st=h+_*2,it=k*st;for(let tt=0;tt<ot;tt++){const yt=ft[tt];ht(yt[0]+it,yt[1]+it,yt[2]+it)}}else{for(let st=0;st<ot;st++){const it=ft[st];ht(it[2],it[1],it[0])}for(let st=0;st<ot;st++){const it=ft[st];ht(it[0]+k*h,it[1]+k*h,it[2]+k*h)}}n.addGroup(rt,s.length/3-rt,0)}function H(){const rt=s.length/3;let st=0;at(N,st),st+=N.length;for(let it=0,tt=y.length;it<tt;it++){const yt=y[it];at(yt,st),st+=yt.length}n.addGroup(rt,s.length/3-rt,1)}function at(rt,st){let it=rt.length;for(;--it>=0;){const tt=it;let yt=it-1;yt<0&&(yt=rt.length-1);for(let G=0,ct=h+_*2;G<ct;G++){const Mt=k*G,Nt=k*(G+1),U=st+tt+Mt,P=st+yt+Mt,Y=st+yt+Nt,Q=st+tt+Nt;vt(U,P,Y,Q)}}}function dt(rt,st,it){c.push(rt),c.push(st),c.push(it)}function ht(rt,st,it){Rt(rt),Rt(st),Rt(it);const tt=s.length/3,yt=v.generateTopUV(n,s,tt-3,tt-2,tt-1);F(yt[0]),F(yt[1]),F(yt[2])}function vt(rt,st,it,tt){Rt(rt),Rt(st),Rt(tt),Rt(st),Rt(it),Rt(tt);const yt=s.length/3,G=v.generateSideWallUV(n,s,yt-6,yt-3,yt-2,yt-1);F(G[0]),F(G[1]),F(G[3]),F(G[1]),F(G[2]),F(G[3])}function Rt(rt){s.push(c[rt*3+0]),s.push(c[rt*3+1]),s.push(c[rt*3+2])}function F(rt){r.push(rt.x),r.push(rt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Rf(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new eo[s.type]().fromJSON(s)),new Rh(n,t.options)}}const wf={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new pt(r,o),new pt(a,c),new pt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],d=t[s*3+1],x=t[s*3+2],M=t[r*3],_=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new pt(o,1-c),new pt(l,1-u),new pt(f,1-x),new pt(M,1-p)]:[new pt(a,1-c),new pt(h,1-u),new pt(d,1-x),new pt(_,1-p)]}};function Rf(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Ch extends fo{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ch(t.radius,t.detail)}}class Hs extends fo{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Hs(t.radius,t.detail)}}class po extends ne{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,d=[],x=[],M=[],_=[];for(let p=0;p<h;p++){const v=p*f-o;for(let m=0;m<l;m++){const g=m*u-r;x.push(g,-v,0),M.push(0,0,1),_.push(m/a),_.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<a;v++){const m=v+l*p,g=v+l*(p+1),S=v+1+l*(p+1),E=v+1+l*p;d.push(m,g,E),d.push(g,S,E)}this.setIndex(d),this.setAttribute("position",new Zt(x,3)),this.setAttribute("normal",new Zt(M,3)),this.setAttribute("uv",new Zt(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new po(t.width,t.height,t.widthSegments,t.heightSegments)}}class so extends ne{constructor(t=new io([new pt(0,.5),new pt(-.5,-.5),new pt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new Zt(s,3)),this.setAttribute("normal",new Zt(r,3)),this.setAttribute("uv",new Zt(o,2));function l(h){const u=s.length/3,f=h.extractPoints(e);let d=f.shape;const x=f.holes;Dn.isClockWise(d)===!1&&(d=d.reverse());for(let _=0,p=x.length;_<p;_++){const v=x[_];Dn.isClockWise(v)===!0&&(x[_]=v.reverse())}const M=Dn.triangulateShape(d,x);for(let _=0,p=x.length;_<p;_++){const v=x[_];d=d.concat(v)}for(let _=0,p=d.length;_<p;_++){const v=d[_];s.push(v.x,v.y,0),r.push(0,0,1),o.push(v.x,v.y)}for(let _=0,p=M.length;_<p;_++){const v=M[_],m=v[0]+u,g=v[1]+u,S=v[2]+u;n.push(m,g,S),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Cf(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new so(n,t.curveSegments)}}function Cf(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Xs extends ne{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new D,f=new D,d=[],x=[],M=[],_=[];for(let p=0;p<=n;p++){const v=[],m=p/n;let g=0;p===0&&o===0?g=.5/e:p===n&&c===Math.PI&&(g=-.5/e);for(let S=0;S<=e;S++){const E=S/e;u.x=-t*Math.cos(s+E*r)*Math.sin(o+m*a),u.y=t*Math.cos(o+m*a),u.z=t*Math.sin(s+E*r)*Math.sin(o+m*a),x.push(u.x,u.y,u.z),f.copy(u).normalize(),M.push(f.x,f.y,f.z),_.push(E+g,1-m),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const m=h[p][v+1],g=h[p][v],S=h[p+1][v],E=h[p+1][v+1];(p!==0||o>0)&&d.push(m,g,E),(p!==n-1||c<Math.PI)&&d.push(g,S,E)}this.setIndex(d),this.setAttribute("position",new Zt(x,3)),this.setAttribute("normal",new Zt(M,3)),this.setAttribute("uv",new Zt(_,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ro extends ne{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new D,u=new D,f=new D;for(let d=0;d<=n;d++)for(let x=0;x<=s;x++){const M=x/s*r,_=d/n*Math.PI*2;u.x=(t+e*Math.cos(_))*Math.cos(M),u.y=(t+e*Math.cos(_))*Math.sin(M),u.z=e*Math.sin(_),a.push(u.x,u.y,u.z),h.x=t*Math.cos(M),h.y=t*Math.sin(M),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(x/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let x=1;x<=s;x++){const M=(s+1)*d+x-1,_=(s+1)*(d-1)+x-1,p=(s+1)*(d-1)+x,v=(s+1)*d+x;o.push(M,_,v),o.push(_,p,v)}this.setIndex(o),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(c,3)),this.setAttribute("uv",new Zt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ro(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ph extends ne{constructor(t=new Sh(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};const o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,c=new D,l=new pt;let h=new D;const u=[],f=[],d=[],x=[];M(),this.setIndex(x),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(f,3)),this.setAttribute("uv",new Zt(d,2));function M(){for(let m=0;m<e;m++)_(m);_(r===!1?e:0),v(),p()}function _(m){h=t.getPointAt(m/e,h);const g=o.normals[m],S=o.binormals[m];for(let E=0;E<=s;E++){const w=E/s*Math.PI*2,A=Math.sin(w),T=-Math.cos(w);c.x=T*g.x+A*S.x,c.y=T*g.y+A*S.y,c.z=T*g.z+A*S.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let m=1;m<=e;m++)for(let g=1;g<=s;g++){const S=(s+1)*(m-1)+(g-1),E=(s+1)*m+(g-1),w=(s+1)*m+g,A=(s+1)*(m-1)+g;x.push(S,E,A),x.push(E,w,A)}}function v(){for(let m=0;m<=e;m++)for(let g=0;g<=s;g++)l.x=m/e,l.y=g/s,d.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Ph(new eo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class Pf extends Qn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class e_ extends Pf{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new pt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Wt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ht(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ht(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ht(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class n_ extends Qn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class If extends Qn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Lf extends Qn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class i_ extends ji{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function Tr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Df(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Uf(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function il(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=e[r]*t;for(let c=0;c!==t;++c)s[o++]=i[a+c]}return s}function Ih(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=i[s++];while(r!==void 0)}class mo{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){const a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){const a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Nf extends mo{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case 2401:r=t,a=2*e-n;break;case 2402:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case 2401:o=t,c=2*n-e;break;case 2402:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}const l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,x=(n-e)/(s-e),M=x*x,_=M*x,p=-f*_+2*f*M-f*x,v=(1+f)*_+(-1.5-2*f)*M+(-.5+f)*x+1,m=(-1-d)*_+(1.5+d)*M+.5*x,g=d*_-d*M;for(let S=0;S!==a;++S)r[S]=p*o[h+S]+v*o[l+S]+m*o[c+S]+g*o[u+S];return r}}class Ff extends mo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*u+o[c+f]*h;return r}}class zf extends mo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class pn{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Tr(e,this.TimeBufferType),this.values=Tr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Tr(t.times,Array),values:Tr(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new zf(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ff(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Nf(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case 2300:e=this.InterpolantFactoryMethodDiscrete;break;case 2301:e=this.InterpolantFactoryMethodLinear;break;case 2302:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&Df(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===2302,r=t.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{const u=a*n,f=u-n,d=u+n;for(let x=0;x!==n;++x){const M=e[u+x];if(M!==e[f+x]||M!==e[d+x]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];const u=a*n,f=o*n;for(let d=0;d!==n;++d)e[f+d]=e[u+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}pn.prototype.ValueTypeName="";pn.prototype.TimeBufferType=Float32Array;pn.prototype.ValueBufferType=Float32Array;pn.prototype.DefaultInterpolation=2301;class os extends pn{constructor(t,e,n){super(t,e,n)}}os.prototype.ValueTypeName="bool";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=2300;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;class Lh extends pn{constructor(t,e,n,s){super(t,e,n,s)}}Lh.prototype.ValueTypeName="color";class oo extends pn{constructor(t,e,n,s){super(t,e,n,s)}}oo.prototype.ValueTypeName="number";class Bf extends mo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e);let l=t*a;for(let h=l+a;l!==h;l+=4)rs.slerpFlat(r,0,o,l-a,o,l,c);return r}}class go extends pn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Bf(this.times,this.values,this.getValueSize(),t)}}go.prototype.ValueTypeName="quaternion";go.prototype.InterpolantFactoryMethodSmooth=void 0;class as extends pn{constructor(t,e,n){super(t,e,n)}}as.prototype.ValueTypeName="string";as.prototype.ValueBufferType=Array;as.prototype.DefaultInterpolation=2300;as.prototype.InterpolantFactoryMethodLinear=void 0;as.prototype.InterpolantFactoryMethodSmooth=void 0;class ao extends pn{constructor(t,e,n,s){super(t,e,n,s)}}ao.prototype.ValueTypeName="vector";class s_{constructor(t="",e=-1,n=[],s=2500){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(kf(n[o]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,o=n.length;r!==o;++r)e.push(pn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const h=Uf(c);c=il(c,1,h),l=il(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new oo(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){const l=t[a],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let f=s[u];f||(s[u]=f=[]),f.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,n));return o}static parseAnimation(t,e){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,f,d,x,M){if(d.length!==0){const _=[],p=[];Ih(d,_,p,x),_.length!==0&&M.push(new u(f,_,p))}},s=[],r=t.name||"default",o=t.fps||30,a=t.blendMode;let c=t.length||-1;const l=t.hierarchy||[];for(let u=0;u<l.length;u++){const f=l[u].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const d={};let x;for(x=0;x<f.length;x++)if(f[x].morphTargets)for(let M=0;M<f[x].morphTargets.length;M++)d[f[x].morphTargets[M]]=-1;for(const M in d){const _=[],p=[];for(let v=0;v!==f[x].morphTargets.length;++v){const m=f[x];_.push(m.time),p.push(m.morphTarget===M?1:0)}s.push(new oo(".morphTargetInfluence["+M+"]",_,p))}c=d.length*o}else{const d=".bones["+e[u].name+"]";n(ao,d+".position",f,"pos",s),n(go,d+".quaternion",f,"rot",s),n(ao,d+".scale",f,"scl",s)}}return s.length===0?null:new this(r,c,s,a)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function Of(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return oo;case"vector":case"vector2":case"vector3":case"vector4":return ao;case"color":return Lh;case"quaternion":return go;case"bool":case"boolean":return os;case"string":return as}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function kf(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=Of(i.type);if(i.times===void 0){const e=[],n=[];Ih(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}const Un={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Vf{constructor(t,e,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){const d=l[u],x=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Gf=new Vf;class Ws{constructor(t){this.manager=t!==void 0?t:Gf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Ws.DEFAULT_MATERIAL_NAME="__DEFAULT";const An={};class Hf extends Error{constructor(t,e){super(t),this.response=e}}class r_ extends Ws{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=Un.get(`file:${t}`);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(An[t]!==void 0){An[t].push({onLoad:e,onProgress:n,onError:s});return}An[t]=[],An[t].push({onLoad:e,onProgress:n,onError:s});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=An[t],u=l.body.getReader(),f=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=f?parseInt(f):0,x=d!==0;let M=0;const _=new ReadableStream({start(p){v();function v(){u.read().then(({done:m,value:g})=>{if(m)p.close();else{M+=g.byteLength;const S=new ProgressEvent("progress",{lengthComputable:x,loaded:M,total:d});for(let E=0,w=h.length;E<w;E++){const A=h[E];A.onProgress&&A.onProgress(S)}p.enqueue(g),v()}},m=>{p.error(m)})}}});return new Response(_)}else throw new Hf(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),f=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(f);return l.arrayBuffer().then(x=>d.decode(x))}}}).then(l=>{Un.add(`file:${t}`,l);const h=An[t];delete An[t];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onLoad&&d.onLoad(l)}}).catch(l=>{const h=An[t];if(h===void 0)throw this.manager.itemError(t),l;delete An[t];for(let u=0,f=h.length;u<f;u++){const d=h[u];d.onError&&d.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Di=new WeakMap;class Xf extends Ws{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Un.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let u=Di.get(o);u===void 0&&(u=[],Di.set(o,u)),u.push({onLoad:e,onError:s})}return o}const a=Bs("img");function c(){h(),e&&e(this);const u=Di.get(this)||[];for(let f=0;f<u.length;f++){const d=u[f];d.onLoad&&d.onLoad(this)}Di.delete(this),r.manager.itemEnd(t)}function l(u){h(),s&&s(u),Un.remove(`image:${t}`);const f=Di.get(this)||[];for(let d=0;d<f.length;d++){const x=f[d];x.onError&&x.onError(u)}Di.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Un.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}}class Wf extends Ws{constructor(t){super(t)}load(t,e,n,s){const r=new Ue,o=new Xf(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}}class xo extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class o_ extends xo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ta=new Xt,sl=new D,rl=new D;class tc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pt(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $a,this._frameExtents=new pt(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;sl.setFromMatrixPosition(t.matrixWorld),e.position.copy(sl),rl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(rl),e.updateMatrixWorld(),ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ta,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Zf extends tc{constructor(){super(new Ke(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=ts*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class a_ extends xo{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Zf}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const ol=new Xt,_s=new D,ea=new D;class Yf extends tc{constructor(){super(new Ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pt(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),_s.setFromMatrixPosition(t.matrixWorld),n.position.copy(_s),ea.copy(n.position),ea.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ea),n.updateMatrixWorld(),s.makeTranslation(-_s.x,-_s.y,-_s.z),ol.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ol,n.coordinateSystem,n.reversedDepth)}}class c_ extends xo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Yf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Dh extends fh{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class qf extends tc{constructor(){super(new Dh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class l_ extends xo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new qf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class h_{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}const na=new WeakMap;class u_ extends Ws{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=Un.get(`image-bitmap:${t}`);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(l=>{if(na.has(o)===!0)s&&s(na.get(o)),r.manager.itemError(t),r.manager.itemEnd(t);else return e&&e(l),r.manager.itemEnd(t),l});return}return setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Un.add(`image-bitmap:${t}`,l),e&&e(l),r.manager.itemEnd(t),l}).catch(function(l){s&&s(l),na.set(c,l),Un.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});Un.add(`image-bitmap:${t}`,c),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class $f extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const ec="\\[\\]\\.:\\/",Jf=new RegExp("["+ec+"]","g"),nc="[^"+ec+"]",Kf="[^"+ec.replace("\\.","")+"]",jf=/((?:WC+[\/:])*)/.source.replace("WC",nc),Qf=/(WCOD+)?/.source.replace("WCOD",Kf),td=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nc),ed=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nc),nd=new RegExp("^"+jf+Qf+td+ed+"$"),id=["material","materials","bones","map"];class sd{constructor(t,e,n){const s=n||oe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class oe{constructor(t,e,n){this.path=e,this.parsedPath=n||oe.parseTrackName(e),this.node=oe.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new oe.Composite(t,e,n):new oe(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Jf,"")}static parseTrackName(t){const e=nd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);id.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===e||a.uuid===e)return a;const c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=oe.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}const o=t[s];if(o===void 0){const l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}oe.Composite=sd;oe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};oe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};oe.prototype.GetterByBindingType=[oe.prototype._getValue_direct,oe.prototype._getValue_array,oe.prototype._getValue_arrayElement,oe.prototype._getValue_toArray];oe.prototype.SetterByBindingTypeAndVersioning=[[oe.prototype._setValue_direct,oe.prototype._setValue_direct_setNeedsUpdate,oe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_array,oe.prototype._setValue_array_setNeedsUpdate,oe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_arrayElement,oe.prototype._setValue_arrayElement_setNeedsUpdate,oe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[oe.prototype._setValue_fromArray,oe.prototype._setValue_fromArray_setNeedsUpdate,oe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const al=new Xt;class f_{constructor(t,e,n=0,s=1/0){this.ray=new _i(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ya,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return al.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(al),this}intersectObject(t,e=!0,n=[]){return Ca(t,this,n,e),n.sort(cl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Ca(t[s],this,n,e);return n.sort(cl),n}}function cl(i,t){return i.distance-t.distance}function Ca(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Ca(r[o],t,e,!0)}}const ll=new D,Er=new D,Ui=new D,Ni=new D,ia=new D,rd=new D,od=new D;class zn{constructor(t=new D,e=new D){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){ll.subVectors(t,this.start),Er.subVectors(this.end,this.start);const n=Er.dot(Er);let r=Er.dot(ll)/n;return e&&(r=Wt(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=rd,n=od){const s=10000000000000001e-32;let r,o;const a=this.start,c=t.start,l=this.end,h=t.end;Ui.subVectors(l,a),Ni.subVectors(h,c),ia.subVectors(a,c);const u=Ui.dot(Ui),f=Ni.dot(Ni),d=Ni.dot(ia);if(u<=s&&f<=s)return e.copy(a),n.copy(c),e.sub(n),e.dot(e);if(u<=s)r=0,o=d/f,o=Wt(o,0,1);else{const x=Ui.dot(ia);if(f<=s)o=0,r=Wt(-x/u,0,1);else{const M=Ui.dot(Ni),_=u*f-M*M;_!==0?r=Wt((M*d-x*f)/_,0,1):r=0,o=(M*r+d)/f,o<0?(o=0,r=Wt(-x/u,0,1)):o>1&&(o=1,r=Wt((M-x)/u,0,1))}}return e.copy(a).add(Ui.multiplyScalar(r)),n.copy(c).add(Ni.multiplyScalar(o)),e.sub(n),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function hl(i,t,e,n){const s=ad(n);switch(e){case 1021:return i*t;case 1028:return i*t/s.components*s.byteLength;case 1029:return i*t/s.components*s.byteLength;case 1030:return i*t*2/s.components*s.byteLength;case 1031:return i*t*2/s.components*s.byteLength;case 1022:return i*t*3/s.components*s.byteLength;case 1023:return i*t*4/s.components*s.byteLength;case 1033:return i*t*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(t,8)/2;case 36196:case 37492:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case 37496:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ad(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Uh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function cd(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,x)=>d.start-x.start);let f=0;for(let d=1;d<u.length;d++){const x=u[f],M=u[d];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++f,u[f]=M)}u.length=f+1;for(let d=0,x=u.length;d<x;d++){const M=u[d];i.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var ld=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hd=`#ifdef USE_ALPHAHASH
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
#endif`,ud=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,md=`#ifdef USE_AOMAP
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
#endif`,gd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xd=`#ifdef USE_BATCHING
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
#endif`,_d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Md=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sd=`#ifdef USE_IRIDESCENCE
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
#endif`,bd=`#ifdef USE_BUMPMAP
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
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ed=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ld=`#define PI 3.141592653589793
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
} // validated`,Dd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ud=`vec3 transformedNormal = objectNormal;
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
#endif`,Nd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Od="gl_FragColor = linearToOutputTexel( gl_FragColor );",kd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vd=`#ifdef USE_ENVMAP
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
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hd=`#ifdef USE_ENVMAP
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
#endif`,Xd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wd=`#ifdef USE_ENVMAP
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
#endif`,Zd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$d=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jd=`#ifdef USE_GRADIENTMAP
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
}`,Kd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tp=`uniform bool receiveShadow;
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
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,np=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ip=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,op=`PhysicalMaterial material;
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
#endif`,ap=`struct PhysicalMaterial {
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
}`,cp=`
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
#endif`,lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,hp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_p=`#if defined( USE_POINTS_UV )
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
#endif`,yp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ep=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ip=`#ifdef USE_NORMALMAP
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
#endif`,Lp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Up=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Np=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Yp=`float getShadowMask() {
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
}`,qp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$p=`#ifdef USE_SKINNING
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
#endif`,Jp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kp=`#ifdef USE_SKINNING
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
#endif`,jp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,em=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nm=`#ifdef USE_TRANSMISSION
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
#endif`,im=`#ifdef USE_TRANSMISSION
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
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,am=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lm=`uniform sampler2D t2D;
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
}`,hm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,um=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`#include <common>
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
}`,mm=`#if DEPTH_PACKING == 3200
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
}`,gm=`#define DISTANCE
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
}`,xm=`#define DISTANCE
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
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ym=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vm=`uniform float scale;
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
}`,Mm=`uniform vec3 diffuse;
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
}`,Sm=`#include <common>
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
}`,bm=`uniform vec3 diffuse;
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
}`,Tm=`#define LAMBERT
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
}`,Em=`#define LAMBERT
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
}`,Am=`#define MATCAP
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
}`,wm=`#define MATCAP
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
}`,Rm=`#define NORMAL
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
}`,Cm=`#define NORMAL
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
}`,Pm=`#define PHONG
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
}`,Im=`#define PHONG
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
}`,Lm=`#define STANDARD
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
}`,Dm=`#define STANDARD
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
}`,Um=`#define TOON
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
}`,Nm=`#define TOON
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
}`,Fm=`uniform float size;
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
}`,zm=`uniform vec3 diffuse;
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
}`,Bm=`#include <common>
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
}`,Om=`uniform vec3 color;
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
}`,km=`uniform float rotation;
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
}`,Vm=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:ld,alphahash_pars_fragment:hd,alphamap_fragment:ud,alphamap_pars_fragment:fd,alphatest_fragment:dd,alphatest_pars_fragment:pd,aomap_fragment:md,aomap_pars_fragment:gd,batching_pars_vertex:xd,batching_vertex:_d,begin_vertex:yd,beginnormal_vertex:vd,bsdfs:Md,iridescence_fragment:Sd,bumpmap_pars_fragment:bd,clipping_planes_fragment:Td,clipping_planes_pars_fragment:Ed,clipping_planes_pars_vertex:Ad,clipping_planes_vertex:wd,color_fragment:Rd,color_pars_fragment:Cd,color_pars_vertex:Pd,color_vertex:Id,common:Ld,cube_uv_reflection_fragment:Dd,defaultnormal_vertex:Ud,displacementmap_pars_vertex:Nd,displacementmap_vertex:Fd,emissivemap_fragment:zd,emissivemap_pars_fragment:Bd,colorspace_fragment:Od,colorspace_pars_fragment:kd,envmap_fragment:Vd,envmap_common_pars_fragment:Gd,envmap_pars_fragment:Hd,envmap_pars_vertex:Xd,envmap_physical_pars_fragment:ep,envmap_vertex:Wd,fog_vertex:Zd,fog_pars_vertex:Yd,fog_fragment:qd,fog_pars_fragment:$d,gradientmap_pars_fragment:Jd,lightmap_pars_fragment:Kd,lights_lambert_fragment:jd,lights_lambert_pars_fragment:Qd,lights_pars_begin:tp,lights_toon_fragment:np,lights_toon_pars_fragment:ip,lights_phong_fragment:sp,lights_phong_pars_fragment:rp,lights_physical_fragment:op,lights_physical_pars_fragment:ap,lights_fragment_begin:cp,lights_fragment_maps:lp,lights_fragment_end:hp,logdepthbuf_fragment:up,logdepthbuf_pars_fragment:fp,logdepthbuf_pars_vertex:dp,logdepthbuf_vertex:pp,map_fragment:mp,map_pars_fragment:gp,map_particle_fragment:xp,map_particle_pars_fragment:_p,metalnessmap_fragment:yp,metalnessmap_pars_fragment:vp,morphinstance_vertex:Mp,morphcolor_vertex:Sp,morphnormal_vertex:bp,morphtarget_pars_vertex:Tp,morphtarget_vertex:Ep,normal_fragment_begin:Ap,normal_fragment_maps:wp,normal_pars_fragment:Rp,normal_pars_vertex:Cp,normal_vertex:Pp,normalmap_pars_fragment:Ip,clearcoat_normal_fragment_begin:Lp,clearcoat_normal_fragment_maps:Dp,clearcoat_pars_fragment:Up,iridescence_pars_fragment:Np,opaque_fragment:Fp,packing:zp,premultiplied_alpha_fragment:Bp,project_vertex:Op,dithering_fragment:kp,dithering_pars_fragment:Vp,roughnessmap_fragment:Gp,roughnessmap_pars_fragment:Hp,shadowmap_pars_fragment:Xp,shadowmap_pars_vertex:Wp,shadowmap_vertex:Zp,shadowmask_pars_fragment:Yp,skinbase_vertex:qp,skinning_pars_vertex:$p,skinning_vertex:Jp,skinnormal_vertex:Kp,specularmap_fragment:jp,specularmap_pars_fragment:Qp,tonemapping_fragment:tm,tonemapping_pars_fragment:em,transmission_fragment:nm,transmission_pars_fragment:im,uv_pars_fragment:sm,uv_pars_vertex:rm,uv_vertex:om,worldpos_vertex:am,background_vert:cm,background_frag:lm,backgroundCube_vert:hm,backgroundCube_frag:um,cube_vert:fm,cube_frag:dm,depth_vert:pm,depth_frag:mm,distanceRGBA_vert:gm,distanceRGBA_frag:xm,equirect_vert:_m,equirect_frag:ym,linedashed_vert:vm,linedashed_frag:Mm,meshbasic_vert:Sm,meshbasic_frag:bm,meshlambert_vert:Tm,meshlambert_frag:Em,meshmatcap_vert:Am,meshmatcap_frag:wm,meshnormal_vert:Rm,meshnormal_frag:Cm,meshphong_vert:Pm,meshphong_frag:Im,meshphysical_vert:Lm,meshphysical_frag:Dm,meshtoon_vert:Um,meshtoon_frag:Nm,points_vert:Fm,points_frag:zm,shadow_vert:Bm,shadow_frag:Om,sprite_vert:km,sprite_frag:Vm},Tt={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},xn={basic:{uniforms:Ge([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Ge([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Ge([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Ge([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Ge([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Ge([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Ge([Tt.points,Tt.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Ge([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Ge([Tt.common,Tt.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Ge([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Ge([Tt.sprite,Tt.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:Ge([Tt.common,Tt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:Ge([Tt.lights,Tt.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};xn.physical={uniforms:Ge([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Ar={r:0,b:0,g:0},oi=new fn,Gm=new Xt;function Hm(i,t,e,n,s,r,o){const a=new Ht(0);let c=r===!0?0:1,l,h,u=null,f=0,d=null;function x(m){let g=m.isScene===!0?m.background:null;return g&&g.isTexture&&(g=(m.backgroundBlurriness>0?e:t).get(g)),g}function M(m){let g=!1;const S=x(m);S===null?p(a,c):S&&S.isColor&&(p(S,1),g=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(m,g){const S=x(g);S&&(S.isCubeTexture||S.mapping===306)?(h===void 0&&(h=new He(new Ln(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:es(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),oi.copy(g.backgroundRotation),oi.x*=-1,oi.y*=-1,oi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gm.makeRotationFromEuler(oi)),h.material.toneMapped=Qt.getTransfer(S.colorSpace)!==re,(u!==S||f!==S.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=S,f=S.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new He(new po(2,2),new Kn({name:"BackgroundMaterial",uniforms:es(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(S.colorSpace)!==re,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||f!==S.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,f=S.version,d=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function p(m,g){m.getRGB(Ar,uh(i)),n.buffers.color.setClear(Ar.r,Ar.g,Ar.b,g,o)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(m,g=1){a.set(m),c=g,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,p(a,c)},render:M,addToRenderList:_,dispose:v}}function Xm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(b,y,R,C,I){let N=!1;const z=u(C,R,y);r!==z&&(r=z,l(r.object)),N=d(b,C,R,I),N&&x(b,C,R,I),I!==null&&t.update(I,i.ELEMENT_ARRAY_BUFFER),(N||o)&&(o=!1,g(b,y,R,C),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,y,R){const C=R.wireframe===!0;let I=n[b.id];I===void 0&&(I={},n[b.id]=I);let N=I[y.id];N===void 0&&(N={},I[y.id]=N);let z=N[C];return z===void 0&&(z=f(c()),N[C]=z),z}function f(b){const y=[],R=[],C=[];for(let I=0;I<e;I++)y[I]=0,R[I]=0,C[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:R,attributeDivisors:C,object:b,attributes:{},index:null}}function d(b,y,R,C){const I=r.attributes,N=y.attributes;let z=0;const k=R.getAttributes();for(const B in k)if(k[B].location>=0){const j=I[B];let q=N[B];if(q===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(q=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(q=b.instanceColor)),j===void 0||j.attribute!==q||q&&j.data!==q.data)return!0;z++}return r.attributesNum!==z||r.index!==C}function x(b,y,R,C){const I={},N=y.attributes;let z=0;const k=R.getAttributes();for(const B in k)if(k[B].location>=0){let j=N[B];j===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(j=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(j=b.instanceColor));const q={};q.attribute=j,j&&j.data&&(q.data=j.data),I[B]=q,z++}r.attributes=I,r.attributesNum=z,r.index=C}function M(){const b=r.newAttributes;for(let y=0,R=b.length;y<R;y++)b[y]=0}function _(b){p(b,0)}function p(b,y){const R=r.newAttributes,C=r.enabledAttributes,I=r.attributeDivisors;R[b]=1,C[b]===0&&(i.enableVertexAttribArray(b),C[b]=1),I[b]!==y&&(i.vertexAttribDivisor(b,y),I[b]=y)}function v(){const b=r.newAttributes,y=r.enabledAttributes;for(let R=0,C=y.length;R<C;R++)y[R]!==b[R]&&(i.disableVertexAttribArray(R),y[R]=0)}function m(b,y,R,C,I,N,z){z===!0?i.vertexAttribIPointer(b,y,R,I,N):i.vertexAttribPointer(b,y,R,C,I,N)}function g(b,y,R,C){M();const I=C.attributes,N=R.getAttributes(),z=y.defaultAttributeValues;for(const k in N){const B=N[k];if(B.location>=0){let $=I[k];if($===void 0&&(k==="instanceMatrix"&&b.instanceMatrix&&($=b.instanceMatrix),k==="instanceColor"&&b.instanceColor&&($=b.instanceColor)),$!==void 0){const j=$.normalized,q=$.itemSize,nt=t.get($);if(nt===void 0)continue;const ft=nt.buffer,ot=nt.type,W=nt.bytesPerElement,O=ot===i.INT||ot===i.UNSIGNED_INT||$.gpuType===1013;if($.isInterleavedBufferAttribute){const H=$.data,at=H.stride,dt=$.offset;if(H.isInstancedInterleavedBuffer){for(let ht=0;ht<B.locationSize;ht++)p(B.location+ht,H.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let ht=0;ht<B.locationSize;ht++)_(B.location+ht);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let ht=0;ht<B.locationSize;ht++)m(B.location+ht,q/B.locationSize,ot,j,at*W,(dt+q/B.locationSize*ht)*W,O)}else{if($.isInstancedBufferAttribute){for(let H=0;H<B.locationSize;H++)p(B.location+H,$.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let H=0;H<B.locationSize;H++)_(B.location+H);i.bindBuffer(i.ARRAY_BUFFER,ft);for(let H=0;H<B.locationSize;H++)m(B.location+H,q/B.locationSize,ot,j,q*W,q/B.locationSize*H*W,O)}}else if(z!==void 0){const j=z[k];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(B.location,j);break;case 3:i.vertexAttrib3fv(B.location,j);break;case 4:i.vertexAttrib4fv(B.location,j);break;default:i.vertexAttrib1fv(B.location,j)}}}}v()}function S(){A();for(const b in n){const y=n[b];for(const R in y){const C=y[R];for(const I in C)h(C[I].object),delete C[I];delete y[R]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;const y=n[b.id];for(const R in y){const C=y[R];for(const I in C)h(C[I].object),delete C[I];delete y[R]}delete n[b.id]}function w(b){for(const y in n){const R=n[y];if(R[b.id]===void 0)continue;const C=R[b.id];for(const I in C)h(C[I].object),delete C[I];delete R[b.id]}}function A(){T(),o=!0,r!==s&&(r=s,l(r.object))}function T(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:T,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfProgram:w,initAttributes:M,enableAttribute:_,disableUnusedAttributes:v}}function Wm(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let x=0;x<u;x++)d+=h[x];e.update(d,n,1)}function c(l,h,u,f){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let x=0;x<l.length;x++)o(l[x],h[x],f[x]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let x=0;for(let M=0;M<u;M++)x+=h[M]*f[M];e.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Zm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==1023&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const A=w===1016&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==1009&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==1015&&!A)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),m=i.getParameter(i.MAX_VARYING_VECTORS),g=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=x>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:_,maxAttributes:p,maxVertexUniforms:v,maxVaryings:m,maxFragmentUniforms:g,vertexTextures:S,maxSamples:E}}function Ym(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Rn,a=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const x=u.clippingPlanes,M=u.clipIntersection,_=u.clipShadows,p=i.get(u);if(!s||x===null||x.length===0||r&&!_)r?h(null):l();else{const v=r?0:n,m=v*4;let g=p.clippingState||null;c.value=g,g=h(x,f,m,d);for(let S=0;S!==m;++S)g[S]=e[S];p.clippingState=g,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,x){const M=u!==null?u.length:0;let _=null;if(M!==0){if(_=c.value,x!==!0||_===null){const p=d+M*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(_===null||_.length<p)&&(_=new Float32Array(p));for(let m=0,g=d;m!==M;++m,g+=4)o.copy(u[m]).applyMatrix4(v,a),o.normal.toArray(_,g),_[g+3]=o.constant}c.value=_,c.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,_}}function qm(i){let t=new WeakMap;function e(o,a){return a===303?o.mapping=301:a===304&&(o.mapping=302),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===303||a===304)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Ou(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const qi=4,ul=[.125,.215,.35,.446,.526,.582],fi=20,sa=new Dh,fl=new Ht;let ra=null,oa=0,aa=0,ca=!1;const ui=(1+Math.sqrt(5))/2,Fi=1/ui,dl=[new D(-ui,Fi,0),new D(ui,Fi,0),new D(-Fi,0,ui),new D(Fi,0,ui),new D(0,ui,-Fi),new D(0,ui,Fi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],$m=new D;class pl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=$m}=r;ra=this._renderer.getRenderTarget(),oa=this._renderer.getActiveCubeFace(),aa=this._renderer.getActiveMipmapLevel(),ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ra,oa,aa),this._renderer.xr.enabled=ca,t.scissorTest=!1,wr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===301||t.mapping===302?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ra=this._renderer.getRenderTarget(),oa=this._renderer.getActiveCubeFace(),aa=this._renderer.getActiveMipmapLevel(),ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:Qi,depthBuffer:!1},s=ml(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ml(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jm(r)),this._blurMaterial=Km(r,t,e)}return s}_compileMaterial(t){const e=new He(this._lodPlanes[0],t);this._renderer.compile(e,sa)}_sceneToCubeUV(t,e,n,s,r){const c=new Ke(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(fl),u.toneMapping=0,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const M=new me({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),_=new He(new Ln,M);let p=!1;const v=t.background;v?v.isColor&&(M.color.copy(v),t.background=null,p=!0):(M.color.copy(fl),p=!0);for(let m=0;m<6;m++){const g=m%3;g===0?(c.up.set(0,l[m],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[m],r.y,r.z)):g===1?(c.up.set(0,0,l[m]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[m],r.z)):(c.up.set(0,l[m],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[m]));const S=this._cubeSize;wr(s,g*S,m>2?S:0,S,S),u.setRenderTarget(s),p&&u.render(_,c),u.render(t,c)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===301||t.mapping===302;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gl());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new He(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;wr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,sa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=dl[(s-r-1)%dl.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new He(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*fi-1),M=r/x,_=isFinite(r)?1+Math.floor(h*M):fi;_>fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${_} samples when the maximum is set to ${fi}`);const p=[];let v=0;for(let w=0;w<fi;++w){const A=w/M,T=Math.exp(-A*A/2);p.push(T),w===0?v+=T:w<_&&(v+=2*T)}for(let w=0;w<p.length;w++)p[w]=p[w]/v;f.envMap.value=t.texture,f.samples.value=_,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:m}=this;f.dTheta.value=x,f.mipInt.value=m-n;const g=this._sizeLods[s],S=3*g*(s>m-qi?s-m+qi:0),E=4*(this._cubeSize-g);wr(e,S,E,3*g,2*g),c.setRenderTarget(e),c.render(u,sa)}}function Jm(i){const t=[],e=[],n=[];let s=i;const r=i-qi+1+ul.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-qi?c=ul[o-i+qi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,x=6,M=3,_=2,p=1,v=new Float32Array(M*x*d),m=new Float32Array(_*x*d),g=new Float32Array(p*x*d);for(let E=0;E<d;E++){const w=E%3*2/3-1,A=E>2?0:-1,T=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];v.set(T,M*x*E),m.set(f,_*x*E);const b=[E,E,E,E,E,E];g.set(b,p*x*E)}const S=new ne;S.setAttribute("position",new Se(v,M)),S.setAttribute("uv",new Se(m,_)),S.setAttribute("faceIndex",new Se(g,p)),t.push(S),s>qi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ml(i,t,e){const n=new gi(i,t,e);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function wr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Km(i,t,e){const n=new Float32Array(fi),s=new D(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:fi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ic(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function gl(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ic(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function xl(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ic(){return`

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
	`}function jm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===303||c===304,h=c===301||c===302;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new pl(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new pl(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Qm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Os("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function tg(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const x in f.attributes)t.remove(f.attributes[x]);f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(t.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const d in f)t.update(f[d],i.ARRAY_BUFFER)}function l(u){const f=[],d=u.index,x=u.attributes.position;let M=0;if(d!==null){const v=d.array;M=d.version;for(let m=0,g=v.length;m<g;m+=3){const S=v[m+0],E=v[m+1],w=v[m+2];f.push(S,E,E,w,w,S)}}else if(x!==void 0){const v=x.array;M=x.version;for(let m=0,g=v.length/3-1;m<g;m+=3){const S=m+0,E=m+1,w=m+2;f.push(S,E,E,w,w,S)}}else return;const _=new(oh(f)?hh:lh)(f,1);_.version=M;const p=r.get(u);p&&t.remove(p),r.set(u,_)}function h(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function eg(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*o),e.update(d,n,1)}function l(f,d,x){x!==0&&(i.drawElementsInstanced(n,d,r,f*o,x),e.update(d,n,x))}function h(f,d,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,x);let _=0;for(let p=0;p<x;p++)_+=d[p];e.update(_,n,1)}function u(f,d,x,M){if(x===0)return;const _=t.get("WEBGL_multi_draw");if(_===null)for(let p=0;p<f.length;p++)l(f[p]/o,d[p],M[p]);else{_.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,M,0,x);let p=0;for(let v=0;v<x;v++)p+=d[v]*M[v];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ng(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ig(i,t,e){const n=new WeakMap,s=new te;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let T=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",T)};f!==void 0&&f.texture.dispose();const d=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,M=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let m=0;d===!0&&(m=1),x===!0&&(m=2),M===!0&&(m=3);let g=a.attributes.position.count*m,S=1;g>t.maxTextureSize&&(S=Math.ceil(g/t.maxTextureSize),g=t.maxTextureSize);const E=new Float32Array(g*S*4*u),w=new ah(E,g,S,u);w.type=1015,w.needsUpdate=!0;const A=m*4;for(let b=0;b<u;b++){const y=_[b],R=p[b],C=v[b],I=g*S*4*b;for(let N=0;N<y.count;N++){const z=N*A;d===!0&&(s.fromBufferAttribute(y,N),E[I+z+0]=s.x,E[I+z+1]=s.y,E[I+z+2]=s.z,E[I+z+3]=0),x===!0&&(s.fromBufferAttribute(R,N),E[I+z+4]=s.x,E[I+z+5]=s.y,E[I+z+6]=s.z,E[I+z+7]=0),M===!0&&(s.fromBufferAttribute(C,N),E[I+z+8]=s.x,E[I+z+9]=s.y,E[I+z+10]=s.z,E[I+z+11]=C.itemSize===4?s.w:1)}}f={count:u,texture:w,size:new pt(g,S)},n.set(a,f),a.addEventListener("dispose",T)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let M=0;M<l.length;M++)d+=l[M];const x=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function sg(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const Nh=new Ue,_l=new xh(1,1),Fh=new ah,zh=new Su,Bh=new dh,yl=[],vl=[],Ml=new Float32Array(16),Sl=new Float32Array(9),bl=new Float32Array(4);function cs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=yl[s];if(r===void 0&&(r=new Float32Array(s),yl[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function _o(i,t){let e=vl[t];e===void 0&&(e=new Int32Array(t),vl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function rg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function lg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;bl.set(n),i.uniformMatrix2fv(this.addr,!1,bl),Re(e,n)}}function hg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;Sl.set(n),i.uniformMatrix3fv(this.addr,!1,Sl),Re(e,n)}}function ug(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;Ml.set(n),i.uniformMatrix4fv(this.addr,!1,Ml),Re(e,n)}}function fg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function gg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function vg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(_l.compareFunction=515,r=_l):r=Nh,e.setTexture2D(t||r,s)}function Mg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||zh,s)}function Sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Bh,s)}function bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Fh,s)}function Tg(i){switch(i){case 5126:return rg;case 35664:return og;case 35665:return ag;case 35666:return cg;case 35674:return lg;case 35675:return hg;case 35676:return ug;case 5124:case 35670:return fg;case 35667:case 35671:return dg;case 35668:case 35672:return pg;case 35669:case 35673:return mg;case 5125:return gg;case 36294:return xg;case 36295:return _g;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return vg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return Sg;case 36289:case 36303:case 36311:case 36292:return bg}}function Eg(i,t){i.uniform1fv(this.addr,t)}function Ag(i,t){const e=cs(t,this.size,2);i.uniform2fv(this.addr,e)}function wg(i,t){const e=cs(t,this.size,3);i.uniform3fv(this.addr,e)}function Rg(i,t){const e=cs(t,this.size,4);i.uniform4fv(this.addr,e)}function Cg(i,t){const e=cs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Pg(i,t){const e=cs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ig(i,t){const e=cs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Lg(i,t){i.uniform1iv(this.addr,t)}function Dg(i,t){i.uniform2iv(this.addr,t)}function Ug(i,t){i.uniform3iv(this.addr,t)}function Ng(i,t){i.uniform4iv(this.addr,t)}function Fg(i,t){i.uniform1uiv(this.addr,t)}function zg(i,t){i.uniform2uiv(this.addr,t)}function Bg(i,t){i.uniform3uiv(this.addr,t)}function Og(i,t){i.uniform4uiv(this.addr,t)}function kg(i,t,e){const n=this.cache,s=t.length,r=_o(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Nh,r[o])}function Vg(i,t,e){const n=this.cache,s=t.length,r=_o(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||zh,r[o])}function Gg(i,t,e){const n=this.cache,s=t.length,r=_o(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Bh,r[o])}function Hg(i,t,e){const n=this.cache,s=t.length,r=_o(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Fh,r[o])}function Xg(i){switch(i){case 5126:return Eg;case 35664:return Ag;case 35665:return wg;case 35666:return Rg;case 35674:return Cg;case 35675:return Pg;case 35676:return Ig;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ug;case 35669:case 35673:return Ng;case 5125:return Fg;case 36294:return zg;case 36295:return Bg;case 36296:return Og;case 35678:case 36198:case 36298:case 36306:case 35682:return kg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return Gg;case 36289:case 36303:case 36311:case 36292:return Hg}}class Wg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tg(e.type)}}class Zg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xg(e.type)}}class Yg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const la=/(\w+)(\])?(\[|\.)?/g;function Tl(i,t){i.seq.push(t),i.map[t.id]=t}function qg(i,t,e){const n=i.name,s=n.length;for(la.lastIndex=0;;){const r=la.exec(n),o=la.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Tl(e,l===void 0?new Wg(a,i,t):new Zg(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Yg(a),Tl(e,u)),e=u}}}class Yr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);qg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function El(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const $g=37297;let Jg=0;function Kg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Al=new $t;function jg(i){Qt._getMatrix(Al,Qt.workingColorSpace,i);const t=`mat3( ${Al.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(i)){case jr:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function wl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Kg(i.getShaderSource(t),a)}else return r}function Qg(i,t){const e=jg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function t0(i,t){let e;switch(t){case 1:e="Linear";break;case 2:e="Reinhard";break;case 3:e="Cineon";break;case 4:e="ACESFilmic";break;case 6:e="AgX";break;case 7:e="Neutral";break;case 5:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Rr=new D;function e0(){Qt.getLuminanceCoefficients(Rr);const i=Rr.x.toFixed(4),t=Rr.y.toFixed(4),e=Rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cs).join(`
`)}function i0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function s0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Cs(i){return i!==""}function Rl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Cl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const r0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pa(i){return i.replace(r0,a0)}const o0=new Map;function a0(i,t){let e=Jt[t];if(e===void 0){const n=o0.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Pa(e)}const c0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pl(i){return i.replace(c0,l0)}function l0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Il(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function h0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(t="SHADOWMAP_TYPE_VSM"),t}function u0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:t="ENVMAP_TYPE_CUBE";break;case 306:t="ENVMAP_TYPE_CUBE_UV";break}return t}function f0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:t="ENVMAP_MODE_REFRACTION";break}return t}function d0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:t="ENVMAP_BLENDING_MULTIPLY";break;case 1:t="ENVMAP_BLENDING_MIX";break;case 2:t="ENVMAP_BLENDING_ADD";break}return t}function p0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function m0(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=h0(e),l=u0(e),h=f0(e),u=d0(e),f=p0(e),d=n0(e),x=i0(r),M=s.createProgram();let _,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(_=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Cs).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Cs).join(`
`),p.length>0&&(p+=`
`)):(_=[Il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),p=[Il(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==0?"#define TONE_MAPPING":"",e.toneMapping!==0?Jt.tonemapping_pars_fragment:"",e.toneMapping!==0?t0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,Qg("linearToOutputTexel",e.outputColorSpace),e0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Cs).join(`
`)),o=Pa(o),o=Rl(o,e),o=Cl(o,e),a=Pa(a),a=Rl(a,e),a=Cl(a,e),o=Pl(o),a=Pl(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,_=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",e.glslVersion===_c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===_c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const m=v+_+o,g=v+p+a,S=El(s,s.VERTEX_SHADER,m),E=El(s,s.FRAGMENT_SHADER,g);s.attachShader(M,S),s.attachShader(M,E),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function w(y){if(i.debug.checkShaderErrors){const R=s.getProgramInfoLog(M)||"",C=s.getShaderInfoLog(S)||"",I=s.getShaderInfoLog(E)||"",N=R.trim(),z=C.trim(),k=I.trim();let B=!0,$=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,S,E);else{const j=wl(s,S,"vertex"),q=wl(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+N+`
`+j+`
`+q)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(z===""||k==="")&&($=!1);$&&(y.diagnostics={runnable:B,programLog:N,vertexShader:{log:z,prefix:_},fragmentShader:{log:k,prefix:p}})}s.deleteShader(S),s.deleteShader(E),A=new Yr(s,M),T=s0(s,M)}let A;this.getUniforms=function(){return A===void 0&&w(this),A};let T;this.getAttributes=function(){return T===void 0&&w(this),T};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(M,$g)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jg++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=S,this.fragmentShader=E,this}let g0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new _0(t),e.set(t,n)),n}}class _0{constructor(t){this.id=g0++,this.code=t,this.usedTimes=0}}function y0(i,t,e,n,s,r,o){const a=new Ya,c=new x0,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(T){return l.add(T),T===0?"uv":`uv${T}`}function _(T,b,y,R,C){const I=R.fog,N=C.geometry,z=T.isMeshStandardMaterial?R.environment:null,k=(T.isMeshStandardMaterial?e:t).get(T.envMap||z),B=k&&k.mapping===306?k.image.height:null,$=x[T.type];T.precision!==null&&(d=s.getMaxPrecision(T.precision),d!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",d,"instead."));const j=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,q=j!==void 0?j.length:0;let nt=0;N.morphAttributes.position!==void 0&&(nt=1),N.morphAttributes.normal!==void 0&&(nt=2),N.morphAttributes.color!==void 0&&(nt=3);let ft,ot,W,O;if($){const ee=xn[$];ft=ee.vertexShader,ot=ee.fragmentShader}else ft=T.vertexShader,ot=T.fragmentShader,c.update(T),W=c.getVertexShaderID(T),O=c.getFragmentShaderID(T);const H=i.getRenderTarget(),at=i.state.buffers.depth.getReversed(),dt=C.isInstancedMesh===!0,ht=C.isBatchedMesh===!0,vt=!!T.map,Rt=!!T.matcap,F=!!k,rt=!!T.aoMap,st=!!T.lightMap,it=!!T.bumpMap,tt=!!T.normalMap,yt=!!T.displacementMap,G=!!T.emissiveMap,ct=!!T.metalnessMap,Mt=!!T.roughnessMap,Nt=T.anisotropy>0,U=T.clearcoat>0,P=T.dispersion>0,Y=T.iridescence>0,Q=T.sheen>0,ut=T.transmission>0,et=Nt&&!!T.anisotropyMap,Ft=U&&!!T.clearcoatMap,St=U&&!!T.clearcoatNormalMap,Lt=U&&!!T.clearcoatRoughnessMap,Dt=Y&&!!T.iridescenceMap,mt=Y&&!!T.iridescenceThicknessMap,wt=Q&&!!T.sheenColorMap,Vt=Q&&!!T.sheenRoughnessMap,zt=!!T.specularMap,Et=!!T.specularColorMap,qt=!!T.specularIntensityMap,V=ut&&!!T.transmissionMap,_t=ut&&!!T.thicknessMap,bt=!!T.gradientMap,Pt=!!T.alphaMap,gt=T.alphaTest>0,lt=!!T.alphaHash,Ut=!!T.extensions;let Yt=0;T.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(Yt=i.toneMapping);const le={shaderID:$,shaderType:T.type,shaderName:T.name,vertexShader:ft,fragmentShader:ot,defines:T.defines,customVertexShaderID:W,customFragmentShaderID:O,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:d,batching:ht,batchingColor:ht&&C._colorsTexture!==null,instancing:dt,instancingColor:dt&&C.instanceColor!==null,instancingMorph:dt&&C.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:H===null?i.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:Qi,alphaToCoverage:!!T.alphaToCoverage,map:vt,matcap:Rt,envMap:F,envMapMode:F&&k.mapping,envMapCubeUVHeight:B,aoMap:rt,lightMap:st,bumpMap:it,normalMap:tt,displacementMap:f&&yt,emissiveMap:G,normalMapObjectSpace:tt&&T.normalMapType===1,normalMapTangentSpace:tt&&T.normalMapType===0,metalnessMap:ct,roughnessMap:Mt,anisotropy:Nt,anisotropyMap:et,clearcoat:U,clearcoatMap:Ft,clearcoatNormalMap:St,clearcoatRoughnessMap:Lt,dispersion:P,iridescence:Y,iridescenceMap:Dt,iridescenceThicknessMap:mt,sheen:Q,sheenColorMap:wt,sheenRoughnessMap:Vt,specularMap:zt,specularColorMap:Et,specularIntensityMap:qt,transmission:ut,transmissionMap:V,thicknessMap:_t,gradientMap:bt,opaque:T.transparent===!1&&T.blending===1&&T.alphaToCoverage===!1,alphaMap:Pt,alphaTest:gt,alphaHash:lt,combine:T.combine,mapUv:vt&&M(T.map.channel),aoMapUv:rt&&M(T.aoMap.channel),lightMapUv:st&&M(T.lightMap.channel),bumpMapUv:it&&M(T.bumpMap.channel),normalMapUv:tt&&M(T.normalMap.channel),displacementMapUv:yt&&M(T.displacementMap.channel),emissiveMapUv:G&&M(T.emissiveMap.channel),metalnessMapUv:ct&&M(T.metalnessMap.channel),roughnessMapUv:Mt&&M(T.roughnessMap.channel),anisotropyMapUv:et&&M(T.anisotropyMap.channel),clearcoatMapUv:Ft&&M(T.clearcoatMap.channel),clearcoatNormalMapUv:St&&M(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&M(T.clearcoatRoughnessMap.channel),iridescenceMapUv:Dt&&M(T.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&M(T.iridescenceThicknessMap.channel),sheenColorMapUv:wt&&M(T.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&M(T.sheenRoughnessMap.channel),specularMapUv:zt&&M(T.specularMap.channel),specularColorMapUv:Et&&M(T.specularColorMap.channel),specularIntensityMapUv:qt&&M(T.specularIntensityMap.channel),transmissionMapUv:V&&M(T.transmissionMap.channel),thicknessMapUv:_t&&M(T.thicknessMap.channel),alphaMapUv:Pt&&M(T.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(tt||Nt),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!N.attributes.uv&&(vt||Pt),fog:!!I,useFog:T.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:T.flatShading===!0&&T.wireframe===!1,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:at,skinning:C.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:nt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:T.dithering,shadowMapEnabled:i.shadowMap.enabled&&y.length>0,shadowMapType:i.shadowMap.type,toneMapping:Yt,decodeVideoTexture:vt&&T.map.isVideoTexture===!0&&Qt.getTransfer(T.map.colorSpace)===re,decodeVideoTextureEmissive:G&&T.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(T.emissiveMap.colorSpace)===re,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===2,flipSided:T.side===1,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Ut&&T.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ut&&T.extensions.multiDraw===!0||ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return le.vertexUv1s=l.has(1),le.vertexUv2s=l.has(2),le.vertexUv3s=l.has(3),l.clear(),le}function p(T){const b=[];if(T.shaderID?b.push(T.shaderID):(b.push(T.customVertexShaderID),b.push(T.customFragmentShaderID)),T.defines!==void 0)for(const y in T.defines)b.push(y),b.push(T.defines[y]);return T.isRawShaderMaterial===!1&&(v(b,T),m(b,T),b.push(i.outputColorSpace)),b.push(T.customProgramCacheKey),b.join()}function v(T,b){T.push(b.precision),T.push(b.outputColorSpace),T.push(b.envMapMode),T.push(b.envMapCubeUVHeight),T.push(b.mapUv),T.push(b.alphaMapUv),T.push(b.lightMapUv),T.push(b.aoMapUv),T.push(b.bumpMapUv),T.push(b.normalMapUv),T.push(b.displacementMapUv),T.push(b.emissiveMapUv),T.push(b.metalnessMapUv),T.push(b.roughnessMapUv),T.push(b.anisotropyMapUv),T.push(b.clearcoatMapUv),T.push(b.clearcoatNormalMapUv),T.push(b.clearcoatRoughnessMapUv),T.push(b.iridescenceMapUv),T.push(b.iridescenceThicknessMapUv),T.push(b.sheenColorMapUv),T.push(b.sheenRoughnessMapUv),T.push(b.specularMapUv),T.push(b.specularColorMapUv),T.push(b.specularIntensityMapUv),T.push(b.transmissionMapUv),T.push(b.thicknessMapUv),T.push(b.combine),T.push(b.fogExp2),T.push(b.sizeAttenuation),T.push(b.morphTargetsCount),T.push(b.morphAttributeCount),T.push(b.numDirLights),T.push(b.numPointLights),T.push(b.numSpotLights),T.push(b.numSpotLightMaps),T.push(b.numHemiLights),T.push(b.numRectAreaLights),T.push(b.numDirLightShadows),T.push(b.numPointLightShadows),T.push(b.numSpotLightShadows),T.push(b.numSpotLightShadowsWithMaps),T.push(b.numLightProbes),T.push(b.shadowMapType),T.push(b.toneMapping),T.push(b.numClippingPlanes),T.push(b.numClipIntersection),T.push(b.depthPacking)}function m(T,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),T.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),T.push(a.mask)}function g(T){const b=x[T.type];let y;if(b){const R=xn[b];y=Nu.clone(R.uniforms)}else y=T.uniforms;return y}function S(T,b){let y;for(let R=0,C=h.length;R<C;R++){const I=h[R];if(I.cacheKey===b){y=I,++y.usedTimes;break}}return y===void 0&&(y=new m0(i,b,T,r),h.push(y)),y}function E(T){if(--T.usedTimes===0){const b=h.indexOf(T);h[b]=h[h.length-1],h.pop(),T.destroy()}}function w(T){c.remove(T)}function A(){c.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:g,acquireProgram:S,releaseProgram:E,releaseShaderCache:w,programs:h,dispose:A}}function v0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function M0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ll(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Dl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,d,x,M,_){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:x,renderOrder:u.renderOrder,z:M,group:_},i[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=x,p.renderOrder=u.renderOrder,p.z=M,p.group=_),t++,p}function a(u,f,d,x,M,_){const p=o(u,f,d,x,M,_);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(u,f,d,x,M,_){const p=o(u,f,d,x,M,_);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,f){e.length>1&&e.sort(u||M0),n.length>1&&n.sort(f||Ll),s.length>1&&s.sort(f||Ll)}function h(){for(let u=t,f=i.length;u<f;u++){const d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function S0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Dl,i.set(n,[o])):s>=r.length?(o=new Dl,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function b0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Ht};break;case"SpotLight":e={position:new D,direction:new D,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function T0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let E0=0;function A0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function w0(i){const t=new b0,e=T0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new Xt,o=new Xt;function a(l){let h=0,u=0,f=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let d=0,x=0,M=0,_=0,p=0,v=0,m=0,g=0,S=0,E=0,w=0;l.sort(A0);for(let T=0,b=l.length;T<b;T++){const y=l[T],R=y.color,C=y.intensity,I=y.distance,N=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)h+=R.r*C,u+=R.g*C,f+=R.b*C;else if(y.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(y.sh.coefficients[z],C);w++}else if(y.isDirectionalLight){const z=t.get(y);if(z.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){const k=y.shadow,B=e.get(y);B.shadowIntensity=k.intensity,B.shadowBias=k.bias,B.shadowNormalBias=k.normalBias,B.shadowRadius=k.radius,B.shadowMapSize=k.mapSize,n.directionalShadow[d]=B,n.directionalShadowMap[d]=N,n.directionalShadowMatrix[d]=y.shadow.matrix,v++}n.directional[d]=z,d++}else if(y.isSpotLight){const z=t.get(y);z.position.setFromMatrixPosition(y.matrixWorld),z.color.copy(R).multiplyScalar(C),z.distance=I,z.coneCos=Math.cos(y.angle),z.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),z.decay=y.decay,n.spot[M]=z;const k=y.shadow;if(y.map&&(n.spotLightMap[S]=y.map,S++,k.updateMatrices(y),y.castShadow&&E++),n.spotLightMatrix[M]=k.matrix,y.castShadow){const B=e.get(y);B.shadowIntensity=k.intensity,B.shadowBias=k.bias,B.shadowNormalBias=k.normalBias,B.shadowRadius=k.radius,B.shadowMapSize=k.mapSize,n.spotShadow[M]=B,n.spotShadowMap[M]=N,g++}M++}else if(y.isRectAreaLight){const z=t.get(y);z.color.copy(R).multiplyScalar(C),z.halfWidth.set(y.width*.5,0,0),z.halfHeight.set(0,y.height*.5,0),n.rectArea[_]=z,_++}else if(y.isPointLight){const z=t.get(y);if(z.color.copy(y.color).multiplyScalar(y.intensity),z.distance=y.distance,z.decay=y.decay,y.castShadow){const k=y.shadow,B=e.get(y);B.shadowIntensity=k.intensity,B.shadowBias=k.bias,B.shadowNormalBias=k.normalBias,B.shadowRadius=k.radius,B.shadowMapSize=k.mapSize,B.shadowCameraNear=k.camera.near,B.shadowCameraFar=k.camera.far,n.pointShadow[x]=B,n.pointShadowMap[x]=N,n.pointShadowMatrix[x]=y.shadow.matrix,m++}n.point[x]=z,x++}else if(y.isHemisphereLight){const z=t.get(y);z.skyColor.copy(y.color).multiplyScalar(C),z.groundColor.copy(y.groundColor).multiplyScalar(C),n.hemi[p]=z,p++}}_>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const A=n.hash;(A.directionalLength!==d||A.pointLength!==x||A.spotLength!==M||A.rectAreaLength!==_||A.hemiLength!==p||A.numDirectionalShadows!==v||A.numPointShadows!==m||A.numSpotShadows!==g||A.numSpotMaps!==S||A.numLightProbes!==w)&&(n.directional.length=d,n.spot.length=M,n.rectArea.length=_,n.point.length=x,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=m,n.pointShadowMap.length=m,n.spotShadow.length=g,n.spotShadowMap.length=g,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=m,n.spotLightMatrix.length=g+S-E,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=w,A.directionalLength=d,A.pointLength=x,A.spotLength=M,A.rectAreaLength=_,A.hemiLength=p,A.numDirectionalShadows=v,A.numPointShadows=m,A.numSpotShadows=g,A.numSpotMaps=S,A.numLightProbes=w,n.version=E0++)}function c(l,h){let u=0,f=0,d=0,x=0,M=0;const _=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const m=l[p];if(m.isDirectionalLight){const g=n.directional[u];g.direction.setFromMatrixPosition(m.matrixWorld),s.setFromMatrixPosition(m.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(_),u++}else if(m.isSpotLight){const g=n.spot[d];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),g.direction.setFromMatrixPosition(m.matrixWorld),s.setFromMatrixPosition(m.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(_),d++}else if(m.isRectAreaLight){const g=n.rectArea[x];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),o.identity(),r.copy(m.matrixWorld),r.premultiply(_),o.extractRotation(r),g.halfWidth.set(m.width*.5,0,0),g.halfHeight.set(0,m.height*.5,0),g.halfWidth.applyMatrix4(o),g.halfHeight.applyMatrix4(o),x++}else if(m.isPointLight){const g=n.point[f];g.position.setFromMatrixPosition(m.matrixWorld),g.position.applyMatrix4(_),f++}else if(m.isHemisphereLight){const g=n.hemi[M];g.direction.setFromMatrixPosition(m.matrixWorld),g.direction.transformDirection(_),M++}}}return{setup:a,setupView:c,state:n}}function Ul(i){const t=new w0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function R0(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Ul(i),t.set(s,[a])):r>=o.length?(a=new Ul(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const C0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,P0=`uniform sampler2D shadow_pass;
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
}`;function I0(i,t,e){let n=new $a;const s=new pt,r=new pt,o=new te,a=new If({depthPacking:3201}),c=new Lf,l={},h=e.maxTextureSize,u={0:1,1:0,2:2},f=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:C0,fragmentShader:P0}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const x=new ne;x.setAttribute("position",new Se(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new He(x,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(E,w,A){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||E.length===0)return;const T=i.getRenderTarget(),b=i.getActiveCubeFace(),y=i.getActiveMipmapLevel(),R=i.state;R.setBlending(0),R.buffers.depth.getReversed()===!0?R.buffers.color.setClear(0,0,0,0):R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const C=p!==3&&this.type===3,I=p===3&&this.type!==3;for(let N=0,z=E.length;N<z;N++){const k=E[N],B=k.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const $=B.getFrameExtents();if(s.multiply($),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/$.x),s.x=r.x*$.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/$.y),s.y=r.y*$.y,B.mapSize.y=r.y)),B.map===null||C===!0||I===!0){const q=this.type!==3?{minFilter:1003,magFilter:1003}:{};B.map!==null&&B.map.dispose(),B.map=new gi(s.x,s.y,q),B.map.texture.name=k.name+".shadowMap",B.camera.updateProjectionMatrix()}i.setRenderTarget(B.map),i.clear();const j=B.getViewportCount();for(let q=0;q<j;q++){const nt=B.getViewport(q);o.set(r.x*nt.x,r.y*nt.y,r.x*nt.z,r.y*nt.w),R.viewport(o),B.updateMatrices(k,q),n=B.getFrustum(),g(w,A,B.camera,k,this.type)}B.isPointLightShadow!==!0&&this.type===3&&v(B,A),B.needsUpdate=!1}p=this.type,_.needsUpdate=!1,i.setRenderTarget(T,b,y)};function v(E,w){const A=t.update(M);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new gi(s.x,s.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(w,null,A,f,M,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(w,null,A,d,M,null)}function m(E,w,A,T){let b=null;const y=A.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(y!==void 0)b=y;else if(b=A.isPointLight===!0?c:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const R=b.uuid,C=w.uuid;let I=l[R];I===void 0&&(I={},l[R]=I);let N=I[C];N===void 0&&(N=b.clone(),I[C]=N,w.addEventListener("dispose",S)),b=N}if(b.visible=w.visible,b.wireframe=w.wireframe,T===3?b.side=w.shadowSide!==null?w.shadowSide:w.side:b.side=w.shadowSide!==null?w.shadowSide:u[w.side],b.alphaMap=w.alphaMap,b.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,b.map=w.map,b.clipShadows=w.clipShadows,b.clippingPlanes=w.clippingPlanes,b.clipIntersection=w.clipIntersection,b.displacementMap=w.displacementMap,b.displacementScale=w.displacementScale,b.displacementBias=w.displacementBias,b.wireframeLinewidth=w.wireframeLinewidth,b.linewidth=w.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const R=i.properties.get(b);R.light=A}return b}function g(E,w,A,T,b){if(E.visible===!1)return;if(E.layers.test(w.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===3)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,E.matrixWorld);const C=t.update(E),I=E.material;if(Array.isArray(I)){const N=C.groups;for(let z=0,k=N.length;z<k;z++){const B=N[z],$=I[B.materialIndex];if($&&$.visible){const j=m(E,$,T,b);E.onBeforeShadow(i,E,w,A,C,j,B),i.renderBufferDirect(A,null,C,j,E,B),E.onAfterShadow(i,E,w,A,C,j,B)}}}else if(I.visible){const N=m(E,I,T,b);E.onBeforeShadow(i,E,w,A,C,N,null),i.renderBufferDirect(A,null,C,N,E,null),E.onAfterShadow(i,E,w,A,C,N,null)}}const R=E.children;for(let C=0,I=R.length;C<I;C++)g(R[C],w,A,T,b)}function S(E){E.target.removeEventListener("dispose",S);for(const A in l){const T=l[A],b=E.target.uuid;b in T&&(T[b].dispose(),delete T[b])}}}const L0={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};function D0(i,t){function e(){let V=!1;const _t=new te;let bt=null;const Pt=new te(0,0,0,0);return{setMask:function(gt){bt!==gt&&!V&&(i.colorMask(gt,gt,gt,gt),bt=gt)},setLocked:function(gt){V=gt},setClear:function(gt,lt,Ut,Yt,le){le===!0&&(gt*=Yt,lt*=Yt,Ut*=Yt),_t.set(gt,lt,Ut,Yt),Pt.equals(_t)===!1&&(i.clearColor(gt,lt,Ut,Yt),Pt.copy(_t))},reset:function(){V=!1,bt=null,Pt.set(-1,0,0,0)}}}function n(){let V=!1,_t=!1,bt=null,Pt=null,gt=null;return{setReversed:function(lt){if(_t!==lt){const Ut=t.get("EXT_clip_control");lt?Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT):Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT),_t=lt;const Yt=gt;gt=null,this.setClear(Yt)}},getReversed:function(){return _t},setTest:function(lt){lt?H(i.DEPTH_TEST):at(i.DEPTH_TEST)},setMask:function(lt){bt!==lt&&!V&&(i.depthMask(lt),bt=lt)},setFunc:function(lt){if(_t&&(lt=L0[lt]),Pt!==lt){switch(lt){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Pt=lt}},setLocked:function(lt){V=lt},setClear:function(lt){gt!==lt&&(_t&&(lt=1-lt),i.clearDepth(lt),gt=lt)},reset:function(){V=!1,bt=null,Pt=null,gt=null,_t=!1}}}function s(){let V=!1,_t=null,bt=null,Pt=null,gt=null,lt=null,Ut=null,Yt=null,le=null;return{setTest:function(ee){V||(ee?H(i.STENCIL_TEST):at(i.STENCIL_TEST))},setMask:function(ee){_t!==ee&&!V&&(i.stencilMask(ee),_t=ee)},setFunc:function(ee,vn,mn){(bt!==ee||Pt!==vn||gt!==mn)&&(i.stencilFunc(ee,vn,mn),bt=ee,Pt=vn,gt=mn)},setOp:function(ee,vn,mn){(lt!==ee||Ut!==vn||Yt!==mn)&&(i.stencilOp(ee,vn,mn),lt=ee,Ut=vn,Yt=mn)},setLocked:function(ee){V=ee},setClear:function(ee){le!==ee&&(i.clearStencil(ee),le=ee)},reset:function(){V=!1,_t=null,bt=null,Pt=null,gt=null,lt=null,Ut=null,Yt=null,le=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,d=[],x=null,M=!1,_=null,p=null,v=null,m=null,g=null,S=null,E=null,w=new Ht(0,0,0),A=0,T=!1,b=null,y=null,R=null,C=null,I=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,k=0;const B=i.getParameter(i.VERSION);B.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(B)[1]),z=k>=1):B.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),z=k>=2);let $=null,j={};const q=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),ft=new te().fromArray(q),ot=new te().fromArray(nt);function W(V,_t,bt,Pt){const gt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(V,lt),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ut=0;Ut<bt;Ut++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(_t,0,i.RGBA,1,1,Pt,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(_t+Ut,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return lt}const O={};O[i.TEXTURE_2D]=W(i.TEXTURE_2D,i.TEXTURE_2D,1),O[i.TEXTURE_CUBE_MAP]=W(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),O[i.TEXTURE_2D_ARRAY]=W(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),O[i.TEXTURE_3D]=W(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),H(i.DEPTH_TEST),o.setFunc(3),it(!1),tt(1),H(i.CULL_FACE),rt(0);function H(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function at(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function dt(V,_t){return u[V]!==_t?(i.bindFramebuffer(V,_t),u[V]=_t,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=_t),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=_t),!0):!1}function ht(V,_t){let bt=d,Pt=!1;if(V){bt=f.get(_t),bt===void 0&&(bt=[],f.set(_t,bt));const gt=V.textures;if(bt.length!==gt.length||bt[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Ut=gt.length;lt<Ut;lt++)bt[lt]=i.COLOR_ATTACHMENT0+lt;bt.length=gt.length,Pt=!0}}else bt[0]!==i.BACK&&(bt[0]=i.BACK,Pt=!0);Pt&&i.drawBuffers(bt)}function vt(V){return x!==V?(i.useProgram(V),x=V,!0):!1}const Rt={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};Rt[103]=i.MIN,Rt[104]=i.MAX;const F={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function rt(V,_t,bt,Pt,gt,lt,Ut,Yt,le,ee){if(V===0){M===!0&&(at(i.BLEND),M=!1);return}if(M===!1&&(H(i.BLEND),M=!0),V!==5){if(V!==_||ee!==T){if((p!==100||g!==100)&&(i.blendEquation(i.FUNC_ADD),p=100,g=100),ee)switch(V){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case 3:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}v=null,m=null,S=null,E=null,w.set(0,0,0),A=0,_=V,T=ee}return}gt=gt||_t,lt=lt||bt,Ut=Ut||Pt,(_t!==p||gt!==g)&&(i.blendEquationSeparate(Rt[_t],Rt[gt]),p=_t,g=gt),(bt!==v||Pt!==m||lt!==S||Ut!==E)&&(i.blendFuncSeparate(F[bt],F[Pt],F[lt],F[Ut]),v=bt,m=Pt,S=lt,E=Ut),(Yt.equals(w)===!1||le!==A)&&(i.blendColor(Yt.r,Yt.g,Yt.b,le),w.copy(Yt),A=le),_=V,T=!1}function st(V,_t){V.side===2?at(i.CULL_FACE):H(i.CULL_FACE);let bt=V.side===1;_t&&(bt=!bt),it(bt),V.blending===1&&V.transparent===!1?rt(0):rt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),r.setMask(V.colorWrite);const Pt=V.stencilWrite;a.setTest(Pt),Pt&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),G(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?H(i.SAMPLE_ALPHA_TO_COVERAGE):at(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(V){b!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),b=V)}function tt(V){V!==0?(H(i.CULL_FACE),V!==y&&(V===1?i.cullFace(i.BACK):V===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):at(i.CULL_FACE),y=V}function yt(V){V!==R&&(z&&i.lineWidth(V),R=V)}function G(V,_t,bt){V?(H(i.POLYGON_OFFSET_FILL),(C!==_t||I!==bt)&&(i.polygonOffset(_t,bt),C=_t,I=bt)):at(i.POLYGON_OFFSET_FILL)}function ct(V){V?H(i.SCISSOR_TEST):at(i.SCISSOR_TEST)}function Mt(V){V===void 0&&(V=i.TEXTURE0+N-1),$!==V&&(i.activeTexture(V),$=V)}function Nt(V,_t,bt){bt===void 0&&($===null?bt=i.TEXTURE0+N-1:bt=$);let Pt=j[bt];Pt===void 0&&(Pt={type:void 0,texture:void 0},j[bt]=Pt),(Pt.type!==V||Pt.texture!==_t)&&($!==bt&&(i.activeTexture(bt),$=bt),i.bindTexture(V,_t||O[V]),Pt.type=V,Pt.texture=_t)}function U(){const V=j[$];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function P(){try{i.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Y(){try{i.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Q(){try{i.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ut(){try{i.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function et(){try{i.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ft(){try{i.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function St(){try{i.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Lt(){try{i.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Dt(){try{i.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function mt(){try{i.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function wt(V){ft.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),ft.copy(V))}function Vt(V){ot.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),ot.copy(V))}function zt(V,_t){let bt=l.get(_t);bt===void 0&&(bt=new WeakMap,l.set(_t,bt));let Pt=bt.get(V);Pt===void 0&&(Pt=i.getUniformBlockIndex(_t,V.name),bt.set(V,Pt))}function Et(V,_t){const Pt=l.get(_t).get(V);c.get(_t)!==Pt&&(i.uniformBlockBinding(_t,Pt,V.__bindingPointIndex),c.set(_t,Pt))}function qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},$=null,j={},u={},f=new WeakMap,d=[],x=null,M=!1,_=null,p=null,v=null,m=null,g=null,S=null,E=null,w=new Ht(0,0,0),A=0,T=!1,b=null,y=null,R=null,C=null,I=null,ft.set(0,0,i.canvas.width,i.canvas.height),ot.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:H,disable:at,bindFramebuffer:dt,drawBuffers:ht,useProgram:vt,setBlending:rt,setMaterial:st,setFlipSided:it,setCullFace:tt,setLineWidth:yt,setPolygonOffset:G,setScissorTest:ct,activeTexture:Mt,bindTexture:Nt,unbindTexture:U,compressedTexImage2D:P,compressedTexImage3D:Y,texImage2D:Dt,texImage3D:mt,updateUBOMapping:zt,uniformBlockBinding:Et,texStorage2D:St,texStorage3D:Lt,texSubImage2D:Q,texSubImage3D:ut,compressedTexSubImage2D:et,compressedTexSubImage3D:Ft,scissor:wt,viewport:Vt,reset:qt}}function U0(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new pt,h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(U,P){return d?new OffscreenCanvas(U,P):Bs("canvas")}function M(U,P,Y){let Q=1;const ut=Nt(U);if((ut.width>Y||ut.height>Y)&&(Q=Y/Math.max(ut.width,ut.height)),Q<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const et=Math.floor(Q*ut.width),Ft=Math.floor(Q*ut.height);u===void 0&&(u=x(et,Ft));const St=P?x(et,Ft):u;return St.width=et,St.height=Ft,St.getContext("2d").drawImage(U,0,0,et,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ut.width+"x"+ut.height+") to ("+et+"x"+Ft+")."),St}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ut.width+"x"+ut.height+")."),U;return U}function _(U){return U.generateMipmaps}function p(U){i.generateMipmap(U)}function v(U){return U.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?i.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function m(U,P,Y,Q,ut=!1){if(U!==null){if(i[U]!==void 0)return i[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let et=P;if(P===i.RED&&(Y===i.FLOAT&&(et=i.R32F),Y===i.HALF_FLOAT&&(et=i.R16F),Y===i.UNSIGNED_BYTE&&(et=i.R8)),P===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(et=i.R8UI),Y===i.UNSIGNED_SHORT&&(et=i.R16UI),Y===i.UNSIGNED_INT&&(et=i.R32UI),Y===i.BYTE&&(et=i.R8I),Y===i.SHORT&&(et=i.R16I),Y===i.INT&&(et=i.R32I)),P===i.RG&&(Y===i.FLOAT&&(et=i.RG32F),Y===i.HALF_FLOAT&&(et=i.RG16F),Y===i.UNSIGNED_BYTE&&(et=i.RG8)),P===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(et=i.RG8UI),Y===i.UNSIGNED_SHORT&&(et=i.RG16UI),Y===i.UNSIGNED_INT&&(et=i.RG32UI),Y===i.BYTE&&(et=i.RG8I),Y===i.SHORT&&(et=i.RG16I),Y===i.INT&&(et=i.RG32I)),P===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(et=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(et=i.RGB16UI),Y===i.UNSIGNED_INT&&(et=i.RGB32UI),Y===i.BYTE&&(et=i.RGB8I),Y===i.SHORT&&(et=i.RGB16I),Y===i.INT&&(et=i.RGB32I)),P===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),Y===i.UNSIGNED_INT&&(et=i.RGBA32UI),Y===i.BYTE&&(et=i.RGBA8I),Y===i.SHORT&&(et=i.RGBA16I),Y===i.INT&&(et=i.RGBA32I)),P===i.RGB&&(Y===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),Y===i.UNSIGNED_INT_10F_11F_11F_REV&&(et=i.R11F_G11F_B10F)),P===i.RGBA){const Ft=ut?jr:Qt.getTransfer(Q);Y===i.FLOAT&&(et=i.RGBA32F),Y===i.HALF_FLOAT&&(et=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(et=Ft===re?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function g(U,P){let Y;return U?P===null||P===1014||P===1020?Y=i.DEPTH24_STENCIL8:P===1015?Y=i.DEPTH32F_STENCIL8:P===1012&&(Y=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):P===null||P===1014||P===1020?Y=i.DEPTH_COMPONENT24:P===1015?Y=i.DEPTH_COMPONENT32F:P===1012&&(Y=i.DEPTH_COMPONENT16),Y}function S(U,P){return _(U)===!0||U.isFramebufferTexture&&U.minFilter!==1003&&U.minFilter!==1006?Math.log2(Math.max(P.width,P.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?P.mipmaps.length:1}function E(U){const P=U.target;P.removeEventListener("dispose",E),A(P),P.isVideoTexture&&h.delete(P)}function w(U){const P=U.target;P.removeEventListener("dispose",w),b(P)}function A(U){const P=n.get(U);if(P.__webglInit===void 0)return;const Y=U.source,Q=f.get(Y);if(Q){const ut=Q[P.__cacheKey];ut.usedTimes--,ut.usedTimes===0&&T(U),Object.keys(Q).length===0&&f.delete(Y)}n.remove(U)}function T(U){const P=n.get(U);i.deleteTexture(P.__webglTexture);const Y=U.source,Q=f.get(Y);delete Q[P.__cacheKey],o.memory.textures--}function b(U){const P=n.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),n.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(P.__webglFramebuffer[Q]))for(let ut=0;ut<P.__webglFramebuffer[Q].length;ut++)i.deleteFramebuffer(P.__webglFramebuffer[Q][ut]);else i.deleteFramebuffer(P.__webglFramebuffer[Q]);P.__webglDepthbuffer&&i.deleteRenderbuffer(P.__webglDepthbuffer[Q])}else{if(Array.isArray(P.__webglFramebuffer))for(let Q=0;Q<P.__webglFramebuffer.length;Q++)i.deleteFramebuffer(P.__webglFramebuffer[Q]);else i.deleteFramebuffer(P.__webglFramebuffer);if(P.__webglDepthbuffer&&i.deleteRenderbuffer(P.__webglDepthbuffer),P.__webglMultisampledFramebuffer&&i.deleteFramebuffer(P.__webglMultisampledFramebuffer),P.__webglColorRenderbuffer)for(let Q=0;Q<P.__webglColorRenderbuffer.length;Q++)P.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(P.__webglColorRenderbuffer[Q]);P.__webglDepthRenderbuffer&&i.deleteRenderbuffer(P.__webglDepthRenderbuffer)}const Y=U.textures;for(let Q=0,ut=Y.length;Q<ut;Q++){const et=n.get(Y[Q]);et.__webglTexture&&(i.deleteTexture(et.__webglTexture),o.memory.textures--),n.remove(Y[Q])}n.remove(U)}let y=0;function R(){y=0}function C(){const U=y;return U>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),y+=1,U}function I(U){const P=[];return P.push(U.wrapS),P.push(U.wrapT),P.push(U.wrapR||0),P.push(U.magFilter),P.push(U.minFilter),P.push(U.anisotropy),P.push(U.internalFormat),P.push(U.format),P.push(U.type),P.push(U.generateMipmaps),P.push(U.premultiplyAlpha),P.push(U.flipY),P.push(U.unpackAlignment),P.push(U.colorSpace),P.join()}function N(U,P){const Y=n.get(U);if(U.isVideoTexture&&ct(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&Y.__version!==U.version){const Q=U.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{O(Y,U,P);return}}else U.isExternalTexture&&(Y.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+P)}function z(U,P){const Y=n.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Y.__version!==U.version){O(Y,U,P);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+P)}function k(U,P){const Y=n.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Y.__version!==U.version){O(Y,U,P);return}e.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+P)}function B(U,P){const Y=n.get(U);if(U.version>0&&Y.__version!==U.version){H(Y,U,P);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+P)}const $={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},j={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},q={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function nt(U,P){if(P.type===1015&&t.has("OES_texture_float_linear")===!1&&(P.magFilter===1006||P.magFilter===1007||P.magFilter===1005||P.magFilter===1008||P.minFilter===1006||P.minFilter===1007||P.minFilter===1005||P.minFilter===1008)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(U,i.TEXTURE_WRAP_S,$[P.wrapS]),i.texParameteri(U,i.TEXTURE_WRAP_T,$[P.wrapT]),(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)&&i.texParameteri(U,i.TEXTURE_WRAP_R,$[P.wrapR]),i.texParameteri(U,i.TEXTURE_MAG_FILTER,j[P.magFilter]),i.texParameteri(U,i.TEXTURE_MIN_FILTER,j[P.minFilter]),P.compareFunction&&(i.texParameteri(U,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(U,i.TEXTURE_COMPARE_FUNC,q[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(P.magFilter===1003||P.minFilter!==1005&&P.minFilter!==1008||P.type===1015&&t.has("OES_texture_float_linear")===!1)return;if(P.anisotropy>1||n.get(P).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");i.texParameterf(U,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),n.get(P).__currentAnisotropy=P.anisotropy}}}function ft(U,P){let Y=!1;U.__webglInit===void 0&&(U.__webglInit=!0,P.addEventListener("dispose",E));const Q=P.source;let ut=f.get(Q);ut===void 0&&(ut={},f.set(Q,ut));const et=I(P);if(et!==U.__cacheKey){ut[et]===void 0&&(ut[et]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),ut[et].usedTimes++;const Ft=ut[U.__cacheKey];Ft!==void 0&&(ut[U.__cacheKey].usedTimes--,Ft.usedTimes===0&&T(P)),U.__cacheKey=et,U.__webglTexture=ut[et].texture}return Y}function ot(U,P,Y){return Math.floor(Math.floor(U/Y)/P)}function W(U,P,Y,Q){const et=U.updateRanges;if(et.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,P.width,P.height,Y,Q,P.data);else{et.sort((mt,wt)=>mt.start-wt.start);let Ft=0;for(let mt=1;mt<et.length;mt++){const wt=et[Ft],Vt=et[mt],zt=wt.start+wt.count,Et=ot(Vt.start,P.width,4),qt=ot(wt.start,P.width,4);Vt.start<=zt+1&&Et===qt&&ot(Vt.start+Vt.count-1,P.width,4)===Et?wt.count=Math.max(wt.count,Vt.start+Vt.count-wt.start):(++Ft,et[Ft]=Vt)}et.length=Ft+1;const St=i.getParameter(i.UNPACK_ROW_LENGTH),Lt=i.getParameter(i.UNPACK_SKIP_PIXELS),Dt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,P.width);for(let mt=0,wt=et.length;mt<wt;mt++){const Vt=et[mt],zt=Math.floor(Vt.start/4),Et=Math.ceil(Vt.count/4),qt=zt%P.width,V=Math.floor(zt/P.width),_t=Et,bt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,qt,V,_t,bt,Y,Q,P.data)}U.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,St),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Dt)}}function O(U,P,Y){let Q=i.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),P.isData3DTexture&&(Q=i.TEXTURE_3D);const ut=ft(U,P),et=P.source;e.bindTexture(Q,U.__webglTexture,i.TEXTURE0+Y);const Ft=n.get(et);if(et.version!==Ft.__version||ut===!0){e.activeTexture(i.TEXTURE0+Y);const St=Qt.getPrimaries(Qt.workingColorSpace),Lt=P.colorSpace===""?null:Qt.getPrimaries(P.colorSpace),Dt=P.colorSpace===""||St===Lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,P.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,P.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);let mt=M(P.image,!1,s.maxTextureSize);mt=Mt(P,mt);const wt=r.convert(P.format,P.colorSpace),Vt=r.convert(P.type);let zt=m(P.internalFormat,wt,Vt,P.colorSpace,P.isVideoTexture);nt(Q,P);let Et;const qt=P.mipmaps,V=P.isVideoTexture!==!0,_t=Ft.__version===void 0||ut===!0,bt=et.dataReady,Pt=S(P,mt);if(P.isDepthTexture)zt=g(P.format===1027,P.type),_t&&(V?e.texStorage2D(i.TEXTURE_2D,1,zt,mt.width,mt.height):e.texImage2D(i.TEXTURE_2D,0,zt,mt.width,mt.height,0,wt,Vt,null));else if(P.isDataTexture)if(qt.length>0){V&&_t&&e.texStorage2D(i.TEXTURE_2D,Pt,zt,qt[0].width,qt[0].height);for(let gt=0,lt=qt.length;gt<lt;gt++)Et=qt[gt],V?bt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Et.width,Et.height,wt,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,gt,zt,Et.width,Et.height,0,wt,Vt,Et.data);P.generateMipmaps=!1}else V?(_t&&e.texStorage2D(i.TEXTURE_2D,Pt,zt,mt.width,mt.height),bt&&W(P,mt,wt,Vt)):e.texImage2D(i.TEXTURE_2D,0,zt,mt.width,mt.height,0,wt,Vt,mt.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){V&&_t&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,zt,qt[0].width,qt[0].height,mt.depth);for(let gt=0,lt=qt.length;gt<lt;gt++)if(Et=qt[gt],P.format!==1023)if(wt!==null)if(V){if(bt)if(P.layerUpdates.size>0){const Ut=hl(Et.width,Et.height,P.format,P.type);for(const Yt of P.layerUpdates){const le=Et.data.subarray(Yt*Ut/Et.data.BYTES_PER_ELEMENT,(Yt+1)*Ut/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,Yt,Et.width,Et.height,1,wt,le)}P.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Et.width,Et.height,mt.depth,wt,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,gt,zt,Et.width,Et.height,mt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?bt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,Et.width,Et.height,mt.depth,wt,Vt,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,gt,zt,Et.width,Et.height,mt.depth,0,wt,Vt,Et.data)}else{V&&_t&&e.texStorage2D(i.TEXTURE_2D,Pt,zt,qt[0].width,qt[0].height);for(let gt=0,lt=qt.length;gt<lt;gt++)Et=qt[gt],P.format!==1023?wt!==null?V?bt&&e.compressedTexSubImage2D(i.TEXTURE_2D,gt,0,0,Et.width,Et.height,wt,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,gt,zt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?bt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Et.width,Et.height,wt,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,gt,zt,Et.width,Et.height,0,wt,Vt,Et.data)}else if(P.isDataArrayTexture)if(V){if(_t&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,zt,mt.width,mt.height,mt.depth),bt)if(P.layerUpdates.size>0){const gt=hl(mt.width,mt.height,P.format,P.type);for(const lt of P.layerUpdates){const Ut=mt.data.subarray(lt*gt/mt.data.BYTES_PER_ELEMENT,(lt+1)*gt/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,lt,mt.width,mt.height,1,wt,Vt,Ut)}P.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,wt,Vt,mt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,mt.width,mt.height,mt.depth,0,wt,Vt,mt.data);else if(P.isData3DTexture)V?(_t&&e.texStorage3D(i.TEXTURE_3D,Pt,zt,mt.width,mt.height,mt.depth),bt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,wt,Vt,mt.data)):e.texImage3D(i.TEXTURE_3D,0,zt,mt.width,mt.height,mt.depth,0,wt,Vt,mt.data);else if(P.isFramebufferTexture){if(_t)if(V)e.texStorage2D(i.TEXTURE_2D,Pt,zt,mt.width,mt.height);else{let gt=mt.width,lt=mt.height;for(let Ut=0;Ut<Pt;Ut++)e.texImage2D(i.TEXTURE_2D,Ut,zt,gt,lt,0,wt,Vt,null),gt>>=1,lt>>=1}}else if(qt.length>0){if(V&&_t){const gt=Nt(qt[0]);e.texStorage2D(i.TEXTURE_2D,Pt,zt,gt.width,gt.height)}for(let gt=0,lt=qt.length;gt<lt;gt++)Et=qt[gt],V?bt&&e.texSubImage2D(i.TEXTURE_2D,gt,0,0,wt,Vt,Et):e.texImage2D(i.TEXTURE_2D,gt,zt,wt,Vt,Et);P.generateMipmaps=!1}else if(V){if(_t){const gt=Nt(mt);e.texStorage2D(i.TEXTURE_2D,Pt,zt,gt.width,gt.height)}bt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,wt,Vt,mt)}else e.texImage2D(i.TEXTURE_2D,0,zt,wt,Vt,mt);_(P)&&p(Q),Ft.__version=et.version,P.onUpdate&&P.onUpdate(P)}U.__version=P.version}function H(U,P,Y){if(P.image.length!==6)return;const Q=ft(U,P),ut=P.source;e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+Y);const et=n.get(ut);if(ut.version!==et.__version||Q===!0){e.activeTexture(i.TEXTURE0+Y);const Ft=Qt.getPrimaries(Qt.workingColorSpace),St=P.colorSpace===""?null:Qt.getPrimaries(P.colorSpace),Lt=P.colorSpace===""||Ft===St?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,P.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,P.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);const Dt=P.isCompressedTexture||P.image[0].isCompressedTexture,mt=P.image[0]&&P.image[0].isDataTexture,wt=[];for(let lt=0;lt<6;lt++)!Dt&&!mt?wt[lt]=M(P.image[lt],!0,s.maxCubemapSize):wt[lt]=mt?P.image[lt].image:P.image[lt],wt[lt]=Mt(P,wt[lt]);const Vt=wt[0],zt=r.convert(P.format,P.colorSpace),Et=r.convert(P.type),qt=m(P.internalFormat,zt,Et,P.colorSpace),V=P.isVideoTexture!==!0,_t=et.__version===void 0||Q===!0,bt=ut.dataReady;let Pt=S(P,Vt);nt(i.TEXTURE_CUBE_MAP,P);let gt;if(Dt){V&&_t&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,qt,Vt.width,Vt.height);for(let lt=0;lt<6;lt++){gt=wt[lt].mipmaps;for(let Ut=0;Ut<gt.length;Ut++){const Yt=gt[Ut];P.format!==1023?zt!==null?V?bt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut,0,0,Yt.width,Yt.height,zt,Yt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut,qt,Yt.width,Yt.height,0,Yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut,0,0,Yt.width,Yt.height,zt,Et,Yt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut,qt,Yt.width,Yt.height,0,zt,Et,Yt.data)}}}else{if(gt=P.mipmaps,V&&_t){gt.length>0&&Pt++;const lt=Nt(wt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,qt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(mt){V?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,wt[lt].width,wt[lt].height,zt,Et,wt[lt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,wt[lt].width,wt[lt].height,0,zt,Et,wt[lt].data);for(let Ut=0;Ut<gt.length;Ut++){const le=gt[Ut].image[lt].image;V?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut+1,0,0,le.width,le.height,zt,Et,le.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut+1,qt,le.width,le.height,0,zt,Et,le.data)}}else{V?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,zt,Et,wt[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,zt,Et,wt[lt]);for(let Ut=0;Ut<gt.length;Ut++){const Yt=gt[Ut];V?bt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut+1,0,0,zt,Et,Yt.image[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ut+1,qt,zt,Et,Yt.image[lt])}}}_(P)&&p(i.TEXTURE_CUBE_MAP),et.__version=ut.version,P.onUpdate&&P.onUpdate(P)}U.__version=P.version}function at(U,P,Y,Q,ut,et){const Ft=r.convert(Y.format,Y.colorSpace),St=r.convert(Y.type),Lt=m(Y.internalFormat,Ft,St,Y.colorSpace),Dt=n.get(P),mt=n.get(Y);if(mt.__renderTarget=P,!Dt.__hasExternalTextures){const wt=Math.max(1,P.width>>et),Vt=Math.max(1,P.height>>et);ut===i.TEXTURE_3D||ut===i.TEXTURE_2D_ARRAY?e.texImage3D(ut,et,Lt,wt,Vt,P.depth,0,Ft,St,null):e.texImage2D(ut,et,Lt,wt,Vt,0,Ft,St,null)}e.bindFramebuffer(i.FRAMEBUFFER,U),G(P)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,ut,mt.__webglTexture,0,yt(P)):(ut===i.TEXTURE_2D||ut>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ut<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,ut,mt.__webglTexture,et),e.bindFramebuffer(i.FRAMEBUFFER,null)}function dt(U,P,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,U),P.depthBuffer){const Q=P.depthTexture,ut=Q&&Q.isDepthTexture?Q.type:null,et=g(P.stencilBuffer,ut),Ft=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=yt(P);G(P)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,St,et,P.width,P.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,St,et,P.width,P.height):i.renderbufferStorage(i.RENDERBUFFER,et,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ft,i.RENDERBUFFER,U)}else{const Q=P.textures;for(let ut=0;ut<Q.length;ut++){const et=Q[ut],Ft=r.convert(et.format,et.colorSpace),St=r.convert(et.type),Lt=m(et.internalFormat,Ft,St,et.colorSpace),Dt=yt(P);Y&&G(P)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,Lt,P.width,P.height):G(P)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Dt,Lt,P.width,P.height):i.renderbufferStorage(i.RENDERBUFFER,Lt,P.width,P.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ht(U,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,U),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(P.depthTexture);Q.__renderTarget=P,(!Q.__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),N(P.depthTexture,0);const ut=Q.__webglTexture,et=yt(P);if(P.depthTexture.format===1026)G(P)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ut,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ut,0);else if(P.depthTexture.format===1027)G(P)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ut,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function vt(U){const P=n.get(U),Y=U.isWebGLCubeRenderTarget===!0;if(P.__boundDepthTexture!==U.depthTexture){const Q=U.depthTexture;if(P.__depthDisposeCallback&&P.__depthDisposeCallback(),Q){const ut=()=>{delete P.__boundDepthTexture,delete P.__depthDisposeCallback,Q.removeEventListener("dispose",ut)};Q.addEventListener("dispose",ut),P.__depthDisposeCallback=ut}P.__boundDepthTexture=Q}if(U.depthTexture&&!P.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");const Q=U.texture.mipmaps;Q&&Q.length>0?ht(P.__webglFramebuffer[0],U):ht(P.__webglFramebuffer,U)}else if(Y){P.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(i.FRAMEBUFFER,P.__webglFramebuffer[Q]),P.__webglDepthbuffer[Q]===void 0)P.__webglDepthbuffer[Q]=i.createRenderbuffer(),dt(P.__webglDepthbuffer[Q],U,!1);else{const ut=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=P.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,ut,i.RENDERBUFFER,et)}}else{const Q=U.texture.mipmaps;if(Q&&Q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,P.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer===void 0)P.__webglDepthbuffer=i.createRenderbuffer(),dt(P.__webglDepthbuffer,U,!1);else{const ut=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=P.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,ut,i.RENDERBUFFER,et)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Rt(U,P,Y){const Q=n.get(U);P!==void 0&&at(Q.__webglFramebuffer,U,U.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&vt(U)}function F(U){const P=U.texture,Y=n.get(U),Q=n.get(P);U.addEventListener("dispose",w);const ut=U.textures,et=U.isWebGLCubeRenderTarget===!0,Ft=ut.length>1;if(Ft||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=P.version,o.memory.textures++),et){Y.__webglFramebuffer=[];for(let St=0;St<6;St++)if(P.mipmaps&&P.mipmaps.length>0){Y.__webglFramebuffer[St]=[];for(let Lt=0;Lt<P.mipmaps.length;Lt++)Y.__webglFramebuffer[St][Lt]=i.createFramebuffer()}else Y.__webglFramebuffer[St]=i.createFramebuffer()}else{if(P.mipmaps&&P.mipmaps.length>0){Y.__webglFramebuffer=[];for(let St=0;St<P.mipmaps.length;St++)Y.__webglFramebuffer[St]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Ft)for(let St=0,Lt=ut.length;St<Lt;St++){const Dt=n.get(ut[St]);Dt.__webglTexture===void 0&&(Dt.__webglTexture=i.createTexture(),o.memory.textures++)}if(U.samples>0&&G(U)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let St=0;St<ut.length;St++){const Lt=ut[St];Y.__webglColorRenderbuffer[St]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[St]);const Dt=r.convert(Lt.format,Lt.colorSpace),mt=r.convert(Lt.type),wt=m(Lt.internalFormat,Dt,mt,Lt.colorSpace,U.isXRRenderTarget===!0),Vt=yt(U);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,wt,U.width,U.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+St,i.RENDERBUFFER,Y.__webglColorRenderbuffer[St])}i.bindRenderbuffer(i.RENDERBUFFER,null),U.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),dt(Y.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(et){e.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),nt(i.TEXTURE_CUBE_MAP,P);for(let St=0;St<6;St++)if(P.mipmaps&&P.mipmaps.length>0)for(let Lt=0;Lt<P.mipmaps.length;Lt++)at(Y.__webglFramebuffer[St][Lt],U,P,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,Lt);else at(Y.__webglFramebuffer[St],U,P,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);_(P)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let St=0,Lt=ut.length;St<Lt;St++){const Dt=ut[St],mt=n.get(Dt);let wt=i.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(wt=U.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(wt,mt.__webglTexture),nt(wt,Dt),at(Y.__webglFramebuffer,U,Dt,i.COLOR_ATTACHMENT0+St,wt,0),_(Dt)&&p(wt)}e.unbindTexture()}else{let St=i.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(St=U.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(St,Q.__webglTexture),nt(St,P),P.mipmaps&&P.mipmaps.length>0)for(let Lt=0;Lt<P.mipmaps.length;Lt++)at(Y.__webglFramebuffer[Lt],U,P,i.COLOR_ATTACHMENT0,St,Lt);else at(Y.__webglFramebuffer,U,P,i.COLOR_ATTACHMENT0,St,0);_(P)&&p(St),e.unbindTexture()}U.depthBuffer&&vt(U)}function rt(U){const P=U.textures;for(let Y=0,Q=P.length;Y<Q;Y++){const ut=P[Y];if(_(ut)){const et=v(U),Ft=n.get(ut).__webglTexture;e.bindTexture(et,Ft),p(et),e.unbindTexture()}}}const st=[],it=[];function tt(U){if(U.samples>0){if(G(U)===!1){const P=U.textures,Y=U.width,Q=U.height;let ut=i.COLOR_BUFFER_BIT;const et=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ft=n.get(U),St=P.length>1;if(St)for(let Dt=0;Dt<P.length;Dt++)e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);const Lt=U.texture.mipmaps;Lt&&Lt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let Dt=0;Dt<P.length;Dt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ut|=i.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ut|=i.STENCIL_BUFFER_BIT)),St){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Dt]);const mt=n.get(P[Dt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,mt,0)}i.blitFramebuffer(0,0,Y,Q,0,0,Y,Q,ut,i.NEAREST),c===!0&&(st.length=0,it.length=0,st.push(i.COLOR_ATTACHMENT0+Dt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(st.push(et),it.push(et),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),St)for(let Dt=0;Dt<P.length;Dt++){e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.RENDERBUFFER,Ft.__webglColorRenderbuffer[Dt]);const mt=n.get(P[Dt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.TEXTURE_2D,mt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const P=U.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[P])}}}function yt(U){return Math.min(s.maxSamples,U.samples)}function G(U){const P=n.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function ct(U){const P=o.render.frame;h.get(U)!==P&&(h.set(U,P),U.update())}function Mt(U,P){const Y=U.colorSpace,Q=U.format,ut=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||Y!==Qi&&Y!==""&&(Qt.getTransfer(Y)===re?(Q!==1023||ut!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),P}function Nt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=C,this.resetTextureUnits=R,this.setTexture2D=N,this.setTexture2DArray=z,this.setTexture3D=k,this.setTextureCube=B,this.rebindTextures=Rt,this.setupRenderTarget=F,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=tt,this.setupDepthRenderbuffer=vt,this.setupFrameBufferTexture=at,this.useMultisampledRTT=G}function N0(i,t){function e(n,s=""){let r;const o=Qt.getTransfer(s);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(o===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===33776)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===33776)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===35840)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===36196||n===37492)return o===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===37496)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===37808)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===36492)return o===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===36283)return r.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const F0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z0=`
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

}`;class B0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new _h(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Kn({vertexShader:F0,fragmentShader:z0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new He(new po(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class O0 extends ss{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,x=null;const M=typeof XRWebGLBinding<"u",_=new B0,p={},v=e.getContextAttributes();let m=null,g=null;const S=[],E=[],w=new pt;let A=null;const T=new Ke;T.viewport=new te;const b=new Ke;b.viewport=new te;const y=[T,b],R=new $f;let C=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let H=S[O];return H===void 0&&(H=new Xo,S[O]=H),H.getTargetRaySpace()},this.getControllerGrip=function(O){let H=S[O];return H===void 0&&(H=new Xo,S[O]=H),H.getGripSpace()},this.getHand=function(O){let H=S[O];return H===void 0&&(H=new Xo,S[O]=H),H.getHandSpace()};function N(O){const H=E.indexOf(O.inputSource);if(H===-1)return;const at=S[H];at!==void 0&&(at.update(O.inputSource,O.frame,l||o),at.dispatchEvent({type:O.type,data:O.inputSource}))}function z(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",k);for(let O=0;O<S.length;O++){const H=E[O];H!==null&&(E[O]=null,S[O].disconnect(H))}C=null,I=null,_.reset();for(const O in p)delete p[O];t.setRenderTarget(m),d=null,f=null,u=null,s=null,g=null,W.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(O){l=O},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(O){if(s=O,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",z),s.addEventListener("inputsourceschange",k),v.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(w),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let at=null,dt=null,ht=null;v.depth&&(ht=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=v.stencil?1027:1026,dt=v.stencil?1020:1014);const vt={colorFormat:e.RGBA8,depthFormat:ht,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(vt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),g=new gi(f.textureWidth,f.textureHeight,{format:1023,type:1009,depthTexture:new xh(f.textureWidth,f.textureHeight,dt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const at={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,at),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),g=new gi(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),W.setContext(s),W.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(O){for(let H=0;H<O.removed.length;H++){const at=O.removed[H],dt=E.indexOf(at);dt>=0&&(E[dt]=null,S[dt].disconnect(at))}for(let H=0;H<O.added.length;H++){const at=O.added[H];let dt=E.indexOf(at);if(dt===-1){for(let vt=0;vt<S.length;vt++)if(vt>=E.length){E.push(at),dt=vt;break}else if(E[vt]===null){E[vt]=at,dt=vt;break}if(dt===-1)break}const ht=S[dt];ht&&ht.connect(at)}}const B=new D,$=new D;function j(O,H,at){B.setFromMatrixPosition(H.matrixWorld),$.setFromMatrixPosition(at.matrixWorld);const dt=B.distanceTo($),ht=H.projectionMatrix.elements,vt=at.projectionMatrix.elements,Rt=ht[14]/(ht[10]-1),F=ht[14]/(ht[10]+1),rt=(ht[9]+1)/ht[5],st=(ht[9]-1)/ht[5],it=(ht[8]-1)/ht[0],tt=(vt[8]+1)/vt[0],yt=Rt*it,G=Rt*tt,ct=dt/(-it+tt),Mt=ct*-it;if(H.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Mt),O.translateZ(ct),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),ht[10]===-1)O.projectionMatrix.copy(H.projectionMatrix),O.projectionMatrixInverse.copy(H.projectionMatrixInverse);else{const Nt=Rt+ct,U=F+ct,P=yt-Mt,Y=G+(dt-Mt),Q=rt*F/U*Nt,ut=st*F/U*Nt;O.projectionMatrix.makePerspective(P,Y,Q,ut,Nt,U),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function q(O,H){H===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(H.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(s===null)return;let H=O.near,at=O.far;_.texture!==null&&(_.depthNear>0&&(H=_.depthNear),_.depthFar>0&&(at=_.depthFar)),R.near=b.near=T.near=H,R.far=b.far=T.far=at,(C!==R.near||I!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),C=R.near,I=R.far),R.layers.mask=O.layers.mask|6,T.layers.mask=R.layers.mask&3,b.layers.mask=R.layers.mask&5;const dt=O.parent,ht=R.cameras;q(R,dt);for(let vt=0;vt<ht.length;vt++)q(ht[vt],dt);ht.length===2?j(R,T,b):R.projectionMatrix.copy(T.projectionMatrix),nt(O,R,dt)};function nt(O,H,at){at===null?O.matrix.copy(H.matrixWorld):(O.matrix.copy(at.matrixWorld),O.matrix.invert(),O.matrix.multiply(H.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(H.projectionMatrix),O.projectionMatrixInverse.copy(H.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=ts*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(O){c=O,f!==null&&(f.fixedFoveation=O),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=O)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(R)},this.getCameraTexture=function(O){return p[O]};let ft=null;function ot(O,H){if(h=H.getViewerPose(l||o),x=H,h!==null){const at=h.views;d!==null&&(t.setRenderTargetFramebuffer(g,d.framebuffer),t.setRenderTarget(g));let dt=!1;at.length!==R.cameras.length&&(R.cameras.length=0,dt=!0);for(let F=0;F<at.length;F++){const rt=at[F];let st=null;if(d!==null)st=d.getViewport(rt);else{const tt=u.getViewSubImage(f,rt);st=tt.viewport,F===0&&(t.setRenderTargetTextures(g,tt.colorTexture,tt.depthStencilTexture),t.setRenderTarget(g))}let it=y[F];it===void 0&&(it=new Ke,it.layers.enable(F),it.viewport=new te,y[F]=it),it.matrix.fromArray(rt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(rt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(st.x,st.y,st.width,st.height),F===0&&(R.matrix.copy(it.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),dt===!0&&R.cameras.push(it)}const ht=s.enabledFeatures;if(ht&&ht.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const F=u.getDepthInformation(at[0]);F&&F.isValid&&F.texture&&_.init(F,s.renderState)}if(ht&&ht.includes("camera-access")&&M){t.state.unbindTexture(),u=n.getBinding();for(let F=0;F<at.length;F++){const rt=at[F].camera;if(rt){let st=p[rt];st||(st=new _h,p[rt]=st);const it=u.getCameraImage(rt);st.sourceTexture=it}}}}for(let at=0;at<S.length;at++){const dt=E[at],ht=S[at];dt!==null&&ht!==void 0&&ht.update(dt,H,l||o)}ft&&ft(O,H),H.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:H}),x=null}const W=new Uh;W.setAnimationLoop(ot),this.setAnimationLoop=function(O){ft=O},this.dispose=function(){}}}const ai=new fn,k0=new Xt;function V0(i,t){function e(_,p){_.matrixAutoUpdate===!0&&_.updateMatrix(),p.value.copy(_.matrix)}function n(_,p){p.color.getRGB(_.fogColor.value,uh(i)),p.isFog?(_.fogNear.value=p.near,_.fogFar.value=p.far):p.isFogExp2&&(_.fogDensity.value=p.density)}function s(_,p,v,m,g){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(_,p):p.isMeshToonMaterial?(r(_,p),u(_,p)):p.isMeshPhongMaterial?(r(_,p),h(_,p)):p.isMeshStandardMaterial?(r(_,p),f(_,p),p.isMeshPhysicalMaterial&&d(_,p,g)):p.isMeshMatcapMaterial?(r(_,p),x(_,p)):p.isMeshDepthMaterial?r(_,p):p.isMeshDistanceMaterial?(r(_,p),M(_,p)):p.isMeshNormalMaterial?r(_,p):p.isLineBasicMaterial?(o(_,p),p.isLineDashedMaterial&&a(_,p)):p.isPointsMaterial?c(_,p,v,m):p.isSpriteMaterial?l(_,p):p.isShadowMaterial?(_.color.value.copy(p.color),_.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(_,p){_.opacity.value=p.opacity,p.color&&_.diffuse.value.copy(p.color),p.emissive&&_.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(_.map.value=p.map,e(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.bumpMap&&(_.bumpMap.value=p.bumpMap,e(p.bumpMap,_.bumpMapTransform),_.bumpScale.value=p.bumpScale,p.side===1&&(_.bumpScale.value*=-1)),p.normalMap&&(_.normalMap.value=p.normalMap,e(p.normalMap,_.normalMapTransform),_.normalScale.value.copy(p.normalScale),p.side===1&&_.normalScale.value.negate()),p.displacementMap&&(_.displacementMap.value=p.displacementMap,e(p.displacementMap,_.displacementMapTransform),_.displacementScale.value=p.displacementScale,_.displacementBias.value=p.displacementBias),p.emissiveMap&&(_.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,_.emissiveMapTransform)),p.specularMap&&(_.specularMap.value=p.specularMap,e(p.specularMap,_.specularMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest);const v=t.get(p),m=v.envMap,g=v.envMapRotation;m&&(_.envMap.value=m,ai.copy(g),ai.x*=-1,ai.y*=-1,ai.z*=-1,m.isCubeTexture&&m.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),_.envMapRotation.value.setFromMatrix4(k0.makeRotationFromEuler(ai)),_.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,_.reflectivity.value=p.reflectivity,_.ior.value=p.ior,_.refractionRatio.value=p.refractionRatio),p.lightMap&&(_.lightMap.value=p.lightMap,_.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,_.lightMapTransform)),p.aoMap&&(_.aoMap.value=p.aoMap,_.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,_.aoMapTransform))}function o(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,p.map&&(_.map.value=p.map,e(p.map,_.mapTransform))}function a(_,p){_.dashSize.value=p.dashSize,_.totalSize.value=p.dashSize+p.gapSize,_.scale.value=p.scale}function c(_,p,v,m){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.size.value=p.size*v,_.scale.value=m*.5,p.map&&(_.map.value=p.map,e(p.map,_.uvTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function l(_,p){_.diffuse.value.copy(p.color),_.opacity.value=p.opacity,_.rotation.value=p.rotation,p.map&&(_.map.value=p.map,e(p.map,_.mapTransform)),p.alphaMap&&(_.alphaMap.value=p.alphaMap,e(p.alphaMap,_.alphaMapTransform)),p.alphaTest>0&&(_.alphaTest.value=p.alphaTest)}function h(_,p){_.specular.value.copy(p.specular),_.shininess.value=Math.max(p.shininess,1e-4)}function u(_,p){p.gradientMap&&(_.gradientMap.value=p.gradientMap)}function f(_,p){_.metalness.value=p.metalness,p.metalnessMap&&(_.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,_.metalnessMapTransform)),_.roughness.value=p.roughness,p.roughnessMap&&(_.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,_.roughnessMapTransform)),p.envMap&&(_.envMapIntensity.value=p.envMapIntensity)}function d(_,p,v){_.ior.value=p.ior,p.sheen>0&&(_.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),_.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(_.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,_.sheenColorMapTransform)),p.sheenRoughnessMap&&(_.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,_.sheenRoughnessMapTransform))),p.clearcoat>0&&(_.clearcoat.value=p.clearcoat,_.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(_.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,_.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(_.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,_.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(_.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,_.clearcoatNormalMapTransform),_.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&_.clearcoatNormalScale.value.negate())),p.dispersion>0&&(_.dispersion.value=p.dispersion),p.iridescence>0&&(_.iridescence.value=p.iridescence,_.iridescenceIOR.value=p.iridescenceIOR,_.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],_.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(_.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,_.iridescenceMapTransform)),p.iridescenceThicknessMap&&(_.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,_.iridescenceThicknessMapTransform))),p.transmission>0&&(_.transmission.value=p.transmission,_.transmissionSamplerMap.value=v.texture,_.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(_.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,_.transmissionMapTransform)),_.thickness.value=p.thickness,p.thicknessMap&&(_.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,_.thicknessMapTransform)),_.attenuationDistance.value=p.attenuationDistance,_.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(_.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(_.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,_.anisotropyMapTransform))),_.specularIntensity.value=p.specularIntensity,_.specularColor.value.copy(p.specularColor),p.specularColorMap&&(_.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,_.specularColorMapTransform)),p.specularIntensityMap&&(_.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,_.specularIntensityMapTransform))}function x(_,p){p.matcap&&(_.matcap.value=p.matcap)}function M(_,p){const v=t.get(p).light;_.referencePosition.value.setFromMatrixPosition(v.matrixWorld),_.nearDistance.value=v.shadow.camera.near,_.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function G0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,m){const g=m.program;n.uniformBlockBinding(v,g)}function l(v,m){let g=s[v.id];g===void 0&&(x(v),g=h(v),s[v.id]=g,v.addEventListener("dispose",_));const S=m.program;n.updateUBOMapping(v,S);const E=t.render.frame;r[v.id]!==E&&(f(v),r[v.id]=E)}function h(v){const m=u();v.__bindingPointIndex=m;const g=i.createBuffer(),S=v.__size,E=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,g),i.bufferData(i.UNIFORM_BUFFER,S,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,m,g),g}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const m=s[v.id],g=v.uniforms,S=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,m);for(let E=0,w=g.length;E<w;E++){const A=Array.isArray(g[E])?g[E]:[g[E]];for(let T=0,b=A.length;T<b;T++){const y=A[T];if(d(y,E,T,S)===!0){const R=y.__offset,C=Array.isArray(y.value)?y.value:[y.value];let I=0;for(let N=0;N<C.length;N++){const z=C[N],k=M(z);typeof z=="number"||typeof z=="boolean"?(y.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,R+I,y.__data)):z.isMatrix3?(y.__data[0]=z.elements[0],y.__data[1]=z.elements[1],y.__data[2]=z.elements[2],y.__data[3]=0,y.__data[4]=z.elements[3],y.__data[5]=z.elements[4],y.__data[6]=z.elements[5],y.__data[7]=0,y.__data[8]=z.elements[6],y.__data[9]=z.elements[7],y.__data[10]=z.elements[8],y.__data[11]=0):(z.toArray(y.__data,I),I+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,R,y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,m,g,S){const E=v.value,w=m+"_"+g;if(S[w]===void 0)return typeof E=="number"||typeof E=="boolean"?S[w]=E:S[w]=E.clone(),!0;{const A=S[w];if(typeof E=="number"||typeof E=="boolean"){if(A!==E)return S[w]=E,!0}else if(A.equals(E)===!1)return A.copy(E),!0}return!1}function x(v){const m=v.uniforms;let g=0;const S=16;for(let w=0,A=m.length;w<A;w++){const T=Array.isArray(m[w])?m[w]:[m[w]];for(let b=0,y=T.length;b<y;b++){const R=T[b],C=Array.isArray(R.value)?R.value:[R.value];for(let I=0,N=C.length;I<N;I++){const z=C[I],k=M(z),B=g%S,$=B%k.boundary,j=B+$;g+=$,j!==0&&S-j<k.storage&&(g+=S-j),R.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=g,g+=k.storage}}}const E=g%S;return E>0&&(g+=S-E),v.__size=g,v.__cache={},this}function M(v){const m={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(m.boundary=4,m.storage=4):v.isVector2?(m.boundary=8,m.storage=8):v.isVector3||v.isColor?(m.boundary=16,m.storage=12):v.isVector4?(m.boundary=16,m.storage=16):v.isMatrix3?(m.boundary=48,m.storage=48):v.isMatrix4?(m.boundary=64,m.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),m}function _(v){const m=v.target;m.removeEventListener("dispose",_);const g=o.indexOf(m.__bindingPointIndex);o.splice(g,1),i.deleteBuffer(s[m.id]),delete s[m.id],delete r[m.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class d_{constructor(t={}){const{canvas:e=mu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const x=new Uint32Array(4),M=new Int32Array(4);let _=null,p=null;const v=[],m=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let S=!1;this._outputColorSpace=Je;let E=0,w=0,A=null,T=-1,b=null;const y=new te,R=new te;let C=null;const I=new Ht(0);let N=0,z=e.width,k=e.height,B=1,$=null,j=null;const q=new te(0,0,z,k),nt=new te(0,0,z,k);let ft=!1;const ot=new $a;let W=!1,O=!1;const H=new Xt,at=new D,dt=new te,ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let vt=!1;function Rt(){return A===null?B:1}let F=n;function rt(L,X){return e.getContext(L,X)}try{const L={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r180"),e.addEventListener("webglcontextlost",bt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),F===null){const X="webgl2";if(F=rt(X,L),F===null)throw rt(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let st,it,tt,yt,G,ct,Mt,Nt,U,P,Y,Q,ut,et,Ft,St,Lt,Dt,mt,wt,Vt,zt,Et,qt;function V(){st=new Qm(F),st.init(),zt=new N0(F,st),it=new Zm(F,st,t,zt),tt=new D0(F,st),it.reversedDepthBuffer&&f&&tt.buffers.depth.setReversed(!0),yt=new ng(F),G=new v0,ct=new U0(F,st,tt,G,it,zt,yt),Mt=new qm(g),Nt=new jm(g),U=new cd(F),Et=new Xm(F,U),P=new tg(F,U,yt,Et),Y=new sg(F,P,U,yt),mt=new ig(F,it,ct),St=new Ym(G),Q=new y0(g,Mt,Nt,st,it,Et,St),ut=new V0(g,G),et=new S0,Ft=new R0(st),Dt=new Hm(g,Mt,Nt,tt,Y,d,c),Lt=new I0(g,Y,it),qt=new G0(F,yt,it,tt),wt=new Wm(F,st,yt),Vt=new eg(F,st,yt),yt.programs=Q.programs,g.capabilities=it,g.extensions=st,g.properties=G,g.renderLists=et,g.shadowMap=Lt,g.state=tt,g.info=yt}V();const _t=new O0(g,F);this.xr=_t,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const L=st.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=st.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(L){L!==void 0&&(B=L,this.setSize(z,k,!1))},this.getSize=function(L){return L.set(z,k)},this.setSize=function(L,X,J=!0){if(_t.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=L,k=X,e.width=Math.floor(L*B),e.height=Math.floor(X*B),J===!0&&(e.style.width=L+"px",e.style.height=X+"px"),this.setViewport(0,0,L,X)},this.getDrawingBufferSize=function(L){return L.set(z*B,k*B).floor()},this.setDrawingBufferSize=function(L,X,J){z=L,k=X,B=J,e.width=Math.floor(L*J),e.height=Math.floor(X*J),this.setViewport(0,0,L,X)},this.getCurrentViewport=function(L){return L.copy(y)},this.getViewport=function(L){return L.copy(q)},this.setViewport=function(L,X,J,K){L.isVector4?q.set(L.x,L.y,L.z,L.w):q.set(L,X,J,K),tt.viewport(y.copy(q).multiplyScalar(B).round())},this.getScissor=function(L){return L.copy(nt)},this.setScissor=function(L,X,J,K){L.isVector4?nt.set(L.x,L.y,L.z,L.w):nt.set(L,X,J,K),tt.scissor(R.copy(nt).multiplyScalar(B).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(L){tt.setScissorTest(ft=L)},this.setOpaqueSort=function(L){$=L},this.setTransparentSort=function(L){j=L},this.getClearColor=function(L){return L.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor(...arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha(...arguments)},this.clear=function(L=!0,X=!0,J=!0){let K=0;if(L){let Z=!1;if(A!==null){const xt=A.texture.format;Z=xt===1033||xt===1031||xt===1029}if(Z){const xt=A.texture.type,At=xt===1009||xt===1014||xt===1012||xt===1020||xt===1017||xt===1018,It=Dt.getClearColor(),Ct=Dt.getClearAlpha(),kt=It.r,Gt=It.g,Bt=It.b;At?(x[0]=kt,x[1]=Gt,x[2]=Bt,x[3]=Ct,F.clearBufferuiv(F.COLOR,0,x)):(M[0]=kt,M[1]=Gt,M[2]=Bt,M[3]=Ct,F.clearBufferiv(F.COLOR,0,M))}else K|=F.COLOR_BUFFER_BIT}X&&(K|=F.DEPTH_BUFFER_BIT),J&&(K|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",bt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Dt.dispose(),et.dispose(),Ft.dispose(),G.dispose(),Mt.dispose(),Nt.dispose(),Y.dispose(),Et.dispose(),qt.dispose(),Q.dispose(),_t.dispose(),_t.removeEventListener("sessionstart",mn),_t.removeEventListener("sessionend",uc),ti.stop()};function bt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const L=yt.autoReset,X=Lt.enabled,J=Lt.autoUpdate,K=Lt.needsUpdate,Z=Lt.type;V(),yt.autoReset=L,Lt.enabled=X,Lt.autoUpdate=J,Lt.needsUpdate=K,Lt.type=Z}function gt(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function lt(L){const X=L.target;X.removeEventListener("dispose",lt),Ut(X)}function Ut(L){Yt(L),G.remove(L)}function Yt(L){const X=G.get(L).programs;X!==void 0&&(X.forEach(function(J){Q.releaseProgram(J)}),L.isShaderMaterial&&Q.releaseShaderCache(L))}this.renderBufferDirect=function(L,X,J,K,Z,xt){X===null&&(X=ht);const At=Z.isMesh&&Z.matrixWorld.determinant()<0,It=Zh(L,X,J,K,Z);tt.setMaterial(K,At);let Ct=J.index,kt=1;if(K.wireframe===!0){if(Ct=P.getWireframeAttribute(J),Ct===void 0)return;kt=2}const Gt=J.drawRange,Bt=J.attributes.position;let Kt=Gt.start*kt,se=(Gt.start+Gt.count)*kt;xt!==null&&(Kt=Math.max(Kt,xt.start*kt),se=Math.min(se,(xt.start+xt.count)*kt)),Ct!==null?(Kt=Math.max(Kt,0),se=Math.min(se,Ct.count)):Bt!=null&&(Kt=Math.max(Kt,0),se=Math.min(se,Bt.count));const _e=se-Kt;if(_e<0||_e===1/0)return;Et.setup(Z,K,It,J,Ct);let he,ae=wt;if(Ct!==null&&(he=U.get(Ct),ae=Vt,ae.setIndex(he)),Z.isMesh)K.wireframe===!0?(tt.setLineWidth(K.wireframeLinewidth*Rt()),ae.setMode(F.LINES)):ae.setMode(F.TRIANGLES);else if(Z.isLine){let Ot=K.linewidth;Ot===void 0&&(Ot=1),tt.setLineWidth(Ot*Rt()),Z.isLineSegments?ae.setMode(F.LINES):Z.isLineLoop?ae.setMode(F.LINE_LOOP):ae.setMode(F.LINE_STRIP)}else Z.isPoints?ae.setMode(F.POINTS):Z.isSprite&&ae.setMode(F.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)Os("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ae.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const Ot=Z._multiDrawStarts,fe=Z._multiDrawCounts,jt=Z._multiDrawCount,Ze=Ct?U.get(Ct).bytesPerElement:1,yi=G.get(K).currentProgram.getUniforms();for(let Ye=0;Ye<jt;Ye++)yi.setValue(F,"_gl_DrawID",Ye),ae.render(Ot[Ye]/Ze,fe[Ye])}else if(Z.isInstancedMesh)ae.renderInstances(Kt,_e,Z.count);else if(J.isInstancedBufferGeometry){const Ot=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,fe=Math.min(J.instanceCount,Ot);ae.renderInstances(Kt,_e,fe)}else ae.render(Kt,_e)};function le(L,X,J){L.transparent===!0&&L.side===2&&L.forceSinglePass===!1?(L.side=1,L.needsUpdate=!0,qs(L,X,J),L.side=0,L.needsUpdate=!0,qs(L,X,J),L.side=2):qs(L,X,J)}this.compile=function(L,X,J=null){J===null&&(J=L),p=Ft.get(J),p.init(X),m.push(p),J.traverseVisible(function(Z){Z.isLight&&Z.layers.test(X.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),L!==J&&L.traverseVisible(function(Z){Z.isLight&&Z.layers.test(X.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),p.setupLights();const K=new Set;return L.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const xt=Z.material;if(xt)if(Array.isArray(xt))for(let At=0;At<xt.length;At++){const It=xt[At];le(It,J,Z),K.add(It)}else le(xt,J,Z),K.add(xt)}),p=m.pop(),K},this.compileAsync=function(L,X,J=null){const K=this.compile(L,X,J);return new Promise(Z=>{function xt(){if(K.forEach(function(At){G.get(At).currentProgram.isReady()&&K.delete(At)}),K.size===0){Z(L);return}setTimeout(xt,10)}st.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ee=null;function vn(L){ee&&ee(L)}function mn(){ti.stop()}function uc(){ti.start()}const ti=new Uh;ti.setAnimationLoop(vn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(L){ee=L,_t.setAnimationLoop(L),L===null?ti.stop():ti.start()},_t.addEventListener("sessionstart",mn),_t.addEventListener("sessionend",uc),this.render=function(L,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),_t.enabled===!0&&_t.isPresenting===!0&&(_t.cameraAutoUpdate===!0&&_t.updateCamera(X),X=_t.getCamera()),L.isScene===!0&&L.onBeforeRender(g,L,X,A),p=Ft.get(L,m.length),p.init(X),m.push(p),H.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),ot.setFromProjectionMatrix(H,2e3,X.reversedDepth),O=this.localClippingEnabled,W=St.init(this.clippingPlanes,O),_=et.get(L,v.length),_.init(),v.push(_),_t.enabled===!0&&_t.isPresenting===!0){const xt=g.xr.getDepthSensingMesh();xt!==null&&Mo(xt,X,-1/0,g.sortObjects)}Mo(L,X,0,g.sortObjects),_.finish(),g.sortObjects===!0&&_.sort($,j),vt=_t.enabled===!1||_t.isPresenting===!1||_t.hasDepthSensing()===!1,vt&&Dt.addToRenderList(_,L),this.info.render.frame++,W===!0&&St.beginShadows();const J=p.state.shadowsArray;Lt.render(J,L,X),W===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=_.opaque,Z=_.transmissive;if(p.setupLights(),X.isArrayCamera){const xt=X.cameras;if(Z.length>0)for(let At=0,It=xt.length;At<It;At++){const Ct=xt[At];dc(K,Z,L,Ct)}vt&&Dt.render(L);for(let At=0,It=xt.length;At<It;At++){const Ct=xt[At];fc(_,L,Ct,Ct.viewport)}}else Z.length>0&&dc(K,Z,L,X),vt&&Dt.render(L),fc(_,L,X);A!==null&&w===0&&(ct.updateMultisampleRenderTarget(A),ct.updateRenderTargetMipmap(A)),L.isScene===!0&&L.onAfterRender(g,L,X),Et.resetDefaultState(),T=-1,b=null,m.pop(),m.length>0?(p=m[m.length-1],W===!0&&St.setGlobalState(g.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?_=v[v.length-1]:_=null};function Mo(L,X,J,K){if(L.visible===!1)return;if(L.layers.test(X.layers)){if(L.isGroup)J=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(X);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||ot.intersectsSprite(L)){K&&dt.setFromMatrixPosition(L.matrixWorld).applyMatrix4(H);const At=Y.update(L),It=L.material;It.visible&&_.push(L,At,It,J,dt.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||ot.intersectsObject(L))){const At=Y.update(L),It=L.material;if(K&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),dt.copy(L.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),dt.copy(At.boundingSphere.center)),dt.applyMatrix4(L.matrixWorld).applyMatrix4(H)),Array.isArray(It)){const Ct=At.groups;for(let kt=0,Gt=Ct.length;kt<Gt;kt++){const Bt=Ct[kt],Kt=It[Bt.materialIndex];Kt&&Kt.visible&&_.push(L,At,Kt,J,dt.z,Bt)}}else It.visible&&_.push(L,At,It,J,dt.z,null)}}const xt=L.children;for(let At=0,It=xt.length;At<It;At++)Mo(xt[At],X,J,K)}function fc(L,X,J,K){const Z=L.opaque,xt=L.transmissive,At=L.transparent;p.setupLightsView(J),W===!0&&St.setGlobalState(g.clippingPlanes,J),K&&tt.viewport(y.copy(K)),Z.length>0&&Ys(Z,X,J),xt.length>0&&Ys(xt,X,J),At.length>0&&Ys(At,X,J),tt.buffers.depth.setTest(!0),tt.buffers.depth.setMask(!0),tt.buffers.color.setMask(!0),tt.setPolygonOffset(!1)}function dc(L,X,J,K){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[K.id]===void 0&&(p.state.transmissionRenderTarget[K.id]=new gi(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?1016:1009,minFilter:1008,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));const xt=p.state.transmissionRenderTarget[K.id],At=K.viewport||y;xt.setSize(At.z*g.transmissionResolutionScale,At.w*g.transmissionResolutionScale);const It=g.getRenderTarget(),Ct=g.getActiveCubeFace(),kt=g.getActiveMipmapLevel();g.setRenderTarget(xt),g.getClearColor(I),N=g.getClearAlpha(),N<1&&g.setClearColor(16777215,.5),g.clear(),vt&&Dt.render(J);const Gt=g.toneMapping;g.toneMapping=0;const Bt=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),p.setupLightsView(K),W===!0&&St.setGlobalState(g.clippingPlanes,K),Ys(L,J,K),ct.updateMultisampleRenderTarget(xt),ct.updateRenderTargetMipmap(xt),st.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let se=0,_e=X.length;se<_e;se++){const he=X[se],ae=he.object,Ot=he.geometry,fe=he.material,jt=he.group;if(fe.side===2&&ae.layers.test(K.layers)){const Ze=fe.side;fe.side=1,fe.needsUpdate=!0,pc(ae,J,K,Ot,fe,jt),fe.side=Ze,fe.needsUpdate=!0,Kt=!0}}Kt===!0&&(ct.updateMultisampleRenderTarget(xt),ct.updateRenderTargetMipmap(xt))}g.setRenderTarget(It,Ct,kt),g.setClearColor(I,N),Bt!==void 0&&(K.viewport=Bt),g.toneMapping=Gt}function Ys(L,X,J){const K=X.isScene===!0?X.overrideMaterial:null;for(let Z=0,xt=L.length;Z<xt;Z++){const At=L[Z],It=At.object,Ct=At.geometry,kt=At.group;let Gt=At.material;Gt.allowOverride===!0&&K!==null&&(Gt=K),It.layers.test(J.layers)&&pc(It,X,J,Ct,Gt,kt)}}function pc(L,X,J,K,Z,xt){L.onBeforeRender(g,X,J,K,Z,xt),L.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Z.onBeforeRender(g,X,J,K,L,xt),Z.transparent===!0&&Z.side===2&&Z.forceSinglePass===!1?(Z.side=1,Z.needsUpdate=!0,g.renderBufferDirect(J,X,K,Z,L,xt),Z.side=0,Z.needsUpdate=!0,g.renderBufferDirect(J,X,K,Z,L,xt),Z.side=2):g.renderBufferDirect(J,X,K,Z,L,xt),L.onAfterRender(g,X,J,K,Z,xt)}function qs(L,X,J){X.isScene!==!0&&(X=ht);const K=G.get(L),Z=p.state.lights,xt=p.state.shadowsArray,At=Z.state.version,It=Q.getParameters(L,Z.state,xt,X,J),Ct=Q.getProgramCacheKey(It);let kt=K.programs;K.environment=L.isMeshStandardMaterial?X.environment:null,K.fog=X.fog,K.envMap=(L.isMeshStandardMaterial?Nt:Mt).get(L.envMap||K.environment),K.envMapRotation=K.environment!==null&&L.envMap===null?X.environmentRotation:L.envMapRotation,kt===void 0&&(L.addEventListener("dispose",lt),kt=new Map,K.programs=kt);let Gt=kt.get(Ct);if(Gt!==void 0){if(K.currentProgram===Gt&&K.lightsStateVersion===At)return gc(L,It),Gt}else It.uniforms=Q.getUniforms(L),L.onBeforeCompile(It,g),Gt=Q.acquireProgram(It,Ct),kt.set(Ct,Gt),K.uniforms=It.uniforms;const Bt=K.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Bt.clippingPlanes=St.uniform),gc(L,It),K.needsLights=qh(L),K.lightsStateVersion=At,K.needsLights&&(Bt.ambientLightColor.value=Z.state.ambient,Bt.lightProbe.value=Z.state.probe,Bt.directionalLights.value=Z.state.directional,Bt.directionalLightShadows.value=Z.state.directionalShadow,Bt.spotLights.value=Z.state.spot,Bt.spotLightShadows.value=Z.state.spotShadow,Bt.rectAreaLights.value=Z.state.rectArea,Bt.ltc_1.value=Z.state.rectAreaLTC1,Bt.ltc_2.value=Z.state.rectAreaLTC2,Bt.pointLights.value=Z.state.point,Bt.pointLightShadows.value=Z.state.pointShadow,Bt.hemisphereLights.value=Z.state.hemi,Bt.directionalShadowMap.value=Z.state.directionalShadowMap,Bt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Bt.spotShadowMap.value=Z.state.spotShadowMap,Bt.spotLightMatrix.value=Z.state.spotLightMatrix,Bt.spotLightMap.value=Z.state.spotLightMap,Bt.pointShadowMap.value=Z.state.pointShadowMap,Bt.pointShadowMatrix.value=Z.state.pointShadowMatrix),K.currentProgram=Gt,K.uniformsList=null,Gt}function mc(L){if(L.uniformsList===null){const X=L.currentProgram.getUniforms();L.uniformsList=Yr.seqWithValue(X.seq,L.uniforms)}return L.uniformsList}function gc(L,X){const J=G.get(L);J.outputColorSpace=X.outputColorSpace,J.batching=X.batching,J.batchingColor=X.batchingColor,J.instancing=X.instancing,J.instancingColor=X.instancingColor,J.instancingMorph=X.instancingMorph,J.skinning=X.skinning,J.morphTargets=X.morphTargets,J.morphNormals=X.morphNormals,J.morphColors=X.morphColors,J.morphTargetsCount=X.morphTargetsCount,J.numClippingPlanes=X.numClippingPlanes,J.numIntersection=X.numClipIntersection,J.vertexAlphas=X.vertexAlphas,J.vertexTangents=X.vertexTangents,J.toneMapping=X.toneMapping}function Zh(L,X,J,K,Z){X.isScene!==!0&&(X=ht),ct.resetTextureUnits();const xt=X.fog,At=K.isMeshStandardMaterial?X.environment:null,It=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Qi,Ct=(K.isMeshStandardMaterial?Nt:Mt).get(K.envMap||At),kt=K.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Gt=!!J.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Bt=!!J.morphAttributes.position,Kt=!!J.morphAttributes.normal,se=!!J.morphAttributes.color;let _e=0;K.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(_e=g.toneMapping);const he=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ae=he!==void 0?he.length:0,Ot=G.get(K),fe=p.state.lights;if(W===!0&&(O===!0||L!==b)){const ke=L===b&&K.id===T;St.setState(K,L,ke)}let jt=!1;K.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==fe.state.version||Ot.outputColorSpace!==It||Z.isBatchedMesh&&Ot.batching===!1||!Z.isBatchedMesh&&Ot.batching===!0||Z.isBatchedMesh&&Ot.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&Ot.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&Ot.instancing===!1||!Z.isInstancedMesh&&Ot.instancing===!0||Z.isSkinnedMesh&&Ot.skinning===!1||!Z.isSkinnedMesh&&Ot.skinning===!0||Z.isInstancedMesh&&Ot.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Ot.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Ot.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Ot.instancingMorph===!1&&Z.morphTexture!==null||Ot.envMap!==Ct||K.fog===!0&&Ot.fog!==xt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==St.numPlanes||Ot.numIntersection!==St.numIntersection)||Ot.vertexAlphas!==kt||Ot.vertexTangents!==Gt||Ot.morphTargets!==Bt||Ot.morphNormals!==Kt||Ot.morphColors!==se||Ot.toneMapping!==_e||Ot.morphTargetsCount!==ae)&&(jt=!0):(jt=!0,Ot.__version=K.version);let Ze=Ot.currentProgram;jt===!0&&(Ze=qs(K,X,Z));let yi=!1,Ye=!1,hs=!1;const de=Ze.getUniforms(),je=Ot.uniforms;if(tt.useProgram(Ze.program)&&(yi=!0,Ye=!0,hs=!0),K.id!==T&&(T=K.id,Ye=!0),yi||b!==L){tt.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),de.setValue(F,"projectionMatrix",L.projectionMatrix),de.setValue(F,"viewMatrix",L.matrixWorldInverse);const We=de.map.cameraPosition;We!==void 0&&We.setValue(F,at.setFromMatrixPosition(L.matrixWorld)),it.logarithmicDepthBuffer&&de.setValue(F,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&de.setValue(F,"isOrthographic",L.isOrthographicCamera===!0),b!==L&&(b=L,Ye=!0,hs=!0)}if(Z.isSkinnedMesh){de.setOptional(F,Z,"bindMatrix"),de.setOptional(F,Z,"bindMatrixInverse");const ke=Z.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),de.setValue(F,"boneTexture",ke.boneTexture,ct))}Z.isBatchedMesh&&(de.setOptional(F,Z,"batchingTexture"),de.setValue(F,"batchingTexture",Z._matricesTexture,ct),de.setOptional(F,Z,"batchingIdTexture"),de.setValue(F,"batchingIdTexture",Z._indirectTexture,ct),de.setOptional(F,Z,"batchingColorTexture"),Z._colorsTexture!==null&&de.setValue(F,"batchingColorTexture",Z._colorsTexture,ct));const Qe=J.morphAttributes;if((Qe.position!==void 0||Qe.normal!==void 0||Qe.color!==void 0)&&mt.update(Z,J,Ze),(Ye||Ot.receiveShadow!==Z.receiveShadow)&&(Ot.receiveShadow=Z.receiveShadow,de.setValue(F,"receiveShadow",Z.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(je.envMap.value=Ct,je.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&X.environment!==null&&(je.envMapIntensity.value=X.environmentIntensity),Ye&&(de.setValue(F,"toneMappingExposure",g.toneMappingExposure),Ot.needsLights&&Yh(je,hs),xt&&K.fog===!0&&ut.refreshFogUniforms(je,xt),ut.refreshMaterialUniforms(je,K,B,k,p.state.transmissionRenderTarget[L.id]),Yr.upload(F,mc(Ot),je,ct)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Yr.upload(F,mc(Ot),je,ct),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&de.setValue(F,"center",Z.center),de.setValue(F,"modelViewMatrix",Z.modelViewMatrix),de.setValue(F,"normalMatrix",Z.normalMatrix),de.setValue(F,"modelMatrix",Z.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const ke=K.uniformsGroups;for(let We=0,So=ke.length;We<So;We++){const ei=ke[We];qt.update(ei,Ze),qt.bind(ei,Ze)}}return Ze}function Yh(L,X){L.ambientLightColor.needsUpdate=X,L.lightProbe.needsUpdate=X,L.directionalLights.needsUpdate=X,L.directionalLightShadows.needsUpdate=X,L.pointLights.needsUpdate=X,L.pointLightShadows.needsUpdate=X,L.spotLights.needsUpdate=X,L.spotLightShadows.needsUpdate=X,L.rectAreaLights.needsUpdate=X,L.hemisphereLights.needsUpdate=X}function qh(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(L,X,J){const K=G.get(L);K.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),G.get(L.texture).__webglTexture=X,G.get(L.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:J,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,X){const J=G.get(L);J.__webglFramebuffer=X,J.__useDefaultFramebuffer=X===void 0};const $h=F.createFramebuffer();this.setRenderTarget=function(L,X=0,J=0){A=L,E=X,w=J;let K=!0,Z=null,xt=!1,At=!1;if(L){const Ct=G.get(L);if(Ct.__useDefaultFramebuffer!==void 0)tt.bindFramebuffer(F.FRAMEBUFFER,null),K=!1;else if(Ct.__webglFramebuffer===void 0)ct.setupRenderTarget(L);else if(Ct.__hasExternalTextures)ct.rebindTextures(L,G.get(L.texture).__webglTexture,G.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Bt=L.depthTexture;if(Ct.__boundDepthTexture!==Bt){if(Bt!==null&&G.has(Bt)&&(L.width!==Bt.image.width||L.height!==Bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ct.setupDepthRenderbuffer(L)}}const kt=L.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(At=!0);const Gt=G.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Gt[X])?Z=Gt[X][J]:Z=Gt[X],xt=!0):L.samples>0&&ct.useMultisampledRTT(L)===!1?Z=G.get(L).__webglMultisampledFramebuffer:Array.isArray(Gt)?Z=Gt[J]:Z=Gt,y.copy(L.viewport),R.copy(L.scissor),C=L.scissorTest}else y.copy(q).multiplyScalar(B).floor(),R.copy(nt).multiplyScalar(B).floor(),C=ft;if(J!==0&&(Z=$h),tt.bindFramebuffer(F.FRAMEBUFFER,Z)&&K&&tt.drawBuffers(L,Z),tt.viewport(y),tt.scissor(R),tt.setScissorTest(C),xt){const Ct=G.get(L.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ct.__webglTexture,J)}else if(At){const Ct=X;for(let kt=0;kt<L.textures.length;kt++){const Gt=G.get(L.textures[kt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+kt,Gt.__webglTexture,J,Ct)}}else if(L!==null&&J!==0){const Ct=G.get(L.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ct.__webglTexture,J)}T=-1},this.readRenderTargetPixels=function(L,X,J,K,Z,xt,At,It=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=G.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct){tt.bindFramebuffer(F.FRAMEBUFFER,Ct);try{const kt=L.textures[It],Gt=kt.format,Bt=kt.type;if(!it.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=L.width-K&&J>=0&&J<=L.height-Z&&(L.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+It),F.readPixels(X,J,K,Z,zt.convert(Gt),zt.convert(Bt),xt))}finally{const kt=A!==null?G.get(A).__webglFramebuffer:null;tt.bindFramebuffer(F.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(L,X,J,K,Z,xt,At,It=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=G.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Ct=Ct[At]),Ct)if(X>=0&&X<=L.width-K&&J>=0&&J<=L.height-Z){tt.bindFramebuffer(F.FRAMEBUFFER,Ct);const kt=L.textures[It],Gt=kt.format,Bt=kt.type;if(!it.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Kt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Kt),F.bufferData(F.PIXEL_PACK_BUFFER,xt.byteLength,F.STREAM_READ),L.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+It),F.readPixels(X,J,K,Z,zt.convert(Gt),zt.convert(Bt),0);const se=A!==null?G.get(A).__webglFramebuffer:null;tt.bindFramebuffer(F.FRAMEBUFFER,se);const _e=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await gu(F,_e,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Kt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,xt),F.deleteBuffer(Kt),F.deleteSync(_e),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,X=null,J=0){const K=Math.pow(2,-J),Z=Math.floor(L.image.width*K),xt=Math.floor(L.image.height*K),At=X!==null?X.x:0,It=X!==null?X.y:0;ct.setTexture2D(L,0),F.copyTexSubImage2D(F.TEXTURE_2D,J,0,0,At,It,Z,xt),tt.unbindTexture()};const Jh=F.createFramebuffer(),Kh=F.createFramebuffer();this.copyTextureToTexture=function(L,X,J=null,K=null,Z=0,xt=null){xt===null&&(Z!==0?(Os("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xt=Z,Z=0):xt=0);let At,It,Ct,kt,Gt,Bt,Kt,se,_e;const he=L.isCompressedTexture?L.mipmaps[xt]:L.image;if(J!==null)At=J.max.x-J.min.x,It=J.max.y-J.min.y,Ct=J.isBox3?J.max.z-J.min.z:1,kt=J.min.x,Gt=J.min.y,Bt=J.isBox3?J.min.z:0;else{const Qe=Math.pow(2,-Z);At=Math.floor(he.width*Qe),It=Math.floor(he.height*Qe),L.isDataArrayTexture?Ct=he.depth:L.isData3DTexture?Ct=Math.floor(he.depth*Qe):Ct=1,kt=0,Gt=0,Bt=0}K!==null?(Kt=K.x,se=K.y,_e=K.z):(Kt=0,se=0,_e=0);const ae=zt.convert(X.format),Ot=zt.convert(X.type);let fe;X.isData3DTexture?(ct.setTexture3D(X,0),fe=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(ct.setTexture2DArray(X,0),fe=F.TEXTURE_2D_ARRAY):(ct.setTexture2D(X,0),fe=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);const jt=F.getParameter(F.UNPACK_ROW_LENGTH),Ze=F.getParameter(F.UNPACK_IMAGE_HEIGHT),yi=F.getParameter(F.UNPACK_SKIP_PIXELS),Ye=F.getParameter(F.UNPACK_SKIP_ROWS),hs=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,he.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,he.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,kt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Gt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Bt);const de=L.isDataArrayTexture||L.isData3DTexture,je=X.isDataArrayTexture||X.isData3DTexture;if(L.isDepthTexture){const Qe=G.get(L),ke=G.get(X),We=G.get(Qe.__renderTarget),So=G.get(ke.__renderTarget);tt.bindFramebuffer(F.READ_FRAMEBUFFER,We.__webglFramebuffer),tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,So.__webglFramebuffer);for(let ei=0;ei<Ct;ei++)de&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,G.get(L).__webglTexture,Z,Bt+ei),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,G.get(X).__webglTexture,xt,_e+ei)),F.blitFramebuffer(kt,Gt,At,It,Kt,se,At,It,F.DEPTH_BUFFER_BIT,F.NEAREST);tt.bindFramebuffer(F.READ_FRAMEBUFFER,null),tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(Z!==0||L.isRenderTargetTexture||G.has(L)){const Qe=G.get(L),ke=G.get(X);tt.bindFramebuffer(F.READ_FRAMEBUFFER,Jh),tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,Kh);for(let We=0;We<Ct;We++)de?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Qe.__webglTexture,Z,Bt+We):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Qe.__webglTexture,Z),je?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ke.__webglTexture,xt,_e+We):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ke.__webglTexture,xt),Z!==0?F.blitFramebuffer(kt,Gt,At,It,Kt,se,At,It,F.COLOR_BUFFER_BIT,F.NEAREST):je?F.copyTexSubImage3D(fe,xt,Kt,se,_e+We,kt,Gt,At,It):F.copyTexSubImage2D(fe,xt,Kt,se,kt,Gt,At,It);tt.bindFramebuffer(F.READ_FRAMEBUFFER,null),tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else je?L.isDataTexture||L.isData3DTexture?F.texSubImage3D(fe,xt,Kt,se,_e,At,It,Ct,ae,Ot,he.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(fe,xt,Kt,se,_e,At,It,Ct,ae,he.data):F.texSubImage3D(fe,xt,Kt,se,_e,At,It,Ct,ae,Ot,he):L.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,xt,Kt,se,At,It,ae,Ot,he.data):L.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,xt,Kt,se,he.width,he.height,ae,he.data):F.texSubImage2D(F.TEXTURE_2D,xt,Kt,se,At,It,ae,Ot,he);F.pixelStorei(F.UNPACK_ROW_LENGTH,jt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Ze),F.pixelStorei(F.UNPACK_SKIP_PIXELS,yi),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ye),F.pixelStorei(F.UNPACK_SKIP_IMAGES,hs),xt===0&&X.generateMipmaps&&F.generateMipmap(fe),tt.unbindTexture()},this.initRenderTarget=function(L){G.get(L).__webglFramebuffer===void 0&&ct.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?ct.setTextureCube(L,0):L.isData3DTexture?ct.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?ct.setTexture2DArray(L,0):ct.setTexture2D(L,0),tt.unbindTexture()},this.resetState=function(){E=0,w=0,A=null,tt.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}const Oh=0,H0=1,X0=2,Nl=2,ha=1.25,Fl=1,Be=32,Te=Be/4,kh=65535,qr=Math.pow(2,-24),sc=Symbol("SKIP_GENERATION"),Vh={strategy:Oh,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[sc]:!1};function ye(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function Ia(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){const s=i[n+3]-i[n];s>e&&(e=s,t=n)}return t}function zl(i,t){t.set(i)}function Bl(i,t,e){let n,s;for(let r=0;r<3;r++){const o=r+3;n=i[r],s=t[r],e[r]=n<s?n:s,n=i[o],s=t[o],e[o]=n>s?n:s}}function Cr(i,t,e){for(let n=0;n<3;n++){const s=t[i+2*n],r=t[i+2*n+1],o=s-r,a=s+r;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function ys(i){const t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function ve(i,t){return t[i+15]===kh}function Ie(i,t){return t[i+6]}function Oe(i,t){return t[i+14]}function Ee(i){return i+Te}function Ae(i,t){const e=t[i+6];return i+e*Te}function rc(i,t){return t[i+7]}function ua(i,t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0,u=1/0,f=1/0,d=1/0,x=-1/0,M=-1/0,_=-1/0;const p=i.offset||0;for(let v=(t-p)*6,m=(t+e-p)*6;v<m;v+=6){const g=i[v+0],S=i[v+1],E=g-S,w=g+S;E<r&&(r=E),w>c&&(c=w),g<u&&(u=g),g>x&&(x=g);const A=i[v+2],T=i[v+3],b=A-T,y=A+T;b<o&&(o=b),y>l&&(l=y),A<f&&(f=A),A>M&&(M=A);const R=i[v+4],C=i[v+5],I=R-C,N=R+C;I<a&&(a=I),N>h&&(h=N),R<d&&(d=R),R>_&&(_=R)}n[0]=r,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=h,s[0]=u,s[1]=f,s[2]=d,s[3]=x,s[4]=M,s[5]=_}const wn=32,W0=(i,t)=>i.candidate-t.candidate,Wn=new Array(wn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),Pr=new Float32Array(6);function Z0(i,t,e,n,s,r){let o=-1,a=0;if(r===Oh)o=Ia(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(r===H0)o=Ia(i),o!==-1&&(a=Y0(e,n,s,o));else if(r===X0){const c=ys(i);let l=ha*s;const h=e.offset||0,u=(n-h)*6,f=(n+s-h)*6;for(let d=0;d<3;d++){const x=t[d],p=(t[d+3]-x)/wn;if(s<wn/4){const v=[...Wn];v.length=s;let m=0;for(let S=u;S<f;S+=6,m++){const E=v[m];E.candidate=e[S+2*d],E.count=0;const{bounds:w,leftCacheBounds:A,rightCacheBounds:T}=E;for(let b=0;b<3;b++)T[b]=1/0,T[b+3]=-1/0,A[b]=1/0,A[b+3]=-1/0,w[b]=1/0,w[b+3]=-1/0;Cr(S,e,w)}v.sort(W0);let g=s;for(let S=0;S<g;S++){const E=v[S];for(;S+1<g&&v[S+1].candidate===E.candidate;)v.splice(S+1,1),g--}for(let S=u;S<f;S+=6){const E=e[S+2*d];for(let w=0;w<g;w++){const A=v[w];E>=A.candidate?Cr(S,e,A.rightCacheBounds):(Cr(S,e,A.leftCacheBounds),A.count++)}}for(let S=0;S<g;S++){const E=v[S],w=E.count,A=s-E.count,T=E.leftCacheBounds,b=E.rightCacheBounds;let y=0;w!==0&&(y=ys(T)/c);let R=0;A!==0&&(R=ys(b)/c);const C=Fl+ha*(y*w+R*A);C<l&&(o=d,l=C,a=E.candidate)}}else{for(let g=0;g<wn;g++){const S=Wn[g];S.count=0,S.candidate=x+p+g*p;const E=S.bounds;for(let w=0;w<3;w++)E[w]=1/0,E[w+3]=-1/0}for(let g=u;g<f;g+=6){let w=~~((e[g+2*d]-x)/p);w>=wn&&(w=wn-1);const A=Wn[w];A.count++,Cr(g,e,A.bounds)}const v=Wn[wn-1];zl(v.bounds,v.rightCacheBounds);for(let g=wn-2;g>=0;g--){const S=Wn[g],E=Wn[g+1];Bl(S.bounds,E.rightCacheBounds,S.rightCacheBounds)}let m=0;for(let g=0;g<wn-1;g++){const S=Wn[g],E=S.count,w=S.bounds,T=Wn[g+1].rightCacheBounds;E!==0&&(m===0?zl(w,Pr):Bl(w,Pr,Pr)),m+=E;let b=0,y=0;m!==0&&(b=ys(Pr)/c);const R=s-m;R!==0&&(y=ys(T)/c);const C=Fl+ha*(b*m+y*R);C<l&&(o=d,l=C,a=S.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${r} used.`);return{axis:o,pos:a}}function Y0(i,t,e,n){let s=0;const r=i.offset;for(let o=t,a=t+e;o<a;o++)s+=i[(o-r)*6+n*2];return s/e}class fa{constructor(){this.boundingData=new Float32Array(6)}}function q0(i,t,e,n,s,r){let o=n,a=n+s-1;const c=r.pos,l=r.axis*2,h=e.offset||0;for(;;){for(;o<=a&&e[(o-h)*6+l]<c;)o++;for(;o<=a&&e[(a-h)*6+l]>=c;)a--;if(o<a){for(let u=0;u<t;u++){let f=i[o*t+u];i[o*t+u]=i[a*t+u],i[a*t+u]=f}for(let u=0;u<6;u++){const f=o-h,d=a-h,x=e[f*6+u];e[f*6+u]=e[d*6+u],e[d*6+u]=x}o++,a--}else return o}}let Gh,$r,La,Hh;const $0=Math.pow(2,32);function Da(i){return"count"in i?1:1+Da(i.left)+Da(i.right)}function J0(i,t,e){return Gh=new Float32Array(e),$r=new Uint32Array(e),La=new Uint16Array(e),Hh=new Uint8Array(e),Ua(i,t)}function Ua(i,t){const e=i/4,n=i/2,s="count"in t,r=t.boundingData;for(let o=0;o<6;o++)Gh[e+o]=r[o];if(s)return t.buffer?(Hh.set(new Uint8Array(t.buffer),i),i+t.buffer.byteLength):($r[e+6]=t.offset,La[n+14]=t.count,La[n+15]=kh,i+Be);{const{left:o,right:a,splitAxis:c}=t,l=i+Be;let h=Ua(l,o);const u=i/Be,d=h/Be-u;if(d>$0)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return $r[e+6]=d,$r[e+7]=c,Ua(h,a)}}function K0(i,t,e,n,s,r){const{maxDepth:o,verbose:a,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:h,onProgress:u}=s,f=i.primitiveBuffer,d=i.primitiveBufferStride,x=new Float32Array(6);let M=!1;const _=new fa;return ua(t,e,n,_.boundingData,x),v(_,e,n,x),_;function p(m){u&&u((m-r.offset)/r.count)}function v(m,g,S,E=null,w=0){!M&&w>=o&&(M=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));const A=S>l;if(S<=c&&!A||w>=o)return p(g+S),m.offset=g,m.count=S,m;const T=Z0(m.boundingData,E,t,g,S,h);let b=T.axis===-1?-1:q0(f,d,t,g,S,T);if(T.axis===-1||b===g||b===g+S){if(!A)return p(g+S),m.offset=g,m.count=S,m;T.axis=Math.max(0,Ia(m.boundingData)),b=g+Math.max(1,Math.floor(S/2))}m.splitAxis=T.axis;const y=new fa,R=g,C=b-g;m.left=y,ua(t,R,C,y.boundingData,x),v(y,R,C,x,w+1);const I=new fa,N=b,z=S-C;return m.right=I,ua(t,N,z,I.boundingData,x),v(I,N,z,x,w+1),m}}function j0(i,t){const e=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=i.getRootRanges(t.range),s=n[0],r=n[n.length-1],o={offset:s.offset,count:r.offset+r.count-s.offset},a=new Float32Array(6*o.count);a.offset=o.offset,i.computePrimitiveBounds(o.offset,o.count,a),i._roots=n.map(c=>{const l=K0(i,a,c.offset,c.count,t,o),h=Da(l),u=new e(Be*h);return J0(0,l,u),u})}class oc{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){const t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}}class Q0{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const t=[];let e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}}const ue=new Q0;let $n,$i;const zi=[],Ir=new oc(()=>new Le);function tx(i,t,e,n,s,r){$n=Ir.getPrimitive(),$i=Ir.getPrimitive(),zi.push($n,$i),ue.setBuffer(i._roots[t]);const o=Na(0,i.geometry,e,n,s,r);ue.clearBuffer(),Ir.releasePrimitive($n),Ir.releasePrimitive($i),zi.pop(),zi.pop();const a=zi.length;return a>0&&($i=zi[a-1],$n=zi[a-2]),o}function Na(i,t,e,n,s=null,r=0,o=0){const{float32Array:a,uint16Array:c,uint32Array:l}=ue;let h=i*2;if(ve(h,c)){const f=Ie(i,l),d=Oe(h,c);return ye(i,a,$n),n(f,d,!1,o,r+i/Te,$n)}else{let b=function(R){const{uint16Array:C,uint32Array:I}=ue;let N=R*2;for(;!ve(N,C);)R=Ee(R),N=R*2;return Ie(R,I)},y=function(R){const{uint16Array:C,uint32Array:I}=ue;let N=R*2;for(;!ve(N,C);)R=Ae(R,I),N=R*2;return Ie(R,I)+Oe(N,C)};const f=Ee(i),d=Ae(i,l);let x=f,M=d,_,p,v,m;if(s&&(v=$n,m=$i,ye(x,a,v),ye(M,a,m),_=s(v),p=s(m),p<_)){x=d,M=f;const R=_;_=p,p=R,v=m}v||(v=$n,ye(x,a,v));const g=ve(x*2,c),S=e(v,g,_,o+1,r+x/Te);let E;if(S===Nl){const R=b(x),I=y(x)-R;E=n(R,I,!0,o+1,r+x/Te,v)}else E=S&&Na(x,t,e,n,s,r,o+1);if(E)return!0;m=$i,ye(M,a,m);const w=ve(M*2,c),A=e(m,w,p,o+1,r+M/Te);let T;if(A===Nl){const R=b(M),I=y(M)-R;T=n(R,I,!0,o+1,r+M/Te,m)}else T=A&&Na(M,t,e,n,s,r,o+1);return!!T}}const Us=new ue.constructor,co=new ue.constructor,Yn=new oc(()=>new Le),Bi=new Le,Oi=new Le,da=new Le,pa=new Le;let ma=!1;function ex(i,t,e,n){if(ma)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");ma=!0;const s=i._roots,r=t._roots;let o,a=0,c=0;const l=new Xt().copy(e).invert();for(let h=0,u=s.length;h<u;h++){Us.setBuffer(s[h]),c=0;const f=Yn.getPrimitive();ye(0,Us.float32Array,f),f.applyMatrix4(l);for(let d=0,x=r.length;d<x&&(co.setBuffer(r[d]),o=hn(0,0,e,l,n,a,c,0,0,f),co.clearBuffer(),c+=r[d].byteLength/Be,!o);d++);if(Yn.releasePrimitive(f),Us.clearBuffer(),a+=s[h].byteLength/Be,o)break}return ma=!1,o}function hn(i,t,e,n,s,r=0,o=0,a=0,c=0,l=null,h=!1){let u,f;h?(u=co,f=Us):(u=Us,f=co);const d=u.float32Array,x=u.uint32Array,M=u.uint16Array,_=f.float32Array,p=f.uint32Array,v=f.uint16Array,m=i*2,g=t*2,S=ve(m,M),E=ve(g,v);let w=!1;if(E&&S)h?w=s(Ie(t,p),Oe(t*2,v),Ie(i,x),Oe(i*2,M),c,o+t/Te,a,r+i/Te):w=s(Ie(i,x),Oe(i*2,M),Ie(t,p),Oe(t*2,v),a,r+i/Te,c,o+t/Te);else if(E){const A=Yn.getPrimitive();ye(t,_,A),A.applyMatrix4(e);const T=Ee(i),b=Ae(i,x);ye(T,d,Bi),ye(b,d,Oi);const y=A.intersectsBox(Bi),R=A.intersectsBox(Oi);w=y&&hn(t,T,n,e,s,o,r,c,a+1,A,!h)||R&&hn(t,b,n,e,s,o,r,c,a+1,A,!h),Yn.releasePrimitive(A)}else{const A=Ee(t),T=Ae(t,p);ye(A,_,da),ye(T,_,pa);const b=l.intersectsBox(da),y=l.intersectsBox(pa);if(b&&y)w=hn(i,A,e,n,s,r,o,a,c+1,l,h)||hn(i,T,e,n,s,r,o,a,c+1,l,h);else if(b)if(S)w=hn(i,A,e,n,s,r,o,a,c+1,l,h);else{const R=Yn.getPrimitive();R.copy(da).applyMatrix4(e);const C=Ee(i),I=Ae(i,x);ye(C,d,Bi),ye(I,d,Oi);const N=R.intersectsBox(Bi),z=R.intersectsBox(Oi);w=N&&hn(A,C,n,e,s,o,r,c,a+1,R,!h)||z&&hn(A,I,n,e,s,o,r,c,a+1,R,!h),Yn.releasePrimitive(R)}else if(y)if(S)w=hn(i,T,e,n,s,r,o,a,c+1,l,h);else{const R=Yn.getPrimitive();R.copy(pa).applyMatrix4(e);const C=Ee(i),I=Ae(i,x);ye(C,d,Bi),ye(I,d,Oi);const N=R.intersectsBox(Bi),z=R.intersectsBox(Oi);w=N&&hn(T,C,n,e,s,o,r,c,a+1,R,!h)||z&&hn(T,I,n,e,s,o,r,c,a+1,R,!h),Yn.releasePrimitive(R)}}return w}const ga=new class{constructor(){let i=null,t=null,e=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(r,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=i=r._roots[o],this.uint16Array=e=new Uint16Array(i),this.uint32Array=t=new Uint32Array(i)},this.reset=()=>{this.root=null,this.buffer=i=null,this.uint16Array=e=null,this.uint32Array=t=null},this.getRangeStart=r=>{let o=r*2;for(;!ve(o,e);)r=Ee(r),o=r*2;return Ie(r,t)},this.getRangeEnd=r=>{let o=r*2;for(;!ve(o,e);)r=Ae(r,t),o=r*2;return Ie(r,t)+Oe(o,e)};const s=(r,o,a)=>{const c=o*2,l=ve(c,e);if(!r(a,l,o)&&!l){const u=Ee(o),f=Ae(o,t);s(r,u,a+1),s(r,f,a+1)}};this.traverseBuffer=r=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{s(r,0,0)}finally{n=!1}},this.traverse=r=>{this.traverseBuffer((o,a,c)=>{if(a){const l=c*2,h=t[c+6],u=e[l+14];return r(o,a,new Float32Array(i,c*4,6),h,u)}else{const l=rc(c,t);return r(o,a,new Float32Array(i,c*4,6),l)}})}}},Ol=new Le,ki=new Float32Array(6);class nx{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(t){t={...Vh,...t},"maxLeafSize"in t&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafSize}),j0(this,t)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0;for(let u=t,f=t+e;u<f;u++){this.writePrimitiveBounds(u,ki,0);const[d,x,M,_,p,v]=ki;d<r&&(r=d),_>c&&(c=_),x<o&&(o=x),p>l&&(l=p),M<a&&(a=M),v>h&&(h=v)}return n[s+0]=r,n[s+1]=o,n[s+2]=a,n[s+3]=c,n[s+4]=l,n[s+5]=h,n}computePrimitiveBounds(t,e,n){const s=n.offset||0;for(let r=t,o=t+e;r<o;r++){this.writePrimitiveBounds(r,ki,0);const[a,c,l,h,u,f]=ki,d=(a+h)/2,x=(c+u)/2,M=(l+f)/2,_=(h-a)/2,p=(u-c)/2,v=(f-l)/2,m=(r-s)*6;n[m+0]=d,n[m+1]=_+(Math.abs(d)+_)*qr,n[m+2]=x,n[m+3]=p+(Math.abs(x)+p)*qr,n[m+4]=M,n[m+5]=v+(Math.abs(M)+v)*qr}return n}shiftPrimitiveOffsets(t){const e=this._indirectBuffer;if(e)for(let n=0,s=e.length;n<s;n++)e[n]+=t;else{const n=this._roots;for(let s=0;s<n.length;s++){const r=n[s],o=new Uint32Array(r),a=new Uint16Array(r),c=r.byteLength/Be;for(let l=0;l<c;l++){const h=Te*l,u=2*h;ve(u,a)&&(o[h+6]+=t)}}}}traverse(t,e=0){ga.setBVH(this,e),ga.traverse(t),ga.reset()}refit(){const t=this._roots;for(let e=0,n=t.length;e<n;e++){const s=t[e],r=new Uint32Array(s),o=new Uint16Array(s),a=new Float32Array(s),c=s.byteLength/Be;for(let l=c-1;l>=0;l--){const h=l*Te,u=h*2;if(ve(u,o)){const d=Ie(h,r),x=Oe(u,o);this.writePrimitiveRangeBounds(d,x,ki,0),a.set(ki,h)}else{const d=Ee(h),x=Ae(h,r);for(let M=0;M<3;M++){const _=a[d+M],p=a[d+M+3],v=a[x+M],m=a[x+M+3];a[h+M]=_<v?_:v,a[h+M+3]=p>m?p:m}}}}}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{ye(0,new Float32Array(n),Ol),t.union(Ol)}),t}shapecast(t){let{boundsTraverseOrder:e,intersectsBounds:n,intersectsRange:s,intersectsPrimitive:r,scratchPrimitive:o,iterate:a}=t;if(s&&r){const u=s;s=(f,d,x,M,_)=>u(f,d,x,M,_)?!0:a(f,d,this,r,x,M,o)}else s||(r?s=(u,f,d,x)=>a(u,f,this,r,d,x,o):s=(u,f,d)=>d);let c=!1,l=0;const h=this._roots;for(let u=0,f=h.length;u<f;u++){const d=h[u];if(c=tx(this,u,n,s,e,l),c)break;l+=d.byteLength/Be}return c}bvhcast(t,e,n){let{intersectsRanges:s}=n;return ex(this,t,e,s)}}function ix(){return typeof SharedArrayBuffer<"u"}function ac(i){return i.index?i.index.count:i.attributes.position.count}function yo(i){return ac(i)/3}function sx(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function rx(i,t){if(!i.index){const e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=sx(e,n);i.setIndex(new Se(s,1));for(let r=0;r<e;r++)s[r]=r}}function ox(i,t,e){const n=ac(i)/e,s=t||i.drawRange,r=s.start/e,o=(s.start+s.count)/e,a=Math.max(0,r),c=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(c)}}function ax(i,t){return i.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function kl(i,t,e){const n=ox(i,t,e),s=ax(i,e);if(!s.length)return[n];const r=[],o=n.offset,a=n.offset+n.count,c=ac(i)/e,l=[];for(const f of s){const{offset:d,count:x}=f,M=d,_=isFinite(x)?x:c-d,p=d+_;M<a&&p>o&&(l.push({pos:Math.max(o,M),isStart:!0}),l.push({pos:Math.min(a,p),isStart:!1}))}l.sort((f,d)=>f.pos!==d.pos?f.pos-d.pos:f.type==="end"?-1:1);let h=0,u=null;for(const f of l){const d=f.pos;h!==0&&d!==u&&r.push({offset:u,count:d-u}),h+=f.isStart?1:-1,u=d}return r}function cx(i,t){const e=i[i.length-1],n=e.offset+e.count>2**16,s=i.reduce((l,h)=>l+h.count,0),r=n?4:2,o=t?new SharedArrayBuffer(s*r):new ArrayBuffer(s*r),a=n?new Uint32Array(o):new Uint16Array(o);let c=0;for(let l=0;l<i.length;l++){const{offset:h,count:u}=i[l];for(let f=0;f<u;f++)a[c+f]=h+f;c+=u}return a}class lx extends nx{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(t){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(t){}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(e.useSharedArrayBuffer&&!ix())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=t,this.resolvePrimitiveIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,e={...Vh,...e},e[sc]||this.init(e)}init(t){const{geometry:e,primitiveStride:n}=this;if(t.indirect){const s=kl(e,t.range,n),r=cx(s,t.useSharedArrayBuffer);this._indirectBuffer=r}else rx(e,t);super.init(t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new Le))}getRootRanges(t){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:kl(this.geometry,t,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}}class Bn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,s=-1/0;for(let r=0,o=t.length;r<o;r++){const c=t[r][e];n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}setFromPoints(t,e){let n=1/0,s=-1/0;for(let r=0,o=e.length;r<o;r++){const a=e[r],c=t.dot(a);n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}isSeparated(t){return this.min>t.max||t.min>this.max}}Bn.prototype.setFromBox=(function(){const i=new D;return function(e,n){const s=n.min,r=n.max;let o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){i.x=s.x*c+r.x*(1-c),i.y=s.y*l+r.y*(1-l),i.z=s.z*h+r.z*(1-h);const u=e.dot(i);o=Math.min(u,o),a=Math.max(u,a)}this.min=o,this.max=a}})();const hx=(function(){const i=new D,t=new D,e=new D;return function(s,r,o){const a=s.start,c=i,l=r.start,h=t;e.subVectors(a,l),i.subVectors(s.end,s.start),t.subVectors(r.end,r.start);const u=e.dot(h),f=h.dot(c),d=h.dot(h),x=e.dot(c),_=c.dot(c)*d-f*f;let p,v;_!==0?p=(u*f-x*d)/_:p=0,v=(u+p*f)/d,o.x=p,o.y=v}})(),cc=(function(){const i=new pt,t=new D,e=new D;return function(s,r,o,a){hx(s,r,i);let c=i.x,l=i.y;if(c>=0&&c<=1&&l>=0&&l<=1){s.at(c,o),r.at(l,a);return}else if(c>=0&&c<=1){l<0?r.at(0,a):r.at(1,a),s.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?s.at(0,o):s.at(1,o),r.closestPointToPoint(o,!0,a);return}else{let h;c<0?h=s.start:h=s.end;let u;l<0?u=r.start:u=r.end;const f=t,d=e;if(s.closestPointToPoint(u,!0,t),r.closestPointToPoint(h,!0,e),f.distanceToSquared(u)<=d.distanceToSquared(h)){o.copy(f),a.copy(u);return}else{o.copy(h),a.copy(d);return}}}})(),ux=(function(){const i=new D,t=new D,e=new Rn,n=new zn;return function(r,o){const{radius:a,center:c}=r,{a:l,b:h,c:u}=o;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a||(n.start=l,n.end=u,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a)||(n.start=h,n.end=u,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a))return!0;const M=o.getPlane(e);if(Math.abs(M.distanceToPoint(c))<=a){const p=M.projectPoint(c,t);if(o.containsPoint(p))return!0}return!1}})(),fx=["x","y","z"],Cn=1e-15,Vl=Cn*Cn;function en(i){return Math.abs(i)<Cn}class dn extends Pe{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new D),this.satBounds=new Array(4).fill().map(()=>new Bn),this.points=[this.a,this.b,this.c],this.plane=new Rn,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new zn,this.needsUpdate=!0}intersectsSphere(t){return ux(t,this)}update(){const t=this.a,e=this.b,n=this.c,s=this.points,r=this.satAxes,o=this.satBounds,a=r[0],c=o[0];this.getNormal(a),c.setFromPoints(a,s);const l=r[1],h=o[1];l.subVectors(t,e),h.setFromPoints(l,s);const u=r[2],f=o[2];u.subVectors(e,n),f.setFromPoints(u,s);const d=r[3],x=o[3];d.subVectors(n,t),x.setFromPoints(d,s);const M=l.length(),_=u.length(),p=d.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,M<Cn?_<Cn||p<Cn?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(n)):_<Cn?p<Cn?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(t)):p<Cn&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(e)),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}}dn.prototype.closestPointToSegment=(function(){const i=new D,t=new D,e=new zn;return function(s,r=null,o=null){const{start:a,end:c}=s,l=this.points;let h,u=1/0;for(let f=0;f<3;f++){const d=(f+1)%3;e.start.copy(l[f]),e.end.copy(l[d]),cc(e,s,i,t),h=i.distanceToSquared(t),h<u&&(u=h,r&&r.copy(i),o&&o.copy(t))}return this.closestPointToPoint(a,i),h=a.distanceToSquared(i),h<u&&(u=h,r&&r.copy(i),o&&o.copy(a)),this.closestPointToPoint(c,i),h=c.distanceToSquared(i),h<u&&(u=h,r&&r.copy(i),o&&o.copy(c)),Math.sqrt(u)}})();dn.prototype.intersectsTriangle=(function(){const i=new dn,t=new Bn,e=new Bn,n=new D,s=new D,r=new D,o=new D,a=new zn,c=new zn,l=new D,h=new pt,u=new pt;function f(m,g,S,E){const w=n;!m.isDegenerateIntoPoint&&!m.isDegenerateIntoSegment?w.copy(m.plane.normal):w.copy(g.plane.normal);const A=m.satBounds,T=m.satAxes;for(let R=1;R<4;R++){const C=A[R],I=T[R];if(t.setFromPoints(I,g.points),C.isSeparated(t)||(o.copy(w).cross(I),t.setFromPoints(o,m.points),e.setFromPoints(o,g.points),t.isSeparated(e)))return!1}const b=g.satBounds,y=g.satAxes;for(let R=1;R<4;R++){const C=b[R],I=y[R];if(t.setFromPoints(I,m.points),C.isSeparated(t)||(o.crossVectors(w,I),t.setFromPoints(o,m.points),e.setFromPoints(o,g.points),t.isSeparated(e)))return!1}return S&&(E||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),S.start.set(0,0,0),S.end.set(0,0,0)),!0}function d(m,g,S,E,w,A,T,b,y,R,C){let I=T/(T-b);R.x=E+(w-E)*I,C.start.subVectors(g,m).multiplyScalar(I).add(m),I=T/(T-y),R.y=E+(A-E)*I,C.end.subVectors(S,m).multiplyScalar(I).add(m)}function x(m,g,S,E,w,A,T,b,y,R,C){if(w>0)d(m.c,m.a,m.b,E,g,S,y,T,b,R,C);else if(A>0)d(m.b,m.a,m.c,S,g,E,b,T,y,R,C);else if(b*y>0||T!=0)d(m.a,m.b,m.c,g,S,E,T,b,y,R,C);else if(b!=0)d(m.b,m.a,m.c,S,g,E,b,T,y,R,C);else if(y!=0)d(m.c,m.a,m.b,E,g,S,y,T,b,R,C);else return!0;return!1}function M(m,g,S,E){const w=g.degenerateSegment,A=m.plane.distanceToPoint(w.start),T=m.plane.distanceToPoint(w.end);return en(A)?en(T)?f(m,g,S,E):(S&&(S.start.copy(w.start),S.end.copy(w.start)),m.containsPoint(w.start)):en(T)?(S&&(S.start.copy(w.end),S.end.copy(w.end)),m.containsPoint(w.end)):m.plane.intersectLine(w,n)!=null?(S&&(S.start.copy(n),S.end.copy(n)),m.containsPoint(n)):!1}function _(m,g,S){const E=g.a;return en(m.plane.distanceToPoint(E))&&m.containsPoint(E)?(S&&(S.start.copy(E),S.end.copy(E)),!0):!1}function p(m,g,S){const E=m.degenerateSegment,w=g.a;return E.closestPointToPoint(w,!0,n),w.distanceToSquared(n)<Vl?(S&&(S.start.copy(w),S.end.copy(w)),!0):!1}function v(m,g,S,E){if(m.isDegenerateIntoSegment)if(g.isDegenerateIntoSegment){const w=m.degenerateSegment,A=g.degenerateSegment,T=s,b=r;w.delta(T),A.delta(b);const y=n.subVectors(A.start,w.start),R=T.x*b.y-T.y*b.x;if(en(R))return!1;const C=(y.x*b.y-y.y*b.x)/R,I=-(T.x*y.y-T.y*y.x)/R;if(C<0||C>1||I<0||I>1)return!1;const N=w.start.z+T.z*C,z=A.start.z+b.z*I;return en(N-z)?(S&&(S.start.copy(w.start).addScaledVector(T,C),S.end.copy(w.start).addScaledVector(T,C)),!0):!1}else return g.isDegenerateIntoPoint?p(m,g,S):M(g,m,S,E);else{if(m.isDegenerateIntoPoint)return g.isDegenerateIntoPoint?g.a.distanceToSquared(m.a)<Vl?(S&&(S.start.copy(m.a),S.end.copy(m.a)),!0):!1:g.isDegenerateIntoSegment?p(g,m,S):_(g,m,S);if(g.isDegenerateIntoPoint)return _(m,g,S);if(g.isDegenerateIntoSegment)return M(m,g,S,E)}}return function(g,S=null,E=!1){this.needsUpdate&&this.update(),g.isExtendedTriangle?g.needsUpdate&&g.update():(i.copy(g),i.update(),g=i);const w=v(this,g,S,E);if(w!==void 0)return w;const A=this.plane,T=g.plane;let b=T.distanceToPoint(this.a),y=T.distanceToPoint(this.b),R=T.distanceToPoint(this.c);en(b)&&(b=0),en(y)&&(y=0),en(R)&&(R=0);const C=b*y,I=b*R;if(C>0&&I>0)return!1;let N=A.distanceToPoint(g.a),z=A.distanceToPoint(g.b),k=A.distanceToPoint(g.c);en(N)&&(N=0),en(z)&&(z=0),en(k)&&(k=0);const B=N*z,$=N*k;if(B>0&&$>0)return!1;s.copy(A.normal),r.copy(T.normal);const j=s.cross(r);let q=0,nt=Math.abs(j.x);const ft=Math.abs(j.y);ft>nt&&(nt=ft,q=1),Math.abs(j.z)>nt&&(q=2);const W=fx[q],O=this.a[W],H=this.b[W],at=this.c[W],dt=g.a[W],ht=g.b[W],vt=g.c[W];if(x(this,O,H,at,C,I,b,y,R,h,a))return f(this,g,S,E);if(x(g,dt,ht,vt,B,$,N,z,k,u,c))return f(this,g,S,E);if(h.y<h.x){const Rt=h.y;h.y=h.x,h.x=Rt,l.copy(a.start),a.start.copy(a.end),a.end.copy(l)}if(u.y<u.x){const Rt=u.y;u.y=u.x,u.x=Rt,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return h.y<u.x||u.y<h.x?!1:(S&&(u.x>h.x?S.start.copy(c.start):S.start.copy(a.start),u.y<h.y?S.end.copy(c.end):S.end.copy(a.end)),!0)}})();dn.prototype.distanceToPoint=(function(){const i=new D;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();dn.prototype.distanceToTriangle=(function(){const i=new D,t=new D,e=["a","b","c"],n=new zn,s=new zn;return function(o,a=null,c=null){const l=a||c?n:null;if(this.intersectsTriangle(o,l,!0))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let h=1/0;for(let u=0;u<3;u++){let f;const d=e[u],x=o[d];this.closestPointToPoint(x,i),f=x.distanceToSquared(i),f<h&&(h=f,a&&a.copy(i),c&&c.copy(x));const M=this[d];o.closestPointToPoint(M,i),f=M.distanceToSquared(i),f<h&&(h=f,a&&a.copy(M),c&&c.copy(i))}for(let u=0;u<3;u++){const f=e[u],d=e[(u+1)%3];n.set(this[f],this[d]);for(let x=0;x<3;x++){const M=e[x],_=e[(x+1)%3];s.set(o[M],o[_]),cc(n,s,i,t);const p=i.distanceToSquared(t);p<h&&(h=p,a&&a.copy(i),c&&c.copy(t))}}return Math.sqrt(h)}})();class Xe{constructor(t,e,n){this.isOrientedBox=!0,this.min=new D,this.max=new D,this.matrix=new Xt,this.invMatrix=new Xt,this.points=new Array(8).fill().map(()=>new D),this.satAxes=new Array(3).fill().map(()=>new D),this.satBounds=new Array(3).fill().map(()=>new Bn),this.alignedSatBounds=new Array(3).fill().map(()=>new Bn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}}Xe.prototype.update=(function(){return function(){const t=this.matrix,e=this.min,n=this.max,s=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let u=0;u<=1;u++){const f=1*l|2*h|4*u,d=s[f];d.x=l?n.x:e.x,d.y=h?n.y:e.y,d.z=u?n.z:e.z,d.applyMatrix4(t)}const r=this.satBounds,o=this.satAxes,a=s[0];for(let l=0;l<3;l++){const h=o[l],u=r[l],f=1<<l,d=s[f];h.subVectors(a,d),u.setFromPoints(h,s)}const c=this.alignedSatBounds;c[0].setFromPointsField(s,"x"),c[1].setFromPointsField(s,"y"),c[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();Xe.prototype.intersectsBox=(function(){const i=new Bn;return function(e){this.needsUpdate&&this.update();const n=e.min,s=e.max,r=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(i.min=n.x,i.max=s.x,a[0].isSeparated(i)||(i.min=n.y,i.max=s.y,a[1].isSeparated(i))||(i.min=n.z,i.max=s.z,a[2].isSeparated(i)))return!1;for(let c=0;c<3;c++){const l=o[c],h=r[c];if(i.setFromBox(l,e),h.isSeparated(i))return!1}return!0}})();Xe.prototype.intersectsTriangle=(function(){const i=new dn,t=new Array(3),e=new Bn,n=new Bn,s=new D;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(i.copy(o),i.update(),o=i);const a=this.satBounds,c=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let f=0;f<3;f++){const d=a[f],x=c[f];if(e.setFromPoints(x,t),d.isSeparated(e))return!1}const l=o.satBounds,h=o.satAxes,u=this.points;for(let f=0;f<3;f++){const d=l[f],x=h[f];if(e.setFromPoints(x,u),d.isSeparated(e))return!1}for(let f=0;f<3;f++){const d=c[f];for(let x=0;x<4;x++){const M=h[x];if(s.crossVectors(d,M),e.setFromPoints(s,t),n.setFromPoints(s,u),e.isSeparated(n))return!1}}return!0}})();Xe.prototype.closestPointToPoint=(function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}})();Xe.prototype.distanceToPoint=(function(){const i=new D;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();Xe.prototype.distanceToBox=(function(){const i=["x","y","z"],t=new Array(12).fill().map(()=>new zn),e=new Array(12).fill().map(()=>new zn),n=new D,s=new D;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(s),this.closestPointToPoint(s,n),o.closestPointToPoint(n,s),c&&c.copy(n),l&&l.copy(s)),0;const h=a*a,u=o.min,f=o.max,d=this.points;let x=1/0;for(let _=0;_<8;_++){const p=d[_];s.copy(p).clamp(u,f);const v=p.distanceToSquared(s);if(v<x&&(x=v,c&&c.copy(p),l&&l.copy(s),v<h))return Math.sqrt(v)}let M=0;for(let _=0;_<3;_++)for(let p=0;p<=1;p++)for(let v=0;v<=1;v++){const m=(_+1)%3,g=(_+2)%3,S=p<<m|v<<g,E=1<<_|p<<m|v<<g,w=d[S],A=d[E];t[M].set(w,A);const b=i[_],y=i[m],R=i[g],C=e[M],I=C.start,N=C.end;I[b]=u[b],I[y]=p?u[y]:f[y],I[R]=v?u[R]:f[y],N[b]=f[b],N[y]=p?u[y]:f[y],N[R]=v?u[R]:f[y],M++}for(let _=0;_<=1;_++)for(let p=0;p<=1;p++)for(let v=0;v<=1;v++){s.x=_?f.x:u.x,s.y=p?f.y:u.y,s.z=v?f.z:u.z,this.closestPointToPoint(s,n);const m=s.distanceToSquared(n);if(m<x&&(x=m,c&&c.copy(n),l&&l.copy(s),m<h))return Math.sqrt(m)}for(let _=0;_<12;_++){const p=t[_];for(let v=0;v<12;v++){const m=e[v];cc(p,m,n,s);const g=n.distanceToSquared(s);if(g<x&&(x=g,c&&c.copy(n),l&&l.copy(s),g<h))return Math.sqrt(g)}}return Math.sqrt(x)}})();class dx extends oc{constructor(){super(()=>new dn)}}const sn=new dx,vs=new D,xa=new D;function px(i,t,e={},n=0,s=1/0){const r=n*n,o=s*s;let a=1/0,c=null;if(i.shapecast({boundsTraverseOrder:h=>(vs.copy(t).clamp(h.min,h.max),vs.distanceToSquared(t)),intersectsBounds:(h,u,f)=>f<a&&f<o,intersectsTriangle:(h,u)=>{h.closestPointToPoint(t,vs);const f=t.distanceToSquared(vs);return f<a&&(xa.copy(vs),a=f,c=u),f<r}}),a===1/0)return null;const l=Math.sqrt(a);return e.point?e.point.copy(xa):e.point=xa.clone(),e.distance=l,e.faceIndex=c,e}const Lr=parseInt("180")>=169,mx=parseInt("180")<=161,ci=new D,li=new D,hi=new D,Dr=new pt,Ur=new pt,Nr=new pt,Gl=new D,Hl=new D,Xl=new D,Ms=new D;function gx(i,t,e,n,s,r,o,a){let c;if(r===1?c=i.intersectTriangle(n,e,t,!0,s):c=i.intersectTriangle(t,e,n,r!==2,s),c===null)return null;const l=i.origin.distanceTo(s);return l<o||l>a?null:{distance:l,point:s.clone()}}function Wl(i,t,e,n,s,r,o,a,c,l,h){ci.fromBufferAttribute(t,r),li.fromBufferAttribute(t,o),hi.fromBufferAttribute(t,a);const u=gx(i,ci,li,hi,Ms,c,l,h);if(u){if(n){Dr.fromBufferAttribute(n,r),Ur.fromBufferAttribute(n,o),Nr.fromBufferAttribute(n,a),u.uv=new pt;const d=Pe.getInterpolation(Ms,ci,li,hi,Dr,Ur,Nr,u.uv);Lr||(u.uv=d)}if(s){Dr.fromBufferAttribute(s,r),Ur.fromBufferAttribute(s,o),Nr.fromBufferAttribute(s,a),u.uv1=new pt;const d=Pe.getInterpolation(Ms,ci,li,hi,Dr,Ur,Nr,u.uv1);Lr||(u.uv1=d),mx&&(u.uv2=u.uv1)}if(e){Gl.fromBufferAttribute(e,r),Hl.fromBufferAttribute(e,o),Xl.fromBufferAttribute(e,a),u.normal=new D;const d=Pe.getInterpolation(Ms,ci,li,hi,Gl,Hl,Xl,u.normal);u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1),Lr||(u.normal=d)}const f={a:r,b:o,c:a,normal:new D,materialIndex:0};if(Pe.getNormal(ci,li,hi,f.normal),u.face=f,u.faceIndex=r,Lr){const d=new D;Pe.getBarycoord(Ms,ci,li,hi,d),u.barycoord=d}}return u}function Zl(i){return i&&i.isMaterial?i.side:i}function vo(i,t,e,n,s,r,o){const a=n*3;let c=a+0,l=a+1,h=a+2;const{index:u,groups:f}=i;i.index&&(c=u.getX(c),l=u.getX(l),h=u.getX(h));const{position:d,normal:x,uv:M,uv1:_}=i.attributes;if(Array.isArray(t)){const p=n*3;for(let v=0,m=f.length;v<m;v++){const{start:g,count:S,materialIndex:E}=f[v];if(p>=g&&p<g+S){const w=Zl(t[E]),A=Wl(e,d,x,M,_,c,l,h,w,r,o);if(A)if(A.faceIndex=n,A.face.materialIndex=E,s)s.push(A);else return A}}}else{const p=Zl(t),v=Wl(e,d,x,M,_,c,l,h,p,r,o);if(v)if(v.faceIndex=n,v.face.materialIndex=0,s)s.push(v);else return v}return null}function be(i,t,e,n){const s=i.a,r=i.b,o=i.c;let a=t,c=t+1,l=t+2;e&&(a=e.getX(a),c=e.getX(c),l=e.getX(l)),s.x=n.getX(a),s.y=n.getY(a),s.z=n.getZ(a),r.x=n.getX(c),r.y=n.getY(c),r.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function xx(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,u=n+s;h<u;h++)vo(c,t,e,h,r,o,a)}function _x(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let u=n,f=n+s;u<f;u++){let d;d=vo(a,t,e,u,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function yx(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,u=t+i;h<u;h++){let f;if(f=h,be(o,f*3,c,l),o.needsUpdate=!0,n(o,f,s,r))return!0}return!1}function vx(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),u(0,l),l+=r.byteLength;function u(f,d,x=!1){const M=f*2;if(ve(M,a)){const _=Ie(f,o),p=Oe(M,a);let v=1/0,m=1/0,g=1/0,S=-1/0,E=-1/0,w=-1/0;for(let A=3*_,T=3*(_+p);A<T;A++){let b=n[A];const y=s.getX(b),R=s.getY(b),C=s.getZ(b);y<v&&(v=y),y>S&&(S=y),R<m&&(m=R),R>E&&(E=R),C<g&&(g=C),C>w&&(w=C)}return c[f+0]!==v||c[f+1]!==m||c[f+2]!==g||c[f+3]!==S||c[f+4]!==E||c[f+5]!==w?(c[f+0]=v,c[f+1]=m,c[f+2]=g,c[f+3]=S,c[f+4]=E,c[f+5]=w,!0):!1}else{const _=Ee(f),p=Ae(f,o);let v=x,m=!1,g=!1;if(t){if(!v){const b=_/Te+d/Be,y=p/Te+d/Be;m=t.has(b),g=t.has(y),v=!m&&!g}}else m=!0,g=!0;const S=v||m,E=v||g;let w=!1;S&&(w=u(_,d,v));let A=!1;E&&(A=u(p,d,v));const T=w||A;if(T)for(let b=0;b<3;b++){const y=_+b,R=p+b,C=c[y],I=c[y+3],N=c[R],z=c[R+3];c[f+b]=C<N?C:N,c[f+b+3]=I>z?I:z}return T}}}function jn(i,t,e,n,s){let r,o,a,c,l,h;const u=1/e.direction.x,f=1/e.direction.y,d=1/e.direction.z,x=e.origin.x,M=e.origin.y,_=e.origin.z;let p=t[i],v=t[i+3],m=t[i+1],g=t[i+3+1],S=t[i+2],E=t[i+3+2];return u>=0?(r=(p-x)*u,o=(v-x)*u):(r=(v-x)*u,o=(p-x)*u),f>=0?(a=(m-M)*f,c=(g-M)*f):(a=(g-M)*f,c=(m-M)*f),r>c||a>o||((a>r||isNaN(r))&&(r=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(S-_)*d,h=(E-_)*d):(l=(E-_)*d,h=(S-_)*d),r>h||l>o)?!1:((l>r||r!==r)&&(r=l),(h<o||o!==o)&&(o=h),r<=s&&o>=n)}function Mx(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,u=n+s;h<u;h++){let f=l?l[h]:h;vo(c,t,e,f,r,o,a)}}function Sx(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let u=n,f=n+s;u<f;u++){let d;d=vo(a,t,e,c?c[u]:u,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function bx(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,u=t+i;h<u;h++){let f;if(f=e.resolveTriangleIndex(h),be(o,f*3,c,l),o.needsUpdate=!0,n(o,f,s,r))return!0}return!1}function Tx(i,t,e,n,s,r,o){ue.setBuffer(i._roots[t]),Fa(0,i,e,n,s,r,o),ue.clearBuffer()}function Fa(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=ue,h=i*2;if(ve(h,c)){const f=Ie(i,l),d=Oe(h,c);xx(t,e,n,f,d,s,r,o)}else{const f=Ee(i);jn(f,a,n,r,o)&&Fa(f,t,e,n,s,r,o);const d=Ae(i,l);jn(d,a,n,r,o)&&Fa(d,t,e,n,s,r,o)}}const Ex=["x","y","z"];function Ax(i,t,e,n,s,r){ue.setBuffer(i._roots[t]);const o=za(0,i,e,n,s,r);return ue.clearBuffer(),o}function za(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=ue;let l=i*2;if(ve(l,a)){const u=Ie(i,c),f=Oe(l,a);return _x(t,e,n,u,f,s,r)}else{const u=rc(i,c),f=Ex[u],x=n.direction[f]>=0;let M,_;x?(M=Ee(i),_=Ae(i,c)):(M=Ae(i,c),_=Ee(i));const v=jn(M,o,n,s,r)?za(M,t,e,n,s,r):null;if(v){const S=v.point[f];if(x?S<=o[_+u]:S>=o[_+u+3])return v}const g=jn(_,o,n,s,r)?za(_,t,e,n,s,r):null;return v&&g?v.distance<=g.distance?v:g:v||g||null}}const Fr=new Le,Vi=new dn,Gi=new dn,Ss=new Xt,Yl=new Xe,zr=new Xe;function wx(i,t,e,n){ue.setBuffer(i._roots[t]);const s=Ba(0,i,e,n);return ue.clearBuffer(),s}function Ba(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=ue;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),Yl.set(e.boundingBox.min,e.boundingBox.max,n),s=Yl),ve(c,o)){const h=t.geometry,u=h.index,f=h.attributes.position,d=e.index,x=e.attributes.position,M=Ie(i,a),_=Oe(c,o);if(Ss.copy(n).invert(),e.boundsTree)return ye(i,r,zr),zr.matrix.copy(Ss),zr.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:v=>zr.intersectsBox(v),intersectsTriangle:v=>{v.a.applyMatrix4(n),v.b.applyMatrix4(n),v.c.applyMatrix4(n),v.needsUpdate=!0;for(let m=M*3,g=(_+M)*3;m<g;m+=3)if(be(Gi,m,u,f),Gi.needsUpdate=!0,v.intersectsTriangle(Gi))return!0;return!1}});{const p=yo(e);for(let v=M*3,m=(_+M)*3;v<m;v+=3){be(Vi,v,u,f),Vi.a.applyMatrix4(Ss),Vi.b.applyMatrix4(Ss),Vi.c.applyMatrix4(Ss),Vi.needsUpdate=!0;for(let g=0,S=p*3;g<S;g+=3)if(be(Gi,g,d,x),Gi.needsUpdate=!0,Vi.intersectsTriangle(Gi))return!0}}}else{const h=Ee(i),u=Ae(i,a);return ye(h,r,Fr),!!(s.intersectsBox(Fr)&&Ba(h,t,e,n,s)||(ye(u,r,Fr),s.intersectsBox(Fr)&&Ba(u,t,e,n,s)))}}const Br=new Xt,_a=new Xe,bs=new Xe,Rx=new D,Cx=new D,Px=new D,Ix=new D;function Lx(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),_a.set(t.boundingBox.min,t.boundingBox.max,e),_a.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,u=t.index,f=sn.getPrimitive(),d=sn.getPrimitive();let x=Rx,M=Cx,_=null,p=null;s&&(_=Px,p=Ix);let v=1/0,m=null,g=null;return Br.copy(e).invert(),bs.matrix.copy(Br),i.shapecast({boundsTraverseOrder:S=>_a.distanceToBox(S),intersectsBounds:(S,E,w)=>w<v&&w<o?(E&&(bs.min.copy(S.min),bs.max.copy(S.max),bs.needsUpdate=!0),!0):!1,intersectsRange:(S,E)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:A=>bs.distanceToBox(A),intersectsBounds:(A,T,b)=>b<v&&b<o,intersectsRange:(A,T)=>{for(let b=A,y=A+T;b<y;b++){be(d,3*b,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let R=S,C=S+E;R<C;R++){be(f,3*R,l,c),f.needsUpdate=!0;const I=f.distanceToTriangle(d,x,_);if(I<v&&(M.copy(x),p&&p.copy(_),v=I,m=R,g=b),I<r)return!0}}}});{const w=yo(t);for(let A=0,T=w;A<T;A++){be(d,3*A,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=S,y=S+E;b<y;b++){be(f,3*b,l,c),f.needsUpdate=!0;const R=f.distanceToTriangle(d,x,_);if(R<v&&(M.copy(x),p&&p.copy(_),v=R,m=b,g=A),R<r)return!0}}}}}),sn.releasePrimitive(f),sn.releasePrimitive(d),v===1/0?null:(n.point?n.point.copy(M):n.point=M.clone(),n.distance=v,n.faceIndex=m,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(Br),M.applyMatrix4(Br),s.distance=M.sub(s.point).length(),s.faceIndex=g),n)}function Dx(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),u(0,l),l+=r.byteLength;function u(f,d,x=!1){const M=f*2;if(ve(M,a)){const _=Ie(f,o),p=Oe(M,a);let v=1/0,m=1/0,g=1/0,S=-1/0,E=-1/0,w=-1/0;for(let A=_,T=_+p;A<T;A++){const b=3*i.resolveTriangleIndex(A);for(let y=0;y<3;y++){let R=b+y;R=n?n[R]:R;const C=s.getX(R),I=s.getY(R),N=s.getZ(R);C<v&&(v=C),C>S&&(S=C),I<m&&(m=I),I>E&&(E=I),N<g&&(g=N),N>w&&(w=N)}}return c[f+0]!==v||c[f+1]!==m||c[f+2]!==g||c[f+3]!==S||c[f+4]!==E||c[f+5]!==w?(c[f+0]=v,c[f+1]=m,c[f+2]=g,c[f+3]=S,c[f+4]=E,c[f+5]=w,!0):!1}else{const _=Ee(f),p=Ae(f,o);let v=x,m=!1,g=!1;if(t){if(!v){const b=_/Te+d/Be,y=p/Te+d/Be;m=t.has(b),g=t.has(y),v=!m&&!g}}else m=!0,g=!0;const S=v||m,E=v||g;let w=!1;S&&(w=u(_,d,v));let A=!1;E&&(A=u(p,d,v));const T=w||A;if(T)for(let b=0;b<3;b++){const y=_+b,R=p+b,C=c[y],I=c[y+3],N=c[R],z=c[R+3];c[f+b]=C<N?C:N,c[f+b+3]=I>z?I:z}return T}}}function Ux(i,t,e,n,s,r,o){ue.setBuffer(i._roots[t]),Oa(0,i,e,n,s,r,o),ue.clearBuffer()}function Oa(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=ue,h=i*2;if(ve(h,c)){const f=Ie(i,l),d=Oe(h,c);Mx(t,e,n,f,d,s,r,o)}else{const f=Ee(i);jn(f,a,n,r,o)&&Oa(f,t,e,n,s,r,o);const d=Ae(i,l);jn(d,a,n,r,o)&&Oa(d,t,e,n,s,r,o)}}const Nx=["x","y","z"];function Fx(i,t,e,n,s,r){ue.setBuffer(i._roots[t]);const o=ka(0,i,e,n,s,r);return ue.clearBuffer(),o}function ka(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=ue;let l=i*2;if(ve(l,a)){const u=Ie(i,c),f=Oe(l,a);return Sx(t,e,n,u,f,s,r)}else{const u=rc(i,c),f=Nx[u],x=n.direction[f]>=0;let M,_;x?(M=Ee(i),_=Ae(i,c)):(M=Ae(i,c),_=Ee(i));const v=jn(M,o,n,s,r)?ka(M,t,e,n,s,r):null;if(v){const S=v.point[f];if(x?S<=o[_+u]:S>=o[_+u+3])return v}const g=jn(_,o,n,s,r)?ka(_,t,e,n,s,r):null;return v&&g?v.distance<=g.distance?v:g:v||g||null}}const Or=new Le,Hi=new dn,Xi=new dn,Ts=new Xt,ql=new Xe,kr=new Xe;function zx(i,t,e,n){ue.setBuffer(i._roots[t]);const s=Va(0,i,e,n);return ue.clearBuffer(),s}function Va(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=ue;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),ql.set(e.boundingBox.min,e.boundingBox.max,n),s=ql),ve(c,o)){const h=t.geometry,u=h.index,f=h.attributes.position,d=e.index,x=e.attributes.position,M=Ie(i,a),_=Oe(c,o);if(Ts.copy(n).invert(),e.boundsTree)return ye(i,r,kr),kr.matrix.copy(Ts),kr.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:v=>kr.intersectsBox(v),intersectsTriangle:v=>{v.a.applyMatrix4(n),v.b.applyMatrix4(n),v.c.applyMatrix4(n),v.needsUpdate=!0;for(let m=M,g=_+M;m<g;m++)if(be(Xi,3*t.resolveTriangleIndex(m),u,f),Xi.needsUpdate=!0,v.intersectsTriangle(Xi))return!0;return!1}});{const p=yo(e);for(let v=M,m=_+M;v<m;v++){const g=t.resolveTriangleIndex(v);be(Hi,3*g,u,f),Hi.a.applyMatrix4(Ts),Hi.b.applyMatrix4(Ts),Hi.c.applyMatrix4(Ts),Hi.needsUpdate=!0;for(let S=0,E=p*3;S<E;S+=3)if(be(Xi,S,d,x),Xi.needsUpdate=!0,Hi.intersectsTriangle(Xi))return!0}}}else{const h=Ee(i),u=Ae(i,a);return ye(h,r,Or),!!(s.intersectsBox(Or)&&Va(h,t,e,n,s)||(ye(u,r,Or),s.intersectsBox(Or)&&Va(u,t,e,n,s)))}}const Vr=new Xt,ya=new Xe,Es=new Xe,Bx=new D,Ox=new D,kx=new D,Vx=new D;function Gx(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),ya.set(t.boundingBox.min,t.boundingBox.max,e),ya.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,u=t.index,f=sn.getPrimitive(),d=sn.getPrimitive();let x=Bx,M=Ox,_=null,p=null;s&&(_=kx,p=Vx);let v=1/0,m=null,g=null;return Vr.copy(e).invert(),Es.matrix.copy(Vr),i.shapecast({boundsTraverseOrder:S=>ya.distanceToBox(S),intersectsBounds:(S,E,w)=>w<v&&w<o?(E&&(Es.min.copy(S.min),Es.max.copy(S.max),Es.needsUpdate=!0),!0):!1,intersectsRange:(S,E)=>{if(t.boundsTree){const w=t.boundsTree;return w.shapecast({boundsTraverseOrder:A=>Es.distanceToBox(A),intersectsBounds:(A,T,b)=>b<v&&b<o,intersectsRange:(A,T)=>{for(let b=A,y=A+T;b<y;b++){const R=w.resolveTriangleIndex(b);be(d,3*R,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let C=S,I=S+E;C<I;C++){const N=i.resolveTriangleIndex(C);be(f,3*N,l,c),f.needsUpdate=!0;const z=f.distanceToTriangle(d,x,_);if(z<v&&(M.copy(x),p&&p.copy(_),v=z,m=C,g=b),z<r)return!0}}}})}else{const w=yo(t);for(let A=0,T=w;A<T;A++){be(d,3*A,u,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=S,y=S+E;b<y;b++){const R=i.resolveTriangleIndex(b);be(f,3*R,l,c),f.needsUpdate=!0;const C=f.distanceToTriangle(d,x,_);if(C<v&&(M.copy(x),p&&p.copy(_),v=C,m=b,g=A),C<r)return!0}}}}}),sn.releasePrimitive(f),sn.releasePrimitive(d),v===1/0?null:(n.point?n.point.copy(M):n.point=M.clone(),n.distance=v,n.faceIndex=m,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(Vr),M.applyMatrix4(Vr),s.distance=M.sub(s.point).length(),s.faceIndex=g),n)}function $l(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}const Gr=new Xe,Hr=new _i,Jl=new D,Kl=new Xt,jl=new D,va=["getX","getY","getZ"];class lo extends lx{static serialize(t,e={}){e={cloneBuffers:!0,...e};const n=t.geometry,s=t._roots,r=t._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return e.cloneBuffers?(a.roots=s.map(c=>c.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=r?r.slice():null):(a.roots=s,a.index=o?o.array:null,a.indirectBuffer=r),a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};const{index:s,roots:r,indirectBuffer:o}=t;t.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),c(r));const a=new lo(e,{...n,[sc]:!0});if(a._roots=r,a._indirectBuffer=o||null,n.setIndex){const l=e.getIndex();if(l===null){const h=new Se(t.index,1,!1);e.setIndex(h)}else l.array!==s&&(l.array.set(s),l.needsUpdate=!0)}return a;function c(l){for(let h=0;h<l.length;h++){const u=l[h],f=new Uint32Array(u),d=new Uint16Array(u);for(let x=0,M=u.byteLength/Be;x<M;x++){const _=Te*x,p=2*_;ve(p,d)||(f[_+6]=f[_+6]/Te-x)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(t,e={}){e.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafTris}),super(t,e)}shiftTriangleOffsets(t){return super.shiftPrimitiveOffsets(t)}writePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,l=(r?r[t]:t)*3;let h=l+0,u=l+1,f=l+2;a&&(h=a[h],u=a[u],f=a[f]);for(let d=0;d<3;d++){const x=o[va[d]](h),M=o[va[d]](u),_=o[va[d]](f);let p=x;M<p&&(p=M),_<p&&(p=_);let v=x;M>v&&(v=M),_>v&&(v=_),e[n+d]=p,e[n+d+3]=v}return e}computePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,c=o.normalized;if(t<0||e+t-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");const l=o.array,h=o.offset||0;let u=3;o.isInterleavedBufferAttribute&&(u=o.data.stride);const f=["getX","getY","getZ"],d=n.offset;for(let x=t,M=t+e;x<M;x++){const p=(r?r[x]:x)*3,v=(x-d)*6;let m=p+0,g=p+1,S=p+2;a&&(m=a[m],g=a[g],S=a[S]),c||(m=m*u+h,g=g*u+h,S=S*u+h);for(let E=0;E<3;E++){let w,A,T;c?(w=o[f[E]](m),A=o[f[E]](g),T=o[f[E]](S)):(w=l[m+E],A=l[g+E],T=l[S+E]);let b=w;A<b&&(b=A),T<b&&(b=T);let y=w;A>y&&(y=A),T>y&&(y=T);const R=(y-b)/2,C=E*2;n[v+C+0]=b+R,n[v+C+1]=R+(Math.abs(b)+R)*qr}}return n}raycastObject3D(t,e,n=[]){const{material:s}=t;if(s===void 0)return;Kl.copy(t.matrixWorld).invert(),Hr.copy(e.ray).applyMatrix4(Kl),jl.setFromMatrixScale(t.matrixWorld),Jl.copy(Hr.direction).multiply(jl);const r=Jl.length(),o=e.near/r,a=e.far/r;if(e.firstHitOnly===!0){let c=this.raycastFirst(Hr,s,o,a);c=$l(c,t,e),c&&n.push(c)}else{const c=this.raycast(Hr,s,o,a);for(let l=0,h=c.length;l<h;l++){const u=$l(c[l],t,e);u&&n.push(u)}}return n}refit(t=null){return(this.indirect?Dx:vx)(this,t)}raycast(t,e=0,n=0,s=1/0){const r=this._roots,o=[],a=this.indirect?Ux:Tx;for(let c=0,l=r.length;c<l;c++)a(this,c,e,t,o,n,s);return o}raycastFirst(t,e=0,n=0,s=1/0){const r=this._roots;let o=null;const a=this.indirect?Fx:Ax;for(let c=0,l=r.length;c<l;c++){const h=a(this,c,e,t,n,s);h!=null&&(o==null||h.distance<o.distance)&&(o=h)}return o}intersectsGeometry(t,e){let n=!1;const s=this._roots,r=this.indirect?zx:wx;for(let o=0,a=s.length;o<a&&(n=r(this,o,t,e),!n);o++);return n}shapecast(t){const e=sn.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsTriangle,scratchPrimitive:e,iterate:this.indirect?bx:yx});return sn.releasePrimitive(e),n}bvhcast(t,e,n){let{intersectsRanges:s,intersectsTriangles:r}=n;const o=sn.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?x=>{const M=this.resolveTriangleIndex(x);be(o,M*3,a,c)}:x=>{be(o,x*3,a,c)},h=sn.getPrimitive(),u=t.geometry.index,f=t.geometry.attributes.position,d=t.indirect?x=>{const M=t.resolveTriangleIndex(x);be(h,M*3,u,f)}:x=>{be(h,x*3,u,f)};if(r){if(!(t instanceof lo))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');const x=(M,_,p,v,m,g,S,E)=>{for(let w=p,A=p+v;w<A;w++){d(w),h.a.applyMatrix4(e),h.b.applyMatrix4(e),h.c.applyMatrix4(e),h.needsUpdate=!0;for(let T=M,b=M+_;T<b;T++)if(l(T),o.needsUpdate=!0,r(o,h,T,w,m,g,S,E))return!0}return!1};if(s){const M=s;s=function(_,p,v,m,g,S,E,w){return M(_,p,v,m,g,S,E,w)?!0:x(_,p,v,m,g,S,E,w)}}else s=x}return super.bvhcast(t,e,{intersectsRanges:s})}intersectsBox(t,e){return Gr.set(t.min,t.max,e),Gr.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Gr.intersectsBox(n),intersectsTriangle:n=>Gr.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},s={},r=0,o=1/0){return(this.indirect?Gx:Lx)(this,t,e,n,s,r,o)}closestPointToPoint(t,e={},n=0,s=1/0){return px(this,t,e,n,s)}}const ho=new Map,Ns=new D,Hx=new D,pi=new _i,Xx={point:new D},Ql=new D(.992,.121,.032).normalize();function ls(i){if(!i||i.type!=="editor-solid-mesh")return null;const t=ho.get(i.revision);if(t)return t;if(!i.vertices||!i.indices||!i.indices.length)return null;const e=new ne;e.setAttribute("position",new Se(i.vertices,3)),e.setIndex(new Se(i.indices,1)),e.computeBoundingBox();const n={geometry:e,bvh:new lo(e),bounds:e.boundingBox};return ho.set(i.revision,n),n}function Wx(i){const t=ho.get(i);t&&(t.geometry.dispose(),ho.delete(i))}function Fn(i,t,e,n){const s=ls(i);if(!s||(Ns.set(t,e,n),!s.bounds.containsPoint(Ns)))return!1;pi.origin.copy(Ns),pi.direction.copy(Ql);const r=s.bvh.raycastFirst(pi,2);if(!r)return!1;const o=r.face.normal.dot(Ql);if(Math.abs(o)>1e-6&&r.distance>1e-5)return o>0;const a=s.bvh.raycast(pi,2).sort((h,u)=>h.distance-u.distance);let c=0,l=-1/0;for(const h of a)h.distance-l>1e-5&&(c++,l=h.distance);return c%2===1}function Jr(i,t,e,n,s=1/0){const r=ls(i);if(!r)return null;const o=r.bounds;if(t<o.min.x-s||t>o.max.x+s||e<o.min.y-s||e>o.max.y+s||n<o.min.z-s||n>o.max.z+s)return null;Ns.set(t,e,n);const a=r.bvh.closestPointToPoint(Ns,Xx,0,s);return a?{x:a.point.x,y:a.point.y,z:a.point.z,distance:a.distance}:null}function Zs(i,t,e,n=1/0){const s=ls(i);if(!s)return null;pi.origin.set(t.x,t.y,t.z),pi.direction.copy(Hx.set(e.x,e.y,e.z).normalize());const r=s.bvh.raycastFirst(pi,2,0,n);return r?{distance:r.distance,x:r.point.x,y:r.point.y,z:r.point.z,normal:r.face?.normal?.clone()}:null}const Fs={roof:{type:"roof",minX:-.35,maxX:.35,minZ:-2.3,maxZ:2.3,bottom:.32,top:1.35},leftWall:{type:"box",minX:-.42,maxX:.42,minY:0,maxY:1.3,minZ:-3.2,maxZ:-2.3},rightWall:{type:"box",minX:-.42,maxX:.42,minY:0,maxY:1.3,minZ:2.3,maxZ:3.2}},Zx=[Fs.roof,Fs.leftWall,Fs.rightWall],Ma={type:"boundary",minX:-7.45,maxX:7.45,minZ:-4.15,maxZ:4.15},As={type:"funnel",x:-2.5,z:0,radius:1.5,bottomRadius:.62,depth:.85};function ce(i,t,e=[]){let n=0,s=0,r=0;const o=e.find(h=>h.type==="terraces");if(o){n=o.height;for(const h of o.steps){const u=Math.max(0,Math.min(1,(i-h.x)/h.width));n-=h.drop*u,u>0&&u<1&&(s-=h.drop/h.width)}}const a=e.find(h=>h.type==="switchback");if(a){const h=a.stairs;if(t<=a.frontZ)n=a.upperHeight;else if(i>=h.minX&&i<=h.maxX&&t<h.endZ){n=a.upperHeight;for(const f of h.steps){const d=Math.max(0,Math.min(1,(t-f.z)/f.width));n-=f.drop*d,d>0&&d<1&&(r-=f.drop/f.width)}}const u=a.startTier;if(u&&i>=u.minX&&i<=u.maxX&&t>=u.minZ&&t<=u.maxZ)for(const f of u.steps){const d=Math.max(0,Math.min(1,(i-f.x)/f.width));n+=f.rise*d,d>0&&d<1&&(s+=f.rise/f.width)}}const c=e.find(h=>h.type==="depth-terraces");if(c){const h=c.descendZ??-1,u=h*t;n=u<=h*c.frontZ?c.frontHeight:u<=h*c.rearZ?c.middleHeight:0;for(const[f,d]of[[c.leftStairs,c.frontHeight],[c.rightStairs,c.middleHeight]])if(!(i<f.minX||i>f.maxX||u<h*f.startZ||u>h*f.endZ)){n=d,r=0;for(const x of f.steps){const M=Ga((u-h*x.z)/x.width,0,1);n-=x.drop*M,M>0&&M<1&&(r-=h*x.drop/x.width)}break}}const l=c&&e.find(h=>h.type==="grip-ramp"&&i>=h.minX&&i<=h.maxX&&t>=h.minZ&&t<=h.maxZ);if(l)if(l.axis==="x"){const h=(l.maxHeight-l.minHeight)/(l.maxX-l.minX);n=l.minHeight+h*(i-l.minX),s=h,r=0}else{const h=(l.southHeight-l.northHeight)/(l.maxZ-l.minZ);n=l.northHeight+h*(t-l.minZ),s=0,r=h}for(const h of e){if(h.type!=="editor-stairs"||i<h.minX||i>h.maxX||t<h.minZ||t>h.maxZ)continue;const u=h.axis==="x"?h.maxX-h.minX:h.maxZ-h.minZ;let f=h.axis==="x"?(i-h.minX)/u:(t-h.minZ)/u;h.reverse&&(f=1-f);const d=h.base+h.rise*f;d>n&&(n=d,s=h.axis==="x"?(h.reverse?-1:1)*h.rise/u:0,r=h.axis==="z"?(h.reverse?-1:1)*h.rise/u:0)}for(const h of e){if(h.type==="pit"&&Math.hypot(i-h.x,t-h.z)<h.radius)return{height:n-8,dx:0,dz:0};if(h.type!=="funnel"||h.raised)continue;const u=i-h.x,f=t-h.z,d=Math.hypot(u,f);if(d>=h.radius)continue;if(d<=h.bottomRadius)return{height:n-h.depth,dx:s,dz:r};const x=h.depth/(h.radius-h.bottomRadius);return{height:n-h.depth+(d-h.bottomRadius)*x,dx:s+x*u/d,dz:r+x*f/d}}return{height:n,dx:s,dz:r}}function Yx(i,t,e,n=.06){if(e.type!=="editor-solid-mesh")return null;const s=Zs(e,{x:i.x,y:i.y+t+.06,z:i.z},{x:0,y:-1,z:0},40);return s&&s.normal?.y>.35&&Math.abs(i.y-s.y-t)<=n?s.y:null}function Zi(i,t,e=[]){let n=ce(i.x,i.z,e).height;for(const s of e)if(!s.csgControl){if(s.type==="editor-solid-mesh"){const r=Zs(s,{x:i.x,y:i.y+t+.06,z:i.z},{x:0,y:-1,z:0},40);r&&r.normal?.y>.35&&i.y>=r.y+t-.06&&(n=Math.max(n,r.y));continue}!(s.gripPlatform||s.walkableTop)||i.y<s.maxY+t-.06||i.x<s.minX+t||i.x>s.maxX-t||i.z<s.minZ+t||i.z>s.maxZ-t||(n=Math.max(n,s.maxY))}return n}const Ga=(i,t,e)=>Math.max(t,Math.min(e,i));function In(i,t,e,n=0){const s=(c,l,h,u,f)=>{if(Math.abs(l)<1e-9)return c>h&&c<u?f:null;const d=(h-c)/l,x=(u-c)/l,M=[Math.max(f[0],Math.min(d,x)),Math.min(f[1],Math.max(d,x))];return M[0]<M[1]?M:null},r=t.x-i.x,o=t.y-i.y,a=t.z-i.z;for(const c of e)if(c.type!=="boundary"){if(c.type==="editor-solid-mesh"){const l=ls(c)?.bounds;if(!l||Math.max(i.x,t.x)<l.min.x-n||Math.min(i.x,t.x)>l.max.x+n||Math.max(i.y,t.y)<l.min.y-n||Math.min(i.y,t.y)>l.max.y+n||Math.max(i.z,t.z)<l.min.z-n||Math.min(i.z,t.z)>l.max.z+n)continue;const h=Math.hypot(r,o,a),u=h>1e-8?Zs(c,i,{x:r,y:o,z:a},h+n):null;if(u&&u.distance>1e-4||Fn(c,i.x,i.y,i.z)||Fn(c,t.x,t.y,t.z))return!0;continue}if(c.type==="terraces"||c.type==="switchback"||c.type==="depth-terraces"||c.type==="grip-ramp"||c.type==="editor-stairs"){const l=Math.max(2,Math.ceil(Math.hypot(r,o,a)/.08));for(let h=0;h<=l;h++){const u=h/l;if(i.y+o*u<ce(i.x+r*u,i.z+a*u,e).height+n)return!0}continue}if(c.type==="funnel"){if(c.raised)continue;const l=ce(c.x+c.radius,c.z,e).height;if(Math.min(i.y,t.y)>=l+n)continue;const h=Math.max(2,Math.ceil(Math.hypot(r,o,a)/.06));for(let u=0;u<=h;u++){const f=u/h,d=i.x+r*f,x=i.z+a*f;if(i.y+o*f<ce(d,x,e).height+n)return!0}continue}if(c.type==="box"||c.type==="roof"){let l=[0,1];if(l=s(i.x,r,c.minX-n,c.maxX+n,l),!l||(l=s(i.y,o,(c.type==="roof"?c.bottom:c.minY)-n,(c.type==="roof"?c.top:c.maxY)+n,l),!l))continue;if(l=s(i.z,a,c.minZ-n,c.maxZ+n,l),l)return!0}else if(c.type==="cylinder"){const l=i.x-c.x,h=i.z-c.z,u=c.radius+n,f=r*r+a*a,d=2*(l*r+h*a),x=l*l+h*h-u*u;let M;if(f<1e-9){if(x>=0)continue;M=[0,1]}else{const _=d*d-4*f*x;if(_<=0)continue;const p=Math.sqrt(_),v=(-d-p)/(2*f),m=(-d+p)/(2*f);if(M=[Math.max(0,v),Math.min(1,m)],M[0]>=M[1])continue}if(s(i.y,o,(c.base??0)-n,c.height+n,M))return!0}else if(c.type==="slip")continue}return!1}function Xr(i,t,e){let n=0;const s=e.find(o=>o.type==="switchback");if(s){const o=s.stairs,a=s.frontZ,c=s.upperHeight,l=s.startTier;if(l&&i.x>=l.minX&&i.x<=l.maxX){const u=ce(i.x,(l.minZ+l.maxZ)/2,[s]).height;i.pz>l.maxZ-t&&i.z<l.maxZ+t&&i.y+t<u-.02&&(i.z=l.maxZ+t,n++),i.pz<l.minZ+t&&i.z>l.minZ-t&&i.y+t<u-.02&&(i.z=l.minZ-t,n++)}if((i.x<o.minX||i.x>o.maxX)&&i.pz>=a-t&&i.z<a+t&&i.y+t<c-.02&&(i.z=a+t,n++),i.z>a-t&&i.z<o.endZ+t){const u=ce((o.minX+o.maxX)/2,i.z,[s]).height;i.px>=o.maxX-t&&i.x<o.maxX+t&&i.y+t<u-.02&&(i.x=o.maxX+t,n++),i.px<=o.minX+t&&i.x>o.minX-t&&i.y+t<u-.02&&(i.x=o.minX-t,n++)}}const r=e.find(o=>o.type==="depth-terraces");if(r){const o=r.descendZ??-1,a=o*i.pz;for(const[c,l,h]of[[r.leftStairs,r.frontZ,r.frontHeight],[r.rightStairs,r.rearZ,r.middleHeight]]){const u=i.x<c.minX||i.x>c.maxX,f=o*l,d=o*i.z;if(u&&a>=f&&d<f+t&&i.y+t<h-.02&&(i.z=o*(f+t),n++),o*i.z>o*c.startZ-t&&o*i.z<o*c.endZ+t){const x=ce((c.minX+c.maxX)/2,i.z,[r]).height;i.px>=c.maxX-t&&i.x<c.maxX+t&&i.y+t<x-.02&&(i.x=c.maxX+t,n++),i.px<=c.minX+t&&i.x>c.minX-t&&i.y+t<x-.02&&(i.x=c.minX-t,n++)}}}for(const o of e){if(o.type!=="editor-stairs")continue;const a=i.x>o.minX-t&&i.x<o.maxX+t,c=i.z>o.minZ-t&&i.z<o.maxZ+t;if(!a||!c)continue;const l=ce(Math.max(o.minX,Math.min(o.maxX,i.x)),Math.max(o.minZ,Math.min(o.maxZ,i.z)),[o]).height;if(!(i.y+t>=l-.02))if(o.axis==="x"){i.pz<o.minZ-t&&i.z>o.minZ-t&&(i.z=o.minZ-t,n++),i.pz>o.maxZ+t&&i.z<o.maxZ+t&&(i.z=o.maxZ+t,n++);const h=o.reverse?o.minX:o.maxX;o.reverse&&i.px<h-t&&i.x>h-t&&(i.x=h-t,n++),!o.reverse&&i.px>h+t&&i.x<h+t&&(i.x=h+t,n++)}else{i.px<o.minX-t&&i.x>o.minX-t&&(i.x=o.minX-t,n++),i.px>o.maxX+t&&i.x<o.maxX+t&&(i.x=o.maxX+t,n++);const h=o.reverse?o.minZ:o.maxZ;o.reverse&&i.pz<h-t&&i.z>h-t&&(i.z=h-t,n++),!o.reverse&&i.pz>h+t&&i.z<h+t&&(i.z=h+t,n++)}}for(let o=0;o<3;o++){const a=ce(i.x,i.z,e),c=1+a.dx*a.dx+a.dz*a.dz,l=a.height+t*Math.sqrt(c)+.008-i.y;if(l<=0)break;const h=l/c;i.x-=a.dx*h,i.z-=a.dz*h,i.y+=h,c===1&&i.vy<0&&(i.vy=0),n++}for(const o of e){if(o.type==="pit"){const _=i.x-o.x,p=i.z-o.z,v=Math.hypot(_,p),m=o.rimHeight??ce(o.x+o.radius+.01,o.z,e).height;if(i.y<m-t*.5&&v>o.radius-t&&v<o.radius+t){const g=o.radius-t-.003;i.x=o.x+_/v*g,i.z=o.z+p/v*g,n++}continue}if(o.type==="boundary"){const _=Ga(i.x,o.minX+t,o.maxX-t),p=Ga(i.z,o.minZ+t,o.maxZ-t);(_!==i.x||p!==i.z)&&(i.x=_,i.z=p,n++);continue}if(o.type==="editor-solid-mesh"){const _=ls(o)?.bounds;if(!_||Math.max(i.x,i.px)<_.min.x-t||Math.min(i.x,i.px)>_.max.x+t||Math.max(i.y,i.py)<_.min.y-t||Math.min(i.y,i.py)>_.max.y+t||Math.max(i.z,i.pz)<_.min.z-t||Math.min(i.z,i.pz)>_.max.z+t)continue;const p=i.x-i.px,v=i.y-i.py,m=i.z-i.pz,g=Math.hypot(p,v,m),S=g>1e-6&&!Fn(o,i.px,i.py,i.pz)?Zs(o,{x:i.px,y:i.py,z:i.pz},{x:p,y:v,z:m},g):null;if(S&&S.distance>1e-4){const A=S.normal;i.x=S.x+(A?.x??0)*(t+.003),i.y=S.y+(A?.y??1)*(t+.003),i.z=S.z+(A?.z??0)*(t+.003),A?.y>.35&&i.vy<0&&(i.vy=0),n++}else if(!S&&g>t*.5){const A=Math.min(200,Math.ceil(g/(t*.45)));for(let T=1;T<=A;T++){const b=T/A,y=i.px+p*b,R=i.py+v*b,C=i.pz+m*b,I=Jr(o,y,R,C,t+.003);if(!I||I.distance>=t||Fn(o,y,R,C))continue;const N=(T-1)/A;i.x=i.px+p*N,i.y=i.py+v*N,i.z=i.pz+m*N,n++;break}}let E=Jr(o,i.x,i.y,i.z,t+.01);const w=Fn(o,i.x,i.y,i.z);if(w&&!E&&(E=Jr(o,i.x,i.y,i.z)),E&&(w||E.distance<t)){let A=i.x-E.x,T=i.y-E.y,b=i.z-E.z;w&&(A=-A,T=-T,b=-b);const y=Math.hypot(A,T,b)||1;A/=y,T/=y,b/=y,i.x=E.x+A*(t+.003),i.y=E.y+T*(t+.003),i.z=E.z+b*(t+.003),T>.35&&i.vy<0&&(i.vy=0),n++}continue}if(o.type==="cylinder"){const _=i.x-o.x,p=i.z-o.z,v=Math.hypot(_,p),m=o.radius+t;if(v>=m||i.y-t>=o.height||i.y+t<=(o.base??0))continue;i.py-t>=o.height-.035?(i.y=o.height+t+.003,i.vy<0&&(i.vy=0)):(i.x=o.x+(v?_/v*m:m),i.z=o.z+(v?p/v*m:0)),n++;continue}if(o.type!=="roof"&&o.type!=="box")continue;const a=o.minX-t,c=o.maxX+t,l=(o.type==="roof"?o.bottom:o.minY)-t,h=(o.type==="roof"?o.top:o.maxY)+t,u=o.minZ-t,f=o.maxZ+t;if(i.x<=a||i.x>=c||i.y<=l||i.y>=h||i.z<=u||i.z>=f)continue;const d=[["x",a,i.x-a],["x",c,c-i.x],["y",l,i.y-l],["y",h,h-i.y],["z",u,i.z-u],["z",f,f-i.z]];let x=null;i.px<=a+.02?x=d[0]:i.px>=c-.02?x=d[1]:i.py<=l+.02?x=d[2]:i.py>=h-.02?x=d[3]:i.pz<=u+.02?x=d[4]:i.pz>=f-.02&&(x=d[5]);const M=x||d.reduce((_,p)=>_[2]<p[2]?_:p);i[M[0]]=M[1],M[0]==="y"&&i.vy<0&&M[1]===h&&(i.vy=0),n++}return n}function qx(i,t,e,n,s=0){for(const r of n)if(r.type==="editor-solid-mesh"&&Fn(r,i,t,e)&&(!s||Jr(r,i,t,e)?.distance>s)||r.type==="roof"&&i>r.minX+s&&i<r.maxX-s&&e>r.minZ+s&&e<r.maxZ-s&&t>r.bottom+s&&t<r.top-s||r.type==="cylinder"&&t>(r.base??0)+s&&t<r.height-s&&Math.hypot(i-r.x,e-r.z)<r.radius-s||r.type==="box"&&i>r.minX+s&&i<r.maxX-s&&e>r.minZ+s&&e<r.maxZ-s&&t>r.minY+s&&t<r.maxY-s)return!0;return!1}const Ha=30,$x=Object.freeze([30,45,50,55,60,90,135]);function uo(i){const{gold:t,gems:e,totalGold:n,totalGems:s,elapsed:r,target:o}=i||{};if(![t,e,n,s].every(d=>Number.isInteger(d)&&d>=0)||t>n||e>s)return null;const a=r!==void 0;if(a!==(o!==void 0)||a&&(!Number.isFinite(r)||r<0||!Number.isFinite(o)||o<=0)||i?.version===2&&!a)return null;const l=n+s?(t+e)/(n+s):1,h=Number.isFinite(r)&&r>=0&&Number.isFinite(o)&&o>0,u=h&&r<=o?20:0,f=l*(h?80:100);return{collection:l,collectionPercent:Math.round(l*100),collectionPoints:f,timePoints:u,percent:Math.round(f+u),elapsed:h?r:null,target:h?o:null,version:h?2:1}}function Jx(i,t){const e=uo(i),n=uo(t);return e?n?e.collectionPoints+e.timePoints>n.collectionPoints+n.timePoints||e.collectionPoints+e.timePoints===n.collectionPoints+n.timePoints&&(e.collection>n.collection||e.collection===n.collection&&(e.elapsed??1/0)<(n.elapsed??1/0)):!0:!1}const lc=i=>i?.axis==="x"?"x":"z";function Kx(i,t,e){return lc(i)==="x"?e.x<t.minX?"D":"A":e.z<t.minZ?"S":"W"}const jx={type:"switchback",upperHeight:1.62,frontZ:-.6,startTier:{minX:5.35,maxX:9.4,minZ:-4.5,maxZ:-1,steps:[5.35,5.8].map(i=>({x:i,rise:.27,width:.32}))},stairs:{minX:-8.8,maxX:-6.2,endZ:2.1,steps:[-.6,-.15,.3,.75,1.2,1.65].map(i=>({z:i,drop:.27,width:.32}))}},Qx={type:"roof",minX:.1,maxX:.65,minZ:.7,maxZ:3.7,bottom:.32,top:1.06},t1=()=>[3,4.035].flatMap(i=>Array.from({length:5},(t,e)=>({type:"cylinder",x:i,z:.03+e*1.035,radius:.42,height:.65}))),nn={id:1,name:"Gathering Garden",start:{x:7,z:-2.6},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-4.8,maxZ:4.8},terrain:jx,roof:Qx,posts:t1(),exit:{type:"funnel",x:7.6,z:2.8,radius:.95,bottomRadius:.36,depth:.9},pools:[[4.8,-2.6],[2.5,-2.6],[-5.5,2.2],[5.15,2.2]],gems:[{x:0,z:-2.6},{x:-3,z:2.2},{x:6,z:2.2}],gold:[[6,-2.6],[4.8,-2.6],[3.4,-2.6],[2,-2.6],[.5,-2.6],[-1.2,-2.6],[-3.5,-2.6],[-6,-2.6],[-7.5,.3],[-7.5,1.4],[-5.5,2.2],[-3.6,2.2],[-1.5,2.2],[1.1,2.2],[3.5,2.6175],[5.5,2.2],[7.1,2.2]]},Xh={id:2,name:"Weight Garden",start:{x:7.6,z:-2.8},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{type:"depth-terraces",descendZ:1,frontHeight:2.16,middleHeight:1.08,frontZ:-1.3,rearZ:2,leftStairs:{minX:-8.8,maxX:-6.2,startZ:-1.3,endZ:.1,steps:[-1.3,-.95,-.6,-.25].map(i=>({z:i,drop:.27,width:.26}))},rightStairs:{minX:6.2,maxX:8.8,startZ:2,endZ:3.4,steps:[2,2.35,2.7,3.05].map(i=>({z:i,drop:.27,width:.26}))}},basin:{type:"funnel",x:-2.5,z:.35,radius:1.15,bottomRadius:.52,depth:.75,holdsFeedstock:!0},gate:{x:1.5,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:48,releaseThreshold:36,rate:42,base:1.08},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-2.8],[2.6,-2.8],[-5.4,.35],[5.1,3.6]],gems:[{x:-1.5,z:-2.8},{x:4,z:.35},{x:-3.5,z:3.6}],gold:[[7.1,-2.8],[5.3,-2.8],[3.8,-2.8],[2.6,-2.8],[.5,-2.8],[-1.5,-2.8],[-3.7,-2.8],[-6,-2.8],[-7.5,-.95],[-7.5,-.25],[-5.4,.35],[-4.2,1.45],[.4,.35],[4,.35],[7.5,2.7],[5.1,3.6],[-3.5,3.6]]},Pn={id:3,name:"Passage Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{...Xh.terrain},basin:{type:"funnel",x:-2.3,z:.45,radius:1.15,bottomRadius:.72,depth:.75,holdsFeedstock:!0},gate:{x:1.7,width:.42,height:1.3,opening:.58,minZ:-.8,maxZ:1.5,threshold:64,releaseThreshold:48,rate:42,base:1.08},passage:{type:"roof",minX:-1.15,maxX:1.15,minZ:2.05,maxZ:4.8,bottom:.3,top:1.2,approachBothSides:!0},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.1,-3.2],[2.2,-3.2],[3.1,.45],[5.2,3.55]],poolCounts:[58,58,88,28],gems:[{x:-2,z:-3.2},{x:4.3,z:.45},{x:-4.3,z:3.55}],gold:[[6.7,-3.2],[5.1,-3.2],[3.6,-3.2],[2.2,-3.2],[.1,-3.2],[-2,-3.2],[-5.5,-3.2],[-7.5,-.95],[-7.5,-.25],[-5.2,.45],[-3.7,1.55],[.5,.45],[4.3,.45],[7.5,2.7],[5.2,3.55],[0,3.55],[-4.3,3.55]]},e1={id:4,name:"Reach Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,tendrils:!0,boundary:{...Pn.boundary},terrain:{...Pn.terrain},channels:[[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]].map(([i,t])=>({type:"funnel",x:i,z:t,radius:.85,bottomRadius:.45,depth:.32})),castingBank:{x:.7,z:-3.65},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-3.2],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9]],gems:[{x:-4.8,z:-3.5},{x:4.2,z:.45},{x:-3.8,z:3.55}],gold:[[6.7,-3.2],[5.3,-3.2],[3.6,-3.2],[.7,-3.65],[-1.8,-4.8],[-2,-2.35],[2.7,-4.9],[-4.8,-3.5],[-6,-3.5],[-7.5,-.95],[-7.5,-.25],[-5,.45],[0,.45],[4.2,.45],[7.5,2.7],[3.5,3.55],[-3.8,3.55]]},n1={id:5,name:"Grip Garden",start:{x:7.6,z:-3.2},seedCount:65,capacity:297,boundary:{...Pn.boundary},terrain:{...Pn.terrain,frontZ:-2.1,leftStairs:{...Pn.terrain.leftStairs,startZ:Pn.terrain.leftStairs.startZ-.8,endZ:Pn.terrain.leftStairs.endZ-.8,steps:Pn.terrain.leftStairs.steps.map(i=>({...i,z:i.z-.8}))}},grip:{ramp:{type:"grip-ramp",axis:"x",minX:-1.65,maxX:-.55,minZ:-1.35,maxZ:1.25,minHeight:1.08,maxHeight:1.44},platform:{type:"box",gripPlatform:!0,minX:-.55,maxX:1.65,minZ:-1.95,maxZ:1.85,minY:1.08,maxY:3.78},climbHeight:2.34},slip:{type:"slip",minX:3,maxX:5.4,minZ:-2.1,maxZ:2},exit:{type:"funnel",x:-7.6,z:3.65,radius:.95,bottomRadius:.36,depth:.9},pools:[[5.3,-3.2],[2.7,-3.2],[-4.8,.55],[5.2,3.55]],gems:[{x:-3.8,z:-3.2},{x:.55,z:-.05},{x:-3.8,z:3.55}],gold:[[6.7,-3.2],[5.3,-3.2],[3.8,-3.2],[2.7,-3.2],[-.5,-3.2],[-3.8,-3.2],[-6,-3.2],[-7.5,-.95],[-7.5,-.25],[-4.8,.55],[-1.4,-.05],[-.75,-.05],[.55,-.05],[4.2,1.15],[7.5,2.7],[5.2,3.55],[-3.8,3.55]]},De=(i,t,e,n,s,r,o)=>({type:"box",sourceId:i,walkableTop:!0,minX:t,maxX:e,minZ:n,maxZ:s,minY:r,maxY:o}),Xa=(i,t,e,n,s,r,o)=>({type:"editor-stairs",sourceId:i,axis:"z",reverse:!0,steps:10,minX:t,maxX:e,minZ:n,maxZ:s,base:r,rise:o}),i1={id:6,name:"Hollow Crown",start:{x:6.8,z:-4.5,y:5.8},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-6,maxZ:4.8},terrain:{type:"flat",height:0},editorCanShed:!0,tendrils:!0,exit:{type:"funnel",x:-7.45,z:3.55,radius:.85,bottomRadius:.34,depth:.9},basin:{type:"funnel",x:.1,z:3.4,radius:.8,bottomRadius:.42,depth:.65,holdsFeedstock:!0},gate:{x:1.5,width:.42,height:1.35,opening:.72,minZ:2.35,maxZ:4,threshold:32,releaseThreshold:24,rate:44,base:0,latch:!0},posts:[[-2.45,2.55],[-1.55,2.55],[-2.85,3.52],[-1.95,3.52],[-1.05,3.52]].map(([i,t],e)=>({type:"cylinder",sourceId:`court-flute-${e+1}`,x:i,z:t,radius:.24,height:1.12})),editorFixtures:[De("arrival",5.4,8.4,-5.6,-2.9,0,5.8),De("skybridge",-5.4,5.4,-5.15,-3.85,5.38,5.8),De("west-crown",-8.3,-5.4,-5.6,-2.9,0,5.8),Xa("west-descent",-8.25,-5.75,-2.9,-.3,3.3,2.5),De("west-middle",-8.3,-5.4,-.3,1.8,0,3.3),De("return-bridge",-5.4,5.6,.12,1.23,2.92,3.3),{type:"roof",sourceId:"middle-tunnel",minX:-4.7,maxX:-2.4,minZ:.12,maxZ:1.23,bottom:3.66,top:4.4,approachBothSides:!0},De("east-middle",5.6,8.4,-.2,1.6,0,3.3),Xa("east-descent",6.1,8.35,1.6,4.45,0,3.3),De("spire",.6,3.5,-2.7,-.2,3.3,5),De("tendril-shelf",-.55,.55,-3,-2.15,4.66,5.1),De("underbridge-step-one",-2.4,-.9,-4.85,-3.35,0,.46),De("underbridge-step-two",-.9,.45,-4.85,-3.35,.46,.84),De("recover-west-middle",-6.3,-5.45,-2.9,-.3,3.3,5.8),De("vault-north",1.3,5.35,2.07,2.22,0,1.6),De("vault-south",1.3,5.35,4.15,4.3,0,1.6),De("vault-east",5.2,5.35,2.22,4.15,0,1.6),De("vault-entry-north",1.3,1.72,2.22,2.35,0,1.6),De("vault-entry-south",1.3,1.72,4,4.15,0,1.6),{type:"roof",sourceId:"grotto-long",minX:-5.6,maxX:-4.1,minZ:2.2,maxZ:3.9,bottom:.42,top:1.12},{type:"roof",sourceId:"grotto-turn",minX:-4.1,maxX:-3.1,minZ:2.2,maxZ:2.82,bottom:.42,top:1.12},{type:"sticky-wall",sourceId:"spire-grip",face:"south",axis:"z",minX:1,maxX:3.1,minZ:-2.7,maxZ:-.2,minY:3.3,maxY:5},{type:"sticky-wall",sourceId:"west-recovery",face:"east",axis:"x",minX:-8.3,maxX:-5.4,minZ:1.25,maxZ:1.8,minY:0,maxY:3.3},{type:"sticky-wall",sourceId:"crown-recovery",face:"south",axis:"z",minX:-6.3,maxX:-5.45,minZ:-2.9,maxZ:-.3,minY:3.3,maxY:5.8},{type:"slip",sourceId:"bridge-slip",targetId:"skybridge",face:"floor",minX:1.1,maxX:2.5,minZ:-5.15,maxZ:-3.85,base:5.8,owner:{type:"box",minX:-5.4,maxX:5.4,minZ:-5.15,maxZ:-3.85,minY:5.38,maxY:5.8}},{type:"slip",sourceId:"descent-slip",targetId:"east-descent",face:"floor",minX:6.1,maxX:8.35,minZ:3.4,maxZ:4.2,base:.8,owner:{type:"editor-stairs",axis:"z",reverse:!0,minX:6.1,maxX:8.35,minZ:1.6,maxZ:4.45,base:0,rise:3.3}}],pools:[[6.1,-4.5,5.8],[-6.7,-4.5,5.8],[-6.7,.7,3.3],[7,.45,3.3],[-4.7,4.05,0],[4,3.45,0],[0,-2.6,5.1],[2.05,-1.3,5]],poolCounts:[28,16,40,36,42,22,28,20],gems:[{x:-6.8,z:-4.5,base:5.8},{x:-6.6,z:.75,base:3.3},{x:2.05,z:-1.5,base:5},{x:7,z:.55,base:3.3},{x:-3.6,z:3.3,base:0},{x:3.7,z:3.4,base:0}],gold:[[7.7,-4.5,5.8],[6.6,-4.5,5.8],[5.1,-4.5,5.8],[3.8,-4.5,5.8],[2.5,-4.5,5.8],[.5,-4.5,5.8],[-1.6,-4.5,5.8],[-3.3,-4.5,5.8],[-5.9,-4.5,5.8],[-7.5,-4.5,5.8],[-7,-2.35,5.25],[-7,-1.8,4.75],[-7,-1.25,4.25],[-7,-.7,3.7],[-6.8,.7,3.3],[-4.9,.7,3.3],[-3.8,.7,3.3],[-2.2,.7,3.3],[-.7,.7,3.3],[.7,.7,3.3],[2.1,.7,3.3],[4.2,.7,3.3],[6.1,.7,3.3],[7.2,.7,3.3],[7.25,2.05,2.8],[7.25,2.8,1.9],[7.25,3.6,1],[5.5,3.4,0],[4.3,3.4,0],[3.45,3.4,0],[.05,-4.05,.84],[.15,2.1,0],[-1.65,-4.05,.46],[-3.3,3.4,0],[-4.75,3.4,0],[-7.35,3.6,0]]},ln=(i,t,e,n,s,r,o)=>De(i,t,e,n,s,r,o),Sa=(i,t,e,n,s,r,o)=>Xa(i,t,e,n,s,r,o),s1={id:7,name:"Ember Cascade",start:{x:6.9,z:-5.5,y:6.6},seedCount:65,capacity:297,boundary:{type:"boundary",minX:-9,maxX:9,minZ:-7.2,maxZ:6.8},terrain:{type:"flat",height:0},editorCanShed:!0,tendrils:!0,exit:{type:"funnel",x:7.2,z:5.5,radius:.85,bottomRadius:.34,depth:.9},pits:[{type:"pit",sourceId:"west-pit",x:-2.8,z:4.45,radius:.95,rimHeight:0},{type:"pit",sourceId:"east-pit",x:2.5,z:4.55,radius:1,rimHeight:0}],editorFixtures:[ln("ember-arrival",5.6,8.4,-6.5,-4.8,0,6.6),ln("ember-first-bridge",-5.6,5.6,-6.2,-4.8,6.2,6.6),ln("ember-first-shoulder",-2.5,2.5,-6.6,-4.2,6.2,6.6),ln("ember-upper-west",-8.4,-5.6,-6.5,-4.1,0,6.6),Sa("ember-west-descent",-8.3,-5.8,-4.8,-2.5,4.4,2.2),ln("ember-middle-west",-8.4,-5.6,-2.5,-.1,0,4.4),ln("ember-second-bridge",-5.6,5.6,-2.5,-1.1,4,4.4),ln("ember-lookout",-1.6,1.6,-4.8,-2.5,4.4,5.6),ln("ember-middle-east",5.6,8.4,-2.5,-.1,0,4.4),Sa("ember-east-descent",5.8,8.3,-1.1,1.3,2.2,2.2),ln("ember-lower-east",5.6,8.4,1.3,3.7,0,2.2),ln("ember-third-bridge",-5.6,5.6,1.3,2.7,1.8,2.2),ln("ember-lower-west",-8.4,-5.6,1.3,3.7,0,2.2),Sa("ember-final-descent",-8.3,-5.8,2.7,5.2,0,2.2),{type:"sticky-wall",sourceId:"ember-lookout-grip",targetId:"ember-lookout",face:"south",axis:"z",minX:-1.6,maxX:1.6,minZ:-4.8,maxZ:-2.5,minY:4.4,maxY:5.6},{type:"sticky-wall",sourceId:"ember-west-recovery",targetId:"ember-middle-west",face:"east",axis:"x",minX:-8.4,maxX:-5.6,minZ:-1.05,maxZ:-.12,minY:0,maxY:4.4},{type:"sticky-wall",sourceId:"ember-east-recovery",targetId:"ember-lower-east",face:"west",axis:"x",minX:5.6,maxX:8.4,minZ:1.3,maxZ:3.7,minY:0,maxY:2.2},{type:"lava",sourceId:"ember-raised-lava",targetId:"ember-first-shoulder",face:"floor",minX:-.7,maxX:.7,minZ:-5.45,maxZ:-4.2,base:6.6,owner:{type:"box",minX:-2.5,maxX:2.5,minZ:-6.6,maxZ:-4.2,minY:6.2,maxY:6.6}},{type:"lava",sourceId:"ember-underbridge-lava",face:"floor",minX:-5.4,maxX:5.4,minZ:-6.7,maxZ:3.05,base:0},{type:"lava",sourceId:"ember-ground-lava",face:"floor",minX:-.9,maxX:1,minZ:4.4,maxZ:5.35,base:0}],pools:[[6.65,-5.5,6.6],[-7,-5.5,6.6],[-7,-1.35,4.4],[0,-3.65,5.6],[7,-1.35,4.4],[-7,1.95,2.2],[-5,5.55,0],[4.8,5.5,0]],poolCounts:[26,18,32,28,30,28,36,34],gems:[{x:-7,z:-5.55,base:6.6},{x:-7,z:-1.35,base:4.4},{x:0,z:-3.65,base:5.6},{x:7,z:-1.35,base:4.4},{x:-7,z:1.95,base:2.2},{x:-4.7,z:5.45,base:0},{x:4.8,z:5.45,base:0}],gold:[[7.9,-5.5,6.6],[6.65,-5.5,6.6],[5.2,-5.5,6.6],[3.8,-5.5,6.6],[2.4,-5.5,6.6],[1,-5.7,6.6],[-.4,-5.75,6.6],[-1.8,-5.7,6.6],[-3.2,-5.5,6.6],[-4.6,-5.5,6.6],[-6,-5.5,6.6],[-7.2,-5.5,6.6],[-7.2,-4.3,6.6],[-7.05,-4.45,6.16],[-7.05,-4.05,5.72],[-7.05,-3.65,5.28],[-7.05,-3.25,4.84],[-7.05,-2.85,4.4],[-7,-1.35,4.4],[-5.1,-1.8,4.4],[-3.7,-1.8,4.4],[-2.3,-1.8,4.4],[-.9,-1.8,4.4],[0,-3.65,5.6],[.9,-1.8,4.4],[2.3,-1.8,4.4],[3.7,-1.8,4.4],[5.1,-1.8,4.4],[7,-1.35,4.4],[7,-1,4.4],[7,-.65,3.96],[7,-.2,3.52],[7,.25,3.08],[7,.7,2.64],[7,1.1,2.2],[7,1.95,2.2],[5.1,2,2.2],[3.7,2,2.2],[2.3,2,2.2],[.9,2,2.2],[-.5,2,2.2],[-1.9,2,2.2],[-3.3,2,2.2],[-4.7,2,2.2],[-7,1.95,2.2],[-7,3.15,2.2],[-7,3.65,1.76],[-7,4.15,1.32],[-7,4.65,.88],[-7,5.1,.44],[-5.1,5.45,0],[-4.7,5.45,0],[-5.4,6.15,0],[4.8,5.45,0],[6.1,6.15,0]]},zs=[nn,Xh,Pn,e1,n1,i1,s1],r1=$x,p_=i=>i===7?-45:-(i-1)*7.2;zs.forEach((i,t)=>{i.targetTime=r1[t]});const th=i=>!!i&&(!!i.editorCustom||zs.some(t=>t.id===i.id)||!!i.tendrils),m_=i=>i.filter(t=>t.feedstock&&t.patchId===void 0);function Jn(i,t,e,n){if(Number.isFinite(n))return n;if(i.csgSolid){const o=ce(t,e,is(i)).height,a=Zs(i.csgSolid,{x:t,y:20,z:e},{x:0,y:-1,z:0},40);return Math.max(o,a&&a.normal?.y>.2?a.y:o)}const s=i.grip?.platform;let r=ce(t,e,is(i)).height;s&&t>s.minX&&t<s.maxX&&e>s.minZ&&e<s.maxZ&&(r=Math.max(r,s.maxY));for(const o of i.editorFixtures||[])o.type==="box"&&o.walkableTop&&t>o.minX&&t<o.maxX&&e>o.minZ&&e<o.maxZ&&(r=Math.max(r,o.maxY));return r}function is(i=nn,t=0){const e=i.editorFixtures||[],n=r=>i.csgSolid?[...r.filter(o=>!o.csgManaged),i.csgSolid,...i.grip?[{...i.grip.ramp,type:"grip-ramp-control"},{...i.grip.platform,type:"grip-platform-control",csgControl:!0}]:[]]:r,s=r=>n([...r,...i.pits||[]]);if(i.id===6&&i.gate){const r=i.gate;return s([i.boundary,i.terrain,...i.basin?[i.basin]:[],...i.exit?[i.exit]:[],{type:"roof",sourceId:"vault-shutter",minX:r.x-r.width/2,maxX:r.x+r.width/2,minZ:r.minZ,maxZ:r.maxZ,bottom:r.base+t,top:r.base+t+r.height},...i.posts||[],...e])}if(i.id===1)return s([i.boundary,i.terrain,...i.exit?[i.exit]:[],...i.roof?[i.roof]:[],...i.roofSupports??(i.roof?[i.roof.minZ-.14,i.roof.maxZ+.14].map(r=>({type:"box",minX:0,maxX:.75,minY:0,maxY:1.06,minZ:r-.14,maxZ:r+.14})):[]),...i.posts||[],...i.channels||[],...e]);if(i.grip&&!i.gate)return s([i.boundary,i.terrain,i.grip.ramp,i.grip.platform,...i.slip?[i.slip]:[],...i.channels||[],...i.exit?[i.exit]:[],...i.roof?[i.roof]:[],...i.posts||[],...e]);if(i.tendrils&&!i.gate)return s([i.boundary,i.terrain,...i.channels||[],...i.exit?[i.exit]:[],...i.basin?[i.basin]:[],...i.roof?[i.roof]:[],...i.posts||[],...e]);if(i.gate){const r=i.gate,o=r.width/2;return s([i.boundary,i.terrain,...i.basin?[i.basin]:[],...i.exit?[i.exit]:[],{type:"roof",minX:r.x-o,maxX:r.x+o,minZ:r.minZ,maxZ:r.maxZ,bottom:r.base+t,top:r.base+t+r.height},{type:"box",minX:r.x-o,maxX:r.x+o,minY:r.base,maxY:r.base+r.height+r.opening,minZ:i.terrain.frontZ,maxZ:r.minZ},{type:"box",minX:r.x-o,maxX:r.x+o,minY:r.base,maxY:r.base+r.height+r.opening,minZ:r.maxZ,maxZ:i.terrain.rearZ},...i.passage&&!i.csgSolid?[i.passage,{type:"box",minX:i.passage.minX,maxX:i.passage.maxX,minY:0,maxY:i.passage.top,minZ:i.passage.minZ,maxZ:i.passage.minZ+.16},{type:"box",minX:i.passage.minX,maxX:i.passage.maxX,minY:0,maxY:i.passage.top,minZ:i.passage.maxZ-.16,maxZ:i.passage.maxZ}]:[],...i.channels||[],...i.posts||[],...e])}return s([i.boundary,i.terrain,...i.exit?[i.exit]:[],...i.roof?[i.roof,...[i.roof.minZ-.14,i.roof.maxZ+.14].map(r=>({type:"box",minX:0,maxX:.75,minY:0,maxY:1.06,minZ:r-.14,maxZ:r+.14}))]:[],...i.posts||[],...i.channels||[],...e])}function o1(i=nn){return is(i),{phase:"title",elapsed:0,playElapsed:0,finishElapsed:null,deaths:0,drainTime:0,moved:0,grew:!1,contracted:!1,enteredGap:!1,under:!1,levelId:i.id,arrivalTime:0,settleTime:0,gems:(i.gems||[]).map((t,e)=>({...t,id:e,y:Jn(i,t.x,t.z,t.base)+.34,radius:.31,coverage:0,progress:0,collected:!1})),gold:(i.gold||[]).map(([t,e,n],s)=>({x:t,z:e,id:s,y:Jn(i,t,e,n)+.13,collected:!1})),goldCount:0,gemCount:0,notice:"",noticeUntil:0}}function a1(i,t=nn){const e=is(t);for(const n of i.particles)n.y+=Math.max(ce(n.x,n.z,e).height,t.start.y??0),n.py=n.y;(t.pools||[]).forEach(([n,s,r],o)=>{for(let a=0;a<(t.poolCounts?.[o]??58);a++){const c=a*2.39996323,l=.45*Math.sqrt(a%29/28),h=i.addParticle({x:n+Math.cos(c)*l,z:s+Math.sin(c)*l,y:Jn(t,n,s,r)+i.radius+.015+Math.floor(a/29)*.12},{feedstock:!0});h.patchId=o}}),i.samplePairs(),i.updateComponents(e)}function c1(i){const t=[];for(let e=0;e<8;e++){const n=e*Math.PI/4;t.push({x:i.x+Math.cos(n)*.3,y:i.y-.08,z:i.z+Math.sin(n)*.3})}for(let e=0;e<4;e++){const n=e*Math.PI/2+Math.PI/4;t.push({x:i.x+Math.cos(n)*.16,y:i.y+.19,z:i.z+Math.sin(n)*.16})}return t.push({x:i.x,y:i.y+.31,z:i.z}),t}function l1(i,t,e,n){const s=t.filter(c=>Math.hypot(c.x-i.x,c.z-i.z)<.8&&Math.abs(c.y-i.y)<.85);if(s.length<32)return 0;const r=n+.15,o=c1(i).map(c=>s.some(l=>Math.hypot(l.x-c.x,l.y-c.y,l.z-c.z)<r&&!In(l,c,e))),a=o.filter(Boolean).length;return o.at(-1)?a/o.length:Math.min(.8,a/o.length)}function ba(i,t){const e=i.garden,n=i.fluid,s=n.brain,r=i.activeColliders(),o=i.gardenLevel||nn;if(e.elapsed+=t,e.phase==="arriving"){e.arrivalTime+=t,e.arrivalTime>=1.1&&(e.phase="settling",e.settleTime=0);return}if(e.phase==="settling"){e.settleTime+=t,e.settleTime>=.42&&(e.phase="playing");return}if(e.phase==="draining"){e.drainTime+=t,e.drainTime>=2.8&&(e.phase="complete");return}if(e.phase!=="playing")return;e.playElapsed+=t,e.moved=Math.max(e.moved,Math.hypot(s.x-o.start.x,s.z-o.start.z)),e.grew||=n.attachedCount>=110,e.contracted||=!!n.contractAnchor,o.roof&&(e.enteredGap||=s.x>o.roof.minX-.2&&s.x<o.roof.maxX+.2&&s.z>o.roof.minZ&&s.z<o.roof.maxZ&&s.y<o.roof.bottom,e.under||=e.enteredGap&&s.x>o.roof.maxX+.3);const a=n.particles.filter((l,h)=>h!==n.brainIndex&&!l.feedstock&&l.component===s.component);for(const l of e.gold)l.collected||a.some(h=>Math.hypot(h.x-l.x,h.y-l.y,h.z-l.z)<n.radius+.19&&!In(h,l,r))&&(l.collected=!0,l.collectedAt=e.elapsed,e.goldCount++);for(const l of e.gems)l.collected||(l.coverage=l1(l,a,r,n.radius),l.progress=Math.max(0,Math.min(1,l.progress+t*(l.coverage>=12/13?1/.65:-1.3))),l.progress>=1&&(l.collected=!0,l.collectedAt=e.elapsed,e.gemCount++,e.notice="Gem absorbed",e.noticeUntil=e.elapsed+2));const c=Math.max(o.exit.base??0,Jn(o,o.exit.x,o.exit.z,o.exit.base));Math.hypot(s.x-o.exit.x,s.z-o.exit.z)<o.exit.radius*.7&&s.y<c+1&&(e.phase="draining",e.finishElapsed=e.playElapsed,e.drainTime=0,n.contractAnchor=null,i.tendril.release())}function g_(i){const t=i.garden,e=i.brain,n=i.gardenLevel||nn;if(t.phase==="arriving"||t.phase==="settling")return["FLOW DOWN","The living body pours through the opening above."];if(t.phase==="draining")return["DOWN THE DRAIN","Taking the soft way down."];if(n.editorCustom)return["EXPLORE YOUR GARDEN","Move through your authored fixtures, gather flesh, and flow into the exit."];if(n.id===7)return e.y>5.8?["UPPER CROSSING","Cross to the west landing. The ember patch cuts across the raised shoulder; the rear lip stays clear."]:e.x<-5.5&&e.y>3?["WEST DESCENT","Follow the broad stair to the middle bridge. Green ribs offer a climb back after a fall."]:e.y>3&&e.x<5.6?["LOOKOUT ABOVE","The south face of the lookout grips. Climb for its gem and flesh, then return to the bridge."]:e.x>5.5&&e.y>1?["EAST DESCENT","Turn down the east stairs and cross the lower bridge."]:e.y>1?["LOWER CROSSING","Cross west to the final stair. A fall leaves a route through the court."]:["EMBER COURT","The underpasses glow with lava. Follow the cool side corridors, skirt the pits, and cross the clear front lane to the drain."];if(n.id===6)return e.y>4.8&&e.z<-3?["THE SKY BRIDGE","Cross the narrow crown. The turquoise stretch keeps your momentum; the court below costs points."]:e.x<-5.2&&e.y>2.7?["THE WESTERN RETURN","Follow the descent, then cross the middle bridge through its low tunnel."]:e.x<3.7&&e.x>.2&&e.y>2.7?["THE RIBBED SPIRE","Press toward the green wall to climb to the high violet inclusion."]:e.x>5.7&&e.y>1?["THE EASTERN DESCENT","Follow the long ramp down. Losing the edge is survivable, but leaves gold above."]:e.x>-.8&&e.x<5.6&&e.z>2?i.pressure.active?["THE SHUTTER RISES","The shutter stays open. Flow beneath it and gather the vault gem."]:["WEIGHT FOR THE VAULT",`Hold Shed near the basin. ${i.pressure.weight} / ${n.gate.threshold} loose flesh opens the shutter.`]:e.x<-3&&e.z>2?["THE LOW GROTTO","Flatten beneath the stone ceiling, then contract in the open pocket around the gem."]:["FIND THE WAY DOWN","Recover on the green ribs, explore the side routes, and enter the lower funnel."];if(n.grip){const r=n.grip.platform,o=n.grip.ramp,a=n.slip;if(t.moved<.8)return["01 / GATHER YOURSELF","Flow left along the high rear lane, collecting flesh and gold before the stair turn."];if(e.z<n.terrain.frontZ)return["02 / LEFT STAIR TURN","Descend the left stairs and gather the middle green pool."];if(e.x>Math.min(r.minX,o.minX)-.3&&e.x<Math.max(r.maxX,o.maxX)+.75&&e.z>Math.min(r.minZ,o.minZ)-.3&&e.z<Math.min(n.terrain.rearZ,Math.max(r.maxZ,o.maxZ)+.3)){if(i.fluid.gripClimbing)return["GRIPPING THE WALL",`Keep pressing ${Kx(o,r,e)} toward the platform. Your connected flesh follows the ribbed face.`];if(lc(o)==="x"){if(e.x<r.minX)return["03 / FIND THE GRIP","Flow up the sage ramp and press D against the west ribbed face."];if(e.x>r.maxX)return["03 / FIND THE GRIP","Press A against the east ribbed face. Release to slide back down."]}else{if(e.z>r.maxZ)return["03 / FIND THE GRIP","Flow up the sage ramp and press W against the south ribbed face."];if(e.z<r.minZ)return["03 / FIND THE GRIP","Press S against the north ribbed face. Release to slide back down."]}return["SURROUND THE HIGH GEM","On the platform, gather your living flesh around the violet gem."]}return e.x>=a.minX-.5&&e.x<=a.maxX+.5&&e.z>=a.minZ-.4&&e.z<=a.maxZ+.4?["04 / SMOOTH STONE","This pale turquoise strip has little grip. Slow down early or let momentum carry you over the edge."]:e.z<n.terrain.rearZ?["05 / RIGHT STAIR TURN","Cross the middle terrace toward the right stairs, then descend to the low front lane."]:["THE WAY DOWN","Follow the low return left, gather the last flesh and gem, and enter the dark funnel."]}if(n.id===4){const r=i.tendril;return r.feedback&&i.fluid.time<r.feedbackUntil?["CAST STATUS",r.feedback]:t.moved<.8?["01 / REACH THE BANK","Move left across the high rear lane. The green flesh in the shallow channels can be reached with tendrils."]:e.z<n.terrain.frontZ?r.recalling?["RECALLING FLESH",`${r.count} / 3 strands drawing loose flesh back. Tap Space to pause; hold to contract.`]:r.count?["STRANDS EXTENDED",`${r.count} / 3 strands. Click a channel or press E to cast another; tap Space to recall all.`]:["02 / REACH THE CHANNELS","Stand near the casting bank and click the loose flesh in a channel, or press E for the nearest. Tap Space to recall; hold to gather."]:e.z<n.terrain.rearZ?["03 / MIDDLE TURN","Descend the left stairs, flow right across the middle terrace, and surround the second gem."]:["04 / FRONT RETURN","Descend the right stairs, follow the low front lane left, and enter the exit funnel."]}if(n.gate){if(t.moved<.8)return["01 / HIGH REAR LANE","Flow left across the high terrace. The garden descends toward you twice before the exit."];if(!t.grew)return["02 / GATHER FLESH","Gather the green pools along the high rear lane before the left stair turn."];const r=t.gems.filter(o=>!o.collected).sort((o,a)=>Math.hypot(o.x-e.x,o.z-e.z)-Math.hypot(a.x-e.x,a.z-e.z))[0];return r&&Math.hypot(r.x-e.x,r.z-e.z)<1.6?["SURROUND THE GEM",`Hold Space to rise around the gem. Covered ${Math.round(r.coverage*100)}%.`]:e.z<n.terrain.frontZ?["03 / LEFT STAIR TURN","Continue left, then descend the four shallow steps toward the middle terrace."]:!i.pressure.active&&i.pressure.weight<n.gate.threshold?["04 / LEAVE SOME WEIGHT",`Hold F at the middle basin rim. ${i.pressure.weight} / ${n.gate.threshold} shed particles on the plate.`]:e.x<n.gate.x?["05 / CROSS RIGHT","The deposit lifts the gate. Go around the basin, then flow right beneath the opening."]:n.passage&&e.x<4.2&&e.z<n.terrain.rearZ?["06 / GROW AGAIN","Gather the green pool beyond the gate, then surround the middle gem before the right stair turn."]:e.z<n.terrain.rearZ?["06 / FRONT STAIR TURN","Continue right to the second stair corridor and descend toward the front lane."]:n.passage&&e.x>n.passage.minX-.5&&e.z>n.passage.minZ-.4?["07 / THE LOW PASSAGE","Release Space and flow left through the low stone passage. Even a full body can flatten to pass."]:["THE WAY DOWN","Follow the low front lane left for the last flesh and gem, then enter the dark funnel."]}if(t.moved<.8)return["01 / FIND YOUR FEET","Move left down two short steps from the start platform, then follow the upper gold trail."];if(t.goldCount<2)return["02 / A LITTLE GOLD","Flow left over the gold. Your living flesh collects it by touch."];if(!t.grew)return["03 / GATHER YOURSELF","Touch the green pools on the upper lane. Their flesh becomes yours."];const s=t.gems.filter(r=>!r.collected).sort((r,o)=>Math.hypot(r.x-e.x,r.z-e.z)-Math.hypot(o.x-e.x,o.z-e.z))[0];return s&&Math.hypot(s.x-e.x,s.z-e.z)<1.6?["SURROUND THE GEM",`Move over the gem, then hold Space to gather into a mound. Surround it on every side. Covered ${Math.round(s.coverage*100)}%.`]:t.gemCount?e.z<nn.terrain.frontZ?["05 / REACH THE LEFT TURN","Continue left to the broad stair corridor. The open ledge offers a shortcut down, but leaves gold and flesh behind."]:e.x<nn.terrain.stairs.maxX+.5&&e.z<nn.terrain.stairs.endZ?["06 / DOWN THE STEPS","Turn toward the front and spill down six shallow ramps to the lower lane."]:!t.under&&e.x<nn.roof.maxX+.3?["07 / TAKE A SOFTER SHAPE","Follow the lower gold trail right. Release Space to flatten beneath the low lintel."]:e.x<4?["08 / FOLLOW THE RETURN","Keep moving right along the lower lane. Gather flesh and surround the remaining gems."]:["THE WAY DOWN",t.gemCount===3&&t.goldCount===t.gold.length?"Everything gathered. Flow into the dark funnel to finish.":"Explore the lower terrace, then flow into the dark funnel. All three gems and every gold piece earn 100%."]:["04 / BECOME A MOUND","The first violet gem is ahead on the high lane. Move onto it and hold Space to rise around it."]}function x_(i,t,e=nn){const n=Math.min(1,Math.max(0,t/1.45)),s=n*n*(3-2*n),r=Math.min(1,Math.max(0,(t-1.45)/1.35));return{...i,x:i.x+(e.exit.x-i.x)*s,z:i.z+(e.exit.z-i.z)*s,y:i.y-r*2.8}}function __(i,t,e,n=nn,s=[]){const o=Math.min(1,Math.max(0,e/1.1)),a=t===0||s.includes(t),c=t===0?0:a?.025+t%13*.004:.1+t*37%47/47*.43,l=Math.min(1,Math.max(0,(o-c)/(1-c))),h=l*l*(3-2*l),u=t*2.39996323,f=a?.035:.075,d=n.start.z;return{...i,x:n.start.x+Math.cos(u)*f+(i.x-n.start.x)*h,z:d+Math.sin(u)*f+(i.z-d)*h,y:i.y+(n.id>1?2.3:4.4)*(1-l)*(1-l)}}const Wr=(i,t,e)=>Math.max(t,Math.min(e,i)),qn=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y,i.z-t.z);class h1{constructor(t){this.fluid=t,this.state="ready",this.indices=[],this.members=new Set,this.cargo=new Set,this.length=0,this.recovered=0,this.strain=0}get active(){return this.indices.length>0}cast(t,e,n=new Set){if(this.active)return!1;const s=this.fluid,r=s.brain,o=t.x-r.x,a=t.z-r.z,c=Math.hypot(o,a);if(!Number.isFinite(c)||c<.45)return!1;s.samplePairs(),s.updateComponents(e);const l=s.particles.map((u,f)=>({p:u,i:f})).filter(({p:u,i:f})=>f!==s.brainIndex&&!s.coatIndices.includes(f)&&!n.has(f)&&!u.feedstock&&u.component===r.component&&qn(u,r)<1.55*s.size);if(l.length<12)return this.state="need flesh",!1;this.ux=o/c,this.uz=a/c;const h=Math.min(l.length-4,40,Math.max(12,Math.ceil(c/.14)+3));return this.reach=Math.min(c,4.8*s.size,(h-2)*.15*s.size),l.sort((u,f)=>{const d=x=>Math.abs((x.x-r.x)*this.uz-(x.z-r.z)*this.ux)+Math.abs(x.y-r.y)*.4;return d(u.p)-d(f.p)}),this.indices=l.slice(0,h).sort((u,f)=>(u.p.x-f.p.x)*this.ux+(u.p.z-f.p.z)*this.uz).map(u=>u.i),this.members=new Set(this.indices),this.cargo.clear(),this.length=Math.min(.8*s.size,this.reach),this.state="casting",this.strain=0,this.recovered=0,this.age=0,this.target={x:r.x+this.ux*this.reach,z:r.z+this.uz*this.reach},this.aimHeight=Number.isFinite(t.y)?t.y:null,this.brainAnchor={x:r.x,z:r.z},!0}release(t="ready"){this.indices=[],this.members.clear(),this.cargo.clear(),this.state=t,this.strain=0}prepare(t,e,n,s=!1){if(!this.active)return;this.age+=t,this.pulling=e;const r=this.fluid.brain;s&&(this.brainAnchor={x:r.x,z:r.z});const o=Math.hypot(this.target.x-r.x,this.target.z-r.z);if(o>this.reach+1.1*this.fluid.size){this.release("broken");return}this.ux=(this.target.x-r.x)/(o||1),this.uz=(this.target.z-r.z)/(o||1),e?(this.state="retrieving",this.length=Math.max(.15,this.length-t*.8),this.target={x:r.x+this.ux*this.length,z:r.z+this.uz*this.length}):(this.length=Math.min(o,this.length+t*4.2),this.state=this.length<o-.05?"casting":this.cargo.size?"contact":"extended"),this.colliders=n,e&&this.length<.3&&[...this.cargo].every(a=>qn(a,r)<.8)&&this.release()}controls(t){return this.active&&(this.members.has(t)||this.cargo.has(this.fluid.particles[t]))}guide(t){const e=this.fluid,n=e.brain,s=n.x+this.ux*this.length*t,r=n.z+this.uz*this.length*t,o=ce(s,r,this.colliders).height+e.radius+.055,a=this.aimHeight===null?o:n.y+(this.aimHeight-n.y)*Math.min(1,this.length/Math.max(.1,this.reach));return{x:s,z:r,y:Math.max(o,n.y+(a-n.y)*Math.min(1,this.length*t/.8))}}forces(t,e,n){if(!this.active)return;let s;if(this.members.has(e))s=this.guide((this.indices.indexOf(e)+1)/this.indices.length);else if(this.cargo.has(t)){if(!this.pulling){t.vx*=.9,t.vz*=.9;return}const o=this.fluid.brain,a=(t.x-o.x)*this.ux+(t.z-o.z)*this.uz;s=this.guide(Wr((a-.35)/Math.max(.1,this.length),0,1))}else return;const r=this.members.has(e)?85:65;t.vx+=Wr((s.x-t.x)*r-t.vx*11,-42,42)*n,t.vy+=(Wr((s.y-t.y)*r-t.vy*11,-32,42)+7.2)*n,t.vz+=Wr((s.z-t.z)*r-t.vz*11,-42,42)*n}solve(){if(!this.active)return;const t=this.fluid;for(let e=0;e<this.indices.length;e++){const n=e?t.particles[this.indices[e-1]]:t.brain,s=t.particles[this.indices[e]],r=qn(n,s),o=e?.23*t.size:.3*t.size;if(r<=o||In(n,s,this.colliders,t.radius*.3))continue;const a=Math.min(.035,(r-o)*.4),c=e?.5:0,l=(s.x-n.x)/r*a,h=(s.y-n.y)/r*a,u=(s.z-n.z)/r*a;e&&(n.x+=l*c,n.y+=h*c,n.z+=u*c),s.x-=l*(1-c),s.y-=h*(1-c),s.z-=u*(1-c)}}finish(t,e){if(!this.active)return;const n=this.fluid,s=n.brain;for(const o of this.cargo)(o.feedstock||qn(o,s)<.45)&&this.cargo.delete(o);let r=this.age>1.4&&qn(n.particles[this.indices.at(-1)],this.guide(1))>.75*n.size;for(let o=0;o<this.indices.length;o++){const a=n.particles[this.indices[o]],c=o?n.particles[this.indices[o-1]]:s;(a.feedstock||qn(a,c)>.5*n.size||In(a,c,e,n.radius*.3))&&(r=!0)}this.strain=r?this.strain+t:Math.max(0,this.strain-t*2),this.age>.7&&this.strain>.4&&this.release("broken")}}class u1{constructor(t){this.fluid=t,this.strands=[],this.recalling=!1,this.lastState="ready",this.feedback="",this.feedbackUntil=0,this.recovered=0}get active(){return this.strands.some(t=>t.active)}get count(){return this.strands.filter(t=>t.active).length}get indices(){return this.strands.flatMap(t=>t.indices)}get length(){return this.strands.reduce((t,e)=>t+e.length,0)}get state(){return this.active?this.recalling?"retrieving":this.strands.some(t=>t.state==="casting")?"casting":this.strands.some(t=>t.cargo.size)?"contact":"extended":this.lastState}reject(t){return this.feedback=t,this.feedbackUntil=this.fluid.time+2,!1}cast(t,e){if(this.count>=3)return this.reject("Three tendrils out — recall to free one");const n=new Set(this.indices);this.strands.forEach(r=>r.cargo.forEach(o=>n.add(this.fluid.particles.indexOf(o))));const s=new h1(this.fluid);return s.cast(t,e,n)?(this.active||(this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z}),this.strands.push(s),this.recalling=!1,this.feedback="",this.lastState="ready",!0):(this.active||(this.lastState=s.state),this.reject(s.state==="need flesh"?"Not enough flesh — gather or recall":"Aim farther from the body"))}toggleRecall(){this.active&&(this.recalling=!this.recalling)}release(t="ready"){this.strands.forEach(e=>e.release(t)),this.strands=[],this.recalling=!1,this.lastState=t,this.feedback=""}remapParticles(t){for(const e of this.strands){if(e.indices.some(n=>t[n]<0)){e.release("broken");continue}e.indices=e.indices.map(n=>t[n]),e.members=new Set(e.indices);for(const n of e.cargo)this.fluid.particles.includes(n)||e.cargo.delete(n)}this.strands=this.strands.filter(e=>e.active),this.active||(this.recalling=!1),this.wasLoose=null}controls(t){return this.strands.some(e=>e.controls(t))}prepare(t,e,n,s=!1){this.active&&(e&&(this.recalling=!0),s&&(this.brainAnchor={x:this.fluid.brain.x,z:this.fluid.brain.z}),this.wasLoose=new Set(this.fluid.particles.filter(r=>r.feedstock)),this.strands.forEach(r=>r.prepare(t,this.recalling,n,s)))}forces(t,e,n){this.strands.find(r=>r.controls(e))?.forces(t,e,n)}solve(){this.strands.forEach(t=>t.solve())}finish(t,e){const n=this.fluid,s=n.brain,r=this.strands.filter(a=>a.active);for(const a of this.wasLoose||[]){if(a.feedstock||a.component!==s.component||qn(a,s)<.45||r.some(h=>h.cargo.has(a)))continue;let c=null,l=1/0;for(const h of r)for(const u of h.indices){const f=qn(a,n.particles[u]);f<l&&(l=f,c=h)}c&&(c.cargo.add(a),c.recovered++,this.recovered++)}this.strands.forEach(a=>a.finish(t,e));const o=this.strands.filter(a=>!a.active);o.some(a=>a.state==="broken")?(this.lastState="broken",this.reject(this.active?"A tendril broke — the others are still available":"Tendril broke — gather flesh and cast again")):o.length&&(this.lastState="ready"),this.strands=this.strands.filter(a=>a.active),this.active||(this.recalling=!1),this.wasLoose=null}}const f1=(i,t,e)=>t>=i.minX&&t<=i.maxX&&e>=i.minZ&&e<=i.maxZ;function Kr(i,t,e,n=[]){const s=i.owner;if(!s)return ce(t,e,n).height;if(s.type==="cylinder")return Math.hypot(t-s.x,e-s.z)<=s.radius?s.height:null;if(!f1(s,t,e))return null;if(s.type==="box")return s.maxY;if(s.type==="roof")return s.top;if(s.type==="editor-stairs"){const r=s.axis==="x"?s.maxX-s.minX:s.maxZ-s.minZ;let o=s.axis==="x"?(t-s.minX)/r:(e-s.minZ)/r;return s.reverse&&(o=1-o),s.base+s.rise*o}return s.type==="grip-ramp"?s.axis==="x"?s.minHeight+(s.maxHeight-s.minHeight)*(t-s.minX)/(s.maxX-s.minX):s.northHeight+(s.southHeight-s.northHeight)*(e-s.minZ)/(s.maxZ-s.minZ):s.maxY??null}function di(i,t,e,n,s=1,r){if(i.face&&i.face!=="floor"||t.x<i.minX||t.x>i.maxX||t.z<i.minZ||t.z>i.maxZ)return!1;const o=Kr(i,t.x,t.z,n);if(o===null||!Number.isFinite(o)||!i.targetId&&i.base!==void 0&&Math.abs(o-i.base)>.2)return!1;const a=r??Zi(t,e,n);return Math.abs(a-o)<.16&&t.y<a+e+.34*s}const pe=(i,t,e)=>Math.max(t,Math.min(e,i)),d1=(i,t,e)=>`${i},${t},${e}`;class p1{constructor({x:t=-2.1,z:e=0,size:n=1,seedCount:s=null,massReferenceCount:r=null}={}){this.size=n,this.radius=.067*n,this.range=.35*n,this.particles=[];const o=.155*n;for(let h=0;h<3;h++)for(let u=-5;u<=5;u++)for(let f=-6;f<=6;f++){const d=f/6,x=u/5;if(d*d+x*x>1.04)continue;const M=.105+.08*(1-d*d)*(1-x*x),_=t+f*o,p=e+u*o,v=this.radius+.012+h*M*n;this.particles.push({x:_,y:v,z:p,px:_,py:v,pz:p,vx:0,vy:0,vz:0,component:0,lastMain:0,lastBrain:0})}this.brainIndex=this.particles.findIndex(h=>Math.abs(h.x-t)<1e-6&&Math.abs(h.z-e)<1e-6&&h.y>this.radius+.1*n),this.brainIndex<0&&(this.brainIndex=Math.floor(this.particles.length/2));const a=this.particles.length;if(s!==null&&s<a){const h=this.particles[this.brainIndex],u=this.particles.map((f,d)=>({p:f,i:d,d:Math.hypot(f.x-h.x,f.y-h.y,f.z-h.z)})).sort((f,d)=>f.d-d.d).slice(0,Math.max(17,s));this.brainIndex=u.findIndex(f=>f.i===this.brainIndex),this.particles=u.map(f=>f.p)}this.initialCount=this.particles.length,this.massReferenceCount=r??this.initialCount,this.coatIndices=this.particles.map((h,u)=>({i:u,d:Math.hypot(h.x-this.brain.x,h.y-this.brain.y,h.z-this.brain.z)})).filter(h=>h.i!==this.brainIndex).sort((h,u)=>h.d-u.d).slice(0,16).map(h=>h.i),this.coatReach=.25*n,this.attachedCount=0,this.attachedMass=0,this.brainPower=0,this.restDensity=0,this.time=0,this.contacts=0,this.mainComponent=0,this.contractAnchor=null,this.brainDrive={x:0,z:0},this.brainAirborne=!1,this.components=[],this.pairs=[],this.cohesion=.16,this.viscosity=.22,this.edgeReach=n>=1.2?2.9:2.4,this.edgeStrength=.012*n,this.samplePairs();const c=new Float32Array(this.particles.length);for(const[h,u,f]of this.pairs){const d=1-f/this.range;c[h]+=d*d,c[u]+=d*d}const l=[...c].sort((h,u)=>h-u);this.restDensity=l[Math.floor(l.length*.55)],this.updateComponents()}centroid(){let t=0,e=0,n=0;for(const r of this.particles)t+=r.x,e+=r.y,n+=r.z;const s=this.particles.length||1;return{x:t/s,y:e/s,z:n/s}}get brain(){return this.particles[this.brainIndex]}addParticle(t,{feedstock:e=!1}={}){const n={...t,px:t.x,py:t.y,pz:t.z,vx:0,vy:0,vz:0,component:-1,lastMain:-1/0,lastBrain:-1/0,feedstock:e};return this.particles.push(n),n}removeParticles(t,e=[]){const n=new Set(t),s=new Int32Array(this.particles.length).fill(-1);if(n.has(this.brainIndex))throw new Error("The brain must respawn before particle removal.");const r=[];return this.particles.forEach((o,a)=>{n.has(a)||(s[a]=r.length,r.push(o))}),this.particles=r,this.brainIndex=s[this.brainIndex],this.coatIndices=this.coatIndices.map(o=>s[o]).filter(o=>o>=0),this.pairs=[],this.components=[],this.contractAnchor=null,this.samplePairs(),this.updateComponents(e),s}field(t,e=1.9*this.size){const n=t/e;return 1/(1+n*n)}coatContacts(t=[]){const e=this.brain,n=this.coatReach+1e-5;return this.coatIndices.filter(s=>{const r=this.particles[s];return Math.hypot(r.x-e.x,r.y-e.y,r.z-e.z)<=n&&!In(e,r,t,this.radius*.35)})}constrainCoat(t){const e=this.brain,n=this.coatReach*.9;for(let s=0;s<8;s++){for(const r of this.coatIndices){const o=this.particles[r],a=o.x-e.x,c=o.y-e.y,l=o.z-e.z,h=Math.hypot(a,c,l);if(o.component!==e.component&&h>2*n||h<=n||h<1e-8)continue;const u=Math.min(h-n,.035*this.size),f=.05;e.x+=a/h*u*f,e.y+=c/h*u*f,e.z+=l/h*u*f,o.x-=a/h*u*(1-f),o.y-=c/h*u*(1-f),o.z-=l/h*u*(1-f),this.contacts+=Xr(e,this.radius,t)+Xr(o,this.radius,t)}if(this.coatContacts(t).length>=8)break}}startContract(t=[],e=()=>!1){this.samplePairs(),this.updateComponents(t);const n=(this.components.find(r=>r.includes(this.brainIndex))||[]).filter(r=>r!==this.brainIndex&&!e(r)),s=n.length||1;this.contractAnchor={x:n.length?n.reduce((r,o)=>r+this.particles[o].x,0)/s:this.brain.x,z:n.length?n.reduce((r,o)=>r+this.particles[o].z,0)/s:this.brain.z}}moveBrain(t,e,n){const s=this.brain,r=this.size,o=this.contractAnchor,a=Math.hypot(e.x||0,e.z||0),c=a?(e.x||0)/a:0,l=a?(e.z||0)/a:0,h=o&&Math.hypot(o.x-s.x,o.z-s.z)>.08*r,u=this.brainPower,f=(e.push?4.8:3.6)*Math.max(r,1)*u,d=24*Math.max(r,1)*u,x=(G,ct,Mt)=>G+pe(ct-G,-Mt,Mt),M=Zi(s,this.radius,n),_=n.find(G=>G.type==="slip"&&di(G,s,this.radius,n,r,M)),p=n.find(G=>G.type==="sticky-paint"&&di(G,s,this.radius,n,r,M));this.brainSlipping=!!_;const v=_?d*.12:p?d*.65:d,m=p?f*.78:f;this.brainDrive.x=u?x(this.brainDrive.x,h?0:c*m,v*t):0,this.brainDrive.z=u?x(this.brainDrive.z,h?0:l*m,v*t):0;const g=o||e.holdPosition,S=g?{x:g.x-s.x,z:g.z-s.z}:{x:0,z:0},E={x:this.brainDrive.x+pe(S.x*3.3,-1.8*r,1.8*r)*u,z:this.brainDrive.z+pe(S.z*3.3,-1.8*r,1.8*r)*u},w=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1)),A=Zi(s,this.radius,n);let T=A+(o?this.radius+.16*r+(1.25*r-this.radius-.16*r)*Math.cbrt(w):this.radius+.16*r);if(o){const G=this.particles.filter((Mt,Nt)=>Nt!==this.brainIndex&&!this.coatIndices.includes(Nt)&&!Mt.feedstock&&Mt.component===s.component&&Math.hypot(Mt.x-o.x,Mt.z-o.z)<.53*r).map(Mt=>Mt.y).sort((Mt,Nt)=>Mt-Nt),ct=G.length>=8?G[Math.floor(G.length*.65)]+.23*r:A+this.radius+.18*r;T=Math.min(T,ct)}const y=n.filter(G=>G.type==="roof"&&s.z>G.minZ-.2&&s.z<G.maxZ+.2).reduce((G,ct)=>{const Mt=Math.max(ct.minX-s.x,0,s.x-ct.maxX),Nt=G?Math.max(G.minX-s.x,0,s.x-G.maxX):1/0;return Mt<Nt?ct:G},null);let R=0;if(y){const G=pe((s.x-(y.minX-1.8*r))/(1.25*r),0,1),ct=y.approachBothSides?pe((y.maxX+1.8*r-s.x)/(1.25*r),0,1):pe((y.maxX+.75*r-s.x)/(.5*r),0,1);R=G*ct;const Mt=A+Math.max(this.radius+.018,Math.min(this.radius+.025,y.bottom-A-.105*r-.022));T=T*(1-R)+Mt*R}const C=n.find(G=>G.type==="grip-ramp"||G.type==="grip-ramp-control"),I=n.find(G=>G.gripPlatform&&C),N=n.find(G=>G.type==="editor-solid-mesh"),z=n.filter(G=>G.type==="sticky-wall").find(G=>{const ct=G.face==="west"?G.minX:G.face==="east"?G.maxX:G.face==="north"?G.minZ:G.maxZ,Mt=G.face==="west"||G.face==="north"?-1:1,Nt=["west","east"].includes(G.face)?s.x:s.z,U=["west","east"].includes(G.face)?s.z:s.x,P=["west","east"].includes(G.face)?G.minZ:G.minX,Y=["west","east"].includes(G.face)?G.maxZ:G.maxX,Q=ct-Mt*.035;return N&&!Fn(N,["west","east"].includes(G.face)?Q:s.x,pe(s.y,G.minY+.04,G.maxY-.04),["north","south"].includes(G.face)?Q:s.z)?!1:(Nt-ct)*Mt>=this.radius-.08&&(Nt-ct)*Mt<.75*r&&U>=P+this.radius&&U<=Y-this.radius&&s.y>=G.minY+this.radius-.12&&s.y<G.maxY+this.radius+.1}),k=z||I,B=z?z.axis:lc(C),$=B==="x"?s.x:s.z,j=B==="x"?c:l,q=k?.[B==="x"?"minX":"minZ"],nt=k?.[B==="x"?"maxX":"maxZ"],ft=k&&($<q||$>nt)?{coordinate:$<q?q:nt,normal:$<q?-1:1}:null,ot=z?{coordinate:z.face==="west"||z.face==="north"?q:nt,normal:z.face==="west"||z.face==="north"?-1:1}:ft||(k&&Math.abs(j)>.4?{coordinate:j<0?nt:q,normal:j<0?1:-1}:null),W=ot?($-ot.coordinate)*ot.normal:1/0,O=k&&(B==="x"?s.z>=k.minZ+this.radius&&s.z<=k.maxZ-this.radius:s.x>=k.minX+this.radius&&s.x<=k.maxX-this.radius),H=!N||!k?.csgControl||!ot||Fn(N,B==="x"?ot.coordinate-ot.normal*.035:s.x,pe(s.y,k.minY+.04,k.maxY-.04),B==="z"?ot.coordinate-ot.normal*.035:s.z),at=ot&&O&&H&&W>=this.radius-.03&&W<=.62*r&&s.y>=k.minY+this.radius-.12&&s.y<k.maxY+this.radius+.1,dt=at?this.particles.filter((G,ct)=>ct!==this.brainIndex&&!this.coatIndices.includes(ct)&&!G.feedstock&&G.component===s.component&&(B==="x"?G.z>=k.minZ&&G.z<=k.maxZ:G.x>=k.minX&&G.x<=k.maxX)&&((B==="x"?G.x:G.z)-ot.coordinate)*ot.normal>=-this.radius&&((B==="x"?G.x:G.z)-ot.coordinate)*ot.normal<=.58*r&&Math.abs(G.y-s.y)<.55*r).length:0,ht=!!(at&&j*ot.normal<-.4&&!o&&dt>=6&&this.coatContacts(n).length>=8),vt=!!(ot&&Math.abs(j)>.4&&!o&&s.x>=k.minX&&s.x<=k.maxX&&s.z>=k.minZ&&s.z<=k.maxZ&&s.y>=k.maxY+this.radius-.04);this.gripClimbing=ht||vt,this.gripFace=this.gripClimbing?{...ot,axis:B,minY:k.minY}:null;const Rt=G=>{const ct=Zi(G,this.radius,n);if(G.y<=ct+this.radius+.065*r)return!0;for(const Mt of n){if(Mt.type==="editor-solid-mesh"&&Yx(G,this.radius,Mt,.065*r)!==null)return!0;let Nt=null,U=!1;if(Mt.type==="cylinder"?(Nt=Mt.height,U=Math.hypot(G.x-Mt.x,G.z-Mt.z)<=Mt.radius+this.radius):(Mt.type==="box"||Mt.type==="roof")&&(Nt=Mt.type==="roof"?Mt.top:Mt.maxY,U=G.x>=Mt.minX-this.radius&&G.x<=Mt.maxX+this.radius&&G.z>=Mt.minZ-this.radius&&G.z<=Mt.maxZ+this.radius),U&&Math.abs(G.y-Nt-this.radius)<.065*r)return!0}return!1},F=s.y<=A+this.radius+.24*r||Rt(s);let rt=0;if(!F)for(let G=0;G<this.particles.length;G++){if(G===this.brainIndex||this.coatIndices.includes(G))continue;const ct=this.particles[G];if(!(ct.feedstock||ct.component!==s.component||ct.y>s.y-.04*r||s.y-ct.y>1.05*r||Math.hypot(ct.x-s.x,ct.z-s.z)>.78*r||!Rt(ct))&&++rt>=4)break}const st=at&&dt>=6&&this.coatContacts(n).length>=8;this.brainAirborne=!F&&rt<4&&!st&&!vt;let it=pe((T-s.y)*(R?6:3.2),-1.8*r,1.8*r)*u;this.brainAirborne?it=pe((s.vy-7.2*t)*.995,-5,5):ht?it=3.6/(1+3*(this.attachedCount/Math.max(1,this.massReferenceCount-1)))*r*u:at&&s.y>T&&(it=Math.max(it,-.42*r));const tt={x:s.x,y:s.y,z:s.z},yt=Math.max(1,Math.ceil(Math.hypot(E.x,it,E.z)*t/(this.radius*.45)));for(let G=0;G<yt;G++)s.px=s.x,s.py=s.y,s.pz=s.z,s.x+=E.x*t/yt,s.y+=it*t/yt,s.z+=E.z*t/yt,this.contacts+=Xr(s,this.radius,n);if(s.px=tt.x,s.py=tt.y,s.pz=tt.z,s.vx=(s.x-tt.x)/t,s.vy=(s.y-tt.y)/t,s.vz=(s.z-tt.z)/t,o&&a&&!h){const G=pe((s.x-tt.x)*c+(s.z-tt.z)*l,0,f*t);o.x+=c*G,o.z+=l*G}Math.abs(s.x-tt.x)<Math.abs(E.x*t)*.3&&(this.brainDrive.x=0),Math.abs(s.z-tt.z)<Math.abs(E.z*t)*.3&&(this.brainDrive.z=0)}samplePairs(){const t=this.range,e=this.particles;let n=1/0,s=1/0,r=1/0,o=-1/0,a=-1/0,c=-1/0;for(const g of e){const S=Math.floor(g.x/t),E=Math.floor(g.y/t),w=Math.floor(g.z/t);n=Math.min(n,S),s=Math.min(s,E),r=Math.min(r,w),o=Math.max(o,S),a=Math.max(a,E),c=Math.max(c,w)}n--,s--,r--,o++,a++,c++;const l=a-s+1,h=c-r+1,u=(o-n+1)*l*h,f=Number.isSafeInteger(u),d=f&&u<=25e4,x=f?(g,S,E)=>(g-n)*l*h+(S-s)*h+(E-r):d1;let M,_,p,v;if(d){const g=this._pairGrid||{};(!g.head||g.head.length<u)&&(g.head=new Int32Array(u),g.tail=new Int32Array(u)),(!g.next||g.next.length<e.length)&&(g.next=new Int32Array(e.length)),this._pairGrid=g,M=g.head,_=g.tail,p=g.next,M.fill(-1,0,u),_.fill(-1,0,u)}else v=new Map;for(let g=0;g<e.length;g++){const S=e[g],E=Math.floor(S.x/t),w=Math.floor(S.y/t),A=Math.floor(S.z/t),T=x(E,w,A);d?(p[g]=-1,M[T]===-1?M[T]=g:p[_[T]]=g,_[T]=g):(v.has(T)||v.set(T,[]),v.get(T).push(g))}const m=[];for(let g=0;g<e.length;g++){const S=e[g],E=Math.floor(S.x/t),w=Math.floor(S.y/t),A=Math.floor(S.z/t);for(let T=-1;T<=1;T++)for(let b=-1;b<=1;b++)for(let y=-1;y<=1;y++){const R=E+T,C=w+b,I=A+y;if(f&&(R<n||R>o||C<s||C>a||I<r||I>c))continue;const N=x(R,C,I);if(d)for(let z=M[N];z!==-1;z=p[z]){if(z<=g)continue;const k=e[z],B=Math.hypot(S.x-k.x,S.y-k.y,S.z-k.z);B<t&&m.push([g,z,B])}else{const z=v.get(N);if(!z)continue;for(const k of z){if(k<=g)continue;const B=e[k],$=Math.hypot(S.x-B.x,S.y-B.y,S.z-B.z);$<t&&m.push([g,k,$])}}}}return this.pairs=m,m}updateComponents(t=[]){const e=this.particles.length,n=Array.from({length:e},(l,h)=>h),s=l=>{for(;n[l]!==l;)n[l]=n[n[l]],l=n[l];return l};for(const[l,h,u]of this.pairs)if(u<this.range*.84&&!!this.particles[l].feedstock==!!this.particles[h].feedstock){const f=s(l),d=s(h);f!==d&&(!t.length||!In(this.particles[l],this.particles[h],t,this.radius*.35))&&(n[d]=f)}const r=new Int32Array(e),o=new Map;for(let l=0;l<e;l++){const h=s(l);r[l]=h,o.has(h)||o.set(h,[]),o.get(h).push(l)}this.components=[...o.values()].sort((l,h)=>h.length-l.length);const a=new Int32Array(e);for(let l=0;l<this.components.length;l++)a[r[this.components[l][0]]]=l;const c=a[r[this.brainIndex]];for(let l=0;l<e;l++){const h=a[r[l]];this.particles[l].component=h,h===0&&(this.particles[l].lastMain=this.time),h===c&&(this.particles[l].lastBrain=this.time)}return this.mainComponent=this.components[0]?.length||0,this.attachedCount=Math.max(0,(this.components[c]?.length||1)-1),this.attachedMass=this.attachedCount*this.size**3/Math.max(1,this.massReferenceCount-1),this.brainPower=this.attachedMass/(this.attachedMass+.35),this.components}attractExposedEdges(t,e,n=!1){if(this.cohesion<=0||this.edgeReach<=0||this.edgeStrength<=0)return;const s=this.particles,r=s.length,o=this.range,a=new Float32Array(r),c=new Float32Array(r),l=new Float32Array(r);for(const[p,v,m]of this.pairs){if(n&&(p===this.brainIndex||v===this.brainIndex)||n&&!!s[p].feedstock!=!!s[v].feedstock)continue;const g=s[p],S=s[v],E=S.x-g.x,w=S.z-g.z,A=Math.hypot(E,w);if(A<.045*this.size)continue;const T=1-m/o,b=E/A,y=w/A;a[p]+=b*T,c[p]+=y*T,a[v]-=b*T,c[v]-=y*T,l[p]+=T,l[v]+=T}const h=[];for(let p=0;p<r;p++){if(l[p]<.35||Math.hypot(a[p],c[p])/l[p]<.38)continue;const m=Math.hypot(a[p],c[p]);h.push({i:p,nx:-a[p]/m,nz:-c[p]/m})}const u=[],f=Math.max(o*1.25,.44*this.size),d=this.edgeReach;for(let p=0;p<h.length;p++)for(let v=p+1;v<h.length;v++){const m=h[p],g=h[v],S=s[m.i],E=s[g.i];if(S.feedstock&&E.feedstock&&S.patchId!==E.patchId)continue;const w=E.x-S.x,A=E.z-S.z,T=Math.hypot(w,A);if(T<f||T>d||Math.abs(E.y-S.y)>.36*this.size)continue;const b=w/T,y=A/T;m.nx*b+m.nz*y<.65||g.nx*b+g.nz*y>-.65||u.push({i:m.i,j:g.i,d:T,ux:b,uz:y})}u.sort((p,v)=>p.d-v.d);const x=new Uint8Array(r),M=new Float32Array(r),_=t*60*this.cohesion/.16;for(const p of u){const{i:v,j:m,d:g,ux:S,uz:E}=p;if(x[v]>=2||x[m]>=2||n&&(v===this.brainIndex||m===this.brainIndex)||n&&!!s[v].feedstock!=!!s[m].feedstock||In(s[v],s[m],e,this.radius*.35))continue;const w=Math.min((.45+.55*(1-g/d))*this.edgeStrength,this.edgeStrength-M[v],this.edgeStrength-M[m]);if(w<=0)continue;x[v]++,x[m]++,M[v]+=w,M[m]+=w;const A=w*_;s[v].x+=S*A,s[v].z+=E*A,s[m].x-=S*A,s[m].z-=E*A}}step(t,e,n,s={}){if(!(t>0))return;const r=1,o=t/r,a=this.particles,c=this.radius,l=n.filter(u=>u.type==="slip"),h=n.filter(u=>u.type==="sticky-paint"&&u.face==="floor");this.contacts=0,e.puddle&&(e.contract&&!this.contractAnchor&&this.startContract(n,s.controls),e.contract||(this.contractAnchor=null));for(let u=0;u<r;u++){this.time+=o,e.puddle&&this.moveBrain(o,e,n);const f=e.puddle?this.brain:this.centroid(),d=Math.hypot(e.x||0,e.z||0),x=new Set;if(e.puddle&&e.contract){const v=a.map((m,g)=>({p:m,i:g})).filter(({p:m,i:g})=>g!==this.brainIndex&&!this.coatIndices.includes(g)&&!m.feedstock&&m.component===this.brain.component&&!s.controls?.(g)).sort((m,g)=>m.p.y-g.p.y);for(let m=0;m<Math.ceil(v.length*.25);m++)x.add(v[m].i)}const M=d?(e.x||0)/d:0,_=d?(e.z||0)/d:0;for(let v=0;v<a.length;v++){const m=a[v];if(e.puddle&&v===this.brainIndex)continue;m.px=m.x,m.py=m.y,m.pz=m.z;const g=Zi(m,c,n),S=this.time-m.lastMain<2.5,E=this.brain.component,w=e.puddle?m.component===E:m.component===0||S&&this.components[m.component]?.length>this.initialCount*.1,A=((m.x-f.x)*M+(m.z-f.z)*_)/this.size,T=pe(1+.1*A,.82,1.14);if(w&&!e.puddle){const I=e.push?6:1;m.vx+=M*7.5*d*T*I*o,m.vz+=_*7.5*d*T*I*o}if(e.puddle&&!m.feedstock&&!e.contract&&!s.controls?.(v)){const I=f.x-m.x,N=f.z-m.z,z=Math.hypot(I,N),k=.19*this.size,B=Math.hypot(I,f.y-m.y,N),$=m.component===E,j=this.field(B);if(z>k){const nt=pe((z-k)/(.4*this.size),0,1),ft=($?12:8)*this.brainPower*j*nt;m.vx+=(I/z*ft-m.vx*.8*j)*o,m.vz+=(N/z*ft-m.vz*.8*j)*o}const q=l.some(nt=>di(nt,m,c,n,this.size,g));if(d&&I*M+N*_>-.08*this.size&&$&&!e.holdPosition&&!this.gripClimbing&&!this.brainSlipping&&!q&&B<2.4*this.size&&(!n.length||!In(m,f,n,c*.35))){const nt=12*this.brainPower*j,ft=24*Math.max(this.size,1)*this.brainPower;m.vx+=pe((f.vx-m.vx)*nt,-ft,ft)*o,m.vz+=pe((f.vz-m.vz)*nt,-ft,ft)*o}}if(this.gripClimbing&&!m.feedstock&&m.component===E&&!this.coatIndices.includes(v)&&Math.abs(this.gripFace.axis==="x"?m.z-f.z:m.x-f.x)<.9*this.size&&((this.gripFace.axis==="x"?m.x:m.z)-this.gripFace.coordinate)*this.gripFace.normal>-.45*this.size&&((this.gripFace.axis==="x"?m.x:m.z)-this.gripFace.coordinate)*this.gripFace.normal<.9*this.size&&m.y>this.gripFace.minY-.2*this.size&&m.y<f.y+.6*this.size&&(m.vy+=pe((f.y+.18*this.size-m.y)*54-m.vy*2,-4,42)*o),e.contract&&!m.feedstock&&v!==this.brainIndex&&!s.controls?.(v)){const I=m.component===E,N=I&&this.contractAnchor||f,z=N.x-m.x,k=N.z-m.z,B=Math.hypot(z,k),$=.12*this.size;if(B>$){const j=this.field(Math.hypot(z,f.y-m.y,k)),q=pe((B-$)/(.5*this.size),0,1),nt=(I?48:52)*this.brainPower*j*q;m.vx+=(z/B*nt-m.vx*3.2*j)*o,m.vz+=(k/B*nt-m.vz*3.2*j)*o}if(e.puddle&&!this.brainAirborne&&I&&!this.coatIndices.includes(v)&&!x.has(v)&&this.contractAnchor){const j=Math.hypot(m.x-N.x,m.z-N.z),q=Math.min(1,this.attachedCount/Math.max(1,this.massReferenceCount-1)),nt=(.62+.34*Math.cbrt(q))*this.size,ft=pe(1-j/nt,0,1),ot=Zi({x:N.x,y:f.y,z:N.z},this.radius,n)+this.radius+.014*this.size+ft*(.16+.9*Math.cbrt(q))*this.size;if(ft>0){const W=pe((ot-m.y)*48-m.vy*4,-12*this.size,24*this.size);m.vy+=W*o}}}s.forces?.(m,v,o),m.vy-=7.2*o;const b=m.y<=g+c+.02,y=l.some(I=>di(I,m,c,n,this.size,g)),R=h.some(I=>di(I,m,c,n,this.size,g)),C=b?y?.994:R?.94:.968:.993;m.vx*=C,m.vy*=.995,m.vz*=C,b&&!d&&(m.vx*=y?.99:R?.68:.88,m.vz*=y?.99:R?.68:.88),m.x+=m.vx*o,m.y+=m.vy*o,m.z+=m.vz*o}s.preSubstep?.(o,a),this.samplePairs(),this.attractExposedEdges(o,n,e.puddle);for(let v=0;v<(e.contract?4:2);v++){this.samplePairs();const m=new Float32Array(a.length),g=new Float32Array(a.length);for(const[S,E,w]of this.pairs){const A=1-w/this.range,T=A*A,b=T*A;m[S]+=T,m[E]+=T,g[S]+=b,g[E]+=b}for(const[S,E,w]of this.pairs){const A=a[S],T=a[E],b=1-w/this.range,y=(T.x-A.x)/(w||1),R=(T.y-A.y)/(w||1),C=(T.z-A.z)/(w||1),I=Math.max(-.004,(m[S]-this.restDensity)*.0037),N=Math.max(-.004,(m[E]-this.restDensity)*.0037),z=(g[S]+g[E])*.0026;let k=((I+N)*b+z*b*b)*.5;w<c*1.78&&(k+=Math.min(.006,(c*1.78-w)*.06)),w>c*2.45&&(k-=this.cohesion*.02*b),k=pe(k,-.005,.007),e.puddle&&S===this.brainIndex?(T.x+=y*k*2,T.y+=R*k*2,T.z+=C*k*2):e.puddle&&E===this.brainIndex?(A.x-=y*k*2,A.y-=R*k*2,A.z-=C*k*2):(A.x-=y*k,A.y-=R*k,A.z-=C*k,T.x+=y*k,T.y+=R*k,T.z+=C*k)}s.solve?.(o,a);for(const S of a)this.contacts+=Xr(S,c,n);e.puddle&&this.constrainCoat(n)}this.samplePairs();const p=e.puddle?5*Math.max(this.size,1):5;for(const v of a)v.vx=pe((v.x-v.px)/o,-p,p),v.vy=pe((v.y-v.py)/o,-5,5),v.vz=pe((v.z-v.pz)/o,-p,p);for(const[v,m,g]of this.pairs){if(e.puddle&&(v===this.brainIndex||m===this.brainIndex))continue;const S=a[v],E=a[m],w=this.viscosity*(1-g/this.range)*.045,A=(E.vx-S.vx)*w,T=(E.vy-S.vy)*w,b=(E.vz-S.vz)*w;S.vx+=A,S.vy+=T,S.vz+=b,E.vx-=A,E.vy-=T,E.vz-=b}s.postSubstep?.(o,a)}if(this.samplePairs(),e.puddle&&e.growth){this.updateComponents(n);const u=a.map(f=>!!f.feedstock);e.expireFragments&&this.expireFragments(),e.shed||this.claimFeedstock(n),u.some((f,d)=>f!==!!a[d].feedstock)&&this.updateComponents(n)}else this.updateComponents(e.puddle?n:[])}expireFragments(t=2.5){for(let e=0;e<this.particles.length;e++){const n=this.particles[e];e===this.brainIndex||this.coatIndices.includes(e)||n.feedstock||n.component===this.brain.component||this.time-n.lastBrain>=t&&(n.feedstock=!0,n.shedLocked=!1)}}claimFeedstock(t){const e=this.particles.filter(o=>!o.feedstock&&o.component===this.brain.component);if(!e.length)return;const n=this.range*.75,s=t.find(o=>o.type==="funnel"&&o.holdsFeedstock),r=s?ce(s.x,s.z,t).height:0;for(const o of this.particles)if(o.feedstock&&!(s&&o.shedAt!==void 0&&Math.hypot(o.x-s.x,o.z-s.z)<s.bottomRadius+.04&&o.y<r+this.radius+.23)){if(o.shedLocked){const a=!this.particles.some(c=>!c.feedstock&&Math.hypot(c.x-o.x,c.y-o.y,c.z-o.z)<this.range);if(!a&&this.time-(o.shedAt??this.time)<1.2||(o.shedLocked=!1,a))continue}e.some(a=>Math.hypot(a.x-o.x,a.y-o.y,a.z-o.z)<n&&!In(a,o,t,this.radius*.35))&&(o.feedstock=!1)}}}function m1(i,t,e=i.activeColliders()){if(i.garden?.phase!=="playing")return!1;const n=i.fluid,s=n.brain,r=n.radius;i.garden.burnSites=[];const o=e.filter(d=>d.type==="pit").map(d=>({pit:d,rim:d.rimHeight??ce(d.x+d.radius+.02,d.z,e).height})),a=e.filter(d=>d.type==="lava");if(!o.length&&!a.length)return!1;for(const{pit:d,rim:x}of o)if(Math.hypot(s.x-d.x,s.z-d.z)<d.radius&&s.y<x-1.6)return i.respawnGarden("pit"),!0;const c=[],l=[];for(let d=0;d<n.particles.length;d++){if(d===n.brainIndex)continue;const x=n.particles[d];if(o.some(({pit:p,rim:v})=>Math.hypot(x.x-p.x,x.z-p.z)<p.radius&&x.y<v-1.6)){c.push(d);continue}const _=a.some(p=>di(p,x,r,e,n.size));if(x.burnTime=_?(x.burnTime||0)+t:0,!(!_||x.burnTime<.2)){if(x.feedstock){i.garden.burnSites.length<12&&i.garden.burnSites.push({x:x.x,y:x.y,z:x.z}),c.push(d);continue}l.push(d)}}if(l.length){const d=Math.max(1,Math.ceil(l.length/12));for(let p=0;p<l.length&&i.garden.burnSites.length<12;p+=d){const v=n.particles[l[p]];i.garden.burnSites.push({x:v.x,y:v.y,z:v.z})}i.garden.burnCredit=(i.garden.burnCredit||0)+t*36;const x=l.filter(p=>!n.coatIndices.includes(p)),M=x.length?x:l,_=Math.min(M.length,Math.floor(i.garden.burnCredit));c.push(...M.slice(0,_)),i.garden.burnCredit-=_}else i.garden.burnCredit=0;const h=l.some(d=>c.includes(d)&&n.particles[d].component===s.component);if(c.length){const d=n.removeParticles(c,e);i.tendril.remapParticles(d)}if(h&&n.attachedCount<=20&&(i.garden.criticalBurnLatched=!0),i.garden.criticalBurnLatched&&n.attachedCount<=20){if(i.garden.burnSites.length<12&&i.garden.burnSites.push({x:s.x,y:s.y,z:s.z}),i.garden.criticalBurn=(i.garden.criticalBurn||0)+t,i.garden.criticalBurn>=.35)return i.respawnGarden("lava"),!0}else i.garden.criticalBurn=0,i.garden.criticalBurnLatched=!1;const u=a.some(d=>di(d,s,r,e,n.size)),f=n.coatContacts(e).length>=4;return i.garden.coreBurn=u&&!f?(i.garden.coreBurn||0)+t:0,i.garden.coreBurn>=.35?(i.respawnGarden("lava"),!0):!1}const eh=1/60,ze={startX:-2.4,spoutX:2.4,spoutZ:0,spoutY:1.3,seedCount:17,capacity:297,interval:.5,perDrip:4,goal:120},Wi={startX:-6.4,seedCount:17,capacity:297,patches:[[-4.6,-2.7],[-4.6,0],[-4.6,2.7],[-1.05,-2.7],[-1.05,0],[-1.05,2.7],[2.5,-2.7],[2.5,0],[2.5,2.7],[6.05,-2.7],[6.05,0],[6.05,2.7]]},gn={startX:-4.8,rate:42,threshold:48,releaseThreshold:36,gateX:1.5,gateWidth:.42,gateHeight:1.3,opening:.58},nh=(i,t,e)=>Math.max(t,Math.min(e,i));class y_{constructor({size:t=1}={}){this.selectedTest="puddle",this.gardenLevelId=1,this.completedLevels={},this.practiceLevel=!1,this.reset(t)}get body(){return this.fluid.centroid()}get brain(){return this.fluid.brain}get gardenLevel(){return this.localRun?.level||zs[this.gardenLevelId-1]||null}get isLocalGarden(){return!!this.localRun}startGarden(t=1,{newGame:e=!1,practice:n=!1}={}){return!Number.isInteger(t)||!zs[t-1]?!1:(this.localRun=null,e&&(this.completedLevels={},this.practiceLevel=n),this.selectedTest="garden",this.gardenLevelId=t,this.descending=!1,this.reset(1),this.gardenInputArmed=!1,this.garden.phase="arriving",this.garden.arrivalTime=0,!0)}startLocalGarden(t,{id:e,revision:n}={}){return!t?.start||!t?.exit||!e||!Number.isInteger(n)||n<1?!1:(this.localRun={id:e,revision:n,level:t},this.selectedTest="garden",this.gardenLevelId=1,this.practiceLevel=!1,this.descending=!1,this.reset(1),this.gardenInputArmed=!1,this.garden.phase="arriving",this.garden.arrivalTime=0,!0)}restartGarden(){return this.localRun?this.startLocalGarden(this.localRun.level,this.localRun):this.startGarden(this.gardenLevelId)}respawnGarden(t="pit"){if(this.selectedTest!=="garden")return!1;const e=this.garden,n={gold:e.gold.filter(a=>a.collected).map(a=>a.id),gems:e.gems.filter(a=>a.collected).map(a=>a.id)},s=e.playElapsed,r=(e.deaths||0)+1,o=e.elapsed;this.reset(1);for(const a of this.garden.gold)n.gold.includes(a.id)&&(a.collected=!0,this.garden.goldCount++);for(const a of this.garden.gems)n.gems.includes(a.id)&&(a.collected=!0,a.progress=1,this.garden.gemCount++);return this.garden.playElapsed=s,this.garden.elapsed=o,this.garden.deaths=r,this.garden.phase="arriving",this.garden.arrivalTime=0,this.gardenInputArmed=!1,this.garden.notice=t==="lava"?"The heat scattered your body":"You fell into a pit",!0}continueGarden(){if(this.localRun||this.gardenLevelId>=zs.length||this.garden.phase!=="complete")return!1;const t=this.gardenLevelId+1;return this.completedLevels[this.gardenLevelId]={gems:this.garden.gemCount,gold:this.garden.goldCount,totalGold:this.garden.gold.length,totalGems:this.garden.gems.length,...Number.isFinite(this.garden.finishElapsed)?{elapsed:this.garden.finishElapsed,target:this.gardenLevel.targetTime}:{}},this.startGarden(t),this.descending=!0,!0}reset(t=this.size){this.size=t,this.gardenInputArmed=!0;const e=this.selectedTest==="garden"?this.gardenLevel.start.x:this.selectedTest==="field"?Wi.startX:this.selectedTest==="growth"?ze.startX:this.selectedTest==="pressure"?gn.startX:this.selectedTest==="gap"?-2.1*t:0,n=this.selectedTest==="garden"?this.gardenLevel:this.selectedTest==="field"?Wi:this.selectedTest==="growth"?ze:null;this.fluid=new p1({x:e,z:this.selectedTest==="garden"?this.gardenLevel.start.z:0,size:t,...n?{seedCount:n.seedCount,massReferenceCount:n.capacity}:{}}),this.tendril=new u1(this.fluid),this.gardenTendrilUsed=!1,this.growth={elapsed:0,emitted:0,absorbed:0,complete:!1},this.field={absorbed:0,loose:Wi.capacity-Wi.seedCount},this.pressure={shed:0,credit:0,weight:0,active:!1,opening:0,complete:!1},this.oozeForward=!1,this.materialState="oozing",this.relaxTime=0,this.fleshThrough=0,this.brainThrough=!1,this.gapStage="approach",this.selectedTest==="field"&&this.seedField(),this.selectedTest==="garden"&&(this.garden=o1(this.gardenLevel),a1(this.fluid,this.gardenLevel))}selectTest(t){return["field","growth","gap","pressure","puddle","garden"].includes(t)?(this.retrievalSetup=!1,this.selectedTest=t,this.reset(t==="gap"?this.size:1),!0):!1}seedField(){Wi.patches.forEach(([t,e],n)=>{const s=23+(n<4?1:0);for(let r=0;r<s;r++){const o=r===0?0:r<=8?1:2,a=o===1?r-1:r-9,c=o===1?8:s-9,l=o===0?0:2*Math.PI*(a+(o===2?.25:0))/c,h=o===0?0:o===1?.18:.37,u=this.fluid.addParticle({x:t+Math.cos(l)*h,y:this.fluid.radius+.013,z:e+Math.sin(l)*h},{feedstock:!0});u.patchId=n}}),this.fluid.samplePairs(),this.fluid.updateComponents(this.activeColliders())}emitGrowth(t){if(!(this.selectedTest!=="growth"||this.growth.emitted>=ze.capacity-ze.seedCount))for(this.growth.elapsed+=t;this.growth.elapsed>=ze.interval&&this.growth.emitted<ze.capacity-ze.seedCount;){this.growth.elapsed-=ze.interval;for(let e=0;e<ze.perDrip&&this.growth.emitted<ze.capacity-ze.seedCount;e++){const n=this.growth.emitted++,s=n*2.39996323;this.fluid.addParticle({x:ze.spoutX+Math.cos(s)*(.035+.034*(n%3)),y:ze.spoutY+e%2*.12,z:ze.spoutZ+Math.sin(s)*(.035+.034*(n%3))},{feedstock:!0})}}}setupRetrieval(){this.selectTest("pressure");const t=this.fluid,e=2.6-t.brain.x;for(const s of t.particles)s.x+=e,s.px=s.x;t.particles.map((s,r)=>({p:s,i:r})).filter(({i:s})=>s!==t.brainIndex&&!t.coatIndices.includes(s)).sort((s,r)=>Math.hypot(r.p.x-t.brain.x,r.p.z)-Math.hypot(s.p.x-t.brain.x,s.p.z)).slice(0,145).forEach(({p:s},r)=>{const o=r*2.39996323,a=.5*Math.sqrt(r%49/48);s.x=As.x+Math.cos(o)*a,s.z=As.z+Math.sin(o)*a,s.y=-As.depth+t.radius+.02+Math.floor(r/49)*.13,s.px=s.x,s.py=s.y,s.pz=s.z,s.vx=s.vy=s.vz=0,s.feedstock=!0}),t.samplePairs(),t.updateComponents(this.activeColliders()),this.updatePressure(1),this.retrievalSetup=!0}castTendril(t){if(!t||!(this.selectedTest==="pressure"||this.selectedTest==="garden"&&th(this.gardenLevel)&&this.garden.phase==="playing"&&this.gardenInputArmed))return!1;const e=this.tendril.cast(t,this.activeColliders());return e&&this.selectedTest==="garden"&&(this.gardenTendrilUsed=!0),e}shed(t){const e=this.selectedTest==="garden"&&this.gardenLevel.gate||gn;this.pressure.credit+=t*e.rate;const n=this.fluid,s=n.brain,r=n.particles.map((a,c)=>({p:a,i:c})).filter(({p:a,i:c})=>c!==n.brainIndex&&!n.coatIndices.includes(c)&&!a.feedstock&&a.component===s.component).sort((a,c)=>a.p.y-Math.hypot(a.p.x-s.x,a.p.z-s.z)*.35-(c.p.y-Math.hypot(c.p.x-s.x,c.p.z-s.z)*.35)),o=Math.min(Math.floor(this.pressure.credit),r.length);for(let a=0;a<o;a++){const c=r[a].p;c.feedstock=!0,c.shedLocked=!0,c.shedAt=n.time,delete c.patchId,this.pressure.shed++}this.pressure.credit-=o,r.length||(this.pressure.credit=0)}updatePressure(t){const e=this.pressure,n=this.fluid.radius,s=this.selectedTest==="garden"?this.gardenLevel.gate:gn,r=this.selectedTest==="garden"?this.gardenLevel.basin:As,o=ce(r.x,r.z,this.activeColliders()).height;e.weight=this.fluid.particles.filter(c=>(this.selectedTest!=="garden"||c.feedstock&&c.shedAt!==void 0)&&Math.hypot(c.x-r.x,c.z-r.z)<r.bottomRadius+.04&&c.y<o+n+.23).length,e.weight>=s.threshold?e.active=!0:e.weight<s.releaseThreshold&&!s.latch&&(e.active=!1);let a=e.active?s.opening:0;a<e.opening&&this.fluid.particles.some(c=>Math.abs(c.x-(s.gateX??s.x))<(s.gateWidth??s.width)/2+n+.05&&c.z>(s.minZ??-2.3)-n&&c.z<(s.maxZ??2.3)+n&&c.y+n>(s.base??0)+a&&c.y-n<(s.base??0)+e.opening)&&(a=e.opening),e.opening+=nh(a-e.opening,-t*.65,t*.65),e.complete=this.selectedTest==="garden"?this.brain.x>s.x+.8:this.brain.x>gn.gateX+.8}activeColliders(){return this.selectedTest==="garden"?is(this.gardenLevel,this.pressure.opening):this.selectedTest==="pressure"?[Ma,As,{type:"roof",minX:gn.gateX-gn.gateWidth/2,maxX:gn.gateX+gn.gateWidth/2,minZ:-2.3,maxZ:2.3,bottom:this.pressure.opening,top:this.pressure.opening+gn.gateHeight},...[-1,1].map(t=>({type:"box",minX:1.25,maxX:1.75,minY:0,maxY:1.3,minZ:t<0?-4.3:2.3,maxZ:t<0?-2.3:4.3}))]:this.selectedTest==="gap"?[Ma,...Zx]:[Ma]}step(t={},e=eh){if(!(e>0))return this;if(this.selectedTest==="garden"&&!["playing","draining","arriving","settling"].includes(this.garden.phase))return this;if(e=nh(e,0,eh),this.selectedTest==="garden"&&this.garden.phase==="arriving")return ba(this,e),this;if(this.selectedTest==="garden"&&this.garden.phase==="draining")return ba(this,e),this;const n=this.selectedTest==="garden"&&this.garden.phase==="settling";n&&(t={}),this.selectedTest==="garden"&&!n&&!this.gardenInputArmed&&(t.x||t.z||t.contract||t.shed||t.push||t.recallToggle?t={}:this.gardenInputArmed=!0);const s=this.selectedTest==="garden"&&!!this.gardenLevel.gate,r=this.selectedTest==="garden"&&!!this.gardenLevel.editorCanShed,o=(this.selectedTest==="pressure"||s||r)&&!!t.shed;o?(this.tendril.active&&this.tendril.release("released"),this.shed(e)):this.pressure.credit=0,t.recallToggle&&!o&&(this.selectedTest==="pressure"||this.selectedTest==="garden"&&th(this.gardenLevel))&&this.tendril.toggleRecall();const a=!!t.contract&&!o,c=this.activeColliders(),l=this.selectedTest==="gap"&&this.oozeForward?{x:1,z:0}:t,h=Math.hypot(l.x||0,l.z||0);if(this.tendril.prepare(e,a,c,h>0),this.emitGrowth(e),a?(this.materialState="contracting",this.relaxTime=1.5):this.relaxTime>0?(this.relaxTime=Math.max(0,this.relaxTime-e),this.materialState="relaxing"):this.materialState="oozing",this.fluid.step(e,{x:h?(l.x||0)/h:0,z:h?(l.z||0)/h:0,holdPosition:this.tendril.active?this.tendril.brainAnchor:null,push:!!t.push,shed:o,expireFragments:this.selectedTest==="pressure"||s||r||this.selectedTest==="garden"&&!!(this.gardenLevel.tendrils||this.gardenLevel.grip||this.gardenTendrilUsed),puddle:!0,growth:this.selectedTest!=="gap",contract:a},c,this.tendril.active?{controls:u=>this.tendril.controls(u),forces:(u,f,d)=>this.tendril.forces(u,f,d),solve:()=>this.tendril.solve()}:{}),this.tendril.finish(e,c),this.selectedTest==="garden"&&!n&&m1(this,e,c))return this;if((this.selectedTest==="pressure"||s)&&this.updatePressure(e),o&&(this.materialState="shedding"),this.selectedTest==="growth"&&(this.growth.absorbed=Math.max(0,this.fluid.attachedCount-(ze.seedCount-1)),this.growth.complete=this.fluid.attachedCount>=ze.goal),this.selectedTest==="field"&&(this.field.absorbed=Math.max(0,this.fluid.attachedCount-(Wi.seedCount-1)),this.field.loose=this.fluid.particles.filter(u=>u.feedstock).length),this.selectedTest==="gap"){const u=Fs.roof.maxX+this.fluid.radius+.04;this.brainThrough=this.brain.x>u,this.fleshThrough=this.fluid.particles.filter((f,d)=>d!==this.fluid.brainIndex&&f.x>u).length/Math.max(1,this.fluid.particles.length-1),this.gapStage=this.brainThrough&&this.fleshThrough>=.9?"through":this.brain.x>Fs.roof.minX-this.fluid.radius?"under":"approach",this.gapStage==="through"&&(this.oozeForward=!1)}return this.selectedTest==="garden"&&ba(this,e),this}}const g1="modulepreload",x1=function(i){return"/puddle-study/"+i},ih={},v_=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let o=function(l){return Promise.all(l.map(h=>Promise.resolve(h).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=o(e.map(l=>{if(l=x1(l),l in ih)return;ih[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":g1,h||(f.as="script"),f.crossOrigin="",f.href=l,c&&f.setAttribute("nonce",c),document.head.appendChild(f),h)return new Promise((d,x)=>{f.addEventListener("load",d),f.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};function M_(i,t="gem"){const e=new Hs(i,0),n=e.index?e.toNonIndexed():e;e!==n&&e.dispose();const s=n.attributes.position,r=new Float32Array(s.count*3),o=new D,a=new D,c=new D,l=new D;for(let h=0;h<s.count;h+=3){o.fromBufferAttribute(s,h),a.fromBufferAttribute(s,h+1),c.fromBufferAttribute(s,h+2),l.subVectors(a,o).cross(new D().subVectors(c,o)).normalize();const u=.83+.08*Math.sin(h*2.17),f=l.y>.4?1.08:l.y<-.4?.7:u,d=t==="gem"?[f*.97,f*.98,Math.min(1.18,f*1.08)]:[Math.min(1.2,f*1.09),f*.97,f*.68];for(let x=0;x<3;x++)r.set(d,h*3+x*3)}return n.setAttribute("color",new Zt(r,3)),n}function _1(i,t){const e=new mi(i,i,t,48,1,!1),n=e.attributes.position,s=new Float32Array(n.count*3);for(let r=0;r<n.count;r++){const o=n.getX(r),a=n.getZ(r),c=Math.atan2(a,o),l=.5+.5*Math.cos(c*12),h=1-.047*l;n.setXYZ(r,o*h,n.getY(r),a*h);const u=r>=98,f=u?1.08:.82+.15*(1-l);s.set([f,f,f],r*3)}return e.setAttribute("color",new Zt(s,3)),e.computeVertexNormals(),e}function S_(i,t,e){const n=[],s=[],o=(g,S)=>n.push(...g,...S),a=(g,S,E)=>{for(let w=0;w<E;w++){if(w%7===4)continue;const A=y=>g.map((R,C)=>R+(S[C]-R)*y),T=A((w+.06)/E),b=A((w+.72)/E);if(o(T,b),w%6===0){const y=A((w+.45)/E);s.push(...y,y[0]+.025,y[1]-.016,y[2]-.022,y[0]+.061,y[1]-.003,y[2]+.014)}}},c=t.terrain,l=t.boundary,h=c.frontZ,u=c.upperHeight??c.frontHeight,f=c.stairs??c.leftStairs,d=(g,S)=>ce(g,S,e).height+.025;for(const[g,S]of[[l.minX,f.minX],[f.maxX,l.maxX]])a([g,u+.025,h],[S,u+.025,h],Math.ceil((S-g)*3));for(const g of f.steps){const S=g.z+g.width,E=d((f.minX+f.maxX)/2,S);a([f.minX,E,S],[f.maxX,E,S],10)}if(c.startTier)for(const g of c.startTier.steps){const S=g.x+g.width,E=d(S,(c.startTier.minZ+c.startTier.maxZ)/2);a([S,E,c.startTier.minZ],[S,E,c.startTier.maxZ],12)}if(c.rightStairs){const g=c.rightStairs;for(const[S,E]of[[l.minX,g.minX],[g.maxX,l.maxX]])a([S,c.middleHeight+.025,c.rearZ],[E,c.middleHeight+.025,c.rearZ],Math.ceil((E-S)*3));for(const S of g.steps){const E=S.z+S.width,w=d((g.minX+g.maxX)/2,E);a([g.minX,w,E],[g.maxX,w,E],10)}}if(t.grip){const g=t.grip.platform,S=g.maxY+.024;a([g.minX,S,g.minZ],[g.maxX,S,g.minZ],14),a([g.minX,S,g.maxZ],[g.maxX,S,g.maxZ],14)}let x=t.id*19753+421;const M=()=>(x=Math.imul(x,1664525)+1013904223>>>0)/4294967296;for(let g=0;g<20;g++){const S=l.minX+.5+M()*(l.maxX-l.minX-1),E=l.minZ+.5+M()*(l.maxZ-l.minZ-1);if(Math.hypot(S-t.exit.x,E-t.exit.z)<1.3)continue;const w=.25+M()*.36,A=M()*Math.PI*2,T=Math.cos(A),b=Math.sin(A),y=[S+w*.56*T,E+w*.56*b],R=[S+w*T-.045*b,E+w*b+.045*T],C=d(S,E),I=d(...y),N=d(...R);if(Math.max(Math.abs(I-C),Math.abs(N-C))>.09)continue;const z=[S,C+.003,E],k=[y[0],I+.003,y[1]];if(o(z,k),o(k,[R[0],N+.003,R[1]]),g%3===0){const B=y[0]+w*.32*(T*.4-b*.92),$=y[1]+w*.32*(b*.4+T*.92),j=d(B,$);Math.abs(j-I)<.09&&o(k,[B,j+.003,$])}}const _=new ne;_.setAttribute("position",new Zt(n,3));const p=new Zn(_,new ji({color:5333853,transparent:!0,opacity:.43,depthWrite:!1}));p.userData.stoneEdges=t.id,i.add(p);const v=new ne;v.setAttribute("position",new Zt(s,3)),v.computeVertexNormals();const m=new He(v,new me({color:10392968,side:2,transparent:!0,opacity:.33}));return m.userData.stoneChips=t.id,i.add(m),[p,m]}const y1={floor:{pattern:"stone",scale:3.8,grain:.055,pore:.24,crack:.54,art:.84,space:"world"},wall:{pattern:"stone",scale:4.1,grain:.07,pore:.3,crack:.82,art:.9,space:"world"},violetStone:{pattern:"stone",scale:5.2,grain:.04,pore:.16,crack:.46,art:.43,space:"world"},lintel:{pattern:"stone",scale:3.8,grain:.035,pore:.16,crack:.43,art:.38,space:"world"},gem:{pattern:"gem",scale:1.15,grain:.02,pore:.07,crack:.48,space:"local"},gold:{pattern:"gold",scale:.6,grain:.015,pore:.03,crack:.39,space:"local"}};function v1(i){if(typeof document>"u"){const u=new Uint8Array(4096);let f=i==="stone"?385172:i==="gem"?58271:130217;for(let x=0;x<u.length;x+=4)f=Math.imul(f,1664525)+1013904223>>>0,u[x]=170+(f>>>27),u[x+1]=248,u[x+2]=248,u[x+3]=255;const d=new qa(u,32,32,1023);return d.colorSpace="",d.wrapS=d.wrapT=1e3,d.minFilter=1008,d.magFilter=1006,d.generateMipmaps=!0,d.needsUpdate=!0,d}const t=document.createElement("canvas");t.width=t.height=512;const e=t.getContext("2d"),n=document.createElement("canvas");n.width=n.height=512;const s=n.getContext("2d");let r=i==="stone"?385172:i==="gem"?58271:130217;const o=()=>(r=Math.imul(r,1664525)+1013904223>>>0)/4294967296,a=e.createImageData(512,512);for(let h=0;h<a.data.length;h+=4)a.data[h]=i==="stone"?170+Math.floor(o()*86):210+Math.floor(o()*46),a.data[h+1]=a.data[h+2]=a.data[h+3]=255;const c=(h,u)=>{s.clearRect(0,0,512,512),u();const f=s.getImageData(0,0,512,512).data;for(let d=0;d<f.length;d+=4)a.data[d+h]=255-f[d+3]};i==="stone"?(c(1,()=>{for(let h=0;h<58;h++){const u=o()*512,f=o()*512,d=2+Math.floor(o()*5);for(let x=0;x<d;x++)s.beginPath(),s.arc(u+(o()-.5)*22,f+(o()-.5)*18,1.4+o()*3.2,0,Math.PI*2),s.fillStyle=`rgba(0,0,0,${.45+o()*.35})`,s.fill()}}),c(2,()=>{for(let h=0;h<7;h++){let u=o()*512,f=o()*512;const d=2+Math.floor(o()*3),x=o()*Math.PI*2;s.beginPath(),s.moveTo(u,f);for(let M=0;M<d;M++){const _=10+o()*17;u+=Math.cos(x+(o()-.5)*.65)*_,f+=Math.sin(x+(o()-.5)*.65)*_,s.lineTo(u,f)}s.strokeStyle=`rgba(0,0,0,${.7+o()*.24})`,s.lineWidth=2.2+o()*1.4,s.stroke(),h%3===0&&(s.beginPath(),s.moveTo(u,f),s.lineTo(u+11,f+14),s.strokeStyle="rgba(0,0,0,.66)",s.lineWidth=1.8,s.stroke())}})):(c(2,()=>{const h=i==="gem"?11:6;for(let u=0;u<h;u++){const f=o()*512,d=o()*512,x=(i==="gem"?32:15)+o()*(i==="gem"?50:26);s.beginPath(),s.moveTo(f,d),s.lineTo(f+x,d-x*(.2+o()*.4)),s.strokeStyle=`rgba(0,0,0,${i==="gem"?.72:.65})`,s.lineWidth=i==="gem"?5.2:4,s.stroke()}}),i==="gem"&&c(1,()=>{for(let h=0;h<22;h++)s.beginPath(),s.arc(o()*512,o()*512,2+o()*2,0,Math.PI*2),s.fillStyle="rgba(0,0,0,.6)",s.fill()})),e.putImageData(a,0,0);const l=new $u(t);return l.colorSpace="",l.wrapS=l.wrapT=1e3,l.minFilter=1008,l.magFilter=1006,l.generateMipmaps=!0,l.anisotropy=4,l}function M1(){const i=new Map;let t=!1;const e={value:null},n={value:0},s=r=>{if(t)throw new Error("Printed material library was disposed");return i.has(r)||i.set(r,v1(r)),i.get(r)};if(typeof Image<"u"){const r="/puddle-study/".replace(/\/?$/,"/");new Wf().load(`${r}art/textures/stone-ink-v1.png`,o=>{if(t){o.dispose();return}o.colorSpace=Je,o.wrapS=o.wrapT=1002,o.minFilter=1008,o.magFilter=1006,o.generateMipmaps=!0,o.anisotropy=4,o.needsUpdate=!0,i.set("artStone",o),e.value=o,n.value=1},void 0,()=>{})}return{decorate(r,o){const a=y1[o];if(!a)return r;const c=s(a.pattern),l=r.onBeforeCompile;a.pattern==="stone"&&!e.value&&(e.value=c);const h=r.customProgramCacheKey.bind(r);return r.onBeforeCompile=(u,f)=>{l.call(r,u,f),u.uniforms.printMask=a.pattern==="stone"?e:{value:c},u.uniforms.printArtReady=a.pattern==="stone"?n:{value:0};const d=a.space==="local"?"position":"(modelMatrix*vec4(position,1.0)).xyz",x=a.space==="local"?"normal":"mat3(modelMatrix)*normal";u.vertexShader=u.vertexShader.replace("void main() {",`varying vec3 vPrintPosition; varying vec3 vPrintNormal;
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
           diffuseColor.rgb*=1.0-clamp(printInk,0.0,0.6);`)},r.customProgramCacheKey=()=>`${h()}|print-v4:${o}:${a.space}`,r.userData.printRole=o,r.needsUpdate=!0,r},dispose(){if(!t){t=!0;for(const r of i.values())r.dispose();i.clear()}}}}function Wh(i,t){const n=[];for(const s of i||[]){let r=!1,o=1/0,a=s.minY??s.base??s.bottom??s.minHeight??s.northHeight??0;if(s.type==="cylinder")r=Math.hypot(t.x-s.x,t.z-s.z)<=s.radius+.035&&t.y>=a-.035&&t.y<=s.height+.035,o=Math.PI*s.radius*s.radius*(s.height-a);else if(Number.isFinite(s.minX)&&Number.isFinite(s.maxX)&&Number.isFinite(s.minZ)&&Number.isFinite(s.maxZ)){const c=s.maxY??s.top??s.maxHeight??s.southHeight??(s.base??0)+(s.rise??0);r=t.x>=s.minX-.035&&t.x<=s.maxX+.035&&t.z>=s.minZ-.035&&t.z<=s.maxZ+.035&&t.y>=a-.035&&t.y<=c+.035,o=(s.maxX-s.minX)*(s.maxZ-s.minZ)*(c-a)}r&&n.push({sourceId:s.sourceId,base:a,volume:o})}return n.sort((s,r)=>s.volume-r.volume),n[0]||null}function S1(i){const t=i.object.userData.editorSourceAt?.(i.point)||null;return{targetId:t?.sourceId||i.object.userData.editorId||null,supportBase:t?.base??i.object.userData.supportBase??0}}function b1(i,t,{printLibrary:e,labelRoot:n}={}){const s=new Yi;i.add(s);const r=e||M1(),o=new ji({color:3691348}),a=new ji({color:3768201,transparent:!0,opacity:.82}),c={floor:new me({color:14996413,side:2}),block:new me({color:13944493}),roof:new me({color:11125175,transparent:!0,opacity:.72}),pillar:new me({color:15260355,vertexColors:!0}),riser:new me({color:12036498,side:2}),exit:new me({color:3231052,side:2}),basin:new me({color:12163974,side:2}),flesh:new me({color:8890775}),gem:new me({color:10454192}),gold:new me({color:13936719}),start:new me({color:12086633}),slip:new me({color:7784143,side:2,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),lava:new me({color:14899244,side:2,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),lavaCrust:new me({color:7611421,side:2,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),pit:new me({color:1515558,side:1}),pitRim:new me({color:5522502,side:2}),grip:new me({color:9219734,side:2}),cutter:new me({color:11954791,wireframe:!0,transparent:!0,opacity:.58,depthWrite:!1})};for(const[y,R]of Object.entries({floor:"floor",block:"wall",roof:"lintel",pillar:"wall",riser:"wall",gem:"gem",gold:"gold"}))r.decorate(c[y],R);const l=(y,R,C=0,I=0,N=0,z=!1)=>{const k=new He(y,c[R]);return k.position.set(C,I,N),k.userData.pickableTerrain=z,s.add(k),k},h=(y,R)=>{const C=y.minY??0,I=y.maxY??y.top,N=y.type==="roof"?y.bottom:C,z=l(new Ln(y.maxX-y.minX,I-N,y.maxZ-y.minZ),R,(y.minX+y.maxX)/2,(N+I)/2,(y.minZ+y.maxZ)/2,!0);return z.userData.editorId=y.sourceId||y.editorId||null,z.userData.supportBase=N,z.add(new Zn(new Jo(z.geometry),o)),z},u=(y,R,C="floor")=>{const I=[],N=t.csgSolid,z=C==="floor"?y.minX:["west","east"].includes(C)?y.minZ:y.minX,k=C==="floor"?y.maxX:["west","east"].includes(C)?y.maxZ:y.maxX,B=C==="floor"?y.minZ:y.minY,$=C==="floor"?y.maxZ:y.maxY,j=Math.max(.085,Math.sqrt((k-z)*($-B)/1e4)),q=(ot,W,O=!1)=>{if(C==="floor"){const H=Kr(y,ot,W,d);return H===null||!y.targetId&&y.base!==void 0&&Math.abs(H-y.base)>.2?null:[ot,H+(O?-.025:.022),W]}return C==="west"||C==="east"?[C==="west"?y.minX+(O?.025:-.008):y.maxX+(O?-.025:.008),W,ot]:[ot,W,C==="north"?y.minZ+(O?.025:-.008):y.maxZ+(O?-.025:.008)]};for(let ot=z;ot<k-.001;ot+=j)for(let W=B;W<$-.001;W+=j){const O=Math.min(k,ot+j),H=Math.min($,W+j),at=q((ot+O)/2,(W+H)/2,!0);if(C==="floor"&&!y.targetId&&d.some(F=>["funnel","pit"].includes(F.type)&&!F.raised&&Math.hypot((ot+O)/2-F.x,(W+H)/2-F.z)<F.radius+j*.75)||!at||N&&y.targetId&&!Fn(N,...at))continue;const dt=q(ot,W),ht=q(O,W),vt=q(ot,H),Rt=q(O,H);!dt||!ht||!vt||!Rt||(C==="floor"?I.push(...dt,...vt,...ht,...ht,...vt,...Rt):I.push(...dt,...ht,...vt,...ht,...Rt,...vt))}const nt=new ne;nt.setAttribute("position",new Zt(I,3)),nt.computeVertexNormals();const ft=l(nt,R);if(ft.userData.editorPaintId=y.sourceId||null,R==="lava"&&C==="floor"){const ot=[],W=[];for(let O=y.minX+.13;O<y.maxX-.12;O+=.35)for(let H=y.minZ+.13;H<y.maxZ-.12;H+=.35){const at=Kr(y,O,H,d);if(at===null||!y.targetId&&Math.abs(at-(y.base??at))>.2||d.some(F=>["funnel","pit"].includes(F.type)&&Math.hypot(O-F.x,H-F.z)<F.radius+.12))continue;const dt=Math.min(.18,y.maxX-O-.02),ht=(Math.sin(O*8+H*13)+1)*.04;ot.push(O,at+.048,H,O+dt*.55,at+.048,H+ht,O+dt*.55,at+.048,H+ht,O+dt,at+.048,H-ht*.4);const vt=at+.054,Rt=.045;W.push(O,vt,H-Rt,O+dt*.55,vt,H+ht-Rt,O,vt,H+Rt,O+dt*.55,vt,H+ht-Rt,O+dt*.55,vt,H+ht+Rt,O,vt,H+Rt,O+dt*.55,vt,H+ht-Rt,O+dt,vt,H-ht*.4-Rt*.5,O+dt*.55,vt,H+ht+Rt,O+dt,vt,H-ht*.4-Rt*.5,O+dt,vt,H-ht*.4+Rt*.5)}if(ot.length){const O=new ne;O.setAttribute("position",new Zt(ot,3)),s.add(new Zn(O,new ji({color:7611421,transparent:!0,opacity:.8})))}if(W.length){const O=new ne;O.setAttribute("position",new Zt(W,3)),l(O,"lavaCrust").renderOrder=2}}if(R==="slip"&&C==="floor"){const ot=(O,H)=>(Kr(y,O,H,d)??y.base??0)+.039,W=new ne;W.setAttribute("position",new Zt([y.minX,ot(y.minX,y.minZ),y.minZ,y.maxX,ot(y.maxX,y.minZ),y.minZ,y.maxX,ot(y.maxX,y.minZ),y.minZ,y.maxX,ot(y.maxX,y.maxZ),y.maxZ,y.maxX,ot(y.maxX,y.maxZ),y.maxZ,y.minX,ot(y.minX,y.maxZ),y.maxZ,y.minX,ot(y.minX,y.maxZ),y.maxZ,y.minX,ot(y.minX,y.minZ),y.minZ],3)),s.add(new Zn(W,a))}return ft},f=t.boundary,d=is(t),x=t.terrain;if(x.type==="flat"){const y=new io;y.moveTo(f.minX,f.minZ),y.lineTo(f.maxX,f.minZ),y.lineTo(f.maxX,f.maxZ),y.lineTo(f.minX,f.maxZ),y.closePath();for(const I of d.filter(N=>["funnel","pit"].includes(N.type)&&!N.raised)){const N=new no;N.absarc(I.x,I.z,I.radius,0,Math.PI*2,!0),y.holes.push(N)}const R=new so(y,40),C=R.attributes.position;for(let I=0;I<C.count;I++)C.setXYZ(I,C.getX(I),x.height??0,C.getY(I));R.computeVertexNormals(),l(R,"floor",0,0,0,!0)}else{const R=[],C=[],I=[],N=d.filter(q=>["funnel","pit"].includes(q.type)&&!q.raised).map(q=>{const nt=(ft,ot,W,O)=>Math.max(ot,Math.min(W,ot+O((ft-ot)/.24)*.24));return{cut:q,minX:nt(q.x-q.radius,f.minX,f.maxX,Math.floor),maxX:nt(q.x+q.radius,f.minX,f.maxX,Math.ceil),minZ:nt(q.z-q.radius,f.minZ,f.maxZ,Math.floor),maxZ:nt(q.z+q.radius,f.minZ,f.maxZ,Math.ceil)}}),z=(q,nt,ft,ot)=>C.push(...q,...nt,...ft,...nt,...ot,...ft),k=(q,nt)=>I.push(...q,...nt);for(let q=f.minX;q<f.maxX-.001;q+=.24)for(let nt=f.minZ;nt<f.maxZ-.001;nt+=.24){const ft=Math.min(.24,f.maxX-q),ot=Math.min(.24,f.maxZ-nt),W=q+ft/2,O=nt+ot/2;if(N.some(at=>W>at.minX&&W<at.maxX&&O>at.minZ&&O<at.maxZ))continue;const H=ce(W,O,[x]).height;if(R.push(q,H,nt,q+ft,H,nt,q,H,nt+ot,q+ft,H,nt,q+ft,H,nt+ot,q,H,nt+ot),q+ft<f.maxX-.001){const at=ce(q+ft+Math.min(.24,f.maxX-q-ft)/2,O,[x]).height;if(Math.abs(H-at)>.045){const dt=Math.min(H,at),ht=Math.max(H,at),vt=q+ft;z([vt,dt,nt],[vt,dt,nt+ot],[vt,ht,nt],[vt,ht,nt+ot]),k([vt,ht+.006,nt],[vt,ht+.006,nt+ot])}}if(nt+ot<f.maxZ-.001){const at=ce(W,nt+ot+Math.min(.24,f.maxZ-nt-ot)/2,[x]).height;if(Math.abs(H-at)>.045){const dt=Math.min(H,at),ht=Math.max(H,at),vt=nt+ot;z([q,dt,vt],[q+ft,dt,vt],[q,ht,vt],[q+ft,ht,vt]),k([q,ht+.006,vt],[q+ft,ht+.006,vt])}}}const B=new ne;B.setAttribute("position",new Zt(R,3)),B.computeVertexNormals(),l(B,"floor",0,0,0,!0);for(const q of N){const nt=new io;nt.moveTo(q.minX,q.minZ),nt.lineTo(q.maxX,q.minZ),nt.lineTo(q.maxX,q.maxZ),nt.lineTo(q.minX,q.maxZ),nt.closePath();const ft=new no;ft.absarc(q.cut.x,q.cut.z,q.cut.radius,0,Math.PI*2,!0),nt.holes.push(ft);const ot=new so(nt,48),W=ot.attributes.position,O=ce(q.cut.x,q.cut.z,[x]).height;for(let H=0;H<W.count;H++)W.setXYZ(H,W.getX(H),O,W.getY(H));ot.computeVertexNormals(),l(ot,"floor",0,0,0,!0)}const $=new ne;$.setAttribute("position",new Zt(C,3)),l($,"riser");const j=new ne;j.setAttribute("position",new Zt(I,3)),s.add(new Zn(j,o))}let M=null,_=0;for(const y of d)if(y.type==="editor-solid-mesh"){const R=ls(y);if(R){const C=R.geometry.clone();C.computeVertexNormals();const I=l(C,"block",0,0,0,!0);I.userData.editorSourceAt=N=>Wh(t.csgSources,N),I.add(new Zn(new Jo(I.geometry,28),o))}}else if(y.type==="box"||y.type==="roof"){const R=h(y,y.type==="roof"?"roof":"block"),C=t.gate,I=(C?.width??0)/2;C&&y.type==="roof"&&Math.abs(y.minX-(C.x-I))<.001&&Math.abs(y.minZ-C.minZ)<.001&&Math.abs(y.maxZ-C.maxZ)<.001&&(M=R,_=R.position.y)}else if(y.type==="cylinder"){const R=l(_1(y.radius,y.height-(y.base??0)),"pillar",y.x,((y.base??0)+y.height)/2,y.z,!0);R.userData.editorId=y.editorId||y.sourceId||null,R.userData.supportBase=y.base??0,R.add(new Zn(new Jo(R.geometry,25),o))}else if(y.type==="grip-ramp"){const R=(y.axis==="x"?y.minHeight+y.maxHeight:y.northHeight+y.southHeight)/2,C=l(new Ln(y.maxX-y.minX,.05,y.maxZ-y.minZ),"grip",(y.minX+y.maxX)/2,R,(y.minZ+y.maxZ)/2,!0);C.userData.editorId=y.editorId||null;const I=y.axis==="x"?(y.maxHeight-y.minHeight)/(y.maxX-y.minX):(y.southHeight-y.northHeight)/(y.maxZ-y.minZ);y.axis==="x"?C.rotation.z=Math.atan(I):C.rotation.x=-Math.atan(I)}else if(y.type==="sticky-wall")u(y,"grip",y.face);else if(y.type==="sticky-paint"&&y.face==="floor")u(y,"grip");else if(y.type==="slip")u({...y,base:y.base??ce((y.minX+y.maxX)/2,(y.minZ+y.maxZ)/2,d).height},"slip");else if(y.type==="lava")u(y,"lava");else if(y.type==="editor-stairs"){const R=y.axis,C=R==="x"?y.maxX-y.minX:y.maxZ-y.minZ,I=(y.minX+y.maxX)/2,N=(y.minZ+y.maxZ)/2,z=l(new Ln(y.maxX-y.minX,.06,y.maxZ-y.minZ),"block",I,y.base+y.rise/2,N,!0);z.userData.editorId=y.sourceId||null,R==="x"?z.rotation.z=(y.reverse?-1:1)*Math.atan(y.rise/C):z.rotation.x=(y.reverse?1:-1)*Math.atan(y.rise/C);for(let k=1;k<y.steps;k++){const B=k/y.steps,$=(R==="x"?y.minX:y.minZ)+C*B,j=new ne,q=R==="x"?[$,y.base+y.rise*(y.reverse?1-B:B)+.045,y.minZ,$,y.base+y.rise*(y.reverse?1-B:B)+.045,y.maxZ]:[y.minX,y.base+y.rise*(y.reverse?1-B:B)+.045,$,y.maxX,y.base+y.rise*(y.reverse?1-B:B)+.045,$];j.setAttribute("position",new Zt(q,3)),s.add(new Zn(j,o))}}else if(y.type==="pit"){const R=ce(y.x,y.z,[x]).height,C=l(new mi(y.radius,y.radius,.3,48,1,!0),"pit",y.x,R-.15,y.z);C.userData.editorId=y.sourceId||null;const I=l(new ro(y.radius,.035,5,48),"pitRim",y.x,R+.015,y.z);I.rotation.x=Math.PI/2}else if(y.type==="funnel"){const R=y.raised?y.base:ce(y.x,y.z,[x]).height;l(new mi(y.radius,y.bottomRadius,y.depth,40,1,!0),y===t.exit?"exit":"basin",y.x,R-y.depth/2,y.z,!0);const C=l(new Ja(y.bottomRadius,32),y===t.exit?"exit":"basin",y.x,R-y.depth+.006,y.z,!0);C.rotation.x=-Math.PI/2;const I=l(new ro(y.radius,.025,5,40),"block",y.x,R+.01,y.z);I.rotation.x=Math.PI/2}const p=[];for(const y of t.editorCutters||[]){const R=y.shape==="cylinder"?new mi(y.radius,y.radius,y.height,48):new Ln(y.width,y.height,y.depth),C=l(R,"cutter",y.x,y.y,y.z),I=y.rotation||{};C.rotation.set(bo.degToRad(I.x||0),bo.degToRad(I.y||0),bo.degToRad(I.z||0),"XYZ"),C.visible=!1,p.push(C)}const v=(t.gems||[]).map(y=>l(new Hs(.33),"gem",y.x,Jn(t,y.x,y.z,y.base)+.34,y.z)),m=(t.gold||[]).map(([y,R,C])=>l(new Hs(.14),"gold",y,Jn(t,y,R,C)+.14,R)),g=(t.pools||[]).map(([y,R,C])=>l(new Xs(.4,14,8),"flesh",y,Jn(t,y,R,C)+.18,R)),S=t.start?l(new Ka(.23,.5,8),"start",t.start.x,Jn(t,t.start.x,t.start.z)+.3,t.start.z):null,E=n||(typeof document<"u"?document.querySelector("#app"):null),w=(t.labels||[]).map(y=>{if(!E)return null;const R=document.createElement("div");return R.className="world-label editor-label",R.textContent=y.text,R.hidden=!0,E.append(R),{node:R,point:new D(y.x,y.base+y.offset,y.z)}}).filter(Boolean);let A=!1,T=!1;const b=(y,R)=>{const C=T||y?.garden?.phase==="playing",I=typeof document<"u"&&!!document.querySelector(".in-menu"),N=E?.getBoundingClientRect?.();for(const{node:z,point:k}of w){if(z.hidden=!0,!C||I||!R||!N?.width||!N?.height)continue;const B=k.clone().project(R);!Number.isFinite(B.x)||!Number.isFinite(B.y)||B.x<-1||B.x>1||B.y<-1||B.y>1||B.z<-1||B.z>1||(z.style.left=`${(B.x*.5+.5)*N.width}px`,z.style.top=`${(-B.y*.5+.5)*N.height}px`,z.hidden=!1)}};return{group:s,setEditing(y){T=!!y;for(const R of p)R.visible=T},setPlaying(y){A=!!y;for(const R of g)R.visible=!A;S&&(S.visible=!A)},update(y,R){b(y,R),M&&(M.position.y=_+(y.pressure?.opening||0)),v.forEach((C,I)=>C.visible=!y.garden.gems[I]?.collected),m.forEach((C,I)=>C.visible=!y.garden.gold[I]?.collected),g.forEach((C,I)=>C.visible=!A&&y.fluid.particles.some(N=>N.feedstock&&N.patchId===I)),S&&(S.visible=!A&&y.garden.phase==="title")},dispose(){i.remove(s),s.traverse(y=>y.geometry?.dispose());for(const{node:y}of w)y.remove();t.csgSolid&&Wx(t.csgSolid.revision),o.dispose(),a.dispose(),Object.values(c).forEach(y=>y.dispose()),e||r.dispose()}}}const b_=Object.freeze(Object.defineProperty({__proto__:null,createEditorStageView:b1,editorStageHitInfo:S1,resolveEditorSolidSource:Wh},Symbol.toStringTag,{value:"Module"}));class T1 extends He{constructor(t,e,n=!1,s=!1,r=1e4){const o=new ne;super(o,e),this.isMarchingCubes=!0;const a=this,c=new Float32Array(36),l=new Float32Array(36),h=new Float32Array(36);this.enableUvs=n,this.enableColors=s,this.init=function(v){this.resolution=v,this.isolation=80,this.size=v,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*3),this.count=0;const m=r*3;this.positionArray=new Float32Array(m*3);const g=new Se(this.positionArray,3);g.setUsage(35048),o.setAttribute("position",g),this.normalArray=new Float32Array(m*3);const S=new Se(this.normalArray,3);if(S.setUsage(35048),o.setAttribute("normal",S),this.enableUvs){this.uvArray=new Float32Array(m*2);const E=new Se(this.uvArray,2);E.setUsage(35048),o.setAttribute("uv",E)}if(this.enableColors){this.colorArray=new Float32Array(m*3);const E=new Se(this.colorArray,3);E.setUsage(35048),o.setAttribute("color",E)}o.boundingSphere=new _n(new D,1)};function u(v,m,g){return v+(m-v)*g}function f(v,m,g,S,E,w,A,T,b,y){const R=(g-A)/(T-A),C=a.normal_cache;c[m+0]=S+R*a.delta,c[m+1]=E,c[m+2]=w,l[m+0]=u(C[v+0],C[v+3],R),l[m+1]=u(C[v+1],C[v+4],R),l[m+2]=u(C[v+2],C[v+5],R),h[m+0]=u(a.palette[b*3+0],a.palette[y*3+0],R),h[m+1]=u(a.palette[b*3+1],a.palette[y*3+1],R),h[m+2]=u(a.palette[b*3+2],a.palette[y*3+2],R)}function d(v,m,g,S,E,w,A,T,b,y){const R=(g-A)/(T-A),C=a.normal_cache;c[m+0]=S,c[m+1]=E+R*a.delta,c[m+2]=w;const I=v+a.yd*3;l[m+0]=u(C[v+0],C[I+0],R),l[m+1]=u(C[v+1],C[I+1],R),l[m+2]=u(C[v+2],C[I+2],R),h[m+0]=u(a.palette[b*3+0],a.palette[y*3+0],R),h[m+1]=u(a.palette[b*3+1],a.palette[y*3+1],R),h[m+2]=u(a.palette[b*3+2],a.palette[y*3+2],R)}function x(v,m,g,S,E,w,A,T,b,y){const R=(g-A)/(T-A),C=a.normal_cache;c[m+0]=S,c[m+1]=E,c[m+2]=w+R*a.delta;const I=v+a.zd*3;l[m+0]=u(C[v+0],C[I+0],R),l[m+1]=u(C[v+1],C[I+1],R),l[m+2]=u(C[v+2],C[I+2],R),h[m+0]=u(a.palette[b*3+0],a.palette[y*3+0],R),h[m+1]=u(a.palette[b*3+1],a.palette[y*3+1],R),h[m+2]=u(a.palette[b*3+2],a.palette[y*3+2],R)}function M(v){const m=v*3;a.normal_cache[m]===0&&(a.normal_cache[m+0]=a.field[v-1]-a.field[v+1],a.normal_cache[m+1]=a.field[v-a.yd]-a.field[v+a.yd],a.normal_cache[m+2]=a.field[v-a.zd]-a.field[v+a.zd])}function _(v,m,g,S,E){const w=S+1,A=S+a.yd,T=S+a.zd,b=w+a.yd,y=w+a.zd,R=S+a.yd+a.zd,C=w+a.yd+a.zd;let I=0;const N=a.field[S],z=a.field[w],k=a.field[A],B=a.field[b],$=a.field[T],j=a.field[y],q=a.field[R],nt=a.field[C];N<E&&(I|=1),z<E&&(I|=2),k<E&&(I|=8),B<E&&(I|=4),$<E&&(I|=16),j<E&&(I|=32),q<E&&(I|=128),nt<E&&(I|=64);const ft=E1[I];if(ft===0)return 0;const ot=a.delta,W=v+ot,O=m+ot,H=g+ot;ft&1&&(M(S),M(w),f(S*3,0,E,v,m,g,N,z,S,w)),ft&2&&(M(w),M(b),d(w*3,3,E,W,m,g,z,B,w,b)),ft&4&&(M(A),M(b),f(A*3,6,E,v,O,g,k,B,A,b)),ft&8&&(M(S),M(A),d(S*3,9,E,v,m,g,N,k,S,A)),ft&16&&(M(T),M(y),f(T*3,12,E,v,m,H,$,j,T,y)),ft&32&&(M(y),M(C),d(y*3,15,E,W,m,H,j,nt,y,C)),ft&64&&(M(R),M(C),f(R*3,18,E,v,O,H,q,nt,R,C)),ft&128&&(M(T),M(R),d(T*3,21,E,v,m,H,$,q,T,R)),ft&256&&(M(S),M(T),x(S*3,24,E,v,m,g,N,$,S,T)),ft&512&&(M(w),M(y),x(w*3,27,E,W,m,g,z,j,w,y)),ft&1024&&(M(b),M(C),x(b*3,30,E,W,O,g,B,nt,b,C)),ft&2048&&(M(A),M(R),x(A*3,33,E,v,O,g,k,q,A,R)),I<<=4;let at,dt,ht,vt=0,Rt=0;for(;Zr[I+Rt]!=-1;)at=I+Rt,dt=at+1,ht=at+2,p(c,l,h,3*Zr[at],3*Zr[dt],3*Zr[ht]),Rt+=3,vt++;return vt}function p(v,m,g,S,E,w){const A=a.count*3;if(a.positionArray[A+0]=v[S],a.positionArray[A+1]=v[S+1],a.positionArray[A+2]=v[S+2],a.positionArray[A+3]=v[E],a.positionArray[A+4]=v[E+1],a.positionArray[A+5]=v[E+2],a.positionArray[A+6]=v[w],a.positionArray[A+7]=v[w+1],a.positionArray[A+8]=v[w+2],a.material.flatShading===!0){const T=(m[S+0]+m[E+0]+m[w+0])/3,b=(m[S+1]+m[E+1]+m[w+1])/3,y=(m[S+2]+m[E+2]+m[w+2])/3;a.normalArray[A+0]=T,a.normalArray[A+1]=b,a.normalArray[A+2]=y,a.normalArray[A+3]=T,a.normalArray[A+4]=b,a.normalArray[A+5]=y,a.normalArray[A+6]=T,a.normalArray[A+7]=b,a.normalArray[A+8]=y}else a.normalArray[A+0]=m[S+0],a.normalArray[A+1]=m[S+1],a.normalArray[A+2]=m[S+2],a.normalArray[A+3]=m[E+0],a.normalArray[A+4]=m[E+1],a.normalArray[A+5]=m[E+2],a.normalArray[A+6]=m[w+0],a.normalArray[A+7]=m[w+1],a.normalArray[A+8]=m[w+2];if(a.enableUvs){const T=a.count*2;a.uvArray[T+0]=v[S+0],a.uvArray[T+1]=v[S+2],a.uvArray[T+2]=v[E+0],a.uvArray[T+3]=v[E+2],a.uvArray[T+4]=v[w+0],a.uvArray[T+5]=v[w+2]}a.enableColors&&(a.colorArray[A+0]=g[S+0],a.colorArray[A+1]=g[S+1],a.colorArray[A+2]=g[S+2],a.colorArray[A+3]=g[E+0],a.colorArray[A+4]=g[E+1],a.colorArray[A+5]=g[E+2],a.colorArray[A+6]=g[w+0],a.colorArray[A+7]=g[w+1],a.colorArray[A+8]=g[w+2]),a.count+=3}this.addBall=function(v,m,g,S,E,w){const A=Math.sign(S);S=Math.abs(S);const T=w!=null;let b=new Ht(v,m,g);if(T)try{b=w instanceof Ht?w:Array.isArray(w)?new Ht(Math.min(Math.abs(w[0]),1),Math.min(Math.abs(w[1]),1),Math.min(Math.abs(w[2]),1)):new Ht(w)}catch{b=new Ht(v,m,g)}const y=this.size*Math.sqrt(S/E),R=g*this.size,C=m*this.size,I=v*this.size;let N=Math.floor(R-y);N<1&&(N=1);let z=Math.floor(R+y);z>this.size-1&&(z=this.size-1);let k=Math.floor(C-y);k<1&&(k=1);let B=Math.floor(C+y);B>this.size-1&&(B=this.size-1);let $=Math.floor(I-y);$<1&&($=1);let j=Math.floor(I+y);j>this.size-1&&(j=this.size-1);let q,nt,ft,ot,W,O,H,at,dt,ht,vt;for(ft=N;ft<z;ft++)for(W=this.size2*ft,at=ft/this.size-g,dt=at*at,nt=k;nt<B;nt++)for(ot=W+this.size*nt,H=nt/this.size-m,ht=H*H,q=$;q<j;q++)if(O=q/this.size-v,vt=S/(1e-6+O*O+ht+dt)-E,vt>0){this.field[ot+q]+=vt*A;const Rt=Math.sqrt((q-I)*(q-I)+(nt-C)*(nt-C)+(ft-R)*(ft-R))/y,F=1-Rt*Rt*Rt*(Rt*(Rt*6-15)+10);this.palette[(ot+q)*3+0]+=b.r*F,this.palette[(ot+q)*3+1]+=b.g*F,this.palette[(ot+q)*3+2]+=b.b*F}},this.addPlaneX=function(v,m){const g=this.size,S=this.yd,E=this.zd,w=this.field;let A,T,b,y,R,C,I,N=g*Math.sqrt(v/m);for(N>g&&(N=g),A=0;A<N;A++)if(C=A/g,y=C*C,R=v/(1e-4+y)-m,R>0)for(T=0;T<g;T++)for(I=A+T*S,b=0;b<g;b++)w[E*b+I]+=R},this.addPlaneY=function(v,m){const g=this.size,S=this.yd,E=this.zd,w=this.field;let A,T,b,y,R,C,I,N,z=g*Math.sqrt(v/m);for(z>g&&(z=g),T=0;T<z;T++)if(C=T/g,y=C*C,R=v/(1e-4+y)-m,R>0)for(I=T*S,A=0;A<g;A++)for(N=I+A,b=0;b<g;b++)w[E*b+N]+=R},this.addPlaneZ=function(v,m){const g=this.size,S=this.yd,E=this.zd,w=this.field;let A,T,b,y,R,C,I,N,z=g*Math.sqrt(v/m);for(z>g&&(z=g),b=0;b<z;b++)if(C=b/g,y=C*C,R=v/(1e-4+y)-m,R>0)for(I=E*b,T=0;T<g;T++)for(N=I+T*S,A=0;A<g;A++)w[N+A]+=R},this.setCell=function(v,m,g,S){const E=this.size2*g+this.size*m+v;this.field[E]=S},this.getCell=function(v,m,g){const S=this.size2*g+this.size*m+v;return this.field[S]},this.blur=function(v=1){const m=this.field,g=m.slice(),S=this.size,E=this.size2;for(let w=0;w<S;w++)for(let A=0;A<S;A++)for(let T=0;T<S;T++){const b=E*T+S*A+w;let y=g[b],R=1;for(let C=-1;C<=1;C+=2){const I=C+w;if(!(I<0||I>=S))for(let N=-1;N<=1;N+=2){const z=N+A;if(!(z<0||z>=S))for(let k=-1;k<=1;k+=2){const B=k+T;if(B<0||B>=S)continue;const $=E*B+S*z+I,j=g[$];R++,y+=v*(j-y)/R}}}m[b]=y}},this.reset=function(){for(let v=0;v<this.size3;v++)this.normal_cache[v*3]=0,this.field[v]=0,this.palette[v*3]=this.palette[v*3+1]=this.palette[v*3+2]=0},this.update=function(){this.count=0;const v=this.size-2;for(let m=1;m<v;m++){const g=this.size2*m,S=(m-this.halfsize)/this.halfsize;for(let E=1;E<v;E++){const w=g+this.size*E,A=(E-this.halfsize)/this.halfsize;for(let T=1;T<v;T++){const b=(T-this.halfsize)/this.halfsize,y=w+T;_(b,A,S,y,this.isolation)}}}this.geometry.setDrawRange(0,this.count),o.getAttribute("position").needsUpdate=!0,o.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(o.getAttribute("uv").needsUpdate=!0),this.enableColors&&(o.getAttribute("color").needsUpdate=!0),this.count/3>r&&console.warn("THREE.MarchingCubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const E1=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Zr=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);function A1(i,t=48,{filterColliders:e=!0}={}){const n=new T1(t,i,!1,!1,22e3);n.isolation=.72,n.frustumCulled=!1;const s=t,r=n.field;let o=null;function a(c,l,h=.067,{maskTerrain:u=!0}={}){const f=JSON.stringify(l.map(W=>W.type==="editor-solid-mesh"?{type:W.type,revision:W.revision}:W));if(o&&o.radius===h&&o.maskTerrain===u&&o.colliderKey===f&&o.particles.length===c.length&&c.every((W,O)=>W===o.particles[O]&&W.x===o.coords[O*3]&&W.y===o.coords[O*3+1]&&W.z===o.coords[O*3+2]))return;const x=new Float64Array(c.length*3);for(let W=0;W<c.length;W++){const O=c[W];x[W*3]=O.x,x[W*3+1]=O.y,x[W*3+2]=O.z}if(o={radius:h,maskTerrain:u,colliderKey:f,particles:[...c],coords:x},!c.length){n.reset(),n.update();return}const M=Math.max(.21,h*3.4);let _=1/0,p=-1/0,v=1/0,m=-1/0,g=1/0,S=-1/0;for(const W of c)_=Math.min(_,W.x),p=Math.max(p,W.x),v=Math.min(v,W.y),m=Math.max(m,W.y),g=Math.min(g,W.z),S=Math.max(S,W.z);const E=M+.1,w=Math.max(.55,(p-_)/2+E),A=Math.max(.42,(m-v)/2+E),T=Math.max(.55,(S-g)/2+E),b=(_+p)/2,y=(v+m)/2,R=(g+S)/2;n.position.set(b,y,R),n.scale.set(w,A,T);const C=e?l.filter(W=>W.type==="terraces"||W.type==="switchback"||W.type==="depth-terraces"||W.type==="grip-ramp"||W.type==="editor-stairs"||W.type==="funnel"||W.type==="pit"):l,I={minX:b-w,maxX:b+w,minY:y-A,maxY:y+A,minZ:R-T,maxZ:R+T},N=(W,O)=>!(Number.isFinite(W)&&Number.isFinite(O))||!(O<I.minX||W>I.maxX),z=(W,O)=>!(Number.isFinite(W)&&Number.isFinite(O))||!(O<I.minY||W>I.maxY),k=(W,O)=>!(Number.isFinite(W)&&Number.isFinite(O))||!(O<I.minZ||W>I.maxZ),B=e?l.filter(W=>W.type==="editor-solid-mesh"?!0:W.type==="box"||W.type==="roof"?N(W.minX,W.maxX)&&z(W.type==="roof"?W.bottom:W.minY,W.type==="roof"?W.top:W.maxY)&&k(W.minZ,W.maxZ):W.type==="cylinder"?N(W.x-W.radius,W.x+W.radius)&&z(W.base??0,W.height)&&k(W.z-W.radius,W.z+W.radius):!1):l;n.reset();const $=(W,O,H)=>Math.floor(((W-O)/H+1)*s/2),j=2*w/s,q=2*A/s,nt=2*T/s,ft=M*M;for(const W of c){const O=Math.max(1,$(W.x-M,b,w)),H=Math.min(s-2,$(W.x+M,b,w)+1),at=Math.max(1,$(W.y-M,y,A)),dt=Math.min(s-2,$(W.y+M,y,A)+1),ht=Math.max(1,$(W.z-M,R,T)),vt=Math.min(s-2,$(W.z+M,R,T)+1);for(let Rt=ht;Rt<=vt;Rt++){const F=R-T+Rt*nt-W.z,rt=F*F;if(!(rt>=ft))for(let st=at;st<=dt;st++){const it=y-A+st*q-W.y,tt=rt+it*it;if(tt>=ft)continue;const yt=Rt*s*s+st*s;for(let G=O;G<=H;G++){const ct=b-w+G*j-W.x,Mt=1-(tt+ct*ct)/ft;Mt>0&&(r[yt+G]+=Mt*Mt)}}}}const ot=u?new Float64Array(s*s).fill(NaN):null;for(let W=1;W<s-1;W++)for(let O=1;O<s-1;O++)for(let H=1;H<s-1;H++){const at=W*s*s+O*s+H;if(r[at]<n.isolation*.2)continue;const dt=b-w+H*j,ht=y-A+O*q,vt=R-T+W*nt;let Rt=!1;if(u){const F=W*s+H;let rt=ot[F];Number.isNaN(rt)&&(rt=ce(dt,vt,C).height,ot[F]=rt),Rt=ht<rt+.01}(Rt||qx(dt,ht,vt,B,.012))&&(r[at]=0)}n.update()}return{mesh:n,update:a}}const w1=()=>new Worker(new URL("/puddle-study/assets/particle-surface-worker-DbFXChii.js",import.meta.url),{type:"module"});function T_({createWorker:i=typeof Worker>"u"?null:w1}={}){const t=new Map,e=new Map;let n=null,s=!i,r=null,o=0,a=1,c=1,l=0;const h=new Set,u={completed:0,bodyCompleted:0,discarded:0,failed:0,buildMs:0,lastAgeMs:0,bodyAgeMs:0,bodyBuildMs:0};function f(){if(!s){if(s=!0,n?.terminate(),n=null,r&&r.generation===o){const p=t.get(r.surfaceId);p&&p.sync.update(r.particles,r.originalColliders,r.radius,{maskTerrain:r.maskTerrain})}r=null;for(const[p,v]of e){const m=t.get(p);m&&m.sync.update(v.particles,v.originalColliders,v.radius,{maskTerrain:v.maskTerrain})}for(const p of t.values())p.completedCentroid=null,p.completedPosition=null;e.clear()}}if(!s)try{n=i(),n.onmessage=({data:p})=>{if(!r||p.id!==r.id)return;const v=r;if(p.error){u.failed++,f();return}if(r=null,p.generation!==o||!t.has(p.surfaceId))u.discarded++;else{const m=t.get(p.surfaceId),g=m.mesh,S=g.geometry.attributes.position,E=g.geometry.attributes.normal;S.array.set(p.positions,0),E.array.set(p.normals,0),S.clearUpdateRanges(),E.clearUpdateRanges(),S.addUpdateRange(0,p.count*3),E.addUpdateRange(0,p.count*3),S.needsUpdate=!0,E.needsUpdate=!0,g.count=p.count,g.geometry.setDrawRange(0,p.count),g.position.fromArray(p.position),g.scale.fromArray(p.scale),m.completedCentroid=v.centroid,m.completedPosition=p.position,m.completedAt=performance.now(),u.completed++,u.buildMs=p.buildMs,u.lastAgeMs=m.completedAt-v.queuedAt,m.priority===0&&(u.bodyCompleted++,u.bodyAgeMs=u.lastAgeMs,u.bodyBuildMs=p.buildMs)}d()},n.onerror=()=>{u.failed++,f()},n.onmessageerror=()=>{u.failed++,f()}}catch{f()}function d(){if(s||r||!e.size)return;const p=[...e.values()].sort((m,g)=>m.priority-g.priority||m.queuedAt-g.queuedAt),v=l>=4&&p.some(m=>m.priority>0)?p.find(m=>m.priority>0):p[0];l=v.priority===0?l+1:0,e.delete(v.surfaceId),r=v;try{n.postMessage({type:"build",id:v.id,generation:v.generation,surfaceId:v.surfaceId,resolution:v.resolution,coords:v.coords,colliders:v.colliders,radius:v.radius,maskTerrain:v.maskTerrain,sentAt:performance.now()},[v.coords.buffer])}catch{u.failed++,f()}}function x(p,v=48,{priority:m=1}={}){const g=A1(p,v),S=c++,E={mesh:g.mesh,sync:g,completedCentroid:null,completedPosition:null,completedAt:0,priority:m,update(w,A,T=.067,{maskTerrain:b=!0}={}){if(s){g.update(w,A,T,{maskTerrain:b});return}const y=A.map($=>$.type==="editor-solid-mesh"?{type:$.type,revision:$.revision}:$),R=JSON.stringify(y),C=E.previous;if(C&&C.radius===T&&C.maskTerrain===b&&C.colliderKey===R&&C.particles.length===w.length&&w.every(($,j)=>$===C.particles[j]&&$.x===C.coords[j*3]&&$.y===C.coords[j*3+1]&&$.z===C.coords[j*3+2]))return;const I=new Float64Array(w.length*3);let N=0,z=0,k=0;for(let $=0;$<w.length;$++){const j=w[$];I[$*3]=j.x,I[$*3+1]=j.y,I[$*3+2]=j.z,N+=j.x,z+=j.y,k+=j.z}const B=w.length||1;E.previous={radius:T,maskTerrain:b,colliderKey:R,particles:[...w],coords:I.slice()};for(const $ of A)if($.type==="editor-solid-mesh"&&!h.has($.revision)){h.add($.revision);const j=$.vertices.slice(),q=$.indices.slice();try{n.postMessage({type:"register-solid",revision:$.revision,vertices:j,indices:q},[j.buffer,q.buffer])}catch{u.failed++,f();return}}e.set(S,{id:a++,generation:o,surfaceId:S,resolution:v,coords:I,colliders:y,originalColliders:A,radius:T,maskTerrain:b,priority:m,queuedAt:performance.now(),centroid:{x:N/B,y:z/B,z:k/B},particles:w}),d()},dispose(){e.delete(S),t.delete(S),g.mesh.geometry.dispose()}};return t.set(S,E),E}function M(){if(o++,e.clear(),l=0,h.clear(),n&&!s)try{n.postMessage({type:"clear-solids"})}catch{u.failed++,f()}for(const p of t.values())p.previous=null,p.completedCentroid=null,p.completedPosition=null,p.mesh.count=0,p.mesh.geometry.setDrawRange(0,0)}function _(){o++,e.clear(),n?.terminate(),n=null;for(const p of[...t.values()])p.dispose();t.clear(),s=!0}return{create:x,invalidate:M,dispose:_,stats:u,get workerEnabled(){return!s},get pendingCount(){return e.size+(r?1:0)}}}class E_{constructor(t,e=220){this.onTap=t,this.threshold=e,this.cancel()}down(t,e){this.sources.has(t)||(this.sources.size||(this.started=e,this.holding=!1),this.sources.add(t))}update(t){return this.sources.size&&t-this.started>=this.threshold&&(this.holding=!0),this.sources.size>0&&this.holding}up(t,e){this.sources.has(t)&&(this.update(e),this.sources.delete(t),this.sources.size||(this.holding||this.onTap(),this.holding=!1))}cancelSource(t){this.sources.delete(t)&&(this.sources.size||(this.started=0,this.holding=!1))}cancel(){this.sources=new Set,this.started=0,this.holding=!1}}function A_(i,t,e,n,s){return i==="gap"?{x:t,z:-e}:{x:n.x*t+s.x*e,z:n.z*t+s.z*e}}function w_(){const i=document.querySelector("#soundtrack"),t=document.querySelector("#music-toggle"),e=document.querySelector("#music-volume"),n=document.querySelector("#music-status");i.src="/puddle-study/audio/soft-signal.mp3",i.volume=Number(e.value)/100;let s=!1,r=0,o=!1;function a(x){t.textContent=s?"MUSIC ON":"MUSIC OFF",t.setAttribute("aria-pressed",String(s)),n.textContent=x||(s?"Soft Signal · playing":"Soft Signal · tap to listen")}async function c(){const x=++r;a("Soft Signal · loading");try{if(i.error&&i.load(),await i.play(),x!==r){(!s||document.hidden)&&i.pause();return}a()}catch{if(x!==r)return;s=!1,i.pause(),a("Tap Music to retry playback")}}function l(){o=!0,s=!s,s?c():(r++,i.pause(),a())}function h(){i.volume=Number(e.value)/100}function u(){document.hidden?(r++,i.pause(),s&&a("Soft Signal · paused while away")):s&&c()}function f(){r++,s=!1,i.pause(),a("Music unavailable · tap to retry")}t.addEventListener("click",l),e.addEventListener("input",h),document.addEventListener("visibilitychange",u),i.addEventListener("error",f),a();const d=()=>{r++,s=!1,i.pause(),t.removeEventListener("click",l),e.removeEventListener("input",h),document.removeEventListener("visibilitychange",u),i.removeEventListener("error",f)};return d.begin=()=>{o||(s=!0),s&&i.paused&&c()},d}function R_(){let i=null,t=null,e=!0,n=null,s=new Set;const r=document.createElement("button");r.id="effects-toggle",r.title="Pickup sounds",r.textContent="SOUND ON",r.setAttribute("aria-pressed","true"),document.querySelector(".music-controls").append(r);function o(){const h=window.AudioContext||window.webkitAudioContext;h&&(i||(i=new h,t=i.createGain(),t.gain.value=e?1:0,t.connect(i.destination)),i.state==="suspended"&&i.resume().catch(()=>{}))}function a(){e=!e,r.textContent=e?"SOUND ON":"SOUND OFF",r.setAttribute("aria-pressed",String(e)),e&&o(),t&&t.gain.setValueAtTime(e?1:0,i.currentTime)}r.addEventListener("click",a);function c(h,u,f,d,x=1){const M=i.createOscillator(),_=i.createGain();M.type="sine",M.frequency.setValueAtTime(h*x,u),M.frequency.exponentialRampToValueAtTime(h,u+.065),_.gain.setValueAtTime(0,u),_.gain.linearRampToValueAtTime(d,u+.012),_.gain.exponentialRampToValueAtTime(1e-4,u+f),M.connect(_),_.connect(t),M.start(u),M.stop(u+f+.025),M.onended=()=>{M.disconnect(),_.disconnect()}}function l(h,u,f){if(!e||!i||i.state!=="running"||document.hidden)return;const d=i.currentTime+f,x=[587.33,880,932.33,659.25,587.33];if(h==="gold"){const M=x[u%x.length];c(M,d,.2,.045,1.18),c(M/2,d,.12,.022,.7)}else[293.66,440,466.16,659.25,587.33].forEach((M,_)=>c(M,d+_*.065,.55,.04,1.025)),c(146.83,d,.42,.035,.65)}return{unlock:o,update(h){if(h!==n&&(n=h,s=new Set),!h)return;let u=0;for(const[f,d]of[["gold",h.gold],["gem",h.gems]])for(const x of d){const M=`${f}-${x.id}`;x.collected&&!s.has(M)&&(s.add(M),h.elapsed-x.collectedAt<.3&&(l(f,x.id,u),u+=.035))}},dispose(){r.removeEventListener("click",a),r.remove(),i&&i.close()}}}const R1="puddle.local-levels.v1",C1="puddle.local-progress.v1",P1=["puddle-level-workshop-v3","puddle-level-workshop-v2","puddle-level-workshop-v1"],Ps=i=>JSON.parse(JSON.stringify(i)),hc=()=>{try{return globalThis.localStorage}catch{return null}};function C_(i=globalThis.location?.search||""){const t=new URLSearchParams(i),e=t.get("storage");if(e==="memory")return null;const n=hc();if(e!=="test")return n;const s=(t.get("session")||"local-level-qa").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,60);return n?{getItem:r=>n.getItem(`puddle.test.${s}.${r}`),setItem:(r,o)=>n.setItem(`puddle.test.${s}.${r}`,o),removeItem:r=>n.removeItem(`puddle.test.${s}.${r}`)}:null}function P_(i=globalThis.location?.search||""){const t=new URLSearchParams(i);return t.get("storage")==="test"?`?storage=test&session=${encodeURIComponent(t.get("session")||"local-level-qa")}`:t.get("storage")==="memory"?"?storage=memory":""}const I1=()=>globalThis.crypto?.randomUUID?.()||`local-${Date.now()}-${Math.random().toString(36).slice(2)}`,L1=i=>i&&typeof i.id=="string"&&i.id.length>0&&typeof i.document=="string"&&Number.isInteger(i.revision)&&i.revision>0&&typeof i.name=="string",Ta=i=>{const t=JSON.parse(i);if(t?.format!=="puddle-level"||![1,2,3].includes(t.version))throw new Error("Save a Puddle workshop level.");const e=t.draft||t.level;if(!e||typeof e!="object")throw new Error("The level has no source draft.");const n=String(e.name||"Untitled garden").trim().slice(0,60)||"Untitled garden",s=Ps(e);return delete s.name,s.targetTime===void 0&&(s.targetTime=Ha),Array.isArray(s.objects)&&(s.objects=s.objects.filter(r=>r.kind!=="label")),delete s.nextObjectId,{name:n,fingerprint:JSON.stringify(s)}};function I_({storage:i=hc(),key:t=R1,legacyKeys:e=P1,idFactory:n=I1,now:s=()=>Date.now()}={}){let r={version:1,migratedDraft:!1,entries:[]},o="";const a=()=>{try{const l=i?.getItem(t);if(!l||l===o)return;const h=JSON.parse(l);if(h?.version===1&&Array.isArray(h.entries)){const u=new Set;r={version:1,migratedDraft:!!h.migratedDraft,entries:h.entries.filter(f=>!L1(f)||u.has(f.id)?!1:(u.add(f.id),!0))},o=l}}catch{}},c=()=>{const l=JSON.stringify(r);if(l===o)return!0;try{return i?.setItem(t,l),i&&(o=l),!!i}catch{return!1}};if(a(),!r.migratedDraft){let l=null;try{for(const h of e)if(l=i?.getItem(h),l)break}catch{}if(l)try{const h=Ta(l),u=s();r.entries.push({id:n(),name:h.name,createdAt:u,updatedAt:u,revision:1,document:l}),r.migratedDraft=!0,c()}catch{}else r.migratedDraft=!0,c()}return{list(){return a(),r.entries.map(l=>Ps(l)).sort((l,h)=>h.updatedAt-l.updatedAt||l.name.localeCompare(h.name))},get(l){a();const h=r.entries.find(u=>u.id===l);return h?Ps(h):null},save(l,{id:h=null,asNew:u=!1}={}){const f=Ta(l);a();const d=s(),x=!u&&h?r.entries.find(_=>_.id===h):null;if(h&&!u&&!x)throw new Error("That local level no longer exists. Save as new instead.");if(x){const _=Ta(x.document);if(x.revision+=+(_.fingerprint!==f.fingerprint),x.name=f.name,x.updatedAt=d,x.document=l,!c())throw new Error("Local storage is unavailable; export JSON instead.");return Ps(x)}const M={id:n(),name:f.name,createdAt:d,updatedAt:d,revision:1,document:l};for(;r.entries.some(_=>_.id===M.id);)M.id=n();if(r.entries.push(M),!c())throw new Error("Local storage is unavailable; export JSON instead.");return Ps(M)},refresh(){return a(),this.list()}}}function L_({storage:i=hc(),key:t=C1}={}){let e={};try{const a=JSON.parse(i?.getItem(t)||"null");[1,2].includes(a?.version)&&a.best&&typeof a.best=="object"&&(e=a.best)}catch{}let n=!1;const s=a=>({...a,...a?.elapsed!==void 0?{target:a.target===void 0?Ha:a.target}:{}}),r=a=>uo(s(a))?.percent??null,o=(a,c)=>`${a}:${c}`;return{get saveFailed(){return n},getBest(a,c){const l=e[o(a,c)];return r(l)===null?null:{...l,...uo(s(l))}},recordCompletion(a,c,l){if(!a||!Number.isInteger(c)||c<1||r(l)===null)return!1;const h=o(a,c),u=e[h];if(!Jx(s(l),u&&s(u)))return!1;e[h]={gold:l.gold,gems:l.gems,totalGold:l.totalGold,totalGems:l.totalGems,...Number.isFinite(l.elapsed)?{elapsed:l.elapsed,target:l.target??Ha}:{}};try{if(!i?.setItem)throw new Error("storage unavailable");return i.setItem(t,JSON.stringify({version:2,best:e})),n=!1,!0}catch{return n=!0,!1}}}}class D_{constructor({onDoubleTap:t=()=>{},onChange:e=()=>{},deadzone:n=10,radius:s=48,tapMs:r=220,doubleMs:o=300,tapDistance:a=28}={}){Object.assign(this,{onDoubleTap:t,onChange:e,deadzone:n,radius:s,tapMs:r,doubleMs:o,tapDistance:a}),this.cancel()}down(t,e,n,s){return this.touches.has(t)?!1:(this.touches.set(t,{x:e,y:n,startX:e,startY:n,started:s,dragged:!1}),this.owner===null&&(this.owner=t,this.origin={x:e,y:n},this.vector={x:0,y:0},this.onChange(this)),!0)}move(t,e,n){const s=this.touches.get(t);if(!s||(s.x=e,s.y=n,Math.hypot(e-s.startX,n-s.startY)>this.deadzone&&(s.dragged=!0),t!==this.owner))return;const r=e-this.origin.x,o=n-this.origin.y,a=Math.hypot(r,o);this.vector=a<=this.deadzone?{x:0,y:0}:{x:r/a,y:o/a},this.onChange(this)}up(t,e,n,s){const r=this.touches.get(t);if(r){if(this.move(t,e,n),this.touches.delete(t),t===this.owner&&(this.owner=null,this.vector={x:0,y:0},this.onChange(this)),r.dragged||s-r.started>this.tapMs){this.lastTap=null;return}this.lastTap&&s-this.lastTap.time<=this.doubleMs&&Math.hypot(e-this.lastTap.x,n-this.lastTap.y)<=this.tapDistance?(this.lastTap=null,this.onDoubleTap(e,n)):this.lastTap={x:e,y:n,time:s}}}cancel(t){if(t===void 0)this.touches=new Map,this.owner=null,this.origin=null,this.vector={x:0,y:0},this.lastTap=null;else{if(!this.touches.has(t))return;this.touches.delete(t),this.owner===t&&(this.owner=null,this.origin=null,this.vector={x:0,y:0}),this.lastTap=null}this.onChange(this)}}function U_(i,t){const e=new Set;i.addEventListener("pointerdown",n=>{t()&&(n.preventDefault(),e.add(n.pointerId),i.setPointerCapture(n.pointerId))});for(const n of["pointerup","pointercancel","lostpointercapture"])i.addEventListener(n,s=>e.delete(s.pointerId));return{get active(){return e.size>0},clear(){e.clear()}}}function N_(i,t,e,n=()=>performance.now()){const s=new Set,r=o=>`pointer-${o}`;i.addEventListener("pointerdown",o=>{e()&&(o.preventDefault(),s.add(o.pointerId),t.down(r(o.pointerId),n()),i.setPointerCapture(o.pointerId))}),i.addEventListener("pointerup",o=>{s.delete(o.pointerId)&&(e()?t.up(r(o.pointerId),n()):t.cancelSource(r(o.pointerId)))});for(const o of["pointercancel","lostpointercapture"])i.addEventListener(o,a=>{s.delete(a.pointerId)&&t.cancelSource(r(a.pointerId))});return{clear(){for(const o of s)t.cancelSource(r(o));s.clear()}}}const sh=13,Ea=24,ws=.68,rh=(i,t,e)=>Math.max(t,Math.min(e,i));function F_(i){const t=new Yi;i.add(t);const e=new Xs(1,8,6),n=new Xs(1,7,5),s=new me({color:16777215,transparent:!0,opacity:.82,depthWrite:!1}),r=new me({color:7431006,transparent:!0,opacity:.42,depthWrite:!1}),o=new Zc(e,s,sh),a=new Zc(n,r,Ea);o.count=a.count=0,o.frustumCulled=a.frustumCulled=!1,o.renderOrder=7,a.renderOrder=8,t.add(o,a);const c=new xe,l=new Ht(16739111),h=new Ht(16768374),u=Array.from({length:Ea},()=>({age:ws,x:0,y:0,z:0,drift:0}));let f=null,d=0,x=0,M=0,_=0;const p=()=>{for(const g of u)g.age=ws;o.count=a.count=0,x=0};function v(g,{active:S=!0,offsetY:E=0}={}){if(!S||!g||g.selectedTest!=="garden"||g.garden?.phase!=="playing"){p(),f=g?.fluid||null,d=f?.time||0;return}f!==g.fluid&&(p(),f=g.fluid,d=f.time);const w=rh(f.time-d,0,.1);d=f.time;const A=g.garden.burnSites||[],T=g.garden.coreBurn||0;for(const R of u)R.age=Math.min(ws,R.age+w);A.length||T>0?x+=w:x=0;let b=0;for(;x>=.055&&b<3&&(A.length||T>0);){x-=.055,b++;const R=T>0&&_%3===0?g.brain:A[_%A.length]||g.brain,C=u[M];M=(M+1)%Ea;const I=_++*2.39996;C.age=0,C.x=R.x+Math.cos(I)*.07*g.size,C.y=R.y+.13*g.size,C.z=R.z+Math.sin(I)*.07*g.size,C.drift=Math.sin(I)*.14}let y=0;for(let R=0;R<A.length&&y<sh-1;R++){const C=A[R],I=.82+.18*Math.sin(f.time*33+R*1.7);c.position.set(C.x,C.y+.075*g.size,C.z),c.scale.set(.19*g.size*I,.1*g.size*I,.19*g.size*I),c.updateMatrix(),o.setMatrixAt(y,c.matrix),o.setColorAt(y,l),y++}if(T>0){const R=.92+.16*Math.sin(f.time*41),C=g.size*(.19+.11*rh(T/.35,0,1));c.position.set(g.brain.x,g.brain.y,g.brain.z),c.scale.setScalar(C*R),c.updateMatrix(),o.setMatrixAt(y,c.matrix),o.setColorAt(y,h),y++}o.count=y,y&&(o.instanceMatrix.needsUpdate=!0,o.instanceColor.needsUpdate=!0),y=0;for(const R of u){if(R.age>=ws)continue;const C=R.age/ws,I=g.size*(.065+.15*C)*(1-C)**2;c.position.set(R.x+R.drift*C,R.y+.42*g.size*C,R.z),c.scale.setScalar(I),c.updateMatrix(),a.setMatrixAt(y++,c.matrix)}a.count=y,y&&(a.instanceMatrix.needsUpdate=!0),t.position.y=E}function m(){i.remove(t),e.dispose(),n.dispose(),s.dispose(),r.dispose()}return{group:t,flashes:o,smoke:a,update:v,clear:p,dispose:m}}export{M_ as $,p_ as A,Ln as B,Ht as C,eh as D,zs as E,nn as F,Yi as G,io as H,no as I,Rh as J,ne as K,Zt as L,me as M,Zn as N,ji as O,Ke as P,S_ as Q,f_ as R,J1 as S,D_ as T,gh as U,D as V,d_ as W,_1 as X,Jo as Y,mi as Z,Ja as _,P_ as a,Ch as a$,so as a0,N1 as a1,Xh as a2,lc as a3,po as a4,Jn as a5,Se as a6,Y1 as a7,$1 as a8,q1 as a9,Qn as aA,Pf as aB,oe as aC,j1 as aD,Q1 as aE,t_ as aF,Dh as aG,mh as aH,s_ as aI,Gu as aJ,W1 as aK,Z1 as aL,ph as aM,Ue as aN,ao as aO,oo as aP,go as aQ,Qt as aR,D1 as aS,mo as aT,Le as aU,_n as aV,Pn as aW,e1 as aX,n1 as aY,i1 as aZ,s1 as a_,Ws as aa,h_ as ab,r_ as ac,e_ as ad,Qi as ae,a_ as af,c_ as ag,l_ as ah,Xt as ai,Zc as aj,rs as ak,Hc as al,xe as am,Wf as an,u_ as ao,K1 as ap,X1 as aq,V1 as ar,H1 as as,k1 as at,G1 as au,O1 as av,F1 as aw,B1 as ax,z1 as ay,qu as az,F_ as b,U1 as b0,Ku as b1,Ph as b2,$x as b3,Jx as b4,uo as b5,th as b6,Kx as b7,L_ as b8,v_ as b9,y_ as ba,As as bb,gn as bc,Fs as bd,ze as be,n_ as bf,o_ as bg,Wi as bh,i_ as bi,In as bj,m_ as bk,Ha as bl,Zs as bm,Wx as bn,Fn as bo,b_ as bp,I_ as c,Je as d,M1 as e,Xs as f,ro as g,He as h,T_ as i,R_ as j,E_ as k,C_ as l,N_ as m,U_ as n,pt as o,Rn as p,ce as q,is as r,w_ as s,b1 as t,A_ as u,bo as v,g_ as w,__ as x,x_ as y,S1 as z};
