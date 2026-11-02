'use strict';
// Emberfall — the Wayfarer expansion: optional content reached by airship, meant to stretch the main road and give
// completionists a long tail. Loaded after sidequests.js; every new map, item and flag uses an ex_ prefix / G.ex so no
// story data is touched.
//  * 3 optional towns (inn, shop, NPCs; nobody stands on a door or its doorstep):
//      Saltmere (fishing village, after Ch3), Valorgate (colosseum city, after Ch4), Lanternhaven (lantern town, after Ch5)
//  * 4 optional dungeons, each with a puzzle, treasure and a painted boss tuned to the balance.js curve
//    (see tools/balance_sim.js --optional):
//      Tidewater Grotto  — tide-plates pressed in the order of the carving (moon, shell, star)  -> Brine Colossus  (~Lv17)
//      Clockwork Vault   — four levers, each turns its own gear and the next; light every lamp  -> Brass Sentinel  (~Lv23)
//      Lantern Catacombs — five braziers in a ring; lighting one flips it and both neighbours   -> Lantern Queen   (~Lv29)
//      Starfall Observatory (sky, after Ch7) — turn three star-mirrors to match the constellations -> Starfall Seer (~Lv37)
//  * 3 minigames: Fishing (Saltmere sea / Lanternhaven pond, 8 species + fish log rewards),
//    Ember Triad (a 3x3 card game, 20 cards, 5 opponents), and the Valorgate Colosseum (4 ranks, champion Vasska).
//  * MENU > Records: a completion tracker for all of the above.
const EXS=()=>G.ex||(G.ex={fish:{},log:{},cards:{},beat:{},arena:0,pz:{},seen:{},got:{}});

// ---------- tiles ----------
function sandG(g){px(g,'#d8c08a',0,0,16,16);for(let i=0;i<10;i++)px(g,rnd()<.5?'#c8ac74':'#e8d4a4',rnd()*16|0,rnd()*16|0,2,1);if(rnd()<.3)px(g,'#f0e8e0',rnd()*14|0,rnd()*14|0,1,1);}
function caveF(g,a,b,c){px(g,a,0,0,16,16);for(let i=0;i<9;i++)px(g,rnd()<.5?b:c,rnd()*16|0,rnd()*16|0,2,1);}
function caveW(g,a,b,c){px(g,a,0,0,16,16);px(g,b,1,1,6,6);px(g,b,9,3,6,6);px(g,b,3,9,7,6);px(g,c,1,1,6,1);px(g,c,9,3,6,1);px(g,c,3,9,7,1);}
Object.assign(TILES,{
 '<':[tileCanvas(sandG)],
 '>':[tileCanvas(g=>{px(g,'#2a5ab8',0,0,16,16);px(g,'#9a7448',1,0,14,16);for(let y=0;y<16;y+=4)px(g,'#6a4a2a',1,y+3,14,1);px(g,'#5a3a1a',1,0,1,16);px(g,'#5a3a1a',14,0,1,16);})],
 '(':[tileCanvas(g=>{px(g,'#c8a878',0,0,16,16);for(let y=0;y<16;y+=5)px(g,'#a88858',0,y+4,16,1);px(g,'#8a6a40',3,6,4,8);px(g,'#8a6a40',10,6,4,8);px(g,'#3a2a1a',4,8,2,6);px(g,'#3a2a1a',11,8,2,6);px(g,'#e0c898',0,0,16,1);})],
 '1':[tileCanvas(g=>caveF(g,'#2a3a48','#344a5a','#22303c'))],
 '2':[tileCanvas(g=>caveW(g,'#101a24','#1e3040','#3a6070'))],
 '3':[tileCanvas(g=>{caveF(g,'#2a3a48','#344a5a','#22303c');px(g,'#5a6a7a',2,2,12,12);px(g,'#7a8a9a',3,3,10,10);px(g,'#4a5a6a',3,12,10,1);})],
 '4':[tileCanvas(g=>{caveF(g,'#2a3a48','#344a5a','#22303c');px(g,'#3a4a5a',2,3,12,11);px(g,'#60e0d0',4,5,8,7);px(g,'#a0fff0',6,7,4,3);})],
 '5':[tileCanvas(g=>{px(g,'#14181c',0,0,16,16);for(let x=1;x<16;x+=4){px(g,'#7a7a6a',x,0,2,16);px(g,'#b0b098',x,0,1,16);}px(g,'#5a5a4a',0,3,16,2);px(g,'#5a5a4a',0,11,16,2);})],
 '6':[tileCanvas(g=>{caveW(g,'#3a2a14','#5a4220','#8a6a30');px(g,'#2a2a2a',6,6,4,8);px(g,'#8a8a8a',7,2,2,8);px(g,'#ff5040',6,1,4,3);})],
 '7':[tileCanvas(g=>{caveW(g,'#3a2a14','#5a4220','#8a6a30');px(g,'#2a2a2a',6,6,4,8);px(g,'#8a8a8a',7,6,2,8);px(g,'#60ff70',6,12,4,3);px(g,'#ffe060',2,2,3,3);px(g,'#ffe060',11,2,3,3);})],
 '8':[tileCanvas(g=>{px(g,'#4a3a24',0,0,16,16);px(g,'#5a4a2e',0,0,8,8);px(g,'#5a4a2e',8,8,8,8);px(g,'#3a2c1a',0,7,16,1);px(g,'#3a2c1a',7,0,1,16);px(g,'#c09040',3,3,1,1);px(g,'#c09040',12,12,1,1);})],
 '9':[tileCanvas(g=>{caveW(g,'#3a2a14','#5a4220','#8a6a30');px(g,'#c09040',4,4,3,3);px(g,'#c09040',10,10,3,3);})],
 '0':[tileCanvas(g=>{px(g,'#2a2a30',0,0,16,16);for(let y=0;y<16;y+=8){px(g,'#1c1c22',0,y+7,16,1);for(let x=(y%16?4:0);x<16;x+=8)px(g,'#1c1c22',x,y,1,8);}if(rnd()<.4)px(g,'#d8d0b0',rnd()*13|0,rnd()*13|0,3,1);})],
 '!':[tileCanvas(g=>{caveW(g,'#141018','#24202c','#3a3448');px(g,'#d8d0b0',5,10,2,2);px(g,'#d8d0b0',10,4,2,2);})],
 '$':[tileCanvas(g=>{px(g,'#2a2a30',0,0,16,16);px(g,'#4a4a52',4,8,8,7);px(g,'#6a6a72',3,7,10,2);px(g,'#1a1a1e',5,4,6,3);})],
 '&':[0,1].map(f=>tileCanvas(g=>{px(g,'#2a2a30',0,0,16,16);px(g,'#4a4a52',4,8,8,7);px(g,'#6a6a72',3,7,10,2);px(g,'#ff8030',4,3-f,8,5+f);px(g,'#ffe060',6,2+f,4,4);px(g,'#ffffff',7,4,2,2);})),
 '?':[tileCanvas(g=>{px(g,'#141a3a',0,0,16,16);for(let i=0;i<5;i++)px(g,rnd()<.5?'#e0e8ff':'#8090d0',rnd()*16|0,rnd()*16|0,1,1);px(g,'#24305a',0,15,16,1);px(g,'#24305a',15,0,1,16);})],
 '|':[tileCanvas(g=>{px(g,'#2a2048',0,0,16,16);px(g,'#3a3060',1,1,14,6);px(g,'#3a3060',1,9,14,6);px(g,'#c0a040',0,7,16,1);px(g,'#c0a040',0,15,16,1);})],
 '@':[tileCanvas(g=>{px(g,'#141a3a',0,0,16,16);px(g,'#6a5a30',4,11,8,4);px(g,'#c0a040',5,10,6,2);px(g,'#8a7a40',7,4,2,7);})]});
['(','2','5','6','7','9','!','$','&','|','@'].forEach(t=>SOLID.add(t));

// ---------- art ----------
loadPaint('colossus','brine_colossus');loadPaint('sentinel','brass_sentinel');loadPaint('lqueen','lantern_queen');loadPaint('seer','starfall_seer');loadPaint('vasska','champion_vasska');
['colossus','sentinel','lqueen','seer','vasska'].forEach(k=>EN_ART[k]=EN_ART.boss);
const RC=(k,base,pal)=>{EN_ART[k]={rows:EN_ART[base].rows,pal};EN_ART[k].c=mkSpr(EN_ART[k].rows,pal);};
RC('reefcrab','goblin',{k:'#1a0a0a',G:'#d0603a',r:'#80fff0',W:'#4a1a10',B:'#e0c080'});
RC('tidewisp','wisp',{k:'#06141a',Y:'#40d0e0',W:'#e0ffff',b:'#06141a'});
RC('brineslime','slime',{k:'#0a1a20',G:'#3a8aa0',g:'#205a70',W:'#c0f0ff'});
RC('cogbat','bat',{k:'#1a1208',W:'#d0a040',P:'#7a5a20',r:'#ff6030'});
RC('gearknight','skeleton',{k:'#1a1408',W:'#e0b050'});
RC('sparkling','wisp',{k:'#141008',Y:'#ffe040',W:'#ffffff',b:'#141008'});
RC('lampghost','wisp',{k:'#0a1408',Y:'#a0ff70',W:'#f0fff0',b:'#0a1408'});
RC('boneknight','skeleton',{k:'#100c14',W:'#d8d0b0'});
RC('gravemoth','bat',{k:'#100c14',W:'#a0a0c0',P:'#4a4a6a',r:'#a0ff70'});
RC('starmoth','bat',{k:'#080a1a',W:'#a0b0ff',P:'#3a3a8a',r:'#ffe060'});
RC('voidling','slime',{k:'#06040e',G:'#4a2a8a',g:'#2a1a5a',W:'#e0c0ff'});
RC('astral','wisp',{k:'#080a1a',Y:'#80a0ff',W:'#ffffff',b:'#080a1a'});
SPR.nell=charSet({H:'#3a2a1a',h:'#5a4a2a',s:'#c08a60',O:'#2a5a8a',A:'#e0e0e0',L:'#2a2a3a',b:'#100808'});
SPR.tobin=charSet({H:'#e0e0e0',h:'#ffffff',s:'#b07a50',O:'#8a6a2a',A:'#ffd070',L:'#3a2a1a',b:'#100808'});
SPR.quill=charSet({H:'#202a4a',h:'#3a4a7a',s:'#d0a080',O:'#e0e0e0',A:'#2a5ab8',L:'#1a1a2a',b:'#100808'});
SPR.mara=charSet({H:'#a04a2a',h:'#c06a3a',s:'#e0b090',O:'#6a3a5a',A:'#ffd070',L:'#2a1a2a',b:'#100808'});
SPR.dov=charSet({H:'#2a2a2a',h:'#4a4a4a',s:'#9a6a4a',O:'#5a3a2a',A:'#c0c0c0',L:'#2a1a10',b:'#100808'});
SPR.herald=charSet({H:'#d0a040',h:'#ffd060',s:'#c09070',O:'#a02020',A:'#ffd070',L:'#3a1010',b:'#100808'});
SPR.rusk=charSet({H:'#6a6a6a',h:'#8a8a8a',s:'#c09a70',O:'#3a6a3a',A:'#ffe060',L:'#1a2a1a',b:'#100808'});
SPR.ada=charSet({H:'#c06030',h:'#e08050',s:'#e0c0a0',O:'#7a5a2a',A:'#c09040',L:'#3a2a10',b:'#100808'});
SPR.oriel=charSet({H:'#f0f0ff',h:'#ffffff',s:'#d0b090',O:'#4a2a6a',A:'#ffd070',L:'#1a1030',b:'#100808'});
SPR.pell=charSet({H:'#e0c060',h:'#ffe080',s:'#e0c0a0',O:'#3a7a5a',A:'#ffffff',L:'#1a3a2a',b:'#100808'});
SPR.marg=charSet({H:'#4a4a5a',h:'#6a6a7a',s:'#c0a090',O:'#1a1a2a',A:'#a0ff70',L:'#0a0a1a',b:'#100808'});
SPR.ivo=charSet({H:'#7a5a3a',h:'#9a7a5a',s:'#c09070',O:'#3a3a5a',A:'#ffb040',L:'#1a1a2a',b:'#100808'});
SPR.shade=charSet({H:'#a0b0c0',h:'#d0e0f0',s:'#b0c0d0',O:'#4a5a6a',A:'#80fff0',L:'#2a3a4a',b:'#101820'});

