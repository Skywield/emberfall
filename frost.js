'use strict';
// Emberfall — Chapter 4: Frost and Thunder. The Rimespire isles: Hollowfrost town, the Galeshear Tundra, the Stormglass Spire and the Rime Wyrm.
// ---------- tiles ----------
function snowG(g){px(g,'#e4ecf6',0,0,16,16);for(let i=0;i<10;i++)px(g,rnd()<.5?'#ffffff':'#c8d4e8',rnd()*16|0,rnd()*16|0,2,1);}
function iceF(g){px(g,'#7ab0d0',0,0,16,16);for(let i=0;i<6;i++)px(g,rnd()<.5?'#a8d8f0':'#5a90b8',rnd()*16|0,rnd()*16|0,3,1);px(g,'#e8f8ff',rnd()*12|0,rnd()*12|0,2,1);}
TILES.s=[tileCanvas(snowG)];
TILES.j=[tileCanvas(g=>{px(g,'#b8c4d4',0,0,16,16);for(let i=0;i<10;i++)px(g,rnd()<.5?'#a8b4c8':'#ccd6e4',rnd()*16|0,rnd()*16|0,2,1);})];
TILES.P=[tileCanvas(g=>{snowG(g);px(g,'#4a3020',7,12,2,4);px(g,'#1a4a3a',3,7,10,5);px(g,'#1e5a44',4,3,8,5);px(g,'#2a6a50',6,0,4,4);px(g,'#ffffff',4,7,3,1);px(g,'#ffffff',9,3,2,1);px(g,'#ffffff',6,0,3,1);})];
TILES.I=[tileCanvas(g=>{snowG(g);px(g,'#4a6a8a',1,4,14,12);px(g,'#6a8aaa',3,2,10,10);px(g,'#a8c8e8',5,1,5,4);px(g,'#ffffff',4,1,6,2);px(g,'#2a4a6a',1,14,14,2);})];
TILES.K=[0,1].map(f=>tileCanvas(g=>{px(g,'#0e2238',0,0,16,16);for(let i=0;i<5;i++)px(g,'#2a5a80',(i*5+f*3)%14,(i*3+f*4)%15,3,1);px(g,'#9fd8ff',0,0,16,1);}));
TILES.n=[tileCanvas(g=>{px(g,'#0e2238',0,0,16,16);px(g,'#a8d8f0',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#7ab0d0',x,2,1,12);px(g,'#ffffff',0,2,16,1);px(g,'#5a90b8',0,13,16,1);})];
TILES.U=[tileCanvas(g=>{px(g,'#3a5a8a',0,0,16,16);for(let y=0;y<16;y+=4){px(g,'#2a4068',0,y+3,16,1);for(let x=(y%8?2:0);x<16;x+=4)px(g,'#5a7aaa',x,y,2,1);}px(g,'#ffffff',0,0,16,2);})];
TILES.Y=[tileCanvas(g=>{px(g,'#0c1a2c',0,0,16,16);px(g,'#1e3a58',1,1,6,5);px(g,'#1e3a58',9,3,6,5);px(g,'#1e3a58',3,9,7,5);px(g,'#6ab0e0',1,1,6,1);px(g,'#6ab0e0',9,3,6,1);px(g,'#6ab0e0',3,9,7,1);px(g,'#c8f0ff',12,12,1,2);})];
TILES.e=[tileCanvas(iceF)];
['P','I','K','U','Y'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('wyrm','rime_wyrm');
{const im=new Image();im.onload=()=>{SKYART.wyvern=im;};im.src='art/game/storm_wyvern.png';}
EN_ART.fwisp={rows:EN_ART.wisp.rows,pal:{k:'#0a2a4a',Y:'#7ad0ff',W:'#e8fbff',b:'#0a2a4a'}};
EN_ART.rslime={rows:EN_ART.slime.rows,pal:{k:'#0e2030',G:'#a8d8f0',g:'#6aa0c8',W:'#ffffff'}};
EN_ART.sbat={rows:EN_ART.bat.rows,pal:{k:'#10101a',W:'#5a6a8a',P:'#3a4a6a',r:'#fff060'}};
EN_ART.yeti={rows:EN_ART.goblin.rows,pal:{k:'#1a2030',G:'#e8eef8',r:'#30a0ff',W:'#203050',B:'#8a9ab8'}};
EN_ART.gsentry={rows:EN_ART.skeleton.rows,pal:{k:'#0a1a2a',W:'#9fd8ff'}};
['fwisp','rslime','sbat','yeti','gsentry'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
EN_ART.wyrm=EN_ART.boss;
SPR.isolde=charSet({H:'#e8e8f0',h:'#ffffff',s:'#f0d0b8',O:'#3a5a8a',A:'#9fd8ff',L:'#2a3a5a',b:'#1a2030'});
SPR.torvald=charSet({H:'#c86020',h:'#e8a040',s:'#e0b090',O:'#5a4a3a',A:'#a0a8b8',L:'#3a2a20',b:'#1a1010'});
SPR.yrsa=charSet({H:'#f0d060',h:'#fff0a0',s:'#f4d0b0',O:'#6a3a6a',A:'#ffffff',L:'#3a2a3a',b:'#2a1a2a'});
SPR.nils=charSet({H:'#4a3a2a',h:'#6a5a4a',s:'#e0b890',O:'#2a6a5a',A:'#e0e0e0',L:'#2a3a3a',b:'#1a1a1a'});

// ---------- data ----------
Object.assign(ITEMS,{xpotion:{n:'X-Potion',p:160,heal:450,tgt:'P',d:'Restore 450 HP'},firesalt:{n:'Firesalt',p:140,heal:120,mpr:30,tgt:'P',d:'Warm up: 120 HP, 30 MP'}});
Object.assign(EQ,{sunbrand:{n:'Sunforge Blade',slot:'w',who:'kael',atk:34,p:1100},stormrod:{n:'Stormcaller Rod',slot:'w',who:'lyra',atk:4,mag:27,p:980},
 auroramace:{n:'Aurora Mace',slot:'w',who:'mira',atk:20,mag:20,p:980},rimemail:{n:'Rimeguard Mail',slot:'a',def:19,mdef:6,p:760},
 frostfur:{n:'Frostfur Cloak',slot:'a',def:13,mdef:20,p:0},wyrmscale:{n:'Wyrmscale Mail',slot:'a',def:26,mdef:18,p:0}});
const FSHOP=['potion','hipotion','xpotion','ether','hiether','firesalt','bloom','tonic'];
const FSMITH=['sunbrand','stormrod','auroramace','rimemail','emberbrand','magmarod','ashmace','cindermail'];
function wyrmAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.howl){u.howl=1;return {u,kind:'buff',name:'Glacial Heart',tg:[u]};}const r=Math.random();
 if(ph&&r<0.3)return {u,kind:'mag',name:'Thunderhead',pow:1.15,el:'bolt',tg:P,fx:'bolt'};
 if(r<0.5)return {u,kind:'mag',name:'Blizzard Breath',pow:0.85,el:'ice',tg:P,fx:'ice'};
 if(r<0.75)return {u,kind:'phys',name:'Rime Claw',pow:1.55,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
Object.assign(EN,{
 sbat:{n:'Storm Bat',hp:170,atk:36,def:12,mag:10,spd:18,xp:58,g:34,weak:'fire',res:'bolt'},
 rslime:{n:'Rime Slime',hp:290,atk:35,def:28,mag:12,spd:6,xp:66,g:44,weak:'fire',res:'ice'},
 fwisp:{n:'Frost Wisp',hp:200,atk:16,def:12,mag:40,spd:14,xp:72,g:40,weak:'fire',res:'ice',caster:1},
 yeti:{n:'Tundra Yeti',hp:380,atk:44,def:20,mag:8,spd:10,xp:96,g:62,weak:'fire',res:'ice'},
 gsentry:{n:'Glacier Sentry',hp:330,atk:43,def:26,mag:8,spd:9,xp:90,g:58,weak:'fire',res:'ice'},
 wyrm:{n:'Rime Wyrm',hp:4200,atk:54,def:24,mag:42,spd:12,xp:2600,g:2000,weak:'fire',res:'ice',boss:1,ai:wyrmAI}});

// ---------- maps ----------
const fmap=(rows,tr)=>rows.map(r=>r.replace(/./g,c=>tr[c]??c));
addMap('tundra',{name:'Galeshear Tundra',mus:'world',bbg:'snow',rows:fmap(MAPS.ashmarch.rows,{r:'I',a:'s',g:'P',L:'K',b:'n',',':'j'}),
 enc:22,pool:[['sbat','sbat'],['rslime'],['fwisp','sbat'],['yeti'],['rslime','fwisp']],
 warps:[{x:2,y:3,to:'hollowfrost',tx:11,ty:10,d:'up'},{x:21,y:1,to:'spire',tx:11,ty:13,d:'up'},{x:7,y:9,to:'__ship'}]});
addMap('hollowfrost',{name:'Hollowfrost',mus:'town',rows:[
"PPPPPPPPPPPPPPPPPPPP",
"PsUUUUsssssjsssUUUUP",
"PsUUUUsssssjsssUUUUP",
"PsWDWWsssssjsssWWDWP",
"Psjjjjjjjjjjjjjjjjs P".replace(' ',''),
"PssjssUUUUUssssjsssP",
"PssjssUUUUUssssjsssP",
"PssjssWWDWWssssjsssP",
"Pssjjjjjjjjjjjjjj ssP".replace(' ',''),
"PssPsssssssjssssPssP",
"PssssssssssjsssssssP",
"PPPPPPPPPPPjPPPPPPPP"],
 enc:0,warps:[{x:11,y:11,to:'tundra',tx:3,ty:3,d:'right'}],doors:{'3,3':'finn','17,3':'fsmith','8,7':'fshop'}});
addMap('spire',{name:'Stormglass Spire',mus:'cave',bbg:'glacier',rows:fmap(MAPS.forge.rows,{Z:'Y',';':'e',L:'K',b:'n'}),
 enc:13,pool:[['gsentry'],['yeti'],['fwisp','fwisp'],['gsentry','fwisp'],['rslime','sbat'],['yeti','sbat'],['gsentry','gsentry']],
 warps:[{x:11,y:14,to:'tundra',tx:21,ty:2,d:'down'},{x:12,y:14,to:'tundra',tx:21,ty:2,d:'down'}],
 chests:{'1,5':'frostfur','22,5':'xpotion','11,11':'hiether'}});

// NPCs stand clear of every door and the tile in front of it (see doorSafe test).
NPCS.hollowfrost=[
 {x:10,y:9,s:'isolde',d:'right',act:()=>isoldeAct()},
 {x:15,y:4,s:'torvald',d:'down',lines:()=>['Torvald: Smithy\'s the blue door behind me. Fire-steel sells well up here, funny enough.']},
 {x:5,y:4,s:'yrsa',d:'down',lines:()=>['Yrsa: The Hearthfrost Inn — the door to my left. 40G for a warm bed.']},
 {x:6,y:8,s:'nils',d:'down',lines:()=>['Nils: Trading post\'s right here. Potions, ethers, Firesalt to keep your fingers working.']},
 {x:14,y:10,s:'kid',d:'left',wander:1,lines:()=>G.flags.wyrm?['Ebba: The thunder stopped! Mama says we can go sledding again.']:['Ebba: The Spire hums every night now. Grandma Isolde says a dragon lives inside.','Ebba: Dragons made of ice must hate fire, right?']},
 {x:4,y:9,s:'rook',d:'right',lines:()=>G.flags.wyrm?['Rook: Three shards. Kade will stop sending skiffs and start sending fleets.']:['Rook: Followed you north. Kade\'s storm-ship was here before you — she lost it to the Wyrm.','Rook: Whatever\'s in that Spire, it doesn\'t take kindly to visitors.']},
 {x:13,y:2,s:'guard',d:'down',lines:()=>['Watchman: The tundra\'s east of town. A crevasse splits it — the ice bridge holds.','Watchman: The Stormglass Spire is the glowing tower to the north-east.']}];

// ---------- story ----------
function isoldeAct(){if(G.flags.wyrm){if(!G.flags.isoldegift){G.flags.isoldegift=1;G.gold+=800;G.items.tonic=(G.items.tonic||0)+2;G.eq.wyrmscale=(G.eq.wyrmscale||0)+1;sfx('coin');
  return dialog(['Warden Isolde: The sky is quiet for the first time in a month. Hollowfrost owes you its spring.','Warden Isolde: Torvald pounded the Wyrm\'s shed scales into mail. Wear it well.','Got 800 G, Hearth Tonic x2 and Wyrmscale Mail!']);}
  return dialog(['Warden Isolde: Three shards of seven. The Crown is waking — I can feel it in my old bones.']);}
 if(G.flags.isolde)return dialog(['Warden Isolde: The Spire is north-east, past the crevasse. Show the sigil at the gate.']);
 G.flags.isolde=1;dialog(['Warden Isolde: Fire-bearers, in Hollowfrost? You carry two Crown shards. They warm the whole square.','Warden Isolde: The third fell into the Stormglass Spire a month ago. Since then, the storm has never stopped.','Warden Isolde: The old Rime Wyrm that slept in the ice drank the shard\'s light. Now it breathes blizzards.','Lyra: Then it\'s weak to the same thing that beat the Tyrant... the opposite.','Mira: Fire. Good thing Kael never shuts up about his.','Warden Isolde: Take the Warden\'s Sigil. The Spire gate answers to it.','Got the Warden\'s Sigil!']);}
function wyrmEvent(){dialog(['The air cracks with frost. Lightning crawls inside the ice.','Rime Wyrm: LITTLE EMBERS. YOU CARRY TWO. I HAVE ONE. I WILL HAVE THREE.','Kael: You\'ve had it long enough.','Lyra: Kael, Mira — fire and steel. I\'ll keep the thunder off us!'],()=>startBattle(['wyrm'],'glacier',true));}
XWIN.wyrm=()=>{G.flags.wyrm=1;save();dialog(['The Rime Wyrm shatters into a thousand singing shards of ice.','Lyra: The third shard! It\'s cold... no, it\'s warming in my hands.','Mira: Three of seven. The storm over Hollowfrost is breaking.','Kael: Warden Isolde will want to know.','— Chapter 4 complete: Frost and Thunder —'],
 ()=>choice('Chapter 4 complete. View the ending?',['Ending','Keep playing'],i=>{if(i===0)transition(()=>{scene='ending';});}));};
XSTEP.push(()=>{
 if(G.map==='tundra'&&G.x===21&&G.y===1&&!G.flags.isolde){G.y=2;G.d='down';dialog(['A gate of blue ice, carved with a warden\'s mark. It won\'t budge. Someone in Hollowfrost must hold the sigil.']);return true;}
 if(G.map==='spire'&&!G.flags.wyrm&&G.y===3){wyrmEvent();return true;}return false;});
const _blk4=blocked;blocked=function(x,y){if(G.map==='spire'&&!G.flags.wyrm&&y===2&&x>=9&&x<=14)return true;return _blk4(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='spire'&&!G.flags.wyrm){const bob=Math.sin(T*1.4)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('wyrm',12*16-cx,3*16-cy+4+bob,{sc:0.5,alpha:0.95})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<4;i++){const p=(T*0.6+i/4)%1;X.globalAlpha=0.7*(1-p);X.fillStyle=i%2?'#ffffff':'#9fe8ff';X.fillRect(12*16-cx-10+i*7,0*16-cy+p*30,2,2);}X.globalAlpha=1;}});}});
XDOOR.finn=()=>choice('Yrsa: A fur-lined bed and hot cider for 40G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<40)return toast('Not enough gold.');G.gold-=40;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});
XDOOR.fshop=()=>openShop({stock:FSHOP,n:'Hollowfrost Trading Post',who:'Nils'});
XDOOR.fsmith=()=>openShop({stock:FSMITH,n:'Torvald\'s Smithy',who:'Torvald'});

// ---------- airship: Rimespire isles, storm wyverns, Varra Kade's Stormbreaker ----------
Object.assign(SKYEN,{
 wyvern:{n:'Storm Wyvern',hull:1100,atk:66,spd:14,weak:'back',art:'wyvern',hollow:1,w:{hit:3,red:2,purple:1,green:1.2},g:260,xp:160,drop:{feather:2,ichor:1},sc:0.95},
 stormbreaker:{n:'Ashclaw Stormbreaker',hull:2600,atk:82,spd:12,weak:'side',art:'corsair',pirate:1,boss:1,w:{hit:3,red:2.2,purple:1.5,green:1},g:1400,xp:900,drop:{iron:4,feather:2},sc:1.1}});
POI.push({id:'rime',k:'frost',n:'Hollowfrost (Rimespire)',x:21,y:5,rx:24,ry:9});
const _roll4=rollSkyEnemy;rollSkyEnemy=function(){const S=G.sky;if(G.flags.tyrant&&S.y<14*16&&Math.random()<0.6)return 'wyvern';return _roll4();};
const _enter4=enterMap;enterMap=function(name,x,y,d){if(name==='__ship'&&G.map==='tundra'){if(!G.sky)return toast('No ship.');return startSkyMap(POI.find(p=>p.id==='rime'));}return _enter4(name,x,y,d);};
function landRime(){const first=!G.flags.rime;G.flags.rime=1;transition(()=>{scene='map';enterMap('tundra',7,8,'up');
 if(first)dialog(['— Chapter 4: Frost and Thunder —','Orrin Vey: The Rimespire isles. Snow on the ground, thunder in the clouds. My kind of weather, said nobody.','Orrin Vey: Hollowfrost is west of the landing. I\'ll keep the boilers lit.','Lyra: The third shard... it\'s cold. Colder than anything should be.']);});}
const _skyInt4=skyInteract;skyInteract=function(p){if(p.id!=='rime')return _skyInt4(p);const S=G.sky;
 if(!G.flags.tyrant){sfx('no');return toast('A wall of thunderheads circles the frozen isles. The Cinderwing would be torn apart.');}sfx('ok');
 if(!S.flags.kade2)return dialog(['Lightning splits the clouds — a huge black-sailed ship bars the way!','Captain Varra Kade: Two shards, Cinderwing? I lost a ship to the Tyrant and another to that ice-worm.','Captain Varra Kade: Meet the Stormbreaker. Hand over the shards, or ride the lightning down!','Orrin Vey: All hands! She\'s got twice our guns — watch her telegraphs!'],()=>startSkyBattle('stormbreaker'));
 landRime();};
const _finish4=finishSky;finishSky=function(){if(!(SB.k==='stormbreaker'&&SB.end==='win'))return _finish4();const S=G.sky;S.hull=SB.hull;
 transition(()=>{SB=null;scene='skymap';S.flags.kade2=1;G.flags.kade2=1;S.mat.iron+=4;S.mat.feather+=2;save();
  dialog(['Captain Varra Kade: Lightning-cursed... Fine! Fly into the storm, then. The Wyrm will finish you for me.','(The Stormbreaker limps away, its masts smoking.)','Orrin Vey: The way to Hollowfrost is clear. Press A over the frozen isle to land.']);});};
const _isle4=drawIsle;drawIsle=function(x,y,rx,ry,k){_isle4(x,y,rx,ry,k==='frost'?'dock':k);if(k==='frost'){X.fillStyle='#e8f0ff';X.beginPath();X.moveTo(x-16,y-4);X.lineTo(x-4,y-26);X.lineTo(x+2,y-18);X.lineTo(x+8,y-30);X.lineTo(x+18,y-4);X.fill();
 X.fillStyle='#9fd8ff';X.fillRect(x+6,y-30,4,10);X.globalAlpha=0.5+0.5*Math.sin(T*5);X.fillStyle='#fff8a0';X.fillRect(x+7+Math.sin(T*9)*3,y-40,1,8);X.globalAlpha=1;
 for(let i=0;i<4;i++){const p=(T*0.4+i/4)%1;X.fillStyle='#fff';X.globalAlpha=0.8*(1-p);X.fillRect(x-20+i*12+p*6,y-36+p*30,1,1);}X.globalAlpha=1;}};
window.FROST={isoldeAct,wyrmEvent,landRime,FSHOP,FSMITH};
