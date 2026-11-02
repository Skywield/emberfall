// Grounded combat (Grok review priority 2):
//  * EMBER gauge per battle (party-shared). Fire hits, weakness hits, boss blows, a fallen ally and story moments build it.
//    At 100 any hero can unleash their Ember Art (costs 100). Past 120 it OVERHEATS: each action risks a burn; at 150 it
//    blows out (fire damage to the whole party, gauge drops to 60).
//  * One unique ATB command per character: Kael Shard Surge (pay HP + shard chill for a huge fire strike and heat),
//    Lyra Reignite (revive a KO'd ally or thaw a chilled one, costs 25 ember), Mira Vent (bleed off heat into healing,
//    cures chill, stabilises the gauge), Varra Gambit (coin-flip: huge hit + plunder, or a powder backfire).
//  * Hollow attacks can CHILL (ATB at 40%) - the Hollow freezes.
//  * Boss intent telegraphs in the sky-battle colours: red = heavy, purple = Hollow, green = opening (boss falters,
//    defence drops until its next action). Bosses get a little more HP to pay for the openings (see balance_sim --ember).
//  * Varra Kade fights as a guest fourth member once you trust her (Chapter 6 on).
const EMBER={max:100,cap:150,overT:120,overRisk:0.25,overBurn:0.08,blowDmg:0.12,fireHit:9,weakHit:5,bossHurt:4,koGain:12,
 storyPerShard:6,storyCap:36,bossStory:10,surgeHP:0.18,surgePow:2.0,surgeHeat:20,reignCost:25,ventMax:45,ventHeal:0.55,
 gambitWin:0.55,gambitPow:2.4,gambitBack:0.15,openEvery:5,openDef:0.45,bossHP:1.3,chillP:0.35,
 art:{kael:2.6,lyra:1.45,varraP:1.25,miraHeal:0.45}};
const INTENT={heavy:{c:'#ff4a3a',t:'HEAVY'},hollow:{c:'#b060ff',t:'HOLLOW'},open:{c:'#40e070',t:'OPENING'},power:{c:'#ffb040',t:'POWER'},strike:{c:'#d0d0e0',t:'STRIKE'}};
const UQ={kael:{n:'Shard Surge',tgt:'E'},lyra:{n:'Reignite',tgt:'Pany'},mira:{n:'Vent Heat',tgt:'self'},varraP:{n:'Gambit',tgt:'E'}};
const ART={kael:{n:'Ember Edge',tgt:'E'},lyra:{n:'Ember Nova',tgt:'allE'},mira:{n:'Ember Grace',tgt:'allP'},varraP:{n:'Broadside',tgt:'allE'}};
// --- Varra as a guest ---
SK.quickdraw={n:'Quickdraw',mp:4,tgt:'E',type:'phys',pow:1.45,fx:'slash',lv:1,d:'Pistol shot'};
SK.powderkeg={n:'Powder Keg',mp:10,tgt:'allE',type:'mag',pow:0.95,el:'fire',fx:'fire',lv:1,d:'Fire, all foes'};
EQ.cutlass={n:'Tempest Cutlass',slot:'w',who:'varraP',atk:30,mag:8,p:0};
HERO_DEF.varraP={name:'Varra',role:'Corsair',sk:['quickdraw','powderkeg'],skn:'Tricks',hp:110,mp:20,atk:13,def:8,mag:8,spd:13,g:{hp:16,mp:3,atk:2.7,def:1.7,mag:1.5,spd:.5},w:'cutlass'};
if(SPR.varra)SPR.varraP=SPR.varra;loadPaint('varraP','varra_kade_party');
function varraGuest(){const lv=Math.max(...G.party.map(m=>m.lv)),d=HERO_DEF.varraP,b={hp:d.hp,mp:d.mp,atk:d.atk,def:d.def,mag:d.mag,spd:d.spd};
 for(let i=1;i<lv;i++)for(const k in d.g)b[k]+=d.g[k];const m={id:'varraP',name:'Varra',lv,xp:0,b,w:'cutlass',a:'tunic'};const S=st(m);m.hp=S.hp;m.mp=S.mp;return m;}