// ---------- data ----------
Object.assign(ITEMS,{seasalt:{n:'Sea-Salt Tonic',p:140,heal:220,mpr:30,tgt:'P',d:'220 HP, 30 MP'},lanternoil:{n:'Lantern Oil',p:420,heal:600,mpr:80,tgt:'P',d:'600 HP, 80 MP'}});
Object.assign(EQ,{
 // dungeon treasure / boss drops (never sold) — a step above the shop gear of the chapter they unlock in
 pearlrod:{n:'Pearl Rod',slot:'w',who:'lyra',atk:4,mag:30,p:0},brinecleaver:{n:'Brinecleaver',slot:'w',who:'kael',atk:40,p:0},shellmail:{n:'Shellplate',slot:'a',def:24,mdef:18,p:0},
 cogmace:{n:'Cogwork Mace',slot:'w',who:'mira',atk:32,mag:32,p:0},clockblade:{n:'Clockspring Blade',slot:'w',who:'kael',atk:52,p:0},brassplate:{n:'Brass Aegis',slot:'a',def:32,mdef:26,p:0},
 lanternrod:{n:'Lantern Staff',slot:'w',who:'lyra',atk:9,mag:52,p:0},gravelight:{n:'Gravelight Censer',slot:'w',who:'mira',atk:46,mag:48,p:0},wraithshroud:{n:'Wraith Shroud',slot:'a',def:36,mdef:44,p:0},
 astrolabe:{n:'Astrolabe Rod',slot:'w',who:'lyra',atk:13,mag:68,p:0},starfallblade:{n:'Starfall Blade',slot:'w',who:'kael',atk:82,p:0},cosmosmail:{n:'Cosmos Mail',slot:'a',def:58,mdef:56,p:0},
 // minigame prizes
 anglercharm:{n:'Angler\'s Charm',slot:'a',def:18,mdef:18,p:0},tiderod:{n:'Leviathan Rod',slot:'w',who:'lyra',atk:12,mag:62,p:0},
 lionmail:{n:'Lionhide Vest',slot:'a',def:22,mdef:14,p:0},gladius:{n:'Valor Gladius',slot:'w',who:'kael',atk:50,p:0},
 victorrod:{n:'Victor\'s Rod',slot:'w',who:'lyra',atk:9,mag:56,p:0},victormace:{n:'Victor\'s Mace',slot:'w',who:'mira',atk:46,mag:46,p:0},
 vasskapride:{n:'Vasska\'s Pride',slot:'w',who:'kael',atk:88,p:0},lionheart:{n:'Lionheart Mail',slot:'a',def:62,mdef:58,p:0},
 gildedmail:{n:'Gilded Ember Coat',slot:'a',def:40,mdef:40,p:0},jokercrook:{n:'Joker\'s Crook',slot:'w',who:'mira',atk:54,mag:58,p:0},
 // town shops
 saltcutlass:{n:'Salt Cutlass',slot:'w',who:'kael',atk:36,p:1250},coralwand:{n:'Coral Wand',slot:'w',who:'lyra',atk:4,mag:29,p:1120},
 brasscrook:{n:'Brass Crook',slot:'w',who:'mira',atk:29,mag:29,p:1760},arenamail:{n:'Arena Mail',slot:'a',def:28,mdef:18,p:1500},
 lampcoat:{n:'Lamplit Coat',slot:'a',def:30,mdef:32,p:2900}});
const EXSHOP={salt:['potion','hipotion','xpotion','seasalt','ether','hiether','bloom','tonic','coralwand'],
 saltsmith:['saltcutlass','coralwand','sunbrand','stormrod','auroramace','rimemail'],
 valor:['xpotion','mdraught','megaether','bloom','tonic','brasscrook','arenamail','tidecleaver','mossmail'],
 lantern:['mdraught','lanternoil','dusktonic','megaether','starsalt','bloom','tonic','lampcoat','eclipserod']};

// ---------- enemies + bosses ----------
Object.assign(EN,{
 reefcrab:{n:'Reef Crab',hp:430,atk:48,def:28,mag:8,spd:9,xp:112,g:70,weak:'bolt',res:'ice'},
 tidewisp:{n:'Tide Wisp',hp:300,atk:20,def:16,mag:46,spd:13,xp:106,g:64,weak:'bolt',res:'fire',caster:1},
 brineslime:{n:'Brine Slime',hp:470,atk:44,def:30,mag:12,spd:6,xp:102,g:60,weak:'bolt'},
 cogbat:{n:'Cog Bat',hp:430,atk:60,def:22,mag:20,spd:20,xp:158,g:90,weak:'bolt'},
 gearknight:{n:'Gear Knight',hp:760,atk:68,def:42,mag:12,spd:9,xp:182,g:104,weak:'bolt',res:'fire'},
 sparkling:{n:'Sparkling',hp:440,atk:24,def:20,mag:64,spd:15,xp:170,g:96,weak:'ice',res:'bolt',caster:1},
 lampghost:{n:'Lamp Ghost',hp:680,atk:30,def:26,mag:78,spd:16,xp:236,g:122,weak:'fire',res:'ice',caster:1},
 boneknight:{n:'Ossuary Knight',hp:1040,atk:84,def:50,mag:14,spd:10,xp:256,g:132,weak:'fire'},
 gravemoth:{n:'Grave Moth',hp:700,atk:78,def:30,mag:40,spd:21,xp:228,g:118,weak:'fire'},
 starmoth:{n:'Star Moth',hp:940,atk:94,def:40,mag:60,spd:22,xp:336,g:152,weak:'ice'},
 voidling:{n:'Voidling',hp:1340,atk:90,def:58,mag:30,spd:8,xp:344,g:160,weak:'bolt'},
 astral:{n:'Astral Eye',hp:920,atk:40,def:40,mag:98,spd:18,xp:362,g:170,weak:'fire',res:'bolt',caster:1}});
function colossusAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.tide){u.tide=1;u.def=Math.round(u.def*1.3);return {u,kind:'buff',name:'High Tide Shell',tg:[u]};}const r=Math.random();
 if(r<(ph?0.32:0.22))return {u,kind:'mag',name:'Riptide',pow:ph?1.15:0.95,el:'ice',tg:P,fx:'ice'};
 if(r<0.6)return {u,kind:'phys',name:'Pincer Crush',pow:1.6,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function sentinelAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.over){u.over=1;u.spd+=4;u.atk=Math.round(u.atk*1.15);return {u,kind:'buff',name:'Overclock',tg:[u]};}const r=Math.random();
 if(r<(ph?0.33:0.24))return {u,kind:'mag',name:'Steam Burst',pow:ph?1.15:0.95,el:'fire',tg:P,fx:'fire'};
 if(r<0.62)return {u,kind:'phys',name:'Cog Halberd',pow:1.65,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function lqueenAI(u,P,t){const ph=u.hp<u.mhp*0.45;if(ph&&!u.lit){u.lit=1;u.hp=Math.min(u.mhp,u.hp+Math.round(u.mhp*0.08));u.mag=Math.round(u.mag*1.15);return {u,kind:'buff',name:'Hundred Lanterns',tg:[u]};}const r=Math.random();
 if(r<(ph?0.42:0.34))return {u,kind:'mag',name:'Corpse-light',pow:ph?1.15:1.0,el:'ice',tg:P,fx:'ice'};
 if(r<0.62)return {u,kind:'mag',name:'Soul Wick',pow:1.5,el:'fire',tg:[t],fx:'fire'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function seerAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.fall){u.fall=1;u.atk=Math.round(u.atk*1.15);u.mag=Math.round(u.mag*1.15);return {u,kind:'buff',name:'The Sky Falls',tg:[u]};}const r=Math.random();
 if(r<(ph?0.36:0.26))return {u,kind:'mag',name:ph?'Starfall':'Meteor Rain',pow:ph?1.2:1.0,el:'bolt',tg:P,fx:'bolt'};
 if(r<0.6)return {u,kind:'phys',name:'Orbit Lash',pow:1.7,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1,tg:[t],fx:'slash'};}
function vasskaAI(u,P,t){const ph=u.hp<u.mhp*0.4;if(ph&&!u.roar){u.roar=1;u.atk=Math.round(u.atk*1.2);return {u,kind:'buff',name:'Lion\'s Roar',tg:[u]};}const r=Math.random();
 if(r<0.22)return {u,kind:'mag',name:'Blazing Arc',pow:ph?1.1:0.9,el:'fire',tg:P,fx:'fire'};
 if(r<0.6)return {u,kind:'phys',name:'Champion\'s Cleave',pow:1.75,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1.05,tg:[t],fx:'slash'};}
Object.assign(EN,{
 colossus:{n:'Brine Colossus',hp:8400,atk:70,def:26,mag:56,spd:11,xp:2400,g:1800,weak:'bolt',res:'ice',boss:1,ai:colossusAI},
 sentinel:{n:'Brass Sentinel',hp:13400,atk:88,def:34,mag:68,spd:13,xp:4600,g:3400,weak:'bolt',res:'fire',boss:1,ai:sentinelAI},
 lqueen:{n:'The Lantern Queen',hp:20500,atk:108,def:36,mag:100,spd:15,xp:6800,g:4800,weak:'fire',res:'ice',boss:1,ai:lqueenAI},
 seer:{n:'The Starfall Seer',hp:31000,atk:136,def:50,mag:116,spd:16,xp:11000,g:8000,weak:'ice',res:'bolt',boss:1,ai:seerAI},
 vasska:{n:'Grand Champion Vasska',hp:27000,atk:130,def:48,mag:84,spd:17,xp:9000,g:0,weak:'ice',res:'fire',boss:1,ai:vasskaAI}});

// ---------- maps ----------
addMap('ex_saltmere',{name:'Saltmere',mus:'town',rows:[
"TTTTTTTTT,,TTTTTTTTT",
"T<<<<<<<<,,<<<<<<<<T",
"T<RRRR<<<,,<<<RRRR<T",
"T<RRRR<<<,,<<<RRRR<T",
"T<WDWW<<<,,<<<WWDW<T",
"T<<,<<<<<,,<<<<<,<<T",
"T<<,,,,,,,,,,,,,,<<T",
"T<<<<<<<<,<<<<<<<<<O",
"T<<<<<<<<,<<<<<<<<<T",
"T<<RRRR<<,<<<<<<<<<T",
"T<<RRRR<<,<<<<<<<<<T",
"T<<WWDW<<,<<<<<<<<<T",
"T<<<<<<<<,<<<<<<<<<T",
"~~~~~~~~~>~~~~~~~~~~",
"~~~~~~~~~>~~~~~~~~~~",
"~~~~~~~~~~~~~~~~~~~~"],
 enc:0,warps:[{x:9,y:0,to:'__ship'},{x:10,y:0,to:'__ship'},{x:19,y:7,to:'ex_grotto',tx:10,ty:12,d:'up'}],doors:{'3,4':'ex_sinn','16,4':'ex_sshop','5,11':'ex_fishmonger'}});
addMap('ex_valor',{name:'Valorgate',mus:'town',rows:[
"TTTTTTTTT,,TTTTTTTTT",
"TSSSSSSSSSSSSSSSSSST",
"TSRRRRSSSSSSSSRRRRST",
"TSRRRRS((((((SRRRRST",
"TSWDWWS((((((SWWDWST",
"TSSSSSS((((((SSSSSST",
"TSSSSSS((((((SSSSSST",
"TSSSSSS(((D((SSSSSST",
"TSSSSSSSSSSSSSSSSSST",
"TS.f..SSSSSSSS..f.ST",
"TS....SSSSSSSS.T..ST",
"TSSSSSSSSSSSSSSSSSST",
"TSSSSSSSSSSSSSSSSSST",
"TSSSS..SSSSSSS..SSST",
"OSSSSSSSSSSSSSSSSSST",
"TTTTTTTTTTTTTTTTTTTT"],
 enc:0,warps:[{x:9,y:0,to:'__ship'},{x:10,y:0,to:'__ship'},{x:0,y:14,to:'ex_vault',tx:10,ty:12,d:'up'}],doors:{'3,4':'ex_vinn','16,4':'ex_vshop','10,7':'ex_arena'}});
addMap('ex_lantern',{name:'Lanternhaven',mus:'town',rows:[
"TTTTTTTTT,,TTTTTTTTT",
"T.....f..,,....f...T",
"T.RRRR...,,...RRRR.T",
"T.RRRR...,,...RRRR.T",
"T.WDWW...,,...WWDW.T",
"T..,,,,,,,,,,,,,,..T",
"T..,....~~....,....T",
"T..,....~~....,....T",
"T..,,,,,,,,,,,,,...T",
"T......RRRRR..,....T",
"T..f...RRRRR..,..f.T",
"T......WWDWW..,....T",
"T.........,...,....T",
"T.........,,,,,,,,,O",
"T..f......,........T",
"TTTTTTTTTTTTTTTTTTTT"],
 enc:0,warps:[{x:9,y:0,to:'__ship'},{x:10,y:0,to:'__ship'},{x:19,y:13,to:'ex_crypt',tx:10,ty:12,d:'up'}],doors:{'3,4':'ex_linn','16,4':'ex_lshop','9,11':'ex_parlor'}});
addMap('ex_grotto',{name:'Tidewater Grotto',dark:1,mus:'cave',bbg:'sunken',rows:[
"222222222222222222222222",
"222222222c1111c222222222",
"222222221111111122222222",
"222222221111111122222222",
"222222222211112222222222",
"222222222255552222222222",
"2c1112222211112222111c22",
"211312222211112222131122",
"211111111111111111111122",
"222221222211112222122222",
"222221111111111111122222",
"222222222111311122222222",
"222222222211112222222222",
"2222222222OO222222222222"],
 enc:15,pool:[['reefcrab'],['tidewisp','tidewisp'],['brineslime','reefcrab'],['brineslime','tidewisp'],['reefcrab','reefcrab'],['yeti']],
 warps:[{x:10,y:13,to:'ex_saltmere',tx:18,ty:7,d:'left'},{x:11,y:13,to:'ex_saltmere',tx:18,ty:7,d:'left'}],
 chests:{'1,6':'pearlrod','21,6':'xpotion','9,1':'tonic','14,1':'hiether'}});
addMap('ex_vault',{name:'Clockwork Vault',dark:1,mus:'cave',bbg:'forge',rows:[
"999999999999999999999999",
"999999999c8888c999999999",
"999999998888888899999999",
"999999998888888899999999",
"999999999988889999999999",
"999999999955559999999999",
"999969996988889699969999",
"9c8888888888888888888c99",
"988888888888888888888899",
"999998899988889999988999",
"998888888888888888888899",
"999999999988889999999999",
"999999999988889999999999",
"9999999999OO999999999999"],
 enc:14,pool:[['cogbat','cogbat'],['gearknight'],['sparkling','cogbat'],['gearknight','sparkling'],['lizard','cogbat'],['drowned','sparkling']],
 warps:[{x:10,y:13,to:'ex_valor',tx:1,ty:14,d:'right'},{x:11,y:13,to:'ex_valor',tx:1,ty:14,d:'right'}],
 chests:{'1,7':'cogmace','21,7':'megaether','9,1':'tonic','14,1':'mdraught'}});
addMap('ex_crypt',{name:'Lantern Catacombs',dark:1,mus:'cave',bbg:'twilight',rows:[
"!!!!!!!!!!!!!!!!!!!!!!!!",
"!!!!!!!!!c0000c!!!!!!!!!",
"!!!!!!!!0000000000!!!!!!",
"!!!!!!!!0000000000!!!!!!",
"!!!!!!!!!!0000!!!!!!!!!!",
"!!!!!!!!!!5555!!!!!!!!!!",
"!!!!!!!!0000000000!!!!!!",
"!!!!!!$000000000$!!!!!!!",
"!c0000000000000000000c!!",
"!!!!!!$000000000$!!!!!!!",
"!!!!!!!!000$0000!!!!!!!!",
"!!!!!!!!!!0000!!!!!!!!!!",
"!!!!!!!!!!0000!!!!!!!!!!",
"!!!!!!!!!!OO!!!!!!!!!!!!"],
 enc:14,pool:[['lampghost'],['boneknight'],['gravemoth','gravemoth'],['lampghost','gravemoth'],['boneknight','lampghost'],['umbral','gravemoth']],
 warps:[{x:10,y:13,to:'ex_lantern',tx:18,ty:13,d:'left'},{x:11,y:13,to:'ex_lantern',tx:18,ty:13,d:'left'}],
 chests:{'1,8':'lanternrod','21,8':'starsalt','9,1':'lanternoil','14,1':'tonic'}});
addMap('ex_obs',{name:'Starfall Observatory',dark:1,mus:'cave',bbg:'heart',rows:[
"||||||||||||||||||||||||",
"|||||||||c????c|||||||||",
"||||||||????????||||||||",
"||||||||????????||||||||",
"||||||||||????||||||||||",
"||||||||||5555||||||||||",
"||||????????????????||||",
"||||?@??????@?????@?||||",
"||||????????????????||||",
"||c?????????????????c|||",
"||||||||||????||||||||||",
"||||||||||????||||||||||",
"||||||||||????||||||||||",
"||||||||||OO||||||||||||"],
 enc:14,pool:[['starmoth','starmoth'],['voidling'],['astral','starmoth'],['voidling','astral'],['crownknight'],['kingshade','starmoth']],
 warps:[{x:10,y:13,to:'__ship'},{x:11,y:13,to:'__ship'}],
 chests:{'2,9':'astrolabe','20,9':'crownsalve','9,1':'tonic','14,1':'heartdraught'}});
const EXMAPS=['ex_saltmere','ex_valor','ex_lantern','ex_grotto','ex_vault','ex_crypt','ex_obs'];

// ---------- dungeon definitions (puzzle + boss) ----------
const DUN={
 ex_grotto:{boss:'colossus',name:'Tidewater Grotto',gate:[10,13],bbg:'sunken',lv:17,
  intro:['The cavern rises and falls with the sea. Three tide-plates are set into the rock, each carved with a sign.']},
 ex_vault:{boss:'sentinel',name:'Clockwork Vault',gate:[10,13],bbg:'forge',lv:23,
  intro:['Gears the size of houses turn in the dark. Four levers stand in the north wall, four dead lamps above them.']},
 ex_crypt:{boss:'lqueen',name:'Lantern Catacombs',gate:[10,13],bbg:'twilight',lv:29,
  intro:['Bones line the walls, each skull holding a candle stub. Five braziers stand cold in a ring.']},
 ex_obs:{boss:'seer',name:'Starfall Observatory',gate:[10,13],bbg:'heart',lv:37,
  intro:['A dome of glass, open to the stars. Three bronze mirrors on pedestals catch nothing yet.']}};
const PLATES=[{x:3,y:7,sign:'moon'},{x:19,y:7,sign:'shell'},{x:12,y:11,sign:'star'}];   // press in this order
const LEVERS=[4,8,15,19];                                                                  // x on row 6
const BRAZ=[[6,7],[16,7],[16,9],[11,10],[6,9]];                                            // a ring, in order
const MIRRORS=[{x:5,n:'the Archer',want:1},{x:12,n:'the Crown',want:0},{x:18,n:'the Serpent',want:3}]; // 0 N,1 E,2 S,3 W
const DIRN=['north','east','south','west'];
function pz(m){const s=EXS().pz;return s[m]||(s[m]={});}
function solved(m){return !!pz(m).open;}
function openGate(m,quiet){const d=DUN[m];pz(m).open=1;for(let x=d.gate[0];x<=d.gate[1];x++)setTile(m,x,5,TILES[MAPS[m].rows[4][x]]?MAPS[m].rows[4][x]:'1');
 if(!quiet){sfx('win');save();}}
function applyPuzzle(m){if(!DUN[m])return;const s=pz(m);
 if(m==='ex_grotto'){PLATES.forEach((p,i)=>setTile(m,p.x,p.y,(s.n||0)>i||s.open?'4':'3'));}
 if(m==='ex_vault'){const L=s.lv||[0,0,0,0];LEVERS.forEach((x,i)=>setTile(m,x,6,(s.open||L[i])?'7':'6'));}
 if(m==='ex_crypt'){const L=s.bz||[0,0,0,0,0];BRAZ.forEach(([x,y],i)=>setTile(m,x,y,(s.open||L[i])?'&':'$'));}
 if(m==='ex_obs'){if(!s.mr)s.mr=[2,2,2];}
 if(s.open)openGate(m,1);else{const d=DUN[m];for(let x=d.gate[0];x<=d.gate[1];x++)setTile(m,x,5,'5');}}
function checkSolved(m){const s=pz(m);if(s.open)return;let ok=false;
 if(m==='ex_vault')ok=(s.lv||[]).length===4&&s.lv.every(Boolean);
 if(m==='ex_crypt')ok=(s.bz||[]).length===5&&s.bz.every(Boolean);
 if(m==='ex_obs')ok=MIRRORS.every((r,i)=>s.mr[i]===r.want);
 if(ok){openGate(m);dialog([{ex_vault:'Every lamp blazes. Deep in the walls, the great gears catch — and the brass gate grinds open.',
  ex_crypt:'All five braziers roar at once. The iron gate to the north melts like wax.',ex_obs:'Three beams of starlight meet over the dome. The star-gate opens.'}[m],'(The way north is open.)']);}}
function pressLever(i){const s=pz('ex_vault');if(s.open)return toast('The levers are locked in place.');s.lv=s.lv||[0,0,0,0];s.lv[i]^=1;if(i<3)s.lv[i+1]^=1;sfx('ok');
 applyPuzzle('ex_vault');save();checkSolved('ex_vault');}
function lightBrazier(i){const s=pz('ex_crypt');if(s.open)return toast('The brazier burns steadily.');s.bz=s.bz||[0,0,0,0,0];[i-1,i,i+1].forEach(j=>{s.bz[(j+5)%5]^=1;});sfx('ok');
 applyPuzzle('ex_crypt');save();checkSolved('ex_crypt');}
function turnMirror(i){const s=pz('ex_obs');if(s.open)return toast('The mirror is fixed on its star.');s.mr[i]=(s.mr[i]+1)%4;sfx('move');save();
 toast(MIRRORS[i].n+'\'s mirror now faces '+DIRN[s.mr[i]]+'.');checkSolved('ex_obs');}
function stepPlate(i){const s=pz('ex_grotto');if(s.open)return;const n=s.n||0;if(i<n)return;
 if(i===n){s.n=n+1;sfx('ok');applyPuzzle('ex_grotto');save();if(s.n===3){openGate('ex_grotto');applyPuzzle('ex_grotto');return dialog(['The third plate sinks. Far off, the sea draws in a breath — and the sea-gate rises.','(The way north is open.)']);}
  return toast('The '+PLATES[i].sign+'-plate sinks with a gurgle. ('+s.n+'/3)');}
 s.n=0;sfx('no');applyPuzzle('ex_grotto');save();dialog(['A wave crashes through the cavern and every plate pops back up.','(Wrong order. The carving at the entrance: "First the moon draws the tide, then the shell rides it, then the star sees it home.")']);}

// ---------- NPCs (clear of every door and doorstep; checked by expansion_test.js) ----------
NPCS.ex_saltmere=[
 {x:2,y:5,s:'nell',d:'down',act:()=>XDOOR.ex_sinn(),lines:()=>[]},
 {x:17,y:5,s:'merch',d:'down',act:()=>XDOOR.ex_sshop(),lines:()=>[]},
 {x:6,y:12,s:'mara',d:'left',act:()=>XDOOR.ex_fishmonger(),lines:()=>[]},
 {x:8,y:12,s:'tobin',d:'down',lines:()=>['Old Tobin: Fish off the pier, lad — face the water and press A.','Old Tobin: Hold A while you cast to throw further. The far water has the big ones. Old Saltjaw lives at the very end of a full cast.','Old Tobin: When the fish fights, HOLD A to raise your reel bar and keep the fish inside it. Let go to drop.']},
 {x:14,y:9,s:'quill',d:'left',act:()=>duelOffer('quill')},
 {x:18,y:8,s:'guard',d:'up',lines:()=>DUNDONE('ex_grotto')?['Harbour-watch: The tide in the grotto is gentle now. Fish are coming back.']:['Harbour-watch: That cave east is the Tidewater Grotto. Something huge has been eating our boats at night.','Harbour-watch: The old divers say the gate opens to the sea\'s own rhythm. There\'s a carving by the entrance.']},
 {x:13,y:11,s:'kid',d:'left',wander:1,lines:()=>['Pip-squeak: I caught a sardine THIS big! (holds hands a little apart)']},
 {x:12,y:3,s:'dov',d:'down',lines:()=>['Captain Dov: Saltmere doesn\'t see many airships. Your Cinderwing\'s welcome at the top of the town.','Captain Dov: Further west, past the clouds, there\'s a city with an arena. Valorgate. Sailors bet their wages there.']}];
NPCS.ex_valor=[
 {x:2,y:5,s:'inn',d:'down',act:()=>XDOOR.ex_vinn(),lines:()=>[]},
 {x:17,y:5,s:'brann',d:'down',act:()=>XDOOR.ex_vshop(),lines:()=>[]},
 {x:12,y:8,s:'herald',d:'down',act:()=>XDOOR.ex_arena()},
 {x:5,y:10,s:'rusk',d:'right',act:()=>duelOffer('rusk')},
 {x:2,y:13,s:'ada',d:'down',lines:()=>DUNDONE('ex_vault')?['Tinker Ada: You stopped the Sentinel! The vault gears are singing. I could listen forever.']:['Tinker Ada: The Clockwork Vault is under the west wall. My great-grandmother built its lock.','Tinker Ada: "Each lever drives its own gear, and the next." Light all four lamps and it opens. Simple! ...Ish.']},
 {x:12,y:1,s:'guard',d:'down',lines:()=>['Gate guard: Welcome to Valorgate, city of the Colosseum. Fights daily, healers on call. Nobody dies. Officially.']},
 {x:15,y:12,s:'kid',d:'left',wander:1,lines:()=>['Tibb: Grand Champion Vasska has never lost. Not once! She once beat a bear with a spoon.']}];
NPCS.ex_lantern=[
 {x:2,y:5,s:'inn',d:'down',act:()=>XDOOR.ex_linn(),lines:()=>[]},
 {x:17,y:5,s:'merch',d:'down',act:()=>XDOOR.ex_lshop(),lines:()=>[]},
 {x:4,y:9,s:'pell',d:'right',act:()=>duelOffer('pell')},
 {x:7,y:6,s:'marg',d:'right',act:()=>duelOffer('marg')},
 {x:11,y:12,s:'oriel',d:'left',act:()=>duelOffer('oriel')},
 {x:12,y:9,s:'ivo',d:'down',lines:()=>DUNDONE('ex_crypt')?['Lamplighter Ivo: The Queen is gone and the lanterns stay lit on their own now. I may have to find a new job.']:['Lamplighter Ivo: The catacombs are east, behind the last lamp. The dead light their own way down there.','Lamplighter Ivo: The five braziers are a ring. Light one and its neighbours flicker with it. Patience, not force.']},
 {x:18,y:12,s:'guard',d:'down',lines:()=>['Lantern-warden: Fish in the pond if you like. The koi glow at night. Lucky to catch one.']},
 {x:16,y:7,s:'kid',d:'left',wander:1,lines:()=>['Nim: Oriel at the Gilded Ember has every card there is. Except the ones she doesn\'t.']}];
NPCS.ex_grotto=[{x:12,y:9,s:'shade',d:'down',lines:()=>['Drowned diver (a pale shade): The carving said... first the moon draws the tide...','Drowned diver: ...then the shell rides it... then the star sees it home. I pressed them wrong. Don\'t... press them wrong.']}];
NPCS.ex_vault=[{x:13,y:10,s:'shade',d:'left',lines:()=>['Ghost of a tinker: Each lever drives its own gear... and the next one over. All four lamps, child. Think, then pull.']}];
NPCS.ex_crypt=[{x:13,y:11,s:'shade',d:'left',lines:()=>['Shade of a lamplighter: Five fires in a ring. Touch one, and it and its two neighbours change.','Shade of a lamplighter: Light every one of the five once, and see what the ring does.']}];
NPCS.ex_obs=[{x:13,y:11,s:'shade',d:'left',lines:()=>['Astronomer\'s echo: The Archer looks to the dawn. The Crown looks to the pole star. The Serpent looks to where the sun drowns.','Astronomer\'s echo: (Dawn is east. The pole star is north. The sun drowns in the west.)']}];
const DUNDONE=m=>!!G.flags['ex_'+DUN[m].boss];

// ---------- inns & shops ----------
function exInn(who,n,price){return ()=>choice(who+': '+n+' for '+price+'G?',['Stay','Leave'],i=>{if(i)return;if(G.gold<price)return toast('Not enough gold.');G.gold-=price;
 transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});});}
