'use strict';
// Emberfall — Airship system: Galewright Point, the Cinderwing, sky map, shipyard, crew and turn-based sky battles.
MFILES.sky='music_sky';
// ---------- art ----------
const SKYART={};
[['cinderwing','cinderwing'],['gloomray','gloomray'],['roc','rotwing_roc']].forEach(([k,f])=>{const im=new Image();im.onload=()=>{SKYART[k]=im;if(k==='cinderwing')mkCorsairArt(im);};im.src='art/game/'+f+'.png';});
function mkCorsairArt(im){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');
 try{g.filter='hue-rotate(150deg) saturate(0.8) brightness(0.65) contrast(1.25)';}catch(e){}g.drawImage(im,0,0);g.filter='none';
 g.globalCompositeOperation='source-atop';g.fillStyle='rgba(40,0,30,0.3)';g.fillRect(0,0,c.width,c.height);SKYART.corsair=c;}
function dImg(im,cx,cy,sc=1,o={}){if(!im)return;const w=im.width/SC*sc,h=im.height/SC*sc;X.save();X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';
 X.translate(cx,cy);if(o.flip)X.scale(-1,1);if(o.rot)X.rotate(o.rot);X.globalAlpha=o.alpha??1;X.drawImage(im,-w/2,-h/2,w,h);
 if(o.flash>0){X.globalCompositeOperation='lighter';X.globalAlpha=Math.min(1,o.flash)*0.55;X.drawImage(im,-w/2,-h/2,w,h);}X.restore();}
function blob(x,y,r,c,a=1){X.globalAlpha=a;X.fillStyle=c;X.beginPath();X.arc(x,y,r,0,7);X.fill();X.globalAlpha=1;}
SPR.orrin=charSet({H:'#4a3a2a',h:'#8a7a5a',s:'#d8a878',O:'#2a3a6a',A:'#c8a050',L:'#2a2a3a',b:'#2a1a0a'});
SPR.saffa=charSet({H:'#1a1a1a',h:'#5a4040',s:'#b07850',O:'#a83030',A:'#e0b040',L:'#3a2a2a',b:'#1a1010'});
SPR.dagny=charSet({H:'#d87830',h:'#ffb060',s:'#f0c8a0',O:'#5a6a3a',A:'#8a8a9a',L:'#3a3a2a',b:'#3a2010'});
// open sky below the cliffs: pale, soft cloud puffs (no water-like stripes)
TILES.k=[0,1].map(f=>tileCanvas(g=>{const gr=g.createLinearGradient(0,0,0,16);gr.addColorStop(0,'#b8dcfa');gr.addColorStop(1,'#d8ecfc');g.fillStyle=gr;g.fillRect(0,0,16,16);
 g.fillStyle='#ffffff';g.globalAlpha=0.9;[[(2+f*4)%16,6,4],[(10+f*2)%16,11,3]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.arc(x+r,y+1,r*0.8,0,7);g.arc(x-r,y+1,r*0.7,0,7);g.fill();});g.globalAlpha=1;}));
TILES.H=[tileCanvas(g=>{grass(g);px(g,'#8a5a2a',2,5,12,9);for(let x=2;x<14;x+=3)px(g,'#6a4020',x,5,1,9);px(g,'#5a3418',7,0,1,6);px(g,'#e04030',8,0,5,3);})];
SOLID.add('k');

// ---------- data ----------
const TIERS=[null,{n:'Skiff',hull:800,arm:6,slots:2},{n:'Corvette',hull:1200,arm:10,slots:3,cost:600,mat:{iron:3}},{n:'Frigate',hull:1800,arm:16,slots:3,cost:1500,mat:{iron:5,ichor:3}}];
const CANNON={deck:{n:'Deck Gun',dmg:40},culverin:{n:'Brass Culverin',dmg:70},harpoon:{n:'Ice Harpoon',dmg:55,ice:1},hollowbane:{n:'Hollowbane Cannon',dmg:110,bane:1}};
const MATN={ichor:'Hollow Ichor',feather:'Gale Feathers',iron:'Cinder Iron'};
const YARD=[{k:'repair',n:'Repair hull',d:'Free for the Cinderwing\'s crew.'},{k:'tier',n:'Upgrade hull'},
 {k:'culverin',n:'Brass Culverin',p:400,d:'Cannon, 70 damage.'},{k:'harpoon',n:'Ice Harpoon',p:450,d:'Cannon, 55 damage. Hits can chill a HEAVY telegraph into a normal hit.'},
 {k:'plating',n:'Iron Plating',p:350,once:1,d:'Armor +6.'},{k:'kit',n:'Repair Kit',p:80,d:'Battle item: restores 300 Hull.'},
 {k:'hollowbane',n:'Hollowbane Cannon',p:300,craft:{ichor:3,iron:2},d:'Crafted cannon, 110 damage, x1.3 vs Hollow beasts.'},
 {k:'sail',n:'Galeweave Sail',p:200,craft:{feather:3},once:1,d:'Crafted. Unlocks HIGH altitude (B) and Speed +4.'},
 {k:'keel',n:'Stormkeel',p:250,craft:{feather:2,iron:2},once:1,d:'Crafted. Lets the Cinderwing cut through storm walls.'},{k:'leave',n:'Leave'}];
const CREW={pip:{n:'Pip the Lookout',b:'Sees all 4 enemy telegraphs; fewer random battles'},saffa:{n:'Gunner Saffa',b:'Cannon damage +25%'}};
const SKYEN={
 gloomray:{n:'Gloomray',hull:520,atk:46,spd:7,weak:'side',art:'gloomray',hollow:1,w:{hit:3,red:1.5,purple:1.2,green:1.5},g:120,xp:70,drop:{ichor:1},sc:0.9},
 roc:{n:'Rotwing Roc',hull:820,atk:56,spd:13,weak:'back',art:'roc',hollow:1,w:{hit:3,red:2,purple:1,green:1.2},g:180,xp:110,drop:{feather:2},sc:0.85},
 skiff:{n:'Ashclaw Skiff',hull:700,atk:50,spd:10,weak:'front',art:'corsair',pirate:1,w:{hit:3,red:1.5,purple:1,green:1.5},g:220,xp:95,drop:{iron:2},sc:0.8},
 corsair:{n:'Ashclaw Corsair',hull:1700,atk:70,spd:11,weak:'front',art:'corsair',pirate:1,boss:1,w:{hit:3,red:2,purple:1.5,green:1},g:900,xp:600,drop:{iron:3,ichor:2},sc:1.05}};
function newSky(){return {hull:800,tier:1,parts:{deck:2},kits:2,mat:{ichor:0,feather:0,iron:0},crew:{},key:{},loot:{},x:0,y:0,alt:0,altT:0,face:1,enc:700,tut:0,rocs:0,flags:{}};}
function shipStats(){const S=G.sky,t=TIERS[S.tier];const mounted=Object.keys(S.parts).filter(k=>CANNON[k]).flatMap(k=>Array(S.parts[k]).fill(k)).sort((a,b)=>CANNON[b].dmg-CANNON[a].dmg).slice(0,t.slots);
 return {hull:t.hull,arm:t.arm+(S.parts.plating?6:0),spd:8+(S.parts.sail?4:0),cannons:mounted,slots:t.slots,lance:S.parts.core?1.5:1};}

