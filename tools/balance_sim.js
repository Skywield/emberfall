// Emberfall headless balance simulation.
// 1) node tools/extract.js   (needs `python3 -m http.server 8765` in the repo root) -> tools/data.json
// 2) node tools/balance_sim.js [data.json]  -> per-chapter natural level, gear, gold, random-battle cost and boss win rate.
// Model: the party walks each chapter's field + dungeon "naturally" (cross, go back to town once, explore the dungeon:
// ~3x(w+h) steps per map, an encounter every enc+4 steps), plus the chapter's sky fights; gold buys the best affordable
// shop weapon/armour for each hero plus a stock of the best healing item. The boss fight is a Monte-Carlo ATB sim
// using the game's own damage formulas with a simple sensible policy (Lyra hits weakness, Mira heals/revives, Kael hits).
const D=require(require('path').resolve(process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:__dirname+'/data.json'));const {EN,EQ,ITEMS,HERO_DEF,SK,SKYEN,maps,shops}=D;
const CH=[{c:1,maps:['world','cave'],boss:['boss'],shop:shops.c1,sky:[]},
 {c:2,maps:[],boss:null,shop:shops.c1,sky:['gloomray','roc','skiff','gloomray','roc','skiff','corsair']},
 {c:3,maps:['ashmarch','forge'],boss:['tyrant'],shop:shops.c3,sky:['wyvern','wyvern','stormbreaker']},
 {c:4,maps:['tundra','spire'],boss:['wyrm'],shop:shops.c4,sky:['wyvern','wyvern'],free:['tyrantfang','ashveil']},
 {c:5,maps:['mirewood','sanctum'],boss:['hydra'],shop:shops.c5,sky:['manta','manta','manta','tempest'],free:['wyrmscale','frostfur']},
 {c:6,maps:['gloam','bastion'],boss:['warden'],shop:shops.c6,sky:['leviathan','leviathan','leviathan','nightfall'],free:['hydrascale','sanctumveil']},
 {c:7,maps:['causeway','citadel'],boss:['seneschal'],shop:shops.c7,sky:['crownwing','crownwing','crownwing','seraph'],free:['wardenplate','veilcloak']},
 {c:8,maps:['stair','heartspire'],boss:['vorthane','vorthane2'],shop:shops.c8,sky:['heartwyrm'],free:['seneschalaegis','lastmantle','foundersveil','emberheart']}];
// Ember / unique-command / boss-telegraph model (combat.js). Constants are read from combat.js so the sim never drifts.
// --classic runs the old rules for comparison.
const EMB=(()=>{const src=require('fs').readFileSync(__dirname+'/../combat.js','utf8');return Function('return '+src.match(/const EMBER=(\{[\s\S]*?\}\});/)[1])();})();
const EM=!process.argv.includes('--classic');
const xpNext=lv=>Math.floor(18*Math.pow(lv,1.6));
const R=()=>Math.random();
function mk(id){const d=HERO_DEF[id];return {id,lv:1,xp:0,b:{hp:d.hp,mp:d.mp,atk:d.atk,def:d.def,mag:d.mag,spd:d.spd},w:d.w,a:'tunic'};}
function st(m){const e1=EQ[m.w]||{},e2=EQ[m.a]||{};return {hp:m.b.hp|0,mp:m.b.mp|0,atk:(m.b.atk+(e1.atk||0)+(e2.atk||0))|0,def:(m.b.def+(e1.def||0)+(e2.def||0))|0,
 mag:(m.b.mag+(e1.mag||0))|0,mdef:((m.b.def*0.6+m.b.mag*0.4)+(e2.mdef||0)+(e2.def||0)*0.5)|0,spd:m.b.spd|0};}
