'use strict';
// Emberfall — Chapter 8 (FINALE): The Ember Crown. The Stair of Light, the sky above the throne-realm, the Founders' Hearth
// (last rest, sutler and forge) and the Heart Spire, where Vorthane the Hollow King waits with five shards of his own heart.
// Kael carries the sixth in his hand and the seventh in his chest. What he does with it decides how the story ends.
// Varra (trusted in Chapter 6) flies the Black Tempest at the Cinderwing's flank and fires on the King; confronted, she climbs alone.
// ---------- tiles (new symbols only: ^ *) ----------
TILES['^']=[tileCanvas(g=>{px(g,'#0c0818',0,0,16,16);px(g,'#e8c070',1,1,14,14);px(g,'#fff0c0',1,1,14,2);px(g,'#b08040',1,13,14,2);px(g,'#ffe8a0',3+(rnd()*8|0),6,3,1);px(g,'#ffd890',0,0,16,1);})];
TILES['*']=[0,1].map(f=>tileCanvas(g=>{px(g,'#3a3248',0,0,16,16);px(g,'#c0a050',2,12,12,3);px(g,'#ff6050',6,3-f,4,8);px(g,'#ffd0a0',7,4-f,2,4);px(g,f?'#ffe080':'#ff9070',5,2-f,1,1);px(g,f?'#ff9070':'#ffe080',10,6-f,1,1);}));

// ---------- art ----------
loadPaint('vorthane','vorthane');loadPaint('vorthane2','vorthane_heart');
{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
 g.globalCompositeOperation='source-atop';g.fillStyle='rgba(200,20,40,0.45)';g.fillRect(0,0,c.width,c.height);SKYART.heartwyrm=c;};im.src='art/game/throne_seraph.png';}
EN_ART.heartwisp={rows:EN_ART.wisp.rows,pal:{k:'#200408',Y:'#ffb040',W:'#ffffff',b:'#200408'}};
EN_ART.crownknight={rows:EN_ART.skeleton.rows,pal:{k:'#0a0410',W:'#ffd070'}};
EN_ART.hollowseraph={rows:EN_ART.bat.rows,pal:{k:'#0a0410',W:'#ffffff',P:'#c0a050',r:'#ff4060'}};
EN_ART.embermaw={rows:EN_ART.slime.rows,pal:{k:'#100404',G:'#8a1a20',g:'#3a0810',W:'#ffd070'}};
EN_ART.kingshade={rows:EN_ART.goblin.rows,pal:{k:'#06020a',G:'#2a1a3a',r:'#ffd070',W:'#0a0410',B:'#ff4060'}};
['heartwisp','crownknight','hollowseraph','embermaw','kingshade'].forEach(k=>EN_ART[k].c=mkSpr(EN_ART[k].rows,EN_ART[k].pal));
EN_ART.vorthane=EN_ART.boss;EN_ART.vorthane2=EN_ART.boss;
SPR.elowen=charSet({H:'#ffe8b0',h:'#ffffff',s:'#e0c0a0',O:'#c08030',A:'#ffd070',L:'#6a3a1a',b:'#2a1408'});

// ---------- data: last items and the ultimate gear ----------
Object.assign(ITEMS,{phoenixember:{n:'Phoenix Ember',p:1500,rev:true,tgt:'Pdead',d:'Revive at 50% HP'},heartdraught:{n:'Heart Draught',p:1200,heal:1800,mpr:300,tgt:'P',d:'1800 HP, 300 MP'}});
Object.assign(EQ,{emberheart:{n:'Emberheart',slot:'w',who:'kael',atk:84,p:0},foundersedge:{n:'Founder\'s Edge',slot:'w',who:'kael',atk:76,p:5200},
 starkindle:{n:'Starkindle Rod',slot:'w',who:'lyra',atk:12,mag:70,p:5000},keeperscrook:{n:'Keeper\'s Crook',slot:'w',who:'mira',atk:56,mag:56,p:5000},
 hearthmail:{n:'Hearthguard Mail',slot:'a',def:52,mdef:40,p:4200},foundersveil:{n:'Founders\' Raiment',slot:'a',def:60,mdef:60,p:0},galecharm:{n:'Red Gale Coat',slot:'a',def:50,mdef:52,p:0}});
