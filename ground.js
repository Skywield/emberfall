'use strict';
// Emberfall — the Emberlands ground world (classic FF-style continent under the sky).
// Loaded after expansion.js. Adds MAPS.ground, story barriers, Ashen Vale exits onto the continent,
// ground doors into existing towns, midpoint sky unlock, airship landing on Verdance, and save migration.
(function(){
const GW=96,GH=80;
const GROW=[
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~.~.~~.~~~~~.~~...~.~.~~~~.~..~.~~~.~~..~..~....~.~~.~.~..mm~........~....~~.~.~~~.~~~~~~~",
"~~~~~~.~~....~~~..~~~~IsssPs~~ssssssIssPsssIssssssIsPssssIsssss.m~~~~.~~..~.~....~~~...~~..~~~~~",
"~~~~~.................ssssPs~~sssssIsssPssIssssssIssPsssIssssss.mm.........................~~~~~",
"~~~~~~................ssssPI~~ssssIssssPsIssssssIsssPssIssssssI.mT..T................f...~~~~~~~",
"~~~~~~~...............ssssIs~~sssIsssssPIssssssIssssPsIssssssIs.mm.............f.........~.~~~~~",
"~~~~~.~....T......f..TsssIPs~~ssIssssssIssssssIsssssPIssssssIss.mm.........T...............~~~~~",
"~~~~~.~...............ssIsPs~~sIssssssIPsssssIssssssIssssssIsss.mm....f..............f...~~~~~~~",
"~~~~~~~..f............sIssPs~~IsssssVIsPssssIssssssIPsssssIssss.mm.........................~~~~~",
"~~~~~.................IPPPPP~~PPPPPP,PPPPPPIPPPPPPIPPPPPPIPPPPP.mm...................TT....~~~~~",
"~~~~~~.....TT.........ssssPs~~sssssI,ssPssIssssssIssPsssIssssssfmm.....f.......f...........~~~~~",
"~~~~~.......T.........ssssPI~~ssssIs,ssPsIssssssIsssPssIssssssI.mm....T.........T......T.~.~~~~~",
"~~~~~~............f.f.ssssIs~~sssIss,ssPIssssssIssssPsIssssssIs.mm.........T..............~~~~~~",
"~~~~~~................sssIPs~~55I555555I555555I55555PI555555I555mm........................~~~~~~",
"~~~~~~~............T..ssIsPs~~sIssss,sIPssss555555555555sssIsss.mm......T........T.f.......~~~~~",
"~~~~~~.......TT.......sIssPs~~Isssss,IsPssss555555555555ssIssss.mm.....T.....f..T..........~~~~~",
"~~~~~~...T............IsssPs~~ssssss,ssPsssIssssssIsPssssIsssss.mm....TT.......T.........~~~~~~~",
"~~~~~........f.....TT...T...~~.....f,T.....................f....mm...T........T............~~~~~",
"~~~~~~........TT............~~mm,mmm,,,,,.....................T.mm..T........T........T...~~~~~~",
"~~~~~~~.........f.f.........~~m,mmmmm,mmm.......f.....T.........mmTT...T.f..T........T...~.~~~~~",
"~~~~~~~...................T.~~,mmmmm,mmmm......................TmmT........T........T....~.~~~~~",
"~~~~~~..T..................T~~mmmmm,mmmmm.......................mm......f.T........T...T...~~~~~",
"~~~~~~......................~~mmmm,mmmmm,.......................66,,,,,,,,V.......T........~~~~~",
"~~~~~.~.......T.............~~mmm,mmmmm,m...T...................66,.....T........T.......~~~~~~~",
"~~~~~~.......f.....f....T...~~mm,mmmmm,mm..................T....mm,....T........T....T...~.~~~~~",
"~~~~~.......................~~m,mmmmm,mmm...f..................Tmm,...T...f....T.........~.~~~~~",
"~~~~~.....T.T...............~~,mmmmm,mmmm.......T...........,,,,mm,..T.T......T..........~.~~~~~",
"~~~~~~~.mmmmmmmmmmmmmmmmmm..~~mmmmm,mmmmm..f................,f..mm..TT......TT........T....~~~~~",
"~~~~~...mTT....T....TT...m..~~mmmm,mmmmm,.........T......T..,..Tmm.T........T......T.T....~~~~~~",
"~~~~~...m..TT...fT....TT.m..~~mmm,mmmmm,m..T................,...mmT........T.......TT......~~~~~",
"~~~~~...m....TT....T....Tm..~~mm,mmmmm,mm....T..............,...mmmmmmmmmmTmmmimmmmTmmmmmmm~~~~~",
"~~~~~...m.T....TT....T...m..~~m,mmmmm,mmm................T..,..............iiiiiii........~~~~~~",
"~~~~~...m...T..T.TT....T.m..~~,mmmmm,mmmm~~~~~~~~~~~~~~~~~..,.......f....iiiiiiiiiii......~~~~~~",
"~~~~~~~.mT....T....TTT...m..~~mmmmm,mmmmm~~~~~~~~~~~~~~~~~..,...........iii...h...iii....~~~~~~~",
"~~~~~~..m.TT....V....TT..1Tf~~mmmm,mmmmm,.....,,,,,,,,......,........T..ii.hhhhhhh.ii......~~~~~",
"~~~~~~..m...TT....T....TT1..~~mmm,mmmmm,m.....,,,,,,,,......,..........ii.hhhhhhhhh.ii....~~~~~~",
"~~~~~...mT....TT,,,,,,,,,1,,22,,,,,,,,,,,,,,,,,,77,,,,,,,,,,,..........ii.hhhhhhhhh.ii...~.~~~~~",
"~~~~~~..m..T....TT....T..1..~~m,mmmmm,mm,.....,,77,,,,.............T...ii.hhhhhhhhh.ii.....~~~~~",
"~~~~~~~.m....T,...TT....T1,.~~,mmmmm,mmm,.....,,,,,,,,..........f.....iiihhhhhhhVhhhiii...~~~~~~",
"~~~~~~~.mTT....T....TT...m,.~~mmmmm,mmmm,...T.,,,,,,,,f................ii.hhhhhhhhh.ii....~~~~~~",
"~~~~~.~.m..TT....T....TT.m,f~~mmmm,mmmmm,.....,,,,,,,,.T......T........ii.hhhhhhhhh.ii...~~~~~~~",
"~~~~~...mf...TT....T....Tm,.~~mmm,mmmmm,,.....,,,,,,,,...T.............ii.hhhhhhhhhfii...~.~~~~~",
"~~~~~...m.T....TT....T.T.m,.~~mm,mmmmm,m,...........T.......f...........ii.hhhhhhh.ii.T..~~~~~~~",
"~~~~~~..m...T....TT....T.m,.~~m,mmmmm,mm,........f.T..............f.....iii...h...iiif...~~~~~~~",
"~~~~~~..mT....T....TT....m,.~~,mmmmm,mmm,T.................T.............iiiiiiiiiii......~~~~~~",
"~~~~~~..mmmmmmmmmm11111mmm,.~~mmmmm,mmmm,T..........T..T.T..T..............iiiiiii.........~~~~~",
"~~~~~~~.......T.....,,,,,,,.~~mmmm,mmmmm,.................aaaaraaaaaaaraaaaaaaiaaaaaa.....~~~~~~",
"~~~~~~..............,.......~~mmm,mmmmm,,................fgaaragaaaagraaagaaargaaaaga.....~~~~~~",
"~~~~~~..............,.......~~mm3mmmmm3m33333333333333333333r3333333r3333333r3333333r33333~~~~~~",
"~~~~~.~..T..........,.......~~T....................T...,..araaaaaaaraaaaaaaraaaaaaara.....~~~~~~",
"~~~~~~~..T..........,.......~~................T........,..raaagaaargaaaagaraagaaaaraa...V.~~~~~~",
"~~~~~~~.T...........,.......~~.......T.................,..aaaaaaaraaaaaaaraaaaaaaraaa..T,.~~~~~~",
"~~~~~~~..f..........,.......~~........................T,,,,,,,,,,,,,,aaaraLLLLaaraaaa...,.~~~~~~",
"~~~~~.~.............,.......~~.......T..........T.....f..faaagaraaga,aaraaLLLLaragaaa..T,.~~~~~~",
"~~~~~~~...........,,,.......~~..f.........................aaaaraaaaaV,,,44LLLL,,,,,,,,,,,.~~~~~~",
"~~~~~~.....T......,.........~~........f.....T.............aaaraaaaaaaraaaaLLLLaaaaaaa.....~~~~~~",
"~~~~~.~...........V....T....~~..............T.T...T.......aaraaaagaaragaaaLLLLaagaaar.....~~~~~~",
"~~~~~~..................T...~~..................T.........araaaaaaaraaaaaaLLLLaaaaara.....~~~~~~",
"~~~~~~..........T....T......~~............................raaaaaaaraaaaaaaLLLLaaaaraa.....~~~~~~",
"~~~~~~~.Of................f.~~................T...........agaaaagraaagaaarLLLLagaraag....~~~~~~~",
"~~~~~~.....f......T.........~~...............T.....T.f....aaaaaaraaaaaaaraaaaaaaraaaa....~~~~~~~",
"~~~~~~......................~~............................aaaaaraaaaaaaraaaaaaaraaaaa......~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~T.T.T........T......,,,,,O..gaaargaaaagaraagaaaaraaaaga....~.~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~...............f....,.....T.aaaraaaaaaaraaaaaaaraaaaaaa....~.~~~~~",
"~~~~~.~~~~~~~~~~~~~~~~~~~~~~~~f.....33333333333333,.......aaraaaaaaaraaaaaaaraaaaaaar....~.~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~......~~~~~~~~~~~~~~,...T..Taraagaaaaraaaagaaragaaaagra....~~~~~~~",
"~~~~~.~~~~~~~~~~~~~~~~~~~~~~~~........T...........O.f.....raaaaaaaraaaaaaaraaaaaaaraa....~.~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..............................................T............~~~~~~~",
"~~~~~~~..................................................................................~~~~~~~",
"~~~~~......~~.~..~.....~.........~~~~~......~.....~.~~~.~...~.....~~~.~.~~~...~...~.~..~...~~~~~",
"~~~~~~~~.~.~..~....~..~~..~~~~.~..~...~~~..~~~~~.~.~~.~~........~....~~.~.~~..~.~.~~~~..~..~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
]
const BAR={
 1:{id:'rockslide',open:()=>!!G.flags.boss,tile:',',hint:'A rockslide blocks the mountain pass. (Opens after you defeat Gravemaw in Hollowdeep — the first shard.)'},
 2:{id:'bridge',open:()=>!!(G.flags.harbor||G.flags.galeSeen),tile:'B',hint:'The Thorn river bridge is broken. (Opens after you first reach Galewright Point.)'},
 3:{id:'blockade',open:()=>!!(G.flags.corsair||(G.sky&&G.sky.flags&&G.sky.flags.corsair)),tile:',',hint:'Ashclaw ships close the strait. Orrin: "Can\'t run that on foot — we need the Cinderwing." (Opens after you defeat the Ashclaw Corsair.)'},
 4:{id:'lava',open:()=>!!G.flags.hale,tile:'b',hint:'A lava flow cuts the Ashmarch road. (Opens after Forgemaster Hale gives you the forge key.)'},
 5:{id:'frozen',open:()=>!!G.flags.tyrant,tile:'n',hint:'A frozen strait bars the way north. (Opens after you defeat the Slag Tyrant — the second shard\'s heat melts a channel.)'},
 6:{id:'pass',open:()=>!!G.flags.wyrm,tile:',',hint:'A gatehouse bars the road to Valorgate. (Opens after you defeat the Rime Wyrm — the third shard.)'},
 7:{id:'seal',open:()=>shardCount()>=3,tile:',',hint:'A Crown-shard seal glows on the ruin floor. (Opens when you carry three shards.)'}
};
function shardCount(){let n=0;if(G.flags.boss)n++;if(G.flags.tyrant)n++;if(G.flags.wyrm)n++;if(G.flags.hydra)n++;if(G.flags.warden)n++;if(G.flags.seneschal)n++;return n;}
// landmark doors on the continent → existing interior / field maps
const GDOOR={
 '16,38':{to:'town',tx:10,ty:14,d:'up',n:'Thornwick Village'},
 '18,60':{to:'harbor',tx:10,ty:8,d:'up',n:'Galewright Point'},
 '68,58':{to:'ashmarch',tx:7,ty:8,d:'up',n:'Ashmarch Wastes',need:()=>!!G.flags.corsair,no:'Ash storms and Ashclaw patrols still ring the volcano road. (Opens after the Ashclaw Corsair.)'},
 '36,12':{to:'tundra',tx:7,ty:8,d:'up',n:'Galeshear Tundra',need:()=>!!G.flags.tyrant,no:'Thunderheads seal the Rimespire road. (Opens after the Slag Tyrant.)'},
 '88,54':{to:'ex_saltmere',tx:10,ty:7,d:'up',n:'Saltmere',need:()=>!!G.flags.tyrant,no:'A coastal squall keeps you off Saltmere. (Opens after the Slag Tyrant.)'},
 '74,26':{to:'ex_valor',tx:10,ty:14,d:'up',n:'Valorgate',need:()=>!!G.flags.wyrm,no:'Valorgate\'s guns wave you off. (Opens after the Rime Wyrm.)'},
 '80,42':{to:'mirewood',tx:7,ty:8,d:'up',n:'Reedhaven (Verdance)',need:()=>!!G.flags.skyOpen,no:'Cliff walls ring the Verdance. Only the Cinderwing can land inside after the sky opens.',air:1},
 '8,63':{to:'__gull',n:'Gull\'s Rest Wreck'},
 '55,66':{to:'__hide',n:'Ashclaw Hideout',need:()=>!!(G.flags.corsair||(G.sky&&G.sky.flags&&G.sky.flags.corsair)),no:'The hideout sits behind the pirate blockade.'}
};
// where each sky POI / chapter field returns you onto the continent
const GEXIT={
 ashmarch:{x:68,y:59,d:'down'},tundra:{x:36,y:13,d:'down'},mirewood:{x:80,y:43,d:'down'},
 harbor:{x:18,y:61,d:'down'},town:{x:16,y:39,d:'down'},
 ex_saltmere:{x:88,y:55,d:'down'},ex_valor:{x:74,y:27,d:'down'},
 world:{x:14,y:42,d:'down'}
};
const LANDABLE=new Set(['.',',','a','s','h','f','j','p','V','O','b','n','B']);

// Barrier digits 1/3/4 must NOT join global SOLID — expansion grotto plates use those chars as walkable.
 // 2/5/6/7 are already solid from expansion.js; closed 1/3/4 are enforced in blocked() on ground only.
if(!TILES.B)TILES.B=TILES[',']||TILES['.'];
if(!TILES['1']){
 TILES['1']=[tileCanvas(g=>{px(g,'#6a5a4a',0,0,16,16);px(g,'#4a3a2a',2,4,12,10);px(g,'#8a7a6a',4,2,8,6);px(g,'#2a2018',1,14,14,2);})];
 TILES['2']=[tileCanvas(g=>{px(g,'#3a6a9a',0,0,16,16);px(g,'#8a5a2a',0,6,7,4);px(g,'#8a5a2a',9,6,7,4);px(g,'#5a3a1a',6,5,4,2);})];
 TILES['3']=[tileCanvas(g=>{px(g,'#2a4a8a',0,0,16,16);px(g,'#3a2a2a',2,6,12,6);px(g,'#a02030',4,3,2,5);px(g,'#a02030',10,3,2,5);})];
 TILES['4']=[tileCanvas(g=>{px(g,'#c8300c',0,0,16,16);px(g,'#ff7a1a',2,4,12,8);px(g,'#2a2020',0,0,16,2);px(g,'#2a2020',0,14,16,2);})];
 TILES['5']=[tileCanvas(g=>{px(g,'#c8d8f0',0,0,16,16);px(g,'#ffffff',2,2,12,10);px(g,'#7ab0d0',0,14,16,2);})];
 TILES['6']=[tileCanvas(g=>{px(g,'#7a7a88',0,0,16,16);px(g,'#4a4a58',3,2,10,12);px(g,'#c0392b',7,6,2,6);})];
 TILES['7']=[tileCanvas(g=>{px(g,'#3a2a4a',0,0,16,16);px(g,'#8040c0',4,4,8,8);px(g,'#e0a0ff',6,6,4,4);})];
}

addMap('ground',{name:'the Emberlands',mus:'world',bbg:'field',rows:GROW.slice(),
 enc:40,pool:[['slime','slime'],['bat'],['slime','bat'],['goblin'],['bat','bat'],['goblin','slime']],
 warps:[],doors:{}});

function refreshBarriers(){
 const M=MAPS.ground;if(!M||!G)return;
 for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){
  const t=M.rows[y][x],b=BAR[t];
  if(b&&b.open())setTile('ground',x,y,b.tile);
 }
 // restore closed barriers from a pristine copy when flags are missing (new game / tests)
}
const GRAW=GROW.slice();
function resetGroundTiles(){MAPS.ground.rows=GRAW.map(r=>r);MAPS.ground.w=GW;MAPS.ground.h=GH;refreshBarriers();}

function barrierAt(x,y){
 const t=tileAt('ground',x,y);return BAR[t]||null;
}
function bumpBarrier(x,y){
 const b=barrierAt(x,y);if(!b)return false;
 if(b.open()){refreshBarriers();return false;}
 if(b.id==='blockade'&&engageBlockade())return true;
 sfx('no');dialog([b.hint]);return true;
}
function footPass(x,y){
 if(x<0||y<0||x>=GW||y>=GH)return false;
 const t=tileAt('ground',x,y),b=BAR[t];
 if(b&&!b.open())return false;
 if(SOLID.has(t))return false;
 return true;
}
function footReach(sx,sy,tx,ty){
 const seen={},q=[[sx,sy]];seen[sx+','+sy]=1;
 while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)return true;
  for(const[a,c] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+c,k=nx+','+ny;if(seen[k]||!footPass(nx,ny))continue;seen[k]=1;q.push([nx,ny]);}}
 return false;
}
const SAIL=new Set(['~','B','n']);
let battleBack=null,stormLock=0,barLatch='';
function groundStory(){return !!(G&&G.flags&&G.flags._groundStory&&!G.flags.skyOpen);}
function stampFar(id){
 G.ex=G.ex||{fish:{},log:{},cards:{},beat:{},arena:0,pz:{},seen:{},got:{}};
 G.ex.seen=G.ex.seen||{};
 const was=G.ex.seen[id];G.ex.seen[id]=1;
 if(!was&&typeof qst==='function'&&qst('wayfarer').s===1){G.gold+=150;toast('Pell\'s contact here pays you 150 G for the visit. (Wayfarer\'s Rumours)');}
}
function engageBlockade(){
 if(!(G.flags._groundStory&&G.sky&&G.sky.tut&&!G.flags.corsair&&!(G.sky.flags&&G.sky.flags.corsair)))return false;
 dialog(['Ashclaw sails close the strait.','Captain Varra Kade: Orrin\'s old tub, and a Crown shard aboard. Ashclaw Corsairs — broadside!','Orrin Vey: Can\'t run a blockade on foot. All hands!'],
  ()=>startSkyBattle('corsair',{sea:1,back:{x:G.x,y:G.y,aboard:G.flags.aboard?1:0,d:G.d,lines:['Captain Varra Kade: This isn\'t over, Cinderwing! The Ashclaw never forget!','(The strait is clear. The shore party recovers 600 G and Cinder Iron x3.)','Lyra: The shard pulls southeast, along the coast. Ashmarch.','Orrin Vey: Cinderholt is the town under the volcano. The road is open.']}}));
 return true;
}
function maybeStorm(){
 if(stormLock||!(G.flags._groundStory&&G.sky&&G.sky.tut&&G.flags.tyrant&&!(G.sky.flags&&G.sky.flags.kade2)&&!G.flags.kade2))return false;
 if(!GRAW[G.y]||GRAW[G.y][G.x]!=='5')return false;
 stormLock=1;
 dialog(['Lightning splits the cold — a black-sailed ship bars the melted channel.','Captain Varra Kade: Two shards, and you brought them through the ice? Meet the Stormbreaker.','Orrin Vey: All hands! Watch her telegraphs!'],
  ()=>{stormLock=0;startSkyBattle('stormbreaker',{sea:1,back:{x:G.x,y:G.y,aboard:G.flags.aboard?1:0,d:G.d}});});
 return true;
}