// ---------- hooks into the base game ----------
const _enterMap=enterMap,_blocked=blocked,_openMenu=openMenu;
enterMap=function(name,x,y,d){
 if(name==='__ship'){if(!G.sky||!G.sky.tut){toast('The ship isn\'t ready.');return;}return startSkyMap(POI.find(p=>p.id===(G.map==='world'?'thorn':'gale')));}
 if(name==='sky'){if(G.sky){scene='skymap';G.map='sky';return;}name='harbor';x=10;y=8;}
 if(name==='world'&&G.sky)ensureWorldPad();
 _enterMap(name,x,y,d);};
blocked=function(x,y){if(G.map==='harbor'&&y>=11&&!(G.sky&&G.sky.tut))return true;return _blocked(x,y);};
openMenu=function(){const i=MOPTS.indexOf('Ship');if(G.sky&&i<0)MOPTS.splice(3,0,'Ship');if(!G.sky&&i>=0)MOPTS.splice(i,1);_openMenu();};
function ensureWorldPad(){if(!MAPS.world.warps.some(w=>w.to==='__ship')){MAPS.world.warps.push({x:4,y:5,to:'__ship'});setTile('world',4,5,'H');}}
window.XFIELD=function(cx,cy){
 if(G.map==='harbor'){const wreck=!G.sky;dImg(SKYART.cinderwing,13*16-cx,12*16-cy+Math.sin(T*1.5)*1.5,0.62,{flip:true,rot:wreck?0.22:0,alpha:wreck?0.85:1});
  if(wreck){X.fillStyle='#5558';for(let i=0;i<3;i++){const p=(T*0.6+i/3)%1;blob(13*16-cx+6+i*3,12*16-cy-14-p*16,2+p*3,'#666',0.5*(1-p));}}}
 if(G.map==='world'&&G.sky)dImg(SKYART.cinderwing,4*16-cx+8,5*16-cy-8+Math.sin(T*1.5)*1.5,0.4,{flip:true});};

// ---------- story: after Gravemaw ----------
MAPS.harbor={name:'Galewright Point',rows:[
"TTTTTTTTTTTTTTTTTTTT","T..f.....,......f..T","T.RRRR...,...RRRRR.T","T.RRRR...,...RRRRR.T","T.WDWW...,...WWDWW.T","T....,,,,,,,,,,,...T",
"T.f..,.........,...T","T....,,,,,,,,,,,..fT","T..........,.......T","kkkkkkk....,....kkkk","kkkkkkkk...,...kkkkk","kkkkkkkkkkkBkkkkkkkk","kkkkkkkkkkkBkkkkkkkk","kkkkkkkkkkkBkkkkkkkk"],
 enc:0,warps:[{x:11,y:13,to:'__ship'}],doors:{'3,4':'hinn','15,4':'yard'}};
MAPS.harbor.w=20;MAPS.harbor.h=14;
// where land drops off into the sky, draw a cliff face instead of open sky
MAPS.harbor.rows=MAPS.harbor.rows.map((r,y)=>r.split('').map((c,x)=>c==='k'&&y>0&&!'kqB'.includes(MAPS.harbor.rows[y-1][x])?'q':c).join(''));
NPCS.harbor=[
 {x:12,y:10,s:'orrin',d:'down',act:()=>orrinAct()},
 {x:6,y:6,s:'kid',d:'down',act:()=>pipAct()},
 {x:17,y:8,s:'saffa',d:'left',act:()=>saffaAct()},
 {x:17,y:5,s:'dagny',d:'down',lines:()=>['Dagny: Shipyard\'s through the door behind me.','Dagny: Bring gold — or Hollow Ichor, Gale Feathers and Cinder Iron, and I\'ll craft you parts.']},
 {x:8,y:7,s:'guard',d:'down',lines:()=>G.sky?['Dockhand: Storm walls rage to the northeast. Only a Stormkeel cuts through those.','Dockhand: The white Veil to the northwest? You\'d have to fly over it — high altitude.']:['Dockhand: Old Orrin\'s been staring at that wreck for a month.']}];
function afterGravemaw(){dialog(['Lyra: Wait... the shard is pulling at me. North-west, past the cliffs.','Mira: Toward the Sea of Clouds? Nobody sails there anymore.','Kael: Then we\'ll be the first. Let\'s follow it.'],
 ()=>transition(()=>{scene='map';G.flags.harbor=1;enterMap('harbor',10,8,'up');save();
  dialog(['Galewright Point — a cliff harbor at the edge of the sky.','Lyra: The shard is glowing toward that wrecked skiff on the dock... and the man beside it.']);}));}
function orrinAct(){const S=G.sky;
 if(!S){dialog(['Orrin Vey: Easy there. That wreck is mine — or was, before a Gloomray tore her sails.','Orrin Vey: ...That shard you carry. It hums like an engine core.','Orrin Vey: Lend me its warmth and your hands, and she\'ll fly again.'],
  ()=>choice('Repair the skiff with Orrin?',['Yes','Not yet'],i=>{if(i===0)repairScene();}));return;}
 dialog(['Orrin Vey: She\'s your ship as much as mine. Walk down the dock to board.',
  !S.parts.sail?'Orrin Vey: Want to climb above the Veil? Gale Feathers from Rotwing Rocs make a fine Galeweave Sail.':!S.parts.keel?'Orrin Vey: The Ashclaw pirates hide behind the storm wall. Dagny can craft a Stormkeel.':'Orrin Vey: Give Varra Kade my regards — with a cannonball.']);}
function repairScene(){transition(()=>{G.sky=newSky();
 dialog(['(The party works through the night. Orrin seats the shard in the engine.)','Orrin Vey: She needs a name. Something with fire in it.','Lyra: The Cinderwing.','Orrin Vey: The Cinderwing it is! Let\'s take her up!'],
  ()=>transition(()=>{startSkyMap(POI[0]);dialog(['(A shadow rises from the clouds below...)','Orrin Vey: A Gloomray! The same beast that grounded me!','Orrin Vey: Plan each turn on the grid: 3 heroes and the ship. Red turns hit hard — Guard! Green turns are openings!'],
   ()=>startSkyBattle('gloomray',{tut:1}));}));});}
function pipAct(){const S=G.sky;
 if(S&&S.crew.pip)return dialog(['Pip: Lookout reporting! I\'ll call every move those beasts make.']);
 if(!S)return dialog(['Pip: Someday I\'ll be a lookout on a real airship!']);
 if(S.key.spyglass){delete S.key.spyglass;S.crew.pip=1;sfx('lvl');return dialog(['Pip: My uncle\'s spyglass! You found it!','Pip: Take me aboard — I can see a beast\'s next move before it makes it!','Pip the Lookout joined the crew! (All 4 enemy telegraphs visible, fewer random battles.)']);}
 S.flags.pipQ=1;dialog(['Pip: You have a ship?! Then... could you find my uncle\'s spyglass?','Pip: It went down with his skiff at Gull\'s Rest — the wreck south-east of here.','Pip: Bring it back and I\'ll be the best lookout in the sky!']);}
function saffaAct(){const S=G.sky;
 if(S&&S.crew.saffa)return dialog(['Saffa: Point me at something ugly and I\'ll make it fall.']);
 if(!S)return dialog(['Saffa: A gunner without a ship is just a woman with a loud hobby.']);
 if(S.rocs>0){S.crew.saffa=1;sfx('lvl');return dialog(['Saffa: You brought down a Rotwing Roc? With THAT crew?','Saffa: Fine. You\'ve earned a real gunner.','Gunner Saffa joined the crew! (Cannon damage +25%.)']);}
 S.flags.saffaQ=1;dialog(['Saffa: Gunner Saffa. I only sail with crews that can shoot.','Saffa: Bring down a Rotwing Roc out in the open sky, and we\'ll talk.']);}
