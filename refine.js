'use strict';
// Emberfall — review polish (Nov 2026 review, 7.2/10). Loaded last. Four areas:
//  1. Gold sinks: Ember Temper at every smith (tiered gold + Ember Ore, capped by chapter so Chapter 1 is untouched),
//     two new Cinderwing hull tiers, Colosseum entry fees, and a premium Champion's Exchange (permanent stat seeds).
//  2. Encounter pacing: a step-based grace period after every fight and on entering a map, then a smoothly rising
//     chance tuned so each area keeps its old average rate; plus chests, travellers, campfires, wayshrines and
//     signposts across the Emberlands ground world, and a cartographer who pays for discoveries.
//  3. Party choice: pick who leads at New Game (each lead has a style), change it any time from MENU > Party.
//     The lead walks in front (Kael follows when he isn't leading) and acts first in battle. Story scenes are unchanged.
//  4. Accessibility: Text size (Large), High contrast, and a Shake & flash toggle in Settings.
// Old saves load as before: every new field is created lazily (G.forge, G.lead, discovery flags).
(function(){
// ======================================================================================================
// shared helpers
// ======================================================================================================
const O=OPT;['tsize','hc','calm'].forEach(k=>{if(O[k]==null)O[k]=0;});
const chap=()=>{const c=G?chapterOf(G):1;return c==='Clear'?9:c;};
const say=(s,t=3.5)=>{try{TOAST={s,t};}catch(e){}};
// ======================================================================================================
// 4. ACCESSIBILITY — text size, high contrast, shake & flash
// ======================================================================================================
const HCC={};
function hcCol(c){if(HCC[c])return HCC[c];const m=/^#([0-9a-f]{3,8})$/i.exec(c||'');if(!m)return HCC[c]=c;const h=m[1];let r,g,b;
 if(h.length<=4){r=parseInt(h[0]+h[0],16);g=parseInt(h[1]+h[1],16);b=parseInt(h[2]+h[2],16);}else{r=parseInt(h.slice(0,2),16);g=parseInt(h.slice(2,4),16);b=parseInt(h.slice(4,6),16);}
 const L=(0.299*r+0.587*g+0.114*b)/255,t=L<0.72?0.6:0.2;const f=v=>Math.round(v+(255-v)*t).toString(16).padStart(2,'0');return HCC[c]='#'+f(r)+f(g)+f(b);}
const _txt=txt;
txt=function(s,x,y,c='#fff',sz=8,al='left'){if(O.tsize&&sz<8)sz+=1;if(!O.hc)return _txt(s,x,y,c,sz,al);
 X.font=`bold ${sz}px "Courier New",monospace`;X.textAlign=al;X.textBaseline='top';X.fillStyle='#000';
 X.fillText(s,x-0.7,y);X.fillText(s,x+0.7,y);X.fillText(s,x,y-0.7);X.fillText(s,x,y+0.7);X.fillStyle=hcCol(c);X.fillText(s,x,y);};
const _win=win;
win=function(x,y,w,h){if(!O.hc)return _win(x,y,w,h);X.fillStyle='#000';X.fillRect(x,y,w,h);X.fillStyle='#fff';X.fillRect(x,y,w,1);X.fillRect(x,y+h-1,w,1);X.fillRect(x,y,1,h);X.fillRect(x+w-1,y,1,h);
 X.fillStyle='#ffd860';X.fillRect(x+2,y+2,w-4,0.5);};
const _drawDlg=drawDlg;
drawDlg=function(u){if(!O.tsize)return _drawDlg(u);const L=u.lines[u.i]||'';let who='',t=L;const m=L.match(/^([^:]{2,20}): (.*)$/);if(m){who=m[1];t=m[2];}
 if(wrap(t,40).length>(who?4:5))return _drawDlg(u);   // a very long line keeps the regular size so nothing spills out of the box
 win(6,H-62,W-12,56);let y=H-57;if(who){txt(who,14,y,'#ffd860',8);y+=10;}const vis=t.slice(0,Math.floor(u.ch));wrap(vis,40).forEach((l,i)=>txt(l,13,y+i*10,'#fff',9));
 if(u.ch>=L.length&&Math.sin(T*8)>0){X.fillStyle='#fff';X.fillRect(W-20,H-12,5,3);X.fillRect(W-19,H-9,3,1);}};
function calmB(){if(!O.calm||!B)return;B.shake=0;if(B.swirl>0.6)B.swirl=0.6;for(const u of [...(B.en||[]),...(B.pt||[])])if(u.flash)u.flash=0;}
const _drawBattleR=drawBattle;drawBattle=function(){calmB();return _drawBattleR();};
if(XSCN.skybattle){const d0=XSCN.skybattle.d;XSCN.skybattle.d=function(...a){try{if(O.calm&&SB){SB.shake=0;}}catch(e){}return d0.apply(this,a);};}
// settings rows (added after Controls so the existing row order is unchanged)
const AROWS=['Text size','High contrast','Shake & flash'];
SROWS.splice(SROWS.indexOf('Back'),0,...AROWS);
const su0=XUI.settings.u;
XUI.settings.u=(u,dt)=>{const r=SROWS[u.i];if(!AROWS.includes(r))return su0(u,dt);const n=SROWS.length;
 if(held('up',dt)){u.i=(u.i+n-1)%n;sfx('move');return;}if(held('down',dt)){u.i=(u.i+1)%n;sfx('move');return;}
 if(P.b||P.menu){UI.pop();sfx('no');return;}const d=held('right',dt)||held('left',dt)||P.a;if(!d)return;
 if(r==='Text size')O.tsize^=1;else if(r==='High contrast')O.hc^=1;else O.calm^=1;saveOpt();sfx('move');};
XUI.settings.d=u=>{X.fillStyle='#000b';X.fillRect(0,0,W,H);win(16,8,W-32,20);txt('SETTINGS',W/2,14,'#ffd860',8,'center');win(16,30,W-32,154);
 const val={'Music':VOLTXT[AOPT.mus],'Sound FX':VOLTXT[AOPT.sfx],'Text speed':TEXTSP[OPT.text][0],'Battle speed':'●'.repeat(OPT.bspd+1)+'○'.repeat(4-OPT.bspd),
  'ATB mode':ATBM[OPT.atb],'Fullscreen':OPT.fs?'On':'Off','Controls':isTouch&&!GP.name?'Keyboard / pad':'Remap ▸','Text size':O.tsize?'Large':'Normal',
  'High contrast':O.hc?'On':'Off','Shake & flash':O.calm?'Reduced':'On','Back':''};
 SROWS.forEach((r,i)=>{const y=36+i*13;if(r==='Text size'){X.fillStyle='#ffffff30';X.fillRect(24,y-3,W-48,1);}txt(r,36,y,AROWS.includes(r)?'#ffe0a0':'#fff',8);txt(val[r],W-30,y,'#9cf',8,'right');if(i===u.i)cursor(24,y);});
 const help={'ATB mode':['Active: gauges never stop.','Classic: they pause while you pick a skill, item or target.','Wait: they pause whenever a command menu is open.'][OPT.atb],
  'Battle speed':'How fast gauges fill and attacks play out.','Text speed':'How fast dialogue types out.','Fullscreen':'Toggle fullscreen (F11 also works on desktop).','Controls':'Remap keyboard keys and gamepad buttons.',
  'Text size':'Large: bigger dialogue text and no tiny labels.','High contrast':'Solid black panels, outlined text, brighter colours.',
  'Shake & flash':'Reduced: no screen shake, hit flashes or white battle flash.'}[SROWS[u.i]]||'Left/Right or A to change.  B: back';
 win(16,188,W-32,30);wrap(help,40).slice(0,2).forEach((l,i)=>txt(l,24,193+i*10,'#cde',7));};

// ======================================================================================================
// 3. PARTY CHOICE — the lead and their style
// ======================================================================================================
const LEADS={
 kael:{st:'Vanguard',d:'Kael leads. Kael +6% ATK and DEF, and he acts first.',kit:{potion:4,ether:1},kt:'4 Potions, 1 Ether'},
 lyra:{st:'Arcane',d:'Lyra leads. Lyra +6% MAG and +15% MP; fights open with +10 Ember.',kit:{potion:2,ether:2},kt:'2 Potions, 2 Ethers'},
 mira:{st:'Hearth',d:'Mira leads. Mira +6% MAG and the whole party +5% max HP.',kit:{potion:2,bloom:1},kt:'2 Potions, 1 Lifebloom'}};
const LORDER=['kael','lyra','mira'];
const LEADID=()=>{const l=G&&G.lead;return l&&LEADS[l]&&SPR[l]&&G.party&&G.party.some(m=>m.id===l)?l:'kael';};
window.LEADID=LEADID;
// stats: lead style + Ember Temper (section 1)
const TW=[0,2,5,8,12,16],TWM=[0,2,4,7,10,13],TA=[0,2,4,7,10,13];
const _st=st;
st=function(m){const s=_st(m);if(!G||!m)return s;const t=G.forge&&G.forge.t&&G.forge.t[m.id];
 if(t){const w=t.w|0,a=t.a|0;s.atk+=TW[w];if(HERO_DEF[m.id]&&HERO_DEF[m.id].mag>=10)s.mag+=TWM[w];s.def+=TA[a];s.mdef+=TA[a];}
 const L=LEADID();if(m.id===L){if(L==='kael'){s.atk=Math.round(s.atk*1.06);s.def=Math.round(s.def*1.06);}else if(L==='lyra'){s.mag=Math.round(s.mag*1.06);s.mp=Math.round(s.mp*1.15);}else if(L==='mira')s.mag=Math.round(s.mag*1.06);}
 if(L==='mira'&&G.party&&G.party.includes(m))s.hp=Math.round(s.hp*1.05);return s;};
function clampParty(){G.party.forEach(m=>{const s=st(m);m.hp=Math.min(m.hp,s.hp);m.mp=Math.min(m.mp,s.mp);});}
function setLead(k,newGame){G.lead=k;if(newGame&&!G.flags._kit){G.flags._kit=1;delete G.items.potion;delete G.items.ether;Object.assign(G.items,LEADS[k].kit);
  G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});}else clampParty();}