const HSHOP=['heartdraught','phoenixember','crownsalve','seraphdown','megaether','xpotion','tonic'];
const HSMITH=['foundersedge','starkindle','keeperscrook','hearthmail','sunderblade','crownrod','seraphmace','throneplate'];
Object.assign(EN,{
 heartwisp:{n:'Heartfire Wisp',hp:640,atk:30,def:30,mag:92,spd:21,xp:260,g:150,weak:'ice',res:'fire',caster:1},
 crownknight:{n:'Crown Knight',hp:1250,atk:104,def:64,mag:20,spd:12,xp:320,g:210,weak:'bolt',res:'ice'},
 hollowseraph:{n:'Hollow Seraph',hp:760,atk:92,def:34,mag:70,spd:24,xp:290,g:180,weak:'ice'},
 embermaw:{n:'Ember Maw',hp:1100,atk:96,def:58,mag:40,spd:9,xp:300,g:200,weak:'ice',res:'fire'},
 kingshade:{n:'King\'s Shade',hp:980,atk:88,def:44,mag:84,spd:17,xp:340,g:230,weak:'fire',res:'dark',caster:1},
 vorthane:{n:'Vorthane, the Hollow King',hp:16000,atk:108,def:52,mag:88,spd:16,xp:0,g:0,weak:'ice',res:'fire',boss:1,ai:vorthaneAI},
 vorthane2:{n:'Vorthane, Heart Unbound',hp:22000,atk:118,def:50,mag:100,spd:18,xp:30000,g:20000,weak:'bolt',res:'dark',boss:1,ai:heartAI}});
function vorthaneAI(u,P,t){const ph=u.hp<u.mhp*0.5;if(ph&&!u.crowned){u.crowned=1;u.atk=Math.round(u.atk*1.2);u.mag=Math.round(u.mag*1.2);
  dialog(['Vorthane: Five beats. Hear them? Every one of them was MINE before your founders cut them out of me.']);return {u,kind:'buff',name:'Crown of Cinders',tg:[u]};}const r=Math.random();
 if(r<(ph?0.32:0.22))return {u,kind:'mag',name:'Five-Shard Corona',pow:1.15,el:'fire',tg:P,fx:'fire'};
 if(r<0.45)return {u,kind:'mag',name:'Chains of the Hollow',pow:0.95,el:'dark',tg:P,fx:'dark'};
 if(r<0.8)return {u,kind:'phys',name:'Hollow Edge',pow:1.8,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1.1,tg:[t],fx:'slash'};}
function heartAI(u,P,t){if(u.hp<u.mhp*0.4&&!u.seventh){u.seventh=1;seventhCalls();return {u,kind:'buff',name:'The Seventh Calls',tg:[u]};}const r=Math.random(),ph=u.seventh;
 if(r<(ph?0.3:0.2))return {u,kind:'mag',name:'Sevenfold Eclipse',pow:ph?1.5:1.25,el:'dark',tg:P,fx:'dark'};
 if(r<0.45)return {u,kind:'mag',name:'Ember Requiem',pow:1.15,el:'fire',tg:P,fx:'fire'};
 if(r<0.8)return {u,kind:'phys',name:'Sunder the Heir',pow:2.1,tg:[t],fx:'slash'};return {u,kind:'phys',pow:1.2,tg:[t],fx:'slash'};}
// phase 3: the seventh shard answers — Kael's ember wakes, the party is kindled
function seventhCalls(){B.pt.forEach(p=>{if(p.m.hp>0){const S=st(p.m);p.m.hp=Math.min(S.hp,p.m.hp+Math.round(S.hp*0.35));p.atb=100;}});B.pt.forEach(p=>p.buf=Math.max(p.buf,1.3));B.shake=6;sfx('heal');
 dialog(['Vorthane: GIVE IT TO ME, HEIR! The seventh beat — I can HEAR it in you!','Kael: ...So can I. And it isn\'t yours.','The seventh shard blazes in Kael\'s chest. Warmth floods the party. (HP restored, power rising!)','Lyra: Kael, you\'re glowing like the Crown itself!','Mira: Then let\'s finish this — all of us, together!']);}