XDOOR.ex_sinn=exInn('Nell','A sea-view room and chowder',50);
XDOOR.ex_vinn=exInn('Innkeep Hesta','A champion\'s bunk (and earplugs)',80);
XDOOR.ex_linn=exInn('Innkeep Wynn','A lantern-lit room',110);
XDOOR.ex_sshop=()=>choice('Saltmere Chandlery: provisions, or the smithy in back?',['Provisions','Smithy','Leave'],i=>{if(i===2)return;openShop(i?{stock:EXSHOP.saltsmith,n:'Saltmere Smithy',who:'Korr'}:{stock:EXSHOP.salt,n:'Saltmere Chandlery',who:'Ilse'});});
XDOOR.ex_vshop=()=>openShop({stock:EXSHOP.valor,n:'Valorgate Armoury',who:'Brann'});
XDOOR.ex_lshop=()=>openShop({stock:EXSHOP.lantern,n:'Lamplight Goods',who:'Sibbe'});

// ---------- airship POIs ----------
const EXPOI=[{id:'ex_salt',k:'ex_salt',n:'Saltmere',x:3,y:17,rx:22,ry:8,map:'ex_saltmere',req:()=>!!G.flags.tyrant,no:'Gulls circle a fishing village far below, but a squall keeps you off. (Come back later in your journey.)'},
 {id:'ex_valor',k:'ex_valor',n:'Valorgate',x:22,y:13,rx:24,ry:9,map:'ex_valor',req:()=>!!G.flags.wyrm,no:'A walled city with a great ring of stone. Its harbour guns wave you off: "No unknown ships!" (Come back later.)'},
 {id:'ex_lant',k:'ex_lant',n:'Lanternhaven',x:13,y:29,rx:22,ry:8,map:'ex_lantern',req:()=>!!G.flags.hydra,no:'Hundreds of lanterns float over a dark island. A thick lantern-smoke turns you back. (Come back later.)'},
 {id:'ex_obs',k:'ex_obs',n:'Starfall Observatory',x:44,y:25,rx:18,ry:7,map:'ex_obs',req:()=>!!G.flags.seneschal,no:'A glass dome floats in the high dark. Its star-gate is shut tight. (It may open once the Throne has fallen.)'}];