// Ashen Vale (world) edge exits → continent
const _arrivedW=arrived;
// wrap enterMap early pieces
const _enterG0=enterMap;
enterMap=function(name,x,y,d){
 if(name==='ground'){resetGroundTiles();const r=_enterG0(name,x,y,d);G.flags.groundSeen=1;return r;}
 return _enterG0(name,x,y,d);
};

// Ashen Vale edge → Emberlands (via XSTEP so MAPS.world.warps stays length 2 for story tests)
const VALE_EDGE=[
 [0,6,'right',14,42],[0,7,'right',14,42],[23,6,'left',15,42],[23,7,'left',15,42],
 [10,0,'down',14,41],[11,0,'down',14,41],[10,13,'up',14,43],[11,13,'up',14,43]
];
// punch walkable edge pads on the local vale map (collision only; no new warps)
VALE_EDGE.forEach(([x,y])=>{const M=MAPS.world;if(M.rows[y]&&M.rows[y][x]==='m'){const r=M.rows;r[y]=r[y].slice(0,x)+','+r[y].slice(x+1);}});
// ground → Ashen Vale near Thornwick trail
MAPS.ground.warps.push({x:14,y:42,to:'world',tx:4,ty:6,d:'down'});

// town → ground (keep town→world, add alternate? keep as is; world links ground)
// harbor ship warp: when sky not open, board still goes sky for Ch2 tutorial; after skyOpen also fine

