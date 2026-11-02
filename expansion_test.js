// Wayfarer expansion (expansion.js): 3 optional towns, 4 optional dungeons with puzzles + painted bosses, and 3 minigames
// (fishing, Ember Triad cards, the Valorgate Colosseum). Needs a static server on :8765. Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=(f,a)=>p.evaluate(f,a);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;if(key)await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});
const at=async(map,x,y,d)=>{await ev(([map,x,y,d])=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap(map,x,y,d);DBG.UI.length=0;},[map,x,y,d]);await w(250);};
const step=async d=>{const s0=await ev(()=>[G.x,G.y]);await ev(d=>DBG.press(d),d);for(let i=0;i<30;i++){await w(25);const s=await ev(()=>[G.x,G.y,DBG.UI.length]);if(s[0]!==s0[0]||s[1]!==s0[1]||s[2])break;}
 await ev(d=>DBG.rel(d),d);for(let i=0;i<30;i++){if(await ev(()=>F.mv===0))break;await w(25);}await w(80);};
async function walk(tx,ty){for(let g=0;g<80;g++){const s=await ev(()=>[G.x,G.y]);if(s[0]===tx&&s[1]===ty)return true;
 const d=await ev(([tx,ty])=>{const q=[[G.x,G.y]],prev={};prev[G.x+','+G.y]=null;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)break;
  for(const[d,[a,b]]of Object.entries(DIRS)){const k=(x+a)+','+(y+b);if(k in prev||blocked(x+a,y+b)||(MAPS[G.map].doors||{})[k]||MAPS[G.map].warps.some(w=>w.x===x+a&&w.y===y+b&&!(x+a===tx&&y+b===ty)))continue;prev[k]=[x+','+y,d];q.push([x+a,y+b]);}}
  let k=tx+','+ty;if(!(k in prev))return null;let d=null;while(prev[k]){d=prev[k][1];k=prev[k][0];}return d;},[tx,ty]);if(!d)return false;await step(d);
 if(await ev(()=>DBG.UI.length>0))await until(()=>DBG.UI.length===0,'a',30);}return false;}
const winFight=async()=>{await w(1200);await ev(()=>DBG.B&&DBG.B.en.forEach(e=>e.hp=1));return until(()=>DBG.scene==='map','a',300);};
await w(1500);
// ---------- data / structure ----------
ok(await ev(()=>!!window.EX&&EX.EXMAPS.every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'expansion loaded; all 7 new maps rectangular');
ok(await ev(()=>MAPS.town.doors['3,4']==='inn'&&MAPS.world.warps.length===2&&MAPS.spire.chests['1,5']==='frostfur'&&EN.slime.hp===42&&SQ.QUESTS.length===10),'story maps, Ch1 numbers and the quest list untouched');
await w(800);ok(await ev(()=>['colossus','sentinel','lqueen','seer','vasska'].every(k=>!!PAINT[k])),'painted bosses (green-screen keyed) loaded');
ok(await ev(()=>{DBG.newGame();DBG.G.flags.clear=1;for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC in any town on a door or its doorstep');
ok(await ev(()=>EX.EXMAPS.every(m=>(NPCS[m]||[]).every(n=>{const M=MAPS[m];return !SOLID.has(M.rows[n.y][n.x])&&!M.warps.some(w=>w.x===n.x&&w.y===n.y)&&!M.warps.some(w=>w.tx===n.x&&w.ty===n.y)&&NPCS[m].filter(o=>o.x===n.x&&o.y===n.y).length===1;}))),'new NPCs stand on open ground, off warps, spawn points and each other');
ok(await ev(()=>{const reach=(m,sx,sy,tx,ty)=>{DBG.enterMap(m,sx,sy,'up');DBG.UI.length=0;const q=[[sx,sy]],seen={};seen[sx+','+sy]=1;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)return true;
  for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2)||(MAPS[m].doors||{})[k])continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;};
 return ['ex_saltmere','ex_valor','ex_lantern'].every(m=>Object.keys(MAPS[m].doors).every(d=>{const[x,y]=d.split(',').map(Number);return reach(m,9,1,x,y+1);})&&MAPS[m].warps.every(w=>reach(m,9,1,w.x,w.y)));}),'every new door step and exit reachable from the airship landing');
ok(await ev(()=>{const E=EN,S=EX;return E.tyrant.hp<E.colossus.hp&&E.colossus.hp<E.hydra.hp&&E.hydra.hp<E.sentinel.hp&&E.warden.hp<E.lqueen.hp&&E.seneschal.hp<E.seer.hp&&E.seer.hp<E.cindral.hp;}),'optional bosses slot into the balance.js boss curve (tyrant < colossus < hydra < sentinel; warden < queen; seneschal < seer < Cindral)');
// ---------- setup: strong party, ship, flags up to Ch7 ----------
await ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,noenc:1});
 G.party.forEach(m=>{m.lv=50;m.b.hp=2600;m.b.mp=400;m.b.atk=170;m.b.mag=170;m.b.def=110;m.b.spd=26;m.hp=2600;m.mp=400;});G.gold=30000;window.SKY_NOENC=1;});
