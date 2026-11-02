'use strict';
// Emberfall — Chapter 6: Beyond the Veil. The Gloaming, a twilight realm behind the Veil: Duskhollow refuge, the Ashen Gloam, the Eclipse Bastion and the Eclipse Warden.
// Twist: the Ember Crown was never a weapon against the Hollow. It is Vorthane's own heart, broken by the first keepers. Every shard gathered rebuilds him.
// Varra Kade, abandoned by Vorthane, can be trusted (redemption) or confronted (duel).
// ---------- tiles (new letters only: earlier chapters' letters stay untouched) ----------
function duskG(g){px(g,'#2e2442',0,0,16,16);for(let i=0;i<12;i++)px(g,rnd()<.5?'#3e3058':'#241a34',rnd()*16|0,rnd()*16|0,2,1);if(rnd()<.4)px(g,'#e0a0ff',rnd()*14|0,rnd()*14|0,1,1);}
TILES.d=[tileCanvas(duskG)];
TILES.w=[tileCanvas(g=>{px(g,'#5a5068',0,0,16,16);for(let y=0;y<16;y+=4)px(g,'#443a52',0,y+3,16,1);for(let i=0;i<6;i++)px(g,'#7a6a8a',rnd()*16|0,rnd()*16|0,3,1);})];
TILES.A=[tileCanvas(g=>{duskG(g);px(g,'#1a1220',7,6,2,10);px(g,'#1a1220',3,4,4,1);px(g,'#1a1220',9,3,5,1);px(g,'#1a1220',4,2,1,3);px(g,'#1a1220',12,1,1,3);px(g,'#c070ff',13,1,1,1);})];
TILES.G=[tileCanvas(g=>{duskG(g);px(g,'#3a3448',1,3,14,13);px(g,'#5a5068',2,2,12,4);px(g,'#1e1a28',1,14,14,2);px(g,'#9a60ff',5,7,1,3);px(g,'#9a60ff',10,9,1,2);})];
TILES.k=[0,1].map(f=>tileCanvas(g=>{px(g,'#0a0618',0,0,16,16);for(let i=0;i<5;i++)px(g,'#5a3a9a',(i*5+f*3)%14,(i*3+f*4)%15,2,1);px(g,'#ffd0ff',(f*7+3)%12,9,1,1);}));
TILES.v=[tileCanvas(g=>{px(g,'#0a0618',0,0,16,16);px(g,'#4a4058',0,2,16,12);for(let x=0;x<16;x+=4)px(g,'#2a2236',x,2,1,12);px(g,'#9a60ff',0,2,16,1);})];
TILES.C=[tileCanvas(g=>{px(g,'#3a2a5a',0,0,16,16);for(let y=0;y<16;y+=3){px(g,'#24183a',0,y+2,16,1);for(let x=(y%6?1:0);x<16;x+=3)px(g,'#5a4a8a',x,y,1,2);}px(g,'#c090ff',0,0,16,1);})];
TILES.E=[tileCanvas(g=>{px(g,'#100c18',0,0,16,16);px(g,'#2a2238',1,1,6,6);px(g,'#2a2238',9,3,6,6);px(g,'#2a2238',3,9,7,6);px(g,'#6a4a9a',1,1,6,1);px(g,'#6a4a9a',9,3,6,1);px(g,'#6a4a9a',3,9,7,1);px(g,'#ffb0ff',12,12,1,2);})];
TILES.J=[tileCanvas(g=>{px(g,'#2a2436',0,0,16,16);for(let y=0;y<16;y+=8){px(g,'#18141f',0,y+7,16,1);for(let x=(y%16?4:0);x<16;x+=8)px(g,'#18141f',x,y,1,8);}for(let i=0;i<4;i++)px(g,'#6a4aa0',rnd()*15|0,rnd()*15|0,1,1);})];
['A','G','k','C','E'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('warden','eclipse_warden');
{const im=new Image();im.onload=()=>{SKYART.leviathan=im;};im.src='art/game/gloam_leviathan.png';}
EN_ART.gloomling={rows:EN_ART.slime.rows,pal:{k:'#0a0614',G:'#5a3a8a',g:'#2a1a4a',W:'#ffb0ff'}};
EN_ART.veilbat={rows:EN_ART.bat.rows,pal:{k:'#0a0614',W:'#ffd0f0',P:'#3a2a5a',r:'#ff60a0'}};
EN_ART.stalker={rows:EN_ART.goblin.rows,pal:{k:'#0a0614',G:'#4a3a6a',r:'#ff80ff',W:'#1a1028',B:'#6a5a7a'}};
EN_ART.umbral={rows:EN_ART.skeleton.rows,pal:{k:'#0a0614',W:'#b090e0'}};
EN_ART.mwraith={rows:EN_ART.wisp.rows,pal:{k:'#0a0614',Y:'#e0e0ff',W:'#ffffff',b:'#0a0614'}};
EN_ART.varra={rows:EN_ART.goblin.rows,pal:{k:'#100810',G:'#d0a080',r:'#40e0ff',W:'#2a1a2a',B:'#8a1a2a'}};
['gloomling','veilbat','stalker','umbral','mwraith','varra'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
EN_ART.warden=EN_ART.boss;
SPR.seren=charSet({H:'#d0c0f0',h:'#ffffff',s:'#b090a0',O:'#3a2a5a',A:'#e0c060',L:'#24183a',b:'#100810'});
SPR.varra=charSet({H:'#8a1a2a',h:'#c03040',s:'#d0a080',O:'#1a1a2a',A:'#c0a040',L:'#2a1a1a',b:'#100808'});
SPR.hask=charSet({H:'#3a3a4a',h:'#5a5a6a',s:'#9a7a8a',O:'#4a3a5a',A:'#a0a0c0',L:'#2a2030',b:'#100810'});
SPR.lune=charSet({H:'#e0e0ff',h:'#ffffff',s:'#c0a0b0',O:'#5a3a7a',A:'#ffd0f0',L:'#2a2040',b:'#100810'});
SPR.tib=charSet({H:'#6a4a2a',h:'#8a6a4a',s:'#b08a7a',O:'#3a4a6a',A:'#d0d0e0',L:'#2a2a3a',b:'#100810'});

// ---------- data ----------
Object.assign(ITEMS,{dusktonic:{n:'Dusk Elixir',p:480,heal:520,mpr:90,tgt:'P',d:'520 HP, 90 MP'},starsalt:{n:'Starsalt',p:600,mpr:200,tgt:'P',d:'Restore 200 MP'}});
Object.assign(EQ,{dawnbrand:{n:'Dawnbrand',slot:'w',who:'kael',atk:56,p:2900},eclipserod:{n:'Eclipse Rod',slot:'w',who:'lyra',atk:8,mag:46,p:2700},
 lunarmace:{n:'Lunar Mace',slot:'w',who:'mira',atk:35,mag:35,p:2700},gloammail:{n:'Gloamweave Mail',slot:'a',def:34,mdef:24,p:2200},
 veilcloak:{n:'Veilwalker Cloak',slot:'a',def:26,mdef:38,p:0},wardenplate:{n:'Warden\'s Plate',slot:'a',def:44,mdef:34,p:0}});
const VSHOP=['xpotion','mdraught','dusktonic','megaether','starsalt','bloom','tonic'];
const VSMITH=['dawnbrand','eclipserod','lunarmace','gloammail','tidecleaver','verdantrod','coralmace','mossmail'];
function wardenAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.eclipse){u.eclipse=1;u.atk=Math.round(u.atk*1.2);return {u,kind:'buff',name:'Total Eclipse',tg:[u]};}const r=Math.random();
 if(ph&&r<0.3)return {u,kind:'mag',name:'Hollow Crown',pow:1.3,el:'bolt',tg:P,fx:'bolt'};
 if(r<0.4)return {u,kind:'mag',name:'Dusk Nova',pow:0.9,el:'ice',tg:P,fx:'ice'};
 if(r<0.75)return {u,kind:'phys',name:'Gloam Cleave',pow:1.7,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
Object.assign(EN,{
 veilbat:{n:'Veil Bat',hp:340,atk:58,def:20,mag:24,spd:21,xp:120,g:64,weak:'fire'},
 gloomling:{n:'Gloomling',hp:520,atk:56,def:40,mag:20,spd:7,xp:130,g:80,weak:'fire',res:'ice'},
 stalker:{n:'Dusk Stalker',hp:640,atk:70,def:32,mag:12,spd:15,xp:170,g:110,weak:'bolt'},
 umbral:{n:'Umbral Knight',hp:720,atk:68,def:44,mag:14,spd:10,xp:180,g:120,weak:'fire',res:'ice'},
 mwraith:{n:'Mirror Wraith',hp:400,atk:24,def:20,mag:64,spd:17,xp:160,g:96,weak:'bolt',res:'fire',caster:1},
 varra:{n:'Varra Kade',hp:3000,atk:74,def:36,mag:30,spd:19,xp:1500,g:800,weak:'ice',boss:1},
 warden:{n:'Eclipse Warden',hp:8800,atk:80,def:38,mag:62,spd:14,xp:6000,g:4500,weak:'fire',res:'ice',boss:1,ai:wardenAI}});

// ---------- maps ----------
const vmap=(rows,tr)=>rows.map(r=>r.replace(/./g,c=>tr[c]??c));
addMap('gloam',{name:'The Ashen Gloam',mus:'world',bbg:'twilight',rows:vmap(MAPS.ashmarch.rows,{r:'G',a:'d',g:'A',L:'k',b:'v',',':'w'}),
 enc:22,pool:[['veilbat','veilbat'],['gloomling'],['stalker'],['gloomling','veilbat'],['stalker','veilbat']],
 warps:[{x:2,y:3,to:'duskhollow',tx:11,ty:10,d:'up'},{x:21,y:1,to:'bastion',tx:11,ty:13,d:'up'},{x:7,y:9,to:'__ship'}]});
addMap('duskhollow',{name:'Duskhollow',mus:'town',rows:vmap(MAPS.hollowfrost.rows,{P:'A',s:'d',j:'w',U:'C'}),
 enc:0,warps:[{x:11,y:11,to:'gloam',tx:3,ty:3,d:'right'}],doors:{'3,3':'vinn','17,3':'vsmith','8,7':'vshop'}});
addMap('bastion',{name:'The Eclipse Bastion',dark:1,mus:'cave',bbg:'twilight',rows:vmap(MAPS.forge.rows,{Z:'E',';':'J',L:'k',b:'v'}),
 enc:13,pool:[['umbral'],['stalker'],['mwraith','mwraith'],['umbral','mwraith'],['gloomling','veilbat'],['stalker','mwraith'],['umbral','umbral']],
 warps:[{x:11,y:14,to:'gloam',tx:21,ty:2,d:'down'},{x:12,y:14,to:'gloam',tx:21,ty:2,d:'down'}],
 chests:{'1,5':'veilcloak','22,5':'dusktonic','11,11':'starsalt'}});

// NPCs stand clear of every door and the tile in front of it (see doorSafe test).
NPCS.duskhollow=[
 {x:10,y:9,s:'seren',d:'right',act:()=>serenAct()},
 {x:15,y:4,s:'hask',d:'down',lines:()=>['Hask: Smithy\'s the door behind me. I forge with starlight. It\'s all we have left here.']},
 {x:5,y:4,s:'lune',d:'down',lines:()=>['Lune: The Last Lantern Inn, door on my left. 80G. Our lanterns keep the Hollow out of dreams.']},
 {x:6,y:8,s:'tib',d:'down',lines:()=>['Tib: Tib\'s Dusk Bazaar is right behind me. Starsalt for the mind, Dusk Elixir for the rest.']},
 {x:14,y:10,s:'kid',d:'left',wander:1,lines:()=>G.flags.warden?['Nell: The sky went pink for a second! Is that what a sunrise is?']:['Nell: The sun here never comes up. Mama says it got eaten.','Nell: The big knight on the black tower has a sun for a hat.']},
 {x:4,y:9,s:'varra',d:'right',act:()=>varraAct()},
 {x:13,y:2,s:'guard',d:'down',lines:()=>['Lantern-watch: The Ashen Gloam is east. Stay on the old road, the shadows lie.','Lantern-watch: The Eclipse Bastion is the black tower to the north-east.']}];

// ---------- story ----------
function serenAct(){if(G.flags.warden){if(!G.flags.serengift){G.flags.serengift=1;G.gold+=1800;G.items.dusktonic=(G.items.dusktonic||0)+3;G.eq.wardenplate=(G.eq.wardenplate||0)+1;sfx('coin');
  return dialog(['Keeper Seren: The Warden\'s eclipse is broken. For a moment, Duskhollow saw dawn.','Keeper Seren: Hask reforged its plate. Wear it — it was made to stand against Vorthane, once.','Got 1800 G, Dusk Elixir x3 and Warden\'s Plate!','Keeper Seren: Five shards. Two remain... and he is closer to whole than ever. Choose carefully what you carry.']);}
  return dialog(['Keeper Seren: The last two shards lie in Vorthane\'s own throne. We will be ready when you are.']);}
 if(G.flags.seren)return dialog(['Keeper Seren: The Bastion gate is north-east. The Duskkey will open it.']);
 G.flags.seren=1;dialog(['Keeper Seren: Embers, beyond the Veil... I am Seren, last of the Lantern-keepers. Welcome to the Gloaming.','Keeper Seren: You believe you are rebuilding the Ember Crown to destroy the Hollow King. I am sorry.','Keeper Seren: The Crown is Vorthane\'s heart. A thousand years ago the first keepers tore it from him and broke it in seven.','Lyra: ...That\'s why the shards whisper. They\'re not calling for help. They\'re calling HIM.','Keeper Seren: Each shard you gather, he grows more whole. He let you win at the Sanctum. He needs you to carry them.','Kael: Then we stop carrying them for him. We find a way to unmake that heart for good.','Keeper Seren: The Eclipse Warden guards the fifth shard and the gate to his throne. Only one hand can break a heart: the one that holds it. Take the Duskkey.','Got the Duskkey!']);}
function varraAct(){if(G.flags.varra)return dialog(G.flags.varraT?['Varra Kade: I\'ll fly the Cinderwing\'s flank when the time comes. Don\'t make me regret it, Thornwick.']:['Varra Kade: You won, kid. I\'ll stay out of your sky.']);
 dialog(['Varra Kade (bruised, sitting by the lantern): Go on. Laugh. He threw me away the moment I lost the Tempest.','Varra Kade: He promised me a sky without an end. He meant a sky with nobody in it.','Mira: You sold the whole world, Varra.','Varra Kade: I know the Bastion\'s back door. I know where the Warden sleeps. Take it or leave it.'],
  ()=>choice('Varra Kade',['Trust her','Confront her'],i=>{if(i===0){G.flags.varra=1;G.flags.varraT=1;G.eq.dawnbrand=(G.eq.dawnbrand||0)+1;sfx('coin');save();
   dialog(['Kael: Everyone deserves one way back. This is yours.','Varra Kade: ...Nobody\'s said that to me since I was twelve. Here — the Dawnbrand. Stole it from his armory.','Got the Dawnbrand!','Varra Kade: The Warden is weak to fire, and it gets angry when it bleeds. Hit hard, then hit harder.']);}
  else dialog(['Kael: You led the Hollow to Reedhaven. You don\'t get to walk away.','Varra Kade: Then let\'s settle it, Thornwick. Cutlass to sword.'],()=>startBattle(['varra'],'twilight',true));}));}
XWIN.varra=()=>{G.flags.varra=1;save();dialog(['Varra Kade drops to one knee, laughing through split lips.','Varra Kade: Fine. FINE. Take the back door, then. Warden\'s weak to fire.','Varra Kade: And... sorry. About all of it.']);};
function wardenEvent(){dialog(['An eclipsed sun burns above the throne. Four wings unfold from the dark.','Eclipse Warden: THE KEEPERS\' CHILDREN. CARRYING HIS HEART TO HIS DOOR. HOW OBEDIENT.','Vorthane (from the shards): Kael. My heir. Your blood broke me once. Now it brings me home.','Kael: ...Heir?','Lyra: Kael — the keepers were Thornwick\'s founders. He\'s saying you\'re one of them.','Kael: Then I\'m the hand that holds the heart. Fire, everyone!'],()=>startBattle(['warden'],'twilight',true));}
XWIN.warden=()=>{G.flags.warden=1;save();dialog(['The Eclipse Warden shatters. For one breath, a pale dawn spills across the Gloaming.','Mira: The fifth shard. It\'s... beating.','Vorthane: Five. My throne is open, heir. Bring me the last two — or watch me take them.',G.flags.varraT?'Varra Kade (running in): The Black Tempest\'s wreck still flies. I\'ll get you to his throne. My debt.':'Lyra: We do this without Varra, then. Without anyone.','Kael: No more running errands for a dead king. Next time, we end him.','— Chapter 6 complete: Beyond the Veil —'],
 ()=>choice('Chapter 6 complete. View the chapter summary?',['Summary','Keep playing'],i=>{if(i===0)transition(()=>{scene='ending';});}));};
XSTEP.push(()=>{
 if(G.map==='gloam'&&G.x===21&&G.y===1&&!G.flags.seren){G.y=2;G.d='down';dialog(['A gate of black glass, stamped with an eclipse. It will not open. Someone in the refuge must hold its key.']);return true;}
 if(G.map==='bastion'&&!G.flags.warden&&G.y===3){wardenEvent();return true;}return false;});
const _blk6=blocked;blocked=function(x,y){if(G.map==='bastion'&&!G.flags.warden&&y===2&&x>=9&&x<=14)return true;return _blk6(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='bastion'&&!G.flags.warden){const bob=Math.sin(T*1.2)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('warden',12*16-cx,3*16-cy+6+bob,{sc:0.5,alpha:0.97})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<5;i++){const p=(T*0.5+i/5)%1;X.globalAlpha=0.7*(1-p);X.fillStyle=i%2?'#ffd0ff':'#9a60ff';X.fillRect(12*16-cx-14+i*7,3*16-cy-p*34,2,2);}X.globalAlpha=1;}});}});
XDOOR.vinn=()=>choice('Lune: A lantern-lit bed and a dreamless sleep for 80G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<80)return toast('Not enough gold.');G.gold-=80;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});
XDOOR.vshop=()=>openShop({stock:VSHOP,n:'Tib\'s Dusk Bazaar',who:'Tib'});
XDOOR.vsmith=()=>openShop({stock:VSMITH,n:'Hask\'s Starlight Forge',who:'Hask'});

// ---------- airship: through the Veil — the Nightfall Dreadnought and roaming Gloam Leviathans ----------
Object.assign(SKYEN,{
 leviathan:{n:'Gloam Leviathan',hull:2000,atk:88,spd:12,weak:'back',art:'leviathan',hollow:1,w:{hit:3,red:2.2,purple:1,green:1.4},g:460,xp:300,drop:{feather:2,ichor:3},sc:0.95},
 nightfall:{n:'Nightfall Dreadnought',hull:4600,atk:104,spd:12,weak:'front',art:'corsair',pirate:1,boss:1,w:{hit:3,red:2.6,purple:1.4,green:1.2},g:2800,xp:1800,drop:{iron:6,ichor:4},sc:1.3}});
POI.push({id:'gloaming',k:'veil',n:'Duskhollow (the Gloaming)',x:11,y:9,rx:22,ry:8});
const _roll6=rollSkyEnemy;rollSkyEnemy=function(){const S=G.sky;if(G.flags.hydra&&S.x<15*16&&S.y<13*16&&Math.random()<0.65)return 'leviathan';return _roll6();};
const _enter6=enterMap;enterMap=function(name,x,y,d){if(name==='__ship'&&G.map==='gloam'){if(!G.sky)return toast('No ship.');return startSkyMap(POI.find(p=>p.id==='gloaming'));}return _enter6(name,x,y,d);};
function landGloam(){const first=!G.flags.gloaming;G.flags.gloaming=1;transition(()=>{scene='map';enterMap('gloam',7,8,'up');
 if(first)dialog(['— Chapter 6: Beyond the Veil —','Orrin Vey: So this is what\'s behind the Veil. A sun that\'s gone out and a sky the colour of a bruise.','Orrin Vey: There are lanterns to the west. People, living here. Go — I\'ll keep the engines warm.','Lyra: The shards are... warm. Happy. I don\'t like that at all.']);});}
const _skyInt6=skyInteract;skyInteract=function(p){if(p.id!=='gloaming')return _skyInt6(p);const S=G.sky;
 if(!G.flags.hydra){sfx('no');return toast('Only ruins and silence beyond the Veil... for now.');}sfx('ok');
 if(!S.flags.nightfall)return dialog(['The Veil tears open. A sun-eaten sky — and a black dreadnought hanging in it.','Hollow Admiral: The Hollow King sends his regards, embers. And his thanks, for the shards.','(A lifeboat dangles from the dreadnought\'s keel. Someone in red is chained inside it.)','Mira: That\'s Varra! They\'re dumping her!','Orrin Vey: Then we sink the big one and catch the small one. Battle stations!'],()=>startSkyBattle('nightfall'));
 landGloam();};
const _finish6=finishSky;finishSky=function(){if(!(SB.k==='nightfall'&&SB.end==='win'))return _finish6();const S=G.sky;S.hull=SB.hull;
 transition(()=>{SB=null;scene='skymap';S.flags.nightfall=1;G.flags.nightfall=1;S.mat.iron+=6;S.mat.ichor=(S.mat.ichor||0)+4;save();
  dialog(['The Nightfall Dreadnought breaks apart into violet ash.','(Orrin swings the Cinderwing under the falling lifeboat. Varra Kade tumbles onto the deck.)','Varra Kade: ...Don\'t look at me like that. Just — drop me somewhere with lanterns.','Orrin Vey: There\'s a refuge below. Press A over the twilight isle to land.']);});};
const _isle6=drawIsle;drawIsle=function(x,y,rx,ry,k){_isle6(x,y,rx,ry,k==='veil'?'dock':k);if(k==='veil'){
 X.fillStyle='#2a1e3a';X.beginPath();X.moveTo(x-18,y-2);X.lineTo(x-10,y-22);X.lineTo(x-2,y-2);X.fill();X.fillStyle='#120a1a';X.fillRect(x+4,y-30,8,28);X.fillStyle='#9a60ff';X.fillRect(x+6,y-26,4,2);
 X.globalAlpha=0.5+0.3*Math.sin(T*2);X.fillStyle='#ffd070';for(let i=0;i<3;i++)X.fillRect(x-16+i*6,y-6,2,2);X.globalAlpha=1;
 X.strokeStyle='#e0b0ff';X.globalAlpha=0.6;X.beginPath();X.arc(x+8,y-38,7,0,7);X.stroke();X.globalAlpha=1;}};
window.VEIL={serenAct,varraAct,wardenEvent,landGloam,VSHOP,VSMITH};