EXPOI.forEach(p=>POI.push(p));
const _skyIntEX=skyInteract;skyInteract=function(p){const e=EXPOI.find(q=>q.id===p.id);if(!e)return _skyIntEX(p);
 if(!e.req()){sfx('no');return toast(e.no);}sfx('ok');const first=!EXS().seen[e.id];EXS().seen[e.id]=1;
 transition(()=>{scene='map';if(e.map==='ex_obs')enterMap('ex_obs',10,12,'up');else enterMap(e.map,9,1,'down');
  if(first)dialog(FIRST[e.id]);});};
const FIRST={ex_salt:['— Saltmere, the fishing town —','Orrin Vey: Fishing town. Smells like fish. Shocking. I\'ll moor on the cliff.','Mira: Look at the pier! Somebody is fishing. Can we... fish?','Kael: (already reaching for a rod)'],
 ex_valor:['— Valorgate, city of the Colosseum —','Orrin Vey: Valorgate. Best arena in the sky. I lost a bet here in \'32 — don\'t mention my name.','Kael: An arena. Ranked fights.','Lyra: Kael, you\'re smiling.'],
 ex_lant:['— Lanternhaven, the town of lights —','Orrin Vey: Lanternhaven. They play cards here like other towns breathe. Don\'t gamble the ship.','Lyra: Every lantern is a name. They light one for each of their dead.'],
 ex_obs:['— The Starfall Observatory —','The star-gate swings open. Inside, the floor is a map of the night sky.','Lyra: Someone was watching the stars here long before the Crown was made.']};
const _enterEX=enterMap;enterMap=function(name,x,y,d){
 if(name==='__ship'&&EXMAPS.includes(G.map)){if(!G.sky)return toast('No ship.');const e=EXPOI.find(p=>p.map===G.map)||EXPOI[0];return startSkyMap(e);}
 const r=_enterEX(name,x,y,d);if(DUN[name]){applyPuzzle(name);if(!EXS().seen[name]){EXS().seen[name]=1;dialog(DUN[name].intro);}}return r;};
const _isleEX=drawIsle;drawIsle=function(x,y,rx,ry,k){if(!String(k).startsWith('ex_'))return _isleEX(x,y,rx,ry,k);
 _isleEX(x,y,rx,ry,k==='ex_obs'?'ruin':'dock');
 if(k==='ex_salt'){X.fillStyle='#d8c08a';X.fillRect(x-rx+4,y-3,rx*2-8,3);X.fillStyle='#8a5a2a';X.fillRect(x+rx-10,y-2,12,2);for(let i=0;i<3;i++){X.fillStyle='#a83a2a';X.fillRect(x-14+i*9,y-10,7,6);X.fillStyle='#e0d0b0';X.fillRect(x-13+i*9,y-6,5,4);}
  X.fillStyle='#fff';const g=(T*1.5)%1;X.fillRect(x-10+g*20,y-22-Math.sin(g*6)*3,3,1);}
 if(k==='ex_valor'){X.fillStyle='#a88858';X.beginPath();X.ellipse(x,y-8,15,8,0,0,7);X.fill();X.fillStyle='#c8a878';X.beginPath();X.ellipse(x,y-10,15,7,0,0,7);X.fill();X.fillStyle='#6a5a3a';X.beginPath();X.ellipse(x,y-10,9,4,0,0,7);X.fill();
  X.fillStyle='#d03030';X.fillRect(x+12,y-24,1,12);X.fillRect(x+13,y-24,5,3);}
 if(k==='ex_lant'){for(let i=0;i<7;i++){const a=T*0.7+i*0.9,lx=x+Math.cos(a)*16,ly=y-16+Math.sin(a*1.3)*5-i;X.globalAlpha=0.6+0.3*Math.sin(T*3+i);X.fillStyle=i%2?'#ffb040':'#a0ff70';X.fillRect(lx-1,ly-2,3,4);}X.globalAlpha=1;
  X.fillStyle='#3a3048';X.fillRect(x-8,y-12,16,8);X.fillStyle='#ffd060';X.fillRect(x-5,y-10,2,2);X.fillRect(x+3,y-10,2,2);}
 if(k==='ex_obs'){X.fillStyle='#2a2048';X.fillRect(x-8,y-16,16,10);X.fillStyle='#8090d0';X.beginPath();X.arc(x,y-16,8,Math.PI,0);X.fill();X.fillStyle='#e0e8ff';X.fillRect(x+3,y-22,2,2);
  if(Math.sin(T*3)>0){X.fillStyle='#ffe060';X.fillRect(x-1,y-30,2,6);X.fillRect(x-3,y-28,6,2);}}};

// ---------- field: plates, levers, braziers, mirrors, fishing water, boss rooms ----------
XSTEP.push(()=>{const m=G.map;
 if(m==='ex_grotto'){const i=PLATES.findIndex(p=>p.x===G.x&&p.y===G.y);if(i>=0&&!solved(m)){stepPlate(i);return true;}}
 if(DUN[m]&&solved(m)&&!G.flags['ex_'+DUN[m].boss]&&G.y===4){bossEvent_(m);return true;}return false;});
const _blkEX=blocked;blocked=function(x,y){if(DUN[G.map]&&!G.flags['ex_'+DUN[G.map].boss]&&y<=3&&y>=1)return true;return _blkEX(x,y);};
function facing(){const[a,b]=DIRS[G.d];return [G.x+a,G.y+b];}
function exInteract(){const m=G.map,[tx,ty]=facing();if(npcAt(tx,ty))return false;const t=tileAt(m,tx,ty);
 if(m==='ex_vault'&&ty===6){const i=LEVERS.indexOf(tx);if(i>=0){pressLever(i);return true;}}
 if(m==='ex_crypt'){const i=BRAZ.findIndex(([x,y])=>x===tx&&y===ty);if(i>=0){lightBrazier(i);return true;}}
 if(m==='ex_obs'&&ty===7){const i=MIRRORS.findIndex(r=>r.x===tx);if(i>=0){turnMirror(i);return true;}}
 if((m==='ex_saltmere'||m==='ex_lantern')&&t==='~'){fishOffer(m==='ex_lantern'?'pond':'sea');return true;}
 return false;}
const _updFieldEX=updField;updField=function(dt){if(P.a&&F.mv===0&&EXMAPS.includes(G.map)&&exInteract())return;return _updFieldEX(dt);};
function bossEvent_(m){const b=DUN[m].boss;const L={
 colossus:['The water at the back of the grotto bulges, then stands up. Barnacled stone, kelp for hair, pincers like boat-hulls.','Brine Colossus: (a sound like the whole sea grinding its teeth)','Lyra: It\'s soaked through — lightning will run right into it!','Kael: So THIS is what\'s been eating Saltmere\'s boats.'],
 sentinel:['At the heart of the vault, a brass knight twice Kael\'s height turns its furnace-eye toward you.','Brass Sentinel: INTRUDERS. THE VAULT IS SEALED. THE VAULT IS FOREVER.','Lyra: Gears and steam... a good bolt should jam it!','Mira: Ada\'s great-grandmother built this. Let\'s not break it more than we have to.'],
 lqueen:['The candles gutter. A woman of smoke and paper rises, a crown of flames on her head and a hundred lanterns on a chain.','The Lantern Queen: Every light here is MINE. Every name. Every soul. And now — yours.','Mira: She\'s keeping Lanternhaven\'s dead from resting. Fire, Lyra — burn her lanterns out!'],
 seer:['The mirrors\' light gathers into a figure of marble and gold, planets turning about its head.','The Starfall Seer: I watched the Crown fall from the sky. I watched you walk every step. I have seen how this ends.','Kael: Then you\'ve seen us win.','Lyra: It\'s made of starlight and stone... ice will crack it!']}[b];
 dialog(L,()=>startBattle([b],DUN[m].bbg,true));}
const DUNREW={colossus:{eq:['brinecleaver','shellmail'],card:'colossus',m:'ex_grotto',t:['The Colossus crumbles into wet stone and shells. The tide sighs out of the grotto.','Got the Brinecleaver and Shellplate!','Got the Brine Colossus card!','Mira: The boats will be safe now. Let\'s tell the harbour.']},
 sentinel:{eq:['clockblade','brassplate'],m:'ex_vault',t:['The Sentinel kneels; its furnace-eye dims to a friendly amber. Somewhere, a music-box starts to play.','Got the Clockspring Blade and Brass Aegis!','Lyra: Ada is going to want to see this.']},
 lqueen:{eq:['gravelight','wraithshroud'],card:'queen',m:'ex_crypt',t:['The Lantern Queen\'s lanterns open one by one. A hundred little lights rise through the ceiling — up, and out, and free.','Got the Gravelight Censer and Wraith Shroud!','Got the Lantern Queen card!','Mira: Rest well. All of you.']},
 seer:{eq:['starfallblade','cosmosmail'],m:'ex_obs',t:['The Seer\'s planets slow and stop. "I was wrong," it says. "I did not see this." It smiles, and becomes light.','Got the Starfall Blade and Cosmos Mail!','Lyra: It said it saw how this ends. Let\'s go and find out.']}};