XDOOR.hinn=()=>{choice('Inn: Rest for 20G? (Restores HP/MP)',['Rest','Leave'],i=>{if(i)return;if(G.gold<20)return toast('Not enough gold.');G.gold-=20;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['The party feels refreshed! (Game saved.)']);});});};
XDOOR.yard=()=>openYard();
function openYard(){if(!G.sky){dialog(['Dagny: No ship, no shipyard business. Talk to Orrin first.']);return;}UI.push({k:'yard',i:0,msg:'Welcome to Galewright Shipyard!'});}

// ---------- shipyard ----------
function yardCost(it){const S=G.sky;if(it.k==='tier'){const nt=TIERS[S.tier+1];return nt?{g:nt.cost,m:nt.mat}:null;}return {g:it.p||0,m:it.craft||{}};}
function yardBuy(k,u){const S=G.sky,it=YARD.find(y=>y.k===k),ss=shipStats(),msg=s=>{if(u)u.msg=s;};
 if(k==='repair'){if(S.hull>=ss.hull){sfx('no');msg('The hull is already sound.');return false;}S.hull=ss.hull;sfx('heal');msg('Hull fully repaired.');return true;}
 const c=yardCost(it);if(!c){sfx('no');msg('Already at the best hull tier.');return false;}
 if(it.once&&S.parts[k]){sfx('no');msg('Already installed.');return false;}
 if(G.gold<c.g){sfx('no');msg('Not enough gold.');return false;}
 for(const m in c.m)if(S.mat[m]<c.m[m]){sfx('no');msg('Missing materials.');return false;}
 G.gold-=c.g;for(const m in c.m)S.mat[m]-=c.m[m];
 if(k==='tier'){S.tier++;S.hull=shipStats().hull;msg('Hull rebuilt as a '+TIERS[S.tier].n+'!');}
 else if(k==='kit'){S.kits++;msg('Bought a Repair Kit.');}
 else{S.parts[k]=(S.parts[k]||0)+1;msg((it.craft?'Crafted ':'Installed ')+it.n+'!');}
 sfx('coin');return true;}
XUI.yard={u(u,dt){const L=YARD;if(held('up',dt)){u.i=(u.i+L.length-1)%L.length;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%L.length;sfx('move');}
 if(P.b){UI.pop();sfx('no');return;}if(P.a){const it=L[u.i];if(it.k==='leave'){UI.pop();sfx('no');return;}yardBuy(it.k,u);}},
 d(u){const S=G.sky,ss=shipStats();X.fillStyle='#000a';X.fillRect(0,0,W,H);win(4,4,W-8,20);txt('Galewright Shipyard',12,10,'#ffd860');txt(G.gold+' G',W-12,10,'#fff',8,'right');
 win(4,28,124,H-52);YARD.forEach((it,i)=>{const y=34+i*13,c=it.k==='tier'||it.k==='repair'||it.k==='leave'?null:yardCost(it);
  const done=it.once&&S.parts[it.k];txt(it.k==='tier'?(TIERS[S.tier+1]?'Hull → '+TIERS[S.tier+1].n:'Hull (max)'):it.n,18,y,done?'#778':'#fff',7);
  if(c)txt(done?'Owned':(it.craft?'✦':'')+c.g+'G',124,y,done?'#778':it.craft?'#ffb070':'#ffd860',6,'right');if(i===u.i)cursor(7,y);});
 win(132,28,120,H-52);const it=YARD[u.i];let y=34;
 const desc=it.k==='tier'?(TIERS[S.tier+1]?`${TIERS[S.tier+1].n}: Hull ${TIERS[S.tier+1].hull}, Armor ${TIERS[S.tier+1].arm}, ${TIERS[S.tier+1].slots} cannon slots.`:'The finest hull Dagny can build.'):(it.d||'');
 wrap(desc,26).forEach(l=>{txt(l,138,y,'#cde',6);y+=8;});const c=yardCost(it);
 if(c&&it.k!=='repair'&&it.k!=='leave'){y+=2;txt('Cost: '+c.g+' G',138,y,G.gold>=c.g?'#ffd860':'#f88',6);y+=8;for(const m in c.m){txt(`${MATN[m]} ${S.mat[m]}/${c.m[m]}`,138,y,S.mat[m]>=c.m[m]?'#9f9':'#f88',6);y+=8;}}
 y=Math.max(y+4,100);txt('— Cinderwing —',192,y,'#ffd860',7,'center');y+=10;
 [[`Hull`,`${S.hull}/${ss.hull}`],['Tier',TIERS[S.tier].n],['Armor',ss.arm],['Speed',ss.spd],['Kits',S.kits]].forEach(([a,b])=>{txt(a,140,y,'#9cf',6);txt(String(b),246,y,'#fff',6,'right');y+=8;});
 ss.cannons.forEach((k,i)=>{txt(`Slot ${i+1}: ${CANNON[k].n}`,140,y,'#fff',6);y+=8;});for(let i=ss.cannons.length;i<ss.slots;i++){txt(`Slot ${i+1}: (empty)`,140,y,'#778',6);y+=8;}
 txt(`Ichor ${S.mat.ichor}  Feather ${S.mat.feather}  Iron ${S.mat.iron}`,192,H-34,'#ffb070',6,'center');
 win(4,H-22,W-8,18);txt(u.msg||'',12,H-17,'#fff',7);}};
XUI.shipinfo={u(u){if(P.a||P.b||P.menu){UI.pop();sfx('no');}},d(){const S=G.sky,ss=shipStats();X.fillStyle='#000a';X.fillRect(0,0,W,H);win(8,8,W-16,H-16);
 dImg(SKYART.cinderwing,60,48,0.9,{flip:true});txt('The Cinderwing',112,16,'#ffd860',10);txt(TIERS[S.tier].n+' · Captain Orrin Vey',112,30,'#bbd',7);
 [[`Hull`,`${S.hull}/${ss.hull}`],['Armor',ss.arm],['Speed',ss.spd],['Emberlance',ss.lance>1?'Ember Core x1.5':'Standard']].forEach(([a,b],i)=>{txt(a,112,44+i*10,'#9cf',7);txt(String(b),244,44+i*10,'#fff',7,'right');});
 let y=90;txt('Cannons',16,y,'#ffd860',7);y+=10;ss.cannons.forEach((k,i)=>{txt(`${i+1}. ${CANNON[k].n} (${CANNON[k].dmg})`,20,y,'#fff',7);y+=9;});
 y+=4;txt('Parts',16,y,'#ffd860',7);y+=10;const parts=[S.parts.plating&&'Iron Plating',S.parts.sail&&'Galeweave Sail',S.parts.keel&&'Stormkeel',S.parts.core&&'Ember Core'].filter(Boolean);txt(parts.join(', ')||'None yet',20,y,'#fff',6);y+=12;
 txt('Crew',16,y,'#ffd860',7);y+=10;const cr=Object.keys(S.crew);if(!cr.length){txt('Just the four of you.',20,y,'#778',6);y+=9;}cr.forEach(k=>{txt(CREW[k].n,20,y,'#fff',7);txt(CREW[k].b,28,y+8,'#9cf',6);y+=18;});
 txt(`Ichor ${S.mat.ichor}   Feathers ${S.mat.feather}   Cinder Iron ${S.mat.iron}   Kits ${S.kits}`,W/2,H-22,'#ffb070',6,'center');}};