XUI.leadpick={u(u,dt){const n=3;if(held('left',dt)||held('up',dt)){u.i=(u.i+n-1)%n;sfx('move');}if(held('right',dt)||held('down',dt)){u.i=(u.i+1)%n;sfx('move');}
  if(P.a){sfx('ok');UI.pop();const k=LORDER[u.i];setLead(k,u.newg);if(u.newg){transition(_startTown);return;}toast(G.party.find(m=>m.id===k).name+' now leads the party ('+LEADS[k].st+').');return;}
  if(P.b||P.menu){sfx('no');UI.pop();if(u.newg){setLead(LEADID(),1);transition(_startTown);}}},
 d(u){X.fillStyle=u.newg?'#05030c':'#05030ce8';X.fillRect(0,0,W,H);if(u.newg)drawEmbers();win(8,6,W-16,22);txt(u.newg?'WHO LEADS THE PARTY?':'PARTY — choose the lead',W/2,13,'#ffd860',8,'center');
  LORDER.forEach((k,i)=>{const cx=44+i*84,sel=i===u.i;if(sel){X.fillStyle='rgba(255,176,64,0.18)';X.fillRect(cx-38,32,76,112);X.fillStyle='#ffb040';X.fillRect(cx-38,143,76,1);}
   const bob=sel?Math.sin(T*4)*1.5:0;if(!drawPaint(k,cx,118+bob,{sc:1.45,alpha:sel?1:0.55}))X.drawImage(SPR[k].down[0],cx-12,70,24,32);
   const m=G.party.find(p=>p.id===k);txt(m?m.name:HERO_DEF[k].name,cx,122,sel?'#fff':'#aab',8,'center');txt(LEADS[k].st,cx,132,sel?'#ffd860':'#889',7,'center');
   if(!u.newg&&k===LEADID())txt('★ lead',cx,36,'#ffd860',6,'center');});
  const L=LEADS[LORDER[u.i]];win(8,150,W-16,u.newg?50:40);wrap(L.d,44).forEach((l,i)=>txt(l,14,155+i*10,'#fff',7));
  if(u.newg)txt('Starting pack: '+L.kt,14,178,'#9cf',7);txt(u.newg?'◀ ▶ choose   A: confirm   (change later: MENU > Party)':'◀ ▶ choose   A: set lead   B: back',W/2,u.newg?189:180,'#bbd',6,'center');
  if(!u.newg)txt('The lead walks in front, acts first and adds their style.',W/2,204,'#c8a8c8',6,'center');}};
