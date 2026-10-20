(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();function Md({state:s,held:t=!1,wellCount:e=0}){return s==="ready"?{label:"Start",action:"start",disabled:!1}:s==="paused"?{label:"Resume",action:"resume",disabled:!1}:s!=="running"?{label:"Start",action:null,disabled:!0}:t?{label:"Release",action:"release",disabled:!1}:{label:"Remove well",action:e?"remove":null,disabled:!e}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Vc="180",up=0,Hh=1,dp=2,Sd=1,wd=2,gi=3,Vi=0,ln=1,Cn=2,zi=0,Js=1,_n=2,Vh=3,Wh=4,fp=5,as=100,pp=101,mp=102,gp=103,vp=104,xp=200,_p=201,yp=202,Mp=203,Vl=204,Wl=205,Sp=206,wp=207,Ep=208,bp=209,Tp=210,Ap=211,Cp=212,Rp=213,Pp=214,Xl=0,ql=1,Yl=2,ir=3,$l=4,jl=5,Zl=6,Kl=7,Ed=0,Lp=1,Ip=2,ki=0,Dp=1,Np=2,Up=3,bd=4,Fp=5,Op=6,Bp=7,Td=300,sr=301,rr=302,Jl=303,Ql=304,Ua=306,tc=1e3,us=1001,ec=1002,gn=1003,zp=1004,Ao=1005,Pn=1006,Ja=1007,ds=1008,ei=1009,Ad=1010,Cd=1011,Hr=1012,Wc=1013,gs=1014,yi=1015,ho=1016,Xc=1017,qc=1018,Vr=1020,Rd=35902,Pd=35899,Ld=1021,Id=1022,Gn=1023,Wr=1026,Xr=1027,Dd=1028,Yc=1029,Nd=1030,$c=1031,jc=1033,fa=33776,pa=33777,ma=33778,ga=33779,nc=35840,ic=35841,sc=35842,rc=35843,oc=36196,ac=37492,lc=37496,cc=37808,hc=37809,uc=37810,dc=37811,fc=37812,pc=37813,mc=37814,gc=37815,vc=37816,xc=37817,_c=37818,yc=37819,Mc=37820,Sc=37821,wc=36492,Ec=36494,bc=36495,Tc=36283,Ac=36284,Cc=36285,Rc=36286,kp=3200,Gp=3201,Ud=0,Hp=1,Oi="",an="srgb",or="srgb-linear",Sa="linear",fe="srgb",Rs=7680,Xh=519,Vp=512,Wp=513,Xp=514,Fd=515,qp=516,Yp=517,$p=518,jp=519,Pc=35044,Ci=35048,qh="300 es",Kn=2e3,wa=2001;class pr{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yh=1234567;const Qs=Math.PI/180,qr=180/Math.PI;function Jn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(je[s&255]+je[s>>8&255]+je[s>>16&255]+je[s>>24&255]+"-"+je[t&255]+je[t>>8&255]+"-"+je[t>>16&15|64]+je[t>>24&255]+"-"+je[e&63|128]+je[e>>8&255]+"-"+je[e>>16&255]+je[e>>24&255]+je[n&255]+je[n>>8&255]+je[n>>16&255]+je[n>>24&255]).toLowerCase()}function Zt(s,t,e){return Math.max(t,Math.min(e,s))}function Zc(s,t){return(s%t+t)%t}function Zp(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Kp(s,t,e){return s!==t?(e-s)/(t-s):0}function Br(s,t,e){return(1-e)*s+e*t}function Jp(s,t,e,n){return Br(s,t,1-Math.exp(-e*n))}function Qp(s,t=1){return t-Math.abs(Zc(s,t*2)-t)}function tm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function em(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function nm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function im(s,t){return s+Math.random()*(t-s)}function sm(s){return s*(.5-Math.random())}function rm(s){s!==void 0&&(Yh=s);let t=Yh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function om(s){return s*Qs}function am(s){return s*qr}function lm(s){return(s&s-1)===0&&s!==0}function cm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function hm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function um(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*d,l*u,a*c);break;case"YZY":s.set(l*u,a*h,l*d,a*c);break;case"ZXZ":s.set(l*d,l*u,a*h,a*c);break;case"XZX":s.set(a*h,l*m,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*m,a*c);break;case"ZYZ":s.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function kn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function he(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const dm={DEG2RAD:Qs,RAD2DEG:qr,generateUUID:Jn,clamp:Zt,euclideanModulo:Zc,mapLinear:Zp,inverseLerp:Kp,lerp:Br,damp:Jp,pingpong:Qp,smoothstep:tm,smootherstep:em,randInt:nm,randFloat:im,randFloatSpread:sm,seededRandom:rm,degToRad:om,radToDeg:am,isPowerOfTwo:lm,ceilPowerOfTwo:cm,floorPowerOfTwo:hm,setQuaternionFromProperEuler:um,normalize:he,denormalize:kn};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}let uo=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(d!==v||l!==u||c!==f||h!==m){let g=1-a;const p=l*u+c*f+h*m+d*v,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const T=Math.sqrt(y),A=Math.atan2(T,p*x);g=Math.sin(g*A)/T,a=Math.sin(a*A)/T}const _=a*x;if(l=l*g+u*_,c=c*g+f*_,h=h*g+m*_,d=d*g+v*_,g===1-a){const T=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=T,c*=T,h*=T,d*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*d+l*f-c*u,t[e+1]=l*m+h*u+c*d-a*f,t[e+2]=c*m+h*f+a*u-l*d,t[e+3]=h*m-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),m=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"YZX":this._x=u*h*d+c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d-u*f*m;break;case"XZY":this._x=u*h*d-c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d+u*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class N{constructor(t=0,e=0,n=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion($h.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion($h.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qa.copy(this).projectOnVector(t),this.sub(Qa)}reflect(t){return this.sub(Qa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qa=new N,$h=new uo;class Yt{constructor(t,e,n,i,r,o,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],v=i[0],g=i[3],p=i[6],x=i[1],y=i[4],_=i[7],T=i[2],A=i[5],R=i[8];return r[0]=o*v+a*x+l*T,r[3]=o*g+a*y+l*A,r[6]=o*p+a*_+l*R,r[1]=c*v+h*x+d*T,r[4]=c*g+h*y+d*A,r[7]=c*p+h*_+d*R,r[2]=u*v+f*x+m*T,r[5]=u*g+f*y+m*A,r[8]=u*p+f*_+m*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,m=e*d+n*u+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=d*v,t[1]=(i*c-h*n)*v,t[2]=(a*n-i*o)*v,t[3]=u*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(tl.makeScale(t,e)),this}rotate(t){return this.premultiply(tl.makeRotation(-t)),this}translate(t,e){return this.premultiply(tl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const tl=new Yt;function Od(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Ea(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function fm(){const s=Ea("canvas");return s.style.display="block",s}const jh={};function Yr(s){s in jh||(jh[s]=!0,console.warn(s))}function pm(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Zh=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kh=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mm(){const s={enabled:!0,workingColorSpace:or,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===fe&&(i.r=Ei(i.r),i.g=Ei(i.g),i.b=Ei(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===fe&&(i.r=tr(i.r),i.g=tr(i.g),i.b=tr(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Oi?Sa:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Yr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Yr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[or]:{primaries:t,whitePoint:n,transfer:Sa,toXYZ:Zh,fromXYZ:Kh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:t,whitePoint:n,transfer:fe,toXYZ:Zh,fromXYZ:Kh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:an}}}),s}const ae=mm();function Ei(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function tr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ps;class gm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ps===void 0&&(Ps=Ea("canvas")),Ps.width=t.width,Ps.height=t.height;const i=Ps.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ps}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ea("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ei(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ei(e[n]/255)*255):e[n]=Ei(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vm=0;class Kc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=Jn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(el(i[o].image)):r.push(el(i[o]))}else r=el(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function el(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?gm.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let xm=0;const nl=new N;class Qe extends pr{constructor(t=Qe.DEFAULT_IMAGE,e=Qe.DEFAULT_MAPPING,n=us,i=us,r=Pn,o=ds,a=Gn,l=ei,c=Qe.DEFAULT_ANISOTROPY,h=Oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Jn(),this.name="",this.source=new Kc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(nl).x}get height(){return this.source.getSize(nl).y}get depth(){return this.source.getSize(nl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Td)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case tc:t.x=t.x-Math.floor(t.x);break;case us:t.x=t.x<0?0:1;break;case ec:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case tc:t.y=t.y-Math.floor(t.y);break;case us:t.y=t.y<0?0:1;break;case ec:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Qe.DEFAULT_IMAGE=null;Qe.DEFAULT_MAPPING=Td;Qe.DEFAULT_ANISOTROPY=1;class ue{constructor(t=0,e=0,n=0,i=1){ue.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,_=(f+1)/2,T=(p+1)/2,A=(h+u)/4,R=(d+v)/4,I=(m+g)/4;return y>_&&y>T?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=A/n,r=R/n):_>T?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=A/i,r=I/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=R/r,i=I/r),this.set(n,i,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(d-v)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _m extends pr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);const i={width:t,height:e,depth:n.depth},r=new Qe(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Pn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new Kc(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vs extends _m{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Bd extends Qe{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=gn,this.minFilter=gn,this.wrapR=us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ym extends Qe{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=gn,this.minFilter=gn,this.wrapR=us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fo{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(t.matrixWorld),this.expandByPoint(Un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Co.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Co.copy(n.boundingBox)),Co.applyMatrix4(t.matrixWorld),this.union(Co)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Un),Un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Mr),Ro.subVectors(this.max,Mr),Ls.subVectors(t.a,Mr),Is.subVectors(t.b,Mr),Ds.subVectors(t.c,Mr),Pi.subVectors(Is,Ls),Li.subVectors(Ds,Is),Ji.subVectors(Ls,Ds);let e=[0,-Pi.z,Pi.y,0,-Li.z,Li.y,0,-Ji.z,Ji.y,Pi.z,0,-Pi.x,Li.z,0,-Li.x,Ji.z,0,-Ji.x,-Pi.y,Pi.x,0,-Li.y,Li.x,0,-Ji.y,Ji.x,0];return!il(e,Ls,Is,Ds,Ro)||(e=[1,0,0,0,1,0,0,0,1],!il(e,Ls,Is,Ds,Ro))?!1:(Po.crossVectors(Pi,Li),e=[Po.x,Po.y,Po.z],il(e,Ls,Is,Ds,Ro))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ai),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ai=[new N,new N,new N,new N,new N,new N,new N,new N],Un=new N,Co=new fo,Ls=new N,Is=new N,Ds=new N,Pi=new N,Li=new N,Ji=new N,Mr=new N,Ro=new N,Po=new N,Qi=new N;function il(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Qi.fromArray(s,r);const a=i.x*Math.abs(Qi.x)+i.y*Math.abs(Qi.y)+i.z*Math.abs(Qi.z),l=t.dot(Qi),c=e.dot(Qi),h=n.dot(Qi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Mm=new fo,Sr=new N,sl=new N;let po=class{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Mm.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Sr.subVectors(t,this.center);const e=Sr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Sr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(sl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Sr.copy(t.center).add(sl)),this.expandByPoint(Sr.copy(t.center).sub(sl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}};const li=new N,rl=new N,Lo=new N,Ii=new N,ol=new N,Io=new N,al=new N;let Jc=class{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(li.copy(this.origin).addScaledVector(this.direction,e),li.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){rl.copy(t).add(e).multiplyScalar(.5),Lo.copy(e).sub(t).normalize(),Ii.copy(this.origin).sub(rl);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Lo),a=Ii.dot(this.direction),l=-Ii.dot(Lo),c=Ii.lengthSq(),h=Math.abs(1-o*o);let d,u,f,m;if(h>0)if(d=o*l-a,u=o*a-l,m=r*h,d>=0)if(u>=-m)if(u<=m){const v=1/h;d*=v,u*=v,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(rl).addScaledVector(Lo,u),f}intersectSphere(t,e){li.subVectors(t.center,this.origin);const n=li.dot(this.direction),i=li.dot(li)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,li)!==null}intersectTriangle(t,e,n,i,r){ol.subVectors(e,t),Io.subVectors(n,t),al.crossVectors(ol,Io);let o=this.direction.dot(al),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ii.subVectors(this.origin,t);const l=a*this.direction.dot(Io.crossVectors(Ii,Io));if(l<0)return null;const c=a*this.direction.dot(ol.cross(Ii));if(c<0||l+c>o)return null;const h=-a*Ii.dot(al);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class Me{constructor(t,e,n,i,r,o,a,l,c,h,d,u,f,m,v,g){Me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,u,f,m,v,g)}set(t,e,n,i,r,o,a,l,c,h,d,u,f,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Ns.setFromMatrixColumn(t,0).length(),r=1/Ns.setFromMatrixColumn(t,1).length(),o=1/Ns.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,m=a*h,v=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+m*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u+v*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=v+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,m=c*h,v=c*d;e[0]=u-v*a,e[4]=-o*d,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=v-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,m=a*h,v=a*d;e[0]=l*h,e[4]=m*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=v-u*d,e[8]=m*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+m,e[10]=u-v*d}else if(t.order==="XZY"){const u=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=o*h,e[9]=f*d-m,e[2]=m*d-f,e[6]=a*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sm,t,wm)}lookAt(t,e,n){const i=this.elements;return un.subVectors(t,e),un.lengthSq()===0&&(un.z=1),un.normalize(),Di.crossVectors(n,un),Di.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),Di.crossVectors(n,un)),Di.normalize(),Do.crossVectors(un,Di),i[0]=Di.x,i[4]=Do.x,i[8]=un.x,i[1]=Di.y,i[5]=Do.y,i[9]=un.y,i[2]=Di.z,i[6]=Do.z,i[10]=un.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],x=n[3],y=n[7],_=n[11],T=n[15],A=i[0],R=i[4],I=i[8],b=i[12],w=i[1],P=i[5],k=i[9],D=i[13],B=i[2],F=i[6],U=i[10],Y=i[14],G=i[3],Z=i[7],dt=i[11],pt=i[15];return r[0]=o*A+a*w+l*B+c*G,r[4]=o*R+a*P+l*F+c*Z,r[8]=o*I+a*k+l*U+c*dt,r[12]=o*b+a*D+l*Y+c*pt,r[1]=h*A+d*w+u*B+f*G,r[5]=h*R+d*P+u*F+f*Z,r[9]=h*I+d*k+u*U+f*dt,r[13]=h*b+d*D+u*Y+f*pt,r[2]=m*A+v*w+g*B+p*G,r[6]=m*R+v*P+g*F+p*Z,r[10]=m*I+v*k+g*U+p*dt,r[14]=m*b+v*D+g*Y+p*pt,r[3]=x*A+y*w+_*B+T*G,r[7]=x*R+y*P+_*F+T*Z,r[11]=x*I+y*k+_*U+T*dt,r[15]=x*b+y*D+_*Y+T*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+r*l*d-i*c*d-r*a*u+n*c*u+i*a*f-n*l*f)+v*(+e*l*f-e*c*u+r*o*u-i*o*f+i*c*h-r*l*h)+g*(+e*c*d-e*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-e*l*d+e*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],x=d*g*c-v*u*c+v*l*f-a*g*f-d*l*p+a*u*p,y=m*u*c-h*g*c-m*l*f+o*g*f+h*l*p-o*u*p,_=h*v*c-m*d*c+m*a*f-o*v*f-h*a*p+o*d*p,T=m*d*l-h*v*l-m*a*u+o*v*u+h*a*g-o*d*g,A=e*x+n*y+i*_+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=x*R,t[1]=(v*u*r-d*g*r-v*i*f+n*g*f+d*i*p-n*u*p)*R,t[2]=(a*g*r-v*l*r+v*i*c-n*g*c-a*i*p+n*l*p)*R,t[3]=(d*l*r-a*u*r-d*i*c+n*u*c+a*i*f-n*l*f)*R,t[4]=y*R,t[5]=(h*g*r-m*u*r+m*i*f-e*g*f-h*i*p+e*u*p)*R,t[6]=(m*l*r-o*g*r-m*i*c+e*g*c+o*i*p-e*l*p)*R,t[7]=(o*u*r-h*l*r+h*i*c-e*u*c-o*i*f+e*l*f)*R,t[8]=_*R,t[9]=(m*d*r-h*v*r-m*n*f+e*v*f+h*n*p-e*d*p)*R,t[10]=(o*v*r-m*a*r+m*n*c-e*v*c-o*n*p+e*a*p)*R,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*f-e*a*f)*R,t[12]=T*R,t[13]=(h*v*i-m*d*i+m*n*u-e*v*u-h*n*g+e*d*g)*R,t[14]=(m*a*i-o*v*i-m*n*l+e*v*l+o*n*g-e*a*g)*R,t[15]=(o*d*i-h*a*i+h*n*l-e*d*l-o*n*u+e*a*u)*R,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,m=r*d,v=o*h,g=o*d,p=a*d,x=l*c,y=l*h,_=l*d,T=n.x,A=n.y,R=n.z;return i[0]=(1-(v+p))*T,i[1]=(f+_)*T,i[2]=(m-y)*T,i[3]=0,i[4]=(f-_)*A,i[5]=(1-(u+p))*A,i[6]=(g+x)*A,i[7]=0,i[8]=(m+y)*R,i[9]=(g-x)*R,i[10]=(1-(u+v))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Ns.set(i[0],i[1],i[2]).length();const o=Ns.set(i[4],i[5],i[6]).length(),a=Ns.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Fn.copy(this);const c=1/r,h=1/o,d=1/a;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=d,Fn.elements[9]*=d,Fn.elements[10]*=d,e.setFromRotationMatrix(Fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Kn,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let m,v;if(l)m=r/(o-r),v=o*r/(o-r);else if(a===Kn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===wa)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Kn,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i);let m,v;if(l)m=1/(o-r),v=o/(o-r);else if(a===Kn)m=-2/(o-r),v=-(o+r)/(o-r);else if(a===wa)m=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ns=new N,Fn=new Me,Sm=new N(0,0,0),wm=new N(1,1,1),Di=new N,Do=new N,un=new N,Jh=new Me,Qh=new uo;class ni{constructor(t=0,e=0,n=0,i=ni.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Zt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Qh.setFromEuler(this),this.setFromQuaternion(Qh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ni.DEFAULT_ORDER="XYZ";class zd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Em=0;const tu=new N,Us=new uo,ci=new Me,No=new N,wr=new N,bm=new N,Tm=new uo,eu=new N(1,0,0),nu=new N(0,1,0),iu=new N(0,0,1),su={type:"added"},Am={type:"removed"},Fs={type:"childadded",child:null},ll={type:"childremoved",child:null};class $e extends pr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=Jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=$e.DEFAULT_UP.clone();const t=new N,e=new ni,n=new uo,i=new N(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Me},normalMatrix:{value:new Yt}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=$e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Us.setFromAxisAngle(t,e),this.quaternion.multiply(Us),this}rotateOnWorldAxis(t,e){return Us.setFromAxisAngle(t,e),this.quaternion.premultiply(Us),this}rotateX(t){return this.rotateOnAxis(eu,t)}rotateY(t){return this.rotateOnAxis(nu,t)}rotateZ(t){return this.rotateOnAxis(iu,t)}translateOnAxis(t,e){return tu.copy(t).applyQuaternion(this.quaternion),this.position.add(tu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eu,t)}translateY(t){return this.translateOnAxis(nu,t)}translateZ(t){return this.translateOnAxis(iu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?No.copy(t):No.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(wr,No,this.up):ci.lookAt(No,wr,this.up),this.quaternion.setFromRotationMatrix(ci),i&&(ci.extractRotation(i.matrixWorld),Us.setFromRotationMatrix(ci),this.quaternion.premultiply(Us.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(su),Fs.child=t,this.dispatchEvent(Fs),Fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Am),ll.child=t,this.dispatchEvent(ll),ll.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(su),Fs.child=t,this.dispatchEvent(Fs),Fs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,t,bm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,Tm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}$e.DEFAULT_UP=new N(0,1,0);$e.DEFAULT_MATRIX_AUTO_UPDATE=!0;$e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new N,hi=new N,cl=new N,ui=new N,Os=new N,Bs=new N,ru=new N,hl=new N,ul=new N,dl=new N,fl=new ue,pl=new ue,ml=new ue;class mn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),On.subVectors(t,e),i.cross(On);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){On.subVectors(i,e),hi.subVectors(n,e),cl.subVectors(t,e);const o=On.dot(On),a=On.dot(hi),l=On.dot(cl),c=hi.dot(hi),h=hi.dot(cl),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,m=(o*h-a*l)*u;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ui.x),l.addScaledVector(o,ui.y),l.addScaledVector(a,ui.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return fl.setScalar(0),pl.setScalar(0),ml.setScalar(0),fl.fromBufferAttribute(t,e),pl.fromBufferAttribute(t,n),ml.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(fl,r.x),o.addScaledVector(pl,r.y),o.addScaledVector(ml,r.z),o}static isFrontFacing(t,e,n,i){return On.subVectors(n,e),hi.subVectors(t,e),On.cross(hi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),On.cross(hi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;Os.subVectors(i,n),Bs.subVectors(r,n),hl.subVectors(t,n);const l=Os.dot(hl),c=Bs.dot(hl);if(l<=0&&c<=0)return e.copy(n);ul.subVectors(t,i);const h=Os.dot(ul),d=Bs.dot(ul);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Os,o);dl.subVectors(t,r);const f=Os.dot(dl),m=Bs.dot(dl);if(m>=0&&f<=m)return e.copy(r);const v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(Bs,a);const g=h*m-f*d;if(g<=0&&d-h>=0&&f-m>=0)return ru.subVectors(r,i),a=(d-h)/(d-h+(f-m)),e.copy(i).addScaledVector(ru,a);const p=1/(g+v+u);return o=v*p,a=u*p,e.copy(n).addScaledVector(Os,o).addScaledVector(Bs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ni={h:0,s:0,l:0},Uo={h:0,s:0,l:0};function gl(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class te{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=an){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ae.workingColorSpace){if(t=Zc(t,1),e=Zt(e,0,1),n=Zt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=gl(o,r,t+1/3),this.g=gl(o,r,t),this.b=gl(o,r,t-1/3)}return ae.colorSpaceToWorking(this,i),this}setStyle(t,e=an){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=an){const n=kd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}copyLinearToSRGB(t){return this.r=tr(t.r),this.g=tr(t.g),this.b=tr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=an){return ae.workingToColorSpace(Ze.copy(this),t),Math.round(Zt(Ze.r*255,0,255))*65536+Math.round(Zt(Ze.g*255,0,255))*256+Math.round(Zt(Ze.b*255,0,255))}getHexString(t=an){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace(Ze.copy(this),e);const n=Ze.r,i=Ze.g,r=Ze.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace(Ze.copy(this),e),t.r=Ze.r,t.g=Ze.g,t.b=Ze.b,t}getStyle(t=an){ae.workingToColorSpace(Ze.copy(this),t);const e=Ze.r,n=Ze.g,i=Ze.b;return t!==an?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ni),this.setHSL(Ni.h+t,Ni.s+e,Ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ni),t.getHSL(Uo);const n=Br(Ni.h,Uo.h,e),i=Br(Ni.s,Uo.s,e),r=Br(Ni.l,Uo.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ze=new te;te.NAMES=kd;let Cm=0,$i=class extends pr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Jn(),this.name="",this.type="Material",this.blending=Js,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vl,this.blendDst=Wl,this.blendEquation=as,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new te(0,0,0),this.blendAlpha=0,this.depthFunc=ir,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rs,this.stencilZFail=Rs,this.stencilZPass=Rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Js&&(n.blending=this.blending),this.side!==Vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vl&&(n.blendSrc=this.blendSrc),this.blendDst!==Wl&&(n.blendDst=this.blendDst),this.blendEquation!==as&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ir&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Xh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Rs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Rs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};class Ye extends $i{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const De=new N,Fo=new ht;let Rm=0;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Rm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Pc,this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fo.fromBufferAttribute(this,e),Fo.applyMatrix3(t),this.setXY(e,Fo.x,Fo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyMatrix3(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyMatrix4(t),this.setXYZ(e,De.x,De.y,De.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.applyNormalMatrix(t),this.setXYZ(e,De.x,De.y,De.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)De.fromBufferAttribute(this,e),De.transformDirection(t),this.setXYZ(e,De.x,De.y,De.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=he(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=kn(e,this.array)),e}setX(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=kn(e,this.array)),e}setY(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=kn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=kn(e,this.array)),e}setW(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array),r=he(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Pc&&(t.usage=this.usage),t}}class Gd extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Hd extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Ee extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Pm=0;const bn=new Me,vl=new $e,zs=new N,dn=new fo,Er=new fo,We=new N;class ve extends pr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=Jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Od(t)?Hd:Gd)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return bn.makeRotationFromQuaternion(t),this.applyMatrix4(bn),this}rotateX(t){return bn.makeRotationX(t),this.applyMatrix4(bn),this}rotateY(t){return bn.makeRotationY(t),this.applyMatrix4(bn),this}rotateZ(t){return bn.makeRotationZ(t),this.applyMatrix4(bn),this}translate(t,e,n){return bn.makeTranslation(t,e,n),this.applyMatrix4(bn),this}scale(t,e,n){return bn.makeScale(t,e,n),this.applyMatrix4(bn),this}lookAt(t){return vl.lookAt(t),vl.updateMatrix(),this.applyMatrix4(vl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ee(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new po);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Er.setFromBufferAttribute(a),this.morphTargetsRelative?(We.addVectors(dn.min,Er.min),dn.expandByPoint(We),We.addVectors(dn.max,Er.max),dn.expandByPoint(We)):(dn.expandByPoint(Er.min),dn.expandByPoint(Er.max))}dn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)We.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(We));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)We.fromBufferAttribute(a,c),l&&(zs.fromBufferAttribute(t,c),We.add(zs)),i=Math.max(i,n.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let I=0;I<n.count;I++)a[I]=new N,l[I]=new N;const c=new N,h=new N,d=new N,u=new ht,f=new ht,m=new ht,v=new N,g=new N;function p(I,b,w){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,w),u.fromBufferAttribute(r,I),f.fromBufferAttribute(r,b),m.fromBufferAttribute(r,w),h.sub(c),d.sub(c),f.sub(u),m.sub(u);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(P),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),a[I].add(v),a[b].add(v),a[w].add(v),l[I].add(g),l[b].add(g),l[w].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let I=0,b=x.length;I<b;++I){const w=x[I],P=w.start,k=w.count;for(let D=P,B=P+k;D<B;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new N,_=new N,T=new N,A=new N;function R(I){T.fromBufferAttribute(i,I),A.copy(T);const b=a[I];y.copy(b),y.sub(T.multiplyScalar(T.dot(b))).normalize(),_.crossVectors(A,b);const P=_.dot(l[I])<0?-1:1;o.setXYZW(I,y.x,y.y,y.z,P)}for(let I=0,b=x.length;I<b;++I){const w=x[I],P=w.start,k=w.count;for(let D=P,B=P+k;D<B;D+=3)R(t.getX(D+0)),R(t.getX(D+1)),R(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new N,r=new N,o=new N,a=new N,l=new N,c=new N,h=new N,d=new N;if(t)for(let u=0,f=t.count;u<f;u+=3){const m=t.getX(u+0),v=t.getX(u+1),g=t.getX(u+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)We.fromBufferAttribute(t,e),We.normalize(),t.setXYZ(e,We.x,We.y,We.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)u[m++]=c[f++]}return new Ce(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ve,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ou=new Me,ts=new Jc,Oo=new po,au=new N,Bo=new N,zo=new N,ko=new N,xl=new N,Go=new N,lu=new N,Ho=new N;class me extends $e{constructor(t=new ve,e=new Ye){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Go.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(xl.fromBufferAttribute(d,t),o?Go.addScaledVector(xl,h):Go.addScaledVector(xl.sub(e),h))}e.add(Go)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Oo.copy(n.boundingSphere),Oo.applyMatrix4(r),ts.copy(t.ray).recast(t.near),!(Oo.containsPoint(ts.origin)===!1&&(ts.intersectSphere(Oo,au)===null||ts.origin.distanceToSquared(au)>(t.far-t.near)**2))&&(ou.copy(r).invert(),ts.copy(t.ray).applyMatrix4(ou),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ts)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,T=y;_<T;_+=3){const A=a.getX(_),R=a.getX(_+1),I=a.getX(_+2);i=Vo(this,p,t,n,c,h,d,A,R,I),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{const m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const x=a.getX(g),y=a.getX(g+1),_=a.getX(g+2);i=Vo(this,o,t,n,c,h,d,x,y,_),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=u.length;m<v;m++){const g=u[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),y=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let _=x,T=y;_<T;_+=3){const A=_,R=_+1,I=_+2;i=Vo(this,p,t,n,c,h,d,A,R,I),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{const m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){const x=g,y=g+1,_=g+2;i=Vo(this,o,t,n,c,h,d,x,y,_),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}}function Lm(s,t,e,n,i,r,o,a){let l;if(t.side===ln?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===Vi,a),l===null)return null;Ho.copy(a),Ho.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ho);return c<e.near||c>e.far?null:{distance:c,point:Ho.clone(),object:s}}function Vo(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Bo),s.getVertexPosition(l,zo),s.getVertexPosition(c,ko);const h=Lm(s,t,e,n,Bo,zo,ko,lu);if(h){const d=new N;mn.getBarycoord(lu,Bo,zo,ko,d),i&&(h.uv=mn.getInterpolatedAttribute(i,a,l,c,d,new ht)),r&&(h.uv1=mn.getInterpolatedAttribute(r,a,l,c,d,new ht)),o&&(h.normal=mn.getInterpolatedAttribute(o,a,l,c,d,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new N,materialIndex:0};mn.getNormal(Bo,zo,ko,u.normal),h.face=u,h.barycoord=d}return h}class ws extends ve{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,i,o,2),m("x","z","y",1,-1,t,n,-e,i,o,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(d,2));function m(v,g,p,x,y,_,T,A,R,I,b){const w=_/R,P=T/I,k=_/2,D=T/2,B=A/2,F=R+1,U=I+1;let Y=0,G=0;const Z=new N;for(let dt=0;dt<U;dt++){const pt=dt*P-D;for(let ct=0;ct<F;ct++){const Xt=ct*w-k;Z[v]=Xt*x,Z[g]=pt*y,Z[p]=B,c.push(Z.x,Z.y,Z.z),Z[v]=0,Z[g]=0,Z[p]=A>0?1:-1,h.push(Z.x,Z.y,Z.z),d.push(ct/R),d.push(1-dt/I),Y+=1}}for(let dt=0;dt<I;dt++)for(let pt=0;pt<R;pt++){const ct=u+pt+F*dt,Xt=u+pt+F*(dt+1),ie=u+(pt+1)+F*(dt+1),Jt=u+(pt+1)+F*dt;l.push(ct,Xt,Jt),l.push(Xt,ie,Jt),G+=6}a.addGroup(f,G,b),f+=G,u+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ws(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ar(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function nn(s){const t={};for(let e=0;e<s.length;e++){const n=ar(s[e]);for(const i in n)t[i]=n[i]}return t}function Im(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Vd(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}const Dm={clone:ar,merge:nn};var Nm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Dn extends $i{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nm,this.fragmentShader=Um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ar(t.uniforms),this.uniformsGroups=Im(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Wd extends $e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ui=new N,cu=new ht,hu=new ht;class An extends Wd{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Qs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qr*2*Math.atan(Math.tan(Qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ui.x,Ui.y).multiplyScalar(-t/Ui.z),Ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ui.x,Ui.y).multiplyScalar(-t/Ui.z)}getViewSize(t,e){return this.getViewBounds(t,cu,hu),e.subVectors(hu,cu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Qs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ks=-90,Gs=1;class Fm extends $e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new An(ks,Gs,t,e);i.layers=this.layers,this.add(i);const r=new An(ks,Gs,t,e);r.layers=this.layers,this.add(r);const o=new An(ks,Gs,t,e);o.layers=this.layers,this.add(o);const a=new An(ks,Gs,t,e);a.layers=this.layers,this.add(a);const l=new An(ks,Gs,t,e);l.layers=this.layers,this.add(l);const c=new An(ks,Gs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===wa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Xd extends Qe{constructor(t=[],e=sr,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Om extends vs{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Xd(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ws(5,5,5),r=new Dn({name:"CubemapFromEquirect",uniforms:ar(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ln,blending:zi});r.uniforms.tEquirect.value=e;const o=new me(i,r),a=e.minFilter;return e.minFilter===ds&&(e.minFilter=Pn),new Fm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}class Ie extends $e{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Bm={type:"move"};class _l{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&u>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Bm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ie;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class zm extends $e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ni,this.environmentIntensity=1,this.environmentRotation=new ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class km{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Pc,this.updateRanges=[],this.version=0,this.uuid=Jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const en=new N;class ba{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=he(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=kn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=kn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=kn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=kn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array),r=he(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ba(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Es extends $i{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Hs;const br=new N,Vs=new N,Ws=new N,Xs=new ht,Tr=new ht,qd=new Me,Wo=new N,Ar=new N,Xo=new N,uu=new ht,yl=new ht,du=new ht;class mr extends $e{constructor(t=new Es){if(super(),this.isSprite=!0,this.type="Sprite",Hs===void 0){Hs=new ve;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new km(e,5);Hs.setIndex([0,1,2,0,2,3]),Hs.setAttribute("position",new ba(n,3,0,!1)),Hs.setAttribute("uv",new ba(n,2,3,!1))}this.geometry=Hs,this.material=t,this.center=new ht(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Vs.setFromMatrixScale(this.matrixWorld),qd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ws.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Vs.multiplyScalar(-Ws.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;qo(Wo.set(-.5,-.5,0),Ws,o,Vs,i,r),qo(Ar.set(.5,-.5,0),Ws,o,Vs,i,r),qo(Xo.set(.5,.5,0),Ws,o,Vs,i,r),uu.set(0,0),yl.set(1,0),du.set(1,1);let a=t.ray.intersectTriangle(Wo,Ar,Xo,!1,br);if(a===null&&(qo(Ar.set(-.5,.5,0),Ws,o,Vs,i,r),yl.set(0,1),a=t.ray.intersectTriangle(Wo,Xo,Ar,!1,br),a===null))return;const l=t.ray.origin.distanceTo(br);l<t.near||l>t.far||e.push({distance:l,point:br.clone(),uv:mn.getInterpolation(br,Wo,Ar,Xo,uu,yl,du,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function qo(s,t,e,n,i,r){Xs.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Tr.x=r*Xs.x-i*Xs.y,Tr.y=i*Xs.x+r*Xs.y):Tr.copy(Xs),s.copy(t),s.x+=Tr.x,s.y+=Tr.y,s.applyMatrix4(qd)}class Gm extends Qe{constructor(t=null,e=1,n=1,i,r,o,a,l,c=gn,h=gn,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ml=new N,Hm=new N,Vm=new Yt;class rs{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Ml.subVectors(n,e).cross(Hm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ml),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Vm.getNormalMatrix(t),i=this.coplanarPoint(Ml).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const es=new po,Wm=new ht(.5,.5),Yo=new N;class Qc{constructor(t=new rs,e=new rs,n=new rs,i=new rs,r=new rs,o=new rs){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Kn,n=!1){const i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],v=r[9],g=r[10],p=r[11],x=r[12],y=r[13],_=r[14],T=r[15];if(i[0].setComponents(c-o,f-h,p-m,T-x).normalize(),i[1].setComponents(c+o,f+h,p+m,T+x).normalize(),i[2].setComponents(c+a,f+d,p+v,T+y).normalize(),i[3].setComponents(c-a,f-d,p-v,T-y).normalize(),n)i[4].setComponents(l,u,g,_).normalize(),i[5].setComponents(c-l,f-u,p-g,T-_).normalize();else if(i[4].setComponents(c-l,f-u,p-g,T-_).normalize(),e===Kn)i[5].setComponents(c+l,f+u,p+g,T+_).normalize();else if(e===wa)i[5].setComponents(l,u,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(t){es.center.set(0,0,0);const e=Wm.distanceTo(t.center);return es.radius=.7071067811865476+e,es.applyMatrix4(t.matrixWorld),this.intersectsSphere(es)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Yo.x=i.normal.x>0?t.max.x:t.min.x,Yo.y=i.normal.y>0?t.max.y:t.min.y,Yo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Yo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class vn extends $i{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ta=new N,Aa=new N,fu=new Me,Cr=new Jc,$o=new po,Sl=new N,pu=new N;class mo extends $e{constructor(t=new ve,e=new vn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)Ta.fromBufferAttribute(e,i-1),Aa.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=Ta.distanceTo(Aa);t.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$o.copy(n.boundingSphere),$o.applyMatrix4(i),$o.radius+=r,t.ray.intersectsSphere($o)===!1)return;fu.copy(i).invert(),Cr.copy(t.ray).applyMatrix4(fu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){const p=h.getX(v),x=h.getX(v+1),y=jo(this,t,Cr,l,p,x,v);y&&e.push(y)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(f),p=jo(this,t,Cr,l,v,g,m-1);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){const p=jo(this,t,Cr,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=jo(this,t,Cr,l,m-1,f,m-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function jo(s,t,e,n,i,r,o){const a=s.geometry.attributes.position;if(Ta.fromBufferAttribute(a,i),Aa.fromBufferAttribute(a,r),e.distanceSqToSegment(Ta,Aa,Sl,pu)>n)return;Sl.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Sl);if(!(c<t.near||c>t.far))return{distance:c,point:pu.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const mu=new N,gu=new N;class Xm extends mo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)mu.fromBufferAttribute(e,i),gu.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+mu.distanceTo(gu);t.setAttribute("lineDistance",new Ee(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qm extends $i{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const vu=new Me,Lc=new Jc,Zo=new po,Ko=new N;class Fa extends $e{constructor(t=new ve,e=new qm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zo.copy(n.boundingSphere),Zo.applyMatrix4(i),Zo.radius+=r,t.ray.intersectsSphere(Zo)===!1)return;vu.copy(i).invert(),Lc.copy(t.ray).applyMatrix4(vu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=u,v=f;m<v;m++){const g=c.getX(m);Ko.fromBufferAttribute(d,g),xu(Ko,g,l,i,t,e,this)}}else{const u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let m=u,v=f;m<v;m++)Ko.fromBufferAttribute(d,m),xu(Ko,m,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function xu(s,t,e,n,i,r,o){const a=Lc.distanceSqToPoint(s);if(a<e){const l=new N;Lc.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Oa extends Qe{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Yd extends Qe{constructor(t,e,n=gs,i,r,o,a=gn,l=gn,c,h=Wr,d=1){if(h!==Wr&&h!==Xr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Kc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class $d extends Qe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Wi extends ve{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new N,h=new ht;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(a,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}const Jo=new N,Qo=new N,wl=new N,ta=new mn;class Ym extends ve{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(Qs*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:v,b:g,c:p}=ta;if(v.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),ta.getNormal(wl),d[0]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,d[1]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,d[2]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let x=0;x<3;x++){const y=(x+1)%3,_=d[x],T=d[y],A=ta[h[x]],R=ta[h[y]],I=`${_}_${T}`,b=`${T}_${_}`;b in u&&u[b]?(wl.dot(u[b].normal)<=r&&(f.push(A.x,A.y,A.z),f.push(R.x,R.y,R.z)),u[b]=null):I in u||(u[I]={index0:c[x],index1:c[y],normal:wl.clone()})}}for(const m in u)if(u[m]){const{index0:v,index1:g}=u[m];Jo.fromBufferAttribute(a,v),Qo.fromBufferAttribute(a,g),f.push(Jo.x,Jo.y,Jo.z),f.push(Qo.x,Qo.y,Qo.z)}this.setAttribute("position",new Ee(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ri{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);const h=n[i],u=n[i+1]-h,f=(o-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ht:new N);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new N,i=[],r=[],o=[],a=new N,l=new Me;for(let f=0;f<=t;f++){const m=f/t;i[f]=this.getTangentAt(m,new N)}r[0]=new N,o[0]=new N;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Zt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Zt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),o[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class th extends ri{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ht){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class $m extends th{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function eh(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,i(o,a,u,f)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const ea=new N,El=new eh,bl=new eh,Tl=new eh;class jm extends ri{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new N){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(ea.subVectors(i[0],i[1]).add(i[0]),c=ea);const d=i[a%r],u=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(ea.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=ea),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),El.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,m,v,g),bl.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,m,v,g),Tl.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(El.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),bl.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Tl.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(El.calc(l),bl.calc(l),Tl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new N().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function _u(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function Zm(s,t){const e=1-s;return e*e*t}function Km(s,t){return 2*(1-s)*s*t}function Jm(s,t){return s*s*t}function zr(s,t,e,n){return Zm(s,t)+Km(s,e)+Jm(s,n)}function Qm(s,t){const e=1-s;return e*e*e*t}function tg(s,t){const e=1-s;return 3*e*e*s*t}function eg(s,t){return 3*(1-s)*s*s*t}function ng(s,t){return s*s*s*t}function kr(s,t,e,n,i){return Qm(s,t)+tg(s,e)+eg(s,n)+ng(s,i)}class jd extends ri{constructor(t=new ht,e=new ht,n=new ht,i=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ht){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(kr(t,i.x,r.x,o.x,a.x),kr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ig extends ri{constructor(t=new N,e=new N,n=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new N){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(kr(t,i.x,r.x,o.x,a.x),kr(t,i.y,r.y,o.y,a.y),kr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Zd extends ri{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class sg extends ri{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kd extends ri{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(zr(t,i.x,r.x,o.x),zr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class rg extends ri{constructor(t=new N,e=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new N){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(zr(t,i.x,r.x,o.x),zr(t,i.y,r.y,o.y),zr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jd extends ri{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],d=i[o>i.length-3?i.length-1:o+2];return n.set(_u(a,l.x,c.x,h.x,d.x),_u(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ht().fromArray(i))}return this}}var Ic=Object.freeze({__proto__:null,ArcCurve:$m,CatmullRomCurve3:jm,CubicBezierCurve:jd,CubicBezierCurve3:ig,EllipseCurve:th,LineCurve:Zd,LineCurve3:sg,QuadraticBezierCurve:Kd,QuadraticBezierCurve3:rg,SplineCurve:Jd});class og extends ri{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ic[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new Ic[i.type]().fromJSON(i))}return this}}class yu extends og{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Zd(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new Kd(this.currentPoint.clone(),new ht(t,e),new ht(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){const a=new jd(this.currentPoint.clone(),new ht(t,e),new ht(n,i),new ht(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Jd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){const c=new th(t,e,n,i,r,o,a,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}let lr=class extends yu{constructor(t){super(t),this.uuid=Jn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new yu().fromJSON(i))}return this}};function ag(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=Qd(s,0,i,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=dg(s,t,r,e)),s.length>80*e){a=1/0,l=1/0;let h=-1/0,d=-1/0;for(let u=e;u<i;u+=e){const f=s[u],m=s[u+1];f<a&&(a=f),m<l&&(l=m),f>h&&(h=f),m>d&&(d=m)}c=Math.max(h-a,d-l),c=c!==0?32767/c:0}return $r(r,o,e,a,l,c,0),o}function Qd(s,t,e,n,i){let r;if(i===wg(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=Mu(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Mu(o/n|0,s[o],s[o+1],r);return r&&cr(r,r.next)&&(Zr(r),r=r.next),r}function xs(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(cr(e,e.next)||Ae(e.prev,e,e.next)===0)){if(Zr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function $r(s,t,e,n,i,r,o){if(!s)return;!o&&r&&vg(s,n,i,r);let a=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?cg(s,n,i,r):lg(s)){t.push(l.i,s.i,c.i),Zr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=hg(xs(s),t),$r(s,t,e,n,i,r,2)):o===2&&ug(s,t,e,n,i,r):$r(xs(s),t,e,n,i,r,1);break}}}function lg(s){const t=s.prev,e=s,n=s.next;if(Ae(t,e,n)>=0)return!1;const i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),d=Math.min(a,l,c),u=Math.max(i,r,o),f=Math.max(a,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=f&&Ur(i,a,r,l,o,c,m.x,m.y)&&Ae(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function cg(s,t,e,n){const i=s.prev,r=s,o=s.next;if(Ae(i,r,o)>=0)return!1;const a=i.x,l=r.x,c=o.x,h=i.y,d=r.y,u=o.y,f=Math.min(a,l,c),m=Math.min(h,d,u),v=Math.max(a,l,c),g=Math.max(h,d,u),p=Dc(f,m,t,e,n),x=Dc(v,g,t,e,n);let y=s.prevZ,_=s.nextZ;for(;y&&y.z>=p&&_&&_.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ur(a,h,l,d,c,u,y.x,y.y)&&Ae(y.prev,y,y.next)>=0||(y=y.prevZ,_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==i&&_!==o&&Ur(a,h,l,d,c,u,_.x,_.y)&&Ae(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ur(a,h,l,d,c,u,y.x,y.y)&&Ae(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;_&&_.z<=x;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==i&&_!==o&&Ur(a,h,l,d,c,u,_.x,_.y)&&Ae(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function hg(s,t){let e=s;do{const n=e.prev,i=e.next.next;!cr(n,i)&&ef(n,e,e.next,i)&&jr(n,i)&&jr(i,n)&&(t.push(n.i,e.i,i.i),Zr(e),Zr(e.next),e=s=i),e=e.next}while(e!==s);return xs(e)}function ug(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&yg(o,a)){let l=nf(o,a);o=xs(o,o.next),l=xs(l,l.next),$r(o,t,e,n,i,r,0),$r(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function dg(s,t,e,n){const i=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Qd(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(_g(c))}i.sort(fg);for(let r=0;r<i.length;r++)e=pg(i[r],e);return e}function fg(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function pg(s,t){const e=mg(s,t);if(!e)return t;const n=nf(e,s);return xs(n,n.next),xs(e,e.next)}function mg(s,t){let e=t;const n=s.x,i=s.y;let r=-1/0,o;if(cr(s,e))return e;do{if(cr(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const d=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&tf(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){const d=Math.abs(i-e.y)/(n-e.x);jr(e,s)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&gg(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function gg(s,t){return Ae(s.prev,s,t.prev)<0&&Ae(t.next,s,s.next)<0}function vg(s,t,e,n){let i=s;do i.z===0&&(i.z=Dc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,xg(i)}function xg(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Dc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function _g(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function tf(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Ur(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&tf(s,t,e,n,i,r,o,a)}function yg(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Mg(s,t)&&(jr(s,t)&&jr(t,s)&&Sg(s,t)&&(Ae(s.prev,s,t.prev)||Ae(s,t.prev,t))||cr(s,t)&&Ae(s.prev,s,s.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function cr(s,t){return s.x===t.x&&s.y===t.y}function ef(s,t,e,n){const i=ia(Ae(s,t,e)),r=ia(Ae(s,t,n)),o=ia(Ae(e,n,s)),a=ia(Ae(e,n,t));return!!(i!==r&&o!==a||i===0&&na(s,e,t)||r===0&&na(s,n,t)||o===0&&na(e,s,n)||a===0&&na(e,t,n))}function na(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ia(s){return s>0?1:s<0?-1:0}function Mg(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&ef(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function jr(s,t){return Ae(s.prev,s,s.next)<0?Ae(s,t,s.next)>=0&&Ae(s,s.prev,t)>=0:Ae(s,t,s.prev)<0||Ae(s,s.next,t)<0}function Sg(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function nf(s,t){const e=Nc(s.i,s.x,s.y),n=Nc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Mu(s,t,e,n){const i=Nc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Zr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Nc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wg(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class Eg{static triangulate(t,e,n=2){return ag(t,e,n)}}class Mi{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return Mi.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];Su(t),wu(n,t);let o=t.length;e.forEach(Su);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,wu(n,e[l]);const a=Eg.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function Su(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function wu(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class Ca extends ve{constructor(t=new lr([new ht(.5,.5),new ht(-.5,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new Ee(i,3)),this.setAttribute("uv",new Ee(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:bg;let y,_=!1,T,A,R,I;p&&(y=p.getSpacedPoints(h),_=!0,u=!1,T=p.computeFrenetFrames(h,!1),A=new N,R=new N,I=new N),u||(g=0,f=0,m=0,v=0);const b=a.extractPoints(c);let w=b.shape;const P=b.holes;if(!Mi.isClockWise(w)){w=w.reverse();for(let it=0,Q=P.length;it<Q;it++){const J=P[it];Mi.isClockWise(J)&&(P[it]=J.reverse())}}function D(it){const J=10000000000000001e-36;let K=it[0];for(let mt=1;mt<=it.length;mt++){const rt=mt%it.length,gt=it[rt],Vt=gt.x-K.x,Ht=gt.y-K.y,C=Vt*Vt+Ht*Ht,M=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(K.x),Math.abs(K.y)),V=J*M*M;if(C<=V){it.splice(rt,1),mt--;continue}K=gt}}D(w),P.forEach(D);const B=P.length,F=w;for(let it=0;it<B;it++){const Q=P[it];w=w.concat(Q)}function U(it,Q,J){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(Q,J)}const Y=w.length;function G(it,Q,J){let K,mt,rt;const gt=it.x-Q.x,Vt=it.y-Q.y,Ht=J.x-it.x,C=J.y-it.y,M=gt*gt+Vt*Vt,V=gt*C-Vt*Ht;if(Math.abs(V)>Number.EPSILON){const q=Math.sqrt(M),nt=Math.sqrt(Ht*Ht+C*C),$=Q.x-Vt/q,Dt=Q.y+gt/q,ft=J.x-C/nt,Pt=J.y+Ht/nt,Lt=((ft-$)*C-(Pt-Dt)*Ht)/(gt*C-Vt*Ht);K=$+gt*Lt-it.x,mt=Dt+Vt*Lt-it.y;const ot=K*K+mt*mt;if(ot<=2)return new ht(K,mt);rt=Math.sqrt(ot/2)}else{let q=!1;gt>Number.EPSILON?Ht>Number.EPSILON&&(q=!0):gt<-Number.EPSILON?Ht<-Number.EPSILON&&(q=!0):Math.sign(Vt)===Math.sign(C)&&(q=!0),q?(K=-Vt,mt=gt,rt=Math.sqrt(M)):(K=gt,mt=Vt,rt=Math.sqrt(M/2))}return new ht(K/rt,mt/rt)}const Z=[];for(let it=0,Q=F.length,J=Q-1,K=it+1;it<Q;it++,J++,K++)J===Q&&(J=0),K===Q&&(K=0),Z[it]=G(F[it],F[J],F[K]);const dt=[];let pt,ct=Z.concat();for(let it=0,Q=B;it<Q;it++){const J=P[it];pt=[];for(let K=0,mt=J.length,rt=mt-1,gt=K+1;K<mt;K++,rt++,gt++)rt===mt&&(rt=0),gt===mt&&(gt=0),pt[K]=G(J[K],J[rt],J[gt]);dt.push(pt),ct=ct.concat(pt)}let Xt;if(g===0)Xt=Mi.triangulateShape(F,P);else{const it=[],Q=[];for(let J=0;J<g;J++){const K=J/g,mt=f*Math.cos(K*Math.PI/2),rt=m*Math.sin(K*Math.PI/2)+v;for(let gt=0,Vt=F.length;gt<Vt;gt++){const Ht=U(F[gt],Z[gt],rt);Ut(Ht.x,Ht.y,-mt),K===0&&it.push(Ht)}for(let gt=0,Vt=B;gt<Vt;gt++){const Ht=P[gt];pt=dt[gt];const C=[];for(let M=0,V=Ht.length;M<V;M++){const q=U(Ht[M],pt[M],rt);Ut(q.x,q.y,-mt),K===0&&C.push(q)}K===0&&Q.push(C)}}Xt=Mi.triangulateShape(it,Q)}const ie=Xt.length,Jt=m+v;for(let it=0;it<Y;it++){const Q=u?U(w[it],ct[it],Jt):w[it];_?(R.copy(T.normals[0]).multiplyScalar(Q.x),A.copy(T.binormals[0]).multiplyScalar(Q.y),I.copy(y[0]).add(R).add(A),Ut(I.x,I.y,I.z)):Ut(Q.x,Q.y,0)}for(let it=1;it<=h;it++)for(let Q=0;Q<Y;Q++){const J=u?U(w[Q],ct[Q],Jt):w[Q];_?(R.copy(T.normals[it]).multiplyScalar(J.x),A.copy(T.binormals[it]).multiplyScalar(J.y),I.copy(y[it]).add(R).add(A),Ut(I.x,I.y,I.z)):Ut(J.x,J.y,d/h*it)}for(let it=g-1;it>=0;it--){const Q=it/g,J=f*Math.cos(Q*Math.PI/2),K=m*Math.sin(Q*Math.PI/2)+v;for(let mt=0,rt=F.length;mt<rt;mt++){const gt=U(F[mt],Z[mt],K);Ut(gt.x,gt.y,d+J)}for(let mt=0,rt=P.length;mt<rt;mt++){const gt=P[mt];pt=dt[mt];for(let Vt=0,Ht=gt.length;Vt<Ht;Vt++){const C=U(gt[Vt],pt[Vt],K);_?Ut(C.x,C.y+y[h-1].y,y[h-1].x+J):Ut(C.x,C.y,d+J)}}}j(),et();function j(){const it=i.length/3;if(u){let Q=0,J=Y*Q;for(let K=0;K<ie;K++){const mt=Xt[K];Rt(mt[2]+J,mt[1]+J,mt[0]+J)}Q=h+g*2,J=Y*Q;for(let K=0;K<ie;K++){const mt=Xt[K];Rt(mt[0]+J,mt[1]+J,mt[2]+J)}}else{for(let Q=0;Q<ie;Q++){const J=Xt[Q];Rt(J[2],J[1],J[0])}for(let Q=0;Q<ie;Q++){const J=Xt[Q];Rt(J[0]+Y*h,J[1]+Y*h,J[2]+Y*h)}}n.addGroup(it,i.length/3-it,0)}function et(){const it=i.length/3;let Q=0;bt(F,Q),Q+=F.length;for(let J=0,K=P.length;J<K;J++){const mt=P[J];bt(mt,Q),Q+=mt.length}n.addGroup(it,i.length/3-it,1)}function bt(it,Q){let J=it.length;for(;--J>=0;){const K=J;let mt=J-1;mt<0&&(mt=it.length-1);for(let rt=0,gt=h+g*2;rt<gt;rt++){const Vt=Y*rt,Ht=Y*(rt+1),C=Q+K+Vt,M=Q+mt+Vt,V=Q+mt+Ht,q=Q+K+Ht;ee(C,M,V,q)}}}function Ut(it,Q,J){l.push(it),l.push(Q),l.push(J)}function Rt(it,Q,J){xe(it),xe(Q),xe(J);const K=i.length/3,mt=x.generateTopUV(n,i,K-3,K-2,K-1);L(mt[0]),L(mt[1]),L(mt[2])}function ee(it,Q,J,K){xe(it),xe(Q),xe(K),xe(Q),xe(J),xe(K);const mt=i.length/3,rt=x.generateSideWallUV(n,i,mt-6,mt-3,mt-2,mt-1);L(rt[0]),L(rt[1]),L(rt[3]),L(rt[1]),L(rt[2]),L(rt[3])}function xe(it){i.push(l[it*3+0]),i.push(l[it*3+1]),i.push(l[it*3+2])}function L(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Tg(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Ic[i.type]().fromJSON(i)),new Ca(n,t.options)}}const bg={generateTopUV:function(s,t,e,n,i){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new ht(r,o),new ht(a,l),new ht(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[i*3],f=t[i*3+1],m=t[i*3+2],v=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ht(o,1-l),new ht(c,1-d),new ht(u,1-m),new ht(v,1-p)]:[new ht(a,1-l),new ht(h,1-d),new ht(f,1-m),new ht(g,1-p)]}};function Tg(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Xi extends ve{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const x=p*u-o;for(let y=0;y<c;y++){const _=y*d-r;m.push(_,-x,0),v.push(0,0,1),g.push(y/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){const y=x+c*p,_=x+c*(p+1),T=x+1+c*(p+1),A=x+1+c*p;f.push(y,_,A),f.push(_,T,A)}this.setIndex(f),this.setAttribute("position",new Ee(m,3)),this.setAttribute("normal",new Ee(v,3)),this.setAttribute("uv",new Ee(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xi(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ba extends ve{constructor(t=.5,e=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);const a=[],l=[],c=[],h=[];let d=t;const u=(e-t)/i,f=new N,m=new ht;for(let v=0;v<=i;v++){for(let g=0;g<=n;g++){const p=r+g/n*o;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}d+=u}for(let v=0;v<i;v++){const g=v*(n+1);for(let p=0;p<n;p++){const x=p+g,y=x,_=x+n+1,T=x+n+2,A=x+1;a.push(y,_,A),a.push(_,T,A)}}this.setIndex(a),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ba(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ra extends ve{constructor(t=new lr([new ht(0,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],r=[],o=[];let a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ee(i,3)),this.setAttribute("normal",new Ee(r,3)),this.setAttribute("uv",new Ee(o,2));function c(h){const d=i.length/3,u=h.extractPoints(e);let f=u.shape;const m=u.holes;Mi.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const x=m[g];Mi.isClockWise(x)===!0&&(m[g]=x.reverse())}const v=Mi.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const x=m[g];f=f.concat(x)}for(let g=0,p=f.length;g<p;g++){const x=f[g];i.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let g=0,p=v.length;g<p;g++){const x=v[g],y=x[0]+d,_=x[1]+d,T=x[2]+d;n.push(y,_,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Ag(e,t)}static fromJSON(t,e){const n=[];for(let i=0,r=t.shapes.length;i<r;i++){const o=e[t.shapes[i]];n.push(o)}return new Ra(n,t.curveSegments)}}function Ag(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){const i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}class gr extends ve{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new N,u=new N,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){const x=[],y=p/n;let _=0;p===0&&o===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let T=0;T<=e;T++){const A=T/e;d.x=-t*Math.cos(i+A*r)*Math.sin(o+y*a),d.y=t*Math.cos(o+y*a),d.z=t*Math.sin(i+A*r)*Math.sin(o+y*a),m.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),g.push(A+_,1-y),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const y=h[p][x+1],_=h[p][x],T=h[p+1][x],A=h[p+1][x+1];(p!==0||o>0)&&f.push(y,_,A),(p!==n-1||l<Math.PI)&&f.push(_,T,A)}this.setIndex(f),this.setAttribute("position",new Ee(m,3)),this.setAttribute("normal",new Ee(v,3)),this.setAttribute("uv",new Ee(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Cg extends $i{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ud,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Rg extends $i{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Pg extends $i{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class za extends vn{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class sf extends $e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new te(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const Al=new Me,Eu=new N,bu=new N;class Lg{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=ei,this.map=null,this.mapPass=null,this.matrix=new Me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qc,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Eu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Eu),bu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bu),e.updateMatrixWorld(),Al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Al,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Al)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Tu=new Me,Rr=new N,Cl=new N;class Ig extends Lg{constructor(){super(new An(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new ue(2,1,1,1),new ue(0,1,1,1),new ue(3,1,1,1),new ue(1,1,1,1),new ue(3,0,1,1),new ue(1,0,1,1)],this._cubeDirections=[new N(1,0,0),new N(-1,0,0),new N(0,0,1),new N(0,0,-1),new N(0,1,0),new N(0,-1,0)],this._cubeUps=[new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,1,0),new N(0,0,1),new N(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Rr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Rr),Cl.copy(n.position),Cl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Cl),n.updateMatrixWorld(),i.makeTranslation(-Rr.x,-Rr.y,-Rr.z),Tu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Tu,n.coordinateSystem,n.reversedDepth)}}class ka extends sf{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ig}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class rf extends Wd{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Dg extends sf{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ng extends An{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function Au(s,t,e,n){const i=Ug(n);switch(e){case Ld:return s*t;case Dd:return s*t/i.components*i.byteLength;case Yc:return s*t/i.components*i.byteLength;case Nd:return s*t*2/i.components*i.byteLength;case $c:return s*t*2/i.components*i.byteLength;case Id:return s*t*3/i.components*i.byteLength;case Gn:return s*t*4/i.components*i.byteLength;case jc:return s*t*4/i.components*i.byteLength;case fa:case pa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ma:case ga:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ic:case rc:return Math.max(s,16)*Math.max(t,8)/4;case nc:case sc:return Math.max(s,8)*Math.max(t,8)/2;case oc:case ac:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case lc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case cc:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case hc:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case uc:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case dc:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case fc:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case pc:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case mc:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case gc:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case vc:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case xc:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case _c:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case yc:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Mc:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Sc:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case wc:case Ec:case bc:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Tc:case Ac:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Cc:case Rc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Ug(s){switch(s){case ei:case Ad:return{byteLength:1,components:1};case Hr:case Cd:case ho:return{byteLength:2,components:1};case Xc:case qc:return{byteLength:2,components:4};case gs:case Wc:case yi:return{byteLength:4,components:1};case Rd:case Pd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Vc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Vc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function of(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Fg(s){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){const m=d[u],v=d[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){const v=d[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var Og=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bg=`#ifdef USE_ALPHAHASH
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
#endif`,zg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vg=`#ifdef USE_AOMAP
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
#endif`,Wg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xg=`#ifdef USE_BATCHING
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
#endif`,qg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$g=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Zg=`#ifdef USE_IRIDESCENCE
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
#endif`,Kg=`#ifdef USE_BUMPMAP
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
#endif`,Jg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Qg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ev=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,iv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ov=`#define PI 3.141592653589793
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
} // validated`,av=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lv=`vec3 transformedNormal = objectNormal;
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
#endif`,cv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fv="gl_FragColor = linearToOutputTexel( gl_FragColor );",pv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mv=`#ifdef USE_ENVMAP
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
#endif`,gv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,vv=`#ifdef USE_ENVMAP
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
#endif`,xv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_v=`#ifdef USE_ENVMAP
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
#endif`,yv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ev=`#ifdef USE_GRADIENTMAP
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
}`,bv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Av=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cv=`uniform bool receiveShadow;
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
#endif`,Rv=`#ifdef USE_ENVMAP
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
#endif`,Pv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Iv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Nv=`PhysicalMaterial material;
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
#endif`,Uv=`struct PhysicalMaterial {
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
}`,Fv=`
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
#endif`,Ov=`#if defined( RE_IndirectDiffuse )
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
#endif`,Bv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,qv=`#if defined( USE_POINTS_UV )
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
#endif`,Yv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$v=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jv=`#ifdef USE_MORPHTARGETS
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
#endif`,Qv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,e0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,r0=`#ifdef USE_NORMALMAP
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
#endif`,o0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,a0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,l0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,h0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,u0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,f0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,M0=`float getShadowMask() {
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
}`,S0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,w0=`#ifdef USE_SKINNING
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
#endif`,E0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,b0=`#ifdef USE_SKINNING
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
#endif`,T0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,C0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,R0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,P0=`#ifdef USE_TRANSMISSION
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
#endif`,L0=`#ifdef USE_TRANSMISSION
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
#endif`,I0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const F0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,O0=`uniform sampler2D t2D;
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
}`,B0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,z0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`#include <common>
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
}`,V0=`#if DEPTH_PACKING == 3200
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
}`,W0=`#define DISTANCE
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
}`,X0=`#define DISTANCE
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
}`,q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`uniform float scale;
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
}`,j0=`uniform vec3 diffuse;
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
}`,Z0=`#include <common>
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
}`,K0=`uniform vec3 diffuse;
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
}`,J0=`#define LAMBERT
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
}`,Q0=`#define LAMBERT
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
}`,tx=`#define MATCAP
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
}`,ex=`#define MATCAP
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
}`,nx=`#define NORMAL
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
}`,ix=`#define NORMAL
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
}`,sx=`#define PHONG
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
}`,rx=`#define PHONG
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
}`,ox=`#define STANDARD
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
}`,ax=`#define STANDARD
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
}`,lx=`#define TOON
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
}`,cx=`#define TOON
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
}`,hx=`uniform float size;
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
}`,ux=`uniform vec3 diffuse;
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
}`,dx=`#include <common>
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
}`,fx=`uniform vec3 color;
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
}`,px=`uniform float rotation;
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
}`,mx=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:Og,alphahash_pars_fragment:Bg,alphamap_fragment:zg,alphamap_pars_fragment:kg,alphatest_fragment:Gg,alphatest_pars_fragment:Hg,aomap_fragment:Vg,aomap_pars_fragment:Wg,batching_pars_vertex:Xg,batching_vertex:qg,begin_vertex:Yg,beginnormal_vertex:$g,bsdfs:jg,iridescence_fragment:Zg,bumpmap_pars_fragment:Kg,clipping_planes_fragment:Jg,clipping_planes_pars_fragment:Qg,clipping_planes_pars_vertex:tv,clipping_planes_vertex:ev,color_fragment:nv,color_pars_fragment:iv,color_pars_vertex:sv,color_vertex:rv,common:ov,cube_uv_reflection_fragment:av,defaultnormal_vertex:lv,displacementmap_pars_vertex:cv,displacementmap_vertex:hv,emissivemap_fragment:uv,emissivemap_pars_fragment:dv,colorspace_fragment:fv,colorspace_pars_fragment:pv,envmap_fragment:mv,envmap_common_pars_fragment:gv,envmap_pars_fragment:vv,envmap_pars_vertex:xv,envmap_physical_pars_fragment:Rv,envmap_vertex:_v,fog_vertex:yv,fog_pars_vertex:Mv,fog_fragment:Sv,fog_pars_fragment:wv,gradientmap_pars_fragment:Ev,lightmap_pars_fragment:bv,lights_lambert_fragment:Tv,lights_lambert_pars_fragment:Av,lights_pars_begin:Cv,lights_toon_fragment:Pv,lights_toon_pars_fragment:Lv,lights_phong_fragment:Iv,lights_phong_pars_fragment:Dv,lights_physical_fragment:Nv,lights_physical_pars_fragment:Uv,lights_fragment_begin:Fv,lights_fragment_maps:Ov,lights_fragment_end:Bv,logdepthbuf_fragment:zv,logdepthbuf_pars_fragment:kv,logdepthbuf_pars_vertex:Gv,logdepthbuf_vertex:Hv,map_fragment:Vv,map_pars_fragment:Wv,map_particle_fragment:Xv,map_particle_pars_fragment:qv,metalnessmap_fragment:Yv,metalnessmap_pars_fragment:$v,morphinstance_vertex:jv,morphcolor_vertex:Zv,morphnormal_vertex:Kv,morphtarget_pars_vertex:Jv,morphtarget_vertex:Qv,normal_fragment_begin:t0,normal_fragment_maps:e0,normal_pars_fragment:n0,normal_pars_vertex:i0,normal_vertex:s0,normalmap_pars_fragment:r0,clearcoat_normal_fragment_begin:o0,clearcoat_normal_fragment_maps:a0,clearcoat_pars_fragment:l0,iridescence_pars_fragment:c0,opaque_fragment:h0,packing:u0,premultiplied_alpha_fragment:d0,project_vertex:f0,dithering_fragment:p0,dithering_pars_fragment:m0,roughnessmap_fragment:g0,roughnessmap_pars_fragment:v0,shadowmap_pars_fragment:x0,shadowmap_pars_vertex:_0,shadowmap_vertex:y0,shadowmask_pars_fragment:M0,skinbase_vertex:S0,skinning_pars_vertex:w0,skinning_vertex:E0,skinnormal_vertex:b0,specularmap_fragment:T0,specularmap_pars_fragment:A0,tonemapping_fragment:C0,tonemapping_pars_fragment:R0,transmission_fragment:P0,transmission_pars_fragment:L0,uv_pars_fragment:I0,uv_pars_vertex:D0,uv_vertex:N0,worldpos_vertex:U0,background_vert:F0,background_frag:O0,backgroundCube_vert:B0,backgroundCube_frag:z0,cube_vert:k0,cube_frag:G0,depth_vert:H0,depth_frag:V0,distanceRGBA_vert:W0,distanceRGBA_frag:X0,equirect_vert:q0,equirect_frag:Y0,linedashed_vert:$0,linedashed_frag:j0,meshbasic_vert:Z0,meshbasic_frag:K0,meshlambert_vert:J0,meshlambert_frag:Q0,meshmatcap_vert:tx,meshmatcap_frag:ex,meshnormal_vert:nx,meshnormal_frag:ix,meshphong_vert:sx,meshphong_frag:rx,meshphysical_vert:ox,meshphysical_frag:ax,meshtoon_vert:lx,meshtoon_frag:cx,points_vert:hx,points_frag:ux,shadow_vert:dx,shadow_frag:fx,sprite_vert:px,sprite_frag:mx},xt={common:{diffuse:{value:new te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new te(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Zn={basic:{uniforms:nn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:nn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new te(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:nn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new te(0)},specular:{value:new te(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:nn([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:nn([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new te(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:nn([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:nn([xt.points,xt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:nn([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:nn([xt.common,xt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:nn([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:nn([xt.sprite,xt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:nn([xt.common,xt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:nn([xt.lights,xt.fog,{color:{value:new te(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Zn.physical={uniforms:nn([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new te(0)},specularColor:{value:new te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const sa={r:0,b:0,g:0},ns=new ni,gx=new Me;function vx(s,t,e,n,i,r,o){const a=new te(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function m(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?e:t).get(_)),_}function v(y){let _=!1;const T=m(y);T===null?p(a,l):T&&T.isColor&&(p(T,1),_=!0);const A=s.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function g(y,_){const T=m(_);T&&(T.isCubeTexture||T.mapping===Ua)?(h===void 0&&(h=new me(new ws(1,1,1),new Dn({name:"BackgroundCubeMaterial",uniforms:ar(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ns.copy(_.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(gx.makeRotationFromEuler(ns)),h.material.toneMapped=ae.getTransfer(T.colorSpace)!==fe,(d!==T||u!==T.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,d=T,u=T.version,f=s.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new me(new Xi(2,2),new Dn({name:"BackgroundMaterial",uniforms:ar(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ae.getTransfer(T.colorSpace)!==fe,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(d!==T||u!==T.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,d=T,u=T.version,f=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,_){y.getRGB(sa,Vd(s)),n.buffers.color.setClear(sa.r,sa.g,sa.b,_,o)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,_=1){a.set(y),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:v,addToRenderList:g,dispose:x}}function xx(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,o=!1;function a(w,P,k,D,B){let F=!1;const U=d(D,k,P);r!==U&&(r=U,c(r.object)),F=f(w,D,k,B),F&&m(w,D,k,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,_(w,P,k,D),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function c(w){return s.bindVertexArray(w)}function h(w){return s.deleteVertexArray(w)}function d(w,P,k){const D=k.wireframe===!0;let B=n[w.id];B===void 0&&(B={},n[w.id]=B);let F=B[P.id];F===void 0&&(F={},B[P.id]=F);let U=F[D];return U===void 0&&(U=u(l()),F[D]=U),U}function u(w){const P=[],k=[],D=[];for(let B=0;B<e;B++)P[B]=0,k[B]=0,D[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:D,object:w,attributes:{},index:null}}function f(w,P,k,D){const B=r.attributes,F=P.attributes;let U=0;const Y=k.getAttributes();for(const G in Y)if(Y[G].location>=0){const dt=B[G];let pt=F[G];if(pt===void 0&&(G==="instanceMatrix"&&w.instanceMatrix&&(pt=w.instanceMatrix),G==="instanceColor"&&w.instanceColor&&(pt=w.instanceColor)),dt===void 0||dt.attribute!==pt||pt&&dt.data!==pt.data)return!0;U++}return r.attributesNum!==U||r.index!==D}function m(w,P,k,D){const B={},F=P.attributes;let U=0;const Y=k.getAttributes();for(const G in Y)if(Y[G].location>=0){let dt=F[G];dt===void 0&&(G==="instanceMatrix"&&w.instanceMatrix&&(dt=w.instanceMatrix),G==="instanceColor"&&w.instanceColor&&(dt=w.instanceColor));const pt={};pt.attribute=dt,dt&&dt.data&&(pt.data=dt.data),B[G]=pt,U++}r.attributes=B,r.attributesNum=U,r.index=D}function v(){const w=r.newAttributes;for(let P=0,k=w.length;P<k;P++)w[P]=0}function g(w){p(w,0)}function p(w,P){const k=r.newAttributes,D=r.enabledAttributes,B=r.attributeDivisors;k[w]=1,D[w]===0&&(s.enableVertexAttribArray(w),D[w]=1),B[w]!==P&&(s.vertexAttribDivisor(w,P),B[w]=P)}function x(){const w=r.newAttributes,P=r.enabledAttributes;for(let k=0,D=P.length;k<D;k++)P[k]!==w[k]&&(s.disableVertexAttribArray(k),P[k]=0)}function y(w,P,k,D,B,F,U){U===!0?s.vertexAttribIPointer(w,P,k,B,F):s.vertexAttribPointer(w,P,k,D,B,F)}function _(w,P,k,D){v();const B=D.attributes,F=k.getAttributes(),U=P.defaultAttributeValues;for(const Y in F){const G=F[Y];if(G.location>=0){let Z=B[Y];if(Z===void 0&&(Y==="instanceMatrix"&&w.instanceMatrix&&(Z=w.instanceMatrix),Y==="instanceColor"&&w.instanceColor&&(Z=w.instanceColor)),Z!==void 0){const dt=Z.normalized,pt=Z.itemSize,ct=t.get(Z);if(ct===void 0)continue;const Xt=ct.buffer,ie=ct.type,Jt=ct.bytesPerElement,j=ie===s.INT||ie===s.UNSIGNED_INT||Z.gpuType===Wc;if(Z.isInterleavedBufferAttribute){const et=Z.data,bt=et.stride,Ut=Z.offset;if(et.isInstancedInterleavedBuffer){for(let Rt=0;Rt<G.locationSize;Rt++)p(G.location+Rt,et.meshPerAttribute);w.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Rt=0;Rt<G.locationSize;Rt++)g(G.location+Rt);s.bindBuffer(s.ARRAY_BUFFER,Xt);for(let Rt=0;Rt<G.locationSize;Rt++)y(G.location+Rt,pt/G.locationSize,ie,dt,bt*Jt,(Ut+pt/G.locationSize*Rt)*Jt,j)}else{if(Z.isInstancedBufferAttribute){for(let et=0;et<G.locationSize;et++)p(G.location+et,Z.meshPerAttribute);w.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let et=0;et<G.locationSize;et++)g(G.location+et);s.bindBuffer(s.ARRAY_BUFFER,Xt);for(let et=0;et<G.locationSize;et++)y(G.location+et,pt/G.locationSize,ie,dt,pt*Jt,pt/G.locationSize*et*Jt,j)}}else if(U!==void 0){const dt=U[Y];if(dt!==void 0)switch(dt.length){case 2:s.vertexAttrib2fv(G.location,dt);break;case 3:s.vertexAttrib3fv(G.location,dt);break;case 4:s.vertexAttrib4fv(G.location,dt);break;default:s.vertexAttrib1fv(G.location,dt)}}}}x()}function T(){I();for(const w in n){const P=n[w];for(const k in P){const D=P[k];for(const B in D)h(D[B].object),delete D[B];delete P[k]}delete n[w]}}function A(w){if(n[w.id]===void 0)return;const P=n[w.id];for(const k in P){const D=P[k];for(const B in D)h(D[B].object),delete D[B];delete P[k]}delete n[w.id]}function R(w){for(const P in n){const k=n[P];if(k[w.id]===void 0)continue;const D=k[w.id];for(const B in D)h(D[B].object),delete D[B];delete k[w.id]}}function I(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:I,resetDefaultState:b,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function _x(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let m=0;m<d;m++)f+=h[m];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],u[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let m=0;for(let v=0;v<d;v++)m+=h[v]*u[v];e.update(m,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function yx(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==Gn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const I=R===ho&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==ei&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==yi&&!I)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:_,vertexTextures:T,maxSamples:A}}function Mx(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new rs,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const m=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,p=s.get(d);if(!i||m===null||m.length===0||r&&!g)r?h(null):c();else{const x=r?0:n,y=x*4;let _=p.clippingState||null;l.value=_,_=h(m,u,y,f);for(let T=0;T!==y;++T)_[T]=e[T];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,m){const v=d!==null?d.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=f+v*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,_=f;y!==v;++y,_+=4)o.copy(d[y]).applyMatrix4(x,a),o.normal.toArray(g,_),g[_+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Sx(s){let t=new WeakMap;function e(o,a){return a===Jl?o.mapping=sr:a===Ql&&(o.mapping=rr),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Jl||a===Ql)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Om(l.height);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Zs=4,Cu=[.125,.215,.35,.446,.526,.582],ls=20,Rl=new rf,Ru=new te;let Pl=null,Ll=0,Il=0,Dl=!1;const os=(1+Math.sqrt(5))/2,qs=1/os,Pu=[new N(-os,qs,0),new N(os,qs,0),new N(-qs,0,os),new N(qs,0,os),new N(0,os,-qs),new N(0,os,qs),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],wx=new N;class Lu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){const{size:o=256,position:a=wx}=r;Pl=this._renderer.getRenderTarget(),Ll=this._renderer.getActiveCubeFace(),Il=this._renderer.getActiveMipmapLevel(),Dl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Du(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Pl,Ll,Il),this._renderer.xr.enabled=Dl,t.scissorTest=!1,ra(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===sr||t.mapping===rr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Pl=this._renderer.getRenderTarget(),Ll=this._renderer.getActiveCubeFace(),Il=this._renderer.getActiveMipmapLevel(),Dl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:ho,format:Gn,colorSpace:or,depthBuffer:!1},i=Iu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Iu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ex(r)),this._blurMaterial=bx(r,t,e)}return i}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,Rl)}_sceneToCubeUV(t,e,n,i,r){const l=new An(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Ru),d.toneMapping=ki,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null));const v=new Ye({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),g=new me(new ws,v);let p=!1;const x=t.background;x?x.isColor&&(v.color.copy(x),t.background=null,p=!0):(v.color.copy(Ru),p=!0);for(let y=0;y<6;y++){const _=y%3;_===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):_===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const T=this._cubeSize;ra(i,_*T,y>2?T:0,T,T),d.setRenderTarget(i),p&&d.render(g,l),d.render(t,l)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=f,d.autoClear=u,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===sr||t.mapping===rr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Du());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;ra(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Rl)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Pu[(i-r-1)%Pu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new me(this._lodPlanes[i],c),u=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ls-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):ls;g>ls&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ls}`);const p=[];let x=0;for(let R=0;R<ls;++R){const I=R/v,b=Math.exp(-I*I/2);p.push(b),R===0?x+=b:R<g&&(x+=2*b)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:y}=this;u.dTheta.value=m,u.mipInt.value=y-n;const _=this._sizeLods[i],T=3*_*(i>y-Zs?i-y+Zs:0),A=4*(this._cubeSize-_);ra(e,T,A,3*_,2*_),l.setRenderTarget(e),l.render(d,Rl)}}function Ex(s){const t=[],e=[],n=[];let i=s;const r=s-Zs+1+Cu.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>s-Zs?l=Cu[o-s+Zs-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,m=6,v=3,g=2,p=1,x=new Float32Array(v*m*f),y=new Float32Array(g*m*f),_=new Float32Array(p*m*f);for(let A=0;A<f;A++){const R=A%3*2/3-1,I=A>2?0:-1,b=[R,I,0,R+2/3,I,0,R+2/3,I+1,0,R,I,0,R+2/3,I+1,0,R,I+1,0];x.set(b,v*m*A),y.set(u,g*m*A);const w=[A,A,A,A,A,A];_.set(w,p*m*A)}const T=new ve;T.setAttribute("position",new Ce(x,v)),T.setAttribute("uv",new Ce(y,g)),T.setAttribute("faceIndex",new Ce(_,p)),t.push(T),i>Zs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Iu(s,t,e){const n=new vs(s,t,e);return n.texture.mapping=Ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ra(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function bx(s,t,e){const n=new Float32Array(ls),i=new N(0,1,0);return new Dn({name:"SphericalGaussianBlur",defines:{n:ls,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:nh(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Du(){return new Dn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nh(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Nu(){return new Dn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function nh(){return`

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
	`}function Tx(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Jl||l===Ql,h=l===sr||l===rr;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new Lu(s)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new Lu(s)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Ax(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Yr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Cx(s,t,e,n){const i={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete i[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],s.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,m=d.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let y=0,_=x.length;y<_;y+=3){const T=x[y+0],A=x[y+1],R=x[y+2];u.push(T,A,A,R,R,T)}}else if(m!==void 0){const x=m.array;v=m.version;for(let y=0,_=x.length/3-1;y<_;y+=3){const T=y+0,A=y+1,R=y+2;u.push(T,A,A,R,R,T)}}else return;const g=new(Od(u)?Hd:Gd)(u,1);g.version=v;const p=r.get(d);p&&t.remove(p),r.set(d,g)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Rx(s,t,e){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){s.drawElements(n,f,r,u*o),e.update(f,n,1)}function c(u,f,m){m!==0&&(s.drawElementsInstanced(n,f,r,u*o,m),e.update(f,n,m))}function h(u,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function d(u,f,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<u.length;p++)c(u[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,v,0,m);let p=0;for(let x=0;x<m;x++)p+=f[x]*v[x];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Px(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Lx(s,t,e){const n=new WeakMap,i=new ue;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let w=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",w)};var f=w;u!==void 0&&u.texture.dispose();const m=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],y=a.morphAttributes.color||[];let _=0;m===!0&&(_=1),v===!0&&(_=2),g===!0&&(_=3);let T=a.attributes.position.count*_,A=1;T>t.maxTextureSize&&(A=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const R=new Float32Array(T*A*4*d),I=new Bd(R,T,A,d);I.type=yi,I.needsUpdate=!0;const b=_*4;for(let P=0;P<d;P++){const k=p[P],D=x[P],B=y[P],F=T*A*4*P;for(let U=0;U<k.count;U++){const Y=U*b;m===!0&&(i.fromBufferAttribute(k,U),R[F+Y+0]=i.x,R[F+Y+1]=i.y,R[F+Y+2]=i.z,R[F+Y+3]=0),v===!0&&(i.fromBufferAttribute(D,U),R[F+Y+4]=i.x,R[F+Y+5]=i.y,R[F+Y+6]=i.z,R[F+Y+7]=0),g===!0&&(i.fromBufferAttribute(B,U),R[F+Y+8]=i.x,R[F+Y+9]=i.y,R[F+Y+10]=i.z,R[F+Y+11]=B.itemSize===4?i.w:1)}}u={count:d,texture:I,size:new ht(T,A)},n.set(a,u),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const v=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Ix(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const af=new Qe,Uu=new Yd(1,1),lf=new Bd,cf=new ym,hf=new Xd,Fu=[],Ou=[],Bu=new Float32Array(16),zu=new Float32Array(9),ku=new Float32Array(4);function vr(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Fu[i];if(r===void 0&&(r=new Float32Array(i),Fu[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function He(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ve(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Ga(s,t){let e=Ou[t];e===void 0&&(e=new Int32Array(t),Ou[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Dx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Nx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;s.uniform2fv(this.addr,t),Ve(e,t)}}function Ux(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(He(e,t))return;s.uniform3fv(this.addr,t),Ve(e,t)}}function Fx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;s.uniform4fv(this.addr,t),Ve(e,t)}}function Ox(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;ku.set(n),s.uniformMatrix2fv(this.addr,!1,ku),Ve(e,n)}}function Bx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;zu.set(n),s.uniformMatrix3fv(this.addr,!1,zu),Ve(e,n)}}function zx(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(He(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(He(e,n))return;Bu.set(n),s.uniformMatrix4fv(this.addr,!1,Bu),Ve(e,n)}}function kx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Gx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;s.uniform2iv(this.addr,t),Ve(e,t)}}function Hx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;s.uniform3iv(this.addr,t),Ve(e,t)}}function Vx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;s.uniform4iv(this.addr,t),Ve(e,t)}}function Wx(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Xx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(He(e,t))return;s.uniform2uiv(this.addr,t),Ve(e,t)}}function qx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(He(e,t))return;s.uniform3uiv(this.addr,t),Ve(e,t)}}function Yx(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(He(e,t))return;s.uniform4uiv(this.addr,t),Ve(e,t)}}function $x(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Uu.compareFunction=Fd,r=Uu):r=af,e.setTexture2D(t||r,i)}function jx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||cf,i)}function Zx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||hf,i)}function Kx(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||lf,i)}function Jx(s){switch(s){case 5126:return Dx;case 35664:return Nx;case 35665:return Ux;case 35666:return Fx;case 35674:return Ox;case 35675:return Bx;case 35676:return zx;case 5124:case 35670:return kx;case 35667:case 35671:return Gx;case 35668:case 35672:return Hx;case 35669:case 35673:return Vx;case 5125:return Wx;case 36294:return Xx;case 36295:return qx;case 36296:return Yx;case 35678:case 36198:case 36298:case 36306:case 35682:return $x;case 35679:case 36299:case 36307:return jx;case 35680:case 36300:case 36308:case 36293:return Zx;case 36289:case 36303:case 36311:case 36292:return Kx}}function Qx(s,t){s.uniform1fv(this.addr,t)}function t_(s,t){const e=vr(t,this.size,2);s.uniform2fv(this.addr,e)}function e_(s,t){const e=vr(t,this.size,3);s.uniform3fv(this.addr,e)}function n_(s,t){const e=vr(t,this.size,4);s.uniform4fv(this.addr,e)}function i_(s,t){const e=vr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function s_(s,t){const e=vr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function r_(s,t){const e=vr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function o_(s,t){s.uniform1iv(this.addr,t)}function a_(s,t){s.uniform2iv(this.addr,t)}function l_(s,t){s.uniform3iv(this.addr,t)}function c_(s,t){s.uniform4iv(this.addr,t)}function h_(s,t){s.uniform1uiv(this.addr,t)}function u_(s,t){s.uniform2uiv(this.addr,t)}function d_(s,t){s.uniform3uiv(this.addr,t)}function f_(s,t){s.uniform4uiv(this.addr,t)}function p_(s,t,e){const n=this.cache,i=t.length,r=Ga(e,i);He(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||af,r[o])}function m_(s,t,e){const n=this.cache,i=t.length,r=Ga(e,i);He(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||cf,r[o])}function g_(s,t,e){const n=this.cache,i=t.length,r=Ga(e,i);He(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||hf,r[o])}function v_(s,t,e){const n=this.cache,i=t.length,r=Ga(e,i);He(n,r)||(s.uniform1iv(this.addr,r),Ve(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||lf,r[o])}function x_(s){switch(s){case 5126:return Qx;case 35664:return t_;case 35665:return e_;case 35666:return n_;case 35674:return i_;case 35675:return s_;case 35676:return r_;case 5124:case 35670:return o_;case 35667:case 35671:return a_;case 35668:case 35672:return l_;case 35669:case 35673:return c_;case 5125:return h_;case 36294:return u_;case 36295:return d_;case 36296:return f_;case 35678:case 36198:case 36298:case 36306:case 35682:return p_;case 35679:case 36299:case 36307:return m_;case 35680:case 36300:case 36308:case 36293:return g_;case 36289:case 36303:case 36311:case 36292:return v_}}class __{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Jx(e.type)}}class y_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=x_(e.type)}}class M_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const Nl=/(\w+)(\])?(\[|\.)?/g;function Gu(s,t){s.seq.push(t),s.map[t.id]=t}function S_(s,t,e){const n=s.name,i=n.length;for(Nl.lastIndex=0;;){const r=Nl.exec(n),o=Nl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Gu(e,c===void 0?new __(a,s,t):new y_(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new M_(a),Gu(e,d)),e=d}}}class va{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);S_(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Hu(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const w_=37297;let E_=0;function b_(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Vu=new Yt;function T_(s){ae._getMatrix(Vu,ae.workingColorSpace,s);const t=`mat3( ${Vu.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(s)){case Sa:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Wu(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+b_(s.getShaderSource(t),a)}else return r}function A_(s,t){const e=T_(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function C_(s,t){let e;switch(t){case Dp:e="Linear";break;case Np:e="Reinhard";break;case Up:e="Cineon";break;case bd:e="ACESFilmic";break;case Op:e="AgX";break;case Bp:e="Neutral";break;case Fp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const oa=new N;function R_(){ae.getLuminanceCoefficients(oa);const s=oa.x.toFixed(4),t=oa.y.toFixed(4),e=oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function P_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fr).join(`
`)}function L_(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function I_(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Fr(s){return s!==""}function Xu(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const D_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uc(s){return s.replace(D_,U_)}const N_=new Map;function U_(s,t){let e=$t[t];if(e===void 0){const n=N_.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uc(e)}const F_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yu(s){return s.replace(F_,O_)}function O_(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function $u(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function B_(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Sd?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===wd?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===gi&&(t="SHADOWMAP_TYPE_VSM"),t}function z_(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case sr:case rr:t="ENVMAP_TYPE_CUBE";break;case Ua:t="ENVMAP_TYPE_CUBE_UV";break}return t}function k_(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case rr:t="ENVMAP_MODE_REFRACTION";break}return t}function G_(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ed:t="ENVMAP_BLENDING_MULTIPLY";break;case Lp:t="ENVMAP_BLENDING_MIX";break;case Ip:t="ENVMAP_BLENDING_ADD";break}return t}function H_(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function V_(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=B_(e),c=z_(e),h=k_(e),d=G_(e),u=H_(e),f=P_(e),m=L_(r),v=i.createProgram();let g,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Fr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Fr).join(`
`),p.length>0&&(p+=`
`)):(g=[$u(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fr).join(`
`),p=[$u(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ki?"#define TONE_MAPPING":"",e.toneMapping!==ki?$t.tonemapping_pars_fragment:"",e.toneMapping!==ki?C_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,A_("linearToOutputTexel",e.outputColorSpace),R_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fr).join(`
`)),o=Uc(o),o=Xu(o,e),o=qu(o,e),a=Uc(a),a=Xu(a,e),a=qu(a,e),o=Yu(o),a=Yu(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===qh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===qh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+g+o,_=x+p+a,T=Hu(i,i.VERTEX_SHADER,y),A=Hu(i,i.FRAGMENT_SHADER,_);i.attachShader(v,T),i.attachShader(v,A),e.index0AttributeName!==void 0?i.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(P){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(v)||"",D=i.getShaderInfoLog(T)||"",B=i.getShaderInfoLog(A)||"",F=k.trim(),U=D.trim(),Y=B.trim();let G=!0,Z=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,T,A);else{const dt=Wu(i,T,"vertex"),pt=Wu(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+dt+`
`+pt)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||Y==="")&&(Z=!1);Z&&(P.diagnostics={runnable:G,programLog:F,vertexShader:{log:U,prefix:g},fragmentShader:{log:Y,prefix:p}})}i.deleteShader(T),i.deleteShader(A),I=new va(i,v),b=I_(i,v)}let I;this.getUniforms=function(){return I===void 0&&R(this),I};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let w=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=i.getProgramParameter(v,w_)),w},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=E_++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=A,this}let W_=0;class X_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new q_(t),e.set(t,n)),n}}class q_{constructor(t){this.id=W_++,this.code=t,this.usedTimes=0}}function Y_(s,t,e,n,i,r,o){const a=new zd,l=new X_,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,w,P,k,D){const B=k.fog,F=D.geometry,U=b.isMeshStandardMaterial?k.environment:null,Y=(b.isMeshStandardMaterial?e:t).get(b.envMap||U),G=Y&&Y.mapping===Ua?Y.image.height:null,Z=m[b.type];b.precision!==null&&(f=i.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const dt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,pt=dt!==void 0?dt.length:0;let ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let Xt,ie,Jt,j;if(Z){const ce=Zn[Z];Xt=ce.vertexShader,ie=ce.fragmentShader}else Xt=b.vertexShader,ie=b.fragmentShader,l.update(b),Jt=l.getVertexShaderID(b),j=l.getFragmentShaderID(b);const et=s.getRenderTarget(),bt=s.state.buffers.depth.getReversed(),Ut=D.isInstancedMesh===!0,Rt=D.isBatchedMesh===!0,ee=!!b.map,xe=!!b.matcap,L=!!Y,it=!!b.aoMap,Q=!!b.lightMap,J=!!b.bumpMap,K=!!b.normalMap,mt=!!b.displacementMap,rt=!!b.emissiveMap,gt=!!b.metalnessMap,Vt=!!b.roughnessMap,Ht=b.anisotropy>0,C=b.clearcoat>0,M=b.dispersion>0,V=b.iridescence>0,q=b.sheen>0,nt=b.transmission>0,$=Ht&&!!b.anisotropyMap,Dt=C&&!!b.clearcoatMap,ft=C&&!!b.clearcoatNormalMap,Pt=C&&!!b.clearcoatRoughnessMap,Lt=V&&!!b.iridescenceMap,ot=V&&!!b.iridescenceThicknessMap,St=q&&!!b.sheenColorMap,kt=q&&!!b.sheenRoughnessMap,Nt=!!b.specularMap,_t=!!b.specularColorMap,qt=!!b.specularIntensityMap,O=nt&&!!b.transmissionMap,ut=nt&&!!b.thicknessMap,vt=!!b.gradientMap,At=!!b.alphaMap,at=b.alphaTest>0,tt=!!b.alphaHash,It=!!b.extensions;let Wt=ki;b.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Wt=s.toneMapping);const _e={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:Xt,fragmentShader:ie,defines:b.defines,customVertexShaderID:Jt,customFragmentShaderID:j,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Rt,batchingColor:Rt&&D._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&D.instanceColor!==null,instancingMorph:Ut&&D.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:et===null?s.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:or,alphaToCoverage:!!b.alphaToCoverage,map:ee,matcap:xe,envMap:L,envMapMode:L&&Y.mapping,envMapCubeUVHeight:G,aoMap:it,lightMap:Q,bumpMap:J,normalMap:K,displacementMap:u&&mt,emissiveMap:rt,normalMapObjectSpace:K&&b.normalMapType===Hp,normalMapTangentSpace:K&&b.normalMapType===Ud,metalnessMap:gt,roughnessMap:Vt,anisotropy:Ht,anisotropyMap:$,clearcoat:C,clearcoatMap:Dt,clearcoatNormalMap:ft,clearcoatRoughnessMap:Pt,dispersion:M,iridescence:V,iridescenceMap:Lt,iridescenceThicknessMap:ot,sheen:q,sheenColorMap:St,sheenRoughnessMap:kt,specularMap:Nt,specularColorMap:_t,specularIntensityMap:qt,transmission:nt,transmissionMap:O,thicknessMap:ut,gradientMap:vt,opaque:b.transparent===!1&&b.blending===Js&&b.alphaToCoverage===!1,alphaMap:At,alphaTest:at,alphaHash:tt,combine:b.combine,mapUv:ee&&v(b.map.channel),aoMapUv:it&&v(b.aoMap.channel),lightMapUv:Q&&v(b.lightMap.channel),bumpMapUv:J&&v(b.bumpMap.channel),normalMapUv:K&&v(b.normalMap.channel),displacementMapUv:mt&&v(b.displacementMap.channel),emissiveMapUv:rt&&v(b.emissiveMap.channel),metalnessMapUv:gt&&v(b.metalnessMap.channel),roughnessMapUv:Vt&&v(b.roughnessMap.channel),anisotropyMapUv:$&&v(b.anisotropyMap.channel),clearcoatMapUv:Dt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:ft&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Lt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:St&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:kt&&v(b.sheenRoughnessMap.channel),specularMapUv:Nt&&v(b.specularMap.channel),specularColorMapUv:_t&&v(b.specularColorMap.channel),specularIntensityMapUv:qt&&v(b.specularIntensityMap.channel),transmissionMapUv:O&&v(b.transmissionMap.channel),thicknessMapUv:ut&&v(b.thicknessMap.channel),alphaMapUv:At&&v(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(K||Ht),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!F.attributes.uv&&(ee||At),fog:!!B,useFog:b.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:bt,skinning:D.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:ct,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Wt,decodeVideoTexture:ee&&b.map.isVideoTexture===!0&&ae.getTransfer(b.map.colorSpace)===fe,decodeVideoTextureEmissive:rt&&b.emissiveMap.isVideoTexture===!0&&ae.getTransfer(b.emissiveMap.colorSpace)===fe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Cn,flipSided:b.side===ln,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:It&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(It&&b.extensions.multiDraw===!0||Rt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return _e.vertexUv1s=c.has(1),_e.vertexUv2s=c.has(2),_e.vertexUv3s=c.has(3),c.clear(),_e}function p(b){const w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)w.push(P),w.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(x(w,b),y(w,b),w.push(s.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function x(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function y(b,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),w.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),b.push(a.mask)}function _(b){const w=m[b.type];let P;if(w){const k=Zn[w];P=Dm.clone(k.uniforms)}else P=b.uniforms;return P}function T(b,w){let P;for(let k=0,D=h.length;k<D;k++){const B=h[k];if(B.cacheKey===w){P=B,++P.usedTimes;break}}return P===void 0&&(P=new V_(s,w,b,r),h.push(P)),P}function A(b){if(--b.usedTimes===0){const w=h.indexOf(b);h[w]=h[h.length-1],h.pop(),b.destroy()}}function R(b){l.remove(b)}function I(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:T,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:I}}function $_(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function j_(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function ju(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Zu(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(d,u,f,m,v,g){let p=s[t];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:m,renderOrder:d.renderOrder,z:v,group:g},s[t]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=m,p.renderOrder=d.renderOrder,p.z=v,p.group=g),t++,p}function a(d,u,f,m,v,g){const p=o(d,u,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(d,u,f,m,v,g){const p=o(d,u,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(d,u){e.length>1&&e.sort(d||j_),n.length>1&&n.sort(u||ju),i.length>1&&i.sort(u||ju)}function h(){for(let d=t,u=s.length;d<u;d++){const f=s[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Z_(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new Zu,s.set(n,[o])):i>=r.length?(o=new Zu,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function K_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new te};break;case"SpotLight":e={position:new N,direction:new N,color:new te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new te,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new te,groundColor:new te};break;case"RectAreaLight":e={color:new te,position:new N,halfWidth:new N,halfHeight:new N};break}return s[t.id]=e,e}}}function J_(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Q_=0;function ty(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ey(s){const t=new K_,e=J_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const i=new N,r=new Me,o=new Me;function a(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,x=0,y=0,_=0,T=0,A=0,R=0;c.sort(ty);for(let b=0,w=c.length;b<w;b++){const P=c[b],k=P.color,D=P.intensity,B=P.distance,F=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*D,d+=k.g*D,u+=k.b*D;else if(P.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(P.sh.coefficients[U],D);R++}else if(P.isDirectionalLight){const U=t.get(P);if(U.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Y=P.shadow,G=e.get(P);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=F,n.directionalShadowMatrix[f]=P.shadow.matrix,x++}n.directional[f]=U,f++}else if(P.isSpotLight){const U=t.get(P);U.position.setFromMatrixPosition(P.matrixWorld),U.color.copy(k).multiplyScalar(D),U.distance=B,U.coneCos=Math.cos(P.angle),U.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),U.decay=P.decay,n.spot[v]=U;const Y=P.shadow;if(P.map&&(n.spotLightMap[T]=P.map,T++,Y.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[v]=Y.matrix,P.castShadow){const G=e.get(P);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=F,_++}v++}else if(P.isRectAreaLight){const U=t.get(P);U.color.copy(k).multiplyScalar(D),U.halfWidth.set(P.width*.5,0,0),U.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=U,g++}else if(P.isPointLight){const U=t.get(P);if(U.color.copy(P.color).multiplyScalar(P.intensity),U.distance=P.distance,U.decay=P.decay,P.castShadow){const Y=P.shadow,G=e.get(P);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,G.shadowCameraNear=Y.camera.near,G.shadowCameraFar=Y.camera.far,n.pointShadow[m]=G,n.pointShadowMap[m]=F,n.pointShadowMatrix[m]=P.shadow.matrix,y++}n.point[m]=U,m++}else if(P.isHemisphereLight){const U=t.get(P);U.skyColor.copy(P.color).multiplyScalar(D),U.groundColor.copy(P.groundColor).multiplyScalar(D),n.hemi[p]=U,p++}}g>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xt.LTC_FLOAT_1,n.rectAreaLTC2=xt.LTC_FLOAT_2):(n.rectAreaLTC1=xt.LTC_HALF_1,n.rectAreaLTC2=xt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const I=n.hash;(I.directionalLength!==f||I.pointLength!==m||I.spotLength!==v||I.rectAreaLength!==g||I.hemiLength!==p||I.numDirectionalShadows!==x||I.numPointShadows!==y||I.numSpotShadows!==_||I.numSpotMaps!==T||I.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=_+T-A,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,I.directionalLength=f,I.pointLength=m,I.spotLength=v,I.rectAreaLength=g,I.hemiLength=p,I.numDirectionalShadows=x,I.numPointShadows=y,I.numSpotShadows=_,I.numSpotMaps=T,I.numLightProbes=R,n.version=Q_++)}function l(c,h){let d=0,u=0,f=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const y=c[p];if(y.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(g),d++}else if(y.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(g),f++}else if(y.isRectAreaLight){const _=n.rectArea[m];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),_.halfWidth.set(y.width*.5,0,0),_.halfHeight.set(0,y.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),m++}else if(y.isPointLight){const _=n.point[u];_.position.setFromMatrixPosition(y.matrixWorld),_.position.applyMatrix4(g),u++}else if(y.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(y.matrixWorld),_.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function Ku(s){const t=new ey(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function ny(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new Ku(s),t.set(i,[a])):r>=o.length?(a=new Ku(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sy=`uniform sampler2D shadow_pass;
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
}`;function ry(s,t,e){let n=new Qc;const i=new ht,r=new ht,o=new ue,a=new Rg({depthPacking:Gp}),l=new Pg,c={},h=e.maxTextureSize,d={[Vi]:ln,[ln]:Vi,[Cn]:Cn},u=new Dn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:iy,fragmentShader:sy}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const m=new ve;m.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new me(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sd;let p=this.type;this.render=function(A,R,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const b=s.getRenderTarget(),w=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),k=s.state;k.setBlending(zi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const D=p!==gi&&this.type===gi,B=p===gi&&this.type!==gi;for(let F=0,U=A.length;F<U;F++){const Y=A[F],G=Y.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const Z=G.getFrameExtents();if(i.multiply(Z),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,G.mapSize.y=r.y)),G.map===null||D===!0||B===!0){const pt=this.type!==gi?{minFilter:gn,magFilter:gn}:{};G.map!==null&&G.map.dispose(),G.map=new vs(i.x,i.y,pt),G.map.texture.name=Y.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();const dt=G.getViewportCount();for(let pt=0;pt<dt;pt++){const ct=G.getViewport(pt);o.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),k.viewport(o),G.updateMatrices(Y,pt),n=G.getFrustum(),_(R,I,G.camera,Y,this.type)}G.isPointLightShadow!==!0&&this.type===gi&&x(G,I),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(b,w,P)};function x(A,R){const I=t.update(v);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new vs(i.x,i.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(R,null,I,u,v,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(R,null,I,f,v,null)}function y(A,R,I,b){let w=null;const P=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)w=P;else if(w=I.isPointLight===!0?l:a,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const k=w.uuid,D=R.uuid;let B=c[k];B===void 0&&(B={},c[k]=B);let F=B[D];F===void 0&&(F=w.clone(),B[D]=F,R.addEventListener("dispose",T)),w=F}if(w.visible=R.visible,w.wireframe=R.wireframe,b===gi?w.side=R.shadowSide!==null?R.shadowSide:R.side:w.side=R.shadowSide!==null?R.shadowSide:d[R.side],w.alphaMap=R.alphaMap,w.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,w.map=R.map,w.clipShadows=R.clipShadows,w.clippingPlanes=R.clippingPlanes,w.clipIntersection=R.clipIntersection,w.displacementMap=R.displacementMap,w.displacementScale=R.displacementScale,w.displacementBias=R.displacementBias,w.wireframeLinewidth=R.wireframeLinewidth,w.linewidth=R.linewidth,I.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const k=s.properties.get(w);k.light=I}return w}function _(A,R,I,b,w){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&w===gi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);const D=t.update(A),B=A.material;if(Array.isArray(B)){const F=D.groups;for(let U=0,Y=F.length;U<Y;U++){const G=F[U],Z=B[G.materialIndex];if(Z&&Z.visible){const dt=y(A,Z,b,w);A.onBeforeShadow(s,A,R,I,D,dt,G),s.renderBufferDirect(I,null,D,dt,A,G),A.onAfterShadow(s,A,R,I,D,dt,G)}}}else if(B.visible){const F=y(A,B,b,w);A.onBeforeShadow(s,A,R,I,D,F,null),s.renderBufferDirect(I,null,D,F,A,null),A.onAfterShadow(s,A,R,I,D,F,null)}}const k=A.children;for(let D=0,B=k.length;D<B;D++)_(k[D],R,I,b,w)}function T(A){A.target.removeEventListener("dispose",T);for(const I in c){const b=c[I],w=A.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}const oy={[Xl]:ql,[Yl]:Zl,[$l]:Kl,[ir]:jl,[ql]:Xl,[Zl]:Yl,[Kl]:$l,[jl]:ir};function ay(s,t){function e(){let O=!1;const ut=new ue;let vt=null;const At=new ue(0,0,0,0);return{setMask:function(at){vt!==at&&!O&&(s.colorMask(at,at,at,at),vt=at)},setLocked:function(at){O=at},setClear:function(at,tt,It,Wt,_e){_e===!0&&(at*=Wt,tt*=Wt,It*=Wt),ut.set(at,tt,It,Wt),At.equals(ut)===!1&&(s.clearColor(at,tt,It,Wt),At.copy(ut))},reset:function(){O=!1,vt=null,At.set(-1,0,0,0)}}}function n(){let O=!1,ut=!1,vt=null,At=null,at=null;return{setReversed:function(tt){if(ut!==tt){const It=t.get("EXT_clip_control");tt?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),ut=tt;const Wt=at;at=null,this.setClear(Wt)}},getReversed:function(){return ut},setTest:function(tt){tt?et(s.DEPTH_TEST):bt(s.DEPTH_TEST)},setMask:function(tt){vt!==tt&&!O&&(s.depthMask(tt),vt=tt)},setFunc:function(tt){if(ut&&(tt=oy[tt]),At!==tt){switch(tt){case Xl:s.depthFunc(s.NEVER);break;case ql:s.depthFunc(s.ALWAYS);break;case Yl:s.depthFunc(s.LESS);break;case ir:s.depthFunc(s.LEQUAL);break;case $l:s.depthFunc(s.EQUAL);break;case jl:s.depthFunc(s.GEQUAL);break;case Zl:s.depthFunc(s.GREATER);break;case Kl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}At=tt}},setLocked:function(tt){O=tt},setClear:function(tt){at!==tt&&(ut&&(tt=1-tt),s.clearDepth(tt),at=tt)},reset:function(){O=!1,vt=null,At=null,at=null,ut=!1}}}function i(){let O=!1,ut=null,vt=null,At=null,at=null,tt=null,It=null,Wt=null,_e=null;return{setTest:function(ce){O||(ce?et(s.STENCIL_TEST):bt(s.STENCIL_TEST))},setMask:function(ce){ut!==ce&&!O&&(s.stencilMask(ce),ut=ce)},setFunc:function(ce,oi,Wn){(vt!==ce||At!==oi||at!==Wn)&&(s.stencilFunc(ce,oi,Wn),vt=ce,At=oi,at=Wn)},setOp:function(ce,oi,Wn){(tt!==ce||It!==oi||Wt!==Wn)&&(s.stencilOp(ce,oi,Wn),tt=ce,It=oi,Wt=Wn)},setLocked:function(ce){O=ce},setClear:function(ce){_e!==ce&&(s.clearStencil(ce),_e=ce)},reset:function(){O=!1,ut=null,vt=null,At=null,at=null,tt=null,It=null,Wt=null,_e=null}}}const r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],m=null,v=!1,g=null,p=null,x=null,y=null,_=null,T=null,A=null,R=new te(0,0,0),I=0,b=!1,w=null,P=null,k=null,D=null,B=null;const F=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,Y=0;const G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(G)[1]),U=Y>=1):G.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),U=Y>=2);let Z=null,dt={};const pt=s.getParameter(s.SCISSOR_BOX),ct=s.getParameter(s.VIEWPORT),Xt=new ue().fromArray(pt),ie=new ue().fromArray(ct);function Jt(O,ut,vt,At){const at=new Uint8Array(4),tt=s.createTexture();s.bindTexture(O,tt),s.texParameteri(O,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(O,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let It=0;It<vt;It++)O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY?s.texImage3D(ut,0,s.RGBA,1,1,At,0,s.RGBA,s.UNSIGNED_BYTE,at):s.texImage2D(ut+It,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,at);return tt}const j={};j[s.TEXTURE_2D]=Jt(s.TEXTURE_2D,s.TEXTURE_2D,1),j[s.TEXTURE_CUBE_MAP]=Jt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[s.TEXTURE_2D_ARRAY]=Jt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),j[s.TEXTURE_3D]=Jt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),et(s.DEPTH_TEST),o.setFunc(ir),J(!1),K(Hh),et(s.CULL_FACE),it(zi);function et(O){h[O]!==!0&&(s.enable(O),h[O]=!0)}function bt(O){h[O]!==!1&&(s.disable(O),h[O]=!1)}function Ut(O,ut){return d[O]!==ut?(s.bindFramebuffer(O,ut),d[O]=ut,O===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ut),O===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ut),!0):!1}function Rt(O,ut){let vt=f,At=!1;if(O){vt=u.get(ut),vt===void 0&&(vt=[],u.set(ut,vt));const at=O.textures;if(vt.length!==at.length||vt[0]!==s.COLOR_ATTACHMENT0){for(let tt=0,It=at.length;tt<It;tt++)vt[tt]=s.COLOR_ATTACHMENT0+tt;vt.length=at.length,At=!0}}else vt[0]!==s.BACK&&(vt[0]=s.BACK,At=!0);At&&s.drawBuffers(vt)}function ee(O){return m!==O?(s.useProgram(O),m=O,!0):!1}const xe={[as]:s.FUNC_ADD,[pp]:s.FUNC_SUBTRACT,[mp]:s.FUNC_REVERSE_SUBTRACT};xe[gp]=s.MIN,xe[vp]=s.MAX;const L={[xp]:s.ZERO,[_p]:s.ONE,[yp]:s.SRC_COLOR,[Vl]:s.SRC_ALPHA,[Tp]:s.SRC_ALPHA_SATURATE,[Ep]:s.DST_COLOR,[Sp]:s.DST_ALPHA,[Mp]:s.ONE_MINUS_SRC_COLOR,[Wl]:s.ONE_MINUS_SRC_ALPHA,[bp]:s.ONE_MINUS_DST_COLOR,[wp]:s.ONE_MINUS_DST_ALPHA,[Ap]:s.CONSTANT_COLOR,[Cp]:s.ONE_MINUS_CONSTANT_COLOR,[Rp]:s.CONSTANT_ALPHA,[Pp]:s.ONE_MINUS_CONSTANT_ALPHA};function it(O,ut,vt,At,at,tt,It,Wt,_e,ce){if(O===zi){v===!0&&(bt(s.BLEND),v=!1);return}if(v===!1&&(et(s.BLEND),v=!0),O!==fp){if(O!==g||ce!==b){if((p!==as||_!==as)&&(s.blendEquation(s.FUNC_ADD),p=as,_=as),ce)switch(O){case Js:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _n:s.blendFunc(s.ONE,s.ONE);break;case Vh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Wh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Js:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _n:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Vh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Wh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}x=null,y=null,T=null,A=null,R.set(0,0,0),I=0,g=O,b=ce}return}at=at||ut,tt=tt||vt,It=It||At,(ut!==p||at!==_)&&(s.blendEquationSeparate(xe[ut],xe[at]),p=ut,_=at),(vt!==x||At!==y||tt!==T||It!==A)&&(s.blendFuncSeparate(L[vt],L[At],L[tt],L[It]),x=vt,y=At,T=tt,A=It),(Wt.equals(R)===!1||_e!==I)&&(s.blendColor(Wt.r,Wt.g,Wt.b,_e),R.copy(Wt),I=_e),g=O,b=!1}function Q(O,ut){O.side===Cn?bt(s.CULL_FACE):et(s.CULL_FACE);let vt=O.side===ln;ut&&(vt=!vt),J(vt),O.blending===Js&&O.transparent===!1?it(zi):it(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);const At=O.stencilWrite;a.setTest(At),At&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),rt(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?et(s.SAMPLE_ALPHA_TO_COVERAGE):bt(s.SAMPLE_ALPHA_TO_COVERAGE)}function J(O){w!==O&&(O?s.frontFace(s.CW):s.frontFace(s.CCW),w=O)}function K(O){O!==up?(et(s.CULL_FACE),O!==P&&(O===Hh?s.cullFace(s.BACK):O===dp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):bt(s.CULL_FACE),P=O}function mt(O){O!==k&&(U&&s.lineWidth(O),k=O)}function rt(O,ut,vt){O?(et(s.POLYGON_OFFSET_FILL),(D!==ut||B!==vt)&&(s.polygonOffset(ut,vt),D=ut,B=vt)):bt(s.POLYGON_OFFSET_FILL)}function gt(O){O?et(s.SCISSOR_TEST):bt(s.SCISSOR_TEST)}function Vt(O){O===void 0&&(O=s.TEXTURE0+F-1),Z!==O&&(s.activeTexture(O),Z=O)}function Ht(O,ut,vt){vt===void 0&&(Z===null?vt=s.TEXTURE0+F-1:vt=Z);let At=dt[vt];At===void 0&&(At={type:void 0,texture:void 0},dt[vt]=At),(At.type!==O||At.texture!==ut)&&(Z!==vt&&(s.activeTexture(vt),Z=vt),s.bindTexture(O,ut||j[O]),At.type=O,At.texture=ut)}function C(){const O=dt[Z];O!==void 0&&O.type!==void 0&&(s.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function M(){try{s.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function V(){try{s.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function q(){try{s.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function nt(){try{s.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function $(){try{s.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Dt(){try{s.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ft(){try{s.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pt(){try{s.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Lt(){try{s.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ot(){try{s.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function St(O){Xt.equals(O)===!1&&(s.scissor(O.x,O.y,O.z,O.w),Xt.copy(O))}function kt(O){ie.equals(O)===!1&&(s.viewport(O.x,O.y,O.z,O.w),ie.copy(O))}function Nt(O,ut){let vt=c.get(ut);vt===void 0&&(vt=new WeakMap,c.set(ut,vt));let At=vt.get(O);At===void 0&&(At=s.getUniformBlockIndex(ut,O.name),vt.set(O,At))}function _t(O,ut){const At=c.get(ut).get(O);l.get(ut)!==At&&(s.uniformBlockBinding(ut,At,O.__bindingPointIndex),l.set(ut,At))}function qt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},Z=null,dt={},d={},u=new WeakMap,f=[],m=null,v=!1,g=null,p=null,x=null,y=null,_=null,T=null,A=null,R=new te(0,0,0),I=0,b=!1,w=null,P=null,k=null,D=null,B=null,Xt.set(0,0,s.canvas.width,s.canvas.height),ie.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:et,disable:bt,bindFramebuffer:Ut,drawBuffers:Rt,useProgram:ee,setBlending:it,setMaterial:Q,setFlipSided:J,setCullFace:K,setLineWidth:mt,setPolygonOffset:rt,setScissorTest:gt,activeTexture:Vt,bindTexture:Ht,unbindTexture:C,compressedTexImage2D:M,compressedTexImage3D:V,texImage2D:Lt,texImage3D:ot,updateUBOMapping:Nt,uniformBlockBinding:_t,texStorage2D:ft,texStorage3D:Pt,texSubImage2D:q,texSubImage3D:nt,compressedTexSubImage2D:$,compressedTexSubImage3D:Dt,scissor:St,viewport:kt,reset:qt}}function ly(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,M){return f?new OffscreenCanvas(C,M):Ea("canvas")}function v(C,M,V){let q=1;const nt=Ht(C);if((nt.width>V||nt.height>V)&&(q=V/Math.max(nt.width,nt.height)),q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const $=Math.floor(q*nt.width),Dt=Math.floor(q*nt.height);d===void 0&&(d=m($,Dt));const ft=M?m($,Dt):d;return ft.width=$,ft.height=Dt,ft.getContext("2d").drawImage(C,0,0,$,Dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+$+"x"+Dt+")."),ft}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){s.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(C,M,V,q,nt=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=M;if(M===s.RED&&(V===s.FLOAT&&($=s.R32F),V===s.HALF_FLOAT&&($=s.R16F),V===s.UNSIGNED_BYTE&&($=s.R8)),M===s.RED_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.R8UI),V===s.UNSIGNED_SHORT&&($=s.R16UI),V===s.UNSIGNED_INT&&($=s.R32UI),V===s.BYTE&&($=s.R8I),V===s.SHORT&&($=s.R16I),V===s.INT&&($=s.R32I)),M===s.RG&&(V===s.FLOAT&&($=s.RG32F),V===s.HALF_FLOAT&&($=s.RG16F),V===s.UNSIGNED_BYTE&&($=s.RG8)),M===s.RG_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RG8UI),V===s.UNSIGNED_SHORT&&($=s.RG16UI),V===s.UNSIGNED_INT&&($=s.RG32UI),V===s.BYTE&&($=s.RG8I),V===s.SHORT&&($=s.RG16I),V===s.INT&&($=s.RG32I)),M===s.RGB_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RGB8UI),V===s.UNSIGNED_SHORT&&($=s.RGB16UI),V===s.UNSIGNED_INT&&($=s.RGB32UI),V===s.BYTE&&($=s.RGB8I),V===s.SHORT&&($=s.RGB16I),V===s.INT&&($=s.RGB32I)),M===s.RGBA_INTEGER&&(V===s.UNSIGNED_BYTE&&($=s.RGBA8UI),V===s.UNSIGNED_SHORT&&($=s.RGBA16UI),V===s.UNSIGNED_INT&&($=s.RGBA32UI),V===s.BYTE&&($=s.RGBA8I),V===s.SHORT&&($=s.RGBA16I),V===s.INT&&($=s.RGBA32I)),M===s.RGB&&(V===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),V===s.UNSIGNED_INT_10F_11F_11F_REV&&($=s.R11F_G11F_B10F)),M===s.RGBA){const Dt=nt?Sa:ae.getTransfer(q);V===s.FLOAT&&($=s.RGBA32F),V===s.HALF_FLOAT&&($=s.RGBA16F),V===s.UNSIGNED_BYTE&&($=Dt===fe?s.SRGB8_ALPHA8:s.RGBA8),V===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),V===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function _(C,M){let V;return C?M===null||M===gs||M===Vr?V=s.DEPTH24_STENCIL8:M===yi?V=s.DEPTH32F_STENCIL8:M===Hr&&(V=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===gs||M===Vr?V=s.DEPTH_COMPONENT24:M===yi?V=s.DEPTH_COMPONENT32F:M===Hr&&(V=s.DEPTH_COMPONENT16),V}function T(C,M){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==gn&&C.minFilter!==Pn?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function A(C){const M=C.target;M.removeEventListener("dispose",A),I(M),M.isVideoTexture&&h.delete(M)}function R(C){const M=C.target;M.removeEventListener("dispose",R),w(M)}function I(C){const M=n.get(C);if(M.__webglInit===void 0)return;const V=C.source,q=u.get(V);if(q){const nt=q[M.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&b(C),Object.keys(q).length===0&&u.delete(V)}n.remove(C)}function b(C){const M=n.get(C);s.deleteTexture(M.__webglTexture);const V=C.source,q=u.get(V);delete q[M.__cacheKey],o.memory.textures--}function w(C){const M=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(M.__webglFramebuffer[q]))for(let nt=0;nt<M.__webglFramebuffer[q].length;nt++)s.deleteFramebuffer(M.__webglFramebuffer[q][nt]);else s.deleteFramebuffer(M.__webglFramebuffer[q]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[q])}else{if(Array.isArray(M.__webglFramebuffer))for(let q=0;q<M.__webglFramebuffer.length;q++)s.deleteFramebuffer(M.__webglFramebuffer[q]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let q=0;q<M.__webglColorRenderbuffer.length;q++)M.__webglColorRenderbuffer[q]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[q]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const V=C.textures;for(let q=0,nt=V.length;q<nt;q++){const $=n.get(V[q]);$.__webglTexture&&(s.deleteTexture($.__webglTexture),o.memory.textures--),n.remove(V[q])}n.remove(C)}let P=0;function k(){P=0}function D(){const C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function B(C){const M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function F(C,M){const V=n.get(C);if(C.isVideoTexture&&gt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&V.__version!==C.version){const q=C.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(V,C,M);return}}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,V.__webglTexture,s.TEXTURE0+M)}function U(C,M){const V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){j(V,C,M);return}e.bindTexture(s.TEXTURE_2D_ARRAY,V.__webglTexture,s.TEXTURE0+M)}function Y(C,M){const V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){j(V,C,M);return}e.bindTexture(s.TEXTURE_3D,V.__webglTexture,s.TEXTURE0+M)}function G(C,M){const V=n.get(C);if(C.version>0&&V.__version!==C.version){et(V,C,M);return}e.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture,s.TEXTURE0+M)}const Z={[tc]:s.REPEAT,[us]:s.CLAMP_TO_EDGE,[ec]:s.MIRRORED_REPEAT},dt={[gn]:s.NEAREST,[zp]:s.NEAREST_MIPMAP_NEAREST,[Ao]:s.NEAREST_MIPMAP_LINEAR,[Pn]:s.LINEAR,[Ja]:s.LINEAR_MIPMAP_NEAREST,[ds]:s.LINEAR_MIPMAP_LINEAR},pt={[Vp]:s.NEVER,[jp]:s.ALWAYS,[Wp]:s.LESS,[Fd]:s.LEQUAL,[Xp]:s.EQUAL,[$p]:s.GEQUAL,[qp]:s.GREATER,[Yp]:s.NOTEQUAL};function ct(C,M){if(M.type===yi&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===Pn||M.magFilter===Ja||M.magFilter===Ao||M.magFilter===ds||M.minFilter===Pn||M.minFilter===Ja||M.minFilter===Ao||M.minFilter===ds)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,Z[M.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,Z[M.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,Z[M.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,dt[M.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,dt[M.minFilter]),M.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,pt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===gn||M.minFilter!==Ao&&M.minFilter!==ds||M.type===yi&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Xt(C,M){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",A));const q=M.source;let nt=u.get(q);nt===void 0&&(nt={},u.set(q,nt));const $=B(M);if($!==C.__cacheKey){nt[$]===void 0&&(nt[$]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,V=!0),nt[$].usedTimes++;const Dt=nt[C.__cacheKey];Dt!==void 0&&(nt[C.__cacheKey].usedTimes--,Dt.usedTimes===0&&b(M)),C.__cacheKey=$,C.__webglTexture=nt[$].texture}return V}function ie(C,M,V){return Math.floor(Math.floor(C/V)/M)}function Jt(C,M,V,q){const $=C.updateRanges;if($.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,V,q,M.data);else{$.sort((ot,St)=>ot.start-St.start);let Dt=0;for(let ot=1;ot<$.length;ot++){const St=$[Dt],kt=$[ot],Nt=St.start+St.count,_t=ie(kt.start,M.width,4),qt=ie(St.start,M.width,4);kt.start<=Nt+1&&_t===qt&&ie(kt.start+kt.count-1,M.width,4)===_t?St.count=Math.max(St.count,kt.start+kt.count-St.start):(++Dt,$[Dt]=kt)}$.length=Dt+1;const ft=s.getParameter(s.UNPACK_ROW_LENGTH),Pt=s.getParameter(s.UNPACK_SKIP_PIXELS),Lt=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let ot=0,St=$.length;ot<St;ot++){const kt=$[ot],Nt=Math.floor(kt.start/4),_t=Math.ceil(kt.count/4),qt=Nt%M.width,O=Math.floor(Nt/M.width),ut=_t,vt=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,qt),s.pixelStorei(s.UNPACK_SKIP_ROWS,O),e.texSubImage2D(s.TEXTURE_2D,0,qt,O,ut,vt,V,q,M.data)}C.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ft),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Pt),s.pixelStorei(s.UNPACK_SKIP_ROWS,Lt)}}function j(C,M,V){let q=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(q=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(q=s.TEXTURE_3D);const nt=Xt(C,M),$=M.source;e.bindTexture(q,C.__webglTexture,s.TEXTURE0+V);const Dt=n.get($);if($.version!==Dt.__version||nt===!0){e.activeTexture(s.TEXTURE0+V);const ft=ae.getPrimaries(ae.workingColorSpace),Pt=M.colorSpace===Oi?null:ae.getPrimaries(M.colorSpace),Lt=M.colorSpace===Oi||ft===Pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let ot=v(M.image,!1,i.maxTextureSize);ot=Vt(M,ot);const St=r.convert(M.format,M.colorSpace),kt=r.convert(M.type);let Nt=y(M.internalFormat,St,kt,M.colorSpace,M.isVideoTexture);ct(q,M);let _t;const qt=M.mipmaps,O=M.isVideoTexture!==!0,ut=Dt.__version===void 0||nt===!0,vt=$.dataReady,At=T(M,ot);if(M.isDepthTexture)Nt=_(M.format===Xr,M.type),ut&&(O?e.texStorage2D(s.TEXTURE_2D,1,Nt,ot.width,ot.height):e.texImage2D(s.TEXTURE_2D,0,Nt,ot.width,ot.height,0,St,kt,null));else if(M.isDataTexture)if(qt.length>0){O&&ut&&e.texStorage2D(s.TEXTURE_2D,At,Nt,qt[0].width,qt[0].height);for(let at=0,tt=qt.length;at<tt;at++)_t=qt[at],O?vt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,_t.width,_t.height,St,kt,_t.data):e.texImage2D(s.TEXTURE_2D,at,Nt,_t.width,_t.height,0,St,kt,_t.data);M.generateMipmaps=!1}else O?(ut&&e.texStorage2D(s.TEXTURE_2D,At,Nt,ot.width,ot.height),vt&&Jt(M,ot,St,kt)):e.texImage2D(s.TEXTURE_2D,0,Nt,ot.width,ot.height,0,St,kt,ot.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){O&&ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,At,Nt,qt[0].width,qt[0].height,ot.depth);for(let at=0,tt=qt.length;at<tt;at++)if(_t=qt[at],M.format!==Gn)if(St!==null)if(O){if(vt)if(M.layerUpdates.size>0){const It=Au(_t.width,_t.height,M.format,M.type);for(const Wt of M.layerUpdates){const _e=_t.data.subarray(Wt*It/_t.data.BYTES_PER_ELEMENT,(Wt+1)*It/_t.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,Wt,_t.width,_t.height,1,St,_e)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,_t.width,_t.height,ot.depth,St,_t.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,at,Nt,_t.width,_t.height,ot.depth,0,_t.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?vt&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,_t.width,_t.height,ot.depth,St,kt,_t.data):e.texImage3D(s.TEXTURE_2D_ARRAY,at,Nt,_t.width,_t.height,ot.depth,0,St,kt,_t.data)}else{O&&ut&&e.texStorage2D(s.TEXTURE_2D,At,Nt,qt[0].width,qt[0].height);for(let at=0,tt=qt.length;at<tt;at++)_t=qt[at],M.format!==Gn?St!==null?O?vt&&e.compressedTexSubImage2D(s.TEXTURE_2D,at,0,0,_t.width,_t.height,St,_t.data):e.compressedTexImage2D(s.TEXTURE_2D,at,Nt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?vt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,_t.width,_t.height,St,kt,_t.data):e.texImage2D(s.TEXTURE_2D,at,Nt,_t.width,_t.height,0,St,kt,_t.data)}else if(M.isDataArrayTexture)if(O){if(ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,At,Nt,ot.width,ot.height,ot.depth),vt)if(M.layerUpdates.size>0){const at=Au(ot.width,ot.height,M.format,M.type);for(const tt of M.layerUpdates){const It=ot.data.subarray(tt*at/ot.data.BYTES_PER_ELEMENT,(tt+1)*at/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,tt,ot.width,ot.height,1,St,kt,It)}M.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,St,kt,ot.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Nt,ot.width,ot.height,ot.depth,0,St,kt,ot.data);else if(M.isData3DTexture)O?(ut&&e.texStorage3D(s.TEXTURE_3D,At,Nt,ot.width,ot.height,ot.depth),vt&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,St,kt,ot.data)):e.texImage3D(s.TEXTURE_3D,0,Nt,ot.width,ot.height,ot.depth,0,St,kt,ot.data);else if(M.isFramebufferTexture){if(ut)if(O)e.texStorage2D(s.TEXTURE_2D,At,Nt,ot.width,ot.height);else{let at=ot.width,tt=ot.height;for(let It=0;It<At;It++)e.texImage2D(s.TEXTURE_2D,It,Nt,at,tt,0,St,kt,null),at>>=1,tt>>=1}}else if(qt.length>0){if(O&&ut){const at=Ht(qt[0]);e.texStorage2D(s.TEXTURE_2D,At,Nt,at.width,at.height)}for(let at=0,tt=qt.length;at<tt;at++)_t=qt[at],O?vt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,St,kt,_t):e.texImage2D(s.TEXTURE_2D,at,Nt,St,kt,_t);M.generateMipmaps=!1}else if(O){if(ut){const at=Ht(ot);e.texStorage2D(s.TEXTURE_2D,At,Nt,at.width,at.height)}vt&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,St,kt,ot)}else e.texImage2D(s.TEXTURE_2D,0,Nt,St,kt,ot);g(M)&&p(q),Dt.__version=$.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function et(C,M,V){if(M.image.length!==6)return;const q=Xt(C,M),nt=M.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+V);const $=n.get(nt);if(nt.version!==$.__version||q===!0){e.activeTexture(s.TEXTURE0+V);const Dt=ae.getPrimaries(ae.workingColorSpace),ft=M.colorSpace===Oi?null:ae.getPrimaries(M.colorSpace),Pt=M.colorSpace===Oi||Dt===ft?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Lt=M.isCompressedTexture||M.image[0].isCompressedTexture,ot=M.image[0]&&M.image[0].isDataTexture,St=[];for(let tt=0;tt<6;tt++)!Lt&&!ot?St[tt]=v(M.image[tt],!0,i.maxCubemapSize):St[tt]=ot?M.image[tt].image:M.image[tt],St[tt]=Vt(M,St[tt]);const kt=St[0],Nt=r.convert(M.format,M.colorSpace),_t=r.convert(M.type),qt=y(M.internalFormat,Nt,_t,M.colorSpace),O=M.isVideoTexture!==!0,ut=$.__version===void 0||q===!0,vt=nt.dataReady;let At=T(M,kt);ct(s.TEXTURE_CUBE_MAP,M);let at;if(Lt){O&&ut&&e.texStorage2D(s.TEXTURE_CUBE_MAP,At,qt,kt.width,kt.height);for(let tt=0;tt<6;tt++){at=St[tt].mipmaps;for(let It=0;It<at.length;It++){const Wt=at[It];M.format!==Gn?Nt!==null?O?vt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,0,0,Wt.width,Wt.height,Nt,Wt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,qt,Wt.width,Wt.height,0,Wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?vt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,0,0,Wt.width,Wt.height,Nt,_t,Wt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,qt,Wt.width,Wt.height,0,Nt,_t,Wt.data)}}}else{if(at=M.mipmaps,O&&ut){at.length>0&&At++;const tt=Ht(St[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,At,qt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(ot){O?vt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,St[tt].width,St[tt].height,Nt,_t,St[tt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,qt,St[tt].width,St[tt].height,0,Nt,_t,St[tt].data);for(let It=0;It<at.length;It++){const _e=at[It].image[tt].image;O?vt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,0,0,_e.width,_e.height,Nt,_t,_e.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,qt,_e.width,_e.height,0,Nt,_t,_e.data)}}else{O?vt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Nt,_t,St[tt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,qt,Nt,_t,St[tt]);for(let It=0;It<at.length;It++){const Wt=at[It];O?vt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,0,0,Nt,_t,Wt.image[tt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,qt,Nt,_t,Wt.image[tt])}}}g(M)&&p(s.TEXTURE_CUBE_MAP),$.__version=nt.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function bt(C,M,V,q,nt,$){const Dt=r.convert(V.format,V.colorSpace),ft=r.convert(V.type),Pt=y(V.internalFormat,Dt,ft,V.colorSpace),Lt=n.get(M),ot=n.get(V);if(ot.__renderTarget=M,!Lt.__hasExternalTextures){const St=Math.max(1,M.width>>$),kt=Math.max(1,M.height>>$);nt===s.TEXTURE_3D||nt===s.TEXTURE_2D_ARRAY?e.texImage3D(nt,$,Pt,St,kt,M.depth,0,Dt,ft,null):e.texImage2D(nt,$,Pt,St,kt,0,Dt,ft,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),rt(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,q,nt,ot.__webglTexture,0,mt(M)):(nt===s.TEXTURE_2D||nt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,q,nt,ot.__webglTexture,$),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ut(C,M,V){if(s.bindRenderbuffer(s.RENDERBUFFER,C),M.depthBuffer){const q=M.depthTexture,nt=q&&q.isDepthTexture?q.type:null,$=_(M.stencilBuffer,nt),Dt=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ft=mt(M);rt(M)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ft,$,M.width,M.height):V?s.renderbufferStorageMultisample(s.RENDERBUFFER,ft,$,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,$,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Dt,s.RENDERBUFFER,C)}else{const q=M.textures;for(let nt=0;nt<q.length;nt++){const $=q[nt],Dt=r.convert($.format,$.colorSpace),ft=r.convert($.type),Pt=y($.internalFormat,Dt,ft,$.colorSpace),Lt=mt(M);V&&rt(M)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt,Pt,M.width,M.height):rt(M)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt,Pt,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Pt,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Rt(C,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(M.depthTexture);q.__renderTarget=M,(!q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),F(M.depthTexture,0);const nt=q.__webglTexture,$=mt(M);if(M.depthTexture.format===Wr)rt(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,nt,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,nt,0);else if(M.depthTexture.format===Xr)rt(M)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,nt,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function ee(C){const M=n.get(C),V=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){const q=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),q){const nt=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,q.removeEventListener("dispose",nt)};q.addEventListener("dispose",nt),M.__depthDisposeCallback=nt}M.__boundDepthTexture=q}if(C.depthTexture&&!M.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const q=C.texture.mipmaps;q&&q.length>0?Rt(M.__webglFramebuffer[0],C):Rt(M.__webglFramebuffer,C)}else if(V){M.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[q]),M.__webglDepthbuffer[q]===void 0)M.__webglDepthbuffer[q]=s.createRenderbuffer(),Ut(M.__webglDepthbuffer[q],C,!1);else{const nt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer[q];s.bindRenderbuffer(s.RENDERBUFFER,$),s.framebufferRenderbuffer(s.FRAMEBUFFER,nt,s.RENDERBUFFER,$)}}else{const q=C.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),Ut(M.__webglDepthbuffer,C,!1);else{const nt=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,$),s.framebufferRenderbuffer(s.FRAMEBUFFER,nt,s.RENDERBUFFER,$)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function xe(C,M,V){const q=n.get(C);M!==void 0&&bt(q.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),V!==void 0&&ee(C)}function L(C){const M=C.texture,V=n.get(C),q=n.get(M);C.addEventListener("dispose",R);const nt=C.textures,$=C.isWebGLCubeRenderTarget===!0,Dt=nt.length>1;if(Dt||(q.__webglTexture===void 0&&(q.__webglTexture=s.createTexture()),q.__version=M.version,o.memory.textures++),$){V.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[ft]=[];for(let Pt=0;Pt<M.mipmaps.length;Pt++)V.__webglFramebuffer[ft][Pt]=s.createFramebuffer()}else V.__webglFramebuffer[ft]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let ft=0;ft<M.mipmaps.length;ft++)V.__webglFramebuffer[ft]=s.createFramebuffer()}else V.__webglFramebuffer=s.createFramebuffer();if(Dt)for(let ft=0,Pt=nt.length;ft<Pt;ft++){const Lt=n.get(nt[ft]);Lt.__webglTexture===void 0&&(Lt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&rt(C)===!1){V.__webglMultisampledFramebuffer=s.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ft=0;ft<nt.length;ft++){const Pt=nt[ft];V.__webglColorRenderbuffer[ft]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,V.__webglColorRenderbuffer[ft]);const Lt=r.convert(Pt.format,Pt.colorSpace),ot=r.convert(Pt.type),St=y(Pt.internalFormat,Lt,ot,Pt.colorSpace,C.isXRRenderTarget===!0),kt=mt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,kt,St,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,V.__webglColorRenderbuffer[ft])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=s.createRenderbuffer(),Ut(V.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if($){e.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture),ct(s.TEXTURE_CUBE_MAP,M);for(let ft=0;ft<6;ft++)if(M.mipmaps&&M.mipmaps.length>0)for(let Pt=0;Pt<M.mipmaps.length;Pt++)bt(V.__webglFramebuffer[ft][Pt],C,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ft,Pt);else bt(V.__webglFramebuffer[ft],C,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);g(M)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Dt){for(let ft=0,Pt=nt.length;ft<Pt;ft++){const Lt=nt[ft],ot=n.get(Lt);let St=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(St=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(St,ot.__webglTexture),ct(St,Lt),bt(V.__webglFramebuffer,C,Lt,s.COLOR_ATTACHMENT0+ft,St,0),g(Lt)&&p(St)}e.unbindTexture()}else{let ft=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ft=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ft,q.__webglTexture),ct(ft,M),M.mipmaps&&M.mipmaps.length>0)for(let Pt=0;Pt<M.mipmaps.length;Pt++)bt(V.__webglFramebuffer[Pt],C,M,s.COLOR_ATTACHMENT0,ft,Pt);else bt(V.__webglFramebuffer,C,M,s.COLOR_ATTACHMENT0,ft,0);g(M)&&p(ft),e.unbindTexture()}C.depthBuffer&&ee(C)}function it(C){const M=C.textures;for(let V=0,q=M.length;V<q;V++){const nt=M[V];if(g(nt)){const $=x(C),Dt=n.get(nt).__webglTexture;e.bindTexture($,Dt),p($),e.unbindTexture()}}}const Q=[],J=[];function K(C){if(C.samples>0){if(rt(C)===!1){const M=C.textures,V=C.width,q=C.height;let nt=s.COLOR_BUFFER_BIT;const $=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Dt=n.get(C),ft=M.length>1;if(ft)for(let Lt=0;Lt<M.length;Lt++)e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer);const Pt=C.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglFramebuffer);for(let Lt=0;Lt<M.length;Lt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(nt|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(nt|=s.STENCIL_BUFFER_BIT)),ft){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Dt.__webglColorRenderbuffer[Lt]);const ot=n.get(M[Lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ot,0)}s.blitFramebuffer(0,0,V,q,0,0,V,q,nt,s.NEAREST),l===!0&&(Q.length=0,J.length=0,Q.push(s.COLOR_ATTACHMENT0+Lt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Q.push($),J.push($),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,J)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Q))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ft)for(let Lt=0;Lt<M.length;Lt++){e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,Dt.__webglColorRenderbuffer[Lt]);const ot=n.get(M[Lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,ot,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const M=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function mt(C){return Math.min(i.maxSamples,C.samples)}function rt(C){const M=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function gt(C){const M=o.render.frame;h.get(C)!==M&&(h.set(C,M),C.update())}function Vt(C,M){const V=C.colorSpace,q=C.format,nt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==or&&V!==Oi&&(ae.getTransfer(V)===fe?(q!==Gn||nt!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),M}function Ht(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=k,this.setTexture2D=F,this.setTexture2DArray=U,this.setTexture3D=Y,this.setTextureCube=G,this.rebindTextures=xe,this.setupRenderTarget=L,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=rt}function cy(s,t){function e(n,i=Oi){let r;const o=ae.getTransfer(i);if(n===ei)return s.UNSIGNED_BYTE;if(n===Xc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===qc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Rd)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Pd)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ad)return s.BYTE;if(n===Cd)return s.SHORT;if(n===Hr)return s.UNSIGNED_SHORT;if(n===Wc)return s.INT;if(n===gs)return s.UNSIGNED_INT;if(n===yi)return s.FLOAT;if(n===ho)return s.HALF_FLOAT;if(n===Ld)return s.ALPHA;if(n===Id)return s.RGB;if(n===Gn)return s.RGBA;if(n===Wr)return s.DEPTH_COMPONENT;if(n===Xr)return s.DEPTH_STENCIL;if(n===Dd)return s.RED;if(n===Yc)return s.RED_INTEGER;if(n===Nd)return s.RG;if(n===$c)return s.RG_INTEGER;if(n===jc)return s.RGBA_INTEGER;if(n===fa||n===pa||n===ma||n===ga)if(o===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===nc||n===ic||n===sc||n===rc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===nc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ic)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===sc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===rc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===oc||n===ac||n===lc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===oc||n===ac)return o===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===lc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===cc||n===hc||n===uc||n===dc||n===fc||n===pc||n===mc||n===gc||n===vc||n===xc||n===_c||n===yc||n===Mc||n===Sc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===cc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===hc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===uc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===dc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===pc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===mc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===gc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===_c)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Mc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Sc)return o===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wc||n===Ec||n===bc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wc)return o===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ec)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===bc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Tc||n===Ac||n===Cc||n===Rc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Tc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ac)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Cc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Rc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Vr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const hy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uy=`
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

}`;class dy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new $d(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Dn({vertexShader:hy,fragmentShader:uy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new Xi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fy extends pr{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,m=null;const v=typeof XRWebGLBinding<"u",g=new dy,p={},x=e.getContextAttributes();let y=null,_=null;const T=[],A=[],R=new ht;let I=null;const b=new An;b.viewport=new ue;const w=new An;w.viewport=new ue;const P=[b,w],k=new Ng;let D=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let et=T[j];return et===void 0&&(et=new _l,T[j]=et),et.getTargetRaySpace()},this.getControllerGrip=function(j){let et=T[j];return et===void 0&&(et=new _l,T[j]=et),et.getGripSpace()},this.getHand=function(j){let et=T[j];return et===void 0&&(et=new _l,T[j]=et),et.getHandSpace()};function F(j){const et=A.indexOf(j.inputSource);if(et===-1)return;const bt=T[et];bt!==void 0&&(bt.update(j.inputSource,j.frame,c||o),bt.dispatchEvent({type:j.type,data:j.inputSource}))}function U(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",U),i.removeEventListener("inputsourceschange",Y);for(let j=0;j<T.length;j++){const et=A[j];et!==null&&(A[j]=null,T[j].disconnect(et))}D=null,B=null,g.reset();for(const j in p)delete p[j];t.setRenderTarget(y),f=null,u=null,d=null,i=null,_=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(y=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",U),i.addEventListener("inputsourceschange",Y),x.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,Ut=null,Rt=null;x.depth&&(Rt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,bt=x.stencil?Xr:Wr,Ut=x.stencil?Vr:gs);const ee={colorFormat:e.RGBA8,depthFormat:Rt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ee),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new vs(u.textureWidth,u.textureHeight,{format:Gn,type:ei,depthTexture:new Yd(u.textureWidth,u.textureHeight,Ut,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const bt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,bt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new vs(f.framebufferWidth,f.framebufferHeight,{format:Gn,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Jt.setContext(i),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Y(j){for(let et=0;et<j.removed.length;et++){const bt=j.removed[et],Ut=A.indexOf(bt);Ut>=0&&(A[Ut]=null,T[Ut].disconnect(bt))}for(let et=0;et<j.added.length;et++){const bt=j.added[et];let Ut=A.indexOf(bt);if(Ut===-1){for(let ee=0;ee<T.length;ee++)if(ee>=A.length){A.push(bt),Ut=ee;break}else if(A[ee]===null){A[ee]=bt,Ut=ee;break}if(Ut===-1)break}const Rt=T[Ut];Rt&&Rt.connect(bt)}}const G=new N,Z=new N;function dt(j,et,bt){G.setFromMatrixPosition(et.matrixWorld),Z.setFromMatrixPosition(bt.matrixWorld);const Ut=G.distanceTo(Z),Rt=et.projectionMatrix.elements,ee=bt.projectionMatrix.elements,xe=Rt[14]/(Rt[10]-1),L=Rt[14]/(Rt[10]+1),it=(Rt[9]+1)/Rt[5],Q=(Rt[9]-1)/Rt[5],J=(Rt[8]-1)/Rt[0],K=(ee[8]+1)/ee[0],mt=xe*J,rt=xe*K,gt=Ut/(-J+K),Vt=gt*-J;if(et.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Vt),j.translateZ(gt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Rt[10]===-1)j.projectionMatrix.copy(et.projectionMatrix),j.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const Ht=xe+gt,C=L+gt,M=mt-Vt,V=rt+(Ut-Vt),q=it*L/C*Ht,nt=Q*L/C*Ht;j.projectionMatrix.makePerspective(M,V,q,nt,Ht,C),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function pt(j,et){et===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(et.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let et=j.near,bt=j.far;g.texture!==null&&(g.depthNear>0&&(et=g.depthNear),g.depthFar>0&&(bt=g.depthFar)),k.near=w.near=b.near=et,k.far=w.far=b.far=bt,(D!==k.near||B!==k.far)&&(i.updateRenderState({depthNear:k.near,depthFar:k.far}),D=k.near,B=k.far),k.layers.mask=j.layers.mask|6,b.layers.mask=k.layers.mask&3,w.layers.mask=k.layers.mask&5;const Ut=j.parent,Rt=k.cameras;pt(k,Ut);for(let ee=0;ee<Rt.length;ee++)pt(Rt[ee],Ut);Rt.length===2?dt(k,b,w):k.projectionMatrix.copy(b.projectionMatrix),ct(j,k,Ut)};function ct(j,et,bt){bt===null?j.matrix.copy(et.matrixWorld):(j.matrix.copy(bt.matrixWorld),j.matrix.invert(),j.matrix.multiply(et.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(et.projectionMatrix),j.projectionMatrixInverse.copy(et.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=qr*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(j){l=j,u!==null&&(u.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(j){return p[j]};let Xt=null;function ie(j,et){if(h=et.getViewerPose(c||o),m=et,h!==null){const bt=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Ut=!1;bt.length!==k.cameras.length&&(k.cameras.length=0,Ut=!0);for(let L=0;L<bt.length;L++){const it=bt[L];let Q=null;if(f!==null)Q=f.getViewport(it);else{const K=d.getViewSubImage(u,it);Q=K.viewport,L===0&&(t.setRenderTargetTextures(_,K.colorTexture,K.depthStencilTexture),t.setRenderTarget(_))}let J=P[L];J===void 0&&(J=new An,J.layers.enable(L),J.viewport=new ue,P[L]=J),J.matrix.fromArray(it.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(it.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Q.x,Q.y,Q.width,Q.height),L===0&&(k.matrix.copy(J.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Ut===!0&&k.cameras.push(J)}const Rt=i.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const L=d.getDepthInformation(bt[0]);L&&L.isValid&&L.texture&&g.init(L,i.renderState)}if(Rt&&Rt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let L=0;L<bt.length;L++){const it=bt[L].camera;if(it){let Q=p[it];Q||(Q=new $d,p[it]=Q);const J=d.getCameraImage(it);Q.sourceTexture=J}}}}for(let bt=0;bt<T.length;bt++){const Ut=A[bt],Rt=T[bt];Ut!==null&&Rt!==void 0&&Rt.update(Ut,et,c||o)}Xt&&Xt(j,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),m=null}const Jt=new of;Jt.setAnimationLoop(ie),this.setAnimationLoop=function(j){Xt=j},this.dispose=function(){}}}const is=new ni,py=new Me;function my(s,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Vd(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,x,y,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&f(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,x,y):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===ln&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===ln&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=t.get(p),y=x.envMap,_=x.envMapRotation;y&&(g.envMap.value=y,is.copy(_),is.x*=-1,is.y*=-1,is.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),g.envMapRotation.value.setFromMatrix4(py.makeRotationFromEuler(is)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=y*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ln&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const x=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function gy(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const _=y.program;n.uniformBlockBinding(x,_)}function c(x,y){let _=i[x.id];_===void 0&&(m(x),_=h(x),i[x.id]=_,x.addEventListener("dispose",g));const T=y.program;n.updateUBOMapping(x,T);const A=t.render.frame;r[x.id]!==A&&(u(x),r[x.id]=A)}function h(x){const y=d();x.__bindingPointIndex=y;const _=s.createBuffer(),T=x.__size,A=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,T,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,_),_}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const y=i[x.id],_=x.uniforms,T=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let A=0,R=_.length;A<R;A++){const I=Array.isArray(_[A])?_[A]:[_[A]];for(let b=0,w=I.length;b<w;b++){const P=I[b];if(f(P,A,b,T)===!0){const k=P.__offset,D=Array.isArray(P.value)?P.value:[P.value];let B=0;for(let F=0;F<D.length;F++){const U=D[F],Y=v(U);typeof U=="number"||typeof U=="boolean"?(P.__data[0]=U,s.bufferSubData(s.UNIFORM_BUFFER,k+B,P.__data)):U.isMatrix3?(P.__data[0]=U.elements[0],P.__data[1]=U.elements[1],P.__data[2]=U.elements[2],P.__data[3]=0,P.__data[4]=U.elements[3],P.__data[5]=U.elements[4],P.__data[6]=U.elements[5],P.__data[7]=0,P.__data[8]=U.elements[6],P.__data[9]=U.elements[7],P.__data[10]=U.elements[8],P.__data[11]=0):(U.toArray(P.__data,B),B+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,y,_,T){const A=x.value,R=y+"_"+_;if(T[R]===void 0)return typeof A=="number"||typeof A=="boolean"?T[R]=A:T[R]=A.clone(),!0;{const I=T[R];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return T[R]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function m(x){const y=x.uniforms;let _=0;const T=16;for(let R=0,I=y.length;R<I;R++){const b=Array.isArray(y[R])?y[R]:[y[R]];for(let w=0,P=b.length;w<P;w++){const k=b[w],D=Array.isArray(k.value)?k.value:[k.value];for(let B=0,F=D.length;B<F;B++){const U=D[B],Y=v(U),G=_%T,Z=G%Y.boundary,dt=G+Z;_+=Z,dt!==0&&T-dt<Y.storage&&(_+=T-dt),k.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=_,_+=Y.storage}}}const A=_%T;return A>0&&(_+=T-A),x.__size=_,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function g(x){const y=x.target;y.removeEventListener("dispose",g);const _=o.indexOf(y.__bindingPointIndex);o.splice(_,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}class vy{constructor(t={}){const{canvas:e=fm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let T=!1;this._outputColorSpace=an;let A=0,R=0,I=null,b=-1,w=null;const P=new ue,k=new ue;let D=null;const B=new te(0);let F=0,U=e.width,Y=e.height,G=1,Z=null,dt=null;const pt=new ue(0,0,U,Y),ct=new ue(0,0,U,Y);let Xt=!1;const ie=new Qc;let Jt=!1,j=!1;const et=new Me,bt=new N,Ut=new ue,Rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function xe(){return I===null?G:1}let L=n;function it(E,z){return e.getContext(E,z)}try{const E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Vc}`),e.addEventListener("webglcontextlost",vt,!1),e.addEventListener("webglcontextrestored",At,!1),e.addEventListener("webglcontextcreationerror",at,!1),L===null){const z="webgl2";if(L=it(z,E),L===null)throw it(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Q,J,K,mt,rt,gt,Vt,Ht,C,M,V,q,nt,$,Dt,ft,Pt,Lt,ot,St,kt,Nt,_t,qt;function O(){Q=new Ax(L),Q.init(),Nt=new cy(L,Q),J=new yx(L,Q,t,Nt),K=new ay(L,Q),J.reversedDepthBuffer&&u&&K.buffers.depth.setReversed(!0),mt=new Px(L),rt=new $_,gt=new ly(L,Q,K,rt,J,Nt,mt),Vt=new Sx(_),Ht=new Tx(_),C=new Fg(L),_t=new xx(L,C),M=new Cx(L,C,mt,_t),V=new Ix(L,M,C,mt),ot=new Lx(L,J,gt),ft=new Mx(rt),q=new Y_(_,Vt,Ht,Q,J,_t,ft),nt=new my(_,rt),$=new Z_,Dt=new ny(Q),Lt=new vx(_,Vt,Ht,K,V,f,l),Pt=new ry(_,V,J),qt=new gy(L,mt,J,K),St=new _x(L,Q,mt),kt=new Rx(L,Q,mt),mt.programs=q.programs,_.capabilities=J,_.extensions=Q,_.properties=rt,_.renderLists=$,_.shadowMap=Pt,_.state=K,_.info=mt}O();const ut=new fy(_,L);this.xr=ut,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=Q.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Q.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(E){E!==void 0&&(G=E,this.setSize(U,Y,!1))},this.getSize=function(E){return E.set(U,Y)},this.setSize=function(E,z,W=!0){if(ut.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=E,Y=z,e.width=Math.floor(E*G),e.height=Math.floor(z*G),W===!0&&(e.style.width=E+"px",e.style.height=z+"px"),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(U*G,Y*G).floor()},this.setDrawingBufferSize=function(E,z,W){U=E,Y=z,G=W,e.width=Math.floor(E*W),e.height=Math.floor(z*W),this.setViewport(0,0,E,z)},this.getCurrentViewport=function(E){return E.copy(P)},this.getViewport=function(E){return E.copy(pt)},this.setViewport=function(E,z,W,X){E.isVector4?pt.set(E.x,E.y,E.z,E.w):pt.set(E,z,W,X),K.viewport(P.copy(pt).multiplyScalar(G).round())},this.getScissor=function(E){return E.copy(ct)},this.setScissor=function(E,z,W,X){E.isVector4?ct.set(E.x,E.y,E.z,E.w):ct.set(E,z,W,X),K.scissor(k.copy(ct).multiplyScalar(G).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(E){K.setScissorTest(Xt=E)},this.setOpaqueSort=function(E){Z=E},this.setTransparentSort=function(E){dt=E},this.getClearColor=function(E){return E.copy(Lt.getClearColor())},this.setClearColor=function(){Lt.setClearColor(...arguments)},this.getClearAlpha=function(){return Lt.getClearAlpha()},this.setClearAlpha=function(){Lt.setClearAlpha(...arguments)},this.clear=function(E=!0,z=!0,W=!0){let X=0;if(E){let H=!1;if(I!==null){const lt=I.texture.format;H=lt===jc||lt===$c||lt===Yc}if(H){const lt=I.texture.type,yt=lt===ei||lt===gs||lt===Hr||lt===Vr||lt===Xc||lt===qc,Ct=Lt.getClearColor(),Et=Lt.getClearAlpha(),zt=Ct.r,Gt=Ct.g,Ft=Ct.b;yt?(m[0]=zt,m[1]=Gt,m[2]=Ft,m[3]=Et,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=zt,v[1]=Gt,v[2]=Ft,v[3]=Et,L.clearBufferiv(L.COLOR,0,v))}else X|=L.COLOR_BUFFER_BIT}z&&(X|=L.DEPTH_BUFFER_BIT),W&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",vt,!1),e.removeEventListener("webglcontextrestored",At,!1),e.removeEventListener("webglcontextcreationerror",at,!1),Lt.dispose(),$.dispose(),Dt.dispose(),rt.dispose(),Vt.dispose(),Ht.dispose(),V.dispose(),_t.dispose(),qt.dispose(),q.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",Wn),ut.removeEventListener("sessionend",Fh),Zi.stop()};function vt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function At(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const E=mt.autoReset,z=Pt.enabled,W=Pt.autoUpdate,X=Pt.needsUpdate,H=Pt.type;O(),mt.autoReset=E,Pt.enabled=z,Pt.autoUpdate=W,Pt.needsUpdate=X,Pt.type=H}function at(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function tt(E){const z=E.target;z.removeEventListener("dispose",tt),It(z)}function It(E){Wt(E),rt.remove(E)}function Wt(E){const z=rt.get(E).programs;z!==void 0&&(z.forEach(function(W){q.releaseProgram(W)}),E.isShaderMaterial&&q.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,W,X,H,lt){z===null&&(z=Rt);const yt=H.isMesh&&H.matrixWorld.determinant()<0,Ct=rp(E,z,W,X,H);K.setMaterial(X,yt);let Et=W.index,zt=1;if(X.wireframe===!0){if(Et=M.getWireframeAttribute(W),Et===void 0)return;zt=2}const Gt=W.drawRange,Ft=W.attributes.position;let ne=Gt.start*zt,de=(Gt.start+Gt.count)*zt;lt!==null&&(ne=Math.max(ne,lt.start*zt),de=Math.min(de,(lt.start+lt.count)*zt)),Et!==null?(ne=Math.max(ne,0),de=Math.min(de,Et.count)):Ft!=null&&(ne=Math.max(ne,0),de=Math.min(de,Ft.count));const Re=de-ne;if(Re<0||Re===1/0)return;_t.setup(H,X,Ct,W,Et);let Se,ge=St;if(Et!==null&&(Se=C.get(Et),ge=kt,ge.setIndex(Se)),H.isMesh)X.wireframe===!0?(K.setLineWidth(X.wireframeLinewidth*xe()),ge.setMode(L.LINES)):ge.setMode(L.TRIANGLES);else if(H.isLine){let Bt=X.linewidth;Bt===void 0&&(Bt=1),K.setLineWidth(Bt*xe()),H.isLineSegments?ge.setMode(L.LINES):H.isLineLoop?ge.setMode(L.LINE_LOOP):ge.setMode(L.LINE_STRIP)}else H.isPoints?ge.setMode(L.POINTS):H.isSprite&&ge.setMode(L.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Yr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ge.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))ge.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Bt=H._multiDrawStarts,be=H._multiDrawCounts,oe=H._multiDrawCount,cn=Et?C.get(Et).bytesPerElement:1,Cs=rt.get(X).currentProgram.getUniforms();for(let hn=0;hn<oe;hn++)Cs.setValue(L,"_gl_DrawID",hn),ge.render(Bt[hn]/cn,be[hn])}else if(H.isInstancedMesh)ge.renderInstances(ne,Re,H.count);else if(W.isInstancedBufferGeometry){const Bt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,be=Math.min(W.instanceCount,Bt);ge.renderInstances(ne,Re,be)}else ge.render(ne,Re)};function _e(E,z,W){E.transparent===!0&&E.side===Cn&&E.forceSinglePass===!1?(E.side=ln,E.needsUpdate=!0,To(E,z,W),E.side=Vi,E.needsUpdate=!0,To(E,z,W),E.side=Cn):To(E,z,W)}this.compile=function(E,z,W=null){W===null&&(W=E),p=Dt.get(W),p.init(z),y.push(p),W.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),E!==W&&E.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const X=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const lt=H.material;if(lt)if(Array.isArray(lt))for(let yt=0;yt<lt.length;yt++){const Ct=lt[yt];_e(Ct,W,H),X.add(Ct)}else _e(lt,W,H),X.add(lt)}),p=y.pop(),X},this.compileAsync=function(E,z,W=null){const X=this.compile(E,z,W);return new Promise(H=>{function lt(){if(X.forEach(function(yt){rt.get(yt).currentProgram.isReady()&&X.delete(yt)}),X.size===0){H(E);return}setTimeout(lt,10)}Q.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let ce=null;function oi(E){ce&&ce(E)}function Wn(){Zi.stop()}function Fh(){Zi.start()}const Zi=new of;Zi.setAnimationLoop(oi),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(E){ce=E,ut.setAnimationLoop(E),E===null?Zi.stop():Zi.start()},ut.addEventListener("sessionstart",Wn),ut.addEventListener("sessionend",Fh),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(z),z=ut.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,z,I),p=Dt.get(E,y.length),p.init(z),y.push(p),et.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),ie.setFromProjectionMatrix(et,Kn,z.reversedDepth),j=this.localClippingEnabled,Jt=ft.init(this.clippingPlanes,j),g=$.get(E,x.length),g.init(),x.push(g),ut.enabled===!0&&ut.isPresenting===!0){const lt=_.xr.getDepthSensingMesh();lt!==null&&Za(lt,z,-1/0,_.sortObjects)}Za(E,z,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(Z,dt),ee=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,ee&&Lt.addToRenderList(g,E),this.info.render.frame++,Jt===!0&&ft.beginShadows();const W=p.state.shadowsArray;Pt.render(W,E,z),Jt===!0&&ft.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=g.opaque,H=g.transmissive;if(p.setupLights(),z.isArrayCamera){const lt=z.cameras;if(H.length>0)for(let yt=0,Ct=lt.length;yt<Ct;yt++){const Et=lt[yt];Bh(X,H,E,Et)}ee&&Lt.render(E);for(let yt=0,Ct=lt.length;yt<Ct;yt++){const Et=lt[yt];Oh(g,E,Et,Et.viewport)}}else H.length>0&&Bh(X,H,E,z),ee&&Lt.render(E),Oh(g,E,z);I!==null&&R===0&&(gt.updateMultisampleRenderTarget(I),gt.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(_,E,z),_t.resetDefaultState(),b=-1,w=null,y.pop(),y.length>0?(p=y[y.length-1],Jt===!0&&ft.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function Za(E,z,W,X){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ie.intersectsSprite(E)){X&&Ut.setFromMatrixPosition(E.matrixWorld).applyMatrix4(et);const yt=V.update(E),Ct=E.material;Ct.visible&&g.push(E,yt,Ct,W,Ut.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ie.intersectsObject(E))){const yt=V.update(E),Ct=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ut.copy(E.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),Ut.copy(yt.boundingSphere.center)),Ut.applyMatrix4(E.matrixWorld).applyMatrix4(et)),Array.isArray(Ct)){const Et=yt.groups;for(let zt=0,Gt=Et.length;zt<Gt;zt++){const Ft=Et[zt],ne=Ct[Ft.materialIndex];ne&&ne.visible&&g.push(E,yt,ne,W,Ut.z,Ft)}}else Ct.visible&&g.push(E,yt,Ct,W,Ut.z,null)}}const lt=E.children;for(let yt=0,Ct=lt.length;yt<Ct;yt++)Za(lt[yt],z,W,X)}function Oh(E,z,W,X){const H=E.opaque,lt=E.transmissive,yt=E.transparent;p.setupLightsView(W),Jt===!0&&ft.setGlobalState(_.clippingPlanes,W),X&&K.viewport(P.copy(X)),H.length>0&&bo(H,z,W),lt.length>0&&bo(lt,z,W),yt.length>0&&bo(yt,z,W),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function Bh(E,z,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new vs(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?ho:ei,minFilter:ds,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ae.workingColorSpace}));const lt=p.state.transmissionRenderTarget[X.id],yt=X.viewport||P;lt.setSize(yt.z*_.transmissionResolutionScale,yt.w*_.transmissionResolutionScale);const Ct=_.getRenderTarget(),Et=_.getActiveCubeFace(),zt=_.getActiveMipmapLevel();_.setRenderTarget(lt),_.getClearColor(B),F=_.getClearAlpha(),F<1&&_.setClearColor(16777215,.5),_.clear(),ee&&Lt.render(W);const Gt=_.toneMapping;_.toneMapping=ki;const Ft=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),Jt===!0&&ft.setGlobalState(_.clippingPlanes,X),bo(E,W,X),gt.updateMultisampleRenderTarget(lt),gt.updateRenderTargetMipmap(lt),Q.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let de=0,Re=z.length;de<Re;de++){const Se=z[de],ge=Se.object,Bt=Se.geometry,be=Se.material,oe=Se.group;if(be.side===Cn&&ge.layers.test(X.layers)){const cn=be.side;be.side=ln,be.needsUpdate=!0,zh(ge,W,X,Bt,be,oe),be.side=cn,be.needsUpdate=!0,ne=!0}}ne===!0&&(gt.updateMultisampleRenderTarget(lt),gt.updateRenderTargetMipmap(lt))}_.setRenderTarget(Ct,Et,zt),_.setClearColor(B,F),Ft!==void 0&&(X.viewport=Ft),_.toneMapping=Gt}function bo(E,z,W){const X=z.isScene===!0?z.overrideMaterial:null;for(let H=0,lt=E.length;H<lt;H++){const yt=E[H],Ct=yt.object,Et=yt.geometry,zt=yt.group;let Gt=yt.material;Gt.allowOverride===!0&&X!==null&&(Gt=X),Ct.layers.test(W.layers)&&zh(Ct,z,W,Et,Gt,zt)}}function zh(E,z,W,X,H,lt){E.onBeforeRender(_,z,W,X,H,lt),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(_,z,W,X,E,lt),H.transparent===!0&&H.side===Cn&&H.forceSinglePass===!1?(H.side=ln,H.needsUpdate=!0,_.renderBufferDirect(W,z,X,H,E,lt),H.side=Vi,H.needsUpdate=!0,_.renderBufferDirect(W,z,X,H,E,lt),H.side=Cn):_.renderBufferDirect(W,z,X,H,E,lt),E.onAfterRender(_,z,W,X,H,lt)}function To(E,z,W){z.isScene!==!0&&(z=Rt);const X=rt.get(E),H=p.state.lights,lt=p.state.shadowsArray,yt=H.state.version,Ct=q.getParameters(E,H.state,lt,z,W),Et=q.getProgramCacheKey(Ct);let zt=X.programs;X.environment=E.isMeshStandardMaterial?z.environment:null,X.fog=z.fog,X.envMap=(E.isMeshStandardMaterial?Ht:Vt).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,zt===void 0&&(E.addEventListener("dispose",tt),zt=new Map,X.programs=zt);let Gt=zt.get(Et);if(Gt!==void 0){if(X.currentProgram===Gt&&X.lightsStateVersion===yt)return Gh(E,Ct),Gt}else Ct.uniforms=q.getUniforms(E),E.onBeforeCompile(Ct,_),Gt=q.acquireProgram(Ct,Et),zt.set(Et,Gt),X.uniforms=Ct.uniforms;const Ft=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ft.clippingPlanes=ft.uniform),Gh(E,Ct),X.needsLights=ap(E),X.lightsStateVersion=yt,X.needsLights&&(Ft.ambientLightColor.value=H.state.ambient,Ft.lightProbe.value=H.state.probe,Ft.directionalLights.value=H.state.directional,Ft.directionalLightShadows.value=H.state.directionalShadow,Ft.spotLights.value=H.state.spot,Ft.spotLightShadows.value=H.state.spotShadow,Ft.rectAreaLights.value=H.state.rectArea,Ft.ltc_1.value=H.state.rectAreaLTC1,Ft.ltc_2.value=H.state.rectAreaLTC2,Ft.pointLights.value=H.state.point,Ft.pointLightShadows.value=H.state.pointShadow,Ft.hemisphereLights.value=H.state.hemi,Ft.directionalShadowMap.value=H.state.directionalShadowMap,Ft.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ft.spotShadowMap.value=H.state.spotShadowMap,Ft.spotLightMatrix.value=H.state.spotLightMatrix,Ft.spotLightMap.value=H.state.spotLightMap,Ft.pointShadowMap.value=H.state.pointShadowMap,Ft.pointShadowMatrix.value=H.state.pointShadowMatrix),X.currentProgram=Gt,X.uniformsList=null,Gt}function kh(E){if(E.uniformsList===null){const z=E.currentProgram.getUniforms();E.uniformsList=va.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function Gh(E,z){const W=rt.get(E);W.outputColorSpace=z.outputColorSpace,W.batching=z.batching,W.batchingColor=z.batchingColor,W.instancing=z.instancing,W.instancingColor=z.instancingColor,W.instancingMorph=z.instancingMorph,W.skinning=z.skinning,W.morphTargets=z.morphTargets,W.morphNormals=z.morphNormals,W.morphColors=z.morphColors,W.morphTargetsCount=z.morphTargetsCount,W.numClippingPlanes=z.numClippingPlanes,W.numIntersection=z.numClipIntersection,W.vertexAlphas=z.vertexAlphas,W.vertexTangents=z.vertexTangents,W.toneMapping=z.toneMapping}function rp(E,z,W,X,H){z.isScene!==!0&&(z=Rt),gt.resetTextureUnits();const lt=z.fog,yt=X.isMeshStandardMaterial?z.environment:null,Ct=I===null?_.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:or,Et=(X.isMeshStandardMaterial?Ht:Vt).get(X.envMap||yt),zt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Gt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ft=!!W.morphAttributes.position,ne=!!W.morphAttributes.normal,de=!!W.morphAttributes.color;let Re=ki;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Re=_.toneMapping);const Se=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ge=Se!==void 0?Se.length:0,Bt=rt.get(X),be=p.state.lights;if(Jt===!0&&(j===!0||E!==w)){const tn=E===w&&X.id===b;ft.setState(X,E,tn)}let oe=!1;X.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==be.state.version||Bt.outputColorSpace!==Ct||H.isBatchedMesh&&Bt.batching===!1||!H.isBatchedMesh&&Bt.batching===!0||H.isBatchedMesh&&Bt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Bt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Bt.instancing===!1||!H.isInstancedMesh&&Bt.instancing===!0||H.isSkinnedMesh&&Bt.skinning===!1||!H.isSkinnedMesh&&Bt.skinning===!0||H.isInstancedMesh&&Bt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Bt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Bt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Bt.instancingMorph===!1&&H.morphTexture!==null||Bt.envMap!==Et||X.fog===!0&&Bt.fog!==lt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==ft.numPlanes||Bt.numIntersection!==ft.numIntersection)||Bt.vertexAlphas!==zt||Bt.vertexTangents!==Gt||Bt.morphTargets!==Ft||Bt.morphNormals!==ne||Bt.morphColors!==de||Bt.toneMapping!==Re||Bt.morphTargetsCount!==ge)&&(oe=!0):(oe=!0,Bt.__version=X.version);let cn=Bt.currentProgram;oe===!0&&(cn=To(X,z,H));let Cs=!1,hn=!1,yr=!1;const Te=cn.getUniforms(),wn=Bt.uniforms;if(K.useProgram(cn.program)&&(Cs=!0,hn=!0,yr=!0),X.id!==b&&(b=X.id,hn=!0),Cs||w!==E){K.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Te.setValue(L,"projectionMatrix",E.projectionMatrix),Te.setValue(L,"viewMatrix",E.matrixWorldInverse);const rn=Te.map.cameraPosition;rn!==void 0&&rn.setValue(L,bt.setFromMatrixPosition(E.matrixWorld)),J.logarithmicDepthBuffer&&Te.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Te.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),w!==E&&(w=E,hn=!0,yr=!0)}if(H.isSkinnedMesh){Te.setOptional(L,H,"bindMatrix"),Te.setOptional(L,H,"bindMatrixInverse");const tn=H.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Te.setValue(L,"boneTexture",tn.boneTexture,gt))}H.isBatchedMesh&&(Te.setOptional(L,H,"batchingTexture"),Te.setValue(L,"batchingTexture",H._matricesTexture,gt),Te.setOptional(L,H,"batchingIdTexture"),Te.setValue(L,"batchingIdTexture",H._indirectTexture,gt),Te.setOptional(L,H,"batchingColorTexture"),H._colorsTexture!==null&&Te.setValue(L,"batchingColorTexture",H._colorsTexture,gt));const En=W.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&ot.update(H,W,cn),(hn||Bt.receiveShadow!==H.receiveShadow)&&(Bt.receiveShadow=H.receiveShadow,Te.setValue(L,"receiveShadow",H.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(wn.envMap.value=Et,wn.flipEnvMap.value=Et.isCubeTexture&&Et.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&z.environment!==null&&(wn.envMapIntensity.value=z.environmentIntensity),hn&&(Te.setValue(L,"toneMappingExposure",_.toneMappingExposure),Bt.needsLights&&op(wn,yr),lt&&X.fog===!0&&nt.refreshFogUniforms(wn,lt),nt.refreshMaterialUniforms(wn,X,G,Y,p.state.transmissionRenderTarget[E.id]),va.upload(L,kh(Bt),wn,gt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(va.upload(L,kh(Bt),wn,gt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Te.setValue(L,"center",H.center),Te.setValue(L,"modelViewMatrix",H.modelViewMatrix),Te.setValue(L,"normalMatrix",H.normalMatrix),Te.setValue(L,"modelMatrix",H.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const tn=X.uniformsGroups;for(let rn=0,Ka=tn.length;rn<Ka;rn++){const Ki=tn[rn];qt.update(Ki,cn),qt.bind(Ki,cn)}}return cn}function op(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function ap(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,z,W){const X=rt.get(E);X.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),rt.get(E.texture).__webglTexture=z,rt.get(E.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,z){const W=rt.get(E);W.__webglFramebuffer=z,W.__useDefaultFramebuffer=z===void 0};const lp=L.createFramebuffer();this.setRenderTarget=function(E,z=0,W=0){I=E,A=z,R=W;let X=!0,H=null,lt=!1,yt=!1;if(E){const Et=rt.get(E);if(Et.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(L.FRAMEBUFFER,null),X=!1;else if(Et.__webglFramebuffer===void 0)gt.setupRenderTarget(E);else if(Et.__hasExternalTextures)gt.rebindTextures(E,rt.get(E.texture).__webglTexture,rt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ft=E.depthTexture;if(Et.__boundDepthTexture!==Ft){if(Ft!==null&&rt.has(Ft)&&(E.width!==Ft.image.width||E.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(E)}}const zt=E.texture;(zt.isData3DTexture||zt.isDataArrayTexture||zt.isCompressedArrayTexture)&&(yt=!0);const Gt=rt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[z])?H=Gt[z][W]:H=Gt[z],lt=!0):E.samples>0&&gt.useMultisampledRTT(E)===!1?H=rt.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?H=Gt[W]:H=Gt,P.copy(E.viewport),k.copy(E.scissor),D=E.scissorTest}else P.copy(pt).multiplyScalar(G).floor(),k.copy(ct).multiplyScalar(G).floor(),D=Xt;if(W!==0&&(H=lp),K.bindFramebuffer(L.FRAMEBUFFER,H)&&X&&K.drawBuffers(E,H),K.viewport(P),K.scissor(k),K.setScissorTest(D),lt){const Et=rt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+z,Et.__webglTexture,W)}else if(yt){const Et=z;for(let zt=0;zt<E.textures.length;zt++){const Gt=rt.get(E.textures[zt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+zt,Gt.__webglTexture,W,Et)}}else if(E!==null&&W!==0){const Et=rt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Et.__webglTexture,W)}b=-1},this.readRenderTargetPixels=function(E,z,W,X,H,lt,yt,Ct=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(Et=Et[yt]),Et){K.bindFramebuffer(L.FRAMEBUFFER,Et);try{const zt=E.textures[Ct],Gt=zt.format,Ft=zt.type;if(!J.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-X&&W>=0&&W<=E.height-H&&(E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ct),L.readPixels(z,W,X,H,Nt.convert(Gt),Nt.convert(Ft),lt))}finally{const zt=I!==null?rt.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,zt)}}},this.readRenderTargetPixelsAsync=async function(E,z,W,X,H,lt,yt,Ct=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(Et=Et[yt]),Et)if(z>=0&&z<=E.width-X&&W>=0&&W<=E.height-H){K.bindFramebuffer(L.FRAMEBUFFER,Et);const zt=E.textures[Ct],Gt=zt.format,Ft=zt.type;if(!J.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ne=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ne),L.bufferData(L.PIXEL_PACK_BUFFER,lt.byteLength,L.STREAM_READ),E.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Ct),L.readPixels(z,W,X,H,Nt.convert(Gt),Nt.convert(Ft),0);const de=I!==null?rt.get(I).__webglFramebuffer:null;K.bindFramebuffer(L.FRAMEBUFFER,de);const Re=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await pm(L,Re,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ne),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,lt),L.deleteBuffer(ne),L.deleteSync(Re),lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,z=null,W=0){const X=Math.pow(2,-W),H=Math.floor(E.image.width*X),lt=Math.floor(E.image.height*X),yt=z!==null?z.x:0,Ct=z!==null?z.y:0;gt.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,yt,Ct,H,lt),K.unbindTexture()};const cp=L.createFramebuffer(),hp=L.createFramebuffer();this.copyTextureToTexture=function(E,z,W=null,X=null,H=0,lt=null){lt===null&&(H!==0?(Yr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),lt=H,H=0):lt=0);let yt,Ct,Et,zt,Gt,Ft,ne,de,Re;const Se=E.isCompressedTexture?E.mipmaps[lt]:E.image;if(W!==null)yt=W.max.x-W.min.x,Ct=W.max.y-W.min.y,Et=W.isBox3?W.max.z-W.min.z:1,zt=W.min.x,Gt=W.min.y,Ft=W.isBox3?W.min.z:0;else{const En=Math.pow(2,-H);yt=Math.floor(Se.width*En),Ct=Math.floor(Se.height*En),E.isDataArrayTexture?Et=Se.depth:E.isData3DTexture?Et=Math.floor(Se.depth*En):Et=1,zt=0,Gt=0,Ft=0}X!==null?(ne=X.x,de=X.y,Re=X.z):(ne=0,de=0,Re=0);const ge=Nt.convert(z.format),Bt=Nt.convert(z.type);let be;z.isData3DTexture?(gt.setTexture3D(z,0),be=L.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(gt.setTexture2DArray(z,0),be=L.TEXTURE_2D_ARRAY):(gt.setTexture2D(z,0),be=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,z.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,z.unpackAlignment);const oe=L.getParameter(L.UNPACK_ROW_LENGTH),cn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Cs=L.getParameter(L.UNPACK_SKIP_PIXELS),hn=L.getParameter(L.UNPACK_SKIP_ROWS),yr=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Se.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Se.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,zt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Gt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ft);const Te=E.isDataArrayTexture||E.isData3DTexture,wn=z.isDataArrayTexture||z.isData3DTexture;if(E.isDepthTexture){const En=rt.get(E),tn=rt.get(z),rn=rt.get(En.__renderTarget),Ka=rt.get(tn.__renderTarget);K.bindFramebuffer(L.READ_FRAMEBUFFER,rn.__webglFramebuffer),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ka.__webglFramebuffer);for(let Ki=0;Ki<Et;Ki++)Te&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,rt.get(E).__webglTexture,H,Ft+Ki),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,rt.get(z).__webglTexture,lt,Re+Ki)),L.blitFramebuffer(zt,Gt,yt,Ct,ne,de,yt,Ct,L.DEPTH_BUFFER_BIT,L.NEAREST);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(H!==0||E.isRenderTargetTexture||rt.has(E)){const En=rt.get(E),tn=rt.get(z);K.bindFramebuffer(L.READ_FRAMEBUFFER,cp),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,hp);for(let rn=0;rn<Et;rn++)Te?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,En.__webglTexture,H,Ft+rn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,En.__webglTexture,H),wn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,tn.__webglTexture,lt,Re+rn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,tn.__webglTexture,lt),H!==0?L.blitFramebuffer(zt,Gt,yt,Ct,ne,de,yt,Ct,L.COLOR_BUFFER_BIT,L.NEAREST):wn?L.copyTexSubImage3D(be,lt,ne,de,Re+rn,zt,Gt,yt,Ct):L.copyTexSubImage2D(be,lt,ne,de,zt,Gt,yt,Ct);K.bindFramebuffer(L.READ_FRAMEBUFFER,null),K.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else wn?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(be,lt,ne,de,Re,yt,Ct,Et,ge,Bt,Se.data):z.isCompressedArrayTexture?L.compressedTexSubImage3D(be,lt,ne,de,Re,yt,Ct,Et,ge,Se.data):L.texSubImage3D(be,lt,ne,de,Re,yt,Ct,Et,ge,Bt,Se):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,lt,ne,de,yt,Ct,ge,Bt,Se.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,lt,ne,de,Se.width,Se.height,ge,Se.data):L.texSubImage2D(L.TEXTURE_2D,lt,ne,de,yt,Ct,ge,Bt,Se);L.pixelStorei(L.UNPACK_ROW_LENGTH,oe),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,cn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Cs),L.pixelStorei(L.UNPACK_SKIP_ROWS,hn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,yr),lt===0&&z.generateMipmaps&&L.generateMipmap(be),K.unbindTexture()},this.initRenderTarget=function(E){rt.get(E).__webglFramebuffer===void 0&&gt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?gt.setTextureCube(E,0):E.isData3DTexture?gt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?gt.setTexture2DArray(E,0):gt.setTexture2D(E,0),K.unbindTexture()},this.resetState=function(){A=0,R=0,I=null,K.reset(),_t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}}function xy(){const t=new Uint8Array(16384);for(let n=0;n<64;n++)for(let i=0;i<64;i++){const r=Math.hypot((i-31.5)/31.5,(n-31.5)/31.5),o=(n*64+i)*4;t[o]=t[o+1]=t[o+2]=255,t[o+3]=Math.round(Math.max(0,1-r)**3*255)}const e=new Gm(t,64,64);return e.magFilter=Pn,e.minFilter=Pn,e.needsUpdate=!0,e}const _y=xy();function uf(s,t,e=!1){const n=new Ie,i=new me(e?new Wi(s*.64,48):new gr(s,20,12),new Ye({color:e?400678:t,toneMapped:!1}));e&&(i.position.z=.06),n.add(i);const r=new mr(new Es({map:_y,color:t,transparent:!0,opacity:.8,depthWrite:!1,blending:_n}));if(r.scale.setScalar(s*(e?5:6)),r.position.z=e?0:s+.03,n.add(r),e)for(let u=0;u<3;u++){const f=new me(new Ba(s*(.65+u*.16)-.012,s*(.65+u*.16)+.012,64),new Ye({color:t,transparent:!0,opacity:.85-u*.18}));f.position.z=.08+u*.02,n.add(f)}const o=new ka(t,e?6:2,s*(e?6:8),2);o.position.z=.1,n.add(o);const a=new Float32Array(72),l=new Float32Array(24),c=new ve;c.setAttribute("position",new Ce(a,3)),c.setAttribute("heat",new Ce(l,1));const h=new Dn({transparent:!0,depthWrite:!1,blending:_n,uniforms:{tint:{value:new te(t)},pixelRatio:{value:1},fade:{value:1}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"uniform float fade; uniform vec3 tint; varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(tint,vec3(1.),vHeat*.5),pow(1.-r,2.)*vHeat*.8*fade);}"}),d=new Fa(c,h);return d.frustumCulled=!1,n.add(d),n.userData.setFade=u=>{i.material.transparent=!0,i.material.opacity=u,r.material.opacity*=u,h.uniforms.fade.value=u,o.intensity=(e?6:2)*u},n.userData.coreRadius=s,n.userData.animate=(u,f=1)=>{h.uniforms.pixelRatio.value=f,r.material.opacity=.7+Math.sin(u*3)*.08;for(let m=0;m<24;m++){const v=(u*(e?.5:.8)+m/24)%1,g=m*2.39996+v*.8,p=e?s*(.8+v*.8):s+v*(.45+s*.8);a.set([Math.cos(g)*p,Math.sin(g)*p,e?.12:s*.5],m*3),l[m]=(1-v)**2}c.attributes.position.needsUpdate=!0,c.attributes.heat.needsUpdate=!0},n}class Hn{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){const t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){const t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){const e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new S);const e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new S);const n=this.elements,i=t.x,r=t.y,o=t.z;return e.x=n[0]*i+n[1]*r+n[2]*o,e.y=n[3]*i+n[4]*r+n[5]*o,e.z=n[6]*i+n[7]*r+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new Hn);const n=this.elements,i=t.elements,r=e.elements,o=n[0],a=n[1],l=n[2],c=n[3],h=n[4],d=n[5],u=n[6],f=n[7],m=n[8],v=i[0],g=i[1],p=i[2],x=i[3],y=i[4],_=i[5],T=i[6],A=i[7],R=i[8];return r[0]=o*v+a*x+l*T,r[1]=o*g+a*y+l*A,r[2]=o*p+a*_+l*R,r[3]=c*v+h*x+d*T,r[4]=c*g+h*y+d*A,r[5]=c*p+h*_+d*R,r[6]=u*v+f*x+m*T,r[7]=u*g+f*y+m*A,r[8]=u*p+f*_+m*R,e}scale(t,e){e===void 0&&(e=new Hn);const n=this.elements,i=e.elements;for(let r=0;r!==3;r++)i[3*r+0]=t.x*n[3*r+0],i[3*r+1]=t.y*n[3*r+1],i[3*r+2]=t.z*n[3*r+2];return e}solve(t,e){e===void 0&&(e=new S);const n=3,i=4,r=[];let o,a;for(o=0;o<n*i;o++)r.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)r[o+i*a]=this.elements[o+3*a];r[3]=t.x,r[7]=t.y,r[11]=t.z;let l=3;const c=l;let h;const d=4;let u;do{if(o=c-l,r[o+i*o]===0){for(a=o+1;a<c;a++)if(r[o+i*a]!==0){h=d;do u=d-h,r[u+i*o]+=r[u+i*a];while(--h);break}}if(r[o+i*o]!==0)for(a=o+1;a<c;a++){const f=r[o+i*a]/r[o+i*o];h=d;do u=d-h,r[u+i*a]=u<=o?0:r[u+i*a]-r[u+i*o]*f;while(--h)}}while(--l);if(e.z=r[2*i+3]/r[2*i+2],e.y=(r[1*i+3]-r[1*i+2]*e.z)/r[1*i+1],e.x=(r[0*i+3]-r[0*i+2]*e.z-r[0*i+1]*e.y)/r[0*i+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new Hn);const e=3,n=6,i=yy;let r,o;for(r=0;r<3;r++)for(o=0;o<3;o++)i[r+n*o]=this.elements[r+3*o];i[3]=1,i[9]=0,i[15]=0,i[4]=0,i[10]=1,i[16]=0,i[5]=0,i[11]=0,i[17]=1;let a=3;const l=a;let c;const h=n;let d;do{if(r=l-a,i[r+n*r]===0){for(o=r+1;o<l;o++)if(i[r+n*o]!==0){c=h;do d=h-c,i[d+n*r]+=i[d+n*o];while(--c);break}}if(i[r+n*r]!==0)for(o=r+1;o<l;o++){const u=i[r+n*o]/i[r+n*r];c=h;do d=h-c,i[d+n*o]=d<=r?0:i[d+n*o]-i[d+n*r]*u;while(--c)}}while(--a);r=2;do{o=r-1;do{const u=i[r+n*o]/i[r+n*r];c=n;do d=n-c,i[d+n*o]=i[d+n*o]-i[d+n*r]*u;while(--c)}while(o--)}while(--r);r=2;do{const u=1/i[r+n*r];c=n;do d=n-c,i[d+n*r]=i[d+n*r]*u;while(--c)}while(r--);r=2;do{o=2;do{if(d=i[e+o+n*r],isNaN(d)||d===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(r,o,d)}while(o--)}while(r--);return t}setRotationFromQuaternion(t){const e=t.x,n=t.y,i=t.z,r=t.w,o=e+e,a=n+n,l=i+i,c=e*o,h=e*a,d=e*l,u=n*a,f=n*l,m=i*l,v=r*o,g=r*a,p=r*l,x=this.elements;return x[0]=1-(u+m),x[1]=h-p,x[2]=d+g,x[3]=h+p,x[4]=1-(c+m),x[5]=f-v,x[6]=d-g,x[7]=f+v,x[8]=1-(c+u),this}transpose(t){t===void 0&&(t=new Hn);const e=this.elements,n=t.elements;let i;return n[0]=e[0],n[4]=e[4],n[8]=e[8],i=e[1],n[1]=e[3],n[3]=i,i=e[2],n[2]=e[6],n[6]=i,i=e[5],n[5]=e[7],n[7]=i,t}}const yy=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class S{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new S);const n=t.x,i=t.y,r=t.z,o=this.x,a=this.y,l=this.z;return e.x=a*r-l*i,e.y=l*n-o*r,e.z=o*i-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new S(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new S(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new Hn([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const t=this.x,e=this.y,n=this.z,i=Math.sqrt(t*t+e*e+n*n);if(i>0){const r=1/i;this.x*=r,this.y*=r,this.z*=r}else this.x=0,this.y=0,this.z=0;return i}unit(t){t===void 0&&(t=new S);const e=this.x,n=this.y,i=this.z;let r=Math.sqrt(e*e+n*n+i*i);return r>0?(r=1/r,t.x=e*r,t.y=n*r,t.z=i*r):(t.x=1,t.y=0,t.z=0),t}length(){const t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z;return Math.sqrt((r-e)*(r-e)+(o-n)*(o-n)+(a-i)*(a-i))}distanceSquared(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z;return(r-e)*(r-e)+(o-n)*(o-n)+(a-i)*(a-i)}scale(t,e){e===void 0&&(e=new S);const n=this.x,i=this.y,r=this.z;return e.x=t*n,e.y=t*i,e.z=t*r,e}vmul(t,e){return e===void 0&&(e=new S),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new S),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new S),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){const n=this.length();if(n>0){const i=My,r=1/n;i.set(this.x*r,this.y*r,this.z*r);const o=Sy;Math.abs(i.x)<.9?(o.set(1,0,0),i.cross(o,t)):(o.set(0,1,0),i.cross(o,t)),i.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){const i=this.x,r=this.y,o=this.z;n.x=i+(t.x-i)*e,n.y=r+(t.y-r)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(Ju),Ju.almostEquals(t,e)}clone(){return new S(this.x,this.y,this.z)}}S.ZERO=new S(0,0,0);S.UNIT_X=new S(1,0,0);S.UNIT_Y=new S(0,1,0);S.UNIT_Z=new S(0,0,1);const My=new S,Sy=new S,Ju=new S;class Sn{constructor(t){t===void 0&&(t={}),this.lowerBound=new S,this.upperBound=new S,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,i){const r=this.lowerBound,o=this.upperBound,a=n;r.copy(t[0]),a&&a.vmult(r,r),o.copy(r);for(let l=1;l<t.length;l++){let c=t[l];a&&(a.vmult(c,Qu),c=Qu),c.x>o.x&&(o.x=c.x),c.x<r.x&&(r.x=c.x),c.y>o.y&&(o.y=c.y),c.y<r.y&&(r.y=c.y),c.z>o.z&&(o.z=c.z),c.z<r.z&&(r.z=c.z)}return e&&(e.vadd(r,r),e.vadd(o,o)),i&&(r.x-=i,r.y-=i,r.z-=i,o.x+=i,o.y+=i,o.z+=i),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new Sn().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){const e=this.lowerBound,n=this.upperBound,i=t.lowerBound,r=t.upperBound,o=i.x<=n.x&&n.x<=r.x||e.x<=r.x&&r.x<=n.x,a=i.y<=n.y&&n.y<=r.y||e.y<=r.y&&r.y<=n.y,l=i.z<=n.z&&n.z<=r.z||e.z<=r.z&&r.z<=n.z;return o&&a&&l}volume(){const t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){const e=this.lowerBound,n=this.upperBound,i=t.lowerBound,r=t.upperBound;return e.x<=i.x&&n.x>=r.x&&e.y<=i.y&&n.y>=r.y&&e.z<=i.z&&n.z>=r.z}getCorners(t,e,n,i,r,o,a,l){const c=this.lowerBound,h=this.upperBound;t.copy(c),e.set(h.x,c.y,c.z),n.set(h.x,h.y,c.z),i.set(c.x,h.y,h.z),r.set(h.x,c.y,h.z),o.set(c.x,h.y,c.z),a.set(c.x,c.y,h.z),l.copy(h)}toLocalFrame(t,e){const n=td,i=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(i,r,o,a,l,c,h,d);for(let u=0;u!==8;u++){const f=n[u];t.pointToLocal(f,f)}return e.setFromPoints(n)}toWorldFrame(t,e){const n=td,i=n[0],r=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(i,r,o,a,l,c,h,d);for(let u=0;u!==8;u++){const f=n[u];t.pointToWorld(f,f)}return e.setFromPoints(n)}overlapsRay(t){const{direction:e,from:n}=t,i=1/e.x,r=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*i,l=(this.upperBound.x-n.x)*i,c=(this.lowerBound.y-n.y)*r,h=(this.upperBound.y-n.y)*r,d=(this.lowerBound.z-n.z)*o,u=(this.upperBound.z-n.z)*o,f=Math.max(Math.max(Math.min(a,l),Math.min(c,h)),Math.min(d,u)),m=Math.min(Math.min(Math.max(a,l),Math.max(c,h)),Math.max(d,u));return!(m<0||f>m)}}const Qu=new S,td=[new S,new S,new S,new S,new S,new S,new S,new S];class ed{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:i}=e;if(i>n){const r=i;i=n,n=r}return this.matrix[(n*(n+1)>>1)+i-1]}set(t,e,n){let{index:i}=t,{index:r}=e;if(r>i){const o=r;r=i,i=o}this.matrix[(i*(i+1)>>1)+r-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}}class df{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;const n=this._listeners;if(n[t]===void 0)return this;const i=n[t].indexOf(e);return i!==-1&&n[t].splice(i,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;const n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let i=0,r=n.length;i<r;i++)n[i].call(this,t)}return this}}class Ue{constructor(t,e,n,i){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),i===void 0&&(i=1),this.x=t,this.y=e,this.z=n,this.w=i}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){const n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new S),this.normalize();const e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){const n=wy,i=Ey;t.tangents(n,i),this.setFromAxisAngle(n,Math.PI)}else{const n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new Ue);const n=this.x,i=this.y,r=this.z,o=this.w,a=t.x,l=t.y,c=t.z,h=t.w;return e.x=n*h+o*a+i*c-r*l,e.y=i*h+o*l+r*a-n*c,e.z=r*h+o*c+n*l-i*a,e.w=o*h-n*a-i*l-r*c,e}inverse(t){t===void 0&&(t=new Ue);const e=this.x,n=this.y,i=this.z,r=this.w;this.conjugate(t);const o=1/(e*e+n*n+i*i+r*r);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new Ue),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){const t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new S);const n=t.x,i=t.y,r=t.z,o=this.x,a=this.y,l=this.z,c=this.w,h=c*n+a*r-l*i,d=c*i+l*n-o*r,u=c*r+o*i-a*n,f=-o*n-a*i-l*r;return e.x=h*c+f*-o+d*-l-u*-a,e.y=d*c+f*-a+u*-o-h*-l,e.z=u*c+f*-l+h*-a-d*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,i,r;const o=this.x,a=this.y,l=this.z,c=this.w;switch(e){case"YZX":const h=o*a+l*c;if(h>.499&&(n=2*Math.atan2(o,c),i=Math.PI/2,r=0),h<-.499&&(n=-2*Math.atan2(o,c),i=-Math.PI/2,r=0),n===void 0){const d=o*o,u=a*a,f=l*l;n=Math.atan2(2*a*c-2*o*l,1-2*u-2*f),i=Math.asin(2*h),r=Math.atan2(2*o*c-2*a*l,1-2*d-2*f)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=i,t.x=r}setFromEuler(t,e,n,i){i===void 0&&(i="XYZ");const r=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),l=Math.sin(t/2),c=Math.sin(e/2),h=Math.sin(n/2);return i==="XYZ"?(this.x=l*o*a+r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a-l*c*h):i==="YXZ"?(this.x=l*o*a+r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a+l*c*h):i==="ZXY"?(this.x=l*o*a-r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a-l*c*h):i==="ZYX"?(this.x=l*o*a-r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a+l*c*h):i==="YZX"?(this.x=l*o*a+r*c*h,this.y=r*c*a+l*o*h,this.z=r*o*h-l*c*a,this.w=r*o*a-l*c*h):i==="XZY"&&(this.x=l*o*a-r*c*h,this.y=r*c*a-l*o*h,this.z=r*o*h+l*c*a,this.w=r*o*a+l*c*h),this}clone(){return new Ue(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new Ue);const i=this.x,r=this.y,o=this.z,a=this.w;let l=t.x,c=t.y,h=t.z,d=t.w,u,f,m,v,g;return f=i*l+r*c+o*h+a*d,f<0&&(f=-f,l=-l,c=-c,h=-h,d=-d),1-f>1e-6?(u=Math.acos(f),m=Math.sin(u),v=Math.sin((1-e)*u)/m,g=Math.sin(e*u)/m):(v=1-e,g=e),n.x=v*i+g*l,n.y=v*r+g*c,n.z=v*o+g*h,n.w=v*a+g*d,n}integrate(t,e,n,i){i===void 0&&(i=new Ue);const r=t.x*n.x,o=t.y*n.y,a=t.z*n.z,l=this.x,c=this.y,h=this.z,d=this.w,u=e*.5;return i.x+=u*(r*d+o*h-a*c),i.y+=u*(o*d+a*l-r*h),i.z+=u*(a*d+r*c-o*l),i.w+=u*(-r*l-o*c-a*h),i}}const wy=new S,Ey=new S,by={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class Tt{constructor(t){t===void 0&&(t={}),this.id=Tt.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,i){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}Tt.idCounter=0;Tt.types=by;class le{constructor(t){t===void 0&&(t={}),this.position=new S,this.quaternion=new Ue,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return le.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return le.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new S),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,i){return i===void 0&&(i=new S),n.vsub(t,i),e.conjugate(nd),nd.vmult(i,i),i}static pointToWorldFrame(t,e,n,i){return i===void 0&&(i=new S),e.vmult(n,i),i.vadd(t,i),i}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new S),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,i){return i===void 0&&(i=new S),e.w*=-1,e.vmult(n,i),e.w*=-1,i}}const nd=new Ue;class er extends Tt{constructor(t){t===void 0&&(t={});const{vertices:e=[],faces:n=[],normals:i=[],axes:r,boundingSphereRadius:o}=t;super({type:Tt.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=i,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=r?r.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;const i=new S;for(let r=0;r!==t.length;r++){const o=t[r],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;e[o[l]].vsub(e[o[c]],i),i.normalize();let h=!1;for(let d=0;d!==n.length;d++)if(n[d].almostEquals(i)||n[d].almostEquals(i)){h=!0;break}h||n.push(i.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let i=0;i<this.faces[t].length;i++)if(!this.vertices[this.faces[t][i]])throw new Error(`Vertex ${this.faces[t][i]} not found!`);const e=this.faceNormals[t]||new S;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;const n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let i=0;i<this.faces[t].length;i++)console.warn(`.vertices[${this.faces[t][i]}] = Vec3(${this.vertices[this.faces[t][i]].toString()})`)}}}getFaceNormal(t,e){const n=this.faces[t],i=this.vertices[n[0]],r=this.vertices[n[1]],o=this.vertices[n[2]];er.computeNormal(i,r,o,e)}static computeNormal(t,e,n,i){const r=new S,o=new S;e.vsub(t,o),n.vsub(e,r),r.cross(o,i),i.isZero()||i.normalize()}clipAgainstHull(t,e,n,i,r,o,a,l,c){const h=new S;let d=-1,u=-Number.MAX_VALUE;for(let m=0;m<n.faces.length;m++){h.copy(n.faceNormals[m]),r.vmult(h,h);const v=h.dot(o);v>u&&(u=v,d=m)}const f=[];for(let m=0;m<n.faces[d].length;m++){const v=n.vertices[n.faces[d][m]],g=new S;g.copy(v),r.vmult(g,g),i.vadd(g,g),f.push(g)}d>=0&&this.clipFaceAgainstHull(o,t,e,f,a,l,c)}findSeparatingAxis(t,e,n,i,r,o,a,l){const c=new S,h=new S,d=new S,u=new S,f=new S,m=new S;let v=Number.MAX_VALUE;const g=this;if(g.uniqueAxes)for(let p=0;p!==g.uniqueAxes.length;p++){n.vmult(g.uniqueAxes[p],c);const x=g.testSepAxis(c,t,e,n,i,r);if(x===!1)return!1;x<v&&(v=x,o.copy(c))}else{const p=a?a.length:g.faces.length;for(let x=0;x<p;x++){const y=a?a[x]:x;c.copy(g.faceNormals[y]),n.vmult(c,c);const _=g.testSepAxis(c,t,e,n,i,r);if(_===!1)return!1;_<v&&(v=_,o.copy(c))}}if(t.uniqueAxes)for(let p=0;p!==t.uniqueAxes.length;p++){r.vmult(t.uniqueAxes[p],h);const x=g.testSepAxis(h,t,e,n,i,r);if(x===!1)return!1;x<v&&(v=x,o.copy(h))}else{const p=l?l.length:t.faces.length;for(let x=0;x<p;x++){const y=l?l[x]:x;h.copy(t.faceNormals[y]),r.vmult(h,h);const _=g.testSepAxis(h,t,e,n,i,r);if(_===!1)return!1;_<v&&(v=_,o.copy(h))}}for(let p=0;p!==g.uniqueEdges.length;p++){n.vmult(g.uniqueEdges[p],u);for(let x=0;x!==t.uniqueEdges.length;x++)if(r.vmult(t.uniqueEdges[x],f),u.cross(f,m),!m.almostZero()){m.normalize();const y=g.testSepAxis(m,t,e,n,i,r);if(y===!1)return!1;y<v&&(v=y,o.copy(m))}}return i.vsub(e,d),d.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,i,r,o){const a=this;er.project(a,t,n,i,Ul),er.project(e,t,r,o,Fl);const l=Ul[0],c=Ul[1],h=Fl[0],d=Fl[1];if(l<d||h<c)return!1;const u=l-d,f=h-c;return u<f?u:f}calculateLocalInertia(t,e){const n=new S,i=new S;this.computeLocalAABB(i,n);const r=n.x-i.x,o=n.y-i.y,a=n.z-i.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*r*2*r+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*r*2*r)}getPlaneConstantOfFace(t){const e=this.faces[t],n=this.faceNormals[t],i=this.vertices[e[0]];return-n.dot(i)}clipFaceAgainstHull(t,e,n,i,r,o,a){const l=new S,c=new S,h=new S,d=new S,u=new S,f=new S,m=new S,v=new S,g=this,p=[],x=i,y=p;let _=-1,T=Number.MAX_VALUE;for(let w=0;w<g.faces.length;w++){l.copy(g.faceNormals[w]),n.vmult(l,l);const P=l.dot(t);P<T&&(T=P,_=w)}if(_<0)return;const A=g.faces[_];A.connectedFaces=[];for(let w=0;w<g.faces.length;w++)for(let P=0;P<g.faces[w].length;P++)A.indexOf(g.faces[w][P])!==-1&&w!==_&&A.connectedFaces.indexOf(w)===-1&&A.connectedFaces.push(w);const R=A.length;for(let w=0;w<R;w++){const P=g.vertices[A[w]],k=g.vertices[A[(w+1)%R]];P.vsub(k,c),h.copy(c),n.vmult(h,h),e.vadd(h,h),d.copy(this.faceNormals[_]),n.vmult(d,d),e.vadd(d,d),h.cross(d,u),u.negate(u),f.copy(P),n.vmult(f,f),e.vadd(f,f);const D=A.connectedFaces[w];m.copy(this.faceNormals[D]);const B=this.getPlaneConstantOfFace(D);v.copy(m),n.vmult(v,v);const F=B-v.dot(e);for(this.clipFaceAgainstPlane(x,y,v,F);x.length;)x.shift();for(;y.length;)x.push(y.shift())}m.copy(this.faceNormals[_]);const I=this.getPlaneConstantOfFace(_);v.copy(m),n.vmult(v,v);const b=I-v.dot(e);for(let w=0;w<x.length;w++){let P=v.dot(x[w])+b;if(P<=r&&(console.log(`clamped: depth=${P} to minDist=${r}`),P=r),P<=o){const k=x[w];if(P<=1e-6){const D={point:k,normal:v,depth:P};a.push(D)}}}}clipFaceAgainstPlane(t,e,n,i){let r,o;const a=t.length;if(a<2)return e;let l=t[t.length-1],c=t[0];r=n.dot(l)+i;for(let h=0;h<a;h++){if(c=t[h],o=n.dot(c)+i,r<0)if(o<0){const d=new S;d.copy(c),e.push(d)}else{const d=new S;l.lerp(c,r/(r-o),d),e.push(d)}else if(o<0){const d=new S;l.lerp(c,r/(r-o),d),e.push(d),e.push(c)}l=c,r=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new S);const n=this.vertices,i=this.worldVertices;for(let r=0;r!==this.vertices.length;r++)e.vmult(n[r],i[r]),t.vadd(i[r],i[r]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){const n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let i=0;i<this.vertices.length;i++){const r=n[i];r.x<t.x?t.x=r.x:r.x>e.x&&(e.x=r.x),r.y<t.y?t.y=r.y:r.y>e.y&&(e.y=r.y),r.z<t.z?t.z=r.z:r.z>e.z&&(e.z=r.z)}}computeWorldFaceNormals(t){const e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new S);const n=this.faceNormals,i=this.worldFaceNormals;for(let r=0;r!==e;r++)t.vmult(n[r],i[r]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0;const e=this.vertices;for(let n=0;n!==e.length;n++){const i=e[n].lengthSquared();i>t&&(t=i)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,i){const r=this.vertices;let o,a,l,c,h,d,u=new S;for(let f=0;f<r.length;f++){u.copy(r[f]),e.vmult(u,u),t.vadd(u,u);const m=u;(o===void 0||m.x<o)&&(o=m.x),(c===void 0||m.x>c)&&(c=m.x),(a===void 0||m.y<a)&&(a=m.y),(h===void 0||m.y>h)&&(h=m.y),(l===void 0||m.z<l)&&(l=m.z),(d===void 0||m.z>d)&&(d=m.z)}n.set(o,a,l),i.set(c,h,d)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new S);const e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){const n=this.vertices.length,i=this.vertices;if(e){for(let r=0;r<n;r++){const o=i[r];e.vmult(o,o)}for(let r=0;r<this.faceNormals.length;r++){const o=this.faceNormals[r];e.vmult(o,o)}}if(t)for(let r=0;r<n;r++){const o=i[r];o.vadd(t,o)}}pointIsInside(t){const e=this.vertices,n=this.faces,i=this.faceNormals,r=new S;this.getAveragePointLocal(r);for(let o=0;o<this.faces.length;o++){let a=i[o];const l=e[n[o][0]],c=new S;t.vsub(l,c);const h=a.dot(c),d=new S;r.vsub(l,d);const u=a.dot(d);if(h<0&&u>0||h>0&&u<0)return!1}return-1}static project(t,e,n,i,r){const o=t.vertices.length,a=Ty;let l=0,c=0;const h=Ay,d=t.vertices;h.setZero(),le.vectorToLocalFrame(n,i,e,a),le.pointToLocalFrame(n,i,h,h);const u=h.dot(a);c=l=d[0].dot(a);for(let f=1;f<o;f++){const m=d[f].dot(a);m>l&&(l=m),m<c&&(c=m)}if(c-=u,l-=u,c>l){const f=c;c=l,l=f}r[0]=l,r[1]=c}}const Ul=[],Fl=[];new S;const Ty=new S,Ay=new S;class Ha extends Tt{constructor(t){super({type:Tt.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,i=S,r=[new i(-t,-e,-n),new i(t,-e,-n),new i(t,e,-n),new i(-t,e,-n),new i(-t,-e,n),new i(t,-e,n),new i(t,e,n),new i(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new i(0,0,1),new i(0,1,0),new i(1,0,0)],l=new er({vertices:r,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new S),Ha.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){const i=t;n.x=1/12*e*(2*i.y*2*i.y+2*i.z*2*i.z),n.y=1/12*e*(2*i.x*2*i.x+2*i.z*2*i.z),n.z=1/12*e*(2*i.y*2*i.y+2*i.x*2*i.x)}getSideNormals(t,e){const n=t,i=this.halfExtents;if(n[0].set(i.x,0,0),n[1].set(0,i.y,0),n[2].set(0,0,i.z),n[3].set(-i.x,0,0),n[4].set(0,-i.y,0),n[5].set(0,0,-i.z),e!==void 0)for(let r=0;r!==n.length;r++)e.vmult(n[r],n[r]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){const i=this.halfExtents,r=[[i.x,i.y,i.z],[-i.x,i.y,i.z],[-i.x,-i.y,i.z],[-i.x,-i.y,-i.z],[i.x,-i.y,-i.z],[i.x,i.y,-i.z],[-i.x,i.y,-i.z],[i.x,-i.y,i.z]];for(let o=0;o<r.length;o++)Fi.set(r[o][0],r[o][1],r[o][2]),e.vmult(Fi,Fi),t.vadd(Fi,Fi),n(Fi.x,Fi.y,Fi.z)}calculateWorldAABB(t,e,n,i){const r=this.halfExtents;Xn[0].set(r.x,r.y,r.z),Xn[1].set(-r.x,r.y,r.z),Xn[2].set(-r.x,-r.y,r.z),Xn[3].set(-r.x,-r.y,-r.z),Xn[4].set(r.x,-r.y,-r.z),Xn[5].set(r.x,r.y,-r.z),Xn[6].set(-r.x,r.y,-r.z),Xn[7].set(r.x,-r.y,r.z);const o=Xn[0];e.vmult(o,o),t.vadd(o,o),i.copy(o),n.copy(o);for(let a=1;a<8;a++){const l=Xn[a];e.vmult(l,l),t.vadd(l,l);const c=l.x,h=l.y,d=l.z;c>i.x&&(i.x=c),h>i.y&&(i.y=h),d>i.z&&(i.z=d),c<n.x&&(n.x=c),h<n.y&&(n.y=h),d<n.z&&(n.z=d)}}}const Fi=new S,Xn=[new S,new S,new S,new S,new S,new S,new S,new S],ih={DYNAMIC:1,STATIC:2,KINEMATIC:4},sh={AWAKE:0,SLEEPY:1,SLEEPING:2};class wt extends df{constructor(t){t===void 0&&(t={}),super(),this.id=wt.idCounter++,this.index=-1,this.world=null,this.vlambda=new S,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new S,this.previousPosition=new S,this.interpolatedPosition=new S,this.initPosition=new S,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new S,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new S,this.force=new S;const e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?wt.STATIC:wt.DYNAMIC,typeof t.type==typeof wt.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=wt.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new S,this.quaternion=new Ue,this.initQuaternion=new Ue,this.previousQuaternion=new Ue,this.interpolatedQuaternion=new Ue,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new S,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new S,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new S,this.invInertia=new S,this.invInertiaWorld=new Hn,this.invMassSolve=0,this.invInertiaSolve=new S,this.invInertiaWorldSolve=new Hn,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new S(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new S(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Sn,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new S,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){const t=this.sleepState;this.sleepState=wt.AWAKE,this.wakeUpAfterNarrowphase=!1,t===wt.SLEEPING&&this.dispatchEvent(wt.wakeupEvent)}sleep(){this.sleepState=wt.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){const e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),i=this.sleepSpeedLimit**2;e===wt.AWAKE&&n<i?(this.sleepState=wt.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(wt.sleepyEvent)):e===wt.SLEEPY&&n>i?this.wakeUp():e===wt.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(wt.sleepEvent))}}updateSolveMassProperties(){this.sleepState===wt.SLEEPING||this.type===wt.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new S),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new S),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new S),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new S),this.quaternion.vmult(t,e),e}addShape(t,e,n){const i=new S,r=new Ue;return e&&i.copy(e),n&&r.copy(n),this.shapes.push(t),this.shapeOffsets.push(i),this.shapeOrientations.push(r),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){const e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){const t=this.shapes,e=this.shapeOffsets,n=t.length;let i=0;for(let r=0;r!==n;r++){const o=t[r];o.updateBoundingSphereRadius();const a=e[r].length(),l=o.boundingSphereRadius;a+l>i&&(i=a+l)}this.boundingRadius=i}updateAABB(){const t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,i=t.length,r=Cy,o=Ry,a=this.quaternion,l=this.aabb,c=Py;for(let h=0;h!==i;h++){const d=t[h];a.vmult(e[h],r),r.vadd(this.position,r),a.mult(n[h],o),d.calculateWorldAABB(r,o,c.lowerBound,c.upperBound),h===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){const e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){const n=Ly,i=Iy;n.setRotationFromQuaternion(this.quaternion),n.transpose(i),n.scale(e,n),n.mmult(i,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new S),this.type!==wt.DYNAMIC)return;this.sleepState===wt.SLEEPING&&this.wakeUp();const n=Dy;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new S),this.type!==wt.DYNAMIC)return;const n=Ny,i=Uy;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyForce(n,i)}applyTorque(t){this.type===wt.DYNAMIC&&(this.sleepState===wt.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new S),this.type!==wt.DYNAMIC)return;this.sleepState===wt.SLEEPING&&this.wakeUp();const n=e,i=Fy;i.copy(t),i.scale(this.invMass,i),this.velocity.vadd(i,this.velocity);const r=Oy;n.cross(t,r),this.invInertiaWorld.vmult(r,r),this.angularVelocity.vadd(r,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new S),this.type!==wt.DYNAMIC)return;const n=By,i=zy;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyImpulse(n,i)}updateMassProperties(){const t=ky;this.invMass=this.mass>0?1/this.mass:0;const e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),Ha.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){const n=new S;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===wt.DYNAMIC||this.type===wt.KINEMATIC)||this.sleepState===wt.SLEEPING)return;const i=this.velocity,r=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,h=this.invMass,d=this.invInertiaWorld,u=this.linearFactor,f=h*t;i.x+=a.x*f*u.x,i.y+=a.y*f*u.y,i.z+=a.z*f*u.z;const m=d.elements,v=this.angularFactor,g=l.x*v.x,p=l.y*v.y,x=l.z*v.z;r.x+=t*(m[0]*g+m[1]*p+m[2]*x),r.y+=t*(m[3]*g+m[4]*p+m[5]*x),r.z+=t*(m[6]*g+m[7]*p+m[8]*x),o.x+=i.x*t,o.y+=i.y*t,o.z+=i.z*t,c.integrate(this.angularVelocity,t,this.angularFactor,c),e&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}wt.idCounter=0;wt.COLLIDE_EVENT_NAME="collide";wt.DYNAMIC=ih.DYNAMIC;wt.STATIC=ih.STATIC;wt.KINEMATIC=ih.KINEMATIC;wt.AWAKE=sh.AWAKE;wt.SLEEPY=sh.SLEEPY;wt.SLEEPING=sh.SLEEPING;wt.wakeupEvent={type:"wakeup"};wt.sleepyEvent={type:"sleepy"};wt.sleepEvent={type:"sleep"};const Cy=new S,Ry=new Ue,Py=new Sn,Ly=new Hn,Iy=new Hn;new Hn;const Dy=new S,Ny=new S,Uy=new S,Fy=new S,Oy=new S,By=new S,zy=new S,ky=new S;class Gy{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&wt.STATIC)!==0||t.sleepState===wt.SLEEPING)&&((e.type&wt.STATIC)!==0||e.sleepState===wt.SLEEPING))}intersectionTest(t,e,n,i){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,i):this.doBoundingSphereBroadphase(t,e,n,i)}doBoundingSphereBroadphase(t,e,n,i){const r=Hy;e.position.vsub(t.position,r);const o=(t.boundingRadius+e.boundingRadius)**2;r.lengthSquared()<o&&(n.push(t),i.push(e))}doBoundingBoxBroadphase(t,e,n,i){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),i.push(e))}makePairsUnique(t,e){const n=Vy,i=Wy,r=Xy,o=t.length;for(let a=0;a!==o;a++)i[a]=t[a],r[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){const l=i[a].id,c=r[a].id,h=l<c?`${l},${c}`:`${c},${l}`;n[h]=a,n.keys.push(h)}for(let a=0;a!==n.keys.length;a++){const l=n.keys.pop(),c=n[l];t.push(i[c]),e.push(r[c]),delete n[l]}}setWorld(t){}static boundingSphereCheck(t,e){const n=new S;t.position.vsub(e.position,n);const i=t.shapes[0],r=e.shapes[0];return Math.pow(i.boundingSphereRadius+r.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const Hy=new S;new S;new Ue;new S;const Vy={keys:[]},Wy=[],Xy=[];new S;new S;new S;class qy extends Gy{constructor(){super()}collisionPairs(t,e,n){const i=t.bodies,r=i.length;let o,a;for(let l=0;l!==r;l++)for(let c=0;c!==l;c++)o=i[l],a=i[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let i=0;i<t.bodies.length;i++){const r=t.bodies[i];r.aabbNeedsUpdate&&r.updateAABB(),r.aabb.overlaps(e)&&n.push(r)}return n}}class Pa{constructor(){this.rayFromWorld=new S,this.rayToWorld=new S,this.hitNormalWorld=new S,this.hitPointWorld=new S,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,i,r,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(i),this.shape=r,this.body=o,this.distance=a}}let ff,pf,mf,gf,vf,xf,_f;const rh={CLOSEST:1,ANY:2,ALL:4};ff=Tt.types.SPHERE;pf=Tt.types.PLANE;mf=Tt.types.BOX;gf=Tt.types.CYLINDER;vf=Tt.types.CONVEXPOLYHEDRON;xf=Tt.types.HEIGHTFIELD;_f=Tt.types.TRIMESH;class Ne{get[ff](){return this._intersectSphere}get[pf](){return this._intersectPlane}get[mf](){return this._intersectBox}get[gf](){return this._intersectConvex}get[vf](){return this._intersectConvex}get[xf](){return this._intersectHeightfield}get[_f](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new S),e===void 0&&(e=new S),this.from=t.clone(),this.to=e.clone(),this.direction=new S,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=Ne.ANY,this.result=new Pa,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||Ne.ANY,this.result=e.result||new Pa,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(id),Ol.length=0,t.broadphase.aabbQuery(t,id,Ol),this.intersectBodies(Ol),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;const i=Yy,r=$y;for(let o=0,a=t.shapes.length;o<a;o++){const l=t.shapes[o];if(!(n&&!l.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],r),t.quaternion.vmult(t.shapeOffsets[o],i),i.vadd(t.position,i),this.intersectShape(l,r,i,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,i=t.length;!this.result.shouldStop&&n<i;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,i){const r=this.from;if(lM(r,this.direction,n)>t.boundingSphereRadius)return;const a=this[t.type];a&&a.call(this,t,e,n,i,t)}_intersectBox(t,e,n,i,r){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,i,r)}_intersectPlane(t,e,n,i,r){const o=this.from,a=this.to,l=this.direction,c=new S(0,0,1);e.vmult(c,c);const h=new S;o.vsub(n,h);const d=h.dot(c);a.vsub(n,h);const u=h.dot(c);if(d*u>0||o.distanceTo(a)<d)return;const f=c.dot(l);if(Math.abs(f)<this.precision)return;const m=new S,v=new S,g=new S;o.vsub(n,m);const p=-c.dot(m)/f;l.scale(p,v),o.vadd(v,g),this.reportIntersection(c,g,r,i,-1)}getAABB(t){const{lowerBound:e,upperBound:n}=t,i=this.to,r=this.from;e.x=Math.min(i.x,r.x),e.y=Math.min(i.y,r.y),e.z=Math.min(i.z,r.z),n.x=Math.max(i.x,r.x),n.y=Math.max(i.y,r.y),n.z=Math.max(i.z,r.z)}_intersectHeightfield(t,e,n,i,r){t.data,t.elementSize;const o=jy;o.from.copy(this.from),o.to.copy(this.to),le.pointToLocalFrame(n,e,o.from,o.from),le.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();const a=Zy;let l,c,h,d;l=c=0,h=d=t.data.length-1;const u=new Sn;o.getAABB(u),t.getIndexOfPosition(u.lowerBound.x,u.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),t.getIndexOfPosition(u.upperBound.x,u.upperBound.y,a,!0),h=Math.min(h,a[0]+1),d=Math.min(d,a[1]+1);for(let f=l;f<h;f++)for(let m=c;m<d;m++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(f,m,u),!!u.overlapsRay(o)){if(t.getConvexTrianglePillar(f,m,!1),le.pointToWorldFrame(n,e,t.pillarOffset,aa),this._intersectConvex(t.pillarConvex,e,aa,i,r,sd),this.result.shouldStop)return;t.getConvexTrianglePillar(f,m,!0),le.pointToWorldFrame(n,e,t.pillarOffset,aa),this._intersectConvex(t.pillarConvex,e,aa,i,r,sd)}}}_intersectSphere(t,e,n,i,r){const o=this.from,a=this.to,l=t.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,h=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),d=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,u=h**2-4*c*d,f=Ky,m=Jy;if(!(u<0))if(u===0)o.lerp(a,u,f),f.vsub(n,m),m.normalize(),this.reportIntersection(m,f,r,i,-1);else{const v=(-h-Math.sqrt(u))/(2*c),g=(-h+Math.sqrt(u))/(2*c);if(v>=0&&v<=1&&(o.lerp(a,v,f),f.vsub(n,m),m.normalize(),this.reportIntersection(m,f,r,i,-1)),this.result.shouldStop)return;g>=0&&g<=1&&(o.lerp(a,g,f),f.vsub(n,m),m.normalize(),this.reportIntersection(m,f,r,i,-1))}}_intersectConvex(t,e,n,i,r,o){const a=Qy,l=rd,c=o&&o.faceList||null,h=t.faces,d=t.vertices,u=t.faceNormals,f=this.direction,m=this.from,v=this.to,g=m.distanceTo(v),p=c?c.length:h.length,x=this.result;for(let y=0;!x.shouldStop&&y<p;y++){const _=c?c[y]:y,T=h[_],A=u[_],R=e,I=n;l.copy(d[T[0]]),R.vmult(l,l),l.vadd(I,l),l.vsub(m,l),R.vmult(A,a);const b=f.dot(a);if(Math.abs(b)<this.precision)continue;const w=a.dot(l)/b;if(!(w<0)){f.scale(w,on),on.vadd(m,on),Bn.copy(d[T[0]]),R.vmult(Bn,Bn),I.vadd(Bn,Bn);for(let P=1;!x.shouldStop&&P<T.length-1;P++){qn.copy(d[T[P]]),Yn.copy(d[T[P+1]]),R.vmult(qn,qn),R.vmult(Yn,Yn),I.vadd(qn,qn),I.vadd(Yn,Yn);const k=on.distanceTo(m);!(Ne.pointInTriangle(on,Bn,qn,Yn)||Ne.pointInTriangle(on,qn,Bn,Yn))||k>g||this.reportIntersection(a,on,r,i,_)}}}}_intersectTrimesh(t,e,n,i,r,o){const a=tM,l=oM,c=aM,h=rd,d=eM,u=nM,f=iM,m=rM,v=sM,g=t.indices;t.vertices;const p=this.from,x=this.to,y=this.direction;c.position.copy(n),c.quaternion.copy(e),le.vectorToLocalFrame(n,e,y,d),le.pointToLocalFrame(n,e,p,u),le.pointToLocalFrame(n,e,x,f),f.x*=t.scale.x,f.y*=t.scale.y,f.z*=t.scale.z,u.x*=t.scale.x,u.y*=t.scale.y,u.z*=t.scale.z,f.vsub(u,d),d.normalize();const _=u.distanceSquared(f);t.tree.rayQuery(this,c,l);for(let T=0,A=l.length;!this.result.shouldStop&&T!==A;T++){const R=l[T];t.getNormal(R,a),t.getVertex(g[R*3],Bn),Bn.vsub(u,h);const I=d.dot(a),b=a.dot(h)/I;if(b<0)continue;d.scale(b,on),on.vadd(u,on),t.getVertex(g[R*3+1],qn),t.getVertex(g[R*3+2],Yn);const w=on.distanceSquared(u);!(Ne.pointInTriangle(on,qn,Bn,Yn)||Ne.pointInTriangle(on,Bn,qn,Yn))||w>_||(le.vectorToWorldFrame(e,a,v),le.pointToWorldFrame(n,e,on,m),this.reportIntersection(v,m,r,i,R))}l.length=0}reportIntersection(t,e,n,i,r){const o=this.from,a=this.to,l=o.distanceTo(e),c=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(c.hitFaceIndex=typeof r<"u"?r:-1,this.mode){case Ne.ALL:this.hasHit=!0,c.set(o,a,t,e,n,i,l),c.hasHit=!0,this.callback(c);break;case Ne.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,i,l));break;case Ne.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,i,l),c.shouldStop=!0;break}}static pointInTriangle(t,e,n,i){i.vsub(e,cs),n.vsub(e,Pr),t.vsub(e,Bl);const r=cs.dot(cs),o=cs.dot(Pr),a=cs.dot(Bl),l=Pr.dot(Pr),c=Pr.dot(Bl);let h,d;return(h=l*a-o*c)>=0&&(d=r*c-o*a)>=0&&h+d<r*l-o*o}}Ne.CLOSEST=rh.CLOSEST;Ne.ANY=rh.ANY;Ne.ALL=rh.ALL;const id=new Sn,Ol=[],Pr=new S,Bl=new S,Yy=new S,$y=new Ue,on=new S,Bn=new S,qn=new S,Yn=new S;new S;new Pa;const sd={faceList:[0]},aa=new S,jy=new Ne,Zy=[],Ky=new S,Jy=new S,Qy=new S;new S;new S;const rd=new S,tM=new S,eM=new S,nM=new S,iM=new S,sM=new S,rM=new S;new Sn;const oM=[],aM=new le,cs=new S,la=new S;function lM(s,t,e){e.vsub(s,cs);const n=cs.dot(t);return t.scale(n,la),la.vadd(s,la),e.distanceTo(la)}class cM{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}}class od{constructor(){this.spatial=new S,this.rotational=new S}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}}class go{constructor(t,e,n,i){n===void 0&&(n=-1e6),i===void 0&&(i=1e6),this.id=go.idCounter++,this.minForce=n,this.maxForce=i,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new od,this.jacobianElementB=new od,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){const i=e,r=t,o=n;this.a=4/(o*(1+4*i)),this.b=4*i/(1+4*i),this.eps=4/(o*o*r*(1+4*i))}computeB(t,e,n){const i=this.computeGW(),r=this.computeGq(),o=this.computeGiMf();return-r*t-i*e-o*n}computeGq(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.position,o=i.position;return t.spatial.dot(r)+e.spatial.dot(o)}computeGW(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.velocity,o=i.velocity,a=n.angularVelocity,l=i.angularVelocity;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGWlambda(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.vlambda,o=i.vlambda,a=n.wlambda,l=i.wlambda;return t.multiplyVectors(r,a)+e.multiplyVectors(o,l)}computeGiMf(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.force,o=n.torque,a=i.force,l=i.torque,c=n.invMassSolve,h=i.invMassSolve;return r.scale(c,ad),a.scale(h,ld),n.invInertiaWorldSolve.vmult(o,cd),i.invInertiaWorldSolve.vmult(l,hd),t.multiplyVectors(ad,cd)+e.multiplyVectors(ld,hd)}computeGiMGt(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,r=n.invMassSolve,o=i.invMassSolve,a=n.invInertiaWorldSolve,l=i.invInertiaWorldSolve;let c=r+o;return a.vmult(t.rotational,ca),c+=ca.dot(t.rotational),l.vmult(e.rotational,ca),c+=ca.dot(e.rotational),c}addToWlambda(t){const e=this.jacobianElementA,n=this.jacobianElementB,i=this.bi,r=this.bj,o=hM;i.vlambda.addScaledVector(i.invMassSolve*t,e.spatial,i.vlambda),r.vlambda.addScaledVector(r.invMassSolve*t,n.spatial,r.vlambda),i.invInertiaWorldSolve.vmult(e.rotational,o),i.wlambda.addScaledVector(t,o,i.wlambda),r.invInertiaWorldSolve.vmult(n.rotational,o),r.wlambda.addScaledVector(t,o,r.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}go.idCounter=0;const ad=new S,ld=new S,cd=new S,hd=new S,ca=new S,hM=new S;class uM extends go{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new S,this.rj=new S,this.ni=new S}computeB(t){const e=this.a,n=this.b,i=this.bi,r=this.bj,o=this.ri,a=this.rj,l=dM,c=fM,h=i.velocity,d=i.angularVelocity;i.force,i.torque;const u=r.velocity,f=r.angularVelocity;r.force,r.torque;const m=pM,v=this.jacobianElementA,g=this.jacobianElementB,p=this.ni;o.cross(p,l),a.cross(p,c),p.negate(v.spatial),l.negate(v.rotational),g.spatial.copy(p),g.rotational.copy(c),m.copy(r.position),m.vadd(a,m),m.vsub(i.position,m),m.vsub(o,m);const x=p.dot(m),y=this.restitution+1,_=y*u.dot(p)-y*h.dot(p)+f.dot(c)-d.dot(l),T=this.computeGiMf();return-x*e-_*n-t*T}getImpactVelocityAlongNormal(){const t=mM,e=gM,n=vM,i=xM,r=_M;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,i),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(i,e),t.vsub(e,r),this.ni.dot(r)}}const dM=new S,fM=new S,pM=new S,mM=new S,gM=new S,vM=new S,xM=new S,_M=new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;class ud extends go{constructor(t,e,n){super(t,e,-n,n),this.ri=new S,this.rj=new S,this.t=new S}computeB(t){this.a;const e=this.b;this.bi,this.bj;const n=this.ri,i=this.rj,r=yM,o=MM,a=this.t;n.cross(a,r),i.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),r.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const h=this.computeGW(),d=this.computeGiMf();return-h*e-t*d}}const yM=new S,MM=new S;class vo{constructor(t,e,n){n=cM.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=vo.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}vo.idCounter=0;class xr{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=xr.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}}xr.idCounter=0;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new Ne;new S;new S;new S;new S(1,0,0),new S(0,1,0),new S(0,0,1);new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;class yf extends Tt{constructor(t){if(super({type:Tt.types.SPHERE}),this.radius=t!==void 0?t:1,this.radius<0)throw new Error("The sphere radius cannot be negative.");this.updateBoundingSphereRadius()}calculateLocalInertia(t,e){e===void 0&&(e=new S);const n=2*t*this.radius*this.radius/5;return e.x=n,e.y=n,e.z=n,e}volume(){return 4*Math.PI*Math.pow(this.radius,3)/3}updateBoundingSphereRadius(){this.boundingSphereRadius=this.radius}calculateWorldAABB(t,e,n,i){const r=this.radius,o=["x","y","z"];for(let a=0;a<o.length;a++){const l=o[a];n[l]=t[l]-r,i[l]=t[l]+r}}}new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new S;new Sn;new S;new Sn;new S;new S;new S;new S;new S;new S;new S;new Sn;new S;new le;new Sn;class SM{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){const e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}}class wM extends SM{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0;const i=this.iterations,r=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=e.bodies,c=l.length,h=t;let d,u,f,m,v,g;if(a!==0)for(let _=0;_!==c;_++)l[_].updateSolveMassProperties();const p=bM,x=TM,y=EM;p.length=a,x.length=a,y.length=a;for(let _=0;_!==a;_++){const T=o[_];y[_]=0,x[_]=T.computeB(h),p[_]=1/T.computeC()}if(a!==0){for(let A=0;A!==c;A++){const R=l[A],I=R.vlambda,b=R.wlambda;I.set(0,0,0),b.set(0,0,0)}for(n=0;n!==i;n++){m=0;for(let A=0;A!==a;A++){const R=o[A];d=x[A],u=p[A],g=y[A],v=R.computeGWlambda(),f=u*(d-v-R.eps*g),g+f<R.minForce?f=R.minForce-g:g+f>R.maxForce&&(f=R.maxForce-g),y[A]+=f,m+=f>0?f:-f,R.addToWlambda(f)}if(m*m<r)break}for(let A=0;A!==c;A++){const R=l[A],I=R.velocity,b=R.angularVelocity;R.vlambda.vmul(R.linearFactor,R.vlambda),I.vadd(R.vlambda,I),R.wlambda.vmul(R.angularFactor,R.wlambda),b.vadd(R.wlambda,b)}let _=o.length;const T=1/h;for(;_--;)o[_].multiplier=y[_]*T}return n}}const EM=[],bM=[],TM=[];class AM{constructor(){this.objects=[],this.type=Object}release(){const t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){const e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}}class CM extends AM{constructor(){super(...arguments),this.type=S}constructObject(){return new S}}const we={sphereSphere:Tt.types.SPHERE,spherePlane:Tt.types.SPHERE|Tt.types.PLANE,boxBox:Tt.types.BOX|Tt.types.BOX,sphereBox:Tt.types.SPHERE|Tt.types.BOX,planeBox:Tt.types.PLANE|Tt.types.BOX,convexConvex:Tt.types.CONVEXPOLYHEDRON,sphereConvex:Tt.types.SPHERE|Tt.types.CONVEXPOLYHEDRON,planeConvex:Tt.types.PLANE|Tt.types.CONVEXPOLYHEDRON,boxConvex:Tt.types.BOX|Tt.types.CONVEXPOLYHEDRON,sphereHeightfield:Tt.types.SPHERE|Tt.types.HEIGHTFIELD,boxHeightfield:Tt.types.BOX|Tt.types.HEIGHTFIELD,convexHeightfield:Tt.types.CONVEXPOLYHEDRON|Tt.types.HEIGHTFIELD,sphereParticle:Tt.types.PARTICLE|Tt.types.SPHERE,planeParticle:Tt.types.PLANE|Tt.types.PARTICLE,boxParticle:Tt.types.BOX|Tt.types.PARTICLE,convexParticle:Tt.types.PARTICLE|Tt.types.CONVEXPOLYHEDRON,cylinderCylinder:Tt.types.CYLINDER,sphereCylinder:Tt.types.SPHERE|Tt.types.CYLINDER,planeCylinder:Tt.types.PLANE|Tt.types.CYLINDER,boxCylinder:Tt.types.BOX|Tt.types.CYLINDER,convexCylinder:Tt.types.CONVEXPOLYHEDRON|Tt.types.CYLINDER,heightfieldCylinder:Tt.types.HEIGHTFIELD|Tt.types.CYLINDER,particleCylinder:Tt.types.PARTICLE|Tt.types.CYLINDER,sphereTrimesh:Tt.types.SPHERE|Tt.types.TRIMESH,planeTrimesh:Tt.types.PLANE|Tt.types.TRIMESH};class RM{get[we.sphereSphere](){return this.sphereSphere}get[we.spherePlane](){return this.spherePlane}get[we.boxBox](){return this.boxBox}get[we.sphereBox](){return this.sphereBox}get[we.planeBox](){return this.planeBox}get[we.convexConvex](){return this.convexConvex}get[we.sphereConvex](){return this.sphereConvex}get[we.planeConvex](){return this.planeConvex}get[we.boxConvex](){return this.boxConvex}get[we.sphereHeightfield](){return this.sphereHeightfield}get[we.boxHeightfield](){return this.boxHeightfield}get[we.convexHeightfield](){return this.convexHeightfield}get[we.sphereParticle](){return this.sphereParticle}get[we.planeParticle](){return this.planeParticle}get[we.boxParticle](){return this.boxParticle}get[we.convexParticle](){return this.convexParticle}get[we.cylinderCylinder](){return this.convexConvex}get[we.sphereCylinder](){return this.sphereConvex}get[we.planeCylinder](){return this.planeConvex}get[we.boxCylinder](){return this.boxConvex}get[we.convexCylinder](){return this.convexConvex}get[we.heightfieldCylinder](){return this.heightfieldCylinder}get[we.particleCylinder](){return this.particleCylinder}get[we.sphereTrimesh](){return this.sphereTrimesh}get[we.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new CM,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,i,r,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new uM(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&i.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||t.material,h=i.material||e.material;return c&&h&&c.restitution>=0&&h.restitution>=0&&(a.restitution=c.restitution*h.restitution),a.si=r||n,a.sj=o||i,a}createFrictionEquationsFromContact(t,e){const n=t.bi,i=t.bj,r=t.si,o=t.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const h=r.material||n.material,d=o.material||i.material;if(h&&d&&h.friction>=0&&d.friction>=0&&(c=h.friction*d.friction),c>0){const u=c*(a.frictionGravity||a.gravity).length();let f=n.invMass+i.invMass;f>0&&(f=1/f);const m=this.frictionEquationPool,v=m.length?m.pop():new ud(n,i,u*f),g=m.length?m.pop():new ud(n,i,u*f);return v.bi=g.bi=n,v.bj=g.bj=i,v.minForce=g.minForce=-u*f,v.maxForce=g.maxForce=u*f,v.ri.copy(t.ri),v.rj.copy(t.rj),g.ri.copy(t.ri),g.rj.copy(t.rj),t.ni.tangents(v.t,g.t),v.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),g.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),v.enabled=g.enabled=t.enabled,e.push(v,g),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;const n=this.frictionResult[this.frictionResult.length-2],i=this.frictionResult[this.frictionResult.length-1];ss.setZero(),Ys.setZero(),$s.setZero();const r=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==r?(ss.vadd(e.ni,ss),Ys.vadd(e.ri,Ys),$s.vadd(e.rj,$s)):(ss.vsub(e.ni,ss),Ys.vadd(e.rj,Ys),$s.vadd(e.ri,$s));const o=1/t;Ys.scale(o,n.ri),$s.scale(o,n.rj),i.ri.copy(n.ri),i.rj.copy(n.rj),ss.normalize(),ss.tangents(n.t,i.t)}getContacts(t,e,n,i,r,o,a){this.contactPointPool=r,this.frictionEquationPool=a,this.result=i,this.frictionResult=o;const l=IM,c=DM,h=PM,d=LM;for(let u=0,f=t.length;u!==f;u++){const m=t[u],v=e[u];let g=null;m.material&&v.material&&(g=n.getContactMaterial(m.material,v.material)||null);const p=m.type&wt.KINEMATIC&&v.type&wt.STATIC||m.type&wt.STATIC&&v.type&wt.KINEMATIC||m.type&wt.KINEMATIC&&v.type&wt.KINEMATIC;for(let x=0;x<m.shapes.length;x++){m.quaternion.mult(m.shapeOrientations[x],l),m.quaternion.vmult(m.shapeOffsets[x],h),h.vadd(m.position,h);const y=m.shapes[x];for(let _=0;_<v.shapes.length;_++){v.quaternion.mult(v.shapeOrientations[_],c),v.quaternion.vmult(v.shapeOffsets[_],d),d.vadd(v.position,d);const T=v.shapes[_];if(!(y.collisionFilterMask&T.collisionFilterGroup&&T.collisionFilterMask&y.collisionFilterGroup)||h.distanceTo(d)>y.boundingSphereRadius+T.boundingSphereRadius)continue;let A=null;y.material&&T.material&&(A=n.getContactMaterial(y.material,T.material)||null),this.currentContactMaterial=A||g||n.defaultContactMaterial;const R=y.type|T.type,I=this[R];if(I){let b=!1;y.type<T.type?b=I.call(this,y,T,h,d,l,c,m,v,y,T,p):b=I.call(this,T,y,d,h,c,l,v,m,y,T,p),b&&p&&(n.shapeOverlapKeeper.set(y.id,T.id),n.bodyOverlapKeeper.set(m.id,v.id))}}}}}sphereSphere(t,e,n,i,r,o,a,l,c,h,d){if(d)return n.distanceSquared(i)<(t.radius+e.radius)**2;const u=this.createContactEquation(a,l,t,e,c,h);i.vsub(n,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.scale(t.radius,u.ri),u.rj.scale(-e.radius,u.rj),u.ri.vadd(n,u.ri),u.ri.vsub(a.position,u.ri),u.rj.vadd(i,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}spherePlane(t,e,n,i,r,o,a,l,c,h,d){const u=this.createContactEquation(a,l,t,e,c,h);if(u.ni.set(0,0,1),o.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.scale(t.radius,u.ri),n.vsub(i,ha),u.ni.scale(u.ni.dot(ha),dd),ha.vsub(dd,u.rj),-ha.dot(u.ni)<=t.radius){if(d)return!0;const f=u.ri,m=u.rj;f.vadd(n,f),f.vsub(a.position,f),m.vadd(i,m),m.vsub(l.position,m),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}}boxBox(t,e,n,i,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,i,r,o,a,l,t,e,d)}sphereBox(t,e,n,i,r,o,a,l,c,h,d){const u=this.v3pool,f=rS;n.vsub(i,ua),e.getSideNormals(f,o);const m=t.radius;let v=!1;const g=aS,p=lS,x=cS;let y=null,_=0,T=0,A=0,R=null;for(let U=0,Y=f.length;U!==Y&&v===!1;U++){const G=nS;G.copy(f[U]);const Z=G.length();G.normalize();const dt=ua.dot(G);if(dt<Z+m&&dt>0){const pt=iS,ct=sS;pt.copy(f[(U+1)%3]),ct.copy(f[(U+2)%3]);const Xt=pt.length(),ie=ct.length();pt.normalize(),ct.normalize();const Jt=ua.dot(pt),j=ua.dot(ct);if(Jt<Xt&&Jt>-Xt&&j<ie&&j>-ie){const et=Math.abs(dt-Z-m);if((R===null||et<R)&&(R=et,T=Jt,A=j,y=Z,g.copy(G),p.copy(pt),x.copy(ct),_++,d))return!0}}}if(_){v=!0;const U=this.createContactEquation(a,l,t,e,c,h);g.scale(-m,U.ri),U.ni.copy(g),U.ni.negate(U.ni),g.scale(y,g),p.scale(T,p),g.vadd(p,g),x.scale(A,x),g.vadd(x,U.rj),U.ri.vadd(n,U.ri),U.ri.vsub(a.position,U.ri),U.rj.vadd(i,U.rj),U.rj.vsub(l.position,U.rj),this.result.push(U),this.createFrictionEquationsFromContact(U,this.frictionResult)}let I=u.get();const b=oS;for(let U=0;U!==2&&!v;U++)for(let Y=0;Y!==2&&!v;Y++)for(let G=0;G!==2&&!v;G++)if(I.set(0,0,0),U?I.vadd(f[0],I):I.vsub(f[0],I),Y?I.vadd(f[1],I):I.vsub(f[1],I),G?I.vadd(f[2],I):I.vsub(f[2],I),i.vadd(I,b),b.vsub(n,b),b.lengthSquared()<m*m){if(d)return!0;v=!0;const Z=this.createContactEquation(a,l,t,e,c,h);Z.ri.copy(b),Z.ri.normalize(),Z.ni.copy(Z.ri),Z.ri.scale(m,Z.ri),Z.rj.copy(I),Z.ri.vadd(n,Z.ri),Z.ri.vsub(a.position,Z.ri),Z.rj.vadd(i,Z.rj),Z.rj.vsub(l.position,Z.rj),this.result.push(Z),this.createFrictionEquationsFromContact(Z,this.frictionResult)}u.release(I),I=null;const w=u.get(),P=u.get(),k=u.get(),D=u.get(),B=u.get(),F=f.length;for(let U=0;U!==F&&!v;U++)for(let Y=0;Y!==F&&!v;Y++)if(U%3!==Y%3){f[Y].cross(f[U],w),w.normalize(),f[U].vadd(f[Y],P),k.copy(n),k.vsub(P,k),k.vsub(i,k);const G=k.dot(w);w.scale(G,D);let Z=0;for(;Z===U%3||Z===Y%3;)Z++;B.copy(n),B.vsub(D,B),B.vsub(P,B),B.vsub(i,B);const dt=Math.abs(G),pt=B.length();if(dt<f[Z].length()&&pt<m){if(d)return!0;v=!0;const ct=this.createContactEquation(a,l,t,e,c,h);P.vadd(D,ct.rj),ct.rj.copy(ct.rj),B.negate(ct.ni),ct.ni.normalize(),ct.ri.copy(ct.rj),ct.ri.vadd(i,ct.ri),ct.ri.vsub(n,ct.ri),ct.ri.normalize(),ct.ri.scale(m,ct.ri),ct.ri.vadd(n,ct.ri),ct.ri.vsub(a.position,ct.ri),ct.rj.vadd(i,ct.rj),ct.rj.vsub(l.position,ct.rj),this.result.push(ct),this.createFrictionEquationsFromContact(ct,this.frictionResult)}}u.release(w,P,k,D,B)}planeBox(t,e,n,i,r,o,a,l,c,h,d){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,i,r,o,a,l,t,e,d)}convexConvex(t,e,n,i,r,o,a,l,c,h,d,u,f){const m=ES;if(!(n.distanceTo(i)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,r,i,o,m,u,f)){const v=[],g=bS;t.clipAgainstHull(n,r,e,i,o,m,-100,100,v);let p=0;for(let x=0;x!==v.length;x++){if(d)return!0;const y=this.createContactEquation(a,l,t,e,c,h),_=y.ri,T=y.rj;m.negate(y.ni),v[x].normal.negate(g),g.scale(v[x].depth,g),v[x].point.vadd(g,_),T.copy(v[x].point),_.vsub(n,_),T.vsub(i,T),_.vadd(n,_),_.vsub(a.position,_),T.vadd(i,T),T.vsub(l.position,T),this.result.push(y),p++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(y,this.frictionResult)}this.enableFrictionReduction&&p&&this.createFrictionFromAverage(p)}}sphereConvex(t,e,n,i,r,o,a,l,c,h,d){const u=this.v3pool;n.vsub(i,hS);const f=e.faceNormals,m=e.faces,v=e.vertices,g=t.radius;let p=!1;for(let x=0;x!==v.length;x++){const y=v[x],_=pS;o.vmult(y,_),i.vadd(_,_);const T=fS;if(_.vsub(n,T),T.lengthSquared()<g*g){if(d)return!0;p=!0;const A=this.createContactEquation(a,l,t,e,c,h);A.ri.copy(T),A.ri.normalize(),A.ni.copy(A.ri),A.ri.scale(g,A.ri),_.vsub(i,A.rj),A.ri.vadd(n,A.ri),A.ri.vsub(a.position,A.ri),A.rj.vadd(i,A.rj),A.rj.vsub(l.position,A.rj),this.result.push(A),this.createFrictionEquationsFromContact(A,this.frictionResult);return}}for(let x=0,y=m.length;x!==y&&p===!1;x++){const _=f[x],T=m[x],A=mS;o.vmult(_,A);const R=gS;o.vmult(v[T[0]],R),R.vadd(i,R);const I=vS;A.scale(-g,I),n.vadd(I,I);const b=xS;I.vsub(R,b);const w=b.dot(A),P=_S;if(n.vsub(R,P),w<0&&P.dot(A)>0){const k=[];for(let D=0,B=T.length;D!==B;D++){const F=u.get();o.vmult(v[T[D]],F),i.vadd(F,F),k.push(F)}if(eS(k,A,n)){if(d)return!0;p=!0;const D=this.createContactEquation(a,l,t,e,c,h);A.scale(-g,D.ri),A.negate(D.ni);const B=u.get();A.scale(-w,B);const F=u.get();A.scale(-g,F),n.vsub(i,D.rj),D.rj.vadd(F,D.rj),D.rj.vadd(B,D.rj),D.rj.vadd(i,D.rj),D.rj.vsub(l.position,D.rj),D.ri.vadd(n,D.ri),D.ri.vsub(a.position,D.ri),u.release(B),u.release(F),this.result.push(D),this.createFrictionEquationsFromContact(D,this.frictionResult);for(let U=0,Y=k.length;U!==Y;U++)u.release(k[U]);return}else for(let D=0;D!==T.length;D++){const B=u.get(),F=u.get();o.vmult(v[T[(D+1)%T.length]],B),o.vmult(v[T[(D+2)%T.length]],F),i.vadd(B,B),i.vadd(F,F);const U=uS;F.vsub(B,U);const Y=dS;U.unit(Y);const G=u.get(),Z=u.get();n.vsub(B,Z);const dt=Z.dot(Y);Y.scale(dt,G),G.vadd(B,G);const pt=u.get();if(G.vsub(n,pt),dt>0&&dt*dt<U.lengthSquared()&&pt.lengthSquared()<g*g){if(d)return!0;const ct=this.createContactEquation(a,l,t,e,c,h);G.vsub(i,ct.rj),G.vsub(n,ct.ni),ct.ni.normalize(),ct.ni.scale(g,ct.ri),ct.rj.vadd(i,ct.rj),ct.rj.vsub(l.position,ct.rj),ct.ri.vadd(n,ct.ri),ct.ri.vsub(a.position,ct.ri),this.result.push(ct),this.createFrictionEquationsFromContact(ct,this.frictionResult);for(let Xt=0,ie=k.length;Xt!==ie;Xt++)u.release(k[Xt]);u.release(B),u.release(F),u.release(G),u.release(pt),u.release(Z);return}u.release(B),u.release(F),u.release(G),u.release(pt),u.release(Z)}for(let D=0,B=k.length;D!==B;D++)u.release(k[D])}}}planeConvex(t,e,n,i,r,o,a,l,c,h,d){const u=yS,f=MS;f.set(0,0,1),r.vmult(f,f);let m=0;const v=SS;for(let g=0;g!==e.vertices.length;g++)if(u.copy(e.vertices[g]),o.vmult(u,u),i.vadd(u,u),u.vsub(n,v),f.dot(v)<=0){if(d)return!0;const x=this.createContactEquation(a,l,t,e,c,h),y=wS;f.scale(f.dot(v),y),u.vsub(y,y),y.vsub(n,x.ri),x.ni.copy(f),u.vsub(i,x.rj),x.ri.vadd(n,x.ri),x.ri.vsub(a.position,x.ri),x.rj.vadd(i,x.rj),x.rj.vsub(l.position,x.rj),this.result.push(x),m++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(x,this.frictionResult)}this.enableFrictionReduction&&m&&this.createFrictionFromAverage(m)}boxConvex(t,e,n,i,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,i,r,o,a,l,t,e,d)}sphereHeightfield(t,e,n,i,r,o,a,l,c,h,d){const u=e.data,f=t.radius,m=e.elementSize,v=OS,g=FS;le.pointToLocalFrame(i,o,n,g);let p=Math.floor((g.x-f)/m)-1,x=Math.ceil((g.x+f)/m)+1,y=Math.floor((g.y-f)/m)-1,_=Math.ceil((g.y+f)/m)+1;if(x<0||_<0||p>u.length||y>u[0].length)return;p<0&&(p=0),x<0&&(x=0),y<0&&(y=0),_<0&&(_=0),p>=u.length&&(p=u.length-1),x>=u.length&&(x=u.length-1),_>=u[0].length&&(_=u[0].length-1),y>=u[0].length&&(y=u[0].length-1);const T=[];e.getRectMinMax(p,y,x,_,T);const A=T[0],R=T[1];if(g.z-f>R||g.z+f<A)return;const I=this.result;for(let b=p;b<x;b++)for(let w=y;w<_;w++){const P=I.length;let k=!1;if(e.getConvexTrianglePillar(b,w,!1),le.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(k=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,d)),d&&k||(e.getConvexTrianglePillar(b,w,!0),le.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(k=this.sphereConvex(t,e.pillarConvex,n,v,r,o,a,l,t,e,d)),d&&k))return!0;if(I.length-P>2)return}}boxHeightfield(t,e,n,i,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,i,r,o,a,l,t,e,d)}convexHeightfield(t,e,n,i,r,o,a,l,c,h,d){const u=e.data,f=e.elementSize,m=t.boundingSphereRadius,v=NS,g=US,p=DS;le.pointToLocalFrame(i,o,n,p);let x=Math.floor((p.x-m)/f)-1,y=Math.ceil((p.x+m)/f)+1,_=Math.floor((p.y-m)/f)-1,T=Math.ceil((p.y+m)/f)+1;if(y<0||T<0||x>u.length||_>u[0].length)return;x<0&&(x=0),y<0&&(y=0),_<0&&(_=0),T<0&&(T=0),x>=u.length&&(x=u.length-1),y>=u.length&&(y=u.length-1),T>=u[0].length&&(T=u[0].length-1),_>=u[0].length&&(_=u[0].length-1);const A=[];e.getRectMinMax(x,_,y,T,A);const R=A[0],I=A[1];if(!(p.z-m>I||p.z+m<R))for(let b=x;b<y;b++)for(let w=_;w<T;w++){let P=!1;if(e.getConvexTrianglePillar(b,w,!1),le.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(P=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,d,g,null)),d&&P||(e.getConvexTrianglePillar(b,w,!0),le.pointToWorldFrame(i,o,e.pillarOffset,v),n.distanceTo(v)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(P=this.convexConvex(t,e.pillarConvex,n,v,r,o,a,l,null,null,d,g,null)),d&&P))return!0}}sphereParticle(t,e,n,i,r,o,a,l,c,h,d){const u=RS;if(u.set(0,0,1),i.vsub(n,u),u.lengthSquared()<=t.radius*t.radius){if(d)return!0;const m=this.createContactEquation(l,a,e,t,c,h);u.normalize(),m.rj.copy(u),m.rj.scale(t.radius,m.rj),m.ni.copy(u),m.ni.negate(m.ni),m.ri.set(0,0,0),this.result.push(m),this.createFrictionEquationsFromContact(m,this.frictionResult)}}planeParticle(t,e,n,i,r,o,a,l,c,h,d){const u=TS;u.set(0,0,1),a.quaternion.vmult(u,u);const f=AS;if(i.vsub(a.position,f),u.dot(f)<=0){if(d)return!0;const v=this.createContactEquation(l,a,e,t,c,h);v.ni.copy(u),v.ni.negate(v.ni),v.ri.set(0,0,0);const g=CS;u.scale(u.dot(i),g),i.vsub(g,g),v.rj.copy(g),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}boxParticle(t,e,n,i,r,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,i,r,o,a,l,t,e,d)}convexParticle(t,e,n,i,r,o,a,l,c,h,d){let u=-1;const f=LS,m=IS;let v=null;const g=PS;if(g.copy(i),g.vsub(n,g),r.conjugate(fd),fd.vmult(g,g),t.pointIsInside(g)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,r),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(r);for(let p=0,x=t.faces.length;p!==x;p++){const y=[t.worldVertices[t.faces[p][0]]],_=t.worldFaceNormals[p];i.vsub(y[0],pd);const T=-_.dot(pd);if(v===null||Math.abs(T)<Math.abs(v)){if(d)return!0;v=T,u=p,f.copy(_)}}if(u!==-1){const p=this.createContactEquation(l,a,e,t,c,h);f.scale(v,m),m.vadd(i,m),m.vsub(n,m),p.rj.copy(m),f.negate(p.ni),p.ri.set(0,0,0);const x=p.ri,y=p.rj;x.vadd(i,x),x.vsub(l.position,x),y.vadd(n,y),y.vsub(a.position,y),this.result.push(p),this.createFrictionEquationsFromContact(p,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,i,r,o,a,l,c,h,d){return this.convexHeightfield(e,t,i,n,o,r,l,a,c,h,d)}particleCylinder(t,e,n,i,r,o,a,l,c,h,d){return this.convexParticle(e,t,i,n,o,r,l,a,c,h,d)}sphereTrimesh(t,e,n,i,r,o,a,l,c,h,d){const u=GM,f=HM,m=VM,v=WM,g=XM,p=qM,x=ZM,y=kM,_=BM,T=KM;le.pointToLocalFrame(i,o,n,g);const A=t.radius;x.lowerBound.set(g.x-A,g.y-A,g.z-A),x.upperBound.set(g.x+A,g.y+A,g.z+A),e.getTrianglesInAABB(x,T);const R=zM,I=t.radius*t.radius;for(let D=0;D<T.length;D++)for(let B=0;B<3;B++)if(e.getVertex(e.indices[T[D]*3+B],R),R.vsub(g,_),_.lengthSquared()<=I){if(y.copy(R),le.pointToWorldFrame(i,o,y,R),R.vsub(n,_),d)return!0;let F=this.createContactEquation(a,l,t,e,c,h);F.ni.copy(_),F.ni.normalize(),F.ri.copy(F.ni),F.ri.scale(t.radius,F.ri),F.ri.vadd(n,F.ri),F.ri.vsub(a.position,F.ri),F.rj.copy(R),F.rj.vsub(l.position,F.rj),this.result.push(F),this.createFrictionEquationsFromContact(F,this.frictionResult)}for(let D=0;D<T.length;D++)for(let B=0;B<3;B++){e.getVertex(e.indices[T[D]*3+B],u),e.getVertex(e.indices[T[D]*3+(B+1)%3],f),f.vsub(u,m),g.vsub(f,p);const F=p.dot(m);g.vsub(u,p);let U=p.dot(m);if(U>0&&F<0&&(g.vsub(u,p),v.copy(m),v.normalize(),U=p.dot(v),v.scale(U,p),p.vadd(u,p),p.distanceTo(g)<t.radius)){if(d)return!0;const G=this.createContactEquation(a,l,t,e,c,h);p.vsub(g,G.ni),G.ni.normalize(),G.ni.scale(t.radius,G.ri),G.ri.vadd(n,G.ri),G.ri.vsub(a.position,G.ri),le.pointToWorldFrame(i,o,p,p),p.vsub(l.position,G.rj),le.vectorToWorldFrame(o,G.ni,G.ni),le.vectorToWorldFrame(o,G.ri,G.ri),this.result.push(G),this.createFrictionEquationsFromContact(G,this.frictionResult)}}const b=YM,w=$M,P=jM,k=OM;for(let D=0,B=T.length;D!==B;D++){e.getTriangleVertices(T[D],b,w,P),e.getNormal(T[D],k),g.vsub(b,p);let F=p.dot(k);if(k.scale(F,p),g.vsub(p,p),F=p.distanceTo(g),Ne.pointInTriangle(p,b,w,P)&&F<t.radius){if(d)return!0;let U=this.createContactEquation(a,l,t,e,c,h);p.vsub(g,U.ni),U.ni.normalize(),U.ni.scale(t.radius,U.ri),U.ri.vadd(n,U.ri),U.ri.vsub(a.position,U.ri),le.pointToWorldFrame(i,o,p,p),p.vsub(l.position,U.rj),le.vectorToWorldFrame(o,U.ni,U.ni),le.vectorToWorldFrame(o,U.ri,U.ri),this.result.push(U),this.createFrictionEquationsFromContact(U,this.frictionResult)}}T.length=0}planeTrimesh(t,e,n,i,r,o,a,l,c,h,d){const u=new S,f=NM;f.set(0,0,1),r.vmult(f,f);for(let m=0;m<e.vertices.length/3;m++){e.getVertex(m,u);const v=new S;v.copy(u),le.pointToWorldFrame(i,o,v,u);const g=UM;if(u.vsub(n,g),f.dot(g)<=0){if(d)return!0;const x=this.createContactEquation(a,l,t,e,c,h);x.ni.copy(f);const y=FM;f.scale(g.dot(f),y),u.vsub(y,y),x.ri.copy(y),x.ri.vsub(a.position,x.ri),x.rj.copy(u),x.rj.vsub(l.position,x.rj),this.result.push(x),this.createFrictionEquationsFromContact(x,this.frictionResult)}}}}const ss=new S,Ys=new S,$s=new S,PM=new S,LM=new S,IM=new Ue,DM=new Ue,NM=new S,UM=new S,FM=new S,OM=new S,BM=new S;new S;const zM=new S,kM=new S,GM=new S,HM=new S,VM=new S,WM=new S,XM=new S,qM=new S,YM=new S,$M=new S,jM=new S,ZM=new Sn,KM=[],ha=new S,dd=new S,JM=new S,QM=new S,tS=new S;function eS(s,t,e){let n=null;const i=s.length;for(let r=0;r!==i;r++){const o=s[r],a=JM;s[(r+1)%i].vsub(o,a);const l=QM;a.cross(t,l);const c=tS;e.vsub(o,c);const h=l.dot(c);if(n===null||h>0&&n===!0||h<=0&&n===!1){n===null&&(n=h>0);continue}else return!1}return!0}const ua=new S,nS=new S,iS=new S,sS=new S,rS=[new S,new S,new S,new S,new S,new S],oS=new S,aS=new S,lS=new S,cS=new S,hS=new S,uS=new S,dS=new S,fS=new S,pS=new S,mS=new S,gS=new S,vS=new S,xS=new S,_S=new S;new S;new S;const yS=new S,MS=new S,SS=new S,wS=new S,ES=new S,bS=new S,TS=new S,AS=new S,CS=new S,RS=new S,fd=new Ue,PS=new S;new S;const LS=new S,pd=new S,IS=new S,DS=new S,NS=new S,US=[0],FS=new S,OS=new S;class md{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){const n=e;e=t,t=n}return t<<16|e}set(t,e){const n=this.getKey(t,e),i=this.current;let r=0;for(;n>i[r];)r++;if(n!==i[r]){for(let o=i.length-1;o>=r;o--)i[o+1]=i[o];i[r]=n}}tick(){const t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){const n=this.current,i=this.previous,r=n.length,o=i.length;let a=0;for(let l=0;l<r;l++){let c=!1;const h=n[l];for(;h>i[a];)a++;c=h===i[a],c||gd(t,h)}a=0;for(let l=0;l<o;l++){let c=!1;const h=i[l];for(;h>n[a];)a++;c=n[a]===h,c||gd(e,h)}}}function gd(s,t){s.push((t&4294901760)>>16,t&65535)}const zl=(s,t)=>s<t?`${s}-${t}`:`${t}-${s}`;class BS{constructor(){this.data={keys:[]}}get(t,e){const n=zl(t,e);return this.data[n]}set(t,e,n){const i=zl(t,e);this.get(t,e)||this.data.keys.push(i),this.data[i]=n}delete(t,e){const n=zl(t,e),i=this.data.keys.indexOf(n);i!==-1&&this.data.keys.splice(i,1),delete this.data[n]}reset(){const t=this.data,e=t.keys;for(;e.length>0;){const n=e.pop();delete t[n]}}}class zS extends df{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new S,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new S,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new qy,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new wM,this.constraints=[],this.narrowphase=new RM(this),this.collisionMatrix=new ed,this.collisionMatrixPrevious=new ed,this.bodyOverlapKeeper=new md,this.shapeOverlapKeeper=new md,this.contactmaterials=[],this.contactMaterialTable=new BS,this.defaultMaterial=new xr("default"),this.defaultContactMaterial=new vo(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){const t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){const e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof Pa?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,i){return n===void 0&&(n={}),n.mode=Ne.ALL,n.from=t,n.to=e,n.callback=i,kl.intersectWorld(this,n)}raycastAny(t,e,n,i){return n===void 0&&(n={}),n.mode=Ne.ANY,n.from=t,n.to=e,n.result=i,kl.intersectWorld(this,n)}raycastClosest(t,e,n,i){return n===void 0&&(n={}),n.mode=Ne.CLOSEST,n.from=t,n.to=e,n.result=i,kl.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof wt&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;const e=this.bodies.length-1,n=this.bodies,i=n.indexOf(t);if(i!==-1){n.splice(i,1);for(let r=0;r!==n.length;r++)n[r].index=r;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){const e=this.bodies;for(let n=0;n<e.length;n++){const i=e[n].shapes;for(let r=0;r<i.length;r++){const o=i[r];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){const e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);const n=Be.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{const i=n-this.lastCallTime;this.step(t,i,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;const i=Be.now();let r=0;for(;this.accumulator>=t&&r<n&&(this.internalStep(t),this.accumulator-=t,r++,!(Be.now()-i>t*1e3)););this.accumulator=this.accumulator%t;const o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;const e=this.contacts,n=WS,i=XS,r=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,h=this.profile,d=wt.DYNAMIC;let u=-1/0;const f=this.constraints,m=VS;l.length();const v=l.x,g=l.y,p=l.z;let x=0;for(c&&(u=Be.now()),x=0;x!==r;x++){const D=o[x];if(D.type===d){const B=D.force,F=D.mass;B.x+=F*v,B.y+=F*g,B.z+=F*p}}for(let D=0,B=this.subsystems.length;D!==B;D++)this.subsystems[D].update();c&&(u=Be.now()),n.length=0,i.length=0,this.broadphase.collisionPairs(this,n,i),c&&(h.broadphase=Be.now()-u);let y=f.length;for(x=0;x!==y;x++){const D=f[x];if(!D.collideConnected)for(let B=n.length-1;B>=0;B-=1)(D.bodyA===n[B]&&D.bodyB===i[B]||D.bodyB===n[B]&&D.bodyA===i[B])&&(n.splice(B,1),i.splice(B,1))}this.collisionMatrixTick(),c&&(u=Be.now());const _=HS,T=e.length;for(x=0;x!==T;x++)_.push(e[x]);e.length=0;const A=this.frictionEquations.length;for(x=0;x!==A;x++)m.push(this.frictionEquations[x]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,i,this,e,_,this.frictionEquations,m),c&&(h.narrowphase=Be.now()-u),c&&(u=Be.now()),x=0;x<this.frictionEquations.length;x++)a.addEquation(this.frictionEquations[x]);const R=e.length;for(let D=0;D!==R;D++){const B=e[D],F=B.bi,U=B.bj,Y=B.si,G=B.sj;let Z;if(F.material&&U.material?Z=this.getContactMaterial(F.material,U.material)||this.defaultContactMaterial:Z=this.defaultContactMaterial,Z.friction,F.material&&U.material&&(F.material.friction>=0&&U.material.friction>=0&&F.material.friction*U.material.friction,F.material.restitution>=0&&U.material.restitution>=0&&(B.restitution=F.material.restitution*U.material.restitution)),a.addEquation(B),F.allowSleep&&F.type===wt.DYNAMIC&&F.sleepState===wt.SLEEPING&&U.sleepState===wt.AWAKE&&U.type!==wt.STATIC){const dt=U.velocity.lengthSquared()+U.angularVelocity.lengthSquared(),pt=U.sleepSpeedLimit**2;dt>=pt*2&&(F.wakeUpAfterNarrowphase=!0)}if(U.allowSleep&&U.type===wt.DYNAMIC&&U.sleepState===wt.SLEEPING&&F.sleepState===wt.AWAKE&&F.type!==wt.STATIC){const dt=F.velocity.lengthSquared()+F.angularVelocity.lengthSquared(),pt=F.sleepSpeedLimit**2;dt>=pt*2&&(U.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(F,U,!0),this.collisionMatrixPrevious.get(F,U)||(Lr.body=U,Lr.contact=B,F.dispatchEvent(Lr),Lr.body=F,U.dispatchEvent(Lr)),this.bodyOverlapKeeper.set(F.id,U.id),this.shapeOverlapKeeper.set(Y.id,G.id)}for(this.emitContactEvents(),c&&(h.makeContactConstraints=Be.now()-u,u=Be.now()),x=0;x!==r;x++){const D=o[x];D.wakeUpAfterNarrowphase&&(D.wakeUp(),D.wakeUpAfterNarrowphase=!1)}for(y=f.length,x=0;x!==y;x++){const D=f[x];D.update();for(let B=0,F=D.equations.length;B!==F;B++){const U=D.equations[B];a.addEquation(U)}}a.solve(t,this),c&&(h.solve=Be.now()-u),a.removeAllEquations();const I=Math.pow;for(x=0;x!==r;x++){const D=o[x];if(D.type&d){const B=I(1-D.linearDamping,t),F=D.velocity;F.scale(B,F);const U=D.angularVelocity;if(U){const Y=I(1-D.angularDamping,t);U.scale(Y,U)}}}this.dispatchEvent(GS),c&&(u=Be.now());const w=this.stepnumber%(this.quatNormalizeSkip+1)===0,P=this.quatNormalizeFast;for(x=0;x!==r;x++)o[x].integrate(t,w,P);this.clearForces(),this.broadphase.dirty=!0,c&&(h.integrate=Be.now()-u),this.stepnumber+=1,this.dispatchEvent(kS);let k=!0;if(this.allowSleep)for(k=!1,x=0;x!==r;x++){const D=o[x];D.sleepTick(this.time),D.sleepState!==wt.SLEEPING&&(k=!0)}this.hasActiveBodies=k}emitContactEvents(){const t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff(di,fi),t){for(let r=0,o=di.length;r<o;r+=2)Ir.bodyA=this.getBodyById(di[r]),Ir.bodyB=this.getBodyById(di[r+1]),this.dispatchEvent(Ir);Ir.bodyA=Ir.bodyB=null}if(e){for(let r=0,o=fi.length;r<o;r+=2)Dr.bodyA=this.getBodyById(fi[r]),Dr.bodyB=this.getBodyById(fi[r+1]),this.dispatchEvent(Dr);Dr.bodyA=Dr.bodyB=null}di.length=fi.length=0;const n=this.hasAnyEventListener("beginShapeContact"),i=this.hasAnyEventListener("endShapeContact");if((n||i)&&this.shapeOverlapKeeper.getDiff(di,fi),n){for(let r=0,o=di.length;r<o;r+=2){const a=this.getShapeById(di[r]),l=this.getShapeById(di[r+1]);pi.shapeA=a,pi.shapeB=l,a&&(pi.bodyA=a.body),l&&(pi.bodyB=l.body),this.dispatchEvent(pi)}pi.bodyA=pi.bodyB=pi.shapeA=pi.shapeB=null}if(i){for(let r=0,o=fi.length;r<o;r+=2){const a=this.getShapeById(fi[r]),l=this.getShapeById(fi[r+1]);mi.shapeA=a,mi.shapeB=l,a&&(mi.bodyA=a.body),l&&(mi.bodyB=l.body),this.dispatchEvent(mi)}mi.bodyA=mi.bodyB=mi.shapeA=mi.shapeB=null}}clearForces(){const t=this.bodies,e=t.length;for(let n=0;n!==e;n++){const i=t[n];i.force,i.torque,i.force.set(0,0,0),i.torque.set(0,0,0)}}}new Sn;const kl=new Ne,Be=globalThis.performance||{};if(!Be.now){let s=Date.now();Be.timing&&Be.timing.navigationStart&&(s=Be.timing.navigationStart),Be.now=()=>Date.now()-s}new S;const kS={type:"postStep"},GS={type:"preStep"},Lr={type:wt.COLLIDE_EVENT_NAME,body:null,contact:null},HS=[],VS=[],WS=[],XS=[],di=[],fi=[],Ir={type:"beginContact",bodyA:null,bodyB:null},Dr={type:"endContact",bodyA:null,bodyB:null},pi={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},mi={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null};function qS(s){const t=s.length,e=[...s.map(i=>new S(i.x,i.y,-1)),...s.map(i=>new S(i.x,i.y,3))],n=[Array.from({length:t},(i,r)=>t-1-r),Array.from({length:t},(i,r)=>t+r)];for(let i=0;i<t;i++){const r=(i+1)%t;n.push([i,r,t+r,t+i])}return new er({vertices:e,faces:n})}function YS(s,t,e=0){for(let n=0;n<t.length;n++){const i=t[n],r=t[(n+1)%t.length],o=r.x-i.x,a=r.y-i.y;if(o*(s.y-i.y)-a*(s.x-i.x)<-e*Math.hypot(o,a))return!1}return!0}function $S(s,t,e,n=0){let i=0,r=1;for(let o=0;o<e.length;o++){const a=e[o],l=e[(o+1)%e.length],c=l.x-a.x,h=l.y-a.y,d=c*(s.y-a.y)-h*(s.x-a.x)+n*Math.hypot(c,h),u=c*(t.y-s.y)-h*(t.x-s.x);if(Math.abs(u)<1e-10){if(d<0)return null}else{const f=-d/u;if(u>0?i=Math.max(i,f):r=Math.min(r,f),i>r)return null}}return i}const xo={amplitude:2.8,period:12,halfWidth:2.2};function Kr(s,t=xo){return t.amplitude*Math.sin(Math.PI*s/t.period)}function Mf(s,t=xo){let e=Math.max(-16,Math.min(16,s.x));for(let l=0;l<10;l++){const c=Math.PI/t.period,h=Kr(e,t),d=t.amplitude*c*Math.cos(c*e),u=-t.amplitude*c*c*Math.sin(c*e);e=Math.max(-16,Math.min(16,e-(e-s.x+(h-s.y)*d)/Math.max(.25,1+d*d+(h-s.y)*u)))}const n=Kr(e,t),i=t.amplitude*Math.PI/t.period*Math.cos(Math.PI*e/t.period),r=Math.hypot(1,i),o=-i/r,a=1/r;return{x:e,y:n,nx:o,ny:a,tx:1/r,ty:i/r,distance:(s.x-e)*o+(s.y-n)*a}}function jS(s,t,e=xo,n=.31){const i=Mf(s,e),r=e.halfWidth-n;if(Math.abs(i.distance)<=r)return!1;const o=Math.sign(i.distance);s.x=i.x+i.nx*o*r,s.y=i.y+i.ny*o*r;const a=(t.x*i.nx+t.y*i.ny)*o;return a>0&&(t.x-=i.nx*o*a,t.y-=i.ny*o*a),!0}function Sf(s=xo){const t=[],e=[];for(let n=0;n<=160;n++){const i=-17+n*34/160,r=Kr(i,s),o=s.amplitude*Math.PI/s.period*Math.cos(Math.PI*i/s.period),a=Math.hypot(1,o);t.push({x:i-o/a*s.halfWidth,y:r+s.halfWidth/a}),e.push({x:i+o/a*s.halfWidth,y:r-s.halfWidth/a})}return[[...t,{x:18,y:10},{x:-18,y:10}],[{x:-18,y:-10},{x:18,y:-10},...e.reverse()]]}const Ke=1/120,qi=.75;function Jr(s,t){return Math.max(0,s.createdAt+s.lifetime-t)}function wf(s,t,e="fade"){const n=Jr(s,t);return n<=0?0:e==="snap"?1:Math.min(1,n/(s.lifetime*.2))}function Va(s,t,e,n="fade"){let i=0,r=0;for(const o of t){const a=wf(o,e,n);if(a===0)continue;const l=o.x-s.x,c=o.y-s.y,h=l*l+c*c+qi*qi,d=o.strength*a/(h*Math.sqrt(h));i+=l*d,r+=c*d}return{x:i,y:r}}function ZS(s,t,e,n=Ke,i="fade"){const r=Va(s,t,e,i),o=s.vx+r.x*n,a=s.vy+r.y*n;return{x:s.x+o*n,y:s.y+a*n,vx:o,vy:a}}function KS(s,t,e,n=5,i="fade",r=8){const o=[{x:s.x,y:s.y}];let a={...s};const l=Math.ceil(n/Ke);for(let c=0;c<l;c++)a=ZS(a,t,e+c*Ke,Ke,i),(c+1)%r===0&&o.push({x:a.x,y:a.y});return o}function JS(s,t){return[...s,t].slice(-2)}const In=.31,Ef=10,Nn={bounds:{minX:-16,maxX:16,minY:-9,maxY:9},spawn:{x:-10,y:-5,vx:0,vy:2.5},goal:{x:10,y:-5,radius:1},walls:[{x:-16.25,y:0,w:.5,h:18.5},{x:16.25,y:0,w:.5,h:18.5},{x:0,y:9.25,w:32.5,h:.5},{x:0,y:-9.25,w:32.5,h:.5},{x:-4,y:-3.5,w:.55,h:11},{x:4,y:3.5,w:.55,h:11}],spikes:[{x:-4.8,y:-6.7,w:.55,h:.8},{x:3.2,y:6.7,w:.55,h:.8}]};function Fc(s,t,e){const n=Math.max(Math.abs(s.x-e.x)-e.w/2,0),i=Math.max(Math.abs(s.y-e.y)-e.h/2,0);return n*n+i*i<=t*t}function oh(s,t,e,n){const i=n.x-n.w/2-e,r=n.x+n.w/2+e,o=n.y-n.h/2-e,a=n.y+n.h/2+e;let l=0,c=1;for(const[h,d,u,f]of[[s.x,t.x-s.x,i,r],[s.y,t.y-s.y,o,a]])if(Math.abs(d)<1e-9){if(h<u||h>f)return null}else{const m=(u-h)/d,v=(f-h)/d;if(l=Math.max(l,Math.min(m,v)),c=Math.min(c,Math.max(m,v)),l>c)return null}return l}function QS(s,t,e=Nn.goal){const n=t.x-s.x,i=t.y-s.y,r=e.radius+In,o=n*n+i*i;if(o<1e-12)return Math.hypot(s.x-e.x,s.y-e.y)<=r?0:null;const a=2*((s.x-e.x)*n+(s.y-e.y)*i),l=(s.x-e.x)**2+(s.y-e.y)**2-r**2;if(l<=0)return 0;const c=a*a-4*o*l;if(c<0)return null;const h=(-a-Math.sqrt(c))/(2*o);return h>=0&&h<=1?h:null}function bf(s,t,e=Nn){let n=null;for(const[r,o]of[["spike",e.spikes],["wall",e.walls]])for(const a of o){const l=oh(s,t,In,a);l!==null&&(!n||l<n.t)&&(n={type:r,t:l,x:s.x+(t.x-s.x)*l,y:s.y+(t.y-s.y)*l})}for(const r of e.guides||[]){const o=$S(s,t,r,In);o!==null&&(!n||o<n.t)&&(n={type:"wall",t:o,x:s.x+(t.x-s.x)*o,y:s.y+(t.y-s.y)*o})}e.channel&&Math.abs(Mf(t,e.channel).distance)>e.channel.halfWidth-In&&(n=n||{type:"wall",t:1,x:t.x,y:t.y});const i=QS(s,t,e.goal);return i!==null&&(!n||i<n.t)&&(n={type:"goal",t:i,x:s.x+(t.x-s.x)*i,y:s.y+(t.y-s.y)*i}),n}function ah(s,t=Nn){return s.x<t.bounds.minX+.75||s.x>t.bounds.maxX-.75||s.y<t.bounds.minY+.75||s.y>t.bounds.maxY-.75||(t.guides||[]).some(e=>YS(s,e,.47))||t.walls.some(e=>Fc(s,.47,e))||t.spikes.some(e=>Fc(s,.47,e))?!1:Math.hypot(s.x-t.goal.x,s.y-t.goal.y)>t.goal.radius+.35}function lh(s,t=Ef){const e=Math.hypot(s.x,s.y);return e>t&&(s.x*=t/e,s.y*=t/e),s}function tw(s,t=Nn){let e=0,n=0;const i=4;for(const r of t.spikes){const o=r.x-s.x,a=r.y-s.y,l=Math.hypot(o,a);if(l>=i)continue;const c=l*l+qi*qi,h=(1-(l/i)**2)**2,d=(r.strength??3)*h/(c*Math.sqrt(c));e+=o*d,n+=a*d}return{x:e,y:n}}function ch(s,t,e,n="fade",i=Nn){const r=Va(s,t,e,n),o=tw(s,i),a=ew(s,i);return{x:r.x+o.x+a.x,y:r.y+o.y+a.y}}function ew(s,t=Nn){const e=t.goal.x-s.x,n=t.goal.y-s.y,i=e*e+n*n+qi*qi,r=5/(i*Math.sqrt(i));return{x:e*r,y:n*r}}function nw(s,t,e,n=3,i="fade",r=Nn){const o=[{x:s.x,y:s.y}];let a={...s};const l=Math.ceil(n/Ke);for(let c=0;c<l;c++){const h=ch(a,t,e+c*Ke,i,r),d=a.vx+h.x*Ke,u=a.vy+h.y*Ke,f={x:a.x+d*Ke,y:a.y+u*Ke,vx:d,vy:u},m=lh({x:f.vx,y:f.vy});f.vx=m.x,f.vy=m.y;const v=bf(a,f,r);if(v)return o.push({x:v.x,y:v.y}),{points:o,impact:v.type};a=f,(c+1)%5===0&&o.push({x:a.x,y:a.y})}return o.push({x:a.x,y:a.y}),{points:o,impact:null}}const hh=new Set(["filters","lens","prism"]),iw=[16727606,16747570,16768852,6876793,4509157,6651135,12677631];function sw(s,t,e=0){const n=Math.atan2(t.y-s.y,t.x-s.x)+e;return{x:Math.cos(n),y:Math.sin(n)}}function rw(s,t,e){return e.some(n=>oh(s,t,0,n)!==null)}const ow="varying vec2 world; void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xy;gl_Position=projectionMatrix*viewMatrix*p;}",aw=`varying vec2 world; uniform vec2 origin; uniform vec2 direction; uniform vec3 tint; uniform float strength; uniform float aligned; uniform float aperture; uniform float focus; uniform float spread; uniform vec4 walls[32]; uniform int wallCount;
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
 float fade=pow(1.-x/19.,1.2);float concentration=focus>0.?min(2.5,1.5/max(width,.4)):1.;gl_FragColor=vec4(tint,edge*fade*strength*concentration);}`;class lw{constructor(t){this.group=new Ie,t.add(this.group),this.beams=[],this.devices=[]}clear(){for(const t of[...this.group.children])t.traverse(e=>{var n,i;(n=e.geometry)==null||n.dispose(),(i=e.material)==null||i.dispose()}),this.group.remove(t);this.beams=[],this.devices=[]}beam(t,e,n,i=0,r=.12,o=0){const a=Array.from({length:32},(h,d)=>{const u=this.level.walls[d];return new ue((u==null?void 0:u.x)||0,(u==null?void 0:u.y)||0,(u==null?void 0:u.w)||0,(u==null?void 0:u.h)||0)}),l=new Dn({uniforms:{origin:{value:new ht(t.x,t.y)},direction:{value:new ht(1,0)},tint:{value:new te(e)},strength:{value:0},aligned:{value:this.kind==="prism"?0:1},aperture:{value:n},focus:{value:i},spread:{value:r},walls:{value:a},wallCount:{value:Math.min(32,this.level.walls.length)}},vertexShader:ow,fragmentShader:aw,transparent:!0,depthWrite:!1,blending:_n}),c=new me(new Xi(32,18),l);c.position.z=-.84,this.group.add(c),this.beams.push({device:t,material:l,turn:o})}device(t,e,n,i,r=4){const o={x:t,y:e,height:r};this.devices.push(o);const a=new me(new ws(.08,r,4),new Ye({colorWrite:!1,depthWrite:!1}));a.position.set(t,e,1),a.castShadow=!0,this.group.add(a);let l;if(i==="prism"){const d=new lr;d.moveTo(-.8,-1.6),d.lineTo(.95,0),d.lineTo(-.8,1.6),d.closePath(),l=new Ra(d)}else if(i==="lens"){const d=new lr;d.moveTo(0,-2),d.quadraticCurveTo(1,0,0,2),d.quadraticCurveTo(-1,0,0,-2),l=new Ra(d,32)}else l=new Xi(.18,r);const c=new me(l,new Ye({color:n,transparent:!0,opacity:.3,depthWrite:!1,side:Cn}));c.position.set(t,e,1.6),this.group.add(c);const h=new Xm(new Ym(l),new vn({color:n,transparent:!0,opacity:.85}));return h.position.copy(c.position),this.group.add(h),o}reset(t){if(this.clear(),this.kind=t.mechanic,this.level=t.level,this.kind==="filters")for(const[e,n]of[16735110,7536556,7841279].entries()){const i=this.device(0,(e-1)*4,n,"filter",2.6);this.beam(i,n,1.3,0,.16)}if(this.kind==="lens"){const e=this.device(0,0,12119551,"lens");this.beam(e,14940415,1.9,5)}if(this.kind==="prism"){const e=this.device(0,0,15263999,"prism",3.2);iw.forEach((n,i)=>this.beam(e,n,.12,0,.045,(i-3)*.085+.18))}}update(t,e=1){if(hh.has(this.kind))for(const n of this.beams){const i=Math.hypot(t.x-n.device.x,t.y-n.device.y),r=sw(t,n.device,n.turn);n.material.uniforms.direction.value.set(r.x,r.y);const o=this.kind==="prism"?1:dm.smoothstep(Math.abs(r.x),.08,.35);n.material.uniforms.strength.value=i<.8?0:Math.min(.85,5*e/(2+i))*o*(rw(t,n.device,this.level.walls)?0:1)}}}const cw=[["release","Release the pull","Remove the oldest well","Catch a curve, then tap Remove well to fly along its tangent.","Where does letting go send you?"],["boost","A directed impulse","Slingshot gate","Cross the cyan ring for a fast launch to the right.","Can one impulse replace a long pull?"],["sticky","A moment of stillness","Capture and release","The amber spot catches you. Tap Release to leave in your incoming direction.","What changes when you can wait?"],["eclipse","The disappearing light","Eclipse","The dark body catches you and slowly covers your light. Release when ready.","Can sound carry you through darkness?"],["power","Gathering light","Light pickup","Begin dim. Collect the three pale lights to brighten your glow.","Does a brighter world change your route?"],["dimmer","Losing light","Light drain","Pass through the three violet motes to dim your glow.","How little light can you navigate by?"],["guide","Follow the bend","Guiding walls","Place wells beyond the black walls. Their pull guides the dot through the S-channel.","Can a wall become a track?"],["giant","A heavy neighbor","Large danger body","The orange body pulls gently. Its visible surface is fatal.","How close is a useful pass?"],["chaser","Something follows","Pursuit","A small orange body follows slowly. Draw it away with your wells.","Can a detour become an escape?"],["clock","Wait for an opening","Fixed danger orbit","Orange bodies follow a fixed orbit, unaffected by your wells.","When is the passage safe?"],["sound","Crossing the gates","Sound gates","Cross cyan for bass, violet for offbeat, and gold for chimes. Each adds a repeating part.","Can your route become an instrument?"],["hidden","Light reveals danger","Hidden body","A dark body behind the wall appears near your light. It vanishes completely outside direct light.","What can you discover before you touch it?"],["portals","Elsewhere, still moving","Paired portals","The two teal rings connect. Speed is preserved; the exit turns your flight upward.","Can you steer through a change of space?"],["shadow-posts","A forest of shadows","Moving light and posts","Thread the posts and watch their shadows sweep across one another.","What can a moving shadow reveal?"],["filters","Through colored glass","Color transmission","Move around the colored panes. Light passing through them changes color.","Can a surface paint the space beyond it?"],["lens","Gathering rays","A focusing lens","Move the light around the lens. Follow the beam into its focus and out again.","Where does light become concentrated?"],["prism","A spectrum unfolds","A dispersing prism","Move the light around the prism to turn a pale beam into a rainbow fan.","Can color describe the direction of light?"]];function hw(s){return cw.map(([t,e,n,i,r],o)=>({id:t,title:`${String(o+7).padStart(2,"0")} / ${e}`,rule:n,description:i,question:r,objective:i,color:["#76e9e3","#ffd98b","#bfa5ff"][o%3],heroGravity:0,moons:[],mechanic:t,level:{...s(t==="guide"?{x:-13,y:Kr(-13),vx:2.5,vy:0}:{x:-11,y:0,vx:2.5,vy:0},t==="guide"?{x:13,y:Kr(13)}:{x:12,y:5},t==="shadow-posts"?Array.from({length:15},(a,l)=>({x:-5+l%5*2.5,y:-4+Math.floor(l/5)*4+l%2*.6,w:.38,h:1.1})):t==="hidden"?[{x:-3,y:-3,w:.55,h:8}]:[]),channel:t==="guide"?{...xo}:null,guides:[]}}))}function uw(s,t){return{x:s.x*Math.cos(t)-s.y*Math.sin(t),y:s.x*Math.sin(t)+s.y*Math.cos(t)}}function Wa(s,t,e){const n=t.x-s.x,i=t.y-s.y,r=Math.max(0,Math.min(1,((e.x-s.x)*n+(e.y-s.y)*i)/(n*n+i*i||1)));return Math.hypot(s.x+r*n-e.x,s.y+r*i-e.y)}class dw{constructor(t,e){this.scene=t,this.audio=e,this.group=new Ie,t.add(this.group),this.items=[]}clear(){for(const t of[...this.group.children])this.group.remove(t),t.traverse(e=>{var n,i;(n=e.geometry)==null||n.dispose(),(i=e.material)==null||i.dispose()});this.items=[],this.held=null,this.cooldown=0,this.brightness=1,this.layers=new Set,this.beat=-1,this.time=0}marker(t,e,n,i,r=!1){const o=new Ye({color:i,transparent:!0,opacity:r?1:.8}),a=new me(r?new Wi(n,48):new Ba(n-.035,n+.035,64),o);return a.position.set(t,e,1.4),this.group.add(a),a}reset(t){this.clear(),this.kind=t.mechanic,this.walls=t.level.walls;const e=(n,i,r,o,a=!1)=>{const l=["power","dimmer","giant","chaser","clock","portals"].includes(this.kind),c=l?uf(["power","dimmer"].includes(this.kind)?.22:r,o,this.kind==="portals"):this.marker(n,i,r,o,a);l&&(c.position.set(n,i,1.4),this.group.add(c));const h={x:n,y:i,r,mesh:c};return this.items.push(h),h};if(["boost","sticky","eclipse"].includes(this.kind)&&e(-3,0,this.kind==="eclipse"?.45:.85,this.kind==="eclipse"?1250339:this.kind==="boost"?7793123:16767371,this.kind==="eclipse"),["power","dimmer","sound"].includes(this.kind))for(let n=0;n<3;n++)e(-5+n*5,0,.65,this.kind==="power"?14680057:this.kind==="dimmer"?12559871:[7793123,12559871,16767371][n]);if(this.kind==="power"&&(this.brightness=.24),this.kind==="giant"){const n=t.giant||{x:0,y:0,radius:1.6,strength:22},i=e(n.x,n.y,n.radius,16747058,!0);i.strength=n.strength}if(this.kind==="chaser"&&e(-6,-4,.3,16747058,!0),this.kind==="clock")for(let n=0;n<3;n++){const i=e(0,0,.35,16747058,!0);i.phase=n*Math.PI*2/3}if(this.kind==="clock"&&this.marker(0,0,3.5,6376765),this.kind==="hidden"){const n=e(0,-2,1,9923428,!0);n.mesh.visible=!1}this.kind==="portals"&&(e(-3,0,1,7793123),e(6,-3,1,7793123),this.marker(6,-1.6,.12,7793123,!0)),this.kind==="boost"&&(this.marker(-2.8,0,.13,7793123,!0),this.marker(-2.5,0,.09,7793123,!0))}updateVisuals(t,e,n=1,i=1){var r,o;for(const a of this.items){if((o=(r=a.mesh.userData).animate)==null||o.call(r,e,i),this.kind==="hidden"){const l=Math.hypot(t.x-a.x,t.y-a.y),c=this.walls.some(u=>oh(t,a,0,u)!==null),h=Math.max(0,1-(l/50)**4)**2,d=85*Math.max(0,n)*h/(1+l*l);a.mesh.visible=d>.15&&!c,a.mesh.material.opacity=Math.min(1,Math.max(.35,d*.6))}this.kind==="sound"&&a.used&&a.mesh.scale.setScalar(1+.12*Math.exp(-(e*4%1)*4))}}release(t){if(!this.held)return;const{vx:e,vy:n}=this.held;t.velocity.set(e,n,0),this.held=null,this.cooldown=this.time+.8,this.brightness=1,this.audio.tone(440,0,.4,.08)}step(t,e,n,i,r,o){var c,h,d,u;if(this.time=n,this.held){t.position.set(this.held.x,this.held.y,0),t.velocity.setZero(),t.force.setZero(),this.kind==="eclipse"&&(this.brightness=Math.max(.025,1-(n-this.held.at)/3));return}const a=t.position;for(let f=0;f<this.items.length;f++){const m=this.items[f];if(m.used)continue;if(this.kind==="clock"&&f<3&&(m.x=Math.cos(n*.65+m.phase)*3.5,m.y=Math.sin(n*.65+m.phase)*3.5),this.kind==="chaser"){const g=a.x-m.x,p=a.y-m.y,x=Math.hypot(g,p)||1,y=Va(m,i,n,r);m.vx=(m.vx||0)+(g/x*.55+y.x*.3)/120,m.vy=(m.vy||0)+(p/x*.55+y.y*.3)/120;const _=Math.hypot(m.vx,m.vy);_>1.7&&(m.vx*=1.7/_,m.vy*=1.7/_),m.x+=m.vx/120,m.y+=m.vy/120,m.x=Math.max(-14,Math.min(14,m.x)),m.y=Math.max(-7,Math.min(7,m.y))}if(m.mesh.position.set(m.x,m.y,1.4),this.kind==="giant"){const g=m.x-a.x,p=m.y-a.y,x=g*g+p*p+2;t.velocity.x+=g*m.strength/Math.pow(x,1.5)/120,t.velocity.y+=p*m.strength/Math.pow(x,1.5)/120}const v=Wa(e,a,m)<m.r+In;if(["giant","chaser","hidden"].includes(this.kind)||this.kind==="clock"&&f<3){if(v){o("hazard");return}continue}if(!(!v||n<this.cooldown)){if(["sticky","eclipse"].includes(this.kind)){this.held={x:m.x,y:m.y,vx:t.velocity.x,vy:t.velocity.y,at:n},t.position.set(m.x,m.y,0),t.velocity.setZero(),this.audio.tone(196,0,.8,.08);return}if(this.kind==="boost"&&(t.velocity.set(15,0,0),this.cooldown=n+1,this.audio.tone(660,0,.35,.08)),["power","dimmer"].includes(this.kind)&&(m.used=!0,m.mesh.visible=!1,this.brightness=Math.max(.15,Math.min(1.5,this.brightness+(this.kind==="power"?.4:-.28))),this.audio.tone(this.kind==="power"?523:196,0,.5,.08)),this.kind==="sound"&&(m.used=!0,m.mesh.material.color.setHex(16777215),this.layers.add(f),(h=(c=this.audio).gateAcquire)==null||h.call(c,f)),this.kind==="portals"){const g=this.items[1-f],p=f===0?Math.PI/2:-Math.PI/2,x=uw({x:t.velocity.x,y:t.velocity.y},p),y=Math.hypot(x.x,x.y)||1;return t.position.set(g.x+x.x/y*1.4,g.y+x.y/y*1.4,0),t.velocity.set(x.x,x.y,0),this.cooldown=n+.8,this.audio.tone(330,0,.6,.08),"teleport"}}}const l=Math.floor(n*4);if(l!==this.beat){this.beat=l;for(const f of this.layers)(u=(d=this.audio).gateBeat)==null||u.call(d,f,l)}}}const Nr=new N;function Tn(s,t,e,n,i,r){const o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;Nr.copy(t),Nr[n]=0,Nr.normalize();const c=.5*o/(o+a),h=1-Nr.angleTo(s)/l;return Math.sign(Nr[e])===1?h*c:a/(o+a)+c+c*(1-h)}class uh extends ws{constructor(t=1,e=1,n=1,i=2,r=.1){const o=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},o===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const l=new N,c=new N,h=new N(t,e,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,f=this.attributes.uv.array,m=d.length/6,v=new N,g=.5/o;for(let p=0,x=0;p<d.length;p+=3,x+=2)switch(l.fromArray(d,p),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),d[p+0]=h.x*Math.sign(l.x)+c.x*r,d[p+1]=h.y*Math.sign(l.y)+c.y*r,d[p+2]=h.z*Math.sign(l.z)+c.z*r,u[p+0]=c.x,u[p+1]=c.y,u[p+2]=c.z,Math.floor(p/m)){case 0:v.set(1,0,0),f[x+0]=Tn(v,c,"z","y",r,n),f[x+1]=1-Tn(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),f[x+0]=1-Tn(v,c,"z","y",r,n),f[x+1]=1-Tn(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),f[x+0]=1-Tn(v,c,"x","z",r,t),f[x+1]=Tn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),f[x+0]=1-Tn(v,c,"x","z",r,t),f[x+1]=1-Tn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),f[x+0]=1-Tn(v,c,"x","y",r,t),f[x+1]=1-Tn(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),f[x+0]=Tn(v,c,"x","y",r,t),f[x+1]=1-Tn(v,c,"y","x",r,e);break}}static fromJSON(t){return new uh(t.width,t.height,t.depth,t.segments,t.radius)}}class fw{constructor(){this.enabled=!0,this.step=0}unlock(){if(!this.enabled)return;const t=window.AudioContext||window.webkitAudioContext;if(t){if(!this.context){const e=this.context=new t;this.master=e.createGain(),this.master.gain.value=.32;const n=e.createDynamicsCompressor();this.master.connect(n),n.connect(e.destination),this.heartbeatBus=e.createGain(),this.heartbeatBus.gain.value=1,this.heartbeatBus.connect(this.master),this.tail=e.createOscillator(),this.tail.type="triangle",this.tailGain=e.createGain(),this.tailGain.gain.value=0,this.tail.connect(this.tailGain),this.tailGain.connect(this.master),this.tail.start(),this.humGain=e.createGain(),this.humGain.gain.value=0,this.humGain.connect(this.master),this.hum=e.createOscillator(),this.hum.type="triangle",this.hum.frequency.value=196,this.hum.connect(this.humGain),this.hum.start(),this.humOvertone=e.createOscillator(),this.humOvertone.frequency.value=392.35;const i=e.createGain();i.gain.value=.3,this.humOvertone.connect(i),i.connect(this.humGain),this.humOvertone.start();const r=e.createBuffer(1,e.sampleRate*2,e.sampleRate),o=r.getChannelData(0);for(let l=0;l<o.length;l++)o[l]=Math.random()*2-1;this.noiseBuffer=r,this.air=e.createBufferSource(),this.air.buffer=r,this.air.loop=!0;const a=e.createBiquadFilter();a.type="bandpass",a.frequency.value=1600,a.Q.value=.8,this.airGain=e.createGain(),this.airGain.gain.value=0,this.air.connect(a),a.connect(this.airGain),this.airGain.connect(this.master),this.air.start()}this.context.state==="suspended"&&this.context.resume().catch(()=>{})}}setEnabled(t){this.enabled=t,t&&this.unlock(),this.context&&this.master.gain.setTargetAtTime(t?.32:0,this.context.currentTime,.04)}tone(t,e=0,n=1.4,i=.16,r=t){if(!this.enabled||!this.context)return;const o=this.context,a=o.currentTime+e,l=o.createOscillator(),c=o.createGain();l.type="sine",l.frequency.setValueAtTime(t,a),l.frequency.exponentialRampToValueAtTime(Math.max(20,r),a+n),c.gain.setValueAtTime(0,a),c.gain.linearRampToValueAtTime(i,a+.025),c.gain.exponentialRampToValueAtTime(1e-4,a+n),l.connect(c),c.connect(this.master),l.start(a),l.stop(a+n+.05),l.onended=()=>{l.disconnect(),c.disconnect()}}placement(){this.unlock();const t=[293.665,440,329.628,523.251,391.995],e=t[this.step++%t.length];this.tone(e,0,1.9,.19),this.tone(e*2,.08,1.3,.045),this.tone(e,.32,1.5,.045)}trail(t,e,n){if(!this.context)return;const i=this.context.currentTime,r=Math.exp(-Math.max(0,n)/10),o=t&&this.enabled;this.tailGain.gain.setTargetAtTime(o?Math.min(.11,.035+e*.009)*r*.55:0,i,.16),this.airGain.gain.setTargetAtTime(o?Math.min(.13,e*.018)*r*.12:0,i,.2),this.tail.frequency.setTargetAtTime(260+Math.min(e,15)*16,i,.3)}orb(t,e,n=1){const i=.5+.5*Math.sin(e*Math.PI*2*.65);if(this.context){const r=Math.max(.08,Math.min(1.5,n));this.humGain.gain.setTargetAtTime(t&&this.enabled?(.04+i*.085)*r:0,this.context.currentTime,.08);const o=196*Math.pow(2,(Math.max(.15,n)-1)*.22);this.hum.frequency.setTargetAtTime(o,this.context.currentTime,.2),this.humOvertone.frequency.setTargetAtTime(o*2+.35,this.context.currentTime,.2)}return i}gateAcquire(t){const e=[130.81,392,783.99][t];this.tone(e,0,.3,.25),this.tone(e*1.5,.13,.4,.15),t===0&&(this.tone(261.63,0,.35,.18),this.tone(392,.08,.22,.06))}gateBeat(t,e){t===0&&e%4===0&&(this.tone(130.81,0,.22,.28,65.405),this.tone(261.63,0,.18,.085),this.tone(392,0,.11,.035)),t===1&&e%4===2&&this.tone(392,0,.18,.2),t===2&&e%2===1&&this.tone(e%4===1?783.99:587.33,0,.12,.14)}heartbeat(t,e=0){if(!this.enabled||!this.context)return;const n=this.context,i=n.currentTime,r=t==="lub"?90:115,o=t==="lub"?55:70,a=t==="lub"?.17:.13,l=n.createGain(),c=n.createOscillator(),h=n.createOscillator(),d=n.createGain();this.heartbeatBus.gain.setTargetAtTime(1,i,.005),c.type="triangle",c.frequency.setValueAtTime(r,i),c.frequency.exponentialRampToValueAtTime(o,i+a),h.type="sine",h.frequency.setValueAtTime(r*2,i),h.frequency.exponentialRampToValueAtTime(o*2,i+a),d.gain.value=.22,l.gain.setValueAtTime(0,i),l.gain.linearRampToValueAtTime(.22+Math.max(0,Math.min(1,e))*.09,i+.018),l.gain.exponentialRampToValueAtTime(1e-4,i+a),c.connect(l),h.connect(d),d.connect(l),l.connect(this.heartbeatBus),c.start(i),h.start(i),c.stop(i+a+.01),h.stop(i+a+.01),c.onended=()=>{c.disconnect(),h.disconnect(),d.disconnect(),l.disconnect()}}stopHeartbeat(){this.context&&this.heartbeatBus&&this.heartbeatBus.gain.setTargetAtTime(0,this.context.currentTime,.015)}noise(t,e,n){if(!this.enabled||!this.context)return;const i=this.context,r=i.currentTime,o=i.createBufferSource(),a=i.createBiquadFilter(),l=i.createGain();o.buffer=this.noiseBuffer,a.type="lowpass",a.frequency.setValueAtTime(e,r),a.frequency.exponentialRampToValueAtTime(80,r+t),l.gain.setValueAtTime(n,r),l.gain.exponentialRampToValueAtTime(1e-4,r+t),o.connect(a),a.connect(l),l.connect(this.master),o.start(),o.stop(r+t),o.onended=()=>{o.disconnect(),a.disconnect(),l.disconnect()}}death(){this.noise(.45,1800,.17),this.tone(150,0,.4,.17,42)}portal(){[261.626,329.628,391.995,523.251].forEach((t,e)=>this.tone(t,e*.11,2.6,.1)),this.noise(.8,4200,.035)}reset(){this.step=0,this.stopHeartbeat(),this.trail(!1,0,0),this.orb(!1,0)}}function pw(s,t,e,n,i,r,o){const a=s.getContext("2d"),l=s.width,c=s.height;a.fillStyle="#050e18",a.fillRect(0,0,l,c);const h=48,d=Math.min((l-h*2)/(i.maxX-i.minX),(c-h*2)/(i.maxY-i.minY)),u=(i.maxX-i.minX)*d,f=(i.maxY-i.minY)*d,m=(l-u)/2,v=(c-f)/2,g=(i.minX+e)/(e*2)*t.width,p=(n-i.maxY)/(n*2)*t.height,x=(i.maxX-i.minX)/(e*2)*t.width,y=(i.maxY-i.minY)/(n*2)*t.height;a.save(),a.globalCompositeOperation="lighter",a.filter="blur(3px)";for(let R=0;R<4;R++)a.drawImage(t,g,p,x,y,m,v,u,f);a.filter="none";for(let R=0;R<7;R++)a.drawImage(t,g,p,x,y,m,v,u,f);a.restore();const _=R=>({x:m+(R.x-i.minX)*d,y:v+(i.maxY-R.y)*d}),T=_(r),A=_(o);a.shadowBlur=16,a.shadowColor="#7cffee",a.fillStyle="#dcfff6",a.beginPath(),a.arc(T.x,T.y,3,0,Math.PI*2),a.fill(),a.shadowColor="#b78aff",a.strokeStyle="#b78aff",a.lineWidth=2,a.beginPath(),a.arc(A.x,A.y,7,0,Math.PI*2),a.stroke(),a.shadowBlur=0}const La=70,mw=Nn.walls.slice(0,4),gw=s=>{const t=s.maxX-s.minX,e=s.maxY-s.minY,n=(s.minX+s.maxX)/2,i=(s.minY+s.maxY)/2;return[{x:s.minX-.25,y:i,w:.5,h:e+.5},{x:s.maxX+.25,y:i,w:.5,h:e+.5},{x:n,y:s.maxY+.25,w:t+.5,h:.5},{x:n,y:s.minY-.25,w:t+.5,h:.5}]},fs=(s,t,e=[],n=[],i=Nn.bounds)=>({bounds:{...i},spawn:s,goal:{radius:1,...t},walls:[...(i===Nn.bounds?mw:gw(i)).map(r=>({...r})),...e],spikes:n}),Gi=[{id:"drift",title:"01 / A gentle curve",rule:"Temporary gravity",color:"#76e9e3",description:"An open room. Place a well beside your path, then let its pull fade.",question:"How little force is enough to steer?",objective:"Bend your flight toward the portal.",level:fs({x:-11,y:-3,vx:2.5,vy:0},{x:11,y:3}),heroGravity:0,moons:[]},{id:"satellites",title:"02 / A little gravity",rule:"The dot attracts matter",color:"#bfa5ff",description:"Three loose moons respond to the dot and your wells. Attraction pulls both ways.",question:"Does carrying a little world change the flight?",objective:"Gather or scatter the pale moons. The portal is optional.",level:fs({x:-5,y:0,vx:1.3,vy:0},{x:12,y:0}),heroGravity:12,moons:[{x:-3.2,y:0,vx:1.3,vy:2},{x:-5,y:2.5,vx:-.7,vy:0},{x:-7.8,y:0,vx:1.3,vy:-1.7}]},{id:"slingshot",title:"03 / Close to the flame",rule:"Risk and redirection",color:"#ffae69",description:"A stronger ember bends nearby trajectories. Its bright center is still fatal.",question:"Can a hazard also become a useful tool?",objective:"Arc around the ember and over the black barrier.",level:fs({x:-11,y:-3,vx:2.6,vy:1.2},{x:11,y:3},[{x:4,y:-4.2,w:.55,h:9.6}],[{x:-1,y:0,w:.55,h:.8,strength:18}]),heroGravity:0,moons:[]},{id:"gate",title:"04 / Bring a moon",rule:"Matter opens a passage",color:"#ffd98b",description:"Draw the gold moon into the gold ring. The gate latches open when the moon arrives.",question:"Could gravity replace a key or a button?",objective:"Bring the moon to the gold ring, then reach the portal.",level:fs({x:-11,y:-3,vx:1,vy:.8},{x:11,y:0},[{x:0,y:0,w:.55,h:18,gate:!0}]),heroGravity:12,moons:[{x:-7,y:1.5,vx:0,vy:0}],plate:{x:-5,y:3,radius:1.2}},{id:"maze",title:"05 / The winding room",rule:"Level-design reference",color:"#89bfd4",description:"The original winding maze, with soft wells, orange hazards, and a purple exit.",question:"Which turns feel expressive, and which feel fiddly?",objective:"Find your way around the two barriers.",level:Nn,heroGravity:0,moons:[]},{id:"orbit",title:"06 / An orbital sketch",rule:"Catch, orbit, release",color:"#92c9ff",description:"Begin in a circular orbit. Add another well or let the first one dissolve.",question:"Where does an orbit become a drawing?",objective:"Let the wells leave a pattern.",sandbox:!0,level:Nn,heroGravity:0,moons:[]}];Gi.push(...hw(fs));Gi.push({id:"burnout",title:`${String(Gi.length+1).padStart(2,"0")} / The burning light`,rule:"Light as fuel",color:"#ffd98b",description:"Your glow slowly burns away. Gather wandering embers to refill it and keep the gate open.",question:"Can light become a resource you route around?",objective:"Gather pale embers to keep the gate open, then reach the portal.",mechanic:"burnout",heroGravity:0,moons:[],level:fs({x:-11,y:-3,vx:.9,vy:.2},{x:11,y:3},[{x:5,y:0,w:.55,h:18,gate:!0}])},{id:"wideworld",title:`${String(Gi.length+2).padStart(2,"0")} / A wider world`,rule:"Scale and space",color:"#a8c9ff",description:"A broad chamber with long open stretches and a larger portal. The same gravity rules feel different across distance.",question:"How does room to roam change your aim?",objective:"Cross the great chamber and enter the far portal.",heroGravity:0,moons:[],level:fs({x:-42,y:-18,vx:2.5,vy:.8},{x:42,y:18,radius:2},[{x:-23,y:-12,w:.8,h:16},{x:-2,y:13,w:.8,h:18},{x:20,y:-11,w:.8,h:19}],[],{minX:-48,maxX:48,minY:-27,maxY:27})});function Tf(s){return Gi.find(t=>t.id===s)||Gi[0]}function vw(s,t,e){const n={x:0,y:0},i=t.map(r=>{const o=s.x-r.x,a=s.y-r.y,l=o*o+a*a+qi*qi,c=e/(l*Math.sqrt(l)),h={x:o*c,y:a*c};return n.x-=h.x*r.mass,n.y-=h.y*r.mass,h});return{hero:n,moons:i}}function xw(s,t){return!!s&&t.some(e=>Math.hypot(e.x-s.x,e.y-s.y)<=s.radius-.16)}const _w=.018,yw=.3,Af=18,Mw=4,Sw=.65;function ww(s=0,t=Math.random){return{energy:.6,gateOpen:!0,pickups:[],nextSpawnAt:s+2.5+t()*1.5,nextId:1,pendingClose:!1}}function Ew(s,t,e,n,i=Math.random){for(let r=0;r<32;r++){const o=i()*Math.PI*2,a=2+i()*5,l={x:s.x+Math.cos(o)*a,y:s.y+Math.sin(o)*a};if(ah(l,t)&&!(!n&&t.walls.some(c=>c.gate&&(s.x-c.x)*(l.x-c.x)<0))&&!e.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<1.2))return l}return null}function bw(s,{before:t,hero:e,level:n,dt:i,time:r,rng:o=Math.random}){const a={...s,pickups:s.pickups.filter(d=>r-d.createdAt<Af)};a.energy=Math.max(.06,Math.min(1,s.energy-_w*i));let l=0;if(a.pickups=a.pickups.filter(d=>Wa(t,e,d)<=Sw+In?(l++,!1):!0),a.energy=Math.min(1,a.energy+l*yw),r>=a.nextSpawnAt){if(a.pickups.length<Mw){const d=Ew(e,n,a.pickups,a.gateOpen,o);d&&a.pickups.push({...d,id:a.nextId++,createdAt:r})}a.nextSpawnAt=r+2.5+o()*1.5}const c=n.walls.find(d=>d.gate),h=!!c&&Fc(e,In,c);return a.pendingClose=!1,a.gateOpen&&a.energy<.35?h?a.pendingClose=!0:a.gateOpen=!1:!a.gateOpen&&a.energy>.5&&(a.gateOpen=!0),{state:a,collected:l,gateChanged:a.gateOpen!==s.gateOpen}}function Tw(s,t,e=1.5){const n=s.maxX-s.minX+e*2,i=s.maxY-s.minY+e*2,r=Math.max(n,i*t);return{width:r,height:r/t}}function Aw(s){const t=Math.max(35,21*s);return{width:t,height:t/s}}function Cw(s,t,e,n,i,r,o=!1){const a=Math.hypot(e.x,e.y),l=t.x+(a?e.x/a*2:0),c=t.y+(a?e.y/a*2:0),h=(g,p,x)=>p>x?(p+x)/2:Math.max(p,Math.min(x,g)),d=i.width/2,u=i.height/2,f=h(l,n.minX+d-.75,n.maxX-d+.75),m=h(c,n.minY+u-.75,n.maxY-u+.75),v=o?1:1-Math.exp(-4*Math.max(0,r));return{x:s.x+(f-s.x)*v,y:s.y+(m-s.y)*v}}const zn={startLight:.6,burnRate:.018,pickupGain:.3,graceSeconds:8,maxTotalWells:null,pickupLife:18,pickupRadius:.65},vd={bounds:{minX:-20,maxX:76,minY:-27,maxY:27},spawn:{x:0,y:0,vx:1.8,vy:0},goal:{x:50,y:0,radius:1.5},walls:[{x:-20.25,y:0,w:.5,h:54.5},{x:76.25,y:0,w:.5,h:54.5},{x:28,y:27.25,w:96.5,h:.5},{x:28,y:-27.25,w:96.5,h:.5}],spikes:[],dangers:[]},dh=[{id:1,title:"The long crossing",color:"#b9fff0",objective:"Keep your light alive. Cross the open chamber to the far portal.",mechanic:"campaign",heroGravity:0,moons:[],soundGates:[{id:0,x:10,y:0,radius:.9},{id:1,x:24,y:6,radius:.9},{id:2,x:40,y:-5,radius:.9}],level:vd},{id:2,title:"The heavy neighbor",color:"#ffb365",objective:"Curve around the giant ember. Its gravity reaches beyond its fire.",mechanic:"giant",heroGravity:0,moons:[],giant:{x:28,y:0,radius:4,strength:70},soundGates:[{id:0,x:10,y:0,radius:.9},{id:1,x:28,y:9,radius:.9},{id:2,x:43,y:-5,radius:.9}],level:{...vd,dangers:[{x:28,y:0,radius:4,strength:70}]}}],Xa=dh[0];function Cf(s){return dh.find(t=>t.id===Number(s))||Xa}function Rw(s){return dh.find(t=>t.id===Number(s)+1)||null}function Rf(s,t=Xa.level,e=.47){return ah(s,t)&&!(t.dangers||[]).some(n=>Math.hypot(s.x-n.x,s.y-n.y)<n.radius+e)}function Pw(s,t=zn.maxTotalWells){return t===null||s<t}function xd(s){const t=Math.imul(s,1664525)+1013904223>>>0;return{seed:t,value:t/4294967296}}function Lw(s=428){return{energy:zn.startLight,graceLeft:zn.graceSeconds,pickups:[{x:6,y:2.5,id:1,createdAt:0},{x:15,y:-3,id:2,createdAt:0}],nextId:3,nextSpawnAt:7,seed:s,beatPhase:0,failed:!1}}function Iw(s,t,e=Xa.level){let n=t.seed;for(let i=0;i<32;i++){let r=xd(n);n=r.seed;const o=(r.value-.5)*Math.PI*1.5;r=xd(n),n=r.seed;const a=4+r.value*5,l={x:s.x+Math.cos(o)*a,y:s.y+Math.sin(o)*a};if(Rf(l,e,zn.pickupRadius+In)&&!(Math.hypot(l.x-e.goal.x,l.y-e.goal.y)<e.goal.radius+1.3)&&!t.pickups.some(c=>Math.hypot(l.x-c.x,l.y-c.y)<2.5))return{point:l,seed:n}}return{point:null,seed:n}}function Dw(s,{before:t,hero:e,dt:n,time:i,level:r=Xa.level}){if(s.failed)return{state:s,collected:0,heartbeat:[],failed:!1};const o={...s,pickups:s.pickups.filter(c=>i-c.createdAt<zn.pickupLife)};o.energy=Math.max(0,s.energy-zn.burnRate*n);let a=0;if(o.pickups=o.pickups.filter(c=>Wa(t,e,c)>zn.pickupRadius+In?!0:(a++,!1)),o.energy=Math.min(1,o.energy+a*zn.pickupGain),i>=o.nextSpawnAt){const c=Iw(e,o,r);o.seed=c.seed,c.point&&o.pickups.push({...c.point,id:o.nextId++,createdAt:i}),o.nextSpawnAt=i+(c.point?7:2)}const l=[];if(o.energy>0)o.graceLeft=zn.graceSeconds,o.beatPhase=0;else if(o.graceLeft=Math.max(0,s.graceLeft-n),o.failed=o.graceLeft<=0,!o.failed){const c=1-o.graceLeft/zn.graceSeconds,h=n*(60+80*c)/60,d=s.energy>0?0:s.beatPhase;s.energy>0&&l.push({part:"lub",urgency:c});const u=d+h;for(let f=Math.floor(d);f<=Math.floor(u);f++)d<f+.22&&u>=f+.22&&l.push({part:"dub",urgency:c}),f>0&&d<f&&u>=f&&l.push({part:"lub",urgency:c});o.beatPhase=u%1}return{state:o,collected:a,heartbeat:l,failed:o.failed&&!s.failed}}const fh=["#76e9e3","#bfa5ff","#ffd98b"],Pf=["bass","offbeat","chime"],Lf="orbit-lab-campaign-gates-v1";function Nw(){return{mask:0,beat:-1}}function Qr(s){return[0,1,2].reduce((t,e)=>t+(s>>e&1),0)}function If(s){return Pf.filter((t,e)=>s&1<<e).join(" + ")||"none"}function Uw(s,t,e,n,i){let r=s.mask;const o=[];for(const c of t)r&1<<c.id||Wa(e,n,c)<=c.radius+In&&(r|=1<<c.id,o.push(c.id));const a=Math.floor(i*4),l=a===s.beat?[]:Pf.map((c,h)=>h).filter(c=>r&1<<c).map(c=>({id:c,beat:a}));return{state:{mask:r,beat:a},acquired:o,beats:l}}function Fw(s,t=[1,2]){if(!s||typeof s!="object"||Array.isArray(s))return{};const e={};for(const n of t)Number.isInteger(s[n])&&s[n]>=0&&s[n]<=7&&(e[n]=s[n]);return e}function Ow(s,t){return s===void 0||Qr(t)>Qr(s)?t:s}const to=new URLSearchParams(location.search);let jt=["1","2"].includes(to.get("campaign"))&&!to.has("demo"),_s=jt?Number(to.get("campaign")):1,Ot=jt?Cf(_s):Tf(to.get("demo")),Kt=structuredClone(Ot.level),bi=Ot.heroGravity,Ia=!1;const ye=new fw;let ph=0;const Bw=document.querySelector("#app");Bw.innerHTML=`
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
  <div class="demo-note" id="demoNote"><strong id="demoTitle"></strong><span id="demoObjective"></span><div id="resourceHud" class="resource-hud hidden"><div class="resource-top"><span>LIGHT</span><span id="resourceValue">60%</span><span id="gateStatus">GATE OPEN</span></div><div class="resource-track"><i id="resourceFill"></i><b></b><b></b></div></div><div id="campaignGateHud" class="campaign-gate-hud hidden" aria-live="polite">♪ <span id="campaignGateCount">0/3 gates</span></div></div>
  <dialog id="gallery" class="gallery"><div class="gallery-heading"><div><span class="eyebrow">ORBIT LAB / MECHANICS GALLERY</span><h1>World studies.</h1><p>One new rule at a time. Experiments in gravity, light, and sound.</p></div><div class="gallery-actions"><button id="homeFromGallery" class="quiet-button" aria-label="Home" title="Home">⌂</button><button id="closeGallery" class="quiet-button" aria-label="Close gallery"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div></div><nav id="demoCategories" class="demo-categories" aria-label="Study categories"></nav><div class="demo-grid" id="demoGrid"></div><p class="gallery-footer">Every study starts paused. Place a well, then Start. Wells now begin at strength 70; settings let you compare.</p></dialog>
  <div id="home" class="home-overlay hidden"><div class="home-card"><span class="eyebrow">ORBIT LAB</span><h1>A little light in a large world.</h1><p>Draw a path with temporary gravity. Keep your light alive until you reach the portal.</p><button id="startCampaign" class="primary-button" type="button">Campaign ↗</button><button id="studyHome" class="home-secondary" type="button">Studies</button></div></div>
  <div id="levelSelect" class="home-overlay hidden"><div class="home-card level-select-card"><span class="eyebrow">CAMPAIGN / LEVELS</span><h1>Choose a crossing.</h1><div class="level-cards"><button class="level-card" data-campaign-level="1" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C40 39 65 32 103 32 S130 30 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/><circle cx="65" cy="33" r="6" fill="none" stroke="#7de6df"/></svg><span>01 / LIGHT & DISTANCE</span><strong>The long crossing</strong><small>A clear chamber. Keep the fire alive to reach the far portal.</small><em data-complete="1"></em><span data-gate-best="1"></span></button><button class="level-card" data-campaign-level="2" type="button"><svg viewBox="0 0 160 68" aria-hidden="true"><path d="M8 39 C39 39 50 58 80 58 S117 32 147 30" fill="none" stroke="#7de6df" stroke-width="2"/><circle cx="18" cy="39" r="4" fill="#dffff7"/><circle cx="85" cy="28" r="16" fill="#ff8a32"/><circle cx="85" cy="28" r="24" fill="none" stroke="#ff8a32" opacity=".4"/><circle cx="143" cy="30" r="11" fill="none" stroke="#ae9dff" stroke-width="2"/></svg><span>02 / GRAVITY & DANGER</span><strong>The heavy neighbor</strong><small>A giant ember bends your path. Keep outside its fire.</small><em data-complete="2"></em><span data-gate-best="2"></span></button></div><button id="levelsBack" class="home-secondary" type="button">Back home</button></div></div>
  <div class="drift-overlay hidden" id="driftOverlay"><div class="result-card"><span class="eyebrow">SIGNAL LOST</span><h2>Out of orbit.</h2><p>The particle drifted beyond the visible arena.</p><div class="result-actions"><button id="driftRestart" class="primary-button">Try again ↗</button><button id="driftHome" class="home-secondary" type="button">Home</button></div></div></div>
  <div class="win-overlay hidden" id="winOverlay"><div class="result-card trail-result"><span class="eyebrow" id="resultEyebrow">COURSE COMPLETE</span><h2 id="resultTitle">Your orbit.</h2><canvas id="winArtwork" width="1280" height="720" role="img" aria-label="The complete glowing trail drawn during your run"></canvas><p id="winStats"></p><p id="winGateStats" class="gate-result hidden"></p><div class="result-actions"><button id="winRestart" class="primary-button">Fly again ↗</button><button id="winHome" class="home-secondary" type="button">Home</button></div></div></div>
`;const st=s=>document.querySelector(s),hr=st("#scene"),mh=st("#wellList"),ps=st("#strength"),Da=st("#lifetime"),yn=st("#settings"),gh=st("#sceneCaption"),eo=st("#showForecast"),Or=st("#pause"),vh=st("#driftOverlay"),xh=st("#winOverlay"),Qn=new Ie,Le=new vy({antialias:!0,alpha:!0,powerPreference:"high-performance"});Le.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Le.setSize(hr.clientWidth,hr.clientHeight);Le.outputColorSpace=an;Le.toneMapping=bd;Le.toneMappingExposure=1.6;Le.shadowMap.enabled=!0;Le.shadowMap.type=wd;hr.appendChild(Le.domElement);const xa=st("#minimap"),zw=xa.getContext("2d"),Oe=new zm,ze=new dw(Oe,ye),Df=new lw(Oe),Qt=new rf(-12,12,8,-8,.1,100);Qt.position.set(0,0,30);Qt.lookAt(0,0,0);const kw=6744562,Gw=10195199,Hw=15268607;new vn({color:2505557,transparent:!0,opacity:.1});function Nf(s,t,e=!1){const n=e?[...s,s[0]]:s,i=new ve().setFromPoints(n.map(r=>new N(r.x,r.y,r.z||0)));return new mo(i,t)}function Ti(s,t,e=96){const n=Array.from({length:e},(i,r)=>({x:Math.cos(r/e*Math.PI*2)*s,y:Math.sin(r/e*Math.PI*2)*s,z:0}));return Nf(n,t,!0)}const Vw=new Ie;Oe.add(Vw);Oe.add(Qn);const Uf=new Ie;Oe.add(Uf);let Gl=387;const da=()=>(Gl=Gl*16807%2147483647,Gl/2147483647),Ww=new Wi(.022,6);for(let s=0;s<210;s++){const t=new me(Ww,new Ye({color:s%7===0?7899322:5077138,transparent:!0,opacity:.2+da()*.4}));t.position.set((da()-.5)*95,(da()-.5)*75,-3),t.scale.setScalar(.6+da()*1.4),Uf.add(t)}Oe.add(new Dg(11193053,1.2));const no=new me(new Xi(200,200),new Cg({color:2900816,roughness:1,metalness:0}));no.position.z=-.9;no.receiveShadow=!0;Oe.add(no);const ii=new ka(6744562,85,50,1.5);ii.castShadow=!0;ii.shadow.mapSize.set(window.innerWidth<=700?512:1024,window.innerWidth<=700?512:1024);ii.shadow.camera.near=.1;ii.shadow.camera.far=50;ii.shadow.bias=-3e-4;ii.shadow.normalBias=.015;Oe.add(ii);const _o=new Ie,_a=new me(new gr(.25,32,24),new Ye({color:14680056}));_o.add(_a);function Xw(){const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d"),e=t.createRadialGradient(64,64,2,64,64,64);return e.addColorStop(0,"rgba(189,255,247,.95)"),e.addColorStop(.13,"rgba(109,250,231,.72)"),e.addColorStop(.35,"rgba(58,215,225,.24)"),e.addColorStop(1,"rgba(58,215,225,0)"),t.fillStyle=e,t.fillRect(0,0,128,128),new Oa(s)}const _h=Xw(),io=document.createElement("canvas");io.width=io.height=128;const yh=io.getContext("2d"),yo=yh.createRadialGradient(64,64,0,64,64,64);yo.addColorStop(0,"rgba(225,255,249,1)");yo.addColorStop(.16,"rgba(102,233,242,.95)");yo.addColorStop(.38,"rgba(64,204,217,.4)");yo.addColorStop(1,"rgba(64,204,217,0)");yh.fillStyle=yo;yh.fillRect(0,0,128,128);const so=new mr(new Es({map:new Oa(io),transparent:!0,depthWrite:!1,blending:_n}));so.scale.set(2.4,2.4,1);so.position.z=.1;_o.add(so);_o.position.z=2;Oe.add(_o);const ro=128,Oc=Array.from({length:ro},()=>({x:0,y:0,vx:0,vy:0,life:0,duration:1})),Ff=new Float32Array(ro*3),Mh=new Float32Array(ro),ur=new ve;ur.setAttribute("position",new Ce(Ff,3).setUsage(Ci));ur.setAttribute("heat",new Ce(Mh,1).setUsage(Ci));const qa=new Dn({transparent:!0,depthWrite:!1,blending:_n,uniforms:{pixelRatio:{value:Le.getPixelRatio()}},vertexShader:"attribute float heat; varying float vHeat; uniform float pixelRatio; void main(){vHeat=heat;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=(3.+heat*6.)*pixelRatio;}",fragmentShader:"varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.||vHeat<=0.)discard;vec3 color=mix(vec3(.25,.8,.85),vec3(.9,1.,.96),vHeat);gl_FragColor=vec4(color,pow(1.-r,2.)*vHeat);}"}),Of=new Fa(ur,qa);Of.frustumCulled=!1;Oe.add(Of);let qw=0,ya=0;function Yw(){for(const s of Oc)s.life=0;Mh.fill(0),ur.attributes.heat.needsUpdate=!0,ya=0}function $w(s){for(ya+=s*36;ya>=1;){ya--;const t=Oc[qw++%ro],e=Math.random()*Math.PI*2,n=.6+Math.random()*1.5;t.x=Mt.position.x,t.y=Mt.position.y,t.vx=-Mt.velocity.x*.14+Math.cos(e)*n,t.vy=-Mt.velocity.y*.14+Math.sin(e)*n,t.duration=t.life=.5+Math.random()*1.4}for(let t=0;t<ro;t++){const e=Oc[t];e.life=Math.max(0,e.life-s),e.x+=e.vx*s,e.y+=e.vy*s,e.vx*=Math.exp(-s*1.3),e.vy*=Math.exp(-s*1.3),Ff.set([e.x,e.y,2.2],t*3),Mh[t]=e.life/e.duration}ur.attributes.position.needsUpdate=!0,ur.attributes.heat.needsUpdate=!0}const Xe=document.createElement("canvas");Xe.width=1536;Xe.height=1064;const jn=Xe.getContext("2d"),Mo=new Oa(Xe);Mo.colorSpace=an;const Ya=new me(new Xi(26,18),new Ye({map:Mo,transparent:!0,depthWrite:!1,blending:_n}));Ya.position.z=.62;Oe.add(Ya);let Si=13,wi=9;function Bf(s,t){const e=Math.max(Si,s),n=Math.max(wi,t);if(e===Si&&n===wi)return;const i=document.createElement("canvas");i.width=Xe.width,i.height=Xe.height,i.getContext("2d").drawImage(Xe,0,0),jn.clearRect(0,0,Xe.width,Xe.height);const r=Xe.width*Si/e,o=Xe.height*wi/n;jn.drawImage(i,(Xe.width-r)/2,(Xe.height-o)/2,r,o),Si=e,wi=n,Ya.scale.set(e/13,n/9,1),Mo.needsUpdate=!0}const Vn=640,Sh=Array.from({length:Vn},()=>({x:0,y:0,time:0}));let _i=0,sn=0;const zf=new Float32Array(Vn*18),kf=new Float32Array(Vn*6),Gf=new Float32Array(Vn*6),ti=new ve;ti.setAttribute("position",new Ce(zf,3).setUsage(Ci));ti.setAttribute("side",new Ce(kf,1));ti.setAttribute("intensity",new Ce(Gf,1).setUsage(Ci));for(let s=0;s<Vn;s++)kf.set([-1,1,-1,1,1,-1],s*6);ti.setDrawRange(0,0);const wh=new me(ti,new Dn({transparent:!0,depthWrite:!1,blending:_n,side:Cn,vertexShader:"attribute float side; attribute float intensity; varying float vSide; varying float vIntensity; void main(){vSide=side;vIntensity=intensity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying float vSide; varying float vIntensity; void main(){float glow=exp(-7.*vSide*vSide);float core=exp(-150.*vSide*vSide);gl_FragColor=vec4(mix(vec3(.25,.8,.85),vec3(.9,1.,.96),core),vIntensity*(glow*.48+core*.7));}"}));wh.frustumCulled=!1;wh.position.z=.72;Oe.add(wh);function jw(){jn.clearRect(0,0,Xe.width,Xe.height),Si=13,wi=9,Ya.scale.set(1,1,1),Mo.needsUpdate=!0,_i=0,sn=0,ti.setDrawRange(0,0)}function Eh(s,t){const e=Xe.width/(Si*2),n=Xe.height/(wi*2);jn.beginPath(),jn.moveTo((s.x+Si)*e,(wi-s.y)*n),jn.lineTo((t.x+Si)*e,(wi-t.y)*n),jn.strokeStyle="rgba(80,226,222,.095)",jn.lineWidth=2,jn.lineCap="round",jn.stroke(),Mo.needsUpdate=!0}const Zw=new za({color:9632511,transparent:!0,opacity:.25,dashSize:.11,gapSize:.14}),Hi=new mo(new ve,Zw);Hi.position.z=.15;Oe.add(Hi);Hi.visible=!1;const So=Ti(4,new za({color:7376041,transparent:!0,opacity:.17,dashSize:.055,gapSize:.12}));So.computeLineDistances();So.position.set(0,0,-.1);Oe.add(So);const Ln=new zS({gravity:new S(0,0,0),allowSleep:!1}),bh=new xr("blob"),Bc=new xr("wall");Ln.addContactMaterial(new vo(bh,Bc,{friction:0,restitution:.1}));const Mt=new wt({mass:1,shape:new yf(In),material:bh,linearDamping:0,angularDamping:0,fixedRotation:!0});Ln.addBody(Mt);const oo=[],nr=[],zc=[];function Kw(s){for(const t of s.channel?Sf(s.channel):[]){const e=new lr(t.map(r=>new ht(r.x,r.y))),n=new Ca(e,{depth:4,bevelEnabled:!1,steps:1});n.translate(0,0,-1);const i=new me(n,new Ye({color:0}));i.castShadow=!0,nr.push(i),Qn.add(i)}for(const t of s.guides||[]){const e=new wt({mass:0,material:Bc,shape:qS(t)});Ln.addBody(e),oo.push(e);const n=new lr(t.map(o=>new ht(o.x,o.y))),i=new Ca(n,{depth:4,bevelEnabled:!1,steps:1});i.translate(0,0,-1);const r=new me(i,new Ye({color:0}));r.castShadow=!0,nr.push(r),Qn.add(r)}for(const t of s.walls){const e=new wt({mass:0,material:Bc,shape:new Ha(new S(t.w/2,t.h/2,.7))});e.position.set(t.x,t.y,0),Ln.addBody(e),e.isGate=!!t.gate,oo.push(e);const n=new me(new uh(t.w,t.h,4,4,.18),new Ye({color:0}));n.position.set(t.x,t.y,1),n.castShadow=!0,n.userData.gate=!!t.gate,nr.push(n),Qn.add(n)}}const Th=[],Ah=new Oa(io),Na=document.createElement("canvas");Na.width=Na.height=128;const Ch=Na.getContext("2d"),$a=Ch.createRadialGradient(64,64,0,64,64,64);$a.addColorStop(0,"rgba(255,170,85,1)");$a.addColorStop(.2,"rgba(255,143,40,.65)");$a.addColorStop(1,"rgba(255,70,10,0)");Ch.fillStyle=$a;Ch.fillRect(0,0,128,128);Ah.image=Na;Ah.needsUpdate=!0;function Jw(s){for(const t of s.spikes){const e=new Ie;e.position.set(t.x,t.y,1.2),Qn.add(e),zc.push(e);const n=new me(new gr(.22,20,12),new Ye({color:16742948}));e.add(n);const i=new mr(new Es({map:Ah,transparent:!0,opacity:.7,depthWrite:!1,blending:_n}));i.scale.set(1.35,1.35,1),e.add(i);const r=new ka(16747058,4,4,2);r.position.z=-.1,r.castShadow=!0,r.shadow.mapSize.set(256,256),r.shadow.camera.near=.1,r.shadow.camera.far=4,r.shadow.bias=-3e-4,e.add(r);const o=new Float32Array(54),a=new Float32Array(18),l=new ve;l.setAttribute("position",new Ce(o,3).setUsage(Ci)),l.setAttribute("heat",new Ce(a,1).setUsage(Ci));const c=qa.clone();c.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(1.,.2,.02),vec3(1.,.72,.2),vHeat),pow(1.-r,2.)*vHeat*.65);}";const h=new Fa(l,c);h.frustumCulled=!1,e.add(h),Th.push({positions:o,heat:a,geometry:l,material:c})}}function Qw(){for(const s of Th){s.material.uniforms.pixelRatio.value=Le.getPixelRatio();for(let t=0;t<18;t++){const e=(se*.75+t/18)%1,n=t*2.39996,i=.15+e*(.3+t%4*.08);s.positions.set([Math.cos(n)*i,Math.sin(n)*i,.2],t*3),s.heat[t]=(1-e)**2}s.geometry.attributes.position.needsUpdate=!0,s.geometry.attributes.heat.needsUpdate=!0}}const si=new Ie;si.position.set(Kt.goal.x,Kt.goal.y,1);Qn.add(si);const Rh=new mr(new Es({map:_h,transparent:!0,opacity:.45,depthWrite:!1,blending:_n,color:9554175}));Rh.scale.set(4.5,4.5,1);si.add(Rh);const tE=new me(new Wi(.64,64),new Ye({color:532025,transparent:!0,opacity:.88,side:Cn}));si.add(tE);for(let s=0;s<3;s++){const t=Ti(.65+s*.16,new vn({color:s===0?11665392:7909375,transparent:!0,opacity:.78-s*.18}));t.position.z=.2+s*.02,si.add(t)}const bs=new ka(10906623,8,6,2);bs.position.z=.1;bs.castShadow=!0;bs.shadow.mapSize.set(256,256);bs.shadow.camera.near=.1;bs.shadow.camera.far=6;bs.shadow.bias=-3e-4;si.add(bs);const Hf=new Float32Array(96),Vf=new Float32Array(32),ao=new ve;ao.setAttribute("position",new Ce(Hf,3).setUsage(Ci));ao.setAttribute("heat",new Ce(Vf,1).setUsage(Ci));const Ph=qa.clone();Ph.fragmentShader="varying float vHeat; void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(mix(vec3(.4,.12,1.),vec3(.85,.6,1.),vHeat),pow(1.-r,2.)*vHeat);}";const Wf=new Fa(ao,Ph);Wf.frustumCulled=!1;si.add(Wf);function eE(){Ph.uniforms.pixelRatio.value=Le.getPixelRatio();for(let s=0;s<32;s++){const t=(se*.5+s/32)%1,e=s*2.39996+t*.9,n=.8+t*.8;Hf.set([Math.cos(e)*n,Math.sin(e)*n,.4],s*3),Vf[s]=Math.sin(t*Math.PI)}ao.attributes.position.needsUpdate=!0,ao.attributes.heat.needsUpdate=!0}let se=0,Ks=0,lo=performance.now(),re=[],nE=1,Ai="fade",Je=!0,Pe="ready",Yi=!1,ke=!1,Hl=0,Bi=null,Xf=0,pn=Ot.sandbox?"sandbox":"maze",dr=0,qe=!1,ms=null,Ge=null,pe=null,Fe=null,ys=0,xn=!1,fn=null;const qf="orbit-lab-campaign-complete-v1";let kc=(()=>{try{return new Set(JSON.parse(localStorage.getItem(qf)||"[]").filter(s=>[1,2].includes(s)))}catch{return new Set}})();function iE(s){kc.add(s);try{localStorage.setItem(qf,JSON.stringify([...kc]))}catch{}}let js=(()=>{try{return Fw(JSON.parse(localStorage.getItem(Lf)||"{}"))}catch{return{}}})();function sE(s,t){const e=Ow(js[s],t);if(e!==js[s]){js={...js,[s]:e};try{localStorage.setItem(Lf,JSON.stringify(js))}catch{}}}function Yf(s,t){const e=["Cyan bass","Violet offbeat","Gold chime"],n=document.createElement("span");n.className="gate-pattern-icons",n.setAttribute("role","img"),n.setAttribute("aria-label",e.map((i,r)=>`${i} ${t&1<<r?"acquired":"not acquired"}`).join(", ")),e.forEach((i,r)=>{const o=document.createElement("i");o.style.setProperty("--gate-color",fh[r]),o.classList.toggle("acquired",!!(t&1<<r)),n.append(o)}),s.append(" ",n)}function wo(s,t="home"){xn=s,st("#home").classList.toggle("hidden",!s||t!=="home"),st("#levelSelect").classList.toggle("hidden",!s||t!=="levels");for(const e of[".chrome",".scene",".play-control"])st(e).inert=s;s&&st(t==="levels"?'[data-campaign-level="1"]':"#startCampaign").focus()}const $f=new Ie;Oe.add($f);const hs=new Map,jf=new Ie;Oe.add(jf);const Ma=[];let vi=null;function rE(){for(const s of Ma)xi(s);if(Ma.length=0,!!jt)for(const s of Ot.soundGates){const t=new Ie;t.position.set(s.x,s.y,1.5);const e=new te(fh[s.id]),n=new mr(new Es({map:_h,color:e,transparent:!0,opacity:.32,blending:_n,depthWrite:!1}));n.scale.set(3.5,3.5,1);const i=Ti(s.radius,new vn({color:e,transparent:!0,opacity:.88})),r=Ti(s.radius*.72,new vn({color:e,transparent:!0,opacity:.37}));t.add(n,i,r),jf.add(t),Ma.push(t)}}function oE(){for(const s of Ot.soundGates||[]){const t=Ma[s.id];if(!t)continue;const e=!!((Fe==null?void 0:Fe.mask)&1<<s.id),n=1+(e?.08:.035)*Math.sin(se*Math.PI*8);t.scale.setScalar(n),t.children[0].material.opacity=e?.13:.32,t.children[1].material.opacity=e?.32:.88,t.children[2].material.opacity=e?.17:.37}}function Zf(s,t,e,n,i){const r=nE++,o=r%2?kw:Gw,a=new Ie;a.position.set(s,t,Kt.channel?4:1);const l=new me(new Wi(.2,48),new Ye({color:o,transparent:!0,opacity:.32})),c=new me(new Wi(.082,32),new Ye({color:Hw})),h=Ti(.29,new vn({color:o,transparent:!0,opacity:.85})),d=Ti(.6,new vn({color:o,transparent:!0,opacity:.45})),u=Ti(1.2,new za({color:o,transparent:!0,opacity:.21,dashSize:.07,gapSize:.11}));u.computeLineDistances();const f=new mo(new ve,new vn({color:o,transparent:!0,opacity:.9}));return a.add(l,c,h,d,u,f),Oe.add(a),{id:r,x:s,y:t,strength:e,lifetime:n,createdAt:i,group:a,disc:l,inner:h,outer:d,field:u,timer:f,color:o}}function Lh(s){Oe.remove(s.group),s.group.traverse(t=>{var e,n;(e=t.geometry)==null||e.dispose(),(n=t.material)==null||n.dispose()})}function ja(){st("#wellCount").textContent=`${re.length} / 2`,mh.innerHTML=re.length?re.map(s=>`
    <div class="well-item" style="--well-color:${s.id%2?"#66e9f2":"#9b90ff"}">
      <span class="well-glyph">✳</span><span class="well-name">WELL ${String(s.id).padStart(2,"0")}</span>
      <span class="well-timer" data-well-time="${s.id}">${Jr(s,se).toFixed(1)}s</span>
      <button data-remove="${s.id}" aria-label="Remove well ${s.id}" title="Remove well">×</button>
    </div>`).join(""):'<p class="empty-wells">No wells active. Place one in the arena.</p>'}function Ms(s){const t=re.findIndex(e=>e.id===s);t!==-1&&(Lh(re[t]),re.splice(t,1),ja(),ji())}function aE(s,t){if(ke||qe||yn.open||Mn.open||xn||jt&&!Pw(ys)||pn==="maze"&&!(jt?Rf({x:s,y:t},Kt):ah({x:s,y:t},Kt)))return;const e=Zf(s,t,Number(ps.value),Number(Da.value),se);jt&&ys++,ye.placement(),ph=se;const n=re[0];re=JS(re,e),n&&!re.includes(n)&&Lh(n),ja(),ji(),Pe==="ready"&&(gh.textContent="TAP START TO RELEASE")}function Kf(){re.forEach(Lh),re=[],ja(),ji()}function Ts(){if(ye.reset(),ph=0,ms&&(clearTimeout(ms),ms=null),Kf(),hE(),ys=0,se=0,Ks=0,jw(),Yw(),ke=!1,qe=!1,Je=!0,Pe="ready",vh.classList.add("hidden"),xh.classList.add("hidden"),st("#deathFlash").classList.remove("visible"),gh.textContent=pn==="maze"?"PLACE A WELL · THEN START":"TAP START TO RELEASE",Mt.force.setZero(),Mt.angularVelocity.setZero(),pn==="maze")Mt.position.set(Kt.spawn.x,Kt.spawn.y,0),Mt.velocity.set(Kt.spawn.vx,Kt.spawn.vy,0),dr+=1,st("#attempts").textContent=dr,jt&&(fn={minX:Mt.position.x,maxX:Mt.position.x,minY:Mt.position.y,maxY:Mt.position.y});else{Mt.position.set(4,0,0);const s=Number(ps.value);Mt.velocity.set(0,Math.sqrt(s*4*4/Math.pow(16+.75*.75,1.5)),0),re=[Zf(0,0,s,Number(Da.value),0)]}_r(),Uh(0,!0),st("#runTime").textContent="0.0s",ja(),ji(),fr(),lo=performance.now()}function Gr(s="darkness"){if(!(ke||qe)){if(ye.death(),ye.stopHeartbeat(),ke=!0,Je=!0,Pe="dead",st("#deathFlash").classList.add("visible"),fr(),jt){Jf(!1,s);return}ms=setTimeout(Ts,420)}}function Jf(s,t="darkness"){jt&&sE(_s,(Fe==null?void 0:Fe.mask)||0);const e=sn?Sh[(_i+sn-1)%Vn]:Kt.spawn;Eh(e,Mt.position);const n=jt?{minX:Math.min(fn.minX,Kt.spawn.x,Mt.position.x)-6,maxX:Math.max(fn.maxX,Kt.spawn.x,Mt.position.x)+6,minY:Math.min(fn.minY,Kt.spawn.y,Mt.position.y)-6,maxY:Math.max(fn.maxY,Kt.spawn.y,Mt.position.y)+6}:Kt.bounds;pw(st("#winArtwork"),Xe,Si,wi,n,Kt.spawn,Mt.position),st("#resultEyebrow").textContent=s?"COURSE COMPLETE":"SIGNAL LOST",st("#resultTitle").textContent=jt?s?"Light carried home.":t==="manual"?"Journey ended.":t==="hazard"?"Taken by the ember.":"The light went out.":"Your orbit.",st("#winStats").textContent=`${se.toFixed(1)} seconds  ·  ${dr} attempt${dr===1?"":"s"}${jt?`  ·  ${ys} well${ys===1?"":"s"} placed`:""}`,st("#winGateStats").classList.toggle("hidden",!jt),jt&&(st("#winGateStats").textContent=`Gates ${Qr(Fe.mask)}/3 · ${If(Fe.mask)}`,Yf(st("#winGateStats"),Fe.mask)),st("#winRestart").textContent=jt?s?"Continue ↗":"Retry ↗":"Fly again ↗",xh.classList.remove("hidden")}function lE(){qe||(ye.portal(),ye.stopHeartbeat(),qe=!0,Je=!0,Pe="won",jt&&iE(_s),Jf(!0),fr())}function Gc(s){jt=!1,wo(!1),Ot=Tf(s),pn=Ot.sandbox?"sandbox":"maze",bi=Ot.heroGravity,ps.value=La,st("#strengthValue").textContent=La,st("#heroGravity").value=bi,st("#heroGravityValue").textContent=bi,dr=0,Yi=!1;const t=new URL(location.href);t.searchParams.delete("campaign"),t.searchParams.set("demo",Ot.id),history.replaceState(null,"",t),_r(),Ts()}function Ih(s=1){jt=!0,wo(!1),Ot=Cf(s),_s=Ot.id,pn="maze",bi=0,ps.value=La,st("#strengthValue").textContent=La,dr=0,Yi=!1,Ss=!1;const t=new URL(location.href);t.searchParams.delete("demo"),t.searchParams.set("campaign",String(_s)),history.replaceState(null,"",t),_r(),Ts()}const Hc=new Ie;Oe.add(Hc);const Rn=[];let $n=null;function xi(s){var t;(t=s.parent)==null||t.remove(s),s.traverse(e=>{var n,i,r,o;(n=e.geometry)==null||n.dispose(),(i=e.material)==null||i.dispose(),(o=(r=e.shadow)==null?void 0:r.map)==null||o.dispose()})}function Dh(s){if(Ia!==s){Ia=s;for(const t of oo)t.isGate&&(s&&Ln.bodies.includes(t)&&Ln.removeBody(t),!s&&!Ln.bodies.includes(t)&&Ln.addBody(t));for(const t of nr)t.userData.gate&&(t.visible=!s);if(Kt.walls=Ot.level.walls.filter(t=>!t.gate||!s).map(t=>({...t})),vi)for(const t of vi.children)t.material.opacity=s?.38:.75}}function cE(){const s=(pe==null?void 0:pe.pickups)||(Ge==null?void 0:Ge.pickups)||[],t=new Set(s.map(e=>e.id));for(const[e,n]of hs)t.has(e)||(xi(n),hs.delete(e));for(const e of s){if(!hs.has(e.id)){const o=uf(.22,16770216);o.position.set(e.x,e.y,1.65),$f.add(o),hs.set(e.id,o)}const n=hs.get(e.id),i=Math.max(0,(pe?zn.pickupLife:Af)-(se-e.createdAt)),r=Math.min(1,i/3);n.userData.animate(se,Le.getPixelRatio()),n.userData.setFade(r),n.scale.setScalar(.96+.06*Math.sin(se*3+e.id))}}function Qf(){const s=st("#resourceHud");if(s.classList.toggle("hidden",!Ge&&!pe),s.classList.toggle("campaign-resource",!!pe),st("#campaignGateHud").classList.toggle("hidden",!pe),!Ge&&!pe)return;const t=(pe==null?void 0:pe.energy)??Ge.energy;st("#resourceValue").textContent=`${Math.round(t*100)}%`,st("#resourceFill").style.width=`${t*100}%`,st("#gateStatus").textContent=pe?t>0?`${ys} WELL${ys===1?"":"S"}`:`DARK ${Math.ceil(pe.graceLeft)}s`:Ge.pendingClose?"GATE CLOSING":Ge.gateOpen?"GATE OPEN":"GATE CLOSED",pe&&(st("#campaignGateCount").textContent=`${Qr((Fe==null?void 0:Fe.mask)||0)}/3 gates`)}function hE(){Kt=structuredClone(Ot.level),Ia=!1,Ge=Ot.mechanic==="burnout"?ww():null,pe=jt?Lw():null,Fe=jt?Nw():null,rE();for(const t of hs.values())xi(t);hs.clear(),vi&&xi(vi),vi=null,ze.reset(Ot),(Ge||pe)&&(ze.brightness=(pe||Ge).energy),Df.reset(Ot),ii.color.setHex(hh.has(Ot.mechanic)?16777215:6744562);for(const t of oo)Ln.removeBody(t);oo.length=0;for(const t of nr)xi(t);nr.length=0;for(const t of zc)xi(t);zc.length=0,Th.length=0;for(const t of Rn)Ln.removeBody(t.body),xi(t.mesh),xi(t.trail);if(Rn.length=0,$n&&xi($n),$n=null,Qn.visible=!Ot.sandbox,So.visible=!!Ot.sandbox,Ot.sandbox||(Kw(Kt),Jw(Kt)),si.position.set(Kt.goal.x,Kt.goal.y,1),si.scale.setScalar(Kt.goal.radius),Ge){const t=Kt.walls.find(e=>e.gate);vi=new Ie,vi.position.set(t.x,t.y,1.3);for(const e of[-t.h/2+.7,t.h/2-.7]){const n=Nf([{x:-.65,y:e},{x:.65,y:e}],new vn({color:16767371,transparent:!0,opacity:.38}));vi.add(n)}Qn.add(vi),Dh(!0)}Qf();for(const t of Ot.moons){const e=new wt({mass:.08,shape:new yf(.16),material:bh,linearDamping:0,angularDamping:0,fixedRotation:!0});e.position.set(t.x,t.y,0),e.velocity.set(t.vx,t.vy,0),Ln.addBody(e);const n=new Ie,i=new me(new gr(.16,20,12),new Ye({color:Ot.plate?16767114:14208511})),r=new mr(new Es({map:_h,color:Ot.plate?16758867:12428287,transparent:!0,opacity:.5,depthWrite:!1,blending:_n}));r.scale.set(1.2,1.2,1),n.add(i,r),Hc.add(n);const o=new Float32Array(480),a=new ve;a.setAttribute("position",new Ce(o,3).setUsage(Ci)),a.setDrawRange(0,0);const l=new mo(a,new vn({color:Ot.plate?15910506:12166635,transparent:!0,opacity:.28,depthWrite:!1}));l.frustumCulled=!1,Hc.add(l),Rn.push({body:e,mesh:n,trail:l,positions:o,count:0,lastSample:-1})}Ot.plate&&($n=new Ie,$n.position.set(Ot.plate.x,Ot.plate.y,.7),$n.add(Ti(Ot.plate.radius,new vn({color:16767114,transparent:!0,opacity:.9}))),$n.add(Ti(Ot.plate.radius*.8,new za({color:16767114,transparent:!0,opacity:.3,dashSize:.1,gapSize:.12}))),$n.children[1].computeLineDistances(),Qn.add($n));const s=Rn.length>0||!!Ot.mechanic;st("#heroGravity").disabled=!Rn.length,st("#heroGravity").value=bi,st("#heroGravityValue").textContent=bi,st("#heroGravityHelp").textContent=s?"Pulls loose moons; their small mass also tugs back. Set 0 to compare.":"Choose a moon study to explore the dot’s own gravity.",eo.disabled=s,Hi.visible=eo.checked&&!s,st("#forecastHelp").textContent=s?"Prediction is off for interactive studies. Watch the rule unfold in motion.":"Preview stops at the next wall, ember, or portal contact.",st("#activeDemoLabel").textContent=Ot.title,st(".settings-help").textContent=`Tap open space to place a well. On desktop, right-click a well to remove it. Space starts / resumes / releases capture / removes oldest well · P pauses · R ${jt?"ends the attempt":"restarts"} · E removes oldest / releases capture · 1 / 2 remove a specific well.`,st("#demoTitle").textContent=Ot.title,st("#demoObjective").textContent=Ot.objective,st("#demoNote").style.setProperty("--demo-color",Ot.color);for(const t of document.querySelectorAll("[data-demo]"))t.setAttribute("aria-pressed",String(t.dataset.demo===Ot.id))}function uE(){if(!Rn.length)return;const s=Rn.map(e=>({x:e.body.position.x,y:e.body.position.y,mass:e.body.mass})),t=vw(Mt.position,s,bi);Mt.applyForce(new S(t.hero.x*Mt.mass,t.hero.y*Mt.mass,0));for(let e=0;e<Rn.length;e++){const n=Rn[e].body,i=ch(n.position,re,se,Ai,Kt);n.applyForce(new S((i.x+t.moons[e].x)*n.mass,(i.y+t.moons[e].y)*n.mass,0))}}function dE(){for(const s of Rn)s.body.position.z=0,s.body.velocity.z=0,lh(s.body.velocity);if(!(Ia||!xw(Ot.plate,Rn.map(s=>s.body.position)))){Dh(!0);for(const s of $n.children)s.material.color.setHex(8911310);st("#demoObjective").textContent="Gate open. Take your trail through the portal.",ye.tone(392,0,1.3,.1),ye.tone(523.25,.15,1.3,.1)}}function fE(){for(const s of Rn){const t=s.body.position;s.mesh.position.set(t.x,t.y,2),!(se-s.lastSample<.05||Je)&&(s.lastSample=se,s.count===160&&(s.positions.copyWithin(0,3),s.count--),s.positions.set([t.x,t.y,.8],s.count++*3),s.trail.geometry.attributes.position.needsUpdate=!0,s.trail.geometry.setDrawRange(0,s.count))}}function pE(s){const t=s.level.bounds,e=170/(t.maxX-t.minX),n=100/(t.maxY-t.minY),i=m=>(m-t.minX)*e,r=m=>(t.maxY-m)*n,o=m=>m*Math.min(e,n),a=s.sandbox?"":s.level.walls.map(m=>`<rect x="${i(m.x-m.w/2)}" y="${r(m.y+m.h/2)}" width="${m.w*e}" height="${m.h*n}" rx="1" fill="#02070c"/>`).join(""),l=s.moons.map(m=>`<circle cx="${i(m.x)}" cy="${r(m.y)}" r="2" fill="${s.color}"/>`).join(""),c=s.level.spikes.map(m=>`<circle cx="${i(m.x)}" cy="${r(m.y)}" r="2" fill="#ffa75b"/>`).join(""),h=(m,v,g,p)=>`<circle cx="${i(m)}" cy="${r(v)}" r="${o(g)}" stroke="${p}" fill="none" stroke-width="1"/>`,d=(s.level.channel?Sf(s.level.channel):s.level.guides||[]).map(m=>`<polygon points="${m.map(v=>`${i(v.x)},${r(v.y)}`).join(" ")}" fill="#02070c"/>`).join(""),u=hh.has(s.mechanic)?`<path d="M85 50 L155 25 L155 75 Z" fill="${s.color}" opacity=".25"/><path d="M85 35 L85 65" stroke="${s.color}" stroke-width="2"/>`:"",f=Ot&&s.mechanic?["power","dimmer","sound"].includes(s.mechanic)?[-5,0,5].map(m=>h(m,0,.65,s.color)).join(""):s.mechanic==="burnout"?h(-5,1,.65,"#ffd98b")+h(5,0,1,"#ffd98b"):s.mechanic==="portals"?h(-3,0,1,"#76e9e3")+h(6,-3,1,"#76e9e3"):s.mechanic==="clock"?h(0,0,3.5,"#ff8a32"):["giant","chaser"].includes(s.mechanic)?h(0,0,s.mechanic==="giant"?1.6:.3,"#ff8a32"):["sticky","eclipse","boost","hidden"].includes(s.mechanic)?h(-3,0,.85,s.color):"":"";return`<svg viewBox="0 0 170 100" aria-hidden="true"><rect width="170" height="100" rx="5" fill="#102b38"/>${a}${d}<path d="M25 70 C30 20 75 20 85 50 S120 80 140 30" fill="none" stroke="${s.color}" opacity=".7" stroke-width=".7"/>${l}${u}${f}${s.sandbox?'<ellipse cx="85" cy="50" rx="28" ry="25" fill="none" stroke="#9acfff" stroke-width=".6"/>':c}<circle cx="${i(s.level.spawn.x)}" cy="${r(s.level.spawn.y)}" r="2.4" fill="#dffff9"/><circle cx="${i(s.level.goal.x)}" cy="${r(s.level.goal.y)}" r="${Math.max(4,o(s.level.goal.radius))}" stroke="#bc9aff" stroke-width=".8" fill="none"/>${s.plate?h(s.plate.x,s.plate.y,s.plate.radius,"#ffd88a"):""}</svg>`}const Mn=st("#gallery");st("#demoGrid").innerHTML=Gi.map(s=>`<button type="button" class="demo-card" data-demo="${s.id}" style="--demo-color:${s.color}" aria-pressed="false">${pE(s)}<span class="demo-rule">${s.rule}</span><strong>${s.title}</strong><span>${s.description}</span><em>${s.question}</em></button>`).join("");const tp=[["All",Gi.map(s=>s.id)],["Gravity",["drift","satellites","slingshot","gate","orbit","release","boost","sticky","giant","chaser","clock"]],["Light",["eclipse","power","dimmer","hidden","shadow-posts","filters","lens","prism","burnout"]],["Sound",["sound"]],["Space & paths",["maze","guide","portals","wideworld"]]];st("#demoCategories").innerHTML=tp.map(([s,t],e)=>`<button type="button" data-category="${e}" aria-pressed="${e===0}">${s}<span>${t.length}</span></button>`).join("");st("#demoCategories").addEventListener("click",s=>{const t=s.target.closest("[data-category]");if(!t)return;const e=tp[Number(t.dataset.category)][1];for(const n of st("#demoCategories").querySelectorAll("button"))n.setAttribute("aria-pressed",String(n===t));for(const n of st("#demoGrid").querySelectorAll("[data-demo]"))n.hidden=!e.includes(n.dataset.demo)});let Ss=!1,co=!1;function Nh(){co=xn,xn&&wo(!1),Ss=Pe==="running",Ss&&As(),yn.close(),Mn.showModal()}function Ri(){Ss=!1,Yi=!1,co=!1,ms&&(clearTimeout(ms),ms=null),yn.open&&yn.close(),Mn.open&&Mn.close(),Je=!0,ye.stopHeartbeat(),Pe==="running"&&(Pe="paused"),wo(!0),xh.classList.add("hidden"),vh.classList.add("hidden"),st("#deathFlash").classList.remove("visible");const s=new URL(location.href);s.searchParams.delete("demo"),s.searchParams.delete("campaign"),history.replaceState(null,"",s),Eo()}function ep(){Ri();for(const s of st("#levelSelect").querySelectorAll("[data-complete]"))s.textContent=kc.has(Number(s.dataset.complete))?"COMPLETE ✓":"NOT YET COMPLETE";for(const s of st("#levelSelect").querySelectorAll("[data-gate-best]")){const t=js[Number(s.dataset.gateBest)];s.textContent=t===void 0?"Best attempt: — / 3 gates":`Best attempt: ${Qr(t)}/3 gates · ${If(t)}`,Yf(s,t??0)}wo(!0,"levels")}st("#galleryButton").addEventListener("click",()=>jt?Ri():Nh());st("#browseDemos").addEventListener("click",()=>{Yi=!1,Nh()});st("#homeFromSettings").addEventListener("click",Ri);st("#homeFromGallery").addEventListener("click",Ri);st("#startCampaign").addEventListener("click",ep);st("#levelsBack").addEventListener("click",Ri);st("#levelSelect").addEventListener("click",s=>{const t=s.target.closest("[data-campaign-level]");t&&Ih(Number(t.dataset.campaignLevel))});st("#studyHome").addEventListener("click",Nh);st("#closeGallery").addEventListener("click",()=>Mn.close());Mn.addEventListener("close",()=>{co?Ri():Ss&&Pe==="paused"&&!qe&&!ke&&As(),Ss=!1,co=!1});st("#demoGrid").addEventListener("click",s=>{const t=s.target.closest("[data-demo]");t&&(Ss=!1,co=!1,Gc(t.dataset.demo),Mn.close())});st("#heroGravity").addEventListener("input",s=>{bi=Number(s.target.value),st("#heroGravityValue").textContent=bi});function _d(){return{x:Mt.position.x,y:Mt.position.y,vx:Mt.velocity.x,vy:Mt.velocity.y}}function ji(){if(!eo.checked||Ot.moons.length)return;const t=(pn==="maze"?nw(_d(),re,se,3,Ai,Kt):{points:KS(_d(),re,se,5.5,Ai,7)}).points;Hi.geometry.dispose(),Hi.geometry=new ve().setFromPoints(t.map(e=>new N(e.x,e.y,0))),Hi.computeLineDistances()}function mE(){const s={x:Mt.position.x,y:Mt.position.y,time:se},t=n=>Sh[(_i+n)%Vn],e=sn?t(sn-1):null;for((!e||se-e.time>=1/30)&&(e&&Eh(e,s),sn===Vn&&(_i=(_i+1)%Vn,sn--),Object.assign(t(sn++),s));sn>1&&t(1).time<se-20;)_i=(_i+1)%Vn,sn--;for(let n=1;n<sn;n++){const i=t(n-1),r=t(n),o=Math.hypot(r.x-i.x,r.y-i.y)||1,a=-(r.y-i.y)/o*.14,l=(r.x-i.x)/o*.14,c=(n-1)*18;zf.set([i.x-a,i.y-l,0,i.x+a,i.y+l,0,r.x-a,r.y-l,0,i.x+a,i.y+l,0,r.x+a,r.y+l,0,r.x-a,r.y-l,0],c),Gf.fill(Math.max(0,1-(se-r.time)/20)**2,(n-1)*6,n*6)}ti.attributes.position.needsUpdate=!0,ti.attributes.intensity.needsUpdate=!0,ti.setDrawRange(0,Math.max(0,sn-1)*6)}function gE(){for(const s of re){const t=Jr(s,se)/s.lifetime,e=wf(s,se,Ai);s.disc.material.opacity=.13+e*.24,s.inner.material.opacity=.25+e*.6,s.outer.material.opacity=.1+e*.4,s.field.material.opacity=.04+e*.19,s.outer.scale.setScalar(1+(1-t)*.13);const n=Math.max(1,Math.round(t*72)),i=Array.from({length:n+1},(o,a)=>{const l=Math.PI/2-a/72*Math.PI*2;return new N(Math.cos(l)*.76,Math.sin(l)*.76,0)});s.timer.geometry.dispose(),s.timer.geometry=new ve().setFromPoints(i);const r=mh.querySelector(`[data-well-time="${s.id}"]`);r&&(r.textContent=`${Jr(s,se).toFixed(1)}s`)}}function fr(){Eo();const s=qe?"FINISHED":ke?"LOST":Pe==="ready"?"READY":Je?"PAUSED":"IN FLIGHT";st("#stateLabel").textContent=s,st("#speed").textContent=`${Math.hypot(Mt.velocity.x,Mt.velocity.y).toFixed(2)} u/s`}function _r(){const s=hr.clientWidth,t=hr.clientHeight,e=s/t,n=jt||Ot.id==="wideworld"?Aw(e):pn==="maze"?Tw(Ot.level.bounds,e):{width:Math.max(21,16*e),height:Math.max(21,16*e)/e},i=n.width,r=n.height;Qt.left=-i/2,Qt.right=i/2,Qt.top=r/2,Qt.bottom=-r/2,Qt.updateProjectionMatrix();const o=Kt.bounds;Bf(Math.max(Qt.right+2,Math.abs(o.minX)+2,Math.abs(o.maxX)+2),Math.max(Qt.top+2,Math.abs(o.minY)+2,Math.abs(o.maxY)+2)),Uh(0,!0),Le.setSize(s,t),Le.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),qa.uniforms.pixelRatio.value=Le.getPixelRatio()}function Uh(s,t=!1){if(no.position.x=0,no.position.y=0,!jt&&Ot.id!=="wideworld"){Qt.position.x=0,Qt.position.y=0;return}const e=Cw(Qt.position,Mt.position,Mt.velocity,Kt.bounds,{width:Qt.right-Qt.left,height:Qt.top-Qt.bottom},s,t);Qt.position.x=e.x,Qt.position.y=e.y,jt&&Bf(Math.abs(Qt.position.x)+Qt.right+3,Math.abs(Qt.position.y)+Qt.top+3)}function vE(){if(xa.classList.toggle("visible",jt||Ot.id==="wideworld"),!jt&&Ot.id!=="wideworld")return;const s=zw,t=xa.width,e=xa.height,n=Kt.bounds,i=t/(n.maxX-n.minX),r=e/(n.maxY-n.minY),o=f=>(f-n.minX)*i,a=f=>(n.maxY-f)*r;s.clearRect(0,0,t,e),s.fillStyle="#07151f",s.fillRect(0,0,t,e),s.strokeStyle="#476877",s.lineWidth=2,s.strokeRect(1,1,t-2,e-2),s.fillStyle="#324b56";for(const f of Kt.walls)s.fillRect(o(f.x-f.w/2),a(f.y+f.h/2),f.w*i,f.h*r);const l=(f,m,v,g)=>{s.beginPath(),s.arc(o(f),a(m),v,0,Math.PI*2),s.fillStyle=g,s.fill()};if(l(Kt.goal.x,Kt.goal.y,6,"#a994ff"),jt)for(const f of Ot.soundGates)l(f.x,f.y,4,(Fe==null?void 0:Fe.mask)&1<<f.id?"#6d8993":fh[f.id]);for(const f of(pe==null?void 0:pe.pickups)||[])l(f.x,f.y,3,"#ffd58e");for(const f of Kt.dangers||[])s.beginPath(),s.arc(o(f.x),a(f.y),f.radius*Math.min(i,r),0,Math.PI*2),s.fillStyle="#e36d31",s.fill();for(const f of re)l(f.x,f.y,3.5,"#79d6ef");s.strokeStyle="#d6f9f0",s.lineWidth=1.5;const c=Math.max(n.minX,Qt.position.x+Qt.left),h=Math.min(n.maxX,Qt.position.x+Qt.right),d=Math.min(n.maxY,Qt.position.y+Qt.top),u=Math.max(n.minY,Qt.position.y+Qt.bottom);s.strokeRect(o(c),a(d),Math.max(0,h-c)*i,Math.max(0,d-u)*r),l(Mt.position.x,Mt.position.y,4,"#eafff5")}function np(s){const t=Le.domElement.getBoundingClientRect(),e=(s.clientX-t.left)/t.width,n=(s.clientY-t.top)/t.height,i=e*2-1,r=1-n*2;return{x:Qt.position.x+i*Qt.right,y:Qt.position.y+r*Qt.top}}function xE(s){return re.find(t=>Math.hypot(t.x-s.x,t.y-s.y)<.9)}Le.domElement.addEventListener("pointerdown",s=>{s.button!==0||Bi||(Xf=performance.now(),Bi={id:s.pointerId,clientX:s.clientX,clientY:s.clientY})});Le.domElement.addEventListener("pointercancel",s=>{(Bi==null?void 0:Bi.id)===s.pointerId&&(Bi=null)});Le.domElement.addEventListener("pointerup",s=>{const t=Bi;if(Bi=null,s.button!==0||!t||t.id!==s.pointerId||Math.hypot(s.clientX-t.clientX,s.clientY-t.clientY)>15||performance.now()-Xf>600)return;const e=np(s);aE(e.x,e.y)});Le.domElement.addEventListener("contextmenu",s=>{s.preventDefault();const t=xE(np(s));t&&Ms(t.id)});mh.addEventListener("click",s=>{const t=s.target.closest("[data-remove]");t&&Ms(Number(t.dataset.remove))});ps.addEventListener("input",()=>{st("#strengthValue").textContent=ps.value;for(const s of re)s.strength=Number(ps.value);ji()});Da.addEventListener("input",()=>{st("#lifetimeValue").textContent=`${Number(Da.value).toFixed(1)}s`});st(".segmented").addEventListener("click",s=>{const t=s.target.closest("[data-mode]");if(t){Ai=t.dataset.mode;for(const e of st(".segmented").children)e.classList.toggle("selected",e===t);st("#modeHelp").textContent=Ai==="fade"?"Pull weakens over the last 20% of a well’s life.":"Pull stays full strength, then vanishes instantly.",ji()}});st("#release").addEventListener("click",Kf);eo.addEventListener("change",()=>{Hi.visible=eo.checked,ji()});st("#settingsButton").addEventListener("click",()=>{Yi=Pe==="running",Yi&&As(),yn.showModal()});st("#closeSettings").addEventListener("click",()=>yn.close());yn.addEventListener("close",()=>{Yi&&Pe==="paused"&&!ke&&!qe&&As(),Yi=!1});st("#restart").addEventListener("click",()=>{jt?Gr("manual"):Ts()});st("#driftRestart").addEventListener("click",Ts);st("#driftHome").addEventListener("click",Ri);st("#winRestart").addEventListener("click",()=>{if(jt&&qe){const s=Rw(_s);s?Ih(s.id):ep()}else Ts()});st("#winHome").addEventListener("click",Ri);Or.addEventListener("click",()=>{Pe!=="ready"&&As()});st("#soundEnabled").addEventListener("change",s=>ye.setEnabled(s.target.checked));document.addEventListener("pointerdown",()=>ye.unlock(),{capture:!0});document.addEventListener("keydown",()=>ye.unlock(),{capture:!0});document.addEventListener("visibilitychange",()=>{var s;document.hidden&&(ye.stopHeartbeat(),(s=ye.context)==null||s.suspend().catch(()=>{})),lo=performance.now(),Ks=0});function _E(){yn.open||Mn.open||xn||qe||ke||(ze.held?ze.release(Mt):re.length&&Ms(re[0].id))}function Eo(){const s=Md({state:Pe,held:!!ze.held,wellCount:re.length}),t=st("#primaryAction");t.textContent=s.label,t.disabled=s.disabled||yn.open||Mn.open||xn,Or.disabled=xn||!["running","paused"].includes(Pe),st("#restart").disabled=xn||jt&&(Pe==="ready"||qe||ke),st("#restart").textContent=jt?"✕":"↺",st("#restart").setAttribute("aria-label",jt?"Die":"Restart"),st("#restart").title=jt?"Die (R)":"Restart (R)",st("#galleryButton").textContent=jt?"⌂":"⊞",st("#galleryButton").setAttribute("aria-label",jt?"Home":"Demo gallery"),st("#galleryButton").title=jt?"Home":"Demo gallery";const e=Pe==="paused";Or.textContent=e?"▷":"Ⅱ",Or.setAttribute("aria-label",e?"Resume":"Pause"),Or.title=e?"Resume (P)":"Pause (P)"}function ip(){if(yn.open||Mn.open||xn||qe||ke)return;const s=Md({state:Pe,held:!!ze.held,wellCount:re.length});s.action==="start"||s.action==="resume"?As():s.action==="release"?ze.release(Mt):s.action==="remove"&&Ms(re[0].id),Eo()}st("#primaryAction").addEventListener("click",ip);function As(){ke||qe||xn||yn.open||Mn.open||(Je=!Je,Je&&ye.stopHeartbeat(),Pe=Je?"paused":"running",Eo(),gh.textContent=Je?"PAUSED":"",lo=performance.now(),fr())}window.addEventListener("keydown",s=>{if(yn.open||Mn.open||xn||s.target instanceof HTMLInputElement||s.target instanceof HTMLTextAreaElement)return;const t=s.key.toLowerCase();if(t===" "&&!qe&&!ke){s.preventDefault(),s.repeat||ip();return}s.repeat||(t==="p"&&Pe!=="ready"&&(s.preventDefault(),As()),t==="r"&&(jt?(Pe==="running"||Pe==="paused")&&Gr("manual"):Ts()),t==="e"&&_E(),t==="1"&&re[0]&&Ms(re[0].id),t==="2"&&re[1]&&Ms(re[1].id))});window.addEventListener("resize",_r);new ResizeObserver(_r).observe(hr);var yd;(yd=window.visualViewport)==null||yd.addEventListener("resize",_r);function sp(s){requestAnimationFrame(sp);const t=Math.min((s-lo)/1e3,.05);if(lo=s,document.hidden){Ks=0;return}if(!Je&&!ke&&!qe){for(Ks+=t;Ks>=Ke;){for(const r of re.filter(o=>Jr(o,se)<=0))Ms(r.id);const n={x:Mt.position.x,y:Mt.position.y},i=pn==="maze"?ch(Mt.position,re,se,Ai,Kt):Va(Mt.position,re,se,Ai);if(Mt.applyForce(new S(i.x*Mt.mass,i.y*Mt.mass,0)),uE(),Ln.step(Ke),Kt.channel&&jS(Mt.position,Mt.velocity,Kt.channel,In),dE(),Mt.position.z=0,Mt.velocity.z=0,pn==="maze"){lh(Mt.velocity,Ot.mechanic==="boost"?16:Ef);const r=ze.step(Mt,n,se,re,Ai,Gr);if(ke)break;if(Fe){const a=Uw(Fe,Ot.soundGates,n,Mt.position,se);Fe=a.state;for(const l of a.acquired)ye.gateAcquire(l);for(const{id:l,beat:c}of a.beats)ye.gateBeat(l,c)}if(r==="teleport"&&(sn&&Eh(Sh[(_i+sn-1)%Vn],n),_i=0,sn=0,ti.setDrawRange(0,0),n.x=Mt.position.x,n.y=Mt.position.y),pe){const a=Dw(pe,{before:n,hero:Mt.position,dt:Ke,time:se,level:Kt});pe=a.state,ze.brightness=pe.energy,fn.minX=Math.min(fn.minX,Mt.position.x),fn.maxX=Math.max(fn.maxX,Mt.position.x),fn.minY=Math.min(fn.minY,Mt.position.y),fn.maxY=Math.max(fn.maxY,Mt.position.y),a.collected&&(ye.stopHeartbeat(),ye.tone(587.33,0,.35,.08));for(const l of a.heartbeat)ye.heartbeat(l.part,l.urgency);if(a.failed){Gr();break}}if(Ge){const a=bw(Ge,{before:n,hero:Mt.position,level:Ot.level,dt:Ke,time:se});Ge=a.state,ze.brightness=Ge.energy,a.collected&&ye.tone(587.33,0,.35,.08),a.gateChanged&&(Dh(Ge.gateOpen),ye.tone(Ge.gateOpen?523.25:196,0,.5,.08))}const o=bf(n,Mt.position,Kt);if((o==null?void 0:o.type)==="spike"){Gr();break}if((o==null?void 0:o.type)==="goal"){lE();break}}se+=Ke,Ks-=Ke}mE(),pn==="maze"&&(st("#runTime").textContent=`${se.toFixed(1)}s`),Hl++,Hl%8===0&&ji(),pn==="sandbox"&&(Math.abs(Mt.position.x)>Qt.right+1.5||Math.abs(Mt.position.y)>Qt.top+1.5)&&(ye.death(),ke=!0,Je=!0,Pe="dead",fr(),vh.classList.remove("hidden"))}_o.position.set(Mt.position.x,Mt.position.y,2),ii.position.set(Mt.position.x,Mt.position.y,1.1);const e=ye.orb(!xn&&!Mn.open&&!yn.open&&!ke&&!qe&&!document.hidden,s/1e3,ze.brightness);Eo(),ii.intensity=85*ze.brightness,_a.material.transparent=!!pe,_a.material.opacity=pe?.08+pe.energy*.92:1,_a.scale.setScalar(1+e*.055),so.scale.setScalar(2.3+e*.25),so.material.opacity=(.83+e*.17)*Math.min(1,ze.brightness),!Je&&!ke&&!qe&&$w(t),pn==="maze"&&Qw(),pn==="maze"&&eE(),si.rotation.z+=t*.35,Rh.material.opacity=.35+Math.sin(s*.002)*.1,ze.updateVisuals(Mt.position,se,ze.brightness,Le.getPixelRatio()),Fe&&oE(),Ot.mechanic==="sound"&&(st("#demoObjective").textContent=`Cross rings to add rhythm · ${ze.layers.size}/3 voices active${ze.layers.size?" · "+["bass","offbeat","chime"].filter((n,i)=>ze.layers.has(i)).join(" + "):" · cyan bass / violet offbeat / gold chime"}`),Df.update(Mt.position,ze.brightness),(Ge||pe)&&(cE(),Qf()),fE(),gE(),Uh(t),vE(),ye.trail(!xn&&!Je&&!ke&&!qe&&!document.hidden,Math.hypot(Mt.velocity.x,Mt.velocity.y),se-ph),(Hl%12===0||Je||ke)&&fr(),Le.render(Oe,Qt)}Qn.visible=!Ot.sandbox;So.visible=!!Ot.sandbox;to.has("demo")?Gc(Ot.id):jt?Ih(_s):(Gc(Ot.id),Ri());requestAnimationFrame(sp);
