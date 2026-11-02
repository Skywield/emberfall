'use strict';
// Emberfall — side content: a Quest Log in the field menu, 10 side quests across the seven towns (hunts, fetches and a
// personal quest each for Kael, Lyra, Mira and — only if she was trusted — Varra), and three optional painted superbosses:
// Cindral, the Buried Sun (hidden Emberdeep Grotto under Ashen Vale), the Tempest Sovereign (sky, the Eye of the Storm)
// and Omen, the Seventh Shade (post-game, the Hollow Rift at the Founders' Hearth; needs the Clear save).
// All new maps use an sq_ prefix so nothing overwrites a story map. NPCs stand clear of doors and doorsteps.
// ---------- art ----------
loadPaint('cindral','cindral');loadPaint('omen','omen_shade');
{const im=new Image();im.onload=()=>{SKYART.sovereign=im;};im.src='art/game/tempest_sovereign.png';}
EN_ART.cindral=EN_ART.boss;EN_ART.omen=EN_ART.boss;
SPR.odo=charSet({H:'#8a5a2a',h:'#a8783a',s:'#d0a080',O:'#5a7a3a',A:'#c0a060',L:'#3a2a1a',b:'#100808'});
SPR.bess=charSet({H:'#c0c0c0',h:'#e0e0e0',s:'#d0a080',O:'#3a5a8a',A:'#e0d0a0',L:'#2a2a3a',b:'#100808'});
SPR.rook=charSet({H:'#4a4a4a',h:'#6a6a6a',s:'#b08a6a',O:'#2a3a5a',A:'#d0b040',L:'#1a1a2a',b:'#100808'});
SPR.cael=charSet({H:'#e0d0b0',h:'#fff0d0',s:'#d0a080',O:'#a03a2a',A:'#ffd070',L:'#4a1a1a',b:'#100808'});
SPR.gorrim=charSet({H:'#6a3a1a',h:'#8a5a2a',s:'#a07050',O:'#5a4a3a',A:'#ff8030',L:'#2a1a10',b:'#100808'});
SPR.fen=charSet({H:'#a0c0e0',h:'#d0e8ff',s:'#e0c0a0',O:'#3a4a7a',A:'#c0e0ff',L:'#1a2040',b:'#100808'});
SPR.dill=charSet({H:'#4a6a2a',h:'#6a8a3a',s:'#c09a70',O:'#4a5a2a',A:'#a0c060',L:'#2a3a1a',b:'#100808'});
SPR.bly=charSet({H:'#a02020',h:'#c04040',s:'#b08a6a',O:'#2a1a1a',A:'#ffd070',L:'#1a1010',b:'#100808'});
SPR.senna=charSet({H:'#d0c0a0',h:'#f0e0c0',s:'#c09a80',O:'#6a4a2a',A:'#ffd070',L:'#3a2a1a',b:'#100808'});
SPR.sable=charSet({H:'#2a2a3a',h:'#4a4a5a',s:'#c0a090',O:'#3a2a4a',A:'#ff6050',L:'#1a1020',b:'#100808'});

// ---------- rewards (unique gear, never sold) ----------
Object.assign(EQ,{batcharm:{n:'Batwing Charm',slot:'a',def:8,mdef:8,p:0},galevest:{n:'Galeweave Vest',slot:'a',def:14,mdef:12,p:0},
 cindercenser:{n:'Cinder Censer',slot:'w',who:'mira',atk:20,mag:22,p:0},orrelcodex:{n:'Orrel\'s Codex',slot:'w',who:'lyra',atk:5,mag:32,p:0},
 reedcloak:{n:'Reedwoven Cloak',slot:'a',def:24,mdef:28,p:0},redgale:{n:'Red Gale Cutlass',slot:'w',who:'kael',atk:60,p:0},
 heirloom:{n:'Thornwick Heirloom',slot:'w',who:'kael',atk:74,p:0},sunmail:{n:'Buried Sun Mail',slot:'a',def:58,mdef:52,p:0},
 sunrod:{n:'Rod of the Buried Sun',slot:'w',who:'lyra',atk:14,mag:74,p:0},stormcrown:{n:'Stormcrown Crook',slot:'w',who:'mira',atk:58,mag:64,p:0},
 dawnthorn:{n:'Dawn of Thornwick',slot:'w',who:'kael',atk:100,p:0},shadeveil:{n:'Seventh Veil',slot:'a',def:70,mdef:72,p:0}});
Object.assign(ITEMS,{sunshard:{n:'Sun Shard',p:0,heal:2500,mpr:400,tgt:'P',d:'2500 HP, 400 MP'}});