// ---------- sky world map ----------
const SKYW=48,SKYH=36;
const SKYT=[];for(let y=0;y<SKYH;y++){let r='';for(let x=0;x<SKYW;x++){let t=' ';
 if(x<1||y<1||x>=SKYW-1||y>=SKYH-1)t='E';
 else if(x>=31&&y<=15&&(x<=32||y>=14))t='S';
 else if(x>=2&&x<=14&&y>=2&&y<=12&&(x<=3||x>=13||y<=3||y>=11))t='V';r+=t;}SKYT.push(r);}
const POI=[{id:'gale',k:'dock',n:'Galewright Point',x:24,y:27,rx:26,ry:9},{id:'thorn',k:'dock',n:'Thornwick Landing',x:9,y:24,rx:22,ry:8},
 {id:'gull',k:'wreck',n:'Gull\'s Rest Wreck',x:37,y:25,rx:18,ry:7},{id:'spire',k:'ruin',n:'Skyreach Ruins',x:8,y:7,rx:24,ry:9},{id:'hide',k:'hide',n:'Ashclaw Hideout',x:40,y:7,rx:26,ry:10}];
const ISLES=[[16,15,10],[28,19,8],[19,32,12],[43,30,9],[26,8,7],[5,31,8],[38,19,6]];
function skyTile(px_,py_){const x=Math.floor(px_/16),y=Math.floor(py_/16);if(x<0||y<0||x>=SKYW||y>=SKYH)return 'E';return SKYT[y][x];}
function canFly(px_,py_){const S=G.sky,t=skyTile(px_,py_);if(t==='E')return false;if(t==='S')return !!S.parts.keel;if(t==='V')return S.alt===1;return true;}
function startSkyMap(p){const S=G.sky;scene='skymap';G.map='sky';UI=[];if(p){S.x=p.x*16+8;S.y=p.y*16+8+30;S.alt=0;S.altT=0;}}
function nearPOI(){const S=G.sky;return POI.find(p=>Math.hypot(p.x*16+8-S.x,p.y*16+8-S.y)<44);}
let MINI=null;function miniMap(){if(MINI)return MINI;MINI=document.createElement('canvas');MINI.width=SKYW;MINI.height=SKYH;const g=MINI.getContext('2d');
 for(let y=0;y<SKYH;y++)for(let x=0;x<SKYW;x++){const t=SKYT[y][x];g.fillStyle=t==='E'?'#141428':t==='S'?'#4a3060':t==='V'?'#e8f0ff':'#4a80d0';g.fillRect(x,y,1,1);}
 g.fillStyle='#6ab04a';ISLES.concat(POI.map(p=>[p.x,p.y,8])).forEach(([x,y])=>g.fillRect(x-1,y,3,1));return MINI;}
function updSkyMap(dt){const S=G.sky;S.altT+=(S.alt-S.altT)*Math.min(1,dt*4);
 if(P.menu){openMenu();return;}
 if(P.b){if(!S.parts.sail){sfx('no');toast('The Cinderwing needs a Galeweave Sail to climb higher. (Shipyard: craft from Gale Feathers)');return;}
  if(S.alt&&skyTile(S.x,S.y)==='V'){sfx('no');toast('The Veil is too thick to descend here.');return;}S.alt^=1;sfx('ok');}
 let vx=(K.right?1:0)-(K.left?1:0),vy=(K.down?1:0)-(K.up?1:0);const n=Math.hypot(vx,vy)||1;vx/=n;vy/=n;
 const sp=(S.alt?100:62)*(1+(shipStats().spd-8)*0.05),ox=S.x,oy=S.y;
 if(vx){const nx=S.x+vx*sp*dt;if(canFly(nx+vx*10,S.y))S.x=nx;S.face=vx>0?1:-1;}if(vy){const ny=S.y+vy*sp*dt;if(canFly(S.x,ny+vy*8))S.y=ny;}
 const moved=Math.hypot(S.x-ox,S.y-oy),np=nearPOI();
 if(vx||vy){if(skyTile(S.x+vx*14,S.y+vy*10)==='S'&&!S.parts.keel&&!S.flags.stormMsg){S.flags.stormMsg=1;toast('A raging storm wall blocks the way. A Stormkeel could cut through it.');return;}
  if(skyTile(S.x+vx*14,S.y+vy*10)==='V'&&!S.alt&&!S.flags.veilMsg){S.flags.veilMsg=1;toast('A thick white Veil. You\'d need to fly HIGH to cross it.');return;}}
 if(!S.alt&&moved>0&&!np&&!window.SKY_NOENC){S.enc-=moved;if(S.enc<0){S.enc=500+Math.random()*500*(S.crew.pip?1.6:1);return startSkyBattle(rollSkyEnemy());}}
 if(P.a&&np){if(S.alt){sfx('no');toast('Descend first (B) to land.');}else skyInteract(np);}}
function rollSkyEnemy(){const S=G.sky,w={gloomray:3,roc:S.flags.saffaQ&&!S.rocs?5:2,skiff:1.2};let r=Math.random()*Object.values(w).reduce((a,b)=>a+b,0);for(const k in w)if((r-=w[k])<0)return k;return 'gloomray';}
function skyInteract(p){const S=G.sky;sfx('ok');
 if(p.id==='gale')return transition(()=>{scene='map';enterMap('harbor',11,12,'up');});
 if(p.id==='thorn')return transition(()=>{scene='map';enterMap('world',4,6,'down');});
 if(p.id==='gull'){if(S.loot.gull)return toast('Only splinters and gulls remain.');S.loot.gull=1;S.key.spyglass=1;S.mat.iron+=2;G.gold+=200;
  return dialog(['The Cinderwing moors beside a broken skiff wedged in a floating rock.','Found a brass Spyglass! (Pip\'s uncle\'s?)','Found Cinder Iron x2 and 200 G.']);}
 if(p.id==='spire'){if(S.loot.spire)return toast('The ruins are silent now.');S.loot.spire=1;S.parts.core=1;S.mat.feather+=2;G.items.tonic=(G.items.tonic||0)+1;
  return dialog(['Ancient pillars float above the Veil, warm to the touch.','Found an Ember Core! The Emberlance now hits 50% harder.','Found Gale Feathers x2 and a Hearth Tonic.']);}
 if(p.id==='hide'){if(S.flags.corsair)return toast('The hideout is abandoned. Varra Kade has fled.');
  return dialog(['A black-sailed ship drops out of the storm!','Captain Varra Kade: Orrin\'s old tub, flying again? And with a Crown shard aboard...','Captain Varra Kade: Ashclaw Corsairs — broadside! Take that shard!'],()=>startSkyBattle('corsair'));}}