// phase 2: the Hollow King falls... and his heart tears free
const _ce8=checkEnd;checkEnd=function(){const e=B&&B.en[0];if(e&&e.k==='vorthane'&&e.hp<=0&&alive(B.pt).length>0){
  const d=EN.vorthane2;Object.assign(e,{k:'vorthane2',n:d.n,hp:d.hp,mhp:d.hp,atk:d.atk,def:d.def,mag:d.mag,spd:d.spd,weak:d.weak,res:d.res,ai:d.ai,xp:d.xp,g:d.g,die:0,flash:1,atb:60,pend:0,crowned:0});
  B.q=B.q.filter(a=>a.u!==e);B.shake=8;sfx('enc');B.msg='Vorthane, Heart Unbound';B.msgT=1.6;
  const L=['The Hollow King staggers. His armour splits — and the five shards tear out of the hollow in his chest.','Vorthane: NO. I will not be cut apart AGAIN!','The shards fuse into a burning heart. Wings of black fire unfold from the King\'s back.','Vorthane, Heart Unbound: I was the first flame, heir. I kept this world warm for a thousand years. I am OWED a heart!'];
  if(G.flags.varraT){const v=1800;e.hp-=v;B.nums.push({x:70,y:40,v,c:'#ff9090',t:0});L.push('A broadside roars out of the dark! The Black Tempest wheels past the throne, cannons blazing. ('+v+' dmg)','Varra Kade: Told you, Thornwick. ALL the way up!');}
  else L.push('Lyra: No ship, no fleet. Just the three of us and a thousand years of cold.','Kael: Three is enough.');
  dialog(L);return;}
 _ce8();};

// ---------- maps ----------
addMap('stair',{name:'The Stair of Light',mus:'world',bbg:'heart',rows:[
"########################",
"##########^^^^##########",
"##########^^^^##########",
"###c^^^^^^^^^^^^^^^^c###",
"###^######^##^######^###",
"###^######^##^######^###",
"###^^^^^^^^*^^^^^^^^^###",
"#######^########^#######",
"####^^^^^^^##^^^^^^^####",
"####^#####^##^#####^####",
"####^##c^^^^^^^^c##^####",
"####^#####^##^#####^####",
"####^^^^^^^##^^^^^^^####",
"##########^^^^##########",
"##########^^^^##########",
"##########^^^^##########"],
 enc:20,pool:[['heartwisp','heartwisp'],['hollowseraph'],['hollowseraph','heartwisp'],['embermaw'],['crownknight'],['shardling','heartwisp']],
 warps:[{x:11,y:15,to:'citadel',tx:11,ty:2,d:'down'},{x:12,y:15,to:'citadel',tx:12,ty:2,d:'down'}],
 chests:{'3,3':'foundersveil','20,3':'heartdraught','7,10':'phoenixember','16,10':'starkindle'}});
addMap('hearth',{name:'The Founders\' Hearth',mus:'town',rows:[
"QQQQQQQQQQQNQQQQQQQQ",
"QMRRRRMMMMMNMMMRRRRQ",
"QMRRRRMMMMMNMMMRRRRQ",
"QMWDWWMMMMMNMMMWDWWQ",
"QMNNNNNNNNNNNNNNNNMQ",
"QMMNMMMRRRRRMMMMNMMQ",
"QMMNMMMRRRRRMMMMNMMQ",
"QMMNMMMWWDWWMMMMNMMQ",
"QMMNNNNNNNNNNNNNNMMQ",
"QMMMMMMMMMM*MMMMQMMQ",
"QMMQMMMMMMMNMMMMMMMQ",
"QQQQQQQQQQQNQQQQQQQQ"],
 enc:0,warps:[{x:11,y:0,to:'heartspire',tx:11,ty:14,d:'up'},{x:11,y:11,to:'stair',tx:11,ty:2,d:'down'}],doors:{'3,3':'ehinn','16,3':'ehsmith','9,7':'ehshop'}});
