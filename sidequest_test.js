// Side quests + superbosses (sidequests.js) and the balance pass (balance.js): run with a static server on :8765. Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=(f,a)=>p.evaluate(f,a);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});const step=async d=>{await p.evaluate(d=>DBG.press(d),d);await w(250);await p.evaluate(d=>DBG.rel(d),d);};
const talk=async(map,x,y,d)=>{await ev(([map,x,y,d])=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap(map,x,y,d);},[map,x,y,d]);await w(300);await k('a');await w(500);};
const accept=async()=>{const c=await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',40);await k('a');await w(200);await until(()=>DBG.UI.length===0||DBG.UI.some(u=>u.k==='choice'),'a',20);return c;};
const done=id=>ev(id=>DBG.G.sq&&DBG.G.sq[id]&&DBG.G.sq[id].s===2,id);
await w(1500);
// --- balance pass is loaded; Ch1 untouched
ok(await ev(()=>window.BALANCE&&EN.slime.hp===42&&EN.boss.hp===1100&&EN.goblin.atk===13),'balance.js loaded; Chapter 1 numbers unchanged');
ok(await ev(()=>EN.seneschal.hp>12500&&EN.warden.hp>8800&&EN.tyrant.hp>2600),'mid/late bosses re-tuned');
// --- setup: story finished up to Ch7, Varra trusted
const setup=()=>ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,rime:1,kade2:1,isolde:1,wyrm:1,verd:1,kade3:1,sefa:1,hydra:1,sefagift:1,gloaming:1,nightfall:1,seren:1,varra:1,varraT:1,warden:1,serengift:1,reach:1,seraph:1,aldwin:1,seneschal:1,aldwingift:1,noenc:1});
 G.party.forEach(m=>{m.lv=50;m.b.hp=2400;m.b.mp=400;m.b.atk=170;m.b.mag=170;m.b.def=110;m.b.spd=26;m.hp=2400;m.mp=400;});G.gold=20000;G.items.heartdraught=5;window.SKY_NOENC=1;});