function gain(P,xp){P.forEach(m=>{m.xp+=xp;while(m.xp>=xpNext(m.lv)){m.xp-=xpNext(m.lv);m.lv++;const g=HERO_DEF[m.id].g;for(const k in g)m.b[k]+=g[k];}});}
const avg=a=>a.reduce((s,x)=>s+x,0)/(a.length||1);
function gearScore(k){const e=EQ[k];return (e.atk||0)+(e.mag||0)*1.2+(e.def||0)+(e.mdef||0)*0.8;}
function shop(S,stock,free){(free||[]).forEach(k=>{if(!EQ[k])return;const e=EQ[k];S.P.forEach(m=>{if(e.slot==='w'&&e.who!==m.id)return;const cur=e.slot==='w'?m.w:m.a;if(gearScore(k)>gearScore(cur)&&!(e.slot==='a'&&S.P.some(o=>o!==m&&o.a===k))){if(e.slot==='w')m.w=k;else m.a=k;}});});
 const eq=stock.filter(k=>EQ[k]).sort((a,b)=>EQ[b].p-EQ[a].p);
 for(const m of S.P){const w=eq.find(k=>EQ[k].slot==='w'&&EQ[k].who===m.id&&EQ[k].p<=S.gold&&gearScore(k)>gearScore(m.w));if(w){S.gold-=EQ[w].p;m.w=w;}}
 for(const m of S.P){const a=eq.find(k=>EQ[k].slot==='a'&&EQ[k].p<=S.gold&&gearScore(k)>gearScore(m.a));if(a){S.gold-=EQ[a].p;m.a=a;}}
 const heal=stock.filter(k=>ITEMS[k]&&ITEMS[k].heal&&ITEMS[k].heal<999).sort((a,b)=>ITEMS[b].heal-ITEMS[a].heal)[0];S.heal=heal;S.nheal=0;
 if(heal){const n=Math.min(6,Math.floor(S.gold*0.5/ITEMS[heal].p));S.nheal=n;S.gold-=n*ITEMS[heal].p;}}