function skyCam(){const S=G.sky;return [Math.round(Math.max(0,Math.min(SKYW*16-W,S.x-W/2))),Math.round(Math.max(0,Math.min(SKYH*16-H,S.y-H/2)))];}
function hsh(x,y){return ((x*73856093)^(y*19349663))>>>0;}
function drawIsle(x,y,rx,ry,kind){X.fillStyle='#6a4a30';X.beginPath();X.moveTo(x-rx,y);X.lineTo(x-rx*0.4,y+ry*2.2);X.lineTo(x+rx*0.2,y+ry*2.8);X.lineTo(x+rx*0.6,y+ry*1.8);X.lineTo(x+rx,y);X.fill();
 X.fillStyle='#4a3020';X.fillRect(x-rx*0.2,y+ry*0.8,rx*0.3,ry*1.6);X.fillStyle='#5aa040';X.beginPath();X.ellipse(x,y,rx,ry,0,0,7);X.fill();X.fillStyle='#7ac058';X.beginPath();X.ellipse(x-rx*0.2,y-ry*0.25,rx*0.7,ry*0.55,0,0,7);X.fill();
 if(kind==='dock'){X.fillStyle='#e0d0b0';X.fillRect(x-8,y-12,12,9);X.fillStyle='#a83a2a';X.fillRect(x-10,y-15,16,4);X.fillStyle='#8a5a2a';X.fillRect(x+4,y-1,rx-2,3);}
 if(kind==='wreck'){X.fillStyle='#5a3418';X.save();X.translate(x,y-4);X.rotate(-0.4);X.fillRect(-12,-3,24,7);X.fillStyle='#3a2010';X.fillRect(-2,-16,2,14);X.fillStyle='#d8c8a8';X.fillRect(0,-15,8,7);X.restore();}
 if(kind==='ruin'){X.fillStyle='#e8e4d8';for(let i=0;i<4;i++)X.fillRect(x-14+i*8,y-14-(i%2)*5,4,14+(i%2)*5);X.fillStyle='#ffb040';blob(x,y-20,3+Math.sin(T*4),'#ffb040',0.8);}
 if(kind==='hide'){X.fillStyle='#2a2028';X.fillRect(x-10,y-14,18,12);X.fillStyle='#111';X.fillRect(x+6,y-26,2,16);X.fillStyle='#1a1018';X.fillRect(x+8,y-26,10,7);X.fillStyle='#e04040';X.fillRect(x+11,y-24,3,3);}}
function drawSkyMap(){const S=G.sky,a=S.altT,[cx,cy]=skyCam();
 const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,a>0.5?'#2856b0':'#4a88d8');g.addColorStop(1,a>0.5?'#90bcec':'#c4e0fa');X.fillStyle=g;X.fillRect(0,0,W,H);
 // drifting cloud sea far below (parallax)
 for(let i=0;i<26;i++){const wx=(i*131+T*6)%(SKYW*16),wy=(i*97)%(SKYH*16);const x=((wx-cx*0.6)%(W+80)+W+80)%(W+80)-40,y=((wy-cy*0.6)%(H+60)+H+60)%(H+60)-30;blob(x,y,10+i%4*4,'#ffffff',0.22);}
 const x0=Math.floor(cx/16),y0=Math.floor(cy/16);
 for(let y=y0-1;y<=y0+15;y++)for(let x=x0-1;x<=x0+17;x++){if(x<0||y<0||x>=SKYW||y>=SKYH)continue;const t=SKYT[y][x];if(t===' ')continue;const h=hsh(x,y),px_=x*16-cx+8+(h%7)-3,py_=y*16-cy+8+((h>>3)%7)-3;
  if(t==='S'||t==='E'){blob(px_,py_,13+(h%5),t==='E'?'#1c1a2e':'#3a2c50',0.95);blob(px_-4,py_-4,7,'#5a4a78',0.6);if(Math.sin(T*2.3+h)>0.985){X.strokeStyle='#fff6a0';X.lineWidth=1.2;X.beginPath();X.moveTo(px_,py_-10);X.lineTo(px_+4,py_);X.lineTo(px_-2,py_+3);X.lineTo(px_+3,py_+12);X.stroke();}}
  else if(t==='V'){blob(px_,py_,14+(h%4),'#f4f8ff',0.92);blob(px_+5,py_-5,8,'#ffffff',1);}}
 ISLES.forEach(([x,y,r])=>drawIsle(x*16-cx,y*16-cy,r,r*0.4));POI.forEach(p=>drawIsle(p.x*16+8-cx,p.y*16+8-cy,p.rx,p.ry,p.k));
 const np=nearPOI();if(np){const bx=np.x*16+8-cx,by=np.y*16-cy-26+Math.sin(T*5)*2;txt('▼',bx,by,'#ffe060',8,'center');}
 // ship + shadow
 const sx=S.x-cx,sy=S.y-cy+Math.sin(T*2)*1.5;X.globalAlpha=0.25;X.fillStyle='#102040';X.beginPath();X.ellipse(sx,sy+16+a*22,16-a*4,4,0,0,7);X.fill();X.globalAlpha=1;
 dImg(SKYART.cinderwing,sx,sy-a*10,0.42+a*0.1,{flip:S.face>0});
 if(a>0.5)for(let i=0;i<5;i++){const x=(i*71+T*30)%(W+60)-30;blob(x,(i*53)%H,12,'#ffffff',0.18);}
 // HUD
 win(4,4,124,30);txt(np?np.n:'Sea of Clouds',10,9,'#ffd860',7);const ss=shipStats();txt('HULL',10,20,'#9cf',6);bar(32,22,60,S.hull/ss.hull,'#30b050','#a0ff80');txt(`${S.hull}`,124,19,'#fff',6,'right');
 const mm=miniMap();win(W-56,4,52,40);X.drawImage(mm,W-54,6);if(Math.sin(T*8)>-0.3){X.fillStyle='#ff4020';X.fillRect(W-54+S.x/16-1,6+S.y/16-1,3,3);}
 const altTxt=S.alt?'ALT: HIGH':'ALT: LOW';win(4,H-22,W-8,18);
 const hint=np?(S.alt?'B: descend to land':'A: '+({dock:'Land at ',ash:'Land at ',wreck:'Explore ',ruin:'Explore ',hide:'Approach '}[np.k]||'')+np.n):(S.parts.sail?'B: change altitude':'Fly with the D-pad');
 txt(altTxt,10,H-17,S.alt?'#9cf':'#fff',7);txt(hint,W-10,H-17,'#ffd860',7,'right');
 if(isTouch&&!UI.length)txt('MENU: party',W-6,48,'#fff8',6,'right');}
XSCN.skymap={u:updSkyMap,d:drawSkyMap,mus:()=>'sky'};

// ---------- turn-based sky battles ----------
let SB=null;
const CMDN={cannon:'Cannon',skill:'Skill',item:'Item',guard:'Guard',charge:'Charge',hold:'Hold',front:'→Front',side:'→Side',back:'→Back',lance:'LANCE'};
const HSK=[{n:'Broadside',sp:3,d:'All mounted cannons fire (70% each)'},{n:'Flare Shot',sp:3,d:'Fire blast, x1.3 vs Hollow beasts'},{n:'Patch Hull',sp:2,d:'Repair 20% Hull and cure Rot'}];
const TELC={hit:'#4a5a80',red:'#c83030',purple:'#8a40c8',green:'#2aa050',unk:'#283050'};
function telName(t){return t==='unk'?'?':t==='hit'?'HIT':t==='red'?'HEAVY':t==='green'?'OPEN':SB.en.pirate?'BOARD':'ROT';}
function startSkyBattle(k,opt={}){const d=SKYEN[k],ss=shipStats(),hp=opt.tut?380:d.hull;
 SB={k,en:{...d,hp,mhp:hp,dx:0,flash:0},hull:Math.max(1,G.sky.hull),mhull:ss.hull,arm:ss.arm,spd:ss.spd,cannons:ss.cannons,lance:ss.lance,charge:0,spirit:4,pos:'side',rot:0,round:1,tut:!!opt.tut,
  plan:[0,1,2].map(()=>Array(4).fill('cannon')).concat([Array(4).fill('hold')]),cur:{r:4,c:0},pick:null,phase:'plan',intro:1,q:[],ev:null,evT:0,turn:-1,nums:[],fx:[],log:['Plan your round, then START.'],shake:0,shipFlash:0,shipDx:0,end:null,endT:0,lines:[],chill:0};
 SB.tele=rollTele();scene='skybattle';sfx('enc');}
