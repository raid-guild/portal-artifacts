(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Oc=i=>{const e=Math.hypot(i.targetX-i.x,i.targetY-i.y)||1;return{x1:i.x,y1:i.y,x2:dt(i.x+(i.targetX-i.x)/e*7.7,1,Ce-1),y2:dt(i.y+(i.targetY-i.y)/e*7.7,1,Ce-1),radius:i.radius+.55}},Bc=(i,e,t,n,s,r,a)=>{const o=s-t,l=r-n,c=o*o+l*l,h=c?dt(((i-t)*o+(e-n)*l)/c,0,1):0;return(i-t-o*h)**2+(e-n-l*h)**2<a**2},io={ranger:{name:"Ranger",role:"THE THORNBOW",weapon:"thornbow",health:100,speed:8.2,color:8640155,copy:"Rapid piercing arrows. Fast feet and a steady aim."},wizard:{name:"Wizard",role:"THE ARC WAND",weapon:"arcwand",health:85,speed:7.7,color:10851839,copy:"Volatile bolts bloom into arcane shockwaves."},dwarf:{name:"Dwarf",role:"THE RUNIC SCATTERGUN",weapon:"scattergun",health:135,speed:6.8,color:16759667,copy:"Close range devastation. Sturdy as the mountain."}},bt={thornbow:{name:"Thornbow",icon:"➶",desc:"Piercing arrows split at higher ranks",color:9435312,cooldown:.27},arcwand:{name:"Arc Wand",icon:"✧",desc:"Arcane bolts detonate on impact",color:11510015,cooldown:.44},scattergun:{name:"Runic Scattergun",icon:"✷",desc:"A brutal cone of rune shot",color:16761469,cooldown:.62},chain:{name:"Storm Coil",icon:"ϟ",desc:"Lightning leaps between nearby foes",color:8968447,cooldown:1.2},orbit:{name:"Halo Blades",icon:"◈",desc:"Orbiting steel carves a safe path",color:16767374,cooldown:.19},comet:{name:"Falling Star",icon:"☄",desc:"Call down a blazing meteor",color:16748402,cooldown:2.1}},Ce=180,In=2400,kc=650,Er=900,zc=360,Hc=12,Vc=280,wo=16,Ht=(i,e)=>i+Math.random()*(e-i),dt=(i,e,t)=>Math.max(e,Math.min(t,i)),Vt=(i,e)=>(i.x-e.x)**2+(i.y-e.y)**2;class Gc{hero;player;enemies=[];projectiles=[];enemyShots=[];strikes=[];pickups=[];effects=[];hazards=[];weapons={};slots=[];backpack=[];passives={damage:0,speed:0,magnet:0,vitality:0,cooldown:0};stats={kills:0,elites:0,bosses:0,chests:0,level:1};score=0;survivalClock=0;elapsed=0;xp=0;xpNeeded=14;gold=0;combo=0;comboTime=0;spawnClock=0;chestClock=0;lastChestTime=-45;bombCharge=45;bombRanks={radius:0,damage:0,recharge:0};bombWave=null;facing=1;bossWave=0;escortDebt=0;nextId=1;dead=!1;deathReason=null;deathProgress=0;deathFacing=1;deathFiring=!1;cleared=!1;endless=!1;paused=!1;awaitingReward=!1;rankable=!0;aim={x:1,y:0};move={x:0,y:0};firing=!1;cooldowns={};onReward=null;onEvent=null;gridWidth=Math.ceil(Ce/5);gridHead=new Int32Array(this.gridWidth*this.gridWidth).fill(-1);gridNext=new Int32Array(In);orbitHits=new Map;orbitPulse=0;shrines=[[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]].map(([e,t],n)=>({id:n,x:e,y:t,active:!0}));constructor(e){this.hero=e;const t=io[e];this.player={x:Ce/2,y:Ce/2,health:t.health,maxHealth:t.health,invuln:0,dash:0,dashCooldown:0,speed:t.speed},this.weapons[t.weapon]=1,this.slots.push(t.weapon);for(let n=0;n<18;n++)this.spawnEnemy();this.buildGrid()}die(e="combat"){return this.dead?!1:(this.dead=!0,this.deathReason=e,this.deathFacing=this.facing,this.deathFiring=this.firing,this.player.health=0,this.move.x=this.move.y=0,this.firing=!1,this.hazards.length=0,e==="combat"&&this.onEvent?.("death"),!0)}effect(e){this.effects.length<zc&&this.effects.push(e)}buildGrid(){this.gridHead.fill(-1);for(let e=0;e<this.enemies.length;e++){const t=this.enemies[e],n=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.x/5))),r=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.y/5)))*this.gridWidth+n;this.gridNext[e]=this.gridHead[r],this.gridHead[r]=e}}forNearby(e,t,n,s){const r=Math.max(0,Math.floor((e-n)/5)),a=Math.min(this.gridWidth-1,Math.floor((e+n)/5)),o=Math.max(0,Math.floor((t-n)/5)),l=Math.min(this.gridWidth-1,Math.floor((t+n)/5));for(let c=o;c<=l;c++)for(let h=r;h<=a;h++)for(let u=this.gridHead[c*this.gridWidth+h];u!==-1;u=this.gridNext[u])if(s(this.enemies[u]))return}nearest(e,t,n,s){let r,a=n*n;return this.forNearby(e,t,n,o=>{const l=(o.x-e)**2+(o.y-t)**2;o.hp>0&&l<a&&!s?.has(o.id)&&(r=o,a=l)}),r}spawnEnemy(e,t=!1){if(this.enemies.length>=In)return;const n=this.elapsed/60,s=e||(Math.random()<Math.min(.08+n*.04,.25)?"brute":Math.random()<.18?"wisp":Math.random()<.28?"cultist":"rat");if(s==="boss"&&this.enemies.filter(d=>d.kind==="boss"&&d.hp>0).length>=wo)return;const r=Ht(0,Math.PI*2),a=Ht(21,30),o=dt(this.player.x+Math.cos(r)*a,2,Ce-2),l=dt(this.player.y+Math.sin(r)*a,2,Ce-2),c={rat:[15,3.2,8,.44],cultist:[25,2.5,10,.55],brute:[60,1.65,17,.85],wisp:[17,4,7,.4],boss:[1050,1.6,27,2.2]}[s],h=1+Math.min(4,n*.27),u=s!=="boss"||this.elapsed<360?1:this.elapsed<540?2:3,f=t&&s==="brute"&&this.elapsed>=120?"juggernaut":t&&s==="cultist"&&this.elapsed>=180?"hexcaster":null,g=f==="juggernaut"?6:f==="hexcaster"?7:1,x=c[0]*h*(t?3:1)*g*(s==="boss"?u===2?1.35:u===3?1.65:1:1),M=s==="boss"?1:.85+.15*dt(this.elapsed/60,0,1),m={id:this.nextId++,x:o,y:l,hp:x,maxHp:x,speed:s==="boss"&&u>1?u===2?1.9:2.1:c[1],damage:c[2]*M,openingScale:M,radius:c[3]*(t?1.35:1),kind:s,elite:t,special:f,specialState:"idle",specialTimer:0,specialCd:f?1:0,targetX:o,targetY:l,chargeX:0,chargeY:0,chargeHit:!1,tier:u,bossCastTimer:0,flash:0,phase:Ht(0,6.28),attackCd:s==="boss"?1.5:Ht(1.4,3),windup:0,facing:this.player.x<o?-1:1,knockX:0,knockY:0,attackPhase:0};return this.enemies.push(m),m}dash(){this.player.dashCooldown>0||this.dead||this.paused||this.awaitingReward||(this.player.dash=.2,this.player.invuln=.36,this.player.dashCooldown=3.5,this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.35,max:.35,color:10092498,size:2}),this.onEvent?.("dash"))}get bombRecharge(){return 45*Math.pow(.88,this.bombRanks.recharge)}get bombRadius(){return 7*(1+this.bombRanks.radius*.12)}bomb(){return this.bombCharge<this.bombRecharge||this.dead||this.paused||this.awaitingReward?!1:(this.bombCharge=0,this.bombWave={age:0,radius:0,previousRadius:0,hit:new Set},this.onEvent?.("bomb"),!0)}updateBomb(e){if(!this.bombWave)return;const t=this.bombWave;t.age+=e,t.previousRadius=t.radius,t.radius=this.bombRadius*Math.min(1,t.age/.6);const n=this.player,s=this.hero==="ranger"?"thornbow":this.hero==="wizard"?"arcwand":"scattergun",r={ranger:48,wizard:54,dwarf:66}[this.hero]*(1+this.bombRanks.damage*.25);if(this.forNearby(n.x,n.y,t.radius+3,a=>{if(a.hp<=0||t.hit.has(a.id))return;const o=Math.sqrt(Vt(a,n));if(!(o>t.radius+a.radius||o<t.previousRadius-a.radius)){if(t.hit.add(a.id),this.damage(a,r,s),this.hero==="dwarf"&&a.kind!=="boss"){const l=6/(o||1);a.knockX=(a.x-n.x)*l,a.knockY=(a.y-n.y)*l}if(this.hero==="wizard"){let l=0;this.forNearby(a.x,a.y,3.5,c=>{if(l>=2)return!0;c.hp<=0||t.hit.has(c.id)||Vt(a,c)>3.5**2||(t.hit.add(c.id),l++,this.damage(c,r*.45,s),this.effect({x:a.x,y:a.y,x2:c.x,y2:c.y,kind:"zap",life:.22,max:.22,color:10479615,size:.3}))})}}}),this.hero==="ranger"&&t.previousRadius<2&&t.radius>=2)for(let a=0;a<24;a++)this.projectile(n.x,n.y,a*Math.PI/12,25,r*.35,"thornbow",.21,3,.65);t.age>=.6&&(this.bombWave=null)}damage(e,t,n){if(e.hp<=0)return;if(e.hp-=t*(1+this.passives.damage*.18),e.flash=.12,e.hp>0){Math.random()<.28&&this.effect({x:e.x,y:e.y,kind:"hit",life:.16,max:.16,color:bt[n].color,size:.7});return}this.hazards=this.hazards.filter(a=>a.sourceId!==e.id),this.stats.kills++,e.elite&&this.stats.elites++,e.kind==="boss"&&(this.stats.bosses++,this.onEvent?.("bossDead")),this.combo++,this.comboTime=3,this.score+=e.kind==="boss"?600:e.elite?75:10;const s=e.kind==="boss"?22:e.elite?5:1;for(let a=0;a<s&&this.pickups.length<Er;a++)this.pickups.push({x:e.x+Ht(-1,1),y:e.y+Ht(-1,1),kind:"xp",value:e.kind==="boss"?4:e.elite?3:1,life:25});const r=e.elite?e.kind==="brute"?.45:.3:e.kind==="brute"?.08:0;if(e.kind==="boss"||r>0&&this.elapsed-this.lastChestTime>=45&&!this.pickups.some(a=>a.kind==="chest")&&Math.random()<r){const a={x:e.x,y:e.y,kind:"chest",value:1,life:45};if(this.pickups.length<Er)this.pickups.push(a);else{const o=this.pickups.findIndex(l=>l.kind==="xp");o>=0&&(this.pickups[o]=a)}this.lastChestTime=this.elapsed}else this.pickups.length<Er&&Math.random()<.018&&this.pickups.push({x:e.x,y:e.y,kind:"heart",value:18,life:25});this.effect({x:e.x,y:e.y,kind:"burst",life:.45,max:.45,color:e.kind==="boss"?16762730:16743066,size:e.radius*2.5}),this.onEvent?.("kill")}projectile(e,t,n,s,r,a,o=.26,l=0,c=1.6){this.projectiles.length>=kc||this.projectiles.push({x:e,y:t,vx:Math.cos(n)*s,vy:Math.sin(n)*s,damage:r,kind:a,radius:o,pierce:l,life:c,chain:0,hit:new Set})}fireWeapon(e){const t=this.weapons[e]||1,n=this.player;let s=Math.atan2(this.aim.y,this.aim.x);if(!this.firing&&e!=="orbit"){const r=this.nearest(n.x,n.y,17);if(!r)return;s=Math.atan2(r.y-n.y,r.x-n.x)}if(e==="thornbow"){const r=t>=5?5:t>=4?3:t>=2?2:1;for(let a=0;a<r;a++)this.projectile(n.x,n.y,s+(a-(r-1)/2)*.13,24,12+t*5,e,.18,Math.floor(t/2),1.4)}else if(e==="arcwand")this.projectile(n.x,n.y,s,15,16+t*8,e,.38+t*.04,0,1.5);else if(e==="scattergun"){const r=5+t*2;for(let a=0;a<r;a++)this.projectile(n.x,n.y,s+(a-(r-1)/2)*.12+Ht(-.025,.025),Ht(15,19),6+t*2.5,e,.17,0,.48);if(t>=5){for(let a=0;a<12;a++)this.projectile(n.x,n.y,a*Math.PI/6,15,9,e,.2,0,.42);this.effect({x:n.x,y:n.y,kind:"ring",life:.36,max:.36,color:16761469,size:4})}}else if(e==="chain"){const r=this.nearest(n.x,n.y,16);if(r){let a=n;const o=new Set;let l=r;for(let c=0;c<2+t&&l;c++)o.add(l.id),this.effect({x:a.x,y:a.y,x2:l.x,y2:l.y,kind:"zap",life:.22,max:.22,color:9297919,size:.2}),this.damage(l,15+t*7,e),t>=5&&(this.forNearby(l.x,l.y,2.4,h=>{h.hp>0&&h.id!==l.id&&Vt(h,l)<2.4**2&&this.damage(h,15,e)}),this.effect({x:l.x,y:l.y,kind:"ring",life:.24,max:.24,color:11924479,size:2.4})),a=l,l=this.nearest(a.x,a.y,6+t,o)}}else if(e==="comet"){const r=this.nearest(n.x,n.y,18),a=r?.x??n.x+Math.cos(s)*7,o=r?.y??n.y+Math.sin(s)*7;(t>=5?[[a,o],[a+Ht(-3,3),o+Ht(-3,3)],[a+Ht(-3,3),o+Ht(-3,3)]]:[[a,o]]).forEach(([c,h],u)=>{const f=2.5+t*.5;this.strikes.push({x:c,y:h,delay:.5+u*.18,radius:f,damage:38+t*22,source:"comet"}),this.effect({x:c,y:h,kind:"comet",life:.5+u*.18,max:.5+u*.18,color:16749934,size:f})})}e!=="orbit"&&this.onEvent?.("shoot")}updateWeapons(e){for(const t of this.slots){const n=this.weapons[t]||1;if(t==="orbit"){const r=2+n;for(let a=0;a<r;a++){const o=this.elapsed*(2.7+n*.15)+a*Math.PI*2/r,l=this.player.x+Math.cos(o)*(2.2+n*.2),c=this.player.y+Math.sin(o)*(2.2+n*.2);this.forNearby(l,c,1.1,h=>{const u=this.orbitHits.get(h.id)||0,f=h.x-l,g=h.y-c;h.hp>0&&f*f+g*g<(h.radius+.6)**2&&this.elapsed-u>.24&&(this.damage(h,8+n*5,t),this.orbitHits.set(h.id,this.elapsed))})}n>=5&&this.elapsed>=this.orbitPulse&&(this.orbitPulse=this.elapsed+2.8,this.forNearby(this.player.x,this.player.y,5.5,a=>{a.hp>0&&Vt(a,this.player)<5.5**2&&this.damage(a,34,t)}),this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.55,max:.55,color:16771498,size:5.5}));continue}const s=bt[t].cooldown*Math.pow(.88,n-1)*Math.pow(.92,this.passives.cooldown);this.cooldowns[t]=(this.cooldowns[t]||0)-e,(this.cooldowns[t]||0)<=0&&(this.fireWeapon(t),this.cooldowns[t]=s)}}pushEnemyShot(e){this.enemyShots.length<Vc&&this.enemyShots.push(e)}hurtPlayer(e,t){const n=this.player;return n.invuln>0?!1:(n.health=Math.max(0,n.health-e),n.invuln=t,this.effect({x:n.x,y:n.y,kind:"ring",life:.3,max:.3,color:16739458,size:1.7}),n.health<=0?(this.die(),!0):(this.onEvent?.("hurt"),!1))}spawnBossWave(){if(this.enemies.reduce((r,a)=>r+ +(a.hp>0&&a.kind==="boss"),0)>=wo)return;const t=this.elapsed<360?1:this.elapsed<540?2:3,n=t===1?0:t===2?2:4;for(;this.enemies.length>In-1-n;){let r=-1,a=-1;for(let o=0;o<this.enemies.length;o++){const l=this.enemies[o];if(l.hp<=0||l.kind==="boss"||l.elite)continue;const c=Vt(l,this.player);c>a&&(a=c,r=o)}if(r<0)break;this.enemies.splice(r,1)}if(this.enemies.length>=In)return;const s=this.spawnEnemy("boss");if(s){for(let r=0;r<n&&this.enemies.length<In;r++){const a=this.spawnEnemy(r%2?"cultist":"brute",!0);if(!a)break;const o=r*Math.PI*2/n;a.x=dt(s.x+Math.cos(o)*3.5,2,Ce-2),a.y=dt(s.y+Math.sin(o)*3.5,2,Ce-2),this.escortDebt++}this.onEvent?.("boss"),this.effect({x:this.player.x,y:this.player.y,kind:"text",life:1.5,max:1.5,color:16764805,size:3,text:s.tier===1?"MOLOCH RISES":s.tier===2?"ASCENDED MOLOCH":"MOLOCH UNBOUND"})}}addMarks(e,t,n,s,r){if(this.hazards.length+t>Hc)return!1;const a=this.player.x-e.x,o=this.player.y-e.y,l=Math.hypot(a,o)||1,c=-o/l,h=a/l;for(let u=0;u<t;u++){const f=(u-(t-1)/2)*3.6;this.hazards.push({x:dt(this.player.x+c*f,2,Ce-2),y:dt(this.player.y+h*f,2,Ce-2),radius:r==="hex"?2.2:2.4,delay:n,duration:n,damage:s,sourceId:e.id,kind:r})}return!0}updateHazards(e){const t=[];for(const n of this.hazards)if(this.enemies.some(s=>s.id===n.sourceId&&s.hp>0)){if(n.delay-=e,n.delay>0){t.push(n);continue}if(Vt(n,this.player)<(n.radius+.45)**2&&this.hurtPlayer(n.damage,.42)){this.hazards=t;return}this.effect({x:n.x,y:n.y,kind:"burst",life:.3,max:.3,color:n.kind==="hex"?16742872:16753252,size:n.radius})}this.hazards=t}update(e){if(this.dead||this.paused||this.awaitingReward)return;if(e=Math.min(e,.05),this.elapsed+=e,this.survivalClock+=e,this.survivalClock>=1&&(this.score+=2,this.survivalClock-=1),this.elapsed>=720&&!this.endless&&!this.cleared){this.cleared=!0,this.paused=!0;return}const t=this.player;t.invuln=Math.max(0,t.invuln-e),t.dash=Math.max(0,t.dash-e),t.dashCooldown=Math.max(0,t.dashCooldown-e),this.bombCharge=Math.min(this.bombRecharge,this.bombCharge+e);const n=t.speed*(1+this.passives.speed*.1)*(t.dash>0?3.3:1),s=this.move.x,r=this.move.y,a=Math.hypot(s,r),o=n*e;a>0&&(t.x=dt(t.x+s/a*o,1,Ce-1),t.y=dt(t.y+r/a*o,1,Ce-1));const l=this.firing?this.aim.x:s;Math.abs(l)>.15&&(this.facing=l<0?-1:1);for(const p of this.shrines)if(p.active&&Vt(p,t)<1.9**2){p.active=!1;const y=Math.min(25,t.maxHealth-t.health);t.health+=y,this.xp+=18,this.effect({x:p.x,y:p.y,kind:"ring",life:.8,max:.8,color:7667636,size:7}),this.effect({x:p.x,y:p.y,kind:"text",life:1.2,max:1.2,color:12255185,size:2,text:`HEAL +${Math.ceil(y)}  ·  XP +18`}),this.onEvent?.("heal")}const c=Math.floor(this.elapsed/90);c>this.bossWave&&(this.bossWave=c,this.spawnBossWave()),this.spawnClock+=e;const h=Math.min(In,70+Math.floor(this.elapsed*4.8)),u=1.2-.2*dt(this.elapsed/45,0,1);if(this.enemies.length<h&&this.spawnClock>=Math.max(.012,.14-this.elapsed*45e-5)*u){this.spawnClock=0;const p=Math.min(8,1+Math.floor(this.elapsed/35));for(let y=0;y<p;y++)this.escortDebt>0?this.escortDebt--:this.spawnEnemy(void 0,this.elapsed>40&&Math.random()<.025)}this.chestClock+=e,this.chestClock>36&&(this.chestClock=0,this.spawnEnemy("brute",!0));const f=[];let g=this.enemies.reduce((p,y)=>p+ +(y.special==="juggernaut"&&(y.specialState==="windup"||y.specialState==="charge")),0);for(const p of this.enemies){if(p.hp<=0)continue;p.flash=Math.max(0,p.flash-e);const y=t.x-p.x,A=t.y-p.y,w=Math.hypot(y,A)||1;if(Math.abs(y)>.2&&(p.facing=y<0?-1:1),p.special==="juggernaut"&&p.specialState!=="idle")p.knockX=0,p.knockY=0;else if(Math.abs(p.knockX)+Math.abs(p.knockY)>.02){p.x=dt(p.x+p.knockX*e,1,Ce-1),p.y=dt(p.y+p.knockY*e,1,Ce-1);const E=Math.max(0,1-e*9);p.knockX*=E,p.knockY*=E}let C=!0;if(p.special==="juggernaut")if(p.specialCd-=e,p.specialState==="windup"){if(C=!1,p.specialTimer-=e,p.specialTimer<=0){p.specialState="charge",p.specialTimer=.55;const E=Math.hypot(p.targetX-p.x,p.targetY-p.y)||1;p.chargeX=(p.targetX-p.x)/E,p.chargeY=(p.targetY-p.y)/E,p.chargeHit=!1}}else if(p.specialState==="charge"){C=!1;const E=p.x,v=p.y,T=Math.min(e,p.specialTimer)*14;if(p.x=dt(p.x+p.chargeX*T,1,Ce-1),p.y=dt(p.y+p.chargeY*T,1,Ce-1),!p.chargeHit&&Bc(t.x,t.y,E,v,p.x,p.y,p.radius+.55)&&(p.chargeHit=!0,this.hurtPlayer(24,.62)))return;p.specialTimer-=e,(p.specialTimer<=0||E===p.x&&v===p.y)&&(p.specialState="recovery",p.specialTimer=.65,g--)}else p.specialState==="recovery"?(C=!1,p.specialTimer-=e,p.specialTimer<=0&&(p.specialState="idle",p.specialCd=5.5)):p.specialCd<=0&&w>=4&&w<=12&&g<4&&(p.specialState="windup",p.specialTimer=.9,p.targetX=t.x,p.targetY=t.y,p.knockX=0,p.knockY=0,g++,C=!1);if(p.kind==="boss"&&p.bossCastTimer>0&&(p.bossCastTimer=Math.max(0,p.bossCastTimer-e),C=!1),C){const E=p.kind==="wisp"?Math.sin(this.elapsed*4+p.phase)*.48:0,v=p.kind==="cultist"?6:p.kind==="boss"?4.5:p.radius+.3;w>v&&(p.x=dt(p.x+(y/w-A/w*E)*p.speed*e,1,Ce-1),p.y=dt(p.y+(A/w+y/w*E)*p.speed*e,1,Ce-1))}if(p.special==="hexcaster")p.specialCd-=e,p.specialCd<=0&&w<14&&this.addMarks(p,1,1.2,18,"hex")&&(p.specialCd=4.5);else if((p.kind==="cultist"||p.kind==="boss")&&(p.attackCd-=e,p.attackCd<=0&&p.windup<=0&&p.bossCastTimer<=0&&w<17&&(p.attackCd=p.kind==="boss"?3.2:2.4+Math.random(),p.attackPhase++,p.kind==="boss"&&p.tier>1&&p.attackPhase%2===0&&this.addMarks(p,p.tier===2?3:5,p.tier===2?1.25:1.4,22,"boss")?p.bossCastTimer=p.tier===2?1.25:1.4:p.windup=p.kind==="boss"?.9:.55),p.windup>0&&(p.windup-=e,p.windup<=0))){const E=Math.atan2(t.y-p.y,t.x-p.x),v=p.kind==="boss",T=v?12:1;for(let N=0;N<T;N++){const D=v?N*Math.PI*2/T+this.elapsed*.12:E;this.pushEnemyShot({x:p.x,y:p.y,vx:Math.cos(D)*(v?7:9),vy:Math.sin(D)*(v?7:9),life:v?3.1:2.1,damage:v?16:8*p.openingScale,radius:v?.32:.23,boss:v})}if(v)for(let N=-1;N<=1;N++){const D=E+N*.22;this.pushEnemyShot({x:p.x,y:p.y,vx:Math.cos(D)*11,vy:Math.sin(D)*11,life:2.3,damage:14,radius:.28,boss:!0})}if(v&&p.attackPhase%3===0)for(let N=0;N<8;N++){const D=N*Math.PI/4+this.elapsed*.25;this.pushEnemyShot({x:p.x,y:p.y,vx:Math.cos(D)*4.8,vy:Math.sin(D)*4.8,life:5,damage:22,radius:.55,boss:!0})}}if((t.x-p.x)**2+(t.y-p.y)**2<(p.radius+.55)**2&&(p.special!=="juggernaut"||p.specialState==="idle")&&this.hurtPlayer(p.damage,.62))return;f.push(p)}if(this.enemies=f,this.updateHazards(e),this.dead)return;this.buildGrid(),this.updateBomb(e),this.updateWeapons(e);const x=[];for(const p of this.enemyShots)if(p.x+=p.vx*e,p.y+=p.vy*e,p.life-=e,!(p.life<=0)){if(Vt(p,t)<(p.radius+.55)**2){if(t.invuln<=0){if(t.health=Math.max(0,t.health-p.damage),t.invuln=.42,t.health<=0){this.die();return}this.onEvent?.("hurt")}continue}x.push(p)}this.enemyShots=x;const M=[];for(const p of this.strikes){if(p.delay-=e,p.delay>0){M.push(p);continue}this.forNearby(p.x,p.y,p.radius,y=>{y.hp>0&&Vt(y,p)<p.radius**2&&this.damage(y,p.damage,p.source)}),this.effect({x:p.x,y:p.y,kind:"ring",life:.45,max:.45,color:p.source==="comet"?16757624:12098303,size:p.radius}),this.effect({x:p.x,y:p.y,kind:"burst",life:.32,max:.32,color:p.source==="comet"?16747358:11247103,size:p.radius})}this.strikes=M;const m=[];for(const p of this.projectiles){if(p.x+=p.vx*e,p.y+=p.vy*e,p.life-=e,p.life<=0||p.x<0||p.x>Ce||p.y<0||p.y>Ce)continue;let y=!1;this.forNearby(p.x,p.y,p.radius+2.5,A=>{if(!(A.hp<=0||p.hit.has(A.id)||Vt(p,A)>(p.radius+A.radius)**2)){if(p.hit.add(A.id),this.damage(A,p.damage,p.kind),p.kind==="arcwand"){const w=1.4+(this.weapons.arcwand||1)*.36;this.forNearby(p.x,p.y,w,C=>{C.hp>0&&Vt(p,C)<w*w&&this.damage(C,p.damage*.45,p.kind)}),this.effect({x:p.x,y:p.y,kind:"ring",life:.26,max:.26,color:11574015,size:w}),(this.weapons.arcwand||1)>=5&&this.strikes.length<100&&(this.strikes.push({x:p.x,y:p.y,delay:.55,radius:3.3,damage:30,source:"arcwand"}),this.effect({x:p.x,y:p.y,kind:"comet",life:.55,max:.55,color:12822015,size:3.3}))}if(p.kind==="thornbow"&&(this.weapons.thornbow||1)>=5&&p.chain===0&&this.forNearby(A.x,A.y,3.6,w=>{w.hp>0&&w.id!==A.id&&Vt(w,A)<3.6**2&&(this.damage(w,p.damage*.45,"thornbow"),this.effect({x:A.x,y:A.y,x2:w.x,y2:w.y,kind:"zap",life:.24,max:.24,color:9435312,size:.2}))}),p.pierce--<=0)return y=!0,!0}}),y||m.push(p)}this.projectiles=m;const d=[],P=2.4+this.passives.magnet*1.2;for(const p of this.pickups){if(p.life-=e,p.life<=0)continue;const y=t.x-p.x,A=t.y-p.y,w=Math.hypot(y,A);if(w<P){const C=Math.min(w,(7+20/Math.max(.2,w))*e);p.x+=y/(w||1)*C,p.y+=A/(w||1)*C}if(w<.8)if(p.kind==="xp")this.xp+=p.value;else if(p.kind==="heart"){const C=Math.min(p.value,t.maxHealth-t.health);t.health+=C,this.effect({x:t.x,y:t.y,kind:"text",life:1,max:1,color:12255185,size:1,text:`FOOD +${Math.ceil(C)} HP`}),this.onEvent?.("heal")}else if(this.awaitingReward){d.push(p);continue}else this.stats.chests++,this.score+=120,this.openReward(!0),this.onEvent?.("chest");else d.push(p)}this.pickups=d;for(const p of this.effects)p.life-=e;this.effects=this.effects.filter(p=>p.life>0),this.xp>=this.xpNeeded&&!this.awaitingReward&&(this.xp-=this.xpNeeded,this.stats.level++,this.score+=40,this.xpNeeded=Math.floor(this.xpNeeded*1.28+5),this.openReward(!1),this.onEvent?.("level")),this.comboTime=Math.max(0,this.comboTime-e),this.comboTime||(this.combo=0),this.orbitHits.size>5e3&&this.orbitHits.clear()}openReward(e){this.awaitingReward=!0,this.onReward?.(this.rollRewards(e),e)}rollRewards(e){const t=[],n=Object.keys(bt);for(const a of n){const o=this.weapons[a]||0;o<5&&(o||this.slots.length<3||this.backpack.length<3)&&t.push({kind:"weapon",id:a,name:o?`${bt[a].name} +${o+1}`:bt[a].name,detail:o?`Rank ${o+1} · ${o>=3?"evolved strike":"power and cadence"}`:bt[a].desc,rarity:o>=3||e&&o>=2?"epic":o>=1?"rare":"common",icon:bt[a].icon})}for(const[a,o,l,c]of[["damage","Sharpened Steel","✦","All weapons deal +18% damage"],["speed","Fleetfoot Boots","➤","Move speed +10%"],["magnet","Vault Magnet","◎","Pull loot from farther away"],["vitality","Iron Heart","♥","Maximum health +20"],["cooldown","Quick Hands","⌁","Fire rate +8%"]])this.passives[a]<5&&t.push({kind:"passive",id:a,name:o,detail:c,rarity:this.passives[a]>=2?"rare":"common",icon:l});for(const[a,o,l]of[["radius","Bomb Radius","Blast wave grows by 12%"],["damage","Bomb Fury","Blast damage grows by 25%"],["recharge","Bomb Dynamo","Bomb recharges 12% faster"]])this.bombRanks[a]<5&&t.push({kind:"bomb",id:a,name:o,detail:l,rarity:this.bombRanks[a]>=2?"rare":"common",icon:"✷"});this.player.health<this.player.maxHealth*.7&&t.push({kind:"heal",id:"heal",name:"Second Wind",detail:"Restore 35 health now",rarity:"common",icon:"✚"});const s=[{kind:"boon",id:"resolve",name:"Endless Resolve",detail:"+10 maximum health and restore 25",rarity:"rare",icon:"♥"},{kind:"boon",id:"fury",name:"Everlasting Fury",detail:"All damage grows by another 6%",rarity:"rare",icon:"✦"},{kind:"boon",id:"haste",name:"Wild Momentum",detail:"Move speed grows by another 5%",rarity:"rare",icon:"➤"}];for(;t.length<3;)t.push(s.shift());const r=[];for(;r.length<3&&t.length;){const a=Math.floor(Math.random()*t.length);r.push(t.splice(a,1)[0])}if(e&&r.length){const a=r[Math.floor(Math.random()*r.length)];a.rarity==="common"&&(a.rarity="rare"),Math.random()<.28&&(a.rarity="epic")}return r}chooseReward(e){if(this.awaitingReward){if(e.kind==="weapon"){const t=e.id;this.weapons[t]||(this.slots.length<3?this.slots.push(t):this.backpack.length<3&&this.backpack.push(t)),this.weapons[t]=Math.min(5,(this.weapons[t]||0)+1)}else if(e.kind==="passive"){const t=e.id;this.passives[t]++,t==="vitality"&&(this.player.maxHealth+=20,this.player.health+=20)}else if(e.kind==="bomb"){const t=e.id;this.bombRanks[t]=Math.min(5,this.bombRanks[t]+1)}else e.kind==="boon"?e.id==="resolve"?(this.player.maxHealth+=10,this.player.health=Math.min(this.player.maxHealth,this.player.health+35)):e.id==="fury"?this.passives.damage+=1/3:this.passives.speed+=.5:this.player.health=Math.min(this.player.maxHealth,this.player.health+35);this.awaitingReward=!1}}swapBackpack(e,t){e<0||e>=this.backpack.length||t<0||t>=this.slots.length||([this.slots[t],this.backpack[e]]=[this.backpack[e],this.slots[t]])}stress(e){this.rankable=!1;const t=Math.min(Math.max(0,Math.floor(e)),In-this.enemies.length);for(let n=0;n<t;n++)this.spawnEnemy("rat")}defeatBossDebug(){this.rankable=!1;const e=this.enemies.find(t=>t.kind==="boss"&&t.hp>0);e&&this.damage(e,1e9,"thornbow")}demoEncounter(e){this.rankable=!1,this.elapsed=e==="juggernaut"?130:e==="hexcaster"?190:e==="ascended"?370:550,this.endless=e==="unbound",this.bossWave=Math.floor(this.elapsed/90),this.spawnClock=this.chestClock=-1e3,this.escortDebt=0,this.enemies=[],this.enemyShots=[],this.hazards=[],this.effects=[],this.projectiles=[],this.strikes=[],this.pickups=[],this.slots=[],this.awaitingReward=!1,this.cleared=!1,this.dead=!1,this.paused=!0,this.player.health=this.player.maxHealth,this.player.invuln=1e9;const t=e==="juggernaut"?this.spawnEnemy("brute",!0):e==="hexcaster"?this.spawnEnemy("cultist",!0):this.spawnEnemy("boss");return t&&(t.x=dt(this.player.x+(t.kind==="boss"?10:8),2,Ce-2),t.y=this.player.y,t.specialCd=0,t.attackCd=0,t.kind==="boss"&&(t.attackPhase=1)),this.buildGrid(),t}advanceDemo(e){if(!(this.rankable||!Number.isFinite(e))){this.paused=!1;for(let t=0,n=Math.min(300,Math.max(0,Math.ceil(e*60)));t<n&&!this.dead;t++)this.update(1/60);this.paused=!0}}}const so="180",Wc=0,Ro=1,Xc=2,Fl=1,qc=2,Mn=3,Hn=0,Dt=1,tn=2,On=0,Bi=1,Co=2,Po=3,Lo=4,Yc=5,Qn=100,$c=101,Kc=102,Zc=103,jc=104,Jc=200,Qc=201,eh=202,th=203,aa=204,oa=205,nh=206,ih=207,sh=208,rh=209,ah=210,oh=211,lh=212,ch=213,hh=214,la=0,ca=1,ha=2,zi=3,ua=4,da=5,fa=6,pa=7,Ol=0,uh=1,dh=2,Bn=0,fh=1,ph=2,mh=3,gh=4,_h=5,vh=6,xh=7,Bl=300,Hi=301,Vi=302,ma=303,ga=304,_r=306,ar=1e3,si=1001,_a=1002,Mt=1003,Mh=1004,Es=1005,cn=1006,br=1007,ri=1008,bn=1009,kl=1010,zl=1011,ds=1012,ro=1013,li=1014,hn=1015,vs=1016,ao=1017,oo=1018,fs=1020,Hl=35902,Vl=35899,Gl=1021,Wl=1022,sn=1023,ps=1026,ms=1027,lo=1028,co=1029,Xl=1030,ho=1031,uo=1033,js=33776,Js=33777,Qs=33778,er=33779,va=35840,xa=35841,Ma=35842,Sa=35843,ya=36196,Ea=37492,ba=37496,Ta=37808,Aa=37809,wa=37810,Ra=37811,Ca=37812,Pa=37813,La=37814,Da=37815,Ia=37816,Ua=37817,Na=37818,Fa=37819,Oa=37820,Ba=37821,ka=36492,za=36494,Ha=36495,Va=36283,Ga=36284,Wa=36285,Xa=36286,Sh=3200,yh=3201,Eh=0,bh=1,Nn="",ft="srgb",Gi="srgb-linear",or="linear",je="srgb",mi=7680,Do=519,Th=512,Ah=513,wh=514,ql=515,Rh=516,Ch=517,Ph=518,Lh=519,qa=35044,Io=35048,Uo="300 es",un=2e3,lr=2001;class Xi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tr=Math.PI/180,Ya=180/Math.PI;function kn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(yt[i&255]+yt[i>>8&255]+yt[i>>16&255]+yt[i>>24&255]+"-"+yt[e&255]+yt[e>>8&255]+"-"+yt[e>>16&15|64]+yt[e>>24&255]+"-"+yt[t&63|128]+yt[t>>8&255]+"-"+yt[t>>16&255]+yt[t>>24&255]+yt[n&255]+yt[n>>8&255]+yt[n>>16&255]+yt[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function Dh(i,e){return(i%e+e)%e}function Ar(i,e,t){return(1-t)*i+t*e}function on(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Je(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class He{constructor(e=0,t=0){He.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const f=r[a+0],g=r[a+1],x=r[a+2],M=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=g,e[t+2]=x,e[t+3]=M;return}if(u!==M||l!==f||c!==g||h!==x){let m=1-o;const d=l*f+c*g+h*x+u*M,P=d>=0?1:-1,p=1-d*d;if(p>Number.EPSILON){const A=Math.sqrt(p),w=Math.atan2(A,d*P);m=Math.sin(m*w)/A,o=Math.sin(o*w)/A}const y=o*P;if(l=l*m+f*y,c=c*m+g*y,h=h*m+x*y,u=u*m+M*y,m===1-o){const A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[a],f=r[a+1],g=r[a+2],x=r[a+3];return e[t]=o*x+h*u+l*g-c*f,e[t+1]=l*x+h*f+c*u-o*g,e[t+2]=c*x+h*g+o*f-l*u,e[t+3]=h*x-o*u-l*f-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(r/2),f=l(n/2),g=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"YXZ":this._x=f*h*u+c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"ZXY":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u-f*g*x;break;case"ZYX":this._x=f*h*u-c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u+f*g*x;break;case"YZX":this._x=f*h*u+c*g*x,this._y=c*g*u+f*h*x,this._z=c*h*x-f*g*u,this._w=c*h*u-f*g*x;break;case"XZY":this._x=f*h*u-c*g*x,this._y=c*g*u-f*h*x,this._z=c*h*x+f*g*u,this._w=c*h*u+f*g*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){const g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-l)*g,this._y=(r-c)*g,this._z=(a-s)*g}else if(n>o&&n>u){const g=2*Math.sqrt(1+n-o-u);this._w=(h-l)/g,this._x=.25*g,this._y=(s+a)/g,this._z=(r+c)/g}else if(o>u){const g=2*Math.sqrt(1+o-n-u);this._w=(r-c)/g,this._x=(s+a)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+u-n-o);this._w=(a-s)/g,this._x=(r+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const g=1-t;return this._w=g*a+t*this._w,this._x=g*n+t*this._x,this._y=g*s+t*this._y,this._z=g*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(e=0,t=0,n=0){B.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(No.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(No.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return wr.copy(this).projectOnVector(e),this.sub(wr)}reflect(e){return this.sub(wr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wr=new B,No=new xs;class Fe{constructor(e,t,n,s,r,a,o,l,c){Fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],g=n[5],x=n[8],M=s[0],m=s[3],d=s[6],P=s[1],p=s[4],y=s[7],A=s[2],w=s[5],C=s[8];return r[0]=a*M+o*P+l*A,r[3]=a*m+o*p+l*w,r[6]=a*d+o*y+l*C,r[1]=c*M+h*P+u*A,r[4]=c*m+h*p+u*w,r[7]=c*d+h*y+u*C,r[2]=f*M+g*P+x*A,r[5]=f*m+g*p+x*w,r[8]=f*d+g*y+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,g=c*r-a*l,x=t*u+n*f+s*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=u*M,e[1]=(s*c-h*n)*M,e[2]=(o*n-s*a)*M,e[3]=f*M,e[4]=(h*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=g*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Rr.makeScale(e,t)),this}rotate(e){return this.premultiply(Rr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Rr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Rr=new Fe;function Yl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function gs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ih(){const i=gs("canvas");return i.style.display="block",i}const Fo={};function _s(i){i in Fo||(Fo[i]=!0,console.warn(i))}function Uh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Oo=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bo=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nh(){const i={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===je&&(s.r=En(s.r),s.g=En(s.g),s.b=En(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===je&&(s.r=ki(s.r),s.g=ki(s.g),s.b=ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Nn?or:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return _s("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return _s("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gi]:{primaries:e,whitePoint:n,transfer:or,toXYZ:Oo,fromXYZ:Bo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ft},outputColorSpaceConfig:{drawingBufferColorSpace:ft}},[ft]:{primaries:e,whitePoint:n,transfer:je,toXYZ:Oo,fromXYZ:Bo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ft}}}),i}const We=Nh();function En(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let gi;class Fh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{gi===void 0&&(gi=gs("canvas")),gi.width=e.width,gi.height=e.height;const s=gi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=gi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=gs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=En(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(En(t[n]/255)*255):t[n]=En(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Oh=0;class fo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Cr(s[a].image)):r.push(Cr(s[a]))}else r=Cr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Cr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Bh=0;const Pr=new B;class xt extends Xi{constructor(e=xt.DEFAULT_IMAGE,t=xt.DEFAULT_MAPPING,n=si,s=si,r=cn,a=ri,o=sn,l=bn,c=xt.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=kn(),this.name="",this.source=new fo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Pr).x}get height(){return this.source.getSize(Pr).y}get depth(){return this.source.getSize(Pr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ar:e.x=e.x-Math.floor(e.x);break;case si:e.x=e.x<0?0:1;break;case _a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ar:e.y=e.y-Math.floor(e.y);break;case si:e.y=e.y<0?0:1;break;case _a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}xt.DEFAULT_IMAGE=null;xt.DEFAULT_MAPPING=Bl;xt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],g=l[5],x=l[9],M=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-M)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+M)<.1&&Math.abs(x+m)<.1&&Math.abs(c+g+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const p=(c+1)/2,y=(g+1)/2,A=(d+1)/2,w=(h+f)/4,C=(u+M)/4,O=(x+m)/4;return p>y&&p>A?p<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(p),s=w/n,r=C/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=O/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=C/r,s=O/r),this.set(n,s,r,t),this}let P=Math.sqrt((m-x)*(m-x)+(u-M)*(u-M)+(f-h)*(f-h));return Math.abs(P)<.001&&(P=1),this.x=(m-x)/P,this.y=(u-M)/P,this.z=(f-h)/P,this.w=Math.acos((c+g+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kh extends Xi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new xt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new fo(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends kh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class $l extends xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class zh extends xt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=si,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class di{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Kt):Kt.fromBufferAttribute(r,a),Kt.applyMatrix4(e.matrixWorld),this.expandByPoint(Kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),bs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),bs.copy(n.boundingBox)),bs.applyMatrix4(e.matrixWorld),this.union(bs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Kt),Kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zi),Ts.subVectors(this.max,Zi),_i.subVectors(e.a,Zi),vi.subVectors(e.b,Zi),xi.subVectors(e.c,Zi),wn.subVectors(vi,_i),Rn.subVectors(xi,vi),Xn.subVectors(_i,xi);let t=[0,-wn.z,wn.y,0,-Rn.z,Rn.y,0,-Xn.z,Xn.y,wn.z,0,-wn.x,Rn.z,0,-Rn.x,Xn.z,0,-Xn.x,-wn.y,wn.x,0,-Rn.y,Rn.x,0,-Xn.y,Xn.x,0];return!Lr(t,_i,vi,xi,Ts)||(t=[1,0,0,0,1,0,0,0,1],!Lr(t,_i,vi,xi,Ts))?!1:(As.crossVectors(wn,Rn),t=[As.x,As.y,As.z],Lr(t,_i,vi,xi,Ts))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const mn=[new B,new B,new B,new B,new B,new B,new B,new B],Kt=new B,bs=new di,_i=new B,vi=new B,xi=new B,wn=new B,Rn=new B,Xn=new B,Zi=new B,Ts=new B,As=new B,qn=new B;function Lr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){qn.fromArray(i,r);const o=s.x*Math.abs(qn.x)+s.y*Math.abs(qn.y)+s.z*Math.abs(qn.z),l=e.dot(qn),c=t.dot(qn),h=n.dot(qn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Hh=new di,ji=new B,Dr=new B;class qi{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Hh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ji.subVectors(e,this.center);const t=ji.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ji,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Dr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ji.copy(e.center).add(Dr)),this.expandByPoint(ji.copy(e.center).sub(Dr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const gn=new B,Ir=new B,ws=new B,Cn=new B,Ur=new B,Rs=new B,Nr=new B;class Kl{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gn.copy(this.origin).addScaledVector(this.direction,t),gn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ir.copy(e).add(t).multiplyScalar(.5),ws.copy(t).sub(e).normalize(),Cn.copy(this.origin).sub(Ir);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ws),o=Cn.dot(this.direction),l=-Cn.dot(ws),c=Cn.lengthSq(),h=Math.abs(1-a*a);let u,f,g,x;if(h>0)if(u=a*l-o,f=a*o-l,x=r*h,u>=0)if(f>=-x)if(f<=x){const M=1/h;u*=M,f*=M,g=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;else f<=-x?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),g=-u*u+f*(f+2*l)+c):f<=x?(u=0,f=Math.min(Math.max(-r,-l),r),g=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),g=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),g=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ir).addScaledVector(ws,f),g}intersectSphere(e,t){gn.subVectors(e.center,this.origin);const n=gn.dot(this.direction),s=gn.dot(gn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,gn)!==null}intersectTriangle(e,t,n,s,r){Ur.subVectors(t,e),Rs.subVectors(n,e),Nr.crossVectors(Ur,Rs);let a=this.direction.dot(Nr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Cn.subVectors(this.origin,e);const l=o*this.direction.dot(Rs.crossVectors(Cn,Rs));if(l<0)return null;const c=o*this.direction.dot(Ur.cross(Cn));if(c<0||l+c>a)return null;const h=-o*Cn.dot(Nr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,n,s,r,a,o,l,c,h,u,f,g,x,M,m){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,u,f,g,x,M,m)}set(e,t,n,s,r,a,o,l,c,h,u,f,g,x,M,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=g,d[7]=x,d[11]=M,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Mi.setFromMatrixColumn(e,0).length(),r=1/Mi.setFromMatrixColumn(e,1).length(),a=1/Mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,g=a*u,x=o*h,M=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=g+x*c,t[5]=f-M*c,t[9]=-o*l,t[2]=M-f*c,t[6]=x+g*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,g=l*u,x=c*h,M=c*u;t[0]=f+M*o,t[4]=x*o-g,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=g*o-x,t[6]=M+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,g=l*u,x=c*h,M=c*u;t[0]=f-M*o,t[4]=-a*u,t[8]=x+g*o,t[1]=g+x*o,t[5]=a*h,t[9]=M-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,g=a*u,x=o*h,M=o*u;t[0]=l*h,t[4]=x*c-g,t[8]=f*c+M,t[1]=l*u,t[5]=M*c+f,t[9]=g*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,g=a*c,x=o*l,M=o*c;t[0]=l*h,t[4]=M-f*u,t[8]=x*u+g,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=g*u+x,t[10]=f-M*u}else if(e.order==="XZY"){const f=a*l,g=a*c,x=o*l,M=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+M,t[5]=a*h,t[9]=g*u-x,t[2]=x*u-g,t[6]=o*h,t[10]=M*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Vh,e,Gh)}lookAt(e,t,n){const s=this.elements;return Nt.subVectors(e,t),Nt.lengthSq()===0&&(Nt.z=1),Nt.normalize(),Pn.crossVectors(n,Nt),Pn.lengthSq()===0&&(Math.abs(n.z)===1?Nt.x+=1e-4:Nt.z+=1e-4,Nt.normalize(),Pn.crossVectors(n,Nt)),Pn.normalize(),Cs.crossVectors(Nt,Pn),s[0]=Pn.x,s[4]=Cs.x,s[8]=Nt.x,s[1]=Pn.y,s[5]=Cs.y,s[9]=Nt.y,s[2]=Pn.z,s[6]=Cs.z,s[10]=Nt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],g=n[13],x=n[2],M=n[6],m=n[10],d=n[14],P=n[3],p=n[7],y=n[11],A=n[15],w=s[0],C=s[4],O=s[8],E=s[12],v=s[1],T=s[5],N=s[9],D=s[13],Y=s[2],G=s[6],W=s[10],Z=s[14],V=s[3],se=s[7],ae=s[11],le=s[15];return r[0]=a*w+o*v+l*Y+c*V,r[4]=a*C+o*T+l*G+c*se,r[8]=a*O+o*N+l*W+c*ae,r[12]=a*E+o*D+l*Z+c*le,r[1]=h*w+u*v+f*Y+g*V,r[5]=h*C+u*T+f*G+g*se,r[9]=h*O+u*N+f*W+g*ae,r[13]=h*E+u*D+f*Z+g*le,r[2]=x*w+M*v+m*Y+d*V,r[6]=x*C+M*T+m*G+d*se,r[10]=x*O+M*N+m*W+d*ae,r[14]=x*E+M*D+m*Z+d*le,r[3]=P*w+p*v+y*Y+A*V,r[7]=P*C+p*T+y*G+A*se,r[11]=P*O+p*N+y*W+A*ae,r[15]=P*E+p*D+y*Z+A*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],g=e[14],x=e[3],M=e[7],m=e[11],d=e[15];return x*(+r*l*u-s*c*u-r*o*f+n*c*f+s*o*g-n*l*g)+M*(+t*l*g-t*c*f+r*a*f-s*a*g+s*c*h-r*l*h)+m*(+t*c*u-t*o*g-r*a*u+n*a*g+r*o*h-n*c*h)+d*(-s*o*h-t*l*u+t*o*f+s*a*u-n*a*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],g=e[11],x=e[12],M=e[13],m=e[14],d=e[15],P=u*m*c-M*f*c+M*l*g-o*m*g-u*l*d+o*f*d,p=x*f*c-h*m*c-x*l*g+a*m*g+h*l*d-a*f*d,y=h*M*c-x*u*c+x*o*g-a*M*g-h*o*d+a*u*d,A=x*u*l-h*M*l-x*o*f+a*M*f+h*o*m-a*u*m,w=t*P+n*p+s*y+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/w;return e[0]=P*C,e[1]=(M*f*r-u*m*r-M*s*g+n*m*g+u*s*d-n*f*d)*C,e[2]=(o*m*r-M*l*r+M*s*c-n*m*c-o*s*d+n*l*d)*C,e[3]=(u*l*r-o*f*r-u*s*c+n*f*c+o*s*g-n*l*g)*C,e[4]=p*C,e[5]=(h*m*r-x*f*r+x*s*g-t*m*g-h*s*d+t*f*d)*C,e[6]=(x*l*r-a*m*r-x*s*c+t*m*c+a*s*d-t*l*d)*C,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*g+t*l*g)*C,e[8]=y*C,e[9]=(x*u*r-h*M*r-x*n*g+t*M*g+h*n*d-t*u*d)*C,e[10]=(a*M*r-x*o*r+x*n*c-t*M*c-a*n*d+t*o*d)*C,e[11]=(h*o*r-a*u*r-h*n*c+t*u*c+a*n*g-t*o*g)*C,e[12]=A*C,e[13]=(h*M*s-x*u*s+x*n*f-t*M*f-h*n*m+t*u*m)*C,e[14]=(x*o*s-a*M*s-x*n*l+t*M*l+a*n*m-t*o*m)*C,e[15]=(a*u*s-h*o*s+h*n*l-t*u*l-a*n*f+t*o*f)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,g=r*h,x=r*u,M=a*h,m=a*u,d=o*u,P=l*c,p=l*h,y=l*u,A=n.x,w=n.y,C=n.z;return s[0]=(1-(M+d))*A,s[1]=(g+y)*A,s[2]=(x-p)*A,s[3]=0,s[4]=(g-y)*w,s[5]=(1-(f+d))*w,s[6]=(m+P)*w,s[7]=0,s[8]=(x+p)*C,s[9]=(m-P)*C,s[10]=(1-(f+M))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Mi.set(s[0],s[1],s[2]).length();const a=Mi.set(s[4],s[5],s[6]).length(),o=Mi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Zt.copy(this);const c=1/r,h=1/a,u=1/o;return Zt.elements[0]*=c,Zt.elements[1]*=c,Zt.elements[2]*=c,Zt.elements[4]*=h,Zt.elements[5]*=h,Zt.elements[6]*=h,Zt.elements[8]*=u,Zt.elements[9]*=u,Zt.elements[10]*=u,t.setFromRotationMatrix(Zt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=un,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),g=(n+s)/(n-s);let x,M;if(l)x=r/(a-r),M=a*r/(a-r);else if(o===un)x=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===lr)x=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=un,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),g=-(n+s)/(n-s);let x,M;if(l)x=1/(a-r),M=a/(a-r);else if(o===un)x=-2/(a-r),M=-(a+r)/(a-r);else if(o===lr)x=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=x,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Mi=new B,Zt=new st,Vh=new B(0,0,0),Gh=new B(1,1,1),Pn=new B,Cs=new B,Nt=new B,ko=new st,zo=new xs;class Tn{constructor(e=0,t=0,n=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,g),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ko.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ko,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zo.setFromEuler(this),this.setFromQuaternion(zo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class Zl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Wh=0;const Ho=new B,Si=new xs,_n=new st,Ps=new B,Ji=new B,Xh=new B,qh=new xs,Vo=new B(1,0,0),Go=new B(0,1,0),Wo=new B(0,0,1),Xo={type:"added"},Yh={type:"removed"},yi={type:"childadded",child:null},Fr={type:"childremoved",child:null};class Tt extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new B,t=new Tn,n=new xs,s=new B(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new st},normalMatrix:{value:new Fe}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(Vo,e)}rotateY(e){return this.rotateOnAxis(Go,e)}rotateZ(e){return this.rotateOnAxis(Wo,e)}translateOnAxis(e,t){return Ho.copy(e).applyQuaternion(this.quaternion),this.position.add(Ho.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vo,e)}translateY(e){return this.translateOnAxis(Go,e)}translateZ(e){return this.translateOnAxis(Wo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ps.copy(e):Ps.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Ji,Ps,this.up):_n.lookAt(Ps,Ji,this.up),this.quaternion.setFromRotationMatrix(_n),s&&(_n.extractRotation(s.matrixWorld),Si.setFromRotationMatrix(_n),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xo),yi.child=e,this.dispatchEvent(yi),yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Yh),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xo),yi.child=e,this.dispatchEvent(yi),yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,e,Xh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,qh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),g=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Tt.DEFAULT_UP=new B(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jt=new B,vn=new B,Or=new B,xn=new B,Ei=new B,bi=new B,qo=new B,Br=new B,kr=new B,zr=new B,Hr=new ht,Vr=new ht,Gr=new ht;class Xt{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jt.subVectors(e,t),s.cross(jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jt.subVectors(s,t),vn.subVectors(n,t),Or.subVectors(e,t);const a=jt.dot(jt),o=jt.dot(vn),l=jt.dot(Or),c=vn.dot(vn),h=vn.dot(Or),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,g=(c*l-o*h)*f,x=(a*h-o*l)*f;return r.set(1-g-x,x,g)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,xn.x),l.addScaledVector(a,xn.y),l.addScaledVector(o,xn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Hr.setScalar(0),Vr.setScalar(0),Gr.setScalar(0),Hr.fromBufferAttribute(e,t),Vr.fromBufferAttribute(e,n),Gr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Hr,r.x),a.addScaledVector(Vr,r.y),a.addScaledVector(Gr,r.z),a}static isFrontFacing(e,t,n,s){return jt.subVectors(n,t),vn.subVectors(e,t),jt.cross(vn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jt.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),jt.cross(vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Xt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Xt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Xt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Xt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Xt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ei.subVectors(s,n),bi.subVectors(r,n),Br.subVectors(e,n);const l=Ei.dot(Br),c=bi.dot(Br);if(l<=0&&c<=0)return t.copy(n);kr.subVectors(e,s);const h=Ei.dot(kr),u=bi.dot(kr);if(h>=0&&u<=h)return t.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ei,a);zr.subVectors(e,r);const g=Ei.dot(zr),x=bi.dot(zr);if(x>=0&&g<=x)return t.copy(r);const M=g*c-l*x;if(M<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(bi,o);const m=h*x-g*u;if(m<=0&&u-h>=0&&g-x>=0)return qo.subVectors(r,s),o=(u-h)/(u-h+(g-x)),t.copy(s).addScaledVector(qo,o);const d=1/(m+M+f);return a=M*d,o=f*d,t.copy(n).addScaledVector(Ei,a).addScaledVector(bi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const jl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ln={h:0,s:0,l:0},Ls={h:0,s:0,l:0};function Wr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=We.workingColorSpace){if(e=Dh(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Wr(a,r,e+1/3),this.g=Wr(a,r,e),this.b=Wr(a,r,e-1/3)}return We.colorSpaceToWorking(this,s),this}setStyle(e,t=ft){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ft){const n=jl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=En(e.r),this.g=En(e.g),this.b=En(e.b),this}copyLinearToSRGB(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ft){return We.workingToColorSpace(Et.copy(this),e),Math.round(ze(Et.r*255,0,255))*65536+Math.round(ze(Et.g*255,0,255))*256+Math.round(ze(Et.b*255,0,255))}getHexString(e=ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(Et.copy(this),t);const n=Et.r,s=Et.g,r=Et.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(Et.copy(this),t),e.r=Et.r,e.g=Et.g,e.b=Et.b,e}getStyle(e=ft){We.workingToColorSpace(Et.copy(this),e);const t=Et.r,n=Et.g,s=Et.b;return e!==ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ln),this.setHSL(Ln.h+e,Ln.s+t,Ln.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ln),e.getHSL(Ls);const n=Ar(Ln.h,Ls.h,t),s=Ar(Ln.s,Ls.s,t),r=Ar(Ln.l,Ls.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Et=new Xe;Xe.NAMES=jl;let $h=0;class Yi extends Xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=kn(),this.name="",this.type="Material",this.blending=Bi,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=aa,this.blendDst=oa,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Do,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bi&&(n.blending=this.blending),this.side!==Hn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==aa&&(n.blendSrc=this.blendSrc),this.blendDst!==oa&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Do&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Sn extends Yi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ut=new B,Ds=new He;let Kh=0;class Yt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Kh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=qa,this.updateRanges=[],this.gpuType=hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ds.fromBufferAttribute(this,t),Ds.applyMatrix3(e),this.setXY(t,Ds.x,Ds.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix3(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix4(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyNormalMatrix(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.transformDirection(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=on(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=on(t,this.array)),t}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=on(t,this.array)),t}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=on(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=on(t,this.array)),t}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array),r=Je(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==qa&&(e.usage=this.usage),e}}class Jl extends Yt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ql extends Yt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class zn extends Yt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Zh=0;const Gt=new st,Xr=new Tt,Ti=new B,Ft=new di,Qi=new di,_t=new B;class fn extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Yl(e)?Ql:Jl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Fe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,n){return Gt.makeTranslation(e,t,n),this.applyMatrix4(Gt),this}scale(e,t,n){return Gt.makeScale(e,t,n),this.applyMatrix4(Gt),this}lookAt(e){return Xr.lookAt(e),Xr.updateMatrix(),this.applyMatrix4(Xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new zn(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new di);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ft.setFromBufferAttribute(r),this.morphTargetsRelative?(_t.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(_t),_t.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(_t)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const n=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(_t.addVectors(Ft.min,Qi.min),Ft.expandByPoint(_t),_t.addVectors(Ft.max,Qi.max),Ft.expandByPoint(_t)):(Ft.expandByPoint(Qi.min),Ft.expandByPoint(Qi.max))}Ft.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)_t.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(_t));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)_t.fromBufferAttribute(o,c),l&&(Ti.fromBufferAttribute(e,c),_t.add(Ti)),s=Math.max(s,n.distanceToSquared(_t))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let O=0;O<n.count;O++)o[O]=new B,l[O]=new B;const c=new B,h=new B,u=new B,f=new He,g=new He,x=new He,M=new B,m=new B;function d(O,E,v){c.fromBufferAttribute(n,O),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,v),f.fromBufferAttribute(r,O),g.fromBufferAttribute(r,E),x.fromBufferAttribute(r,v),h.sub(c),u.sub(c),g.sub(f),x.sub(f);const T=1/(g.x*x.y-x.x*g.y);isFinite(T)&&(M.copy(h).multiplyScalar(x.y).addScaledVector(u,-g.y).multiplyScalar(T),m.copy(u).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(T),o[O].add(M),o[E].add(M),o[v].add(M),l[O].add(m),l[E].add(m),l[v].add(m))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let O=0,E=P.length;O<E;++O){const v=P[O],T=v.start,N=v.count;for(let D=T,Y=T+N;D<Y;D+=3)d(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const p=new B,y=new B,A=new B,w=new B;function C(O){A.fromBufferAttribute(s,O),w.copy(A);const E=o[O];p.copy(E),p.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(w,E);const T=y.dot(l[O])<0?-1:1;a.setXYZW(O,p.x,p.y,p.z,T)}for(let O=0,E=P.length;O<E;++O){const v=P[O],T=v.start,N=v.count;for(let D=T,Y=T+N;D<Y;D+=3)C(e.getX(D+0)),C(e.getX(D+1)),C(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Yt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);const s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,h=new B,u=new B;if(e)for(let f=0,g=e.count;f<g;f+=3){const x=e.getX(f+0),M=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,g=t.count;f<g;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)_t.fromBufferAttribute(e,t),_t.normalize(),e.setXYZ(t,_t.x,_t.y,_t.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let g=0,x=0;for(let M=0,m=l.length;M<m;M++){o.isInterleavedBufferAttribute?g=l[M]*o.data.stride+o.offset:g=l[M]*h;for(let d=0;d<h;d++)f[x++]=c[g++]}return new Yt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new fn,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],g=e(f,n);l.push(g)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const g=c[u];h.push(g.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,g=u.length;f<g;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Yo=new st,Yn=new Kl,Is=new qi,$o=new B,Us=new B,Ns=new B,Fs=new B,qr=new B,Os=new B,Ko=new B,Bs=new B;class Ct extends Tt{constructor(e=new fn,t=new Sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Os.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(qr.fromBufferAttribute(u,e),a?Os.addScaledVector(qr,h):Os.addScaledVector(qr.sub(t),h))}t.add(Os)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Is.copy(n.boundingSphere),Is.applyMatrix4(r),Yn.copy(e.ray).recast(e.near),!(Is.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(Is,$o)===null||Yn.origin.distanceToSquared($o)>(e.far-e.near)**2))&&(Yo.copy(r).invert(),Yn.copy(e.ray).applyMatrix4(Yo),!(n.boundingBox!==null&&Yn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Yn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,g=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,M=f.length;x<M;x++){const m=f[x],d=a[m.materialIndex],P=Math.max(m.start,g.start),p=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let y=P,A=p;y<A;y+=3){const w=o.getX(y),C=o.getX(y+1),O=o.getX(y+2);s=ks(this,d,e,n,c,h,u,w,C,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,g.start),M=Math.min(o.count,g.start+g.count);for(let m=x,d=M;m<d;m+=3){const P=o.getX(m),p=o.getX(m+1),y=o.getX(m+2);s=ks(this,a,e,n,c,h,u,P,p,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,M=f.length;x<M;x++){const m=f[x],d=a[m.materialIndex],P=Math.max(m.start,g.start),p=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let y=P,A=p;y<A;y+=3){const w=y,C=y+1,O=y+2;s=ks(this,d,e,n,c,h,u,w,C,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,g.start),M=Math.min(l.count,g.start+g.count);for(let m=x,d=M;m<d;m+=3){const P=m,p=m+1,y=m+2;s=ks(this,a,e,n,c,h,u,P,p,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function jh(i,e,t,n,s,r,a,o){let l;if(e.side===Dt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Hn,o),l===null)return null;Bs.copy(o),Bs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Bs);return c<t.near||c>t.far?null:{distance:c,point:Bs.clone(),object:i}}function ks(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Us),i.getVertexPosition(l,Ns),i.getVertexPosition(c,Fs);const h=jh(i,e,t,n,Us,Ns,Fs,Ko);if(h){const u=new B;Xt.getBarycoord(Ko,Us,Ns,Fs,u),s&&(h.uv=Xt.getInterpolatedAttribute(s,o,l,c,u,new He)),r&&(h.uv1=Xt.getInterpolatedAttribute(r,o,l,c,u,new He)),a&&(h.normal=Xt.getInterpolatedAttribute(a,o,l,c,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new B,materialIndex:0};Xt.getNormal(Us,Ns,Fs,f.normal),h.face=f,h.barycoord=u}return h}class Ms extends fn{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,g=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new zn(c,3)),this.setAttribute("normal",new zn(h,3)),this.setAttribute("uv",new zn(u,2));function x(M,m,d,P,p,y,A,w,C,O,E){const v=y/C,T=A/O,N=y/2,D=A/2,Y=w/2,G=C+1,W=O+1;let Z=0,V=0;const se=new B;for(let ae=0;ae<W;ae++){const le=ae*T-D;for(let we=0;we<G;we++){const qe=we*v-N;se[M]=qe*P,se[m]=le*p,se[d]=Y,c.push(se.x,se.y,se.z),se[M]=0,se[m]=0,se[d]=w>0?1:-1,h.push(se.x,se.y,se.z),u.push(we/C),u.push(1-ae/O),Z+=1}}for(let ae=0;ae<O;ae++)for(let le=0;le<C;le++){const we=f+le+G*ae,qe=f+le+G*(ae+1),Ke=f+(le+1)+G*(ae+1),Ye=f+(le+1)+G*ae;l.push(we,qe,Ye),l.push(qe,Ke,Ye),V+=6}o.addGroup(g,V,E),g+=V,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ms(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Rt(i){const e={};for(let t=0;t<i.length;t++){const n=Wi(i[t]);for(const s in n)e[s]=n[s]}return e}function Jh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ec(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}const Qh={clone:Wi,merge:Rt};var eu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends Yi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=eu,this.fragmentShader=tu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=Jh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class tc extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Dn=new B,Zo=new He,jo=new He;class en extends tc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ya*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ya*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Dn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Dn.x,Dn.y).multiplyScalar(-e/Dn.z),Dn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Dn.x,Dn.y).multiplyScalar(-e/Dn.z)}getViewSize(e,t){return this.getViewBounds(e,Zo,jo),t.subVectors(jo,Zo)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ai=-90,wi=1;class nu extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new en(Ai,wi,e,t);s.layers=this.layers,this.add(s);const r=new en(Ai,wi,e,t);r.layers=this.layers,this.add(r);const a=new en(Ai,wi,e,t);a.layers=this.layers,this.add(a);const o=new en(Ai,wi,e,t);o.layers=this.layers,this.add(o);const l=new en(Ai,wi,e,t);l.layers=this.layers,this.add(l);const c=new en(Ai,wi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,g),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class nc extends xt{constructor(e=[],t=Hi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class iu extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new nc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ms(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:On});r.uniforms.tEquirect.value=t;const a=new Ct(s,r),o=t.minFilter;return t.minFilter===ri&&(t.minFilter=cn),new nu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class zs extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const su={type:"move"};class Yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const m=t.getJointPose(M,n),d=this._getHandJoint(c,M);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),g=.02,x=.005;c.inputState.pinching&&f>g+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=g-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(su)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new zs;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class ru extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class au{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=qa,this.updateRanges=[],this.version=0,this.uuid=kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const wt=new B;class cr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=on(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=on(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=on(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=on(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=on(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array),r=Je(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Yt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new cr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ic extends Yi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ri;const es=new B,Ci=new B,Pi=new B,Li=new He,ts=new He,sc=new st,Hs=new B,ns=new B,Vs=new B,Jo=new He,$r=new He,Qo=new He;class el extends Tt{constructor(e=new ic){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new fn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new au(t,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new cr(n,3,0,!1)),Ri.setAttribute("uv",new cr(n,2,3,!1))}this.geometry=Ri,this.material=e,this.center=new He(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),sc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Pi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Pi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Gs(Hs.set(-.5,-.5,0),Pi,a,Ci,s,r),Gs(ns.set(.5,-.5,0),Pi,a,Ci,s,r),Gs(Vs.set(.5,.5,0),Pi,a,Ci,s,r),Jo.set(0,0),$r.set(1,0),Qo.set(1,1);let o=e.ray.intersectTriangle(Hs,ns,Vs,!1,es);if(o===null&&(Gs(ns.set(-.5,.5,0),Pi,a,Ci,s,r),$r.set(0,1),o=e.ray.intersectTriangle(Hs,Vs,ns,!1,es),o===null))return;const l=e.ray.origin.distanceTo(es);l<e.near||l>e.far||t.push({distance:l,point:es.clone(),uv:Xt.getInterpolation(es,Hs,ns,Vs,Jo,$r,Qo,new He),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Gs(i,e,t,n,s,r){Li.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ts.x=r*Li.x-s*Li.y,ts.y=s*Li.x+r*Li.y):ts.copy(Li),i.copy(e),i.x+=ts.x,i.y+=ts.y,i.applyMatrix4(sc)}class ou extends xt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Mt,h=Mt,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class tl extends Yt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Di=new st,nl=new st,Ws=[],il=new di,lu=new st,is=new Ct,ss=new qi;class rs extends Ct{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new tl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,lu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new di),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),il.copy(e.boundingBox).applyMatrix4(Di),this.boundingBox.union(il)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new qi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),ss.copy(e.boundingSphere).applyMatrix4(Di),this.boundingSphere.union(ss)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),e.ray.intersectsSphere(ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Di),nl.multiplyMatrices(n,Di),is.matrixWorld=nl,is.raycast(e,Ws);for(let a=0,o=Ws.length;a<o;a++){const l=Ws[a];l.instanceId=r,l.object=this,t.push(l)}Ws.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new tl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ou(new Float32Array(s*this.count),s,this.count,lo,hn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Kr=new B,cu=new B,hu=new Fe;class jn{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Kr.subVectors(n,t).cross(cu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Kr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||hu.getNormalMatrix(e),s=this.coplanarPoint(Kr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new qi,uu=new He(.5,.5),Xs=new B;class rc{constructor(e=new jn,t=new jn,n=new jn,s=new jn,r=new jn,a=new jn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=un,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],g=r[7],x=r[8],M=r[9],m=r[10],d=r[11],P=r[12],p=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,g-h,d-x,A-P).normalize(),s[1].setComponents(c+a,g+h,d+x,A+P).normalize(),s[2].setComponents(c+o,g+u,d+M,A+p).normalize(),s[3].setComponents(c-o,g-u,d-M,A-p).normalize(),n)s[4].setComponents(l,f,m,y).normalize(),s[5].setComponents(c-l,g-f,d-m,A-y).normalize();else if(s[4].setComponents(c-l,g-f,d-m,A-y).normalize(),t===un)s[5].setComponents(c+l,g+f,d+m,A+y).normalize();else if(t===lr)s[5].setComponents(l,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(e){$n.center.set(0,0,0);const t=uu.distanceTo(e.center);return $n.radius=.7071067811865476+t,$n.applyMatrix4(e.matrixWorld),this.intersectsSphere($n)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Xs.x=s.normal.x>0?e.max.x:e.min.x,Xs.y=s.normal.y>0?e.max.y:e.min.y,Xs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ac extends Yi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const hr=new B,ur=new B,sl=new st,as=new Kl,qs=new qi,Zr=new B,rl=new B;class du extends Tt{constructor(e=new fn,t=new ac){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)hr.fromBufferAttribute(t,s-1),ur.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=hr.distanceTo(ur);e.setAttribute("lineDistance",new zn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(s),qs.radius+=r,e.ray.intersectsSphere(qs)===!1)return;sl.copy(s).invert(),as.copy(e.ray).applyMatrix4(sl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const g=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let M=g,m=x-1;M<m;M+=c){const d=h.getX(M),P=h.getX(M+1),p=Ys(this,e,as,l,d,P,M);p&&t.push(p)}if(this.isLineLoop){const M=h.getX(x-1),m=h.getX(g),d=Ys(this,e,as,l,M,m,x-1);d&&t.push(d)}}else{const g=Math.max(0,a.start),x=Math.min(f.count,a.start+a.count);for(let M=g,m=x-1;M<m;M+=c){const d=Ys(this,e,as,l,M,M+1,M);d&&t.push(d)}if(this.isLineLoop){const M=Ys(this,e,as,l,x-1,g,x-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ys(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(hr.fromBufferAttribute(o,s),ur.fromBufferAttribute(o,r),t.distanceSqToSegment(hr,ur,Zr,rl)>n)return;Zr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Zr);if(!(c<e.near||c>e.far))return{distance:c,point:rl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class al extends du{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class tr extends xt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class oc extends xt{constructor(e,t,n=li,s,r,a,o=Mt,l=Mt,c,h=ps,u=1){if(h!==ps&&h!==ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new fo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class lc extends xt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Jt extends fn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,g=[],x=[],M=[],m=[];for(let d=0;d<h;d++){const P=d*f-a;for(let p=0;p<c;p++){const y=p*u-r;x.push(y,-P,0),M.push(0,0,1),m.push(p/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let P=0;P<o;P++){const p=P+c*d,y=P+c*(d+1),A=P+1+c*(d+1),w=P+1+c*d;g.push(p,y,w),g.push(y,A,w)}this.setIndex(g),this.setAttribute("position",new zn(x,3)),this.setAttribute("normal",new zn(M,3)),this.setAttribute("uv",new zn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jt(e.width,e.height,e.widthSegments,e.heightSegments)}}class fu extends Yi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pu extends Yi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const jr={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class mu{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const g=c[u],x=c[u+1];if(g.global&&(g.lastIndex=0),g.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const gu=new mu;class po{constructor(e){this.manager=e!==void 0?e:gu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}po.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ii=new WeakMap;class _u extends po{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=jr.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Ii.get(a);u===void 0&&(u=[],Ii.set(a,u)),u.push({onLoad:t,onError:s})}return a}const o=gs("img");function l(){h(),t&&t(this);const u=Ii.get(this)||[];for(let f=0;f<u.length;f++){const g=u[f];g.onLoad&&g.onLoad(this)}Ii.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),jr.remove(`image:${e}`);const f=Ii.get(this)||[];for(let g=0;g<f.length;g++){const x=f[g];x.onError&&x.onError(u)}Ii.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),jr.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class cc extends po{constructor(e){super(e)}load(e,t,n,s){const r=new xt,a=new _u(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class hc extends tc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class vu extends en{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function ol(i,e,t,n){const s=xu(n);switch(t){case Gl:return i*e;case lo:return i*e/s.components*s.byteLength;case co:return i*e/s.components*s.byteLength;case Xl:return i*e*2/s.components*s.byteLength;case ho:return i*e*2/s.components*s.byteLength;case Wl:return i*e*3/s.components*s.byteLength;case sn:return i*e*4/s.components*s.byteLength;case uo:return i*e*4/s.components*s.byteLength;case js:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Qs:case er:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xa:case Sa:return Math.max(i,16)*Math.max(e,8)/4;case va:case Ma:return Math.max(i,8)*Math.max(e,8)/2;case ya:case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case wa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case La:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Da:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Na:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Fa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Oa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ba:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ka:case za:case Ha:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Va:case Ga:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Wa:case Xa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xu(i){switch(i){case bn:case kl:return{byteLength:1,components:1};case ds:case zl:case vs:return{byteLength:2,components:1};case ao:case oo:return{byteLength:2,components:4};case li:case ro:case hn:return{byteLength:4,components:1};case Hl:case Vl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:so}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=so);function uc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Mu(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,h),o.onUploadCallback();let g;if(c instanceof Float32Array)g=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)g=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=i.SHORT;else if(c instanceof Uint32Array)g=i.UNSIGNED_INT;else if(c instanceof Int32Array)g=i.INT;else if(c instanceof Int8Array)g=i.BYTE;else if(c instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((g,x)=>g.start-x.start);let f=0;for(let g=1;g<u.length;g++){const x=u[f],M=u[g];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++f,u[f]=M)}u.length=f+1;for(let g=0,x=u.length;g<x;g++){const M=u[g];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Su=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yu=`#ifdef USE_ALPHAHASH
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
#endif`,Eu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Au=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wu=`#ifdef USE_AOMAP
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
#endif`,Ru=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cu=`#ifdef USE_BATCHING
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
#endif`,Pu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Du=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Iu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Uu=`#ifdef USE_IRIDESCENCE
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
#endif`,Nu=`#ifdef USE_BUMPMAP
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
#endif`,Fu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ou=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ku=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gu=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Wu=`#define PI 3.141592653589793
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
} // validated`,Xu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qu=`vec3 transformedNormal = objectNormal;
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
#endif`,Yu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$u=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ku=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ju="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ju=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qu=`#ifdef USE_ENVMAP
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
#endif`,ed=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,td=`#ifdef USE_ENVMAP
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
#endif`,nd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,id=`#ifdef USE_ENVMAP
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
#endif`,sd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ad=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,od=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ld=`#ifdef USE_GRADIENTMAP
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
}`,cd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ud=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dd=`uniform bool receiveShadow;
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
#endif`,fd=`#ifdef USE_ENVMAP
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
#endif`,pd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,md=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_d=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vd=`PhysicalMaterial material;
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
#endif`,xd=`struct PhysicalMaterial {
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
}`,Md=`
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
#endif`,Sd=`#if defined( RE_IndirectDiffuse )
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
#endif`,yd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ed=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Td=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ad=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Pd=`#if defined( USE_POINTS_UV )
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
#endif`,Ld=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Dd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Id=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ud=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fd=`#ifdef USE_MORPHTARGETS
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
#endif`,Od=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,kd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gd=`#ifdef USE_NORMALMAP
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
#endif`,Wd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$d=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ef=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,nf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,af=`float getShadowMask() {
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
}`,of=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lf=`#ifdef USE_SKINNING
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
#endif`,cf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hf=`#ifdef USE_SKINNING
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
#endif`,uf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,df=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ff=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mf=`#ifdef USE_TRANSMISSION
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
#endif`,gf=`#ifdef USE_TRANSMISSION
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
#endif`,_f=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Sf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yf=`uniform sampler2D t2D;
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
}`,Ef=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Af=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wf=`#include <common>
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
}`,Rf=`#if DEPTH_PACKING == 3200
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
}`,Cf=`#define DISTANCE
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
}`,Pf=`#define DISTANCE
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
}`,Lf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Df=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,If=`uniform float scale;
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
}`,Uf=`uniform vec3 diffuse;
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
}`,Nf=`#include <common>
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
}`,Ff=`uniform vec3 diffuse;
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
}`,Of=`#define LAMBERT
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
}`,Bf=`#define LAMBERT
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
}`,kf=`#define MATCAP
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
}`,zf=`#define MATCAP
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
}`,Hf=`#define NORMAL
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
}`,Vf=`#define NORMAL
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
}`,Gf=`#define PHONG
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
}`,Wf=`#define PHONG
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
}`,Xf=`#define STANDARD
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
}`,qf=`#define STANDARD
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
}`,Yf=`#define TOON
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
}`,$f=`#define TOON
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
}`,Kf=`uniform float size;
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
}`,Zf=`uniform vec3 diffuse;
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
}`,jf=`#include <common>
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
}`,Jf=`uniform vec3 color;
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
}`,Qf=`uniform float rotation;
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
}`,ep=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:Su,alphahash_pars_fragment:yu,alphamap_fragment:Eu,alphamap_pars_fragment:bu,alphatest_fragment:Tu,alphatest_pars_fragment:Au,aomap_fragment:wu,aomap_pars_fragment:Ru,batching_pars_vertex:Cu,batching_vertex:Pu,begin_vertex:Lu,beginnormal_vertex:Du,bsdfs:Iu,iridescence_fragment:Uu,bumpmap_pars_fragment:Nu,clipping_planes_fragment:Fu,clipping_planes_pars_fragment:Ou,clipping_planes_pars_vertex:Bu,clipping_planes_vertex:ku,color_fragment:zu,color_pars_fragment:Hu,color_pars_vertex:Vu,color_vertex:Gu,common:Wu,cube_uv_reflection_fragment:Xu,defaultnormal_vertex:qu,displacementmap_pars_vertex:Yu,displacementmap_vertex:$u,emissivemap_fragment:Ku,emissivemap_pars_fragment:Zu,colorspace_fragment:ju,colorspace_pars_fragment:Ju,envmap_fragment:Qu,envmap_common_pars_fragment:ed,envmap_pars_fragment:td,envmap_pars_vertex:nd,envmap_physical_pars_fragment:fd,envmap_vertex:id,fog_vertex:sd,fog_pars_vertex:rd,fog_fragment:ad,fog_pars_fragment:od,gradientmap_pars_fragment:ld,lightmap_pars_fragment:cd,lights_lambert_fragment:hd,lights_lambert_pars_fragment:ud,lights_pars_begin:dd,lights_toon_fragment:pd,lights_toon_pars_fragment:md,lights_phong_fragment:gd,lights_phong_pars_fragment:_d,lights_physical_fragment:vd,lights_physical_pars_fragment:xd,lights_fragment_begin:Md,lights_fragment_maps:Sd,lights_fragment_end:yd,logdepthbuf_fragment:Ed,logdepthbuf_pars_fragment:bd,logdepthbuf_pars_vertex:Td,logdepthbuf_vertex:Ad,map_fragment:wd,map_pars_fragment:Rd,map_particle_fragment:Cd,map_particle_pars_fragment:Pd,metalnessmap_fragment:Ld,metalnessmap_pars_fragment:Dd,morphinstance_vertex:Id,morphcolor_vertex:Ud,morphnormal_vertex:Nd,morphtarget_pars_vertex:Fd,morphtarget_vertex:Od,normal_fragment_begin:Bd,normal_fragment_maps:kd,normal_pars_fragment:zd,normal_pars_vertex:Hd,normal_vertex:Vd,normalmap_pars_fragment:Gd,clearcoat_normal_fragment_begin:Wd,clearcoat_normal_fragment_maps:Xd,clearcoat_pars_fragment:qd,iridescence_pars_fragment:Yd,opaque_fragment:$d,packing:Kd,premultiplied_alpha_fragment:Zd,project_vertex:jd,dithering_fragment:Jd,dithering_pars_fragment:Qd,roughnessmap_fragment:ef,roughnessmap_pars_fragment:tf,shadowmap_pars_fragment:nf,shadowmap_pars_vertex:sf,shadowmap_vertex:rf,shadowmask_pars_fragment:af,skinbase_vertex:of,skinning_pars_vertex:lf,skinning_vertex:cf,skinnormal_vertex:hf,specularmap_fragment:uf,specularmap_pars_fragment:df,tonemapping_fragment:ff,tonemapping_pars_fragment:pf,transmission_fragment:mf,transmission_pars_fragment:gf,uv_pars_fragment:_f,uv_pars_vertex:vf,uv_vertex:xf,worldpos_vertex:Mf,background_vert:Sf,background_frag:yf,backgroundCube_vert:Ef,backgroundCube_frag:bf,cube_vert:Tf,cube_frag:Af,depth_vert:wf,depth_frag:Rf,distanceRGBA_vert:Cf,distanceRGBA_frag:Pf,equirect_vert:Lf,equirect_frag:Df,linedashed_vert:If,linedashed_frag:Uf,meshbasic_vert:Nf,meshbasic_frag:Ff,meshlambert_vert:Of,meshlambert_frag:Bf,meshmatcap_vert:kf,meshmatcap_frag:zf,meshnormal_vert:Hf,meshnormal_frag:Vf,meshphong_vert:Gf,meshphong_frag:Wf,meshphysical_vert:Xf,meshphysical_frag:qf,meshtoon_vert:Yf,meshtoon_frag:$f,points_vert:Kf,points_frag:Zf,shadow_vert:jf,shadow_frag:Jf,sprite_vert:Qf,sprite_frag:ep},oe={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},an={basic:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Rt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Rt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Rt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Rt([oe.points,oe.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Rt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Rt([oe.common,oe.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Rt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Rt([oe.sprite,oe.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distanceRGBA:{uniforms:Rt([oe.common,oe.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distanceRGBA_vert,fragmentShader:Be.distanceRGBA_frag},shadow:{uniforms:Rt([oe.lights,oe.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};an.physical={uniforms:Rt([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const $s={r:0,b:0,g:0},Kn=new Tn,tp=new st;function np(i,e,t,n,s,r,a){const o=new Xe(0);let l=r===!0?0:1,c,h,u=null,f=0,g=null;function x(p){let y=p.isScene===!0?p.background:null;return y&&y.isTexture&&(y=(p.backgroundBlurriness>0?t:e).get(y)),y}function M(p){let y=!1;const A=x(p);A===null?d(o,l):A&&A.isColor&&(d(A,1),y=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(p,y){const A=x(y);A&&(A.isCubeTexture||A.mapping===_r)?(h===void 0&&(h=new Ct(new Ms(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Wi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,C,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Kn.copy(y.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(tp.makeRotationFromEuler(Kn)),h.material.toneMapped=We.getTransfer(A.colorSpace)!==je,(u!==A||f!==A.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,u=A,f=A.version,g=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Ct(new Jt(2,2),new Vn({name:"BackgroundMaterial",uniforms:Wi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=We.getTransfer(A.colorSpace)!==je,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||f!==A.version||g!==i.toneMapping)&&(c.material.needsUpdate=!0,u=A,f=A.version,g=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function d(p,y){p.getRGB($s,ec(i)),n.buffers.color.setClear($s.r,$s.g,$s.b,y,a)}function P(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(p,y=1){o.set(p),l=y,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,d(o,l)},render:M,addToRenderList:m,dispose:P}}function ip(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(v,T,N,D,Y){let G=!1;const W=u(D,N,T);r!==W&&(r=W,c(r.object)),G=g(v,D,N,Y),G&&x(v,D,N,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,y(v,T,N,D),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,T,N){const D=N.wireframe===!0;let Y=n[v.id];Y===void 0&&(Y={},n[v.id]=Y);let G=Y[T.id];G===void 0&&(G={},Y[T.id]=G);let W=G[D];return W===void 0&&(W=f(l()),G[D]=W),W}function f(v){const T=[],N=[],D=[];for(let Y=0;Y<t;Y++)T[Y]=0,N[Y]=0,D[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:N,attributeDivisors:D,object:v,attributes:{},index:null}}function g(v,T,N,D){const Y=r.attributes,G=T.attributes;let W=0;const Z=N.getAttributes();for(const V in Z)if(Z[V].location>=0){const ae=Y[V];let le=G[V];if(le===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(le=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(le=v.instanceColor)),ae===void 0||ae.attribute!==le||le&&ae.data!==le.data)return!0;W++}return r.attributesNum!==W||r.index!==D}function x(v,T,N,D){const Y={},G=T.attributes;let W=0;const Z=N.getAttributes();for(const V in Z)if(Z[V].location>=0){let ae=G[V];ae===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(ae=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(ae=v.instanceColor));const le={};le.attribute=ae,ae&&ae.data&&(le.data=ae.data),Y[V]=le,W++}r.attributes=Y,r.attributesNum=W,r.index=D}function M(){const v=r.newAttributes;for(let T=0,N=v.length;T<N;T++)v[T]=0}function m(v){d(v,0)}function d(v,T){const N=r.newAttributes,D=r.enabledAttributes,Y=r.attributeDivisors;N[v]=1,D[v]===0&&(i.enableVertexAttribArray(v),D[v]=1),Y[v]!==T&&(i.vertexAttribDivisor(v,T),Y[v]=T)}function P(){const v=r.newAttributes,T=r.enabledAttributes;for(let N=0,D=T.length;N<D;N++)T[N]!==v[N]&&(i.disableVertexAttribArray(N),T[N]=0)}function p(v,T,N,D,Y,G,W){W===!0?i.vertexAttribIPointer(v,T,N,Y,G):i.vertexAttribPointer(v,T,N,D,Y,G)}function y(v,T,N,D){M();const Y=D.attributes,G=N.getAttributes(),W=T.defaultAttributeValues;for(const Z in G){const V=G[Z];if(V.location>=0){let se=Y[Z];if(se===void 0&&(Z==="instanceMatrix"&&v.instanceMatrix&&(se=v.instanceMatrix),Z==="instanceColor"&&v.instanceColor&&(se=v.instanceColor)),se!==void 0){const ae=se.normalized,le=se.itemSize,we=e.get(se);if(we===void 0)continue;const qe=we.buffer,Ke=we.type,Ye=we.bytesPerElement,$=Ke===i.INT||Ke===i.UNSIGNED_INT||se.gpuType===ro;if(se.isInterleavedBufferAttribute){const J=se.data,pe=J.stride,De=se.offset;if(J.isInstancedInterleavedBuffer){for(let Ee=0;Ee<V.locationSize;Ee++)d(V.location+Ee,J.meshPerAttribute);v.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Ee=0;Ee<V.locationSize;Ee++)m(V.location+Ee);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let Ee=0;Ee<V.locationSize;Ee++)p(V.location+Ee,le/V.locationSize,Ke,ae,pe*Ye,(De+le/V.locationSize*Ee)*Ye,$)}else{if(se.isInstancedBufferAttribute){for(let J=0;J<V.locationSize;J++)d(V.location+J,se.meshPerAttribute);v.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let J=0;J<V.locationSize;J++)m(V.location+J);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let J=0;J<V.locationSize;J++)p(V.location+J,le/V.locationSize,Ke,ae,le*Ye,le/V.locationSize*J*Ye,$)}}else if(W!==void 0){const ae=W[Z];if(ae!==void 0)switch(ae.length){case 2:i.vertexAttrib2fv(V.location,ae);break;case 3:i.vertexAttrib3fv(V.location,ae);break;case 4:i.vertexAttrib4fv(V.location,ae);break;default:i.vertexAttrib1fv(V.location,ae)}}}}P()}function A(){O();for(const v in n){const T=n[v];for(const N in T){const D=T[N];for(const Y in D)h(D[Y].object),delete D[Y];delete T[N]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;const T=n[v.id];for(const N in T){const D=T[N];for(const Y in D)h(D[Y].object),delete D[Y];delete T[N]}delete n[v.id]}function C(v){for(const T in n){const N=n[T];if(N[v.id]===void 0)continue;const D=N[v.id];for(const Y in D)h(D[Y].object),delete D[Y];delete N[v.id]}}function O(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:O,resetDefaultState:E,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:m,disableUnusedAttributes:P}}function sp(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x];t.update(g,n,1)}function l(c,h,u,f){if(u===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let x=0;x<c.length;x++)a(c[x],h[x],f[x]);else{g.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let x=0;for(let M=0;M<u;M++)x+=h[M]*f[M];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function rp(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==sn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const O=C===vs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==bn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==hn&&!O)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),P=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=x>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:g,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:P,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:A,maxSamples:w}}function ap(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new jn,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const g=u.length!==0||f||n!==0||s;return s=f,n=u.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,g){const x=u.clippingPlanes,M=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||x===null||x.length===0||r&&!m)r?h(null):c();else{const P=r?0:n,p=P*4;let y=d.clippingState||null;l.value=y,y=h(x,f,p,g);for(let A=0;A!==p;++A)y[A]=t[A];d.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=P}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,g,x){const M=u!==null?u.length:0;let m=null;if(M!==0){if(m=l.value,x!==!0||m===null){const d=g+M*4,P=f.matrixWorldInverse;o.getNormalMatrix(P),(m===null||m.length<d)&&(m=new Float32Array(d));for(let p=0,y=g;p!==M;++p,y+=4)a.copy(u[p]).applyMatrix4(P,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}function op(i){let e=new WeakMap;function t(a,o){return o===ma?a.mapping=Hi:o===ga&&(a.mapping=Vi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ma||o===ga)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new iu(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ni=4,ll=[.125,.215,.35,.446,.526,.582],ei=20,Jr=new hc,cl=new Xe;let Qr=null,ea=0,ta=0,na=!1;const Jn=(1+Math.sqrt(5))/2,Ui=1/Jn,hl=[new B(-Jn,Ui,0),new B(Jn,Ui,0),new B(-Ui,0,Jn),new B(Ui,0,Jn),new B(0,Jn,-Ui),new B(0,Jn,Ui),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)],lp=new B;class ul{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=lp}=r;Qr=this._renderer.getRenderTarget(),ea=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel(),na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Qr,ea,ta),this._renderer.xr.enabled=na,e.scissorTest=!1,Ks(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Hi||e.mapping===Vi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qr=this._renderer.getRenderTarget(),ea=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel(),na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:cn,minFilter:cn,generateMipmaps:!1,type:vs,format:sn,colorSpace:Gi,depthBuffer:!1},s=dl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cp(r)),this._blurMaterial=hp(r,e,t)}return s}_compileMaterial(e){const t=new Ct(this._lodPlanes[0],e);this._renderer.compile(t,Jr)}_sceneToCubeUV(e,t,n,s,r){const l=new en(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,g=u.toneMapping;u.getClearColor(cl),u.toneMapping=Bn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const M=new Sn({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),m=new Ct(new Ms,M);let d=!1;const P=e.background;P?P.isColor&&(M.color.copy(P),e.background=null,d=!0):(M.color.copy(cl),d=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(l.up.set(0,c[p],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[p],r.y,r.z)):y===1?(l.up.set(0,0,c[p]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[p],r.z)):(l.up.set(0,c[p],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[p]));const A=this._cubeSize;Ks(s,y*A,p>2?A:0,A,A),u.setRenderTarget(s),d&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=g,u.autoClear=f,e.background=P}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Hi||e.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ks(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Jr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=hl[(s-r-1)%hl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ct(this._lodPlanes[s],c),f=c.uniforms,g=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*ei-1),M=r/x,m=isFinite(r)?1+Math.floor(h*M):ei;m>ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ei}`);const d=[];let P=0;for(let C=0;C<ei;++C){const O=C/M,E=Math.exp(-O*O/2);d.push(E),C===0?P+=E:C<m&&(P+=2*E)}for(let C=0;C<d.length;C++)d[C]=d[C]/P;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:p}=this;f.dTheta.value=x,f.mipInt.value=p-n;const y=this._sizeLods[s],A=3*y*(s>p-Ni?s-p+Ni:0),w=4*(this._cubeSize-y);Ks(t,A,w,3*y,2*y),l.setRenderTarget(t),l.render(u,Jr)}}function cp(i){const e=[],t=[],n=[];let s=i;const r=i-Ni+1+ll.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Ni?l=ll[a-i+Ni-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],g=6,x=6,M=3,m=2,d=1,P=new Float32Array(M*x*g),p=new Float32Array(m*x*g),y=new Float32Array(d*x*g);for(let w=0;w<g;w++){const C=w%3*2/3-1,O=w>2?0:-1,E=[C,O,0,C+2/3,O,0,C+2/3,O+1,0,C,O,0,C+2/3,O+1,0,C,O+1,0];P.set(E,M*x*w),p.set(f,m*x*w);const v=[w,w,w,w,w,w];y.set(v,d*x*w)}const A=new fn;A.setAttribute("position",new Yt(P,M)),A.setAttribute("uv",new Yt(p,m)),A.setAttribute("faceIndex",new Yt(y,d)),e.push(A),s>Ni&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function dl(i,e,t){const n=new ci(i,e,t);return n.texture.mapping=_r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ks(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function hp(i,e,t){const n=new Float32Array(ei),s=new B(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mo(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function fl(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mo(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function pl(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function mo(){return`

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
	`}function up(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ma||l===ga,h=l===Hi||l===Vi;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new ul(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const g=o.image;return c&&g&&g.height>0||h&&g&&s(g)?(t===null&&(t=new ul(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function dp(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&_s("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function fp(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);f.removeEventListener("dispose",a),delete s[f.id];const g=r.get(f);g&&(e.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)e.update(f[g],i.ARRAY_BUFFER)}function c(u){const f=[],g=u.index,x=u.attributes.position;let M=0;if(g!==null){const P=g.array;M=g.version;for(let p=0,y=P.length;p<y;p+=3){const A=P[p+0],w=P[p+1],C=P[p+2];f.push(A,w,w,C,C,A)}}else if(x!==void 0){const P=x.array;M=x.version;for(let p=0,y=P.length/3-1;p<y;p+=3){const A=p+0,w=p+1,C=p+2;f.push(A,w,w,C,C,A)}}else return;const m=new(Yl(f)?Ql:Jl)(f,1);m.version=M;const d=r.get(u);d&&e.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const g=u.index;g!==null&&f.version<g.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function pp(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,g){i.drawElements(n,g,r,f*a),t.update(g,n,1)}function c(f,g,x){x!==0&&(i.drawElementsInstanced(n,g,r,f*a,x),t.update(g,n,x))}function h(f,g,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,r,f,0,x);let m=0;for(let d=0;d<x;d++)m+=g[d];t.update(m,n,1)}function u(f,g,x,M){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,g[d],M[d]);else{m.multiDrawElementsInstancedWEBGL(n,g,0,r,f,0,M,0,x);let d=0;for(let P=0;P<x;P++)d+=g[P]*M[P];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function mp(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function gp(i,e,t){const n=new WeakMap,s=new ht;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let v=function(){O.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var g=v;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],P=o.morphAttributes.normal||[],p=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),m===!0&&(y=3);let A=o.attributes.position.count*y,w=1;A>e.maxTextureSize&&(w=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const C=new Float32Array(A*w*4*u),O=new $l(C,A,w,u);O.type=hn,O.needsUpdate=!0;const E=y*4;for(let T=0;T<u;T++){const N=d[T],D=P[T],Y=p[T],G=A*w*4*T;for(let W=0;W<N.count;W++){const Z=W*E;x===!0&&(s.fromBufferAttribute(N,W),C[G+Z+0]=s.x,C[G+Z+1]=s.y,C[G+Z+2]=s.z,C[G+Z+3]=0),M===!0&&(s.fromBufferAttribute(D,W),C[G+Z+4]=s.x,C[G+Z+5]=s.y,C[G+Z+6]=s.z,C[G+Z+7]=0),m===!0&&(s.fromBufferAttribute(Y,W),C[G+Z+8]=s.x,C[G+Z+9]=s.y,C[G+Z+10]=s.z,C[G+Z+11]=Y.itemSize===4?s.w:1)}}f={count:u,texture:O,size:new He(A,w)},n.set(o,f),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let x=0;for(let m=0;m<c.length;m++)x+=c[m];const M=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function _p(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const dc=new xt,ml=new oc(1,1),fc=new $l,pc=new zh,mc=new nc,gl=[],_l=[],vl=new Float32Array(16),xl=new Float32Array(9),Ml=new Float32Array(4);function $i(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=gl[s];if(r===void 0&&(r=new Float32Array(s),gl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function vr(i,e){let t=_l[e];t===void 0&&(t=new Int32Array(e),_l[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function vp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function xp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2fv(this.addr,e),mt(t,e)}}function Mp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pt(t,e))return;i.uniform3fv(this.addr,e),mt(t,e)}}function Sp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4fv(this.addr,e),mt(t,e)}}function yp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;Ml.set(n),i.uniformMatrix2fv(this.addr,!1,Ml),mt(t,n)}}function Ep(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;xl.set(n),i.uniformMatrix3fv(this.addr,!1,xl),mt(t,n)}}function bp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,n))return;vl.set(n),i.uniformMatrix4fv(this.addr,!1,vl),mt(t,n)}}function Tp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ap(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2iv(this.addr,e),mt(t,e)}}function wp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;i.uniform3iv(this.addr,e),mt(t,e)}}function Rp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4iv(this.addr,e),mt(t,e)}}function Cp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Pp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;i.uniform2uiv(this.addr,e),mt(t,e)}}function Lp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;i.uniform3uiv(this.addr,e),mt(t,e)}}function Dp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;i.uniform4uiv(this.addr,e),mt(t,e)}}function Ip(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ml.compareFunction=ql,r=ml):r=dc,t.setTexture2D(e||r,s)}function Up(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||pc,s)}function Np(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||mc,s)}function Fp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||fc,s)}function Op(i){switch(i){case 5126:return vp;case 35664:return xp;case 35665:return Mp;case 35666:return Sp;case 35674:return yp;case 35675:return Ep;case 35676:return bp;case 5124:case 35670:return Tp;case 35667:case 35671:return Ap;case 35668:case 35672:return wp;case 35669:case 35673:return Rp;case 5125:return Cp;case 36294:return Pp;case 36295:return Lp;case 36296:return Dp;case 35678:case 36198:case 36298:case 36306:case 35682:return Ip;case 35679:case 36299:case 36307:return Up;case 35680:case 36300:case 36308:case 36293:return Np;case 36289:case 36303:case 36311:case 36292:return Fp}}function Bp(i,e){i.uniform1fv(this.addr,e)}function kp(i,e){const t=$i(e,this.size,2);i.uniform2fv(this.addr,t)}function zp(i,e){const t=$i(e,this.size,3);i.uniform3fv(this.addr,t)}function Hp(i,e){const t=$i(e,this.size,4);i.uniform4fv(this.addr,t)}function Vp(i,e){const t=$i(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Gp(i,e){const t=$i(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Wp(i,e){const t=$i(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Xp(i,e){i.uniform1iv(this.addr,e)}function qp(i,e){i.uniform2iv(this.addr,e)}function Yp(i,e){i.uniform3iv(this.addr,e)}function $p(i,e){i.uniform4iv(this.addr,e)}function Kp(i,e){i.uniform1uiv(this.addr,e)}function Zp(i,e){i.uniform2uiv(this.addr,e)}function jp(i,e){i.uniform3uiv(this.addr,e)}function Jp(i,e){i.uniform4uiv(this.addr,e)}function Qp(i,e,t){const n=this.cache,s=e.length,r=vr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||dc,r[a])}function em(i,e,t){const n=this.cache,s=e.length,r=vr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||pc,r[a])}function tm(i,e,t){const n=this.cache,s=e.length,r=vr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||mc,r[a])}function nm(i,e,t){const n=this.cache,s=e.length,r=vr(t,s);pt(n,r)||(i.uniform1iv(this.addr,r),mt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||fc,r[a])}function im(i){switch(i){case 5126:return Bp;case 35664:return kp;case 35665:return zp;case 35666:return Hp;case 35674:return Vp;case 35675:return Gp;case 35676:return Wp;case 5124:case 35670:return Xp;case 35667:case 35671:return qp;case 35668:case 35672:return Yp;case 35669:case 35673:return $p;case 5125:return Kp;case 36294:return Zp;case 36295:return jp;case 36296:return Jp;case 35678:case 36198:case 36298:case 36306:case 35682:return Qp;case 35679:case 36299:case 36307:return em;case 35680:case 36300:case 36308:case 36293:return tm;case 36289:case 36303:case 36311:case 36292:return nm}}class sm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Op(t.type)}}class rm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=im(t.type)}}class am{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const ia=/(\w+)(\])?(\[|\.)?/g;function Sl(i,e){i.seq.push(e),i.map[e.id]=e}function om(i,e,t){const n=i.name,s=n.length;for(ia.lastIndex=0;;){const r=ia.exec(n),a=ia.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Sl(t,c===void 0?new sm(o,i,e):new rm(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new am(o),Sl(t,u)),t=u}}}class nr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);om(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function yl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const lm=37297;let cm=0;function hm(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const El=new Fe;function um(i){We._getMatrix(El,We.workingColorSpace,i);const e=`mat3( ${El.elements.map(t=>t.toFixed(4))} )`;switch(We.getTransfer(i)){case or:return[e,"LinearTransferOETF"];case je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function bl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+hm(i.getShaderSource(e),o)}else return r}function dm(i,e){const t=um(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function fm(i,e){let t;switch(e){case fh:t="Linear";break;case ph:t="Reinhard";break;case mh:t="Cineon";break;case gh:t="ACESFilmic";break;case vh:t="AgX";break;case xh:t="Neutral";break;case _h:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zs=new B;function pm(){We.getLuminanceCoefficients(Zs);const i=Zs.x.toFixed(4),e=Zs.y.toFixed(4),t=Zs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ls).join(`
`)}function gm(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function _m(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ls(i){return i!==""}function Tl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Al(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vm=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(vm,Mm)}const xm=new Map;function Mm(i,e){let t=Be[e];if(t===void 0){const n=xm.get(e);if(n!==void 0)t=Be[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return $a(t)}const Sm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wl(i){return i.replace(Sm,ym)}function ym(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Rl(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Em(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Fl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===qc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(e="SHADOWMAP_TYPE_VSM"),e}function bm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Hi:case Vi:e="ENVMAP_TYPE_CUBE";break;case _r:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Tm(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Vi&&(e="ENVMAP_MODE_REFRACTION"),e}function Am(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ol:e="ENVMAP_BLENDING_MULTIPLY";break;case uh:e="ENVMAP_BLENDING_MIX";break;case dh:e="ENVMAP_BLENDING_ADD";break}return e}function wm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Rm(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Em(t),c=bm(t),h=Tm(t),u=Am(t),f=wm(t),g=mm(t),x=gm(r),M=s.createProgram();let m,d,P=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ls).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ls).join(`
`),d.length>0&&(d+=`
`)):(m=[Rl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ls).join(`
`),d=[Rl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?Be.tonemapping_pars_fragment:"",t.toneMapping!==Bn?fm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,dm("linearToOutputTexel",t.outputColorSpace),pm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ls).join(`
`)),a=$a(a),a=Tl(a,t),a=Al(a,t),o=$a(o),o=Tl(o,t),o=Al(o,t),a=wl(a),o=wl(o),t.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Uo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Uo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const p=P+m+a,y=P+d+o,A=yl(s,s.VERTEX_SHADER,p),w=yl(s,s.FRAGMENT_SHADER,y);s.attachShader(M,A),s.attachShader(M,w),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function C(T){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(M)||"",D=s.getShaderInfoLog(A)||"",Y=s.getShaderInfoLog(w)||"",G=N.trim(),W=D.trim(),Z=Y.trim();let V=!0,se=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,A,w);else{const ae=bl(s,A,"vertex"),le=bl(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+G+`
`+ae+`
`+le)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(W===""||Z==="")&&(se=!1);se&&(T.diagnostics={runnable:V,programLog:G,vertexShader:{log:W,prefix:m},fragmentShader:{log:Z,prefix:d}})}s.deleteShader(A),s.deleteShader(w),O=new nr(s,M),E=_m(s,M)}let O;this.getUniforms=function(){return O===void 0&&C(this),O};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(M,lm)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cm++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=A,this.fragmentShader=w,this}let Cm=0;class Pm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Lm(e),t.set(e,n)),n}}class Lm{constructor(e){this.id=Cm++,this.code=e,this.usedTimes=0}}function Dm(i,e,t,n,s,r,a){const o=new Zl,l=new Pm,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let g=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,v,T,N,D){const Y=N.fog,G=D.geometry,W=E.isMeshStandardMaterial?N.environment:null,Z=(E.isMeshStandardMaterial?t:e).get(E.envMap||W),V=Z&&Z.mapping===_r?Z.image.height:null,se=x[E.type];E.precision!==null&&(g=s.getMaxPrecision(E.precision),g!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",g,"instead."));const ae=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,le=ae!==void 0?ae.length:0;let we=0;G.morphAttributes.position!==void 0&&(we=1),G.morphAttributes.normal!==void 0&&(we=2),G.morphAttributes.color!==void 0&&(we=3);let qe,Ke,Ye,$;if(se){const $e=an[se];qe=$e.vertexShader,Ke=$e.fragmentShader}else qe=E.vertexShader,Ke=E.fragmentShader,l.update(E),Ye=l.getVertexShaderID(E),$=l.getFragmentShaderID(E);const J=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),De=D.isInstancedMesh===!0,Ee=D.isBatchedMesh===!0,Ve=!!E.map,St=!!E.matcap,R=!!Z,nt=!!E.aoMap,Ue=!!E.lightMap,Pe=!!E.bumpMap,_e=!!E.normalMap,it=!!E.displacementMap,ve=!!E.emissiveMap,Oe=!!E.metalnessMap,gt=!!E.roughnessMap,lt=E.anisotropy>0,b=E.clearcoat>0,_=E.dispersion>0,F=E.iridescence>0,q=E.sheen>0,j=E.transmission>0,X=lt&&!!E.anisotropyMap,ye=b&&!!E.clearcoatMap,ie=b&&!!E.clearcoatNormalMap,xe=b&&!!E.clearcoatRoughnessMap,Me=F&&!!E.iridescenceMap,te=F&&!!E.iridescenceThicknessMap,ue=q&&!!E.sheenColorMap,Re=q&&!!E.sheenRoughnessMap,Se=!!E.specularMap,ce=!!E.specularColorMap,Ne=!!E.specularIntensityMap,L=j&&!!E.transmissionMap,ne=j&&!!E.thicknessMap,re=!!E.gradientMap,fe=!!E.alphaMap,Q=E.alphaTest>0,K=!!E.alphaHash,ge=!!E.extensions;let Ie=Bn;E.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Ie=i.toneMapping);const et={shaderID:se,shaderType:E.type,shaderName:E.name,vertexShader:qe,fragmentShader:Ke,defines:E.defines,customVertexShaderID:Ye,customFragmentShaderID:$,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:g,batching:Ee,batchingColor:Ee&&D._colorsTexture!==null,instancing:De,instancingColor:De&&D.instanceColor!==null,instancingMorph:De&&D.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Gi,alphaToCoverage:!!E.alphaToCoverage,map:Ve,matcap:St,envMap:R,envMapMode:R&&Z.mapping,envMapCubeUVHeight:V,aoMap:nt,lightMap:Ue,bumpMap:Pe,normalMap:_e,displacementMap:f&&it,emissiveMap:ve,normalMapObjectSpace:_e&&E.normalMapType===bh,normalMapTangentSpace:_e&&E.normalMapType===Eh,metalnessMap:Oe,roughnessMap:gt,anisotropy:lt,anisotropyMap:X,clearcoat:b,clearcoatMap:ye,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:_,iridescence:F,iridescenceMap:Me,iridescenceThicknessMap:te,sheen:q,sheenColorMap:ue,sheenRoughnessMap:Re,specularMap:Se,specularColorMap:ce,specularIntensityMap:Ne,transmission:j,transmissionMap:L,thicknessMap:ne,gradientMap:re,opaque:E.transparent===!1&&E.blending===Bi&&E.alphaToCoverage===!1,alphaMap:fe,alphaTest:Q,alphaHash:K,combine:E.combine,mapUv:Ve&&M(E.map.channel),aoMapUv:nt&&M(E.aoMap.channel),lightMapUv:Ue&&M(E.lightMap.channel),bumpMapUv:Pe&&M(E.bumpMap.channel),normalMapUv:_e&&M(E.normalMap.channel),displacementMapUv:it&&M(E.displacementMap.channel),emissiveMapUv:ve&&M(E.emissiveMap.channel),metalnessMapUv:Oe&&M(E.metalnessMap.channel),roughnessMapUv:gt&&M(E.roughnessMap.channel),anisotropyMapUv:X&&M(E.anisotropyMap.channel),clearcoatMapUv:ye&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:ie&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:te&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:Re&&M(E.sheenRoughnessMap.channel),specularMapUv:Se&&M(E.specularMap.channel),specularColorMapUv:ce&&M(E.specularColorMap.channel),specularIntensityMapUv:Ne&&M(E.specularIntensityMap.channel),transmissionMapUv:L&&M(E.transmissionMap.channel),thicknessMapUv:ne&&M(E.thicknessMap.channel),alphaMapUv:fe&&M(E.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(_e||lt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!G.attributes.uv&&(Ve||fe),fog:!!Y,useFog:E.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pe,skinning:D.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:we,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ie,decodeVideoTexture:Ve&&E.map.isVideoTexture===!0&&We.getTransfer(E.map.colorSpace)===je,decodeVideoTextureEmissive:ve&&E.emissiveMap.isVideoTexture===!0&&We.getTransfer(E.emissiveMap.colorSpace)===je,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===tn,flipSided:E.side===Dt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:ge&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&E.extensions.multiDraw===!0||Ee)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return et.vertexUv1s=c.has(1),et.vertexUv2s=c.has(2),et.vertexUv3s=c.has(3),c.clear(),et}function d(E){const v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(const T in E.defines)v.push(T),v.push(E.defines[T]);return E.isRawShaderMaterial===!1&&(P(v,E),p(v,E),v.push(i.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function P(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function p(E,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),E.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),E.push(o.mask)}function y(E){const v=x[E.type];let T;if(v){const N=an[v];T=Qh.clone(N.uniforms)}else T=E.uniforms;return T}function A(E,v){let T;for(let N=0,D=h.length;N<D;N++){const Y=h[N];if(Y.cacheKey===v){T=Y,++T.usedTimes;break}}return T===void 0&&(T=new Rm(i,v,E,r),h.push(T)),T}function w(E){if(--E.usedTimes===0){const v=h.indexOf(E);h[v]=h[h.length-1],h.pop(),E.destroy()}}function C(E){l.remove(E)}function O(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:A,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:O}}function Im(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Um(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Cl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Pl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,g,x,M,m){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:g,groupOrder:x,renderOrder:u.renderOrder,z:M,group:m},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=g,d.groupOrder=x,d.renderOrder=u.renderOrder,d.z=M,d.group=m),e++,d}function o(u,f,g,x,M,m){const d=a(u,f,g,x,M,m);g.transmission>0?n.push(d):g.transparent===!0?s.push(d):t.push(d)}function l(u,f,g,x,M,m){const d=a(u,f,g,x,M,m);g.transmission>0?n.unshift(d):g.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||Um),n.length>1&&n.sort(f||Cl),s.length>1&&s.sort(f||Cl)}function h(){for(let u=e,f=i.length;u<f;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Nm(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Pl,i.set(n,[a])):s>=r.length?(a=new Pl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Fm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new Xe};break;case"SpotLight":t={position:new B,direction:new B,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new B,halfWidth:new B,halfHeight:new B};break}return i[e.id]=t,t}}}function Om(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Bm=0;function km(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function zm(i){const e=new Fm,t=Om(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);const s=new B,r=new st,a=new st;function o(c){let h=0,u=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let g=0,x=0,M=0,m=0,d=0,P=0,p=0,y=0,A=0,w=0,C=0;c.sort(km);for(let E=0,v=c.length;E<v;E++){const T=c[E],N=T.color,D=T.intensity,Y=T.distance,G=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=N.r*D,u+=N.g*D,f+=N.b*D;else if(T.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(T.sh.coefficients[W],D);C++}else if(T.isDirectionalLight){const W=e.get(T);if(W.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const Z=T.shadow,V=t.get(T);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[g]=V,n.directionalShadowMap[g]=G,n.directionalShadowMatrix[g]=T.shadow.matrix,P++}n.directional[g]=W,g++}else if(T.isSpotLight){const W=e.get(T);W.position.setFromMatrixPosition(T.matrixWorld),W.color.copy(N).multiplyScalar(D),W.distance=Y,W.coneCos=Math.cos(T.angle),W.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),W.decay=T.decay,n.spot[M]=W;const Z=T.shadow;if(T.map&&(n.spotLightMap[A]=T.map,A++,Z.updateMatrices(T),T.castShadow&&w++),n.spotLightMatrix[M]=Z.matrix,T.castShadow){const V=t.get(T);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[M]=V,n.spotShadowMap[M]=G,y++}M++}else if(T.isRectAreaLight){const W=e.get(T);W.color.copy(N).multiplyScalar(D),W.halfWidth.set(T.width*.5,0,0),W.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=W,m++}else if(T.isPointLight){const W=e.get(T);if(W.color.copy(T.color).multiplyScalar(T.intensity),W.distance=T.distance,W.decay=T.decay,T.castShadow){const Z=T.shadow,V=t.get(T);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[x]=V,n.pointShadowMap[x]=G,n.pointShadowMatrix[x]=T.shadow.matrix,p++}n.point[x]=W,x++}else if(T.isHemisphereLight){const W=e.get(T);W.skyColor.copy(T.color).multiplyScalar(D),W.groundColor.copy(T.groundColor).multiplyScalar(D),n.hemi[d]=W,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const O=n.hash;(O.directionalLength!==g||O.pointLength!==x||O.spotLength!==M||O.rectAreaLength!==m||O.hemiLength!==d||O.numDirectionalShadows!==P||O.numPointShadows!==p||O.numSpotShadows!==y||O.numSpotMaps!==A||O.numLightProbes!==C)&&(n.directional.length=g,n.spot.length=M,n.rectArea.length=m,n.point.length=x,n.hemi.length=d,n.directionalShadow.length=P,n.directionalShadowMap.length=P,n.pointShadow.length=p,n.pointShadowMap.length=p,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=P,n.pointShadowMatrix.length=p,n.spotLightMatrix.length=y+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,O.directionalLength=g,O.pointLength=x,O.spotLength=M,O.rectAreaLength=m,O.hemiLength=d,O.numDirectionalShadows=P,O.numPointShadows=p,O.numSpotShadows=y,O.numSpotMaps=A,O.numLightProbes=C,n.version=Bm++)}function l(c,h){let u=0,f=0,g=0,x=0,M=0;const m=h.matrixWorldInverse;for(let d=0,P=c.length;d<P;d++){const p=c[d];if(p.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(p.matrixWorld),s.setFromMatrixPosition(p.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(p.isSpotLight){const y=n.spot[g];y.position.setFromMatrixPosition(p.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(p.matrixWorld),s.setFromMatrixPosition(p.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),g++}else if(p.isRectAreaLight){const y=n.rectArea[x];y.position.setFromMatrixPosition(p.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(p.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(p.width*.5,0,0),y.halfHeight.set(0,p.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(p.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(p.matrixWorld),y.position.applyMatrix4(m),f++}else if(p.isHemisphereLight){const y=n.hemi[M];y.direction.setFromMatrixPosition(p.matrixWorld),y.direction.transformDirection(m),M++}}}return{setup:o,setupView:l,state:n}}function Ll(i){const e=new zm(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Hm(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ll(i),e.set(s,[o])):r>=a.length?(o=new Ll(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Vm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gm=`uniform sampler2D shadow_pass;
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
}`;function Wm(i,e,t){let n=new rc;const s=new He,r=new He,a=new ht,o=new fu({depthPacking:yh}),l=new pu,c={},h=t.maxTextureSize,u={[Hn]:Dt,[Dt]:Hn,[tn]:tn},f=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Vm,fragmentShader:Gm}),g=f.clone();g.defines.HORIZONTAL_PASS=1;const x=new fn;x.setAttribute("position",new Yt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Ct(x,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fl;let d=this.type;this.render=function(w,C,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const E=i.getRenderTarget(),v=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),N=i.state;N.setBlending(On),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const D=d!==Mn&&this.type===Mn,Y=d===Mn&&this.type!==Mn;for(let G=0,W=w.length;G<W;G++){const Z=w[G],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const se=V.getFrameExtents();if(s.multiply(se),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/se.x),s.x=r.x*se.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/se.y),s.y=r.y*se.y,V.mapSize.y=r.y)),V.map===null||D===!0||Y===!0){const le=this.type!==Mn?{minFilter:Mt,magFilter:Mt}:{};V.map!==null&&V.map.dispose(),V.map=new ci(s.x,s.y,le),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ae=V.getViewportCount();for(let le=0;le<ae;le++){const we=V.getViewport(le);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),N.viewport(a),V.updateMatrices(Z,le),n=V.getFrustum(),y(C,O,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Mn&&P(V,O),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(E,v,T)};function P(w,C){const O=e.update(M);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,g.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ci(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,O,f,M,null),g.uniforms.shadow_pass.value=w.mapPass.texture,g.uniforms.resolution.value=w.mapSize,g.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,O,g,M,null)}function p(w,C,O,E){let v=null;const T=O.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(T!==void 0)v=T;else if(v=O.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const N=v.uuid,D=C.uuid;let Y=c[N];Y===void 0&&(Y={},c[N]=Y);let G=Y[D];G===void 0&&(G=v.clone(),Y[D]=G,C.addEventListener("dispose",A)),v=G}if(v.visible=C.visible,v.wireframe=C.wireframe,E===Mn?v.side=C.shadowSide!==null?C.shadowSide:C.side:v.side=C.shadowSide!==null?C.shadowSide:u[C.side],v.alphaMap=C.alphaMap,v.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,v.map=C.map,v.clipShadows=C.clipShadows,v.clippingPlanes=C.clippingPlanes,v.clipIntersection=C.clipIntersection,v.displacementMap=C.displacementMap,v.displacementScale=C.displacementScale,v.displacementBias=C.displacementBias,v.wireframeLinewidth=C.wireframeLinewidth,v.linewidth=C.linewidth,O.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const N=i.properties.get(v);N.light=O}return v}function y(w,C,O,E,v){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===Mn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,w.matrixWorld);const D=e.update(w),Y=w.material;if(Array.isArray(Y)){const G=D.groups;for(let W=0,Z=G.length;W<Z;W++){const V=G[W],se=Y[V.materialIndex];if(se&&se.visible){const ae=p(w,se,E,v);w.onBeforeShadow(i,w,C,O,D,ae,V),i.renderBufferDirect(O,null,D,ae,w,V),w.onAfterShadow(i,w,C,O,D,ae,V)}}}else if(Y.visible){const G=p(w,Y,E,v);w.onBeforeShadow(i,w,C,O,D,G,null),i.renderBufferDirect(O,null,D,G,w,null),w.onAfterShadow(i,w,C,O,D,G,null)}}const N=w.children;for(let D=0,Y=N.length;D<Y;D++)y(N[D],C,O,E,v)}function A(w){w.target.removeEventListener("dispose",A);for(const O in c){const E=c[O],v=w.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}const Xm={[la]:ca,[ha]:fa,[ua]:pa,[zi]:da,[ca]:la,[fa]:ha,[pa]:ua,[da]:zi};function qm(i,e){function t(){let L=!1;const ne=new ht;let re=null;const fe=new ht(0,0,0,0);return{setMask:function(Q){re!==Q&&!L&&(i.colorMask(Q,Q,Q,Q),re=Q)},setLocked:function(Q){L=Q},setClear:function(Q,K,ge,Ie,et){et===!0&&(Q*=Ie,K*=Ie,ge*=Ie),ne.set(Q,K,ge,Ie),fe.equals(ne)===!1&&(i.clearColor(Q,K,ge,Ie),fe.copy(ne))},reset:function(){L=!1,re=null,fe.set(-1,0,0,0)}}}function n(){let L=!1,ne=!1,re=null,fe=null,Q=null;return{setReversed:function(K){if(ne!==K){const ge=e.get("EXT_clip_control");K?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),ne=K;const Ie=Q;Q=null,this.setClear(Ie)}},getReversed:function(){return ne},setTest:function(K){K?J(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(K){re!==K&&!L&&(i.depthMask(K),re=K)},setFunc:function(K){if(ne&&(K=Xm[K]),fe!==K){switch(K){case la:i.depthFunc(i.NEVER);break;case ca:i.depthFunc(i.ALWAYS);break;case ha:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case ua:i.depthFunc(i.EQUAL);break;case da:i.depthFunc(i.GEQUAL);break;case fa:i.depthFunc(i.GREATER);break;case pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}fe=K}},setLocked:function(K){L=K},setClear:function(K){Q!==K&&(ne&&(K=1-K),i.clearDepth(K),Q=K)},reset:function(){L=!1,re=null,fe=null,Q=null,ne=!1}}}function s(){let L=!1,ne=null,re=null,fe=null,Q=null,K=null,ge=null,Ie=null,et=null;return{setTest:function($e){L||($e?J(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function($e){ne!==$e&&!L&&(i.stencilMask($e),ne=$e)},setFunc:function($e,pn,rn){(re!==$e||fe!==pn||Q!==rn)&&(i.stencilFunc($e,pn,rn),re=$e,fe=pn,Q=rn)},setOp:function($e,pn,rn){(K!==$e||ge!==pn||Ie!==rn)&&(i.stencilOp($e,pn,rn),K=$e,ge=pn,Ie=rn)},setLocked:function($e){L=$e},setClear:function($e){et!==$e&&(i.clearStencil($e),et=$e)},reset:function(){L=!1,ne=null,re=null,fe=null,Q=null,K=null,ge=null,Ie=null,et=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,g=[],x=null,M=!1,m=null,d=null,P=null,p=null,y=null,A=null,w=null,C=new Xe(0,0,0),O=0,E=!1,v=null,T=null,N=null,D=null,Y=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=Z>=2);let se=null,ae={};const le=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),qe=new ht().fromArray(le),Ke=new ht().fromArray(we);function Ye(L,ne,re,fe){const Q=new Uint8Array(4),K=i.createTexture();i.bindTexture(L,K),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ge=0;ge<re;ge++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ne,0,i.RGBA,1,1,fe,0,i.RGBA,i.UNSIGNED_BYTE,Q):i.texImage2D(ne+ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Q);return K}const $={};$[i.TEXTURE_2D]=Ye(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(i.DEPTH_TEST),a.setFunc(zi),Pe(!1),_e(Ro),J(i.CULL_FACE),nt(On);function J(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function pe(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function De(L,ne){return u[L]!==ne?(i.bindFramebuffer(L,ne),u[L]=ne,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ne),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ne),!0):!1}function Ee(L,ne){let re=g,fe=!1;if(L){re=f.get(ne),re===void 0&&(re=[],f.set(ne,re));const Q=L.textures;if(re.length!==Q.length||re[0]!==i.COLOR_ATTACHMENT0){for(let K=0,ge=Q.length;K<ge;K++)re[K]=i.COLOR_ATTACHMENT0+K;re.length=Q.length,fe=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,fe=!0);fe&&i.drawBuffers(re)}function Ve(L){return x!==L?(i.useProgram(L),x=L,!0):!1}const St={[Qn]:i.FUNC_ADD,[$c]:i.FUNC_SUBTRACT,[Kc]:i.FUNC_REVERSE_SUBTRACT};St[Zc]=i.MIN,St[jc]=i.MAX;const R={[Jc]:i.ZERO,[Qc]:i.ONE,[eh]:i.SRC_COLOR,[aa]:i.SRC_ALPHA,[ah]:i.SRC_ALPHA_SATURATE,[sh]:i.DST_COLOR,[nh]:i.DST_ALPHA,[th]:i.ONE_MINUS_SRC_COLOR,[oa]:i.ONE_MINUS_SRC_ALPHA,[rh]:i.ONE_MINUS_DST_COLOR,[ih]:i.ONE_MINUS_DST_ALPHA,[oh]:i.CONSTANT_COLOR,[lh]:i.ONE_MINUS_CONSTANT_COLOR,[ch]:i.CONSTANT_ALPHA,[hh]:i.ONE_MINUS_CONSTANT_ALPHA};function nt(L,ne,re,fe,Q,K,ge,Ie,et,$e){if(L===On){M===!0&&(pe(i.BLEND),M=!1);return}if(M===!1&&(J(i.BLEND),M=!0),L!==Yc){if(L!==m||$e!==E){if((d!==Qn||y!==Qn)&&(i.blendEquation(i.FUNC_ADD),d=Qn,y=Qn),$e)switch(L){case Bi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFunc(i.ONE,i.ONE);break;case Po:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Lo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Po:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}P=null,p=null,A=null,w=null,C.set(0,0,0),O=0,m=L,E=$e}return}Q=Q||ne,K=K||re,ge=ge||fe,(ne!==d||Q!==y)&&(i.blendEquationSeparate(St[ne],St[Q]),d=ne,y=Q),(re!==P||fe!==p||K!==A||ge!==w)&&(i.blendFuncSeparate(R[re],R[fe],R[K],R[ge]),P=re,p=fe,A=K,w=ge),(Ie.equals(C)===!1||et!==O)&&(i.blendColor(Ie.r,Ie.g,Ie.b,et),C.copy(Ie),O=et),m=L,E=!1}function Ue(L,ne){L.side===tn?pe(i.CULL_FACE):J(i.CULL_FACE);let re=L.side===Dt;ne&&(re=!re),Pe(re),L.blending===Bi&&L.transparent===!1?nt(On):nt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const fe=L.stencilWrite;o.setTest(fe),fe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ve(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(L){v!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),v=L)}function _e(L){L!==Wc?(J(i.CULL_FACE),L!==T&&(L===Ro?i.cullFace(i.BACK):L===Xc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),T=L}function it(L){L!==N&&(W&&i.lineWidth(L),N=L)}function ve(L,ne,re){L?(J(i.POLYGON_OFFSET_FILL),(D!==ne||Y!==re)&&(i.polygonOffset(ne,re),D=ne,Y=re)):pe(i.POLYGON_OFFSET_FILL)}function Oe(L){L?J(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function gt(L){L===void 0&&(L=i.TEXTURE0+G-1),se!==L&&(i.activeTexture(L),se=L)}function lt(L,ne,re){re===void 0&&(se===null?re=i.TEXTURE0+G-1:re=se);let fe=ae[re];fe===void 0&&(fe={type:void 0,texture:void 0},ae[re]=fe),(fe.type!==L||fe.texture!==ne)&&(se!==re&&(i.activeTexture(re),se=re),i.bindTexture(L,ne||$[L]),fe.type=L,fe.texture=ne)}function b(){const L=ae[se];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{i.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{i.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{i.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xe(){try{i.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Me(){try{i.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function te(){try{i.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ue(L){qe.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),qe.copy(L))}function Re(L){Ke.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Ke.copy(L))}function Se(L,ne){let re=c.get(ne);re===void 0&&(re=new WeakMap,c.set(ne,re));let fe=re.get(L);fe===void 0&&(fe=i.getUniformBlockIndex(ne,L.name),re.set(L,fe))}function ce(L,ne){const fe=c.get(ne).get(L);l.get(ne)!==fe&&(i.uniformBlockBinding(ne,fe,L.__bindingPointIndex),l.set(ne,fe))}function Ne(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},se=null,ae={},u={},f=new WeakMap,g=[],x=null,M=!1,m=null,d=null,P=null,p=null,y=null,A=null,w=null,C=new Xe(0,0,0),O=0,E=!1,v=null,T=null,N=null,D=null,Y=null,qe.set(0,0,i.canvas.width,i.canvas.height),Ke.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:pe,bindFramebuffer:De,drawBuffers:Ee,useProgram:Ve,setBlending:nt,setMaterial:Ue,setFlipSided:Pe,setCullFace:_e,setLineWidth:it,setPolygonOffset:ve,setScissorTest:Oe,activeTexture:gt,bindTexture:lt,unbindTexture:b,compressedTexImage2D:_,compressedTexImage3D:F,texImage2D:Me,texImage3D:te,updateUBOMapping:Se,uniformBlockBinding:ce,texStorage2D:ie,texStorage3D:xe,texSubImage2D:q,texSubImage3D:j,compressedTexSubImage2D:X,compressedTexSubImage3D:ye,scissor:ue,viewport:Re,reset:Ne}}function Ym(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new He,h=new WeakMap;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(b,_){return g?new OffscreenCanvas(b,_):gs("canvas")}function M(b,_,F){let q=1;const j=lt(b);if((j.width>F||j.height>F)&&(q=F/Math.max(j.width,j.height)),q<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const X=Math.floor(q*j.width),ye=Math.floor(q*j.height);u===void 0&&(u=x(X,ye));const ie=_?x(X,ye):u;return ie.width=X,ie.height=ye,ie.getContext("2d").drawImage(b,0,0,X,ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+X+"x"+ye+")."),ie}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),b;return b}function m(b){return b.generateMipmaps}function d(b){i.generateMipmap(b)}function P(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function p(b,_,F,q,j=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let X=_;if(_===i.RED&&(F===i.FLOAT&&(X=i.R32F),F===i.HALF_FLOAT&&(X=i.R16F),F===i.UNSIGNED_BYTE&&(X=i.R8)),_===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.R8UI),F===i.UNSIGNED_SHORT&&(X=i.R16UI),F===i.UNSIGNED_INT&&(X=i.R32UI),F===i.BYTE&&(X=i.R8I),F===i.SHORT&&(X=i.R16I),F===i.INT&&(X=i.R32I)),_===i.RG&&(F===i.FLOAT&&(X=i.RG32F),F===i.HALF_FLOAT&&(X=i.RG16F),F===i.UNSIGNED_BYTE&&(X=i.RG8)),_===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RG8UI),F===i.UNSIGNED_SHORT&&(X=i.RG16UI),F===i.UNSIGNED_INT&&(X=i.RG32UI),F===i.BYTE&&(X=i.RG8I),F===i.SHORT&&(X=i.RG16I),F===i.INT&&(X=i.RG32I)),_===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGB8UI),F===i.UNSIGNED_SHORT&&(X=i.RGB16UI),F===i.UNSIGNED_INT&&(X=i.RGB32UI),F===i.BYTE&&(X=i.RGB8I),F===i.SHORT&&(X=i.RGB16I),F===i.INT&&(X=i.RGB32I)),_===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),F===i.UNSIGNED_INT&&(X=i.RGBA32UI),F===i.BYTE&&(X=i.RGBA8I),F===i.SHORT&&(X=i.RGBA16I),F===i.INT&&(X=i.RGBA32I)),_===i.RGB&&(F===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),_===i.RGBA){const ye=j?or:We.getTransfer(q);F===i.FLOAT&&(X=i.RGBA32F),F===i.HALF_FLOAT&&(X=i.RGBA16F),F===i.UNSIGNED_BYTE&&(X=ye===je?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function y(b,_){let F;return b?_===null||_===li||_===fs?F=i.DEPTH24_STENCIL8:_===hn?F=i.DEPTH32F_STENCIL8:_===ds&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===li||_===fs?F=i.DEPTH_COMPONENT24:_===hn?F=i.DEPTH_COMPONENT32F:_===ds&&(F=i.DEPTH_COMPONENT16),F}function A(b,_){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==Mt&&b.minFilter!==cn?Math.log2(Math.max(_.width,_.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?_.mipmaps.length:1}function w(b){const _=b.target;_.removeEventListener("dispose",w),O(_),_.isVideoTexture&&h.delete(_)}function C(b){const _=b.target;_.removeEventListener("dispose",C),v(_)}function O(b){const _=n.get(b);if(_.__webglInit===void 0)return;const F=b.source,q=f.get(F);if(q){const j=q[_.__cacheKey];j.usedTimes--,j.usedTimes===0&&E(b),Object.keys(q).length===0&&f.delete(F)}n.remove(b)}function E(b){const _=n.get(b);i.deleteTexture(_.__webglTexture);const F=b.source,q=f.get(F);delete q[_.__cacheKey],a.memory.textures--}function v(b){const _=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let j=0;j<_.__webglFramebuffer[q].length;j++)i.deleteFramebuffer(_.__webglFramebuffer[q][j]);else i.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)i.deleteFramebuffer(_.__webglFramebuffer[q]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const F=b.textures;for(let q=0,j=F.length;q<j;q++){const X=n.get(F[q]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(F[q])}n.remove(b)}let T=0;function N(){T=0}function D(){const b=T;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),T+=1,b}function Y(b){const _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function G(b,_){const F=n.get(b);if(b.isVideoTexture&&Oe(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&F.__version!==b.version){const q=b.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(F,b,_);return}}else b.isExternalTexture&&(F.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+_)}function W(b,_){const F=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&F.__version!==b.version){$(F,b,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+_)}function Z(b,_){const F=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&F.__version!==b.version){$(F,b,_);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+_)}function V(b,_){const F=n.get(b);if(b.version>0&&F.__version!==b.version){J(F,b,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+_)}const se={[ar]:i.REPEAT,[si]:i.CLAMP_TO_EDGE,[_a]:i.MIRRORED_REPEAT},ae={[Mt]:i.NEAREST,[Mh]:i.NEAREST_MIPMAP_NEAREST,[Es]:i.NEAREST_MIPMAP_LINEAR,[cn]:i.LINEAR,[br]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},le={[Th]:i.NEVER,[Lh]:i.ALWAYS,[Ah]:i.LESS,[ql]:i.LEQUAL,[wh]:i.EQUAL,[Ph]:i.GEQUAL,[Rh]:i.GREATER,[Ch]:i.NOTEQUAL};function we(b,_){if(_.type===hn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===cn||_.magFilter===br||_.magFilter===Es||_.magFilter===ri||_.minFilter===cn||_.minFilter===br||_.minFilter===Es||_.minFilter===ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,se[_.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,se[_.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,se[_.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,ae[_.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,ae[_.minFilter]),_.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,le[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Mt||_.minFilter!==Es&&_.minFilter!==ri||_.type===hn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function qe(b,_){let F=!1;b.__webglInit===void 0&&(b.__webglInit=!0,_.addEventListener("dispose",w));const q=_.source;let j=f.get(q);j===void 0&&(j={},f.set(q,j));const X=Y(_);if(X!==b.__cacheKey){j[X]===void 0&&(j[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),j[X].usedTimes++;const ye=j[b.__cacheKey];ye!==void 0&&(j[b.__cacheKey].usedTimes--,ye.usedTimes===0&&E(_)),b.__cacheKey=X,b.__webglTexture=j[X].texture}return F}function Ke(b,_,F){return Math.floor(Math.floor(b/F)/_)}function Ye(b,_,F,q){const X=b.updateRanges;if(X.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,F,q,_.data);else{X.sort((te,ue)=>te.start-ue.start);let ye=0;for(let te=1;te<X.length;te++){const ue=X[ye],Re=X[te],Se=ue.start+ue.count,ce=Ke(Re.start,_.width,4),Ne=Ke(ue.start,_.width,4);Re.start<=Se+1&&ce===Ne&&Ke(Re.start+Re.count-1,_.width,4)===ce?ue.count=Math.max(ue.count,Re.start+Re.count-ue.start):(++ye,X[ye]=Re)}X.length=ye+1;const ie=i.getParameter(i.UNPACK_ROW_LENGTH),xe=i.getParameter(i.UNPACK_SKIP_PIXELS),Me=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let te=0,ue=X.length;te<ue;te++){const Re=X[te],Se=Math.floor(Re.start/4),ce=Math.ceil(Re.count/4),Ne=Se%_.width,L=Math.floor(Se/_.width),ne=ce,re=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ne),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Ne,L,ne,re,F,q,_.data)}b.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ie),i.pixelStorei(i.UNPACK_SKIP_PIXELS,xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Me)}}function $(b,_,F){let q=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=i.TEXTURE_3D);const j=qe(b,_),X=_.source;t.bindTexture(q,b.__webglTexture,i.TEXTURE0+F);const ye=n.get(X);if(X.version!==ye.__version||j===!0){t.activeTexture(i.TEXTURE0+F);const ie=We.getPrimaries(We.workingColorSpace),xe=_.colorSpace===Nn?null:We.getPrimaries(_.colorSpace),Me=_.colorSpace===Nn||ie===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let te=M(_.image,!1,s.maxTextureSize);te=gt(_,te);const ue=r.convert(_.format,_.colorSpace),Re=r.convert(_.type);let Se=p(_.internalFormat,ue,Re,_.colorSpace,_.isVideoTexture);we(q,_);let ce;const Ne=_.mipmaps,L=_.isVideoTexture!==!0,ne=ye.__version===void 0||j===!0,re=X.dataReady,fe=A(_,te);if(_.isDepthTexture)Se=y(_.format===ms,_.type),ne&&(L?t.texStorage2D(i.TEXTURE_2D,1,Se,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ue,Re,null));else if(_.isDataTexture)if(Ne.length>0){L&&ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,Ne[0].width,Ne[0].height);for(let Q=0,K=Ne.length;Q<K;Q++)ce=Ne[Q],L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ue,Re,ce.data);_.generateMipmaps=!1}else L?(ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,te.width,te.height),re&&Ye(_,te,ue,Re)):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ue,Re,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){L&&ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Se,Ne[0].width,Ne[0].height,te.depth);for(let Q=0,K=Ne.length;Q<K;Q++)if(ce=Ne[Q],_.format!==sn)if(ue!==null)if(L){if(re)if(_.layerUpdates.size>0){const ge=ol(ce.width,ce.height,_.format,_.type);for(const Ie of _.layerUpdates){const et=ce.data.subarray(Ie*ge/ce.data.BYTES_PER_ELEMENT,(Ie+1)*ge/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,Ie,ce.width,ce.height,1,ue,et)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ce.width,ce.height,te.depth,ue,ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Se,ce.width,ce.height,te.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?re&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ce.width,ce.height,te.depth,ue,Re,ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,Se,ce.width,ce.height,te.depth,0,ue,Re,ce.data)}else{L&&ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,Ne[0].width,Ne[0].height);for(let Q=0,K=Ne.length;Q<K;Q++)ce=Ne[Q],_.format!==sn?ue!==null?L?re&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,ce.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ue,Re,ce.data)}else if(_.isDataArrayTexture)if(L){if(ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Se,te.width,te.height,te.depth),re)if(_.layerUpdates.size>0){const Q=ol(te.width,te.height,_.format,_.type);for(const K of _.layerUpdates){const ge=te.data.subarray(K*Q/te.data.BYTES_PER_ELEMENT,(K+1)*Q/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,te.width,te.height,1,ue,Re,ge)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ue,Re,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,te.width,te.height,te.depth,0,ue,Re,te.data);else if(_.isData3DTexture)L?(ne&&t.texStorage3D(i.TEXTURE_3D,fe,Se,te.width,te.height,te.depth),re&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ue,Re,te.data)):t.texImage3D(i.TEXTURE_3D,0,Se,te.width,te.height,te.depth,0,ue,Re,te.data);else if(_.isFramebufferTexture){if(ne)if(L)t.texStorage2D(i.TEXTURE_2D,fe,Se,te.width,te.height);else{let Q=te.width,K=te.height;for(let ge=0;ge<fe;ge++)t.texImage2D(i.TEXTURE_2D,ge,Se,Q,K,0,ue,Re,null),Q>>=1,K>>=1}}else if(Ne.length>0){if(L&&ne){const Q=lt(Ne[0]);t.texStorage2D(i.TEXTURE_2D,fe,Se,Q.width,Q.height)}for(let Q=0,K=Ne.length;Q<K;Q++)ce=Ne[Q],L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ue,Re,ce):t.texImage2D(i.TEXTURE_2D,Q,Se,ue,Re,ce);_.generateMipmaps=!1}else if(L){if(ne){const Q=lt(te);t.texStorage2D(i.TEXTURE_2D,fe,Se,Q.width,Q.height)}re&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Re,te)}else t.texImage2D(i.TEXTURE_2D,0,Se,ue,Re,te);m(_)&&d(q),ye.__version=X.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function J(b,_,F){if(_.image.length!==6)return;const q=qe(b,_),j=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+F);const X=n.get(j);if(j.version!==X.__version||q===!0){t.activeTexture(i.TEXTURE0+F);const ye=We.getPrimaries(We.workingColorSpace),ie=_.colorSpace===Nn?null:We.getPrimaries(_.colorSpace),xe=_.colorSpace===Nn||ye===ie?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Me=_.isCompressedTexture||_.image[0].isCompressedTexture,te=_.image[0]&&_.image[0].isDataTexture,ue=[];for(let K=0;K<6;K++)!Me&&!te?ue[K]=M(_.image[K],!0,s.maxCubemapSize):ue[K]=te?_.image[K].image:_.image[K],ue[K]=gt(_,ue[K]);const Re=ue[0],Se=r.convert(_.format,_.colorSpace),ce=r.convert(_.type),Ne=p(_.internalFormat,Se,ce,_.colorSpace),L=_.isVideoTexture!==!0,ne=X.__version===void 0||q===!0,re=j.dataReady;let fe=A(_,Re);we(i.TEXTURE_CUBE_MAP,_);let Q;if(Me){L&&ne&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ne,Re.width,Re.height);for(let K=0;K<6;K++){Q=ue[K].mipmaps;for(let ge=0;ge<Q.length;ge++){const Ie=Q[ge];_.format!==sn?Se!==null?L?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,0,0,Ie.width,Ie.height,Se,Ie.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,Ne,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,0,0,Ie.width,Ie.height,Se,ce,Ie.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,Ne,Ie.width,Ie.height,0,Se,ce,Ie.data)}}}else{if(Q=_.mipmaps,L&&ne){Q.length>0&&fe++;const K=lt(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ne,K.width,K.height)}for(let K=0;K<6;K++)if(te){L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ue[K].width,ue[K].height,Se,ce,ue[K].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ne,ue[K].width,ue[K].height,0,Se,ce,ue[K].data);for(let ge=0;ge<Q.length;ge++){const et=Q[ge].image[K].image;L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,0,0,et.width,et.height,Se,ce,et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,Ne,et.width,et.height,0,Se,ce,et.data)}}else{L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Se,ce,ue[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ne,Se,ce,ue[K]);for(let ge=0;ge<Q.length;ge++){const Ie=Q[ge];L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,0,0,Se,ce,Ie.image[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,Ne,Se,ce,Ie.image[K])}}}m(_)&&d(i.TEXTURE_CUBE_MAP),X.__version=j.version,_.onUpdate&&_.onUpdate(_)}b.__version=_.version}function pe(b,_,F,q,j,X){const ye=r.convert(F.format,F.colorSpace),ie=r.convert(F.type),xe=p(F.internalFormat,ye,ie,F.colorSpace),Me=n.get(_),te=n.get(F);if(te.__renderTarget=_,!Me.__hasExternalTextures){const ue=Math.max(1,_.width>>X),Re=Math.max(1,_.height>>X);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,X,xe,ue,Re,_.depth,0,ye,ie,null):t.texImage2D(j,X,xe,ue,Re,0,ye,ie,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,j,te.__webglTexture,0,it(_)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,j,te.__webglTexture,X),t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(b,_,F){if(i.bindRenderbuffer(i.RENDERBUFFER,b),_.depthBuffer){const q=_.depthTexture,j=q&&q.isDepthTexture?q.type:null,X=y(_.stencilBuffer,j),ye=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=it(_);ve(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie,X,_.width,_.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,X,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,X,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ye,i.RENDERBUFFER,b)}else{const q=_.textures;for(let j=0;j<q.length;j++){const X=q[j],ye=r.convert(X.format,X.colorSpace),ie=r.convert(X.type),xe=p(X.internalFormat,ye,ie,X.colorSpace),Me=it(_);F&&ve(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,xe,_.width,_.height):ve(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me,xe,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,xe,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ee(b,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),G(_.depthTexture,0);const j=q.__webglTexture,X=it(_);if(_.depthTexture.format===ps)ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(_.depthTexture.format===ms)ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ve(b){const _=n.get(b),F=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){const q=b.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){const j=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",j)};q.addEventListener("dispose",j),_.__depthDisposeCallback=j}_.__boundDepthTexture=q}if(b.depthTexture&&!_.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const q=b.texture.mipmaps;q&&q.length>0?Ee(_.__webglFramebuffer[0],b):Ee(_.__webglFramebuffer,b)}else if(F){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=i.createRenderbuffer(),De(_.__webglDepthbuffer[q],b,!1);else{const j=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,X)}}else{const q=b.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),De(_.__webglDepthbuffer,b,!1);else{const j=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,X)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function St(b,_,F){const q=n.get(b);_!==void 0&&pe(q.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Ve(b)}function R(b){const _=b.texture,F=n.get(b),q=n.get(_);b.addEventListener("dispose",C);const j=b.textures,X=b.isWebGLCubeRenderTarget===!0,ye=j.length>1;if(ye||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=_.version,a.memory.textures++),X){F.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer[ie]=[];for(let xe=0;xe<_.mipmaps.length;xe++)F.__webglFramebuffer[ie][xe]=i.createFramebuffer()}else F.__webglFramebuffer[ie]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer=[];for(let ie=0;ie<_.mipmaps.length;ie++)F.__webglFramebuffer[ie]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(ye)for(let ie=0,xe=j.length;ie<xe;ie++){const Me=n.get(j[ie]);Me.__webglTexture===void 0&&(Me.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&ve(b)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const xe=j[ie];F.__webglColorRenderbuffer[ie]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ie]);const Me=r.convert(xe.format,xe.colorSpace),te=r.convert(xe.type),ue=p(xe.internalFormat,Me,te,xe.colorSpace,b.isXRRenderTarget===!0),Re=it(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ue,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,F.__webglColorRenderbuffer[ie])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),De(F.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),we(i.TEXTURE_CUBE_MAP,_);for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)pe(F.__webglFramebuffer[ie][xe],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else pe(F.__webglFramebuffer[ie],b,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(_)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let ie=0,xe=j.length;ie<xe;ie++){const Me=j[ie],te=n.get(Me);let ue=i.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ue=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,te.__webglTexture),we(ue,Me),pe(F.__webglFramebuffer,b,Me,i.COLOR_ATTACHMENT0+ie,ue,0),m(Me)&&d(ue)}t.unbindTexture()}else{let ie=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ie=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,q.__webglTexture),we(ie,_),_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)pe(F.__webglFramebuffer[xe],b,_,i.COLOR_ATTACHMENT0,ie,xe);else pe(F.__webglFramebuffer,b,_,i.COLOR_ATTACHMENT0,ie,0);m(_)&&d(ie),t.unbindTexture()}b.depthBuffer&&Ve(b)}function nt(b){const _=b.textures;for(let F=0,q=_.length;F<q;F++){const j=_[F];if(m(j)){const X=P(b),ye=n.get(j).__webglTexture;t.bindTexture(X,ye),d(X),t.unbindTexture()}}}const Ue=[],Pe=[];function _e(b){if(b.samples>0){if(ve(b)===!1){const _=b.textures,F=b.width,q=b.height;let j=i.COLOR_BUFFER_BIT;const X=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ye=n.get(b),ie=_.length>1;if(ie)for(let Me=0;Me<_.length;Me++)t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const xe=b.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let Me=0;Me<_.length;Me++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ie){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ye.__webglColorRenderbuffer[Me]);const te=n.get(_[Me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,F,q,0,0,F,q,j,i.NEAREST),l===!0&&(Ue.length=0,Pe.length=0,Ue.push(i.COLOR_ATTACHMENT0+Me),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Ue.push(X),Pe.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Pe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ue))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ie)for(let Me=0;Me<_.length;Me++){t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,ye.__webglColorRenderbuffer[Me]);const te=n.get(_[Me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const _=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(b){return Math.min(s.maxSamples,b.samples)}function ve(b){const _=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Oe(b){const _=a.render.frame;h.get(b)!==_&&(h.set(b,_),b.update())}function gt(b,_){const F=b.colorSpace,q=b.format,j=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||F!==Gi&&F!==Nn&&(We.getTransfer(F)===je?(q!==sn||j!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),_}function lt(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=N,this.setTexture2D=G,this.setTexture2DArray=W,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=St,this.setupRenderTarget=R,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ve}function $m(i,e){function t(n,s=Nn){let r;const a=We.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===ao)return i.UNSIGNED_SHORT_4_4_4_4;if(n===oo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Hl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Vl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===kl)return i.BYTE;if(n===zl)return i.SHORT;if(n===ds)return i.UNSIGNED_SHORT;if(n===ro)return i.INT;if(n===li)return i.UNSIGNED_INT;if(n===hn)return i.FLOAT;if(n===vs)return i.HALF_FLOAT;if(n===Gl)return i.ALPHA;if(n===Wl)return i.RGB;if(n===sn)return i.RGBA;if(n===ps)return i.DEPTH_COMPONENT;if(n===ms)return i.DEPTH_STENCIL;if(n===lo)return i.RED;if(n===co)return i.RED_INTEGER;if(n===Xl)return i.RG;if(n===ho)return i.RG_INTEGER;if(n===uo)return i.RGBA_INTEGER;if(n===js||n===Js||n===Qs||n===er)if(a===je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===va||n===xa||n===Ma||n===Sa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ya||n===Ea||n===ba)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ya||n===Ea)return a===je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ba)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ta||n===Aa||n===wa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ia||n===Ua||n===Na||n===Fa||n===Oa||n===Ba)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ta)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Aa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===wa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ra)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ca)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===La)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Da)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ia)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ua)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Na)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Oa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ba)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ka||n===za||n===Ha)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ka)return a===je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ha)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Va||n===Ga||n===Wa||n===Xa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Va)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ga)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Wa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Xa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===fs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Km=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zm=`
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

}`;class jm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new lc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Vn({vertexShader:Km,fragmentShader:Zm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ct(new Jt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Jm extends Xi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,g=null,x=null;const M=typeof XRWebGLBinding<"u",m=new jm,d={},P=t.getContextAttributes();let p=null,y=null;const A=[],w=[],C=new He;let O=null;const E=new en;E.viewport=new ht;const v=new en;v.viewport=new ht;const T=[E,v],N=new vu;let D=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let J=A[$];return J===void 0&&(J=new Yr,A[$]=J),J.getTargetRaySpace()},this.getControllerGrip=function($){let J=A[$];return J===void 0&&(J=new Yr,A[$]=J),J.getGripSpace()},this.getHand=function($){let J=A[$];return J===void 0&&(J=new Yr,A[$]=J),J.getHandSpace()};function G($){const J=w.indexOf($.inputSource);if(J===-1)return;const pe=A[J];pe!==void 0&&(pe.update($.inputSource,$.frame,c||a),pe.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<A.length;$++){const J=w[$];J!==null&&(w[$]=null,A[$].disconnect(J))}D=null,Y=null,m.reset();for(const $ in d)delete d[$];e.setRenderTarget(p),g=null,f=null,u=null,s=null,y=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(O),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",W),s.addEventListener("inputsourceschange",Z),P.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,De=null,Ee=null;P.depth&&(Ee=P.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=P.stencil?ms:ps,De=P.stencil?fs:li);const Ve={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ve),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new ci(f.textureWidth,f.textureHeight,{format:sn,type:bn,depthTexture:new oc(f.textureWidth,f.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:P.stencil,colorSpace:e.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),y=new ci(g.framebufferWidth,g.framebufferHeight,{format:sn,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z($){for(let J=0;J<$.removed.length;J++){const pe=$.removed[J],De=w.indexOf(pe);De>=0&&(w[De]=null,A[De].disconnect(pe))}for(let J=0;J<$.added.length;J++){const pe=$.added[J];let De=w.indexOf(pe);if(De===-1){for(let Ve=0;Ve<A.length;Ve++)if(Ve>=w.length){w.push(pe),De=Ve;break}else if(w[Ve]===null){w[Ve]=pe,De=Ve;break}if(De===-1)break}const Ee=A[De];Ee&&Ee.connect(pe)}}const V=new B,se=new B;function ae($,J,pe){V.setFromMatrixPosition(J.matrixWorld),se.setFromMatrixPosition(pe.matrixWorld);const De=V.distanceTo(se),Ee=J.projectionMatrix.elements,Ve=pe.projectionMatrix.elements,St=Ee[14]/(Ee[10]-1),R=Ee[14]/(Ee[10]+1),nt=(Ee[9]+1)/Ee[5],Ue=(Ee[9]-1)/Ee[5],Pe=(Ee[8]-1)/Ee[0],_e=(Ve[8]+1)/Ve[0],it=St*Pe,ve=St*_e,Oe=De/(-Pe+_e),gt=Oe*-Pe;if(J.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(gt),$.translateZ(Oe),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ee[10]===-1)$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const lt=St+Oe,b=R+Oe,_=it-gt,F=ve+(De-gt),q=nt*R/b*lt,j=Ue*R/b*lt;$.projectionMatrix.makePerspective(_,F,q,j,lt,b),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function le($,J){J===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(J.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let J=$.near,pe=$.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),N.near=v.near=E.near=J,N.far=v.far=E.far=pe,(D!==N.near||Y!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),D=N.near,Y=N.far),N.layers.mask=$.layers.mask|6,E.layers.mask=N.layers.mask&3,v.layers.mask=N.layers.mask&5;const De=$.parent,Ee=N.cameras;le(N,De);for(let Ve=0;Ve<Ee.length;Ve++)le(Ee[Ve],De);Ee.length===2?ae(N,E,v):N.projectionMatrix.copy(E.projectionMatrix),we($,N,De)};function we($,J,pe){pe===null?$.matrix.copy(J.matrixWorld):($.matrix.copy(pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(J.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Ya*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(f===null&&g===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function($){return d[$]};let qe=null;function Ke($,J){if(h=J.getViewerPose(c||a),x=J,h!==null){const pe=h.views;g!==null&&(e.setRenderTargetFramebuffer(y,g.framebuffer),e.setRenderTarget(y));let De=!1;pe.length!==N.cameras.length&&(N.cameras.length=0,De=!0);for(let R=0;R<pe.length;R++){const nt=pe[R];let Ue=null;if(g!==null)Ue=g.getViewport(nt);else{const _e=u.getViewSubImage(f,nt);Ue=_e.viewport,R===0&&(e.setRenderTargetTextures(y,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(y))}let Pe=T[R];Pe===void 0&&(Pe=new en,Pe.layers.enable(R),Pe.viewport=new ht,T[R]=Pe),Pe.matrix.fromArray(nt.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(nt.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(Ue.x,Ue.y,Ue.width,Ue.height),R===0&&(N.matrix.copy(Pe.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),De===!0&&N.cameras.push(Pe)}const Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const R=u.getDepthInformation(pe[0]);R&&R.isValid&&R.texture&&m.init(R,s.renderState)}if(Ee&&Ee.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let R=0;R<pe.length;R++){const nt=pe[R].camera;if(nt){let Ue=d[nt];Ue||(Ue=new lc,d[nt]=Ue);const Pe=u.getCameraImage(nt);Ue.sourceTexture=Pe}}}}for(let pe=0;pe<A.length;pe++){const De=w[pe],Ee=A[pe];De!==null&&Ee!==void 0&&Ee.update(De,J,c||a)}qe&&qe($,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),x=null}const Ye=new uc;Ye.setAnimationLoop(Ke),this.setAnimationLoop=function($){qe=$},this.dispose=function(){}}}const Zn=new Tn,Qm=new st;function eg(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,ec(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,P,p,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&g(m,d,y)):d.isMeshMatcapMaterial?(r(m,d),x(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),M(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,P,p):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Dt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Dt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const P=e.get(d),p=P.envMap,y=P.envMapRotation;p&&(m.envMap.value=p,Zn.copy(y),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,p.isCubeTexture&&p.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),m.envMapRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(Zn)),m.flipEnvMap.value=p.isCubeTexture&&p.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,P,p){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*P,m.scale.value=p*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function g(m,d,P){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Dt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=P.texture,m.transmissionSamplerSize.value.set(P.width,P.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,d){d.matcap&&(m.matcap.value=d.matcap)}function M(m,d){const P=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(P.matrixWorld),m.nearDistance.value=P.shadow.camera.near,m.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function tg(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(P,p){const y=p.program;n.uniformBlockBinding(P,y)}function c(P,p){let y=s[P.id];y===void 0&&(x(P),y=h(P),s[P.id]=y,P.addEventListener("dispose",m));const A=p.program;n.updateUBOMapping(P,A);const w=e.render.frame;r[P.id]!==w&&(f(P),r[P.id]=w)}function h(P){const p=u();P.__bindingPointIndex=p;const y=i.createBuffer(),A=P.__size,w=P.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,p,y),y}function u(){for(let P=0;P<o;P++)if(a.indexOf(P)===-1)return a.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(P){const p=s[P.id],y=P.uniforms,A=P.__cache;i.bindBuffer(i.UNIFORM_BUFFER,p);for(let w=0,C=y.length;w<C;w++){const O=Array.isArray(y[w])?y[w]:[y[w]];for(let E=0,v=O.length;E<v;E++){const T=O[E];if(g(T,w,E,A)===!0){const N=T.__offset,D=Array.isArray(T.value)?T.value:[T.value];let Y=0;for(let G=0;G<D.length;G++){const W=D[G],Z=M(W);typeof W=="number"||typeof W=="boolean"?(T.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,N+Y,T.__data)):W.isMatrix3?(T.__data[0]=W.elements[0],T.__data[1]=W.elements[1],T.__data[2]=W.elements[2],T.__data[3]=0,T.__data[4]=W.elements[3],T.__data[5]=W.elements[4],T.__data[6]=W.elements[5],T.__data[7]=0,T.__data[8]=W.elements[6],T.__data[9]=W.elements[7],T.__data[10]=W.elements[8],T.__data[11]=0):(W.toArray(T.__data,Y),Y+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(P,p,y,A){const w=P.value,C=p+"_"+y;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{const O=A[C];if(typeof w=="number"||typeof w=="boolean"){if(O!==w)return A[C]=w,!0}else if(O.equals(w)===!1)return O.copy(w),!0}return!1}function x(P){const p=P.uniforms;let y=0;const A=16;for(let C=0,O=p.length;C<O;C++){const E=Array.isArray(p[C])?p[C]:[p[C]];for(let v=0,T=E.length;v<T;v++){const N=E[v],D=Array.isArray(N.value)?N.value:[N.value];for(let Y=0,G=D.length;Y<G;Y++){const W=D[Y],Z=M(W),V=y%A,se=V%Z.boundary,ae=V+se;y+=se,ae!==0&&A-ae<Z.storage&&(y+=A-ae),N.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=y,y+=Z.storage}}}const w=y%A;return w>0&&(y+=A-w),P.__size=y,P.__cache={},this}function M(P){const p={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(p.boundary=4,p.storage=4):P.isVector2?(p.boundary=8,p.storage=8):P.isVector3||P.isColor?(p.boundary=16,p.storage=12):P.isVector4?(p.boundary=16,p.storage=16):P.isMatrix3?(p.boundary=48,p.storage=48):P.isMatrix4?(p.boundary=64,p.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),p}function m(P){const p=P.target;p.removeEventListener("dispose",m);const y=a.indexOf(p.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[p.id]),delete s[p.id],delete r[p.id]}function d(){for(const P in s)i.deleteBuffer(s[P]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class ng{constructor(e={}){const{canvas:t=Ih(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const x=new Uint32Array(4),M=new Int32Array(4);let m=null,d=null;const P=[],p=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let A=!1;this._outputColorSpace=ft;let w=0,C=0,O=null,E=-1,v=null;const T=new ht,N=new ht;let D=null;const Y=new Xe(0);let G=0,W=t.width,Z=t.height,V=1,se=null,ae=null;const le=new ht(0,0,W,Z),we=new ht(0,0,W,Z);let qe=!1;const Ke=new rc;let Ye=!1,$=!1;const J=new st,pe=new B,De=new ht,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ve=!1;function St(){return O===null?V:1}let R=n;function nt(S,I){return t.getContext(S,I)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${so}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",Q,!1),R===null){const I="webgl2";if(R=nt(I,S),R===null)throw nt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ue,Pe,_e,it,ve,Oe,gt,lt,b,_,F,q,j,X,ye,ie,xe,Me,te,ue,Re,Se,ce,Ne;function L(){Ue=new dp(R),Ue.init(),Se=new $m(R,Ue),Pe=new rp(R,Ue,e,Se),_e=new qm(R,Ue),Pe.reversedDepthBuffer&&f&&_e.buffers.depth.setReversed(!0),it=new mp(R),ve=new Im,Oe=new Ym(R,Ue,_e,ve,Pe,Se,it),gt=new op(y),lt=new up(y),b=new Mu(R),ce=new ip(R,b),_=new fp(R,b,it,ce),F=new _p(R,_,b,it),te=new gp(R,Pe,Oe),ie=new ap(ve),q=new Dm(y,gt,lt,Ue,Pe,ce,ie),j=new eg(y,ve),X=new Nm,ye=new Hm(Ue),Me=new np(y,gt,lt,_e,F,g,l),xe=new Wm(y,F,Pe),Ne=new tg(R,it,Pe,_e),ue=new sp(R,Ue,it),Re=new pp(R,Ue,it),it.programs=q.programs,y.capabilities=Pe,y.extensions=Ue,y.properties=ve,y.renderLists=X,y.shadowMap=xe,y.state=_e,y.info=it}L();const ne=new Jm(y,R);this.xr=ne,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const S=Ue.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ue.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(S){S!==void 0&&(V=S,this.setSize(W,Z,!1))},this.getSize=function(S){return S.set(W,Z)},this.setSize=function(S,I,z=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=S,Z=I,t.width=Math.floor(S*V),t.height=Math.floor(I*V),z===!0&&(t.style.width=S+"px",t.style.height=I+"px"),this.setViewport(0,0,S,I)},this.getDrawingBufferSize=function(S){return S.set(W*V,Z*V).floor()},this.setDrawingBufferSize=function(S,I,z){W=S,Z=I,V=z,t.width=Math.floor(S*z),t.height=Math.floor(I*z),this.setViewport(0,0,S,I)},this.getCurrentViewport=function(S){return S.copy(T)},this.getViewport=function(S){return S.copy(le)},this.setViewport=function(S,I,z,H){S.isVector4?le.set(S.x,S.y,S.z,S.w):le.set(S,I,z,H),_e.viewport(T.copy(le).multiplyScalar(V).round())},this.getScissor=function(S){return S.copy(we)},this.setScissor=function(S,I,z,H){S.isVector4?we.set(S.x,S.y,S.z,S.w):we.set(S,I,z,H),_e.scissor(N.copy(we).multiplyScalar(V).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(S){_e.setScissorTest(qe=S)},this.setOpaqueSort=function(S){se=S},this.setTransparentSort=function(S){ae=S},this.getClearColor=function(S){return S.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(S=!0,I=!0,z=!0){let H=0;if(S){let U=!1;if(O!==null){const ee=O.texture.format;U=ee===uo||ee===ho||ee===co}if(U){const ee=O.texture.type,he=ee===bn||ee===li||ee===ds||ee===fs||ee===ao||ee===oo,me=Me.getClearColor(),de=Me.getClearAlpha(),Ae=me.r,Le=me.g,be=me.b;he?(x[0]=Ae,x[1]=Le,x[2]=be,x[3]=de,R.clearBufferuiv(R.COLOR,0,x)):(M[0]=Ae,M[1]=Le,M[2]=be,M[3]=de,R.clearBufferiv(R.COLOR,0,M))}else H|=R.COLOR_BUFFER_BIT}I&&(H|=R.DEPTH_BUFFER_BIT),z&&(H|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",Q,!1),Me.dispose(),X.dispose(),ye.dispose(),ve.dispose(),gt.dispose(),lt.dispose(),F.dispose(),ce.dispose(),Ne.dispose(),q.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",rn),ne.removeEventListener("sessionend",So),Gn.stop()};function re(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const S=it.autoReset,I=xe.enabled,z=xe.autoUpdate,H=xe.needsUpdate,U=xe.type;L(),it.autoReset=S,xe.enabled=I,xe.autoUpdate=z,xe.needsUpdate=H,xe.type=U}function Q(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function K(S){const I=S.target;I.removeEventListener("dispose",K),ge(I)}function ge(S){Ie(S),ve.remove(S)}function Ie(S){const I=ve.get(S).programs;I!==void 0&&(I.forEach(function(z){q.releaseProgram(z)}),S.isShaderMaterial&&q.releaseShaderCache(S))}this.renderBufferDirect=function(S,I,z,H,U,ee){I===null&&(I=Ee);const he=U.isMesh&&U.matrixWorld.determinant()<0,me=Lc(S,I,z,H,U);_e.setMaterial(H,he);let de=z.index,Ae=1;if(H.wireframe===!0){if(de=_.getWireframeAttribute(z),de===void 0)return;Ae=2}const Le=z.drawRange,be=z.attributes.position;let ke=Le.start*Ae,Ze=(Le.start+Le.count)*Ae;ee!==null&&(ke=Math.max(ke,ee.start*Ae),Ze=Math.min(Ze,(ee.start+ee.count)*Ae)),de!==null?(ke=Math.max(ke,0),Ze=Math.min(Ze,de.count)):be!=null&&(ke=Math.max(ke,0),Ze=Math.min(Ze,be.count));const ot=Ze-ke;if(ot<0||ot===1/0)return;ce.setup(U,H,me,z,de);let tt,Qe=ue;if(de!==null&&(tt=b.get(de),Qe=Re,Qe.setIndex(tt)),U.isMesh)H.wireframe===!0?(_e.setLineWidth(H.wireframeLinewidth*St()),Qe.setMode(R.LINES)):Qe.setMode(R.TRIANGLES);else if(U.isLine){let Te=H.linewidth;Te===void 0&&(Te=1),_e.setLineWidth(Te*St()),U.isLineSegments?Qe.setMode(R.LINES):U.isLineLoop?Qe.setMode(R.LINE_LOOP):Qe.setMode(R.LINE_STRIP)}else U.isPoints?Qe.setMode(R.POINTS):U.isSprite&&Qe.setMode(R.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)_s("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Qe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ue.get("WEBGL_multi_draw"))Qe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Te=U._multiDrawStarts,rt=U._multiDrawCounts,Ge=U._multiDrawCount,It=de?b.get(de).bytesPerElement:1,pi=ve.get(H).currentProgram.getUniforms();for(let Ut=0;Ut<Ge;Ut++)pi.setValue(R,"_gl_DrawID",Ut),Qe.render(Te[Ut]/It,rt[Ut])}else if(U.isInstancedMesh)Qe.renderInstances(ke,ot,U.count);else if(z.isInstancedBufferGeometry){const Te=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,rt=Math.min(z.instanceCount,Te);Qe.renderInstances(ke,ot,rt)}else Qe.render(ke,ot)};function et(S,I,z){S.transparent===!0&&S.side===tn&&S.forceSinglePass===!1?(S.side=Dt,S.needsUpdate=!0,ys(S,I,z),S.side=Hn,S.needsUpdate=!0,ys(S,I,z),S.side=tn):ys(S,I,z)}this.compile=function(S,I,z=null){z===null&&(z=S),d=ye.get(z),d.init(I),p.push(d),z.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),S!==z&&S.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();const H=new Set;return S.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ee=U.material;if(ee)if(Array.isArray(ee))for(let he=0;he<ee.length;he++){const me=ee[he];et(me,z,U),H.add(me)}else et(ee,z,U),H.add(ee)}),d=p.pop(),H},this.compileAsync=function(S,I,z=null){const H=this.compile(S,I,z);return new Promise(U=>{function ee(){if(H.forEach(function(he){ve.get(he).currentProgram.isReady()&&H.delete(he)}),H.size===0){U(S);return}setTimeout(ee,10)}Ue.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let $e=null;function pn(S){$e&&$e(S)}function rn(){Gn.stop()}function So(){Gn.start()}const Gn=new uc;Gn.setAnimationLoop(pn),typeof self<"u"&&Gn.setContext(self),this.setAnimationLoop=function(S){$e=S,ne.setAnimationLoop(S),S===null?Gn.stop():Gn.start()},ne.addEventListener("sessionstart",rn),ne.addEventListener("sessionend",So),this.render=function(S,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(I),I=ne.getCamera()),S.isScene===!0&&S.onBeforeRender(y,S,I,O),d=ye.get(S,p.length),d.init(I),p.push(d),J.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Ke.setFromProjectionMatrix(J,un,I.reversedDepth),$=this.localClippingEnabled,Ye=ie.init(this.clippingPlanes,$),m=X.get(S,P.length),m.init(),P.push(m),ne.enabled===!0&&ne.isPresenting===!0){const ee=y.xr.getDepthSensingMesh();ee!==null&&Sr(ee,I,-1/0,y.sortObjects)}Sr(S,I,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(se,ae),Ve=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,Ve&&Me.addToRenderList(m,S),this.info.render.frame++,Ye===!0&&ie.beginShadows();const z=d.state.shadowsArray;xe.render(z,S,I),Ye===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,U=m.transmissive;if(d.setupLights(),I.isArrayCamera){const ee=I.cameras;if(U.length>0)for(let he=0,me=ee.length;he<me;he++){const de=ee[he];Eo(H,U,S,de)}Ve&&Me.render(S);for(let he=0,me=ee.length;he<me;he++){const de=ee[he];yo(m,S,de,de.viewport)}}else U.length>0&&Eo(H,U,S,I),Ve&&Me.render(S),yo(m,S,I);O!==null&&C===0&&(Oe.updateMultisampleRenderTarget(O),Oe.updateRenderTargetMipmap(O)),S.isScene===!0&&S.onAfterRender(y,S,I),ce.resetDefaultState(),E=-1,v=null,p.pop(),p.length>0?(d=p[p.length-1],Ye===!0&&ie.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,P.pop(),P.length>0?m=P[P.length-1]:m=null};function Sr(S,I,z,H){if(S.visible===!1)return;if(S.layers.test(I.layers)){if(S.isGroup)z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(I);else if(S.isLight)d.pushLight(S),S.castShadow&&d.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Ke.intersectsSprite(S)){H&&De.setFromMatrixPosition(S.matrixWorld).applyMatrix4(J);const he=F.update(S),me=S.material;me.visible&&m.push(S,he,me,z,De.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Ke.intersectsObject(S))){const he=F.update(S),me=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),De.copy(S.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),De.copy(he.boundingSphere.center)),De.applyMatrix4(S.matrixWorld).applyMatrix4(J)),Array.isArray(me)){const de=he.groups;for(let Ae=0,Le=de.length;Ae<Le;Ae++){const be=de[Ae],ke=me[be.materialIndex];ke&&ke.visible&&m.push(S,he,ke,z,De.z,be)}}else me.visible&&m.push(S,he,me,z,De.z,null)}}const ee=S.children;for(let he=0,me=ee.length;he<me;he++)Sr(ee[he],I,z,H)}function yo(S,I,z,H){const U=S.opaque,ee=S.transmissive,he=S.transparent;d.setupLightsView(z),Ye===!0&&ie.setGlobalState(y.clippingPlanes,z),H&&_e.viewport(T.copy(H)),U.length>0&&Ss(U,I,z),ee.length>0&&Ss(ee,I,z),he.length>0&&Ss(he,I,z),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function Eo(S,I,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[H.id]===void 0&&(d.state.transmissionRenderTarget[H.id]=new ci(1,1,{generateMipmaps:!0,type:Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float")?vs:bn,minFilter:ri,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace}));const ee=d.state.transmissionRenderTarget[H.id],he=H.viewport||T;ee.setSize(he.z*y.transmissionResolutionScale,he.w*y.transmissionResolutionScale);const me=y.getRenderTarget(),de=y.getActiveCubeFace(),Ae=y.getActiveMipmapLevel();y.setRenderTarget(ee),y.getClearColor(Y),G=y.getClearAlpha(),G<1&&y.setClearColor(16777215,.5),y.clear(),Ve&&Me.render(z);const Le=y.toneMapping;y.toneMapping=Bn;const be=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),d.setupLightsView(H),Ye===!0&&ie.setGlobalState(y.clippingPlanes,H),Ss(S,z,H),Oe.updateMultisampleRenderTarget(ee),Oe.updateRenderTargetMipmap(ee),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ze=0,ot=I.length;Ze<ot;Ze++){const tt=I[Ze],Qe=tt.object,Te=tt.geometry,rt=tt.material,Ge=tt.group;if(rt.side===tn&&Qe.layers.test(H.layers)){const It=rt.side;rt.side=Dt,rt.needsUpdate=!0,bo(Qe,z,H,Te,rt,Ge),rt.side=It,rt.needsUpdate=!0,ke=!0}}ke===!0&&(Oe.updateMultisampleRenderTarget(ee),Oe.updateRenderTargetMipmap(ee))}y.setRenderTarget(me,de,Ae),y.setClearColor(Y,G),be!==void 0&&(H.viewport=be),y.toneMapping=Le}function Ss(S,I,z){const H=I.isScene===!0?I.overrideMaterial:null;for(let U=0,ee=S.length;U<ee;U++){const he=S[U],me=he.object,de=he.geometry,Ae=he.group;let Le=he.material;Le.allowOverride===!0&&H!==null&&(Le=H),me.layers.test(z.layers)&&bo(me,I,z,de,Le,Ae)}}function bo(S,I,z,H,U,ee){S.onBeforeRender(y,I,z,H,U,ee),S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),U.onBeforeRender(y,I,z,H,S,ee),U.transparent===!0&&U.side===tn&&U.forceSinglePass===!1?(U.side=Dt,U.needsUpdate=!0,y.renderBufferDirect(z,I,H,U,S,ee),U.side=Hn,U.needsUpdate=!0,y.renderBufferDirect(z,I,H,U,S,ee),U.side=tn):y.renderBufferDirect(z,I,H,U,S,ee),S.onAfterRender(y,I,z,H,U,ee)}function ys(S,I,z){I.isScene!==!0&&(I=Ee);const H=ve.get(S),U=d.state.lights,ee=d.state.shadowsArray,he=U.state.version,me=q.getParameters(S,U.state,ee,I,z),de=q.getProgramCacheKey(me);let Ae=H.programs;H.environment=S.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(S.isMeshStandardMaterial?lt:gt).get(S.envMap||H.environment),H.envMapRotation=H.environment!==null&&S.envMap===null?I.environmentRotation:S.envMapRotation,Ae===void 0&&(S.addEventListener("dispose",K),Ae=new Map,H.programs=Ae);let Le=Ae.get(de);if(Le!==void 0){if(H.currentProgram===Le&&H.lightsStateVersion===he)return Ao(S,me),Le}else me.uniforms=q.getUniforms(S),S.onBeforeCompile(me,y),Le=q.acquireProgram(me,de),Ae.set(de,Le),H.uniforms=me.uniforms;const be=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(be.clippingPlanes=ie.uniform),Ao(S,me),H.needsLights=Ic(S),H.lightsStateVersion=he,H.needsLights&&(be.ambientLightColor.value=U.state.ambient,be.lightProbe.value=U.state.probe,be.directionalLights.value=U.state.directional,be.directionalLightShadows.value=U.state.directionalShadow,be.spotLights.value=U.state.spot,be.spotLightShadows.value=U.state.spotShadow,be.rectAreaLights.value=U.state.rectArea,be.ltc_1.value=U.state.rectAreaLTC1,be.ltc_2.value=U.state.rectAreaLTC2,be.pointLights.value=U.state.point,be.pointLightShadows.value=U.state.pointShadow,be.hemisphereLights.value=U.state.hemi,be.directionalShadowMap.value=U.state.directionalShadowMap,be.directionalShadowMatrix.value=U.state.directionalShadowMatrix,be.spotShadowMap.value=U.state.spotShadowMap,be.spotLightMatrix.value=U.state.spotLightMatrix,be.spotLightMap.value=U.state.spotLightMap,be.pointShadowMap.value=U.state.pointShadowMap,be.pointShadowMatrix.value=U.state.pointShadowMatrix),H.currentProgram=Le,H.uniformsList=null,Le}function To(S){if(S.uniformsList===null){const I=S.currentProgram.getUniforms();S.uniformsList=nr.seqWithValue(I.seq,S.uniforms)}return S.uniformsList}function Ao(S,I){const z=ve.get(S);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function Lc(S,I,z,H,U){I.isScene!==!0&&(I=Ee),Oe.resetTextureUnits();const ee=I.fog,he=H.isMeshStandardMaterial?I.environment:null,me=O===null?y.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Gi,de=(H.isMeshStandardMaterial?lt:gt).get(H.envMap||he),Ae=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Le=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),be=!!z.morphAttributes.position,ke=!!z.morphAttributes.normal,Ze=!!z.morphAttributes.color;let ot=Bn;H.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(ot=y.toneMapping);const tt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Qe=tt!==void 0?tt.length:0,Te=ve.get(H),rt=d.state.lights;if(Ye===!0&&($===!0||S!==v)){const At=S===v&&H.id===E;ie.setState(H,S,At)}let Ge=!1;H.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==rt.state.version||Te.outputColorSpace!==me||U.isBatchedMesh&&Te.batching===!1||!U.isBatchedMesh&&Te.batching===!0||U.isBatchedMesh&&Te.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Te.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Te.instancing===!1||!U.isInstancedMesh&&Te.instancing===!0||U.isSkinnedMesh&&Te.skinning===!1||!U.isSkinnedMesh&&Te.skinning===!0||U.isInstancedMesh&&Te.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Te.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Te.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Te.instancingMorph===!1&&U.morphTexture!==null||Te.envMap!==de||H.fog===!0&&Te.fog!==ee||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ie.numPlanes||Te.numIntersection!==ie.numIntersection)||Te.vertexAlphas!==Ae||Te.vertexTangents!==Le||Te.morphTargets!==be||Te.morphNormals!==ke||Te.morphColors!==Ze||Te.toneMapping!==ot||Te.morphTargetsCount!==Qe)&&(Ge=!0):(Ge=!0,Te.__version=H.version);let It=Te.currentProgram;Ge===!0&&(It=ys(H,I,U));let pi=!1,Ut=!1,Ki=!1;const at=It.getUniforms(),kt=Te.uniforms;if(_e.useProgram(It.program)&&(pi=!0,Ut=!0,Ki=!0),H.id!==E&&(E=H.id,Ut=!0),pi||v!==S){_e.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),at.setValue(R,"projectionMatrix",S.projectionMatrix),at.setValue(R,"viewMatrix",S.matrixWorldInverse);const Lt=at.map.cameraPosition;Lt!==void 0&&Lt.setValue(R,pe.setFromMatrixPosition(S.matrixWorld)),Pe.logarithmicDepthBuffer&&at.setValue(R,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&at.setValue(R,"isOrthographic",S.isOrthographicCamera===!0),v!==S&&(v=S,Ut=!0,Ki=!0)}if(U.isSkinnedMesh){at.setOptional(R,U,"bindMatrix"),at.setOptional(R,U,"bindMatrixInverse");const At=U.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),at.setValue(R,"boneTexture",At.boneTexture,Oe))}U.isBatchedMesh&&(at.setOptional(R,U,"batchingTexture"),at.setValue(R,"batchingTexture",U._matricesTexture,Oe),at.setOptional(R,U,"batchingIdTexture"),at.setValue(R,"batchingIdTexture",U._indirectTexture,Oe),at.setOptional(R,U,"batchingColorTexture"),U._colorsTexture!==null&&at.setValue(R,"batchingColorTexture",U._colorsTexture,Oe));const zt=z.morphAttributes;if((zt.position!==void 0||zt.normal!==void 0||zt.color!==void 0)&&te.update(U,z,It),(Ut||Te.receiveShadow!==U.receiveShadow)&&(Te.receiveShadow=U.receiveShadow,at.setValue(R,"receiveShadow",U.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(kt.envMap.value=de,kt.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&I.environment!==null&&(kt.envMapIntensity.value=I.environmentIntensity),Ut&&(at.setValue(R,"toneMappingExposure",y.toneMappingExposure),Te.needsLights&&Dc(kt,Ki),ee&&H.fog===!0&&j.refreshFogUniforms(kt,ee),j.refreshMaterialUniforms(kt,H,V,Z,d.state.transmissionRenderTarget[S.id]),nr.upload(R,To(Te),kt,Oe)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(nr.upload(R,To(Te),kt,Oe),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&at.setValue(R,"center",U.center),at.setValue(R,"modelViewMatrix",U.modelViewMatrix),at.setValue(R,"normalMatrix",U.normalMatrix),at.setValue(R,"modelMatrix",U.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const At=H.uniformsGroups;for(let Lt=0,yr=At.length;Lt<yr;Lt++){const Wn=At[Lt];Ne.update(Wn,It),Ne.bind(Wn,It)}}return It}function Dc(S,I){S.ambientLightColor.needsUpdate=I,S.lightProbe.needsUpdate=I,S.directionalLights.needsUpdate=I,S.directionalLightShadows.needsUpdate=I,S.pointLights.needsUpdate=I,S.pointLightShadows.needsUpdate=I,S.spotLights.needsUpdate=I,S.spotLightShadows.needsUpdate=I,S.rectAreaLights.needsUpdate=I,S.hemisphereLights.needsUpdate=I}function Ic(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(S,I,z){const H=ve.get(S);H.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ve.get(S.texture).__webglTexture=I,ve.get(S.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:z,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,I){const z=ve.get(S);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0};const Uc=R.createFramebuffer();this.setRenderTarget=function(S,I=0,z=0){O=S,w=I,C=z;let H=!0,U=null,ee=!1,he=!1;if(S){const de=ve.get(S);if(de.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(R.FRAMEBUFFER,null),H=!1;else if(de.__webglFramebuffer===void 0)Oe.setupRenderTarget(S);else if(de.__hasExternalTextures)Oe.rebindTextures(S,ve.get(S.texture).__webglTexture,ve.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const be=S.depthTexture;if(de.__boundDepthTexture!==be){if(be!==null&&ve.has(be)&&(S.width!==be.image.width||S.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(S)}}const Ae=S.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(he=!0);const Le=ve.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Le[I])?U=Le[I][z]:U=Le[I],ee=!0):S.samples>0&&Oe.useMultisampledRTT(S)===!1?U=ve.get(S).__webglMultisampledFramebuffer:Array.isArray(Le)?U=Le[z]:U=Le,T.copy(S.viewport),N.copy(S.scissor),D=S.scissorTest}else T.copy(le).multiplyScalar(V).floor(),N.copy(we).multiplyScalar(V).floor(),D=qe;if(z!==0&&(U=Uc),_e.bindFramebuffer(R.FRAMEBUFFER,U)&&H&&_e.drawBuffers(S,U),_e.viewport(T),_e.scissor(N),_e.setScissorTest(D),ee){const de=ve.get(S.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,de.__webglTexture,z)}else if(he){const de=I;for(let Ae=0;Ae<S.textures.length;Ae++){const Le=ve.get(S.textures[Ae]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ae,Le.__webglTexture,z,de)}}else if(S!==null&&z!==0){const de=ve.get(S.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,de.__webglTexture,z)}E=-1},this.readRenderTargetPixels=function(S,I,z,H,U,ee,he,me=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&he!==void 0&&(de=de[he]),de){_e.bindFramebuffer(R.FRAMEBUFFER,de);try{const Ae=S.textures[me],Le=Ae.format,be=Ae.type;if(!Pe.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=S.width-H&&z>=0&&z<=S.height-U&&(S.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+me),R.readPixels(I,z,H,U,Se.convert(Le),Se.convert(be),ee))}finally{const Ae=O!==null?ve.get(O).__webglFramebuffer:null;_e.bindFramebuffer(R.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(S,I,z,H,U,ee,he,me=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=ve.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&he!==void 0&&(de=de[he]),de)if(I>=0&&I<=S.width-H&&z>=0&&z<=S.height-U){_e.bindFramebuffer(R.FRAMEBUFFER,de);const Ae=S.textures[me],Le=Ae.format,be=Ae.type;if(!Pe.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ke=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,ke),R.bufferData(R.PIXEL_PACK_BUFFER,ee.byteLength,R.STREAM_READ),S.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+me),R.readPixels(I,z,H,U,Se.convert(Le),Se.convert(be),0);const Ze=O!==null?ve.get(O).__webglFramebuffer:null;_e.bindFramebuffer(R.FRAMEBUFFER,Ze);const ot=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Uh(R,ot,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,ke),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,ee),R.deleteBuffer(ke),R.deleteSync(ot),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,I=null,z=0){const H=Math.pow(2,-z),U=Math.floor(S.image.width*H),ee=Math.floor(S.image.height*H),he=I!==null?I.x:0,me=I!==null?I.y:0;Oe.setTexture2D(S,0),R.copyTexSubImage2D(R.TEXTURE_2D,z,0,0,he,me,U,ee),_e.unbindTexture()};const Nc=R.createFramebuffer(),Fc=R.createFramebuffer();this.copyTextureToTexture=function(S,I,z=null,H=null,U=0,ee=null){ee===null&&(U!==0?(_s("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=U,U=0):ee=0);let he,me,de,Ae,Le,be,ke,Ze,ot;const tt=S.isCompressedTexture?S.mipmaps[ee]:S.image;if(z!==null)he=z.max.x-z.min.x,me=z.max.y-z.min.y,de=z.isBox3?z.max.z-z.min.z:1,Ae=z.min.x,Le=z.min.y,be=z.isBox3?z.min.z:0;else{const zt=Math.pow(2,-U);he=Math.floor(tt.width*zt),me=Math.floor(tt.height*zt),S.isDataArrayTexture?de=tt.depth:S.isData3DTexture?de=Math.floor(tt.depth*zt):de=1,Ae=0,Le=0,be=0}H!==null?(ke=H.x,Ze=H.y,ot=H.z):(ke=0,Ze=0,ot=0);const Qe=Se.convert(I.format),Te=Se.convert(I.type);let rt;I.isData3DTexture?(Oe.setTexture3D(I,0),rt=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Oe.setTexture2DArray(I,0),rt=R.TEXTURE_2D_ARRAY):(Oe.setTexture2D(I,0),rt=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const Ge=R.getParameter(R.UNPACK_ROW_LENGTH),It=R.getParameter(R.UNPACK_IMAGE_HEIGHT),pi=R.getParameter(R.UNPACK_SKIP_PIXELS),Ut=R.getParameter(R.UNPACK_SKIP_ROWS),Ki=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,tt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,tt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ae),R.pixelStorei(R.UNPACK_SKIP_ROWS,Le),R.pixelStorei(R.UNPACK_SKIP_IMAGES,be);const at=S.isDataArrayTexture||S.isData3DTexture,kt=I.isDataArrayTexture||I.isData3DTexture;if(S.isDepthTexture){const zt=ve.get(S),At=ve.get(I),Lt=ve.get(zt.__renderTarget),yr=ve.get(At.__renderTarget);_e.bindFramebuffer(R.READ_FRAMEBUFFER,Lt.__webglFramebuffer),_e.bindFramebuffer(R.DRAW_FRAMEBUFFER,yr.__webglFramebuffer);for(let Wn=0;Wn<de;Wn++)at&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ve.get(S).__webglTexture,U,be+Wn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ve.get(I).__webglTexture,ee,ot+Wn)),R.blitFramebuffer(Ae,Le,he,me,ke,Ze,he,me,R.DEPTH_BUFFER_BIT,R.NEAREST);_e.bindFramebuffer(R.READ_FRAMEBUFFER,null),_e.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(U!==0||S.isRenderTargetTexture||ve.has(S)){const zt=ve.get(S),At=ve.get(I);_e.bindFramebuffer(R.READ_FRAMEBUFFER,Nc),_e.bindFramebuffer(R.DRAW_FRAMEBUFFER,Fc);for(let Lt=0;Lt<de;Lt++)at?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,zt.__webglTexture,U,be+Lt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,zt.__webglTexture,U),kt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,At.__webglTexture,ee,ot+Lt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,At.__webglTexture,ee),U!==0?R.blitFramebuffer(Ae,Le,he,me,ke,Ze,he,me,R.COLOR_BUFFER_BIT,R.NEAREST):kt?R.copyTexSubImage3D(rt,ee,ke,Ze,ot+Lt,Ae,Le,he,me):R.copyTexSubImage2D(rt,ee,ke,Ze,Ae,Le,he,me);_e.bindFramebuffer(R.READ_FRAMEBUFFER,null),_e.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else kt?S.isDataTexture||S.isData3DTexture?R.texSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,Te,tt.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,tt.data):R.texSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,Te,tt):S.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,ee,ke,Ze,he,me,Qe,Te,tt.data):S.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,ee,ke,Ze,tt.width,tt.height,Qe,tt.data):R.texSubImage2D(R.TEXTURE_2D,ee,ke,Ze,he,me,Qe,Te,tt);R.pixelStorei(R.UNPACK_ROW_LENGTH,Ge),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,It),R.pixelStorei(R.UNPACK_SKIP_PIXELS,pi),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ut),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ki),ee===0&&I.generateMipmaps&&R.generateMipmap(rt),_e.unbindTexture()},this.initRenderTarget=function(S){ve.get(S).__webglFramebuffer===void 0&&Oe.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Oe.setTextureCube(S,0):S.isData3DTexture?Oe.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Oe.setTexture2DArray(S,0):Oe.setTexture2D(S,0),_e.unbindTexture()},this.resetState=function(){w=0,C=0,O=null,_e.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),t.unpackColorSpace=We._getUnpackColorSpace()}}function ig(i){return i==="performance"||i==="full"?i:"auto"}function sa(i,e,t){const n=i==="performance"||i==="auto"&&e,s=Number.isFinite(t)&&t>0?t:1;return{lean:n,webglRatio:Math.min(s,n?1:1.7),effectsRatio:Math.min(s,n?1:2)}}class sg{carry=0;elapsed=0;reset(){this.carry=this.elapsed=0}advance(e){this.carry+=e,this.elapsed+=e;const t=1/60;if(this.carry+1e-9<t)return null;this.carry=Math.max(0,this.carry-Math.floor((this.carry+1e-9)/t)*t);const n=this.elapsed;return this.elapsed=0,n}}function rg(i,e){i.count=e,i.instanceMatrix.clearUpdateRanges(),i.instanceColor?.clearUpdateRanges(),e&&(i.instanceMatrix.addUpdateRange(0,e*16),i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.addUpdateRange(0,e*3),i.instanceColor.needsUpdate=!0))}const os=i=>`#${i.toString(16).padStart(6,"0")}`,vt=(i,e)=>i+Math.random()*(e-i),ag=()=>{const i=document.createElement("canvas");i.width=i.height=512;const e=i.getContext("2d");e.fillStyle="#191923",e.fillRect(0,0,512,512);for(let n=0;n<8;n++)for(let s=0;s<8;s++){const r=s*64,a=n*64;e.fillStyle=(s+n)%2?"#20212b":"#242630",e.fillRect(r+2,a+2,60,60),e.strokeStyle="#383744",e.lineWidth=1,e.strokeRect(r+2.5,a+2.5,59,59),e.strokeStyle="rgba(255,211,143,.05)",e.beginPath(),e.moveTo(r+vt(8,25),a+vt(5,22)),e.lineTo(r+vt(32,55),a+vt(35,60)),e.stroke()}for(let n=0;n<480;n++)e.fillStyle=Math.random()<.3?"#8f7159":"#343642",e.fillRect(vt(0,512),vt(0,512),vt(1,3),vt(1,3));const t=new tr(i);return t.wrapS=t.wrapT=ar,t.repeat.set(15,15),t.colorSpace=ft,t.magFilter=Mt,t},og={rat:"rogue",cultist:"necromancer",brute:"warrior",wisp:"alchemist"},Dl=(i,e)=>{const t=new cc().load(i);return t.repeat.set(.1,1),t.offset.set(e/10,0),t.magFilter=Mt,t.minFilter=Mt,t.colorSpace=ft,t.needsUpdate=!0,t};class lg{host;game;scene=new ru;camera=new hc(-20,20,12,-12,.1,100);renderer=new ng({antialias:!1,alpha:!1,powerPreference:"high-performance"});overlay=document.createElement("canvas");ctx=this.overlay.getContext("2d");minimap;player;enemyMeshes=new Map;heroTextures={};hamImage=new Image;heroAtlas=new Image;dummy=new Tt;viewWidth=40;viewHeight=24;width=1;height=1;cameraX=Ce/2;cameraY=Ce/2;decorations;shrineMeshes=[];resizeObserver;profile=sa("full",!1,1);groups=new Map;enemyColor=new Xe;minimapElapsed=.1;setGraphics(e){this.profile=sa(e,matchMedia("(pointer:coarse)").matches,devicePixelRatio),this.resize()}glow(e){return this.profile.lean?0:e}constructor(e,t,n,s="auto"){this.host=e,this.game=t,this.minimap=n,this.profile=sa(s,matchMedia("(pointer:coarse)").matches,devicePixelRatio),this.scene.background=new Xe(1052697),this.renderer.setPixelRatio(this.profile.webglRatio),this.renderer.outputColorSpace=ft,this.renderer.domElement.className="game-canvas",e.append(this.renderer.domElement),this.overlay.className="fx-canvas",e.append(this.overlay);const r=new Ct(new Jt(Ce,Ce),new Sn({map:ag()}));r.position.set(Ce/2,Ce/2,-2),this.scene.add(r);const a=new Jt(1.5,1.5),o=(()=>{const p=document.createElement("canvas");p.width=p.height=64;const y=p.getContext("2d");y.strokeStyle="#897759",y.lineWidth=4,y.beginPath(),y.arc(32,32,23,0,6.28),y.moveTo(32,4),y.lineTo(32,60),y.moveTo(4,32),y.lineTo(60,32),y.stroke(),y.fillStyle="#ae9c6b",y.fillRect(28,28,8,8);const A=new tr(p);return A.colorSpace=ft,A})();this.decorations=new rs(a,new Sn({map:o,transparent:!0,opacity:.23,depthWrite:!1}),280);for(let p=0;p<280;p++)this.dummy.position.set(vt(3,Ce-3),vt(3,Ce-3),-1.5),this.dummy.rotation.z=vt(0,6.28),this.dummy.updateMatrix(),this.decorations.setMatrixAt(p,this.dummy.matrix);this.decorations.instanceMatrix.needsUpdate=!0,this.scene.add(this.decorations);const l=new al(new fn().setFromPoints([new B(1,1,-1),new B(Ce-1,1,-1),new B(Ce-1,Ce-1,-1),new B(1,Ce-1,-1)]),new ac({color:11701091}));this.scene.add(l);const c=document.createElement("canvas");c.width=c.height=96;const h=c.getContext("2d");h.fillStyle="#50505b",h.fillRect(14,14,68,68),h.fillStyle="#77717c",h.fillRect(17,17,59,15),h.fillStyle="#282832",h.fillRect(17,69,59,8),h.strokeStyle="#bca27e",h.lineWidth=3,h.strokeRect(14,14,68,68),h.beginPath(),h.moveTo(27,18),h.lineTo(43,46),h.lineTo(32,71),h.moveTo(63,17),h.lineTo(54,41),h.lineTo(70,64),h.stroke();const u=new tr(c);u.colorSpace=ft;const f=new rs(new Jt(2.4,2.4),new Sn({map:u,transparent:!0}),45);let g=0;for(let p=20;p<Ce-12;p+=30)for(let y=18;y<Ce-12;y+=30)Math.abs(y-90)<20&&Math.abs(p-90)<20||(this.dummy.position.set(y+vt(-4,4),p+vt(-4,4),-1),this.dummy.rotation.z=vt(-.5,.5),this.dummy.scale.set(vt(1,1.5),vt(1,1.5),1),this.dummy.updateMatrix(),f.setMatrixAt(g++,this.dummy.matrix));f.count=g,f.instanceMatrix.needsUpdate=!0,this.scene.add(f);const x=document.createElement("canvas");x.width=x.height=128;const M=x.getContext("2d");M.translate(64,64),M.strokeStyle="#78ffc0",M.lineWidth=4,M.shadowColor="#63ffba",M.shadowBlur=18,M.beginPath(),M.arc(0,0,47,0,6.28),M.stroke(),M.beginPath(),M.arc(0,0,32,0,6.28),M.stroke(),M.fillStyle="#c0ffe0",M.font="65px Georgia",M.textAlign="center",M.textBaseline="middle",M.fillText("✚",0,3);const m=new tr(x);m.colorSpace=ft;for(const p of t.shrines){const y=new Ct(new Jt(5.6,5.6),new Sn({map:m,transparent:!0,opacity:.78,depthWrite:!1}));y.position.set(p.x,p.y,-.7),this.scene.add(y),this.shrineMeshes.push(y);for(let A=0;A<4;A++){const w=A*Math.PI/2+Math.PI/4,C=new Ct(new Jt(1.4,1.4),new Sn({map:u,transparent:!0}));C.position.set(p.x+Math.cos(w)*4,p.y+Math.sin(w)*4,-.6),C.rotation.z=w,this.scene.add(C)}}const d=new cc;for(const p of["rat","cultist","brute","wisp"])for(const[y,A]of[["left",2],["right",3]]){const w=new Sn({map:Dl(`/raid-survivor/sprites/characters/${og[p]}.png`,A),transparent:!0,depthWrite:!1,side:tn}),C=new rs(new Jt(1,1),w,In);C.instanceMatrix.setUsage(Io),C.count=0,C.frustumCulled=!1,this.enemyMeshes.set(`${p}-${y}`,C),this.scene.add(C)}const P=d.load("/raid-survivor/characters/moloch.png");P.colorSpace=ft,P.magFilter=Mt;for(const p of["left","right"]){const y=new Sn({map:P,transparent:!0,depthWrite:!1,side:tn}),A=new rs(new Jt(1,1),y,16);A.instanceMatrix.setUsage(Io),A.count=0,A.frustumCulled=!1,this.enemyMeshes.set(`boss-${p}`,A),this.scene.add(A)}for(const[p,y]of Object.entries({left:2,right:3,"attack-left":6,"attack-right":7}))this.heroTextures[p]=Dl(`/raid-survivor/sprites/characters/${t.hero}.png`,y);this.heroAtlas.src=`/raid-survivor/sprites/characters/${t.hero}.png`,this.player=new el(new ic({map:this.heroTextures.right,transparent:!0,depthTest:!1})),this.player.scale.set(2.05,2.58,1),this.player.position.z=3,this.scene.add(this.player),this.hamImage.src="/raid-survivor/sprites/items.png",this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize()}resize(){this.width=this.host.clientWidth||1,this.height=this.host.clientHeight||1,this.renderer.setPixelRatio(this.profile.webglRatio),this.renderer.setSize(this.width,this.height),this.overlay.width=Math.max(1,Math.floor(this.width*this.profile.effectsRatio)),this.overlay.height=Math.max(1,Math.floor(this.height*this.profile.effectsRatio)),this.overlay.style.width=`${this.width}px`,this.overlay.style.height=`${this.height}px`,this.ctx.setTransform(this.profile.effectsRatio,0,0,this.profile.effectsRatio,0,0),this.viewHeight=this.width<700?31:25,this.viewWidth=this.viewHeight*this.width/this.height,this.camera.left=-this.viewWidth/2,this.camera.right=this.viewWidth/2,this.camera.top=this.viewHeight/2,this.camera.bottom=-this.viewHeight/2,this.camera.updateProjectionMatrix()}screen(e,t){return{x:(e-this.cameraX)/this.viewWidth*this.width+this.width/2,y:this.height/2-(t-this.cameraY)/this.viewHeight*this.height}}world(e,t){return{x:this.cameraX+(e-this.width/2)/this.width*this.viewWidth,y:this.cameraY-(t-this.height/2)/this.height*this.viewHeight}}render(e,t=!1){const n=this.game.player,s=Math.min(1,e*7);this.cameraX+=(n.x-this.cameraX)*s,this.cameraY+=(n.y-this.cameraY)*s,this.cameraX=Math.max(this.viewWidth/2,Math.min(Ce-this.viewWidth/2,this.cameraX)),this.cameraY=Math.max(this.viewHeight/2,Math.min(Ce-this.viewHeight/2,this.cameraY)),this.camera.position.set(this.cameraX,this.cameraY,50),this.camera.lookAt(this.cameraX,this.cameraY,0);const r=this.groups;for(const o of this.enemyMeshes.keys())r.set(o,0);for(const o of this.game.enemies){if(Math.abs(o.x-this.cameraX)>this.viewWidth/2+3||Math.abs(o.y-this.cameraY)>this.viewHeight/2+3)continue;const l=`${o.kind}-${o.facing<0?"left":"right"}`,c=this.enemyMeshes.get(l),h=r.get(l)||0;if(h>=c.instanceMatrix.count)continue;this.dummy.position.set(o.x,o.y,o.y/1e3);const u=(o.kind==="boss"?5.1:o.kind==="brute"?2.2:1.65)*(o.elite?1.35:1);this.dummy.scale.set(o.kind==="boss"&&o.facing<0?-u:u,u,1),this.dummy.rotation.z=o.kind==="wisp"?Math.sin(this.game.elapsed*4+o.phase)*.12:0,this.dummy.updateMatrix(),c.setMatrixAt(h,this.dummy.matrix),c.setColorAt(h,this.enemyColor.setHex(o.flash>0?16777215:o.special==="hexcaster"?16745180:o.special==="juggernaut"?16761709:o.kind==="boss"&&o.tier===3?16748152:o.kind==="boss"&&o.tier===2?16759440:o.elite?16766621:16777215)),r.set(l,h+1)}for(const[o,l]of this.enemyMeshes)rg(l,r.get(o)||0);for(let o=0;o<this.shrineMeshes.length;o++){const l=this.shrineMeshes[o].material;l.opacity=this.game.shrines[o].active?.78:.17,this.shrineMeshes[o].position.x=this.game.shrines[o].x,this.shrineMeshes[o].position.y=this.game.shrines[o].y,this.shrineMeshes[o].rotation.z+=e*.15}const a=this.game.dead&&this.game.deathReason==="combat";this.player.visible=!a||t,this.player.position.set(n.x,a?n.y:n.y+Math.sin(this.game.elapsed*6)*.08,4),this.player.material.map=this.heroTextures[`${(a?this.game.deathFiring:this.game.firing)?"attack-":""}${(a?this.game.deathFacing:this.game.facing)<0?"left":"right"}`],this.player.material.color.setHex(a?16777215:n.invuln>0&&Math.floor(this.game.elapsed*18)%2?16740748:16777215),this.player.material.opacity=a&&t?Math.max(0,1-this.game.deathProgress):1,this.renderer.render(this.scene,this.camera),this.drawFx(),this.minimapElapsed+=e,this.minimapElapsed>=.1&&(this.minimapElapsed%=.1,this.drawMinimap())}drawFx(){const e=this.ctx;e.clearRect(0,0,this.width,this.height);const t=this.width/this.viewWidth;for(const r of this.game.projectiles){const a=this.screen(r.x,r.y);a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20||(e.save(),e.translate(a.x,a.y),e.rotate(Math.atan2(-r.vy,r.vx)),e.shadowColor=os(bt[r.kind].color),e.shadowBlur=this.glow(16),e.fillStyle=os(bt[r.kind].color),e.beginPath(),e.ellipse(0,0,Math.max(4,r.radius*t*1.6),Math.max(2,r.radius*t*.58),0,0,6.28),e.fill(),e.restore())}for(const r of this.game.enemyShots){const a=this.screen(r.x,r.y);a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20||(e.fillStyle=r.boss?"#ffb079":"#f2a1d8",e.shadowColor=e.fillStyle,e.shadowBlur=this.glow(17),e.beginPath(),e.arc(a.x,a.y,Math.max(3,r.radius*t),0,6.28),e.fill(),e.shadowBlur=0)}for(const r of this.game.pickups){const a=this.screen(r.x,r.y);if(a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20)continue;const o=r.kind==="xp"?"#8df3cb":r.kind==="heart"?"#94ffb3":"#ffd277",l=r.kind==="chest"?12:5;e.fillStyle=o,e.shadowColor=o,e.shadowBlur=this.glow(r.kind==="chest"?20:9),e.beginPath(),r.kind==="heart"&&this.hamImage.complete&&this.hamImage.naturalWidth?e.drawImage(this.hamImage,0,0,48,48,a.x-17,a.y-17,34,34):r.kind==="chest"?(e.fillRect(a.x-l,a.y-l,l*2,l*2),e.fillStyle="#4b2e42",e.fillRect(a.x-4,a.y-8,8,13)):(e.arc(a.x,a.y,l,0,6.28),e.fill()),e.shadowBlur=0}for(const r of this.game.shrines){if(!r.active)continue;const a=this.screen(r.x,r.y);a.x<0||a.x>this.width||a.y<0||a.y>this.height||(e.fillStyle="#baffd1",e.shadowColor="#63ffba",e.shadowBlur=this.glow(16),e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center",e.fillText("✚ HEAL + XP",a.x,a.y-45),e.shadowBlur=0)}if(this.game.bombWave){const r=this.game.bombWave,a=this.screen(this.game.player.x,this.game.player.y);e.save(),e.strokeStyle=this.game.hero==="ranger"?"#8ff8b0":this.game.hero==="wizard"?"#a9c9ff":"#ffca8d",e.lineWidth=7,e.shadowColor=e.strokeStyle,e.shadowBlur=this.glow(28),e.globalAlpha=.9-r.age*.7,e.beginPath(),e.arc(a.x,a.y,r.radius*t,0,Math.PI*2),e.stroke(),e.restore()}const n=this.game.dead&&this.game.deathReason==="combat",s=this.screen(this.game.player.x,this.game.player.y);if(n||(e.strokeStyle="rgba(159,240,194,.55)",e.lineWidth=2,e.beginPath(),e.ellipse(s.x,s.y+19,20,6,0,0,6.28),e.stroke(),this.game.player.dashCooldown<=0&&(e.strokeStyle="rgba(171,255,207,.7)",e.beginPath(),e.arc(s.x,s.y,26,0,6.28),e.stroke())),!n&&this.game.weapons.orbit&&this.game.slots.includes("orbit")){const r=this.game.weapons.orbit,a=2+r;for(let o=0;o<a;o++){const l=this.game.elapsed*(2.7+r*.15)+o*6.28/a,c=this.screen(this.game.player.x+Math.cos(l)*(2.2+r*.2),this.game.player.y+Math.sin(l)*(2.2+r*.2));e.save(),e.translate(c.x,c.y),e.rotate(l),e.fillStyle="#ffe5a4",e.shadowColor="#ffd071",e.shadowBlur=this.glow(17),e.beginPath(),e.moveTo(0,-12),e.lineTo(5,0),e.lineTo(0,12),e.lineTo(-5,0),e.closePath(),e.fill(),e.restore()}}n&&this.player.visible===!1&&this.drawDeath(e,s.x,s.y,t);for(const r of this.game.effects){const a=this.screen(r.x,r.y),o=1-r.life/r.max,l=r.kind==="zap"&&r.x2!==void 0&&r.y2!==void 0?this.screen(r.x2,r.y2):a,c=Math.max(60,r.size*t*1.4+24);if(!(Math.max(a.x,l.x)+c<0||Math.min(a.x,l.x)-c>this.width||Math.max(a.y,l.y)+c<0||Math.min(a.y,l.y)-c>this.height))if(e.globalAlpha=Math.max(0,r.life/r.max),e.strokeStyle=os(r.color),e.fillStyle=os(r.color),e.shadowColor=os(r.color),e.shadowBlur=this.glow(20),e.lineWidth=3,r.kind==="zap"&&r.x2!==void 0&&r.y2!==void 0){const h=this.screen(r.x2,r.y2);e.beginPath(),e.moveTo(a.x,a.y);const u=(a.x+h.x)/2,f=(a.y+h.y)/2;e.lineTo(u+vt(-8,8),f+vt(-8,8)),e.lineTo(h.x,h.y),e.stroke()}else r.kind==="ring"||r.kind==="comet"?(e.beginPath(),e.arc(a.x,a.y,Math.max(1,r.size*t*(r.kind==="comet"?1-o*.25:o)),0,6.28),e.stroke(),r.kind==="comet"&&(e.fillStyle="rgba(255,145,101,.11)",e.fill())):r.kind==="text"?(e.font="900 22px Cinzel, Georgia, serif",e.textAlign="center",e.fillText(r.text||"",a.x,a.y-o*45)):(e.beginPath(),e.arc(a.x,a.y,r.size*t*(.3+o),0,6.28),e.fill())}e.globalAlpha=1,e.shadowBlur=0,this.drawWarnings(e,t);for(const r of this.game.enemies){if(!r.elite&&r.kind!=="boss"||r.hp<=0)continue;const a=this.screen(r.x,r.y);if(a.x<0||a.x>this.width||a.y<0||a.y>this.height)continue;const o=r.kind==="boss"?125:r.special?75:36;if(e.fillStyle="#2c1c29",e.fillRect(a.x-o/2,a.y-45,o,7),e.fillStyle=r.kind==="boss"?"#f4bd76":r.special==="hexcaster"?"#ff75d5":"#ffbd68",e.fillRect(a.x-o/2,a.y-45,o*r.hp/r.maxHp,7),r.kind==="boss"||r.special){e.font=`900 ${r.kind==="boss"?12:10}px Cinzel,Georgia,serif`,e.textAlign="center",e.fillStyle=r.special==="hexcaster"?"#ffc0ed":"#ffe2b4";const l=r.special==="hexcaster"?"HEXCASTER":r.special==="juggernaut"?"JUGGERNAUT":r.tier===3?"MOLOCH UNBOUND":r.tier===2?"ASCENDED MOLOCH":"MOLOCH";e.fillText(l,a.x,a.y-51)}}}drawWarnings(e,t){for(const n of this.game.hazards){const s=this.screen(n.x,n.y),r=n.radius*t;if(s.x+r<0||s.x-r>this.width||s.y+r<0||s.y-r>this.height)continue;const a=n.kind==="hex"?"#ff78d2":"#ffad70";e.save(),e.fillStyle=n.kind==="hex"?"rgba(231,75,187,.26)":"rgba(255,129,72,.29)",e.strokeStyle=a,e.lineWidth=2,e.shadowColor=a,e.shadowBlur=this.glow(12),e.beginPath(),e.arc(s.x,s.y,r,0,Math.PI*2),e.fill(),e.stroke(),e.shadowBlur=0,e.lineWidth=5,e.beginPath(),e.arc(s.x,s.y,r+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,n.delay/n.duration)),e.stroke(),e.restore()}for(const n of this.game.enemies){if(n.special!=="juggernaut"||n.specialState!=="windup")continue;const s=Oc(n),r=this.screen(s.x1,s.y1),a=this.screen(s.x2,s.y2),o=Math.atan2(a.y-r.y,a.x-r.x),l=s.radius*t;e.save(),e.fillStyle="rgba(255,165,72,.29)",e.strokeStyle="#ffbf69",e.lineWidth=2,e.shadowColor="#ff9b3f",e.shadowBlur=this.glow(9),e.beginPath(),e.moveTo(r.x-Math.sin(o)*l,r.y+Math.cos(o)*l),e.lineTo(a.x-Math.sin(o)*l,a.y+Math.cos(o)*l),e.arc(a.x,a.y,l,o+Math.PI/2,o-Math.PI/2,!0),e.lineTo(r.x+Math.sin(o)*l,r.y-Math.cos(o)*l),e.arc(r.x,r.y,l,o-Math.PI/2,o+Math.PI/2,!0),e.closePath(),e.fill(),e.stroke(),e.shadowBlur=0,e.strokeStyle="#fff0bf",e.lineWidth=5,e.beginPath(),e.arc(r.x,r.y,l+7,-Math.PI/2,-Math.PI/2+2*Math.PI*Math.max(0,n.specialTimer/.9)),e.stroke(),e.restore()}}drawDeath(e,t,n,s){const r=this.heroAtlas,a=Math.max(0,Math.min(1,this.game.deathProgress));if(a>=1||!r.complete||!r.naturalWidth)return;const o=this.game.deathFiring?this.game.deathFacing<0?6:7:this.game.deathFacing<0?2:3,l=2.05*s,c=2.58*s,h=t-l/2,u=n-c/2,f=18,g=68/f;e.save(),e.imageSmoothingEnabled=!1;for(let M=0;M<f;M++){const m=M/f,d=Math.min(1,Math.max(0,(a-m*.33)/.67)),P=M*g,p=u+m*c+d*d*c*(.28+.32*m),y=Math.max(0,1-Math.max(0,(a-.42-m*.16)*1.8))*Math.min(1,(1-a)/.22);if(y<=0)continue;e.globalAlpha=y;const A=Math.sin(M*13.7)*a*l*.13;e.drawImage(r,o*54,P,54,g,h+A,p,l,c/f+1)}const x=28;for(let M=0;M<x;M++){const m=M%11/17;if(a<m||a>.94)continue;const d=(a-m)/(.94-m),P=M*17%50,p=M*29%62,y=h+P/54*l+Math.sin(M*47.1)*.5*d*l,A=u+p/68*c+d*d*c*.72;e.globalAlpha=Math.max(0,1-d*.95),e.drawImage(r,o*54+P,p,4,4,y,A,Math.max(2,l*4/54),Math.max(2,c*4/68))}e.globalAlpha=Math.max(0,Math.sin(a*Math.PI))*.7,e.fillStyle=this.game.hero==="ranger"?"#5bba81":this.game.hero==="wizard"?"#806fd1":"#c18a55",e.beginPath(),e.ellipse(t,n+c*.48,l*(.15+a*.43),c*.06,0,0,Math.PI*2),e.fill(),e.restore()}drawMinimap(){const e=this.minimap.getContext("2d"),t=this.minimap.width,n=this.minimap.height;e.fillStyle="#171722",e.fillRect(0,0,t,n),e.strokeStyle="#8a7360",e.strokeRect(1,1,t-2,n-2),e.fillStyle="#80ffc0";for(const r of this.game.shrines)if(r.active){const a=r.x/Ce*t,o=(1-r.y/Ce)*n;e.fillRect(a-1,o-4,3,9),e.fillRect(a-4,o-1,9,3)}e.fillStyle="#e47786";for(const r of this.game.enemies)(r.kind==="boss"||r.elite)&&(e.beginPath(),e.arc(r.x/Ce*t,(1-r.y/Ce)*n,r.kind==="boss"?3:1.5,0,6.28),e.fill());const s=this.game.player;e.fillStyle="#aff3c6",e.beginPath(),e.arc(s.x/Ce*t,(1-s.y/Ce)*n,3,0,6.28),e.fill(),e.strokeStyle="#aaffd0",e.strokeRect((this.cameraX-this.viewWidth/2)/Ce*t,(1-(this.cameraY+this.viewHeight/2)/Ce)*n,this.viewWidth/Ce*t,this.viewHeight/Ce*n)}dispose(){this.resizeObserver.disconnect(),this.scene.traverse(e=>{if(e instanceof Ct||e instanceof rs||e instanceof al||e instanceof el){e.geometry?.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)"map"in n&&n.map instanceof xt&&n.map.dispose(),n.dispose()}});for(const e of Object.values(this.heroTextures))e.dispose();this.renderer.dispose(),this.renderer.forceContextLoss(),this.host.replaceChildren()}}const cg=1024,Ka=130,hg=60/Ka/4,Il={drums:!0,bass:!0,arp:!0,lead:!0,air:!0},ug=i=>440*Math.pow(2,(i-69)/12),dg=[{root:38,chord:[62,65,69],name:"Dm"},{root:34,chord:[58,62,65],name:"Bb"},{root:41,chord:[60,65,69],name:"F"},{root:36,chord:[60,64,67],name:"C"},{root:43,chord:[62,67,70],name:"Gm"},{root:34,chord:[62,65,70],name:"Bb"},{root:38,chord:[62,65,69],name:"Dm"},{root:33,chord:[61,64,69],name:"A"}],fg=[[74,null,77,76,74,null,69,72],[74,null,77,79,77,74,72,null],[77,null,81,79,77,76,74,null],[76,null,79,77,76,72,69,null],[79,null,82,81,79,77,74,null],[77,74,null,77,82,81,77,null],[81,77,74,null,77,76,74,72],[73,null,76,81,79,76,73,null]];function pg(i,e=38,t=Il){const n=i.createGain(),s=i.createDynamicsCompressor(),r=i.createGain();s.threshold.value=-15,s.knee.value=16,s.ratio.value=5,s.attack.value=.004,s.release.value=.17,n.connect(s),s.connect(r),r.connect(i.destination),r.gain.value=e/100*.72;const a={};for(const v of Object.keys(Il))a[v]=i.createGain(),a[v].gain.value=t[v]?1:0,a[v].connect(n);const o=i.createDelay(1);o.delayTime.value=60/Ka*.75;const l=i.createGain();l.gain.value=.24;const c=i.createBiquadFilter();c.type="lowpass",c.frequency.value=2900;const h=i.createGain();h.gain.value=.18,o.connect(c),c.connect(l),l.connect(o),c.connect(h),h.connect(n);const u=i.createConvolver(),f=i.createGain();f.gain.value=.12;const g=i.createBuffer(2,i.sampleRate*1.6,i.sampleRate);let x=93;const M=()=>(x=Math.imul(x,1664525)+1013904223>>>0,x/4294967296);for(let v=0;v<2;v++){const T=g.getChannelData(v);for(let N=0;N<T.length;N++)T[N]=(M()*2-1)*Math.pow(1-N/T.length,3.2)}u.buffer=g,u.connect(f),f.connect(n);const m=i.createBuffer(1,i.sampleRate,i.sampleRate),d=m.getChannelData(0);for(let v=0;v<d.length;v++)d[v]=M()*2-1;const P=new Set;function p(v,T,N){P.add(v),v.onended=()=>{P.delete(v),v.disconnect()},v.start(T),v.stop(T+N)}function y(v,T,N,D,Y,G,W=2800,Z=0,V=0,se=.007){const ae=i.createOscillator(),le=i.createBiquadFilter(),we=i.createGain(),qe=i.createStereoPanner();if(ae.type=D,ae.frequency.setValueAtTime(ug(v),T),le.type="lowpass",le.frequency.setValueAtTime(W,T),le.frequency.exponentialRampToValueAtTime(Math.max(160,W*.45),T+N),le.Q.value=D==="sawtooth"?1.8:.6,qe.pan.value=Z,we.gain.setValueAtTime(1e-4,T),we.gain.exponentialRampToValueAtTime(Y,T+se),we.gain.exponentialRampToValueAtTime(1e-4,T+N),ae.connect(le),le.connect(we),we.connect(qe),qe.connect(a[G]),V&&t[G]){const Ke=i.createGain();Ke.gain.value=V,qe.connect(Ke),Ke.connect(o),Ke.connect(u)}p(ae,T,N+.02)}function A(v,T,N,D,Y=0){const G=i.createBufferSource(),W=i.createBiquadFilter(),Z=i.createGain(),V=i.createStereoPanner();G.buffer=m,W.type="highpass",W.frequency.value=D,V.pan.value=Y,Z.gain.setValueAtTime(N,v),Z.gain.exponentialRampToValueAtTime(1e-4,v+T),G.connect(W),W.connect(Z),Z.connect(V),V.connect(a.drums),p(G,v,T+.01)}function w(v,T=1){const N=i.createOscillator(),D=i.createGain();N.frequency.setValueAtTime(142,v),N.frequency.exponentialRampToValueAtTime(47,v+.055),N.frequency.exponentialRampToValueAtTime(38,v+.28),D.gain.setValueAtTime(.56*T,v),D.gain.exponentialRampToValueAtTime(1e-4,v+.31),N.connect(D),D.connect(a.drums),p(N,v,.33)}function C(v,T=1){A(v,.14,.18*T,1400,-.06),y(50,v,.09,"triangle",.11*T,"drums",2100)}function O(v,T){y(v,T,.9,"sine",.075,"air",7e3,-.3,.45,.003),y(v+19,T,.42,"sine",.021,"air",8500,.3,.25,.003)}function E(v,T){const N=Math.floor(v/16),D=v%16,Y=Math.floor(N/16),G=N%16,W=dg[Math.floor(G/2)],Z=W.root,V=Y===2&&G<8,se=Y===1||Y===3;(D===0||D===8||se&&D===6||se&&D===14)&&w(T,D===6||D===14?.68:1),(D===4||D===12)&&C(T,D===12?1:.92),D%2===0&&A(T,D===14?.12:.035,D%4===2?.075:.045,6500,D%4===2?.25:-.2),se&&D%2===1&&D!==15&&A(T,.022,.024,7800,D%4<2?-.35:.35),G%4===3&&D===15&&(C(T,.33),A(T+.045,.035,.033,6e3));const ae=[0,null,0,12,null,null,7,null,0,null,0,null,12,null,7,null];if(ae[D]!==null){const le=D===0||D===8?.18:.12;y(Z+ae[D],T,le,"sawtooth",.095,"bass",620+D%4*170),y(Z+ae[D]-12,T,le+.03,"sine",.075,"bass",160)}if(!V||D%2===0){const le=[0,1,2,1,0,2,1,2,0,1,2,1,2,1,0,2][D],we=D===7||D===15?12:0;y(W.chord[le]+we,T,.12,"triangle",D%4===0?.055:.036,"arp",3700,D%2?-.32:.32,.3)}if(D%2===0&&(Y!==0||G>=4)&&!V){const le=fg[Math.floor(G/2)],we=le[D/2];we!==null&&!(G%2===0&&D===14)&&y(we+(Y===3&&G>=8?12:0),T,D===0?.29:.21,"square",se?.036:.028,"lead",2200,.08,.44)}if(D===0){for(let le=0;le<W.chord.length;le++)y(W.chord[le]-12,T,60/Ka*4*.97,"triangle",.029,"air",900,(le-1)*.55,.3,.2);G%4===0&&O(W.chord[0]+12,T)}Y===2&&G<8&&D===10&&G%2===1&&O(W.chord[2],T)}return{schedule:E,out:r,buses:a,stop(){r.gain.cancelScheduledValues(i.currentTime),r.gain.setTargetAtTime(0,i.currentTime,.025);for(const v of P)try{v.stop(i.currentTime+.12)}catch{}}}}const gc="raid-music-volume",_c="raid-music-muted";function mg(){try{const i=localStorage.getItem(gc);if(i===null)return 38;const e=Number(i);return Number.isFinite(e)?Math.min(100,Math.max(0,e)):38}catch{return 38}}function gg(){try{return localStorage.getItem(_c)==="true"}catch{return!1}}class _g{context=null;engine=null;timer=null;pending=null;generation=0;step=0;nextTime=0;activated=!1;disposed=!1;creationCount=0;volume=mg();muted=gg();onVisibility=()=>{document.hidden?this.pauseForHidden():this.activated&&this.start()};onPageHide=()=>{this.release()};onPageShow=()=>{this.activated&&!document.hidden&&this.start()};constructor(){document.addEventListener("visibilitychange",this.onVisibility),window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow)}snapshot(){return{activated:this.activated,playing:!!this.timer,contextState:this.context?.state??"none",timerCount:this.timer?1:0,step:this.step,volume:this.volume,muted:this.muted,creationCount:this.creationCount}}setVolume(e){this.volume=Number.isFinite(e)?Math.min(100,Math.max(0,e)):38;try{localStorage.setItem(gc,String(this.volume))}catch{}this.applyGain()}setMuted(e){this.muted=e;try{localStorage.setItem(_c,String(e))}catch{}this.applyGain()}toggleMuted(){this.setMuted(!this.muted)}applyGain(){this.engine&&this.context&&this.engine.out.gain.setTargetAtTime(this.muted?0:this.volume/100*.72,this.context.currentTime,.03)}start(){if(this.disposed||(this.activated=!0,document.hidden)||this.timer&&this.context?.state==="running")return Promise.resolve();if(this.pending)return this.pending;const e=++this.generation;let t;try{t=this.context??new AudioContext}catch{return Promise.resolve()}this.context||(this.context=t,this.creationCount++);let n;try{n=t.resume()}catch{return Promise.resolve()}const s=n.then(()=>{if(this.disposed||e!==this.generation||document.hidden||t.state!=="running"){document.hidden&&t===this.context&&t.state==="running"&&this.suspendAfterHide(t);return}this.engine?this.nextTime=Math.max(this.nextTime,t.currentTime+.06):(this.engine=pg(t,this.muted?0:this.volume),this.nextTime=t.currentTime+.06),this.schedule(),this.timer||(this.timer=setInterval(()=>this.schedule(),25))}).catch(()=>{}).finally(()=>{this.pending===s&&(this.pending=null)});return this.pending=s,s}schedule(){const e=this.context,t=this.engine;if(!(!e||!t||e.state!=="running"||document.hidden||this.disposed))for(this.nextTime=Math.max(this.nextTime,e.currentTime+.01);this.nextTime<e.currentTime+.16;)t.schedule(this.step,this.nextTime),this.step=(this.step+1)%cg,this.nextTime+=hg}async suspendAfterHide(e){try{await e.suspend()}catch{return}if(this.disposed||document.hidden||e!==this.context)return;const t=this.pending;t&&await t,!(this.disposed||document.hidden||e!==this.context||e.state!=="suspended")&&(this.timer&&(clearInterval(this.timer),this.timer=null),this.start())}pauseForHidden(){this.generation++;const e=!!this.pending;this.pending=null,this.timer&&(clearInterval(this.timer),this.timer=null);const t=this.context;t&&(t.state==="running"||e)&&this.suspendAfterHide(t)}async release(){this.generation++,this.timer&&(clearInterval(this.timer),this.timer=null);const e=this.context;if(this.context=null,this.engine?.stop(),this.engine=null,this.pending=null,e&&e.state!=="closed")try{await e.close()}catch{}}dispose(){this.disposed||(this.disposed=!0,document.removeEventListener("visibilitychange",this.onVisibility),window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow),this.release())}}const Wt=new _g,ra=6,vg=40;class xg{id=-1;direction={x:0,y:0};origin={x:0,y:0};begin(e,t,n){return this.id>=0?!1:(this.id=e,this.origin={x:t,y:n},this.direction.x=this.direction.y=0,!0)}move(e,t,n){if(e!==this.id||this.id<0)return!1;const s=t-this.origin.x,r=this.origin.y-n,a=Math.hypot(s,r);if(a<=ra)this.direction.x=this.direction.y=0;else{const o=Math.min(1,(a-ra)/(vg-ra))/a;this.direction.x=s*o,this.direction.y=r*o}return!0}end(e){return this.id!==e||this.id<0?!1:(this.reset(),!0)}reset(){this.id=-1,this.direction.x=this.direction.y=0}}const go="/leaderboard-api/raid-survivor",vc="1",xr=window.self!==window.top,Mg=new URL(location.href).searchParams.get("ranked")==="launch-failed",dn={getItem(i){try{return localStorage.getItem(i)}catch{return null}},setItem(i,e){try{localStorage.setItem(i,e)}catch{}}};async function _o(i,e={},t=4e3){const n=new AbortController,s=setTimeout(()=>n.abort(),t);try{return await fetch(i,{...e,signal:n.signal,credentials:"same-origin"})}finally{clearTimeout(s)}}async function xc(i,e){return _o(go+i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}const Mc=document.querySelector("#app"),dr=Object.keys(io),Za=i=>`/raid-survivor/characters/${i}-preview.png`,Ul=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Sc=i=>`${Math.floor(i/60).toString().padStart(2,"0")}:${Math.floor(i%60).toString().padStart(2,"0")}`;let k=null,$t=null,fr="ranger",yc=0,ja=0,ir=0,pr=0,Ja=!1,sr=null,ln=!1,ti="Guest",Qa=!1,Pt="none",yn=dn.getItem("raid-sound")!=="off",ai=dn.getItem("raid-motion")==="reduced",ni=dn.getItem("raid-manual-aim")==="on",Un=ig(dn.getItem("raid-graphics"));const Ec=new sg;let eo=[],Fn=xr?"guest":"pending",bc,rr=!1,cs=!1,Tc="Guest",ii="Local scores saved on this device.",mr=[];const Ot=new Set,Qt={down:!1,x:0,y:0},Bt={aim:{id:-1,x:0,y:0,dx:0,dy:0}},qt=new xg;let ct=null;function Ac(){if(yn)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{})}catch{}}function Sg(){An(),hi(),Pt="none",document.querySelector("#overlay-root").innerHTML="",document.querySelector(".game-shell")?.classList.add("is-dead"),document.querySelectorAll(".hud button").forEach(i=>i.disabled=!0),xo(),Eg()}let yg=0,nn=0;const gr=new Set;function Mr(){for(const i of gr){try{i.source.stop()}catch{}i.source.disconnect(),i.gain.disconnect()}gr.clear()}function Eg(){if(yn)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const i=ct,e=i.currentTime,t=(c,h,u)=>{const f=i.createGain();f.gain.setValueAtTime(1e-4,e),f.gain.exponentialRampToValueAtTime(h,e+.025),f.gain.exponentialRampToValueAtTime(1e-4,e+u),c.connect(f).connect(i.destination);const g={source:c,gain:f};gr.add(g),c.onended=()=>{gr.delete(g),c.disconnect(),f.disconnect()},c.start(e),c.stop(e+u+.01)},n=i.createOscillator();n.type="triangle",n.frequency.setValueAtTime(155,e),n.frequency.exponentialRampToValueAtTime(62,e+.24),t(n,.085,.28);const s=i.createOscillator();s.type="sawtooth",s.frequency.setValueAtTime(430,e),s.frequency.exponentialRampToValueAtTime(70,e+.72),t(s,.022,.76);const r=i.createBuffer(1,Math.ceil(i.sampleRate*.85),i.sampleRate),a=r.getChannelData(0);let o=1979;for(let c=0;c<a.length;c++)o=o*1664525+1013904223>>>0,a[c]=(o/4294967296*2-1)*(1-c/a.length);const l=i.createBufferSource();l.buffer=r,t(l,.028,.82),yg++}catch{}}let hs=0,us=[],oi=null;function hi(){hs++;for(const i of us)clearTimeout(i);us=[],oi&&clearInterval(oi),oi=null}function Fi(i){if(yn)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const e=ct.createOscillator(),t=ct.createGain(),n=ct.currentTime,s={kill:[280,90,.06,"triangle"],hurt:[160,48,.2,"sawtooth"],shoot:[480,230,.045,"square"],level:[520,900,.3,"sine"],chest:[380,1140,.5,"triangle"],boss:[190,56,.55,"sawtooth"],dash:[420,160,.12,"triangle"]}[i];e.type=s[3],e.frequency.setValueAtTime(s[0],n),e.frequency.exponentialRampToValueAtTime(s[1],n+s[2]),t.gain.setValueAtTime(i==="shoot"?.025:.07,n),t.gain.exponentialRampToValueAtTime(.001,n+s[2]),e.connect(t).connect(ct.destination),e.start(),e.stop(n+s[2])}catch{}}async function bg(){if(xr){ln=!1,ti="Guest",Fn="guest",ii="Embedded guest play",to();return}try{const i=await _o(go+"/session");if(i.ok){const e=await i.json();ln=!0,ti=e.displayName||"Portal player",Fn="linked",ii="Portal ranked play ready."}else i.status===401?(ln=!1,ti="Guest",Fn="guest",ii="Launch from Portal for ranked play."):(ln=!1,ti="Guest",Fn="unavailable",ii="Ranked service unavailable; local play is ready.")}catch{ln=!1,ti="Guest",Fn="unavailable",ii="Ranked service unavailable; local play is ready."}to()}function to(){const i=document.querySelector("#identity");i&&(i.textContent=ln?`✦ ${ti} · PORTAL LINKED`:Fn==="pending"?"◇ CHECKING PORTAL SESSION…":Fn==="unavailable"?"◇ RANKED SERVICE UNAVAILABLE · LOCAL PLAY READY":Mg?"◇ PORTAL LAUNCH FAILED · GUEST PLAY READY":"◇ GUEST RUN · LOCAL SCORES")}async function wc(){if(xr)return!1;try{const i=await _o(go+"/leaderboard");if(i.ok)return eo=((await i.json()).entries||[]).map(t=>({handle:t.displayName,character:t.character,score:t.score,kills:t.kills,seconds:Math.floor(t.durationMs/1e3),at:""})),!0}catch{}return!1}function no(){try{return JSON.parse(dn.getItem("raid-local-scores")||"[]")}catch{return[]}}function Tg(i){const e=[...no(),i].sort((t,n)=>n.score-t.score).slice(0,20);dn.setItem("raid-local-scores",JSON.stringify(e))}function Ag(){return`<div class="menu-backdrop"><div class="menu-vignette"></div><div class="menu-rune rune-one">✧</div><div class="menu-rune rune-two">✧</div><header class="menu-top"><div class="brand"><span class="brand-mark">✦</span> RAID GUILD <span class="brand-separator">/</span> ARCADE</div><div id="identity" class="identity"></div></header><main class="menu-main"><div class="eyebrow"><span class="line"></span> AN ENDLESS VAULT AWAITS <span class="line"></span></div><h1>RAID<br/><em>SURVIVOR</em></h1><p class="subtitle">One hero. A thousand foes. Whatever you carry out is yours.</p><div class="ornament">✦ <span></span> ✦</div><div class="select-label">CHOOSE YOUR CHAMPION <small>01 / 03</small></div><div class="hero-grid">${dr.map(i=>{const e=io[i];return`<button class="hero-card ${i===fr?"selected":""}" data-hero="${i}"><span class="hero-glow"></span><span class="hero-number">0${dr.indexOf(i)+1}</span><img src="${Za(i)}" alt="${e.name}"/><span class="hero-name">${e.name}</span><span class="hero-role">${e.role}</span><span class="hero-copy">${e.copy}</span><span class="hero-pick">${i===fr?"✦ SELECTED":"SELECT HERO"}</span></button>`}).join("")}</div><button id="start" class="gold-button"><span>ENTER THE VAULT</span><b>➜</b></button><div class="menu-actions"><button id="leaderMenu">♛ LEADERBOARD</button><span>✦</span><button id="settingsMenu">⚙ SETTINGS</button></div><a class="portal-link" href="https://portal.raidguild.org/modules/raid-survivor" target="_blank" rel="noopener noreferrer">Launch from Portal for ranked play ↗</a></main><footer class="menu-footer"><span>WASD / DRAG & HOLD · SPACE DASH</span><span>DESKTOP + TOUCH READY</span></footer></div><div id="modal-root"></div>`}function vo(){An(),nn++,rr=!1,Mr(),hi(),cancelAnimationFrame(pr),k=null,$t?.dispose(),$t=null,Mc.innerHTML=Ag(),to(),wg()}function An(){Ot.clear(),Qt.down=!1;const i=document.querySelector("#stage"),e=qt.id;qt.reset(),k&&(k.move.x=k.move.y=0,k.firing=!1),e>=0&&i?.hasPointerCapture(e)&&i.releasePointerCapture(e);const t=document.querySelector("#aimStick"),n=Bt.aim.id;Bt.aim.id=-1,Bt.aim.dx=Bt.aim.dy=0,n>=0&&t?.hasPointerCapture(n)&&t.releasePointerCapture(n),t?.classList.remove("active");const s=t?.querySelector(".stick-knob");s&&(s.style.transform="")}function wg(){document.querySelectorAll("[data-hero]").forEach(i=>i.onclick=()=>{fr=i.dataset.hero,vo()}),document.querySelector("#start").onclick=()=>Rc(),document.querySelector("#leaderMenu").onclick=()=>Og(),document.querySelector("#settingsMenu").onclick=()=>Oi()}async function Rc(){if(rr)return;rr=!0,Ac(),Wt.start(),nn++;const i=nn;Mr();const e=document.querySelector("#start");if(e&&(e.disabled=!0,e.querySelector("span").textContent="CHECKING PORTAL SESSION…"),await bc,i!==nn)return;const t=ln&&!xr;cs=Fn==="unavailable",Tc=t?ti:"Guest",hi(),cancelAnimationFrame(pr),$t?.dispose(),$t=null,An(),Pt="none",k=new Gc(fr),Qa=!1,Ja=!1,sr=null,Mc.innerHTML=`<div class="game-shell"><div id="stage" class="stage"></div><div class="hud top-left"><div class="hud-row"><span class="hud-brand">✦ RAID SURVIVOR</span></div><div class="health-track"><div id="health-fill"></div><span id="health-label">100 / 100</span></div><div class="xp-track"><div id="xp-fill"></div></div><div class="hud-under"><span id="level">LVL 01</span><span id="kills">0 KILLS</span><span id="combo"></span><span id="runMode">${t?"PREPARING RANKED…":"LOCAL RUN"}</span></div></div><div class="hud survival-timer" aria-live="off"><span class="timer-label">SURVIVED</span><span id="time" class="timer">00:00</span><span id="timeMode" class="timer-mode">12:00 TO CLEAR</span></div><div class="hud top-right"><div class="score-title">VAULT SCORE</div><div id="score" class="score">000000</div><canvas id="minimap" width="118" height="118"></canvas><button id="pauseButton" class="hud-icon" aria-label="Pause">Ⅱ</button></div><div class="hud bottom-left"><div id="weapons" class="weapons"></div><div class="game-tip">WASD MOVE · HOLD MOUSE TO AIM · Q BOMB · SPACE DASH · B BACKPACK</div></div><div class="hud bottom-right"><button id="bombButton" class="bomb-button" aria-label="Bomb ready" aria-keyshortcuts="Q" title="Press Q to use bomb"><span>✷</span><small id="bombStatus">READY</small><div id="bombMeter"></div><kbd class="bomb-key" aria-hidden="true">Q</kbd></button><button id="dashButton" class="dash-button"><span>↗</span><small>DASH</small><div id="dashMeter"></div></button><button id="bagButton" class="bag-button">▣ BACKPACK</button></div><div id="bossBanner" class="boss-banner"></div><div id="playerJoystick" class="player-joystick" aria-hidden="true"><div class="player-joystick-knob"></div></div><div id="touchHint" class="touch-hint">DRAG & HOLD TO MOVE</div><div id="touchControls" class="touch-controls ${ni?"manual-aim":""}"><div id="aimStick" class="stick aim-stick"><div class="stick-knob"></div><span>AIM</span></div></div><div id="overlay-root"></div></div>`;const n=document.querySelector("#stage"),s=document.querySelector("#minimap");if($t=new lg(n,k,s,Un),k.onReward=(r,a)=>a?Ig(r):Dg(r),k.onEvent=r=>{if(r==="death"){Sg();return}if(Fi(r==="bossDead"?"level":r==="bomb"?"boss":r==="heal"?"level":r),r==="boss"){const a=document.querySelector("#bossBanner");a.textContent="⚔ MOLOCH RISES ⚔",a.classList.add("visible"),setTimeout(()=>a.classList.remove("visible"),2700)}if(r==="bossDead"){const a=document.querySelector("#bossBanner");a.textContent="✦ MOLOCH FALLS ✦",a.classList.add("visible"),setTimeout(()=>a.classList.remove("visible"),2700)}},document.querySelector("#pauseButton").onclick=()=>Pc(),document.querySelector("#bagButton").onclick=()=>Mo(),document.querySelector("#dashButton").onclick=()=>k?.dash(),document.querySelector("#bombButton").onclick=()=>k?.bomb(),Lg(n),xo(),t)try{const r=await xc("/runs",{version:vc});if(r.ok){const a=await r.json();i===nn&&(sr=a.runId)}else cs=!0,ii="Ranked start unavailable; local score will be saved."}catch{cs=!0,ii="Ranked start unavailable; local score will be saved."}i===nn&&(document.querySelector("#runMode").textContent=sr?"PORTAL RANKED":cs?"LOCAL · RANKED UNAVAILABLE":"LOCAL RUN",ja=performance.now(),ir=0,Ec.reset(),yc=0,pr=requestAnimationFrame(Cc),rr=!1)}function Rg(){return ai||window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Cc(i){if(!k||!$t)return;const e=Math.min(.1,(i-ja)/1e3);for(ja=i,ir+=e,Pg();ir>=1/60;)k.update(1/60),ir-=1/60;const t=Rg();k.dead&&k.deathReason==="combat"&&!document.hidden&&(k.deathProgress=Math.min(1,k.deathProgress+e/(t?.25:1.3)));const n=Ec.advance(e);n!==null&&($t.render(n,t),Cg(),++yc%6===0&&xo()),k.cleared&&!Ja&&(Ja=!0,Ug()),k.dead&&!Qa&&(k.deathReason!=="combat"||k.deathProgress>=1)&&(Qa=!0,Fg()),pr=requestAnimationFrame(Cc)}function Cg(){if(!k||!$t)return;const i=document.querySelector("#playerJoystick");if(!i)return;const e=$t.screen(k.player.x,k.player.y);i.style.left=`${e.x}px`,i.style.top=`${e.y}px`,i.classList.toggle("active",qt.id>=0),i.classList.toggle("unavailable",k.dead||k.paused||k.awaitingReward);const t=i.firstElementChild;t.style.transform=`translate(${qt.direction.x*32}px,${-qt.direction.y*32}px)`}function Pg(){if(!k||!$t||k.dead)return;const i=(Ot.has("d")||Ot.has("ArrowRight")?1:0)-(Ot.has("a")||Ot.has("ArrowLeft")?1:0),e=(Ot.has("w")||Ot.has("ArrowUp")?1:0)-(Ot.has("s")||Ot.has("ArrowDown")?1:0);if(k.move.x=qt.id>=0?qt.direction.x:i,k.move.y=qt.id>=0?qt.direction.y:e,ni&&Bt.aim.id>=0&&Math.hypot(Bt.aim.dx,Bt.aim.dy)>.15)k.aim.x=Bt.aim.dx,k.aim.y=Bt.aim.dy,k.firing=!0;else if(Qt.down){const t=$t.world(Qt.x,Qt.y),n=t.x-k.player.x,s=t.y-k.player.y,r=Math.hypot(n,s)||1;k.aim.x=n/r,k.aim.y=s/r,k.firing=!0}else k.firing=!1}function Lg(i){i.onpointerdown=s=>{if(!(!k||k.dead||k.paused||k.awaitingReward||k.cleared)){if(s.pointerType==="mouse"){Qt.down=!0,Qt.x=s.clientX,Qt.y=s.clientY;return}qt.begin(s.pointerId,s.clientX,s.clientY)&&(s.preventDefault(),i.setPointerCapture(s.pointerId),document.querySelector("#touchHint")?.classList.add("used"))}},i.onpointermove=s=>{if(s.pointerType==="mouse"){Qt.x=s.clientX,Qt.y=s.clientY;return}qt.move(s.pointerId,s.clientX,s.clientY)};const e=s=>{qt.end(s.pointerId)&&k&&(k.move.x=k.move.y=0)};i.onpointerup=e,i.onpointercancel=e,i.onlostpointercapture=e,window.onpointerup=s=>{s.pointerType==="mouse"&&(Qt.down=!1)},window.onpointercancel=s=>{s.pointerType==="mouse"&&(Qt.down=!1)};const t=document.querySelector("#aimStick");t.onpointerdown=s=>{if(!k||k.dead||k.paused||k.awaitingReward||k.cleared||Bt.aim.id>=0)return;s.preventDefault(),t.setPointerCapture(s.pointerId);const r=Bt.aim;r.id=s.pointerId,r.x=s.clientX,r.y=s.clientY,r.dx=r.dy=0,t.classList.add("active")},t.onpointermove=s=>{const r=Bt.aim;if(r.id!==s.pointerId)return;const a=s.clientX-r.x,o=s.clientY-r.y,l=Math.max(1,Math.hypot(a,o)),c=48;r.dx=Math.abs(a)>3?a/Math.max(l,c):0,r.dy=Math.abs(o)>3?-o/Math.max(l,c):0,t.querySelector(".stick-knob").style.transform=`translate(${a/l*Math.min(l,c)}px, ${o/l*Math.min(l,c)}px)`};const n=s=>{const r=Bt.aim;r.id===s.pointerId&&(r.id=-1,r.dx=r.dy=0,t.classList.remove("active"),t.querySelector(".stick-knob").style.transform="")};t.onpointerup=n,t.onpointercancel=n,t.onlostpointercapture=n}window.addEventListener("keydown",i=>{if(!k?.dead){if(i.key==="Escape"&&!i.repeat){Pt!=="none"?ui():Pc();return}if(i.code==="KeyQ"&&!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&k&&!k.paused&&!k.awaitingReward&&!k.cleared&&Pt==="none"&&!(i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, [contenteditable]"))){i.preventDefault(),k.bomb();return}i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, button, [contenteditable]")||(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&i.preventDefault(),Ot.add(i.key.toLowerCase()),Ot.add(i.key),i.code==="Space"&&!i.repeat&&k?.dash(),i.key.toLowerCase()==="b"&&!i.repeat&&k&&Mo())}});window.addEventListener("keyup",i=>{Ot.delete(i.key.toLowerCase()),Ot.delete(i.key)});window.addEventListener("blur",()=>{An(),k&&!k.dead&&!k.awaitingReward&&(k.paused=!0)});window.addEventListener("resize",An);document.addEventListener("visibilitychange",()=>{document.hidden&&(An(),k&&!k.dead&&!k.awaitingReward&&(k.paused=!0))});function xo(){if(!k)return;const i=k.player,e=(o,l)=>{const c=document.querySelector(o);c&&c.textContent!==l&&(c.textContent=l)};e("#time",Sc(k.elapsed)),e("#timeMode",k.endless?"ENDLESS":"12:00 TO CLEAR"),e("#health-label",`${Math.ceil(i.health)} / ${i.maxHealth}`),e("#level",`LVL ${String(k.stats.level).padStart(2,"0")}`),e("#kills",`${k.stats.kills} KILLS`),e("#combo",k.combo>=4?`${k.combo}× CHAIN`:""),e("#score",String(k.score).padStart(6,"0")),document.querySelector("#health-fill").style.width=`${i.health/i.maxHealth*100}%`,document.querySelector("#xp-fill").style.width=`${k.xp/k.xpNeeded*100}%`,document.querySelector("#dashMeter").style.height=`${Math.min(100,(1-i.dashCooldown/3.5)*100)}%`,document.querySelector("#bombMeter").style.height=`${Math.min(100,k.bombCharge/k.bombRecharge*100)}%`;const t=document.querySelector("#bombButton");t.classList.toggle("ready",k.bombCharge>=k.bombRecharge);const n={ranger:"BRIAR BARRAGE",wizard:"ARC NOVA",dwarf:"MOUNTAIN BREAKER"}[k.hero],s=Math.ceil(k.bombRecharge-k.bombCharge);t.setAttribute("aria-label",k.bombCharge>=k.bombRecharge?`${n} ready`:`${n} charging, ${s} seconds`),t.setAttribute("data-name",n),document.querySelector("#bombStatus").textContent=k.bombCharge>=k.bombRecharge?"READY":`${s}s`;const r=document.querySelector("#weapons"),a=k.slots.map(o=>o+":"+k.weapons[o]).join("|");r.dataset.loadout!==a&&(r.dataset.loadout=a,r.innerHTML=k.slots.map((o,l)=>`<div class="weapon-slot" style="--weapon-color:${"#"+bt[o].color.toString(16)}"><span class="slot-num">0${l+1}</span><span class="weapon-icon">${bt[o].icon}</span><span class="weapon-label">${bt[o].name}<small>RANK ${k.weapons[o]}</small></span></div>`).join(""))}function fi(i){An(),hi();const e=document.querySelector(k?"#overlay-root":"#modal-root");return e.innerHTML=i,e}function ui(){hi(),Pt="none";const i=document.querySelector(k?"#overlay-root":"#modal-root");i&&(i.innerHTML=""),k&&!k.awaitingReward&&!k.dead&&(k.paused=!1)}function Pc(){if(!(!k||k.dead||k.cleared||k.awaitingReward)){if(Pt!=="none"){ui();return}k.paused=!k.paused,k.paused?(An(),Pt="settings",Oi(!0)):ui()}}function Oi(i=!1){Pt="settings",k&&(k.paused=!0);const e=fi(`<div class="modal-scrim"><div class="modal-card narrow"><div class="modal-eyebrow">THE VAULT CAN WAIT</div><h2>${i?"PAUSED":"SETTINGS"}</h2><div class="setting-row"><span>Sound effects<small>Arcade synth cues</small></span><button id="soundToggle" class="toggle">${yn?"ON":"OFF"}</button></div><div class="setting-row"><span>Music<small>Vault Runner</small></span><button id="musicToggle" class="toggle" type="button" aria-label="Mute music" aria-pressed="${Wt.muted}">${Wt.muted?"OFF":"ON"}</button></div><div class="setting-row music-volume-row"><label for="musicVolume">Music volume</label><input id="musicVolume" type="range" min="0" max="100" value="${Wt.volume}" aria-label="Music volume"/><output id="musicVolumeValue" for="musicVolume">${Math.round(Wt.volume)}%</output></div><div class="setting-row graphics-row"><span>Graphics<small>Auto uses lighter effects on touch screens</small></span><button id="graphicsToggle" class="toggle" aria-label="Graphics quality: ${Un}">${Un.toUpperCase()}</button></div><div class="setting-row"><span>Reduced motion<small>Short blessing reveal</small></span><button id="motionToggle" class="toggle">${ai?"ON":"OFF"}</button></div><div class="setting-row"><span>Manual touch aim<small>Show an aim control for precise firing</small></span><button id="aimToggle" class="toggle">${ni?"ON":"OFF"}</button></div><div class="controls-note"><div>MOVE <b>WASD / DRAG & HOLD</b></div><div>AUTO FIRE <b>NEAREST FOE</b></div><div>MANUAL AIM <b>HOLD MOUSE / OPTIONAL RIGHT STICK</b></div><div>BOMB <b>Q / BOMB BUTTON</b></div><div>DASH <b>SPACE / DASH BUTTON</b></div><div>BACKPACK <b>B</b></div></div><button id="resume" class="gold-button small">${k?"RESUME RUN":"DONE"}</button>${k?'<button id="abandon" class="text-button">END RUN</button>':""}</div></div>`);e.querySelector("#soundToggle").onclick=()=>{yn=!yn,yn?Ac():Mr(),dn.setItem("raid-sound",yn?"on":"off"),Oi(i)},e.querySelector("#musicToggle").onclick=()=>{Wt.start(),Wt.toggleMuted();const n=e.querySelector("#musicToggle");n.textContent=Wt.muted?"OFF":"ON",n.setAttribute("aria-pressed",String(Wt.muted))},e.querySelector("#musicVolume").oninput=n=>{Wt.start();const s=Number(n.target.value);Wt.setVolume(s),e.querySelector("#musicVolumeValue").value=`${Math.round(Wt.volume)}%`},e.querySelector("#graphicsToggle").onclick=()=>{Un=Un==="auto"?"performance":Un==="performance"?"full":"auto",dn.setItem("raid-graphics",Un),$t?.setGraphics(Un),Oi(i)},e.querySelector("#motionToggle").onclick=()=>{ai=!ai,dn.setItem("raid-motion",ai?"reduced":"full"),Oi(i)},e.querySelector("#aimToggle").onclick=()=>{ni=!ni,dn.setItem("raid-manual-aim",ni?"on":"off"),document.querySelector("#touchControls")?.classList.toggle("manual-aim",ni),An(),Oi(i)},e.querySelector("#resume").onclick=()=>ui();const t=e.querySelector("#abandon");t&&(t.onclick=()=>{k&&(k.die("abandon"),ui())})}function Mo(){if(!k||k.dead||k.cleared||k.awaitingReward)return;Pt="backpack",k.paused=!0;const i=k.slots.map((s,r)=>`<button class="bag-item active" data-slot="${r}"><b>${bt[s].icon}</b><span>${bt[s].name}<small>RANK ${k.weapons[s]}</small></span></button>`).join(""),e=k.backpack.map((s,r)=>`<button class="bag-item" data-bag="${r}"><b>${bt[s].icon}</b><span>${bt[s].name}<small>RANK ${k.weapons[s]}</small></span></button>`).join("")||'<div class="empty-bag">Reserve weapons found in the vault appear here.</div>',t=fi(`<div class="modal-scrim"><div class="modal-card bag-modal"><div class="modal-eyebrow">YOUR LOADOUT</div><h2>BACKPACK</h2><p>Three weapons can fire at once. Tap a reserve weapon, then an active slot to swap.</p><div class="bag-columns"><div><h3>ACTIVE · 3 SLOTS</h3>${i}</div><div><h3>RESERVE · 3 SLOTS</h3>${e}</div></div><button id="bagClose" class="gold-button small">RETURN TO VAULT</button></div></div>`);let n=-1;t.querySelectorAll("[data-bag]").forEach(s=>s.onclick=()=>{n=Number(s.dataset.bag),t.querySelectorAll("[data-bag]").forEach(r=>r.classList.remove("chosen")),s.classList.add("chosen")}),t.querySelectorAll("[data-slot]").forEach(s=>s.onclick=()=>{n>=0&&(k?.swapBackpack(n,Number(s.dataset.slot)),Mo())}),t.querySelector("#bagClose").onclick=()=>ui()}function Dg(i,e){if(!k)return;mr=i,Pt="none";const t=fi(`<div class="reward-scrim "><div class="reward-stage"><div class="reward-rays">✦</div><div class="modal-eyebrow">YOUR LEGEND GROWS</div><h2>${"LEVEL "+String(k.stats.level).padStart(2,"0")}</h2><p>Choose one power to carry deeper into the vault.</p><div class="reward-cards">${i.map((s,r)=>`<button class="reward-card ${s.rarity} " data-reward="${r}"><span class="reward-rarity">${s.rarity.toUpperCase()}</span><span class="reward-icon">${s.icon}</span><span class="reward-name">${s.name}</span><span class="reward-detail">${s.detail}</span><span class="reward-take">CLAIM POWER ➜</span></button>`).join("")}</div></div></div>`);t.querySelectorAll(".reward-card").forEach((s,r)=>setTimeout(()=>s.classList.remove("concealed"),ai?0:r*320)),t.querySelectorAll("[data-reward]").forEach(s=>s.onclick=()=>{const r=mr[Number(s.dataset.reward)];k?.chooseReward(r),t.innerHTML="",Pt="none"})}function Nl(i){if(yn)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const e=ct.createOscillator(),t=ct.createGain(),n=ct.currentTime;e.type="triangle",e.frequency.setValueAtTime(i,n),e.frequency.exponentialRampToValueAtTime(i*1.25,n+.055),t.gain.setValueAtTime(.035,n),t.gain.exponentialRampToValueAtTime(.001,n+.07),e.connect(t).connect(ct.destination),e.start(),e.stop(n+.075)}catch{}}function Ig(i){if(!k)return;mr=i,Pt="none";const e=ai||window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=["✦","ϟ","☄","◈","♥","✧"],n=i.some(u=>u.rarity==="epic")?"epic":i.some(u=>u.rarity==="rare")?"rare":"common",r=Array.from({length:n==="epic"?105:n==="rare"?70:48},(u,f)=>`<span class='${f%4===0?"coin":"streamer"}' style='--x:${Math.round(Math.random()*100)}%;--delay:${(Math.random()*.8).toFixed(2)}s;--spin:${Math.round(Math.random()*1080-540)}deg;--hue:${f%3===0?"42":f%3===1?"330":"175"}'></span>`).join(""),a=fi(`<div class='reward-scrim chest-reward rarity-${n} ${e?"low-motion":""}'>${e?"":"<div class='spotlight spotlight-left'></div><div class='spotlight spotlight-right'></div>"}${e?"":`<div class='confetti' id='confetti'>${r}</div>`}<div class='reward-stage'>${e?"":"<div class='reward-rays'>✦</div>"}<div class='modal-eyebrow'>AN ANCIENT CHEST OPENS</div><h2>VAULT BLESSING</h2><div id='reel' class='reel'><div class='reel-symbol'>✦</div><div class='reel-symbol'>ϟ</div><div class='reel-symbol'>◈</div></div><div id='reelStatus' class='reel-status' aria-live='polite'>FORTUNE IS TURNING</div><div class='reward-cards'>${i.map((u,f)=>`<button class='reward-card ${u.rarity} concealed' data-reward='${f}' disabled><span class='reward-rarity'>${u.rarity.toUpperCase()}</span><span class='reward-icon'>${u.icon}</span><span class='reward-name'>${u.name}</span><span class='reward-detail'>${u.detail}</span><span class='reward-take'>CLAIM POWER ➜</span></button>`).join("")}</div><button id='skipReveal' class='text-button'>SKIP REVEAL</button></div></div>`),o=hs,l=(u,f)=>us.push(setTimeout(()=>{o===hs&&a.isConnected&&u()},f));let c=!1;const h=(u=!1)=>{if(c||o!==hs)return;c=!0,u&&a.querySelector(".reward-scrim")?.classList.add("reveal-skipped"),oi&&clearInterval(oi),oi=null;for(const g of us)clearTimeout(g);us=[],a.querySelector("#reel")?.classList.add("stopped"),a.querySelector("#reelStatus").textContent=n==="epic"?"JACKPOT · CHOOSE YOUR FORTUNE":"CHOOSE YOUR FORTUNE",!u&&!e&&a.querySelector("#confetti")?.classList.add("burst"),a.querySelector("#skipReveal")?.remove();const f=[...a.querySelectorAll(".reward-card")];u||e?f.forEach(g=>{g.classList.remove("concealed"),g.disabled=!1}):f.forEach((g,x)=>l(()=>{g.classList.remove("concealed"),g.disabled=!1,Nl(600+x*150)},x*240)),!u&&!e&&(Fi("level"),l(()=>Fi("chest"),200))};if(a.querySelector("#skipReveal").onclick=()=>h(!0),e)h(!0);else{let u=0;oi=setInterval(()=>{if(o!==hs||!a.isConnected){hi();return}u++,a.querySelectorAll(".reel-symbol").forEach((f,g)=>f.textContent=t[(u+g*2+Math.floor(Math.random()*t.length))%t.length]),u%2===0&&Nl(230+u*13)},95),l(()=>{a.querySelector("#reelStatus").textContent="THE REELS ARE SLOWING",a.querySelector("#reel")?.classList.add("slowing")},1850),l(()=>{a.querySelector("#reelStatus").textContent="ONE FINAL TURN...",a.querySelector("#reel")?.classList.add("final-turn")},2900),l(()=>h(),3700)}a.querySelectorAll("[data-reward]").forEach(u=>u.onclick=()=>{!c||u.disabled||(k?.chooseReward(mr[Number(u.dataset.reward)]),hi(),a.innerHTML="",Pt="none")})}function Ug(){if(!k)return;k.paused=!0;const i=fi(`<div class='modal-scrim result-scrim'><div class='modal-card result-modal'><div class='modal-eyebrow'>THE TWELFTH BELL HAS TOLLED</div><h2>VAULT CLEARED</h2><p>You survived twelve minutes beneath the guildhall. Bank this legend, or stay and challenge the endless vault.</p><div class='result-grid'><div><strong>${k.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${k.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div><div><strong>${k.stats.level}</strong><span>LEVEL</span></div><div><strong>${k.score.toLocaleString()}</strong><span>SCORE</span></div></div><button id='bankRun' class='gold-button small'>BANK THIS RUN</button><button id='endlessRun' class='text-button'>ENTER ENDLESS MODE ➜</button></div></div>`);i.querySelector("#bankRun").onclick=()=>{k&&(k.die("bank"),i.innerHTML="")},i.querySelector("#endlessRun").onclick=()=>{k&&(k.endless=!0,k.cleared=!1,k.paused=!1,i.innerHTML="")}}function Ng(i){const e=i.stats;return(e.kills-e.elites-e.bosses)*10+e.elites*75+e.bosses*600+e.chests*120+(e.level-1)*40+Math.floor(Math.round(i.elapsed*1e3)/1e3)*2}async function Fg(){if(!k)return;const i=k,e=nn,t=sr;i.paused=!0;const n={handle:Tc,character:i.hero,score:Ng(i),kills:i.stats.kills,seconds:Math.floor(i.elapsed),at:new Date().toISOString()};i.rankable&&Tg(n);const s=i.rankable?t?"LOCAL SCORE SAVED · SAVING RANKED RUN…":cs?"LOCAL SCORE SAVED · RANKED SERVICE UNAVAILABLE":"LOCAL SCORE SAVED":"UNRANKED TEST RUN",r=fi(`<div class="modal-scrim result-scrim"><div class="modal-card result-modal"><div class="modal-eyebrow">THE VAULT REMEMBERS</div><h2>${i.cleared?"VAULT CONQUERED":"YOUR RUN ENDS"}</h2><div class="result-score">${n.score.toLocaleString()}</div><div id="resultStatus" class="result-caption" role="status">${s}</div><div class="result-grid"><div><strong>${Sc(i.elapsed)}</strong><span>SURVIVED</span></div><div><strong>${i.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${i.stats.level}</strong><span>LEVEL</span></div><div><strong>${i.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div></div><button id="retry" class="gold-button small">TRY AGAIN ➜</button><button id="returnMenu" class="text-button">RETURN TO CHAMPIONS</button></div></div>`);if(r.querySelector("#retry").onclick=()=>Rc(),r.querySelector("#returnMenu").onclick=()=>vo(),!(!i.rankable||!t))try{const a=await xc(`/runs/${t}/finish`,{version:vc,character:i.hero,durationMs:Math.round(i.elapsed*1e3),stats:{...i.stats}});if(i!==k||e!==nn)return;const o=r.querySelector("#resultStatus");if(!o)return;a.ok?(o.textContent="LOCAL + PORTAL RANKED SCORE SAVED",wc()):o.textContent="LOCAL SCORE SAVED · RANKED SAVE FAILED"}catch{if(i===k&&e===nn){const a=r.querySelector("#resultStatus");a&&(a.textContent="LOCAL SCORE SAVED · RANKED SERVICE UNAVAILABLE")}}}async function Og(){const i=nn;Pt="leaderboard";const e=await wc();if(i!==nn||Pt!=="leaderboard")return;const t=ln&&e?eo:no(),n=t.length?t.slice(0,10).map((a,o)=>`<div class="leader-row"><span class="rank">${String(o+1).padStart(2,"0")}</span><img src="${Za(dr.includes(a.character)?a.character:"ranger")}" alt=""/><span class="leader-name">${Ul(a.handle)}</span><span class="leader-kills">${a.kills} KILLS</span><b>${a.score.toLocaleString()}</b></div>`).join(""):'<div class="empty-leader">No legends yet. The vault is waiting for its first survivor.</div>',s=fi(`<div class="modal-scrim"><div class="modal-card leader-modal"><div class="modal-eyebrow">ETCHED INTO STONE</div><h2>LEADERBOARD</h2><div class="leader-tabs"><button id="localTab" class="${ln&&e?"":"active"}">LOCAL</button><button id="portalTab" class="${ln&&e?"active":""}">PORTAL</button></div><div id="leaderStatus" class="result-caption" role="status">${e?"Portal leaderboard loaded.":"Portal leaderboard unavailable; local scores shown."}</div><div id="leaderRows">${n}</div><button id="leaderClose" class="gold-button small">CLOSE</button></div></div>`),r=a=>{s.querySelector("#leaderRows").innerHTML=a.length?a.slice(0,10).map((o,l)=>`<div class="leader-row"><span class="rank">${String(l+1).padStart(2,"0")}</span><img src="${Za(dr.includes(o.character)?o.character:"ranger")}" alt=""/><span class="leader-name">${Ul(o.handle)}</span><span class="leader-kills">${o.kills} KILLS</span><b>${o.score.toLocaleString()}</b></div>`).join(""):'<div class="empty-leader">No legends yet. The vault is waiting for its first survivor.</div>'};s.querySelector("#localTab").onclick=()=>{r(no()),s.querySelector("#localTab")?.classList.add("active"),s.querySelector("#portalTab")?.classList.remove("active")},s.querySelector("#portalTab").onclick=()=>{r(e?eo:[]),s.querySelector("#portalTab")?.classList.add("active"),s.querySelector("#localTab")?.classList.remove("active")},s.querySelector("#leaderClose").onclick=()=>ui()}new URL(location.href).searchParams.has("ranked")&&history.replaceState(null,"",location.pathname+location.hash);vo();bc=bg();window.addEventListener("pagehide",Mr);
