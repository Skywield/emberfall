'use strict';
// Grok review #2 pass (design/grok_review_nov2b.md). Loaded last.
// ---------- movement feel ----------
// Steps are faster (9.5 tiles/s instead of 7) and chain without a dead frame while a direction is held (game.js updField).
// The touch D-pad is one pad: press anywhere on it and slide between directions without lifting (no more stalls when the
// thumb drifts off a button).
window.FSPD=9.5;
(function(){const pad=document.getElementById('dpad');if(!pad)return;let cur=null,pid=null;const btn=k=>pad.querySelector(`[data-k="${k}"]`);
 const set=k=>{if(k===cur)return;if(cur){rel(cur);btn(cur)&&btn(cur).classList.remove('on');}cur=k;if(k){press(k);btn(k)&&btn(k).classList.add('on');}};
 const dirAt=e=>{const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);if(dx*dx+dy*dy<64)return cur;return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');};
 const stop=e=>{e.stopPropagation();};
 pad.addEventListener('pointerdown',e=>{stop(e);e.preventDefault();pid=e.pointerId;try{pad.setPointerCapture(pid);}catch(_){}set(dirAt(e));},true);
 pad.addEventListener('pointermove',e=>{if(e.pointerId!==pid)return;stop(e);set(dirAt(e));},true);
 ['pointerup','pointercancel','lostpointercapture'].forEach(n=>pad.addEventListener(n,e=>{if(e.pointerId!==pid)return;stop(e);pid=null;set(null);},true));
 pad.addEventListener('pointerleave',stop,true);pad.addEventListener('pointerout',stop,true);window.DPAD={set,get cur(){return cur;}};})();
// ---------- battle tips (Ember tutorial + first-time tooltips) ----------
// tip(id,lines,block): shown once per save. In the tutorial fight tips pause the battle until A; elsewhere they are a
// small non-blocking card that fades after a few seconds.
function wrapL(lines,n=56){const o=[];lines.forEach((l,j)=>{let c='';for(const wd of l.split(' ')){if((c+' '+wd).trim().length>n){o.push({s:c,h:j===0});c=wd;}else c=(c+' '+wd).trim();}o.push({s:c,h:j===0});});return o;}
function tip(id,lines,block){lines=wrapL(lines);if(!G||!G.flags||G.flags['tip_'+id])return false;G.flags['tip_'+id]=1;if(!B)return false;(B.tips=B.tips||[]).push({id,lines,block:!!block,t:block?999:5.5});return true;}
const _updB_tip=updBattle;
updBattle=function(dt){if(B&&B.tips&&B.tips.length){const t=B.tips[0];if(t.block&&B.swirl>0){}else if(t.block){if(P.a||P.b){P.a=P.b=0;B.tips.shift();sfx('ok');}return;}t.t-=dt;if(t.t<=0)B.tips.shift();}
 _updB_tip(dt);if(!B||B.end)return;
 if(B.ember>=EMBER.max)tip('full',['EMBER FULL! Any hero now has a ★ Ember Art in their command list.','It spends 100 Ember for a big finisher. Use it before the gauge overheats.'],!!B.tut);
 if(B.ember>EMBER.overT)tip('over',['HEAT! Past the red line every action may burn the user.','Spend it on an Ember Art, or have Mira VENT HEAT to cool it into healing.']);
 if(B.pt.some(p=>p.chill))tip('chill',['CHILLED: the Hollow froze this hero\'s ATB (shown by ❄).','Lyra\'s Reignite or Mira\'s Vent Heat thaws them.']);};
const _drawB_tip=drawBattle;
drawBattle=function(){_drawB_tip();if(!B||!B.tips||!B.tips.length||B.swirl>0)return;const t=B.tips[0],h=14+t.lines.length*10,y=t.block?22:136-h;
 X.globalAlpha=t.block?1:Math.min(1,t.t);win(8,y,W-16,h);t.lines.forEach((l,i)=>txt(l.s,14,y+5+i*10,l.h?'#ffd860':'#fff',6));if(t.block)txt('A ▶',W-14,y+h-10,'#9cf',6,'right');X.globalAlpha=1;};
// ---------- early tutorial fight ----------
// A few steps into Ashen Vale the party always meets two Mire Slimes (weak to fire). The gauge starts warm so one or two
// fire hits fill it; blocking tips walk through EMBER -> weakness -> ★ Ember Art. Normal random encounters follow after.
XSTEP.push(()=>{if(G.map!=='world'||G.flags.tutFight||G.flags.boss||G.flags.noenc)return false;G.tutSteps=(G.tutSteps||0)+1;if(G.tutSteps<3)return false;G.flags.tutFight=1;
 dialog(['Something wet and glowing slops out of the grass!','Lyra: Slimes. They hate fire — watch this.'],()=>startTutorial());return true;});
function startTutorial(){startBattle(['slime','slime'],0);B.tut=1;B.ember=60;
 tip('ember',['EMBER GAUGE (bottom left) — the party\'s shared heat.','Fire hits and WEAKNESS hits make it climb. At 100, a ★ Ember Art unlocks.'],true);
 tip('weak',['Mire Slimes are WEAK to FIRE.','Choose Lyra > Magic > Ember. Weakness hits build Ember fastest.'],true);}
window.GUIDE={tip,startTutorial};