const _blkG=blocked;
blocked=function(x,y){
 if(G&&G.map==='ground'&&G.flags.aboard){
  if(x<1||y<1||x>=GW-1||y>=GH-1)return true;
  const t=tileAt('ground',x,y),b=BAR[t];
  if(b&&!b.open())return true;
  if(G.flags.skyOpen)return false;
  return !SAIL.has(t);
 }
 if(G&&G.map==='ground'){
  const t=tileAt('ground',x,y),b=BAR[t];
  if(b&&!b.open())return true;
 }
 return _blkG(x,y);
};

const _updG=updField;
// intercept bump into barriers ahead
const _arrivedG=arrived;
arrived=function(){
 if(G.map==='ground'&&G.flags.aboard){
  if(maybeStorm())return;
  if(groundStory()&&!G.flags.noenc&&G.sky){
   G._sailEnc=(G._sailEnc||480)-16;
   if(G._sailEnc<0){G._sailEnc=520;return startSkyBattle(rollSkyEnemy(),{sea:1,back:{x:G.x,y:G.y,aboard:1,d:G.d}});}
  }
  return;
 }
 if(G.map==='ground'){
  refreshBarriers();
  if(maybeStorm())return;
  const key=G.x+','+G.y,door=GDOOR[key];
  if(door){
   if(door.need&&!door.need()){G.y+=G.d==='up'?1:G.d==='down'?-1:0;G.x+=G.d==='left'?1:G.d==='right'?-1:0;sfx('no');dialog([door.no||'Come back later.']);return;}
   if(door.to==='__gull'){sfx('ok');if(!G.sky){dialog(['A beached wreck. You\'ll need a ship to search it properly.']);return;}
    if(G.sky.loot&&G.sky.loot.gull){toast('Only splinters and gulls remain.');return;}
    G.sky.loot=G.sky.loot||{};G.sky.loot.gull=1;G.sky.key=G.sky.key||{};G.sky.key.spyglass=1;G.sky.mat.iron=(G.sky.mat.iron||0)+2;G.gold+=200;
    dialog(['The wreck of Gull\'s Rest lies half-buried in the sand.','Found a brass Spyglass! (Pip\'s uncle\'s?)','Found Cinder Iron x2 and 200 G.']);return;}
   if(door.to==='__hide'){sfx('ok');if(!G.sky){dialog(['A sea cave. Too dark without the Cinderwing\'s lanterns.']);return;}
    if(G.sky.flags&&G.sky.flags.corsair){toast('The hideout is abandoned.');return;}
    return transition(()=>{startSkyMap(POI.find(p=>p.id==='hide'));skyInteract(POI.find(p=>p.id==='hide'));});}
   if(door.to==='mirewood'&&G.flags._groundStory&&G.sky&&!(G.sky.flags&&G.sky.flags.kade3)&&!G.flags.kade3){
    sfx('ok');
    return dialog(['The violet fog inside the cliffs parts — a ship twice the Stormbreaker rises out of it.','Captain Varra Kade: Three shards. My new employer is very interested in you.','Captain Varra Kade: The Black Tempest — all guns, fire!','Orrin Vey: Her crew... those aren\'t men. Brace and read her telegraphs!'],
     ()=>startSkyBattle('tempest',{sea:1,back:{x:80,y:43,aboard:0,d:'up'}}));
   }
   sfx('ok');
   if(door.to==='ex_saltmere')stampFar('ex_salt');
   if(door.to==='ex_valor')stampFar('ex_valor');
   if(door.to==='ashmarch'&&!G.flags.ashmarch){G.flags.ashmarch=1;return transition(()=>{enterMap('ashmarch',door.tx,door.ty,door.d);
    dialog(['— Chapter 3: Ash and Iron —','The coast road opens onto the Ashmarch Wastes.','Lyra: The second shard is close. I can feel the heat.']);});}
   if(door.to==='tundra'&&!G.flags.rime){G.flags.rime=1;return transition(()=>{enterMap('tundra',door.tx,door.ty,door.d);
    dialog(['— Chapter 4: Frost and Thunder —','Snow and thunder. Hollowfrost lies ahead.']);});}
   if(door.to==='mirewood'&&!G.flags.verd){G.flags.verd=1;return transition(()=>{enterMap('mirewood',door.tx,door.ty,door.d);
    dialog(['— Chapter 5: The Drowned Wilds —','The Cinderwing settles inside the cliff ring. Reedhaven\'s stilts rise from the mist.']);});}
   return transition(()=>enterMap(door.to,door.tx,door.ty,door.d));
  }
 }
 return _arrivedG();
};