const shardsHeld=()=>['boss','tyrant','wyrm','hydra','warden','seneschal'].filter(k=>G.flags[k]).length;
// --- hooks ---
const _startBattle=startBattle;
startBattle=function(grp,cave,boss){_startBattle(grp,cave,boss);
 if(G.flags.varraT&&!grp.includes('varra'))B.pt.push({m:varraGuest(),side:'P',i:B.pt.length,atb:Math.random()*40+20,flash:0,dx:0,def:0,buf:1,guest:1});
 B.ember=Math.min(EMBER.storyCap,shardsHeld()*EMBER.storyPerShard)+(boss?EMBER.bossStory:0)+(G.emberStory||0);G.emberStory=0;B.nAct=0;
 B.en.forEach(e=>{if(e.boss){e.hp=e.mhp=Math.round(e.mhp*EMBER.bossHP);}});};
window.startBattle=startBattle;
const _ustat=ustat;ustat=function(u){const s=_ustat(u);if(u.chill)s.spd=Math.max(1,s.spd*0.4-3);return s;};
function heat(v,why){if(!B)return;const was=B.ember;B.ember=Math.max(0,Math.min(EMBER.cap,B.ember+v));
 if(was<EMBER.max&&B.ember>=EMBER.max){B.msg='EMBER FULL — an Ember Art is ready!';B.msgT=1.3;sfx('lvl');}
 if(B.ember>=EMBER.cap&&!B.stable){B.ember=60;B.msg='OVERHEAT! The ember bursts!';B.msgT=1.4;B.shake=6;
  B.pt.forEach(p=>{if(p.m.hp>0){const d=Math.max(1,Math.floor(st(p.m).hp*EMBER.blowDmg));p.m.hp=Math.max(1,p.m.hp-d);addNum(p,d,'#ff8040');burst(p,['#ff4020','#ffb020'],10,50,-1);}});}}
function classify(a){if(!a)return 'strike';if(a.open)return 'open';if(a.kind==='buff')return 'power';if(a.kind==='mag'&&(a.el==='dark'||a.fx==='dark'||!a.el))return 'hollow';if(a.kind==='mag')return a.pow>=1.2?'heavy':'hollow';
 if(a.kind==='phys'&&(a.pow||1)>=1.3)return 'heavy';return 'strike';}
const _enemyAI=enemyAI;
function bossIntent(u){u.nb=(u.nb||0)+1;if(u.nb%EMBER.openEvery===0)return {u,kind:'falter',open:1,name:u.n+' falters',tg:[u]};return _enemyAI(u);}
enemyAI=function(u){if(u.boss){if(u.tel){const a=u.tel;u.tel=null;return a;}return bossIntent(u);}return _enemyAI(u);};
const _updBattle=updBattle;
// a big hit (10% of max HP) since the telegraph staggers the boss into re-reading the fight (phase changes stay on time)
updBattle=function(dt){_updBattle(dt);if(!B||B.end)return;B.en.forEach(e=>{if(!e.boss||e.hp<=0)return;if(e.tel&&!e.pend&&e.hp<e.telHP-e.mhp*0.1){e.tel=null;e.telK=null;e.nb--;}
 if(!e.pend&&!e.tel&&e.atb>=45){e.telHP=e.hp;e.tel=bossIntent(e);e.telK=classify(e.tel);}});};
