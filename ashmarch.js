'use strict';
// Emberfall — Chapter 3: Ash and Iron. Ashmarch (volcano isles): Cinderholt, the Ashmarch Wastes, the Ember Forge and the Slag Tyrant.
// ---------- tiles ----------
function ashG(g){px(g,'#5a4a46',0,0,16,16);for(let i=0;i<12;i++)px(g,rnd()<.5?'#6a5852':'#4a3c38',rnd()*16|0,rnd()*16|0,2,1);}
TILES.a=[tileCanvas(ashG)];
TILES.r=[tileCanvas(g=>{ashG(g);px(g,'#2a2226',1,3,14,13);px(g,'#3e3238',3,1,10,10);px(g,'#584a50',5,2,4,3);px(g,'#1a1418',1,14,14,2);})];
TILES.g=[tileCanvas(g=>{ashG(g);px(g,'#2a1a14',7,5,2,11);px(g,'#2a1a14',4,4,3,1);px(g,'#2a1a14',9,3,3,1);px(g,'#2a1a14',3,3,1,2);px(g,'#2a1a14',11,2,1,2);px(g,'#ff6020',8,14,1,1);})];
TILES.L=[0,1].map(f=>tileCanvas(g=>{px(g,'#c8300c',0,0,16,16);for(let i=0;i<6;i++)px(g,i%2?'#ff7a1a':'#ffc040',(i*5+f*4)%14,(i*3+f*5)%15,3,1);px(g,'#8a1a06',0,15,16,1);}));
TILES.b=[tileCanvas(g=>{px(g,'#c8300c',0,0,16,16);px(g,'#3a3034',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#26202a',x,2,1,12);px(g,'#5a4e50',0,2,16,1);px(g,'#1a1418',0,13,16,1);})];
TILES.Z=[tileCanvas(g=>{px(g,'#1a1012',0,0,16,16);px(g,'#2e1a1a',1,1,6,5);px(g,'#2e1a1a',9,3,6,5);px(g,'#2e1a1a',3,9,7,5);px(g,'#4a2620',1,1,6,1);px(g,'#4a2620',9,3,6,1);px(g,'#4a2620',3,9,7,1);px(g,'#ff5010',12,12,1,2);})];
TILES[';']=[tileCanvas(g=>{px(g,'#3a2a28',0,0,16,16);for(let i=0;i<8;i++)px(g,rnd()<.5?'#4a3632':'#2e201e',rnd()*16|0,rnd()*16|0,2,1);px(g,'#6a2a14',rnd()*14|0,rnd()*14|0,1,1);})];
['r','g','L','Z'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('magma','magma_beast');loadPaint('csentry','cinder_sentry');loadPaint('tyrant','slag_tyrant');
EN_ART.ewisp={rows:EN_ART.wisp.rows,pal:{k:'#4a1408',Y:'#ff7020',W:'#fff0a0',b:'#4a1408'}};
EN_ART.aslime={rows:EN_ART.slime.rows,pal:{k:'#1a1210',G:'#5a4a44',g:'#3a2e2a',W:'#ff9030'}};
EN_ART.ashbat={rows:EN_ART.bat.rows,pal:{k:'#140a08',W:'#4a3a36',P:'#8a4a2a',r:'#ffb020'}};
EN_ART.magma=EN_ART.goblin;EN_ART.csentry=EN_ART.skeleton;EN_ART.tyrant=EN_ART.boss;
['ewisp','aslime','ashbat'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
SPR.hale=charSet({H:'#6a6a6a',h:'#a0a0a0',s:'#c88a60',O:'#5a3a2a',A:'#ff7020',L:'#2a2020',b:'#1a1010'});
SPR.sola=charSet({H:'#a02020',h:'#e05040',s:'#f0c8a0',O:'#d8a040',A:'#ffffff',L:'#5a2a1a',b:'#2a1010'});
SPR.brann=charSet({H:'#2a1a10',h:'#5a3a20',s:'#b07850',O:'#4a4a5a',A:'#c0c0c8',L:'#2a2a2a',b:'#1a1010'});
SPR.rook=charSet({H:'#1a1a1a',h:'#4a3a4a',s:'#d0a080',O:'#3a1a2a',A:'#a02030',L:'#201018',b:'#100808'});

// ---------- data ----------
Object.assign(ITEMS,{hipotion:{n:'Hi-Potion',p:90,heal:220,tgt:'P',d:'Restore 220 HP'},hiether:{n:'Turbo Ether',p:180,mpr:70,tgt:'P',d:'Restore 70 MP'}});
Object.assign(EQ,{emberbrand:{n:'Emberbrand',slot:'w',who:'kael',atk:22,p:620},magmarod:{n:'Magma Rod',slot:'w',who:'lyra',atk:3,mag:19,p:560},
 ashmace:{n:'Ashen Mace',slot:'w',who:'mira',atk:14,mag:13,p:560},cindermail:{n:'Cinder Mail',slot:'a',def:13,p:420},
 ashveil:{n:'Ashveil Cloak',slot:'a',def:9,mdef:14,p:0},tyrantfang:{n:'Tyrant Fang',slot:'w',who:'kael',atk:30,p:0}});
const ASTOCK=['potion','hipotion','ether','hiether','bloom','emberbrand','magmarod','ashmace','cindermail'];
function tyrantAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.howl){u.howl=1;return {u,kind:'buff',name:'Furnace Heart',tg:[u]};}const r=Math.random();
 if(ph&&r<0.3)return {u,kind:'mag',name:'Eruption',pow:1.15,el:'fire',tg:P,fx:'fire'};
 if(r<0.5)return {u,kind:'mag',name:'Slag Wave',pow:0.8,el:'fire',tg:P,fx:'fire'};
 if(r<0.75)return {u,kind:'phys',name:'Magma Fist',pow:1.5,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
Object.assign(EN,{
 ashbat:{n:'Ash Bat',hp:110,atk:27,def:8,mag:6,spd:16,xp:38,g:24,weak:'ice'},
 aslime:{n:'Slag Slime',hp:190,atk:27,def:20,mag:8,spd:5,xp:42,g:34,weak:'bolt',res:'fire'},
 ewisp:{n:'Ember Wisp',hp:130,atk:12,def:8,mag:30,spd:13,xp:46,g:30,weak:'ice',res:'fire',caster:1},
 magma:{n:'Magma Drake',hp:250,atk:32,def:14,mag:6,spd:9,xp:64,g:46,weak:'ice',res:'fire'},
 csentry:{n:'Cinder Sentry',hp:210,atk:33,def:17,mag:6,spd:9,xp:58,g:42,weak:'ice',res:'fire'},
 tyrant:{n:'Slag Tyrant',hp:2600,atk:42,def:18,mag:32,spd:11,xp:1400,g:1200,weak:'ice',res:'fire',boss:1,ai:tyrantAI}});

// ---------- maps ----------
function addMap(k,m){m.w=Math.max(...m.rows.map(r=>r.length));m.rows=m.rows.map(r=>r.padEnd(m.w,r[0]));m.h=m.rows.length;MAPS[k]=m;}
addMap('ashmarch',{name:'Ashmarch Wastes',mus:'world',bbg:'ash',rows:[
"rrrrrrrrrrrrrrrrrrrrrrrr",
"raaagaaaaaaLLLLaaaaaaOrr",
"raaaaaaaaaaaLLLaaaaaa,rr",
"raV,,,,,,,,,bbb,,,,,,,ar",
"raaaaaaa,aaaLLLaaagaaaar",
"raagaaaa,aaaLLLaaaaaaaar",
"raaaaaaa,aaaaLLLaaaaaaar",
"raaaaaaa,aaaaaLLLaaagaar",
"raaaarr,,aaaaaaLLLaaaaar",
"raaaarrHaaaaaaaaLLLaaaar",
"rrrrrrrrrrrrrrrrrrrrrrrr"],
 enc:22,pool:[['ashbat','ashbat'],['aslime'],['ewisp','ashbat'],['magma'],['aslime','ewisp']],
 warps:[{x:2,y:3,to:'cinderholt',tx:11,ty:11,d:'up'},{x:21,y:1,to:'forge',tx:11,ty:13,d:'up'},{x:7,y:9,to:'__ship'}]});
addMap('cinderholt',{name:'Cinderholt',mus:'town',rows:[
"rrrrrrrrrrrrrrrrrrrr",
"ra..LLL....,...RRRRr",
"raRRRR.....,...RRRRr",
"raRRRR.....,...WWDWr",
"raWDWW.....,.......r",
"ra..,,,,,,,,,,,,,..r",
"ra..,...RRRRR..,...r",
"ra..,...RRRRR..,.g.r",
"ra..,...WWDWW..,...r",
"ra..,,,,,,,,,,,,...r",
"ra.g.......,.......r",
"ra.........,.....g.r",
"rrrrrrrrrrr,rrrrrrrr"],
 enc:0,warps:[{x:11,y:12,to:'ashmarch',tx:3,ty:3,d:'right'}],doors:{'3,4':'cinn','17,3':'cshop','10,8':'hale'}});
MAPS.cinderholt.rows=MAPS.cinderholt.rows.map(r=>r.replace(/\./g,'a'));
addMap('forge',{name:'The Ember Forge',dark:1,mus:'cave',bbg:'forge',rows:[
"ZZZZZZZZZZZZZZZZZZZZZZZZ",
"ZZZZZZZZZ;;;;;;ZZZZZZZZZ",
"ZZZZZZZZ;;;;;;;;ZZZZZZZZ",
"ZZZZZZZZZ;;;;;;ZZZZZZZZZ",
"ZZZZZZZZZZZ;;ZZZZZZZZZZZ",
"Zc;;;ZZZZZZ;;ZZZZZZ;;;cZ",
"Z;;;;;;;;;;;;;;;;;;;;;;Z",
"Z;;ZZLLLLLLbbLLLLLLZZ;;Z",
"Z;;ZZLLLLLLbbLLLLLLZZ;;Z",
"Z;;;;;;;;;;;;;;;;;;;;;;Z",
"ZZZ;ZZZZZZZZZZZZZZZZ;ZZZ",
"ZZZ;;;;;;;;c;;;;;;;;;ZZZ",
"ZZZZZZZZZZ;;;;ZZZZZZZZZZ",
"ZZZZZZZZZZZ;;ZZZZZZZZZZZ",
"ZZZZZZZZZZZOOZZZZZZZZZZZ"],
 enc:13,pool:[['csentry'],['magma'],['ewisp','ewisp'],['csentry','ewisp'],['aslime','ashbat'],['magma','ashbat'],['csentry','csentry']],
 warps:[{x:11,y:14,to:'ashmarch',tx:21,ty:2,d:'down'},{x:12,y:14,to:'ashmarch',tx:21,ty:2,d:'down'}],
 chests:{'1,5':'ashveil','22,5':'hiether','11,11':'hipotion'}});

NPCS.cinderholt=[
 {x:9,y:9,s:'hale',d:'down',act:()=>haleAct()},
 {x:16,y:4,s:'brann',d:'down',lines:()=>['Brann: Smithy\'s right behind me. Ashmarch steel — the best there is.']},
 {x:4,y:5,s:'sola',d:'down',lines:()=>['Sola: The Ember Hearth inn. Rest for 30G — the door behind me.']},
 {x:13,y:10,s:'kid',d:'left',wander:1,lines:()=>G.flags.tyrant?['Cole: The forge is singing again! Dad says that\'s good.']:['Cole: Everything in the Forge is made of fire. Fire things hate the cold, right?','Cole: Lyra\'s Frost Lance would melt them. Wait — un-melt them?']},
 {x:6,y:10,s:'rook',d:'right',lines:()=>G.flags.tyrant?['Rook: Varra Kade will hear you took a second shard. Watch the skies.']:['Rook: I flew with the Ashclaw once. Varra Kade wants every shard of the Crown.','Rook: She tried the Forge first. The Slag Tyrant ate two of her ships.']},
 {x:14,y:2,s:'guard',d:'down',lines:()=>['Watchman: The Wastes are east of town. Lava splits them — cross at the stone bridge.','Watchman: The Forge sits in the north-east crater.']}];

// ---------- story ----------
function haleAct(){if(G.flags.tyrant){if(!G.flags.halegift){G.flags.halegift=1;G.gold+=500;G.items.tonic=(G.items.tonic||0)+2;G.eq.tyrantfang=(G.eq.tyrantfang||0)+1;sfx('coin');
  return dialog(['Forgemaster Hale: The forge-fires burn clean again. You have my thanks — and my best work.','Forgemaster Hale: I hammered a blade from the Tyrant\'s fang. Kael, it\'s yours.','Got 500 G, Hearth Tonic x2 and the Tyrant Fang!']);}
  return dialog(['Forgemaster Hale: Two shards, eh? The Crown will need all seven. Fly safe.']);}
 if(G.flags.hale)return dialog(['Forgemaster Hale: The Forge is north-east, across the lava bridge. The iron door will open for you now.']);
 G.flags.hale=1;dialog(['Forgemaster Hale: Outsiders? With an airship? ...and a Crown shard. I can feel its warmth from here.','Forgemaster Hale: Thirteen nights ago a second shard fell into the Great Forge.','Forgemaster Hale: The slag woke up. It calls itself the Slag Tyrant now, and it eats anything that glows.','Kael: Then we\'ll put it out.','Forgemaster Hale: Ha! Take my key to the Forge door. Fire-things fear the cold — remember that.','Got the Forge Key!']);}
function tyrantEvent(){dialog(['Lyra: The shard... it\'s inside that thing!','Slag Tyrant: MORE LIGHT. MORE HEAT. GIVE ME YOUR LITTLE EMBER.','Mira: It\'s burning the shard like coal!','Kael: Not for long. Lyra — make it cold!'],()=>startBattle(['tyrant'],'forge',true));}
XWIN.tyrant=()=>{G.flags.tyrant=1;save();dialog(['The Slag Tyrant cracks apart and cools into black glass.','Lyra: The second shard! It\'s warm... and it\'s pulling toward the first.','Mira: Two of seven. Forgemaster Hale should hear about this.','— Chapter 3 complete: Ash and Iron —'],
 ()=>choice('Chapter 3 complete. View the ending?',['Ending','Keep playing'],i=>{if(i===0)transition(()=>{scene='ending';});}));};
XSTEP.push(()=>{
 if(G.map==='ashmarch'&&G.x===21&&G.y===1&&!G.flags.hale){G.y=2;G.d='down';dialog(['A heavy iron door, sealed with a forge-mark. Someone in Cinderholt must have the key.']);return true;}
 if(G.map==='forge'&&!G.flags.tyrant&&G.y===3){tyrantEvent();return true;}return false;});
const _blk3=blocked;blocked=function(x,y){if(G.map==='forge'&&!G.flags.tyrant&&y===2&&x>=9&&x<=14)return true;return _blk3(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='forge'&&!G.flags.tyrant){const bob=Math.sin(T*1.6)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('tyrant',12*16-cx,3*16-cy+4+bob,{sc:0.5,alpha:0.95})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<3;i++){const p=(T*0.8+i/3)%1;X.globalAlpha=0.6*(1-p);X.fillStyle='#ff8030';X.fillRect(12*16-cx-6+i*6,2*16-cy-p*20,2,2);}X.globalAlpha=1;}});}});
XDOOR.cinn=()=>choice('Sola: A cool room and a hot meal for 30G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<30)return toast('Not enough gold.');G.gold-=30;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});
XDOOR.cshop=()=>openShop({stock:ASTOCK,n:'Brann\'s Smithy',who:'Brann'});
XDOOR.hale=()=>dialog(['Hale\'s workshop is full of half-finished blades. Hale himself is out in the square.']);

// ---------- airship link ----------
POI.push({id:'cinder',k:'ash',n:'Cinderholt (Ashmarch)',x:41,y:31,rx:24,ry:9});
const _enter3=enterMap;enterMap=function(name,x,y,d){if(name==='__ship'&&G.map==='ashmarch'){if(!G.sky)return toast('No ship.');return startSkyMap(POI.find(p=>p.id==='cinder'));}return _enter3(name,x,y,d);};
const _skyInt=skyInteract;skyInteract=function(p){if(p.id!=='cinder')return _skyInt(p);const S=G.sky;
 if(!S.flags.corsair){sfx('no');return toast('Ash storms and Ashclaw patrols ring the volcano isles. Not yet.');}sfx('ok');
 const first=!G.flags.ashmarch;G.flags.ashmarch=1;transition(()=>{scene='map';enterMap('ashmarch',7,8,'up');
  if(first)dialog(['— Chapter 3: Ash and Iron —','Orrin Vey: Ashmarch. Volcano isles, ash in the air, lava in the ditches.','Orrin Vey: Cinderholt\'s west of the landing. I\'ll keep the Cinderwing warm.','Lyra: The second shard is close. I can feel it burning.']);});};
const _isle=drawIsle;drawIsle=function(x,y,rx,ry,k){_isle(x,y,rx,ry,k==='ash'?'dock':k);if(k==='ash'){X.fillStyle='#3a2a2a';X.beginPath();X.moveTo(x-12,y-6);X.lineTo(x-2,y-22);X.lineTo(x+6,y-22);X.lineTo(x+14,y-6);X.fill();X.fillStyle='#ff6020';X.fillRect(x-1,y-23,6,2);
 for(let i=0;i<3;i++){const p=(T*0.5+i/3)%1;blob(x+2+p*6,y-26-p*16,3+p*4,'#555',0.5*(1-p));}}};
window.ASH={haleAct,tyrantEvent,ASTOCK};