// New Game: the lead is chosen on its own screen between the intro and Thornwick, so the
// opening dialogue and any A-presses that skip the intro still land on the picker first.
XSCN.leadsel={u(){if(!UI.length)transition(_startTown);},d(){X.fillStyle='#05030c';X.fillRect(0,0,W,H);drawEmbers();},mus:()=>'town'};
const _startTown=startTown;startTown=function(){if(!G.lead){scene='leadsel';UI.length=0;UI.push({k:'leadpick',i:0,newg:1});return;}_startTown();};
{const i=MOPTS.indexOf('Quests');MOPTS.splice(i<0?MOPTS.indexOf('Settings'):i,0,'Party');}
const _updMenuR=updMenu;updMenu=function(u,dt){if(!u.sub&&P.a&&MOPTS[u.i]==='Party'){sfx('ok');UI.push({k:'leadpick',i:Math.max(0,LORDER.indexOf(LEADID())),newg:0});return;}return _updMenuR(u,dt);};
// the lead acts first; Arcane opens with heat
const _startBattleR=startBattle;
startBattle=function(grp,cave,boss){if(G)G.steps=0;_startBattleR(grp,cave,boss);if(!B||!G)return;const L=LEADID();const p=B.pt.find(q=>q.m&&q.m.id===L);if(p)p.atb=Math.min(95,(p.atb||0)+35);
 if(L==='lyra'&&B.ember!=null)B.ember=Math.min(EMBER.max-1,B.ember+10);};
window.startBattle=startBattle;if(window.DBG)DBG.startBattle=startBattle;
// Kael follows one step behind when someone else leads (so his story flickers still show)
let TR=null;const dirOf=(ax,ay,bx,by)=>bx>ax?'right':bx<ax?'left':by>ay?'down':by<ay?'up':null;
const _updFieldR=updField;
updField=function(dt){const m0=G.map,x0=G.x,y0=G.y;
 if(P.a&&!F.mv&&chestHook())return;
 _updFieldR(dt);
 if(!TR||TR.m!==G.map){TR={m:G.map,x:G.x,y:G.y,px:G.x,py:G.y,d:G.d};return;}
 if(G.x!==x0||G.y!==y0){if(G.map===m0&&Math.abs(G.x-x0)+Math.abs(G.y-y0)===1){TR.px=TR.x;TR.py=TR.y;TR.x=x0;TR.y=y0;TR.d=dirOf(TR.px,TR.py,x0,y0)||G.d;}else TR={m:G.map,x:G.x,y:G.y,px:G.x,py:G.y,d:G.d};}};
XFENTS.push((ents,cx,cy)=>{if(LEADID()==='kael'||!TR||TR.m!==G.map||G.flags.aboard||!SPR.kael)return;const t=F.mv>0?F.mv:0;
 const fx=TR.x-(TR.x-TR.px)*t,fy=TR.y-(TR.y-TR.py)*t;if(Math.abs(fx-G.x)<0.05&&Math.abs(fy-G.y)<0.05)return;
 const fr=F.mv>0?(1+(Math.floor(F.anim*8)%2)):0,set=SPR.kael[TR.d]||SPR.kael.down;ents.push({y:fy*16-0.1,dr:()=>fspr(set[fr]||set[0],fx*16-cx+2,fy*16-cy-2)});});