// one ATB battle; returns {win,t,hpLeft}
function fight(P,keys,opt={}){const pt=P.map(m=>{const s=st(m);return {m,s,hp:opt.hp?opt.hp[m.id]:s.hp,mp:s.mp,atb:R()*40,buf:1};});
 let en=keys.map(k=>{const b=EM&&EN[k].boss?EMB.bossHP:1;return {...EN[k],k,hp:Math.round(EN[k].hp*b),mhp:Math.round(EN[k].hp*b),atb:R()*50,nb:0};});let ember=EM?(opt.boss?EMB.bossStory+12:0):0;const heat=v=>{ember=Math.min(EMB.cap,ember+v);if(ember>=EMB.cap){ember=60;pt.forEach(p=>{if(p.hp>0)p.hp=Math.max(1,p.hp-Math.floor(p.s.hp*EMB.blowDmg));});}};let items=opt.items||0;const heal=opt.heal?ITEMS[opt.heal].heal:0;let t=0;
 const al=a=>a.filter(u=>u.hp>0);
 while(t<900){t+=0.05;for(const u of [...al(pt),...al(en)]){u.atb+=((u.s?(u.chill?u.s.spd*0.4-3:u.s.spd):u.spd)+8)*0.05*3.2;if(u.atb<100)continue;u.atb=0;
   if(u.s){const E=al(en);if(!E.length)break;if(u.chill)u.chill--;if(EM&&ember>EMB.overT&&R()<EMB.overRisk)u.hp=Math.max(1,u.hp-Math.floor(u.s.hp*EMB.overBurn));if(!(EM&&emAct(u,pt,E)))act(u,pt,E);}else{const T=al(pt);if(!T.length)break;eact(u,T);}}
  if(!al(en).length)return {win:1,t,hp:Object.fromEntries(pt.map(u=>[u.m.id,u.hp])),frac:avg(pt.map(u=>u.hp/u.s.hp))};
  if(!al(pt).length)return {win:0,t,frac:0};}
 return {win:0,t,frac:0};
 function dmgP(u,e,pow,mag,el){if(EM&&el==='fire'&&e)heat(EMB.fireHit+(e.weak==='fire'?EMB.weakHit:0));if(EM&&e&&e.open)e=Object.assign({},e,{def:e.def*EMB.openDef});let d=mag?(u.s.mag*2.3-e.def*0.8)*pow:(u.s.atk*u.buf*2-e.def)*pow;if(!mag&&R()<0.08)d*=1.6;if(el){if(e.weak===el)d*=1.75;else if(e.res===el)d*=0.5;}return Math.max(1,Math.floor(d*(0.9+R()*0.2)));}
 function act(u,pt,E){const id=u.m.id,lv=u.m.lv,tgt=E.reduce((a,b)=>a.hp<b.hp?a:b),dead=pt.filter(p=>p.hp<=0),low=pt.filter(p=>p.hp>0&&p.hp<p.s.hp*0.5);
  const has=k=>!(SK[k].lv>lv)&&u.mp>=SK[k].mp;
  if(id==='mira'){if(dead.length&&has('rekindle')){u.mp-=14;dead[0].hp=Math.floor(dead[0].s.hp*0.4);dead[0].atb=0;return;}
   if(low.length>=2&&has('sanct')){u.mp-=12;pt.forEach(p=>{if(p.hp>0)p.hp=Math.min(p.s.hp,p.hp+Math.floor((u.s.mag*2.4+12)*1.0));});return;}
   if(low.length&&has('mend')){u.mp-=5;const p=low[0];p.hp=Math.min(p.s.hp,p.hp+Math.floor((u.s.mag*2.4+12)*1.7));return;}
   if(low.length&&items>0){items--;low[0].hp=Math.min(low[0].s.hp,low[0].hp+heal);return;}}
  if(id!=='mira'&&dead.length&&items>0&&opt.boss&&low.length===0){} 
  if(id==='kael'){if(opt.boss&&low.length&&items>0&&R()<0.5){items--;low[0].hp=Math.min(low[0].s.hp,low[0].hp+heal);return;}
   if(E.length>=2&&has('cleave')){u.mp-=6;E.forEach(e=>e.hp-=dmgP(u,e,0.8));return;}if(opt.boss&&has('rising')){u.mp-=9;tgt.hp-=dmgP(u,tgt,2.1);return;}tgt.hp-=dmgP(u,tgt,1);return;}
  if(id==='lyra'){if(E.length>=2&&has('storm')){u.mp-=12;E.forEach(e=>e.hp-=dmgP(u,e,1,1,'bolt'));return;}
   const opts=['ember','frost','storm'].filter(has).map(k=>({k,v:SK[k].pow*(tgt.weak===SK[k].el?1.75:tgt.res===SK[k].el?0.5:1)})).sort((a,b)=>b.v-a.v);
   if(opts.length&&(opt.boss||E.length===1)){const k=opts[0].k;u.mp-=SK[k].mp;tgt.hp-=dmgP(u,tgt,SK[k].pow,1,SK[k].el);return;}}
  tgt.hp-=dmgP(u,tgt,1);}
 function emAct(u,pt,E){const id=u.m.id,tgt=E.reduce((a,b)=>a.hp<b.hp?a:b),dead=pt.filter(p=>p.hp<=0),low=pt.filter(p=>p.hp>0&&p.hp<p.s.hp*0.5);
  if(ember>=EMB.max){if(id==='mira'&&(dead.length||low.length>=2)){ember-=EMB.max;pt.forEach(p=>{if(p.hp<=0){p.hp=Math.floor(p.s.hp*0.3);p.atb=0;}else p.hp=Math.min(p.s.hp,p.hp+Math.floor(p.s.hp*EMB.art.miraHeal));p.chill=0;});return 1;}
   if(id==='kael'){ember-=EMB.max;tgt.hp-=dmgP(u,tgt,EMB.art.kael,0,'fire');return 1;}if(id==='lyra'){ember-=EMB.max;E.forEach(e=>e.hp-=dmgP(u,e,EMB.art.lyra,1,'fire'));return 1;}}
  if(id==='mira'&&ember>EMB.overT-10){const v=Math.min(EMB.ventMax,ember);ember-=v;pt.forEach(p=>{if(p.hp>0){p.chill=0;p.hp=Math.min(p.s.hp,p.hp+Math.floor(p.s.hp*EMB.ventHeal*v/EMB.ventMax));}});return 1;}
  if(id==='lyra'&&dead.length&&ember>=EMB.reignCost&&!pt.some(p=>p.m.id==='mira'&&p.hp>0&&p.mp>=14)){ember-=EMB.reignCost;dead[0].hp=Math.floor(dead[0].s.hp*0.3);dead[0].atb=50;return 1;}
  if(id==='kael'&&opt.boss&&u.hp>u.s.hp*0.6&&R()<0.5){u.hp-=Math.floor(u.s.hp*EMB.surgeHP);u.chill=1;tgt.hp-=dmgP(u,tgt,EMB.surgePow,0,'fire');heat(EMB.surgeHeat-EMB.fireHit);return 1;}
  return 0;}
 function eact(e,T){if(EM&&e.open){e.open=0;}if(EM&&e.boss){e.nb++;if(e.nb%EMB.openEvery===0){e.open=1;return;}}const t=T[R()*T.length|0];const ph=e.boss&&e.hp<e.mhp*0.5;if(ph&&!e.howl){e.howl=1;e.atk=Math.round(e.atk*1.25);e.mag=Math.round(e.mag*1.15);return;}
  const hit=(p,pow,mag)=>{let d=mag?(e.mag*2.3-p.s.mdef*0.8)*pow:(e.atk*2-p.s.def)*pow;p.hp=Math.max(0,p.hp-Math.max(1,Math.floor(d*(0.9+R()*0.2))));};
  if(e.boss){const r=R();if(EM)heat(EMB.bossHurt);if(r<(ph?0.35:0.3)){T.forEach(p=>{hit(p,ph?1.2:0.95,1);if(EM&&R()<EMB.chillP)p.chill=2;});}else if(r<0.7){hit(t,EM&&R()<0.3?0.8:1.6);}else hit(t,1);if(EM)T.forEach(p=>{if(p.hp<=0&&!p.koed){p.koed=1;heat(EMB.koGain);}});return;}
  if(e.caster&&R()<0.6)hit(t,1.1,1);else hit(t,1);}}