addMap('heartspire',{name:'The Heart Spire',dark:1,mus:'cave',bbg:'heart',rows:[
"%%%%%%%%%%%%%%%%%%%%%%%%",
"%%%%%%%%%++++++%%%%%%%%%",
"%%%%%%%%++++++++%%%%%%%%",
"%%%%%%%%%++++++%%%%%%%%%",
"%%%%%%%%%%%++%%%%%%%%%%%",
"%%%%%%%%%%%==%%%%%%%%%%%",
"%c++++++++*+++++++++++c%",
"%+%%%%%%%%%++%%%%%%%%%+%",
"%+%###%%%%%++%%%%%###%+%",
"%+==###++++++++++###==+%",
"%+%###%+%%%==%%%+%###%+%",
"%+%%%%%+%%%==%%%+%%%%%+%",
"%++++++++c%++%c++++++++%",
"%%%%%%%%%%%++%%%%%%%%%%%",
"%%%%%%%%%%%++%%%%%%%%%%%",
"%%%%%%%%%%%OO%%%%%%%%%%%"],
 enc:14,pool:[['crownknight'],['kingshade'],['kingshade','heartwisp'],['crownknight','hollowseraph'],['embermaw','kingshade'],['crownknight','kingshade'],['hollowseraph','hollowseraph','heartwisp']],
 warps:[{x:11,y:15,to:'hearth',tx:11,ty:1,d:'down'},{x:12,y:15,to:'hearth',tx:11,ty:1,d:'down'}],
 chests:{'1,6':'emberheart','22,6':'keeperscrook','9,12':'phoenixember','14,12':'heartdraught'}});

// NPCs stand clear of every door and the tile in front of it (doorSafe test). Varra only rests here if she was trusted.
const FNPCS=[
 {x:7,y:4,s:'elowen',d:'down',act:()=>elowenAct()},
 {x:13,y:9,s:'orrin',d:'left',lines:()=>['Orrin Vey: The Cinderwing\'s tied to a founder\'s pillar. Old girl\'s earned a rest — and so have you.','Orrin Vey: Inn\'s the far west door, the sutler\'s in the middle hall, and the forge is east.','Orrin Vey: The Heart Spire is due north. Whatever happens up there, kid... I\'ll be waiting with the engines warm.']},
 {x:5,y:9,s:'varra',d:'right',act:()=>dialog(['Varra Kade: Never thought a pirate would sit by a founders\' fire. Feels... warm. Don\'t tell anyone.','Varra Kade: When you go up, I\'ll keep the Tempest circling the Spire. If you need a broadside, you\'ll get one.']),varraOnly:1},
 {x:14,y:4,s:'guard',d:'down',lines:()=>['Ember-ghost: We were the founders\' guard. We died keeping this fire lit. The forge is just east — tell the smith you came from Thornwick.']}];
Object.defineProperty(NPCS,'hearth',{get:()=>FNPCS.filter(n=>!n.varraOnly||G.flags.varraT),enumerable:true,configurable:true});

// ---------- story ----------
let CARD8=0;
function enterStair(){transition(()=>{scene='map';UI=[];enterMap('stair',11,14,'up');if(!G.flags.stair8){G.flags.stair8=1;CARD8=3.2;save();
 dialog(['— Chapter 8: The Ember Crown —','The stair of red light hums under Kael\'s boots. Far above, five shards orbit an empty crown.','Lyra: Every step, the shard in your hand gets warmer. Can you feel it?','Kael: I can feel both of them. The one in my hand... and the one in here.','Mira: The flame-stones on the landings — the founders left them. Touch one and it\'ll keep our place. Let\'s climb.']);}});}