// ======================================================================================================
// 2. ENCOUNTER PACING
// ======================================================================================================
// Old rule: after 4 steps, every step had a flat 1/enc chance (fights could come back-to-back, or not for 100 steps).
// New rule: no fight for `grace` steps (40% of enc, at least 5) after a battle, then a chance rising linearly per step.
// R is chosen so the mean distance between fights is still ~enc (same EXP / gold flow), with a firm cap at the end.
function encCfg(M){const e=M.enc,g=M.grace!=null?M.grace:Math.max(5,Math.round(e*0.4)),R=2*Math.pow(Math.max(2,e+4-g),2)/Math.PI;return {g,R,cap:g+Math.ceil(3*Math.sqrt(R))};}
function encChance(M,steps){if(!M||!M.enc)return 0;const c=encCfg(M);if(steps<=c.g)return 0;if(steps>=c.cap)return 1;return Math.min(1,(steps-c.g)/c.R);}
const _arrivedR=arrived;
arrived=function(){const M=MAPS[G.map];if(!M||!M.enc||G.flags.aboard)return _arrivedR();const e=M.enc,m0=G.map,x0=G.x,y0=G.y;let r;M.enc=0;try{r=_arrivedR();}finally{M.enc=e;}
 if(scene!=='map'||UI.length||fadeDir||G.map!==m0||G.x!==x0||G.y!==y0||G.flags.noenc)return r;
 if(Math.random()<encChance(M,G.steps)){G.steps=0;const grp=M.pool[Math.random()*M.pool.length|0];startBattle(grp,M.bbg||G.map==='cave');}return r;};
const _enterMapR=enterMap;
enterMap=function(name,x,y,d){const was=G&&G.map;const r=_enterMapR(name,x,y,d);const M=MAPS[name];
 if(G&&M&&M.enc&&was!==name)G.steps=Math.min(G.steps|0,Math.max(0,encCfg(M).g-4));   // a few calm steps after entering an area
 if(name==='ground')stampChests();return r;};
if(window.DBG)DBG.enterMap=enterMap;

// ======================================================================================================
// 2b. EMBERLANDS DENSITY — chests, travellers, campfires, wayshrines, signposts
// ======================================================================================================
function poiCanvas(kind){const c=document.createElement('canvas');c.width=48;c.height=64;const g=c.getContext('2d');const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
 const E=(x,y,rx,ry,col)=>{g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();};
 if(kind==='sign'){E(24,60,14,3,'#00000055');R(20,26,8,36,'#3a2410');R(21,26,4,36,'#7a5028');R(2,10,44,22,'#2a1808');R(4,12,40,18,'#9a6634');R(4,12,40,4,'#c08a4a');
  for(let i=0;i<3;i++)R(9,19+i*4,30-i*8,2,'#4a2c12');R(40,14,2,2,'#2a1808');R(6,14,2,2,'#2a1808');}
 else if(kind==='camp'){E(24,56,22,8,'#00000055');E(24,54,17,6,'#2a1a12');[[4,52],[12,58],[24,60],[36,58],[42,52],[10,46],[38,46],[24,44]].forEach(([x,y])=>{E(x,y,5,4,'#4e4a56');E(x-1,y-1,3,2,'#8e8a98');});
  g.save();g.translate(24,52);g.rotate(0.5);R(-12,-3,24,6,'#6a3a18');R(-12,-3,24,2,'#9a5a28');g.rotate(-1.0);R(-12,-3,24,6,'#5a3214');R(-12,-3,24,2,'#8a5022');g.restore();E(24,52,6,3,'#ff7a20');E(24,51,3,2,'#ffd070');}
 else if(kind==='shrine'){E(24,60,18,4,'#00000055');R(8,52,32,10,'#3e3a46');R(8,52,32,2,'#6a6676');R(13,8,22,46,'#56525f');R(15,4,18,6,'#56525f');R(17,2,14,4,'#66626f');
  R(14,10,5,42,'#77738a');R(31,10,3,42,'#3a3644');R(20,18,8,16,'#2a1810');R(21,20,6,12,'#ff8a20');R(22,23,4,6,'#ffd060');R(23,25,2,2,'#fff0c0');R(17,40,14,2,'#3a3644');R(17,45,14,2,'#3a3644');}
 return c;}
['sign','camp','shrine'].forEach(k=>{const c=poiCanvas(k),f=[c,c,c];SPR['poi_'+k]={down:f,up:f,left:f,right:f,side:f};if(typeof FPAINT!=='undefined')FPAINT['poi_'+k]={down:c};});   // 48x64 hi-res art, like field.js paints
const BANTER={
 kael:[['Kael: Sit. Eat. We move at first light.','Mira: Is that an order, or are you worried about us?','Kael: ...Both.'],['Kael: The shards are heavier than they look.','Lyra: That\'s the Hollow pressing back. Fascinating.','Kael: Less fascinating when it\'s in your pack.']],
 lyra:[['Lyra: Every shard hums at a different pitch. I\'ve started writing them down.','Kael: You\'re studying it. Out here.','Lyra: Someone should understand what we\'re carrying.'],['Lyra: The frozen towns didn\'t just lose warmth. They lost songs. Colours. Names.','Mira: Then we give them back. One fire at a time.']],
 mira:[['Mira: Hold still, Kael. That cut is older than you said.','Kael: It\'s nothing.','Mira: Everything is nothing to you until it isn\'t.'],['Mira: We could stay a day in the next town. Help them now, not later.','Kael: And let the Hollow have that day?','Lyra: ...We\'ll talk about it in the morning.']]};