function run(label){const S={P:['kael','lyra','mira'].map(mk),gold:120};const out=[];
 for(const ch of CH){let nb=0,xp=0,g=0,hpCost=[],deaths=0;
  for(const mk2 of ch.maps){const m=maps[mk2];if(!m.enc)continue;const n=Math.round(3*(m.w+m.h)/(m.enc+4));const dun=m.enc<20;
   for(let i=0;i<n;i++){const grp=m.pool[R()*m.pool.length|0];const r=fight(S.P,grp);hpCost.push(1-r.frac);if(!r.win)deaths++;const x=grp.reduce((s,k)=>s+EN[k].xp,0);gain(S.P,x);xp+=x;const gg=grp.reduce((s,k)=>s+EN[k].g,0);S.gold+=gg;g+=gg;nb++;}
   if(!dun)shop(S,ch.shop,ch.free);}
  for(const k of ch.sky){gain(S.P,SKYEN[k].xp);S.gold+=SKYEN[k].g;xp+=SKYEN[k].xp;g+=SKYEN[k].g;}
  shop(S,ch.shop,ch.free);
  let win=null,tt=0,left=0;if(ch.boss){let W=0;const N=300;for(let i=0;i<N;i++){let hp=null,ok=1,T=0;for(const b of ch.boss){const r=fight(S.P,[b],{boss:1,hp,items:S.nheal,heal:S.heal});T+=r.t;if(!r.win){ok=0;break;}hp=r.hp;left=r.frac;}W+=ok;tt+=T;}win=W/N;tt/=N;
   for(const b of ch.boss){gain(S.P,EN[b].xp);S.gold+=EN[b].g;}}
  out.push({ch:ch.c,battles:nb,lv:S.P.map(m=>m.lv).join('/'),gear:S.P.map(m=>m.w+'+'+m.a).join(' '),gold:S.gold,hpCostPerFight:(avg(hpCost)*100).toFixed(0)+'%',fieldLoss:deaths,boss:ch.boss?ch.boss.join('+'):'(sky)',bossHP:ch.boss?ch.boss.map(b=>EN[b].hp).join('+'):'',winRate:win==null?'-':(win*100).toFixed(0)+'%',fightSec:tt.toFixed(0)});}
 return out;}
