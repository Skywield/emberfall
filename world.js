// Painted world (art/key_world.py -> art/game/world/*): every map tile char, the battle backdrops and the sky map now use
// painted art. Tiles come from one opaque 48px-cell atlas (tiles.jpg, manifest tiles_man.js): each char has a row of
// 9 seamless variants picked by world position (x%3, y%3) so ground reads as one continuous painting, plus 2 frames for
// water / lava / void / braziers. Cells are still exactly one 16x16 logical tile, so collision, doors, chests and NPCs are
// unchanged; the procedural TILES canvases stay as the fallback until the atlas loads (or if it fails).
const PTILE=new Map();const WART={atlas:null,bd:{},isle:{},cloud:{},sea:null};
(function(){const M=window.PTILE_MAN;if(!M)return;const im=new Image();im.onload=()=>{WART.atlas=im;for(const c in M)PTILE.set(c,M[c]);};im.src='art/game/world/tiles.jpg';
 const L=(o,k,f)=>{const i=new Image();i.onload=()=>{o[k]=i;};i.src='art/game/world/'+f;};
 ['field','cave','ash','forge','snow','glacier','jungle','sunken','twilight','throne','heart'].forEach(b=>L(WART.bd,b,'bd_'+b+'.jpg'));
 ['plain','trees','dock','wreck','ruin','hide','ash','frost','mire','veil','throne','storm','rock','tree','light'].forEach(k=>L(WART.isle,k,'isle_'+k+'.png'));
 ['white','storm','wisp'].forEach(k=>L(WART.cloud,k,'cloud_'+k+'.png'));L(WART,'sea','sky_sea.jpg');})();
function drawPT(t,x,y,dx,dy){const p=PTILE.get(t);if(!p)return false;const v=(y%3)*3+(x%3),f=p.frames>1?Math.floor(T*2)%p.frames:0;
 X.drawImage(WART.atlas,v*48,(p.row+f)*48,48,48,dx,dy,16,16);return true;}
function ptCanvas(t){const p=PTILE.get(t);if(!p)return null;const c=document.createElement('canvas');c.width=c.height=48;c.getContext('2d').drawImage(WART.atlas,0,p.row*48,48,48,0,0,48,48);return c;}
// ---------- battle backdrops ----------
const BD_KEYS={ash:1,forge:1,snow:1,glacier:1,jungle:1,sunken:1,twilight:1,throne:1,heart:1};
function bdKey(cv){return !cv?'field':BD_KEYS[cv]?cv:'cave';}
const BD_MOTE={field:['#fff8c0',0.25],cave:['#a8a0ff',0.35],ash:['#ff9040',0.6],forge:['#ffb040',0.7],snow:['#ffffff',0.8],glacier:['#bff0ff',0.5],jungle:['#c0ff80',0.5],
 sunken:['#60f0d0',0.5],twilight:['#e0b0ff',0.5],throne:['#ffd070',0.45],heart:['#ffd070',0.6]};
function BDRAW(cv){const k=bdKey(cv),im=WART.bd[k];if(!im)return false;X.save();X.imageSmoothingEnabled=true;X.drawImage(im,-4,0,W+8,152);X.restore();
 const [c,a]=BD_MOTE[k];X.fillStyle=c;const n=k==='snow'?40:18;for(let i=0;i<n;i++){X.globalAlpha=a*(0.5+0.5*Math.sin(T*2+i));
  const fall=k==='snow';X.fillRect((i*53+T*(fall?12:6))%W,fall?(i*29+T*25)%150:150-((i*23+T*(k==='forge'||k==='ash'||k==='heart'?18:6))%120),1,fall?1:2);}X.globalAlpha=1;
 if(k==='heart'){X.globalAlpha=0.18+0.1*Math.sin(T*3);X.fillStyle='#ff3040';X.beginPath();X.arc(W*0.5,56,34,0,7);X.fill();X.globalAlpha=1;}return true;}
// ---------- sky map ----------
function SKYSEA(cx,cy,alt){const s=WART.sea;if(!s)return false;X.save();X.imageSmoothingEnabled=true;const sz=128,ox=-(((cx*0.6+T*6)%sz)+sz)%sz,oy=-((cy*0.6)%sz+sz)%sz;
 X.globalAlpha=1;for(let y=oy;y<H;y+=sz)for(let x=ox;x<W;x+=sz)X.drawImage(s,x,y,sz+0.5,sz+0.5);
 if(alt>0){X.globalAlpha=alt*0.25;X.fillStyle='#2856b0';X.fillRect(0,0,W,H);}X.restore();return true;}
function SKYCLOUD(t,x,y,h){const im=t==='V'?WART.cloud.white:WART.cloud.storm;if(!im)return false;const w=34+(h%9),hh=w*im.height/im.width;X.save();X.imageSmoothingEnabled=true;
 X.globalAlpha=t==='E'?1:0.95;if(t==='E'){X.filter='brightness(0.6)';}X.drawImage(im,x-w/2,y-hh/2,w,hh);X.restore();
 if(t!=='V'&&Math.sin(T*2.3+h)>0.985){X.strokeStyle='#fff6a0';X.lineWidth=1.2;X.beginPath();X.moveTo(x,y-10);X.lineTo(x+4,y);X.lineTo(x-2,y+3);X.lineTo(x+3,y+12);X.stroke();}return true;}
