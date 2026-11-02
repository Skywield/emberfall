'use strict';
// Emberfall — Chapter 7: The Hollow Throne. The Sundered Reach, a broken throne-realm floating above the Gloaming:
// Lastlight Camp (inn, sutler, forge), the Shattered Causeway, the Hollow Citadel and the Hollow Seneschal.
// After the Warden fell, Vorthane tore the five shards out of Lyra's satchel. Now it is a race for the last two:
// the sixth is borne by his Seneschal; the seventh, the founders hid where he would never look — in Thornwick's own blood. In Kael.
// Varra (if trusted in Chapter 6) flies the Black Tempest's wreck at the Cinderwing's flank, as she promised.
// ---------- tiles (new symbols only: M N Q # = % +) ----------
function reachG(g){px(g,'#4a4060',0,0,16,16);for(let i=0;i<10;i++)px(g,rnd()<.5?'#5a5078':'#3a3050',rnd()*16|0,rnd()*16|0,3,1);if(rnd()<.35)px(g,'#ffd890',rnd()*14|0,rnd()*14|0,1,1);}
TILES.M=[tileCanvas(reachG)];
TILES.N=[tileCanvas(g=>{px(g,'#8a7a6a',0,0,16,16);for(let y=0;y<16;y+=5){px(g,'#6a5a4e',0,y+4,16,1);for(let x=(y%10?3:0);x<16;x+=7)px(g,'#6a5a4e',x,y,1,5);}px(g,'#c0a870',rnd()*14|0,rnd()*14|0,2,1);})];
TILES.Q=[tileCanvas(g=>{reachG(g);px(g,'#2a1a3a',5,2,6,14);px(g,'#ff5060',7,0,2,10);px(g,'#ffb0a0',7,1,1,4);px(g,'#6a3a7a',4,12,8,4);px(g,'#ffd0c0',10,5,1,1);})];
TILES['#']=[0,1].map(f=>tileCanvas(g=>{px(g,'#0c0818',0,0,16,16);for(let i=0;i<6;i++)px(g,i%2?'#3a2a5a':'#ffd070',(i*5+f*4)%15,(i*7+f*3)%15,1,1);px(g,'#1a1030',0,(f*6+4)%16,16,1);}));
TILES['=']=[tileCanvas(g=>{px(g,'#0c0818',0,0,16,16);px(g,'#b0905a',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#7a5a34',x,2,1,12);px(g,'#ffd890',0,2,16,1);px(g,'#4a3420',0,13,16,1);})];
TILES['%']=[tileCanvas(g=>{px(g,'#1a1426',0,0,16,16);px(g,'#3a3046',1,1,14,6);px(g,'#3a3046',1,9,14,6);px(g,'#c0a050',1,1,14,1);px(g,'#c0a050',1,9,14,1);px(g,'#ff6050',7,4,2,1);})];
TILES['+']=[tileCanvas(g=>{px(g,'#3a3248',0,0,16,16);px(g,'#4a4058',1,1,6,6);px(g,'#4a4058',9,9,6,6);px(g,'#c0a050',0,0,16,1);px(g,'#c0a050',0,8,16,1);if(rnd()<.4)px(g,'#ff8070',rnd()*14|0,rnd()*14|0,1,1);})];
['Q','#','%'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('seneschal','hollow_seneschal');
{const im=new Image();im.onload=()=>{SKYART.seraph=im;};im.src='art/game/throne_seraph.png';}
{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
 g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,190,60,0.38)';g.fillRect(0,0,c.width,c.height);SKYART.crownwing=c;};im.src='art/game/storm_wyvern.png';}
EN_ART.shardling={rows:EN_ART.wisp.rows,pal:{k:'#140810',Y:'#ff6050',W:'#ffe0c0',b:'#140810'}};
EN_ART.throneguard={rows:EN_ART.skeleton.rows,pal:{k:'#100c14',W:'#e0c070'}};
EN_ART.hollowhound={rows:EN_ART.goblin.rows,pal:{k:'#0a0610',G:'#3a2a4a',r:'#ff4040',W:'#100818',B:'#c0a050'}};
EN_ART.crownbat={rows:EN_ART.bat.rows,pal:{k:'#0a0610',W:'#ffe0a0',P:'#5a3a2a',r:'#ff3050'}};
EN_ART.voidooze={rows:EN_ART.slime.rows,pal:{k:'#06040c',G:'#2a2a4a',g:'#100c20',W:'#ffd070'}};
EN_ART.oathbound={rows:EN_ART.skeleton.rows,pal:{k:'#06040c',W:'#a0a0c8'}};
['shardling','throneguard','hollowhound','crownbat','voidooze','oathbound'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
EN_ART.seneschal=EN_ART.boss;
SPR.aldwin=charSet({H:'#e8e8e8',h:'#ffffff',s:'#c09a80',O:'#6a4a2a',A:'#ffb040',L:'#3a2a1a',b:'#100808'});
SPR.marrow=charSet({H:'#3a2a1a',h:'#5a4a2a',s:'#a07a5a',O:'#5a3a3a',A:'#d0d0d0',L:'#2a1a1a',b:'#100808'});
SPR.wick=charSet({H:'#c07a30',h:'#e0a050',s:'#c09a80',O:'#3a5a4a',A:'#ffd070',L:'#2a3a2a',b:'#100808'});
SPR.posy=charSet({H:'#7a3a5a',h:'#a05a7a',s:'#c09a80',O:'#5a4a7a',A:'#e0c0e0',L:'#2a2040',b:'#100808'});

// ---------- data ----------
Object.assign(ITEMS,{crownsalve:{n:'Crown Salve',p:700,heal:900,mpr:120,tgt:'P',d:'900 HP, 120 MP'},seraphdown:{n:'Seraph Down',p:400,rev:true,tgt:'Pdead',d:'Revive at 50% HP'}});
Object.assign(EQ,{sunderblade:{n:'Sunderblade',slot:'w',who:'kael',atk:68,p:3900},crownrod:{n:'Rod of Lastlight',slot:'w',who:'lyra',atk:10,mag:58,p:3700},
 seraphmace:{n:'Seraph Mace',slot:'w',who:'mira',atk:44,mag:44,p:3700},throneplate:{n:'Thronesteel Mail',slot:'a',def:42,mdef:30,p:3000},
 lastmantle:{n:'Lastlight Mantle',slot:'a',def:32,mdef:46,p:0},seneschalaegis:{n:'Seneschal\'s Aegis',slot:'a',def:54,mdef:42,p:0}});
const RSHOP=['crownsalve','seraphdown','dusktonic','starsalt','megaether','xpotion','tonic'];
const RSMITH=['sunderblade','crownrod','seraphmace','throneplate','dawnbrand','eclipserod','lunarmace','gloammail'];
function seneschalAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.oath){u.oath=1;u.atk=Math.round(u.atk*1.25);u.mag=Math.round(u.mag*1.15);return {u,kind:'buff',name:'Oath of the Hollow',tg:[u]};}const r=Math.random();
 if(ph&&r<0.3)return {u,kind:'mag',name:'Heartfire Verdict',pow:1.4,el:'fire',tg:P,fx:'fire'};
 if(r<0.35)return {u,kind:'mag',name:'Chains of the Throne',pow:1,el:'bolt',tg:P,fx:'bolt'};
 if(r<0.75)return {u,kind:'phys',name:'Regent\'s Halberd',pow:1.8,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
Object.assign(EN,{
 crownbat:{n:'Crown Bat',hp:460,atk:72,def:26,mag:30,spd:22,xp:170,g:90,weak:'ice'},
 voidooze:{n:'Void Ooze',hp:700,atk:70,def:52,mag:26,spd:7,xp:180,g:110,weak:'fire',res:'bolt'},
 hollowhound:{n:'Hollow Hound',hp:820,atk:86,def:38,mag:14,spd:17,xp:220,g:140,weak:'bolt'},
 shardling:{n:'Shardling',hp:520,atk:28,def:24,mag:80,spd:18,xp:210,g:130,weak:'ice',res:'fire',caster:1},
 throneguard:{n:'Throne Guard',hp:980,atk:84,def:56,mag:18,spd:11,xp:250,g:170,weak:'fire',res:'ice'},
 oathbound:{n:'Oathbound Keeper',hp:900,atk:78,def:46,mag:60,spd:13,xp:260,g:180,weak:'fire',res:'ice',caster:1},
 seneschal:{n:'Hollow Seneschal',hp:12500,atk:96,def:46,mag:76,spd:15,xp:9000,g:6500,weak:'ice',res:'fire',boss:1,ai:seneschalAI}});

// ---------- maps ----------
addMap('causeway',{name:'The Shattered Causeway',mus:'world',bbg:'throne',rows:[
"########################",
"#MMQMMMMM####MMMMMMMMO##",
"#MMMMMMMM#==#MMMQMMMNM##",
"#MVNNNNNNN==NNNNNNNNNM##",
"#MMMMMMNM#==#MMMMMMMMMM#",
"#MQMMMMNMM#==#MMMQMMMMM#",
"#MMMMMMNMMM#==#MMMMMMMM#",
"#MMMMMMNMMMM====MMMMQMM#",
"#MMMM##NNMMMMMMMMMMMMMM#",
"#MMMM##HMMMMMQMMMMMMMMM#",
"########################"],
 enc:22,pool:[['crownbat','crownbat'],['voidooze'],['hollowhound'],['voidooze','crownbat'],['hollowhound','crownbat'],['shardling']],
 warps:[{x:2,y:3,to:'lastlight',tx:11,ty:10,d:'up'},{x:21,y:1,to:'citadel',tx:11,ty:13,d:'up'},{x:7,y:9,to:'__ship'}]});
addMap('lastlight',{name:'Lastlight Camp',mus:'town',rows:[
"QQQQQQQQQQQQQQQQQQQQ",
"QMRRRRMMMMMNMMMRRRRQ",
"QMRRRRMMMMMNMMMRRRRQ",
"QMWDWWMMMMMNMMMWDWWQ",
"QMNNNNNNNNNNNNNNNNMQ",
"QMMNMMMRRRRRMMMMNMMQ",
"QMMNMMMRRRRRMMMMNMMQ",
"QMMNMMMWWDWWMMMMNMMQ",
"QMMNNNNNNNNNNNNNNMMQ",
"QMMMMMMMMMMNMMMMQMMQ",
"QMMQMMMMMMMNMMMMMMMQ",
"QQQQQQQQQQQNQQQQQQQQ"],
 enc:0,warps:[{x:11,y:11,to:'causeway',tx:3,ty:3,d:'right'}],doors:{'3,3':'rinn','16,3':'rsmith','9,7':'rshop'}});
addMap('citadel',{name:'The Hollow Citadel',dark:1,mus:'cave',bbg:'throne',rows:[
"%%%%%%%%%%%%%%%%%%%%%%%%",
"%%%%%%%%%++++++%%%%%%%%%",
"%%%%%%%%++++++++%%%%%%%%",
"%%%%%%%%%++++++%%%%%%%%%",
"%%%%%%%%%%%==%%%%%%%%%%%",
"%c++%###%%%==%%%###%++c%",
"%++++====+++++++====+++%",
"%++%%###%%%++%%%###%%++%",
"%++%%###%%%++%%%###%%++%",
"%++++++++++++++++++++++%",
"%%%+%%%%%%%==%%%%%%%+%%%",
"%%%++++++++c+++++++++%%%",
"%%%%%%%%%%++++%%%%%%%%%%",
"%%%%%%%%%%%++%%%%%%%%%%%",
"%%%%%%%%%%%OO%%%%%%%%%%%"],
 enc:13,pool:[['throneguard'],['oathbound'],['shardling','shardling'],['throneguard','shardling'],['hollowhound','crownbat'],['oathbound','voidooze'],['throneguard','oathbound']],
 warps:[{x:11,y:14,to:'causeway',tx:21,ty:2,d:'down'},{x:12,y:14,to:'causeway',tx:21,ty:2,d:'down'}],
 chests:{'1,5':'lastmantle','22,5':'crownsalve','11,11':'seraphdown'}});

// NPCs stand clear of every door and the tile in front of it (see doorSafe test). Varra only camps here if she was trusted.
const RNPCS=[
 {x:10,y:9,s:'aldwin',d:'right',act:()=>aldwinAct()},
 {x:14,y:4,s:'marrow',d:'down',lines:()=>['Marrow: Forge is the door just east of me. I hammer thronesteel — the same metal his chains are made of.']},
 {x:5,y:4,s:'wick',d:'down',lines:()=>['Wick: The Lastlight Inn, two doors west. 120G and I\'ll keep the lamp burning all night.']},
 {x:7,y:8,s:'posy',d:'down',lines:()=>['Posy: My sutler tent is just there, east of me. Crown Salve, Seraph Down — the good stuff.']},
 {x:14,y:10,s:'kid',d:'left',wander:1,lines:()=>G.flags.seneschal?['Pip-squeak Tolly: The big throne up top is glowing! Is it waking up?']:['Pip-squeak Tolly: Grandpa Aldwin says we used to live in Thornwick, before the sky broke.','Pip-squeak Tolly: The man with the halberd walks the citadel at night. He never sleeps.']},
 {x:4,y:9,s:'varra',d:'right',act:()=>varraCampAct(),varraOnly:1},
 {x:13,y:1,s:'guard',d:'down',lines:()=>['Lamp-sentry: The Causeway runs east. Mind the gaps — nothing comes back from the void.','Lamp-sentry: The Hollow Citadel is the black-and-gold keep in the north-east. His throne floats above it.']}];
Object.defineProperty(NPCS,'lastlight',{get:()=>RNPCS.filter(n=>!n.varraOnly||G.flags.varraT),enumerable:true,configurable:true});

// ---------- story ----------
function aldwinAct(){if(G.flags.seneschal){if(!G.flags.aldwingift){G.flags.aldwingift=1;G.gold+=2600;G.items.crownsalve=(G.items.crownsalve||0)+3;G.eq.seneschalaegis=(G.eq.seneschalaegis||0)+1;sfx('coin');
  return dialog(['Keeper Aldwin: The sixth shard... in a Thornwick hand again, after a thousand years.','Keeper Aldwin: Marrow reforged the Seneschal\'s shield. It held his door. Now let it hold you.','Got 2600 G, Crown Salve x3 and Seneschal\'s Aegis!','Keeper Aldwin: He has five. You carry the sixth — and you ARE the seventh, boy. When you climb to that throne, he will try to take it out of you.','Keeper Aldwin: Rest. Eat. Then go and finish what our founders started.']);}
  return dialog(['Keeper Aldwin: The throne-stair above the Citadel is open now. When you are ready, the last climb waits.']);}
 if(G.flags.aldwin)return dialog(['Keeper Aldwin: The Citadel gate is north-east, across the Causeway. The Throne Sigil will open it.']);
 G.flags.aldwin=1;G.items.crownsalve=(G.items.crownsalve||0)+1;dialog(['Keeper Aldwin: Embers... and a Thornwick face. I knew your grandmother, boy. I was born in that village, three hundred years ago.','Keeper Aldwin: We are the last of the first keepers\' line. When the sky broke, we followed the heart up here to watch it.',
  'Lyra: He took them, Aldwin. All five. The moment the Warden fell, they ripped out of my satchel and flew up to his throne.','Keeper Aldwin: Then it is a race. The sixth shard is borne by his Seneschal, who climbs the Citadel to lay it at his feet.',
  'Mira: And the seventh? Nobody\'s ever found the seventh.','Keeper Aldwin: ...The founders hid it where he would never look. In the blood of Thornwick.','Kael: In me. That\'s why he calls me his heir.','Keeper Aldwin: The hand that holds the heart can break it — or make it whole. Stop the Seneschal before he reaches the throne. Take the Throne Sigil.','Got the Throne Sigil and a Crown Salve!']);}
function varraCampAct(){if(G.flags.seneschal)return dialog(['Varra Kade: Six shards and a heir. If he wants the seventh he\'ll have to go through my cutlass first.']);
 if(G.flags.varracamp)return dialog(['Varra Kade: The Tempest\'s patched. When you go up for the sky-beast, I go with you. Promised, didn\'t I?']);
 G.flags.varracamp=1;G.eq.lastmantle=(G.eq.lastmantle||0)+1;sfx('coin');save();
 dialog(['Varra Kade: Told you I\'d fly your flank, Thornwick. The Black Tempest\'s wreck still has teeth.','Varra Kade: Here. Lastlight Mantle — the camp gave it to me. You need it more than a pirate does.','Got the Lastlight Mantle!','Varra Kade: The Seneschal is weak to ice. He burns everything else.']);}
function seneschalEvent(){dialog(['Atop the Citadel, a regent in black-and-gold armour turns. The sixth shard burns in his halberd.','Hollow Seneschal: THE HEIR. HE SAID YOU WOULD COME. HE SAID YOU WOULD KNEEL.','Vorthane (from the throne above): Kael. Five beats in my chest. Take the sixth from my servant, if you can — and bring both to me.','Lyra: It\'s a trap. Whoever wins, the shard goes UP.','Kael: Then we win, and we keep it. Ice, everyone — he burns!'],()=>startBattle(['seneschal'],'throne',true));}
XWIN.seneschal=()=>{G.flags.seneschal=1;save();dialog(['The Hollow Seneschal falls. His halberd splits, and the sixth shard drops into Kael\'s hand.','Kael: It\'s... warm. And something in my chest is answering it.','Mira: Kael, your heart — it\'s glowing. The seventh shard. It\'s really in you.',
 'A stair of red light unfolds from the Citadel roof, up into the floating throne. Five shards orbit an empty crown.','Vorthane: Six and seven, together at last. Come up, heir. Come home. One way or another, I will be whole.',
 G.flags.varraT?'Varra Kade (on the comm-horn): Tempest\'s holding the stair. Whenever you\'re ready, we go up together. All the way.':'Lyra: No ship at our flank this time. Just us.',
 'Kael: The founders broke his heart once. This time, I end it for good.','— Chapter 7 complete: The Hollow Throne —'],
 ()=>choice('Chapter 7 complete. Climb the Stair of Light now?',['Climb now','Not yet'],i=>{if(i===0&&window.FINALE)FINALE.enterStair();}));};
XSTEP.push(()=>{
 if(G.map==='causeway'&&G.x===21&&G.y===1&&!G.flags.aldwin){G.y=2;G.d='down';dialog(['A gate of black iron and gold, stamped with an empty crown. It will not move. Someone in the camp must hold its sigil.']);return true;}
 if(G.map==='citadel'&&!G.flags.seneschal&&G.y===3){seneschalEvent();return true;}return false;});
const _blk7=blocked;blocked=function(x,y){if(G.map==='citadel'&&!G.flags.seneschal&&y===2&&x>=9&&x<=14)return true;return _blk7(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='citadel'&&!G.flags.seneschal){const bob=Math.sin(T*1.1)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('seneschal',12*16-cx,3*16-cy+6+bob,{sc:0.5,alpha:0.97})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<5;i++){const p=(T*0.6+i/5)%1;X.globalAlpha=0.7*(1-p);X.fillStyle=i%2?'#ffd070':'#ff5060';X.fillRect(12*16-cx-14+i*7,3*16-cy-p*34,2,2);}X.globalAlpha=1;}});}});
XDOOR.rinn=()=>choice('Wick: A warm cot by the last lamp for 120G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<120)return toast('Not enough gold.');G.gold-=120;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});
XDOOR.rshop=()=>openShop({stock:RSHOP,n:'Posy\'s Sutler Tent',who:'Posy'});
XDOOR.rsmith=()=>openShop({stock:RSMITH,n:'Marrow\'s Thronesteel Forge',who:'Marrow'});

// ---------- airship: the Sundered Reach — the Throne Seraph and roaming Crownwing Drakes ----------
Object.assign(SKYEN,{
 crownwing:{n:'Crownwing Drake',hull:2600,atk:98,spd:15,weak:'back',art:'crownwing',hollow:1,w:{hit:3,red:2.2,purple:1.2,green:1.3},g:560,xp:380,drop:{feather:3,ichor:3},sc:0.95},
 seraph:{n:'Throne Seraph',hull:6200,atk:116,spd:13,weak:'side',art:'seraph',hollow:1,boss:1,w:{hit:3,red:2.6,purple:1.5,green:1.1},g:3600,xp:2400,drop:{feather:6,ichor:5},sc:1.15}});
POI.push({id:'reach',k:'throne',n:'Lastlight Camp (the Sundered Reach)',x:5,y:4,rx:22,ry:8});
const _roll7=rollSkyEnemy;rollSkyEnemy=function(){const S=G.sky;if(G.flags.warden&&S.x<15*16&&S.y<13*16&&Math.random()<0.6)return 'crownwing';return _roll7();};
const _enter7=enterMap;enterMap=function(name,x,y,d){if(name==='__ship'&&G.map==='causeway'){if(!G.sky)return toast('No ship.');return startSkyMap(POI.find(p=>p.id==='reach'));}return _enter7(name,x,y,d);};
function landReach(){const first=!G.flags.reach;G.flags.reach=1;transition(()=>{scene='map';enterMap('causeway',7,8,'up');
 if(first){CARD7=3.2;dialog(['— Chapter 7: The Hollow Throne —','Orrin Vey: The Sundered Reach. A kingdom that fell UP. And that... is his throne, floating over it all.','Lyra: I can feel the five shards up there. Beating. He\'s almost whole.','Orrin Vey: There\'s a camp to the west with lamps lit. Living folk. Go — the Cinderwing will wait on the pad.']);}});}
let CARD7=0;
const _skyInt7=skyInteract;skyInteract=function(p){if(p.id!=='reach')return _skyInt7(p);const S=G.sky;
 if(!G.flags.warden){sfx('no');return toast('A broken kingdom floats here, sealed by an eclipse... for now.');}sfx('ok');
 if(!S.flags.seraph)return dialog(['Above the Veil, a throne-realm hangs in a gold-and-violet sky. Something with six wings rises to meet you.','Throne Seraph: NONE CLIMB TO THE THRONE BUT THE KING\'S OWN.','Orrin Vey: That thing\'s the size of a castle! Battle stations!',
  G.flags.varraT?'Varra Kade (on the comm-horn): Told you I\'d fly with you, Cinderwing. Black Tempest — on your flank!':'Lyra: We\'re on our own up here. Make every shot count.'],()=>{startSkyBattle('seraph');SB.varra=!!G.flags.varraT;});
 landReach();};
const _ev7=evStart;evStart=function(e){_ev7(e);if(e.k==='endturn'&&SB&&SB.varra&&SB.en.hp>0){const d=hitEnemy(140+SB.round*12,'ball');say(`Varra\'s Black Tempest rakes the ${SB.en.n}! ${d} dmg`);sfx('hit');}};
const _sbd7=XSCN.skybattle.d;XSCN.skybattle.d=function(){_sbd7();if(SB&&SB.varra&&SKYART.corsair){dImg(SKYART.corsair,40,40+Math.sin(T*2.3)*2,0.45,{flip:true});txt('Black Tempest',40,18,'#ff9090',6,'center');}};
const _finish7=finishSky;finishSky=function(){if(!(SB.k==='seraph'&&SB.end==='win'))return _finish7();const S=G.sky;S.hull=SB.hull;
 transition(()=>{SB=null;scene='skymap';S.flags.seraph=1;G.flags.seraph=1;S.mat.feather+=6;S.mat.ichor=(S.mat.ichor||0)+5;save();
  dialog(['The Throne Seraph\'s bones scatter like falling stars across the Reach.',G.flags.varraT?'Varra Kade: Not bad for a pirate and an old tub, eh? I\'ll moor the Tempest by the camp.':'Orrin Vey: Not a scratch... well. A lot of scratches. But we\'re flying.','Orrin Vey: The way is clear. Press A over the throne isle to land.']);});};
const _isle7=drawIsle;drawIsle=function(x,y,rx,ry,k){_isle7(x,y,rx,ry,k==='throne'?'dock':k);if(k==='throne'){
 X.fillStyle='#2a1a2a';X.fillRect(x-6,y-34,12,32);X.fillStyle='#c0a050';X.fillRect(x-10,y-36,20,4);X.fillRect(x-8,y-44,3,8);X.fillRect(x+5,y-44,3,8);X.fillRect(x-2,y-46,4,10);
 X.globalAlpha=0.6+0.3*Math.sin(T*3);X.fillStyle='#ff5060';X.fillRect(x-2,y-28,4,4);X.globalAlpha=1;X.fillStyle='#ffd890';for(let i=0;i<3;i++)X.fillRect(x-18+i*5,y-6,2,2);}};
// chapter card: a gold title plate over the field on first landing
const _df7=drawField;drawField=function(){_df7();if(CARD7>0&&G.map==='causeway'){CARD7=Math.max(0.6,CARD7-1/60);const a=Math.min(1,CARD7);X.globalAlpha=a*0.85;X.fillStyle='#0a0612';X.fillRect(0,40,W,62);X.globalAlpha=a;
 X.fillStyle='#c0a050';X.fillRect(20,44,W-40,1);X.fillRect(20,97,W-40,1);txt('CHAPTER VII',W/2,52,'#ff8070',8,'center');txt('The Hollow Throne',W/2,66,'#ffd890',14,'center');txt('Six shards. One heir. One throne.',W/2,86,'#d0c0f0',7,'center');X.globalAlpha=1;if(!UI.length)CARD7=0;}};
window.THRONE={aldwinAct,varraCampAct,seneschalEvent,landReach,RSHOP,RSMITH};