function rollTele(){if(SB.tut&&SB.round===1)return ['hit','red','green','hit'];const w=SB.en.w,ks=Object.keys(w),tot=ks.reduce((s,k)=>s+w[k],0),out=[];
 for(let c=0;c<4;c++){let k;do{let r=Math.random()*tot;k=ks.find(x=>(r-=w[x])<0)||'hit';}while(c>0&&k==='red'&&out[c-1]==='red');out.push(k);}return out;}
function visTele(c){return (c<2||G.sky.crew.pip||SB.turn>=c||SB.tut)?SB.tele[c]:'unk';}
function optsFor(r){return r<3?['cannon','skill','item','guard','charge']:['hold','front','side','back','lance'];}
function cannonOf(r){const k=SB.cannons[r];return k?CANNON[k]:{n:'Swivel Gun',dmg:22};}
function cmdDesc(r,k){const S=G.sky;return {cannon:`Fire ${cannonOf(r).n} (${cannonOf(r).dmg})`,skill:r<3?`${HSK[r].n} (${HSK[r].sp} SP): ${HSK[r].d}`:'',item:`Repair Kit: +300 Hull (x${S.kits})`,guard:'Brace: -30% damage this turn',charge:'+1 Emberlance charge (max 3)',
 hold:'Keep position',front:'Front: Lance can fire; take +15% damage',side:'Side: cannons +25%',back:'Back: take -30% damage; cannons -30%',lance:'Fire the Emberlance (3 charges, from Front)'}[k];}
function autoPlan(){const E=SB.en;let ch=SB.charge,pos=SB.pos;for(let c=0;c<4;c++){const t=visTele(c);let a=t==='red'?['guard','guard','charge']:t==='green'?['cannon','cannon','cannon']:['cannon','charge','cannon'];
 if(SB.hull<SB.mhull*0.45&&t!=='green')a[2]='skill';let s='hold';if(c===0&&pos!==E.weak){s=E.weak;pos=E.weak;}
 a.forEach(x=>{if(x==='charge')ch=Math.min(3,ch+1);});if(ch>=3&&pos==='front'&&s==='hold'){s='lance';ch=0;}
 for(let r=0;r<3;r++)SB.plan[r][c]=a[r];SB.plan[3][c]=s;}}
function startExec(){SB.q=[];for(let c=0;c<4;c++){SB.q.push({k:'turn',c});const pl=[],sa=SB.plan[3][c];if(['front','side','back'].includes(sa))pl.push({k:'move',to:sa});
 for(let r=0;r<3;r++)pl.push({k:SB.plan[r][c],r});if(sa==='lance')pl.push({k:'lance'});const en={k:'enemy',c};
 if(SB.en.spd>SB.spd)SB.q.push(en,...pl);else SB.q.push(...pl,en);SB.q.push({k:'endturn',c});}
 SB.phase='exec';SB.turn=-1;SB.pick=null;sfx('ok');}
function say(s){SB.log.push(s);if(SB.log.length>3)SB.log.shift();}
function shipXY(){return [{front:84,side:66,back:46}[SB.pos]+SB.shipDx,70];}
function enXY(){return [190+SB.en.dx,60];}
function addN(x,y,v,c){SB.nums.push({x,y,v,c,t:0});}
function shot(kind){const[sx,sy]=shipXY(),[ex,ey]=enXY();SB.fx.push({k:kind,t:0,dur:kind==='beam'?0.9:0.4,x0:sx+28,y0:sy-2,x1:ex-10,y1:ey+4});}
function hitEnemy(base,kind,label){const E=SB.en,green=SB.tele[SB.turn]==='green';let m=(green?1.5:1)*(0.9+Math.random()*0.2);const weak=SB.pos===E.weak;if(weak)m*=1.5;
 const d=Math.max(1,Math.round(base*m));E.hp=Math.max(0,E.hp-d);E.flash=1;shot(kind);setTimeout(()=>{},0);
 addN(190,50,d,green||weak?'#ffe060':'#fff');if(weak&&!SB.weakShown){SB.weakShown=1;addN(190,38,'WEAK POINT!','#ffb040');}return d;}
function hurtShip(base,mult){const g=SB.plan.slice(0,3).filter(r=>r[SB.turn]==='guard').length;let m=mult*Math.max(0.25,1-0.3*g)*(SB.pos==='back'?0.7:SB.pos==='front'?1.15:1);
 const d=Math.max(4,Math.round(base*m*(0.9+Math.random()*0.2)-SB.arm));SB.hull=Math.max(0,SB.hull-d);SB.shipFlash=1;SB.shake=mult>1.5?0.5:0.25;addN(shipXY()[0],44,d,'#ff6060');return d;}
function evStart(e){const E=SB.en,S=G.sky,hero=r=>G.party[r].name;e.dur=0.55;
 switch(e.k){
 case 'turn':SB.turn=e.c;e.dur=0.35;say(`— Turn ${e.c+1}: ${E.n} ${({hit:'attacks',red:'winds up a HEAVY blow!',purple:E.pirate?'readies boarders!':'spews Hollow rot!',green:'is exposed!'})[SB.tele[e.c]]}`);break;
 case 'move':if(SB.pos!==e.to){SB.pos=e.to;say(`The Cinderwing swings to the ${e.to}.`);sfx('move');}else e.dur=0.05;break;
 case 'cannon':{if(G.party[e.r].hp<=0){e.dur=0.05;break;}const c=cannonOf(e.r);let b=c.dmg*({front:1,side:1.25,back:0.7}[SB.pos])*(S.crew.saffa?1.25:1)*(c.bane&&E.hollow?1.3:1);
  const d=hitEnemy(b,'ball');say(`${hero(e.r)} fires the ${c.n}! ${d} dmg`);sfx('hit');
  if(c.ice&&Math.random()<0.4){const i=SB.tele.findIndex((t,j)=>j>SB.turn&&t==='red');if(i>=0){SB.tele[i]='hit';say('The harpoon chills it — a HEAVY blow weakens!');}}break;}
 case 'skill':{const s=HSK[e.r];if(SB.spirit<s.sp){say(`${hero(e.r)}: not enough Spirit!`);sfx('no');break;}SB.spirit-=s.sp;e.dur=0.8;
  if(e.r===0){let tot=0;SB.cannons.forEach(k=>tot+=CANNON[k].dmg*0.7);const d=hitEnemy(Math.max(30,tot)*(S.crew.saffa?1.25:1),'ball');say(`Kael: Broadside! ${d} dmg`);sfx('hit');}
  else if(e.r===1){const m=st(G.party[1]).mag;const d=hitEnemy((110+m*5)*(E.hollow?1.3:1),'flare');say(`Lyra: Flare Shot! ${d} dmg`);sfx('fire');}
  else{const h=Math.round(SB.mhull*0.2);SB.hull=Math.min(SB.mhull,SB.hull+h);SB.rot=0;addN(shipXY()[0],44,'+'+h,'#80ff80');say(`Mira patches the hull. +${h}`);sfx('heal');}break;}
 case 'item':if(S.kits>0){S.kits--;SB.hull=Math.min(SB.mhull,SB.hull+300);addN(shipXY()[0],44,'+300','#80ff80');say(`${hero(e.r)} uses a Repair Kit. (${S.kits} left)`);sfx('heal');}else{say('No Repair Kits left!');sfx('no');}break;
 case 'guard':e.dur=0.3;say(`${hero(e.r)} braces for impact.`);sfx('move');break;
 case 'charge':SB.charge=Math.min(3,SB.charge+1);e.dur=0.4;say(`${hero(e.r)} stokes the Emberlance (${SB.charge}/3).`);sfx('ok');break;
 case 'lance':if(SB.charge<3){say('The Emberlance isn\'t charged!');sfx('no');break;}if(SB.pos!=='front'){say('The Emberlance only fires from the Front!');sfx('no');break;}
  {SB.charge=0;e.dur=1.3;const d=hitEnemy(480*SB.lance,'beam');SB.shake=0.6;say(`EMBERLANCE! ${d} dmg!`);sfx('fire');}break;
 case 'enemy':{const t=SB.tele[e.c];E.dx=-24;e.dur=0.7;
  if(t==='green'){E.dx=0;say(`${E.n} reels, wide open!`);e.dur=0.4;break;}
  SB.fx.push({k:'claw',t:0,dur:0.35,x0:enXY()[0]-30,y0:60,x1:shipXY()[0]+20,y1:70});
  if(t==='hit'){const d=hurtShip(E.atk,1);say(`${E.n} strikes the hull! ${d} dmg`);sfx('hit');}
  else if(t==='red'){const d=hurtShip(E.atk,2.4);say(`${E.n} unleashes a HEAVY blow! ${d} dmg`);sfx('crit');}
  else if(E.pirate){const d=hurtShip(E.atk,0.6);SB.spirit=Math.max(0,SB.spirit-3);SB.charge=Math.max(0,SB.charge-1);say(`Boarders! ${d} dmg, -3 SP, -1 charge`);sfx('hit');}
  else{SB.rot=3;SB.spirit=Math.max(0,SB.spirit-2);say('Hollow rot eats at the hull! (-2 SP)');sfx('bolt');}break;}
 case 'endturn':e.dur=0.2;if(SB.rot>0){const d=Math.round(SB.mhull*0.03);SB.hull=Math.max(0,SB.hull-d);SB.rot--;addN(shipXY()[0],50,d,'#c080ff');}SB.spirit=Math.min(12,SB.spirit+1);break;}}