// facing a barrier and pressing A (or walking into it) shows hint — walking already blocked; add A-look
const _updFieldG=updField;
function boardWater(tx,ty){
 G.flags.aboard=1;G.x=tx;G.y=ty;F.mv=0;
 if(!G.flags._sailTip){G.flags._sailTip=1;toast(G.flags.skyOpen?'The Cinderwing lifts off the water. A lands. B climbs to the sky.':'The Cinderwing slips into the current. Coasts and rivers — she can\'t climb yet.');}
}
updField=function(dt){
 if(!(G&&G.map==='ground'&&!UI.length&&!F.mv))return _updFieldG(dt);
 let held=null;for(const d of ['up','down','left','right'])if(K[d]){held=d;break;}
 if(!held)barLatch='';
 const [a,b]=DIRS[G.d],fx=G.x+a,fy=G.y+b;
 if(G.flags.aboard){
  if(P.b){P.b=0;
   if(G.flags.skyOpen){G.flags.aboard=0;return startSkyMap(POI.find(p=>p.id==='gale')||POI[0]);}
   sfx('no');toast('She can\'t climb yet. One shard sails; it doesn\'t breach the clouds.');return;}
  if(P.a){P.a=0;
   const bar=barrierAt(fx,fy);
   if(bar&&!bar.open()){if(bumpBarrier(fx,fy))return;}
   if(G.flags.skyOpen){
    const there=tileAt('ground',fx,fy),here=tileAt('ground',G.x,G.y);
    if(LANDABLE.has(there)||'VOB'.includes(there)){G.flags.aboard=0;G.x=fx;G.y=fy;toast('Landed.');return;}
    if(LANDABLE.has(here)||'VOB'.includes(here)){G.flags.aboard=0;toast('Landed.');return;}
   }else if(footPass(fx,fy)&&!SAIL.has(tileAt('ground',fx,fy))){G.flags.aboard=0;G.x=fx;G.y=fy;return;}
   return;}
  return _updFieldG(dt);
 }
 if(P.a){
  const bar=barrierAt(fx,fy);
  if(bar&&!bar.open()){P.a=0;bumpBarrier(fx,fy);return;}
  if(G.flags._groundStory&&G.sky&&G.sky.tut&&tileAt('ground',fx,fy)==='~'){P.a=0;boardWater(fx,fy);return;}
 }
 if(held){
  const[ha,hb]=DIRS[held],tx=G.x+ha,ty=G.y+hb,k=tx+','+ty,bar=barrierAt(tx,ty);
  if(bar&&!bar.open()&&barLatch!==k){barLatch=k;bumpBarrier(tx,ty);return;}
 }
 return _updFieldG(dt);
};