function elowenAct(){if(G.flags.elowen)return dialog(['Founder Elowen: The heart is not a weapon, child. It is a choice. When the moment comes, you will know.']);
 G.flags.elowen=1;G.eq.foundersveil=(G.eq.foundersveil||0)+1;G.items.phoenixember=(G.items.phoenixember||0)+2;sfx('coin');save();
 dialog(['A woman of pale fire smiles at Kael. She has his grandmother\'s eyes.','Founder Elowen: Thornwick blood. I hid a piece of his heart in our line a thousand years ago, and here you stand.','Founder Elowen: Vorthane was our king once. He gave his heart to warm the world — and the cold of the Hollow ate the rest of him.','Founder Elowen: We broke the heart into seven to stop him taking it back. We could never decide what to do with it after. That is your choice now.','Got the Founders\' Raiment and Phoenix Ember x2!','Founder Elowen: Rest at our hearth. Then climb, and end it — however you see fit.']);}
function heartwyrmEvent(){dialog(['The stair ends in empty sky. The Heart Spire hangs across the gap, wreathed in red wings.','A shape of black fire rises out of the void — a wyrm made of the King\'s own cinders.','Orrin Vey (on the comm-horn): Hold tight, kids — I\'m coming up under you! Jump!',
  'The Cinderwing swoops beneath the stair. Kael, Lyra and Mira drop onto her deck.',
  G.flags.varraT?'Varra Kade (on the comm-horn): Black Tempest on your flank, Cinderwing! One last fight, eh?':'Lyra: No Varra this time. It\'s just us and Orrin\'s old tub.','Heartfire Wyrm: THE HEIR DOES NOT CROSS.'],()=>{startSkyBattle('heartwyrm');SB.varra=!!G.flags.varraT;});}
const _finish8=finishSky;finishSky=function(){if(SB.k!=='heartwyrm')return _finish8();const S=G.sky,won=SB.end==='win';S.hull=won?SB.hull:Math.round(SB.mhull*0.6);
 transition(()=>{SB=null;scene='map';if(!won){enterMap('stair',11,3,'down');dialog(['The Cinderwing is driven back. Orrin sets you down on the Stair.','Orrin Vey: She\'ll fly again in a minute. Try again when you\'re ready.']);return;}
  G.flags.heartwyrm=1;save();enterMap('hearth',11,10,'up');dialog(['The Heartfire Wyrm bursts into a rain of cinders that drift down toward the world below — warm, harmless, like summer snow.',
   G.flags.varraT?'Varra Kade: Ha! That\'s one for the songs. I\'ll moor beside you.':'Orrin Vey: Not bad for an old tub with no escort!','Orrin Vey sets the Cinderwing down in a quiet ruin at the foot of the Spire. A fire is burning there. It has never gone out.','Mira: Someone is waiting by that fire...']);});};
function varraAloneEvent(){G.flags.varraalone=1;G.eq.galecharm=(G.eq.galecharm||0)+1;sfx('coin');save();
 dialog(['A figure slumps against a pillar, red coat torn. A broken cutlass lies beside her.','Kael: Varra?!','Varra Kade: Thornwick. Took you long enough. Flew the Tempest up here alone... figured if I got the shards first, you\'d never have to face him.','Varra Kade: Didn\'t work. His knights tore the Tempest out of the sky.','Lyra: Let us help you — Mira can—','Varra Kade: Save it for him. Here — my coat. Red Gale Coat. It\'s stopped more blades than I can count.','Got the Red Gale Coat!','Varra Kade: Go on. I\'ll hold this landing. Nobody comes up behind you. Nobody.']);}
