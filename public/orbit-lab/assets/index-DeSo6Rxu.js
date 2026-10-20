(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();function gf({state:i,held:t=!1,wellCount:e=0}){return i==="ready"?{label:"Start",action:"start",disabled:!1}:i==="paused"?{label:"Resume",action:"resume",disabled:!1}:i!=="running"?{label:"Start",action:null,disabled:!0}:t?{label:"Release",action:"release",disabled:!1}:{label:"Remove well",action:e?"remove":null,disabled:!e}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ch="180",xm=0,Lu=1,ym=2,vf=1,xf=2,Ni=3,ds=0,Mn=1,Cn=2,ls=0,Sr=1,mn=2,Iu=3,Du=4,_m=5,Ls=100,Mm=101,Sm=102,wm=103,bm=104,Em=200,Tm=201,Am=202,Cm=203,Sc=204,wc=205,Rm=206,Pm=207,Lm=208,Im=209,Dm=210,Nm=211,Um=212,Fm=213,Om=214,bc=0,Ec=1,Tc=2,Ar=3,Ac=4,Cc=5,Rc=6,Pc=7,yf=0,Bm=1,zm=2,cs=0,km=1,Gm=2,Hm=3,_f=4,Vm=5,Wm=6,Xm=7,Mf=300,Cr=301,Rr=302,Lc=303,Ic=304,al=306,Dc=1e3,Us=1001,Nc=1002,Pn=1003,qm=1004,Zo=1005,zn=1006,Al=1007,Fs=1008,gi=1009,Sf=1010,wf=1011,uo=1012,Rh=1013,zs=1014,Oi=1015,No=1016,Ph=1017,Lh=1018,fo=1020,bf=35902,Ef=35899,Tf=1021,Af=1022,jn=1023,po=1026,mo=1027,Cf=1028,Ih=1029,Rf=1030,Dh=1031,Nh=1033,za=33776,ka=33777,Ga=33778,Ha=33779,Uc=35840,Fc=35841,Oc=35842,Bc=35843,zc=36196,kc=37492,Gc=37496,Hc=37808,Vc=37809,Wc=37810,Xc=37811,qc=37812,Yc=37813,$c=37814,jc=37815,Zc=37816,Kc=37817,Jc=37818,Qc=37819,th=37820,eh=37821,nh=36492,ih=36494,sh=36495,rh=36283,oh=36284,ah=36285,lh=36286,Ym=3200,$m=3201,Pf=0,jm=1,ss="",_n="srgb",Pr="srgb-linear",ja="linear",_e="srgb",Zs=7680,Nu=519,Zm=512,Km=513,Jm=514,Lf=515,Qm=516,tg=517,eg=518,ng=519,ch=35044,vi=35048,Uu="300 es",di=2e3,Za=2001;class Br{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fu=1234567;const wr=Math.PI/180,go=180/Math.PI;function fi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]+"-"+rn[t&255]+rn[t>>8&255]+"-"+rn[t>>16&15|64]+rn[t>>24&255]+"-"+rn[e&63|128]+rn[e>>8&255]+"-"+rn[e>>16&255]+rn[e>>24&255]+rn[n&255]+rn[n>>8&255]+rn[n>>16&255]+rn[n>>24&255]).toLowerCase()}function Qt(i,t,e){return Math.max(t,Math.min(e,i))}function Uh(i,t){return(i%t+t)%t}function ig(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function sg(i,t,e){return i!==t?(e-i)/(t-i):0}function lo(i,t,e){return(1-e)*i+e*t}function rg(i,t,e,n){return lo(i,t,1-Math.exp(-e*n))}function og(i,t=1){return t-Math.abs(Uh(i,t*2)-t)}function ag(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function lg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function cg(i,t){return i+Math.floor(Math.random()*(t-i+1))}function hg(i,t){return i+Math.random()*(t-i)}function ug(i){return i*(.5-Math.random())}function dg(i){i!==void 0&&(Fu=i);let t=Fu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function fg(i){return i*wr}function pg(i){return i*go}function mg(i){return(i&i-1)===0&&i!==0}function gg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function vg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function xg(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $n(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const yg={DEG2RAD:wr,RAD2DEG:go,generateUUID:fi,clamp:Qt,euclideanModulo:Uh,mapLinear:ig,inverseLerp:sg,lerp:lo,damp:rg,pingpong:og,smoothstep:ag,smootherstep:lg,randInt:cg,randFloat:hg,randFloatSpread:ug,seededRandom:dg,degToRad:fg,radToDeg:pg,isPowerOfTwo:mg,ceilPowerOfTwo:gg,floorPowerOfTwo:vg,setQuaternionFromProperEuler:xg,normalize:ge,denormalize:$n};class mt{constructor(t=0,e=0){mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}let Uo=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],f=r[o+1],p=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=v;return}if(h!==v||l!==d||c!==f||u!==p){let g=1-a;const m=l*d+c*f+u*p+h*v,x=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const C=Math.sqrt(M),T=Math.atan2(C,m*x);g=Math.sin(g*T)/C,a=Math.sin(a*T)/C}const _=a*x;if(l=l*g+d*_,c=c*g+f*_,u=u*g+p*_,h=h*g+v*_,g===1-a){const C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+u*h+l*f-c*d,t[e+1]=l*p+u*d+c*h-a*f,t[e+2]=c*p+u*f+a*d-l*h,t[e+3]=u*p-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Qt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class z{constructor(t=0,e=0,n=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ou.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ou.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Cl.copy(this).projectOnVector(t),this.sub(Cl)}reflect(t){return this.sub(Cl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Cl=new z,Ou=new Uo;class Yt{constructor(t,e,n,s,r,o,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],v=s[0],g=s[3],m=s[6],x=s[1],M=s[4],_=s[7],C=s[2],T=s[5],P=s[8];return r[0]=o*v+a*x+l*C,r[3]=o*g+a*M+l*T,r[6]=o*m+a*_+l*P,r[1]=c*v+u*x+h*C,r[4]=c*g+u*M+h*T,r[7]=c*m+u*_+h*P,r[2]=d*v+f*x+p*C,r[5]=d*g+f*M+p*T,r[8]=d*m+f*_+p*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,p=e*h+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return t[0]=h*v,t[1]=(s*c-u*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(u*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Rl.makeScale(t,e)),this}rotate(t){return this.premultiply(Rl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Rl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Rl=new Yt;function If(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ka(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _g(){const i=Ka("canvas");return i.style.display="block",i}const Bu={};function vo(i){i in Bu||(Bu[i]=!0,console.warn(i))}function Mg(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const zu=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ku=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Sg(){const i={enabled:!0,workingColorSpace:Pr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===_e&&(s.r=Gi(s.r),s.g=Gi(s.g),s.b=Gi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_e&&(s.r=br(s.r),s.g=br(s.g),s.b=br(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ss?ja:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return vo("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return vo("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Pr]:{primaries:t,whitePoint:n,transfer:ja,toXYZ:zu,fromXYZ:ku,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:_n},outputColorSpaceConfig:{drawingBufferColorSpace:_n}},[_n]:{primaries:t,whitePoint:n,transfer:_e,toXYZ:zu,fromXYZ:ku,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:_n}}}),i}const ce=Sg();function Gi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ks;class wg{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ks===void 0&&(Ks=Ka("canvas")),Ks.width=t.width,Ks.height=t.height;const s=Ks.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ks}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ka("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Gi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Gi(e[n]/255)*255):e[n]=Gi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let bg=0;class Fh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bg++}),this.uuid=fi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Pl(s[o].image)):r.push(Pl(s[o]))}else r=Pl(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Pl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Eg=0;const Ll=new z;class an extends Br{constructor(t=an.DEFAULT_IMAGE,e=an.DEFAULT_MAPPING,n=Us,s=Us,r=zn,o=Fs,a=jn,l=gi,c=an.DEFAULT_ANISOTROPY,u=ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Eg++}),this.uuid=fi(),this.name="",this.source=new Fh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ll).x}get height(){return this.source.getSize(Ll).y}get depth(){return this.source.getSize(Ll).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Mf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Dc:t.x=t.x-Math.floor(t.x);break;case Us:t.x=t.x<0?0:1;break;case Nc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Dc:t.y=t.y-Math.floor(t.y);break;case Us:t.y=t.y<0?0:1;break;case Nc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Mf;an.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,s=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(f+1)/2,C=(m+1)/2,T=(u+d)/4,P=(h+v)/4,U=(p+g)/4;return M>_&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=P/n):_>C?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=T/s,r=U/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=P/r,s=U/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-p)*(g-p)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(x)<.001&&(x=1),this.x=(g-p)/x,this.y=(h-v)/x,this.z=(d-u)/x,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Qt(this.x,t.x,e.x),this.y=Qt(this.y,t.y,e.y),this.z=Qt(this.z,t.z,e.z),this.w=Qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Qt(this.x,t,e),this.y=Qt(this.y,t,e),this.z=Qt(this.z,t,e),this.w=Qt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tg extends Br{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new an(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:zn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Fh(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ks extends Tg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Df extends an{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ag extends an{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fo{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Wn):Wn.fromBufferAttribute(r,o),Wn.applyMatrix4(t.matrixWorld),this.expandByPoint(Wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ko.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ko.copy(n.boundingBox)),Ko.applyMatrix4(t.matrixWorld),this.union(Ko)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Wn),Wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),Jo.subVectors(this.max,Wr),Js.subVectors(t.a,Wr),Qs.subVectors(t.b,Wr),tr.subVectors(t.c,Wr),Ki.subVectors(Qs,Js),Ji.subVectors(tr,Qs),Ms.subVectors(Js,tr);let e=[0,-Ki.z,Ki.y,0,-Ji.z,Ji.y,0,-Ms.z,Ms.y,Ki.z,0,-Ki.x,Ji.z,0,-Ji.x,Ms.z,0,-Ms.x,-Ki.y,Ki.x,0,-Ji.y,Ji.x,0,-Ms.y,Ms.x,0];return!Il(e,Js,Qs,tr,Jo)||(e=[1,0,0,0,1,0,0,0,1],!Il(e,Js,Qs,tr,Jo))?!1:(Qo.crossVectors(Ki,Ji),e=[Qo.x,Qo.y,Qo.z],Il(e,Js,Qs,tr,Jo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ei=[new z,new z,new z,new z,new z,new z,new z,new z],Wn=new z,Ko=new Fo,Js=new z,Qs=new z,tr=new z,Ki=new z,Ji=new z,Ms=new z,Wr=new z,Jo=new z,Qo=new z,Ss=new z;function Il(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ss.fromArray(i,r);const a=s.x*Math.abs(Ss.x)+s.y*Math.abs(Ss.y)+s.z*Math.abs(Ss.z),l=t.dot(Ss),c=e.dot(Ss),u=n.dot(Ss);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Cg=new Fo,Xr=new z,Dl=new z;let Oo=class{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Cg.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);const e=Xr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Dl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add(Dl)),this.expandByPoint(Xr.copy(t.center).sub(Dl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}};const Ti=new z,Nl=new z,ta=new z,Qi=new z,Ul=new z,ea=new z,Fl=new z;let Oh=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ti)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ti.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ti.copy(this.origin).addScaledVector(this.direction,e),Ti.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Nl.copy(t).add(e).multiplyScalar(.5),ta.copy(e).sub(t).normalize(),Qi.copy(this.origin).sub(Nl);const r=t.distanceTo(e)*.5,o=-this.direction.dot(ta),a=Qi.dot(this.direction),l=-Qi.dot(ta),c=Qi.lengthSq(),u=Math.abs(1-o*o);let h,d,f,p;if(u>0)if(h=o*l-a,d=o*a-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const v=1/u;h*=v,d*=v,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Nl).addScaledVector(ta,d),f}intersectSphere(t,e){Ti.subVectors(t.center,this.origin);const n=Ti.dot(this.direction),s=Ti.dot(Ti)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ti)!==null}intersectTriangle(t,e,n,s,r){Ul.subVectors(e,t),ea.subVectors(n,t),Fl.crossVectors(Ul,ea);let o=this.direction.dot(Fl),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Qi.subVectors(this.origin,t);const l=a*this.direction.dot(ea.crossVectors(Qi,ea));if(l<0)return null;const c=a*this.direction.dot(Ul.cross(Qi));if(c<0||l+c>o)return null;const u=-a*Qi.dot(Fl);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class be{constructor(t,e,n,s,r,o,a,l,c,u,h,d,f,p,v,g){be.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,d,f,p,v,g)}set(t,e,n,s,r,o,a,l,c,u,h,d,f,p,v,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new be().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/er.setFromMatrixColumn(t,0).length(),r=1/er.setFromMatrixColumn(t,1).length(),o=1/er.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,p=a*u,v=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+p*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,p=c*u,v=c*h;e[0]=d+v*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-p,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,p=c*u,v=c*h;e[0]=d-v*a,e[4]=-o*h,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*u,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,p=a*u,v=a*h;e[0]=l*u,e[4]=p*c-f,e[8]=d*c+v,e[1]=l*h,e[5]=v*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*u,e[4]=v-d*h,e[8]=p*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+p,e[10]=d-v*h}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,v=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+v,e[5]=o*u,e[9]=f*h-p,e[2]=p*h-f,e[6]=a*u,e[10]=v*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Rg,t,Pg)}lookAt(t,e,n){const s=this.elements;return En.subVectors(t,e),En.lengthSq()===0&&(En.z=1),En.normalize(),ts.crossVectors(n,En),ts.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),ts.crossVectors(n,En)),ts.normalize(),na.crossVectors(En,ts),s[0]=ts.x,s[4]=na.x,s[8]=En.x,s[1]=ts.y,s[5]=na.y,s[9]=En.y,s[2]=ts.z,s[6]=na.z,s[10]=En.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],v=n[6],g=n[10],m=n[14],x=n[3],M=n[7],_=n[11],C=n[15],T=s[0],P=s[4],U=s[8],b=s[12],y=s[1],R=s[5],B=s[9],L=s[13],H=s[2],G=s[6],k=s[10],K=s[14],X=s[3],rt=s[7],gt=s[11],ct=s[15];return r[0]=o*T+a*y+l*H+c*X,r[4]=o*P+a*R+l*G+c*rt,r[8]=o*U+a*B+l*k+c*gt,r[12]=o*b+a*L+l*K+c*ct,r[1]=u*T+h*y+d*H+f*X,r[5]=u*P+h*R+d*G+f*rt,r[9]=u*U+h*B+d*k+f*gt,r[13]=u*b+h*L+d*K+f*ct,r[2]=p*T+v*y+g*H+m*X,r[6]=p*P+v*R+g*G+m*rt,r[10]=p*U+v*B+g*k+m*gt,r[14]=p*b+v*L+g*K+m*ct,r[3]=x*T+M*y+_*H+C*X,r[7]=x*P+M*R+_*G+C*rt,r[11]=x*U+M*B+_*k+C*gt,r[15]=x*b+M*L+_*K+C*ct,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],p=t[3],v=t[7],g=t[11],m=t[15];return p*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+g*(+e*c*h-e*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+m*(-s*a*u-e*l*h+e*a*d+s*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],p=t[12],v=t[13],g=t[14],m=t[15],x=h*g*c-v*d*c+v*l*f-a*g*f-h*l*m+a*d*m,M=p*d*c-u*g*c-p*l*f+o*g*f+u*l*m-o*d*m,_=u*v*c-p*h*c+p*a*f-o*v*f-u*a*m+o*h*m,C=p*h*l-u*v*l-p*a*d+o*v*d+u*a*g-o*h*g,T=e*x+n*M+s*_+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return t[0]=x*P,t[1]=(v*d*r-h*g*r-v*s*f+n*g*f+h*s*m-n*d*m)*P,t[2]=(a*g*r-v*l*r+v*s*c-n*g*c-a*s*m+n*l*m)*P,t[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*P,t[4]=M*P,t[5]=(u*g*r-p*d*r+p*s*f-e*g*f-u*s*m+e*d*m)*P,t[6]=(p*l*r-o*g*r-p*s*c+e*g*c+o*s*m-e*l*m)*P,t[7]=(o*d*r-u*l*r+u*s*c-e*d*c-o*s*f+e*l*f)*P,t[8]=_*P,t[9]=(p*h*r-u*v*r-p*n*f+e*v*f+u*n*m-e*h*m)*P,t[10]=(o*v*r-p*a*r+p*n*c-e*v*c-o*n*m+e*a*m)*P,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*f-e*a*f)*P,t[12]=C*P,t[13]=(u*v*s-p*h*s+p*n*d-e*v*d-u*n*g+e*h*g)*P,t[14]=(p*a*s-o*v*s-p*n*l+e*v*l+o*n*g-e*a*g)*P,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*d+e*a*d)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,p=r*h,v=o*u,g=o*h,m=a*h,x=l*c,M=l*u,_=l*h,C=n.x,T=n.y,P=n.z;return s[0]=(1-(v+m))*C,s[1]=(f+_)*C,s[2]=(p-M)*C,s[3]=0,s[4]=(f-_)*T,s[5]=(1-(d+m))*T,s[6]=(g+x)*T,s[7]=0,s[8]=(p+M)*P,s[9]=(g-x)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=er.set(s[0],s[1],s[2]).length();const o=er.set(s[4],s[5],s[6]).length(),a=er.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Xn.copy(this);const c=1/r,u=1/o,h=1/a;return Xn.elements[0]*=c,Xn.elements[1]*=c,Xn.elements[2]*=c,Xn.elements[4]*=u,Xn.elements[5]*=u,Xn.elements[6]*=u,Xn.elements[8]*=h,Xn.elements[9]*=h,Xn.elements[10]*=h,e.setFromRotationMatrix(Xn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=di,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let p,v;if(l)p=r/(o-r),v=o*r/(o-r);else if(a===di)p=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Za)p=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=di,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let p,v;if(l)p=1/(o-r),v=o/(o-r);else if(a===di)p=-2/(o-r),v=-(o+r)/(o-r);else if(a===Za)p=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const er=new z,Xn=new be,Rg=new z(0,0,0),Pg=new z(1,1,1),ts=new z,na=new z,En=new z,Gu=new be,Hu=new Uo;class xi{constructor(t=0,e=0,n=0,s=xi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Gu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Hu.setFromEuler(this),this.setFromQuaternion(Hu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xi.DEFAULT_ORDER="XYZ";class Nf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Lg=0;const Vu=new z,nr=new Uo,Ai=new be,ia=new z,qr=new z,Ig=new z,Dg=new Uo,Wu=new z(1,0,0),Xu=new z(0,1,0),qu=new z(0,0,1),Yu={type:"added"},Ng={type:"removed"},ir={type:"childadded",child:null},Ol={type:"childremoved",child:null};class nn extends Br{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lg++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const t=new z,e=new xi,n=new Uo,s=new z(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new be},normalMatrix:{value:new Yt}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return nr.setFromAxisAngle(t,e),this.quaternion.multiply(nr),this}rotateOnWorldAxis(t,e){return nr.setFromAxisAngle(t,e),this.quaternion.premultiply(nr),this}rotateX(t){return this.rotateOnAxis(Wu,t)}rotateY(t){return this.rotateOnAxis(Xu,t)}rotateZ(t){return this.rotateOnAxis(qu,t)}translateOnAxis(t,e){return Vu.copy(t).applyQuaternion(this.quaternion),this.position.add(Vu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wu,t)}translateY(t){return this.translateOnAxis(Xu,t)}translateZ(t){return this.translateOnAxis(qu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ia.copy(t):ia.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(qr,ia,this.up):Ai.lookAt(ia,qr,this.up),this.quaternion.setFromRotationMatrix(Ai),s&&(Ai.extractRotation(s.matrixWorld),nr.setFromRotationMatrix(Ai),this.quaternion.premultiply(nr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yu),ir.child=t,this.dispatchEvent(ir),ir.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ng),Ol.child=t,this.dispatchEvent(Ol),Ol.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yu),ir.child=t,this.dispatchEvent(ir),ir.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qr,t,Ig),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qr,Dg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}nn.DEFAULT_UP=new z(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new z,Ci=new z,Bl=new z,Ri=new z,sr=new z,rr=new z,$u=new z,zl=new z,kl=new z,Gl=new z,Hl=new ve,Vl=new ve,Wl=new ve;class Rn{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),qn.subVectors(t,e),s.cross(qn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){qn.subVectors(s,e),Ci.subVectors(n,e),Bl.subVectors(t,e);const o=qn.dot(qn),a=qn.dot(Ci),l=qn.dot(Bl),c=Ci.dot(Ci),u=Ci.dot(Bl),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,p=(o*u-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(o,Ri.y),l.addScaledVector(a,Ri.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Hl.setScalar(0),Vl.setScalar(0),Wl.setScalar(0),Hl.fromBufferAttribute(t,e),Vl.fromBufferAttribute(t,n),Wl.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Hl,r.x),o.addScaledVector(Vl,r.y),o.addScaledVector(Wl,r.z),o}static isFrontFacing(t,e,n,s){return qn.subVectors(n,e),Ci.subVectors(t,e),qn.cross(Ci).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return qn.subVectors(this.c,this.b),Ci.subVectors(this.a,this.b),qn.cross(Ci).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Rn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;sr.subVectors(s,n),rr.subVectors(r,n),zl.subVectors(t,n);const l=sr.dot(zl),c=rr.dot(zl);if(l<=0&&c<=0)return e.copy(n);kl.subVectors(t,s);const u=sr.dot(kl),h=rr.dot(kl);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(sr,o);Gl.subVectors(t,r);const f=sr.dot(Gl),p=rr.dot(Gl);if(p>=0&&f<=p)return e.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(rr,a);const g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return $u.subVectors(r,s),a=(h-u)/(h-u+(f-p)),e.copy(s).addScaledVector($u,a);const m=1/(g+v+d);return o=v*m,a=d*m,e.copy(n).addScaledVector(sr,o).addScaledVector(rr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},es={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Xl(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class ee{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=_n){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ce.workingColorSpace){if(t=Uh(t,1),e=Qt(e,0,1),n=Qt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Xl(o,r,t+1/3),this.g=Xl(o,r,t),this.b=Xl(o,r,t-1/3)}return ce.colorSpaceToWorking(this,s),this}setStyle(t,e=_n){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=_n){const n=Uf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gi(t.r),this.g=Gi(t.g),this.b=Gi(t.b),this}copyLinearToSRGB(t){return this.r=br(t.r),this.g=br(t.g),this.b=br(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=_n){return ce.workingToColorSpace(on.copy(this),t),Math.round(Qt(on.r*255,0,255))*65536+Math.round(Qt(on.g*255,0,255))*256+Math.round(Qt(on.b*255,0,255))}getHexString(t=_n){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.workingToColorSpace(on.copy(this),e);const n=on.r,s=on.g,r=on.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=ce.workingColorSpace){return ce.workingToColorSpace(on.copy(this),e),t.r=on.r,t.g=on.g,t.b=on.b,t}getStyle(t=_n){ce.workingToColorSpace(on.copy(this),t);const e=on.r,n=on.g,s=on.b;return t!==_n?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(es),this.setHSL(es.h+t,es.s+e,es.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(es),t.getHSL(sa);const n=lo(es.h,sa.h,e),s=lo(es.s,sa.s,e),r=lo(es.l,sa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new ee;ee.NAMES=Uf;let Ug=0,gs=class extends Br{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=Sr,this.side=ds,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sc,this.blendDst=wc,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zs,this.stencilZFail=Zs,this.stencilZPass=Zs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Sr&&(n.blending=this.blending),this.side!==ds&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sc&&(n.blendSrc=this.blendSrc),this.blendDst!==wc&&(n.blendDst=this.blendDst),this.blendEquation!==Ls&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};class Be extends gs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.combine=yf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ke=new z,ra=new mt;let Fg=0;class Pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fg++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ch,this.updateRanges=[],this.gpuType=Oi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ra.fromBufferAttribute(this,e),ra.applyMatrix3(t),this.setXY(e,ra.x,ra.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix3(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=$n(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=$n(e,this.array)),e}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=$n(e,this.array)),e}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=$n(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=$n(e,this.array)),e}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ch&&(t.usage=this.usage),t}}class Ff extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Of extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Le extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Og=0;const Un=new be,ql=new nn,or=new z,Tn=new Fo,Yr=new Fo,Ke=new z;class xe extends Br{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Og++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(If(t)?Of:Ff)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Un.makeRotationFromQuaternion(t),this.applyMatrix4(Un),this}rotateX(t){return Un.makeRotationX(t),this.applyMatrix4(Un),this}rotateY(t){return Un.makeRotationY(t),this.applyMatrix4(Un),this}rotateZ(t){return Un.makeRotationZ(t),this.applyMatrix4(Un),this}translate(t,e,n){return Un.makeTranslation(t,e,n),this.applyMatrix4(Un),this}scale(t,e,n){return Un.makeScale(t,e,n),this.applyMatrix4(Un),this}lookAt(t){return ql.lookAt(t),ql.updateMatrix(),this.applyMatrix4(ql.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(or).negate(),this.translate(or.x,or.y,or.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ke.addVectors(this.boundingBox.min,Tn.min),this.boundingBox.expandByPoint(Ke),Ke.addVectors(this.boundingBox.max,Tn.max),this.boundingBox.expandByPoint(Ke)):(this.boundingBox.expandByPoint(Tn.min),this.boundingBox.expandByPoint(Tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Oo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){const n=this.boundingSphere.center;if(Tn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Yr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ke.addVectors(Tn.min,Yr.min),Tn.expandByPoint(Ke),Ke.addVectors(Tn.max,Yr.max),Tn.expandByPoint(Ke)):(Tn.expandByPoint(Yr.min),Tn.expandByPoint(Yr.max))}Tn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ke.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ke));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ke.fromBufferAttribute(a,c),l&&(or.fromBufferAttribute(t,c),Ke.add(or)),s=Math.max(s,n.distanceToSquared(Ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let U=0;U<n.count;U++)a[U]=new z,l[U]=new z;const c=new z,u=new z,h=new z,d=new mt,f=new mt,p=new mt,v=new z,g=new z;function m(U,b,y){c.fromBufferAttribute(n,U),u.fromBufferAttribute(n,b),h.fromBufferAttribute(n,y),d.fromBufferAttribute(r,U),f.fromBufferAttribute(r,b),p.fromBufferAttribute(r,y),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const R=1/(f.x*p.y-p.x*f.y);isFinite(R)&&(v.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(R),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(R),a[U].add(v),a[b].add(v),a[y].add(v),l[U].add(g),l[b].add(g),l[y].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let U=0,b=x.length;U<b;++U){const y=x[U],R=y.start,B=y.count;for(let L=R,H=R+B;L<H;L+=3)m(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const M=new z,_=new z,C=new z,T=new z;function P(U){C.fromBufferAttribute(s,U),T.copy(C);const b=a[U];M.copy(b),M.sub(C.multiplyScalar(C.dot(b))).normalize(),_.crossVectors(T,b);const R=_.dot(l[U])<0?-1:1;o.setXYZW(U,M.x,M.y,M.z,R)}for(let U=0,b=x.length;U<b;++U){const y=x[U],R=y.start,B=y.count;for(let L=R,H=R+B;L<H;L+=3)P(t.getX(L+0)),P(t.getX(L+1)),P(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new z,r=new z,o=new z,a=new z,l=new z,c=new z,u=new z,h=new z;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(u),l.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ke.fromBufferAttribute(t,e),Ke.normalize(),t.setXYZ(e,Ke.x,Ke.y,Ke.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*u;for(let m=0;m<u;m++)d[p++]=c[f++]}return new Pe(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new xe,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ju=new be,ws=new Oh,oa=new Oo,Zu=new z,aa=new z,la=new z,ca=new z,Yl=new z,ha=new z,Ku=new z,ua=new z;class de extends nn{constructor(t=new xe,e=new Be){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){ha.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Yl.fromBufferAttribute(h,t),o?ha.addScaledVector(Yl,u):ha.addScaledVector(Yl.sub(e),u))}e.add(ha)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),ws.copy(t.ray).recast(t.near),!(oa.containsPoint(ws.origin)===!1&&(ws.intersectSphere(oa,Zu)===null||ws.origin.distanceToSquared(Zu)>(t.far-t.near)**2))&&(ju.copy(r).invert(),ws.copy(t.ray).applyMatrix4(ju),!(n.boundingBox!==null&&ws.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ws)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=o[g.materialIndex],x=Math.max(g.start,f.start),M=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,C=M;_<C;_+=3){const T=a.getX(_),P=a.getX(_+1),U=a.getX(_+2);s=da(this,m,t,n,c,u,h,T,P,U),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const x=a.getX(g),M=a.getX(g+1),_=a.getX(g+2);s=da(this,o,t,n,c,u,h,x,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,v=d.length;p<v;p++){const g=d[p],m=o[g.materialIndex],x=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,C=M;_<C;_+=3){const T=_,P=_+1,U=_+2;s=da(this,m,t,n,c,u,h,T,P,U),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=p,m=v;g<m;g+=3){const x=g,M=g+1,_=g+2;s=da(this,o,t,n,c,u,h,x,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Bg(i,t,e,n,s,r,o,a){let l;if(t.side===Mn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ds,a),l===null)return null;ua.copy(a),ua.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ua);return c<e.near||c>e.far?null:{distance:c,point:ua.clone(),object:i}}function da(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,aa),i.getVertexPosition(l,la),i.getVertexPosition(c,ca);const u=Bg(i,t,e,n,aa,la,ca,Ku);if(u){const h=new z;Rn.getBarycoord(Ku,aa,la,ca,h),s&&(u.uv=Rn.getInterpolatedAttribute(s,a,l,c,h,new mt)),r&&(u.uv1=Rn.getInterpolatedAttribute(r,a,l,c,h,new mt)),o&&(u.normal=Rn.getInterpolatedAttribute(o,a,l,c,h,new z),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new z,materialIndex:0};Rn.getNormal(aa,la,ca,d.normal),u.face=d,u.barycoord=h}return u}class Xs extends xe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(u,3)),this.setAttribute("uv",new Le(h,2));function p(v,g,m,x,M,_,C,T,P,U,b){const y=_/P,R=C/U,B=_/2,L=C/2,H=T/2,G=P+1,k=U+1;let K=0,X=0;const rt=new z;for(let gt=0;gt<k;gt++){const ct=gt*R-L;for(let ht=0;ht<G;ht++){const kt=ht*y-B;rt[v]=kt*x,rt[g]=ct*M,rt[m]=H,c.push(rt.x,rt.y,rt.z),rt[v]=0,rt[g]=0,rt[m]=T>0?1:-1,u.push(rt.x,rt.y,rt.z),h.push(ht/P),h.push(1-gt/U),K+=1}}for(let gt=0;gt<U;gt++)for(let ct=0;ct<P;ct++){const ht=d+ct+G*gt,kt=d+ct+G*(gt+1),ne=d+(ct+1)+G*(gt+1),$t=d+(ct+1)+G*gt;l.push(ht,kt,$t),l.push(kt,ne,$t),X+=6}a.addGroup(f,X,b),f+=X,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Lr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function un(i){const t={};for(let e=0;e<i.length;e++){const n=Lr(i[e]);for(const s in n)t[s]=n[s]}return t}function zg(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Bf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}const kg={clone:Lr,merge:un};var Gg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends gs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gg,this.fragmentShader=Hg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Lr(t.uniforms),this.uniformsGroups=zg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class zf extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ns=new z,Ju=new mt,Qu=new mt;class On extends zf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=go*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(wr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return go*2*Math.atan(Math.tan(wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ns.x,ns.y).multiplyScalar(-t/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ns.x,ns.y).multiplyScalar(-t/ns.z)}getViewSize(t,e){return this.getViewBounds(t,Ju,Qu),e.subVectors(Qu,Ju)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(wr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ar=-90,lr=1;class Vg extends nn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new On(ar,lr,t,e);s.layers=this.layers,this.add(s);const r=new On(ar,lr,t,e);r.layers=this.layers,this.add(r);const o=new On(ar,lr,t,e);o.layers=this.layers,this.add(o);const a=new On(ar,lr,t,e);a.layers=this.layers,this.add(a);const l=new On(ar,lr,t,e);l.layers=this.layers,this.add(l);const c=new On(ar,lr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===di)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Za)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class kf extends an{constructor(t=[],e=Cr,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Wg extends ks{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new kf(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Xs(5,5,5),r=new Gn({name:"CubemapFromEquirect",uniforms:Lr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Mn,blending:ls});r.uniforms.tEquirect.value=e;const o=new de(s,r),a=e.minFilter;return e.minFilter===Fs&&(e.minFilter=zn),new Vg(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Ae extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xg={type:"move"};class $l{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ae,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ae,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ae,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Xg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ae;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class qg extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xi,this.environmentIntensity=1,this.environmentRotation=new xi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Yg{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ch,this.updateRanges=[],this.version=0,this.uuid=fi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const hn=new z;class Ja{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix4(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.applyNormalMatrix(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)hn.fromBufferAttribute(this,e),hn.transformDirection(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=$n(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ge(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ge(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=$n(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=$n(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=$n(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=$n(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ge(e,this.array),n=ge(n,this.array),s=ge(s,this.array),r=ge(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ja(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $i extends gs{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let cr;const $r=new z,hr=new z,ur=new z,dr=new mt,jr=new mt,Gf=new be,fa=new z,Zr=new z,pa=new z,td=new mt,jl=new mt,ed=new mt;class vs extends nn{constructor(t=new $i){if(super(),this.isSprite=!0,this.type="Sprite",cr===void 0){cr=new xe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Yg(e,5);cr.setIndex([0,1,2,0,2,3]),cr.setAttribute("position",new Ja(n,3,0,!1)),cr.setAttribute("uv",new Ja(n,2,3,!1))}this.geometry=cr,this.material=t,this.center=new mt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hr.setFromMatrixScale(this.matrixWorld),Gf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ur.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hr.multiplyScalar(-ur.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;ma(fa.set(-.5,-.5,0),ur,o,hr,s,r),ma(Zr.set(.5,-.5,0),ur,o,hr,s,r),ma(pa.set(.5,.5,0),ur,o,hr,s,r),td.set(0,0),jl.set(1,0),ed.set(1,1);let a=t.ray.intersectTriangle(fa,Zr,pa,!1,$r);if(a===null&&(ma(Zr.set(-.5,.5,0),ur,o,hr,s,r),jl.set(0,1),a=t.ray.intersectTriangle(fa,pa,Zr,!1,$r),a===null))return;const l=t.ray.origin.distanceTo($r);l<t.near||l>t.far||e.push({distance:l,point:$r.clone(),uv:Rn.getInterpolation($r,fa,Zr,pa,td,jl,ed,new mt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function ma(i,t,e,n,s,r){dr.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(jr.x=r*dr.x-s*dr.y,jr.y=s*dr.x+r*dr.y):jr.copy(dr),i.copy(t),i.x+=jr.x,i.y+=jr.y,i.applyMatrix4(Gf)}class $g extends an{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Pn,u=Pn,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Zl=new z,jg=new z,Zg=new Yt;class Cs{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Zl.subVectors(n,e).cross(jg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Zl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Zg.getNormalMatrix(t),s=this.coplanarPoint(Zl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bs=new Oo,Kg=new mt(.5,.5),ga=new z;class Bh{constructor(t=new Cs,e=new Cs,n=new Cs,s=new Cs,r=new Cs,o=new Cs){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=di,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],v=r[9],g=r[10],m=r[11],x=r[12],M=r[13],_=r[14],C=r[15];if(s[0].setComponents(c-o,f-u,m-p,C-x).normalize(),s[1].setComponents(c+o,f+u,m+p,C+x).normalize(),s[2].setComponents(c+a,f+h,m+v,C+M).normalize(),s[3].setComponents(c-a,f-h,m-v,C-M).normalize(),n)s[4].setComponents(l,d,g,_).normalize(),s[5].setComponents(c-l,f-d,m-g,C-_).normalize();else if(s[4].setComponents(c-l,f-d,m-g,C-_).normalize(),e===di)s[5].setComponents(c+l,f+d,m+g,C+_).normalize();else if(e===Za)s[5].setComponents(l,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(t){bs.center.set(0,0,0);const e=Kg.distanceTo(t.center);return bs.radius=.7071067811865476+e,bs.applyMatrix4(t.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ga.x=s.normal.x>0?t.max.x:t.min.x,ga.y=s.normal.y>0?t.max.y:t.min.y,ga.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ga)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ln extends gs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Qa=new z,tl=new z,nd=new be,Kr=new Oh,va=new Oo,Kl=new z,id=new z;class zr extends nn{constructor(t=new xe,e=new ln){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Qa.fromBufferAttribute(e,s-1),tl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Qa.distanceTo(tl);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,t.ray.intersectsSphere(va)===!1)return;nd.copy(s).invert(),Kr.copy(t.ray).applyMatrix4(nd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let v=f,g=p-1;v<g;v+=c){const m=u.getX(v),x=u.getX(v+1),M=xa(this,t,Kr,l,m,x,v);M&&e.push(M)}if(this.isLineLoop){const v=u.getX(p-1),g=u.getX(f),m=xa(this,t,Kr,l,v,g,p-1);m&&e.push(m)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let v=f,g=p-1;v<g;v+=c){const m=xa(this,t,Kr,l,v,v+1,v);m&&e.push(m)}if(this.isLineLoop){const v=xa(this,t,Kr,l,p-1,f,p-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function xa(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(Qa.fromBufferAttribute(a,s),tl.fromBufferAttribute(a,r),e.distanceSqToSegment(Qa,tl,Kl,id)>n)return;Kl.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Kl);if(!(c<t.near||c>t.far))return{distance:c,point:id.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const sd=new z,rd=new z;class Jg extends zr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)sd.fromBufferAttribute(e,s),rd.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+sd.distanceTo(rd);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hf extends gs{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const od=new be,hh=new Oh,ya=new Oo,_a=new z;class Bo extends nn{constructor(t=new xe,e=new Hf){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,t.ray.intersectsSphere(ya)===!1)return;od.copy(s).invert(),hh.copy(t.ray).applyMatrix4(od);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,v=f;p<v;p++){const g=c.getX(p);_a.fromBufferAttribute(h,g),ad(_a,g,l,s,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let p=d,v=f;p<v;p++)_a.fromBufferAttribute(h,p),ad(_a,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ad(i,t,e,n,s,r,o){const a=hh.distanceSqToPoint(i);if(a<e){const l=new z;hh.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class ll extends an{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Vf extends an{constructor(t,e,n=zs,s,r,o,a=Pn,l=Pn,c,u=po,h=1){if(u!==po&&u!==mo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Fh(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Wf extends an{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Xi extends xe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new z,u=new mt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(a,3)),this.setAttribute("uv",new Le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}const Ma=new z,Sa=new z,Jl=new z,wa=new Rn;class Qg extends xe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(wr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:v,b:g,c:m}=wa;if(v.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),m.fromBufferAttribute(a,c[2]),wa.getNormal(Jl),h[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,h[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,h[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let x=0;x<3;x++){const M=(x+1)%3,_=h[x],C=h[M],T=wa[u[x]],P=wa[u[M]],U=`${_}_${C}`,b=`${C}_${_}`;b in d&&d[b]?(Jl.dot(d[b].normal)<=r&&(f.push(T.x,T.y,T.z),f.push(P.x,P.y,P.z)),d[b]=null):U in d||(d[U]={index0:c[x],index1:c[M],normal:Jl.clone()})}}for(const p in d)if(d[p]){const{index0:v,index1:g}=d[p];Ma.fromBufferAttribute(a,v),Sa.fromBufferAttribute(a,g),f.push(Ma.x,Ma.y,Ma.z),f.push(Sa.x,Sa.y,Sa.z)}this.setAttribute("position",new Le(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class wi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new mt:new z);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new z,s=[],r=[],o=[],a=new z,l=new be;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new z)}r[0]=new z,o[0]=new z;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Qt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Qt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class zh extends wi{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new mt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class t0 extends zh{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function kh(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const ba=new z,Ql=new kh,tc=new kh,ec=new kh;class e0 extends wi{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new z){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(ba.subVectors(s[0],s[1]).add(s[0]),c=ba);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ba.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ba),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),Ql.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,v,g),tc.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,v,g),ec.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,v,g)}else this.curveType==="catmullrom"&&(Ql.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),tc.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),ec.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(Ql.calc(l),tc.calc(l),ec.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new z().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ld(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function n0(i,t){const e=1-i;return e*e*t}function i0(i,t){return 2*(1-i)*i*t}function s0(i,t){return i*i*t}function co(i,t,e,n){return n0(i,t)+i0(i,e)+s0(i,n)}function r0(i,t){const e=1-i;return e*e*e*t}function o0(i,t){const e=1-i;return 3*e*e*i*t}function a0(i,t){return 3*(1-i)*i*i*t}function l0(i,t){return i*i*i*t}function ho(i,t,e,n,s){return r0(i,t)+o0(i,e)+a0(i,n)+l0(i,s)}class Xf extends wi{constructor(t=new mt,e=new mt,n=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ho(t,s.x,r.x,o.x,a.x),ho(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class c0 extends wi{constructor(t=new z,e=new z,n=new z,s=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new z){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ho(t,s.x,r.x,o.x,a.x),ho(t,s.y,r.y,o.y,a.y),ho(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qf extends wi{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class h0 extends wi{constructor(t=new z,e=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new z){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yf extends wi{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(co(t,s.x,r.x,o.x),co(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class u0 extends wi{constructor(t=new z,e=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new z){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(co(t,s.x,r.x,o.x),co(t,s.y,r.y,o.y),co(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $f extends wi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(ld(a,l.x,c.x,u.x,h.x),ld(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new mt().fromArray(s))}return this}}var uh=Object.freeze({__proto__:null,ArcCurve:t0,CatmullRomCurve3:e0,CubicBezierCurve:Xf,CubicBezierCurve3:c0,EllipseCurve:zh,LineCurve:qf,LineCurve3:h0,QuadraticBezierCurve:Yf,QuadraticBezierCurve3:u0,SplineCurve:$f});class d0 extends wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new uh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new uh[s.type]().fromJSON(s))}return this}}class cd extends d0{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new qf(this.currentPoint.clone(),new mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Yf(this.currentPoint.clone(),new mt(t,e),new mt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Xf(this.currentPoint.clone(),new mt(t,e),new mt(n,s),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new $f(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new zh(t,e,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}let Ir=class extends cd{constructor(t){super(t),this.uuid=fi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new cd().fromJSON(s))}return this}};function f0(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=jf(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=x0(i,t,r,e)),i.length>80*e){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=e;d<s;d+=e){const f=i[d],p=i[d+1];f<a&&(a=f),p<l&&(l=p),f>u&&(u=f),p>h&&(h=p)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return xo(r,o,e,a,l,c,0),o}function jf(i,t,e,n,s){let r;if(s===R0(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=hd(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=hd(o/n|0,i[o],i[o+1],r);return r&&Dr(r,r.next)&&(_o(r),r=r.next),r}function Gs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Dr(e,e.next)||Ue(e.prev,e,e.next)===0)){if(_o(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function xo(i,t,e,n,s,r,o){if(!i)return;!o&&r&&w0(i,n,s,r);let a=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?m0(i,n,s,r):p0(i)){t.push(l.i,i.i,c.i),_o(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=g0(Gs(i),t),xo(i,t,e,n,s,r,2)):o===2&&v0(i,t,e,n,s,r):xo(Gs(i),t,e,n,s,r,1);break}}}function p0(i){const t=i.prev,e=i,n=i.next;if(Ue(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=Math.min(s,r,o),h=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c);let p=n.next;for(;p!==t;){if(p.x>=u&&p.x<=d&&p.y>=h&&p.y<=f&&ro(s,a,r,l,o,c,p.x,p.y)&&Ue(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function m0(i,t,e,n){const s=i.prev,r=i,o=i.next;if(Ue(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,f=Math.min(a,l,c),p=Math.min(u,h,d),v=Math.max(a,l,c),g=Math.max(u,h,d),m=dh(f,p,t,e,n),x=dh(v,g,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=m&&_&&_.z<=x;){if(M.x>=f&&M.x<=v&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&ro(a,u,l,h,c,d,M.x,M.y)&&Ue(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==o&&ro(a,u,l,h,c,d,_.x,_.y)&&Ue(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=v&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&ro(a,u,l,h,c,d,M.x,M.y)&&Ue(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=x;){if(_.x>=f&&_.x<=v&&_.y>=p&&_.y<=g&&_!==s&&_!==o&&ro(a,u,l,h,c,d,_.x,_.y)&&Ue(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function g0(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Dr(n,s)&&Kf(n,e,e.next,s)&&yo(n,s)&&yo(s,n)&&(t.push(n.i,e.i,s.i),_o(e),_o(e.next),e=i=s),e=e.next}while(e!==i);return Gs(e)}function v0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&T0(o,a)){let l=Jf(o,a);o=Gs(o,o.next),l=Gs(l,l.next),xo(o,t,e,n,s,r,0),xo(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function x0(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=jf(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(E0(c))}s.sort(y0);for(let r=0;r<s.length;r++)e=_0(s[r],e);return e}function y0(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function _0(i,t){const e=M0(i,t);if(!e)return t;const n=Jf(e,i);return Gs(n,n.next),Gs(e,e.next)}function M0(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Dr(i,e))return e;do{if(Dr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>r&&(r=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Zf(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const h=Math.abs(s-e.y)/(n-e.x);yo(e,i)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&S0(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function S0(i,t){return Ue(i.prev,i,t.prev)<0&&Ue(t.next,i,i.next)<0}function w0(i,t,e,n){let s=i;do s.z===0&&(s.z=dh(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,b0(s)}function b0(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function dh(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function E0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Zf(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function ro(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&Zf(i,t,e,n,s,r,o,a)}function T0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!A0(i,t)&&(yo(i,t)&&yo(t,i)&&C0(i,t)&&(Ue(i.prev,i,t.prev)||Ue(i,t.prev,t))||Dr(i,t)&&Ue(i.prev,i,i.next)>0&&Ue(t.prev,t,t.next)>0)}function Ue(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Dr(i,t){return i.x===t.x&&i.y===t.y}function Kf(i,t,e,n){const s=Ta(Ue(i,t,e)),r=Ta(Ue(i,t,n)),o=Ta(Ue(e,n,i)),a=Ta(Ue(e,n,t));return!!(s!==r&&o!==a||s===0&&Ea(i,e,t)||r===0&&Ea(i,n,t)||o===0&&Ea(e,i,n)||a===0&&Ea(e,t,n))}function Ea(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ta(i){return i>0?1:i<0?-1:0}function A0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Kf(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function yo(i,t){return Ue(i.prev,i,i.next)<0?Ue(i,t,i.next)>=0&&Ue(i,i.prev,t)>=0:Ue(i,t,i.prev)<0||Ue(i,i.next,t)<0}function C0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Jf(i,t){const e=fh(i.i,i.x,i.y),n=fh(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function hd(i,t,e,n){const s=fh(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function _o(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function fh(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function R0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class P0{static triangulate(t,e,n=2){return f0(t,e,n)}}class Bi{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Bi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];ud(t),dd(n,t);let o=t.length;e.forEach(ud);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,dd(n,e[l]);const a=P0.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function ud(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function dd(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class el extends xe{constructor(t=new Ir([new mt(.5,.5),new mt(-.5,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Le(s,3)),this.setAttribute("uv",new Le(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:L0;let M,_=!1,C,T,P,U;m&&(M=m.getSpacedPoints(u),_=!0,d=!1,C=m.computeFrenetFrames(u,!1),T=new z,P=new z,U=new z),d||(g=0,f=0,p=0,v=0);const b=a.extractPoints(c);let y=b.shape;const R=b.holes;if(!Bi.isClockWise(y)){y=y.reverse();for(let D=0,F=R.length;D<F;D++){const I=R[D];Bi.isClockWise(I)&&(R[D]=I.reverse())}}function L(D){const I=10000000000000001e-36;let V=D[0];for(let et=1;et<=D.length;et++){const Z=et%D.length,it=D[Z],xt=it.x-V.x,tt=it.y-V.y,A=xt*xt+tt*tt,S=Math.max(Math.abs(it.x),Math.abs(it.y),Math.abs(V.x),Math.abs(V.y)),O=I*S*S;if(A<=O){D.splice(Z,1),et--;continue}V=it}}L(y),R.forEach(L);const H=R.length,G=y;for(let D=0;D<H;D++){const F=R[D];y=y.concat(F)}function k(D,F,I){return F||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(F,I)}const K=y.length;function X(D,F,I){let V,et,Z;const it=D.x-F.x,xt=D.y-F.y,tt=I.x-D.x,A=I.y-D.y,S=it*it+xt*xt,O=it*A-xt*tt;if(Math.abs(O)>Number.EPSILON){const $=Math.sqrt(S),at=Math.sqrt(tt*tt+A*A),j=F.x-xt/$,wt=F.y+it/$,ut=I.x-A/at,At=I.y+tt/at,Ut=((ut-j)*A-(At-wt)*tt)/(it*A-xt*tt);V=j+it*Ut-D.x,et=wt+xt*Ut-D.y;const dt=V*V+et*et;if(dt<=2)return new mt(V,et);Z=Math.sqrt(dt/2)}else{let $=!1;it>Number.EPSILON?tt>Number.EPSILON&&($=!0):it<-Number.EPSILON?tt<-Number.EPSILON&&($=!0):Math.sign(xt)===Math.sign(A)&&($=!0),$?(V=-xt,et=it,Z=Math.sqrt(S)):(V=it,et=xt,Z=Math.sqrt(S/2))}return new mt(V/Z,et/Z)}const rt=[];for(let D=0,F=G.length,I=F-1,V=D+1;D<F;D++,I++,V++)I===F&&(I=0),V===F&&(V=0),rt[D]=X(G[D],G[I],G[V]);const gt=[];let ct,ht=rt.concat();for(let D=0,F=H;D<F;D++){const I=R[D];ct=[];for(let V=0,et=I.length,Z=et-1,it=V+1;V<et;V++,Z++,it++)Z===et&&(Z=0),it===et&&(it=0),ct[V]=X(I[V],I[Z],I[it]);gt.push(ct),ht=ht.concat(ct)}let kt;if(g===0)kt=Bi.triangulateShape(G,R);else{const D=[],F=[];for(let I=0;I<g;I++){const V=I/g,et=f*Math.cos(V*Math.PI/2),Z=p*Math.sin(V*Math.PI/2)+v;for(let it=0,xt=G.length;it<xt;it++){const tt=k(G[it],rt[it],Z);Ot(tt.x,tt.y,-et),V===0&&D.push(tt)}for(let it=0,xt=H;it<xt;it++){const tt=R[it];ct=gt[it];const A=[];for(let S=0,O=tt.length;S<O;S++){const $=k(tt[S],ct[S],Z);Ot($.x,$.y,-et),V===0&&A.push($)}V===0&&F.push(A)}}kt=Bi.triangulateShape(D,F)}const ne=kt.length,$t=p+v;for(let D=0;D<K;D++){const F=d?k(y[D],ht[D],$t):y[D];_?(P.copy(C.normals[0]).multiplyScalar(F.x),T.copy(C.binormals[0]).multiplyScalar(F.y),U.copy(M[0]).add(P).add(T),Ot(U.x,U.y,U.z)):Ot(F.x,F.y,0)}for(let D=1;D<=u;D++)for(let F=0;F<K;F++){const I=d?k(y[F],ht[F],$t):y[F];_?(P.copy(C.normals[D]).multiplyScalar(I.x),T.copy(C.binormals[D]).multiplyScalar(I.y),U.copy(M[D]).add(P).add(T),Ot(U.x,U.y,U.z)):Ot(I.x,I.y,h/u*D)}for(let D=g-1;D>=0;D--){const F=D/g,I=f*Math.cos(F*Math.PI/2),V=p*Math.sin(F*Math.PI/2)+v;for(let et=0,Z=G.length;et<Z;et++){const it=k(G[et],rt[et],V);Ot(it.x,it.y,h+I)}for(let et=0,Z=R.length;et<Z;et++){const it=R[et];ct=gt[et];for(let xt=0,tt=it.length;xt<tt;xt++){const A=k(it[xt],ct[xt],V);_?Ot(A.x,A.y+M[u-1].y,M[u-1].x+I):Ot(A.x,A.y,h+I)}}}st(),ot();function st(){const D=s.length/3;if(d){let F=0,I=K*F;for(let V=0;V<ne;V++){const et=kt[V];Dt(et[2]+I,et[1]+I,et[0]+I)}F=u+g*2,I=K*F;for(let V=0;V<ne;V++){const et=kt[V];Dt(et[0]+I,et[1]+I,et[2]+I)}}else{for(let F=0;F<ne;F++){const I=kt[F];Dt(I[2],I[1],I[0])}for(let F=0;F<ne;F++){const I=kt[F];Dt(I[0]+K*u,I[1]+K*u,I[2]+K*u)}}n.addGroup(D,s.length/3-D,0)}function ot(){const D=s.length/3;let F=0;Ct(G,F),F+=G.length;for(let I=0,V=R.length;I<V;I++){const et=R[I];Ct(et,F),F+=et.length}n.addGroup(D,s.length/3-D,1)}function Ct(D,F){let I=D.length;for(;--I>=0;){const V=I;let et=I-1;et<0&&(et=D.length-1);for(let Z=0,it=u+g*2;Z<it;Z++){const xt=K*Z,tt=K*(Z+1),A=F+V+xt,S=F+et+xt,O=F+et+tt,$=F+V+tt;Kt(A,S,O,$)}}}function Ot(D,F,I){l.push(D),l.push(F),l.push(I)}function Dt(D,F,I){fe(D),fe(F),fe(I);const V=s.length/3,et=x.generateTopUV(n,s,V-3,V-2,V-1);N(et[0]),N(et[1]),N(et[2])}function Kt(D,F,I,V){fe(D),fe(F),fe(V),fe(F),fe(I),fe(V);const et=s.length/3,Z=x.generateSideWallUV(n,s,et-6,et-3,et-2,et-1);N(Z[0]),N(Z[1]),N(Z[3]),N(Z[1]),N(Z[2]),N(Z[3])}function fe(D){s.push(l[D*3+0]),s.push(l[D*3+1]),s.push(l[D*3+2])}function N(D){r.push(D.x),r.push(D.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return I0(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new uh[s.type]().fromJSON(s)),new el(n,t.options)}}const L0={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],u=t[s*3+1];return[new mt(r,o),new mt(a,l),new mt(c,u)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],h=t[n*3+2],d=t[s*3],f=t[s*3+1],p=t[s*3+2],v=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new mt(o,1-l),new mt(c,1-h),new mt(d,1-p),new mt(v,1-m)]:[new mt(a,1-l),new mt(u,1-h),new mt(f,1-p),new mt(g,1-m)]}};function I0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class fs extends xe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,d=e/l,f=[],p=[],v=[],g=[];for(let m=0;m<u;m++){const x=m*d-o;for(let M=0;M<c;M++){const _=M*h-r;p.push(_,-x,0),v.push(0,0,1),g.push(M/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){const M=x+c*m,_=x+c*(m+1),C=x+1+c*(m+1),T=x+1+c*m;f.push(M,_,T),f.push(_,C,T)}this.setIndex(f),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(v,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fs(t.width,t.height,t.widthSegments,t.heightSegments)}}class zo extends xe{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],u=[];let h=t;const d=(e-t)/s,f=new z,p=new mt;for(let v=0;v<=s;v++){for(let g=0;g<=n;g++){const m=r+g/n*o;f.x=h*Math.cos(m),f.y=h*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,u.push(p.x,p.y)}h+=d}for(let v=0;v<s;v++){const g=v*(n+1);for(let m=0;m<n;m++){const x=m+g,M=x,_=x+n+1,C=x+n+2,T=x+1;a.push(M,_,T),a.push(_,C,T)}}this.setIndex(a),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class nl extends xe{constructor(t=new Ir([new mt(0,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(o,2));function c(u){const h=s.length/3,d=u.extractPoints(e);let f=d.shape;const p=d.holes;Bi.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,m=p.length;g<m;g++){const x=p[g];Bi.isClockWise(x)===!0&&(p[g]=x.reverse())}const v=Bi.triangulateShape(f,p);for(let g=0,m=p.length;g<m;g++){const x=p[g];f=f.concat(x)}for(let g=0,m=f.length;g<m;g++){const x=f[g];s.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let g=0,m=v.length;g<m;g++){const x=v[g],M=x[0]+h,_=x[1]+h,C=x[2]+h;n.push(M,_,C),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return D0(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new nl(n,t.curveSegments)}}function D0(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class qs extends xe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new z,d=new z,f=[],p=[],v=[],g=[];for(let m=0;m<=n;m++){const x=[],M=m/n;let _=0;m===0&&o===0?_=.5/e:m===n&&l===Math.PI&&(_=-.5/e);for(let C=0;C<=e;C++){const T=C/e;h.x=-t*Math.cos(s+T*r)*Math.sin(o+M*a),h.y=t*Math.cos(o+M*a),h.z=t*Math.sin(s+T*r)*Math.sin(o+M*a),p.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),g.push(T+_,1-M),x.push(c++)}u.push(x)}for(let m=0;m<n;m++)for(let x=0;x<e;x++){const M=u[m][x+1],_=u[m][x],C=u[m+1][x],T=u[m+1][x+1];(m!==0||o>0)&&f.push(M,_,T),(m!==n-1||l<Math.PI)&&f.push(_,C,T)}this.setIndex(f),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(v,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class N0 extends gs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pf,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class U0 extends gs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ym,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class F0 extends gs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class cl extends ln{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class Qf extends nn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const nc=new be,fd=new z,pd=new z;class O0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.mapType=gi,this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bh,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;fd.setFromMatrixPosition(t.matrixWorld),e.position.copy(fd),pd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(pd),e.updateMatrixWorld(),nc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const md=new be,Jr=new z,ic=new z;class B0 extends O0{constructor(){super(new On(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new mt(4,2),this._viewportCount=6,this._viewports=[new ve(2,1,1,1),new ve(0,1,1,1),new ve(3,1,1,1),new ve(1,1,1,1),new ve(3,0,1,1),new ve(1,0,1,1)],this._cubeDirections=[new z(1,0,0),new z(-1,0,0),new z(0,0,1),new z(0,0,-1),new z(0,1,0),new z(0,-1,0)],this._cubeUps=[new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,1,0),new z(0,0,1),new z(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Jr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Jr),ic.copy(n.position),ic.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ic),n.updateMatrixWorld(),s.makeTranslation(-Jr.x,-Jr.y,-Jr.z),md.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(md,n.coordinateSystem,n.reversedDepth)}}class hl extends Qf{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new B0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class tp extends zf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class z0 extends Qf{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class k0 extends On{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function gd(i,t,e,n){const s=G0(n);switch(e){case Tf:return i*t;case Cf:return i*t/s.components*s.byteLength;case Ih:return i*t/s.components*s.byteLength;case Rf:return i*t*2/s.components*s.byteLength;case Dh:return i*t*2/s.components*s.byteLength;case Af:return i*t*3/s.components*s.byteLength;case jn:return i*t*4/s.components*s.byteLength;case Nh:return i*t*4/s.components*s.byteLength;case za:case ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ga:case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Fc:case Bc:return Math.max(i,16)*Math.max(t,8)/4;case Uc:case Oc:return Math.max(i,8)*Math.max(t,8)/2;case zc:case kc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Gc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Hc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Wc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Xc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case qc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Yc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case $c:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case jc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Zc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Kc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Qc:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case th:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case eh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case nh:case ih:case sh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case rh:case oh:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ah:case lh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function G0(i){switch(i){case gi:case Sf:return{byteLength:1,components:1};case uo:case wf:case No:return{byteLength:2,components:1};case Ph:case Lh:return{byteLength:2,components:4};case zs:case Rh:case Oi:return{byteLength:4,components:1};case bf:case Ef:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ch}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ch);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ep(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function H0(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],v=h[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const v=h[f];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var V0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,W0=`#ifdef USE_ALPHAHASH
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
#endif`,X0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,q0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Y0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j0=`#ifdef USE_AOMAP
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
#endif`,Z0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K0=`#ifdef USE_BATCHING
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
#endif`,J0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Q0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ev=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,nv=`#ifdef USE_IRIDESCENCE
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
#endif`,iv=`#ifdef USE_BUMPMAP
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
#endif`,sv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ov=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,av=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,dv=`#define PI 3.141592653589793
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
} // validated`,fv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,pv=`vec3 transformedNormal = objectNormal;
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
#endif`,mv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yv="gl_FragColor = linearToOutputTexel( gl_FragColor );",_v=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mv=`#ifdef USE_ENVMAP
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
#endif`,Sv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,wv=`#ifdef USE_ENVMAP
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
#endif`,bv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ev=`#ifdef USE_ENVMAP
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
#endif`,Tv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Av=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pv=`#ifdef USE_GRADIENTMAP
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
}`,Lv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Iv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nv=`uniform bool receiveShadow;
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
#endif`,Uv=`#ifdef USE_ENVMAP
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
#endif`,Fv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ov=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Bv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kv=`PhysicalMaterial material;
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
#endif`,Gv=`struct PhysicalMaterial {
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
}`,Hv=`
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
#endif`,Vv=`#if defined( RE_IndirectDiffuse )
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
#endif`,Wv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$v=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jv=`#if defined( USE_POINTS_UV )
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
#endif`,Qv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,tx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ix=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sx=`#ifdef USE_MORPHTARGETS
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
#endif`,rx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ox=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ax=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,lx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ux=`#ifdef USE_NORMALMAP
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
#endif`,dx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,px=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,xx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_x=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ex=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Tx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ax=`float getShadowMask() {
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
}`,Cx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rx=`#ifdef USE_SKINNING
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
#endif`,Px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lx=`#ifdef USE_SKINNING
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
#endif`,Ix=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ux=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fx=`#ifdef USE_TRANSMISSION
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
#endif`,Ox=`#ifdef USE_TRANSMISSION
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
#endif`,Bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vx=`uniform sampler2D t2D;
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
}`,Wx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`#include <common>
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
}`,jx=`#if DEPTH_PACKING == 3200
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
}`,Zx=`#define DISTANCE
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
}`,Kx=`#define DISTANCE
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
}`,Jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ty=`uniform float scale;
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
}`,ey=`uniform vec3 diffuse;
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
}`,ny=`#include <common>
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
}`,iy=`uniform vec3 diffuse;
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
}`,sy=`#define LAMBERT
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
}`,ry=`#define LAMBERT
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
}`,oy=`#define MATCAP
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
}`,ay=`#define MATCAP
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
}`,ly=`#define NORMAL
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
}`,cy=`#define NORMAL
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
}`,hy=`#define PHONG
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
}`,uy=`#define PHONG
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
}`,dy=`#define STANDARD
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
}`,fy=`#define STANDARD
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
}`,py=`#define TOON
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
}`,my=`#define TOON
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
}`,gy=`uniform float size;
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
}`,vy=`uniform vec3 diffuse;
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
}`,xy=`#include <common>
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
}`,yy=`uniform vec3 color;
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
}`,_y=`uniform float rotation;
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
}`,My=`uniform vec3 diffuse;
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
}`,jt={alphahash_fragment:V0,alphahash_pars_fragment:W0,alphamap_fragment:X0,alphamap_pars_fragment:q0,alphatest_fragment:Y0,alphatest_pars_fragment:$0,aomap_fragment:j0,aomap_pars_fragment:Z0,batching_pars_vertex:K0,batching_vertex:J0,begin_vertex:Q0,beginnormal_vertex:tv,bsdfs:ev,iridescence_fragment:nv,bumpmap_pars_fragment:iv,clipping_planes_fragment:sv,clipping_planes_pars_fragment:rv,clipping_planes_pars_vertex:ov,clipping_planes_vertex:av,color_fragment:lv,color_pars_fragment:cv,color_pars_vertex:hv,color_vertex:uv,common:dv,cube_uv_reflection_fragment:fv,defaultnormal_vertex:pv,displacementmap_pars_vertex:mv,displacementmap_vertex:gv,emissivemap_fragment:vv,emissivemap_pars_fragment:xv,colorspace_fragment:yv,colorspace_pars_fragment:_v,envmap_fragment:Mv,envmap_common_pars_fragment:Sv,envmap_pars_fragment:wv,envmap_pars_vertex:bv,envmap_physical_pars_fragment:Uv,envmap_vertex:Ev,fog_vertex:Tv,fog_pars_vertex:Av,fog_fragment:Cv,fog_pars_fragment:Rv,gradientmap_pars_fragment:Pv,lightmap_pars_fragment:Lv,lights_lambert_fragment:Iv,lights_lambert_pars_fragment:Dv,lights_pars_begin:Nv,lights_toon_fragment:Fv,lights_toon_pars_fragment:Ov,lights_phong_fragment:Bv,lights_phong_pars_fragment:zv,lights_physical_fragment:kv,lights_physical_pars_fragment:Gv,lights_fragment_begin:Hv,lights_fragment_maps:Vv,lights_fragment_end:Wv,logdepthbuf_fragment:Xv,logdepthbuf_pars_fragment:qv,logdepthbuf_pars_vertex:Yv,logdepthbuf_vertex:$v,map_fragment:jv,map_pars_fragment:Zv,map_particle_fragment:Kv,map_particle_pars_fragment:Jv,metalnessmap_fragment:Qv,metalnessmap_pars_fragment:tx,morphinstance_vertex:ex,morphcolor_vertex:nx,morphnormal_vertex:ix,morphtarget_pars_vertex:sx,morphtarget_vertex:rx,normal_fragment_begin:ox,normal_fragment_maps:ax,normal_pars_fragment:lx,normal_pars_vertex:cx,normal_vertex:hx,normalmap_pars_fragment:ux,clearcoat_normal_fragment_begin:dx,clearcoat_normal_fragment_maps:fx,clearcoat_pars_fragment:px,iridescence_pars_fragment:mx,opaque_fragment:gx,packing:vx,premultiplied_alpha_fragment:xx,project_vertex:yx,dithering_fragment:_x,dithering_pars_fragment:Mx,roughnessmap_fragment:Sx,roughnessmap_pars_fragment:wx,shadowmap_pars_fragment:bx,shadowmap_pars_vertex:Ex,shadowmap_vertex:Tx,shadowmask_pars_fragment:Ax,skinbase_vertex:Cx,skinning_pars_vertex:Rx,skinning_vertex:Px,skinnormal_vertex:Lx,specularmap_fragment:Ix,specularmap_pars_fragment:Dx,tonemapping_fragment:Nx,tonemapping_pars_fragment:Ux,transmission_fragment:Fx,transmission_pars_fragment:Ox,uv_pars_fragment:Bx,uv_pars_vertex:zx,uv_vertex:kx,worldpos_vertex:Gx,background_vert:Hx,background_frag:Vx,backgroundCube_vert:Wx,backgroundCube_frag:Xx,cube_vert:qx,cube_frag:Yx,depth_vert:$x,depth_frag:jx,distanceRGBA_vert:Zx,distanceRGBA_frag:Kx,equirect_vert:Jx,equirect_frag:Qx,linedashed_vert:ty,linedashed_frag:ey,meshbasic_vert:ny,meshbasic_frag:iy,meshlambert_vert:sy,meshlambert_frag:ry,meshmatcap_vert:oy,meshmatcap_frag:ay,meshnormal_vert:ly,meshnormal_frag:cy,meshphong_vert:hy,meshphong_frag:uy,meshphysical_vert:dy,meshphysical_frag:fy,meshtoon_vert:py,meshtoon_frag:my,points_vert:gy,points_frag:vy,shadow_vert:xy,shadow_frag:yy,sprite_vert:_y,sprite_frag:My},St={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},ui={basic:{uniforms:un([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:un([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ee(0)}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:un([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:un([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:un([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new ee(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:un([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:un([St.points,St.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:un([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:un([St.common,St.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:un([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:un([St.sprite,St.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distanceRGBA:{uniforms:un([St.common,St.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distanceRGBA_vert,fragmentShader:jt.distanceRGBA_frag},shadow:{uniforms:un([St.lights,St.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};ui.physical={uniforms:un([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};const Aa={r:0,b:0,g:0},Es=new xi,Sy=new be;function wy(i,t,e,n,s,r,o){const a=new ee(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function p(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function v(M){let _=!1;const C=p(M);C===null?m(a,l):C&&C.isColor&&(m(C,1),_=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){const C=p(_);C&&(C.isCubeTexture||C.mapping===al)?(u===void 0&&(u=new de(new Xs(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Lr(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,P,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Es.copy(_.backgroundRotation),Es.x*=-1,Es.y*=-1,Es.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Es.y*=-1,Es.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Sy.makeRotationFromEuler(Es)),u.material.toneMapped=ce.getTransfer(C.colorSpace)!==_e,(h!==C||d!==C.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new de(new fs(2,2),new Gn({name:"BackgroundMaterial",uniforms:Lr(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:ds,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ce.getTransfer(C.colorSpace)!==_e,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,_){M.getRGB(Aa,Bf(i)),n.buffers.color.setClear(Aa.r,Aa.g,Aa.b,_,o)}function x(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),l=_,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,m(a,l)},render:v,addToRenderList:g,dispose:x}}function by(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(y,R,B,L,H){let G=!1;const k=h(L,B,R);r!==k&&(r=k,c(r.object)),G=f(y,L,B,H),G&&p(y,L,B,H),H!==null&&t.update(H,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,_(y,R,B,L),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function h(y,R,B){const L=B.wireframe===!0;let H=n[y.id];H===void 0&&(H={},n[y.id]=H);let G=H[R.id];G===void 0&&(G={},H[R.id]=G);let k=G[L];return k===void 0&&(k=d(l()),G[L]=k),k}function d(y){const R=[],B=[],L=[];for(let H=0;H<e;H++)R[H]=0,B[H]=0,L[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:B,attributeDivisors:L,object:y,attributes:{},index:null}}function f(y,R,B,L){const H=r.attributes,G=R.attributes;let k=0;const K=B.getAttributes();for(const X in K)if(K[X].location>=0){const gt=H[X];let ct=G[X];if(ct===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(ct=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(ct=y.instanceColor)),gt===void 0||gt.attribute!==ct||ct&&gt.data!==ct.data)return!0;k++}return r.attributesNum!==k||r.index!==L}function p(y,R,B,L){const H={},G=R.attributes;let k=0;const K=B.getAttributes();for(const X in K)if(K[X].location>=0){let gt=G[X];gt===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(gt=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(gt=y.instanceColor));const ct={};ct.attribute=gt,gt&&gt.data&&(ct.data=gt.data),H[X]=ct,k++}r.attributes=H,r.attributesNum=k,r.index=L}function v(){const y=r.newAttributes;for(let R=0,B=y.length;R<B;R++)y[R]=0}function g(y){m(y,0)}function m(y,R){const B=r.newAttributes,L=r.enabledAttributes,H=r.attributeDivisors;B[y]=1,L[y]===0&&(i.enableVertexAttribArray(y),L[y]=1),H[y]!==R&&(i.vertexAttribDivisor(y,R),H[y]=R)}function x(){const y=r.newAttributes,R=r.enabledAttributes;for(let B=0,L=R.length;B<L;B++)R[B]!==y[B]&&(i.disableVertexAttribArray(B),R[B]=0)}function M(y,R,B,L,H,G,k){k===!0?i.vertexAttribIPointer(y,R,B,H,G):i.vertexAttribPointer(y,R,B,L,H,G)}function _(y,R,B,L){v();const H=L.attributes,G=B.getAttributes(),k=R.defaultAttributeValues;for(const K in G){const X=G[K];if(X.location>=0){let rt=H[K];if(rt===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(rt=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(rt=y.instanceColor)),rt!==void 0){const gt=rt.normalized,ct=rt.itemSize,ht=t.get(rt);if(ht===void 0)continue;const kt=ht.buffer,ne=ht.type,$t=ht.bytesPerElement,st=ne===i.INT||ne===i.UNSIGNED_INT||rt.gpuType===Rh;if(rt.isInterleavedBufferAttribute){const ot=rt.data,Ct=ot.stride,Ot=rt.offset;if(ot.isInstancedInterleavedBuffer){for(let Dt=0;Dt<X.locationSize;Dt++)m(X.location+Dt,ot.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Dt=0;Dt<X.locationSize;Dt++)g(X.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let Dt=0;Dt<X.locationSize;Dt++)M(X.location+Dt,ct/X.locationSize,ne,gt,Ct*$t,(Ot+ct/X.locationSize*Dt)*$t,st)}else{if(rt.isInstancedBufferAttribute){for(let ot=0;ot<X.locationSize;ot++)m(X.location+ot,rt.meshPerAttribute);y.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let ot=0;ot<X.locationSize;ot++)g(X.location+ot);i.bindBuffer(i.ARRAY_BUFFER,kt);for(let ot=0;ot<X.locationSize;ot++)M(X.location+ot,ct/X.locationSize,ne,gt,ct*$t,ct/X.locationSize*ot*$t,st)}}else if(k!==void 0){const gt=k[K];if(gt!==void 0)switch(gt.length){case 2:i.vertexAttrib2fv(X.location,gt);break;case 3:i.vertexAttrib3fv(X.location,gt);break;case 4:i.vertexAttrib4fv(X.location,gt);break;default:i.vertexAttrib1fv(X.location,gt)}}}}x()}function C(){U();for(const y in n){const R=n[y];for(const B in R){const L=R[B];for(const H in L)u(L[H].object),delete L[H];delete R[B]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;const R=n[y.id];for(const B in R){const L=R[B];for(const H in L)u(L[H].object),delete L[H];delete R[B]}delete n[y.id]}function P(y){for(const R in n){const B=n[R];if(B[y.id]===void 0)continue;const L=B[y.id];for(const H in L)u(L[H].object),delete L[H];delete B[y.id]}}function U(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:U,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function Ey(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let p=0;p<h;p++)f+=u[p];e.update(f,n,1)}function l(c,u,h,d){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],u[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let p=0;for(let v=0;v<h;v++)p+=u[v]*d[v];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Ty(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==jn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){const U=P===No&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==gi&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Oi&&!U)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:C,maxSamples:T}}function Ay(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Cs,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,v=h.clipIntersection,g=h.clipShadows,m=i.get(h);if(!s||p===null||p.length===0||r&&!g)r?u(null):c();else{const x=r?0:n,M=x*4;let _=m.clippingState||null;l.value=_,_=u(p,d,M,f);for(let C=0;C!==M;++C)_[C]=e[C];m.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,p){const v=h!==null?h.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const m=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,_=f;M!==v;++M,_+=4)o.copy(h[M]).applyMatrix4(x,a),o.normal.toArray(g,_),g[_+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Cy(i){let t=new WeakMap;function e(o,a){return a===Lc?o.mapping=Cr:a===Ic&&(o.mapping=Rr),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Lc||a===Ic)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Wg(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const yr=4,vd=[.125,.215,.35,.446,.526,.582],Is=20,sc=new tp,xd=new ee;let rc=null,oc=0,ac=0,lc=!1;const Rs=(1+Math.sqrt(5))/2,fr=1/Rs,yd=[new z(-Rs,fr,0),new z(Rs,fr,0),new z(-fr,0,Rs),new z(fr,0,Rs),new z(0,Rs,-fr),new z(0,Rs,fr),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)],Ry=new z;class _d{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Ry}=r;rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(rc,oc,ac),this._renderer.xr.enabled=lc,t.scissorTest=!1,Ca(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Cr||t.mapping===Rr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),rc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:zn,minFilter:zn,generateMipmaps:!1,type:No,format:jn,colorSpace:Pr,depthBuffer:!1},s=Md(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Md(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Py(r)),this._blurMaterial=Ly(r,t,e)}return s}_compileMaterial(t){const e=new de(this._lodPlanes[0],t);this._renderer.compile(e,sc)}_sceneToCubeUV(t,e,n,s,r){const l=new On(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(xd),h.toneMapping=cs,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const v=new Be({name:"PMREM.Background",side:Mn,depthWrite:!1,depthTest:!1}),g=new de(new Xs,v);let m=!1;const x=t.background;x?x.isColor&&(v.color.copy(x),t.background=null,m=!0):(v.color.copy(xd),m=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));const C=this._cubeSize;Ca(s,_*C,M>2?C:0,C,C),h.setRenderTarget(s),m&&h.render(g,l),h.render(t,l)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Cr||t.mapping===Rr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sd());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new de(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Ca(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,sc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yd[(s-r-1)%yd.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new de(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Is-1),v=r/p,g=isFinite(r)?1+Math.floor(u*v):Is;g>Is&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Is}`);const m=[];let x=0;for(let P=0;P<Is;++P){const U=P/v,b=Math.exp(-U*U/2);m.push(b),P===0?x+=b:P<g&&(x+=2*b)}for(let P=0;P<m.length;P++)m[P]=m[P]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:M}=this;d.dTheta.value=p,d.mipInt.value=M-n;const _=this._sizeLods[s],C=3*_*(s>M-yr?s-M+yr:0),T=4*(this._cubeSize-_);Ca(e,C,T,3*_,2*_),l.setRenderTarget(e),l.render(h,sc)}}function Py(i){const t=[],e=[],n=[];let s=i;const r=i-yr+1+vd.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-yr?l=vd[o-i+yr-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,v=3,g=2,m=1,x=new Float32Array(v*p*f),M=new Float32Array(g*p*f),_=new Float32Array(m*p*f);for(let T=0;T<f;T++){const P=T%3*2/3-1,U=T>2?0:-1,b=[P,U,0,P+2/3,U,0,P+2/3,U+1,0,P,U,0,P+2/3,U+1,0,P,U+1,0];x.set(b,v*p*T),M.set(d,g*p*T);const y=[T,T,T,T,T,T];_.set(y,m*p*T)}const C=new xe;C.setAttribute("position",new Pe(x,v)),C.setAttribute("uv",new Pe(M,g)),C.setAttribute("faceIndex",new Pe(_,m)),t.push(C),s>yr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Md(i,t,e){const n=new ks(i,t,e);return n.texture.mapping=al,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ca(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ly(i,t,e){const n=new Float32Array(Is),s=new z(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:Is,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Gh(),fragmentShader:`

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
		`,blending:ls,depthTest:!1,depthWrite:!1})}function Sd(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gh(),fragmentShader:`

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
		`,blending:ls,depthTest:!1,depthWrite:!1})}function wd(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ls,depthTest:!1,depthWrite:!1})}function Gh(){return`

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
	`}function Iy(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Lc||l===Ic,u=l===Cr||l===Rr;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new _d(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(e===null&&(e=new _d(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Dy(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&vo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Ny(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let M=0,_=x.length;M<_;M+=3){const C=x[M+0],T=x[M+1],P=x[M+2];d.push(C,T,T,P,P,C)}}else if(p!==void 0){const x=p.array;v=p.version;for(let M=0,_=x.length/3-1;M<_;M+=3){const C=M+0,T=M+1,P=M+2;d.push(C,T,T,P,P,C)}}else return;const g=new(If(d)?Of:Ff)(d,1);g.version=v;const m=r.get(h);m&&t.remove(m),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Uy(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,d*o,p),e.update(f,n,p))}function u(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let g=0;for(let m=0;m<p;m++)g+=f[m];e.update(g,n,1)}function h(d,f,p,v){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/o,f[m],v[m]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,p);let m=0;for(let x=0;x<p;x++)m+=f[x]*v[x];e.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Fy(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Oy(i,t,e){const n=new WeakMap,s=new ve;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let y=function(){U.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;p===!0&&(_=1),v===!0&&(_=2),g===!0&&(_=3);let C=a.attributes.position.count*_,T=1;C>t.maxTextureSize&&(T=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const P=new Float32Array(C*T*4*h),U=new Df(P,C,T,h);U.type=Oi,U.needsUpdate=!0;const b=_*4;for(let R=0;R<h;R++){const B=m[R],L=x[R],H=M[R],G=C*T*4*R;for(let k=0;k<B.count;k++){const K=k*b;p===!0&&(s.fromBufferAttribute(B,k),P[G+K+0]=s.x,P[G+K+1]=s.y,P[G+K+2]=s.z,P[G+K+3]=0),v===!0&&(s.fromBufferAttribute(L,k),P[G+K+4]=s.x,P[G+K+5]=s.y,P[G+K+6]=s.z,P[G+K+7]=0),g===!0&&(s.fromBufferAttribute(H,k),P[G+K+8]=s.x,P[G+K+9]=s.y,P[G+K+10]=s.z,P[G+K+11]=H.itemSize===4?s.w:1)}}d={count:h,texture:U,size:new mt(C,T)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const v=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function By(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const np=new an,bd=new Vf(1,1),ip=new Df,sp=new Ag,rp=new kf,Ed=[],Td=[],Ad=new Float32Array(16),Cd=new Float32Array(9),Rd=new Float32Array(4);function kr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ed[s];if(r===void 0&&(r=new Float32Array(s),Ed[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ze(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ul(i,t){let e=Td[t];e===void 0&&(e=new Int32Array(t),Td[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function zy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ky(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2fv(this.addr,t),Ze(e,t)}}function Gy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;i.uniform3fv(this.addr,t),Ze(e,t)}}function Hy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4fv(this.addr,t),Ze(e,t)}}function Vy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ze(e,t)}else{if(je(e,n))return;Rd.set(n),i.uniformMatrix2fv(this.addr,!1,Rd),Ze(e,n)}}function Wy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ze(e,t)}else{if(je(e,n))return;Cd.set(n),i.uniformMatrix3fv(this.addr,!1,Cd),Ze(e,n)}}function Xy(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ze(e,t)}else{if(je(e,n))return;Ad.set(n),i.uniformMatrix4fv(this.addr,!1,Ad),Ze(e,n)}}function qy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Yy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2iv(this.addr,t),Ze(e,t)}}function $y(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3iv(this.addr,t),Ze(e,t)}}function jy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4iv(this.addr,t),Ze(e,t)}}function Zy(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ky(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2uiv(this.addr,t),Ze(e,t)}}function Jy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3uiv(this.addr,t),Ze(e,t)}}function Qy(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4uiv(this.addr,t),Ze(e,t)}}function t_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bd.compareFunction=Lf,r=bd):r=np,e.setTexture2D(t||r,s)}function e_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||sp,s)}function n_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||rp,s)}function i_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ip,s)}function s_(i){switch(i){case 5126:return zy;case 35664:return ky;case 35665:return Gy;case 35666:return Hy;case 35674:return Vy;case 35675:return Wy;case 35676:return Xy;case 5124:case 35670:return qy;case 35667:case 35671:return Yy;case 35668:case 35672:return $y;case 35669:case 35673:return jy;case 5125:return Zy;case 36294:return Ky;case 36295:return Jy;case 36296:return Qy;case 35678:case 36198:case 36298:case 36306:case 35682:return t_;case 35679:case 36299:case 36307:return e_;case 35680:case 36300:case 36308:case 36293:return n_;case 36289:case 36303:case 36311:case 36292:return i_}}function r_(i,t){i.uniform1fv(this.addr,t)}function o_(i,t){const e=kr(t,this.size,2);i.uniform2fv(this.addr,e)}function a_(i,t){const e=kr(t,this.size,3);i.uniform3fv(this.addr,e)}function l_(i,t){const e=kr(t,this.size,4);i.uniform4fv(this.addr,e)}function c_(i,t){const e=kr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function h_(i,t){const e=kr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function u_(i,t){const e=kr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function d_(i,t){i.uniform1iv(this.addr,t)}function f_(i,t){i.uniform2iv(this.addr,t)}function p_(i,t){i.uniform3iv(this.addr,t)}function m_(i,t){i.uniform4iv(this.addr,t)}function g_(i,t){i.uniform1uiv(this.addr,t)}function v_(i,t){i.uniform2uiv(this.addr,t)}function x_(i,t){i.uniform3uiv(this.addr,t)}function y_(i,t){i.uniform4uiv(this.addr,t)}function __(i,t,e){const n=this.cache,s=t.length,r=ul(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||np,r[o])}function M_(i,t,e){const n=this.cache,s=t.length,r=ul(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||sp,r[o])}function S_(i,t,e){const n=this.cache,s=t.length,r=ul(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||rp,r[o])}function w_(i,t,e){const n=this.cache,s=t.length,r=ul(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Ze(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||ip,r[o])}function b_(i){switch(i){case 5126:return r_;case 35664:return o_;case 35665:return a_;case 35666:return l_;case 35674:return c_;case 35675:return h_;case 35676:return u_;case 5124:case 35670:return d_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return v_;case 36295:return x_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return __;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return S_;case 36289:case 36303:case 36311:case 36292:return w_}}class E_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=s_(e.type)}}class T_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=b_(e.type)}}class A_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const cc=/(\w+)(\])?(\[|\.)?/g;function Pd(i,t){i.seq.push(t),i.map[t.id]=t}function C_(i,t,e){const n=i.name,s=n.length;for(cc.lastIndex=0;;){const r=cc.exec(n),o=cc.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Pd(e,c===void 0?new E_(a,i,t):new T_(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new A_(a),Pd(e,h)),e=h}}}class Va{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);C_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Ld(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const R_=37297;let P_=0;function L_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Id=new Yt;function I_(i){ce._getMatrix(Id,ce.workingColorSpace,i);const t=`mat3( ${Id.elements.map(e=>e.toFixed(4))} )`;switch(ce.getTransfer(i)){case ja:return[t,"LinearTransferOETF"];case _e:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Dd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+L_(i.getShaderSource(t),a)}else return r}function D_(i,t){const e=I_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function N_(i,t){let e;switch(t){case km:e="Linear";break;case Gm:e="Reinhard";break;case Hm:e="Cineon";break;case _f:e="ACESFilmic";break;case Wm:e="AgX";break;case Xm:e="Neutral";break;case Vm:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ra=new z;function U_(){ce.getLuminanceCoefficients(Ra);const i=Ra.x.toFixed(4),t=Ra.y.toFixed(4),e=Ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function F_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(oo).join(`
`)}function O_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function B_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function oo(i){return i!==""}function Nd(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ud(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const z_=/^[ \t]*#include +<([\w\d./]+)>/gm;function ph(i){return i.replace(z_,G_)}const k_=new Map;function G_(i,t){let e=jt[t];if(e===void 0){const n=k_.get(t);if(n!==void 0)e=jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ph(e)}const H_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fd(i){return i.replace(H_,V_)}function V_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Od(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function W_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===vf?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===xf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ni&&(t="SHADOWMAP_TYPE_VSM"),t}function X_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Cr:case Rr:t="ENVMAP_TYPE_CUBE";break;case al:t="ENVMAP_TYPE_CUBE_UV";break}return t}function q_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Rr:t="ENVMAP_MODE_REFRACTION";break}return t}function Y_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case yf:t="ENVMAP_BLENDING_MULTIPLY";break;case Bm:t="ENVMAP_BLENDING_MIX";break;case zm:t="ENVMAP_BLENDING_ADD";break}return t}function $_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function j_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=W_(e),c=X_(e),u=q_(e),h=Y_(e),d=$_(e),f=F_(e),p=O_(r),v=s.createProgram();let g,m,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oo).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(oo).join(`
`),m.length>0&&(m+=`
`)):(g=[Od(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(oo).join(`
`),m=[Od(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==cs?"#define TONE_MAPPING":"",e.toneMapping!==cs?jt.tonemapping_pars_fragment:"",e.toneMapping!==cs?N_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,D_("linearToOutputTexel",e.outputColorSpace),U_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(oo).join(`
`)),o=ph(o),o=Nd(o,e),o=Ud(o,e),a=ph(a),a=Nd(a,e),a=Ud(a,e),o=Fd(o),a=Fd(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Uu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Uu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=x+g+o,_=x+m+a,C=Ld(s,s.VERTEX_SHADER,M),T=Ld(s,s.FRAGMENT_SHADER,_);s.attachShader(v,C),s.attachShader(v,T),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(R){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(v)||"",L=s.getShaderInfoLog(C)||"",H=s.getShaderInfoLog(T)||"",G=B.trim(),k=L.trim(),K=H.trim();let X=!0,rt=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,C,T);else{const gt=Dd(s,C,"vertex"),ct=Dd(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+G+`
`+gt+`
`+ct)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(k===""||K==="")&&(rt=!1);rt&&(R.diagnostics={runnable:X,programLog:G,vertexShader:{log:k,prefix:g},fragmentShader:{log:K,prefix:m}})}s.deleteShader(C),s.deleteShader(T),U=new Va(s,v),b=B_(s,v)}let U;this.getUniforms=function(){return U===void 0&&P(this),U};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,R_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=P_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=C,this.fragmentShader=T,this}let Z_=0;class K_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new J_(t),e.set(t,n)),n}}class J_{constructor(t){this.id=Z_++,this.code=t,this.usedTimes=0}}function Q_(i,t,e,n,s,r,o){const a=new Nf,l=new K_,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,y,R,B,L){const H=B.fog,G=L.geometry,k=b.isMeshStandardMaterial?B.environment:null,K=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),X=K&&K.mapping===al?K.image.height:null,rt=p[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const gt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ct=gt!==void 0?gt.length:0;let ht=0;G.morphAttributes.position!==void 0&&(ht=1),G.morphAttributes.normal!==void 0&&(ht=2),G.morphAttributes.color!==void 0&&(ht=3);let kt,ne,$t,st;if(rt){const pe=ui[rt];kt=pe.vertexShader,ne=pe.fragmentShader}else kt=b.vertexShader,ne=b.fragmentShader,l.update(b),$t=l.getVertexShaderID(b),st=l.getFragmentShaderID(b);const ot=i.getRenderTarget(),Ct=i.state.buffers.depth.getReversed(),Ot=L.isInstancedMesh===!0,Dt=L.isBatchedMesh===!0,Kt=!!b.map,fe=!!b.matcap,N=!!K,D=!!b.aoMap,F=!!b.lightMap,I=!!b.bumpMap,V=!!b.normalMap,et=!!b.displacementMap,Z=!!b.emissiveMap,it=!!b.metalnessMap,xt=!!b.roughnessMap,tt=b.anisotropy>0,A=b.clearcoat>0,S=b.dispersion>0,O=b.iridescence>0,$=b.sheen>0,at=b.transmission>0,j=tt&&!!b.anisotropyMap,wt=A&&!!b.clearcoatMap,ut=A&&!!b.clearcoatNormalMap,At=A&&!!b.clearcoatRoughnessMap,Ut=O&&!!b.iridescenceMap,dt=O&&!!b.iridescenceThicknessMap,Tt=$&&!!b.sheenColorMap,Vt=$&&!!b.sheenRoughnessMap,Bt=!!b.specularMap,bt=!!b.specularColorMap,qt=!!b.specularIntensityMap,W=at&&!!b.transmissionMap,vt=at&&!!b.thicknessMap,_t=!!b.gradientMap,It=!!b.alphaMap,ft=b.alphaTest>0,lt=!!b.alphaHash,Ft=!!b.extensions;let Xt=cs;b.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Xt=i.toneMapping);const we={shaderID:rt,shaderType:b.type,shaderName:b.name,vertexShader:kt,fragmentShader:ne,defines:b.defines,customVertexShaderID:$t,customFragmentShaderID:st,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Dt,batchingColor:Dt&&L._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&L.instanceColor!==null,instancingMorph:Ot&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:Pr,alphaToCoverage:!!b.alphaToCoverage,map:Kt,matcap:fe,envMap:N,envMapMode:N&&K.mapping,envMapCubeUVHeight:X,aoMap:D,lightMap:F,bumpMap:I,normalMap:V,displacementMap:d&&et,emissiveMap:Z,normalMapObjectSpace:V&&b.normalMapType===jm,normalMapTangentSpace:V&&b.normalMapType===Pf,metalnessMap:it,roughnessMap:xt,anisotropy:tt,anisotropyMap:j,clearcoat:A,clearcoatMap:wt,clearcoatNormalMap:ut,clearcoatRoughnessMap:At,dispersion:S,iridescence:O,iridescenceMap:Ut,iridescenceThicknessMap:dt,sheen:$,sheenColorMap:Tt,sheenRoughnessMap:Vt,specularMap:Bt,specularColorMap:bt,specularIntensityMap:qt,transmission:at,transmissionMap:W,thicknessMap:vt,gradientMap:_t,opaque:b.transparent===!1&&b.blending===Sr&&b.alphaToCoverage===!1,alphaMap:It,alphaTest:ft,alphaHash:lt,combine:b.combine,mapUv:Kt&&v(b.map.channel),aoMapUv:D&&v(b.aoMap.channel),lightMapUv:F&&v(b.lightMap.channel),bumpMapUv:I&&v(b.bumpMap.channel),normalMapUv:V&&v(b.normalMap.channel),displacementMapUv:et&&v(b.displacementMap.channel),emissiveMapUv:Z&&v(b.emissiveMap.channel),metalnessMapUv:it&&v(b.metalnessMap.channel),roughnessMapUv:xt&&v(b.roughnessMap.channel),anisotropyMapUv:j&&v(b.anisotropyMap.channel),clearcoatMapUv:wt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:ut&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:dt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&v(b.sheenRoughnessMap.channel),specularMapUv:Bt&&v(b.specularMap.channel),specularColorMapUv:bt&&v(b.specularColorMap.channel),specularIntensityMapUv:qt&&v(b.specularIntensityMap.channel),transmissionMapUv:W&&v(b.transmissionMap.channel),thicknessMapUv:vt&&v(b.thicknessMap.channel),alphaMapUv:It&&v(b.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(V||tt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!G.attributes.uv&&(Kt||It),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ct,skinning:L.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ct,morphTextureStride:ht,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Xt,decodeVideoTexture:Kt&&b.map.isVideoTexture===!0&&ce.getTransfer(b.map.colorSpace)===_e,decodeVideoTextureEmissive:Z&&b.emissiveMap.isVideoTexture===!0&&ce.getTransfer(b.emissiveMap.colorSpace)===_e,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Cn,flipSided:b.side===Mn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ft&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&b.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function m(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)y.push(R),y.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(x(y,b),M(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function M(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function _(b){const y=p[b.type];let R;if(y){const B=ui[y];R=kg.clone(B.uniforms)}else R=b.uniforms;return R}function C(b,y){let R;for(let B=0,L=u.length;B<L;B++){const H=u[B];if(H.cacheKey===y){R=H,++R.usedTimes;break}}return R===void 0&&(R=new j_(i,y,b,r),u.push(R)),R}function T(b){if(--b.usedTimes===0){const y=u.indexOf(b);u[y]=u[u.length-1],u.pop(),b.destroy()}}function P(b){l.remove(b)}function U(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:_,acquireProgram:C,releaseProgram:T,releaseShaderCache:P,programs:u,dispose:U}}function tM(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function eM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zd(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,f,p,v,g){let m=i[t];return m===void 0?(m={id:h.id,object:h,geometry:d,material:f,groupOrder:p,renderOrder:h.renderOrder,z:v,group:g},i[t]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=f,m.groupOrder=p,m.renderOrder=h.renderOrder,m.z=v,m.group=g),t++,m}function a(h,d,f,p,v,g){const m=o(h,d,f,p,v,g);f.transmission>0?n.push(m):f.transparent===!0?s.push(m):e.push(m)}function l(h,d,f,p,v,g){const m=o(h,d,f,p,v,g);f.transmission>0?n.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function c(h,d){e.length>1&&e.sort(h||eM),n.length>1&&n.sort(d||Bd),s.length>1&&s.sort(d||Bd)}function u(){for(let h=t,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function nM(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new zd,i.set(n,[o])):s>=r.length?(o=new zd,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function iM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new ee};break;case"SpotLight":e={position:new z,direction:new z,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new z,halfWidth:new z,halfHeight:new z};break}return i[t.id]=e,e}}}function sM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let rM=0;function oM(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function aM(i){const t=new iM,e=sM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);const s=new z,r=new be,o=new be;function a(c){let u=0,h=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,p=0,v=0,g=0,m=0,x=0,M=0,_=0,C=0,T=0,P=0;c.sort(oM);for(let b=0,y=c.length;b<y;b++){const R=c[b],B=R.color,L=R.intensity,H=R.distance,G=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=B.r*L,h+=B.g*L,d+=B.b*L;else if(R.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(R.sh.coefficients[k],L);P++}else if(R.isDirectionalLight){const k=t.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const K=R.shadow,X=e.get(R);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=R.shadow.matrix,x++}n.directional[f]=k,f++}else if(R.isSpotLight){const k=t.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(B).multiplyScalar(L),k.distance=H,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,n.spot[v]=k;const K=R.shadow;if(R.map&&(n.spotLightMap[C]=R.map,C++,K.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[v]=K.matrix,R.castShadow){const X=e.get(R);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.spotShadow[v]=X,n.spotShadowMap[v]=G,_++}v++}else if(R.isRectAreaLight){const k=t.get(R);k.color.copy(B).multiplyScalar(L),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=k,g++}else if(R.isPointLight){const k=t.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){const K=R.shadow,X=e.get(R);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,X.shadowCameraNear=K.camera.near,X.shadowCameraFar=K.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=G,n.pointShadowMatrix[p]=R.shadow.matrix,M++}n.point[p]=k,p++}else if(R.isHemisphereLight){const k=t.get(R);k.skyColor.copy(R.color).multiplyScalar(L),k.groundColor.copy(R.groundColor).multiplyScalar(L),n.hemi[m]=k,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const U=n.hash;(U.directionalLength!==f||U.pointLength!==p||U.spotLength!==v||U.rectAreaLength!==g||U.hemiLength!==m||U.numDirectionalShadows!==x||U.numPointShadows!==M||U.numSpotShadows!==_||U.numSpotMaps!==C||U.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+C-T,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,U.directionalLength=f,U.pointLength=p,U.spotLength=v,U.rectAreaLength=g,U.hemiLength=m,U.numDirectionalShadows=x,U.numPointShadows=M,U.numSpotShadows=_,U.numSpotMaps=C,U.numLightProbes=P,n.version=rM++)}function l(c,u){let h=0,d=0,f=0,p=0,v=0;const g=u.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const M=c[m];if(M.isDirectionalLight){const _=n.directional[h];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),h++}else if(M.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(M.isRectAreaLight){const _=n.rectArea[p];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),o.identity(),r.copy(M.matrixWorld),r.premultiply(g),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),p++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function kd(i){const t=new aM(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function lM(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new kd(i),t.set(s,[a])):r>=o.length?(a=new kd(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const cM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hM=`uniform sampler2D shadow_pass;
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
}`;function uM(i,t,e){let n=new Bh;const s=new mt,r=new mt,o=new ve,a=new U0({depthPacking:$m}),l=new F0,c={},u=e.maxTextureSize,h={[ds]:Mn,[Mn]:ds,[Cn]:Cn},d=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:cM,fragmentShader:hM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new xe;p.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new de(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vf;let m=this.type;this.render=function(T,P,U){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),B=i.state;B.setBlending(ls),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const L=m!==Ni&&this.type===Ni,H=m===Ni&&this.type!==Ni;for(let G=0,k=T.length;G<k;G++){const K=T[G],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const rt=X.getFrameExtents();if(s.multiply(rt),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/rt.x),s.x=r.x*rt.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/rt.y),s.y=r.y*rt.y,X.mapSize.y=r.y)),X.map===null||L===!0||H===!0){const ct=this.type!==Ni?{minFilter:Pn,magFilter:Pn}:{};X.map!==null&&X.map.dispose(),X.map=new ks(s.x,s.y,ct),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const gt=X.getViewportCount();for(let ct=0;ct<gt;ct++){const ht=X.getViewport(ct);o.set(r.x*ht.x,r.y*ht.y,r.x*ht.z,r.y*ht.w),B.viewport(o),X.updateMatrices(K,ct),n=X.getFrustum(),_(P,U,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===Ni&&x(X,U),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(b,y,R)};function x(T,P){const U=t.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new ks(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,U,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,U,f,v,null)}function M(T,P,U,b){let y=null;const R=U.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)y=R;else if(y=U.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const B=y.uuid,L=P.uuid;let H=c[B];H===void 0&&(H={},c[B]=H);let G=H[L];G===void 0&&(G=y.clone(),H[L]=G,P.addEventListener("dispose",C)),y=G}if(y.visible=P.visible,y.wireframe=P.wireframe,b===Ni?y.side=P.shadowSide!==null?P.shadowSide:P.side:y.side=P.shadowSide!==null?P.shadowSide:h[P.side],y.alphaMap=P.alphaMap,y.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,y.map=P.map,y.clipShadows=P.clipShadows,y.clippingPlanes=P.clippingPlanes,y.clipIntersection=P.clipIntersection,y.displacementMap=P.displacementMap,y.displacementScale=P.displacementScale,y.displacementBias=P.displacementBias,y.wireframeLinewidth=P.wireframeLinewidth,y.linewidth=P.linewidth,U.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=i.properties.get(y);B.light=U}return y}function _(T,P,U,b,y){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Ni)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,T.matrixWorld);const L=t.update(T),H=T.material;if(Array.isArray(H)){const G=L.groups;for(let k=0,K=G.length;k<K;k++){const X=G[k],rt=H[X.materialIndex];if(rt&&rt.visible){const gt=M(T,rt,b,y);T.onBeforeShadow(i,T,P,U,L,gt,X),i.renderBufferDirect(U,null,L,gt,T,X),T.onAfterShadow(i,T,P,U,L,gt,X)}}}else if(H.visible){const G=M(T,H,b,y);T.onBeforeShadow(i,T,P,U,L,G,null),i.renderBufferDirect(U,null,L,G,T,null),T.onAfterShadow(i,T,P,U,L,G,null)}}const B=T.children;for(let L=0,H=B.length;L<H;L++)_(B[L],P,U,b,y)}function C(T){T.target.removeEventListener("dispose",C);for(const U in c){const b=c[U],y=T.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const dM={[bc]:Ec,[Tc]:Rc,[Ac]:Pc,[Ar]:Cc,[Ec]:bc,[Rc]:Tc,[Pc]:Ac,[Cc]:Ar};function fM(i,t){function e(){let W=!1;const vt=new ve;let _t=null;const It=new ve(0,0,0,0);return{setMask:function(ft){_t!==ft&&!W&&(i.colorMask(ft,ft,ft,ft),_t=ft)},setLocked:function(ft){W=ft},setClear:function(ft,lt,Ft,Xt,we){we===!0&&(ft*=Xt,lt*=Xt,Ft*=Xt),vt.set(ft,lt,Ft,Xt),It.equals(vt)===!1&&(i.clearColor(ft,lt,Ft,Xt),It.copy(vt))},reset:function(){W=!1,_t=null,It.set(-1,0,0,0)}}}function n(){let W=!1,vt=!1,_t=null,It=null,ft=null;return{setReversed:function(lt){if(vt!==lt){const Ft=t.get("EXT_clip_control");lt?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),vt=lt;const Xt=ft;ft=null,this.setClear(Xt)}},getReversed:function(){return vt},setTest:function(lt){lt?ot(i.DEPTH_TEST):Ct(i.DEPTH_TEST)},setMask:function(lt){_t!==lt&&!W&&(i.depthMask(lt),_t=lt)},setFunc:function(lt){if(vt&&(lt=dM[lt]),It!==lt){switch(lt){case bc:i.depthFunc(i.NEVER);break;case Ec:i.depthFunc(i.ALWAYS);break;case Tc:i.depthFunc(i.LESS);break;case Ar:i.depthFunc(i.LEQUAL);break;case Ac:i.depthFunc(i.EQUAL);break;case Cc:i.depthFunc(i.GEQUAL);break;case Rc:i.depthFunc(i.GREATER);break;case Pc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}It=lt}},setLocked:function(lt){W=lt},setClear:function(lt){ft!==lt&&(vt&&(lt=1-lt),i.clearDepth(lt),ft=lt)},reset:function(){W=!1,_t=null,It=null,ft=null,vt=!1}}}function s(){let W=!1,vt=null,_t=null,It=null,ft=null,lt=null,Ft=null,Xt=null,we=null;return{setTest:function(pe){W||(pe?ot(i.STENCIL_TEST):Ct(i.STENCIL_TEST))},setMask:function(pe){vt!==pe&&!W&&(i.stencilMask(pe),vt=pe)},setFunc:function(pe,bi,ii){(_t!==pe||It!==bi||ft!==ii)&&(i.stencilFunc(pe,bi,ii),_t=pe,It=bi,ft=ii)},setOp:function(pe,bi,ii){(lt!==pe||Ft!==bi||Xt!==ii)&&(i.stencilOp(pe,bi,ii),lt=pe,Ft=bi,Xt=ii)},setLocked:function(pe){W=pe},setClear:function(pe){we!==pe&&(i.clearStencil(pe),we=pe)},reset:function(){W=!1,vt=null,_t=null,It=null,ft=null,lt=null,Ft=null,Xt=null,we=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],p=null,v=!1,g=null,m=null,x=null,M=null,_=null,C=null,T=null,P=new ee(0,0,0),U=0,b=!1,y=null,R=null,B=null,L=null,H=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,K=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(X)[1]),k=K>=1):X.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),k=K>=2);let rt=null,gt={};const ct=i.getParameter(i.SCISSOR_BOX),ht=i.getParameter(i.VIEWPORT),kt=new ve().fromArray(ct),ne=new ve().fromArray(ht);function $t(W,vt,_t,It){const ft=new Uint8Array(4),lt=i.createTexture();i.bindTexture(W,lt),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ft=0;Ft<_t;Ft++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(vt,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,ft):i.texImage2D(vt+Ft,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ft);return lt}const st={};st[i.TEXTURE_2D]=$t(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=$t(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=$t(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=$t(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(Ar),I(!1),V(Lu),ot(i.CULL_FACE),D(ls);function ot(W){u[W]!==!0&&(i.enable(W),u[W]=!0)}function Ct(W){u[W]!==!1&&(i.disable(W),u[W]=!1)}function Ot(W,vt){return h[W]!==vt?(i.bindFramebuffer(W,vt),h[W]=vt,W===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=vt),W===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=vt),!0):!1}function Dt(W,vt){let _t=f,It=!1;if(W){_t=d.get(vt),_t===void 0&&(_t=[],d.set(vt,_t));const ft=W.textures;if(_t.length!==ft.length||_t[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Ft=ft.length;lt<Ft;lt++)_t[lt]=i.COLOR_ATTACHMENT0+lt;_t.length=ft.length,It=!0}}else _t[0]!==i.BACK&&(_t[0]=i.BACK,It=!0);It&&i.drawBuffers(_t)}function Kt(W){return p!==W?(i.useProgram(W),p=W,!0):!1}const fe={[Ls]:i.FUNC_ADD,[Mm]:i.FUNC_SUBTRACT,[Sm]:i.FUNC_REVERSE_SUBTRACT};fe[wm]=i.MIN,fe[bm]=i.MAX;const N={[Em]:i.ZERO,[Tm]:i.ONE,[Am]:i.SRC_COLOR,[Sc]:i.SRC_ALPHA,[Dm]:i.SRC_ALPHA_SATURATE,[Lm]:i.DST_COLOR,[Rm]:i.DST_ALPHA,[Cm]:i.ONE_MINUS_SRC_COLOR,[wc]:i.ONE_MINUS_SRC_ALPHA,[Im]:i.ONE_MINUS_DST_COLOR,[Pm]:i.ONE_MINUS_DST_ALPHA,[Nm]:i.CONSTANT_COLOR,[Um]:i.ONE_MINUS_CONSTANT_COLOR,[Fm]:i.CONSTANT_ALPHA,[Om]:i.ONE_MINUS_CONSTANT_ALPHA};function D(W,vt,_t,It,ft,lt,Ft,Xt,we,pe){if(W===ls){v===!0&&(Ct(i.BLEND),v=!1);return}if(v===!1&&(ot(i.BLEND),v=!0),W!==_m){if(W!==g||pe!==b){if((m!==Ls||_!==Ls)&&(i.blendEquation(i.FUNC_ADD),m=Ls,_=Ls),pe)switch(W){case Sr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case mn:i.blendFunc(i.ONE,i.ONE);break;case Iu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Du:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Sr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case mn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Iu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Du:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}x=null,M=null,C=null,T=null,P.set(0,0,0),U=0,g=W,b=pe}return}ft=ft||vt,lt=lt||_t,Ft=Ft||It,(vt!==m||ft!==_)&&(i.blendEquationSeparate(fe[vt],fe[ft]),m=vt,_=ft),(_t!==x||It!==M||lt!==C||Ft!==T)&&(i.blendFuncSeparate(N[_t],N[It],N[lt],N[Ft]),x=_t,M=It,C=lt,T=Ft),(Xt.equals(P)===!1||we!==U)&&(i.blendColor(Xt.r,Xt.g,Xt.b,we),P.copy(Xt),U=we),g=W,b=!1}function F(W,vt){W.side===Cn?Ct(i.CULL_FACE):ot(i.CULL_FACE);let _t=W.side===Mn;vt&&(_t=!_t),I(_t),W.blending===Sr&&W.transparent===!1?D(ls):D(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),r.setMask(W.colorWrite);const It=W.stencilWrite;a.setTest(It),It&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Z(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):Ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function I(W){y!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),y=W)}function V(W){W!==xm?(ot(i.CULL_FACE),W!==R&&(W===Lu?i.cullFace(i.BACK):W===ym?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ct(i.CULL_FACE),R=W}function et(W){W!==B&&(k&&i.lineWidth(W),B=W)}function Z(W,vt,_t){W?(ot(i.POLYGON_OFFSET_FILL),(L!==vt||H!==_t)&&(i.polygonOffset(vt,_t),L=vt,H=_t)):Ct(i.POLYGON_OFFSET_FILL)}function it(W){W?ot(i.SCISSOR_TEST):Ct(i.SCISSOR_TEST)}function xt(W){W===void 0&&(W=i.TEXTURE0+G-1),rt!==W&&(i.activeTexture(W),rt=W)}function tt(W,vt,_t){_t===void 0&&(rt===null?_t=i.TEXTURE0+G-1:_t=rt);let It=gt[_t];It===void 0&&(It={type:void 0,texture:void 0},gt[_t]=It),(It.type!==W||It.texture!==vt)&&(rt!==_t&&(i.activeTexture(_t),rt=_t),i.bindTexture(W,vt||st[W]),It.type=W,It.texture=vt)}function A(){const W=gt[rt];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function S(){try{i.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function $(){try{i.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function at(){try{i.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function j(){try{i.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function wt(){try{i.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ut(){try{i.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function At(){try{i.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Tt(W){kt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),kt.copy(W))}function Vt(W){ne.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),ne.copy(W))}function Bt(W,vt){let _t=c.get(vt);_t===void 0&&(_t=new WeakMap,c.set(vt,_t));let It=_t.get(W);It===void 0&&(It=i.getUniformBlockIndex(vt,W.name),_t.set(W,It))}function bt(W,vt){const It=c.get(vt).get(W);l.get(vt)!==It&&(i.uniformBlockBinding(vt,It,W.__bindingPointIndex),l.set(vt,It))}function qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},rt=null,gt={},h={},d=new WeakMap,f=[],p=null,v=!1,g=null,m=null,x=null,M=null,_=null,C=null,T=null,P=new ee(0,0,0),U=0,b=!1,y=null,R=null,B=null,L=null,H=null,kt.set(0,0,i.canvas.width,i.canvas.height),ne.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:Ct,bindFramebuffer:Ot,drawBuffers:Dt,useProgram:Kt,setBlending:D,setMaterial:F,setFlipSided:I,setCullFace:V,setLineWidth:et,setPolygonOffset:Z,setScissorTest:it,activeTexture:xt,bindTexture:tt,unbindTexture:A,compressedTexImage2D:S,compressedTexImage3D:O,texImage2D:Ut,texImage3D:dt,updateUBOMapping:Bt,uniformBlockBinding:bt,texStorage2D:ut,texStorage3D:At,texSubImage2D:$,texSubImage3D:at,compressedTexSubImage2D:j,compressedTexSubImage3D:wt,scissor:Tt,viewport:Vt,reset:qt}}function pM(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(A,S){return f?new OffscreenCanvas(A,S):Ka("canvas")}function v(A,S,O){let $=1;const at=tt(A);if((at.width>O||at.height>O)&&($=O/Math.max(at.width,at.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const j=Math.floor($*at.width),wt=Math.floor($*at.height);h===void 0&&(h=p(j,wt));const ut=S?p(j,wt):h;return ut.width=j,ut.height=wt,ut.getContext("2d").drawImage(A,0,0,j,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+j+"x"+wt+")."),ut}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),A;return A}function g(A){return A.generateMipmaps}function m(A){i.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(A,S,O,$,at=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=S;if(S===i.RED&&(O===i.FLOAT&&(j=i.R32F),O===i.HALF_FLOAT&&(j=i.R16F),O===i.UNSIGNED_BYTE&&(j=i.R8)),S===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.R8UI),O===i.UNSIGNED_SHORT&&(j=i.R16UI),O===i.UNSIGNED_INT&&(j=i.R32UI),O===i.BYTE&&(j=i.R8I),O===i.SHORT&&(j=i.R16I),O===i.INT&&(j=i.R32I)),S===i.RG&&(O===i.FLOAT&&(j=i.RG32F),O===i.HALF_FLOAT&&(j=i.RG16F),O===i.UNSIGNED_BYTE&&(j=i.RG8)),S===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RG8UI),O===i.UNSIGNED_SHORT&&(j=i.RG16UI),O===i.UNSIGNED_INT&&(j=i.RG32UI),O===i.BYTE&&(j=i.RG8I),O===i.SHORT&&(j=i.RG16I),O===i.INT&&(j=i.RG32I)),S===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RGB8UI),O===i.UNSIGNED_SHORT&&(j=i.RGB16UI),O===i.UNSIGNED_INT&&(j=i.RGB32UI),O===i.BYTE&&(j=i.RGB8I),O===i.SHORT&&(j=i.RGB16I),O===i.INT&&(j=i.RGB32I)),S===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),O===i.UNSIGNED_INT&&(j=i.RGBA32UI),O===i.BYTE&&(j=i.RGBA8I),O===i.SHORT&&(j=i.RGBA16I),O===i.INT&&(j=i.RGBA32I)),S===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),S===i.RGBA){const wt=at?ja:ce.getTransfer($);O===i.FLOAT&&(j=i.RGBA32F),O===i.HALF_FLOAT&&(j=i.RGBA16F),O===i.UNSIGNED_BYTE&&(j=wt===_e?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function _(A,S){let O;return A?S===null||S===zs||S===fo?O=i.DEPTH24_STENCIL8:S===Oi?O=i.DEPTH32F_STENCIL8:S===uo&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===zs||S===fo?O=i.DEPTH_COMPONENT24:S===Oi?O=i.DEPTH_COMPONENT32F:S===uo&&(O=i.DEPTH_COMPONENT16),O}function C(A,S){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Pn&&A.minFilter!==zn?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function T(A){const S=A.target;S.removeEventListener("dispose",T),U(S),S.isVideoTexture&&u.delete(S)}function P(A){const S=A.target;S.removeEventListener("dispose",P),y(S)}function U(A){const S=n.get(A);if(S.__webglInit===void 0)return;const O=A.source,$=d.get(O);if($){const at=$[S.__cacheKey];at.usedTimes--,at.usedTimes===0&&b(A),Object.keys($).length===0&&d.delete(O)}n.remove(A)}function b(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const O=A.source,$=d.get(O);delete $[S.__cacheKey],o.memory.textures--}function y(A){const S=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let at=0;at<S.__webglFramebuffer[$].length;at++)i.deleteFramebuffer(S.__webglFramebuffer[$][at]);else i.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)i.deleteFramebuffer(S.__webglFramebuffer[$]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const O=A.textures;for(let $=0,at=O.length;$<at;$++){const j=n.get(O[$]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(O[$])}n.remove(A)}let R=0;function B(){R=0}function L(){const A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function H(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function G(A,S){const O=n.get(A);if(A.isVideoTexture&&it(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(O,A,S);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+S)}function k(A,S){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){st(O,A,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+S)}function K(A,S){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){st(O,A,S);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+S)}function X(A,S){const O=n.get(A);if(A.version>0&&O.__version!==A.version){ot(O,A,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+S)}const rt={[Dc]:i.REPEAT,[Us]:i.CLAMP_TO_EDGE,[Nc]:i.MIRRORED_REPEAT},gt={[Pn]:i.NEAREST,[qm]:i.NEAREST_MIPMAP_NEAREST,[Zo]:i.NEAREST_MIPMAP_LINEAR,[zn]:i.LINEAR,[Al]:i.LINEAR_MIPMAP_NEAREST,[Fs]:i.LINEAR_MIPMAP_LINEAR},ct={[Zm]:i.NEVER,[ng]:i.ALWAYS,[Km]:i.LESS,[Lf]:i.LEQUAL,[Jm]:i.EQUAL,[eg]:i.GEQUAL,[Qm]:i.GREATER,[tg]:i.NOTEQUAL};function ht(A,S){if(S.type===Oi&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===zn||S.magFilter===Al||S.magFilter===Zo||S.magFilter===Fs||S.minFilter===zn||S.minFilter===Al||S.minFilter===Zo||S.minFilter===Fs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,rt[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,rt[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,rt[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,gt[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,gt[S.minFilter]),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ct[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Pn||S.minFilter!==Zo&&S.minFilter!==Fs||S.type===Oi&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function kt(A,S){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",T));const $=S.source;let at=d.get($);at===void 0&&(at={},d.set($,at));const j=H(S);if(j!==A.__cacheKey){at[j]===void 0&&(at[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),at[j].usedTimes++;const wt=at[A.__cacheKey];wt!==void 0&&(at[A.__cacheKey].usedTimes--,wt.usedTimes===0&&b(S)),A.__cacheKey=j,A.__webglTexture=at[j].texture}return O}function ne(A,S,O){return Math.floor(Math.floor(A/O)/S)}function $t(A,S,O,$){const j=A.updateRanges;if(j.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,O,$,S.data);else{j.sort((dt,Tt)=>dt.start-Tt.start);let wt=0;for(let dt=1;dt<j.length;dt++){const Tt=j[wt],Vt=j[dt],Bt=Tt.start+Tt.count,bt=ne(Vt.start,S.width,4),qt=ne(Tt.start,S.width,4);Vt.start<=Bt+1&&bt===qt&&ne(Vt.start+Vt.count-1,S.width,4)===bt?Tt.count=Math.max(Tt.count,Vt.start+Vt.count-Tt.start):(++wt,j[wt]=Vt)}j.length=wt+1;const ut=i.getParameter(i.UNPACK_ROW_LENGTH),At=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let dt=0,Tt=j.length;dt<Tt;dt++){const Vt=j[dt],Bt=Math.floor(Vt.start/4),bt=Math.ceil(Vt.count/4),qt=Bt%S.width,W=Math.floor(Bt/S.width),vt=bt,_t=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,W),e.texSubImage2D(i.TEXTURE_2D,0,qt,W,vt,_t,O,$,S.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ut),i.pixelStorei(i.UNPACK_SKIP_PIXELS,At),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function st(A,S,O){let $=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=i.TEXTURE_3D);const at=kt(A,S),j=S.source;e.bindTexture($,A.__webglTexture,i.TEXTURE0+O);const wt=n.get(j);if(j.version!==wt.__version||at===!0){e.activeTexture(i.TEXTURE0+O);const ut=ce.getPrimaries(ce.workingColorSpace),At=S.colorSpace===ss?null:ce.getPrimaries(S.colorSpace),Ut=S.colorSpace===ss||ut===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let dt=v(S.image,!1,s.maxTextureSize);dt=xt(S,dt);const Tt=r.convert(S.format,S.colorSpace),Vt=r.convert(S.type);let Bt=M(S.internalFormat,Tt,Vt,S.colorSpace,S.isVideoTexture);ht($,S);let bt;const qt=S.mipmaps,W=S.isVideoTexture!==!0,vt=wt.__version===void 0||at===!0,_t=j.dataReady,It=C(S,dt);if(S.isDepthTexture)Bt=_(S.format===mo,S.type),vt&&(W?e.texStorage2D(i.TEXTURE_2D,1,Bt,dt.width,dt.height):e.texImage2D(i.TEXTURE_2D,0,Bt,dt.width,dt.height,0,Tt,Vt,null));else if(S.isDataTexture)if(qt.length>0){W&&vt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,qt[0].width,qt[0].height);for(let ft=0,lt=qt.length;ft<lt;ft++)bt=qt[ft],W?_t&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,Tt,Vt,bt.data):e.texImage2D(i.TEXTURE_2D,ft,Bt,bt.width,bt.height,0,Tt,Vt,bt.data);S.generateMipmaps=!1}else W?(vt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,dt.width,dt.height),_t&&$t(S,dt,Tt,Vt)):e.texImage2D(i.TEXTURE_2D,0,Bt,dt.width,dt.height,0,Tt,Vt,dt.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){W&&vt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,qt[0].width,qt[0].height,dt.depth);for(let ft=0,lt=qt.length;ft<lt;ft++)if(bt=qt[ft],S.format!==jn)if(Tt!==null)if(W){if(_t)if(S.layerUpdates.size>0){const Ft=gd(bt.width,bt.height,S.format,S.type);for(const Xt of S.layerUpdates){const we=bt.data.subarray(Xt*Ft/bt.data.BYTES_PER_ELEMENT,(Xt+1)*Ft/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,Xt,bt.width,bt.height,1,Tt,we)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,bt.width,bt.height,dt.depth,Tt,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ft,Bt,bt.width,bt.height,dt.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?_t&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,bt.width,bt.height,dt.depth,Tt,Vt,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ft,Bt,bt.width,bt.height,dt.depth,0,Tt,Vt,bt.data)}else{W&&vt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,qt[0].width,qt[0].height);for(let ft=0,lt=qt.length;ft<lt;ft++)bt=qt[ft],S.format!==jn?Tt!==null?W?_t&&e.compressedTexSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,Tt,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,ft,Bt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?_t&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,Tt,Vt,bt.data):e.texImage2D(i.TEXTURE_2D,ft,Bt,bt.width,bt.height,0,Tt,Vt,bt.data)}else if(S.isDataArrayTexture)if(W){if(vt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,dt.width,dt.height,dt.depth),_t)if(S.layerUpdates.size>0){const ft=gd(dt.width,dt.height,S.format,S.type);for(const lt of S.layerUpdates){const Ft=dt.data.subarray(lt*ft/dt.data.BYTES_PER_ELEMENT,(lt+1)*ft/dt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,lt,dt.width,dt.height,1,Tt,Vt,Ft)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,dt.width,dt.height,dt.depth,Tt,Vt,dt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Bt,dt.width,dt.height,dt.depth,0,Tt,Vt,dt.data);else if(S.isData3DTexture)W?(vt&&e.texStorage3D(i.TEXTURE_3D,It,Bt,dt.width,dt.height,dt.depth),_t&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,dt.width,dt.height,dt.depth,Tt,Vt,dt.data)):e.texImage3D(i.TEXTURE_3D,0,Bt,dt.width,dt.height,dt.depth,0,Tt,Vt,dt.data);else if(S.isFramebufferTexture){if(vt)if(W)e.texStorage2D(i.TEXTURE_2D,It,Bt,dt.width,dt.height);else{let ft=dt.width,lt=dt.height;for(let Ft=0;Ft<It;Ft++)e.texImage2D(i.TEXTURE_2D,Ft,Bt,ft,lt,0,Tt,Vt,null),ft>>=1,lt>>=1}}else if(qt.length>0){if(W&&vt){const ft=tt(qt[0]);e.texStorage2D(i.TEXTURE_2D,It,Bt,ft.width,ft.height)}for(let ft=0,lt=qt.length;ft<lt;ft++)bt=qt[ft],W?_t&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,Tt,Vt,bt):e.texImage2D(i.TEXTURE_2D,ft,Bt,Tt,Vt,bt);S.generateMipmaps=!1}else if(W){if(vt){const ft=tt(dt);e.texStorage2D(i.TEXTURE_2D,It,Bt,ft.width,ft.height)}_t&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Tt,Vt,dt)}else e.texImage2D(i.TEXTURE_2D,0,Bt,Tt,Vt,dt);g(S)&&m($),wt.__version=j.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function ot(A,S,O){if(S.image.length!==6)return;const $=kt(A,S),at=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const j=n.get(at);if(at.version!==j.__version||$===!0){e.activeTexture(i.TEXTURE0+O);const wt=ce.getPrimaries(ce.workingColorSpace),ut=S.colorSpace===ss?null:ce.getPrimaries(S.colorSpace),At=S.colorSpace===ss||wt===ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Ut=S.isCompressedTexture||S.image[0].isCompressedTexture,dt=S.image[0]&&S.image[0].isDataTexture,Tt=[];for(let lt=0;lt<6;lt++)!Ut&&!dt?Tt[lt]=v(S.image[lt],!0,s.maxCubemapSize):Tt[lt]=dt?S.image[lt].image:S.image[lt],Tt[lt]=xt(S,Tt[lt]);const Vt=Tt[0],Bt=r.convert(S.format,S.colorSpace),bt=r.convert(S.type),qt=M(S.internalFormat,Bt,bt,S.colorSpace),W=S.isVideoTexture!==!0,vt=j.__version===void 0||$===!0,_t=at.dataReady;let It=C(S,Vt);ht(i.TEXTURE_CUBE_MAP,S);let ft;if(Ut){W&&vt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,It,qt,Vt.width,Vt.height);for(let lt=0;lt<6;lt++){ft=Tt[lt].mipmaps;for(let Ft=0;Ft<ft.length;Ft++){const Xt=ft[Ft];S.format!==jn?Bt!==null?W?_t&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,0,0,Xt.width,Xt.height,Bt,Xt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,qt,Xt.width,Xt.height,0,Xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,0,0,Xt.width,Xt.height,Bt,bt,Xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,qt,Xt.width,Xt.height,0,Bt,bt,Xt.data)}}}else{if(ft=S.mipmaps,W&&vt){ft.length>0&&It++;const lt=tt(Tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,It,qt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(dt){W?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Tt[lt].width,Tt[lt].height,Bt,bt,Tt[lt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,Tt[lt].width,Tt[lt].height,0,Bt,bt,Tt[lt].data);for(let Ft=0;Ft<ft.length;Ft++){const we=ft[Ft].image[lt].image;W?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,0,0,we.width,we.height,Bt,bt,we.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,qt,we.width,we.height,0,Bt,bt,we.data)}}else{W?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Bt,bt,Tt[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,Bt,bt,Tt[lt]);for(let Ft=0;Ft<ft.length;Ft++){const Xt=ft[Ft];W?_t&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,0,0,Bt,bt,Xt.image[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,qt,Bt,bt,Xt.image[lt])}}}g(S)&&m(i.TEXTURE_CUBE_MAP),j.__version=at.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function Ct(A,S,O,$,at,j){const wt=r.convert(O.format,O.colorSpace),ut=r.convert(O.type),At=M(O.internalFormat,wt,ut,O.colorSpace),Ut=n.get(S),dt=n.get(O);if(dt.__renderTarget=S,!Ut.__hasExternalTextures){const Tt=Math.max(1,S.width>>j),Vt=Math.max(1,S.height>>j);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,j,At,Tt,Vt,S.depth,0,wt,ut,null):e.texImage2D(at,j,At,Tt,Vt,0,wt,ut,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),Z(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,at,dt.__webglTexture,0,et(S)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,at,dt.__webglTexture,j),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(A,S,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer){const $=S.depthTexture,at=$&&$.isDepthTexture?$.type:null,j=_(S.stencilBuffer,at),wt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ut=et(S);Z(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ut,j,S.width,S.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,j,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,j,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,wt,i.RENDERBUFFER,A)}else{const $=S.textures;for(let at=0;at<$.length;at++){const j=$[at],wt=r.convert(j.format,j.colorSpace),ut=r.convert(j.type),At=M(j.internalFormat,wt,ut,j.colorSpace),Ut=et(S);O&&Z(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,At,S.width,S.height):Z(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,At,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,At,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),G(S.depthTexture,0);const at=$.__webglTexture,j=et(S);if(S.depthTexture.format===po)Z(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(S.depthTexture.format===mo)Z(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function Kt(A){const S=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){const at=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",at)};$.addEventListener("dispose",at),S.__depthDisposeCallback=at}S.__boundDepthTexture=$}if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const $=A.texture.mipmaps;$&&$.length>0?Dt(S.__webglFramebuffer[0],A):Dt(S.__webglFramebuffer,A)}else if(O){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=i.createRenderbuffer(),Ot(S.__webglDepthbuffer[$],A,!1);else{const at=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=S.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,j)}}else{const $=A.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ot(S.__webglDepthbuffer,A,!1);else{const at=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,j)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(A,S,O){const $=n.get(A);S!==void 0&&Ct($.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Kt(A)}function N(A){const S=A.texture,O=n.get(A),$=n.get(S);A.addEventListener("dispose",P);const at=A.textures,j=A.isWebGLCubeRenderTarget===!0,wt=at.length>1;if(wt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=S.version,o.memory.textures++),j){O.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[ut]=[];for(let At=0;At<S.mipmaps.length;At++)O.__webglFramebuffer[ut][At]=i.createFramebuffer()}else O.__webglFramebuffer[ut]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let ut=0;ut<S.mipmaps.length;ut++)O.__webglFramebuffer[ut]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(wt)for(let ut=0,At=at.length;ut<At;ut++){const Ut=n.get(at[ut]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&Z(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ut=0;ut<at.length;ut++){const At=at[ut];O.__webglColorRenderbuffer[ut]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ut]);const Ut=r.convert(At.format,At.colorSpace),dt=r.convert(At.type),Tt=M(At.internalFormat,Ut,dt,At.colorSpace,A.isXRRenderTarget===!0),Vt=et(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Tt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ut,i.RENDERBUFFER,O.__webglColorRenderbuffer[ut])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ot(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ht(i.TEXTURE_CUBE_MAP,S);for(let ut=0;ut<6;ut++)if(S.mipmaps&&S.mipmaps.length>0)for(let At=0;At<S.mipmaps.length;At++)Ct(O.__webglFramebuffer[ut][At],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,At);else Ct(O.__webglFramebuffer[ut],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);g(S)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let ut=0,At=at.length;ut<At;ut++){const Ut=at[ut],dt=n.get(Ut);let Tt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Tt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Tt,dt.__webglTexture),ht(Tt,Ut),Ct(O.__webglFramebuffer,A,Ut,i.COLOR_ATTACHMENT0+ut,Tt,0),g(Ut)&&m(Tt)}e.unbindTexture()}else{let ut=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ut=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,$.__webglTexture),ht(ut,S),S.mipmaps&&S.mipmaps.length>0)for(let At=0;At<S.mipmaps.length;At++)Ct(O.__webglFramebuffer[At],A,S,i.COLOR_ATTACHMENT0,ut,At);else Ct(O.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,ut,0);g(S)&&m(ut),e.unbindTexture()}A.depthBuffer&&Kt(A)}function D(A){const S=A.textures;for(let O=0,$=S.length;O<$;O++){const at=S[O];if(g(at)){const j=x(A),wt=n.get(at).__webglTexture;e.bindTexture(j,wt),m(j),e.unbindTexture()}}}const F=[],I=[];function V(A){if(A.samples>0){if(Z(A)===!1){const S=A.textures,O=A.width,$=A.height;let at=i.COLOR_BUFFER_BIT;const j=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,wt=n.get(A),ut=S.length>1;if(ut)for(let Ut=0;Ut<S.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);const At=A.texture.mipmaps;At&&At.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Ut=0;Ut<S.length;Ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),ut){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Ut]);const dt=n.get(S[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,dt,0)}i.blitFramebuffer(0,0,O,$,0,0,O,$,at,i.NEAREST),l===!0&&(F.length=0,I.length=0,F.push(i.COLOR_ATTACHMENT0+Ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(F.push(j),I.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,F))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ut)for(let Ut=0;Ut<S.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,wt.__webglColorRenderbuffer[Ut]);const dt=n.get(S[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,wt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,dt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const S=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function et(A){return Math.min(s.maxSamples,A.samples)}function Z(A){const S=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function it(A){const S=o.render.frame;u.get(A)!==S&&(u.set(A,S),A.update())}function xt(A,S){const O=A.colorSpace,$=A.format,at=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==Pr&&O!==ss&&(ce.getTransfer(O)===_e?($!==jn||at!==gi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),S}function tt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=B,this.setTexture2D=G,this.setTexture2DArray=k,this.setTexture3D=K,this.setTextureCube=X,this.rebindTextures=fe,this.setupRenderTarget=N,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=V,this.setupDepthRenderbuffer=Kt,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=Z}function mM(i,t){function e(n,s=ss){let r;const o=ce.getTransfer(s);if(n===gi)return i.UNSIGNED_BYTE;if(n===Ph)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Lh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===bf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ef)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Sf)return i.BYTE;if(n===wf)return i.SHORT;if(n===uo)return i.UNSIGNED_SHORT;if(n===Rh)return i.INT;if(n===zs)return i.UNSIGNED_INT;if(n===Oi)return i.FLOAT;if(n===No)return i.HALF_FLOAT;if(n===Tf)return i.ALPHA;if(n===Af)return i.RGB;if(n===jn)return i.RGBA;if(n===po)return i.DEPTH_COMPONENT;if(n===mo)return i.DEPTH_STENCIL;if(n===Cf)return i.RED;if(n===Ih)return i.RED_INTEGER;if(n===Rf)return i.RG;if(n===Dh)return i.RG_INTEGER;if(n===Nh)return i.RGBA_INTEGER;if(n===za||n===ka||n===Ga||n===Ha)if(o===_e)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===za)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ha)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===za)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ha)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Uc||n===Fc||n===Oc||n===Bc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Uc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Fc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Oc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Bc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===zc||n===kc||n===Gc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===zc||n===kc)return o===_e?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Gc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Hc||n===Vc||n===Wc||n===Xc||n===qc||n===Yc||n===$c||n===jc||n===Zc||n===Kc||n===Jc||n===Qc||n===th||n===eh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Hc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Yc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$c)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Zc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Jc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qc)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===th)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===eh)return o===_e?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===nh||n===ih||n===sh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===nh)return o===_e?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ih)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===sh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rh||n===oh||n===ah||n===lh)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===rh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===oh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ah)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===lh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===fo?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const gM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vM=`
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

}`;class xM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Wf(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Gn({vertexShader:gM,fragmentShader:vM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new de(new fs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class yM extends Br{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",g=new xM,m={},x=e.getContextAttributes();let M=null,_=null;const C=[],T=[],P=new mt;let U=null;const b=new On;b.viewport=new ve;const y=new On;y.viewport=new ve;const R=[b,y],B=new k0;let L=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(st){let ot=C[st];return ot===void 0&&(ot=new $l,C[st]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(st){let ot=C[st];return ot===void 0&&(ot=new $l,C[st]=ot),ot.getGripSpace()},this.getHand=function(st){let ot=C[st];return ot===void 0&&(ot=new $l,C[st]=ot),ot.getHandSpace()};function G(st){const ot=T.indexOf(st.inputSource);if(ot===-1)return;const Ct=C[ot];Ct!==void 0&&(Ct.update(st.inputSource,st.frame,c||o),Ct.dispatchEvent({type:st.type,data:st.inputSource}))}function k(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",K);for(let st=0;st<C.length;st++){const ot=T[st];ot!==null&&(T[st]=null,C[st].disconnect(ot))}L=null,H=null,g.reset();for(const st in m)delete m[st];t.setRenderTarget(M),f=null,d=null,h=null,s=null,_=null,$t.stop(),n.isPresenting=!1,t.setPixelRatio(U),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(st){r=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(st){a=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(st){c=st},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(st){if(s=st,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",k),s.addEventListener("inputsourceschange",K),x.xrCompatible!==!0&&await e.makeXRCompatible(),U=t.getPixelRatio(),t.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ct=null,Ot=null,Dt=null;x.depth&&(Dt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ct=x.stencil?mo:po,Ot=x.stencil?fo:zs);const Kt={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Kt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new ks(d.textureWidth,d.textureHeight,{format:jn,type:gi,depthTexture:new Vf(d.textureWidth,d.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,Ct),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ct={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Ct),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new ks(f.framebufferWidth,f.framebufferHeight,{format:jn,type:gi,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),$t.setContext(s),$t.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function K(st){for(let ot=0;ot<st.removed.length;ot++){const Ct=st.removed[ot],Ot=T.indexOf(Ct);Ot>=0&&(T[Ot]=null,C[Ot].disconnect(Ct))}for(let ot=0;ot<st.added.length;ot++){const Ct=st.added[ot];let Ot=T.indexOf(Ct);if(Ot===-1){for(let Kt=0;Kt<C.length;Kt++)if(Kt>=T.length){T.push(Ct),Ot=Kt;break}else if(T[Kt]===null){T[Kt]=Ct,Ot=Kt;break}if(Ot===-1)break}const Dt=C[Ot];Dt&&Dt.connect(Ct)}}const X=new z,rt=new z;function gt(st,ot,Ct){X.setFromMatrixPosition(ot.matrixWorld),rt.setFromMatrixPosition(Ct.matrixWorld);const Ot=X.distanceTo(rt),Dt=ot.projectionMatrix.elements,Kt=Ct.projectionMatrix.elements,fe=Dt[14]/(Dt[10]-1),N=Dt[14]/(Dt[10]+1),D=(Dt[9]+1)/Dt[5],F=(Dt[9]-1)/Dt[5],I=(Dt[8]-1)/Dt[0],V=(Kt[8]+1)/Kt[0],et=fe*I,Z=fe*V,it=Ot/(-I+V),xt=it*-I;if(ot.matrixWorld.decompose(st.position,st.quaternion,st.scale),st.translateX(xt),st.translateZ(it),st.matrixWorld.compose(st.position,st.quaternion,st.scale),st.matrixWorldInverse.copy(st.matrixWorld).invert(),Dt[10]===-1)st.projectionMatrix.copy(ot.projectionMatrix),st.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const tt=fe+it,A=N+it,S=et-xt,O=Z+(Ot-xt),$=D*N/A*tt,at=F*N/A*tt;st.projectionMatrix.makePerspective(S,O,$,at,tt,A),st.projectionMatrixInverse.copy(st.projectionMatrix).invert()}}function ct(st,ot){ot===null?st.matrixWorld.copy(st.matrix):st.matrixWorld.multiplyMatrices(ot.matrixWorld,st.matrix),st.matrixWorldInverse.copy(st.matrixWorld).invert()}this.updateCamera=function(st){if(s===null)return;let ot=st.near,Ct=st.far;g.texture!==null&&(g.depthNear>0&&(ot=g.depthNear),g.depthFar>0&&(Ct=g.depthFar)),B.near=y.near=b.near=ot,B.far=y.far=b.far=Ct,(L!==B.near||H!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),L=B.near,H=B.far),B.layers.mask=st.layers.mask|6,b.layers.mask=B.layers.mask&3,y.layers.mask=B.layers.mask&5;const Ot=st.parent,Dt=B.cameras;ct(B,Ot);for(let Kt=0;Kt<Dt.length;Kt++)ct(Dt[Kt],Ot);Dt.length===2?gt(B,b,y):B.projectionMatrix.copy(b.projectionMatrix),ht(st,B,Ot)};function ht(st,ot,Ct){Ct===null?st.matrix.copy(ot.matrixWorld):(st.matrix.copy(Ct.matrixWorld),st.matrix.invert(),st.matrix.multiply(ot.matrixWorld)),st.matrix.decompose(st.position,st.quaternion,st.scale),st.updateMatrixWorld(!0),st.projectionMatrix.copy(ot.projectionMatrix),st.projectionMatrixInverse.copy(ot.projectionMatrixInverse),st.isPerspectiveCamera&&(st.fov=go*2*Math.atan(1/st.projectionMatrix.elements[5]),st.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(st){l=st,d!==null&&(d.fixedFoveation=st),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=st)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(B)},this.getCameraTexture=function(st){return m[st]};let kt=null;function ne(st,ot){if(u=ot.getViewerPose(c||o),p=ot,u!==null){const Ct=u.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Ot=!1;Ct.length!==B.cameras.length&&(B.cameras.length=0,Ot=!0);for(let N=0;N<Ct.length;N++){const D=Ct[N];let F=null;if(f!==null)F=f.getViewport(D);else{const V=h.getViewSubImage(d,D);F=V.viewport,N===0&&(t.setRenderTargetTextures(_,V.colorTexture,V.depthStencilTexture),t.setRenderTarget(_))}let I=R[N];I===void 0&&(I=new On,I.layers.enable(N),I.viewport=new ve,R[N]=I),I.matrix.fromArray(D.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(D.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(F.x,F.y,F.width,F.height),N===0&&(B.matrix.copy(I.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ot===!0&&B.cameras.push(I)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){h=n.getBinding();const N=h.getDepthInformation(Ct[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(Dt&&Dt.includes("camera-access")&&v){t.state.unbindTexture(),h=n.getBinding();for(let N=0;N<Ct.length;N++){const D=Ct[N].camera;if(D){let F=m[D];F||(F=new Wf,m[D]=F);const I=h.getCameraImage(D);F.sourceTexture=I}}}}for(let Ct=0;Ct<C.length;Ct++){const Ot=T[Ct],Dt=C[Ct];Ot!==null&&Dt!==void 0&&Dt.update(Ot,ot,c||o)}kt&&kt(st,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),p=null}const $t=new ep;$t.setAnimationLoop(ne),this.setAnimationLoop=function(st){kt=st},this.dispose=function(){}}}const Ts=new xi,_M=new be;function MM(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Bf(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,x,M,_){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),h(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,_)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,x,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Mn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Mn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const x=t.get(m),M=x.envMap,_=x.envMapRotation;M&&(g.envMap.value=M,Ts.copy(_),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),g.envMapRotation.value.setFromMatrix4(_M.makeRotationFromEuler(Ts)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,x,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*x,g.scale.value=M*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function h(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,x){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Mn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const x=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function SM(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){const _=M.program;n.uniformBlockBinding(x,_)}function c(x,M){let _=s[x.id];_===void 0&&(p(x),_=u(x),s[x.id]=_,x.addEventListener("dispose",g));const C=M.program;n.updateUBOMapping(x,C);const T=t.render.frame;r[x.id]!==T&&(d(x),r[x.id]=T)}function u(x){const M=h();x.__bindingPointIndex=M;const _=i.createBuffer(),C=x.__size,T=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,C,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const M=s[x.id],_=x.uniforms,C=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,P=_.length;T<P;T++){const U=Array.isArray(_[T])?_[T]:[_[T]];for(let b=0,y=U.length;b<y;b++){const R=U[b];if(f(R,T,b,C)===!0){const B=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let H=0;for(let G=0;G<L.length;G++){const k=L[G],K=v(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,B+H,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,H),H+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,M,_,C){const T=x.value,P=M+"_"+_;if(C[P]===void 0)return typeof T=="number"||typeof T=="boolean"?C[P]=T:C[P]=T.clone(),!0;{const U=C[P];if(typeof T=="number"||typeof T=="boolean"){if(U!==T)return C[P]=T,!0}else if(U.equals(T)===!1)return U.copy(T),!0}return!1}function p(x){const M=x.uniforms;let _=0;const C=16;for(let P=0,U=M.length;P<U;P++){const b=Array.isArray(M[P])?M[P]:[M[P]];for(let y=0,R=b.length;y<R;y++){const B=b[y],L=Array.isArray(B.value)?B.value:[B.value];for(let H=0,G=L.length;H<G;H++){const k=L[H],K=v(k),X=_%C,rt=X%K.boundary,gt=X+rt;_+=rt,gt!==0&&C-gt<K.storage&&(_+=C-gt),B.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=_,_+=K.storage}}}const T=_%C;return T>0&&(_+=C-T),x.__size=_,x.__cache={},this}function v(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),M}function g(x){const M=x.target;M.removeEventListener("dispose",g);const _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function m(){for(const x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}class wM{constructor(t={}){const{canvas:e=_g(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const x=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=cs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let C=!1;this._outputColorSpace=_n;let T=0,P=0,U=null,b=-1,y=null;const R=new ve,B=new ve;let L=null;const H=new ee(0);let G=0,k=e.width,K=e.height,X=1,rt=null,gt=null;const ct=new ve(0,0,k,K),ht=new ve(0,0,k,K);let kt=!1;const ne=new Bh;let $t=!1,st=!1;const ot=new be,Ct=new z,Ot=new ve,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Kt=!1;function fe(){return U===null?X:1}let N=n;function D(E,q){return e.getContext(E,q)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ch}`),e.addEventListener("webglcontextlost",_t,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",ft,!1),N===null){const q="webgl2";if(N=D(q,E),N===null)throw D(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let F,I,V,et,Z,it,xt,tt,A,S,O,$,at,j,wt,ut,At,Ut,dt,Tt,Vt,Bt,bt,qt;function W(){F=new Dy(N),F.init(),Bt=new mM(N,F),I=new Ty(N,F,t,Bt),V=new fM(N,F),I.reversedDepthBuffer&&d&&V.buffers.depth.setReversed(!0),et=new Fy(N),Z=new tM,it=new pM(N,F,V,Z,I,Bt,et),xt=new Cy(_),tt=new Iy(_),A=new H0(N),bt=new by(N,A),S=new Ny(N,A,et,bt),O=new By(N,S,A,et),dt=new Oy(N,I,it),ut=new Ay(Z),$=new Q_(_,xt,tt,F,I,bt,ut),at=new MM(_,Z),j=new nM,wt=new lM(F),Ut=new wy(_,xt,tt,V,O,f,l),At=new uM(_,O,I),qt=new SM(N,et,I,V),Tt=new Ey(N,F,et),Vt=new Uy(N,F,et),et.programs=$.programs,_.capabilities=I,_.extensions=F,_.properties=Z,_.renderLists=j,_.shadowMap=At,_.state=V,_.info=et}W();const vt=new yM(_,N);this.xr=vt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=F.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=F.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(E){E!==void 0&&(X=E,this.setSize(k,K,!1))},this.getSize=function(E){return E.set(k,K)},this.setSize=function(E,q,J=!0){if(vt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=E,K=q,e.width=Math.floor(E*X),e.height=Math.floor(q*X),J===!0&&(e.style.width=E+"px",e.style.height=q+"px"),this.setViewport(0,0,E,q)},this.getDrawingBufferSize=function(E){return E.set(k*X,K*X).floor()},this.setDrawingBufferSize=function(E,q,J){k=E,K=q,X=J,e.width=Math.floor(E*J),e.height=Math.floor(q*J),this.setViewport(0,0,E,q)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(ct)},this.setViewport=function(E,q,J,Q){E.isVector4?ct.set(E.x,E.y,E.z,E.w):ct.set(E,q,J,Q),V.viewport(R.copy(ct).multiplyScalar(X).round())},this.getScissor=function(E){return E.copy(ht)},this.setScissor=function(E,q,J,Q){E.isVector4?ht.set(E.x,E.y,E.z,E.w):ht.set(E,q,J,Q),V.scissor(B.copy(ht).multiplyScalar(X).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(E){V.setScissorTest(kt=E)},this.setOpaqueSort=function(E){rt=E},this.setTransparentSort=function(E){gt=E},this.getClearColor=function(E){return E.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(E=!0,q=!0,J=!0){let Q=0;if(E){let Y=!1;if(U!==null){const pt=U.texture.format;Y=pt===Nh||pt===Dh||pt===Ih}if(Y){const pt=U.texture.type,Et=pt===gi||pt===zs||pt===uo||pt===fo||pt===Ph||pt===Lh,Nt=Ut.getClearColor(),Pt=Ut.getClearAlpha(),Ht=Nt.r,Wt=Nt.g,zt=Nt.b;Et?(p[0]=Ht,p[1]=Wt,p[2]=zt,p[3]=Pt,N.clearBufferuiv(N.COLOR,0,p)):(v[0]=Ht,v[1]=Wt,v[2]=zt,v[3]=Pt,N.clearBufferiv(N.COLOR,0,v))}else Q|=N.COLOR_BUFFER_BIT}q&&(Q|=N.DEPTH_BUFFER_BIT),J&&(Q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",_t,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),Ut.dispose(),j.dispose(),wt.dispose(),Z.dispose(),xt.dispose(),tt.dispose(),O.dispose(),bt.dispose(),qt.dispose(),$.dispose(),vt.dispose(),vt.removeEventListener("sessionstart",ii),vt.removeEventListener("sessionend",Eu),ys.stop()};function _t(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const E=et.autoReset,q=At.enabled,J=At.autoUpdate,Q=At.needsUpdate,Y=At.type;W(),et.autoReset=E,At.enabled=q,At.autoUpdate=J,At.needsUpdate=Q,At.type=Y}function ft(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function lt(E){const q=E.target;q.removeEventListener("dispose",lt),Ft(q)}function Ft(E){Xt(E),Z.remove(E)}function Xt(E){const q=Z.get(E).programs;q!==void 0&&(q.forEach(function(J){$.releaseProgram(J)}),E.isShaderMaterial&&$.releaseShaderCache(E))}this.renderBufferDirect=function(E,q,J,Q,Y,pt){q===null&&(q=Dt);const Et=Y.isMesh&&Y.matrixWorld.determinant()<0,Nt=dm(E,q,J,Q,Y);V.setMaterial(Q,Et);let Pt=J.index,Ht=1;if(Q.wireframe===!0){if(Pt=S.getWireframeAttribute(J),Pt===void 0)return;Ht=2}const Wt=J.drawRange,zt=J.attributes.position;let ie=Wt.start*Ht,ye=(Wt.start+Wt.count)*Ht;pt!==null&&(ie=Math.max(ie,pt.start*Ht),ye=Math.min(ye,(pt.start+pt.count)*Ht)),Pt!==null?(ie=Math.max(ie,0),ye=Math.min(ye,Pt.count)):zt!=null&&(ie=Math.max(ie,0),ye=Math.min(ye,zt.count));const Oe=ye-ie;if(Oe<0||Oe===1/0)return;bt.setup(Y,Q,Nt,J,Pt);let Ee,Se=Tt;if(Pt!==null&&(Ee=A.get(Pt),Se=Vt,Se.setIndex(Ee)),Y.isMesh)Q.wireframe===!0?(V.setLineWidth(Q.wireframeLinewidth*fe()),Se.setMode(N.LINES)):Se.setMode(N.TRIANGLES);else if(Y.isLine){let Gt=Q.linewidth;Gt===void 0&&(Gt=1),V.setLineWidth(Gt*fe()),Y.isLineSegments?Se.setMode(N.LINES):Y.isLineLoop?Se.setMode(N.LINE_LOOP):Se.setMode(N.LINE_STRIP)}else Y.isPoints?Se.setMode(N.POINTS):Y.isSprite&&Se.setMode(N.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)vo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Se.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(F.get("WEBGL_multi_draw"))Se.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Gt=Y._multiDrawStarts,Ie=Y._multiDrawCounts,ae=Y._multiDrawCount,wn=Pt?A.get(Pt).bytesPerElement:1,js=Z.get(Q).currentProgram.getUniforms();for(let bn=0;bn<ae;bn++)js.setValue(N,"_gl_DrawID",bn),Se.render(Gt[bn]/wn,Ie[bn])}else if(Y.isInstancedMesh)Se.renderInstances(ie,Oe,Y.count);else if(J.isInstancedBufferGeometry){const Gt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ie=Math.min(J.instanceCount,Gt);Se.renderInstances(ie,Oe,Ie)}else Se.render(ie,Oe)};function we(E,q,J){E.transparent===!0&&E.side===Cn&&E.forceSinglePass===!1?(E.side=Mn,E.needsUpdate=!0,jo(E,q,J),E.side=ds,E.needsUpdate=!0,jo(E,q,J),E.side=Cn):jo(E,q,J)}this.compile=function(E,q,J=null){J===null&&(J=E),m=wt.get(J),m.init(q),M.push(m),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),E!==J&&E.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),m.setupLights();const Q=new Set;return E.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const pt=Y.material;if(pt)if(Array.isArray(pt))for(let Et=0;Et<pt.length;Et++){const Nt=pt[Et];we(Nt,J,Y),Q.add(Nt)}else we(pt,J,Y),Q.add(pt)}),m=M.pop(),Q},this.compileAsync=function(E,q,J=null){const Q=this.compile(E,q,J);return new Promise(Y=>{function pt(){if(Q.forEach(function(Et){Z.get(Et).currentProgram.isReady()&&Q.delete(Et)}),Q.size===0){Y(E);return}setTimeout(pt,10)}F.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let pe=null;function bi(E){pe&&pe(E)}function ii(){ys.stop()}function Eu(){ys.start()}const ys=new ep;ys.setAnimationLoop(bi),typeof self<"u"&&ys.setContext(self),this.setAnimationLoop=function(E){pe=E,vt.setAnimationLoop(E),E===null?ys.stop():ys.start()},vt.addEventListener("sessionstart",ii),vt.addEventListener("sessionend",Eu),this.render=function(E,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),vt.enabled===!0&&vt.isPresenting===!0&&(vt.cameraAutoUpdate===!0&&vt.updateCamera(q),q=vt.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,q,U),m=wt.get(E,M.length),m.init(q),M.push(m),ot.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),ne.setFromProjectionMatrix(ot,di,q.reversedDepth),st=this.localClippingEnabled,$t=ut.init(this.clippingPlanes,st),g=j.get(E,x.length),g.init(),x.push(g),vt.enabled===!0&&vt.isPresenting===!0){const pt=_.xr.getDepthSensingMesh();pt!==null&&El(pt,q,-1/0,_.sortObjects)}El(E,q,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(rt,gt),Kt=vt.enabled===!1||vt.isPresenting===!1||vt.hasDepthSensing()===!1,Kt&&Ut.addToRenderList(g,E),this.info.render.frame++,$t===!0&&ut.beginShadows();const J=m.state.shadowsArray;At.render(J,E,q),$t===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,Y=g.transmissive;if(m.setupLights(),q.isArrayCamera){const pt=q.cameras;if(Y.length>0)for(let Et=0,Nt=pt.length;Et<Nt;Et++){const Pt=pt[Et];Au(Q,Y,E,Pt)}Kt&&Ut.render(E);for(let Et=0,Nt=pt.length;Et<Nt;Et++){const Pt=pt[Et];Tu(g,E,Pt,Pt.viewport)}}else Y.length>0&&Au(Q,Y,E,q),Kt&&Ut.render(E),Tu(g,E,q);U!==null&&P===0&&(it.updateMultisampleRenderTarget(U),it.updateRenderTargetMipmap(U)),E.isScene===!0&&E.onAfterRender(_,E,q),bt.resetDefaultState(),b=-1,y=null,M.pop(),M.length>0?(m=M[M.length-1],$t===!0&&ut.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function El(E,q,J,Q){if(E.visible===!1)return;if(E.layers.test(q.layers)){if(E.isGroup)J=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(q);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ne.intersectsSprite(E)){Q&&Ot.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ot);const Et=O.update(E),Nt=E.material;Nt.visible&&g.push(E,Et,Nt,J,Ot.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ne.intersectsObject(E))){const Et=O.update(E),Nt=E.material;if(Q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ot.copy(E.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),Ot.copy(Et.boundingSphere.center)),Ot.applyMatrix4(E.matrixWorld).applyMatrix4(ot)),Array.isArray(Nt)){const Pt=Et.groups;for(let Ht=0,Wt=Pt.length;Ht<Wt;Ht++){const zt=Pt[Ht],ie=Nt[zt.materialIndex];ie&&ie.visible&&g.push(E,Et,ie,J,Ot.z,zt)}}else Nt.visible&&g.push(E,Et,Nt,J,Ot.z,null)}}const pt=E.children;for(let Et=0,Nt=pt.length;Et<Nt;Et++)El(pt[Et],q,J,Q)}function Tu(E,q,J,Q){const Y=E.opaque,pt=E.transmissive,Et=E.transparent;m.setupLightsView(J),$t===!0&&ut.setGlobalState(_.clippingPlanes,J),Q&&V.viewport(R.copy(Q)),Y.length>0&&$o(Y,q,J),pt.length>0&&$o(pt,q,J),Et.length>0&&$o(Et,q,J),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function Au(E,q,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Q.id]===void 0&&(m.state.transmissionRenderTarget[Q.id]=new ks(1,1,{generateMipmaps:!0,type:F.has("EXT_color_buffer_half_float")||F.has("EXT_color_buffer_float")?No:gi,minFilter:Fs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));const pt=m.state.transmissionRenderTarget[Q.id],Et=Q.viewport||R;pt.setSize(Et.z*_.transmissionResolutionScale,Et.w*_.transmissionResolutionScale);const Nt=_.getRenderTarget(),Pt=_.getActiveCubeFace(),Ht=_.getActiveMipmapLevel();_.setRenderTarget(pt),_.getClearColor(H),G=_.getClearAlpha(),G<1&&_.setClearColor(16777215,.5),_.clear(),Kt&&Ut.render(J);const Wt=_.toneMapping;_.toneMapping=cs;const zt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),m.setupLightsView(Q),$t===!0&&ut.setGlobalState(_.clippingPlanes,Q),$o(E,J,Q),it.updateMultisampleRenderTarget(pt),it.updateRenderTargetMipmap(pt),F.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let ye=0,Oe=q.length;ye<Oe;ye++){const Ee=q[ye],Se=Ee.object,Gt=Ee.geometry,Ie=Ee.material,ae=Ee.group;if(Ie.side===Cn&&Se.layers.test(Q.layers)){const wn=Ie.side;Ie.side=Mn,Ie.needsUpdate=!0,Cu(Se,J,Q,Gt,Ie,ae),Ie.side=wn,Ie.needsUpdate=!0,ie=!0}}ie===!0&&(it.updateMultisampleRenderTarget(pt),it.updateRenderTargetMipmap(pt))}_.setRenderTarget(Nt,Pt,Ht),_.setClearColor(H,G),zt!==void 0&&(Q.viewport=zt),_.toneMapping=Wt}function $o(E,q,J){const Q=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,pt=E.length;Y<pt;Y++){const Et=E[Y],Nt=Et.object,Pt=Et.geometry,Ht=Et.group;let Wt=Et.material;Wt.allowOverride===!0&&Q!==null&&(Wt=Q),Nt.layers.test(J.layers)&&Cu(Nt,q,J,Pt,Wt,Ht)}}function Cu(E,q,J,Q,Y,pt){E.onBeforeRender(_,q,J,Q,Y,pt),E.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),Y.onBeforeRender(_,q,J,Q,E,pt),Y.transparent===!0&&Y.side===Cn&&Y.forceSinglePass===!1?(Y.side=Mn,Y.needsUpdate=!0,_.renderBufferDirect(J,q,Q,Y,E,pt),Y.side=ds,Y.needsUpdate=!0,_.renderBufferDirect(J,q,Q,Y,E,pt),Y.side=Cn):_.renderBufferDirect(J,q,Q,Y,E,pt),E.onAfterRender(_,q,J,Q,Y,pt)}function jo(E,q,J){q.isScene!==!0&&(q=Dt);const Q=Z.get(E),Y=m.state.lights,pt=m.state.shadowsArray,Et=Y.state.version,Nt=$.getParameters(E,Y.state,pt,q,J),Pt=$.getProgramCacheKey(Nt);let Ht=Q.programs;Q.environment=E.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(E.isMeshStandardMaterial?tt:xt).get(E.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&E.envMap===null?q.environmentRotation:E.envMapRotation,Ht===void 0&&(E.addEventListener("dispose",lt),Ht=new Map,Q.programs=Ht);let Wt=Ht.get(Pt);if(Wt!==void 0){if(Q.currentProgram===Wt&&Q.lightsStateVersion===Et)return Pu(E,Nt),Wt}else Nt.uniforms=$.getUniforms(E),E.onBeforeCompile(Nt,_),Wt=$.acquireProgram(Nt,Pt),Ht.set(Pt,Wt),Q.uniforms=Nt.uniforms;const zt=Q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(zt.clippingPlanes=ut.uniform),Pu(E,Nt),Q.needsLights=pm(E),Q.lightsStateVersion=Et,Q.needsLights&&(zt.ambientLightColor.value=Y.state.ambient,zt.lightProbe.value=Y.state.probe,zt.directionalLights.value=Y.state.directional,zt.directionalLightShadows.value=Y.state.directionalShadow,zt.spotLights.value=Y.state.spot,zt.spotLightShadows.value=Y.state.spotShadow,zt.rectAreaLights.value=Y.state.rectArea,zt.ltc_1.value=Y.state.rectAreaLTC1,zt.ltc_2.value=Y.state.rectAreaLTC2,zt.pointLights.value=Y.state.point,zt.pointLightShadows.value=Y.state.pointShadow,zt.hemisphereLights.value=Y.state.hemi,zt.directionalShadowMap.value=Y.state.directionalShadowMap,zt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,zt.spotShadowMap.value=Y.state.spotShadowMap,zt.spotLightMatrix.value=Y.state.spotLightMatrix,zt.spotLightMap.value=Y.state.spotLightMap,zt.pointShadowMap.value=Y.state.pointShadowMap,zt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=Wt,Q.uniformsList=null,Wt}function Ru(E){if(E.uniformsList===null){const q=E.currentProgram.getUniforms();E.uniformsList=Va.seqWithValue(q.seq,E.uniforms)}return E.uniformsList}function Pu(E,q){const J=Z.get(E);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function dm(E,q,J,Q,Y){q.isScene!==!0&&(q=Dt),it.resetTextureUnits();const pt=q.fog,Et=Q.isMeshStandardMaterial?q.environment:null,Nt=U===null?_.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Pr,Pt=(Q.isMeshStandardMaterial?tt:xt).get(Q.envMap||Et),Ht=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Wt=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),zt=!!J.morphAttributes.position,ie=!!J.morphAttributes.normal,ye=!!J.morphAttributes.color;let Oe=cs;Q.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Oe=_.toneMapping);const Ee=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Se=Ee!==void 0?Ee.length:0,Gt=Z.get(Q),Ie=m.state.lights;if($t===!0&&(st===!0||E!==y)){const cn=E===y&&Q.id===b;ut.setState(Q,E,cn)}let ae=!1;Q.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==Ie.state.version||Gt.outputColorSpace!==Nt||Y.isBatchedMesh&&Gt.batching===!1||!Y.isBatchedMesh&&Gt.batching===!0||Y.isBatchedMesh&&Gt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Gt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Gt.instancing===!1||!Y.isInstancedMesh&&Gt.instancing===!0||Y.isSkinnedMesh&&Gt.skinning===!1||!Y.isSkinnedMesh&&Gt.skinning===!0||Y.isInstancedMesh&&Gt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Gt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Gt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Gt.instancingMorph===!1&&Y.morphTexture!==null||Gt.envMap!==Pt||Q.fog===!0&&Gt.fog!==pt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==ut.numPlanes||Gt.numIntersection!==ut.numIntersection)||Gt.vertexAlphas!==Ht||Gt.vertexTangents!==Wt||Gt.morphTargets!==zt||Gt.morphNormals!==ie||Gt.morphColors!==ye||Gt.toneMapping!==Oe||Gt.morphTargetsCount!==Se)&&(ae=!0):(ae=!0,Gt.__version=Q.version);let wn=Gt.currentProgram;ae===!0&&(wn=jo(Q,q,Y));let js=!1,bn=!1,Vr=!1;const De=wn.getUniforms(),Dn=Gt.uniforms;if(V.useProgram(wn.program)&&(js=!0,bn=!0,Vr=!0),Q.id!==b&&(b=Q.id,bn=!0),js||y!==E){V.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),De.setValue(N,"projectionMatrix",E.projectionMatrix),De.setValue(N,"viewMatrix",E.matrixWorldInverse);const xn=De.map.cameraPosition;xn!==void 0&&xn.setValue(N,Ct.setFromMatrixPosition(E.matrixWorld)),I.logarithmicDepthBuffer&&De.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&De.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,bn=!0,Vr=!0)}if(Y.isSkinnedMesh){De.setOptional(N,Y,"bindMatrix"),De.setOptional(N,Y,"bindMatrixInverse");const cn=Y.skeleton;cn&&(cn.boneTexture===null&&cn.computeBoneTexture(),De.setValue(N,"boneTexture",cn.boneTexture,it))}Y.isBatchedMesh&&(De.setOptional(N,Y,"batchingTexture"),De.setValue(N,"batchingTexture",Y._matricesTexture,it),De.setOptional(N,Y,"batchingIdTexture"),De.setValue(N,"batchingIdTexture",Y._indirectTexture,it),De.setOptional(N,Y,"batchingColorTexture"),Y._colorsTexture!==null&&De.setValue(N,"batchingColorTexture",Y._colorsTexture,it));const Nn=J.morphAttributes;if((Nn.position!==void 0||Nn.normal!==void 0||Nn.color!==void 0)&&dt.update(Y,J,wn),(bn||Gt.receiveShadow!==Y.receiveShadow)&&(Gt.receiveShadow=Y.receiveShadow,De.setValue(N,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Dn.envMap.value=Pt,Dn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(Dn.envMapIntensity.value=q.environmentIntensity),bn&&(De.setValue(N,"toneMappingExposure",_.toneMappingExposure),Gt.needsLights&&fm(Dn,Vr),pt&&Q.fog===!0&&at.refreshFogUniforms(Dn,pt),at.refreshMaterialUniforms(Dn,Q,X,K,m.state.transmissionRenderTarget[E.id]),Va.upload(N,Ru(Gt),Dn,it)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Va.upload(N,Ru(Gt),Dn,it),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&De.setValue(N,"center",Y.center),De.setValue(N,"modelViewMatrix",Y.modelViewMatrix),De.setValue(N,"normalMatrix",Y.normalMatrix),De.setValue(N,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const cn=Q.uniformsGroups;for(let xn=0,Tl=cn.length;xn<Tl;xn++){const _s=cn[xn];qt.update(_s,wn),qt.bind(_s,wn)}}return wn}function fm(E,q){E.ambientLightColor.needsUpdate=q,E.lightProbe.needsUpdate=q,E.directionalLights.needsUpdate=q,E.directionalLightShadows.needsUpdate=q,E.pointLights.needsUpdate=q,E.pointLightShadows.needsUpdate=q,E.spotLights.needsUpdate=q,E.spotLightShadows.needsUpdate=q,E.rectAreaLights.needsUpdate=q,E.hemisphereLights.needsUpdate=q}function pm(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(E,q,J){const Q=Z.get(E);Q.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),Z.get(E.texture).__webglTexture=q,Z.get(E.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,q){const J=Z.get(E);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const mm=N.createFramebuffer();this.setRenderTarget=function(E,q=0,J=0){U=E,T=q,P=J;let Q=!0,Y=null,pt=!1,Et=!1;if(E){const Pt=Z.get(E);if(Pt.__useDefaultFramebuffer!==void 0)V.bindFramebuffer(N.FRAMEBUFFER,null),Q=!1;else if(Pt.__webglFramebuffer===void 0)it.setupRenderTarget(E);else if(Pt.__hasExternalTextures)it.rebindTextures(E,Z.get(E.texture).__webglTexture,Z.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const zt=E.depthTexture;if(Pt.__boundDepthTexture!==zt){if(zt!==null&&Z.has(zt)&&(E.width!==zt.image.width||E.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");it.setupDepthRenderbuffer(E)}}const Ht=E.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(Et=!0);const Wt=Z.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Wt[q])?Y=Wt[q][J]:Y=Wt[q],pt=!0):E.samples>0&&it.useMultisampledRTT(E)===!1?Y=Z.get(E).__webglMultisampledFramebuffer:Array.isArray(Wt)?Y=Wt[J]:Y=Wt,R.copy(E.viewport),B.copy(E.scissor),L=E.scissorTest}else R.copy(ct).multiplyScalar(X).floor(),B.copy(ht).multiplyScalar(X).floor(),L=kt;if(J!==0&&(Y=mm),V.bindFramebuffer(N.FRAMEBUFFER,Y)&&Q&&V.drawBuffers(E,Y),V.viewport(R),V.scissor(B),V.setScissorTest(L),pt){const Pt=Z.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+q,Pt.__webglTexture,J)}else if(Et){const Pt=q;for(let Ht=0;Ht<E.textures.length;Ht++){const Wt=Z.get(E.textures[Ht]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ht,Wt.__webglTexture,J,Pt)}}else if(E!==null&&J!==0){const Pt=Z.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Pt.__webglTexture,J)}b=-1},this.readRenderTargetPixels=function(E,q,J,Q,Y,pt,Et,Nt=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Z.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt){V.bindFramebuffer(N.FRAMEBUFFER,Pt);try{const Ht=E.textures[Nt],Wt=Ht.format,zt=Ht.type;if(!I.textureFormatReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!I.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=E.width-Q&&J>=0&&J<=E.height-Y&&(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Nt),N.readPixels(q,J,Q,Y,Bt.convert(Wt),Bt.convert(zt),pt))}finally{const Ht=U!==null?Z.get(U).__webglFramebuffer:null;V.bindFramebuffer(N.FRAMEBUFFER,Ht)}}},this.readRenderTargetPixelsAsync=async function(E,q,J,Q,Y,pt,Et,Nt=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=Z.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt)if(q>=0&&q<=E.width-Q&&J>=0&&J<=E.height-Y){V.bindFramebuffer(N.FRAMEBUFFER,Pt);const Ht=E.textures[Nt],Wt=Ht.format,zt=Ht.type;if(!I.textureFormatReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!I.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ie=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,ie),N.bufferData(N.PIXEL_PACK_BUFFER,pt.byteLength,N.STREAM_READ),E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Nt),N.readPixels(q,J,Q,Y,Bt.convert(Wt),Bt.convert(zt),0);const ye=U!==null?Z.get(U).__webglFramebuffer:null;V.bindFramebuffer(N.FRAMEBUFFER,ye);const Oe=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Mg(N,Oe,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,ie),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,pt),N.deleteBuffer(ie),N.deleteSync(Oe),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,q=null,J=0){const Q=Math.pow(2,-J),Y=Math.floor(E.image.width*Q),pt=Math.floor(E.image.height*Q),Et=q!==null?q.x:0,Nt=q!==null?q.y:0;it.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,Et,Nt,Y,pt),V.unbindTexture()};const gm=N.createFramebuffer(),vm=N.createFramebuffer();this.copyTextureToTexture=function(E,q,J=null,Q=null,Y=0,pt=null){pt===null&&(Y!==0?(vo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),pt=Y,Y=0):pt=0);let Et,Nt,Pt,Ht,Wt,zt,ie,ye,Oe;const Ee=E.isCompressedTexture?E.mipmaps[pt]:E.image;if(J!==null)Et=J.max.x-J.min.x,Nt=J.max.y-J.min.y,Pt=J.isBox3?J.max.z-J.min.z:1,Ht=J.min.x,Wt=J.min.y,zt=J.isBox3?J.min.z:0;else{const Nn=Math.pow(2,-Y);Et=Math.floor(Ee.width*Nn),Nt=Math.floor(Ee.height*Nn),E.isDataArrayTexture?Pt=Ee.depth:E.isData3DTexture?Pt=Math.floor(Ee.depth*Nn):Pt=1,Ht=0,Wt=0,zt=0}Q!==null?(ie=Q.x,ye=Q.y,Oe=Q.z):(ie=0,ye=0,Oe=0);const Se=Bt.convert(q.format),Gt=Bt.convert(q.type);let Ie;q.isData3DTexture?(it.setTexture3D(q,0),Ie=N.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(it.setTexture2DArray(q,0),Ie=N.TEXTURE_2D_ARRAY):(it.setTexture2D(q,0),Ie=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,q.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,q.unpackAlignment);const ae=N.getParameter(N.UNPACK_ROW_LENGTH),wn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),js=N.getParameter(N.UNPACK_SKIP_PIXELS),bn=N.getParameter(N.UNPACK_SKIP_ROWS),Vr=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Ee.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ee.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ht),N.pixelStorei(N.UNPACK_SKIP_ROWS,Wt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,zt);const De=E.isDataArrayTexture||E.isData3DTexture,Dn=q.isDataArrayTexture||q.isData3DTexture;if(E.isDepthTexture){const Nn=Z.get(E),cn=Z.get(q),xn=Z.get(Nn.__renderTarget),Tl=Z.get(cn.__renderTarget);V.bindFramebuffer(N.READ_FRAMEBUFFER,xn.__webglFramebuffer),V.bindFramebuffer(N.DRAW_FRAMEBUFFER,Tl.__webglFramebuffer);for(let _s=0;_s<Pt;_s++)De&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Z.get(E).__webglTexture,Y,zt+_s),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Z.get(q).__webglTexture,pt,Oe+_s)),N.blitFramebuffer(Ht,Wt,Et,Nt,ie,ye,Et,Nt,N.DEPTH_BUFFER_BIT,N.NEAREST);V.bindFramebuffer(N.READ_FRAMEBUFFER,null),V.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(Y!==0||E.isRenderTargetTexture||Z.has(E)){const Nn=Z.get(E),cn=Z.get(q);V.bindFramebuffer(N.READ_FRAMEBUFFER,gm),V.bindFramebuffer(N.DRAW_FRAMEBUFFER,vm);for(let xn=0;xn<Pt;xn++)De?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Nn.__webglTexture,Y,zt+xn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Nn.__webglTexture,Y),Dn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,cn.__webglTexture,pt,Oe+xn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,cn.__webglTexture,pt),Y!==0?N.blitFramebuffer(Ht,Wt,Et,Nt,ie,ye,Et,Nt,N.COLOR_BUFFER_BIT,N.NEAREST):Dn?N.copyTexSubImage3D(Ie,pt,ie,ye,Oe+xn,Ht,Wt,Et,Nt):N.copyTexSubImage2D(Ie,pt,ie,ye,Ht,Wt,Et,Nt);V.bindFramebuffer(N.READ_FRAMEBUFFER,null),V.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Dn?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(Ie,pt,ie,ye,Oe,Et,Nt,Pt,Se,Gt,Ee.data):q.isCompressedArrayTexture?N.compressedTexSubImage3D(Ie,pt,ie,ye,Oe,Et,Nt,Pt,Se,Ee.data):N.texSubImage3D(Ie,pt,ie,ye,Oe,Et,Nt,Pt,Se,Gt,Ee):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,pt,ie,ye,Et,Nt,Se,Gt,Ee.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,pt,ie,ye,Ee.width,Ee.height,Se,Ee.data):N.texSubImage2D(N.TEXTURE_2D,pt,ie,ye,Et,Nt,Se,Gt,Ee);N.pixelStorei(N.UNPACK_ROW_LENGTH,ae),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,wn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,js),N.pixelStorei(N.UNPACK_SKIP_ROWS,bn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Vr),pt===0&&q.generateMipmaps&&N.generateMipmap(Ie),V.unbindTexture()},this.initRenderTarget=function(E){Z.get(E).__webglFramebuffer===void 0&&it.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?it.setTextureCube(E,0):E.isData3DTexture?it.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?it.setTexture2DArray(E,0):it.setTexture2D(E,0),V.unbindTexture()},this.resetState=function(){T=0,P=0,U=null,V.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=ce._getUnpackColorSpace()}}function bM(){const t=new Uint8Array(16384);for(let n=0;n<64;n++)for(let s=0;s<64;s++){const r=Math.hypot((s-31.5)/31.5,(n-31.5)/31.5),o=(n*64+s)*4;t[o]=t[o+1]=t[o+2]=255,t[o+3]=Math.round(Math.max(0,1-r)**3*255)}const e=new $g(t,64,64);return e.magFilter=zn,e.minFilter=zn,e.needsUpdate=!0,e}const Hh=bM();function Vh(i,t,e=!1){const n=new Ae,s=new de(e?new Xi(i*.64,48):new qs(i,20,12),new Be({color:e?400678:t,toneMapped:!1}));e&&(s.position.z=.06),n.add(s);const r=new vs(new $i({map:Hh,color:t,transparent:!0,opacity:.8,depthWrite:!1,blending:mn}));if(r.scale.setScalar(i*(e?5:6)),r.position.z=e?0:i+.03,n.add(r),e)for(let d=0;d<3;d++){const f=new de(new zo(i*(.65+d*.16)-.012,i*(.65+d*.16)+.012,64),new Be({color:t,transparent:!0,opacity:.85-d*.18}));f.position.z=.08+d*.02,n.add(f)}const o=new hl(t,e?6:2,i*(e?6:8),2);o.position.z=.1,n.add(o);const a=new Float32Array(72),l=new Float32Array(24),c=new xe;c.setAttribute("position",new Pe(a,3)),c.setAttribute("heat",new Pe(l,1));const u=new Gn({transparent:!0,depthWrite:!1,blending:mn,uniforms:{tint:{value:new ee(t)},pixelRatio:{value:1},fade:{value:1}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"uniform float fade; uniform vec3 tint; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(tint,vec3(1.),vHeat*.5),pow(1.-r,2.)*vHeat*.8*fade);}"}),h=new Bo(c,u);return h.frustumCulled=!1,n.add(h),n.userData.setFade=d=>{s.material.transparent=!0,s.material.opacity=d,r.material.opacity*=d,u.uniforms.fade.value=d,o.intensity=(e?6:2)*d},n.userData.coreRadius=i,n.userData.animate=(d,f=1)=>{u.uniforms.pixelRatio.value=f,r.material.opacity=.7+Math.sin(d*3)*.08;for(let p=0;p<24;p++){const v=(d*(e?.5:.8)+p/24)%1,g=p*2.39996+v*.8,m=e?i*(.8+v*.8):i+v*(.45+i*.8);a.set([Math.cos(g)*m,Math.sin(g)*m,e?.12:i*.5],p*3),l[p]=(1-v)**2}c.attributes.position.needsUpdate=!0,c.attributes.heat.needsUpdate=!0},n}function op(i){const t=new Ae,e=new vs(new $i({map:Hh,color:7890596,transparent:!0,opacity:.18,depthWrite:!1,blending:mn}));e.scale.setScalar(i*3.1),t.add(e);const n=new de(new Xi(i*.72,48),new Be({color:0,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1,toneMapped:!1}));n.position.z=.12,n.renderOrder=1e3,t.add(n);for(const[s,r]of[[.86,.58],[1,.34]]){const o=new de(new zo(i*s-.018,i*s+.018,72),new Be({color:9074872,transparent:!0,opacity:r,side:Cn,depthWrite:!1}));o.position.z=.14,t.add(o)}return t.userData.coreRadius=i*.72,t.userData.animate=s=>{e.material.opacity=.14+.04*Math.sin(s*2.4)},t.userData.setFade=s=>{t.visible=s>0},t}function ap(i=.22){const t=new Ae,e=new vs(new $i({map:Hh,color:9004208,transparent:!0,opacity:.27,depthWrite:!1,blending:mn}));e.scale.setScalar(i*4.2),t.add(e);const n=new de(new qs(i,18,12),new Be({color:5913209,toneMapped:!1}));n.position.z=.04,t.add(n);const s=[];for(let c=0;c<=64;c++){const u=c/64*Math.PI*2,h=1+.07*Math.sin(u*7)+.04*Math.cos(u*11);s.push(new z(Math.cos(u)*i*1.75*h,Math.sin(u)*i*1.75*h,.08))}const r=new zr(new xe().setFromPoints(s),new ln({color:10121661,transparent:!0,opacity:.55,depthWrite:!1}));t.add(r);const o=new Float32Array(27),a=new xe;a.setAttribute("position",new Pe(o,3).setUsage(vi));const l=new Bo(a,new Hf({color:12027095,size:.055,transparent:!0,opacity:.45,depthWrite:!1}));return t.add(l),t.userData.coreRadius=i,t.userData.animate=c=>{r.rotation.z=c*.25,e.material.opacity=.22+.045*Math.sin(c*2.2);for(let u=0;u<9;u++){const h=(c*.24+u/9)%1,d=u*2.39996+c*.12,f=i*(1.25+h*2);o.set([Math.cos(d)*f,Math.sin(d)*f,.08],u*3)}a.attributes.position.needsUpdate=!0},t.userData.setFade=c=>{t.visible=c>0,n.material.opacity=c,n.material.transparent=!0,r.material.opacity=.55*c,l.material.opacity=.45*c},t}class Zn{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){const t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){const t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){const e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new w);const e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new w);const n=this.elements,s=t.x,r=t.y,o=t.z;return e.x=n[0]*s+n[1]*r+n[2]*o,e.y=n[3]*s+n[4]*r+n[5]*o,e.z=n[6]*s+n[7]*r+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new Zn);const n=this.elements,s=t.elements,r=e.elements,o=n[0],a=n[1],l=n[2],c=n[3],u=n[4],h=n[5],d=n[6],f=n[7],p=n[8],v=s[0],g=s[1],m=s[2],x=s[3],M=s[4],_=s[5],C=s[6],T=s[7],P=s[8];return r[0]=o*v+a*x+l*C,r[1]=o*g+a*M+l*T,r[2]=o*m+a*_+l*P,r[3]=c*v+u*x+h*C,r[4]=c*g+u*M+h*T,r[5]=c*m+u*_+h*P,r[6]=d*v+f*x+p*C,r[7]=d*g+f*M+p*T,r[8]=d*m+f*_+p*P,e}scale(t,e){e===void 0&&(e=new Zn);const n=this.elements,s=e.elements;for(let r=0;r!==3;r++)s[3*r+0]=t.x*n[3*r+0],s[3*r+1]=t.y*n[3*r+1],s[3*r+2]=t.z*n[3*r+2];return e}solve(t,e){e===void 0&&(e=new w);const n=3,s=4,r=[];let o,a;for(o=0;o<n*s;o++)r.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)r[o+s*a]=this.elements[o+3*a];r[3]=t.x,r[7]=t.y,r[11]=t.z;let l=3;const c=l;let u;const h=4;let d;do{if(o=c-l,r[o+s*o]===0){for(a=o+1;a<c;a++)if(r[o+s*a]!==0){u=h;do d=h-u,r[d+s*o]+=r[d+s*a];while(--u);break}}if(r[o+s*o]!==0)for(a=o+1;a<c;a++){const f=r[o+s*a]/r[o+s*o];u=h;do d=h-u,r[d+s*a]=d<=o?0:r[d+s*a]-r[d+s*o]*f;while(--u)}}while(--l);if(e.z=r[2*s+3]/r[2*s+2],e.y=(r[1*s+3]-r[1*s+2]*e.z)/r[1*s+1],e.x=(r[0*s+3]-r[0*s+2]*e.z-r[0*s+1]*e.y)/r[0*s+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new Zn);const e=3,n=6,s=EM;let r,o;for(r=0;r<3;r++)for(o=0;o<3;o++)s[r+n*o]=this.elements[r+3*o];s[3]=1,s[9]=0,s[15]=0,s[4]=0,s[10]=1,s[16]=0,s[5]=0,s[11]=0,s[17]=1;let a=3;const l=a;let c;const u=n;let h;do{if(r=l-a,s[r+n*r]===0){for(o=r+1;o<l;o++)if(s[r+n*o]!==0){c=u;do h=u-c,s[h+n*r]+=s[h+n*o];while(--c);break}}if(s[r+n*r]!==0)for(o=r+1;o<l;o++){const d=s[r+n*o]/s[r+n*r];c=u;do h=u-c,s[h+n*o]=h<=r?0:s[h+n*o]-s[h+n*r]*d;while(--c)}}while(--a);r=2;do{o=r-1;do{const d=s[r+n*o]/s[r+n*r];c=n;do h=n-c,s[h+n*o]=s[h+n*o]-s[h+n*r]*d;while(--c)}while(o--)}while(--r);r=2;do{const d=1/s[r+n*r];c=n;do h=n-c,s[h+n*r]=s[h+n*r]*d;while(--c)}while(r--);r=2;do{o=2;do{if(h=s[e+o+n*r],isNaN(h)||h===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,o,h)}while(o--)}while(r--);return t}setRotationFromQuaternion(t){const e=t.x,n=t.y,s=t.z,r=t.w,o=e+e,a=n+n,l=s+s,c=e*o,u=e*a,h=e*l,d=n*a,f=n*l,p=s*l,v=r*o,g=r*a,m=r*l,x=this.elements;return x[0]=1-(d+p),x[1]=u-m,x[2]=h+g,x[3]=u+m,x[4]=1-(c+p),x[5]=f-v,x[6]=h-g,x[7]=f+v,x[8]=1-(c+d),this}transpose(t){t===void 0&&(t=new Zn);const e=this.elements,n=t.elements;let s;return n[0]=e[0],n[4]=e[4],n[8]=e[8],s=e[1],n[1]=e[3],n[3]=s,s=e[2],n[2]=e[6],n[6]=s,s=e[5],n[5]=e[7],n[7]=s,t}}const EM=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class w{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new w);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z;return e.x=a*r-l*s,e.y=l*n-o*r,e.z=o*s-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new w(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new w(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new Zn([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const t=this.x,e=this.y,n=this.z,s=Math.sqrt(t*t+e*e+n*n);if(s>0){const r=1/s;this.x*=r,this.y*=r,this.z*=r}else this.x=0,this.y=0,this.z=0;return s}unit(t){t===void 0&&(t=new w);const e=this.x,n=this.y,s=this.z;let r=Math.sqrt(e*e+n*n+s*s);return r>0?(r=1/r,t.x=e*r,t.y=n*r,t.z=s*r):(t.x=1,t.y=0,t.z=0),t}length(){const t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return Math.sqrt((r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s))}distanceSquared(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return(r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s)}scale(t,e){e===void 0&&(e=new w);const n=this.x,s=this.y,r=this.z;return e.x=t*n,e.y=t*s,e.z=t*r,e}vmul(t,e){return e===void 0&&(e=new w),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new w),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new w),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){const n=this.length();if(n>0){const s=TM,r=1/n;s.set(this.x*r,this.y*r,this.z*r);const o=AM;Math.abs(s.x)<.9?(o.set(1,0,0),s.cross(o,t)):(o.set(0,1,0),s.cross(o,t)),s.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){const s=this.x,r=this.y,o=this.z;n.x=s+(t.x-s)*e,n.y=r+(t.y-r)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(Gd),Gd.almostEquals(t,e)}clone(){return new w(this.x,this.y,this.z)}}w.ZERO=new w(0,0,0);w.UNIT_X=new w(1,0,0);w.UNIT_Y=new w(0,1,0);w.UNIT_Z=new w(0,0,1);const TM=new w,AM=new w,Gd=new w;class In{constructor(t){t===void 0&&(t={}),this.lowerBound=new w,this.upperBound=new w,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,s){const r=this.lowerBound,o=this.upperBound,a=n;r.copy(t[0]),a&&a.vmult(r,r),o.copy(r);for(let l=1;l<t.length;l++){let c=t[l];a&&(a.vmult(c,Hd),c=Hd),c.x>o.x&&(o.x=c.x),c.x<r.x&&(r.x=c.x),c.y>o.y&&(o.y=c.y),c.y<r.y&&(r.y=c.y),c.z>o.z&&(o.z=c.z),c.z<r.z&&(r.z=c.z)}return e&&(e.vadd(r,r),e.vadd(o,o)),s&&(r.x-=s,r.y-=s,r.z-=s,o.x+=s,o.y+=s,o.z+=s),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new In().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound,o=s.x<=n.x&&n.x<=r.x||e.x<=r.x&&r.x<=n.x,a=s.y<=n.y&&n.y<=r.y||e.y<=r.y&&r.y<=n.y,l=s.z<=n.z&&n.z<=r.z||e.z<=r.z&&r.z<=n.z;return o&&a&&l}volume(){const t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound;return e.x<=s.x&&n.x>=r.x&&e.y<=s.y&&n.y>=r.y&&e.z<=s.z&&n.z>=r.z}getCorners(t,e,n,s,r,o,a,l){const c=this.lowerBound,u=this.upperBound;t.copy(c),e.set(u.x,c.y,c.z),n.set(u.x,u.y,c.z),s.set(c.x,u.y,u.z),r.set(u.x,c.y,u.z),o.set(c.x,u.y,c.z),a.set(c.x,c.y,u.z),l.copy(u)}toLocalFrame(t,e){const n=Vd,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],u=n[6],h=n[7];this.getCorners(s,r,o,a,l,c,u,h);for(let d=0;d!==8;d++){const f=n[d];t.pointToLocal(f,f)}return e.setFromPoints(n)}toWorldFrame(t,e){const n=Vd,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],u=n[6],h=n[7];this.getCorners(s,r,o,a,l,c,u,h);for(let d=0;d!==8;d++){const f=n[d];t.pointToWorld(f,f)}return e.setFromPoints(n)}overlapsRay(t){const{direction:e,from:n}=t,s=1/e.x,r=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*s,l=(this.upperBound.x-n.x)*s,c=(this.lowerBound.y-n.y)*r,u=(this.upperBound.y-n.y)*r,h=(this.lowerBound.z-n.z)*o,d=(this.upperBound.z-n.z)*o,f=Math.max(Math.max(Math.min(a,l),Math.min(c,u)),Math.min(h,d)),p=Math.min(Math.min(Math.max(a,l),Math.max(c,u)),Math.max(h,d));return!(p<0||f>p)}}const Hd=new w,Vd=[new w,new w,new w,new w,new w,new w,new w,new w];class Wd{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:s}=e;if(s>n){const r=s;s=n,n=r}return this.matrix[(n*(n+1)>>1)+s-1]}set(t,e,n){let{index:s}=t,{index:r}=e;if(r>s){const o=r;r=s,s=o}this.matrix[(s*(s+1)>>1)+r-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}}class lp{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;const n=this._listeners;if(n[t]===void 0)return this;const s=n[t].indexOf(e);return s!==-1&&n[t].splice(s,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;const n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let s=0,r=n.length;s<r;s++)n[s].call(this,t)}return this}}class Ve{constructor(t,e,n,s){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),s===void 0&&(s=1),this.x=t,this.y=e,this.z=n,this.w=s}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){const n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new w),this.normalize();const e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){const n=CM,s=RM;t.tangents(n,s),this.setFromAxisAngle(n,Math.PI)}else{const n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new Ve);const n=this.x,s=this.y,r=this.z,o=this.w,a=t.x,l=t.y,c=t.z,u=t.w;return e.x=n*u+o*a+s*c-r*l,e.y=s*u+o*l+r*a-n*c,e.z=r*u+o*c+n*l-s*a,e.w=o*u-n*a-s*l-r*c,e}inverse(t){t===void 0&&(t=new Ve);const e=this.x,n=this.y,s=this.z,r=this.w;this.conjugate(t);const o=1/(e*e+n*n+s*s+r*r);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new Ve),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){const t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new w);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z,c=this.w,u=c*n+a*r-l*s,h=c*s+l*n-o*r,d=c*r+o*s-a*n,f=-o*n-a*s-l*r;return e.x=u*c+f*-o+h*-l-d*-a,e.y=h*c+f*-a+d*-o-u*-l,e.z=d*c+f*-l+u*-a-h*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,s,r;const o=this.x,a=this.y,l=this.z,c=this.w;switch(e){case"YZX":const u=o*a+l*c;if(u>.499&&(n=2*Math.atan2(o,c),s=Math.PI/2,r=0),u<-.499&&(n=-2*Math.atan2(o,c),s=-Math.PI/2,r=0),n===void 0){const h=o*o,d=a*a,f=l*l;n=Math.atan2(2*a*c-2*o*l,1-2*d-2*f),s=Math.asin(2*u),r=Math.atan2(2*o*c-2*a*l,1-2*h-2*f)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=s,t.x=r}setFromEuler(t,e,n,s){s===void 0&&(s="XYZ");const r=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),l=Math.sin(t/2),c=Math.sin(e/2),u=Math.sin(n/2);return s==="XYZ"?(this.x=l*o*a+r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a-l*c*u):s==="YXZ"?(this.x=l*o*a+r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a+l*c*u):s==="ZXY"?(this.x=l*o*a-r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a-l*c*u):s==="ZYX"?(this.x=l*o*a-r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a+l*c*u):s==="YZX"?(this.x=l*o*a+r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a-l*c*u):s==="XZY"&&(this.x=l*o*a-r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a+l*c*u),this}clone(){return new Ve(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new Ve);const s=this.x,r=this.y,o=this.z,a=this.w;let l=t.x,c=t.y,u=t.z,h=t.w,d,f,p,v,g;return f=s*l+r*c+o*u+a*h,f<0&&(f=-f,l=-l,c=-c,u=-u,h=-h),1-f>1e-6?(d=Math.acos(f),p=Math.sin(d),v=Math.sin((1-e)*d)/p,g=Math.sin(e*d)/p):(v=1-e,g=e),n.x=v*s+g*l,n.y=v*r+g*c,n.z=v*o+g*u,n.w=v*a+g*h,n}integrate(t,e,n,s){s===void 0&&(s=new Ve);const r=t.x*n.x,o=t.y*n.y,a=t.z*n.z,l=this.x,c=this.y,u=this.z,h=this.w,d=e*.5;return s.x+=d*(r*h+o*u-a*c),s.y+=d*(o*h+a*l-r*u),s.z+=d*(a*h+r*c-o*l),s.w+=d*(-r*l-o*c-a*u),s}}const CM=new w,RM=new w,PM={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class Lt{constructor(t){t===void 0&&(t={}),this.id=Lt.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,s){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}Lt.idCounter=0;Lt.types=PM;class he{constructor(t){t===void 0&&(t={}),this.position=new w,this.quaternion=new Ve,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return he.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return he.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new w),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,s){return s===void 0&&(s=new w),n.vsub(t,s),e.conjugate(Xd),Xd.vmult(s,s),s}static pointToWorldFrame(t,e,n,s){return s===void 0&&(s=new w),e.vmult(n,s),s.vadd(t,s),s}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new w),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,s){return s===void 0&&(s=new w),e.w*=-1,e.vmult(n,s),e.w*=-1,s}}const Xd=new Ve;class Er extends Lt{constructor(t){t===void 0&&(t={});const{vertices:e=[],faces:n=[],normals:s=[],axes:r,boundingSphereRadius:o}=t;super({type:Lt.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=s,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=r?r.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;const s=new w;for(let r=0;r!==t.length;r++){const o=t[r],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;e[o[l]].vsub(e[o[c]],s),s.normalize();let u=!1;for(let h=0;h!==n.length;h++)if(n[h].almostEquals(s)||n[h].almostEquals(s)){u=!0;break}u||n.push(s.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let s=0;s<this.faces[t].length;s++)if(!this.vertices[this.faces[t][s]])throw new Error(`Vertex ${this.faces[t][s]} not found!`);const e=this.faceNormals[t]||new w;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;const n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let s=0;s<this.faces[t].length;s++)console.warn(`.vertices[${this.faces[t][s]}] = Vec3(${this.vertices[this.faces[t][s]].toString()})`)}}}getFaceNormal(t,e){const n=this.faces[t],s=this.vertices[n[0]],r=this.vertices[n[1]],o=this.vertices[n[2]];Er.computeNormal(s,r,o,e)}static computeNormal(t,e,n,s){const r=new w,o=new w;e.vsub(t,o),n.vsub(e,r),r.cross(o,s),s.isZero()||s.normalize()}clipAgainstHull(t,e,n,s,r,o,a,l,c){const u=new w;let h=-1,d=-Number.MAX_VALUE;for(let p=0;p<n.faces.length;p++){u.copy(n.faceNormals[p]),r.vmult(u,u);const v=u.dot(o);v>d&&(d=v,h=p)}const f=[];for(let p=0;p<n.faces[h].length;p++){const v=n.vertices[n.faces[h][p]],g=new w;g.copy(v),r.vmult(g,g),s.vadd(g,g),f.push(g)}h>=0&&this.clipFaceAgainstHull(o,t,e,f,a,l,c)}findSeparatingAxis(t,e,n,s,r,o,a,l){const c=new w,u=new w,h=new w,d=new w,f=new w,p=new w;let v=Number.MAX_VALUE;const g=this;if(g.uniqueAxes)for(let m=0;m!==g.uniqueAxes.length;m++){n.vmult(g.uniqueAxes[m],c);const x=g.testSepAxis(c,t,e,n,s,r);if(x===!1)return!1;x<v&&(v=x,o.copy(c))}else{const m=a?a.length:g.faces.length;for(let x=0;x<m;x++){const M=a?a[x]:x;c.copy(g.faceNormals[M]),n.vmult(c,c);const _=g.testSepAxis(c,t,e,n,s,r);if(_===!1)return!1;_<v&&(v=_,o.copy(c))}}if(t.uniqueAxes)for(let m=0;m!==t.uniqueAxes.length;m++){r.vmult(t.uniqueAxes[m],u);const x=g.testSepAxis(u,t,e,n,s,r);if(x===!1)return!1;x<v&&(v=x,o.copy(u))}else{const m=l?l.length:t.faces.length;for(let x=0;x<m;x++){const M=l?l[x]:x;u.copy(t.faceNormals[M]),r.vmult(u,u);const _=g.testSepAxis(u,t,e,n,s,r);if(_===!1)return!1;_<v&&(v=_,o.copy(u))}}for(let m=0;m!==g.uniqueEdges.length;m++){n.vmult(g.uniqueEdges[m],d);for(let x=0;x!==t.uniqueEdges.length;x++)if(r.vmult(t.uniqueEdges[x],f),d.cross(f,p),!p.almostZero()){p.normalize();const M=g.testSepAxis(p,t,e,n,s,r);if(M===!1)return!1;M<v&&(v=M,o.copy(p))}}return s.vsub(e,h),h.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,s,r,o){const a=this;Er.project(a,t,n,s,hc),Er.project(e,t,r,o,uc);const l=hc[0],c=hc[1],u=uc[0],h=uc[1];if(l<h||u<c)return!1;const d=l-h,f=u-c;return d<f?d:f}calculateLocalInertia(t,e){const n=new w,s=new w;this.computeLocalAABB(s,n);const r=n.x-s.x,o=n.y-s.y,a=n.z-s.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*r*2*r+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*r*2*r)}getPlaneConstantOfFace(t){const e=this.faces[t],n=this.faceNormals[t],s=this.vertices[e[0]];return-n.dot(s)}clipFaceAgainstHull(t,e,n,s,r,o,a){const l=new w,c=new w,u=new w,h=new w,d=new w,f=new w,p=new w,v=new w,g=this,m=[],x=s,M=m;let _=-1,C=Number.MAX_VALUE;for(let y=0;y<g.faces.length;y++){l.copy(g.faceNormals[y]),n.vmult(l,l);const R=l.dot(t);R<C&&(C=R,_=y)}if(_<0)return;const T=g.faces[_];T.connectedFaces=[];for(let y=0;y<g.faces.length;y++)for(let R=0;R<g.faces[y].length;R++)T.indexOf(g.faces[y][R])!==-1&&y!==_&&T.connectedFaces.indexOf(y)===-1&&T.connectedFaces.push(y);const P=T.length;for(let y=0;y<P;y++){const R=g.vertices[T[y]],B=g.vertices[T[(y+1)%P]];R.vsub(B,c),u.copy(c),n.vmult(u,u),e.vadd(u,u),h.copy(this.faceNormals[_]),n.vmult(h,h),e.vadd(h,h),u.cross(h,d),d.negate(d),f.copy(R),n.vmult(f,f),e.vadd(f,f);const L=T.connectedFaces[y];p.copy(this.faceNormals[L]);const H=this.getPlaneConstantOfFace(L);v.copy(p),n.vmult(v,v);const G=H-v.dot(e);for(this.clipFaceAgainstPlane(x,M,v,G);x.length;)x.shift();for(;M.length;)x.push(M.shift())}p.copy(this.faceNormals[_]);const U=this.getPlaneConstantOfFace(_);v.copy(p),n.vmult(v,v);const b=U-v.dot(e);for(let y=0;y<x.length;y++){let R=v.dot(x[y])+b;if(R<=r&&(console.log(`clamped: depth=${R} to minDist=${r}`),R=r),R<=o){const B=x[y];if(R<=1e-6){const L={point:B,normal:v,depth:R};a.push(L)}}}}clipFaceAgainstPlane(t,e,n,s){let r,o;const a=t.length;if(a<2)return e;let l=t[t.length-1],c=t[0];r=n.dot(l)+s;for(let u=0;u<a;u++){if(c=t[u],o=n.dot(c)+s,r<0)if(o<0){const h=new w;h.copy(c),e.push(h)}else{const h=new w;l.lerp(c,r/(r-o),h),e.push(h)}else if(o<0){const h=new w;l.lerp(c,r/(r-o),h),e.push(h),e.push(c)}l=c,r=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new w);const n=this.vertices,s=this.worldVertices;for(let r=0;r!==this.vertices.length;r++)e.vmult(n[r],s[r]),t.vadd(s[r],s[r]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){const n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let s=0;s<this.vertices.length;s++){const r=n[s];r.x<t.x?t.x=r.x:r.x>e.x&&(e.x=r.x),r.y<t.y?t.y=r.y:r.y>e.y&&(e.y=r.y),r.z<t.z?t.z=r.z:r.z>e.z&&(e.z=r.z)}}computeWorldFaceNormals(t){const e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new w);const n=this.faceNormals,s=this.worldFaceNormals;for(let r=0;r!==e;r++)t.vmult(n[r],s[r]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0;const e=this.vertices;for(let n=0;n!==e.length;n++){const s=e[n].lengthSquared();s>t&&(t=s)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,s){const r=this.vertices;let o,a,l,c,u,h,d=new w;for(let f=0;f<r.length;f++){d.copy(r[f]),e.vmult(d,d),t.vadd(d,d);const p=d;(o===void 0||p.x<o)&&(o=p.x),(c===void 0||p.x>c)&&(c=p.x),(a===void 0||p.y<a)&&(a=p.y),(u===void 0||p.y>u)&&(u=p.y),(l===void 0||p.z<l)&&(l=p.z),(h===void 0||p.z>h)&&(h=p.z)}n.set(o,a,l),s.set(c,u,h)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new w);const e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){const n=this.vertices.length,s=this.vertices;if(e){for(let r=0;r<n;r++){const o=s[r];e.vmult(o,o)}for(let r=0;r<this.faceNormals.length;r++){const o=this.faceNormals[r];e.vmult(o,o)}}if(t)for(let r=0;r<n;r++){const o=s[r];o.vadd(t,o)}}pointIsInside(t){const e=this.vertices,n=this.faces,s=this.faceNormals,r=new w;this.getAveragePointLocal(r);for(let o=0;o<this.faces.length;o++){let a=s[o];const l=e[n[o][0]],c=new w;t.vsub(l,c);const u=a.dot(c),h=new w;r.vsub(l,h);const d=a.dot(h);if(u<0&&d>0||u>0&&d<0)return!1}return-1}static project(t,e,n,s,r){const o=t.vertices.length,a=LM;let l=0,c=0;const u=IM,h=t.vertices;u.setZero(),he.vectorToLocalFrame(n,s,e,a),he.pointToLocalFrame(n,s,u,u);const d=u.dot(a);c=l=h[0].dot(a);for(let f=1;f<o;f++){const p=h[f].dot(a);p>l&&(l=p),p<c&&(c=p)}if(c-=d,l-=d,c>l){const f=c;c=l,l=f}r[0]=l,r[1]=c}}const hc=[],uc=[];new w;const LM=new w,IM=new w;class dl extends Lt{constructor(t){super({type:Lt.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,s=w,r=[new s(-t,-e,-n),new s(t,-e,-n),new s(t,e,-n),new s(-t,e,-n),new s(-t,-e,n),new s(t,-e,n),new s(t,e,n),new s(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new s(0,0,1),new s(0,1,0),new s(1,0,0)],l=new Er({vertices:r,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new w),dl.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){const s=t;n.x=1/12*e*(2*s.y*2*s.y+2*s.z*2*s.z),n.y=1/12*e*(2*s.x*2*s.x+2*s.z*2*s.z),n.z=1/12*e*(2*s.y*2*s.y+2*s.x*2*s.x)}getSideNormals(t,e){const n=t,s=this.halfExtents;if(n[0].set(s.x,0,0),n[1].set(0,s.y,0),n[2].set(0,0,s.z),n[3].set(-s.x,0,0),n[4].set(0,-s.y,0),n[5].set(0,0,-s.z),e!==void 0)for(let r=0;r!==n.length;r++)e.vmult(n[r],n[r]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){const s=this.halfExtents,r=[[s.x,s.y,s.z],[-s.x,s.y,s.z],[-s.x,-s.y,s.z],[-s.x,-s.y,-s.z],[s.x,-s.y,-s.z],[s.x,s.y,-s.z],[-s.x,s.y,-s.z],[s.x,-s.y,s.z]];for(let o=0;o<r.length;o++)is.set(r[o][0],r[o][1],r[o][2]),e.vmult(is,is),t.vadd(is,is),n(is.x,is.y,is.z)}calculateWorldAABB(t,e,n,s){const r=this.halfExtents;si[0].set(r.x,r.y,r.z),si[1].set(-r.x,r.y,r.z),si[2].set(-r.x,-r.y,r.z),si[3].set(-r.x,-r.y,-r.z),si[4].set(r.x,-r.y,-r.z),si[5].set(r.x,r.y,-r.z),si[6].set(-r.x,r.y,-r.z),si[7].set(r.x,-r.y,r.z);const o=si[0];e.vmult(o,o),t.vadd(o,o),s.copy(o),n.copy(o);for(let a=1;a<8;a++){const l=si[a];e.vmult(l,l),t.vadd(l,l);const c=l.x,u=l.y,h=l.z;c>s.x&&(s.x=c),u>s.y&&(s.y=u),h>s.z&&(s.z=h),c<n.x&&(n.x=c),u<n.y&&(n.y=u),h<n.z&&(n.z=h)}}}const is=new w,si=[new w,new w,new w,new w,new w,new w,new w,new w],Wh={DYNAMIC:1,STATIC:2,KINEMATIC:4},Xh={AWAKE:0,SLEEPY:1,SLEEPING:2};class Rt extends lp{constructor(t){t===void 0&&(t={}),super(),this.id=Rt.idCounter++,this.index=-1,this.world=null,this.vlambda=new w,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new w,this.previousPosition=new w,this.interpolatedPosition=new w,this.initPosition=new w,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new w,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new w,this.force=new w;const e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?Rt.STATIC:Rt.DYNAMIC,typeof t.type==typeof Rt.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=Rt.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new w,this.quaternion=new Ve,this.initQuaternion=new Ve,this.previousQuaternion=new Ve,this.interpolatedQuaternion=new Ve,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new w,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new w,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new w,this.invInertia=new w,this.invInertiaWorld=new Zn,this.invMassSolve=0,this.invInertiaSolve=new w,this.invInertiaWorldSolve=new Zn,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new w(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new w(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new In,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new w,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){const t=this.sleepState;this.sleepState=Rt.AWAKE,this.wakeUpAfterNarrowphase=!1,t===Rt.SLEEPING&&this.dispatchEvent(Rt.wakeupEvent)}sleep(){this.sleepState=Rt.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){const e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),s=this.sleepSpeedLimit**2;e===Rt.AWAKE&&n<s?(this.sleepState=Rt.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(Rt.sleepyEvent)):e===Rt.SLEEPY&&n>s?this.wakeUp():e===Rt.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(Rt.sleepEvent))}}updateSolveMassProperties(){this.sleepState===Rt.SLEEPING||this.type===Rt.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new w),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new w),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new w),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new w),this.quaternion.vmult(t,e),e}addShape(t,e,n){const s=new w,r=new Ve;return e&&s.copy(e),n&&r.copy(n),this.shapes.push(t),this.shapeOffsets.push(s),this.shapeOrientations.push(r),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){const e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){const t=this.shapes,e=this.shapeOffsets,n=t.length;let s=0;for(let r=0;r!==n;r++){const o=t[r];o.updateBoundingSphereRadius();const a=e[r].length(),l=o.boundingSphereRadius;a+l>s&&(s=a+l)}this.boundingRadius=s}updateAABB(){const t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,s=t.length,r=DM,o=NM,a=this.quaternion,l=this.aabb,c=UM;for(let u=0;u!==s;u++){const h=t[u];a.vmult(e[u],r),r.vadd(this.position,r),a.mult(n[u],o),h.calculateWorldAABB(r,o,c.lowerBound,c.upperBound),u===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){const e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){const n=FM,s=OM;n.setRotationFromQuaternion(this.quaternion),n.transpose(s),n.scale(e,n),n.mmult(s,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new w),this.type!==Rt.DYNAMIC)return;this.sleepState===Rt.SLEEPING&&this.wakeUp();const n=BM;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new w),this.type!==Rt.DYNAMIC)return;const n=zM,s=kM;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyForce(n,s)}applyTorque(t){this.type===Rt.DYNAMIC&&(this.sleepState===Rt.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new w),this.type!==Rt.DYNAMIC)return;this.sleepState===Rt.SLEEPING&&this.wakeUp();const n=e,s=GM;s.copy(t),s.scale(this.invMass,s),this.velocity.vadd(s,this.velocity);const r=HM;n.cross(t,r),this.invInertiaWorld.vmult(r,r),this.angularVelocity.vadd(r,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new w),this.type!==Rt.DYNAMIC)return;const n=VM,s=WM;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyImpulse(n,s)}updateMassProperties(){const t=XM;this.invMass=this.mass>0?1/this.mass:0;const e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),dl.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){const n=new w;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===Rt.DYNAMIC||this.type===Rt.KINEMATIC)||this.sleepState===Rt.SLEEPING)return;const s=this.velocity,r=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,u=this.invMass,h=this.invInertiaWorld,d=this.linearFactor,f=u*t;s.x+=a.x*f*d.x,s.y+=a.y*f*d.y,s.z+=a.z*f*d.z;const p=h.elements,v=this.angularFactor,g=l.x*v.x,m=l.y*v.y,x=l.z*v.z;r.x+=t*(p[0]*g+p[1]*m+p[2]*x),r.y+=t*(p[3]*g+p[4]*m+p[5]*x),r.z+=t*(p[6]*g+p[7]*m+p[8]*x),o.x+=s.x*t,o.y+=s.y*t,o.z+=s.z*t,c.integrate(this.angularVelocity,t,this.angularFactor,c),e&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}Rt.idCounter=0;Rt.COLLIDE_EVENT_NAME="collide";Rt.DYNAMIC=Wh.DYNAMIC;Rt.STATIC=Wh.STATIC;Rt.KINEMATIC=Wh.KINEMATIC;Rt.AWAKE=Xh.AWAKE;Rt.SLEEPY=Xh.SLEEPY;Rt.SLEEPING=Xh.SLEEPING;Rt.wakeupEvent={type:"wakeup"};Rt.sleepyEvent={type:"sleepy"};Rt.sleepEvent={type:"sleep"};const DM=new w,NM=new Ve,UM=new In,FM=new Zn,OM=new Zn;new Zn;const BM=new w,zM=new w,kM=new w,GM=new w,HM=new w,VM=new w,WM=new w,XM=new w;class qM{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&Rt.STATIC)!==0||t.sleepState===Rt.SLEEPING)&&((e.type&Rt.STATIC)!==0||e.sleepState===Rt.SLEEPING))}intersectionTest(t,e,n,s){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,s):this.doBoundingSphereBroadphase(t,e,n,s)}doBoundingSphereBroadphase(t,e,n,s){const r=YM;e.position.vsub(t.position,r);const o=(t.boundingRadius+e.boundingRadius)**2;r.lengthSquared()<o&&(n.push(t),s.push(e))}doBoundingBoxBroadphase(t,e,n,s){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),s.push(e))}makePairsUnique(t,e){const n=$M,s=jM,r=ZM,o=t.length;for(let a=0;a!==o;a++)s[a]=t[a],r[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){const l=s[a].id,c=r[a].id,u=l<c?`${l},${c}`:`${c},${l}`;n[u]=a,n.keys.push(u)}for(let a=0;a!==n.keys.length;a++){const l=n.keys.pop(),c=n[l];t.push(s[c]),e.push(r[c]),delete n[l]}}setWorld(t){}static boundingSphereCheck(t,e){const n=new w;t.position.vsub(e.position,n);const s=t.shapes[0],r=e.shapes[0];return Math.pow(s.boundingSphereRadius+r.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const YM=new w;new w;new Ve;new w;const $M={keys:[]},jM=[],ZM=[];new w;new w;new w;class KM extends qM{constructor(){super()}collisionPairs(t,e,n){const s=t.bodies,r=s.length;let o,a;for(let l=0;l!==r;l++)for(let c=0;c!==l;c++)o=s[l],a=s[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let s=0;s<t.bodies.length;s++){const r=t.bodies[s];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(e)&&n.push(r)}return n}}class il{constructor(){this.rayFromWorld=new w,this.rayToWorld=new w,this.hitNormalWorld=new w,this.hitPointWorld=new w,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,s,r,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(s),this.shape=r,this.body=o,this.distance=a}}let cp,hp,up,dp,fp,pp,mp;const qh={CLOSEST:1,ANY:2,ALL:4};cp=Lt.types.SPHERE;hp=Lt.types.PLANE;up=Lt.types.BOX;dp=Lt.types.CYLINDER;fp=Lt.types.CONVEXPOLYHEDRON;pp=Lt.types.HEIGHTFIELD;mp=Lt.types.TRIMESH;class Ge{get[cp](){return this._intersectSphere}get[hp](){return this._intersectPlane}get[up](){return this._intersectBox}get[dp](){return this._intersectConvex}get[fp](){return this._intersectConvex}get[pp](){return this._intersectHeightfield}get[mp](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new w),e===void 0&&(e=new w),this.from=t.clone(),this.to=e.clone(),this.direction=new w,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=Ge.ANY,this.result=new il,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||Ge.ANY,this.result=e.result||new il,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(qd),dc.length=0,t.broadphase.aabbQuery(t,qd,dc),this.intersectBodies(dc),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;const s=JM,r=QM;for(let o=0,a=t.shapes.length;o<a;o++){const l=t.shapes[o];if(!(n&&!l.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],r),t.quaternion.vmult(t.shapeOffsets[o],s),s.vadd(t.position,s),this.intersectShape(l,r,s,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,s=t.length;!this.result.shouldStop&&n<s;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,s){const r=this.from;if(fS(r,this.direction,n)>t.boundingSphereRadius)return;const a=this[t.type];a&&a.call(this,t,e,n,s,t)}_intersectBox(t,e,n,s,r){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,s,r)}_intersectPlane(t,e,n,s,r){const o=this.from,a=this.to,l=this.direction,c=new w(0,0,1);e.vmult(c,c);const u=new w;o.vsub(n,u);const h=u.dot(c);a.vsub(n,u);const d=u.dot(c);if(h*d>0||o.distanceTo(a)<h)return;const f=c.dot(l);if(Math.abs(f)<this.precision)return;const p=new w,v=new w,g=new w;o.vsub(n,p);const m=-c.dot(p)/f;l.scale(m,v),o.vadd(v,g),this.reportIntersection(c,g,r,s,-1)}getAABB(t){const{lowerBound:e,upperBound:n}=t,s=this.to,r=this.from;e.x=Math.min(s.x,r.x),e.y=Math.min(s.y,r.y),e.z=Math.min(s.z,r.z),n.x=Math.max(s.x,r.x),n.y=Math.max(s.y,r.y),n.z=Math.max(s.z,r.z)}_intersectHeightfield(t,e,n,s,r){t.data,t.elementSize;const o=tS;o.from.copy(this.from),o.to.copy(this.to),he.pointToLocalFrame(n,e,o.from,o.from),he.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();const a=eS;let l,c,u,h;l=c=0,u=h=t.data.length-1;const d=new In;o.getAABB(d),t.getIndexOfPosition(d.lowerBound.x,d.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),t.getIndexOfPosition(d.upperBound.x,d.upperBound.y,a,!0),u=Math.min(u,a[0]+1),h=Math.min(h,a[1]+1);for(let f=l;f<u;f++)for(let p=c;p<h;p++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(f,p,d),!!d.overlapsRay(o)){if(t.getConvexTrianglePillar(f,p,!1),he.pointToWorldFrame(n,e,t.pillarOffset,Pa),this._intersectConvex(t.pillarConvex,e,Pa,s,r,Yd),this.result.shouldStop)return;t.getConvexTrianglePillar(f,p,!0),he.pointToWorldFrame(n,e,t.pillarOffset,Pa),this._intersectConvex(t.pillarConvex,e,Pa,s,r,Yd)}}}_intersectSphere(t,e,n,s,r){const o=this.from,a=this.to,l=t.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,u=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),h=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,d=u**2-4*c*h,f=nS,p=iS;if(!(d<0))if(d===0)o.lerp(a,d,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1);else{const v=(-u-Math.sqrt(d))/(2*c),g=(-u+Math.sqrt(d))/(2*c);if(v>=0&&v<=1&&(o.lerp(a,v,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1)),this.result.shouldStop)return;g>=0&&g<=1&&(o.lerp(a,g,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1))}}_intersectConvex(t,e,n,s,r,o){const a=sS,l=$d,c=o&&o.faceList||null,u=t.faces,h=t.vertices,d=t.faceNormals,f=this.direction,p=this.from,v=this.to,g=p.distanceTo(v),m=c?c.length:u.length,x=this.result;for(let M=0;!x.shouldStop&&M<m;M++){const _=c?c[M]:M,C=u[_],T=d[_],P=e,U=n;l.copy(h[C[0]]),P.vmult(l,l),l.vadd(U,l),l.vsub(p,l),P.vmult(T,a);const b=f.dot(a);if(Math.abs(b)<this.precision)continue;const y=a.dot(l)/b;if(!(y<0)){f.scale(y,yn),yn.vadd(p,yn),Yn.copy(h[C[0]]),P.vmult(Yn,Yn),U.vadd(Yn,Yn);for(let R=1;!x.shouldStop&&R<C.length-1;R++){ri.copy(h[C[R]]),oi.copy(h[C[R+1]]),P.vmult(ri,ri),P.vmult(oi,oi),U.vadd(ri,ri),U.vadd(oi,oi);const B=yn.distanceTo(p);!(Ge.pointInTriangle(yn,Yn,ri,oi)||Ge.pointInTriangle(yn,ri,Yn,oi))||B>g||this.reportIntersection(a,yn,r,s,_)}}}}_intersectTrimesh(t,e,n,s,r,o){const a=rS,l=uS,c=dS,u=$d,h=oS,d=aS,f=lS,p=hS,v=cS,g=t.indices;t.vertices;const m=this.from,x=this.to,M=this.direction;c.position.copy(n),c.quaternion.copy(e),he.vectorToLocalFrame(n,e,M,h),he.pointToLocalFrame(n,e,m,d),he.pointToLocalFrame(n,e,x,f),f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,d.x*=t.scale.x,d.y*=t.scale.y,d.z*=t.scale.z,f.vsub(d,h),h.normalize();const _=d.distanceSquared(f);t.tree.rayQuery(this,c,l);for(let C=0,T=l.length;!this.result.shouldStop&&C!==T;C++){const P=l[C];t.getNormal(P,a),t.getVertex(g[P*3],Yn),Yn.vsub(d,u);const U=h.dot(a),b=a.dot(u)/U;if(b<0)continue;h.scale(b,yn),yn.vadd(d,yn),t.getVertex(g[P*3+1],ri),t.getVertex(g[P*3+2],oi);const y=yn.distanceSquared(d);!(Ge.pointInTriangle(yn,ri,Yn,oi)||Ge.pointInTriangle(yn,Yn,ri,oi))||y>_||(he.vectorToWorldFrame(e,a,v),he.pointToWorldFrame(n,e,yn,p),this.reportIntersection(v,p,r,s,P))}l.length=0}reportIntersection(t,e,n,s,r){const o=this.from,a=this.to,l=o.distanceTo(e),c=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(c.hitFaceIndex=typeof r<"u"?r:-1,this.mode){case Ge.ALL:this.hasHit=!0,c.set(o,a,t,e,n,s,l),c.hasHit=!0,this.callback(c);break;case Ge.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l));break;case Ge.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l),c.shouldStop=!0;break}}static pointInTriangle(t,e,n,s){s.vsub(e,Ds),n.vsub(e,Qr),t.vsub(e,fc);const r=Ds.dot(Ds),o=Ds.dot(Qr),a=Ds.dot(fc),l=Qr.dot(Qr),c=Qr.dot(fc);let u,h;return(u=l*a-o*c)>=0&&(h=r*c-o*a)>=0&&u+h<r*l-o*o}}Ge.CLOSEST=qh.CLOSEST;Ge.ANY=qh.ANY;Ge.ALL=qh.ALL;const qd=new In,dc=[],Qr=new w,fc=new w,JM=new w,QM=new Ve,yn=new w,Yn=new w,ri=new w,oi=new w;new w;new il;const Yd={faceList:[0]},Pa=new w,tS=new Ge,eS=[],nS=new w,iS=new w,sS=new w;new w;new w;const $d=new w,rS=new w,oS=new w,aS=new w,lS=new w,cS=new w,hS=new w;new In;const uS=[],dS=new he,Ds=new w,La=new w;function fS(i,t,e){e.vsub(i,Ds);const n=Ds.dot(t);return t.scale(n,La),La.vadd(i,La),e.distanceTo(La)}class pS{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}}class jd{constructor(){this.spatial=new w,this.rotational=new w}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}}class ko{constructor(t,e,n,s){n===void 0&&(n=-1e6),s===void 0&&(s=1e6),this.id=ko.idCounter++,this.minForce=n,this.maxForce=s,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new jd,this.jacobianElementB=new jd,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){const s=e,r=t,o=n;this.a=4/(o*(1+4*s)),this.b=4*s/(1+4*s),this.eps=4/(o*o*r*(1+4*s))}computeB(t,e,n){const s=this.computeGW(),r=this.computeGq(),o=this.computeGiMf();return-r*t-s*e-o*n}computeGq(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.position,o=s.position;return t.spatial.dot(r)+e.spatial.dot(o)}computeGW(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.velocity,o=s.velocity,a=n.angularVelocity,l=s.angularVelocity;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGWlambda(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.vlambda,o=s.vlambda,a=n.wlambda,l=s.wlambda;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGiMf(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.force,o=n.torque,a=s.force,l=s.torque,c=n.invMassSolve,u=s.invMassSolve;return r.scale(c,Zd),a.scale(u,Kd),n.invInertiaWorldSolve.vmult(o,Jd),s.invInertiaWorldSolve.vmult(l,Qd),t.multiplyVectors(Zd,Jd)+e.multiplyVectors(Kd,Qd)}computeGiMGt(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.invMassSolve,o=s.invMassSolve,a=n.invInertiaWorldSolve,l=s.invInertiaWorldSolve;let c=r+o;return a.vmult(t.rotational,Ia),c+=Ia.dot(t.rotational),l.vmult(e.rotational,Ia),c+=Ia.dot(e.rotational),c}addToWlambda(t){const e=this.jacobianElementA,n=this.jacobianElementB,s=this.bi,r=this.bj,o=mS;s.vlambda.addScaledVector(s.invMassSolve*t,e.spatial,s.vlambda),r.vlambda.addScaledVector(r.invMassSolve*t,n.spatial,r.vlambda),s.invInertiaWorldSolve.vmult(e.rotational,o),s.wlambda.addScaledVector(t,o,s.wlambda),r.invInertiaWorldSolve.vmult(n.rotational,o),r.wlambda.addScaledVector(t,o,r.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}ko.idCounter=0;const Zd=new w,Kd=new w,Jd=new w,Qd=new w,Ia=new w,mS=new w;class gS extends ko{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new w,this.rj=new w,this.ni=new w}computeB(t){const e=this.a,n=this.b,s=this.bi,r=this.bj,o=this.ri,a=this.rj,l=vS,c=xS,u=s.velocity,h=s.angularVelocity;s.force,s.torque;const d=r.velocity,f=r.angularVelocity;r.force,r.torque;const p=yS,v=this.jacobianElementA,g=this.jacobianElementB,m=this.ni;o.cross(m,l),a.cross(m,c),m.negate(v.spatial),l.negate(v.rotational),g.spatial.copy(m),g.rotational.copy(c),p.copy(r.position),p.vadd(a,p),p.vsub(s.position,p),p.vsub(o,p);const x=m.dot(p),M=this.restitution+1,_=M*d.dot(m)-M*u.dot(m)+f.dot(c)-h.dot(l),C=this.computeGiMf();return-x*e-_*n-t*C}getImpactVelocityAlongNormal(){const t=_S,e=MS,n=SS,s=wS,r=bS;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,s),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(s,e),t.vsub(e,r),this.ni.dot(r)}}const vS=new w,xS=new w,yS=new w,_S=new w,MS=new w,SS=new w,wS=new w,bS=new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;class tf extends ko{constructor(t,e,n){super(t,e,-n,n),this.ri=new w,this.rj=new w,this.t=new w}computeB(t){this.a;const e=this.b;this.bi,this.bj;const n=this.ri,s=this.rj,r=ES,o=TS,a=this.t;n.cross(a,r),s.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),r.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const u=this.computeGW(),h=this.computeGiMf();return-u*e-t*h}}const ES=new w,TS=new w;class Go{constructor(t,e,n){n=pS.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=Go.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}Go.idCounter=0;class Gr{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=Gr.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}}Gr.idCounter=0;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new Ge;new w;new w;new w;new w(1,0,0),new w(0,1,0),new w(0,0,1);new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;class gp extends Lt{constructor(t){if(super({type:Lt.types.SPHERE}),this.radius=t!==void 0?t:1,this.radius<0)throw new Error("The sphere radius cannot be negative.");this.updateBoundingSphereRadius()}calculateLocalInertia(t,e){e===void 0&&(e=new w);const n=2*t*this.radius*this.radius/5;return e.x=n,e.y=n,e.z=n,e}volume(){return 4*Math.PI*Math.pow(this.radius,3)/3}updateBoundingSphereRadius(){this.boundingSphereRadius=this.radius}calculateWorldAABB(t,e,n,s){const r=this.radius,o=["x","y","z"];for(let a=0;a<o.length;a++){const l=o[a];n[l]=t[l]-r,s[l]=t[l]+r}}}new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new w;new In;new w;new In;new w;new w;new w;new w;new w;new w;new w;new In;new w;new he;new In;class AS{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){const e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}}class CS extends AS{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0;const s=this.iterations,r=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=e.bodies,c=l.length,u=t;let h,d,f,p,v,g;if(a!==0)for(let _=0;_!==c;_++)l[_].updateSolveMassProperties();const m=PS,x=LS,M=RS;m.length=a,x.length=a,M.length=a;for(let _=0;_!==a;_++){const C=o[_];M[_]=0,x[_]=C.computeB(u),m[_]=1/C.computeC()}if(a!==0){for(let T=0;T!==c;T++){const P=l[T],U=P.vlambda,b=P.wlambda;U.set(0,0,0),b.set(0,0,0)}for(n=0;n!==s;n++){p=0;for(let T=0;T!==a;T++){const P=o[T];h=x[T],d=m[T],g=M[T],v=P.computeGWlambda(),f=d*(h-v-P.eps*g),g+f<P.minForce?f=P.minForce-g:g+f>P.maxForce&&(f=P.maxForce-g),M[T]+=f,p+=f>0?f:-f,P.addToWlambda(f)}if(p*p<r)break}for(let T=0;T!==c;T++){const P=l[T],U=P.velocity,b=P.angularVelocity;P.vlambda.vmul(P.linearFactor,P.vlambda),U.vadd(P.vlambda,U),P.wlambda.vmul(P.angularFactor,P.wlambda),b.vadd(P.wlambda,b)}let _=o.length;const C=1/u;for(;_--;)o[_].multiplier=M[_]*C}return n}}const RS=[],PS=[],LS=[];class IS{constructor(){this.objects=[],this.type=Object}release(){const t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){const e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}}class DS extends IS{constructor(){super(...arguments),this.type=w}constructObject(){return new w}}const Te={sphereSphere:Lt.types.SPHERE,spherePlane:Lt.types.SPHERE|Lt.types.PLANE,boxBox:Lt.types.BOX|Lt.types.BOX,sphereBox:Lt.types.SPHERE|Lt.types.BOX,planeBox:Lt.types.PLANE|Lt.types.BOX,convexConvex:Lt.types.CONVEXPOLYHEDRON,sphereConvex:Lt.types.SPHERE|Lt.types.CONVEXPOLYHEDRON,planeConvex:Lt.types.PLANE|Lt.types.CONVEXPOLYHEDRON,boxConvex:Lt.types.BOX|Lt.types.CONVEXPOLYHEDRON,sphereHeightfield:Lt.types.SPHERE|Lt.types.HEIGHTFIELD,boxHeightfield:Lt.types.BOX|Lt.types.HEIGHTFIELD,convexHeightfield:Lt.types.CONVEXPOLYHEDRON|Lt.types.HEIGHTFIELD,sphereParticle:Lt.types.PARTICLE|Lt.types.SPHERE,planeParticle:Lt.types.PLANE|Lt.types.PARTICLE,boxParticle:Lt.types.BOX|Lt.types.PARTICLE,convexParticle:Lt.types.PARTICLE|Lt.types.CONVEXPOLYHEDRON,cylinderCylinder:Lt.types.CYLINDER,sphereCylinder:Lt.types.SPHERE|Lt.types.CYLINDER,planeCylinder:Lt.types.PLANE|Lt.types.CYLINDER,boxCylinder:Lt.types.BOX|Lt.types.CYLINDER,convexCylinder:Lt.types.CONVEXPOLYHEDRON|Lt.types.CYLINDER,heightfieldCylinder:Lt.types.HEIGHTFIELD|Lt.types.CYLINDER,particleCylinder:Lt.types.PARTICLE|Lt.types.CYLINDER,sphereTrimesh:Lt.types.SPHERE|Lt.types.TRIMESH,planeTrimesh:Lt.types.PLANE|Lt.types.TRIMESH};class NS{get[Te.sphereSphere](){return this.sphereSphere}get[Te.spherePlane](){return this.spherePlane}get[Te.boxBox](){return this.boxBox}get[Te.sphereBox](){return this.sphereBox}get[Te.planeBox](){return this.planeBox}get[Te.convexConvex](){return this.convexConvex}get[Te.sphereConvex](){return this.sphereConvex}get[Te.planeConvex](){return this.planeConvex}get[Te.boxConvex](){return this.boxConvex}get[Te.sphereHeightfield](){return this.sphereHeightfield}get[Te.boxHeightfield](){return this.boxHeightfield}get[Te.convexHeightfield](){return this.convexHeightfield}get[Te.sphereParticle](){return this.sphereParticle}get[Te.planeParticle](){return this.planeParticle}get[Te.boxParticle](){return this.boxParticle}get[Te.convexParticle](){return this.convexParticle}get[Te.cylinderCylinder](){return this.convexConvex}get[Te.sphereCylinder](){return this.sphereConvex}get[Te.planeCylinder](){return this.planeConvex}get[Te.boxCylinder](){return this.boxConvex}get[Te.convexCylinder](){return this.convexConvex}get[Te.heightfieldCylinder](){return this.heightfieldCylinder}get[Te.particleCylinder](){return this.particleCylinder}get[Te.sphereTrimesh](){return this.sphereTrimesh}get[Te.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new DS,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,s,r,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new gS(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&s.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||t.material,u=s.material||e.material;return c&&u&&c.restitution>=0&&u.restitution>=0&&(a.restitution=c.restitution*u.restitution),a.si=r||n,a.sj=o||s,a}createFrictionEquationsFromContact(t,e){const n=t.bi,s=t.bj,r=t.si,o=t.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const u=r.material||n.material,h=o.material||s.material;if(u&&h&&u.friction>=0&&h.friction>=0&&(c=u.friction*h.friction),c>0){const d=c*(a.frictionGravity||a.gravity).length();let f=n.invMass+s.invMass;f>0&&(f=1/f);const p=this.frictionEquationPool,v=p.length?p.pop():new tf(n,s,d*f),g=p.length?p.pop():new tf(n,s,d*f);return v.bi=g.bi=n,v.bj=g.bj=s,v.minForce=g.minForce=-d*f,v.maxForce=g.maxForce=d*f,v.ri.copy(t.ri),v.rj.copy(t.rj),g.ri.copy(t.ri),g.rj.copy(t.rj),t.ni.tangents(v.t,g.t),v.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),g.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),v.enabled=g.enabled=t.enabled,e.push(v,g),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;const n=this.frictionResult[this.frictionResult.length-2],s=this.frictionResult[this.frictionResult.length-1];As.setZero(),pr.setZero(),mr.setZero();const r=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==r?(As.vadd(e.ni,As),pr.vadd(e.ri,pr),mr.vadd(e.rj,mr)):(As.vsub(e.ni,As),pr.vadd(e.rj,pr),mr.vadd(e.ri,mr));const o=1/t;pr.scale(o,n.ri),mr.scale(o,n.rj),s.ri.copy(n.ri),s.rj.copy(n.rj),As.normalize(),As.tangents(n.t,s.t)}getContacts(t,e,n,s,r,o,a){this.contactPointPool=r,this.frictionEquationPool=a,this.result=s,this.frictionResult=o;const l=OS,c=BS,u=US,h=FS;for(let d=0,f=t.length;d!==f;d++){const p=t[d],v=e[d];let g=null;p.material&&v.material&&(g=n.getContactMaterial(p.material,v.material)||null);const m=p.type&Rt.KINEMATIC&&v.type&Rt.STATIC||p.type&Rt.STATIC&&v.type&Rt.KINEMATIC||p.type&Rt.KINEMATIC&&v.type&Rt.KINEMATIC;for(let x=0;x<p.shapes.length;x++){p.quaternion.mult(p.shapeOrientations[x],l),p.quaternion.vmult(p.shapeOffsets[x],u),u.vadd(p.position,u);const M=p.shapes[x];for(let _=0;_<v.shapes.length;_++){v.quaternion.mult(v.shapeOrientations[_],c),v.quaternion.vmult(v.shapeOffsets[_],h),h.vadd(v.position,h);const C=v.shapes[_];if(!(M.collisionFilterMask&C.collisionFilterGroup&&C.collisionFilterMask&M.collisionFilterGroup)||u.distanceTo(h)>M.boundingSphereRadius+C.boundingSphereRadius)continue;let T=null;M.material&&C.material&&(T=n.getContactMaterial(M.material,C.material)||null),this.currentContactMaterial=T||g||n.defaultContactMaterial;const P=M.type|C.type,U=this[P];if(U){let b=!1;M.type<C.type?b=U.call(this,M,C,u,h,l,c,p,v,M,C,m):b=U.call(this,C,M,h,u,c,l,v,p,M,C,m),b&&m&&(n.shapeOverlapKeeper.set(M.id,C.id),n.bodyOverlapKeeper.set(p.id,v.id))}}}}}sphereSphere(t,e,n,s,r,o,a,l,c,u,h){if(h)return n.distanceSquared(s)<(t.radius+e.radius)**2;const d=this.createContactEquation(a,l,t,e,c,u);s.vsub(n,d.ni),d.ni.normalize(),d.ri.copy(d.ni),d.rj.copy(d.ni),d.ri.scale(t.radius,d.ri),d.rj.scale(-e.radius,d.rj),d.ri.vadd(n,d.ri),d.ri.vsub(a.position,d.ri),d.rj.vadd(s,d.rj),d.rj.vsub(l.position,d.rj),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}spherePlane(t,e,n,s,r,o,a,l,c,u,h){const d=this.createContactEquation(a,l,t,e,c,u);if(d.ni.set(0,0,1),o.vmult(d.ni,d.ni),d.ni.negate(d.ni),d.ni.normalize(),d.ni.scale(t.radius,d.ri),n.vsub(s,Da),d.ni.scale(d.ni.dot(Da),ef),Da.vsub(ef,d.rj),-Da.dot(d.ni)<=t.radius){if(h)return!0;const f=d.ri,p=d.rj;f.vadd(n,f),f.vsub(a.position,f),p.vadd(s,p),p.vsub(l.position,p),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}}boxBox(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,h)}sphereBox(t,e,n,s,r,o,a,l,c,u,h){const d=this.v3pool,f=hw;n.vsub(s,Na),e.getSideNormals(f,o);const p=t.radius;let v=!1;const g=dw,m=fw,x=pw;let M=null,_=0,C=0,T=0,P=null;for(let k=0,K=f.length;k!==K&&v===!1;k++){const X=aw;X.copy(f[k]);const rt=X.length();X.normalize();const gt=Na.dot(X);if(gt<rt+p&&gt>0){const ct=lw,ht=cw;ct.copy(f[(k+1)%3]),ht.copy(f[(k+2)%3]);const kt=ct.length(),ne=ht.length();ct.normalize(),ht.normalize();const $t=Na.dot(ct),st=Na.dot(ht);if($t<kt&&$t>-kt&&st<ne&&st>-ne){const ot=Math.abs(gt-rt-p);if((P===null||ot<P)&&(P=ot,C=$t,T=st,M=rt,g.copy(X),m.copy(ct),x.copy(ht),_++,h))return!0}}}if(_){v=!0;const k=this.createContactEquation(a,l,t,e,c,u);g.scale(-p,k.ri),k.ni.copy(g),k.ni.negate(k.ni),g.scale(M,g),m.scale(C,m),g.vadd(m,g),x.scale(T,x),g.vadd(x,k.rj),k.ri.vadd(n,k.ri),k.ri.vsub(a.position,k.ri),k.rj.vadd(s,k.rj),k.rj.vsub(l.position,k.rj),this.result.push(k),this.createFrictionEquationsFromContact(k,this.frictionResult)}let U=d.get();const b=uw;for(let k=0;k!==2&&!v;k++)for(let K=0;K!==2&&!v;K++)for(let X=0;X!==2&&!v;X++)if(U.set(0,0,0),k?U.vadd(f[0],U):U.vsub(f[0],U),K?U.vadd(f[1],U):U.vsub(f[1],U),X?U.vadd(f[2],U):U.vsub(f[2],U),s.vadd(U,b),b.vsub(n,b),b.lengthSquared()<p*p){if(h)return!0;v=!0;const rt=this.createContactEquation(a,l,t,e,c,u);rt.ri.copy(b),rt.ri.normalize(),rt.ni.copy(rt.ri),rt.ri.scale(p,rt.ri),rt.rj.copy(U),rt.ri.vadd(n,rt.ri),rt.ri.vsub(a.position,rt.ri),rt.rj.vadd(s,rt.rj),rt.rj.vsub(l.position,rt.rj),this.result.push(rt),this.createFrictionEquationsFromContact(rt,this.frictionResult)}d.release(U),U=null;const y=d.get(),R=d.get(),B=d.get(),L=d.get(),H=d.get(),G=f.length;for(let k=0;k!==G&&!v;k++)for(let K=0;K!==G&&!v;K++)if(k%3!==K%3){f[K].cross(f[k],y),y.normalize(),f[k].vadd(f[K],R),B.copy(n),B.vsub(R,B),B.vsub(s,B);const X=B.dot(y);y.scale(X,L);let rt=0;for(;rt===k%3||rt===K%3;)rt++;H.copy(n),H.vsub(L,H),H.vsub(R,H),H.vsub(s,H);const gt=Math.abs(X),ct=H.length();if(gt<f[rt].length()&&ct<p){if(h)return!0;v=!0;const ht=this.createContactEquation(a,l,t,e,c,u);R.vadd(L,ht.rj),ht.rj.copy(ht.rj),H.negate(ht.ni),ht.ni.normalize(),ht.ri.copy(ht.rj),ht.ri.vadd(s,ht.ri),ht.ri.vsub(n,ht.ri),ht.ri.normalize(),ht.ri.scale(p,ht.ri),ht.ri.vadd(n,ht.ri),ht.ri.vsub(a.position,ht.ri),ht.rj.vadd(s,ht.rj),ht.rj.vsub(l.position,ht.rj),this.result.push(ht),this.createFrictionEquationsFromContact(ht,this.frictionResult)}}d.release(y,R,B,L,H)}planeBox(t,e,n,s,r,o,a,l,c,u,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,h)}convexConvex(t,e,n,s,r,o,a,l,c,u,h,d,f){const p=Rw;if(!(n.distanceTo(s)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,r,s,o,p,d,f)){const v=[],g=Pw;t.clipAgainstHull(n,r,e,s,o,p,-100,100,v);let m=0;for(let x=0;x!==v.length;x++){if(h)return!0;const M=this.createContactEquation(a,l,t,e,c,u),_=M.ri,C=M.rj;p.negate(M.ni),v[x].normal.negate(g),g.scale(v[x].depth,g),v[x].point.vadd(g,_),C.copy(v[x].point),_.vsub(n,_),C.vsub(s,C),_.vadd(n,_),_.vsub(a.position,_),C.vadd(s,C),C.vsub(l.position,C),this.result.push(M),m++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(M,this.frictionResult)}this.enableFrictionReduction&&m&&this.createFrictionFromAverage(m)}}sphereConvex(t,e,n,s,r,o,a,l,c,u,h){const d=this.v3pool;n.vsub(s,mw);const f=e.faceNormals,p=e.faces,v=e.vertices,g=t.radius;let m=!1;for(let x=0;x!==v.length;x++){const M=v[x],_=yw;o.vmult(M,_),s.vadd(_,_);const C=xw;if(_.vsub(n,C),C.lengthSquared()<g*g){if(h)return!0;m=!0;const T=this.createContactEquation(a,l,t,e,c,u);T.ri.copy(C),T.ri.normalize(),T.ni.copy(T.ri),T.ri.scale(g,T.ri),_.vsub(s,T.rj),T.ri.vadd(n,T.ri),T.ri.vsub(a.position,T.ri),T.rj.vadd(s,T.rj),T.rj.vsub(l.position,T.rj),this.result.push(T),this.createFrictionEquationsFromContact(T,this.frictionResult);return}}for(let x=0,M=p.length;x!==M&&m===!1;x++){const _=f[x],C=p[x],T=_w;o.vmult(_,T);const P=Mw;o.vmult(v[C[0]],P),P.vadd(s,P);const U=Sw;T.scale(-g,U),n.vadd(U,U);const b=ww;U.vsub(P,b);const y=b.dot(T),R=bw;if(n.vsub(P,R),y<0&&R.dot(T)>0){const B=[];for(let L=0,H=C.length;L!==H;L++){const G=d.get();o.vmult(v[C[L]],G),s.vadd(G,G),B.push(G)}if(ow(B,T,n)){if(h)return!0;m=!0;const L=this.createContactEquation(a,l,t,e,c,u);T.scale(-g,L.ri),T.negate(L.ni);const H=d.get();T.scale(-y,H);const G=d.get();T.scale(-g,G),n.vsub(s,L.rj),L.rj.vadd(G,L.rj),L.rj.vadd(H,L.rj),L.rj.vadd(s,L.rj),L.rj.vsub(l.position,L.rj),L.ri.vadd(n,L.ri),L.ri.vsub(a.position,L.ri),d.release(H),d.release(G),this.result.push(L),this.createFrictionEquationsFromContact(L,this.frictionResult);for(let k=0,K=B.length;k!==K;k++)d.release(B[k]);return}else for(let L=0;L!==C.length;L++){const H=d.get(),G=d.get();o.vmult(v[C[(L+1)%C.length]],H),o.vmult(v[C[(L+2)%C.length]],G),s.vadd(H,H),s.vadd(G,G);const k=gw;G.vsub(H,k);const K=vw;k.unit(K);const X=d.get(),rt=d.get();n.vsub(H,rt);const gt=rt.dot(K);K.scale(gt,X),X.vadd(H,X);const ct=d.get();if(X.vsub(n,ct),gt>0&&gt*gt<k.lengthSquared()&&ct.lengthSquared()<g*g){if(h)return!0;const ht=this.createContactEquation(a,l,t,e,c,u);X.vsub(s,ht.rj),X.vsub(n,ht.ni),ht.ni.normalize(),ht.ni.scale(g,ht.ri),ht.rj.vadd(s,ht.rj),ht.rj.vsub(l.position,ht.rj),ht.ri.vadd(n,ht.ri),ht.ri.vsub(a.position,ht.ri),this.result.push(ht),this.createFrictionEquationsFromContact(ht,this.frictionResult);for(let kt=0,ne=B.length;kt!==ne;kt++)d.release(B[kt]);d.release(H),d.release(G),d.release(X),d.release(ct),d.release(rt);return}d.release(H),d.release(G),d.release(X),d.release(ct),d.release(rt)}for(let L=0,H=B.length;L!==H;L++)d.release(B[L])}}}planeConvex(t,e,n,s,r,o,a,l,c,u,h){const d=Ew,f=Tw;f.set(0,0,1),r.vmult(f,f);let p=0;const v=Aw;for(let g=0;g!==e.vertices.length;g++)if(d.copy(e.vertices[g]),o.vmult(d,d),s.vadd(d,d),d.vsub(n,v),f.dot(v)<=0){if(h)return!0;const x=this.createContactEquation(a,l,t,e,c,u),M=Cw;f.scale(f.dot(v),M),d.vsub(M,M),M.vsub(n,x.ri),x.ni.copy(f),d.vsub(s,x.rj),x.ri.vadd(n,x.ri),x.ri.vsub(a.position,x.ri),x.rj.vadd(s,x.rj),x.rj.vsub(l.position,x.rj),this.result.push(x),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(x,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}boxConvex(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}sphereHeightfield(t,e,n,s,r,o,a,l,c,u,h){const d=e.data,f=t.radius,p=e.elementSize,v=Hw,g=Gw;he.pointToLocalFrame(s,o,n,g);let m=Math.floor((g.x-f)/p)-1,x=Math.ceil((g.x+f)/p)+1,M=Math.floor((g.y-f)/p)-1,_=Math.ceil((g.y+f)/p)+1;if(x<0||_<0||m>d.length||M>d[0].length)return;m<0&&(m=0),x<0&&(x=0),M<0&&(M=0),_<0&&(_=0),m>=d.length&&(m=d.length-1),x>=d.length&&(x=d.length-1),_>=d[0].length&&(_=d[0].length-1),M>=d[0].length&&(M=d[0].length-1);const C=[];e.getRectMinMax(m,M,x,_,C);const T=C[0],P=C[1];if(g.z-f>P||g.z+f<T)return;const U=this.result;for(let b=m;b<x;b++)for(let y=M;y<_;y++){const R=U.length;let B=!1;if(e.getConvexTrianglePillar(b,y,!1),he.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(B=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,h)),h&&B||(e.getConvexTrianglePillar(b,y,!0),he.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(B=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,h)),h&&B))return!0;if(U.length-R>2)return}}boxHeightfield(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}convexHeightfield(t,e,n,s,r,o,a,l,c,u,h){const d=e.data,f=e.elementSize,p=t.boundingSphereRadius,v=zw,g=kw,m=Bw;he.pointToLocalFrame(s,o,n,m);let x=Math.floor((m.x-p)/f)-1,M=Math.ceil((m.x+p)/f)+1,_=Math.floor((m.y-p)/f)-1,C=Math.ceil((m.y+p)/f)+1;if(M<0||C<0||x>d.length||_>d[0].length)return;x<0&&(x=0),M<0&&(M=0),_<0&&(_=0),C<0&&(C=0),x>=d.length&&(x=d.length-1),M>=d.length&&(M=d.length-1),C>=d[0].length&&(C=d[0].length-1),_>=d[0].length&&(_=d[0].length-1);const T=[];e.getRectMinMax(x,_,M,C,T);const P=T[0],U=T[1];if(!(m.z-p>U||m.z+p<P))for(let b=x;b<M;b++)for(let y=_;y<C;y++){let R=!1;if(e.getConvexTrianglePillar(b,y,!1),he.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(R=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,h,g,null)),h&&R||(e.getConvexTrianglePillar(b,y,!0),he.pointToWorldFrame(s,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(R=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,h,g,null)),h&&R))return!0}}sphereParticle(t,e,n,s,r,o,a,l,c,u,h){const d=Nw;if(d.set(0,0,1),s.vsub(n,d),d.lengthSquared()<=t.radius*t.radius){if(h)return!0;const p=this.createContactEquation(l,a,e,t,c,u);d.normalize(),p.rj.copy(d),p.rj.scale(t.radius,p.rj),p.ni.copy(d),p.ni.negate(p.ni),p.ri.set(0,0,0),this.result.push(p),this.createFrictionEquationsFromContact(p,this.frictionResult)}}planeParticle(t,e,n,s,r,o,a,l,c,u,h){const d=Lw;d.set(0,0,1),a.quaternion.vmult(d,d);const f=Iw;if(s.vsub(a.position,f),d.dot(f)<=0){if(h)return!0;const v=this.createContactEquation(l,a,e,t,c,u);v.ni.copy(d),v.ni.negate(v.ni),v.ri.set(0,0,0);const g=Dw;d.scale(d.dot(s),g),s.vsub(g,g),v.rj.copy(g),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}boxParticle(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}convexParticle(t,e,n,s,r,o,a,l,c,u,h){let d=-1;const f=Fw,p=Ow;let v=null;const g=Uw;if(g.copy(s),g.vsub(n,g),r.conjugate(nf),nf.vmult(g,g),t.pointIsInside(g)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,r),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(r);for(let m=0,x=t.faces.length;m!==x;m++){const M=[t.worldVertices[t.faces[m][0]]],_=t.worldFaceNormals[m];s.vsub(M[0],sf);const C=-_.dot(sf);if(v===null||Math.abs(C)<Math.abs(v)){if(h)return!0;v=C,d=m,f.copy(_)}}if(d!==-1){const m=this.createContactEquation(l,a,e,t,c,u);f.scale(v,p),p.vadd(s,p),p.vsub(n,p),m.rj.copy(p),f.negate(m.ni),m.ri.set(0,0,0);const x=m.ri,M=m.rj;x.vadd(s,x),x.vsub(l.position,x),M.vadd(n,M),M.vsub(a.position,M),this.result.push(m),this.createFrictionEquationsFromContact(m,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,s,r,o,a,l,c,u,h){return this.convexHeightfield(e,t,s,n,o,r,l,a,c,u,h)}particleCylinder(t,e,n,s,r,o,a,l,c,u,h){return this.convexParticle(e,t,s,n,o,r,l,a,c,u,h)}sphereTrimesh(t,e,n,s,r,o,a,l,c,u,h){const d=qS,f=YS,p=$S,v=jS,g=ZS,m=KS,x=ew,M=XS,_=VS,C=nw;he.pointToLocalFrame(s,o,n,g);const T=t.radius;x.lowerBound.set(g.x-T,g.y-T,g.z-T),x.upperBound.set(g.x+T,g.y+T,g.z+T),e.getTrianglesInAABB(x,C);const P=WS,U=t.radius*t.radius;for(let L=0;L<C.length;L++)for(let H=0;H<3;H++)if(e.getVertex(e.indices[C[L]*3+H],P),P.vsub(g,_),_.lengthSquared()<=U){if(M.copy(P),he.pointToWorldFrame(s,o,M,P),P.vsub(n,_),h)return!0;let G=this.createContactEquation(a,l,t,e,c,u);G.ni.copy(_),G.ni.normalize(),G.ri.copy(G.ni),G.ri.scale(t.radius,G.ri),G.ri.vadd(n,G.ri),G.ri.vsub(a.position,G.ri),G.rj.copy(P),G.rj.vsub(l.position,G.rj),this.result.push(G),this.createFrictionEquationsFromContact(G,this.frictionResult)}for(let L=0;L<C.length;L++)for(let H=0;H<3;H++){e.getVertex(e.indices[C[L]*3+H],d),e.getVertex(e.indices[C[L]*3+(H+1)%3],f),f.vsub(d,p),g.vsub(f,m);const G=m.dot(p);g.vsub(d,m);let k=m.dot(p);if(k>0&&G<0&&(g.vsub(d,m),v.copy(p),v.normalize(),k=m.dot(v),v.scale(k,m),m.vadd(d,m),m.distanceTo(g)<t.radius)){if(h)return!0;const X=this.createContactEquation(a,l,t,e,c,u);m.vsub(g,X.ni),X.ni.normalize(),X.ni.scale(t.radius,X.ri),X.ri.vadd(n,X.ri),X.ri.vsub(a.position,X.ri),he.pointToWorldFrame(s,o,m,m),m.vsub(l.position,X.rj),he.vectorToWorldFrame(o,X.ni,X.ni),he.vectorToWorldFrame(o,X.ri,X.ri),this.result.push(X),this.createFrictionEquationsFromContact(X,this.frictionResult)}}const b=JS,y=QS,R=tw,B=HS;for(let L=0,H=C.length;L!==H;L++){e.getTriangleVertices(C[L],b,y,R),e.getNormal(C[L],B),g.vsub(b,m);let G=m.dot(B);if(B.scale(G,m),g.vsub(m,m),G=m.distanceTo(g),Ge.pointInTriangle(m,b,y,R)&&G<t.radius){if(h)return!0;let k=this.createContactEquation(a,l,t,e,c,u);m.vsub(g,k.ni),k.ni.normalize(),k.ni.scale(t.radius,k.ri),k.ri.vadd(n,k.ri),k.ri.vsub(a.position,k.ri),he.pointToWorldFrame(s,o,m,m),m.vsub(l.position,k.rj),he.vectorToWorldFrame(o,k.ni,k.ni),he.vectorToWorldFrame(o,k.ri,k.ri),this.result.push(k),this.createFrictionEquationsFromContact(k,this.frictionResult)}}C.length=0}planeTrimesh(t,e,n,s,r,o,a,l,c,u,h){const d=new w,f=zS;f.set(0,0,1),r.vmult(f,f);for(let p=0;p<e.vertices.length/3;p++){e.getVertex(p,d);const v=new w;v.copy(d),he.pointToWorldFrame(s,o,v,d);const g=kS;if(d.vsub(n,g),f.dot(g)<=0){if(h)return!0;const x=this.createContactEquation(a,l,t,e,c,u);x.ni.copy(f);const M=GS;f.scale(g.dot(f),M),d.vsub(M,M),x.ri.copy(M),x.ri.vsub(a.position,x.ri),x.rj.copy(d),x.rj.vsub(l.position,x.rj),this.result.push(x),this.createFrictionEquationsFromContact(x,this.frictionResult)}}}}const As=new w,pr=new w,mr=new w,US=new w,FS=new w,OS=new Ve,BS=new Ve,zS=new w,kS=new w,GS=new w,HS=new w,VS=new w;new w;const WS=new w,XS=new w,qS=new w,YS=new w,$S=new w,jS=new w,ZS=new w,KS=new w,JS=new w,QS=new w,tw=new w,ew=new In,nw=[],Da=new w,ef=new w,iw=new w,sw=new w,rw=new w;function ow(i,t,e){let n=null;const s=i.length;for(let r=0;r!==s;r++){const o=i[r],a=iw;i[(r+1)%s].vsub(o,a);const l=sw;a.cross(t,l);const c=rw;e.vsub(o,c);const u=l.dot(c);if(n===null||u>0&&n===!0||u<=0&&n===!1){n===null&&(n=u>0);continue}else return!1}return!0}const Na=new w,aw=new w,lw=new w,cw=new w,hw=[new w,new w,new w,new w,new w,new w],uw=new w,dw=new w,fw=new w,pw=new w,mw=new w,gw=new w,vw=new w,xw=new w,yw=new w,_w=new w,Mw=new w,Sw=new w,ww=new w,bw=new w;new w;new w;const Ew=new w,Tw=new w,Aw=new w,Cw=new w,Rw=new w,Pw=new w,Lw=new w,Iw=new w,Dw=new w,Nw=new w,nf=new Ve,Uw=new w;new w;const Fw=new w,sf=new w,Ow=new w,Bw=new w,zw=new w,kw=[0],Gw=new w,Hw=new w;class rf{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){const n=e;e=t,t=n}return t<<16|e}set(t,e){const n=this.getKey(t,e),s=this.current;let r=0;for(;n>s[r];)r++;if(n!==s[r]){for(let o=s.length-1;o>=r;o--)s[o+1]=s[o];s[r]=n}}tick(){const t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){const n=this.current,s=this.previous,r=n.length,o=s.length;let a=0;for(let l=0;l<r;l++){let c=!1;const u=n[l];for(;u>s[a];)a++;c=u===s[a],c||of(t,u)}a=0;for(let l=0;l<o;l++){let c=!1;const u=s[l];for(;u>n[a];)a++;c=n[a]===u,c||of(e,u)}}}function of(i,t){i.push((t&4294901760)>>16,t&65535)}const pc=(i,t)=>i<t?`${i}-${t}`:`${t}-${i}`;class Vw{constructor(){this.data={keys:[]}}get(t,e){const n=pc(t,e);return this.data[n]}set(t,e,n){const s=pc(t,e);this.get(t,e)||this.data.keys.push(s),this.data[s]=n}delete(t,e){const n=pc(t,e),s=this.data.keys.indexOf(n);s!==-1&&this.data.keys.splice(s,1),delete this.data[n]}reset(){const t=this.data,e=t.keys;for(;e.length>0;){const n=e.pop();delete t[n]}}}class Ww extends lp{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new w,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new w,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new KM,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new CS,this.constraints=[],this.narrowphase=new NS(this),this.collisionMatrix=new Wd,this.collisionMatrixPrevious=new Wd,this.bodyOverlapKeeper=new rf,this.shapeOverlapKeeper=new rf,this.contactmaterials=[],this.contactMaterialTable=new Vw,this.defaultMaterial=new Gr("default"),this.defaultContactMaterial=new Go(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){const t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){const e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof il?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,s){return n===void 0&&(n={}),n.mode=Ge.ALL,n.from=t,n.to=e,n.callback=s,mc.intersectWorld(this,n)}raycastAny(t,e,n,s){return n===void 0&&(n={}),n.mode=Ge.ANY,n.from=t,n.to=e,n.result=s,mc.intersectWorld(this,n)}raycastClosest(t,e,n,s){return n===void 0&&(n={}),n.mode=Ge.CLOSEST,n.from=t,n.to=e,n.result=s,mc.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof Rt&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;const e=this.bodies.length-1,n=this.bodies,s=n.indexOf(t);if(s!==-1){n.splice(s,1);for(let r=0;r!==n.length;r++)n[r].index=r;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){const e=this.bodies;for(let n=0;n<e.length;n++){const s=e[n].shapes;for(let r=0;r<s.length;r++){const o=s[r];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){const e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);const n=qe.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{const s=n-this.lastCallTime;this.step(t,s,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;const s=qe.now();let r=0;for(;this.accumulator>=t&&r<n&&(this.internalStep(t),this.accumulator-=t,r++,!(qe.now()-s>t*1e3)););this.accumulator=this.accumulator%t;const o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;const e=this.contacts,n=jw,s=Zw,r=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,u=this.profile,h=Rt.DYNAMIC;let d=-1/0;const f=this.constraints,p=$w;l.length();const v=l.x,g=l.y,m=l.z;let x=0;for(c&&(d=qe.now()),x=0;x!==r;x++){const L=o[x];if(L.type===h){const H=L.force,G=L.mass;H.x+=G*v,H.y+=G*g,H.z+=G*m}}for(let L=0,H=this.subsystems.length;L!==H;L++)this.subsystems[L].update();c&&(d=qe.now()),n.length=0,s.length=0,this.broadphase.collisionPairs(this,n,s),c&&(u.broadphase=qe.now()-d);let M=f.length;for(x=0;x!==M;x++){const L=f[x];if(!L.collideConnected)for(let H=n.length-1;H>=0;H-=1)(L.bodyA===n[H]&&L.bodyB===s[H]||L.bodyB===n[H]&&L.bodyA===s[H])&&(n.splice(H,1),s.splice(H,1))}this.collisionMatrixTick(),c&&(d=qe.now());const _=Yw,C=e.length;for(x=0;x!==C;x++)_.push(e[x]);e.length=0;const T=this.frictionEquations.length;for(x=0;x!==T;x++)p.push(this.frictionEquations[x]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,s,this,e,_,this.frictionEquations,p),c&&(u.narrowphase=qe.now()-d),c&&(d=qe.now()),x=0;x<this.frictionEquations.length;x++)a.addEquation(this.frictionEquations[x]);const P=e.length;for(let L=0;L!==P;L++){const H=e[L],G=H.bi,k=H.bj,K=H.si,X=H.sj;let rt;if(G.material&&k.material?rt=this.getContactMaterial(G.material,k.material)||this.defaultContactMaterial:rt=this.defaultContactMaterial,rt.friction,G.material&&k.material&&(G.material.friction>=0&&k.material.friction>=0&&G.material.friction*k.material.friction,G.material.restitution>=0&&k.material.restitution>=0&&(H.restitution=G.material.restitution*k.material.restitution)),a.addEquation(H),G.allowSleep&&G.type===Rt.DYNAMIC&&G.sleepState===Rt.SLEEPING&&k.sleepState===Rt.AWAKE&&k.type!==Rt.STATIC){const gt=k.velocity.lengthSquared()+k.angularVelocity.lengthSquared(),ct=k.sleepSpeedLimit**2;gt>=ct*2&&(G.wakeUpAfterNarrowphase=!0)}if(k.allowSleep&&k.type===Rt.DYNAMIC&&k.sleepState===Rt.SLEEPING&&G.sleepState===Rt.AWAKE&&G.type!==Rt.STATIC){const gt=G.velocity.lengthSquared()+G.angularVelocity.lengthSquared(),ct=G.sleepSpeedLimit**2;gt>=ct*2&&(k.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(G,k,!0),this.collisionMatrixPrevious.get(G,k)||(to.body=k,to.contact=H,G.dispatchEvent(to),to.body=G,k.dispatchEvent(to)),this.bodyOverlapKeeper.set(G.id,k.id),this.shapeOverlapKeeper.set(K.id,X.id)}for(this.emitContactEvents(),c&&(u.makeContactConstraints=qe.now()-d,d=qe.now()),x=0;x!==r;x++){const L=o[x];L.wakeUpAfterNarrowphase&&(L.wakeUp(),L.wakeUpAfterNarrowphase=!1)}for(M=f.length,x=0;x!==M;x++){const L=f[x];L.update();for(let H=0,G=L.equations.length;H!==G;H++){const k=L.equations[H];a.addEquation(k)}}a.solve(t,this),c&&(u.solve=qe.now()-d),a.removeAllEquations();const U=Math.pow;for(x=0;x!==r;x++){const L=o[x];if(L.type&h){const H=U(1-L.linearDamping,t),G=L.velocity;G.scale(H,G);const k=L.angularVelocity;if(k){const K=U(1-L.angularDamping,t);k.scale(K,k)}}}this.dispatchEvent(qw),c&&(d=qe.now());const y=this.stepnumber%(this.quatNormalizeSkip+1)===0,R=this.quatNormalizeFast;for(x=0;x!==r;x++)o[x].integrate(t,y,R);this.clearForces(),this.broadphase.dirty=!0,c&&(u.integrate=qe.now()-d),this.stepnumber+=1,this.dispatchEvent(Xw);let B=!0;if(this.allowSleep)for(B=!1,x=0;x!==r;x++){const L=o[x];L.sleepTick(this.time),L.sleepState!==Rt.SLEEPING&&(B=!0)}this.hasActiveBodies=B}emitContactEvents(){const t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff(Pi,Li),t){for(let r=0,o=Pi.length;r<o;r+=2)eo.bodyA=this.getBodyById(Pi[r]),eo.bodyB=this.getBodyById(Pi[r+1]),this.dispatchEvent(eo);eo.bodyA=eo.bodyB=null}if(e){for(let r=0,o=Li.length;r<o;r+=2)no.bodyA=this.getBodyById(Li[r]),no.bodyB=this.getBodyById(Li[r+1]),this.dispatchEvent(no);no.bodyA=no.bodyB=null}Pi.length=Li.length=0;const n=this.hasAnyEventListener("beginShapeContact"),s=this.hasAnyEventListener("endShapeContact");if((n||s)&&this.shapeOverlapKeeper.getDiff(Pi,Li),n){for(let r=0,o=Pi.length;r<o;r+=2){const a=this.getShapeById(Pi[r]),l=this.getShapeById(Pi[r+1]);Ii.shapeA=a,Ii.shapeB=l,a&&(Ii.bodyA=a.body),l&&(Ii.bodyB=l.body),this.dispatchEvent(Ii)}Ii.bodyA=Ii.bodyB=Ii.shapeA=Ii.shapeB=null}if(s){for(let r=0,o=Li.length;r<o;r+=2){const a=this.getShapeById(Li[r]),l=this.getShapeById(Li[r+1]);Di.shapeA=a,Di.shapeB=l,a&&(Di.bodyA=a.body),l&&(Di.bodyB=l.body),this.dispatchEvent(Di)}Di.bodyA=Di.bodyB=Di.shapeA=Di.shapeB=null}}clearForces(){const t=this.bodies,e=t.length;for(let n=0;n!==e;n++){const s=t[n];s.force,s.torque,s.force.set(0,0,0),s.torque.set(0,0,0)}}}new In;const mc=new Ge,qe=globalThis.performance||{};if(!qe.now){let i=Date.now();qe.timing&&qe.timing.navigationStart&&(i=qe.timing.navigationStart),qe.now=()=>Date.now()-i}new w;const Xw={type:"postStep"},qw={type:"preStep"},to={type:Rt.COLLIDE_EVENT_NAME,body:null,contact:null},Yw=[],$w=[],jw=[],Zw=[],Pi=[],Li=[],eo={type:"beginContact",bodyA:null,bodyB:null},no={type:"endContact",bodyA:null,bodyB:null},Ii={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},Di={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null};function Kw(i){const t=i.length,e=[...i.map(s=>new w(s.x,s.y,-1)),...i.map(s=>new w(s.x,s.y,3))],n=[Array.from({length:t},(s,r)=>t-1-r),Array.from({length:t},(s,r)=>t+r)];for(let s=0;s<t;s++){const r=(s+1)%t;n.push([s,r,t+r,t+s])}return new Er({vertices:e,faces:n})}function Jw(i,t,e=0){for(let n=0;n<t.length;n++){const s=t[n],r=t[(n+1)%t.length],o=r.x-s.x,a=r.y-s.y;if(o*(i.y-s.y)-a*(i.x-s.x)<-e*Math.hypot(o,a))return!1}return!0}function Qw(i,t,e,n=0){let s=0,r=1;for(let o=0;o<e.length;o++){const a=e[o],l=e[(o+1)%e.length],c=l.x-a.x,u=l.y-a.y,h=c*(i.y-a.y)-u*(i.x-a.x)+n*Math.hypot(c,u),d=c*(t.y-i.y)-u*(t.x-i.x);if(Math.abs(d)<1e-10){if(h<0)return null}else{const f=-h/d;if(d>0?s=Math.max(s,f):r=Math.min(r,f),s>r)return null}}return s}const Ho={amplitude:2.8,period:12,halfWidth:2.2};function Mo(i,t=Ho){return t.amplitude*Math.sin(Math.PI*i/t.period)}function vp(i,t=Ho){let e=Math.max(-16,Math.min(16,i.x));for(let l=0;l<10;l++){const c=Math.PI/t.period,u=Mo(e,t),h=t.amplitude*c*Math.cos(c*e),d=-t.amplitude*c*c*Math.sin(c*e);e=Math.max(-16,Math.min(16,e-(e-i.x+(u-i.y)*h)/Math.max(.25,1+h*h+(u-i.y)*d)))}const n=Mo(e,t),s=t.amplitude*Math.PI/t.period*Math.cos(Math.PI*e/t.period),r=Math.hypot(1,s),o=-s/r,a=1/r;return{x:e,y:n,nx:o,ny:a,tx:1/r,ty:s/r,distance:(i.x-e)*o+(i.y-n)*a}}function tb(i,t,e=Ho,n=.31){const s=vp(i,e),r=e.halfWidth-n;if(Math.abs(s.distance)<=r)return!1;const o=Math.sign(s.distance);i.x=s.x+s.nx*o*r,i.y=s.y+s.ny*o*r;const a=(t.x*s.nx+t.y*s.ny)*o;return a>0&&(t.x-=s.nx*o*a,t.y-=s.ny*o*a),!0}function xp(i=Ho){const t=[],e=[];for(let n=0;n<=160;n++){const s=-17+n*34/160,r=Mo(s,i),o=i.amplitude*Math.PI/i.period*Math.cos(Math.PI*s/i.period),a=Math.hypot(1,o);t.push({x:s-o/a*i.halfWidth,y:r+i.halfWidth/a}),e.push({x:s+o/a*i.halfWidth,y:r-i.halfWidth/a})}return[[...t,{x:18,y:10},{x:-18,y:10}],[{x:-18,y:-10},{x:18,y:-10},...e.reverse()]]}const tn=1/120,yi=.75,eb=2;function So(i,t){return Math.max(0,i.createdAt+i.lifetime-t)}function yp(i,t,e="fade"){const n=So(i,t);return n<=0?0:e==="snap"?1:Math.min(1,n/(i.lifetime*.2))}function fl(i,t,e,n="fade"){let s=0,r=0;for(const o of t){const a=yp(o,e,n);if(a===0)continue;const l=o.x-i.x,c=o.y-i.y,u=l*l+c*c+yi*yi,h=o.strength*a/(u*Math.sqrt(u));s+=l*h,r+=c*h}return{x:s,y:r}}function nb(i,t,e,n=tn,s="fade"){const r=fl(i,t,e,s),o=i.vx+r.x*n,a=i.vy+r.y*n;return{x:i.x+o*n,y:i.y+a*n,vx:o,vy:a}}function ib(i,t,e,n=5,s="fade",r=8){const o=[{x:i.x,y:i.y}];let a={...i};const l=Math.ceil(n/tn);for(let c=0;c<l;c++)a=nb(a,t,e+c*tn,tn,s),(c+1)%r===0&&o.push({x:a.x,y:a.y});return o}function sb(i,t,e=eb){return[...i,t].slice(-e)}const Ne=1e-7,rs=i=>Math.round(i*1e6)/1e6;function rb(i){const t=[];for(let e=1;e<i.points.length;e++){const n=i.points[e-1],s=i.points[e],r=Math.hypot(s.x-n.x,s.y-n.y);r<Ne||t.push({id:`${i.id}-${e}`,sourceId:i.id,x:(n.x+s.x)/2,y:(n.y+s.y)/2,w:r+i.thickness,h:i.thickness,angle:Math.atan2(s.y-n.y,s.x-n.x)})}return t}function _p(i){const t=i.angle||0,e=Math.cos(t),n=Math.sin(t);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([s,r])=>({x:i.x+s*i.w/2*e-r*i.h/2*n,y:i.y+s*i.w/2*n+r*i.h/2*e}))}function mh(i,t){const e=t.angle||0,n=Math.cos(e),s=Math.sin(e),r=i.x-t.x,o=i.y-t.y;return{x:r*n+o*s,y:-r*s+o*n}}function ob(i,t,e){const n=e.x-t.x,s=e.y-t.y,r=n*n+s*s,o=r?Math.max(0,Math.min(1,((i.x-t.x)*n+(i.y-t.y)*s)/r)):0;return Math.hypot(i.x-(t.x+n*o),i.y-(t.y+s*o))}const af=i=>({x1:rs(i.x-i.width/2),x2:rs(i.x+i.width/2),y1:rs(i.y-i.height/2),y2:rs(i.y+i.height/2),id:i.id});function gh(i,t=[],e=new Set){const n=i.map(af),s=t.map(af);if(!n.length)return[];const r=[...new Set([...n,...s].flatMap(h=>[h.x1,h.x2]))].sort((h,d)=>h-d),o=[];for(let h=1;h<r.length;h++){const d=r[h-1],f=r[h];if(f-d<Ne)continue;const p=n.filter(m=>m.x1<f-Ne&&m.x2>d+Ne).map(m=>[m.y1,m.y2]).sort((m,x)=>m[0]-x[0]),v=[];for(const m of p){const x=v.at(-1);x&&m[0]<=x[1]+Ne?x[1]=Math.max(x[1],m[1]):v.push([...m])}const g=s.filter(m=>m.x1<f-Ne&&m.x2>d+Ne);for(const[m,x]of v){let M=[[m,x]];for(const _ of g)M=M.flatMap(([C,T])=>_.y2<=C+Ne||_.y1>=T-Ne?[[C,T]]:[[C,Math.min(T,_.y1)],[Math.max(C,_.y2),T]].filter(([P,U])=>U-P>Ne));for(const[_,C]of M)o.push({x1:d,x2:f,y1:_,y2:C})}}const a=new Map,l=[];for(const h of o){const d=`${h.y1}/${h.y2}`,f=a.get(d);if(f&&Math.abs(f.x2-h.x1)<Ne)f.x2=h.x2;else{const p={...h};l.push(p),a.set(d,p)}}const c=new Set(e);let u=1;return l.map(h=>{const d=n.find(p=>!c.has(p.id)&&Math.abs(p.x1-h.x1)<Ne&&Math.abs(p.x2-h.x2)<Ne&&Math.abs(p.y1-h.y1)<Ne&&Math.abs(p.y2-h.y2)<Ne)||n.find(p=>!c.has(p.id)&&p.x1>=h.x1-Ne&&p.x2<=h.x2+Ne&&p.y1>=h.y1-Ne&&p.y2<=h.y2+Ne)||n.find(p=>!c.has(p.id)&&h.x1>=p.x1-Ne&&h.x2<=p.x2+Ne&&h.y1>=p.y1-Ne&&h.y2<=p.y2+Ne);let f=d==null?void 0:d.id;if(!f)do f=`wall-${u++}`;while(c.has(f)||n.some(p=>p.id===f));return c.add(f),{id:f,x:rs((h.x1+h.x2)/2),y:rs((h.y1+h.y2)/2),width:rs(h.x2-h.x1),height:rs(h.y2-h.y1)}})}function Yh(i,t=[]){const e=new Set(t.map(s=>s.id));return[...gh(i,[],e).map(s=>({id:s.id,x:s.x,y:s.y,w:s.width,h:s.height,angle:0})),...t.flatMap(rb)]}const ue=.31,Mp=10,Hn={bounds:{minX:-16,maxX:16,minY:-9,maxY:9},spawn:{x:-10,y:-5,vx:0,vy:2.5},goal:{x:10,y:-5,radius:1},walls:[{x:-16.25,y:0,w:.5,h:18.5},{x:16.25,y:0,w:.5,h:18.5},{x:0,y:9.25,w:32.5,h:.5},{x:0,y:-9.25,w:32.5,h:.5},{x:-4,y:-3.5,w:.55,h:11},{x:4,y:3.5,w:.55,h:11}],spikes:[{x:-4.8,y:-6.7,w:.55,h:.8},{x:3.2,y:6.7,w:.55,h:.8}]};function li(i,t,e){const n=mh(i,e),s=Math.max(Math.abs(n.x)-e.w/2,0),r=Math.max(Math.abs(n.y)-e.h/2,0);return s*s+r*r<=t*t}function $h(i,t,e,n){const s=mh(i,n),r=mh(t,n),o=-n.w/2-e,a=n.w/2+e,l=-n.h/2-e,c=n.h/2+e;let u=0,h=1;for(const[d,f,p,v]of[[s.x,r.x-s.x,o,a],[s.y,r.y-s.y,l,c]])if(Math.abs(f)<1e-9){if(d<p||d>v)return null}else{const g=(p-d)/f,m=(v-d)/f;if(u=Math.max(u,Math.min(g,m)),h=Math.min(h,Math.max(g,m)),u>h)return null}return u}function ab(i,t,e=Hn.goal){const n=t.x-i.x,s=t.y-i.y,r=e.radius+ue,o=n*n+s*s;if(o<1e-12)return Math.hypot(i.x-e.x,i.y-e.y)<=r?0:null;const a=2*((i.x-e.x)*n+(i.y-e.y)*s),l=(i.x-e.x)**2+(i.y-e.y)**2-r**2;if(l<=0)return 0;const c=a*a-4*o*l;if(c<0)return null;const u=(-a-Math.sqrt(c))/(2*o);return u>=0&&u<=1?u:null}function Sp(i,t,e=Hn){let n=null;for(const[r,o]of[["spike",e.spikes],["wall",e.walls]])for(const a of o){const l=$h(i,t,ue,a);l!==null&&(!n||l<n.t)&&(n={type:r,t:l,x:i.x+(t.x-i.x)*l,y:i.y+(t.y-i.y)*l})}for(const r of e.guides||[]){const o=Qw(i,t,r,ue);o!==null&&(!n||o<n.t)&&(n={type:"wall",t:o,x:i.x+(t.x-i.x)*o,y:i.y+(t.y-i.y)*o})}e.channel&&Math.abs(vp(t,e.channel).distance)>e.channel.halfWidth-ue&&(n=n||{type:"wall",t:1,x:t.x,y:t.y});const s=ab(i,t,e.goal);return s!==null&&(!n||s<n.t)&&(n={type:"goal",t:s,x:i.x+(t.x-i.x)*s,y:i.y+(t.y-i.y)*s}),n}function jh(i,t=Hn){return i.x<t.bounds.minX+.75||i.x>t.bounds.maxX-.75||i.y<t.bounds.minY+.75||i.y>t.bounds.maxY-.75||(t.guides||[]).some(e=>Jw(i,e,.47))||t.walls.some(e=>li(i,.47,e))||t.spikes.some(e=>li(i,.47,e))?!1:Math.hypot(i.x-t.goal.x,i.y-t.goal.y)>t.goal.radius+.35}function Zh(i,t=Mp){const e=Math.hypot(i.x,i.y);return e>t&&(i.x*=t/e,i.y*=t/e),i}function lb(i,t=Hn){let e=0,n=0;const s=4;for(const r of t.spikes){const o=r.x-i.x,a=r.y-i.y,l=Math.hypot(o,a);if(l>=s)continue;const c=l*l+yi*yi,u=(1-(l/s)**2)**2,h=(r.strength??3)*u/(c*Math.sqrt(c));e+=o*h,n+=a*h}return{x:e,y:n}}function Kh(i,t,e,n="fade",s=Hn){const r=fl(i,t,e,n),o=lb(i,s),a=cb(i,s);return{x:r.x+o.x+a.x,y:r.y+o.y+a.y}}function cb(i,t=Hn){const e=t.goal.x-i.x,n=t.goal.y-i.y,s=e*e+n*n+yi*yi,r=(t.goal.gravity??5)/(s*Math.sqrt(s));return{x:e*r,y:n*r}}function hb(i,t,e,n=3,s="fade",r=Hn){const o=[{x:i.x,y:i.y}];let a={...i};const l=Math.ceil(n/tn);for(let c=0;c<l;c++){const u=Kh(a,t,e+c*tn,s,r),h=a.vx+u.x*tn,d=a.vy+u.y*tn,f={x:a.x+h*tn,y:a.y+d*tn,vx:h,vy:d},p=Zh({x:f.vx,y:f.vy});f.vx=p.x,f.vy=p.y;const v=Sp(a,f,r);if(v)return o.push({x:v.x,y:v.y}),{points:o,impact:v.type};a=f,(c+1)%5===0&&o.push({x:a.x,y:a.y})}return o.push({x:a.x,y:a.y}),{points:o,impact:null}}const Jh=new Set(["filters","lens","prism"]),ub=[16727606,16747570,16768852,6876793,4509157,6651135,12677631];function db(i,t,e=0){const n=Math.atan2(t.y-i.y,t.x-i.x)+e;return{x:Math.cos(n),y:Math.sin(n)}}function fb(i,t,e){return e.some(n=>$h(i,t,0,n)!==null)}const pb="varying vec2 world; void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xy;gl_Position=projectionMatrix*viewMatrix*p;}",mb=`varying vec2 world; uniform vec2 origin; uniform vec2 direction; uniform vec3 tint; uniform float strength; uniform float aligned; uniform float aperture; uniform float focus; uniform float spread; uniform vec4 walls[32]; uniform int wallCount;
 void main(){vec2 delta=world-origin;
 float x=dot(delta,direction);float y=abs(dot(delta,vec2(-direction.y,direction.x)));
 if(aligned>.5){
  // Start on the fixed glass plane, not a plane rotating around its center.
  x=delta.x*sign(direction.x);
  y=abs(delta.y-x*direction.y/max(abs(direction.x),.08));
 }
 if(x<.015||x>19.)discard;
 float width=focus>0. ? (x<focus ? aperture*(1.-x/focus)+.10 : .10+(x-focus)*.30) : aperture+x*spread;
 float edge=1.-smoothstep(width*.4,width,y);if(edge<=0.)discard;
 for(int i=0;i<32;i++){if(i>=wallCount)break;vec4 w=walls[i];vec2 d=world-origin;d=vec2(abs(d.x)<.00001?.00001:d.x,abs(d.y)<.00001?.00001:d.y);vec2 a=(w.xy-w.zw*.5-origin)/d,b=(w.xy+w.zw*.5-origin)/d;vec2 lo=min(a,b),hi=max(a,b);float nearT=max(lo.x,lo.y),farT=min(hi.x,hi.y);if(farT>=max(nearT,.001)&&nearT<.999&&farT>0.)discard;}
 float fade=pow(1.-x/19.,1.2);float concentration=focus>0.?min(2.5,1.5/max(width,.4)):1.;gl_FragColor=vec4(tint,edge*fade*strength*concentration);}`;class gb{constructor(t){this.group=new Ae,t.add(this.group),this.beams=[],this.devices=[]}clear(){for(const t of[...this.group.children])t.traverse(e=>{var n,s;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose()}),this.group.remove(t);this.beams=[],this.devices=[]}beam(t,e,n,s=0,r=.12,o=0){const a=Array.from({length:32},(u,h)=>{const d=this.level.walls[h];return new ve((d==null?void 0:d.x)||0,(d==null?void 0:d.y)||0,(d==null?void 0:d.w)||0,(d==null?void 0:d.h)||0)}),l=new Gn({uniforms:{origin:{value:new mt(t.x,t.y)},direction:{value:new mt(1,0)},tint:{value:new ee(e)},strength:{value:0},aligned:{value:this.kind==="prism"?0:1},aperture:{value:n},focus:{value:s},spread:{value:r},walls:{value:a},wallCount:{value:Math.min(32,this.level.walls.length)}},vertexShader:pb,fragmentShader:mb,transparent:!0,depthWrite:!1,blending:mn}),c=new de(new fs(32,18),l);c.position.z=-.84,this.group.add(c),this.beams.push({device:t,material:l,turn:o})}device(t,e,n,s,r=4){const o={x:t,y:e,height:r};this.devices.push(o);const a=new de(new Xs(.08,r,4),new Be({colorWrite:!1,depthWrite:!1}));a.position.set(t,e,1),a.castShadow=!0,this.group.add(a);let l;if(s==="prism"){const h=new Ir;h.moveTo(-.8,-1.6),h.lineTo(.95,0),h.lineTo(-.8,1.6),h.closePath(),l=new nl(h)}else if(s==="lens"){const h=new Ir;h.moveTo(0,-2),h.quadraticCurveTo(1,0,0,2),h.quadraticCurveTo(-1,0,0,-2),l=new nl(h,32)}else l=new fs(.18,r);const c=new de(l,new Be({color:n,transparent:!0,opacity:.3,depthWrite:!1,side:Cn}));c.position.set(t,e,1.6),this.group.add(c);const u=new Jg(new Qg(l),new ln({color:n,transparent:!0,opacity:.85}));return u.position.copy(c.position),this.group.add(u),o}reset(t){if(this.clear(),this.kind=t.mechanic,this.level=t.level,this.kind==="filters")for(const[e,n]of[16735110,7536556,7841279].entries()){const s=this.device(0,(e-1)*4,n,"filter",2.6);this.beam(s,n,1.3,0,.16)}if(this.kind==="lens"){const e=this.device(0,0,12119551,"lens");this.beam(e,14940415,1.9,5)}if(this.kind==="prism"){const e=this.device(0,0,15263999,"prism",3.2);ub.forEach((n,s)=>this.beam(e,n,.12,0,.045,(s-3)*.085+.18))}}update(t,e=1){if(Jh.has(this.kind))for(const n of this.beams){const s=Math.hypot(t.x-n.device.x,t.y-n.device.y),r=db(t,n.device,n.turn);n.material.uniforms.direction.value.set(r.x,r.y);const o=this.kind==="prism"?1:yg.smoothstep(Math.abs(r.x),.08,.35);n.material.uniforms.strength.value=s<.8?0:Math.min(.85,5*e/(2+s))*o*(fb(t,n.device,this.level.walls)?0:1)}}}const vb=[["release","Release the pull","Remove the oldest well","Catch a curve, then tap Remove well to fly along its tangent.","Where does letting go send you?"],["boost","A directed impulse","Slingshot gate","Cross the cyan ring for a fast launch to the right.","Can one impulse replace a long pull?"],["sticky","A moment of stillness","Capture and release","The amber spot catches you. Tap Release to leave in your incoming direction.","What changes when you can wait?"],["eclipse","The disappearing light","Eclipse","The dark body catches you and slowly covers your light. Release when ready.","Can sound carry you through darkness?"],["power","Gathering light","Light pickup","Begin dim. Collect the three pale lights to brighten your glow.","Does a brighter world change your route?"],["dimmer","Losing light","Light drain","Pass through the three violet motes to dim your glow.","How little light can you navigate by?"],["guide","Follow the bend","Guiding walls","Place wells beyond the black walls. Their pull guides the dot through the S-channel.","Can a wall become a track?"],["giant","A heavy neighbor","Large danger body","The orange body pulls gently. Its visible surface is fatal.","How close is a useful pass?"],["chaser","Something follows","Pursuit","A small orange body follows slowly. Draw it away with your wells.","Can a detour become an escape?"],["clock","Wait for an opening","Fixed danger orbit","Orange bodies follow a fixed orbit, unaffected by your wells.","When is the passage safe?"],["sound","Crossing the gates","Sound gates","Cross cyan for bass, violet for offbeat, and gold for chimes. Each adds a repeating part.","Can your route become an instrument?"],["hidden","Light reveals danger","Hidden body","A dark body behind the wall appears near your light. It vanishes completely outside direct light.","What can you discover before you touch it?"],["portals","Elsewhere, still moving","Paired portals","The two teal rings connect. Speed is preserved; the exit turns your flight upward.","Can you steer through a change of space?"],["shadow-posts","A forest of shadows","Moving light and posts","Thread the posts and watch their shadows sweep across one another.","What can a moving shadow reveal?"],["filters","Through colored glass","Color transmission","Move around the colored panes. Light passing through them changes color.","Can a surface paint the space beyond it?"],["lens","Gathering rays","A focusing lens","Move the light around the lens. Follow the beam into its focus and out again.","Where does light become concentrated?"],["prism","A spectrum unfolds","A dispersing prism","Move the light around the prism to turn a pale beam into a rainbow fan.","Can color describe the direction of light?"]];function xb(i){return vb.map(([t,e,n,s,r],o)=>({id:t,title:`${String(o+7).padStart(2,"0")} / ${e}`,rule:n,description:s,question:r,objective:s,color:["#76e9e3","#ffd98b","#bfa5ff"][o%3],heroGravity:0,moons:[],mechanic:t,level:{...i(t==="guide"?{x:-13,y:Mo(-13),vx:2.5,vy:0}:{x:-11,y:0,vx:2.5,vy:0},t==="guide"?{x:13,y:Mo(13)}:{x:12,y:5},t==="shadow-posts"?Array.from({length:15},(a,l)=>({x:-5+l%5*2.5,y:-4+Math.floor(l/5)*4+l%2*.6,w:.38,h:1.1})):t==="hidden"?[{x:-3,y:-3,w:.55,h:8}]:[]),channel:t==="guide"?{...Ho}:null,guides:[]}}))}function yb(i,t){return{x:i.x*Math.cos(t)-i.y*Math.sin(t),y:i.x*Math.sin(t)+i.y*Math.cos(t)}}function Nr(i,t,e){const n=t.x-i.x,s=t.y-i.y,r=Math.max(0,Math.min(1,((e.x-i.x)*n+(e.y-i.y)*s)/(n*n+s*s||1)));return Math.hypot(i.x+r*n-e.x,i.y+r*s-e.y)}class _b{constructor(t,e){this.scene=t,this.audio=e,this.group=new Ae,t.add(this.group),this.items=[]}clear(){for(const t of[...this.group.children])this.group.remove(t),t.traverse(e=>{var n,s;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose()});this.items=[],this.held=null,this.cooldown=0,this.brightness=1,this.layers=new Set,this.beat=-1,this.time=0}marker(t,e,n,s,r=!1){const o=new Be({color:s,transparent:!0,opacity:r?1:.8}),a=new de(r?new Xi(n,48):new zo(n-.035,n+.035,64),o);return a.position.set(t,e,1.4),this.group.add(a),a}reset(t){this.clear(),this.kind=t.mechanic,this.walls=t.level.walls;const e=(n,s,r,o,a=!1)=>{const l=["power","dimmer","giant","chaser","clock","portals"].includes(this.kind),c=this.kind==="dimmer"?ap(.22):this.kind==="eclipse"?op(r):l?Vh(["power","dimmer"].includes(this.kind)?.22:r,o,this.kind==="portals"):this.marker(n,s,r,o,a);(l||this.kind==="eclipse")&&(c.position.set(n,s,1.4),this.group.add(c));const u={x:n,y:s,r,mesh:c};return this.items.push(u),u};if(["boost","sticky","eclipse"].includes(this.kind)&&e(-3,0,this.kind==="eclipse"?.45:.85,this.kind==="eclipse"?1250339:this.kind==="boost"?7793123:16767371,this.kind==="eclipse"),["power","dimmer","sound"].includes(this.kind))for(let n=0;n<3;n++)e(-5+n*5,0,.65,this.kind==="power"?14680057:this.kind==="dimmer"?12559871:[7793123,12559871,16767371][n]);if(this.kind==="power"&&(this.brightness=.24),this.kind==="giant"){const n=t.giant||{x:0,y:0,radius:1.6,strength:22},s=e(n.x,n.y,n.radius,16747058,!0);s.strength=n.strength}if(this.kind==="chaser"&&e(-6,-4,.3,16747058,!0),this.kind==="clock")for(let n=0;n<3;n++){const s=e(0,0,.35,16747058,!0);s.phase=n*Math.PI*2/3}if(this.kind==="clock"&&this.marker(0,0,3.5,6376765),this.kind==="hidden"){const n=e(0,-2,1,9923428,!0);n.mesh.visible=!1}this.kind==="portals"&&(e(-3,0,1,7793123),e(6,-3,1,7793123),this.marker(6,-1.6,.12,7793123,!0)),this.kind==="boost"&&(this.marker(-2.8,0,.13,7793123,!0),this.marker(-2.5,0,.09,7793123,!0))}updateVisuals(t,e,n=1,s=1){var r,o;for(const a of this.items){if((o=(r=a.mesh.userData).animate)==null||o.call(r,e,s),this.kind==="hidden"){const l=Math.hypot(t.x-a.x,t.y-a.y),c=this.walls.some(d=>$h(t,a,0,d)!==null),u=Math.max(0,1-(l/50)**4)**2,h=85*Math.max(0,n)*u/(1+l*l);a.mesh.visible=h>.15&&!c,a.mesh.material.opacity=Math.min(1,Math.max(.35,h*.6))}this.kind==="sound"&&a.used&&a.mesh.scale.setScalar(1+.12*Math.exp(-(e*4%1)*4))}}release(t){if(!this.held)return;const{vx:e,vy:n}=this.held;t.velocity.set(e,n,0),this.held=null,this.cooldown=this.time+.8,this.brightness=1,this.audio.tone(440,0,.4,.08)}step(t,e,n,s,r,o){var c,u,h,d;if(this.time=n,this.held){t.position.set(this.held.x,this.held.y,0),t.velocity.setZero(),t.force.setZero(),this.kind==="eclipse"&&(this.brightness=Math.max(.025,1-(n-this.held.at)/3));return}const a=t.position;for(let f=0;f<this.items.length;f++){const p=this.items[f];if(p.used)continue;if(this.kind==="clock"&&f<3&&(p.x=Math.cos(n*.65+p.phase)*3.5,p.y=Math.sin(n*.65+p.phase)*3.5),this.kind==="chaser"){const g=a.x-p.x,m=a.y-p.y,x=Math.hypot(g,m)||1,M=fl(p,s,n,r);p.vx=(p.vx||0)+(g/x*.55+M.x*.3)/120,p.vy=(p.vy||0)+(m/x*.55+M.y*.3)/120;const _=Math.hypot(p.vx,p.vy);_>1.7&&(p.vx*=1.7/_,p.vy*=1.7/_),p.x+=p.vx/120,p.y+=p.vy/120,p.x=Math.max(-14,Math.min(14,p.x)),p.y=Math.max(-7,Math.min(7,p.y))}if(p.mesh.position.set(p.x,p.y,1.4),this.kind==="giant"){const g=p.x-a.x,m=p.y-a.y,x=g*g+m*m+2;t.velocity.x+=g*p.strength/Math.pow(x,1.5)/120,t.velocity.y+=m*p.strength/Math.pow(x,1.5)/120}const v=Nr(e,a,p)<p.r+ue;if(["giant","chaser","hidden"].includes(this.kind)||this.kind==="clock"&&f<3){if(v){o("hazard");return}continue}if(!(!v||n<this.cooldown)){if(["sticky","eclipse"].includes(this.kind)){this.held={x:p.x,y:p.y,vx:t.velocity.x,vy:t.velocity.y,at:n},t.position.set(p.x,p.y,0),t.velocity.setZero(),this.audio.tone(196,0,.8,.08);return}if(this.kind==="boost"&&(t.velocity.set(15,0,0),this.cooldown=n+1,this.audio.tone(660,0,.35,.08)),["power","dimmer"].includes(this.kind)&&(p.used=!0,p.mesh.visible=!1,this.brightness=Math.max(.15,Math.min(1.5,this.brightness+(this.kind==="power"?.4:-.28))),this.audio.tone(this.kind==="power"?523:196,0,.5,.08)),this.kind==="sound"&&(p.used=!0,p.mesh.material.color.setHex(16777215),this.layers.add(f),(u=(c=this.audio).gateAcquire)==null||u.call(c,f)),this.kind==="portals"){const g=this.items[1-f],m=f===0?Math.PI/2:-Math.PI/2,x=yb({x:t.velocity.x,y:t.velocity.y},m),M=Math.hypot(x.x,x.y)||1;return t.position.set(g.x+x.x/M*1.4,g.y+x.y/M*1.4,0),t.velocity.set(x.x,x.y,0),this.cooldown=n+.8,this.audio.tone(330,0,.6,.08),"teleport"}}}const l=Math.floor(n*4);if(l!==this.beat){this.beat=l;for(const f of this.layers)(d=(h=this.audio).gateBeat)==null||d.call(h,f,l)}}}const io=new z;function Fn(i,t,e,n,s,r){const o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;io.copy(t),io[n]=0,io.normalize();const c=.5*o/(o+a),u=1-io.angleTo(i)/l;return Math.sign(io[e])===1?u*c:a/(o+a)+c+c*(1-u)}class Qh extends Xs{constructor(t=1,e=1,n=1,s=2,r=.1){const o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new z,c=new z,u=new z(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=h.length/6,v=new z,g=.5/o;for(let m=0,x=0;m<h.length;m+=3,x+=2)switch(l.fromArray(h,m),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),h[m+0]=u.x*Math.sign(l.x)+c.x*r,h[m+1]=u.y*Math.sign(l.y)+c.y*r,h[m+2]=u.z*Math.sign(l.z)+c.z*r,d[m+0]=c.x,d[m+1]=c.y,d[m+2]=c.z,Math.floor(m/p)){case 0:v.set(1,0,0),f[x+0]=Fn(v,c,"z","y",r,n),f[x+1]=1-Fn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[x+0]=1-Fn(v,c,"z","y",r,n),f[x+1]=1-Fn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[x+0]=1-Fn(v,c,"x","z",r,t),f[x+1]=Fn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[x+0]=1-Fn(v,c,"x","z",r,t),f[x+1]=1-Fn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[x+0]=1-Fn(v,c,"x","y",r,t),f[x+1]=1-Fn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[x+0]=Fn(v,c,"x","y",r,t),f[x+1]=1-Fn(v,c,"y","x",r,e);break}}static fromJSON(t){return new Qh(t.width,t.height,t.depth,t.segments,t.radius)}}class Mb{constructor(){this.enabled=!0,this.step=0}unlock(){if(!this.enabled)return;const t=window.AudioContext||window.webkitAudioContext;if(t){if(!this.context){const e=this.context=new t;this.master=e.createGain(),this.master.gain.value=.32;const n=e.createDynamicsCompressor();this.master.connect(n),n.connect(e.destination),this.heartbeatBus=e.createGain(),this.heartbeatBus.gain.value=1,this.heartbeatBus.connect(this.master),this.tail=e.createOscillator(),this.tail.type="triangle",this.tailGain=e.createGain(),this.tailGain.gain.value=0,this.tail.connect(this.tailGain),this.tailGain.connect(this.master),this.tail.start(),this.humGain=e.createGain(),this.humGain.gain.value=0,this.humGain.connect(this.master),this.hum=e.createOscillator(),this.hum.type="triangle",this.hum.frequency.value=196,this.hum.connect(this.humGain),this.hum.start(),this.humOvertone=e.createOscillator(),this.humOvertone.frequency.value=392.35;const s=e.createGain();s.gain.value=.3,this.humOvertone.connect(s),s.connect(this.humGain),this.humOvertone.start();const r=e.createBuffer(1,e.sampleRate*2,e.sampleRate),o=r.getChannelData(0);for(let l=0;l<o.length;l++)o[l]=Math.random()*2-1;this.noiseBuffer=r,this.air=e.createBufferSource(),this.air.buffer=r,this.air.loop=!0;const a=e.createBiquadFilter();a.type="bandpass",a.frequency.value=1600,a.Q.value=.8,this.airGain=e.createGain(),this.airGain.gain.value=0,this.air.connect(a),a.connect(this.airGain),this.airGain.connect(this.master),this.air.start()}this.context.state==="suspended"&&this.context.resume().catch(()=>{})}}setEnabled(t){this.enabled=t,t&&this.unlock(),this.context&&this.master.gain.setTargetAtTime(t?.32:0,this.context.currentTime,.04)}tone(t,e=0,n=1.4,s=.16,r=t){if(!this.enabled||!this.context)return;const o=this.context,a=o.currentTime+e,l=o.createOscillator(),c=o.createGain();l.type="sine",l.frequency.setValueAtTime(t,a),l.frequency.exponentialRampToValueAtTime(Math.max(20,r),a+n),c.gain.setValueAtTime(0,a),c.gain.linearRampToValueAtTime(s,a+.025),c.gain.exponentialRampToValueAtTime(1e-4,a+n),l.connect(c),c.connect(this.master),l.start(a),l.stop(a+n+.05),l.onended=()=>{l.disconnect(),c.disconnect()}}placement(){this.unlock();const t=[293.665,440,329.628,523.251,391.995],e=t[this.step++%t.length];this.tone(e,0,1.9,.19),this.tone(e*2,.08,1.3,.045),this.tone(e,.32,1.5,.045)}trail(t,e,n){if(!this.context)return;const s=this.context.currentTime,r=Math.exp(-Math.max(0,n)/10),o=t&&this.enabled;this.tailGain.gain.setTargetAtTime(o?Math.min(.11,.035+e*.009)*r*.55:0,s,.16),this.airGain.gain.setTargetAtTime(o?Math.min(.13,e*.018)*r*.12:0,s,.2),this.tail.frequency.setTargetAtTime(260+Math.min(e,15)*16,s,.3)}orb(t,e,n=1){const s=.5+.5*Math.sin(e*Math.PI*2*.65);if(this.context){const r=Math.max(.08,Math.min(1.5,n));this.humGain.gain.setTargetAtTime(t&&this.enabled?(.04+s*.085)*r:0,this.context.currentTime,.08);const o=196*Math.pow(2,(Math.max(.15,n)-1)*.22);this.hum.frequency.setTargetAtTime(o,this.context.currentTime,.2),this.humOvertone.frequency.setTargetAtTime(o*2+.35,this.context.currentTime,.2)}return s}gateAcquire(t){const e=[130.81,392,783.99][t];this.tone(e,0,.3,.25),this.tone(e*1.5,.13,.4,.15),t===0&&(this.tone(261.63,0,.35,.18),this.tone(392,.08,.22,.06))}gateBeat(t,e){t===0&&e%4===0&&(this.tone(130.81,0,.22,.28,65.405),this.tone(261.63,0,.18,.085),this.tone(392,0,.11,.035)),t===1&&e%4===2&&this.tone(392,0,.18,.2),t===2&&e%2===1&&this.tone(e%4===1?783.99:587.33,0,.12,.14)}heartbeat(t,e=0){if(!this.enabled||!this.context)return;const n=this.context,s=n.currentTime,r=t==="lub"?90:115,o=t==="lub"?55:70,a=t==="lub"?.17:.13,l=n.createGain(),c=n.createOscillator(),u=n.createOscillator(),h=n.createGain();this.heartbeatBus.gain.setTargetAtTime(1,s,.005),c.type="triangle",c.frequency.setValueAtTime(r,s),c.frequency.exponentialRampToValueAtTime(o,s+a),u.type="sine",u.frequency.setValueAtTime(r*2,s),u.frequency.exponentialRampToValueAtTime(o*2,s+a),h.gain.value=.22,l.gain.setValueAtTime(0,s),l.gain.linearRampToValueAtTime(.22+Math.max(0,Math.min(1,e))*.09,s+.018),l.gain.exponentialRampToValueAtTime(1e-4,s+a),c.connect(l),u.connect(h),h.connect(l),l.connect(this.heartbeatBus),c.start(s),u.start(s),c.stop(s+a+.01),u.stop(s+a+.01),c.onended=()=>{c.disconnect(),u.disconnect(),h.disconnect(),l.disconnect()}}stopHeartbeat(){this.context&&this.heartbeatBus&&this.heartbeatBus.gain.setTargetAtTime(0,this.context.currentTime,.015)}noise(t,e,n){if(!this.enabled||!this.context)return;const s=this.context,r=s.currentTime,o=s.createBufferSource(),a=s.createBiquadFilter(),l=s.createGain();o.buffer=this.noiseBuffer,a.type="lowpass",a.frequency.setValueAtTime(e,r),a.frequency.exponentialRampToValueAtTime(80,r+t),l.gain.setValueAtTime(n,r),l.gain.exponentialRampToValueAtTime(1e-4,r+t),o.connect(a),a.connect(l),l.connect(this.master),o.start(),o.stop(r+t),o.onended=()=>{o.disconnect(),a.disconnect(),l.disconnect()}}death(){this.noise(.45,1800,.17),this.tone(150,0,.4,.17,42)}portal(){[261.626,329.628,391.995,523.251].forEach((t,e)=>this.tone(t,e*.11,2.6,.1)),this.noise(.8,4200,.035)}reset(){this.step=0,this.stopHeartbeat(),this.trail(!1,0,0),this.orb(!1,0)}}function Sb(i,t,e,n,s,r,o){const a=i.getContext("2d"),l=i.width,c=i.height;a.fillStyle="#050e18",a.fillRect(0,0,l,c);const u=48,h=Math.min((l-u*2)/(s.maxX-s.minX),(c-u*2)/(s.maxY-s.minY)),d=(s.maxX-s.minX)*h,f=(s.maxY-s.minY)*h,p=(l-d)/2,v=(c-f)/2,g=(s.minX+e)/(e*2)*t.width,m=(n-s.maxY)/(n*2)*t.height,x=(s.maxX-s.minX)/(e*2)*t.width,M=(s.maxY-s.minY)/(n*2)*t.height;a.save(),a.globalCompositeOperation="lighter",a.filter="blur(3px)";for(let P=0;P<4;P++)a.drawImage(t,g,m,x,M,p,v,d,f);a.filter="none";for(let P=0;P<7;P++)a.drawImage(t,g,m,x,M,p,v,d,f);a.restore();const _=P=>({x:p+(P.x-s.minX)*h,y:v+(s.maxY-P.y)*h}),C=_(r),T=_(o);a.shadowBlur=16,a.shadowColor="#7cffee",a.fillStyle="#dcfff6",a.beginPath(),a.arc(C.x,C.y,3,0,Math.PI*2),a.fill(),a.shadowColor="#b78aff",a.strokeStyle="#b78aff",a.lineWidth=2,a.beginPath(),a.arc(T.x,T.y,7,0,Math.PI*2),a.stroke(),a.shadowBlur=0}const lf=70,wb=Hn.walls.slice(0,4),bb=i=>{const t=i.maxX-i.minX,e=i.maxY-i.minY,n=(i.minX+i.maxX)/2,s=(i.minY+i.maxY)/2;return[{x:i.minX-.25,y:s,w:.5,h:e+.5},{x:i.maxX+.25,y:s,w:.5,h:e+.5},{x:n,y:i.maxY+.25,w:t+.5,h:.5},{x:n,y:i.minY-.25,w:t+.5,h:.5}]},Os=(i,t,e=[],n=[],s=Hn.bounds)=>({bounds:{...s},spawn:i,goal:{radius:1,...t},walls:[...(s===Hn.bounds?wb:bb(s)).map(r=>({...r})),...e],spikes:n}),hs=[{id:"drift",title:"01 / A gentle curve",rule:"Temporary gravity",color:"#76e9e3",description:"An open room. Place a well beside your path, then let its pull fade.",question:"How little force is enough to steer?",objective:"Bend your flight toward the portal.",level:Os({x:-11,y:-3,vx:2.5,vy:0},{x:11,y:3}),heroGravity:0,moons:[]},{id:"satellites",title:"02 / A little gravity",rule:"The dot attracts matter",color:"#bfa5ff",description:"Three loose moons respond to the dot and your wells. Attraction pulls both ways.",question:"Does carrying a little world change the flight?",objective:"Gather or scatter the pale moons. The portal is optional.",level:Os({x:-5,y:0,vx:1.3,vy:0},{x:12,y:0}),heroGravity:12,moons:[{x:-3.2,y:0,vx:1.3,vy:2},{x:-5,y:2.5,vx:-.7,vy:0},{x:-7.8,y:0,vx:1.3,vy:-1.7}]},{id:"slingshot",title:"03 / Close to the flame",rule:"Risk and redirection",color:"#ffae69",description:"A stronger ember bends nearby trajectories. Its bright center is still fatal.",question:"Can a hazard also become a useful tool?",objective:"Arc around the ember and over the black barrier.",level:Os({x:-11,y:-3,vx:2.6,vy:1.2},{x:11,y:3},[{x:4,y:-4.2,w:.55,h:9.6}],[{x:-1,y:0,w:.55,h:.8,strength:18}]),heroGravity:0,moons:[]},{id:"gate",title:"04 / Bring a moon",rule:"Matter opens a passage",color:"#ffd98b",description:"Draw the gold moon into the gold ring. The gate latches open when the moon arrives.",question:"Could gravity replace a key or a button?",objective:"Bring the moon to the gold ring, then reach the portal.",level:Os({x:-11,y:-3,vx:1,vy:.8},{x:11,y:0},[{x:0,y:0,w:.55,h:18,gate:!0}]),heroGravity:12,moons:[{x:-7,y:1.5,vx:0,vy:0}],plate:{x:-5,y:3,radius:1.2}},{id:"maze",title:"05 / The winding room",rule:"Level-design reference",color:"#89bfd4",description:"The original winding maze, with soft wells, orange hazards, and a purple exit.",question:"Which turns feel expressive, and which feel fiddly?",objective:"Find your way around the two barriers.",level:Hn,heroGravity:0,moons:[]},{id:"orbit",title:"06 / An orbital sketch",rule:"Catch, orbit, release",color:"#92c9ff",description:"Begin in a circular orbit. Add another well or let the first one dissolve.",question:"Where does an orbit become a drawing?",objective:"Let the wells leave a pattern.",sandbox:!0,level:Hn,heroGravity:0,moons:[]}];hs.push(...xb(Os));hs.push({id:"burnout",title:`${String(hs.length+1).padStart(2,"0")} / The burning light`,rule:"Light as fuel",color:"#ffd98b",description:"Your glow slowly burns away. Gather wandering embers to refill it and keep the gate open.",question:"Can light become a resource you route around?",objective:"Gather pale embers to keep the gate open, then reach the portal.",mechanic:"burnout",heroGravity:0,moons:[],level:Os({x:-11,y:-3,vx:.9,vy:.2},{x:11,y:3},[{x:5,y:0,w:.55,h:18,gate:!0}])},{id:"wideworld",title:`${String(hs.length+2).padStart(2,"0")} / A wider world`,rule:"Scale and space",color:"#a8c9ff",description:"A broad chamber with long open stretches and a larger portal. The same gravity rules feel different across distance.",question:"How does room to roam change your aim?",objective:"Cross the great chamber and enter the far portal.",heroGravity:0,moons:[],level:Os({x:-42,y:-18,vx:2.5,vy:.8},{x:42,y:18,radius:2},[{x:-23,y:-12,w:.8,h:16},{x:-2,y:13,w:.8,h:18},{x:20,y:-11,w:.8,h:19}],[],{minX:-48,maxX:48,minY:-27,maxY:27})});function wp(i){return hs.find(t=>t.id===i)||hs[0]}function Eb(i,t,e){const n={x:0,y:0},s=t.map(r=>{const o=i.x-r.x,a=i.y-r.y,l=o*o+a*a+yi*yi,c=e/(l*Math.sqrt(l)),u={x:o*c,y:a*c};return n.x-=u.x*r.mass,n.y-=u.y*r.mass,u});return{hero:n,moons:s}}function Tb(i,t){return!!i&&t.some(e=>Math.hypot(e.x-i.x,e.y-i.y)<=i.radius-.16)}const Ab=.018,Cb=.3,bp=18,Rb=4,Pb=.65;function Lb(i=0,t=Math.random){return{energy:.6,gateOpen:!0,pickups:[],nextSpawnAt:i+2.5+t()*1.5,nextId:1,pendingClose:!1}}function Ib(i,t,e,n,s=Math.random){for(let r=0;r<32;r++){const o=s()*Math.PI*2,a=2+s()*5,l={x:i.x+Math.cos(o)*a,y:i.y+Math.sin(o)*a};if(jh(l,t)&&!(!n&&t.walls.some(c=>c.gate&&(i.x-c.x)*(l.x-c.x)<0))&&!e.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<1.2))return l}return null}function Db(i,{before:t,hero:e,level:n,dt:s,time:r,rng:o=Math.random}){const a={...i,pickups:i.pickups.filter(h=>r-h.createdAt<bp)};a.energy=Math.max(.06,Math.min(1,i.energy-Ab*s));let l=0;if(a.pickups=a.pickups.filter(h=>Nr(t,e,h)<=Pb+ue?(l++,!1):!0),a.energy=Math.min(1,a.energy+l*Cb),r>=a.nextSpawnAt){if(a.pickups.length<Rb){const h=Ib(e,n,a.pickups,a.gateOpen,o);h&&a.pickups.push({...h,id:a.nextId++,createdAt:r})}a.nextSpawnAt=r+2.5+o()*1.5}const c=n.walls.find(h=>h.gate),u=!!c&&li(e,ue,c);return a.pendingClose=!1,a.gateOpen&&a.energy<.35?u?a.pendingClose=!0:a.gateOpen=!1:!a.gateOpen&&a.energy>.5&&(a.gateOpen=!0),{state:a,collected:l,gateChanged:a.gateOpen!==i.gateOpen}}function Nb(i,t,e=1.5){const n=i.maxX-i.minX+e*2,s=i.maxY-i.minY+e*2,r=Math.max(n,s*t);return{width:r,height:r/t}}function Ub(i){const t=Math.max(35,21*i);return{width:t,height:t/i}}function Fb(i,t,e,n,s,r,o=!1){const a=Math.hypot(e.x,e.y),l=t.x+(a?e.x/a*2:0),c=t.y+(a?e.y/a*2:0),u=(g,m,x)=>m>x?(m+x)/2:Math.max(m,Math.min(x,g)),h=s.width/2,d=s.height/2,f=u(l,n.minX+h-.75,n.maxX-h+.75),p=u(c,n.minY+d-.75,n.maxY-d+.75),v=o?1:1-Math.exp(-4*Math.max(0,r));return{x:i.x+(f-i.x)*v,y:i.y+(p-i.y)*v}}const Ob=1,Bb="campaign-1",zb="The long crossing",kb={minX:-20,maxX:76,minY:-27,maxY:27},Gb={startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},Hb={x:0,y:0,direction:0,speed:1.8},Vb={x:50,y:0,radius:1.5,gravity:5},Wb=[],Xb=[{id:"bass",type:"soundGate",x:10,y:0,radius:.9,slot:0},{id:"offbeat",type:"soundGate",x:24,y:6,radius:.9,slot:1},{id:"chime",type:"soundGate",x:40,y:-5,radius:.9,slot:2}],qb={version:Ob,id:Bb,title:zb,bounds:kb,settings:Gb,start:Hb,exit:Vb,walls:Wb,entities:Xb},Yb=1,$b="campaign-2",jb="The heavy neighbor",Zb={minX:-20,maxX:76,minY:-27,maxY:27},Kb={startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},Jb={x:0,y:0,direction:0,speed:1.8},Qb={x:50,y:0,radius:1.5,gravity:5},tE=[],eE=[{id:"giant",type:"ember",x:28,y:0,radius:4,gravity:70,lethal:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0},{id:"bass",type:"soundGate",x:10,y:0,radius:.9,slot:0},{id:"offbeat",type:"soundGate",x:28,y:9,radius:.9,slot:1},{id:"chime",type:"soundGate",x:43,y:-5,radius:.9,slot:2}],nE={version:Yb,id:$b,title:jb,bounds:Zb,settings:Kb,start:Jb,exit:Qb,walls:tE,entities:eE},tu="counterclockwise",iE=["counterclockwise","clockwise"],vh=3.5,Ep=9.6,sE=i=>i==="clockwise"?-1:1;function Tp(i){return i.orbitRadius>0&&i.speed>0?2*Math.PI*i.orbitRadius/i.speed:1/0}function pl(i,t){return i>0&&t>0&&Number.isFinite(i)&&Number.isFinite(t)?2*Math.PI*i/t:NaN}function ps(i,t=0){const e=Number.isFinite(i.orbitRadius)?i.orbitRadius:0,n=Number.isFinite(i.speed)?i.speed:0,r=(Number.isFinite(i.phase)?i.phase:0)*Math.PI/180+sE(i.orbitDirection)*t*n/Math.max(e,.01);return{x:i.x+Math.cos(r)*e,y:i.y+Math.sin(r)*e}}function rE(i,t){const e=Tp(i),n=!Number.isFinite(t)||t<0?NaN:t===0?0:Number.isFinite(e)?pl(t,e):Number.isFinite(i.speed)&&i.speed>=0?i.speed:0;return{...i,orbitRadius:t,speed:n}}function oE(i){const t=i.orbitRadius>0?i.orbitRadius:vh;return{...i,motion:"orbit",orbitRadius:t,speed:i.speed>0?i.speed:pl(t,Ep),orbitDirection:i.orbitDirection||tu}}function Ap(i,t){const e=pl(vh,Ep);return[0,120,240].map((n,s)=>({id:t[s],type:"ember",x:i.x,y:i.y,radius:.35,gravity:0,lethal:!0,motion:"orbit",speed:e,orbitRadius:vh,phase:n,orbitDirection:tu}))}function Cp(i,t,e,n,s=.31){for(const r of i){if(r.x-r.orbitRadius-r.radius<t.minX||r.x+r.orbitRadius+r.radius>t.maxX||r.y-r.orbitRadius-r.radius<t.minY||r.y+r.orbitRadius+r.radius>t.maxY)return"Orbit ring needs more room inside the bounds.";const o=ps(r,0);if(Math.hypot(o.x-e.x,o.y-e.y)<=r.radius+s)return"An orbiting ember would hit the start.";if(Math.hypot(o.x-n.x,o.y-n.y)<=r.radius+n.radius+s)return"An orbiting ember would cover the exit."}return null}function aE(i,t,e=null){const n=i.filter(a=>a.type==="ember"&&a.motion==="orbit"),s=n.map(a=>({entity:a,distance:Math.hypot(t.x-ps(a).x,t.y-ps(a).y)})).filter(a=>a.distance<=a.entity.radius+.4).sort((a,l)=>a.distance-l.distance);if(s.length)return{id:s[0].entity.id,part:"body"};const r=n.filter(a=>Math.hypot(t.x-a.x,t.y-a.y)<=.7);if(!r.length)return null;const o=r.findIndex(a=>a.id===e);return{id:r[(o+1)%r.length].id,part:"center"}}const lE=1,Rp=["ember","soundGate","impulse","stillness","eclipse","lightPickup","dimmer","portal"],Pp=262144,Ua=i=>JSON.parse(JSON.stringify(i)),Ps=i=>i&&typeof i=="object"&&!Array.isArray(i),oe=(i,t,e,n=-1/0,s=1/0)=>((typeof i!="number"||!Number.isFinite(i)||i<n||i>s)&&e.push(`${t} must be a finite number from ${n} to ${s}`),i),gc=(i,t,e)=>((typeof i!="string"||!/^[a-zA-Z0-9_-]{1,48}$/.test(i))&&e.push(`${t} must be a short unique ID`),i),so=(i,t,e)=>Ps(i)?{x:oe(i.x,`${t}.x`,e,-1e3,1e3),y:oe(i.y,`${t}.y`,e,-1e3,1e3)}:(e.push(`${t} is required`),{x:NaN,y:NaN}),gr=(i,t,e=0)=>i.x-e>=t.minX&&i.x+e<=t.maxX&&i.y-e>=t.minY&&i.y+e<=t.maxY;function os(i){var T,P,U,b;const t=[];if(!Ps(i))return{ok:!1,errors:["Level must be an object"],document:null};let e=1/0;try{e=new TextEncoder().encode(JSON.stringify(i)).length}catch{}e>Pp&&t.push("Level document exceeds 256 KB"),i.version!==lE&&t.push("Unsupported level version");const n=typeof i.title=="string"?i.title.trim().slice(0,80):"";n||t.push("title is required");const s=gc(i.id,"id",t),r=i.bounds;Ps(r)||t.push("bounds are required");const o={minX:oe(r==null?void 0:r.minX,"bounds.minX",t,-500,500),maxX:oe(r==null?void 0:r.maxX,"bounds.maxX",t,-500,500),minY:oe(r==null?void 0:r.minY,"bounds.minY",t,-500,500),maxY:oe(r==null?void 0:r.maxY,"bounds.maxY",t,-500,500)};o.maxX-o.minX>=8&&o.maxY-o.minY>=8||t.push("bounds must span at least 8 units on each axis");const a=i.settings;Ps(a)||t.push("settings are required");const l={startLight:oe(a==null?void 0:a.startLight,"settings.startLight",t,0,1),burnRate:oe(a==null?void 0:a.burnRate,"settings.burnRate",t,0,1),graceSeconds:oe(a==null?void 0:a.graceSeconds,"settings.graceSeconds",t,0,60),wellStrength:oe(a==null?void 0:a.wellStrength,"settings.wellStrength",t,0,500),wellLifetime:oe(a==null?void 0:a.wellLifetime,"settings.wellLifetime",t,.1,60),maxActiveWells:oe(a==null?void 0:a.maxActiveWells,"settings.maxActiveWells",t,1,10),maxTotalWells:(a==null?void 0:a.maxTotalWells)===null?null:oe(a==null?void 0:a.maxTotalWells,"settings.maxTotalWells",t,0,1e3),randomRecharge:a==null?void 0:a.randomRecharge};Number.isInteger(l.maxActiveWells)||t.push("maxActiveWells must be an integer"),l.maxTotalWells!==null&&!Number.isInteger(l.maxTotalWells)&&t.push("maxTotalWells must be an integer or null"),typeof l.randomRecharge!="boolean"&&t.push("randomRecharge must be true or false");const u={...so(i.start,"start",t),direction:oe((T=i.start)==null?void 0:T.direction,"start.direction",t,-360,360),speed:oe((P=i.start)==null?void 0:P.speed,"start.speed",t,0,30)},d={...so(i.exit,"exit",t),radius:oe((U=i.exit)==null?void 0:U.radius,"exit.radius",t,.3,10),gravity:oe((b=i.exit)==null?void 0:b.gravity,"exit.gravity",t,0,100)};(!Array.isArray(i.walls)||i.walls.length>3e3)&&t.push("walls must be an array of at most 3000"),i.wallPaths!==void 0&&(!Array.isArray(i.wallPaths)||i.wallPaths.length>150)&&t.push("wallPaths must be an array of at most 150"),(!Array.isArray(i.entities)||i.entities.length>200)&&t.push("entities must be an array of at most 200");const f=new Set(["__west","__east","__north","__south"]),p=(y,R)=>{gc(y,R,t),f.has(y)&&t.push(`Duplicate ID: ${y}`),f.add(y)},v=(Array.isArray(i.walls)?i.walls.slice(0,3e3):[]).map((y,R)=>Ps(y)?(p(y.id,`walls[${R}].id`),{id:y.id,...so(y,`walls[${R}]`,t),width:oe(y.width,`walls[${R}].width`,t,.1,1e3),height:oe(y.height,`walls[${R}].height`,t,.1,1e3)}):(t.push(`walls[${R}] is invalid`),null)).filter(Boolean);let g=0;const m=(Array.isArray(i.wallPaths)?i.wallPaths.slice(0,150):[]).map((y,R)=>{if(!Ps(y))return t.push(`wallPaths[${R}] is invalid`),null;p(y.id,`wallPaths[${R}].id`);const B=oe(y.thickness,`wallPaths[${R}].thickness`,t,.1,20);(!Array.isArray(y.points)||y.points.length<2||y.points.length>301)&&t.push(`wallPaths[${R}].points needs 2 to 301 points`);const L=(Array.isArray(y.points)?y.points.slice(0,301):[]).map((H,G)=>so(H,`wallPaths[${R}].points[${G}]`,t));g+=L.length;for(let H=1;H<L.length;H++)Math.hypot(L[H].x-L[H-1].x,L[H].y-L[H-1].y)<1e-5&&t.push(`wallPaths[${R}] has duplicate consecutive points`);return{id:y.id,thickness:B,points:L}}).filter(Boolean);g>450&&t.push("wallPaths exceed 450 total points");const x=new Set,M=new Map,_=(Array.isArray(i.entities)?i.entities.slice(0,200):[]).map((y,R)=>{if(!Ps(y))return t.push(`entities[${R}] is invalid`),null;p(y.id,`entities[${R}].id`);const B=`entities[${R}]`;Rp.includes(y.type)||t.push(`${B}.type is unsupported`);const L={id:y.id,type:y.type,...so(y,B,t),radius:oe(y.radius,`${B}.radius`,t,.1,20)};return y.type==="ember"?(L.gravity=oe(y.gravity,`${B}.gravity`,t,0,500),L.lethal=y.lethal,typeof y.lethal!="boolean"&&t.push(`${B}.lethal must be boolean`),L.motion=y.motion,["fixed","chaser","orbit"].includes(y.motion)||t.push(`${B}.motion is invalid`),L.speed=oe(y.speed,`${B}.speed`,t,0,20),L.orbitRadius=oe(y.orbitRadius,`${B}.orbitRadius`,t,0,40),L.phase=oe(y.phase,`${B}.phase`,t,-360,360),y.orbitDirection!==void 0&&!iE.includes(y.orbitDirection)&&t.push(`${B}.orbitDirection must be clockwise or counterclockwise`),L.orbitDirection=y.orbitDirection??tu):y.type==="soundGate"?(L.slot=oe(y.slot,`${B}.slot`,t,0,2),(!Number.isInteger(y.slot)||x.has(y.slot))&&t.push(`${B}.slot must be unique (0, 1, or 2)`),x.add(y.slot)):y.type==="impulse"?(L.direction=oe(y.direction,`${B}.direction`,t,-360,360),L.speed=oe(y.speed,`${B}.speed`,t,0,30)):y.type==="stillness"||y.type==="eclipse"?(L.captureTime=oe(y.captureTime,`${B}.captureTime`,t,.05,30),y.type==="eclipse"&&(L.fadeTime=oe(y.fadeTime,`${B}.fadeTime`,t,.05,30))):y.type==="lightPickup"||y.type==="dimmer"?(L.amount=oe(y.amount,`${B}.amount`,t,0,1),L.reusable=y.reusable,typeof y.reusable!="boolean"&&t.push(`${B}.reusable must be boolean`),L.cooldown=oe(y.cooldown,`${B}.cooldown`,t,0,60)):y.type==="portal"&&(L.pairId=gc(y.pairId,`${B}.pairId`,t),L.exitDirection=oe(y.exitDirection,`${B}.exitDirection`,t,-360,360),M.set(y.pairId,(M.get(y.pairId)||0)+1)),L}).filter(Boolean);for(const[y,R]of M)R!==2&&t.push(`Portal pair ${y} needs exactly two endpoints`);for(const[y,R]of M)if(R===2){const[B,L]=_.filter(H=>H.type==="portal"&&H.pairId===y);Math.hypot(B.x-L.x,B.y-L.y)<=B.radius+L.radius+ue&&t.push(`Portal pair ${y} endpoints overlap`)}gr(u,o,ue)||t.push("start must be inside bounds"),gr(d,o,d.radius)||t.push("exit must be inside bounds");const C=t.length?[]:Yh(v,m);C.length>300&&t.push(`Wall geometry has ${C.length} pieces; maximum 300. Erase or simplify walls.`);for(const y of C){if(y.sourceId&&_p(y).some(B=>!gr(B,o))&&t.push(`wall path ${y.sourceId} must fit inside bounds`),y.sourceId){li(u,ue,y)&&t.push(`start overlaps wall path ${y.sourceId}`),li(d,d.radius+ue,y)&&t.push(`exit overlaps wall path ${y.sourceId}`);continue}const R={id:y.id,x:y.x,y:y.y,width:y.w,height:y.h};(R.x-R.width/2<o.minX||R.x+R.width/2>o.maxX||R.y-R.height/2<o.minY||R.y+R.height/2>o.maxY)&&t.push(`wall ${y.id} must fit inside bounds`),li(u,ue,y)&&t.push(`start overlaps wall ${y.id}`),li(d,d.radius+ue,y)&&t.push(`exit overlaps wall ${y.id}`)}for(const y of v){(!gr(y,o)||y.x-y.width/2<o.minX||y.x+y.width/2>o.maxX||y.y-y.height/2<o.minY||y.y+y.height/2>o.maxY)&&t.push(`wall ${y.id} must fit inside bounds`);const R={x:y.x,y:y.y,w:y.width,h:y.height};li(u,ue,R)&&t.push(`start overlaps wall ${y.id}`),li(d,d.radius+ue,R)&&t.push(`exit overlaps wall ${y.id}`)}for(const y of _){const R=y.type==="ember"&&y.motion==="orbit"?y.orbitRadius:0;gr(y,o,y.radius+R)||t.push(`entity ${y.id} must fit inside bounds`)}for(const y of _.filter(R=>R.type==="ember"&&R.lethal)){const R=y.motion==="orbit"?ps(y,0):y;Math.hypot(u.x-R.x,u.y-R.y)<=y.radius+ue&&t.push(`start overlaps lethal ember ${y.id}`),Math.hypot(d.x-y.x,d.y-y.y)<=y.radius+d.radius+(y.motion==="orbit"?y.orbitRadius:0)&&t.push(`exit overlaps lethal ember ${y.id}`)}for(const y of _.filter(R=>R.type==="portal")){const R=y.exitDirection*Math.PI/180,B={x:y.x+Math.cos(R)*(y.radius+ue+.2),y:y.y+Math.sin(R)*(y.radius+ue+.2)};gr(B,o,ue)||t.push(`portal ${y.id} exit faces outside bounds`),C.some(L=>li(B,ue,L))&&t.push(`portal ${y.id} exit faces a wall`),_.some(L=>L.type==="ember"&&L.lethal&&Math.hypot(B.x-L.x,B.y-L.y)<=ue+L.radius+(L.motion==="orbit"?L.orbitRadius:0))&&t.push(`portal ${y.id} exit faces a lethal ember`)}return{ok:t.length===0,errors:t,document:t.length?null:{version:1,id:s,title:n,bounds:o,settings:l,start:u,exit:d,walls:v,wallPaths:m,entities:_}}}function cE(i){if(new TextEncoder().encode(i).length>Pp)return{ok:!1,errors:["Level document exceeds 256 KB"],document:null};try{return os(JSON.parse(i))}catch{return{ok:!1,errors:["Invalid JSON"],document:null}}}function ml(i){const t=os(i);if(!t.ok)throw new Error(t.errors.join("; "));const e=t.document,n=e.start.direction*Math.PI/180,s=e.bounds,r=(s.minX+s.maxX)/2,o=(s.minY+s.maxY)/2,a=s.maxX-s.minX,l=s.maxY-s.minY,c=[{id:"__west",x:s.minX-.25,y:o,w:.5,h:l+.5},{id:"__east",x:s.maxX+.25,y:o,w:.5,h:l+.5},{id:"__north",x:r,y:s.maxY+.25,w:a+.5,h:.5},{id:"__south",x:r,y:s.minY-.25,w:a+.5,h:.5}],u={bounds:Ua(e.bounds),spawn:{x:e.start.x,y:e.start.y,vx:Math.cos(n)*e.start.speed,vy:Math.sin(n)*e.start.speed},goal:Ua(e.exit),walls:[...c,...Yh(e.walls,e.wallPaths)],spikes:[],dangers:e.entities.filter(h=>h.type==="ember"&&h.lethal).map(h=>({x:h.x,y:h.y,radius:h.radius,strength:h.gravity}))};return{document:e,level:u,entities:Ua(e.entities),settings:Ua(e.settings)}}const Kn={startLight:.6,burnRate:.018,pickupGain:.3,graceSeconds:8,maxActiveWells:2,maxTotalWells:null,pickupLife:18,pickupRadius:.65},hE=[qb,nE].map(ml),eu=hE.map((i,t)=>({id:t+1,title:i.document.title,color:t?"#ffb365":"#b9fff0",objective:t?"Curve around the giant ember. Its gravity reaches beyond its fire.":"Keep your light alive. Cross the open chamber to the far portal.",mechanic:"campaign",heroGravity:0,moons:[],document:i.document,entities:i.entities,settings:i.settings,soundGates:i.entities.filter(e=>e.type==="soundGate").map(e=>({id:e.slot,x:e.x,y:e.y,radius:e.radius})),giant:t?{x:28,y:0,radius:4,strength:70}:void 0,level:i.level})),gl=eu[0];function nu(i){return eu.find(t=>t.id===Number(i))||gl}function uE(i){return eu.find(t=>t.id===Number(i)+1)||null}function Lp(i,t=gl.level,e=.47){return jh(i,t)&&!(t.dangers||[]).some(n=>Math.hypot(i.x-n.x,i.y-n.y)<n.radius+e)}function dE(i,t=Kn.maxTotalWells){return t===null||i<t}function cf(i){const t=Math.imul(i,1664525)+1013904223>>>0;return{seed:t,value:t/4294967296}}function fE(i=428,t=Kn){return{energy:t.startLight,graceLeft:t.graceSeconds,pickups:t.randomRecharge===!1?[]:[{x:6,y:2.5,id:1,createdAt:0},{x:15,y:-3,id:2,createdAt:0}],nextId:3,nextSpawnAt:7,seed:i,beatPhase:0,failed:!1}}function pE(i,t,e=gl.level){let n=t.seed;for(let s=0;s<32;s++){let r=cf(n);n=r.seed;const o=(r.value-.5)*Math.PI*1.5;r=cf(n),n=r.seed;const a=4+r.value*5,l={x:i.x+Math.cos(o)*a,y:i.y+Math.sin(o)*a};if(Lp(l,e,Kn.pickupRadius+ue)&&!(Math.hypot(l.x-e.goal.x,l.y-e.goal.y)<e.goal.radius+1.3)&&!t.pickups.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<2.5))return{point:l,seed:n}}return{point:null,seed:n}}function mE(i,{before:t,hero:e,dt:n,time:s,level:r=gl.level,config:o=Kn,extraEnergy:a=0}){if(i.failed)return{state:i,collected:0,heartbeat:[],failed:!1};const l={...i,pickups:i.pickups.filter(h=>s-h.createdAt<Kn.pickupLife)};l.energy=Math.max(0,i.energy-o.burnRate*n);let c=0;if(l.pickups=l.pickups.filter(h=>Nr(t,e,h)>Kn.pickupRadius+ue?!0:(c++,!1)),l.energy=Math.max(0,Math.min(1,l.energy+c*Kn.pickupGain+a)),o.randomRecharge!==!1&&s>=l.nextSpawnAt){const h=pE(e,l,r);l.seed=h.seed,h.point&&l.pickups.push({...h.point,id:l.nextId++,createdAt:s}),l.nextSpawnAt=s+(h.point?7:2)}const u=[];if(l.energy>0)l.graceLeft=o.graceSeconds,l.beatPhase=0;else if(l.graceLeft=Math.max(0,i.graceLeft-n),l.failed=l.graceLeft<=0,!l.failed){const h=o.graceSeconds>0?1-l.graceLeft/o.graceSeconds:1,d=n*(60+80*h)/60,f=i.energy>0?0:i.beatPhase;i.energy>0&&u.push({part:"lub",urgency:h});const p=f+d;for(let v=Math.floor(f);v<=Math.floor(p);v++)f<v+.22&&p>=v+.22&&u.push({part:"dub",urgency:h}),v>0&&f<v&&p>=v&&u.push({part:"lub",urgency:h});l.beatPhase=p%1}return{state:l,collected:c,heartbeat:u,failed:l.failed&&!i.failed}}const iu=["#76e9e3","#bfa5ff","#ffd98b"],Ip=["bass","offbeat","chime"],Dp="orbit-lab-campaign-finished-gates-v2";function gE(){return{mask:0,beat:-1}}function wo(i){return[0,1,2].reduce((t,e)=>t+(i>>e&1),0)}function Np(i){return Ip.filter((t,e)=>i&1<<e).join(" + ")||"none"}function vE(i,t,e,n,s){let r=i.mask;const o=[];for(const c of t)r&1<<c.id||Nr(e,n,c)<=c.radius+ue&&(r|=1<<c.id,o.push(c.id));const a=Math.floor(s*4),l=a===i.beat?[]:Ip.map((c,u)=>u).filter(c=>r&1<<c).map(c=>({id:c,beat:a}));return{state:{mask:r,beat:a},acquired:o,beats:l}}function xE(i,t=[1,2]){if(!i||typeof i!="object"||Array.isArray(i))return{};const e={};for(const n of t)Number.isInteger(i[n])&&i[n]>=0&&i[n]<=7&&(e[n]=i[n]);return e}function yE(i,t){return i===void 0||wo(t)>wo(i)?t:i}const vc=i=>i*Math.PI/180,_E=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y);function ME(i){return{items:Object.fromEntries(i.map(t=>{const e=t.type==="ember"&&t.motion==="orbit"?ps(t,0):t;return[t.id,{x:e.x,y:e.y,vx:0,vy:0,used:!1,until:-1,inside:!1}]})),held:null,teleportUntil:-1,eclipseMultiplier:1}}function su(i,t,e){if(!(i!=null&&i.held))return!1;const n=i.held;return t.velocity.x=n.vx,t.velocity.y=n.vy,i.items[n.id].until=e+.8,i.held=null,i.eclipseMultiplier=1,!0}function SE(i,t,e){let n=0,s=0;for(const r of t)if(r.type==="ember"&&r.gravity>0){const o=e.items[r.id],a=o.x-i.x,l=o.y-i.y,c=a*a+l*l+yi*yi,u=r.gravity/(c*Math.sqrt(c));n+=a*u,s+=l*u}return{x:n,y:s}}function wE(i,t,e,n,s,r,o=null){const a={died:!1,teleported:!1,energyDelta:0,tones:[]};let l=!1;if(i.held){const c=i.held;s<c.until?(n.position.x=c.x,n.position.y=c.y,n.velocity.x=0,n.velocity.y=0,i.eclipseMultiplier=c.eclipse?Math.max(.025,1-(s-c.started)/c.fadeTime):1,l=!0):su(i,n,s)}for(const c of t){const u=i.items[c.id];if(!u||c.type==="soundGate")continue;const h={x:u.x,y:u.y};if(c.type==="ember"){if(c.motion==="orbit"&&Object.assign(u,ps(c,s)),c.motion==="chaser"){const v=n.position.x-u.x,g=n.position.y-u.y,m=Math.hypot(v,g)||1;u.vx=(u.vx+v/m*r*2)*.995,u.vy=(u.vy+g/m*r*2)*.995;const x=Math.hypot(u.vx,u.vy);x>c.speed&&(u.vx*=c.speed/x,u.vy*=c.speed/x),u.x+=u.vx*r,u.y+=u.vy*r,o&&(u.x=Math.max(o.minX+c.radius,Math.min(o.maxX-c.radius,u.x)),u.y=Math.max(o.minY+c.radius,Math.min(o.maxY-c.radius,u.y)))}if(c.lethal){const v={x:e.x-h.x,y:e.y-h.y},g={x:n.position.x-u.x,y:n.position.y-u.y};if(Nr(v,g,{x:0,y:0})<=c.radius+ue)return a.died=!0,a}continue}if(l)continue;const d=Nr(e,n.position,u)<=c.radius+ue,f=_E(n.position,u)<=c.radius+ue,p=d&&!u.inside;if(u.inside=f,!(!p||u.used||s<u.until))if(c.type==="impulse")n.velocity.x=Math.cos(vc(c.direction))*c.speed,n.velocity.y=Math.sin(vc(c.direction))*c.speed,u.until=s+.5,a.tones.push("impulse");else{if(c.type==="stillness"||c.type==="eclipse")return i.held={id:c.id,x:c.x,y:c.y,vx:n.velocity.x,vy:n.velocity.y,started:s,until:s+c.captureTime,eclipse:c.type==="eclipse",fadeTime:c.fadeTime||1},n.position.x=c.x,n.position.y=c.y,n.velocity.x=0,n.velocity.y=0,a.tones.push("capture"),a;if(c.type==="lightPickup"||c.type==="dimmer")a.energyDelta+=(c.type==="lightPickup"?1:-1)*c.amount,c.reusable||(u.used=!0),u.until=s+c.cooldown,a.tones.push(c.type);else if(c.type==="portal"&&s>=i.teleportUntil){const v=t.find(x=>x.type==="portal"&&x.pairId===c.pairId&&x.id!==c.id);if(!v)continue;const g=vc(v.exitDirection),m=Math.hypot(n.velocity.x,n.velocity.y);return n.position.x=v.x+Math.cos(g)*(v.radius+ue+.2),n.position.y=v.y+Math.sin(g)*(v.radius+ue+.2),n.velocity.x=Math.cos(g)*m,n.velocity.y=Math.sin(g)*m,i.teleportUntil=s+.8,i.items[v.id].inside=!0,a.teleported=!0,a.tones.push("portal"),a}}}return a}const vr=i=>structuredClone(i),hf="orbit-lab-editor-draft-v1";function bE(){return{version:1,id:"untitled-level",title:"Untitled crossing",bounds:{minX:-20,maxX:76,minY:-27,maxY:27},settings:{startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},start:{x:0,y:0,direction:0,speed:1.8},exit:{x:50,y:0,radius:1.5,gravity:5},walls:[],wallPaths:[],entities:[]}}class EE{constructor(t){this.document=vr(t),this.undoStack=[],this.redoStack=[],this.strokeStart=null,this.selected=null}transact(t){const e=vr(this.document);return t(this.document),JSON.stringify(e)===JSON.stringify(this.document)?!1:(this.undoStack.push(e),this.undoStack.length>60&&this.undoStack.shift(),this.redoStack.length=0,!0)}beginStroke(){this.strokeStart||(this.strokeStart=vr(this.document))}paint(t){this.beginStroke(),t(this.document)}endStroke(){if(!this.strokeStart)return!1;const t=JSON.stringify(this.strokeStart)!==JSON.stringify(this.document);return t&&(this.undoStack.push(this.strokeStart),this.undoStack.length>60&&this.undoStack.shift(),this.redoStack.length=0),this.strokeStart=null,t}undo(){return this.endStroke(),this.undoStack.length?(this.redoStack.push(vr(this.document)),this.document=this.undoStack.pop(),!0):!1}redo(){return this.redoStack.length?(this.undoStack.push(vr(this.document)),this.document=this.redoStack.pop(),!0):!1}nextId(t="item"){let e=1;const n=new Set([...this.document.walls,...this.document.wallPaths||[],...this.document.entities].map(s=>s.id));for(;n.has(`${t}-${e}`);)e++;return`${t}-${e}`}get selectedObject(){return this.selected==="start"||this.selected==="exit"?this.document[this.selected]:[...this.document.walls,...this.document.wallPaths||[],...this.document.entities].find(t=>t.id===this.selected)}paintWall(t){this.paint(e=>{e.walls=gh([...e.walls,t],[],new Set([...e.wallPaths||[],...e.entities].map(n=>n.id)))})}eraseWall(t){this.paint(e=>{e.walls=gh(e.walls,[t],new Set([...e.wallPaths||[],...e.entities].map(n=>n.id)))})}addOrbitRing(t){this.endStroke();const e=new Set([...this.document.walls,...this.document.wallPaths||[],...this.document.entities].map(a=>a.id)),n=[];let s=1;for(;n.length<3;){const a=`ember-${s++}`;e.has(a)||(e.add(a),n.push(a))}const r=Ap(t,n),o=Cp(r,this.document.bounds,this.document.start,this.document.exit);return o?{ok:!1,error:o}:(this.transact(a=>a.entities.push(...r)),this.selected=n[0],{ok:!0,ids:n})}get validation(){return os(this.document)}clearAll(){this.endStroke();const t=this.transact(e=>{e.walls=[],e.wallPaths=[],e.entities=[]});return this.selected=null,t}startNew(){this.endStroke();const t=bE(),e=this.transact(n=>{for(const s of Object.keys(n))delete n[s];Object.assign(n,t)});return this.selected=null,e}replace(t){this.document=vr(t),this.undoStack=[],this.redoStack=[],this.strokeStart=null,this.selected=null}}const xc=i=>structuredClone(i),yc={ember:"#ff873c",soundGate:"#80e8e2",impulse:"#7be4f0",stillness:"#ffd58e",eclipse:"#756b9c",lightPickup:"#ffe3a3",dimmer:"#bfa5ff",portal:"#79e1d6"},Fa=i=>i.replace(/([A-Z])/g," $1").replace(/^./,t=>t.toUpperCase()),uf={start:["x","y","direction","speed"],exit:["x","y","radius","gravity"],wall:["x","y","width","height"],wallPath:["thickness"],ember:["x","y","radius","gravity","lethal","motion"],soundGate:["x","y","radius","slot"],impulse:["x","y","radius","direction","speed"],stillness:["x","y","radius","captureTime"],eclipse:["x","y","radius","captureTime","fadeTime"],lightPickup:["x","y","radius","amount","reusable","cooldown"],dimmer:["x","y","radius","amount","reusable","cooldown"],portal:["x","y","radius","pairId","exitDirection"]};function TE(i,t,e,n){const s={id:n.nextId(i),type:i,x:t,y:e,radius:.9};if(i==="ember")return{...s,radius:1.6,gravity:22,lethal:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0,orbitDirection:"counterclockwise"};if(i==="soundGate")return{...s,slot:[0,1,2].find(r=>!n.document.entities.some(o=>o.type==="soundGate"&&o.slot===r))??0};if(i==="impulse")return{...s,direction:0,speed:12};if(i==="stillness")return{...s,captureTime:1};if(i==="eclipse")return{...s,captureTime:2,fadeTime:2};if(i==="lightPickup"||i==="dimmer")return{...s,radius:.65,amount:.3,reusable:!1,cooldown:4};if(i==="portal"){const r=n.document.entities.find(o=>o.type==="portal"&&n.document.entities.filter(a=>a.type==="portal"&&a.pairId===o.pairId).length===1);return{...s,pairId:(r==null?void 0:r.pairId)||n.nextId("pair"),exitDirection:0}}return s}function AE({mount:i,defaultDocument:t,onHome:e,onPlay:n}){let s=null;try{const D=localStorage.getItem(hf);D&&D.length<262144&&(s=JSON.parse(D))}catch{}const r=D=>D&&typeof D=="object"&&!Array.isArray(D),o=r(s)&&s.version===1&&Array.isArray(s.walls)&&Array.isArray(s.entities)&&(s.wallPaths===void 0||Array.isArray(s.wallPaths)&&s.wallPaths.every(D=>r(D)&&Array.isArray(D.points)))&&s.walls.every(r)&&s.entities.every(r)&&r(s.bounds)&&r(s.settings)&&r(s.start)&&r(s.exit),a=new EE(o?s:t),l=document.createElement("div");l.className="editor-overlay hidden",l.innerHTML='<header class="editor-header"><div><span class="eyebrow">ORBIT LAB / LEVEL EDITOR</span><h1>Draw a world.</h1></div><div class="editor-header-actions"><span id="editorSaveState" role="status">Saved locally</span><button type="button" data-action="home">Home</button><button type="button" data-action="save">Save draft</button><button type="button" data-action="import">Import JSON</button><button type="button" data-action="export">Export JSON</button><button type="button" data-action="play" class="editor-play">Playtest ↗</button></div></header><div class="editor-main"><div class="editor-stage"><div class="editor-tools" role="toolbar" aria-label="Level tools"><button data-tool="select" aria-pressed="true">Select</button><button data-tool="wall">Wall</button><button data-tool="line">Line</button><button data-tool="erase">Erase</button><button data-tool="start">Start</button><button data-tool="exit">Exit</button><select id="editorEntityTool" aria-label="Place element"><option value="">Add element…</option></select><label>Brush <select id="editorBrush"><option>1</option><option>2</option><option>3</option></select></label><button data-action="finishLine" class="editor-line-action hidden">Finish line</button><button data-action="cancelLine" class="editor-line-action hidden">Cancel line</button><button data-tool="pan">Pan</button><button data-action="undo" title="Undo">↶</button><button data-action="redo" title="Redo">↷</button><button data-action="fit">Fit</button><button data-action="zoomout" aria-label="Zoom out">−</button><button data-action="zoomin" aria-label="Zoom in">+</button><button data-action="drawer" class="editor-drawer-toggle">Properties</button></div><canvas id="editorCanvas" aria-label="Level editing canvas"></canvas><div class="editor-canvas-note">Tap to place · drag to move or paint · wheel or ± to zoom</div></div><aside class="editor-inspector"><div class="editor-inspector-head"><h2>Properties</h2><button data-action="closeDrawer" class="editor-drawer-toggle" aria-label="Close properties">×</button></div><div id="editorValidation" role="status"></div><div class="editor-inspector-tabs" role="tablist" aria-label="Editor properties"><button type="button" role="tab" data-inspector-tab="level" aria-selected="true">Level</button><button type="button" role="tab" data-inspector-tab="selected" aria-selected="false">Selected</button></div><div id="editorFields" role="tabpanel"></div></aside></div><input id="editorFile" type="file" accept="application/json,.json" hidden>',i.append(l);const c=D=>l.querySelector(D),u=c("#editorCanvas"),h=u.getContext("2d"),d=c("#editorFile"),f=c("#editorFields");for(const D of Rp){const F=document.createElement("option");F.value=D,F.textContent=Fa(D),c("#editorEntityTool").append(F)}{const D=document.createElement("option");D.value="orbitRing",D.textContent="Orbit ring · 3 embers",c("#editorEntityTool").append(D)}let p="select",v=12,g={x:0,y:0},m=null,x=1,M=!1,_=!1,C="level",T=null,P=null,U="",b=null,y={width:0,height:0};const R=()=>{try{localStorage.setItem(hf,JSON.stringify(a.document)),c("#editorSaveState").textContent="Saved locally"}catch{c("#editorSaveState").textContent="Local save unavailable"}},B=()=>{const D=a.document.bounds,F=u.getBoundingClientRect();!F.width||!F.height||(v=Math.min((F.width-48)/(D.maxX-D.minX),(F.height-48)/(D.maxY-D.minY)),g={x:F.width/2-(D.minX+D.maxX)/2*v,y:F.height/2+(D.minY+D.maxY)/2*v},_=!0,y={width:F.width,height:F.height},X())},L=()=>{if(!M)return;const D=u.getBoundingClientRect();!D.width||!D.height||(Math.abs(D.width-y.width)>1||Math.abs(D.height-y.height)>1?B():X())},H=D=>({x:D.x*v+g.x,y:-D.y*v+g.y}),G=D=>{const F=u.getBoundingClientRect();return{x:(D.clientX-F.left-g.x)/v,y:-(D.clientY-F.top-g.y)/v}},k=D=>Math.round(D/x)*x,K=D=>({x:k(D.x),y:k(D.y)});function X(){if(!M)return;const D=Math.min(devicePixelRatio||1,2),F=u.getBoundingClientRect();(u.width!==Math.round(F.width*D)||u.height!==Math.round(F.height*D))&&(u.width=Math.round(F.width*D),u.height=Math.round(F.height*D)),h.setTransform(D,0,0,D,0,0),h.clearRect(0,0,F.width,F.height),h.fillStyle="#071521",h.fillRect(0,0,F.width,F.height);const I=a.document.bounds,V=H({x:I.minX,y:0}).x,et=H({x:I.maxX,y:0}).x,Z=H({x:0,y:I.maxY}).y,it=H({x:0,y:I.minY}).y;h.save(),h.beginPath(),h.rect(V,Z,et-V,it-Z),h.clip(),h.strokeStyle="#264753",h.lineWidth=1;const xt=v<10?5:v<20?2:1;for(let tt=Math.ceil(I.minX/xt)*xt;tt<=I.maxX;tt+=xt){const A=H({x:tt,y:0});h.beginPath(),h.moveTo(A.x,Z),h.lineTo(A.x,it),h.stroke()}for(let tt=Math.ceil(I.minY/xt)*xt;tt<=I.maxY;tt+=xt){const A=H({x:0,y:tt});h.beginPath(),h.moveTo(V,A.y),h.lineTo(et,A.y),h.stroke()}for(const tt of a.document.walls){const A=H(tt);h.fillStyle=tt.id===a.selected?"#2e6772":"#02080d",h.fillRect(A.x-tt.width*v/2,A.y-tt.height*v/2,tt.width*v,tt.height*v)}for(const tt of a.document.wallPaths||[])if(!(tt.points.length<2)&&(h.beginPath(),tt.points.forEach((A,S)=>{const O=H(A);S?h.lineTo(O.x,O.y):h.moveTo(O.x,O.y)}),h.strokeStyle=tt.id===a.selected?"#2e6772":"#02080d",h.lineWidth=tt.thickness*v,h.lineCap="square",h.lineJoin="bevel",h.stroke(),tt.id===a.selected))for(const A of tt.points){const S=H(A);h.beginPath(),h.arc(S.x,S.y,5,0,Math.PI*2),h.fillStyle="#a9fff0",h.fill()}if(T!=null&&T.length){if(h.beginPath(),T.forEach((tt,A)=>{const S=H(tt);A?h.lineTo(S.x,S.y):h.moveTo(S.x,S.y)}),P){const tt=H(P);h.lineTo(tt.x,tt.y)}h.strokeStyle="#8ee9dc",h.lineWidth=Math.max(2,Number(c("#editorBrush").value)*v),h.lineCap="square",h.lineJoin="bevel",h.globalAlpha=.65,h.stroke(),h.globalAlpha=1}if(p==="entity:orbitRing"&&b){const tt=Ap(b,["ghost-a","ghost-b","ghost-c"]),A=Cp(tt,a.document.bounds,a.document.start,a.document.exit),S=H(b);h.beginPath(),h.arc(S.x,S.y,3.5*v,0,Math.PI*2),h.setLineDash([5,5]),h.strokeStyle=A?"#ff7474":"#ffc083",h.lineWidth=1.5,h.stroke(),h.setLineDash([]);for(const O of tt){const $=H(ps(O));h.beginPath(),h.arc($.x,$.y,Math.max(3,O.radius*v),0,Math.PI*2),h.fillStyle=A?"#ec6666aa":"#ff9a57aa",h.fill()}}for(const tt of a.document.entities){const A=tt.type==="ember"&&tt.motion==="orbit",S=A?ps(tt,0):tt,O=H(S),$=Math.max(4,(Number.isFinite(tt.radius)?Math.max(0,tt.radius):.35)*v),at=tt.id===a.selected;if(A){const j=H(tt);h.beginPath(),h.arc(j.x,j.y,Math.max(0,Number.isFinite(tt.orbitRadius)?tt.orbitRadius:0)*v,0,Math.PI*2),h.setLineDash([4,5]),h.strokeStyle=at?"#ffbe81":"#d48b5c77",h.lineWidth=at?1.6:1,h.stroke(),h.setLineDash([]),h.beginPath(),h.moveTo(j.x-5,j.y),h.lineTo(j.x+5,j.y),h.moveTo(j.x,j.y-5),h.lineTo(j.x,j.y+5),h.strokeStyle=at?"#ffc995":"#aa6c4a",h.stroke();const wt=(tt.phase||0)*Math.PI/180,ut=tt.orbitDirection==="clockwise"?-1:1,At=H({x:S.x-Math.sin(wt)*ut*.8,y:S.y+Math.cos(wt)*ut*.8});h.beginPath(),h.moveTo(O.x,O.y),h.lineTo(At.x,At.y),h.strokeStyle="#ffb574",h.lineWidth=1.5,h.stroke()}if(tt.type==="eclipse")h.beginPath(),h.arc(O.x,O.y,$,0,Math.PI*2),h.strokeStyle=at?"#b9a1e1":"#756b9c",h.lineWidth=at?3:1.5,h.stroke(),h.beginPath(),h.arc(O.x,O.y,$*.83,0,Math.PI*2),h.strokeStyle="#655780",h.lineWidth=1,h.stroke(),h.beginPath(),h.arc(O.x,O.y,$*.72,0,Math.PI*2),h.fillStyle="#020309",h.fill();else if(tt.type==="dimmer"){h.beginPath(),h.arc(O.x,O.y,$,0,Math.PI*2),h.strokeStyle=at?"#bd98db":"#8f72a65c",h.lineWidth=at?2:1,h.setLineDash([3,4]),h.stroke(),h.setLineDash([]),h.beginPath();for(let j=0;j<=24;j++){const wt=j/24*Math.PI*2,ut=1+.07*Math.sin(wt*7),At=.38*v*ut;j?h.lineTo(O.x+Math.cos(wt)*At,O.y+Math.sin(wt)*At):h.moveTo(O.x+Math.cos(wt)*At,O.y+Math.sin(wt)*At)}h.strokeStyle="#9a71bd",h.stroke(),h.beginPath(),h.arc(O.x,O.y,Math.max(3,.22*v),0,Math.PI*2),h.fillStyle="#5a3a79",h.fill();for(let j=0;j<5;j++){const wt=j*2.39996,ut=.5*v;h.beginPath(),h.arc(O.x+Math.cos(wt)*ut,O.y+Math.sin(wt)*ut,1.4,0,Math.PI*2),h.fillStyle="#af83cc",h.fill()}}else h.beginPath(),h.arc(O.x,O.y,$,0,Math.PI*2),h.fillStyle=yc[tt.type]+"55",h.fill(),h.strokeStyle=yc[tt.type],h.lineWidth=at?3:1.5,h.stroke();h.fillStyle=yc[tt.type],h.font="11px sans-serif",h.fillText(tt.type==="soundGate"?`♪${tt.slot+1}`:tt.type==="portal"?`⇄${tt.pairId}`:Fa(tt.type),O.x+$+4,O.y+3)}for(const[tt,A,S]of[["start","#eafff5","●"],["exit","#aa9aff","◎"]]){const O=a.document[tt];if(!O)continue;const $=H(O);h.fillStyle=A,h.font="bold 24px sans-serif",h.fillText(S,$.x-9,$.y+8),a.selected===tt&&(h.strokeStyle=A,h.strokeRect($.x-15,$.y-15,30,30))}h.restore(),h.strokeStyle="#719ba5",h.lineWidth=2,h.strokeRect(V,Z,et-V,it-Z)}function rt(D){const F=aE(a.document.entities,D,a.selected);if(F)return m&&(m.orbitPart=F.part),F.id;for(const I of["start","exit"])if(a.document[I]&&Math.hypot(a.document[I].x-D.x,a.document[I].y-D.y)<1.2)return I;for(const I of[...a.document.entities].reverse())if(!(I.type==="ember"&&I.motion==="orbit")&&Math.hypot(I.x-D.x,I.y-D.y)<I.radius+.35)return I.id;for(const I of[...a.document.wallPaths||[]].reverse())for(let V=1;V<I.points.length;V++)if(ob(D,I.points[V-1],I.points[V])<I.thickness/2+.5)return I.id;for(const I of[...a.document.walls].reverse())if(Math.abs(I.x-D.x)<I.width/2+.25&&Math.abs(I.y-D.y)<I.height/2+.25)return I.id;return null}function gt(D,F=!1){const I=K(D),V=a.document.bounds;if(I.x<V.minX+.5||I.x>V.maxX-.5||I.y<V.minY+.5||I.y>V.maxY-.5)return;const et=Number(c("#editorBrush").value),Z={id:a.nextId("wall"),x:I.x,y:I.y,width:et,height:et};if(F){a.eraseWall(Z);return}a.paintWall(Z)}function ct(D=!0){a.selected&&!a.selectedObject&&(a.selected=null);const F=os(a.document),I=c("#editorValidation");let V="";try{V=` · ${Yh(a.document.walls,a.document.wallPaths||[]).length}/300 wall pieces`}catch{}I.textContent=(U?`${U} · `:"")+(F.ok?"Level ready to playtest.":`${F.errors.length} issue${F.errors.length===1?"":"s"}: ${F.errors.slice(0,4).join(" · ")}`)+V,I.classList.toggle("invalid",!F.ok),c('[data-action="play"]').disabled=!F.ok,c('[data-action="export"]').disabled=!F.ok,c('[data-action="undo"]').disabled=!a.undoStack.length,c('[data-action="redo"]').disabled=!a.redoStack.length,D&&$t(),X(),R()}function ht(D){a.endStroke(),C=D;for(const F of l.querySelectorAll("[data-inspector-tab]"))F.setAttribute("aria-selected",String(F.dataset.inspectorTab===D));$t(),ct(!1)}function kt(D,F,I,V=""){const et=F==null?void 0:F[I],Z=document.createElement("label");Z.textContent=I==="orbitDirection"?"Direction":I==="phase"&&V==="Starting "?"Starting angle":`${V}${Fa(I)}`;let it;if(typeof et=="boolean")it=document.createElement("input"),it.type="checkbox",it.checked=et;else if(I==="motion"||I==="orbitDirection"){it=document.createElement("select");for(const tt of I==="motion"?["fixed","chaser","orbit"]:["counterclockwise","clockwise"]){const A=document.createElement("option");A.value=tt,A.textContent=Fa(tt),it.append(A)}it.value=et||"counterclockwise"}else it=document.createElement("input"),it.type=typeof et=="number"?"number":"text",it.type==="number"&&(it.step="any",it.inputMode="decimal"),it.value=et===null?"":et;const xt=()=>{const tt=it.type==="checkbox"?it.checked:it.type==="number"?it.value===""?NaN:Number(it.value):I==="maxTotalWells"&&it.value===""?null:it.value,A=O=>I==="title"?O:V==="Settings / "?O.settings:V==="Bounds / "?O.bounds:a.selected==="start"||a.selected==="exit"?O[a.selected]:[...O.walls,...O.wallPaths||[],...O.entities].find($=>$.id===a.selected),S=A(a.document);!S||Object.is(S[I],tt)||(a.paint(O=>{const $=A(O);I==="motion"&&tt==="orbit"?Object.assign($,oE($)):I==="orbitRadius"&&$.type==="ember"&&$.motion==="orbit"?Object.assign($,rE($,tt)):$[I]=tt}),U="",I==="motion"?(a.endStroke(),ct()):ct(!1))};it.addEventListener("input",xt),it.addEventListener("change",xt),it.addEventListener("blur",()=>{xt(),a.endStroke(),ct(!1)}),Z.append(it),D.append(Z)}function ne(D){const F=document.createElement("label");F.textContent="Seconds per revolution";const I=document.createElement("input");I.type="number",I.step="any",I.inputMode="decimal";const V=Tp(D);I.value=Number.isFinite(V)?String(Number(V.toFixed(3))):"",I.placeholder="Stopped";const et=()=>{const Z=I.value===""?NaN:Number(I.value),it=pl(a.selectedObject.orbitRadius,Z);Object.is(a.selectedObject.speed,it)||(a.paint(xt=>{xt.entities.find(tt=>tt.id===a.selected).speed=it}),ct(!1))};if(I.addEventListener("input",et),I.addEventListener("change",et),I.addEventListener("blur",()=>{et(),a.endStroke(),ct(!1)}),F.append(I),f.append(F),!Number.isFinite(V)){const Z=document.createElement("p");Z.className="editor-tab-help",Z.textContent="Stopped orbit (speed 0). Enter a positive period to start moving.",f.append(Z)}}function $t(){f.replaceChildren();const D=V=>{const et=document.createElement("h3");et.textContent=V,f.append(et)};if(C==="level"){const V=document.createElement("p");V.className="editor-tab-help",V.textContent="Set the room and its rules here. Select an element on the canvas to edit its properties.",f.append(V),D("Level"),kt(f,a.document,"title"),D("Bounds");for(const Z of["minX","maxX","minY","maxY"])kt(f,a.document.bounds,Z,"Bounds / ");D("World rules");for(const Z of Object.keys(a.document.settings))kt(f,a.document.settings,Z,"Settings / ");const et=document.createElement("div");et.className="editor-level-actions";for(const[Z,it]of[["clearAll","Clear all elements"],["startNew","Start new level"]]){const xt=document.createElement("button");xt.type="button",xt.dataset.action=Z,xt.textContent=it,et.append(xt)}f.append(et);return}D(a.selected?`Selected: ${a.selected}`:"Select an element");const F=a.selectedObject;if(!F){const V=document.createElement("p");V.className="editor-tab-help",V.textContent="Tap a wall, the start, the exit, or any element to edit it. Place a new element from the toolbar.",f.append(V);return}const I=a.selected==="start"||a.selected==="exit"?a.selected:a.document.walls.includes(F)?"wall":(a.document.wallPaths||[]).includes(F)?"wallPath":F.type;if(I==="ember"){for(const V of uf.ember)kt(f,F,V,(V==="x"||V==="y")&&F.motion==="orbit"?"Center ":V==="radius"?"Body ":"");F.motion==="orbit"?(kt(f,F,"orbitRadius"),ne(F),kt(f,F,"orbitDirection",""),kt(f,F,"phase","Starting ")):F.motion==="chaser"&&kt(f,F,"speed","Movement ")}else for(const V of uf[I]||[])kt(f,F,V);if(I==="wallPath"&&F.points.forEach((V,et)=>{const Z=document.createElement("div");Z.className="editor-path-point";const it=document.createElement("span");it.textContent=`Point ${et+1}`,Z.append(it);for(const tt of["x","y"]){const A=document.createElement("label");A.textContent=tt.toUpperCase();const S=document.createElement("input");S.type="number",S.step="any",S.value=V[tt],S.addEventListener("input",()=>{var at,j,wt;const O=S.value===""?NaN:Number(S.value),$=(wt=(j=(at=a.selectedObject)==null?void 0:at.points)==null?void 0:j[et])==null?void 0:wt[tt];Object.is($,O)||(a.paint(ut=>{ut.wallPaths.find(At=>At.id===a.selected).points[et][tt]=O}),ct(!1))}),S.addEventListener("blur",()=>{a.endStroke(),ct(!1)}),A.append(S),Z.append(A)}const xt=document.createElement("button");xt.type="button",xt.textContent="−",xt.title=`Remove point ${et+1}`,xt.setAttribute("aria-label",`Remove point ${et+1}`),xt.disabled=F.points.length<=2,xt.addEventListener("click",()=>{a.endStroke(),a.transact(tt=>tt.wallPaths.find(A=>A.id===a.selected).points.splice(et,1)),ct()}),Z.append(xt),f.append(Z)}),I!=="start"&&I!=="exit"){const V=document.createElement("button");V.textContent="Delete selected",V.type="button",V.addEventListener("click",()=>{a.endStroke(),a.transact(et=>{et.walls=et.walls.filter(Z=>Z.id!==a.selected),et.wallPaths=(et.wallPaths||[]).filter(Z=>Z.id!==a.selected),et.entities=et.entities.filter(Z=>Z.id!==a.selected)}),a.selected=null,ct()}),f.append(V)}}function st(){for(const D of l.querySelectorAll(".editor-line-action"))D.classList.toggle("hidden",!(T!=null&&T.length))}function ot(){T=null,P=null,st(),X()}function Ct(){if(!T||T.length<2){ot();return}const D=T,F=a.nextId("path"),I=Number(c("#editorBrush").value);a.endStroke(),a.transact(V=>{V.wallPaths||(V.wallPaths=[]),V.wallPaths.push({id:F,thickness:I,points:D})}),a.selected=F,ot(),ht("selected")}l.addEventListener("click",D=>{const F=D.target.closest("button[data-action],button[data-tool],button[data-inspector-tab]");if(!F)return;if(F.dataset.inspectorTab){ht(F.dataset.inspectorTab);return}const I=F.dataset.action;if(F.dataset.tool){p==="line"&&F.dataset.tool!=="line"&&ot(),p=F.dataset.tool,b=null,U="",c("#editorEntityTool").value="";for(const V of l.querySelectorAll("[data-tool]"))V.setAttribute("aria-pressed",String(V===F));X();return}if(I==="home"&&(fe(),e()),I==="save"&&R(),I==="import"&&d.click(),I==="export"){const V=os(a.document);if(!V.ok)return;const et=new Blob([JSON.stringify(V.document,null,2)+`
`],{type:"application/json"}),Z=URL.createObjectURL(et),it=document.createElement("a");it.href=Z,it.download=`${V.document.id}.json`,document.body.append(it),it.click(),it.remove(),setTimeout(()=>URL.revokeObjectURL(Z),1e4)}if(I==="play"){const V=os(a.document);V.ok&&(fe(),n(xc(V.document)))}I==="undo"&&(a.undo(),ct()),I==="redo"&&(a.redo(),ct()),I==="clearAll"&&(ot(),a.clearAll(),ht("level"),ct()),I==="startNew"&&(ot(),a.startNew(),ht("level"),B(),ct()),I==="finishLine"&&Ct(),I==="cancelLine"&&ot(),I==="fit"&&B(),I==="zoomin"&&(v=Math.min(100,v*1.25),X()),I==="zoomout"&&(v=Math.max(2,v/1.25),X()),I==="drawer"&&l.classList.add("inspector-open"),I==="closeDrawer"&&l.classList.remove("inspector-open")}),c("#editorEntityTool").addEventListener("change",D=>{ot(),p=D.target.value?`entity:${D.target.value}`:"select",b=null,U="";for(const F of l.querySelectorAll("[data-tool]"))F.setAttribute("aria-pressed","false");X()}),d.addEventListener("change",async()=>{var I;const D=(I=d.files)==null?void 0:I[0];if(d.value="",!D)return;const F=cE(await D.text());if(!F.ok){c("#editorValidation").textContent=`Import rejected: ${F.errors.join(" · ")}`,c("#editorValidation").classList.add("invalid");return}ot(),a.replace(F.document),ht("level"),B(),ct()}),u.addEventListener("pointerdown",D=>{if(D.button!==0)return;u.setPointerCapture(D.pointerId);const F=G(D);if(m={id:D.pointerId,last:{x:D.clientX,y:D.clientY},world:F,lastWorld:F,moved:!1,vertex:null},p==="wall"||p==="erase")gt(F,p==="erase");else if(p==="select"){a.selected=rt(F);const I=(a.document.wallPaths||[]).find(V=>V.id===a.selected);I&&(m.vertex=I.points.findIndex(V=>Math.hypot(V.x-F.x,V.y-F.y)<Math.max(.55,8/v)))}X()}),u.addEventListener("pointermove",D=>{if(!m||m.id!==D.pointerId)return;const F=G(D),I=D.clientX-m.last.x,V=D.clientY-m.last.y;if(Math.abs(I)+Math.abs(V)>1&&(m.moved=!0),p==="pan")g.x+=I,g.y+=V;else if(p==="wall"||p==="erase"){const et=Math.hypot(F.x-m.lastWorld.x,F.y-m.lastWorld.y),Z=Math.ceil(et/.45);for(let it=1;it<=Z;it++)gt({x:m.lastWorld.x+(F.x-m.lastWorld.x)*it/Z,y:m.lastWorld.y+(F.y-m.lastWorld.y)*it/Z},p==="erase")}else if(p==="line")P=K(F);else if(p==="select"&&a.selected&&m.moved){const et=a.selected,Z=K(F);if((a.document.wallPaths||[]).find(xt=>xt.id===et))if(m.vertex>=0)a.paint(xt=>{xt.wallPaths.find(tt=>tt.id===et).points[m.vertex]=Z});else{const xt=K(m.lastWorld),tt={x:Z.x-xt.x,y:Z.y-xt.y};(tt.x||tt.y)&&a.paint(A=>{for(const S of A.wallPaths.find(O=>O.id===et).points)S.x+=tt.x,S.y+=tt.y})}else if(m.orbitPart==="body"){const xt=K(m.lastWorld),tt={x:Z.x-xt.x,y:Z.y-xt.y};(tt.x||tt.y)&&a.paint(A=>{const S=A.entities.find(O=>O.id===et);S.x+=tt.x,S.y+=tt.y})}else a.paint(xt=>{const tt=et==="start"||et==="exit"?xt[et]:[...xt.walls,...xt.entities].find(A=>A.id===et);tt&&(tt.x=Z.x,tt.y=Z.y)})}m.last={x:D.clientX,y:D.clientY},m.lastWorld=F,X()});const Ot=D=>{if(!m||m.id!==D.pointerId)return;const F=G(D);if(!m.moved){if(p==="line"){const I=K(F),V=a.document.bounds;I.x>=V.minX&&I.x<=V.maxX&&I.y>=V.minY&&I.y<=V.maxY&&(!(T!=null&&T.length)||Math.hypot(I.x-T.at(-1).x,I.y-T.at(-1).y)>1e-5)&&(T||(T=[]),T.push(I),st())}else if(p==="start"||p==="exit"){const I=K(F);a.transact(V=>Object.assign(V[p],I)),a.selected=p}else if(p==="entity:orbitRing"){const I=a.addOrbitRing(K(F));U=I.ok?"":I.error}else if(p.startsWith("entity:")){const I=TE(p.slice(7),k(F.x),k(F.y),a);a.transact(V=>V.entities.push(I)),a.selected=I.id,U=""}}a.endStroke(),m=null,a.selected&&(p==="select"||p==="start"||p==="exit"||p.startsWith("entity:"))?ht("selected"):ct()};u.addEventListener("pointerup",Ot),u.addEventListener("pointercancel",Ot),u.addEventListener("pointermove",D=>{p==="line"&&!m&&(T!=null&&T.length)?(P=K(G(D)),X()):p==="entity:orbitRing"&&!m&&(b=K(G(D)),X())}),u.addEventListener("dblclick",()=>{p==="line"&&Ct()}),u.addEventListener("wheel",D=>{D.preventDefault();const F=u.getBoundingClientRect(),I=G({clientX:D.clientX,clientY:D.clientY});v=Math.max(2,Math.min(100,v*(D.deltaY<0?1.1:.9))),g.x=D.clientX-F.left-I.x*v,g.y=D.clientY-F.top+I.y*v,X()},{passive:!1}),l.addEventListener("keydown",D=>{if(!(D.target instanceof HTMLInputElement||D.target instanceof HTMLSelectElement)){if(p==="line"&&D.key==="Enter"){D.preventDefault(),Ct();return}if(p==="line"&&D.key==="Escape"){D.preventDefault(),ot();return}(D.ctrlKey||D.metaKey)&&D.key.toLowerCase()==="z"?(D.preventDefault(),D.shiftKey?a.redo():a.undo(),ct()):(D.key==="Delete"||D.key==="Backspace")&&a.selected&&!["start","exit"].includes(a.selected)&&(D.preventDefault(),a.transact(F=>{F.walls=F.walls.filter(I=>I.id!==a.selected),F.wallPaths=(F.wallPaths||[]).filter(I=>I.id!==a.selected),F.entities=F.entities.filter(I=>I.id!==a.selected)}),a.selected=null,ct())}}),new ResizeObserver(L).observe(u);function Kt(){M=!0,l.classList.remove("hidden"),ct(),requestAnimationFrame(_?L:B)}function fe(){ot(),M=!1,l.classList.add("hidden"),l.classList.remove("inspector-open")}function N(D){const F=os(D);return F.ok?(ot(),a.endStroke(),a.transact(I=>{for(const V of Object.keys(I))delete I[V];Object.assign(I,xc(F.document))}),a.selected=null,ht("level"),_=!1,M&&B(),!0):!1}return{show:Kt,hide:fe,loadDocument:N,get open(){return M},get document(){return xc(a.document)},model:a}}const Up=1,CE=1e6,RE=Object.freeze({minX:-48,maxX:48,minY:-27,maxY:27}),PE=64;function Vo(i){return Array.from(String(i??"").normalize("NFC").trim().replace(/[\x00-\x1f\x7f]/g,"")).slice(0,PE).join("")}function vl(i){const t=Number(i);return Number.isSafeInteger(t)&&t>=1&&t<=CE?t:1}function Fp(){var t,e;const i=new Uint32Array(2);return(e=(t=globalThis.crypto)==null?void 0:t.getRandomValues)==null||e.call(t,i),`${i[0].toString(36)}-${i[1].toString(36)}`}function xh(i){let t=2166136261;for(const e of String(i)){const n=e.codePointAt(0);t=Math.imul(t^n,16777619)>>>0}return t>>>0}function LE(i,t){return xh(`orbit-lab/infinite/${Up}/${Vo(i)}/${vl(t)}/recharge`)}function IE(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const yh=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y),_h=(i,t,e)=>Math.max(t,Math.min(e,i)),Op=(i,t,e,n)=>t*Math.sin((i+40)/78*Math.PI*1.55+e)-t*Math.sin(e)+n*(i+38)/76,Oa=(i,t,e,n)=>({x:i,y:Op(i,t,e,n)}),df=(i,t,e,n,s)=>Math.abs(i.y-Op(_h(i.x,-42,42),t,e,n))<s,Mh=(i,t)=>Math.hypot(Math.max(0,Math.abs(i.x-t.x)-t.width/2),Math.max(0,Math.abs(i.y-t.y)-t.height/2));function DE(i){const{bounds:t,start:e,exit:n,walls:s,entities:r}=i,o=1.5,a=Math.floor((t.maxX-t.minX)/o)+1,l=Math.floor((t.maxY-t.minY)/o)+1,c=(g,m)=>m*a+g,u=g=>({x:_h(Math.round((g.x-t.minX)/o),0,a-1),y:_h(Math.round((g.y-t.minY)/o),0,l-1)}),h=new Uint8Array(a*l);for(let g=0;g<l;g++)for(let m=0;m<a;m++){const x={x:t.minX+m*o,y:t.minY+g*o};(s.some(M=>Mh(x,M)<.8)||r.some(M=>M.type==="ember"&&M.lethal&&yh(x,M)<M.radius+1))&&(h[c(m,g)]=1)}const d=u(e),f=u(n),p=[d],v=new Uint8Array(a*l);v[c(d.x,d.y)]=1;for(let g=0;g<p.length;g++){const m=p[g];if(Math.abs(m.x-f.x)<=1&&Math.abs(m.y-f.y)<=1)return!0;for(const[x,M]of[[1,0],[-1,0],[0,1],[0,-1]]){const _=m.x+x,C=m.y+M;_<0||C<0||_>=a||C>=l||v[c(_,C)]||h[c(_,C)]||(v[c(_,C)]=1,p.push({x:_,y:C}))}}return!1}function ff(i,t,e,n=!1){const s=IE(xh(`orbit-lab/infinite/${Up}/${i}/${t}/${e}`)),r=Math.min(1,(t-1)/9),o=n?0:1.2+s()*(2+1.8*r),a=s()*1.6-.8,l=n?0:(s()-.5)*4,c=Oa(-38,o,a,l),u=Oa(38,o,a,l),h={startLight:.65,burnRate:.016+r*.006,graceSeconds:8,wellStrength:66,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!1},d={version:1,id:`infinite-${xh(i).toString(36)}-${t}`,title:`Infinite crossing ${t}`,bounds:{...RE},settings:h,start:{...c,direction:0,speed:2.4},exit:{...u,radius:1.4,gravity:3},walls:[],entities:[]},f=p=>d.entities.push(p);for(const[p,v]of[-22,0,22].map((g,m)=>[m,g])){const g=Oa(v,o,a,l);f({id:`gate-${p}`,type:"soundGate",x:g.x,y:g.y+(p===1?1.1:-.8),radius:1.2,slot:p})}for(const[p,v]of[-26,-2,25].map((g,m)=>[m,g])){const g=Oa(v,o,a,l);f({id:`recharge-${p}`,type:"lightPickup",x:g.x,y:g.y+(p%2?-2.2:2.2),radius:.7,amount:.32,reusable:!1,cooldown:0})}if(!n){const p=5+Math.floor(r*5),v=3+Math.floor(r*5),g=[c,u,...d.entities];for(let m=0,x=0;m<p&&x<100;x++){const M={id:`wall-${m}`,x:-33+s()*67,y:-20+s()*40,width:1.3+s()*2.7,height:1+s()*2.4};df(M,o,a,l,6+M.height/2)||g.some(_=>Mh(_,M)<4)||d.walls.some(_=>Math.hypot(_.x-M.x,_.y-M.y)<4)||(d.walls.push(M),m++)}for(let m=0,x=0;m<v&&x<100;x++){const M={id:`ember-${m}`,type:"ember",x:-31+s()*66,y:-20+s()*40,radius:.7+s()*(.8+r*.5),gravity:8+s()*7,lethal:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0};df(M,o,a,l,5+M.radius)||g.some(_=>yh(_,M)<5)||d.walls.some(_=>Mh(M,_)<M.radius+2)||d.entities.some(_=>_.type==="ember"&&yh(_,M)<4)||(f(M),m++)}}return d}function NE(i,t=1){const e=Vo(i),n=vl(t);if(!e)throw new Error("A seed is required");for(let r=0;r<8;r++){const o=ff(e,n,r),a=os(o);if(a.ok&&DE(a.document))return a.document}const s=ff(e,n,0,!0);return ml(s).document}const qi=new URLSearchParams(location.search);let Vn=["1","2"].includes(qi.get("campaign"))&&!qi.has("demo"),Hs=Vn?Number(qi.get("campaign")):1,en=!qi.has("demo")&&!Vn&&!!Vo(qi.get("infinite")),Hi=en?Vo(qi.get("infinite")):"",Vi=en?vl(qi.get("stage")):1;function Bp(i,t){const e=ml(NE(i,t));return{id:"infinite",title:`Infinite Play · Stage ${t}`,color:"#a2efe7",objective:`Seed ${i} · Stage ${t} · Follow the gates and carry your light to the portal.`,mechanic:"campaign",heroGravity:0,moons:[],level:e.level,document:e.document,entities:e.entities,settings:e.settings,soundGates:e.entities.filter(n=>n.type==="soundGate").map(n=>({id:n.slot,x:n.x,y:n.y,radius:n.radius}))}}let yt=en?Bp(Hi,Vi):Vn?nu(Hs):wp(qi.get("demo")),Zt=structuredClone(yt.level),Qn=yt.heroGravity,sl=!1;const Me=new Mb;let ru=0;const zp=document.querySelector("#app");zp.innerHTML=`
  <div class="scene" id="scene"><canvas id="minimap" width="360" height="203" role="img" aria-label="Map showing walls, the portal, wells, the glowing dot, and the current view"></canvas></div>
  <header class="chrome"><div class="brand"><span class="brand-orbit" aria-hidden="true">◎</span> ORBIT LAB</div><div class="actions"><button id="pause" class="quiet-button" type="button" aria-label="Pause" title="Pause (P)" disabled>Ⅱ</button><button id="galleryButton" class="quiet-button" type="button" aria-label="Demo gallery" title="Demo gallery">⊞</button><button id="restart" class="quiet-button" type="button" aria-label="Restart" title="Restart (R)">↺</button><button id="settingsButton" class="quiet-button" type="button" aria-label="Settings" aria-haspopup="dialog" aria-controls="settings" title="Settings">⚙</button></div></header>
  <div class="play-control"><button id="primaryAction" class="primary-button" type="button" title="Primary action (Space)">Start</button></div>
  <div class="scene-caption" id="sceneCaption">PLACE A WELL · THEN START</div>
  <div class="death-flash" id="deathFlash"></div>
  <dialog id="settings" class="settings"><div class="settings-head"><div><span class="eyebrow">ORBIT LAB</span><h1>Settings</h1></div><button id="closeSettings" class="quiet-button" type="button" aria-label="Close settings">×</button></div>
    <p class="settings-intro">Place temporary wells to bend the glowing particle toward the portal. Two wells can exist at once.</p>
    <div class="game-modes"><button id="homeFromSettings" type="button">Home</button><button id="browseDemos" type="button">Browse studies</button></div><p id="activeDemoLabel" class="microcopy"></p>
    <div class="control-group"><div class="control-heading"><label for="strength">Gravity strength</label><output id="strengthValue">70</output></div><input id="strength" type="range" min="35" max="180" step="1" value="70"></div>
    <div class="control-group"><div class="control-heading"><label for="heroGravity">Dot gravity</label><output id="heroGravityValue">0</output></div><input id="heroGravity" type="range" min="0" max="30" step="1" value="0"><p id="heroGravityHelp" class="microcopy">Attracts loose moons, with a small reaction on the dot.</p></div>
    <label class="toggle-row">Sound<input id="soundEnabled" type="checkbox" checked></label>
    <div class="control-group"><div class="control-heading"><label for="lifetime">Well lifetime</label><output id="lifetimeValue">8.0s</output></div><input id="lifetime" type="range" min="2" max="16" step="0.5" value="8"><p class="microcopy">New wells use this lifetime.</p></div>
    <div class="control-group"><div class="control-heading">How wells end</div><div class="segmented" role="group" aria-label="How wells end"><button class="selected" data-mode="fade">Fade out</button><button data-mode="snap">Snap off</button></div><p class="microcopy" id="modeHelp">Pull weakens over the last 20% of a well’s life.</p></div>
    <label class="toggle-row"><span>Show predicted path</span><input id="showForecast" type="checkbox"></label><p id="forecastHelp" class="microcopy"></p>
    <div class="settings-stats"><div>State <strong id="stateLabel">READY</strong></div><div>Attempts <strong id="attempts">1</strong></div><div>Time <strong id="runTime">0.0s</strong></div><div>Speed <strong id="speed">0.00 u/s</strong></div></div>
    <div class="active-heading"><span>Active wells</span><small id="wellCount">0 / 2</small></div><div class="well-list" id="wellList"></div><button id="release" class="release-button" type="button">Release all wells</button>
    <p class="settings-help">Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R restarts · E removes oldest / releases capture · 1 / 2 remove a specific well.</p>
  </dialog>
  <div class="demo-note" id="demoNote"><strong id="demoTitle"></strong><span id="demoObjective"></span><div id="resourceHud" class="resource-hud hidden"><div class="resource-top"><span>LIGHT</span><span id="resourceValue">60%</span><span id="gateStatus">GATE OPEN</span></div><div class="resource-track"><i id="resourceFill"></i><b></b><b></b></div></div><div id="campaignGateHud" class="campaign-gate-hud hidden" aria-live="polite"><span id="campaignGateCount">0/3 gates</span><span id="campaignGateIcons"></span></div></div>
  <dialog id="gallery" class="gallery"><div class="gallery-heading"><div><span class="eyebrow">ORBIT LAB / MECHANICS GALLERY</span><h1>World studies.</h1><p>One new rule at a time. Experiments in gravity, light, and sound.</p></div><div class="gallery-actions"><button id="homeFromGallery" class="quiet-button" aria-label="Home" title="Home">⌂</button><button id="closeGallery" class="quiet-button" aria-label="Close gallery"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div><nav id="demoCategories" class="demo-categories" aria-label="Study categories"></nav><div class="demo-grid" id="demoGrid"></div><p class="gallery-footer">Every study starts paused. Place a well, then Start. Wells now begin at strength 70; settings let you compare.</p></dialog>
  <div id="home" class="home-overlay hidden"><div class="home-card"><span class="eyebrow">ORBIT LAB</span><h1>A little light in a large world.</h1><p>Draw a path with temporary gravity. Keep your light alive until you reach the portal.</p><button id="startCampaign" class="primary-button" type="button">Campaign ↗</button><button id="startInfinite" class="home-secondary" type="button">Infinite Play</button><button id="studyHome" class="home-secondary" type="button">Studies</button><button id="openEditor" class="home-secondary" type="button">Level editor</button></div></div>
  <div id="infiniteSelect" class="home-overlay hidden"><div class="home-card infinite-select-card"><span class="eyebrow">INFINITE PLAY</span><h1>Every seed makes a world.</h1><p>Cross a new chamber each stage. The same seed and stage always return to the same level.</p><label for="infiniteSeed">World seed</label><input id="infiniteSeed" type="text" maxlength="128" autocomplete="off" spellcheck="false"><div class="infinite-select-actions"><button id="beginInfinite" class="primary-button" type="button">Start crossing ↗</button><button id="infiniteBack" class="home-secondary" type="button">Back home</button></div></div></div>
  <div id="levelSelect" class="home-overlay hidden"><div class="home-card level-select-card"><span class="eyebrow">CAMPAIGN / LEVELS</span><h1>Choose a crossing.</h1><div class="level-cards"><button class="level-card" data-campaign-level="1" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C40 39 65 32 103 32 S130 30 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/><circle cx="65" cy="33" r="6" fill="none" stroke="#7de6df"/></svg><span>01 / LIGHT & DISTANCE</span><strong>The long crossing</strong><small>A clear chamber. Keep the fire alive to reach the far portal.</small><em data-complete="1"></em><span data-gate-best="1"></span></button><button class="level-card" data-campaign-level="2" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C39 39 50 58 80 58 S117 32 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="85" cy="28" r="16" fill="#ff8a32"/><circle cx="85" cy="28" r="24" fill="none" stroke="#ff8a32" opacity=".4"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/></svg><span>02 / GRAVITY & DANGER</span><strong>The heavy neighbor</strong><small>A giant ember bends your path. Keep outside its fire.</small><em data-complete="2"></em><span data-gate-best="2"></span></button></div><button id="levelsBack" class="home-secondary" type="button">Back home</button></div></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><div class="result-actions"><button id="driftRestart" class="primary-button" type="button">Retry</button><button id="driftHome" class="home-secondary" type="button">Home</button></div></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card trail-result"><span class="eyebrow" id="resultEyebrow">COURSE COMPLETE</span><h2 id="resultTitle">Your orbit.</h2><canvas id="winArtwork" width="1280" height="720" role="img" aria-label="The complete glowing trail drawn during your run"></canvas><p id="winStats"></p><p id="winGateStats" class="gate-result hidden"></p><p id="infiniteResult" class="infinite-result hidden"></p><div class="result-actions"><button id="winRestart" class="primary-button">Fly again ↗</button><button id="winEditor" class="home-secondary hidden" type="button">Back to editor</button><button id="editInfinite" class="home-secondary hidden" type="button">Edit this level</button><button id="copyInfinite" class="home-secondary hidden" type="button">Copy link</button><button id="winHome" class="home-secondary" type="button">Home</button></div></div></div>
`;const nt=i=>document.querySelector(i),Ur=nt("#scene"),ou=nt("#wellList"),sn=nt("#strength"),pn=nt("#lifetime"),gn=nt("#settings"),au=nt("#sceneCaption"),bo=nt("#showForecast"),ao=nt("#pause"),xl=nt("#driftOverlay"),yl=nt("#winOverlay"),pi=new Ae,Fe=new wM({antialias:!0,alpha:!0,powerPreference:"high-performance"});Fe.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Fe.setSize(Ur.clientWidth,Ur.clientHeight);Fe.outputColorSpace=_n;Fe.toneMapping=_f;Fe.toneMappingExposure=1.6;Fe.shadowMap.enabled=!0;Fe.shadowMap.type=xf;Ur.appendChild(Fe.domElement);const Wa=nt("#minimap"),UE=Wa.getContext("2d"),ze=new qg,Ye=new _b(ze,Me),kp=new gb(ze),te=new tp(-12,12,8,-8,.1,100);te.position.set(0,0,30);te.lookAt(0,0,0);const FE=6744562,OE=10195199,BE=15268607;new ln({color:2505557,transparent:!0,opacity:.1});function Gp(i,t,e=!1){const n=e?[...i,i[0]]:i,s=new xe().setFromPoints(n.map(r=>new z(r.x,r.y,r.z||0)));return new zr(s,t)}function ti(i,t,e=96){const n=Array.from({length:e},(s,r)=>({x:Math.cos(r/e*Math.PI*2)*i,y:Math.sin(r/e*Math.PI*2)*i,z:0}));return Gp(n,t,!0)}const zE=new Ae;ze.add(zE);ze.add(pi);const Hp=new Ae;ze.add(Hp);let _c=387;const Ba=()=>(_c=_c*16807%2147483647,_c/2147483647),kE=new Xi(.022,6);for(let i=0;i<210;i++){const t=new de(kE,new Be({color:i%7===0?7899322:5077138,transparent:!0,opacity:.2+Ba()*.4}));t.position.set((Ba()-.5)*95,(Ba()-.5)*75,-3),t.scale.setScalar(.6+Ba()*1.4),Hp.add(t)}ze.add(new z0(11193053,1.2));const Eo=new de(new fs(200,200),new N0({color:2900816,roughness:1,metalness:0}));Eo.position.z=-.9;Eo.receiveShadow=!0;ze.add(Eo);const _i=new hl(6744562,85,50,1.5);_i.castShadow=!0;_i.shadow.mapSize.set(window.innerWidth<=700?512:1024,window.innerWidth<=700?512:1024);_i.shadow.camera.near=.1;_i.shadow.camera.far=50;_i.shadow.bias=-3e-4;_i.shadow.normalBias=.015;ze.add(_i);const Wo=new Ae,Xa=new de(new qs(.25,32,24),new Be({color:14680056}));Wo.add(Xa);function GE(){const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(189,255,247,.95)"),e.addColorStop(.13,"rgba(109,250,231,.72)"),e.addColorStop(.35,"rgba(58,215,225,.24)"),e.addColorStop(1,"rgba(58,215,225,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new ll(i)}const lu=GE(),To=document.createElement("canvas");To.width=To.height=128;const cu=To.getContext("2d"),Xo=cu.createRadialGradient(64,64,0,64,64,64);Xo.addColorStop(0,"rgba(225,255,249,1)");Xo.addColorStop(.16,"rgba(102,233,242,.95)");Xo.addColorStop(.38,"rgba(64,204,217,.4)");Xo.addColorStop(1,"rgba(64,204,217,0)");cu.fillStyle=Xo;cu.fillRect(0,0,128,128);const Ao=new vs(new $i({map:new ll(To),transparent:!0,depthWrite:!1,blending:mn}));Ao.scale.set(2.4,2.4,1);Ao.position.z=.1;Wo.add(Ao);Wo.position.z=2;ze.add(Wo);const Co=128,Sh=Array.from({length:Co},()=>({x:0,y:0,vx:0,vy:0,life:0,duration:1})),Vp=new Float32Array(Co*3),hu=new Float32Array(Co),Fr=new xe;Fr.setAttribute("position",new Pe(Vp,3).setUsage(vi));Fr.setAttribute("heat",new Pe(hu,1).setUsage(vi));const _l=new Gn({transparent:!0,depthWrite:!1,blending:mn,uniforms:{pixelRatio:{value:Fe.getPixelRatio()}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(.25,.8,.85),vec3(.9,1.,.96),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat);}"}),Wp=new Bo(Fr,_l);Wp.frustumCulled=!1;ze.add(Wp);let HE=0,qa=0;function VE(){for(const i of Sh)i.life=0;hu.fill(0),Fr.attributes.heat.needsUpdate=!0,qa=0}function WE(i){for(qa+=i*36;qa>=1;){qa--;const t=Sh[HE++%Co],e=Math.random()*Math.PI*2,n=.6+Math.random()*1.5;t.x=Mt.position.x,t.y=Mt.position.y,t.vx=-Mt.velocity.x*.14+Math.cos(e)*n,t.vy=-Mt.velocity.y*.14+Math.sin(e)*n,t.duration=t.life=.5+Math.random()*1.4}for(let t=0;t<Co;t++){const e=Sh[t];e.life=Math.max(0,e.life-i),e.x+=e.vx*i,e.y+=e.vy*i,e.vx*=Math.exp(-i*1.3),e.vy*=Math.exp(-i*1.3),Vp.set([e.x,e.y,2.2],t*3),hu[t]=e.life/e.duration}Fr.attributes.position.needsUpdate=!0,Fr.attributes.heat.needsUpdate=!0}const Je=document.createElement("canvas");Je.width=1536;Je.height=1064;const ci=Je.getContext("2d"),qo=new ll(Je);qo.colorSpace=_n;const Ml=new de(new fs(26,18),new Be({map:qo,transparent:!0,depthWrite:!1,blending:mn}));Ml.position.z=.62;ze.add(Ml);let zi=13,ki=9;function Xp(i,t){const e=Math.max(zi,i),n=Math.max(ki,t);if(e===zi&&n===ki)return;const s=document.createElement("canvas");s.width=Je.width,s.height=Je.height,s.getContext("2d").drawImage(Je,0,0),ci.clearRect(0,0,Je.width,Je.height);const r=Je.width*zi/e,o=Je.height*ki/n;ci.drawImage(s,(Je.width-r)/2,(Je.height-o)/2,r,o),zi=e,ki=n,Ml.scale.set(e/13,n/9,1),qo.needsUpdate=!0}const Jn=640,uu=Array.from({length:Jn},()=>({x:0,y:0,time:0}));let Fi=0,dn=0;const qp=new Float32Array(Jn*18),Yp=new Float32Array(Jn*6),$p=new Float32Array(Jn*6),mi=new xe;mi.setAttribute("position",new Pe(qp,3).setUsage(vi));mi.setAttribute("side",new Pe(Yp,1));mi.setAttribute("intensity",new Pe($p,1).setUsage(vi));for(let i=0;i<Jn;i++)Yp.set([-1,1,-1,1,1,-1],i*6);mi.setDrawRange(0,0);const du=new de(mi,new Gn({transparent:!0,depthWrite:!1,blending:mn,side:Cn,vertexShader:"attribute float side; attribute float intensity; varying float vSide; varying float vIntensity; void main(){vSide=side;vIntensity=intensity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying float vSide; varying float vIntensity; void main(){float glow=exp(-7.*vSide*vSide);float core=exp(-150.*vSide*vSide);gl_FragColor=vec4(mix(vec3(.25,.8,.85),vec3(.9,1.,.96),core),vIntensity*(glow*.48+core*.7));}"}));du.frustumCulled=!1;du.position.z=.72;ze.add(du);function XE(){ci.clearRect(0,0,Je.width,Je.height),zi=13,ki=9,Ml.scale.set(1,1,1),qo.needsUpdate=!0,Fi=0,dn=0,mi.setDrawRange(0,0)}function fu(i,t){const e=Je.width/(zi*2),n=Je.height/(ki*2);ci.beginPath(),ci.moveTo((i.x+zi)*e,(ki-i.y)*n),ci.lineTo((t.x+zi)*e,(ki-t.y)*n),ci.strokeStyle="rgba(80,226,222,.095)",ci.lineWidth=2,ci.lineCap="round",ci.stroke(),qo.needsUpdate=!0}const qE=new cl({color:9632511,transparent:!0,opacity:.25,dashSize:.11,gapSize:.14}),us=new zr(new xe,qE);us.position.z=.15;ze.add(us);us.visible=!1;const Yo=ti(4,new cl({color:7376041,transparent:!0,opacity:.17,dashSize:.055,gapSize:.12}));Yo.computeLineDistances();Yo.position.set(0,0,-.1);ze.add(Yo);const kn=new Ww({gravity:new w(0,0,0),allowSleep:!1}),pu=new Gr("blob"),wh=new Gr("wall");kn.addContactMaterial(new Go(pu,wh,{friction:0,restitution:.1}));const Mt=new Rt({mass:1,shape:new gp(ue),material:pu,linearDamping:0,angularDamping:0,fixedRotation:!0});kn.addBody(Mt);const Ro=[],Tr=[],bh=[];function YE(i){for(const t of i.channel?xp(i.channel):[]){const e=new Ir(t.map(r=>new mt(r.x,r.y))),n=new el(e,{depth:4,bevelEnabled:!1,steps:1});n.translate(0,0,-1);const s=new de(n,new Be({color:0}));s.castShadow=!0,Tr.push(s),pi.add(s)}for(const t of i.guides||[]){const e=new Rt({mass:0,material:wh,shape:Kw(t)});kn.addBody(e),Ro.push(e);const n=new Ir(t.map(o=>new mt(o.x,o.y))),s=new el(n,{depth:4,bevelEnabled:!1,steps:1});s.translate(0,0,-1);const r=new de(s,new Be({color:0}));r.castShadow=!0,Tr.push(r),pi.add(r)}for(const t of i.walls){const e=new Rt({mass:0,material:wh,shape:new dl(new w(t.w/2,t.h/2,.7))});e.position.set(t.x,t.y,0),t.angle&&e.quaternion.setFromAxisAngle(new w(0,0,1),t.angle),kn.addBody(e),e.isGate=!!t.gate,Ro.push(e);const n=new de(new Qh(t.w,t.h,4,4,.18),new Be({color:0}));n.position.set(t.x,t.y,1),n.rotation.z=t.angle||0,n.castShadow=!0,n.userData.gate=!!t.gate,Tr.push(n),pi.add(n)}}const mu=[],gu=new ll(To),rl=document.createElement("canvas");rl.width=rl.height=128;const vu=rl.getContext("2d"),Sl=vu.createRadialGradient(64,64,0,64,64,64);Sl.addColorStop(0,"rgba(255,170,85,1)");Sl.addColorStop(.2,"rgba(255,143,40,.65)");Sl.addColorStop(1,"rgba(255,70,10,0)");vu.fillStyle=Sl;vu.fillRect(0,0,128,128);gu.image=rl;gu.needsUpdate=!0;function $E(i){for(const t of i.spikes){const e=new Ae;e.position.set(t.x,t.y,1.2),pi.add(e),bh.push(e);const n=new de(new qs(.22,20,12),new Be({color:16742948}));e.add(n);const s=new vs(new $i({map:gu,transparent:!0,opacity:.7,depthWrite:!1,blending:mn}));s.scale.set(1.35,1.35,1),e.add(s);const r=new hl(16747058,4,4,2);r.position.z=-.1,r.castShadow=!0,r.shadow.mapSize.set(256,256),r.shadow.camera.near=.1,r.shadow.camera.far=4,r.shadow.bias=-3e-4,e.add(r);const o=new Float32Array(54),a=new Float32Array(18),l=new xe;l.setAttribute("position",new Pe(o,3).setUsage(vi)),l.setAttribute("heat",new Pe(a,1).setUsage(vi));const c=_l.clone();c.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(1.,.2,.02),vec3(1.,.72,.2),vHeat),pow(1.-r,2.)*vHeat*.65);}";const u=new Bo(l,c);u.frustumCulled=!1,e.add(u),mu.push({positions:o,heat:a,geometry:l,material:c})}}function jE(){for(const i of mu){i.material.uniforms.pixelRatio.value=Fe.getPixelRatio();for(let t=0;t<18;t++){const e=(Jt*.75+t/18)%1,n=t*2.39996,s=.15+e*(.3+t%4*.08);i.positions.set([Math.cos(n)*s,Math.sin(n)*s,.2],t*3),i.heat[t]=(1-e)**2}i.geometry.attributes.position.needsUpdate=!0,i.geometry.attributes.heat.needsUpdate=!0}}const Mi=new Ae;Mi.position.set(Zt.goal.x,Zt.goal.y,1);pi.add(Mi);const xu=new vs(new $i({map:lu,transparent:!0,opacity:.45,depthWrite:!1,blending:mn,color:9554175}));xu.scale.set(4.5,4.5,1);Mi.add(xu);const ZE=new de(new Xi(.64,64),new Be({color:532025,transparent:!0,opacity:.88,side:Cn}));Mi.add(ZE);for(let i=0;i<3;i++){const t=ti(.65+i*.16,new ln({color:i===0?11665392:7909375,transparent:!0,opacity:.78-i*.18}));t.position.z=.2+i*.02,Mi.add(t)}const Ys=new hl(10906623,8,6,2);Ys.position.z=.1;Ys.castShadow=!0;Ys.shadow.mapSize.set(256,256);Ys.shadow.camera.near=.1;Ys.shadow.camera.far=6;Ys.shadow.bias=-3e-4;Mi.add(Ys);const jp=new Float32Array(96),Zp=new Float32Array(32),Po=new xe;Po.setAttribute("position",new Pe(jp,3).setUsage(vi));Po.setAttribute("heat",new Pe(Zp,1).setUsage(vi));const yu=_l.clone();yu.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(.4,.12,1.),vec3(.85,.6,1.),vHeat),pow(1.-r,2.)*vHeat);}";const Kp=new Bo(Po,yu);Kp.frustumCulled=!1;Mi.add(Kp);function KE(){yu.uniforms.pixelRatio.value=Fe.getPixelRatio();for(let i=0;i<32;i++){const t=(Jt*.5+i/32)%1,e=i*2.39996+t*.9,n=.8+t*.8;jp.set([Math.cos(e)*n,Math.sin(e)*n,.4],i*3),Zp[i]=Math.sin(t*Math.PI)}Po.attributes.position.needsUpdate=!0,Po.attributes.heat.needsUpdate=!0}let Jt=0,_r=0,Lo=performance.now(),re=[],JE=1,Wi="fade",Qe=!0,Re="ready",ei=!1,He=!1,Mc=0,as=null,Jp=0,fn=yt.sandbox?"sandbox":"maze",ms=0,Xe=!1,Bs=null,$e=null,le=null,Ln=!1,me,We=null,Ce=null,Vs=0,Sn=!1,An=null;const se=()=>Vn||en,Qp="orbit-lab-campaign-complete-v1";let Eh=(()=>{try{return new Set(JSON.parse(localStorage.getItem(Qp)||"[]").filter(i=>[1,2].includes(i)))}catch{return new Set}})();function QE(i){Eh.add(i);try{localStorage.setItem(Qp,JSON.stringify([...Eh]))}catch{}}let xr=(()=>{try{return xE(JSON.parse(localStorage.getItem(Dp)||"{}"))}catch{return{}}})();function t1(i,t){const e=yE(xr[i],t);if(e!==xr[i]){xr={...xr,[i]:e};try{localStorage.setItem(Dp,JSON.stringify(xr))}catch{}}}function _u(i,t){const e=["Cyan bass","Violet offbeat","Gold chime"],n=document.createElement("span");n.className="gate-pattern-icons",n.setAttribute("role","img"),n.setAttribute("aria-label",e.map((s,r)=>`${s} ${t&1<<r?"acquired":"not acquired"}`).join(", ")),e.forEach((s,r)=>{const o=document.createElement("i");o.style.setProperty("--gate-color",iu[r]),o.classList.toggle("acquired",!!(t&1<<r)),n.append(o)}),i.append(" ",n)}function ji(i,t="home"){Sn=i,nt("#home").classList.toggle("hidden",!i||t!=="home"),nt("#levelSelect").classList.toggle("hidden",!i||t!=="levels"),nt("#infiniteSelect").classList.toggle("hidden",!i||t!=="infinite");for(const e of[".chrome",".scene",".play-control"])nt(e).inert=i;i&&nt(t==="levels"?'[data-campaign-level="1"]':t==="infinite"?"#infiniteSeed":"#startCampaign").focus()}const tm=new Ae;ze.add(tm);const Ns=new Map,em=new Ae;ze.add(em);const Ya=[],nm=new Ae;ze.add(nm);const $a=new Map;let Ui=null;function e1(){for(const i of $a.values())hi(i);$a.clear();for(const i of yt.entities||[]){if(i.type==="soundGate")continue;let t;if(i.type==="eclipse")t=op(i.radius);else if(i.type==="dimmer")t=ap(.22);else if(i.type==="ember"||i.type==="lightPickup"||i.type==="portal"){const e=i.type==="ember"?16747058:i.type==="lightPickup"?16768923:i.type==="portal"?7793123:12559871;t=Vh(i.type==="ember"||i.type==="portal"?i.radius:.22,e,i.type==="portal")}else{const e=i.type==="portal"?7987670:i.type==="impulse"?7793123:i.type==="eclipse"?6774148:16767371;t=new Ae,t.add(ti(i.radius,new ln({color:e,transparent:!0,opacity:.86}))),t.add(ti(i.radius*.72,new ln({color:e,transparent:!0,opacity:.32})))}t.position.set(i.x,i.y,1.45),nm.add(t),$a.set(i.id,t)}}function n1(){var i,t;if(Ce)for(const e of yt.entities||[]){const n=$a.get(e.id),s=Ce.items[e.id];!n||!s||(n.position.set(s.x,s.y,1.45),n.visible=!s.used,(t=(i=n.userData).animate)==null||t.call(i,Jt,Fe.getPixelRatio()),n.userData.setFade&&n.userData.setFade(s.used?0:1))}}function i1(){for(const i of Ya)hi(i);if(Ya.length=0,!!se())for(const i of yt.soundGates){const t=new Ae;t.position.set(i.x,i.y,1.5);const e=new ee(iu[i.id]),n=new vs(new $i({map:lu,color:e,transparent:!0,opacity:.32,blending:mn,depthWrite:!1}));n.scale.set(3.5,3.5,1);const s=ti(i.radius,new ln({color:e,transparent:!0,opacity:.88})),r=ti(i.radius*.72,new ln({color:e,transparent:!0,opacity:.37}));t.add(n,s,r),em.add(t),Ya.push(t)}}function s1(){for(const i of yt.soundGates||[]){const t=Ya[i.id];if(!t)continue;const e=!!((We==null?void 0:We.mask)&1<<i.id),n=1+(e?.08:.035)*Math.sin(Jt*Math.PI*8);t.scale.setScalar(n),t.children[0].material.opacity=e?.13:.32,t.children[1].material.opacity=e?.32:.88,t.children[2].material.opacity=e?.17:.37}}function im(i,t,e,n,s){const r=JE++,o=r%2?FE:OE,a=new Ae;a.position.set(i,t,Zt.channel?4:1);const l=new de(new Xi(.2,48),new Be({color:o,transparent:!0,opacity:.32})),c=new de(new Xi(.082,32),new Be({color:BE})),u=ti(.29,new ln({color:o,transparent:!0,opacity:.85})),h=ti(.6,new ln({color:o,transparent:!0,opacity:.45})),d=ti(1.2,new cl({color:o,transparent:!0,opacity:.21,dashSize:.07,gapSize:.11}));d.computeLineDistances();const f=new zr(new xe,new ln({color:o,transparent:!0,opacity:.9}));return a.add(l,c,u,h,d,f),ze.add(a),{id:r,x:i,y:t,strength:e,lifetime:n,createdAt:s,group:a,disc:l,inner:u,outer:h,field:d,timer:f,color:o}}function ol(i){ze.remove(i.group),i.group.traverse(t=>{var e,n;(e=t.geometry)==null||e.dispose(),(n=t.material)==null||n.dispose()})}function Io(){nt("#wellCount").textContent=`${re.length} / ${se()?yt.settings.maxActiveWells:2}`,ou.innerHTML=re.length?re.map(i=>`
    <div class="well-item" style="--well-color:${i.id%2?"#66e9f2":"#9b90ff"}">
      <span class="well-glyph">✳</span><span class="well-name">WELL ${String(i.id).padStart(2,"0")}</span>
      <span class="well-timer" data-well-time="${i.id}">${So(i,Jt).toFixed(1)}s</span>
      <button data-remove="${i.id}" aria-label="Remove well ${i.id}" title="Remove well">×</button>
    </div>`).join(""):'<p class="empty-wells">No wells active. Place one in the arena.</p>'}function Ws(i){const t=re.findIndex(e=>e.id===i);t!==-1&&(ol(re[t]),re.splice(t,1),Io(),Yi())}function r1(i,t){if(He||Xe||gn.open||vn.open||Sn||me!=null&&me.open||se()&&!dE(Vs,yt.settings.maxTotalWells)||fn==="maze"&&!(se()?Lp({x:i,y:t},Zt):jh({x:i,y:t},Zt)))return;const e=im(i,t,Number(sn.value),Number(pn.value),Jt);se()&&Vs++,Me.placement(),ru=Jt;const n=se()?yt.settings.maxActiveWells:2,s=re.length>=n?re[0]:null;re=sb(re,e,n),s&&ol(s),Io(),Yi(),s&&!re.includes(s)&&ol(s),Io(),Yi(),Re==="ready"&&(au.textContent="TAP START TO RELEASE")}function sm(){re.forEach(ol),re=[],Io(),Yi()}function Zi(){if(Me.reset(),ru=0,Bs&&(clearTimeout(Bs),Bs=null),sm(),c1(),Vs=0,Jt=0,_r=0,XE(),VE(),He=!1,Xe=!1,Qe=!0,Re="ready",xl.classList.add("hidden"),yl.classList.add("hidden"),nt("#deathFlash").classList.remove("visible"),au.textContent=fn==="maze"?"PLACE A WELL · THEN START":"TAP START TO RELEASE",Mt.force.setZero(),Mt.angularVelocity.setZero(),fn==="maze")Mt.position.set(Zt.spawn.x,Zt.spawn.y,0),Mt.velocity.set(Zt.spawn.vx,Zt.spawn.vy,0),ms+=1,nt("#attempts").textContent=ms,se()&&(An={minX:Mt.position.x,maxX:Mt.position.x,minY:Mt.position.y,maxY:Mt.position.y});else{Mt.position.set(4,0,0);const i=Number(sn.value);Mt.velocity.set(0,Math.sqrt(i*4*4/Math.pow(16+.75*.75,1.5)),0),re=[im(0,0,i,Number(pn.value),0)]}xs(),bu(0,!0),nt("#runTime").textContent="0.0s",Io(),Yi(),Or(),Lo=performance.now()}function Mr(i="darkness"){if(!(He||Xe)){if(Me.death(),Me.stopHeartbeat(),He=!0,Qe=!0,Re="dead",nt("#deathFlash").classList.add("visible"),Or(),se()){rm(!1,i);return}Bs=setTimeout(Zi,420)}}function rm(i,t="darkness"){Vn&&i&&!Ln&&t1(Hs,(We==null?void 0:We.mask)||0);const e=dn?uu[(Fi+dn-1)%Jn]:Zt.spawn;fu(e,Mt.position);const n=se()?{minX:Math.min(An.minX,Zt.spawn.x,Mt.position.x)-6,maxX:Math.max(An.maxX,Zt.spawn.x,Mt.position.x)+6,minY:Math.min(An.minY,Zt.spawn.y,Mt.position.y)-6,maxY:Math.max(An.maxY,Zt.spawn.y,Mt.position.y)+6}:Zt.bounds;Sb(nt("#winArtwork"),Je,zi,ki,n,Zt.spawn,Mt.position),nt("#resultEyebrow").textContent=i?"COURSE COMPLETE":"SIGNAL LOST",nt("#resultTitle").textContent=se()?i?"Light carried home.":t==="manual"?"Journey ended.":t==="hazard"?"Taken by the ember.":"The light went out.":"Your orbit.",nt("#winStats").textContent=`${Jt.toFixed(1)} seconds  ·  ${ms} attempt${ms===1?"":"s"}${se()?`  ·  ${Vs} well${Vs===1?"":"s"} placed`:""}`,nt("#winGateStats").classList.toggle("hidden",!se()),se()&&(nt("#winGateStats").textContent=`${i?"Gates":"Collected (not scored)"} ${wo(We.mask)}/3 · ${Np(We.mask)}`,_u(nt("#winGateStats"),We.mask)),nt("#infiniteResult").classList.toggle("hidden",!en),nt("#editInfinite").classList.toggle("hidden",!en),nt("#copyInfinite").classList.toggle("hidden",!en),en&&(nt("#infiniteResult").textContent=`Seed ${Hi} · Stage ${Vi}`),nt("#winRestart").textContent=se()?i&&!Ln?"Continue ↗":"Retry":"Fly again ↗",nt("#winEditor").classList.toggle("hidden",!Ln),yl.classList.remove("hidden")}function o1(){Xe||(Me.portal(),Me.stopHeartbeat(),Xe=!0,Qe=!0,Re="won",Vn&&!Ln&&QE(Hs),rm(!0),Or())}function Th(i){Vn=!1,en=!1,Ln=!1,ji(!1),yt=wp(i),fn=yt.sandbox?"sandbox":"maze",Qn=yt.heroGravity,sn.min=35,sn.max=180,pn.min=2,pn.max=16,sn.value=lf,nt("#strengthValue").textContent=lf,nt("#heroGravity").value=Qn,nt("#heroGravityValue").textContent=Qn,ms=0,ei=!1;const t=new URL(location.href);t.searchParams.delete("campaign"),t.searchParams.delete("infinite"),t.searchParams.delete("stage"),t.searchParams.set("demo",yt.id),history.replaceState(null,"",t),xs(),Zi()}function Mu(i=1){Vn=!0,en=!1,Ln=!1,ji(!1),yt=nu(i),Hs=yt.id,fn="maze",Qn=0,sn.min=Math.min(35,yt.settings.wellStrength),sn.max=Math.max(180,yt.settings.wellStrength),pn.min=Math.min(2,yt.settings.wellLifetime),pn.max=Math.max(16,yt.settings.wellLifetime),sn.value=yt.settings.wellStrength,nt("#strengthValue").textContent=yt.settings.wellStrength,pn.value=yt.settings.wellLifetime,nt("#lifetimeValue").textContent=`${yt.settings.wellLifetime.toFixed(1)}s`,ms=0,ei=!1,Si=!1;const t=new URL(location.href);t.searchParams.delete("demo"),t.searchParams.delete("infinite"),t.searchParams.delete("stage"),t.searchParams.set("campaign",String(Hs)),history.replaceState(null,"",t),xs(),Zi()}function wl(i,t=1){Hi=Vo(i)||Fp(),Vi=vl(t),en=!0,Vn=!1,Ln=!1,ji(!1),yt=Bp(Hi,Vi),fn="maze",Qn=0,sn.min=Math.min(35,yt.settings.wellStrength),sn.max=Math.max(180,yt.settings.wellStrength),pn.min=Math.min(2,yt.settings.wellLifetime),pn.max=Math.max(16,yt.settings.wellLifetime),sn.value=yt.settings.wellStrength,nt("#strengthValue").textContent=yt.settings.wellStrength,pn.value=yt.settings.wellLifetime,nt("#lifetimeValue").textContent=`${yt.settings.wellLifetime.toFixed(1)}s`,ms=0,ei=!1,Si=!1;const e=new URL(location.href);e.searchParams.delete("demo"),e.searchParams.delete("campaign"),e.searchParams.set("infinite",Hi),e.searchParams.set("stage",String(Vi)),history.replaceState(null,"",e),xs(),Zi()}function a1(i){const t=ml(structuredClone(i));Ln=!0,Vn=!0,en=!1,ji(!1);for(const n of[".chrome",".scene",".play-control"])nt(n).inert=!1;yt={id:"editor-playtest",title:t.document.title,color:"#9ee6df",objective:"Playtest your level. Return to the editor to revise it.",mechanic:"campaign",heroGravity:0,moons:[],level:t.level,document:t.document,entities:t.entities,settings:t.settings,soundGates:t.entities.filter(n=>n.type==="soundGate").map(n=>({id:n.slot,x:n.x,y:n.y,radius:n.radius}))},fn="maze",Qn=0,ms=0,ei=!1,Si=!1,sn.min=Math.min(35,t.settings.wellStrength),sn.max=Math.max(180,t.settings.wellStrength),pn.min=Math.min(2,t.settings.wellLifetime),pn.max=Math.max(16,t.settings.wellLifetime),sn.value=t.settings.wellStrength,nt("#strengthValue").textContent=t.settings.wellStrength,pn.value=t.settings.wellLifetime,nt("#lifetimeValue").textContent=`${t.settings.wellLifetime.toFixed(1)}s`;const e=new URL(location.href);e.searchParams.delete("demo"),e.searchParams.delete("campaign"),e.searchParams.delete("infinite"),e.searchParams.delete("stage"),history.replaceState(null,"",e),xs(),Zi()}const Ah=new Ae;ze.add(Ah);const Bn=[];let ai=null;function hi(i){var t;(t=i.parent)==null||t.remove(i),i.traverse(e=>{var n,s,r,o;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose(),(o=(r=e.shadow)==null?void 0:r.map)==null||o.dispose()})}function Su(i){if(sl!==i){sl=i;for(const t of Ro)t.isGate&&(i&&kn.bodies.includes(t)&&kn.removeBody(t),!i&&!kn.bodies.includes(t)&&kn.addBody(t));for(const t of Tr)t.userData.gate&&(t.visible=!i);if(Zt.walls=yt.level.walls.filter(t=>!t.gate||!i).map(t=>({...t})),Ui)for(const t of Ui.children)t.material.opacity=i?.38:.75}}function l1(){const i=(le==null?void 0:le.pickups)||($e==null?void 0:$e.pickups)||[],t=new Set(i.map(e=>e.id));for(const[e,n]of Ns)t.has(e)||(hi(n),Ns.delete(e));for(const e of i){if(!Ns.has(e.id)){const o=Vh(.22,16770216);o.position.set(e.x,e.y,1.65),tm.add(o),Ns.set(e.id,o)}const n=Ns.get(e.id),s=Math.max(0,(le?Kn.pickupLife:bp)-(Jt-e.createdAt)),r=Math.min(1,s/3);n.userData.animate(Jt,Fe.getPixelRatio()),n.userData.setFade(r),n.scale.setScalar(.96+.06*Math.sin(Jt*3+e.id))}}function om(){const i=nt("#resourceHud");i.classList.toggle("hidden",!$e&&!le),i.classList.toggle("campaign-resource",!!le),nt("#campaignGateHud").classList.toggle("hidden",!le);const t=!!le&&le.energy<=0&&!He&&!Xe;if(i.classList.toggle("last-embers",t),i.classList.toggle("meter-paused",Qe||Sn||document.hidden),!$e&&!le)return;const e=(le==null?void 0:le.energy)??$e.energy;if(nt("#resourceValue").textContent=`${Math.round(e*100)}%`,nt("#resourceFill").style.width=`${t?le.graceLeft/Kn.graceSeconds*100:e*100}%`,t&&(nt("#resourceValue").textContent=`${Math.ceil(le.graceLeft)}s`,i.style.setProperty("--warning-period",`${.55+le.graceLeft/Kn.graceSeconds*.65}s`)),nt("#gateStatus").textContent=le?e>0?`${Vs} WELL${Vs===1?"":"S"}`:"LAST EMBERS":$e.pendingClose?"GATE CLOSING":$e.gateOpen?"GATE OPEN":"GATE CLOSED",le){const n=(We==null?void 0:We.mask)||0;nt("#campaignGateCount").textContent=`${wo(n)}/3 gates`;const s=nt("#campaignGateIcons");s.dataset.mask!==String(n)&&(s.replaceChildren(),_u(s,n),s.dataset.mask=String(n))}}function c1(){Zt=structuredClone(yt.level),sl=!1,$e=yt.mechanic==="burnout"?Lb():null,le=se()?fE(en?LE(Hi,Vi):428,yt.settings):null,We=se()?gE():null,i1(),Ce=se()?ME(yt.entities||[]):null,e1();for(const t of Ns.values())hi(t);Ns.clear(),Ui&&hi(Ui),Ui=null,Ye.reset(yt),($e||le)&&(Ye.brightness=(le||$e).energy),kp.reset(yt),_i.color.setHex(Jh.has(yt.mechanic)?16777215:6744562);for(const t of Ro)kn.removeBody(t);Ro.length=0;for(const t of Tr)hi(t);Tr.length=0;for(const t of bh)hi(t);bh.length=0,mu.length=0;for(const t of Bn)kn.removeBody(t.body),hi(t.mesh),hi(t.trail);if(Bn.length=0,ai&&hi(ai),ai=null,pi.visible=!yt.sandbox,Yo.visible=!!yt.sandbox,yt.sandbox||(YE(Zt),se()||$E(Zt)),Mi.position.set(Zt.goal.x,Zt.goal.y,1),Mi.scale.setScalar(Zt.goal.radius),$e){const t=Zt.walls.find(e=>e.gate);Ui=new Ae,Ui.position.set(t.x,t.y,1.3);for(const e of[-t.h/2+.7,t.h/2-.7]){const n=Gp([{x:-.65,y:e},{x:.65,y:e}],new ln({color:16767371,transparent:!0,opacity:.38}));Ui.add(n)}pi.add(Ui),Su(!0)}om();for(const t of yt.moons){const e=new Rt({mass:.08,shape:new gp(.16),material:pu,linearDamping:0,angularDamping:0,fixedRotation:!0});e.position.set(t.x,t.y,0),e.velocity.set(t.vx,t.vy,0),kn.addBody(e);const n=new Ae,s=new de(new qs(.16,20,12),new Be({color:yt.plate?16767114:14208511})),r=new vs(new $i({map:lu,color:yt.plate?16758867:12428287,transparent:!0,opacity:.5,depthWrite:!1,blending:mn}));r.scale.set(1.2,1.2,1),n.add(s,r),Ah.add(n);const o=new Float32Array(480),a=new xe;a.setAttribute("position",new Pe(o,3).setUsage(vi)),a.setDrawRange(0,0);const l=new zr(a,new ln({color:yt.plate?15910506:12166635,transparent:!0,opacity:.28,depthWrite:!1}));l.frustumCulled=!1,Ah.add(l),Bn.push({body:e,mesh:n,trail:l,positions:o,count:0,lastSample:-1})}yt.plate&&(ai=new Ae,ai.position.set(yt.plate.x,yt.plate.y,.7),ai.add(ti(yt.plate.radius,new ln({color:16767114,transparent:!0,opacity:.9}))),ai.add(ti(yt.plate.radius*.8,new cl({color:16767114,transparent:!0,opacity:.3,dashSize:.1,gapSize:.12}))),ai.children[1].computeLineDistances(),pi.add(ai));const i=Bn.length>0||!!yt.mechanic;nt("#heroGravity").disabled=!Bn.length,nt("#heroGravity").value=Qn,nt("#heroGravityValue").textContent=Qn,nt("#heroGravityHelp").textContent=i?"Pulls loose moons; their small mass also tugs back. Set 0 to compare.":"Choose a moon study to explore the dot’s own gravity.",bo.disabled=i,us.visible=bo.checked&&!i,nt("#forecastHelp").textContent=i?"Prediction is off for interactive studies. Watch the rule unfold in motion.":"Preview stops at the next wall, ember, or portal contact.",nt("#activeDemoLabel").textContent=yt.title,nt(".settings-help").textContent=`Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R ${se()?"ends the attempt":"restarts"} · E removes oldest / releases capture · 1 / 2 remove a specific well.`,nt("#demoTitle").textContent=yt.title,nt("#demoObjective").textContent=yt.objective,nt("#demoNote").style.setProperty("--demo-color",yt.color);for(const t of document.querySelectorAll("[data-demo]"))t.setAttribute("aria-pressed",String(t.dataset.demo===yt.id))}function h1(){if(!Bn.length)return;const i=Bn.map(e=>({x:e.body.position.x,y:e.body.position.y,mass:e.body.mass})),t=Eb(Mt.position,i,Qn);Mt.applyForce(new w(t.hero.x*Mt.mass,t.hero.y*Mt.mass,0));for(let e=0;e<Bn.length;e++){const n=Bn[e].body,s=Kh(n.position,re,Jt,Wi,Zt);n.applyForce(new w((s.x+t.moons[e].x)*n.mass,(s.y+t.moons[e].y)*n.mass,0))}}function u1(){for(const i of Bn)i.body.position.z=0,i.body.velocity.z=0,Zh(i.body.velocity);if(!(sl||!Tb(yt.plate,Bn.map(i=>i.body.position)))){Su(!0);for(const i of ai.children)i.material.color.setHex(8911310);nt("#demoObjective").textContent="Gate open. Take your trail through the portal.",Me.tone(392,0,1.3,.1),Me.tone(523.25,.15,1.3,.1)}}function d1(){for(const i of Bn){const t=i.body.position;i.mesh.position.set(t.x,t.y,2),!(Jt-i.lastSample<.05||Qe)&&(i.lastSample=Jt,i.count===160&&(i.positions.copyWithin(0,3),i.count--),i.positions.set([t.x,t.y,.8],i.count++*3),i.trail.geometry.attributes.position.needsUpdate=!0,i.trail.geometry.setDrawRange(0,i.count))}}function f1(i){const t=i.level.bounds,e=170/(t.maxX-t.minX),n=100/(t.maxY-t.minY),s=p=>(p-t.minX)*e,r=p=>(t.maxY-p)*n,o=p=>p*Math.min(e,n),a=i.sandbox?"":i.level.walls.map(p=>`<rect x="${s(p.x-p.w/2)}" y="${r(p.y+p.h/2)}" width="${p.w*e}" height="${p.h*n}" rx="1" fill="#02070c"/>`).join(""),l=i.moons.map(p=>`<circle cx="${s(p.x)}" cy="${r(p.y)}" r="2" fill="${i.color}"/>`).join(""),c=i.level.spikes.map(p=>`<circle cx="${s(p.x)}" cy="${r(p.y)}" r="2" fill="#ffa75b"/>`).join(""),u=(p,v,g,m)=>`<circle cx="${s(p)}" cy="${r(v)}" r="${o(g)}" stroke="${m}" fill="none" stroke-width="1"/>`,h=(i.level.channel?xp(i.level.channel):i.level.guides||[]).map(p=>`<polygon points="${p.map(v=>`${s(v.x)},${r(v.y)}`).join(" ")}" fill="#02070c"/>`).join(""),d=Jh.has(i.mechanic)?`<path d="M85 50 L155 25 L155 75 Z" fill="${i.color}" opacity=".25"/><path d="M85 35 L85 65" stroke="${i.color}" stroke-width="2"/>`:"",f=yt&&i.mechanic?["power","dimmer","sound"].includes(i.mechanic)?[-5,0,5].map(p=>u(p,0,.65,i.color)).join(""):i.mechanic==="burnout"?u(-5,1,.65,"#ffd98b")+u(5,0,1,"#ffd98b"):i.mechanic==="portals"?u(-3,0,1,"#76e9e3")+u(6,-3,1,"#76e9e3"):i.mechanic==="clock"?u(0,0,3.5,"#ff8a32"):["giant","chaser"].includes(i.mechanic)?u(0,0,i.mechanic==="giant"?1.6:.3,"#ff8a32"):["sticky","eclipse","boost","hidden"].includes(i.mechanic)?u(-3,0,.85,i.color):"":"";return`<svg viewBox="0 0 170 100" aria-hidden="true"><rect width="170" height="100" rx="5" fill="#102b38"/>${a}${h}<path d="M25 70 C30 20 75 20 85 50 S120 80 140 30" fill="none" stroke="${i.color}" opacity=".7" stroke-width=".7"/>${l}${d}${f}${i.sandbox?'<ellipse cx="85" cy="50" rx="28" ry="25" fill="none" stroke="#9acfff" stroke-width=".6"/>':c}<circle cx="${s(i.level.spawn.x)}" cy="${r(i.level.spawn.y)}" r="2.4" fill="#dffff9"/><circle cx="${s(i.level.goal.x)}" cy="${r(i.level.goal.y)}" r="${Math.max(4,o(i.level.goal.radius))}" stroke="#bc9aff" stroke-width=".8" fill="none"/>${i.plate?u(i.plate.x,i.plate.y,i.plate.radius,"#ffd88a"):""}</svg>`}const vn=nt("#gallery");nt("#demoGrid").innerHTML=hs.map(i=>`<button type="button" class="demo-card" data-demo="${i.id}" style="--demo-color:${i.color}" aria-pressed="false">${f1(i)}<span class="demo-rule">${i.rule}</span><strong>${i.title}</strong><span>${i.description}</span><em>${i.question}</em></button>`).join("");const am=[["All",hs.map(i=>i.id)],["Gravity",["drift","satellites","slingshot","gate","orbit","release","boost","sticky","giant","chaser","clock"]],["Light",["eclipse","power","dimmer","hidden","shadow-posts","filters","lens","prism","burnout"]],["Sound",["sound"]],["Space & paths",["maze","guide","portals","wideworld"]]];nt("#demoCategories").innerHTML=am.map(([i,t],e)=>`<button type="button" data-category="${e}" aria-pressed="${e===0}">${i}<span>${t.length}</span></button>`).join("");nt("#demoCategories").addEventListener("click",i=>{const t=i.target.closest("[data-category]");if(!t)return;const e=am[Number(t.dataset.category)][1];for(const n of nt("#demoCategories").querySelectorAll("button"))n.setAttribute("aria-pressed",String(n===t));for(const n of nt("#demoGrid").querySelectorAll("[data-demo]"))n.hidden=!e.includes(n.dataset.demo)});let Si=!1,Do=!1;function wu(){Do=Sn,Sn&&ji(!1),Si=Re==="running",Si&&$s(),gn.close(),vn.showModal()}function ni(){Si=!1,ei=!1,Do=!1,me==null||me.hide(),Bs&&(clearTimeout(Bs),Bs=null),gn.open&&gn.close(),vn.open&&vn.close(),Qe=!0,Me.stopHeartbeat(),Re==="running"&&(Re="paused"),ji(!0),yl.classList.add("hidden"),xl.classList.add("hidden"),nt("#deathFlash").classList.remove("visible");const i=new URL(location.href);i.searchParams.delete("demo"),i.searchParams.delete("campaign"),i.searchParams.delete("infinite"),i.searchParams.delete("stage"),history.replaceState(null,"",i),Hr()}function bl(){Si=!1,ei=!1,gn.open&&gn.close(),vn.open&&vn.close(),Qe=!0,Me.stopHeartbeat(),Re==="running"&&(Re="paused"),ji(!1);for(const t of[".chrome",".scene",".play-control"])nt(t).inert=!0;yl.classList.add("hidden"),xl.classList.add("hidden"),nt("#deathFlash").classList.remove("visible");const i=new URL(location.href);for(const t of["demo","campaign","infinite","stage"])i.searchParams.delete(t);history.replaceState(null,"",i),me.show(),Hr()}me=AE({mount:zp,defaultDocument:nu(1).document,onHome:ni,onPlay:a1});function lm(){ni();for(const i of nt("#levelSelect").querySelectorAll("[data-complete]"))i.textContent=Eh.has(Number(i.dataset.complete))?"COMPLETE ✓":"NOT YET COMPLETE";for(const i of nt("#levelSelect").querySelectorAll("[data-gate-best]")){const t=xr[Number(i.dataset.gateBest)];i.textContent=t===void 0?"Best finish: — / 3 gates":`Best finish: ${wo(t)}/3 gates · ${Np(t)}`,_u(i,t??0)}ji(!0,"levels")}nt("#galleryButton").addEventListener("click",()=>Ln?bl():se()?ni():wu());nt("#browseDemos").addEventListener("click",()=>{ei=!1,wu()});nt("#homeFromSettings").addEventListener("click",ni);nt("#homeFromGallery").addEventListener("click",ni);nt("#startCampaign").addEventListener("click",lm);nt("#startInfinite").addEventListener("click",()=>{nt("#infiniteSeed").value=Fp(),ji(!0,"infinite")});nt("#infiniteBack").addEventListener("click",ni);nt("#beginInfinite").addEventListener("click",()=>wl(nt("#infiniteSeed").value,1));nt("#infiniteSeed").addEventListener("keydown",i=>{i.key==="Enter"&&wl(i.currentTarget.value,1)});nt("#openEditor").addEventListener("click",bl);nt("#levelsBack").addEventListener("click",ni);nt("#levelSelect").addEventListener("click",i=>{const t=i.target.closest("[data-campaign-level]");t&&Mu(Number(t.dataset.campaignLevel))});nt("#studyHome").addEventListener("click",wu);nt("#closeGallery").addEventListener("click",()=>vn.close());vn.addEventListener("close",()=>{Do?ni():Si&&Re==="paused"&&!Xe&&!He&&$s(),Si=!1,Do=!1});nt("#demoGrid").addEventListener("click",i=>{const t=i.target.closest("[data-demo]");t&&(Si=!1,Do=!1,Th(t.dataset.demo),vn.close())});nt("#heroGravity").addEventListener("input",i=>{Qn=Number(i.target.value),nt("#heroGravityValue").textContent=Qn});function pf(){return{x:Mt.position.x,y:Mt.position.y,vx:Mt.velocity.x,vy:Mt.velocity.y}}function Yi(){if(!bo.checked||yt.moons.length)return;const t=(fn==="maze"?hb(pf(),re,Jt,3,Wi,Zt):{points:ib(pf(),re,Jt,5.5,Wi,7)}).points;us.geometry.dispose(),us.geometry=new xe().setFromPoints(t.map(e=>new z(e.x,e.y,0))),us.computeLineDistances()}function p1(){const i={x:Mt.position.x,y:Mt.position.y,time:Jt},t=n=>uu[(Fi+n)%Jn],e=dn?t(dn-1):null;for((!e||Jt-e.time>=1/30)&&(e&&fu(e,i),dn===Jn&&(Fi=(Fi+1)%Jn,dn--),Object.assign(t(dn++),i));dn>1&&t(1).time<Jt-20;)Fi=(Fi+1)%Jn,dn--;for(let n=1;n<dn;n++){const s=t(n-1),r=t(n),o=Math.hypot(r.x-s.x,r.y-s.y)||1,a=-(r.y-s.y)/o*.14,l=(r.x-s.x)/o*.14,c=(n-1)*18;qp.set([s.x-a,s.y-l,0,s.x+a,s.y+l,0,r.x-a,r.y-l,0,s.x+a,s.y+l,0,r.x+a,r.y+l,0,r.x-a,r.y-l,0],c),$p.fill(Math.max(0,1-(Jt-r.time)/20)**2,(n-1)*6,n*6)}mi.attributes.position.needsUpdate=!0,mi.attributes.intensity.needsUpdate=!0,mi.setDrawRange(0,Math.max(0,dn-1)*6)}function m1(){for(const i of re){const t=So(i,Jt)/i.lifetime,e=yp(i,Jt,Wi);i.disc.material.opacity=.13+e*.24,i.inner.material.opacity=.25+e*.6,i.outer.material.opacity=.1+e*.4,i.field.material.opacity=.04+e*.19,i.outer.scale.setScalar(1+(1-t)*.13);const n=Math.max(1,Math.round(t*72)),s=Array.from({length:n+1},(o,a)=>{const l=Math.PI/2-a/72*Math.PI*2;return new z(Math.cos(l)*.76,Math.sin(l)*.76,0)});i.timer.geometry.dispose(),i.timer.geometry=new xe().setFromPoints(s);const r=ou.querySelector(`[data-well-time="${i.id}"]`);r&&(r.textContent=`${So(i,Jt).toFixed(1)}s`)}}function Or(){Hr();const i=Xe?"FINISHED":He?"LOST":Re==="ready"?"READY":Qe?"PAUSED":"IN FLIGHT";nt("#stateLabel").textContent=i,nt("#speed").textContent=`${Math.hypot(Mt.velocity.x,Mt.velocity.y).toFixed(2)} u/s`}function xs(){const i=Ur.clientWidth,t=Ur.clientHeight,e=i/t,n=se()||yt.id==="wideworld"?Ub(e):fn==="maze"?Nb(yt.level.bounds,e):{width:Math.max(21,16*e),height:Math.max(21,16*e)/e},s=n.width,r=n.height;te.left=-s/2,te.right=s/2,te.top=r/2,te.bottom=-r/2,te.updateProjectionMatrix();const o=Zt.bounds;Xp(Math.max(te.right+2,Math.abs(o.minX)+2,Math.abs(o.maxX)+2),Math.max(te.top+2,Math.abs(o.minY)+2,Math.abs(o.maxY)+2)),bu(0,!0),Fe.setSize(i,t),Fe.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),_l.uniforms.pixelRatio.value=Fe.getPixelRatio()}function bu(i,t=!1){if(Eo.position.x=0,Eo.position.y=0,!se()&&yt.id!=="wideworld"){te.position.x=0,te.position.y=0;return}const e=Fb(te.position,Mt.position,Mt.velocity,Zt.bounds,{width:te.right-te.left,height:te.top-te.bottom},i,t);te.position.x=e.x,te.position.y=e.y,se()&&Xp(Math.abs(te.position.x)+te.right+3,Math.abs(te.position.y)+te.top+3)}function g1(){if(Wa.classList.toggle("visible",se()||yt.id==="wideworld"),!se()&&yt.id!=="wideworld")return;const i=UE,t=Wa.width,e=Wa.height,n=Zt.bounds,s=t/(n.maxX-n.minX),r=e/(n.maxY-n.minY),o=f=>(f-n.minX)*s,a=f=>(n.maxY-f)*r;i.clearRect(0,0,t,e),i.fillStyle="#07151f",i.fillRect(0,0,t,e),i.strokeStyle="#476877",i.lineWidth=2,i.strokeRect(1,1,t-2,e-2),i.fillStyle="#324b56";for(const f of Zt.walls){const p=_p(f);i.beginPath(),i.moveTo(o(p[0].x),a(p[0].y));for(const v of p.slice(1))i.lineTo(o(v.x),a(v.y));i.closePath(),i.fill()}const l=(f,p,v,g)=>{i.beginPath(),i.arc(o(f),a(p),v,0,Math.PI*2),i.fillStyle=g,i.fill()};if(l(Zt.goal.x,Zt.goal.y,6,"#a994ff"),se())for(const f of yt.soundGates)l(f.x,f.y,4,(We==null?void 0:We.mask)&1<<f.id?"#6d8993":iu[f.id]);for(const f of(le==null?void 0:le.pickups)||[])l(f.x,f.y,3,"#ffd58e");if(Ce){for(const f of yt.entities)if(f.type!=="soundGate"){const p=Ce.items[f.id];if(p.used)continue;l(p.x,p.y,f.type==="ember"?Math.max(3,f.radius*Math.min(s,r)):3,f.type==="ember"?"#e36d31":f.type==="portal"?"#76e9e3":f.type==="dimmer"?"#bfa5ff":"#ffd58e")}}if(!Ce)for(const f of Zt.dangers||[])i.beginPath(),i.arc(o(f.x),a(f.y),f.radius*Math.min(s,r),0,Math.PI*2),i.fillStyle="#e36d31",i.fill();for(const f of re)l(f.x,f.y,3.5,"#79d6ef");i.strokeStyle="#d6f9f0",i.lineWidth=1.5;const c=Math.max(n.minX,te.position.x+te.left),u=Math.min(n.maxX,te.position.x+te.right),h=Math.min(n.maxY,te.position.y+te.top),d=Math.max(n.minY,te.position.y+te.bottom);i.strokeRect(o(c),a(h),Math.max(0,u-c)*s,Math.max(0,h-d)*r),l(Mt.position.x,Mt.position.y,4,"#eafff5")}function cm(i){const t=Fe.domElement.getBoundingClientRect(),e=(i.clientX-t.left)/t.width,n=(i.clientY-t.top)/t.height,s=e*2-1,r=1-n*2;return{x:te.position.x+s*te.right,y:te.position.y+r*te.top}}function v1(i){return re.find(t=>Math.hypot(t.x-i.x,t.y-i.y)<.9)}Fe.domElement.addEventListener("pointerdown",i=>{i.button!==0||as||(Jp=performance.now(),as={id:i.pointerId,clientX:i.clientX,clientY:i.clientY})});Fe.domElement.addEventListener("pointercancel",i=>{(as==null?void 0:as.id)===i.pointerId&&(as=null)});Fe.domElement.addEventListener("pointerup",i=>{const t=as;if(as=null,i.button!==0||!t||t.id!==i.pointerId||Math.hypot(i.clientX-t.clientX,i.clientY-t.clientY)>15||performance.now()-Jp>600)return;const e=cm(i);r1(e.x,e.y)});Fe.domElement.addEventListener("contextmenu",i=>{i.preventDefault();const t=v1(cm(i));t&&Ws(t.id)});ou.addEventListener("click",i=>{const t=i.target.closest("[data-remove]");t&&Ws(Number(t.dataset.remove))});sn.addEventListener("input",()=>{nt("#strengthValue").textContent=sn.value;for(const i of re)i.strength=Number(sn.value);Yi()});pn.addEventListener("input",()=>{nt("#lifetimeValue").textContent=`${Number(pn.value).toFixed(1)}s`});nt(".segmented").addEventListener("click",i=>{const t=i.target.closest("[data-mode]");if(t){Wi=t.dataset.mode;for(const e of nt(".segmented").children)e.classList.toggle("selected",e===t);nt("#modeHelp").textContent=Wi==="fade"?"Pull weakens over the last 20% of a well’s life.":"Pull stays full strength, then vanishes instantly.",Yi()}});nt("#release").addEventListener("click",sm);bo.addEventListener("change",()=>{us.visible=bo.checked,Yi()});nt("#settingsButton").addEventListener("click",()=>{ei=Re==="running",ei&&$s(),gn.showModal()});nt("#closeSettings").addEventListener("click",()=>gn.close());gn.addEventListener("close",()=>{ei&&Re==="paused"&&!He&&!Xe&&$s(),ei=!1});nt("#restart").addEventListener("click",()=>{se()?Mr("manual"):Zi()});nt("#driftRestart").addEventListener("click",Zi);nt("#driftHome").addEventListener("click",ni);nt("#winRestart").addEventListener("click",()=>{if(en&&Xe)wl(Hi,Vi+1);else if(Vn&&Xe&&!Ln){const i=uE(Hs);i?Mu(i.id):lm()}else Zi()});nt("#winEditor").addEventListener("click",bl);nt("#editInfinite").addEventListener("click",()=>{en&&me.loadDocument(yt.document)&&bl()});nt("#copyInfinite").addEventListener("click",async()=>{if(!en)return;const i=new URL(location.href);i.searchParams.delete("demo"),i.searchParams.delete("campaign"),i.searchParams.set("infinite",Hi),i.searchParams.set("stage",String(Vi));try{await navigator.clipboard.writeText(i.href),nt("#copyInfinite").textContent="Copied ✓"}catch{nt("#infiniteResult").textContent=i.href,nt("#infiniteResult").tabIndex=0,nt("#infiniteResult").focus(),nt("#copyInfinite").textContent="Select link above"}});nt("#winHome").addEventListener("click",ni);ao.addEventListener("click",()=>{Re!=="ready"&&$s()});nt("#soundEnabled").addEventListener("change",i=>Me.setEnabled(i.target.checked));document.addEventListener("pointerdown",()=>Me.unlock(),{capture:!0});document.addEventListener("keydown",()=>Me.unlock(),{capture:!0});document.addEventListener("visibilitychange",()=>{var i;document.hidden&&(Me.stopHeartbeat(),(i=Me.context)==null||i.suspend().catch(()=>{})),Lo=performance.now(),_r=0});function x1(){gn.open||vn.open||Sn||me!=null&&me.open||Xe||He||(Ce!=null&&Ce.held?su(Ce,Mt,Jt):Ye.held?Ye.release(Mt):re.length&&Ws(re[0].id))}function Hr(){const i=gf({state:Re,held:!!(Ye.held||Ce!=null&&Ce.held),wellCount:re.length}),t=nt("#primaryAction");t.textContent=i.label,t.disabled=i.disabled||gn.open||vn.open||Sn||(me==null?void 0:me.open),ao.disabled=Sn||!["running","paused"].includes(Re),nt("#restart").disabled=Sn||se()&&(Re==="ready"||Xe||He),nt("#restart").textContent=se()?"✕":"↺",nt("#restart").setAttribute("aria-label",se()?"Die":"Restart"),nt("#restart").title=se()?"Die (R)":"Restart (R)",nt("#galleryButton").textContent=Ln?"▤":se()?"⌂":"⊞",nt("#galleryButton").setAttribute("aria-label",Ln?"Back to editor":se()?"Home":"Demo gallery"),nt("#galleryButton").title=Ln?"Back to editor":se()?"Home":"Demo gallery";const e=Re==="paused";ao.textContent=e?"▷":"Ⅱ",ao.setAttribute("aria-label",e?"Resume":"Pause"),ao.title=e?"Resume (P)":"Pause (P)"}function hm(){if(gn.open||vn.open||Sn||me!=null&&me.open||Xe||He)return;const i=gf({state:Re,held:!!(Ye.held||Ce!=null&&Ce.held),wellCount:re.length});i.action==="start"||i.action==="resume"?$s():i.action==="release"?su(Ce,Mt,Jt)||Ye.release(Mt):i.action==="remove"&&Ws(re[0].id),Hr()}nt("#primaryAction").addEventListener("click",hm);function $s(){He||Xe||Sn||me!=null&&me.open||gn.open||vn.open||(Qe=!Qe,Qe&&Me.stopHeartbeat(),Re=Qe?"paused":"running",Hr(),au.textContent=Qe?"PAUSED":"",Lo=performance.now(),Or())}window.addEventListener("keydown",i=>{if(gn.open||vn.open||Sn||me!=null&&me.open||i.target instanceof HTMLInputElement||i.target instanceof HTMLTextAreaElement)return;const t=i.key.toLowerCase();if(t===" "&&!Xe&&!He){i.preventDefault(),i.repeat||hm();return}i.repeat||(t==="p"&&Re!=="ready"&&(i.preventDefault(),$s()),t==="r"&&(se()?(Re==="running"||Re==="paused")&&Mr("manual"):Zi()),t==="e"&&x1(),t==="1"&&re[0]&&Ws(re[0].id),t==="2"&&re[1]&&Ws(re[1].id))});window.addEventListener("resize",xs);new ResizeObserver(xs).observe(Ur);var mf;(mf=window.visualViewport)==null||mf.addEventListener("resize",xs);function um(i){requestAnimationFrame(um);const t=Math.min((i-Lo)/1e3,.05);if(Lo=i,document.hidden){_r=0;return}if(!Qe&&!He&&!Xe){for(_r+=t;_r>=tn;){for(const r of re.filter(o=>So(o,Jt)<=0))Ws(r.id);const n={x:Mt.position.x,y:Mt.position.y},s=fn==="maze"?Kh(Mt.position,re,Jt,Wi,Zt):fl(Mt.position,re,Jt,Wi);if(Mt.applyForce(new w(s.x*Mt.mass,s.y*Mt.mass,0)),Ce){const r=SE(Mt.position,yt.entities,Ce);Mt.applyForce(new w(r.x*Mt.mass,r.y*Mt.mass,0))}if(h1(),kn.step(tn),Zt.channel&&tb(Mt.position,Mt.velocity,Zt.channel,ue),u1(),Mt.position.z=0,Mt.velocity.z=0,fn==="maze"){Zh(Mt.velocity,Math.max(yt.mechanic==="boost"?16:Mp,...(yt.entities||[]).filter(l=>l.type==="impulse").map(l=>l.speed)));const r=Ye.step(Mt,n,Jt,re,Wi,Mr);if(He)break;let o=null;if(Ce){if(o=wE(Ce,yt.entities,n,Mt,Jt,tn,Zt.bounds),o.died){Mr("hazard");break}for(const l of o.tones)Me.tone(l==="lightPickup"?587.33:l==="dimmer"?196:l==="portal"?330:440,0,.35,.08)}if(We){const l=vE(We,yt.soundGates,n,Mt.position,Jt);We=l.state;for(const c of l.acquired)Me.gateAcquire(c);for(const{id:c,beat:u}of l.beats)Me.gateBeat(c,u)}if((r==="teleport"||o!=null&&o.teleported)&&(dn&&fu(uu[(Fi+dn-1)%Jn],n),Fi=0,dn=0,mi.setDrawRange(0,0),n.x=Mt.position.x,n.y=Mt.position.y),le){const l=mE(le,{before:n,hero:Mt.position,dt:tn,time:Jt,level:Zt,config:yt.settings||Kn,extraEnergy:(o==null?void 0:o.energyDelta)||0});le=l.state,Ye.brightness=le.energy*((Ce==null?void 0:Ce.eclipseMultiplier)??1),An.minX=Math.min(An.minX,Mt.position.x),An.maxX=Math.max(An.maxX,Mt.position.x),An.minY=Math.min(An.minY,Mt.position.y),An.maxY=Math.max(An.maxY,Mt.position.y),l.collected&&(Me.stopHeartbeat(),Me.tone(587.33,0,.35,.08));for(const c of l.heartbeat)Me.heartbeat(c.part,c.urgency);if(l.failed){Mr();break}}if($e){const l=Db($e,{before:n,hero:Mt.position,level:yt.level,dt:tn,time:Jt});$e=l.state,Ye.brightness=$e.energy,l.collected&&Me.tone(587.33,0,.35,.08),l.gateChanged&&(Su($e.gateOpen),Me.tone($e.gateOpen?523.25:196,0,.5,.08))}const a=Sp(n,Mt.position,Zt);if((a==null?void 0:a.type)==="spike"){Mr();break}if((a==null?void 0:a.type)==="goal"){o1();break}}Jt+=tn,_r-=tn}p1(),fn==="maze"&&(nt("#runTime").textContent=`${Jt.toFixed(1)}s`),Mc++,Mc%8===0&&Yi(),fn==="sandbox"&&(Math.abs(Mt.position.x)>te.right+1.5||Math.abs(Mt.position.y)>te.top+1.5)&&(Me.death(),He=!0,Qe=!0,Re="dead",Or(),xl.classList.remove("hidden"))}Wo.position.set(Mt.position.x,Mt.position.y,2),_i.position.set(Mt.position.x,Mt.position.y,1.1);const e=Me.orb(!Sn&&!(me!=null&&me.open)&&!vn.open&&!gn.open&&!He&&!Xe&&!document.hidden,i/1e3,Ye.brightness);Hr(),_i.intensity=85*Ye.brightness,Xa.material.transparent=!!le,Xa.material.opacity=le?.08+le.energy*.92:1,Xa.scale.setScalar(1+e*.055),Ao.scale.setScalar(2.3+e*.25),Ao.material.opacity=(.83+e*.17)*Math.min(1,Ye.brightness),!Qe&&!He&&!Xe&&WE(t),fn==="maze"&&jE(),fn==="maze"&&KE(),Mi.rotation.z+=t*.35,xu.material.opacity=.35+Math.sin(i*.002)*.1,Ye.updateVisuals(Mt.position,Jt,Ye.brightness,Fe.getPixelRatio()),n1(),We&&s1(),yt.mechanic==="sound"&&(nt("#demoObjective").textContent=`Cross rings to add rhythm · ${Ye.layers.size}/3 voices active${Ye.layers.size?" · "+["bass","offbeat","chime"].filter((n,s)=>Ye.layers.has(s)).join(" + "):" · cyan bass / violet offbeat / gold chime"}`),kp.update(Mt.position,Ye.brightness),($e||le)&&(l1(),om()),d1(),m1(),bu(t),g1(),Me.trail(!Sn&&!(me!=null&&me.open)&&!Qe&&!He&&!Xe&&!document.hidden,Math.hypot(Mt.velocity.x,Mt.velocity.y),Jt-ru),(Mc%12===0||Qe||He)&&Or(),Fe.render(ze,te)}pi.visible=!yt.sandbox;Yo.visible=!!yt.sandbox;qi.has("demo")?Th(yt.id):Vn?Mu(Hs):en?wl(Hi,Vi):(Th(yt.id),ni());requestAnimationFrame(um);