// chapter __ship warps: return to ground door when sky is not open; keep sky when skyOpen (tests + late game)
function shipOrGround(poiId, fromMap){
 if(!G.sky)return toast('No ship.');
 // Legacy / sky-first saves and chapter tests: no groundSeen yet → keep boarding the sky map.
 // Ground-first play before the midpoint returns you to the continent door.
 if(G.flags.skyOpen||!G.flags.groundSeen){const p=POI.find(q=>q.id===poiId);return startSkyMap(p);}
 const ex=GEXIT[fromMap];if(ex)return transition(()=>{scene='map';enterMap('ground',ex.x,ex.y,ex.d);});
 const p=POI.find(q=>q.id===poiId);return startSkyMap(p);
}
const _enterShip=enterMap;
enterMap=function(name,x,y,d){
 if(name==='__ship'){
  if(G.map==='ashmarch')return shipOrGround('cinder','ashmarch');
  if(G.map==='tundra')return shipOrGround('rime','tundra');
  if(G.map==='mirewood')return shipOrGround('verd','mirewood');
  if((G.map==='ex_saltmere'||G.map==='ex_valor')&&G.flags.groundSeen){
   const ex=GEXIT[G.map];if(ex)return transition(()=>{scene='map';G.flags.aboard=0;enterMap('ground',ex.x,ex.y,ex.d);});
  }
  if(G.map==='harbor'&&G.flags._groundStory&&!G.flags.skyOpen){
   if(!G.sky||!G.sky.tut)return _enterShip(name,x,y,d);
   return transition(()=>{scene='map';G.flags.aboard=1;enterMap('ground',18,66,'up');toast('The Cinderwing slips her mooring. Coasts and rivers only — she can\'t climb yet.');});
  }
 }
 return _enterShip(name,x,y,d);
};