const mk=(id,kind,x,y,o)=>Object.assign({id,kind,x,y},o);
const GPOI=[
 mk('sign_thorn','sign',20,39,{lines:['Signpost: ↑ Thornwick Village   ← Ashen Vale trail','Signpost: East: the Thorn bridge to the open Emberlands (after the rockslide clears).']}),
 mk('sign_vale','sign',26,29,{lines:['Signpost: North: the Whitesand Flats.   East: Thorn river bridge.   South: Galewright Point.','(Someone has scratched underneath: "slimes hate fire".)']}),
 mk('camp_nw','camp',16,20,{}),mk('camp_sw','camp',14,62,{}),mk('camp_center','camp',50,27,{}),mk('camp_south','camp',46,58,{}),mk('camp_east','camp',76,14,{}),
 mk('shrine_nw','shrine',20,8,{lore:['An old wayshrine. The ember carved into it is cold — but the stone remembers it.','Lyra: These marked the Crown\'s roads. Each one held a little of its fire.'],gift:{ore:2}}),
 mk('shrine_desert','shrine',56,22,{lore:['A wayshrine half-buried in sand. Names are carved round its base — most of them frosted over.','Mira: The Hollow takes even this. Who they were.'],gift:{g:400}}),
 mk('shrine_east','shrine',82,30,{lore:['A tall wayshrine faces the cliffs of the Verdance. Its ember-glyph still glows faintly.','Kael: Someone kept this one lit. Recently.'],gift:{ore:3}}),
 mk('peddler','npc',12,26,{s:'merch',act:()=>openShop({stock:['potion','ether','bloom','tonic'],n:'Pack of Moss the Peddler',who:'Moss'})}),
 mk('fisher','npc',24,64,{s:'tobin',lines:['Angler Wade: Galewright\'s quiet water is fine, but Saltmere\'s pier is where the big ones bite.','Angler Wade: Old Tobin there will teach you to cast. Tell him Wade sent you. He\'ll pretend not to know me.']}),
 mk('scout','npc',58,43,{s:'guard',lines:()=>G.flags.wyrm?['Scout Ilka: The gatehouse to Valorgate stands open now. Arena city, east of the ridge.','Scout Ilka: The Colosseum charges an entry fee these days. Worth every coin, they say.']:['Scout Ilka: That gatehouse to the east won\'t open for anyone. Not until the storm-wyrm in the north is dealt with.','Scout Ilka: Fights out here come in waves. You\'ll get a breather after each one — use it.']}),
 mk('hermit','npc',40,71,{s:'elder',lines:['Hermit Osk: Ember Ore. Little red stones that stay warm in the snow.','Hermit Osk: Any smith worth their anvil can temper a blade with it. Ask at the forge — press MENU at the counter.','Hermit Osk: The Hollow drops it sometimes, when it burns. So do old chests.']}),
 mk('cartog','npc',70,25,{s:'quill',act:()=>cartographer()}),
 mk('sign_coast','sign',86,50,{lines:['Signpost: South: Saltmere, the fishing village.   West: Cinderholt under the volcano.','(Painted below in fresh red: "SQUALL\'S GONE — FISH ARE BITING".)']})];
const GCHEST={'8,10':'tonic','10,56':'bloom','33,19':'ore:2','44,30':'g:250','36,64':'hipotion','64,68':'ore:2','87,66':'g:600','86,10':'megaether','44,16':'ore:3'};
MAPS.ground.chests=Object.assign(MAPS.ground.chests||{},GCHEST);
function stampChests(){if(G.map!=='ground')return;for(const k in GCHEST){if(G.flags['cground'+k])continue;const[a,b]=k.split(',').map(Number);setTile('ground',a,b,'c');}}
const opened=k=>!!G.flags['cground'+k];
function chestHook(){if(G.map!=='ground'||UI.length||scene!=='map')return false;const[a,b]=DIRS[G.d],tx=G.x+a,ty=G.y+b,k=tx+','+ty,c=GCHEST[k];
 if(!c||tileAt('ground',tx,ty)!=='c'||!/^(ore|g):/.test(c))return false;const[t,v]=c.split(':');setTile('ground',tx,ty,'o');G.flags['cground'+k]=1;sfx('coin');
 if(t==='ore'){FG().ore+=+v;toast('Found Ember Ore x'+v+'!');}else{G.gold+=+v;toast('Found '+v+' G!');}delete P.a;return true;}
function seen(id){G.flags['gp_'+id]=1;}
function discoveries(){let n=0;GPOI.forEach(p=>{if(G.flags['gp_'+p.id])n++;});for(const k in GCHEST)if(opened(k))n++;return {n,of:GPOI.length+Object.keys(GCHEST).length};}
function campfire(p){seen(p.id);const ready=!G.campT||(G.time-G.campT)>90;
 choice('A ring of stones and dry wood. Rest by the campfire?'+(ready?' (Restores some HP/MP and saves.)':' (The embers are still warm — you rested here recently.)'),['Rest','Move on'],i=>{if(i)return;
  if(!ready){save();return dialog(['You sit a while. (Game saved.)']);}
  G.campT=G.time;G.party.forEach(m=>{if(m.hp<=0)return;const s=st(m);m.hp=Math.min(s.hp,m.hp+Math.ceil(s.hp*0.35));m.mp=Math.min(s.mp,m.mp+Math.ceil(s.mp*0.35));});sfx('heal');save();
  const L=LEADID(),sets=BANTER[L],b=sets[(G.flags._camp=(G.flags._camp|0)+1)%sets.length];dialog(['The fire catches. For a little while, nobody talks about the Hollow.',...b,'(HP and MP partly restored. Game saved.)']);});}