function skyCheckEnd(){if(SB.end)return;
 if(SB.en.hp<=0){SB.end='win';SB.phase='end';SB.endT=0;sfx('win');const E=SB.en,S=G.sky;G.gold+=E.g;const xp=SB.tut?40:(E.xp||0);SB.lines=[`Victory!  +${xp} EXP   +${E.g} G`,...gainXP(xp,true)];
  for(const m in E.drop){S.mat[m]+=E.drop[m];SB.lines.push(`Got ${MATN[m]} x${E.drop[m]}!`);}if(SB.k==='roc'){S.rocs++;if(S.flags.saffaQ&&!S.crew.saffa)SB.lines.push('Saffa will want to hear about this...');}}
 else if(SB.hull<=0){if(SB.tut){SB.hull=1;say('Orrin: She holds! Keep firing!');}else{SB.end='lose';SB.phase='end';SB.endT=0;sfx('no');SB.lines=['The Cinderwing is crippled...','Orrin limps her back to Galewright Point.'];}}}
function finishSky(){const win_=SB.end==='win',k=SB.k,tut=SB.tut,S=G.sky;S.hull=win_?SB.hull:Math.round(SB.mhull*0.5);
 transition(()=>{SB=null;if(!win_){scene='map';enterMap('harbor',11,12,'up');return;}scene='skymap';
  if(tut){S.tut=1;save();dialog(['Orrin Vey: Ha! The Cinderwing bites back!','Orrin Vey: Fly with the D-pad. Land at islands with A. MENU checks the ship.','Orrin Vey: Galewright Point is right below us — the shipyard sells parts and crafts from beast drops.','Orrin Vey: Somewhere out there, the shard\'s pull continues...']);}
  if(k==='corsair'){S.flags.corsair=1;G.flags.corsair=1;G.gold+=600;S.mat.iron+=3;save();
   dialog(['Captain Varra Kade: This isn\'t over, Cinderwing! The Ashclaw never forget!','(The corsair limps into the storm. Her hideout holds 600 G and Cinder Iron x3.)','Lyra: The shard is pulling further... beyond the clouds.','Lyra: No — two pulls now. One burns to the south-east. Ashmarch, the volcano isles.','Orrin Vey: Cinderholt\'s the only town out there. Land on the smoking isle when you\'re ready.'],()=>choice('The skies are open. View the ending?',['Ending','Keep flying'],i=>{if(i===0)transition(()=>{scene='ending';});}));}});}
function updSkyBattle(dt){const E=SB.en;SB.intro=Math.max(0,SB.intro-dt*1.5);E.flash=Math.max(0,E.flash-dt*3);SB.shipFlash=Math.max(0,SB.shipFlash-dt*3);SB.shake=Math.max(0,SB.shake-dt);
 E.dx*=Math.pow(0.02,dt);SB.nums.forEach(n=>n.t+=dt);SB.nums=SB.nums.filter(n=>n.t<1.1);SB.fx.forEach(f=>f.t+=dt);SB.fx=SB.fx.filter(f=>f.t<f.dur);if(SB.intro>0.3)return;
 if(SB.phase==='plan')return updPlan(dt);
 if(SB.phase==='exec'){if(!SB.ev){if(!SB.q.length){SB.round++;SB.tele=rollTele();SB.turn=-1;SB.spirit=Math.min(12,SB.spirit+1);SB.phase='plan';SB.cur={r:4,c:0};say(`Round ${SB.round}: plan your moves.`);return;}
  SB.ev=SB.q.shift();SB.evT=0;evStart(SB.ev);skyCheckEnd();if(SB.end)return;}SB.evT+=dt*(K.a?2.2:1);if(SB.evT>=SB.ev.dur)SB.ev=null;return;}
 if(SB.phase==='end'){SB.endT+=dt;if(SB.endT>0.7&&(P.a||P.b)){if(SB.lines.length>1){SB.lines.shift();sfx('move');}else finishSky();}}}
function updPlan(dt){const c=SB.cur;
 if(SB.pick){const pk=SB.pick,L=optsFor(c.r);if(held('up',dt)){pk.i=(pk.i+L.length-1)%L.length;sfx('move');}if(held('down',dt)){pk.i=(pk.i+1)%L.length;sfx('move');}
  if(P.a){SB.plan[c.r][c.c]=L[pk.i];SB.pick=null;sfx('ok');if(c.c<3)c.c++;}else if(P.b){SB.pick=null;sfx('no');}return;}
 if(held('up',dt)){c.r=(c.r+4)%5;sfx('move');}if(held('down',dt)){c.r=(c.r+1)%5;sfx('move');}
 if(c.r<4){if(held('left',dt)){c.c=(c.c+3)%4;sfx('move');}if(held('right',dt)){c.c=(c.c+1)%4;sfx('move');}}
 if(P.menu){autoPlan();sfx('ok');say('Auto-plan set. Adjust or START.');}
 if(P.a){if(c.r===4)startExec();else{SB.pick={i:Math.max(0,optsFor(c.r).indexOf(SB.plan[c.r][c.c]))};sfx('ok');}}}