// Midpoint: after Rime Wyrm, open the sky
const _wyrm=XWIN.wyrm;
XWIN.wyrm=function(){
 const r=_wyrm&&_wyrm();
 if(!G.flags.skyOpen){
  // chain after existing dialog by wrapping save path — call unlock after a short beat via existing dialog end is hard;
  // set flag and queue a follow-up if UI empties
  G.flags._pendingSkyOpen=1;
 }
 return r;
};
XSTEP.push(()=>{
 if(G.map==='world'){
  const hit=VALE_EDGE.find(([x,y])=>x===G.x&&y===G.y);
  if(hit){const[, ,d,tx,ty]=hit;G.flags._groundStory=1;sfx('ok');transition(()=>enterMap('ground',tx,ty,d));return true;}
 }
 if(G.flags._pendingSkyOpen&&!UI.length&&scene==='map'){
  const M=MAPS[G.map];
  if(M&&M.warps&&M.warps.some(w=>w.x===G.x&&w.y===G.y))return false; // don't steal ship pads
  G.flags._pendingSkyOpen=0;openSkyWorld();return true;
 }
 return false;
});
function openSkyWorld(){
 if(G.flags.skyOpen)return;
 G.flags.skyOpen=1;
 if(G.sky){G.sky.parts.sail=G.sky.parts.sail||1;G.sky.parts.keel=G.sky.parts.keel||1;}
 save();
 dialog(['Orrin Vey: Three shards... and a storm that finally listens.','Orrin Vey: Galeweave Sail and Stormkeel — seated. She can climb.','(The cloud ceiling opens. The high sky world is yours.)','Orrin Vey: From the clouds we can land anywhere open on the Emberlands — starting with the cliff-ringed Verdance.',
  'Over open sky, press B: Climb higher, or Descend to the Emberlands. Over the Verdance, B lands inside the cliffs.']);
}