function shrine(p){seen(p.id);if(G.flags['gs_'+p.id])return dialog(['The wayshrine is quiet. Its gift is already yours.']);G.flags['gs_'+p.id]=1;const g=p.gift,L=[...p.lore];
 if(g.ore){FG().ore+=g.ore;L.push('Tucked in the shrine\'s hollow: Ember Ore x'+g.ore+'!');}if(g.g){G.gold+=g.g;L.push('An old offering bowl holds '+g.g+' G.');}sfx('coin');dialog(L);}
function cartographer(){seen('cartog');const d=discoveries(),need=12;
 if(G.flags.cartPaid)return dialog(['Cartographer Quill: My map of the Emberlands is the best there is, thanks to you. '+d.n+'/'+d.of+' sights so far.']);
 if(d.n>=need){G.flags.cartPaid=1;G.gold+=800;FG().ore+=3;sfx('coin');return dialog(['Cartographer Quill: '+d.n+' sights! Campfires, shrines, the lot. That\'s a real map.','Cartographer Quill: Here — 800 G and some Ember Ore the miners left me.','Got 800 G and Ember Ore x3!']);}
 dialog(['Cartographer Quill: I\'m mapping every campfire, shrine, signpost and cache on the Emberlands.','Cartographer Quill: Find '+need+' and tell me about them. I pay well. ('+d.n+'/'+need+' so far — see MENU > Records.)']);}
NPCS.ground=(NPCS.ground||[]).concat(GPOI.map(p=>({x:p.x,y:p.y,d:'down',s:p.kind==='npc'?p.s:'poi_'+p.kind,poi:p.id,
 act:p.kind==='camp'?()=>campfire(p):p.kind==='shrine'?()=>shrine(p):p.act?()=>{seen(p.id);p.act();}:null,
 lines:()=>{seen(p.id);return typeof p.lines==='function'?p.lines():p.lines;}})));
// campfire flames + shrine glow
XFENTS.push((ents,cx,cy)=>{if(G.map!=='ground')return;for(const p of GPOI){if(p.kind!=='camp'&&p.kind!=='shrine')continue;const x=p.x*16-cx,y=p.y*16-cy;if(x<-16||y<-24||x>W+16||y>H+16)continue;
 ents.push({y:p.y*16+0.5,dr:()=>{if(p.kind==='camp'){for(let i=0;i<6;i++){const ph=(T*2.2+i/6)%1,fx=x+8+Math.sin(i*2.1+T*5)*2.5*(1-ph),fy=y+12-ph*12;X.globalAlpha=1-ph;X.fillStyle=ph<0.35?'#fff0a0':ph<0.7?'#ffa030':'#d03a10';X.fillRect(fx-1,fy,2,2);}X.globalAlpha=1;
   if(!O.calm){X.globalAlpha=0.12+0.05*Math.sin(T*9);X.fillStyle='#ff9040';X.beginPath();X.arc(x+8,y+10,10,0,7);X.fill();X.globalAlpha=1;}}
  else if(!G.flags['gs_'+p.id]){X.globalAlpha=0.35+0.25*Math.sin(T*3);X.fillStyle='#ffb040';X.fillRect(x+7,y+0,2,2);X.globalAlpha=1;}}});}});

// ======================================================================================================
// 1. GOLD SINKS
// ======================================================================================================
function FG(){if(!G.forge)G.forge={ore:0,t:{}};if(!G.forge.t)G.forge.t={};return G.forge;}
const TG=[0,300,700,1500,3000,5200],TO=[0,1,2,3,4,6],ORE_PRICE=250;
const capT=()=>Math.max(0,Math.min(5,chap()-1));
const isSmith=()=>/Smith|Forge|Armoury/.test((SHOP&&SHOP.n)||'');
function tierOf(id,slot){const t=FG().t[id];return t?(t[slot]|0):0;}
function temperCost(id,slot){const n=tierOf(id,slot)+1;return n>5?null:{t:n,g:TG[n],o:TO[n]};}
function temper(id,slot){const c=temperCost(id,slot);if(!c)return 'max';if(c.t>capT())return 'cap';if(G.gold<c.g)return 'gold';if(FG().ore<c.o)return 'ore';
 G.gold-=c.g;FG().ore-=c.o;const t=FG().t[id]||(FG().t[id]={w:0,a:0});t[slot]=c.t;return 'ok';}