// ---------- airship: gated POIs ----------
await ev(()=>{DBG.UI.length=0;SKY.startSkyMap(EX.EXPOI[0]);});await w(500);await shot('122_sky_saltmere_isle.png');
await ev(()=>skyInteract(EX.EXPOI[0]));await w(200);ok(await ev(()=>DBG.scene==='skymap'&&DBG.UI.some(u=>u.k==='dlg'&&/squall/.test(u.lines[0]))),'Saltmere stays closed before the Slag Tyrant falls');
await ev(()=>{DBG.UI.length=0;Object.assign(G.flags,{tyrant:1,wyrm:1,hydra:1,warden:1});skyInteract(EX.EXPOI[0]);});
ok(await until(()=>DBG.scene==='map'&&G.map==='ex_saltmere'&&DBG.UI.length>0,'',40),'landing at Saltmere (first-visit card)');await w(500);await shot('123_saltmere_arrival.png');await until(()=>DBG.UI.length===0);
// inn: really walk from the landing to the door
await ev(()=>G.party.forEach(m=>m.hp=1));ok(await walk(3,5),'walked to the Saltmere inn doorstep');await step('up');
ok(await ev(()=>DBG.UI.some(u=>u.k==='choice')),'inn door opens Nell\'s choice');const g0=await ev(()=>G.gold);await k('a');await w(900);await until(()=>DBG.UI.length===0);
ok(await ev(g0=>G.gold===g0-50&&G.party.every(m=>m.hp>1),g0),'Saltmere inn: 50G, party healed');
// shop
ok(await walk(16,5),'walked to the chandlery doorstep');await step('up');await until(()=>DBG.UI.some(u=>u.k==='choice'),'',10);await k('a');await w(200);await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');
await k('down',3);await k('a');await w(200);ok(await ev(()=>G.items.seasalt===1),'bought a Sea-Salt Tonic');await shot('124_saltmere_shop.png');await k('b');await until(()=>DBG.UI.length===0);
// ---------- FISHING ----------
await at('ex_saltmere',9,13,'left');await k('a');await w(200);ok(await ev(()=>DBG.UI.some(u=>u.k==='choice')),'facing the sea on the pier offers fishing');await k('a');await w(200);
ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='fish'),'fishing minigame opens');
await ev(()=>DBG.press('a'));await w(700);await shot('125_fishing_cast_meter.png');await ev(()=>DBG.rel('a'));await w(100);
ok(await ev(()=>DBG.UI[DBG.UI.length-1].st==='wait'),'cast thrown');await ev(()=>{const u=DBG.UI[DBG.UI.length-1];u.wait=0;u.fish='swordfish';});
ok(await until(()=>DBG.UI[DBG.UI.length-1].st==='bite','',40),'a bite!');await k('a');ok(await ev(()=>DBG.UI[DBG.UI.length-1].st==='reel'),'hooked: reel phase');
await ev(()=>DBG.press('a'));await w(900);await shot('126_fishing_reel.png');await ev(()=>DBG.rel('a'));
await ev(()=>{const u=DBG.UI[DBG.UI.length-1];u.prog=0.995;u.z=Math.max(0,u.fp-0.05);u.zv=0;});ok(await until(()=>DBG.UI[DBG.UI.length-1].st==='caught','',60),'landed the Gale Swordfish');
await w(300);await shot('127_fishing_caught.png');
for(const f of ['sardine','mackerel','crab','eel','sunfish','saltjaw'])await ev(f=>{const u=DBG.UI[DBG.UI.length-1];u.fish=f;EX.landFish(u);},f);
await k('b');await w(100);ok(await ev(()=>DBG.UI.length===0&&Object.keys(G.ex.log).length===7),'7 sea species logged');
await at('ex_lantern',8,8,'up');await k('a');await w(100);ok(await ev(()=>DBG.UI.some(u=>u.k==='choice'&&/pond/.test(u.prompt))),'Lanternhaven pond is fishable too');await k('a');await w(100);
await ev(()=>{const u=DBG.UI[DBG.UI.length-1];u.fish='koi';EX.landFish(u);});await k('b');
await at('ex_saltmere',5,12,'up');await step('up');await until(()=>DBG.UI.some(u=>u.k==='choice'),'',10);await k('down');await k('a');
ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines[u.i]&&/Leviathan Rod/.test(u.lines[u.i])),'a',40),'fish log: all 8 species -> Angler\'s Charm + Leviathan Rod');await w(400);await shot('128_fishmonger_log_reward.png');
await until(()=>DBG.UI.length===0);ok(await ev(()=>G.eq.anglercharm===1&&G.eq.tiderod===1),'fish prizes in the bag');
const gf=await ev(()=>G.gold);await ev(()=>{DBG.UI.length=0;XDOOR.ex_fishmonger();});await k('a');await until(()=>DBG.UI.length===0);ok(await ev(gf=>G.gold>gf+1500&&!Object.keys(G.ex.fish).length,gf),'sold the catch to Mara');
// ---------- DUNGEON 1: Tidewater Grotto (plates in order) ----------
await at('ex_saltmere',18,7,'right');await step('right');ok(await until(()=>G.map==='ex_grotto','',30),'Saltmere east cave -> Tidewater Grotto');await until(()=>DBG.UI.length===0);
ok(await ev(()=>blocked(11,5)),'sea-gate shut');
await at('ex_grotto',19,8,'up');await step('up');ok(await until(()=>DBG.UI.length>0,'',10)&&await ev(()=>!G.ex.pz.ex_grotto.n),'stepping on the shell first: wrong order, plates reset');await until(()=>DBG.UI.length===0);
await at('ex_grotto',3,8,'up');await step('up');await until(()=>DBG.UI.length===0);ok(await ev(()=>G.ex.pz.ex_grotto.n===1),'moon plate down (1/3)');await shot('129_grotto_tide_plates.png');
await at('ex_grotto',19,8,'up');await step('up');await until(()=>DBG.UI.length===0);
await at('ex_grotto',12,10,'down');await step('down');ok(await ev(()=>EX.solved('ex_grotto')&&!blocked(11,5)),'moon -> shell -> star: the sea-gate rises');await until(()=>DBG.UI.length===0);
await at('ex_grotto',11,6,'up');await w(300);await shot('130_grotto_gate_open_boss.png');await step('up');await step('up');
ok(await until(()=>DBG.scene==='battle','a',40),'Brine Colossus fight starts');await w(1800);await shot('131_battle_brine_colossus.png');
ok(await winFight(),'Brine Colossus defeated');ok(await until(()=>DBG.UI.length===0&&G.flags.ex_colossus,'a',40),'Colossus reward dialog');
ok(await ev(()=>G.eq.brinecleaver===1&&G.eq.shellmail===1&&G.ex.cards.colossus===1),'got Brinecleaver, Shellplate and the Colossus card');
await at('ex_grotto',11,3,'up');await k('left');await k('a');await w(100);await until(()=>DBG.UI.length===0);
await at('ex_grotto',11,12,'down');await at('ex_grotto',10,10,'up');ok(await ev(()=>!blocked(11,5)&&!blocked(11,3)),'gate and boss room stay open after leaving and returning');
// ---------- TOWN 2: Valorgate + COLOSSEUM ----------
await ev(()=>{DBG.UI.length=0;SKY.startSkyMap(EX.EXPOI[1]);skyInteract(EX.EXPOI[1]);});ok(await until(()=>G.map==='ex_valor'&&DBG.UI.length>0,'',40),'landed at Valorgate');await w(400);await shot('132_valorgate_arrival.png');await until(()=>DBG.UI.length===0);
ok(await walk(10,8),'walked to the Colosseum gate');await step('up');ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'',10),'Colosseum herald offers the cups');await w(300);await shot('133_colosseum_cups.png');
await k('a');ok(await until(()=>DBG.scene==='battle','a',40),'Bronze Cup round 1');await w(1500);await shot('134_colosseum_round1.png');
for(let r=0;r<3;r++){ok(await winFight(),'Bronze round '+(r+1)+' won');if(r<2)ok(await until(()=>DBG.scene==='battle','a',40),'next round starts without returning to town');}
ok(await until(()=>DBG.UI.length===0&&G.ex.arena===1,'a',40),'Bronze Cup won');ok(await ev(()=>G.eq.lionmail===1),'Lionhide Vest reward');
// losing in the arena is not a game over
await ev(()=>{DBG.UI.length=0;EX.arenaRound(1,0);});await w(1200);await ev(()=>{DBG.B.en.forEach(e=>{e.hp=e.mhp=999999;e.atk=9999;});G.party.forEach(m=>m.hp=1);});
ok(await until(()=>DBG.B&&DBG.B.end==='lose','',200),'party falls in the Silver Cup');ok(await until(()=>DBG.scene==='map'&&DBG.UI.length>0,'a',40),'the healers drag you out (no game over)');
ok(await ev(()=>G.party.every(m=>m.hp>1)&&G.ex.arena===1),'party restored; cup not won');await until(()=>DBG.UI.length===0);
await ev(()=>{G.flags.seneschal=1;G.ex.arena=3;DBG.UI.length=0;EX.arenaRound(3,1);});ok(await until(()=>DBG.scene==='battle','a',40),'Champion\'s Bout: Vasska');await w(1800);await shot('135_battle_champion_vasska.png');
ok(await winFight(),'Vasska beaten');ok(await until(()=>DBG.UI.length===0&&G.ex.arena===4,'a',40),'Grand Champion of Valorgate');ok(await ev(()=>G.eq.vasskapride===1&&G.ex.cards.vasska===1),'Vasska\'s Pride + Vasska card');
// ---------- DUNGEON 2: Clockwork Vault (levers) ----------
await at('ex_valor',1,14,'left');await step('left');ok(await until(()=>G.map==='ex_vault','',30),'Valorgate west wall -> Clockwork Vault');await until(()=>DBG.UI.length===0);
await at('ex_vault',4,7,'up');await k('a');await w(150);ok(await ev(()=>G.ex.pz.ex_vault.lv.join('')==='1100'),'lever 1 turns its gear and the next');
await at('ex_vault',8,7,'up');await k('a');await w(150);await shot('136_vault_levers.png');ok(await ev(()=>!EX.solved('ex_vault')&&G.ex.pz.ex_vault.lv.join('')==='1010'),'lever 2 -> 1010, not solved yet');
await at('ex_vault',8,7,'up');await k('a');await w(150);await at('ex_vault',15,7,'up');await k('a');await w(150);
ok(await ev(()=>EX.solved('ex_vault')&&G.ex.pz.ex_vault.lv.every(Boolean)),'all four lamps lit: the brass gate opens');await until(()=>DBG.UI.length===0);
await at('ex_vault',11,5,'up');await step('up');ok(await until(()=>DBG.scene==='battle','a',40),'Brass Sentinel fight');await w(1800);await shot('137_battle_brass_sentinel.png');ok(await winFight(),'Brass Sentinel defeated');
await until(()=>DBG.UI.length===0&&G.flags.ex_sentinel,'a',40);ok(await ev(()=>G.eq.clockblade===1),'Clockspring Blade');
// ---------- TOWN 3: Lanternhaven + EMBER TRIAD ----------
await ev(()=>{DBG.UI.length=0;SKY.startSkyMap(EX.EXPOI[2]);skyInteract(EX.EXPOI[2]);});ok(await until(()=>G.map==='ex_lantern'&&DBG.UI.length>0,'',40),'landed at Lanternhaven');await until(()=>DBG.UI.length===0);
await at('ex_lantern',10,6,'down');await w(300);await shot('138_lanternhaven_town.png');
const g1=await ev(()=>G.gold);ok(await walk(16,5),'walked to Lamplight Goods');await step('up');await until(()=>DBG.UI[DBG.UI.length-1]&&DBG.UI[DBG.UI.length-1].k==='shop');await k('a');await w(100);
ok(await ev(g1=>G.gold===g1-priceOf('mdraught'),g1),'bought at Lamplight Goods');await k('b');await until(()=>DBG.UI.length===0);
await at('ex_lantern',5,9,'left');await k('a');ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',20),'Pell gives a starter deck and offers a duel');ok(await ev(()=>Object.keys(G.ex.cards).length>=5),'starter cards');
await k('a');await w(200);ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='cards'),'Ember Triad board opens');
await ev(()=>{const u=DBG.UI[DBG.UI.length-1];u.turn=0;});
for(let i=0;i<60;i++){const s=await ev(()=>{const u=DBG.UI[DBG.UI.length-1];if(!u||u.k!=='cards')return 'gone';if(u.st==='end')return 'end';if(u.turn===0&&u.st==='hand'){u.cell=u.board.findIndex(c=>!c);return 'go';}return 'wait';});
 if(s==='end'||s==='gone')break;if(s==='go'){await k('a');if(i===4)await shot('139_ember_triad_place.png');await k('a');}await w(150);if(i===2)await shot('140_ember_triad_board.png');}
