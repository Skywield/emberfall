'use strict';
// Emberfall Chronicle (Skywield Games). All art generated in code.
const C=document.getElementById('c'),X=C.getContext('2d'),SC=3,W=256,H=224;
C.width=W*SC;C.height=H*SC;
function setT(){X.setTransform(SC,0,0,SC,0,0);X.imageSmoothingEnabled=false;}
setT();
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches||/touch=1/.test(location.search);
if(isTouch)document.body.classList.add('touch');
function resize(){const vw=innerWidth,vh=innerHeight,port=vh>vw;let ah=vh,aw=vw;
 if(isTouch&&port)ah=vh-190; if(isTouch&&!port)aw=vw-330;
 const s=Math.max(0.5,Math.min(aw/W,ah/H));C.style.width=(W*s)+'px';C.style.height=(H*s)+'px';
 document.getElementById('wrap').style.justifyContent=(isTouch&&port)?'flex-start':'center';
 document.getElementById('wrap').style.paddingTop=(isTouch&&port)?Math.max(8,(vh-190-H*s)/2)+'px':'0';}
addEventListener('resize',resize);resize();

// ---------- input ----------
const K={},P={};
function press(k){if(!K[k])P[k]=1;K[k]=1;initAudio();}
function rel(k){K[k]=0;}
const KM={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',
 KeyZ:'a',Enter:'a',Space:'a',KeyX:'b',Escape:'b',Backspace:'b',KeyC:'menu',KeyM:'menu',Tab:'menu'};
addEventListener('keydown',e=>{const k=KM[e.code];if(k){e.preventDefault();press(k);}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)rel(k);});
document.querySelectorAll('.btn').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('on');press(k);});
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{b.classList.remove('on');rel(k);}));});
C.addEventListener('pointerdown',()=>{if(isTouch)press('a');setTimeout(()=>rel('a'),60);});
let rep={};function held(k,dt){ // repeat for menus
 if(P[k]){rep[k]=0.35;return true;} if(K[k]){rep[k]-=dt;if(rep[k]<=0){rep[k]=0.09;return true;}} return false;}

// ---------- audio ----------
let AC=null,SBUS=null,MBUS=null;
const AOPT=Object.assign({mus:3,sfx:3},(()=>{try{return JSON.parse(localStorage.getItem('emberfall_audio'))||{}}catch(e){return{}}})());
const LV=[0,0.33,0.66,1];
function saveAOpt(){try{localStorage.setItem('emberfall_audio',JSON.stringify(AOPT));}catch(e){}applyVol();}
function applyVol(){if(!AC)return;const t=AC.currentTime;MBUS.gain.setTargetAtTime(LV[AOPT.mus]*0.55,t,0.05);SBUS.gain.setTargetAtTime(LV[AOPT.sfx],t,0.03);}
function initAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();SBUS=AC.createGain();MBUS=AC.createGain();SBUS.connect(AC.destination);MBUS.connect(AC.destination);applyVol();loadSamples();}catch(e){AC=null;}}
 if(AC&&AC.state==='suspended')AC.resume();}
// ---- sampled audio (ElevenLabs) ----
const SAMP={},SFILES={move:'sfx_cursor',ok:'sfx_confirm',no:'sfx_cancel',hit:'sfx_sword_hit',fire:'sfx_fire',ice:'sfx_ice',heal:'sfx_heal',lvl:'sfx_level_up'};
const MFILES={town:'music_town',world:'music_overworld',cave:'music_dungeon',battle:'music_battle',boss:'music_boss'};
function fetchBuf(name){return fetch('audio/'+name+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(a=>new Promise((ok,no)=>AC.decodeAudioData(a,ok,no)));}
function loadSamples(){for(const k in SFILES)fetchBuf(SFILES[k]).then(b=>SAMP[k]=b).catch(()=>{});}
function playSamp(k,v=0.8){const b=SAMP[k];if(!AC||!b)return false;const s=AC.createBufferSource(),g=AC.createGain();g.gain.value=v;s.buffer=b;s.connect(g);g.connect(SBUS);s.start();return true;}
// music: looping via overlapped copies with short crossfades at the loop seam; crossfade between tracks
const MXF=1.2,MBUF={},MLOAD={};let MUS={want:null,cur:null,voices:[],next:0};
function getMus(k){if(MBUF[k])return Promise.resolve(MBUF[k]);if(!MLOAD[k])MLOAD[k]=fetchBuf(MFILES[k]).then(b=>MBUF[k]=b).catch(()=>{MLOAD[k]=null;});return MLOAD[k];}
function musVoice(b,t,fadeIn){const s=AC.createBufferSource(),g=AC.createGain();s.buffer=b;s.connect(g);g.connect(MBUS);
 g.gain.setValueAtTime(fadeIn?0.0001:1,t);if(fadeIn)g.gain.exponentialRampToValueAtTime(1,t+MXF);const end=t+b.duration;
 g.gain.setValueAtTime(1,end-MXF);g.gain.linearRampToValueAtTime(0.0001,end);s.start(t);s.stop(end+0.05);const v={s,g,end};MUS.voices.push(v);s.onended=()=>{MUS.voices=MUS.voices.filter(x=>x!==v);};return v;}
function stopMus(){if(!AC)return;const t=AC.currentTime;MUS.voices.forEach(v=>{try{v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(v.g.gain.value,t);v.g.gain.linearRampToValueAtTime(0.0001,t+MXF*0.6);v.s.stop(t+MXF*0.6+0.05);}catch(e){}});MUS.voices=[];MUS.cur=null;}
function setMusic(k){if(!AC||MUS.want===k)return;MUS.want=k;if(!k){stopMus();return;}
 getMus(k).then(b=>{if(!b||MUS.want!==k||MUS.cur===k)return;stopMus();MUS.cur=k;const t=AC.currentTime+0.05;musVoice(b,t,true);MUS.next=t+b.duration-MXF;});}
function tickMusic(){if(!AC||!MUS.cur)return;const b=MBUF[MUS.cur];if(b&&AC.currentTime>MUS.next-0.5){const t=MUS.next;musVoice(b,t,true);MUS.next=t+b.duration-MXF;}}
function musicFor(){if(XSCN[scene]&&XSCN[scene].mus)return XSCN[scene].mus();if(scene==='battle'&&B)return B.boss?'boss':'battle';if(scene==='map')return MAPS[G.map].mus||(MFILES[G.map]?G.map:'town');if(scene==='title'||scene==='intro'||scene==='ending')return 'town';return null;}
function tone(f,d,type='square',v=0.06,slide=0,delay=0){if(!AC)return;const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();
 o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(SBUS);o.start(t);o.stop(t+d);}
function noise(d,v=0.08){if(!AC)return;const b=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);
 const s=AC.createBufferSource(),g=AC.createGain();g.gain.value=v;s.buffer=b;s.connect(g);g.connect(SBUS);s.start();}
const SFX={move:()=>tone(880,0.04,'square',0.03),ok:()=>{tone(660,0.06);tone(990,0.08,'square',0.05,0,0.05)},no:()=>tone(160,0.12,'square',0.05),
 hit:()=>{noise(0.12,0.12);tone(180,0.1,'sawtooth',0.05,-100)},crit:()=>{noise(0.2,0.15);tone(300,0.2,'sawtooth',0.06,-250)},
 fire:()=>{noise(0.35,0.1);tone(220,0.35,'sawtooth',0.04,400)},ice:()=>{for(let i=0;i<5;i++)tone(1200+i*200,0.08,'triangle',0.04,0,i*0.04)},
 bolt:()=>{noise(0.25,0.15);tone(90,0.3,'square',0.06,600)},heal:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,0.15,'triangle',0.05,0,i*0.06))},
 enc:()=>{[220,330,440,660,880].forEach((f,i)=>tone(f,0.1,'square',0.05,0,i*0.05))},lvl:()=>{[523,659,784,1046,1318].forEach((f,i)=>tone(f,0.18,'square',0.05,0,i*0.09))},
 win:()=>{[392,392,392,523,659,523,784].forEach((f,i)=>tone(f,0.16,'square',0.05,0,i*0.12))},coin:()=>{tone(988,0.06);tone(1318,0.15,'square',0.05,0,0.06)},
 step:()=>tone(90,0.03,'triangle',0.02)};
function sfx(n){try{if(!AOPT.sfx)return;if(SFILES[n]&&playSamp(n,n==='move'?0.5:0.8))return;SFX[n]&&SFX[n]();}catch(e){}}

// ---------- sprites ----------
function mkSpr(rows,pal){const h=rows.length,w=Math.max(...rows.map(r=>r.length));const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const p=pal[r[x]];if(p){g.fillStyle=p;g.fillRect(x,y,1,1);}}});return c;}
function flip(c){const d=document.createElement('canvas');d.width=c.width;d.height=c.height;const g=d.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(c,0,0);return d;}
const BODY=["..kOOAAOOk..",".kOOOAAOOOk.","ksOOOAAOOOsk","ksOOOAAOOOsk",".kkLLLLLLkk."];
const LEG=[["..kLLkkLLk..","..kbbkkbbk..","..kkk..kkk.."],["..kLLk.kLLk.","..kbbk.kkk..","..kkk......."],["..kLLk.kLLk.","..kkk..kbbk.","........kkk."]];
const HEADS={down:["...kkkkkk...","..kHHHHHHk..",".kHHhHHHHHk.",".kHHHHHHHHk.",".kHssssssHk.","..ksessesk..","..kssssssk..","...kkssk...."],
 up:["...kkkkkk...","..kHHHHHHk..",".kHHHHHHHHk.",".kHHHhHHHHk.",".kHHHHHHHHk.","..kHHHHHHk..","..kHHHHHHk..","...kkkkkk..."],
 side:["...kkkkkk...","..kHHHHHHk..",".kHHhHHHHHk.",".kHHHHHHssk.",".kHHHssssek.","..kHHsssskk.","..kHssssk...","...kkssk...."]};
function charSet(pal){const P={k:'#1a1020',e:'#1a1020',...pal};const out={};
 for(const d of ['down','up','side']){out[d]=LEG.map(l=>mkSpr([...HEADS[d],...BODY,...l],P));}
 out.right=out.side;out.left=out.side.map(flip);return out;}
const HEROPAL={kael:{H:'#c0392b',h:'#ff7b5c',s:'#f4c9a0',O:'#3a5fa8',A:'#d8d8e8',L:'#2b2b45',b:'#6b4426'},
 lyra:{H:'#c9b8ff',h:'#f2ecff',s:'#f8d8c0',O:'#6a2c91',A:'#f0c040',L:'#3a1f55',b:'#4a2a1a'},
 mira:{H:'#f2c14e',h:'#fff0a0',s:'#f6d2b0',O:'#e8e8f0',A:'#2e9e6a',L:'#7a8a9a',b:'#8a5a2a'}};
const NPCPAL={elder:{H:'#d8d8d8',h:'#ffffff',s:'#e0b890',O:'#6b4a2a',A:'#c8a050',L:'#4a3020',b:'#3a2010'},
 kid:{H:'#5a3a1a',h:'#8a5a2a',s:'#f4c9a0',O:'#d86030',A:'#f0e060',L:'#3060a0',b:'#3a2010'},
 guard:{H:'#8a94a8',h:'#d0d8e8',s:'#e0b890',O:'#707a90',A:'#c0392b',L:'#40485a',b:'#2a2a2a'},
 merch:{H:'#2a1a3a',h:'#5a3a7a',s:'#f0c8a0',O:'#2e8a8a',A:'#f0d060',L:'#5a3a2a',b:'#2a1a0a'},
 inn:{H:'#e08040',h:'#ffb070',s:'#f4c9a0',O:'#a83850',A:'#ffffff',L:'#5a2a3a',b:'#3a1a1a'}};
// fspr: draws a field frame at its old 12x16 anchor; painted 48x64 frames (field.js) draw 16x21 bottom-aligned
function fspr(c,x,y){if(c.width===48)X.drawImage(c,x-2,y+16-64/3,16,64/3);else X.drawImage(c,x,y);}
const SPR={};for(const k in HEROPAL)SPR[k]=charSet(HEROPAL[k]);for(const k in NPCPAL)SPR[k]=charSet(NPCPAL[k]);