function vorthaneEvent(){dialog(['The Heart Spire opens onto a throne of black glass and gold. Five shards orbit the head of a gaunt king in cracked armour.','Vorthane: Come up, heir. Come home.','Vorthane: Do you know what it is to be hollow, Kael? A thousand years of cold, and a crown I cannot wear because it is my HEART.','Kael: I know what you did to the world while you waited.','Vorthane: The sixth in your hand. The seventh in your chest. Give them to me — or I will open you and take them.','Lyra: He\'s weak to ice — the shards burn too hot!','Mira: Everyone, together. This is the last fight!'],()=>startBattle(['vorthane'],'heart',true));}
XWIN.vorthane2=()=>{G.flags.vorthane=1;save();dialog(['Vorthane, Heart Unbound, falls to his knees. The burning heart cracks and spills its five shards across the throne.','The sixth leaps from Kael\'s hand. The seventh pulls at his chest, like a tide.','Vorthane: ...Please. It is so cold.','For a moment there is no King, only an old man shivering on a throne of glass.','Lyra: Kael, it\'s your choice. The founders never could make it.'],
 ()=>choice('The seventh shard burns in Kael\'s chest.',['Make it whole','Break it'],i=>{G.flags.ending=i===0?'keeper':'free';
  const L=i===0?['Kael: You kept the world warm once. Then let\'s keep it warm — together, the way it was meant to be.','Kael lays his hand on the cracked heart. The seventh shard flows out of him like sunrise.','The Ember Crown rings whole for the first time in a thousand years. The hollow in Vorthane\'s chest fills with light.','Vorthane: ...Warm. I remember warm. Thank you, child of Thornwick.','The old king smiles — and is gone, gently, like a candle at dawn. The Crown settles on Kael\'s brow, then fades into his heart.','Kael: I\'ll keep it. Not on a throne. At home.']
   :['Kael: Nobody should have to be a heart for the whole world. Not you. Not me.','Kael closes his fist around the sixth shard and lets the seventh burn out of his chest — then he brings both down on the throne.','The Ember Crown shatters into light. Not seven pieces this time. A thousand. A million. They fall like stars over every land below.','Vorthane: ...Free. Both of us. Thank you, child of Thornwick.','The old king fades with a sigh, the hollow in him finally quiet. The Hollow beneath the earth goes quiet with him.','Kael: The world will have to keep itself warm now. I think it can.'];
  L.push('The throne-realm begins to sink — slowly, gently — back down toward the clouds.',G.flags.varraT?'Varra Kade (on the comm-horn): Tempest and Cinderwing, under the throne! Everybody JUMP!':'Orrin Vey (on the comm-horn): Cinderwing\'s under you! Jump, kids — JUMP!');
  dialog(L,()=>startEnding());}));};
XSTEP.push(()=>{const t=tileAt(G.map,G.x,G.y);
 if(t==='*'){if(G.spLast!==G.map+G.x+','+G.y){G.spLast=G.map+G.x+','+G.y;G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['The founders\' flame-stone flares. HP and MP restored. Game saved.']);return true;}}else G.spLast=null;
 if(G.map==='citadel'&&G.flags.seneschal&&G.y===1){enterStair();return true;}
 if(G.map==='stair'&&G.y===1){if(!G.flags.heartwyrm){G.y=2;G.d='down';heartwyrmEvent();}else transition(()=>enterMap('hearth',11,10,'up'));return true;}
 if(G.map==='heartspire'&&G.y===9&&!G.flags.varraT&&G.flags.varra&&!G.flags.varraalone){varraAloneEvent();return true;}
 if(G.map==='heartspire'&&!G.flags.vorthane&&G.y===4){vorthaneEvent();return true;}return false;});
const _blk8=blocked;blocked=function(x,y){if(G.map==='heartspire'&&!G.flags.vorthane&&y===3&&x>=9&&x<=14)return true;return _blk8(x,y);};
XFENTS.push((ents,cx,cy)=>{if(G.map==='heartspire'&&!G.flags.vorthane){const bob=Math.sin(T*1.1)*1.5;ents.push({y:32,dr:()=>{
 if(!drawPaint('vorthane',12*16-cx,3*16-cy+8+bob,{sc:0.45,alpha:0.97})){const b=EN_ART.boss.c;X.drawImage(b,12*16-cx-b.width/2,1*16-cy-4+bob);}
 for(let i=0;i<5;i++){const a=T*1.2+i/5*6.28;X.fillStyle='#ff5060';X.fillRect(12*16-cx+Math.cos(a)*18-1,1*16-cy+Math.sin(a)*6-1,3,3);}}});}
 if(G.map==='heartspire'&&!G.flags.varraT&&G.flags.varra&&G.flags.varraalone){ents.push({y:9*16,dr:()=>{const s=SPR.varra;if(s)X.drawImage(s.right[0],9*16-cx,9*16-cy-8,16,24);}});}});