ok(await ev(()=>{const u=DBG.UI[DBG.UI.length-1];return u.k==='cards'&&u.st==='end'&&u.board.every(Boolean);}),'a full game of Ember Triad plays out');
ok(await ev(()=>{const u={board:Array(9).fill(null)};u.board[4]={k:'slime',o:1};return EX.flipsFor(u.board,{k:'wyrm',o:0},1,0).join()==='4'&&EX.flipsFor(u.board,{k:'bat',o:0},3,0).length===0;}),'flip rule: higher touching side flips, lower does not');
await until(()=>DBG.UI.length===0,'a',30);
await ev(()=>{G.ex.beat={pell:1,marg:1,quill:1};DBG.UI.length=0;EX.startDuel('oriel');const u=DBG.UI[DBG.UI.length-1];u.ai.forEach(c=>c.k='slime');u.me.forEach(c=>c.k='vasska');u.turn=0;});
for(let i=0;i<60;i++){const s=await ev(()=>{const u=DBG.UI[DBG.UI.length-1];if(!u||u.k!=='cards')return 'gone';if(u.st==='end')return 'end';if(u.turn===0&&u.st==='hand'){u.cell=u.board.findIndex(c=>!c);return 'go';}return 'wait';});if(s!=='wait'&&s!=='go')break;if(s==='go'){await k('a');await k('a');}await w(150);}
ok(await ev(()=>DBG.UI[DBG.UI.length-1].res==='win'),'beat Card Master Oriel');await w(300);await shot('141_ember_triad_win_oriel.png');await until(()=>DBG.UI.length===0,'a',30);ok(await ev(()=>G.eq.gildedmail===1&&G.ex.beat.oriel===1),'Gilded Ember Coat');
// ---------- DUNGEON 3: Lantern Catacombs (brazier ring) ----------
await at('ex_lantern',18,13,'right');await step('right');ok(await until(()=>G.map==='ex_crypt','',30),'Lanternhaven east -> Lantern Catacombs');await until(()=>DBG.UI.length===0);
await at('ex_crypt',7,7,'left');await k('a');await w(150);ok(await ev(()=>G.ex.pz.ex_crypt.bz.join('')==='11001'),'a brazier lights itself and both ring-neighbours');await shot('142_catacombs_braziers.png');
for(const [x,y,d] of [[15,7,'right'],[15,9,'right'],[11,9,'down'],[7,9,'left']]){await at('ex_crypt',x,y,d);await k('a');await w(150);}
ok(await ev(()=>EX.solved('ex_crypt')),'all five braziers lit: the catacomb gate melts');await until(()=>DBG.UI.length===0);
await at('ex_crypt',11,5,'up');await step('up');ok(await until(()=>DBG.scene==='battle','a',40),'Lantern Queen fight');await w(1800);await shot('143_battle_lantern_queen.png');ok(await winFight(),'Lantern Queen defeated');
await until(()=>DBG.UI.length===0&&G.flags.ex_lqueen,'a',40);ok(await ev(()=>G.eq.gravelight===1&&G.ex.cards.queen===1),'Gravelight Censer + Queen card');
// ---------- DUNGEON 4: Starfall Observatory (mirrors) ----------
await ev(()=>{DBG.UI.length=0;G.flags.seneschal=0;SKY.startSkyMap(EX.EXPOI[3]);skyInteract(EX.EXPOI[3]);});await w(200);ok(await ev(()=>DBG.scene==='skymap'),'observatory sealed before the Throne falls');
await ev(()=>{DBG.UI.length=0;G.flags.seneschal=1;skyInteract(EX.EXPOI[3]);});ok(await until(()=>G.map==='ex_obs','',40),'entered the Starfall Observatory');await until(()=>DBG.UI.length===0);
for(const [x,n] of [[5,3],[12,2],[18,1]])for(let i=0;i<n;i++){await at('ex_obs',x,8,'up');await k('a');await w(100);await until(()=>DBG.UI.length===0||EX.solved('ex_obs'));}
await until(()=>DBG.UI.length===0);ok(await ev(()=>EX.solved('ex_obs')&&G.ex.pz.ex_obs.mr.join('')==='103'),'Archer east, Crown north, Serpent west: the star-gate opens');
await at('ex_obs',11,6,'up');await w(300);await shot('144_observatory_mirrors_solved.png');await step('up');await step('up');ok(await until(()=>DBG.scene==='battle','a',40),'Starfall Seer fight');await w(1800);await shot('145_battle_starfall_seer.png');
ok(await winFight(),'Starfall Seer defeated');await until(()=>DBG.UI.length===0&&G.flags.ex_seer,'a',40);ok(await ev(()=>G.eq.starfallblade===1),'Starfall Blade');
// ---------- Records ----------
await at('ex_lantern',10,8,'down');await ev(()=>DBG.openMenu());await w(200);await until(()=>DBG.UI.length&&DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Records'),'down',14);await k('a');await w(300);
ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='records'&&EX.records().dn===4&&EX.records().arena===4&&EX.records().towns===4),'Records: 4 places, 4 dungeons, 4 cups');await shot('146_records.png');await k('b');await k('b');
// save/load keeps expansion state
ok(await ev(()=>{DBG.save();DBG.load();return G.ex&&G.ex.arena===4&&G.ex.pz.ex_obs.open===1;}),'expansion progress survives save/load');
console.log(errs.length?'ERRORS '+errs.join(' | '):'no errors');if(errs.length)process.exitCode=1;await b.close();})();