for(const b in DUNREW)XWIN[b]=()=>{const r=DUNREW[b];G.flags['ex_'+b]=1;r.eq.forEach(k=>G.eq[k]=(G.eq[k]||0)+1);if(r.card)addCard(r.card);sfx('coin');save();dialog(r.t);};
XFENTS.push((ents,cx,cy)=>{const m=G.map;
 if(DUN[m]&&!G.flags['ex_'+DUN[m].boss]){const b=DUN[m].boss,bob=Math.sin(T*1.2)*1.5;ents.push({y:32,dr:()=>{if(!drawPaint(b,12*16-cx,3*16-cy+8+bob,{sc:0.45,alpha:solved(m)?0.95:0.35})){const c=EN_ART.boss.c;X.drawImage(c,12*16-cx-c.width/2,16-cy+bob);}}});}
 if(m==='ex_grotto'&&!solved(m))PLATES.forEach((p,i)=>{const x=p.x*16-cx+8,y=p.y*16-cy+8;ents.push({y:p.y*16-2,dr:()=>{X.fillStyle=(pz(m).n||0)>i?'#0a3a3a':'#e0f0ff';
  if(p.sign==='moon'){X.beginPath();X.arc(x,y,4,0,7);X.fill();X.fillStyle='#7a8a9a';X.beginPath();X.arc(x+2,y-1,3.5,0,7);X.fill();}
  else if(p.sign==='shell'){for(let k=0;k<4;k++)X.fillRect(x-4+k*2,y-2+Math.abs(k-1.5),1,4);X.fillRect(x-4,y+2,8,1);}
  else{X.fillRect(x-1,y-4,2,8);X.fillRect(x-4,y-1,8,2);X.fillRect(x-2,y-2,4,4);}}});});
 if(m==='ex_obs'){const s=pz(m);if(!s.mr)s.mr=[2,2,2];MIRRORS.forEach((r,i)=>{const x=r.x*16-cx+8,y=7*16-cy+6;ents.push({y:7*16,dr:()=>{const d=s.mr[i],[a,b]=[[0,-1],[1,0],[0,1],[-1,0]][d];
  X.fillStyle='#e0e8ff';X.fillRect(x-3,y-3,6,6);X.fillStyle='#ffe060';X.fillRect(x+a*5-1,y+b*5-1,3,3);
  if(s.open||d===r.want){X.globalAlpha=0.35+0.2*Math.sin(T*4+i);X.fillStyle='#fff0a0';X.fillRect(Math.min(x,x+a*30),Math.min(y,y+b*30),a?30:2,b?30:2);X.globalAlpha=1;}}});});}
 if(m==='ex_lantern'){for(let i=0;i<6;i++){const lx=(3+i*3)*16-cx,ly=(1.2+((i*7)%5)*2.4)*16-cy+Math.sin(T*1.3+i)*3;ents.push({y:999,dr:()=>{X.globalAlpha=0.75;X.fillStyle=i%2?'#ffb040':'#a0ff70';X.fillRect(lx,ly,4,5);X.fillStyle='#fff8d0';X.fillRect(lx+1,ly+1,2,2);X.globalAlpha=1;}});}}});

// ======================================================================================================
// MINIGAME 1: FISHING
// ======================================================================================================
const FISH={sardine:{n:'Silver Sardine',w:30,fight:0.3,v:20,far:0},mackerel:{n:'Tide Mackerel',w:22,fight:0.45,v:45,far:0.2},crab:{n:'Blue Crab',w:15,fight:0.35,v:60,far:0},
 eel:{n:'Gloom Eel',w:12,fight:0.65,v:120,far:0.45},sunfish:{n:'Ember Sunfish',w:9,fight:0.55,v:160,far:0.5},swordfish:{n:'Gale Swordfish',w:6,fight:0.8,v:300,far:0.7},
 saltjaw:{n:'Old Saltjaw',w:3,fight:0.95,v:1500,far:0.9,legend:1},koi:{n:'Lantern Koi',w:0,fight:0.5,v:220,far:0,pond:1}};
function rollFish(where,power){if(where==='pond'){const r=Math.random();return r<0.35?'koi':r<0.7?'sardine':'eel';}
 const L=Object.entries(FISH).filter(([k,f])=>!f.pond&&power>=f.far);let r=Math.random()*L.reduce((s,[,f])=>s+f.w,0);for(const[k,f]of L)if((r-=f.w)<0)return k;return 'sardine';}
function fishOffer(where){choice(where==='pond'?'The pond glows faintly. Try to fish?':'The sea slaps the pier. Cast a line?',['Fish','Not now'],i=>{if(i)return;startFishing(where);});}
function startFishing(where){UI.push({k:'fish',where,st:'aim',pw:0,pd:1,t:0,msg:'Hold A to charge your cast, release to throw.'});}
function landFish(u){const e=EXS(),k=u.fish;e.fish[k]=(e.fish[k]||0)+1;const first=!e.log[k];e.log[k]=1;u.st='caught';u.t=0;sfx('win');
 u.msg='Caught a '+FISH[k].n+'!'+(first?'  (New species!)':'');save();}
XUI.fish={u:(u,dt)=>{u.t+=dt;
  if(P.b&&u.st!=='reel'){UI.pop();sfx('no');return;}
  if(u.st==='aim'){if(K.a&&(u.t>0.25||u.charging)){u.charging=1;u.pw+=u.pd*dt*1.1;if(u.pw>1){u.pw=1;u.pd=-1;}if(u.pw<0){u.pw=0;u.pd=1;}}
   else if(u.charging){u.charging=0;u.st='wait';u.t=0;u.wait=1.2+Math.random()*2.2;u.fish=rollFish(u.where,u.pw);sfx('move');u.msg='Plip! Now wait for a bite...';}}
  else if(u.st==='wait'){if(P.a){u.st='aim';u.pw=0;u.t=0;u.msg='Too early! You reel in an empty hook.';sfx('no');return;}if(u.t>u.wait){u.st='bite';u.t=0;sfx('enc');u.msg='!!! A BITE! Press A!';}}
  else if(u.st==='bite'){if(P.a){const f=FISH[u.fish];u.st='reel';u.t=0;u.fp=0.5;u.fv=0;u.z=0.4;u.zv=0;u.prog=0.3;u.zs=0.3-(f.fight*0.1);u.msg='Hold A to raise the reel bar. Keep the fish inside!';sfx('ok');}
   else if(u.t>0.9){u.st='aim';u.t=0;u.pw=0;u.msg='It got away... Hold A to cast again.';sfx('no');}}
  else if(u.st==='reel'){const f=FISH[u.fish];
   if(Math.random()<dt*(1+f.fight*3))u.fv=(Math.random()-0.5)*(0.6+f.fight*1.6);u.fp=Math.max(0,Math.min(1,u.fp+u.fv*dt));if(u.fp<=0||u.fp>=1)u.fv*=-1;
   u.zv+=(K.a?1.6:-1.3)*dt;u.zv*=0.94;u.z+=u.zv*dt*1.6;if(u.z<0){u.z=0;u.zv=0;}if(u.z>1-u.zs){u.z=1-u.zs;u.zv=0;}
   const inside=u.fp>=u.z&&u.fp<=u.z+u.zs;u.prog+=(inside?0.32:-0.22-f.fight*0.08)*dt;
   if(u.prog>=1)landFish(u);else if(u.prog<=0){u.st='aim';u.pw=0;u.msg='The line snaps! The '+(f.legend?'shadow':'fish')+' is gone.';sfx('no');}}
  else if(u.st==='caught'){if(u.t>0.6&&P.a){u.st='aim';u.pw=0;u.msg='Hold A to charge your cast, release to throw.';}}},
 d:u=>{const sea=u.where!=='pond';X.fillStyle='#000a';X.fillRect(0,0,W,H);win(8,8,W-16,H-16);
  const g=X.createLinearGradient(0,20,0,150);g.addColorStop(0,sea?'#8ac0f0':'#101830');g.addColorStop(0.35,sea?'#cfe6ff':'#202848');g.addColorStop(0.36,sea?'#2a5ab8':'#0a2a2a');g.addColorStop(1,sea?'#102a5a':'#041414');
  X.fillStyle=g;X.fillRect(14,20,W-28,130);txt(sea?'FISHING — Saltmere pier':'FISHING — the lantern pond',20,24,'#ffd860',7);
  for(let i=0;i<8;i++){X.fillStyle=sea?'#6aa0f0':'#2a6a5a';X.fillRect(20+((i*37+T*12)%(W-50)),70+i*9,10,1);}
  X.fillStyle='#8a5a2a';X.fillRect(14,60,40,6);fspr(SPR.kael.right[0],30,44);X.strokeStyle='#d0c0a0';X.beginPath();X.moveTo(42,46);
  const bx=60+(u.st==='aim'?u.pw:(u.pw||0.5))*150,by=72;X.lineTo(bx,by-12);X.lineTo(bx,by);X.stroke();
  if(u.st!=='aim'){X.fillStyle='#e03030';X.fillRect(bx-2,by-2+(u.st==='bite'?Math.sin(T*30)*2:Math.sin(T*3)),4,3);X.fillStyle='#fff';X.fillRect(bx-2,by-2,4,1);}
  if(u.st==='bite'){txt('!',bx,by-24,'#ffe060',12,'center');}
  if(u.st==='aim'){win(20,128,W-40,16);X.fillStyle='#204';X.fillRect(26,133,W-52,6);X.fillStyle=u.pw>0.85?'#ffe060':'#60c0ff';X.fillRect(26,133,(W-52)*u.pw,6);txt('CAST',W/2,131,'#fff',6,'center');}
  if(u.st==='reel'){const bx2=W-46,by2=30,bh=110;X.fillStyle='#0a1020';X.fillRect(bx2,by2,16,bh);X.fillStyle='#60ff80';X.globalAlpha=0.6;X.fillRect(bx2+1,by2+bh*(1-u.z-u.zs),14,bh*u.zs);X.globalAlpha=1;
   X.fillStyle='#ffd040';X.fillRect(bx2+3,by2+bh*(1-u.fp)-3,10,6);X.fillStyle='#202';X.fillRect(bx2+20,by2,6,bh);X.fillStyle='#ff8040';X.fillRect(bx2+20,by2+bh*(1-u.prog),6,bh*u.prog);}
  if(u.st==='caught'){const f=FISH[u.fish];win(50,80,W-100,40);txt(f.n,W/2,88,f.legend?'#ffd860':'#fff',8,'center');txt('worth '+f.v+' G at the fishmonger',W/2,102,'#9cf',6,'center');}
  wrap(u.msg,44).slice(0,2).forEach((l,i)=>txt(l,16,156+i*10,'#fff',7));const e=EXS(),sp=Object.keys(e.log).length;
  txt('Species '+sp+'/'+Object.keys(FISH).length+'   In bag: '+Object.values(e.fish).reduce((a,b)=>a+b,0),16,180,'#9cf',7);txt('B: stop fishing',16,192,'#bbd',6);}};
