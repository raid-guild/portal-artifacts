(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();function Uf({state:i,held:t=!1,wellCount:e=0}){return i==="ready"?{label:"Start",action:"start",disabled:!1}:i==="paused"?{label:"Resume",action:"resume",disabled:!1}:i!=="running"?{label:"Start",action:null,disabled:!0}:t?{label:"Release",action:"release",disabled:!1}:{label:"Remove well",action:e?"remove":null,disabled:!e}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hh="180",Bm=0,Yu=1,zm=2,Ff=1,Of=2,Hi=3,vs=0,wn=1,Pn=2,ms=0,Pr=1,rn=2,$u=3,ju=4,km=5,Os=100,Gm=101,Hm=102,Vm=103,Wm=104,Xm=200,qm=201,Ym=202,$m=203,Oc=204,Bc=205,jm=206,Zm=207,Km=208,Jm=209,Qm=210,tg=211,eg=212,ng=213,ig=214,zc=0,kc=1,Gc=2,Fr=3,Hc=4,Vc=5,Wc=6,Xc=7,Bf=0,sg=1,rg=2,gs=0,og=1,ag=2,lg=3,zf=4,cg=5,hg=6,ug=7,kf=300,Or=301,Br=302,qc=303,Yc=304,Sl=306,$c=1e3,Hs=1001,jc=1002,Dn=1003,dg=1004,ca=1005,Vn=1006,Gl=1007,Vs=1008,wi=1009,Gf=1010,Hf=1011,bo=1012,Vh=1013,Xs=1014,Wi=1015,Xo=1016,Wh=1017,Xh=1018,wo=1020,Vf=35902,Wf=35899,Xf=1021,qf=1022,ni=1023,Eo=1026,To=1027,Yf=1028,qh=1029,$f=1030,Yh=1031,$h=1033,Ka=33776,Ja=33777,Qa=33778,tl=33779,Zc=35840,Kc=35841,Jc=35842,Qc=35843,th=36196,eh=37492,nh=37496,ih=37808,sh=37809,rh=37810,oh=37811,ah=37812,lh=37813,ch=37814,hh=37815,uh=37816,dh=37817,fh=37818,ph=37819,mh=37820,gh=37821,xh=36492,vh=36494,yh=36495,_h=36283,Mh=36284,Sh=36285,bh=36286,fg=3200,pg=3201,jf=0,mg=1,cs="",bn="srgb",zr="srgb-linear",ll="linear",Se="srgb",nr=7680,Zu=519,gg=512,xg=513,vg=514,Zf=515,yg=516,_g=517,Mg=518,Sg=519,wh=35044,Ei=35048,Ku="300 es",_i=2e3,cl=2001;class $r{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ju=1234567;const Lr=Math.PI/180,Ao=180/Math.PI;function Mi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ln[i&255]+ln[i>>8&255]+ln[i>>16&255]+ln[i>>24&255]+"-"+ln[t&255]+ln[t>>8&255]+"-"+ln[t>>16&15|64]+ln[t>>24&255]+"-"+ln[e&63|128]+ln[e>>8&255]+"-"+ln[e>>16&255]+ln[e>>24&255]+ln[n&255]+ln[n>>8&255]+ln[n>>16&255]+ln[n>>24&255]).toLowerCase()}function ee(i,t,e){return Math.max(t,Math.min(e,i))}function jh(i,t){return(i%t+t)%t}function bg(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function wg(i,t,e){return i!==t?(e-i)/(t-i):0}function yo(i,t,e){return(1-e)*i+e*t}function Eg(i,t,e,n){return yo(i,t,1-Math.exp(-e*n))}function Tg(i,t=1){return t-Math.abs(jh(i,t*2)-t)}function Ag(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Cg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Rg(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Pg(i,t){return i+Math.random()*(t-i)}function Lg(i){return i*(.5-Math.random())}function Ig(i){i!==void 0&&(Ju=i);let t=Ju+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Dg(i){return i*Lr}function Ng(i){return i*Ao}function Ug(i){return(i&i-1)===0&&i!==0}function Fg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Og(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Bg(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ei(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const zg={DEG2RAD:Lr,RAD2DEG:Ao,generateUUID:Mi,clamp:ee,euclideanModulo:jh,mapLinear:bg,inverseLerp:wg,lerp:yo,damp:Eg,pingpong:Tg,smoothstep:Ag,smootherstep:Cg,randInt:Rg,randFloat:Pg,randFloatSpread:Lg,seededRandom:Ig,degToRad:Dg,radToDeg:Ng,isPowerOfTwo:Ug,ceilPowerOfTwo:Fg,floorPowerOfTwo:Og,setQuaternionFromProperEuler:Bg,normalize:ve,denormalize:ei};class vt{constructor(t=0,e=0){vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}let qo=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=p,t[e+3]=x;return}if(h!==x||l!==d||c!==f||u!==p){let g=1-a;const m=l*d+c*f+u*p+h*x,y=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const C=Math.sqrt(M),w=Math.atan2(C,m*y);g=Math.sin(g*w)/C,a=Math.sin(a*w)/C}const _=a*y;if(l=l*g+d*_,c=c*g+f*_,u=u*g+p*_,h=h*g+x*_,g===1-a){const C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+u*h+l*f-c*d,t[e+1]=l*p+u*d+c*h-a*f,t[e+2]=c*p+u*f+a*d-l*h,t[e+3]=u*p-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ee(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class H{constructor(t=0,e=0,n=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Hl.copy(this).projectOnVector(t),this.sub(Hl)}reflect(t){return this.sub(Hl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ee(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hl=new H,Qu=new qo;class $t{constructor(t,e,n,s,r,o,a,l,c){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],x=s[0],g=s[3],m=s[6],y=s[1],M=s[4],_=s[7],C=s[2],w=s[5],P=s[8];return r[0]=o*x+a*y+l*C,r[3]=o*g+a*M+l*w,r[6]=o*m+a*_+l*P,r[1]=c*x+u*y+h*C,r[4]=c*g+u*M+h*w,r[7]=c*m+u*_+h*P,r[2]=d*x+f*y+p*C,r[5]=d*g+f*M+p*w,r[8]=d*m+f*_+p*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,p=e*h+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=h*x,t[1]=(s*c-u*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(u*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Vl.makeScale(t,e)),this}rotate(t){return this.premultiply(Vl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Vl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Vl=new $t;function Kf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function hl(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function kg(){const i=hl("canvas");return i.style.display="block",i}const td={};function Co(i){i in td||(td[i]=!0,console.warn(i))}function Gg(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const ed=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nd=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hg(){const i={enabled:!0,workingColorSpace:zr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Se&&(s.r=Yi(s.r),s.g=Yi(s.g),s.b=Yi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Se&&(s.r=Ir(s.r),s.g=Ir(s.g),s.b=Ir(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===cs?ll:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Co("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Co("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[zr]:{primaries:t,whitePoint:n,transfer:ll,toXYZ:ed,fromXYZ:nd,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:t,whitePoint:n,transfer:Se,toXYZ:ed,fromXYZ:nd,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}}),i}const de=Hg();function Yi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ir(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ir;class Vg{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ir===void 0&&(ir=hl("canvas")),ir.width=t.width,ir.height=t.height;const s=ir.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ir}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=hl("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Yi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Yi(e[n]/255)*255):e[n]=Yi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Wg=0;class Zh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=Mi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Wl(s[o].image)):r.push(Wl(s[o]))}else r=Wl(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Wl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vg.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xg=0;const Xl=new H;class un extends $r{constructor(t=un.DEFAULT_IMAGE,e=un.DEFAULT_MAPPING,n=Hs,s=Hs,r=Vn,o=Vs,a=ni,l=wi,c=un.DEFAULT_ANISOTROPY,u=cs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xg++}),this.uuid=Mi(),this.name="",this.source=new Zh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xl).x}get height(){return this.source.getSize(Xl).y}get depth(){return this.source.getSize(Xl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $c:t.x=t.x-Math.floor(t.x);break;case Hs:t.x=t.x<0?0:1;break;case jc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $c:t.y=t.y-Math.floor(t.y);break;case Hs:t.y=t.y<0?0:1;break;case jc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=kf;un.DEFAULT_ANISOTROPY=1;class ye{constructor(t=0,e=0,n=0,s=1){ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(f+1)/2,C=(m+1)/2,w=(u+d)/4,P=(h+x)/4,D=(p+g)/4;return M>_&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=w/n,r=P/n):_>C?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=w/s,r=D/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=P/r,s=D/r),this.set(n,s,r,e),this}let y=Math.sqrt((g-p)*(g-p)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(g-p)/y,this.y=(h-x)/y,this.z=(d-u)/y,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this.w=ee(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this.w=ee(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ee(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qg extends $r{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ye(0,0,t,e),this.scissorTest=!1,this.viewport=new ye(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new un(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Vn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Zh(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qs extends qg{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Jf extends un{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yg extends un{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Dn,this.minFilter=Dn,this.wrapR=Hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yo{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Zn):Zn.fromBufferAttribute(r,o),Zn.applyMatrix4(t.matrixWorld),this.expandByPoint(Zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ha.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ha.copy(n.boundingBox)),ha.applyMatrix4(t.matrixWorld),this.union(ha)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Zn),Zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(to),ua.subVectors(this.max,to),sr.subVectors(t.a,to),rr.subVectors(t.b,to),or.subVectors(t.c,to),ns.subVectors(rr,sr),is.subVectors(or,rr),As.subVectors(sr,or);let e=[0,-ns.z,ns.y,0,-is.z,is.y,0,-As.z,As.y,ns.z,0,-ns.x,is.z,0,-is.x,As.z,0,-As.x,-ns.y,ns.x,0,-is.y,is.x,0,-As.y,As.x,0];return!ql(e,sr,rr,or,ua)||(e=[1,0,0,0,1,0,0,0,1],!ql(e,sr,rr,or,ua))?!1:(da.crossVectors(ns,is),e=[da.x,da.y,da.z],ql(e,sr,rr,or,ua))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Di),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Di=[new H,new H,new H,new H,new H,new H,new H,new H],Zn=new H,ha=new Yo,sr=new H,rr=new H,or=new H,ns=new H,is=new H,As=new H,to=new H,ua=new H,da=new H,Cs=new H;function ql(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Cs.fromArray(i,r);const a=s.x*Math.abs(Cs.x)+s.y*Math.abs(Cs.y)+s.z*Math.abs(Cs.z),l=t.dot(Cs),c=e.dot(Cs),u=n.dot(Cs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const $g=new Yo,eo=new H,Yl=new H;let $o=class{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$g.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;eo.subVectors(t,this.center);const e=eo.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(eo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(eo.copy(t.center).add(Yl)),this.expandByPoint(eo.copy(t.center).sub(Yl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}};const Ni=new H,$l=new H,fa=new H,ss=new H,jl=new H,pa=new H,Zl=new H;let Kh=class{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ni.copy(this.origin).addScaledVector(this.direction,e),Ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){$l.copy(t).add(e).multiplyScalar(.5),fa.copy(e).sub(t).normalize(),ss.copy(this.origin).sub($l);const r=t.distanceTo(e)*.5,o=-this.direction.dot(fa),a=ss.dot(this.direction),l=-ss.dot(fa),c=ss.lengthSq(),u=Math.abs(1-o*o);let h,d,f,p;if(u>0)if(h=o*l-a,d=o*a-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const x=1/u;h*=x,d*=x,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy($l).addScaledVector(fa,d),f}intersectSphere(t,e){Ni.subVectors(t.center,this.origin);const n=Ni.dot(this.direction),s=Ni.dot(Ni)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ni)!==null}intersectTriangle(t,e,n,s,r){jl.subVectors(e,t),pa.subVectors(n,t),Zl.crossVectors(jl,pa);let o=this.direction.dot(Zl),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ss.subVectors(this.origin,t);const l=a*this.direction.dot(pa.crossVectors(ss,pa));if(l<0)return null;const c=a*this.direction.dot(jl.cross(ss));if(c<0||l+c>o)return null;const u=-a*ss.dot(Zl);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class Ee{constructor(t,e,n,s,r,o,a,l,c,u,h,d,f,p,x,g){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,d,f,p,x,g)}set(t,e,n,s,r,o,a,l,c,u,h,d,f,p,x,g){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ar.setFromMatrixColumn(t,0).length(),r=1/ar.setFromMatrixColumn(t,1).length(),o=1/ar.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+p*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d+x*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-p,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,f=l*h,p=c*u,x=c*h;e[0]=d-x*a,e[4]=-o*h,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*u,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,f=o*h,p=a*u,x=a*h;e[0]=l*u,e[4]=p*c-f,e[8]=d*c+x,e[1]=l*h,e[5]=x*c+d,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=x-d*h,e[8]=p*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+p,e[10]=d-x*h}else if(t.order==="XZY"){const d=o*l,f=o*c,p=a*l,x=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+x,e[5]=o*u,e[9]=f*h-p,e[2]=p*h-f,e[6]=a*u,e[10]=x*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(jg,t,Zg)}lookAt(t,e,n){const s=this.elements;return Cn.subVectors(t,e),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),rs.crossVectors(n,Cn),rs.lengthSq()===0&&(Math.abs(n.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),rs.crossVectors(n,Cn)),rs.normalize(),ma.crossVectors(Cn,rs),s[0]=rs.x,s[4]=ma.x,s[8]=Cn.x,s[1]=rs.y,s[5]=ma.y,s[9]=Cn.y,s[2]=rs.z,s[6]=ma.z,s[10]=Cn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],x=n[6],g=n[10],m=n[14],y=n[3],M=n[7],_=n[11],C=n[15],w=s[0],P=s[4],D=s[8],E=s[12],v=s[1],R=s[5],N=s[9],L=s[13],k=s[2],B=s[6],z=s[10],j=s[14],X=s[3],rt=s[7],gt=s[11],ht=s[15];return r[0]=o*w+a*v+l*k+c*X,r[4]=o*P+a*R+l*B+c*rt,r[8]=o*D+a*N+l*z+c*gt,r[12]=o*E+a*L+l*j+c*ht,r[1]=u*w+h*v+d*k+f*X,r[5]=u*P+h*R+d*B+f*rt,r[9]=u*D+h*N+d*z+f*gt,r[13]=u*E+h*L+d*j+f*ht,r[2]=p*w+x*v+g*k+m*X,r[6]=p*P+x*R+g*B+m*rt,r[10]=p*D+x*N+g*z+m*gt,r[14]=p*E+x*L+g*j+m*ht,r[3]=y*w+M*v+_*k+C*X,r[7]=y*P+M*R+_*B+C*rt,r[11]=y*D+M*N+_*z+C*gt,r[15]=y*E+M*L+_*j+C*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],p=t[3],x=t[7],g=t[11],m=t[15];return p*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+x*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+g*(+e*c*h-e*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+m*(-s*a*u-e*l*h+e*a*d+s*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],p=t[12],x=t[13],g=t[14],m=t[15],y=h*g*c-x*d*c+x*l*f-a*g*f-h*l*m+a*d*m,M=p*d*c-u*g*c-p*l*f+o*g*f+u*l*m-o*d*m,_=u*x*c-p*h*c+p*a*f-o*x*f-u*a*m+o*h*m,C=p*h*l-u*x*l-p*a*d+o*x*d+u*a*g-o*h*g,w=e*y+n*M+s*_+r*C;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/w;return t[0]=y*P,t[1]=(x*d*r-h*g*r-x*s*f+n*g*f+h*s*m-n*d*m)*P,t[2]=(a*g*r-x*l*r+x*s*c-n*g*c-a*s*m+n*l*m)*P,t[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*P,t[4]=M*P,t[5]=(u*g*r-p*d*r+p*s*f-e*g*f-u*s*m+e*d*m)*P,t[6]=(p*l*r-o*g*r-p*s*c+e*g*c+o*s*m-e*l*m)*P,t[7]=(o*d*r-u*l*r+u*s*c-e*d*c-o*s*f+e*l*f)*P,t[8]=_*P,t[9]=(p*h*r-u*x*r-p*n*f+e*x*f+u*n*m-e*h*m)*P,t[10]=(o*x*r-p*a*r+p*n*c-e*x*c-o*n*m+e*a*m)*P,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*f-e*a*f)*P,t[12]=C*P,t[13]=(u*x*s-p*h*s+p*n*d-e*x*d-u*n*g+e*h*g)*P,t[14]=(p*a*s-o*x*s-p*n*l+e*x*l+o*n*g-e*a*g)*P,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*d+e*a*d)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,p=r*h,x=o*u,g=o*h,m=a*h,y=l*c,M=l*u,_=l*h,C=n.x,w=n.y,P=n.z;return s[0]=(1-(x+m))*C,s[1]=(f+_)*C,s[2]=(p-M)*C,s[3]=0,s[4]=(f-_)*w,s[5]=(1-(d+m))*w,s[6]=(g+y)*w,s[7]=0,s[8]=(p+M)*P,s[9]=(g-y)*P,s[10]=(1-(d+x))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ar.set(s[0],s[1],s[2]).length();const o=ar.set(s[4],s[5],s[6]).length(),a=ar.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Kn.copy(this);const c=1/r,u=1/o,h=1/a;return Kn.elements[0]*=c,Kn.elements[1]*=c,Kn.elements[2]*=c,Kn.elements[4]*=u,Kn.elements[5]*=u,Kn.elements[6]*=u,Kn.elements[8]*=h,Kn.elements[9]*=h,Kn.elements[10]*=h,e.setFromRotationMatrix(Kn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=_i,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===_i)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===cl)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=_i,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===_i)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===cl)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ar=new H,Kn=new Ee,jg=new H(0,0,0),Zg=new H(1,1,1),rs=new H,ma=new H,Cn=new H,id=new Ee,sd=new qo;class Ti{constructor(t=0,e=0,n=0,s=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ee(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ee(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ee(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ee(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ee(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ee(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return id.makeRotationFromQuaternion(t),this.setFromRotationMatrix(id,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sd.setFromEuler(this),this.setFromQuaternion(sd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class Qf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Kg=0;const rd=new H,lr=new qo,Ui=new Ee,ga=new H,no=new H,Jg=new H,Qg=new qo,od=new H(1,0,0),ad=new H(0,1,0),ld=new H(0,0,1),cd={type:"added"},t0={type:"removed"},cr={type:"childadded",child:null},Kl={type:"childremoved",child:null};class on extends $r{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kg++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=on.DEFAULT_UP.clone();const t=new H,e=new Ti,n=new qo,s=new H(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ee},normalMatrix:{value:new $t}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=on.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return lr.setFromAxisAngle(t,e),this.quaternion.multiply(lr),this}rotateOnWorldAxis(t,e){return lr.setFromAxisAngle(t,e),this.quaternion.premultiply(lr),this}rotateX(t){return this.rotateOnAxis(od,t)}rotateY(t){return this.rotateOnAxis(ad,t)}rotateZ(t){return this.rotateOnAxis(ld,t)}translateOnAxis(t,e){return rd.copy(t).applyQuaternion(this.quaternion),this.position.add(rd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(od,t)}translateY(t){return this.translateOnAxis(ad,t)}translateZ(t){return this.translateOnAxis(ld,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ui.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ga.copy(t):ga.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),no.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ui.lookAt(no,ga,this.up):Ui.lookAt(ga,no,this.up),this.quaternion.setFromRotationMatrix(Ui),s&&(Ui.extractRotation(s.matrixWorld),lr.setFromRotationMatrix(Ui),this.quaternion.premultiply(lr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(cd),cr.child=t,this.dispatchEvent(cr),cr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(t0),Kl.child=t,this.dispatchEvent(Kl),Kl.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ui.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ui.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ui),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(cd),cr.child=t,this.dispatchEvent(cr),cr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(no,t,Jg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(no,Qg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}on.DEFAULT_UP=new H(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Jn=new H,Fi=new H,Jl=new H,Oi=new H,hr=new H,ur=new H,hd=new H,Ql=new H,tc=new H,ec=new H,nc=new ye,ic=new ye,sc=new ye;class Ln{constructor(t=new H,e=new H,n=new H){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Jn.subVectors(t,e),s.cross(Jn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Jn.subVectors(s,e),Fi.subVectors(n,e),Jl.subVectors(t,e);const o=Jn.dot(Jn),a=Jn.dot(Fi),l=Jn.dot(Jl),c=Fi.dot(Fi),u=Fi.dot(Jl),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,p=(o*u-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Oi)===null?!1:Oi.x>=0&&Oi.y>=0&&Oi.x+Oi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Oi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Oi.x),l.addScaledVector(o,Oi.y),l.addScaledVector(a,Oi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return nc.setScalar(0),ic.setScalar(0),sc.setScalar(0),nc.fromBufferAttribute(t,e),ic.fromBufferAttribute(t,n),sc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(nc,r.x),o.addScaledVector(ic,r.y),o.addScaledVector(sc,r.z),o}static isFrontFacing(t,e,n,s){return Jn.subVectors(n,e),Fi.subVectors(t,e),Jn.cross(Fi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Jn.subVectors(this.c,this.b),Fi.subVectors(this.a,this.b),Jn.cross(Fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Ln.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;hr.subVectors(s,n),ur.subVectors(r,n),Ql.subVectors(t,n);const l=hr.dot(Ql),c=ur.dot(Ql);if(l<=0&&c<=0)return e.copy(n);tc.subVectors(t,s);const u=hr.dot(tc),h=ur.dot(tc);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(hr,o);ec.subVectors(t,r);const f=hr.dot(ec),p=ur.dot(ec);if(p>=0&&f<=p)return e.copy(r);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(ur,a);const g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return hd.subVectors(r,s),a=(h-u)/(h-u+(f-p)),e.copy(s).addScaledVector(hd,a);const m=1/(g+x+d);return o=x*m,a=d*m,e.copy(n).addScaledVector(hr,o).addScaledVector(ur,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const tp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},os={h:0,s:0,l:0},xa={h:0,s:0,l:0};function rc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class se{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=bn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=jh(t,1),e=ee(e,0,1),n=ee(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=rc(o,r,t+1/3),this.g=rc(o,r,t),this.b=rc(o,r,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=bn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=bn){const n=tp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Yi(t.r),this.g=Yi(t.g),this.b=Yi(t.b),this}copyLinearToSRGB(t){return this.r=Ir(t.r),this.g=Ir(t.g),this.b=Ir(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=bn){return de.workingToColorSpace(cn.copy(this),t),Math.round(ee(cn.r*255,0,255))*65536+Math.round(ee(cn.g*255,0,255))*256+Math.round(ee(cn.b*255,0,255))}getHexString(t=bn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(cn.copy(this),e);const n=cn.r,s=cn.g,r=cn.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(cn.copy(this),e),t.r=cn.r,t.g=cn.g,t.b=cn.b,t}getStyle(t=bn){de.workingToColorSpace(cn.copy(this),t);const e=cn.r,n=cn.g,s=cn.b;return t!==bn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(os),this.setHSL(os.h+t,os.s+e,os.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(os),t.getHSL(xa);const n=yo(os.h,xa.h,e),s=yo(os.s,xa.s,e),r=yo(os.l,xa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const cn=new se;se.NAMES=tp;let e0=0,bs=class extends $r{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=Mi(),this.name="",this.type="Material",this.blending=Pr,this.side=vs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oc,this.blendDst=Bc,this.blendEquation=Os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new se(0,0,0),this.blendAlpha=0,this.depthFunc=Fr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=nr,this.stencilZFail=nr,this.stencilZPass=nr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Pr&&(n.blending=this.blending),this.side!==vs&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Oc&&(n.blendSrc=this.blendSrc),this.blendDst!==Bc&&(n.blendDst=this.blendDst),this.blendEquation!==Os&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==nr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==nr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==nr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};class ke extends bs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Bf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const He=new H,va=new vt;let n0=0;class Pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:n0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=wh,this.updateRanges=[],this.gpuType=Wi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)va.fromBufferAttribute(this,e),va.applyMatrix3(t),this.setXY(e,va.x,va.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ei(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ei(e,this.array)),e}setX(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ei(e,this.array)),e}setY(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ei(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ei(e,this.array)),e}setW(t,e){return this.normalized&&(e=ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array),r=ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wh&&(t.usage=this.usage),t}}class ep extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class np extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Le extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let i0=0;const Bn=new Ee,oc=new on,dr=new H,Rn=new Yo,io=new Yo,en=new H;class _e extends $r{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:i0++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Kf(t)?np:ep)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Bn.makeRotationFromQuaternion(t),this.applyMatrix4(Bn),this}rotateX(t){return Bn.makeRotationX(t),this.applyMatrix4(Bn),this}rotateY(t){return Bn.makeRotationY(t),this.applyMatrix4(Bn),this}rotateZ(t){return Bn.makeRotationZ(t),this.applyMatrix4(Bn),this}translate(t,e,n){return Bn.makeTranslation(t,e,n),this.applyMatrix4(Bn),this}scale(t,e,n){return Bn.makeScale(t,e,n),this.applyMatrix4(Bn),this}lookAt(t){return oc.lookAt(t),oc.updateMatrix(),this.applyMatrix4(oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(dr).negate(),this.translate(dr.x,dr.y,dr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Rn.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $o);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const n=this.boundingSphere.center;if(Rn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];io.setFromBufferAttribute(a),this.morphTargetsRelative?(en.addVectors(Rn.min,io.min),Rn.expandByPoint(en),en.addVectors(Rn.max,io.max),Rn.expandByPoint(en)):(Rn.expandByPoint(io.min),Rn.expandByPoint(io.max))}Rn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)en.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(en));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)en.fromBufferAttribute(a,c),l&&(dr.fromBufferAttribute(t,c),en.add(dr)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let D=0;D<n.count;D++)a[D]=new H,l[D]=new H;const c=new H,u=new H,h=new H,d=new vt,f=new vt,p=new vt,x=new H,g=new H;function m(D,E,v){c.fromBufferAttribute(n,D),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,v),d.fromBufferAttribute(r,D),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,v),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const R=1/(f.x*p.y-p.x*f.y);isFinite(R)&&(x.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(R),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(R),a[D].add(x),a[E].add(x),a[v].add(x),l[D].add(g),l[E].add(g),l[v].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let D=0,E=y.length;D<E;++D){const v=y[D],R=v.start,N=v.count;for(let L=R,k=R+N;L<k;L+=3)m(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const M=new H,_=new H,C=new H,w=new H;function P(D){C.fromBufferAttribute(s,D),w.copy(C);const E=a[D];M.copy(E),M.sub(C.multiplyScalar(C.dot(E))).normalize(),_.crossVectors(w,E);const R=_.dot(l[D])<0?-1:1;o.setXYZW(D,M.x,M.y,M.z,R)}for(let D=0,E=y.length;D<E;++D){const v=y[D],R=v.start,N=v.count;for(let L=R,k=R+N;L<k;L+=3)P(t.getX(L+0)),P(t.getX(L+1)),P(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new H,r=new H,o=new H,a=new H,l=new H,c=new H,u=new H,h=new H;if(t)for(let d=0,f=t.count;d<f;d+=3){const p=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),a.add(u),l.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)en.fromBufferAttribute(t,e),en.normalize(),t.setXYZ(e,en.x,en.y,en.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let m=0;m<u;m++)d[p++]=c[f++]}return new Pe(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new _e,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ud=new Ee,Rs=new Kh,ya=new $o,dd=new H,_a=new H,Ma=new H,Sa=new H,ac=new H,ba=new H,fd=new H,wa=new H;class pe extends on{constructor(t=new _e,e=new ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){ba.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(ac.fromBufferAttribute(h,t),o?ba.addScaledVector(ac,u):ba.addScaledVector(ac.sub(e),u))}e.add(ba)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(r),Rs.copy(t.ray).recast(t.near),!(ya.containsPoint(Rs.origin)===!1&&(Rs.intersectSphere(ya,dd)===null||Rs.origin.distanceToSquared(dd)>(t.far-t.near)**2))&&(ud.copy(r).invert(),Rs.copy(t.ray).applyMatrix4(ud),!(n.boundingBox!==null&&Rs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Rs)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const g=d[p],m=o[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=y,C=M;_<C;_+=3){const w=a.getX(_),P=a.getX(_+1),D=a.getX(_+2);s=Ea(this,m,t,n,c,u,h,w,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){const y=a.getX(g),M=a.getX(g+1),_=a.getX(g+2);s=Ea(this,o,t,n,c,u,h,y,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){const g=d[p],m=o[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let _=y,C=M;_<C;_+=3){const w=_,P=_+1,D=_+2;s=Ea(this,m,t,n,c,u,h,w,P,D),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){const y=g,M=g+1,_=g+2;s=Ea(this,o,t,n,c,u,h,y,M,_),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function s0(i,t,e,n,s,r,o,a){let l;if(t.side===wn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===vs,a),l===null)return null;wa.copy(a),wa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(wa);return c<e.near||c>e.far?null:{distance:c,point:wa.clone(),object:i}}function Ea(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,_a),i.getVertexPosition(l,Ma),i.getVertexPosition(c,Sa);const u=s0(i,t,e,n,_a,Ma,Sa,fd);if(u){const h=new H;Ln.getBarycoord(fd,_a,Ma,Sa,h),s&&(u.uv=Ln.getInterpolatedAttribute(s,a,l,c,h,new vt)),r&&(u.uv1=Ln.getInterpolatedAttribute(r,a,l,c,h,new vt)),o&&(u.normal=Ln.getInterpolatedAttribute(o,a,l,c,h,new H),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new H,materialIndex:0};Ln.getNormal(_a,Ma,Sa,d.normal),u.face=d,u.barycoord=h}return u}class Ks extends _e{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(u,3)),this.setAttribute("uv",new Le(h,2));function p(x,g,m,y,M,_,C,w,P,D,E){const v=_/P,R=C/D,N=_/2,L=C/2,k=w/2,B=P+1,z=D+1;let j=0,X=0;const rt=new H;for(let gt=0;gt<z;gt++){const ht=gt*R-L;for(let ut=0;ut<B;ut++){const Gt=ut*v-N;rt[x]=Gt*y,rt[g]=ht*M,rt[m]=k,c.push(rt.x,rt.y,rt.z),rt[x]=0,rt[g]=0,rt[m]=w>0?1:-1,u.push(rt.x,rt.y,rt.z),h.push(ut/P),h.push(1-gt/D),j+=1}}for(let gt=0;gt<D;gt++)for(let ht=0;ht<P;ht++){const ut=d+ht+B*gt,Gt=d+ht+B*(gt+1),oe=d+(ht+1)+B*(gt+1),Zt=d+(ht+1)+B*gt;l.push(ut,Gt,Zt),l.push(Gt,oe,Zt),X+=6}a.addGroup(f,X,E),f+=X,d+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ks(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function kr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function mn(i){const t={};for(let e=0;e<i.length;e++){const n=kr(i[e]);for(const s in n)t[s]=n[s]}return t}function r0(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ip(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const o0={clone:kr,merge:mn};var a0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,l0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yn extends bs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a0,this.fragmentShader=l0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=kr(t.uniforms),this.uniformsGroups=r0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class sp extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=_i,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const as=new H,pd=new vt,md=new vt;class Gn extends sp{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ao*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Lr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(Lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){as.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(as.x,as.y).multiplyScalar(-t/as.z),as.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(as.x,as.y).multiplyScalar(-t/as.z)}getViewSize(t,e){return this.getViewBounds(t,pd,md),e.subVectors(md,pd)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Lr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const fr=-90,pr=1;class c0 extends on{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Gn(fr,pr,t,e);s.layers=this.layers,this.add(s);const r=new Gn(fr,pr,t,e);r.layers=this.layers,this.add(r);const o=new Gn(fr,pr,t,e);o.layers=this.layers,this.add(o);const a=new Gn(fr,pr,t,e);a.layers=this.layers,this.add(a);const l=new Gn(fr,pr,t,e);l.layers=this.layers,this.add(l);const c=new Gn(fr,pr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===_i)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===cl)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class rp extends un{constructor(t=[],e=Or,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class h0 extends qs{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new rp(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ks(5,5,5),r=new Yn({name:"CubemapFromEquirect",uniforms:kr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:wn,blending:ms});r.uniforms.tEquirect.value=e;const o=new pe(s,r),a=e.minFilter;return e.minFilter===Vs&&(e.minFilter=Vn),new c0(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Ce extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}}const u0={type:"move"};class lc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(u0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ce;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class d0 extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class f0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=wh,this.updateRanges=[],this.version=0,this.uuid=Mi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const pn=new H;class ul{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.applyMatrix4(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.applyNormalMatrix(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)pn.fromBufferAttribute(this,e),pn.transformDirection(t),this.setXYZ(e,pn.x,pn.y,pn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=ei(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ve(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ve(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ei(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ei(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ei(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ei(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ve(e,this.array),n=ve(n,this.array),s=ve(s,this.array),r=ve(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ul(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ri extends bs{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new se(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let mr;const so=new H,gr=new H,xr=new H,vr=new vt,ro=new vt,op=new Ee,Ta=new H,oo=new H,Aa=new H,gd=new vt,cc=new vt,xd=new vt;class Si extends on{constructor(t=new ri){if(super(),this.isSprite=!0,this.type="Sprite",mr===void 0){mr=new _e;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new f0(e,5);mr.setIndex([0,1,2,0,2,3]),mr.setAttribute("position",new ul(n,3,0,!1)),mr.setAttribute("uv",new ul(n,2,3,!1))}this.geometry=mr,this.material=t,this.center=new vt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),gr.setFromMatrixScale(this.matrixWorld),op.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),xr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&gr.multiplyScalar(-xr.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Ca(Ta.set(-.5,-.5,0),xr,o,gr,s,r),Ca(oo.set(.5,-.5,0),xr,o,gr,s,r),Ca(Aa.set(.5,.5,0),xr,o,gr,s,r),gd.set(0,0),cc.set(1,0),xd.set(1,1);let a=t.ray.intersectTriangle(Ta,oo,Aa,!1,so);if(a===null&&(Ca(oo.set(-.5,.5,0),xr,o,gr,s,r),cc.set(0,1),a=t.ray.intersectTriangle(Ta,Aa,oo,!1,so),a===null))return;const l=t.ray.origin.distanceTo(so);l<t.near||l>t.far||e.push({distance:l,point:so.clone(),uv:Ln.getInterpolation(so,Ta,oo,Aa,gd,cc,xd,new vt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ca(i,t,e,n,s,r){vr.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ro.x=r*vr.x-s*vr.y,ro.y=s*vr.x+r*vr.y):ro.copy(vr),i.copy(t),i.x+=ro.x,i.y+=ro.y,i.applyMatrix4(op)}class p0 extends un{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Dn,u=Dn,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hc=new H,m0=new H,g0=new $t;class Ns{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=hc.subVectors(n,e).cross(m0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(hc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||g0.getNormalMatrix(t),s=this.coplanarPoint(hc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ps=new $o,x0=new vt(.5,.5),Ra=new H;class Jh{constructor(t=new Ns,e=new Ns,n=new Ns,s=new Ns,r=new Ns,o=new Ns){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=_i,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],y=r[12],M=r[13],_=r[14],C=r[15];if(s[0].setComponents(c-o,f-u,m-p,C-y).normalize(),s[1].setComponents(c+o,f+u,m+p,C+y).normalize(),s[2].setComponents(c+a,f+h,m+x,C+M).normalize(),s[3].setComponents(c-a,f-h,m-x,C-M).normalize(),n)s[4].setComponents(l,d,g,_).normalize(),s[5].setComponents(c-l,f-d,m-g,C-_).normalize();else if(s[4].setComponents(c-l,f-d,m-g,C-_).normalize(),e===_i)s[5].setComponents(c+l,f+d,m+g,C+_).normalize();else if(e===cl)s[5].setComponents(l,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ps.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ps.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ps)}intersectsSprite(t){Ps.center.set(0,0,0);const e=x0.distanceTo(t.center);return Ps.radius=.7071067811865476+e,Ps.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ps)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ra.x=s.normal.x>0?t.max.x:t.min.x,Ra.y=s.normal.y>0?t.max.y:t.min.y,Ra.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ra)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class dn extends bs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const dl=new H,fl=new H,vd=new Ee,ao=new Kh,Pa=new $o,uc=new H,yd=new H;class jr extends on{constructor(t=new _e,e=new dn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)dl.fromBufferAttribute(e,s-1),fl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=dl.distanceTo(fl);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pa.copy(n.boundingSphere),Pa.applyMatrix4(s),Pa.radius+=r,t.ray.intersectsSphere(Pa)===!1)return;vd.copy(s).invert(),ao.copy(t.ray).applyMatrix4(vd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let x=f,g=p-1;x<g;x+=c){const m=u.getX(x),y=u.getX(x+1),M=La(this,t,ao,l,m,y,x);M&&e.push(M)}if(this.isLineLoop){const x=u.getX(p-1),g=u.getX(f),m=La(this,t,ao,l,x,g,p-1);m&&e.push(m)}}else{const f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let x=f,g=p-1;x<g;x+=c){const m=La(this,t,ao,l,x,x+1,x);m&&e.push(m)}if(this.isLineLoop){const x=La(this,t,ao,l,p-1,f,p-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function La(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(dl.fromBufferAttribute(a,s),fl.fromBufferAttribute(a,r),e.distanceSqToSegment(dl,fl,uc,yd)>n)return;uc.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(uc);if(!(c<t.near||c>t.far))return{distance:c,point:yd.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const _d=new H,Md=new H;class v0 extends jr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)_d.fromBufferAttribute(e,s),Md.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+_d.distanceTo(Md);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ap extends bs{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new se(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Sd=new Ee,Eh=new Kh,Ia=new $o,Da=new H;class jo extends on{constructor(t=new _e,e=new ap){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ia.copy(n.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=r,t.ray.intersectsSphere(Ia)===!1)return;Sd.copy(s).invert(),Eh.copy(t.ray).applyMatrix4(Sd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=d,x=f;p<x;p++){const g=c.getX(p);Da.fromBufferAttribute(h,g),bd(Da,g,l,s,t,e,this)}}else{const d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let p=d,x=f;p<x;p++)Da.fromBufferAttribute(h,p),bd(Da,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function bd(i,t,e,n,s,r,o){const a=Eh.distanceSqToPoint(i);if(a<e){const l=new H;Eh.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class bl extends un{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class lp extends un{constructor(t,e,n=Xs,s,r,o,a=Dn,l=Dn,c,u=Eo,h=1){if(u!==Eo&&u!==To)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Zh(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class cp extends un{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Zi extends _e{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new H,u=new vt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const f=n+h/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(a,3)),this.setAttribute("uv",new Le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}const Na=new H,Ua=new H,dc=new H,Fa=new Ln;class y0 extends _e{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),r=Math.cos(Lr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let p=0;p<l;p+=3){o?(c[0]=o.getX(p),c[1]=o.getX(p+1),c[2]=o.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:x,b:g,c:m}=Fa;if(x.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),m.fromBufferAttribute(a,c[2]),Fa.getNormal(dc),h[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,h[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,h[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let y=0;y<3;y++){const M=(y+1)%3,_=h[y],C=h[M],w=Fa[u[y]],P=Fa[u[M]],D=`${_}_${C}`,E=`${C}_${_}`;E in d&&d[E]?(dc.dot(d[E].normal)<=r&&(f.push(w.x,w.y,w.z),f.push(P.x,P.y,P.z)),d[E]=null):D in d||(d[D]={index0:c[y],index1:c[M],normal:dc.clone()})}}for(const p in d)if(d[p]){const{index0:x,index1:g}=d[p];Na.fromBufferAttribute(a,x),Ua.fromBufferAttribute(a,g),f.push(Na.x,Na.y,Na.z),f.push(Ua.x,Ua.y,Ua.z)}this.setAttribute("position",new Le(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Li{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new vt:new H);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new H,s=[],r=[],o=[],a=new H,l=new Ee;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new H)}r[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(ee(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(ee(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Qh extends Li{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new vt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class _0 extends Qh{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function tu(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Oa=new H,fc=new tu,pc=new tu,mc=new tu;class M0 extends Li{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new H){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(Oa.subVectors(s[0],s[1]).add(s[0]),c=Oa);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Oa.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Oa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(h),f),x=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);x<1e-4&&(x=1),p<1e-4&&(p=x),g<1e-4&&(g=x),fc.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,p,x,g),pc.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,p,x,g),mc.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,p,x,g)}else this.curveType==="catmullrom"&&(fc.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),pc.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),mc.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(fc.calc(l),pc.calc(l),mc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new H().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function wd(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function S0(i,t){const e=1-i;return e*e*t}function b0(i,t){return 2*(1-i)*i*t}function w0(i,t){return i*i*t}function _o(i,t,e,n){return S0(i,t)+b0(i,e)+w0(i,n)}function E0(i,t){const e=1-i;return e*e*e*t}function T0(i,t){const e=1-i;return 3*e*e*i*t}function A0(i,t){return 3*(1-i)*i*i*t}function C0(i,t){return i*i*i*t}function Mo(i,t,e,n,s){return E0(i,t)+T0(i,e)+A0(i,n)+C0(i,s)}class hp extends Li{constructor(t=new vt,e=new vt,n=new vt,s=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mo(t,s.x,r.x,o.x,a.x),Mo(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class R0 extends Li{constructor(t=new H,e=new H,n=new H,s=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new H){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mo(t,s.x,r.x,o.x,a.x),Mo(t,s.y,r.y,o.y,a.y),Mo(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class up extends Li{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class P0 extends Li{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dp extends Li{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(_o(t,s.x,r.x,o.x),_o(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class L0 extends Li{constructor(t=new H,e=new H,n=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new H){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(_o(t,s.x,r.x,o.x),_o(t,s.y,r.y,o.y),_o(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fp extends Li{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(wd(a,l.x,c.x,u.x,h.x),wd(a,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new vt().fromArray(s))}return this}}var Th=Object.freeze({__proto__:null,ArcCurve:_0,CatmullRomCurve3:M0,CubicBezierCurve:hp,CubicBezierCurve3:R0,EllipseCurve:Qh,LineCurve:up,LineCurve3:P0,QuadraticBezierCurve:dp,QuadraticBezierCurve3:L0,SplineCurve:fp});class I0 extends Li{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Th[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Th[s.type]().fromJSON(s))}return this}}class Ed extends I0{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new up(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new dp(this.currentPoint.clone(),new vt(t,e),new vt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new hp(this.currentPoint.clone(),new vt(t,e),new vt(n,s),new vt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new fp(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Qh(t,e,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}let Gr=class extends Ed{constructor(t){super(t),this.uuid=Mi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Ed().fromJSON(s))}return this}};function D0(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=pp(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=B0(i,t,r,e)),i.length>80*e){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=e;d<s;d+=e){const f=i[d],p=i[d+1];f<a&&(a=f),p<l&&(l=p),f>u&&(u=f),p>h&&(h=p)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return Ro(r,o,e,a,l,c,0),o}function pp(i,t,e,n,s){let r;if(s===j0(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Td(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Td(o/n|0,i[o],i[o+1],r);return r&&Hr(r,r.next)&&(Lo(r),r=r.next),r}function Ys(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Hr(e,e.next)||Ue(e.prev,e,e.next)===0)){if(Lo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ro(i,t,e,n,s,r,o){if(!i)return;!o&&r&&V0(i,n,s,r);let a=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?U0(i,n,s,r):N0(i)){t.push(l.i,i.i,c.i),Lo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=F0(Ys(i),t),Ro(i,t,e,n,s,r,2)):o===2&&O0(i,t,e,n,s,r):Ro(Ys(i),t,e,n,s,r,1);break}}}function N0(i){const t=i.prev,e=i,n=i.next;if(Ue(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=Math.min(s,r,o),h=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c);let p=n.next;for(;p!==t;){if(p.x>=u&&p.x<=d&&p.y>=h&&p.y<=f&&go(s,a,r,l,o,c,p.x,p.y)&&Ue(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function U0(i,t,e,n){const s=i.prev,r=i,o=i.next;if(Ue(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,f=Math.min(a,l,c),p=Math.min(u,h,d),x=Math.max(a,l,c),g=Math.max(u,h,d),m=Ah(f,p,t,e,n),y=Ah(x,g,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=m&&_&&_.z<=y;){if(M.x>=f&&M.x<=x&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&go(a,u,l,h,c,d,M.x,M.y)&&Ue(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=x&&_.y>=p&&_.y<=g&&_!==s&&_!==o&&go(a,u,l,h,c,d,_.x,_.y)&&Ue(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=x&&M.y>=p&&M.y<=g&&M!==s&&M!==o&&go(a,u,l,h,c,d,M.x,M.y)&&Ue(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=y;){if(_.x>=f&&_.x<=x&&_.y>=p&&_.y<=g&&_!==s&&_!==o&&go(a,u,l,h,c,d,_.x,_.y)&&Ue(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function F0(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Hr(n,s)&&gp(n,e,e.next,s)&&Po(n,s)&&Po(s,n)&&(t.push(n.i,e.i,s.i),Lo(e),Lo(e.next),e=i=s),e=e.next}while(e!==i);return Ys(e)}function O0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&q0(o,a)){let l=xp(o,a);o=Ys(o,o.next),l=Ys(l,l.next),Ro(o,t,e,n,s,r,0),Ro(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function B0(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=pp(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(X0(c))}s.sort(z0);for(let r=0;r<s.length;r++)e=k0(s[r],e);return e}function z0(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function k0(i,t){const e=G0(i,t);if(!e)return t;const n=xp(e,i);return Ys(n,n.next),Ys(e,e.next)}function G0(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Hr(i,e))return e;do{if(Hr(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const h=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=n&&h>r&&(r=h,o=e.x<e.next.x?e:e.next,h===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&mp(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const h=Math.abs(s-e.y)/(n-e.x);Po(e,i)&&(h<u||h===u&&(e.x>o.x||e.x===o.x&&H0(o,e)))&&(o=e,u=h)}e=e.next}while(e!==a);return o}function H0(i,t){return Ue(i.prev,i,t.prev)<0&&Ue(t.next,i,i.next)<0}function V0(i,t,e,n){let s=i;do s.z===0&&(s.z=Ah(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,W0(s)}function W0(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function Ah(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function X0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function mp(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function go(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&mp(i,t,e,n,s,r,o,a)}function q0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Y0(i,t)&&(Po(i,t)&&Po(t,i)&&$0(i,t)&&(Ue(i.prev,i,t.prev)||Ue(i,t.prev,t))||Hr(i,t)&&Ue(i.prev,i,i.next)>0&&Ue(t.prev,t,t.next)>0)}function Ue(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Hr(i,t){return i.x===t.x&&i.y===t.y}function gp(i,t,e,n){const s=za(Ue(i,t,e)),r=za(Ue(i,t,n)),o=za(Ue(e,n,i)),a=za(Ue(e,n,t));return!!(s!==r&&o!==a||s===0&&Ba(i,e,t)||r===0&&Ba(i,n,t)||o===0&&Ba(e,i,n)||a===0&&Ba(e,t,n))}function Ba(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function za(i){return i>0?1:i<0?-1:0}function Y0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&gp(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Po(i,t){return Ue(i.prev,i,i.next)<0?Ue(i,t,i.next)>=0&&Ue(i,i.prev,t)>=0:Ue(i,t,i.prev)<0||Ue(i,i.next,t)<0}function $0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function xp(i,t){const e=Ch(i.i,i.x,i.y),n=Ch(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Td(i,t,e,n){const s=Ch(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Lo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ch(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function j0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Z0{static triangulate(t,e,n=2){return D0(t,e,n)}}class Xi{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Xi.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Ad(t),Cd(n,t);let o=t.length;e.forEach(Ad);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Cd(n,e[l]);const a=Z0.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function Ad(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Cd(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class pl extends _e{constructor(t=new Gr([new vt(.5,.5),new vt(-.5,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Le(s,3)),this.setAttribute("uv",new Le(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:K0;let M,_=!1,C,w,P,D;m&&(M=m.getSpacedPoints(u),_=!0,d=!1,C=m.computeFrenetFrames(u,!1),w=new H,P=new H,D=new H),d||(g=0,f=0,p=0,x=0);const E=a.extractPoints(c);let v=E.shape;const R=E.holes;if(!Xi.isClockWise(v)){v=v.reverse();for(let F=0,U=R.length;F<U;F++){const I=R[F];Xi.isClockWise(I)&&(R[F]=I.reverse())}}function L(F){const I=10000000000000001e-36;let V=F[0];for(let tt=1;tt<=F.length;tt++){const K=tt%F.length,it=F[K],_t=it.x-V.x,et=it.y-V.y,A=_t*_t+et*et,S=Math.max(Math.abs(it.x),Math.abs(it.y),Math.abs(V.x),Math.abs(V.y)),G=I*S*S;if(A<=G){F.splice(K,1),tt--;continue}V=it}}L(v),R.forEach(L);const k=R.length,B=v;for(let F=0;F<k;F++){const U=R[F];v=v.concat(U)}function z(F,U,I){return U||console.error("THREE.ExtrudeGeometry: vec does not exist"),F.clone().addScaledVector(U,I)}const j=v.length;function X(F,U,I){let V,tt,K;const it=F.x-U.x,_t=F.y-U.y,et=I.x-F.x,A=I.y-F.y,S=it*it+_t*_t,G=it*A-_t*et;if(Math.abs(G)>Number.EPSILON){const $=Math.sqrt(S),at=Math.sqrt(et*et+A*A),Z=U.x-_t/$,bt=U.y+it/$,dt=I.x-A/at,At=I.y+et/at,Ut=((dt-Z)*A-(At-bt)*et)/(it*A-_t*et);V=Z+it*Ut-F.x,tt=bt+_t*Ut-F.y;const ft=V*V+tt*tt;if(ft<=2)return new vt(V,tt);K=Math.sqrt(ft/2)}else{let $=!1;it>Number.EPSILON?et>Number.EPSILON&&($=!0):it<-Number.EPSILON?et<-Number.EPSILON&&($=!0):Math.sign(_t)===Math.sign(A)&&($=!0),$?(V=-_t,tt=it,K=Math.sqrt(S)):(V=it,tt=_t,K=Math.sqrt(S/2))}return new vt(V/K,tt/K)}const rt=[];for(let F=0,U=B.length,I=U-1,V=F+1;F<U;F++,I++,V++)I===U&&(I=0),V===U&&(V=0),rt[F]=X(B[F],B[I],B[V]);const gt=[];let ht,ut=rt.concat();for(let F=0,U=k;F<U;F++){const I=R[F];ht=[];for(let V=0,tt=I.length,K=tt-1,it=V+1;V<tt;V++,K++,it++)K===tt&&(K=0),it===tt&&(it=0),ht[V]=X(I[V],I[K],I[it]);gt.push(ht),ut=ut.concat(ht)}let Gt;if(g===0)Gt=Xi.triangulateShape(B,R);else{const F=[],U=[];for(let I=0;I<g;I++){const V=I/g,tt=f*Math.cos(V*Math.PI/2),K=p*Math.sin(V*Math.PI/2)+x;for(let it=0,_t=B.length;it<_t;it++){const et=z(B[it],rt[it],K);Ot(et.x,et.y,-tt),V===0&&F.push(et)}for(let it=0,_t=k;it<_t;it++){const et=R[it];ht=gt[it];const A=[];for(let S=0,G=et.length;S<G;S++){const $=z(et[S],ht[S],K);Ot($.x,$.y,-tt),V===0&&A.push($)}V===0&&U.push(A)}}Gt=Xi.triangulateShape(F,U)}const oe=Gt.length,Zt=p+x;for(let F=0;F<j;F++){const U=d?z(v[F],ut[F],Zt):v[F];_?(P.copy(C.normals[0]).multiplyScalar(U.x),w.copy(C.binormals[0]).multiplyScalar(U.y),D.copy(M[0]).add(P).add(w),Ot(D.x,D.y,D.z)):Ot(U.x,U.y,0)}for(let F=1;F<=u;F++)for(let U=0;U<j;U++){const I=d?z(v[U],ut[U],Zt):v[U];_?(P.copy(C.normals[F]).multiplyScalar(I.x),w.copy(C.binormals[F]).multiplyScalar(I.y),D.copy(M[F]).add(P).add(w),Ot(D.x,D.y,D.z)):Ot(I.x,I.y,h/u*F)}for(let F=g-1;F>=0;F--){const U=F/g,I=f*Math.cos(U*Math.PI/2),V=p*Math.sin(U*Math.PI/2)+x;for(let tt=0,K=B.length;tt<K;tt++){const it=z(B[tt],rt[tt],V);Ot(it.x,it.y,h+I)}for(let tt=0,K=R.length;tt<K;tt++){const it=R[tt];ht=gt[tt];for(let _t=0,et=it.length;_t<et;_t++){const A=z(it[_t],ht[_t],V);_?Ot(A.x,A.y+M[u-1].y,M[u-1].x+I):Ot(A.x,A.y,h+I)}}}st(),ot();function st(){const F=s.length/3;if(d){let U=0,I=j*U;for(let V=0;V<oe;V++){const tt=Gt[V];Dt(tt[2]+I,tt[1]+I,tt[0]+I)}U=u+g*2,I=j*U;for(let V=0;V<oe;V++){const tt=Gt[V];Dt(tt[0]+I,tt[1]+I,tt[2]+I)}}else{for(let U=0;U<oe;U++){const I=Gt[U];Dt(I[2],I[1],I[0])}for(let U=0;U<oe;U++){const I=Gt[U];Dt(I[0]+j*u,I[1]+j*u,I[2]+j*u)}}n.addGroup(F,s.length/3-F,0)}function ot(){const F=s.length/3;let U=0;Ct(B,U),U+=B.length;for(let I=0,V=R.length;I<V;I++){const tt=R[I];Ct(tt,U),U+=tt.length}n.addGroup(F,s.length/3-F,1)}function Ct(F,U){let I=F.length;for(;--I>=0;){const V=I;let tt=I-1;tt<0&&(tt=F.length-1);for(let K=0,it=u+g*2;K<it;K++){const _t=j*K,et=j*(K+1),A=U+V+_t,S=U+tt+_t,G=U+tt+et,$=U+V+et;te(A,S,G,$)}}}function Ot(F,U,I){l.push(F),l.push(U),l.push(I)}function Dt(F,U,I){me(F),me(U),me(I);const V=s.length/3,tt=y.generateTopUV(n,s,V-3,V-2,V-1);O(tt[0]),O(tt[1]),O(tt[2])}function te(F,U,I,V){me(F),me(U),me(V),me(U),me(I),me(V);const tt=s.length/3,K=y.generateSideWallUV(n,s,tt-6,tt-3,tt-2,tt-1);O(K[0]),O(K[1]),O(K[3]),O(K[1]),O(K[2]),O(K[3])}function me(F){s.push(l[F*3+0]),s.push(l[F*3+1]),s.push(l[F*3+2])}function O(F){r.push(F.x),r.push(F.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return J0(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Th[s.type]().fromJSON(s)),new pl(n,t.options)}}const K0={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],u=t[s*3+1];return[new vt(r,o),new vt(a,l),new vt(c,u)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],h=t[n*3+2],d=t[s*3],f=t[s*3+1],p=t[s*3+2],x=t[r*3],g=t[r*3+1],m=t[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new vt(o,1-l),new vt(c,1-h),new vt(d,1-p),new vt(x,1-m)]:[new vt(a,1-l),new vt(u,1-h),new vt(f,1-p),new vt(g,1-m)]}};function J0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ys extends _e{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,d=e/l,f=[],p=[],x=[],g=[];for(let m=0;m<u;m++){const y=m*d-o;for(let M=0;M<c;M++){const _=M*h-r;p.push(_,-y,0),x.push(0,0,1),g.push(M/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<a;y++){const M=y+c*m,_=y+c*(m+1),C=y+1+c*(m+1),w=y+1+c*m;f.push(M,_,w),f.push(_,C,w)}this.setIndex(f),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(x,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ys(t.width,t.height,t.widthSegments,t.heightSegments)}}class Zo extends _e{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],u=[];let h=t;const d=(e-t)/s,f=new H,p=new vt;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){const m=r+g/n*o;f.x=h*Math.cos(m),f.y=h*Math.sin(m),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,u.push(p.x,p.y)}h+=d}for(let x=0;x<s;x++){const g=x*(n+1);for(let m=0;m<n;m++){const y=m+g,M=y,_=y+n+1,C=y+n+2,w=y+1;a.push(M,_,w),a.push(_,C,w)}}this.setIndex(a),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zo(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ml extends _e{constructor(t=new Gr([new vt(0,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let u=0;u<t.length;u++)c(t[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(o,2));function c(u){const h=s.length/3,d=u.extractPoints(e);let f=d.shape;const p=d.holes;Xi.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,m=p.length;g<m;g++){const y=p[g];Xi.isClockWise(y)===!0&&(p[g]=y.reverse())}const x=Xi.triangulateShape(f,p);for(let g=0,m=p.length;g<m;g++){const y=p[g];f=f.concat(y)}for(let g=0,m=f.length;g<m;g++){const y=f[g];s.push(y.x,y.y,0),r.push(0,0,1),o.push(y.x,y.y)}for(let g=0,m=x.length;g<m;g++){const y=x[g],M=y[0]+h,_=y[1]+h,C=y[2]+h;n.push(M,_,C),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Q0(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new ml(n,t.curveSegments)}}function Q0(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Js extends _e{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new H,d=new H,f=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){const y=[],M=m/n;let _=0;m===0&&o===0?_=.5/e:m===n&&l===Math.PI&&(_=-.5/e);for(let C=0;C<=e;C++){const w=C/e;h.x=-t*Math.cos(s+w*r)*Math.sin(o+M*a),h.y=t*Math.cos(o+M*a),h.z=t*Math.sin(s+w*r)*Math.sin(o+M*a),p.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),g.push(w+_,1-M),y.push(c++)}u.push(y)}for(let m=0;m<n;m++)for(let y=0;y<e;y++){const M=u[m][y+1],_=u[m][y],C=u[m+1][y],w=u[m+1][y+1];(m!==0||o>0)&&f.push(M,_,w),(m!==n-1||l<Math.PI)&&f.push(_,C,w)}this.setIndex(f),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(x,3)),this.setAttribute("uv",new Le(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Js(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class tx extends bs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jf,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ex extends bs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class nx extends bs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Ko extends dn{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class vp extends on{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new se(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const gc=new Ee,Rd=new H,Pd=new H;class ix{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.mapType=wi,this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jh,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Rd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Rd),Pd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Pd),e.updateMatrixWorld(),gc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(gc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ld=new Ee,lo=new H,xc=new H;class sx extends ix{constructor(){super(new Gn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new vt(4,2),this._viewportCount=6,this._viewports=[new ye(2,1,1,1),new ye(0,1,1,1),new ye(3,1,1,1),new ye(1,1,1,1),new ye(3,0,1,1),new ye(1,0,1,1)],this._cubeDirections=[new H(1,0,0),new H(-1,0,0),new H(0,0,1),new H(0,0,-1),new H(0,1,0),new H(0,-1,0)],this._cubeUps=[new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,0,1),new H(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),lo.setFromMatrixPosition(t.matrixWorld),n.position.copy(lo),xc.copy(n.position),xc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(xc),n.updateMatrixWorld(),s.makeTranslation(-lo.x,-lo.y,-lo.z),Ld.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ld,n.coordinateSystem,n.reversedDepth)}}class wl extends vp{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new sx}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class yp extends sp{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class rx extends vp{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class ox extends Gn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Id(i,t,e,n){const s=ax(n);switch(e){case Xf:return i*t;case Yf:return i*t/s.components*s.byteLength;case qh:return i*t/s.components*s.byteLength;case $f:return i*t*2/s.components*s.byteLength;case Yh:return i*t*2/s.components*s.byteLength;case qf:return i*t*3/s.components*s.byteLength;case ni:return i*t*4/s.components*s.byteLength;case $h:return i*t*4/s.components*s.byteLength;case Ka:case Ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Qa:case tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Kc:case Qc:return Math.max(i,16)*Math.max(t,8)/4;case Zc:case Jc:return Math.max(i,8)*Math.max(t,8)/2;case th:case eh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case nh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ih:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case sh:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case rh:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case oh:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ah:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case lh:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ch:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case hh:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case uh:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case dh:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case fh:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ph:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case mh:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case gh:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case xh:case vh:case yh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case _h:case Mh:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Sh:case bh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ax(i){switch(i){case wi:case Gf:return{byteLength:1,components:1};case bo:case Hf:case Xo:return{byteLength:2,components:1};case Wh:case Xh:return{byteLength:2,components:4};case Xs:case Vh:case Wi:return{byteLength:4,components:1};case Vf:case Wf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hh);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function _p(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lx(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],x=h[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const x=h[f];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var cx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hx=`#ifdef USE_ALPHAHASH
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
#endif`,ux=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,px=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mx=`#ifdef USE_AOMAP
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
#endif`,gx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xx=`#ifdef USE_BATCHING
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
#endif`,vx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_x=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sx=`#ifdef USE_IRIDESCENCE
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
#endif`,bx=`#ifdef USE_BUMPMAP
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
#endif`,wx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ax=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Px=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Lx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ix=`#define PI 3.141592653589793
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
} // validated`,Dx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Nx=`vec3 transformedNormal = objectNormal;
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
#endif`,Ux=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ox=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zx="gl_FragColor = linearToOutputTexel( gl_FragColor );",kx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gx=`#ifdef USE_ENVMAP
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
#endif`,Hx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vx=`#ifdef USE_ENVMAP
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
#endif`,Wx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xx=`#ifdef USE_ENVMAP
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
#endif`,qx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$x=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zx=`#ifdef USE_GRADIENTMAP
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
}`,Kx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tv=`uniform bool receiveShadow;
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
#endif`,ev=`#ifdef USE_ENVMAP
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
#endif`,nv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,iv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ov=`PhysicalMaterial material;
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
#endif`,av=`struct PhysicalMaterial {
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
}`,lv=`
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
#endif`,cv=`#if defined( RE_IndirectDiffuse )
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
#endif`,hv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vv=`#if defined( USE_POINTS_UV )
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
#endif`,yv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_v=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wv=`#ifdef USE_MORPHTARGETS
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
#endif`,Ev=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Av=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lv=`#ifdef USE_NORMALMAP
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
#endif`,Iv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ov=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Yv=`float getShadowMask() {
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
}`,$v=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jv=`#ifdef USE_SKINNING
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
#endif`,Zv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kv=`#ifdef USE_SKINNING
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
#endif`,Jv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ty=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ey=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ny=`#ifdef USE_TRANSMISSION
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
#endif`,iy=`#ifdef USE_TRANSMISSION
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
#endif`,sy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ry=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ay=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ly=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cy=`uniform sampler2D t2D;
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
}`,hy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,dy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,py=`#include <common>
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
}`,my=`#if DEPTH_PACKING == 3200
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
}`,gy=`#define DISTANCE
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
}`,xy=`#define DISTANCE
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
}`,vy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_y=`uniform float scale;
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
}`,My=`uniform vec3 diffuse;
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
}`,Sy=`#include <common>
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
}`,by=`uniform vec3 diffuse;
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
}`,wy=`#define LAMBERT
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
}`,Ey=`#define LAMBERT
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
}`,Ty=`#define MATCAP
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
}`,Ay=`#define MATCAP
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
}`,Cy=`#define NORMAL
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
}`,Ry=`#define NORMAL
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
}`,Py=`#define PHONG
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
}`,Ly=`#define PHONG
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
}`,Iy=`#define STANDARD
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
}`,Dy=`#define STANDARD
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
}`,Ny=`#define TOON
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
}`,Uy=`#define TOON
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
}`,Fy=`uniform float size;
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
}`,Oy=`uniform vec3 diffuse;
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
}`,By=`#include <common>
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
}`,zy=`uniform vec3 color;
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
}`,ky=`uniform float rotation;
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
}`,Gy=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:cx,alphahash_pars_fragment:hx,alphamap_fragment:ux,alphamap_pars_fragment:dx,alphatest_fragment:fx,alphatest_pars_fragment:px,aomap_fragment:mx,aomap_pars_fragment:gx,batching_pars_vertex:xx,batching_vertex:vx,begin_vertex:yx,beginnormal_vertex:_x,bsdfs:Mx,iridescence_fragment:Sx,bumpmap_pars_fragment:bx,clipping_planes_fragment:wx,clipping_planes_pars_fragment:Ex,clipping_planes_pars_vertex:Tx,clipping_planes_vertex:Ax,color_fragment:Cx,color_pars_fragment:Rx,color_pars_vertex:Px,color_vertex:Lx,common:Ix,cube_uv_reflection_fragment:Dx,defaultnormal_vertex:Nx,displacementmap_pars_vertex:Ux,displacementmap_vertex:Fx,emissivemap_fragment:Ox,emissivemap_pars_fragment:Bx,colorspace_fragment:zx,colorspace_pars_fragment:kx,envmap_fragment:Gx,envmap_common_pars_fragment:Hx,envmap_pars_fragment:Vx,envmap_pars_vertex:Wx,envmap_physical_pars_fragment:ev,envmap_vertex:Xx,fog_vertex:qx,fog_pars_vertex:Yx,fog_fragment:$x,fog_pars_fragment:jx,gradientmap_pars_fragment:Zx,lightmap_pars_fragment:Kx,lights_lambert_fragment:Jx,lights_lambert_pars_fragment:Qx,lights_pars_begin:tv,lights_toon_fragment:nv,lights_toon_pars_fragment:iv,lights_phong_fragment:sv,lights_phong_pars_fragment:rv,lights_physical_fragment:ov,lights_physical_pars_fragment:av,lights_fragment_begin:lv,lights_fragment_maps:cv,lights_fragment_end:hv,logdepthbuf_fragment:uv,logdepthbuf_pars_fragment:dv,logdepthbuf_pars_vertex:fv,logdepthbuf_vertex:pv,map_fragment:mv,map_pars_fragment:gv,map_particle_fragment:xv,map_particle_pars_fragment:vv,metalnessmap_fragment:yv,metalnessmap_pars_fragment:_v,morphinstance_vertex:Mv,morphcolor_vertex:Sv,morphnormal_vertex:bv,morphtarget_pars_vertex:wv,morphtarget_vertex:Ev,normal_fragment_begin:Tv,normal_fragment_maps:Av,normal_pars_fragment:Cv,normal_pars_vertex:Rv,normal_vertex:Pv,normalmap_pars_fragment:Lv,clearcoat_normal_fragment_begin:Iv,clearcoat_normal_fragment_maps:Dv,clearcoat_pars_fragment:Nv,iridescence_pars_fragment:Uv,opaque_fragment:Fv,packing:Ov,premultiplied_alpha_fragment:Bv,project_vertex:zv,dithering_fragment:kv,dithering_pars_fragment:Gv,roughnessmap_fragment:Hv,roughnessmap_pars_fragment:Vv,shadowmap_pars_fragment:Wv,shadowmap_pars_vertex:Xv,shadowmap_vertex:qv,shadowmask_pars_fragment:Yv,skinbase_vertex:$v,skinning_pars_vertex:jv,skinning_vertex:Zv,skinnormal_vertex:Kv,specularmap_fragment:Jv,specularmap_pars_fragment:Qv,tonemapping_fragment:ty,tonemapping_pars_fragment:ey,transmission_fragment:ny,transmission_pars_fragment:iy,uv_pars_fragment:sy,uv_pars_vertex:ry,uv_vertex:oy,worldpos_vertex:ay,background_vert:ly,background_frag:cy,backgroundCube_vert:hy,backgroundCube_frag:uy,cube_vert:dy,cube_frag:fy,depth_vert:py,depth_frag:my,distanceRGBA_vert:gy,distanceRGBA_frag:xy,equirect_vert:vy,equirect_frag:yy,linedashed_vert:_y,linedashed_frag:My,meshbasic_vert:Sy,meshbasic_frag:by,meshlambert_vert:wy,meshlambert_frag:Ey,meshmatcap_vert:Ty,meshmatcap_frag:Ay,meshnormal_vert:Cy,meshnormal_frag:Ry,meshphong_vert:Py,meshphong_frag:Ly,meshphysical_vert:Iy,meshphysical_frag:Dy,meshtoon_vert:Ny,meshtoon_frag:Uy,points_vert:Fy,points_frag:Oy,shadow_vert:By,shadow_frag:zy,sprite_vert:ky,sprite_frag:Gy},St={common:{diffuse:{value:new se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new se(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},vi={basic:{uniforms:mn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:mn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new se(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:mn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new se(0)},specular:{value:new se(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:mn([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:mn([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new se(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:mn([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:mn([St.points,St.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:mn([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:mn([St.common,St.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:mn([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:mn([St.sprite,St.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:mn([St.common,St.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:mn([St.lights,St.fog,{color:{value:new se(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};vi.physical={uniforms:mn([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new se(0)},specularColor:{value:new se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ka={r:0,b:0,g:0},Ls=new Ti,Hy=new Ee;function Vy(i,t,e,n,s,r,o){const a=new se(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function p(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function x(M){let _=!1;const C=p(M);C===null?m(a,l):C&&C.isColor&&(m(C,1),_=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){const C=p(_);C&&(C.isCubeTexture||C.mapping===Sl)?(u===void 0&&(u=new pe(new Ks(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:kr(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Ls.copy(_.backgroundRotation),Ls.x*=-1,Ls.y*=-1,Ls.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Ls.y*=-1,Ls.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Hy.makeRotationFromEuler(Ls)),u.material.toneMapped=de.getTransfer(C.colorSpace)!==Se,(h!==C||d!==C.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new pe(new ys(2,2),new Yn({name:"BackgroundMaterial",uniforms:kr(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:vs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=de.getTransfer(C.colorSpace)!==Se,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,_){M.getRGB(ka,ip(i)),n.buffers.color.setClear(ka.r,ka.g,ka.b,_,o)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),l=_,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,m(a,l)},render:x,addToRenderList:g,dispose:y}}function Wy(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(v,R,N,L,k){let B=!1;const z=h(L,N,R);r!==z&&(r=z,c(r.object)),B=f(v,L,N,k),B&&p(v,L,N,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,_(v,R,N,L),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function u(v){return i.deleteVertexArray(v)}function h(v,R,N){const L=N.wireframe===!0;let k=n[v.id];k===void 0&&(k={},n[v.id]=k);let B=k[R.id];B===void 0&&(B={},k[R.id]=B);let z=B[L];return z===void 0&&(z=d(l()),B[L]=z),z}function d(v){const R=[],N=[],L=[];for(let k=0;k<e;k++)R[k]=0,N[k]=0,L[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:N,attributeDivisors:L,object:v,attributes:{},index:null}}function f(v,R,N,L){const k=r.attributes,B=R.attributes;let z=0;const j=N.getAttributes();for(const X in j)if(j[X].location>=0){const gt=k[X];let ht=B[X];if(ht===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(ht=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(ht=v.instanceColor)),gt===void 0||gt.attribute!==ht||ht&&gt.data!==ht.data)return!0;z++}return r.attributesNum!==z||r.index!==L}function p(v,R,N,L){const k={},B=R.attributes;let z=0;const j=N.getAttributes();for(const X in j)if(j[X].location>=0){let gt=B[X];gt===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(gt=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(gt=v.instanceColor));const ht={};ht.attribute=gt,gt&&gt.data&&(ht.data=gt.data),k[X]=ht,z++}r.attributes=k,r.attributesNum=z,r.index=L}function x(){const v=r.newAttributes;for(let R=0,N=v.length;R<N;R++)v[R]=0}function g(v){m(v,0)}function m(v,R){const N=r.newAttributes,L=r.enabledAttributes,k=r.attributeDivisors;N[v]=1,L[v]===0&&(i.enableVertexAttribArray(v),L[v]=1),k[v]!==R&&(i.vertexAttribDivisor(v,R),k[v]=R)}function y(){const v=r.newAttributes,R=r.enabledAttributes;for(let N=0,L=R.length;N<L;N++)R[N]!==v[N]&&(i.disableVertexAttribArray(N),R[N]=0)}function M(v,R,N,L,k,B,z){z===!0?i.vertexAttribIPointer(v,R,N,k,B):i.vertexAttribPointer(v,R,N,L,k,B)}function _(v,R,N,L){x();const k=L.attributes,B=N.getAttributes(),z=R.defaultAttributeValues;for(const j in B){const X=B[j];if(X.location>=0){let rt=k[j];if(rt===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(rt=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(rt=v.instanceColor)),rt!==void 0){const gt=rt.normalized,ht=rt.itemSize,ut=t.get(rt);if(ut===void 0)continue;const Gt=ut.buffer,oe=ut.type,Zt=ut.bytesPerElement,st=oe===i.INT||oe===i.UNSIGNED_INT||rt.gpuType===Vh;if(rt.isInterleavedBufferAttribute){const ot=rt.data,Ct=ot.stride,Ot=rt.offset;if(ot.isInstancedInterleavedBuffer){for(let Dt=0;Dt<X.locationSize;Dt++)m(X.location+Dt,ot.meshPerAttribute);v.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Dt=0;Dt<X.locationSize;Dt++)g(X.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,Gt);for(let Dt=0;Dt<X.locationSize;Dt++)M(X.location+Dt,ht/X.locationSize,oe,gt,Ct*Zt,(Ot+ht/X.locationSize*Dt)*Zt,st)}else{if(rt.isInstancedBufferAttribute){for(let ot=0;ot<X.locationSize;ot++)m(X.location+ot,rt.meshPerAttribute);v.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let ot=0;ot<X.locationSize;ot++)g(X.location+ot);i.bindBuffer(i.ARRAY_BUFFER,Gt);for(let ot=0;ot<X.locationSize;ot++)M(X.location+ot,ht/X.locationSize,oe,gt,ht*Zt,ht/X.locationSize*ot*Zt,st)}}else if(z!==void 0){const gt=z[j];if(gt!==void 0)switch(gt.length){case 2:i.vertexAttrib2fv(X.location,gt);break;case 3:i.vertexAttrib3fv(X.location,gt);break;case 4:i.vertexAttrib4fv(X.location,gt);break;default:i.vertexAttrib1fv(X.location,gt)}}}}y()}function C(){D();for(const v in n){const R=n[v];for(const N in R){const L=R[N];for(const k in L)u(L[k].object),delete L[k];delete R[N]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;const R=n[v.id];for(const N in R){const L=R[N];for(const k in L)u(L[k].object),delete L[k];delete R[N]}delete n[v.id]}function P(v){for(const R in n){const N=n[R];if(N[v.id]===void 0)continue;const L=N[v.id];for(const k in L)u(L[k].object),delete L[k];delete N[v.id]}}function D(){E(),o=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:D,resetDefaultState:E,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:g,disableUnusedAttributes:y}}function Xy(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let p=0;p<h;p++)f+=u[p];e.update(f,n,1)}function l(c,u,h,d){if(h===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],u[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let p=0;for(let x=0;x<h;x++)p+=u[x]*d[x];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function qy(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==ni&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){const D=P===Xo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==wi&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Wi&&!D)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:C,maxSamples:w}}function Yy(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Ns,a=new $t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,x=h.clipIntersection,g=h.clipShadows,m=i.get(h);if(!s||p===null||p.length===0||r&&!g)r?u(null):c();else{const y=r?0:n,M=y*4;let _=m.clippingState||null;l.value=_,_=u(p,d,M,f);for(let C=0;C!==M;++C)_[C]=e[C];m.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,p){const x=h!==null?h.length:0;let g=null;if(x!==0){if(g=l.value,p!==!0||g===null){const m=f+x*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,_=f;M!==x;++M,_+=4)o.copy(h[M]).applyMatrix4(y,a),o.normal.toArray(g,_),g[_+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function $y(i){let t=new WeakMap;function e(o,a){return a===qc?o.mapping=Or:a===Yc&&(o.mapping=Br),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===qc||a===Yc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new h0(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ar=4,Dd=[.125,.215,.35,.446,.526,.582],Bs=20,vc=new yp,Nd=new se;let yc=null,_c=0,Mc=0,Sc=!1;const Us=(1+Math.sqrt(5))/2,yr=1/Us,Ud=[new H(-Us,yr,0),new H(Us,yr,0),new H(-yr,0,Us),new H(yr,0,Us),new H(0,Us,-yr),new H(0,Us,yr),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)],jy=new H;class Fd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=jy}=r;yc=this._renderer.getRenderTarget(),_c=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(yc,_c,Mc),this._renderer.xr.enabled=Sc,t.scissorTest=!1,Ga(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Or||t.mapping===Br?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),yc=this._renderer.getRenderTarget(),_c=this._renderer.getActiveCubeFace(),Mc=this._renderer.getActiveMipmapLevel(),Sc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:Xo,format:ni,colorSpace:zr,depthBuffer:!1},s=Od(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Od(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zy(r)),this._blurMaterial=Ky(r,t,e)}return s}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,vc)}_sceneToCubeUV(t,e,n,s,r){const l=new Gn(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Nd),h.toneMapping=gs,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const x=new ke({name:"PMREM.Background",side:wn,depthWrite:!1,depthTest:!1}),g=new pe(new Ks,x);let m=!1;const y=t.background;y?y.isColor&&(x.color.copy(y),t.background=null,m=!0):(x.color.copy(Nd),m=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):_===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));const C=this._cubeSize;Ga(s,_*C,M>2?C:0,C,C),h.setRenderTarget(s),m&&h.render(g,l),h.render(t,l)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Or||t.mapping===Br;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bd());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new pe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Ga(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,vc)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ud[(s-r-1)%Ud.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new pe(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Bs-1),x=r/p,g=isFinite(r)?1+Math.floor(u*x):Bs;g>Bs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Bs}`);const m=[];let y=0;for(let P=0;P<Bs;++P){const D=P/x,E=Math.exp(-D*D/2);m.push(E),P===0?y+=E:P<g&&(y+=2*E)}for(let P=0;P<m.length;P++)m[P]=m[P]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:M}=this;d.dTheta.value=p,d.mipInt.value=M-n;const _=this._sizeLods[s],C=3*_*(s>M-Ar?s-M+Ar:0),w=4*(this._cubeSize-_);Ga(e,C,w,3*_,2*_),l.setRenderTarget(e),l.render(h,vc)}}function Zy(i){const t=[],e=[],n=[];let s=i;const r=i-Ar+1+Dd.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ar?l=Dd[o-i+Ar-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,x=3,g=2,m=1,y=new Float32Array(x*p*f),M=new Float32Array(g*p*f),_=new Float32Array(m*p*f);for(let w=0;w<f;w++){const P=w%3*2/3-1,D=w>2?0:-1,E=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];y.set(E,x*p*w),M.set(d,g*p*w);const v=[w,w,w,w,w,w];_.set(v,m*p*w)}const C=new _e;C.setAttribute("position",new Pe(y,x)),C.setAttribute("uv",new Pe(M,g)),C.setAttribute("faceIndex",new Pe(_,m)),t.push(C),s>Ar&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Od(i,t,e){const n=new qs(i,t,e);return n.texture.mapping=Sl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ga(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ky(i,t,e){const n=new Float32Array(Bs),s=new H(0,1,0);return new Yn({name:"SphericalGaussianBlur",defines:{n:Bs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:eu(),fragmentShader:`

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
		`,blending:ms,depthTest:!1,depthWrite:!1})}function Bd(){return new Yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:eu(),fragmentShader:`

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
		`,blending:ms,depthTest:!1,depthWrite:!1})}function zd(){return new Yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:eu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ms,depthTest:!1,depthWrite:!1})}function eu(){return`

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
	`}function Jy(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===qc||l===Yc,u=l===Or||l===Br;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Fd(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(e===null&&(e=new Fd(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Qy(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Co("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function t_(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const p in d.attributes)t.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let x=0;if(f!==null){const y=f.array;x=f.version;for(let M=0,_=y.length;M<_;M+=3){const C=y[M+0],w=y[M+1],P=y[M+2];d.push(C,w,w,P,P,C)}}else if(p!==void 0){const y=p.array;x=p.version;for(let M=0,_=y.length/3-1;M<_;M+=3){const C=M+0,w=M+1,P=M+2;d.push(C,w,w,P,P,C)}}else return;const g=new(Kf(d)?np:ep)(d,1);g.version=x;const m=r.get(h);m&&t.remove(m),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function e_(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,d*o,p),e.update(f,n,p))}function u(d,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let g=0;for(let m=0;m<p;m++)g+=f[m];e.update(g,n,1)}function h(d,f,p,x){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/o,f[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,p);let m=0;for(let y=0;y<p;y++)m+=f[y]*x[y];e.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function n_(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function i_(i,t,e){const n=new WeakMap,s=new ye;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let v=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var f=v;d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;p===!0&&(_=1),x===!0&&(_=2),g===!0&&(_=3);let C=a.attributes.position.count*_,w=1;C>t.maxTextureSize&&(w=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const P=new Float32Array(C*w*4*h),D=new Jf(P,C,w,h);D.type=Wi,D.needsUpdate=!0;const E=_*4;for(let R=0;R<h;R++){const N=m[R],L=y[R],k=M[R],B=C*w*4*R;for(let z=0;z<N.count;z++){const j=z*E;p===!0&&(s.fromBufferAttribute(N,z),P[B+j+0]=s.x,P[B+j+1]=s.y,P[B+j+2]=s.z,P[B+j+3]=0),x===!0&&(s.fromBufferAttribute(L,z),P[B+j+4]=s.x,P[B+j+5]=s.y,P[B+j+6]=s.z,P[B+j+7]=0),g===!0&&(s.fromBufferAttribute(k,z),P[B+j+8]=s.x,P[B+j+9]=s.y,P[B+j+10]=s.z,P[B+j+11]=k.itemSize===4?s.w:1)}}d={count:h,texture:D,size:new vt(C,w)},n.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const x=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function s_(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const Mp=new un,kd=new lp(1,1),Sp=new Jf,bp=new Yg,wp=new rp,Gd=[],Hd=[],Vd=new Float32Array(16),Wd=new Float32Array(9),Xd=new Float32Array(4);function Zr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Gd[s];if(r===void 0&&(r=new Float32Array(s),Gd[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Qe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function tn(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function El(i,t){let e=Hd[t];e===void 0&&(e=new Int32Array(t),Hd[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function r_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function o_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;i.uniform2fv(this.addr,t),tn(e,t)}}function a_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Qe(e,t))return;i.uniform3fv(this.addr,t),tn(e,t)}}function l_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;i.uniform4fv(this.addr,t),tn(e,t)}}function c_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Qe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,n))return;Xd.set(n),i.uniformMatrix2fv(this.addr,!1,Xd),tn(e,n)}}function h_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Qe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,n))return;Wd.set(n),i.uniformMatrix3fv(this.addr,!1,Wd),tn(e,n)}}function u_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Qe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),tn(e,t)}else{if(Qe(e,n))return;Vd.set(n),i.uniformMatrix4fv(this.addr,!1,Vd),tn(e,n)}}function d_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function f_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;i.uniform2iv(this.addr,t),tn(e,t)}}function p_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Qe(e,t))return;i.uniform3iv(this.addr,t),tn(e,t)}}function m_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;i.uniform4iv(this.addr,t),tn(e,t)}}function g_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function x_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Qe(e,t))return;i.uniform2uiv(this.addr,t),tn(e,t)}}function v_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Qe(e,t))return;i.uniform3uiv(this.addr,t),tn(e,t)}}function y_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Qe(e,t))return;i.uniform4uiv(this.addr,t),tn(e,t)}}function __(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(kd.compareFunction=Zf,r=kd):r=Mp,e.setTexture2D(t||r,s)}function M_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||bp,s)}function S_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||wp,s)}function b_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Sp,s)}function w_(i){switch(i){case 5126:return r_;case 35664:return o_;case 35665:return a_;case 35666:return l_;case 35674:return c_;case 35675:return h_;case 35676:return u_;case 5124:case 35670:return d_;case 35667:case 35671:return f_;case 35668:case 35672:return p_;case 35669:case 35673:return m_;case 5125:return g_;case 36294:return x_;case 36295:return v_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return __;case 35679:case 36299:case 36307:return M_;case 35680:case 36300:case 36308:case 36293:return S_;case 36289:case 36303:case 36311:case 36292:return b_}}function E_(i,t){i.uniform1fv(this.addr,t)}function T_(i,t){const e=Zr(t,this.size,2);i.uniform2fv(this.addr,e)}function A_(i,t){const e=Zr(t,this.size,3);i.uniform3fv(this.addr,e)}function C_(i,t){const e=Zr(t,this.size,4);i.uniform4fv(this.addr,e)}function R_(i,t){const e=Zr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function P_(i,t){const e=Zr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function L_(i,t){const e=Zr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function I_(i,t){i.uniform1iv(this.addr,t)}function D_(i,t){i.uniform2iv(this.addr,t)}function N_(i,t){i.uniform3iv(this.addr,t)}function U_(i,t){i.uniform4iv(this.addr,t)}function F_(i,t){i.uniform1uiv(this.addr,t)}function O_(i,t){i.uniform2uiv(this.addr,t)}function B_(i,t){i.uniform3uiv(this.addr,t)}function z_(i,t){i.uniform4uiv(this.addr,t)}function k_(i,t,e){const n=this.cache,s=t.length,r=El(e,s);Qe(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Mp,r[o])}function G_(i,t,e){const n=this.cache,s=t.length,r=El(e,s);Qe(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||bp,r[o])}function H_(i,t,e){const n=this.cache,s=t.length,r=El(e,s);Qe(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||wp,r[o])}function V_(i,t,e){const n=this.cache,s=t.length,r=El(e,s);Qe(n,r)||(i.uniform1iv(this.addr,r),tn(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Sp,r[o])}function W_(i){switch(i){case 5126:return E_;case 35664:return T_;case 35665:return A_;case 35666:return C_;case 35674:return R_;case 35675:return P_;case 35676:return L_;case 5124:case 35670:return I_;case 35667:case 35671:return D_;case 35668:case 35672:return N_;case 35669:case 35673:return U_;case 5125:return F_;case 36294:return O_;case 36295:return B_;case 36296:return z_;case 35678:case 36198:case 36298:case 36306:case 35682:return k_;case 35679:case 36299:case 36307:return G_;case 35680:case 36300:case 36308:case 36293:return H_;case 36289:case 36303:case 36311:case 36292:return V_}}class X_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=w_(e.type)}}class q_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=W_(e.type)}}class Y_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const bc=/(\w+)(\])?(\[|\.)?/g;function qd(i,t){i.seq.push(t),i.map[t.id]=t}function $_(i,t,e){const n=i.name,s=n.length;for(bc.lastIndex=0;;){const r=bc.exec(n),o=bc.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){qd(e,c===void 0?new X_(a,i,t):new q_(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Y_(a),qd(e,h)),e=h}}}class el{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);$_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Yd(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const j_=37297;let Z_=0;function K_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const $d=new $t;function J_(i){de._getMatrix($d,de.workingColorSpace,i);const t=`mat3( ${$d.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case ll:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function jd(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+K_(i.getShaderSource(t),a)}else return r}function Q_(i,t){const e=J_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function tM(i,t){let e;switch(t){case og:e="Linear";break;case ag:e="Reinhard";break;case lg:e="Cineon";break;case zf:e="ACESFilmic";break;case hg:e="AgX";break;case ug:e="Neutral";break;case cg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ha=new H;function eM(){de.getLuminanceCoefficients(Ha);const i=Ha.x.toFixed(4),t=Ha.y.toFixed(4),e=Ha.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function nM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xo).join(`
`)}function iM(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function sM(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function xo(i){return i!==""}function Zd(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Kd(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const rM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Rh(i){return i.replace(rM,aM)}const oM=new Map;function aM(i,t){let e=Kt[t];if(e===void 0){const n=oM.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Rh(e)}const lM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jd(i){return i.replace(lM,cM)}function cM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qd(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function hM(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ff?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Of?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hi&&(t="SHADOWMAP_TYPE_VSM"),t}function uM(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Or:case Br:t="ENVMAP_TYPE_CUBE";break;case Sl:t="ENVMAP_TYPE_CUBE_UV";break}return t}function dM(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Br:t="ENVMAP_MODE_REFRACTION";break}return t}function fM(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Bf:t="ENVMAP_BLENDING_MULTIPLY";break;case sg:t="ENVMAP_BLENDING_MIX";break;case rg:t="ENVMAP_BLENDING_ADD";break}return t}function pM(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function mM(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=hM(e),c=uM(e),u=dM(e),h=fM(e),d=pM(e),f=nM(e),p=iM(r),x=s.createProgram();let g,m,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xo).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xo).join(`
`),m.length>0&&(m+=`
`)):(g=[Qd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xo).join(`
`),m=[Qd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gs?"#define TONE_MAPPING":"",e.toneMapping!==gs?Kt.tonemapping_pars_fragment:"",e.toneMapping!==gs?tM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,Q_("linearToOutputTexel",e.outputColorSpace),eM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xo).join(`
`)),o=Rh(o),o=Zd(o,e),o=Kd(o,e),a=Rh(a),a=Zd(a,e),a=Kd(a,e),o=Jd(o),a=Jd(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Ku?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ku?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=y+g+o,_=y+m+a,C=Yd(s,s.VERTEX_SHADER,M),w=Yd(s,s.FRAGMENT_SHADER,_);s.attachShader(x,C),s.attachShader(x,w),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function P(R){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(x)||"",L=s.getShaderInfoLog(C)||"",k=s.getShaderInfoLog(w)||"",B=N.trim(),z=L.trim(),j=k.trim();let X=!0,rt=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,w);else{const gt=jd(s,C,"vertex"),ht=jd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+B+`
`+gt+`
`+ht)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||j==="")&&(rt=!1);rt&&(R.diagnostics={runnable:X,programLog:B,vertexShader:{log:z,prefix:g},fragmentShader:{log:j,prefix:m}})}s.deleteShader(C),s.deleteShader(w),D=new el(s,x),E=sM(s,x)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let E;this.getAttributes=function(){return E===void 0&&P(this),E};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(x,j_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Z_++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=w,this}let gM=0;class xM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new vM(t),e.set(t,n)),n}}class vM{constructor(t){this.id=gM++,this.code=t,this.usedTimes=0}}function yM(i,t,e,n,s,r,o){const a=new Qf,l=new xM,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return c.add(E),E===0?"uv":`uv${E}`}function g(E,v,R,N,L){const k=N.fog,B=L.geometry,z=E.isMeshStandardMaterial?N.environment:null,j=(E.isMeshStandardMaterial?e:t).get(E.envMap||z),X=j&&j.mapping===Sl?j.image.height:null,rt=p[E.type];E.precision!==null&&(f=s.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const gt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ht=gt!==void 0?gt.length:0;let ut=0;B.morphAttributes.position!==void 0&&(ut=1),B.morphAttributes.normal!==void 0&&(ut=2),B.morphAttributes.color!==void 0&&(ut=3);let Gt,oe,Zt,st;if(rt){const ge=vi[rt];Gt=ge.vertexShader,oe=ge.fragmentShader}else Gt=E.vertexShader,oe=E.fragmentShader,l.update(E),Zt=l.getVertexShaderID(E),st=l.getFragmentShaderID(E);const ot=i.getRenderTarget(),Ct=i.state.buffers.depth.getReversed(),Ot=L.isInstancedMesh===!0,Dt=L.isBatchedMesh===!0,te=!!E.map,me=!!E.matcap,O=!!j,F=!!E.aoMap,U=!!E.lightMap,I=!!E.bumpMap,V=!!E.normalMap,tt=!!E.displacementMap,K=!!E.emissiveMap,it=!!E.metalnessMap,_t=!!E.roughnessMap,et=E.anisotropy>0,A=E.clearcoat>0,S=E.dispersion>0,G=E.iridescence>0,$=E.sheen>0,at=E.transmission>0,Z=et&&!!E.anisotropyMap,bt=A&&!!E.clearcoatMap,dt=A&&!!E.clearcoatNormalMap,At=A&&!!E.clearcoatRoughnessMap,Ut=G&&!!E.iridescenceMap,ft=G&&!!E.iridescenceThicknessMap,Tt=$&&!!E.sheenColorMap,Wt=$&&!!E.sheenRoughnessMap,Bt=!!E.specularMap,wt=!!E.specularColorMap,Yt=!!E.specularIntensityMap,W=at&&!!E.transmissionMap,yt=at&&!!E.thicknessMap,Mt=!!E.gradientMap,It=!!E.alphaMap,pt=E.alphaTest>0,lt=!!E.alphaHash,Ft=!!E.extensions;let qt=gs;E.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(qt=i.toneMapping);const we={shaderID:rt,shaderType:E.type,shaderName:E.name,vertexShader:Gt,fragmentShader:oe,defines:E.defines,customVertexShaderID:Zt,customFragmentShaderID:st,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Dt,batchingColor:Dt&&L._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&L.instanceColor!==null,instancingMorph:Ot&&L.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:zr,alphaToCoverage:!!E.alphaToCoverage,map:te,matcap:me,envMap:O,envMapMode:O&&j.mapping,envMapCubeUVHeight:X,aoMap:F,lightMap:U,bumpMap:I,normalMap:V,displacementMap:d&&tt,emissiveMap:K,normalMapObjectSpace:V&&E.normalMapType===mg,normalMapTangentSpace:V&&E.normalMapType===jf,metalnessMap:it,roughnessMap:_t,anisotropy:et,anisotropyMap:Z,clearcoat:A,clearcoatMap:bt,clearcoatNormalMap:dt,clearcoatRoughnessMap:At,dispersion:S,iridescence:G,iridescenceMap:Ut,iridescenceThicknessMap:ft,sheen:$,sheenColorMap:Tt,sheenRoughnessMap:Wt,specularMap:Bt,specularColorMap:wt,specularIntensityMap:Yt,transmission:at,transmissionMap:W,thicknessMap:yt,gradientMap:Mt,opaque:E.transparent===!1&&E.blending===Pr&&E.alphaToCoverage===!1,alphaMap:It,alphaTest:pt,alphaHash:lt,combine:E.combine,mapUv:te&&x(E.map.channel),aoMapUv:F&&x(E.aoMap.channel),lightMapUv:U&&x(E.lightMap.channel),bumpMapUv:I&&x(E.bumpMap.channel),normalMapUv:V&&x(E.normalMap.channel),displacementMapUv:tt&&x(E.displacementMap.channel),emissiveMapUv:K&&x(E.emissiveMap.channel),metalnessMapUv:it&&x(E.metalnessMap.channel),roughnessMapUv:_t&&x(E.roughnessMap.channel),anisotropyMapUv:Z&&x(E.anisotropyMap.channel),clearcoatMapUv:bt&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:dt&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:Wt&&x(E.sheenRoughnessMap.channel),specularMapUv:Bt&&x(E.specularMap.channel),specularColorMapUv:wt&&x(E.specularColorMap.channel),specularIntensityMapUv:Yt&&x(E.specularIntensityMap.channel),transmissionMapUv:W&&x(E.transmissionMap.channel),thicknessMapUv:yt&&x(E.thicknessMap.channel),alphaMapUv:It&&x(E.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(V||et),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!B.attributes.uv&&(te||It),fog:!!k,useFog:E.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ct,skinning:L.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:ut,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:qt,decodeVideoTexture:te&&E.map.isVideoTexture===!0&&de.getTransfer(E.map.colorSpace)===Se,decodeVideoTextureEmissive:K&&E.emissiveMap.isVideoTexture===!0&&de.getTransfer(E.emissiveMap.colorSpace)===Se,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Pn,flipSided:E.side===wn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ft&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&E.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function m(E){const v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(const R in E.defines)v.push(R),v.push(E.defines[R]);return E.isRawShaderMaterial===!1&&(y(v,E),M(v,E),v.push(i.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function y(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function M(E,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),E.push(a.mask)}function _(E){const v=p[E.type];let R;if(v){const N=vi[v];R=o0.clone(N.uniforms)}else R=E.uniforms;return R}function C(E,v){let R;for(let N=0,L=u.length;N<L;N++){const k=u[N];if(k.cacheKey===v){R=k,++R.usedTimes;break}}return R===void 0&&(R=new mM(i,v,E,r),u.push(R)),R}function w(E){if(--E.usedTimes===0){const v=u.indexOf(E);u[v]=u[u.length-1],u.pop(),E.destroy()}}function P(E){l.remove(E)}function D(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:_,acquireProgram:C,releaseProgram:w,releaseShaderCache:P,programs:u,dispose:D}}function _M(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function MM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function tf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ef(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,f,p,x,g){let m=i[t];return m===void 0?(m={id:h.id,object:h,geometry:d,material:f,groupOrder:p,renderOrder:h.renderOrder,z:x,group:g},i[t]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=f,m.groupOrder=p,m.renderOrder=h.renderOrder,m.z=x,m.group=g),t++,m}function a(h,d,f,p,x,g){const m=o(h,d,f,p,x,g);f.transmission>0?n.push(m):f.transparent===!0?s.push(m):e.push(m)}function l(h,d,f,p,x,g){const m=o(h,d,f,p,x,g);f.transmission>0?n.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function c(h,d){e.length>1&&e.sort(h||MM),n.length>1&&n.sort(d||tf),s.length>1&&s.sort(d||tf)}function u(){for(let h=t,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function SM(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new ef,i.set(n,[o])):s>=r.length?(o=new ef,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function bM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new se};break;case"SpotLight":e={position:new H,direction:new H,color:new se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new se,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new se,groundColor:new se};break;case"RectAreaLight":e={color:new se,position:new H,halfWidth:new H,halfHeight:new H};break}return i[t.id]=e,e}}}function wM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let EM=0;function TM(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function AM(i){const t=new bM,e=wM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);const s=new H,r=new Ee,o=new Ee;function a(c){let u=0,h=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,y=0,M=0,_=0,C=0,w=0,P=0;c.sort(TM);for(let E=0,v=c.length;E<v;E++){const R=c[E],N=R.color,L=R.intensity,k=R.distance,B=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=N.r*L,h+=N.g*L,d+=N.b*L;else if(R.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(R.sh.coefficients[z],L);P++}else if(R.isDirectionalLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const j=R.shadow,X=e.get(R);X.shadowIntensity=j.intensity,X.shadowBias=j.bias,X.shadowNormalBias=j.normalBias,X.shadowRadius=j.radius,X.shadowMapSize=j.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=R.shadow.matrix,y++}n.directional[f]=z,f++}else if(R.isSpotLight){const z=t.get(R);z.position.setFromMatrixPosition(R.matrixWorld),z.color.copy(N).multiplyScalar(L),z.distance=k,z.coneCos=Math.cos(R.angle),z.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),z.decay=R.decay,n.spot[x]=z;const j=R.shadow;if(R.map&&(n.spotLightMap[C]=R.map,C++,j.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[x]=j.matrix,R.castShadow){const X=e.get(R);X.shadowIntensity=j.intensity,X.shadowBias=j.bias,X.shadowNormalBias=j.normalBias,X.shadowRadius=j.radius,X.shadowMapSize=j.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=B,_++}x++}else if(R.isRectAreaLight){const z=t.get(R);z.color.copy(N).multiplyScalar(L),z.halfWidth.set(R.width*.5,0,0),z.halfHeight.set(0,R.height*.5,0),n.rectArea[g]=z,g++}else if(R.isPointLight){const z=t.get(R);if(z.color.copy(R.color).multiplyScalar(R.intensity),z.distance=R.distance,z.decay=R.decay,R.castShadow){const j=R.shadow,X=e.get(R);X.shadowIntensity=j.intensity,X.shadowBias=j.bias,X.shadowNormalBias=j.normalBias,X.shadowRadius=j.radius,X.shadowMapSize=j.mapSize,X.shadowCameraNear=j.camera.near,X.shadowCameraFar=j.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=B,n.pointShadowMatrix[p]=R.shadow.matrix,M++}n.point[p]=z,p++}else if(R.isHemisphereLight){const z=t.get(R);z.skyColor.copy(R.color).multiplyScalar(L),z.groundColor.copy(R.groundColor).multiplyScalar(L),n.hemi[m]=z,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const D=n.hash;(D.directionalLength!==f||D.pointLength!==p||D.spotLength!==x||D.rectAreaLength!==g||D.hemiLength!==m||D.numDirectionalShadows!==y||D.numPointShadows!==M||D.numSpotShadows!==_||D.numSpotMaps!==C||D.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+C-w,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=P,D.directionalLength=f,D.pointLength=p,D.spotLength=x,D.rectAreaLength=g,D.hemiLength=m,D.numDirectionalShadows=y,D.numPointShadows=M,D.numSpotShadows=_,D.numSpotMaps=C,D.numLightProbes=P,n.version=EM++)}function l(c,u){let h=0,d=0,f=0,p=0,x=0;const g=u.matrixWorldInverse;for(let m=0,y=c.length;m<y;m++){const M=c[m];if(M.isDirectionalLight){const _=n.directional[h];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),h++}else if(M.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(M.isRectAreaLight){const _=n.rectArea[p];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),o.identity(),r.copy(M.matrixWorld),r.premultiply(g),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),p++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:a,setupView:l,state:n}}function nf(i){const t=new AM(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function CM(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new nf(i),t.set(s,[a])):r>=o.length?(a=new nf(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const RM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,PM=`uniform sampler2D shadow_pass;
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
}`;function LM(i,t,e){let n=new Jh;const s=new vt,r=new vt,o=new ye,a=new ex({depthPacking:pg}),l=new nx,c={},u=e.maxTextureSize,h={[vs]:wn,[wn]:vs,[Pn]:Pn},d=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:RM,fragmentShader:PM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new _e;p.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new pe(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ff;let m=this.type;this.render=function(w,P,D){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const E=i.getRenderTarget(),v=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),N=i.state;N.setBlending(ms),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const L=m!==Hi&&this.type===Hi,k=m===Hi&&this.type!==Hi;for(let B=0,z=w.length;B<z;B++){const j=w[B],X=j.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const rt=X.getFrameExtents();if(s.multiply(rt),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/rt.x),s.x=r.x*rt.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/rt.y),s.y=r.y*rt.y,X.mapSize.y=r.y)),X.map===null||L===!0||k===!0){const ht=this.type!==Hi?{minFilter:Dn,magFilter:Dn}:{};X.map!==null&&X.map.dispose(),X.map=new qs(s.x,s.y,ht),X.map.texture.name=j.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const gt=X.getViewportCount();for(let ht=0;ht<gt;ht++){const ut=X.getViewport(ht);o.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),N.viewport(o),X.updateMatrices(j,ht),n=X.getFrustum(),_(P,D,X.camera,j,this.type)}X.isPointLightShadow!==!0&&this.type===Hi&&y(X,D),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(E,v,R)};function y(w,P){const D=t.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new qs(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(P,null,D,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(P,null,D,f,x,null)}function M(w,P,D,E){let v=null;const R=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)v=R;else if(v=D.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const N=v.uuid,L=P.uuid;let k=c[N];k===void 0&&(k={},c[N]=k);let B=k[L];B===void 0&&(B=v.clone(),k[L]=B,P.addEventListener("dispose",C)),v=B}if(v.visible=P.visible,v.wireframe=P.wireframe,E===Hi?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:h[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,D.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const N=i.properties.get(v);N.light=D}return v}function _(w,P,D,E,v){if(w.visible===!1)return;if(w.layers.test(P.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===Hi)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);const L=t.update(w),k=w.material;if(Array.isArray(k)){const B=L.groups;for(let z=0,j=B.length;z<j;z++){const X=B[z],rt=k[X.materialIndex];if(rt&&rt.visible){const gt=M(w,rt,E,v);w.onBeforeShadow(i,w,P,D,L,gt,X),i.renderBufferDirect(D,null,L,gt,w,X),w.onAfterShadow(i,w,P,D,L,gt,X)}}}else if(k.visible){const B=M(w,k,E,v);w.onBeforeShadow(i,w,P,D,L,B,null),i.renderBufferDirect(D,null,L,B,w,null),w.onAfterShadow(i,w,P,D,L,B,null)}}const N=w.children;for(let L=0,k=N.length;L<k;L++)_(N[L],P,D,E,v)}function C(w){w.target.removeEventListener("dispose",C);for(const D in c){const E=c[D],v=w.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}const IM={[zc]:kc,[Gc]:Wc,[Hc]:Xc,[Fr]:Vc,[kc]:zc,[Wc]:Gc,[Xc]:Hc,[Vc]:Fr};function DM(i,t){function e(){let W=!1;const yt=new ye;let Mt=null;const It=new ye(0,0,0,0);return{setMask:function(pt){Mt!==pt&&!W&&(i.colorMask(pt,pt,pt,pt),Mt=pt)},setLocked:function(pt){W=pt},setClear:function(pt,lt,Ft,qt,we){we===!0&&(pt*=qt,lt*=qt,Ft*=qt),yt.set(pt,lt,Ft,qt),It.equals(yt)===!1&&(i.clearColor(pt,lt,Ft,qt),It.copy(yt))},reset:function(){W=!1,Mt=null,It.set(-1,0,0,0)}}}function n(){let W=!1,yt=!1,Mt=null,It=null,pt=null;return{setReversed:function(lt){if(yt!==lt){const Ft=t.get("EXT_clip_control");lt?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),yt=lt;const qt=pt;pt=null,this.setClear(qt)}},getReversed:function(){return yt},setTest:function(lt){lt?ot(i.DEPTH_TEST):Ct(i.DEPTH_TEST)},setMask:function(lt){Mt!==lt&&!W&&(i.depthMask(lt),Mt=lt)},setFunc:function(lt){if(yt&&(lt=IM[lt]),It!==lt){switch(lt){case zc:i.depthFunc(i.NEVER);break;case kc:i.depthFunc(i.ALWAYS);break;case Gc:i.depthFunc(i.LESS);break;case Fr:i.depthFunc(i.LEQUAL);break;case Hc:i.depthFunc(i.EQUAL);break;case Vc:i.depthFunc(i.GEQUAL);break;case Wc:i.depthFunc(i.GREATER);break;case Xc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}It=lt}},setLocked:function(lt){W=lt},setClear:function(lt){pt!==lt&&(yt&&(lt=1-lt),i.clearDepth(lt),pt=lt)},reset:function(){W=!1,Mt=null,It=null,pt=null,yt=!1}}}function s(){let W=!1,yt=null,Mt=null,It=null,pt=null,lt=null,Ft=null,qt=null,we=null;return{setTest:function(ge){W||(ge?ot(i.STENCIL_TEST):Ct(i.STENCIL_TEST))},setMask:function(ge){yt!==ge&&!W&&(i.stencilMask(ge),yt=ge)},setFunc:function(ge,Ii,ui){(Mt!==ge||It!==Ii||pt!==ui)&&(i.stencilFunc(ge,Ii,ui),Mt=ge,It=Ii,pt=ui)},setOp:function(ge,Ii,ui){(lt!==ge||Ft!==Ii||qt!==ui)&&(i.stencilOp(ge,Ii,ui),lt=ge,Ft=Ii,qt=ui)},setLocked:function(ge){W=ge},setClear:function(ge){we!==ge&&(i.clearStencil(ge),we=ge)},reset:function(){W=!1,yt=null,Mt=null,It=null,pt=null,lt=null,Ft=null,qt=null,we=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],p=null,x=!1,g=null,m=null,y=null,M=null,_=null,C=null,w=null,P=new se(0,0,0),D=0,E=!1,v=null,R=null,N=null,L=null,k=null;const B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,j=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(X)[1]),z=j>=1):X.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),z=j>=2);let rt=null,gt={};const ht=i.getParameter(i.SCISSOR_BOX),ut=i.getParameter(i.VIEWPORT),Gt=new ye().fromArray(ht),oe=new ye().fromArray(ut);function Zt(W,yt,Mt,It){const pt=new Uint8Array(4),lt=i.createTexture();i.bindTexture(W,lt),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ft=0;Ft<Mt;Ft++)W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?i.texImage3D(yt,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,pt):i.texImage2D(yt+Ft,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pt);return lt}const st={};st[i.TEXTURE_2D]=Zt(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=Zt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=Zt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=Zt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(Fr),I(!1),V(Yu),ot(i.CULL_FACE),F(ms);function ot(W){u[W]!==!0&&(i.enable(W),u[W]=!0)}function Ct(W){u[W]!==!1&&(i.disable(W),u[W]=!1)}function Ot(W,yt){return h[W]!==yt?(i.bindFramebuffer(W,yt),h[W]=yt,W===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=yt),W===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=yt),!0):!1}function Dt(W,yt){let Mt=f,It=!1;if(W){Mt=d.get(yt),Mt===void 0&&(Mt=[],d.set(yt,Mt));const pt=W.textures;if(Mt.length!==pt.length||Mt[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Ft=pt.length;lt<Ft;lt++)Mt[lt]=i.COLOR_ATTACHMENT0+lt;Mt.length=pt.length,It=!0}}else Mt[0]!==i.BACK&&(Mt[0]=i.BACK,It=!0);It&&i.drawBuffers(Mt)}function te(W){return p!==W?(i.useProgram(W),p=W,!0):!1}const me={[Os]:i.FUNC_ADD,[Gm]:i.FUNC_SUBTRACT,[Hm]:i.FUNC_REVERSE_SUBTRACT};me[Vm]=i.MIN,me[Wm]=i.MAX;const O={[Xm]:i.ZERO,[qm]:i.ONE,[Ym]:i.SRC_COLOR,[Oc]:i.SRC_ALPHA,[Qm]:i.SRC_ALPHA_SATURATE,[Km]:i.DST_COLOR,[jm]:i.DST_ALPHA,[$m]:i.ONE_MINUS_SRC_COLOR,[Bc]:i.ONE_MINUS_SRC_ALPHA,[Jm]:i.ONE_MINUS_DST_COLOR,[Zm]:i.ONE_MINUS_DST_ALPHA,[tg]:i.CONSTANT_COLOR,[eg]:i.ONE_MINUS_CONSTANT_COLOR,[ng]:i.CONSTANT_ALPHA,[ig]:i.ONE_MINUS_CONSTANT_ALPHA};function F(W,yt,Mt,It,pt,lt,Ft,qt,we,ge){if(W===ms){x===!0&&(Ct(i.BLEND),x=!1);return}if(x===!1&&(ot(i.BLEND),x=!0),W!==km){if(W!==g||ge!==E){if((m!==Os||_!==Os)&&(i.blendEquation(i.FUNC_ADD),m=Os,_=Os),ge)switch(W){case Pr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rn:i.blendFunc(i.ONE,i.ONE);break;case $u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ju:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Pr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case $u:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ju:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}y=null,M=null,C=null,w=null,P.set(0,0,0),D=0,g=W,E=ge}return}pt=pt||yt,lt=lt||Mt,Ft=Ft||It,(yt!==m||pt!==_)&&(i.blendEquationSeparate(me[yt],me[pt]),m=yt,_=pt),(Mt!==y||It!==M||lt!==C||Ft!==w)&&(i.blendFuncSeparate(O[Mt],O[It],O[lt],O[Ft]),y=Mt,M=It,C=lt,w=Ft),(qt.equals(P)===!1||we!==D)&&(i.blendColor(qt.r,qt.g,qt.b,we),P.copy(qt),D=we),g=W,E=!1}function U(W,yt){W.side===Pn?Ct(i.CULL_FACE):ot(i.CULL_FACE);let Mt=W.side===wn;yt&&(Mt=!Mt),I(Mt),W.blending===Pr&&W.transparent===!1?F(ms):F(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),r.setMask(W.colorWrite);const It=W.stencilWrite;a.setTest(It),It&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),K(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):Ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function I(W){v!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),v=W)}function V(W){W!==Bm?(ot(i.CULL_FACE),W!==R&&(W===Yu?i.cullFace(i.BACK):W===zm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ct(i.CULL_FACE),R=W}function tt(W){W!==N&&(z&&i.lineWidth(W),N=W)}function K(W,yt,Mt){W?(ot(i.POLYGON_OFFSET_FILL),(L!==yt||k!==Mt)&&(i.polygonOffset(yt,Mt),L=yt,k=Mt)):Ct(i.POLYGON_OFFSET_FILL)}function it(W){W?ot(i.SCISSOR_TEST):Ct(i.SCISSOR_TEST)}function _t(W){W===void 0&&(W=i.TEXTURE0+B-1),rt!==W&&(i.activeTexture(W),rt=W)}function et(W,yt,Mt){Mt===void 0&&(rt===null?Mt=i.TEXTURE0+B-1:Mt=rt);let It=gt[Mt];It===void 0&&(It={type:void 0,texture:void 0},gt[Mt]=It),(It.type!==W||It.texture!==yt)&&(rt!==Mt&&(i.activeTexture(Mt),rt=Mt),i.bindTexture(W,yt||st[W]),It.type=W,It.texture=yt)}function A(){const W=gt[rt];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function S(){try{i.compressedTexImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function G(){try{i.compressedTexImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function $(){try{i.texSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function at(){try{i.texSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function bt(){try{i.compressedTexSubImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{i.texStorage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function At(){try{i.texStorage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{i.texImage2D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ft(){try{i.texImage3D(...arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Tt(W){Gt.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Gt.copy(W))}function Wt(W){oe.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),oe.copy(W))}function Bt(W,yt){let Mt=c.get(yt);Mt===void 0&&(Mt=new WeakMap,c.set(yt,Mt));let It=Mt.get(W);It===void 0&&(It=i.getUniformBlockIndex(yt,W.name),Mt.set(W,It))}function wt(W,yt){const It=c.get(yt).get(W);l.get(yt)!==It&&(i.uniformBlockBinding(yt,It,W.__bindingPointIndex),l.set(yt,It))}function Yt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},rt=null,gt={},h={},d=new WeakMap,f=[],p=null,x=!1,g=null,m=null,y=null,M=null,_=null,C=null,w=null,P=new se(0,0,0),D=0,E=!1,v=null,R=null,N=null,L=null,k=null,Gt.set(0,0,i.canvas.width,i.canvas.height),oe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:Ct,bindFramebuffer:Ot,drawBuffers:Dt,useProgram:te,setBlending:F,setMaterial:U,setFlipSided:I,setCullFace:V,setLineWidth:tt,setPolygonOffset:K,setScissorTest:it,activeTexture:_t,bindTexture:et,unbindTexture:A,compressedTexImage2D:S,compressedTexImage3D:G,texImage2D:Ut,texImage3D:ft,updateUBOMapping:Bt,uniformBlockBinding:wt,texStorage2D:dt,texStorage3D:At,texSubImage2D:$,texSubImage3D:at,compressedTexSubImage2D:Z,compressedTexSubImage3D:bt,scissor:Tt,viewport:Wt,reset:Yt}}function NM(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new vt,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(A,S){return f?new OffscreenCanvas(A,S):hl("canvas")}function x(A,S,G){let $=1;const at=et(A);if((at.width>G||at.height>G)&&($=G/Math.max(at.width,at.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Z=Math.floor($*at.width),bt=Math.floor($*at.height);h===void 0&&(h=p(Z,bt));const dt=S?p(Z,bt):h;return dt.width=Z,dt.height=bt,dt.getContext("2d").drawImage(A,0,0,Z,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+at.width+"x"+at.height+") to ("+Z+"x"+bt+")."),dt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+at.width+"x"+at.height+")."),A;return A}function g(A){return A.generateMipmaps}function m(A){i.generateMipmap(A)}function y(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(A,S,G,$,at=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Z=S;if(S===i.RED&&(G===i.FLOAT&&(Z=i.R32F),G===i.HALF_FLOAT&&(Z=i.R16F),G===i.UNSIGNED_BYTE&&(Z=i.R8)),S===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.R8UI),G===i.UNSIGNED_SHORT&&(Z=i.R16UI),G===i.UNSIGNED_INT&&(Z=i.R32UI),G===i.BYTE&&(Z=i.R8I),G===i.SHORT&&(Z=i.R16I),G===i.INT&&(Z=i.R32I)),S===i.RG&&(G===i.FLOAT&&(Z=i.RG32F),G===i.HALF_FLOAT&&(Z=i.RG16F),G===i.UNSIGNED_BYTE&&(Z=i.RG8)),S===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RG8UI),G===i.UNSIGNED_SHORT&&(Z=i.RG16UI),G===i.UNSIGNED_INT&&(Z=i.RG32UI),G===i.BYTE&&(Z=i.RG8I),G===i.SHORT&&(Z=i.RG16I),G===i.INT&&(Z=i.RG32I)),S===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),G===i.UNSIGNED_INT&&(Z=i.RGB32UI),G===i.BYTE&&(Z=i.RGB8I),G===i.SHORT&&(Z=i.RGB16I),G===i.INT&&(Z=i.RGB32I)),S===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),G===i.UNSIGNED_INT&&(Z=i.RGBA32UI),G===i.BYTE&&(Z=i.RGBA8I),G===i.SHORT&&(Z=i.RGBA16I),G===i.INT&&(Z=i.RGBA32I)),S===i.RGB&&(G===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),S===i.RGBA){const bt=at?ll:de.getTransfer($);G===i.FLOAT&&(Z=i.RGBA32F),G===i.HALF_FLOAT&&(Z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Z=bt===Se?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function _(A,S){let G;return A?S===null||S===Xs||S===wo?G=i.DEPTH24_STENCIL8:S===Wi?G=i.DEPTH32F_STENCIL8:S===bo&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Xs||S===wo?G=i.DEPTH_COMPONENT24:S===Wi?G=i.DEPTH_COMPONENT32F:S===bo&&(G=i.DEPTH_COMPONENT16),G}function C(A,S){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Dn&&A.minFilter!==Vn?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function w(A){const S=A.target;S.removeEventListener("dispose",w),D(S),S.isVideoTexture&&u.delete(S)}function P(A){const S=A.target;S.removeEventListener("dispose",P),v(S)}function D(A){const S=n.get(A);if(S.__webglInit===void 0)return;const G=A.source,$=d.get(G);if($){const at=$[S.__cacheKey];at.usedTimes--,at.usedTimes===0&&E(A),Object.keys($).length===0&&d.delete(G)}n.remove(A)}function E(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const G=A.source,$=d.get(G);delete $[S.__cacheKey],o.memory.textures--}function v(A){const S=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let at=0;at<S.__webglFramebuffer[$].length;at++)i.deleteFramebuffer(S.__webglFramebuffer[$][at]);else i.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)i.deleteFramebuffer(S.__webglFramebuffer[$]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=A.textures;for(let $=0,at=G.length;$<at;$++){const Z=n.get(G[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(G[$])}n.remove(A)}let R=0;function N(){R=0}function L(){const A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function k(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function B(A,S){const G=n.get(A);if(A.isVideoTexture&&it(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&G.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(G,A,S);return}}else A.isExternalTexture&&(G.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+S)}function z(A,S){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){st(G,A,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+S)}function j(A,S){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){st(G,A,S);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+S)}function X(A,S){const G=n.get(A);if(A.version>0&&G.__version!==A.version){ot(G,A,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+S)}const rt={[$c]:i.REPEAT,[Hs]:i.CLAMP_TO_EDGE,[jc]:i.MIRRORED_REPEAT},gt={[Dn]:i.NEAREST,[dg]:i.NEAREST_MIPMAP_NEAREST,[ca]:i.NEAREST_MIPMAP_LINEAR,[Vn]:i.LINEAR,[Gl]:i.LINEAR_MIPMAP_NEAREST,[Vs]:i.LINEAR_MIPMAP_LINEAR},ht={[gg]:i.NEVER,[Sg]:i.ALWAYS,[xg]:i.LESS,[Zf]:i.LEQUAL,[vg]:i.EQUAL,[Mg]:i.GEQUAL,[yg]:i.GREATER,[_g]:i.NOTEQUAL};function ut(A,S){if(S.type===Wi&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Vn||S.magFilter===Gl||S.magFilter===ca||S.magFilter===Vs||S.minFilter===Vn||S.minFilter===Gl||S.minFilter===ca||S.minFilter===Vs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,rt[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,rt[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,rt[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,gt[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,gt[S.minFilter]),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,ht[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Dn||S.minFilter!==ca&&S.minFilter!==Vs||S.type===Wi&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Gt(A,S){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",w));const $=S.source;let at=d.get($);at===void 0&&(at={},d.set($,at));const Z=k(S);if(Z!==A.__cacheKey){at[Z]===void 0&&(at[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),at[Z].usedTimes++;const bt=at[A.__cacheKey];bt!==void 0&&(at[A.__cacheKey].usedTimes--,bt.usedTimes===0&&E(S)),A.__cacheKey=Z,A.__webglTexture=at[Z].texture}return G}function oe(A,S,G){return Math.floor(Math.floor(A/G)/S)}function Zt(A,S,G,$){const Z=A.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,G,$,S.data);else{Z.sort((ft,Tt)=>ft.start-Tt.start);let bt=0;for(let ft=1;ft<Z.length;ft++){const Tt=Z[bt],Wt=Z[ft],Bt=Tt.start+Tt.count,wt=oe(Wt.start,S.width,4),Yt=oe(Tt.start,S.width,4);Wt.start<=Bt+1&&wt===Yt&&oe(Wt.start+Wt.count-1,S.width,4)===wt?Tt.count=Math.max(Tt.count,Wt.start+Wt.count-Tt.start):(++bt,Z[bt]=Wt)}Z.length=bt+1;const dt=i.getParameter(i.UNPACK_ROW_LENGTH),At=i.getParameter(i.UNPACK_SKIP_PIXELS),Ut=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let ft=0,Tt=Z.length;ft<Tt;ft++){const Wt=Z[ft],Bt=Math.floor(Wt.start/4),wt=Math.ceil(Wt.count/4),Yt=Bt%S.width,W=Math.floor(Bt/S.width),yt=wt,Mt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Yt),i.pixelStorei(i.UNPACK_SKIP_ROWS,W),e.texSubImage2D(i.TEXTURE_2D,0,Yt,W,yt,Mt,G,$,S.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,dt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,At),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ut)}}function st(A,S,G){let $=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=i.TEXTURE_3D);const at=Gt(A,S),Z=S.source;e.bindTexture($,A.__webglTexture,i.TEXTURE0+G);const bt=n.get(Z);if(Z.version!==bt.__version||at===!0){e.activeTexture(i.TEXTURE0+G);const dt=de.getPrimaries(de.workingColorSpace),At=S.colorSpace===cs?null:de.getPrimaries(S.colorSpace),Ut=S.colorSpace===cs||dt===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let ft=x(S.image,!1,s.maxTextureSize);ft=_t(S,ft);const Tt=r.convert(S.format,S.colorSpace),Wt=r.convert(S.type);let Bt=M(S.internalFormat,Tt,Wt,S.colorSpace,S.isVideoTexture);ut($,S);let wt;const Yt=S.mipmaps,W=S.isVideoTexture!==!0,yt=bt.__version===void 0||at===!0,Mt=Z.dataReady,It=C(S,ft);if(S.isDepthTexture)Bt=_(S.format===To,S.type),yt&&(W?e.texStorage2D(i.TEXTURE_2D,1,Bt,ft.width,ft.height):e.texImage2D(i.TEXTURE_2D,0,Bt,ft.width,ft.height,0,Tt,Wt,null));else if(S.isDataTexture)if(Yt.length>0){W&&yt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,Yt[0].width,Yt[0].height);for(let pt=0,lt=Yt.length;pt<lt;pt++)wt=Yt[pt],W?Mt&&e.texSubImage2D(i.TEXTURE_2D,pt,0,0,wt.width,wt.height,Tt,Wt,wt.data):e.texImage2D(i.TEXTURE_2D,pt,Bt,wt.width,wt.height,0,Tt,Wt,wt.data);S.generateMipmaps=!1}else W?(yt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,ft.width,ft.height),Mt&&Zt(S,ft,Tt,Wt)):e.texImage2D(i.TEXTURE_2D,0,Bt,ft.width,ft.height,0,Tt,Wt,ft.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){W&&yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,Yt[0].width,Yt[0].height,ft.depth);for(let pt=0,lt=Yt.length;pt<lt;pt++)if(wt=Yt[pt],S.format!==ni)if(Tt!==null)if(W){if(Mt)if(S.layerUpdates.size>0){const Ft=Id(wt.width,wt.height,S.format,S.type);for(const qt of S.layerUpdates){const we=wt.data.subarray(qt*Ft/wt.data.BYTES_PER_ELEMENT,(qt+1)*Ft/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pt,0,0,qt,wt.width,wt.height,1,Tt,we)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pt,0,0,0,wt.width,wt.height,ft.depth,Tt,wt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,pt,Bt,wt.width,wt.height,ft.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else W?Mt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,pt,0,0,0,wt.width,wt.height,ft.depth,Tt,Wt,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,pt,Bt,wt.width,wt.height,ft.depth,0,Tt,Wt,wt.data)}else{W&&yt&&e.texStorage2D(i.TEXTURE_2D,It,Bt,Yt[0].width,Yt[0].height);for(let pt=0,lt=Yt.length;pt<lt;pt++)wt=Yt[pt],S.format!==ni?Tt!==null?W?Mt&&e.compressedTexSubImage2D(i.TEXTURE_2D,pt,0,0,wt.width,wt.height,Tt,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,pt,Bt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):W?Mt&&e.texSubImage2D(i.TEXTURE_2D,pt,0,0,wt.width,wt.height,Tt,Wt,wt.data):e.texImage2D(i.TEXTURE_2D,pt,Bt,wt.width,wt.height,0,Tt,Wt,wt.data)}else if(S.isDataArrayTexture)if(W){if(yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Bt,ft.width,ft.height,ft.depth),Mt)if(S.layerUpdates.size>0){const pt=Id(ft.width,ft.height,S.format,S.type);for(const lt of S.layerUpdates){const Ft=ft.data.subarray(lt*pt/ft.data.BYTES_PER_ELEMENT,(lt+1)*pt/ft.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,lt,ft.width,ft.height,1,Tt,Wt,Ft)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,Tt,Wt,ft.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Bt,ft.width,ft.height,ft.depth,0,Tt,Wt,ft.data);else if(S.isData3DTexture)W?(yt&&e.texStorage3D(i.TEXTURE_3D,It,Bt,ft.width,ft.height,ft.depth),Mt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,Tt,Wt,ft.data)):e.texImage3D(i.TEXTURE_3D,0,Bt,ft.width,ft.height,ft.depth,0,Tt,Wt,ft.data);else if(S.isFramebufferTexture){if(yt)if(W)e.texStorage2D(i.TEXTURE_2D,It,Bt,ft.width,ft.height);else{let pt=ft.width,lt=ft.height;for(let Ft=0;Ft<It;Ft++)e.texImage2D(i.TEXTURE_2D,Ft,Bt,pt,lt,0,Tt,Wt,null),pt>>=1,lt>>=1}}else if(Yt.length>0){if(W&&yt){const pt=et(Yt[0]);e.texStorage2D(i.TEXTURE_2D,It,Bt,pt.width,pt.height)}for(let pt=0,lt=Yt.length;pt<lt;pt++)wt=Yt[pt],W?Mt&&e.texSubImage2D(i.TEXTURE_2D,pt,0,0,Tt,Wt,wt):e.texImage2D(i.TEXTURE_2D,pt,Bt,Tt,Wt,wt);S.generateMipmaps=!1}else if(W){if(yt){const pt=et(ft);e.texStorage2D(i.TEXTURE_2D,It,Bt,pt.width,pt.height)}Mt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Tt,Wt,ft)}else e.texImage2D(i.TEXTURE_2D,0,Bt,Tt,Wt,ft);g(S)&&m($),bt.__version=Z.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function ot(A,S,G){if(S.image.length!==6)return;const $=Gt(A,S),at=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+G);const Z=n.get(at);if(at.version!==Z.__version||$===!0){e.activeTexture(i.TEXTURE0+G);const bt=de.getPrimaries(de.workingColorSpace),dt=S.colorSpace===cs?null:de.getPrimaries(S.colorSpace),At=S.colorSpace===cs||bt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Ut=S.isCompressedTexture||S.image[0].isCompressedTexture,ft=S.image[0]&&S.image[0].isDataTexture,Tt=[];for(let lt=0;lt<6;lt++)!Ut&&!ft?Tt[lt]=x(S.image[lt],!0,s.maxCubemapSize):Tt[lt]=ft?S.image[lt].image:S.image[lt],Tt[lt]=_t(S,Tt[lt]);const Wt=Tt[0],Bt=r.convert(S.format,S.colorSpace),wt=r.convert(S.type),Yt=M(S.internalFormat,Bt,wt,S.colorSpace),W=S.isVideoTexture!==!0,yt=Z.__version===void 0||$===!0,Mt=at.dataReady;let It=C(S,Wt);ut(i.TEXTURE_CUBE_MAP,S);let pt;if(Ut){W&&yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Yt,Wt.width,Wt.height);for(let lt=0;lt<6;lt++){pt=Tt[lt].mipmaps;for(let Ft=0;Ft<pt.length;Ft++){const qt=pt[Ft];S.format!==ni?Bt!==null?W?Mt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,0,0,qt.width,qt.height,Bt,qt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,Yt,qt.width,qt.height,0,qt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,0,0,qt.width,qt.height,Bt,wt,qt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft,Yt,qt.width,qt.height,0,Bt,wt,qt.data)}}}else{if(pt=S.mipmaps,W&&yt){pt.length>0&&It++;const lt=et(Tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,It,Yt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(ft){W?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Tt[lt].width,Tt[lt].height,Bt,wt,Tt[lt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Yt,Tt[lt].width,Tt[lt].height,0,Bt,wt,Tt[lt].data);for(let Ft=0;Ft<pt.length;Ft++){const we=pt[Ft].image[lt].image;W?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,0,0,we.width,we.height,Bt,wt,we.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,Yt,we.width,we.height,0,Bt,wt,we.data)}}else{W?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Bt,wt,Tt[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Yt,Bt,wt,Tt[lt]);for(let Ft=0;Ft<pt.length;Ft++){const qt=pt[Ft];W?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,0,0,Bt,wt,qt.image[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Ft+1,Yt,Bt,wt,qt.image[lt])}}}g(S)&&m(i.TEXTURE_CUBE_MAP),Z.__version=at.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function Ct(A,S,G,$,at,Z){const bt=r.convert(G.format,G.colorSpace),dt=r.convert(G.type),At=M(G.internalFormat,bt,dt,G.colorSpace),Ut=n.get(S),ft=n.get(G);if(ft.__renderTarget=S,!Ut.__hasExternalTextures){const Tt=Math.max(1,S.width>>Z),Wt=Math.max(1,S.height>>Z);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,Z,At,Tt,Wt,S.depth,0,bt,dt,null):e.texImage2D(at,Z,At,Tt,Wt,0,bt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),K(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,at,ft.__webglTexture,0,tt(S)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,at,ft.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ot(A,S,G){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer){const $=S.depthTexture,at=$&&$.isDepthTexture?$.type:null,Z=_(S.stencilBuffer,at),bt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=tt(S);K(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,Z,S.width,S.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,Z,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Z,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,bt,i.RENDERBUFFER,A)}else{const $=S.textures;for(let at=0;at<$.length;at++){const Z=$[at],bt=r.convert(Z.format,Z.colorSpace),dt=r.convert(Z.type),At=M(Z.internalFormat,bt,dt,Z.colorSpace),Ut=tt(S);G&&K(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,At,S.width,S.height):K(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ut,At,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,At,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),B(S.depthTexture,0);const at=$.__webglTexture,Z=tt(S);if(S.depthTexture.format===Eo)K(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(S.depthTexture.format===To)K(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function te(A){const S=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){const at=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",at)};$.addEventListener("dispose",at),S.__depthDisposeCallback=at}S.__boundDepthTexture=$}if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const $=A.texture.mipmaps;$&&$.length>0?Dt(S.__webglFramebuffer[0],A):Dt(S.__webglFramebuffer,A)}else if(G){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=i.createRenderbuffer(),Ot(S.__webglDepthbuffer[$],A,!1);else{const at=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=S.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,Z)}}else{const $=A.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ot(S.__webglDepthbuffer,A,!1);else{const at=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,at,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function me(A,S,G){const $=n.get(A);S!==void 0&&Ct($.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&te(A)}function O(A){const S=A.texture,G=n.get(A),$=n.get(S);A.addEventListener("dispose",P);const at=A.textures,Z=A.isWebGLCubeRenderTarget===!0,bt=at.length>1;if(bt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=S.version,o.memory.textures++),Z){G.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[dt]=[];for(let At=0;At<S.mipmaps.length;At++)G.__webglFramebuffer[dt][At]=i.createFramebuffer()}else G.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let dt=0;dt<S.mipmaps.length;dt++)G.__webglFramebuffer[dt]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(bt)for(let dt=0,At=at.length;dt<At;dt++){const Ut=n.get(at[dt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&K(A)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let dt=0;dt<at.length;dt++){const At=at[dt];G.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[dt]);const Ut=r.convert(At.format,At.colorSpace),ft=r.convert(At.type),Tt=M(At.internalFormat,Ut,ft,At.colorSpace,A.isXRRenderTarget===!0),Wt=tt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,Tt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,G.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Ot(G.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ut(i.TEXTURE_CUBE_MAP,S);for(let dt=0;dt<6;dt++)if(S.mipmaps&&S.mipmaps.length>0)for(let At=0;At<S.mipmaps.length;At++)Ct(G.__webglFramebuffer[dt][At],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,At);else Ct(G.__webglFramebuffer[dt],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);g(S)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let dt=0,At=at.length;dt<At;dt++){const Ut=at[dt],ft=n.get(Ut);let Tt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Tt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Tt,ft.__webglTexture),ut(Tt,Ut),Ct(G.__webglFramebuffer,A,Ut,i.COLOR_ATTACHMENT0+dt,Tt,0),g(Ut)&&m(Tt)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(dt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,$.__webglTexture),ut(dt,S),S.mipmaps&&S.mipmaps.length>0)for(let At=0;At<S.mipmaps.length;At++)Ct(G.__webglFramebuffer[At],A,S,i.COLOR_ATTACHMENT0,dt,At);else Ct(G.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,dt,0);g(S)&&m(dt),e.unbindTexture()}A.depthBuffer&&te(A)}function F(A){const S=A.textures;for(let G=0,$=S.length;G<$;G++){const at=S[G];if(g(at)){const Z=y(A),bt=n.get(at).__webglTexture;e.bindTexture(Z,bt),m(Z),e.unbindTexture()}}}const U=[],I=[];function V(A){if(A.samples>0){if(K(A)===!1){const S=A.textures,G=A.width,$=A.height;let at=i.COLOR_BUFFER_BIT;const Z=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(A),dt=S.length>1;if(dt)for(let Ut=0;Ut<S.length;Ut++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);const At=A.texture.mipmaps;At&&At.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let Ut=0;Ut<S.length;Ut++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[Ut]);const ft=n.get(S[Ut]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ft,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,at,i.NEAREST),l===!0&&(U.length=0,I.length=0,U.push(i.COLOR_ATTACHMENT0+Ut),A.depthBuffer&&A.resolveDepthBuffer===!1&&(U.push(Z),I.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,U))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let Ut=0;Ut<S.length;Ut++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.RENDERBUFFER,bt.__webglColorRenderbuffer[Ut]);const ft=n.get(S[Ut]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ut,i.TEXTURE_2D,ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const S=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function tt(A){return Math.min(s.maxSamples,A.samples)}function K(A){const S=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function it(A){const S=o.render.frame;u.get(A)!==S&&(u.set(A,S),A.update())}function _t(A,S){const G=A.colorSpace,$=A.format,at=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==zr&&G!==cs&&(de.getTransfer(G)===Se?($!==ni||at!==wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function et(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=N,this.setTexture2D=B,this.setTexture2DArray=z,this.setTexture3D=j,this.setTextureCube=X,this.rebindTextures=me,this.setupRenderTarget=O,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=V,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=K}function UM(i,t){function e(n,s=cs){let r;const o=de.getTransfer(s);if(n===wi)return i.UNSIGNED_BYTE;if(n===Wh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Wf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Gf)return i.BYTE;if(n===Hf)return i.SHORT;if(n===bo)return i.UNSIGNED_SHORT;if(n===Vh)return i.INT;if(n===Xs)return i.UNSIGNED_INT;if(n===Wi)return i.FLOAT;if(n===Xo)return i.HALF_FLOAT;if(n===Xf)return i.ALPHA;if(n===qf)return i.RGB;if(n===ni)return i.RGBA;if(n===Eo)return i.DEPTH_COMPONENT;if(n===To)return i.DEPTH_STENCIL;if(n===Yf)return i.RED;if(n===qh)return i.RED_INTEGER;if(n===$f)return i.RG;if(n===Yh)return i.RG_INTEGER;if(n===$h)return i.RGBA_INTEGER;if(n===Ka||n===Ja||n===Qa||n===tl)if(o===Se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ka)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===tl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ka)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===tl)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zc||n===Kc||n===Jc||n===Qc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Zc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Kc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Jc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Qc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===th||n===eh||n===nh)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===th||n===eh)return o===Se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===nh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ih||n===sh||n===rh||n===oh||n===ah||n===lh||n===ch||n===hh||n===uh||n===dh||n===fh||n===ph||n===mh||n===gh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ih)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===sh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===rh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ah)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ch)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===hh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===uh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===dh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ph)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===mh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===gh)return o===Se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xh||n===vh||n===yh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===xh)return o===Se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===yh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_h||n===Mh||n===Sh||n===bh)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===_h)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Mh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Sh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===bh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===wo?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const FM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,OM=`
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

}`;class BM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new cp(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Yn({vertexShader:FM,fragmentShader:OM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new ys(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zM extends $r{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",g=new BM,m={},y=e.getContextAttributes();let M=null,_=null;const C=[],w=[],P=new vt;let D=null;const E=new Gn;E.viewport=new ye;const v=new Gn;v.viewport=new ye;const R=[E,v],N=new ox;let L=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(st){let ot=C[st];return ot===void 0&&(ot=new lc,C[st]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(st){let ot=C[st];return ot===void 0&&(ot=new lc,C[st]=ot),ot.getGripSpace()},this.getHand=function(st){let ot=C[st];return ot===void 0&&(ot=new lc,C[st]=ot),ot.getHandSpace()};function B(st){const ot=w.indexOf(st.inputSource);if(ot===-1)return;const Ct=C[ot];Ct!==void 0&&(Ct.update(st.inputSource,st.frame,c||o),Ct.dispatchEvent({type:st.type,data:st.inputSource}))}function z(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",j);for(let st=0;st<C.length;st++){const ot=w[st];ot!==null&&(w[st]=null,C[st].disconnect(ot))}L=null,k=null,g.reset();for(const st in m)delete m[st];t.setRenderTarget(M),f=null,d=null,h=null,s=null,_=null,Zt.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(st){r=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(st){a=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(st){c=st},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,e)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(st){if(s=st,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",z),s.addEventListener("inputsourceschange",j),y.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ct=null,Ot=null,Dt=null;y.depth&&(Dt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ct=y.stencil?To:Eo,Ot=y.stencil?wo:Xs);const te={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(te),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new qs(d.textureWidth,d.textureHeight,{format:ni,type:wi,depthTexture:new lp(d.textureWidth,d.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,Ct),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ct={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Ct),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new qs(f.framebufferWidth,f.framebufferHeight,{format:ni,type:wi,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Zt.setContext(s),Zt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function j(st){for(let ot=0;ot<st.removed.length;ot++){const Ct=st.removed[ot],Ot=w.indexOf(Ct);Ot>=0&&(w[Ot]=null,C[Ot].disconnect(Ct))}for(let ot=0;ot<st.added.length;ot++){const Ct=st.added[ot];let Ot=w.indexOf(Ct);if(Ot===-1){for(let te=0;te<C.length;te++)if(te>=w.length){w.push(Ct),Ot=te;break}else if(w[te]===null){w[te]=Ct,Ot=te;break}if(Ot===-1)break}const Dt=C[Ot];Dt&&Dt.connect(Ct)}}const X=new H,rt=new H;function gt(st,ot,Ct){X.setFromMatrixPosition(ot.matrixWorld),rt.setFromMatrixPosition(Ct.matrixWorld);const Ot=X.distanceTo(rt),Dt=ot.projectionMatrix.elements,te=Ct.projectionMatrix.elements,me=Dt[14]/(Dt[10]-1),O=Dt[14]/(Dt[10]+1),F=(Dt[9]+1)/Dt[5],U=(Dt[9]-1)/Dt[5],I=(Dt[8]-1)/Dt[0],V=(te[8]+1)/te[0],tt=me*I,K=me*V,it=Ot/(-I+V),_t=it*-I;if(ot.matrixWorld.decompose(st.position,st.quaternion,st.scale),st.translateX(_t),st.translateZ(it),st.matrixWorld.compose(st.position,st.quaternion,st.scale),st.matrixWorldInverse.copy(st.matrixWorld).invert(),Dt[10]===-1)st.projectionMatrix.copy(ot.projectionMatrix),st.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const et=me+it,A=O+it,S=tt-_t,G=K+(Ot-_t),$=F*O/A*et,at=U*O/A*et;st.projectionMatrix.makePerspective(S,G,$,at,et,A),st.projectionMatrixInverse.copy(st.projectionMatrix).invert()}}function ht(st,ot){ot===null?st.matrixWorld.copy(st.matrix):st.matrixWorld.multiplyMatrices(ot.matrixWorld,st.matrix),st.matrixWorldInverse.copy(st.matrixWorld).invert()}this.updateCamera=function(st){if(s===null)return;let ot=st.near,Ct=st.far;g.texture!==null&&(g.depthNear>0&&(ot=g.depthNear),g.depthFar>0&&(Ct=g.depthFar)),N.near=v.near=E.near=ot,N.far=v.far=E.far=Ct,(L!==N.near||k!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),L=N.near,k=N.far),N.layers.mask=st.layers.mask|6,E.layers.mask=N.layers.mask&3,v.layers.mask=N.layers.mask&5;const Ot=st.parent,Dt=N.cameras;ht(N,Ot);for(let te=0;te<Dt.length;te++)ht(Dt[te],Ot);Dt.length===2?gt(N,E,v):N.projectionMatrix.copy(E.projectionMatrix),ut(st,N,Ot)};function ut(st,ot,Ct){Ct===null?st.matrix.copy(ot.matrixWorld):(st.matrix.copy(Ct.matrixWorld),st.matrix.invert(),st.matrix.multiply(ot.matrixWorld)),st.matrix.decompose(st.position,st.quaternion,st.scale),st.updateMatrixWorld(!0),st.projectionMatrix.copy(ot.projectionMatrix),st.projectionMatrixInverse.copy(ot.projectionMatrixInverse),st.isPerspectiveCamera&&(st.fov=Ao*2*Math.atan(1/st.projectionMatrix.elements[5]),st.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(st){l=st,d!==null&&(d.fixedFoveation=st),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=st)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(st){return m[st]};let Gt=null;function oe(st,ot){if(u=ot.getViewerPose(c||o),p=ot,u!==null){const Ct=u.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Ot=!1;Ct.length!==N.cameras.length&&(N.cameras.length=0,Ot=!0);for(let O=0;O<Ct.length;O++){const F=Ct[O];let U=null;if(f!==null)U=f.getViewport(F);else{const V=h.getViewSubImage(d,F);U=V.viewport,O===0&&(t.setRenderTargetTextures(_,V.colorTexture,V.depthStencilTexture),t.setRenderTarget(_))}let I=R[O];I===void 0&&(I=new Gn,I.layers.enable(O),I.viewport=new ye,R[O]=I),I.matrix.fromArray(F.transform.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale),I.projectionMatrix.fromArray(F.projectionMatrix),I.projectionMatrixInverse.copy(I.projectionMatrix).invert(),I.viewport.set(U.x,U.y,U.width,U.height),O===0&&(N.matrix.copy(I.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ot===!0&&N.cameras.push(I)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=n.getBinding();const O=h.getDepthInformation(Ct[0]);O&&O.isValid&&O.texture&&g.init(O,s.renderState)}if(Dt&&Dt.includes("camera-access")&&x){t.state.unbindTexture(),h=n.getBinding();for(let O=0;O<Ct.length;O++){const F=Ct[O].camera;if(F){let U=m[F];U||(U=new cp,m[F]=U);const I=h.getCameraImage(F);U.sourceTexture=I}}}}for(let Ct=0;Ct<C.length;Ct++){const Ot=w[Ct],Dt=C[Ct];Ot!==null&&Dt!==void 0&&Dt.update(Ot,ot,c||o)}Gt&&Gt(st,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),p=null}const Zt=new _p;Zt.setAnimationLoop(oe),this.setAnimationLoop=function(st){Gt=st},this.dispose=function(){}}}const Is=new Ti,kM=new Ee;function GM(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,ip(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,y,M,_){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),h(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,_)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,y,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===wn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===wn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const y=t.get(m),M=y.envMap,_=y.envMapRotation;M&&(g.envMap.value=M,Is.copy(_),Is.x*=-1,Is.y*=-1,Is.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Is.y*=-1,Is.z*=-1),g.envMapRotation.value.setFromMatrix4(kM.makeRotationFromEuler(Is)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,y,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*y,g.scale.value=M*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function h(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,y){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===wn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){const y=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function HM(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){const _=M.program;n.uniformBlockBinding(y,_)}function c(y,M){let _=s[y.id];_===void 0&&(p(y),_=u(y),s[y.id]=_,y.addEventListener("dispose",g));const C=M.program;n.updateUBOMapping(y,C);const w=t.render.frame;r[y.id]!==w&&(d(y),r[y.id]=w)}function u(y){const M=h();y.__bindingPointIndex=M;const _=i.createBuffer(),C=y.__size,w=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,C,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const M=s[y.id],_=y.uniforms,C=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,P=_.length;w<P;w++){const D=Array.isArray(_[w])?_[w]:[_[w]];for(let E=0,v=D.length;E<v;E++){const R=D[E];if(f(R,w,E,C)===!0){const N=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let k=0;for(let B=0;B<L.length;B++){const z=L[B],j=x(z);typeof z=="number"||typeof z=="boolean"?(R.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,N+k,R.__data)):z.isMatrix3?(R.__data[0]=z.elements[0],R.__data[1]=z.elements[1],R.__data[2]=z.elements[2],R.__data[3]=0,R.__data[4]=z.elements[3],R.__data[5]=z.elements[4],R.__data[6]=z.elements[5],R.__data[7]=0,R.__data[8]=z.elements[6],R.__data[9]=z.elements[7],R.__data[10]=z.elements[8],R.__data[11]=0):(z.toArray(R.__data,k),k+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,M,_,C){const w=y.value,P=M+"_"+_;if(C[P]===void 0)return typeof w=="number"||typeof w=="boolean"?C[P]=w:C[P]=w.clone(),!0;{const D=C[P];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return C[P]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function p(y){const M=y.uniforms;let _=0;const C=16;for(let P=0,D=M.length;P<D;P++){const E=Array.isArray(M[P])?M[P]:[M[P]];for(let v=0,R=E.length;v<R;v++){const N=E[v],L=Array.isArray(N.value)?N.value:[N.value];for(let k=0,B=L.length;k<B;k++){const z=L[k],j=x(z),X=_%C,rt=X%j.boundary,gt=X+rt;_+=rt,gt!==0&&C-gt<j.storage&&(_+=C-gt),N.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=_,_+=j.storage}}}const w=_%C;return w>0&&(_+=C-w),y.__size=_,y.__cache={},this}function x(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function g(y){const M=y.target;M.removeEventListener("dispose",g);const _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function m(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}class VM{constructor(t={}){const{canvas:e=kg(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),x=new Int32Array(4);let g=null,m=null;const y=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gs,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let C=!1;this._outputColorSpace=bn;let w=0,P=0,D=null,E=-1,v=null;const R=new ye,N=new ye;let L=null;const k=new se(0);let B=0,z=e.width,j=e.height,X=1,rt=null,gt=null;const ht=new ye(0,0,z,j),ut=new ye(0,0,z,j);let Gt=!1;const oe=new Jh;let Zt=!1,st=!1;const ot=new Ee,Ct=new H,Ot=new ye,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let te=!1;function me(){return D===null?X:1}let O=n;function F(T,q){return e.getContext(T,q)}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hh}`),e.addEventListener("webglcontextlost",Mt,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",pt,!1),O===null){const q="webgl2";if(O=F(q,T),O===null)throw F(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let U,I,V,tt,K,it,_t,et,A,S,G,$,at,Z,bt,dt,At,Ut,ft,Tt,Wt,Bt,wt,Yt;function W(){U=new Qy(O),U.init(),Bt=new UM(O,U),I=new qy(O,U,t,Bt),V=new DM(O,U),I.reversedDepthBuffer&&d&&V.buffers.depth.setReversed(!0),tt=new n_(O),K=new _M,it=new NM(O,U,V,K,I,Bt,tt),_t=new $y(_),et=new Jy(_),A=new lx(O),wt=new Wy(O,A),S=new t_(O,A,tt,wt),G=new s_(O,S,A,tt),ft=new i_(O,I,it),dt=new Yy(K),$=new yM(_,_t,et,U,I,wt,dt),at=new GM(_,K),Z=new SM,bt=new CM(U),Ut=new Vy(_,_t,et,V,G,f,l),At=new LM(_,G,I),Yt=new HM(O,tt,I,V),Tt=new Xy(O,U,tt),Wt=new e_(O,U,tt),tt.programs=$.programs,_.capabilities=I,_.extensions=U,_.properties=K,_.renderLists=Z,_.shadowMap=At,_.state=V,_.info=tt}W();const yt=new zM(_,O);this.xr=yt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const T=U.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=U.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(T){T!==void 0&&(X=T,this.setSize(z,j,!1))},this.getSize=function(T){return T.set(z,j)},this.setSize=function(T,q,J=!0){if(yt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=T,j=q,e.width=Math.floor(T*X),e.height=Math.floor(q*X),J===!0&&(e.style.width=T+"px",e.style.height=q+"px"),this.setViewport(0,0,T,q)},this.getDrawingBufferSize=function(T){return T.set(z*X,j*X).floor()},this.setDrawingBufferSize=function(T,q,J){z=T,j=q,X=J,e.width=Math.floor(T*J),e.height=Math.floor(q*J),this.setViewport(0,0,T,q)},this.getCurrentViewport=function(T){return T.copy(R)},this.getViewport=function(T){return T.copy(ht)},this.setViewport=function(T,q,J,Q){T.isVector4?ht.set(T.x,T.y,T.z,T.w):ht.set(T,q,J,Q),V.viewport(R.copy(ht).multiplyScalar(X).round())},this.getScissor=function(T){return T.copy(ut)},this.setScissor=function(T,q,J,Q){T.isVector4?ut.set(T.x,T.y,T.z,T.w):ut.set(T,q,J,Q),V.scissor(N.copy(ut).multiplyScalar(X).round())},this.getScissorTest=function(){return Gt},this.setScissorTest=function(T){V.setScissorTest(Gt=T)},this.setOpaqueSort=function(T){rt=T},this.setTransparentSort=function(T){gt=T},this.getClearColor=function(T){return T.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(T=!0,q=!0,J=!0){let Q=0;if(T){let Y=!1;if(D!==null){const xt=D.texture.format;Y=xt===$h||xt===Yh||xt===qh}if(Y){const xt=D.texture.type,Et=xt===wi||xt===Xs||xt===bo||xt===wo||xt===Wh||xt===Xh,Nt=Ut.getClearColor(),Pt=Ut.getClearAlpha(),Vt=Nt.r,Xt=Nt.g,kt=Nt.b;Et?(p[0]=Vt,p[1]=Xt,p[2]=kt,p[3]=Pt,O.clearBufferuiv(O.COLOR,0,p)):(x[0]=Vt,x[1]=Xt,x[2]=kt,x[3]=Pt,O.clearBufferiv(O.COLOR,0,x))}else Q|=O.COLOR_BUFFER_BIT}q&&(Q|=O.DEPTH_BUFFER_BIT),J&&(Q|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Mt,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),Ut.dispose(),Z.dispose(),bt.dispose(),K.dispose(),_t.dispose(),et.dispose(),G.dispose(),wt.dispose(),Yt.dispose(),$.dispose(),yt.dispose(),yt.removeEventListener("sessionstart",ui),yt.removeEventListener("sessionend",Gu),Es.stop()};function Mt(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const T=tt.autoReset,q=At.enabled,J=At.autoUpdate,Q=At.needsUpdate,Y=At.type;W(),tt.autoReset=T,At.enabled=q,At.autoUpdate=J,At.needsUpdate=Q,At.type=Y}function pt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function lt(T){const q=T.target;q.removeEventListener("dispose",lt),Ft(q)}function Ft(T){qt(T),K.remove(T)}function qt(T){const q=K.get(T).programs;q!==void 0&&(q.forEach(function(J){$.releaseProgram(J)}),T.isShaderMaterial&&$.releaseShaderCache(T))}this.renderBufferDirect=function(T,q,J,Q,Y,xt){q===null&&(q=Dt);const Et=Y.isMesh&&Y.matrixWorld.determinant()<0,Nt=Im(T,q,J,Q,Y);V.setMaterial(Q,Et);let Pt=J.index,Vt=1;if(Q.wireframe===!0){if(Pt=S.getWireframeAttribute(J),Pt===void 0)return;Vt=2}const Xt=J.drawRange,kt=J.attributes.position;let ae=Xt.start*Vt,Me=(Xt.start+Xt.count)*Vt;xt!==null&&(ae=Math.max(ae,xt.start*Vt),Me=Math.min(Me,(xt.start+xt.count)*Vt)),Pt!==null?(ae=Math.max(ae,0),Me=Math.min(Me,Pt.count)):kt!=null&&(ae=Math.max(ae,0),Me=Math.min(Me,kt.count));const Oe=Me-ae;if(Oe<0||Oe===1/0)return;wt.setup(Y,Q,Nt,J,Pt);let Te,be=Tt;if(Pt!==null&&(Te=A.get(Pt),be=Wt,be.setIndex(Te)),Y.isMesh)Q.wireframe===!0?(V.setLineWidth(Q.wireframeLinewidth*me()),be.setMode(O.LINES)):be.setMode(O.TRIANGLES);else if(Y.isLine){let Ht=Q.linewidth;Ht===void 0&&(Ht=1),V.setLineWidth(Ht*me()),Y.isLineSegments?be.setMode(O.LINES):Y.isLineLoop?be.setMode(O.LINE_LOOP):be.setMode(O.LINE_STRIP)}else Y.isPoints?be.setMode(O.POINTS):Y.isSprite&&be.setMode(O.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Co("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),be.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(U.get("WEBGL_multi_draw"))be.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ht=Y._multiDrawStarts,Ie=Y._multiDrawCounts,ue=Y._multiDrawCount,Tn=Pt?A.get(Pt).bytesPerElement:1,er=K.get(Q).currentProgram.getUniforms();for(let An=0;An<ue;An++)er.setValue(O,"_gl_DrawID",An),be.render(Ht[An]/Tn,Ie[An])}else if(Y.isInstancedMesh)be.renderInstances(ae,Oe,Y.count);else if(J.isInstancedBufferGeometry){const Ht=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ie=Math.min(J.instanceCount,Ht);be.renderInstances(ae,Oe,Ie)}else be.render(ae,Oe)};function we(T,q,J){T.transparent===!0&&T.side===Pn&&T.forceSinglePass===!1?(T.side=wn,T.needsUpdate=!0,la(T,q,J),T.side=vs,T.needsUpdate=!0,la(T,q,J),T.side=Pn):la(T,q,J)}this.compile=function(T,q,J=null){J===null&&(J=T),m=bt.get(J),m.init(q),M.push(m),J.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),T!==J&&T.traverseVisible(function(Y){Y.isLight&&Y.layers.test(q.layers)&&(m.pushLight(Y),Y.castShadow&&m.pushShadow(Y))}),m.setupLights();const Q=new Set;return T.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const xt=Y.material;if(xt)if(Array.isArray(xt))for(let Et=0;Et<xt.length;Et++){const Nt=xt[Et];we(Nt,J,Y),Q.add(Nt)}else we(xt,J,Y),Q.add(xt)}),m=M.pop(),Q},this.compileAsync=function(T,q,J=null){const Q=this.compile(T,q,J);return new Promise(Y=>{function xt(){if(Q.forEach(function(Et){K.get(Et).currentProgram.isReady()&&Q.delete(Et)}),Q.size===0){Y(T);return}setTimeout(xt,10)}U.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ge=null;function Ii(T){ge&&ge(T)}function ui(){Es.stop()}function Gu(){Es.start()}const Es=new _p;Es.setAnimationLoop(Ii),typeof self<"u"&&Es.setContext(self),this.setAnimationLoop=function(T){ge=T,yt.setAnimationLoop(T),T===null?Es.stop():Es.start()},yt.addEventListener("sessionstart",ui),yt.addEventListener("sessionend",Gu),this.render=function(T,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),yt.enabled===!0&&yt.isPresenting===!0&&(yt.cameraAutoUpdate===!0&&yt.updateCamera(q),q=yt.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,q,D),m=bt.get(T,M.length),m.init(q),M.push(m),ot.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),oe.setFromProjectionMatrix(ot,_i,q.reversedDepth),st=this.localClippingEnabled,Zt=dt.init(this.clippingPlanes,st),g=Z.get(T,y.length),g.init(),y.push(g),yt.enabled===!0&&yt.isPresenting===!0){const xt=_.xr.getDepthSensingMesh();xt!==null&&zl(xt,q,-1/0,_.sortObjects)}zl(T,q,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(rt,gt),te=yt.enabled===!1||yt.isPresenting===!1||yt.hasDepthSensing()===!1,te&&Ut.addToRenderList(g,T),this.info.render.frame++,Zt===!0&&dt.beginShadows();const J=m.state.shadowsArray;At.render(J,T,q),Zt===!0&&dt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,Y=g.transmissive;if(m.setupLights(),q.isArrayCamera){const xt=q.cameras;if(Y.length>0)for(let Et=0,Nt=xt.length;Et<Nt;Et++){const Pt=xt[Et];Vu(Q,Y,T,Pt)}te&&Ut.render(T);for(let Et=0,Nt=xt.length;Et<Nt;Et++){const Pt=xt[Et];Hu(g,T,Pt,Pt.viewport)}}else Y.length>0&&Vu(Q,Y,T,q),te&&Ut.render(T),Hu(g,T,q);D!==null&&P===0&&(it.updateMultisampleRenderTarget(D),it.updateRenderTargetMipmap(D)),T.isScene===!0&&T.onAfterRender(_,T,q),wt.resetDefaultState(),E=-1,v=null,M.pop(),M.length>0?(m=M[M.length-1],Zt===!0&&dt.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function zl(T,q,J,Q){if(T.visible===!1)return;if(T.layers.test(q.layers)){if(T.isGroup)J=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(q);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||oe.intersectsSprite(T)){Q&&Ot.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ot);const Et=G.update(T),Nt=T.material;Nt.visible&&g.push(T,Et,Nt,J,Ot.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||oe.intersectsObject(T))){const Et=G.update(T),Nt=T.material;if(Q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ot.copy(T.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),Ot.copy(Et.boundingSphere.center)),Ot.applyMatrix4(T.matrixWorld).applyMatrix4(ot)),Array.isArray(Nt)){const Pt=Et.groups;for(let Vt=0,Xt=Pt.length;Vt<Xt;Vt++){const kt=Pt[Vt],ae=Nt[kt.materialIndex];ae&&ae.visible&&g.push(T,Et,ae,J,Ot.z,kt)}}else Nt.visible&&g.push(T,Et,Nt,J,Ot.z,null)}}const xt=T.children;for(let Et=0,Nt=xt.length;Et<Nt;Et++)zl(xt[Et],q,J,Q)}function Hu(T,q,J,Q){const Y=T.opaque,xt=T.transmissive,Et=T.transparent;m.setupLightsView(J),Zt===!0&&dt.setGlobalState(_.clippingPlanes,J),Q&&V.viewport(R.copy(Q)),Y.length>0&&aa(Y,q,J),xt.length>0&&aa(xt,q,J),Et.length>0&&aa(Et,q,J),V.buffers.depth.setTest(!0),V.buffers.depth.setMask(!0),V.buffers.color.setMask(!0),V.setPolygonOffset(!1)}function Vu(T,q,J,Q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Q.id]===void 0&&(m.state.transmissionRenderTarget[Q.id]=new qs(1,1,{generateMipmaps:!0,type:U.has("EXT_color_buffer_half_float")||U.has("EXT_color_buffer_float")?Xo:wi,minFilter:Vs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const xt=m.state.transmissionRenderTarget[Q.id],Et=Q.viewport||R;xt.setSize(Et.z*_.transmissionResolutionScale,Et.w*_.transmissionResolutionScale);const Nt=_.getRenderTarget(),Pt=_.getActiveCubeFace(),Vt=_.getActiveMipmapLevel();_.setRenderTarget(xt),_.getClearColor(k),B=_.getClearAlpha(),B<1&&_.setClearColor(16777215,.5),_.clear(),te&&Ut.render(J);const Xt=_.toneMapping;_.toneMapping=gs;const kt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),m.setupLightsView(Q),Zt===!0&&dt.setGlobalState(_.clippingPlanes,Q),aa(T,J,Q),it.updateMultisampleRenderTarget(xt),it.updateRenderTargetMipmap(xt),U.has("WEBGL_multisampled_render_to_texture")===!1){let ae=!1;for(let Me=0,Oe=q.length;Me<Oe;Me++){const Te=q[Me],be=Te.object,Ht=Te.geometry,Ie=Te.material,ue=Te.group;if(Ie.side===Pn&&be.layers.test(Q.layers)){const Tn=Ie.side;Ie.side=wn,Ie.needsUpdate=!0,Wu(be,J,Q,Ht,Ie,ue),Ie.side=Tn,Ie.needsUpdate=!0,ae=!0}}ae===!0&&(it.updateMultisampleRenderTarget(xt),it.updateRenderTargetMipmap(xt))}_.setRenderTarget(Nt,Pt,Vt),_.setClearColor(k,B),kt!==void 0&&(Q.viewport=kt),_.toneMapping=Xt}function aa(T,q,J){const Q=q.isScene===!0?q.overrideMaterial:null;for(let Y=0,xt=T.length;Y<xt;Y++){const Et=T[Y],Nt=Et.object,Pt=Et.geometry,Vt=Et.group;let Xt=Et.material;Xt.allowOverride===!0&&Q!==null&&(Xt=Q),Nt.layers.test(J.layers)&&Wu(Nt,q,J,Pt,Xt,Vt)}}function Wu(T,q,J,Q,Y,xt){T.onBeforeRender(_,q,J,Q,Y,xt),T.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),Y.onBeforeRender(_,q,J,Q,T,xt),Y.transparent===!0&&Y.side===Pn&&Y.forceSinglePass===!1?(Y.side=wn,Y.needsUpdate=!0,_.renderBufferDirect(J,q,Q,Y,T,xt),Y.side=vs,Y.needsUpdate=!0,_.renderBufferDirect(J,q,Q,Y,T,xt),Y.side=Pn):_.renderBufferDirect(J,q,Q,Y,T,xt),T.onAfterRender(_,q,J,Q,Y,xt)}function la(T,q,J){q.isScene!==!0&&(q=Dt);const Q=K.get(T),Y=m.state.lights,xt=m.state.shadowsArray,Et=Y.state.version,Nt=$.getParameters(T,Y.state,xt,q,J),Pt=$.getProgramCacheKey(Nt);let Vt=Q.programs;Q.environment=T.isMeshStandardMaterial?q.environment:null,Q.fog=q.fog,Q.envMap=(T.isMeshStandardMaterial?et:_t).get(T.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&T.envMap===null?q.environmentRotation:T.envMapRotation,Vt===void 0&&(T.addEventListener("dispose",lt),Vt=new Map,Q.programs=Vt);let Xt=Vt.get(Pt);if(Xt!==void 0){if(Q.currentProgram===Xt&&Q.lightsStateVersion===Et)return qu(T,Nt),Xt}else Nt.uniforms=$.getUniforms(T),T.onBeforeCompile(Nt,_),Xt=$.acquireProgram(Nt,Pt),Vt.set(Pt,Xt),Q.uniforms=Nt.uniforms;const kt=Q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(kt.clippingPlanes=dt.uniform),qu(T,Nt),Q.needsLights=Nm(T),Q.lightsStateVersion=Et,Q.needsLights&&(kt.ambientLightColor.value=Y.state.ambient,kt.lightProbe.value=Y.state.probe,kt.directionalLights.value=Y.state.directional,kt.directionalLightShadows.value=Y.state.directionalShadow,kt.spotLights.value=Y.state.spot,kt.spotLightShadows.value=Y.state.spotShadow,kt.rectAreaLights.value=Y.state.rectArea,kt.ltc_1.value=Y.state.rectAreaLTC1,kt.ltc_2.value=Y.state.rectAreaLTC2,kt.pointLights.value=Y.state.point,kt.pointLightShadows.value=Y.state.pointShadow,kt.hemisphereLights.value=Y.state.hemi,kt.directionalShadowMap.value=Y.state.directionalShadowMap,kt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,kt.spotShadowMap.value=Y.state.spotShadowMap,kt.spotLightMatrix.value=Y.state.spotLightMatrix,kt.spotLightMap.value=Y.state.spotLightMap,kt.pointShadowMap.value=Y.state.pointShadowMap,kt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=Xt,Q.uniformsList=null,Xt}function Xu(T){if(T.uniformsList===null){const q=T.currentProgram.getUniforms();T.uniformsList=el.seqWithValue(q.seq,T.uniforms)}return T.uniformsList}function qu(T,q){const J=K.get(T);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function Im(T,q,J,Q,Y){q.isScene!==!0&&(q=Dt),it.resetTextureUnits();const xt=q.fog,Et=Q.isMeshStandardMaterial?q.environment:null,Nt=D===null?_.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:zr,Pt=(Q.isMeshStandardMaterial?et:_t).get(Q.envMap||Et),Vt=Q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Xt=!!J.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),kt=!!J.morphAttributes.position,ae=!!J.morphAttributes.normal,Me=!!J.morphAttributes.color;let Oe=gs;Q.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Oe=_.toneMapping);const Te=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,be=Te!==void 0?Te.length:0,Ht=K.get(Q),Ie=m.state.lights;if(Zt===!0&&(st===!0||T!==v)){const fn=T===v&&Q.id===E;dt.setState(Q,T,fn)}let ue=!1;Q.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==Ie.state.version||Ht.outputColorSpace!==Nt||Y.isBatchedMesh&&Ht.batching===!1||!Y.isBatchedMesh&&Ht.batching===!0||Y.isBatchedMesh&&Ht.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Ht.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Ht.instancing===!1||!Y.isInstancedMesh&&Ht.instancing===!0||Y.isSkinnedMesh&&Ht.skinning===!1||!Y.isSkinnedMesh&&Ht.skinning===!0||Y.isInstancedMesh&&Ht.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Ht.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Ht.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Ht.instancingMorph===!1&&Y.morphTexture!==null||Ht.envMap!==Pt||Q.fog===!0&&Ht.fog!==xt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==dt.numPlanes||Ht.numIntersection!==dt.numIntersection)||Ht.vertexAlphas!==Vt||Ht.vertexTangents!==Xt||Ht.morphTargets!==kt||Ht.morphNormals!==ae||Ht.morphColors!==Me||Ht.toneMapping!==Oe||Ht.morphTargetsCount!==be)&&(ue=!0):(ue=!0,Ht.__version=Q.version);let Tn=Ht.currentProgram;ue===!0&&(Tn=la(Q,q,Y));let er=!1,An=!1,Qr=!1;const De=Tn.getUniforms(),Fn=Ht.uniforms;if(V.useProgram(Tn.program)&&(er=!0,An=!0,Qr=!0),Q.id!==E&&(E=Q.id,An=!0),er||v!==T){V.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),De.setValue(O,"projectionMatrix",T.projectionMatrix),De.setValue(O,"viewMatrix",T.matrixWorldInverse);const Mn=De.map.cameraPosition;Mn!==void 0&&Mn.setValue(O,Ct.setFromMatrixPosition(T.matrixWorld)),I.logarithmicDepthBuffer&&De.setValue(O,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&De.setValue(O,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,An=!0,Qr=!0)}if(Y.isSkinnedMesh){De.setOptional(O,Y,"bindMatrix"),De.setOptional(O,Y,"bindMatrixInverse");const fn=Y.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),De.setValue(O,"boneTexture",fn.boneTexture,it))}Y.isBatchedMesh&&(De.setOptional(O,Y,"batchingTexture"),De.setValue(O,"batchingTexture",Y._matricesTexture,it),De.setOptional(O,Y,"batchingIdTexture"),De.setValue(O,"batchingIdTexture",Y._indirectTexture,it),De.setOptional(O,Y,"batchingColorTexture"),Y._colorsTexture!==null&&De.setValue(O,"batchingColorTexture",Y._colorsTexture,it));const On=J.morphAttributes;if((On.position!==void 0||On.normal!==void 0||On.color!==void 0)&&ft.update(Y,J,Tn),(An||Ht.receiveShadow!==Y.receiveShadow)&&(Ht.receiveShadow=Y.receiveShadow,De.setValue(O,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Fn.envMap.value=Pt,Fn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&q.environment!==null&&(Fn.envMapIntensity.value=q.environmentIntensity),An&&(De.setValue(O,"toneMappingExposure",_.toneMappingExposure),Ht.needsLights&&Dm(Fn,Qr),xt&&Q.fog===!0&&at.refreshFogUniforms(Fn,xt),at.refreshMaterialUniforms(Fn,Q,X,j,m.state.transmissionRenderTarget[T.id]),el.upload(O,Xu(Ht),Fn,it)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(el.upload(O,Xu(Ht),Fn,it),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&De.setValue(O,"center",Y.center),De.setValue(O,"modelViewMatrix",Y.modelViewMatrix),De.setValue(O,"normalMatrix",Y.normalMatrix),De.setValue(O,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const fn=Q.uniformsGroups;for(let Mn=0,kl=fn.length;Mn<kl;Mn++){const Ts=fn[Mn];Yt.update(Ts,Tn),Yt.bind(Ts,Tn)}}return Tn}function Dm(T,q){T.ambientLightColor.needsUpdate=q,T.lightProbe.needsUpdate=q,T.directionalLights.needsUpdate=q,T.directionalLightShadows.needsUpdate=q,T.pointLights.needsUpdate=q,T.pointLightShadows.needsUpdate=q,T.spotLights.needsUpdate=q,T.spotLightShadows.needsUpdate=q,T.rectAreaLights.needsUpdate=q,T.hemisphereLights.needsUpdate=q}function Nm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(T,q,J){const Q=K.get(T);Q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),K.get(T.texture).__webglTexture=q,K.get(T.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:J,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,q){const J=K.get(T);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0};const Um=O.createFramebuffer();this.setRenderTarget=function(T,q=0,J=0){D=T,w=q,P=J;let Q=!0,Y=null,xt=!1,Et=!1;if(T){const Pt=K.get(T);if(Pt.__useDefaultFramebuffer!==void 0)V.bindFramebuffer(O.FRAMEBUFFER,null),Q=!1;else if(Pt.__webglFramebuffer===void 0)it.setupRenderTarget(T);else if(Pt.__hasExternalTextures)it.rebindTextures(T,K.get(T.texture).__webglTexture,K.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const kt=T.depthTexture;if(Pt.__boundDepthTexture!==kt){if(kt!==null&&K.has(kt)&&(T.width!==kt.image.width||T.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");it.setupDepthRenderbuffer(T)}}const Vt=T.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(Et=!0);const Xt=K.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Xt[q])?Y=Xt[q][J]:Y=Xt[q],xt=!0):T.samples>0&&it.useMultisampledRTT(T)===!1?Y=K.get(T).__webglMultisampledFramebuffer:Array.isArray(Xt)?Y=Xt[J]:Y=Xt,R.copy(T.viewport),N.copy(T.scissor),L=T.scissorTest}else R.copy(ht).multiplyScalar(X).floor(),N.copy(ut).multiplyScalar(X).floor(),L=Gt;if(J!==0&&(Y=Um),V.bindFramebuffer(O.FRAMEBUFFER,Y)&&Q&&V.drawBuffers(T,Y),V.viewport(R),V.scissor(N),V.setScissorTest(L),xt){const Pt=K.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+q,Pt.__webglTexture,J)}else if(Et){const Pt=q;for(let Vt=0;Vt<T.textures.length;Vt++){const Xt=K.get(T.textures[Vt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Vt,Xt.__webglTexture,J,Pt)}}else if(T!==null&&J!==0){const Pt=K.get(T.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Pt.__webglTexture,J)}E=-1},this.readRenderTargetPixels=function(T,q,J,Q,Y,xt,Et,Nt=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=K.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt){V.bindFramebuffer(O.FRAMEBUFFER,Pt);try{const Vt=T.textures[Nt],Xt=Vt.format,kt=Vt.type;if(!I.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!I.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=T.width-Q&&J>=0&&J<=T.height-Y&&(T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Nt),O.readPixels(q,J,Q,Y,Bt.convert(Xt),Bt.convert(kt),xt))}finally{const Vt=D!==null?K.get(D).__webglFramebuffer:null;V.bindFramebuffer(O.FRAMEBUFFER,Vt)}}},this.readRenderTargetPixelsAsync=async function(T,q,J,Q,Y,xt,Et,Nt=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=K.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Et!==void 0&&(Pt=Pt[Et]),Pt)if(q>=0&&q<=T.width-Q&&J>=0&&J<=T.height-Y){V.bindFramebuffer(O.FRAMEBUFFER,Pt);const Vt=T.textures[Nt],Xt=Vt.format,kt=Vt.type;if(!I.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!I.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ae=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,ae),O.bufferData(O.PIXEL_PACK_BUFFER,xt.byteLength,O.STREAM_READ),T.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Nt),O.readPixels(q,J,Q,Y,Bt.convert(Xt),Bt.convert(kt),0);const Me=D!==null?K.get(D).__webglFramebuffer:null;V.bindFramebuffer(O.FRAMEBUFFER,Me);const Oe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Gg(O,Oe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,ae),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,xt),O.deleteBuffer(ae),O.deleteSync(Oe),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,q=null,J=0){const Q=Math.pow(2,-J),Y=Math.floor(T.image.width*Q),xt=Math.floor(T.image.height*Q),Et=q!==null?q.x:0,Nt=q!==null?q.y:0;it.setTexture2D(T,0),O.copyTexSubImage2D(O.TEXTURE_2D,J,0,0,Et,Nt,Y,xt),V.unbindTexture()};const Fm=O.createFramebuffer(),Om=O.createFramebuffer();this.copyTextureToTexture=function(T,q,J=null,Q=null,Y=0,xt=null){xt===null&&(Y!==0?(Co("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xt=Y,Y=0):xt=0);let Et,Nt,Pt,Vt,Xt,kt,ae,Me,Oe;const Te=T.isCompressedTexture?T.mipmaps[xt]:T.image;if(J!==null)Et=J.max.x-J.min.x,Nt=J.max.y-J.min.y,Pt=J.isBox3?J.max.z-J.min.z:1,Vt=J.min.x,Xt=J.min.y,kt=J.isBox3?J.min.z:0;else{const On=Math.pow(2,-Y);Et=Math.floor(Te.width*On),Nt=Math.floor(Te.height*On),T.isDataArrayTexture?Pt=Te.depth:T.isData3DTexture?Pt=Math.floor(Te.depth*On):Pt=1,Vt=0,Xt=0,kt=0}Q!==null?(ae=Q.x,Me=Q.y,Oe=Q.z):(ae=0,Me=0,Oe=0);const be=Bt.convert(q.format),Ht=Bt.convert(q.type);let Ie;q.isData3DTexture?(it.setTexture3D(q,0),Ie=O.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(it.setTexture2DArray(q,0),Ie=O.TEXTURE_2D_ARRAY):(it.setTexture2D(q,0),Ie=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,q.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,q.unpackAlignment);const ue=O.getParameter(O.UNPACK_ROW_LENGTH),Tn=O.getParameter(O.UNPACK_IMAGE_HEIGHT),er=O.getParameter(O.UNPACK_SKIP_PIXELS),An=O.getParameter(O.UNPACK_SKIP_ROWS),Qr=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Te.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Te.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Vt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Xt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,kt);const De=T.isDataArrayTexture||T.isData3DTexture,Fn=q.isDataArrayTexture||q.isData3DTexture;if(T.isDepthTexture){const On=K.get(T),fn=K.get(q),Mn=K.get(On.__renderTarget),kl=K.get(fn.__renderTarget);V.bindFramebuffer(O.READ_FRAMEBUFFER,Mn.__webglFramebuffer),V.bindFramebuffer(O.DRAW_FRAMEBUFFER,kl.__webglFramebuffer);for(let Ts=0;Ts<Pt;Ts++)De&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,K.get(T).__webglTexture,Y,kt+Ts),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,K.get(q).__webglTexture,xt,Oe+Ts)),O.blitFramebuffer(Vt,Xt,Et,Nt,ae,Me,Et,Nt,O.DEPTH_BUFFER_BIT,O.NEAREST);V.bindFramebuffer(O.READ_FRAMEBUFFER,null),V.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(Y!==0||T.isRenderTargetTexture||K.has(T)){const On=K.get(T),fn=K.get(q);V.bindFramebuffer(O.READ_FRAMEBUFFER,Fm),V.bindFramebuffer(O.DRAW_FRAMEBUFFER,Om);for(let Mn=0;Mn<Pt;Mn++)De?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,On.__webglTexture,Y,kt+Mn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,On.__webglTexture,Y),Fn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,fn.__webglTexture,xt,Oe+Mn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,fn.__webglTexture,xt),Y!==0?O.blitFramebuffer(Vt,Xt,Et,Nt,ae,Me,Et,Nt,O.COLOR_BUFFER_BIT,O.NEAREST):Fn?O.copyTexSubImage3D(Ie,xt,ae,Me,Oe+Mn,Vt,Xt,Et,Nt):O.copyTexSubImage2D(Ie,xt,ae,Me,Vt,Xt,Et,Nt);V.bindFramebuffer(O.READ_FRAMEBUFFER,null),V.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Fn?T.isDataTexture||T.isData3DTexture?O.texSubImage3D(Ie,xt,ae,Me,Oe,Et,Nt,Pt,be,Ht,Te.data):q.isCompressedArrayTexture?O.compressedTexSubImage3D(Ie,xt,ae,Me,Oe,Et,Nt,Pt,be,Te.data):O.texSubImage3D(Ie,xt,ae,Me,Oe,Et,Nt,Pt,be,Ht,Te):T.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,xt,ae,Me,Et,Nt,be,Ht,Te.data):T.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,xt,ae,Me,Te.width,Te.height,be,Te.data):O.texSubImage2D(O.TEXTURE_2D,xt,ae,Me,Et,Nt,be,Ht,Te);O.pixelStorei(O.UNPACK_ROW_LENGTH,ue),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Tn),O.pixelStorei(O.UNPACK_SKIP_PIXELS,er),O.pixelStorei(O.UNPACK_SKIP_ROWS,An),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Qr),xt===0&&q.generateMipmaps&&O.generateMipmap(Ie),V.unbindTexture()},this.initRenderTarget=function(T){K.get(T).__webglFramebuffer===void 0&&it.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?it.setTextureCube(T,0):T.isData3DTexture?it.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?it.setTexture2DArray(T,0):it.setTexture2D(T,0),V.unbindTexture()},this.resetState=function(){w=0,P=0,D=null,V.reset(),wt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}function WM(){const t=new Uint8Array(16384);for(let n=0;n<64;n++)for(let s=0;s<64;s++){const r=Math.hypot((s-31.5)/31.5,(n-31.5)/31.5),o=(n*64+s)*4;t[o]=t[o+1]=t[o+2]=255,t[o+3]=Math.round(Math.max(0,1-r)**3*255)}const e=new p0(t,64,64);return e.magFilter=Vn,e.minFilter=Vn,e.needsUpdate=!0,e}const nu=WM();function iu(i,t,e=!1){const n=new Ce,s=new pe(e?new Zi(i*.64,48):new Js(i,20,12),new ke({color:e?400678:t,toneMapped:!1}));e&&(s.position.z=.06),n.add(s);const r=new Si(new ri({map:nu,color:t,transparent:!0,opacity:.8,depthWrite:!1,blending:rn}));if(r.scale.setScalar(i*(e?5:6)),r.position.z=e?0:i+.03,n.add(r),e)for(let d=0;d<3;d++){const f=new pe(new Zo(i*(.65+d*.16)-.012,i*(.65+d*.16)+.012,64),new ke({color:t,transparent:!0,opacity:.85-d*.18}));f.position.z=.08+d*.02,n.add(f)}const o=new wl(t,e?6:2,i*(e?6:8),2);o.position.z=.1,n.add(o);const a=new Float32Array(72),l=new Float32Array(24),c=new _e;c.setAttribute("position",new Pe(a,3)),c.setAttribute("heat",new Pe(l,1));const u=new Yn({transparent:!0,depthWrite:!1,blending:rn,uniforms:{tint:{value:new se(t)},pixelRatio:{value:1},fade:{value:1}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"uniform float fade; uniform vec3 tint; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(tint,vec3(1.),vHeat*.5),pow(1.-r,2.)*vHeat*.8*fade);}"}),h=new jo(c,u);return h.frustumCulled=!1,n.add(h),n.userData.setFade=d=>{s.material.transparent=!0,s.material.opacity=d,r.material.opacity*=d,u.uniforms.fade.value=d,o.intensity=(e?6:2)*d},n.userData.coreRadius=i,n.userData.animate=(d,f=1)=>{u.uniforms.pixelRatio.value=f,r.material.opacity=.7+Math.sin(d*3)*.08;for(let p=0;p<24;p++){const x=(d*(e?.5:.8)+p/24)%1,g=p*2.39996+x*.8,m=e?i*(.8+x*.8):i+x*(.45+i*.8);a.set([Math.cos(g)*m,Math.sin(g)*m,e?.12:i*.5],p*3),l[p]=(1-x)**2}c.attributes.position.needsUpdate=!0,c.attributes.heat.needsUpdate=!0},n}function Ep(i){const t=new Ce,e=new Si(new ri({map:nu,color:7890596,transparent:!0,opacity:.18,depthWrite:!1,blending:rn}));e.scale.setScalar(i*3.1),t.add(e);const n=new pe(new Zi(i*.72,48),new ke({color:0,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1,toneMapped:!1}));n.position.z=.12,n.renderOrder=1e3,t.add(n);for(const[s,r]of[[.86,.58],[1,.34]]){const o=new pe(new Zo(i*s-.018,i*s+.018,72),new ke({color:9074872,transparent:!0,opacity:r,side:Pn,depthWrite:!1}));o.position.z=.14,t.add(o)}return t.userData.coreRadius=i*.72,t.userData.animate=s=>{e.material.opacity=.14+.04*Math.sin(s*2.4)},t.userData.setFade=s=>{t.visible=s>0},t}function Tp(i=.22){const t=new Ce,e=new Si(new ri({map:nu,color:9004208,transparent:!0,opacity:.27,depthWrite:!1,blending:rn}));e.scale.setScalar(i*4.2),t.add(e);const n=new pe(new Js(i,18,12),new ke({color:5913209,toneMapped:!1}));n.position.z=.04,t.add(n);const s=[];for(let c=0;c<=64;c++){const u=c/64*Math.PI*2,h=1+.07*Math.sin(u*7)+.04*Math.cos(u*11);s.push(new H(Math.cos(u)*i*1.75*h,Math.sin(u)*i*1.75*h,.08))}const r=new jr(new _e().setFromPoints(s),new dn({color:10121661,transparent:!0,opacity:.55,depthWrite:!1}));t.add(r);const o=new Float32Array(27),a=new _e;a.setAttribute("position",new Pe(o,3).setUsage(Ei));const l=new jo(a,new ap({color:12027095,size:.055,transparent:!0,opacity:.45,depthWrite:!1}));return t.add(l),t.userData.coreRadius=i,t.userData.animate=c=>{r.rotation.z=c*.25,e.material.opacity=.22+.045*Math.sin(c*2.2);for(let u=0;u<9;u++){const h=(c*.24+u/9)%1,d=u*2.39996+c*.12,f=i*(1.25+h*2);o.set([Math.cos(d)*f,Math.sin(d)*f,.08],u*3)}a.attributes.position.needsUpdate=!0},t.userData.setFade=c=>{t.visible=c>0,n.material.opacity=c,n.material.transparent=!0,r.material.opacity=.55*c,l.material.opacity=.45*c},t}class ii{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){const t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){const t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){const e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new b);const e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new b);const n=this.elements,s=t.x,r=t.y,o=t.z;return e.x=n[0]*s+n[1]*r+n[2]*o,e.y=n[3]*s+n[4]*r+n[5]*o,e.z=n[6]*s+n[7]*r+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new ii);const n=this.elements,s=t.elements,r=e.elements,o=n[0],a=n[1],l=n[2],c=n[3],u=n[4],h=n[5],d=n[6],f=n[7],p=n[8],x=s[0],g=s[1],m=s[2],y=s[3],M=s[4],_=s[5],C=s[6],w=s[7],P=s[8];return r[0]=o*x+a*y+l*C,r[1]=o*g+a*M+l*w,r[2]=o*m+a*_+l*P,r[3]=c*x+u*y+h*C,r[4]=c*g+u*M+h*w,r[5]=c*m+u*_+h*P,r[6]=d*x+f*y+p*C,r[7]=d*g+f*M+p*w,r[8]=d*m+f*_+p*P,e}scale(t,e){e===void 0&&(e=new ii);const n=this.elements,s=e.elements;for(let r=0;r!==3;r++)s[3*r+0]=t.x*n[3*r+0],s[3*r+1]=t.y*n[3*r+1],s[3*r+2]=t.z*n[3*r+2];return e}solve(t,e){e===void 0&&(e=new b);const n=3,s=4,r=[];let o,a;for(o=0;o<n*s;o++)r.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)r[o+s*a]=this.elements[o+3*a];r[3]=t.x,r[7]=t.y,r[11]=t.z;let l=3;const c=l;let u;const h=4;let d;do{if(o=c-l,r[o+s*o]===0){for(a=o+1;a<c;a++)if(r[o+s*a]!==0){u=h;do d=h-u,r[d+s*o]+=r[d+s*a];while(--u);break}}if(r[o+s*o]!==0)for(a=o+1;a<c;a++){const f=r[o+s*a]/r[o+s*o];u=h;do d=h-u,r[d+s*a]=d<=o?0:r[d+s*a]-r[d+s*o]*f;while(--u)}}while(--l);if(e.z=r[2*s+3]/r[2*s+2],e.y=(r[1*s+3]-r[1*s+2]*e.z)/r[1*s+1],e.x=(r[0*s+3]-r[0*s+2]*e.z-r[0*s+1]*e.y)/r[0*s+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new ii);const e=3,n=6,s=XM;let r,o;for(r=0;r<3;r++)for(o=0;o<3;o++)s[r+n*o]=this.elements[r+3*o];s[3]=1,s[9]=0,s[15]=0,s[4]=0,s[10]=1,s[16]=0,s[5]=0,s[11]=0,s[17]=1;let a=3;const l=a;let c;const u=n;let h;do{if(r=l-a,s[r+n*r]===0){for(o=r+1;o<l;o++)if(s[r+n*o]!==0){c=u;do h=u-c,s[h+n*r]+=s[h+n*o];while(--c);break}}if(s[r+n*r]!==0)for(o=r+1;o<l;o++){const d=s[r+n*o]/s[r+n*r];c=u;do h=u-c,s[h+n*o]=h<=r?0:s[h+n*o]-s[h+n*r]*d;while(--c)}}while(--a);r=2;do{o=r-1;do{const d=s[r+n*o]/s[r+n*r];c=n;do h=n-c,s[h+n*o]=s[h+n*o]-s[h+n*r]*d;while(--c)}while(o--)}while(--r);r=2;do{const d=1/s[r+n*r];c=n;do h=n-c,s[h+n*r]=s[h+n*r]*d;while(--c)}while(r--);r=2;do{o=2;do{if(h=s[e+o+n*r],isNaN(h)||h===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,o,h)}while(o--)}while(r--);return t}setRotationFromQuaternion(t){const e=t.x,n=t.y,s=t.z,r=t.w,o=e+e,a=n+n,l=s+s,c=e*o,u=e*a,h=e*l,d=n*a,f=n*l,p=s*l,x=r*o,g=r*a,m=r*l,y=this.elements;return y[0]=1-(d+p),y[1]=u-m,y[2]=h+g,y[3]=u+m,y[4]=1-(c+p),y[5]=f-x,y[6]=h-g,y[7]=f+x,y[8]=1-(c+d),this}transpose(t){t===void 0&&(t=new ii);const e=this.elements,n=t.elements;let s;return n[0]=e[0],n[4]=e[4],n[8]=e[8],s=e[1],n[1]=e[3],n[3]=s,s=e[2],n[2]=e[6],n[6]=s,s=e[5],n[5]=e[7],n[7]=s,t}}const XM=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class b{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new b);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z;return e.x=a*r-l*s,e.y=l*n-o*r,e.z=o*s-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new b(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new b(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new ii([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const t=this.x,e=this.y,n=this.z,s=Math.sqrt(t*t+e*e+n*n);if(s>0){const r=1/s;this.x*=r,this.y*=r,this.z*=r}else this.x=0,this.y=0,this.z=0;return s}unit(t){t===void 0&&(t=new b);const e=this.x,n=this.y,s=this.z;let r=Math.sqrt(e*e+n*n+s*s);return r>0?(r=1/r,t.x=e*r,t.y=n*r,t.z=s*r):(t.x=1,t.y=0,t.z=0),t}length(){const t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return Math.sqrt((r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s))}distanceSquared(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z;return(r-e)*(r-e)+(o-n)*(o-n)+(a-s)*(a-s)}scale(t,e){e===void 0&&(e=new b);const n=this.x,s=this.y,r=this.z;return e.x=t*n,e.y=t*s,e.z=t*r,e}vmul(t,e){return e===void 0&&(e=new b),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new b),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new b),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){const n=this.length();if(n>0){const s=qM,r=1/n;s.set(this.x*r,this.y*r,this.z*r);const o=YM;Math.abs(s.x)<.9?(o.set(1,0,0),s.cross(o,t)):(o.set(0,1,0),s.cross(o,t)),s.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){const s=this.x,r=this.y,o=this.z;n.x=s+(t.x-s)*e,n.y=r+(t.y-r)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(sf),sf.almostEquals(t,e)}clone(){return new b(this.x,this.y,this.z)}}b.ZERO=new b(0,0,0);b.UNIT_X=new b(1,0,0);b.UNIT_Y=new b(0,1,0);b.UNIT_Z=new b(0,0,1);const qM=new b,YM=new b,sf=new b;class Un{constructor(t){t===void 0&&(t={}),this.lowerBound=new b,this.upperBound=new b,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,s){const r=this.lowerBound,o=this.upperBound,a=n;r.copy(t[0]),a&&a.vmult(r,r),o.copy(r);for(let l=1;l<t.length;l++){let c=t[l];a&&(a.vmult(c,rf),c=rf),c.x>o.x&&(o.x=c.x),c.x<r.x&&(r.x=c.x),c.y>o.y&&(o.y=c.y),c.y<r.y&&(r.y=c.y),c.z>o.z&&(o.z=c.z),c.z<r.z&&(r.z=c.z)}return e&&(e.vadd(r,r),e.vadd(o,o)),s&&(r.x-=s,r.y-=s,r.z-=s,o.x+=s,o.y+=s,o.z+=s),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new Un().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound,o=s.x<=n.x&&n.x<=r.x||e.x<=r.x&&r.x<=n.x,a=s.y<=n.y&&n.y<=r.y||e.y<=r.y&&r.y<=n.y,l=s.z<=n.z&&n.z<=r.z||e.z<=r.z&&r.z<=n.z;return o&&a&&l}volume(){const t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){const e=this.lowerBound,n=this.upperBound,s=t.lowerBound,r=t.upperBound;return e.x<=s.x&&n.x>=r.x&&e.y<=s.y&&n.y>=r.y&&e.z<=s.z&&n.z>=r.z}getCorners(t,e,n,s,r,o,a,l){const c=this.lowerBound,u=this.upperBound;t.copy(c),e.set(u.x,c.y,c.z),n.set(u.x,u.y,c.z),s.set(c.x,u.y,u.z),r.set(u.x,c.y,u.z),o.set(c.x,u.y,c.z),a.set(c.x,c.y,u.z),l.copy(u)}toLocalFrame(t,e){const n=of,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],u=n[6],h=n[7];this.getCorners(s,r,o,a,l,c,u,h);for(let d=0;d!==8;d++){const f=n[d];t.pointToLocal(f,f)}return e.setFromPoints(n)}toWorldFrame(t,e){const n=of,s=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],u=n[6],h=n[7];this.getCorners(s,r,o,a,l,c,u,h);for(let d=0;d!==8;d++){const f=n[d];t.pointToWorld(f,f)}return e.setFromPoints(n)}overlapsRay(t){const{direction:e,from:n}=t,s=1/e.x,r=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*s,l=(this.upperBound.x-n.x)*s,c=(this.lowerBound.y-n.y)*r,u=(this.upperBound.y-n.y)*r,h=(this.lowerBound.z-n.z)*o,d=(this.upperBound.z-n.z)*o,f=Math.max(Math.max(Math.min(a,l),Math.min(c,u)),Math.min(h,d)),p=Math.min(Math.min(Math.max(a,l),Math.max(c,u)),Math.max(h,d));return!(p<0||f>p)}}const rf=new b,of=[new b,new b,new b,new b,new b,new b,new b,new b];class af{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:s}=e;if(s>n){const r=s;s=n,n=r}return this.matrix[(n*(n+1)>>1)+s-1]}set(t,e,n){let{index:s}=t,{index:r}=e;if(r>s){const o=r;r=s,s=o}this.matrix[(s*(s+1)>>1)+r-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}}class Ap{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;const n=this._listeners;if(n[t]===void 0)return this;const s=n[t].indexOf(e);return s!==-1&&n[t].splice(s,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;const n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let s=0,r=n.length;s<r;s++)n[s].call(this,t)}return this}}class qe{constructor(t,e,n,s){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),s===void 0&&(s=1),this.x=t,this.y=e,this.z=n,this.w=s}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){const n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new b),this.normalize();const e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){const n=$M,s=jM;t.tangents(n,s),this.setFromAxisAngle(n,Math.PI)}else{const n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new qe);const n=this.x,s=this.y,r=this.z,o=this.w,a=t.x,l=t.y,c=t.z,u=t.w;return e.x=n*u+o*a+s*c-r*l,e.y=s*u+o*l+r*a-n*c,e.z=r*u+o*c+n*l-s*a,e.w=o*u-n*a-s*l-r*c,e}inverse(t){t===void 0&&(t=new qe);const e=this.x,n=this.y,s=this.z,r=this.w;this.conjugate(t);const o=1/(e*e+n*n+s*s+r*r);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new qe),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){const t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new b);const n=t.x,s=t.y,r=t.z,o=this.x,a=this.y,l=this.z,c=this.w,u=c*n+a*r-l*s,h=c*s+l*n-o*r,d=c*r+o*s-a*n,f=-o*n-a*s-l*r;return e.x=u*c+f*-o+h*-l-d*-a,e.y=h*c+f*-a+d*-o-u*-l,e.z=d*c+f*-l+u*-a-h*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,s,r;const o=this.x,a=this.y,l=this.z,c=this.w;switch(e){case"YZX":const u=o*a+l*c;if(u>.499&&(n=2*Math.atan2(o,c),s=Math.PI/2,r=0),u<-.499&&(n=-2*Math.atan2(o,c),s=-Math.PI/2,r=0),n===void 0){const h=o*o,d=a*a,f=l*l;n=Math.atan2(2*a*c-2*o*l,1-2*d-2*f),s=Math.asin(2*u),r=Math.atan2(2*o*c-2*a*l,1-2*h-2*f)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=s,t.x=r}setFromEuler(t,e,n,s){s===void 0&&(s="XYZ");const r=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),l=Math.sin(t/2),c=Math.sin(e/2),u=Math.sin(n/2);return s==="XYZ"?(this.x=l*o*a+r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a-l*c*u):s==="YXZ"?(this.x=l*o*a+r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a+l*c*u):s==="ZXY"?(this.x=l*o*a-r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a-l*c*u):s==="ZYX"?(this.x=l*o*a-r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a+l*c*u):s==="YZX"?(this.x=l*o*a+r*c*u,this.y=r*c*a+l*o*u,this.z=r*o*u-l*c*a,this.w=r*o*a-l*c*u):s==="XZY"&&(this.x=l*o*a-r*c*u,this.y=r*c*a-l*o*u,this.z=r*o*u+l*c*a,this.w=r*o*a+l*c*u),this}clone(){return new qe(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new qe);const s=this.x,r=this.y,o=this.z,a=this.w;let l=t.x,c=t.y,u=t.z,h=t.w,d,f,p,x,g;return f=s*l+r*c+o*u+a*h,f<0&&(f=-f,l=-l,c=-c,u=-u,h=-h),1-f>1e-6?(d=Math.acos(f),p=Math.sin(d),x=Math.sin((1-e)*d)/p,g=Math.sin(e*d)/p):(x=1-e,g=e),n.x=x*s+g*l,n.y=x*r+g*c,n.z=x*o+g*u,n.w=x*a+g*h,n}integrate(t,e,n,s){s===void 0&&(s=new qe);const r=t.x*n.x,o=t.y*n.y,a=t.z*n.z,l=this.x,c=this.y,u=this.z,h=this.w,d=e*.5;return s.x+=d*(r*h+o*u-a*c),s.y+=d*(o*h+a*l-r*u),s.z+=d*(a*h+r*c-o*l),s.w+=d*(-r*l-o*c-a*u),s}}const $M=new b,jM=new b,ZM={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class Lt{constructor(t){t===void 0&&(t={}),this.id=Lt.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,s){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}Lt.idCounter=0;Lt.types=ZM;class fe{constructor(t){t===void 0&&(t={}),this.position=new b,this.quaternion=new qe,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return fe.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return fe.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,s){return s===void 0&&(s=new b),n.vsub(t,s),e.conjugate(lf),lf.vmult(s,s),s}static pointToWorldFrame(t,e,n,s){return s===void 0&&(s=new b),e.vmult(n,s),s.vadd(t,s),s}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new b),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,s){return s===void 0&&(s=new b),e.w*=-1,e.vmult(n,s),e.w*=-1,s}}const lf=new qe;class Dr extends Lt{constructor(t){t===void 0&&(t={});const{vertices:e=[],faces:n=[],normals:s=[],axes:r,boundingSphereRadius:o}=t;super({type:Lt.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=s,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=r?r.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;const s=new b;for(let r=0;r!==t.length;r++){const o=t[r],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;e[o[l]].vsub(e[o[c]],s),s.normalize();let u=!1;for(let h=0;h!==n.length;h++)if(n[h].almostEquals(s)||n[h].almostEquals(s)){u=!0;break}u||n.push(s.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let s=0;s<this.faces[t].length;s++)if(!this.vertices[this.faces[t][s]])throw new Error(`Vertex ${this.faces[t][s]} not found!`);const e=this.faceNormals[t]||new b;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;const n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let s=0;s<this.faces[t].length;s++)console.warn(`.vertices[${this.faces[t][s]}] = Vec3(${this.vertices[this.faces[t][s]].toString()})`)}}}getFaceNormal(t,e){const n=this.faces[t],s=this.vertices[n[0]],r=this.vertices[n[1]],o=this.vertices[n[2]];Dr.computeNormal(s,r,o,e)}static computeNormal(t,e,n,s){const r=new b,o=new b;e.vsub(t,o),n.vsub(e,r),r.cross(o,s),s.isZero()||s.normalize()}clipAgainstHull(t,e,n,s,r,o,a,l,c){const u=new b;let h=-1,d=-Number.MAX_VALUE;for(let p=0;p<n.faces.length;p++){u.copy(n.faceNormals[p]),r.vmult(u,u);const x=u.dot(o);x>d&&(d=x,h=p)}const f=[];for(let p=0;p<n.faces[h].length;p++){const x=n.vertices[n.faces[h][p]],g=new b;g.copy(x),r.vmult(g,g),s.vadd(g,g),f.push(g)}h>=0&&this.clipFaceAgainstHull(o,t,e,f,a,l,c)}findSeparatingAxis(t,e,n,s,r,o,a,l){const c=new b,u=new b,h=new b,d=new b,f=new b,p=new b;let x=Number.MAX_VALUE;const g=this;if(g.uniqueAxes)for(let m=0;m!==g.uniqueAxes.length;m++){n.vmult(g.uniqueAxes[m],c);const y=g.testSepAxis(c,t,e,n,s,r);if(y===!1)return!1;y<x&&(x=y,o.copy(c))}else{const m=a?a.length:g.faces.length;for(let y=0;y<m;y++){const M=a?a[y]:y;c.copy(g.faceNormals[M]),n.vmult(c,c);const _=g.testSepAxis(c,t,e,n,s,r);if(_===!1)return!1;_<x&&(x=_,o.copy(c))}}if(t.uniqueAxes)for(let m=0;m!==t.uniqueAxes.length;m++){r.vmult(t.uniqueAxes[m],u);const y=g.testSepAxis(u,t,e,n,s,r);if(y===!1)return!1;y<x&&(x=y,o.copy(u))}else{const m=l?l.length:t.faces.length;for(let y=0;y<m;y++){const M=l?l[y]:y;u.copy(t.faceNormals[M]),r.vmult(u,u);const _=g.testSepAxis(u,t,e,n,s,r);if(_===!1)return!1;_<x&&(x=_,o.copy(u))}}for(let m=0;m!==g.uniqueEdges.length;m++){n.vmult(g.uniqueEdges[m],d);for(let y=0;y!==t.uniqueEdges.length;y++)if(r.vmult(t.uniqueEdges[y],f),d.cross(f,p),!p.almostZero()){p.normalize();const M=g.testSepAxis(p,t,e,n,s,r);if(M===!1)return!1;M<x&&(x=M,o.copy(p))}}return s.vsub(e,h),h.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,s,r,o){const a=this;Dr.project(a,t,n,s,wc),Dr.project(e,t,r,o,Ec);const l=wc[0],c=wc[1],u=Ec[0],h=Ec[1];if(l<h||u<c)return!1;const d=l-h,f=u-c;return d<f?d:f}calculateLocalInertia(t,e){const n=new b,s=new b;this.computeLocalAABB(s,n);const r=n.x-s.x,o=n.y-s.y,a=n.z-s.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*r*2*r+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*r*2*r)}getPlaneConstantOfFace(t){const e=this.faces[t],n=this.faceNormals[t],s=this.vertices[e[0]];return-n.dot(s)}clipFaceAgainstHull(t,e,n,s,r,o,a){const l=new b,c=new b,u=new b,h=new b,d=new b,f=new b,p=new b,x=new b,g=this,m=[],y=s,M=m;let _=-1,C=Number.MAX_VALUE;for(let v=0;v<g.faces.length;v++){l.copy(g.faceNormals[v]),n.vmult(l,l);const R=l.dot(t);R<C&&(C=R,_=v)}if(_<0)return;const w=g.faces[_];w.connectedFaces=[];for(let v=0;v<g.faces.length;v++)for(let R=0;R<g.faces[v].length;R++)w.indexOf(g.faces[v][R])!==-1&&v!==_&&w.connectedFaces.indexOf(v)===-1&&w.connectedFaces.push(v);const P=w.length;for(let v=0;v<P;v++){const R=g.vertices[w[v]],N=g.vertices[w[(v+1)%P]];R.vsub(N,c),u.copy(c),n.vmult(u,u),e.vadd(u,u),h.copy(this.faceNormals[_]),n.vmult(h,h),e.vadd(h,h),u.cross(h,d),d.negate(d),f.copy(R),n.vmult(f,f),e.vadd(f,f);const L=w.connectedFaces[v];p.copy(this.faceNormals[L]);const k=this.getPlaneConstantOfFace(L);x.copy(p),n.vmult(x,x);const B=k-x.dot(e);for(this.clipFaceAgainstPlane(y,M,x,B);y.length;)y.shift();for(;M.length;)y.push(M.shift())}p.copy(this.faceNormals[_]);const D=this.getPlaneConstantOfFace(_);x.copy(p),n.vmult(x,x);const E=D-x.dot(e);for(let v=0;v<y.length;v++){let R=x.dot(y[v])+E;if(R<=r&&(console.log(`clamped: depth=${R} to minDist=${r}`),R=r),R<=o){const N=y[v];if(R<=1e-6){const L={point:N,normal:x,depth:R};a.push(L)}}}}clipFaceAgainstPlane(t,e,n,s){let r,o;const a=t.length;if(a<2)return e;let l=t[t.length-1],c=t[0];r=n.dot(l)+s;for(let u=0;u<a;u++){if(c=t[u],o=n.dot(c)+s,r<0)if(o<0){const h=new b;h.copy(c),e.push(h)}else{const h=new b;l.lerp(c,r/(r-o),h),e.push(h)}else if(o<0){const h=new b;l.lerp(c,r/(r-o),h),e.push(h),e.push(c)}l=c,r=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new b);const n=this.vertices,s=this.worldVertices;for(let r=0;r!==this.vertices.length;r++)e.vmult(n[r],s[r]),t.vadd(s[r],s[r]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){const n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let s=0;s<this.vertices.length;s++){const r=n[s];r.x<t.x?t.x=r.x:r.x>e.x&&(e.x=r.x),r.y<t.y?t.y=r.y:r.y>e.y&&(e.y=r.y),r.z<t.z?t.z=r.z:r.z>e.z&&(e.z=r.z)}}computeWorldFaceNormals(t){const e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new b);const n=this.faceNormals,s=this.worldFaceNormals;for(let r=0;r!==e;r++)t.vmult(n[r],s[r]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0;const e=this.vertices;for(let n=0;n!==e.length;n++){const s=e[n].lengthSquared();s>t&&(t=s)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,s){const r=this.vertices;let o,a,l,c,u,h,d=new b;for(let f=0;f<r.length;f++){d.copy(r[f]),e.vmult(d,d),t.vadd(d,d);const p=d;(o===void 0||p.x<o)&&(o=p.x),(c===void 0||p.x>c)&&(c=p.x),(a===void 0||p.y<a)&&(a=p.y),(u===void 0||p.y>u)&&(u=p.y),(l===void 0||p.z<l)&&(l=p.z),(h===void 0||p.z>h)&&(h=p.z)}n.set(o,a,l),s.set(c,u,h)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new b);const e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){const n=this.vertices.length,s=this.vertices;if(e){for(let r=0;r<n;r++){const o=s[r];e.vmult(o,o)}for(let r=0;r<this.faceNormals.length;r++){const o=this.faceNormals[r];e.vmult(o,o)}}if(t)for(let r=0;r<n;r++){const o=s[r];o.vadd(t,o)}}pointIsInside(t){const e=this.vertices,n=this.faces,s=this.faceNormals,r=new b;this.getAveragePointLocal(r);for(let o=0;o<this.faces.length;o++){let a=s[o];const l=e[n[o][0]],c=new b;t.vsub(l,c);const u=a.dot(c),h=new b;r.vsub(l,h);const d=a.dot(h);if(u<0&&d>0||u>0&&d<0)return!1}return-1}static project(t,e,n,s,r){const o=t.vertices.length,a=KM;let l=0,c=0;const u=JM,h=t.vertices;u.setZero(),fe.vectorToLocalFrame(n,s,e,a),fe.pointToLocalFrame(n,s,u,u);const d=u.dot(a);c=l=h[0].dot(a);for(let f=1;f<o;f++){const p=h[f].dot(a);p>l&&(l=p),p<c&&(c=p)}if(c-=d,l-=d,c>l){const f=c;c=l,l=f}r[0]=l,r[1]=c}}const wc=[],Ec=[];new b;const KM=new b,JM=new b;class Tl extends Lt{constructor(t){super({type:Lt.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,s=b,r=[new s(-t,-e,-n),new s(t,-e,-n),new s(t,e,-n),new s(-t,e,-n),new s(-t,-e,n),new s(t,-e,n),new s(t,e,n),new s(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new s(0,0,1),new s(0,1,0),new s(1,0,0)],l=new Dr({vertices:r,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new b),Tl.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){const s=t;n.x=1/12*e*(2*s.y*2*s.y+2*s.z*2*s.z),n.y=1/12*e*(2*s.x*2*s.x+2*s.z*2*s.z),n.z=1/12*e*(2*s.y*2*s.y+2*s.x*2*s.x)}getSideNormals(t,e){const n=t,s=this.halfExtents;if(n[0].set(s.x,0,0),n[1].set(0,s.y,0),n[2].set(0,0,s.z),n[3].set(-s.x,0,0),n[4].set(0,-s.y,0),n[5].set(0,0,-s.z),e!==void 0)for(let r=0;r!==n.length;r++)e.vmult(n[r],n[r]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){const s=this.halfExtents,r=[[s.x,s.y,s.z],[-s.x,s.y,s.z],[-s.x,-s.y,s.z],[-s.x,-s.y,-s.z],[s.x,-s.y,-s.z],[s.x,s.y,-s.z],[-s.x,s.y,-s.z],[s.x,-s.y,s.z]];for(let o=0;o<r.length;o++)ls.set(r[o][0],r[o][1],r[o][2]),e.vmult(ls,ls),t.vadd(ls,ls),n(ls.x,ls.y,ls.z)}calculateWorldAABB(t,e,n,s){const r=this.halfExtents;di[0].set(r.x,r.y,r.z),di[1].set(-r.x,r.y,r.z),di[2].set(-r.x,-r.y,r.z),di[3].set(-r.x,-r.y,-r.z),di[4].set(r.x,-r.y,-r.z),di[5].set(r.x,r.y,-r.z),di[6].set(-r.x,r.y,-r.z),di[7].set(r.x,-r.y,r.z);const o=di[0];e.vmult(o,o),t.vadd(o,o),s.copy(o),n.copy(o);for(let a=1;a<8;a++){const l=di[a];e.vmult(l,l),t.vadd(l,l);const c=l.x,u=l.y,h=l.z;c>s.x&&(s.x=c),u>s.y&&(s.y=u),h>s.z&&(s.z=h),c<n.x&&(n.x=c),u<n.y&&(n.y=u),h<n.z&&(n.z=h)}}}const ls=new b,di=[new b,new b,new b,new b,new b,new b,new b,new b],su={DYNAMIC:1,STATIC:2,KINEMATIC:4},ru={AWAKE:0,SLEEPY:1,SLEEPING:2};class Rt extends Ap{constructor(t){t===void 0&&(t={}),super(),this.id=Rt.idCounter++,this.index=-1,this.world=null,this.vlambda=new b,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new b,this.previousPosition=new b,this.interpolatedPosition=new b,this.initPosition=new b,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new b,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new b,this.force=new b;const e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?Rt.STATIC:Rt.DYNAMIC,typeof t.type==typeof Rt.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=Rt.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new b,this.quaternion=new qe,this.initQuaternion=new qe,this.previousQuaternion=new qe,this.interpolatedQuaternion=new qe,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new b,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new b,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new b,this.invInertia=new b,this.invInertiaWorld=new ii,this.invMassSolve=0,this.invInertiaSolve=new b,this.invInertiaWorldSolve=new ii,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new b(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new b(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Un,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new b,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){const t=this.sleepState;this.sleepState=Rt.AWAKE,this.wakeUpAfterNarrowphase=!1,t===Rt.SLEEPING&&this.dispatchEvent(Rt.wakeupEvent)}sleep(){this.sleepState=Rt.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){const e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),s=this.sleepSpeedLimit**2;e===Rt.AWAKE&&n<s?(this.sleepState=Rt.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(Rt.sleepyEvent)):e===Rt.SLEEPY&&n>s?this.wakeUp():e===Rt.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(Rt.sleepEvent))}}updateSolveMassProperties(){this.sleepState===Rt.SLEEPING||this.type===Rt.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new b),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new b),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new b),this.quaternion.vmult(t,e),e}addShape(t,e,n){const s=new b,r=new qe;return e&&s.copy(e),n&&r.copy(n),this.shapes.push(t),this.shapeOffsets.push(s),this.shapeOrientations.push(r),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){const e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){const t=this.shapes,e=this.shapeOffsets,n=t.length;let s=0;for(let r=0;r!==n;r++){const o=t[r];o.updateBoundingSphereRadius();const a=e[r].length(),l=o.boundingSphereRadius;a+l>s&&(s=a+l)}this.boundingRadius=s}updateAABB(){const t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,s=t.length,r=QM,o=tS,a=this.quaternion,l=this.aabb,c=eS;for(let u=0;u!==s;u++){const h=t[u];a.vmult(e[u],r),r.vadd(this.position,r),a.mult(n[u],o),h.calculateWorldAABB(r,o,c.lowerBound,c.upperBound),u===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){const e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){const n=nS,s=iS;n.setRotationFromQuaternion(this.quaternion),n.transpose(s),n.scale(e,n),n.mmult(s,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new b),this.type!==Rt.DYNAMIC)return;this.sleepState===Rt.SLEEPING&&this.wakeUp();const n=sS;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new b),this.type!==Rt.DYNAMIC)return;const n=rS,s=oS;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyForce(n,s)}applyTorque(t){this.type===Rt.DYNAMIC&&(this.sleepState===Rt.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new b),this.type!==Rt.DYNAMIC)return;this.sleepState===Rt.SLEEPING&&this.wakeUp();const n=e,s=aS;s.copy(t),s.scale(this.invMass,s),this.velocity.vadd(s,this.velocity);const r=lS;n.cross(t,r),this.invInertiaWorld.vmult(r,r),this.angularVelocity.vadd(r,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new b),this.type!==Rt.DYNAMIC)return;const n=cS,s=hS;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,s),this.applyImpulse(n,s)}updateMassProperties(){const t=uS;this.invMass=this.mass>0?1/this.mass:0;const e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),Tl.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){const n=new b;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===Rt.DYNAMIC||this.type===Rt.KINEMATIC)||this.sleepState===Rt.SLEEPING)return;const s=this.velocity,r=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,u=this.invMass,h=this.invInertiaWorld,d=this.linearFactor,f=u*t;s.x+=a.x*f*d.x,s.y+=a.y*f*d.y,s.z+=a.z*f*d.z;const p=h.elements,x=this.angularFactor,g=l.x*x.x,m=l.y*x.y,y=l.z*x.z;r.x+=t*(p[0]*g+p[1]*m+p[2]*y),r.y+=t*(p[3]*g+p[4]*m+p[5]*y),r.z+=t*(p[6]*g+p[7]*m+p[8]*y),o.x+=s.x*t,o.y+=s.y*t,o.z+=s.z*t,c.integrate(this.angularVelocity,t,this.angularFactor,c),e&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}Rt.idCounter=0;Rt.COLLIDE_EVENT_NAME="collide";Rt.DYNAMIC=su.DYNAMIC;Rt.STATIC=su.STATIC;Rt.KINEMATIC=su.KINEMATIC;Rt.AWAKE=ru.AWAKE;Rt.SLEEPY=ru.SLEEPY;Rt.SLEEPING=ru.SLEEPING;Rt.wakeupEvent={type:"wakeup"};Rt.sleepyEvent={type:"sleepy"};Rt.sleepEvent={type:"sleep"};const QM=new b,tS=new qe,eS=new Un,nS=new ii,iS=new ii;new ii;const sS=new b,rS=new b,oS=new b,aS=new b,lS=new b,cS=new b,hS=new b,uS=new b;class dS{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&Rt.STATIC)!==0||t.sleepState===Rt.SLEEPING)&&((e.type&Rt.STATIC)!==0||e.sleepState===Rt.SLEEPING))}intersectionTest(t,e,n,s){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,s):this.doBoundingSphereBroadphase(t,e,n,s)}doBoundingSphereBroadphase(t,e,n,s){const r=fS;e.position.vsub(t.position,r);const o=(t.boundingRadius+e.boundingRadius)**2;r.lengthSquared()<o&&(n.push(t),s.push(e))}doBoundingBoxBroadphase(t,e,n,s){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),s.push(e))}makePairsUnique(t,e){const n=pS,s=mS,r=gS,o=t.length;for(let a=0;a!==o;a++)s[a]=t[a],r[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){const l=s[a].id,c=r[a].id,u=l<c?`${l},${c}`:`${c},${l}`;n[u]=a,n.keys.push(u)}for(let a=0;a!==n.keys.length;a++){const l=n.keys.pop(),c=n[l];t.push(s[c]),e.push(r[c]),delete n[l]}}setWorld(t){}static boundingSphereCheck(t,e){const n=new b;t.position.vsub(e.position,n);const s=t.shapes[0],r=e.shapes[0];return Math.pow(s.boundingSphereRadius+r.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const fS=new b;new b;new qe;new b;const pS={keys:[]},mS=[],gS=[];new b;new b;new b;class xS extends dS{constructor(){super()}collisionPairs(t,e,n){const s=t.bodies,r=s.length;let o,a;for(let l=0;l!==r;l++)for(let c=0;c!==l;c++)o=s[l],a=s[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let s=0;s<t.bodies.length;s++){const r=t.bodies[s];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(e)&&n.push(r)}return n}}class gl{constructor(){this.rayFromWorld=new b,this.rayToWorld=new b,this.hitNormalWorld=new b,this.hitPointWorld=new b,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,s,r,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(s),this.shape=r,this.body=o,this.distance=a}}let Cp,Rp,Pp,Lp,Ip,Dp,Np;const ou={CLOSEST:1,ANY:2,ALL:4};Cp=Lt.types.SPHERE;Rp=Lt.types.PLANE;Pp=Lt.types.BOX;Lp=Lt.types.CYLINDER;Ip=Lt.types.CONVEXPOLYHEDRON;Dp=Lt.types.HEIGHTFIELD;Np=Lt.types.TRIMESH;class Ve{get[Cp](){return this._intersectSphere}get[Rp](){return this._intersectPlane}get[Pp](){return this._intersectBox}get[Lp](){return this._intersectConvex}get[Ip](){return this._intersectConvex}get[Dp](){return this._intersectHeightfield}get[Np](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new b),e===void 0&&(e=new b),this.from=t.clone(),this.to=e.clone(),this.direction=new b,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=Ve.ANY,this.result=new gl,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||Ve.ANY,this.result=e.result||new gl,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(cf),Tc.length=0,t.broadphase.aabbQuery(t,cf,Tc),this.intersectBodies(Tc),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;const s=vS,r=yS;for(let o=0,a=t.shapes.length;o<a;o++){const l=t.shapes[o];if(!(n&&!l.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],r),t.quaternion.vmult(t.shapeOffsets[o],s),s.vadd(t.position,s),this.intersectShape(l,r,s,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,s=t.length;!this.result.shouldStop&&n<s;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,s){const r=this.from;if(DS(r,this.direction,n)>t.boundingSphereRadius)return;const a=this[t.type];a&&a.call(this,t,e,n,s,t)}_intersectBox(t,e,n,s,r){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,s,r)}_intersectPlane(t,e,n,s,r){const o=this.from,a=this.to,l=this.direction,c=new b(0,0,1);e.vmult(c,c);const u=new b;o.vsub(n,u);const h=u.dot(c);a.vsub(n,u);const d=u.dot(c);if(h*d>0||o.distanceTo(a)<h)return;const f=c.dot(l);if(Math.abs(f)<this.precision)return;const p=new b,x=new b,g=new b;o.vsub(n,p);const m=-c.dot(p)/f;l.scale(m,x),o.vadd(x,g),this.reportIntersection(c,g,r,s,-1)}getAABB(t){const{lowerBound:e,upperBound:n}=t,s=this.to,r=this.from;e.x=Math.min(s.x,r.x),e.y=Math.min(s.y,r.y),e.z=Math.min(s.z,r.z),n.x=Math.max(s.x,r.x),n.y=Math.max(s.y,r.y),n.z=Math.max(s.z,r.z)}_intersectHeightfield(t,e,n,s,r){t.data,t.elementSize;const o=_S;o.from.copy(this.from),o.to.copy(this.to),fe.pointToLocalFrame(n,e,o.from,o.from),fe.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();const a=MS;let l,c,u,h;l=c=0,u=h=t.data.length-1;const d=new Un;o.getAABB(d),t.getIndexOfPosition(d.lowerBound.x,d.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),t.getIndexOfPosition(d.upperBound.x,d.upperBound.y,a,!0),u=Math.min(u,a[0]+1),h=Math.min(h,a[1]+1);for(let f=l;f<u;f++)for(let p=c;p<h;p++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(f,p,d),!!d.overlapsRay(o)){if(t.getConvexTrianglePillar(f,p,!1),fe.pointToWorldFrame(n,e,t.pillarOffset,Va),this._intersectConvex(t.pillarConvex,e,Va,s,r,hf),this.result.shouldStop)return;t.getConvexTrianglePillar(f,p,!0),fe.pointToWorldFrame(n,e,t.pillarOffset,Va),this._intersectConvex(t.pillarConvex,e,Va,s,r,hf)}}}_intersectSphere(t,e,n,s,r){const o=this.from,a=this.to,l=t.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,u=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),h=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,d=u**2-4*c*h,f=SS,p=bS;if(!(d<0))if(d===0)o.lerp(a,d,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1);else{const x=(-u-Math.sqrt(d))/(2*c),g=(-u+Math.sqrt(d))/(2*c);if(x>=0&&x<=1&&(o.lerp(a,x,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1)),this.result.shouldStop)return;g>=0&&g<=1&&(o.lerp(a,g,f),f.vsub(n,p),p.normalize(),this.reportIntersection(p,f,r,s,-1))}}_intersectConvex(t,e,n,s,r,o){const a=wS,l=uf,c=o&&o.faceList||null,u=t.faces,h=t.vertices,d=t.faceNormals,f=this.direction,p=this.from,x=this.to,g=p.distanceTo(x),m=c?c.length:u.length,y=this.result;for(let M=0;!y.shouldStop&&M<m;M++){const _=c?c[M]:M,C=u[_],w=d[_],P=e,D=n;l.copy(h[C[0]]),P.vmult(l,l),l.vadd(D,l),l.vsub(p,l),P.vmult(w,a);const E=f.dot(a);if(Math.abs(E)<this.precision)continue;const v=a.dot(l)/E;if(!(v<0)){f.scale(v,Sn),Sn.vadd(p,Sn),Qn.copy(h[C[0]]),P.vmult(Qn,Qn),D.vadd(Qn,Qn);for(let R=1;!y.shouldStop&&R<C.length-1;R++){fi.copy(h[C[R]]),pi.copy(h[C[R+1]]),P.vmult(fi,fi),P.vmult(pi,pi),D.vadd(fi,fi),D.vadd(pi,pi);const N=Sn.distanceTo(p);!(Ve.pointInTriangle(Sn,Qn,fi,pi)||Ve.pointInTriangle(Sn,fi,Qn,pi))||N>g||this.reportIntersection(a,Sn,r,s,_)}}}}_intersectTrimesh(t,e,n,s,r,o){const a=ES,l=LS,c=IS,u=uf,h=TS,d=AS,f=CS,p=PS,x=RS,g=t.indices;t.vertices;const m=this.from,y=this.to,M=this.direction;c.position.copy(n),c.quaternion.copy(e),fe.vectorToLocalFrame(n,e,M,h),fe.pointToLocalFrame(n,e,m,d),fe.pointToLocalFrame(n,e,y,f),f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,d.x*=t.scale.x,d.y*=t.scale.y,d.z*=t.scale.z,f.vsub(d,h),h.normalize();const _=d.distanceSquared(f);t.tree.rayQuery(this,c,l);for(let C=0,w=l.length;!this.result.shouldStop&&C!==w;C++){const P=l[C];t.getNormal(P,a),t.getVertex(g[P*3],Qn),Qn.vsub(d,u);const D=h.dot(a),E=a.dot(u)/D;if(E<0)continue;h.scale(E,Sn),Sn.vadd(d,Sn),t.getVertex(g[P*3+1],fi),t.getVertex(g[P*3+2],pi);const v=Sn.distanceSquared(d);!(Ve.pointInTriangle(Sn,fi,Qn,pi)||Ve.pointInTriangle(Sn,Qn,fi,pi))||v>_||(fe.vectorToWorldFrame(e,a,x),fe.pointToWorldFrame(n,e,Sn,p),this.reportIntersection(x,p,r,s,P))}l.length=0}reportIntersection(t,e,n,s,r){const o=this.from,a=this.to,l=o.distanceTo(e),c=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(c.hitFaceIndex=typeof r<"u"?r:-1,this.mode){case Ve.ALL:this.hasHit=!0,c.set(o,a,t,e,n,s,l),c.hasHit=!0,this.callback(c);break;case Ve.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l));break;case Ve.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,s,l),c.shouldStop=!0;break}}static pointInTriangle(t,e,n,s){s.vsub(e,zs),n.vsub(e,co),t.vsub(e,Ac);const r=zs.dot(zs),o=zs.dot(co),a=zs.dot(Ac),l=co.dot(co),c=co.dot(Ac);let u,h;return(u=l*a-o*c)>=0&&(h=r*c-o*a)>=0&&u+h<r*l-o*o}}Ve.CLOSEST=ou.CLOSEST;Ve.ANY=ou.ANY;Ve.ALL=ou.ALL;const cf=new Un,Tc=[],co=new b,Ac=new b,vS=new b,yS=new qe,Sn=new b,Qn=new b,fi=new b,pi=new b;new b;new gl;const hf={faceList:[0]},Va=new b,_S=new Ve,MS=[],SS=new b,bS=new b,wS=new b;new b;new b;const uf=new b,ES=new b,TS=new b,AS=new b,CS=new b,RS=new b,PS=new b;new Un;const LS=[],IS=new fe,zs=new b,Wa=new b;function DS(i,t,e){e.vsub(i,zs);const n=zs.dot(t);return t.scale(n,Wa),Wa.vadd(i,Wa),e.distanceTo(Wa)}class NS{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}}class df{constructor(){this.spatial=new b,this.rotational=new b}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}}class Jo{constructor(t,e,n,s){n===void 0&&(n=-1e6),s===void 0&&(s=1e6),this.id=Jo.idCounter++,this.minForce=n,this.maxForce=s,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new df,this.jacobianElementB=new df,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){const s=e,r=t,o=n;this.a=4/(o*(1+4*s)),this.b=4*s/(1+4*s),this.eps=4/(o*o*r*(1+4*s))}computeB(t,e,n){const s=this.computeGW(),r=this.computeGq(),o=this.computeGiMf();return-r*t-s*e-o*n}computeGq(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.position,o=s.position;return t.spatial.dot(r)+e.spatial.dot(o)}computeGW(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.velocity,o=s.velocity,a=n.angularVelocity,l=s.angularVelocity;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGWlambda(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.vlambda,o=s.vlambda,a=n.wlambda,l=s.wlambda;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGiMf(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.force,o=n.torque,a=s.force,l=s.torque,c=n.invMassSolve,u=s.invMassSolve;return r.scale(c,ff),a.scale(u,pf),n.invInertiaWorldSolve.vmult(o,mf),s.invInertiaWorldSolve.vmult(l,gf),t.multiplyVectors(ff,mf)+e.multiplyVectors(pf,gf)}computeGiMGt(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,s=this.bj,r=n.invMassSolve,o=s.invMassSolve,a=n.invInertiaWorldSolve,l=s.invInertiaWorldSolve;let c=r+o;return a.vmult(t.rotational,Xa),c+=Xa.dot(t.rotational),l.vmult(e.rotational,Xa),c+=Xa.dot(e.rotational),c}addToWlambda(t){const e=this.jacobianElementA,n=this.jacobianElementB,s=this.bi,r=this.bj,o=US;s.vlambda.addScaledVector(s.invMassSolve*t,e.spatial,s.vlambda),r.vlambda.addScaledVector(r.invMassSolve*t,n.spatial,r.vlambda),s.invInertiaWorldSolve.vmult(e.rotational,o),s.wlambda.addScaledVector(t,o,s.wlambda),r.invInertiaWorldSolve.vmult(n.rotational,o),r.wlambda.addScaledVector(t,o,r.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}Jo.idCounter=0;const ff=new b,pf=new b,mf=new b,gf=new b,Xa=new b,US=new b;class FS extends Jo{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new b,this.rj=new b,this.ni=new b}computeB(t){const e=this.a,n=this.b,s=this.bi,r=this.bj,o=this.ri,a=this.rj,l=OS,c=BS,u=s.velocity,h=s.angularVelocity;s.force,s.torque;const d=r.velocity,f=r.angularVelocity;r.force,r.torque;const p=zS,x=this.jacobianElementA,g=this.jacobianElementB,m=this.ni;o.cross(m,l),a.cross(m,c),m.negate(x.spatial),l.negate(x.rotational),g.spatial.copy(m),g.rotational.copy(c),p.copy(r.position),p.vadd(a,p),p.vsub(s.position,p),p.vsub(o,p);const y=m.dot(p),M=this.restitution+1,_=M*d.dot(m)-M*u.dot(m)+f.dot(c)-h.dot(l),C=this.computeGiMf();return-y*e-_*n-t*C}getImpactVelocityAlongNormal(){const t=kS,e=GS,n=HS,s=VS,r=WS;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,s),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(s,e),t.vsub(e,r),this.ni.dot(r)}}const OS=new b,BS=new b,zS=new b,kS=new b,GS=new b,HS=new b,VS=new b,WS=new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;class xf extends Jo{constructor(t,e,n){super(t,e,-n,n),this.ri=new b,this.rj=new b,this.t=new b}computeB(t){this.a;const e=this.b;this.bi,this.bj;const n=this.ri,s=this.rj,r=XS,o=qS,a=this.t;n.cross(a,r),s.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),r.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const u=this.computeGW(),h=this.computeGiMf();return-u*e-t*h}}const XS=new b,qS=new b;class Qo{constructor(t,e,n){n=NS.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=Qo.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}Qo.idCounter=0;class Kr{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=Kr.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}}Kr.idCounter=0;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new Ve;new b;new b;new b;new b(1,0,0),new b(0,1,0),new b(0,0,1);new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;class Up extends Lt{constructor(t){if(super({type:Lt.types.SPHERE}),this.radius=t!==void 0?t:1,this.radius<0)throw new Error("The sphere radius cannot be negative.");this.updateBoundingSphereRadius()}calculateLocalInertia(t,e){e===void 0&&(e=new b);const n=2*t*this.radius*this.radius/5;return e.x=n,e.y=n,e.z=n,e}volume(){return 4*Math.PI*Math.pow(this.radius,3)/3}updateBoundingSphereRadius(){this.boundingSphereRadius=this.radius}calculateWorldAABB(t,e,n,s){const r=this.radius,o=["x","y","z"];for(let a=0;a<o.length;a++){const l=o[a];n[l]=t[l]-r,s[l]=t[l]+r}}}new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new b;new Un;new b;new Un;new b;new b;new b;new b;new b;new b;new b;new Un;new b;new fe;new Un;class YS{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){const e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}}class $S extends YS{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0;const s=this.iterations,r=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=e.bodies,c=l.length,u=t;let h,d,f,p,x,g;if(a!==0)for(let _=0;_!==c;_++)l[_].updateSolveMassProperties();const m=ZS,y=KS,M=jS;m.length=a,y.length=a,M.length=a;for(let _=0;_!==a;_++){const C=o[_];M[_]=0,y[_]=C.computeB(u),m[_]=1/C.computeC()}if(a!==0){for(let w=0;w!==c;w++){const P=l[w],D=P.vlambda,E=P.wlambda;D.set(0,0,0),E.set(0,0,0)}for(n=0;n!==s;n++){p=0;for(let w=0;w!==a;w++){const P=o[w];h=y[w],d=m[w],g=M[w],x=P.computeGWlambda(),f=d*(h-x-P.eps*g),g+f<P.minForce?f=P.minForce-g:g+f>P.maxForce&&(f=P.maxForce-g),M[w]+=f,p+=f>0?f:-f,P.addToWlambda(f)}if(p*p<r)break}for(let w=0;w!==c;w++){const P=l[w],D=P.velocity,E=P.angularVelocity;P.vlambda.vmul(P.linearFactor,P.vlambda),D.vadd(P.vlambda,D),P.wlambda.vmul(P.angularFactor,P.wlambda),E.vadd(P.wlambda,E)}let _=o.length;const C=1/u;for(;_--;)o[_].multiplier=M[_]*C}return n}}const jS=[],ZS=[],KS=[];class JS{constructor(){this.objects=[],this.type=Object}release(){const t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){const e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}}class QS extends JS{constructor(){super(...arguments),this.type=b}constructObject(){return new b}}const Ae={sphereSphere:Lt.types.SPHERE,spherePlane:Lt.types.SPHERE|Lt.types.PLANE,boxBox:Lt.types.BOX|Lt.types.BOX,sphereBox:Lt.types.SPHERE|Lt.types.BOX,planeBox:Lt.types.PLANE|Lt.types.BOX,convexConvex:Lt.types.CONVEXPOLYHEDRON,sphereConvex:Lt.types.SPHERE|Lt.types.CONVEXPOLYHEDRON,planeConvex:Lt.types.PLANE|Lt.types.CONVEXPOLYHEDRON,boxConvex:Lt.types.BOX|Lt.types.CONVEXPOLYHEDRON,sphereHeightfield:Lt.types.SPHERE|Lt.types.HEIGHTFIELD,boxHeightfield:Lt.types.BOX|Lt.types.HEIGHTFIELD,convexHeightfield:Lt.types.CONVEXPOLYHEDRON|Lt.types.HEIGHTFIELD,sphereParticle:Lt.types.PARTICLE|Lt.types.SPHERE,planeParticle:Lt.types.PLANE|Lt.types.PARTICLE,boxParticle:Lt.types.BOX|Lt.types.PARTICLE,convexParticle:Lt.types.PARTICLE|Lt.types.CONVEXPOLYHEDRON,cylinderCylinder:Lt.types.CYLINDER,sphereCylinder:Lt.types.SPHERE|Lt.types.CYLINDER,planeCylinder:Lt.types.PLANE|Lt.types.CYLINDER,boxCylinder:Lt.types.BOX|Lt.types.CYLINDER,convexCylinder:Lt.types.CONVEXPOLYHEDRON|Lt.types.CYLINDER,heightfieldCylinder:Lt.types.HEIGHTFIELD|Lt.types.CYLINDER,particleCylinder:Lt.types.PARTICLE|Lt.types.CYLINDER,sphereTrimesh:Lt.types.SPHERE|Lt.types.TRIMESH,planeTrimesh:Lt.types.PLANE|Lt.types.TRIMESH};class tb{get[Ae.sphereSphere](){return this.sphereSphere}get[Ae.spherePlane](){return this.spherePlane}get[Ae.boxBox](){return this.boxBox}get[Ae.sphereBox](){return this.sphereBox}get[Ae.planeBox](){return this.planeBox}get[Ae.convexConvex](){return this.convexConvex}get[Ae.sphereConvex](){return this.sphereConvex}get[Ae.planeConvex](){return this.planeConvex}get[Ae.boxConvex](){return this.boxConvex}get[Ae.sphereHeightfield](){return this.sphereHeightfield}get[Ae.boxHeightfield](){return this.boxHeightfield}get[Ae.convexHeightfield](){return this.convexHeightfield}get[Ae.sphereParticle](){return this.sphereParticle}get[Ae.planeParticle](){return this.planeParticle}get[Ae.boxParticle](){return this.boxParticle}get[Ae.convexParticle](){return this.convexParticle}get[Ae.cylinderCylinder](){return this.convexConvex}get[Ae.sphereCylinder](){return this.sphereConvex}get[Ae.planeCylinder](){return this.planeConvex}get[Ae.boxCylinder](){return this.boxConvex}get[Ae.convexCylinder](){return this.convexConvex}get[Ae.heightfieldCylinder](){return this.heightfieldCylinder}get[Ae.particleCylinder](){return this.particleCylinder}get[Ae.sphereTrimesh](){return this.sphereTrimesh}get[Ae.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new QS,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,s,r,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new FS(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&s.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||t.material,u=s.material||e.material;return c&&u&&c.restitution>=0&&u.restitution>=0&&(a.restitution=c.restitution*u.restitution),a.si=r||n,a.sj=o||s,a}createFrictionEquationsFromContact(t,e){const n=t.bi,s=t.bj,r=t.si,o=t.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const u=r.material||n.material,h=o.material||s.material;if(u&&h&&u.friction>=0&&h.friction>=0&&(c=u.friction*h.friction),c>0){const d=c*(a.frictionGravity||a.gravity).length();let f=n.invMass+s.invMass;f>0&&(f=1/f);const p=this.frictionEquationPool,x=p.length?p.pop():new xf(n,s,d*f),g=p.length?p.pop():new xf(n,s,d*f);return x.bi=g.bi=n,x.bj=g.bj=s,x.minForce=g.minForce=-d*f,x.maxForce=g.maxForce=d*f,x.ri.copy(t.ri),x.rj.copy(t.rj),g.ri.copy(t.ri),g.rj.copy(t.rj),t.ni.tangents(x.t,g.t),x.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),g.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),x.enabled=g.enabled=t.enabled,e.push(x,g),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;const n=this.frictionResult[this.frictionResult.length-2],s=this.frictionResult[this.frictionResult.length-1];Ds.setZero(),_r.setZero(),Mr.setZero();const r=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==r?(Ds.vadd(e.ni,Ds),_r.vadd(e.ri,_r),Mr.vadd(e.rj,Mr)):(Ds.vsub(e.ni,Ds),_r.vadd(e.rj,_r),Mr.vadd(e.ri,Mr));const o=1/t;_r.scale(o,n.ri),Mr.scale(o,n.rj),s.ri.copy(n.ri),s.rj.copy(n.rj),Ds.normalize(),Ds.tangents(n.t,s.t)}getContacts(t,e,n,s,r,o,a){this.contactPointPool=r,this.frictionEquationPool=a,this.result=s,this.frictionResult=o;const l=ib,c=sb,u=eb,h=nb;for(let d=0,f=t.length;d!==f;d++){const p=t[d],x=e[d];let g=null;p.material&&x.material&&(g=n.getContactMaterial(p.material,x.material)||null);const m=p.type&Rt.KINEMATIC&&x.type&Rt.STATIC||p.type&Rt.STATIC&&x.type&Rt.KINEMATIC||p.type&Rt.KINEMATIC&&x.type&Rt.KINEMATIC;for(let y=0;y<p.shapes.length;y++){p.quaternion.mult(p.shapeOrientations[y],l),p.quaternion.vmult(p.shapeOffsets[y],u),u.vadd(p.position,u);const M=p.shapes[y];for(let _=0;_<x.shapes.length;_++){x.quaternion.mult(x.shapeOrientations[_],c),x.quaternion.vmult(x.shapeOffsets[_],h),h.vadd(x.position,h);const C=x.shapes[_];if(!(M.collisionFilterMask&C.collisionFilterGroup&&C.collisionFilterMask&M.collisionFilterGroup)||u.distanceTo(h)>M.boundingSphereRadius+C.boundingSphereRadius)continue;let w=null;M.material&&C.material&&(w=n.getContactMaterial(M.material,C.material)||null),this.currentContactMaterial=w||g||n.defaultContactMaterial;const P=M.type|C.type,D=this[P];if(D){let E=!1;M.type<C.type?E=D.call(this,M,C,u,h,l,c,p,x,M,C,m):E=D.call(this,C,M,h,u,c,l,x,p,M,C,m),E&&m&&(n.shapeOverlapKeeper.set(M.id,C.id),n.bodyOverlapKeeper.set(p.id,x.id))}}}}}sphereSphere(t,e,n,s,r,o,a,l,c,u,h){if(h)return n.distanceSquared(s)<(t.radius+e.radius)**2;const d=this.createContactEquation(a,l,t,e,c,u);s.vsub(n,d.ni),d.ni.normalize(),d.ri.copy(d.ni),d.rj.copy(d.ni),d.ri.scale(t.radius,d.ri),d.rj.scale(-e.radius,d.rj),d.ri.vadd(n,d.ri),d.ri.vsub(a.position,d.ri),d.rj.vadd(s,d.rj),d.rj.vsub(l.position,d.rj),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}spherePlane(t,e,n,s,r,o,a,l,c,u,h){const d=this.createContactEquation(a,l,t,e,c,u);if(d.ni.set(0,0,1),o.vmult(d.ni,d.ni),d.ni.negate(d.ni),d.ni.normalize(),d.ni.scale(t.radius,d.ri),n.vsub(s,qa),d.ni.scale(d.ni.dot(qa),vf),qa.vsub(vf,d.rj),-qa.dot(d.ni)<=t.radius){if(h)return!0;const f=d.ri,p=d.rj;f.vadd(n,f),f.vsub(a.position,f),p.vadd(s,p),p.vsub(l.position,p),this.result.push(d),this.createFrictionEquationsFromContact(d,this.frictionResult)}}boxBox(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,h)}sphereBox(t,e,n,s,r,o,a,l,c,u,h){const d=this.v3pool,f=Pb;n.vsub(s,Ya),e.getSideNormals(f,o);const p=t.radius;let x=!1;const g=Ib,m=Db,y=Nb;let M=null,_=0,C=0,w=0,P=null;for(let z=0,j=f.length;z!==j&&x===!1;z++){const X=Ab;X.copy(f[z]);const rt=X.length();X.normalize();const gt=Ya.dot(X);if(gt<rt+p&&gt>0){const ht=Cb,ut=Rb;ht.copy(f[(z+1)%3]),ut.copy(f[(z+2)%3]);const Gt=ht.length(),oe=ut.length();ht.normalize(),ut.normalize();const Zt=Ya.dot(ht),st=Ya.dot(ut);if(Zt<Gt&&Zt>-Gt&&st<oe&&st>-oe){const ot=Math.abs(gt-rt-p);if((P===null||ot<P)&&(P=ot,C=Zt,w=st,M=rt,g.copy(X),m.copy(ht),y.copy(ut),_++,h))return!0}}}if(_){x=!0;const z=this.createContactEquation(a,l,t,e,c,u);g.scale(-p,z.ri),z.ni.copy(g),z.ni.negate(z.ni),g.scale(M,g),m.scale(C,m),g.vadd(m,g),y.scale(w,y),g.vadd(y,z.rj),z.ri.vadd(n,z.ri),z.ri.vsub(a.position,z.ri),z.rj.vadd(s,z.rj),z.rj.vsub(l.position,z.rj),this.result.push(z),this.createFrictionEquationsFromContact(z,this.frictionResult)}let D=d.get();const E=Lb;for(let z=0;z!==2&&!x;z++)for(let j=0;j!==2&&!x;j++)for(let X=0;X!==2&&!x;X++)if(D.set(0,0,0),z?D.vadd(f[0],D):D.vsub(f[0],D),j?D.vadd(f[1],D):D.vsub(f[1],D),X?D.vadd(f[2],D):D.vsub(f[2],D),s.vadd(D,E),E.vsub(n,E),E.lengthSquared()<p*p){if(h)return!0;x=!0;const rt=this.createContactEquation(a,l,t,e,c,u);rt.ri.copy(E),rt.ri.normalize(),rt.ni.copy(rt.ri),rt.ri.scale(p,rt.ri),rt.rj.copy(D),rt.ri.vadd(n,rt.ri),rt.ri.vsub(a.position,rt.ri),rt.rj.vadd(s,rt.rj),rt.rj.vsub(l.position,rt.rj),this.result.push(rt),this.createFrictionEquationsFromContact(rt,this.frictionResult)}d.release(D),D=null;const v=d.get(),R=d.get(),N=d.get(),L=d.get(),k=d.get(),B=f.length;for(let z=0;z!==B&&!x;z++)for(let j=0;j!==B&&!x;j++)if(z%3!==j%3){f[j].cross(f[z],v),v.normalize(),f[z].vadd(f[j],R),N.copy(n),N.vsub(R,N),N.vsub(s,N);const X=N.dot(v);v.scale(X,L);let rt=0;for(;rt===z%3||rt===j%3;)rt++;k.copy(n),k.vsub(L,k),k.vsub(R,k),k.vsub(s,k);const gt=Math.abs(X),ht=k.length();if(gt<f[rt].length()&&ht<p){if(h)return!0;x=!0;const ut=this.createContactEquation(a,l,t,e,c,u);R.vadd(L,ut.rj),ut.rj.copy(ut.rj),k.negate(ut.ni),ut.ni.normalize(),ut.ri.copy(ut.rj),ut.ri.vadd(s,ut.ri),ut.ri.vsub(n,ut.ri),ut.ri.normalize(),ut.ri.scale(p,ut.ri),ut.ri.vadd(n,ut.ri),ut.ri.vsub(a.position,ut.ri),ut.rj.vadd(s,ut.rj),ut.rj.vsub(l.position,ut.rj),this.result.push(ut),this.createFrictionEquationsFromContact(ut,this.frictionResult)}}d.release(v,R,N,L,k)}planeBox(t,e,n,s,r,o,a,l,c,u,h){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,s,r,o,a,l,t,e,h)}convexConvex(t,e,n,s,r,o,a,l,c,u,h,d,f){const p=jb;if(!(n.distanceTo(s)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,r,s,o,p,d,f)){const x=[],g=Zb;t.clipAgainstHull(n,r,e,s,o,p,-100,100,x);let m=0;for(let y=0;y!==x.length;y++){if(h)return!0;const M=this.createContactEquation(a,l,t,e,c,u),_=M.ri,C=M.rj;p.negate(M.ni),x[y].normal.negate(g),g.scale(x[y].depth,g),x[y].point.vadd(g,_),C.copy(x[y].point),_.vsub(n,_),C.vsub(s,C),_.vadd(n,_),_.vsub(a.position,_),C.vadd(s,C),C.vsub(l.position,C),this.result.push(M),m++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(M,this.frictionResult)}this.enableFrictionReduction&&m&&this.createFrictionFromAverage(m)}}sphereConvex(t,e,n,s,r,o,a,l,c,u,h){const d=this.v3pool;n.vsub(s,Ub);const f=e.faceNormals,p=e.faces,x=e.vertices,g=t.radius;let m=!1;for(let y=0;y!==x.length;y++){const M=x[y],_=zb;o.vmult(M,_),s.vadd(_,_);const C=Bb;if(_.vsub(n,C),C.lengthSquared()<g*g){if(h)return!0;m=!0;const w=this.createContactEquation(a,l,t,e,c,u);w.ri.copy(C),w.ri.normalize(),w.ni.copy(w.ri),w.ri.scale(g,w.ri),_.vsub(s,w.rj),w.ri.vadd(n,w.ri),w.ri.vsub(a.position,w.ri),w.rj.vadd(s,w.rj),w.rj.vsub(l.position,w.rj),this.result.push(w),this.createFrictionEquationsFromContact(w,this.frictionResult);return}}for(let y=0,M=p.length;y!==M&&m===!1;y++){const _=f[y],C=p[y],w=kb;o.vmult(_,w);const P=Gb;o.vmult(x[C[0]],P),P.vadd(s,P);const D=Hb;w.scale(-g,D),n.vadd(D,D);const E=Vb;D.vsub(P,E);const v=E.dot(w),R=Wb;if(n.vsub(P,R),v<0&&R.dot(w)>0){const N=[];for(let L=0,k=C.length;L!==k;L++){const B=d.get();o.vmult(x[C[L]],B),s.vadd(B,B),N.push(B)}if(Tb(N,w,n)){if(h)return!0;m=!0;const L=this.createContactEquation(a,l,t,e,c,u);w.scale(-g,L.ri),w.negate(L.ni);const k=d.get();w.scale(-v,k);const B=d.get();w.scale(-g,B),n.vsub(s,L.rj),L.rj.vadd(B,L.rj),L.rj.vadd(k,L.rj),L.rj.vadd(s,L.rj),L.rj.vsub(l.position,L.rj),L.ri.vadd(n,L.ri),L.ri.vsub(a.position,L.ri),d.release(k),d.release(B),this.result.push(L),this.createFrictionEquationsFromContact(L,this.frictionResult);for(let z=0,j=N.length;z!==j;z++)d.release(N[z]);return}else for(let L=0;L!==C.length;L++){const k=d.get(),B=d.get();o.vmult(x[C[(L+1)%C.length]],k),o.vmult(x[C[(L+2)%C.length]],B),s.vadd(k,k),s.vadd(B,B);const z=Fb;B.vsub(k,z);const j=Ob;z.unit(j);const X=d.get(),rt=d.get();n.vsub(k,rt);const gt=rt.dot(j);j.scale(gt,X),X.vadd(k,X);const ht=d.get();if(X.vsub(n,ht),gt>0&&gt*gt<z.lengthSquared()&&ht.lengthSquared()<g*g){if(h)return!0;const ut=this.createContactEquation(a,l,t,e,c,u);X.vsub(s,ut.rj),X.vsub(n,ut.ni),ut.ni.normalize(),ut.ni.scale(g,ut.ri),ut.rj.vadd(s,ut.rj),ut.rj.vsub(l.position,ut.rj),ut.ri.vadd(n,ut.ri),ut.ri.vsub(a.position,ut.ri),this.result.push(ut),this.createFrictionEquationsFromContact(ut,this.frictionResult);for(let Gt=0,oe=N.length;Gt!==oe;Gt++)d.release(N[Gt]);d.release(k),d.release(B),d.release(X),d.release(ht),d.release(rt);return}d.release(k),d.release(B),d.release(X),d.release(ht),d.release(rt)}for(let L=0,k=N.length;L!==k;L++)d.release(N[L])}}}planeConvex(t,e,n,s,r,o,a,l,c,u,h){const d=Xb,f=qb;f.set(0,0,1),r.vmult(f,f);let p=0;const x=Yb;for(let g=0;g!==e.vertices.length;g++)if(d.copy(e.vertices[g]),o.vmult(d,d),s.vadd(d,d),d.vsub(n,x),f.dot(x)<=0){if(h)return!0;const y=this.createContactEquation(a,l,t,e,c,u),M=$b;f.scale(f.dot(x),M),d.vsub(M,M),M.vsub(n,y.ri),y.ni.copy(f),d.vsub(s,y.rj),y.ri.vadd(n,y.ri),y.ri.vsub(a.position,y.ri),y.rj.vadd(s,y.rj),y.rj.vsub(l.position,y.rj),this.result.push(y),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(y,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}boxConvex(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}sphereHeightfield(t,e,n,s,r,o,a,l,c,u,h){const d=e.data,f=t.radius,p=e.elementSize,x=lw,g=aw;fe.pointToLocalFrame(s,o,n,g);let m=Math.floor((g.x-f)/p)-1,y=Math.ceil((g.x+f)/p)+1,M=Math.floor((g.y-f)/p)-1,_=Math.ceil((g.y+f)/p)+1;if(y<0||_<0||m>d.length||M>d[0].length)return;m<0&&(m=0),y<0&&(y=0),M<0&&(M=0),_<0&&(_=0),m>=d.length&&(m=d.length-1),y>=d.length&&(y=d.length-1),_>=d[0].length&&(_=d[0].length-1),M>=d[0].length&&(M=d[0].length-1);const C=[];e.getRectMinMax(m,M,y,_,C);const w=C[0],P=C[1];if(g.z-f>P||g.z+f<w)return;const D=this.result;for(let E=m;E<y;E++)for(let v=M;v<_;v++){const R=D.length;let N=!1;if(e.getConvexTrianglePillar(E,v,!1),fe.pointToWorldFrame(s,o,e.pillarOffset,x),n.distanceTo(x)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(N=this.sphereConvex(t,e.pillarConvex,n,x,r,o,a,l,t,e,h)),h&&N||(e.getConvexTrianglePillar(E,v,!0),fe.pointToWorldFrame(s,o,e.pillarOffset,x),n.distanceTo(x)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(N=this.sphereConvex(t,e.pillarConvex,n,x,r,o,a,l,t,e,h)),h&&N))return!0;if(D.length-R>2)return}}boxHeightfield(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}convexHeightfield(t,e,n,s,r,o,a,l,c,u,h){const d=e.data,f=e.elementSize,p=t.boundingSphereRadius,x=rw,g=ow,m=sw;fe.pointToLocalFrame(s,o,n,m);let y=Math.floor((m.x-p)/f)-1,M=Math.ceil((m.x+p)/f)+1,_=Math.floor((m.y-p)/f)-1,C=Math.ceil((m.y+p)/f)+1;if(M<0||C<0||y>d.length||_>d[0].length)return;y<0&&(y=0),M<0&&(M=0),_<0&&(_=0),C<0&&(C=0),y>=d.length&&(y=d.length-1),M>=d.length&&(M=d.length-1),C>=d[0].length&&(C=d[0].length-1),_>=d[0].length&&(_=d[0].length-1);const w=[];e.getRectMinMax(y,_,M,C,w);const P=w[0],D=w[1];if(!(m.z-p>D||m.z+p<P))for(let E=y;E<M;E++)for(let v=_;v<C;v++){let R=!1;if(e.getConvexTrianglePillar(E,v,!1),fe.pointToWorldFrame(s,o,e.pillarOffset,x),n.distanceTo(x)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(R=this.convexConvex(t,e.pillarConvex,n,x,r,o,a,l,null,null,h,g,null)),h&&R||(e.getConvexTrianglePillar(E,v,!0),fe.pointToWorldFrame(s,o,e.pillarOffset,x),n.distanceTo(x)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(R=this.convexConvex(t,e.pillarConvex,n,x,r,o,a,l,null,null,h,g,null)),h&&R))return!0}}sphereParticle(t,e,n,s,r,o,a,l,c,u,h){const d=tw;if(d.set(0,0,1),s.vsub(n,d),d.lengthSquared()<=t.radius*t.radius){if(h)return!0;const p=this.createContactEquation(l,a,e,t,c,u);d.normalize(),p.rj.copy(d),p.rj.scale(t.radius,p.rj),p.ni.copy(d),p.ni.negate(p.ni),p.ri.set(0,0,0),this.result.push(p),this.createFrictionEquationsFromContact(p,this.frictionResult)}}planeParticle(t,e,n,s,r,o,a,l,c,u,h){const d=Kb;d.set(0,0,1),a.quaternion.vmult(d,d);const f=Jb;if(s.vsub(a.position,f),d.dot(f)<=0){if(h)return!0;const x=this.createContactEquation(l,a,e,t,c,u);x.ni.copy(d),x.ni.negate(x.ni),x.ri.set(0,0,0);const g=Qb;d.scale(d.dot(s),g),s.vsub(g,g),x.rj.copy(g),this.result.push(x),this.createFrictionEquationsFromContact(x,this.frictionResult)}}boxParticle(t,e,n,s,r,o,a,l,c,u,h){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,s,r,o,a,l,t,e,h)}convexParticle(t,e,n,s,r,o,a,l,c,u,h){let d=-1;const f=nw,p=iw;let x=null;const g=ew;if(g.copy(s),g.vsub(n,g),r.conjugate(yf),yf.vmult(g,g),t.pointIsInside(g)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,r),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(r);for(let m=0,y=t.faces.length;m!==y;m++){const M=[t.worldVertices[t.faces[m][0]]],_=t.worldFaceNormals[m];s.vsub(M[0],_f);const C=-_.dot(_f);if(x===null||Math.abs(C)<Math.abs(x)){if(h)return!0;x=C,d=m,f.copy(_)}}if(d!==-1){const m=this.createContactEquation(l,a,e,t,c,u);f.scale(x,p),p.vadd(s,p),p.vsub(n,p),m.rj.copy(p),f.negate(m.ni),m.ri.set(0,0,0);const y=m.ri,M=m.rj;y.vadd(s,y),y.vsub(l.position,y),M.vadd(n,M),M.vsub(a.position,M),this.result.push(m),this.createFrictionEquationsFromContact(m,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,s,r,o,a,l,c,u,h){return this.convexHeightfield(e,t,s,n,o,r,l,a,c,u,h)}particleCylinder(t,e,n,s,r,o,a,l,c,u,h){return this.convexParticle(e,t,s,n,o,r,l,a,c,u,h)}sphereTrimesh(t,e,n,s,r,o,a,l,c,u,h){const d=db,f=fb,p=pb,x=mb,g=gb,m=xb,y=Mb,M=ub,_=cb,C=Sb;fe.pointToLocalFrame(s,o,n,g);const w=t.radius;y.lowerBound.set(g.x-w,g.y-w,g.z-w),y.upperBound.set(g.x+w,g.y+w,g.z+w),e.getTrianglesInAABB(y,C);const P=hb,D=t.radius*t.radius;for(let L=0;L<C.length;L++)for(let k=0;k<3;k++)if(e.getVertex(e.indices[C[L]*3+k],P),P.vsub(g,_),_.lengthSquared()<=D){if(M.copy(P),fe.pointToWorldFrame(s,o,M,P),P.vsub(n,_),h)return!0;let B=this.createContactEquation(a,l,t,e,c,u);B.ni.copy(_),B.ni.normalize(),B.ri.copy(B.ni),B.ri.scale(t.radius,B.ri),B.ri.vadd(n,B.ri),B.ri.vsub(a.position,B.ri),B.rj.copy(P),B.rj.vsub(l.position,B.rj),this.result.push(B),this.createFrictionEquationsFromContact(B,this.frictionResult)}for(let L=0;L<C.length;L++)for(let k=0;k<3;k++){e.getVertex(e.indices[C[L]*3+k],d),e.getVertex(e.indices[C[L]*3+(k+1)%3],f),f.vsub(d,p),g.vsub(f,m);const B=m.dot(p);g.vsub(d,m);let z=m.dot(p);if(z>0&&B<0&&(g.vsub(d,m),x.copy(p),x.normalize(),z=m.dot(x),x.scale(z,m),m.vadd(d,m),m.distanceTo(g)<t.radius)){if(h)return!0;const X=this.createContactEquation(a,l,t,e,c,u);m.vsub(g,X.ni),X.ni.normalize(),X.ni.scale(t.radius,X.ri),X.ri.vadd(n,X.ri),X.ri.vsub(a.position,X.ri),fe.pointToWorldFrame(s,o,m,m),m.vsub(l.position,X.rj),fe.vectorToWorldFrame(o,X.ni,X.ni),fe.vectorToWorldFrame(o,X.ri,X.ri),this.result.push(X),this.createFrictionEquationsFromContact(X,this.frictionResult)}}const E=vb,v=yb,R=_b,N=lb;for(let L=0,k=C.length;L!==k;L++){e.getTriangleVertices(C[L],E,v,R),e.getNormal(C[L],N),g.vsub(E,m);let B=m.dot(N);if(N.scale(B,m),g.vsub(m,m),B=m.distanceTo(g),Ve.pointInTriangle(m,E,v,R)&&B<t.radius){if(h)return!0;let z=this.createContactEquation(a,l,t,e,c,u);m.vsub(g,z.ni),z.ni.normalize(),z.ni.scale(t.radius,z.ri),z.ri.vadd(n,z.ri),z.ri.vsub(a.position,z.ri),fe.pointToWorldFrame(s,o,m,m),m.vsub(l.position,z.rj),fe.vectorToWorldFrame(o,z.ni,z.ni),fe.vectorToWorldFrame(o,z.ri,z.ri),this.result.push(z),this.createFrictionEquationsFromContact(z,this.frictionResult)}}C.length=0}planeTrimesh(t,e,n,s,r,o,a,l,c,u,h){const d=new b,f=rb;f.set(0,0,1),r.vmult(f,f);for(let p=0;p<e.vertices.length/3;p++){e.getVertex(p,d);const x=new b;x.copy(d),fe.pointToWorldFrame(s,o,x,d);const g=ob;if(d.vsub(n,g),f.dot(g)<=0){if(h)return!0;const y=this.createContactEquation(a,l,t,e,c,u);y.ni.copy(f);const M=ab;f.scale(g.dot(f),M),d.vsub(M,M),y.ri.copy(M),y.ri.vsub(a.position,y.ri),y.rj.copy(d),y.rj.vsub(l.position,y.rj),this.result.push(y),this.createFrictionEquationsFromContact(y,this.frictionResult)}}}}const Ds=new b,_r=new b,Mr=new b,eb=new b,nb=new b,ib=new qe,sb=new qe,rb=new b,ob=new b,ab=new b,lb=new b,cb=new b;new b;const hb=new b,ub=new b,db=new b,fb=new b,pb=new b,mb=new b,gb=new b,xb=new b,vb=new b,yb=new b,_b=new b,Mb=new Un,Sb=[],qa=new b,vf=new b,bb=new b,wb=new b,Eb=new b;function Tb(i,t,e){let n=null;const s=i.length;for(let r=0;r!==s;r++){const o=i[r],a=bb;i[(r+1)%s].vsub(o,a);const l=wb;a.cross(t,l);const c=Eb;e.vsub(o,c);const u=l.dot(c);if(n===null||u>0&&n===!0||u<=0&&n===!1){n===null&&(n=u>0);continue}else return!1}return!0}const Ya=new b,Ab=new b,Cb=new b,Rb=new b,Pb=[new b,new b,new b,new b,new b,new b],Lb=new b,Ib=new b,Db=new b,Nb=new b,Ub=new b,Fb=new b,Ob=new b,Bb=new b,zb=new b,kb=new b,Gb=new b,Hb=new b,Vb=new b,Wb=new b;new b;new b;const Xb=new b,qb=new b,Yb=new b,$b=new b,jb=new b,Zb=new b,Kb=new b,Jb=new b,Qb=new b,tw=new b,yf=new qe,ew=new b;new b;const nw=new b,_f=new b,iw=new b,sw=new b,rw=new b,ow=[0],aw=new b,lw=new b;class Mf{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){const n=e;e=t,t=n}return t<<16|e}set(t,e){const n=this.getKey(t,e),s=this.current;let r=0;for(;n>s[r];)r++;if(n!==s[r]){for(let o=s.length-1;o>=r;o--)s[o+1]=s[o];s[r]=n}}tick(){const t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){const n=this.current,s=this.previous,r=n.length,o=s.length;let a=0;for(let l=0;l<r;l++){let c=!1;const u=n[l];for(;u>s[a];)a++;c=u===s[a],c||Sf(t,u)}a=0;for(let l=0;l<o;l++){let c=!1;const u=s[l];for(;u>n[a];)a++;c=n[a]===u,c||Sf(e,u)}}}function Sf(i,t){i.push((t&4294901760)>>16,t&65535)}const Cc=(i,t)=>i<t?`${i}-${t}`:`${t}-${i}`;class cw{constructor(){this.data={keys:[]}}get(t,e){const n=Cc(t,e);return this.data[n]}set(t,e,n){const s=Cc(t,e);this.get(t,e)||this.data.keys.push(s),this.data[s]=n}delete(t,e){const n=Cc(t,e),s=this.data.keys.indexOf(n);s!==-1&&this.data.keys.splice(s,1),delete this.data[n]}reset(){const t=this.data,e=t.keys;for(;e.length>0;){const n=e.pop();delete t[n]}}}class hw extends Ap{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new b,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new b,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new xS,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new $S,this.constraints=[],this.narrowphase=new tb(this),this.collisionMatrix=new af,this.collisionMatrixPrevious=new af,this.bodyOverlapKeeper=new Mf,this.shapeOverlapKeeper=new Mf,this.contactmaterials=[],this.contactMaterialTable=new cw,this.defaultMaterial=new Kr("default"),this.defaultContactMaterial=new Qo(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){const t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){const e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof gl?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,s){return n===void 0&&(n={}),n.mode=Ve.ALL,n.from=t,n.to=e,n.callback=s,Rc.intersectWorld(this,n)}raycastAny(t,e,n,s){return n===void 0&&(n={}),n.mode=Ve.ANY,n.from=t,n.to=e,n.result=s,Rc.intersectWorld(this,n)}raycastClosest(t,e,n,s){return n===void 0&&(n={}),n.mode=Ve.CLOSEST,n.from=t,n.to=e,n.result=s,Rc.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof Rt&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;const e=this.bodies.length-1,n=this.bodies,s=n.indexOf(t);if(s!==-1){n.splice(s,1);for(let r=0;r!==n.length;r++)n[r].index=r;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){const e=this.bodies;for(let n=0;n<e.length;n++){const s=e[n].shapes;for(let r=0;r<s.length;r++){const o=s[r];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){const e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);const n=Ze.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{const s=n-this.lastCallTime;this.step(t,s,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;const s=Ze.now();let r=0;for(;this.accumulator>=t&&r<n&&(this.internalStep(t),this.accumulator-=t,r++,!(Ze.now()-s>t*1e3)););this.accumulator=this.accumulator%t;const o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;const e=this.contacts,n=mw,s=gw,r=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,u=this.profile,h=Rt.DYNAMIC;let d=-1/0;const f=this.constraints,p=pw;l.length();const x=l.x,g=l.y,m=l.z;let y=0;for(c&&(d=Ze.now()),y=0;y!==r;y++){const L=o[y];if(L.type===h){const k=L.force,B=L.mass;k.x+=B*x,k.y+=B*g,k.z+=B*m}}for(let L=0,k=this.subsystems.length;L!==k;L++)this.subsystems[L].update();c&&(d=Ze.now()),n.length=0,s.length=0,this.broadphase.collisionPairs(this,n,s),c&&(u.broadphase=Ze.now()-d);let M=f.length;for(y=0;y!==M;y++){const L=f[y];if(!L.collideConnected)for(let k=n.length-1;k>=0;k-=1)(L.bodyA===n[k]&&L.bodyB===s[k]||L.bodyB===n[k]&&L.bodyA===s[k])&&(n.splice(k,1),s.splice(k,1))}this.collisionMatrixTick(),c&&(d=Ze.now());const _=fw,C=e.length;for(y=0;y!==C;y++)_.push(e[y]);e.length=0;const w=this.frictionEquations.length;for(y=0;y!==w;y++)p.push(this.frictionEquations[y]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,s,this,e,_,this.frictionEquations,p),c&&(u.narrowphase=Ze.now()-d),c&&(d=Ze.now()),y=0;y<this.frictionEquations.length;y++)a.addEquation(this.frictionEquations[y]);const P=e.length;for(let L=0;L!==P;L++){const k=e[L],B=k.bi,z=k.bj,j=k.si,X=k.sj;let rt;if(B.material&&z.material?rt=this.getContactMaterial(B.material,z.material)||this.defaultContactMaterial:rt=this.defaultContactMaterial,rt.friction,B.material&&z.material&&(B.material.friction>=0&&z.material.friction>=0&&B.material.friction*z.material.friction,B.material.restitution>=0&&z.material.restitution>=0&&(k.restitution=B.material.restitution*z.material.restitution)),a.addEquation(k),B.allowSleep&&B.type===Rt.DYNAMIC&&B.sleepState===Rt.SLEEPING&&z.sleepState===Rt.AWAKE&&z.type!==Rt.STATIC){const gt=z.velocity.lengthSquared()+z.angularVelocity.lengthSquared(),ht=z.sleepSpeedLimit**2;gt>=ht*2&&(B.wakeUpAfterNarrowphase=!0)}if(z.allowSleep&&z.type===Rt.DYNAMIC&&z.sleepState===Rt.SLEEPING&&B.sleepState===Rt.AWAKE&&B.type!==Rt.STATIC){const gt=B.velocity.lengthSquared()+B.angularVelocity.lengthSquared(),ht=B.sleepSpeedLimit**2;gt>=ht*2&&(z.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(B,z,!0),this.collisionMatrixPrevious.get(B,z)||(ho.body=z,ho.contact=k,B.dispatchEvent(ho),ho.body=B,z.dispatchEvent(ho)),this.bodyOverlapKeeper.set(B.id,z.id),this.shapeOverlapKeeper.set(j.id,X.id)}for(this.emitContactEvents(),c&&(u.makeContactConstraints=Ze.now()-d,d=Ze.now()),y=0;y!==r;y++){const L=o[y];L.wakeUpAfterNarrowphase&&(L.wakeUp(),L.wakeUpAfterNarrowphase=!1)}for(M=f.length,y=0;y!==M;y++){const L=f[y];L.update();for(let k=0,B=L.equations.length;k!==B;k++){const z=L.equations[k];a.addEquation(z)}}a.solve(t,this),c&&(u.solve=Ze.now()-d),a.removeAllEquations();const D=Math.pow;for(y=0;y!==r;y++){const L=o[y];if(L.type&h){const k=D(1-L.linearDamping,t),B=L.velocity;B.scale(k,B);const z=L.angularVelocity;if(z){const j=D(1-L.angularDamping,t);z.scale(j,z)}}}this.dispatchEvent(dw),c&&(d=Ze.now());const v=this.stepnumber%(this.quatNormalizeSkip+1)===0,R=this.quatNormalizeFast;for(y=0;y!==r;y++)o[y].integrate(t,v,R);this.clearForces(),this.broadphase.dirty=!0,c&&(u.integrate=Ze.now()-d),this.stepnumber+=1,this.dispatchEvent(uw);let N=!0;if(this.allowSleep)for(N=!1,y=0;y!==r;y++){const L=o[y];L.sleepTick(this.time),L.sleepState!==Rt.SLEEPING&&(N=!0)}this.hasActiveBodies=N}emitContactEvents(){const t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff(Bi,zi),t){for(let r=0,o=Bi.length;r<o;r+=2)uo.bodyA=this.getBodyById(Bi[r]),uo.bodyB=this.getBodyById(Bi[r+1]),this.dispatchEvent(uo);uo.bodyA=uo.bodyB=null}if(e){for(let r=0,o=zi.length;r<o;r+=2)fo.bodyA=this.getBodyById(zi[r]),fo.bodyB=this.getBodyById(zi[r+1]),this.dispatchEvent(fo);fo.bodyA=fo.bodyB=null}Bi.length=zi.length=0;const n=this.hasAnyEventListener("beginShapeContact"),s=this.hasAnyEventListener("endShapeContact");if((n||s)&&this.shapeOverlapKeeper.getDiff(Bi,zi),n){for(let r=0,o=Bi.length;r<o;r+=2){const a=this.getShapeById(Bi[r]),l=this.getShapeById(Bi[r+1]);ki.shapeA=a,ki.shapeB=l,a&&(ki.bodyA=a.body),l&&(ki.bodyB=l.body),this.dispatchEvent(ki)}ki.bodyA=ki.bodyB=ki.shapeA=ki.shapeB=null}if(s){for(let r=0,o=zi.length;r<o;r+=2){const a=this.getShapeById(zi[r]),l=this.getShapeById(zi[r+1]);Gi.shapeA=a,Gi.shapeB=l,a&&(Gi.bodyA=a.body),l&&(Gi.bodyB=l.body),this.dispatchEvent(Gi)}Gi.bodyA=Gi.bodyB=Gi.shapeA=Gi.shapeB=null}}clearForces(){const t=this.bodies,e=t.length;for(let n=0;n!==e;n++){const s=t[n];s.force,s.torque,s.force.set(0,0,0),s.torque.set(0,0,0)}}}new Un;const Rc=new Ve,Ze=globalThis.performance||{};if(!Ze.now){let i=Date.now();Ze.timing&&Ze.timing.navigationStart&&(i=Ze.timing.navigationStart),Ze.now=()=>Date.now()-i}new b;const uw={type:"postStep"},dw={type:"preStep"},ho={type:Rt.COLLIDE_EVENT_NAME,body:null,contact:null},fw=[],pw=[],mw=[],gw=[],Bi=[],zi=[],uo={type:"beginContact",bodyA:null,bodyB:null},fo={type:"endContact",bodyA:null,bodyB:null},ki={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},Gi={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null};function xw(i){const t=i.length,e=[...i.map(s=>new b(s.x,s.y,-1)),...i.map(s=>new b(s.x,s.y,3))],n=[Array.from({length:t},(s,r)=>t-1-r),Array.from({length:t},(s,r)=>t+r)];for(let s=0;s<t;s++){const r=(s+1)%t;n.push([s,r,t+r,t+s])}return new Dr({vertices:e,faces:n})}function Fp(i,t,e=0){for(let n=0;n<t.length;n++){const s=t[n],r=t[(n+1)%t.length],o=r.x-s.x,a=r.y-s.y;if(o*(i.y-s.y)-a*(i.x-s.x)<-e*Math.hypot(o,a))return!1}return!0}function vw(i,t,e,n=0){let s=0,r=1;for(let o=0;o<e.length;o++){const a=e[o],l=e[(o+1)%e.length],c=l.x-a.x,u=l.y-a.y,h=c*(i.y-a.y)-u*(i.x-a.x)+n*Math.hypot(c,u),d=c*(t.y-i.y)-u*(t.x-i.x);if(Math.abs(d)<1e-10){if(h<0)return null}else{const f=-h/d;if(d>0?s=Math.max(s,f):r=Math.min(r,f),s>r)return null}}return s}const ta={amplitude:2.8,period:12,halfWidth:2.2};function Io(i,t=ta){return t.amplitude*Math.sin(Math.PI*i/t.period)}function au(i,t=ta){let e=Math.max(-16,Math.min(16,i.x));for(let l=0;l<10;l++){const c=Math.PI/t.period,u=Io(e,t),h=t.amplitude*c*Math.cos(c*e),d=-t.amplitude*c*c*Math.sin(c*e);e=Math.max(-16,Math.min(16,e-(e-i.x+(u-i.y)*h)/Math.max(.25,1+h*h+(u-i.y)*d)))}const n=Io(e,t),s=t.amplitude*Math.PI/t.period*Math.cos(Math.PI*e/t.period),r=Math.hypot(1,s),o=-s/r,a=1/r;return{x:e,y:n,nx:o,ny:a,tx:1/r,ty:s/r,distance:(i.x-e)*o+(i.y-n)*a}}function yw(i,t,e=ta,n=.31){const s=au(i,e),r=e.halfWidth-n;if(Math.abs(s.distance)<=r)return!1;const o=Math.sign(s.distance);i.x=s.x+s.nx*o*r,i.y=s.y+s.ny*o*r;const a=(t.x*s.nx+t.y*s.ny)*o;return a>0&&(t.x-=s.nx*o*a,t.y-=s.ny*o*a),!0}function Op(i=ta){const t=[],e=[];for(let n=0;n<=160;n++){const s=-17+n*34/160,r=Io(s,i),o=i.amplitude*Math.PI/i.period*Math.cos(Math.PI*s/i.period),a=Math.hypot(1,o);t.push({x:s-o/a*i.halfWidth,y:r+i.halfWidth/a}),e.push({x:s+o/a*i.halfWidth,y:r-i.halfWidth/a})}return[[...t,{x:18,y:10},{x:-18,y:10}],[{x:-18,y:-10},{x:18,y:-10},...e.reverse()]]}const ze=1/120,Ai=.75,_w=2;function Vr(i,t){return Math.max(0,i.createdAt+i.lifetime-t)}function Bp(i,t,e="fade"){const n=Vr(i,t);return n<=0?0:e==="snap"?1:Math.min(1,n/(i.lifetime*.2))}function Wr(i,t,e,n="fade"){let s=0,r=0;for(const o of t){const a=Bp(o,e,n);if(a===0)continue;const l=o.x-i.x,c=o.y-i.y,u=l*l+c*c+Ai*Ai,h=o.strength*a/(u*Math.sqrt(u));s+=l*h,r+=c*h}return{x:s,y:r}}function Mw(i,t,e,n=ze,s="fade"){const r=Wr(i,t,e,s),o=i.vx+r.x*n,a=i.vy+r.y*n;return{x:i.x+o*n,y:i.y+a*n,vx:o,vy:a}}function Sw(i,t,e,n=5,s="fade",r=8){const o=[{x:i.x,y:i.y}];let a={...i};const l=Math.ceil(n/ze);for(let c=0;c<l;c++)a=Mw(a,t,e+c*ze,ze,s),(c+1)%r===0&&o.push({x:a.x,y:a.y});return o}function bw(i,t,e=_w){return[...i,t].slice(-e)}const Ne=1e-7,us=i=>Math.round(i*1e6)/1e6;function ww(i){const t=[];for(let e=1;e<i.points.length;e++){const n=i.points[e-1],s=i.points[e],r=Math.hypot(s.x-n.x,s.y-n.y);r<Ne||t.push({id:`${i.id}-${e}`,sourceId:i.id,x:(n.x+s.x)/2,y:(n.y+s.y)/2,w:r+i.thickness,h:i.thickness,angle:Math.atan2(s.y-n.y,s.x-n.x)})}return t}function zp(i){const t=i.angle||0,e=Math.cos(t),n=Math.sin(t);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([s,r])=>({x:i.x+s*i.w/2*e-r*i.h/2*n,y:i.y+s*i.w/2*n+r*i.h/2*e}))}function Ph(i,t){const e=t.angle||0,n=Math.cos(e),s=Math.sin(e),r=i.x-t.x,o=i.y-t.y;return{x:r*n+o*s,y:-r*s+o*n}}function Ew(i,t,e){const n=e.x-t.x,s=e.y-t.y,r=n*n+s*s,o=r?Math.max(0,Math.min(1,((i.x-t.x)*n+(i.y-t.y)*s)/r)):0;return Math.hypot(i.x-(t.x+n*o),i.y-(t.y+s*o))}const bf=i=>({x1:us(i.x-i.width/2),x2:us(i.x+i.width/2),y1:us(i.y-i.height/2),y2:us(i.y+i.height/2),id:i.id});function Lh(i,t=[],e=new Set){const n=i.map(bf),s=t.map(bf);if(!n.length)return[];const r=[...new Set([...n,...s].flatMap(h=>[h.x1,h.x2]))].sort((h,d)=>h-d),o=[];for(let h=1;h<r.length;h++){const d=r[h-1],f=r[h];if(f-d<Ne)continue;const p=n.filter(m=>m.x1<f-Ne&&m.x2>d+Ne).map(m=>[m.y1,m.y2]).sort((m,y)=>m[0]-y[0]),x=[];for(const m of p){const y=x.at(-1);y&&m[0]<=y[1]+Ne?y[1]=Math.max(y[1],m[1]):x.push([...m])}const g=s.filter(m=>m.x1<f-Ne&&m.x2>d+Ne);for(const[m,y]of x){let M=[[m,y]];for(const _ of g)M=M.flatMap(([C,w])=>_.y2<=C+Ne||_.y1>=w-Ne?[[C,w]]:[[C,Math.min(w,_.y1)],[Math.max(C,_.y2),w]].filter(([P,D])=>D-P>Ne));for(const[_,C]of M)o.push({x1:d,x2:f,y1:_,y2:C})}}const a=new Map,l=[];for(const h of o){const d=`${h.y1}/${h.y2}`,f=a.get(d);if(f&&Math.abs(f.x2-h.x1)<Ne)f.x2=h.x2;else{const p={...h};l.push(p),a.set(d,p)}}const c=new Set(e);let u=1;return l.map(h=>{const d=n.find(p=>!c.has(p.id)&&Math.abs(p.x1-h.x1)<Ne&&Math.abs(p.x2-h.x2)<Ne&&Math.abs(p.y1-h.y1)<Ne&&Math.abs(p.y2-h.y2)<Ne)||n.find(p=>!c.has(p.id)&&p.x1>=h.x1-Ne&&p.x2<=h.x2+Ne&&p.y1>=h.y1-Ne&&p.y2<=h.y2+Ne)||n.find(p=>!c.has(p.id)&&h.x1>=p.x1-Ne&&h.x2<=p.x2+Ne&&h.y1>=p.y1-Ne&&h.y2<=p.y2+Ne);let f=d==null?void 0:d.id;if(!f)do f=`wall-${u++}`;while(c.has(f)||n.some(p=>p.id===f));return c.add(f),{id:f,x:us((h.x1+h.x2)/2),y:us((h.y1+h.y2)/2),width:us(h.x2-h.x1),height:us(h.y2-h.y1)}})}function lu(i,t=[]){const e=new Set(t.map(s=>s.id));return[...Lh(i,[],e).map(s=>({id:s.id,x:s.x,y:s.y,w:s.width,h:s.height,angle:0})),...t.flatMap(ww)]}const Jt=.31,kp=10,$n={bounds:{minX:-16,maxX:16,minY:-9,maxY:9},spawn:{x:-10,y:-5,vx:0,vy:2.5},goal:{x:10,y:-5,radius:1},walls:[{x:-16.25,y:0,w:.5,h:18.5},{x:16.25,y:0,w:.5,h:18.5},{x:0,y:9.25,w:32.5,h:.5},{x:0,y:-9.25,w:32.5,h:.5},{x:-4,y:-3.5,w:.55,h:11},{x:4,y:3.5,w:.55,h:11}],spikes:[{x:-4.8,y:-6.7,w:.55,h:.8},{x:3.2,y:6.7,w:.55,h:.8}]};function ti(i,t,e){const n=Ph(i,e),s=Math.max(Math.abs(n.x)-e.w/2,0),r=Math.max(Math.abs(n.y)-e.h/2,0);return s*s+r*r<=t*t}function cu(i,t,e,n){const s=Ph(i,n),r=Ph(t,n),o=-n.w/2-e,a=n.w/2+e,l=-n.h/2-e,c=n.h/2+e;let u=0,h=1;for(const[d,f,p,x]of[[s.x,r.x-s.x,o,a],[s.y,r.y-s.y,l,c]])if(Math.abs(f)<1e-9){if(d<p||d>x)return null}else{const g=(p-d)/f,m=(x-d)/f;if(u=Math.max(u,Math.min(g,m)),h=Math.min(h,Math.max(g,m)),u>h)return null}return u}function Tw(i,t,e=$n.goal){const n=t.x-i.x,s=t.y-i.y,r=e.radius+Jt,o=n*n+s*s;if(o<1e-12)return Math.hypot(i.x-e.x,i.y-e.y)<=r?0:null;const a=2*((i.x-e.x)*n+(i.y-e.y)*s),l=(i.x-e.x)**2+(i.y-e.y)**2-r**2;if(l<=0)return 0;const c=a*a-4*o*l;if(c<0)return null;const u=(-a-Math.sqrt(c))/(2*o);return u>=0&&u<=1?u:null}function Gp(i,t,e=$n){let n=null;for(const[r,o]of[["spike",e.spikes],["wall",e.walls]])for(const a of o){const l=cu(i,t,Jt,a);l!==null&&(!n||l<n.t)&&(n={type:r,t:l,x:i.x+(t.x-i.x)*l,y:i.y+(t.y-i.y)*l})}for(const r of e.guides||[]){const o=vw(i,t,r,Jt);o!==null&&(!n||o<n.t)&&(n={type:"wall",t:o,x:i.x+(t.x-i.x)*o,y:i.y+(t.y-i.y)*o})}e.channel&&Math.abs(au(t,e.channel).distance)>e.channel.halfWidth-Jt&&(n=n||{type:"wall",t:1,x:t.x,y:t.y});const s=Tw(i,t,e.goal);return s!==null&&(!n||s<n.t)&&(n={type:"goal",t:s,x:i.x+(t.x-i.x)*s,y:i.y+(t.y-i.y)*s}),n}function hu(i,t=$n){return i.x<t.bounds.minX+.75||i.x>t.bounds.maxX-.75||i.y<t.bounds.minY+.75||i.y>t.bounds.maxY-.75||(t.guides||[]).some(e=>Fp(i,e,.47))||t.walls.some(e=>ti(i,.47,e))||t.spikes.some(e=>ti(i,.47,e))?!1:Math.hypot(i.x-t.goal.x,i.y-t.goal.y)>t.goal.radius+.35}function uu(i,t=kp){const e=Math.hypot(i.x,i.y);return e>t&&(i.x*=t/e,i.y*=t/e),i}function Aw(i,t=$n){let e=0,n=0;const s=4;for(const r of t.spikes){const o=r.x-i.x,a=r.y-i.y,l=Math.hypot(o,a);if(l>=s)continue;const c=l*l+Ai*Ai,u=(1-(l/s)**2)**2,h=(r.strength??3)*u/(c*Math.sqrt(c));e+=o*h,n+=a*h}return{x:e,y:n}}function du(i,t,e,n="fade",s=$n){const r=Wr(i,t,e,n),o=Aw(i,s),a=Cw(i,s);return{x:r.x+o.x+a.x,y:r.y+o.y+a.y}}function Cw(i,t=$n){const e=t.goal.x-i.x,n=t.goal.y-i.y,s=e*e+n*n+Ai*Ai,r=(t.goal.gravity??5)/(s*Math.sqrt(s));return{x:e*r,y:n*r}}function Rw(i,t,e,n=3,s="fade",r=$n){const o=[{x:i.x,y:i.y}];let a={...i};const l=Math.ceil(n/ze);for(let c=0;c<l;c++){const u=du(a,t,e+c*ze,s,r),h=a.vx+u.x*ze,d=a.vy+u.y*ze,f={x:a.x+h*ze,y:a.y+d*ze,vx:h,vy:d},p=uu({x:f.vx,y:f.vy});f.vx=p.x,f.vy=p.y;const x=Gp(a,f,r);if(x)return o.push({x:x.x,y:x.y}),{points:o,impact:x.type};a=f,(c+1)%5===0&&o.push({x:a.x,y:a.y})}return o.push({x:a.x,y:a.y}),{points:o,impact:null}}const fu=new Set(["filters","lens","prism"]),Pw=[16727606,16747570,16768852,6876793,4509157,6651135,12677631];function Lw(i,t,e=0){const n=Math.atan2(t.y-i.y,t.x-i.x)+e;return{x:Math.cos(n),y:Math.sin(n)}}function Iw(i,t,e){return e.some(n=>cu(i,t,0,n)!==null)}const Dw="varying vec2 world; void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xy;gl_Position=projectionMatrix*viewMatrix*p;}",Nw=`varying vec2 world; uniform vec2 origin; uniform vec2 direction; uniform vec3 tint; uniform float strength; uniform float aligned; uniform float aperture; uniform float focus; uniform float spread; uniform vec4 walls[32]; uniform int wallCount;
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
 float fade=pow(1.-x/19.,1.2);float concentration=focus>0.?min(2.5,1.5/max(width,.4)):1.;gl_FragColor=vec4(tint,edge*fade*strength*concentration);}`;class Uw{constructor(t){this.group=new Ce,t.add(this.group),this.beams=[],this.devices=[]}clear(){for(const t of[...this.group.children])t.traverse(e=>{var n,s;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose()}),this.group.remove(t);this.beams=[],this.devices=[]}beam(t,e,n,s=0,r=.12,o=0){const a=Array.from({length:32},(u,h)=>{const d=this.level.walls[h];return new ye((d==null?void 0:d.x)||0,(d==null?void 0:d.y)||0,(d==null?void 0:d.w)||0,(d==null?void 0:d.h)||0)}),l=new Yn({uniforms:{origin:{value:new vt(t.x,t.y)},direction:{value:new vt(1,0)},tint:{value:new se(e)},strength:{value:0},aligned:{value:this.kind==="prism"?0:1},aperture:{value:n},focus:{value:s},spread:{value:r},walls:{value:a},wallCount:{value:Math.min(32,this.level.walls.length)}},vertexShader:Dw,fragmentShader:Nw,transparent:!0,depthWrite:!1,blending:rn}),c=new pe(new ys(32,18),l);c.position.z=-.84,this.group.add(c),this.beams.push({device:t,material:l,turn:o})}device(t,e,n,s,r=4){const o={x:t,y:e,height:r};this.devices.push(o);const a=new pe(new Ks(.08,r,4),new ke({colorWrite:!1,depthWrite:!1}));a.position.set(t,e,1),a.castShadow=!0,this.group.add(a);let l;if(s==="prism"){const h=new Gr;h.moveTo(-.8,-1.6),h.lineTo(.95,0),h.lineTo(-.8,1.6),h.closePath(),l=new ml(h)}else if(s==="lens"){const h=new Gr;h.moveTo(0,-2),h.quadraticCurveTo(1,0,0,2),h.quadraticCurveTo(-1,0,0,-2),l=new ml(h,32)}else l=new ys(.18,r);const c=new pe(l,new ke({color:n,transparent:!0,opacity:.3,depthWrite:!1,side:Pn}));c.position.set(t,e,1.6),this.group.add(c);const u=new v0(new y0(l),new dn({color:n,transparent:!0,opacity:.85}));return u.position.copy(c.position),this.group.add(u),o}reset(t){if(this.clear(),this.kind=t.mechanic,this.level=t.level,this.kind==="filters")for(const[e,n]of[16735110,7536556,7841279].entries()){const s=this.device(0,(e-1)*4,n,"filter",2.6);this.beam(s,n,1.3,0,.16)}if(this.kind==="lens"){const e=this.device(0,0,12119551,"lens");this.beam(e,14940415,1.9,5)}if(this.kind==="prism"){const e=this.device(0,0,15263999,"prism",3.2);Pw.forEach((n,s)=>this.beam(e,n,.12,0,.045,(s-3)*.085+.18))}}update(t,e=1){if(fu.has(this.kind))for(const n of this.beams){const s=Math.hypot(t.x-n.device.x,t.y-n.device.y),r=Lw(t,n.device,n.turn);n.material.uniforms.direction.value.set(r.x,r.y);const o=this.kind==="prism"?1:zg.smoothstep(Math.abs(r.x),.08,.35);n.material.uniforms.strength.value=s<.8?0:Math.min(.85,5*e/(2+s))*o*(Iw(t,n.device,this.level.walls)?0:1)}}}const Fw=[["release","Release the pull","Remove the oldest well","Catch a curve, then tap Remove well to fly along its tangent.","Where does letting go send you?"],["boost","A directed impulse","Slingshot gate","Cross the cyan ring for a fast launch to the right.","Can one impulse replace a long pull?"],["sticky","A moment of stillness","Capture and release","The amber spot catches you. Tap Release to leave in your incoming direction.","What changes when you can wait?"],["eclipse","The disappearing light","Eclipse","The dark body catches you and slowly covers your light. Release when ready.","Can sound carry you through darkness?"],["power","Gathering light","Light pickup","Begin dim. Collect the three pale lights to brighten your glow.","Does a brighter world change your route?"],["dimmer","Losing light","Light drain","Pass through the three violet motes to dim your glow.","How little light can you navigate by?"],["guide","Follow the bend","Guiding walls","Place wells beyond the black walls. Their pull guides the dot through the S-channel.","Can a wall become a track?"],["giant","A heavy neighbor","Large danger body","The orange body pulls gently. Its visible surface is fatal.","How close is a useful pass?"],["chaser","Something follows","Pursuit","A small orange body follows slowly. Draw it away with your wells.","Can a detour become an escape?"],["clock","Wait for an opening","Fixed danger orbit","Orange bodies follow a fixed orbit, unaffected by your wells.","When is the passage safe?"],["sound","Crossing the gates","Sound gates","Cross cyan for bass, violet for offbeat, and gold for chimes. Each adds a repeating part.","Can your route become an instrument?"],["hidden","Light reveals danger","Hidden body","A dark body behind the wall appears near your light. It vanishes completely outside direct light.","What can you discover before you touch it?"],["portals","Elsewhere, still moving","Paired portals","The two teal rings connect. Speed is preserved; the exit turns your flight upward.","Can you steer through a change of space?"],["shadow-posts","A forest of shadows","Moving light and posts","Thread the posts and watch their shadows sweep across one another.","What can a moving shadow reveal?"],["filters","Through colored glass","Color transmission","Move around the colored panes. Light passing through them changes color.","Can a surface paint the space beyond it?"],["lens","Gathering rays","A focusing lens","Move the light around the lens. Follow the beam into its focus and out again.","Where does light become concentrated?"],["prism","A spectrum unfolds","A dispersing prism","Move the light around the prism to turn a pale beam into a rainbow fan.","Can color describe the direction of light?"]];function Ow(i){return Fw.map(([t,e,n,s,r],o)=>({id:t,title:`${String(o+7).padStart(2,"0")} / ${e}`,rule:n,description:s,question:r,objective:s,color:["#76e9e3","#ffd98b","#bfa5ff"][o%3],heroGravity:0,moons:[],mechanic:t,level:{...i(t==="guide"?{x:-13,y:Io(-13),vx:2.5,vy:0}:{x:-11,y:0,vx:2.5,vy:0},t==="guide"?{x:13,y:Io(13)}:{x:12,y:5},t==="shadow-posts"?Array.from({length:15},(a,l)=>({x:-5+l%5*2.5,y:-4+Math.floor(l/5)*4+l%2*.6,w:.38,h:1.1})):t==="hidden"?[{x:-3,y:-3,w:.55,h:8}]:[]),channel:t==="guide"?{...ta}:null,guides:[]}}))}function Bw(i,t){return{x:i.x*Math.cos(t)-i.y*Math.sin(t),y:i.x*Math.sin(t)+i.y*Math.cos(t)}}function Ki(i,t,e){const n=t.x-i.x,s=t.y-i.y,r=Math.max(0,Math.min(1,((e.x-i.x)*n+(e.y-i.y)*s)/(n*n+s*s||1)));return Math.hypot(i.x+r*n-e.x,i.y+r*s-e.y)}class zw{constructor(t,e){this.scene=t,this.audio=e,this.group=new Ce,t.add(this.group),this.items=[]}clear(){for(const t of[...this.group.children])this.group.remove(t),t.traverse(e=>{var n,s;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose()});this.items=[],this.held=null,this.cooldown=0,this.brightness=1,this.layers=new Set,this.beat=-1,this.time=0}marker(t,e,n,s,r=!1){const o=new ke({color:s,transparent:!0,opacity:r?1:.8}),a=new pe(r?new Zi(n,48):new Zo(n-.035,n+.035,64),o);return a.position.set(t,e,1.4),this.group.add(a),a}reset(t){this.clear(),this.kind=t.mechanic,this.walls=t.level.walls;const e=(n,s,r,o,a=!1)=>{const l=["power","dimmer","giant","chaser","clock","portals"].includes(this.kind),c=this.kind==="dimmer"?Tp(.22):this.kind==="eclipse"?Ep(r):l?iu(["power","dimmer"].includes(this.kind)?.22:r,o,this.kind==="portals"):this.marker(n,s,r,o,a);(l||this.kind==="eclipse")&&(c.position.set(n,s,1.4),this.group.add(c));const u={x:n,y:s,r,mesh:c};return this.items.push(u),u};if(["boost","sticky","eclipse"].includes(this.kind)&&e(-3,0,this.kind==="eclipse"?.45:.85,this.kind==="eclipse"?1250339:this.kind==="boost"?7793123:16767371,this.kind==="eclipse"),["power","dimmer","sound"].includes(this.kind))for(let n=0;n<3;n++)e(-5+n*5,0,.65,this.kind==="power"?14680057:this.kind==="dimmer"?12559871:[7793123,12559871,16767371][n]);if(this.kind==="power"&&(this.brightness=.24),this.kind==="giant"){const n=t.giant||{x:0,y:0,radius:1.6,strength:22},s=e(n.x,n.y,n.radius,16747058,!0);s.strength=n.strength}if(this.kind==="chaser"&&e(-6,-4,.3,16747058,!0),this.kind==="clock")for(let n=0;n<3;n++){const s=e(0,0,.35,16747058,!0);s.phase=n*Math.PI*2/3}if(this.kind==="clock"&&this.marker(0,0,3.5,6376765),this.kind==="hidden"){const n=e(0,-2,1,9923428,!0);n.mesh.visible=!1}this.kind==="portals"&&(e(-3,0,1,7793123),e(6,-3,1,7793123),this.marker(6,-1.6,.12,7793123,!0)),this.kind==="boost"&&(this.marker(-2.8,0,.13,7793123,!0),this.marker(-2.5,0,.09,7793123,!0))}updateVisuals(t,e,n=1,s=1){var r,o;for(const a of this.items){if((o=(r=a.mesh.userData).animate)==null||o.call(r,e,s),this.kind==="hidden"){const l=Math.hypot(t.x-a.x,t.y-a.y),c=this.walls.some(d=>cu(t,a,0,d)!==null),u=Math.max(0,1-(l/50)**4)**2,h=85*Math.max(0,n)*u/(1+l*l);a.mesh.visible=h>.15&&!c,a.mesh.material.opacity=Math.min(1,Math.max(.35,h*.6))}this.kind==="sound"&&a.used&&a.mesh.scale.setScalar(1+.12*Math.exp(-(e*4%1)*4))}}release(t){if(!this.held)return;const{vx:e,vy:n}=this.held;t.velocity.set(e,n,0),this.held=null,this.cooldown=this.time+.8,this.brightness=1,this.audio.tone(440,0,.4,.08)}step(t,e,n,s,r,o){var c,u,h,d;if(this.time=n,this.held){t.position.set(this.held.x,this.held.y,0),t.velocity.setZero(),t.force.setZero(),this.kind==="eclipse"&&(this.brightness=Math.max(.025,1-(n-this.held.at)/3));return}const a=t.position;for(let f=0;f<this.items.length;f++){const p=this.items[f];if(p.used)continue;if(this.kind==="clock"&&f<3&&(p.x=Math.cos(n*.65+p.phase)*3.5,p.y=Math.sin(n*.65+p.phase)*3.5),this.kind==="chaser"){const g=a.x-p.x,m=a.y-p.y,y=Math.hypot(g,m)||1,M=Wr(p,s,n,r);p.vx=(p.vx||0)+(g/y*.55+M.x*.3)/120,p.vy=(p.vy||0)+(m/y*.55+M.y*.3)/120;const _=Math.hypot(p.vx,p.vy);_>1.7&&(p.vx*=1.7/_,p.vy*=1.7/_),p.x+=p.vx/120,p.y+=p.vy/120,p.x=Math.max(-14,Math.min(14,p.x)),p.y=Math.max(-7,Math.min(7,p.y))}if(p.mesh.position.set(p.x,p.y,1.4),this.kind==="giant"){const g=p.x-a.x,m=p.y-a.y,y=g*g+m*m+2;t.velocity.x+=g*p.strength/Math.pow(y,1.5)/120,t.velocity.y+=m*p.strength/Math.pow(y,1.5)/120}const x=Ki(e,a,p)<p.r+Jt;if(["giant","chaser","hidden"].includes(this.kind)||this.kind==="clock"&&f<3){if(x){o("hazard");return}continue}if(!(!x||n<this.cooldown)){if(["sticky","eclipse"].includes(this.kind)){this.held={x:p.x,y:p.y,vx:t.velocity.x,vy:t.velocity.y,at:n},t.position.set(p.x,p.y,0),t.velocity.setZero(),this.audio.tone(196,0,.8,.08);return}if(this.kind==="boost"&&(t.velocity.set(15,0,0),this.cooldown=n+1,this.audio.tone(660,0,.35,.08)),["power","dimmer"].includes(this.kind)&&(p.used=!0,p.mesh.visible=!1,this.brightness=Math.max(.15,Math.min(1.5,this.brightness+(this.kind==="power"?.4:-.28))),this.audio.tone(this.kind==="power"?523:196,0,.5,.08)),this.kind==="sound"&&(p.used=!0,p.mesh.material.color.setHex(16777215),this.layers.add(f),(u=(c=this.audio).gateAcquire)==null||u.call(c,f)),this.kind==="portals"){const g=this.items[1-f],m=f===0?Math.PI/2:-Math.PI/2,y=Bw({x:t.velocity.x,y:t.velocity.y},m),M=Math.hypot(y.x,y.y)||1;return t.position.set(g.x+y.x/M*1.4,g.y+y.y/M*1.4,0),t.velocity.set(y.x,y.y,0),this.cooldown=n+.8,this.audio.tone(330,0,.6,.08),"teleport"}}}const l=Math.floor(n*4);if(l!==this.beat){this.beat=l;for(const f of this.layers)(d=(h=this.audio).gateBeat)==null||d.call(h,f,l)}}}const po=new H;function zn(i,t,e,n,s,r){const o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;po.copy(t),po[n]=0,po.normalize();const c=.5*o/(o+a),u=1-po.angleTo(i)/l;return Math.sign(po[e])===1?u*c:a/(o+a)+c+c*(1-u)}class pu extends Ks{constructor(t=1,e=1,n=1,s=2,r=.1){const o=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new H,c=new H,u=new H(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=h.length/6,x=new H,g=.5/o;for(let m=0,y=0;m<h.length;m+=3,y+=2)switch(l.fromArray(h,m),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),h[m+0]=u.x*Math.sign(l.x)+c.x*r,h[m+1]=u.y*Math.sign(l.y)+c.y*r,h[m+2]=u.z*Math.sign(l.z)+c.z*r,d[m+0]=c.x,d[m+1]=c.y,d[m+2]=c.z,Math.floor(m/p)){case 0:x.set(1,0,0),f[y+0]=zn(x,c,"z","y",r,n),f[y+1]=1-zn(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),f[y+0]=1-zn(x,c,"z","y",r,n),f[y+1]=1-zn(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),f[y+0]=1-zn(x,c,"x","z",r,t),f[y+1]=zn(x,c,"z","x",r,n);break;case 3:x.set(0,-1,0),f[y+0]=1-zn(x,c,"x","z",r,t),f[y+1]=1-zn(x,c,"z","x",r,n);break;case 4:x.set(0,0,1),f[y+0]=1-zn(x,c,"x","y",r,t),f[y+1]=1-zn(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),f[y+0]=zn(x,c,"x","y",r,t),f[y+1]=1-zn(x,c,"y","x",r,e);break}}static fromJSON(t){return new pu(t.width,t.height,t.depth,t.segments,t.radius)}}class kw{constructor(){this.enabled=!0,this.step=0}unlock(){if(!this.enabled)return;const t=window.AudioContext||window.webkitAudioContext;if(t){if(!this.context){const e=this.context=new t;this.master=e.createGain(),this.master.gain.value=.32;const n=e.createDynamicsCompressor();this.master.connect(n),n.connect(e.destination),this.heartbeatBus=e.createGain(),this.heartbeatBus.gain.value=1,this.heartbeatBus.connect(this.master),this.tail=e.createOscillator(),this.tail.type="triangle",this.tailGain=e.createGain(),this.tailGain.gain.value=0,this.tail.connect(this.tailGain),this.tailGain.connect(this.master),this.tail.start(),this.humGain=e.createGain(),this.humGain.gain.value=0,this.humGain.connect(this.master),this.hum=e.createOscillator(),this.hum.type="triangle",this.hum.frequency.value=196,this.hum.connect(this.humGain),this.hum.start(),this.humOvertone=e.createOscillator(),this.humOvertone.frequency.value=392.35;const s=e.createGain();s.gain.value=.3,this.humOvertone.connect(s),s.connect(this.humGain),this.humOvertone.start();const r=e.createBuffer(1,e.sampleRate*2,e.sampleRate),o=r.getChannelData(0);for(let l=0;l<o.length;l++)o[l]=Math.random()*2-1;this.noiseBuffer=r,this.air=e.createBufferSource(),this.air.buffer=r,this.air.loop=!0;const a=e.createBiquadFilter();a.type="bandpass",a.frequency.value=1600,a.Q.value=.8,this.airGain=e.createGain(),this.airGain.gain.value=0,this.air.connect(a),a.connect(this.airGain),this.airGain.connect(this.master),this.air.start()}this.context.state==="suspended"&&this.context.resume().catch(()=>{})}}setEnabled(t){this.enabled=t,t&&this.unlock(),this.context&&this.master.gain.setTargetAtTime(t?.32:0,this.context.currentTime,.04)}tone(t,e=0,n=1.4,s=.16,r=t){if(!this.enabled||!this.context)return;const o=this.context,a=o.currentTime+e,l=o.createOscillator(),c=o.createGain();l.type="sine",l.frequency.setValueAtTime(t,a),l.frequency.exponentialRampToValueAtTime(Math.max(20,r),a+n),c.gain.setValueAtTime(0,a),c.gain.linearRampToValueAtTime(s,a+.025),c.gain.exponentialRampToValueAtTime(1e-4,a+n),l.connect(c),c.connect(this.master),l.start(a),l.stop(a+n+.05),l.onended=()=>{l.disconnect(),c.disconnect()}}placement(){this.unlock();const t=[293.665,440,329.628,523.251,391.995],e=t[this.step++%t.length];this.tone(e,0,1.9,.19),this.tone(e*2,.08,1.3,.045),this.tone(e,.32,1.5,.045)}trail(t,e,n){if(!this.context)return;const s=this.context.currentTime,r=Math.exp(-Math.max(0,n)/10),o=t&&this.enabled;this.tailGain.gain.setTargetAtTime(o?Math.min(.11,.035+e*.009)*r*.55:0,s,.16),this.airGain.gain.setTargetAtTime(o?Math.min(.13,e*.018)*r*.12:0,s,.2),this.tail.frequency.setTargetAtTime(260+Math.min(e,15)*16,s,.3)}orb(t,e,n=1){const s=.5+.5*Math.sin(e*Math.PI*2*.65);if(this.context){const r=Math.max(.08,Math.min(1.5,n));this.humGain.gain.setTargetAtTime(t&&this.enabled?(.04+s*.085)*r:0,this.context.currentTime,.08);const o=196*Math.pow(2,(Math.max(.15,n)-1)*.22);this.hum.frequency.setTargetAtTime(o,this.context.currentTime,.2),this.humOvertone.frequency.setTargetAtTime(o*2+.35,this.context.currentTime,.2)}return s}gateAcquire(t){const e=[130.81,392,783.99][t];this.tone(e,0,.3,.25),this.tone(e*1.5,.13,.4,.15),t===0&&(this.tone(261.63,0,.35,.18),this.tone(392,.08,.22,.06))}gateBeat(t,e){t===0&&e%4===0&&(this.tone(130.81,0,.22,.28,65.405),this.tone(261.63,0,.18,.085),this.tone(392,0,.11,.035)),t===1&&e%4===2&&this.tone(392,0,.18,.2),t===2&&e%2===1&&this.tone(e%4===1?783.99:587.33,0,.12,.14)}heartbeat(t,e=0){if(!this.enabled||!this.context)return;const n=this.context,s=n.currentTime,r=t==="lub"?90:115,o=t==="lub"?55:70,a=t==="lub"?.17:.13,l=n.createGain(),c=n.createOscillator(),u=n.createOscillator(),h=n.createGain();this.heartbeatBus.gain.setTargetAtTime(1,s,.005),c.type="triangle",c.frequency.setValueAtTime(r,s),c.frequency.exponentialRampToValueAtTime(o,s+a),u.type="sine",u.frequency.setValueAtTime(r*2,s),u.frequency.exponentialRampToValueAtTime(o*2,s+a),h.gain.value=.22,l.gain.setValueAtTime(0,s),l.gain.linearRampToValueAtTime(.22+Math.max(0,Math.min(1,e))*.09,s+.018),l.gain.exponentialRampToValueAtTime(1e-4,s+a),c.connect(l),u.connect(h),h.connect(l),l.connect(this.heartbeatBus),c.start(s),u.start(s),c.stop(s+a+.01),u.stop(s+a+.01),c.onended=()=>{c.disconnect(),u.disconnect(),h.disconnect(),l.disconnect()}}stopHeartbeat(){this.context&&this.heartbeatBus&&this.heartbeatBus.gain.setTargetAtTime(0,this.context.currentTime,.015)}noise(t,e,n){if(!this.enabled||!this.context)return;const s=this.context,r=s.currentTime,o=s.createBufferSource(),a=s.createBiquadFilter(),l=s.createGain();o.buffer=this.noiseBuffer,a.type="lowpass",a.frequency.setValueAtTime(e,r),a.frequency.exponentialRampToValueAtTime(80,r+t),l.gain.setValueAtTime(n,r),l.gain.exponentialRampToValueAtTime(1e-4,r+t),o.connect(a),a.connect(l),l.connect(this.master),o.start(),o.stop(r+t),o.onended=()=>{o.disconnect(),a.disconnect(),l.disconnect()}}death(){this.noise(.45,1800,.17),this.tone(150,0,.4,.17,42)}portal(){[261.626,329.628,391.995,523.251].forEach((t,e)=>this.tone(t,e*.11,2.6,.1)),this.noise(.8,4200,.035)}reset(){this.step=0,this.stopHeartbeat(),this.trail(!1,0,0),this.orb(!1,0)}}function Gw(i,t,e,n,s,r,o,a=null){const l=i.getContext("2d"),c=i.width,u=i.height;l.fillStyle="#050e18",l.fillRect(0,0,c,u);const h=48,d=Math.min((c-h*2)/(s.maxX-s.minX),(u-h*2)/(s.maxY-s.minY)),f=(s.maxX-s.minX)*d,p=(s.maxY-s.minY)*d,x=(c-f)/2,g=(u-p)/2,m=(s.minX+e)/(e*2)*t.width,y=(n-s.maxY)/(n*2)*t.height,M=(s.maxX-s.minX)/(e*2)*t.width,_=(s.maxY-s.minY)/(n*2)*t.height;l.save(),l.globalCompositeOperation="lighter",a&&(l.globalAlpha=.68,l.drawImage(a,m,y,M,_,x,g,f,p),l.globalAlpha=1),l.filter="blur(3px)";for(let D=0;D<4;D++)l.drawImage(t,m,y,M,_,x,g,f,p);l.filter="none";for(let D=0;D<7;D++)l.drawImage(t,m,y,M,_,x,g,f,p);l.restore();const C=D=>({x:x+(D.x-s.minX)*d,y:g+(s.maxY-D.y)*d}),w=C(r),P=C(o);l.shadowBlur=16,l.shadowColor="#7cffee",l.fillStyle="#dcfff6",l.beginPath(),l.arc(w.x,w.y,3,0,Math.PI*2),l.fill(),l.shadowColor="#b78aff",l.strokeStyle="#b78aff",l.lineWidth=2,l.beginPath(),l.arc(P.x,P.y,7,0,Math.PI*2),l.stroke(),l.shadowBlur=0}const wf=70,Hw=$n.walls.slice(0,4),Vw=i=>{const t=i.maxX-i.minX,e=i.maxY-i.minY,n=(i.minX+i.maxX)/2,s=(i.minY+i.maxY)/2;return[{x:i.minX-.25,y:s,w:.5,h:e+.5},{x:i.maxX+.25,y:s,w:.5,h:e+.5},{x:n,y:i.maxY+.25,w:t+.5,h:.5},{x:n,y:i.minY-.25,w:t+.5,h:.5}]},ds=(i,t,e=[],n=[],s=$n.bounds)=>({bounds:{...s},spawn:i,goal:{radius:1,...t},walls:[...(s===$n.bounds?Hw:Vw(s)).map(r=>({...r})),...e],spikes:n}),qi=[{id:"drift",title:"01 / A gentle curve",rule:"Temporary gravity",color:"#76e9e3",description:"An open room. Place a well beside your path, then let its pull fade.",question:"How little force is enough to steer?",objective:"Bend your flight toward the portal.",level:ds({x:-11,y:-3,vx:2.5,vy:0},{x:11,y:3}),heroGravity:0,moons:[]},{id:"satellites",title:"02 / A little gravity",rule:"The dot attracts matter",color:"#bfa5ff",description:"Three loose moons respond to the dot and your wells. Attraction pulls both ways.",question:"Does carrying a little world change the flight?",objective:"Gather or scatter the pale moons. The portal is optional.",level:ds({x:-5,y:0,vx:1.3,vy:0},{x:12,y:0}),heroGravity:12,moons:[{x:-3.2,y:0,vx:1.3,vy:2},{x:-5,y:2.5,vx:-.7,vy:0},{x:-7.8,y:0,vx:1.3,vy:-1.7}]},{id:"slingshot",title:"03 / Close to the flame",rule:"Risk and redirection",color:"#ffae69",description:"A stronger ember bends nearby trajectories. Its bright center is still fatal.",question:"Can a hazard also become a useful tool?",objective:"Arc around the ember and over the black barrier.",level:ds({x:-11,y:-3,vx:2.6,vy:1.2},{x:11,y:3},[{x:4,y:-4.2,w:.55,h:9.6}],[{x:-1,y:0,w:.55,h:.8,strength:18}]),heroGravity:0,moons:[]},{id:"gate",title:"04 / Bring a moon",rule:"Matter opens a passage",color:"#ffd98b",description:"Draw the gold moon into the gold ring. The gate latches open when the moon arrives.",question:"Could gravity replace a key or a button?",objective:"Bring the moon to the gold ring, then reach the portal.",level:ds({x:-11,y:-3,vx:1,vy:.8},{x:11,y:0},[{x:0,y:0,w:.55,h:18,gate:!0}]),heroGravity:12,moons:[{x:-7,y:1.5,vx:0,vy:0}],plate:{x:-5,y:3,radius:1.2}},{id:"maze",title:"05 / The winding room",rule:"Level-design reference",color:"#89bfd4",description:"The original winding maze, with soft wells, orange hazards, and a purple exit.",question:"Which turns feel expressive, and which feel fiddly?",objective:"Find your way around the two barriers.",level:$n,heroGravity:0,moons:[]},{id:"orbit",title:"06 / An orbital sketch",rule:"Catch, orbit, release",color:"#92c9ff",description:"Begin in a circular orbit. Add another well or let the first one dissolve.",question:"Where does an orbit become a drawing?",objective:"Let the wells leave a pattern.",sandbox:!0,level:$n,heroGravity:0,moons:[]}];qi.push(...Ow(ds));qi.push({id:"companion",title:`${String(qi.length+1).padStart(2,"0")} / A companion returns`,rule:"A borrowed orbit",color:"#d4beff",description:"One little moon orbits your light. A nearby well can borrow it; when the pull fades, it finds its way back.",question:"Can a small orbit feel like a companion?",objective:"Guide the dot across the open room. Watch the companion wander and return.",mechanic:"companion",heroGravity:0,level:ds({x:-11,y:-3,vx:5,vy:.2},{x:11,y:4}),moons:[{x:-9,y:-3,vx:5,vy:1.55}]},{id:"burnout",title:`${String(qi.length+2).padStart(2,"0")} / The burning light`,rule:"Light as fuel",color:"#ffd98b",description:"Your glow slowly burns away. Gather wandering embers to refill it and keep the gate open.",question:"Can light become a resource you route around?",objective:"Gather pale embers to keep the gate open, then reach the portal.",mechanic:"burnout",heroGravity:0,moons:[],level:ds({x:-11,y:-3,vx:.9,vy:.2},{x:11,y:3},[{x:5,y:0,w:.55,h:18,gate:!0}])},{id:"wideworld",title:`${String(qi.length+3).padStart(2,"0")} / A wider world`,rule:"Scale and space",color:"#a8c9ff",description:"A broad chamber with long open stretches and a larger portal. The same gravity rules feel different across distance.",question:"How does room to roam change your aim?",objective:"Cross the great chamber and enter the far portal.",heroGravity:0,moons:[],level:ds({x:-42,y:-18,vx:2.5,vy:.8},{x:42,y:18,radius:2},[{x:-23,y:-12,w:.8,h:16},{x:-2,y:13,w:.8,h:18},{x:20,y:-11,w:.8,h:19}],[],{minX:-48,maxX:48,minY:-27,maxY:27})});function Hp(i){return qi.find(t=>t.id===i)||qi[0]}function Ww(i,t,e){const n={x:0,y:0},s=t.map(r=>{const o=i.x-r.x,a=i.y-r.y,l=o*o+a*a+Ai*Ai,c=e/(l*Math.sqrt(l)),u={x:o*c,y:a*c};return n.x-=u.x*r.mass,n.y-=u.y*r.mass,u});return{hero:n,moons:s}}function Xw(i,t){return!!i&&t.some(e=>Math.hypot(e.x-i.x,e.y-i.y)<=i.radius-.16)}const qw=.018,Yw=.3,Vp=18,$w=4,Ef=.65;function jw(i=0,t=Math.random){return{energy:.6,gateOpen:!0,pickups:[],nextSpawnAt:i+2.5+t()*1.5,nextId:1,pendingClose:!1}}function Zw(i,t,e,n,s=Math.random){for(let r=0;r<32;r++){const o=s()*Math.PI*2,a=2+s()*5,l={x:i.x+Math.cos(o)*a,y:i.y+Math.sin(o)*a};if(hu(l,t)&&!(!n&&t.walls.some(c=>c.gate&&(i.x-c.x)*(l.x-c.x)<0))&&!e.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<1.2))return l}return null}function Kw(i,{before:t,hero:e,collectors:n=[],level:s,dt:r,time:o,rng:a=Math.random}){const l={...i,pickups:i.pickups.filter(d=>o-d.createdAt<Vp)};l.energy=Math.max(.06,Math.min(1,i.energy-qw*r));let c=0;if(l.pickups=l.pickups.filter(d=>Ki(t,e,d)<=Ef+Jt||n.some(({from:f,to:p,radius:x=.16})=>Ki(f,p,d)<=Ef+x)?(c++,!1):!0),l.energy=Math.min(1,l.energy+c*Yw),o>=l.nextSpawnAt){if(l.pickups.length<$w){const d=Zw(e,s,l.pickups,l.gateOpen,a);d&&l.pickups.push({...d,id:l.nextId++,createdAt:o})}l.nextSpawnAt=o+2.5+a()*1.5}const u=s.walls.find(d=>d.gate),h=!!u&&ti(e,Jt,u);return l.pendingClose=!1,l.gateOpen&&l.energy<.35?h?l.pendingClose=!0:l.gateOpen=!1:!l.gateOpen&&l.energy>.5&&(l.gateOpen=!0),{state:l,collected:c,gateChanged:l.gateOpen!==i.gateOpen}}function Jw(i,t,e=1.5){const n=i.maxX-i.minX+e*2,s=i.maxY-i.minY+e*2,r=Math.max(n,s*t);return{width:r,height:r/t}}function Qw(i){const t=Math.max(35,21*i);return{width:t,height:t/i}}function tE(i,t,e,n,s,r,o=!1){const a=Math.hypot(e.x,e.y),l=t.x+(a?e.x/a*2:0),c=t.y+(a?e.y/a*2:0),u=(g,m,y)=>m>y?(m+y)/2:Math.max(m,Math.min(y,g)),h=s.width/2,d=s.height/2,f=u(l,n.minX+h-.75,n.maxX-h+.75),p=u(c,n.minY+d-.75,n.maxY-d+.75),x=o?1:1-Math.exp(-4*Math.max(0,r));return{x:i.x+(f-i.x)*x,y:i.y+(p-i.y)*x}}const eE=1,nE="campaign-1",iE="The long crossing",sE={minX:-20,maxX:76,minY:-27,maxY:27},rE={startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},oE={x:0,y:0,direction:0,speed:1.8},aE={x:50,y:0,radius:1.5,gravity:5},lE=[],cE=[{id:"bass",type:"soundGate",x:10,y:0,radius:.9,slot:0},{id:"offbeat",type:"soundGate",x:24,y:6,radius:.9,slot:1},{id:"chime",type:"soundGate",x:40,y:-5,radius:.9,slot:2}],hE={version:eE,id:nE,title:iE,bounds:sE,settings:rE,start:oE,exit:aE,walls:lE,entities:cE},uE=1,dE="campaign-2",fE="The heavy neighbor",pE={minX:-20,maxX:76,minY:-27,maxY:27},mE={startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},gE={x:0,y:0,direction:0,speed:1.8},xE={x:50,y:0,radius:1.5,gravity:5},vE=[],yE=[{id:"companion-a",type:"companion",x:6,y:1.5,radius:.16,captureRadius:2.8},{id:"companion-b",type:"companion",x:15,y:-2,radius:.16,captureRadius:2.8},{id:"giant",type:"ember",x:28,y:0,radius:4,gravity:70,lethal:!0,burnsCompanions:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0},{id:"bass",type:"soundGate",x:10,y:0,radius:.9,slot:0},{id:"offbeat",type:"soundGate",x:28,y:9,radius:.9,slot:1},{id:"chime",type:"soundGate",x:43,y:-5,radius:.9,slot:2}],_E={version:uE,id:dE,title:fE,bounds:pE,settings:mE,start:gE,exit:xE,walls:vE,entities:yE},mu="counterclockwise",ME=["counterclockwise","clockwise"],Ih=3.5,Wp=9.6,SE=i=>i==="clockwise"?-1:1;function Xp(i){return i.orbitRadius>0&&i.speed>0?2*Math.PI*i.orbitRadius/i.speed:1/0}function ea(i,t){return i>0&&t>0&&Number.isFinite(i)&&Number.isFinite(t)?2*Math.PI*i/t:NaN}function _s(i,t=0){const e=Number.isFinite(i.orbitRadius)?i.orbitRadius:0,n=Number.isFinite(i.speed)?i.speed:0,r=(Number.isFinite(i.phase)?i.phase:0)*Math.PI/180+SE(i.orbitDirection)*t*n/Math.max(e,.01);return{x:i.x+Math.cos(r)*e,y:i.y+Math.sin(r)*e}}function bE(i,t){const e=Xp(i),n=!Number.isFinite(t)||t<0?NaN:t===0?0:Number.isFinite(e)?ea(t,e):Number.isFinite(i.speed)&&i.speed>=0?i.speed:0;return{...i,orbitRadius:t,speed:n}}function wE(i){const t=i.orbitRadius>0?i.orbitRadius:Ih;return{...i,motion:"orbit",orbitRadius:t,speed:i.speed>0?i.speed:ea(t,Wp),orbitDirection:i.orbitDirection||mu}}function qp(i,t){const e=ea(Ih,Wp);return[0,120,240].map((n,s)=>({id:t[s],type:"ember",x:i.x,y:i.y,radius:.35,gravity:0,lethal:!0,motion:"orbit",speed:e,orbitRadius:Ih,phase:n,orbitDirection:mu}))}function Yp(i,t,e,n,s=.31){for(const r of i){if(r.x-r.orbitRadius-r.radius<t.minX||r.x+r.orbitRadius+r.radius>t.maxX||r.y-r.orbitRadius-r.radius<t.minY||r.y+r.orbitRadius+r.radius>t.maxY)return"Orbit ring needs more room inside the bounds.";const o=_s(r,0);if(Math.hypot(o.x-e.x,o.y-e.y)<=r.radius+s)return"An orbiting ember would hit the start.";if(Math.hypot(o.x-n.x,o.y-n.y)<=r.radius+n.radius+s)return"An orbiting ember would cover the exit."}return null}function EE(i,t,e=null){const n=i.filter(a=>a.type==="ember"&&a.motion==="orbit"),s=n.map(a=>({entity:a,distance:Math.hypot(t.x-_s(a).x,t.y-_s(a).y)})).filter(a=>a.distance<=a.entity.radius+.4).sort((a,l)=>a.distance-l.distance);if(s.length)return{id:s[0].entity.id,part:"body"};const r=n.filter(a=>Math.hypot(t.x-a.x,t.y-a.y)<=.7);if(!r.length)return null;const o=r.findIndex(a=>a.id===e);return{id:r[(o+1)%r.length].id,part:"center"}}const TE=1,$p=["ember","soundGate","impulse","stillness","eclipse","lightPickup","dimmer","portal","companion"],jp=262144,$a=i=>JSON.parse(JSON.stringify(i)),Fs=i=>i&&typeof i=="object"&&!Array.isArray(i),le=(i,t,e,n=-1/0,s=1/0)=>((typeof i!="number"||!Number.isFinite(i)||i<n||i>s)&&e.push(`${t} must be a finite number from ${n} to ${s}`),i),Pc=(i,t,e)=>((typeof i!="string"||!/^[a-zA-Z0-9_-]{1,48}$/.test(i))&&e.push(`${t} must be a short unique ID`),i),mo=(i,t,e)=>Fs(i)?{x:le(i.x,`${t}.x`,e,-1e3,1e3),y:le(i.y,`${t}.y`,e,-1e3,1e3)}:(e.push(`${t} is required`),{x:NaN,y:NaN}),Sr=(i,t,e=0)=>i.x-e>=t.minX&&i.x+e<=t.maxX&&i.y-e>=t.minY&&i.y+e<=t.maxY;function fs(i){var w,P,D,E;const t=[];if(!Fs(i))return{ok:!1,errors:["Level must be an object"],document:null};let e=1/0;try{e=new TextEncoder().encode(JSON.stringify(i)).length}catch{}e>jp&&t.push("Level document exceeds 256 KB"),i.version!==TE&&t.push("Unsupported level version");const n=typeof i.title=="string"?i.title.trim().slice(0,80):"";n||t.push("title is required");const s=Pc(i.id,"id",t),r=i.bounds;Fs(r)||t.push("bounds are required");const o={minX:le(r==null?void 0:r.minX,"bounds.minX",t,-500,500),maxX:le(r==null?void 0:r.maxX,"bounds.maxX",t,-500,500),minY:le(r==null?void 0:r.minY,"bounds.minY",t,-500,500),maxY:le(r==null?void 0:r.maxY,"bounds.maxY",t,-500,500)};o.maxX-o.minX>=8&&o.maxY-o.minY>=8||t.push("bounds must span at least 8 units on each axis");const a=i.settings;Fs(a)||t.push("settings are required");const l={startLight:le(a==null?void 0:a.startLight,"settings.startLight",t,0,1),burnRate:le(a==null?void 0:a.burnRate,"settings.burnRate",t,0,1),graceSeconds:le(a==null?void 0:a.graceSeconds,"settings.graceSeconds",t,0,60),wellStrength:le(a==null?void 0:a.wellStrength,"settings.wellStrength",t,0,500),wellLifetime:le(a==null?void 0:a.wellLifetime,"settings.wellLifetime",t,.1,60),maxActiveWells:le(a==null?void 0:a.maxActiveWells,"settings.maxActiveWells",t,1,10),maxTotalWells:(a==null?void 0:a.maxTotalWells)===null?null:le(a==null?void 0:a.maxTotalWells,"settings.maxTotalWells",t,0,1e3),randomRecharge:a==null?void 0:a.randomRecharge};Number.isInteger(l.maxActiveWells)||t.push("maxActiveWells must be an integer"),l.maxTotalWells!==null&&!Number.isInteger(l.maxTotalWells)&&t.push("maxTotalWells must be an integer or null"),typeof l.randomRecharge!="boolean"&&t.push("randomRecharge must be true or false");const u={...mo(i.start,"start",t),direction:le((w=i.start)==null?void 0:w.direction,"start.direction",t,-360,360),speed:le((P=i.start)==null?void 0:P.speed,"start.speed",t,0,30)},d={...mo(i.exit,"exit",t),radius:le((D=i.exit)==null?void 0:D.radius,"exit.radius",t,.3,10),gravity:le((E=i.exit)==null?void 0:E.gravity,"exit.gravity",t,0,100)};(!Array.isArray(i.walls)||i.walls.length>3e3)&&t.push("walls must be an array of at most 3000"),i.wallPaths!==void 0&&(!Array.isArray(i.wallPaths)||i.wallPaths.length>150)&&t.push("wallPaths must be an array of at most 150"),(!Array.isArray(i.entities)||i.entities.length>200)&&t.push("entities must be an array of at most 200");const f=new Set(["__west","__east","__north","__south"]),p=(v,R)=>{Pc(v,R,t),f.has(v)&&t.push(`Duplicate ID: ${v}`),f.add(v)},x=(Array.isArray(i.walls)?i.walls.slice(0,3e3):[]).map((v,R)=>Fs(v)?(p(v.id,`walls[${R}].id`),{id:v.id,...mo(v,`walls[${R}]`,t),width:le(v.width,`walls[${R}].width`,t,.1,1e3),height:le(v.height,`walls[${R}].height`,t,.1,1e3)}):(t.push(`walls[${R}] is invalid`),null)).filter(Boolean);let g=0;const m=(Array.isArray(i.wallPaths)?i.wallPaths.slice(0,150):[]).map((v,R)=>{if(!Fs(v))return t.push(`wallPaths[${R}] is invalid`),null;p(v.id,`wallPaths[${R}].id`);const N=le(v.thickness,`wallPaths[${R}].thickness`,t,.1,20);(!Array.isArray(v.points)||v.points.length<2||v.points.length>301)&&t.push(`wallPaths[${R}].points needs 2 to 301 points`);const L=(Array.isArray(v.points)?v.points.slice(0,301):[]).map((k,B)=>mo(k,`wallPaths[${R}].points[${B}]`,t));g+=L.length;for(let k=1;k<L.length;k++)Math.hypot(L[k].x-L[k-1].x,L[k].y-L[k-1].y)<1e-5&&t.push(`wallPaths[${R}] has duplicate consecutive points`);return{id:v.id,thickness:N,points:L}}).filter(Boolean);g>450&&t.push("wallPaths exceed 450 total points");const y=new Set,M=new Map,_=(Array.isArray(i.entities)?i.entities.slice(0,200):[]).map((v,R)=>{if(!Fs(v))return t.push(`entities[${R}] is invalid`),null;p(v.id,`entities[${R}].id`);const N=`entities[${R}]`;$p.includes(v.type)||t.push(`${N}.type is unsupported`);const L={id:v.id,type:v.type,...mo(v,N,t),radius:le(v.radius,`${N}.radius`,t,.1,20)};return v.type==="ember"?(L.gravity=le(v.gravity,`${N}.gravity`,t,0,500),L.lethal=v.lethal,typeof v.lethal!="boolean"&&t.push(`${N}.lethal must be boolean`),v.burnsCompanions!==void 0&&typeof v.burnsCompanions!="boolean"&&t.push(`${N}.burnsCompanions must be boolean`),L.burnsCompanions=v.burnsCompanions??!1,L.motion=v.motion,["fixed","chaser","orbit"].includes(v.motion)||t.push(`${N}.motion is invalid`),L.speed=le(v.speed,`${N}.speed`,t,0,20),L.orbitRadius=le(v.orbitRadius,`${N}.orbitRadius`,t,0,40),L.phase=le(v.phase,`${N}.phase`,t,-360,360),v.orbitDirection!==void 0&&!ME.includes(v.orbitDirection)&&t.push(`${N}.orbitDirection must be clockwise or counterclockwise`),L.orbitDirection=v.orbitDirection??mu,L.burnsCompanions&&(!L.lethal||L.motion!=="fixed")&&t.push(`${N}.burnsCompanions requires a fixed lethal ember`)):v.type==="soundGate"?(L.slot=le(v.slot,`${N}.slot`,t,0,2),(!Number.isInteger(v.slot)||y.has(v.slot))&&t.push(`${N}.slot must be unique (0, 1, or 2)`),y.add(v.slot)):v.type==="impulse"?(L.direction=le(v.direction,`${N}.direction`,t,-360,360),L.speed=le(v.speed,`${N}.speed`,t,0,30)):v.type==="stillness"||v.type==="eclipse"?(L.captureTime=le(v.captureTime,`${N}.captureTime`,t,.05,30),v.type==="eclipse"&&(L.fadeTime=le(v.fadeTime,`${N}.fadeTime`,t,.05,30))):v.type==="lightPickup"||v.type==="dimmer"?(L.amount=le(v.amount,`${N}.amount`,t,0,1),L.reusable=v.reusable,typeof v.reusable!="boolean"&&t.push(`${N}.reusable must be boolean`),L.cooldown=le(v.cooldown,`${N}.cooldown`,t,0,60)):v.type==="portal"?(L.pairId=Pc(v.pairId,`${N}.pairId`,t),L.exitDirection=le(v.exitDirection,`${N}.exitDirection`,t,-360,360),M.set(v.pairId,(M.get(v.pairId)||0)+1)):v.type==="companion"&&(L.captureRadius=le(v.captureRadius,`${N}.captureRadius`,t,.5,10)),L}).filter(Boolean);for(const[v,R]of M)R!==2&&t.push(`Portal pair ${v} needs exactly two endpoints`);for(const[v,R]of M)if(R===2){const[N,L]=_.filter(k=>k.type==="portal"&&k.pairId===v);Math.hypot(N.x-L.x,N.y-L.y)<=N.radius+L.radius+Jt&&t.push(`Portal pair ${v} endpoints overlap`)}Sr(u,o,Jt)||t.push("start must be inside bounds"),Sr(d,o,d.radius)||t.push("exit must be inside bounds");const C=t.length?[]:lu(x,m);C.length>300&&t.push(`Wall geometry has ${C.length} pieces; maximum 300. Erase or simplify walls.`);for(const v of C){if(v.sourceId&&zp(v).some(N=>!Sr(N,o))&&t.push(`wall path ${v.sourceId} must fit inside bounds`),v.sourceId){ti(u,Jt,v)&&t.push(`start overlaps wall path ${v.sourceId}`),ti(d,d.radius+Jt,v)&&t.push(`exit overlaps wall path ${v.sourceId}`);continue}const R={id:v.id,x:v.x,y:v.y,width:v.w,height:v.h};(R.x-R.width/2<o.minX||R.x+R.width/2>o.maxX||R.y-R.height/2<o.minY||R.y+R.height/2>o.maxY)&&t.push(`wall ${v.id} must fit inside bounds`),ti(u,Jt,v)&&t.push(`start overlaps wall ${v.id}`),ti(d,d.radius+Jt,v)&&t.push(`exit overlaps wall ${v.id}`)}for(const v of x){(!Sr(v,o)||v.x-v.width/2<o.minX||v.x+v.width/2>o.maxX||v.y-v.height/2<o.minY||v.y+v.height/2>o.maxY)&&t.push(`wall ${v.id} must fit inside bounds`);const R={x:v.x,y:v.y,w:v.width,h:v.height};ti(u,Jt,R)&&t.push(`start overlaps wall ${v.id}`),ti(d,d.radius+Jt,R)&&t.push(`exit overlaps wall ${v.id}`)}for(const v of _){const R=v.type==="ember"&&v.motion==="orbit"?v.orbitRadius:0;Sr(v,o,v.type==="companion"?v.captureRadius:v.radius+R)||t.push(`entity ${v.id} must fit inside bounds`)}for(const v of _.filter(R=>R.type==="ember"&&R.lethal)){const R=v.motion==="orbit"?_s(v,0):v;Math.hypot(u.x-R.x,u.y-R.y)<=v.radius+Jt&&t.push(`start overlaps lethal ember ${v.id}`),Math.hypot(d.x-v.x,d.y-v.y)<=v.radius+d.radius+(v.motion==="orbit"?v.orbitRadius:0)&&t.push(`exit overlaps lethal ember ${v.id}`)}for(const v of _.filter(R=>R.type==="portal")){const R=v.exitDirection*Math.PI/180,N={x:v.x+Math.cos(R)*(v.radius+Jt+.2),y:v.y+Math.sin(R)*(v.radius+Jt+.2)};Sr(N,o,Jt)||t.push(`portal ${v.id} exit faces outside bounds`),C.some(L=>ti(N,Jt,L))&&t.push(`portal ${v.id} exit faces a wall`),_.some(L=>L.type==="ember"&&L.lethal&&Math.hypot(N.x-L.x,N.y-L.y)<=Jt+L.radius+(L.motion==="orbit"?L.orbitRadius:0))&&t.push(`portal ${v.id} exit faces a lethal ember`)}return{ok:t.length===0,errors:t,document:t.length?null:{version:1,id:s,title:n,bounds:o,settings:l,start:u,exit:d,walls:x,wallPaths:m,entities:_}}}function AE(i){if(new TextEncoder().encode(i).length>jp)return{ok:!1,errors:["Level document exceeds 256 KB"],document:null};try{return fs(JSON.parse(i))}catch{return{ok:!1,errors:["Invalid JSON"],document:null}}}function Al(i){const t=fs(i);if(!t.ok)throw new Error(t.errors.join("; "));const e=t.document,n=e.start.direction*Math.PI/180,s=e.bounds,r=(s.minX+s.maxX)/2,o=(s.minY+s.maxY)/2,a=s.maxX-s.minX,l=s.maxY-s.minY,c=[{id:"__west",x:s.minX-.25,y:o,w:.5,h:l+.5},{id:"__east",x:s.maxX+.25,y:o,w:.5,h:l+.5},{id:"__north",x:r,y:s.maxY+.25,w:a+.5,h:.5},{id:"__south",x:r,y:s.minY-.25,w:a+.5,h:.5}],u={bounds:$a(e.bounds),spawn:{x:e.start.x,y:e.start.y,vx:Math.cos(n)*e.start.speed,vy:Math.sin(n)*e.start.speed},goal:$a(e.exit),walls:[...c,...lu(e.walls,e.wallPaths)],spikes:[],dangers:e.entities.filter(h=>h.type==="ember"&&h.lethal).map(h=>({x:h.x,y:h.y,radius:h.radius,strength:h.gravity}))};return{document:e,level:u,entities:$a(e.entities),settings:$a(e.settings)}}const Hn={startLight:.6,burnRate:.018,pickupGain:.3,graceSeconds:8,maxActiveWells:2,maxTotalWells:null,pickupLife:18,pickupRadius:.65},CE=[hE,_E].map(Al),gu=CE.map((i,t)=>({id:t+1,title:i.document.title,color:t?"#ffb365":"#b9fff0",objective:t?"Gather pale moons. Their orbits catch light as you curve around the giant ember.":"Keep your light alive. Cross the open chamber to the far portal.",mechanic:"campaign",heroGravity:0,moons:[],document:i.document,entities:i.entities,settings:i.settings,soundGates:i.entities.filter(e=>e.type==="soundGate").map(e=>({id:e.slot,x:e.x,y:e.y,radius:e.radius})),giant:t?{x:28,y:0,radius:4,strength:70}:void 0,level:i.level})),Cl=gu[0];function xu(i){return gu.find(t=>t.id===Number(i))||Cl}function RE(i){return gu.find(t=>t.id===Number(i)+1)||null}function Zp(i,t=Cl.level,e=.47){return hu(i,t)&&!(t.dangers||[]).some(n=>Math.hypot(i.x-n.x,i.y-n.y)<n.radius+e)}function PE(i,t=Hn.maxTotalWells){return t===null||i<t}function Tf(i){const t=Math.imul(i,1664525)+1013904223>>>0;return{seed:t,value:t/4294967296}}function LE(i=428,t=Hn){return{energy:t.startLight,graceLeft:t.graceSeconds,graceDuration:t.graceSeconds,pickups:t.randomRecharge===!1?[]:[{x:6,y:2.5,id:1,createdAt:0},{x:15,y:-3,id:2,createdAt:0}],nextId:3,nextSpawnAt:7,seed:i,beatPhase:0,failed:!1}}function IE(i,t,e=Cl.level){let n=t.seed;for(let s=0;s<32;s++){let r=Tf(n);n=r.seed;const o=(r.value-.5)*Math.PI*1.5;r=Tf(n),n=r.seed;const a=4+r.value*5,l={x:i.x+Math.cos(o)*a,y:i.y+Math.sin(o)*a};if(Zp(l,e,Hn.pickupRadius+Jt)&&!(Math.hypot(l.x-e.goal.x,l.y-e.goal.y)<e.goal.radius+1.3)&&!t.pickups.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<2.5))return{point:l,seed:n}}return{point:null,seed:n}}function DE(i,{before:t,hero:e,collectors:n=[],dt:s,time:r,level:o=Cl.level,config:a=Hn,extraEnergy:l=0,availableCompanions:c=0}){if(i.failed)return{state:i,collected:0,heartbeat:[],failed:!1};const u={...i,pickups:i.pickups.filter(p=>r-p.createdAt<Hn.pickupLife)};u.energy=Math.max(0,i.energy-a.burnRate*s);let h=0;if(u.pickups=u.pickups.filter(p=>{const x=Ki(t,e,p)<=Hn.pickupRadius+Jt,g=n.some(({from:m,to:y,radius:M=.16})=>Ki(m,y,p)<=Hn.pickupRadius+M);return!x&&!g?!0:(h++,!1)}),u.energy=Math.max(0,Math.min(1,u.energy+h*Hn.pickupGain+l)),a.randomRecharge!==!1&&r>=u.nextSpawnAt){const p=IE(e,u,o);u.seed=p.seed,p.point&&u.pickups.push({...p.point,id:u.nextId++,createdAt:r}),u.nextSpawnAt=r+(p.point?7:2)}const d=[];let f=!1;if(u.energy>0)u.graceLeft=a.graceSeconds,u.graceDuration=a.graceSeconds,u.beatPhase=0;else if(u.graceLeft=Math.max(0,i.graceLeft-s),u.graceLeft<=0&&c>0?(f=!0,u.graceLeft=4,u.graceDuration=4,u.beatPhase=0,u.failed=!1):u.failed=u.graceLeft<=0,!u.failed){const p=u.graceDuration||a.graceSeconds,x=p>0?1-u.graceLeft/p:1,g=s*(60+80*x)/60,m=i.energy>0?0:i.beatPhase;i.energy>0&&!f&&d.push({part:"lub",urgency:x});const y=m+g;if(!f){for(let M=Math.floor(m);M<=Math.floor(y);M++)m<M+.22&&y>=M+.22&&d.push({part:"dub",urgency:x}),M>0&&m<M&&y>=M&&d.push({part:"lub",urgency:x});u.beatPhase=y%1}}return{state:u,collected:h,heartbeat:d,consumedCompanion:f,failed:u.failed&&!i.failed}}const vu=["#76e9e3","#bfa5ff","#ffd98b"],Kp=["bass","offbeat","chime"],Jp="orbit-lab-campaign-finished-gates-v2";function NE(){return{mask:0,beat:-1}}function Do(i){return[0,1,2].reduce((t,e)=>t+(i>>e&1),0)}function Qp(i){return Kp.filter((t,e)=>i&1<<e).join(" + ")||"none"}function UE(i,t,e,n,s){let r=i.mask;const o=[];for(const c of t)r&1<<c.id||Ki(e,n,c)<=c.radius+Jt&&(r|=1<<c.id,o.push(c.id));const a=Math.floor(s*4),l=a===i.beat?[]:Kp.map((c,u)=>u).filter(c=>r&1<<c).map(c=>({id:c,beat:a}));return{state:{mask:r,beat:a},acquired:o,beats:l}}function FE(i,t=[1,2]){if(!i||typeof i!="object"||Array.isArray(i))return{};const e={};for(const n of t)Number.isInteger(i[n])&&i[n]>=0&&i[n]<=7&&(e[n]=i[n]);return e}function OE(i,t){return i===void 0||Do(t)>Do(i)?t:i}const Lc=i=>i*Math.PI/180,xl=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y);function BE(i){return{items:Object.fromEntries(i.map(t=>{const e=t.type==="ember"&&t.motion==="orbit"?_s(t,0):t;return[t.id,{x:e.x,y:e.y,vx:0,vy:0,used:!1,until:-1,inside:!1}]})),held:null,teleportUntil:-1,eclipseMultiplier:1}}function zE(i,t){const e=[];for(const n of t){const s=i==null?void 0:i.items[n];!s||s.used||(s.used=!0,e.push({id:n,x:s.x,y:s.y}))}return e}function kE(i,t,e,n,s=null){let r=0,o=0;for(const a of t){if(a.type!=="lightPickup")continue;const l=i==null?void 0:i.items[a.id];if(!l)continue;s&&(l.inside=xl(s,l)<=a.radius+Jt);const c=e.some(({to:h,radius:d=.16})=>xl(h,l)<=a.radius+d),u=!l.moonInside&&!l.inside&&e.some(({from:h,to:d,radius:f=.16})=>Ki(h,d,l)<=a.radius+f);l.moonInside=c,!(!u||l.used||n<l.until||l.lastCollectedAt===n)&&(r+=a.amount,o++,a.reusable||(l.used=!0),l.until=n+a.cooldown,l.lastCollectedAt=n)}return{energyDelta:r,collected:o}}function yu(i,t,e){if(!(i!=null&&i.held))return!1;const n=i.held;return t.velocity.x=n.vx,t.velocity.y=n.vy,i.items[n.id].until=e+.8,i.held=null,i.eclipseMultiplier=1,!0}function GE(i,t,e){let n=0,s=0;for(const r of t)if(r.type==="ember"&&r.gravity>0){const o=e.items[r.id],a=o.x-i.x,l=o.y-i.y,c=a*a+l*l+Ai*Ai,u=r.gravity/(c*Math.sqrt(c));n+=a*u,s+=l*u}return{x:n,y:s}}function HE(i,t,e,n,s,r,o=null,a={}){const l={died:!1,fatalEmber:null,teleported:!1,energyDelta:0,tones:[],companions:[]};let c=!1;if(i.held){const u=i.held;s<u.until?(n.position.x=u.x,n.position.y=u.y,n.velocity.x=0,n.velocity.y=0,i.eclipseMultiplier=u.eclipse?Math.max(.025,1-(s-u.started)/u.fadeTime):1,c=!0):yu(i,n,s)}for(const u of t){const h=i.items[u.id];if(!h||u.type==="soundGate")continue;const d={x:h.x,y:h.y};if(u.type==="ember"){if(u.motion==="orbit"&&Object.assign(h,_s(u,s)),u.motion==="chaser"){const m=n.position.x-h.x,y=n.position.y-h.y,M=Math.hypot(m,y)||1;h.vx=(h.vx+m/M*r*2)*.995,h.vy=(h.vy+y/M*r*2)*.995;const _=Math.hypot(h.vx,h.vy);_>u.speed&&(h.vx*=u.speed/_,h.vy*=u.speed/_),h.x+=h.vx*r,h.y+=h.vy*r,o&&(h.x=Math.max(o.minX+u.radius,Math.min(o.maxX-u.radius,h.x)),h.y=Math.max(o.minY+u.radius,Math.min(o.maxY-u.radius,h.y)))}if(u.lethal&&!a.emberImmune){const m={x:e.x-d.x,y:e.y-d.y},y={x:n.position.x-h.x,y:n.position.y-h.y};if(Ki(m,y,{x:0,y:0})<=u.radius+Jt)return l.died=!0,l.fatalEmber={id:u.id,x:h.x,y:h.y,radius:u.radius},l}continue}if(c){u.type==="lightPickup"&&(h.inside=xl(n.position,h)<=u.radius+Jt);continue}const f=u.type==="companion"?u.captureRadius:u.radius,p=Ki(e,n.position,h)<=f+Jt,x=xl(n.position,h)<=f+Jt,g=p&&!h.inside&&(u.type!=="lightPickup"||!h.moonInside);if(h.inside=x,!(!g||h.used||s<h.until||h.lastCollectedAt===s))if(u.type==="companion")l.companions.push(u.id);else if(u.type==="impulse")n.velocity.x=Math.cos(Lc(u.direction))*u.speed,n.velocity.y=Math.sin(Lc(u.direction))*u.speed,h.until=s+.5,l.tones.push("impulse");else{if(u.type==="stillness"||u.type==="eclipse")return i.held={id:u.id,x:u.x,y:u.y,vx:n.velocity.x,vy:n.velocity.y,started:s,until:s+u.captureTime,eclipse:u.type==="eclipse",fadeTime:u.fadeTime||1},n.position.x=u.x,n.position.y=u.y,n.velocity.x=0,n.velocity.y=0,l.tones.push("capture"),l;if(u.type==="lightPickup"||u.type==="dimmer")l.energyDelta+=(u.type==="lightPickup"?1:-1)*u.amount,u.reusable||(h.used=!0),h.until=s+u.cooldown,l.tones.push(u.type),h.lastCollectedAt=s;else if(u.type==="portal"&&s>=i.teleportUntil){const m=t.find(_=>_.type==="portal"&&_.pairId===u.pairId&&_.id!==u.id);if(!m)continue;const y=Lc(m.exitDirection),M=Math.hypot(n.velocity.x,n.velocity.y);return n.position.x=m.x+Math.cos(y)*(m.radius+Jt+.2),n.position.y=m.y+Math.sin(y)*(m.radius+Jt+.2),n.velocity.x=Math.cos(y)*M,n.velocity.y=Math.sin(y)*M,i.teleportUntil=s+.8,i.items[m.id].inside=!0,l.teleported=!0,l.tones.push("portal"),l}}}return l}const br=i=>structuredClone(i),Af="orbit-lab-editor-draft-v1";function VE(){return{version:1,id:"untitled-level",title:"Untitled crossing",bounds:{minX:-20,maxX:76,minY:-27,maxY:27},settings:{startLight:.6,burnRate:.018,graceSeconds:8,wellStrength:70,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!0},start:{x:0,y:0,direction:0,speed:1.8},exit:{x:50,y:0,radius:1.5,gravity:5},walls:[],wallPaths:[],entities:[]}}class WE{constructor(t){this.document=br(t),this.undoStack=[],this.redoStack=[],this.strokeStart=null,this.selected=null}transact(t){const e=br(this.document);return t(this.document),JSON.stringify(e)===JSON.stringify(this.document)?!1:(this.undoStack.push(e),this.undoStack.length>60&&this.undoStack.shift(),this.redoStack.length=0,!0)}beginStroke(){this.strokeStart||(this.strokeStart=br(this.document))}paint(t){this.beginStroke(),t(this.document)}endStroke(){if(!this.strokeStart)return!1;const t=JSON.stringify(this.strokeStart)!==JSON.stringify(this.document);return t&&(this.undoStack.push(this.strokeStart),this.undoStack.length>60&&this.undoStack.shift(),this.redoStack.length=0),this.strokeStart=null,t}undo(){return this.endStroke(),this.undoStack.length?(this.redoStack.push(br(this.document)),this.document=this.undoStack.pop(),!0):!1}redo(){return this.redoStack.length?(this.undoStack.push(br(this.document)),this.document=this.redoStack.pop(),!0):!1}nextId(t="item"){let e=1;const n=new Set([...this.document.walls,...this.document.wallPaths||[],...this.document.entities].map(s=>s.id));for(;n.has(`${t}-${e}`);)e++;return`${t}-${e}`}get selectedObject(){return this.selected==="start"||this.selected==="exit"?this.document[this.selected]:[...this.document.walls,...this.document.wallPaths||[],...this.document.entities].find(t=>t.id===this.selected)}paintWall(t){this.paint(e=>{e.walls=Lh([...e.walls,t],[],new Set([...e.wallPaths||[],...e.entities].map(n=>n.id)))})}eraseWall(t){this.paint(e=>{e.walls=Lh(e.walls,[t],new Set([...e.wallPaths||[],...e.entities].map(n=>n.id)))})}addOrbitRing(t){this.endStroke();const e=new Set([...this.document.walls,...this.document.wallPaths||[],...this.document.entities].map(a=>a.id)),n=[];let s=1;for(;n.length<3;){const a=`ember-${s++}`;e.has(a)||(e.add(a),n.push(a))}const r=qp(t,n),o=Yp(r,this.document.bounds,this.document.start,this.document.exit);return o?{ok:!1,error:o}:(this.transact(a=>a.entities.push(...r)),this.selected=n[0],{ok:!0,ids:n})}get validation(){return fs(this.document)}clearAll(){this.endStroke();const t=this.transact(e=>{e.walls=[],e.wallPaths=[],e.entities=[]});return this.selected=null,t}startNew(){this.endStroke();const t=VE(),e=this.transact(n=>{for(const s of Object.keys(n))delete n[s];Object.assign(n,t)});return this.selected=null,e}replace(t){this.document=br(t),this.undoStack=[],this.redoStack=[],this.strokeStart=null,this.selected=null}}function XE(i,t,e){return{id:i,type:"companion",x:t,y:e,radius:.16,captureRadius:2.8}}function qE(i){i.type==="ember"&&(!i.lethal||i.motion!=="fixed")&&(i.burnsCompanions=!1)}const Ic=i=>structuredClone(i),Dc={ember:"#ff873c",soundGate:"#80e8e2",impulse:"#7be4f0",stillness:"#ffd58e",eclipse:"#756b9c",lightPickup:"#ffe3a3",dimmer:"#bfa5ff",portal:"#79e1d6",companion:"#d8cdff"},ja=i=>i.replace(/([A-Z])/g," $1").replace(/^./,t=>t.toUpperCase()),Cf={start:["x","y","direction","speed"],exit:["x","y","radius","gravity"],wall:["x","y","width","height"],wallPath:["thickness"],ember:["x","y","radius","gravity","lethal","motion","burnsCompanions"],soundGate:["x","y","radius","slot"],impulse:["x","y","radius","direction","speed"],stillness:["x","y","radius","captureTime"],eclipse:["x","y","radius","captureTime","fadeTime"],lightPickup:["x","y","radius","amount","reusable","cooldown"],dimmer:["x","y","radius","amount","reusable","cooldown"],portal:["x","y","radius","pairId","exitDirection"],companion:["x","y","captureRadius"]};function YE(i,t,e,n){const s={id:n.nextId(i),type:i,x:t,y:e,radius:.9};if(i==="ember")return{...s,radius:1.6,gravity:22,lethal:!0,burnsCompanions:!1,motion:"fixed",speed:0,orbitRadius:0,phase:0,orbitDirection:"counterclockwise"};if(i==="companion")return XE(s.id,t,e);if(i==="soundGate")return{...s,slot:[0,1,2].find(r=>!n.document.entities.some(o=>o.type==="soundGate"&&o.slot===r))??0};if(i==="impulse")return{...s,direction:0,speed:12};if(i==="stillness")return{...s,captureTime:1};if(i==="eclipse")return{...s,captureTime:2,fadeTime:2};if(i==="lightPickup"||i==="dimmer")return{...s,radius:.65,amount:.3,reusable:!1,cooldown:4};if(i==="portal"){const r=n.document.entities.find(o=>o.type==="portal"&&n.document.entities.filter(a=>a.type==="portal"&&a.pairId===o.pairId).length===1);return{...s,pairId:(r==null?void 0:r.pairId)||n.nextId("pair"),exitDirection:0}}return s}function $E({mount:i,defaultDocument:t,onHome:e,onPlay:n}){let s=null;try{const F=localStorage.getItem(Af);F&&F.length<262144&&(s=JSON.parse(F))}catch{}const r=F=>F&&typeof F=="object"&&!Array.isArray(F),o=r(s)&&s.version===1&&Array.isArray(s.walls)&&Array.isArray(s.entities)&&(s.wallPaths===void 0||Array.isArray(s.wallPaths)&&s.wallPaths.every(F=>r(F)&&Array.isArray(F.points)))&&s.walls.every(r)&&s.entities.every(r)&&r(s.bounds)&&r(s.settings)&&r(s.start)&&r(s.exit),a=new WE(o?s:t),l=document.createElement("div");l.className="editor-overlay hidden",l.innerHTML='<header class="editor-header"><div><span class="eyebrow">ORBIT LAB / LEVEL EDITOR</span><h1>Draw a world.</h1></div><div class="editor-header-actions"><span id="editorSaveState" role="status">Saved locally</span><button type="button" data-action="home">Home</button><button type="button" data-action="save">Save draft</button><button type="button" data-action="import">Import JSON</button><button type="button" data-action="export">Export JSON</button><button type="button" data-action="play" class="editor-play">Playtest ↗</button></div></header><div class="editor-main"><div class="editor-stage"><div class="editor-tools" role="toolbar" aria-label="Level tools"><button data-tool="select" aria-pressed="true">Select</button><button data-tool="wall">Wall</button><button data-tool="line">Line</button><button data-tool="erase">Erase</button><button data-tool="start">Start</button><button data-tool="exit">Exit</button><select id="editorEntityTool" aria-label="Place element"><option value="">Add element…</option></select><label>Brush <select id="editorBrush"><option>1</option><option>2</option><option>3</option></select></label><button data-action="finishLine" class="editor-line-action hidden">Finish line</button><button data-action="cancelLine" class="editor-line-action hidden">Cancel line</button><button data-tool="pan">Pan</button><button data-action="undo" title="Undo">↶</button><button data-action="redo" title="Redo">↷</button><button data-action="fit">Fit</button><button data-action="zoomout" aria-label="Zoom out">−</button><button data-action="zoomin" aria-label="Zoom in">+</button><button data-action="drawer" class="editor-drawer-toggle">Properties</button></div><canvas id="editorCanvas" aria-label="Level editing canvas"></canvas><div class="editor-canvas-note">Tap to place · drag to move or paint · wheel or ± to zoom</div></div><aside class="editor-inspector"><div class="editor-inspector-head"><h2>Properties</h2><button data-action="closeDrawer" class="editor-drawer-toggle" aria-label="Close properties">×</button></div><div id="editorValidation" role="status"></div><div class="editor-inspector-tabs" role="tablist" aria-label="Editor properties"><button type="button" role="tab" data-inspector-tab="level" aria-selected="true">Level</button><button type="button" role="tab" data-inspector-tab="selected" aria-selected="false">Selected</button></div><div id="editorFields" role="tabpanel"></div></aside></div><input id="editorFile" type="file" accept="application/json,.json" hidden>',i.append(l);const c=F=>l.querySelector(F),u=c("#editorCanvas"),h=u.getContext("2d"),d=c("#editorFile"),f=c("#editorFields");for(const F of $p){const U=document.createElement("option");U.value=F,U.textContent=F==="companion"?"Companion moon":ja(F),c("#editorEntityTool").append(U)}{const F=document.createElement("option");F.value="orbitRing",F.textContent="Orbit ring · 3 embers",c("#editorEntityTool").append(F)}let p="select",x=12,g={x:0,y:0},m=null,y=1,M=!1,_=!1,C="level",w=null,P=null,D="",E=null,v={width:0,height:0};const R=()=>{try{localStorage.setItem(Af,JSON.stringify(a.document)),c("#editorSaveState").textContent="Saved locally"}catch{c("#editorSaveState").textContent="Local save unavailable"}},N=()=>{const F=a.document.bounds,U=u.getBoundingClientRect();!U.width||!U.height||(x=Math.min((U.width-48)/(F.maxX-F.minX),(U.height-48)/(F.maxY-F.minY)),g={x:U.width/2-(F.minX+F.maxX)/2*x,y:U.height/2+(F.minY+F.maxY)/2*x},_=!0,v={width:U.width,height:U.height},X())},L=()=>{if(!M)return;const F=u.getBoundingClientRect();!F.width||!F.height||(Math.abs(F.width-v.width)>1||Math.abs(F.height-v.height)>1?N():X())},k=F=>({x:F.x*x+g.x,y:-F.y*x+g.y}),B=F=>{const U=u.getBoundingClientRect();return{x:(F.clientX-U.left-g.x)/x,y:-(F.clientY-U.top-g.y)/x}},z=F=>Math.round(F/y)*y,j=F=>({x:z(F.x),y:z(F.y)});function X(){if(!M)return;const F=Math.min(devicePixelRatio||1,2),U=u.getBoundingClientRect();(u.width!==Math.round(U.width*F)||u.height!==Math.round(U.height*F))&&(u.width=Math.round(U.width*F),u.height=Math.round(U.height*F)),h.setTransform(F,0,0,F,0,0),h.clearRect(0,0,U.width,U.height),h.fillStyle="#071521",h.fillRect(0,0,U.width,U.height);const I=a.document.bounds,V=k({x:I.minX,y:0}).x,tt=k({x:I.maxX,y:0}).x,K=k({x:0,y:I.maxY}).y,it=k({x:0,y:I.minY}).y;h.save(),h.beginPath(),h.rect(V,K,tt-V,it-K),h.clip(),h.strokeStyle="#264753",h.lineWidth=1;const _t=x<10?5:x<20?2:1;for(let et=Math.ceil(I.minX/_t)*_t;et<=I.maxX;et+=_t){const A=k({x:et,y:0});h.beginPath(),h.moveTo(A.x,K),h.lineTo(A.x,it),h.stroke()}for(let et=Math.ceil(I.minY/_t)*_t;et<=I.maxY;et+=_t){const A=k({x:0,y:et});h.beginPath(),h.moveTo(V,A.y),h.lineTo(tt,A.y),h.stroke()}for(const et of a.document.walls){const A=k(et);h.fillStyle=et.id===a.selected?"#2e6772":"#02080d",h.fillRect(A.x-et.width*x/2,A.y-et.height*x/2,et.width*x,et.height*x)}for(const et of a.document.wallPaths||[])if(!(et.points.length<2)&&(h.beginPath(),et.points.forEach((A,S)=>{const G=k(A);S?h.lineTo(G.x,G.y):h.moveTo(G.x,G.y)}),h.strokeStyle=et.id===a.selected?"#2e6772":"#02080d",h.lineWidth=et.thickness*x,h.lineCap="square",h.lineJoin="bevel",h.stroke(),et.id===a.selected))for(const A of et.points){const S=k(A);h.beginPath(),h.arc(S.x,S.y,5,0,Math.PI*2),h.fillStyle="#a9fff0",h.fill()}if(w!=null&&w.length){if(h.beginPath(),w.forEach((et,A)=>{const S=k(et);A?h.lineTo(S.x,S.y):h.moveTo(S.x,S.y)}),P){const et=k(P);h.lineTo(et.x,et.y)}h.strokeStyle="#8ee9dc",h.lineWidth=Math.max(2,Number(c("#editorBrush").value)*x),h.lineCap="square",h.lineJoin="bevel",h.globalAlpha=.65,h.stroke(),h.globalAlpha=1}if(p==="entity:orbitRing"&&E){const et=qp(E,["ghost-a","ghost-b","ghost-c"]),A=Yp(et,a.document.bounds,a.document.start,a.document.exit),S=k(E);h.beginPath(),h.arc(S.x,S.y,3.5*x,0,Math.PI*2),h.setLineDash([5,5]),h.strokeStyle=A?"#ff7474":"#ffc083",h.lineWidth=1.5,h.stroke(),h.setLineDash([]);for(const G of et){const $=k(_s(G));h.beginPath(),h.arc($.x,$.y,Math.max(3,G.radius*x),0,Math.PI*2),h.fillStyle=A?"#ec6666aa":"#ff9a57aa",h.fill()}}for(const et of a.document.entities){const A=et.type==="ember"&&et.motion==="orbit",S=A?_s(et,0):et,G=k(S),$=Math.max(4,(Number.isFinite(et.radius)?Math.max(0,et.radius):.35)*x),at=et.id===a.selected;if(A){const Z=k(et);h.beginPath(),h.arc(Z.x,Z.y,Math.max(0,Number.isFinite(et.orbitRadius)?et.orbitRadius:0)*x,0,Math.PI*2),h.setLineDash([4,5]),h.strokeStyle=at?"#ffbe81":"#d48b5c77",h.lineWidth=at?1.6:1,h.stroke(),h.setLineDash([]),h.beginPath(),h.moveTo(Z.x-5,Z.y),h.lineTo(Z.x+5,Z.y),h.moveTo(Z.x,Z.y-5),h.lineTo(Z.x,Z.y+5),h.strokeStyle=at?"#ffc995":"#aa6c4a",h.stroke();const bt=(et.phase||0)*Math.PI/180,dt=et.orbitDirection==="clockwise"?-1:1,At=k({x:S.x-Math.sin(bt)*dt*.8,y:S.y+Math.cos(bt)*dt*.8});h.beginPath(),h.moveTo(G.x,G.y),h.lineTo(At.x,At.y),h.strokeStyle="#ffb574",h.lineWidth=1.5,h.stroke()}if(et.type==="eclipse")h.beginPath(),h.arc(G.x,G.y,$,0,Math.PI*2),h.strokeStyle=at?"#b9a1e1":"#756b9c",h.lineWidth=at?3:1.5,h.stroke(),h.beginPath(),h.arc(G.x,G.y,$*.83,0,Math.PI*2),h.strokeStyle="#655780",h.lineWidth=1,h.stroke(),h.beginPath(),h.arc(G.x,G.y,$*.72,0,Math.PI*2),h.fillStyle="#020309",h.fill();else if(et.type==="dimmer"){h.beginPath(),h.arc(G.x,G.y,$,0,Math.PI*2),h.strokeStyle=at?"#bd98db":"#8f72a65c",h.lineWidth=at?2:1,h.setLineDash([3,4]),h.stroke(),h.setLineDash([]),h.beginPath();for(let Z=0;Z<=24;Z++){const bt=Z/24*Math.PI*2,dt=1+.07*Math.sin(bt*7),At=.38*x*dt;Z?h.lineTo(G.x+Math.cos(bt)*At,G.y+Math.sin(bt)*At):h.moveTo(G.x+Math.cos(bt)*At,G.y+Math.sin(bt)*At)}h.strokeStyle="#9a71bd",h.stroke(),h.beginPath(),h.arc(G.x,G.y,Math.max(3,.22*x),0,Math.PI*2),h.fillStyle="#5a3a79",h.fill();for(let Z=0;Z<5;Z++){const bt=Z*2.39996,dt=.5*x;h.beginPath(),h.arc(G.x+Math.cos(bt)*dt,G.y+Math.sin(bt)*dt,1.4,0,Math.PI*2),h.fillStyle="#af83cc",h.fill()}}else et.type==="companion"?(h.beginPath(),h.arc(G.x,G.y,et.captureRadius*x,0,Math.PI*2),h.strokeStyle="#b9a5eb77",h.lineWidth=at?2:1,h.setLineDash([3,5]),h.stroke(),h.setLineDash([]),h.beginPath(),h.arc(G.x,G.y,Math.max(3,et.radius*x),0,Math.PI*2),h.fillStyle="#d8cdff",h.fill()):(h.beginPath(),h.arc(G.x,G.y,$,0,Math.PI*2),h.fillStyle=Dc[et.type]+"55",h.fill(),h.strokeStyle=Dc[et.type],h.lineWidth=at?3:1.5,h.stroke());h.fillStyle=Dc[et.type],h.font="11px sans-serif",h.fillText(et.type==="soundGate"?`♪${et.slot+1}`:et.type==="portal"?`⇄${et.pairId}`:ja(et.type),G.x+$+4,G.y+3)}for(const[et,A,S]of[["start","#eafff5","●"],["exit","#aa9aff","◎"]]){const G=a.document[et];if(!G)continue;const $=k(G);h.fillStyle=A,h.font="bold 24px sans-serif",h.fillText(S,$.x-9,$.y+8),a.selected===et&&(h.strokeStyle=A,h.strokeRect($.x-15,$.y-15,30,30))}h.restore(),h.strokeStyle="#719ba5",h.lineWidth=2,h.strokeRect(V,K,tt-V,it-K)}function rt(F){const U=EE(a.document.entities,F,a.selected);if(U)return m&&(m.orbitPart=U.part),U.id;for(const I of["start","exit"])if(a.document[I]&&Math.hypot(a.document[I].x-F.x,a.document[I].y-F.y)<1.2)return I;for(const I of[...a.document.entities].reverse())if(!(I.type==="ember"&&I.motion==="orbit")&&Math.hypot(I.x-F.x,I.y-F.y)<I.radius+.35)return I.id;for(const I of[...a.document.wallPaths||[]].reverse())for(let V=1;V<I.points.length;V++)if(Ew(F,I.points[V-1],I.points[V])<I.thickness/2+.5)return I.id;for(const I of[...a.document.walls].reverse())if(Math.abs(I.x-F.x)<I.width/2+.25&&Math.abs(I.y-F.y)<I.height/2+.25)return I.id;return null}function gt(F,U=!1){const I=j(F),V=a.document.bounds;if(I.x<V.minX+.5||I.x>V.maxX-.5||I.y<V.minY+.5||I.y>V.maxY-.5)return;const tt=Number(c("#editorBrush").value),K={id:a.nextId("wall"),x:I.x,y:I.y,width:tt,height:tt};if(U){a.eraseWall(K);return}a.paintWall(K)}function ht(F=!0){a.selected&&!a.selectedObject&&(a.selected=null);const U=fs(a.document),I=c("#editorValidation");let V="";try{V=` · ${lu(a.document.walls,a.document.wallPaths||[]).length}/300 wall pieces`}catch{}I.textContent=(D?`${D} · `:"")+(U.ok?"Level ready to playtest.":`${U.errors.length} issue${U.errors.length===1?"":"s"}: ${U.errors.slice(0,4).join(" · ")}`)+V,I.classList.toggle("invalid",!U.ok),c('[data-action="play"]').disabled=!U.ok,c('[data-action="export"]').disabled=!U.ok,c('[data-action="undo"]').disabled=!a.undoStack.length,c('[data-action="redo"]').disabled=!a.redoStack.length,F&&Zt(),X(),R()}function ut(F){a.endStroke(),C=F;for(const U of l.querySelectorAll("[data-inspector-tab]"))U.setAttribute("aria-selected",String(U.dataset.inspectorTab===F));Zt(),ht(!1)}function Gt(F,U,I,V=""){const tt=U==null?void 0:U[I],K=document.createElement("label");K.textContent=I==="orbitDirection"?"Direction":I==="phase"&&V==="Starting "?"Starting angle":I==="captureRadius"&&(U==null?void 0:U.type)==="companion"?"Collection radius":I==="burnsCompanions"?"Burns companion moons":`${V}${ja(I)}`;let it;if(typeof tt=="boolean"||I==="burnsCompanions")it=document.createElement("input"),it.type="checkbox",it.checked=tt===!0,I==="burnsCompanions"&&(it.disabled=(U==null?void 0:U.motion)!=="fixed"||!(U!=null&&U.lethal));else if(I==="motion"||I==="orbitDirection"){it=document.createElement("select");for(const et of I==="motion"?["fixed","chaser","orbit"]:["counterclockwise","clockwise"]){const A=document.createElement("option");A.value=et,A.textContent=ja(et),it.append(A)}it.value=tt||"counterclockwise"}else it=document.createElement("input"),it.type=typeof tt=="number"?"number":"text",it.type==="number"&&(it.step="any",it.inputMode="decimal"),it.value=tt===null?"":tt;const _t=()=>{const et=it.type==="checkbox"?it.checked:it.type==="number"?it.value===""?NaN:Number(it.value):I==="maxTotalWells"&&it.value===""?null:it.value,A=G=>I==="title"?G:V==="Settings / "?G.settings:V==="Bounds / "?G.bounds:a.selected==="start"||a.selected==="exit"?G[a.selected]:[...G.walls,...G.wallPaths||[],...G.entities].find($=>$.id===a.selected),S=A(a.document);!S||Object.is(S[I],et)||(a.paint(G=>{const $=A(G);I==="motion"&&et==="orbit"?Object.assign($,wE($)):I==="orbitRadius"&&$.type==="ember"&&$.motion==="orbit"?Object.assign($,bE($,et)):$[I]=et,$.type==="ember"&&(I==="motion"||I==="lethal")&&qE($)}),D="",I==="motion"||I==="lethal"?(a.endStroke(),ht()):ht(!1))};it.addEventListener("input",_t),it.addEventListener("change",_t),it.addEventListener("blur",()=>{a.endStroke(),ht(!1)}),K.append(it),F.append(K)}function oe(F){const U=document.createElement("label");U.textContent="Seconds per revolution";const I=document.createElement("input");I.type="number",I.step="any",I.inputMode="decimal";const V=Xp(F);I.value=Number.isFinite(V)?String(Number(V.toFixed(3))):"",I.placeholder="Stopped";const tt=()=>{const K=I.value===""?NaN:Number(I.value),it=ea(a.selectedObject.orbitRadius,K);Object.is(a.selectedObject.speed,it)||(a.paint(_t=>{_t.entities.find(et=>et.id===a.selected).speed=it}),ht(!1))};if(I.addEventListener("input",tt),I.addEventListener("change",tt),I.addEventListener("blur",()=>{tt(),a.endStroke(),ht(!1)}),U.append(I),f.append(U),!Number.isFinite(V)){const K=document.createElement("p");K.className="editor-tab-help",K.textContent="Stopped orbit (speed 0). Enter a positive period to start moving.",f.append(K)}}function Zt(){f.replaceChildren();const F=V=>{const tt=document.createElement("h3");tt.textContent=V,f.append(tt)};if(C==="level"){const V=document.createElement("p");V.className="editor-tab-help",V.textContent="Set the room and its rules here. Select an element on the canvas to edit its properties.",f.append(V),F("Level"),Gt(f,a.document,"title"),F("Bounds");for(const K of["minX","maxX","minY","maxY"])Gt(f,a.document.bounds,K,"Bounds / ");F("World rules");for(const K of Object.keys(a.document.settings))Gt(f,a.document.settings,K,"Settings / ");const tt=document.createElement("div");tt.className="editor-level-actions";for(const[K,it]of[["clearAll","Clear all elements"],["startNew","Start new level"]]){const _t=document.createElement("button");_t.type="button",_t.dataset.action=K,_t.textContent=it,tt.append(_t)}f.append(tt);return}F(a.selected?`Selected: ${a.selected}`:"Select an element");const U=a.selectedObject;if(!U){const V=document.createElement("p");V.className="editor-tab-help",V.textContent="Tap a wall, the start, the exit, or any element to edit it. Place a new element from the toolbar.",f.append(V);return}const I=a.selected==="start"||a.selected==="exit"?a.selected:a.document.walls.includes(U)?"wall":(a.document.wallPaths||[]).includes(U)?"wallPath":U.type;if(I==="ember"){for(const tt of Cf.ember)Gt(f,U,tt,(tt==="x"||tt==="y")&&U.motion==="orbit"?"Center ":tt==="radius"?"Body ":"");const V=document.createElement("p");V.className="editor-tab-help",V.textContent="Only a fixed, lethal ember can burn companion moons.",f.append(V),U.motion==="orbit"?(Gt(f,U,"orbitRadius"),oe(U),Gt(f,U,"orbitDirection",""),Gt(f,U,"phase","Starting ")):U.motion==="chaser"&&Gt(f,U,"speed","Movement ")}else for(const V of Cf[I]||[])Gt(f,U,V);if(I==="companion"){const V=document.createElement("p");V.className="editor-tab-help",V.textContent="The moon joins when you enter its collection ring. It can gather light, save you from an ember, or buy 4 seconds in the last embers.",f.append(V)}if(I==="wallPath"&&U.points.forEach((V,tt)=>{const K=document.createElement("div");K.className="editor-path-point";const it=document.createElement("span");it.textContent=`Point ${tt+1}`,K.append(it);for(const et of["x","y"]){const A=document.createElement("label");A.textContent=et.toUpperCase();const S=document.createElement("input");S.type="number",S.step="any",S.value=V[et],S.addEventListener("input",()=>{var at,Z,bt;const G=S.value===""?NaN:Number(S.value),$=(bt=(Z=(at=a.selectedObject)==null?void 0:at.points)==null?void 0:Z[tt])==null?void 0:bt[et];Object.is($,G)||(a.paint(dt=>{dt.wallPaths.find(At=>At.id===a.selected).points[tt][et]=G}),ht(!1))}),S.addEventListener("blur",()=>{a.endStroke(),ht(!1)}),A.append(S),K.append(A)}const _t=document.createElement("button");_t.type="button",_t.textContent="−",_t.title=`Remove point ${tt+1}`,_t.setAttribute("aria-label",`Remove point ${tt+1}`),_t.disabled=U.points.length<=2,_t.addEventListener("click",()=>{a.endStroke(),a.transact(et=>et.wallPaths.find(A=>A.id===a.selected).points.splice(tt,1)),ht()}),K.append(_t),f.append(K)}),I!=="start"&&I!=="exit"){const V=document.createElement("button");V.textContent="Delete selected",V.type="button",V.addEventListener("click",()=>{a.endStroke(),a.transact(tt=>{tt.walls=tt.walls.filter(K=>K.id!==a.selected),tt.wallPaths=(tt.wallPaths||[]).filter(K=>K.id!==a.selected),tt.entities=tt.entities.filter(K=>K.id!==a.selected)}),a.selected=null,ht()}),f.append(V)}}function st(){for(const F of l.querySelectorAll(".editor-line-action"))F.classList.toggle("hidden",!(w!=null&&w.length))}function ot(){w=null,P=null,st(),X()}function Ct(){if(!w||w.length<2){ot();return}const F=w,U=a.nextId("path"),I=Number(c("#editorBrush").value);a.endStroke(),a.transact(V=>{V.wallPaths||(V.wallPaths=[]),V.wallPaths.push({id:U,thickness:I,points:F})}),a.selected=U,ot(),ut("selected")}l.addEventListener("click",F=>{const U=F.target.closest("button[data-action],button[data-tool],button[data-inspector-tab]");if(!U)return;if(U.dataset.inspectorTab){ut(U.dataset.inspectorTab);return}const I=U.dataset.action;if(U.dataset.tool){p==="line"&&U.dataset.tool!=="line"&&ot(),p=U.dataset.tool,E=null,D="",c("#editorEntityTool").value="";for(const V of l.querySelectorAll("[data-tool]"))V.setAttribute("aria-pressed",String(V===U));X();return}if(I==="home"&&(me(),e()),I==="save"&&R(),I==="import"&&d.click(),I==="export"){const V=fs(a.document);if(!V.ok)return;const tt=new Blob([JSON.stringify(V.document,null,2)+`
`],{type:"application/json"}),K=URL.createObjectURL(tt),it=document.createElement("a");it.href=K,it.download=`${V.document.id}.json`,document.body.append(it),it.click(),it.remove(),setTimeout(()=>URL.revokeObjectURL(K),1e4)}if(I==="play"){const V=fs(a.document);V.ok&&(me(),n(Ic(V.document)))}I==="undo"&&(a.undo(),ht()),I==="redo"&&(a.redo(),ht()),I==="clearAll"&&(ot(),a.clearAll(),ut("level"),ht()),I==="startNew"&&(ot(),a.startNew(),ut("level"),N(),ht()),I==="finishLine"&&Ct(),I==="cancelLine"&&ot(),I==="fit"&&N(),I==="zoomin"&&(x=Math.min(100,x*1.25),X()),I==="zoomout"&&(x=Math.max(2,x/1.25),X()),I==="drawer"&&l.classList.add("inspector-open"),I==="closeDrawer"&&l.classList.remove("inspector-open")}),c("#editorEntityTool").addEventListener("change",F=>{ot(),p=F.target.value?`entity:${F.target.value}`:"select",E=null,D="";for(const U of l.querySelectorAll("[data-tool]"))U.setAttribute("aria-pressed","false");X()}),d.addEventListener("change",async()=>{var I;const F=(I=d.files)==null?void 0:I[0];if(d.value="",!F)return;const U=AE(await F.text());if(!U.ok){c("#editorValidation").textContent=`Import rejected: ${U.errors.join(" · ")}`,c("#editorValidation").classList.add("invalid");return}ot(),a.replace(U.document),ut("level"),N(),ht()}),u.addEventListener("pointerdown",F=>{if(F.button!==0)return;u.setPointerCapture(F.pointerId);const U=B(F);if(m={id:F.pointerId,last:{x:F.clientX,y:F.clientY},world:U,lastWorld:U,moved:!1,vertex:null},p==="wall"||p==="erase")gt(U,p==="erase");else if(p==="select"){a.selected=rt(U);const I=(a.document.wallPaths||[]).find(V=>V.id===a.selected);I&&(m.vertex=I.points.findIndex(V=>Math.hypot(V.x-U.x,V.y-U.y)<Math.max(.55,8/x)))}X()}),u.addEventListener("pointermove",F=>{if(!m||m.id!==F.pointerId)return;const U=B(F),I=F.clientX-m.last.x,V=F.clientY-m.last.y;if(Math.abs(I)+Math.abs(V)>1&&(m.moved=!0),p==="pan")g.x+=I,g.y+=V;else if(p==="wall"||p==="erase"){const tt=Math.hypot(U.x-m.lastWorld.x,U.y-m.lastWorld.y),K=Math.ceil(tt/.45);for(let it=1;it<=K;it++)gt({x:m.lastWorld.x+(U.x-m.lastWorld.x)*it/K,y:m.lastWorld.y+(U.y-m.lastWorld.y)*it/K},p==="erase")}else if(p==="line")P=j(U);else if(p==="select"&&a.selected&&m.moved){const tt=a.selected,K=j(U);if((a.document.wallPaths||[]).find(_t=>_t.id===tt))if(m.vertex>=0)a.paint(_t=>{_t.wallPaths.find(et=>et.id===tt).points[m.vertex]=K});else{const _t=j(m.lastWorld),et={x:K.x-_t.x,y:K.y-_t.y};(et.x||et.y)&&a.paint(A=>{for(const S of A.wallPaths.find(G=>G.id===tt).points)S.x+=et.x,S.y+=et.y})}else if(m.orbitPart==="body"){const _t=j(m.lastWorld),et={x:K.x-_t.x,y:K.y-_t.y};(et.x||et.y)&&a.paint(A=>{const S=A.entities.find(G=>G.id===tt);S.x+=et.x,S.y+=et.y})}else a.paint(_t=>{const et=tt==="start"||tt==="exit"?_t[tt]:[..._t.walls,..._t.entities].find(A=>A.id===tt);et&&(et.x=K.x,et.y=K.y)})}m.last={x:F.clientX,y:F.clientY},m.lastWorld=U,X()});const Ot=F=>{if(!m||m.id!==F.pointerId)return;const U=B(F);if(!m.moved){if(p==="line"){const I=j(U),V=a.document.bounds;I.x>=V.minX&&I.x<=V.maxX&&I.y>=V.minY&&I.y<=V.maxY&&(!(w!=null&&w.length)||Math.hypot(I.x-w.at(-1).x,I.y-w.at(-1).y)>1e-5)&&(w||(w=[]),w.push(I),st())}else if(p==="start"||p==="exit"){const I=j(U);a.transact(V=>Object.assign(V[p],I)),a.selected=p}else if(p==="entity:orbitRing"){const I=a.addOrbitRing(j(U));D=I.ok?"":I.error}else if(p.startsWith("entity:")){const I=YE(p.slice(7),z(U.x),z(U.y),a);a.transact(V=>V.entities.push(I)),a.selected=I.id,D=""}}a.endStroke(),m=null,a.selected&&(p==="select"||p==="start"||p==="exit"||p.startsWith("entity:"))?ut("selected"):ht()};u.addEventListener("pointerup",Ot),u.addEventListener("pointercancel",Ot),u.addEventListener("pointermove",F=>{p==="line"&&!m&&(w!=null&&w.length)?(P=j(B(F)),X()):p==="entity:orbitRing"&&!m&&(E=j(B(F)),X())}),u.addEventListener("dblclick",()=>{p==="line"&&Ct()}),u.addEventListener("wheel",F=>{F.preventDefault();const U=u.getBoundingClientRect(),I=B({clientX:F.clientX,clientY:F.clientY});x=Math.max(2,Math.min(100,x*(F.deltaY<0?1.1:.9))),g.x=F.clientX-U.left-I.x*x,g.y=F.clientY-U.top+I.y*x,X()},{passive:!1}),l.addEventListener("keydown",F=>{if(!(F.target instanceof HTMLInputElement||F.target instanceof HTMLSelectElement)){if(p==="line"&&F.key==="Enter"){F.preventDefault(),Ct();return}if(p==="line"&&F.key==="Escape"){F.preventDefault(),ot();return}(F.ctrlKey||F.metaKey)&&F.key.toLowerCase()==="z"?(F.preventDefault(),F.shiftKey?a.redo():a.undo(),ht()):(F.key==="Delete"||F.key==="Backspace")&&a.selected&&!["start","exit"].includes(a.selected)&&(F.preventDefault(),a.transact(U=>{U.walls=U.walls.filter(I=>I.id!==a.selected),U.wallPaths=(U.wallPaths||[]).filter(I=>I.id!==a.selected),U.entities=U.entities.filter(I=>I.id!==a.selected)}),a.selected=null,ht())}}),new ResizeObserver(L).observe(u);function te(){M=!0,l.classList.remove("hidden"),ht(),requestAnimationFrame(_?L:N)}function me(){ot(),M=!1,l.classList.add("hidden"),l.classList.remove("inspector-open")}function O(F){const U=fs(F);return U.ok?(ot(),a.endStroke(),a.transact(I=>{for(const V of Object.keys(I))delete I[V];Object.assign(I,Ic(U.document))}),a.selected=null,ut("level"),_=!1,M&&N(),!0):!1}return{show:te,hide:me,loadDocument:O,get open(){return M},get document(){return Ic(a.document)},model:a}}const Rl=2,jE=1e6,ZE=Object.freeze({minX:-48,maxX:48,minY:-27,maxY:27}),KE=64;function na(i){return Array.from(String(i??"").normalize("NFC").trim().replace(/[\x00-\x1f\x7f]/g,"")).slice(0,KE).join("")}function Pl(i){const t=Number(i);return Number.isSafeInteger(t)&&t>=1&&t<=jE?t:1}function tm(){var t,e;const i=new Uint32Array(2);return(e=(t=globalThis.crypto)==null?void 0:t.getRandomValues)==null||e.call(t,i),`${i[0].toString(36)}-${i[1].toString(36)}`}function Dh(i){let t=2166136261;for(const e of String(i)){const n=e.codePointAt(0);t=Math.imul(t^n,16777619)>>>0}return t>>>0}function JE(i,t){return Dh(`orbit-lab/infinite/${Rl}/${na(i)}/${Pl(t)}/recharge`)}function QE(i){let t=i>>>0;return()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,1|t);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const wr=(i,t)=>Math.hypot(i.x-t.x,i.y-t.y),Nh=(i,t,e)=>Math.max(t,Math.min(e,i)),_u=(i,t,e,n)=>t*Math.sin((i+40)/78*Math.PI*1.55+e)-t*Math.sin(e)+n*(i+38)/76,Er=(i,t,e,n)=>({x:i,y:_u(i,t,e,n)}),t1=(i,t,e,n,s)=>Math.abs(i.y-_u(Nh(i.x,-42,42),t,e,n))<s,vl=(i,t)=>Math.hypot(Math.max(0,Math.abs(i.x-t.x)-t.width/2),Math.max(0,Math.abs(i.y-t.y)-t.height/2)),Cr=i=>i.radius+(i.motion==="orbit"?i.orbitRadius:0),em=i=>i.type==="companion"?i.captureRadius:i.radius??.31,e1=(i,t,e)=>Array.from({length:169},(n,s)=>Er(s/2-42,i,t,e));function Rf(i,t,e){const n=t.bounds,s=[t.start,t.exit,...t.entities.filter(r=>r.type!=="ember")];for(const r of i){const o=Cr(r);if(r.x-o<n.minX+1||r.x+o>n.maxX-1||r.y-o<n.minY+1||r.y+o>n.maxY-1||e.some(a=>wr(a,r)<o+3.5)||s.some(a=>wr(a,r)<o+em(a)+.8)||t.walls.some(a=>vl(r,a)<o+1.2)||t.entities.some(a=>a.type==="ember"&&wr(a,r)<o+Cr(a)+1.5))return!1}for(let r=0;r<i.length;r++)for(let o=r+1;o<i.length;o++){const a=i[r],l=i[o];if(wr(a,l)<.001)if(a.motion==="orbit"&&l.motion==="orbit"){if(a.orbitRadius!==l.orbitRadius||a.speed!==l.speed||a.orbitDirection!==l.orbitDirection||Math.abs(a.phase-l.phase)!==180||2*a.orbitRadius<a.radius+l.radius+.8)return!1}else{const c=a.motion==="orbit"?a:l,u=c===a?l:a;if(c.motion!=="orbit"||c.orbitRadius<u.radius+c.radius+.8)return!1}else if(wr(a,l)<Cr(a)+Cr(l)+1.5)return!1}return!0}function n1(i){const{bounds:t,start:e,exit:n,walls:s,entities:r}=i,o=1.5,a=Math.floor((t.maxX-t.minX)/o)+1,l=Math.floor((t.maxY-t.minY)/o)+1,c=(g,m)=>m*a+g,u=g=>({x:Nh(Math.round((g.x-t.minX)/o),0,a-1),y:Nh(Math.round((g.y-t.minY)/o),0,l-1)}),h=new Uint8Array(a*l);for(let g=0;g<l;g++)for(let m=0;m<a;m++){const y={x:t.minX+m*o,y:t.minY+g*o};(s.some(M=>vl(y,M)<.8)||r.some(M=>M.type==="ember"&&M.lethal&&wr(y,M)<Cr(M)+1))&&(h[c(m,g)]=1)}const d=u(e),f=u(n),p=[d],x=new Uint8Array(a*l);if(h[c(d.x,d.y)]||h[c(f.x,f.y)])return!1;x[c(d.x,d.y)]=1;for(let g=0;g<p.length;g++){const m=p[g];if(Math.abs(m.x-f.x)<=1&&Math.abs(m.y-f.y)<=1)return!0;for(const[y,M]of[[1,0],[-1,0],[0,1],[0,-1]]){const _=m.x+y,C=m.y+M;_<0||C<0||_>=a||C>=l||x[c(_,C)]||h[c(_,C)]||(x[c(_,C)]=1,p.push({x:_,y:C}))}}return!1}function Pf(i,t,e,n=!1){const s=QE(Dh(`orbit-lab/infinite/${Rl}/${i}/${t}/${e}`)),r=Math.min(1,(t-1)/9),o=n?0:1.2+s()*(2+1.8*r),a=s()*1.6-.8,l=n?0:(s()-.5)*4,c=Er(-38,o,a,l),u=Er(38,o,a,l),h={startLight:.65,burnRate:.016+r*.006,graceSeconds:8,wellStrength:66,wellLifetime:8,maxActiveWells:2,maxTotalWells:null,randomRecharge:!1},d={version:1,id:`infinite-${Dh(i).toString(36)}-${t}`,title:`Infinite crossing ${t}`,bounds:{...ZE},settings:h,start:{...c,direction:0,speed:2.4},exit:{...u,radius:1.4,gravity:3},walls:[],entities:[]},f=v=>d.entities.push(v);for(const[v,R]of[-22,0,22].map((N,L)=>[L,N])){const N=Er(R,o,a,l);f({id:`gate-${v}`,type:"soundGate",x:N.x,y:N.y+(v===1?1.1:-.8),radius:1.2,slot:v})}for(const[v,R]of[-26,-2,25].map((N,L)=>[L,N])){const N=Er(R,o,a,l);f({id:`recharge-${v}`,type:"lightPickup",x:N.x,y:N.y+(v%2?-2.2:2.2),radius:.7,amount:.32,reusable:!1,cooldown:0})}for(const[v,R]of[-31,7].entries()){const N=Er(R,o,a,l);f({id:`companion-${v}`,type:"companion",x:R,y:N.y+(v?-1.4:1.4),radius:.16,captureRadius:2.8})}const p=e1(o,a,l),x=n?1:Math.floor(s()*3),g=s()<.5?-1:1,m=3+s()*.4+r*1.1,y=42+s()*13+r*15,M=.32+s()*.08+r*.05,_=12+s()*2-r*4,C=s()<.5?"clockwise":"counterclockwise",w=Math.floor(s()*180),P=(v,R,N)=>({id:v,type:"ember",x:R,y:N,radius:m,gravity:y,lethal:!0,burnsCompanions:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0}),D=(v,R,N)=>[0,1].map(L=>({id:`orbital-${L}`,type:"ember",x:v,y:R,radius:M,gravity:0,lethal:!0,burnsCompanions:!1,motion:"orbit",orbitRadius:N,speed:ea(N,_),orbitDirection:C,phase:w+L*180}));let E=!1;for(let v=0;v<12&&!E;v++){const R=v%2?-g:g,N=9+Math.floor(v/2)*.65,L=(B,z,j)=>_u(B,o,a,l)+z*Math.max(N,j+5);let k;if(x===0){const B=3+r*.5;k=[P("heavy-0",-12,L(-12,R,m)),...D(18,L(18,-R,B+M),B)]}else{const B=m+M+.9,z=x===1?12:18,j=L(z,x===1?R:-R,B+M);k=[P("heavy-0",z,j),...D(z,j,B)],x===2&&k.unshift(P("heavy-1",-14,L(-14,R,m)))}Rf(k,d,p)&&(k.forEach(f),E=!0)}if(!E)return null;if(!n){const v=(x===2?2:3)+Math.floor(r*3),R=1+Math.floor(r*3),N=[c,u,...d.entities.filter(L=>L.type!=="ember")];for(let L=0,k=0;L<v&&k<100;k++){const B={id:`wall-${L}`,x:-33+s()*67,y:-20+s()*40,width:1.3+s()*2.7,height:1+s()*2.4};t1(B,o,a,l,6+B.height/2)||N.some(z=>vl(z,B)<em(z)+1.2)||d.entities.some(z=>z.type==="ember"&&vl(z,B)<Cr(z)+1.2)||d.walls.some(z=>Math.hypot(z.x-B.x,z.y-B.y)<4)||(d.walls.push(B),L++)}for(let L=0,k=0;L<R&&k<100;k++){const B={id:`ember-${L}`,type:"ember",x:-31+s()*66,y:-20+s()*40,radius:.7+s()*(.8+r*.5),gravity:8+s()*7,lethal:!0,motion:"fixed",speed:0,orbitRadius:0,phase:0};Rf([B],d,p)&&(f(B),L++)}}return d}function i1(i,t=1){const e=na(i),n=Pl(t);if(!e)throw new Error("A seed is required");for(let r=0;r<8;r++){const o=Pf(e,n,r);if(!o)continue;const a=fs(o);if(a.ok&&n1(a.document))return a.document}const s=Pf(e,n,0,!0);return Al(s).document}const s1=2.15,Lf=(i,t,e)=>{const n=Math.hypot(i,t),s=n>e?e/n:1;return{x:i*s,y:t*s}};function r1(){return{owned:!0,phase:"following",borrowHold:0,returnToneAt:0}}function o1(i,{hero:t,moon:e,heroAcceleration:n,heroWellAcceleration:s,moonWellAcceleration:r,wells:o=[],time:a=0,dt:l}){const c=e.x-t.x,u=e.y-t.y,h=Math.max(.001,Math.hypot(c,u)),d=c/h,f=u/h,p={x:-f,y:d},x={x:e.vx-t.vx,y:e.vy-t.vy},g=x.x*d+x.y*f,m=x.x*p.x+x.y*p.y,y={x:r.x-s.x,y:r.y-s.y},C=o.some(ht=>Vr(ht,a)>0&&Math.hypot(e.x-ht.x,e.y-ht.y)<3.2)&&Math.hypot(y.x,y.y)>1.2?.55:Math.max(0,i.borrowHold-l),w=C>0,P=!w&&(i.phase==="returning"?h>2.6:h>3||i.phase==="borrowed"),D=w?"borrowed":P?"returning":"following",E=w?3.1:s1,v=w?1.1:P?3.4:2.2,R=w?.8:P?2.3:1.5,N=w?.18:P?.55:1.15,L=w?.7:1.35,k=-v*(h-E)-R*g,B=(L-m)*N,z=Lf(d*k+p.x*B,f*k+p.y*B,P?9:w?3.5:5.5),j=w?1:P?.2:.35,X={x:n.x+y.x*j+z.x,y:n.y+y.y*j+z.y},rt=Lf(X.x,X.y,24),gt=i.phase==="returning"&&D==="following";return{state:{...i,owned:!0,phase:D,borrowHold:C},acceleration:rt,returned:gt,distance:h,speedCap:Math.max(18,Math.hypot(t.vx,t.vy)+8)}}const Nc=1,a1=2;function l1(){return{heat:0,smoldering:!1,burned:!1}}function c1(i,t,e,n){const s=t.x-i.x,r=t.y-i.y,o=i.x-e.x,a=i.y-e.y,l=s*s+r*r;if(l<1e-12)return o*o+a*a<=n*n?[0,1]:null;const c=2*(o*s+a*r),u=o*o+a*a-n*n,h=c*c-4*l*u;if(h<=0)return u<0?[0,1]:null;const d=Math.sqrt(h),f=Math.max(0,(-c-d)/(2*l)),p=Math.min(1,(-c+d)/(2*l));return p>f?[f,p]:null}function h1(i,t,e,n,s){var l;const r=[];for(const c of n||[]){if(c.type!=="ember"||c.motion!=="fixed"||!c.lethal||!c.burnsCompanions)continue;const u=((l=s==null?void 0:s.items)==null?void 0:l[c.id])||c,h=c1(i,t,u,e+c.radius);h&&r.push(h)}r.sort((c,u)=>c[0]-u[0]);let o=0,a=0;for(const[c,u]of r)o+=Math.max(0,u-Math.max(c,a)),a=Math.max(a,u);return Math.min(1,o)}function u1(i,t,e){if(i.burned)return{state:i,ignited:!1,burned:!1};const n=Math.max(0,Math.min(1,t)),s=Math.max(0,Math.min(Nc,i.heat+n*e-(1-n)*e*Nc/a1)),r=s>=Nc,o=s>0&&!r;return{state:{heat:s,smoldering:o,burned:i.burned||r},ignited:!i.smoldering&&n>0&&!r,burned:r}}const If=6,d1=1.25;function Uh(i){return i.find(t=>{var e,n;return((e=t.companionState)==null?void 0:e.owned)&&!((n=t.heat)!=null&&n.burned)})||null}function nm(i,t,e=[],n=null){if(!i)return!1;const s=Jt+.2;return i.x<t.bounds.minX+s||i.x>t.bounds.maxX-s||i.y<t.bounds.minY+s||i.y>t.bounds.maxY-s||t.walls.some(r=>ti(i,Jt+.12,r))||(t.guides||[]).some(r=>Fp(i,r,Jt+.12))||t.channel&&Math.abs(au(i,t.channel).distance)>t.channel.halfWidth-Jt-.12?!1:!e.some(r=>{var a;if(r.type!=="ember"||!r.lethal)return!1;const o=((a=n==null?void 0:n.items)==null?void 0:a[r.id])||r;return Math.hypot(i.x-o.x,i.y-o.y)<=r.radius+Jt+.3})}function f1({before:i,lastSafe:t,ember:e,level:n,entities:s=[],runtime:r=null}){const o=c=>nm(c,n,s,r);if(o(t))return{x:t.x,y:t.y};if(o(i))return{x:i.x,y:i.y};const a=Math.atan2(((i==null?void 0:i.y)??0)-e.y,((i==null?void 0:i.x)??0)-e.x),l=e.radius+Jt+.6;for(let c=0;c<16;c++){const u=c===0?0:Math.ceil(c/2)*Math.PI/8*(c%2?1:-1),h={x:e.x+Math.cos(a+u)*l,y:e.y+Math.sin(a+u)*l};if(o(h))return h}return null}function p1(i,t){const e=i.x-t.x,n=i.y-t.y,s=Math.hypot(e,n)||1,r=e/s,o=n/s;return{x:r*If-o*.75,y:o*If+r*.75}}const Ji=new URLSearchParams(location.search);let jn=["1","2"].includes(Ji.get("campaign"))&&!Ji.has("demo"),$s=jn?Number(Ji.get("campaign")):1,sn=!Ji.has("demo")&&!jn&&!!na(Ji.get("infinite")),$i=sn?na(Ji.get("infinite")):"",ji=sn?Pl(Ji.get("stage")):1;function im(i,t){const e=Al(i1(i,t));return{id:"infinite",title:`Infinite Play · Stage ${t}`,color:"#a2efe7",objective:`Seed ${i} · Stage ${t} · Follow the gates and carry your light to the portal.`,mechanic:"campaign",heroGravity:0,moons:[],level:e.level,document:e.document,entities:e.entities,settings:e.settings,soundGates:e.entities.filter(n=>n.type==="soundGate").map(n=>({id:n.slot,x:n.x,y:n.y,radius:n.radius}))}}let mt=sn?im($i,ji):jn?xu($s):Hp(Ji.get("demo")),jt=structuredClone(mt.level),oi=mt.heroGravity,yl=!1;const ne=new kw;let Mu=0;const sm=document.querySelector("#app");sm.innerHTML=`
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
  <div class="demo-note" id="demoNote"><strong id="demoTitle"></strong><span id="demoObjective"></span><div id="companionHud" class="companion-hud hidden" aria-live="polite"></div><div id="resourceHud" class="resource-hud hidden"><div class="resource-top"><span>LIGHT</span><span id="resourceValue">60%</span><span id="gateStatus">GATE OPEN</span></div><div class="resource-track"><i id="resourceFill"></i><b></b><b></b></div></div><div id="campaignGateHud" class="campaign-gate-hud hidden" aria-live="polite"><span id="campaignGateCount">0/3 gates</span><span id="campaignGateIcons"></span></div></div>
  <dialog id="gallery" class="gallery"><div class="gallery-heading"><div><span class="eyebrow">ORBIT LAB / MECHANICS GALLERY</span><h1>World studies.</h1><p>One new rule at a time. Experiments in gravity, light, and sound.</p></div><div class="gallery-actions"><button id="homeFromGallery" class="quiet-button" aria-label="Home" title="Home">⌂</button><button id="closeGallery" class="quiet-button" aria-label="Close gallery"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div><nav id="demoCategories" class="demo-categories" aria-label="Study categories"></nav><div class="demo-grid" id="demoGrid"></div><p class="gallery-footer">Every study starts paused. Place a well, then Start. Wells now begin at strength 70; settings let you compare.</p></dialog>
  <div id="home" class="home-overlay hidden"><div class="home-card"><span class="eyebrow">ORBIT LAB</span><h1>A little light in a large world.</h1><p>Draw a path with temporary gravity. Keep your light alive until you reach the portal.</p><button id="startCampaign" class="primary-button" type="button">Campaign ↗</button><button id="startInfinite" class="home-secondary" type="button">Infinite Play</button><button id="studyHome" class="home-secondary" type="button">Studies</button><button id="openEditor" class="home-secondary" type="button">Level editor</button></div></div>
  <div id="infiniteSelect" class="home-overlay hidden"><div class="home-card infinite-select-card"><span class="eyebrow">INFINITE PLAY</span><h1>Every seed makes a world.</h1><p>Cross a new chamber each stage. Generation ${Rl} adds companion moons, heavy neighbors, and orbiting embers. A seed and stage repeat within this generation.</p><label for="infiniteSeed">World seed</label><input id="infiniteSeed" type="text" maxlength="128" autocomplete="off" spellcheck="false"><div class="infinite-select-actions"><button id="beginInfinite" class="primary-button" type="button">Start crossing ↗</button><button id="infiniteBack" class="home-secondary" type="button">Back home</button></div></div></div>
  <div id="levelSelect" class="home-overlay hidden"><div class="home-card level-select-card"><span class="eyebrow">CAMPAIGN / LEVELS</span><h1>Choose a crossing.</h1><div class="level-cards"><button class="level-card" data-campaign-level="1" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C40 39 65 32 103 32 S130 30 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/><circle cx="65" cy="33" r="6" fill="none" stroke="#7de6df"/></svg><span>01 / LIGHT & DISTANCE</span><strong>The long crossing</strong><small>A clear chamber. Keep the fire alive to reach the far portal.</small><em data-complete="1"></em><span data-gate-best="1"></span></button><button class="level-card" data-campaign-level="2" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C39 39 50 58 80 58 S117 32 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="85" cy="28" r="16" fill="#ff8a32"/><circle cx="85" cy="28" r="24" fill="none" stroke="#ff8a32" opacity=".4"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/></svg><span>02 / GRAVITY & DANGER</span><strong>The heavy neighbor</strong><small>Gather two pale moons before facing the giant ember.</small><em data-complete="2"></em><span data-gate-best="2"></span></button></div><button id="levelsBack" class="home-secondary" type="button">Back home</button></div></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><div class="result-actions"><button id="driftRestart" class="primary-button" type="button">Retry</button><button id="driftHome" class="home-secondary" type="button">Home</button></div></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card trail-result"><span class="eyebrow" id="resultEyebrow">COURSE COMPLETE</span><h2 id="resultTitle">Your orbit.</h2><canvas id="winArtwork" width="1280" height="720" role="img" aria-label="The complete glowing trail drawn during your run"></canvas><p id="winStats"></p><p id="winGateStats" class="gate-result hidden"></p><p id="infiniteResult" class="infinite-result hidden"></p><div class="result-actions"><button id="winRestart" class="primary-button">Fly again ↗</button><button id="winEditor" class="home-secondary hidden" type="button">Back to editor</button><button id="editInfinite" class="home-secondary hidden" type="button">Edit this level</button><button id="copyInfinite" class="home-secondary hidden" type="button">Copy link</button><button id="winHome" class="home-secondary" type="button">Home</button></div></div></div>
`;const nt=i=>document.querySelector(i),Xr=nt("#scene"),Su=nt("#wellList"),an=nt("#strength"),vn=nt("#lifetime"),yn=nt("#settings"),Ms=nt("#sceneCaption"),No=nt("#showForecast"),vo=nt("#pause"),Ll=nt("#driftOverlay"),Il=nt("#winOverlay"),bi=new Ce,Fe=new VM({antialias:!0,alpha:!0,powerPreference:"high-performance"});Fe.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Fe.setSize(Xr.clientWidth,Xr.clientHeight);Fe.outputColorSpace=bn;Fe.toneMapping=zf;Fe.toneMappingExposure=1.6;Fe.shadowMap.enabled=!0;Fe.shadowMap.type=Of;Xr.appendChild(Fe.domElement);const nl=nt("#minimap"),m1=nl.getContext("2d"),Ge=new d0,Ke=new zw(Ge,ne),rm=new Uw(Ge),ie=new yp(-12,12,8,-8,.1,100);ie.position.set(0,0,30);ie.lookAt(0,0,0);const g1=6744562,x1=10195199,v1=15268607;new dn({color:2505557,transparent:!0,opacity:.1});function om(i,t,e=!1){const n=e?[...i,i[0]]:i,s=new _e().setFromPoints(n.map(r=>new H(r.x,r.y,r.z||0)));return new jr(s,t)}function qn(i,t,e=96){const n=Array.from({length:e},(s,r)=>({x:Math.cos(r/e*Math.PI*2)*i,y:Math.sin(r/e*Math.PI*2)*i,z:0}));return om(n,t,!0)}const y1=new Ce;Ge.add(y1);Ge.add(bi);const am=new Ce;Ge.add(am);let Uc=387;const Za=()=>(Uc=Uc*16807%2147483647,Uc/2147483647),_1=new Zi(.022,6);for(let i=0;i<210;i++){const t=new pe(_1,new ke({color:i%7===0?7899322:5077138,transparent:!0,opacity:.2+Za()*.4}));t.position.set((Za()-.5)*95,(Za()-.5)*75,-3),t.scale.setScalar(.6+Za()*1.4),am.add(t)}Ge.add(new rx(11193053,1.2));const Uo=new pe(new ys(200,200),new tx({color:2900816,roughness:1,metalness:0}));Uo.position.z=-.9;Uo.receiveShadow=!0;Ge.add(Uo);const Ci=new wl(6744562,85,50,1.5);Ci.castShadow=!0;Ci.shadow.mapSize.set(window.innerWidth<=700?512:1024,window.innerWidth<=700?512:1024);Ci.shadow.camera.near=.1;Ci.shadow.camera.far=50;Ci.shadow.bias=-3e-4;Ci.shadow.normalBias=.015;Ge.add(Ci);const ia=new Ce,il=new pe(new Js(.25,32,24),new ke({color:14680056}));ia.add(il);function M1(){const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(189,255,247,.95)"),e.addColorStop(.13,"rgba(109,250,231,.72)"),e.addColorStop(.35,"rgba(58,215,225,.24)"),e.addColorStop(1,"rgba(58,215,225,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new bl(i)}const bu=M1(),Fo=document.createElement("canvas");Fo.width=Fo.height=128;const wu=Fo.getContext("2d"),sa=wu.createRadialGradient(64,64,0,64,64,64);sa.addColorStop(0,"rgba(225,255,249,1)");sa.addColorStop(.16,"rgba(102,233,242,.95)");sa.addColorStop(.38,"rgba(64,204,217,.4)");sa.addColorStop(1,"rgba(64,204,217,0)");wu.fillStyle=sa;wu.fillRect(0,0,128,128);const hs=new Si(new ri({map:new bl(Fo),transparent:!0,depthWrite:!1,blending:rn}));hs.scale.set(2.4,2.4,1);hs.position.z=.1;ia.add(hs);ia.position.z=2;Ge.add(ia);const Oo=128,Fh=Array.from({length:Oo},()=>({x:0,y:0,vx:0,vy:0,life:0,duration:1})),lm=new Float32Array(Oo*3),Eu=new Float32Array(Oo),qr=new _e;qr.setAttribute("position",new Pe(lm,3).setUsage(Ei));qr.setAttribute("heat",new Pe(Eu,1).setUsage(Ei));const Dl=new Yn({transparent:!0,depthWrite:!1,blending:rn,uniforms:{pixelRatio:{value:Fe.getPixelRatio()}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(.25,.8,.85),vec3(.9,1.,.96),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat);}"}),cm=new jo(qr,Dl);cm.frustumCulled=!1;Ge.add(cm);let S1=0,sl=0;function b1(){for(const i of Fh)i.life=0;Eu.fill(0),qr.attributes.heat.needsUpdate=!0,sl=0}function w1(i){for(sl+=i*36;sl>=1;){sl--;const t=Fh[S1++%Oo],e=Math.random()*Math.PI*2,n=.6+Math.random()*1.5;t.x=ct.position.x,t.y=ct.position.y,t.vx=-ct.velocity.x*.14+Math.cos(e)*n,t.vy=-ct.velocity.y*.14+Math.sin(e)*n,t.duration=t.life=.5+Math.random()*1.4}for(let t=0;t<Oo;t++){const e=Fh[t];e.life=Math.max(0,e.life-i),e.x+=e.vx*i,e.y+=e.vy*i,e.vx*=Math.exp(-i*1.3),e.vy*=Math.exp(-i*1.3),lm.set([e.x,e.y,2.2],t*3),Eu[t]=e.life/e.duration}qr.attributes.position.needsUpdate=!0,qr.attributes.heat.needsUpdate=!0}const We=document.createElement("canvas");We.width=1536;We.height=1064;const gi=We.getContext("2d"),gn=document.createElement("canvas");gn.width=We.width;gn.height=We.height;const xi=gn.getContext("2d"),ra=new bl(We);ra.colorSpace=bn;const Nl=new pe(new ys(26,18),new ke({map:ra,transparent:!0,depthWrite:!1,blending:rn}));Nl.position.z=.62;Ge.add(Nl);let Wn=13,Xn=9;function Tu(i,t){const e=Math.max(Wn,i),n=Math.max(Xn,t);if(e===Wn&&n===Xn)return;const s=document.createElement("canvas");s.width=We.width,s.height=We.height,s.getContext("2d").drawImage(We,0,0);const r=document.createElement("canvas");r.width=gn.width,r.height=gn.height,r.getContext("2d").drawImage(gn,0,0),gi.clearRect(0,0,We.width,We.height),xi.clearRect(0,0,gn.width,gn.height);const o=We.width*Wn/e,a=We.height*Xn/n;gi.drawImage(s,(We.width-o)/2,(We.height-a)/2,o,a),xi.drawImage(r,(gn.width-o)/2,(gn.height-a)/2,o,a),Wn=e,Xn=n,Nl.scale.set(e/13,n/9,1),ra.needsUpdate=!0}const si=640,Au=Array.from({length:si},()=>({x:0,y:0,time:0}));let yi=0,hn=0;const hm=new Float32Array(si*18),um=new Float32Array(si*6),dm=new Float32Array(si*6),ai=new _e;ai.setAttribute("position",new Pe(hm,3).setUsage(Ei));ai.setAttribute("side",new Pe(um,1));ai.setAttribute("intensity",new Pe(dm,1).setUsage(Ei));for(let i=0;i<si;i++)um.set([-1,1,-1,1,1,-1],i*6);ai.setDrawRange(0,0);const Cu=new pe(ai,new Yn({transparent:!0,depthWrite:!1,blending:rn,side:Pn,vertexShader:"attribute float side; attribute float intensity; varying float vSide; varying float vIntensity; void main(){vSide=side;vIntensity=intensity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying float vSide; varying float vIntensity; void main(){float glow=exp(-7.*vSide*vSide);float core=exp(-150.*vSide*vSide);gl_FragColor=vec4(mix(vec3(.25,.8,.85),vec3(.9,1.,.96),core),vIntensity*(glow*.48+core*.7));}"}));Cu.frustumCulled=!1;Cu.position.z=.72;Ge.add(Cu);function E1(){gi.clearRect(0,0,We.width,We.height),xi.clearRect(0,0,gn.width,gn.height),Wn=13,Xn=9,Nl.scale.set(1,1,1),ra.needsUpdate=!0,yi=0,hn=0,ai.setDrawRange(0,0)}function Ru(i,t){const e=We.width/(Wn*2),n=We.height/(Xn*2);gi.beginPath(),gi.moveTo((i.x+Wn)*e,(Xn-i.y)*n),gi.lineTo((t.x+Wn)*e,(Xn-t.y)*n),gi.strokeStyle="rgba(80,226,222,.095)",gi.lineWidth=2,gi.lineCap="round",gi.stroke(),ra.needsUpdate=!0}function T1(i,t){Tu(Math.max(Math.abs(i.x),Math.abs(t.x))+2,Math.max(Math.abs(i.y),Math.abs(t.y))+2);const e=gn.width/(Wn*2),n=gn.height/(Xn*2);xi.beginPath(),xi.moveTo((i.x+Wn)*e,(Xn-i.y)*n),xi.lineTo((t.x+Wn)*e,(Xn-t.y)*n),xi.strokeStyle="rgba(195,174,255,.22)",xi.lineWidth=1.25,xi.lineCap="round",xi.stroke()}const A1=new Ko({color:9632511,transparent:!0,opacity:.25,dashSize:.11,gapSize:.14}),xs=new jr(new _e,A1);xs.position.z=.15;Ge.add(xs);xs.visible=!1;const oa=qn(4,new Ko({color:7376041,transparent:!0,opacity:.17,dashSize:.055,gapSize:.12}));oa.computeLineDistances();oa.position.set(0,0,-.1);Ge.add(oa);const In=new hw({gravity:new b(0,0,0),allowSleep:!1}),Pu=new Kr("blob"),Oh=new Kr("wall");In.addContactMaterial(new Qo(Pu,Oh,{friction:0,restitution:.1}));const ct=new Rt({mass:1,shape:new Up(Jt),material:Pu,linearDamping:0,angularDamping:0,fixedRotation:!0});In.addBody(ct);const Bo=[],Nr=[],Bh=[];function C1(i){for(const t of i.channel?Op(i.channel):[]){const e=new Gr(t.map(r=>new vt(r.x,r.y))),n=new pl(e,{depth:4,bevelEnabled:!1,steps:1});n.translate(0,0,-1);const s=new pe(n,new ke({color:0}));s.castShadow=!0,Nr.push(s),bi.add(s)}for(const t of i.guides||[]){const e=new Rt({mass:0,material:Oh,shape:xw(t)});In.addBody(e),Bo.push(e);const n=new Gr(t.map(o=>new vt(o.x,o.y))),s=new pl(n,{depth:4,bevelEnabled:!1,steps:1});s.translate(0,0,-1);const r=new pe(s,new ke({color:0}));r.castShadow=!0,Nr.push(r),bi.add(r)}for(const t of i.walls){const e=new Rt({mass:0,material:Oh,shape:new Tl(new b(t.w/2,t.h/2,.7))});e.position.set(t.x,t.y,0),t.angle&&e.quaternion.setFromAxisAngle(new b(0,0,1),t.angle),In.addBody(e),e.isGate=!!t.gate,Bo.push(e);const n=new pe(new pu(t.w,t.h,4,4,.18),new ke({color:0}));n.position.set(t.x,t.y,1),n.rotation.z=t.angle||0,n.castShadow=!0,n.userData.gate=!!t.gate,Nr.push(n),bi.add(n)}}const Lu=[],zo=new bl(Fo),_l=document.createElement("canvas");_l.width=_l.height=128;const Iu=_l.getContext("2d"),Ul=Iu.createRadialGradient(64,64,0,64,64,64);Ul.addColorStop(0,"rgba(255,170,85,1)");Ul.addColorStop(.2,"rgba(255,143,40,.65)");Ul.addColorStop(1,"rgba(255,70,10,0)");Iu.fillStyle=Ul;Iu.fillRect(0,0,128,128);zo.image=_l;zo.needsUpdate=!0;function R1(i){for(const t of i.spikes){const e=new Ce;e.position.set(t.x,t.y,1.2),bi.add(e),Bh.push(e);const n=new pe(new Js(.22,20,12),new ke({color:16742948}));e.add(n);const s=new Si(new ri({map:zo,transparent:!0,opacity:.7,depthWrite:!1,blending:rn}));s.scale.set(1.35,1.35,1),e.add(s);const r=new wl(16747058,4,4,2);r.position.z=-.1,r.castShadow=!0,r.shadow.mapSize.set(256,256),r.shadow.camera.near=.1,r.shadow.camera.far=4,r.shadow.bias=-3e-4,e.add(r);const o=new Float32Array(54),a=new Float32Array(18),l=new _e;l.setAttribute("position",new Pe(o,3).setUsage(Ei)),l.setAttribute("heat",new Pe(a,1).setUsage(Ei));const c=Dl.clone();c.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(1.,.2,.02),vec3(1.,.72,.2),vHeat),pow(1.-r,2.)*vHeat*.65);}";const u=new jo(l,c);u.frustumCulled=!1,e.add(u),Lu.push({positions:o,heat:a,geometry:l,material:c})}}function P1(){for(const i of Lu){i.material.uniforms.pixelRatio.value=Fe.getPixelRatio();for(let t=0;t<18;t++){const e=(zt*.75+t/18)%1,n=t*2.39996,s=.15+e*(.3+t%4*.08);i.positions.set([Math.cos(n)*s,Math.sin(n)*s,.2],t*3),i.heat[t]=(1-e)**2}i.geometry.attributes.position.needsUpdate=!0,i.geometry.attributes.heat.needsUpdate=!0}}const Ri=new Ce;Ri.position.set(jt.goal.x,jt.goal.y,1);bi.add(Ri);const Du=new Si(new ri({map:bu,transparent:!0,opacity:.45,depthWrite:!1,blending:rn,color:9554175}));Du.scale.set(4.5,4.5,1);Ri.add(Du);const L1=new pe(new Zi(.64,64),new ke({color:532025,transparent:!0,opacity:.88,side:Pn}));Ri.add(L1);for(let i=0;i<3;i++){const t=qn(.65+i*.16,new dn({color:i===0?11665392:7909375,transparent:!0,opacity:.78-i*.18}));t.position.z=.2+i*.02,Ri.add(t)}const Qs=new wl(10906623,8,6,2);Qs.position.z=.1;Qs.castShadow=!0;Qs.shadow.mapSize.set(256,256);Qs.shadow.camera.near=.1;Qs.shadow.camera.far=6;Qs.shadow.bias=-3e-4;Ri.add(Qs);const fm=new Float32Array(96),pm=new Float32Array(32),ko=new _e;ko.setAttribute("position",new Pe(fm,3).setUsage(Ei));ko.setAttribute("heat",new Pe(pm,1).setUsage(Ei));const Nu=Dl.clone();Nu.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(.4,.12,1.),vec3(.85,.6,1.),vHeat),pow(1.-r,2.)*vHeat);}";const mm=new jo(ko,Nu);mm.frustumCulled=!1;Ri.add(mm);function I1(){Nu.uniforms.pixelRatio.value=Fe.getPixelRatio();for(let i=0;i<32;i++){const t=(zt*.5+i/32)%1,e=i*2.39996+t*.9,n=.8+t*.8;fm.set([Math.cos(e)*n,Math.sin(e)*n,.4],i*3),pm[i]=Math.sin(t*Math.PI)}ko.attributes.position.needsUpdate=!0,ko.attributes.heat.needsUpdate=!0}let zt=0,ks=0,Go=performance.now(),re=[],D1=1,li="fade",nn=!0,Re="ready",ci=!1,Xe=!1,Fc=0,ps=null,gm=0,xn=mt.sandbox?"sandbox":"maze",Ss=0,$e=!1,Ws=null,Je=null,ce=null,Nn=!1,xe,Ye=null,he=null,Ur=-1,Ho=null,So=-1;const rl=()=>mt.mechanic==="companion"||(mt.entities||[]).some(i=>i.type==="companion");let js=0,En=!1,Be=null;const Qt=()=>jn||sn,xm="orbit-lab-campaign-complete-v1";let zh=(()=>{try{return new Set(JSON.parse(localStorage.getItem(xm)||"[]").filter(i=>[1,2].includes(i)))}catch{return new Set}})();function N1(i){zh.add(i);try{localStorage.setItem(xm,JSON.stringify([...zh]))}catch{}}let Tr=(()=>{try{return FE(JSON.parse(localStorage.getItem(Jp)||"{}"))}catch{return{}}})();function U1(i,t){const e=OE(Tr[i],t);if(e!==Tr[i]){Tr={...Tr,[i]:e};try{localStorage.setItem(Jp,JSON.stringify(Tr))}catch{}}}function Uu(i,t){const e=["Cyan bass","Violet offbeat","Gold chime"],n=document.createElement("span");n.className="gate-pattern-icons",n.setAttribute("role","img"),n.setAttribute("aria-label",e.map((s,r)=>`${s} ${t&1<<r?"acquired":"not acquired"}`).join(", ")),e.forEach((s,r)=>{const o=document.createElement("i");o.style.setProperty("--gate-color",vu[r]),o.classList.toggle("acquired",!!(t&1<<r)),n.append(o)}),i.append(" ",n)}function ts(i,t="home"){En=i,nt("#home").classList.toggle("hidden",!i||t!=="home"),nt("#levelSelect").classList.toggle("hidden",!i||t!=="levels"),nt("#infiniteSelect").classList.toggle("hidden",!i||t!=="infinite");for(const e of[".chrome",".scene",".play-control"])nt(e).inert=i;i&&nt(t==="levels"?'[data-campaign-level="1"]':t==="infinite"?"#infiniteSeed":"#startCampaign").focus()}const vm=new Ce;Ge.add(vm);const Gs=new Map,ym=new Ce;Ge.add(ym);const ol=[],_m=new Ce;Ge.add(_m);const al=new Map;let Vi=null;function F1(){for(const i of al.values())kn(i);al.clear();for(const i of mt.entities||[]){if(i.type==="soundGate")continue;let t;if(i.type==="eclipse")t=Ep(i.radius);else if(i.type==="dimmer")t=Tp(.22);else if(i.type==="ember"||i.type==="lightPickup"||i.type==="portal"||i.type==="companion"){const e=i.type==="ember"?16747058:i.type==="lightPickup"?16768923:i.type==="portal"?7793123:13481983;if(t=iu(i.type==="ember"||i.type==="portal"||i.type==="companion"?i.radius:.22,e,i.type==="portal"),i.type==="companion"){const n=qn(i.captureRadius,new Ko({color:13481983,transparent:!0,opacity:.24,dashSize:.14,gapSize:.17,depthWrite:!1}));n.computeLineDistances(),t.add(n)}}else{const e=i.type==="portal"?7987670:i.type==="impulse"?7793123:i.type==="eclipse"?6774148:16767371;t=new Ce,t.add(qn(i.radius,new dn({color:e,transparent:!0,opacity:.86}))),t.add(qn(i.radius*.72,new dn({color:e,transparent:!0,opacity:.32})))}t.position.set(i.x,i.y,1.45),_m.add(t),al.set(i.id,t)}}function O1(){var i,t;if(he)for(const e of mt.entities||[]){const n=al.get(e.id),s=he.items[e.id];!n||!s||(n.position.set(s.x,s.y,1.45),n.visible=!s.used,(t=(i=n.userData).animate)==null||t.call(i,zt,Fe.getPixelRatio()),n.userData.setFade&&n.userData.setFade(s.used?0:1))}}function B1(){for(const i of ol)kn(i);if(ol.length=0,!!Qt())for(const i of mt.soundGates){const t=new Ce;t.position.set(i.x,i.y,1.5);const e=new se(vu[i.id]),n=new Si(new ri({map:bu,color:e,transparent:!0,opacity:.32,blending:rn,depthWrite:!1}));n.scale.set(3.5,3.5,1);const s=qn(i.radius,new dn({color:e,transparent:!0,opacity:.88})),r=qn(i.radius*.72,new dn({color:e,transparent:!0,opacity:.37}));t.add(n,s,r),ym.add(t),ol.push(t)}}function z1(){for(const i of mt.soundGates||[]){const t=ol[i.id];if(!t)continue;const e=!!((Ye==null?void 0:Ye.mask)&1<<i.id),n=1+(e?.08:.035)*Math.sin(zt*Math.PI*8);t.scale.setScalar(n),t.children[0].material.opacity=e?.13:.32,t.children[1].material.opacity=e?.32:.88,t.children[2].material.opacity=e?.17:.37}}function Mm(i,t,e,n,s){const r=D1++,o=r%2?g1:x1,a=new Ce;a.position.set(i,t,jt.channel?4:1);const l=new pe(new Zi(.2,48),new ke({color:o,transparent:!0,opacity:.32})),c=new pe(new Zi(.082,32),new ke({color:v1})),u=qn(.29,new dn({color:o,transparent:!0,opacity:.85})),h=qn(.6,new dn({color:o,transparent:!0,opacity:.45})),d=qn(1.2,new Ko({color:o,transparent:!0,opacity:.21,dashSize:.07,gapSize:.11}));d.computeLineDistances();const f=new jr(new _e,new dn({color:o,transparent:!0,opacity:.9}));return a.add(l,c,u,h,d,f),Ge.add(a),{id:r,x:i,y:t,strength:e,lifetime:n,createdAt:s,group:a,disc:l,inner:u,outer:h,field:d,timer:f,color:o}}function Ml(i){Ge.remove(i.group),i.group.traverse(t=>{var e,n;(e=t.geometry)==null||e.dispose(),(n=t.material)==null||n.dispose()})}function Vo(){nt("#wellCount").textContent=`${re.length} / ${Qt()?mt.settings.maxActiveWells:2}`,Su.innerHTML=re.length?re.map(i=>`
    <div class="well-item" style="--well-color:${i.id%2?"#66e9f2":"#9b90ff"}">
      <span class="well-glyph">✳</span><span class="well-name">WELL ${String(i.id).padStart(2,"0")}</span>
      <span class="well-timer" data-well-time="${i.id}">${Vr(i,zt).toFixed(1)}s</span>
      <button data-remove="${i.id}" aria-label="Remove well ${i.id}" title="Remove well">×</button>
    </div>`).join(""):'<p class="empty-wells">No wells active. Place one in the arena.</p>'}function Zs(i){const t=re.findIndex(e=>e.id===i);t!==-1&&(Ml(re[t]),re.splice(t,1),Vo(),Qi())}function k1(i,t){if(Xe||$e||yn.open||_n.open||En||xe!=null&&xe.open||Qt()&&!PE(js,mt.settings.maxTotalWells)||xn==="maze"&&!(Qt()?Zp({x:i,y:t},jt):hu({x:i,y:t},jt)))return;const e=Mm(i,t,Number(an.value),Number(vn.value),zt);Qt()&&js++,ne.placement(),Mu=zt;const n=Qt()?mt.settings.maxActiveWells:2,s=re.length>=n?re[0]:null;re=bw(re,e,n),s&&Ml(s),Vo(),Qi(),s&&!re.includes(s)&&Ml(s),Vo(),Qi(),Re==="ready"&&(Ms.textContent="TAP START TO RELEASE")}function Sm(){re.forEach(Ml),re=[],Vo(),Qi()}function es(){if(ne.reset(),Mu=0,Ws&&(clearTimeout(Ws),Ws=null),Sm(),W1(),js=0,zt=0,ks=0,E1(),b1(),Xe=!1,$e=!1,Ur=-1,So=-1,Ho=null,nn=!0,Re="ready",Ll.classList.add("hidden"),Il.classList.add("hidden"),nt("#deathFlash").classList.remove("visible"),Ms.textContent=xn==="maze"?"PLACE A WELL · THEN START":"TAP START TO RELEASE",Ms.classList.remove("moon-cue"),ct.force.setZero(),ct.angularVelocity.setZero(),xn==="maze")ct.position.set(jt.spawn.x,jt.spawn.y,0),ct.velocity.set(jt.spawn.vx,jt.spawn.vy,0),Ho={x:ct.position.x,y:ct.position.y},Ss+=1,nt("#attempts").textContent=Ss,Qt()&&(Be={minX:ct.position.x,maxX:ct.position.x,minY:ct.position.y,maxY:ct.position.y});else{ct.position.set(4,0,0);const i=Number(an.value);ct.velocity.set(0,Math.sqrt(i*4*4/Math.pow(16+.75*.75,1.5)),0),re=[Mm(0,0,i,Number(vn.value),0)]}ws(),ku(0,!0),nt("#runTime").textContent="0.0s",Vo(),Qi(),Yr(),Go=performance.now()}function Rr(i="darkness"){if(!(Xe||$e)){if(ne.death(),ne.stopHeartbeat(),Xe=!0,nn=!0,Re="dead",nt("#deathFlash").classList.add("visible"),Yr(),Qt()){bm(!1,i);return}Ws=setTimeout(es,420)}}function bm(i,t="darkness"){jn&&i&&!Nn&&U1($s,(Ye==null?void 0:Ye.mask)||0);const e=hn?Au[(yi+hn-1)%si]:jt.spawn;Ru(e,ct.position);const n=Qt()?{minX:Math.min(Be.minX,jt.spawn.x,ct.position.x)-6,maxX:Math.max(Be.maxX,jt.spawn.x,ct.position.x)+6,minY:Math.min(Be.minY,jt.spawn.y,ct.position.y)-6,maxY:Math.max(Be.maxY,jt.spawn.y,ct.position.y)+6}:jt.bounds;Gw(nt("#winArtwork"),We,Wn,Xn,n,jt.spawn,ct.position,gn),nt("#resultEyebrow").textContent=i?"COURSE COMPLETE":"SIGNAL LOST",nt("#resultTitle").textContent=Qt()?i?"Light carried home.":t==="manual"?"Journey ended.":t==="hazard"?"Taken by the ember.":"The light went out.":"Your orbit.",nt("#winStats").textContent=`${zt.toFixed(1)} seconds  ·  ${Ss} attempt${Ss===1?"":"s"}${Qt()?`  ·  ${js} well${js===1?"":"s"} placed`:""}`,nt("#winGateStats").classList.toggle("hidden",!Qt()),Qt()&&(nt("#winGateStats").textContent=`${i?"Gates":"Collected (not scored)"} ${Do(Ye.mask)}/3 · ${Qp(Ye.mask)}`,Uu(nt("#winGateStats"),Ye.mask)),nt("#infiniteResult").classList.toggle("hidden",!sn),nt("#editInfinite").classList.toggle("hidden",!sn),nt("#copyInfinite").classList.toggle("hidden",!sn),sn&&(nt("#infiniteResult").textContent=`Seed ${$i} · Stage ${ji} · Generation ${Rl}`),nt("#winRestart").textContent=Qt()?i&&!Nn?"Continue ↗":"Retry":"Fly again ↗",nt("#winEditor").classList.toggle("hidden",!Nn),Il.classList.remove("hidden")}function G1(){$e||(ne.portal(),ne.stopHeartbeat(),$e=!0,nn=!0,Re="won",jn&&!Nn&&N1($s),bm(!0),Yr())}function kh(i){jn=!1,sn=!1,Nn=!1,ts(!1),mt=Hp(i),xn=mt.sandbox?"sandbox":"maze",oi=mt.heroGravity,an.min=35,an.max=180,vn.min=2,vn.max=16,an.value=wf,nt("#strengthValue").textContent=wf,nt("#heroGravity").value=oi,nt("#heroGravityValue").textContent=oi,Ss=0,ci=!1;const t=new URL(location.href);t.searchParams.delete("campaign"),t.searchParams.delete("infinite"),t.searchParams.delete("stage"),t.searchParams.set("demo",mt.id),history.replaceState(null,"",t),ws(),es()}function Fu(i=1){jn=!0,sn=!1,Nn=!1,ts(!1),mt=xu(i),$s=mt.id,xn="maze",oi=0,an.min=Math.min(35,mt.settings.wellStrength),an.max=Math.max(180,mt.settings.wellStrength),vn.min=Math.min(2,mt.settings.wellLifetime),vn.max=Math.max(16,mt.settings.wellLifetime),an.value=mt.settings.wellStrength,nt("#strengthValue").textContent=mt.settings.wellStrength,vn.value=mt.settings.wellLifetime,nt("#lifetimeValue").textContent=`${mt.settings.wellLifetime.toFixed(1)}s`,Ss=0,ci=!1,Pi=!1;const t=new URL(location.href);t.searchParams.delete("demo"),t.searchParams.delete("infinite"),t.searchParams.delete("stage"),t.searchParams.set("campaign",String($s)),history.replaceState(null,"",t),ws(),es()}function Fl(i,t=1){$i=na(i)||tm(),ji=Pl(t),sn=!0,jn=!1,Nn=!1,ts(!1),mt=im($i,ji),xn="maze",oi=0,an.min=Math.min(35,mt.settings.wellStrength),an.max=Math.max(180,mt.settings.wellStrength),vn.min=Math.min(2,mt.settings.wellLifetime),vn.max=Math.max(16,mt.settings.wellLifetime),an.value=mt.settings.wellStrength,nt("#strengthValue").textContent=mt.settings.wellStrength,vn.value=mt.settings.wellLifetime,nt("#lifetimeValue").textContent=`${mt.settings.wellLifetime.toFixed(1)}s`,Ss=0,ci=!1,Pi=!1;const e=new URL(location.href);e.searchParams.delete("demo"),e.searchParams.delete("campaign"),e.searchParams.set("infinite",$i),e.searchParams.set("stage",String(ji)),history.replaceState(null,"",e),ws(),es()}function H1(i){const t=Al(structuredClone(i));Nn=!0,jn=!0,sn=!1,ts(!1);for(const n of[".chrome",".scene",".play-control"])nt(n).inert=!1;mt={id:"editor-playtest",title:t.document.title,color:"#9ee6df",objective:"Playtest your level. Return to the editor to revise it.",mechanic:"campaign",heroGravity:0,moons:[],level:t.level,document:t.document,entities:t.entities,settings:t.settings,soundGates:t.entities.filter(n=>n.type==="soundGate").map(n=>({id:n.slot,x:n.x,y:n.y,radius:n.radius}))},xn="maze",oi=0,Ss=0,ci=!1,Pi=!1,an.min=Math.min(35,t.settings.wellStrength),an.max=Math.max(180,t.settings.wellStrength),vn.min=Math.min(2,t.settings.wellLifetime),vn.max=Math.max(16,t.settings.wellLifetime),an.value=t.settings.wellStrength,nt("#strengthValue").textContent=t.settings.wellStrength,vn.value=t.settings.wellLifetime,nt("#lifetimeValue").textContent=`${t.settings.wellLifetime.toFixed(1)}s`;const e=new URL(location.href);e.searchParams.delete("demo"),e.searchParams.delete("campaign"),e.searchParams.delete("infinite"),e.searchParams.delete("stage"),history.replaceState(null,"",e),ws(),es()}const Gh=new Ce;Ge.add(Gh);const je=[];let mi=null;function kn(i){var t;(t=i.parent)==null||t.remove(i),i.traverse(e=>{var n,s,r,o;(n=e.geometry)==null||n.dispose(),(s=e.material)==null||s.dispose(),(o=(r=e.shadow)==null?void 0:r.map)==null||o.dispose()})}function Ou(i){if(yl!==i){yl=i;for(const t of Bo)t.isGate&&(i&&In.bodies.includes(t)&&In.removeBody(t),!i&&!In.bodies.includes(t)&&In.addBody(t));for(const t of Nr)t.userData.gate&&(t.visible=!i);if(jt.walls=mt.level.walls.filter(t=>!t.gate||!i).map(t=>({...t})),Vi)for(const t of Vi.children)t.material.opacity=i?.38:.75}}function V1(){const i=(ce==null?void 0:ce.pickups)||(Je==null?void 0:Je.pickups)||[],t=new Set(i.map(e=>e.id));for(const[e,n]of Gs)t.has(e)||(kn(n),Gs.delete(e));for(const e of i){if(!Gs.has(e.id)){const o=iu(.22,16770216);o.position.set(e.x,e.y,1.65),vm.add(o),Gs.set(e.id,o)}const n=Gs.get(e.id),s=Math.max(0,(ce?Hn.pickupLife:Vp)-(zt-e.createdAt)),r=Math.min(1,s/3);n.userData.animate(zt,Fe.getPixelRatio()),n.userData.setFade(r),n.scale.setScalar(.96+.06*Math.sin(zt*3+e.id))}}function wm(){const i=nt("#resourceHud");i.classList.toggle("hidden",!Je&&!ce),i.classList.toggle("campaign-resource",!!ce),nt("#campaignGateHud").classList.toggle("hidden",!ce);const t=!!ce&&ce.energy<=0&&!Xe&&!$e;if(i.classList.toggle("last-embers",t),i.classList.toggle("meter-paused",nn||En||document.hidden),!Je&&!ce)return;const e=(ce==null?void 0:ce.energy)??Je.energy;if(nt("#resourceValue").textContent=`${Math.round(e*100)}%`,nt("#resourceFill").style.width=`${t?ce.graceLeft/(ce.graceDuration||Hn.graceSeconds)*100:e*100}%`,t&&(nt("#resourceValue").textContent=`${Math.ceil(ce.graceLeft)}s`,i.style.setProperty("--warning-period",`${.55+ce.graceLeft/(ce.graceDuration||Hn.graceSeconds)*.65}s`)),nt("#gateStatus").textContent=ce?e>0?`${js} WELL${js===1?"":"S"}`:"LAST EMBERS":Je.pendingClose?"GATE CLOSING":Je.gateOpen?"GATE OPEN":"GATE CLOSED",ce){const n=(Ye==null?void 0:Ye.mask)||0;nt("#campaignGateCount").textContent=`${Do(n)}/3 gates`;const s=nt("#campaignGateIcons");s.dataset.mask!==String(n)&&(s.replaceChildren(),Uu(s,n),s.dataset.mask=String(n))}}function W1(){jt=structuredClone(mt.level),yl=!1,Je=mt.mechanic==="burnout"?jw():null,ce=Qt()?LE(sn?JE($i,ji):428,mt.settings):null,Ye=Qt()?NE():null,B1(),he=Qt()?BE(mt.entities||[]):null,F1();for(const t of Gs.values())kn(t);Gs.clear(),Vi&&kn(Vi),Vi=null,Ke.reset(mt),(Je||ce)&&(Ke.brightness=(ce||Je).energy),rm.reset(mt),Ci.color.setHex(fu.has(mt.mechanic)?16777215:6744562);for(const t of Bo)In.removeBody(t);Bo.length=0;for(const t of Nr)kn(t);Nr.length=0;for(const t of Bh)kn(t);Bh.length=0,Lu.length=0;for(const t of je)In.removeBody(t.body),kn(t.mesh),kn(t.trail);if(je.length=0,mi&&kn(mi),mi=null,bi.visible=!mt.sandbox,oa.visible=!!mt.sandbox,mt.sandbox||(C1(jt),Qt()||R1(jt)),Ri.position.set(jt.goal.x,jt.goal.y,1),Ri.scale.setScalar(jt.goal.radius),Je){const t=jt.walls.find(e=>e.gate);Vi=new Ce,Vi.position.set(t.x,t.y,1.3);for(const e of[-t.h/2+.7,t.h/2-.7]){const n=om([{x:-.65,y:e},{x:.65,y:e}],new dn({color:16767371,transparent:!0,opacity:.38}));Vi.add(n)}bi.add(Vi),Ou(!0)}wm();for(const t of mt.moons)Em(t,mt.mechanic==="companion");mt.plate&&(mi=new Ce,mi.position.set(mt.plate.x,mt.plate.y,.7),mi.add(qn(mt.plate.radius,new dn({color:16767114,transparent:!0,opacity:.9}))),mi.add(qn(mt.plate.radius*.8,new Ko({color:16767114,transparent:!0,opacity:.3,dashSize:.1,gapSize:.12}))),mi.children[1].computeLineDistances(),bi.add(mi));const i=je.length>0||!!mt.mechanic;nt("#heroGravity").disabled=rl()||!je.length,nt("#heroGravity").value=oi,nt("#heroGravityValue").textContent=oi,nt("#heroGravityHelp").textContent=rl()?"Companions follow the dot without pulling back. Try the loose moon studies for reciprocal gravity.":i?"Pulls loose moons; their small mass also tugs back. Set 0 to compare.":"Choose a moon study to explore the dot’s own gravity.",No.disabled=i,xs.visible=No.checked&&!i,nt("#forecastHelp").textContent=i?"Prediction is off for interactive studies. Watch the rule unfold in motion.":"Preview stops at the next wall, ember, or portal contact.",nt("#activeDemoLabel").textContent=mt.title,nt(".settings-help").textContent=`Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R ${Qt()?"ends the attempt":"restarts"} · E removes oldest / releases capture · 1 / 2 remove a specific well.`,nt("#demoTitle").textContent=mt.title,nt("#demoObjective").textContent=mt.objective,nt("#demoNote").style.setProperty("--demo-color",mt.color),nt("#companionHud").classList.toggle("hidden",!rl()),Ol();for(const t of document.querySelectorAll("[data-demo]"))t.setAttribute("aria-pressed",String(t.dataset.demo===mt.id))}function Em(i,t=!1){const e=new Rt({mass:.08,shape:new Up(.16),material:Pu,linearDamping:0,angularDamping:0,fixedRotation:!0});e.position.set(i.x,i.y,0),e.velocity.set(i.vx,i.vy,0),In.addBody(e);const n=new Ce,s=new pe(new Js(.16,20,12),new ke({color:mt.plate?16767114:14208511})),r=new Si(new ri({map:bu,color:mt.plate?16758867:12428287,transparent:!0,opacity:.5,depthWrite:!1,blending:rn}));r.scale.set(1.2,1.2,1),n.add(s,r),Gh.add(n);const o=new Si(new ri({map:zo,transparent:!0,opacity:0,depthWrite:!1,blending:rn}));o.scale.set(1.1,1.1,1),n.add(o);const a=[];if(t)for(let h=0;h<5;h++){const d=new Si(new ri({map:zo,transparent:!0,opacity:0,depthWrite:!1,blending:rn}));d.scale.set(.15,.15,1),n.add(d),a.push(d)}const l=new Float32Array(480),c=new _e;c.setAttribute("position",new Pe(l,3).setUsage(Ei)),c.setDrawRange(0,0);const u=new jr(c,new dn({color:mt.plate?15910506:12166635,transparent:!0,opacity:.28,depthWrite:!1}));u.frustumCulled=!1,Gh.add(u),je.push({body:e,mesh:n,trail:u,positions:l,count:0,lastSample:-1,lastArchive:{x:i.x,y:i.y},companionState:t?r1():null,heat:t?l1():null,heatAura:o,heatSparks:a})}function Bu(i){In.removeBody(i.body),kn(i.mesh),kn(i.trail),je.splice(je.indexOf(i),1),Ol()}function Tm(i){Ms.textContent=i,Ms.classList.add("moon-cue"),So=zt+1.6}function X1(i,t){const e=Uh(je);if(!e||!t||zt<Ur)return!1;const n=f1({before:i,lastSafe:Ho,ember:t,level:jt,entities:mt.entities,runtime:he});if(!n)return!1;Bu(e);const s=p1(n,t);return ct.position.set(n.x,n.y,0),ct.previousPosition.copy(ct.position),ct.interpolatedPosition.copy(ct.position),ct.velocity.set(s.x,s.y,0),ct.force.setZero(),ct.aabbNeedsUpdate=!0,ct.wakeUp(),Ho=n,Ur=zt+d1,yi=0,hn=0,ai.setDrawRange(0,0),ne.tone(783.99,0,.22,.09),ne.tone(523.25,.12,.4,.06),Tm("MOON SAVED YOU"),!0}function q1(i){for(const t of zE(he,i)){const e=t.x-ct.position.x,n=t.y-ct.position.y,s=Math.hypot(e,n)||1;Em({x:t.x,y:t.y,vx:ct.velocity.x-n/s*1.35,vy:ct.velocity.y+e/s*1.35},!0),ne.tone(659.25,0,.26,.055)}Ol()}function Ol(){if(!rl())return;const i=je.filter(a=>a.companionState),t=i.length,e=nt("#companionHud"),n=[...new Set(i.map(a=>{var l;return(l=a.heat)!=null&&l.smoldering?"smoldering":a.companionState.phase}))],s=(mt.entities||[]).filter(a=>a.type==="companion"),r=s.length>0&&s.every(a=>{var l;return(l=he==null?void 0:he.items[a.id])==null?void 0:l.used}),o=`${t} companion${t===1?"":"s"}${n.length?` · ${n.join(" / ")}`:r?" · none remaining":" · find the pale moons"}`;e.textContent!==o&&(e.textContent=o),e.dataset.phase=n.length===1?n[0]:""}function Y1(i){if(!je.length)return;const t=je.filter(s=>!s.companionState);if(t.length){const s=t.map(o=>({x:o.body.position.x,y:o.body.position.y,mass:o.body.mass})),r=Ww(ct.position,s,oi);ct.applyForce(new b(r.hero.x*ct.mass,r.hero.y*ct.mass,0));for(let o=0;o<t.length;o++){const a=t[o].body,l=du(a.position,re,zt,li,jt);a.applyForce(new b((l.x+r.moons[o].x)*a.mass,(l.y+r.moons[o].y)*a.mass,0))}}const e=je.filter(s=>s.companionState);if(!e.length)return;const n=Wr(ct.position,re,zt,li);for(const s of e){const r=s.body,o=Wr(r.position,re,zt,li),a=o1(s.companionState,{hero:{x:ct.position.x,y:ct.position.y,vx:ct.velocity.x,vy:ct.velocity.y},moon:{x:r.position.x,y:r.position.y,vx:r.velocity.x,vy:r.velocity.y},heroAcceleration:i,heroWellAcceleration:n,moonWellAcceleration:o,wells:re,time:zt,dt:ze});s.companionState=a.state,r.applyForce(new b(a.acceleration.x*r.mass,a.acceleration.y*r.mass,0)),a.returned&&zt>=s.companionState.returnToneAt&&(ne.tone(523.25,0,.18,.025),s.companionState.returnToneAt=zt+4)}}function $1(){for(const i of je)i.body.position.z=0,i.body.velocity.z=0,uu(i.body.velocity,i.companionState?Math.max(18,Math.hypot(ct.velocity.x,ct.velocity.y)+8):10);if(!(yl||!Xw(mt.plate,je.map(i=>i.body.position)))){Ou(!0);for(const i of mi.children)i.material.color.setHex(8911310);nt("#demoObjective").textContent="Gate open. Take your trail through the portal.",ne.tone(392,0,1.3,.1),ne.tone(523.25,.15,1.3,.1)}}function j1(){var i;for(const t of je){const e=t.body.position;if(t.mesh.position.set(e.x,e.y,2),t.companionState){t.trail.material.opacity=t.companionState.phase==="returning"?.5:t.companionState.phase==="borrowed"?.25:.32,t.mesh.children[1].material.opacity=t.companionState.phase==="returning"?.68:.52;const n=((i=t.heat)==null?void 0:i.heat)||0;t.heatAura.material.opacity=n?.35+.3*Math.sin(zt*18)**2:0,t.heatAura.scale.setScalar(1.1+n*.4),t.mesh.children[0].material.color.setHex(n?16759420:14208511);for(let s=0;s<t.heatSparks.length;s++){const r=t.heatSparks[s],o=(zt*(2.3+s*.17)+s*.23)%1,a=s*2.4+zt*.9;r.position.set(Math.cos(a)*(.12+o*.3),Math.sin(a)*(.12+o*.3),.04),r.material.opacity=n?Math.min(.6,n/.7)*(1-o):0}}zt-t.lastSample<.05||nn||(t.lastSample=zt,t.count===160&&(t.positions.copyWithin(0,3),t.count--),t.positions.set([e.x,e.y,.8],t.count++*3),t.trail.geometry.attributes.position.needsUpdate=!0,t.trail.geometry.setDrawRange(0,t.count))}}function Z1(){const i=[];for(const t of[...je]){if(!t.companionState)continue;const e={x:t.body.position.x,y:t.body.position.y},n=t.lastArchive;T1(n,e),t.lastArchive=e,Qt()&&Be&&(Be.minX=Math.min(Be.minX,n.x,e.x),Be.maxX=Math.max(Be.maxX,n.x,e.x),Be.minY=Math.min(Be.minY,n.y,e.y),Be.maxY=Math.max(Be.maxY,n.y,e.y));const s=h1(n,e,.16,mt.entities,he),r=t.heat.smoldering,o=u1(t.heat,s,ze);if(t.heat=o.state,o.ignited&&ne.tone(261.63,0,.13,.032,174.61),o.burned){ne.noise(.18,1700,.07),Bu(t);continue}!r&&!o.state.smoldering&&!s&&i.push({from:n,to:e,radius:.16})}return i}function K1(i){const t=i.level.bounds,e=170/(t.maxX-t.minX),n=100/(t.maxY-t.minY),s=p=>(p-t.minX)*e,r=p=>(t.maxY-p)*n,o=p=>p*Math.min(e,n),a=i.sandbox?"":i.level.walls.map(p=>`<rect x="${s(p.x-p.w/2)}" y="${r(p.y+p.h/2)}" width="${p.w*e}" height="${p.h*n}" rx="1" fill="#02070c"/>`).join(""),l=i.moons.map(p=>`<circle cx="${s(p.x)}" cy="${r(p.y)}" r="2" fill="${i.color}"/>`).join(""),c=i.level.spikes.map(p=>`<circle cx="${s(p.x)}" cy="${r(p.y)}" r="2" fill="#ffa75b"/>`).join(""),u=(p,x,g,m)=>`<circle cx="${s(p)}" cy="${r(x)}" r="${o(g)}" stroke="${m}" fill="none" stroke-width="1"/>`,h=(i.level.channel?Op(i.level.channel):i.level.guides||[]).map(p=>`<polygon points="${p.map(x=>`${s(x.x)},${r(x.y)}`).join(" ")}" fill="#02070c"/>`).join(""),d=fu.has(i.mechanic)?`<path d="M85 50 L155 25 L155 75 Z" fill="${i.color}" opacity=".25"/><path d="M85 35 L85 65" stroke="${i.color}" stroke-width="2"/>`:"",f=mt&&i.mechanic?["power","dimmer","sound"].includes(i.mechanic)?[-5,0,5].map(p=>u(p,0,.65,i.color)).join(""):i.mechanic==="burnout"?u(-5,1,.65,"#ffd98b")+u(5,0,1,"#ffd98b"):i.mechanic==="portals"?u(-3,0,1,"#76e9e3")+u(6,-3,1,"#76e9e3"):i.mechanic==="clock"?u(0,0,3.5,"#ff8a32"):["giant","chaser"].includes(i.mechanic)?u(0,0,i.mechanic==="giant"?1.6:.3,"#ff8a32"):["sticky","eclipse","boost","hidden"].includes(i.mechanic)?u(-3,0,.85,i.color):"":"";return`<svg viewBox="0 0 170 100" aria-hidden="true"><rect width="170" height="100" rx="5" fill="#102b38"/>${a}${h}<path d="M25 70 C30 20 75 20 85 50 S120 80 140 30" fill="none" stroke="${i.color}" opacity=".7" stroke-width=".7"/>${l}${d}${f}${i.sandbox?'<ellipse cx="85" cy="50" rx="28" ry="25" fill="none" stroke="#9acfff" stroke-width=".6"/>':c}<circle cx="${s(i.level.spawn.x)}" cy="${r(i.level.spawn.y)}" r="2.4" fill="#dffff9"/><circle cx="${s(i.level.goal.x)}" cy="${r(i.level.goal.y)}" r="${Math.max(4,o(i.level.goal.radius))}" stroke="#bc9aff" stroke-width=".8" fill="none"/>${i.plate?u(i.plate.x,i.plate.y,i.plate.radius,"#ffd88a"):""}</svg>`}const _n=nt("#gallery");nt("#demoGrid").innerHTML=qi.map(i=>`<button type="button" class="demo-card" data-demo="${i.id}" style="--demo-color:${i.color}" aria-pressed="false">${K1(i)}<span class="demo-rule">${i.rule}</span><strong>${i.title}</strong><span>${i.description}</span><em>${i.question}</em></button>`).join("");const Am=[["All",qi.map(i=>i.id)],["Gravity",["drift","satellites","companion","slingshot","gate","orbit","release","boost","sticky","giant","chaser","clock"]],["Light",["eclipse","power","dimmer","hidden","shadow-posts","filters","lens","prism","burnout"]],["Sound",["sound"]],["Space & paths",["maze","guide","portals","wideworld"]]];nt("#demoCategories").innerHTML=Am.map(([i,t],e)=>`<button type="button" data-category="${e}" aria-pressed="${e===0}">${i}<span>${t.length}</span></button>`).join("");nt("#demoCategories").addEventListener("click",i=>{const t=i.target.closest("[data-category]");if(!t)return;const e=Am[Number(t.dataset.category)][1];for(const n of nt("#demoCategories").querySelectorAll("button"))n.setAttribute("aria-pressed",String(n===t));for(const n of nt("#demoGrid").querySelectorAll("[data-demo]"))n.hidden=!e.includes(n.dataset.demo)});let Pi=!1,Wo=!1;function zu(){Wo=En,En&&ts(!1),Pi=Re==="running",Pi&&tr(),yn.close(),_n.showModal()}function hi(){Pi=!1,ci=!1,Wo=!1,xe==null||xe.hide(),Ws&&(clearTimeout(Ws),Ws=null),yn.open&&yn.close(),_n.open&&_n.close(),nn=!0,ne.stopHeartbeat(),Re==="running"&&(Re="paused"),ts(!0),Il.classList.add("hidden"),Ll.classList.add("hidden"),nt("#deathFlash").classList.remove("visible");const i=new URL(location.href);i.searchParams.delete("demo"),i.searchParams.delete("campaign"),i.searchParams.delete("infinite"),i.searchParams.delete("stage"),history.replaceState(null,"",i),Jr()}function Bl(){Pi=!1,ci=!1,yn.open&&yn.close(),_n.open&&_n.close(),nn=!0,ne.stopHeartbeat(),Re==="running"&&(Re="paused"),ts(!1);for(const t of[".chrome",".scene",".play-control"])nt(t).inert=!0;Il.classList.add("hidden"),Ll.classList.add("hidden"),nt("#deathFlash").classList.remove("visible");const i=new URL(location.href);for(const t of["demo","campaign","infinite","stage"])i.searchParams.delete(t);history.replaceState(null,"",i),xe.show(),Jr()}xe=$E({mount:sm,defaultDocument:xu(1).document,onHome:hi,onPlay:H1});function Cm(){hi();for(const i of nt("#levelSelect").querySelectorAll("[data-complete]"))i.textContent=zh.has(Number(i.dataset.complete))?"COMPLETE ✓":"NOT YET COMPLETE";for(const i of nt("#levelSelect").querySelectorAll("[data-gate-best]")){const t=Tr[Number(i.dataset.gateBest)];i.textContent=t===void 0?"Best finish: — / 3 gates":`Best finish: ${Do(t)}/3 gates · ${Qp(t)}`,Uu(i,t??0)}ts(!0,"levels")}nt("#galleryButton").addEventListener("click",()=>Nn?Bl():Qt()?hi():zu());nt("#browseDemos").addEventListener("click",()=>{ci=!1,zu()});nt("#homeFromSettings").addEventListener("click",hi);nt("#homeFromGallery").addEventListener("click",hi);nt("#startCampaign").addEventListener("click",Cm);nt("#startInfinite").addEventListener("click",()=>{nt("#infiniteSeed").value=tm(),ts(!0,"infinite")});nt("#infiniteBack").addEventListener("click",hi);nt("#beginInfinite").addEventListener("click",()=>Fl(nt("#infiniteSeed").value,1));nt("#infiniteSeed").addEventListener("keydown",i=>{i.key==="Enter"&&Fl(i.currentTarget.value,1)});nt("#openEditor").addEventListener("click",Bl);nt("#levelsBack").addEventListener("click",hi);nt("#levelSelect").addEventListener("click",i=>{const t=i.target.closest("[data-campaign-level]");t&&Fu(Number(t.dataset.campaignLevel))});nt("#studyHome").addEventListener("click",zu);nt("#closeGallery").addEventListener("click",()=>_n.close());_n.addEventListener("close",()=>{Wo?hi():Pi&&Re==="paused"&&!$e&&!Xe&&tr(),Pi=!1,Wo=!1});nt("#demoGrid").addEventListener("click",i=>{const t=i.target.closest("[data-demo]");t&&(Pi=!1,Wo=!1,kh(t.dataset.demo),_n.close())});nt("#heroGravity").addEventListener("input",i=>{oi=Number(i.target.value),nt("#heroGravityValue").textContent=oi});function Df(){return{x:ct.position.x,y:ct.position.y,vx:ct.velocity.x,vy:ct.velocity.y}}function Qi(){if(!No.checked||mt.moons.length)return;const t=(xn==="maze"?Rw(Df(),re,zt,3,li,jt):{points:Sw(Df(),re,zt,5.5,li,7)}).points;xs.geometry.dispose(),xs.geometry=new _e().setFromPoints(t.map(e=>new H(e.x,e.y,0))),xs.computeLineDistances()}function J1(){const i={x:ct.position.x,y:ct.position.y,time:zt},t=n=>Au[(yi+n)%si],e=hn?t(hn-1):null;for((!e||zt-e.time>=1/30)&&(e&&Ru(e,i),hn===si&&(yi=(yi+1)%si,hn--),Object.assign(t(hn++),i));hn>1&&t(1).time<zt-20;)yi=(yi+1)%si,hn--;for(let n=1;n<hn;n++){const s=t(n-1),r=t(n),o=Math.hypot(r.x-s.x,r.y-s.y)||1,a=-(r.y-s.y)/o*.14,l=(r.x-s.x)/o*.14,c=(n-1)*18;hm.set([s.x-a,s.y-l,0,s.x+a,s.y+l,0,r.x-a,r.y-l,0,s.x+a,s.y+l,0,r.x+a,r.y+l,0,r.x-a,r.y-l,0],c),dm.fill(Math.max(0,1-(zt-r.time)/20)**2,(n-1)*6,n*6)}ai.attributes.position.needsUpdate=!0,ai.attributes.intensity.needsUpdate=!0,ai.setDrawRange(0,Math.max(0,hn-1)*6)}function Q1(){for(const i of re){const t=Vr(i,zt)/i.lifetime,e=Bp(i,zt,li);i.disc.material.opacity=.13+e*.24,i.inner.material.opacity=.25+e*.6,i.outer.material.opacity=.1+e*.4,i.field.material.opacity=.04+e*.19,i.outer.scale.setScalar(1+(1-t)*.13);const n=Math.max(1,Math.round(t*72)),s=Array.from({length:n+1},(o,a)=>{const l=Math.PI/2-a/72*Math.PI*2;return new H(Math.cos(l)*.76,Math.sin(l)*.76,0)});i.timer.geometry.dispose(),i.timer.geometry=new _e().setFromPoints(s);const r=Su.querySelector(`[data-well-time="${i.id}"]`);r&&(r.textContent=`${Vr(i,zt).toFixed(1)}s`)}}function Yr(){Jr();const i=$e?"FINISHED":Xe?"LOST":Re==="ready"?"READY":nn?"PAUSED":"IN FLIGHT";nt("#stateLabel").textContent=i,nt("#speed").textContent=`${Math.hypot(ct.velocity.x,ct.velocity.y).toFixed(2)} u/s`}function ws(){const i=Xr.clientWidth,t=Xr.clientHeight,e=i/t,n=Qt()||mt.id==="wideworld"?Qw(e):xn==="maze"?Jw(mt.level.bounds,e):{width:Math.max(21,16*e),height:Math.max(21,16*e)/e},s=n.width,r=n.height;ie.left=-s/2,ie.right=s/2,ie.top=r/2,ie.bottom=-r/2,ie.updateProjectionMatrix();const o=jt.bounds;Tu(Math.max(ie.right+2,Math.abs(o.minX)+2,Math.abs(o.maxX)+2),Math.max(ie.top+2,Math.abs(o.minY)+2,Math.abs(o.maxY)+2)),ku(0,!0),Fe.setSize(i,t),Fe.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),Dl.uniforms.pixelRatio.value=Fe.getPixelRatio()}function ku(i,t=!1){if(Uo.position.x=0,Uo.position.y=0,!Qt()&&mt.id!=="wideworld"){ie.position.x=0,ie.position.y=0;return}const e=tE(ie.position,ct.position,ct.velocity,jt.bounds,{width:ie.right-ie.left,height:ie.top-ie.bottom},i,t);ie.position.x=e.x,ie.position.y=e.y,Qt()&&Tu(Math.abs(ie.position.x)+ie.right+3,Math.abs(ie.position.y)+ie.top+3)}function tT(){if(nl.classList.toggle("visible",Qt()||mt.id==="wideworld"),!Qt()&&mt.id!=="wideworld")return;const i=m1,t=nl.width,e=nl.height,n=jt.bounds,s=t/(n.maxX-n.minX),r=e/(n.maxY-n.minY),o=f=>(f-n.minX)*s,a=f=>(n.maxY-f)*r;i.clearRect(0,0,t,e),i.fillStyle="#07151f",i.fillRect(0,0,t,e),i.strokeStyle="#476877",i.lineWidth=2,i.strokeRect(1,1,t-2,e-2),i.fillStyle="#324b56";for(const f of jt.walls){const p=zp(f);i.beginPath(),i.moveTo(o(p[0].x),a(p[0].y));for(const x of p.slice(1))i.lineTo(o(x.x),a(x.y));i.closePath(),i.fill()}const l=(f,p,x,g)=>{i.beginPath(),i.arc(o(f),a(p),x,0,Math.PI*2),i.fillStyle=g,i.fill()};if(l(jt.goal.x,jt.goal.y,6,"#a994ff"),Qt())for(const f of mt.soundGates)l(f.x,f.y,4,(Ye==null?void 0:Ye.mask)&1<<f.id?"#6d8993":vu[f.id]);for(const f of(ce==null?void 0:ce.pickups)||[])l(f.x,f.y,3,"#ffd58e");if(he){for(const f of mt.entities)if(f.type!=="soundGate"){const p=he.items[f.id];if(p.used)continue;l(p.x,p.y,f.type==="ember"?Math.max(3,f.radius*Math.min(s,r)):3,f.type==="ember"?"#e36d31":f.type==="portal"?"#76e9e3":f.type==="companion"?"#cdb7ff":f.type==="dimmer"?"#bfa5ff":"#ffd58e")}}for(const f of je)f.companionState&&l(f.body.position.x,f.body.position.y,2.5,"#cdb7ff");if(!he)for(const f of jt.dangers||[])i.beginPath(),i.arc(o(f.x),a(f.y),f.radius*Math.min(s,r),0,Math.PI*2),i.fillStyle="#e36d31",i.fill();for(const f of re)l(f.x,f.y,3.5,"#79d6ef");i.strokeStyle="#d6f9f0",i.lineWidth=1.5;const c=Math.max(n.minX,ie.position.x+ie.left),u=Math.min(n.maxX,ie.position.x+ie.right),h=Math.min(n.maxY,ie.position.y+ie.top),d=Math.max(n.minY,ie.position.y+ie.bottom);i.strokeRect(o(c),a(h),Math.max(0,u-c)*s,Math.max(0,h-d)*r),l(ct.position.x,ct.position.y,4,"#eafff5")}function Rm(i){const t=Fe.domElement.getBoundingClientRect(),e=(i.clientX-t.left)/t.width,n=(i.clientY-t.top)/t.height,s=e*2-1,r=1-n*2;return{x:ie.position.x+s*ie.right,y:ie.position.y+r*ie.top}}function eT(i){return re.find(t=>Math.hypot(t.x-i.x,t.y-i.y)<.9)}Fe.domElement.addEventListener("pointerdown",i=>{i.button!==0||ps||(gm=performance.now(),ps={id:i.pointerId,clientX:i.clientX,clientY:i.clientY})});Fe.domElement.addEventListener("pointercancel",i=>{(ps==null?void 0:ps.id)===i.pointerId&&(ps=null)});Fe.domElement.addEventListener("pointerup",i=>{const t=ps;if(ps=null,i.button!==0||!t||t.id!==i.pointerId||Math.hypot(i.clientX-t.clientX,i.clientY-t.clientY)>15||performance.now()-gm>600)return;const e=Rm(i);k1(e.x,e.y)});Fe.domElement.addEventListener("contextmenu",i=>{i.preventDefault();const t=eT(Rm(i));t&&Zs(t.id)});Su.addEventListener("click",i=>{const t=i.target.closest("[data-remove]");t&&Zs(Number(t.dataset.remove))});an.addEventListener("input",()=>{nt("#strengthValue").textContent=an.value;for(const i of re)i.strength=Number(an.value);Qi()});vn.addEventListener("input",()=>{nt("#lifetimeValue").textContent=`${Number(vn.value).toFixed(1)}s`});nt(".segmented").addEventListener("click",i=>{const t=i.target.closest("[data-mode]");if(t){li=t.dataset.mode;for(const e of nt(".segmented").children)e.classList.toggle("selected",e===t);nt("#modeHelp").textContent=li==="fade"?"Pull weakens over the last 20% of a well’s life.":"Pull stays full strength, then vanishes instantly.",Qi()}});nt("#release").addEventListener("click",Sm);No.addEventListener("change",()=>{xs.visible=No.checked,Qi()});nt("#settingsButton").addEventListener("click",()=>{ci=Re==="running",ci&&tr(),yn.showModal()});nt("#closeSettings").addEventListener("click",()=>yn.close());yn.addEventListener("close",()=>{ci&&Re==="paused"&&!Xe&&!$e&&tr(),ci=!1});nt("#restart").addEventListener("click",()=>{Qt()?Rr("manual"):es()});nt("#driftRestart").addEventListener("click",es);nt("#driftHome").addEventListener("click",hi);nt("#winRestart").addEventListener("click",()=>{if(sn&&$e)Fl($i,ji+1);else if(jn&&$e&&!Nn){const i=RE($s);i?Fu(i.id):Cm()}else es()});nt("#winEditor").addEventListener("click",Bl);nt("#editInfinite").addEventListener("click",()=>{sn&&xe.loadDocument(mt.document)&&Bl()});nt("#copyInfinite").addEventListener("click",async()=>{if(!sn)return;const i=new URL(location.href);i.searchParams.delete("demo"),i.searchParams.delete("campaign"),i.searchParams.set("infinite",$i),i.searchParams.set("stage",String(ji));try{await navigator.clipboard.writeText(i.href),nt("#copyInfinite").textContent="Copied ✓"}catch{nt("#infiniteResult").textContent=i.href,nt("#infiniteResult").tabIndex=0,nt("#infiniteResult").focus(),nt("#copyInfinite").textContent="Select link above"}});nt("#winHome").addEventListener("click",hi);vo.addEventListener("click",()=>{Re!=="ready"&&tr()});nt("#soundEnabled").addEventListener("change",i=>ne.setEnabled(i.target.checked));document.addEventListener("pointerdown",()=>ne.unlock(),{capture:!0});document.addEventListener("keydown",()=>ne.unlock(),{capture:!0});document.addEventListener("visibilitychange",()=>{var i;document.hidden&&(ne.stopHeartbeat(),(i=ne.context)==null||i.suspend().catch(()=>{})),Go=performance.now(),ks=0});function nT(){yn.open||_n.open||En||xe!=null&&xe.open||$e||Xe||(he!=null&&he.held?yu(he,ct,zt):Ke.held?Ke.release(ct):re.length&&Zs(re[0].id))}function Jr(){const i=Uf({state:Re,held:!!(Ke.held||he!=null&&he.held),wellCount:re.length}),t=nt("#primaryAction");t.textContent=i.label,t.disabled=i.disabled||yn.open||_n.open||En||(xe==null?void 0:xe.open),vo.disabled=En||!["running","paused"].includes(Re),nt("#restart").disabled=En||Qt()&&(Re==="ready"||$e||Xe),nt("#restart").textContent=Qt()?"✕":"↺",nt("#restart").setAttribute("aria-label",Qt()?"Die":"Restart"),nt("#restart").title=Qt()?"Die (R)":"Restart (R)",nt("#galleryButton").textContent=Nn?"▤":Qt()?"⌂":"⊞",nt("#galleryButton").setAttribute("aria-label",Nn?"Back to editor":Qt()?"Home":"Demo gallery"),nt("#galleryButton").title=Nn?"Back to editor":Qt()?"Home":"Demo gallery";const e=Re==="paused";vo.textContent=e?"▷":"Ⅱ",vo.setAttribute("aria-label",e?"Resume":"Pause"),vo.title=e?"Resume (P)":"Pause (P)"}function Pm(){if(yn.open||_n.open||En||xe!=null&&xe.open||$e||Xe)return;const i=Uf({state:Re,held:!!(Ke.held||he!=null&&he.held),wellCount:re.length});i.action==="start"||i.action==="resume"?tr():i.action==="release"?yu(he,ct,zt)||Ke.release(ct):i.action==="remove"&&Zs(re[0].id),Jr()}nt("#primaryAction").addEventListener("click",Pm);function tr(){Xe||$e||En||xe!=null&&xe.open||yn.open||_n.open||(nn=!nn,nn&&ne.stopHeartbeat(),Re=nn?"paused":"running",Jr(),Ms.textContent=nn?"PAUSED":"",Go=performance.now(),Yr())}window.addEventListener("keydown",i=>{if(yn.open||_n.open||En||xe!=null&&xe.open||i.target instanceof HTMLInputElement||i.target instanceof HTMLTextAreaElement)return;const t=i.key.toLowerCase();if(t===" "&&!$e&&!Xe){i.preventDefault(),i.repeat||Pm();return}i.repeat||(t==="p"&&Re!=="ready"&&(i.preventDefault(),tr()),t==="r"&&(Qt()?(Re==="running"||Re==="paused")&&Rr("manual"):es()),t==="e"&&nT(),t==="1"&&re[0]&&Zs(re[0].id),t==="2"&&re[1]&&Zs(re[1].id))});window.addEventListener("resize",ws);new ResizeObserver(ws).observe(Xr);var Nf;(Nf=window.visualViewport)==null||Nf.addEventListener("resize",ws);function Lm(i){var n;requestAnimationFrame(Lm);const t=Math.min((i-Go)/1e3,.05);if(Go=i,document.hidden){ks=0;return}if(!nn&&!Xe&&!$e){for(ks+=t;ks>=ze;){for(const l of re.filter(c=>Vr(c,zt)<=0))Zs(l.id);const s={x:ct.position.x,y:ct.position.y},r=xn==="maze"?du(ct.position,re,zt,li,jt):Wr(ct.position,re,zt,li);ct.applyForce(new b(r.x*ct.mass,r.y*ct.mass,0));const o={...r};if(he){const l=GE(ct.position,mt.entities,he);ct.applyForce(new b(l.x*ct.mass,l.y*ct.mass,0)),o.x+=l.x,o.y+=l.y}Y1(o),In.step(ze),jt.channel&&yw(ct.position,ct.velocity,jt.channel,Jt),$1();const a=Z1();if(ct.position.z=0,ct.velocity.z=0,xn==="maze"){uu(ct.velocity,Math.max(mt.mechanic==="boost"?16:kp,...(mt.entities||[]).filter(h=>h.type==="impulse").map(h=>h.speed)));const l=Ke.step(ct,s,zt,re,li,Rr);if(Xe)break;let c=null;if(he){const h=Qt()&&zt>=Ur&&Uh(je)?structuredClone(he):null;if(c=HE(he,mt.entities,s,ct,zt,ze,jt.bounds,{emberImmune:zt<Ur}),c.died){if(Qt()&&X1(s,c.fatalEmber)){h&&(he=h),zt+=ze,ks-=ze;continue}Rr("hazard");break}if(a.length){const d=kE(he,mt.entities,a,zt,ct.position);c.energyDelta+=d.energyDelta,d.collected&&c.tones.push("lightPickup")}for(const d of c.tones)ne.tone(d==="lightPickup"?587.33:d==="dimmer"?196:d==="portal"?330:440,0,.35,.08)}if(Ye){const h=UE(Ye,mt.soundGates,s,ct.position,zt);Ye=h.state;for(const d of h.acquired)ne.gateAcquire(d);for(const{id:d,beat:f}of h.beats)ne.gateBeat(d,f)}if((l==="teleport"||c!=null&&c.teleported)&&(hn&&Ru(Au[(yi+hn-1)%si],s),yi=0,hn=0,ai.setDrawRange(0,0),s.x=ct.position.x,s.y=ct.position.y),ce){const h=DE(ce,{before:s,hero:ct.position,collectors:a,dt:ze,time:zt,level:jt,config:mt.settings||Hn,extraEnergy:(c==null?void 0:c.energyDelta)||0,availableCompanions:je.filter(d=>{var f,p;return((f=d.companionState)==null?void 0:f.owned)&&!((p=d.heat)!=null&&p.burned)}).length});if(ce=h.state,h.consumedCompanion){const d=Uh(je);d&&Bu(d),ne.stopHeartbeat(),ne.tone(392,0,.22,.08),ne.tone(587.33,.16,.38,.06),Tm("MOON BOUGHT 4 SECONDS")}Ke.brightness=ce.energy*((he==null?void 0:he.eclipseMultiplier)??1),Be.minX=Math.min(Be.minX,ct.position.x),Be.maxX=Math.max(Be.maxX,ct.position.x),Be.minY=Math.min(Be.minY,ct.position.y),Be.maxY=Math.max(Be.maxY,ct.position.y),h.collected&&(ne.stopHeartbeat(),ne.tone(587.33,0,.35,.08));for(const d of h.heartbeat)ne.heartbeat(d.part,d.urgency);if(h.failed){Rr();break}}if(Je){const h=Kw(Je,{before:s,hero:ct.position,collectors:a,level:mt.level,dt:ze,time:zt});Je=h.state,Ke.brightness=Je.energy,h.collected&&ne.tone(587.33,0,.35,.08),h.gateChanged&&(Ou(Je.gateOpen),ne.tone(Je.gateOpen?523.25:196,0,.5,.08))}const u=Gp(s,ct.position,jt);if((u==null?void 0:u.type)==="spike"){Rr();break}if((n=c==null?void 0:c.companions)!=null&&n.length&&q1(c.companions),(u==null?void 0:u.type)==="goal"){G1();break}Qt()&&nm(ct.position,jt,mt.entities||[],he)&&(Ho={x:ct.position.x,y:ct.position.y})}zt+=ze,ks-=ze}J1(),xn==="maze"&&(nt("#runTime").textContent=`${zt.toFixed(1)}s`),Fc++,Fc%8===0&&Qi(),xn==="sandbox"&&(Math.abs(ct.position.x)>ie.right+1.5||Math.abs(ct.position.y)>ie.top+1.5)&&(ne.death(),Xe=!0,nn=!0,Re="dead",Yr(),Ll.classList.remove("hidden"))}ia.position.set(ct.position.x,ct.position.y,2),So>=0&&zt>=So&&(So=-1,Ms.classList.remove("moon-cue"),Re==="running"&&(Ms.textContent="")),Ci.position.set(ct.position.x,ct.position.y,1.1);const e=ne.orb(!En&&!(xe!=null&&xe.open)&&!_n.open&&!yn.open&&!Xe&&!$e&&!document.hidden,i/1e3,Ke.brightness);Jr(),Ci.intensity=85*Ke.brightness,il.material.transparent=!!ce,il.material.opacity=ce?.08+ce.energy*.92:1,il.scale.setScalar(1+e*.055),hs.scale.setScalar(2.3+e*.25),zt<Ur?(hs.scale.setScalar(3.1+e*.3),hs.material.color.setHex(13481983)):hs.material.color.setHex(16777215),hs.material.opacity=(.83+e*.17)*Math.min(1,Ke.brightness),!nn&&!Xe&&!$e&&w1(t),xn==="maze"&&P1(),xn==="maze"&&I1(),Ri.rotation.z+=t*.35,Du.material.opacity=.35+Math.sin(i*.002)*.1,Ke.updateVisuals(ct.position,zt,Ke.brightness,Fe.getPixelRatio()),O1(),Ye&&z1(),mt.mechanic==="sound"&&(nt("#demoObjective").textContent=`Cross rings to add rhythm · ${Ke.layers.size}/3 voices active${Ke.layers.size?" · "+["bass","offbeat","chime"].filter((s,r)=>Ke.layers.has(r)).join(" + "):" · cyan bass / violet offbeat / gold chime"}`),rm.update(ct.position,Ke.brightness),(Je||ce)&&(V1(),wm()),Ol(),j1(),Q1(),ku(t),tT(),ne.trail(!En&&!(xe!=null&&xe.open)&&!nn&&!Xe&&!$e&&!document.hidden,Math.hypot(ct.velocity.x,ct.velocity.y),zt-Mu),(Fc%12===0||nn||Xe)&&Yr(),Fe.render(Ge,ie)}bi.visible=!mt.sandbox;oa.visible=!!mt.sandbox;Ji.has("demo")?kh(mt.id):jn?Fu($s):sn?Fl($i,ji):(kh(mt.id),hi());requestAnimationFrame(Lm);