function buyOre(){if(G.gold<ORE_PRICE)return false;G.gold-=ORE_PRICE;FG().ore++;return true;}
const TROWS=()=>{const L=[];G.party.forEach(m=>{L.push({m,slot:'w'});L.push({m,slot:'a'});});L.push({ore:1});L.push({done:1});return L;};
XUI.temper={u(u,dt){const L=TROWS(),n=L.length;if(held('up',dt)){u.i=(u.i+n-1)%n;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%n;sfx('move');}
  if(P.b||P.menu){UI.pop();sfx('no');return;}if(!P.a)return;const r=L[u.i];if(r.done){UI.pop();sfx('no');return;}
  if(r.ore){if(buyOre()){sfx('coin');u.msg='Bought 1 Ember Ore.';}else{sfx('no');u.msg='Not enough gold.';}return;}
  const res=temper(r.m.id,r.slot),nm=r.m.name+'\'s '+(r.slot==='w'?'weapon':'armor');
  u.msg={ok:nm+' tempered to +'+tierOf(r.m.id,r.slot)+'!',max:nm+' is already at +5.',cap:'The forge can\'t go past +'+capT()+' yet. (Rises each chapter.)',gold:'Not enough gold.',ore:'Not enough Ember Ore.'}[res];sfx(res==='ok'?'coin':'no');},
 d(u){const L=TROWS(),f=FG();X.fillStyle='#000c';X.fillRect(0,0,W,H);win(4,4,W-8,20);txt('EMBER TEMPER — '+(u.who||'the forge'),10,10,'#ffd860',7);txt(G.gold+' G',W-10,10,'#fff',7,'right');
  win(4,28,132,152);L.forEach((r,i)=>{const y=34+i*14;if(i===u.i)cursor(8,y);
   if(r.ore){txt('Buy Ember Ore',20,y,'#ffb070',7);txt(ORE_PRICE+'G',132,y,G.gold>=ORE_PRICE?'#ffd860':'#866',7,'right');return;}if(r.done){txt('Done',20,y,'#fff',7);return;}
   const t=tierOf(r.m.id,r.slot);txt(r.m.name+' '+(r.slot==='w'?'Weapon':'Armor'),20,y,'#fff',7);txt('+'+t,132,y,t?'#ffb040':'#778',7,'right');});
  win(140,28,112,152);const r=L[u.i];let y=34;
  if(r.ore){['Ember Ore stays warm in','the snow. Smiths fold it','into steel. Found in','chests, shrines and','burning Hollow beasts.'].forEach(l=>{txt(l,146,y,'#cde',6);y+=9;});}
  else if(r.done){txt('Leave the forge.',146,y,'#cde',6);}
  else{const m=r.m,slot=r.slot,t=tierOf(m.id,slot),c=temperCost(m.id,slot),eq=EQ[m[slot]];txt(eq?eq.n:'—',146,y,'#fff',7);y+=11;
   const caster=HERO_DEF[m.id]&&HERO_DEF[m.id].mag>=10,bon=n=>slot==='w'?'ATK+'+TW[n]+(caster?' MAG+'+TWM[n]:''):'DEF+'+TA[n]+' MDEF+'+TA[n];
   txt('Now  +'+t+'  '+(t?bon(t):'—'),146,y,'#9cf',6);y+=9;
   if(c){txt('Next +'+c.t+'  '+bon(c.t),146,y,'#ffe0a0',6);y+=12;txt('Cost '+c.g+' G',146,y,G.gold>=c.g?'#ffd860':'#f88',7);y+=10;txt('Ore  '+f.ore+'/'+c.o,146,y,f.ore>=c.o?'#9f9':'#f88',7);y+=12;
    if(c.t>capT())wrap('Forge limit now +'+capT()+'. It rises with each chapter.',22).forEach(l=>{txt(l,146,y,'#f9a',6);y+=8;});}
   else{txt('Fully tempered.',146,y,'#ffd860',7);y+=10;}
   y=Math.max(y+2,150);txt('Binds to the wielder:',146,y,'#889',6);txt('carries to new gear.',146,y+8,'#889',6);}
  win(4,184,W-8,36);txt(u.msg||('Ember Ore: '+f.ore+'    Forge limit: +'+capT()),10,190,'#fff',7);txt('A: temper / buy    B: back',10,204,'#bbd',6);}};
function openTemper(){UI.push({k:'temper',i:0,who:SHOP&&SHOP.who,msg:''});sfx('ok');}
const _openShopR=openShop;openShop=function(o){_openShopR(o);if(isSmith()){const d=UI[UI.length-1];if(d&&d.k==='dlg')d.lines.push(SHOP.who+': '+(capT()?'Bring Ember Ore and I\'ll temper your gear, too. (MENU: Ember Temper)':'The forge can temper gear with Ember Ore once you\'ve a shard or two. (MENU: Ember Temper)'));}};
const _updShopR=updShop;updShop=function(u,dt){if(P.menu&&isSmith()){openTemper();return;}return _updShopR(u,dt);};
const _drawShopR=drawShop;drawShop=function(u){_drawShopR(u);if(!isSmith())return;X.fillStyle='#000';X.fillRect(4,188,W-8,14);txt('A: Buy   B: Leave   MENU: Ember Temper ✦',12,192,'#ffd0a0',7);};
// Ember Ore from battles (Chapter 2 on; random fights 10%, bosses 2)
const _checkEndR=checkEnd;checkEnd=function(){_checkEndR();if(!B||B.end!=='win'||B._ore||!G)return;B._ore=1;if(chap()<2||B.arena)return;
 const n=B.boss?2:Math.random()<0.1?1:0;if(n){FG().ore+=n;if(B.lines)B.lines.push('Found Ember Ore'+(n>1?' x'+n:'')+'!');}};