XDOOR.ex_fishmonger=()=>choice('Mara\'s Fish & Tackle: what\'ll it be?',['Sell my catch','Fish log','Leave'],i=>{const e=EXS();
 if(i===0){let g=0,n=0;for(const k in e.fish){g+=FISH[k].v*e.fish[k];n+=e.fish[k];}if(!n)return dialog(['Mara: Your bag\'s empty, love. The pier\'s right there.']);e.fish={};G.gold+=g;sfx('coin');save();return dialog(['Mara: '+n+' fish... that\'s '+g+' G. Pleasure doing business!']);}
 if(i===1){const sp=Object.keys(e.log),L=['Mara: Let\'s see your log... '+sp.length+' of '+Object.keys(FISH).length+' species.',...Object.keys(FISH).map(k=>(e.log[k]?'* ':'- ')+(e.log[k]?FISH[k].n:'???'))];
  if(sp.length>=4&&!e.got.angler){e.got.angler=1;G.eq.anglercharm=(G.eq.anglercharm||0)+1;L.push('Mara: Four species! You\'re a proper angler. Take my old charm.','Got the Angler\'s Charm!');}
  if(sp.length>=Object.keys(FISH).length&&!e.got.tiderod){e.got.tiderod=1;G.eq.tiderod=(G.eq.tiderod||0)+1;L.push('Mara: Every fish in these waters... even Saltjaw and the koi. Here — this rod came out of a leviathan\'s belly.','Got the Leviathan Rod!');}
  if(e.got.angler||e.got.tiderod)sfx('coin');save();return dialog(L);}});

// ======================================================================================================
// MINIGAME 2: EMBER TRIAD (cards). Place cards on a 3x3 board; a side higher than the touching enemy side flips it.
// ======================================================================================================
const CARDS={slime:['Mire Slime',1,4,1,5],bat:['Dusk Bat',5,1,1,3],imp:['Thorn Imp',1,3,3,5],wisp:['Grave Wisp',6,1,1,2],sentry:['Bone Sentry',2,3,1,5],crawler:['Hollow Crawler',2,1,4,4],
 gloomray:['Gloomray',3,5,2,5],yeti:['Tundra Yeti',6,2,6,3],lizard:['Fen Lizardman',5,4,3,6],crab:['Reef Crab',6,6,1,4],cogbat:['Cog Bat',7,2,4,4],lamp:['Lamp Ghost',3,6,6,2],
 tyrant:['Slag Tyrant',6,7,3,7],wyrm:['Rime Wyrm',7,3,7,6],hydra:['Mire Hydra',5,8,6,4],colossus:['Brine Colossus',8,4,7,5],
 warden:['Eclipse Warden',8,8,2,6],queen:['Lantern Queen',3,8,8,7],orrin:['Orrin Vey',9,5,6,7],vasska:['Vasska',10,7,4,8]};
const CSUM=k=>CARDS[k].slice(1).reduce((a,b)=>a+b,0);
const STARTER=['slime','bat','imp','wisp','sentry'];
const RIVALS={pell:{n:'Novice Pell',deck:['slime','bat','imp','wisp','crawler'],g:60,town:'Lanternhaven'},
 quill:{n:'Sailor Quill',deck:['crawler','gloomray','crab','bat','imp'],g:120,town:'Saltmere'},
 rusk:{n:'Gambler Rusk',deck:['yeti','lizard','cogbat','sentry','gloomray'],g:200,town:'Valorgate'},
 marg:{n:'Widow Marguerite',deck:['lamp','lizard','tyrant','yeti','cogbat'],g:320,town:'Lanternhaven'},
 oriel:{n:'Card Master Oriel',deck:['wyrm','hydra','warden','orrin','tyrant'],g:600,town:'Lanternhaven',req:()=>['pell','marg','quill','rusk'].filter(r=>EXS().beat[r]).length>=3}};
function addCard(k){const c=EXS().cards;c[k]=(c[k]||0)+1;}
function myDeck(){const c=EXS().cards;return Object.keys(c).filter(k=>c[k]>0).sort((a,b)=>CSUM(b)-CSUM(a)).slice(0,5);}
function duelOffer(id){const r=RIVALS[id],e=EXS();
 const intro={pell:'Pell: Ember Triad? I only just learned! Want to play?',quill:'Quill: Ahoy! Fancy a hand of Ember Triad? Winner picks a card from the loser\'s deck.',
  rusk:'Rusk: Cards, friend. Higher side flips the lower. I don\'t lose.',marg:'Marguerite: My husband taught me this game. He lost every hand. Sit.',oriel:'Oriel: I am the Card Master of the Gilded Ember. Play me.'}[id];
 if(!e.got.starter){e.got.starter=1;STARTER.forEach(addCard);save();return dialog([r.n.split(' ').pop()+': New to Ember Triad? Here — five cards to start with. Everyone needs a first deck.','Got 5 Ember Triad cards! (Your 5 strongest cards are always dealt.)',
  'How to play: take turns placing cards on the 3x3 board. If a side of your card is higher than the touching side of an enemy card, it flips to your colour. Most cards at the end wins.'],()=>duelOffer(id));}
 if(r.req&&!r.req())return dialog(['Oriel: Beat three of the island\'s players first. Pell, Marguerite, Quill in Saltmere, Rusk in Valorgate. Then come back.']);
 choice(intro,['Play','Rules','Not now'],i=>{if(i===2)return;if(i===1)return dialog(['Each side of a card has a number (A = 10). Place a card next to an enemy card: if your touching side is higher, it flips to you.','The board holds 9 cards. Count the cards you own on the board, plus any left in your hand. Most wins.','Win and you take a card from their deck. Lose and you lose nothing but pride.'],()=>duelOffer(id));
  startDuel(id);});}
function startDuel(id){const r=RIVALS[id];UI.push({k:'cards',id,me:myDeck().map(k=>({k,o:0})),ai:r.deck.map(k=>({k,o:1})),board:Array(9).fill(null),turn:Math.random()<0.5?0:1,sel:0,cell:4,st:'hand',t:0,msg:''});}
function flipsFor(board,c,cell,o){const x=cell%3,y=cell/3|0,s=CARDS[c.k].slice(1),out=[];const N=[[0,-1,0,2],[1,0,1,3],[0,1,2,0],[-1,0,3,1]];
 for(const[a,b,my,their]of N){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>2||ny>2)continue;const t=board[ny*3+nx];if(t&&t.o!==o&&s[my]>CARDS[t.k][their+1])out.push(ny*3+nx);}return out;}
function placeCard(u,hand,i,cell,o){const c=hand.splice(i,1)[0];c.o=o;u.board[cell]=c;const f=flipsFor(u.board,c,cell,o);f.forEach(j=>u.board[j].o=o);u.last=cell;u.flash=f;u.ft=0.5;sfx(f.length?'ok':'move');
 u.turn^=1;if(u.board.every(Boolean))endDuel(u);}
function aiMove(u){let best=null;u.ai.forEach((c,i)=>u.board.forEach((b,cell)=>{if(b)return;const f=flipsFor(u.board,c,cell,1).length;const x=cell%3,y=cell/3|0,s=CARDS[c.k];
  const exposed=(y>0?s[1]:5)+(x<2?s[2]:5)+(y<2?s[3]:5)+(x>0?s[4]:5);const sc=f*20+exposed*0.5-CSUM(c.k)*0.3+Math.random();if(!best||sc>best.sc)best={i,cell,sc};}));
 placeCard(u,u.ai,best.i,best.cell,1);}
function score(u){const b=u.board.filter(Boolean);return [b.filter(c=>c.o===0).length+u.me.length,b.filter(c=>c.o===1).length+u.ai.length];}
function endDuel(u){const[a,b]=score(u);u.st='end';u.t=0;u.res=a>b?'win':a<b?'lose':'draw';const r=RIVALS[u.id],e=EXS();u.lines=[];
 if(u.res==='win'){e.beat[u.id]=(e.beat[u.id]||0)+1;G.gold+=r.g;const left=r.deck.filter(k=>!e.cards[k]);const pick=left.length?left[Math.random()*left.length|0]:null;
  if(pick){addCard(pick);u.lines.push('You won the '+CARDS[pick][0]+' card!');}u.lines.push('+'+r.g+' G');
  if(u.id==='oriel'&&!e.got.gilded){e.got.gilded=1;G.eq.gildedmail=(G.eq.gildedmail||0)+1;u.lines.push('Oriel: Magnificent. Wear this; the Gilded Ember honours its masters.','Got the Gilded Ember Coat!');}
  if(Object.keys(CARDS).every(k=>e.cards[k])&&!e.got.joker){e.got.joker=1;G.eq.jokercrook=(G.eq.jokercrook||0)+1;u.lines.push('Every card in the world! Oriel sends a gift: the Joker\'s Crook!');}
  sfx('win');}else sfx('no');save();}
function drawCard(c,x,y,hide){const col=c.o===0?['#203a8a','#4a6ad0']:['#8a2020','#d04a4a'];X.fillStyle='#000';X.fillRect(x-1,y-1,30,30);X.fillStyle=col[0];X.fillRect(x,y,28,28);X.fillStyle=col[1];X.fillRect(x+1,y+1,26,3);
 if(hide){X.fillStyle='#ffd060';X.fillRect(x+11,y+11,6,6);return;}const s=CARDS[c.k],v=n=>n>=10?'A':String(n);
 txt(v(s[1]),x+14,y+2,'#fff',7,'center');txt(v(s[2]),x+25,y+10,'#fff',7,'right');txt(v(s[3]),x+14,y+19,'#fff',7,'center');txt(v(s[4]),x+3,y+10,'#fff',7);
 X.fillStyle='#ffe0a0';X.fillRect(x+12,y+12,4,4);}