const _apply=apply;
apply=function(a){const u=a.u;
 if(u.side==='E'&&u.open&&a.kind!=='falter'){u.def=u.def0;u.open=0;}
 if(u.side==='E'&&u.boss)u.telK=null;
 if(u.chill&&u.side==='P'){u.chill--;}
 if(a.kind==='falter'){u.open=1;u.def0=u.def;u.def=Math.round(u.def*EMBER.openDef);addNum(u,'OPENING','#40e070');burst(u,['#40e070','#c0ffd0'],14,40,1);sfx('move');return;}
 if(u.side==='P'&&B.ember>EMBER.overT&&!B.stable&&a.kind!=='vent'&&Math.random()<EMBER.overRisk){const d=Math.max(1,Math.floor(st(u.m).hp*EMBER.overBurn));u.m.hp=Math.max(1,u.m.hp-d);addNum(u,'BURN '+d,'#ff8040');}
 if(u.side==='P'&&B.stable)B.stable--;
 if(a.kind==='surge'){const S=st(u.m),c=Math.floor(S.hp*EMBER.surgeHP);u.m.hp=Math.max(1,u.m.hp-c);addNum(u,'-'+c,'#a0e0ff');u.chill=1;burst(u,['#a0e0ff','#ffffff'],12,40,0);
  _apply({...a,kind:'phys',pow:EMBER.surgePow,el:'fire',fx:'fire'});heat(EMBER.surgeHeat);return;}
 if(a.kind==='reignite'){const t=a.tg[0];B.ember-=EMBER.reignCost;if(t.m.hp<=0){t.m.hp=Math.floor(st(t.m).hp*0.3);t.atb=50;t.pend=0;addNum(t,'REIGNITED','#ffb040');}else{t.chill=0;t.atb=Math.min(99,t.atb+60);addNum(t,'THAWED','#ffb040');}
  burst(t,['#ff8020','#ffe060','#fff'],22,50,1);sfx('fire');return;}
 if(a.kind==='vent'){const v=Math.min(EMBER.ventMax,B.ember);B.ember-=v;B.stable=3;B.pt.forEach(p=>{if(p.m.hp>0){p.chill=0;const S=st(p.m),h=Math.min(S.hp-p.m.hp,Math.floor(S.hp*EMBER.ventHeal*v/EMBER.ventMax));if(h>0){p.m.hp+=h;addNum(p,h,'#7f7');}burst(p,['#ffd0a0','#fff'],8,40,1);}});
  addNum(u,'VENT -'+v,'#ffd0a0');sfx('heal');return;}
 if(a.kind==='gambit'){if(Math.random()<EMBER.gambitWin){_apply({...a,kind:'phys',pow:EMBER.gambitPow,fx:'slash'});const g=Math.max(5,Math.floor((a.tg[0].g||10)*0.5));G.gold+=g;addNum(u,'+'+g+'G','#ffe040');}
  else{const d=Math.floor(st(u.m).hp*EMBER.gambitBack);u.m.hp=Math.max(1,u.m.hp-d);addNum(u,'BACKFIRE','#ff8040');burst(u,['#ff6020','#444'],14,50,0);heat(15);sfx('no');}return;}
 if(a.kind==='art'){B.ember-=EMBER.max;B.shake=5;const id=u.m.id;
  if(id==='mira'){B.pt.forEach(p=>{const S=st(p.m);if(p.m.hp<=0){p.m.hp=Math.floor(S.hp*0.3);p.atb=0;p.pend=0;addNum(p,'REVIVED','#8f8');}else{const h=Math.min(S.hp-p.m.hp,Math.floor(S.hp*EMBER.art.miraHeal));p.m.hp+=h;addNum(p,h,'#7f7');}p.chill=0;burst(p,['#ffe080','#fff','#80ffa0'],16,50,1);});sfx('heal');return;}
  _apply({...a,kind:id==='lyra'?'mag':'phys',pow:EMBER.art[id],el:'fire',fx:'fire'});return;}
 const before=a.tg.map(t=>uhp(t));_apply(a);
 if(!B)return;const hit=a.tg.filter((t,i)=>uhp(t)<before[i]);
 if(u.side==='P'&&hit.length&&(a.kind==='phys'||a.kind==='mag')){let g=0;hit.forEach(t=>{if(a.el==='fire')g+=EMBER.fireHit;if(a.el&&t.weak===a.el)g+=EMBER.weakHit;});if(g)heat(g);}
 if(u.side==='E'&&hit.length){if(u.boss)heat(EMBER.bossHurt*hit.length);
  if(a.kind==='mag'&&(a.el==='dark'||a.fx==='dark'||u.hollow||classify(a)==='hollow'))hit.forEach(t=>{if(t.m.hp>0&&Math.random()<EMBER.chillP){t.chill=2;addNum(t,'CHILLED','#a0e0ff');}});
  hit.forEach(t=>{if(t.m&&t.m.hp<=0)heat(EMBER.koGain);});}};
// command list (game.js draws it through CMDLIST)
window.CMDLIST=u=>{const id=u.m.id,d=HERO_DEF[id],L=[{n:'Attack'},{n:d.skn},{n:'Item'},{n:'Defend'}];const q=UQ[id];
 if(q)L.push({n:q.n,ok:id==='lyra'?B.ember>=EMBER.reignCost:true,c:'#ffd0a0'});if(B.ember>=EMBER.max&&ART[id])L.push({n:'★'+ART[id].n,c:'#ffb040'});return L;};