const EN_ART={
 slime:{rows:["................","................","................","......kkkk......","....kkGGGGkk....","...kGGWWGGGGk...","..kGGWGGGGGGGk..","..kGGGGGGGGGGk..",".kGGGkkGGkkGGGk.",".kGGGkkGGkkGGGk.",".kGGGGGGGGGGGGk.",".kgGGGGkkkGGGgk.","..kggGGGGGGggk..","...kkggggggkk...","....kkkkkkkk....","................"],
  pal:{k:'#0a2a10',G:'#3ccf5a',g:'#20904a',W:'#d8ffe0'}},
 bat:{rows:["................","................","k..............k","kk....k..k....kk","kWk...kkkk...kWk","kWWk.kPPPPk.kWWk","kWWWkPPPPPPkWWWk",".kWWkPrPPrPkWWk.",".kWWkPPPPPPkWWk.","..kWkPkPPkPkWk..","...kkkPPPPkkk...","......kkkk......","................","................","................","................"],
  pal:{k:'#140818',W:'#5a2a7a',P:'#8a4aa8',r:'#ff3040'}},
 goblin:{rows:["................",".....kkkkkk.....","....kGGGGGGk....","..kkGrGGGGrGkk..",".kGkGGGGGGGGkGk.","..k.kGkWWkGk.k..",".....kGGGGk.....","....kBBBBBBk.k..","...kGkBBBBkGkWk.","...kGkBBBBkGkWk.","....kkBBBBkk.Wk.",".....kBkkBk..kk.",".....kGk.kGk....","....kkk..kkk....","................","................"],
  pal:{k:'#101a08',G:'#7aa83a',r:'#ffd020',W:'#c8c8c8',B:'#7a4a2a'}},
 wisp:{rows:["................",".......kk.......","......kYYk......",".....kYWWYk.....","....kYWWWWYk....","...kYWWbWbWYk...","...kYWWWWWWYk...","....kYWWWWYk....",".....kYYYYk.....","......kYYk......",".......kYk......","........k.......","................","................","................","................"],
  pal:{k:'#20305a',Y:'#60a0ff',W:'#d8f0ff',b:'#20305a'}},
 skeleton:{rows:[".....kkkkk......","....kWWWWWk.....","....kWkWkWk.....","....kWWWWWk.....",".....kWkWk......","...kkkWWWkkk..k.","..kW.kWWWk.Wk.kW","..kW.kWkWk.Wk.kW","..kW.kWWWk.WkkWk","....k.kWk.k..kW.",".....kWkWk....k.",".....kWkWk......",".....kW.kW......","....kkW.kWk.....","....kkk.kkk.....","................"],
  pal:{k:'#1a1418',W:'#e8e0c8'}},
 boss:{rows:["....kk..............kk....","...kRRk............kRRk...","...kRRRk..kkkkkk..kRRRk...","....kRRkkkDDDDDDkkkRRk....",".....kkDDDDDDDDDDDDkk.....","....kDDDDDDDDDDDDDDDDk....","...kDDDYYkDDDDDDkYYDDDk...","...kDDDYrYkDDDDkYrYDDDk...","...kDDDDYYkDDDDkYYDDDDk...","..kDDDDDDDDDDDDDDDDDDDDk..","..kDDDkWkWkWkWkWkWkDDDDk..","..kDDDkWWWWWWWWWWWWkDDDk..","..kDDDkkWkWkWkWkWkkkDDDk..",".kDPPDDDkkkkkkkkkkDDDPPDk.",".kDPPPDDDDDDDDDDDDDDPPPDk.","kDDPPPPDDDDPPPPDDDDPPPPDDk","kDDkPPPDDDPPPPPPDDDPPPkDDk","kDk.kPPDDDDPPPPDDDDPPk.kDk","kWk..kkDDDDDDDDDDDDkk..kWk","kWWk..kDDDkkkkkkDDDk..kWWk",".kWk..kDDk......kDDk..kWk.","..k..kDDDk......kDDDk..k..","....kWWWk........kWWWk....","....kkkkk........kkkkk...."],
  pal:{k:'#0a0610',D:'#3a2a4a',P:'#6a3a8a',R:'#a83040',Y:'#ff8020',r:'#fff060',W:'#d8d0c0'}}};
EN_ART.crawler=EN_ART.goblin;
for(const k in EN_ART)EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal);

// ---------- painted battle sprites (art/game, 3x logical) ----------
const PAINT={};const PMAP={kael:'kael',lyra:'lyra',mira:'mira',skeleton:'bone_sentry',crawler:'cave_beast',boss:'gravemaw'};
function loadPaint(k,f){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
 g.globalCompositeOperation='source-atop';g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);PAINT[k]={im,white:c,w:im.width/SC,h:im.height/SC};};im.src='art/game/'+f+'.png';}
for(const k in PMAP)loadPaint(k,PMAP[k]);
function drawPaint(k,cx,by,opt={}){const p=PAINT[k];if(!p)return false;const w=p.w*(opt.sc||1),h=p.h*(opt.sc||1);X.save();X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';
 X.translate(cx,by);if(opt.flip)X.scale(-1,1);if(opt.rot)X.rotate(opt.rot);X.globalAlpha=opt.alpha??1;X.drawImage(p.im,-w/2,-h,w,h);
 if(opt.flash>0){X.globalAlpha=Math.min(1,opt.flash)*(opt.alpha??1)*0.85;X.drawImage(p.white,-w/2,-h,w,h);}X.restore();return true;}