XUI.cards={u:(u,dt)=>{u.t+=dt;if(u.ft>0)u.ft-=dt;
  if(u.st==='end'){if(u.t>0.5&&(P.a||P.b)){UI.pop();const r=RIVALS[u.id];dialog(u.res==='win'?[r.n+': ...You beat me fair.',...u.lines]:u.res==='draw'?[r.n+': A draw! Again sometime.']:[r.n+': Ha! Better luck next time.']);}return;}
  if(u.turn===1){if(u.t>0.7){u.t=0;aiMove(u);}return;}
  if(u.st==='hand'){if(P.b){UI.pop();sfx('no');return toast(RIVALS[u.id].n+': Giving up? Fine by me.');}
   if(held('up',dt)){u.sel=(u.sel+u.me.length-1)%u.me.length;sfx('move');}if(held('down',dt)){u.sel=(u.sel+1)%u.me.length;sfx('move');}if(P.a){u.st='cell';sfx('ok');}}
  else if(u.st==='cell'){if(P.b){u.st='hand';sfx('no');return;}const x=u.cell%3,y=u.cell/3|0;
   if(held('left',dt)&&x>0)u.cell--;if(held('right',dt)&&x<2)u.cell++;if(held('up',dt)&&y>0)u.cell-=3;if(held('down',dt)&&y<2)u.cell+=3;
   if(P.a){if(u.board[u.cell]){sfx('no');return;}placeCard(u,u.me,u.sel,u.cell,0);u.sel=0;u.t=0;if(u.st!=='end')u.st='hand';}}},
 d:u=>{X.fillStyle='#000c';X.fillRect(0,0,W,H);win(4,4,W-8,18);txt('EMBER TRIAD — vs '+RIVALS[u.id].n,10,9,'#ffd860',7);const[a,b]=score(u);txt(a+' - '+b,W-10,9,'#fff',7,'right');
  const bx=80,by=36;X.fillStyle='#2a1a10';X.fillRect(bx-4,by-4,104,104);X.fillStyle='#4a3020';for(let i=0;i<9;i++)X.fillRect(bx+(i%3)*32,by+(i/3|0)*32,30,30);
  u.board.forEach((c,i)=>{if(c)drawCard(c,bx+(i%3)*32+1,by+(i/3|0)*32+1);if(c&&u.ft>0&&u.flash&&u.flash.includes(i)){X.globalAlpha=u.ft;X.fillStyle='#fff';X.fillRect(bx+(i%3)*32,by+(i/3|0)*32,30,30);X.globalAlpha=1;}});
  if(u.st==='cell'&&u.turn===0){const x=bx+(u.cell%3)*32,y=by+(u.cell/3|0)*32;X.strokeStyle=Math.sin(T*10)>0?'#ffe060':'#fff';X.lineWidth=2;X.strokeRect(x-1,y-1,32,32);X.lineWidth=1;}
  u.me.forEach((c,i)=>{const x=10+(u.st==='hand'&&i===u.sel?6:0),y=30+i*30;drawCard(c,x,y);});if(u.st==='hand'&&u.turn===0)cursor(2,40+u.sel*30);
  u.ai.forEach((c,i)=>drawCard(c,W-40,30+i*30,true));
  win(4,H-46,W-8,42);const sel=u.me[u.sel];
  if(u.st==='end')txt(u.res==='win'?'YOU WIN!':u.res==='lose'?'YOU LOSE...':'DRAW',W/2,H-38,u.res==='win'?'#ffe060':'#f88',9,'center');
  else txt(u.turn===1?RIVALS[u.id].n+' is thinking...':u.st==='hand'?'Choose a card (A), B: forfeit':'Choose a square (A), B: back',12,H-40,'#fff',7);
  if(sel&&u.st!=='end')txt(CARDS[sel.k][0],12,H-28,'#9cf',7);txt('A side higher than the touching side flips it.',12,H-16,'#bbd',6);}};
XDOOR.ex_parlor=()=>{dialog(['The Gilded Ember card parlor. Smoke, candlelight, and the soft slap of cards.','Card Master Oriel sits by the window. (Speak to her outside, or to any player on the islands.)']);};

// ======================================================================================================
// MINIGAME 3: THE VALORGATE COLOSSEUM — four ranks, back-to-back fights, no game over if you fall.
// ======================================================================================================
const RANKS=[{n:'Bronze Cup',req:()=>!!G.flags.wyrm,rq:'',lv:17,rounds:[['yeti'],['gsentry','fwisp'],['yeti','sbat','sbat']],g:1200,eq:['lionmail'],t:'Lionhide Vest'},
 {n:'Silver Cup',req:()=>!!G.flags.hydra,rq:'Silver opens to fighters who have felled the Mire Hydra.',lv:22,rounds:[['lizard','drowned'],['umbral'],['stalker','stalker','mwraith']],g:2500,eq:['gladius'],t:'Valor Gladius'},
 {n:'Gold Cup',req:()=>!!G.flags.warden,rq:'Gold is for those who broke the Eclipse.',lv:27,rounds:[['throneguard','oathbound'],['hollowhound','hollowhound','crownbat'],['oathbound','throneguard','shardling']],g:5000,eq:['victorrod','victormace'],t:'Victor\'s Rod and Victor\'s Mace'},
 {n:'Champion',req:()=>!!G.flags.seneschal,rq:'Vasska only fights those who have walked the Hollow Citadel.',lv:33,rounds:[['crownknight','kingshade'],['vasska']],g:10000,eq:['vasskapride','lionheart'],t:'Vasska\'s Pride and Lionheart Mail',card:'vasska'}];
function healAll(){G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});}
XDOOR.ex_arena=()=>{const e=EXS(),opts=RANKS.map((r,i)=>(e.arena>i?'* ':'')+r.n);opts.push('Leave');
 choice('Herald: Welcome to the Colosseum! Which cup will you fight for? (Party healed before and after. Fall, and the healers drag you out.)',opts,i=>{if(i>=RANKS.length)return;const r=RANKS[i];
  if(!r.req())return dialog(['Herald: Not yet, friend. '+r.rq]);if(i>e.arena)return dialog(['Herald: Win the '+RANKS[e.arena].n+' first!']);
  healAll();transition(()=>dialog(['Herald: LADIES AND GENTLEFOLK! Fighting for the '+r.n+'... the embers of Thornwick!','(Round 1 of '+r.rounds.length+'.)'],()=>arenaRound(i,0)));});};
function arenaRound(ri,n){const r=RANKS[ri],g=r.rounds[n],boss=g.includes('vasska');if(boss)return dialog(['A lion-maned woman in red and gold steps out. The crowd goes silent, then insane.','Grand Champion Vasska: Thornwick\'s embers. I\'ve heard. Show me if it\'s true.','Kael: (grinning) Lyra — ice. She\'s all fire.'],()=>{startBattle(g,'ash',true);B.arena={ri,n};});
 startBattle(g,'ash',false);B.arena={ri,n};}
const _fwEX=finishWin;finishWin=function(){if(!(B&&B.arena))return _fwEX();const{ri,n}=B.arena,r=RANKS[ri];
 transition(()=>{scene='map';B=null;if(n+1<r.rounds.length)return dialog(['Herald: The crowd roars! Round '+(n+2)+' of '+r.rounds.length+' — no rest for the brave!'],()=>arenaRound(ri,n+1));
  const e=EXS();const first=e.arena<=ri;healAll();const L=['Herald: VICTORY! The '+r.n+' goes to the embers of Thornwick!'];
  if(first){e.arena=ri+1;G.gold+=r.g;r.eq.forEach(k=>G.eq[k]=(G.eq[k]||0)+1);if(r.card)addCard(r.card);L.push('Got '+r.t+' and '+r.g+' G!');if(r.card)L.push('Got the Vasska card!');
   if(ri===3)L.push('Vasska: (laughing, flat on the sand) Well fought! Come back whenever you want a real workout.','— You are the Grand Champion of Valorgate —');}
  else{G.gold+=Math.round(r.g*0.1);L.push('(A rematch purse: '+Math.round(r.g*0.1)+' G.)');}sfx('coin');save();dialog(L);});};
const _updBattleEX=updBattle;updBattle=function(dt){if(B&&B.arena&&B.end==='lose'&&B.endT>0.8&&(P.a||P.b)){transition(()=>{scene='map';B=null;healAll();dialog(['The healers drag you off the sand to polite applause.','Herald: Not today! Train up and try the cup again.']);});return;}return _updBattleEX(dt);};

// ======================================================================================================
// MENU > Records: completion tracker
// ======================================================================================================
{const i=MOPTS.indexOf('Save');MOPTS.splice(i<0?MOPTS.length-1:i,0,'Records');}
const _updMenuEX=updMenu;updMenu=function(u,dt){if(!u.sub&&P.a&&MOPTS[u.i]==='Records'){sfx('ok');UI.push({k:'records'});return;}return _updMenuEX(u,dt);};
function records(){const e=EXS();const towns=EXPOI.filter(p=>e.seen[p.id]).length,dn=Object.keys(DUN).filter(m=>DUNDONE(m)).length,sp=Object.keys(e.log).length,cd=Object.keys(CARDS).filter(k=>e.cards[k]).length,rv=Object.keys(RIVALS).filter(r=>e.beat[r]).length;
 const parts=[[towns,4],[dn,4],[e.arena,4],[sp,Object.keys(FISH).length],[cd,Object.keys(CARDS).length],[rv,Object.keys(RIVALS).length]];
 return {towns,dn,arena:e.arena,sp,cd,rv,pct:Math.round(100*parts.reduce((s,[a,b])=>s+a/b,0)/parts.length)};}
XUI.records={u:u=>{if(P.a||P.b||P.menu){UI.pop();sfx('no');}},d:()=>{const r=records(),e=EXS();X.fillStyle='#000a';X.fillRect(0,0,W,H);win(4,4,W-8,18);txt('RECORDS — the Wayfarer\'s journal',10,9,'#ffd860',8);
 win(4,24,W-8,H-28);const L=[['Places found (by airship)',r.towns+'/4'],['Optional dungeons cleared',r.dn+'/4'],['Colosseum cups',r.arena+'/4'+(r.arena>=4?'  CHAMPION':'')],
  ['Fish species',r.sp+'/'+Object.keys(FISH).length],['Ember Triad cards',r.cd+'/'+Object.keys(CARDS).length],['Card rivals beaten',r.rv+'/'+Object.keys(RIVALS).length]];
 L.forEach(([a,b],i)=>{txt(a,14,32+i*16,'#fff',7);txt(b,W-14,32+i*16,'#9cf',7,'right');});
 txt('Dungeons:',14,134,'#ffd0a0',7);Object.keys(DUN).forEach((m,i)=>txt((DUNDONE(m)?'* ':EXS().seen[m]?'- ':'? ')+(EXS().seen[m]||DUNDONE(m)?DUN[m].name:'???'),20+(i%2)*116,146+(i/2|0)*11,DUNDONE(m)?'#7a8':'#fff',6));
 txt('Wayfarer completion: '+r.pct+'%',W/2,178,'#ffe060',8,'center');bar(30,192,W-60,r.pct/100,'#ffd040','#402010');}};

window.EX={DUN,PLATES,LEVERS,BRAZ,MIRRORS,EXPOI,FISH,CARDS,RIVALS,RANKS,EXSHOP,EXMAPS,pz,solved,applyPuzzle,pressLever,lightBrazier,turnMirror,stepPlate,
 startFishing,rollFish,landFish,startDuel,duelOffer,flipsFor,aiMove,myDeck,addCard,score,arenaRound,records,exInteract,EXS};