const _drawIsle=drawIsle;const ISLE_GEN=['plain','trees','rock','tree','light'];
drawIsle=function(x,y,rx,ry,kind){const k=kind?(WART.isle[kind]?kind:null):ISLE_GEN[Math.abs((rx*31)|0)%5];const im=k&&WART.isle[k];
 if(!im)return _drawIsle(x,y,rx,ry,kind);const w=rx*2.5,h=w*im.height/im.width;X.save();X.imageSmoothingEnabled=true;X.drawImage(im,x-w/2,y-h*0.42,w,h);X.restore();
 if(kind==='ruin'&&typeof blob==='function')blob(x,y-ry*1.6,3+Math.sin(T*4),'#ffb040',0.7);};
// ---------- soft ground transitions ----------
// Where two different ground types meet, the higher-priority ground (grass over path, sand/grass over water, snow over
// trodden snow, ...) bleeds ~5px into its neighbour through a painterly noisy alpha mask. Purely visual: tile chars,
// SOLID and doors are untouched. Prop tiles on a grass base (trees, fences, flowers, huts) count as grass when bleeding.
const EDGE_P={'.':6,'<':5,'s':6,'h':6,'d':6,'a':6,'M':6,',':4,'j':4,'w':4,'N':4,'S':4,'~':2,'K':2,'l':2,'k':2,'L':2};
const EDGE_BASE={T:'.',f:'.',F:'.',V:'.',H:'.',m:'.',P:'s',I:'s',t:'h',i:'h',r:'a',g:'a',A:'d',G:'d',Q:'M'};
const EDGE_MASK=[0,1,2,3].map(d=>{const c=document.createElement('canvas');c.width=c.height=48;const g=c.getContext('2d');let s=d*977+13;const R=()=>(s=(s*16807)%2147483647)/2147483647;
 for(let i=0;i<48;i++){const depth=10+R()*8+Math.sin(i*0.35+d)*3;const gr=[g.createLinearGradient(0,0,0,depth),0];const gg=gr[0];gg.addColorStop(0,'rgba(0,0,0,1)');gg.addColorStop(0.45,'rgba(0,0,0,0.75)');gg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gg;g.fillRect(i,0,1,depth);}
 const o=document.createElement('canvas');o.width=o.height=48;const q=o.getContext('2d');q.translate(24,24);q.rotate(d*Math.PI/2);q.drawImage(c,-24,-24);return o;}); // 0=N 1=E 2=S 3=W
const EDGE_C=new Map();
function edgeCell(a,v,f,d){const k=a+v+'|'+f+d;let c=EDGE_C.get(k);if(c)return c;const p=PTILE.get(a);c=document.createElement('canvas');c.width=c.height=48;const g=c.getContext('2d');
 g.drawImage(WART.atlas,v*48,(p.row+f)*48,48,48,0,0,48,48);g.globalCompositeOperation='destination-in';g.drawImage(EDGE_MASK[d],0,0);EDGE_C.set(k,c);return c;}
const _drawPT=drawPT;const EDIRS=[[0,-1],[1,0],[0,1],[-1,0]];
drawPT=function(t,x,y,dx,dy){if(!_drawPT(t,x,y,dx,dy))return false;const pb=EDGE_P[t];if(pb===undefined||typeof MAPS==='undefined'||!MAPS[G.map])return true;const M=MAPS[G.map];
 const v=(y%3)*3+(x%3);for(let d=0;d<4;d++){const nx=x+EDIRS[d][0],ny=y+EDIRS[d][1];if(nx<0||ny<0||nx>=M.w||ny>=M.h)continue;let a=M.rows[ny][nx];a=EDGE_BASE[a]||a;
  const pa=EDGE_P[a];if(pa===undefined||pa<=pb||a===t||!PTILE.has(a))continue;const f=PTILE.get(a).frames>1?Math.floor(T*2)%PTILE.get(a).frames:0;X.drawImage(edgeCell(a,v,f,d),dx,dy,16,16);}return true;};
// ---------- readable darkness ----------
// Dark dungeons keep a vignette + cool tint, but lighter (phone screens) and with a warm ember glow around the party.
function DARKFX(px,py){let g=X.createRadialGradient(px,py,40,px,py,190);g.addColorStop(0,'rgba(6,4,18,0)');g.addColorStop(0.6,'rgba(6,4,18,0.28)');g.addColorStop(1,'rgba(6,4,18,0.58)');X.fillStyle=g;X.fillRect(0,0,W,H);
 X.save();X.globalCompositeOperation='lighter';g=X.createRadialGradient(px,py,0,px,py,56);const fl=0.08+0.02*Math.sin(T*7);g.addColorStop(0,`rgba(255,150,60,${fl})`);g.addColorStop(1,'rgba(255,150,60,0)');X.fillStyle=g;X.fillRect(px-60,py-60,120,120);X.restore();}