// airship: two hull tiers past the Frigate
if(typeof TIERS!=='undefined'&&TIERS.length===4){TIERS.push({n:'Galleon',hull:2600,arm:22,slots:3,cost:4000,mat:{iron:8,ichor:5}},{n:'Ember Dreadnought',hull:3400,arm:28,slots:3,cost:8000,mat:{iron:12,ichor:8,feather:6}});}
// Colosseum entry fees (first-win purses are unchanged; rematch purses still pay 10%)
const FEE=[100,200,400,800];
if(XDOOR.ex_arena&&typeof RANKS!=='undefined'){XDOOR.ex_arena=()=>{const e=EXS(),opts=RANKS.map((r,i)=>(e.arena>i?'* ':'')+r.n);opts.push('Leave');
 choice('Herald: Welcome to the Colosseum! Which cup will you fight for? (Entry fees from '+FEE[0]+' G. Party healed before and after.)',opts,i=>{if(i>=RANKS.length)return;const r=RANKS[i];
  if(!r.req())return dialog(['Herald: Not yet, friend. '+r.rq]);if(i>e.arena)return dialog(['Herald: Win the '+RANKS[e.arena].n+' first!']);
  choice('Herald: The '+r.n+' entry fee is '+FEE[i]+' G. '+(e.arena>i?'(Rematch purse: '+Math.round(r.g*0.1)+' G.)':'(Purse: '+r.g+' G.)'),['Pay '+FEE[i]+' G','Not now'],c=>{if(c)return;
   if(G.gold<FEE[i])return dialog(['Herald: '+FEE[i]+' G at the gate, friend. Come back with a fuller purse.']);G.gold-=FEE[i];sfx('coin');
   healAll();transition(()=>dialog(['Herald: LADIES AND GENTLEFOLK! Fighting for the '+r.n+'... the embers of Thornwick!','(Round 1 of '+r.rounds.length+'.)'],()=>arenaRound(i,0)));});});};}
// Champion's Exchange (Valorgate): permanent stat seeds, opens after your first cup
Object.assign(ITEMS,{
 mightseed:{n:'Might Seed',p:2400,tgt:'P',field:1,seed:{atk:2},d:'Permanently +2 ATK (use from MENU)'},
 sageseed:{n:'Sage Seed',p:2400,tgt:'P',field:1,seed:{mag:2},d:'Permanently +2 MAG (use from MENU)'},
 guardseed:{n:'Guard Seed',p:2400,tgt:'P',field:1,seed:{def:2},d:'Permanently +2 DEF (use from MENU)'},
 lifeseed:{n:'Life Seed',p:2400,tgt:'P',field:1,seed:{hp:40},d:'Permanently +40 max HP (use from MENU)'},
 swiftseed:{n:'Swift Seed',p:3600,tgt:'P',field:1,seed:{spd:1},d:'Permanently +1 SPD (use from MENU)'}});
const XSTOCK=['mightseed','sageseed','guardseed','lifeseed','swiftseed'];
const _useItemR=useItem;useItem=function(id,m){const it=ITEMS[id];if(it&&it.seed){if(m.hp<=0)return false;for(const k in it.seed){m.b[k]+=it.seed[k];if(k==='hp')m.hp+=it.seed[k];}
 say(m.name+': '+Object.entries(it.seed).map(([k,v])=>k.toUpperCase()+' +'+v).join(', ')+' (permanent).');return true;}return _useItemR(id,m);};
if(NPCS.ex_valor)NPCS.ex_valor.push({x:8,y:11,s:'merch',d:'down',act:()=>{const e=EXS();if(!e.arena)return dialog(['Quartermaster Lio: The Champion\'s Exchange serves cup winners only. Win the Bronze Cup and come back.']);
 openShop({stock:XSTOCK,n:'Champion\'s Exchange',who:'Quartermaster Lio'});},lines:()=>[]});
// Records: Emberlands discoveries + Ember Temper
if(XUI.records){XUI.records.d=()=>{const r=records(),d=discoveries(),f=FG();let tt=0;for(const k in f.t)tt+=(f.t[k].w|0)+(f.t[k].a|0);
 X.fillStyle='#000a';X.fillRect(0,0,W,H);win(4,4,W-8,18);txt('RECORDS — the Wayfarer\'s journal',10,9,'#ffd860',8);win(4,24,W-8,H-28);
 const L=[['Places found (by airship)',r.towns+'/4'],['Optional dungeons cleared',r.dn+'/4'],['Colosseum cups',r.arena+'/4'+(r.arena>=4?'  CHAMPION':'')],
  ['Fish species',r.sp+'/'+Object.keys(FISH).length],['Ember Triad cards',r.cd+'/'+Object.keys(CARDS).length],['Card rivals beaten',r.rv+'/'+Object.keys(RIVALS).length],
  ['Emberlands sights',d.n+'/'+d.of],['Ember Temper (Ore '+f.ore+')',tt+'/'+(G.party.length*10)]];
 L.forEach(([a,b],i)=>{txt(a,14,30+i*12,i>=6?'#ffe0a0':'#fff',7);txt(b,W-14,30+i*12,'#9cf',7,'right');});
 txt('Dungeons:',14,130,'#ffd0a0',7);Object.keys(DUN).forEach((m,i)=>txt((DUNDONE(m)?'* ':EXS().seen[m]?'- ':'? ')+(EXS().seen[m]||DUNDONE(m)?DUN[m].name:'???'),20+(i%2)*116,142+(i/2|0)*11,DUNDONE(m)?'#7a8':'#fff',6));
 txt('Wayfarer completion: '+r.pct+'%',W/2,176,'#ffe060',8,'center');bar(30,190,W-60,r.pct/100,'#ffd040','#402010');};}

window.REFINE={LEADS,LEADID,setLead,encCfg,encChance,GPOI,GCHEST,discoveries,FG,temper,temperCost,capT,buyOre,TG,TO,TW,TA,FEE,XSTOCK,TIERS:typeof TIERS!=='undefined'?TIERS:null,
 hcCol,openTemper,get TR(){return TR;},campfire,shrine,cartographer};
})();