XDOOR.ehinn=()=>choice('Founder\'s Hearth: rest by the undying fire? (free)',['Rest','Leave'],i=>{if(i)return;transition(()=>{G.party.forEach(m=>{const s=st(m);m.hp=s.hp;m.mp=s.mp;});sfx('heal');save();dialog(['You sleep by the founders\' fire and dream of Thornwick. (HP/MP restored, game saved.)']);});});
XDOOR.ehshop=()=>openShop({stock:HSHOP,n:'Hearthside Sutler',who:'Ember-ghost Tamsin'});
XDOOR.ehsmith=()=>openShop({stock:HSMITH,n:'Founders\' Forge',who:'Ember-ghost Corin'});
Object.assign(SKYEN,{heartwyrm:{n:'Heartfire Wyrm',hull:7400,atk:124,spd:14,weak:'side',art:'heartwyrm',hollow:1,boss:1,w:{hit:3,red:2.6,purple:1.5,green:1.2},g:4200,xp:3000,drop:{feather:6,ichor:6},sc:1.15}});
const _df8=drawField;drawField=function(){_df8();if(CARD8>0&&G.map==='stair'){CARD8=Math.max(0.6,CARD8-1/60);const a=Math.min(1,CARD8);X.globalAlpha=a*0.85;X.fillStyle='#120408';X.fillRect(0,40,W,62);X.globalAlpha=a;
 X.fillStyle='#ffb040';X.fillRect(20,44,W-40,1);X.fillRect(20,97,W-40,1);txt('CHAPTER VIII · FINALE',W/2,52,'#ff8070',8,'center');txt('The Ember Crown',W/2,66,'#ffe0a0',14,'center');txt('Seven shards. One heart. One choice.',W/2,86,'#f0d0c0',7,'center');X.globalAlpha=1;if(!UI.length)CARD8=0;}};

// ---------- ending: epilogues, credits, back to title ----------
let EN8=null;
function epi(){const keep=G.flags.ending==='keeper',vt=!!G.flags.varraT;return [
 {t:keep?'The Crown Made Whole':'The Crown Set Free',s:null,L:keep?['The throne-realm settled into the clouds above Thornwick and slept.','That winter was the warmest anyone could remember.','The Hollow beneath the earth never stirred again.']:['A million sparks fell on the world, and every hearth they touched caught fire.','The Hollow beneath the earth went quiet and stayed quiet.','No king, no crown. Just a world learning to keep itself warm.']},
 {t:'Kael',s:'kael',L:keep?['Kael went home to Thornwick with the Crown\'s warmth in his chest.','He never sat a throne. He mended fences, kept the founders\' fire, and on cold nights the whole village gathered at his door.']:['Kael went home to Thornwick with an ordinary heart and a scar shaped like a star.','He learned the forge from old Marrow and made plough-blades out of thronesteel.']},
 {t:'Lyra',s:'lyra',L:['Lyra opened a school of flame-craft in the ruins of Ashmarch.','Her first lesson was always the same: "Fire is a promise to keep someone warm."']},
 {t:'Mira',s:'mira',L:['Mira walked every road the party had travelled, healing what the Hollow had hurt.','Hollowfrost, Reedhaven, Duskhollow — each kept a bed ready for her, and she came back to every one.']},
 vt?{t:'Varra Kade',s:'varra',L:['Varra Kade flew the rebuilt Black Tempest under new red sails.','She hunts sky-pirates now, and pays her crews in honest gold. Mostly honest.','Every midsummer, the Tempest lands in Thornwick for pie.']}
   :{t:'Varra Kade',s:'varra',L:['Varra Kade held the Spire landing alone, as she promised. Nobody came up behind the heroes.','When the throne-realm sank, she was not found. Her cutlass was.','Sailors still swear a red sail is seen at dusk over the Reach. Kael leaves a lantern lit for it.']},
 {t:'Orrin Vey & the Cinderwing',s:'orrin',L:['Orrin flew the Cinderwing until her engines sang their last, then built a bigger one.','Galewright Point became the busiest dock in the sky.']},
 {t:'Thornwick',s:'aldwin',L:['Keeper Aldwin and the folk of Lastlight came down from the Reach and moved home.','Elder Bran gave them the houses by the fountain. The village was not small any more.']},
 {t:'THE END',s:'party',L:['Thank you for playing.']}];}