// ---------- (1) combat clarity: readable stagger ----------
// While a boss winds up (intent badge), a BREAK bar under the badge fills with damage; 10% of its max HP breaks the wind-up.
// Breaking it is now a moment: STAGGER! popup, shake, sparks, a message saying why, Ember +8, and the boss is left OPEN
// (defence down until its next action) - so good play shortens long boss fights instead of just cancelling one attack.
const TEL_HINT={heavy:'GUARD or BREAK',hollow:'VENT or BREAK',power:'BREAK IT',strike:'BREAK IT',open:'ATTACK NOW!'};
function onStagger(e){addNum(e,'STAGGER!','#ffe060');B.shake=8;burst(e,['#ffe060','#ffffff','#ff8040'],26,60,1);sfx('lvl');
 B.msg='STAGGER! Big hits broke '+e.n+'\'s wind-up.';B.lastStag=B.msg;e.atb=Math.min(e.atb||0,5);B.msgT=2.2;e.stagT=1.2;B.stagN=(B.stagN||0)+1;COMBAT.heat(8);
 if(!e.open){e.open=1;e.def0=e.def;e.def=Math.round(e.def*EMBER.openDef);}
 tip('stagger',['STAGGER: you dealt 10% of the boss\'s HP during its wind-up.','Its attack is cancelled and it is OPEN (defence down) until it acts again.']);}
window.onStagger=onStagger;
const _updB_tel=updBattle;
updBattle=function(dt){_updB_tel(dt);if(!B||B.end)return;B.en.forEach(e=>{if(e.stagT)e.stagT=Math.max(0,e.stagT-dt);
 if(e.boss&&e.tel&&e.telK&&e.telK!=='open')tip('telegraph',['WIND-UP! The coloured badge shows the boss\'s next move (red HEAVY, purple HOLLOW).','Deal 10% of its HP before it acts to STAGGER it - watch the BREAK bar.']);});};
const _drawB_tel=drawBattle;
drawBattle=function(){_drawB_tel();if(!B||B.swirl>0)return;B.en.forEach(u=>{if(!u.boss||u.hp<=0)return;const[x,y]=upos(u),px=x+30,py=y-24+Math.sin(T*4)*1.5,w=46;
 const k=u.telK||(u.open?'open':null);if(!k)return;
 if(u.tel&&k!=='open'){const f=Math.max(0,Math.min(1,(u.telHP-u.hp)/(u.mhp*0.1)));X.fillStyle='#000c';X.fillRect(px-1,py+11,w+2,5);X.fillStyle='#3a3020';X.fillRect(px,py+12,w,3);X.fillStyle=f>0.75?'#fff070':'#ffd040';X.fillRect(px,py+12,w*f,3);}
 txt(TEL_HINT[k]||'',px+w/2,py+(u.tel&&k!=='open'?17:12),k==='open'?'#80ffa0':'#ffe8b0',6,'center');
 if(u.stagT>0){X.globalAlpha=Math.min(1,u.stagT);txt('STAGGER!',x+52,y+10-(1.2-u.stagT)*10,'#ffe060',10,'center');X.globalAlpha=1;}});};

// ---------- (4) QoL: autosave + crash recovery, flavour-text throttle ----------
// Autosave to its own key on every map change / battle win (>=15s apart) and when the tab is hidden or closed. Saves are
// verified by reading them back. Continue / Load fall back to the autosave when it is newer than every slot.
const AKEY='emberfall_autosave';let lastAuto=-99,lastAutoMap=null;
function autosave(force){if(!G||!G.party||scene==='title'||scene==='battle'&&!force)return false;if(!force&&T-lastAuto<15&&G.map===lastAutoMap)return false;lastAuto=T;lastAutoMap=G.map;
 try{G._meta=typeof metaOf==='function'?metaOf(G):G._meta;G._ts=Date.now();const s=JSON.stringify(G);localStorage.setItem(AKEY,s);const ok=localStorage.getItem(AKEY)===s;if(ok)WART.autoT=2;return ok;}catch(e){return false;}}
const _save_a=save;save=function(...a){if(G)G._ts=Date.now();return _save_a(...a);};
const _enterMap_a=enterMap;enterMap=function(...a){_enterMap_a(...a);autosave();};
const _finishWin_a=finishWin;finishWin=function(){_finishWin_a();lastAuto=-99;setTimeout(()=>autosave(),0);};
addEventListener('visibilitychange',()=>{if(document.hidden)autosave(true);});addEventListener('pagehide',()=>autosave(true));
function autoNewer(){try{const a=JSON.parse(localStorage.getItem(AKEY)||'null');if(!a)return null;let best=0;for(let i=1;i<=3;i++){const s=JSON.parse(localStorage.getItem('emberfall_save_'+i)||'null');if(s&&s._ts)best=Math.max(best,s._ts);}return a._ts>best?a:null;}catch(e){return null;}}
const _load_a=load;load=function(i){const r=_load_a(i);if(!i){const a=autoNewer();if(a&&(!G||!G._ts||a._ts>G._ts))G=a;}return r;};
const _drawField_a=drawField;drawField=function(){_drawField_a();if(WART.autoT>0){WART.autoT-=1/60;X.globalAlpha=Math.min(1,WART.autoT);txt('✓ autosaved',W-6,H-12,'#9f9',6,'right');X.globalAlpha=1;}};
// Ambient flavour lines (Kael's chills etc.): at most one per map visit and never within 90s of the last one.
let flavLast=-999,flavMap=null;
window.flavorOK=function(){if(!G)return false;if(flavMap===G.map+'|'+(G._visit||0))return false;if(T-flavLast<90)return false;flavLast=T;flavMap=G.map+'|'+(G._visit||0);return true;};
const _enterMap_f=enterMap;enterMap=function(...a){_enterMap_f(...a);if(G)G._visit=(G._visit||0)+1;};
window.AUTOSAVE={autosave,autoNewer,AKEY};