await setup();
ok(await ev(()=>!!PAINT.cindral&&!!PAINT.omen&&!!SKYART.sovereign),'painted Cindral, Omen and Tempest Sovereign art loaded');
ok(await ev(()=>['sq_grotto','sq_rift'].every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'side maps are rectangular');
ok(await ev(()=>MAPS.spire.name!=='Emberdeep Grotto'&&MAPS.spire.chests['1,5']==='frostfur'&&MAPS.forge.chests['1,5']==='ashveil'&&MAPS.world.warps.length===2),'story maps (incl. the Ch4 spire) untouched');
ok(await ev(()=>{DBG.G.flags.clear=1;for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC (any town, incl. quest givers) on a door or its doorstep');
ok(await ev(()=>{for(const m in SQ.SQNPC)for(const n of SQ.SQNPC[m]){const M=MAPS[m];if(SOLID.has(M.rows[n.y][n.x]))return false;if((M.warps||[]).some(w=>w.x===n.x&&w.y===n.y))return false;if(NPCS[m].filter(o=>o.x===n.x&&o.y===n.y).length!==1)return false;}return true;}),'quest givers stand on open ground, not warps or other NPCs');
ok(await ev(()=>{DBG.G.flags.varraT=0;const a=NPCS.duskhollow.some(n=>n.q==='varra');DBG.G.flags.varraT=1;return !a&&NPCS.duskhollow.some(n=>n.q==='varra');}),'Varra\'s quest only appears if she was trusted');
ok(await ev(()=>SQ.QUESTS.length>=8&&SQ.QUESTS.length<=10&&['kael','lyra','mira','varra'].every(c=>SQ.QUESTS.some(q=>q.who===c))),'8-10 quests incl. personal quests for Kael, Lyra, Mira and Varra');
await ev(()=>{DBG.G.flags.clear=0;});
// --- Thornwick: Farmer Odo's bat hunt (real kill counting)
await talk('town',15,12,'right');await w(300);await shot('104_quest_giver_odo.png');ok(await accept(),'Odo offers his quest');
ok(await ev(()=>DBG.G.sq.bats.s===1),'quest accepted: Bats by the River');
for(let r=0;r<2;r++){await ev(()=>{DBG.UI.length=0;DBG.startBattle(['bat','bat','bat']);});await w(1500);await ev(()=>DBG.B.en.forEach(e=>e.hp=1));ok(await until(()=>DBG.scene==='map','a',300),'won a Dusk Bat fight');await until(()=>DBG.UI.length===0);}
ok(await ev(()=>DBG.G.sq.bats.n>=6),'six Dusk Bats counted');
await talk('town',15,12,'right');ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines.some(l=>l.startsWith('Got '))&&u.lines[u.i]&&u.lines[u.i].startsWith('Got ')),'a',20),'Odo pays out');await w(500);await shot('105_reward_batwing_charm.png');
await until(()=>DBG.UI.length===0);ok(await done('bats')&&await ev(()=>DBG.G.eq.batcharm===1),'reward: Batwing Charm');
// --- Galewright Point: feathers (fetch)
await ev(()=>{DBG.G.sky.mat.feather=5;});await talk('harbor',3,8,'left');await accept();await talk('harbor',3,8,'left');await until(()=>DBG.UI.length===0);
ok(await done('feathers')&&await ev(()=>DBG.G.eq.galevest===1&&DBG.G.sky.mat.feather===1),'fetch quest: 4 Gale Feathers -> Galeweave Vest');
// --- Cinderholt: Mira's personal quest
await talk('cinderholt',7,11,'up');await k('a',2);await w(500);await shot('106_mira_quest_dialog.png');await accept();
await ev(()=>{DBG.UI.length=0;DBG.startBattle(['ewisp','ewisp','ewisp']);});await w(1500);await ev(()=>DBG.B.en.forEach(e=>e.hp=1));await until(()=>DBG.scene==='map','a',300);await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.G.sq.mira.n=Math.max(DBG.G.sq.mira.n,6);});await talk('cinderholt',7,11,'up');await until(()=>DBG.UI.length===0);
ok(await done('mira')&&await ev(()=>DBG.G.eq.cindercenser===1),'Mira: The Ashen Shrine -> Cinder Censer');
// --- Hollowfrost: Lyra's journal (pick-up in the Glacier Spire)
await talk('hollowfrost',12,9,'right');await accept();
await ev(()=>{DBG.UI.length=0;DBG.enterMap('spire',5,9,'right');});await w(400);await shot('107_lyra_journal_sparkle.png');await step('right');
ok(await until(()=>DBG.UI.length>0,'x',10)&&await ev(()=>DBG.G.sq.lyra.got===1),'found Orrel\'s Journal in the Spire');await until(()=>DBG.UI.length===0);
await talk('hollowfrost',12,9,'right');await k('a');await w(500);await shot('108_lyra_reads_journal.png');await until(()=>DBG.UI.length===0);
ok(await done('lyra')&&await ev(()=>DBG.G.eq.orrelcodex===1),'Lyra: Master Orrel\'s Journal -> Orrel\'s Codex');
// --- Reedhaven: lizard cull
await talk('reedhaven',12,9,'right');await accept();await ev(()=>{DBG.G.sq.lizards.n=6;});await talk('reedhaven',12,9,'right');await until(()=>DBG.UI.length===0);
ok(await done('lizards')&&await ev(()=>DBG.G.eq.reedcloak===1),'Mirewood Cull -> Reedwoven Cloak');
// --- Duskhollow: Varra's colours
await talk('duskhollow',12,9,'right');await accept();await ev(()=>{DBG.UI.length=0;DBG.enterMap('bastion',5,6,'right');});await step('right');await until(()=>DBG.UI.length===0,'a',20);
await talk('duskhollow',12,9,'right');for(let i=0;i<3;i++)await k('a');await w(500);await shot('109_varra_quest_turnin.png');await until(()=>DBG.UI.length===0);
ok(await done('varra')&&await ev(()=>DBG.G.eq.redgale===1),'Varra: Colours of the Tempest -> Red Gale Cutlass');
// --- Lastlight: Kael's lamp
await talk('lastlight',12,9,'right');await k('a',2);await w(500);await shot('110_kael_quest_dialog.png');await accept();await ev(()=>{DBG.G.sq.kael.n=5;});
await talk('lastlight',12,9,'right');await until(()=>DBG.UI.length===0);ok(await done('kael')&&await ev(()=>DBG.G.eq.heirloom===1),'Kael: The Last Lamp -> Thornwick Heirloom');
// --- Superboss 1: Cindral in the hidden Emberdeep Grotto
await talk('cinderholt',16,9,'right');await accept();ok(await ev(()=>DBG.G.sq.grotto.s===1),'Gorrim\'s quest: The Buried Sun');
await ev(()=>{DBG.UI.length=0;DBG.enterMap('world',21,8,'right');});await w(300);await shot('111_hidden_vent.png');await step('right');
ok(await until(()=>DBG.G.map==='sq_grotto','x',30),'the hidden vent leads into Emberdeep Grotto');
ok(await p.evaluate(()=>{const q=[[11,12]],seen={'11,12':1};while(q.length){const[x,y]=q.shift();if(y===3)return true;for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2))continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;}),'Grotto: Cindral\'s landing reachable from the entrance');
await ev(()=>{DBG.enterMap('sq_grotto',12,6,'up');});await w(2400);await shot('112_grotto_cindral_on_map.png');
await ev(()=>{DBG.enterMap('sq_grotto',11,4,'up');});await step('up');ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Cindral battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(350);await shot('113_cindral_battle.png');ok(await ev(()=>DBG.B.en[0].n==='Buried Sun Cindral'&&DBG.B.en[0].mhp>=40000),'Cindral, the Buried Sun (superboss HP)');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.scene==='map'&&DBG.G.flags.cindral===1,'a',300),'Cindral defeated');await until(()=>DBG.UI.length===0);
await talk('cinderholt',16,9,'right');ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines[u.i]&&u.lines[u.i].startsWith('Got ')),'a',20),'Gorrim rewards you');await w(500);await shot('114_reward_buried_sun.png');await until(()=>DBG.UI.length===0);
ok(await done('grotto')&&await ev(()=>DBG.G.eq.sunrod===1&&DBG.G.eq.sunmail===1),'rewards: Rod of the Buried Sun + Buried Sun Mail');
// --- Superboss 2 (sky): the Tempest Sovereign
await talk('harbor',14,7,'up');await accept();
ok(await ev(()=>{const P=SKY.POI.find(p=>p.id==='sqeye');return SKY.canFly(P.x*16+8,P.y*16+8+30)&&!SKY.POI.some(o=>o!==P&&Math.hypot(o.x-P.x,o.y-P.y)<5);}),'Eye of the Storm is reachable and clear of other islands');
await ev(()=>{DBG.UI.length=0;SKY.startSkyMap(SKY.POI.find(p=>p.id==='sqeye'));});await w(1800);await shot('115_sky_eye_of_storm.png');
await ev(()=>SKY.skyInteract(SKY.POI.find(p=>p.id==='sqeye')));ok(await until(()=>DBG.scene==='skybattle','a',40),'Tempest Sovereign battle (sky)');await w(1200);
ok(await ev(()=>SKY.SB.en.n==='Tempest Sovereign'&&SKY.SB.en.mhp>=12000),'sky superboss is the Tempest Sovereign');
await ev(()=>{SKY.autoPlan();SKY.startExec();});await w(2600);await shot('116_sky_tempest_sovereign.png');
await ev(()=>{SKY.SB.en.hp=40;});await until(()=>SKY.SB&&SKY.SB.phase!=='exec','x',120);await ev(()=>{if(SKY.SB&&SKY.SB.phase==='plan'){SKY.autoPlan();SKY.startExec();}});
ok(await until(()=>DBG.G.flags.sovereign===1&&DBG.scene==='skymap','a',120),'Tempest Sovereign defeated');await until(()=>DBG.UI.length===0);
await talk('harbor',14,7,'up');await until(()=>DBG.UI.length===0);ok(await done('storm')&&await ev(()=>DBG.G.eq.stormcrown===1),'Eye of the Storm -> Stormcrown Crook');
// --- Quest Log in the menu
await ev(()=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap('town',10,13,'up');});await w(300);await k('menu');await w(200);
await until(()=>DBG.UI.length&&DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Quests'),'down',12);await k('a');await w(300);
ok(await ev(()=>DBG.UI.some(u=>u.k==='qlog')),'Quest Log opens from the menu');await k('down',2);await w(300);await shot('117_quest_log.png');await k('b');await k('b');await until(()=>DBG.UI.length===0,'b');
// --- Post-game: Omen needs the Clear save
await talk('hearth',12,10,'right');await until(()=>DBG.UI.length===0);ok(await ev(()=>!DBG.G.sq.omen),'Omen is sealed before the Clear save');
await ev(()=>{DBG.G.flags.clear=1;DBG.save();});await p.reload();await w(1200);await k('down');await k('a');await w(1500);
ok(await ev(()=>DBG.scene==='map'&&DBG.G.flags.clear===1&&DBG.G.sq.grotto.s===2),'save/load keeps quests + Clear flag');
await ev(()=>{const G=DBG.G;G.party.forEach(m=>{m.hp=2400;});window.SKY_NOENC=1;G.flags.noenc=1;});
await talk('hearth',12,10,'right');await k('a');await w(400);await shot('118_sable_postgame_dialog.png');await accept();
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',20),'Sable offers to open the rift');await k('a');ok(await until(()=>DBG.G.map==='sq_rift','x',30),'entered the Hollow Rift');
await w(2200);await ev(()=>{DBG.enterMap('sq_rift',10,4,'up');});await step('up');ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Omen battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(350);await shot('119_omen_battle.png');ok(await ev(()=>DBG.B.en[0].n==='The Seventh Shade'&&DBG.B.cave==='heart'),'Omen, the Seventh Shade');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.scene==='map'&&DBG.G.flags.omen===1,'a',300),'Omen defeated');await until(()=>DBG.UI.length===0);
await talk('hearth',12,10,'right');ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines[u.i]&&u.lines[u.i].startsWith('Got ')),'a',20),'Sable rewards you');await w(500);await shot('120_reward_dawn_of_thornwick.png');await until(()=>DBG.UI.length===0);
ok(await done('omen')&&await ev(()=>DBG.G.eq.dawnthorn===1&&DBG.G.eq.shadeveil===1),'rewards: Dawn of Thornwick + Seventh Veil');
await ev(()=>{DBG.UI.length=0;DBG.openMenu();DBG.UI.push({k:'qlog',i:9});});await w(400);await shot('121_quest_log_complete.png');
ok(await ev(()=>SQ.QUESTS.every(q=>DBG.G.sq[q.id]&&DBG.G.sq[q.id].s===2)),'all 10 side quests complete');
console.log('ERRORS',JSON.stringify(errs));await b.close();process.exit(errs.length?1:0);})();