function startEnding(){transition(()=>{UI=[];scene='finale_end';EN8={i:0,t:0,cr:-1,cy:0,S:epi()};});}
const CREDITS=['EMBERFALL','','by Skywield Games','','— Story & Design —','Skywield Games','','— Programming —','Skywield Games','','— Painted Art —','Skywield Games','','— Music & Sound —','Skywield Games','','— Starring —','Kael · Lyra · Mira','Orrin Vey · Varra Kade','Keeper Aldwin · Founder Elowen','and Vorthane, the Hollow King','','— Special Thanks —','Every player who climbed the Stair','','Emberfall','by Skywield Games','','Thank you for playing!'];
function finishCredits(){G.flags.clear=1;G.flags.noenc=0;enterMap('hearth',11,9,'up');save();transition(()=>{scene='title';TT.i=1;EN8=null;});}
XSCN.finale_end={mus:()=>'town',u(dt){const E=EN8;if(!E)return;E.t+=dt;
 if(E.cr<0){if(P.a&&E.t>0.8){sfx('move');E.i++;E.t=0;if(E.i>=E.S.length){E.cr=0;E.cy=H+10;}}return;}
 E.cy-=dt*24;if(P.a)E.cy-=40;if(P.b)E.cy-=400;if(E.cy<-CREDITS.length*14-20&&!fadeDir)finishCredits();},
 d(){const E=EN8;X.fillStyle='#05030c';X.fillRect(0,0,W,H);const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0420');g.addColorStop(0.7,G.flags.ending==='free'?'#2a1a4a':'#4a1a20');g.addColorStop(1,'#c0602a');X.fillStyle=g;X.fillRect(0,0,W,H);drawEmbers();if(!E)return;
  if(E.cr>=0){CREDITS.forEach((l,i)=>{const y=E.cy+i*14;if(y<-12||y>H)return;const big=l==='EMBERFALL'||l==='Emberfall';txt(l,W/2,y,big?'#ffd060':l.startsWith('—')?'#ff9070':'#f0e0d0',big?14:8,'center');});
   txt('A: faster   B: skip',W-6,H-10,'#888',6,'right');return;}
  const s=E.S[E.i],a=Math.min(1,E.t*1.6);X.globalAlpha=a;txt(s.t,W/2,18,'#ffd070',s.t==='THE END'?18:12,'center');
  if(s.s==='party'){['kael','lyra','mira'].forEach((k,i)=>{if(!drawPaint(k,W/2-60+i*60,140,{sc:0.9}))X.drawImage(SPR[k].down[0],W/2-72+i*60,100,24,32);});}
  else if(s.s&&PAINT[s.s])drawPaint(s.s,W/2,130,{sc:1.6});else if(s.s&&SPR[s.s])X.drawImage(SPR[s.s].down[Math.floor(T*3)%3],W/2-18,64,36,48);
  if(!s.s){for(let i=0;i<7;i++){const an=i/7*6.28+T*0.4,r=G.flags.ending==='free'?30+E.t*20:26;X.fillStyle=['#ff6020','#ffb030','#ffe060'][i%3];X.fillRect(W/2+Math.cos(an)*r-2,80+Math.sin(an)*r*0.5-2,4,4);}}
  let y=s.s==='party'?150:136;s.L.forEach(l=>wrap(l,40).forEach(w=>{txt(w,W/2,y,'#fff',7,'center');y+=10;}));X.globalAlpha=1;
  txt('A: next',W-6,H-10,'#888',6,'right');}};
// title: a gold "CLEAR" mark when the save has finished the game
const _dt8=drawTitle;drawTitle=function(){_dt8();try{const s=JSON.parse(localStorage.getItem('emberfall_save')||'null');if(s&&s.flags&&s.flags.clear){txt('★ CLEAR',W/2+30,137,'#ffd060',7,'left');}}catch(e){}};
window.FINALE={enterStair,elowenAct,heartwyrmEvent,vorthaneEvent,startEnding,finishCredits,HSHOP,HSMITH,get EN8(){return EN8;}};
