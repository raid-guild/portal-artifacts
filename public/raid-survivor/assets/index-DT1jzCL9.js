(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Za={ranger:{name:"Ranger",role:"THE THORNBOW",weapon:"thornbow",health:100,speed:8.2,color:8640155,copy:"Rapid piercing arrows. Fast feet and a steady aim."},wizard:{name:"Wizard",role:"THE ARC WAND",weapon:"arcwand",health:85,speed:7.7,color:10851839,copy:"Volatile bolts bloom into arcane shockwaves."},dwarf:{name:"Dwarf",role:"THE RUNIC SCATTERGUN",weapon:"scattergun",health:135,speed:6.8,color:16759667,copy:"Close range devastation. Sturdy as the mountain."}},bt={thornbow:{name:"Thornbow",icon:"➶",desc:"Piercing arrows split at higher ranks",color:9435312,cooldown:.27},arcwand:{name:"Arc Wand",icon:"✧",desc:"Arcane bolts detonate on impact",color:11510015,cooldown:.44},scattergun:{name:"Runic Scattergun",icon:"✷",desc:"A brutal cone of rune shot",color:16761469,cooldown:.62},chain:{name:"Storm Coil",icon:"ϟ",desc:"Lightning leaps between nearby foes",color:8968447,cooldown:1.2},orbit:{name:"Halo Blades",icon:"◈",desc:"Orbiting steel carves a safe path",color:16767374,cooldown:.19},comet:{name:"Falling Star",icon:"☄",desc:"Call down a blazing meteor",color:16748402,cooldown:2.1}},Be=180,ns=2400,Rc=650,vr=900,Cc=360,zt=(i,e)=>i+Math.random()*(e-i),oi=(i,e,t)=>Math.max(e,Math.min(t,i)),en=(i,e)=>(i.x-e.x)**2+(i.y-e.y)**2;class Pc{hero;player;enemies=[];projectiles=[];enemyShots=[];strikes=[];pickups=[];effects=[];weapons={};slots=[];backpack=[];passives={damage:0,speed:0,magnet:0,vitality:0,cooldown:0};stats={kills:0,elites:0,bosses:0,chests:0,level:1};score=0;survivalClock=0;elapsed=0;xp=0;xpNeeded=14;gold=0;combo=0;comboTime=0;spawnClock=0;chestClock=0;lastChestTime=-60;bombCharge=45;bombRanks={radius:0,damage:0,recharge:0};bombWave=null;facing=1;bossWave=0;nextId=1;dead=!1;deathReason=null;deathProgress=0;deathFacing=1;deathFiring=!1;cleared=!1;endless=!1;paused=!1;awaitingReward=!1;rankable=!0;aim={x:1,y:0};move={x:0,y:0};firing=!1;cooldowns={};onReward=null;onEvent=null;gridWidth=Math.ceil(Be/5);gridHead=new Int32Array(this.gridWidth*this.gridWidth).fill(-1);gridNext=new Int32Array(ns);orbitHits=new Map;orbitPulse=0;shrines=[[28,28],[90,28],[152,28],[28,90],[152,90],[28,152],[90,152],[152,152],[54,54],[126,54],[54,126],[126,126]].map(([e,t],n)=>({id:n,x:e,y:t,active:!0}));constructor(e){this.hero=e;const t=Za[e];this.player={x:Be/2,y:Be/2,health:t.health,maxHealth:t.health,invuln:0,dash:0,dashCooldown:0,speed:t.speed},this.weapons[t.weapon]=1,this.slots.push(t.weapon);for(let n=0;n<22;n++)this.spawnEnemy();this.buildGrid()}die(e="combat"){return this.dead?!1:(this.dead=!0,this.deathReason=e,this.deathFacing=this.facing,this.deathFiring=this.firing,this.player.health=0,this.move.x=this.move.y=0,this.firing=!1,e==="combat"&&this.onEvent?.("death"),!0)}effect(e){this.effects.length<Cc&&this.effects.push(e)}buildGrid(){this.gridHead.fill(-1);for(let e=0;e<this.enemies.length;e++){const t=this.enemies[e],n=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.x/5))),r=Math.max(0,Math.min(this.gridWidth-1,Math.floor(t.y/5)))*this.gridWidth+n;this.gridNext[e]=this.gridHead[r],this.gridHead[r]=e}}forNearby(e,t,n,s){const r=Math.max(0,Math.floor((e-n)/5)),a=Math.min(this.gridWidth-1,Math.floor((e+n)/5)),o=Math.max(0,Math.floor((t-n)/5)),c=Math.min(this.gridWidth-1,Math.floor((t+n)/5));for(let l=o;l<=c;l++)for(let d=r;d<=a;d++)for(let h=this.gridHead[l*this.gridWidth+d];h!==-1;h=this.gridNext[h])if(s(this.enemies[h]))return}nearest(e,t,n,s){let r,a=n*n;return this.forNearby(e,t,n,o=>{const c=(o.x-e)**2+(o.y-t)**2;o.hp>0&&c<a&&!s?.has(o.id)&&(r=o,a=c)}),r}spawnEnemy(e,t=!1){if(this.enemies.length>=ns)return;const n=this.elapsed/60,s=e||(Math.random()<Math.min(.08+n*.04,.25)?"brute":Math.random()<.18?"wisp":Math.random()<.28?"cultist":"rat"),r=zt(0,Math.PI*2),a=zt(21,30),o=oi(this.player.x+Math.cos(r)*a,2,Be-2),c=oi(this.player.y+Math.sin(r)*a,2,Be-2),l={rat:[15,3.2,8,.44],cultist:[25,2.5,10,.55],brute:[60,1.65,17,.85],wisp:[17,4,7,.4],boss:[1050,1.6,27,2.2]}[s],d=1+Math.min(4,n*.27),h=l[0]*d*(t?3:1);this.enemies.push({id:this.nextId++,x:o,y:c,hp:h,maxHp:h,speed:l[1],damage:l[2],radius:l[3]*(t?1.35:1),kind:s,elite:t,flash:0,phase:zt(0,6.28),attackCd:s==="boss"?1.5:zt(1.4,3),windup:0,facing:this.player.x<o?-1:1,knockX:0,knockY:0,attackPhase:0})}dash(){this.player.dashCooldown>0||this.dead||this.paused||this.awaitingReward||(this.player.dash=.2,this.player.invuln=.36,this.player.dashCooldown=3.5,this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.35,max:.35,color:10092498,size:2}),this.onEvent?.("dash"))}get bombRecharge(){return 45*Math.pow(.88,this.bombRanks.recharge)}get bombRadius(){return 7*(1+this.bombRanks.radius*.12)}bomb(){return this.bombCharge<this.bombRecharge||this.dead||this.paused||this.awaitingReward?!1:(this.bombCharge=0,this.bombWave={age:0,radius:0,previousRadius:0,hit:new Set},this.onEvent?.("bomb"),!0)}updateBomb(e){if(!this.bombWave)return;const t=this.bombWave;t.age+=e,t.previousRadius=t.radius,t.radius=this.bombRadius*Math.min(1,t.age/.6);const n=this.player,s=this.hero==="ranger"?"thornbow":this.hero==="wizard"?"arcwand":"scattergun",r={ranger:48,wizard:54,dwarf:66}[this.hero]*(1+this.bombRanks.damage*.25);if(this.forNearby(n.x,n.y,t.radius+3,a=>{if(a.hp<=0||t.hit.has(a.id))return;const o=Math.sqrt(en(a,n));if(!(o>t.radius+a.radius||o<t.previousRadius-a.radius)){if(t.hit.add(a.id),this.damage(a,r,s),this.hero==="dwarf"&&a.kind!=="boss"){const c=6/(o||1);a.knockX=(a.x-n.x)*c,a.knockY=(a.y-n.y)*c}if(this.hero==="wizard"){let c=0;this.forNearby(a.x,a.y,3.5,l=>{if(c>=2)return!0;l.hp<=0||t.hit.has(l.id)||en(a,l)>3.5**2||(t.hit.add(l.id),c++,this.damage(l,r*.45,s),this.effect({x:a.x,y:a.y,x2:l.x,y2:l.y,kind:"zap",life:.22,max:.22,color:10479615,size:.3}))})}}}),this.hero==="ranger"&&t.previousRadius<2&&t.radius>=2)for(let a=0;a<24;a++)this.projectile(n.x,n.y,a*Math.PI/12,25,r*.35,"thornbow",.21,3,.65);t.age>=.6&&(this.bombWave=null)}damage(e,t,n){if(e.hp<=0)return;if(e.hp-=t*(1+this.passives.damage*.18),e.flash=.12,e.hp>0){Math.random()<.28&&this.effect({x:e.x,y:e.y,kind:"hit",life:.16,max:.16,color:bt[n].color,size:.7});return}this.stats.kills++,e.elite&&this.stats.elites++,e.kind==="boss"&&(this.stats.bosses++,this.onEvent?.("bossDead")),this.combo++,this.comboTime=3,this.score+=e.kind==="boss"?600:e.elite?75:10;const s=e.kind==="boss"?22:e.elite?5:1;for(let r=0;r<s&&this.pickups.length<vr;r++)this.pickups.push({x:e.x+zt(-1,1),y:e.y+zt(-1,1),kind:"xp",value:e.kind==="boss"?4:e.elite?3:1,life:25});if(e.kind==="boss"||e.elite&&this.elapsed-this.lastChestTime>=60&&!this.pickups.some(r=>r.kind==="chest")&&Math.random()<.15){const r={x:e.x,y:e.y,kind:"chest",value:1,life:45};if(this.pickups.length<vr)this.pickups.push(r);else{const a=this.pickups.findIndex(o=>o.kind==="xp");a>=0&&(this.pickups[a]=r)}this.lastChestTime=this.elapsed}else this.pickups.length<vr&&Math.random()<.018&&this.pickups.push({x:e.x,y:e.y,kind:"heart",value:18,life:25});this.effect({x:e.x,y:e.y,kind:"burst",life:.45,max:.45,color:e.kind==="boss"?16762730:16743066,size:e.radius*2.5}),this.onEvent?.("kill")}projectile(e,t,n,s,r,a,o=.26,c=0,l=1.6){this.projectiles.length>=Rc||this.projectiles.push({x:e,y:t,vx:Math.cos(n)*s,vy:Math.sin(n)*s,damage:r,kind:a,radius:o,pierce:c,life:l,chain:0,hit:new Set})}fireWeapon(e){const t=this.weapons[e]||1,n=this.player;let s=Math.atan2(this.aim.y,this.aim.x);if(!this.firing&&e!=="orbit"){const r=this.nearest(n.x,n.y,17);if(!r)return;s=Math.atan2(r.y-n.y,r.x-n.x)}if(e==="thornbow"){const r=t>=5?5:t>=4?3:t>=2?2:1;for(let a=0;a<r;a++)this.projectile(n.x,n.y,s+(a-(r-1)/2)*.13,24,12+t*5,e,.18,Math.floor(t/2),1.4)}else if(e==="arcwand")this.projectile(n.x,n.y,s,15,16+t*8,e,.38+t*.04,0,1.5);else if(e==="scattergun"){const r=5+t*2;for(let a=0;a<r;a++)this.projectile(n.x,n.y,s+(a-(r-1)/2)*.12+zt(-.025,.025),zt(15,19),6+t*2.5,e,.17,0,.48);if(t>=5){for(let a=0;a<12;a++)this.projectile(n.x,n.y,a*Math.PI/6,15,9,e,.2,0,.42);this.effect({x:n.x,y:n.y,kind:"ring",life:.36,max:.36,color:16761469,size:4})}}else if(e==="chain"){const r=this.nearest(n.x,n.y,16);if(r){let a=n;const o=new Set;let c=r;for(let l=0;l<2+t&&c;l++)o.add(c.id),this.effect({x:a.x,y:a.y,x2:c.x,y2:c.y,kind:"zap",life:.22,max:.22,color:9297919,size:.2}),this.damage(c,15+t*7,e),t>=5&&(this.forNearby(c.x,c.y,2.4,d=>{d.hp>0&&d.id!==c.id&&en(d,c)<2.4**2&&this.damage(d,15,e)}),this.effect({x:c.x,y:c.y,kind:"ring",life:.24,max:.24,color:11924479,size:2.4})),a=c,c=this.nearest(a.x,a.y,6+t,o)}}else if(e==="comet"){const r=this.nearest(n.x,n.y,18),a=r?.x??n.x+Math.cos(s)*7,o=r?.y??n.y+Math.sin(s)*7;(t>=5?[[a,o],[a+zt(-3,3),o+zt(-3,3)],[a+zt(-3,3),o+zt(-3,3)]]:[[a,o]]).forEach(([l,d],h)=>{const f=2.5+t*.5;this.strikes.push({x:l,y:d,delay:.5+h*.18,radius:f,damage:38+t*22,source:"comet"}),this.effect({x:l,y:d,kind:"comet",life:.5+h*.18,max:.5+h*.18,color:16749934,size:f})})}e!=="orbit"&&this.onEvent?.("shoot")}updateWeapons(e){for(const t of this.slots){const n=this.weapons[t]||1;if(t==="orbit"){const r=2+n;for(let a=0;a<r;a++){const o=this.elapsed*(2.7+n*.15)+a*Math.PI*2/r,c=this.player.x+Math.cos(o)*(2.2+n*.2),l=this.player.y+Math.sin(o)*(2.2+n*.2);this.forNearby(c,l,1.1,d=>{const h=this.orbitHits.get(d.id)||0,f=d.x-c,g=d.y-l;d.hp>0&&f*f+g*g<(d.radius+.6)**2&&this.elapsed-h>.24&&(this.damage(d,8+n*5,t),this.orbitHits.set(d.id,this.elapsed))})}n>=5&&this.elapsed>=this.orbitPulse&&(this.orbitPulse=this.elapsed+2.8,this.forNearby(this.player.x,this.player.y,5.5,a=>{a.hp>0&&en(a,this.player)<5.5**2&&this.damage(a,34,t)}),this.effect({x:this.player.x,y:this.player.y,kind:"ring",life:.55,max:.55,color:16771498,size:5.5}));continue}const s=bt[t].cooldown*Math.pow(.88,n-1)*Math.pow(.92,this.passives.cooldown);this.cooldowns[t]=(this.cooldowns[t]||0)-e,(this.cooldowns[t]||0)<=0&&(this.fireWeapon(t),this.cooldowns[t]=s)}}update(e){if(this.dead||this.paused||this.awaitingReward)return;if(e=Math.min(e,.05),this.elapsed+=e,this.survivalClock+=e,this.survivalClock>=1&&(this.score+=2,this.survivalClock-=1),this.elapsed>=720&&!this.endless&&!this.cleared){this.cleared=!0,this.paused=!0;return}const t=this.player;t.invuln=Math.max(0,t.invuln-e),t.dash=Math.max(0,t.dash-e),t.dashCooldown=Math.max(0,t.dashCooldown-e),this.bombCharge=Math.min(this.bombRecharge,this.bombCharge+e);const n=Math.hypot(this.move.x,this.move.y)||1,s=t.speed*(1+this.passives.speed*.1)*(t.dash>0?3.3:1);t.x=oi(t.x+this.move.x/n*s*e,1,Be-1),t.y=oi(t.y+this.move.y/n*s*e,1,Be-1);const r=this.firing?this.aim.x:this.move.x;Math.abs(r)>.15&&(this.facing=r<0?-1:1);for(const p of this.shrines)if(p.active&&en(p,t)<1.9**2){p.active=!1;const m=Math.min(25,t.maxHealth-t.health);t.health+=m,this.xp+=18,this.effect({x:p.x,y:p.y,kind:"ring",life:.8,max:.8,color:7667636,size:7}),this.effect({x:p.x,y:p.y,kind:"text",life:1.2,max:1.2,color:12255185,size:2,text:`HEAL +${Math.ceil(m)}  ·  XP +18`}),this.onEvent?.("heal")}this.spawnClock+=e;const a=Math.min(ns,70+Math.floor(this.elapsed*4.8));if(this.enemies.length<a&&this.spawnClock>=Math.max(.012,.14-this.elapsed*45e-5)){this.spawnClock=0;const p=Math.min(8,1+Math.floor(this.elapsed/35));for(let m=0;m<p;m++)this.spawnEnemy(void 0,this.elapsed>40&&Math.random()<.025)}const o=Math.floor(this.elapsed/90);o>this.bossWave&&(this.bossWave=o,this.spawnEnemy("boss"),this.onEvent?.("boss"),this.effect({x:t.x,y:t.y,kind:"text",life:1.5,max:1.5,color:16764805,size:3,text:"MOLOCH RISES"})),this.chestClock+=e,this.chestClock>36&&(this.chestClock=0,this.spawnEnemy("brute",!0));const c=[],l=Math.min(1,Math.max(0,(this.enemies.length-100)/900));for(const p of this.enemies){if(p.hp<=0)continue;p.flash=Math.max(0,p.flash-e);const m=t.x-p.x,u=t.y-p.y,E=Math.hypot(m,u)||1;if(Math.abs(m)>.2&&(p.facing=m<0?-1:1),Math.abs(p.knockX)+Math.abs(p.knockY)>.02){p.x=oi(p.x+p.knockX*e,1,Be-1),p.y=oi(p.y+p.knockY*e,1,Be-1);const R=Math.max(0,1-e*9);p.knockX*=R,p.knockY*=R}const b=p.kind==="wisp"?Math.sin(this.elapsed*4+p.phase)*.48:0,y=(p.id*2654435761>>>0)/4294967296,P=p.radius+.3+l*Math.sqrt(y)*17;if(E>P)p.x+=(m/E-u/E*b)*p.speed*e,p.y+=(u/E+m/E*b)*p.speed*e;else if(l>.25){const R=p.id%2?1:-1;p.x+=-u/E*p.speed*e*.23*R,p.y+=m/E*p.speed*e*.23*R}if((p.kind==="cultist"||p.kind==="boss")&&(p.attackCd-=e,p.attackCd<=0&&p.windup<=0&&E<17&&(p.windup=p.kind==="boss"?.9:.55,p.attackCd=p.kind==="boss"?3.2:2.4+Math.random(),this.effect({x:p.x,y:p.y,kind:"ring",life:p.windup,max:p.windup,color:p.kind==="boss"?16759163:15835345,size:p.radius*1.6}),p.kind==="boss"&&(p.attackPhase++,p.attackPhase%3===0&&this.effect({x:p.x,y:p.y,kind:"ring",life:.9,max:.9,color:16735313,size:8}))),p.windup>0&&(p.windup-=e,p.windup<=0&&this.enemyShots.length<280))){const R=Math.atan2(t.y-p.y,t.x-p.x),C=p.kind==="boss",N=C?12:1;for(let S=0;S<N;S++){const x=C?S*Math.PI*2/N+this.elapsed*.12:R;this.enemyShots.push({x:p.x,y:p.y,vx:Math.cos(x)*(C?7:9),vy:Math.sin(x)*(C?7:9),life:C?3.1:2.1,damage:C?16:8,radius:C?.32:.23,boss:C})}if(C)for(let S=-1;S<=1;S++){const x=R+S*.22;this.enemyShots.push({x:p.x,y:p.y,vx:Math.cos(x)*11,vy:Math.sin(x)*11,life:2.3,damage:14,radius:.28,boss:!0})}if(C&&p.attackPhase%3===0)for(let S=0;S<8;S++){const x=S*Math.PI/4+this.elapsed*.25;this.enemyShots.push({x:p.x,y:p.y,vx:Math.cos(x)*4.8,vy:Math.sin(x)*4.8,life:5,damage:22,radius:.55,boss:!0})}}if(E<p.radius+.55&&t.invuln<=0){if(t.health-=p.damage,t.invuln=.62,this.effect({x:t.x,y:t.y,kind:"ring",life:.3,max:.3,color:16739458,size:1.7}),t.health<=0){this.die();return}this.onEvent?.("hurt")}c.push(p)}this.enemies=c,this.buildGrid(),this.updateBomb(e),this.updateWeapons(e);const d=[];for(const p of this.enemyShots)if(p.x+=p.vx*e,p.y+=p.vy*e,p.life-=e,!(p.life<=0)){if(en(p,t)<(p.radius+.55)**2){if(t.invuln<=0){if(t.health=Math.max(0,t.health-p.damage),t.invuln=.42,t.health<=0){this.die();return}this.onEvent?.("hurt")}continue}d.push(p)}this.enemyShots=d;const h=[];for(const p of this.strikes){if(p.delay-=e,p.delay>0){h.push(p);continue}this.forNearby(p.x,p.y,p.radius,m=>{m.hp>0&&en(m,p)<p.radius**2&&this.damage(m,p.damage,p.source)}),this.effect({x:p.x,y:p.y,kind:"ring",life:.45,max:.45,color:p.source==="comet"?16757624:12098303,size:p.radius}),this.effect({x:p.x,y:p.y,kind:"burst",life:.32,max:.32,color:p.source==="comet"?16747358:11247103,size:p.radius})}this.strikes=h;const f=[];for(const p of this.projectiles){if(p.x+=p.vx*e,p.y+=p.vy*e,p.life-=e,p.life<=0||p.x<0||p.x>Be||p.y<0||p.y>Be)continue;let m=!1;this.forNearby(p.x,p.y,p.radius+2.5,u=>{if(!(u.hp<=0||p.hit.has(u.id)||en(p,u)>(p.radius+u.radius)**2)){if(p.hit.add(u.id),this.damage(u,p.damage,p.kind),p.kind==="arcwand"){const E=1.4+(this.weapons.arcwand||1)*.36;this.forNearby(p.x,p.y,E,b=>{b.hp>0&&en(p,b)<E*E&&this.damage(b,p.damage*.45,p.kind)}),this.effect({x:p.x,y:p.y,kind:"ring",life:.26,max:.26,color:11574015,size:E}),(this.weapons.arcwand||1)>=5&&this.strikes.length<100&&(this.strikes.push({x:p.x,y:p.y,delay:.55,radius:3.3,damage:30,source:"arcwand"}),this.effect({x:p.x,y:p.y,kind:"comet",life:.55,max:.55,color:12822015,size:3.3}))}if(p.kind==="thornbow"&&(this.weapons.thornbow||1)>=5&&p.chain===0&&this.forNearby(u.x,u.y,3.6,E=>{E.hp>0&&E.id!==u.id&&en(E,u)<3.6**2&&(this.damage(E,p.damage*.45,"thornbow"),this.effect({x:u.x,y:u.y,x2:E.x,y2:E.y,kind:"zap",life:.24,max:.24,color:9435312,size:.2}))}),p.pierce--<=0)return m=!0,!0}}),m||f.push(p)}this.projectiles=f;const g=[],v=2.4+this.passives.magnet*1.2;for(const p of this.pickups){if(p.life-=e,p.life<=0)continue;const m=t.x-p.x,u=t.y-p.y,E=Math.hypot(m,u);if(E<v){const b=Math.min(E,(7+20/Math.max(.2,E))*e);p.x+=m/(E||1)*b,p.y+=u/(E||1)*b}if(E<.8)if(p.kind==="xp")this.xp+=p.value;else if(p.kind==="heart"){const b=Math.min(p.value,t.maxHealth-t.health);t.health+=b,this.effect({x:t.x,y:t.y,kind:"text",life:1,max:1,color:12255185,size:1,text:`FOOD +${Math.ceil(b)} HP`}),this.onEvent?.("heal")}else if(this.awaitingReward){g.push(p);continue}else this.stats.chests++,this.score+=120,this.openReward(!0),this.onEvent?.("chest");else g.push(p)}this.pickups=g;for(const p of this.effects)p.life-=e;this.effects=this.effects.filter(p=>p.life>0),this.xp>=this.xpNeeded&&!this.awaitingReward&&(this.xp-=this.xpNeeded,this.stats.level++,this.score+=40,this.xpNeeded=Math.floor(this.xpNeeded*1.28+5),this.openReward(!1),this.onEvent?.("level")),this.comboTime=Math.max(0,this.comboTime-e),this.comboTime||(this.combo=0),this.orbitHits.size>5e3&&this.orbitHits.clear()}openReward(e){this.awaitingReward=!0,this.onReward?.(this.rollRewards(e),e)}rollRewards(e){const t=[],n=Object.keys(bt);for(const a of n){const o=this.weapons[a]||0;o<5&&(o||this.slots.length<3||this.backpack.length<3)&&t.push({kind:"weapon",id:a,name:o?`${bt[a].name} +${o+1}`:bt[a].name,detail:o?`Rank ${o+1} · ${o>=3?"evolved strike":"power and cadence"}`:bt[a].desc,rarity:o>=3||e&&o>=2?"epic":o>=1?"rare":"common",icon:bt[a].icon})}for(const[a,o,c,l]of[["damage","Sharpened Steel","✦","All weapons deal +18% damage"],["speed","Fleetfoot Boots","➤","Move speed +10%"],["magnet","Vault Magnet","◎","Pull loot from farther away"],["vitality","Iron Heart","♥","Maximum health +20"],["cooldown","Quick Hands","⌁","Fire rate +8%"]])this.passives[a]<5&&t.push({kind:"passive",id:a,name:o,detail:l,rarity:this.passives[a]>=2?"rare":"common",icon:c});for(const[a,o,c]of[["radius","Bomb Radius","Blast wave grows by 12%"],["damage","Bomb Fury","Blast damage grows by 25%"],["recharge","Bomb Dynamo","Bomb recharges 12% faster"]])this.bombRanks[a]<5&&t.push({kind:"bomb",id:a,name:o,detail:c,rarity:this.bombRanks[a]>=2?"rare":"common",icon:"✷"});this.player.health<this.player.maxHealth*.7&&t.push({kind:"heal",id:"heal",name:"Second Wind",detail:"Restore 35 health now",rarity:"common",icon:"✚"});const s=[{kind:"boon",id:"resolve",name:"Endless Resolve",detail:"+10 maximum health and restore 25",rarity:"rare",icon:"♥"},{kind:"boon",id:"fury",name:"Everlasting Fury",detail:"All damage grows by another 6%",rarity:"rare",icon:"✦"},{kind:"boon",id:"haste",name:"Wild Momentum",detail:"Move speed grows by another 5%",rarity:"rare",icon:"➤"}];for(;t.length<3;)t.push(s.shift());const r=[];for(;r.length<3&&t.length;){const a=Math.floor(Math.random()*t.length);r.push(t.splice(a,1)[0])}if(e&&r.length){const a=r[Math.floor(Math.random()*r.length)];a.rarity==="common"&&(a.rarity="rare"),Math.random()<.28&&(a.rarity="epic")}return r}chooseReward(e){if(this.awaitingReward){if(e.kind==="weapon"){const t=e.id;this.weapons[t]||(this.slots.length<3?this.slots.push(t):this.backpack.length<3&&this.backpack.push(t)),this.weapons[t]=Math.min(5,(this.weapons[t]||0)+1)}else if(e.kind==="passive"){const t=e.id;this.passives[t]++,t==="vitality"&&(this.player.maxHealth+=20,this.player.health+=20)}else if(e.kind==="bomb"){const t=e.id;this.bombRanks[t]=Math.min(5,this.bombRanks[t]+1)}else e.kind==="boon"?e.id==="resolve"?(this.player.maxHealth+=10,this.player.health=Math.min(this.player.maxHealth,this.player.health+35)):e.id==="fury"?this.passives.damage+=1/3:this.passives.speed+=.5:this.player.health=Math.min(this.player.maxHealth,this.player.health+35);this.awaitingReward=!1}}swapBackpack(e,t){e<0||e>=this.backpack.length||t<0||t>=this.slots.length||([this.slots[t],this.backpack[e]]=[this.backpack[e],this.slots[t]])}stress(e){this.rankable=!1;const t=Math.min(Math.max(0,Math.floor(e)),ns-this.enemies.length);for(let n=0;n<t;n++)this.spawnEnemy("rat")}defeatBossDebug(){this.rankable=!1;const e=this.enemies.find(t=>t.kind==="boss"&&t.hp>0);e&&this.damage(e,1e9,"thornbow")}}const ja="180",Lc=0,Mo=1,Dc=2,Rl=1,Ic=2,mn=3,Nn=0,Dt=1,jt=2,Pn=0,Di=1,So=2,yo=3,Eo=4,Uc=5,Yn=100,Nc=101,Fc=102,Oc=103,Bc=104,kc=200,zc=201,Hc=202,Vc=203,Qr=204,ea=205,Gc=206,Wc=207,Xc=208,qc=209,Yc=210,$c=211,Kc=212,Zc=213,jc=214,ta=0,na=1,ia=2,Ui=3,sa=4,ra=5,aa=6,oa=7,Cl=0,Jc=1,Qc=2,Ln=0,eh=1,th=2,nh=3,ih=4,sh=5,rh=6,ah=7,Pl=300,Ni=301,Fi=302,la=303,ca=304,ur=306,er=1e3,Zn=1001,ha=1002,xt=1003,oh=1004,vs=1005,sn=1006,xr=1007,jn=1008,Sn=1009,Ll=1010,Dl=1011,os=1012,Ja=1013,ei=1014,rn=1015,fs=1016,Qa=1017,eo=1018,ls=1020,Il=35902,Ul=35899,Nl=1021,Fl=1022,Jt=1023,cs=1026,hs=1027,to=1028,no=1029,Ol=1030,io=1031,so=1033,qs=33776,Ys=33777,$s=33778,Ks=33779,ua=35840,da=35841,fa=35842,pa=35843,ma=36196,ga=37492,_a=37496,va=37808,xa=37809,Ma=37810,Sa=37811,ya=37812,Ea=37813,ba=37814,Ta=37815,Aa=37816,wa=37817,Ra=37818,Ca=37819,Pa=37820,La=37821,Da=36492,Ia=36494,Ua=36495,Na=36283,Fa=36284,Oa=36285,Ba=36286,lh=3200,ch=3201,hh=0,uh=1,Cn="",dt="srgb",Oi="srgb-linear",tr="linear",je="srgb",li=7680,bo=519,dh=512,fh=513,ph=514,Bl=515,mh=516,gh=517,_h=518,vh=519,ka=35044,To=35048,Ao="300 es",an=2e3,nr=2001;class ki{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const St=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Mr=Math.PI/180,za=180/Math.PI;function Dn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(St[i&255]+St[i>>8&255]+St[i>>16&255]+St[i>>24&255]+"-"+St[e&255]+St[e>>8&255]+"-"+St[e>>16&15|64]+St[e>>24&255]+"-"+St[t&63|128]+St[t>>8&255]+"-"+St[t>>16&255]+St[t>>24&255]+St[n&255]+St[n>>8&255]+St[n>>16&255]+St[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function xh(i,e){return(i%e+e)%e}function Sr(i,e,t){return(1-t)*i+t*e}function nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Je(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class He{constructor(e=0,t=0){He.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ps{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],h=n[s+3];const f=r[a+0],g=r[a+1],v=r[a+2],p=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=g,e[t+2]=v,e[t+3]=p;return}if(h!==p||c!==f||l!==g||d!==v){let m=1-o;const u=c*f+l*g+d*v+h*p,E=u>=0?1:-1,b=1-u*u;if(b>Number.EPSILON){const P=Math.sqrt(b),R=Math.atan2(P,u*E);m=Math.sin(m*R)/P,o=Math.sin(o*R)/P}const y=o*E;if(c=c*m+f*y,l=l*m+g*y,d=d*m+v*y,h=h*m+p*y,m===1-o){const P=1/Math.sqrt(c*c+l*l+d*d+h*h);c*=P,l*=P,d*=P,h*=P}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],h=r[a],f=r[a+1],g=r[a+2],v=r[a+3];return e[t]=o*v+d*h+c*g-l*f,e[t+1]=c*v+d*f+l*h-o*g,e[t+2]=l*v+d*g+o*f-c*h,e[t+3]=d*v-o*h-c*f-l*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),h=o(r/2),f=c(n/2),g=c(s/2),v=c(r/2);switch(a){case"XYZ":this._x=f*d*h+l*g*v,this._y=l*g*h-f*d*v,this._z=l*d*v+f*g*h,this._w=l*d*h-f*g*v;break;case"YXZ":this._x=f*d*h+l*g*v,this._y=l*g*h-f*d*v,this._z=l*d*v-f*g*h,this._w=l*d*h+f*g*v;break;case"ZXY":this._x=f*d*h-l*g*v,this._y=l*g*h+f*d*v,this._z=l*d*v+f*g*h,this._w=l*d*h-f*g*v;break;case"ZYX":this._x=f*d*h-l*g*v,this._y=l*g*h+f*d*v,this._z=l*d*v-f*g*h,this._w=l*d*h+f*g*v;break;case"YZX":this._x=f*d*h+l*g*v,this._y=l*g*h+f*d*v,this._z=l*d*v-f*g*h,this._w=l*d*h-f*g*v;break;case"XZY":this._x=f*d*h-l*g*v,this._y=l*g*h-f*d*v,this._z=l*d*v+f*g*h,this._w=l*d*h+f*g*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],h=t[10],f=n+o+h;if(f>0){const g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(d-c)*g,this._y=(r-l)*g,this._z=(a-s)*g}else if(n>o&&n>h){const g=2*Math.sqrt(1+n-o-h);this._w=(d-c)/g,this._x=.25*g,this._y=(s+a)/g,this._z=(r+l)/g}else if(o>h){const g=2*Math.sqrt(1+o-n-h);this._w=(r-l)/g,this._x=(s+a)/g,this._y=.25*g,this._z=(c+d)/g}else{const g=2*Math.sqrt(1+h-n-o);this._w=(a-s)/g,this._x=(r+l)/g,this._y=(c+d)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const g=1-t;return this._w=g*a+t*this._w,this._x=g*n+t*this._x,this._y=g*s+t*this._y,this._z=g*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,o),h=Math.sin((1-t)*d)/l,f=Math.sin(t*d)/l;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(e=0,t=0,n=0){B.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+c*l+a*h-o*d,this.y=n+c*d+o*l-r*h,this.z=s+c*h+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return yr.copy(this).projectOnVector(e),this.sub(yr)}reflect(e){return this.sub(yr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const yr=new B,wo=new ps;class Ne{constructor(e,t,n,s,r,a,o,c,l){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],h=n[7],f=n[2],g=n[5],v=n[8],p=s[0],m=s[3],u=s[6],E=s[1],b=s[4],y=s[7],P=s[2],R=s[5],C=s[8];return r[0]=a*p+o*E+c*P,r[3]=a*m+o*b+c*R,r[6]=a*u+o*y+c*C,r[1]=l*p+d*E+h*P,r[4]=l*m+d*b+h*R,r[7]=l*u+d*y+h*C,r[2]=f*p+g*E+v*P,r[5]=f*m+g*b+v*R,r[8]=f*u+g*y+v*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=d*a-o*l,f=o*c-d*r,g=l*r-a*c,v=t*h+n*f+s*g;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const p=1/v;return e[0]=h*p,e[1]=(s*l-d*n)*p,e[2]=(o*n-s*a)*p,e[3]=f*p,e[4]=(d*t-s*c)*p,e[5]=(s*r-o*t)*p,e[6]=g*p,e[7]=(n*c-l*t)*p,e[8]=(a*t-n*r)*p,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Er.makeScale(e,t)),this}rotate(e){return this.premultiply(Er.makeRotation(-e)),this}translate(e,t){return this.premultiply(Er.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Er=new Ne;function kl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function us(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mh(){const i=us("canvas");return i.style.display="block",i}const Ro={};function ds(i){i in Ro||(Ro[i]=!0,console.warn(i))}function Sh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Co=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Po=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yh(){const i={enabled:!0,workingColorSpace:Oi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===je&&(s.r=xn(s.r),s.g=xn(s.g),s.b=xn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===je&&(s.r=Ii(s.r),s.g=Ii(s.g),s.b=Ii(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Cn?tr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ds("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ds("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Oi]:{primaries:e,whitePoint:n,transfer:tr,toXYZ:Co,fromXYZ:Po,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:dt},outputColorSpaceConfig:{drawingBufferColorSpace:dt}},[dt]:{primaries:e,whitePoint:n,transfer:je,toXYZ:Co,fromXYZ:Po,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:dt}}}),i}const We=yh();function xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ii(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ci;class Eh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ci===void 0&&(ci=us("canvas")),ci.width=e.width,ci.height=e.height;const s=ci.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ci}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=us("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=xn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(xn(t[n]/255)*255):t[n]=xn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let bh=0;class ro{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bh++}),this.uuid=Dn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(br(s[a].image)):r.push(br(s[a]))}else r=br(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function br(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Eh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Th=0;const Tr=new B;class vt extends ki{constructor(e=vt.DEFAULT_IMAGE,t=vt.DEFAULT_MAPPING,n=Zn,s=Zn,r=sn,a=jn,o=Jt,c=Sn,l=vt.DEFAULT_ANISOTROPY,d=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Th++}),this.uuid=Dn(),this.name="",this.source=new ro(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Tr).x}get height(){return this.source.getSize(Tr).y}get depth(){return this.source.getSize(Tr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Pl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case er:e.x=e.x-Math.floor(e.x);break;case Zn:e.x=e.x<0?0:1;break;case ha:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case er:e.y=e.y-Math.floor(e.y);break;case Zn:e.y=e.y<0?0:1;break;case ha:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}vt.DEFAULT_IMAGE=null;vt.DEFAULT_MAPPING=Pl;vt.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,n=0,s=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],h=c[8],f=c[1],g=c[5],v=c[9],p=c[2],m=c[6],u=c[10];if(Math.abs(d-f)<.01&&Math.abs(h-p)<.01&&Math.abs(v-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+p)<.1&&Math.abs(v+m)<.1&&Math.abs(l+g+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,y=(g+1)/2,P=(u+1)/2,R=(d+f)/4,C=(h+p)/4,N=(v+m)/4;return b>y&&b>P?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=R/n,r=C/n):y>P?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=R/s,r=N/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=C/r,s=N/r),this.set(n,s,r,t),this}let E=Math.sqrt((m-v)*(m-v)+(h-p)*(h-p)+(f-d)*(f-d));return Math.abs(E)<.001&&(E=1),this.x=(m-v)/E,this.y=(h-p)/E,this.z=(f-d)/E,this.w=Math.acos((l+g+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ah extends ki{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new vt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ro(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ti extends Ah{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class zl extends vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=xt,this.minFilter=xt,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class wh extends vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=xt,this.minFilter=xt,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class si{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Xt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Xt):Xt.fromBufferAttribute(r,a),Xt.applyMatrix4(e.matrixWorld),this.expandByPoint(Xt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xs.copy(n.boundingBox)),xs.applyMatrix4(e.matrixWorld),this.union(xs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xt),Xt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wi),Ms.subVectors(this.max,Wi),hi.subVectors(e.a,Wi),ui.subVectors(e.b,Wi),di.subVectors(e.c,Wi),En.subVectors(ui,hi),bn.subVectors(di,ui),kn.subVectors(hi,di);let t=[0,-En.z,En.y,0,-bn.z,bn.y,0,-kn.z,kn.y,En.z,0,-En.x,bn.z,0,-bn.x,kn.z,0,-kn.x,-En.y,En.x,0,-bn.y,bn.x,0,-kn.y,kn.x,0];return!Ar(t,hi,ui,di,Ms)||(t=[1,0,0,0,1,0,0,0,1],!Ar(t,hi,ui,di,Ms))?!1:(Ss.crossVectors(En,bn),t=[Ss.x,Ss.y,Ss.z],Ar(t,hi,ui,di,Ms))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const hn=[new B,new B,new B,new B,new B,new B,new B,new B],Xt=new B,xs=new si,hi=new B,ui=new B,di=new B,En=new B,bn=new B,kn=new B,Wi=new B,Ms=new B,Ss=new B,zn=new B;function Ar(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){zn.fromArray(i,r);const o=s.x*Math.abs(zn.x)+s.y*Math.abs(zn.y)+s.z*Math.abs(zn.z),c=e.dot(zn),l=t.dot(zn),d=n.dot(zn);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Rh=new si,Xi=new B,wr=new B;class zi{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Rh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xi.subVectors(e,this.center);const t=Xi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Xi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xi.copy(e.center).add(wr)),this.expandByPoint(Xi.copy(e.center).sub(wr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const un=new B,Rr=new B,ys=new B,Tn=new B,Cr=new B,Es=new B,Pr=new B;class Hl{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,un)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=un.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(un.copy(this.origin).addScaledVector(this.direction,t),un.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Rr.copy(e).add(t).multiplyScalar(.5),ys.copy(t).sub(e).normalize(),Tn.copy(this.origin).sub(Rr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ys),o=Tn.dot(this.direction),c=-Tn.dot(ys),l=Tn.lengthSq(),d=Math.abs(1-a*a);let h,f,g,v;if(d>0)if(h=a*c-o,f=a*o-c,v=r*d,h>=0)if(f>=-v)if(f<=v){const p=1/d;h*=p,f*=p,g=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=r,h=Math.max(0,-(a*f+o)),g=-h*h+f*(f+2*c)+l;else f=-r,h=Math.max(0,-(a*f+o)),g=-h*h+f*(f+2*c)+l;else f<=-v?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-c),r),g=-h*h+f*(f+2*c)+l):f<=v?(h=0,f=Math.min(Math.max(-r,-c),r),g=f*(f+2*c)+l):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-c),r),g=-h*h+f*(f+2*c)+l);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),g=-h*h+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Rr).addScaledVector(ys,f),g}intersectSphere(e,t){un.subVectors(e.center,this.origin);const n=un.dot(this.direction),s=un.dot(un)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,un)!==null}intersectTriangle(e,t,n,s,r){Cr.subVectors(t,e),Es.subVectors(n,e),Pr.crossVectors(Cr,Es);let a=this.direction.dot(Pr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Tn.subVectors(this.origin,e);const c=o*this.direction.dot(Es.crossVectors(Tn,Es));if(c<0)return null;const l=o*this.direction.dot(Cr.cross(Tn));if(l<0||c+l>a)return null;const d=-o*Tn.dot(Pr);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,n,s,r,a,o,c,l,d,h,f,g,v,p,m){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,h,f,g,v,p,m)}set(e,t,n,s,r,a,o,c,l,d,h,f,g,v,p,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=c,u[2]=l,u[6]=d,u[10]=h,u[14]=f,u[3]=g,u[7]=v,u[11]=p,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/fi.setFromMatrixColumn(e,0).length(),r=1/fi.setFromMatrixColumn(e,1).length(),a=1/fi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*d,g=a*h,v=o*d,p=o*h;t[0]=c*d,t[4]=-c*h,t[8]=l,t[1]=g+v*l,t[5]=f-p*l,t[9]=-o*c,t[2]=p-f*l,t[6]=v+g*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,g=c*h,v=l*d,p=l*h;t[0]=f+p*o,t[4]=v*o-g,t[8]=a*l,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=g*o-v,t[6]=p+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,g=c*h,v=l*d,p=l*h;t[0]=f-p*o,t[4]=-a*h,t[8]=v+g*o,t[1]=g+v*o,t[5]=a*d,t[9]=p-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,g=a*h,v=o*d,p=o*h;t[0]=c*d,t[4]=v*l-g,t[8]=f*l+p,t[1]=c*h,t[5]=p*l+f,t[9]=g*l-v,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,g=a*l,v=o*c,p=o*l;t[0]=c*d,t[4]=p-f*h,t[8]=v*h+g,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=g*h+v,t[10]=f-p*h}else if(e.order==="XZY"){const f=a*c,g=a*l,v=o*c,p=o*l;t[0]=c*d,t[4]=-h,t[8]=l*d,t[1]=f*h+p,t[5]=a*d,t[9]=g*h-v,t[2]=v*h-g,t[6]=o*d,t[10]=p*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ch,e,Ph)}lookAt(e,t,n){const s=this.elements;return Nt.subVectors(e,t),Nt.lengthSq()===0&&(Nt.z=1),Nt.normalize(),An.crossVectors(n,Nt),An.lengthSq()===0&&(Math.abs(n.z)===1?Nt.x+=1e-4:Nt.z+=1e-4,Nt.normalize(),An.crossVectors(n,Nt)),An.normalize(),bs.crossVectors(Nt,An),s[0]=An.x,s[4]=bs.x,s[8]=Nt.x,s[1]=An.y,s[5]=bs.y,s[9]=Nt.y,s[2]=An.z,s[6]=bs.z,s[10]=Nt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],h=n[5],f=n[9],g=n[13],v=n[2],p=n[6],m=n[10],u=n[14],E=n[3],b=n[7],y=n[11],P=n[15],R=s[0],C=s[4],N=s[8],S=s[12],x=s[1],A=s[5],F=s[9],U=s[13],Y=s[2],V=s[6],G=s[10],Z=s[14],H=s[3],se=s[7],ae=s[11],le=s[15];return r[0]=a*R+o*x+c*Y+l*H,r[4]=a*C+o*A+c*V+l*se,r[8]=a*N+o*F+c*G+l*ae,r[12]=a*S+o*U+c*Z+l*le,r[1]=d*R+h*x+f*Y+g*H,r[5]=d*C+h*A+f*V+g*se,r[9]=d*N+h*F+f*G+g*ae,r[13]=d*S+h*U+f*Z+g*le,r[2]=v*R+p*x+m*Y+u*H,r[6]=v*C+p*A+m*V+u*se,r[10]=v*N+p*F+m*G+u*ae,r[14]=v*S+p*U+m*Z+u*le,r[3]=E*R+b*x+y*Y+P*H,r[7]=E*C+b*A+y*V+P*se,r[11]=E*N+b*F+y*G+P*ae,r[15]=E*S+b*U+y*Z+P*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],h=e[6],f=e[10],g=e[14],v=e[3],p=e[7],m=e[11],u=e[15];return v*(+r*c*h-s*l*h-r*o*f+n*l*f+s*o*g-n*c*g)+p*(+t*c*g-t*l*f+r*a*f-s*a*g+s*l*d-r*c*d)+m*(+t*l*h-t*o*g-r*a*h+n*a*g+r*o*d-n*l*d)+u*(-s*o*d-t*c*h+t*o*f+s*a*h-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],h=e[9],f=e[10],g=e[11],v=e[12],p=e[13],m=e[14],u=e[15],E=h*m*l-p*f*l+p*c*g-o*m*g-h*c*u+o*f*u,b=v*f*l-d*m*l-v*c*g+a*m*g+d*c*u-a*f*u,y=d*p*l-v*h*l+v*o*g-a*p*g-d*o*u+a*h*u,P=v*h*c-d*p*c-v*o*f+a*p*f+d*o*m-a*h*m,R=t*E+n*b+s*y+r*P;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return e[0]=E*C,e[1]=(p*f*r-h*m*r-p*s*g+n*m*g+h*s*u-n*f*u)*C,e[2]=(o*m*r-p*c*r+p*s*l-n*m*l-o*s*u+n*c*u)*C,e[3]=(h*c*r-o*f*r-h*s*l+n*f*l+o*s*g-n*c*g)*C,e[4]=b*C,e[5]=(d*m*r-v*f*r+v*s*g-t*m*g-d*s*u+t*f*u)*C,e[6]=(v*c*r-a*m*r-v*s*l+t*m*l+a*s*u-t*c*u)*C,e[7]=(a*f*r-d*c*r+d*s*l-t*f*l-a*s*g+t*c*g)*C,e[8]=y*C,e[9]=(v*h*r-d*p*r-v*n*g+t*p*g+d*n*u-t*h*u)*C,e[10]=(a*p*r-v*o*r+v*n*l-t*p*l-a*n*u+t*o*u)*C,e[11]=(d*o*r-a*h*r-d*n*l+t*h*l+a*n*g-t*o*g)*C,e[12]=P*C,e[13]=(d*p*s-v*h*s+v*n*f-t*p*f-d*n*m+t*h*m)*C,e[14]=(v*o*s-a*p*s-v*n*c+t*p*c+a*n*m-t*o*m)*C,e[15]=(a*h*s-d*o*s+d*n*c-t*h*c-a*n*f+t*o*f)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,h=o+o,f=r*l,g=r*d,v=r*h,p=a*d,m=a*h,u=o*h,E=c*l,b=c*d,y=c*h,P=n.x,R=n.y,C=n.z;return s[0]=(1-(p+u))*P,s[1]=(g+y)*P,s[2]=(v-b)*P,s[3]=0,s[4]=(g-y)*R,s[5]=(1-(f+u))*R,s[6]=(m+E)*R,s[7]=0,s[8]=(v+b)*C,s[9]=(m-E)*C,s[10]=(1-(f+p))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=fi.set(s[0],s[1],s[2]).length();const a=fi.set(s[4],s[5],s[6]).length(),o=fi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],qt.copy(this);const l=1/r,d=1/a,h=1/o;return qt.elements[0]*=l,qt.elements[1]*=l,qt.elements[2]*=l,qt.elements[4]*=d,qt.elements[5]*=d,qt.elements[6]*=d,qt.elements[8]*=h,qt.elements[9]*=h,qt.elements[10]*=h,t.setFromRotationMatrix(qt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=an,c=!1){const l=this.elements,d=2*r/(t-e),h=2*r/(n-s),f=(t+e)/(t-e),g=(n+s)/(n-s);let v,p;if(c)v=r/(a-r),p=a*r/(a-r);else if(o===an)v=-(a+r)/(a-r),p=-2*a*r/(a-r);else if(o===nr)v=-a/(a-r),p=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=g,l[13]=0,l[2]=0,l[6]=0,l[10]=v,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=an,c=!1){const l=this.elements,d=2/(t-e),h=2/(n-s),f=-(t+e)/(t-e),g=-(n+s)/(n-s);let v,p;if(c)v=1/(a-r),p=a/(a-r);else if(o===an)v=-2/(a-r),p=-(a+r)/(a-r);else if(o===nr)v=-1/(a-r),p=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=g,l[2]=0,l[6]=0,l[10]=v,l[14]=p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const fi=new B,qt=new st,Ch=new B(0,0,0),Ph=new B(1,1,1),An=new B,bs=new B,Nt=new B,Lo=new st,Do=new ps;class yn{constructor(e=0,t=0,n=0,s=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],h=s[2],f=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,g),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Lo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Lo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Do.setFromEuler(this),this.setFromQuaternion(Do,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class Vl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Lh=0;const Io=new B,pi=new ps,dn=new st,Ts=new B,qi=new B,Dh=new B,Ih=new ps,Uo=new B(1,0,0),No=new B(0,1,0),Fo=new B(0,0,1),Oo={type:"added"},Uh={type:"removed"},mi={type:"childadded",child:null},Lr={type:"childremoved",child:null};class Tt extends ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lh++}),this.uuid=Dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new B,t=new yn,n=new ps,s=new B(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new st},normalMatrix:{value:new Ne}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return pi.setFromAxisAngle(e,t),this.quaternion.multiply(pi),this}rotateOnWorldAxis(e,t){return pi.setFromAxisAngle(e,t),this.quaternion.premultiply(pi),this}rotateX(e){return this.rotateOnAxis(Uo,e)}rotateY(e){return this.rotateOnAxis(No,e)}rotateZ(e){return this.rotateOnAxis(Fo,e)}translateOnAxis(e,t){return Io.copy(e).applyQuaternion(this.quaternion),this.position.add(Io.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Uo,e)}translateY(e){return this.translateOnAxis(No,e)}translateZ(e){return this.translateOnAxis(Fo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ts.copy(e):Ts.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(qi,Ts,this.up):dn.lookAt(Ts,qi,this.up),this.quaternion.setFromRotationMatrix(dn),s&&(dn.extractRotation(s.matrixWorld),pi.setFromRotationMatrix(dn),this.quaternion.premultiply(pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oo),mi.child=e,this.dispatchEvent(mi),mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Uh),Lr.child=e,this.dispatchEvent(Lr),Lr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oo),mi.child=e,this.dispatchEvent(mi),mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,e,Dh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,Ih,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),g=a(e.animations),v=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),v.length>0&&(n.nodes=v)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Tt.DEFAULT_UP=new B(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Yt=new B,fn=new B,Dr=new B,pn=new B,gi=new B,_i=new B,Bo=new B,Ir=new B,Ur=new B,Nr=new B,Fr=new ht,Or=new ht,Br=new ht;class Gt{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Yt.subVectors(e,t),s.cross(Yt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Yt.subVectors(s,t),fn.subVectors(n,t),Dr.subVectors(e,t);const a=Yt.dot(Yt),o=Yt.dot(fn),c=Yt.dot(Dr),l=fn.dot(fn),d=fn.dot(Dr),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,g=(l*c-o*d)*f,v=(a*d-o*c)*f;return r.set(1-g-v,v,g)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,pn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,pn.x),c.addScaledVector(a,pn.y),c.addScaledVector(o,pn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Fr.setScalar(0),Or.setScalar(0),Br.setScalar(0),Fr.fromBufferAttribute(e,t),Or.fromBufferAttribute(e,n),Br.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Fr,r.x),a.addScaledVector(Or,r.y),a.addScaledVector(Br,r.z),a}static isFrontFacing(e,t,n,s){return Yt.subVectors(n,t),fn.subVectors(e,t),Yt.cross(fn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yt.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),Yt.cross(fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Gt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Gt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Gt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Gt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Gt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;gi.subVectors(s,n),_i.subVectors(r,n),Ir.subVectors(e,n);const c=gi.dot(Ir),l=_i.dot(Ir);if(c<=0&&l<=0)return t.copy(n);Ur.subVectors(e,s);const d=gi.dot(Ur),h=_i.dot(Ur);if(d>=0&&h<=d)return t.copy(s);const f=c*h-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(gi,a);Nr.subVectors(e,r);const g=gi.dot(Nr),v=_i.dot(Nr);if(v>=0&&g<=v)return t.copy(r);const p=g*l-c*v;if(p<=0&&l>=0&&v<=0)return o=l/(l-v),t.copy(n).addScaledVector(_i,o);const m=d*v-g*h;if(m<=0&&h-d>=0&&g-v>=0)return Bo.subVectors(r,s),o=(h-d)/(h-d+(g-v)),t.copy(s).addScaledVector(Bo,o);const u=1/(m+p+f);return a=p*u,o=f*u,t.copy(n).addScaledVector(gi,a).addScaledVector(_i,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Gl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wn={h:0,s:0,l:0},As={h:0,s:0,l:0};function kr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=We.workingColorSpace){if(e=xh(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=kr(a,r,e+1/3),this.g=kr(a,r,e),this.b=kr(a,r,e-1/3)}return We.colorSpaceToWorking(this,s),this}setStyle(e,t=dt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){const n=Gl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xn(e.r),this.g=xn(e.g),this.b=xn(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return We.workingToColorSpace(yt.copy(this),e),Math.round(ze(yt.r*255,0,255))*65536+Math.round(ze(yt.g*255,0,255))*256+Math.round(ze(yt.b*255,0,255))}getHexString(e=dt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(yt.copy(this),t);const n=yt.r,s=yt.g,r=yt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=d<=.5?h/(a+o):h/(2-a-o),a){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(yt.copy(this),t),e.r=yt.r,e.g=yt.g,e.b=yt.b,e}getStyle(e=dt){We.workingToColorSpace(yt.copy(this),e);const t=yt.r,n=yt.g,s=yt.b;return e!==dt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(wn),this.setHSL(wn.h+e,wn.s+t,wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wn),e.getHSL(As);const n=Sr(wn.h,As.h,t),s=Sr(wn.s,As.s,t),r=Sr(wn.l,As.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yt=new Xe;Xe.NAMES=Gl;let Nh=0;class Hi extends ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=Dn(),this.name="",this.type="Material",this.blending=Di,this.side=Nn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Qr,this.blendDst=ea,this.blendEquation=Yn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=li,this.stencilZFail=li,this.stencilZPass=li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Di&&(n.blending=this.blending),this.side!==Nn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Qr&&(n.blendSrc=this.blendSrc),this.blendDst!==ea&&(n.blendDst=this.blendDst),this.blendEquation!==Yn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class gn extends Hi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=Cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ut=new B,ws=new He;let Fh=0;class Wt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Fh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ka,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ws.fromBufferAttribute(this,t),ws.applyMatrix3(e),this.setXY(t,ws.x,ws.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix3(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix4(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.applyNormalMatrix(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ut.fromBufferAttribute(this,t),ut.transformDirection(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array),r=Je(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ka&&(e.usage=this.usage),e}}class Wl extends Wt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Xl extends Wt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class In extends Wt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Oh=0;const Ht=new st,zr=new Tt,vi=new B,Ft=new si,Yi=new si,gt=new B;class ln extends ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=Dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kl(e)?Xl:Wl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ne().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ht.makeRotationFromQuaternion(e),this.applyMatrix4(Ht),this}rotateX(e){return Ht.makeRotationX(e),this.applyMatrix4(Ht),this}rotateY(e){return Ht.makeRotationY(e),this.applyMatrix4(Ht),this}rotateZ(e){return Ht.makeRotationZ(e),this.applyMatrix4(Ht),this}translate(e,t,n){return Ht.makeTranslation(e,t,n),this.applyMatrix4(Ht),this}scale(e,t,n){return Ht.makeScale(e,t,n),this.applyMatrix4(Ht),this}lookAt(e){return zr.lookAt(e),zr.updateMatrix(),this.applyMatrix4(zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vi).negate(),this.translate(vi.x,vi.y,vi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new In(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ft.setFromBufferAttribute(r),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const n=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Yi.setFromBufferAttribute(o),this.morphTargetsRelative?(gt.addVectors(Ft.min,Yi.min),Ft.expandByPoint(gt),gt.addVectors(Ft.max,Yi.max),Ft.expandByPoint(gt)):(Ft.expandByPoint(Yi.min),Ft.expandByPoint(Yi.max))}Ft.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)gt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(gt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)gt.fromBufferAttribute(o,l),c&&(vi.fromBufferAttribute(e,l),gt.add(vi)),s=Math.max(s,n.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let N=0;N<n.count;N++)o[N]=new B,c[N]=new B;const l=new B,d=new B,h=new B,f=new He,g=new He,v=new He,p=new B,m=new B;function u(N,S,x){l.fromBufferAttribute(n,N),d.fromBufferAttribute(n,S),h.fromBufferAttribute(n,x),f.fromBufferAttribute(r,N),g.fromBufferAttribute(r,S),v.fromBufferAttribute(r,x),d.sub(l),h.sub(l),g.sub(f),v.sub(f);const A=1/(g.x*v.y-v.x*g.y);isFinite(A)&&(p.copy(d).multiplyScalar(v.y).addScaledVector(h,-g.y).multiplyScalar(A),m.copy(h).multiplyScalar(g.x).addScaledVector(d,-v.x).multiplyScalar(A),o[N].add(p),o[S].add(p),o[x].add(p),c[N].add(m),c[S].add(m),c[x].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let N=0,S=E.length;N<S;++N){const x=E[N],A=x.start,F=x.count;for(let U=A,Y=A+F;U<Y;U+=3)u(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const b=new B,y=new B,P=new B,R=new B;function C(N){P.fromBufferAttribute(s,N),R.copy(P);const S=o[N];b.copy(S),b.sub(P.multiplyScalar(P.dot(S))).normalize(),y.crossVectors(R,S);const A=y.dot(c[N])<0?-1:1;a.setXYZW(N,b.x,b.y,b.z,A)}for(let N=0,S=E.length;N<S;++N){const x=E[N],A=x.start,F=x.count;for(let U=A,Y=A+F;U<Y;U+=3)C(e.getX(U+0)),C(e.getX(U+1)),C(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Wt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);const s=new B,r=new B,a=new B,o=new B,c=new B,l=new B,d=new B,h=new B;if(e)for(let f=0,g=e.count;f<g;f+=3){const v=e.getX(f+0),p=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,v),r.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),o.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(p,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,g=t.count;f<g;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,h=o.normalized,f=new l.constructor(c.length*d);let g=0,v=0;for(let p=0,m=c.length;p<m;p++){o.isInterleavedBufferAttribute?g=c[p]*o.data.stride+o.offset:g=c[p]*d;for(let u=0;u<d;u++)f[v++]=l[g++]}return new Wt(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ln,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,h=l.length;d<h;d++){const f=l[d],g=e(f,n);c.push(g)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let h=0,f=l.length;h<f;h++){const g=l[h];d.push(g.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],h=r[l];for(let f=0,g=h.length;f<g;f++)d.push(h[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ko=new st,Hn=new Hl,Rs=new zi,zo=new B,Cs=new B,Ps=new B,Ls=new B,Hr=new B,Ds=new B,Ho=new B,Is=new B;class Ct extends Tt{constructor(e=new ln,t=new gn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ds.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],h=r[c];d!==0&&(Hr.fromBufferAttribute(h,e),a?Ds.addScaledVector(Hr,d):Ds.addScaledVector(Hr.sub(t),d))}t.add(Ds)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Rs.copy(n.boundingSphere),Rs.applyMatrix4(r),Hn.copy(e.ray).recast(e.near),!(Rs.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(Rs,zo)===null||Hn.origin.distanceToSquared(zo)>(e.far-e.near)**2))&&(ko.copy(r).invert(),Hn.copy(e.ray).applyMatrix4(ko),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Hn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,f=r.groups,g=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,p=f.length;v<p;v++){const m=f[v],u=a[m.materialIndex],E=Math.max(m.start,g.start),b=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let y=E,P=b;y<P;y+=3){const R=o.getX(y),C=o.getX(y+1),N=o.getX(y+2);s=Us(this,u,e,n,l,d,h,R,C,N),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const v=Math.max(0,g.start),p=Math.min(o.count,g.start+g.count);for(let m=v,u=p;m<u;m+=3){const E=o.getX(m),b=o.getX(m+1),y=o.getX(m+2);s=Us(this,a,e,n,l,d,h,E,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let v=0,p=f.length;v<p;v++){const m=f[v],u=a[m.materialIndex],E=Math.max(m.start,g.start),b=Math.min(c.count,Math.min(m.start+m.count,g.start+g.count));for(let y=E,P=b;y<P;y+=3){const R=y,C=y+1,N=y+2;s=Us(this,u,e,n,l,d,h,R,C,N),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const v=Math.max(0,g.start),p=Math.min(c.count,g.start+g.count);for(let m=v,u=p;m<u;m+=3){const E=m,b=m+1,y=m+2;s=Us(this,a,e,n,l,d,h,E,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Bh(i,e,t,n,s,r,a,o){let c;if(e.side===Dt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Nn,o),c===null)return null;Is.copy(o),Is.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Is);return l<t.near||l>t.far?null:{distance:l,point:Is.clone(),object:i}}function Us(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Cs),i.getVertexPosition(c,Ps),i.getVertexPosition(l,Ls);const d=Bh(i,e,t,n,Cs,Ps,Ls,Ho);if(d){const h=new B;Gt.getBarycoord(Ho,Cs,Ps,Ls,h),s&&(d.uv=Gt.getInterpolatedAttribute(s,o,c,l,h,new He)),r&&(d.uv1=Gt.getInterpolatedAttribute(r,o,c,l,h,new He)),a&&(d.normal=Gt.getInterpolatedAttribute(a,o,c,l,h,new B),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new B,materialIndex:0};Gt.getNormal(Cs,Ps,Ls,f.normal),d.face=f,d.barycoord=h}return d}class ms extends ln{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],h=[];let f=0,g=0;v("z","y","x",-1,-1,n,t,e,a,r,0),v("z","y","x",1,-1,n,t,-e,a,r,1),v("x","z","y",1,1,e,n,t,s,a,2),v("x","z","y",1,-1,e,n,-t,s,a,3),v("x","y","z",1,-1,e,t,n,s,r,4),v("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new In(l,3)),this.setAttribute("normal",new In(d,3)),this.setAttribute("uv",new In(h,2));function v(p,m,u,E,b,y,P,R,C,N,S){const x=y/C,A=P/N,F=y/2,U=P/2,Y=R/2,V=C+1,G=N+1;let Z=0,H=0;const se=new B;for(let ae=0;ae<G;ae++){const le=ae*A-U;for(let we=0;we<V;we++){const qe=we*x-F;se[p]=qe*E,se[m]=le*b,se[u]=Y,l.push(se.x,se.y,se.z),se[p]=0,se[m]=0,se[u]=R>0?1:-1,d.push(se.x,se.y,se.z),h.push(we/C),h.push(1-ae/N),Z+=1}}for(let ae=0;ae<N;ae++)for(let le=0;le<C;le++){const we=f+le+V*ae,qe=f+le+V*(ae+1),Ke=f+(le+1)+V*(ae+1),Ye=f+(le+1)+V*ae;c.push(we,qe,Ye),c.push(qe,Ke,Ye),H+=6}o.addGroup(g,H,S),g+=H,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ms(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Rt(i){const e={};for(let t=0;t<i.length;t++){const n=Bi(i[t]);for(const s in n)e[s]=n[s]}return e}function kh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ql(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}const zh={clone:Bi,merge:Rt};var Hh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends Hi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Hh,this.fragmentShader=Vh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bi(e.uniforms),this.uniformsGroups=kh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Yl extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=an,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Rn=new B,Vo=new He,Go=new He;class Zt extends Yl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Mr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return za*2*Math.atan(Math.tan(Mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Rn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z),Rn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rn.x,Rn.y).multiplyScalar(-e/Rn.z)}getViewSize(e,t){return this.getViewBounds(e,Vo,Go),t.subVectors(Go,Vo)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Mr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const xi=-90,Mi=1;class Gh extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zt(xi,Mi,e,t);s.layers=this.layers,this.add(s);const r=new Zt(xi,Mi,e,t);r.layers=this.layers,this.add(r);const a=new Zt(xi,Mi,e,t);a.layers=this.layers,this.add(a);const o=new Zt(xi,Mi,e,t);o.layers=this.layers,this.add(o);const c=new Zt(xi,Mi,e,t);c.layers=this.layers,this.add(c);const l=new Zt(xi,Mi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===an)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===nr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const p=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=p,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(h,f,g),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class $l extends vt{constructor(e=[],t=Ni,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Wh extends ti{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new $l(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ms(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:Bi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:Pn});r.uniforms.tEquirect.value=t;const a=new Ct(s,r),o=t.minFilter;return t.minFilter===jn&&(t.minFilter=sn),new Gh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Ns extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xh={type:"move"};class Vr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ns,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ns,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ns,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const p of e.hand.values()){const m=t.getJointPose(p,n),u=this._getHandJoint(l,p);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=d.position.distanceTo(h.position),g=.02,v=.005;l.inputState.pinching&&f>g+v?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=g-v&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Xh)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ns;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class qh extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Yh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ka,this.updateRanges=[],this.version=0,this.uuid=Dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const wt=new B;class ir{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),s=Je(s,this.array),r=Je(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Wt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ir(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Kl extends Hi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Si;const $i=new B,yi=new B,Ei=new B,bi=new He,Ki=new He,Zl=new st,Fs=new B,Zi=new B,Os=new B,Wo=new He,Gr=new He,Xo=new He;class qo extends Tt{constructor(e=new Kl){if(super(),this.isSprite=!0,this.type="Sprite",Si===void 0){Si=new ln;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Yh(t,5);Si.setIndex([0,1,2,0,2,3]),Si.setAttribute("position",new ir(n,3,0,!1)),Si.setAttribute("uv",new ir(n,2,3,!1))}this.geometry=Si,this.material=e,this.center=new He(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),yi.setFromMatrixScale(this.matrixWorld),Zl.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ei.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&yi.multiplyScalar(-Ei.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Bs(Fs.set(-.5,-.5,0),Ei,a,yi,s,r),Bs(Zi.set(.5,-.5,0),Ei,a,yi,s,r),Bs(Os.set(.5,.5,0),Ei,a,yi,s,r),Wo.set(0,0),Gr.set(1,0),Xo.set(1,1);let o=e.ray.intersectTriangle(Fs,Zi,Os,!1,$i);if(o===null&&(Bs(Zi.set(-.5,.5,0),Ei,a,yi,s,r),Gr.set(0,1),o=e.ray.intersectTriangle(Fs,Os,Zi,!1,$i),o===null))return;const c=e.ray.origin.distanceTo($i);c<e.near||c>e.far||t.push({distance:c,point:$i.clone(),uv:Gt.getInterpolation($i,Fs,Zi,Os,Wo,Gr,Xo,new He),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Bs(i,e,t,n,s,r){bi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ki.x=r*bi.x-s*bi.y,Ki.y=s*bi.x+r*bi.y):Ki.copy(bi),i.copy(e),i.x+=Ki.x,i.y+=Ki.y,i.applyMatrix4(Zl)}class $h extends vt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=xt,d=xt,h,f){super(null,a,o,c,l,d,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yo extends Wt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ti=new st,$o=new st,ks=[],Ko=new si,Kh=new st,ji=new Ct,Ji=new zi;class Qi extends Ct{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Yo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Kh)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new si),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ti),Ko.copy(e.boundingBox).applyMatrix4(Ti),this.boundingBox.union(Ko)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new zi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ti),Ji.copy(e.boundingSphere).applyMatrix4(Ti),this.boundingSphere.union(Ji)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ji.geometry=this.geometry,ji.material=this.material,ji.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ji.copy(this.boundingSphere),Ji.applyMatrix4(n),e.ray.intersectsSphere(Ji)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ti),$o.multiplyMatrices(n,Ti),ji.matrixWorld=$o,ji.raycast(e,ks);for(let a=0,o=ks.length;a<o;a++){const c=ks[a];c.instanceId=r,c.object=this,t.push(c)}ks.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Yo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new $h(new Float32Array(s*this.count),s,this.count,to,rn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Wr=new B,Zh=new B,jh=new Ne;class Xn{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Wr.subVectors(n,t).cross(Zh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Wr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||jh.getNormalMatrix(e),s=this.coplanarPoint(Wr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vn=new zi,Jh=new He(.5,.5),zs=new B;class jl{constructor(e=new Xn,t=new Xn,n=new Xn,s=new Xn,r=new Xn,a=new Xn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=an,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],h=r[5],f=r[6],g=r[7],v=r[8],p=r[9],m=r[10],u=r[11],E=r[12],b=r[13],y=r[14],P=r[15];if(s[0].setComponents(l-a,g-d,u-v,P-E).normalize(),s[1].setComponents(l+a,g+d,u+v,P+E).normalize(),s[2].setComponents(l+o,g+h,u+p,P+b).normalize(),s[3].setComponents(l-o,g-h,u-p,P-b).normalize(),n)s[4].setComponents(c,f,m,y).normalize(),s[5].setComponents(l-c,g-f,u-m,P-y).normalize();else if(s[4].setComponents(l-c,g-f,u-m,P-y).normalize(),t===an)s[5].setComponents(l+c,g+f,u+m,P+y).normalize();else if(t===nr)s[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(e){Vn.center.set(0,0,0);const t=Jh.distanceTo(e.center);return Vn.radius=.7071067811865476+t,Vn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(zs.x=s.normal.x>0?e.max.x:e.min.x,zs.y=s.normal.y>0?e.max.y:e.min.y,zs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(zs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jl extends Hi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const sr=new B,rr=new B,Zo=new st,es=new Hl,Hs=new zi,Xr=new B,jo=new B;class Qh extends Tt{constructor(e=new ln,t=new Jl){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)sr.fromBufferAttribute(t,s-1),rr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=sr.distanceTo(rr);e.setAttribute("lineDistance",new In(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(s),Hs.radius+=r,e.ray.intersectsSphere(Hs)===!1)return;Zo.copy(s).invert(),es.copy(e.ray).applyMatrix4(Zo);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const g=Math.max(0,a.start),v=Math.min(d.count,a.start+a.count);for(let p=g,m=v-1;p<m;p+=l){const u=d.getX(p),E=d.getX(p+1),b=Vs(this,e,es,c,u,E,p);b&&t.push(b)}if(this.isLineLoop){const p=d.getX(v-1),m=d.getX(g),u=Vs(this,e,es,c,p,m,v-1);u&&t.push(u)}}else{const g=Math.max(0,a.start),v=Math.min(f.count,a.start+a.count);for(let p=g,m=v-1;p<m;p+=l){const u=Vs(this,e,es,c,p,p+1,p);u&&t.push(u)}if(this.isLineLoop){const p=Vs(this,e,es,c,v-1,g,v-1);p&&t.push(p)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Vs(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(sr.fromBufferAttribute(o,s),rr.fromBufferAttribute(o,r),t.distanceSqToSegment(sr,rr,Xr,jo)>n)return;Xr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Xr);if(!(l<e.near||l>e.far))return{distance:l,point:jo.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Jo extends Qh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Zs extends vt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ql extends vt{constructor(e,t,n=ei,s,r,a,o=xt,c=xt,l,d=cs,h=1){if(d!==cs&&d!==hs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ro(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ec extends vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class $t extends ln{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,h=e/o,f=t/c,g=[],v=[],p=[],m=[];for(let u=0;u<d;u++){const E=u*f-a;for(let b=0;b<l;b++){const y=b*h-r;v.push(y,-E,0),p.push(0,0,1),m.push(b/o),m.push(1-u/c)}}for(let u=0;u<c;u++)for(let E=0;E<o;E++){const b=E+l*u,y=E+l*(u+1),P=E+1+l*(u+1),R=E+1+l*u;g.push(b,y,R),g.push(y,P,R)}this.setIndex(g),this.setAttribute("position",new In(v,3)),this.setAttribute("normal",new In(p,3)),this.setAttribute("uv",new In(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.width,e.height,e.widthSegments,e.heightSegments)}}class eu extends Hi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class tu extends Hi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const qr={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class nu{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,h){return l.push(d,h),this},this.removeHandler=function(d){const h=l.indexOf(d);return h!==-1&&l.splice(h,2),this},this.getHandler=function(d){for(let h=0,f=l.length;h<f;h+=2){const g=l[h],v=l[h+1];if(g.global&&(g.lastIndex=0),g.test(d))return v}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const iu=new nu;class ao{constructor(e){this.manager=e!==void 0?e:iu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ao.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ai=new WeakMap;class su extends ao{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=qr.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let h=Ai.get(a);h===void 0&&(h=[],Ai.set(a,h)),h.push({onLoad:t,onError:s})}return a}const o=us("img");function c(){d(),t&&t(this);const h=Ai.get(this)||[];for(let f=0;f<h.length;f++){const g=h[f];g.onLoad&&g.onLoad(this)}Ai.delete(this),r.manager.itemEnd(e)}function l(h){d(),s&&s(h),qr.remove(`image:${e}`);const f=Ai.get(this)||[];for(let g=0;g<f.length;g++){const v=f[g];v.onError&&v.onError(h)}Ai.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function d(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),qr.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class tc extends ao{constructor(e){super(e)}load(e,t,n,s){const r=new vt,a=new su(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class nc extends Yl{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ru extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function Qo(i,e,t,n){const s=au(n);switch(t){case Nl:return i*e;case to:return i*e/s.components*s.byteLength;case no:return i*e/s.components*s.byteLength;case Ol:return i*e*2/s.components*s.byteLength;case io:return i*e*2/s.components*s.byteLength;case Fl:return i*e*3/s.components*s.byteLength;case Jt:return i*e*4/s.components*s.byteLength;case so:return i*e*4/s.components*s.byteLength;case qs:case Ys:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case $s:case Ks:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case da:case pa:return Math.max(i,16)*Math.max(e,8)/4;case ua:case fa:return Math.max(i,8)*Math.max(e,8)/2;case ma:case ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case xa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ma:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ba:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case wa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ra:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ca:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Pa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case La:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Da:case Ia:case Ua:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Na:case Fa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Oa:case Ba:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function au(i){switch(i){case Sn:case Ll:return{byteLength:1,components:1};case os:case Dl:case fs:return{byteLength:2,components:1};case Qa:case eo:return{byteLength:2,components:4};case ei:case Ja:case rn:return{byteLength:4,components:1};case Il:case Ul:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ja}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ja);function ic(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ou(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,h=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let g;if(l instanceof Float32Array)g=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)g=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)g=i.SHORT;else if(l instanceof Uint32Array)g=i.UNSIGNED_INT;else if(l instanceof Int32Array)g=i.INT;else if(l instanceof Int8Array)g=i.BYTE;else if(l instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:g,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){const d=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,d);else{h.sort((g,v)=>g.start-v.start);let f=0;for(let g=1;g<h.length;g++){const v=h[f],p=h[g];p.start<=v.start+v.count+1?v.count=Math.max(v.count,p.start+p.count-v.start):(++f,h[f]=p)}h.length=f+1;for(let g=0,v=h.length;g<v;g++){const p=h[g];i.bufferSubData(l,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var lu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cu=`#ifdef USE_ALPHAHASH
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
#endif`,hu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,du=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pu=`#ifdef USE_AOMAP
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
#endif`,mu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gu=`#ifdef USE_BATCHING
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
#endif`,_u=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Su=`#ifdef USE_IRIDESCENCE
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
#endif`,yu=`#ifdef USE_BUMPMAP
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
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Au=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ru=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Cu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pu=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lu=`#define PI 3.141592653589793
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
} // validated`,Du=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Iu=`vec3 transformedNormal = objectNormal;
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
#endif`,Uu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ou=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bu="gl_FragColor = linearToOutputTexel( gl_FragColor );",ku=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zu=`#ifdef USE_ENVMAP
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
#endif`,Hu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vu=`#ifdef USE_ENVMAP
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
#endif`,Gu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wu=`#ifdef USE_ENVMAP
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
#endif`,Xu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ku=`#ifdef USE_GRADIENTMAP
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
}`,Zu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ju=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ju=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qu=`uniform bool receiveShadow;
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
#endif`,ed=`#ifdef USE_ENVMAP
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
#endif`,td=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,id=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rd=`PhysicalMaterial material;
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
#endif`,ad=`struct PhysicalMaterial {
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
}`,od=`
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
#endif`,ld=`#if defined( RE_IndirectDiffuse )
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
#endif`,cd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ud=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_d=`#if defined( USE_POINTS_UV )
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
#endif`,vd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Md=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ed=`#ifdef USE_MORPHTARGETS
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
#endif`,bd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Td=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ad=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pd=`#ifdef USE_NORMALMAP
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
#endif`,Ld=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Id=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ud=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Od=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qd=`float getShadowMask() {
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
}`,Yd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$d=`#ifdef USE_SKINNING
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
#endif`,Kd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zd=`#ifdef USE_SKINNING
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
#endif`,jd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ef=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tf=`#ifdef USE_TRANSMISSION
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
#endif`,nf=`#ifdef USE_TRANSMISSION
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
#endif`,sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,of=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cf=`uniform sampler2D t2D;
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
}`,hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,df=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ff=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pf=`#include <common>
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
}`,mf=`#if DEPTH_PACKING == 3200
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
}`,gf=`#define DISTANCE
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
}`,_f=`#define DISTANCE
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
}`,vf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mf=`uniform float scale;
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
}`,Sf=`uniform vec3 diffuse;
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
}`,yf=`#include <common>
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
}`,Ef=`uniform vec3 diffuse;
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
}`,bf=`#define LAMBERT
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
}`,Tf=`#define LAMBERT
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
}`,Af=`#define MATCAP
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
}`,wf=`#define MATCAP
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
}`,Rf=`#define NORMAL
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
}`,Cf=`#define NORMAL
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
}`,Pf=`#define PHONG
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
}`,Lf=`#define PHONG
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
}`,Df=`#define STANDARD
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
}`,If=`#define STANDARD
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
}`,Uf=`#define TOON
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
}`,Nf=`#define TOON
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
}`,Ff=`uniform float size;
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
}`,Of=`uniform vec3 diffuse;
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
}`,Bf=`#include <common>
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
}`,kf=`uniform vec3 color;
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
}`,zf=`uniform float rotation;
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
}`,Hf=`uniform vec3 diffuse;
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
}`,Oe={alphahash_fragment:lu,alphahash_pars_fragment:cu,alphamap_fragment:hu,alphamap_pars_fragment:uu,alphatest_fragment:du,alphatest_pars_fragment:fu,aomap_fragment:pu,aomap_pars_fragment:mu,batching_pars_vertex:gu,batching_vertex:_u,begin_vertex:vu,beginnormal_vertex:xu,bsdfs:Mu,iridescence_fragment:Su,bumpmap_pars_fragment:yu,clipping_planes_fragment:Eu,clipping_planes_pars_fragment:bu,clipping_planes_pars_vertex:Tu,clipping_planes_vertex:Au,color_fragment:wu,color_pars_fragment:Ru,color_pars_vertex:Cu,color_vertex:Pu,common:Lu,cube_uv_reflection_fragment:Du,defaultnormal_vertex:Iu,displacementmap_pars_vertex:Uu,displacementmap_vertex:Nu,emissivemap_fragment:Fu,emissivemap_pars_fragment:Ou,colorspace_fragment:Bu,colorspace_pars_fragment:ku,envmap_fragment:zu,envmap_common_pars_fragment:Hu,envmap_pars_fragment:Vu,envmap_pars_vertex:Gu,envmap_physical_pars_fragment:ed,envmap_vertex:Wu,fog_vertex:Xu,fog_pars_vertex:qu,fog_fragment:Yu,fog_pars_fragment:$u,gradientmap_pars_fragment:Ku,lightmap_pars_fragment:Zu,lights_lambert_fragment:ju,lights_lambert_pars_fragment:Ju,lights_pars_begin:Qu,lights_toon_fragment:td,lights_toon_pars_fragment:nd,lights_phong_fragment:id,lights_phong_pars_fragment:sd,lights_physical_fragment:rd,lights_physical_pars_fragment:ad,lights_fragment_begin:od,lights_fragment_maps:ld,lights_fragment_end:cd,logdepthbuf_fragment:hd,logdepthbuf_pars_fragment:ud,logdepthbuf_pars_vertex:dd,logdepthbuf_vertex:fd,map_fragment:pd,map_pars_fragment:md,map_particle_fragment:gd,map_particle_pars_fragment:_d,metalnessmap_fragment:vd,metalnessmap_pars_fragment:xd,morphinstance_vertex:Md,morphcolor_vertex:Sd,morphnormal_vertex:yd,morphtarget_pars_vertex:Ed,morphtarget_vertex:bd,normal_fragment_begin:Td,normal_fragment_maps:Ad,normal_pars_fragment:wd,normal_pars_vertex:Rd,normal_vertex:Cd,normalmap_pars_fragment:Pd,clearcoat_normal_fragment_begin:Ld,clearcoat_normal_fragment_maps:Dd,clearcoat_pars_fragment:Id,iridescence_pars_fragment:Ud,opaque_fragment:Nd,packing:Fd,premultiplied_alpha_fragment:Od,project_vertex:Bd,dithering_fragment:kd,dithering_pars_fragment:zd,roughnessmap_fragment:Hd,roughnessmap_pars_fragment:Vd,shadowmap_pars_fragment:Gd,shadowmap_pars_vertex:Wd,shadowmap_vertex:Xd,shadowmask_pars_fragment:qd,skinbase_vertex:Yd,skinning_pars_vertex:$d,skinning_vertex:Kd,skinnormal_vertex:Zd,specularmap_fragment:jd,specularmap_pars_fragment:Jd,tonemapping_fragment:Qd,tonemapping_pars_fragment:ef,transmission_fragment:tf,transmission_pars_fragment:nf,uv_pars_fragment:sf,uv_pars_vertex:rf,uv_vertex:af,worldpos_vertex:of,background_vert:lf,background_frag:cf,backgroundCube_vert:hf,backgroundCube_frag:uf,cube_vert:df,cube_frag:ff,depth_vert:pf,depth_frag:mf,distanceRGBA_vert:gf,distanceRGBA_frag:_f,equirect_vert:vf,equirect_frag:xf,linedashed_vert:Mf,linedashed_frag:Sf,meshbasic_vert:yf,meshbasic_frag:Ef,meshlambert_vert:bf,meshlambert_frag:Tf,meshmatcap_vert:Af,meshmatcap_frag:wf,meshnormal_vert:Rf,meshnormal_frag:Cf,meshphong_vert:Pf,meshphong_frag:Lf,meshphysical_vert:Df,meshphysical_frag:If,meshtoon_vert:Uf,meshtoon_frag:Nf,points_vert:Ff,points_frag:Of,shadow_vert:Bf,shadow_frag:kf,sprite_vert:zf,sprite_frag:Hf},oe={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},tn={basic:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Rt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Rt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Rt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Rt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Rt([oe.points,oe.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Rt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Rt([oe.common,oe.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Rt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Rt([oe.sprite,oe.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Rt([oe.common,oe.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Rt([oe.lights,oe.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};tn.physical={uniforms:Rt([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Gs={r:0,b:0,g:0},Gn=new yn,Vf=new st;function Gf(i,e,t,n,s,r,a){const o=new Xe(0);let c=r===!0?0:1,l,d,h=null,f=0,g=null;function v(b){let y=b.isScene===!0?b.background:null;return y&&y.isTexture&&(y=(b.backgroundBlurriness>0?t:e).get(y)),y}function p(b){let y=!1;const P=v(b);P===null?u(o,c):P&&P.isColor&&(u(P,1),y=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,y){const P=v(y);P&&(P.isCubeTexture||P.mapping===ur)?(d===void 0&&(d=new Ct(new ms(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:Bi(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(R,C,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Gn.copy(y.backgroundRotation),Gn.x*=-1,Gn.y*=-1,Gn.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(Gn.y*=-1,Gn.z*=-1),d.material.uniforms.envMap.value=P,d.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Vf.makeRotationFromEuler(Gn)),d.material.toneMapped=We.getTransfer(P.colorSpace)!==je,(h!==P||f!==P.version||g!==i.toneMapping)&&(d.material.needsUpdate=!0,h=P,f=P.version,g=i.toneMapping),d.layers.enableAll(),b.unshift(d,d.geometry,d.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new Ct(new $t(2,2),new Fn({name:"BackgroundMaterial",uniforms:Bi(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=We.getTransfer(P.colorSpace)!==je,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(h!==P||f!==P.version||g!==i.toneMapping)&&(l.material.needsUpdate=!0,h=P,f=P.version,g=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function u(b,y){b.getRGB(Gs,ql(i)),n.buffers.color.setClear(Gs.r,Gs.g,Gs.b,y,a)}function E(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,y=1){o.set(b),c=y,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,u(o,c)},render:p,addToRenderList:m,dispose:E}}function Wf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(x,A,F,U,Y){let V=!1;const G=h(U,F,A);r!==G&&(r=G,l(r.object)),V=g(x,U,F,Y),V&&v(x,U,F,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,y(x,A,F,U),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function d(x){return i.deleteVertexArray(x)}function h(x,A,F){const U=F.wireframe===!0;let Y=n[x.id];Y===void 0&&(Y={},n[x.id]=Y);let V=Y[A.id];V===void 0&&(V={},Y[A.id]=V);let G=V[U];return G===void 0&&(G=f(c()),V[U]=G),G}function f(x){const A=[],F=[],U=[];for(let Y=0;Y<t;Y++)A[Y]=0,F[Y]=0,U[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:F,attributeDivisors:U,object:x,attributes:{},index:null}}function g(x,A,F,U){const Y=r.attributes,V=A.attributes;let G=0;const Z=F.getAttributes();for(const H in Z)if(Z[H].location>=0){const ae=Y[H];let le=V[H];if(le===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(le=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(le=x.instanceColor)),ae===void 0||ae.attribute!==le||le&&ae.data!==le.data)return!0;G++}return r.attributesNum!==G||r.index!==U}function v(x,A,F,U){const Y={},V=A.attributes;let G=0;const Z=F.getAttributes();for(const H in Z)if(Z[H].location>=0){let ae=V[H];ae===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor));const le={};le.attribute=ae,ae&&ae.data&&(le.data=ae.data),Y[H]=le,G++}r.attributes=Y,r.attributesNum=G,r.index=U}function p(){const x=r.newAttributes;for(let A=0,F=x.length;A<F;A++)x[A]=0}function m(x){u(x,0)}function u(x,A){const F=r.newAttributes,U=r.enabledAttributes,Y=r.attributeDivisors;F[x]=1,U[x]===0&&(i.enableVertexAttribArray(x),U[x]=1),Y[x]!==A&&(i.vertexAttribDivisor(x,A),Y[x]=A)}function E(){const x=r.newAttributes,A=r.enabledAttributes;for(let F=0,U=A.length;F<U;F++)A[F]!==x[F]&&(i.disableVertexAttribArray(F),A[F]=0)}function b(x,A,F,U,Y,V,G){G===!0?i.vertexAttribIPointer(x,A,F,Y,V):i.vertexAttribPointer(x,A,F,U,Y,V)}function y(x,A,F,U){p();const Y=U.attributes,V=F.getAttributes(),G=A.defaultAttributeValues;for(const Z in V){const H=V[Z];if(H.location>=0){let se=Y[Z];if(se===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(se=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(se=x.instanceColor)),se!==void 0){const ae=se.normalized,le=se.itemSize,we=e.get(se);if(we===void 0)continue;const qe=we.buffer,Ke=we.type,Ye=we.bytesPerElement,$=Ke===i.INT||Ke===i.UNSIGNED_INT||se.gpuType===Ja;if(se.isInterleavedBufferAttribute){const J=se.data,pe=J.stride,Le=se.offset;if(J.isInstancedInterleavedBuffer){for(let Ee=0;Ee<H.locationSize;Ee++)u(H.location+Ee,J.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Ee=0;Ee<H.locationSize;Ee++)m(H.location+Ee);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let Ee=0;Ee<H.locationSize;Ee++)b(H.location+Ee,le/H.locationSize,Ke,ae,pe*Ye,(Le+le/H.locationSize*Ee)*Ye,$)}else{if(se.isInstancedBufferAttribute){for(let J=0;J<H.locationSize;J++)u(H.location+J,se.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let J=0;J<H.locationSize;J++)m(H.location+J);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let J=0;J<H.locationSize;J++)b(H.location+J,le/H.locationSize,Ke,ae,le*Ye,le/H.locationSize*J*Ye,$)}}else if(G!==void 0){const ae=G[Z];if(ae!==void 0)switch(ae.length){case 2:i.vertexAttrib2fv(H.location,ae);break;case 3:i.vertexAttrib3fv(H.location,ae);break;case 4:i.vertexAttrib4fv(H.location,ae);break;default:i.vertexAttrib1fv(H.location,ae)}}}}E()}function P(){N();for(const x in n){const A=n[x];for(const F in A){const U=A[F];for(const Y in U)d(U[Y].object),delete U[Y];delete A[F]}delete n[x]}}function R(x){if(n[x.id]===void 0)return;const A=n[x.id];for(const F in A){const U=A[F];for(const Y in U)d(U[Y].object),delete U[Y];delete A[F]}delete n[x.id]}function C(x){for(const A in n){const F=n[A];if(F[x.id]===void 0)continue;const U=F[x.id];for(const Y in U)d(U[Y].object),delete U[Y];delete F[x.id]}}function N(){S(),a=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:N,resetDefaultState:S,dispose:P,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:p,enableAttribute:m,disableUnusedAttributes:E}}function Xf(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,h){h!==0&&(i.drawArraysInstanced(n,l,d,h),t.update(d,n,h))}function o(l,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=d[v];t.update(g,n,1)}function c(l,d,h,f){if(h===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let v=0;v<l.length;v++)a(l[v],d[v],f[v]);else{g.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,h);let v=0;for(let p=0;p<h;p++)v+=d[p]*f[p];t.update(v,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function qf(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Jt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const N=C===fs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Sn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==rn&&!N)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=v>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:g,maxVertexTextures:v,maxTextureSize:p,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:y,vertexTextures:P,maxSamples:R}}function Yf(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Xn,o=new Ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const g=h.length!==0||f||n!==0||s;return s=f,n=h.length,g},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,g){const v=h.clippingPlanes,p=h.clipIntersection,m=h.clipShadows,u=i.get(h);if(!s||v===null||v.length===0||r&&!m)r?d(null):l();else{const E=r?0:n,b=E*4;let y=u.clippingState||null;c.value=y,y=d(v,f,b,g);for(let P=0;P!==b;++P)y[P]=t[P];u.clippingState=y,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,f,g,v){const p=h!==null?h.length:0;let m=null;if(p!==0){if(m=c.value,v!==!0||m===null){const u=g+p*4,E=f.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<u)&&(m=new Float32Array(u));for(let b=0,y=g;b!==p;++b,y+=4)a.copy(h[b]).applyMatrix4(E,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=p,e.numIntersection=0,m}}function $f(i){let e=new WeakMap;function t(a,o){return o===la?a.mapping=Ni:o===ca&&(a.mapping=Fi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===la||o===ca)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Wh(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ri=4,el=[.125,.215,.35,.446,.526,.582],$n=20,Yr=new nc,tl=new Xe;let $r=null,Kr=0,Zr=0,jr=!1;const qn=(1+Math.sqrt(5))/2,wi=1/qn,nl=[new B(-qn,wi,0),new B(qn,wi,0),new B(-wi,0,qn),new B(wi,0,qn),new B(0,qn,-wi),new B(0,qn,wi),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)],Kf=new B;class il{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Kf}=r;$r=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),Zr=this._renderer.getActiveMipmapLevel(),jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=al(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($r,Kr,Zr),this._renderer.xr.enabled=jr,e.scissorTest=!1,Ws(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ni||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$r=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),Zr=this._renderer.getActiveMipmapLevel(),jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:fs,format:Jt,colorSpace:Oi,depthBuffer:!1},s=sl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zf(r)),this._blurMaterial=jf(r,e,t)}return s}_compileMaterial(e){const t=new Ct(this._lodPlanes[0],e);this._renderer.compile(t,Yr)}_sceneToCubeUV(e,t,n,s,r){const c=new Zt(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,g=h.toneMapping;h.getClearColor(tl),h.toneMapping=Ln,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const p=new gn({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),m=new Ct(new ms,p);let u=!1;const E=e.background;E?E.isColor&&(p.color.copy(E),e.background=null,u=!0):(p.color.copy(tl),u=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[b],r.y,r.z)):y===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[b]));const P=this._cubeSize;Ws(s,y*P,b>2?P:0,P,P),h.setRenderTarget(s),u&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=g,h.autoClear=f,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ni||e.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=al()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ct(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Ws(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Yr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=nl[(s-r-1)%nl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new Ct(this._lodPlanes[s],l),f=l.uniforms,g=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*$n-1),p=r/v,m=isFinite(r)?1+Math.floor(d*p):$n;m>$n&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${$n}`);const u=[];let E=0;for(let C=0;C<$n;++C){const N=C/p,S=Math.exp(-N*N/2);u.push(S),C===0?E+=S:C<m&&(E+=2*S)}for(let C=0;C<u.length;C++)u[C]=u[C]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:b}=this;f.dTheta.value=v,f.mipInt.value=b-n;const y=this._sizeLods[s],P=3*y*(s>b-Ri?s-b+Ri:0),R=4*(this._cubeSize-y);Ws(t,P,R,3*y,2*y),c.setRenderTarget(t),c.render(h,Yr)}}function Zf(i){const e=[],t=[],n=[];let s=i;const r=i-Ri+1+el.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Ri?c=el[a-i+Ri-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),d=-l,h=1+l,f=[d,d,h,d,h,h,d,d,h,h,d,h],g=6,v=6,p=3,m=2,u=1,E=new Float32Array(p*v*g),b=new Float32Array(m*v*g),y=new Float32Array(u*v*g);for(let R=0;R<g;R++){const C=R%3*2/3-1,N=R>2?0:-1,S=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];E.set(S,p*v*R),b.set(f,m*v*R);const x=[R,R,R,R,R,R];y.set(x,u*v*R)}const P=new ln;P.setAttribute("position",new Wt(E,p)),P.setAttribute("uv",new Wt(b,m)),P.setAttribute("faceIndex",new Wt(y,u)),e.push(P),s>Ri&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function sl(i,e,t){const n=new ti(i,e,t);return n.texture.mapping=ur,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ws(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function jf(i,e,t){const n=new Float32Array($n),s=new B(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:$n,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:oo(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function rl(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:oo(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function al(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function oo(){return`

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
	`}function Jf(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===la||c===ca,d=c===Ni||c===Fi;if(l||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new il(i)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const g=o.image;return l&&g&&g.height>0||d&&g&&s(g)?(t===null&&(t=new il(i)),h=l?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Qf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ds("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ep(i,e,t,n){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);f.removeEventListener("dispose",a),delete s[f.id];const g=r.get(f);g&&(e.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const g in f)e.update(f[g],i.ARRAY_BUFFER)}function l(h){const f=[],g=h.index,v=h.attributes.position;let p=0;if(g!==null){const E=g.array;p=g.version;for(let b=0,y=E.length;b<y;b+=3){const P=E[b+0],R=E[b+1],C=E[b+2];f.push(P,R,R,C,C,P)}}else if(v!==void 0){const E=v.array;p=v.version;for(let b=0,y=E.length/3-1;b<y;b+=3){const P=b+0,R=b+1,C=b+2;f.push(P,R,R,C,C,P)}}else return;const m=new(kl(f)?Xl:Wl)(f,1);m.version=p;const u=r.get(h);u&&e.remove(u),r.set(h,m)}function d(h){const f=r.get(h);if(f){const g=h.index;g!==null&&f.version<g.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:d}}function tp(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,g){i.drawElements(n,g,r,f*a),t.update(g,n,1)}function l(f,g,v){v!==0&&(i.drawElementsInstanced(n,g,r,f*a,v),t.update(g,n,v))}function d(f,g,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,r,f,0,v);let m=0;for(let u=0;u<v;u++)m+=g[u];t.update(m,n,1)}function h(f,g,v,p){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)l(f[u]/a,g[u],p[u]);else{m.multiDrawElementsInstancedWEBGL(n,g,0,r,f,0,p,0,v);let u=0;for(let E=0;E<v;E++)u+=g[E]*p[E];t.update(u,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function np(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ip(i,e,t){const n=new WeakMap,s=new ht;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let x=function(){N.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var g=x;f!==void 0&&f.texture.dispose();const v=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;v===!0&&(y=1),p===!0&&(y=2),m===!0&&(y=3);let P=o.attributes.position.count*y,R=1;P>e.maxTextureSize&&(R=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const C=new Float32Array(P*R*4*h),N=new zl(C,P,R,h);N.type=rn,N.needsUpdate=!0;const S=y*4;for(let A=0;A<h;A++){const F=u[A],U=E[A],Y=b[A],V=P*R*4*A;for(let G=0;G<F.count;G++){const Z=G*S;v===!0&&(s.fromBufferAttribute(F,G),C[V+Z+0]=s.x,C[V+Z+1]=s.y,C[V+Z+2]=s.z,C[V+Z+3]=0),p===!0&&(s.fromBufferAttribute(U,G),C[V+Z+4]=s.x,C[V+Z+5]=s.y,C[V+Z+6]=s.z,C[V+Z+7]=0),m===!0&&(s.fromBufferAttribute(Y,G),C[V+Z+8]=s.x,C[V+Z+9]=s.y,C[V+Z+10]=s.z,C[V+Z+11]=Y.itemSize===4?s.w:1)}}f={count:h,texture:N,size:new He(P,R)},n.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let v=0;for(let m=0;m<l.length;m++)v+=l[m];const p=o.morphTargetsRelative?1:1-v;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function sp(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==l&&(e.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return h}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const sc=new vt,ol=new Ql(1,1),rc=new zl,ac=new wh,oc=new $l,ll=[],cl=[],hl=new Float32Array(16),ul=new Float32Array(9),dl=new Float32Array(4);function Vi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=ll[s];if(r===void 0&&(r=new Float32Array(s),ll[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function pt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function dr(i,e){let t=cl[e];t===void 0&&(t=new Int32Array(e),cl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function rp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ap(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2fv(this.addr,e),pt(t,e)}}function op(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;i.uniform3fv(this.addr,e),pt(t,e)}}function lp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4fv(this.addr,e),pt(t,e)}}function cp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;dl.set(n),i.uniformMatrix2fv(this.addr,!1,dl),pt(t,n)}}function hp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;ul.set(n),i.uniformMatrix3fv(this.addr,!1,ul),pt(t,n)}}function up(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;hl.set(n),i.uniformMatrix4fv(this.addr,!1,hl),pt(t,n)}}function dp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function fp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2iv(this.addr,e),pt(t,e)}}function pp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3iv(this.addr,e),pt(t,e)}}function mp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4iv(this.addr,e),pt(t,e)}}function gp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function _p(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;i.uniform2uiv(this.addr,e),pt(t,e)}}function vp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;i.uniform3uiv(this.addr,e),pt(t,e)}}function xp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;i.uniform4uiv(this.addr,e),pt(t,e)}}function Mp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ol.compareFunction=Bl,r=ol):r=sc,t.setTexture2D(e||r,s)}function Sp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ac,s)}function yp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||oc,s)}function Ep(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||rc,s)}function bp(i){switch(i){case 5126:return rp;case 35664:return ap;case 35665:return op;case 35666:return lp;case 35674:return cp;case 35675:return hp;case 35676:return up;case 5124:case 35670:return dp;case 35667:case 35671:return fp;case 35668:case 35672:return pp;case 35669:case 35673:return mp;case 5125:return gp;case 36294:return _p;case 36295:return vp;case 36296:return xp;case 35678:case 36198:case 36298:case 36306:case 35682:return Mp;case 35679:case 36299:case 36307:return Sp;case 35680:case 36300:case 36308:case 36293:return yp;case 36289:case 36303:case 36311:case 36292:return Ep}}function Tp(i,e){i.uniform1fv(this.addr,e)}function Ap(i,e){const t=Vi(e,this.size,2);i.uniform2fv(this.addr,t)}function wp(i,e){const t=Vi(e,this.size,3);i.uniform3fv(this.addr,t)}function Rp(i,e){const t=Vi(e,this.size,4);i.uniform4fv(this.addr,t)}function Cp(i,e){const t=Vi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Pp(i,e){const t=Vi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Lp(i,e){const t=Vi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Dp(i,e){i.uniform1iv(this.addr,e)}function Ip(i,e){i.uniform2iv(this.addr,e)}function Up(i,e){i.uniform3iv(this.addr,e)}function Np(i,e){i.uniform4iv(this.addr,e)}function Fp(i,e){i.uniform1uiv(this.addr,e)}function Op(i,e){i.uniform2uiv(this.addr,e)}function Bp(i,e){i.uniform3uiv(this.addr,e)}function kp(i,e){i.uniform4uiv(this.addr,e)}function zp(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||sc,r[a])}function Hp(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ac,r[a])}function Vp(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||oc,r[a])}function Gp(i,e,t){const n=this.cache,s=e.length,r=dr(t,s);ft(n,r)||(i.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||rc,r[a])}function Wp(i){switch(i){case 5126:return Tp;case 35664:return Ap;case 35665:return wp;case 35666:return Rp;case 35674:return Cp;case 35675:return Pp;case 35676:return Lp;case 5124:case 35670:return Dp;case 35667:case 35671:return Ip;case 35668:case 35672:return Up;case 35669:case 35673:return Np;case 5125:return Fp;case 36294:return Op;case 36295:return Bp;case 36296:return kp;case 35678:case 36198:case 36298:case 36306:case 35682:return zp;case 35679:case 36299:case 36307:return Hp;case 35680:case 36300:case 36308:case 36293:return Vp;case 36289:case 36303:case 36311:case 36292:return Gp}}class Xp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=bp(t.type)}}class qp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Wp(t.type)}}class Yp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Jr=/(\w+)(\])?(\[|\.)?/g;function fl(i,e){i.seq.push(e),i.map[e.id]=e}function $p(i,e,t){const n=i.name,s=n.length;for(Jr.lastIndex=0;;){const r=Jr.exec(n),a=Jr.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){fl(t,l===void 0?new Xp(o,i,e):new qp(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new Yp(o),fl(t,h)),t=h}}}class js{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);$p(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function pl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Kp=37297;let Zp=0;function jp(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ml=new Ne;function Jp(i){We._getMatrix(ml,We.workingColorSpace,i);const e=`mat3( ${ml.elements.map(t=>t.toFixed(4))} )`;switch(We.getTransfer(i)){case tr:return[e,"LinearTransferOETF"];case je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function gl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+jp(i.getShaderSource(e),o)}else return r}function Qp(i,e){const t=Jp(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function em(i,e){let t;switch(e){case eh:t="Linear";break;case th:t="Reinhard";break;case nh:t="Cineon";break;case ih:t="ACESFilmic";break;case rh:t="AgX";break;case ah:t="Neutral";break;case sh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xs=new B;function tm(){We.getLuminanceCoefficients(Xs);const i=Xs.x.toFixed(4),e=Xs.y.toFixed(4),t=Xs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function nm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(is).join(`
`)}function im(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function sm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function is(i){return i!==""}function _l(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const rm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ha(i){return i.replace(rm,om)}const am=new Map;function om(i,e){let t=Oe[e];if(t===void 0){const n=am.get(e);if(n!==void 0)t=Oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ha(t)}const lm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xl(i){return i.replace(lm,cm)}function cm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ml(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function hm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Rl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ic?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function um(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ni:case Fi:e="ENVMAP_TYPE_CUBE";break;case ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function dm(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Fi&&(e="ENVMAP_MODE_REFRACTION"),e}function fm(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Cl:e="ENVMAP_BLENDING_MULTIPLY";break;case Jc:e="ENVMAP_BLENDING_MIX";break;case Qc:e="ENVMAP_BLENDING_ADD";break}return e}function pm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function mm(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=hm(t),l=um(t),d=dm(t),h=fm(t),f=pm(t),g=nm(t),v=im(r),p=s.createProgram();let m,u,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(is).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(is).join(`
`),u.length>0&&(u+=`
`)):(m=[Ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(is).join(`
`),u=[Ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ln?"#define TONE_MAPPING":"",t.toneMapping!==Ln?Oe.tonemapping_pars_fragment:"",t.toneMapping!==Ln?em("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,Qp("linearToOutputTexel",t.outputColorSpace),tm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(is).join(`
`)),a=Ha(a),a=_l(a,t),a=vl(a,t),o=Ha(o),o=_l(o,t),o=vl(o,t),a=xl(a),o=xl(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",t.glslVersion===Ao?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ao?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const b=E+m+a,y=E+u+o,P=pl(s,s.VERTEX_SHADER,b),R=pl(s,s.FRAGMENT_SHADER,y);s.attachShader(p,P),s.attachShader(p,R),t.index0AttributeName!==void 0?s.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function C(A){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(p)||"",U=s.getShaderInfoLog(P)||"",Y=s.getShaderInfoLog(R)||"",V=F.trim(),G=U.trim(),Z=Y.trim();let H=!0,se=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,P,R);else{const ae=gl(s,P,"vertex"),le=gl(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+V+`
`+ae+`
`+le)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(G===""||Z==="")&&(se=!1);se&&(A.diagnostics={runnable:H,programLog:V,vertexShader:{log:G,prefix:m},fragmentShader:{log:Z,prefix:u}})}s.deleteShader(P),s.deleteShader(R),N=new js(s,p),S=sm(s,p)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(p,Kp)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zp++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=P,this.fragmentShader=R,this}let gm=0;class _m{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new vm(e),t.set(e,n)),n}}class vm{constructor(e){this.id=gm++,this.code=e,this.usedTimes=0}}function xm(i,e,t,n,s,r,a){const o=new Vl,c=new _m,l=new Set,d=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let g=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,x,A,F,U){const Y=F.fog,V=U.geometry,G=S.isMeshStandardMaterial?F.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||G),H=Z&&Z.mapping===ur?Z.image.height:null,se=v[S.type];S.precision!==null&&(g=s.getMaxPrecision(S.precision),g!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",g,"instead."));const ae=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,le=ae!==void 0?ae.length:0;let we=0;V.morphAttributes.position!==void 0&&(we=1),V.morphAttributes.normal!==void 0&&(we=2),V.morphAttributes.color!==void 0&&(we=3);let qe,Ke,Ye,$;if(se){const $e=tn[se];qe=$e.vertexShader,Ke=$e.fragmentShader}else qe=S.vertexShader,Ke=S.fragmentShader,c.update(S),Ye=c.getVertexShaderID(S),$=c.getFragmentShaderID(S);const J=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),Le=U.isInstancedMesh===!0,Ee=U.isBatchedMesh===!0,Ve=!!S.map,Mt=!!S.matcap,w=!!Z,nt=!!S.aoMap,Ie=!!S.lightMap,Ce=!!S.bumpMap,_e=!!S.normalMap,it=!!S.displacementMap,ve=!!S.emissiveMap,Fe=!!S.metalnessMap,mt=!!S.roughnessMap,lt=S.anisotropy>0,T=S.clearcoat>0,_=S.dispersion>0,O=S.iridescence>0,q=S.sheen>0,j=S.transmission>0,W=lt&&!!S.anisotropyMap,ye=T&&!!S.clearcoatMap,ie=T&&!!S.clearcoatNormalMap,xe=T&&!!S.clearcoatRoughnessMap,Me=O&&!!S.iridescenceMap,te=O&&!!S.iridescenceThicknessMap,ue=q&&!!S.sheenColorMap,Re=q&&!!S.sheenRoughnessMap,Se=!!S.specularMap,ce=!!S.specularColorMap,Ue=!!S.specularIntensityMap,L=j&&!!S.transmissionMap,ne=j&&!!S.thicknessMap,re=!!S.gradientMap,fe=!!S.alphaMap,Q=S.alphaTest>0,K=!!S.alphaHash,ge=!!S.extensions;let De=Ln;S.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(De=i.toneMapping);const et={shaderID:se,shaderType:S.type,shaderName:S.name,vertexShader:qe,fragmentShader:Ke,defines:S.defines,customVertexShaderID:Ye,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:g,batching:Ee,batchingColor:Ee&&U._colorsTexture!==null,instancing:Le,instancingColor:Le&&U.instanceColor!==null,instancingMorph:Le&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Oi,alphaToCoverage:!!S.alphaToCoverage,map:Ve,matcap:Mt,envMap:w,envMapMode:w&&Z.mapping,envMapCubeUVHeight:H,aoMap:nt,lightMap:Ie,bumpMap:Ce,normalMap:_e,displacementMap:f&&it,emissiveMap:ve,normalMapObjectSpace:_e&&S.normalMapType===uh,normalMapTangentSpace:_e&&S.normalMapType===hh,metalnessMap:Fe,roughnessMap:mt,anisotropy:lt,anisotropyMap:W,clearcoat:T,clearcoatMap:ye,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:_,iridescence:O,iridescenceMap:Me,iridescenceThicknessMap:te,sheen:q,sheenColorMap:ue,sheenRoughnessMap:Re,specularMap:Se,specularColorMap:ce,specularIntensityMap:Ue,transmission:j,transmissionMap:L,thicknessMap:ne,gradientMap:re,opaque:S.transparent===!1&&S.blending===Di&&S.alphaToCoverage===!1,alphaMap:fe,alphaTest:Q,alphaHash:K,combine:S.combine,mapUv:Ve&&p(S.map.channel),aoMapUv:nt&&p(S.aoMap.channel),lightMapUv:Ie&&p(S.lightMap.channel),bumpMapUv:Ce&&p(S.bumpMap.channel),normalMapUv:_e&&p(S.normalMap.channel),displacementMapUv:it&&p(S.displacementMap.channel),emissiveMapUv:ve&&p(S.emissiveMap.channel),metalnessMapUv:Fe&&p(S.metalnessMap.channel),roughnessMapUv:mt&&p(S.roughnessMap.channel),anisotropyMapUv:W&&p(S.anisotropyMap.channel),clearcoatMapUv:ye&&p(S.clearcoatMap.channel),clearcoatNormalMapUv:ie&&p(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&p(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&p(S.iridescenceMap.channel),iridescenceThicknessMapUv:te&&p(S.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&p(S.sheenColorMap.channel),sheenRoughnessMapUv:Re&&p(S.sheenRoughnessMap.channel),specularMapUv:Se&&p(S.specularMap.channel),specularColorMapUv:ce&&p(S.specularColorMap.channel),specularIntensityMapUv:Ue&&p(S.specularIntensityMap.channel),transmissionMapUv:L&&p(S.transmissionMap.channel),thicknessMapUv:ne&&p(S.thicknessMap.channel),alphaMapUv:fe&&p(S.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(_e||lt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!V.attributes.uv&&(Ve||fe),fog:!!Y,useFog:S.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:pe,skinning:U.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:we,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:Ve&&S.map.isVideoTexture===!0&&We.getTransfer(S.map.colorSpace)===je,decodeVideoTextureEmissive:ve&&S.emissiveMap.isVideoTexture===!0&&We.getTransfer(S.emissiveMap.colorSpace)===je,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===jt,flipSided:S.side===Dt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ge&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&S.extensions.multiDraw===!0||Ee)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return et.vertexUv1s=l.has(1),et.vertexUv2s=l.has(2),et.vertexUv3s=l.has(3),l.clear(),et}function u(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)x.push(A),x.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(E(x,S),b(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function E(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function b(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),S.push(o.mask)}function y(S){const x=v[S.type];let A;if(x){const F=tn[x];A=zh.clone(F.uniforms)}else A=S.uniforms;return A}function P(S,x){let A;for(let F=0,U=d.length;F<U;F++){const Y=d[F];if(Y.cacheKey===x){A=Y,++A.usedTimes;break}}return A===void 0&&(A=new mm(i,x,S,r),d.push(A)),A}function R(S){if(--S.usedTimes===0){const x=d.indexOf(S);d[x]=d[d.length-1],d.pop(),S.destroy()}}function C(S){c.remove(S)}function N(){c.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:y,acquireProgram:P,releaseProgram:R,releaseShaderCache:C,programs:d,dispose:N}}function Mm(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Sm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Sl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function yl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,f,g,v,p,m){let u=i[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:g,groupOrder:v,renderOrder:h.renderOrder,z:p,group:m},i[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=g,u.groupOrder=v,u.renderOrder=h.renderOrder,u.z=p,u.group=m),e++,u}function o(h,f,g,v,p,m){const u=a(h,f,g,v,p,m);g.transmission>0?n.push(u):g.transparent===!0?s.push(u):t.push(u)}function c(h,f,g,v,p,m){const u=a(h,f,g,v,p,m);g.transmission>0?n.unshift(u):g.transparent===!0?s.unshift(u):t.unshift(u)}function l(h,f){t.length>1&&t.sort(h||Sm),n.length>1&&n.sort(f||Sl),s.length>1&&s.sort(f||Sl)}function d(){for(let h=e,f=i.length;h<f;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function ym(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new yl,i.set(n,[a])):s>=r.length?(a=new yl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Em(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new Xe};break;case"SpotLight":t={position:new B,direction:new B,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new B,halfWidth:new B,halfHeight:new B};break}return i[e.id]=t,t}}}function bm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Tm=0;function Am(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function wm(i){const e=new Em,t=bm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new B);const s=new B,r=new st,a=new st;function o(l){let d=0,h=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let g=0,v=0,p=0,m=0,u=0,E=0,b=0,y=0,P=0,R=0,C=0;l.sort(Am);for(let S=0,x=l.length;S<x;S++){const A=l[S],F=A.color,U=A.intensity,Y=A.distance,V=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=F.r*U,h+=F.g*U,f+=F.b*U;else if(A.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(A.sh.coefficients[G],U);C++}else if(A.isDirectionalLight){const G=e.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const Z=A.shadow,H=t.get(A);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.directionalShadow[g]=H,n.directionalShadowMap[g]=V,n.directionalShadowMatrix[g]=A.shadow.matrix,E++}n.directional[g]=G,g++}else if(A.isSpotLight){const G=e.get(A);G.position.setFromMatrixPosition(A.matrixWorld),G.color.copy(F).multiplyScalar(U),G.distance=Y,G.coneCos=Math.cos(A.angle),G.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),G.decay=A.decay,n.spot[p]=G;const Z=A.shadow;if(A.map&&(n.spotLightMap[P]=A.map,P++,Z.updateMatrices(A),A.castShadow&&R++),n.spotLightMatrix[p]=Z.matrix,A.castShadow){const H=t.get(A);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.spotShadow[p]=H,n.spotShadowMap[p]=V,y++}p++}else if(A.isRectAreaLight){const G=e.get(A);G.color.copy(F).multiplyScalar(U),G.halfWidth.set(A.width*.5,0,0),G.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=G,m++}else if(A.isPointLight){const G=e.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),G.distance=A.distance,G.decay=A.decay,A.castShadow){const Z=A.shadow,H=t.get(A);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,n.pointShadow[v]=H,n.pointShadowMap[v]=V,n.pointShadowMatrix[v]=A.shadow.matrix,b++}n.point[v]=G,v++}else if(A.isHemisphereLight){const G=e.get(A);G.skyColor.copy(A.color).multiplyScalar(U),G.groundColor.copy(A.groundColor).multiplyScalar(U),n.hemi[u]=G,u++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=f;const N=n.hash;(N.directionalLength!==g||N.pointLength!==v||N.spotLength!==p||N.rectAreaLength!==m||N.hemiLength!==u||N.numDirectionalShadows!==E||N.numPointShadows!==b||N.numSpotShadows!==y||N.numSpotMaps!==P||N.numLightProbes!==C)&&(n.directional.length=g,n.spot.length=p,n.rectArea.length=m,n.point.length=v,n.hemi.length=u,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+P-R,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=C,N.directionalLength=g,N.pointLength=v,N.spotLength=p,N.rectAreaLength=m,N.hemiLength=u,N.numDirectionalShadows=E,N.numPointShadows=b,N.numSpotShadows=y,N.numSpotMaps=P,N.numLightProbes=C,n.version=Tm++)}function c(l,d){let h=0,f=0,g=0,v=0,p=0;const m=d.matrixWorldInverse;for(let u=0,E=l.length;u<E;u++){const b=l[u];if(b.isDirectionalLight){const y=n.directional[h];y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),h++}else if(b.isSpotLight){const y=n.spot[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),g++}else if(b.isRectAreaLight){const y=n.rectArea[v];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),v++}else if(b.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){const y=n.hemi[p];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),p++}}}return{setup:o,setupView:c,state:n}}function El(i){const e=new wm(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Rm(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new El(i),e.set(s,[o])):r>=a.length?(o=new El(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Cm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pm=`uniform sampler2D shadow_pass;
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
}`;function Lm(i,e,t){let n=new jl;const s=new He,r=new He,a=new ht,o=new eu({depthPacking:ch}),c=new tu,l={},d=t.maxTextureSize,h={[Nn]:Dt,[Dt]:Nn,[jt]:jt},f=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Cm,fragmentShader:Pm}),g=f.clone();g.defines.HORIZONTAL_PASS=1;const v=new ln;v.setAttribute("position",new Wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const p=new Ct(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rl;let u=this.type;this.render=function(R,C,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Pn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const U=u!==mn&&this.type===mn,Y=u===mn&&this.type!==mn;for(let V=0,G=R.length;V<G;V++){const Z=R[V],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const se=H.getFrameExtents();if(s.multiply(se),r.copy(H.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/se.x),s.x=r.x*se.x,H.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/se.y),s.y=r.y*se.y,H.mapSize.y=r.y)),H.map===null||U===!0||Y===!0){const le=this.type!==mn?{minFilter:xt,magFilter:xt}:{};H.map!==null&&H.map.dispose(),H.map=new ti(s.x,s.y,le),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ae=H.getViewportCount();for(let le=0;le<ae;le++){const we=H.getViewport(le);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),F.viewport(a),H.updateMatrices(Z,le),n=H.getFrustum(),y(C,N,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===mn&&E(H,N),H.needsUpdate=!1}u=this.type,m.needsUpdate=!1,i.setRenderTarget(S,x,A)};function E(R,C){const N=e.update(p);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,g.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ti(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,N,f,p,null),g.uniforms.shadow_pass.value=R.mapPass.texture,g.uniforms.resolution.value=R.mapSize,g.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,N,g,p,null)}function b(R,C,N,S){let x=null;const A=N.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(A!==void 0)x=A;else if(x=N.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=x.uuid,U=C.uuid;let Y=l[F];Y===void 0&&(Y={},l[F]=Y);let V=Y[U];V===void 0&&(V=x.clone(),Y[U]=V,C.addEventListener("dispose",P)),x=V}if(x.visible=C.visible,x.wireframe=C.wireframe,S===mn?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:h[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,N.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const F=i.properties.get(x);F.light=N}return x}function y(R,C,N,S,x){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&x===mn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,R.matrixWorld);const U=e.update(R),Y=R.material;if(Array.isArray(Y)){const V=U.groups;for(let G=0,Z=V.length;G<Z;G++){const H=V[G],se=Y[H.materialIndex];if(se&&se.visible){const ae=b(R,se,S,x);R.onBeforeShadow(i,R,C,N,U,ae,H),i.renderBufferDirect(N,null,U,ae,R,H),R.onAfterShadow(i,R,C,N,U,ae,H)}}}else if(Y.visible){const V=b(R,Y,S,x);R.onBeforeShadow(i,R,C,N,U,V,null),i.renderBufferDirect(N,null,U,V,R,null),R.onAfterShadow(i,R,C,N,U,V,null)}}const F=R.children;for(let U=0,Y=F.length;U<Y;U++)y(F[U],C,N,S,x)}function P(R){R.target.removeEventListener("dispose",P);for(const N in l){const S=l[N],x=R.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const Dm={[ta]:na,[ia]:aa,[sa]:oa,[Ui]:ra,[na]:ta,[aa]:ia,[oa]:sa,[ra]:Ui};function Im(i,e){function t(){let L=!1;const ne=new ht;let re=null;const fe=new ht(0,0,0,0);return{setMask:function(Q){re!==Q&&!L&&(i.colorMask(Q,Q,Q,Q),re=Q)},setLocked:function(Q){L=Q},setClear:function(Q,K,ge,De,et){et===!0&&(Q*=De,K*=De,ge*=De),ne.set(Q,K,ge,De),fe.equals(ne)===!1&&(i.clearColor(Q,K,ge,De),fe.copy(ne))},reset:function(){L=!1,re=null,fe.set(-1,0,0,0)}}}function n(){let L=!1,ne=!1,re=null,fe=null,Q=null;return{setReversed:function(K){if(ne!==K){const ge=e.get("EXT_clip_control");K?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),ne=K;const De=Q;Q=null,this.setClear(De)}},getReversed:function(){return ne},setTest:function(K){K?J(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(K){re!==K&&!L&&(i.depthMask(K),re=K)},setFunc:function(K){if(ne&&(K=Dm[K]),fe!==K){switch(K){case ta:i.depthFunc(i.NEVER);break;case na:i.depthFunc(i.ALWAYS);break;case ia:i.depthFunc(i.LESS);break;case Ui:i.depthFunc(i.LEQUAL);break;case sa:i.depthFunc(i.EQUAL);break;case ra:i.depthFunc(i.GEQUAL);break;case aa:i.depthFunc(i.GREATER);break;case oa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}fe=K}},setLocked:function(K){L=K},setClear:function(K){Q!==K&&(ne&&(K=1-K),i.clearDepth(K),Q=K)},reset:function(){L=!1,re=null,fe=null,Q=null,ne=!1}}}function s(){let L=!1,ne=null,re=null,fe=null,Q=null,K=null,ge=null,De=null,et=null;return{setTest:function($e){L||($e?J(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function($e){ne!==$e&&!L&&(i.stencilMask($e),ne=$e)},setFunc:function($e,cn,Qt){(re!==$e||fe!==cn||Q!==Qt)&&(i.stencilFunc($e,cn,Qt),re=$e,fe=cn,Q=Qt)},setOp:function($e,cn,Qt){(K!==$e||ge!==cn||De!==Qt)&&(i.stencilOp($e,cn,Qt),K=$e,ge=cn,De=Qt)},setLocked:function($e){L=$e},setClear:function($e){et!==$e&&(i.clearStencil($e),et=$e)},reset:function(){L=!1,ne=null,re=null,fe=null,Q=null,K=null,ge=null,De=null,et=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},h={},f=new WeakMap,g=[],v=null,p=!1,m=null,u=null,E=null,b=null,y=null,P=null,R=null,C=new Xe(0,0,0),N=0,S=!1,x=null,A=null,F=null,U=null,Y=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Z=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),G=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),G=Z>=2);let se=null,ae={};const le=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),qe=new ht().fromArray(le),Ke=new ht().fromArray(we);function Ye(L,ne,re,fe){const Q=new Uint8Array(4),K=i.createTexture();i.bindTexture(L,K),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ge=0;ge<re;ge++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ne,0,i.RGBA,1,1,fe,0,i.RGBA,i.UNSIGNED_BYTE,Q):i.texImage2D(ne+ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Q);return K}const $={};$[i.TEXTURE_2D]=Ye(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Ye(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Ye(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Ye(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(i.DEPTH_TEST),a.setFunc(Ui),Ce(!1),_e(Mo),J(i.CULL_FACE),nt(Pn);function J(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function pe(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function Le(L,ne){return h[L]!==ne?(i.bindFramebuffer(L,ne),h[L]=ne,L===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ne),L===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ne),!0):!1}function Ee(L,ne){let re=g,fe=!1;if(L){re=f.get(ne),re===void 0&&(re=[],f.set(ne,re));const Q=L.textures;if(re.length!==Q.length||re[0]!==i.COLOR_ATTACHMENT0){for(let K=0,ge=Q.length;K<ge;K++)re[K]=i.COLOR_ATTACHMENT0+K;re.length=Q.length,fe=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,fe=!0);fe&&i.drawBuffers(re)}function Ve(L){return v!==L?(i.useProgram(L),v=L,!0):!1}const Mt={[Yn]:i.FUNC_ADD,[Nc]:i.FUNC_SUBTRACT,[Fc]:i.FUNC_REVERSE_SUBTRACT};Mt[Oc]=i.MIN,Mt[Bc]=i.MAX;const w={[kc]:i.ZERO,[zc]:i.ONE,[Hc]:i.SRC_COLOR,[Qr]:i.SRC_ALPHA,[Yc]:i.SRC_ALPHA_SATURATE,[Xc]:i.DST_COLOR,[Gc]:i.DST_ALPHA,[Vc]:i.ONE_MINUS_SRC_COLOR,[ea]:i.ONE_MINUS_SRC_ALPHA,[qc]:i.ONE_MINUS_DST_COLOR,[Wc]:i.ONE_MINUS_DST_ALPHA,[$c]:i.CONSTANT_COLOR,[Kc]:i.ONE_MINUS_CONSTANT_COLOR,[Zc]:i.CONSTANT_ALPHA,[jc]:i.ONE_MINUS_CONSTANT_ALPHA};function nt(L,ne,re,fe,Q,K,ge,De,et,$e){if(L===Pn){p===!0&&(pe(i.BLEND),p=!1);return}if(p===!1&&(J(i.BLEND),p=!0),L!==Uc){if(L!==m||$e!==S){if((u!==Yn||y!==Yn)&&(i.blendEquation(i.FUNC_ADD),u=Yn,y=Yn),$e)switch(L){case Di:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case So:i.blendFunc(i.ONE,i.ONE);break;case yo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Eo:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Di:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case So:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case yo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Eo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,b=null,P=null,R=null,C.set(0,0,0),N=0,m=L,S=$e}return}Q=Q||ne,K=K||re,ge=ge||fe,(ne!==u||Q!==y)&&(i.blendEquationSeparate(Mt[ne],Mt[Q]),u=ne,y=Q),(re!==E||fe!==b||K!==P||ge!==R)&&(i.blendFuncSeparate(w[re],w[fe],w[K],w[ge]),E=re,b=fe,P=K,R=ge),(De.equals(C)===!1||et!==N)&&(i.blendColor(De.r,De.g,De.b,et),C.copy(De),N=et),m=L,S=!1}function Ie(L,ne){L.side===jt?pe(i.CULL_FACE):J(i.CULL_FACE);let re=L.side===Dt;ne&&(re=!re),Ce(re),L.blending===Di&&L.transparent===!1?nt(Pn):nt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const fe=L.stencilWrite;o.setTest(fe),fe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ve(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(L){x!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),x=L)}function _e(L){L!==Lc?(J(i.CULL_FACE),L!==A&&(L===Mo?i.cullFace(i.BACK):L===Dc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),A=L}function it(L){L!==F&&(G&&i.lineWidth(L),F=L)}function ve(L,ne,re){L?(J(i.POLYGON_OFFSET_FILL),(U!==ne||Y!==re)&&(i.polygonOffset(ne,re),U=ne,Y=re)):pe(i.POLYGON_OFFSET_FILL)}function Fe(L){L?J(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function mt(L){L===void 0&&(L=i.TEXTURE0+V-1),se!==L&&(i.activeTexture(L),se=L)}function lt(L,ne,re){re===void 0&&(se===null?re=i.TEXTURE0+V-1:re=se);let fe=ae[re];fe===void 0&&(fe={type:void 0,texture:void 0},ae[re]=fe),(fe.type!==L||fe.texture!==ne)&&(se!==re&&(i.activeTexture(re),se=re),i.bindTexture(L,ne||$[L]),fe.type=L,fe.texture=ne)}function T(){const L=ae[se];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{i.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{i.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{i.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xe(){try{i.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Me(){try{i.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function te(){try{i.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ue(L){qe.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),qe.copy(L))}function Re(L){Ke.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Ke.copy(L))}function Se(L,ne){let re=l.get(ne);re===void 0&&(re=new WeakMap,l.set(ne,re));let fe=re.get(L);fe===void 0&&(fe=i.getUniformBlockIndex(ne,L.name),re.set(L,fe))}function ce(L,ne){const fe=l.get(ne).get(L);c.get(ne)!==fe&&(i.uniformBlockBinding(ne,fe,L.__bindingPointIndex),c.set(ne,fe))}function Ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},se=null,ae={},h={},f=new WeakMap,g=[],v=null,p=!1,m=null,u=null,E=null,b=null,y=null,P=null,R=null,C=new Xe(0,0,0),N=0,S=!1,x=null,A=null,F=null,U=null,Y=null,qe.set(0,0,i.canvas.width,i.canvas.height),Ke.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:pe,bindFramebuffer:Le,drawBuffers:Ee,useProgram:Ve,setBlending:nt,setMaterial:Ie,setFlipSided:Ce,setCullFace:_e,setLineWidth:it,setPolygonOffset:ve,setScissorTest:Fe,activeTexture:mt,bindTexture:lt,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:Me,texImage3D:te,updateUBOMapping:Se,uniformBlockBinding:ce,texStorage2D:ie,texStorage3D:xe,texSubImage2D:q,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:ye,scissor:ue,viewport:Re,reset:Ue}}function Um(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new He,d=new WeakMap;let h;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(T,_){return g?new OffscreenCanvas(T,_):us("canvas")}function p(T,_,O){let q=1;const j=lt(T);if((j.width>O||j.height>O)&&(q=O/Math.max(j.width,j.height)),q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const W=Math.floor(q*j.width),ye=Math.floor(q*j.height);h===void 0&&(h=v(W,ye));const ie=_?v(W,ye):h;return ie.width=W,ie.height=ye,ie.getContext("2d").drawImage(T,0,0,W,ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+ye+")."),ie}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),T;return T}function m(T){return T.generateMipmaps}function u(T){i.generateMipmap(T)}function E(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(T,_,O,q,j=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let W=_;if(_===i.RED&&(O===i.FLOAT&&(W=i.R32F),O===i.HALF_FLOAT&&(W=i.R16F),O===i.UNSIGNED_BYTE&&(W=i.R8)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.R8UI),O===i.UNSIGNED_SHORT&&(W=i.R16UI),O===i.UNSIGNED_INT&&(W=i.R32UI),O===i.BYTE&&(W=i.R8I),O===i.SHORT&&(W=i.R16I),O===i.INT&&(W=i.R32I)),_===i.RG&&(O===i.FLOAT&&(W=i.RG32F),O===i.HALF_FLOAT&&(W=i.RG16F),O===i.UNSIGNED_BYTE&&(W=i.RG8)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RG8UI),O===i.UNSIGNED_SHORT&&(W=i.RG16UI),O===i.UNSIGNED_INT&&(W=i.RG32UI),O===i.BYTE&&(W=i.RG8I),O===i.SHORT&&(W=i.RG16I),O===i.INT&&(W=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGB8UI),O===i.UNSIGNED_SHORT&&(W=i.RGB16UI),O===i.UNSIGNED_INT&&(W=i.RGB32UI),O===i.BYTE&&(W=i.RGB8I),O===i.SHORT&&(W=i.RGB16I),O===i.INT&&(W=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),O===i.UNSIGNED_INT&&(W=i.RGBA32UI),O===i.BYTE&&(W=i.RGBA8I),O===i.SHORT&&(W=i.RGBA16I),O===i.INT&&(W=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),_===i.RGBA){const ye=j?tr:We.getTransfer(q);O===i.FLOAT&&(W=i.RGBA32F),O===i.HALF_FLOAT&&(W=i.RGBA16F),O===i.UNSIGNED_BYTE&&(W=ye===je?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function y(T,_){let O;return T?_===null||_===ei||_===ls?O=i.DEPTH24_STENCIL8:_===rn?O=i.DEPTH32F_STENCIL8:_===os&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ei||_===ls?O=i.DEPTH_COMPONENT24:_===rn?O=i.DEPTH_COMPONENT32F:_===os&&(O=i.DEPTH_COMPONENT16),O}function P(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==xt&&T.minFilter!==sn?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function R(T){const _=T.target;_.removeEventListener("dispose",R),N(_),_.isVideoTexture&&d.delete(_)}function C(T){const _=T.target;_.removeEventListener("dispose",C),x(_)}function N(T){const _=n.get(T);if(_.__webglInit===void 0)return;const O=T.source,q=f.get(O);if(q){const j=q[_.__cacheKey];j.usedTimes--,j.usedTimes===0&&S(T),Object.keys(q).length===0&&f.delete(O)}n.remove(T)}function S(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const O=T.source,q=f.get(O);delete q[_.__cacheKey],a.memory.textures--}function x(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let j=0;j<_.__webglFramebuffer[q].length;j++)i.deleteFramebuffer(_.__webglFramebuffer[q][j]);else i.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)i.deleteFramebuffer(_.__webglFramebuffer[q]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=T.textures;for(let q=0,j=O.length;q<j;q++){const W=n.get(O[q]);W.__webglTexture&&(i.deleteTexture(W.__webglTexture),a.memory.textures--),n.remove(O[q])}n.remove(T)}let A=0;function F(){A=0}function U(){const T=A;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),A+=1,T}function Y(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function V(T,_){const O=n.get(T);if(T.isVideoTexture&&Fe(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const q=T.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(O,T,_);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function G(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){$(O,T,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function Z(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){$(O,T,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function H(T,_){const O=n.get(T);if(T.version>0&&O.__version!==T.version){J(O,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const se={[er]:i.REPEAT,[Zn]:i.CLAMP_TO_EDGE,[ha]:i.MIRRORED_REPEAT},ae={[xt]:i.NEAREST,[oh]:i.NEAREST_MIPMAP_NEAREST,[vs]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[xr]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},le={[dh]:i.NEVER,[vh]:i.ALWAYS,[fh]:i.LESS,[Bl]:i.LEQUAL,[ph]:i.EQUAL,[_h]:i.GEQUAL,[mh]:i.GREATER,[gh]:i.NOTEQUAL};function we(T,_){if(_.type===rn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===sn||_.magFilter===xr||_.magFilter===vs||_.magFilter===jn||_.minFilter===sn||_.minFilter===xr||_.minFilter===vs||_.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,se[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,se[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,se[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ae[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ae[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,le[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===xt||_.minFilter!==vs&&_.minFilter!==jn||_.type===rn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function qe(T,_){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",R));const q=_.source;let j=f.get(q);j===void 0&&(j={},f.set(q,j));const W=Y(_);if(W!==T.__cacheKey){j[W]===void 0&&(j[W]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),j[W].usedTimes++;const ye=j[T.__cacheKey];ye!==void 0&&(j[T.__cacheKey].usedTimes--,ye.usedTimes===0&&S(_)),T.__cacheKey=W,T.__webglTexture=j[W].texture}return O}function Ke(T,_,O){return Math.floor(Math.floor(T/O)/_)}function Ye(T,_,O,q){const W=T.updateRanges;if(W.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,q,_.data);else{W.sort((te,ue)=>te.start-ue.start);let ye=0;for(let te=1;te<W.length;te++){const ue=W[ye],Re=W[te],Se=ue.start+ue.count,ce=Ke(Re.start,_.width,4),Ue=Ke(ue.start,_.width,4);Re.start<=Se+1&&ce===Ue&&Ke(Re.start+Re.count-1,_.width,4)===ce?ue.count=Math.max(ue.count,Re.start+Re.count-ue.start):(++ye,W[ye]=Re)}W.length=ye+1;const ie=i.getParameter(i.UNPACK_ROW_LENGTH),xe=i.getParameter(i.UNPACK_SKIP_PIXELS),Me=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let te=0,ue=W.length;te<ue;te++){const Re=W[te],Se=Math.floor(Re.start/4),ce=Math.ceil(Re.count/4),Ue=Se%_.width,L=Math.floor(Se/_.width),ne=ce,re=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ue),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Ue,L,ne,re,O,q,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ie),i.pixelStorei(i.UNPACK_SKIP_PIXELS,xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Me)}}function $(T,_,O){let q=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=i.TEXTURE_3D);const j=qe(T,_),W=_.source;t.bindTexture(q,T.__webglTexture,i.TEXTURE0+O);const ye=n.get(W);if(W.version!==ye.__version||j===!0){t.activeTexture(i.TEXTURE0+O);const ie=We.getPrimaries(We.workingColorSpace),xe=_.colorSpace===Cn?null:We.getPrimaries(_.colorSpace),Me=_.colorSpace===Cn||ie===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);let te=p(_.image,!1,s.maxTextureSize);te=mt(_,te);const ue=r.convert(_.format,_.colorSpace),Re=r.convert(_.type);let Se=b(_.internalFormat,ue,Re,_.colorSpace,_.isVideoTexture);we(q,_);let ce;const Ue=_.mipmaps,L=_.isVideoTexture!==!0,ne=ye.__version===void 0||j===!0,re=W.dataReady,fe=P(_,te);if(_.isDepthTexture)Se=y(_.format===hs,_.type),ne&&(L?t.texStorage2D(i.TEXTURE_2D,1,Se,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ue,Re,null));else if(_.isDataTexture)if(Ue.length>0){L&&ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,Ue[0].width,Ue[0].height);for(let Q=0,K=Ue.length;Q<K;Q++)ce=Ue[Q],L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ue,Re,ce.data);_.generateMipmaps=!1}else L?(ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,te.width,te.height),re&&Ye(_,te,ue,Re)):t.texImage2D(i.TEXTURE_2D,0,Se,te.width,te.height,0,ue,Re,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){L&&ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Se,Ue[0].width,Ue[0].height,te.depth);for(let Q=0,K=Ue.length;Q<K;Q++)if(ce=Ue[Q],_.format!==Jt)if(ue!==null)if(L){if(re)if(_.layerUpdates.size>0){const ge=Qo(ce.width,ce.height,_.format,_.type);for(const De of _.layerUpdates){const et=ce.data.subarray(De*ge/ce.data.BYTES_PER_ELEMENT,(De+1)*ge/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,De,ce.width,ce.height,1,ue,et)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ce.width,ce.height,te.depth,ue,ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,Se,ce.width,ce.height,te.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?re&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,ce.width,ce.height,te.depth,ue,Re,ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,Se,ce.width,ce.height,te.depth,0,ue,Re,ce.data)}else{L&&ne&&t.texStorage2D(i.TEXTURE_2D,fe,Se,Ue[0].width,Ue[0].height);for(let Q=0,K=Ue.length;Q<K;Q++)ce=Ue[Q],_.format!==Jt?ue!==null?L?re&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,ce.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ce.width,ce.height,ue,Re,ce.data):t.texImage2D(i.TEXTURE_2D,Q,Se,ce.width,ce.height,0,ue,Re,ce.data)}else if(_.isDataArrayTexture)if(L){if(ne&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Se,te.width,te.height,te.depth),re)if(_.layerUpdates.size>0){const Q=Qo(te.width,te.height,_.format,_.type);for(const K of _.layerUpdates){const ge=te.data.subarray(K*Q/te.data.BYTES_PER_ELEMENT,(K+1)*Q/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,K,te.width,te.height,1,ue,Re,ge)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ue,Re,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,te.width,te.height,te.depth,0,ue,Re,te.data);else if(_.isData3DTexture)L?(ne&&t.texStorage3D(i.TEXTURE_3D,fe,Se,te.width,te.height,te.depth),re&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ue,Re,te.data)):t.texImage3D(i.TEXTURE_3D,0,Se,te.width,te.height,te.depth,0,ue,Re,te.data);else if(_.isFramebufferTexture){if(ne)if(L)t.texStorage2D(i.TEXTURE_2D,fe,Se,te.width,te.height);else{let Q=te.width,K=te.height;for(let ge=0;ge<fe;ge++)t.texImage2D(i.TEXTURE_2D,ge,Se,Q,K,0,ue,Re,null),Q>>=1,K>>=1}}else if(Ue.length>0){if(L&&ne){const Q=lt(Ue[0]);t.texStorage2D(i.TEXTURE_2D,fe,Se,Q.width,Q.height)}for(let Q=0,K=Ue.length;Q<K;Q++)ce=Ue[Q],L?re&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ue,Re,ce):t.texImage2D(i.TEXTURE_2D,Q,Se,ue,Re,ce);_.generateMipmaps=!1}else if(L){if(ne){const Q=lt(te);t.texStorage2D(i.TEXTURE_2D,fe,Se,Q.width,Q.height)}re&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue,Re,te)}else t.texImage2D(i.TEXTURE_2D,0,Se,ue,Re,te);m(_)&&u(q),ye.__version=W.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function J(T,_,O){if(_.image.length!==6)return;const q=qe(T,_),j=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const W=n.get(j);if(j.version!==W.__version||q===!0){t.activeTexture(i.TEXTURE0+O);const ye=We.getPrimaries(We.workingColorSpace),ie=_.colorSpace===Cn?null:We.getPrimaries(_.colorSpace),xe=_.colorSpace===Cn||ye===ie?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Me=_.isCompressedTexture||_.image[0].isCompressedTexture,te=_.image[0]&&_.image[0].isDataTexture,ue=[];for(let K=0;K<6;K++)!Me&&!te?ue[K]=p(_.image[K],!0,s.maxCubemapSize):ue[K]=te?_.image[K].image:_.image[K],ue[K]=mt(_,ue[K]);const Re=ue[0],Se=r.convert(_.format,_.colorSpace),ce=r.convert(_.type),Ue=b(_.internalFormat,Se,ce,_.colorSpace),L=_.isVideoTexture!==!0,ne=W.__version===void 0||q===!0,re=j.dataReady;let fe=P(_,Re);we(i.TEXTURE_CUBE_MAP,_);let Q;if(Me){L&&ne&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ue,Re.width,Re.height);for(let K=0;K<6;K++){Q=ue[K].mipmaps;for(let ge=0;ge<Q.length;ge++){const De=Q[ge];_.format!==Jt?Se!==null?L?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,0,0,De.width,De.height,Se,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,Ue,De.width,De.height,0,De.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,0,0,De.width,De.height,Se,ce,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge,Ue,De.width,De.height,0,Se,ce,De.data)}}}else{if(Q=_.mipmaps,L&&ne){Q.length>0&&fe++;const K=lt(ue[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,Ue,K.width,K.height)}for(let K=0;K<6;K++)if(te){L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ue[K].width,ue[K].height,Se,ce,ue[K].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ue,ue[K].width,ue[K].height,0,Se,ce,ue[K].data);for(let ge=0;ge<Q.length;ge++){const et=Q[ge].image[K].image;L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,0,0,et.width,et.height,Se,ce,et.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,Ue,et.width,et.height,0,Se,ce,et.data)}}else{L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Se,ce,ue[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ue,Se,ce,ue[K]);for(let ge=0;ge<Q.length;ge++){const De=Q[ge];L?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,0,0,Se,ce,De.image[K]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,ge+1,Ue,Se,ce,De.image[K])}}}m(_)&&u(i.TEXTURE_CUBE_MAP),W.__version=j.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function pe(T,_,O,q,j,W){const ye=r.convert(O.format,O.colorSpace),ie=r.convert(O.type),xe=b(O.internalFormat,ye,ie,O.colorSpace),Me=n.get(_),te=n.get(O);if(te.__renderTarget=_,!Me.__hasExternalTextures){const ue=Math.max(1,_.width>>W),Re=Math.max(1,_.height>>W);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,W,xe,ue,Re,_.depth,0,ye,ie,null):t.texImage2D(j,W,xe,ue,Re,0,ye,ie,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,j,te.__webglTexture,0,it(_)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,j,te.__webglTexture,W),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(T,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const q=_.depthTexture,j=q&&q.isDepthTexture?q.type:null,W=y(_.stencilBuffer,j),ye=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=it(_);ve(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie,W,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,W,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,W,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ye,i.RENDERBUFFER,T)}else{const q=_.textures;for(let j=0;j<q.length;j++){const W=q[j],ye=r.convert(W.format,W.colorSpace),ie=r.convert(W.type),xe=b(W.internalFormat,ye,ie,W.colorSpace),Me=it(_);O&&ve(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,xe,_.width,_.height):ve(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me,xe,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,xe,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ee(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),V(_.depthTexture,0);const j=q.__webglTexture,W=it(_);if(_.depthTexture.format===cs)ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(_.depthTexture.format===hs)ve(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ve(T){const _=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const q=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){const j=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",j)};q.addEventListener("dispose",j),_.__depthDisposeCallback=j}_.__boundDepthTexture=q}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const q=T.texture.mipmaps;q&&q.length>0?Ee(_.__webglFramebuffer[0],T):Ee(_.__webglFramebuffer,T)}else if(O){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=i.createRenderbuffer(),Le(_.__webglDepthbuffer[q],T,!1);else{const j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,W)}}else{const q=T.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Le(_.__webglDepthbuffer,T,!1);else{const j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,W)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(T,_,O){const q=n.get(T);_!==void 0&&pe(q.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&Ve(T)}function w(T){const _=T.texture,O=n.get(T),q=n.get(_);T.addEventListener("dispose",C);const j=T.textures,W=T.isWebGLCubeRenderTarget===!0,ye=j.length>1;if(ye||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=_.version,a.memory.textures++),W){O.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[ie]=[];for(let xe=0;xe<_.mipmaps.length;xe++)O.__webglFramebuffer[ie][xe]=i.createFramebuffer()}else O.__webglFramebuffer[ie]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let ie=0;ie<_.mipmaps.length;ie++)O.__webglFramebuffer[ie]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(ye)for(let ie=0,xe=j.length;ie<xe;ie++){const Me=n.get(j[ie]);Me.__webglTexture===void 0&&(Me.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&ve(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const xe=j[ie];O.__webglColorRenderbuffer[ie]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[ie]);const Me=r.convert(xe.format,xe.colorSpace),te=r.convert(xe.type),ue=b(xe.internalFormat,Me,te,xe.colorSpace,T.isXRRenderTarget===!0),Re=it(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ue,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,O.__webglColorRenderbuffer[ie])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Le(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(W){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),we(i.TEXTURE_CUBE_MAP,_);for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)pe(O.__webglFramebuffer[ie][xe],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else pe(O.__webglFramebuffer[ie],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(_)&&u(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let ie=0,xe=j.length;ie<xe;ie++){const Me=j[ie],te=n.get(Me);let ue=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ue=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,te.__webglTexture),we(ue,Me),pe(O.__webglFramebuffer,T,Me,i.COLOR_ATTACHMENT0+ie,ue,0),m(Me)&&u(ue)}t.unbindTexture()}else{let ie=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ie=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,q.__webglTexture),we(ie,_),_.mipmaps&&_.mipmaps.length>0)for(let xe=0;xe<_.mipmaps.length;xe++)pe(O.__webglFramebuffer[xe],T,_,i.COLOR_ATTACHMENT0,ie,xe);else pe(O.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,ie,0);m(_)&&u(ie),t.unbindTexture()}T.depthBuffer&&Ve(T)}function nt(T){const _=T.textures;for(let O=0,q=_.length;O<q;O++){const j=_[O];if(m(j)){const W=E(T),ye=n.get(j).__webglTexture;t.bindTexture(W,ye),u(W),t.unbindTexture()}}}const Ie=[],Ce=[];function _e(T){if(T.samples>0){if(ve(T)===!1){const _=T.textures,O=T.width,q=T.height;let j=i.COLOR_BUFFER_BIT;const W=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ye=n.get(T),ie=_.length>1;if(ie)for(let Me=0;Me<_.length;Me++)t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const xe=T.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let Me=0;Me<_.length;Me++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ie){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ye.__webglColorRenderbuffer[Me]);const te=n.get(_[Me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,O,q,0,0,O,q,j,i.NEAREST),c===!0&&(Ie.length=0,Ce.length=0,Ie.push(i.COLOR_ATTACHMENT0+Me),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Ie.push(W),Ce.push(W),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ce)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ie))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ie)for(let Me=0;Me<_.length;Me++){t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,ye.__webglColorRenderbuffer[Me]);const te=n.get(_[Me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(T){return Math.min(s.maxSamples,T.samples)}function ve(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Fe(T){const _=a.render.frame;d.get(T)!==_&&(d.set(T,_),T.update())}function mt(T,_){const O=T.colorSpace,q=T.format,j=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==Oi&&O!==Cn&&(We.getTransfer(O)===je?(q!==Jt||j!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function lt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=V,this.setTexture2DArray=G,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=Mt,this.setupRenderTarget=w,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ve}function Nm(i,e){function t(n,s=Cn){let r;const a=We.getTransfer(s);if(n===Sn)return i.UNSIGNED_BYTE;if(n===Qa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===eo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Il)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ul)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ll)return i.BYTE;if(n===Dl)return i.SHORT;if(n===os)return i.UNSIGNED_SHORT;if(n===Ja)return i.INT;if(n===ei)return i.UNSIGNED_INT;if(n===rn)return i.FLOAT;if(n===fs)return i.HALF_FLOAT;if(n===Nl)return i.ALPHA;if(n===Fl)return i.RGB;if(n===Jt)return i.RGBA;if(n===cs)return i.DEPTH_COMPONENT;if(n===hs)return i.DEPTH_STENCIL;if(n===to)return i.RED;if(n===no)return i.RED_INTEGER;if(n===Ol)return i.RG;if(n===io)return i.RG_INTEGER;if(n===so)return i.RGBA_INTEGER;if(n===qs||n===Ys||n===$s||n===Ks)if(a===je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ys)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$s)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ks)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ua||n===da||n===fa||n===pa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ua)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===pa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ma||n===ga||n===_a)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ma||n===ga)return a===je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===_a)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===va||n===xa||n===Ma||n===Sa||n===ya||n===Ea||n===ba||n===Ta||n===Aa||n===wa||n===Ra||n===Ca||n===Pa||n===La)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===va)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ma)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ya)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ea)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ba)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ta)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Aa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ra)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ca)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Pa)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===La)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Da||n===Ia||n===Ua)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Da)return a===je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ia)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ua)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Na||n===Fa||n===Oa||n===Ba)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Na)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Fa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ba)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ls?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Fm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Om=`
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

}`;class Bm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new ec(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Fn({vertexShader:Fm,fragmentShader:Om,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ct(new $t(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class km extends ki{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,h=null,f=null,g=null,v=null;const p=typeof XRWebGLBinding<"u",m=new Bm,u={},E=t.getContextAttributes();let b=null,y=null;const P=[],R=[],C=new He;let N=null;const S=new Zt;S.viewport=new ht;const x=new Zt;x.viewport=new ht;const A=[S,x],F=new ru;let U=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let J=P[$];return J===void 0&&(J=new Vr,P[$]=J),J.getTargetRaySpace()},this.getControllerGrip=function($){let J=P[$];return J===void 0&&(J=new Vr,P[$]=J),J.getGripSpace()},this.getHand=function($){let J=P[$];return J===void 0&&(J=new Vr,P[$]=J),J.getHandSpace()};function V($){const J=R.indexOf($.inputSource);if(J===-1)return;const pe=P[J];pe!==void 0&&(pe.update($.inputSource,$.frame,l||a),pe.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<P.length;$++){const J=R[$];J!==null&&(R[$]=null,P[$].disconnect(J))}U=null,Y=null,m.reset();for(const $ in u)delete u[$];e.setRenderTarget(b),g=null,f=null,h=null,s=null,y=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(N),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return h===null&&p&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",G),s.addEventListener("inputsourceschange",Z),E.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(C),p&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Le=null,Ee=null;E.depth&&(Ee=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=E.stencil?hs:cs,Le=E.stencil?ls:ei);const Ve={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};h=this.getBinding(),f=h.createProjectionLayer(Ve),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new ti(f.textureWidth,f.textureHeight,{format:Jt,type:Sn,depthTexture:new Ql(f.textureWidth,f.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),y=new ti(g.framebufferWidth,g.framebufferHeight,{format:Jt,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z($){for(let J=0;J<$.removed.length;J++){const pe=$.removed[J],Le=R.indexOf(pe);Le>=0&&(R[Le]=null,P[Le].disconnect(pe))}for(let J=0;J<$.added.length;J++){const pe=$.added[J];let Le=R.indexOf(pe);if(Le===-1){for(let Ve=0;Ve<P.length;Ve++)if(Ve>=R.length){R.push(pe),Le=Ve;break}else if(R[Ve]===null){R[Ve]=pe,Le=Ve;break}if(Le===-1)break}const Ee=P[Le];Ee&&Ee.connect(pe)}}const H=new B,se=new B;function ae($,J,pe){H.setFromMatrixPosition(J.matrixWorld),se.setFromMatrixPosition(pe.matrixWorld);const Le=H.distanceTo(se),Ee=J.projectionMatrix.elements,Ve=pe.projectionMatrix.elements,Mt=Ee[14]/(Ee[10]-1),w=Ee[14]/(Ee[10]+1),nt=(Ee[9]+1)/Ee[5],Ie=(Ee[9]-1)/Ee[5],Ce=(Ee[8]-1)/Ee[0],_e=(Ve[8]+1)/Ve[0],it=Mt*Ce,ve=Mt*_e,Fe=Le/(-Ce+_e),mt=Fe*-Ce;if(J.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(mt),$.translateZ(Fe),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ee[10]===-1)$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const lt=Mt+Fe,T=w+Fe,_=it-mt,O=ve+(Le-mt),q=nt*w/T*lt,j=Ie*w/T*lt;$.projectionMatrix.makePerspective(_,O,q,j,lt,T),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function le($,J){J===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(J.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let J=$.near,pe=$.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),F.near=x.near=S.near=J,F.far=x.far=S.far=pe,(U!==F.near||Y!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),U=F.near,Y=F.far),F.layers.mask=$.layers.mask|6,S.layers.mask=F.layers.mask&3,x.layers.mask=F.layers.mask&5;const Le=$.parent,Ee=F.cameras;le(F,Le);for(let Ve=0;Ve<Ee.length;Ve++)le(Ee[Ve],Le);Ee.length===2?ae(F,S,x):F.projectionMatrix.copy(S.projectionMatrix),we($,F,Le)};function we($,J,pe){pe===null?$.matrix.copy(J.matrixWorld):($.matrix.copy(pe.matrixWorld),$.matrix.invert(),$.matrix.multiply(J.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(J.projectionMatrix),$.projectionMatrixInverse.copy(J.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=za*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&g===null))return c},this.setFoveation=function($){c=$,f!==null&&(f.fixedFoveation=$),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function($){return u[$]};let qe=null;function Ke($,J){if(d=J.getViewerPose(l||a),v=J,d!==null){const pe=d.views;g!==null&&(e.setRenderTargetFramebuffer(y,g.framebuffer),e.setRenderTarget(y));let Le=!1;pe.length!==F.cameras.length&&(F.cameras.length=0,Le=!0);for(let w=0;w<pe.length;w++){const nt=pe[w];let Ie=null;if(g!==null)Ie=g.getViewport(nt);else{const _e=h.getViewSubImage(f,nt);Ie=_e.viewport,w===0&&(e.setRenderTargetTextures(y,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(y))}let Ce=A[w];Ce===void 0&&(Ce=new Zt,Ce.layers.enable(w),Ce.viewport=new ht,A[w]=Ce),Ce.matrix.fromArray(nt.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(nt.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),w===0&&(F.matrix.copy(Ce.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Le===!0&&F.cameras.push(Ce)}const Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&p){h=n.getBinding();const w=h.getDepthInformation(pe[0]);w&&w.isValid&&w.texture&&m.init(w,s.renderState)}if(Ee&&Ee.includes("camera-access")&&p){e.state.unbindTexture(),h=n.getBinding();for(let w=0;w<pe.length;w++){const nt=pe[w].camera;if(nt){let Ie=u[nt];Ie||(Ie=new ec,u[nt]=Ie);const Ce=h.getCameraImage(nt);Ie.sourceTexture=Ce}}}}for(let pe=0;pe<P.length;pe++){const Le=R[pe],Ee=P[pe];Le!==null&&Ee!==void 0&&Ee.update(Le,J,l||a)}qe&&qe($,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),v=null}const Ye=new ic;Ye.setAnimationLoop(Ke),this.setAnimationLoop=function($){qe=$},this.dispose=function(){}}}const Wn=new yn,zm=new st;function Hm(i,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function n(m,u){u.color.getRGB(m.fogColor.value,ql(i)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function s(m,u,E,b,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(m,u):u.isMeshToonMaterial?(r(m,u),h(m,u)):u.isMeshPhongMaterial?(r(m,u),d(m,u)):u.isMeshStandardMaterial?(r(m,u),f(m,u),u.isMeshPhysicalMaterial&&g(m,u,y)):u.isMeshMatcapMaterial?(r(m,u),v(m,u)):u.isMeshDepthMaterial?r(m,u):u.isMeshDistanceMaterial?(r(m,u),p(m,u)):u.isMeshNormalMaterial?r(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?c(m,u,E,b):u.isSpriteMaterial?l(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===Dt&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===Dt&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const E=e.get(u),b=E.envMap,y=E.envMapRotation;b&&(m.envMap.value=b,Wn.copy(y),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),m.envMapRotation.value.setFromMatrix4(zm.makeRotationFromEuler(Wn)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function c(m,u,E,b){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*E,m.scale.value=b*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function l(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function h(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function g(m,u,E){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Dt&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,u){u.matcap&&(m.matcap.value=u.matcap)}function p(m,u){const E=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Vm(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,b){const y=b.program;n.uniformBlockBinding(E,y)}function l(E,b){let y=s[E.id];y===void 0&&(v(E),y=d(E),s[E.id]=y,E.addEventListener("dispose",m));const P=b.program;n.updateUBOMapping(E,P);const R=e.render.frame;r[E.id]!==R&&(f(E),r[E.id]=R)}function d(E){const b=h();E.__bindingPointIndex=b;const y=i.createBuffer(),P=E.__size,R=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,P,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,y),y}function h(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){const b=s[E.id],y=E.uniforms,P=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let R=0,C=y.length;R<C;R++){const N=Array.isArray(y[R])?y[R]:[y[R]];for(let S=0,x=N.length;S<x;S++){const A=N[S];if(g(A,R,S,P)===!0){const F=A.__offset,U=Array.isArray(A.value)?A.value:[A.value];let Y=0;for(let V=0;V<U.length;V++){const G=U[V],Z=p(G);typeof G=="number"||typeof G=="boolean"?(A.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,F+Y,A.__data)):G.isMatrix3?(A.__data[0]=G.elements[0],A.__data[1]=G.elements[1],A.__data[2]=G.elements[2],A.__data[3]=0,A.__data[4]=G.elements[3],A.__data[5]=G.elements[4],A.__data[6]=G.elements[5],A.__data[7]=0,A.__data[8]=G.elements[6],A.__data[9]=G.elements[7],A.__data[10]=G.elements[8],A.__data[11]=0):(G.toArray(A.__data,Y),Y+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(E,b,y,P){const R=E.value,C=b+"_"+y;if(P[C]===void 0)return typeof R=="number"||typeof R=="boolean"?P[C]=R:P[C]=R.clone(),!0;{const N=P[C];if(typeof R=="number"||typeof R=="boolean"){if(N!==R)return P[C]=R,!0}else if(N.equals(R)===!1)return N.copy(R),!0}return!1}function v(E){const b=E.uniforms;let y=0;const P=16;for(let C=0,N=b.length;C<N;C++){const S=Array.isArray(b[C])?b[C]:[b[C]];for(let x=0,A=S.length;x<A;x++){const F=S[x],U=Array.isArray(F.value)?F.value:[F.value];for(let Y=0,V=U.length;Y<V;Y++){const G=U[Y],Z=p(G),H=y%P,se=H%Z.boundary,ae=H+se;y+=se,ae!==0&&P-ae<Z.storage&&(y+=P-ae),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Z.storage}}}const R=y%P;return R>0&&(y+=P-R),E.__size=y,E.__cache={},this}function p(E){const b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),b}function m(E){const b=E.target;b.removeEventListener("dispose",m);const y=a.indexOf(b.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function u(){for(const E in s)i.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:c,update:l,dispose:u}}class Gm{constructor(e={}){const{canvas:t=Mh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=new Uint32Array(4),p=new Int32Array(4);let m=null,u=null;const E=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ln,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let P=!1;this._outputColorSpace=dt;let R=0,C=0,N=null,S=-1,x=null;const A=new ht,F=new ht;let U=null;const Y=new Xe(0);let V=0,G=t.width,Z=t.height,H=1,se=null,ae=null;const le=new ht(0,0,G,Z),we=new ht(0,0,G,Z);let qe=!1;const Ke=new jl;let Ye=!1,$=!1;const J=new st,pe=new B,Le=new ht,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ve=!1;function Mt(){return N===null?H:1}let w=n;function nt(M,D){return t.getContext(M,D)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ja}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",Q,!1),w===null){const D="webgl2";if(w=nt(D,M),w===null)throw nt(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Ie,Ce,_e,it,ve,Fe,mt,lt,T,_,O,q,j,W,ye,ie,xe,Me,te,ue,Re,Se,ce,Ue;function L(){Ie=new Qf(w),Ie.init(),Se=new Nm(w,Ie),Ce=new qf(w,Ie,e,Se),_e=new Im(w,Ie),Ce.reversedDepthBuffer&&f&&_e.buffers.depth.setReversed(!0),it=new np(w),ve=new Mm,Fe=new Um(w,Ie,_e,ve,Ce,Se,it),mt=new $f(y),lt=new Jf(y),T=new ou(w),ce=new Wf(w,T),_=new ep(w,T,it,ce),O=new sp(w,_,T,it),te=new ip(w,Ce,Fe),ie=new Yf(ve),q=new xm(y,mt,lt,Ie,Ce,ce,ie),j=new Hm(y,ve),W=new ym,ye=new Rm(Ie),Me=new Gf(y,mt,lt,_e,O,g,c),xe=new Lm(y,O,Ce),Ue=new Vm(w,it,Ce,_e),ue=new Xf(w,Ie,it),Re=new tp(w,Ie,it),it.programs=q.programs,y.capabilities=Ce,y.extensions=Ie,y.properties=ve,y.renderLists=W,y.shadowMap=xe,y.state=_e,y.info=it}L();const ne=new km(y,w);this.xr=ne,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){const M=Ie.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Ie.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(M){M!==void 0&&(H=M,this.setSize(G,Z,!1))},this.getSize=function(M){return M.set(G,Z)},this.setSize=function(M,D,k=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=M,Z=D,t.width=Math.floor(M*H),t.height=Math.floor(D*H),k===!0&&(t.style.width=M+"px",t.style.height=D+"px"),this.setViewport(0,0,M,D)},this.getDrawingBufferSize=function(M){return M.set(G*H,Z*H).floor()},this.setDrawingBufferSize=function(M,D,k){G=M,Z=D,H=k,t.width=Math.floor(M*k),t.height=Math.floor(D*k),this.setViewport(0,0,M,D)},this.getCurrentViewport=function(M){return M.copy(A)},this.getViewport=function(M){return M.copy(le)},this.setViewport=function(M,D,k,z){M.isVector4?le.set(M.x,M.y,M.z,M.w):le.set(M,D,k,z),_e.viewport(A.copy(le).multiplyScalar(H).round())},this.getScissor=function(M){return M.copy(we)},this.setScissor=function(M,D,k,z){M.isVector4?we.set(M.x,M.y,M.z,M.w):we.set(M,D,k,z),_e.scissor(F.copy(we).multiplyScalar(H).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(M){_e.setScissorTest(qe=M)},this.setOpaqueSort=function(M){se=M},this.setTransparentSort=function(M){ae=M},this.getClearColor=function(M){return M.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor(...arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha(...arguments)},this.clear=function(M=!0,D=!0,k=!0){let z=0;if(M){let I=!1;if(N!==null){const ee=N.texture.format;I=ee===so||ee===io||ee===no}if(I){const ee=N.texture.type,he=ee===Sn||ee===ei||ee===os||ee===ls||ee===Qa||ee===eo,me=Me.getClearColor(),de=Me.getClearAlpha(),Ae=me.r,Pe=me.g,be=me.b;he?(v[0]=Ae,v[1]=Pe,v[2]=be,v[3]=de,w.clearBufferuiv(w.COLOR,0,v)):(p[0]=Ae,p[1]=Pe,p[2]=be,p[3]=de,w.clearBufferiv(w.COLOR,0,p))}else z|=w.COLOR_BUFFER_BIT}D&&(z|=w.DEPTH_BUFFER_BIT),k&&(z|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",Q,!1),Me.dispose(),W.dispose(),ye.dispose(),ve.dispose(),mt.dispose(),lt.dispose(),O.dispose(),ce.dispose(),Ue.dispose(),q.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",Qt),ne.removeEventListener("sessionend",po),On.stop()};function re(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const M=it.autoReset,D=xe.enabled,k=xe.autoUpdate,z=xe.needsUpdate,I=xe.type;L(),it.autoReset=M,xe.enabled=D,xe.autoUpdate=k,xe.needsUpdate=z,xe.type=I}function Q(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function K(M){const D=M.target;D.removeEventListener("dispose",K),ge(D)}function ge(M){De(M),ve.remove(M)}function De(M){const D=ve.get(M).programs;D!==void 0&&(D.forEach(function(k){q.releaseProgram(k)}),M.isShaderMaterial&&q.releaseShaderCache(M))}this.renderBufferDirect=function(M,D,k,z,I,ee){D===null&&(D=Ee);const he=I.isMesh&&I.matrixWorld.determinant()<0,me=yc(M,D,k,z,I);_e.setMaterial(z,he);let de=k.index,Ae=1;if(z.wireframe===!0){if(de=_.getWireframeAttribute(k),de===void 0)return;Ae=2}const Pe=k.drawRange,be=k.attributes.position;let ke=Pe.start*Ae,Ze=(Pe.start+Pe.count)*Ae;ee!==null&&(ke=Math.max(ke,ee.start*Ae),Ze=Math.min(Ze,(ee.start+ee.count)*Ae)),de!==null?(ke=Math.max(ke,0),Ze=Math.min(Ze,de.count)):be!=null&&(ke=Math.max(ke,0),Ze=Math.min(Ze,be.count));const ot=Ze-ke;if(ot<0||ot===1/0)return;ce.setup(I,z,me,k,de);let tt,Qe=ue;if(de!==null&&(tt=T.get(de),Qe=Re,Qe.setIndex(tt)),I.isMesh)z.wireframe===!0?(_e.setLineWidth(z.wireframeLinewidth*Mt()),Qe.setMode(w.LINES)):Qe.setMode(w.TRIANGLES);else if(I.isLine){let Te=z.linewidth;Te===void 0&&(Te=1),_e.setLineWidth(Te*Mt()),I.isLineSegments?Qe.setMode(w.LINES):I.isLineLoop?Qe.setMode(w.LINE_LOOP):Qe.setMode(w.LINE_STRIP)}else I.isPoints?Qe.setMode(w.POINTS):I.isSprite&&Qe.setMode(w.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)ds("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Qe.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Ie.get("WEBGL_multi_draw"))Qe.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const Te=I._multiDrawStarts,rt=I._multiDrawCounts,Ge=I._multiDrawCount,It=de?T.get(de).bytesPerElement:1,ai=ve.get(z).currentProgram.getUniforms();for(let Ut=0;Ut<Ge;Ut++)ai.setValue(w,"_gl_DrawID",Ut),Qe.render(Te[Ut]/It,rt[Ut])}else if(I.isInstancedMesh)Qe.renderInstances(ke,ot,I.count);else if(k.isInstancedBufferGeometry){const Te=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,rt=Math.min(k.instanceCount,Te);Qe.renderInstances(ke,ot,rt)}else Qe.render(ke,ot)};function et(M,D,k){M.transparent===!0&&M.side===jt&&M.forceSinglePass===!1?(M.side=Dt,M.needsUpdate=!0,_s(M,D,k),M.side=Nn,M.needsUpdate=!0,_s(M,D,k),M.side=jt):_s(M,D,k)}this.compile=function(M,D,k=null){k===null&&(k=M),u=ye.get(k),u.init(D),b.push(u),k.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),M!==k&&M.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(u.pushLight(I),I.castShadow&&u.pushShadow(I))}),u.setupLights();const z=new Set;return M.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const ee=I.material;if(ee)if(Array.isArray(ee))for(let he=0;he<ee.length;he++){const me=ee[he];et(me,k,I),z.add(me)}else et(ee,k,I),z.add(ee)}),u=b.pop(),z},this.compileAsync=function(M,D,k=null){const z=this.compile(M,D,k);return new Promise(I=>{function ee(){if(z.forEach(function(he){ve.get(he).currentProgram.isReady()&&z.delete(he)}),z.size===0){I(M);return}setTimeout(ee,10)}Ie.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let $e=null;function cn(M){$e&&$e(M)}function Qt(){On.stop()}function po(){On.start()}const On=new ic;On.setAnimationLoop(cn),typeof self<"u"&&On.setContext(self),this.setAnimationLoop=function(M){$e=M,ne.setAnimationLoop(M),M===null?On.stop():On.start()},ne.addEventListener("sessionstart",Qt),ne.addEventListener("sessionend",po),this.render=function(M,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(D),D=ne.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,D,N),u=ye.get(M,b.length),u.init(D),b.push(u),J.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ke.setFromProjectionMatrix(J,an,D.reversedDepth),$=this.localClippingEnabled,Ye=ie.init(this.clippingPlanes,$),m=W.get(M,E.length),m.init(),E.push(m),ne.enabled===!0&&ne.isPresenting===!0){const ee=y.xr.getDepthSensingMesh();ee!==null&&gr(ee,D,-1/0,y.sortObjects)}gr(M,D,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(se,ae),Ve=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,Ve&&Me.addToRenderList(m,M),this.info.render.frame++,Ye===!0&&ie.beginShadows();const k=u.state.shadowsArray;xe.render(k,M,D),Ye===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,I=m.transmissive;if(u.setupLights(),D.isArrayCamera){const ee=D.cameras;if(I.length>0)for(let he=0,me=ee.length;he<me;he++){const de=ee[he];go(z,I,M,de)}Ve&&Me.render(M);for(let he=0,me=ee.length;he<me;he++){const de=ee[he];mo(m,M,de,de.viewport)}}else I.length>0&&go(z,I,M,D),Ve&&Me.render(M),mo(m,M,D);N!==null&&C===0&&(Fe.updateMultisampleRenderTarget(N),Fe.updateRenderTargetMipmap(N)),M.isScene===!0&&M.onAfterRender(y,M,D),ce.resetDefaultState(),S=-1,x=null,b.pop(),b.length>0?(u=b[b.length-1],Ye===!0&&ie.setGlobalState(y.clippingPlanes,u.state.camera)):u=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function gr(M,D,k,z){if(M.visible===!1)return;if(M.layers.test(D.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(D);else if(M.isLight)u.pushLight(M),M.castShadow&&u.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Ke.intersectsSprite(M)){z&&Le.setFromMatrixPosition(M.matrixWorld).applyMatrix4(J);const he=O.update(M),me=M.material;me.visible&&m.push(M,he,me,k,Le.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Ke.intersectsObject(M))){const he=O.update(M),me=M.material;if(z&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Le.copy(M.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Le.copy(he.boundingSphere.center)),Le.applyMatrix4(M.matrixWorld).applyMatrix4(J)),Array.isArray(me)){const de=he.groups;for(let Ae=0,Pe=de.length;Ae<Pe;Ae++){const be=de[Ae],ke=me[be.materialIndex];ke&&ke.visible&&m.push(M,he,ke,k,Le.z,be)}}else me.visible&&m.push(M,he,me,k,Le.z,null)}}const ee=M.children;for(let he=0,me=ee.length;he<me;he++)gr(ee[he],D,k,z)}function mo(M,D,k,z){const I=M.opaque,ee=M.transmissive,he=M.transparent;u.setupLightsView(k),Ye===!0&&ie.setGlobalState(y.clippingPlanes,k),z&&_e.viewport(A.copy(z)),I.length>0&&gs(I,D,k),ee.length>0&&gs(ee,D,k),he.length>0&&gs(he,D,k),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function go(M,D,k,z){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[z.id]===void 0&&(u.state.transmissionRenderTarget[z.id]=new ti(1,1,{generateMipmaps:!0,type:Ie.has("EXT_color_buffer_half_float")||Ie.has("EXT_color_buffer_float")?fs:Sn,minFilter:jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace}));const ee=u.state.transmissionRenderTarget[z.id],he=z.viewport||A;ee.setSize(he.z*y.transmissionResolutionScale,he.w*y.transmissionResolutionScale);const me=y.getRenderTarget(),de=y.getActiveCubeFace(),Ae=y.getActiveMipmapLevel();y.setRenderTarget(ee),y.getClearColor(Y),V=y.getClearAlpha(),V<1&&y.setClearColor(16777215,.5),y.clear(),Ve&&Me.render(k);const Pe=y.toneMapping;y.toneMapping=Ln;const be=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),u.setupLightsView(z),Ye===!0&&ie.setGlobalState(y.clippingPlanes,z),gs(M,k,z),Fe.updateMultisampleRenderTarget(ee),Fe.updateRenderTargetMipmap(ee),Ie.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ze=0,ot=D.length;Ze<ot;Ze++){const tt=D[Ze],Qe=tt.object,Te=tt.geometry,rt=tt.material,Ge=tt.group;if(rt.side===jt&&Qe.layers.test(z.layers)){const It=rt.side;rt.side=Dt,rt.needsUpdate=!0,_o(Qe,k,z,Te,rt,Ge),rt.side=It,rt.needsUpdate=!0,ke=!0}}ke===!0&&(Fe.updateMultisampleRenderTarget(ee),Fe.updateRenderTargetMipmap(ee))}y.setRenderTarget(me,de,Ae),y.setClearColor(Y,V),be!==void 0&&(z.viewport=be),y.toneMapping=Pe}function gs(M,D,k){const z=D.isScene===!0?D.overrideMaterial:null;for(let I=0,ee=M.length;I<ee;I++){const he=M[I],me=he.object,de=he.geometry,Ae=he.group;let Pe=he.material;Pe.allowOverride===!0&&z!==null&&(Pe=z),me.layers.test(k.layers)&&_o(me,D,k,de,Pe,Ae)}}function _o(M,D,k,z,I,ee){M.onBeforeRender(y,D,k,z,I,ee),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),I.onBeforeRender(y,D,k,z,M,ee),I.transparent===!0&&I.side===jt&&I.forceSinglePass===!1?(I.side=Dt,I.needsUpdate=!0,y.renderBufferDirect(k,D,z,I,M,ee),I.side=Nn,I.needsUpdate=!0,y.renderBufferDirect(k,D,z,I,M,ee),I.side=jt):y.renderBufferDirect(k,D,z,I,M,ee),M.onAfterRender(y,D,k,z,I,ee)}function _s(M,D,k){D.isScene!==!0&&(D=Ee);const z=ve.get(M),I=u.state.lights,ee=u.state.shadowsArray,he=I.state.version,me=q.getParameters(M,I.state,ee,D,k),de=q.getProgramCacheKey(me);let Ae=z.programs;z.environment=M.isMeshStandardMaterial?D.environment:null,z.fog=D.fog,z.envMap=(M.isMeshStandardMaterial?lt:mt).get(M.envMap||z.environment),z.envMapRotation=z.environment!==null&&M.envMap===null?D.environmentRotation:M.envMapRotation,Ae===void 0&&(M.addEventListener("dispose",K),Ae=new Map,z.programs=Ae);let Pe=Ae.get(de);if(Pe!==void 0){if(z.currentProgram===Pe&&z.lightsStateVersion===he)return xo(M,me),Pe}else me.uniforms=q.getUniforms(M),M.onBeforeCompile(me,y),Pe=q.acquireProgram(me,de),Ae.set(de,Pe),z.uniforms=me.uniforms;const be=z.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(be.clippingPlanes=ie.uniform),xo(M,me),z.needsLights=bc(M),z.lightsStateVersion=he,z.needsLights&&(be.ambientLightColor.value=I.state.ambient,be.lightProbe.value=I.state.probe,be.directionalLights.value=I.state.directional,be.directionalLightShadows.value=I.state.directionalShadow,be.spotLights.value=I.state.spot,be.spotLightShadows.value=I.state.spotShadow,be.rectAreaLights.value=I.state.rectArea,be.ltc_1.value=I.state.rectAreaLTC1,be.ltc_2.value=I.state.rectAreaLTC2,be.pointLights.value=I.state.point,be.pointLightShadows.value=I.state.pointShadow,be.hemisphereLights.value=I.state.hemi,be.directionalShadowMap.value=I.state.directionalShadowMap,be.directionalShadowMatrix.value=I.state.directionalShadowMatrix,be.spotShadowMap.value=I.state.spotShadowMap,be.spotLightMatrix.value=I.state.spotLightMatrix,be.spotLightMap.value=I.state.spotLightMap,be.pointShadowMap.value=I.state.pointShadowMap,be.pointShadowMatrix.value=I.state.pointShadowMatrix),z.currentProgram=Pe,z.uniformsList=null,Pe}function vo(M){if(M.uniformsList===null){const D=M.currentProgram.getUniforms();M.uniformsList=js.seqWithValue(D.seq,M.uniforms)}return M.uniformsList}function xo(M,D){const k=ve.get(M);k.outputColorSpace=D.outputColorSpace,k.batching=D.batching,k.batchingColor=D.batchingColor,k.instancing=D.instancing,k.instancingColor=D.instancingColor,k.instancingMorph=D.instancingMorph,k.skinning=D.skinning,k.morphTargets=D.morphTargets,k.morphNormals=D.morphNormals,k.morphColors=D.morphColors,k.morphTargetsCount=D.morphTargetsCount,k.numClippingPlanes=D.numClippingPlanes,k.numIntersection=D.numClipIntersection,k.vertexAlphas=D.vertexAlphas,k.vertexTangents=D.vertexTangents,k.toneMapping=D.toneMapping}function yc(M,D,k,z,I){D.isScene!==!0&&(D=Ee),Fe.resetTextureUnits();const ee=D.fog,he=z.isMeshStandardMaterial?D.environment:null,me=N===null?y.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Oi,de=(z.isMeshStandardMaterial?lt:mt).get(z.envMap||he),Ae=z.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Pe=!!k.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),be=!!k.morphAttributes.position,ke=!!k.morphAttributes.normal,Ze=!!k.morphAttributes.color;let ot=Ln;z.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(ot=y.toneMapping);const tt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Qe=tt!==void 0?tt.length:0,Te=ve.get(z),rt=u.state.lights;if(Ye===!0&&($===!0||M!==x)){const At=M===x&&z.id===S;ie.setState(z,M,At)}let Ge=!1;z.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==rt.state.version||Te.outputColorSpace!==me||I.isBatchedMesh&&Te.batching===!1||!I.isBatchedMesh&&Te.batching===!0||I.isBatchedMesh&&Te.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Te.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Te.instancing===!1||!I.isInstancedMesh&&Te.instancing===!0||I.isSkinnedMesh&&Te.skinning===!1||!I.isSkinnedMesh&&Te.skinning===!0||I.isInstancedMesh&&Te.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Te.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Te.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Te.instancingMorph===!1&&I.morphTexture!==null||Te.envMap!==de||z.fog===!0&&Te.fog!==ee||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ie.numPlanes||Te.numIntersection!==ie.numIntersection)||Te.vertexAlphas!==Ae||Te.vertexTangents!==Pe||Te.morphTargets!==be||Te.morphNormals!==ke||Te.morphColors!==Ze||Te.toneMapping!==ot||Te.morphTargetsCount!==Qe)&&(Ge=!0):(Ge=!0,Te.__version=z.version);let It=Te.currentProgram;Ge===!0&&(It=_s(z,D,I));let ai=!1,Ut=!1,Gi=!1;const at=It.getUniforms(),Bt=Te.uniforms;if(_e.useProgram(It.program)&&(ai=!0,Ut=!0,Gi=!0),z.id!==S&&(S=z.id,Ut=!0),ai||x!==M){_e.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),at.setValue(w,"projectionMatrix",M.projectionMatrix),at.setValue(w,"viewMatrix",M.matrixWorldInverse);const Lt=at.map.cameraPosition;Lt!==void 0&&Lt.setValue(w,pe.setFromMatrixPosition(M.matrixWorld)),Ce.logarithmicDepthBuffer&&at.setValue(w,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&at.setValue(w,"isOrthographic",M.isOrthographicCamera===!0),x!==M&&(x=M,Ut=!0,Gi=!0)}if(I.isSkinnedMesh){at.setOptional(w,I,"bindMatrix"),at.setOptional(w,I,"bindMatrixInverse");const At=I.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),at.setValue(w,"boneTexture",At.boneTexture,Fe))}I.isBatchedMesh&&(at.setOptional(w,I,"batchingTexture"),at.setValue(w,"batchingTexture",I._matricesTexture,Fe),at.setOptional(w,I,"batchingIdTexture"),at.setValue(w,"batchingIdTexture",I._indirectTexture,Fe),at.setOptional(w,I,"batchingColorTexture"),I._colorsTexture!==null&&at.setValue(w,"batchingColorTexture",I._colorsTexture,Fe));const kt=k.morphAttributes;if((kt.position!==void 0||kt.normal!==void 0||kt.color!==void 0)&&te.update(I,k,It),(Ut||Te.receiveShadow!==I.receiveShadow)&&(Te.receiveShadow=I.receiveShadow,at.setValue(w,"receiveShadow",I.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(Bt.envMap.value=de,Bt.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&D.environment!==null&&(Bt.envMapIntensity.value=D.environmentIntensity),Ut&&(at.setValue(w,"toneMappingExposure",y.toneMappingExposure),Te.needsLights&&Ec(Bt,Gi),ee&&z.fog===!0&&j.refreshFogUniforms(Bt,ee),j.refreshMaterialUniforms(Bt,z,H,Z,u.state.transmissionRenderTarget[M.id]),js.upload(w,vo(Te),Bt,Fe)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(js.upload(w,vo(Te),Bt,Fe),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&at.setValue(w,"center",I.center),at.setValue(w,"modelViewMatrix",I.modelViewMatrix),at.setValue(w,"normalMatrix",I.normalMatrix),at.setValue(w,"modelMatrix",I.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const At=z.uniformsGroups;for(let Lt=0,_r=At.length;Lt<_r;Lt++){const Bn=At[Lt];Ue.update(Bn,It),Ue.bind(Bn,It)}}return It}function Ec(M,D){M.ambientLightColor.needsUpdate=D,M.lightProbe.needsUpdate=D,M.directionalLights.needsUpdate=D,M.directionalLightShadows.needsUpdate=D,M.pointLights.needsUpdate=D,M.pointLightShadows.needsUpdate=D,M.spotLights.needsUpdate=D,M.spotLightShadows.needsUpdate=D,M.rectAreaLights.needsUpdate=D,M.hemisphereLights.needsUpdate=D}function bc(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(M,D,k){const z=ve.get(M);z.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),ve.get(M.texture).__webglTexture=D,ve.get(M.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:k,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,D){const k=ve.get(M);k.__webglFramebuffer=D,k.__useDefaultFramebuffer=D===void 0};const Tc=w.createFramebuffer();this.setRenderTarget=function(M,D=0,k=0){N=M,R=D,C=k;let z=!0,I=null,ee=!1,he=!1;if(M){const de=ve.get(M);if(de.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(w.FRAMEBUFFER,null),z=!1;else if(de.__webglFramebuffer===void 0)Fe.setupRenderTarget(M);else if(de.__hasExternalTextures)Fe.rebindTextures(M,ve.get(M.texture).__webglTexture,ve.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const be=M.depthTexture;if(de.__boundDepthTexture!==be){if(be!==null&&ve.has(be)&&(M.width!==be.image.width||M.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(M)}}const Ae=M.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(he=!0);const Pe=ve.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Pe[D])?I=Pe[D][k]:I=Pe[D],ee=!0):M.samples>0&&Fe.useMultisampledRTT(M)===!1?I=ve.get(M).__webglMultisampledFramebuffer:Array.isArray(Pe)?I=Pe[k]:I=Pe,A.copy(M.viewport),F.copy(M.scissor),U=M.scissorTest}else A.copy(le).multiplyScalar(H).floor(),F.copy(we).multiplyScalar(H).floor(),U=qe;if(k!==0&&(I=Tc),_e.bindFramebuffer(w.FRAMEBUFFER,I)&&z&&_e.drawBuffers(M,I),_e.viewport(A),_e.scissor(F),_e.setScissorTest(U),ee){const de=ve.get(M.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+D,de.__webglTexture,k)}else if(he){const de=D;for(let Ae=0;Ae<M.textures.length;Ae++){const Pe=ve.get(M.textures[Ae]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+Ae,Pe.__webglTexture,k,de)}}else if(M!==null&&k!==0){const de=ve.get(M.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,de.__webglTexture,k)}S=-1},this.readRenderTargetPixels=function(M,D,k,z,I,ee,he,me=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=ve.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&he!==void 0&&(de=de[he]),de){_e.bindFramebuffer(w.FRAMEBUFFER,de);try{const Ae=M.textures[me],Pe=Ae.format,be=Ae.type;if(!Ce.textureFormatReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ce.textureTypeReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=M.width-z&&k>=0&&k<=M.height-I&&(M.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+me),w.readPixels(D,k,z,I,Se.convert(Pe),Se.convert(be),ee))}finally{const Ae=N!==null?ve.get(N).__webglFramebuffer:null;_e.bindFramebuffer(w.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(M,D,k,z,I,ee,he,me=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=ve.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&he!==void 0&&(de=de[he]),de)if(D>=0&&D<=M.width-z&&k>=0&&k<=M.height-I){_e.bindFramebuffer(w.FRAMEBUFFER,de);const Ae=M.textures[me],Pe=Ae.format,be=Ae.type;if(!Ce.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ce.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ke=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,ke),w.bufferData(w.PIXEL_PACK_BUFFER,ee.byteLength,w.STREAM_READ),M.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+me),w.readPixels(D,k,z,I,Se.convert(Pe),Se.convert(be),0);const Ze=N!==null?ve.get(N).__webglFramebuffer:null;_e.bindFramebuffer(w.FRAMEBUFFER,Ze);const ot=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await Sh(w,ot,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,ke),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,ee),w.deleteBuffer(ke),w.deleteSync(ot),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,D=null,k=0){const z=Math.pow(2,-k),I=Math.floor(M.image.width*z),ee=Math.floor(M.image.height*z),he=D!==null?D.x:0,me=D!==null?D.y:0;Fe.setTexture2D(M,0),w.copyTexSubImage2D(w.TEXTURE_2D,k,0,0,he,me,I,ee),_e.unbindTexture()};const Ac=w.createFramebuffer(),wc=w.createFramebuffer();this.copyTextureToTexture=function(M,D,k=null,z=null,I=0,ee=null){ee===null&&(I!==0?(ds("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=I,I=0):ee=0);let he,me,de,Ae,Pe,be,ke,Ze,ot;const tt=M.isCompressedTexture?M.mipmaps[ee]:M.image;if(k!==null)he=k.max.x-k.min.x,me=k.max.y-k.min.y,de=k.isBox3?k.max.z-k.min.z:1,Ae=k.min.x,Pe=k.min.y,be=k.isBox3?k.min.z:0;else{const kt=Math.pow(2,-I);he=Math.floor(tt.width*kt),me=Math.floor(tt.height*kt),M.isDataArrayTexture?de=tt.depth:M.isData3DTexture?de=Math.floor(tt.depth*kt):de=1,Ae=0,Pe=0,be=0}z!==null?(ke=z.x,Ze=z.y,ot=z.z):(ke=0,Ze=0,ot=0);const Qe=Se.convert(D.format),Te=Se.convert(D.type);let rt;D.isData3DTexture?(Fe.setTexture3D(D,0),rt=w.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(Fe.setTexture2DArray(D,0),rt=w.TEXTURE_2D_ARRAY):(Fe.setTexture2D(D,0),rt=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,D.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,D.unpackAlignment);const Ge=w.getParameter(w.UNPACK_ROW_LENGTH),It=w.getParameter(w.UNPACK_IMAGE_HEIGHT),ai=w.getParameter(w.UNPACK_SKIP_PIXELS),Ut=w.getParameter(w.UNPACK_SKIP_ROWS),Gi=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,tt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,tt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Ae),w.pixelStorei(w.UNPACK_SKIP_ROWS,Pe),w.pixelStorei(w.UNPACK_SKIP_IMAGES,be);const at=M.isDataArrayTexture||M.isData3DTexture,Bt=D.isDataArrayTexture||D.isData3DTexture;if(M.isDepthTexture){const kt=ve.get(M),At=ve.get(D),Lt=ve.get(kt.__renderTarget),_r=ve.get(At.__renderTarget);_e.bindFramebuffer(w.READ_FRAMEBUFFER,Lt.__webglFramebuffer),_e.bindFramebuffer(w.DRAW_FRAMEBUFFER,_r.__webglFramebuffer);for(let Bn=0;Bn<de;Bn++)at&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,ve.get(M).__webglTexture,I,be+Bn),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,ve.get(D).__webglTexture,ee,ot+Bn)),w.blitFramebuffer(Ae,Pe,he,me,ke,Ze,he,me,w.DEPTH_BUFFER_BIT,w.NEAREST);_e.bindFramebuffer(w.READ_FRAMEBUFFER,null),_e.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(I!==0||M.isRenderTargetTexture||ve.has(M)){const kt=ve.get(M),At=ve.get(D);_e.bindFramebuffer(w.READ_FRAMEBUFFER,Ac),_e.bindFramebuffer(w.DRAW_FRAMEBUFFER,wc);for(let Lt=0;Lt<de;Lt++)at?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,kt.__webglTexture,I,be+Lt):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,kt.__webglTexture,I),Bt?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,At.__webglTexture,ee,ot+Lt):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,At.__webglTexture,ee),I!==0?w.blitFramebuffer(Ae,Pe,he,me,ke,Ze,he,me,w.COLOR_BUFFER_BIT,w.NEAREST):Bt?w.copyTexSubImage3D(rt,ee,ke,Ze,ot+Lt,Ae,Pe,he,me):w.copyTexSubImage2D(rt,ee,ke,Ze,Ae,Pe,he,me);_e.bindFramebuffer(w.READ_FRAMEBUFFER,null),_e.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else Bt?M.isDataTexture||M.isData3DTexture?w.texSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,Te,tt.data):D.isCompressedArrayTexture?w.compressedTexSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,tt.data):w.texSubImage3D(rt,ee,ke,Ze,ot,he,me,de,Qe,Te,tt):M.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,ee,ke,Ze,he,me,Qe,Te,tt.data):M.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,ee,ke,Ze,tt.width,tt.height,Qe,tt.data):w.texSubImage2D(w.TEXTURE_2D,ee,ke,Ze,he,me,Qe,Te,tt);w.pixelStorei(w.UNPACK_ROW_LENGTH,Ge),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,It),w.pixelStorei(w.UNPACK_SKIP_PIXELS,ai),w.pixelStorei(w.UNPACK_SKIP_ROWS,Ut),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Gi),ee===0&&D.generateMipmaps&&w.generateMipmap(rt),_e.unbindTexture()},this.initRenderTarget=function(M){ve.get(M).__webglFramebuffer===void 0&&Fe.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Fe.setTextureCube(M,0):M.isData3DTexture?Fe.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Fe.setTexture2DArray(M,0):Fe.setTexture2D(M,0),_e.unbindTexture()},this.resetState=function(){R=0,C=0,N=null,_e.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return an}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),t.unpackColorSpace=We._getUnpackColorSpace()}}const ts=i=>`#${i.toString(16).padStart(6,"0")}`,_t=(i,e)=>i+Math.random()*(e-i),Wm=()=>{const i=document.createElement("canvas");i.width=i.height=512;const e=i.getContext("2d");e.fillStyle="#191923",e.fillRect(0,0,512,512);for(let n=0;n<8;n++)for(let s=0;s<8;s++){const r=s*64,a=n*64;e.fillStyle=(s+n)%2?"#20212b":"#242630",e.fillRect(r+2,a+2,60,60),e.strokeStyle="#383744",e.lineWidth=1,e.strokeRect(r+2.5,a+2.5,59,59),e.strokeStyle="rgba(255,211,143,.05)",e.beginPath(),e.moveTo(r+_t(8,25),a+_t(5,22)),e.lineTo(r+_t(32,55),a+_t(35,60)),e.stroke()}for(let n=0;n<480;n++)e.fillStyle=Math.random()<.3?"#8f7159":"#343642",e.fillRect(_t(0,512),_t(0,512),_t(1,3),_t(1,3));const t=new Zs(i);return t.wrapS=t.wrapT=er,t.repeat.set(15,15),t.colorSpace=dt,t.magFilter=xt,t},Xm={rat:"rogue",cultist:"necromancer",brute:"warrior",wisp:"alchemist"},bl=(i,e)=>{const t=new tc().load(i);return t.repeat.set(.1,1),t.offset.set(e/10,0),t.magFilter=xt,t.minFilter=xt,t.colorSpace=dt,t.needsUpdate=!0,t};class qm{host;game;scene=new qh;camera=new nc(-20,20,12,-12,.1,100);renderer=new Gm({antialias:!1,alpha:!1,powerPreference:"high-performance"});overlay=document.createElement("canvas");ctx=this.overlay.getContext("2d");minimap;player;enemyMeshes=new Map;heroTextures={};hamImage=new Image;heroAtlas=new Image;dummy=new Tt;viewWidth=40;viewHeight=24;width=1;height=1;cameraX=Be/2;cameraY=Be/2;decorations;shrineMeshes=[];resizeObserver;constructor(e,t,n){this.host=e,this.game=t,this.minimap=n,this.scene.background=new Xe(1052697),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)),this.renderer.outputColorSpace=dt,this.renderer.domElement.className="game-canvas",e.append(this.renderer.domElement),this.overlay.className="fx-canvas",e.append(this.overlay);const s=new Ct(new $t(Be,Be),new gn({map:Wm()}));s.position.set(Be/2,Be/2,-2),this.scene.add(s);const r=new $t(1.5,1.5),a=(()=>{const E=document.createElement("canvas");E.width=E.height=64;const b=E.getContext("2d");b.strokeStyle="#897759",b.lineWidth=4,b.beginPath(),b.arc(32,32,23,0,6.28),b.moveTo(32,4),b.lineTo(32,60),b.moveTo(4,32),b.lineTo(60,32),b.stroke(),b.fillStyle="#ae9c6b",b.fillRect(28,28,8,8);const y=new Zs(E);return y.colorSpace=dt,y})();this.decorations=new Qi(r,new gn({map:a,transparent:!0,opacity:.23,depthWrite:!1}),280);for(let E=0;E<280;E++)this.dummy.position.set(_t(3,Be-3),_t(3,Be-3),-1.5),this.dummy.rotation.z=_t(0,6.28),this.dummy.updateMatrix(),this.decorations.setMatrixAt(E,this.dummy.matrix);this.decorations.instanceMatrix.needsUpdate=!0,this.scene.add(this.decorations);const o=new Jo(new ln().setFromPoints([new B(1,1,-1),new B(Be-1,1,-1),new B(Be-1,Be-1,-1),new B(1,Be-1,-1)]),new Jl({color:11701091}));this.scene.add(o);const c=document.createElement("canvas");c.width=c.height=96;const l=c.getContext("2d");l.fillStyle="#50505b",l.fillRect(14,14,68,68),l.fillStyle="#77717c",l.fillRect(17,17,59,15),l.fillStyle="#282832",l.fillRect(17,69,59,8),l.strokeStyle="#bca27e",l.lineWidth=3,l.strokeRect(14,14,68,68),l.beginPath(),l.moveTo(27,18),l.lineTo(43,46),l.lineTo(32,71),l.moveTo(63,17),l.lineTo(54,41),l.lineTo(70,64),l.stroke();const d=new Zs(c);d.colorSpace=dt;const h=new Qi(new $t(2.4,2.4),new gn({map:d,transparent:!0}),45);let f=0;for(let E=20;E<Be-12;E+=30)for(let b=18;b<Be-12;b+=30)Math.abs(b-90)<20&&Math.abs(E-90)<20||(this.dummy.position.set(b+_t(-4,4),E+_t(-4,4),-1),this.dummy.rotation.z=_t(-.5,.5),this.dummy.scale.set(_t(1,1.5),_t(1,1.5),1),this.dummy.updateMatrix(),h.setMatrixAt(f++,this.dummy.matrix));h.count=f,h.instanceMatrix.needsUpdate=!0,this.scene.add(h);const g=document.createElement("canvas");g.width=g.height=128;const v=g.getContext("2d");v.translate(64,64),v.strokeStyle="#78ffc0",v.lineWidth=4,v.shadowColor="#63ffba",v.shadowBlur=18,v.beginPath(),v.arc(0,0,47,0,6.28),v.stroke(),v.beginPath(),v.arc(0,0,32,0,6.28),v.stroke(),v.fillStyle="#c0ffe0",v.font="65px Georgia",v.textAlign="center",v.textBaseline="middle",v.fillText("✚",0,3);const p=new Zs(g);p.colorSpace=dt;for(const E of t.shrines){const b=new Ct(new $t(5.6,5.6),new gn({map:p,transparent:!0,opacity:.78,depthWrite:!1}));b.position.set(E.x,E.y,-.7),this.scene.add(b),this.shrineMeshes.push(b);for(let y=0;y<4;y++){const P=y*Math.PI/2+Math.PI/4,R=new Ct(new $t(1.4,1.4),new gn({map:d,transparent:!0}));R.position.set(E.x+Math.cos(P)*4,E.y+Math.sin(P)*4,-.6),R.rotation.z=P,this.scene.add(R)}}const m=new tc;for(const E of["rat","cultist","brute","wisp"])for(const[b,y]of[["left",2],["right",3]]){const P=new gn({map:bl(`/raid-survivor/sprites/characters/${Xm[E]}.png`,y),transparent:!0,depthWrite:!1,side:jt}),R=new Qi(new $t(1,1),P,ns);R.instanceMatrix.setUsage(To),R.count=0,R.frustumCulled=!1,this.enemyMeshes.set(`${E}-${b}`,R),this.scene.add(R)}const u=m.load("/raid-survivor/characters/moloch.png");u.colorSpace=dt,u.magFilter=xt;for(const E of["left","right"]){const b=new gn({map:u,transparent:!0,depthWrite:!1,side:jt}),y=new Qi(new $t(1,1),b,16);y.instanceMatrix.setUsage(To),y.count=0,y.frustumCulled=!1,this.enemyMeshes.set(`boss-${E}`,y),this.scene.add(y)}for(const[E,b]of Object.entries({left:2,right:3,"attack-left":6,"attack-right":7}))this.heroTextures[E]=bl(`/raid-survivor/sprites/characters/${t.hero}.png`,b);this.heroAtlas.src=`/raid-survivor/sprites/characters/${t.hero}.png`,this.player=new qo(new Kl({map:this.heroTextures.right,transparent:!0,depthTest:!1})),this.player.scale.set(2.05,2.58,1),this.player.position.z=3,this.scene.add(this.player),this.hamImage.src="/raid-survivor/sprites/items.png",this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize()}resize(){this.width=this.host.clientWidth||1,this.height=this.host.clientHeight||1,this.renderer.setSize(this.width,this.height),this.overlay.width=Math.floor(this.width*devicePixelRatio),this.overlay.height=Math.floor(this.height*devicePixelRatio),this.overlay.style.width=`${this.width}px`,this.overlay.style.height=`${this.height}px`,this.ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0),this.viewHeight=this.width<700?31:25,this.viewWidth=this.viewHeight*this.width/this.height,this.camera.left=-this.viewWidth/2,this.camera.right=this.viewWidth/2,this.camera.top=this.viewHeight/2,this.camera.bottom=-this.viewHeight/2,this.camera.updateProjectionMatrix()}screen(e,t){return{x:(e-this.cameraX)/this.viewWidth*this.width+this.width/2,y:this.height/2-(t-this.cameraY)/this.viewHeight*this.height}}world(e,t){return{x:this.cameraX+(e-this.width/2)/this.width*this.viewWidth,y:this.cameraY-(t-this.height/2)/this.height*this.viewHeight}}render(e,t=!1){const n=this.game.player,s=Math.min(1,e*7);this.cameraX+=(n.x-this.cameraX)*s,this.cameraY+=(n.y-this.cameraY)*s,this.cameraX=Math.max(this.viewWidth/2,Math.min(Be-this.viewWidth/2,this.cameraX)),this.cameraY=Math.max(this.viewHeight/2,Math.min(Be-this.viewHeight/2,this.cameraY)),this.camera.position.set(this.cameraX,this.cameraY,50),this.camera.lookAt(this.cameraX,this.cameraY,0);const r=new Map;for(const o of this.game.enemies){if(Math.abs(o.x-this.cameraX)>this.viewWidth/2+3||Math.abs(o.y-this.cameraY)>this.viewHeight/2+3)continue;const c=`${o.kind}-${o.facing<0?"left":"right"}`,l=this.enemyMeshes.get(c),d=r.get(c)||0;if(d>=l.instanceMatrix.count)continue;this.dummy.position.set(o.x,o.y,o.y/1e3);const h=(o.kind==="boss"?5.1:o.kind==="brute"?2.2:1.65)*(o.elite?1.35:1);this.dummy.scale.set(o.kind==="boss"&&o.facing<0?-h:h,h,1),this.dummy.rotation.z=o.kind==="wisp"?Math.sin(this.game.elapsed*4+o.phase)*.12:0,this.dummy.updateMatrix(),l.setMatrixAt(d,this.dummy.matrix),l.setColorAt(d,new Xe(o.flash>0?16777215:o.elite?16766621:16777215)),r.set(c,d+1)}for(const[o,c]of this.enemyMeshes)c.count=r.get(o)||0,c.instanceMatrix.needsUpdate=!0,c.instanceColor&&(c.instanceColor.needsUpdate=!0);for(let o=0;o<this.shrineMeshes.length;o++){const c=this.shrineMeshes[o].material;c.opacity=this.game.shrines[o].active?.78:.17,this.shrineMeshes[o].position.x=this.game.shrines[o].x,this.shrineMeshes[o].position.y=this.game.shrines[o].y,this.shrineMeshes[o].rotation.z+=e*.15}const a=this.game.dead&&this.game.deathReason==="combat";this.player.visible=!a||t,this.player.position.set(n.x,a?n.y:n.y+Math.sin(this.game.elapsed*6)*.08,4),this.player.material.map=this.heroTextures[`${(a?this.game.deathFiring:this.game.firing)?"attack-":""}${(a?this.game.deathFacing:this.game.facing)<0?"left":"right"}`],this.player.material.color.setHex(a?16777215:n.invuln>0&&Math.floor(this.game.elapsed*18)%2?16740748:16777215),this.player.material.opacity=a&&t?Math.max(0,1-this.game.deathProgress):1,this.renderer.render(this.scene,this.camera),this.drawFx(),this.drawMinimap()}drawFx(){const e=this.ctx;e.clearRect(0,0,this.width,this.height);const t=this.width/this.viewWidth;for(const r of this.game.projectiles){const a=this.screen(r.x,r.y);a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20||(e.save(),e.translate(a.x,a.y),e.rotate(Math.atan2(-r.vy,r.vx)),e.shadowColor=ts(bt[r.kind].color),e.shadowBlur=16,e.fillStyle=ts(bt[r.kind].color),e.beginPath(),e.ellipse(0,0,Math.max(4,r.radius*t*1.6),Math.max(2,r.radius*t*.58),0,0,6.28),e.fill(),e.restore())}for(const r of this.game.enemyShots){const a=this.screen(r.x,r.y);a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20||(e.fillStyle=r.boss?"#ffb079":"#f2a1d8",e.shadowColor=e.fillStyle,e.shadowBlur=17,e.beginPath(),e.arc(a.x,a.y,Math.max(3,r.radius*t),0,6.28),e.fill(),e.shadowBlur=0)}for(const r of this.game.pickups){const a=this.screen(r.x,r.y);if(a.x<-20||a.x>this.width+20||a.y<-20||a.y>this.height+20)continue;const o=r.kind==="xp"?"#8df3cb":r.kind==="heart"?"#94ffb3":"#ffd277",c=r.kind==="chest"?12:5;e.fillStyle=o,e.shadowColor=o,e.shadowBlur=r.kind==="chest"?20:9,e.beginPath(),r.kind==="heart"&&this.hamImage.complete&&this.hamImage.naturalWidth?e.drawImage(this.hamImage,0,0,48,48,a.x-17,a.y-17,34,34):r.kind==="chest"?(e.fillRect(a.x-c,a.y-c,c*2,c*2),e.fillStyle="#4b2e42",e.fillRect(a.x-4,a.y-8,8,13)):(e.arc(a.x,a.y,c,0,6.28),e.fill()),e.shadowBlur=0}for(const r of this.game.shrines){if(!r.active)continue;const a=this.screen(r.x,r.y);a.x<0||a.x>this.width||a.y<0||a.y>this.height||(e.fillStyle="#baffd1",e.shadowColor="#63ffba",e.shadowBlur=16,e.font="900 10px Cinzel,Georgia,serif",e.textAlign="center",e.fillText("✚ HEAL + XP",a.x,a.y-45),e.shadowBlur=0)}if(this.game.bombWave){const r=this.game.bombWave,a=this.screen(this.game.player.x,this.game.player.y);e.save(),e.strokeStyle=this.game.hero==="ranger"?"#8ff8b0":this.game.hero==="wizard"?"#a9c9ff":"#ffca8d",e.lineWidth=7,e.shadowColor=e.strokeStyle,e.shadowBlur=28,e.globalAlpha=.9-r.age*.7,e.beginPath(),e.arc(a.x,a.y,r.radius*t,0,Math.PI*2),e.stroke(),e.restore()}const n=this.game.dead&&this.game.deathReason==="combat",s=this.screen(this.game.player.x,this.game.player.y);if(n||(e.strokeStyle="rgba(159,240,194,.55)",e.lineWidth=2,e.beginPath(),e.ellipse(s.x,s.y+19,20,6,0,0,6.28),e.stroke(),this.game.player.dashCooldown<=0&&(e.strokeStyle="rgba(171,255,207,.7)",e.beginPath(),e.arc(s.x,s.y,26,0,6.28),e.stroke())),!n&&this.game.weapons.orbit&&this.game.slots.includes("orbit")){const r=this.game.weapons.orbit,a=2+r;for(let o=0;o<a;o++){const c=this.game.elapsed*(2.7+r*.15)+o*6.28/a,l=this.screen(this.game.player.x+Math.cos(c)*(2.2+r*.2),this.game.player.y+Math.sin(c)*(2.2+r*.2));e.save(),e.translate(l.x,l.y),e.rotate(c),e.fillStyle="#ffe5a4",e.shadowColor="#ffd071",e.shadowBlur=17,e.beginPath(),e.moveTo(0,-12),e.lineTo(5,0),e.lineTo(0,12),e.lineTo(-5,0),e.closePath(),e.fill(),e.restore()}}n&&this.player.visible===!1&&this.drawDeath(e,s.x,s.y,t);for(const r of this.game.effects){const a=this.screen(r.x,r.y),o=1-r.life/r.max;if(e.globalAlpha=Math.max(0,r.life/r.max),e.strokeStyle=ts(r.color),e.fillStyle=ts(r.color),e.shadowColor=ts(r.color),e.shadowBlur=20,e.lineWidth=3,r.kind==="zap"&&r.x2!==void 0&&r.y2!==void 0){const c=this.screen(r.x2,r.y2);e.beginPath(),e.moveTo(a.x,a.y);const l=(a.x+c.x)/2,d=(a.y+c.y)/2;e.lineTo(l+_t(-8,8),d+_t(-8,8)),e.lineTo(c.x,c.y),e.stroke()}else r.kind==="ring"||r.kind==="comet"?(e.beginPath(),e.arc(a.x,a.y,Math.max(1,r.size*t*(r.kind==="comet"?1-o*.25:o)),0,6.28),e.stroke(),r.kind==="comet"&&(e.fillStyle="rgba(255,145,101,.11)",e.fill())):r.kind==="text"?(e.font="900 22px Cinzel, Georgia, serif",e.textAlign="center",e.fillText(r.text||"",a.x,a.y-o*45)):(e.beginPath(),e.arc(a.x,a.y,r.size*t*(.3+o),0,6.28),e.fill())}e.globalAlpha=1,e.shadowBlur=0;for(const r of this.game.enemies){if(!r.elite&&r.kind!=="boss"||r.hp<=0)continue;const a=this.screen(r.x,r.y);if(a.x<0||a.x>this.width||a.y<0||a.y>this.height)continue;const o=r.kind==="boss"?100:36;e.fillStyle="#2c1c29",e.fillRect(a.x-o/2,a.y-45,o,7),e.fillStyle=r.kind==="boss"?"#f4bd76":"#ff8091",e.fillRect(a.x-o/2,a.y-45,o*r.hp/r.maxHp,7),r.kind==="boss"&&(e.font="900 12px Cinzel,Georgia,serif",e.textAlign="center",e.fillStyle="#ffd7a7",e.fillText("MOLOCH",a.x,a.y-51))}}drawDeath(e,t,n,s){const r=this.heroAtlas,a=Math.max(0,Math.min(1,this.game.deathProgress));if(a>=1||!r.complete||!r.naturalWidth)return;const o=this.game.deathFiring?this.game.deathFacing<0?6:7:this.game.deathFacing<0?2:3,c=2.05*s,l=2.58*s,d=t-c/2,h=n-l/2,f=18,g=68/f;e.save(),e.imageSmoothingEnabled=!1;for(let p=0;p<f;p++){const m=p/f,u=Math.min(1,Math.max(0,(a-m*.33)/.67)),E=p*g,b=h+m*l+u*u*l*(.28+.32*m),y=Math.max(0,1-Math.max(0,(a-.42-m*.16)*1.8))*Math.min(1,(1-a)/.22);if(y<=0)continue;e.globalAlpha=y;const P=Math.sin(p*13.7)*a*c*.13;e.drawImage(r,o*54,E,54,g,d+P,b,c,l/f+1)}const v=28;for(let p=0;p<v;p++){const m=p%11/17;if(a<m||a>.94)continue;const u=(a-m)/(.94-m),E=p*17%50,b=p*29%62,y=d+E/54*c+Math.sin(p*47.1)*.5*u*c,P=h+b/68*l+u*u*l*.72;e.globalAlpha=Math.max(0,1-u*.95),e.drawImage(r,o*54+E,b,4,4,y,P,Math.max(2,c*4/54),Math.max(2,l*4/68))}e.globalAlpha=Math.max(0,Math.sin(a*Math.PI))*.7,e.fillStyle=this.game.hero==="ranger"?"#5bba81":this.game.hero==="wizard"?"#806fd1":"#c18a55",e.beginPath(),e.ellipse(t,n+l*.48,c*(.15+a*.43),l*.06,0,0,Math.PI*2),e.fill(),e.restore()}drawMinimap(){const e=this.minimap.getContext("2d"),t=this.minimap.width,n=this.minimap.height;e.fillStyle="#171722",e.fillRect(0,0,t,n),e.strokeStyle="#8a7360",e.strokeRect(1,1,t-2,n-2),e.fillStyle="#80ffc0";for(const r of this.game.shrines)if(r.active){const a=r.x/Be*t,o=(1-r.y/Be)*n;e.fillRect(a-1,o-4,3,9),e.fillRect(a-4,o-1,9,3)}e.fillStyle="#e47786";for(const r of this.game.enemies)(r.kind==="boss"||r.elite)&&(e.beginPath(),e.arc(r.x/Be*t,(1-r.y/Be)*n,r.kind==="boss"?3:1.5,0,6.28),e.fill());const s=this.game.player;e.fillStyle="#aff3c6",e.beginPath(),e.arc(s.x/Be*t,(1-s.y/Be)*n,3,0,6.28),e.fill(),e.strokeStyle="#aaffd0",e.strokeRect((this.cameraX-this.viewWidth/2)/Be*t,(1-(this.cameraY+this.viewHeight/2)/Be)*n,this.viewWidth/Be*t,this.viewHeight/Be*n)}dispose(){this.resizeObserver.disconnect(),this.scene.traverse(e=>{if(e instanceof Ct||e instanceof Qi||e instanceof Jo||e instanceof qo){e.geometry?.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)"map"in n&&n.map instanceof vt&&n.map.dispose(),n.dispose()}});for(const e of Object.values(this.heroTextures))e.dispose();this.renderer.dispose(),this.renderer.forceContextLoss(),this.host.replaceChildren()}}const Ym=1024,Va=130,$m=60/Va/4,Tl={drums:!0,bass:!0,arp:!0,lead:!0,air:!0},Km=i=>440*Math.pow(2,(i-69)/12),Zm=[{root:38,chord:[62,65,69],name:"Dm"},{root:34,chord:[58,62,65],name:"Bb"},{root:41,chord:[60,65,69],name:"F"},{root:36,chord:[60,64,67],name:"C"},{root:43,chord:[62,67,70],name:"Gm"},{root:34,chord:[62,65,70],name:"Bb"},{root:38,chord:[62,65,69],name:"Dm"},{root:33,chord:[61,64,69],name:"A"}],jm=[[74,null,77,76,74,null,69,72],[74,null,77,79,77,74,72,null],[77,null,81,79,77,76,74,null],[76,null,79,77,76,72,69,null],[79,null,82,81,79,77,74,null],[77,74,null,77,82,81,77,null],[81,77,74,null,77,76,74,72],[73,null,76,81,79,76,73,null]];function Jm(i,e=38,t=Tl){const n=i.createGain(),s=i.createDynamicsCompressor(),r=i.createGain();s.threshold.value=-15,s.knee.value=16,s.ratio.value=5,s.attack.value=.004,s.release.value=.17,n.connect(s),s.connect(r),r.connect(i.destination),r.gain.value=e/100*.72;const a={};for(const x of Object.keys(Tl))a[x]=i.createGain(),a[x].gain.value=t[x]?1:0,a[x].connect(n);const o=i.createDelay(1);o.delayTime.value=60/Va*.75;const c=i.createGain();c.gain.value=.24;const l=i.createBiquadFilter();l.type="lowpass",l.frequency.value=2900;const d=i.createGain();d.gain.value=.18,o.connect(l),l.connect(c),c.connect(o),l.connect(d),d.connect(n);const h=i.createConvolver(),f=i.createGain();f.gain.value=.12;const g=i.createBuffer(2,i.sampleRate*1.6,i.sampleRate);let v=93;const p=()=>(v=Math.imul(v,1664525)+1013904223>>>0,v/4294967296);for(let x=0;x<2;x++){const A=g.getChannelData(x);for(let F=0;F<A.length;F++)A[F]=(p()*2-1)*Math.pow(1-F/A.length,3.2)}h.buffer=g,h.connect(f),f.connect(n);const m=i.createBuffer(1,i.sampleRate,i.sampleRate),u=m.getChannelData(0);for(let x=0;x<u.length;x++)u[x]=p()*2-1;const E=new Set;function b(x,A,F){E.add(x),x.onended=()=>{E.delete(x),x.disconnect()},x.start(A),x.stop(A+F)}function y(x,A,F,U,Y,V,G=2800,Z=0,H=0,se=.007){const ae=i.createOscillator(),le=i.createBiquadFilter(),we=i.createGain(),qe=i.createStereoPanner();if(ae.type=U,ae.frequency.setValueAtTime(Km(x),A),le.type="lowpass",le.frequency.setValueAtTime(G,A),le.frequency.exponentialRampToValueAtTime(Math.max(160,G*.45),A+F),le.Q.value=U==="sawtooth"?1.8:.6,qe.pan.value=Z,we.gain.setValueAtTime(1e-4,A),we.gain.exponentialRampToValueAtTime(Y,A+se),we.gain.exponentialRampToValueAtTime(1e-4,A+F),ae.connect(le),le.connect(we),we.connect(qe),qe.connect(a[V]),H&&t[V]){const Ke=i.createGain();Ke.gain.value=H,qe.connect(Ke),Ke.connect(o),Ke.connect(h)}b(ae,A,F+.02)}function P(x,A,F,U,Y=0){const V=i.createBufferSource(),G=i.createBiquadFilter(),Z=i.createGain(),H=i.createStereoPanner();V.buffer=m,G.type="highpass",G.frequency.value=U,H.pan.value=Y,Z.gain.setValueAtTime(F,x),Z.gain.exponentialRampToValueAtTime(1e-4,x+A),V.connect(G),G.connect(Z),Z.connect(H),H.connect(a.drums),b(V,x,A+.01)}function R(x,A=1){const F=i.createOscillator(),U=i.createGain();F.frequency.setValueAtTime(142,x),F.frequency.exponentialRampToValueAtTime(47,x+.055),F.frequency.exponentialRampToValueAtTime(38,x+.28),U.gain.setValueAtTime(.56*A,x),U.gain.exponentialRampToValueAtTime(1e-4,x+.31),F.connect(U),U.connect(a.drums),b(F,x,.33)}function C(x,A=1){P(x,.14,.18*A,1400,-.06),y(50,x,.09,"triangle",.11*A,"drums",2100)}function N(x,A){y(x,A,.9,"sine",.075,"air",7e3,-.3,.45,.003),y(x+19,A,.42,"sine",.021,"air",8500,.3,.25,.003)}function S(x,A){const F=Math.floor(x/16),U=x%16,Y=Math.floor(F/16),V=F%16,G=Zm[Math.floor(V/2)],Z=G.root,H=Y===2&&V<8,se=Y===1||Y===3;(U===0||U===8||se&&U===6||se&&U===14)&&R(A,U===6||U===14?.68:1),(U===4||U===12)&&C(A,U===12?1:.92),U%2===0&&P(A,U===14?.12:.035,U%4===2?.075:.045,6500,U%4===2?.25:-.2),se&&U%2===1&&U!==15&&P(A,.022,.024,7800,U%4<2?-.35:.35),V%4===3&&U===15&&(C(A,.33),P(A+.045,.035,.033,6e3));const ae=[0,null,0,12,null,null,7,null,0,null,0,null,12,null,7,null];if(ae[U]!==null){const le=U===0||U===8?.18:.12;y(Z+ae[U],A,le,"sawtooth",.095,"bass",620+U%4*170),y(Z+ae[U]-12,A,le+.03,"sine",.075,"bass",160)}if(!H||U%2===0){const le=[0,1,2,1,0,2,1,2,0,1,2,1,2,1,0,2][U],we=U===7||U===15?12:0;y(G.chord[le]+we,A,.12,"triangle",U%4===0?.055:.036,"arp",3700,U%2?-.32:.32,.3)}if(U%2===0&&(Y!==0||V>=4)&&!H){const le=jm[Math.floor(V/2)],we=le[U/2];we!==null&&!(V%2===0&&U===14)&&y(we+(Y===3&&V>=8?12:0),A,U===0?.29:.21,"square",se?.036:.028,"lead",2200,.08,.44)}if(U===0){for(let le=0;le<G.chord.length;le++)y(G.chord[le]-12,A,60/Va*4*.97,"triangle",.029,"air",900,(le-1)*.55,.3,.2);V%4===0&&N(G.chord[0]+12,A)}Y===2&&V<8&&U===10&&V%2===1&&N(G.chord[2],A)}return{schedule:S,out:r,buses:a,stop(){r.gain.cancelScheduledValues(i.currentTime),r.gain.setTargetAtTime(0,i.currentTime,.025);for(const x of E)try{x.stop(i.currentTime+.12)}catch{}}}}const lc="raid-music-volume",cc="raid-music-muted";function Qm(){try{const i=localStorage.getItem(lc);if(i===null)return 38;const e=Number(i);return Number.isFinite(e)?Math.min(100,Math.max(0,e)):38}catch{return 38}}function eg(){try{return localStorage.getItem(cc)==="true"}catch{return!1}}class tg{context=null;engine=null;timer=null;pending=null;generation=0;step=0;nextTime=0;activated=!1;disposed=!1;creationCount=0;volume=Qm();muted=eg();onVisibility=()=>{document.hidden?this.pauseForHidden():this.activated&&this.start()};onPageHide=()=>{this.release()};onPageShow=()=>{this.activated&&!document.hidden&&this.start()};constructor(){document.addEventListener("visibilitychange",this.onVisibility),window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow)}snapshot(){return{activated:this.activated,playing:!!this.timer,contextState:this.context?.state??"none",timerCount:this.timer?1:0,step:this.step,volume:this.volume,muted:this.muted,creationCount:this.creationCount}}setVolume(e){this.volume=Number.isFinite(e)?Math.min(100,Math.max(0,e)):38;try{localStorage.setItem(lc,String(this.volume))}catch{}this.applyGain()}setMuted(e){this.muted=e;try{localStorage.setItem(cc,String(e))}catch{}this.applyGain()}toggleMuted(){this.setMuted(!this.muted)}applyGain(){this.engine&&this.context&&this.engine.out.gain.setTargetAtTime(this.muted?0:this.volume/100*.72,this.context.currentTime,.03)}start(){if(this.disposed||(this.activated=!0,document.hidden)||this.timer&&this.context?.state==="running")return Promise.resolve();if(this.pending)return this.pending;const e=++this.generation;let t;try{t=this.context??new AudioContext}catch{return Promise.resolve()}this.context||(this.context=t,this.creationCount++);let n;try{n=t.resume()}catch{return Promise.resolve()}const s=n.then(()=>{if(this.disposed||e!==this.generation||document.hidden||t.state!=="running"){document.hidden&&t===this.context&&t.state==="running"&&this.suspendAfterHide(t);return}this.engine?this.nextTime=Math.max(this.nextTime,t.currentTime+.06):(this.engine=Jm(t,this.muted?0:this.volume),this.nextTime=t.currentTime+.06),this.schedule(),this.timer||(this.timer=setInterval(()=>this.schedule(),25))}).catch(()=>{}).finally(()=>{this.pending===s&&(this.pending=null)});return this.pending=s,s}schedule(){const e=this.context,t=this.engine;if(!(!e||!t||e.state!=="running"||document.hidden||this.disposed))for(this.nextTime=Math.max(this.nextTime,e.currentTime+.01);this.nextTime<e.currentTime+.16;)t.schedule(this.step,this.nextTime),this.step=(this.step+1)%Ym,this.nextTime+=$m}async suspendAfterHide(e){try{await e.suspend()}catch{return}if(this.disposed||document.hidden||e!==this.context)return;const t=this.pending;t&&await t,!(this.disposed||document.hidden||e!==this.context||e.state!=="suspended")&&(this.timer&&(clearInterval(this.timer),this.timer=null),this.start())}pauseForHidden(){this.generation++;const e=!!this.pending;this.pending=null,this.timer&&(clearInterval(this.timer),this.timer=null);const t=this.context;t&&(t.state==="running"||e)&&this.suspendAfterHide(t)}async release(){this.generation++,this.timer&&(clearInterval(this.timer),this.timer=null);const e=this.context;if(this.context=null,this.engine?.stop(),this.engine=null,this.pending=null,e&&e.state!=="closed")try{await e.close()}catch{}}dispose(){this.disposed||(this.disposed=!0,document.removeEventListener("visibilitychange",this.onVisibility),window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow),this.release())}}const Vt=new tg,lo="/leaderboard-api/raid-survivor",hc="1",fr=window.self!==window.top,ng=new URL(location.href).searchParams.get("ranked")==="launch-failed",Un={getItem(i){try{return localStorage.getItem(i)}catch{return null}},setItem(i,e){try{localStorage.setItem(i,e)}catch{}}};async function co(i,e={},t=4e3){const n=new AbortController,s=setTimeout(()=>n.abort(),t);try{return await fetch(i,{...e,signal:n.signal,credentials:"same-origin"})}finally{clearTimeout(s)}}async function uc(i,e){return co(lo+i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}const dc=document.querySelector("#app"),ar=Object.keys(Za),Ga=i=>`/raid-survivor/characters/${i}-preview.png`,Al=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),fc=i=>`${Math.floor(i/60).toString().padStart(2,"0")}:${Math.floor(i%60).toString().padStart(2,"0")}`;let X=null,Mn=null,or="ranger",pc=0,Wa=0,Js=0,lr=0,Xa=!1,Qs=null,vn=!1,Ci="Guest",qa=!1,Pt="none",_n=Un.getItem("raid-sound")!=="off",Jn=Un.getItem("raid-motion")==="reduced",Kn=Un.getItem("raid-manual-aim")==="on",Ya=[],mc=fr,gc="Guest",Pi="Local scores saved on this device.",cr=[];const Ot=new Set,Kt={down:!1,x:0,y:0},Et={move:{id:-1,x:0,y:0,dx:0,dy:0},aim:{id:-1,x:0,y:0,dx:0,dy:0}};let ct=null;function _c(){if(_n)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{})}catch{}}function ig(){mr(),ni(),Pt="none",document.querySelector("#overlay-root").innerHTML="",document.querySelector(".game-shell")?.classList.add("is-dead"),document.querySelectorAll(".hud button").forEach(i=>i.disabled=!0),uo(),rg()}let sg=0,on=0;const hr=new Set;function pr(){for(const i of hr){try{i.source.stop()}catch{}i.source.disconnect(),i.gain.disconnect()}hr.clear()}function rg(){if(_n)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const i=ct,e=i.currentTime,t=(l,d,h)=>{const f=i.createGain();f.gain.setValueAtTime(1e-4,e),f.gain.exponentialRampToValueAtTime(d,e+.025),f.gain.exponentialRampToValueAtTime(1e-4,e+h),l.connect(f).connect(i.destination);const g={source:l,gain:f};hr.add(g),l.onended=()=>{hr.delete(g),l.disconnect(),f.disconnect()},l.start(e),l.stop(e+h+.01)},n=i.createOscillator();n.type="triangle",n.frequency.setValueAtTime(155,e),n.frequency.exponentialRampToValueAtTime(62,e+.24),t(n,.085,.28);const s=i.createOscillator();s.type="sawtooth",s.frequency.setValueAtTime(430,e),s.frequency.exponentialRampToValueAtTime(70,e+.72),t(s,.022,.76);const r=i.createBuffer(1,Math.ceil(i.sampleRate*.85),i.sampleRate),a=r.getChannelData(0);let o=1979;for(let l=0;l<a.length;l++)o=o*1664525+1013904223>>>0,a[l]=(o/4294967296*2-1)*(1-l/a.length);const c=i.createBufferSource();c.buffer=r,t(c,.028,.82),sg++}catch{}}let ss=0,rs=[],Qn=null;function ni(){ss++;for(const i of rs)clearTimeout(i);rs=[],Qn&&clearInterval(Qn),Qn=null}function Li(i){if(_n)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const e=ct.createOscillator(),t=ct.createGain(),n=ct.currentTime,s={kill:[280,90,.06,"triangle"],hurt:[160,48,.2,"sawtooth"],shoot:[480,230,.045,"square"],level:[520,900,.3,"sine"],chest:[380,1140,.5,"triangle"],boss:[190,56,.55,"sawtooth"],dash:[420,160,.12,"triangle"]}[i];e.type=s[3],e.frequency.setValueAtTime(s[0],n),e.frequency.exponentialRampToValueAtTime(s[1],n+s[2]),t.gain.setValueAtTime(i==="shoot"?.025:.07,n),t.gain.exponentialRampToValueAtTime(.001,n+s[2]),e.connect(t).connect(ct.destination),e.start(),e.stop(n+s[2])}catch{}}async function ag(){if(fr){vn=!1,Ci="Guest",Pi="Embedded guest play",$a();return}try{const i=await co(lo+"/session");if(i.ok){const e=await i.json();vn=!0,Ci=e.displayName||"Portal player",Pi="Portal ranked play ready."}else vn=!1,Ci="Guest",Pi="Launch from Portal for ranked play."}catch{vn=!1,Ci="Guest",Pi="Ranked service unavailable; local play is ready."}mc=!0,$a()}function $a(){const i=document.querySelector("#identity");i&&(i.textContent=vn?`✦ ${Ci} · PORTAL LINKED`:ng?"◇ PORTAL LAUNCH FAILED · GUEST PLAY READY":"◇ GUEST RUN · LOCAL SCORES")}async function vc(){if(fr)return!1;try{const i=await co(lo+"/leaderboard");if(i.ok)return Ya=((await i.json()).entries||[]).map(t=>({handle:t.displayName,character:t.character,score:t.score,kills:t.kills,seconds:Math.floor(t.durationMs/1e3),at:""})),!0}catch{}return!1}function Ka(){try{return JSON.parse(Un.getItem("raid-local-scores")||"[]")}catch{return[]}}function og(i){const e=[...Ka(),i].sort((t,n)=>n.score-t.score).slice(0,20);Un.setItem("raid-local-scores",JSON.stringify(e))}function lg(){return`<div class="menu-backdrop"><div class="menu-vignette"></div><div class="menu-rune rune-one">✧</div><div class="menu-rune rune-two">✧</div><header class="menu-top"><div class="brand"><span class="brand-mark">✦</span> RAID GUILD <span class="brand-separator">/</span> ARCADE</div><div id="identity" class="identity"></div></header><main class="menu-main"><div class="eyebrow"><span class="line"></span> AN ENDLESS VAULT AWAITS <span class="line"></span></div><h1>RAID<br/><em>SURVIVOR</em></h1><p class="subtitle">One hero. A thousand foes. Whatever you carry out is yours.</p><div class="ornament">✦ <span></span> ✦</div><div class="select-label">CHOOSE YOUR CHAMPION <small>01 / 03</small></div><div class="hero-grid">${ar.map(i=>{const e=Za[i];return`<button class="hero-card ${i===or?"selected":""}" data-hero="${i}"><span class="hero-glow"></span><span class="hero-number">0${ar.indexOf(i)+1}</span><img src="${Ga(i)}" alt="${e.name}"/><span class="hero-name">${e.name}</span><span class="hero-role">${e.role}</span><span class="hero-copy">${e.copy}</span><span class="hero-pick">${i===or?"✦ SELECTED":"SELECT HERO"}</span></button>`}).join("")}</div><button id="start" class="gold-button"><span>ENTER THE VAULT</span><b>➜</b></button><div class="menu-actions"><button id="leaderMenu">♛ LEADERBOARD</button><span>✦</span><button id="settingsMenu">⚙ SETTINGS</button></div><a class="portal-link" href="https://portal.raidguild.org/modules/raid-survivor" target="_blank" rel="noopener noreferrer">Launch from Portal for ranked play ↗</a></main><footer class="menu-footer"><span>WASD MOVE · MOUSE AIM · SPACE DASH</span><span>DESKTOP + TOUCH READY</span></footer></div><div id="modal-root"></div>`}function ho(){on++,pr(),ni(),cancelAnimationFrame(lr),X=null,Mn?.dispose(),Mn=null,dc.innerHTML=lg(),$a(),cg()}function mr(){Ot.clear(),Kt.down=!1;for(const[i,e]of Object.entries(Et)){const t=document.querySelector(i==="move"?"#moveStick":"#aimStick");e.id>=0&&t?.hasPointerCapture(e.id)&&t.releasePointerCapture(e.id),e.id=-1,e.dx=e.dy=0}for(const i of document.querySelectorAll(".stick")){i.classList.remove("active");const e=i.querySelector(".stick-knob");e&&(e.style.transform="")}}function cg(){document.querySelectorAll("[data-hero]").forEach(i=>i.onclick=()=>{or=i.dataset.hero,ho()}),document.querySelector("#start").onclick=()=>xc(),document.querySelector("#leaderMenu").onclick=()=>vg(),document.querySelector("#settingsMenu").onclick=()=>as()}async function xc(){_c(),Vt.start(),on++;const i=on;pr();const e=mc&&vn&&!fr;gc=e?Ci:"Guest",ni(),cancelAnimationFrame(lr),Mn?.dispose(),Mn=null,mr(),Pt="none",X=new Pc(or),qa=!1,Xa=!1,Qs=null,dc.innerHTML=`<div class="game-shell"><div id="stage" class="stage"></div><div class="hud top-left"><div class="hud-row"><span class="hud-brand">✦ RAID SURVIVOR</span><span id="time" class="timer">00:00</span></div><div class="health-track"><div id="health-fill"></div><span id="health-label">100 / 100</span></div><div class="xp-track"><div id="xp-fill"></div></div><div class="hud-under"><span id="level">LVL 01</span><span id="kills">0 KILLS</span><span id="combo"></span><span id="runMode">${e?"PREPARING RANKED…":"LOCAL RUN"}</span></div></div><div class="hud top-right"><div class="score-title">VAULT SCORE</div><div id="score" class="score">000000</div><canvas id="minimap" width="118" height="118"></canvas><button id="pauseButton" class="hud-icon" aria-label="Pause">Ⅱ</button></div><div class="hud bottom-left"><div id="weapons" class="weapons"></div><div class="game-tip">WASD MOVE · HOLD MOUSE TO AIM · Q BOMB · SPACE DASH · B BACKPACK</div></div><div class="hud bottom-right"><button id="bombButton" class="bomb-button" aria-label="Bomb ready" aria-keyshortcuts="Q" title="Press Q to use bomb"><span>✷</span><small id="bombStatus">READY</small><div id="bombMeter"></div><kbd class="bomb-key" aria-hidden="true">Q</kbd></button><button id="dashButton" class="dash-button"><span>↗</span><small>DASH</small><div id="dashMeter"></div></button><button id="bagButton" class="bag-button">▣ BACKPACK</button></div><div id="bossBanner" class="boss-banner"></div><div id="touchControls" class="touch-controls ${Kn?"manual-aim":""}"><div id="moveStick" class="stick move-stick"><div class="stick-knob"></div><span>MOVE</span></div><div id="aimStick" class="stick aim-stick"><div class="stick-knob"></div><span>AIM</span></div></div><div id="overlay-root"></div></div>`;const t=document.querySelector("#stage"),n=document.querySelector("#minimap");if(Mn=new qm(t,X,n),X.onReward=(s,r)=>r?pg(s):fg(s),X.onEvent=s=>{if(s==="death"){ig();return}if(Li(s==="bossDead"?"level":s==="bomb"?"boss":s==="heal"?"level":s),s==="boss"){const r=document.querySelector("#bossBanner");r.textContent="⚔ MOLOCH RISES ⚔",r.classList.add("visible"),setTimeout(()=>r.classList.remove("visible"),2700)}if(s==="bossDead"){const r=document.querySelector("#bossBanner");r.textContent="✦ MOLOCH FALLS ✦",r.classList.add("visible"),setTimeout(()=>r.classList.remove("visible"),2700)}},document.querySelector("#pauseButton").onclick=()=>Sc(),document.querySelector("#bagButton").onclick=()=>fo(),document.querySelector("#dashButton").onclick=()=>X?.dash(),document.querySelector("#bombButton").onclick=()=>X?.bomb(),dg(t),uo(),e)try{const s=await uc("/runs",{version:hc});if(s.ok){const r=await s.json();i===on&&(Qs=r.runId)}else Pi="Ranked start unavailable; local score will be saved."}catch{Pi="Ranked start unavailable; local score will be saved."}i===on&&(document.querySelector("#runMode").textContent=Qs?"PORTAL RANKED":"LOCAL RUN",Wa=performance.now(),Js=0,pc=0,lr=requestAnimationFrame(Mc))}function hg(){return Jn||window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Mc(i){if(!X||!Mn)return;const e=Math.min(.1,(i-Wa)/1e3);for(Wa=i,Js+=e,ug();Js>=1/60;)X.update(1/60),Js-=1/60;const t=hg();X.dead&&X.deathReason==="combat"&&!document.hidden&&(X.deathProgress=Math.min(1,X.deathProgress+e/(t?.25:1.3))),Mn.render(e,t),++pc%6===0&&uo(),X.cleared&&!Xa&&(Xa=!0,mg()),X.dead&&!qa&&(X.deathReason!=="combat"||X.deathProgress>=1)&&(qa=!0,_g()),lr=requestAnimationFrame(Mc)}function ug(){if(!X||!Mn||X.dead)return;const i=(Ot.has("d")||Ot.has("ArrowRight")?1:0)-(Ot.has("a")||Ot.has("ArrowLeft")?1:0),e=(Ot.has("w")||Ot.has("ArrowUp")?1:0)-(Ot.has("s")||Ot.has("ArrowDown")?1:0);if(X.move.x=Et.move.id>=0?Et.move.dx:i,X.move.y=Et.move.id>=0?Et.move.dy:e,Kn&&Et.aim.id>=0&&Math.hypot(Et.aim.dx,Et.aim.dy)>.15)X.aim.x=Et.aim.dx,X.aim.y=Et.aim.dy,X.firing=!0;else if(Kt.down){const t=Mn.world(Kt.x,Kt.y),n=t.x-X.player.x,s=t.y-X.player.y,r=Math.hypot(n,s)||1;X.aim.x=n/r,X.aim.y=s/r,X.firing=!0}else X.firing=!1}function dg(i){i.onpointermove=e=>{Kt.x=e.clientX,Kt.y=e.clientY},i.onpointerdown=e=>{X?.dead||e.pointerType==="mouse"&&(Kt.down=!0,Kt.x=e.clientX,Kt.y=e.clientY)},window.onpointerup=e=>{e.pointerType==="mouse"&&(Kt.down=!1)},window.onpointercancel=e=>{e.pointerType==="mouse"&&(Kt.down=!1)};for(const[e,t]of[["move",document.querySelector("#moveStick")],["aim",document.querySelector("#aimStick")]]){t.onpointerdown=s=>{if(X?.dead)return;s.preventDefault(),t.setPointerCapture(s.pointerId);const r=Et[e];r.id=s.pointerId,r.x=s.clientX,r.y=s.clientY,r.dx=r.dy=0,t.classList.add("active")},t.onpointermove=s=>{const r=Et[e];if(r.id!==s.pointerId)return;const a=s.clientX-r.x,o=s.clientY-r.y,c=Math.max(1,Math.hypot(a,o)),l=48;r.dx=Math.abs(a)>3?a/Math.max(c,l):0,r.dy=Math.abs(o)>3?-o/Math.max(c,l):0,t.querySelector(".stick-knob").style.transform=`translate(${a/c*Math.min(c,l)}px, ${o/c*Math.min(c,l)}px)`};const n=s=>{const r=Et[e];r.id===s.pointerId&&(r.id=-1,r.dx=r.dy=0,t.classList.remove("active"),t.querySelector(".stick-knob").style.transform="")};t.onpointerup=n,t.onpointercancel=n,t.onlostpointercapture=n}}window.addEventListener("keydown",i=>{if(!X?.dead){if(i.key==="Escape"&&!i.repeat){Pt!=="none"?ii():Sc();return}if(i.code==="KeyQ"&&!i.repeat&&!i.ctrlKey&&!i.altKey&&!i.metaKey&&X&&!X.paused&&!X.awaitingReward&&!X.cleared&&Pt==="none"&&!(i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, [contenteditable]"))){i.preventDefault(),X.bomb();return}i.target instanceof HTMLElement&&i.target.closest("input, textarea, select, button, [contenteditable]")||(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&i.preventDefault(),Ot.add(i.key.toLowerCase()),Ot.add(i.key),i.code==="Space"&&!i.repeat&&X?.dash(),i.key.toLowerCase()==="b"&&!i.repeat&&X&&fo())}});window.addEventListener("keyup",i=>{Ot.delete(i.key.toLowerCase()),Ot.delete(i.key)});window.addEventListener("blur",()=>{mr(),X&&!X.dead&&!X.awaitingReward&&(X.paused=!0)});document.addEventListener("visibilitychange",()=>{document.hidden&&(mr(),X&&!X.dead&&!X.awaitingReward&&(X.paused=!0))});function uo(){if(!X)return;const i=X.player,e=(a,o)=>{const c=document.querySelector(a);c&&(c.textContent=o)};e("#time",fc(X.elapsed)),e("#health-label",`${Math.ceil(i.health)} / ${i.maxHealth}`),e("#level",`LVL ${String(X.stats.level).padStart(2,"0")}`),e("#kills",`${X.stats.kills} KILLS`),e("#combo",X.combo>=4?`${X.combo}× CHAIN`:""),e("#score",String(X.score).padStart(6,"0")),document.querySelector("#health-fill").style.width=`${i.health/i.maxHealth*100}%`,document.querySelector("#xp-fill").style.width=`${X.xp/X.xpNeeded*100}%`,document.querySelector("#dashMeter").style.height=`${Math.min(100,(1-i.dashCooldown/3.5)*100)}%`,document.querySelector("#bombMeter").style.height=`${Math.min(100,X.bombCharge/X.bombRecharge*100)}%`;const t=document.querySelector("#bombButton");t.classList.toggle("ready",X.bombCharge>=X.bombRecharge);const n={ranger:"BRIAR BARRAGE",wizard:"ARC NOVA",dwarf:"MOUNTAIN BREAKER"}[X.hero],s=Math.ceil(X.bombRecharge-X.bombCharge);t.setAttribute("aria-label",X.bombCharge>=X.bombRecharge?`${n} ready`:`${n} charging, ${s} seconds`),t.setAttribute("data-name",n),document.querySelector("#bombStatus").textContent=X.bombCharge>=X.bombRecharge?"READY":`${s}s`;const r=document.querySelector("#weapons");r.innerHTML=X.slots.map((a,o)=>`<div class="weapon-slot" style="--weapon-color:${"#"+bt[a].color.toString(16)}"><span class="slot-num">0${o+1}</span><span class="weapon-icon">${bt[a].icon}</span><span class="weapon-label">${bt[a].name}<small>RANK ${X.weapons[a]}</small></span></div>`).join("")}function ri(i){ni();const e=document.querySelector(X?"#overlay-root":"#modal-root");return e.innerHTML=i,e}function ii(){ni(),Pt="none";const i=document.querySelector(X?"#overlay-root":"#modal-root");i&&(i.innerHTML=""),X&&!X.awaitingReward&&!X.dead&&(X.paused=!1)}function Sc(){if(!(!X||X.dead||X.cleared||X.awaitingReward)){if(Pt!=="none"){ii();return}X.paused=!X.paused,X.paused?(Pt="settings",as(!0)):ii()}}function as(i=!1){Pt="settings",X&&(X.paused=!0);const e=ri(`<div class="modal-scrim"><div class="modal-card narrow"><div class="modal-eyebrow">THE VAULT CAN WAIT</div><h2>${i?"PAUSED":"SETTINGS"}</h2><div class="setting-row"><span>Sound effects<small>Arcade synth cues</small></span><button id="soundToggle" class="toggle">${_n?"ON":"OFF"}</button></div><div class="setting-row"><span>Music<small>Vault Runner</small></span><button id="musicToggle" class="toggle" type="button" aria-label="Mute music" aria-pressed="${Vt.muted}">${Vt.muted?"OFF":"ON"}</button></div><div class="setting-row music-volume-row"><label for="musicVolume">Music volume</label><input id="musicVolume" type="range" min="0" max="100" value="${Vt.volume}" aria-label="Music volume"/><output id="musicVolumeValue" for="musicVolume">${Math.round(Vt.volume)}%</output></div><div class="setting-row"><span>Reduced motion<small>Short blessing reveal</small></span><button id="motionToggle" class="toggle">${Jn?"ON":"OFF"}</button></div><div class="setting-row"><span>Manual touch aim<small>Show a second joystick for precise firing</small></span><button id="aimToggle" class="toggle">${Kn?"ON":"OFF"}</button></div><div class="controls-note"><div>MOVE <b>WASD / LEFT STICK</b></div><div>AUTO FIRE <b>NEAREST FOE</b></div><div>MANUAL AIM <b>HOLD MOUSE / OPTIONAL RIGHT STICK</b></div><div>BOMB <b>Q / BOMB BUTTON</b></div><div>DASH <b>SPACE / DASH BUTTON</b></div><div>BACKPACK <b>B</b></div></div><button id="resume" class="gold-button small">${X?"RESUME RUN":"DONE"}</button>${X?'<button id="abandon" class="text-button">END RUN</button>':""}</div></div>`);e.querySelector("#soundToggle").onclick=()=>{_n=!_n,_n?_c():pr(),Un.setItem("raid-sound",_n?"on":"off"),as(i)},e.querySelector("#musicToggle").onclick=()=>{Vt.start(),Vt.toggleMuted();const n=e.querySelector("#musicToggle");n.textContent=Vt.muted?"OFF":"ON",n.setAttribute("aria-pressed",String(Vt.muted))},e.querySelector("#musicVolume").oninput=n=>{Vt.start();const s=Number(n.target.value);Vt.setVolume(s),e.querySelector("#musicVolumeValue").value=`${Math.round(Vt.volume)}%`},e.querySelector("#motionToggle").onclick=()=>{Jn=!Jn,Un.setItem("raid-motion",Jn?"reduced":"full"),as(i)},e.querySelector("#aimToggle").onclick=()=>{Kn=!Kn,Un.setItem("raid-manual-aim",Kn?"on":"off"),document.querySelector("#touchControls")?.classList.toggle("manual-aim",Kn),Et.aim.id=-1,Et.aim.dx=Et.aim.dy=0,as(i)},e.querySelector("#resume").onclick=()=>ii();const t=e.querySelector("#abandon");t&&(t.onclick=()=>{X&&(X.die("abandon"),ii())})}function fo(){if(!X||X.dead||X.cleared||X.awaitingReward)return;Pt="backpack",X.paused=!0;const i=X.slots.map((s,r)=>`<button class="bag-item active" data-slot="${r}"><b>${bt[s].icon}</b><span>${bt[s].name}<small>RANK ${X.weapons[s]}</small></span></button>`).join(""),e=X.backpack.map((s,r)=>`<button class="bag-item" data-bag="${r}"><b>${bt[s].icon}</b><span>${bt[s].name}<small>RANK ${X.weapons[s]}</small></span></button>`).join("")||'<div class="empty-bag">Reserve weapons found in the vault appear here.</div>',t=ri(`<div class="modal-scrim"><div class="modal-card bag-modal"><div class="modal-eyebrow">YOUR LOADOUT</div><h2>BACKPACK</h2><p>Three weapons can fire at once. Tap a reserve weapon, then an active slot to swap.</p><div class="bag-columns"><div><h3>ACTIVE · 3 SLOTS</h3>${i}</div><div><h3>RESERVE · 3 SLOTS</h3>${e}</div></div><button id="bagClose" class="gold-button small">RETURN TO VAULT</button></div></div>`);let n=-1;t.querySelectorAll("[data-bag]").forEach(s=>s.onclick=()=>{n=Number(s.dataset.bag),t.querySelectorAll("[data-bag]").forEach(r=>r.classList.remove("chosen")),s.classList.add("chosen")}),t.querySelectorAll("[data-slot]").forEach(s=>s.onclick=()=>{n>=0&&(X?.swapBackpack(n,Number(s.dataset.slot)),fo())}),t.querySelector("#bagClose").onclick=()=>ii()}function fg(i,e){if(!X)return;cr=i,Pt="none";const t=ri(`<div class="reward-scrim "><div class="reward-stage"><div class="reward-rays">✦</div><div class="modal-eyebrow">YOUR LEGEND GROWS</div><h2>${"LEVEL "+String(X.stats.level).padStart(2,"0")}</h2><p>Choose one power to carry deeper into the vault.</p><div class="reward-cards">${i.map((s,r)=>`<button class="reward-card ${s.rarity} " data-reward="${r}"><span class="reward-rarity">${s.rarity.toUpperCase()}</span><span class="reward-icon">${s.icon}</span><span class="reward-name">${s.name}</span><span class="reward-detail">${s.detail}</span><span class="reward-take">CLAIM POWER ➜</span></button>`).join("")}</div></div></div>`);t.querySelectorAll(".reward-card").forEach((s,r)=>setTimeout(()=>s.classList.remove("concealed"),Jn?0:r*320)),t.querySelectorAll("[data-reward]").forEach(s=>s.onclick=()=>{const r=cr[Number(s.dataset.reward)];X?.chooseReward(r),t.innerHTML="",Pt="none"})}function wl(i){if(_n)try{ct||=new AudioContext,ct.state==="suspended"&&ct.resume().catch(()=>{});const e=ct.createOscillator(),t=ct.createGain(),n=ct.currentTime;e.type="triangle",e.frequency.setValueAtTime(i,n),e.frequency.exponentialRampToValueAtTime(i*1.25,n+.055),t.gain.setValueAtTime(.035,n),t.gain.exponentialRampToValueAtTime(.001,n+.07),e.connect(t).connect(ct.destination),e.start(),e.stop(n+.075)}catch{}}function pg(i){if(!X)return;cr=i,Pt="none";const e=Jn||window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=["✦","ϟ","☄","◈","♥","✧"],n=i.some(h=>h.rarity==="epic")?"epic":i.some(h=>h.rarity==="rare")?"rare":"common",r=Array.from({length:n==="epic"?105:n==="rare"?70:48},(h,f)=>`<span class='${f%4===0?"coin":"streamer"}' style='--x:${Math.round(Math.random()*100)}%;--delay:${(Math.random()*.8).toFixed(2)}s;--spin:${Math.round(Math.random()*1080-540)}deg;--hue:${f%3===0?"42":f%3===1?"330":"175"}'></span>`).join(""),a=ri(`<div class='reward-scrim chest-reward rarity-${n} ${e?"low-motion":""}'>${e?"":"<div class='spotlight spotlight-left'></div><div class='spotlight spotlight-right'></div>"}${e?"":`<div class='confetti' id='confetti'>${r}</div>`}<div class='reward-stage'>${e?"":"<div class='reward-rays'>✦</div>"}<div class='modal-eyebrow'>AN ANCIENT CHEST OPENS</div><h2>VAULT BLESSING</h2><div id='reel' class='reel'><div class='reel-symbol'>✦</div><div class='reel-symbol'>ϟ</div><div class='reel-symbol'>◈</div></div><div id='reelStatus' class='reel-status' aria-live='polite'>FORTUNE IS TURNING</div><div class='reward-cards'>${i.map((h,f)=>`<button class='reward-card ${h.rarity} concealed' data-reward='${f}' disabled><span class='reward-rarity'>${h.rarity.toUpperCase()}</span><span class='reward-icon'>${h.icon}</span><span class='reward-name'>${h.name}</span><span class='reward-detail'>${h.detail}</span><span class='reward-take'>CLAIM POWER ➜</span></button>`).join("")}</div><button id='skipReveal' class='text-button'>SKIP REVEAL</button></div></div>`),o=ss,c=(h,f)=>rs.push(setTimeout(()=>{o===ss&&a.isConnected&&h()},f));let l=!1;const d=(h=!1)=>{if(l||o!==ss)return;l=!0,h&&a.querySelector(".reward-scrim")?.classList.add("reveal-skipped"),Qn&&clearInterval(Qn),Qn=null;for(const g of rs)clearTimeout(g);rs=[],a.querySelector("#reel")?.classList.add("stopped"),a.querySelector("#reelStatus").textContent=n==="epic"?"JACKPOT · CHOOSE YOUR FORTUNE":"CHOOSE YOUR FORTUNE",!h&&!e&&a.querySelector("#confetti")?.classList.add("burst"),a.querySelector("#skipReveal")?.remove();const f=[...a.querySelectorAll(".reward-card")];h||e?f.forEach(g=>{g.classList.remove("concealed"),g.disabled=!1}):f.forEach((g,v)=>c(()=>{g.classList.remove("concealed"),g.disabled=!1,wl(600+v*150)},v*240)),!h&&!e&&(Li("level"),c(()=>Li("chest"),200))};if(a.querySelector("#skipReveal").onclick=()=>d(!0),e)d(!0);else{let h=0;Qn=setInterval(()=>{if(o!==ss||!a.isConnected){ni();return}h++,a.querySelectorAll(".reel-symbol").forEach((f,g)=>f.textContent=t[(h+g*2+Math.floor(Math.random()*t.length))%t.length]),h%2===0&&wl(230+h*13)},95),c(()=>{a.querySelector("#reelStatus").textContent="THE REELS ARE SLOWING",a.querySelector("#reel")?.classList.add("slowing")},1850),c(()=>{a.querySelector("#reelStatus").textContent="ONE FINAL TURN...",a.querySelector("#reel")?.classList.add("final-turn")},2900),c(()=>d(),3700)}a.querySelectorAll("[data-reward]").forEach(h=>h.onclick=()=>{!l||h.disabled||(X?.chooseReward(cr[Number(h.dataset.reward)]),ni(),a.innerHTML="",Pt="none")})}function mg(){if(!X)return;X.paused=!0;const i=ri(`<div class='modal-scrim result-scrim'><div class='modal-card result-modal'><div class='modal-eyebrow'>THE TWELFTH BELL HAS TOLLED</div><h2>VAULT CLEARED</h2><p>You survived twelve minutes beneath the guildhall. Bank this legend, or stay and challenge the endless vault.</p><div class='result-grid'><div><strong>${X.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${X.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div><div><strong>${X.stats.level}</strong><span>LEVEL</span></div><div><strong>${X.score.toLocaleString()}</strong><span>SCORE</span></div></div><button id='bankRun' class='gold-button small'>BANK THIS RUN</button><button id='endlessRun' class='text-button'>ENTER ENDLESS MODE ➜</button></div></div>`);i.querySelector("#bankRun").onclick=()=>{X&&(X.die("bank"),i.innerHTML="")},i.querySelector("#endlessRun").onclick=()=>{X&&(X.endless=!0,X.cleared=!1,X.paused=!1,i.innerHTML="")}}function gg(i){const e=i.stats;return(e.kills-e.elites-e.bosses)*10+e.elites*75+e.bosses*600+e.chests*120+(e.level-1)*40+Math.floor(Math.round(i.elapsed*1e3)/1e3)*2}async function _g(){if(!X)return;const i=X,e=on,t=Qs;i.paused=!0;const n={handle:gc,character:i.hero,score:gg(i),kills:i.stats.kills,seconds:Math.floor(i.elapsed),at:new Date().toISOString()};i.rankable&&og(n);const s=i.rankable?t?"LOCAL SCORE SAVED · SAVING RANKED RUN…":"LOCAL SCORE SAVED":"UNRANKED TEST RUN",r=ri(`<div class="modal-scrim result-scrim"><div class="modal-card result-modal"><div class="modal-eyebrow">THE VAULT REMEMBERS</div><h2>${i.cleared?"VAULT CONQUERED":"YOUR RUN ENDS"}</h2><div class="result-score">${n.score.toLocaleString()}</div><div id="resultStatus" class="result-caption" role="status">${s}</div><div class="result-grid"><div><strong>${fc(i.elapsed)}</strong><span>SURVIVED</span></div><div><strong>${i.stats.kills}</strong><span>DEFEATED</span></div><div><strong>${i.stats.level}</strong><span>LEVEL</span></div><div><strong>${i.stats.bosses}</strong><span>MOLOCHS DEFEATED</span></div></div><button id="retry" class="gold-button small">TRY AGAIN ➜</button><button id="returnMenu" class="text-button">RETURN TO CHAMPIONS</button></div></div>`);if(r.querySelector("#retry").onclick=()=>xc(),r.querySelector("#returnMenu").onclick=()=>ho(),!(!i.rankable||!t))try{const a=await uc(`/runs/${t}/finish`,{version:hc,character:i.hero,durationMs:Math.round(i.elapsed*1e3),stats:{...i.stats}});if(i!==X||e!==on)return;const o=r.querySelector("#resultStatus");if(!o)return;a.ok?(o.textContent="LOCAL + PORTAL RANKED SCORE SAVED",vc()):o.textContent="LOCAL SCORE SAVED · RANKED SAVE FAILED"}catch{if(i===X&&e===on){const a=r.querySelector("#resultStatus");a&&(a.textContent="LOCAL SCORE SAVED · RANKED SERVICE UNAVAILABLE")}}}async function vg(){const i=on;Pt="leaderboard";const e=await vc();if(i!==on||Pt!=="leaderboard")return;const t=vn&&e?Ya:Ka(),n=t.length?t.slice(0,10).map((a,o)=>`<div class="leader-row"><span class="rank">${String(o+1).padStart(2,"0")}</span><img src="${Ga(ar.includes(a.character)?a.character:"ranger")}" alt=""/><span class="leader-name">${Al(a.handle)}</span><span class="leader-kills">${a.kills} KILLS</span><b>${a.score.toLocaleString()}</b></div>`).join(""):'<div class="empty-leader">No legends yet. The vault is waiting for its first survivor.</div>',s=ri(`<div class="modal-scrim"><div class="modal-card leader-modal"><div class="modal-eyebrow">ETCHED INTO STONE</div><h2>LEADERBOARD</h2><div class="leader-tabs"><button id="localTab" class="${vn&&e?"":"active"}">LOCAL</button><button id="portalTab" class="${vn&&e?"active":""}">PORTAL</button></div><div id="leaderStatus" class="result-caption" role="status">${e?"Portal leaderboard loaded.":"Portal leaderboard unavailable; local scores shown."}</div><div id="leaderRows">${n}</div><button id="leaderClose" class="gold-button small">CLOSE</button></div></div>`),r=a=>{s.querySelector("#leaderRows").innerHTML=a.length?a.slice(0,10).map((o,c)=>`<div class="leader-row"><span class="rank">${String(c+1).padStart(2,"0")}</span><img src="${Ga(ar.includes(o.character)?o.character:"ranger")}" alt=""/><span class="leader-name">${Al(o.handle)}</span><span class="leader-kills">${o.kills} KILLS</span><b>${o.score.toLocaleString()}</b></div>`).join(""):'<div class="empty-leader">No legends yet. The vault is waiting for its first survivor.</div>'};s.querySelector("#localTab").onclick=()=>{r(Ka()),s.querySelector("#localTab")?.classList.add("active"),s.querySelector("#portalTab")?.classList.remove("active")},s.querySelector("#portalTab").onclick=()=>{r(e?Ya:[]),s.querySelector("#portalTab")?.classList.add("active"),s.querySelector("#localTab")?.classList.remove("active")},s.querySelector("#leaderClose").onclick=()=>ii()}new URL(location.href).searchParams.has("ranked")&&history.replaceState(null,"",location.pathname+location.hash);ho();ag();window.addEventListener("pagehide",pr);