// ---------- superbosses ----------
function cindralAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.flare){u.flare=1;u.atk=Math.round(u.atk*1.2);u.mag=Math.round(u.mag*1.2);return {u,kind:'buff',name:'The Sun Wakes',tg:[u]};}const r=Math.random();
 if(r<(ph?0.35:0.25))return {u,kind:'mag',name:ph?'Supernova':'Solar Flare',pow:ph?1.35:1.1,el:'fire',tg:P,fx:'fire'};
 if(r<0.6)return {u,kind:'phys',name:'Basalt Crush',pow:1.8,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function omenAI(u,P,t){const ph=u.hp<u.mhp*0.4;if(ph&&!u.seven){u.seven=1;u.atk=Math.round(u.atk*1.25);u.mag=Math.round(u.mag*1.25);u.spd+=4;return {u,kind:'buff',name:'Seven Shards Burn',tg:[u]};}const r=Math.random();
 if(r<(ph?0.4:0.28))return {u,kind:'mag',name:'Hollow Requiem',pow:ph?1.3:1.05,el:'dark',tg:P,fx:'dark'};
 if(r<0.62)return {u,kind:'phys',name:'Glass Greatsword',pow:1.9,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1.1,tg:[t],fx:'slash'};}
Object.assign(EN,{cindral:{n:'Buried Sun Cindral',hp:48000,atk:148,def:58,mag:128,spd:19,xp:12000,g:8000,weak:'ice',res:'fire',boss:1,ai:cindralAI},
 omen:{n:'The Seventh Shade',hp:95000,atk:178,def:66,mag:162,spd:23,xp:40000,g:20000,weak:'fire',res:'dark',boss:1,ai:omenAI}});
SKYEN.sovereign={n:'Tempest Sovereign',hull:14000,atk:140,spd:15,weak:'side',art:'sovereign',hollow:1,boss:1,w:{hit:3,red:2.8,purple:1.6,green:1},g:6000,xp:5000,drop:{feather:8,ichor:8},sc:1.2};

// ---------- maps (unique ids) ----------
addMap('sq_grotto',{name:'Emberdeep Grotto',dark:1,mus:'cave',bbg:'forge',rows:[
"ZZZZZZZZZZZZZZZZZZZZZZZZ",
"ZZZZZZZZZ;;;;;;ZZZZZZZZZ",
"ZZZZZZZZ;;;;;;;;ZZZZZZZZ",
"ZZZZZZZZZ;;;;;;ZZZZZZZZZ",
"ZZZZZZZZZZZ;;ZZZZZZZZZZZ",
"Zc;;;;;;ZZZ;;ZZZ;;;;;;cZ",
"Z;;ZZZ;;;;;;;;;;;;ZZZ;;Z",
"Z;;ZZZZZZZZ;;ZZZZZZZZ;;Z",
"Z;;;;;;;;;;;;;;;;;;;;;;Z",
"ZZZZZ;ZZZZZZZZZZZZ;ZZZZZ",
"ZZZZZ;;;;;;c;;;;;;;ZZZZZ",
"ZZZZZZZZZZ;;;;ZZZZZZZZZZ",
"ZZZZZZZZZZZ;;ZZZZZZZZZZZ",
"ZZZZZZZZZZZOOZZZZZZZZZZZ"],
 enc:16,pool:[['throneguard'],['hollowhound','crownbat'],['oathbound'],['umbral','mwraith'],['stalker','stalker'],['voidooze','shardling']],
 warps:[{x:11,y:13,to:'world',tx:21,ty:8,d:'left'},{x:12,y:13,to:'world',tx:21,ty:8,d:'left'}],
 chests:{'1,5':'sunshard','22,5':'crownsalve','11,10':'sunshard'}});
addMap('sq_rift',{name:'The Hollow Rift',dark:1,mus:'cave',bbg:'heart',rows:[
"%%%%%%%%%%%%%%%%%%%%",
"%%%%%%%++++++%%%%%%%",
"%%%%%%++++++++%%%%%%",
"%%%%%%%++++++%%%%%%%",
"%%%%%%%%%++%%%%%%%%%",
"%%%%%%%%%++%%%%%%%%%",
"%%%%%%++++++++%%%%%%",
"%%%%%%%%%++%%%%%%%%%",
"%%%%%%%%%OO%%%%%%%%%"],
 enc:0,warps:[{x:9,y:8,to:'hearth',tx:11,ty:10,d:'down'},{x:10,y:8,to:'hearth',tx:11,ty:10,d:'down'}]});
// the hidden vent in Ashen Vale (opens once the Buried Sun quest is taken)
const VENT={x:22,y:8};

// ---------- quest data ----------
const QUESTS=[
 {id:'bats',n:'Bats by the River',town:'Thornwick',type:'Hunt',giver:'Farmer Odo',kill:'bat',need:6,
  d:'Odo\'s orchard is being stripped by Dusk Bats. Thin them out in Ashen Vale.',reward:'Batwing Charm, 150 G',
  give:()=>{G.eq.batcharm=(G.eq.batcharm||0)+1;G.gold+=150;}},
 {id:'feathers',n:'Feathers for the Nets',town:'Galewright Point',type:'Fetch',giver:'Netmaker Bess',req:()=>!!G.sky,reqT:'You need a ship first.',
  d:'Bess needs 4 Gale Feathers (dropped by sky beasts) to weave storm-proof nets.',reward:'Galeweave Vest, 2 Hi-Potions',
  ready:()=>G.sky&&G.sky.mat.feather>=4,take:()=>{G.sky.mat.feather-=4;},prog:()=>`Gale Feathers: ${G.sky?Math.min(4,G.sky.mat.feather):0}/4`,
  give:()=>{G.eq.galevest=(G.eq.galevest||0)+1;G.items.hipotion=(G.items.hipotion||0)+2;}},
 {id:'mira',n:'Mira: The Ashen Shrine',town:'Cinderholt',type:'Personal (Mira)',giver:'Sister Cael',kill:'ewisp',need:6,who:'mira',
  d:'The wisps that swarm the Forge are the restless dead of Mira\'s old order. Lay 6 Ember Wisps to rest.',reward:'Cinder Censer (Mira)',
  give:()=>{G.eq.cindercenser=(G.eq.cindercenser||0)+1;}},
 {id:'lyra',n:'Lyra: Master Orrel\'s Journal',town:'Hollowfrost',type:'Personal (Lyra)',giver:'Archivist Fen',who:'lyra',pick:{map:'spire',x:6,y:9,n:'Orrel\'s Journal'},
  d:'Lyra\'s old master died climbing the Glacier Spire. His journal is still up there, on the west walk.',reward:'Orrel\'s Codex (Lyra)',
  give:()=>{G.eq.orrelcodex=(G.eq.orrelcodex||0)+1;}},
 {id:'lizards',n:'Mirewood Cull',town:'Reedhaven',type:'Hunt',giver:'Frogcatcher Dill',kill:'lizard',need:6,
  d:'The lizards of Mirewood have been eating Reedhaven\'s fishing lines (and fishermen). Cull 6.',reward:'Reedwoven Cloak, 3 Mire Draughts',
  give:()=>{G.eq.reedcloak=(G.eq.reedcloak||0)+1;G.items.mdraught=(G.items.mdraught||0)+3;}},
 {id:'varra',n:'Varra: Colours of the Tempest',town:'Duskhollow',type:'Personal (Varra)',giver:'Quartermaster Bly',who:'varra',pick:{map:'bastion',x:6,y:6,n:'the Black Tempest\'s colours'},
  req:()=>!!G.flags.varraT,reqT:'',
  d:'Varra\'s old flag hangs in the Eclipse Bastion as a trophy. Bring the Black Tempest\'s colours home.',reward:'Red Gale Cutlass (Kael)',
  give:()=>{G.eq.redgale=(G.eq.redgale||0)+1;}},
 {id:'kael',n:'Kael: The Last Lamp',town:'Lastlight Camp',type:'Personal (Kael)',giver:'Lamp-keeper Senna',kill:'throneguard',need:5,who:'kael',
  d:'Kael\'s grandmother\'s lamp hangs in the Citadel; its Throne Guards keep it. Break 5 of them and bring her light home.',reward:'Thornwick Heirloom (Kael)',
  give:()=>{G.eq.heirloom=(G.eq.heirloom||0)+1;}},
 {id:'grotto',n:'The Buried Sun',town:'Cinderholt',type:'Superboss',giver:'Old Miner Gorrim',req:()=>!!G.flags.hydra,reqT:'Gorrim: Come back when you\'ve got real scars. Past the Mire, say.',
  d:'A sealed vent on the east edge of Ashen Vale leads to Emberdeep Grotto, where something like a small sun is buried. Defeat it.',reward:'Rod of the Buried Sun, Buried Sun Mail',
  ready:()=>!!G.flags.cindral,prog:()=>G.flags.cindral?'Cindral defeated — tell Gorrim.':'Find the vent east of the Ashen Vale river.',
  give:()=>{G.eq.sunrod=(G.eq.sunrod||0)+1;}},
 {id:'storm',n:'Eye of the Storm',town:'Galewright Point',type:'Sky superboss',giver:'Old Captain Rook',req:()=>!!G.flags.warden&&!!G.sky,reqT:'Rook: Your tub couldn\'t survive the Eye. Not yet. Beat the eclipse first.',
  d:'A storm that never moves hides the Tempest Sovereign, the beast that ate Rook\'s fleet. Fly to the Eye of the Storm (north-east skies).',reward:'Stormcrown Crook (Mira), ship materials',
  ready:()=>!!G.flags.sovereign,prog:()=>G.flags.sovereign?'The Sovereign has fallen — tell Rook.':'Fly to the Eye of the Storm.',
  give:()=>{G.eq.stormcrown=(G.eq.stormcrown||0)+1;if(G.sky){G.sky.mat.iron=(G.sky.mat.iron||0)+6;}}},
 {id:'omen',n:'The Seventh Shade',town:'Founders\' Hearth',type:'Post-game superboss',giver:'Archivist Sable',req:()=>!!G.flags.clear,reqT:'Sable: (She stares at the cracked air.) Not while he still sits his throne.',
  d:'With the Crown settled, its shadow has torn a rift at the Hearth. Omen, the Seventh Shade, waits inside.',reward:'Dawn of Thornwick (Kael), Seventh Veil',
  ready:()=>!!G.flags.omen,prog:()=>G.flags.omen?'Omen is gone — tell Sable.':'Ask Sable to open the Hollow Rift.',
  give:()=>{G.eq.dawnthorn=(G.eq.dawnthorn||0)+1;}}];
const QBY=Object.fromEntries(QUESTS.map(q=>[q.id,q]));
function sqS(){if(!G.sq)G.sq={};return G.sq;}
function qst(id){return sqS()[id]||{s:0,n:0};}
function qReady(q){const s=qst(q.id);if(q.kill)return s.n>=q.need;if(q.pick)return !!s.got;return q.ready?q.ready():false;}
function qProg(q){const s=qst(q.id);if(s.s===2)return 'Complete.';if(q.kill)return `${EN[q.kill].n}: ${Math.min(s.n,q.need)}/${q.need}`;if(q.pick)return s.got?`Have ${q.pick.n} — return to ${q.giver}.`:`Find ${q.pick.n}.`;return q.prog?q.prog():'';}
// quest givers' lines: [intro (before accept), done-and-thanks]
const QL={
 bats:{intro:['Farmer Odo: Bats! Dusk Bats, every night, in my apples. My Tam thinks they\'re pretty. I think they\'re thieves.','Farmer Odo: Knock six of \'em out of Ashen Vale\'s sky and I\'ll give you the charm my da made from their wings.'],
  turn:['Farmer Odo: Six! The orchard\'s quiet for the first time in weeks.','Farmer Odo: Here — Batwing Charm. Light as a leaf, tough as bark.'],after:['Farmer Odo: Apples are back. Come by for pie when the world\'s saved.']},
 feathers:{intro:['Netmaker Bess: Gale Feathers. Four of \'em. The sky beasts shed them when you knock \'em out of the clouds.','Netmaker Bess: Woven into a net, they turn a gale. Woven into a vest... well, you\'ll see.'],
  turn:['Netmaker Bess: Beauties. Hold still — a few knots... there.','Netmaker Bess: Galeweave Vest. And a pair of Hi-Potions from my own shelf.'],after:['Netmaker Bess: Nets hold, gulls fed, harbor happy. Fly safe.']},
 mira:{intro:['Sister Cael: Mira? Little Mira of the Ashen Shrine? You grew up.','Mira: Sister Cael... the shrine burned. I thought everyone was gone.','Sister Cael: Not gone. Trapped. The wisps in the Forge are our sisters, child, still burning. Six of them dance nearest the anvil.','Mira: Then I\'ll sing them home. Kael, Lyra — will you come?','Kael: Always.'],
  turn:['Sister Cael: I felt them pass. Six lights, going out gently, like candles at dawn.','Mira: They were humming the shrine hymn at the end. I heard it.','Sister Cael: Take the Shrine\'s censer. It was always meant for you.'],after:['Sister Cael: Sing for them sometimes, Mira. They liked your voice best.']},
 lyra:{intro:['Archivist Fen: You\'re Orrel\'s apprentice. The fire-haired girl he never stopped talking about.','Lyra: Master Orrel... he went up the Glacier Spire and never came down.','Archivist Fen: His journal is still up there, on the west walk. He wrote to the very end. He\'d want you to read it.','Lyra: ...Then I\'ll bring him home. In words, at least.'],
  turn:['Lyra: (reading) "If Lyra reads this: stop apologising for your fire. The world is cold. Burn bright."','Mira: Lyra...','Lyra: I\'m fine. I\'m — fine. Fen, he left notes on every spell I botched.','Archivist Fen: Then bind them. Orrel\'s Codex. It\'s yours.'],after:['Archivist Fen: Burn bright, apprentice. He meant it.']},
 lizards:{intro:['Frogcatcher Dill: Mire lizards ate my nets, my boots and my brother-in-law\'s good hat.','Frogcatcher Dill: Cull six in Mirewood and I\'ll part with my best cloak. Reeds, woven tight. Swamp-proof.'],
  turn:['Frogcatcher Dill: Six! The nets\'ll last a whole week now.','Frogcatcher Dill: Reedwoven Cloak, three Mire Draughts. Don\'t drink \'em all at once.'],after:['Frogcatcher Dill: My brother-in-law still wants his hat back. Ask a lizard.']},
 varra:{intro:['Quartermaster Bly: You flew with the Captain. She told me. She don\'t tell me nothing.','Quartermaster Bly: The Eclipse lot took the Black Tempest\'s colours when they took her ship. Hung \'em in the Bastion like a trophy.','Quartermaster Bly: Captain won\'t ask. Too proud. But she\'d fly them again. West walk of the Bastion, past the first gate.'],
  turn:['Quartermaster Bly: That\'s... that\'s them. Red on black. Burnt at the edge from Galewright.','Varra Kade (stepping out of the shadows): Bly, you old gossip. You sent the Thornwick kids after my rag?','Varra Kade: ...Thank you, Kael. Truly. Take this. Red Gale Cutlass — I took it off a governor once. It likes heroes better than pirates.'],after:['Varra Kade: The colours fly again. Don\'t make a thing of it.']},
 kael:{intro:['Lamp-keeper Senna: Thornwick blood. You have her eyes — Rhosyn, the lamp-keeper. Your grandmother.','Kael: My grandmother? Nobody in Thornwick ever said her name.','Lamp-keeper Senna: Because she came UP here, to watch the heart. Her lamp hangs in the Citadel still, and the Throne Guards keep it.','Lamp-keeper Senna: Break five of them, and her light can come home.'],
  turn:['Lamp-keeper Senna: Her lamp... burning again. Rhosyn always said the founders\' last gift was a Thornwick child who would not kneel.','Kael: She knew. About me. About the seventh.','Lamp-keeper Senna: She hoped. Take her blade. The Thornwick Heirloom. It was always going to find its way back to you.'],after:['Lamp-keeper Senna: Her lamp stays lit now. So does yours.']},
 grotto:{intro:['Old Miner Gorrim: You\'ve heard the vents sing? Under Ashen Vale, east of the river, there\'s a sealed shaft. My crew cracked it, once.','Old Miner Gorrim: Down there, something like a little sun. Buried. Breathing. Cindral, we called it. Only I came back.','Old Miner Gorrim: The seal\'s weak now. Go and put it out — if you can.'],
  turn:['Old Miner Gorrim: The vents have gone quiet. You did it. You actually did it.','Old Miner Gorrim: My crew can rest. Take the rod we forged from its first ember — and the mail its heart left behind.'],after:['Old Miner Gorrim: Quiet as a grave down there now. A good grave.']},
 storm:{intro:['Old Captain Rook: Forty years I\'ve watched that storm in the north-east. It never moves. It never ends.','Old Captain Rook: Inside is the Tempest Sovereign. It ate my fleet, every ship, every friend.','Old Captain Rook: Your Cinderwing\'s the first ship I\'ve seen that might live through it. The Eye of the Storm. Please.'],
  turn:['Old Captain Rook: The storm... it\'s breaking up. I can see the sky behind it for the first time in forty years.','Old Captain Rook: My first mate\'s crook, and iron for your ship. Thank you. Thank you.'],after:['Old Captain Rook: Clear skies, Cinderwing. Clear skies.']},
 omen:{intro:['Archivist Sable: The Crown is settled, but the shard you carried for so long left a shadow.','Archivist Sable: It has torn the air here at the Hearth. Something wears that shadow like a crown: Omen, the Seventh Shade.','Archivist Sable: It is everything the seventh shard could have made of you, Kael. Will you face it?'],
  turn:['Archivist Sable: The rift is closing. The shade is gone.','Kael: It looked like me. If I\'d knelt.','Archivist Sable: But you did not. Take these: the dawn-blade and the veil it wore. They are yours by right.'],after:['Archivist Sable: The Hearth is quiet. Rest here whenever you like.']}};
function rewardDlg(q,cb){q.give();const s=sqS();s[q.id]={...qst(q.id),s:2};sfx('coin');save();dialog([...QL[q.id].turn,'Got '+q.reward+'!','— Quest complete: '+q.n+' —'],cb);}
function sqTalk(id){const q=QBY[id],s=qst(id),L=QL[id];
 if(s.s===2)return dialog(L.after);
 if(q.req&&!q.req())return dialog([q.reqT||(q.giver+': ...')]);
 if(!s.s)return dialog(L.intro,()=>choice('Take the quest "'+q.n+'"?',['Accept','Not now'],i=>{if(i)return;sqS()[id]={s:1,n:0};sfx('ok');save();
   dialog(['Quest accepted: '+q.n,'(Check MENU > Quests for progress.)'],()=>{if(id==='omen')omenOffer();});}));
 if(qReady(q)){if(q.take)q.take();return rewardDlg(q);}
 if(id==='omen')return omenOffer();
 dialog([q.giver+': '+q.d,'('+qProg(q)+')']);}
function omenOffer(){if(G.flags.omen)return;choice('Sable: Shall I open the Hollow Rift?',['Enter the rift','Not yet'],i=>{if(i)return;transition(()=>enterMap('sq_rift',10,7,'up'));});}

// ---------- NPCs (spots verified clear of doors/doorsteps by sidequest_test.js) ----------
const SQNPC={town:[{x:16,y:12,s:'odo',d:'left',q:'bats'}],harbor:[{x:2,y:8,s:'bess',d:'right',q:'feathers'},{x:14,y:6,s:'rook',d:'down',q:'storm'}],
 cinderholt:[{x:7,y:10,s:'cael',d:'up',q:'mira'},{x:17,y:9,s:'gorrim',d:'left',q:'grotto'}],hollowfrost:[{x:13,y:9,s:'fen',d:'left',q:'lyra'}],
 reedhaven:[{x:13,y:9,s:'dill',d:'left',q:'lizards'}],duskhollow:[{x:13,y:9,s:'bly',d:'left',q:'varra',only:()=>!!G.flags.varraT}],
 lastlight:[{x:13,y:9,s:'senna',d:'left',q:'kael'}],hearth:[{x:13,y:10,s:'sable',d:'up',q:'omen'}]};
for(const m in SQNPC){const add=SQNPC[m].map(n=>({...n,act:()=>sqTalk(n.q)}));const ds=Object.getOwnPropertyDescriptor(NPCS,m);const base=ds?(ds.get||(()=>ds.value)):(()=>[]);
 Object.defineProperty(NPCS,m,{get:()=>[...(base()||[]),...add.filter(n=>!n.only||n.only())],enumerable:true,configurable:true});}

// ---------- hunts: count kills of an accepted quest's target ----------
const _fwSQ=finishWin;finishWin=function(){if(B&&B.en){const s=sqS();for(const q of QUESTS)if(q.kill&&s[q.id]&&s[q.id].s===1){const n=B.en.filter(e=>e.k===q.kill).length;if(n){const was=s[q.id].n;s[q.id].n+=n;if(was<q.need&&s[q.id].n>=q.need)setTimeout(()=>toast('Quest ready: '+q.n+' — return to '+q.giver+'.'),900);}}}return _fwSQ();};

// ---------- field: pick-ups, the hidden vent, superboss events ----------
XSTEP.push(()=>{const s=sqS();
 for(const q of QUESTS)if(q.pick&&G.map===q.pick.map&&G.x===q.pick.x&&G.y===q.pick.y&&s[q.id]&&s[q.id].s===1&&!s[q.id].got){s[q.id].got=1;sfx('coin');save();
  dialog([q.id==='lyra'?'Under a drift of snow: a leather journal, its clasp shaped like a flame.':'Torn black-and-red silk, nailed to the wall like a trophy.','Found '+q.pick.n+'!','(Return to '+q.giver+' in '+q.town+'.)']);return true;}
 if(G.map==='world'&&G.x===VENT.x&&G.y===VENT.y&&s.grotto&&s.grotto.s>=1){sfx('ok');transition(()=>enterMap('sq_grotto',11,12,'up'));return true;}
 if(G.map==='sq_grotto'&&!G.flags.cindral&&G.y===3){cindralEvent();return true;}
 if(G.map==='sq_rift'&&!G.flags.omen&&G.y===3){omenEvent();return true;}return false;});
const _blkSQ=blocked;blocked=function(x,y){if(G.map==='sq_grotto'&&!G.flags.cindral&&y===2)return true;if(G.map==='sq_rift'&&!G.flags.omen&&y===2)return true;return _blkSQ(x,y);};
function cindralEvent(){dialog(['The cavern opens into a dome of glass-black rock. At its heart, a sun the size of a cart breathes in a cage of basalt.','Cindral: ...WHO DIGS? WHO WAKES THE BURIED SUN?','Lyra: It\'s fire all the way through. Ice, everyone!','Mira: Gorrim\'s crew... their lamps are still down here. Let\'s end it for them.'],()=>startBattle(['cindral'],'forge',true));}
function omenEvent(){dialog(['In the rift, a knight of smoke and red glass turns. A hollow crown floats above it.','Omen: I AM THE HEIR WHO KNELT. I AM THE CROWN YOU REFUSED.','Kael: I know what you are. I\'m still not kneeling.','Lyra: It\'s made of the Hollow. Fire burns it!'],()=>startBattle(['omen'],'heart',true));}
XWIN.cindral=()=>{G.flags.cindral=1;G.eq.sunmail=(G.eq.sunmail||0)+1;save();dialog(['The buried sun gutters, flickers... and goes out. The grotto cools to a gentle red.','Got Buried Sun Mail!','Kael: Let\'s tell Gorrim. His crew can rest now.']);};
XWIN.omen=()=>{G.flags.omen=1;G.eq.shadeveil=(G.eq.shadeveil||0)+1;save();dialog(['Omen breaks into seven red sparks, which drift into Kael\'s chest — and go quiet.','Got the Seventh Veil!','Kael: That\'s the last of him. Of it. Of me, the way I could have been.','Mira: Come on. Sable will want to know.']);};
XFENTS.push((ents,cx,cy)=>{const s=sqS();
 for(const q of QUESTS)if(q.pick&&G.map===q.pick.map&&s[q.id]&&s[q.id].s===1&&!s[q.id].got){const x=q.pick.x*16-cx+8,y=q.pick.y*16-cy+8;ents.push({y:q.pick.y*16-1,dr:()=>{for(let i=0;i<4;i++){const a=T*3+i*1.57;X.fillStyle=i%2?'#fff':'#ffe070';X.fillRect(x+Math.cos(a)*5-1,y+Math.sin(a)*3-1,2,2);}}});}
 if(G.map==='world'&&s.grotto&&s.grotto.s>=1){const x=VENT.x*16-cx,y=VENT.y*16-cy;ents.push({y:VENT.y*16-2,dr:()=>{X.fillStyle='#2a1a14';X.fillRect(x+2,y+3,12,11);X.fillStyle='#0a0606';X.fillRect(x+4,y+6,8,8);X.globalAlpha=0.5+0.4*Math.sin(T*4);X.fillStyle='#ff7030';X.fillRect(x+6,y+9,4,3);X.globalAlpha=1;}});}
 if(G.map==='sq_grotto'&&!G.flags.cindral){const bob=Math.sin(T*1.3)*1.5;ents.push({y:32,dr:()=>{if(!drawPaint('cindral',12*16-cx,3*16-cy+6+bob,{sc:0.5,alpha:0.97})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}}});}
 if(G.map==='sq_rift'&&!G.flags.omen){const bob=Math.sin(T*1.1)*2;ents.push({y:32,dr:()=>{if(!drawPaint('omen',10*16-cx,3*16-cy+6+bob,{sc:0.5,alpha:0.9})){const b=EN_ART.boss.c;X.drawImage(b,10*16-cx-b.width/2,1*16-cy-4+bob);}}});}});

// ---------- airship: the Eye of the Storm ----------
POI.push({id:'sqeye',k:'storm',n:'the Eye of the Storm',x:44,y:18,rx:20,ry:7});
const _isleSQ=drawIsle;drawIsle=function(x,y,rx,ry,k){if(k!=='storm')return _isleSQ(x,y,rx,ry,k);
 for(let i=0;i<10;i++){const a=T*0.8+i*0.63,r=18+i*2.2;X.globalAlpha=0.35;X.fillStyle=i%2?'#5a5a7a':'#8a8aa8';X.beginPath();X.arc(x+Math.cos(a)*r*0.6,y+Math.sin(a)*r*0.3-6,10,0,7);X.fill();}
 X.globalAlpha=1;if(!G.flags.sovereign&&Math.sin(T*7)>0.85){X.fillStyle='#e0d0ff';X.fillRect(x-1,y-26,2,16);X.fillRect(x+1,y-12,2,8);}};
const _skyIntSQ=skyInteract;skyInteract=function(p){if(p.id!=='sqeye')return _skyIntSQ(p);const s=sqS();
 if(G.flags.sovereign){sfx('ok');return toast('The Eye is calm now. Blue sky where the storm used to be.');}
 if(!s.storm||s.storm.s<1){sfx('no');return toast('A storm that never moves. Lightning walls you out. (Someone at Galewright may know more.)');}
 sfx('ok');dialog(['The Cinderwing plunges into the Eye. The storm closes behind you like a mouth.','Tempest Sovereign: (a roar that is also thunder)','Orrin Vey: That\'s it! That\'s what ate Rook\'s fleet! All hands — fire everything!'],()=>{startSkyBattle('sovereign');SB.varra=!!G.flags.varraT&&!!G.flags.warden;});};
const _finishSQ=finishSky;finishSky=function(){if(!(SB&&SB.k==='sovereign'&&SB.end==='win'))return _finishSQ();const S=G.sky;S.hull=SB.hull;
 transition(()=>{SB=null;scene='skymap';G.flags.sovereign=1;S.mat.feather+=8;S.mat.ichor=(S.mat.ichor||0)+8;save();
  dialog(['The Tempest Sovereign coils, crackles — and comes apart into a thousand harmless clouds.','Orrin Vey: Forty years of storm, gone. Rook\'s going to cry, you know.','Got Gale Feathers x8 and Hollow Ichor x8!','(Return to Old Captain Rook at Galewright Point.)']);});};

// ---------- Quest Log (field menu) ----------
{const i=MOPTS.indexOf('Save');MOPTS.splice(i<0?MOPTS.length-1:i,0,'Quests');}
const _updMenuSQ=updMenu;updMenu=function(u,dt){if(!u.sub&&P.a&&MOPTS[u.i]==='Quests'){sfx('ok');UI.push({k:'qlog',i:0});return;}return _updMenuSQ(u,dt);};
function qKnown(){const s=sqS();return QUESTS.filter(q=>s[q.id]&&s[q.id].s>0);}
function wrapT(s,n){const out=[];let line='';for(const w of s.split(' ')){if((line+' '+w).trim().length>n){out.push(line.trim());line=w;}else line+=' '+w;}if(line.trim())out.push(line.trim());return out;}
XUI.qlog={u:(u,dt)=>{const L=qKnown();if(P.b||P.menu||(P.a&&!L.length)){UI.pop();sfx('no');return;}if(!L.length)return;
  if(held('up',dt)){u.i=(u.i+L.length-1)%L.length;sfx('move');}if(held('down',dt)){u.i=(u.i+1)%L.length;sfx('move');}},
 d:u=>{X.fillStyle='#000a';X.fillRect(0,0,W,H);const L=qKnown(),s=sqS(),done=QUESTS.filter(q=>s[q.id]&&s[q.id].s===2).length;
  win(4,4,W-8,18);txt('QUEST LOG',10,9,'#ffd860',8);txt(`${done}/${QUESTS.length} done`,W-10,9,'#9cf',7,'right');
  win(4,24,W-8,118);if(!L.length){txt('No quests yet. Talk to townsfolk',12,34,'#bbd',7);txt('marked with a "!" in each town.',12,44,'#bbd',7);}
  const top=Math.max(0,Math.min(u.i-4,L.length-9));L.slice(top,top+9).forEach((q,j)=>{const i=top+j,st_=s[q.id].s,y=30+j*12;if(i===u.i)cursor(8,y);
   txt((st_===2?'* ':qReady(q)?'! ':'- ')+q.n,18,y,st_===2?'#7a8':qReady(q)?'#ffe060':'#fff',7);});
  const q=L[u.i];win(4,144,W-8,H-148);if(q){txt(q.town+' - '+q.type+' - '+q.giver,10,149,'#9cf',6);wrapT(q.d,48).slice(0,3).forEach((l,i)=>txt(l,10,159+i*9,'#fff',6));
   txt(qProg(q),10,188,qReady(q)&&s[q.id].s===1?'#ffe060':'#ffd0a0',7);txt('Reward: '+q.reward,10,200,'#c0ffc0',6);}}};
// a "!" over quest givers whose quest is available or ready to turn in
XFENTS.push((ents,cx,cy)=>{const list=SQNPC[G.map];if(!list)return;for(const n of list){if(n.only&&!n.only())continue;const q=QBY[n.q],s=qst(q.id);
  const show=(s.s===0&&(!q.req||q.req()))||(s.s===1&&qReady(q));if(!show)continue;const f=F.npcs.find(f=>f.q===n.q);if(!f)continue;
  ents.push({y:f.y*16+1,dr:()=>{const b=Math.sin(T*5)*1.5;txt('!',f.x*16-cx+8,f.y*16-cy-12+b,s.s===1?'#60ff80':'#ffe060',9,'center');}});}});
window.SQ={QUESTS,QL,sqTalk,qst,qReady,qProg,omenOffer,cindralEvent,omenEvent,VENT,SQNPC};