const res=[];for(let i=0;i<5;i++)res.push(run());
const rows=res[0].map((r,i)=>({...r,winRate:res.map(x=>x[i].winRate).join(' ')}));
console.table(rows.map(r=>({ch:r.ch,battles:r.battles,lv:r.lv,gold:r.gold,hpCost:r.hpCostPerFight,fieldLoss:r.fieldLoss,boss:r.boss,bossHP:r.bossHP,winRate:r.winRate,secs:r.fightSec})));
if(process.argv.includes('--gear'))rows.forEach(r=>console.log(r.ch,r.gear));
module.exports={run};
// optional superboss check: node tools/balance_sim.js --super
if(process.argv.includes('--super')&&EN.cindral){
 const lvUp=(lv,gear)=>{const P=['kael','lyra','mira'].map(mk);gain(P,0);P.forEach(m=>{while(m.lv<lv){gain([m],xpNext(m.lv)-m.xp);}m.w=gear[m.id][0];m.a=gear[m.id][1];});return P;};
 const tries=(P,k,heal)=>{let w=0;for(let i=0;i<300;i++)w+=fight(P,[k],{boss:1,items:6,heal}).win;return (w/3).toFixed(0)+'%';};
 const g8={kael:['heirloom','sunmail'],lyra:['starkindle','foundersveil'],mira:['keeperscrook','seneschalaegis']};
 const gP={kael:['dawnthorn','shadeveil'],lyra:['sunrod','foundersveil'],mira:['stormcrown','sunmail']};
 for(const lv of [34,40,46])console.log('Cindral  lv',lv,tries(lvUp(lv,g8),'cindral','crownsalve'));
 for(const lv of [45,52,60])console.log('Omen     lv',lv,tries(lvUp(lv,{kael:['emberheart','foundersveil'],lyra:['sunrod','sunmail'],mira:['stormcrown','seneschalaegis']}),'omen','heartdraught'));}
// optional-content check (expansion.js): node tools/balance_sim.js --optional
// Each optional boss at the level/gear the party naturally has when its dungeon (or cup) unlocks, and a couple above.
if(process.argv.includes('--optional')&&EN.colossus){
 const lvUp=(lv,gear)=>{const P=['kael','lyra','mira'].map(mk);P.forEach(m=>{while(m.lv<lv){gain([m],xpNext(m.lv)-m.xp);}m.w=gear[m.id][0];m.a=gear[m.id][1];});return P;};
 const tries=(P,k,heal)=>{let w=0,t=0;for(let i=0;i<300;i++){const r=fight(P,[k],{boss:1,items:6,heal});w+=r.win;t+=r.t;}return (w/3).toFixed(0)+'% ('+(t/300).toFixed(0)+'s)';};
 const G4={kael:['sunbrand','rimemail'],lyra:['stormrod','frostfur'],mira:['auroramace','rimemail']},G5={kael:['tidecleaver','hydrascale'],lyra:['verdantrod','sanctumveil'],mira:['coralmace','mossmail']},
  G6={kael:['dawnbrand','wardenplate'],lyra:['eclipserod','veilcloak'],mira:['lunarmace','gloammail']},G7={kael:['sunderblade','seneschalaegis'],lyra:['crownrod','lastmantle'],mira:['seraphmace','throneplate']};
 for(const[k,g,h,lvs]of[['colossus',G4,'xpotion',[16,17,19]],['sentinel',G5,'mdraught',[22,23,25]],['lqueen',G6,'dusktonic',[27,29,31]],['vasska',G7,'crownsalve',[31,33,35]],['seer',G7,'crownsalve',[35,37,39]]])
  console.log(k.padEnd(9),lvs.map(lv=>'lv'+lv+' '+tries(lvUp(lv,g),k,h)).join('   '));}
