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
drawBattle=function(){_drawB_tip();if(!B||!B.tips||!B.tips.length||B.swirl>0)return;const t=B.tips[0],h=14+t.lines.length*10,y=22;
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
