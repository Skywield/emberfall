'use strict';
// Emberfall — Chapter 5: The Drowned Wilds. The Verdance isles: Reedhaven town (on stilts), the Mirewood, the Drowned Sanctum and the Mire Hydra.
// The Hollow King, Vorthane, speaks for the first time.
// ---------- tiles ----------
function mossG(g){px(g,'#3a6a2a',0,0,16,16);for(let i=0;i<12;i++)px(g,rnd()<.5?'#4a8a34':'#2a5220',rnd()*16|0,rnd()*16|0,2,1);if(rnd()<.4)px(g,'#d0e060',rnd()*14|0,rnd()*14|0,1,1);}
function wetF(g){px(g,'#3a4a44',0,0,16,16);for(let y=0;y<16;y+=8){px(g,'#24302c',0,y+7,16,1);for(let x=(y%16?4:0);x<16;x+=8)px(g,'#24302c',x,y,1,8);}for(let i=0;i<5;i++)px(g,'#3a7a4a',rnd()*15|0,rnd()*15|0,2,1);}
TILES.h=[tileCanvas(mossG)];
TILES.p=[tileCanvas(g=>{px(g,'#7a5a3a',0,0,16,16);for(let y=0;y<16;y+=4)px(g,'#5a3e24',0,y+3,16,1);for(let i=0;i<6;i++)px(g,'#9a7a50',rnd()*16|0,rnd()*16|0,3,1);})];
TILES.t=[tileCanvas(g=>{mossG(g);px(g,'#4a3020',7,10,3,6);px(g,'#14401c',1,3,14,9);px(g,'#1e5a28',3,1,10,7);px(g,'#2e7a34',5,2,5,3);px(g,'#8aff60',4,5,1,1);px(g,'#ff60c0',11,7,1,1);})];
TILES.i=[tileCanvas(g=>{mossG(g);px(g,'#5a6a5a',1,3,14,13);px(g,'#7a8a78',2,2,12,4);px(g,'#3a4a3a',1,14,14,2);px(g,'#3a8a3a',2,6,4,2);px(g,'#3a8a3a',9,10,5,2);px(g,'#4a5a4a',7,6,1,8);})];
TILES.l=[0,1].map(f=>tileCanvas(g=>{px(g,'#12403a',0,0,16,16);for(let i=0;i<5;i++)px(g,'#2a7a64',(i*5+f*3)%14,(i*3+f*4)%15,3,1);px(g,'#3a8a3a',(f*7+3)%12,9,3,2);}));
TILES.y=[tileCanvas(g=>{px(g,'#12403a',0,0,16,16);px(g,'#8a6a40',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#5a4024',x,2,1,12);px(g,'#3a8a3a',0,2,16,1);})];
TILES.u=[tileCanvas(g=>{px(g,'#8a7a3a',0,0,16,16);for(let y=0;y<16;y+=3){px(g,'#6a5a24',0,y+2,16,1);for(let x=(y%6?1:0);x<16;x+=3)px(g,'#b0a050',x,y,1,2);}px(g,'#4a8a34',0,0,16,1);})];
TILES.z=[tileCanvas(g=>{px(g,'#14221e',0,0,16,16);px(g,'#24403a',1,1,6,6);px(g,'#24403a',9,3,6,6);px(g,'#24403a',3,9,7,6);px(g,'#3a7a4a',1,1,6,1);px(g,'#3a7a4a',9,3,6,1);px(g,'#3a7a4a',3,9,7,1);px(g,'#a080ff',12,12,1,2);})];
TILES.x=[tileCanvas(wetF)];
['t','i','l','u','z'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('hydra','mire_hydra');
{const im=new Image();im.onload=()=>{SKYART.manta=im;};im.src='art/game/bog_manta.png';}
EN_ART.bogslime={rows:EN_ART.slime.rows,pal:{k:'#102010',G:'#6a9a3a',g:'#3a6a24',W:'#e0ff90'}};
EN_ART.mmoth={rows:EN_ART.bat.rows,pal:{k:'#1a1020',W:'#c070e0',P:'#6a3a8a',r:'#a0ff60'}};
EN_ART.lizard={rows:EN_ART.goblin.rows,pal:{k:'#0e1a10',G:'#4a9a5a',r:'#ffd040',W:'#2a3a20',B:'#8a6a3a'}};
EN_ART.drowned={rows:EN_ART.skeleton.rows,pal:{k:'#0a1a1a',W:'#7ae0c0'}};
EN_ART.shade={rows:EN_ART.wisp.rows,pal:{k:'#100820',Y:'#9a60ff',W:'#e8d8ff',b:'#100820'}};
['bogslime','mmoth','lizard','drowned','shade'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
EN_ART.hydra=EN_ART.boss;
SPR.sefa=charSet({H:'#e0e0d0',h:'#ffffff',s:'#8a5a3a',O:'#2a6a4a',A:'#d0b040',L:'#2a3a2a',b:'#1a1a10'});
SPR.brannoc=charSet({H:'#2a2a2a',h:'#4a4a4a',s:'#a06a4a',O:'#6a4a2a',A:'#8a9a8a',L:'#3a2a1a',b:'#1a1010'});
SPR.wren=charSet({H:'#c04a2a',h:'#e07a4a',s:'#e0b090',O:'#4a7a3a',A:'#ffffff',L:'#3a2a20',b:'#2a1a10'});
SPR.odo=charSet({H:'#5a3a1a',h:'#7a5a3a',s:'#c08a60',O:'#8a6a2a',A:'#e0e0c0',L:'#3a3a2a',b:'#1a1a1a'});

// ---------- data ----------
Object.assign(ITEMS,{mdraught:{n:'Mire Draught',p:260,heal:300,mpr:50,tgt:'P',d:'Bitter: 300 HP, 50 MP'},megaether:{n:'Mega Ether',p:320,mpr:120,tgt:'P',d:'Restore 120 MP'}});
Object.assign(EQ,{tidecleaver:{n:'Tidecleaver',slot:'w',who:'kael',atk:44,p:1800},verdantrod:{n:'Verdant Staff',slot:'w',who:'lyra',atk:6,mag:36,p:1650},
 coralmace:{n:'Coral Mace',slot:'w',who:'mira',atk:27,mag:27,p:1650},mossmail:{n:'Mossweave Mail',slot:'a',def:25,mdef:14,p:1300},
 sanctumveil:{n:'Sanctum Veil',slot:'a',def:18,mdef:28,p:0},hydrascale:{n:'Hydrascale Armor',slot:'a',def:33,mdef:24,p:0}});
const MSHOP=['hipotion','xpotion','mdraught','hiether','megaether','bloom','tonic'];
const MSMITH=['tidecleaver','verdantrod','coralmace','mossmail','sunbrand','stormrod','auroramace','rimemail'];
function hydraAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.regrow){u.regrow=1;u.hp=Math.min(u.mhp,u.hp+Math.round(u.mhp*0.12));return {u,kind:'buff',name:'Regrow Heads',tg:[u]};}const r=Math.random();
 if(ph&&r<0.3)return {u,kind:'mag',name:'Hollow Tide',pow:1.2,el:'bolt',tg:P,fx:'bolt'};
 if(r<0.45)return {u,kind:'mag',name:'Venom Mist',pow:0.85,el:'fire',tg:P,fx:'fire'};
 if(r<0.75)return {u,kind:'phys',name:'Triple Bite',pow:1.6,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
Object.assign(EN,{
 mmoth:{n:'Mire Moth',hp:260,atk:46,def:16,mag:20,spd:19,xp:88,g:48,weak:'fire'},
 bogslime:{n:'Bog Slime',hp:420,atk:45,def:34,mag:14,spd:6,xp:96,g:60,weak:'ice',res:'fire'},
 lizard:{n:'Fen Lizardman',hp:520,atk:56,def:26,mag:10,spd:12,xp:130,g:84,weak:'ice'},
 drowned:{n:'Drowned Knight',hp:480,atk:55,def:34,mag:10,spd:9,xp:124,g:80,weak:'bolt',res:'ice'},
 shade:{n:'Hollow Shade',hp:300,atk:20,def:16,mag:52,spd:15,xp:118,g:70,weak:'fire',res:'bolt',caster:1},
 hydra:{n:'Mire Hydra',hp:6400,atk:66,def:30,mag:52,spd:13,xp:4200,g:3200,weak:'ice',res:'fire',boss:1,ai:hydraAI}});

// ---------- maps ----------
const mmap=(rows,tr)=>rows.map(r=>r.replace(/./g,c=>tr[c]??c));
addMap('mirewood',{name:'The Mirewood',mus:'world',bbg:'jungle',rows:mmap(MAPS.ashmarch.rows,{r:'i',a:'h',g:'t',L:'l',b:'y',',':'p'}),
 enc:22,pool:[['mmoth','mmoth'],['bogslime'],['lizard'],['bogslime','mmoth'],['lizard','mmoth']],
 warps:[{x:2,y:3,to:'reedhaven',tx:11,ty:10,d:'up'},{x:21,y:1,to:'sanctum',tx:11,ty:13,d:'up'},{x:7,y:9,to:'__ship'}]});
addMap('reedhaven',{name:'Reedhaven',mus:'town',rows:mmap(MAPS.hollowfrost.rows,{P:'t',s:'h',j:'p',U:'u'}),
 enc:0,warps:[{x:11,y:11,to:'mirewood',tx:3,ty:3,d:'right'}],doors:{'3,3':'minn','17,3':'msmith','8,7':'mshop'}});
addMap('sanctum',{name:'The Drowned Sanctum',dark:1,mus:'cave',bbg:'sunken',rows:mmap(MAPS.forge.rows,{Z:'z',';':'x',L:'l',b:'y'}),
 enc:13,pool:[['drowned'],['lizard'],['shade','shade'],['drowned','shade'],['bogslime','mmoth'],['lizard','shade'],['drowned','drowned']],
 warps:[{x:11,y:14,to:'mirewood',tx:21,ty:2,d:'down'},{x:12,y:14,to:'mirewood',tx:21,ty:2,d:'down'}],
 chests:{'1,5':'sanctumveil','22,5':'mdraught','11,11':'megaether'}});

// NPCs stand clear of every door and the tile in front of it (see doorSafe test).
NPCS.reedhaven=[
 {x:10,y:9,s:'sefa',d:'right',act:()=>sefaAct()},
 {x:15,y:4,s:'brannoc',d:'down',lines:()=>['Brannoc: Forge is the door behind me. Bog-iron and coral — keeps an edge in the wet.']},
 {x:5,y:4,s:'wren',d:'down',lines:()=>['Wren: The Lily Pad Inn, door on my left. 60G, and the frogs sing you to sleep.']},
 {x:6,y:8,s:'odo',d:'down',lines:()=>['Odo: Odo\'s Stilt Market, right behind me. Mire Draughts taste awful. Buy ten.']},
 {x:14,y:10,s:'kid',d:'left',wander:1,lines:()=>G.flags.hydra?['Pim: The water went clear! I saw a fish with a face. A NICE face.']:['Pim: The Sanctum used to be a castle. Then the swamp ate it.','Pim: At night the water glows purple and somebody whispers in it.']},
 {x:4,y:9,s:'rook',d:'right',lines:()=>G.flags.hydra?['Rook: Four shards. If Kade really sold herself to the Hollow King... the next fight is for the sky itself.']:['Rook: Kade\'s flagship passed overhead two nights ago. Flying the Hollow\'s black-violet banner.','Rook: She\'s not hunting shards for coin anymore. Someone is giving her orders.']},
 {x:13,y:2,s:'guard',d:'down',lines:()=>['Stilt-watch: The Mirewood\'s east. Mind the bog — stick to the boardwalks.','Stilt-watch: The Drowned Sanctum is the sunken temple to the north-east.']}];

// ---------- story ----------
function sefaAct(){if(G.flags.hydra){if(!G.flags.sefagift){G.flags.sefagift=1;G.gold+=1200;G.items.tonic=(G.items.tonic||0)+3;G.eq.hydrascale=(G.eq.hydrascale||0)+1;sfx('coin');
  return dialog(['Elder Sefa: The whispering in the water has stopped. You have given Reedhaven back its nights.','Elder Sefa: Brannoc made this from the Hydra\'s scales. It still remembers the deep — it will turn a blade.','Got 1200 G, Hearth Tonic x3 and Hydrascale Armor!','Elder Sefa: Vorthane named himself. That means he is no longer afraid of being known. Hurry, embers.']);}
  return dialog(['Elder Sefa: Four shards of seven. The other three lie beyond the Veil, where the Hollow is strongest.']);}
 if(G.flags.sefa)return dialog(['Elder Sefa: The Sanctum gate is north-east. The Tidestone will open it.']);
 G.flags.sefa=1;dialog(['Elder Sefa: Three shards... I can see their light through your packs. The old prophecy walked in on its own feet.','Elder Sefa: The Drowned Sanctum was the throne of the first Crown-keepers. The Hollow sank it a thousand years ago.','Elder Sefa: When the fourth shard fell there, the Mire Hydra rose from the deep and something began to whisper through it.','Mira: Whisper? Whisper what?','Elder Sefa: A name. Vorthane. The Hollow King.','Kael: So the Hollow has a king. Good. Kings can be found.','Lyra: The shard there is so cold... like the Wyrm\'s, but hungry. Ice will slow anything that lives in water.','Elder Sefa: Take the Tidestone. The Sanctum gate remembers the keepers.','Got the Tidestone!']);}
function hydraEvent(){dialog(['The black water churns. Three heads rise, violet eyes burning.','Mire Hydra: LITTLE EMBERS. THREE SHARDS. HE PROMISED US YOU WOULD COME.','??? (a second voice, from inside the shard): Kael of Thornwick. Lyra. Mira. I am Vorthane. Give me the light, and I will let you sleep.','Kael: Hide in a swamp-snake all you want. We\'re taking it back.','Mira: Lyra — ice! Freeze the heads before they grow back!'],()=>startBattle(['hydra'],'sunken',true));}
XWIN.hydra=()=>{G.flags.hydra=1;save();dialog(['The Mire Hydra sinks, its heads turning to stone and moss.','Lyra: The fourth shard... and something let go of it. Like a hand.','Vorthane (fading): Four of seven. Enough to wake my gate. Come to the Veil, embers... I will be waiting with the rest.','Mira: He wanted us to win?','Kael: Then we\'ll make him regret it. Elder Sefa needs to hear this.','— Chapter 5 complete: The Drowned Wilds —'],
 ()=>choice('Chapter 5 complete. View the chapter summary?',['Summary','Keep playing'],i=>{if(i===0)transition(()=>{scene='ending';});}));};
XSTEP.push(()=>{
 if(G.map==='mirewood'&&G.x===21&&G.y===1&&!G.flags.sefa){G.y=2;G.d='down';dialog(['A gate of mossy stone, carved with a wave. It won\'t move. The elders of Reedhaven must hold its key.']);return true;}
 if(G.map==='sanctum'&&!G.flags.hydra&&G.y===3){hydraEvent();return true;}return false;});
const _blk5=blocked;blocked=function(x,y){if(G.map==='sanctum'&&!G.flags.hydra&&y===2&&x>=9&&x<=14)return true;return _blk5(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='sanctum'&&!G.flags.hydra){const bob=Math.sin(T*1.2)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('hydra',12*16-cx,3*16-cy+4+bob,{sc:0.5,alpha:0.95})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<5;i++){const p=(T*0.5+i/5)%1;X.globalAlpha=0.7*(1-p);X.fillStyle=i%2?'#60f0d0':'#a070ff';X.fillRect(12*16-cx-14+i*7,3*16-cy-p*34,2,2);}X.globalAlpha=1;}});}});
XDOOR.minn=()=>choice('Wren: A hammock, a hot bath and frog-song for 60G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<60)return toast('Not enough gold.');G.gold-=60;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});
XDOOR.mshop=()=>openShop({stock:MSHOP,n:'Odo\'s Stilt Market',who:'Odo'});
XDOOR.msmith=()=>openShop({stock:MSMITH,n:'Brannoc\'s Bog Forge',who:'Brannoc'});

// ---------- airship: Verdance isles, bog mantas, Varra Kade's Hollow-crewed flagship ----------
Object.assign(SKYEN,{
 manta:{n:'Bog Manta',hull:1500,atk:78,spd:15,weak:'back',art:'manta',hollow:1,w:{hit:3,red:2,purple:1.2,green:1.2},g:340,xp:220,drop:{feather:2,ichor:2},sc:0.95},
 tempest:{n:'Black Tempest',hull:3600,atk:94,spd:13,weak:'side',art:'corsair',pirate:1,boss:1,w:{hit:3,red:2.4,purple:1.6,green:1},g:2000,xp:1300,drop:{iron:5,ichor:3},sc:1.2}});
POI.push({id:'verd',k:'mire',n:'Reedhaven (Verdance)',x:30,y:32,rx:26,ry:9});
const _roll5=rollSkyEnemy;rollSkyEnemy=function(){const S=G.sky;if(G.flags.wyrm&&S.y>26*16&&Math.random()<0.6)return 'manta';return _roll5();};
const _enter5=enterMap;enterMap=function(name,x,y,d){if(name==='__ship'&&G.map==='mirewood'){if(!G.sky)return toast('No ship.');return startSkyMap(POI.find(p=>p.id==='verd'));}return _enter5(name,x,y,d);};
function landVerd(){const first=!G.flags.verd;G.flags.verd=1;transition(()=>{scene='map';enterMap('mirewood',7,8,'up');
 if(first)dialog(['— Chapter 5: The Drowned Wilds —','Orrin Vey: The Verdance isles. Jungle on top, a drowned kingdom underneath. Smells like wet socks.','Orrin Vey: Reedhaven is west of the landing, up on stilts. I\'ll keep her out of the mud.','Lyra: The fourth shard is here... and something is listening to it.']);});}
const _skyInt5=skyInteract;skyInteract=function(p){if(p.id!=='verd')return _skyInt5(p);const S=G.sky;
 if(!G.flags.wyrm){sfx('no');return toast('A violet fog boils around the jungle isles. Nothing flies through it... yet.');}sfx('ok');
 if(!S.flags.kade3)return dialog(['The violet fog parts — and a ship twice the size of the Stormbreaker rises out of it.','Captain Varra Kade: Three shards, Cinderwing. My new employer is very interested in you.','Captain Varra Kade: The Hollow King pays in something better than gold. A sky that never ends.','Mira: You sold yourself to the Hollow?!','Captain Varra Kade: I upgraded. The Black Tempest — all guns, fire!','Orrin Vey: Her crew... those aren\'t men. Brace and read her telegraphs!'],()=>startSkyBattle('tempest'));
 landVerd();};
const _finish5=finishSky;finishSky=function(){if(!(SB.k==='tempest'&&SB.end==='win'))return _finish5();const S=G.sky;S.hull=SB.hull;
 transition(()=>{SB=null;scene='skymap';S.flags.kade3=1;G.flags.kade3=1;S.mat.iron+=5;S.mat.ichor=(S.mat.ichor||0)+3;save();
  dialog(['Captain Varra Kade: No... he promised me... the sky...','(The Black Tempest\'s shadow-crew dissolves into violet smoke. Kade flees in a lifeboat.)','Lyra: She looked scared. Of him, not of us.','Orrin Vey: The fog is lifting. Press A over the jungle isle to land.']);});};
const _isle5=drawIsle;drawIsle=function(x,y,rx,ry,k){_isle5(x,y,rx,ry,k==='mire'?'dock':k);if(k==='mire'){
 for(let i=0;i<5;i++){X.fillStyle=i%2?'#1e5a28':'#2e7a34';X.beginPath();X.arc(x-18+i*9,y-8-(i%2)*4,8,0,7);X.fill();}
 X.fillStyle='#5a6a5a';X.fillRect(x+4,y-26,10,18);X.fillStyle='#3a8a3a';X.fillRect(x+4,y-26,10,3);
 X.globalAlpha=0.4+0.3*Math.sin(T*3);X.fillStyle='#a070ff';X.beginPath();X.arc(x+9,y-30,6,0,7);X.fill();X.globalAlpha=1;
 for(let i=0;i<4;i++){const p=(T*0.4+i/4)%1;X.fillStyle='#c0ff80';X.globalAlpha=0.8*(1-p);X.fillRect(x-20+i*12,y-10-p*24,1,1);}X.globalAlpha=1;}};
window.MIRE={sefaAct,hydraEvent,landVerd,MSHOP,MSMITH};