// Landing on Verdance / open ground after sky unlock
const _skyIntG=skyInteract;
skyInteract=function(p){
 // gate high-sky optional islands already handled; for verd require skyOpen for NEW progress but allow if wyrm (tests set wyrm path via hydra flags...)
 if(p&&p.id==='verd'&&!G.flags.skyOpen&&!G.flags.wyrm){
  // before midpoint, Verdance is unreachable from sky
  sfx('no');return toast('Cliff walls and thick cloud seal the Verdance. (Opens when the Cinderwing learns to climb — after the Rime Wyrm.)');
 }
 // after sky open, landing verd also stamps ground pad visit
 const r=_skyIntG(p);
 if(p&&p.id==='verd')G.flags.groundVerd=1;
 return r;
};

// Descend from sky onto Emberlands (B while low over "land" proxy: near thorn/gale or free when skyOpen and pressing B twice?)
// Hook: when skyOpen and player presses B at low alt near no POI, offer Descend to ground under ship.
function descendToGround(forceVerd){
 if(!G.flags.skyOpen||!G.sky)return false;
 const vp=POI.find(p=>p.id==='verd');
 const nearV=vp&&Math.hypot(vp.x*16+8-G.sky.x,vp.y*16+8-G.sky.y)<90;
 let lx,ly;
 if(forceVerd||nearV){lx=80;ly=42;}
 else{
  const gx=Math.max(6,Math.min(GW-7,(G.sky.x/16*(GW/48))|0));
  const gy=Math.max(6,Math.min(GH-7,(G.sky.y/16*(GH/36))|0));
  lx=gx;ly=gy;let ok=0;
  for(let r=0;r<10&&!ok;r++)for(let dy=-r;dy<=r&&!ok;dy++)for(let dx=-r;dx<=r&&!ok;dx++){
   const x=gx+dx,y=gy+dy;if(x<1||y<1||x>=GW-1||y>=GH-1)continue;
   const t=GROW[y][x];if(LANDABLE.has(t)||'VOB'.includes(t)){lx=x;ly=y;ok=1;}
  }
  if(!ok)return false;
 }
 P.b=0;sfx('ok');G.flags.aboard=0;
 transition(()=>{scene='map';enterMap('ground',lx,ly,'down');
  if(lx===80&&ly===42)dialog(['The Cinderwing settles inside the Verdance cliff ring.']);
  else toast('Landed on the Emberlands.');});
 return true;
}
const _updSky=updSkyMap;
updSkyMap=function(dt){
 if(G.flags.skyOpen&&P.b&&G.sky&&!G.sky.alt&&!UI.length){
  P.b=0;const np=nearPOI(),overV=np&&np.id==='verd';
  choice('The clouds are open.',['Climb higher',overV?'Land in the Verdance':'Descend to the Emberlands'],i=>{
   if(i===0){if(!G.sky.parts.sail){sfx('no');toast('The Cinderwing needs a Galeweave Sail to climb higher.');return;}G.sky.alt=1;sfx('ok');return;}
   if(!descendToGround(overV?1:0))toast('No open ground to land on.');
  });
  return;
 }
 return _updSky(dt);
};


// Board ship from ground: stand on Galewright doorstep south and use existing harbor dock, OR a special board tile
MAPS.ground.warps.push({x:18,y:62,to:'harbor',tx:11,ty:12,d:'up'});