function drawSkyBattle(){const E=SB.en;
 const g=X.createLinearGradient(0,0,0,118);g.addColorStop(0,E.boss?'#2a1838':'#3462c8');g.addColorStop(0.65,E.boss?'#b05050':'#9cc8f0');g.addColorStop(1,E.boss?'#f0a070':'#f4e6cc');X.fillStyle=g;X.fillRect(0,0,W,118);
 for(let i=0;i<9;i++){const x=((i*71+T*14*(1+i%3))%(W+90))-45,y=18+(i*29)%90;blob(x,y,12+i%3*6,'#ffffff',0.35);blob(x+12,y+3,9,'#ffffff',0.3);}
 X.save();if(SB.shake>0)X.translate((Math.random()-0.5)*SB.shake*8,(Math.random()-0.5)*SB.shake*6);
 const[sx,sy]=shipXY(),[ex,ey]=enXY();dImg(SKYART.cinderwing,sx,sy+Math.sin(T*2)*2,1,{flip:true,flash:SB.shipFlash});
 if(SB.rot>0)for(let i=0;i<4;i++)blob(sx-20+i*12,sy+12+Math.sin(T*3+i)*3,3,'#9040d0',0.5);
 dImg(SKYART[E.art],ex,ey+Math.sin(T*1.6)*3,E.sc,{flash:E.flash});
 SB.fx.forEach(f=>{const p=f.t/f.dur;if(f.k==='ball'||f.k==='flare'){const x=f.x0+(f.x1-f.x0)*p,y=f.y0+(f.y1-f.y0)*p-Math.sin(p*Math.PI)*14;blob(x,y,f.k==='flare'?5:3,f.k==='flare'?'#ff8030':'#222',1);blob(x,y,f.k==='flare'?8:5,'#ffb040',0.4);}
  else if(f.k==='beam'){X.globalAlpha=1-p*0.6;const gg=X.createLinearGradient(0,f.y0-6,0,f.y0+6);gg.addColorStop(0,'#ff6020');gg.addColorStop(0.5,'#fff8c0');gg.addColorStop(1,'#ff6020');X.fillStyle=gg;X.fillRect(f.x0,f.y0-5+p*2,f.x1-f.x0+30,10-p*4);X.globalAlpha=1;blob(f.x1,f.y1,14*(1-p)+4,'#ffe080',0.7);}
  else if(f.k==='claw'){const x=f.x0+(f.x1-f.x0)*p;X.strokeStyle='#c060ff';X.lineWidth=2;X.globalAlpha=1-p;X.beginPath();X.arc(x,f.y0+(f.y1-f.y0)*p,10,-1,1);X.stroke();X.globalAlpha=1;}});
 SB.nums.forEach(n=>{X.globalAlpha=n.t>0.8?(1.1-n.t)/0.3:1;txt(String(n.v),n.x,n.y-n.t*10,n.c,typeof n.v==='number'?10:7,'center');X.globalAlpha=1;});
 X.restore();
 // top HUD
 win(2,2,122,24);txt('HULL',7,6,'#9cf',6);txt(`${SB.hull}/${SB.mhull}`,119,6,'#fff',6,'right');bar(7,17,112,SB.hull/SB.mhull,'#30b050','#a0ff80');
 win(132,2,122,24);txt('LANCE',137,6,'#ffb070',6);for(let i=0;i<3;i++){const on=i<SB.charge;X.fillStyle=on?'#ffb030':'#30304a';X.beginPath();X.arc(170+i*9,9,3,0,7);X.fill();if(on&&SB.charge>=3)blob(170+i*9,9,5,'#ffe080',0.3+0.2*Math.sin(T*8));}
 txt(`SP ${SB.spirit}`,249,6,'#9cf',6,'right');txt(E.n,137,14,'#fff',6);bar(137,23,112,E.hp/E.mhp,'#a02040','#ff6080');
 txt(`POS: ${SB.pos.toUpperCase()}`,6,106,'#fff',6);if(SB.tut&&SB.round===1&&SB.phase==='plan')txt('Tip: Guard on red turns, attack on green!',W/2,96,'#ffe060',7,'center');txt(`Weak: ${E.weak.toUpperCase()}`,250,106,'#ffd860',6,'right');
 // bottom panel
 win(0,116,W,108);
 for(let c=0;c<4;c++){const t=visTele(c),x=48+c*51,cur=SB.phase==='exec'&&SB.turn===c;X.fillStyle=TELC[t];X.fillRect(x,121,49,11);if(cur){X.strokeStyle='#ffe060';X.lineWidth=1;X.strokeRect(x-0.5,120.5,50,12);}
  txt(`T${c+1} ${telName(t)}`,x+24.5,123,'#fff',6,'center');}
 txt(`Rnd ${SB.round}`,6,123,'#ffd860',6);
 if(SB.phase==='plan'||SB.phase==='end'&&!SB.log.length){
  ['Kael','Lyra','Mira','Ship'].forEach((n,r)=>{const y=136+r*14;txt(r<3?G.party[r].name:'Ship',6,y+2,r<3&&G.party[r].hp<=0?'#f66':r===3?'#ffb070':'#fff',7);
   for(let c=0;c<4;c++){const x=48+c*51,sel=SB.cur.r===r&&SB.cur.c===c,k=SB.plan[r][c];X.fillStyle=k==='guard'?'#24508a':k==='charge'||k==='lance'?'#7a4a18':k==='skill'?'#4a2a7a':k==='item'?'#2a6a4a':'#1a2a6a';X.fillRect(x,y,49,12);
    X.strokeStyle=sel?'#ffe060':'#8890c0';X.lineWidth=sel?1.5:0.5;X.strokeRect(x+0.5,y+0.5,48,11);txt(CMDN[k],x+24.5,y+2.5,k==='lance'?'#ffe080':'#fff',7,'center');}});
  const gs=SB.cur.r===4;X.fillStyle=gs?'#d0602a':'#7a3a1a';X.fillRect(48,194,202,12);X.strokeStyle=gs?'#ffe060':'#c08060';X.lineWidth=gs?1.5:0.5;X.strokeRect(48.5,194.5,201,11);txt('▶ START ROUND',149,196.5,'#fff',7,'center');
  const dsc=SB.cur.r<4?cmdDesc(SB.cur.r,SB.pick?optsFor(SB.cur.r)[SB.pick.i]:SB.plan[SB.cur.r][SB.cur.c]):'Execute all 4 turns. MENU: auto-plan';txt(dsc,6,211,'#cde',6);
  
  if(SB.pick){const L=optsFor(SB.cur.r),px_=Math.min(W-78,48+SB.cur.c*51),py_=Math.max(4,136+SB.cur.r*14-L.length*11-6);win(px_,py_,74,L.length*11+8);
   L.forEach((k,i)=>{const dis=(k==='skill'&&SB.spirit<HSK[SB.cur.r].sp)||(k==='item'&&!G.sky.kits)||(k==='lance'&&SB.charge<1&&false);txt(k==='skill'?HSK[SB.cur.r].n:CMDN[k],px_+14,py_+5+i*11,dis?'#889':'#fff',7);if(i===SB.pick.i)cursor(px_+4,py_+5+i*11);});}}
 else{SB.log.forEach((l,i)=>wrap(l,48).slice(0,1).forEach(s=>txt(s,8,140+i*14,i===SB.log.length-1?'#fff':'#99a',7)));txt('Hold A to speed up',W-8,211,'#778',6,'right');}
 if(SB.phase==='end'){win(30,46,W-60,36);txt(SB.lines[0]||'',W/2,58,SB.end==='win'?'#ffd860':'#f88',8,'center');txt('▶ A',W-38,72,'#fff',6,'right');}
 if(SB.intro>0){const s=SB.intro;X.fillStyle=`rgba(255,255,255,${s})`;X.fillRect(0,0,W,H);}}
XSCN.skybattle={u:updSkyBattle,d:drawSkyBattle,mus:()=>SB&&SB.en.boss?'boss':'battle'};

window.SKY={startSkyBattle,startSkyMap,afterGravemaw,orrinAct,pipAct,saffaAct,openYard,yardBuy,autoPlan,startExec,shipStats,canFly,nearPOI,skyInteract,POI,get SB(){return SB},get S(){return G.sky}};
