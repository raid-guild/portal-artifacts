import{v as Nt}from"./music-BduYVgrR.js";const Sn=(i,e,t,n)=>Object.freeze({id:i,shape:"circle",x:e,y:t,radius:n,halfWidth:0,halfHeight:0}),bn=(i,e,t,n,s)=>Object.freeze({id:i,shape:"rect",x:e,y:t,radius:0,halfWidth:n/2,halfHeight:s/2}),th=Object.freeze([Sn(1,104,91,2.8),Sn(2,65,80,3.2),Sn(3,58,43,2.9),Sn(4,123,68,3.4),Sn(5,147,115,3.1),Sn(6,126,145,3.2),Sn(7,49,138,2.7),Sn(8,32,117,3),Sn(9,88,18,2.8),Sn(10,157,61,2.6)]),nh=Object.freeze([bn(1,104,90,6,1.8),bn(2,67,68,7,2),bn(3,118,63,2,7),bn(4,145,111,7,2),bn(5,114,138,2,7),bn(6,53,116,7,2),bn(7,81,159,2,7),bn(8,158,43,6,1.8),bn(9,35,51,2,7),bn(10,138,158,7,2)]),Sl=i=>i==="desert"?th:i==="ice"?nh:[],li=15,si=12;function ih(i){const e=new Uint16Array(si*si);for(let t=0;t<i.length;t++){const n=i[t],s=n.shape==="circle"?n.radius:n.halfWidth,r=n.shape==="circle"?n.radius:n.halfHeight;for(let a=Math.max(0,Math.floor((n.y-r)/li));a<=Math.min(si-1,Math.floor((n.y+r)/li));a++)for(let o=Math.max(0,Math.floor((n.x-s)/li));o<=Math.min(si-1,Math.floor((n.x+s)/li));o++)e[a*si+o]|=1<<t}return e}const cd=ih(th),hd=ih(nh),ga=()=>({hit:!1,t:1,nx:0,ny:0,id:0}),xs=(i,e,t)=>Math.max(e,Math.min(t,i));function ci(i,e,t,n,s,r,a,o){if(o.hit=!1,o.t=1,o.nx=o.ny=0,o.id=0,i==="training"||i==="forest"||i==="lava"||!n&&!s)return o;const c=Sl(i),l=i==="desert"?cd:hd;let h=0;const d=Math.max(0,Math.floor((Math.min(e,e+n)-r)/li)),f=Math.min(si-1,Math.floor((Math.max(e,e+n)+r)/li)),m=Math.max(0,Math.floor((Math.min(t,t+s)-r)/li)),v=Math.min(si-1,Math.floor((Math.max(t,t+s)+r)/li));for(let x=m;x<=v;x++)for(let g=d;g<=f;g++)h|=l[x*si+g];for(;h;){const x=h&-h,g=31-Math.clz32(x),p=c[g];if(h^=x,p.shape==="circle"&&a)continue;const A=(p.shape==="circle"?p.radius:p.halfWidth)+r,w=(p.shape==="circle"?p.radius:p.halfHeight)+r;if(Math.max(e,e+n)<p.x-A||Math.min(e,e+n)>p.x+A||Math.max(t,t+s)<p.y-w||Math.min(t,t+s)>p.y+w)continue;let M=1/0,E=0,R=0;if(p.shape==="circle"){const C=e-p.x,I=t-p.y,b=p.radius+r,S=n*n+s*s,L=2*(C*n+I*s),u=C*C+I*I-b*b;if(u<=0&&C*n+I*s<0){M=0;const N=Math.hypot(C,I)||1;E=C/N,R=I/N}else{const N=L*L-4*S*u;if(N>=0){const z=(-L-Math.sqrt(N))/(2*S);if(z>=0&&z<=1){M=z;const H=C+n*M,B=I+s*M,Q=Math.hypot(H,B)||1;E=H/Q,R=B/Q}}}}else{const C=p.x-p.halfWidth-r,I=p.x+p.halfWidth+r,b=p.y-p.halfHeight-r,S=p.y+p.halfHeight+r;if(e>C&&e<I&&t>b&&t<S){M=0;const L=e-C,u=I-e,N=t-b,z=S-t,H=Math.min(L,u,N,z);E=H===L?-1:H===u?1:0,R=H===N?-1:H===z?1:0}else{let L=0,u=1,N=0,z=0;if(n===0){if(e<C||e>I)continue}else{const H=n>0?(C-e)/n:(I-e)/n,B=n>0?(I-e)/n:(C-e)/n;H>L&&(L=H,N=n>0?-1:1,z=0),u=Math.min(u,B)}if(s===0){if(t<b||t>S)continue}else{const H=s>0?(b-t)/s:(S-t)/s,B=s>0?(S-t)/s:(b-t)/s;H>L&&(L=H,N=0,z=s>0?-1:1),u=Math.min(u,B)}L<=u&&L>=0&&L<=1&&(N||z)&&(M=L,E=N,R=z)}}(M<o.t||M===1&&!o.hit)&&(o.hit=!0,o.t=M,o.nx=E,o.ny=R,o.id=p.id)}return o}function dd(i,e,t,n,s,r,a,o,c,l){c.x=e,c.y=t,c.hit=!1,c.id=0;for(let h=0;h<(o?3:1);h++){if(ci(i,c.x,c.y,n,s,r,a,l),!l.hit){c.x+=n,c.y+=s;break}const d=Math.max(0,l.t-1e-4);if(c.x+=n*d,c.y+=s*d,c.hit=!0,c.id=l.id,!o)break;n*=1-d,s*=1-d;const f=n*l.nx+s*l.ny;if(f<0&&(n-=f*l.nx,s-=f*l.ny),Math.abs(n)+Math.abs(s)<1e-6)break}return c.x=xs(c.x,1,179),c.y=xs(c.y,1,179),c}function Zi(i,e,t,n,s,r){r.x=xs(e,1,179),r.y=xs(t,1,179),r.hit=!1,r.id=0;for(const a of Sl(i))if(!(a.shape==="circle"&&s))if(a.shape==="circle"){const o=r.x-a.x,c=r.y-a.y,l=a.radius+n+.02,h=Math.hypot(o,c);h<l&&(r.x=a.x+(h?o/h:1)*l,r.y=a.y+(h?c/h:0)*l,r.hit=!0,r.id=a.id)}else{const o=a.halfWidth+n+.02,c=a.halfHeight+n+.02,l=r.x-a.x,h=r.y-a.y;if(Math.abs(l)<o&&Math.abs(h)<c){const d=o-Math.abs(l),f=c-Math.abs(h);d<f?r.x=a.x+(l<0?-o:o):r.y=a.y+(h<0?-c:c),r.hit=!0,r.id=a.id}}return r.x=xs(r.x,1,179),r.y=xs(r.y,1,179),r}function En(i,e,t,n,s,r=0){return i!=="ice"?!0:!ci(i,e,t,n-e,s-t,r,!0,ud).hit}const ud=ga();function Ca(i,e,t,n,s,r,a){const o=i-s,c=e-r,l=t*t+n*n,h=o*o+c*c-a*a;if(h<=0)return 0;if(l===0)return 1/0;const d=2*(o*t+c*n),f=d*d-4*l*h;if(f<0)return 1/0;const m=(-d-Math.sqrt(f))/(2*l);return m>=0&&m<=1?m:1/0}function fd(i,e,t,n){const s=t+1.2;if(i.shape==="circle"){const r=e*Math.PI/2;n.x=i.x+Math.cos(r)*(i.radius+s),n.y=i.y+Math.sin(r)*(i.radius+s)}else n.x=i.x+(e===0||e===3?-1:1)*(i.halfWidth+s),n.y=i.y+(e<2?-1:1)*(i.halfHeight+s);return n.hit=!1,n.id=i.id,n}const Hi="3",pd="2",Mt=Object.freeze(["ranger","wizard","dwarf","warrior","tavern-keeper"]),sh=Object.freeze(["ranger","wizard","dwarf"]),ra=Object.freeze(["vitality","agility","bombRecharge"]),un=Object.freeze({training:Object.freeze({id:"training",name:"Guild Training",milestoneMs:18e4,unlocks:"forest",scoreMultiplier:1}),forest:Object.freeze({id:"forest",name:"Haunted Forest",milestoneMs:3e5,unlocks:"desert",scoreMultiplier:1}),desert:Object.freeze({id:"desert",name:"Desert Oasis",milestoneMs:42e4,unlocks:"ice",scoreMultiplier:1}),ice:Object.freeze({id:"ice",name:"Frozen Highlands",milestoneMs:54e4,unlocks:"lava",scoreMultiplier:1}),lava:Object.freeze({id:"lava",name:"Molten Vault",milestoneMs:72e4,unlocks:null,scoreMultiplier:1})}),Hs=(i,e)=>Object.freeze(e.map(t=>Object.freeze({checkpointId:`${i}-${t}`,thresholdMs:t*1e3}))),di=Object.freeze({training:Hs("training",[180,300,420,540,720]),forest:Hs("forest",[300,420,540,720]),desert:Hs("desert",[420,540,720]),ice:Hs("ice",[540,720]),lava:Hs("lava",[720])}),Pa=Object.freeze([Object.freeze({atSeconds:300,desiredAlive:1,tier:1,maxAdmitted:1}),Object.freeze({atSeconds:480,desiredAlive:2,tier:2,maxAdmitted:3}),Object.freeze({atSeconds:600,desiredAlive:2,tier:2,maxAdmitted:5}),Object.freeze({atSeconds:660,desiredAlive:3,tier:3,maxAdmitted:8})]);function md(i){if(!Number.isFinite(i)||i<300)return{wave:0,desiredAlive:0,tier:0,maxAdmitted:0};if(i>=780){const n=1+Math.floor((i-780)/120);return{wave:4+n,desiredAlive:3,tier:3,maxAdmitted:8+n*3}}let e=0;for(let n=0;n<Pa.length;n++)i>=Pa[n].atSeconds&&(e=n+1);const t=Pa[e-1];return{wave:e,desiredAlive:t.desiredAlive,tier:t.tier,maxAdmitted:t.maxAdmitted}}const zt=(i,e,t,n)=>Object.freeze({id:i,name:e,description:t,cost:3,effect:Object.freeze(n)}),va=Object.freeze({ranger:Object.freeze([zt("ranger-thorn-precision","Thorn Precision","Thornbow deals 15% more beyond 6 units.",{primaryDamageMultiplier:1.15,primaryDamageCondition:"range>6"}),zt("ranger-scout-dash","Scout Dash","Dashing pulls loot farther for 2 seconds.",{dashMagnetSeconds:2,pickupMagnetBonus:1.5}),zt("ranger-focused-barrage","Focused Barrage","Narrower bomb wave with 45% more damage.",{bombDamageMultiplier:1.45,bombRadiusMultiplier:.7})]),wizard:Object.freeze([zt("wizard-arc-focus","Arc Focus","Arc Wand deals 15% more to elites and bosses.",{primaryDamageMultiplier:1.15,primaryDamageCondition:"elite-or-boss"}),zt("wizard-flux-core","Flux Core","Bombing grants 15% speed for 2 seconds.",{bombSpeedSeconds:2,bombSpeedMultiplier:1.15}),zt("wizard-wide-nova","Wide Nova","Broader nova with 30% less damage.",{bombRadiusMultiplier:1.4,bombDamageMultiplier:.7})]),dwarf:Object.freeze([zt("dwarf-scatter-mastery","Rune Mastery","Rune Axes deal 15% more inside 3 units.",{primaryDamageMultiplier:1.15,primaryDamageCondition:"range<3"}),zt("dwarf-iron-guard","Iron Guard","Bombing reduces damage taken for 2 seconds.",{bombGuardSeconds:2,damageTakenMultiplier:.65}),zt("dwarf-quake-drive","Quake Drive","Stronger bomb knockback with 25% less damage.",{bombKnockbackMultiplier:1.6,bombDamageMultiplier:.75})]),warrior:Object.freeze([zt("warrior-blade-mastery","Blade Mastery","Cleaver deals 15% more above 75% health.",{primaryDamageMultiplier:1.15,primaryDamageCondition:"hp>75%"}),zt("warrior-dash-guard","Dash Guard","Dashing reduces damage taken for 1.5 seconds.",{dashGuardSeconds:1.5,damageTakenMultiplier:.65}),zt("warrior-directional-shockwave","Directional Shockwave","Focused forward bomb wave with greater reach and damage.",{bombArcDegrees:105,bombRadiusMultiplier:1.5,bombDamageMultiplier:1.25})]),"tavern-keeper":Object.freeze([zt("tavern-fire-mastery","Fire Mastery","Tankard deals 15% more below half health.",{primaryDamageMultiplier:1.15,primaryDamageCondition:"hp<50%"}),zt("tavern-hearty-meal","Hearty Meal","Food restores 50% more health.",{foodHealMultiplier:1.5}),zt("tavern-healing-bomb","Healing Bomb","Bomb heals up to 25 health with reduced damage.",{bombHeal:25,bombDamageMultiplier:.65})])}),nr=(i,e)=>va[i]?.find(t=>t.id===e)??null;function rh(i){return i>=900?3.8:i>=840?1.6+(i-840)/60*2.2:i>=780?.95+(i-780)/60*.65:.55+Math.max(0,i-720)/60*.4}function gd(i){return i>=660?{interval:2.4,markDamage:80}:i>=600?{interval:2.6,markDamage:75}:i>=540?{interval:2.8,markDamage:75}:{interval:3.2,markDamage:22}}const vd=(i,e="training")=>{const t=Math.hypot(i.targetX-i.x,i.targetY-i.y)||1,n=i.special==="juggernaut"?7.7:4.2,s=(i.targetX-i.x)/t*n,r=(i.targetY-i.y)/t*n,a=ga();ci(e,i.x,i.y,s,r,i.radius,_s(i.kind),a);const o=a.hit?Math.max(0,a.t-1e-4):1;return{x1:i.x,y1:i.y,x2:kt(i.x+s*o,1,De-1),y2:kt(i.y+r*o,1,De-1),radius:i.radius+.55}},Wl=(i,e,t,n,s,r,a)=>{const o=s-t,c=r-n,l=o*o+c*c,h=l?kt(((i-t)*o+(e-n)*c)/l,0,1):0;return(i-t-o*h)**2+(e-n-c*h)**2<a**2},An={ranger:{name:"Ranger",role:"THE THORNBOW",weapon:"thornbow",health:100,speed:8.2,color:8640155,copy:"Rapid piercing arrows. Fast feet and a steady aim."},wizard:{name:"Wizard",role:"THE ARC WAND",weapon:"arcwand",health:85,speed:7.7,color:10851839,copy:"Volatile bolts bloom into arcane shockwaves."},dwarf:{name:"Dwarf",role:"THE RUNE AXES",weapon:"runeaxes",health:135,speed:6.8,color:16759667,copy:"Curving runic axes carve a path through the crowd. Sturdy as the mountain."},warrior:{name:"Warrior",role:"THE GUILD CLEAVER",weapon:"cleaver",health:120,speed:7.1,color:16749690,copy:"Broad steel sweeps a path through the horde."},"tavern-keeper":{name:"Tavern Keeper",role:"THE FLYING TANKARD",weapon:"tankard",health:110,speed:7.3,color:16766082,copy:"Flying tankards splash the crowd. Last call restores courage."}},Rt={thornbow:{name:"Thornbow",icon:"➶",desc:"Piercing arrows split at higher ranks",color:9435312,cooldown:.27},arcwand:{name:"Arc Wand",icon:"✧",desc:"Arcane bolts detonate on impact",color:11510015,cooldown:.44},scattergun:{name:"Runic Scattergun",icon:"✷",desc:"A brutal cone of rune shot",color:16761469,cooldown:.62},runeaxes:{name:"Rune Axes",icon:"⚒",desc:"Three curving axes fly in a tightening formation",color:16765309,cooldown:.84},chain:{name:"Storm Coil",icon:"ϟ",desc:"Lightning leaps between nearby foes",color:8968447,cooldown:1.2},orbit:{name:"Halo Blades",icon:"◈",desc:"Orbiting steel carves a safe path",color:16767374,cooldown:.19},comet:{name:"Falling Star",icon:"☄",desc:"Call down a blazing meteor",color:16748402,cooldown:2.1},cleaver:{name:"Guild Cleaver",icon:"⚔",desc:"A broad close-range sweep",color:16753533,cooldown:.7},tankard:{name:"Flying Tankard",icon:"☷",desc:"Throw a tankard that splashes on impact",color:16767109,cooldown:.74}},De=180,on=2400,La=["rageipede","xorn","efreeti","deathwisp","buraq","chuul","dogmole","tosculi","seahag","hezrou"],_d=650,Ia=900,xd=360,Xl=12,Md=280,ql=16,rn=(i,e)=>i+Math.random()*(e-i),kt=(i,e,t)=>Math.max(e,Math.min(t,i)),Xt=(i,e)=>(i.x-e.x)**2+(i.y-e.y)**2,_s=i=>i==="wisp"||i==="buraq"||i==="efreeti",xo=i=>({target:Math.min(on,30+Math.floor(i*1.4)),interval:.5-.34*kt(i/300,0,1),batch:i<120?1:i<240?2:3,xornChance:i<120?0:i<180?.02:i<240?.03:.04,xornCap:i<120?0:i<180?2:i<240?4:6,efreetiChance:i<210?0:.01,efreetiCap:i<210?0:i<270?1:i<300?2:3,lunges:i<90?0:i<180?1:i<300?2:3,bossWave:i<240?0:1+Math.floor((i-240)/120)}),yd=(i,e)=>{const t=xo(e*(i==="desert"?.7142857142857143:i==="ice"?.5555555555555556:i==="lava"?.4166666666666667:1));if(i!=="desert"&&i!=="ice"&&i!=="lava")return t;const n=e<60?36+e*.4:e<180?60:Math.max(0,60*(360-e)/180),s=.65+.35*kt((e-180)/180,0,1);return{...t,target:Math.min(on,t.target+Math.round(n)+(i==="lava"?12:0)),interval:t.interval*(i==="lava"?.59:s),batch:e>=30?Math.max(2,t.batch):t.batch}},zn=i=>i==="desert"||i==="ice"||i==="lava",$l=(i,e)=>zn(i)?e*(i==="desert"?300/420:i==="ice"?300/540:300/720):e,Sd=i=>i==="desert"?"buraq":i==="ice"?"dogmole":"hezrou",br=i=>i==="ice"?"chuul":i==="lava"?"tosculi":"deathwisp";class bd{hero;level;obstacles;mastery;config;target;perk;get checkpointReached(){return!!this.target&&this.elapsed*1e3>=this.target.thresholdMs}runes={light:!1,freeze:!1,flames:!1};forestBlessingOffered=!1;monsters=Object.fromEntries(La.map(e=>[e,{encountered:0,kills:0,counterKills:0}]));player;enemies=[];projectiles=[];enemyShots=[];strikes=[];pickups=[];effects=[];hazards=[];weapons={};slots=[];backpack=[];passives={damage:0,speed:0,magnet:0,vitality:0,cooldown:0};stats={kills:0,elites:0,bosses:0,chests:0,level:1};score=0;survivalClock=0;elapsed=0;xp=0;xpNeeded=14;gold=0;combo=0;comboTime=0;spawnClock=0;chestClock=0;nextShooterScan=20;lastShooterAt=-1/0;nextForestLungeAt=0;lastChestTime=-45;bombCharge=45;bombRanks={radius:0,damage:0,recharge:0};bombWave=null;facing=1;bossWave=0;finalBossSpawned=!1;lavaBossEvent=0;lavaBossAdmitted=0;nextLavaBossAt=0;nextEliteEscalation=540;escortDebt=0;nextId=1;dead=!1;deathReason=null;deathProgress=0;deathFacing=1;deathFiring=!1;killedByNightman=!1;cleared=!1;endless=!1;nightman=null;paused=!1;awaitingReward=!1;rankable=!0;aim={x:1,y:0};move={x:0,y:0};firing=!1;cooldowns={};onReward=null;onEvent=null;gridWidth=Math.ceil(De/5);gridHead=new Int32Array(this.gridWidth*this.gridWidth).fill(-1);gridNext=new Int32Array(on);collisionHit=ga();moveResult={x:0,y:0,hit:!1,id:0};waypointResult={x:0,y:0,hit:!1,id:0};navDirection={x:0,y:0};projectileCandidates=[];projectileCandidatePool=[];orbitHits=new Map;orbitPulse=0;perkMagnet=0;perkSpeed=0;perkGuard=0;shrines=[[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]].map(([e,t],n)=>({id:n,x:e,y:t,active:!0}));constructor(e,t="training",n={vitality:0,agility:0,bombRecharge:0}){const s="skills"in n?n:null;if(s&&(s.character!==e||s.level!==t||s.version!==Hi))throw new Error("Run snapshot does not match selected hero, level, or version");const r=s?s.skills:n,a=s?.equippedPerk?va[e].find(l=>l.id===s.equippedPerk):null;if(s?.equippedPerk&&!a)throw new Error("Invalid equipped perk for hero");this.config=Object.freeze({version:Hi,character:e,level:t,skills:Object.freeze({...r}),equippedPerk:a?.id??null,target:s?.target?Object.freeze({...s.target}):null}),this.target=this.config.target,this.perk=a?.effect??null,this.hero=e,this.level=t,this.obstacles=Sl(t),this.mastery={...r};const o=An[e],c=Math.round(o.health*(1+.05*r.vitality));this.player={x:De/2,y:De/2,health:c,maxHealth:c,invuln:0,dash:0,dashCooldown:0,speed:o.speed*(1+.03*r.agility)},this.weapons[o.weapon]=1,this.slots.push(o.weapon);for(let l=0;l<(t==="training"?18:zn(t)?32:12);l++)this.spawnEnemy(t==="forest"?"rageipede":t==="lava"&&l%8===0?"cultist":zn(t)?br(t):void 0);this.buildGrid()}die(e="combat"){return this.dead?!1:(this.dead=!0,this.deathReason=e,this.deathFacing=this.facing,this.deathFiring=this.firing,this.player.health=0,this.move.x=this.move.y=0,this.firing=!1,this.hazards.length=0,e==="combat"&&this.onEvent?.("death"),!0)}continueEndless(e){if(this.dead||this.awaitingReward||this.endless||!this.cleared||!this.paused||this.elapsed<720)return!1;const t=this.player,n=1,s=Math.max(t.x+30,(e?.right??-1/0)+n+2);return this.nightman={x:s,y:t.y,radius:n,warningRemaining:2.5},this.endless=!0,this.cleared=!1,this.paused=!1,this.onEvent?.("nightman"),!0}updateNightman(e,t,n){const s=this.nightman;if(!s)return;if(s.warningRemaining>0){s.warningRemaining=s.warningRemaining<=e+1e-9?0:s.warningRemaining-e;return}const r=this.player,a=s.x,o=s.y,c=r.x-a,l=r.y-o,h=Math.hypot(c,l)||1,f=r.speed*(1+this.passives.speed*.1)*(this.perk?.bombSpeedMultiplier??1)*rh(this.elapsed)*e;s.x=a+c/h*f,s.y=o+l/h*f;const m=s.x-a-(r.x-t),v=s.y-o-(r.y-n);Ca(a-t,o-n,m,v,0,0,s.radius+.55)<=1&&(this.killedByNightman=!0,this.die("combat"))}effect(e){this.effects.length<xd&&this.effects.push(e)}buildGrid(){this.gridHead.fill(-1);for(let e=0;e<this.enemies.length;e++){const t=this.enemies[e],n=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.x/5))),r=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.y/5)))*this.gridWidth+n;this.gridNext[e]=this.gridHead[r],this.gridHead[r]=e}}moveTerrain(e,t,n,s,r,a,o=!0){return dd(this.level,e,t,n,s,r,a,o,this.moveResult,this.collisionHit)}safeTerrain(e,t,n){return Zi(this.level,e,t,n,!1,this.moveResult)}scheduleShooters(e){if(this.elapsed<this.nextShooterScan)return;this.nextShooterScan=Math.floor(this.elapsed)+1;const t=this.level==="lava"?this.elapsed<60?4:this.elapsed<90?5:this.elapsed<150?6:this.elapsed<240?7:9:this.level==="training"?this.elapsed<30?0:this.elapsed<60?1:this.elapsed<90?2:this.elapsed<150?3:this.elapsed<240?4:6:this.level==="forest"?this.elapsed<30?0:this.elapsed<60?1:this.elapsed<90?2:this.elapsed<150?3:this.elapsed<240?4:6:this.elapsed<20?0:this.elapsed<45?1:this.elapsed<90?2:this.elapsed<150?3:this.elapsed<240?4:6;if(this.elapsed-this.lastShooterAt<8)return;let n=0;for(const s of this.enemies)s.hp>0&&s.kind==="cultist"&&!s.elite&&n++;if(!(n>=t)){if(this.enemies.length>=e||this.enemies.length>=on){const s=this.level==="training"?"rat":this.level==="forest"?"rageipede":br(this.level);let r=-1,a=324;for(let o=0;o<this.enemies.length;o++){const c=this.enemies[o];if(c.hp<=0||c.elite||c.specialState!=="idle"||c.kind!==s&&c.kind!=="wisp")continue;const l=Xt(c,this.player);l>a&&(a=l,r=o)}if(r<0)return;this.enemies.splice(r,1)}this.spawnEnemy("cultist",!1)&&(this.lastShooterAt=this.elapsed)}}navigate(e,t,n,s){const r=this.navDirection;if(r.x=t,r.y=n,!this.obstacles.length)return r;e.navTime=Math.max(0,e.navTime-s);const a=_s(e.kind),o=this.player;if(e.navId&&e.navTime>0){const v=e.navX-e.x,x=e.navY-e.y,g=Math.hypot(v,x);if(g>.7)return r.x=v/g,r.y=x/g,r}let c=!1;for(const v of this.obstacles){if(a&&v.shape==="circle")continue;const x=v.shape==="circle"?v.radius:Math.max(v.halfWidth,v.halfHeight);if(Math.abs(e.x-v.x)<x+7&&Math.abs(e.y-v.y)<x+7){c=!0;break}}if(!c||(ci(this.level,e.x,e.y,o.x-e.x,o.y-e.y,e.radius,a,this.collisionHit),!this.collisionHit.hit))return e.navId=0,r;const l=this.obstacles[this.collisionHit.id-1];if(!l)return r;const h=Math.hypot(e.navX-e.x,e.navY-e.y)<.7;if(e.navId!==l.id||e.navTime===0||h){let v=1/0,x=-1,g=e.x,p=e.y;for(let A=0;A<4;A++){const w=fd(l,A,e.radius,this.waypointResult);if(ci(this.level,e.x,e.y,w.x-e.x,w.y-e.y,e.radius,a,this.collisionHit),this.collisionHit.hit&&this.collisionHit.t<.98)continue;const M=Math.hypot(w.x-e.x,w.y-e.y)+Math.hypot(o.x-w.x,o.y-w.y)+(e.navId===l.id&&e.navSide!==A?2:0)+(e.navId===l.id&&h&&e.navSide===A?12:0);M<v&&(v=M,x=A,g=w.x,p=w.y)}x>=0&&(e.navId=l.id,e.navSide=x,e.navX=g,e.navY=p,e.navTime=.25)}if(!e.navId)return r;const d=e.navX-e.x,f=e.navY-e.y,m=Math.hypot(d,f)||1;return r.x=d/m,r.y=f/m,r}forNearby(e,t,n,s){const r=Math.max(0,Math.floor((e-n)/5)),a=Math.min(this.gridWidth-1,Math.floor((e+n)/5)),o=Math.max(0,Math.floor((t-n)/5)),c=Math.min(this.gridWidth-1,Math.floor((t+n)/5));for(let l=o;l<=c;l++)for(let h=r;h<=a;h++)for(let d=this.gridHead[l*this.gridWidth+h];d!==-1;d=this.gridNext[d])if(s(this.enemies[d]))return}nearest(e,t,n,s,r=!1){let a,o=n*n;return this.forNearby(e,t,n,c=>{const l=(c.x-e)**2+(c.y-t)**2;c.hp>0&&l<o&&!s?.has(c.id)&&(r||En(this.level,e,t,c.x,c.y))&&(a=c,o=l)}),a}spawnEnemy(e,t=!1,n){if(this.enemies.length>=on)return;const s=$l(this.level,this.elapsed),r=s/60;let a;if(e)a=e;else if(this.level==="forest"){const E=xo(this.elapsed),R=Math.random(),C=this.elapsed<60?.05:.1,I=this.elapsed<60?0:.05;a=R<E.efreetiChance?"efreeti":R<E.efreetiChance+E.xornChance?"xorn":R<E.efreetiChance+E.xornChance+C?"wisp":R<E.efreetiChance+E.xornChance+C+I?"brute":"rageipede",(a==="xorn"||a==="efreeti")&&this.enemies.reduce((b,S)=>b+ +(S.hp>0&&S.kind===a),0)>=(a==="xorn"?E.xornCap:E.efreetiCap)&&(a="rageipede"),t=t&&this.elapsed>=120&&(a==="rageipede"||a==="brute")}else if(this.level==="lava"){const E=Math.random(),R=this.elapsed<180?2:this.elapsed<360?4:6,C=this.elapsed<360?1:this.elapsed<540?2:3,I=this.elapsed>=45&&this.enemies.reduce((S,L)=>S+ +(L.hp>0&&L.kind==="seahag"),0)<R?.045:0,b=this.elapsed>=180&&this.enemies.reduce((S,L)=>S+ +(L.hp>0&&L.kind==="hezrou"),0)<C?.015:0;a=E<b?"hezrou":E<b+I?"seahag":E<b+I+.07?"wisp":E<b+I+.17?"brute":E<b+I+.23?"cultist":"tosculi",t=t&&s>=120&&(a==="tosculi"||a==="brute")}else if(zn(this.level)){const E=Math.random(),R=Sd(this.level),C=br(this.level),I=s<240?1:s<300?2:3,b=s>=180&&this.enemies.reduce((S,L)=>S+ +(L.hp>0&&L.kind===R),0)<I?.02:0;a=E<b?R:E<b+(s<60?.05:.1)?"wisp":E<b+(s<60?.05:.15)?"brute":C,t=t&&s>=120&&(a===C||a==="brute")}else a=Math.random()<Math.min(.08+r*.04,.25)?"brute":Math.random()<.18?"wisp":"rat";if(a==="boss"&&this.enemies.filter(E=>E.kind==="boss"&&E.hp>0).length>=ql)return;const o=rn(0,Math.PI*2),c=rn(21,30);let l=kt(this.player.x+Math.cos(o)*c,2,De-2),h=kt(this.player.y+Math.sin(o)*c,2,De-2);const d={rat:[15,3.2,8,.44],cultist:[25,2.5,10,.55],brute:[60,1.65,17,.85],wisp:[17,4,7,.4],boss:[1050,1.6,27,2.2],rageipede:[18,3.4,9,.48],xorn:[210,2.3,21,1.25],efreeti:[520,2.1,18,1.55],deathwisp:[18,3.4,9,.48],buraq:[360,1.8,16,1.4],chuul:[20,3.1,8,.5],dogmole:[380,1.8,17,1.4],tosculi:[13,4.1,7,.36],seahag:[100,2.1,11,.7],hezrou:[360,1.55,18,1.2]}[a],f=1+Math.min(4,r*.27),m=n??(zn(this.level)&&a==="boss"?this.bossWave<2?1:this.bossWave<4?2:3:a!=="boss"||this.elapsed<360?1:this.elapsed<540?2:3),v=a==="rageipede"||a==="deathwisp"?"pouncer":a==="xorn"?"stalker":a==="efreeti"?"devourer":a==="chuul"?"jaunt":a==="dogmole"?"groundbreaker":a==="buraq"?"poisonfan":a==="seahag"?"seahagfan":a==="hezrou"?"hezroulane":t&&a==="brute"&&(this.level!=="training"||this.elapsed>=120)?"juggernaut":t&&a==="cultist"&&this.elapsed>=180?"hexcaster":null,x=v==="juggernaut"?this.level==="training"?6:1+5*kt((s-180)/120,0,1):v==="hexcaster"?7:1,g=d[0]*f*(t?3:1)*x*(a==="boss"?m===2?1.35:m===3?1.65:1:1),p=a==="boss"||this.level==="lava"&&["tosculi","seahag","hezrou"].includes(a)?1:this.level!=="training"?.65+.35*kt(s/180,0,1):.85+.15*kt(this.elapsed/60,0,1),A=d[3]*(t?1.35:1),w=Zi(this.level,l,h,A,_s(a),this.moveResult);l=w.x,h=w.y;const M={id:this.nextId++,x:l,y:h,hp:g,maxHp:g,speed:a==="boss"&&m>1?m===2?1.9:2.1:d[1],damage:d[2]*p,openingScale:p,radius:A,kind:a,elite:t,special:v,specialState:"idle",specialTimer:0,specialCd:v?1:0,targetX:l,targetY:h,chargeX:0,chargeY:0,chargeHit:!1,tier:m,bossCastTimer:0,flash:0,phase:rn(0,6.28),attackCd:a==="boss"?1.5:rn(1.4,3),windup:0,facing:this.player.x<l?-1:1,knockX:0,knockY:0,attackPhase:0,frozen:0,freezeImmune:0,observed:!1,navX:l,navY:h,navId:0,navSide:0,navTime:0};return this.enemies.push(M),M}dash(){this.player.dashCooldown>0||this.dead||this.paused||this.awaitingReward||(this.player.dash=.2,this.player.invuln=.36,this.player.dashCooldown=3.5,this.perk?.dashMagnetSeconds&&(this.perkMagnet=this.perk.dashMagnetSeconds),this.perk?.dashGuardSeconds&&(this.perkGuard=this.perk.dashGuardSeconds),this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.35,max:.35,color:10092498,size:2}),this.onEvent?.("dash"))}get bombRecharge(){return 45*Math.pow(.88,this.bombRanks.recharge)*(1-.05*this.mastery.bombRecharge)}get bombRadius(){return 7*(1+this.bombRanks.radius*.12)*(this.perk?.bombRadiusMultiplier??1)}bomb(){if(this.bombCharge<this.bombRecharge||this.dead||this.paused||this.awaitingReward)return!1;this.bombCharge=0,this.bombWave={age:0,radius:0,previousRadius:0,hit:new Set,chained:new Set,aimX:this.aim.x,aimY:this.aim.y},this.perk?.bombSpeedSeconds&&(this.perkSpeed=this.perk.bombSpeedSeconds),this.perk?.bombGuardSeconds&&(this.perkGuard=this.perk.bombGuardSeconds);const e=this.perk?.bombHeal??(this.hero==="tavern-keeper"?8:0);if(e){const t=Math.min(e,this.player.maxHealth-this.player.health);this.player.health+=t,t>0&&this.onEvent?.("heal")}return this.onEvent?.("bomb"),!0}updateBomb(e){if(!this.bombWave)return;const t=this.bombWave;t.age+=e,t.previousRadius=t.radius,t.radius=this.bombRadius*Math.min(1,t.age/.6);const n=this.player,s={ranger:48,wizard:54,dwarf:66,warrior:60,"tavern-keeper":46}[this.hero]*(1+this.bombRanks.damage*.25)*(this.perk?.bombDamageMultiplier??1);if(this.forNearby(n.x,n.y,t.radius+3,r=>{if(r.hp<=0||t.hit.has(r.id))return;const a=Math.sqrt(Xt(r,n));if(!(a>t.radius+r.radius||a<t.previousRadius-r.radius)){if(this.perk?.bombArcDegrees){const o=Math.atan2(t.aimY,t.aimX),c=Math.atan2(r.y-n.y,r.x-n.x);if(Math.abs(Math.atan2(Math.sin(c-o),Math.cos(c-o)))>this.perk.bombArcDegrees*Math.PI/360)return}if(t.hit.add(r.id),this.damage(r,s*(t.chained.has(r.id)?.55:1),"bomb"),(this.hero==="dwarf"||this.hero==="warrior")&&r.kind!=="boss"){const o=(this.hero==="warrior"?9:6)*(this.perk?.bombKnockbackMultiplier??1)/(a||1);r.knockX=(r.x-n.x)*o,r.knockY=(r.y-n.y)*o}if(this.hero==="wizard"){let o=0;this.forNearby(r.x,r.y,3.5,c=>{if(o>=2)return!0;c.hp<=0||t.hit.has(c.id)||t.chained.has(c.id)||Xt(r,c)>3.5**2||(t.chained.add(c.id),o++,this.damage(c,s*.45,"bomb"),this.effect({x:r.x,y:r.y,x2:c.x,y2:c.y,kind:"zap",life:.22,max:.22,color:10479615,size:.3}))})}}}),this.hero==="ranger"&&t.previousRadius<2&&t.radius>=2)for(let r=0;r<24;r++)this.projectile(n.x,n.y,r*Math.PI/12,25,s*.35,"thornbow",.21,3,.65,!1,!0);t.age>=.6&&(this.bombWave=null)}damage(e,t,n){if(e.hp<=0)return;if(n===An[this.hero].weapon&&this.perk?.primaryDamageMultiplier){const o=Math.sqrt(Xt(e,this.player)),c=this.perk.primaryDamageCondition;(c==="range>6"&&o>6||c==="elite-or-boss"&&(e.elite||e.kind==="boss")||c==="range<3"&&o<3||c==="hp>75%"&&this.player.health>this.player.maxHealth*.75||c==="hp<50%"&&this.player.health<this.player.maxHealth*.5)&&(t*=this.perk.primaryDamageMultiplier)}const s=(e.kind==="rageipede"||e.kind==="deathwisp"||e.kind==="hezrou")&&this.runes.light||(e.kind==="xorn"||e.kind==="efreeti"||e.kind==="tosculi"||e.kind==="seahag")&&this.runes.freeze||e.kind==="chuul"&&this.runes.flames||e.kind==="buraq"&&n==="bomb"||e.kind==="dogmole"&&["thornbow","scattergun","runeaxes","orbit","cleaver","bomb"].includes(n);if(e.special==="devourer"&&e.specialState==="charge"&&!this.runes.freeze&&["arcwand","chain","comet"].includes(n)){this.effect({x:e.x,y:e.y,kind:"ring",life:.2,max:.2,color:9230847,size:e.radius*1.5});return}if(s&&["xorn","efreeti","tosculi","seahag"].includes(e.kind)&&e.freezeImmune<=0&&(e.frozen=.5,e.freezeImmune=3,(e.specialState==="windup"||e.specialState==="charge")&&(e.specialState="recovery",e.specialTimer=Math.max(e.specialTimer,.5))),e.hp-=t*(1+this.passives.damage*.18)*(s?1.25:1),e.flash=.12,e.hp>0){Math.random()<.28&&this.effect({x:e.x,y:e.y,kind:"hit",life:.16,max:.16,color:n==="bomb"?16766878:Rt[n].color,size:.7});return}if(this.hazards=this.hazards.filter(o=>o.sourceId!==e.id),this.stats.kills++,La.includes(e.kind)){const o=e.kind;e.observed||(e.observed=!0,this.monsters[o].encountered++),this.monsters[o].kills++,s&&this.monsters[o].counterKills++}e.elite&&this.stats.elites++,e.kind==="boss"&&(this.stats.bosses++,this.onEvent?.("bossDead")),this.combo++,this.comboTime=3,this.score+=e.kind==="boss"?600:e.elite?75:10;const r=e.kind==="boss"?22:e.elite?5:1;for(let o=0;o<r&&this.pickups.length<Ia;o++){const c=Zi(this.level,e.x+rn(-1,1),e.y+rn(-1,1),.65,!1,this.moveResult);this.pickups.push({x:c.x,y:c.y,kind:"xp",value:e.kind==="boss"?4:e.elite?3:1,life:25})}const a=e.elite?e.kind==="brute"?.45:.3:e.kind==="brute"?.08:0;if(e.kind==="boss"||a>0&&this.elapsed-this.lastChestTime>=45&&!this.pickups.some(o=>o.kind==="chest")&&Math.random()<a){const o=Zi(this.level,e.x,e.y,.8,!1,this.moveResult),c={x:o.x,y:o.y,kind:"chest",value:1,life:45};if(this.pickups.length<Ia)this.pickups.push(c);else{const l=this.pickups.findIndex(h=>h.kind==="xp");l>=0&&(this.pickups[l]=c)}this.lastChestTime=this.elapsed}else if(this.pickups.length<Ia&&Math.random()<.018){const o=Zi(this.level,e.x,e.y,.65,!1,this.moveResult);this.pickups.push({x:o.x,y:o.y,kind:"heart",value:18,life:25})}this.effect({x:e.x,y:e.y,kind:"burst",life:.45,max:.45,color:e.kind==="boss"?16762730:16743066,size:e.radius*2.5}),this.onEvent?.("kill")}projectile(e,t,n,s,r,a,o=.26,c=0,l=1.6,h=!1,d=!1){this.projectiles.length>=_d||this.projectiles.push({x:e,y:t,vx:Math.cos(n)*s,vy:Math.sin(n)*s,damage:r,kind:a,radius:o,pierce:c,life:l,chain:0,hit:new Set,thornBurstPending:h,bombFragment:d})}fireWeapon(e){const t=this.weapons[e]||1,n=this.player;let s=Math.atan2(this.aim.y,this.aim.x);if(!this.firing&&e!=="orbit"){const r=this.nearest(n.x,n.y,17,void 0,e==="comet");if(!r)return;s=Math.atan2(r.y-n.y,r.x-n.x)}if(e==="thornbow"){const r=t>=5?5:t>=4?3:t>=2?2:1,a=t>=5?32:t===4?30:12+t*5;for(let o=0;o<r;o++)this.projectile(n.x,n.y,s+(o-(r-1)/2)*.13,24,a,e,.18,Math.floor(t/2),1.4,t>=5)}else if(e==="arcwand")this.projectile(n.x,n.y,s,15,16+t*8,e,.38+t*.04,0,1.5);else if(e==="scattergun"){const r=5+t*2;for(let a=0;a<r;a++)this.projectile(n.x,n.y,s+(a-(r-1)/2)*.12+rn(-.025,.025),rn(15,19),6+t*2.5,e,.17,0,.48);if(t>=5){for(let a=0;a<12;a++)this.projectile(n.x,n.y,a*Math.PI/6,15,9,e,.2,0,.42);this.effect({x:n.x,y:n.y,kind:"ring",life:.36,max:.36,color:16761469,size:4})}}else if(e==="runeaxes"){const r=t>=5?5:3,a=.64+t*.04,o=21+t*3;for(let c=0;c<r;c++){const l=t>=5?(c-2)*.16:(c-1)*.24,h=this.projectiles.length;if(this.projectile(n.x,n.y,s+l,13,o,e,.29,t>=3?1:0,a),this.projectiles.length>h){const d=this.projectiles[h];d.turnRate=-2*l/a,d.runeGold=t>=5}}}else if(e==="cleaver"){const r=2.5+t*.32,a=(95+t*5)*Math.PI/180,o=[];if(this.forNearby(n.x,n.y,r+3,c=>{if(c.hp<=0||Xt(c,n)>(r+c.radius)**2||!En(this.level,n.x,n.y,c.x,c.y))return;const l=Math.atan2(c.y-n.y,c.x-n.x);Math.abs(Math.atan2(Math.sin(l-s),Math.cos(l-s)))>a/2||(this.damage(c,20+t*8,e),t>=5&&o.length<3&&o.push(c))}),t>=5){let c=0;for(const l of o){if(c>=3)break;l.hp>0&&(this.damage(l,18,e),c++)}}this.effect({x:n.x,y:n.y,kind:"slash",angle:s,arc:a,life:.19,max:.19,color:Rt.cleaver.color,size:r})}else if(e==="tankard")this.projectile(n.x,n.y,s,16,20+t*7,e,.34,0,1.3);else if(e==="chain"){const r=this.nearest(n.x,n.y,16);if(r){let a=n;const o=new Set,c=new Set;let l=r;for(let h=0;h<2+t&&l;h++)o.add(l.id),this.effect({x:a.x,y:a.y,x2:l.x,y2:l.y,kind:"zap",life:.22,max:.22,color:9297919,size:.2}),this.damage(l,15+t*7,e),t>=5&&(this.forNearby(l.x,l.y,2.4,d=>{d.hp>0&&d.id!==l.id&&!c.has(d.id)&&Xt(d,l)<2.4**2&&En(this.level,l.x,l.y,d.x,d.y)&&(c.add(d.id),this.damage(d,15,e))}),this.effect({x:l.x,y:l.y,kind:"ring",life:.24,max:.24,color:11924479,size:2.4})),a=l,l=this.nearest(a.x,a.y,6+t,o)}}else if(e==="comet"){const r=this.nearest(n.x,n.y,18,void 0,!0),a=r?.x??n.x+Math.cos(s)*7,o=r?.y??n.y+Math.sin(s)*7;(t>=5?[[a,o],[a+rn(-3,3),o+rn(-3,3)],[a+rn(-3,3),o+rn(-3,3)]]:[[a,o]]).forEach(([l,h],d)=>{const f=2.5+t*.5;this.strikes.push({x:l,y:h,delay:.5+d*.18,radius:f,damage:38+t*22,source:"comet"}),this.effect({x:l,y:h,kind:"comet",life:.5+d*.18,max:.5+d*.18,color:16749934,size:f})})}e!=="orbit"&&this.onEvent?.("shoot")}updateWeapons(e){for(const t of this.slots){const n=this.weapons[t]||1;if(t==="orbit"){const r=2+n;for(let a=0;a<r;a++){const o=this.elapsed*(2.7+n*.15)+a*Math.PI*2/r,c=this.player.x+Math.cos(o)*(2.2+n*.2),l=this.player.y+Math.sin(o)*(2.2+n*.2);En(this.level,this.player.x,this.player.y,c,l)&&this.forNearby(c,l,1.1,h=>{const d=this.orbitHits.get(h.id)||0,f=h.x-c,m=h.y-l;h.hp>0&&f*f+m*m<(h.radius+.6)**2&&this.elapsed-d>.24&&En(this.level,c,l,h.x,h.y)&&(this.damage(h,8+n*5,t),this.orbitHits.set(h.id,this.elapsed))})}n>=5&&this.elapsed>=this.orbitPulse&&(this.orbitPulse=this.elapsed+2.8,this.forNearby(this.player.x,this.player.y,5.5,a=>{a.hp>0&&Xt(a,this.player)<5.5**2&&En(this.level,this.player.x,this.player.y,a.x,a.y)&&this.damage(a,34,t)}),this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.55,max:.55,color:16771498,size:5.5}));continue}const s=Rt[t].cooldown*Math.pow(.88,n-1)*Math.pow(.92,this.passives.cooldown);this.cooldowns[t]=(this.cooldowns[t]||0)-e,(this.cooldowns[t]||0)<=0&&(this.fireWeapon(t),this.cooldowns[t]=s)}}pushEnemyShot(e){this.enemyShots.length<Md&&this.enemyShots.push(e)}hurtPlayer(e,t){const n=this.player;return n.invuln>0?!1:(n.health=Math.max(0,n.health-e*(this.perkGuard>0?this.perk?.damageTakenMultiplier??1:1)),n.invuln=t,this.effect({x:n.x,y:n.y,kind:"ring",life:.3,max:.3,color:16739458,size:1.7}),n.health<=0?(this.die(),!0):(this.onEvent?.("hurt"),!1))}spawnBossWave(e=!1,t){const n=this.enemies.reduce((c,l)=>c+ +(l.hp>0&&l.kind==="boss"),0);if(n>=ql)return!1;const s=t??(zn(this.level)?this.bossWave<2?1:this.bossWave<4?2:3:this.elapsed<360?1:this.elapsed<540?2:3),r=t?this.enemies.reduce((c,l)=>c+ +(l.hp>0&&l.bossEscort===!0),0):0,a=t?Math.max(0,(s===1?0:s===2?1:2)-r):s===1?0:s===2?2:4;for(;this.enemies.length>on-1-a;){let c=-1,l=-1;for(let h=0;h<this.enemies.length;h++){const d=this.enemies[h];if(d.hp<=0||d.kind==="boss"||d.elite)continue;const f=Xt(d,this.player);f>l&&(l=f,c=h)}if(c<0)break;this.enemies.splice(c,1)}if(this.enemies.length>=on)return!1;const o=this.spawnEnemy("boss",!1,t);if(!o)return!1;if(e&&o.tier!==3){const c=o.tier===2?1.35:1;o.hp=o.maxHp=o.maxHp/c*1.65,o.tier=3,o.speed=2.1}t&&(o.attackCd=1.5+n*.8);for(let c=0;c<a&&this.enemies.length<on;c++){const l=this.spawnEnemy((t?r+c:c)%2?"cultist":"brute",!0);if(!l)break;t&&(l.bossEscort=!0);const h=c*Math.PI*2/a;l.x=kt(o.x+Math.cos(h)*3.5,2,De-2),l.y=kt(o.y+Math.sin(h)*3.5,2,De-2);const d=Zi(this.level,l.x,l.y,l.radius,!1,this.moveResult);l.x=d.x,l.y=d.y,this.escortDebt++}return this.onEvent?.("boss"),this.effect({x:this.player.x,y:this.player.y,kind:"text",life:1.5,max:1.5,color:16764805,size:3,text:o.tier===1?"MOLOCH RISES":o.tier===2?"ASCENDED MOLOCH":"MOLOCH UNBOUND"}),!0}updateLavaBosses(){const e=md(this.elapsed);if(e.wave!==this.lavaBossEvent&&(this.lavaBossEvent=e.wave,this.bossWave=e.wave,this.nextLavaBossAt=this.elapsed),e.wave>=4&&!this.finalBossSpawned){this.finalBossSpawned=!0;for(const n of this.enemies){if(n.hp<=0||n.kind!=="boss"||n.tier===3)continue;const s=n.hp/n.maxHp,r=n.tier===2?1.35:1;n.maxHp=n.maxHp/r*1.65,n.hp=n.maxHp*s,n.tier=3,n.speed=2.1}}!e.desiredAlive||this.elapsed<this.nextLavaBossAt||this.lavaBossAdmitted>=e.maxAdmitted||this.enemies.reduce((n,s)=>n+ +(s.hp>0&&s.kind==="boss"),0)>=e.desiredAlive||this.spawnBossWave(!1,e.tier)&&(this.lavaBossAdmitted++,this.nextLavaBossAt=this.elapsed+.8)}addMarks(e,t,n,s,r){if(this.hazards.length+t>Xl)return!1;const a=this.player.x-e.x,o=this.player.y-e.y,c=Math.hypot(a,o)||1,l=-o/c,h=a/c;for(let d=0;d<t;d++){const f=(d-(t-1)/2)*3.6;this.hazards.push({x:kt(this.player.x+l*f,2,De-2),y:kt(this.player.y+h*f,2,De-2),radius:r==="hex"||r==="ground"?2.2:2.4,delay:n,duration:n,damage:s,sourceId:e.id,kind:r})}return!0}updateHazards(e){const t=[];for(const n of this.hazards)if(this.enemies.some(s=>s.id===n.sourceId&&s.hp>0)){if(n.delay-=e,n.delay>0){t.push(n);continue}if((n.kind==="lane"?Wl(this.player.x,this.player.y,n.x,n.y,n.x2??n.x,n.y2??n.y,n.radius+.55):Xt(n,this.player)<(n.radius+.45)**2)&&this.hurtPlayer(n.damage,.42)){this.hazards=t;return}this.effect({x:n.x,y:n.y,kind:"burst",life:.3,max:.3,color:n.kind==="hex"?16742872:n.kind==="ground"?10412287:16753252,size:n.radius})}this.hazards=t}update(e){if(this.dead||this.paused||this.awaitingReward)return;if(e=Math.min(e,.05),this.elapsed+=e,this.survivalClock+=e,this.survivalClock>=1&&(this.score+=2,this.survivalClock-=1),this.elapsed>=720&&!this.endless&&!this.cleared){this.cleared=!0,this.paused=!0;return}const t=this.player,n=t.x,s=t.y;t.invuln=Math.max(0,t.invuln-e),t.dash=Math.max(0,t.dash-e),t.dashCooldown=Math.max(0,t.dashCooldown-e),this.bombCharge=Math.min(this.bombRecharge,this.bombCharge+e),this.perkMagnet=Math.max(0,this.perkMagnet-e),this.perkSpeed=Math.max(0,this.perkSpeed-e),this.perkGuard=Math.max(0,this.perkGuard-e);const r=t.speed*(1+this.passives.speed*.1)*(t.dash>0?3.3:1)*(this.perkSpeed>0?this.perk?.bombSpeedMultiplier??1:1),a=this.move.x,o=this.move.y,c=Math.hypot(a,o),l=r*e;if(c>0){const u=this.moveTerrain(t.x,t.y,a/c*l,o/c*l,.55,!1);t.x=u.x,t.y=u.y}if(this.updateNightman(e,n,s),this.dead)return;const h=this.firing?this.aim.x:a;Math.abs(h)>.15&&(this.facing=h<0?-1:1);for(const u of this.shrines)if(u.active&&Xt(u,t)<1.9**2){u.active=!1;const N=Math.min(25,t.maxHealth-t.health);t.health+=N,this.xp+=18,this.effect({x:u.x,y:u.y,kind:"ring",life:.8,max:.8,color:7667636,size:7}),this.effect({x:u.x,y:u.y,kind:"text",life:1.2,max:1.2,color:12255185,size:2,text:`HEAL +${Math.ceil(N)}  ·  XP +18`}),this.onEvent?.("heal")}const d=this.level==="forest"?xo(this.elapsed):null,f=zn(this.level),m=$l(this.level,this.elapsed),v=f?yd(this.level,this.elapsed):d;if(this.level==="lava")this.updateLavaBosses();else{const u=v?v.bossWave:Math.floor(this.elapsed/90);u>this.bossWave&&(this.bossWave=u,this.spawnBossWave()),this.elapsed>=660&&!this.finalBossSpawned&&(this.finalBossSpawned=this.spawnBossWave(!0))}this.elapsed>=this.nextEliteEscalation&&this.elapsed<660&&(this.nextEliteEscalation+=24,this.enemies.reduce((N,z)=>N+Number(z.hp>0&&z.elite&&z.kind==="brute"),0)<4&&(this.spawnEnemy("brute",!0),this.elapsed>=600&&this.spawnEnemy("cultist",!0))),this.spawnClock+=e;const x=v?v.target:Math.min(on,70+Math.floor(this.elapsed*4.8));this.scheduleShooters(x);const g=1.2-.2*kt(this.elapsed/45,0,1);if(this.enemies.length<x&&this.spawnClock>=(v?v.interval:Math.max(.012,.14-this.elapsed*45e-5)*g)){this.spawnClock=0;const u=v?v.batch:Math.min(8,1+Math.floor(this.elapsed/35));for(let N=0;N<u&&!(v&&this.enemies.length>=x);N++)this.escortDebt>0?this.escortDebt--:this.spawnEnemy(void 0,v?m>=120&&Math.random()<.01:this.elapsed>40&&Math.random()<.025)}this.chestClock+=e,(v?this.chestClock>=60*(f?this.level==="desert"?420/300:this.level==="ice"?540/300:720/300:1):this.chestClock>36)&&(this.chestClock=0,(!v||this.enemies.reduce((u,N)=>u+Number(N.hp>0&&N.kind==="brute"&&N.elite),0)<2)&&this.spawnEnemy("brute",!0));const p=[];let A=0,w=0,M=0,E=0,R=0;for(const u of this.enemies)u.hp>0&&(u.specialState==="windup"||u.specialState==="charge")&&(f&&u.special&&R++,u.special==="juggernaut"?A++:u.special==="pouncer"?w++:u.special==="stalker"?M++:u.special==="devourer"&&E++);for(const u of this.enemies){if(u.hp<=0)continue;u.flash=Math.max(0,u.flash-e);const N=t.x-u.x,z=t.y-u.y,H=Math.hypot(N,z)||1;if(!u.observed&&H<14&&La.includes(u.kind)&&(u.observed=!0,this.monsters[u.kind].encountered++),Math.abs(N)>.2&&(u.facing=N<0?-1:1),u.frozen=Math.max(0,u.frozen-e),u.freezeImmune=Math.max(0,u.freezeImmune-e),u.special==="juggernaut"&&u.specialState!=="idle")u.knockX=0,u.knockY=0;else if(Math.abs(u.knockX)+Math.abs(u.knockY)>.02){const F=this.moveTerrain(u.x,u.y,u.knockX*e,u.knockY*e,u.radius,_s(u.kind));u.x=F.x,u.y=F.y;const K=Math.max(0,1-e*9);u.knockX*=K,u.knockY*=K}let B=!0;if(u.special==="juggernaut"||u.special==="pouncer"||u.special==="stalker")if(u.specialCd-=e,u.specialState==="windup"){if(B=!1,u.specialTimer-=e,u.specialTimer<=0){u.specialState="charge",u.specialTimer=u.special==="juggernaut"?.55:u.special==="pouncer"?.35:.42;const F=Math.hypot(u.targetX-u.x,u.targetY-u.y)||1;u.chargeX=(u.targetX-u.x)/F,u.chargeY=(u.targetY-u.y)/F,u.chargeHit=!1}}else if(u.specialState==="charge"){B=!1;const F=u.x,K=u.y,ee=Math.min(e,u.specialTimer)*(u.special==="juggernaut"?14:u.special==="pouncer"?12:10),re=this.moveTerrain(u.x,u.y,u.chargeX*ee,u.chargeY*ee,u.radius,_s(u.kind),!1);if(u.x=re.x,u.y=re.y,!u.chargeHit&&Wl(t.x,t.y,F,K,u.x,u.y,u.radius+.55)&&(u.chargeHit=!0,this.hurtPlayer((u.special==="juggernaut"?24:u.special==="stalker"?21:12)*(v?u.openingScale:1),.62)))return;u.specialTimer-=e,(u.specialTimer<=0||re.hit||F===u.x&&K===u.y)&&(u.specialState="recovery",u.specialTimer=u.special==="juggernaut"?.65:v?u.special==="pouncer"?.7:.9:.48,u.special==="juggernaut"?A--:u.special==="pouncer"?w--:M--,f&&R--)}else u.specialState==="recovery"?(B=!1,u.specialTimer-=e,u.specialTimer<=0&&(u.specialState="idle",u.specialCd=u.special==="juggernaut"?5.5:v?u.special==="stalker"?7:5:u.special==="stalker"?5:2.7)):u.specialCd<=0&&(u.special!=="stalker"||u.frozen<=0)&&H>=4&&H<=(u.special==="pouncer"?9:12)&&(f?m>=(u.special==="juggernaut"?240:90)&&this.elapsed>=this.nextForestLungeAt&&R<(m<180?1:m<300?2:3):d?this.elapsed>=(u.special==="pouncer"?90:u.special==="stalker"?150:240)&&this.elapsed>=this.nextForestLungeAt&&A+w+M<d.lunges:u.special==="juggernaut"?A<4:u.special==="pouncer"?w<12:M<4)&&(u.specialState="windup",u.specialTimer=u.special==="juggernaut"?.9:v?u.special==="pouncer"?.9:1.1:u.special==="pouncer"?.5:.75,v&&(this.nextForestLungeAt=this.elapsed+.4),u.targetX=t.x,u.targetY=t.y,u.knockX=0,u.knockY=0,u.special==="juggernaut"?A++:u.special==="pouncer"?w++:M++,B=!1,f&&R++);if(u.special==="devourer")if(u.specialCd-=e,u.specialState==="windup")u.specialTimer-=e,B=!1,u.specialTimer<=0&&(u.specialState="charge",u.specialTimer=1.6);else if(u.specialState==="charge"){if(u.specialTimer-=e,B=!1,u.specialTimer<=0){u.specialState="recovery",u.specialTimer=.65,E--;for(let F=0;F<8;F++){const K=F*Math.PI/4;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(K)*6,vy:Math.sin(K)*6,life:2.4,damage:13*(d?u.openingScale:1),radius:.28,boss:!1})}}}else u.specialState==="recovery"?(u.specialTimer-=e,B=!1,u.specialTimer<=0&&(u.specialState="idle",u.specialCd=6)):u.specialCd<=0&&u.frozen<=0&&H<13&&(!d||this.elapsed>=210)&&E<(d?Math.min(d.efreetiCap,this.elapsed<300?1:3):3)&&(u.specialState="windup",u.specialTimer=.8,E++,B=!1);if(u.special==="jaunt"||u.special==="groundbreaker"||u.special==="poisonfan")if(u.specialCd-=e,u.specialState==="windup"){if(B=!1,u.specialTimer-=e,u.specialTimer<=0){if(u.special==="jaunt"){const F=u.targetX-u.x,K=u.targetY-u.y,ee=Math.hypot(F,K)||1,re=Math.min(3,Math.max(0,ee-1.5)),we=this.moveTerrain(u.x,u.y,F/ee*re,K/ee*re,u.radius,!1,!1);u.x=we.x,u.y=we.y}else if(u.special==="poisonfan"){const F=Math.atan2(u.targetY-u.y,u.targetX-u.x);for(let K=-2;K<=2;K++){const ee=F+K*.22;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(ee)*6,vy:Math.sin(ee)*6,life:2.6,damage:8*u.openingScale,radius:.25,boss:!1,poison:!0})}}u.specialState="recovery",u.specialTimer=u.special==="jaunt"?.8:1,R--}}else u.specialState==="recovery"?(B=!1,u.specialTimer-=e,u.specialTimer<=0&&(u.specialState="idle",u.specialCd=u.special==="jaunt"?7:u.special==="poisonfan"?6:7)):u.specialCd<=0&&this.elapsed>=this.nextForestLungeAt&&R<(m<180?1:m<300?2:3)&&m>=(u.special==="jaunt"?90:210)&&H<(u.special==="jaunt"?12:13)&&(u.special!=="groundbreaker"||H<=7)&&(u.special!=="groundbreaker"||this.addMarks(u,1,1.2,16,"ground"))&&(u.specialState="windup",u.specialTimer=u.special==="jaunt"?1:u.special==="poisonfan"?1.1:1.2,u.targetX=t.x,u.targetY=t.y,this.nextForestLungeAt=this.elapsed+.4,R++,B=!1);if(u.special==="seahagfan")if(u.specialCd-=e,u.specialState==="windup"){if(B=!1,u.specialTimer-=e,u.specialTimer<=0){const F=Math.atan2(u.targetY-u.y,u.targetX-u.x),K=u.attackPhase++%2?"amber":"green";for(let ee=-2;ee<=2;ee++){const re=F+ee*.2;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(re)*6,vy:Math.sin(re)*6,life:2.5,damage:8*u.openingScale,radius:.26,boss:!1,seaHag:K})}u.specialState="recovery",u.specialTimer=.65}}else u.specialState==="recovery"?(B=!1,u.specialTimer-=e,u.specialTimer<=0&&(u.specialState="idle",u.specialCd=5)):u.specialCd<=0&&u.frozen<=0&&H<=7&&this.elapsed>=45&&(u.specialState="windup",u.specialTimer=1,u.targetX=t.x,u.targetY=t.y,B=!1);if(u.special==="hezroulane"){if(u.specialCd-=e,u.specialState==="windup")B=!1,u.specialTimer-=e,u.specialTimer<=0&&(u.specialState="recovery",u.specialTimer=.9);else if(u.specialState==="recovery")B=!1,u.specialTimer-=e,u.specialTimer<=0&&(u.specialState="idle",u.specialCd=7);else if(u.specialCd<=0&&H<=11&&this.elapsed>=180&&this.hazards.length<Xl&&this.hazards.reduce((F,K)=>F+ +(K.kind==="lane"),0)<2){const F=N/H,K=z/H;u.targetX=t.x,u.targetY=t.y,u.specialState="windup",u.specialTimer=1.1,B=!1,this.hazards.push({x:u.x,y:u.y,x2:u.x+F*9,y2:u.y+K*9,radius:1,delay:1.1,duration:1.1,damage:18*u.openingScale,sourceId:u.id,kind:"lane"})}}if(u.frozen>0&&(B=!1),u.kind==="boss"&&u.bossCastTimer>0&&(u.bossCastTimer=Math.max(0,u.bossCastTimer-e),B=!1),B){const F=u.kind==="wisp"||u.kind==="efreeti"||u.kind==="buraq"?Math.sin(this.elapsed*4+u.phase)*.48:0,K=u.kind==="cultist"||u.kind==="efreeti"||u.kind==="buraq"?6:u.kind==="dogmole"?5:u.kind==="boss"?4.5:u.radius+.3;if(H>K){const ee=this.navigate(u,N/H,z/H,e),re=u.slowed&&u.slowed>0?u.kind==="boss"?.85:.6:1,we=this.moveTerrain(u.x,u.y,(ee.x-ee.y*F)*u.speed*re*e,(ee.y+ee.x*F)*u.speed*re*e,u.radius,_s(u.kind));u.x=we.x,u.y=we.y}}if(u.slowed&&(u.slowed=Math.max(0,u.slowed-e)),u.special==="hexcaster")u.specialCd-=e,u.specialCd<=0&&H<14&&this.addMarks(u,1,1.2,18,"hex")&&(u.specialCd=4.5);else if(u.kind==="cultist"||u.kind==="boss"||u.kind==="efreeti"){if(u.attackCd-=e,u.attackCd<=0&&u.windup<=0&&u.bossCastTimer<=0&&H<17){const F=u.kind==="boss"&&this.level==="lava"?gd(this.elapsed):null;u.attackCd=u.kind==="boss"?F?.interval??3.2:u.kind==="efreeti"?3.4:2.4+Math.random(),u.attackPhase++,u.kind==="boss"&&u.tier>1&&u.attackPhase%2===0&&this.addMarks(u,u.tier===2?3:5,u.tier===2?1.25:1.4,F?.markDamage??22,"boss")?u.bossCastTimer=u.tier===2?1.25:1.4:u.windup=u.kind==="boss"?.9:.55}if(u.windup>0&&(u.windup-=e,u.windup<=0)){const F=Math.atan2(t.y-u.y,t.x-u.x),K=u.kind==="boss",ee=K?12:u.kind==="efreeti"?5:1;for(let re=0;re<ee;re++){const we=K?re*Math.PI*2/ee+this.elapsed*.12:F+(re-(ee-1)/2)*.19;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(we)*(K?7:9),vy:Math.sin(we)*(K?7:9),life:K?3.1:2.1,damage:K?16:8*u.openingScale,radius:K?.32:.23,boss:K})}if(K)for(let re=-1;re<=1;re++){const we=F+re*.22;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(we)*11,vy:Math.sin(we)*11,life:2.3,damage:14,radius:.28,boss:!0})}if(K&&u.attackPhase%3===0)for(let re=0;re<8;re++){const we=re*Math.PI/4+this.elapsed*.25;this.pushEnemyShot({x:u.x,y:u.y,vx:Math.cos(we)*4.8,vy:Math.sin(we)*4.8,life:5,damage:22,radius:.55,boss:!0})}}}if((t.x-u.x)**2+(t.y-u.y)**2<(u.radius+.55)**2&&u.frozen<=0&&(!["juggernaut","pouncer","stalker","jaunt","groundbreaker"].includes(u.special||"")||u.specialState==="idle")&&this.hurtPlayer(u.damage,.62))return;p.push(u)}if(this.enemies=p,this.updateHazards(e),this.dead)return;this.buildGrid(),this.updateBomb(e),this.updateWeapons(e);const C=[];for(const u of this.enemyShots){const N=u.x,z=u.y,H=u.vx*e,B=u.vy*e;if(u.life-=e,u.life<=0)continue;ci(this.level,N,z,H,B,u.radius,!0,this.collisionHit);const Q=this.collisionHit.hit?this.collisionHit.t:1;if(Ca(N,z,H,B,t.x,t.y,u.radius+.55)<=Q){if(this.hurtPlayer(u.damage,.42))return;continue}if(this.collisionHit.hit){this.effect({x:N+H*Q,y:z+B*Q,kind:"hit",life:.13,max:.13,color:u.poison?8710562:16756857,size:.22});continue}u.x=N+H,u.y=z+B,C.push(u)}this.enemyShots=C;const I=[];for(const u of this.strikes){if(u.delay-=e,u.delay>0){I.push(u);continue}this.forNearby(u.x,u.y,u.radius,N=>{N.hp>0&&Xt(N,u)<u.radius**2&&(u.source==="comet"||En(this.level,u.x,u.y,N.x,N.y))&&this.damage(N,u.damage,u.source)}),this.effect({x:u.x,y:u.y,kind:"ring",life:.45,max:.45,color:u.source==="comet"?16757624:12098303,size:u.radius}),this.effect({x:u.x,y:u.y,kind:"burst",life:.32,max:.32,color:u.source==="comet"?16747358:11247103,size:u.radius})}this.strikes=I;const b=[];for(const u of this.projectiles){const N=u.x,z=u.y;if(u.turnRate){const q=Math.atan2(u.vy,u.vx)+u.turnRate*e,Y=Math.hypot(u.vx,u.vy);u.vx=Math.cos(q)*Y,u.vy=Math.sin(q)*Y}const H=u.vx*e,B=u.vy*e;if(u.life-=e,u.life<=0)continue;ci(this.level,N,z,H,B,u.radius,!0,this.collisionHit);const Q=this.collisionHit.hit,F=Q?this.collisionHit.t:1,K=this.projectileCandidates,ee=this.projectileCandidatePool;K.length=0;let re=0;const we=N+H*F*.5,Je=z+B*F*.5,st=Math.hypot(H,B)*F*.5+u.radius+3;this.forNearby(we,Je,st,q=>{if(q.hp<=0||u.hit.has(q.id))return;const Y=Ca(N,z,H,B,q.x,q.y,u.radius+q.radius);if(Y>F||!Number.isFinite(Y))return;let le=K.length;for(;le>0&&K[le-1].t>Y;)le--;let fe=ee[re++];fe?(fe.enemy=q,fe.t=Y):(fe={enemy:q,t:Y},ee.push(fe)),K.splice(le,0,fe)});let qe=!1;for(const q of K){const Y=q.enemy;if(!(Y.hp<=0)){if(u.x=N+H*q.t,u.y=z+B*q.t,u.hit.add(Y.id),this.damage(Y,u.damage,u.bombFragment?"bomb":u.kind),u.kind==="tankard"){const le=(this.weapons.tankard||1)>=5?2.25:1.45;let fe=0;this.forNearby(u.x,u.y,le+2,pe=>{if(fe>=8)return!0;pe.hp<=0||pe.id===Y.id||Xt(pe,u)>(le+pe.radius)**2||!En(this.level,u.x,u.y,pe.x,pe.y)||(this.damage(pe,u.damage*.38,"tankard"),fe++,(this.weapons.tankard||1)>=5&&(pe.slowed=Math.max(pe.slowed??0,pe.kind==="boss"?.45:1.1)))}),(this.weapons.tankard||1)>=5&&(Y.slowed=Math.max(Y.slowed??0,Y.kind==="boss"?.45:1.1)),this.effect({x:u.x,y:u.y,kind:"splash",life:.3,max:.3,color:Rt.tankard.color,size:le})}if(u.kind==="arcwand"){const le=1.4+(this.weapons.arcwand||1)*.36;this.forNearby(u.x,u.y,le,fe=>{fe.hp>0&&Xt(u,fe)<le*le&&En(this.level,u.x,u.y,fe.x,fe.y)&&this.damage(fe,u.damage*.45,u.kind)}),this.effect({x:u.x,y:u.y,kind:"ring",life:.26,max:.26,color:11574015,size:le}),(this.weapons.arcwand||1)>=5&&this.strikes.length<100&&(this.strikes.push({x:u.x,y:u.y,delay:.55,radius:3.3,damage:30,source:"arcwand"}),this.effect({x:u.x,y:u.y,kind:"comet",life:.55,max:.55,color:12822015,size:3.3}))}if(u.kind==="thornbow"&&u.thornBurstPending){u.thornBurstPending=!1;let le=0;this.forNearby(Y.x,Y.y,2.8,fe=>{le>=3||fe.hp>0&&fe.id!==Y.id&&Xt(fe,Y)<2.8**2&&En(this.level,Y.x,Y.y,fe.x,fe.y)&&(le++,this.damage(fe,u.damage*.3,"thornbow"),this.effect({x:Y.x,y:Y.y,x2:fe.x,y2:fe.y,kind:"zap",life:.24,max:.24,color:9435312,size:.2}))})}if(u.pierce--<=0){qe=!0;break}}}if(!qe){if(Q){this.effect({x:N+H*F,y:z+B*F,kind:"hit",life:.13,max:.13,color:Rt[u.kind].color,size:.2});continue}u.x=N+H,u.y=z+B,u.x>=0&&u.x<=De&&u.y>=0&&u.y<=De&&b.push(u)}}this.projectiles=b;const S=[],L=2.4+this.passives.magnet*1.2+(this.perkMagnet>0?this.perk?.pickupMagnetBonus??0:0);for(const u of this.pickups){if(u.life-=e,u.life<=0)continue;const N=t.x-u.x,z=t.y-u.y,H=Math.hypot(N,z);if(H<L){const B=Math.min(H,(7+20/Math.max(.2,H))*e);u.x+=N/(H||1)*B,u.y+=z/(H||1)*B}if(H<.8)if(u.kind==="xp")this.xp+=u.value;else if(u.kind==="heart"){const B=Math.min(u.value*(this.perk?.foodHealMultiplier??1),t.maxHealth-t.health);t.health+=B,this.effect({x:t.x,y:t.y,kind:"text",life:1,max:1,color:12255185,size:1,text:`FOOD +${Math.ceil(B)} HP`}),this.onEvent?.("heal")}else if(this.awaitingReward){S.push(u);continue}else this.stats.chests++,this.score+=120,this.openReward(!0),this.onEvent?.("chest");else S.push(u)}this.pickups=S;for(const u of this.effects)u.life-=e;this.effects=this.effects.filter(u=>u.life>0),this.xp>=this.xpNeeded&&!this.awaitingReward&&(this.xp-=this.xpNeeded,this.stats.level++,this.score+=40,this.xpNeeded=Math.floor(this.xpNeeded*1.28+5),this.openReward(!1),this.onEvent?.("level")),this.comboTime=Math.max(0,this.comboTime-e),this.comboTime||(this.combo=0),this.orbitHits.size>5e3&&this.orbitHits.clear()}openReward(e){this.awaitingReward=!0,this.onReward?.(this.rollRewards(e),e)}rollRewards(e){if(this.level==="forest"&&!this.forestBlessingOffered)return this.forestBlessingOffered=!0,[{kind:"boon",id:"light",name:"Dawn Rune",detail:"Light strikes deal +25% damage to Rageipedes",rarity:"rare",icon:"☀"},{kind:"boon",id:"freeze",name:"Frost Rune",detail:"Freeze Xorn and Efreeti briefly · +25% to their weakness",rarity:"rare",icon:"❄"},{kind:"boon",id:"resolve",name:"Endless Resolve",detail:"+10 maximum health and restore 35",rarity:"rare",icon:"♥"}];if(zn(this.level)&&!this.forestBlessingOffered)return this.forestBlessingOffered=!0,[this.level==="ice"?{kind:"boon",id:"flames",name:"Ember Rune",detail:"Flame strikes deal +25% damage to Chuul",rarity:"rare",icon:"♨"}:this.level==="lava"?{kind:"boon",id:"freeze",name:"Frost Rune",detail:"Freeze Tosculi and Sea Hag briefly · +25% damage",rarity:"rare",icon:"❄"}:{kind:"boon",id:"light",name:"Dawn Rune",detail:"Light strikes deal +25% damage to Deathwisps",rarity:"rare",icon:"☀"},{kind:"bomb",id:"recharge",name:"Bomb Dynamo",detail:"Bomb recharges 12% faster",rarity:"rare",icon:"✷"},{kind:"boon",id:"resolve",name:"Renewing Spring",detail:"+10 maximum health and restore 35",rarity:"rare",icon:"♥"}];const t=[],n=Array.from(new Set(["thornbow","arcwand","scattergun","chain","orbit","comet",An[this.hero].weapon]));for(const a of n){if((a==="cleaver"||a==="tankard"||a==="runeaxes")&&An[this.hero].weapon!==a)continue;const o=this.weapons[a]||0;o<5&&(o||this.slots.length<3||this.backpack.length<3)&&t.push({kind:"weapon",id:a,name:o?`${Rt[a].name} +${o+1}`:Rt[a].name,detail:o?`Rank ${o+1} · ${o>=3?"evolved strike":"power and cadence"}`:Rt[a].desc,rarity:o>=3||e&&o>=2?"epic":o>=1?"rare":"common",icon:Rt[a].icon})}for(const[a,o,c,l]of[["damage","Sharpened Steel","✦","All weapons deal +18% damage"],["speed","Fleetfoot Boots","➤","Move speed +10%"],["magnet","Vault Magnet","◎","Pull loot from farther away"],["vitality","Iron Heart","♥","Maximum health +20"],["cooldown","Quick Hands","⌁","Fire rate +8%"]])this.passives[a]<5&&t.push({kind:"passive",id:a,name:o,detail:l,rarity:this.passives[a]>=2?"rare":"common",icon:c});for(const[a,o,c]of[["radius","Bomb Radius","Blast wave grows by 12%"],["damage","Bomb Fury","Blast damage grows by 25%"],["recharge","Bomb Dynamo","Bomb recharges 12% faster"]])this.bombRanks[a]<5&&t.push({kind:"bomb",id:a,name:o,detail:c,rarity:this.bombRanks[a]>=2?"rare":"common",icon:"✷"});this.player.health<this.player.maxHealth*.7&&t.push({kind:"heal",id:"heal",name:"Second Wind",detail:"Restore 35 health now",rarity:"common",icon:"✚"});const s=[{kind:"boon",id:"resolve",name:"Endless Resolve",detail:"+10 maximum health and restore 35",rarity:"rare",icon:"♥"},{kind:"boon",id:"fury",name:"Everlasting Fury",detail:"All damage grows by another 6%",rarity:"rare",icon:"✦"},{kind:"boon",id:"haste",name:"Wild Momentum",detail:"Move speed grows by another 5%",rarity:"rare",icon:"➤"}];for(this.level==="forest"&&(this.runes.light||t.push({kind:"boon",id:"light",name:"Dawn Rune",detail:"Light strikes deal +25% damage to Rageipedes",rarity:"rare",icon:"☀"}),this.runes.freeze||t.push({kind:"boon",id:"freeze",name:"Frost Rune",detail:"Freeze Xorn and Efreeti briefly",rarity:"rare",icon:"❄"})),this.level==="desert"&&!this.runes.light&&t.push({kind:"boon",id:"light",name:"Dawn Rune",detail:"Light strikes deal +25% damage to Deathwisps",rarity:"rare",icon:"☀"}),this.level==="ice"&&!this.runes.flames&&t.push({kind:"boon",id:"flames",name:"Ember Rune",detail:"Flame strikes deal +25% damage to Chuul",rarity:"rare",icon:"♨"}),this.level==="lava"&&(this.runes.freeze||t.push({kind:"boon",id:"freeze",name:"Frost Rune",detail:"Freeze Tosculi and Sea Hag briefly",rarity:"rare",icon:"❄"}),this.runes.light||t.push({kind:"boon",id:"light",name:"Dawn Rune",detail:"Light strikes deal +25% damage to Hezrou",rarity:"rare",icon:"☀"}));t.length<3;)t.push(s.shift());const r=[];for(;r.length<3&&t.length;){const a=Math.floor(Math.random()*t.length);r.push(t.splice(a,1)[0])}if(e&&r.length){const a=r[Math.floor(Math.random()*r.length)];a.rarity==="common"&&(a.rarity="rare"),Math.random()<.28&&(a.rarity="epic")}return r}chooseReward(e){if(this.awaitingReward){if(e.kind==="weapon"){const t=e.id;this.weapons[t]||(this.slots.length<3?this.slots.push(t):this.backpack.length<3&&this.backpack.push(t)),this.weapons[t]=Math.min(5,(this.weapons[t]||0)+1)}else if(e.kind==="passive"){const t=e.id;this.passives[t]++,t==="vitality"&&(this.player.maxHealth+=20,this.player.health+=20)}else if(e.kind==="bomb"){const t=e.id;this.bombRanks[t]=Math.min(5,this.bombRanks[t]+1)}else e.kind==="boon"?e.id==="light"||e.id==="freeze"||e.id==="flames"?this.runes[e.id]=!0:e.id==="resolve"?(this.player.maxHealth+=10,this.player.health=Math.min(this.player.maxHealth,this.player.health+35)):e.id==="fury"?this.passives.damage+=1/3:this.passives.speed+=.5:this.player.health=Math.min(this.player.maxHealth,this.player.health+35);this.awaitingReward=!1}}swapBackpack(e,t){e<0||e>=this.backpack.length||t<0||t>=this.slots.length||([this.slots[t],this.backpack[e]]=[this.backpack[e],this.slots[t]])}stress(e){this.rankable=!1;const t=Math.min(Math.max(0,Math.floor(e)),on-this.enemies.length);for(let n=0;n<t;n++)this.spawnEnemy(this.level==="forest"?"rageipede":zn(this.level)?br(this.level):"rat")}defeatBossDebug(){this.rankable=!1;const e=this.enemies.find(t=>t.kind==="boss"&&t.hp>0);e&&this.damage(e,1e9,"thornbow")}demoEncounter(e){this.rankable=!1,this.nightman=null,this.killedByNightman=!1,this.elapsed=e==="juggernaut"?130:e==="hexcaster"?190:e==="ascended"?370:550,this.endless=e==="unbound",this.bossWave=Math.floor(this.elapsed/90),this.spawnClock=this.chestClock=-1e3,this.escortDebt=0,this.enemies=[],this.enemyShots=[],this.hazards=[],this.effects=[],this.projectiles=[],this.strikes=[],this.pickups=[],this.slots=[],this.awaitingReward=!1,this.cleared=!1,this.dead=!1,this.paused=!0,this.player.health=this.player.maxHealth,this.player.invuln=1e9;const t=e==="juggernaut"?this.spawnEnemy("brute",!0):e==="hexcaster"?this.spawnEnemy("cultist",!0):this.spawnEnemy("boss");return t&&(t.x=kt(this.player.x+(t.kind==="boss"?10:8),2,De-2),t.y=this.player.y,t.specialCd=0,t.attackCd=0,t.kind==="boss"&&(t.attackPhase=1)),this.buildGrid(),t}advanceDemo(e){if(!(this.rankable||!Number.isFinite(e))){this.paused=!1;for(let t=0,n=Math.min(300,Math.max(0,Math.ceil(e*60)));t<n&&!this.dead;t++)this.update(1/60);this.paused=!0}}}const As=Object.freeze({rageipede:Object.freeze({realm:"forest",tokenId:315,name:"Rageipede The Goblin of The Forest",size:"Tiny",alignment:"Chaotic",actions:"Multiattack, Fey Charm",ability:"Sneak Attack",weakness:"Light",locomotion:"Hop",language:"Elf, Elemental, Lizardfolk, Plant, Trollkin, Orc"}),xorn:Object.freeze({realm:"forest",tokenId:3421,name:"Xorn The Fiend of The Forest",size:"Gigantic",alignment:"Neutral Evil",actions:"Club, Talons",ability:"Shadow Stealth",weakness:"Freeze",locomotion:"Prowl",language:"Understands all but can't speak"}),efreeti:Object.freeze({realm:"forest",tokenId:8883,name:"Efreeti The Aberration of The Forest",size:"Gigantic",alignment:"Neutral Evil",actions:"Multiattack, Tail",ability:"Ingest Magic",weakness:"Freeze",locomotion:"Fly",language:"Elf, Elemental, Lizardfolk, Plant, Trollkin, Orc"}),deathwisp:Object.freeze({realm:"desert",tokenId:1201,name:"Deathwisp The Fey of The Desert",size:"Scrawny",alignment:"Neutral",actions:"Absorb, Charge",ability:"Evasive",weakness:"Light",locomotion:"Hop",language:"Understands all but can't speak"}),buraq:Object.freeze({realm:"desert",tokenId:83,name:"Buraq The Noctiny of The Desert",size:"Gigantic",alignment:"Lawful Neutral",actions:"Poison Breath, Magical Burble",ability:"Resize",weakness:"Noise",locomotion:"Fly",language:"Dwarf, Giant, Titan"}),chuul:Object.freeze({realm:"ice",tokenId:9189,name:"Chuul The Swarm of Tiny Monstrosities of The Mountains",size:"Stout",alignment:"Neutral",actions:"Club, Thorny Lash",ability:"Ethereal Jaunt",weakness:"Flames",locomotion:"Pound",language:"Dwarf, Giant, Titan"}),dogmole:Object.freeze({realm:"ice",tokenId:8965,name:"Dogmole The Demon of The Mountains",size:"Gigantic",alignment:"Lawful Evil",actions:"Club, Fist",ability:"Groundbreaker",weakness:"Physical Damage",locomotion:"Gallop",language:"Bearfolk, Beast, Burrowling, Telepathy"}),tosculi:Object.freeze({realm:"lava",tokenId:3015,name:"Tosculi Hive-Queen The Swarm of Tiny Undead of The Dungeon",size:"Tiny",alignment:"Neutral Evil",actions:"Flame Breath, Breath Weapon",ability:"Sure-Footed",weakness:"Freeze",locomotion:"Leap",language:"Dragon, Abberation, Merfolk, Simian"}),seahag:Object.freeze({realm:"lava",tokenId:5413,name:"Sea Hag The Kryt of The Desert",size:"Stout",alignment:"Lawful Neutral",actions:"Poison Breath, Flame Breath",ability:"Sure-Footed",weakness:"Freeze",locomotion:"Leap",language:"Bearfolk, Beast, Burrowling, Telepathy"}),hezrou:Object.freeze({realm:"lava",tokenId:3112,name:"Hezrou The Fiend of The Dungeon",size:"Colossal",alignment:"Lawful Good",actions:"Fiery Greatsword, Devour",ability:"Hellish Rejuvenation",weakness:"Light",locomotion:"Slither",language:"Can't understand language at all"})}),qt=(i="Invalid progression request.")=>Object.assign(new Error(i),{status:400}),Rs=()=>Object.assign(new Error("Profile changed. Reload and try again."),{status:409}),Vi=Object.keys(un),Ed=()=>({vitality:0,agility:0,bombRecharge:0}),_a=()=>({schemaVersion:3,revision:0,unlocked:["training"],unlockedHeroes:[...sh],checkpoints:Object.fromEntries(Vi.map(i=>[i,Object.fromEntries(Mt.map(e=>[e,[]]))])),milestones:Object.fromEntries(Vi.map(i=>[i,{}])),skills:Object.fromEntries(Mt.map(i=>[i,Ed()])),perks:Object.fromEntries(Mt.map(i=>[i,[]])),equippedPerk:Object.fromEntries(Mt.map(i=>[i,null])),realmMastery:Object.fromEntries(Mt.map(i=>[i,[]])),classMastery:[],purchases:[],equips:[],monsters:Object.fromEntries(Object.keys(As).map(i=>[i,{encountered:0,kills:0,counterKills:0}]))}),xa=i=>typeof i=="string"&&/^[a-zA-Z0-9_-]{8,100}$/.test(i);function ah(i,e=[]){const t=new Set(["training"]);for(const r of e)un[r]&&t.add(r);const n=new Set(sh),s=(r,a)=>Mt.some(o=>i.checkpoints[r][o].includes(`${r}-${a}`));s("training",180)&&t.add("forest"),s("training",300)&&n.add("warrior"),s("forest",300)&&t.add("desert"),s("forest",420)&&n.add("tavern-keeper"),s("desert",420)&&t.add("ice"),s("ice",540)&&t.add("lava"),i.unlocked=Vi.filter(r=>t.has(r)),i.unlockedHeroes=Mt.filter(r=>n.has(r));for(const r of Mt)i.realmMastery[r]=Vi.filter(a=>i.checkpoints[a][r].includes(`${a}-720`));i.classMastery=Mt.filter(r=>i.realmMastery[r].includes("lava"));for(const r of Vi)for(const a of Mt)i.checkpoints[r][a].includes(di[r][0].checkpointId)&&(i.milestones[r][a]=!0)}function Ln(i){const e=_a();if(!i||typeof i!="object"||![2,3].includes(i.schemaVersion))return e;e.revision=Number.isSafeInteger(i.revision)&&i.revision>=0?i.revision:0;for(const t of Vi)for(const n of Mt){const s=new Set(di[t].map(r=>r.checkpointId));i.schemaVersion===3&&Array.isArray(i.checkpoints?.[t]?.[n])&&(e.checkpoints[t][n]=[...new Set(i.checkpoints[t][n].filter(r=>s.has(r)))]),i.milestones?.[t]?.[n]&&!e.checkpoints[t][n].includes(di[t][0].checkpointId)&&e.checkpoints[t][n].unshift(di[t][0].checkpointId)}for(const t of Mt)for(const n of ra){const s=i.skills?.[t]?.[n];e.skills[t][n]=Number.isSafeInteger(s)&&s>=0&&s<=2?s:0}if(i.schemaVersion===3)for(const t of Mt){const n=i.perks?.[t];Array.isArray(n)&&(e.perks[t]=[...new Set(n.filter(r=>!!nr(t,r)))]);const s=i.equippedPerk?.[t];e.perks[t].includes(s)&&(e.equippedPerk[t]=s)}Array.isArray(i.purchases)&&(e.purchases=i.purchases.filter(t=>Mt.includes(t?.hero)&&Number.isSafeInteger(t?.expectedRevision)&&t.expectedRevision>=0&&(ra.includes(t.skill)&&[1,2].includes(t.rank)||!!nr(t.hero,t.perkId))).slice(-128).map(t=>({...t}))),Array.isArray(i.equips)&&(e.equips=i.equips.filter(t=>Mt.includes(t?.hero)&&xa(t?.requestId)&&(t.perkId===null||!!nr(t.hero,t.perkId))).slice(-128).map(t=>({...t})));for(const t of Object.keys(As))for(const n of["encountered","kills","counterKills"]){const s=i.monsters?.[t]?.[n];e.monsters[t][n]=Number.isSafeInteger(s)&&s>=0?s:0}return ah(e,Array.isArray(i.unlocked)?i.unlocked:[]),i.schemaVersion===3&&Array.isArray(i.unlockedHeroes)&&(e.unlockedHeroes=Mt.filter(t=>e.unlockedHeroes.includes(t)||i.unlockedHeroes.includes(t))),e}function lr(i,e){if(!Mt.includes(e))return 0;const t=Vi.reduce((s,r)=>s+(i.checkpoints?.[r]?.[e]?.length||0),0),n=ra.reduce((s,r)=>s+(i.skills?.[e]?.[r]||0),0)+3*(i.perks?.[e]?.length||0);return t-n}function Mo(i,e,t){if(!Mt.includes(e)||!un[t])return null;const n=new Set(i.checkpoints?.[t]?.[e]||[]),s=di[t].find(r=>!n.has(r.checkpointId));return s?{...s}:null}function Td(i,e,t,n,s,r){if(!Mt.includes(e)||!ra.includes(t)||!Number.isSafeInteger(n)||n<0||r!==void 0&&!xa(r))throw qt();const a=i.purchases?.find(l=>r?l.requestId===r:l.hero===e&&l.skill===t&&l.rank===s&&l.expectedRevision===n);if(a){if(a.hero!==e||a.skill!==t||s!==void 0&&a.rank!==s||a.expectedRevision!==n)throw Rs();return Ln(i)}if(i.revision!==n)throw Rs();const o=s??i.skills[e][t]+1;if(![1,2].includes(o)||i.skills[e][t]!==o-1||lr(i,e)<1)throw qt("Earn a checkpoint credit before buying this skill.");const c=Ln(i);return c.skills[e][t]=o,c.purchases.push({hero:e,skill:t,rank:o,expectedRevision:n,...r?{requestId:r}:{}}),c.purchases=c.purchases.slice(-128),c.revision++,c}function wd(i,e,t,n,s){if(!Mt.includes(e)||!nr(e,t)||!Number.isSafeInteger(n)||!xa(s))throw qt();const r=i.purchases?.find(o=>o.requestId===s);if(r){if(r.hero!==e||r.perkId!==t||r.expectedRevision!==n)throw Rs();return Ln(i)}if(i.revision!==n)throw Rs();if(i.perks[e].includes(t)||lr(i,e)<3)throw qt("Earn three checkpoint credits before buying this perk.");const a=Ln(i);return a.perks[e].push(t),a.purchases.push({hero:e,perkId:t,expectedRevision:n,requestId:s,cost:3}),a.purchases=a.purchases.slice(-128),a.revision++,a}function Yl(i,e,t,n,s){if(!Mt.includes(e)||t!==null&&!nr(e,t)||!Number.isSafeInteger(n)||!xa(s))throw qt();const r=i.equips?.find(o=>o.requestId===s);if(r){if(r.hero!==e||r.perkId!==t||r.expectedRevision!==n)throw Rs();return Ln(i)}if(i.revision!==n)throw Rs();if(t!==null&&!i.perks[e].includes(t))throw qt("Buy the perk before equipping it.");const a=Ln(i);return a.equippedPerk[e]=t,a.equips.push({hero:e,perkId:t,expectedRevision:n,requestId:s}),a.equips=a.equips.slice(-128),a.revision++,a}function Ad(i){return i?.encountered?i.kills>=25&&i.counterKills>=1?4:i.counterKills>=1?3:i.kills>=5?2:1:0}function Rd(i,e={}){if(!i||typeof i!="object"||Array.isArray(i))throw qt();const t={};for(const n of Object.keys(As)){const s=i[n]??{encountered:0,kills:0,counterKills:0},r=e[n]??{encountered:0,kills:0,counterKills:0};for(const a of["encountered","kills","counterKills"])if(!Number.isSafeInteger(s[a])||s[a]<(r[a]||0)||s[a]>1e6)throw qt();if(s.counterKills>s.kills||s.kills>s.encountered)throw qt();t[n]={encountered:s.encountered,kills:s.kills,counterKills:s.counterKills}}return t}function Cd(i,e,t,n={}){if(!Number.isSafeInteger(t?.durationMs)||t.durationMs<(n.durationMs||0))throw qt();const s=Rd(t.monsters,n.monsters),r=e.level==="lava"?new Set(["forest","desert","ice","lava"]):new Set([e.level]);if(Object.entries(s).some(([d,f])=>!r.has(As[d].realm)&&(f.encountered||f.kills||f.counterKills)))throw qt();const a=Object.values(s).reduce((d,f)=>d+f.kills,0);if(!Number.isSafeInteger(t.kills)||t.kills<(n.kills||0)||a>t.kills)throw qt();const o=t.durationMs/1e3,c=22+Math.ceil(o*480)+Math.ceil(o/90)+Math.ceil(o/36)+2+(e.version===Hi&&o>=660?1:0);if(t.kills>c||Object.values(s).reduce((d,f)=>d+f.encountered,0)>c+50)throw qt();const l=Ln(i),h=e.version===pd?di[e.level]?.[0]:e.target;if(h){if(!di[e.level]?.find(m=>m.checkpointId===h.checkpointId&&m.thresholdMs===h.thresholdMs))throw qt("Invalid run checkpoint.");const f=l.checkpoints[e.level][e.character];t.durationMs>=h.thresholdMs&&!f.includes(h.checkpointId)&&(f.push(h.checkpointId),l.revision++,ah(l,l.unlocked))}for(const d of Object.keys(As))for(const f of["encountered","kills","counterKills"])l.monsters[d][f]+=s[d][f]-(n.monsters?.[d]?.[f]||0);return{profile:l,progress:{durationMs:t.durationMs,kills:t.kills,monsters:s}}}function Pd(i){return i.bombFragment?"briar-fragment":i.kind==="thornbow"?"arrow":i.kind==="arcwand"?"arc-bolt":i.kind==="scattergun"?"rune-pellet":i.kind==="runeaxes"?"rune-axe":i.kind==="tankard"?"tankard":"generic"}const He=64,Ld=16,jn=32,Id={arrow:0,"arc-bolt":1,"rune-pellet":2,tankard:3,"briar-fragment":4,"rune-axe":5,generic:6},Si=(i,e,t)=>Math.max(e,Math.min(t,i));class Dd{atlas=document.createElement("canvas");directions=document.createElement("canvas");ready;cacheBuilds=1;mugLoaded=!1;dead=!1;image=null;finishLoad=null;constructor(e){this.atlas.width=He*Ld,this.atlas.height=He;const t=this.atlas.getContext("2d"),n=(a,o)=>{t.fillStyle=o,t.beginPath(),a.forEach(([c,l],h)=>h?t.lineTo(c,l):t.moveTo(c,l)),t.closePath(),t.fill()},s=(a,o)=>{t.save(),t.translate(a*He,0),o(),t.restore()};s(0,()=>{t.fillStyle="#252119",t.fillRect(7,27,43,10),t.fillStyle="#c09052",t.fillRect(10,30,37,4),n([[58,32],[42,22],[45,32],[42,42]],"#efffdc"),n([[9,30],[5,20],[20,29],[20,35],[5,44],[9,34]],"#87e9aa")}),s(1,()=>{n([[2,32],[30,15],[53,32],[30,49]],"#6852be"),n([[9,32],[33,22],[49,32],[33,42]],"#b1a5ff"),n([[23,32],[34,25],[43,32],[34,39]],"#f2ebff")}),s(2,()=>{n([[12,23],[39,13],[54,31],[39,51],[12,41]],"#4b3230"),n([[17,25],[37,18],[47,31],[36,44],[17,38]],"#ffc378"),t.fillStyle="#fff4cb",t.fillRect(28,23,6,18),t.fillRect(28,29,12,5)}),s(3,()=>{t.fillStyle="#f4e6b8",t.fillRect(39,22,17,27),t.clearRect(43,27,8,16),t.fillStyle="#352416",t.fillRect(11,17,31,39),t.fillStyle="#b77a36",t.fillRect(15,21,23,31),t.fillStyle="#cfcec3",t.fillRect(12,25,29,5),t.fillRect(12,44,29,5),t.fillStyle="#fff0ca",t.fillRect(10,13,31,9),t.fillRect(17,9,12,8)}),s(4,()=>n([[9,32],[27,22],[54,32],[27,42],[33,32]],"#aaffb9")),s(5,()=>{t.fillStyle="#fff1bd",t.beginPath(),t.ellipse(32,32,23,10,0,0,Math.PI*2),t.fill()});for(let a=0;a<5;a++)s(6+a,()=>{const o=(100+a*5)*Math.PI/180;t.strokeStyle="#bb773d",t.lineWidth=9,t.beginPath(),t.arc(32,32,25,-o/2,o/2),t.stroke(),t.strokeStyle="#e5f5f3",t.lineWidth=5,t.beginPath(),t.arc(32,32,28,-o/2,o/2),t.stroke(),t.strokeStyle="#fff8d0",t.lineWidth=2,t.beginPath(),t.arc(32,32,30,-o/2,o/2),t.stroke()});for(let a=0;a<4;a++)s(11+a,()=>{const o=8+a*5;for(let c=0;c<8;c++){const l=c*Math.PI/4,h=32+Math.cos(l)*o,d=32+Math.sin(l)*o;t.fillStyle=c%2?"#ffecc2":"#d89a43";const f=7-a;t.fillRect(Math.round(h-f/2),Math.round(d-f/2),f,f)}a<2&&(t.fillStyle="#fff6d9",t.fillRect(26,27,12,10))});s(15,()=>{t.fillStyle="#50302b",t.fillRect(8,28,42,9),t.fillStyle="#db9a52",t.fillRect(10,30,39,5),n([[40,18],[53,12],[60,26],[55,32],[60,38],[53,52],[40,46],[45,32]],"#e5edf1"),n([[44,20],[52,17],[56,27],[50,32],[56,37],[52,47],[44,44],[48,32]],"#8a91ad"),t.fillStyle="#f9d778",t.fillRect(46,28,7,8),t.fillStyle="#f8edcc",t.fillRect(11,27,5,11)}),this.directions.width=He*jn,this.directions.height=He*6,this.cacheDirections(),this.ready=new Promise(a=>{this.finishLoad=a});const r=this.image=new Image;r.onload=()=>{if(!this.dead){try{const a=document.createElement("canvas");a.width=a.height=128;const o=a.getContext("2d",{willReadFrequently:!0});o.drawImage(r,0,0,128,128);const c=o.getImageData(0,0,128,128).data;let l=128,h=128,d=0,f=0;for(let m=0;m<128;m++)for(let v=0;v<128;v++)c[(m*128+v)*4+3]>=64&&(l=Math.min(l,v),d=Math.max(d,v),h=Math.min(h,m),f=Math.max(f,m));if(d>=l&&f>=h){const m=d-l+1,v=f-h+1,x=48/Math.max(m,v);t.clearRect(3*He,0,He,He),t.imageSmoothingEnabled=!1,t.drawImage(a,l,h,m,v,3*He+(He-m*x)/2,(He-v*x)/2,m*x,v*x),this.mugLoaded=!0,this.cacheDirections(3),this.cacheBuilds++}a.width=a.height=0}catch{}this.releaseImage()}},r.onerror=()=>this.releaseImage(),r.src=e}cacheDirections(e){const t=this.directions.getContext("2d");for(let n=e??0;n<=(e??5);n++)for(let s=0;s<jn;s++){const r=n===0?.62:n===1?.65:n===4?.6153846153846154:n===5?.8:1;t.clearRect(s*He,n*He,He,He),t.save(),t.translate(s*He+He/2,n*He+He/2),t.rotate(s*Math.PI*2/jn),t.imageSmoothingEnabled=!1,t.drawImage(this.atlas,(n===5?15:n)*He,0,He,He,-He/2,-He*r/2,He,He*r),t.restore()}}releaseImage(){this.image&&(this.image.onload=this.image.onerror=null,this.image=null),this.finishLoad?.(),this.finishLoad=null}drawProjectile(e,t,n,s,r,a,o,c){if(this.dead)return;const l=Pd(t),h=Id[l];let d,f;l==="arrow"?(d=Si(r*1.05,20,34),f=d*.62):l==="rune-axe"?d=f=Si(r*1.4,22,38):l==="tankard"?d=f=Si(r*1.3,22,32):l==="arc-bolt"?(d=Si(t.radius*r*6,24,40),f=d*.65):l==="rune-pellet"?d=f=Si(t.radius*r*3.3,9,14):l==="briar-fragment"?(d=13,f=8):(d=Math.max(8,t.radius*r*3.2),f=Math.max(4,t.radius*r*1.16));const m=Math.atan2(-t.vy,t.vx)+((l==="tankard"||l==="rune-axe")&&!o?a*10:0);if(c&&l!=="tankard"&&l!=="rune-axe"&&l!=="generic"){if(e.save(),e.translate(n,s),e.rotate(m),e.shadowBlur=0,l==="arrow")e.fillStyle="#c09052",e.fillRect(-d*.75,-1,d*.55,2),e.fillStyle="#efffdc",e.beginPath(),e.moveTo(0,0),e.lineTo(-d*.25,-3),e.lineTo(-d*.18,0),e.lineTo(-d*.25,3),e.fill(),e.fillStyle="#87e9aa",e.fillRect(-d*.78,-3,4,6);else{const v=l==="briar-fragment"?9:d*.72,x=l==="arc-bolt"?f*.65:l==="briar-fragment"?4:f*.7;e.fillStyle=l==="arc-bolt"?"#b1a5ff":l==="rune-pellet"?"#ffc378":"#aaffb9",e.beginPath(),e.moveTo(v/2,0),e.lineTo(0,-x/2),e.lineTo(-v/2,0),e.lineTo(0,x/2),e.closePath(),e.fill(),l!=="briar-fragment"&&(e.fillStyle="#fff4dc",e.fillRect(-1,-1,3,2))}e.restore();return}if(l!=="generic"){const v=(Math.round(m*jn/(Math.PI*2))%jn+jn)%jn,x=v*Math.PI*2/jn,g=l==="arrow"?d*26/64:0,p=e.imageSmoothingEnabled,A=e.shadowBlur;e.imageSmoothingEnabled=!1,e.shadowBlur=0,l==="rune-axe"&&t.runeGold&&(e.save(),e.translate(n,s),e.rotate(Math.atan2(-t.vy,t.vx)),e.fillStyle="rgba(255,216,119,.65)",e.fillRect(-d*1.1,-2,d*.75,4),e.fillStyle="rgba(255,240,177,.85)",e.fillRect(-d*.65,-1,d*.3,2),e.restore()),e.drawImage(this.directions,v*He,h*He,He,He,n-d/2-Math.cos(x)*g,s-d/2-Math.sin(x)*g,d,d),e.imageSmoothingEnabled=p,e.shadowBlur=A;return}if(e.save(),e.shadowBlur=0,e.imageSmoothingEnabled=!1,e.translate(n,s),e.rotate(m),l==="generic"){e.fillStyle=e.shadowColor=`#${Rt[t.kind].color.toString(16).padStart(6,"0")}`,e.shadowBlur=c?0:16,e.beginPath(),e.ellipse(0,0,d/2,f/2,0,0,Math.PI*2),e.fill(),e.restore();return}}drawEffect(e,t,n,s,r,a){if(this.dead||t.kind!=="slash"&&t.kind!=="splash")return!1;const o=Si(1-t.life/t.max,0,1);if(e.save(),e.shadowBlur=0,e.imageSmoothingEnabled=!1,e.globalAlpha=1-o,e.translate(n,s),t.kind==="slash"){e.rotate(-(t.angle??0));const c=6+Si(Math.round(((t.arc??100*Math.PI/180)*180/Math.PI-100)/5),0,4),l=t.size*r*2*(a?1:.9+.1*o);e.drawImage(this.atlas,c*He,0,He,He,-l/2,-l/2,l,l)}else{const c=11+(a?2:Math.min(3,Math.floor(o*4))),l=Math.max(16,t.size*r*2);e.drawImage(this.atlas,c*He,0,He,He,-l/2,-l/2,l,l)}return e.restore(),!0}dispose(){this.dead=!0,this.releaseImage(),this.atlas.width=this.atlas.height=0,this.directions.width=this.directions.height=0}}const bl="180",Ud=0,jl=1,Nd=2,oh=1,kd=2,Hn=3,vi=0,$t=1,ln=2,ui=0,Es=1,Kl=2,Zl=3,Jl=4,Od=5,Di=100,Fd=101,Bd=102,zd=103,Hd=104,Vd=200,Gd=201,Wd=202,Xd=203,yo=204,So=205,qd=206,$d=207,Yd=208,jd=209,Kd=210,Zd=211,Jd=212,Qd=213,eu=214,bo=0,Eo=1,To=2,Cs=3,wo=4,Ao=5,Ro=6,Co=7,lh=0,tu=1,nu=2,fi=0,iu=1,su=2,ru=3,au=4,ou=5,lu=6,cu=7,ch=300,Ps=301,Ls=302,Po=303,Lo=304,Ma=306,cr=1e3,Fi=1001,Io=1002,gt=1003,hu=1004,Er=1005,Rn=1006,Da=1007,hi=1008,Wn=1009,hh=1010,dh=1011,hr=1012,El=1013,Wi=1014,Cn=1015,vr=1016,Tl=1017,wl=1018,dr=1020,uh=35902,fh=35899,ph=1021,mh=1022,Mn=1023,ur=1026,fr=1027,Al=1028,Rl=1029,gh=1030,Cl=1031,Pl=1033,Qr=33776,ea=33777,ta=33778,na=33779,Do=35840,Uo=35841,No=35842,ko=35843,Oo=36196,Fo=37492,Bo=37496,zo=37808,Ho=37809,Vo=37810,Go=37811,Wo=37812,Xo=37813,qo=37814,$o=37815,Yo=37816,jo=37817,Ko=37818,Zo=37819,Jo=37820,Qo=37821,el=36492,tl=36494,nl=36495,il=36283,sl=36284,rl=36285,al=36286,du=3200,uu=3201,fu=0,pu=1,ri="",mt="srgb",Is="srgb-linear",aa="linear",et="srgb",Ji=7680,Ql=519,mu=512,gu=513,vu=514,vh=515,_u=516,xu=517,Mu=518,yu=519,ol=35044,Ua=35048,ec="300 es",Pn=2e3,oa=2001;class ks{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Na=Math.PI/180,ll=180/Math.PI;function pi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function Ge(i,e,t){return Math.max(e,Math.min(t,i))}function Su(i,e){return(i%e+e)%e}function ka(i,e,t){return(1-t)*i+t*e}function wn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function tt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class We{constructor(e=0,t=0){We.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class _r{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const f=r[a+0],m=r[a+1],v=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=v,e[t+3]=x;return}if(d!==x||c!==f||l!==m||h!==v){let g=1-o;const p=c*f+l*m+h*v+d*x,A=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const E=Math.sqrt(w),R=Math.atan2(E,p*A);g=Math.sin(g*R)/E,o=Math.sin(o*R)/E}const M=o*A;if(c=c*g+f*M,l=l*g+m*M,h=h*g+v*M,d=d*g+x*M,g===1-o){const E=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=E,l*=E,h*=E,d*=E}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[a],f=r[a+1],m=r[a+2],v=r[a+3];return e[t]=o*v+h*d+c*m-l*f,e[t+1]=c*v+h*f+l*d-o*m,e[t+2]=l*v+h*m+o*f-c*d,e[t+3]=h*v-o*d-c*f-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),d=o(r/2),f=c(n/2),m=c(s/2),v=c(r/2);switch(a){case"XYZ":this._x=f*h*d+l*m*v,this._y=l*m*d-f*h*v,this._z=l*h*v+f*m*d,this._w=l*h*d-f*m*v;break;case"YXZ":this._x=f*h*d+l*m*v,this._y=l*m*d-f*h*v,this._z=l*h*v-f*m*d,this._w=l*h*d+f*m*v;break;case"ZXY":this._x=f*h*d-l*m*v,this._y=l*m*d+f*h*v,this._z=l*h*v+f*m*d,this._w=l*h*d-f*m*v;break;case"ZYX":this._x=f*h*d-l*m*v,this._y=l*m*d+f*h*v,this._z=l*h*v-f*m*d,this._w=l*h*d+f*m*v;break;case"YZX":this._x=f*h*d+l*m*v,this._y=l*m*d+f*h*v,this._z=l*h*v-f*m*d,this._w=l*h*d-f*m*v;break;case"XZY":this._x=f*h*d-l*m*v,this._y=l*m*d-f*h*v,this._z=l*h*v+f*m*d,this._w=l*h*d+f*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],f=n+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(e=0,t=0,n=0){G.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=s+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Oa.copy(this).projectOnVector(e),this.sub(Oa)}reflect(e){return this.sub(Oa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ge(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Oa=new G,tc=new _r;class Oe{constructor(e,t,n,s,r,a,o,c,l){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],m=n[5],v=n[8],x=s[0],g=s[3],p=s[6],A=s[1],w=s[4],M=s[7],E=s[2],R=s[5],C=s[8];return r[0]=a*x+o*A+c*E,r[3]=a*g+o*w+c*R,r[6]=a*p+o*M+c*C,r[1]=l*x+h*A+d*E,r[4]=l*g+h*w+d*R,r[7]=l*p+h*M+d*C,r[2]=f*x+m*A+v*E,r[5]=f*g+m*w+v*R,r[8]=f*p+m*M+v*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,f=o*c-h*r,m=l*r-a*c,v=t*d+n*f+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=d*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=m*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Fa.makeScale(e,t)),this}rotate(e){return this.premultiply(Fa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Fa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Fa=new Oe;function _h(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bu(){const i=pr("canvas");return i.style.display="block",i}const nc={};function mr(i){i in nc||(nc[i]=!0,console.warn(i))}function Eu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const ic=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sc=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tu(){const i={enabled:!0,workingColorSpace:Is,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===et&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===et&&(s.r=Ts(s.r),s.g=Ts(s.g),s.b=Ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?aa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return mr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return mr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Is]:{primaries:e,whitePoint:n,transfer:aa,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:mt},outputColorSpaceConfig:{drawingBufferColorSpace:mt}},[mt]:{primaries:e,whitePoint:n,transfer:et,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:mt}}}),i}const Ye=Tu();function Gn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Qi;class wu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qi===void 0&&(Qi=pr("canvas")),Qi.width=e.width,Qi.height=e.height;const s=Qi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Qi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=pr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Gn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gn(t[n]/255)*255):t[n]=Gn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Au=0;class Ll{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=pi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ba(s[a].image)):r.push(Ba(s[a]))}else r=Ba(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ba(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ru=0;const za=new G;class Lt extends ks{constructor(e=Lt.DEFAULT_IMAGE,t=Lt.DEFAULT_MAPPING,n=Fi,s=Fi,r=Rn,a=hi,o=Mn,c=Wn,l=Lt.DEFAULT_ANISOTROPY,h=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=pi(),this.name="",this.source=new Ll(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(za).x}get height(){return this.source.getSize(za).y}get depth(){return this.source.getSize(za).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ch)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cr:e.x=e.x-Math.floor(e.x);break;case Fi:e.x=e.x<0?0:1;break;case Io:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cr:e.y=e.y-Math.floor(e.y);break;case Fi:e.y=e.y<0?0:1;break;case Io:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Lt.DEFAULT_IMAGE=null;Lt.DEFAULT_MAPPING=ch;Lt.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,n=0,s=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],f=c[1],m=c[5],v=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-x)<.01&&Math.abs(v-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+x)<.1&&Math.abs(v+g)<.1&&Math.abs(l+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,M=(m+1)/2,E=(p+1)/2,R=(h+f)/4,C=(d+x)/4,I=(v+g)/4;return w>M&&w>E?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=R/n,r=C/n):M>E?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=R/s,r=I/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=C/r,s=I/r),this.set(n,s,r,t),this}let A=Math.sqrt((g-v)*(g-v)+(d-x)*(d-x)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(g-v)/A,this.y=(d-x)/A,this.z=(f-h)/A,this.w=Math.acos((l+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this.w=Ge(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this.w=Ge(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ge(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cu extends ks{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Lt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Rn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ll(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends Cu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xh extends Lt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=gt,this.minFilter=gt,this.wrapR=Fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Pu extends Lt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=gt,this.minFilter=gt,this.wrapR=Fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yi{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,fn):fn.fromBufferAttribute(r,a),fn.applyMatrix4(e.matrixWorld),this.expandByPoint(fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Tr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Tr.copy(n.boundingBox)),Tr.applyMatrix4(e.matrixWorld),this.union(Tr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,fn),fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vs),wr.subVectors(this.max,Vs),es.subVectors(e.a,Vs),ts.subVectors(e.b,Vs),ns.subVectors(e.c,Vs),Kn.subVectors(ts,es),Zn.subVectors(ns,ts),bi.subVectors(es,ns);let t=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-bi.z,bi.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,bi.z,0,-bi.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-bi.y,bi.x,0];return!Ha(t,es,ts,ns,wr)||(t=[1,0,0,0,1,0,0,0,1],!Ha(t,es,ts,ns,wr))?!1:(Ar.crossVectors(Kn,Zn),t=[Ar.x,Ar.y,Ar.z],Ha(t,es,ts,ns,wr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new G,new G,new G,new G,new G,new G,new G,new G],fn=new G,Tr=new Yi,es=new G,ts=new G,ns=new G,Kn=new G,Zn=new G,bi=new G,Vs=new G,wr=new G,Ar=new G,Ei=new G;function Ha(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ei.fromArray(i,r);const o=s.x*Math.abs(Ei.x)+s.y*Math.abs(Ei.y)+s.z*Math.abs(Ei.z),c=e.dot(Ei),l=t.dot(Ei),h=n.dot(Ei);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Lu=new Yi,Gs=new G,Va=new G;class Os{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Lu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gs.subVectors(e,this.center);const t=Gs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Gs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Va.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gs.copy(e.center).add(Va)),this.expandByPoint(Gs.copy(e.center).sub(Va))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const kn=new G,Ga=new G,Rr=new G,Jn=new G,Wa=new G,Cr=new G,Xa=new G;class Mh{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(kn.copy(this.origin).addScaledVector(this.direction,t),kn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ga.copy(e).add(t).multiplyScalar(.5),Rr.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(Ga);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Rr),o=Jn.dot(this.direction),c=-Jn.dot(Rr),l=Jn.lengthSq(),h=Math.abs(1-a*a);let d,f,m,v;if(h>0)if(d=a*c-o,f=a*o-c,v=r*h,d>=0)if(f>=-v)if(f<=v){const x=1/h;d*=x,f*=x,m=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f<=-v?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+f*(f+2*c)+l):f<=v?(d=0,f=Math.min(Math.max(-r,-c),r),m=f*(f+2*c)+l):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+f*(f+2*c)+l);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ga).addScaledVector(Rr,f),m}intersectSphere(e,t){kn.subVectors(e.center,this.origin);const n=kn.dot(this.direction),s=kn.dot(kn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,kn)!==null}intersectTriangle(e,t,n,s,r){Wa.subVectors(t,e),Cr.subVectors(n,e),Xa.crossVectors(Wa,Cr);let a=this.direction.dot(Xa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(Cr.crossVectors(Jn,Cr));if(c<0)return null;const l=o*this.direction.dot(Wa.cross(Jn));if(l<0||c+l>a)return null;const h=-o*Jn.dot(Xa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,n,s,r,a,o,c,l,h,d,f,m,v,x,g){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,d,f,m,v,x,g)}set(e,t,n,s,r,a,o,c,l,h,d,f,m,v,x,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=f,p[3]=m,p[7]=v,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/is.setFromMatrixColumn(e,0).length(),r=1/is.setFromMatrixColumn(e,1).length(),a=1/is.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const f=a*h,m=a*d,v=o*h,x=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=m+v*l,t[5]=f-x*l,t[9]=-o*c,t[2]=x-f*l,t[6]=v+m*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*h,m=c*d,v=l*h,x=l*d;t[0]=f+x*o,t[4]=v*o-m,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=m*o-v,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*h,m=c*d,v=l*h,x=l*d;t[0]=f-x*o,t[4]=-a*d,t[8]=v+m*o,t[1]=m+v*o,t[5]=a*h,t[9]=x-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*h,m=a*d,v=o*h,x=o*d;t[0]=c*h,t[4]=v*l-m,t[8]=f*l+x,t[1]=c*d,t[5]=x*l+f,t[9]=m*l-v,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*l,v=o*c,x=o*l;t[0]=c*h,t[4]=x-f*d,t[8]=v*d+m,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=m*d+v,t[10]=f-x*d}else if(e.order==="XZY"){const f=a*c,m=a*l,v=o*c,x=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=f*d+x,t[5]=a*h,t[9]=m*d-v,t[2]=v*d-m,t[6]=o*h,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Iu,e,Du)}lookAt(e,t,n){const s=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),Qn.crossVectors(n,Kt),Qn.lengthSq()===0&&(Math.abs(n.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),Qn.crossVectors(n,Kt)),Qn.normalize(),Pr.crossVectors(Kt,Qn),s[0]=Qn.x,s[4]=Pr.x,s[8]=Kt.x,s[1]=Qn.y,s[5]=Pr.y,s[9]=Kt.y,s[2]=Qn.z,s[6]=Pr.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],m=n[13],v=n[2],x=n[6],g=n[10],p=n[14],A=n[3],w=n[7],M=n[11],E=n[15],R=s[0],C=s[4],I=s[8],b=s[12],S=s[1],L=s[5],u=s[9],N=s[13],z=s[2],H=s[6],B=s[10],Q=s[14],F=s[3],K=s[7],ee=s[11],re=s[15];return r[0]=a*R+o*S+c*z+l*F,r[4]=a*C+o*L+c*H+l*K,r[8]=a*I+o*u+c*B+l*ee,r[12]=a*b+o*N+c*Q+l*re,r[1]=h*R+d*S+f*z+m*F,r[5]=h*C+d*L+f*H+m*K,r[9]=h*I+d*u+f*B+m*ee,r[13]=h*b+d*N+f*Q+m*re,r[2]=v*R+x*S+g*z+p*F,r[6]=v*C+x*L+g*H+p*K,r[10]=v*I+x*u+g*B+p*ee,r[14]=v*b+x*N+g*Q+p*re,r[3]=A*R+w*S+M*z+E*F,r[7]=A*C+w*L+M*H+E*K,r[11]=A*I+w*u+M*B+E*ee,r[15]=A*b+w*N+M*Q+E*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],f=e[10],m=e[14],v=e[3],x=e[7],g=e[11],p=e[15];return v*(+r*c*d-s*l*d-r*o*f+n*l*f+s*o*m-n*c*m)+x*(+t*c*m-t*l*f+r*a*f-s*a*m+s*l*h-r*c*h)+g*(+t*l*d-t*o*m-r*a*d+n*a*m+r*o*h-n*l*h)+p*(-s*o*h-t*c*d+t*o*f+s*a*d-n*a*f+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],m=e[11],v=e[12],x=e[13],g=e[14],p=e[15],A=d*g*l-x*f*l+x*c*m-o*g*m-d*c*p+o*f*p,w=v*f*l-h*g*l-v*c*m+a*g*m+h*c*p-a*f*p,M=h*x*l-v*d*l+v*o*m-a*x*m-h*o*p+a*d*p,E=v*d*c-h*x*c-v*o*f+a*x*f+h*o*g-a*d*g,R=t*A+n*w+s*M+r*E;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return e[0]=A*C,e[1]=(x*f*r-d*g*r-x*s*m+n*g*m+d*s*p-n*f*p)*C,e[2]=(o*g*r-x*c*r+x*s*l-n*g*l-o*s*p+n*c*p)*C,e[3]=(d*c*r-o*f*r-d*s*l+n*f*l+o*s*m-n*c*m)*C,e[4]=w*C,e[5]=(h*g*r-v*f*r+v*s*m-t*g*m-h*s*p+t*f*p)*C,e[6]=(v*c*r-a*g*r-v*s*l+t*g*l+a*s*p-t*c*p)*C,e[7]=(a*f*r-h*c*r+h*s*l-t*f*l-a*s*m+t*c*m)*C,e[8]=M*C,e[9]=(v*d*r-h*x*r-v*n*m+t*x*m+h*n*p-t*d*p)*C,e[10]=(a*x*r-v*o*r+v*n*l-t*x*l-a*n*p+t*o*p)*C,e[11]=(h*o*r-a*d*r-h*n*l+t*d*l+a*n*m-t*o*m)*C,e[12]=E*C,e[13]=(h*x*s-v*d*s+v*n*f-t*x*f-h*n*g+t*d*g)*C,e[14]=(v*o*s-a*x*s-v*n*c+t*x*c+a*n*g-t*o*g)*C,e[15]=(a*d*s-h*o*s+h*n*c-t*d*c-a*n*f+t*o*f)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,f=r*l,m=r*h,v=r*d,x=a*h,g=a*d,p=o*d,A=c*l,w=c*h,M=c*d,E=n.x,R=n.y,C=n.z;return s[0]=(1-(x+p))*E,s[1]=(m+M)*E,s[2]=(v-w)*E,s[3]=0,s[4]=(m-M)*R,s[5]=(1-(f+p))*R,s[6]=(g+A)*R,s[7]=0,s[8]=(v+w)*C,s[9]=(g-A)*C,s[10]=(1-(f+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=is.set(s[0],s[1],s[2]).length();const a=is.set(s[4],s[5],s[6]).length(),o=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],pn.copy(this);const l=1/r,h=1/a,d=1/o;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=d,pn.elements[9]*=d,pn.elements[10]*=d,t.setFromRotationMatrix(pn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Pn,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-s),f=(t+e)/(t-e),m=(n+s)/(n-s);let v,x;if(c)v=r/(a-r),x=a*r/(a-r);else if(o===Pn)v=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===oa)v=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=v,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Pn,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-s),f=-(t+e)/(t-e),m=-(n+s)/(n-s);let v,x;if(c)v=1/(a-r),x=a/(a-r);else if(o===Pn)v=-2/(a-r),x=-(a+r)/(a-r);else if(o===oa)v=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=v,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const is=new G,pn=new ht,Iu=new G(0,0,0),Du=new G(1,1,1),Qn=new G,Pr=new G,Kt=new G,rc=new ht,ac=new _r;class Xn{constructor(e=0,t=0,n=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ge(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return rc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ac.setFromEuler(this),this.setFromQuaternion(ac,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class yh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Uu=0;const oc=new G,ss=new _r,On=new ht,Lr=new G,Ws=new G,Nu=new G,ku=new _r,lc=new G(1,0,0),cc=new G(0,1,0),hc=new G(0,0,1),dc={type:"added"},Ou={type:"removed"},rs={type:"childadded",child:null},qa={type:"childremoved",child:null};class Ft extends ks{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new G,t=new Xn,n=new _r,s=new G(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ht},normalMatrix:{value:new Oe}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.multiply(ss),this}rotateOnWorldAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.premultiply(ss),this}rotateX(e){return this.rotateOnAxis(lc,e)}rotateY(e){return this.rotateOnAxis(cc,e)}rotateZ(e){return this.rotateOnAxis(hc,e)}translateOnAxis(e,t){return oc.copy(e).applyQuaternion(this.quaternion),this.position.add(oc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(lc,e)}translateY(e){return this.translateOnAxis(cc,e)}translateZ(e){return this.translateOnAxis(hc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Lr.copy(e):Lr.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt(Ws,Lr,this.up):On.lookAt(Lr,Ws,this.up),this.quaternion.setFromRotationMatrix(On),s&&(On.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(On),this.quaternion.premultiply(ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dc),rs.child=e,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ou),qa.child=e,this.dispatchEvent(qa),qa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),On.multiply(e.parent.matrixWorld)),e.applyMatrix4(On),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dc),rs.child=e,this.dispatchEvent(rs),rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ws,e,Nu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ws,ku,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),f=a(e.skeletons),m=a(e.animations),v=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ft.DEFAULT_UP=new G(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mn=new G,Fn=new G,$a=new G,Bn=new G,as=new G,os=new G,uc=new G,Ya=new G,ja=new G,Ka=new G,Za=new yt,Ja=new yt,Qa=new yt;class cn{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),mn.subVectors(e,t),s.cross(mn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){mn.subVectors(s,t),Fn.subVectors(n,t),$a.subVectors(e,t);const a=mn.dot(mn),o=mn.dot(Fn),c=mn.dot($a),l=Fn.dot(Fn),h=Fn.dot($a),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const f=1/d,m=(l*c-o*h)*f,v=(a*h-o*c)*f;return r.set(1-m-v,v,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bn.x),c.addScaledVector(a,Bn.y),c.addScaledVector(o,Bn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Za.setScalar(0),Ja.setScalar(0),Qa.setScalar(0),Za.fromBufferAttribute(e,t),Ja.fromBufferAttribute(e,n),Qa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Za,r.x),a.addScaledVector(Ja,r.y),a.addScaledVector(Qa,r.z),a}static isFrontFacing(e,t,n,s){return mn.subVectors(n,t),Fn.subVectors(e,t),mn.cross(Fn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),mn.cross(Fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return cn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;as.subVectors(s,n),os.subVectors(r,n),Ya.subVectors(e,n);const c=as.dot(Ya),l=os.dot(Ya);if(c<=0&&l<=0)return t.copy(n);ja.subVectors(e,s);const h=as.dot(ja),d=os.dot(ja);if(h>=0&&d<=h)return t.copy(s);const f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(as,a);Ka.subVectors(e,r);const m=as.dot(Ka),v=os.dot(Ka);if(v>=0&&m<=v)return t.copy(r);const x=m*l-c*v;if(x<=0&&l>=0&&v<=0)return o=l/(l-v),t.copy(n).addScaledVector(os,o);const g=h*v-m*d;if(g<=0&&d-h>=0&&m-v>=0)return uc.subVectors(r,s),o=(d-h)/(d-h+(m-v)),t.copy(s).addScaledVector(uc,o);const p=1/(g+x+f);return a=x*p,o=f*p,t.copy(n).addScaledVector(as,a).addScaledVector(os,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Sh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},Ir={h:0,s:0,l:0};function eo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class je{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=Su(e,1),t=Ge(t,0,1),n=Ge(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=eo(a,r,e+1/3),this.g=eo(a,r,e),this.b=eo(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=mt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=mt){const n=Sh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gn(e.r),this.g=Gn(e.g),this.b=Gn(e.b),this}copyLinearToSRGB(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=mt){return Ye.workingToColorSpace(Ut.copy(this),e),Math.round(Ge(Ut.r*255,0,255))*65536+Math.round(Ge(Ut.g*255,0,255))*256+Math.round(Ge(Ut.b*255,0,255))}getHexString(e=mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Ut.copy(this),t);const n=Ut.r,s=Ut.g,r=Ut.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=mt){Ye.workingToColorSpace(Ut.copy(this),e);const t=Ut.r,n=Ut.g,s=Ut.b;return e!==mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ei),this.setHSL(ei.h+e,ei.s+t,ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ei),e.getHSL(Ir);const n=ka(ei.h,Ir.h,t),s=ka(ei.s,Ir.s,t),r=ka(ei.l,Ir.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ut=new je;je.NAMES=Sh;let Fu=0;class Fs extends ks{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=Es,this.side=vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yo,this.blendDst=So,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ql,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Es&&(n.blending=this.blending),this.side!==vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==yo&&(n.blendSrc=this.blendSrc),this.blendDst!==So&&(n.blendDst=this.blendDst),this.blendEquation!==Di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ql&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class gn extends Fs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const St=new G,Dr=new We;let Bu=0;class hn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ol,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Dr.fromBufferAttribute(this,t),Dr.applyMatrix3(e),this.setXY(t,Dr.x,Dr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wn(t,this.array)),t}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wn(t,this.array)),t}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wn(t,this.array)),t}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array),r=tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ol&&(e.usage=this.usage),e}}class bh extends hn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Eh extends hn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class mi extends hn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let zu=0;const an=new ht,to=new Ft,ls=new G,Zt=new Yi,Xs=new Yi,wt=new G;class In extends ks{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_h(e)?Eh:bh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Oe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return an.makeRotationFromQuaternion(e),this.applyMatrix4(an),this}rotateX(e){return an.makeRotationX(e),this.applyMatrix4(an),this}rotateY(e){return an.makeRotationY(e),this.applyMatrix4(an),this}rotateZ(e){return an.makeRotationZ(e),this.applyMatrix4(an),this}translate(e,t,n){return an.makeTranslation(e,t,n),this.applyMatrix4(an),this}scale(e,t,n){return an.makeScale(e,t,n),this.applyMatrix4(an),this}lookAt(e){return to.lookAt(e),to.updateMatrix(),this.applyMatrix4(to.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new mi(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Os);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(e){const n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Xs.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Zt.min,Xs.min),Zt.expandByPoint(wt),wt.addVectors(Zt.max,Xs.max),Zt.expandByPoint(wt)):(Zt.expandByPoint(Xs.min),Zt.expandByPoint(Xs.max))}Zt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(wt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)wt.fromBufferAttribute(o,l),c&&(ls.fromBufferAttribute(e,l),wt.add(ls)),s=Math.max(s,n.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let I=0;I<n.count;I++)o[I]=new G,c[I]=new G;const l=new G,h=new G,d=new G,f=new We,m=new We,v=new We,x=new G,g=new G;function p(I,b,S){l.fromBufferAttribute(n,I),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,S),f.fromBufferAttribute(r,I),m.fromBufferAttribute(r,b),v.fromBufferAttribute(r,S),h.sub(l),d.sub(l),m.sub(f),v.sub(f);const L=1/(m.x*v.y-v.x*m.y);isFinite(L)&&(x.copy(h).multiplyScalar(v.y).addScaledVector(d,-m.y).multiplyScalar(L),g.copy(d).multiplyScalar(m.x).addScaledVector(h,-v.x).multiplyScalar(L),o[I].add(x),o[b].add(x),o[S].add(x),c[I].add(g),c[b].add(g),c[S].add(g))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let I=0,b=A.length;I<b;++I){const S=A[I],L=S.start,u=S.count;for(let N=L,z=L+u;N<z;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const w=new G,M=new G,E=new G,R=new G;function C(I){E.fromBufferAttribute(s,I),R.copy(E);const b=o[I];w.copy(b),w.sub(E.multiplyScalar(E.dot(b))).normalize(),M.crossVectors(R,b);const L=M.dot(c[I])<0?-1:1;a.setXYZW(I,w.x,w.y,w.z,L)}for(let I=0,b=A.length;I<b;++I){const S=A[I],L=S.start,u=S.count;for(let N=L,z=L+u;N<z;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new hn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new G,r=new G,a=new G,o=new G,c=new G,l=new G,h=new G,d=new G;if(e)for(let f=0,m=e.count;f<m;f+=3){const v=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,v),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,v),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,f=new l.constructor(c.length*h);let m=0,v=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?m=c[x]*o.data.stride+o.offset:m=c[x]*h;for(let p=0;p<h;p++)f[v++]=l[m++]}return new hn(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new In,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const f=l[h],m=e(f,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){const m=l[d];h.push(m.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fc=new ht,Ti=new Mh,Ur=new Os,pc=new G,Nr=new G,kr=new G,Or=new G,no=new G,Fr=new G,mc=new G,Br=new G;class Gt extends Ft{constructor(e=new In,t=new gn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Fr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(no.fromBufferAttribute(d,e),a?Fr.addScaledVector(no,h):Fr.addScaledVector(no.sub(t),h))}t.add(Fr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(r),Ti.copy(e.ray).recast(e.near),!(Ur.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(Ur,pc)===null||Ti.origin.distanceToSquared(pc)>(e.far-e.near)**2))&&(fc.copy(r).invert(),Ti.copy(e.ray).applyMatrix4(fc),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ti)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,x=f.length;v<x;v++){const g=f[v],p=a[g.materialIndex],A=Math.max(g.start,m.start),w=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let M=A,E=w;M<E;M+=3){const R=o.getX(M),C=o.getX(M+1),I=o.getX(M+2);s=zr(this,p,e,n,l,h,d,R,C,I),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const v=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let g=v,p=x;g<p;g+=3){const A=o.getX(g),w=o.getX(g+1),M=o.getX(g+2);s=zr(this,a,e,n,l,h,d,A,w,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let v=0,x=f.length;v<x;v++){const g=f[v],p=a[g.materialIndex],A=Math.max(g.start,m.start),w=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let M=A,E=w;M<E;M+=3){const R=M,C=M+1,I=M+2;s=zr(this,p,e,n,l,h,d,R,C,I),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const v=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let g=v,p=x;g<p;g+=3){const A=g,w=g+1,M=g+2;s=zr(this,a,e,n,l,h,d,A,w,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function Hu(i,e,t,n,s,r,a,o){let c;if(e.side===$t?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===vi,o),c===null)return null;Br.copy(o),Br.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Br);return l<t.near||l>t.far?null:{distance:l,point:Br.clone(),object:i}}function zr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Nr),i.getVertexPosition(c,kr),i.getVertexPosition(l,Or);const h=Hu(i,e,t,n,Nr,kr,Or,mc);if(h){const d=new G;cn.getBarycoord(mc,Nr,kr,Or,d),s&&(h.uv=cn.getInterpolatedAttribute(s,o,c,l,d,new We)),r&&(h.uv1=cn.getInterpolatedAttribute(r,o,c,l,d,new We)),a&&(h.normal=cn.getInterpolatedAttribute(a,o,c,l,d,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new G,materialIndex:0};cn.getNormal(Nr,kr,Or,f.normal),h.face=f,h.barycoord=d}return h}class xr extends In{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let f=0,m=0;v("z","y","x",-1,-1,n,t,e,a,r,0),v("z","y","x",1,-1,n,t,-e,a,r,1),v("x","z","y",1,1,e,n,t,s,a,2),v("x","z","y",1,-1,e,n,-t,s,a,3),v("x","y","z",1,-1,e,t,n,s,r,4),v("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new mi(l,3)),this.setAttribute("normal",new mi(h,3)),this.setAttribute("uv",new mi(d,2));function v(x,g,p,A,w,M,E,R,C,I,b){const S=M/C,L=E/I,u=M/2,N=E/2,z=R/2,H=C+1,B=I+1;let Q=0,F=0;const K=new G;for(let ee=0;ee<B;ee++){const re=ee*L-N;for(let we=0;we<H;we++){const Je=we*S-u;K[x]=Je*A,K[g]=re*w,K[p]=z,l.push(K.x,K.y,K.z),K[x]=0,K[g]=0,K[p]=R>0?1:-1,h.push(K.x,K.y,K.z),d.push(we/C),d.push(1-ee/I),Q+=1}}for(let ee=0;ee<I;ee++)for(let re=0;re<C;re++){const we=f+re+H*ee,Je=f+re+H*(ee+1),st=f+(re+1)+H*(ee+1),qe=f+(re+1)+H*ee;c.push(we,Je,qe),c.push(Je,st,qe),F+=6}o.addGroup(m,F,b),m+=F,f+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ds(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Vt(i){const e={};for(let t=0;t<i.length;t++){const n=Ds(i[t]);for(const s in n)e[s]=n[s]}return e}function Vu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Th(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const Gu={clone:Ds,merge:Vt};var Wu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _i extends Fs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wu,this.fragmentShader=Xu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ds(e.uniforms),this.uniformsGroups=Vu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class wh extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Pn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ti=new G,gc=new We,vc=new We;class _n extends wh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ll*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Na*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ll*2*Math.atan(Math.tan(Na*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ti.x,ti.y).multiplyScalar(-e/ti.z),ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ti.x,ti.y).multiplyScalar(-e/ti.z)}getViewSize(e,t){return this.getViewBounds(e,gc,vc),t.subVectors(vc,gc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Na*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const cs=-90,hs=1;class qu extends Ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new _n(cs,hs,e,t);s.layers=this.layers,this.add(s);const r=new _n(cs,hs,e,t);r.layers=this.layers,this.add(r);const a=new _n(cs,hs,e,t);a.layers=this.layers,this.add(a);const o=new _n(cs,hs,e,t);o.layers=this.layers,this.add(o);const c=new _n(cs,hs,e,t);c.layers=this.layers,this.add(c);const l=new _n(cs,hs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===oa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,f,m),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Ah extends Lt{constructor(e=[],t=Ps,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $u extends Xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ah(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xr(5,5,5),r=new _i({name:"CubemapFromEquirect",uniforms:Ds(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$t,blending:ui});r.uniforms.tEquirect.value=t;const a=new Gt(s,r),o=t.minFilter;return t.minFilter===hi&&(t.minFilter=Rn),new qu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Hr extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Yu={type:"move"};class io{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const x of e.hand.values()){const g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,v=.005;l.inputState.pinching&&f>m+v?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=m-v&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Yu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Hr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class ju extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ku{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ol,this.updateRanges=[],this.version=0,this.uuid=pi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ht=new G;class la{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=wn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=wn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=wn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=wn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=wn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),s=tt(s,this.array),r=tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new hn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new la(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class cl extends Fs{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new je(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ds;const qs=new G,us=new G,fs=new G,ps=new We,$s=new We,Rh=new ht,Vr=new G,Ys=new G,Gr=new G,_c=new We,so=new We,xc=new We;class ro extends Ft{constructor(e=new cl){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new In;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ku(t,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new la(n,3,0,!1)),ds.setAttribute("uv",new la(n,2,3,!1))}this.geometry=ds,this.material=e,this.center=new We(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),us.setFromMatrixScale(this.matrixWorld),Rh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),fs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&us.multiplyScalar(-fs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Wr(Vr.set(-.5,-.5,0),fs,a,us,s,r),Wr(Ys.set(.5,-.5,0),fs,a,us,s,r),Wr(Gr.set(.5,.5,0),fs,a,us,s,r),_c.set(0,0),so.set(1,0),xc.set(1,1);let o=e.ray.intersectTriangle(Vr,Ys,Gr,!1,qs);if(o===null&&(Wr(Ys.set(-.5,.5,0),fs,a,us,s,r),so.set(0,1),o=e.ray.intersectTriangle(Vr,Gr,Ys,!1,qs),o===null))return;const c=e.ray.origin.distanceTo(qs);c<e.near||c>e.far||t.push({distance:c,point:qs.clone(),uv:cn.getInterpolation(qs,Vr,Ys,Gr,_c,so,xc,new We),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Wr(i,e,t,n,s,r){ps.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?($s.x=r*ps.x-s*ps.y,$s.y=s*ps.x+r*ps.y):$s.copy(ps),i.copy(e),i.x+=$s.x,i.y+=$s.y,i.applyMatrix4(Rh)}class Zu extends Lt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=gt,h=gt,d,f){super(null,a,o,c,l,h,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Mc extends hn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ms=new ht,yc=new ht,Xr=[],Sc=new Yi,Ju=new ht,js=new Gt,Ks=new Os;class wi extends Gt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Mc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ju)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Yi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ms),Sc.copy(e.boundingBox).applyMatrix4(ms),this.boundingBox.union(Sc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Os),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ms),Ks.copy(e.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(Ks)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(js.geometry=this.geometry,js.material=this.material,js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ks.copy(this.boundingSphere),Ks.applyMatrix4(n),e.ray.intersectsSphere(Ks)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ms),yc.multiplyMatrices(n,ms),js.matrixWorld=yc,js.raycast(e,Xr);for(let a=0,o=Xr.length;a<o;a++){const c=Xr[a];c.instanceId=r,c.object=this,t.push(c)}Xr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Mc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zu(new Float32Array(s*this.count),s,this.count,Al,Cn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ao=new G,Qu=new G,ef=new Oe;class Pi{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ao.subVectors(n,t).cross(Qu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ao),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||ef.getNormalMatrix(e),s=this.coplanarPoint(ao).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ai=new Os,tf=new We(.5,.5),qr=new G;class Ch{constructor(e=new Pi,t=new Pi,n=new Pi,s=new Pi,r=new Pi,a=new Pi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Pn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],f=r[6],m=r[7],v=r[8],x=r[9],g=r[10],p=r[11],A=r[12],w=r[13],M=r[14],E=r[15];if(s[0].setComponents(l-a,m-h,p-v,E-A).normalize(),s[1].setComponents(l+a,m+h,p+v,E+A).normalize(),s[2].setComponents(l+o,m+d,p+x,E+w).normalize(),s[3].setComponents(l-o,m-d,p-x,E-w).normalize(),n)s[4].setComponents(c,f,g,M).normalize(),s[5].setComponents(l-c,m-f,p-g,E-M).normalize();else if(s[4].setComponents(l-c,m-f,p-g,E-M).normalize(),t===Pn)s[5].setComponents(l+c,m+f,p+g,E+M).normalize();else if(t===oa)s[5].setComponents(c,f,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ai)}intersectsSprite(e){Ai.center.set(0,0,0);const t=tf.distanceTo(e.center);return Ai.radius=.7071067811865476+t,Ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ai)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(qr.x=s.normal.x>0?e.max.x:e.min.x,qr.y=s.normal.y>0?e.max.y:e.min.y,qr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(qr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ph extends Fs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ca=new G,ha=new G,bc=new ht,Zs=new Mh,$r=new Os,oo=new G,Ec=new G;class nf extends Ft{constructor(e=new In,t=new Ph){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ca.fromBufferAttribute(t,s-1),ha.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ca.distanceTo(ha);e.setAttribute("lineDistance",new mi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$r.copy(n.boundingSphere),$r.applyMatrix4(s),$r.radius+=r,e.ray.intersectsSphere($r)===!1)return;bc.copy(s).invert(),Zs.copy(e.ray).applyMatrix4(bc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),v=Math.min(h.count,a.start+a.count);for(let x=m,g=v-1;x<g;x+=l){const p=h.getX(x),A=h.getX(x+1),w=Yr(this,e,Zs,c,p,A,x);w&&t.push(w)}if(this.isLineLoop){const x=h.getX(v-1),g=h.getX(m),p=Yr(this,e,Zs,c,x,g,v-1);p&&t.push(p)}}else{const m=Math.max(0,a.start),v=Math.min(f.count,a.start+a.count);for(let x=m,g=v-1;x<g;x+=l){const p=Yr(this,e,Zs,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=Yr(this,e,Zs,c,v-1,m,v-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Yr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(ca.fromBufferAttribute(o,s),ha.fromBufferAttribute(o,r),t.distanceSqToSegment(ca,ha,oo,Ec)>n)return;oo.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(oo);if(!(l<e.near||l>e.far))return{distance:l,point:Ec.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Tc extends nf{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class ir extends Lt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Lh extends Lt{constructor(e,t,n=Wi,s,r,a,o=gt,c=gt,l,h=ur,d=1){if(h!==ur&&h!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ll(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Ih extends Lt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Jt extends In{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,d=e/o,f=t/c,m=[],v=[],x=[],g=[];for(let p=0;p<h;p++){const A=p*f-a;for(let w=0;w<l;w++){const M=w*d-r;v.push(M,-A,0),x.push(0,0,1),g.push(w/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let A=0;A<o;A++){const w=A+l*p,M=A+l*(p+1),E=A+1+l*(p+1),R=A+1+l*p;m.push(w,M,R),m.push(M,E,R)}this.setIndex(m),this.setAttribute("position",new mi(v,3)),this.setAttribute("normal",new mi(x,3)),this.setAttribute("uv",new mi(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jt(e.width,e.height,e.widthSegments,e.heightSegments)}}class sf extends Fs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=du,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class rf extends Fs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const lo={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class af{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){const m=l[d],v=l[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const of=new af;class Il{constructor(e){this.manager=e!==void 0?e:of,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Il.DEFAULT_MATERIAL_NAME="__DEFAULT";const gs=new WeakMap;class lf extends Il{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=lo.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=gs.get(a);d===void 0&&(d=[],gs.set(a,d)),d.push({onLoad:t,onError:s})}return a}const o=pr("img");function c(){h(),t&&t(this);const d=gs.get(this)||[];for(let f=0;f<d.length;f++){const m=d[f];m.onLoad&&m.onLoad(this)}gs.delete(this),r.manager.itemEnd(e)}function l(d){h(),s&&s(d),lo.remove(`image:${e}`);const f=gs.get(this)||[];for(let m=0;m<f.length;m++){const v=f[m];v.onError&&v.onError(d)}gs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),lo.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Dl extends Il{constructor(e){super(e)}load(e,t,n,s){const r=new Lt,a=new lf(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Dh extends wh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class cf extends _n{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function wc(i,e,t,n){const s=hf(n);switch(t){case ph:return i*e;case Al:return i*e/s.components*s.byteLength;case Rl:return i*e/s.components*s.byteLength;case gh:return i*e*2/s.components*s.byteLength;case Cl:return i*e*2/s.components*s.byteLength;case mh:return i*e*3/s.components*s.byteLength;case Mn:return i*e*4/s.components*s.byteLength;case Pl:return i*e*4/s.components*s.byteLength;case Qr:case ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ta:case na:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uo:case ko:return Math.max(i,16)*Math.max(e,8)/4;case Do:case No:return Math.max(i,8)*Math.max(e,8)/2;case Oo:case Fo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ho:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Vo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case qo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $o:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Yo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case jo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ko:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Jo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Qo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case el:case tl:case nl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case il:case sl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case rl:case al:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function hf(i){switch(i){case Wn:case hh:return{byteLength:1,components:1};case hr:case dh:case vr:return{byteLength:2,components:1};case Tl:case wl:return{byteLength:2,components:4};case Wi:case El:case Cn:return{byteLength:4,components:1};case uh:case fh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bl);function Uh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function df(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,h);else{d.sort((m,v)=>m.start-v.start);let f=0;for(let m=1;m<d.length;m++){const v=d[f],x=d[m];x.start<=v.start+v.count+1?v.count=Math.max(v.count,x.start+x.count-v.start):(++f,d[f]=x)}d.length=f+1;for(let m=0,v=d.length;m<v;m++){const x=d[m];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ff=`#ifdef USE_ALPHAHASH
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
#endif`,pf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_f=`#ifdef USE_AOMAP
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
#endif`,xf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mf=`#ifdef USE_BATCHING
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
#endif`,yf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Sf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ef=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tf=`#ifdef USE_IRIDESCENCE
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
#endif`,wf=`#ifdef USE_BUMPMAP
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
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Nf=`#define PI 3.141592653589793
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
} // validated`,kf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Of=`vec3 transformedNormal = objectNormal;
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
#endif`,Ff=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Vf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qf=`#ifdef USE_ENVMAP
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
#endif`,$f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yf=`#ifdef USE_ENVMAP
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
#endif`,jf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qf=`#ifdef USE_GRADIENTMAP
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
}`,ep=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ip=`uniform bool receiveShadow;
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
#endif`,sp=`#ifdef USE_ENVMAP
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
#endif`,rp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,op=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cp=`PhysicalMaterial material;
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
#endif`,hp=`struct PhysicalMaterial {
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
}`,dp=`
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
#endif`,up=`#if defined( RE_IndirectDiffuse )
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
#endif`,fp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_p=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yp=`#if defined( USE_POINTS_UV )
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
#endif`,Sp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,bp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ep=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ap=`#ifdef USE_MORPHTARGETS
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
#endif`,Rp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Lp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Up=`#ifdef USE_NORMALMAP
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
#endif`,Np=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Op=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bp=`#ifdef OPAQUE
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
}`,Hp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Wp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$p=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Kp=`float getShadowMask() {
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
}`,Zp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jp=`#ifdef USE_SKINNING
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
#endif`,Qp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,em=`#ifdef USE_SKINNING
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
#endif`,tm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,nm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,im=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,rm=`#ifdef USE_TRANSMISSION
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
#endif`,am=`#ifdef USE_TRANSMISSION
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
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,um=`uniform sampler2D t2D;
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
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vm=`#include <common>
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
}`,_m=`#if DEPTH_PACKING == 3200
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
}`,xm=`#define DISTANCE
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
}`,Mm=`#define DISTANCE
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bm=`uniform float scale;
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
}`,Em=`uniform vec3 diffuse;
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
}`,Tm=`#include <common>
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
}`,wm=`uniform vec3 diffuse;
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
}`,Am=`#define LAMBERT
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
}`,Rm=`#define LAMBERT
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
}`,Cm=`#define MATCAP
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
}`,Pm=`#define MATCAP
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
}`,Lm=`#define NORMAL
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
}`,Im=`#define NORMAL
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
}`,Dm=`#define PHONG
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
}`,Um=`#define PHONG
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
}`,Nm=`#define STANDARD
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
}`,km=`#define STANDARD
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
}`,Om=`#define TOON
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
}`,Fm=`#define TOON
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
}`,Bm=`uniform float size;
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
}`,Hm=`#include <common>
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
}`,Vm=`uniform vec3 color;
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
}`,Gm=`uniform float rotation;
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
}`,Wm=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:uf,alphahash_pars_fragment:ff,alphamap_fragment:pf,alphamap_pars_fragment:mf,alphatest_fragment:gf,alphatest_pars_fragment:vf,aomap_fragment:_f,aomap_pars_fragment:xf,batching_pars_vertex:Mf,batching_vertex:yf,begin_vertex:Sf,beginnormal_vertex:bf,bsdfs:Ef,iridescence_fragment:Tf,bumpmap_pars_fragment:wf,clipping_planes_fragment:Af,clipping_planes_pars_fragment:Rf,clipping_planes_pars_vertex:Cf,clipping_planes_vertex:Pf,color_fragment:Lf,color_pars_fragment:If,color_pars_vertex:Df,color_vertex:Uf,common:Nf,cube_uv_reflection_fragment:kf,defaultnormal_vertex:Of,displacementmap_pars_vertex:Ff,displacementmap_vertex:Bf,emissivemap_fragment:zf,emissivemap_pars_fragment:Hf,colorspace_fragment:Vf,colorspace_pars_fragment:Gf,envmap_fragment:Wf,envmap_common_pars_fragment:Xf,envmap_pars_fragment:qf,envmap_pars_vertex:$f,envmap_physical_pars_fragment:sp,envmap_vertex:Yf,fog_vertex:jf,fog_pars_vertex:Kf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Qf,lightmap_pars_fragment:ep,lights_lambert_fragment:tp,lights_lambert_pars_fragment:np,lights_pars_begin:ip,lights_toon_fragment:rp,lights_toon_pars_fragment:ap,lights_phong_fragment:op,lights_phong_pars_fragment:lp,lights_physical_fragment:cp,lights_physical_pars_fragment:hp,lights_fragment_begin:dp,lights_fragment_maps:up,lights_fragment_end:fp,logdepthbuf_fragment:pp,logdepthbuf_pars_fragment:mp,logdepthbuf_pars_vertex:gp,logdepthbuf_vertex:vp,map_fragment:_p,map_pars_fragment:xp,map_particle_fragment:Mp,map_particle_pars_fragment:yp,metalnessmap_fragment:Sp,metalnessmap_pars_fragment:bp,morphinstance_vertex:Ep,morphcolor_vertex:Tp,morphnormal_vertex:wp,morphtarget_pars_vertex:Ap,morphtarget_vertex:Rp,normal_fragment_begin:Cp,normal_fragment_maps:Pp,normal_pars_fragment:Lp,normal_pars_vertex:Ip,normal_vertex:Dp,normalmap_pars_fragment:Up,clearcoat_normal_fragment_begin:Np,clearcoat_normal_fragment_maps:kp,clearcoat_pars_fragment:Op,iridescence_pars_fragment:Fp,opaque_fragment:Bp,packing:zp,premultiplied_alpha_fragment:Hp,project_vertex:Vp,dithering_fragment:Gp,dithering_pars_fragment:Wp,roughnessmap_fragment:Xp,roughnessmap_pars_fragment:qp,shadowmap_pars_fragment:$p,shadowmap_pars_vertex:Yp,shadowmap_vertex:jp,shadowmask_pars_fragment:Kp,skinbase_vertex:Zp,skinning_pars_vertex:Jp,skinning_vertex:Qp,skinnormal_vertex:em,specularmap_fragment:tm,specularmap_pars_fragment:nm,tonemapping_fragment:im,tonemapping_pars_fragment:sm,transmission_fragment:rm,transmission_pars_fragment:am,uv_pars_fragment:om,uv_pars_vertex:lm,uv_vertex:cm,worldpos_vertex:hm,background_vert:dm,background_frag:um,backgroundCube_vert:fm,backgroundCube_frag:pm,cube_vert:mm,cube_frag:gm,depth_vert:vm,depth_frag:_m,distanceRGBA_vert:xm,distanceRGBA_frag:Mm,equirect_vert:ym,equirect_frag:Sm,linedashed_vert:bm,linedashed_frag:Em,meshbasic_vert:Tm,meshbasic_frag:wm,meshlambert_vert:Am,meshlambert_frag:Rm,meshmatcap_vert:Cm,meshmatcap_frag:Pm,meshnormal_vert:Lm,meshnormal_frag:Im,meshphong_vert:Dm,meshphong_frag:Um,meshphysical_vert:Nm,meshphysical_frag:km,meshtoon_vert:Om,meshtoon_frag:Fm,points_vert:Bm,points_frag:zm,shadow_vert:Hm,shadow_frag:Vm,sprite_vert:Gm,sprite_frag:Wm},ce={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Tn={basic:{uniforms:Vt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Vt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new je(0)}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Vt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Vt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Vt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new je(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Vt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Vt([ce.points,ce.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Vt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Vt([ce.common,ce.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Vt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Vt([ce.sprite,ce.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distanceRGBA:{uniforms:Vt([ce.common,ce.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distanceRGBA_vert,fragmentShader:Be.distanceRGBA_frag},shadow:{uniforms:Vt([ce.lights,ce.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};Tn.physical={uniforms:Vt([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const jr={r:0,b:0,g:0},Ri=new Xn,Xm=new ht;function qm(i,e,t,n,s,r,a){const o=new je(0);let c=r===!0?0:1,l,h,d=null,f=0,m=null;function v(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?t:e).get(M)),M}function x(w){let M=!1;const E=v(w);E===null?p(o,c):E&&E.isColor&&(p(E,1),M=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(w,M){const E=v(M);E&&(E.isCubeTexture||E.mapping===Ma)?(h===void 0&&(h=new Gt(new xr(1,1,1),new _i({name:"BackgroundCubeMaterial",uniforms:Ds(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ri.copy(M.backgroundRotation),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),h.material.uniforms.envMap.value=E,h.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Xm.makeRotationFromEuler(Ri)),h.material.toneMapped=Ye.getTransfer(E.colorSpace)!==et,(d!==E||f!==E.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=E,f=E.version,m=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Gt(new Jt(2,2),new _i({name:"BackgroundMaterial",uniforms:Ds(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(E.colorSpace)!==et,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||f!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=E,f=E.version,m=i.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function p(w,M){w.getRGB(jr,Th(i)),n.buffers.color.setClear(jr.r,jr.g,jr.b,M,a)}function A(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(w,M=1){o.set(w),c=M,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,p(o,c)},render:x,addToRenderList:g,dispose:A}}function $m(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(S,L,u,N,z){let H=!1;const B=d(N,u,L);r!==B&&(r=B,l(r.object)),H=m(S,N,u,z),H&&v(S,N,u,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,M(S,L,u,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,L,u){const N=u.wireframe===!0;let z=n[S.id];z===void 0&&(z={},n[S.id]=z);let H=z[L.id];H===void 0&&(H={},z[L.id]=H);let B=H[N];return B===void 0&&(B=f(c()),H[N]=B),B}function f(S){const L=[],u=[],N=[];for(let z=0;z<t;z++)L[z]=0,u[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:u,attributeDivisors:N,object:S,attributes:{},index:null}}function m(S,L,u,N){const z=r.attributes,H=L.attributes;let B=0;const Q=u.getAttributes();for(const F in Q)if(Q[F].location>=0){const ee=z[F];let re=H[F];if(re===void 0&&(F==="instanceMatrix"&&S.instanceMatrix&&(re=S.instanceMatrix),F==="instanceColor"&&S.instanceColor&&(re=S.instanceColor)),ee===void 0||ee.attribute!==re||re&&ee.data!==re.data)return!0;B++}return r.attributesNum!==B||r.index!==N}function v(S,L,u,N){const z={},H=L.attributes;let B=0;const Q=u.getAttributes();for(const F in Q)if(Q[F].location>=0){let ee=H[F];ee===void 0&&(F==="instanceMatrix"&&S.instanceMatrix&&(ee=S.instanceMatrix),F==="instanceColor"&&S.instanceColor&&(ee=S.instanceColor));const re={};re.attribute=ee,ee&&ee.data&&(re.data=ee.data),z[F]=re,B++}r.attributes=z,r.attributesNum=B,r.index=N}function x(){const S=r.newAttributes;for(let L=0,u=S.length;L<u;L++)S[L]=0}function g(S){p(S,0)}function p(S,L){const u=r.newAttributes,N=r.enabledAttributes,z=r.attributeDivisors;u[S]=1,N[S]===0&&(i.enableVertexAttribArray(S),N[S]=1),z[S]!==L&&(i.vertexAttribDivisor(S,L),z[S]=L)}function A(){const S=r.newAttributes,L=r.enabledAttributes;for(let u=0,N=L.length;u<N;u++)L[u]!==S[u]&&(i.disableVertexAttribArray(u),L[u]=0)}function w(S,L,u,N,z,H,B){B===!0?i.vertexAttribIPointer(S,L,u,z,H):i.vertexAttribPointer(S,L,u,N,z,H)}function M(S,L,u,N){x();const z=N.attributes,H=u.getAttributes(),B=L.defaultAttributeValues;for(const Q in H){const F=H[Q];if(F.location>=0){let K=z[Q];if(K===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(K=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(K=S.instanceColor)),K!==void 0){const ee=K.normalized,re=K.itemSize,we=e.get(K);if(we===void 0)continue;const Je=we.buffer,st=we.type,qe=we.bytesPerElement,q=st===i.INT||st===i.UNSIGNED_INT||K.gpuType===El;if(K.isInterleavedBufferAttribute){const Y=K.data,le=Y.stride,fe=K.offset;if(Y.isInstancedInterleavedBuffer){for(let pe=0;pe<F.locationSize;pe++)p(F.location+pe,Y.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let pe=0;pe<F.locationSize;pe++)g(F.location+pe);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let pe=0;pe<F.locationSize;pe++)w(F.location+pe,re/F.locationSize,st,ee,le*qe,(fe+re/F.locationSize*pe)*qe,q)}else{if(K.isInstancedBufferAttribute){for(let Y=0;Y<F.locationSize;Y++)p(F.location+Y,K.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Y=0;Y<F.locationSize;Y++)g(F.location+Y);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let Y=0;Y<F.locationSize;Y++)w(F.location+Y,re/F.locationSize,st,ee,re*qe,re/F.locationSize*Y*qe,q)}}else if(B!==void 0){const ee=B[Q];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(F.location,ee);break;case 3:i.vertexAttrib3fv(F.location,ee);break;case 4:i.vertexAttrib4fv(F.location,ee);break;default:i.vertexAttrib1fv(F.location,ee)}}}}A()}function E(){I();for(const S in n){const L=n[S];for(const u in L){const N=L[u];for(const z in N)h(N[z].object),delete N[z];delete L[u]}delete n[S]}}function R(S){if(n[S.id]===void 0)return;const L=n[S.id];for(const u in L){const N=L[u];for(const z in N)h(N[z].object),delete N[z];delete L[u]}delete n[S.id]}function C(S){for(const L in n){const u=n[L];if(u[S.id]===void 0)continue;const N=u[S.id];for(const z in N)h(N[z].object),delete N[z];delete u[S.id]}}function I(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:A}}function Ym(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function o(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let m=0;for(let v=0;v<d;v++)m+=h[v];t.update(m,n,1)}function c(l,h,d,f){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<l.length;v++)a(l[v],h[v],f[v]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,d);let v=0;for(let x=0;x<d;x++)v+=h[x]*f[x];t.update(v,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function jm(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Mn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const I=C===vr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Wn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Cn&&!I)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=v>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:v,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:E,maxSamples:R}}function Km(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Pi,o=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||s;return s=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,m){const v=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||v===null||v.length===0||r&&!g)r?h(null):l();else{const A=r?0:n,w=A*4;let M=p.clippingState||null;c.value=M,M=h(v,f,w,m);for(let E=0;E!==w;++E)M[E]=t[E];p.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,f,m,v){const x=d!==null?d.length:0;let g=null;if(x!==0){if(g=c.value,v!==!0||g===null){const p=m+x*4,A=f.matrixWorldInverse;o.getNormalMatrix(A),(g===null||g.length<p)&&(g=new Float32Array(p));for(let w=0,M=m;w!==x;++w,M+=4)a.copy(d[w]).applyMatrix4(A,o),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Zm(i){let e=new WeakMap;function t(a,o){return o===Po?a.mapping=Ps:o===Lo&&(a.mapping=Ls),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Po||o===Lo)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new $u(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ms=4,Ac=[.125,.215,.35,.446,.526,.582],Ui=20,co=new Dh,Rc=new je;let ho=null,uo=0,fo=0,po=!1;const Li=(1+Math.sqrt(5))/2,vs=1/Li,Cc=[new G(-Li,vs,0),new G(Li,vs,0),new G(-vs,0,Li),new G(vs,0,Li),new G(0,Li,-vs),new G(0,Li,vs),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)],Jm=new G;class Pc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Jm}=r;ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ic(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ho,uo,fo),this._renderer.xr.enabled=po,e.scissorTest=!1,Kr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ps||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ho=this._renderer.getRenderTarget(),uo=this._renderer.getActiveCubeFace(),fo=this._renderer.getActiveMipmapLevel(),po=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Rn,minFilter:Rn,generateMipmaps:!1,type:vr,format:Mn,colorSpace:Is,depthBuffer:!1},s=Lc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Qm(r)),this._blurMaterial=eg(r,e,t)}return s}_compileMaterial(e){const t=new Gt(this._lodPlanes[0],e);this._renderer.compile(t,co)}_sceneToCubeUV(e,t,n,s,r){const c=new _n(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,m=d.toneMapping;d.getClearColor(Rc),d.toneMapping=fi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));const x=new gn({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),g=new Gt(new xr,x);let p=!1;const A=e.background;A?A.isColor&&(x.color.copy(A),e.background=null,p=!0):(x.color.copy(Rc),p=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):M===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));const E=this._cubeSize;Kr(s,M*E,w>2?E:0,E,E),d.setRenderTarget(s),p&&d.render(g,c),d.render(e,c)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=m,d.autoClear=f,e.background=A}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ps||e.mapping===Ls;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ic());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Kr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,co)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Cc[(s-r-1)%Cc.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Gt(this._lodPlanes[s],l),f=l.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ui-1),x=r/v,g=isFinite(r)?1+Math.floor(h*x):Ui;g>Ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ui}`);const p=[];let A=0;for(let C=0;C<Ui;++C){const I=C/x,b=Math.exp(-I*I/2);p.push(b),C===0?A+=b:C<g&&(A+=2*b)}for(let C=0;C<p.length;C++)p[C]=p[C]/A;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:w}=this;f.dTheta.value=v,f.mipInt.value=w-n;const M=this._sizeLods[s],E=3*M*(s>w-Ms?s-w+Ms:0),R=4*(this._cubeSize-M);Kr(t,E,R,3*M,2*M),c.setRenderTarget(t),c.render(d,co)}}function Qm(i){const e=[],t=[],n=[];let s=i;const r=i-Ms+1+Ac.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Ms?c=Ac[a-i+Ms-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,v=6,x=3,g=2,p=1,A=new Float32Array(x*v*m),w=new Float32Array(g*v*m),M=new Float32Array(p*v*m);for(let R=0;R<m;R++){const C=R%3*2/3-1,I=R>2?0:-1,b=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];A.set(b,x*v*R),w.set(f,g*v*R);const S=[R,R,R,R,R,R];M.set(S,p*v*R)}const E=new In;E.setAttribute("position",new hn(A,x)),E.setAttribute("uv",new hn(w,g)),E.setAttribute("faceIndex",new hn(M,p)),e.push(E),s>Ms&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Lc(i,e,t){const n=new Xi(i,e,t);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function eg(i,e,t){const n=new Float32Array(Ui),s=new G(0,1,0);return new _i({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ul(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Ic(){return new _i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ul(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Dc(){return new _i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Ul(){return`

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
	`}function tg(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Po||c===Lo,h=c===Ps||c===Ls;if(l||h){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Pc(i)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const m=o.image;return l&&m&&m.height>0||h&&m&&s(m)?(t===null&&(t=new Pc(i)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function ng(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&mr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ig(i,e,t,n){const s={},r=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function l(d){const f=[],m=d.index,v=d.attributes.position;let x=0;if(m!==null){const A=m.array;x=m.version;for(let w=0,M=A.length;w<M;w+=3){const E=A[w+0],R=A[w+1],C=A[w+2];f.push(E,R,R,C,C,E)}}else if(v!==void 0){const A=v.array;x=v.version;for(let w=0,M=A.length/3-1;w<M;w+=3){const E=w+0,R=w+1,C=w+2;f.push(E,R,R,C,C,E)}}else return;const g=new(_h(f)?Eh:bh)(f,1);g.version=x;const p=r.get(d);p&&e.remove(p),r.set(d,g)}function h(d){const f=r.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function sg(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,m){i.drawElements(n,m,r,f*a),t.update(m,n,1)}function l(f,m,v){v!==0&&(i.drawElementsInstanced(n,m,r,f*a,v),t.update(m,n,v))}function h(f,m,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,v);let g=0;for(let p=0;p<v;p++)g+=m[p];t.update(g,n,1)}function d(f,m,v,x){if(v===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)l(f[p]/a,m[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,x,0,v);let p=0;for(let A=0;A<v;A++)p+=m[A]*x[A];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function rg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ag(i,e,t){const n=new WeakMap,s=new yt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let b=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();const m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let w=0;m===!0&&(w=1),v===!0&&(w=2),x===!0&&(w=3);let M=o.attributes.position.count*w,E=1;M>e.maxTextureSize&&(E=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const R=new Float32Array(M*E*4*d),C=new xh(R,M,E,d);C.type=Cn,C.needsUpdate=!0;const I=w*4;for(let S=0;S<d;S++){const L=g[S],u=p[S],N=A[S],z=M*E*4*S;for(let H=0;H<L.count;H++){const B=H*I;m===!0&&(s.fromBufferAttribute(L,H),R[z+B+0]=s.x,R[z+B+1]=s.y,R[z+B+2]=s.z,R[z+B+3]=0),v===!0&&(s.fromBufferAttribute(u,H),R[z+B+4]=s.x,R[z+B+5]=s.y,R[z+B+6]=s.z,R[z+B+7]=0),x===!0&&(s.fromBufferAttribute(N,H),R[z+B+8]=s.x,R[z+B+9]=s.y,R[z+B+10]=s.z,R[z+B+11]=N.itemSize===4?s.w:1)}}f={count:d,texture:C,size:new We(M,E)},n.set(o,f),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let x=0;x<l.length;x++)m+=l[x];const v=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function og(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Nh=new Lt,Uc=new Lh(1,1),kh=new xh,Oh=new Pu,Fh=new Ah,Nc=[],kc=[],Oc=new Float32Array(16),Fc=new Float32Array(9),Bc=new Float32Array(4);function Bs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Nc[s];if(r===void 0&&(r=new Float32Array(s),Nc[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function bt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Et(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ya(i,e){let t=kc[e];t===void 0&&(t=new Int32Array(e),kc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function lg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function cg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2fv(this.addr,e),Et(t,e)}}function hg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;i.uniform3fv(this.addr,e),Et(t,e)}}function dg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4fv(this.addr,e),Et(t,e)}}function ug(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Bc.set(n),i.uniformMatrix2fv(this.addr,!1,Bc),Et(t,n)}}function fg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Fc.set(n),i.uniformMatrix3fv(this.addr,!1,Fc),Et(t,n)}}function pg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Oc.set(n),i.uniformMatrix4fv(this.addr,!1,Oc),Et(t,n)}}function mg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2iv(this.addr,e),Et(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3iv(this.addr,e),Et(t,e)}}function _g(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4iv(this.addr,e),Et(t,e)}}function xg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2uiv(this.addr,e),Et(t,e)}}function yg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3uiv(this.addr,e),Et(t,e)}}function Sg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4uiv(this.addr,e),Et(t,e)}}function bg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Uc.compareFunction=vh,r=Uc):r=Nh,t.setTexture2D(e||r,s)}function Eg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Oh,s)}function Tg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Fh,s)}function wg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||kh,s)}function Ag(i){switch(i){case 5126:return lg;case 35664:return cg;case 35665:return hg;case 35666:return dg;case 35674:return ug;case 35675:return fg;case 35676:return pg;case 5124:case 35670:return mg;case 35667:case 35671:return gg;case 35668:case 35672:return vg;case 35669:case 35673:return _g;case 5125:return xg;case 36294:return Mg;case 36295:return yg;case 36296:return Sg;case 35678:case 36198:case 36298:case 36306:case 35682:return bg;case 35679:case 36299:case 36307:return Eg;case 35680:case 36300:case 36308:case 36293:return Tg;case 36289:case 36303:case 36311:case 36292:return wg}}function Rg(i,e){i.uniform1fv(this.addr,e)}function Cg(i,e){const t=Bs(e,this.size,2);i.uniform2fv(this.addr,t)}function Pg(i,e){const t=Bs(e,this.size,3);i.uniform3fv(this.addr,t)}function Lg(i,e){const t=Bs(e,this.size,4);i.uniform4fv(this.addr,t)}function Ig(i,e){const t=Bs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Dg(i,e){const t=Bs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ug(i,e){const t=Bs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ng(i,e){i.uniform1iv(this.addr,e)}function kg(i,e){i.uniform2iv(this.addr,e)}function Og(i,e){i.uniform3iv(this.addr,e)}function Fg(i,e){i.uniform4iv(this.addr,e)}function Bg(i,e){i.uniform1uiv(this.addr,e)}function zg(i,e){i.uniform2uiv(this.addr,e)}function Hg(i,e){i.uniform3uiv(this.addr,e)}function Vg(i,e){i.uniform4uiv(this.addr,e)}function Gg(i,e,t){const n=this.cache,s=e.length,r=ya(t,s);bt(n,r)||(i.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Nh,r[a])}function Wg(i,e,t){const n=this.cache,s=e.length,r=ya(t,s);bt(n,r)||(i.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Oh,r[a])}function Xg(i,e,t){const n=this.cache,s=e.length,r=ya(t,s);bt(n,r)||(i.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Fh,r[a])}function qg(i,e,t){const n=this.cache,s=e.length,r=ya(t,s);bt(n,r)||(i.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||kh,r[a])}function $g(i){switch(i){case 5126:return Rg;case 35664:return Cg;case 35665:return Pg;case 35666:return Lg;case 35674:return Ig;case 35675:return Dg;case 35676:return Ug;case 5124:case 35670:return Ng;case 35667:case 35671:return kg;case 35668:case 35672:return Og;case 35669:case 35673:return Fg;case 5125:return Bg;case 36294:return zg;case 36295:return Hg;case 36296:return Vg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Wg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return qg}}class Yg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ag(t.type)}}class jg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$g(t.type)}}class Kg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const mo=/(\w+)(\])?(\[|\.)?/g;function zc(i,e){i.seq.push(e),i.map[e.id]=e}function Zg(i,e,t){const n=i.name,s=n.length;for(mo.lastIndex=0;;){const r=mo.exec(n),a=mo.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){zc(t,l===void 0?new Yg(o,i,e):new jg(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Kg(o),zc(t,d)),t=d}}}class ia{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Zg(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Hc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Jg=37297;let Qg=0;function e0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Vc=new Oe;function t0(i){Ye._getMatrix(Vc,Ye.workingColorSpace,i);const e=`mat3( ${Vc.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case aa:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Gc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+e0(i.getShaderSource(e),o)}else return r}function n0(i,e){const t=t0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function i0(i,e){let t;switch(e){case iu:t="Linear";break;case su:t="Reinhard";break;case ru:t="Cineon";break;case au:t="ACESFilmic";break;case lu:t="AgX";break;case cu:t="Neutral";break;case ou:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zr=new G;function s0(){Ye.getLuminanceCoefficients(Zr);const i=Zr.x.toFixed(4),e=Zr.y.toFixed(4),t=Zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function r0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qs).join(`
`)}function a0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Qs(i){return i!==""}function Wc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const l0=/^[ \t]*#include +<([\w\d./]+)>/gm;function hl(i){return i.replace(l0,h0)}const c0=new Map;function h0(i,e){let t=Be[e];if(t===void 0){const n=c0.get(e);if(n!==void 0)t=Be[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return hl(t)}const d0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qc(i){return i.replace(d0,u0)}function u0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $c(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function f0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===oh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===kd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(e="SHADOWMAP_TYPE_VSM"),e}function p0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ps:case Ls:e="ENVMAP_TYPE_CUBE";break;case Ma:e="ENVMAP_TYPE_CUBE_UV";break}return e}function m0(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ls&&(e="ENVMAP_MODE_REFRACTION"),e}function g0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case lh:e="ENVMAP_BLENDING_MULTIPLY";break;case tu:e="ENVMAP_BLENDING_MIX";break;case nu:e="ENVMAP_BLENDING_ADD";break}return e}function v0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function _0(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=f0(t),l=p0(t),h=m0(t),d=g0(t),f=v0(t),m=r0(t),v=a0(r),x=s.createProgram();let g,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Qs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Qs).join(`
`),p.length>0&&(p+=`
`)):(g=[$c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qs).join(`
`),p=[$c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fi?"#define TONE_MAPPING":"",t.toneMapping!==fi?Be.tonemapping_pars_fragment:"",t.toneMapping!==fi?i0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,n0("linearToOutputTexel",t.outputColorSpace),s0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qs).join(`
`)),a=hl(a),a=Wc(a,t),a=Xc(a,t),o=hl(o),o=Wc(o,t),o=Xc(o,t),a=qc(a),o=qc(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===ec?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ec?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=A+g+a,M=A+p+o,E=Hc(s,s.VERTEX_SHADER,w),R=Hc(s,s.FRAGMENT_SHADER,M);s.attachShader(x,E),s.attachShader(x,R),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(L){if(i.debug.checkShaderErrors){const u=s.getProgramInfoLog(x)||"",N=s.getShaderInfoLog(E)||"",z=s.getShaderInfoLog(R)||"",H=u.trim(),B=N.trim(),Q=z.trim();let F=!0,K=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,E,R);else{const ee=Gc(s,E,"vertex"),re=Gc(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+H+`
`+ee+`
`+re)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(B===""||Q==="")&&(K=!1);K&&(L.diagnostics={runnable:F,programLog:H,vertexShader:{log:B,prefix:g},fragmentShader:{log:Q,prefix:p}})}s.deleteShader(E),s.deleteShader(R),I=new ia(s,x),b=o0(s,x)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(x,Jg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Qg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=R,this}let x0=0;class M0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new y0(e),t.set(e,n)),n}}class y0{constructor(e){this.id=x0++,this.code=e,this.usedTimes=0}}function S0(i,e,t,n,s,r,a){const o=new yh,c=new M0,l=new Set,h=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,S,L,u,N){const z=u.fog,H=N.geometry,B=b.isMeshStandardMaterial?u.environment:null,Q=(b.isMeshStandardMaterial?t:e).get(b.envMap||B),F=Q&&Q.mapping===Ma?Q.image.height:null,K=v[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const ee=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,re=ee!==void 0?ee.length:0;let we=0;H.morphAttributes.position!==void 0&&(we=1),H.morphAttributes.normal!==void 0&&(we=2),H.morphAttributes.color!==void 0&&(we=3);let Je,st,qe,q;if(K){const Ze=Tn[K];Je=Ze.vertexShader,st=Ze.fragmentShader}else Je=b.vertexShader,st=b.fragmentShader,c.update(b),qe=c.getVertexShaderID(b),q=c.getFragmentShaderID(b);const Y=i.getRenderTarget(),le=i.state.buffers.depth.getReversed(),fe=N.isInstancedMesh===!0,pe=N.isBatchedMesh===!0,Xe=!!b.map,It=!!b.matcap,P=!!Q,lt=!!b.aoMap,Ne=!!b.lightMap,Le=!!b.bumpMap,xe=!!b.normalMap,ct=!!b.displacementMap,Me=!!b.emissiveMap,Fe=!!b.metalnessMap,Tt=!!b.roughnessMap,_t=b.anisotropy>0,T=b.clearcoat>0,_=b.dispersion>0,V=b.iridescence>0,j=b.sheen>0,J=b.transmission>0,$=_t&&!!b.anisotropyMap,Ee=T&&!!b.clearcoatMap,ae=T&&!!b.clearcoatNormalMap,ye=T&&!!b.clearcoatRoughnessMap,Se=V&&!!b.iridescenceMap,ie=V&&!!b.iridescenceThicknessMap,ue=j&&!!b.sheenColorMap,Pe=j&&!!b.sheenRoughnessMap,be=!!b.specularMap,he=!!b.specularColorMap,ke=!!b.specularIntensityMap,D=J&&!!b.transmissionMap,se=J&&!!b.thicknessMap,oe=!!b.gradientMap,ge=!!b.alphaMap,te=b.alphaTest>0,Z=!!b.alphaHash,_e=!!b.extensions;let Ue=fi;b.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(Ue=i.toneMapping);const rt={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:Je,fragmentShader:st,defines:b.defines,customVertexShaderID:qe,customFragmentShaderID:q,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:pe,batchingColor:pe&&N._colorsTexture!==null,instancing:fe,instancingColor:fe&&N.instanceColor!==null,instancingMorph:fe&&N.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Y===null?i.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Is,alphaToCoverage:!!b.alphaToCoverage,map:Xe,matcap:It,envMap:P,envMapMode:P&&Q.mapping,envMapCubeUVHeight:F,aoMap:lt,lightMap:Ne,bumpMap:Le,normalMap:xe,displacementMap:f&&ct,emissiveMap:Me,normalMapObjectSpace:xe&&b.normalMapType===pu,normalMapTangentSpace:xe&&b.normalMapType===fu,metalnessMap:Fe,roughnessMap:Tt,anisotropy:_t,anisotropyMap:$,clearcoat:T,clearcoatMap:Ee,clearcoatNormalMap:ae,clearcoatRoughnessMap:ye,dispersion:_,iridescence:V,iridescenceMap:Se,iridescenceThicknessMap:ie,sheen:j,sheenColorMap:ue,sheenRoughnessMap:Pe,specularMap:be,specularColorMap:he,specularIntensityMap:ke,transmission:J,transmissionMap:D,thicknessMap:se,gradientMap:oe,opaque:b.transparent===!1&&b.blending===Es&&b.alphaToCoverage===!1,alphaMap:ge,alphaTest:te,alphaHash:Z,combine:b.combine,mapUv:Xe&&x(b.map.channel),aoMapUv:lt&&x(b.aoMap.channel),lightMapUv:Ne&&x(b.lightMap.channel),bumpMapUv:Le&&x(b.bumpMap.channel),normalMapUv:xe&&x(b.normalMap.channel),displacementMapUv:ct&&x(b.displacementMap.channel),emissiveMapUv:Me&&x(b.emissiveMap.channel),metalnessMapUv:Fe&&x(b.metalnessMap.channel),roughnessMapUv:Tt&&x(b.roughnessMap.channel),anisotropyMapUv:$&&x(b.anisotropyMap.channel),clearcoatMapUv:Ee&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:ae&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:ie&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&x(b.sheenRoughnessMap.channel),specularMapUv:be&&x(b.specularMap.channel),specularColorMapUv:he&&x(b.specularColorMap.channel),specularIntensityMapUv:ke&&x(b.specularIntensityMap.channel),transmissionMapUv:D&&x(b.transmissionMap.channel),thicknessMapUv:se&&x(b.thicknessMap.channel),alphaMapUv:ge&&x(b.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(xe||_t),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!H.attributes.uv&&(Xe||ge),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:le,skinning:N.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:we,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ue,decodeVideoTexture:Xe&&b.map.isVideoTexture===!0&&Ye.getTransfer(b.map.colorSpace)===et,decodeVideoTextureEmissive:Me&&b.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(b.emissiveMap.colorSpace)===et,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ln,flipSided:b.side===$t,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:_e&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_e&&b.extensions.multiDraw===!0||pe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return rt.vertexUv1s=l.has(1),rt.vertexUv2s=l.has(2),rt.vertexUv3s=l.has(3),l.clear(),rt}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const L in b.defines)S.push(L),S.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(A(S,b),w(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function A(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function w(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function M(b){const S=v[b.type];let L;if(S){const u=Tn[S];L=Gu.clone(u.uniforms)}else L=b.uniforms;return L}function E(b,S){let L;for(let u=0,N=h.length;u<N;u++){const z=h[u];if(z.cacheKey===S){L=z,++L.usedTimes;break}}return L===void 0&&(L=new _0(i,S,b,r),h.push(L)),L}function R(b){if(--b.usedTimes===0){const S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function C(b){c.remove(b)}function I(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:M,acquireProgram:E,releaseProgram:R,releaseShaderCache:C,programs:h,dispose:I}}function b0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function E0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Yc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function jc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,f,m,v,x,g){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:f,material:m,groupOrder:v,renderOrder:d.renderOrder,z:x,group:g},i[e]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=m,p.groupOrder=v,p.renderOrder=d.renderOrder,p.z=x,p.group=g),e++,p}function o(d,f,m,v,x,g){const p=a(d,f,m,v,x,g);m.transmission>0?n.push(p):m.transparent===!0?s.push(p):t.push(p)}function c(d,f,m,v,x,g){const p=a(d,f,m,v,x,g);m.transmission>0?n.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function l(d,f){t.length>1&&t.sort(d||E0),n.length>1&&n.sort(f||Yc),s.length>1&&s.sort(f||Yc)}function h(){for(let d=e,f=i.length;d<f;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function T0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new jc,i.set(n,[a])):s>=r.length?(a=new jc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function w0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new G,color:new je};break;case"SpotLight":t={position:new G,direction:new G,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new G,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new G,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new G,halfWidth:new G,halfHeight:new G};break}return i[e.id]=t,t}}}function A0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let R0=0;function C0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function P0(i){const e=new w0,t=A0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new G);const s=new G,r=new ht,a=new ht;function o(l){let h=0,d=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,v=0,x=0,g=0,p=0,A=0,w=0,M=0,E=0,R=0,C=0;l.sort(C0);for(let b=0,S=l.length;b<S;b++){const L=l[b],u=L.color,N=L.intensity,z=L.distance,H=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=u.r*N,d+=u.g*N,f+=u.b*N;else if(L.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(L.sh.coefficients[B],N);C++}else if(L.isDirectionalLight){const B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,F=t.get(L);F.shadowIntensity=Q.intensity,F.shadowBias=Q.bias,F.shadowNormalBias=Q.normalBias,F.shadowRadius=Q.radius,F.shadowMapSize=Q.mapSize,n.directionalShadow[m]=F,n.directionalShadowMap[m]=H,n.directionalShadowMatrix[m]=L.shadow.matrix,A++}n.directional[m]=B,m++}else if(L.isSpotLight){const B=e.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(u).multiplyScalar(N),B.distance=z,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,n.spot[x]=B;const Q=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,Q.updateMatrices(L),L.castShadow&&R++),n.spotLightMatrix[x]=Q.matrix,L.castShadow){const F=t.get(L);F.shadowIntensity=Q.intensity,F.shadowBias=Q.bias,F.shadowNormalBias=Q.normalBias,F.shadowRadius=Q.radius,F.shadowMapSize=Q.mapSize,n.spotShadow[x]=F,n.spotShadowMap[x]=H,M++}x++}else if(L.isRectAreaLight){const B=e.get(L);B.color.copy(u).multiplyScalar(N),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=B,g++}else if(L.isPointLight){const B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),B.distance=L.distance,B.decay=L.decay,L.castShadow){const Q=L.shadow,F=t.get(L);F.shadowIntensity=Q.intensity,F.shadowBias=Q.bias,F.shadowNormalBias=Q.normalBias,F.shadowRadius=Q.radius,F.shadowMapSize=Q.mapSize,F.shadowCameraNear=Q.camera.near,F.shadowCameraFar=Q.camera.far,n.pointShadow[v]=F,n.pointShadowMap[v]=H,n.pointShadowMatrix[v]=L.shadow.matrix,w++}n.point[v]=B,v++}else if(L.isHemisphereLight){const B=e.get(L);B.skyColor.copy(L.color).multiplyScalar(N),B.groundColor.copy(L.groundColor).multiplyScalar(N),n.hemi[p]=B,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;const I=n.hash;(I.directionalLength!==m||I.pointLength!==v||I.spotLength!==x||I.rectAreaLength!==g||I.hemiLength!==p||I.numDirectionalShadows!==A||I.numPointShadows!==w||I.numSpotShadows!==M||I.numSpotMaps!==E||I.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=x,n.rectArea.length=g,n.point.length=v,n.hemi.length=p,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+E-R,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=C,I.directionalLength=m,I.pointLength=v,I.spotLength=x,I.rectAreaLength=g,I.hemiLength=p,I.numDirectionalShadows=A,I.numPointShadows=w,I.numSpotShadows=M,I.numSpotMaps=E,I.numLightProbes=C,n.version=R0++)}function c(l,h){let d=0,f=0,m=0,v=0,x=0;const g=h.matrixWorldInverse;for(let p=0,A=l.length;p<A;p++){const w=l[p];if(w.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),d++}else if(w.isSpotLight){const M=n.spot[m];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),m++}else if(w.isRectAreaLight){const M=n.rectArea[v];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(g),a.identity(),r.copy(w.matrixWorld),r.premultiply(g),a.extractRotation(r),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),v++}else if(w.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(g),f++}else if(w.isHemisphereLight){const M=n.hemi[x];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Kc(i){const e=new P0(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function L0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Kc(i),e.set(s,[o])):r>=a.length?(o=new Kc(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const I0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
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
}`;function U0(i,e,t){let n=new Ch;const s=new We,r=new We,a=new yt,o=new sf({depthPacking:uu}),c=new rf,l={},h=t.maxTextureSize,d={[vi]:$t,[$t]:vi,[ln]:ln},f=new _i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:I0,fragmentShader:D0}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const v=new In;v.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Gt(v,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oh;let p=this.type;this.render=function(R,C,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),u=i.state;u.setBlending(ui),u.buffers.depth.getReversed()===!0?u.buffers.color.setClear(0,0,0,0):u.buffers.color.setClear(1,1,1,1),u.buffers.depth.setTest(!0),u.setScissorTest(!1);const N=p!==Hn&&this.type===Hn,z=p===Hn&&this.type!==Hn;for(let H=0,B=R.length;H<B;H++){const Q=R[H],F=Q.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const K=F.getFrameExtents();if(s.multiply(K),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/K.x),s.x=r.x*K.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/K.y),s.y=r.y*K.y,F.mapSize.y=r.y)),F.map===null||N===!0||z===!0){const re=this.type!==Hn?{minFilter:gt,magFilter:gt}:{};F.map!==null&&F.map.dispose(),F.map=new Xi(s.x,s.y,re),F.map.texture.name=Q.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();const ee=F.getViewportCount();for(let re=0;re<ee;re++){const we=F.getViewport(re);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),u.viewport(a),F.updateMatrices(Q,re),n=F.getFrustum(),M(C,I,F.camera,Q,this.type)}F.isPointLightShadow!==!0&&this.type===Hn&&A(F,I),F.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(b,S,L)};function A(R,C){const I=e.update(x);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Xi(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,I,f,x,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,I,m,x,null)}function w(R,C,I,b){let S=null;const L=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(L!==void 0)S=L;else if(S=I.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const u=S.uuid,N=C.uuid;let z=l[u];z===void 0&&(z={},l[u]=z);let H=z[N];H===void 0&&(H=S.clone(),z[N]=H,C.addEventListener("dispose",E)),S=H}if(S.visible=C.visible,S.wireframe=C.wireframe,b===Hn?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:d[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,I.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const u=i.properties.get(S);u.light=I}return S}function M(R,C,I,b,S){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&S===Hn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const N=e.update(R),z=R.material;if(Array.isArray(z)){const H=N.groups;for(let B=0,Q=H.length;B<Q;B++){const F=H[B],K=z[F.materialIndex];if(K&&K.visible){const ee=w(R,K,b,S);R.onBeforeShadow(i,R,C,I,N,ee,F),i.renderBufferDirect(I,null,N,ee,R,F),R.onAfterShadow(i,R,C,I,N,ee,F)}}}else if(z.visible){const H=w(R,z,b,S);R.onBeforeShadow(i,R,C,I,N,H,null),i.renderBufferDirect(I,null,N,H,R,null),R.onAfterShadow(i,R,C,I,N,H,null)}}const u=R.children;for(let N=0,z=u.length;N<z;N++)M(u[N],C,I,b,S)}function E(R){R.target.removeEventListener("dispose",E);for(const I in l){const b=l[I],S=R.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const N0={[bo]:Eo,[To]:Ro,[wo]:Co,[Cs]:Ao,[Eo]:bo,[Ro]:To,[Co]:wo,[Ao]:Cs};function k0(i,e){function t(){let D=!1;const se=new yt;let oe=null;const ge=new yt(0,0,0,0);return{setMask:function(te){oe!==te&&!D&&(i.colorMask(te,te,te,te),oe=te)},setLocked:function(te){D=te},setClear:function(te,Z,_e,Ue,rt){rt===!0&&(te*=Ue,Z*=Ue,_e*=Ue),se.set(te,Z,_e,Ue),ge.equals(se)===!1&&(i.clearColor(te,Z,_e,Ue),ge.copy(se))},reset:function(){D=!1,oe=null,ge.set(-1,0,0,0)}}}function n(){let D=!1,se=!1,oe=null,ge=null,te=null;return{setReversed:function(Z){if(se!==Z){const _e=e.get("EXT_clip_control");Z?_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.ZERO_TO_ONE_EXT):_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.NEGATIVE_ONE_TO_ONE_EXT),se=Z;const Ue=te;te=null,this.setClear(Ue)}},getReversed:function(){return se},setTest:function(Z){Z?Y(i.DEPTH_TEST):le(i.DEPTH_TEST)},setMask:function(Z){oe!==Z&&!D&&(i.depthMask(Z),oe=Z)},setFunc:function(Z){if(se&&(Z=N0[Z]),ge!==Z){switch(Z){case bo:i.depthFunc(i.NEVER);break;case Eo:i.depthFunc(i.ALWAYS);break;case To:i.depthFunc(i.LESS);break;case Cs:i.depthFunc(i.LEQUAL);break;case wo:i.depthFunc(i.EQUAL);break;case Ao:i.depthFunc(i.GEQUAL);break;case Ro:i.depthFunc(i.GREATER);break;case Co:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=Z}},setLocked:function(Z){D=Z},setClear:function(Z){te!==Z&&(se&&(Z=1-Z),i.clearDepth(Z),te=Z)},reset:function(){D=!1,oe=null,ge=null,te=null,se=!1}}}function s(){let D=!1,se=null,oe=null,ge=null,te=null,Z=null,_e=null,Ue=null,rt=null;return{setTest:function(Ze){D||(Ze?Y(i.STENCIL_TEST):le(i.STENCIL_TEST))},setMask:function(Ze){se!==Ze&&!D&&(i.stencilMask(Ze),se=Ze)},setFunc:function(Ze,Un,yn){(oe!==Ze||ge!==Un||te!==yn)&&(i.stencilFunc(Ze,Un,yn),oe=Ze,ge=Un,te=yn)},setOp:function(Ze,Un,yn){(Z!==Ze||_e!==Un||Ue!==yn)&&(i.stencilOp(Ze,Un,yn),Z=Ze,_e=Un,Ue=yn)},setLocked:function(Ze){D=Ze},setClear:function(Ze){rt!==Ze&&(i.clearStencil(Ze),rt=Ze)},reset:function(){D=!1,se=null,oe=null,ge=null,te=null,Z=null,_e=null,Ue=null,rt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},d={},f=new WeakMap,m=[],v=null,x=!1,g=null,p=null,A=null,w=null,M=null,E=null,R=null,C=new je(0,0,0),I=0,b=!1,S=null,L=null,u=null,N=null,z=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Q=0;const F=i.getParameter(i.VERSION);F.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(F)[1]),B=Q>=1):F.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),B=Q>=2);let K=null,ee={};const re=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),Je=new yt().fromArray(re),st=new yt().fromArray(we);function qe(D,se,oe,ge){const te=new Uint8Array(4),Z=i.createTexture();i.bindTexture(D,Z),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let _e=0;_e<oe;_e++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(se,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,te):i.texImage2D(se+_e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,te);return Z}const q={};q[i.TEXTURE_2D]=qe(i.TEXTURE_2D,i.TEXTURE_2D,1),q[i.TEXTURE_CUBE_MAP]=qe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[i.TEXTURE_2D_ARRAY]=qe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),q[i.TEXTURE_3D]=qe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Y(i.DEPTH_TEST),a.setFunc(Cs),Le(!1),xe(jl),Y(i.CULL_FACE),lt(ui);function Y(D){h[D]!==!0&&(i.enable(D),h[D]=!0)}function le(D){h[D]!==!1&&(i.disable(D),h[D]=!1)}function fe(D,se){return d[D]!==se?(i.bindFramebuffer(D,se),d[D]=se,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=se),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=se),!0):!1}function pe(D,se){let oe=m,ge=!1;if(D){oe=f.get(se),oe===void 0&&(oe=[],f.set(se,oe));const te=D.textures;if(oe.length!==te.length||oe[0]!==i.COLOR_ATTACHMENT0){for(let Z=0,_e=te.length;Z<_e;Z++)oe[Z]=i.COLOR_ATTACHMENT0+Z;oe.length=te.length,ge=!0}}else oe[0]!==i.BACK&&(oe[0]=i.BACK,ge=!0);ge&&i.drawBuffers(oe)}function Xe(D){return v!==D?(i.useProgram(D),v=D,!0):!1}const It={[Di]:i.FUNC_ADD,[Fd]:i.FUNC_SUBTRACT,[Bd]:i.FUNC_REVERSE_SUBTRACT};It[zd]=i.MIN,It[Hd]=i.MAX;const P={[Vd]:i.ZERO,[Gd]:i.ONE,[Wd]:i.SRC_COLOR,[yo]:i.SRC_ALPHA,[Kd]:i.SRC_ALPHA_SATURATE,[Yd]:i.DST_COLOR,[qd]:i.DST_ALPHA,[Xd]:i.ONE_MINUS_SRC_COLOR,[So]:i.ONE_MINUS_SRC_ALPHA,[jd]:i.ONE_MINUS_DST_COLOR,[$d]:i.ONE_MINUS_DST_ALPHA,[Zd]:i.CONSTANT_COLOR,[Jd]:i.ONE_MINUS_CONSTANT_COLOR,[Qd]:i.CONSTANT_ALPHA,[eu]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(D,se,oe,ge,te,Z,_e,Ue,rt,Ze){if(D===ui){x===!0&&(le(i.BLEND),x=!1);return}if(x===!1&&(Y(i.BLEND),x=!0),D!==Od){if(D!==g||Ze!==b){if((p!==Di||M!==Di)&&(i.blendEquation(i.FUNC_ADD),p=Di,M=Di),Ze)switch(D){case Es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Kl:i.blendFunc(i.ONE,i.ONE);break;case Zl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Jl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Kl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Zl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Jl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}A=null,w=null,E=null,R=null,C.set(0,0,0),I=0,g=D,b=Ze}return}te=te||se,Z=Z||oe,_e=_e||ge,(se!==p||te!==M)&&(i.blendEquationSeparate(It[se],It[te]),p=se,M=te),(oe!==A||ge!==w||Z!==E||_e!==R)&&(i.blendFuncSeparate(P[oe],P[ge],P[Z],P[_e]),A=oe,w=ge,E=Z,R=_e),(Ue.equals(C)===!1||rt!==I)&&(i.blendColor(Ue.r,Ue.g,Ue.b,rt),C.copy(Ue),I=rt),g=D,b=!1}function Ne(D,se){D.side===ln?le(i.CULL_FACE):Y(i.CULL_FACE);let oe=D.side===$t;se&&(oe=!oe),Le(oe),D.blending===Es&&D.transparent===!1?lt(ui):lt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const ge=D.stencilWrite;o.setTest(ge),ge&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Me(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Y(i.SAMPLE_ALPHA_TO_COVERAGE):le(i.SAMPLE_ALPHA_TO_COVERAGE)}function Le(D){S!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),S=D)}function xe(D){D!==Ud?(Y(i.CULL_FACE),D!==L&&(D===jl?i.cullFace(i.BACK):D===Nd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):le(i.CULL_FACE),L=D}function ct(D){D!==u&&(B&&i.lineWidth(D),u=D)}function Me(D,se,oe){D?(Y(i.POLYGON_OFFSET_FILL),(N!==se||z!==oe)&&(i.polygonOffset(se,oe),N=se,z=oe)):le(i.POLYGON_OFFSET_FILL)}function Fe(D){D?Y(i.SCISSOR_TEST):le(i.SCISSOR_TEST)}function Tt(D){D===void 0&&(D=i.TEXTURE0+H-1),K!==D&&(i.activeTexture(D),K=D)}function _t(D,se,oe){oe===void 0&&(K===null?oe=i.TEXTURE0+H-1:oe=K);let ge=ee[oe];ge===void 0&&(ge={type:void 0,texture:void 0},ee[oe]=ge),(ge.type!==D||ge.texture!==se)&&(K!==oe&&(i.activeTexture(oe),K=oe),i.bindTexture(D,se||q[D]),ge.type=D,ge.texture=se)}function T(){const D=ee[K];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ae(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ie(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ue(D){Je.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Je.copy(D))}function Pe(D){st.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),st.copy(D))}function be(D,se){let oe=l.get(se);oe===void 0&&(oe=new WeakMap,l.set(se,oe));let ge=oe.get(D);ge===void 0&&(ge=i.getUniformBlockIndex(se,D.name),oe.set(D,ge))}function he(D,se){const ge=l.get(se).get(D);c.get(se)!==ge&&(i.uniformBlockBinding(se,ge,D.__bindingPointIndex),c.set(se,ge))}function ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},K=null,ee={},d={},f=new WeakMap,m=[],v=null,x=!1,g=null,p=null,A=null,w=null,M=null,E=null,R=null,C=new je(0,0,0),I=0,b=!1,S=null,L=null,u=null,N=null,z=null,Je.set(0,0,i.canvas.width,i.canvas.height),st.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Y,disable:le,bindFramebuffer:fe,drawBuffers:pe,useProgram:Xe,setBlending:lt,setMaterial:Ne,setFlipSided:Le,setCullFace:xe,setLineWidth:ct,setPolygonOffset:Me,setScissorTest:Fe,activeTexture:Tt,bindTexture:_t,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:V,texImage2D:Se,texImage3D:ie,updateUBOMapping:be,uniformBlockBinding:he,texStorage2D:ae,texStorage3D:ye,texSubImage2D:j,texSubImage3D:J,compressedTexSubImage2D:$,compressedTexSubImage3D:Ee,scissor:ue,viewport:Pe,reset:ke}}function O0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new We,h=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,_){return m?new OffscreenCanvas(T,_):pr("canvas")}function x(T,_,V){let j=1;const J=_t(T);if((J.width>V||J.height>V)&&(j=V/Math.max(J.width,J.height)),j<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const $=Math.floor(j*J.width),Ee=Math.floor(j*J.height);d===void 0&&(d=v($,Ee));const ae=_?v($,Ee):d;return ae.width=$,ae.height=Ee,ae.getContext("2d").drawImage(T,0,0,$,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+$+"x"+Ee+")."),ae}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function g(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(T,_,V,j,J=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let $=_;if(_===i.RED&&(V===i.FLOAT&&($=i.R32F),V===i.HALF_FLOAT&&($=i.R16F),V===i.UNSIGNED_BYTE&&($=i.R8)),_===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.R8UI),V===i.UNSIGNED_SHORT&&($=i.R16UI),V===i.UNSIGNED_INT&&($=i.R32UI),V===i.BYTE&&($=i.R8I),V===i.SHORT&&($=i.R16I),V===i.INT&&($=i.R32I)),_===i.RG&&(V===i.FLOAT&&($=i.RG32F),V===i.HALF_FLOAT&&($=i.RG16F),V===i.UNSIGNED_BYTE&&($=i.RG8)),_===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RG8UI),V===i.UNSIGNED_SHORT&&($=i.RG16UI),V===i.UNSIGNED_INT&&($=i.RG32UI),V===i.BYTE&&($=i.RG8I),V===i.SHORT&&($=i.RG16I),V===i.INT&&($=i.RG32I)),_===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGB8UI),V===i.UNSIGNED_SHORT&&($=i.RGB16UI),V===i.UNSIGNED_INT&&($=i.RGB32UI),V===i.BYTE&&($=i.RGB8I),V===i.SHORT&&($=i.RGB16I),V===i.INT&&($=i.RGB32I)),_===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&($=i.RGBA8UI),V===i.UNSIGNED_SHORT&&($=i.RGBA16UI),V===i.UNSIGNED_INT&&($=i.RGBA32UI),V===i.BYTE&&($=i.RGBA8I),V===i.SHORT&&($=i.RGBA16I),V===i.INT&&($=i.RGBA32I)),_===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),_===i.RGBA){const Ee=J?aa:Ye.getTransfer(j);V===i.FLOAT&&($=i.RGBA32F),V===i.HALF_FLOAT&&($=i.RGBA16F),V===i.UNSIGNED_BYTE&&($=Ee===et?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function M(T,_){let V;return T?_===null||_===Wi||_===dr?V=i.DEPTH24_STENCIL8:_===Cn?V=i.DEPTH32F_STENCIL8:_===hr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Wi||_===dr?V=i.DEPTH_COMPONENT24:_===Cn?V=i.DEPTH_COMPONENT32F:_===hr&&(V=i.DEPTH_COMPONENT16),V}function E(T,_){return g(T)===!0||T.isFramebufferTexture&&T.minFilter!==gt&&T.minFilter!==Rn?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function R(T){const _=T.target;_.removeEventListener("dispose",R),I(_),_.isVideoTexture&&h.delete(_)}function C(T){const _=T.target;_.removeEventListener("dispose",C),S(_)}function I(T){const _=n.get(T);if(_.__webglInit===void 0)return;const V=T.source,j=f.get(V);if(j){const J=j[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(T),Object.keys(j).length===0&&f.delete(V)}n.remove(T)}function b(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const V=T.source,j=f.get(V);delete j[_.__cacheKey],a.memory.textures--}function S(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(_.__webglFramebuffer[j]))for(let J=0;J<_.__webglFramebuffer[j].length;J++)i.deleteFramebuffer(_.__webglFramebuffer[j][J]);else i.deleteFramebuffer(_.__webglFramebuffer[j]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[j])}else{if(Array.isArray(_.__webglFramebuffer))for(let j=0;j<_.__webglFramebuffer.length;j++)i.deleteFramebuffer(_.__webglFramebuffer[j]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let j=0;j<_.__webglColorRenderbuffer.length;j++)_.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[j]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const V=T.textures;for(let j=0,J=V.length;j<J;j++){const $=n.get(V[j]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(V[j])}n.remove(T)}let L=0;function u(){L=0}function N(){const T=L;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),L+=1,T}function z(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function H(T,_){const V=n.get(T);if(T.isVideoTexture&&Fe(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&V.__version!==T.version){const j=T.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(V,T,_);return}}else T.isExternalTexture&&(V.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+_)}function B(T,_){const V=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&V.__version!==T.version){q(V,T,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+_)}function Q(T,_){const V=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&V.__version!==T.version){q(V,T,_);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+_)}function F(T,_){const V=n.get(T);if(T.version>0&&V.__version!==T.version){Y(V,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+_)}const K={[cr]:i.REPEAT,[Fi]:i.CLAMP_TO_EDGE,[Io]:i.MIRRORED_REPEAT},ee={[gt]:i.NEAREST,[hu]:i.NEAREST_MIPMAP_NEAREST,[Er]:i.NEAREST_MIPMAP_LINEAR,[Rn]:i.LINEAR,[Da]:i.LINEAR_MIPMAP_NEAREST,[hi]:i.LINEAR_MIPMAP_LINEAR},re={[mu]:i.NEVER,[yu]:i.ALWAYS,[gu]:i.LESS,[vh]:i.LEQUAL,[vu]:i.EQUAL,[Mu]:i.GEQUAL,[_u]:i.GREATER,[xu]:i.NOTEQUAL};function we(T,_){if(_.type===Cn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Rn||_.magFilter===Da||_.magFilter===Er||_.magFilter===hi||_.minFilter===Rn||_.minFilter===Da||_.minFilter===Er||_.minFilter===hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,K[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,K[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,K[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ee[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ee[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,re[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===gt||_.minFilter!==Er&&_.minFilter!==hi||_.type===Cn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Je(T,_){let V=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",R));const j=_.source;let J=f.get(j);J===void 0&&(J={},f.set(j,J));const $=z(_);if($!==T.__cacheKey){J[$]===void 0&&(J[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),J[$].usedTimes++;const Ee=J[T.__cacheKey];Ee!==void 0&&(J[T.__cacheKey].usedTimes--,Ee.usedTimes===0&&b(_)),T.__cacheKey=$,T.__webglTexture=J[$].texture}return V}function st(T,_,V){return Math.floor(Math.floor(T/V)/_)}function qe(T,_,V,j){const $=T.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,V,j,_.data);else{$.sort((ie,ue)=>ie.start-ue.start);let Ee=0;for(let ie=1;ie<$.length;ie++){const ue=$[Ee],Pe=$[ie],be=ue.start+ue.count,he=st(Pe.start,_.width,4),ke=st(ue.start,_.width,4);Pe.start<=be+1&&he===ke&&st(Pe.start+Pe.count-1,_.width,4)===he?ue.count=Math.max(ue.count,Pe.start+Pe.count-ue.start):(++Ee,$[Ee]=Pe)}$.length=Ee+1;const ae=i.getParameter(i.UNPACK_ROW_LENGTH),ye=i.getParameter(i.UNPACK_SKIP_PIXELS),Se=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ie=0,ue=$.length;ie<ue;ie++){const Pe=$[ie],be=Math.floor(Pe.start/4),he=Math.ceil(Pe.count/4),ke=be%_.width,D=Math.floor(be/_.width),se=he,oe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,ke),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),t.texSubImage2D(i.TEXTURE_2D,0,ke,D,se,oe,V,j,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ae),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ye),i.pixelStorei(i.UNPACK_SKIP_ROWS,Se)}}function q(T,_,V){let j=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(j=i.TEXTURE_3D);const J=Je(T,_),$=_.source;t.bindTexture(j,T.__webglTexture,i.TEXTURE0+V);const Ee=n.get($);if($.version!==Ee.__version||J===!0){t.activeTexture(i.TEXTURE0+V);const ae=Ye.getPrimaries(Ye.workingColorSpace),ye=_.colorSpace===ri?null:Ye.getPrimaries(_.colorSpace),Se=_.colorSpace===ri||ae===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let ie=x(_.image,!1,s.maxTextureSize);ie=Tt(_,ie);const ue=r.convert(_.format,_.colorSpace),Pe=r.convert(_.type);let be=w(_.internalFormat,ue,Pe,_.colorSpace,_.isVideoTexture);we(j,_);let he;const ke=_.mipmaps,D=_.isVideoTexture!==!0,se=Ee.__version===void 0||J===!0,oe=$.dataReady,ge=E(_,ie);if(_.isDepthTexture)be=M(_.format===fr,_.type),se&&(D?t.texStorage2D(i.TEXTURE_2D,1,be,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,be,ie.width,ie.height,0,ue,Pe,null));else if(_.isDataTexture)if(ke.length>0){D&&se&&t.texStorage2D(i.TEXTURE_2D,ge,be,ke[0].width,ke[0].height);for(let te=0,Z=ke.length;te<Z;te++)he=ke[te],D?oe&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,he.width,he.height,ue,Pe,he.data):t.texImage2D(i.TEXTURE_2D,te,be,he.width,he.height,0,ue,Pe,he.data);_.generateMipmaps=!1}else D?(se&&t.texStorage2D(i.TEXTURE_2D,ge,be,ie.width,ie.height),oe&&qe(_,ie,ue,Pe)):t.texImage2D(i.TEXTURE_2D,0,be,ie.width,ie.height,0,ue,Pe,ie.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){D&&se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,be,ke[0].width,ke[0].height,ie.depth);for(let te=0,Z=ke.length;te<Z;te++)if(he=ke[te],_.format!==Mn)if(ue!==null)if(D){if(oe)if(_.layerUpdates.size>0){const _e=wc(he.width,he.height,_.format,_.type);for(const Ue of _.layerUpdates){const rt=he.data.subarray(Ue*_e/he.data.BYTES_PER_ELEMENT,(Ue+1)*_e/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,Ue,he.width,he.height,1,ue,rt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,he.width,he.height,ie.depth,ue,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,be,he.width,he.height,ie.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?oe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,he.width,he.height,ie.depth,ue,Pe,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,be,he.width,he.height,ie.depth,0,ue,Pe,he.data)}else{D&&se&&t.texStorage2D(i.TEXTURE_2D,ge,be,ke[0].width,ke[0].height);for(let te=0,Z=ke.length;te<Z;te++)he=ke[te],_.format!==Mn?ue!==null?D?oe&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,he.width,he.height,ue,he.data):t.compressedTexImage2D(i.TEXTURE_2D,te,be,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?oe&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,he.width,he.height,ue,Pe,he.data):t.texImage2D(i.TEXTURE_2D,te,be,he.width,he.height,0,ue,Pe,he.data)}else if(_.isDataArrayTexture)if(D){if(se&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ge,be,ie.width,ie.height,ie.depth),oe)if(_.layerUpdates.size>0){const te=wc(ie.width,ie.height,_.format,_.type);for(const Z of _.layerUpdates){const _e=ie.data.subarray(Z*te/ie.data.BYTES_PER_ELEMENT,(Z+1)*te/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,ie.width,ie.height,1,ue,Pe,_e)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ue,Pe,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,be,ie.width,ie.height,ie.depth,0,ue,Pe,ie.data);else if(_.isData3DTexture)D?(se&&t.texStorage3D(i.TEXTURE_3D,ge,be,ie.width,ie.height,ie.depth),oe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ue,Pe,ie.data)):t.texImage3D(i.TEXTURE_3D,0,be,ie.width,ie.height,ie.depth,0,ue,Pe,ie.data);else if(_.isFramebufferTexture){if(se)if(D)t.texStorage2D(i.TEXTURE_2D,ge,be,ie.width,ie.height);else{let te=ie.width,Z=ie.height;for(let _e=0;_e<ge;_e++)t.texImage2D(i.TEXTURE_2D,_e,be,te,Z,0,ue,Pe,null),te>>=1,Z>>=1}}else if(ke.length>0){if(D&&se){const te=_t(ke[0]);t.texStorage2D(i.TEXTURE_2D,ge,be,te.width,te.height)}for(let te=0,Z=ke.length;te<Z;te++)he=ke[te],D?oe&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ue,Pe,he):t.texImage2D(i.TEXTURE_2D,te,be,ue,Pe,he);_.generateMipmaps=!1}else if(D){if(se){const te=_t(ie);t.texStorage2D(i.TEXTURE_2D,ge,be,te.width,te.height)}oe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Pe,ie)}else t.texImage2D(i.TEXTURE_2D,0,be,ue,Pe,ie);g(_)&&p(j),Ee.__version=$.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Y(T,_,V){if(_.image.length!==6)return;const j=Je(T,_),J=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+V);const $=n.get(J);if(J.version!==$.__version||j===!0){t.activeTexture(i.TEXTURE0+V);const Ee=Ye.getPrimaries(Ye.workingColorSpace),ae=_.colorSpace===ri?null:Ye.getPrimaries(_.colorSpace),ye=_.colorSpace===ri||Ee===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Se=_.isCompressedTexture||_.image[0].isCompressedTexture,ie=_.image[0]&&_.image[0].isDataTexture,ue=[];for(let Z=0;Z<6;Z++)!Se&&!ie?ue[Z]=x(_.image[Z],!0,s.maxCubemapSize):ue[Z]=ie?_.image[Z].image:_.image[Z],ue[Z]=Tt(_,ue[Z]);const Pe=ue[0],be=r.convert(_.format,_.colorSpace),he=r.convert(_.type),ke=w(_.internalFormat,be,he,_.colorSpace),D=_.isVideoTexture!==!0,se=$.__version===void 0||j===!0,oe=J.dataReady;let ge=E(_,Pe);we(i.TEXTURE_CUBE_MAP,_);let te;if(Se){D&&se&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,ke,Pe.width,Pe.height);for(let Z=0;Z<6;Z++){te=ue[Z].mipmaps;for(let _e=0;_e<te.length;_e++){const Ue=te[_e];_.format!==Mn?be!==null?D?oe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e,0,0,Ue.width,Ue.height,be,Ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e,ke,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e,0,0,Ue.width,Ue.height,be,he,Ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e,ke,Ue.width,Ue.height,0,be,he,Ue.data)}}}else{if(te=_.mipmaps,D&&se){te.length>0&&ge++;const Z=_t(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,ke,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ie){D?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ue[Z].width,ue[Z].height,be,he,ue[Z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ke,ue[Z].width,ue[Z].height,0,be,he,ue[Z].data);for(let _e=0;_e<te.length;_e++){const rt=te[_e].image[Z].image;D?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e+1,0,0,rt.width,rt.height,be,he,rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e+1,ke,rt.width,rt.height,0,be,he,rt.data)}}else{D?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,be,he,ue[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,ke,be,he,ue[Z]);for(let _e=0;_e<te.length;_e++){const Ue=te[_e];D?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e+1,0,0,be,he,Ue.image[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,_e+1,ke,be,he,Ue.image[Z])}}}g(_)&&p(i.TEXTURE_CUBE_MAP),$.__version=J.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function le(T,_,V,j,J,$){const Ee=r.convert(V.format,V.colorSpace),ae=r.convert(V.type),ye=w(V.internalFormat,Ee,ae,V.colorSpace),Se=n.get(_),ie=n.get(V);if(ie.__renderTarget=_,!Se.__hasExternalTextures){const ue=Math.max(1,_.width>>$),Pe=Math.max(1,_.height>>$);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,$,ye,ue,Pe,_.depth,0,Ee,ae,null):t.texImage2D(J,$,ye,ue,Pe,0,Ee,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,J,ie.__webglTexture,0,ct(_)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,J,ie.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(T,_,V){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const j=_.depthTexture,J=j&&j.isDepthTexture?j.type:null,$=M(_.stencilBuffer,J),Ee=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=ct(_);Me(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,$,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,$,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,$,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ee,i.RENDERBUFFER,T)}else{const j=_.textures;for(let J=0;J<j.length;J++){const $=j[J],Ee=r.convert($.format,$.colorSpace),ae=r.convert($.type),ye=w($.internalFormat,Ee,ae,$.colorSpace),Se=ct(_);V&&Me(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Se,ye,_.width,_.height):Me(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Se,ye,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ye,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function pe(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(_.depthTexture);j.__renderTarget=_,(!j.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),H(_.depthTexture,0);const J=j.__webglTexture,$=ct(_);if(_.depthTexture.format===ur)Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(_.depthTexture.format===fr)Me(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Xe(T){const _=n.get(T),V=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const j=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),j){const J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,j.removeEventListener("dispose",J)};j.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=j}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const j=T.texture.mipmaps;j&&j.length>0?pe(_.__webglFramebuffer[0],T):pe(_.__webglFramebuffer,T)}else if(V){_.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[j]),_.__webglDepthbuffer[j]===void 0)_.__webglDepthbuffer[j]=i.createRenderbuffer(),fe(_.__webglDepthbuffer[j],T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=_.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,$)}}else{const j=T.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),fe(_.__webglDepthbuffer,T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function It(T,_,V){const j=n.get(T);_!==void 0&&le(j.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Xe(T)}function P(T){const _=T.texture,V=n.get(T),j=n.get(_);T.addEventListener("dispose",C);const J=T.textures,$=T.isWebGLCubeRenderTarget===!0,Ee=J.length>1;if(Ee||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=_.version,a.memory.textures++),$){V.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer[ae]=[];for(let ye=0;ye<_.mipmaps.length;ye++)V.__webglFramebuffer[ae][ye]=i.createFramebuffer()}else V.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer=[];for(let ae=0;ae<_.mipmaps.length;ae++)V.__webglFramebuffer[ae]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Ee)for(let ae=0,ye=J.length;ae<ye;ae++){const Se=n.get(J[ae]);Se.__webglTexture===void 0&&(Se.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&Me(T)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ae=0;ae<J.length;ae++){const ye=J[ae];V.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ae]);const Se=r.convert(ye.format,ye.colorSpace),ie=r.convert(ye.type),ue=w(ye.internalFormat,Se,ie,ye.colorSpace,T.isXRRenderTarget===!0),Pe=ct(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,ue,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,V.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(V.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),we(i.TEXTURE_CUBE_MAP,_);for(let ae=0;ae<6;ae++)if(_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)le(V.__webglFramebuffer[ae][ye],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ye);else le(V.__webglFramebuffer[ae],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);g(_)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ae=0,ye=J.length;ae<ye;ae++){const Se=J[ae],ie=n.get(Se);let ue=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ue=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,ie.__webglTexture),we(ue,Se),le(V.__webglFramebuffer,T,Se,i.COLOR_ATTACHMENT0+ae,ue,0),g(Se)&&p(ue)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ae=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,j.__webglTexture),we(ae,_),_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)le(V.__webglFramebuffer[ye],T,_,i.COLOR_ATTACHMENT0,ae,ye);else le(V.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,ae,0);g(_)&&p(ae),t.unbindTexture()}T.depthBuffer&&Xe(T)}function lt(T){const _=T.textures;for(let V=0,j=_.length;V<j;V++){const J=_[V];if(g(J)){const $=A(T),Ee=n.get(J).__webglTexture;t.bindTexture($,Ee),p($),t.unbindTexture()}}}const Ne=[],Le=[];function xe(T){if(T.samples>0){if(Me(T)===!1){const _=T.textures,V=T.width,j=T.height;let J=i.COLOR_BUFFER_BIT;const $=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(T),ae=_.length>1;if(ae)for(let Se=0;Se<_.length;Se++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer);const ye=T.texture.mipmaps;ye&&ye.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Se=0;Se<_.length;Se++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Se]);const ie=n.get(_[Se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ie,0)}i.blitFramebuffer(0,0,V,j,0,0,V,j,J,i.NEAREST),c===!0&&(Ne.length=0,Le.length=0,Ne.push(i.COLOR_ATTACHMENT0+Se),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Ne.push($),Le.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Le)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ne))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let Se=0;Se<_.length;Se++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[Se]);const ie=n.get(_[Se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,ie,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ct(T){return Math.min(s.maxSamples,T.samples)}function Me(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Fe(T){const _=a.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function Tt(T,_){const V=T.colorSpace,j=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||V!==Is&&V!==ri&&(Ye.getTransfer(V)===et?(j!==Mn||J!==Wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),_}function _t(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=u,this.setTexture2D=H,this.setTexture2DArray=B,this.setTexture3D=Q,this.setTextureCube=F,this.rebindTextures=It,this.setupRenderTarget=P,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=le,this.useMultisampledRTT=Me}function F0(i,e){function t(n,s=ri){let r;const a=Ye.getTransfer(s);if(n===Wn)return i.UNSIGNED_BYTE;if(n===Tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===wl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hh)return i.BYTE;if(n===dh)return i.SHORT;if(n===hr)return i.UNSIGNED_SHORT;if(n===El)return i.INT;if(n===Wi)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===vr)return i.HALF_FLOAT;if(n===ph)return i.ALPHA;if(n===mh)return i.RGB;if(n===Mn)return i.RGBA;if(n===ur)return i.DEPTH_COMPONENT;if(n===fr)return i.DEPTH_STENCIL;if(n===Al)return i.RED;if(n===Rl)return i.RED_INTEGER;if(n===gh)return i.RG;if(n===Cl)return i.RG_INTEGER;if(n===Pl)return i.RGBA_INTEGER;if(n===Qr||n===ea||n===ta||n===na)if(a===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Qr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Qr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ea)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ta)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===na)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Do||n===Uo||n===No||n===ko)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Do)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Uo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===No)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ko)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oo||n===Fo||n===Bo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Oo||n===Fo)return a===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Bo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===zo||n===Ho||n===Vo||n===Go||n===Wo||n===Xo||n===qo||n===$o||n===Yo||n===jo||n===Ko||n===Zo||n===Jo||n===Qo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===zo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ho)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Vo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Go)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===qo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$o)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ko)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Jo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Qo)return a===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===el||n===tl||n===nl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===el)return a===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===il||n===sl||n===rl||n===al)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===il)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===al)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const B0=`
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

}`;class H0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Ih(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new _i({vertexShader:B0,fragmentShader:z0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gt(new Jt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class V0 extends ks{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,f=null,m=null,v=null;const x=typeof XRWebGLBinding<"u",g=new H0,p={},A=t.getContextAttributes();let w=null,M=null;const E=[],R=[],C=new We;let I=null;const b=new _n;b.viewport=new yt;const S=new _n;S.viewport=new yt;const L=[b,S],u=new cf;let N=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Y=E[q];return Y===void 0&&(Y=new io,E[q]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(q){let Y=E[q];return Y===void 0&&(Y=new io,E[q]=Y),Y.getGripSpace()},this.getHand=function(q){let Y=E[q];return Y===void 0&&(Y=new io,E[q]=Y),Y.getHandSpace()};function H(q){const Y=R.indexOf(q.inputSource);if(Y===-1)return;const le=E[Y];le!==void 0&&(le.update(q.inputSource,q.frame,l||a),le.dispatchEvent({type:q.type,data:q.inputSource}))}function B(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",Q);for(let q=0;q<E.length;q++){const Y=R[q];Y!==null&&(R[q]=null,E[q].disconnect(Y))}N=null,z=null,g.reset();for(const q in p)delete p[q];e.setRenderTarget(w),m=null,f=null,d=null,s=null,M=null,qe.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",B),s.addEventListener("inputsourceschange",Q),A.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,fe=null,pe=null;A.depth&&(pe=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,le=A.stencil?fr:ur,fe=A.stencil?dr:Wi);const Xe={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(Xe),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new Xi(f.textureWidth,f.textureHeight,{format:Mn,type:Wn,depthTexture:new Lh(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const le={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,le),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new Xi(m.framebufferWidth,m.framebufferHeight,{format:Mn,type:Wn,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),qe.setContext(s),qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Q(q){for(let Y=0;Y<q.removed.length;Y++){const le=q.removed[Y],fe=R.indexOf(le);fe>=0&&(R[fe]=null,E[fe].disconnect(le))}for(let Y=0;Y<q.added.length;Y++){const le=q.added[Y];let fe=R.indexOf(le);if(fe===-1){for(let Xe=0;Xe<E.length;Xe++)if(Xe>=R.length){R.push(le),fe=Xe;break}else if(R[Xe]===null){R[Xe]=le,fe=Xe;break}if(fe===-1)break}const pe=E[fe];pe&&pe.connect(le)}}const F=new G,K=new G;function ee(q,Y,le){F.setFromMatrixPosition(Y.matrixWorld),K.setFromMatrixPosition(le.matrixWorld);const fe=F.distanceTo(K),pe=Y.projectionMatrix.elements,Xe=le.projectionMatrix.elements,It=pe[14]/(pe[10]-1),P=pe[14]/(pe[10]+1),lt=(pe[9]+1)/pe[5],Ne=(pe[9]-1)/pe[5],Le=(pe[8]-1)/pe[0],xe=(Xe[8]+1)/Xe[0],ct=It*Le,Me=It*xe,Fe=fe/(-Le+xe),Tt=Fe*-Le;if(Y.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Tt),q.translateZ(Fe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),pe[10]===-1)q.projectionMatrix.copy(Y.projectionMatrix),q.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const _t=It+Fe,T=P+Fe,_=ct-Tt,V=Me+(fe-Tt),j=lt*P/T*_t,J=Ne*P/T*_t;q.projectionMatrix.makePerspective(_,V,j,J,_t,T),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function re(q,Y){Y===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Y.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Y=q.near,le=q.far;g.texture!==null&&(g.depthNear>0&&(Y=g.depthNear),g.depthFar>0&&(le=g.depthFar)),u.near=S.near=b.near=Y,u.far=S.far=b.far=le,(N!==u.near||z!==u.far)&&(s.updateRenderState({depthNear:u.near,depthFar:u.far}),N=u.near,z=u.far),u.layers.mask=q.layers.mask|6,b.layers.mask=u.layers.mask&3,S.layers.mask=u.layers.mask&5;const fe=q.parent,pe=u.cameras;re(u,fe);for(let Xe=0;Xe<pe.length;Xe++)re(pe[Xe],fe);pe.length===2?ee(u,b,S):u.projectionMatrix.copy(b.projectionMatrix),we(q,u,fe)};function we(q,Y,le){le===null?q.matrix.copy(Y.matrixWorld):(q.matrix.copy(le.matrixWorld),q.matrix.invert(),q.matrix.multiply(Y.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Y.projectionMatrix),q.projectionMatrixInverse.copy(Y.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ll*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return u},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(q){c=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(u)},this.getCameraTexture=function(q){return p[q]};let Je=null;function st(q,Y){if(h=Y.getViewerPose(l||a),v=Y,h!==null){const le=h.views;m!==null&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let fe=!1;le.length!==u.cameras.length&&(u.cameras.length=0,fe=!0);for(let P=0;P<le.length;P++){const lt=le[P];let Ne=null;if(m!==null)Ne=m.getViewport(lt);else{const xe=d.getViewSubImage(f,lt);Ne=xe.viewport,P===0&&(e.setRenderTargetTextures(M,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(M))}let Le=L[P];Le===void 0&&(Le=new _n,Le.layers.enable(P),Le.viewport=new yt,L[P]=Le),Le.matrix.fromArray(lt.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(lt.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),P===0&&(u.matrix.copy(Le.matrix),u.matrix.decompose(u.position,u.quaternion,u.scale)),fe===!0&&u.cameras.push(Le)}const pe=s.enabledFeatures;if(pe&&pe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=n.getBinding();const P=d.getDepthInformation(le[0]);P&&P.isValid&&P.texture&&g.init(P,s.renderState)}if(pe&&pe.includes("camera-access")&&x){e.state.unbindTexture(),d=n.getBinding();for(let P=0;P<le.length;P++){const lt=le[P].camera;if(lt){let Ne=p[lt];Ne||(Ne=new Ih,p[lt]=Ne);const Le=d.getCameraImage(lt);Ne.sourceTexture=Le}}}}for(let le=0;le<E.length;le++){const fe=R[le],pe=E[le];fe!==null&&pe!==void 0&&pe.update(fe,Y,l||a)}Je&&Je(q,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),v=null}const qe=new Uh;qe.setAnimationLoop(st),this.setAnimationLoop=function(q){Je=q},this.dispose=function(){}}}const Ci=new Xn,G0=new ht;function W0(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Th(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,A,w,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&m(g,p,M)):p.isMeshMatcapMaterial?(r(g,p),v(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,A,w):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===$t&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===$t&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const A=e.get(p),w=A.envMap,M=A.envMapRotation;w&&(g.envMap.value=w,Ci.copy(M),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),g.envMapRotation.value.setFromMatrix4(G0.makeRotationFromEuler(Ci)),g.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,A,w){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*A,g.scale.value=w*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function m(g,p,A){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$t&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=A.texture,g.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const A=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(A.matrixWorld),g.nearDistance.value=A.shadow.camera.near,g.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function X0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,w){const M=w.program;n.uniformBlockBinding(A,M)}function l(A,w){let M=s[A.id];M===void 0&&(v(A),M=h(A),s[A.id]=M,A.addEventListener("dispose",g));const E=w.program;n.updateUBOMapping(A,E);const R=e.render.frame;r[A.id]!==R&&(f(A),r[A.id]=R)}function h(A){const w=d();A.__bindingPointIndex=w;const M=i.createBuffer(),E=A.__size,R=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,E,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,M),M}function d(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const w=s[A.id],M=A.uniforms,E=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let R=0,C=M.length;R<C;R++){const I=Array.isArray(M[R])?M[R]:[M[R]];for(let b=0,S=I.length;b<S;b++){const L=I[b];if(m(L,R,b,E)===!0){const u=L.__offset,N=Array.isArray(L.value)?L.value:[L.value];let z=0;for(let H=0;H<N.length;H++){const B=N[H],Q=x(B);typeof B=="number"||typeof B=="boolean"?(L.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,u+z,L.__data)):B.isMatrix3?(L.__data[0]=B.elements[0],L.__data[1]=B.elements[1],L.__data[2]=B.elements[2],L.__data[3]=0,L.__data[4]=B.elements[3],L.__data[5]=B.elements[4],L.__data[6]=B.elements[5],L.__data[7]=0,L.__data[8]=B.elements[6],L.__data[9]=B.elements[7],L.__data[10]=B.elements[8],L.__data[11]=0):(B.toArray(L.__data,z),z+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,u,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(A,w,M,E){const R=A.value,C=w+"_"+M;if(E[C]===void 0)return typeof R=="number"||typeof R=="boolean"?E[C]=R:E[C]=R.clone(),!0;{const I=E[C];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return E[C]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function v(A){const w=A.uniforms;let M=0;const E=16;for(let C=0,I=w.length;C<I;C++){const b=Array.isArray(w[C])?w[C]:[w[C]];for(let S=0,L=b.length;S<L;S++){const u=b[S],N=Array.isArray(u.value)?u.value:[u.value];for(let z=0,H=N.length;z<H;z++){const B=N[z],Q=x(B),F=M%E,K=F%Q.boundary,ee=F+K;M+=K,ee!==0&&E-ee<Q.storage&&(M+=E-ee),u.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),u.__offset=M,M+=Q.storage}}}const R=M%E;return R>0&&(M+=E-R),A.__size=M,A.__cache={},this}function x(A){const w={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(w.boundary=4,w.storage=4):A.isVector2?(w.boundary=8,w.storage=8):A.isVector3||A.isColor?(w.boundary=16,w.storage=12):A.isVector4?(w.boundary=16,w.storage=16):A.isMatrix3?(w.boundary=48,w.storage=48):A.isMatrix4?(w.boundary=64,w.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),w}function g(A){const w=A.target;w.removeEventListener("dispose",g);const M=a.indexOf(w.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function p(){for(const A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class q0{constructor(e={}){const{canvas:t=bu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const v=new Uint32Array(4),x=new Int32Array(4);let g=null,p=null;const A=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let E=!1;this._outputColorSpace=mt;let R=0,C=0,I=null,b=-1,S=null;const L=new yt,u=new yt;let N=null;const z=new je(0);let H=0,B=t.width,Q=t.height,F=1,K=null,ee=null;const re=new yt(0,0,B,Q),we=new yt(0,0,B,Q);let Je=!1;const st=new Ch;let qe=!1,q=!1;const Y=new ht,le=new G,fe=new yt,pe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xe=!1;function It(){return I===null?F:1}let P=n;function lt(y,k){return t.getContext(y,k)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${bl}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",te,!1),P===null){const k="webgl2";if(P=lt(k,y),P===null)throw lt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ne,Le,xe,ct,Me,Fe,Tt,_t,T,_,V,j,J,$,Ee,ae,ye,Se,ie,ue,Pe,be,he,ke;function D(){Ne=new ng(P),Ne.init(),be=new F0(P,Ne),Le=new jm(P,Ne,e,be),xe=new k0(P,Ne),Le.reversedDepthBuffer&&f&&xe.buffers.depth.setReversed(!0),ct=new rg(P),Me=new b0,Fe=new O0(P,Ne,xe,Me,Le,be,ct),Tt=new Zm(M),_t=new tg(M),T=new df(P),he=new $m(P,T),_=new ig(P,T,ct,he),V=new og(P,_,T,ct),ie=new ag(P,Le,Fe),ae=new Km(Me),j=new S0(M,Tt,_t,Ne,Le,he,ae),J=new W0(M,Me),$=new T0,Ee=new L0(Ne),Se=new qm(M,Tt,_t,xe,V,m,c),ye=new U0(M,V,Le),ke=new X0(P,ct,Le,xe),ue=new Ym(P,Ne,ct),Pe=new sg(P,Ne,ct),ct.programs=j.programs,M.capabilities=Le,M.extensions=Ne,M.properties=Me,M.renderLists=$,M.shadowMap=ye,M.state=xe,M.info=ct}D();const se=new V0(M,P);this.xr=se,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const y=Ne.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ne.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(y){y!==void 0&&(F=y,this.setSize(B,Q,!1))},this.getSize=function(y){return y.set(B,Q)},this.setSize=function(y,k,W=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=y,Q=k,t.width=Math.floor(y*F),t.height=Math.floor(k*F),W===!0&&(t.style.width=y+"px",t.style.height=k+"px"),this.setViewport(0,0,y,k)},this.getDrawingBufferSize=function(y){return y.set(B*F,Q*F).floor()},this.setDrawingBufferSize=function(y,k,W){B=y,Q=k,F=W,t.width=Math.floor(y*W),t.height=Math.floor(k*W),this.setViewport(0,0,y,k)},this.getCurrentViewport=function(y){return y.copy(L)},this.getViewport=function(y){return y.copy(re)},this.setViewport=function(y,k,W,X){y.isVector4?re.set(y.x,y.y,y.z,y.w):re.set(y,k,W,X),xe.viewport(L.copy(re).multiplyScalar(F).round())},this.getScissor=function(y){return y.copy(we)},this.setScissor=function(y,k,W,X){y.isVector4?we.set(y.x,y.y,y.z,y.w):we.set(y,k,W,X),xe.scissor(u.copy(we).multiplyScalar(F).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(y){xe.setScissorTest(Je=y)},this.setOpaqueSort=function(y){K=y},this.setTransparentSort=function(y){ee=y},this.getClearColor=function(y){return y.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor(...arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha(...arguments)},this.clear=function(y=!0,k=!0,W=!0){let X=0;if(y){let O=!1;if(I!==null){const ne=I.texture.format;O=ne===Pl||ne===Cl||ne===Rl}if(O){const ne=I.texture.type,de=ne===Wn||ne===Wi||ne===hr||ne===dr||ne===Tl||ne===wl,ve=Se.getClearColor(),me=Se.getClearAlpha(),Ce=ve.r,Ie=ve.g,Ae=ve.b;de?(v[0]=Ce,v[1]=Ie,v[2]=Ae,v[3]=me,P.clearBufferuiv(P.COLOR,0,v)):(x[0]=Ce,x[1]=Ie,x[2]=Ae,x[3]=me,P.clearBufferiv(P.COLOR,0,x))}else X|=P.COLOR_BUFFER_BIT}k&&(X|=P.DEPTH_BUFFER_BIT),W&&(X|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",te,!1),Se.dispose(),$.dispose(),Ee.dispose(),Me.dispose(),Tt.dispose(),_t.dispose(),V.dispose(),he.dispose(),ke.dispose(),j.dispose(),se.dispose(),se.removeEventListener("sessionstart",yn),se.removeEventListener("sessionend",Fl),Mi.stop()};function oe(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const y=ct.autoReset,k=ye.enabled,W=ye.autoUpdate,X=ye.needsUpdate,O=ye.type;D(),ct.autoReset=y,ye.enabled=k,ye.autoUpdate=W,ye.needsUpdate=X,ye.type=O}function te(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Z(y){const k=y.target;k.removeEventListener("dispose",Z),_e(k)}function _e(y){Ue(y),Me.remove(y)}function Ue(y){const k=Me.get(y).programs;k!==void 0&&(k.forEach(function(W){j.releaseProgram(W)}),y.isShaderMaterial&&j.releaseShaderCache(y))}this.renderBufferDirect=function(y,k,W,X,O,ne){k===null&&(k=pe);const de=O.isMesh&&O.matrixWorld.determinant()<0,ve=id(y,k,W,X,O);xe.setMaterial(X,de);let me=W.index,Ce=1;if(X.wireframe===!0){if(me=_.getWireframeAttribute(W),me===void 0)return;Ce=2}const Ie=W.drawRange,Ae=W.attributes.position;let ze=Ie.start*Ce,Qe=(Ie.start+Ie.count)*Ce;ne!==null&&(ze=Math.max(ze,ne.start*Ce),Qe=Math.min(Qe,(ne.start+ne.count)*Ce)),me!==null?(ze=Math.max(ze,0),Qe=Math.min(Qe,me.count)):Ae!=null&&(ze=Math.max(ze,0),Qe=Math.min(Qe,Ae.count));const ft=Qe-ze;if(ft<0||ft===1/0)return;he.setup(O,X,ve,W,me);let at,nt=ue;if(me!==null&&(at=T.get(me),nt=Pe,nt.setIndex(at)),O.isMesh)X.wireframe===!0?(xe.setLineWidth(X.wireframeLinewidth*It()),nt.setMode(P.LINES)):nt.setMode(P.TRIANGLES);else if(O.isLine){let Re=X.linewidth;Re===void 0&&(Re=1),xe.setLineWidth(Re*It()),O.isLineSegments?nt.setMode(P.LINES):O.isLineLoop?nt.setMode(P.LINE_LOOP):nt.setMode(P.LINE_STRIP)}else O.isPoints?nt.setMode(P.POINTS):O.isSprite&&nt.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)mr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),nt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Ne.get("WEBGL_multi_draw"))nt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Re=O._multiDrawStarts,dt=O._multiDrawCounts,$e=O._multiDrawCount,Yt=me?T.get(me).bytesPerElement:1,Ki=Me.get(X).currentProgram.getUniforms();for(let jt=0;jt<$e;jt++)Ki.setValue(P,"_gl_DrawID",jt),nt.render(Re[jt]/Yt,dt[jt])}else if(O.isInstancedMesh)nt.renderInstances(ze,ft,O.count);else if(W.isInstancedBufferGeometry){const Re=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,dt=Math.min(W.instanceCount,Re);nt.renderInstances(ze,ft,dt)}else nt.render(ze,ft)};function rt(y,k,W){y.transparent===!0&&y.side===ln&&y.forceSinglePass===!1?(y.side=$t,y.needsUpdate=!0,Sr(y,k,W),y.side=vi,y.needsUpdate=!0,Sr(y,k,W),y.side=ln):Sr(y,k,W)}this.compile=function(y,k,W=null){W===null&&(W=y),p=Ee.get(W),p.init(k),w.push(p),W.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),y!==W&&y.traverseVisible(function(O){O.isLight&&O.layers.test(k.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();const X=new Set;return y.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ne=O.material;if(ne)if(Array.isArray(ne))for(let de=0;de<ne.length;de++){const ve=ne[de];rt(ve,W,O),X.add(ve)}else rt(ne,W,O),X.add(ne)}),p=w.pop(),X},this.compileAsync=function(y,k,W=null){const X=this.compile(y,k,W);return new Promise(O=>{function ne(){if(X.forEach(function(de){Me.get(de).currentProgram.isReady()&&X.delete(de)}),X.size===0){O(y);return}setTimeout(ne,10)}Ne.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let Ze=null;function Un(y){Ze&&Ze(y)}function yn(){Mi.stop()}function Fl(){Mi.start()}const Mi=new Uh;Mi.setAnimationLoop(Un),typeof self<"u"&&Mi.setContext(self),this.setAnimationLoop=function(y){Ze=y,se.setAnimationLoop(y),y===null?Mi.stop():Mi.start()},se.addEventListener("sessionstart",yn),se.addEventListener("sessionend",Fl),this.render=function(y,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(k),k=se.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,k,I),p=Ee.get(y,w.length),p.init(k),w.push(p),Y.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),st.setFromProjectionMatrix(Y,Pn,k.reversedDepth),q=this.localClippingEnabled,qe=ae.init(this.clippingPlanes,q),g=$.get(y,A.length),g.init(),A.push(g),se.enabled===!0&&se.isPresenting===!0){const ne=M.xr.getDepthSensingMesh();ne!==null&&Aa(ne,k,-1/0,M.sortObjects)}Aa(y,k,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(K,ee),Xe=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,Xe&&Se.addToRenderList(g,y),this.info.render.frame++,qe===!0&&ae.beginShadows();const W=p.state.shadowsArray;ye.render(W,y,k),qe===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=g.opaque,O=g.transmissive;if(p.setupLights(),k.isArrayCamera){const ne=k.cameras;if(O.length>0)for(let de=0,ve=ne.length;de<ve;de++){const me=ne[de];zl(X,O,y,me)}Xe&&Se.render(y);for(let de=0,ve=ne.length;de<ve;de++){const me=ne[de];Bl(g,y,me,me.viewport)}}else O.length>0&&zl(X,O,y,k),Xe&&Se.render(y),Bl(g,y,k);I!==null&&C===0&&(Fe.updateMultisampleRenderTarget(I),Fe.updateRenderTargetMipmap(I)),y.isScene===!0&&y.onAfterRender(M,y,k),he.resetDefaultState(),b=-1,S=null,w.pop(),w.length>0?(p=w[w.length-1],qe===!0&&ae.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?g=A[A.length-1]:g=null};function Aa(y,k,W,X){if(y.visible===!1)return;if(y.layers.test(k.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(k);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||st.intersectsSprite(y)){X&&fe.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Y);const de=V.update(y),ve=y.material;ve.visible&&g.push(y,de,ve,W,fe.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||st.intersectsObject(y))){const de=V.update(y),ve=y.material;if(X&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),fe.copy(y.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),fe.copy(de.boundingSphere.center)),fe.applyMatrix4(y.matrixWorld).applyMatrix4(Y)),Array.isArray(ve)){const me=de.groups;for(let Ce=0,Ie=me.length;Ce<Ie;Ce++){const Ae=me[Ce],ze=ve[Ae.materialIndex];ze&&ze.visible&&g.push(y,de,ze,W,fe.z,Ae)}}else ve.visible&&g.push(y,de,ve,W,fe.z,null)}}const ne=y.children;for(let de=0,ve=ne.length;de<ve;de++)Aa(ne[de],k,W,X)}function Bl(y,k,W,X){const O=y.opaque,ne=y.transmissive,de=y.transparent;p.setupLightsView(W),qe===!0&&ae.setGlobalState(M.clippingPlanes,W),X&&xe.viewport(L.copy(X)),O.length>0&&yr(O,k,W),ne.length>0&&yr(ne,k,W),de.length>0&&yr(de,k,W),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function zl(y,k,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new Xi(1,1,{generateMipmaps:!0,type:Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float")?vr:Wn,minFilter:hi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const ne=p.state.transmissionRenderTarget[X.id],de=X.viewport||L;ne.setSize(de.z*M.transmissionResolutionScale,de.w*M.transmissionResolutionScale);const ve=M.getRenderTarget(),me=M.getActiveCubeFace(),Ce=M.getActiveMipmapLevel();M.setRenderTarget(ne),M.getClearColor(z),H=M.getClearAlpha(),H<1&&M.setClearColor(16777215,.5),M.clear(),Xe&&Se.render(W);const Ie=M.toneMapping;M.toneMapping=fi;const Ae=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),qe===!0&&ae.setGlobalState(M.clippingPlanes,X),yr(y,W,X),Fe.updateMultisampleRenderTarget(ne),Fe.updateRenderTargetMipmap(ne),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let Qe=0,ft=k.length;Qe<ft;Qe++){const at=k[Qe],nt=at.object,Re=at.geometry,dt=at.material,$e=at.group;if(dt.side===ln&&nt.layers.test(X.layers)){const Yt=dt.side;dt.side=$t,dt.needsUpdate=!0,Hl(nt,W,X,Re,dt,$e),dt.side=Yt,dt.needsUpdate=!0,ze=!0}}ze===!0&&(Fe.updateMultisampleRenderTarget(ne),Fe.updateRenderTargetMipmap(ne))}M.setRenderTarget(ve,me,Ce),M.setClearColor(z,H),Ae!==void 0&&(X.viewport=Ae),M.toneMapping=Ie}function yr(y,k,W){const X=k.isScene===!0?k.overrideMaterial:null;for(let O=0,ne=y.length;O<ne;O++){const de=y[O],ve=de.object,me=de.geometry,Ce=de.group;let Ie=de.material;Ie.allowOverride===!0&&X!==null&&(Ie=X),ve.layers.test(W.layers)&&Hl(ve,k,W,me,Ie,Ce)}}function Hl(y,k,W,X,O,ne){y.onBeforeRender(M,k,W,X,O,ne),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),O.onBeforeRender(M,k,W,X,y,ne),O.transparent===!0&&O.side===ln&&O.forceSinglePass===!1?(O.side=$t,O.needsUpdate=!0,M.renderBufferDirect(W,k,X,O,y,ne),O.side=vi,O.needsUpdate=!0,M.renderBufferDirect(W,k,X,O,y,ne),O.side=ln):M.renderBufferDirect(W,k,X,O,y,ne),y.onAfterRender(M,k,W,X,O,ne)}function Sr(y,k,W){k.isScene!==!0&&(k=pe);const X=Me.get(y),O=p.state.lights,ne=p.state.shadowsArray,de=O.state.version,ve=j.getParameters(y,O.state,ne,k,W),me=j.getProgramCacheKey(ve);let Ce=X.programs;X.environment=y.isMeshStandardMaterial?k.environment:null,X.fog=k.fog,X.envMap=(y.isMeshStandardMaterial?_t:Tt).get(y.envMap||X.environment),X.envMapRotation=X.environment!==null&&y.envMap===null?k.environmentRotation:y.envMapRotation,Ce===void 0&&(y.addEventListener("dispose",Z),Ce=new Map,X.programs=Ce);let Ie=Ce.get(me);if(Ie!==void 0){if(X.currentProgram===Ie&&X.lightsStateVersion===de)return Gl(y,ve),Ie}else ve.uniforms=j.getUniforms(y),y.onBeforeCompile(ve,M),Ie=j.acquireProgram(ve,me),Ce.set(me,Ie),X.uniforms=ve.uniforms;const Ae=X.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ae.clippingPlanes=ae.uniform),Gl(y,ve),X.needsLights=rd(y),X.lightsStateVersion=de,X.needsLights&&(Ae.ambientLightColor.value=O.state.ambient,Ae.lightProbe.value=O.state.probe,Ae.directionalLights.value=O.state.directional,Ae.directionalLightShadows.value=O.state.directionalShadow,Ae.spotLights.value=O.state.spot,Ae.spotLightShadows.value=O.state.spotShadow,Ae.rectAreaLights.value=O.state.rectArea,Ae.ltc_1.value=O.state.rectAreaLTC1,Ae.ltc_2.value=O.state.rectAreaLTC2,Ae.pointLights.value=O.state.point,Ae.pointLightShadows.value=O.state.pointShadow,Ae.hemisphereLights.value=O.state.hemi,Ae.directionalShadowMap.value=O.state.directionalShadowMap,Ae.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ae.spotShadowMap.value=O.state.spotShadowMap,Ae.spotLightMatrix.value=O.state.spotLightMatrix,Ae.spotLightMap.value=O.state.spotLightMap,Ae.pointShadowMap.value=O.state.pointShadowMap,Ae.pointShadowMatrix.value=O.state.pointShadowMatrix),X.currentProgram=Ie,X.uniformsList=null,Ie}function Vl(y){if(y.uniformsList===null){const k=y.currentProgram.getUniforms();y.uniformsList=ia.seqWithValue(k.seq,y.uniforms)}return y.uniformsList}function Gl(y,k){const W=Me.get(y);W.outputColorSpace=k.outputColorSpace,W.batching=k.batching,W.batchingColor=k.batchingColor,W.instancing=k.instancing,W.instancingColor=k.instancingColor,W.instancingMorph=k.instancingMorph,W.skinning=k.skinning,W.morphTargets=k.morphTargets,W.morphNormals=k.morphNormals,W.morphColors=k.morphColors,W.morphTargetsCount=k.morphTargetsCount,W.numClippingPlanes=k.numClippingPlanes,W.numIntersection=k.numClipIntersection,W.vertexAlphas=k.vertexAlphas,W.vertexTangents=k.vertexTangents,W.toneMapping=k.toneMapping}function id(y,k,W,X,O){k.isScene!==!0&&(k=pe),Fe.resetTextureUnits();const ne=k.fog,de=X.isMeshStandardMaterial?k.environment:null,ve=I===null?M.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Is,me=(X.isMeshStandardMaterial?_t:Tt).get(X.envMap||de),Ce=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ie=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ae=!!W.morphAttributes.position,ze=!!W.morphAttributes.normal,Qe=!!W.morphAttributes.color;let ft=fi;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ft=M.toneMapping);const at=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,nt=at!==void 0?at.length:0,Re=Me.get(X),dt=p.state.lights;if(qe===!0&&(q===!0||y!==S)){const Bt=y===S&&X.id===b;ae.setState(X,y,Bt)}let $e=!1;X.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==dt.state.version||Re.outputColorSpace!==ve||O.isBatchedMesh&&Re.batching===!1||!O.isBatchedMesh&&Re.batching===!0||O.isBatchedMesh&&Re.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Re.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Re.instancing===!1||!O.isInstancedMesh&&Re.instancing===!0||O.isSkinnedMesh&&Re.skinning===!1||!O.isSkinnedMesh&&Re.skinning===!0||O.isInstancedMesh&&Re.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Re.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Re.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Re.instancingMorph===!1&&O.morphTexture!==null||Re.envMap!==me||X.fog===!0&&Re.fog!==ne||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==ae.numPlanes||Re.numIntersection!==ae.numIntersection)||Re.vertexAlphas!==Ce||Re.vertexTangents!==Ie||Re.morphTargets!==Ae||Re.morphNormals!==ze||Re.morphColors!==Qe||Re.toneMapping!==ft||Re.morphTargetsCount!==nt)&&($e=!0):($e=!0,Re.__version=X.version);let Yt=Re.currentProgram;$e===!0&&(Yt=Sr(X,k,O));let Ki=!1,jt=!1,zs=!1;const ut=Yt.getUniforms(),nn=Re.uniforms;if(xe.useProgram(Yt.program)&&(Ki=!0,jt=!0,zs=!0),X.id!==b&&(b=X.id,jt=!0),Ki||S!==y){xe.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ut.setValue(P,"projectionMatrix",y.projectionMatrix),ut.setValue(P,"viewMatrix",y.matrixWorldInverse);const Wt=ut.map.cameraPosition;Wt!==void 0&&Wt.setValue(P,le.setFromMatrixPosition(y.matrixWorld)),Le.logarithmicDepthBuffer&&ut.setValue(P,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ut.setValue(P,"isOrthographic",y.isOrthographicCamera===!0),S!==y&&(S=y,jt=!0,zs=!0)}if(O.isSkinnedMesh){ut.setOptional(P,O,"bindMatrix"),ut.setOptional(P,O,"bindMatrixInverse");const Bt=O.skeleton;Bt&&(Bt.boneTexture===null&&Bt.computeBoneTexture(),ut.setValue(P,"boneTexture",Bt.boneTexture,Fe))}O.isBatchedMesh&&(ut.setOptional(P,O,"batchingTexture"),ut.setValue(P,"batchingTexture",O._matricesTexture,Fe),ut.setOptional(P,O,"batchingIdTexture"),ut.setValue(P,"batchingIdTexture",O._indirectTexture,Fe),ut.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&ut.setValue(P,"batchingColorTexture",O._colorsTexture,Fe));const sn=W.morphAttributes;if((sn.position!==void 0||sn.normal!==void 0||sn.color!==void 0)&&ie.update(O,W,Yt),(jt||Re.receiveShadow!==O.receiveShadow)&&(Re.receiveShadow=O.receiveShadow,ut.setValue(P,"receiveShadow",O.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(nn.envMap.value=me,nn.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&k.environment!==null&&(nn.envMapIntensity.value=k.environmentIntensity),jt&&(ut.setValue(P,"toneMappingExposure",M.toneMappingExposure),Re.needsLights&&sd(nn,zs),ne&&X.fog===!0&&J.refreshFogUniforms(nn,ne),J.refreshMaterialUniforms(nn,X,F,Q,p.state.transmissionRenderTarget[y.id]),ia.upload(P,Vl(Re),nn,Fe)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ia.upload(P,Vl(Re),nn,Fe),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ut.setValue(P,"center",O.center),ut.setValue(P,"modelViewMatrix",O.modelViewMatrix),ut.setValue(P,"normalMatrix",O.normalMatrix),ut.setValue(P,"modelMatrix",O.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Bt=X.uniformsGroups;for(let Wt=0,Ra=Bt.length;Wt<Ra;Wt++){const yi=Bt[Wt];ke.update(yi,Yt),ke.bind(yi,Yt)}}return Yt}function sd(y,k){y.ambientLightColor.needsUpdate=k,y.lightProbe.needsUpdate=k,y.directionalLights.needsUpdate=k,y.directionalLightShadows.needsUpdate=k,y.pointLights.needsUpdate=k,y.pointLightShadows.needsUpdate=k,y.spotLights.needsUpdate=k,y.spotLightShadows.needsUpdate=k,y.rectAreaLights.needsUpdate=k,y.hemisphereLights.needsUpdate=k}function rd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(y,k,W){const X=Me.get(y);X.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Me.get(y.texture).__webglTexture=k,Me.get(y.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,k){const W=Me.get(y);W.__webglFramebuffer=k,W.__useDefaultFramebuffer=k===void 0};const ad=P.createFramebuffer();this.setRenderTarget=function(y,k=0,W=0){I=y,R=k,C=W;let X=!0,O=null,ne=!1,de=!1;if(y){const me=Me.get(y);if(me.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(P.FRAMEBUFFER,null),X=!1;else if(me.__webglFramebuffer===void 0)Fe.setupRenderTarget(y);else if(me.__hasExternalTextures)Fe.rebindTextures(y,Me.get(y.texture).__webglTexture,Me.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ae=y.depthTexture;if(me.__boundDepthTexture!==Ae){if(Ae!==null&&Me.has(Ae)&&(y.width!==Ae.image.width||y.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(y)}}const Ce=y.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(de=!0);const Ie=Me.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ie[k])?O=Ie[k][W]:O=Ie[k],ne=!0):y.samples>0&&Fe.useMultisampledRTT(y)===!1?O=Me.get(y).__webglMultisampledFramebuffer:Array.isArray(Ie)?O=Ie[W]:O=Ie,L.copy(y.viewport),u.copy(y.scissor),N=y.scissorTest}else L.copy(re).multiplyScalar(F).floor(),u.copy(we).multiplyScalar(F).floor(),N=Je;if(W!==0&&(O=ad),xe.bindFramebuffer(P.FRAMEBUFFER,O)&&X&&xe.drawBuffers(y,O),xe.viewport(L),xe.scissor(u),xe.setScissorTest(N),ne){const me=Me.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+k,me.__webglTexture,W)}else if(de){const me=k;for(let Ce=0;Ce<y.textures.length;Ce++){const Ie=Me.get(y.textures[Ce]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Ce,Ie.__webglTexture,W,me)}}else if(y!==null&&W!==0){const me=Me.get(y.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,me.__webglTexture,W)}b=-1},this.readRenderTargetPixels=function(y,k,W,X,O,ne,de,ve=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=Me.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(me=me[de]),me){xe.bindFramebuffer(P.FRAMEBUFFER,me);try{const Ce=y.textures[ve],Ie=Ce.format,Ae=Ce.type;if(!Le.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=y.width-X&&W>=0&&W<=y.height-O&&(y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),P.readPixels(k,W,X,O,be.convert(Ie),be.convert(Ae),ne))}finally{const Ce=I!==null?Me.get(I).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(y,k,W,X,O,ne,de,ve=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=Me.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(me=me[de]),me)if(k>=0&&k<=y.width-X&&W>=0&&W<=y.height-O){xe.bindFramebuffer(P.FRAMEBUFFER,me);const Ce=y.textures[ve],Ie=Ce.format,Ae=Ce.type;if(!Le.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ze=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ze),P.bufferData(P.PIXEL_PACK_BUFFER,ne.byteLength,P.STREAM_READ),y.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),P.readPixels(k,W,X,O,be.convert(Ie),be.convert(Ae),0);const Qe=I!==null?Me.get(I).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,Qe);const ft=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Eu(P,ft,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,ze),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ne),P.deleteBuffer(ze),P.deleteSync(ft),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,k=null,W=0){const X=Math.pow(2,-W),O=Math.floor(y.image.width*X),ne=Math.floor(y.image.height*X),de=k!==null?k.x:0,ve=k!==null?k.y:0;Fe.setTexture2D(y,0),P.copyTexSubImage2D(P.TEXTURE_2D,W,0,0,de,ve,O,ne),xe.unbindTexture()};const od=P.createFramebuffer(),ld=P.createFramebuffer();this.copyTextureToTexture=function(y,k,W=null,X=null,O=0,ne=null){ne===null&&(O!==0?(mr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ne=O,O=0):ne=0);let de,ve,me,Ce,Ie,Ae,ze,Qe,ft;const at=y.isCompressedTexture?y.mipmaps[ne]:y.image;if(W!==null)de=W.max.x-W.min.x,ve=W.max.y-W.min.y,me=W.isBox3?W.max.z-W.min.z:1,Ce=W.min.x,Ie=W.min.y,Ae=W.isBox3?W.min.z:0;else{const sn=Math.pow(2,-O);de=Math.floor(at.width*sn),ve=Math.floor(at.height*sn),y.isDataArrayTexture?me=at.depth:y.isData3DTexture?me=Math.floor(at.depth*sn):me=1,Ce=0,Ie=0,Ae=0}X!==null?(ze=X.x,Qe=X.y,ft=X.z):(ze=0,Qe=0,ft=0);const nt=be.convert(k.format),Re=be.convert(k.type);let dt;k.isData3DTexture?(Fe.setTexture3D(k,0),dt=P.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Fe.setTexture2DArray(k,0),dt=P.TEXTURE_2D_ARRAY):(Fe.setTexture2D(k,0),dt=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,k.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,k.unpackAlignment);const $e=P.getParameter(P.UNPACK_ROW_LENGTH),Yt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Ki=P.getParameter(P.UNPACK_SKIP_PIXELS),jt=P.getParameter(P.UNPACK_SKIP_ROWS),zs=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,at.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,at.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ce),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ie),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ae);const ut=y.isDataArrayTexture||y.isData3DTexture,nn=k.isDataArrayTexture||k.isData3DTexture;if(y.isDepthTexture){const sn=Me.get(y),Bt=Me.get(k),Wt=Me.get(sn.__renderTarget),Ra=Me.get(Bt.__renderTarget);xe.bindFramebuffer(P.READ_FRAMEBUFFER,Wt.__webglFramebuffer),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,Ra.__webglFramebuffer);for(let yi=0;yi<me;yi++)ut&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Me.get(y).__webglTexture,O,Ae+yi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Me.get(k).__webglTexture,ne,ft+yi)),P.blitFramebuffer(Ce,Ie,de,ve,ze,Qe,de,ve,P.DEPTH_BUFFER_BIT,P.NEAREST);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(O!==0||y.isRenderTargetTexture||Me.has(y)){const sn=Me.get(y),Bt=Me.get(k);xe.bindFramebuffer(P.READ_FRAMEBUFFER,od),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,ld);for(let Wt=0;Wt<me;Wt++)ut?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,sn.__webglTexture,O,Ae+Wt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,sn.__webglTexture,O),nn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Bt.__webglTexture,ne,ft+Wt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Bt.__webglTexture,ne),O!==0?P.blitFramebuffer(Ce,Ie,de,ve,ze,Qe,de,ve,P.COLOR_BUFFER_BIT,P.NEAREST):nn?P.copyTexSubImage3D(dt,ne,ze,Qe,ft+Wt,Ce,Ie,de,ve):P.copyTexSubImage2D(dt,ne,ze,Qe,Ce,Ie,de,ve);xe.bindFramebuffer(P.READ_FRAMEBUFFER,null),xe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else nn?y.isDataTexture||y.isData3DTexture?P.texSubImage3D(dt,ne,ze,Qe,ft,de,ve,me,nt,Re,at.data):k.isCompressedArrayTexture?P.compressedTexSubImage3D(dt,ne,ze,Qe,ft,de,ve,me,nt,at.data):P.texSubImage3D(dt,ne,ze,Qe,ft,de,ve,me,nt,Re,at):y.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,ne,ze,Qe,de,ve,nt,Re,at.data):y.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,ne,ze,Qe,at.width,at.height,nt,at.data):P.texSubImage2D(P.TEXTURE_2D,ne,ze,Qe,de,ve,nt,Re,at);P.pixelStorei(P.UNPACK_ROW_LENGTH,$e),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Yt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ki),P.pixelStorei(P.UNPACK_SKIP_ROWS,jt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,zs),ne===0&&k.generateMipmaps&&P.generateMipmap(dt),xe.unbindTexture()},this.initRenderTarget=function(y){Me.get(y).__webglFramebuffer===void 0&&Fe.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Fe.setTextureCube(y,0):y.isData3DTexture?Fe.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Fe.setTexture2DArray(y,0):Fe.setTexture2D(y,0),xe.unbindTexture()},this.resetState=function(){R=0,C=0,I=null,xe.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}function $0(i){return i==="performance"||i==="full"?i:"auto"}function go(i,e,t){const n=i==="performance"||i==="auto"&&e,s=Number.isFinite(t)&&t>0?t:1;return{lean:n,webglRatio:Math.min(s,n?1:1.7),effectsRatio:Math.min(s,n?1:2)}}class Y0{carry=0;elapsed=0;reset(){this.carry=this.elapsed=0}advance(e){this.carry+=e,this.elapsed+=e;const t=1/60;if(this.carry<t-.00125)return null;this.carry=this.carry>=t*2?this.carry%t:this.carry-t;const n=this.elapsed;return this.elapsed=0,n}}class j0{x=0;y=0;previousX=0;previousY=0;reset(e,t){this.x=this.previousX=e,this.y=this.previousY=t}beforeStep(e,t){this.previousX=e,this.previousY=t}sample(e,t,n){const s=Math.max(0,Math.min(1,n));return this.x=this.previousX+(e-this.previousX)*s,this.y=this.previousY+(t-this.previousY)*s,this}}function K0(i,e){i.count=e,i.instanceMatrix.clearUpdateRanges(),i.instanceColor?.clearUpdateRanges(),e&&(i.instanceMatrix.addUpdateRange(0,e*16),i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.addUpdateRange(0,e*3),i.instanceColor.needsUpdate=!0))}const vo=i=>`#${i.toString(16).padStart(6,"0")}`,At=(i,e)=>i+Math.random()*(e-i),dl=(i,e=!1)=>{const t=new Dl().load(i);return t.colorSpace=mt,t.magFilter=gt,t.minFilter=e?hi:gt,t},Z0=i=>{if(i!=="training"){const s=dl(`/raid-survivor/terrain/${i==="forest"?"forest-floor":i==="desert"?"desert-floor":i==="lava"?"lava-floor":"ice-floor"}.png`);return s.wrapS=s.wrapT=cr,s.repeat.set(15,15),s.colorSpace=mt,s.magFilter=gt,s}const e=document.createElement("canvas");e.width=e.height=512;const t=e.getContext("2d");t.fillStyle="#191923",t.fillRect(0,0,512,512);for(let s=0;s<8;s++)for(let r=0;r<8;r++){const a=r*64,o=s*64;t.fillStyle=(r+s)%2?"#20212b":"#242630",t.fillRect(a+2,o+2,60,60),t.strokeStyle="#383744",t.lineWidth=1,t.strokeRect(a+2.5,o+2.5,59,59),t.strokeStyle="rgba(255,211,143,.05)",t.beginPath(),t.moveTo(a+At(8,25),o+At(5,22)),t.lineTo(a+At(32,55),o+At(35,60)),t.stroke()}for(let s=0;s<480;s++)t.fillStyle=Math.random()<.3?"#8f7159":"#343642",t.fillRect(At(0,512),At(0,512),At(1,3),At(1,3));const n=new ir(e);return n.wrapS=n.wrapT=cr,n.repeat.set(15,15),n.colorSpace=mt,n.magFilter=gt,n},J0={rat:"rogue",cultist:"necromancer",brute:"warrior",wisp:"alchemist"},Zc=(i,e)=>{const t=new Dl().load(i);return t.repeat.set(.1,1),t.offset.set(e/10,0),t.magFilter=gt,t.minFilter=gt,t.colorSpace=mt,t},Q0=()=>{const i=document.createElement("canvas");i.width=i.height=96;const e=i.getContext("2d");e.shadowColor="#d8bcff",e.shadowBlur=8,e.strokeStyle="#f1e3ff",e.lineWidth=3,e.fillStyle="#201027",e.beginPath(),e.moveTo(48,5),e.bezierCurveTo(14,10,9,39,16,70),e.lineTo(8,91),e.lineTo(25,82),e.lineTo(37,91),e.lineTo(49,82),e.lineTo(61,91),e.lineTo(75,82),e.lineTo(88,91),e.lineTo(80,65),e.bezierCurveTo(87,35,72,9,48,5),e.closePath(),e.fill(),e.stroke(),e.shadowBlur=0,e.fillStyle="#07050c",e.beginPath(),e.ellipse(48,39,25,27,0,0,Math.PI*2),e.fill(),e.shadowColor="#f6e7ff",e.shadowBlur=10,e.fillStyle="#f8edff";for(const n of[37,59])e.beginPath(),e.ellipse(n,39,6,3,0,0,Math.PI*2),e.fill();e.strokeStyle="#b884db",e.lineWidth=2,e.beginPath(),e.moveTo(36,58),e.quadraticCurveTo(48,65,61,57),e.stroke();const t=new ir(i);return t.colorSpace=mt,t.magFilter=gt,t.minFilter=gt,t};class ev{host;game;scene=new ju;camera=new Dh(-20,20,12,-12,.1,100);renderer=new q0({antialias:!1,alpha:!1,powerPreference:"high-performance"});overlay=document.createElement("canvas");weaponVfx=new Dd("/raid-survivor/sprites/weapons/tankard.png");ctx=this.overlay.getContext("2d");minimap;player;nightman;enemyMeshes=new Map;heroTextures={};hamImage=new Image;heroAtlas=new Image;dummy=new Ft;viewWidth=40;viewHeight=24;width=1;height=1;cameraX=De/2;cameraY=De/2;decorations;shrineMeshes=[];resizeObserver;profile=go("full",!1,1);groups=new Map;enemyColor=new je;minimapElapsed=.1;setGraphics(e){this.profile=go(e,matchMedia("(pointer:coarse)").matches,devicePixelRatio),this.resize()}glow(e){return this.profile.lean?0:e}constructor(e,t,n,s="auto"){this.host=e,this.game=t,this.minimap=n,this.profile=go(s,matchMedia("(pointer:coarse)").matches,devicePixelRatio),this.scene.background=new je(t.level==="forest"?726803:t.level==="desert"?3417373:t.level==="ice"?1517105:t.level==="lava"?2166547:1052697),this.renderer.setPixelRatio(this.profile.webglRatio),this.renderer.outputColorSpace=mt,this.renderer.domElement.className="game-canvas",e.append(this.renderer.domElement),this.overlay.className="fx-canvas",e.append(this.overlay);const r=new Gt(new Jt(De,De),new gn({map:Z0(t.level),color:t.level==="desert"?13019778:t.level==="ice"?12110032:t.level==="lava"?10119265:16777215}));r.position.set(De/2,De/2,-2),this.scene.add(r);const a=new Jt(t.level==="forest"?2.7:1.5,t.level==="forest"?2.7:1.5),o=(()=>{const M=document.createElement("canvas");M.width=M.height=64;const E=M.getContext("2d");if(t.level==="forest"){E.fillStyle="#193322",E.beginPath(),E.arc(32,32,23,0,6.28),E.fill(),E.strokeStyle="#557f4d",E.lineWidth=4,E.beginPath(),E.arc(32,32,20,0,6.28),E.stroke(),E.fillStyle="#a0b56d";for(let C=0;C<6;C++){const I=C*Math.PI/3;E.fillRect(28+Math.cos(I)*19,28+Math.sin(I)*19,7,7)}}else E.strokeStyle="#897759",E.lineWidth=4,E.beginPath(),E.arc(32,32,23,0,6.28),E.moveTo(32,4),E.lineTo(32,60),E.moveTo(4,32),E.lineTo(60,32),E.stroke(),E.fillStyle="#ae9c6b",E.fillRect(28,28,8,8);const R=new ir(M);return R.colorSpace=mt,R})(),c=t.level==="desert"||t.level==="ice"||t.level==="lava"?0:280;this.decorations=new wi(a,new gn({map:o,transparent:!0,opacity:.23,depthWrite:!1}),c);for(let M=0;M<c;M++)this.dummy.position.set(At(3,De-3),At(3,De-3),-1.5),this.dummy.rotation.z=At(0,6.28),this.dummy.updateMatrix(),this.decorations.setMatrixAt(M,this.dummy.matrix);if(this.decorations.instanceMatrix.needsUpdate=!0,this.scene.add(this.decorations),t.obstacles.length){const M=t.level==="desert",E=t.obstacles.length,R=dl(`/raid-survivor/terrain/${M?"oasis-pool":"ice-wall"}.png`),C=new wi(new Jt(1,1),new gn({map:R,color:M?13019778:12110032,transparent:!0,alphaTest:.03,depthWrite:!1}),E);for(let I=0;I<E;I++){const b=t.obstacles[I],S=!M&&b.halfHeight>b.halfWidth,L=M?b.radius*2/.64:Math.max(b.halfWidth,b.halfHeight)*2/.83,u=M?L:Math.min(b.halfWidth,b.halfHeight)*2/.41;this.dummy.position.set(b.x,b.y,-1.3),this.dummy.rotation.z=S?Math.PI/2:0,this.dummy.scale.set(L,u,1),this.dummy.updateMatrix(),C.setMatrixAt(I,this.dummy.matrix)}C.instanceMatrix.needsUpdate=!0,this.scene.add(C)}const l=new Tc(new In().setFromPoints([new G(1,1,-1),new G(De-1,1,-1),new G(De-1,De-1,-1),new G(1,De-1,-1)]),new Ph({color:11701091}));this.scene.add(l);const h=document.createElement("canvas");h.width=h.height=96;const d=h.getContext("2d");if(t.level==="forest"){d.fillStyle="#173023",d.fillRect(14,14,68,68),d.fillStyle="#467442";for(let M=0;M<7;M++)d.beginPath(),d.ellipse(48+Math.cos(M*2.4)*20,48+Math.sin(M*2.4)*18,23,15,M,0,6.28),d.fill();d.fillStyle="#83a561",d.fillRect(41,41,14,14)}else d.fillStyle="#50505b",d.fillRect(14,14,68,68),d.fillStyle="#77717c",d.fillRect(17,17,59,15),d.fillStyle="#282832",d.fillRect(17,69,59,8),d.strokeStyle="#bca27e",d.lineWidth=3,d.strokeRect(14,14,68,68),d.beginPath(),d.moveTo(27,18),d.lineTo(43,46),d.lineTo(32,71),d.moveTo(63,17),d.lineTo(54,41),d.lineTo(70,64),d.stroke();const f=new ir(h);if(f.colorSpace=mt,t.level==="training"||t.level==="forest"){const M=new wi(new Jt(2.4,2.4),new gn({map:f,transparent:!0}),45);let E=0;for(let R=20;R<De-12;R+=30)for(let C=18;C<De-12;C+=30)Math.abs(C-90)<20&&Math.abs(R-90)<20||(this.dummy.position.set(C+At(-4,4),R+At(-4,4),-1),this.dummy.rotation.z=At(-.5,.5),this.dummy.scale.set(At(1,1.5),At(1,1.5),1),this.dummy.updateMatrix(),M.setMatrixAt(E++,this.dummy.matrix));M.count=E,M.instanceMatrix.needsUpdate=!0,this.scene.add(M)}const m=document.createElement("canvas");m.width=m.height=128;const v=m.getContext("2d");v.translate(64,64),v.strokeStyle="#78ffc0",v.lineWidth=4,v.shadowColor="#63ffba",v.shadowBlur=18,v.beginPath(),v.arc(0,0,47,0,6.28),v.stroke(),v.beginPath(),v.arc(0,0,32,0,6.28),v.stroke(),v.fillStyle="#c0ffe0",v.font="65px Georgia",v.textAlign="center",v.textBaseline="middle",v.fillText("✚",0,3);const x=new ir(m);x.colorSpace=mt;for(const M of t.shrines){const E=new Gt(new Jt(5.6,5.6),new gn({map:x,transparent:!0,opacity:.78,depthWrite:!1}));E.position.set(M.x,M.y,-.7),this.scene.add(E),this.shrineMeshes.push(E);for(let R=0;R<4;R++){const C=R*Math.PI/2+Math.PI/4,I=new Gt(new Jt(1.4,1.4),new gn({map:f,transparent:!0}));I.position.set(M.x+Math.cos(C)*4,M.y+Math.sin(C)*4,-.6),I.rotation.z=C,this.scene.add(I)}}const g=new Dl,p=t.level==="training"?["rat","cultist","brute","wisp"]:["cultist","brute","wisp"];for(const M of p)for(const[E,R]of[["left",2],["right",3]]){const C=new gn({map:Zc(`/raid-survivor/sprites/characters/${J0[M]}.png`,R),transparent:!0,depthWrite:!1,side:ln}),I=new wi(new Jt(1,1),C,on);I.instanceMatrix.setUsage(Ua),I.count=0,I.frustumCulled=!1,this.enemyMeshes.set(`${M}-${E}`,I),this.scene.add(I)}const A=t.level==="forest"?[["rageipede",315],["xorn",3421],["efreeti",8883]]:t.level==="desert"?[["deathwisp",1201],["buraq",83]]:t.level==="ice"?[["chuul",9189],["dogmole",8965]]:t.level==="lava"?[["tosculi",3015],["seahag",5413],["hezrou",3112]]:[];for(const[M,E]of A){const R=dl(`/raid-survivor/sprites/monsters/${M}-${E}.png`,t.level==="lava"),C=new gn({map:R,transparent:!0,depthWrite:!1,side:ln}),I=new wi(new Jt(1,1),C,on);I.instanceMatrix.setUsage(Ua),I.count=0,I.frustumCulled=!1,this.enemyMeshes.set(String(M),I),this.scene.add(I)}const w=g.load("/raid-survivor/characters/moloch.png");w.colorSpace=mt,w.magFilter=gt;for(const M of["left","right"]){const E=new gn({map:w,transparent:!0,depthWrite:!1,side:ln}),R=new wi(new Jt(1,1),E,16);R.instanceMatrix.setUsage(Ua),R.count=0,R.frustumCulled=!1,this.enemyMeshes.set(`boss-${M}`,R),this.scene.add(R)}for(const[M,E]of Object.entries({left:2,right:3,"attack-left":6,"attack-right":7}))this.heroTextures[M]=Zc(`/raid-survivor/sprites/characters/${t.hero}.png`,E);this.heroAtlas.src=`/raid-survivor/sprites/characters/${t.hero}.png`,this.player=new ro(new cl({map:this.heroTextures.right,transparent:!0,depthTest:!1})),this.player.scale.set(2.05,2.58,1),this.player.position.z=3,this.scene.add(this.player),this.nightman=new ro(new cl({map:Q0(),transparent:!0,depthTest:!1,depthWrite:!1})),this.nightman.scale.set(2.9,3.2,1),this.nightman.visible=!1,this.scene.add(this.nightman),this.hamImage.src="/raid-survivor/sprites/items.png",this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize()}resize(){this.width=this.host.clientWidth||1,this.height=this.host.clientHeight||1,this.renderer.setPixelRatio(this.profile.webglRatio),this.renderer.setSize(this.width,this.height),this.overlay.width=Math.max(1,Math.floor(this.width*this.profile.effectsRatio)),this.overlay.height=Math.max(1,Math.floor(this.height*this.profile.effectsRatio)),this.overlay.style.width=`${this.width}px`,this.overlay.style.height=`${this.height}px`,this.ctx.setTransform(this.profile.effectsRatio,0,0,this.profile.effectsRatio,0,0),this.viewHeight=this.width<700?31:25,this.viewWidth=this.viewHeight*this.width/this.height,this.camera.left=-this.viewWidth/2,this.camera.right=this.viewWidth/2,this.camera.top=this.viewHeight/2,this.camera.bottom=-this.viewHeight/2,this.camera.updateProjectionMatrix()}screen(e,t){return{x:(e-this.cameraX)/this.viewWidth*this.width+this.width/2,y:this.height/2-(t-this.cameraY)/this.viewHeight*this.height}}world(e,t){return{x:this.cameraX+(e-this.width/2)/this.width*this.viewWidth,y:this.cameraY-(t-this.height/2)/this.height*this.viewHeight}}render(e,t=!1,n){const s=this.game.player,r=n??s,a=1-Math.exp(-7*e);this.cameraX+=(r.x-this.cameraX)*a,this.cameraY+=(r.y-this.cameraY)*a,this.cameraX=Math.max(this.viewWidth/2,Math.min(De-this.viewWidth/2,this.cameraX)),this.cameraY=Math.max(this.viewHeight/2,Math.min(De-this.viewHeight/2,this.cameraY)),this.camera.position.set(this.cameraX,this.cameraY,50),this.camera.lookAt(this.cameraX,this.cameraY,0);const o=this.groups;for(const h of this.enemyMeshes.keys())o.set(h,0);for(const h of this.game.enemies){if(Math.abs(h.x-this.cameraX)>this.viewWidth/2+3||Math.abs(h.y-this.cameraY)>this.viewHeight/2+3)continue;const d=["rageipede","xorn","efreeti","deathwisp","buraq","chuul","dogmole","tosculi","seahag","hezrou"].includes(h.kind),f=d?h.kind:`${h.kind}-${h.facing<0?"left":"right"}`,m=this.enemyMeshes.get(f);if(!m)continue;const v=o.get(f)||0;if(v>=m.instanceMatrix.count)continue;this.dummy.position.set(h.x,h.y,h.y/1e3);const x=(h.kind==="boss"?5.1:h.kind==="efreeti"?3.4:h.kind==="hezrou"?3.3:h.kind==="xorn"?2.8:h.kind==="buraq"||h.kind==="dogmole"?3.1:h.kind==="seahag"||h.kind==="brute"?2.2:h.kind==="rageipede"||h.kind==="deathwisp"||h.kind==="chuul"||h.kind==="tosculi"?1.45:1.65)*(h.elite?1.35:1)*(h.kind==="buraq"?1+.14*Math.sin(this.game.elapsed*3+h.phase):1),g=h.kind==="tosculi"||h.kind==="seahag"?1374/1145:1;this.dummy.scale.set(((d||h.kind==="boss")&&h.facing<0?-x:x)*g,x,1),this.dummy.rotation.z=h.kind==="wisp"||h.kind==="efreeti"||h.kind==="buraq"?Math.sin(this.game.elapsed*4+h.phase)*.12:0,this.dummy.updateMatrix(),m.setMatrixAt(v,this.dummy.matrix),m.setColorAt(v,this.enemyColor.setHex(h.frozen>0?12053247:h.special==="stalker"&&h.specialState==="idle"&&h.specialCd<1?5663340:h.special==="devourer"&&h.specialState==="charge"?9551103:h.flash>0?16777215:h.special==="hexcaster"?16745180:h.special==="juggernaut"?16761709:h.kind==="boss"&&h.tier===3?16748152:h.kind==="boss"&&h.tier===2?16759440:h.elite?16766621:16777215)),o.set(f,v+1)}for(const[h,d]of this.enemyMeshes)K0(d,o.get(h)||0);for(let h=0;h<this.shrineMeshes.length;h++){const d=this.shrineMeshes[h].material;d.opacity=this.game.shrines[h].active?.78:.17,this.shrineMeshes[h].position.x=this.game.shrines[h].x,this.shrineMeshes[h].position.y=this.game.shrines[h].y,this.shrineMeshes[h].rotation.z+=e*.15}const c=this.game.dead&&this.game.deathReason==="combat";this.player.visible=!c||t,this.player.position.set(r.x,c?r.y:r.y+Math.sin(this.game.elapsed*6)*.08,4),this.player.material.map=this.heroTextures[`${(c?this.game.deathFiring:this.game.firing)?"attack-":""}${(c?this.game.deathFacing:this.game.facing)<0?"left":"right"}`],this.player.material.color.setHex(c?16777215:s.invuln>0&&Math.floor(this.game.elapsed*18)%2?16740748:16777215),this.player.material.opacity=c&&t?Math.max(0,1-this.game.deathProgress):1;const l=this.game.nightman;this.nightman.visible=!!l,l&&(this.nightman.position.set(l.x,l.y,5),this.nightman.material.opacity=l.warningRemaining>0?t?.6:.45+.2*Math.sin(this.game.elapsed*15):1),this.renderer.render(this.scene,this.camera),this.drawFx(t,r.x,r.y),this.minimapElapsed+=e,this.minimapElapsed>=.1&&(this.minimapElapsed%=.1,this.drawMinimap())}drawFx(e,t,n){const s=this.ctx;s.clearRect(0,0,this.width,this.height);const r=this.width/this.viewWidth;for(const c of this.game.projectiles){const l=this.screen(c.x,c.y);l.x<-40||l.x>this.width+40||l.y<-40||l.y>this.height+40||this.weaponVfx.drawProjectile(s,c,l.x,l.y,r,this.game.elapsed,e,this.profile.lean)}for(const c of this.game.enemyShots){const l=this.screen(c.x,c.y);l.x<-20||l.x>this.width+20||l.y<-20||l.y>this.height+20||(s.fillStyle=c.boss?"#ffb079":c.seaHag==="green"?"#99ebaa":c.seaHag==="amber"?"#ffbd78":c.poison?"#84e9a2":"#f2a1d8",s.shadowColor=s.fillStyle,s.shadowBlur=this.glow(17),s.beginPath(),s.arc(l.x,l.y,Math.max(3,c.radius*r),0,6.28),s.fill(),s.shadowBlur=0)}for(const c of this.game.pickups){const l=this.screen(c.x,c.y);if(l.x<-20||l.x>this.width+20||l.y<-20||l.y>this.height+20)continue;const h=c.kind==="xp"?"#8df3cb":c.kind==="heart"?"#94ffb3":"#ffd277",d=c.kind==="chest"?12:5;s.fillStyle=h,s.shadowColor=h,s.shadowBlur=this.glow(c.kind==="chest"?20:9),s.beginPath(),c.kind==="heart"&&this.hamImage.complete&&this.hamImage.naturalWidth?s.drawImage(this.hamImage,0,0,48,48,l.x-17,l.y-17,34,34):c.kind==="chest"?(s.fillRect(l.x-d,l.y-d,d*2,d*2),s.fillStyle="#4b2e42",s.fillRect(l.x-4,l.y-8,8,13)):(s.arc(l.x,l.y,d,0,6.28),s.fill()),s.shadowBlur=0}for(const c of this.game.shrines){if(!c.active)continue;const l=this.screen(c.x,c.y);l.x<0||l.x>this.width||l.y<0||l.y>this.height||(s.fillStyle="#baffd1",s.shadowColor="#63ffba",s.shadowBlur=this.glow(16),s.font="900 10px Cinzel,Georgia,serif",s.textAlign="center",s.fillText("✚ HEAL + XP",l.x,l.y-45),s.shadowBlur=0)}if(this.game.bombWave){const c=this.game.bombWave,l=this.screen(t,n);s.save(),s.strokeStyle={ranger:"#8ff8b0",wizard:"#a9c9ff",dwarf:"#ffca8d",warrior:"#ff987d","tavern-keeper":"#ffe194"}[this.game.hero],s.lineWidth=7,s.shadowColor=s.strokeStyle,s.shadowBlur=this.glow(28),s.globalAlpha=.9-c.age*.7,s.beginPath();const h=this.game.perk?.bombArcDegrees;if(h){const d=-Math.atan2(c.aimY,c.aimX),f=h*Math.PI/360;s.arc(l.x,l.y,c.radius*r,d-f,d+f)}else s.arc(l.x,l.y,c.radius*r,0,Math.PI*2);s.stroke(),s.restore()}const a=this.game.dead&&this.game.deathReason==="combat",o=this.screen(t,n);if(a||(s.strokeStyle="rgba(159,240,194,.55)",s.lineWidth=2,s.beginPath(),s.ellipse(o.x,o.y+19,20,6,0,0,6.28),s.stroke(),this.game.player.dashCooldown<=0&&(s.strokeStyle="rgba(171,255,207,.7)",s.beginPath(),s.arc(o.x,o.y,26,0,6.28),s.stroke())),!a&&this.game.weapons.orbit&&this.game.slots.includes("orbit")){const c=this.game.weapons.orbit,l=2+c;for(let h=0;h<l;h++){const d=this.game.elapsed*(2.7+c*.15)+h*6.28/l,f=this.screen(t+Math.cos(d)*(2.2+c*.2),n+Math.sin(d)*(2.2+c*.2));s.save(),s.translate(f.x,f.y),s.rotate(d),s.fillStyle="#ffe5a4",s.shadowColor="#ffd071",s.shadowBlur=this.glow(17),s.beginPath(),s.moveTo(0,-12),s.lineTo(5,0),s.lineTo(0,12),s.closePath(),s.fill(),s.restore()}}a&&this.player.visible===!1&&this.drawDeath(s,o.x,o.y,r);for(const c of this.game.effects){const l=this.screen(c.x,c.y),h=1-c.life/c.max,d=c.kind==="zap"&&c.x2!==void 0&&c.y2!==void 0?this.screen(c.x2,c.y2):l,f=Math.max(60,c.size*r*1.4+24);if(!(Math.max(l.x,d.x)+f<0||Math.min(l.x,d.x)-f>this.width||Math.max(l.y,d.y)+f<0||Math.min(l.y,d.y)-f>this.height)&&!this.weaponVfx.drawEffect(s,c,l.x,l.y,r,e))if(s.globalAlpha=Math.max(0,c.life/c.max),s.strokeStyle=vo(c.color),s.fillStyle=vo(c.color),s.shadowColor=vo(c.color),s.shadowBlur=this.glow(20),s.lineWidth=3,c.kind==="zap"&&c.x2!==void 0&&c.y2!==void 0){const m=this.screen(c.x2,c.y2);s.beginPath(),s.moveTo(l.x,l.y);const v=(l.x+m.x)/2,x=(l.y+m.y)/2;s.lineTo(v+At(-8,8),x+At(-8,8)),s.lineTo(m.x,m.y),s.stroke()}else c.kind==="ring"||c.kind==="comet"?(s.beginPath(),s.arc(l.x,l.y,Math.max(1,c.size*r*(c.kind==="comet"?1-h*.25:h)),0,6.28),s.stroke(),c.kind==="comet"&&(s.fillStyle="rgba(255,145,101,.11)",s.fill())):c.kind==="text"?(s.font="900 22px Cinzel, Georgia, serif",s.textAlign="center",s.fillText(c.text||"",l.x,l.y-h*45)):(s.beginPath(),s.arc(l.x,l.y,c.size*r*(.3+h),0,6.28),s.fill())}s.globalAlpha=1,s.shadowBlur=0,this.drawWarnings(s,r);for(const c of this.game.enemies){if(!c.elite&&c.kind!=="boss"&&c.kind!=="seahag"&&c.kind!=="hezrou"||c.hp<=0)continue;const l=this.screen(c.x,c.y);if(l.x<0||l.x>this.width||l.y<0||l.y>this.height)continue;const h=c.kind==="boss"?125:c.special?75:36;if(s.fillStyle="#2c1c29",s.fillRect(l.x-h/2,l.y-45,h,7),s.fillStyle=c.kind==="boss"?"#f4bd76":c.special==="hexcaster"?"#ff75d5":"#ffbd68",s.fillRect(l.x-h/2,l.y-45,h*c.hp/c.maxHp,7),c.kind==="boss"||c.special){s.font=`900 ${c.kind==="boss"?12:10}px Cinzel,Georgia,serif`,s.textAlign="center",s.fillStyle=c.special==="hexcaster"?"#ffc0ed":"#ffe2b4";const d=c.kind==="seahag"?"SEA HAG":["rageipede","xorn","efreeti","deathwisp","buraq","chuul","dogmole","hezrou"].includes(c.kind)?c.kind.toUpperCase():c.special==="hexcaster"?"HEXCASTER":c.special==="juggernaut"?"JUGGERNAUT":c.tier===3?"MOLOCH UNBOUND":c.tier===2?"ASCENDED MOLOCH":"MOLOCH";s.fillText(d,l.x,l.y-51)}}this.drawNightmanArrow(s)}drawNightmanArrow(e){const t=this.game.nightman;if(!t)return;const n=this.screen(t.x,t.y),s=42;if(n.x>=s&&n.x<=this.width-s&&n.y>=s&&n.y<=this.height-s)return;const r=n.x-this.width/2,a=n.y-this.height/2,o=Math.min((this.width/2-s)/Math.max(1,Math.abs(r)),(this.height/2-s)/Math.max(1,Math.abs(a))),c=this.width/2+r*o,l=this.height/2+a*o,h=Math.atan2(a,r);e.save(),e.translate(c,l),e.rotate(h),e.fillStyle="#f2d6ff",e.strokeStyle="#2b073a",e.lineWidth=3,e.beginPath(),e.moveTo(17,0),e.lineTo(-8,-10),e.lineTo(-8,10),e.closePath(),e.fill(),e.stroke(),e.restore(),e.save(),e.fillStyle="#f2d6ff",e.strokeStyle="#16071d",e.lineWidth=3,e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center";const d=Math.max(45,Math.min(this.width-45,c-Math.cos(h)*38)),f=Math.max(14,Math.min(this.height-10,l-Math.sin(h)*38));e.strokeText("NIGHTMAN",d,f),e.fillText("NIGHTMAN",d,f),e.restore()}drawWarnings(e,t){for(const n of this.game.hazards){const s=this.screen(n.x,n.y),r=n.radius*t;if(n.kind==="lane"){const o=this.screen(n.x2??n.x,n.y2??n.y);if(Math.max(s.x,o.x)<-r||Math.min(s.x,o.x)>this.width+r||Math.max(s.y,o.y)<-r||Math.min(s.y,o.y)>this.height+r)continue;e.save(),e.lineCap="round",e.strokeStyle="rgba(255,118,75,.28)",e.lineWidth=r*2,e.beginPath(),e.moveTo(s.x,s.y),e.lineTo(o.x,o.y),e.stroke(),e.strokeStyle="#ffba84",e.lineWidth=3,e.beginPath(),e.moveTo(s.x,s.y),e.lineTo(o.x,o.y),e.stroke(),e.fillStyle="#fff1cc",e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center",e.fillText("FIERY LANE",o.x,o.y-14),e.strokeStyle="#fff1cc",e.lineWidth=4,e.beginPath(),e.arc(s.x,s.y,r+8,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,n.delay/n.duration)),e.stroke(),e.restore();continue}if(s.x+r<0||s.x-r>this.width||s.y+r<0||s.y-r>this.height)continue;const a=n.kind==="hex"?"#ff78d2":n.kind==="ground"?"#a2def3":"#ffad70";e.save(),e.fillStyle=n.kind==="hex"?"rgba(231,75,187,.26)":n.kind==="ground"?"rgba(123,208,233,.28)":"rgba(255,129,72,.29)",e.strokeStyle=a,e.lineWidth=2,e.shadowColor=a,e.shadowBlur=this.glow(12),e.beginPath(),e.arc(s.x,s.y,r,0,Math.PI*2),e.fill(),e.stroke(),e.shadowBlur=0,e.lineWidth=5,e.beginPath(),e.arc(s.x,s.y,r+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,n.delay/n.duration)),e.stroke(),e.restore()}for(const n of this.game.enemies){if(n.kind!=="efreeti"||n.specialState!=="windup"&&n.specialState!=="charge")continue;const s=this.screen(n.x,n.y);s.x<-70||s.x>this.width+70||s.y<-70||s.y>this.height+70||(e.save(),e.strokeStyle=n.specialState==="charge"?"#9ad6ff":"#ffe2a4",e.fillStyle="rgba(123,182,222,.16)",e.lineWidth=3,e.beginPath(),e.arc(s.x,s.y,Math.max(17,n.radius*t*1.5),0,6.28),e.fill(),e.stroke(),e.fillStyle="#eff7ff",e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center",e.fillText(n.specialState==="charge"?"INGESTING MAGIC":"WARD CHARGING",s.x,s.y-58),e.restore())}for(const n of this.game.enemies){if(n.special!=="seahagfan"||n.specialState!=="windup")continue;const s=this.screen(n.x,n.y);if(s.x<-7*t||s.x>this.width+7*t||s.y<-7*t||s.y>this.height+7*t)continue;const r=this.screen(n.targetX,n.targetY),a=Math.atan2(r.y-s.y,r.x-s.x),o=n.attackPhase%2===0;e.save(),e.fillStyle=o?"rgba(128,238,163,.18)":"rgba(255,182,97,.2)",e.strokeStyle=o?"#9cf2b2":"#ffca8c",e.lineWidth=2,e.beginPath(),e.moveTo(s.x,s.y),e.arc(s.x,s.y,7*t,a-.48,a+.48),e.closePath(),e.fill(),e.stroke(),e.fillStyle="#fff1d2",e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center",e.fillText("BREATH FAN",s.x,s.y-30),e.restore()}for(const n of this.game.enemies){if(n.specialState!=="windup"||n.special!=="jaunt"&&n.special!=="poisonfan")continue;const s=this.screen(n.x,n.y);let r=n.targetX,a=n.targetY;if(n.special==="jaunt"){const c=r-n.x,l=a-n.y,h=Math.hypot(c,l)||1,d=Math.min(3,Math.max(0,h-1.5));r=n.x+c/h*d,a=n.y+l/h*d;const f=ga();ci(this.game.level,n.x,n.y,r-n.x,a-n.y,n.radius,!1,f),f.hit&&(r=n.x+(r-n.x)*Math.max(0,f.t-1e-4),a=n.y+(a-n.y)*Math.max(0,f.t-1e-4))}const o=this.screen(r,a);s.x<-100||s.x>this.width+100||s.y<-100||s.y>this.height+100||(e.save(),e.strokeStyle=n.special==="jaunt"?"#b7edff":"#91f4b6",e.fillStyle=n.special==="jaunt"?"rgba(128,204,245,.2)":"rgba(92,216,130,.23)",e.lineWidth=3,e.shadowColor=e.strokeStyle,e.shadowBlur=this.glow(10),e.beginPath(),e.moveTo(s.x,s.y),e.lineTo(o.x,o.y),e.stroke(),e.beginPath(),e.arc(o.x,o.y,(n.special==="jaunt"?1.4:2)*t,0,6.28),e.fill(),e.stroke(),e.restore())}for(const n of this.game.enemies){if(!["juggernaut","pouncer","stalker"].includes(n.special||"")||n.specialState!=="windup")continue;const s=vd(n,this.game.level),r=this.screen(s.x1,s.y1),a=this.screen(s.x2,s.y2),o=Math.atan2(a.y-r.y,a.x-r.x),c=s.radius*t;e.save(),e.fillStyle=n.special==="stalker"?"rgba(137,166,194,.29)":n.special==="pouncer"?"rgba(150,217,115,.28)":"rgba(255,165,72,.29)",e.strokeStyle=n.special==="stalker"?"#b9d5ef":n.special==="pouncer"?"#c5f595":"#ffbf69",e.lineWidth=2,e.shadowColor=e.strokeStyle,e.shadowBlur=this.glow(9),e.beginPath(),e.moveTo(r.x-Math.sin(o)*c,r.y+Math.cos(o)*c),e.lineTo(a.x-Math.sin(o)*c,a.y+Math.cos(o)*c),e.arc(a.x,a.y,c,o+Math.PI/2,o-Math.PI/2,!0),e.lineTo(r.x+Math.sin(o)*c,r.y-Math.cos(o)*c),e.arc(r.x,r.y,c,o-Math.PI/2,o+Math.PI/2,!0),e.closePath(),e.fill(),e.stroke(),e.shadowBlur=0,e.strokeStyle="#fff0bf",e.lineWidth=5,e.beginPath(),e.arc(r.x,r.y,c+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,n.specialTimer/(n.special==="pouncer"?.5:n.special==="stalker"?.75:.9))),e.stroke(),e.restore()}}drawDeath(e,t,n,s){const r=this.heroAtlas,a=Math.max(0,Math.min(1,this.game.deathProgress));if(a>=1||!r.complete||!r.naturalWidth)return;const o=this.game.deathFiring?this.game.deathFacing<0?6:7:this.game.deathFacing<0?2:3,c=2.05*s,l=2.58*s,h=t-c/2,d=n-l/2,f=18,m=68/f;e.save(),e.imageSmoothingEnabled=!1;for(let x=0;x<f;x++){const g=x/f,p=Math.min(1,Math.max(0,(a-g*.33)/.67)),A=x*m,w=d+g*l+p*p*l*(.28+.32*g),M=Math.max(0,1-Math.max(0,(a-.42-g*.16)*1.8))*Math.min(1,(1-a)/.22);if(M<=0)continue;e.globalAlpha=M;const E=Math.sin(x*13.7)*a*c*.13;e.drawImage(r,o*54,A,54,m,h+E,w,c,l/f+1)}const v=28;for(let x=0;x<v;x++){const g=x%11/17;if(a<g||a>.94)continue;const p=(a-g)/(.94-g),A=x*17%50,w=x*29%62,M=h+A/54*c+Math.sin(x*47.1)*.5*p*c,E=d+w/68*l+p*p*l*.72;e.globalAlpha=Math.max(0,1-p*.95),e.drawImage(r,o*54+A,w,4,4,M,E,Math.max(2,c*4/54),Math.max(2,l*4/68))}e.globalAlpha=Math.max(0,Math.sin(a*Math.PI))*.7,e.fillStyle={ranger:"#5bba81",wizard:"#806fd1",dwarf:"#c18a55",warrior:"#c85c50","tavern-keeper":"#c9a15b"}[this.game.hero],e.beginPath(),e.ellipse(t,n+l*.48,c*(.15+a*.43),l*.06,0,0,Math.PI*2),e.fill(),e.restore()}drawMinimap(){const e=this.minimap.getContext("2d"),t=this.minimap.width,n=this.minimap.height;e.fillStyle="#171722",e.fillRect(0,0,t,n),e.strokeStyle="#8a7360",e.strokeRect(1,1,t-2,n-2),e.fillStyle=this.game.level==="desert"?"#347b78":"#658d9f";for(const r of this.game.obstacles){const a=r.x/De*t,o=(1-r.y/De)*n;r.shape==="circle"?(e.beginPath(),e.arc(a,o,Math.max(2,r.radius/De*t),0,6.28),e.fill()):e.fillRect(a-r.halfWidth/De*t,o-r.halfHeight/De*n,r.halfWidth*2/De*t,r.halfHeight*2/De*n)}e.fillStyle="#80ffc0";for(const r of this.game.shrines)if(r.active){const a=r.x/De*t,o=(1-r.y/De)*n;e.fillRect(a-1,o-4,3,9),e.fillRect(a-4,o-1,9,3)}e.fillStyle="#e47786";for(const r of this.game.enemies)(r.kind==="boss"||r.elite)&&(e.beginPath(),e.arc(r.x/De*t,(1-r.y/De)*n,r.kind==="boss"?3:1.5,0,6.28),e.fill());const s=this.game.player;e.fillStyle="#aff3c6",e.beginPath(),e.arc(s.x/De*t,(1-s.y/De)*n,3,0,6.28),e.fill(),e.strokeStyle="#aaffd0",e.strokeRect((this.cameraX-this.viewWidth/2)/De*t,(1-(this.cameraY+this.viewHeight/2)/De)*n,this.viewWidth/De*t,this.viewHeight/De*n)}dispose(){this.weaponVfx.dispose(),this.resizeObserver.disconnect(),this.scene.traverse(e=>{if(e instanceof Gt||e instanceof wi||e instanceof Tc||e instanceof ro){e.geometry?.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)"map"in n&&n.map instanceof Lt&&n.map.dispose(),n.dispose()}});for(const e of Object.values(this.heroTextures))e.dispose();this.renderer.dispose(),this.renderer.forceContextLoss(),this.host.replaceChildren()}}const _o=6,tv=40;class nv{id=-1;direction={x:0,y:0};origin={x:0,y:0};begin(e,t,n){return this.id>=0?!1:(this.id=e,this.origin={x:t,y:n},this.direction.x=this.direction.y=0,!0)}move(e,t,n){if(e!==this.id||this.id<0)return!1;const s=t-this.origin.x,r=this.origin.y-n,a=Math.hypot(s,r);if(a<=_o)this.direction.x=this.direction.y=0;else{const o=Math.min(1,(a-_o)/(tv-_o))/a;this.direction.x=s*o,this.direction.y=r*o}return!0}end(e){return this.id!==e||this.id<0?!1:(this.reset(),!0)}reset(){this.id=-1,this.direction.x=this.direction.y=0}}const iv=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;function sv(i,e,t){const n=i,s=n?.config,r=s?.skills,a=s?.target,o=di[t],c=a===null||!!(a&&o.some(d=>d.checkpointId===a.checkpointId&&d.thresholdMs===a.thresholdMs)),l=s?.equippedPerk,h=l===null||typeof l=="string"&&va[e].some(d=>d.id===l);if(typeof n?.runId!="string"||!iv.test(n.runId)||n.version!==Hi||s?.version!==Hi||s.character!==e||s.level!==t||!r||![r.vitality,r.agility,r.bombRecharge].every(d=>d===0||d===1||d===2)||!c||a===void 0||!h||l===void 0)throw new Error("Ranked run configuration mismatch.");return{runId:n.runId,config:{version:Hi,character:e,level:t,skills:{vitality:r.vitality,agility:r.agility,bombRecharge:r.bombRecharge},equippedPerk:l,target:a}}}function rv(){return`<button data-board="all" class="active">GLOBAL</button>${Object.values(un).map(i=>`<button data-board="${i.id}">${i.name.toUpperCase()}</button>`).join("")}<button data-board="archive-v2">EARLIER RUNS</button><button data-board="legacy">ORIGINAL</button>`}function av(i,e,t,n,s,r=[]){if(n<100||s<180)return[];const a=t(e.x,e.y),o=42,c=n-42,l=95,h=s-145,d=c-o,f=h-l,m=2*(d+f),v=p=>{let A=(p%m+m)%m;return A<=d?{x:o+A,y:l}:(A-=d,A<=f?{x:c,y:l+A}:(A-=f,A<=d?{x:c-A,y:h}:(A-=d,{x:o,y:h-A})))},x=i.filter(p=>p.kind==="chest"&&p.life>0).sort((p,A)=>(p.x-e.x)**2+(p.y-e.y)**2-((A.x-e.x)**2+(A.y-e.y)**2)),g=[];for(const p of x){if(g.length===2)break;const A=t(p.x,p.y);if(A.x>=0&&A.x<=n&&A.y>=0&&A.y<=s)continue;const w=A.x-a.x,M=A.y-a.y;if(!w&&!M)continue;const E=Math.min(w<0?(o-a.x)/w:w>0?(c-a.x)/w:1/0,M<0?(l-a.y)/M:M>0?(h-a.y)/M:1/0),R=Math.max(o,Math.min(c,a.x+w*E)),C=Math.max(l,Math.min(h,a.y+M*E)),I=Math.abs(C-l)<1?R-o:Math.abs(R-c)<1?d+C-l:Math.abs(C-h)<1?d+f+c-R:2*d+f+h-C;let b=null;for(let S=0;S<=Math.ceil(m/50)&&!b;S++)for(const L of S===0?[0]:[-1,1]){const{x:u,y:N}=v(I+S*25*L);if(!r.some(z=>u>=z.x-22&&u<=z.x+z.width+22&&N>=z.y-22&&N<=z.y+z.height+22)&&!g.some(z=>Math.hypot(z.x-u,z.y-N)<44)){b={x:u,y:N};break}}b&&g.push({...b,angle:Math.atan2(M,w),life:p.life})}return g}class ov{constructor(e,t,n=()=>{},s=r=>new Promise(a=>setTimeout(a,r))){this.post=e,this.onAck=t,this.onStatus=n,this.pause=s}post;onAck;onStatus;pause;pending=null;flight=null;stopped=!1;acknowledgedMs=0;status="idle";setStatus(e){this.status=e,this.onStatus(e)}stop(){this.stopped=!0,this.pending=null}offer(e){return this.stopped?Promise.resolve():((!this.pending||e.durationMs>=this.pending.durationMs)&&(this.pending=e),this.flight||(this.flight=this.drain().finally(()=>{this.flight=null})),this.flight)}async settle(){await this.flight}async drain(){for(;this.pending&&!this.stopped;){const e=this.pending;this.pending=null,this.setStatus("saving");let t=!1,n=!1;for(let s=0;s<3&&!this.stopped;s++){try{const r=await this.post(e);if(r.ok){const a=await r.json();this.stopped||(this.acknowledgedMs=Math.max(this.acknowledgedMs,e.durationMs),this.onAck(a),this.setStatus("saved")),t=!0;break}if(r.status!==429&&r.status!==503){n=!0;break}}catch{}this.setStatus("retrying"),s<2&&await this.pause(300*(s+1))}if(!t){const s=this.pending;!n&&(!s||s.durationMs<e.durationMs)&&(this.pending=e),this.setStatus("retrying");break}}}}function qi(i,e,t){return t&&i===e}function lv(i){return{profile:i,profileAccountId:null,profileReady:!1}}function cv(i,e){if(!i||e.revision>i.revision)return e;if(e.revision<i.revision)return i;for(const[t,n]of Object.entries(e.monsters))for(const s of Object.keys(n))n[s]=Math.max(n[s],i.monsters[t]?.[s]??0);return e}function hv(i,e,t,n,s,r){return qi(i,e,t)?{profile:cv(n===i?s:null,r),profileAccountId:i,profileReady:!0}:null}function dv(i,e,t,n,s){return i||e>=t+15||s&&e>=n}const Sa="/leaderboard-api/raid-survivor",Gi=Hi,ba=window.self!==window.top,uv=new URL(location.href).searchParams.get("ranked")==="launch-failed",ot={getItem(i){try{return localStorage.getItem(i)}catch{return null}},setItem(i,e){try{localStorage.setItem(i,e)}catch{}},removeItem(i){try{localStorage.removeItem(i)}catch{}}};async function Ea(i,e={},t=4e3){const n=new AbortController,s=setTimeout(()=>n.abort(),t);try{return await fetch(i,{...e,signal:n.signal,credentials:"same-origin"})}finally{clearTimeout(s)}}async function da(i,e){return Ea(Sa+i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}const Bh=document.querySelector("#app"),Us=Object.keys(An),zh=i=>`/raid-survivor/characters/${i}-preview.png`,pt=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),ua=i=>`${Math.floor(i/60).toString().padStart(2,"0")}:${Math.floor(i%60).toString().padStart(2,"0")}`;let U=null,it=null,Ve=Us.includes(ot.getItem("raid-selected-hero"))?ot.getItem("raid-selected-hero"):"ranger",Ct=Object.keys(un).includes(ot.getItem("raid-selected-realm"))?ot.getItem("raid-selected-realm"):"training",Hh=0,ul=0,er=0,sr=0,fl=!1,ii=null,gi=null,Ke=!1,Ni="Guest",Pt=null,ys=null,Ii=null,pl=!1,vt="none",Vn=ot.getItem("raid-sound")!=="off",Bi=ot.getItem("raid-motion")==="reduced",ki=ot.getItem("raid-manual-aim")==="on",ni=$0(ot.getItem("raid-graphics"));const Vh=new Y0,ai=new j0;let Gh=[],Ta=(()=>{for(const i of["raid-profile-v3","raid-profile-v2"])try{const e=ot.getItem(i);if(e)return Ln(JSON.parse(e))}catch{}return _a()})();ot.getItem("raid-profile-v3")||ot.setItem("raid-profile-v3",JSON.stringify(Ta));let Te=Ta,Ns=null,ji=!1,oi=0,ml=null,rr=null,gl=0,vl=0,dn=null,qn=null,_l=!1;const fv=Object.keys(un),pv={training:"⚔",forest:"✦",desert:"☀",ice:"❄",lava:"♜"},Wh=i=>({durationMs:Math.round(i.elapsed*1e3),kills:i.stats.kills,monsters:structuredClone(i.monsters)}),mv=i=>qn??{version:Gi,character:i.hero,level:i.level,skills:{...i.mastery},equippedPerk:null,target:null};function Xh(){Ke||(Ta=Te,ot.setItem("raid-profile-v3",JSON.stringify(Te)))}function Jr(){const i=lv(Ta);Te=i.profile,Ns=i.profileAccountId,ji=i.profileReady,Te.unlockedHeroes.includes(Ve)||(Ve="ranger"),Te.unlocked.includes(Ct)||(Ct="training")}function gr(i,e,t=!0){const n=hv(i,Pt,Ke,Ns,Te,Ln(e));return n?(Te=n.profile,Ns=n.profileAccountId,ji=n.profileReady,t&&!U&&!ws?xi():Mr(),or(),!0):!1}const Nl=i=>`raid-finish-outbox-v2:${i}`;function fa(i){try{const e=JSON.parse(ot.getItem(Nl(i))||"[]");return Array.isArray(e)?e.filter(t=>typeof t?.runId=="string"&&t.body).slice(-20):[]}catch{return[]}}function gv(i,e){const t=fa(i).filter(n=>n.runId!==e.runId);t.push(e),ot.setItem(Nl(i),JSON.stringify(t.slice(-20)))}let Js=null;const qh=new Map;function xl(){if(!Ke||!Pt)return Promise.resolve();const i=Pt;if(Js?.id===i)return Js.promise;const e=(async()=>{for(const t of fa(i)){if(!qi(i,Pt,Ke))break;let n=!1,s=!1;for(let r=0;r<3;r++){try{const a=await da(`/runs/${t.runId}/finish`,t.body);if(a.ok){const o=await a.json();s=!0,gr(i,o.profile);break}if([400,404,409,410].includes(a.status)){n=!0;break}if(a.status===401)break}catch{}r<2&&await new Promise(a=>setTimeout(a,350*(r+1)))}if(s||n)qh.set(t.runId,s?"saved":"rejected"),ot.setItem(Nl(i),JSON.stringify(fa(i).filter(r=>r.runId!==t.runId)));else break}})().finally(()=>{Js?.promise===e&&(Js=null)});return Js={id:i,promise:e},e}async function vv(i,e){try{const t=await Ea(Sa+"/profile");if(!t.ok)throw Error("Profile unavailable");const n=await t.json();if(e!==oi)return;gr(i,n.profile),xn="Portal ranked play ready."}catch{if(e!==oi||!qi(i,Pt,Ke))return;ji=!1,Ns!==i&&(Te=_a(),Ns=i),xn="Portal profile temporarily unavailable. Known progress remains visible; ranked runs may still start."}if(e===oi){const t=ot.getItem("raid-selected-hero"),n=ot.getItem("raid-selected-realm");Te.unlockedHeroes.includes(t)?Ve=t:Te.unlockedHeroes.includes(Ve)||(Ve="ranger"),Te.unlocked.includes(n)?Ct=n:Te.unlocked.includes(Ct)||(Ct="training"),!U&&!ws&&xi()}}function kl(i=!1){const e=U,t=gi,n=Ot,s=ys;if(!e||!e.rankable||e.dead&&!i)return;const r=qn?.target?.thresholdMs??1/0,a=Math.round(e.elapsed*1e3)>=r&&(dn?.acknowledgedMs??rr?.durationMs??0)<r;if(a&&!_l&&(_l=!0,Mr()),!dv(i,e.elapsed,gl,vl,a)||t&&(n!==Ot||!s||!qi(s,Pt,Ke)))return;gl=e.elapsed,a&&(vl=e.elapsed+2);const o=Wh(e);if(!t){try{const l=Cd(Ke?ml:Te,mv(e),o,rr||{});Ke?ml=l.profile:(Te=l.profile,Xh()),rr=l.progress}catch{}return}dn?.offer(o)}function Ml(){const i=gi?{idle:"PORTAL READY",saving:"SAVING…",saved:"PORTAL SAVED",retrying:"SAVE RETRYING"}[dn?.status||"idle"]:Ke?"PRACTICE · NO UNLOCKS SAVED":"SAVED ON DEVICE",e=document.querySelector("#saveStatus"),t=document.querySelector("#clearSaveStatus");e&&(e.textContent=i),t&&(t.textContent=i)}let Oi=ba?"guest":"pending",$h,ws=!1,Yh="Guest",xn="Local scores saved on this device.",pa=[];const Qt=new Set,vn={down:!1,x:0,y:0},en={aim:{id:-1,x:0,y:0,dx:0,dy:0}},tn=new nv,_v=matchMedia("(max-width:760px),(hover:none) and (pointer:coarse)");let xt=null;function jh(){if(Vn)try{xt||=new AudioContext,xt.state==="suspended"&&xt.resume().catch(()=>{})}catch{}}function xv(){Yn(),$i(),vt="none",document.querySelector("#overlay-root").innerHTML="",document.querySelector(".game-shell")?.classList.add("is-dead"),document.querySelectorAll(".hud button").forEach(i=>i.disabled=!0),Mr(),yv()}let Mv=0,Ot=0;const ma=new Set;function wa(){for(const i of ma){try{i.source.stop()}catch{}i.source.disconnect(),i.gain.disconnect()}ma.clear()}function yv(){if(Vn)try{xt||=new AudioContext,xt.state==="suspended"&&xt.resume().catch(()=>{});const i=xt,e=i.currentTime,t=(l,h,d)=>{const f=i.createGain();f.gain.setValueAtTime(1e-4,e),f.gain.exponentialRampToValueAtTime(h,e+.025),f.gain.exponentialRampToValueAtTime(1e-4,e+d),l.connect(f).connect(i.destination);const m={source:l,gain:f};ma.add(m),l.onended=()=>{ma.delete(m),l.disconnect(),f.disconnect()},l.start(e),l.stop(e+d+.01)},n=i.createOscillator();n.type="triangle",n.frequency.setValueAtTime(155,e),n.frequency.exponentialRampToValueAtTime(62,e+.24),t(n,.085,.28);const s=i.createOscillator();s.type="sawtooth",s.frequency.setValueAtTime(430,e),s.frequency.exponentialRampToValueAtTime(70,e+.72),t(s,.022,.76);const r=i.createBuffer(1,Math.ceil(i.sampleRate*.85),i.sampleRate),a=r.getChannelData(0);let o=1979;for(let l=0;l<a.length;l++)o=o*1664525+1013904223>>>0,a[l]=(o/4294967296*2-1)*(1-l/a.length);const c=i.createBufferSource();c.buffer=r,t(c,.028,.82),Mv++}catch{}}let tr=0,ar=[],zi=null;function $i(){tr++;for(const i of ar)clearTimeout(i);ar=[],zi&&clearInterval(zi),zi=null}function Ss(i){if(Vn)try{xt||=new AudioContext,xt.state==="suspended"&&xt.resume().catch(()=>{});const e=xt.createOscillator(),t=xt.createGain(),n=xt.currentTime,s={kill:[280,90,.06,"triangle"],hurt:[160,48,.2,"sawtooth"],shoot:[480,230,.045,"square"],level:[520,900,.3,"sine"],chest:[380,1140,.5,"triangle"],boss:[190,56,.55,"sawtooth"],dash:[420,160,.12,"triangle"]}[i];e.type=s[3],e.frequency.setValueAtTime(s[0],n),e.frequency.exponentialRampToValueAtTime(s[1],n+s[2]),t.gain.setValueAtTime(i==="shoot"?.025:.07,n),t.gain.exponentialRampToValueAtTime(.001,n+s[2]),e.connect(t).connect(xt.destination),e.start(),e.stop(n+s[2])}catch{}}async function Sv(){const i=++oi;if(ba){Ke=!1,Ni="Guest",Pt=null,Jr(),Oi="guest",xn="Embedded guest play",or();return}try{const e=await Ea(Sa+"/session");if(i!==oi)return;if(e.ok){const t=await e.json();if(i!==oi)return;const n=typeof t.accountId=="string"?t.accountId:null;if(!n)throw Error("Missing account");Ke=!0,Ni=t.displayName||"Portal player",Pt=n,Ii=typeof t.version=="string"?t.version:null,Oi="linked",Ns!==n&&(Te=_a(),ji=!1),xn=Ii===Gi?"Portal identity linked; loading progression…":"Portal game version changed. Reload before ranked play.",or(),Ii===Gi&&await vv(n,i),i===oi&&xl()}else e.status===401?(Ke=!1,Ni="Guest",Pt=null,Ii=null,Jr(),Oi="guest",xn="Launch from Portal for ranked play."):(Ke=!1,Ni="Guest",Pt=null,Ii=null,Jr(),Oi="unavailable",xn="Ranked service unavailable; local play is ready.")}catch{if(i!==oi)return;Ke=!1,Ni="Guest",Pt=null,Ii=null,Jr(),Oi="unavailable",xn="Ranked service unavailable; local play is ready."}or()}function or(){const i=document.querySelector("#identity");i&&(i.textContent=Ke?`✦ ${Ni} · ${ji?"PORTAL PROGRESSION READY":"PORTAL LINKED · PROFILE UNAVAILABLE"}`:Oi==="pending"?"◇ CHECKING PORTAL SESSION…":Oi==="unavailable"?"◇ RANKED SERVICE UNAVAILABLE · LOCAL PLAY READY":uv?"◇ PORTAL LAUNCH FAILED · GUEST PLAY READY":"◇ GUEST RUN · LOCAL SCORES")}async function Kh(i="all"){if(ba)return!1;try{const e=await Ea(Sa+"/leaderboard?level="+encodeURIComponent(i));if(e.ok)return Gh=((await e.json()).entries||[]).map(n=>({handle:n.displayName,character:n.character,level:n.level||"training",score:n.score,kills:n.kills,seconds:Math.floor(n.durationMs/1e3),at:""})),!0}catch{}return!1}function Zh(i="all"){try{const e=i==="legacy"?"raid-local-scores":i==="archive-v2"?"raid-local-scores-v2":"raid-local-scores-v3",t=JSON.parse(ot.getItem(e)||"[]").sort((n,s)=>s.score-n.score);return i==="all"||i==="legacy"||i==="archive-v2"?t:t.filter(n=>n.level===i)}catch{return[]}}function bv(i){const e=[...Zh(),i].sort((t,n)=>n.score-t.score).slice(0,40);ot.setItem("raid-local-scores-v3",JSON.stringify(e))}const Ev={"training-180":"Haunted Forest","training-300":"Warrior","forest-300":"Desert Oasis","forest-420":"Tavern Keeper","desert-420":"Frozen Highlands","ice-540":"Molten Vault"};function yl(i,e,t){if(!i)return"All checkpoints claimed · play for score and discoveries";const n=Ev[i.checkpointId],s=n&&(n==="Warrior"?!Te.unlockedHeroes.includes("warrior"):n==="Tavern Keeper"?!Te.unlockedHeroes.includes("tavern-keeper"):!Te.unlocked.includes({"Haunted Forest":"forest","Desert Oasis":"desert","Frozen Highlands":"ice","Molten Vault":"lava"}[n]));return`+1 ${An[t].name} skill credit${s?` · Unlock ${n}`:""}${i.thresholdMs===72e4?e==="lava"?" · Class mastery":" · Realm mastery":""}`}function Jc(i,e,t){return i?`${un[e].name} · ${ua(i.thresholdMs/1e3)} · ${yl(i,e,t)}`:yl(null,e,t)}const sa={ranger:"Briar Barrage",wizard:"Arc Nova",dwarf:"Mountain Breaker",warrior:"Shieldbreaker","tavern-keeper":"Last Call"};function Jh(i){const e=An[i],t=Te.unlockedHeroes.includes(i),n=i==="warrior"?"Reach Training 05:00":i==="tavern-keeper"?"Reach Forest 07:00":"",s=Te.realmMastery?.[i]||[],r=(Te.classMastery||[]).includes(i);return`<button class="hero-card ${i===Ve?"selected":""} ${t?"":"locked"}" data-hero="${i}" ${t?"":"disabled"} aria-label="${pt(e.name)}${t?"":` locked, ${n}`}"><span class="hero-glow"></span><span class="hero-number">${String(Us.indexOf(i)+1).padStart(2,"0")}</span><img src="${zh(i)}" alt=""/><span class="hero-name">${pt(e.name)}</span><span class="hero-role">${pt(e.role)}</span><span class="hero-copy">${pt(e.copy)}</span><span class="hero-loadout">WEAPON · ${pt(Rt[e.weapon].name)}<br/>BOMB · ${pt(sa[i])}<br/>${r?"✦ CLASS MASTER":s.length?`✦ ${s.length} REALM${s.length===1?"":"S"} MASTERED`:"MASTERY AWAITS"}</span><span class="hero-pick">${t?i===Ve?"✦ SELECTED":"SELECT HERO":`LOCKED · ${n}`}</span></button>`}function Tv(){const i=Mo(Te,Ve,Ct),e=fv.filter(t=>t!=="lava"||Te.unlocked.includes("lava"));return`<div class="menu-backdrop"><div class="menu-vignette"></div><div class="menu-rune rune-one">✧</div><div class="menu-rune rune-two">✧</div><header class="menu-top"><div class="brand"><span class="brand-mark">✦</span> RAID GUILD <span class="brand-separator">/</span> ARCADE</div><div id="identity" class="identity"></div></header><main class="menu-main"><div class="eyebrow"><span class="line"></span> ${Te.unlocked.includes("lava")?"FIVE":"FOUR"} REALMS AWAIT <span class="line"></span></div><h1>RAID<br/><em>SURVIVOR</em></h1><p class="subtitle">One hero. A thousand foes. Whatever you carry out is yours.</p><div class="ornament">✦ <span></span> ✦</div><div class="select-label">CHOOSE YOUR REALM</div><div class="realm-grid">${e.map(t=>{const n=Te.unlocked.includes(t),s=Mo(Te,Ve,t);return`<button class="realm-card ${Ct===t?"selected":""}" data-realm="${t}" ${n?"":"disabled"}><b>${pv[t]} ${un[t].name.toUpperCase()}</b><small>${n?Jc(s,t,Ve):`Locked · ${t==="forest"?"Training 03:00":t==="desert"?"Forest 05:00":t==="ice"?"Desert 07:00":"Ice 09:00"}`}</small><span>${n?Ct===t?"SELECTED":"SELECT":"LOCKED"}</span></button>`}).join("")}</div><div class="select-label">YOUR CHAMPION <small>${String(Us.indexOf(Ve)+1).padStart(2,"0")} / ${String(Us.length).padStart(2,"0")}</small></div><div class="selected-hero">${Jh(Ve)}<div class="selected-hero-actions"><p>${pt(An[Ve].name)} · ${pt(An[Ve].role)}</p><p>${lr(Te,Ve)} available skill credit${lr(Te,Ve)===1?"":"s"}</p><button id="changeChampion" class="roster-button">CHANGE CHAMPION ➜</button></div></div><div class="next-objective" role="status"><b>NEXT OBJECTIVE</b><span>${pt(Jc(i,Ct,Ve))}</span><small>One checkpoint and one credit per run. Banked when reached; keep fighting for score.</small></div><div class="progress-strip"><button id="masteryMenu">PERMANENT SKILLS & PERKS</button><button id="bookMenu">MONSTER BOOK</button></div><button id="start" class="gold-button"><span>ENTER ${un[Ct].name.toUpperCase()}</span><b>➜</b></button><div class="menu-actions"><button id="leaderMenu">♛ LEADERBOARDS</button><span>✦</span><button id="settingsMenu">⚙ SETTINGS</button></div><div class="result-caption">${pt(xn)}</div><a class="portal-link" href="https://portal.raidguild.org/modules/raid-survivor" target="_blank" rel="noopener noreferrer">${Ke?ji?"Portal progression is saved across devices.":"Portal identity linked. Progression service is unavailable; a failed ranked start becomes unsaved practice.":"Guest progress is saved on this device. Portal uses a separate profile; guest progress is not imported. Connect for cloud progression and ranked scores ↗"}</a></main><footer class="menu-footer"><span>WASD / DRAG & HOLD · SPACE DASH</span><span>DESKTOP + TOUCH READY</span></footer></div><div id="modal-root"></div>`}function xi(){Yn(),Ot++,ws=!1,dn?.stop(),dn=null,wa(),$i(),cancelAnimationFrame(sr),U=null,it?.dispose(),it=null,qn=null,ii=null,Bh.innerHTML=Tv(),or(),wv()}function Yn(){Qt.clear(),vn.down=!1;const i=document.querySelector("#stage"),e=tn.id;tn.reset(),U&&(U.move.x=U.move.y=0,U.firing=!1),e>=0&&i?.hasPointerCapture(e)&&i.releasePointerCapture(e);const t=document.querySelector("#aimStick"),n=en.aim.id;en.aim.id=-1,en.aim.dx=en.aim.dy=0,n>=0&&t?.hasPointerCapture(n)&&t.releasePointerCapture(n),t?.classList.remove("active");const s=t?.querySelector(".stick-knob");s&&(s.style.transform="")}function wv(){document.querySelector("#changeChampion").onclick=()=>Av(),document.querySelectorAll("[data-realm]").forEach(i=>i.onclick=()=>{Ct=i.dataset.realm,ot.setItem("raid-selected-realm",Ct),Nt.selectLevel(Ct),xi()}),document.querySelector("#start").onclick=()=>ed(),document.querySelector("#leaderMenu").onclick=()=>Hv(),document.querySelector("#settingsMenu").onclick=()=>bs(),document.querySelector("#masteryMenu").onclick=()=>Qh(),document.querySelector("#bookMenu").onclick=()=>Pv()}function Av(){vt="roster";const i=Dn(`<div class="modal-scrim"><div class="modal-card roster-modal"><div class="modal-eyebrow">RAID GUILD CHAMPIONS</div><h2>CHOOSE YOUR CHAMPION</h2><p>Each champion has a primary weapon, bomb, and permanent skill path.</p><div class="roster-grid">${Us.map(e=>Jh(e)).join("")}</div><button id="rosterClose" class="gold-button small">DONE</button></div></div>`);i.querySelectorAll("[data-hero]").forEach(e=>e.onclick=()=>{Ve=e.dataset.hero,ot.setItem("raid-selected-hero",Ve),vt="none",xi()}),i.querySelector("#rosterClose").onclick=()=>$n()}const Rv={vitality:["Vitality","+5% starting health"],agility:["Agility","+3% movement speed"],bombRecharge:["Bomb Dynamo","Bomb recharges 5% faster"]};async function Qh(){const i=Ot;vt="mastery";const e=lr(Te,Ve),t=Te.perks[Ve],n=Te.equippedPerk[Ve],s=Ke&&!ji,r=Dn(`<div class="modal-scrim"><div class="modal-card leader-modal mastery-modal"><div class="modal-eyebrow">PERMANENT CLASS SKILLS</div><h2>${An[Ve].name.toUpperCase()} MASTERY</h2><p>${e} credit${e===1?"":"s"} available. Each checkpoint gives one credit. Skills cost 1; perks cost 3. Equip one perk for your next run.</p><h3>CORE SKILLS</h3><div class="mastery-list">${Object.entries(Rv).map(([o,[c,l]])=>`<button class="mastery-choice" data-skill="${o}" ${s||!e||Te.skills[Ve][o]>=2?"disabled":""}><b>${c}</b><small>${l}</small><span>${Te.skills[Ve][o]>=2?"MAX RANK":e?`RANK ${Te.skills[Ve][o]+1} · 1 CREDIT`:"NEED A CREDIT"}</span></button>`).join("")}</div><h3>CLASS PERKS</h3><div class="mastery-list">${va[Ve].map(o=>`<button class="mastery-choice" data-perk="${o.id}" ${s||!t.includes(o.id)&&e<o.cost?"disabled":""}><b>${pt(o.name)}</b><small>${pt(o.description)}</small><span>${n===o.id?"EQUIPPED":t.includes(o.id)?"EQUIP":`UNLOCK · ${o.cost} CREDITS`}</span></button>`).join("")}</div>${n?'<button id="unequipPerk" class="text-button">UNEQUIP PERK</button>':""}<div id="masteryStatus" class="result-caption" role="status">${Ke?"Portal progression":"Saved on this device · Portal profile is separate"}</div><button id="masteryClose" class="gold-button small">DONE</button></div></div>`);async function a(o,c,l){const h=Ke?Pt:null,d=crypto.randomUUID().replaceAll("-","");r.querySelectorAll(".mastery-choice,#unequipPerk").forEach(f=>f.disabled=!0),r.querySelector("#masteryStatus").textContent="SAVING…";try{if(h){const f=await da(o,{...c,character:Ve,expectedRevision:Te.revision,requestId:d});if(!qi(h,Pt,Ke))return;if(!f.ok)throw Error("Save failed");if(!gr(h,(await f.json()).profile,!1))return}else if(!Ke)l(d),Xh();else return;i===Ot&&vt==="mastery"&&Qh()}catch{(!h||qi(h,Pt,Ke))&&(r.querySelector("#masteryStatus").textContent="Save failed. Reopen this panel and try again.")}}r.querySelectorAll("[data-skill]").forEach(o=>o.onclick=()=>{const c=o.dataset.skill,l=Te.skills[Ve][c]+1;a("/profile/mastery",{skill:c,rank:l},h=>{Te=Td(Te,Ve,c,Te.revision,l,h)})}),r.querySelectorAll("[data-perk]").forEach(o=>o.onclick=()=>{const c=o.dataset.perk;t.includes(c)?a("/profile/equip",{perkId:c},l=>{Te=Yl(Te,Ve,c,Te.revision,l)}):a("/profile/perks",{perkId:c},l=>{Te=wd(Te,Ve,c,Te.revision,l)})}),r.querySelector("#unequipPerk")?.addEventListener("click",()=>{a("/profile/equip",{perkId:null},o=>{Te=Yl(Te,Ve,null,Te.revision,o)})}),r.querySelector("#masteryClose").onclick=()=>{vt="none",xi()}}const Cv={rageipede:"Game adaptation: a pack hunter that pauses before hopping at you.",xorn:"Game adaptation: a shadow stalker that reveals before a talon lunge.",efreeti:"Game adaptation: an airborne brute that absorbs magic briefly, then fires a burst.",deathwisp:"Game adaptation: an evasive desert pouncer with a marked charge.",buraq:"Game adaptation: a hovering giant that warns before a poison fan.",chuul:"Game adaptation: a swarm shown as one foe that marks an ethereal step.",dogmole:"Game adaptation: a burrowing brute that marks a groundbreaking blast.",tosculi:"Game adaptation: each tiny swarm is one fast, fragile foe.",seahag:"Game adaptation: a larger foe that locks a breath fan before firing alternating green and amber bolts.",hezrou:"Game adaptation: a colossal foe that marks a fiery lane before it strikes."};function Pv(){vt="book";const i=Dn(`<div class="modal-scrim"><div class="modal-card leader-modal book-modal"><div class="modal-eyebrow">MONSTERMAPS · ETHEREUM MAINNET</div><h2>MONSTER BOOK</h2><p>Encounter, defeat, and discover counters to reveal original on-chain sheets. Game attacks are adaptations of the source traits.</p><div class="book-list">${Object.entries(As).map(([e,t])=>{const n=Te.monsters[e],s=Ad(n);return`<article class="book-entry"><img src="/raid-survivor/sprites/monsters/${e}-${t.tokenId}.png" alt="" loading="lazy"/><div><b>${s?pt(t.name):"UNDISCOVERED CREATURE"}</b><small>${s?`SHEET #${t.tokenId} · ${n.kills} DEFEATED · ${n.counterKills} COUNTER KILLS`:`Find this creature in ${un[t.realm].name}`}</small>${s?`<p>${Cv[e]}</p>`:""}${s>=2?`<p>Original Actions: ${pt(t.actions)} · Special Ability: ${pt(t.ability)}</p>`:""}${s>=3?`<p>Weakness: ${pt(t.weakness)}</p>`:""}${s>=4?`<p>ORIGINAL SHEET<br/>Size: ${pt(t.size)} · Alignment: ${pt(t.alignment)}<br/>Locomotion: ${pt(t.locomotion)} · Language: ${pt(t.language)}</p>`:""}<small>${s===0?"Encounter to reveal":s===1?"Defeat 5 to reveal actions":s===2?"Defeat one with its counter to reveal weakness":s===3?"Defeat 25 and use its counter to master":"MASTERED"}</small></div></article>`}).join("")}</div><a class="portal-link" href="https://etherscan.io/address/0xecb9b2ea457740fbde58c758e4c574834224413e" target="_blank" rel="noopener noreferrer">Explore the original Monsters collection ↗</a><button id="bookClose" class="gold-button small">CLOSE BOOK</button></div></div>`);i.querySelector("#bookClose").onclick=()=>{vt="none",$n()}}async function ed(){if(ws)return;ws=!0,jh(),Nt.selectLevel(Ct),Nt.start(),Ot++;const i=Ot;wa();const e=document.querySelector("#start");if(e&&(e.disabled=!0,e.querySelector("span").textContent="CHECKING PORTAL SESSION…"),await $h,i!==Ot)return;if(!Te.unlocked.includes(Ct)||!Te.unlockedHeroes.includes(Ve)){xn="Select an unlocked realm and champion.",xi();return}const t=Ke&&!ba&&Ii===Gi,n=Pt;Yh=t?Ni:"Guest";const s=Ve,r=Ct;let a=null,o={version:Gi,character:s,level:r,skills:{...Te.skills[s]},equippedPerk:Te.equippedPerk[s],target:Mo(Te,s,r)};if(cancelAnimationFrame(sr),U&&(U.paused=!0),t){e&&(e.querySelector("span").textContent="PREPARING PORTAL RUN…");try{const h=await da("/runs",{version:Gi,character:s,level:r});if(h.ok){const d=await h.json(),f=sv(d,s,r);a=f.runId,o=f.config,n&&gr(n,d.profile)}else xn="Ranked start unavailable. This run is practice; unlocks and mastery will not be saved."}catch{xn="Ranked start unavailable. This run is practice; unlocks and mastery will not be saved."}}if(i!==Ot||t&&(!Ke||Pt!==n))return;if($i(),cancelAnimationFrame(sr),it?.dispose(),it=null,Yn(),vt="none",dn?.stop(),qn=o,_l=!1,ii=null,U=new bd(s,r,o),Nt.selectLevel(U.level),pl=!1,fl=!1,gi=a,ys=a?n:null,rr=null,ml=Ke&&!a?Ln(Te):null,gl=0,vl=0,a&&n){const h=a,d=n,f=i,m=U;dn=new ov(v=>da(`/runs/${h}/progress`,v),v=>{f!==Ot||m!==U||!qi(d,Pt,Ke)||(rr=v.progress,gr(d,v.profile))},()=>{f===Ot&&Ml()})}else dn=null;Bh.innerHTML=`<div class="game-shell"><div id="stage" class="stage"></div><div class="hud top-left"><div class="hud-row"><span class="hud-brand">✦ RAID SURVIVOR</span></div><div class="health-track"><div id="health-fill"></div><span id="health-label">100 / 100</span></div><div class="xp-track"><div id="xp-fill"></div></div><div class="hud-under"><span id="level">LVL 01</span><span id="kills">0 KILLS</span><span id="combo"></span><span id="runMode">${t?"PREPARING RANKED…":"LOCAL RUN"}</span><span id="saveStatus" role="status"></span></div></div><div class="hud survival-timer" aria-live="off"><span class="timer-label">SURVIVED</span><span id="time" class="timer">00:00</span><span id="timeMode" class="timer-mode">12:00 TO CLEAR</span><span id="checkpointHud" class="checkpoint-hud" role="status"></span><span id="nightmanHud" class="nightman-hud" role="status"></span></div><div class="hud top-right"><div class="score-title">VAULT SCORE</div><div id="score" class="score">000000</div><canvas id="minimap" width="118" height="118"></canvas><button id="pauseButton" class="hud-icon" aria-label="Pause">Ⅱ</button></div><div class="hud bottom-left"><div id="weapons" class="weapons"></div><div class="game-tip">WASD MOVE · HOLD MOUSE TO AIM · Q BOMB · SPACE DASH · B BACKPACK${Ct==="desert"?" · OASIS WATER BLOCKS GROUND MOVEMENT; SHOTS PASS OVER":Ct==="ice"?" · ICE WALLS BLOCK MOVEMENT AND SHOTS; BOMBS AND FALLING STARS IGNORE COVER":""}</div></div><div class="hud bottom-right"><button id="bombButton" class="bomb-button" aria-label="Bomb ready" aria-keyshortcuts="Q" title="Press Q to use bomb"><span>✷</span><small id="bombStatus">READY</small><div id="bombMeter"></div><kbd class="bomb-key" aria-hidden="true">Q</kbd></button><button id="dashButton" class="dash-button"><span>↗</span><small>DASH</small><div id="dashMeter"></div></button><button id="bagButton" class="bag-button">▣ BACKPACK</button></div><div id="bossBanner" class="boss-banner"></div><div id="chestIndicators" aria-label="Offscreen Vault Blessings"></div><div id="playerJoystick" class="player-joystick" aria-hidden="true"><div class="player-joystick-knob"></div></div><div id="touchHint" class="touch-hint">DRAG & HOLD TO MOVE</div><div id="touchControls" class="touch-controls ${ki?"manual-aim":""}"><div id="aimStick" class="stick aim-stick"><div class="stick-knob"></div><span>AIM</span></div></div><div id="overlay-root"></div></div>`;const c=document.querySelector("#stage"),l=document.querySelector("#minimap");it=new ev(c,U,l,ni),U.onReward=(h,d)=>d?Ov(h):Qc(h),U.onEvent=h=>{if(h==="death"){xv();return}if(Ss(h==="bossDead"?"level":h==="bomb"||h==="nightman"?"boss":h==="heal"?"level":h),h==="boss"||h==="bossDead"||h==="nightman"){const d=document.querySelector("#bossBanner");d.textContent=h==="nightman"?"☽ THE NIGHTMAN COMETH ☽":h==="boss"?"⚔ MOLOCH RISES ⚔":"✦ MOLOCH FALLS ✦",d.classList.add("visible"),setTimeout(()=>d.classList.remove("visible"),h==="nightman"?4e3:2700)}},document.querySelector("#pauseButton").onclick=()=>nd(),document.querySelector("#bagButton").onclick=()=>Ol(),document.querySelector("#dashButton").onclick=()=>U?.dash(),document.querySelector("#bombButton").onclick=()=>U?.bomb(),kv(c),Mr(),i===Ot&&(document.querySelector("#runMode").textContent=gi?"PORTAL RANKED":Ke?"PRACTICE · UNSAVED":"LOCAL RUN",Ml(),ul=performance.now(),er=0,Vh.reset(),ai.reset(U.player.x,U.player.y),Hh=0,sr=requestAnimationFrame(td),ws=!1,U.level!=="training"&&(U.awaitingReward=!0,Qc(U.rollRewards(!1))))}function Lv(){return Bi||window.matchMedia("(prefers-reduced-motion: reduce)").matches}function td(i){if(!U||!it)return;const e=Math.min(.1,(i-ul)/1e3);ul=i,er+=e,Nv();let t=U.paused||U.awaitingReward||U.dead||U.cleared;for(;er>=1/60;)t||ai.beforeStep(U.player.x,U.player.y),U.update(1/60),er-=1/60,t=U.paused||U.awaitingReward||U.dead||U.cleared,t&&ai.reset(U.player.x,U.player.y);t&&ai.reset(U.player.x,U.player.y),kl();const n=Lv();U.dead&&U.deathReason==="combat"&&!document.hidden&&(U.deathProgress=Math.min(1,U.deathProgress+e/(n?.25:1.3)));const s=Vh.advance(e);if(s!==null){const r=t?ai:ai.sample(U.player.x,U.player.y,er*60);it.render(s,n,r),Uv(),++Hh%6===0&&(Mr(),Dv())}U.cleared&&!fl&&(fl=!0,Fv()),U.dead&&!pl&&(U.deathReason!=="combat"||U.deathProgress>=1)&&(pl=!0,zv()),sr=requestAnimationFrame(td)}function Iv(i,e,t){const n=performance.now();if(ii&&ii.width===e&&ii.height===t&&n-ii.at<1e3)return ii.rects;const s=i.getBoundingClientRect(),r=[],a=[".hud.top-left",".hud.survival-timer",".hud.top-right",".hud.bottom-left",".hud.bottom-right","#aimStick","#touchHint"];for(const o of a){const c=document.querySelector(o);if(!c)continue;const l=getComputedStyle(c);if(l.display==="none"||l.visibility==="hidden"||Number(l.opacity)===0)continue;const h=c.getBoundingClientRect(),d=Math.max(s.left,h.left),f=Math.min(s.right,h.right),m=Math.max(s.top,h.top),v=Math.min(s.bottom,h.bottom);f<=d||v<=m||r.push({x:d-s.left,y:m-s.top,width:f-d,height:v-m})}return ii={at:n,width:e,height:t,rects:r},r}function Dv(){if(!U||!it)return;const i=document.querySelector("#chestIndicators"),e=document.querySelector("#stage");if(!i||!e)return;const t=av(U.pickups,U.player,(n,s)=>it.screen(n,s),it.width,it.height,Iv(e,it.width,it.height));i.innerHTML=t.map(n=>`<span class="chest-indicator" style="left:${Math.round(n.x)}px;top:${Math.round(n.y)}px" aria-label="Vault Blessing offscreen"><span style="transform:rotate(${n.angle}rad)">➤</span><small>VAULT</small></span>`).join("")}function Uv(){if(!U||!it||!_v.matches&&tn.id<0)return;const i=document.querySelector("#playerJoystick");if(!i)return;const e=it.screen(ai.x,ai.y);i.style.left=`${e.x}px`,i.style.top=`${e.y}px`,i.classList.toggle("active",tn.id>=0),i.classList.toggle("unavailable",U.dead||U.paused||U.awaitingReward);const t=i.firstElementChild;t.style.transform=`translate(${tn.direction.x*32}px,${-tn.direction.y*32}px)`}function Nv(){if(!U||!it||U.dead)return;const i=(Qt.has("d")||Qt.has("ArrowRight")?1:0)-(Qt.has("a")||Qt.has("ArrowLeft")?1:0),e=(Qt.has("w")||Qt.has("ArrowUp")?1:0)-(Qt.has("s")||Qt.has("ArrowDown")?1:0);if(U.move.x=tn.id>=0?tn.direction.x:i,U.move.y=tn.id>=0?tn.direction.y:e,ki&&en.aim.id>=0&&Math.hypot(en.aim.dx,en.aim.dy)>.15)U.aim.x=en.aim.dx,U.aim.y=en.aim.dy,U.firing=!0;else if(vn.down){const t=it.world(vn.x,vn.y),n=t.x-U.player.x,s=t.y-U.player.y,r=Math.hypot(n,s)||1;U.aim.x=n/r,U.aim.y=s/r,U.firing=!0}else U.firing=!1}function kv(i){i.onpointerdown=s=>{if(!(!U||U.dead||U.paused||U.awaitingReward||U.cleared)){if(s.pointerType==="mouse"){vn.down=!0,vn.x=s.clientX,vn.y=s.clientY;return}tn.begin(s.pointerId,s.clientX,s.clientY)&&(s.preventDefault(),i.setPointerCapture(s.pointerId),document.querySelector("#touchHint")?.classList.add("used"))}},i.onpointermove=s=>{if(s.pointerType==="mouse"){vn.x=s.clientX,vn.y=s.clientY;return}tn.move(s.pointerId,s.clientX,s.clientY)};const e=s=>{tn.end(s.pointerId)&&U&&(U.move.x=U.move.y=0)};i.onpointerup=e,i.onpointercancel=e,i.onlostpointercapture=e,window.onpointerup=s=>{s.pointerType==="mouse"&&(vn.down=!1)},window.onpointercancel=s=>{s.pointerType==="mouse"&&(vn.down=!1)};const t=document.querySelector("#aimStick");t.onpointerdown=s=>{if(!U||U.dead||U.paused||U.awaitingReward||U.cleared||en.aim.id>=0)return;s.preventDefault(),t.setPointerCapture(s.pointerId);const r=en.aim;r.id=s.pointerId,r.x=s.clientX,r.y=s.clientY,r.dx=r.dy=0,t.classList.add("active")},t.onpointermove=s=>{const r=en.aim;if(r.id!==s.pointerId)return;const a=s.clientX-r.x,o=s.clientY-r.y,c=Math.max(1,Math.hypot(a,o)),l=48;r.dx=Math.abs(a)>3?a/Math.max(c,l):0,r.dy=Math.abs(o)>3?-o/Math.max(c,l):0,t.querySelector(".stick-knob").style.transform=`translate(${a/c*Math.min(c,l)}px, ${o/c*Math.min(c,l)}px)`};const n=s=>{const r=en.aim;r.id===s.pointerId&&(r.id=-1,r.dx=r.dy=0,t.classList.remove("active"),t.querySelector(".stick-knob").style.transform="")};t.onpointerup=n,t.onpointercancel=n,t.onlostpointercapture=n}window.addEventListener("keydown",i=>{if(!U?.dead){if(i.key==="Escape"&&!i.repeat){vt!=="none"?$n():nd();return}if(i.code==="KeyQ"&&!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&U&&!U.paused&&!U.awaitingReward&&!U.cleared&&vt==="none"&&!(i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, [contenteditable]"))){i.preventDefault(),U.bomb();return}i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, button, [contenteditable]")||(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&i.preventDefault(),Qt.add(i.key.toLowerCase()),Qt.add(i.key),i.code==="Space"&&!i.repeat&&U?.dash(),i.key.toLowerCase()==="b"&&!i.repeat&&U&&Ol())}});window.addEventListener("keyup",i=>{Qt.delete(i.key.toLowerCase()),Qt.delete(i.key)});window.addEventListener("blur",()=>{Yn(),U&&!U.dead&&!U.awaitingReward&&(U.paused=!0)});window.addEventListener("resize",Yn);document.addEventListener("visibilitychange",()=>{document.hidden&&(Yn(),U&&!U.dead&&!U.awaitingReward&&(U.paused=!0))});function Mr(){if(!U)return;const i=U.player,e=qn?.target,t=!!e&&U.elapsed*1e3>=e.thresholdMs,n=!!e&&(gi?dn?.acknowledgedMs!==void 0&&dn.acknowledgedMs>=e.thresholdMs:!Ke&&Te.checkpoints[U.level][U.hero].includes(e.checkpointId)),s=(l,h)=>{const d=document.querySelector(l);d&&d.textContent!==h&&(d.textContent=h)};s("#time",ua(U.elapsed)),s("#timeMode",U.endless?"ENDLESS":e&&!t?`${ua(e.thresholdMs/1e3)} TO NEXT POINT`:t?"CHECKPOINT REACHED":"12:00 TO CLEAR"),s("#checkpointHud",e?t?Ke&&!gi?"PRACTICE · POINT NOT SAVED":n?"POINT BANKED · PLAY FOR SCORE":gi&&dn?.status==="retrying"?"POINT EARNED · SAVE RETRYING":"POINT EARNED · SAVING…":`NEXT · ${yl(e,U.level,U.hero)}`:"ALL POINTS CLAIMED · SCORE RUN"),s("#nightmanHud",U.nightman?U.nightman.warningRemaining>0?`☽ NIGHTMAN ARRIVES IN ${U.nightman.warningRemaining.toFixed(1)}s`:`☽ NIGHTMAN HUNTS · ${rh(U.elapsed).toFixed(2)}× SPEED`:""),s("#health-label",`${Math.ceil(i.health)} / ${i.maxHealth}`),s("#level",`LVL ${String(U.stats.level).padStart(2,"0")}`),s("#kills",`${U.stats.kills} KILLS`),s("#combo",U.combo>=4?`${U.combo}× CHAIN`:""),s("#score",String(U.score).padStart(6,"0")),document.querySelector("#health-fill").style.width=`${i.health/i.maxHealth*100}%`,document.querySelector("#xp-fill").style.width=`${U.xp/U.xpNeeded*100}%`,document.querySelector("#dashMeter").style.height=`${Math.min(100,(1-i.dashCooldown/3.5)*100)}%`,document.querySelector("#bombMeter").style.height=`${Math.min(100,U.bombCharge/U.bombRecharge*100)}%`;const r=document.querySelector("#bombButton");r.classList.toggle("ready",U.bombCharge>=U.bombRecharge);const a=Math.ceil(U.bombRecharge-U.bombCharge);r.setAttribute("aria-label",U.bombCharge>=U.bombRecharge?`${sa[U.hero]} ready`:`${sa[U.hero]} charging, ${a} seconds`),r.setAttribute("data-name",sa[U.hero].toUpperCase()),document.querySelector("#bombStatus").textContent=U.bombCharge>=U.bombRecharge?"READY":`${a}s`;const o=document.querySelector("#weapons"),c=U.slots.map(l=>l+":"+U.weapons[l]).join("|");o.dataset.loadout!==c&&(o.dataset.loadout=c,o.innerHTML=U.slots.map((l,h)=>`<div class="weapon-slot" style="--weapon-color:${"#"+Rt[l].color.toString(16)}"><span class="slot-num">0${h+1}</span><span class="weapon-icon">${Rt[l].icon}</span><span class="weapon-label">${Rt[l].name}<small>RANK ${U.weapons[l]}</small></span></div>`).join(""))}function Dn(i){Yn(),$i();const e=document.querySelector(U?"#overlay-root":"#modal-root");return e.innerHTML=i,e}function $n(){$i(),vt="none";const i=document.querySelector(U?"#overlay-root":"#modal-root");i&&(i.innerHTML=""),U&&!U.awaitingReward&&!U.dead&&(U.paused=!1)}function nd(){if(!(!U||U.dead||U.cleared||U.awaitingReward)){if(vt!=="none"){$n();return}U.paused=!U.paused,U.paused?(Yn(),vt="settings",bs(!0)):$n()}}function bs(i=!1){vt="settings",U&&(U.paused=!0);const e=Dn(`<div class="modal-scrim"><div class="modal-card narrow"><div class="modal-eyebrow">THE VAULT CAN WAIT</div><h2>${i?"PAUSED":"SETTINGS"}</h2><div class="setting-row"><span>Sound effects<small>Arcade synth cues</small></span><button id="soundToggle" class="toggle">${Vn?"ON":"OFF"}</button></div><div class="setting-row"><span>Music<small>${Nt.snapshot().track}</small></span><button id="musicToggle" class="toggle" type="button" aria-label="Mute music" aria-pressed="${Nt.muted}">${Nt.muted?"OFF":"ON"}</button></div><div class="setting-row music-volume-row"><label for="musicVolume">Music volume</label><input id="musicVolume" type="range" min="0" max="100" value="${Nt.volume}" aria-label="Music volume"/><output id="musicVolumeValue" for="musicVolume">${Math.round(Nt.volume)}%</output></div><div class="setting-row graphics-row"><span>Graphics<small>Auto uses lighter effects on touch screens</small></span><button id="graphicsToggle" class="toggle" aria-label="Graphics quality: ${ni}">${ni.toUpperCase()}</button></div><div class="setting-row"><span>Reduced motion<small>Short blessing reveal</small></span><button id="motionToggle" class="toggle">${Bi?"ON":"OFF"}</button></div><div class="setting-row"><span>Manual touch aim<small>Show an aim control for precise firing</small></span><button id="aimToggle" class="toggle">${ki?"ON":"OFF"}</button></div><div class="controls-note"><div>MOVE <b>WASD / DRAG & HOLD</b></div><div>AUTO FIRE <b>NEAREST FOE</b></div><div>MANUAL AIM <b>HOLD MOUSE / OPTIONAL RIGHT STICK</b></div><div>BOMB <b>Q / BOMB BUTTON</b></div><div>DASH <b>SPACE / DASH BUTTON</b></div><div>BACKPACK <b>B</b></div></div><button id="resume" class="gold-button small">${U?"RESUME RUN":"DONE"}</button>${U?'<button id="abandon" class="text-button">END RUN</button>':""}</div></div>`);e.querySelector("#soundToggle").onclick=()=>{Vn=!Vn,Vn?jh():wa(),ot.setItem("raid-sound",Vn?"on":"off"),bs(i)},e.querySelector("#musicToggle").onclick=()=>{Nt.start(),Nt.toggleMuted();const n=e.querySelector("#musicToggle");n.textContent=Nt.muted?"OFF":"ON",n.setAttribute("aria-pressed",String(Nt.muted))},e.querySelector("#musicVolume").oninput=n=>{Nt.start();const s=Number(n.target.value);Nt.setVolume(s),e.querySelector("#musicVolumeValue").value=`${Math.round(Nt.volume)}%`},e.querySelector("#graphicsToggle").onclick=()=>{ni=ni==="auto"?"performance":ni==="performance"?"full":"auto",ot.setItem("raid-graphics",ni),it?.setGraphics(ni),bs(i)},e.querySelector("#motionToggle").onclick=()=>{Bi=!Bi,ot.setItem("raid-motion",Bi?"reduced":"full"),bs(i)},e.querySelector("#aimToggle").onclick=()=>{ki=!ki,ot.setItem("raid-manual-aim",ki?"on":"off"),document.querySelector("#touchControls")?.classList.toggle("manual-aim",ki),Yn(),bs(i)},e.querySelector("#resume").onclick=()=>$n();const t=e.querySelector("#abandon");t&&(t.onclick=()=>{U&&(U.die("abandon"),$n())})}function Ol(){if(!U||U.dead||U.cleared||U.awaitingReward)return;vt="backpack",U.paused=!0;const i=U.slots.map((s,r)=>`<button class="bag-item active" data-slot="${r}"><b>${Rt[s].icon}</b><span>${Rt[s].name}<small>RANK ${U.weapons[s]}</small></span></button>`).join(""),e=U.backpack.map((s,r)=>`<button class="bag-item" data-bag="${r}"><b>${Rt[s].icon}</b><span>${Rt[s].name}<small>RANK ${U.weapons[s]}</small></span></button>`).join("")||'<div class="empty-bag">Reserve weapons found in the vault appear here.</div>',t=Dn(`<div class="modal-scrim"><div class="modal-card bag-modal"><div class="modal-eyebrow">YOUR LOADOUT</div><h2>BACKPACK</h2><p>Three weapons can fire at once. Tap a reserve weapon, then an active slot to swap.</p><div class="bag-columns"><div><h3>ACTIVE · 3 SLOTS</h3>${i}</div><div><h3>RESERVE · 3 SLOTS</h3>${e}</div></div><button id="bagClose" class="gold-button small">RETURN TO VAULT</button></div></div>`);let n=-1;t.querySelectorAll("[data-bag]").forEach(s=>s.onclick=()=>{n=Number(s.dataset.bag),t.querySelectorAll("[data-bag]").forEach(r=>r.classList.remove("chosen")),s.classList.add("chosen")}),t.querySelectorAll("[data-slot]").forEach(s=>s.onclick=()=>{n>=0&&(U?.swapBackpack(n,Number(s.dataset.slot)),Ol())}),t.querySelector("#bagClose").onclick=()=>$n()}function Qc(i,e){if(!U)return;pa=i,vt="none";const t=Dn(`<div class="reward-scrim "><div class="reward-stage"><div class="reward-rays">✦</div><div class="modal-eyebrow">YOUR LEGEND GROWS</div><h2>${"LEVEL "+String(U.stats.level).padStart(2,"0")}</h2><p>Choose one power to carry deeper into the vault.</p><div class="reward-cards">${i.map((s,r)=>`<button class="reward-card ${s.rarity} " data-reward="${r}"><span class="reward-rarity">${s.rarity.toUpperCase()}</span><span class="reward-icon">${s.icon}</span><span class="reward-name">${s.name}</span><span class="reward-detail">${s.detail}</span><span class="reward-take">CLAIM POWER ➜</span></button>`).join("")}</div></div></div>`);t.querySelectorAll(".reward-card").forEach((s,r)=>setTimeout(()=>s.classList.remove("concealed"),Bi?0:r*320)),t.querySelectorAll("[data-reward]").forEach(s=>s.onclick=()=>{const r=pa[Number(s.dataset.reward)];U?.chooseReward(r),t.innerHTML="",vt="none"})}function eh(i){if(Vn)try{xt||=new AudioContext,xt.state==="suspended"&&xt.resume().catch(()=>{});const e=xt.createOscillator(),t=xt.createGain(),n=xt.currentTime;e.type="triangle",e.frequency.setValueAtTime(i,n),e.frequency.exponentialRampToValueAtTime(i*1.25,n+.055),t.gain.setValueAtTime(.035,n),t.gain.exponentialRampToValueAtTime(.001,n+.07),e.connect(t).connect(xt.destination),e.start(),e.stop(n+.075)}catch{}}function Ov(i){if(!U)return;pa=i,vt="none";const e=Bi||window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=["✦","ϟ","☄","◈","♥","✧"],n=i.some(d=>d.rarity==="epic")?"epic":i.some(d=>d.rarity==="rare")?"rare":"common",r=Array.from({length:n==="epic"?105:n==="rare"?70:48},(d,f)=>`<span class='${f%4===0?"coin":"streamer"}' style='--x:${Math.round(Math.random()*100)}%;--delay:${(Math.random()*.8).toFixed(2)}s;--spin:${Math.round(Math.random()*1080-540)}deg;--hue:${f%3===0?"42":f%3===1?"330":"175"}'></span>`).join(""),a=Dn(`<div class='reward-scrim chest-reward rarity-${n} ${e?"low-motion":""}'>${e?"":"<div class='spotlight spotlight-left'></div><div class='spotlight spotlight-right'></div>"}${e?"":`<div class='confetti' id='confetti'>${r}</div>`}<div class='reward-stage'>${e?"":"<div class='reward-rays'>✦</div>"}<div class='modal-eyebrow'>AN ANCIENT CHEST OPENS</div><h2>VAULT BLESSING</h2><div id='reel' class='reel'><div class='reel-symbol'>✦</div><div class='reel-symbol'>ϟ</div><div class='reel-symbol'>◈</div></div><div id='reelStatus' class='reel-status' aria-live='polite'>FORTUNE IS TURNING</div><div class='reward-cards'>${i.map((d,f)=>`<button class='reward-card ${d.rarity} concealed' data-reward='${f}' disabled><span class='reward-rarity'>${d.rarity.toUpperCase()}</span><span class='reward-icon'>${d.icon}</span><span class='reward-name'>${d.name}</span><span class='reward-detail'>${d.detail}</span><span class='reward-take'>CLAIM POWER ➜</span></button>`).join("")}</div><button id='skipReveal' class='text-button'>SKIP REVEAL</button></div></div>`),o=tr,c=(d,f)=>ar.push(setTimeout(()=>{o===tr&&a.isConnected&&d()},f));let l=!1;const h=(d=!1)=>{if(l||o!==tr)return;l=!0,d&&a.querySelector(".reward-scrim")?.classList.add("reveal-skipped"),zi&&clearInterval(zi),zi=null;for(const m of ar)clearTimeout(m);ar=[],a.querySelector("#reel")?.classList.add("stopped"),a.querySelector("#reelStatus").textContent=n==="epic"?"JACKPOT · CHOOSE YOUR FORTUNE":"CHOOSE YOUR FORTUNE",!d&&!e&&a.querySelector("#confetti")?.classList.add("burst"),a.querySelector("#skipReveal")?.remove();const f=[...a.querySelectorAll(".reward-card")];d||e?f.forEach(m=>{m.classList.remove("concealed"),m.disabled=!1}):f.forEach((m,v)=>c(()=>{m.classList.remove("concealed"),m.disabled=!1,eh(600+v*150)},v*240)),!d&&!e&&(Ss("level"),c(()=>Ss("chest"),200))};if(a.querySelector("#skipReveal").onclick=()=>h(!0),e)h(!0);else{let d=0;zi=setInterval(()=>{if(o!==tr||!a.isConnected){$i();return}d++,a.querySelectorAll(".reel-symbol").forEach((f,m)=>f.textContent=t[(d+m*2+Math.floor(Math.random()*t.length))%t.length]),d%2===0&&eh(230+d*13)},95),c(()=>{a.querySelector("#reelStatus").textContent="THE REELS ARE SLOWING",a.querySelector("#reel")?.classList.add("slowing")},1850),c(()=>{a.querySelector("#reelStatus").textContent="ONE FINAL TURN...",a.querySelector("#reel")?.classList.add("final-turn")},2900),c(()=>h(),3700)}a.querySelectorAll("[data-reward]").forEach(d=>d.onclick=()=>{!l||d.disabled||(U?.chooseReward(pa[Number(d.dataset.reward)]),$i(),a.innerHTML="",vt="none")})}function Fv(){if(!U)return;U.paused=!0,kl(!0);const i=qn?.target?.thresholdMs===72e4,e=i?U.level==="lava"?"CLASS MASTERY REACHED":"REALM MASTERY REACHED":"TWELVE MINUTES SURVIVED",t=i?"Your mastery checkpoint is reached. Bank the run or keep fighting for score; the save status is below.":qn?.target?"Your one checkpoint is reached. The next checkpoint becomes eligible on another run.":"All checkpoints are claimed. Continue for score and discoveries.",n=Dn(`<div class='modal-scrim result-scrim'><div class='modal-card result-modal'><div class='modal-eyebrow'>THE TWELFTH BELL HAS TOLLED</div><h2>${e}</h2><p>${t}</p><p>The Nightman comes only if you continue. He is invincible, chases faster over time, and one touch ends the run.</p><p id='clearSaveStatus' class='result-caption' role='status'></p><div class='result-grid'><div><strong>${U.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${U.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div><div><strong>${U.stats.level}</strong><span>LEVEL</span></div><div><strong>${U.score.toLocaleString()}</strong><span>SCORE</span></div></div><button id='bankRun' class='gold-button small'>BANK SCORE & EXIT</button><button id='endlessRun' class='text-button'>CONTINUE ENDLESS · FACE THE NIGHTMAN ➜</button></div></div>`);Ml(),n.querySelector("#bankRun").onclick=()=>{U&&(U.die("bank"),n.innerHTML="")},n.querySelector("#endlessRun").onclick=()=>{U&&it&&U.continueEndless({left:it.cameraX-it.viewWidth/2,right:it.cameraX+it.viewWidth/2,bottom:it.cameraY-it.viewHeight/2,top:it.cameraY+it.viewHeight/2})&&(n.innerHTML="")}}function Bv(i){const e=i.stats;return(e.kills-e.elites-e.bosses)*10+e.elites*75+e.bosses*600+e.chests*120+(e.level-1)*40+Math.floor(Math.round(i.elapsed*1e3)/1e3)*2}async function zv(){if(!U)return;const i=U,e=Ot,t=gi;i.paused=!0,kl(!0),await dn?.settle();const n={handle:Yh,character:i.hero,level:i.level,score:Bv(i),kills:i.stats.kills,seconds:Math.floor(i.elapsed),at:new Date().toISOString()};i.rankable&&bv(n);const s=i.rankable?t?"LOCAL SCORE SAVED · SAVING RANKED RUN…":Ke?"PRACTICE SCORE SAVED LOCALLY · UNLOCKS NOT SAVED":"LOCAL SCORE AND PROGRESS SAVED ON THIS DEVICE":"UNRANKED TEST RUN",r=i.rankable&&!!qn?.target&&i.elapsed*1e3>=qn.target.thresholdMs,a=Dn(`<div class="modal-scrim result-scrim"><div class="modal-card result-modal"><div class="modal-eyebrow">${un[i.level].name.toUpperCase()} · THE VAULT REMEMBERS</div><h2>${i.killedByNightman?"THE NIGHTMAN CLAIMED YOU":i.cleared?"TWELVE MINUTES SURVIVED":"YOUR RUN ENDS"}</h2><div class="result-score">${n.score.toLocaleString()}</div><div id="resultStatus" class="result-caption" role="status">${s}</div><div class="result-grid"><div><strong>${ua(i.elapsed)}</strong><span>SURVIVED</span></div><div><strong>${i.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${i.stats.level}</strong><span>LEVEL</span></div><div><strong>${i.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div></div>${r?`<p>${Ke&&!t?"Practice checkpoint reached; replay ranked to save the credit.":t?"Checkpoint reached; Portal save is in progress.":"Checkpoint credit banked · check permanent skills in the menu."}</p>`:""}<button id="retry" class="gold-button small">TRY AGAIN ➜</button><button id="returnMenu" class="text-button">RETURN TO CHAMPIONS</button></div></div>`);if(a.querySelector("#retry").onclick=()=>ed(),a.querySelector("#returnMenu").onclick=()=>xi(),!i.rankable||!t||!ys||(gv(ys,{runId:t,body:{version:Gi,character:i.hero,level:i.level,durationMs:Math.round(i.elapsed*1e3),stats:{...i.stats},progress:Wh(i)}}),ys===Pt&&(await xl(),fa(ys).some(l=>l.runId===t)&&await xl()),i!==U||e!==Ot))return;const o=a.querySelector("#resultStatus");if(!o)return;const c=qh.get(t);o.textContent=c==="saved"?"LOCAL + PORTAL RANKED SCORE SAVED":c==="rejected"?"LOCAL SCORE SAVED · PORTAL REJECTED THIS RUN":"LOCAL SCORE SAVED · PORTAL SUBMISSION QUEUED FOR RETRY",c==="saved"&&Kh()}async function Hv(){const i=Ot;vt="leaderboard";let e="all",t=Ke?"portal":"local",n=!1;const s=Dn(`<div class="modal-scrim"><div class="modal-card leader-modal"><div class="modal-eyebrow">ONE RUN · ONE SCORE</div><h2>LEADERBOARDS</h2><div class="leader-tabs">${rv()}</div><div class="leader-tabs"><button id="localTab">LOCAL</button><button id="portalTab">PORTAL</button></div><div id="leaderStatus" class="result-caption" role="status"></div><div id="leaderRows"></div><button id="leaderClose" class="gold-button small">CLOSE</button></div></div>`),r=()=>{const o=t==="portal"&&n?Gh:t==="local"?Zh(e):[];s.querySelector("#leaderRows").innerHTML=o.length?o.slice(0,10).map((c,l)=>`<div class="leader-row"><span class="rank">${String(l+1).padStart(2,"0")}</span><img src="${zh(Us.includes(c.character)?c.character:"ranger")}" alt=""/><span class="leader-name">${pt(c.handle)}<small>${e==="all"?pt(un[c.level]?.name||"Guild Training"):""}</small></span><span class="leader-kills">${c.kills} KILLS</span><b>${c.score.toLocaleString()}</b></div>`).join(""):'<div class="empty-leader">No scores on this board yet.</div>',s.querySelector("#leaderStatus").textContent=t==="portal"?n?"Portal scores · best single run per player":"Portal board unavailable":e==="legacy"?"Original local scores":e==="archive-v2"?"Earlier local scores":"Scores saved on this device",s.querySelector("#localTab")?.classList.toggle("active",t==="local"),s.querySelector("#portalTab")?.classList.toggle("active",t==="portal")},a=async()=>{t==="portal"&&(n=await Kh(e),i!==Ot||vt!=="leaderboard")||r()};s.querySelectorAll("[data-board]").forEach(o=>o.onclick=()=>{e=o.dataset.board,s.querySelectorAll("[data-board]").forEach(c=>c.classList.toggle("active",c===o)),a()}),s.querySelector("#localTab").onclick=()=>{t="local",r()},s.querySelector("#portalTab").onclick=()=>{t="portal",a()},s.querySelector("#leaderClose").onclick=()=>$n(),await a()}new URL(location.href).searchParams.has("ranked")&&history.replaceState(null,"",location.pathname+location.hash);xi();$h=Sv();window.addEventListener("pagehide",wa);