// Save migration. v<2 runs once. A ship already in the sky is grandfathered so nobody loses flight.
const MOVED_SKY=[['gale',18,66],['thorn',16,40],['gull',8,64],['hide',55,67],['cinder',68,59],['rime',36,13],['verd',80,43],['ex_salt',88,55],['ex_valor',74,27]];
function migrateGround(g){
 if(!g||(g.v|0)>=2)return g;
 g.flags=g.flags||{};
 const keep=Object.assign({},g.flags);
 g.v=2;
 if(g.sky&&!g.flags.skyOpen){g.flags.skyOpen=1;g.flags._migratedSky=1;}
 if(g.flags.boss)g.flags.groundSeen=1;
 if(g.map==='sky'&&g.sky&&typeof POI!=='undefined'){
  let best=null,bd=1e9;
  for(const[id,x,y] of MOVED_SKY){const p=POI.find(q=>q.id===id);if(!p)continue;
   const d=Math.hypot(p.x*16+8-(g.sky.x||0),p.y*16+8-(g.sky.y||0));if(d<bd){bd=d;best={x,y};}}
  if(best&&bd<80){g.map='ground';g.x=best.x;g.y=best.y;g.d=g.d||'down';g.flags.aboard=1;g.flags.groundSeen=1;}
 }
 for(const k in keep)if(g.flags[k]==null)g.flags[k]=keep[k];
 return g;
}
// polish.js replaces load/save after this file. Hook the final ones once every script has run.
setTimeout(function(){
 if(typeof window.drawPT!=='function'||typeof load!=='function')return;
 const _load=load,_save=save;
 load=function(i){let r;try{r=_load(i);}catch(e){G=null;}if(G)migrateGround(G);return r;};
 save=function(){if(G)G.v=Math.max(2,G.v|0);return _save.apply(this,arguments);};
 if(window.DBG){DBG.load=(...a)=>load(...a);DBG.save=(...a)=>save(...a);}
 const _dp=window.drawPT;
 window.drawPT=function(t,x,y,dx,dy){
  if(G&&G.map==='ground'&&BAR[t]&&!BAR[t].open()){
   const base={1:'r',2:'~',3:'~',4:'L',5:'I',6:'m',7:','}[t]||'.';
   _dp(base,x,y,dx,dy);
   if(t==='2'){X.save();X.beginPath();X.rect(dx,dy,6,16);X.clip();_dp('B',x,y,dx,dy);X.restore();X.save();X.beginPath();X.rect(dx+10,dy,6,16);X.clip();_dp('B',x,y,dx,dy);X.restore();}
   else if(t==='3'&&typeof dImg==='function'&&SKYART.corsair)dImg(SKYART.corsair,dx+8,dy+8,0.16,{});
   else if(t==='6')_dp('D',x,y,dx,dy);
   else if(t==='7'){X.save();X.globalAlpha=0.55+0.25*Math.sin(T*3);X.fillStyle='#c080ff';X.fillRect(dx+3,dy+3,10,10);X.restore();}
   return true;
  }
  return _dp(t,x,y,dx,dy);
 };
 const _xf=window.XFIELD;
 window.XFIELD=function(cx,cy){if(_xf)_xf(cx,cy);
  if(G&&G.map==='ground'&&G.flags.aboard&&SKYART.cinderwing){const[, ,ppx,ppy]=camera();dImg(SKYART.cinderwing,ppx-cx+8,ppy-cy+2,G.flags.skyOpen?0.34:0.42,{flip:G.d==='right'||G.d==='down'});}};
},0);

const _trG=transition;
transition=function(cb){
 const back=battleBack;
 if(!back)return _trG(cb);
 battleBack=null;
 return _trG(()=>{
  const prev=dialog;
  if(back.lines)dialog=function(lines,fn){dialog=prev;return prev(back.lines,fn);};
  try{cb();}finally{dialog=prev;}
  if(scene==='skymap'){G.flags.aboard=back.aboard?1:0;scene='map';enterMap('ground',back.x,back.y,back.d||'down');}});
};
const _ssbG=startSkyBattle;
startSkyBattle=function(k,opt){
 _ssbG(k,opt||{});
 if(opt&&opt.sea){if(SB)SB.sea=1;battleBack=opt.back||{x:G.x,y:G.y,aboard:G.flags.aboard?1:0,d:G.d};}
 else battleBack=null;
};
const _repairG=repairScene;
repairScene=function(){
 if(!(G.flags._groundStory&&!G.flags.skyOpen))return _repairG();
 transition(()=>{G.sky=newSky();
  dialog(['(The party works through the night. Orrin seats the shard in the engine.)','Orrin Vey: She needs a name. Something with fire in it.','Lyra: The Cinderwing.','Orrin Vey: The Cinderwing it is. She will run the coast and the rivers — she can\'t climb. Not on one shard.'],
   ()=>transition(()=>{dialog(['(A shadow rises off the water...)','Orrin Vey: A Gloomray! The same beast that grounded me!','Orrin Vey: Plan each turn on the grid: 3 heroes and the ship. Red turns hit hard — Guard! Green turns are openings!'],
    ()=>startSkyBattle('gloomray',{tut:1,sea:1,back:{x:18,y:66,aboard:1,d:'up',lines:['Orrin Vey: Ha! The Cinderwing bites back!','Orrin Vey: She sails with the D-pad. Press A beside a beach to step ashore.','Orrin Vey: Galewright is just north. The shipyard still sells parts.','Orrin Vey: She can\'t climb. The high sky stays shut until the third shard.']}}));}));});
};
const _orrinG=orrinAct;
orrinAct=function(){
 if(G.flags._groundStory&&!G.flags.skyOpen&&G.sky)return dialog(['Orrin Vey: She\'s your ship as much as mine. Walk to the water and press A to board.','Orrin Vey: She can\'t climb yet. One shard sails. It does not breach the clouds.','Orrin Vey: The Ashclaw blockade is southeast. We can\'t run it on foot.']);
 return _orrinG();
};
const _ag=afterGravemaw;
afterGravemaw=function(){
 G.flags._groundStory=1;G.flags.groundSeen=1;G.flags._emberlandsTip=1;
 dialog(['Lyra: The shard is pulling east, past the vale.','Mira: Galewright still builds ships on the coast.','Kael: Then we walk. The quake should have cleared the pass.'],
  ()=>transition(()=>{scene='map';G.flags.harbor=1;enterMap('harbor',10,8,'up');save();
   dialog(['Galewright Point — a harbor on the Emberlands coast.','Lyra: The shard glows toward that wrecked skiff... and the man beside it.','She will sail. She will not fly. Not yet.']);}));
};
const _elder=NPCS.town&&NPCS.town.find(n=>n.s==='elder');
if(_elder){const _el=_elder.lines;_elder.lines=()=>{const L=_el();if(G.flags.boss)L.push('Elder Bran: That quake last night — is the east pass clear? Galewright lies along the coast.');return L;};}

window.GROUND={BAR,GDOOR,GEXIT,refreshBarriers,resetGroundTiles,migrateGround,openSkyWorld,shardCount,LANDABLE,GW,GH,descendToGround,footReach};
})();
