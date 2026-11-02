'use strict';
// Emberfall — release polish. Loaded last.
//  * Settings (title + field menu): music / SFX volume, text speed, battle speed, ATB mode (Active / Classic / Wait), fullscreen
//  * Controls: remappable keyboard keys + Gamepad API (d-pad / left stick, remappable A / B / Menu buttons); touch pad unchanged
//  * 3 save slots with a load screen; the old single save ('emberfall_save') is migrated into slot 1 and kept as a mirror
//    of the latest save, so older builds/tests that read it still work
//  * New title screen (Continue / Load / Settings, painted party, version) and a letterboxed, typewriter intro
//  * Chapter summary card (was a leftover "DEMO COMPLETE" screen) now returns you to where you were
const VERSION='v1.0';
// ---------- options ----------
const OPT=Object.assign({text:1,bspd:2,atb:1,fs:0},(()=>{try{return JSON.parse(localStorage.getItem('emberfall_opts'))||{}}catch(e){return{}}})());
function saveOpt(){try{localStorage.setItem('emberfall_opts',JSON.stringify(OPT));}catch(e){}}
const TEXTSP=[['Slow',0.5],['Normal',1],['Fast',2],['Instant',99]],BSPD=[0.6,0.8,1,1.3,1.7],ATBM=['Active','Classic','Wait'];
const _updDlgP=updDlg;updDlg=function(u,dt){return _updDlgP(u,dt*TEXTSP[OPT.text][1]);};
const _updBattleP=updBattle;updBattle=function(dt){return _updBattleP(dt*BSPD[OPT.bspd]);};
// Active: gauges never stop; Classic (original): they stop while you pick a skill/item/target; Wait: they stop whenever a command menu is open
window.ATBWAIT=B=>OPT.atb===0?false:OPT.atb===2?!!B.menu:!!(B.menu&&B.menu.k!=='cmd');
function setFullscreen(on){OPT.fs=on?1:0;saveOpt();try{if(on&&!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{});
 else if(!on&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}
document.addEventListener('fullscreenchange',()=>{OPT.fs=document.fullscreenElement?1:0;saveOpt();setTimeout(resize,50);});
// ---------- keyboard remapping ----------
const ACTS=['up','down','left','right','a','b','menu'],ANAME={up:'Up',down:'Down',left:'Left',right:'Right',a:'Confirm (A)',b:'Cancel (B)',menu:'Menu'};
const FIXED={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',Escape:'b'};   // always work, so nobody can lock themselves out
const KDEF={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',a:'KeyZ',b:'KeyX',menu:'KeyC'};
const PDEF={a:0,b:1,menu:9};
const BIND=Object.assign({},KDEF,(()=>{try{return JSON.parse(localStorage.getItem('emberfall_keys'))||{}}catch(e){return{}}})());
const PBIND=Object.assign({},PDEF,(()=>{try{return JSON.parse(localStorage.getItem('emberfall_pad'))||{}}catch(e){return{}}})());
function applyBinds(){for(const k in KM)delete KM[k];Object.assign(KM,FIXED,{Space:'a',Backspace:'b',Tab:'menu',KeyM:'menu'});for(const a of ACTS)if(BIND[a])KM[BIND[a]]=a;
 try{localStorage.setItem('emberfall_keys',JSON.stringify(BIND));localStorage.setItem('emberfall_pad',JSON.stringify(PBIND));}catch(e){}}
applyBinds();
function bindKey(act,code){if(FIXED[code])return false;for(const a of ACTS)if(a!==act&&BIND[a]===code)BIND[a]=BIND[act];BIND[act]=code;applyBinds();return true;}
function bindPad(act,btn){for(const a in PBIND)if(a!==act&&PBIND[a]===btn)PBIND[a]=PBIND[act];PBIND[act]=btn;applyBinds();}
let CAP=null;   // {act, pad} while waiting for a key / button
addEventListener('keydown',e=>{if(!CAP||CAP.pad)return;e.preventDefault();e.stopImmediatePropagation();
 if(e.code==='Escape'){CAP=null;sfx('no');return;}if(bindKey(CAP.act,e.code)){sfx('ok');CAP=null;}else sfx('no');},{capture:true});
const keyName=c=>!c?'—':c.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Arrow/,'').replace('Numpad','Num ');
// ---------- gamepad ----------
const GP={on:{},name:'',prev:[]};
function padState(){const pads=(navigator.getGamepads?navigator.getGamepads():[])||[];let gp=null;for(const p of pads)if(p&&p.connected!==false){gp=p;break;}
 if(!gp){GP.name='';return null;}GP.name=gp.id||'Gamepad';const bt=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>0.5)),ax=i=>gp.axes[i]||0;
 return {gp,bt,st:{up:bt(12)||ax(1)<-0.5,down:bt(13)||ax(1)>0.5,left:bt(14)||ax(0)<-0.5,right:bt(15)||ax(0)>0.5,a:bt(PBIND.a),b:bt(PBIND.b),menu:bt(PBIND.menu)||bt(8)}};}
function pollPad(){try{const s=padState();
 if(CAP&&CAP.pad&&s){for(let i=0;i<s.gp.buttons.length;i++){const now=s.bt(i);if(now&&!GP.prev[i]&&i<12){bindPad(CAP.act,i);sfx('ok');CAP=null;GP.hold=1;break;}}}
 else if(GP.hold){if(!s||!s.gp.buttons.some((b,i)=>s.bt(i)))GP.hold=0;}
 else{const st=s?s.st:{};for(const a of ACTS){const now=!!st[a];if(now&&!GP.on[a])press(a);else if(!now&&GP.on[a])rel(a);GP.on[a]=now;}}
 if(s)for(let i=0;i<s.gp.buttons.length;i++)GP.prev[i]=s.bt(i);}catch(e){}requestAnimationFrame(pollPad);}
requestAnimationFrame(pollPad);
addEventListener('gamepadconnected',e=>{if(scene==='map'||scene==='title')UI.push({k:'dlg',lines:['Gamepad connected: '+(e.gamepad.id||'controller').slice(0,30)],i:0,ch:0});});

// ---------- settings UI ----------
const SROWS=['Music','Sound FX','Text speed','Battle speed','ATB mode','Fullscreen','Controls','Back'];
function openSettings(){UI.push({k:'settings',i:0});sfx('ok');}
XUI.settings={u:(u,dt)=>{const n=SROWS.length;if(held('up',dt)){u.i=(u.i+n-1)%n;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%n;sfx('move');}
  if(P.b||P.menu){UI.pop();sfx('no');return;}const r=SROWS[u.i];let d=held('right',dt)?1:held('left',dt)?-1:0;
  if(P.a){if(r==='Back'){UI.pop();sfx('no');return;}if(r==='Controls'){UI.push({k:'controls',i:0});sfx('ok');return;}if(r==='Fullscreen'){setFullscreen(!OPT.fs);sfx('ok');return;}d=1;}
  if(!d)return;const wrapI=(v,m)=>(v+m)%m;
  if(r==='Music'||r==='Sound FX'){const k=r==='Music'?'mus':'sfx';AOPT[k]=Math.max(0,Math.min(3,AOPT[k]+(P.a?(AOPT[k]===3?-3:1):d)));saveAOpt();}
  else if(r==='Text speed')OPT.text=wrapI(OPT.text+d,TEXTSP.length);else if(r==='Battle speed')OPT.bspd=Math.max(0,Math.min(4,OPT.bspd+(P.a&&OPT.bspd===4?-4:d)));
  else if(r==='ATB mode')OPT.atb=wrapI(OPT.atb+d,3);else if(r==='Fullscreen')setFullscreen(d>0);saveOpt();sfx('move');},
 d:u=>{X.fillStyle='#000b';X.fillRect(0,0,W,H);win(16,10,W-32,20);txt('SETTINGS',W/2,16,'#ffd860',8,'center');win(16,34,W-32,150);
  const val={'Music':VOLTXT[AOPT.mus],'Sound FX':VOLTXT[AOPT.sfx],'Text speed':TEXTSP[OPT.text][0],'Battle speed':'●'.repeat(OPT.bspd+1)+'○'.repeat(4-OPT.bspd),
   'ATB mode':ATBM[OPT.atb],'Fullscreen':OPT.fs?'On':'Off','Controls':isTouch&&!GP.name?'Keyboard / pad':'Remap ▸','Back':''};
  SROWS.forEach((r,i)=>{const y=42+i*17;txt(r,36,y,'#fff',8);txt(val[r],W-30,y,'#9cf',8,'right');if(i===u.i)cursor(24,y);});
  const help={'ATB mode':['Active: gauges never stop.','Classic: they pause while you pick a skill, item or target.','Wait: they pause whenever a command menu is open.'][OPT.atb],
   'Battle speed':'How fast gauges fill and attacks play out.','Text speed':'How fast dialogue types out.','Fullscreen':'Toggle fullscreen (F11 also works on desktop).','Controls':'Remap keyboard keys and gamepad buttons.'}[SROWS[u.i]]||'Left/Right or A to change.  B: back';
  win(16,188,W-32,30);wrap(help,40).slice(0,2).forEach((l,i)=>txt(l,24,193+i*10,'#cde',7));}};
XUI.controls={u:(u,dt)=>{if(CAP)return;const n=ACTS.length+2;if(held('up',dt)){u.i=(u.i+n-1)%n;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%n;sfx('move');}
  if(P.b||P.menu){UI.pop();sfx('no');return;}
  if(u.i===ACTS.length+1&&P.a){UI.pop();sfx('no');return;}
  if(u.i===ACTS.length&&P.a){Object.assign(BIND,KDEF);Object.assign(PBIND,PDEF);applyBinds();sfx('ok');return toast('Controls reset to defaults.');}
  const act=ACTS[u.i];if(!act)return;if(P.a){CAP={act,pad:0};sfx('ok');}else if((held('right',dt)||held('left',dt))&&PBIND[act]!=null){CAP={act,pad:1};sfx('ok');}},
 d:u=>{X.fillStyle='#000c';X.fillRect(0,0,W,H);win(10,6,W-20,20);txt('CONTROLS',W/2,12,'#ffd860',8,'center');win(10,30,W-20,150);
  txt('Action',22,36,'#ffd0a0',7);txt('Key',150,36,'#ffd0a0',7);txt('Pad',204,36,'#ffd0a0',7);
  ACTS.forEach((a,i)=>{const y=50+i*14,cap=CAP&&CAP.act===a;txt(ANAME[a],26,y,'#fff',7);
   txt(cap&&!CAP.pad?'press a key…':keyName(BIND[a]),150,y,cap&&!CAP.pad?'#ffe060':'#9cf',7);
   txt(PBIND[a]!=null?(cap&&CAP.pad?'press…':'Btn '+PBIND[a]):(a==='up'||a==='down'||a==='left'||a==='right'?'D-pad':'—'),204,y,cap&&CAP.pad?'#ffe060':'#9cf',7);if(i===u.i)cursor(14,y);});
  const y1=50+ACTS.length*14;txt('Reset to defaults',26,y1,'#fff',7);txt('Back',26,y1+14,'#fff',7);if(u.i>=ACTS.length)cursor(14,u.i===ACTS.length?y1:y1+14);
  win(10,184,W-20,36);txt(CAP?'Esc cancels. Arrows and Enter/Esc always work.':'A: rebind key   Left/Right: rebind pad button',18,190,'#cde',7);
  txt(GP.name?'Pad: '+GP.name.slice(0,34):'No gamepad detected (press any button)',18,202,GP.name?'#9f9':'#99a',6);}};
{const i=MOPTS.indexOf('Save');MOPTS.splice(i<0?MOPTS.length-1:i,0,'Settings');}

// ---------- save slots ----------
const NSLOT=3,SKEY=i=>'emberfall_save_'+i,LEGACY='emberfall_save';
let SLOT=+localStorage.getItem('emberfall_slot')||0;
const rawSlot=i=>{try{return JSON.parse(localStorage.getItem(SKEY(i)));}catch(e){return null;}};
(function migrate(){const leg=localStorage.getItem(LEGACY);if(leg&&![1,2,3].some(i=>localStorage.getItem(SKEY(i)))){localStorage.setItem(SKEY(1),leg);if(!SLOT){SLOT=1;localStorage.setItem('emberfall_slot','1');}}})();
function chapterOf(g){const f=g.flags||{};return f.clear?'Clear':f.vorthane?8:f.seneschal?8:f.warden?7:f.hydra?6:f.wyrm?5:f.tyrant?4:f.corsair?3:f.boss?2:1;}
function metaOf(g){const m=MAPS[g.map];return {t:Date.now(),loc:g.map==='sky'?'Aboard the Cinderwing':m?m.name:'?',lv:g.party?Math.max(...g.party.map(p=>p.lv)):1,ch:chapterOf(g),time:g.time||0,gold:g.gold||0};}
function firstEmpty(){for(let i=1;i<=NSLOT;i++)if(!localStorage.getItem(SKEY(i)))return i;return 0;}
function latestSlot(){let b=0,t=-1;for(let i=1;i<=NSLOT;i++){const s=rawSlot(i);if(s){const tt=(s._meta&&s._meta.t)||0;if(tt>t){t=tt;b=i;}}}return b;}
save=function(slot){if(slot)SLOT=slot;if(!SLOT)SLOT=firstEmpty()||1;G._meta=metaOf(G);const s=JSON.stringify(G);localStorage.setItem(SKEY(SLOT),s);localStorage.setItem(LEGACY,s);localStorage.setItem('emberfall_slot',String(SLOT));};
hasSave=function(){return !!localStorage.getItem(LEGACY)||[1,2,3].some(i=>localStorage.getItem(SKEY(i)));};
// load(): the most recent save (the legacy key always mirrors it); load(i): a specific slot
load=function(i){if(i){SLOT=i;G=rawSlot(i);localStorage.setItem('emberfall_slot',String(i));}else{const L=latestSlot();if(L){SLOT=L;G=rawSlot(L);}else{const leg=localStorage.getItem(LEGACY);G=leg?JSON.parse(leg):null;SLOT=SLOT||1;}}
 if(G&&!G.flags)G.flags={};};
DBG.save=(...a)=>save(...a);DBG.load=(...a)=>load(...a);DBG.hasSave=()=>hasSave();
function fmtTime(s){s=s|0;return (s/3600|0)+':'+String((s/60|0)%60).padStart(2,'0');}
function openSlots(mode){UI.push({k:'slots',mode,i:Math.max(0,(SLOT||latestSlot()||1)-1)});sfx('ok');}
function resumeLoaded(){transition(()=>{UI=[];scene='map';enterMap(G.map,G.x,G.y,G.d);});}
XUI.slots={u:(u,dt)=>{if(held('up',dt)){u.i=(u.i+NSLOT-1)%NSLOT;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%NSLOT;sfx('move');}
  if(P.b||P.menu){UI.pop();sfx('no');return;}if(!P.a)return;const i=u.i+1,s=rawSlot(i);
  if(u.mode==='load'){if(!s)return sfx('no');sfx('ok');UI.pop();load(i);return resumeLoaded();}
  if(u.mode==='save'){const go=()=>{save(i);sfx('coin');UI.pop();toast('Saved to slot '+i+'.');};if(s&&i!==SLOT)return choice('Overwrite slot '+i+' ('+(s._meta?s._meta.loc:'old save')+')?',['Overwrite','Cancel'],c=>{if(!c)go();});return go();}
  if(u.mode==='new'){const go=()=>{UI.pop();startNewGame(i);};if(s)return choice('Start a new journey in slot '+i+'? Its save will be replaced the first time you save.',['New game','Cancel'],c=>{if(!c)go();});return go();}},
 d:u=>{X.fillStyle='#000c';X.fillRect(0,0,W,H);win(10,8,W-20,20);txt(u.mode==='save'?'SAVE GAME':u.mode==='new'?'NEW GAME — choose a slot':'LOAD GAME',W/2,14,'#ffd860',8,'center');
  for(let i=1;i<=NSLOT;i++){const y=34+(i-1)*56,s=rawSlot(i);win(14,y,W-28,52);if(i-1===u.i)cursor(18,y+20);
   txt('SLOT '+i+(i===SLOT?'  (current)':''),34,y+5,'#ffd0a0',7);
   if(!s){txt('— empty —',W/2,y+22,'#778',8,'center');continue;}
   const m=s._meta||metaOf(s);(s.party||[]).forEach((p,j)=>{if(SPR[p.id])X.drawImage(SPR[p.id].down[0],34+j*20,y+18);});
   txt(m.loc,100,y+17,'#fff',7);txt('Chapter '+m.ch+'   Lv '+m.lv,100,y+28,'#9cf',7);txt(fmtTime(m.time)+'   '+m.gold+' G',100,y+39,'#bbd',6);
   if(s.flags&&s.flags.clear)txt('★ CLEAR',W-22,y+5,'#ffd060',7,'right');}
  txt('A: '+(u.mode==='save'?'save here':u.mode==='new'?'start here':'load')+'    B: back',W/2,H-12,'#bbd',6,'center');}};
const _updMenuP=updMenu;updMenu=function(u,dt){if(!u.sub&&P.a){const o=MOPTS[u.i];if(o==='Save'){openSlots('save');return;}if(o==='Settings'){openSettings();return;}}return _updMenuP(u,dt);};

// ---------- title screen ----------
const TOPTS=['New Game','Continue','Load Game','Settings'];
function startNewGame(slot){SLOT=slot||firstEmpty()||SLOT||1;localStorage.setItem('emberfall_slot',String(SLOT));newGame();transition(()=>{scene='intro';IN={p:0,t:0};});}
updTitle=function(dt){if(TT.t==null)TT.t=0;TT.t+=dt;const n=TOPTS.length;
 if(held('up',dt)){TT.i=(TT.i+n-1)%n;sfx('move');}if(held('down',dt)){TT.i=(TT.i+1)%n;sfx('move');}
 if(!P.a)return;const o=TOPTS[TT.i];
 if(o==='New Game'){sfx('ok');const e=firstEmpty();if(e)return startNewGame(e);return openSlots('new');}
 if(o==='Continue'){if(!hasSave())return sfx('no');sfx('ok');load();return resumeLoaded();}
 if(o==='Load Game'){if(!hasSave())return sfx('no');return openSlots('load');}
 if(o==='Settings')return openSettings();};
const TSTARS=[];for(let i=0;i<70;i++)TSTARS.push({x:Math.random()*W,y:Math.random()*110,s:Math.random()*2+0.3,p:Math.random()*6});
drawTitle=function(){const t=T;const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05021a');g.addColorStop(0.45,'#2a0e3a');g.addColorStop(0.75,'#7a2a3a');g.addColorStop(1,'#e0702a');X.fillStyle=g;X.fillRect(0,0,W,H);
 TSTARS.forEach(s=>{const a=0.4+0.6*Math.abs(Math.sin(t*s.s+s.p));X.globalAlpha=a;X.fillStyle='#fff';X.fillRect(s.x,s.y,s.s>1.6?2:1,1);});X.globalAlpha=1;
 // the shattered crown: seven flames orbiting where the moon was
 const cx=234,cy=20;X.fillStyle='rgba(255,200,120,0.12)';X.beginPath();X.arc(cx,cy,22+Math.sin(t*2)*2,0,7);X.fill();
 for(let i=0;i<7;i++){const a=i/7*6.28+t*0.5,r=13;X.fillStyle=['#ff6020','#ffb030','#ffe060'][i%3];X.fillRect(cx+Math.cos(a)*r-1.5,cy+Math.sin(a)*r*0.7-1.5,3,3);}
 X.fillStyle='#ffd060';X.fillRect(cx-6,cy-2,12,4);for(let i=0;i<4;i++)X.fillRect(cx-6+i*4,cy-6,2,4);
 // far mountains, castle, ridge
 X.fillStyle='#2a1030';X.beginPath();X.moveTo(0,150);for(let x=0;x<=W;x+=16)X.lineTo(x,128+Math.sin(x*0.05+1)*10+Math.sin(x*0.13)*5);X.lineTo(W,H);X.lineTo(0,H);X.fill();
 drawCastle(146,'#14081e');X.fillStyle='#0a0410';X.beginPath();X.moveTo(0,196);X.quadraticCurveTo(W/2,176,W,198);X.lineTo(W,H);X.lineTo(0,H);X.fill();
 ['kael','lyra','mira'].forEach((k,i)=>{X.save();X.globalAlpha=0.95;if(!drawPaint(k,30+i*30,206,{sc:0.6}))X.drawImage(SPR[k].right[0],18+i*22,172);X.restore();});
 drawEmbers();
 const y=34+Math.sin(t*1.5)*2,glow=0.5+0.5*Math.sin(t*2.2);X.save();X.shadowColor=`rgba(255,140,40,${0.5+glow*0.4})`;X.shadowBlur=8+glow*6;
 const tg=X.createLinearGradient(0,y,0,y+28);tg.addColorStop(0,'#fff6c8');tg.addColorStop(0.5,'#ffb030');tg.addColorStop(1,'#c03010');
 X.font='bold 30px "Courier New",monospace';X.textAlign='center';X.textBaseline='alphabetic';X.fillStyle='#000';X.fillText('EMBERFALL',W/2+1.5,y+25.5);X.fillStyle=tg;X.fillText('EMBERFALL',W/2,y+24);X.restore();
 X.fillStyle='#ffb040';X.fillRect(W/2-70,y+30,140,1);txt('CHRONICLE  OF  THE  SHATTERED  CROWN',W/2,y+34,'#ffe0c0',6,'center');
 const has=hasSave(),bx=W/2-48,by=104;win(bx,by,96,TOPTS.length*13+8);TOPTS.forEach((o,i)=>{const dim=(i===1||i===2)&&!has;txt(o,bx+22,by+5+i*13,dim?'#667':'#fff');if(TT.i===i)cursor(bx+8,by+5+i*13);});
 try{const s=JSON.parse(localStorage.getItem(LEGACY)||'null');if(s&&s.flags&&s.flags.clear)txt('★ CLEAR',bx+96+4,by+18,'#ffd060',7);if(s&&TT.i===1){const m=s._meta||metaOf(s);txt(m.loc+' · Lv '+m.lv,W/2,by+TOPTS.length*13+12,'#ffe0c0',6,'center');}}catch(e){}
 if(!UI.length)txt(isTouch?'D-pad + A/B · MENU':GP.name?'Gamepad: D-pad/stick · A · B · Start':'Arrows/WASD · Z/Enter · X/Esc · C=Menu · pad OK',W/2,H-19,'#e8c8c8',6,'center');
 txt('© 2026 Skywield Games',8,H-9,'#c8a8c8',6);txt(VERSION,W-8,H-9,'#c8a8c8',6,'right');};
// ---------- intro: letterbox, typewriter, progress ----------
const _drawIntroP=drawIntro;drawIntro=function(){_drawIntroP();const p=Math.min(IN.p,INTRO.length-1);
 X.fillStyle='#05030c';X.fillRect(0,130,W,50);const full=INTRO[p],n=Math.min(full.length,Math.floor(IN.t*42*TEXTSP[OPT.text][1]));
 X.globalAlpha=1;wrap(full.slice(0,n),38).forEach((l,i)=>txt(l,W/2,140+i*12,'#fff',8,'center'));
 X.fillStyle='#000';X.fillRect(0,0,W,14);X.fillRect(0,H-22,W,22);for(let i=0;i<INTRO.length;i++){X.fillStyle=i<=p?'#ffb040':'#443';X.fillRect(W/2-INTRO.length*5+i*10,H-14,6,3);}
 txt('A: next   B: skip',W-6,H-10,'#888',6,'right');if(p===0&&IN.t<2.5){X.globalAlpha=Math.max(0,1-IN.t/2.5);txt('EMBERFALL',W/2,40,'#ffd060',16,'center');X.globalAlpha=1;}};
// ---------- chapter summary (replaces the old demo-era ending card) ----------
drawEnd=function(){X.fillStyle='#05030c';X.fillRect(0,0,W,H);drawEmbers();const f=G.flags,ch=f.seneschal?7:f.warden?6:f.hydra?5:f.wyrm?4:f.tyrant?3:f.corsair?2:1;
 const sub={1:'The first shard is reclaimed.',2:'The skies of Emberfall are open.',3:'Two shards reclaimed. Ashmarch cools.',4:'Three shards reclaimed. The storm breaks.',5:'Four shards. The Hollow King has a name.',6:'Six shards. Beyond the Veil, the truth.',7:'The Throne is empty. One stair remains.'}[ch];
 txt('CHAPTER '+ch+' COMPLETE',W/2,36,'#ffd060',14,'center');txt(sub,W/2,64,'#fff',8,'center');
 G.party.forEach((m,i)=>{X.drawImage(SPR[m.id].down[Math.floor(T*4+i)%3],W/2-60+i*44,90,24,32);txt(m.name+' Lv'+m.lv,W/2-48+i*44,128,'#fff',6,'center');});
 txt('Play time '+fmtTime(G.time)+'   ·   '+G.gold+' G',W/2,150,'#9cf',7,'center');txt('Progress saved'+(SLOT?' to slot '+SLOT:'')+'.',W/2,166,'#c8a8c8',7,'center');
 txt('Press A to continue your journey',W/2,196,Math.sin(T*4)>0?'#fff':'#aaa',7,'center');};
window.POLISH={OPT,BIND,PBIND,bindKey,bindPad,applyBinds,openSettings,openSlots,rawSlot,latestSlot,firstEmpty,metaOf,get SLOT(){return SLOT},set SLOT(v){SLOT=v},ATBM,TEXTSP,BSPD,get CAP(){return CAP},GP,KM,VERSION};