// ---------- tiles ----------
let seed=1;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
function tileCanvas(fn){const c=document.createElement('canvas');c.width=16;c.height=16;fn(c.getContext('2d'));return c;}
function px(g,c,x,y,w=1,h=1){g.fillStyle=c;g.fillRect(x,y,w,h);}
function grass(g){px(g,'#4a9a3a',0,0,16,16);for(let i=0;i<14;i++)px(g,rnd()<.5?'#5ab04a':'#3a8a2e',rnd()*16|0,rnd()*16|0,1,2);}
const TILES={
 '.':[tileCanvas(grass)],
 'f':[tileCanvas(g=>{grass(g);[[3,4,'#ff6080'],[10,9,'#ffe060'],[6,12,'#ffffff'],[12,3,'#80b0ff']].forEach(([x,y,c])=>{px(g,c,x,y,2,2);px(g,'#2a6a20',x,y+2,1,2);});})],
 ',':[tileCanvas(g=>{px(g,'#c8a868',0,0,16,16);for(let i=0;i<10;i++)px(g,rnd()<.5?'#b09050':'#d8bc80',rnd()*16|0,rnd()*16|0,2,1);})],
 'T':[tileCanvas(g=>{grass(g);px(g,'#5a3a1a',7,11,2,5);px(g,'#1e5a28',2,2,12,10);px(g,'#2a7a34',3,1,10,9);px(g,'#3a9a44',5,2,5,4);px(g,'#0e3a18',2,11,12,1);})],
 '~':[0,1].map(f=>tileCanvas(g=>{px(g,'#2a5ab8',0,0,16,16);for(let i=0;i<4;i++)px(g,'#6aa0f0',((i*5+f*3)%14),(i*4+2)%16,3,1);px(g,'#1a4090',0,15,16,1);})),
 'B':[tileCanvas(g=>{px(g,'#2a5ab8',0,0,16,16);px(g,'#8a5a2a',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#6a4020',x,2,1,12);px(g,'#5a3418',0,2,16,1);px(g,'#5a3418',0,13,16,1);})],
 'm':[tileCanvas(g=>{grass(g);px(g,'#6a6a7a',1,4,14,12);px(g,'#8a8a9a',3,2,10,10);px(g,'#aaaabc',6,1,4,4);px(g,'#ffffff',7,1,2,2);px(g,'#4a4a5a',1,14,14,2);})],
 'R':[tileCanvas(g=>{px(g,'#a83a2a',0,0,16,16);for(let y=0;y<16;y+=4){px(g,'#7a2418',0,y+3,16,1);for(let x=(y%8?2:0);x<16;x+=4)px(g,'#c85a40',x,y,2,1);}})],
 'W':[tileCanvas(g=>{px(g,'#e0d0b0',0,0,16,16);px(g,'#8a6a40',0,0,16,2);px(g,'#8a6a40',0,0,2,16);px(g,'#6a8ac8',5,5,6,6);px(g,'#4a3a2a',5,5,6,1);px(g,'#4a3a2a',7,5,1,6);px(g,'#b8a888',0,14,16,2);})],
 'D':[tileCanvas(g=>{px(g,'#e0d0b0',0,0,16,16);px(g,'#6a4020',3,2,10,14);px(g,'#8a5a2a',4,3,8,13);px(g,'#f0d060',10,9,1,2);})],
 'F':[tileCanvas(g=>{grass(g);px(g,'#c8a060',0,5,16,2);px(g,'#c8a060',0,10,16,2);for(let x=1;x<16;x+=5)px(g,'#8a6030',x,3,2,11);})],
 'V':[tileCanvas(g=>{grass(g);px(g,'#a83a2a',2,3,7,4);px(g,'#e0d0b0',3,7,5,5);px(g,'#a83a2a',8,6,6,3);px(g,'#e0d0b0',9,9,4,4);px(g,'#4a3020',5,9,1,3);})],
 'O':[tileCanvas(g=>{px(g,'#5a5a6a',0,0,16,16);px(g,'#7a7a8a',1,1,14,6);px(g,'#0a0a12',4,5,8,11);px(g,'#1a1a28',5,4,6,2);})],
 ':':[tileCanvas(g=>{px(g,'#3a3448',0,0,16,16);for(let i=0;i<8;i++)px(g,rnd()<.5?'#4a4458':'#2e2a3a',rnd()*16|0,rnd()*16|0,2,1);})],
 'X':[tileCanvas(g=>{px(g,'#1a1624',0,0,16,16);px(g,'#2a2438',1,1,6,5);px(g,'#2a2438',9,3,6,5);px(g,'#2a2438',3,9,7,5);px(g,'#3a3450',1,1,6,1);px(g,'#3a3450',9,3,6,1);px(g,'#3a3450',3,9,7,1);})],
 'c':[tileCanvas(g=>{px(g,'#3a3448',0,0,16,16);px(g,'#5a3418',2,5,12,10);px(g,'#8a5a2a',3,6,10,8);px(g,'#f0c040',2,9,12,1);px(g,'#f0e080',7,8,2,3);})],
 'o':[tileCanvas(g=>{px(g,'#3a3448',0,0,16,16);px(g,'#5a3418',2,7,12,8);px(g,'#2a1a0a',3,8,10,3);px(g,'#8a5a2a',2,3,12,4);})],
 'S':[tileCanvas(g=>{px(g,'#9a9aa8',0,0,16,16);for(let y=0;y<16;y+=4)px(g,'#7a7a88',0,y,16,1);px(g,'#7a7a88',8,0,1,16);})],
};
// cliff face: grass lip on top, layered rock below (drawn where land drops into open sky)
TILES.q=[tileCanvas(g=>{px(g,'#4a9a3a',0,0,16,3);px(g,'#3a7a2e',0,3,16,1);px(g,'#7a6a58',0,4,16,12);px(g,'#958470',0,4,16,2);
 for(let i=0;i<6;i++){const x=(i*5+2)%15;px(g,'#5a4c3e',x,5+(i*3)%8,1,4);px(g,'#a89880',x+1,6+(i*3)%8,2,1);}px(g,'#5a4c3e',0,10,16,1);px(g,'#4a3e32',0,14,16,2);})];
const SOLID=new Set(['T','~','m','R','W','F','X','c','o','q']);

// ---------- data ----------
const SK={cleave:{n:'Cleave',mp:6,tgt:'allE',type:'phys',pow:0.8,fx:'slash',d:'Strike all foes'},
 cry:{n:'War Cry',mp:5,tgt:'allP',type:'buff',fx:'buff',d:'Party ATK up'},
 rising:{n:'Rising Edge',mp:9,tgt:'E',type:'phys',pow:2.1,fx:'slash',lv:3,d:'Heavy strike'},
 ember:{n:'Ember',mp:4,tgt:'E',type:'mag',pow:1.25,el:'fire',fx:'fire',d:'Fire, one foe'},
 frost:{n:'Frost Lance',mp:6,tgt:'E',type:'mag',pow:1.45,el:'ice',fx:'ice',d:'Ice, one foe'},
 storm:{n:'Tempest',mp:12,tgt:'allE',type:'mag',pow:1.0,el:'bolt',fx:'bolt',lv:3,d:'Lightning, all'},
 mend:{n:'Mend',mp:5,tgt:'P',type:'heal',pow:1.7,fx:'heal',d:'Heal one ally'},
 sanct:{n:'Sanctuary',mp:12,tgt:'allP',type:'heal',pow:1.0,fx:'heal',lv:3,d:'Heal party'},
 rekindle:{n:'Rekindle',mp:14,tgt:'Pdead',type:'revive',fx:'heal',lv:2,d:'Revive ally'}};
const ITEMS={potion:{n:'Potion',p:30,heal:70,tgt:'P',d:'Restore 70 HP'},ether:{n:'Ether',p:60,mpr:25,tgt:'P',d:'Restore 25 MP'},
 bloom:{n:'Lifebloom',p:120,rev:true,tgt:'Pdead',d:'Revive at 50% HP'},tonic:{n:'Hearth Tonic',p:200,heal:999,mpr:999,tgt:'P',d:'Fully restore'}};
const EQ={bronze:{n:'Bronze Sword',slot:'w',who:'kael',atk:4,p:0},steel:{n:'Steelfang',slot:'w',who:'kael',atk:12,p:220},
 ash:{n:'Ash Wand',slot:'w',who:'lyra',atk:1,mag:3,p:0},runed:{n:'Runed Rod',slot:'w',who:'lyra',atk:2,mag:10,p:200},
 mace:{n:'Oak Mace',slot:'w',who:'mira',atk:3,mag:2,p:0},silver:{n:'Silver Mace',slot:'w',who:'mira',atk:8,mag:7,p:200},
 tunic:{n:'Cloth Tunic',slot:'a',def:2,p:0},chain:{n:'Chain Vest',slot:'a',def:7,p:150},ward:{n:'Warded Cloak',slot:'a',def:5,mdef:6,p:180}};
const HERO_DEF={kael:{name:'Kael',role:'Vanguard',sk:['cleave','cry','rising'],skn:'Arts',hp:130,mp:14,atk:14,def:10,mag:4,spd:9,g:{hp:20,mp:2,atk:3,def:2,mag:1,spd:.4},w:'bronze'},
 lyra:{name:'Lyra',role:'Arcanist',sk:['ember','frost','storm'],skn:'Magic',hp:74,mp:42,atk:6,def:5,mag:16,spd:11,g:{hp:9,mp:6,atk:1,def:1,mag:3,spd:.5},w:'ash'},
 mira:{name:'Mira',role:'Cleric',sk:['mend','rekindle','sanct'],skn:'Prayer',hp:90,mp:34,atk:9,def:7,mag:12,spd:10,g:{hp:13,mp:5,atk:2,def:1.5,mag:2,spd:.45},w:'mace'}};
const EN={slime:{n:'Mire Slime',hp:42,atk:10,def:3,mag:4,spd:6,xp:9,g:6,weak:'fire'},bat:{n:'Dusk Bat',hp:34,atk:11,def:2,mag:3,spd:14,xp:10,g:5,weak:'bolt'},
 goblin:{n:'Thorn Imp',hp:62,atk:13,def:6,mag:3,spd:9,xp:15,g:12,weak:'ice'},wisp:{n:'Grave Wisp',hp:48,atk:6,def:4,mag:14,spd:11,xp:18,g:10,weak:'ice',res:'fire',caster:1},
 crawler:{n:'Hollow Crawler',hp:115,atk:18,def:8,mag:3,spd:7,xp:28,g:20,weak:'bolt',res:'ice'},
 skeleton:{n:'Bone Sentry',hp:90,atk:17,def:9,mag:3,spd:8,xp:22,g:16,weak:'fire'},
 boss:{n:'Gravemaw',hp:1100,atk:23,def:12,mag:19,spd:10,xp:400,g:500,weak:'bolt',boss:1}};

const MAPS={
 town:{name:'Thornwick Village',bg:'.',rows:[
"TTTTTTTTTTTTTTTTTTTT","T..f......,.....f..T","T.RRRR....,...RRRR.T","T.RRRR....,...RRRR.T","T.WDWW....,...WWDW.T","T....,,,,,,,,,,,...T",
"T.f..,....~~..,..f.T","T....,....~~..,....T","T....,,,,,,,,,,,...T","T.FFF,..RRRRR.,....T","T....,..RRRRR.,..f.T","T..f.,..WWDWW.,....T",
"T....,....,...,....T","T....,,,,,,,,,,....T","T.........,........T","TTTTTTTTTT,TTTTTTTTT"],
  enc:0,warps:[{x:10,y:15,to:'world',tx:2,ty:4,d:'down'}],doors:{'3,4':'inn','16,4':'shop','10,11':'elder'}},
 world:{name:'Ashen Vale',rows:[
"mmmmmmmmmmmmmmmmmmmmmmmm","mmm..TT......~~~...mmmmm","mm..TTT......~~~..mmmmmm","m.V,,,,......~~~..mmOmmm","m..TT.,......~~~..mm,mmm",
"m.....,,,,,,,BBB,,,,,.mm","m..T.........~~~.....TTm","m.TTT..f.....~~~..f..TTm","m.T..........~~~.......m","m....f..TT...~~~...T...m",
"m.......TTT..~~~..TTT..m","mm...........~~~......mm","mmm.....f....~~~.....mmm","mmmmmmmmmmmmmmmmmmmmmmmm"],
  enc:30,pool:[['slime','slime'],['bat'],['slime','bat'],['goblin'],['bat','bat']],warps:[{x:2,y:3,to:'town',tx:10,ty:14,d:'up'},{x:20,y:3,to:'cave',tx:11,ty:14,d:'up'}]},
 cave:{name:'Hollowdeep Cavern',dark:1,rows:[
"XXXXXXXXXXXXXXXXXXXXXXXX","XXXXXXXXXX::::XXXXXXXXXX","XXXXXXXXX::::::XXXXXXXXX","XXXXXXXXX::::::XXXXXXXXX","XXXXXXXXXXX::XXXXXXXXXXX",
"Xc:::::XXXX::XXXX::::cXX","X::XX::::::::::::::XX:XX","X::XX:XXXXXXXXXXXX:XX:XX","X:::::XXXXXXXXXXXX::::XX","XXX:XXXXXXXXXXXXXXXX:XXX",
"XXX:::::::::::::::::::XX","XXXXXXXXXX::::XXXXXXXXXX","XXXXXXXXXX:c::XXXXXXXXXX","XXXXXXXXXX::::XXXXXXXXXX","XXXXXXXXXXX::XXXXXXXXXXX","XXXXXXXXXXXOOXXXXXXXXXXX"],
  enc:14,pool:[['skeleton'],['wisp','bat'],['goblin','wisp'],['skeleton','slime'],['wisp','wisp','bat'],['goblin','goblin'],['crawler'],['crawler','wisp']],
  warps:[{x:11,y:15,to:'world',tx:20,ty:4,d:'down'},{x:12,y:15,to:'world',tx:20,ty:4,d:'down'}],
  chests:{'1,5':'ether','21,5':'tonic','11,12':'bloom'}}};
for(const k in MAPS){const m=MAPS[k];m.w=Math.max(...m.rows.map(r=>r.length));m.rows=m.rows.map(r=>r.padEnd(m.w,r[0]));m.h=m.rows.length;}

const NPCS={town:[
 {x:7,y:7,s:'elder',d:'down',lines:()=>G.flags.boss?['Elder Bran: The vale breathes again. Thornwick owes you everything.']:
   ['Elder Bran: Kael, Lyra, Mira... you came.','The Ember Crown shattered, and its shards fell into Hollowdeep Cavern.','Something wakes there. Gravemaw, the Hollow Warden, feeds on the shard\'s light.','Rest at the inn, buy what you need from Tessa, then go east through Ashen Vale.']},
 {x:13,y:12,s:'kid',d:'left',wander:1,lines:()=>['Tam: I saw glowing bats by the river!','Tam: Mom says Lyra\'s fire spells work best on slimes.']},
 {x:11,y:14,s:'guard',d:'down',lines:()=>['Guard Hollis: The road east leads to Ashen Vale.','Bone Sentries in the cave hate fire. Wisps hate the cold. Remember that.']},
 {x:17,y:5,s:'merch',d:'down',act:()=>openShop(),lines:()=>['Tessa: Shop\'s right behind me. Better blades, better odds!']},
 {x:2,y:5,s:'inn',d:'down',act:()=>openInn(),lines:()=>['Marla: Inn\'s open! A warm bed is 20G. Rest restores HP and MP.']},
 {x:2,y:12,s:'kid',d:'right',lines:()=>['Wren: Press MENU to check your gear. Equip new weapons after you buy them!']}]};

// ---------- game state ----------
let G;
function newMember(id){const d=HERO_DEF[id];return {id,name:d.name,lv:1,xp:0,hp:d.hp,mp:d.mp,b:{hp:d.hp,mp:d.mp,atk:d.atk,def:d.def,mag:d.mag,spd:d.spd},w:d.w,a:'tunic'};}
function newGame(){G={party:['kael','lyra','mira'].map(newMember),gold:120,items:{potion:4,ether:1},eq:{},map:'town',x:10,y:13,d:'up',flags:{},steps:0,time:0};}
function st(m){const e1=EQ[m.w]||{},e2=EQ[m.a]||{};return {hp:m.b.hp|0,mp:m.b.mp|0,atk:(m.b.atk+(e1.atk||0)+(e2.atk||0))|0,def:(m.b.def+(e1.def||0)+(e2.def||0))|0,
 mag:(m.b.mag+(e1.mag||0))|0,mdef:((m.b.def*0.6+m.b.mag*0.4)+(e2.mdef||0)+(e2.def||0)*0.5)|0,spd:m.b.spd|0};}
const xpNext=lv=>Math.floor(18*Math.pow(lv,1.6));
function save(){localStorage.setItem('emberfall_save',JSON.stringify(G));}
function hasSave(){return !!localStorage.getItem('emberfall_save');}
function load(){G=JSON.parse(localStorage.getItem('emberfall_save'));}

// ---------- drawing helpers ----------
function win(x,y,w,h){const g=X.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#3048c8');g.addColorStop(1,'#0c1660');
 X.fillStyle='#000a';X.fillRect(x+2,y+2,w,h);X.fillStyle=g;X.fillRect(x+1,y+1,w-2,h-2);
 X.fillStyle='#e8ecff';X.fillRect(x+2,y,w-4,1);X.fillRect(x+2,y+h-1,w-4,1);X.fillRect(x,y+2,1,h-4);X.fillRect(x+w-1,y+2,1,h-4);
 X.fillRect(x+1,y+1,1,1);X.fillRect(x+w-2,y+1,1,1);X.fillRect(x+1,y+h-2,1,1);X.fillRect(x+w-2,y+h-2,1,1);
 X.fillStyle='#8890c0';X.fillRect(x+2,y+1,w-4,1);X.fillRect(x+1,y+2,1,h-4);}
function txt(s,x,y,c='#fff',sz=8,al='left'){X.font=`bold ${sz}px "Courier New",monospace`;X.textAlign=al;X.textBaseline='top';
 X.fillStyle='#000';X.fillText(s,x+0.6,y+0.6);X.fillStyle=c;X.fillText(s,x,y);}
function cursor(x,y){const b=Math.sin(T*10)*1.2;X.fillStyle='#000';X.beginPath();X.moveTo(x+b+1,y+1);X.lineTo(x+b+7,y+4.5);X.lineTo(x+b+1,y+8);X.fill();
 X.fillStyle='#fff';X.beginPath();X.moveTo(x+b,y);X.lineTo(x+b+6,y+3.5);X.lineTo(x+b,y+7);X.fill();}
function bar(x,y,w,v,c1,c2){X.fillStyle='#000';X.fillRect(x-0.5,y-0.5,w+1,3);X.fillStyle='#223';X.fillRect(x,y,w,2);const g=X.createLinearGradient(x,0,x+w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);X.fillStyle=g;X.fillRect(x,y,w*Math.max(0,Math.min(1,v)),2);}
function wrap(s,n){const o=[];let l='';for(const w of s.split(' ')){if((l+' '+w).trim().length>n){o.push(l);l=w;}else l=(l+' '+w).trim();}if(l)o.push(l);return o;}

// ---------- UI stack ----------
let UI=[];let T=0,fade=0,fadeCb=null,fadeDir=0;
function transition(cb){fadeDir=1;fadeCb=cb;}
function dialog(lines,cb){UI.push({k:'dlg',lines:[...lines],i:0,ch:0,cb});}
function choice(prompt,opts,cb){UI.push({k:'choice',prompt,opts,i:0,cb});}
function toast(s){UI.push({k:'dlg',lines:[s],i:0,ch:0});}

function updDlg(u,dt){u.ch+=dt*60;const L=u.lines[u.i];if(P.a||P.b){if(u.ch<L.length)u.ch=999;else{u.i++;u.ch=0;sfx('move');if(u.i>=u.lines.length){UI.pop();u.cb&&u.cb();}}}}
function drawDlg(u){const L=u.lines[u.i]||'';win(6,H-62,W-12,56);let who='',t=L;const m=L.match(/^([^:]{2,20}): (.*)$/);if(m){who=m[1];t=m[2];}
 let y=H-56;if(who){txt(who,14,y,'#ffd860');y+=11;}const vis=t.slice(0,Math.floor(u.ch));wrap(vis,44).forEach((l,i)=>txt(l,14,y+i*10));
 if(u.ch>=L.length&&Math.sin(T*8)>0){X.fillStyle='#fff';X.fillRect(W-20,H-14,5,3);X.fillRect(W-19,H-11,3,1);}}
function updChoice(u,dt){if(held('up',dt)){u.i=(u.i+u.opts.length-1)%u.opts.length;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%u.opts.length;sfx('move');}
 if(P.a){sfx('ok');UI.pop();u.cb(u.i);}else if(P.b){sfx('no');UI.pop();u.cb(u.opts.length-1);}}
function drawChoice(u){win(6,H-62,W-12,56);wrap(u.prompt,44).forEach((l,i)=>txt(l,14,H-56+i*10));const wx=W-90,wy=H-70-u.opts.length*12;win(wx,wy,80,u.opts.length*12+8);
 u.opts.forEach((o,i)=>{txt(o,wx+16,wy+5+i*12);if(i===u.i)cursor(wx+5,wy+5+i*12);});}

// ---------- field menu ----------
function openMenu(){UI.push({k:'menu',i:0,sub:null});sfx('ok');}
const MOPTS=['Items','Equip','Status','Music','Sound FX','Save','Close'];
const VOLTXT=['Off','Low','Mid','High'];
function updMenu(u,dt){const s=u.sub;
 if(!s){if(held('up',dt)){u.i=(u.i+MOPTS.length-1)%MOPTS.length;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%MOPTS.length;sfx('move');}
  if(MOPTS[u.i]==='Music'||MOPTS[u.i]==='Sound FX'){const key=MOPTS[u.i]==='Music'?'mus':'sfx';let d=held('right',dt)?1:held('left',dt)?-1:0;if(P.a)d=AOPT[key]?-AOPT[key]:3;if(d){AOPT[key]=Math.max(0,Math.min(3,AOPT[key]+d));saveAOpt();sfx('move');return;}}
  if(P.b||P.menu){UI.pop();sfx('no');return;}
  if(P.a){sfx('ok');const o=MOPTS[u.i];if(o==='Close')UI.pop();else if(o==='Save'){save();toast('Game saved to this browser.');}
   else if(o==='Items')u.sub={k:'items',i:0,pick:-1};else if(o==='Equip')u.sub={k:'eqwho',i:0};else if(o==='Ship'&&XUI.shipinfo)UI.push({k:'shipinfo'});else u.sub={k:'status',i:0};}return;}
 if(s.k==='status'){if(held('left',dt)||held('up',dt)){s.i=(s.i+2)%3;sfx('move');}if(held('right',dt)||held('down',dt)){s.i=(s.i+1)%3;sfx('move');}if(P.b||P.a){u.sub=null;sfx('no');}}
 else if(s.k==='items'){const L=Object.keys(G.items).filter(k=>G.items[k]>0);
  if(s.pick<0){if(!L.length){if(P.a||P.b)u.sub=null;return;}s.i=Math.min(s.i,L.length-1);
   if(held('up',dt)){s.i=(s.i+L.length-1)%L.length;sfx('move');}if(held('down',dt)){s.i=(s.i+1)%L.length;sfx('move');}
   if(P.b){u.sub=null;sfx('no');}else if(P.a){s.pick=0;sfx('ok');}}
  else{if(held('up',dt)){s.pick=(s.pick+2)%3;sfx('move');}if(held('down',dt)){s.pick=(s.pick+1)%3;sfx('move');}
   if(P.b){s.pick=-1;sfx('no');}else if(P.a){const id=L[s.i],m=G.party[s.pick];if(useItem(id,m)){sfx('heal');G.items[id]--;if(!G.items[id]){delete G.items[id];s.pick=-1;}}else sfx('no');}}}
 else if(s.k==='eqwho'){if(held('up',dt)){s.i=(s.i+2)%3;sfx('move');}if(held('down',dt)){s.i=(s.i+1)%3;sfx('move');}if(P.b){u.sub=null;sfx('no');}
  else if(P.a){u.sub={k:'eqslot',who:s.i,i:0};sfx('ok');}}
 else if(s.k==='eqslot'){if(held('up',dt)||held('down',dt)){s.i^=1;sfx('move');}if(P.b){u.sub={k:'eqwho',i:s.who};sfx('no');}
  else if(P.a){u.sub={k:'eqlist',who:s.who,slot:s.i?'a':'w',i:0};sfx('ok');}}
 else if(s.k==='eqlist'){const m=G.party[s.who],L=eqChoices(m,s.slot);if(held('up',dt)){s.i=(s.i+L.length-1)%L.length;sfx('move');}if(held('down',dt)){s.i=(s.i+1)%L.length;sfx('move');}
  if(P.b){u.sub={k:'eqslot',who:s.who,i:s.slot==='a'?1:0};sfx('no');}
  else if(P.a&&L.length){const id=L[s.i];const cur=m[s.slot];if(id!==cur){G.eq[cur]=(G.eq[cur]||0)+1;G.eq[id]--;if(!G.eq[id])delete G.eq[id];m[s.slot]=id;sfx('ok');}u.sub={k:'eqslot',who:s.who,i:s.slot==='a'?1:0};}}}
function eqChoices(m,slot){const L=[m[slot]];for(const k in G.eq)if(G.eq[k]>0&&EQ[k].slot===slot&&(!EQ[k].who||EQ[k].who===m.id))L.push(k);return L;}
function useItem(id,m){const it=ITEMS[id],s=st(m);if(it.rev){if(m.hp>0)return false;m.hp=Math.floor(s.hp/2);return true;}if(m.hp<=0)return false;
 if(m.hp>=s.hp&&(!it.mpr||m.mp>=s.mp))return false;if(it.heal)m.hp=Math.min(s.hp,m.hp+it.heal);if(it.mpr)m.mp=Math.min(s.mp,m.mp+it.mpr);return true;}
function drawPartyPanel(x,y,sel){G.party.forEach((m,i)=>{const s=st(m),yy=y+i*44;X.drawImage(SPR[m.id].down[0],x+4,yy+6,12*1.5,16*1.5);
 txt(m.name,x+28,yy+4,m.hp>0?'#fff':'#f66');txt('Lv'+m.lv,x+110,yy+4,'#9cf');txt(HERO_DEF[m.id].role,x+28,yy+13,'#bbd',7);
 txt(`HP ${m.hp}/${s.hp}`,x+28,yy+22,'#fff',7);bar(x+28,yy+31,60,m.hp/s.hp,'#30c060','#a0ff80');txt(`MP ${m.mp}/${s.mp}`,x+96,yy+22,'#fff',7);bar(x+96,yy+31,44,m.mp/s.mp,'#3060e0','#80c0ff');
 if(sel===i)cursor(x-6,yy+8);});}
function drawMenu(u){X.fillStyle='#0008';X.fillRect(0,0,W,H);win(4,4,76,MOPTS.length*13+7);MOPTS.forEach((o,i)=>{const vk=o==='Music'?'mus':o==='Sound FX'?'sfx':null;txt(vk?(o==='Music'?'Music':'SFX'):o,20,10+i*13);if(vk)txt(VOLTXT[AOPT[vk]],74,10+i*13,AOPT[vk]?'#9cf':'#f88',7,'right');if(!u.sub&&i===u.i)cursor(8,10+i*13);});
 win(4,H-40,76,36);txt('Gold',10,H-34,'#ffd860');txt(G.gold+' G',74,H-22,'#fff',8,'right');
 
 const s=u.sub;win(84,4,168,H-8);
 if(!s||s.k==='eqwho'){drawPartyPanel(96,10,s?s.i:-1);if(s)txt('Equip whom?',96,H-18,'#ffd860');return;}
 if(s.k==='status'){const m=G.party[s.i],S=st(m),d=HERO_DEF[m.id];X.drawImage(SPR[m.id].down[Math.floor(T*4)%3],98,14,24,32);txt(m.name,130,14,'#ffd860',10);txt(d.role+'  Lv '+m.lv,130,27,'#bbd');
  txt(`EXP ${m.xp}  Next ${xpNext(m.lv)-m.xp}`,96,52,'#fff',7);const rows=[['HP',`${m.hp}/${S.hp}`],['MP',`${m.mp}/${S.mp}`],['Attack',S.atk],['Defense',S.def],['Magic',S.mag],['M.Def',S.mdef],['Speed',S.spd]];
  rows.forEach((r,i)=>{txt(r[0],100,66+i*11,'#9cf');txt(String(r[1]),196,66+i*11,'#fff',8,'right');});txt('Weapon: '+EQ[m.w].n,96,148,'#fff',7);txt('Armor:  '+EQ[m.a].n,96,158,'#fff',7);
  txt(d.skn+':',96,172,'#9cf',7);d.sk.forEach((k,i)=>txt((SK[k].lv>m.lv?'(Lv'+SK[k].lv+') ':'')+SK[k].n,104,182+i*9,SK[k].lv>m.lv?'#778':'#fff',7));txt('◀ ▶',236,14,'#9cf',7,'right');return;}
 if(s.k==='items'){const L=Object.keys(G.items).filter(k=>G.items[k]>0);if(!L.length)txt('No items.',96,14);
  L.forEach((k,i)=>{txt(ITEMS[k].n,104,14+i*12);txt('x'+G.items[k],240,14+i*12,'#fff',8,'right');if(i===s.i)cursor(92,14+i*12);});
  if(L[s.i])txt(ITEMS[L[s.i]].d,96,90,'#9cf',7);
  if(s.pick>=0){win(90,104,156,112);G.party.forEach((m,i)=>{const S=st(m);txt(m.name,108,112+i*34);txt(`HP ${m.hp}/${S.hp}`,108,122+i*34,'#fff',7);txt(`MP ${m.mp}/${S.mp}`,180,122+i*34,'#fff',7);if(i===s.pick)cursor(96,112+i*34);});}return;}
 if(s.k==='eqslot'||s.k==='eqlist'){const m=G.party[s.who],S=st(m);txt(m.name+' — Equipment',96,12,'#ffd860');
  ['w','a'].forEach((sl,i)=>{txt((sl==='w'?'Weapon: ':'Armor:  ')+EQ[m[sl]].n,108,28+i*12);if(s.k==='eqslot'&&s.i===i)cursor(94,28+i*12);});
  txt(`ATK ${S.atk}  DEF ${S.def}  MAG ${S.mag}`,96,58,'#9cf',7);
  if(s.k==='eqlist'){const L=eqChoices(m,s.slot);win(90,72,156,H-80);L.forEach((k,i)=>{const e=EQ[k];txt(e.n+(i===0?' (E)':''),106,80+i*12);if(i===s.i)cursor(94,80+i*12);});
   const e=EQ[L[s.i]];if(e){const st2=[e.atk&&('ATK+'+e.atk),e.def&&('DEF+'+e.def),e.mag&&('MAG+'+e.mag),e.mdef&&('MDEF+'+e.mdef)].filter(Boolean).join(' ');txt(st2,96,H-20,'#9cf',7);}}}}

// ---------- shop & inn ----------
const STOCK=['potion','ether','bloom','tonic','steel','runed','silver','chain','ward'];
let SHOP={stock:null,n:'Copper Kettle',who:'Tessa'};
function openShop(o){SHOP=Object.assign({stock:STOCK,n:'Copper Kettle',who:'Tessa'},o||{});UI.push({k:'shop',i:0});dialog([SHOP.who+': Welcome to the '+SHOP.n+'! Have a look.']);}
function priceOf(k){return (ITEMS[k]||EQ[k]).p;}function nameOf(k){return (ITEMS[k]||EQ[k]).n;}
function updShop(u,dt){const STOCK=SHOP.stock;if(held('up',dt)){u.i=(u.i+STOCK.length-1)%STOCK.length;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%STOCK.length;sfx('move');}
 if(P.b){UI.pop();sfx('no');dialog([SHOP.who+': Come back anytime!']);}
 else if(P.a){const k=STOCK[u.i],p=priceOf(k);if(G.gold<p){sfx('no');toast('Not enough gold.');return;}G.gold-=p;sfx('coin');if(ITEMS[k])G.items[k]=(G.items[k]||0)+1;else G.eq[k]=(G.eq[k]||0)+1;}}
function drawShop(u){const STOCK=SHOP.stock;X.fillStyle='#0006';X.fillRect(0,0,W,H);win(4,4,W-8,20);txt(SHOP.n+' — Buy',12,10,'#ffd860');txt(G.gold+' G',W-12,10,'#fff',8,'right');
 win(4,28,W-8,128);STOCK.forEach((k,i)=>{if(i>8)return;const own=ITEMS[k]?(G.items[k]||0):(G.eq[k]||0);txt(nameOf(k),22,34+i*13);txt('x'+own,170,34+i*13,'#9cf',7);txt(priceOf(k)+'G',W-14,34+i*13,G.gold>=priceOf(k)?'#fff':'#866',8,'right');if(i===u.i)cursor(10,34+i*13);});
 const k=STOCK[u.i],e=EQ[k];let d=ITEMS[k]?ITEMS[k].d:([e.atk&&'ATK+'+e.atk,e.mag&&'MAG+'+e.mag,e.def&&'DEF+'+e.def,e.mdef&&'MDEF+'+e.mdef].filter(Boolean).join(' ')+'  ('+(e.who?HERO_DEF[e.who].name:'Anyone')+')');
 win(4,160,W-8,24);txt(d,12,167,'#cde',7);txt('A: Buy   B: Leave',12,192,'#fff',7);}
function openInn(){choice('Marla: A warm bed and a hot meal for 20G. Stay the night?',['Stay','Leave'],i=>{if(i)return dialog(['Marla: Safe travels, then!']);
 if(G.gold<20)return dialog(['Marla: Oh dear, you\'re a bit short.']);G.gold-=20;transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});}

// ---------- field ----------
let F={mv:0,fx:0,fy:0,banner:0,npcs:[],anim:0};
function enterMap(name,x,y,d){G.map=name;G.x=x;G.y=y;G.d=d||G.d;F.mv=0;F.banner=2.5;F.npcs=(NPCS[name]||[]).map(n=>({...n,ox:n.x,oy:n.y,t:Math.random()*3}));
 const ch=MAPS[name].chests;if(ch)for(const k in ch)if(G.flags['c'+name+k]){const[a,b]=k.split(',').map(Number);setTile(name,a,b,'o');}}
function tileAt(m,x,y){const M=MAPS[m];if(x<0||y<0||x>=M.w||y>=M.h)return 'X';return M.rows[y][x];}
function setTile(m,x,y,c){const r=MAPS[m].rows;r[y]=r[y].slice(0,x)+c+r[y].slice(x+1);}
function npcAt(x,y){return F.npcs.find(n=>n.x===x&&n.y===y);}
function blocked(x,y){const t=tileAt(G.map,x,y);if(SOLID.has(t))return true;if(npcAt(x,y))return true;if(G.map==='cave'&&!G.flags.boss&&y<=3&&y>=1&&x>=10&&x<=13&&y===2)return true;return false;}
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function updField(dt){G.time+=dt;F.anim+=dt;
 F.npcs.forEach(n=>{if(!n.wander)return;n.t-=dt;if(n.t<0){n.t=2+Math.random()*3;const ds=Object.keys(DIRS),d=ds[Math.random()*4|0],[a,b]=DIRS[d];n.d=d;const nx=n.x+a,ny=n.y+b;
  if(Math.abs(nx-n.ox)<3&&Math.abs(ny-n.oy)<3&&!SOLID.has(tileAt(G.map,nx,ny))&&!(nx===G.x&&ny===G.y)&&!npcAt(nx,ny)&&!MAPS[G.map].doors?.[nx+','+ny]&&!MAPS[G.map].doors?.[nx+','+(ny-1)]){n.x=nx;n.y=ny;}}});
 if(F.mv>0){F.mv-=dt*7;if(F.mv<=0){F.mv=0;arrived();}return;}
 if(P.menu){openMenu();return;}
 if(P.a){const[a,b]=DIRS[G.d],tx=G.x+a,ty=G.y+b,n=npcAt(tx,ty);if(n){n.d={up:'down',down:'up',left:'right',right:'left'}[G.d];sfx('ok');n.act?n.act():dialog(n.lines());return;}
  const t=tileAt(G.map,tx,ty);if(t==='c'){const ch=MAPS[G.map].chests[tx+','+ty];setTile(G.map,tx,ty,'o');G.flags['c'+G.map+tx+','+ty]=1;if(EQ[ch])G.eq[ch]=(G.eq[ch]||0)+1;else G.items[ch]=(G.items[ch]||0)+1;sfx('coin');toast('Found '+nameOf(ch)+'!');return;}}
 for(const d of ['up','down','left','right'])if(K[d]){G.d=d;const[a,b]=DIRS[d];if(!blocked(G.x+a,G.y+b)){F.fx=G.x;F.fy=G.y;G.x+=a;G.y+=b;F.mv=1;}break;}}
function arrived(){const M=MAPS[G.map];G.steps++;if(XSTEP.some(f=>f()))return;
 const w=M.warps.find(w=>w.x===G.x&&w.y===G.y);if(w){sfx('ok');return transition(()=>enterMap(w.to,w.tx,w.ty,w.d));}
 const dr=M.doors&&M.doors[G.x+','+G.y];if(dr){G.y++;G.d='down';if(dr==='inn')openInn();else if(dr==='shop')openShop();else if(XDOOR[dr])XDOOR[dr]();else dialog(['The elder\'s house is quiet. Bran is out by the fountain.']);return;}
 if(G.map==='cave'&&!G.flags.boss&&G.y===3){return bossEvent();}
 if(M.enc&&G.steps>4&&Math.random()<1/M.enc&&!G.flags.noenc){G.steps=0;const grp=M.pool[Math.random()*M.pool.length|0];startBattle(grp,M.bbg||G.map==='cave');}}
function bossEvent(){dialog(['Mira: The air is freezing... and the shard\'s glow is right there.','Gravemaw: LITTLE EMBERS. YOU SMELL OF THE CROWN.','Gravemaw: I WILL SWALLOW YOUR LIGHT AS I SWALLOWED ITS OWN.','Kael: Lyra, Mira — together!'],()=>startBattle(['boss'],true,true));}
function camera(){const M=MAPS[G.map];const t=F.mv>0?F.mv:0;const ppx=(G.x-(G.x-F.fx)*t)*16,ppy=(G.y-(G.y-F.fy)*t)*16;
 let cx=ppx+8-W/2,cy=ppy+8-H/2;cx=M.w*16<W?(M.w*16-W)/2:Math.max(0,Math.min(M.w*16-W,cx));cy=M.h*16<H?(M.h*16-H)/2:Math.max(0,Math.min(M.h*16-H,cy));return [Math.round(cx),Math.round(cy),ppx,ppy];}
function drawField(){const M=MAPS[G.map],[cx,cy,ppx,ppy]=camera();X.fillStyle='#000';X.fillRect(0,0,W,H);
 const x0=Math.floor(cx/16),y0=Math.floor(cy/16);for(let y=y0;y<=y0+15;y++)for(let x=x0;x<=x0+17;x++){if(x<0||y<0||x>=M.w||y>=M.h)continue;const t=M.rows[y][x],tl=TILES[t]||TILES['.'];if(!(window.drawPT&&drawPT(t,x,y,x*16-cx,y*16-cy)))X.drawImage(tl[Math.floor(T*2)%tl.length],x*16-cx,y*16-cy);}
 const ents=F.npcs.map(n=>({y:n.y*16,dr:()=>fspr(SPR[n.s][n.d][0],n.x*16-cx+2,n.y*16-cy-2)}));
 const fr=F.mv>0?(1+(Math.floor(F.anim*8)%2)):0;ents.push({y:ppy,dr:()=>fspr(SPR.kael[G.d][fr],ppx-cx+2,ppy-cy-2)});
 if(G.map==='cave'&&!G.flags.boss){const b=EN_ART.boss.c,bob=Math.sin(T*2)*1.5;ents.push({y:32,dr:()=>{if(!drawPaint('boss',12*16-cx,3*16-cy+10+bob,{sc:0.55,alpha:0.95})){X.globalAlpha=0.9;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);X.globalAlpha=1;}}});}
 XFENTS.forEach(f=>f(ents,cx,cy));
 ents.sort((a,b)=>a.y-b.y).forEach(e=>e.dr());if(window.XFIELD)XFIELD(cx,cy);
 if(G.map==='town'){const fx=10*16-cx,fy=6*16-cy;for(let i=0;i<4;i++){const p=(T*1.5+i/4)%1;X.fillStyle='#bfe0ff';X.fillRect(fx+14+Math.sin(i*2)*6*p,fy+12-Math.sin(p*Math.PI)*10,2,2);}}
 if(M.dark){if(window.DARKFX)DARKFX(ppx-cx+8,ppy-cy+8);else{const g=X.createRadialGradient(ppx-cx+8,ppy-cy+8,24,ppx-cx+8,ppy-cy+8,140);g.addColorStop(0,'rgba(0,0,10,0)');g.addColorStop(1,'rgba(0,0,10,0.85)');X.fillStyle=g;X.fillRect(0,0,W,H);}}
 if(F.banner>0){F.banner-=1/60;X.globalAlpha=Math.min(1,F.banner);win(W/2-70,8,140,20);txt(M.name,W/2,14,'#fff',8,'center');X.globalAlpha=1;}
 if(isTouch&&!UI.length){txt('MENU: party',W-4,H-10,'#fff8',6,'right');}}

// ---------- battle ----------
let B=null;
function startBattle(grp,cave,boss){sfx('enc');const en=grp.map((k,i)=>{const e=EN[k];return {k,...e,n:e.n+(grp.filter(g=>g===k).length>1?' '+'ABC'[grp.slice(0,i+1).filter(g=>g===k).length-1]:''),mhp:e.hp,atb:Math.random()*50,side:'E',i,flash:0,dx:0,alive:1};});
 const pt=G.party.map((m,i)=>({m,side:'P',i,atb:Math.random()*40+20,flash:0,dx:0,def:0,buf:1}));
 B={en,pt,cave,boss,t:0,intro:1,ready:[],act:null,menu:null,q:[],busy:null,nums:[],parts:[],msg:'',msgT:0,end:null,shake:0,swirl:1};scene='battle';}
function alive(list){return list.filter(u=>u.side==='E'?u.hp>0:u.m.hp>0);}
function uhp(u){return u.side==='E'?u.hp:u.m.hp;}
function ustat(u){if(u.side==='E')return {atk:u.atk,def:u.def,mag:u.mag,mdef:u.def,spd:u.spd};const s=st(u.m);s.atk*=u.buf;return s;}
function upos(u){if(u.side==='E'){if(u.boss)return [22,34];const P3=[[56,58],[34,92],[78,104]],P2=[[50,64],[60,104]],P1=[[56,82]];const L=B.en.length===1?P1:B.en.length===2?P2:P3;return L[u.i];}
 if(B.pt.length>3)return [186+u.i*10+(B.act===u.i?-12:0),30+u.i*28];return [192+u.i*12+(B.act===u.i?-12:0),40+u.i*34];}
function updBattle(dt){B.t+=dt;if(B.swirl>0){B.swirl-=dt*1.4;return;}
 if(B.intro){B.intro=0;B.msg=B.boss?B.en[0].n+' blocks the way!':'Enemies appear!';B.msgT=1.4;}
 B.nums=B.nums.filter(n=>(n.t+=dt)<1.1);B.parts=B.parts.filter(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;return p.t<p.life;});
 [...B.en,...B.pt].forEach(u=>{u.flash=Math.max(0,u.flash-dt*4);u.dx*=0.8;});B.shake=Math.max(0,B.shake-dt*20);if(B.msgT>0)B.msgT-=dt;
 if(B.end){B.endT+=dt;if(B.endT>0.8&&(P.a||P.b)){if(B.end==='win'){if(B.lines.length){B.lines.shift();sfx('move');if(B.lines.length)return;}finishWin();}else if(B.end==='lose'){scene='gameover';}}return;}
 const waiting=window.ATBWAIT?ATBWAIT(B):B.menu&&B.menu.k!=='cmd';
 if(!B.busy&&!waiting){[...alive(B.en),...alive(B.pt)].forEach(u=>{if(u.pend)return;u.atb=Math.min(100,u.atb+(ustat(u).spd+8)*dt*3.2);
   if(u.atb>=100){u.pend=1;if(u.side==='E')B.q.push(enemyAI(u));else B.ready.push(u.i);}});}
 if(B.act===null&&B.ready.length){B.act=B.ready.shift();if(B.pt[B.act].m.hp<=0){B.pt[B.act].pend=0;B.pt[B.act].atb=0;B.act=null;}else{B.menu={k:'cmd',i:0};sfx('move');}}
 if(B.act!==null)updCmd(dt);
 if(B.busy)runAct(dt);else if(B.q.length){B.busy={a:B.q.shift(),t:0,done:0};const a=B.busy.a;if(uhp(a.u)<=0){a.u.pend=0;a.u.atb=0;B.busy=null;}else{if(a.u.side==='P')a.u.def=0;B.msg=a.name||'';B.msgT=a.name?1:0;}}}
function enemyAI(u){const P=alive(B.pt);let t=P[Math.random()*P.length|0];if(u.ai)return u.ai(u,P,t);
 if(u.boss){const ph=u.hp<u.mhp*0.5;if(ph&&!u.howl){u.howl=1;return {u,kind:'buff',name:'Abyssal Howl',tg:[u]};}const r=Math.random();
  if(r<(ph?0.38:0.25))return {u,kind:'mag',name:'Shadow Tide',pow:ph?1.1:0.9,el:'dark',tg:P,fx:'dark'};if(r<0.55)return {u,kind:'phys',name:'Grave Rend',pow:1.5,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
 if(u.caster&&Math.random()<0.6)return {u,kind:'mag',name:'Wisp Flame',pow:1.1,el:'fire',tg:[t],fx:'fire'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function updCmd(dt){const m=B.menu,u=B.pt[B.act],mem=u.m,d=HERO_DEF[mem.id];
 const nav=(n)=>{if(held('up',dt)){m.i=(m.i+n-1)%n;sfx('move');}if(held('down',dt)){m.i=(m.i+1)%n;sfx('move');}};
 if(m.k==='cmd'){nav(4);if(P.a){sfx('ok');const c=m.i;if(c===0)B.menu={k:'tgt',side:'E',i:firstAlive('E'),all:0,back:{k:'cmd',i:0},act:{kind:'phys',pow:1,fx:'slash'}};
   else if(c===1)B.menu={k:'skill',i:0};else if(c===2){if(!Object.keys(G.items).some(k=>G.items[k]>0)){sfx('no');B.menu={k:'cmd',i:2};}else B.menu={k:'item',i:0};}
   else{u.def=1;commit({kind:'defend'},[u]);}}return;}
 if(m.k==='skill'){const L=d.sk.filter(k=>!(SK[k].lv>mem.lv));nav(L.length);if(P.b){B.menu={k:'cmd',i:1};sfx('no');return;}
  if(P.a){const s=SK[L[m.i]];if(mem.mp<s.mp){sfx('no');return;}sfx('ok');tgtFor(s.tgt,{kind:s.type,sk:L[m.i],pow:s.pow,el:s.el,fx:s.fx,name:s.n,mp:s.mp},{k:'skill',i:m.i});}return;}
 if(m.k==='item'){const L=Object.keys(G.items).filter(k=>G.items[k]>0);if(!L.length){B.menu={k:'cmd',i:2};return;}m.i=Math.min(m.i,L.length-1);nav(L.length);if(P.b){B.menu={k:'cmd',i:2};sfx('no');return;}
  if(P.a){sfx('ok');const it=ITEMS[L[m.i]];tgtFor(it.tgt,{kind:'item',it:L[m.i],fx:'heal',name:it.n},{k:'item',i:m.i});}return;}
 if(m.k==='tgt'){const list=m.side==='E'?B.en:B.pt;
  if(!m.all){const ok=j=>m.any?true:m.dead?(list[j].m.hp<=0):(uhp(list[j])>0);const mv=dir=>{let j=m.i;for(let n=0;n<list.length;n++){j=(j+dir+list.length)%list.length;if(ok(j)){m.i=j;sfx('move');break;}}};
   if(held('up',dt))mv(-1);if(held('down',dt))mv(1);if(held('left',dt)||held('right',dt)){if(!m.lock&&!m.dead){m.side=m.side==='E'?'P':'E';m.i=firstAlive(m.side);sfx('move');}}}
  if(P.b){B.menu=m.back;sfx('no');return;}
  if(P.a){const tg=m.all?alive(list):[list[m.i]];if(!tg.length||!tg[0]){sfx('no');return;}sfx('ok');commit(m.act,tg);}}}
function firstAlive(side){const L=side==='E'?B.en:B.pt;const i=L.findIndex(u=>uhp(u)>0);return i<0?0:i;}
function tgtFor(t,act,back){if(t==='allE')B.menu={k:'tgt',side:'E',all:1,i:0,act,back,lock:1};else if(t==='allP')B.menu={k:'tgt',side:'P',all:1,i:0,act,back,lock:1};
 else if(t==='E')B.menu={k:'tgt',side:'E',i:firstAlive('E'),act,back};else if(t==='Pdead'){const i=B.pt.findIndex(u=>u.m.hp<=0);if(i<0){sfx('no');B.menu=back;return;}B.menu={k:'tgt',side:'P',i,act,back,dead:1,lock:1};}
 else B.menu={k:'tgt',side:'P',i:B.act,act,back};}
function commit(act,tg){const u=B.pt[B.act];B.q.push({...act,u,tg});B.menu=null;B.act=null;}
function addNum(u,v,c){const[x,y]=upos(u);B.nums.push({x:x+(u.boss?40:12),y:y+(u.boss?20:4),v,c,t:0});}
function burst(u,col,n,spd=60,g=0){const[x,y]=upos(u);const cx=x+(u.boss?50:u.side==='E'?16:12),cy=y+(u.boss?45:u.side==='E'?16:12);
 for(let i=0;i<n;i++){const a=Math.random()*6.28,s=Math.random()*spd;B.parts.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(g?30:0),g,t:0,life:0.4+Math.random()*0.4,c:col[i%col.length]});}}
function runAct(dt){const b=B.busy,a=b.a;b.t+=dt;const u=a.u;
 if(a.kind==='phys'&&b.t<0.3)u.dx=(u.side==='E'?1:-1)*Math.sin(b.t/0.3*Math.PI)*24;
 if(a.kind!=='phys'&&a.kind!=='defend'&&b.t<0.3&&Math.random()<0.5)burst(u,['#fff','#ffe080'],1,30);
 if(!b.done&&b.t>=0.32){b.done=1;apply(a);}
 if(b.t>=0.95){b.a.u.atb=0;b.a.u.pend=0;B.busy=null;checkEnd();}}
function apply(a){const u=a.u,s=ustat(u);if(a.mp){u.m.mp-=a.mp;}
 if(a.kind==='defend'){addNum(u,'GUARD','#9cf');sfx('move');return;}
 let tg=a.tg;if(a.kind!=='revive'&&!(a.kind==='item'&&ITEMS[a.it].rev)){tg=tg.map(t=>uhp(t)>0?t:null).filter(Boolean);if(!tg.length){const L=alive(a.tg[0].side==='E'?B.en:B.pt);if(L.length)tg=[L[Math.random()*L.length|0]];}}
 const fxc={slash:['#fff','#ccd'],fire:['#ff4020','#ffb020','#ffe060'],ice:['#a0e0ff','#ffffff','#60a0ff'],bolt:['#ffff80','#ffffff','#a0a0ff'],heal:['#80ffa0','#e0ffe0','#a0ffd0'],dark:['#8040c0','#401060','#ff4080'],buff:['#ffd040','#ff8020']};
 sfx({slash:'hit',fire:'fire',ice:'ice',bolt:'bolt',heal:'heal',dark:'bolt',buff:'lvl'}[a.fx]||'hit');
 if(a.kind==='buff'){tg.forEach(t=>{burst(t,fxc.buff,14,50,1);if(t.side==='E'){t.atk=Math.floor(t.atk*1.3);addNum(t,'ATK UP','#fc6');}});if(u.side==='P')B.pt.forEach(p=>{if(p.m.hp>0){p.buf=1.3;addNum(p,'ATK UP','#fc6');burst(p,fxc.buff,8,40,1);}});return;}
 if(a.kind==='item'){const it=ITEMS[a.it];G.items[a.it]--;if(!G.items[a.it])delete G.items[a.it];const t=tg[0],S=st(t.m);
  if(it.rev){if(t.m.hp<=0){t.m.hp=Math.floor(S.hp/2);addNum(t,'REVIVED','#8f8');t.atb=0;t.pend=0;}}else if(t.m.hp>0){if(it.heal){const v=Math.min(it.heal,S.hp-t.m.hp);t.m.hp+=v;addNum(t,v,'#7f7');}if(it.mpr){const v=Math.min(it.mpr,S.mp-t.m.mp);t.m.mp+=v;addNum(t,v+' MP','#8cf');}}
  burst(t,['#a0ffa0','#fff'],12,40,1);return;}
 if(a.kind==='heal'){tg.forEach(t=>{if(t.m.hp<=0)return;const S=st(t.m),v=Math.min(S.hp-t.m.hp,Math.floor((s.mag*2.4+12)*a.pow*(0.95+Math.random()*0.1)));t.m.hp+=v;addNum(t,v,'#7f7');burst(t,['#a0ffa0','#fff','#c0ffe0'],14,40,1);});return;}
 if(a.kind==='revive'){const t=tg[0];if(t.m.hp<=0){t.m.hp=Math.floor(st(t.m).hp*0.4);t.atb=0;t.pend=0;addNum(t,'REVIVED','#8f8');burst(t,['#fff','#ffe080'],20,50,1);}return;}
 tg.forEach(t=>{const ts=ustat(t);let dmg,tag='';
  if(a.kind==='phys'){dmg=(s.atk*2-ts.def)*a.pow;if(Math.random()<0.08){dmg*=1.6;tag='CRIT';}}else{dmg=(s.mag*2.3-ts.mdef*0.8)*a.pow;}
  if(a.el&&t.side==='E'){if(t.weak===a.el){dmg*=1.75;tag='WEAK';}else if(t.res===a.el){dmg*=0.5;tag='RESIST';}}
  if(t.side==='P'&&t.def)dmg*=0.5;dmg=Math.max(1,Math.floor(dmg*(0.9+Math.random()*0.2)));
  if(t.side==='E'){t.hp=Math.max(0,t.hp-dmg);}else{t.m.hp=Math.max(0,t.m.hp-dmg);if(t.m.hp<=0){t.atb=0;t.pend=0;if(B.act===t.i){B.act=null;B.menu=null;}B.ready=B.ready.filter(r=>r!==t.i);}}
  t.flash=1;B.shake=tag==='CRIT'||u.boss?4:1.5;addNum(t,dmg,tag==='WEAK'||tag==='CRIT'?'#ffe040':'#fff');if(tag)B.nums.push({...B.nums[B.nums.length-1],v:tag,c:'#ff8040',y:B.nums[B.nums.length-1].y-10});
  burst(t,fxc[a.fx]||fxc.slash,a.fx==='slash'?8:18,a.fx==='slash'?70:55,a.fx==='fire'?-1:0);if(tag==='CRIT')sfx('crit');});}
function checkEnd(){if(!alive(B.en).length){B.end='win';B.endT=0;sfx('win');const xp=B.en.reduce((s,e)=>s+e.xp,0),gold=B.en.reduce((s,e)=>s+e.g,0);G.gold+=gold;B.lines=[`Victory!  +${xp} EXP   +${gold} G`,...gainXP(xp)];
  if(Math.random()<0.3&&!B.boss){G.items.potion=(G.items.potion||0)+1;B.lines.push('Found a Potion!');}}
 else if(!alive(B.pt).length){B.end='lose';B.endT=0;sfx('no');}}
function gainXP(xp,all){const out=[];G.party.forEach(m=>{if(m.hp<=0&&!all)return;m.xp+=xp;while(m.xp>=xpNext(m.lv)){m.xp-=xpNext(m.lv);m.lv++;const g=HERO_DEF[m.id].g;for(const k in g)m.b[k]+=g[k];m.hp+=g.hp;m.mp+=g.mp;
  let l=`${m.name} reached Lv ${m.lv}!`;const ns=HERO_DEF[m.id].sk.find(k=>SK[k].lv===m.lv);if(ns)l+=` Learned ${SK[ns].n}!`;out.push(l);setTimeout(()=>sfx('lvl'),600);}});return out;}
function finishWin(){const boss=B.boss,bk=B.en[0].k;if(boss&&XWIN[bk]){transition(()=>{scene='map';B=null;XWIN[bk]();});return;}transition(()=>{scene='map';B=null;if(boss){G.flags.boss=1;dialog(['The shard of the Ember Crown pulses warmly in Lyra\'s hands.','Lyra: One shard... six more to go.','Mira: Then we\'d better head back and tell Elder Bran.'],()=>afterGravemaw());}});}
function drawBattle(){const sh=B.shake?(Math.random()-0.5)*B.shake:0;X.save();X.translate(sh,0);
 const g=X.createLinearGradient(0,0,0,150);if(B.cave==='snow'){g.addColorStop(0,'#5a6a8a');g.addColorStop(0.5,'#c8d8f0');g.addColorStop(0.52,'#e8f0f8');g.addColorStop(1,'#a8b8d0');}else if(B.cave==='glacier'){g.addColorStop(0,'#06101e');g.addColorStop(0.55,'#1a3a5a');g.addColorStop(1,'#3a6a8a');}else if(B.cave==='forge'){g.addColorStop(0,'#140404');g.addColorStop(0.55,'#4a1408');g.addColorStop(1,'#6a2410');}else if(B.cave==='jungle'){g.addColorStop(0,'#1e3a2a');g.addColorStop(0.5,'#5a8a4a');g.addColorStop(0.52,'#2a4a24');g.addColorStop(1,'#1a2e18');}else if(B.cave==='sunken'){g.addColorStop(0,'#04121a');g.addColorStop(0.55,'#0e3a3a');g.addColorStop(1,'#1a4a40');}else if(B.cave==='heart'){g.addColorStop(0,'#080210');g.addColorStop(0.42,'#5a0a1a');g.addColorStop(0.5,'#ffb040');g.addColorStop(0.53,'#2a0a14');g.addColorStop(1,'#0a0408');}else if(B.cave==='throne'){g.addColorStop(0,'#1a0c20');g.addColorStop(0.45,'#8a4a5a');g.addColorStop(0.5,'#e0a060');g.addColorStop(0.52,'#3a2c3a');g.addColorStop(1,'#140c18');}else if(B.cave==='twilight'){g.addColorStop(0,'#120a24');g.addColorStop(0.5,'#5a3a7a');g.addColorStop(0.52,'#2a1e3a');g.addColorStop(1,'#140e20');}else if(B.cave==='ash'){g.addColorStop(0,'#5a2a2a');g.addColorStop(0.5,'#c8784a');g.addColorStop(0.52,'#4a3a36');g.addColorStop(1,'#2e2624');}else if(B.cave){g.addColorStop(0,'#0a0814');g.addColorStop(0.55,'#2a2040');g.addColorStop(1,'#3a3050');}else{g.addColorStop(0,'#4a7ad8');g.addColorStop(0.5,'#a8c8f0');g.addColorStop(0.52,'#5a9a4a');g.addColorStop(1,'#3a7a2e');}
 X.fillStyle=g;X.fillRect(-4,0,W+8,152);
 if(window.BDRAW&&BDRAW(B.cave)){}else if(B.cave==='forge'){X.fillStyle='#200806';for(let i=0;i<12;i++){const x=i*24+(i%3)*5;X.beginPath();X.moveTo(x,0);X.lineTo(x+12,0);X.lineTo(x+6,18+(i*7)%22);X.fill();}for(let i=0;i<30;i++){X.fillStyle=i%3?'#ff6020':'#ffc040';X.globalAlpha=0.5+0.5*Math.sin(T*3+i);X.fillRect((i*37+T*8)%W,150-((i*13+T*20)%70),1,1);}X.globalAlpha=1;X.fillStyle='#ff5010';X.fillRect(-4,140,W+8,3);}
 else if(B.cave==='snow'){X.fillStyle='#8a9ab8';for(let i=0;i<5;i++){X.beginPath();X.moveTo(i*60-10,76);X.lineTo(i*60+30,40+(i%2)*14);X.lineTo(i*60+70,76);X.fill();}X.fillStyle='#fff';for(let i=0;i<5;i++){X.beginPath();X.moveTo(i*60+20,50+(i%2)*14-0);X.lineTo(i*60+30,40+(i%2)*14);X.lineTo(i*60+40,50+(i%2)*14);X.fill();}for(let i=0;i<40;i++){X.globalAlpha=0.8;X.fillRect((i*53+T*12)%W,(i*29+T*25)%150,1,1);}X.globalAlpha=1;}
 else if(B.cave==='glacier'){X.fillStyle='#0c1c30';for(let i=0;i<12;i++){const x=i*24+(i%3)*5;X.beginPath();X.moveTo(x,0);X.lineTo(x+12,0);X.lineTo(x+6,20+(i*7)%22);X.fill();}for(let i=0;i<24;i++){X.fillStyle=i%2?'#9fe8ff':'#ffffff';X.globalAlpha=0.4+0.4*Math.sin(T*2+i);X.fillRect((i*41)%W,90+(i*19)%55,2,1);}X.globalAlpha=1;X.fillStyle='#bfefff';X.fillRect(-4,140,W+8,2);}
 else if(B.cave==='jungle'){for(let i=0;i<9;i++){X.fillStyle=i%2?'#14301c':'#1c4026';X.fillRect(i*32-6,10,10,70);X.beginPath();X.arc(i*32,14,22,0,7);X.fill();}X.fillStyle='#3a6a2a';for(let i=0;i<40;i++)X.fillRect((i*53)%W,90+(i*17)%60,3,1);for(let i=0;i<10;i++){X.fillStyle='#c0ff80';X.globalAlpha=0.4+0.4*Math.sin(T*3+i);X.fillRect((i*47+T*5)%W,60+(i*23)%50,1,1);}X.globalAlpha=1;}
 else if(B.cave==='heart'){const cx=W*0.62,cy=40,pu=1+0.08*Math.sin(T*3);X.globalAlpha=0.35;X.fillStyle='#ff3040';X.beginPath();X.arc(cx,cy,30*pu,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#ffd070';for(let i=0;i<7;i++){const a=i/7*6.28+T*0.5;X.fillRect(cx+Math.cos(a)*40-2,cy+Math.sin(a)*14-2,4,4);}X.fillStyle='#ff6050';X.fillRect(cx-3,cy-3,6,6);X.fillStyle='#3a1020';for(let i=0;i<7;i++){X.beginPath();X.moveTo(i*40,78);X.lineTo(i*40+20,58+(i%3)*6);X.lineTo(i*40+40,78);X.fill();}for(let i=0;i<24;i++){X.fillStyle=i%2?'#ffd070':'#ff4050';X.globalAlpha=0.3+0.4*Math.sin(T*2+i);X.fillRect((i*41+T*7)%W,150-((i*23+T*14)%110),1,2);}X.globalAlpha=1;X.fillStyle='#ffb040';X.fillRect(-4,140,W+8,2);}else if(B.cave==='throne'){X.fillStyle='#24141e';X.fillRect(W*0.5-14,10,28,64);X.fillRect(W*0.5-24,6,48,8);for(let i=0;i<5;i++)X.fillRect(W*0.5-22+i*10,0,4,10);X.fillStyle='#ff5060';X.globalAlpha=0.5+0.4*Math.sin(T*2.5);X.beginPath();X.arc(W*0.5,36,4,0,7);X.fill();X.globalAlpha=1;X.fillStyle='#2e1e2a';for(let i=0;i<6;i++){const y=50+(i%3)*10+Math.sin(T+i)*2;X.fillRect(i*48+4,y,12,30);X.fillRect(i*48,y-3,20,4);}for(let i=0;i<18;i++){X.fillStyle=i%2?'#ffd070':'#ff8070';X.globalAlpha=0.3+0.3*Math.sin(T*2+i);X.fillRect((i*41+T*5)%W,150-((i*23+T*9)%80),1,2);}X.globalAlpha=1;}
 else if(B.cave==='twilight'){X.fillStyle='#2a1a3a';X.globalAlpha=0.9;X.beginPath();X.arc(W*0.72,40,22,0,7);X.fill();X.fillStyle='#e0b0ff';X.globalAlpha=0.5;X.beginPath();X.arc(W*0.72,40,24,0,7);X.stroke&&X.fill();X.fillStyle='#120a24';X.globalAlpha=1;X.beginPath();X.arc(W*0.72,40,20,0,7);X.fill();X.fillStyle='#1c1430';for(let i=0;i<7;i++){X.fillRect(i*42+6,44+(i%3)*8,8,40);X.fillRect(i*42+2,40+(i%3)*8,16,4);}for(let i=0;i<16;i++){X.fillStyle=i%2?'#c090ff':'#ffd0f0';X.globalAlpha=0.3+0.3*Math.sin(T*2+i);X.fillRect((i*37+T*6)%W,80+((i*29)%70),1,2);}X.globalAlpha=1;}
 else if(B.cave==='sunken'){X.fillStyle='#0a2428';for(let i=0;i<6;i++){X.fillRect(i*48+8,6,14,80);X.fillRect(i*48+4,4,22,5);}for(let i=0;i<20;i++){X.fillStyle=i%2?'#60f0d0':'#b080ff';X.globalAlpha=0.3+0.3*Math.sin(T*2+i);X.fillRect((i*41)%W,150-((i*19+T*12)%90),2,2);}X.globalAlpha=1;X.fillStyle='#40c0a0';X.fillRect(-4,140,W+8,2);}
 else if(B.cave==='ash'){X.fillStyle='#3a2622';for(let i=0;i<5;i++){X.beginPath();X.moveTo(i*60-10,76);X.lineTo(i*60+30,44+(i%2)*12);X.lineTo(i*60+70,76);X.fill();}X.fillStyle='#ff7030';X.fillRect(88,46,4,3);X.fillStyle='#6a5048';for(let i=0;i<40;i++)X.fillRect((i*53)%W,90+(i*17)%60,2,1);}
 else if(B.cave){X.fillStyle='#120e1c';for(let i=0;i<12;i++){const x=i*24+(i%3)*5;X.beginPath();X.moveTo(x,0);X.lineTo(x+12,0);X.lineTo(x+6,18+(i*7)%22);X.fill();}X.fillStyle='#4a4060';for(let i=0;i<30;i++)X.fillRect((i*37)%W,100+(i*13)%50,3,1);}
 else{X.fillStyle='#6a8ac0';for(let i=0;i<5;i++){X.beginPath();X.moveTo(i*60-10,76);X.lineTo(i*60+30,50+(i%2)*10);X.lineTo(i*60+70,76);X.fill();}X.fillStyle='#4a8a3a';for(let i=0;i<40;i++)X.fillRect((i*53)%W,90+(i*17)%60,2,1);}
 X.fillStyle='#0004';[...B.en,...B.pt].forEach(u=>{if(uhp(u)<=0&&u.side==='E')return;const[x,y]=upos(u);X.beginPath();X.ellipse(x+(u.boss?52:u.side==='E'?16:12),y+(u.boss?92:u.side==='E'?31:31),u.boss?36:12,u.boss?6:3,0,0,7);X.fill();});
 B.en.forEach(u=>{const[x,y]=upos(u);if(u.hp<=0){u.die=(u.die||0)+1/60;if(u.die>0.6)return;X.globalAlpha=1-u.die/0.6;}
  const bob=Math.sin(T*3+u.i)*(u.k==='bat'||u.k==='wisp'?3:1);
  if(PAINT[u.k]){const br=u.boss?Math.sin(T*1.6)*1.5:Math.sin(T*2.4+u.i)*1;const dieA=u.hp<=0?1-(u.die||0)/0.6:1;
   drawPaint(u.k,x+(u.boss?52:16)+u.dx,y+(u.boss?96:32)+br,{flash:u.hp<=0?0.6:u.flash,alpha:dieA});X.globalAlpha=1;return;}
  const c=EN_ART[u.k].c,sc=u.boss?4:2;X.drawImage(c,x+u.dx,y+bob,c.width*sc,c.height*sc);
  if(u.flash>0||(u.hp<=0)){X.globalCompositeOperation='lighter';X.globalAlpha=Math.max(u.flash,u.hp<=0?0.5:0);X.drawImage(c,x+u.dx,y+bob,c.width*sc,c.height*sc);X.globalCompositeOperation='source-over';}
  X.globalAlpha=1;});
 B.pt.forEach(u=>{const[x,y]=upos(u),dead=u.m.hp<=0,s=SPR[u.m.id];X.save();if(dead){X.restore();X.save();if(!drawPaint(u.m.id,x+14,y+33,{rot:-Math.PI/2*0.9,alpha:0.6})){X.translate(x+12,y+24);X.rotate(Math.PI/2);X.globalAlpha=0.7;X.drawImage(s.left[0],-8,-12,12*2,16*2);}}
  else if(PAINT[u.m.id]){const bob=Math.sin(T*2.2+u.i*1.3)*1.2;drawPaint(u.m.id,x+12+u.dx,y+33+bob,{flash:u.flash,sc:B.pt.length>3?0.85:1});
   if(B.act===u.i){X.globalAlpha=0.35+0.25*Math.sin(T*8);X.fillStyle='#ffe080';X.beginPath();X.ellipse(x+12,y+33,13,3,0,0,7);X.fill();X.globalAlpha=1;}
   if(u.def){X.strokeStyle='#9cf';X.globalAlpha=0.6;X.strokeRect(x-2,y-6,28,40);}}
  else{const fr=B.act===u.i?Math.floor(T*6)%3:0;X.drawImage(s.left[fr],x+u.dx,y,12*2,16*2);if(u.flash>0){X.globalAlpha=u.flash;X.fillStyle='#fff';X.globalCompositeOperation='lighter';X.drawImage(s.left[fr],x+u.dx,y,24,32);}
   const wc={kael:'#e0e0f0',lyra:'#c08040',mira:'#a07040'}[u.m.id];X.globalAlpha=1;X.globalCompositeOperation='source-over';X.fillStyle=wc;X.fillRect(x+u.dx-4,y+12,8,2);if(u.m.id==='lyra'){X.fillStyle='#ff6040';X.fillRect(x+u.dx-6,y+11,3,3);}
   if(u.def){X.strokeStyle='#9cf';X.globalAlpha=0.6;X.strokeRect(x-2,y-2,28,36);}}
  X.restore();});
 B.parts.forEach(p=>{X.globalAlpha=1-p.t/p.life;X.fillStyle=p.c;X.fillRect(p.x,p.y,2,2);});X.globalAlpha=1;
 B.nums.forEach(n=>{const t=n.t,yb=t<0.25?-Math.sin(t/0.25*Math.PI)*8:0;X.globalAlpha=t>0.8?(1.1-t)/0.3:1;txt(String(n.v),n.x,n.y-12+yb-t*4,n.c,typeof n.v==='number'?10:7,'center');X.globalAlpha=1;});
 X.restore();
 if(B.msgT>0&&B.msg){win(W/2-64,4,128,18);txt(B.msg,W/2,9,'#fff',8,'center');}
 // bottom windows
 const by=152;win(0,by,100,72);win(100,by,156,72);
 const rh=B.pt.length>3?16:21;B.pt.forEach((u,i)=>{const m=u.m,S=st(m),y=by+(rh<21?4:8)+i*rh,c=m.hp<=0?'#f55':m.hp<S.hp/4?'#ff0':'#fff';txt(m.name,110,y,c);txt(`${m.hp}`,190,y,c,8,'right');txt(`/${S.hp}`,192,y+1,'#aab',6);txt(`MP${m.mp}`,212,y+1,'#9cf',6);
  bar(110,y+(rh<21?9:11),80,m.hp/S.hp,'#30b050','#a0ff80');const full=u.atb>=100;bar(196,y+(rh<21?9:11),52,u.atb/100,full?'#ffe040':'#c06020',full?'#fff':'#ffc040');if(B.act===i)cursor(102,y);});
 const m=B.menu;
 if(m&&B.act!==null){const u=B.pt[B.act],d=HERO_DEF[u.m.id];
  if(m.k==='cmd'){if(window.CMDLIST){const L=CMDLIST(u),rh=L.length>4?11:15;L.forEach((o,i)=>{txt(o.n,22,by+(rh<15?5:8)+i*rh,o.ok===false?'#778':o.c||'#fff',rh<15?7:8);if(i===m.i)cursor(8,by+(rh<15?5:8)+i*rh);});}else ['Attack',d.skn,'Item','Defend'].forEach((o,i)=>{txt(o,22,by+8+i*15);if(i===m.i)cursor(8,by+8+i*15);});}
  else if(m.k==='skill'){win(0,by-50,140,124);const L=d.sk.filter(k=>!(SK[k].lv>u.m.lv));L.forEach((k,i)=>{const s=SK[k];txt(s.n,18,by-44+i*13,u.m.mp>=s.mp?'#fff':'#778');txt(s.mp+'',132,by-44+i*13,'#9cf',8,'right');if(i===m.i)cursor(5,by-44+i*13);});
   const s=SK[L[m.i]];if(s){txt(s.d,8,by+52,'#cde',7);txt(`MP ${u.m.mp}`,132,by+52,'#9cf',7,'right');}}
  else if(m.k==='item'){win(0,by-50,140,124);const L=Object.keys(G.items).filter(k=>G.items[k]>0);L.forEach((k,i)=>{txt(ITEMS[k].n,18,by-44+i*13);txt('x'+G.items[k],132,by-44+i*13,'#9cf',8,'right');if(i===m.i)cursor(5,by-44+i*13);});if(L[m.i])txt(ITEMS[L[m.i]].d,8,by+52,'#cde',7);}
  else if(m.k==='tgt'){const list=m.side==='E'?B.en:B.pt;const tg=m.all?alive(list):[list[m.i]];tg.forEach(t=>{const[x,y]=upos(t);cursor(t.side==='E'?x+(t.boss?100:34):x-12,y+(t.boss?40:10));});
   if(m.side==='E')B.en.forEach((e,i)=>{if(e.hp>0)txt(e.n,10,by+8+i*13,(m.all||i===m.i)?'#ffd860':'#fff',7);});else txt(m.all?'All allies':'Choose ally',10,by+8,'#ffd860',7);}}
 else{alive(B.en).forEach((e,i)=>{txt(e.n,10,by+8+i*13,'#fff',7);});if(B.boss){const e=B.en[0];bar(10,by+24,80,e.hp/e.mhp,'#a02040','#ff6080');}}
 if(B.end==='win'){win(20,60,W-40,40);txt(B.lines[0]||'',W/2,72,'#ffd860',8,'center');txt('▶ A',W-28,88,'#fff',7,'right');}
 if(B.end==='lose'){X.fillStyle=`rgba(0,0,0,${Math.min(0.7,B.endT)})`;X.fillRect(0,0,W,H);txt('The party has fallen...',W/2,100,'#f66',10,'center');}
 if(B.swirl>0){const s=B.swirl;for(let i=0;i<16;i++){X.fillStyle='#000';const a=i/16*6.28+s*6;X.beginPath();X.moveTo(W/2,H/2);X.arc(W/2,H/2,300,a,a+0.4*s*2);X.fill();}X.fillStyle=`rgba(255,255,255,${Math.max(0,s-0.6)})`;X.fillRect(0,0,W,H);}}

// ---------- title / intro / end ----------
let scene='title',TT={i:0},embers=[];for(let i=0;i<50;i++)embers.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()*20+10,p:Math.random()*6});
function drawEmbers(){embers.forEach(e=>{e.y-=e.s/60;if(e.y<-4){e.y=H+4;e.x=Math.random()*W;}const fl=0.5+0.5*Math.sin(T*4+e.p);X.fillStyle=`rgba(255,${120+fl*100|0},40,${0.5+fl*0.5})`;X.fillRect(e.x+Math.sin(T+e.p)*4,e.y,1+(fl>0.8),1+(fl>0.8));});}
function drawCastle(y0,col){X.fillStyle=col;X.fillRect(0,y0+30,W,H);[[30,10,14],[60,0,20],[100,-14,26],[140,4,16],[180,-4,22],[220,12,14]].forEach(([x,dy,w])=>{X.fillRect(x,y0+dy,w,60);for(let i=0;i<w;i+=4)X.fillRect(x+i,y0+dy-3,2,3);X.beginPath();X.moveTo(x-2,y0+dy);X.lineTo(x+w/2,y0+dy-16);X.lineTo(x+w+2,y0+dy);X.fill();});
 X.fillStyle='#ffb040';[[64,30],[106,10],[110,24],[186,20],[146,26]].forEach(([x,y])=>X.fillRect(x,y0+y,2,3));}
function drawTitle(){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0420');g.addColorStop(0.6,'#4a1a40');g.addColorStop(1,'#c0502a');X.fillStyle=g;X.fillRect(0,0,W,H);
 X.fillStyle='#fff';for(let i=0;i<40;i++)if(Math.sin(T*2+i)>-0.5)X.fillRect((i*97)%W,(i*53)%90,1,1);
 X.fillStyle='#ffe0a0';X.beginPath();X.arc(200,40,12,0,7);X.fill();X.fillStyle='#0a0420';X.beginPath();X.arc(205,37,11,0,7);X.fill();
 drawCastle(140,'#14081e');drawEmbers();
 const y=40+Math.sin(T*1.5)*2;txt('EMBERFALL',W/2+1,y+1,'#400',30,'center');const tg=X.createLinearGradient(0,y,0,y+28);tg.addColorStop(0,'#fff0b0');tg.addColorStop(0.5,'#ffb030');tg.addColorStop(1,'#c03010');
 X.font='bold 30px "Courier New",monospace';X.textAlign='center';X.fillStyle='#000';X.fillText('EMBERFALL',W/2+1.5,y+1.5);X.fillStyle=tg;X.fillText('EMBERFALL',W/2,y);
 txt('— Chronicle of the Shattered Crown —',W/2,y+32,'#ffe0c0',7,'center');
 const opts=['New Game','Continue'];win(W/2-44,118,88,36);opts.forEach((o,i)=>{txt(o,W/2-24,124+i*13,i===1&&!hasSave()?'#667':'#fff');if(TT.i===i)cursor(W/2-38,124+i*13);});
 txt('© 2026 Skywield Games · Prototype',W/2,H-10,'#c8a8c8',6,'center');txt(isTouch?'D-pad + A/B · MENU':'Arrows/WASD · Z/Enter=OK · X/Esc=Back · C=Menu',W/2,H-19,'#c8a8c8',6,'center');}
function updTitle(dt){if(held('up',dt)||held('down',dt)){TT.i^=1;sfx('move');}if(P.a){if(TT.i===1){if(!hasSave())return sfx('no');sfx('ok');load();transition(()=>{scene='map';enterMap(G.map,G.x,G.y,G.d);});}
 else{sfx('ok');newGame();transition(()=>{scene='intro';IN={p:0,t:0};});}}}
const INTRO=['Long ago, the Ember Crown kept the world warm.','Its seven flames held back the Hollow — the cold dark beneath the earth.','Thirteen nights ago, the Crown shattered.','Its shards fell across the land, and the Hollow began to stir...','In the village of Thornwick, three wanderers answered the elder\'s call.'];
let IN={p:0,t:0};
function updIntro(dt){IN.t+=dt;if(P.b){return transition(startTown);}if(P.a){if(IN.t<1.2)IN.t=1.2;else{IN.p++;IN.t=0;sfx('move');if(IN.p>=INTRO.length)transition(startTown);}}}
function startTown(){scene='map';enterMap('town',10,13,'up');dialog(['Kael: So this is Thornwick. Smaller than I pictured.','Lyra: Small villages make the best pies. And the best rumors.','Mira: Elder Bran is waiting by the fountain. Let\'s go speak with him.']);}
function drawIntro(){X.fillStyle='#05030c';X.fillRect(0,0,W,H);drawEmbers();const p=Math.min(IN.p,INTRO.length-1);
 if(p>=2){X.globalAlpha=0.5;drawCastle(150,'#1a0c22');X.globalAlpha=1;}
 const cx=W/2,cy=70;const sh=p>=2?Math.min(1,(p-2+IN.t)):0;for(let i=0;i<7;i++){const a=i/7*6.28+T*0.3,r=18+sh*60*(1+i%3*0.3);X.fillStyle=['#ff6020','#ffb030','#ffe060'][i%3];X.fillRect(cx+Math.cos(a)*r-2,cy+Math.sin(a)*r*0.6-2,4,4);}
 X.fillStyle='#ffd060';if(sh<1){X.globalAlpha=1-sh;X.fillRect(cx-10,cy-4,20,6);for(let i=0;i<5;i++)X.fillRect(cx-10+i*5,cy-9,2,5);X.globalAlpha=1;}
 X.globalAlpha=Math.min(1,IN.t*1.5);wrap(INTRO[p],38).forEach((l,i)=>txt(l,W/2,140+i*12,'#fff',8,'center'));X.globalAlpha=1;txt('A: next   B: skip',W-6,H-10,'#888',6,'right');}
function drawEnd(){X.fillStyle='#05030c';X.fillRect(0,0,W,H);drawEmbers();txt('DEMO COMPLETE',W/2,40,'#ffd060',16,'center');txt(G.flags.wyrm?'Three shards reclaimed. The storm breaks.':G.flags.tyrant?'Two shards reclaimed. Ashmarch cools.':G.flags.corsair?'The skies of Emberfall are open.':'The first shard is reclaimed.',W/2,70,'#fff',8,'center');
 G.party.forEach((m,i)=>{X.drawImage(SPR[m.id].down[Math.floor(T*4+i)%3],W/2-60+i*44,94,24,32);txt(m.name+' Lv'+m.lv,W/2-48+i*44,130,'#fff',6,'center');});
 txt('Thank you for playing Emberfall.',W/2,160,'#fff',8,'center');txt('Skywield Games',W/2,174,'#c8a8c8',7,'center');txt('Press A to return to title',W/2,200,'#888',7,'center');}
function drawOver(){X.fillStyle='#000';X.fillRect(0,0,W,H);txt('GAME OVER',W/2,80,'#c33',20,'center');txt('The ember gutters... but does not die.',W/2,116,'#ccc',7,'center');txt(hasSave()?'A: Load last save    B: Title':'A/B: Title',W/2,150,'#fff',7,'center');}

// ---------- extension hooks (sky.js) ----------
const XSCN={},XUI={},XDOOR={},XWIN={},XSTEP=[],XFENTS=[];
// ---------- main loop ----------
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;T+=dt;
 if(fadeDir){fade+=dt*(fadeDir>0?4:-4);if(fadeDir>0&&fade>=1){fade=1;fadeDir=-1;const cb=fadeCb;fadeCb=null;cb&&cb();}else if(fadeDir<0&&fade<=0){fade=0;fadeDir=0;}}
 else if(UI.length){const u=UI[UI.length-1];(XUI[u.k]?XUI[u.k].u:({dlg:updDlg,choice:updChoice,menu:updMenu,shop:updShop})[u.k])(u,dt);}
 else if(scene==='title')updTitle(dt);else if(scene==='intro')updIntro(dt);else if(scene==='map')updField(dt);else if(scene==='battle'){G.time+=dt;updBattle(dt);}
 else if(XSCN[scene]){G.time+=dt;XSCN[scene].u(dt);}
 else if(scene==='ending'){if(P.a){sfx('ok');transition(()=>{scene=G.map==='sky'&&G.sky?'skymap':'map';});}}
 else if(scene==='gameover'){if(P.a&&hasSave()){load();transition(()=>{scene='map';enterMap(G.map,G.x,G.y,G.d);});}else if(P.a||P.b)transition(()=>{scene='title';});}
 if(AC){setMusic(musicFor());tickMusic();}
 setT();if(scene==='title')drawTitle();else if(scene==='intro')drawIntro();else if(scene==='map')drawField();else if(scene==='battle')drawBattle();else if(XSCN[scene])XSCN[scene].d();else if(scene==='ending')drawEnd();else drawOver();
 UI.forEach(u=>(XUI[u.k]?XUI[u.k].d:({dlg:drawDlg,choice:drawChoice,menu:drawMenu,shop:drawShop})[u.k])(u));
 if(fade>0){X.fillStyle=`rgba(0,0,0,${fade})`;X.fillRect(0,0,W,H);}
 for(const k in P)delete P[k];requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// debug hooks for automated tests
window.DBG={get scene(){return scene},get G(){return G},get B(){return B},get UI(){return UI},press,rel,newGame,enterMap,startBattle,openMenu,openShop,setScene:s=>scene=s,
 gainXP,save,load,setStage(name){newGame();scene='map';UI=[];enterMap(name,G.x,G.y);}};