const _updCmd=updCmd;
updCmd=function(dt){const m=B.menu;if(!m||m.k!=='cmd')return _updCmd(dt);const u=B.pt[B.act],L=CMDLIST(u),n=L.length;m.i=Math.min(m.i,n-1);
 if(held('up',dt)){m.i=(m.i+n-1)%n;sfx('move');}if(held('down',dt)){m.i=(m.i+1)%n;sfx('move');}
 if(!P.a)return;if(m.i<4){const keep=m.i;const r=_updCmd(dt);return r;}
 const id=u.m.id,isArt=L[m.i].n[0]==='★';if(L[m.i].ok===false){sfx('no');return;}sfx('ok');
 const back={k:'cmd',i:m.i};
 if(isArt){const t=ART[id].tgt,act={kind:'art',fx:'fire',name:ART[id].n};if(t==='allP'){commit(act,alive(B.pt));return;}tgtFor(t,act,back);return;}
 const q=UQ[id];if(id==='kael')tgtFor('E',{kind:'surge',fx:'fire',name:'Shard Surge'},back);
 else if(id==='lyra')B.menu={k:'tgt',side:'P',i:Math.max(0,B.pt.findIndex(p=>p.m.hp<=0||p.chill)),act:{kind:'reignite',fx:'fire',name:'Reignite'},back,any:1,lock:1};
 else if(id==='mira')commit({kind:'vent',fx:'heal',name:'Vent Heat'},[u]);
 else if(id==='varraP')tgtFor('E',{kind:'gambit',fx:'slash',name:'Gambit'},back);};
// --- drawing: ember gauge, intent badges, chill ---
const _drawBattle=drawBattle;
drawBattle=function(){_drawBattle();if(!B||B.swirl>0)return;const by=152,e=B.ember||0,over=e>EMBER.overT;
 X.fillStyle='#000a';X.fillRect(2,by-12,98,10);const fl=over?0.6+0.4*Math.sin(T*12):1;
 X.fillStyle='#401808';X.fillRect(30,by-9,66,5);X.fillStyle=over?`rgba(255,60,30,${fl})`:e>=EMBER.max?'#ffb040':'#e06020';X.fillRect(30,by-9,66*Math.min(1,e/EMBER.cap),5);
 X.fillStyle='#fff8';X.fillRect(30+66*EMBER.max/EMBER.cap,by-10,1,7);X.fillStyle='#f448';X.fillRect(30+66*EMBER.overT/EMBER.cap,by-10,1,7);
 txt(over?'HEAT!':'EMBER',4,by-11,over?'#ff6040':e>=EMBER.max?'#ffd060':'#ffb080',6);
 B.en.forEach(u=>{if(!u.boss||u.hp<=0)return;const k=u.telK||(u.open?'open':null);if(!k)return;const I=INTENT[k],[x,y]=upos(u);
  const w=46,px=x+30,py=y-24+Math.sin(T*4)*1.5;X.fillStyle='#000c';X.fillRect(px-1,py-1,w+2,12);X.fillStyle=I.c;X.fillRect(px,py,w,10);txt(I.t,px+w/2,py+2,'#101010',7,'center');
  if(u.tel&&u.tel.tg&&u.tel.tg.length===1&&u.tel.tg[0].side==='P'&&k!=='open'){const[tx,ty]=upos(u.tel.tg[0]);X.fillStyle=I.c;X.beginPath();X.moveTo(tx+8,ty-10);X.lineTo(tx+16,ty-10);X.lineTo(tx+12,ty-4);X.fill();}});
 B.pt.forEach(p=>{if(p.chill&&p.m.hp>0){const[x,y]=upos(p);X.globalAlpha=0.35+0.15*Math.sin(T*5);X.fillStyle='#a0e0ff';X.fillRect(x-2,y,28,34);X.globalAlpha=1;txt('❄',x+12,y-6,'#cff',7,'center');}});};
window.EMBER=EMBER;window.COMBAT={heat,classify,varraGuest};
if(window.DBG)DBG.startBattle=startBattle;
