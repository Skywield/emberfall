// Chapter 7 (The Hollow Throne): run with a static server on :8765 (python3 -m http.server 8765). Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=f=>p.evaluate(f);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});const stepUp=async d=>{await p.evaluate(d=>DBG.press(d),d);await w(250);await p.evaluate(d=>DBG.rel(d),d);};
await w(1500);
// --- setup: end of Chapter 6, Varra trusted
await ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,rime:1,kade2:1,isolde:1,wyrm:1,verd:1,kade3:1,sefa:1,hydra:1,sefagift:1,gloaming:1,nightfall:1,seren:1,varra:1,varraT:1,warden:1,serengift:1,noenc:1});Object.assign(G.sky.flags,{kade2:1,kade3:1,nightfall:1});
 G.party.forEach(m=>{m.lv=36;m.b.hp=1200;m.b.mp=260;m.b.atk=110;m.b.mag=110;m.b.def=72;m.b.spd=20;m.hp=1200;m.mp=260;});G.gold=12000;window.SKY_NOENC=1;});
ok(await ev(()=>!!PAINT.seneschal&&!!SKYART.seraph&&!!SKYART.crownwing),'painted Hollow Seneschal + Throne Seraph + Crownwing art loaded');
ok(await ev(()=>['causeway','lastlight','citadel'].every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'Chapter 7 maps are rectangular');
ok(await ev(()=>{for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC (any town) on a door or its doorstep');
ok(await ev(()=>{DBG.enterMap('lastlight',11,10,'up');const reach=(tx,ty)=>{const q=[[G.x,G.y]],seen={};seen[G.x+','+G.y]=1;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)return true;
 for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2)||MAPS[G.map].doors[k])continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;};
 return Object.keys(MAPS.lastlight.doors).every(d=>{const[x,y]=d.split(',').map(Number);return reach(x,y+1);})&&reach(10,1);}),'every Lastlight doorstep reachable');
ok(await ev(()=>{DBG.enterMap('citadel',11,13,'up');const q=[[11,13]],seen={'11,13':1};while(q.length){const[x,y]=q.shift();if(y===3)return true;for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2))continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;}),'Citadel summit reachable from the entrance');
// --- sky: the Sundered Reach, Throne Seraph with Varra on the flank
await ev(()=>{DBG.setScene('skymap');DBG.G.map='sky';});
const toPOI=async id=>{await p.evaluate(id=>{const q=SKY.POI.find(q=>q.id===id);SKY.S.x=q.x*16+8;SKY.S.y=q.y*16+30;SKY.S.alt=0;},id);await w(300);};
await toPOI('reach');await w(500);await shot('69_sky_sundered_reach.png');
await k('a');ok(await until(()=>DBG.scene==='skybattle','a',40),'Throne Seraph rises');await w(1200);
ok(await ev(()=>SKY.SB.en.n==='Throne Seraph'&&SKY.SB.varra===true),'sky boss is the Throne Seraph, Varra flies with you');
await ev(()=>{SKY.autoPlan();SKY.startExec();});await w(2600);await shot('70_sky_throne_seraph.png');
ok(await until(()=>SKY.SB&&SKY.SB.log.some(l=>l.includes('Black Tempest')),'x',60),'Varra\'s Black Tempest joins the attack');
await ev(()=>{SKY.SB.en.hp=40;});ok(await until(()=>SKY.SB&&SKY.SB.phase!=='exec','x',120),'round ends');
await ev(()=>{if(SKY.SB.phase==='plan'){SKY.autoPlan();SKY.startExec();}});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'Seraph battle ends');
ok(await until(()=>DBG.scene==='skymap'&&DBG.G.flags.seraph===1,'a',60),'Throne Seraph defeated');await until(()=>DBG.UI.length===0);
// --- roaming Crownwing Drake
await ev(()=>{SKY.startSkyBattle('crownwing');});await w(1400);await shot('71_sky_crownwing.png');
ok(await ev(()=>SKY.SB.en.n==='Crownwing Drake'&&!SKY.SB.varra),'Crownwing Drake sky battle');
await ev(()=>{SKY.SB.en.hp=30;SKY.autoPlan();SKY.startExec();});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'drake battle ends');await until(()=>DBG.scene==='skymap'&&DBG.UI.length===0,'a',60);
ok(await ev(()=>{DBG.G.sky.x=8*16;DBG.G.sky.y=6*16;const c={};for(let i=0;i<200;i++){const r=rollSkyEnemy();c[r]=1;}return c.crownwing;}),'crownwing drakes roam the Reach');
// --- land: chapter card
await toPOI('reach');await w(250);
ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='causeway'&&DBG.UI.length>0,'a',40),'landed on the Shattered Causeway with chapter card');
await w(700);await shot('72_throne_chapter_card.png');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('causeway',10,5,'up');});await w(2700);await shot('73_shattered_causeway.png');
await ev(()=>{DBG.enterMap('causeway',21,2,'up');});await stepUp('up');await w(300);
ok(await ev(()=>DBG.G.map==='causeway'&&DBG.UI.length>0),'Citadel gate sealed without the Throne Sigil');await until(()=>DBG.UI.length===0);
// --- Lastlight Camp
await ev(()=>{DBG.enterMap('lastlight',11,10,'up');});await w(2700);await shot('74_lastlight_camp.png');
await ev(()=>{DBG.enterMap('lastlight',11,9,'left');});await w(200);await k('a');await w(500);await k('a');await w(400);await shot('75_aldwin_dialog.png');
await until(()=>DBG.UI.length===0);ok(await ev(()=>DBG.G.flags.aldwin===1),'Keeper Aldwin gives the Throne Sigil');
await ev(()=>{DBG.enterMap('lastlight',5,9,'left');});await w(200);await k('a');await w(500);await shot('76_varra_camp.png');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.flags.varracamp===1&&DBG.G.eq.lastmantle===1),'trusted Varra waits at camp with the Lastlight Mantle');
ok(await ev(()=>{DBG.G.flags.varraT=0;const n=NPCS.lastlight.some(n=>n.s==='varra');DBG.G.flags.varraT=1;return !n&&NPCS.lastlight.some(n=>n.s==='varra');}),'Varra only at camp if she was trusted');
await ev(()=>{DBG.G.party.forEach(m=>m.hp=1);DBG.enterMap('lastlight',3,4,'up');});await stepUp('up');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'x',20),'Lastlight Inn opens');await k('a');await w(900);await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.party.every(m=>m.hp>1)),'inn restores HP');
await ev(()=>{DBG.enterMap('lastlight',9,8,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Posy\'s Sutler Tent opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await k('b');await until(()=>DBG.UI.length===0,'b');
await ev(()=>{DBG.enterMap('lastlight',16,4,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Marrow\'s Thronesteel Forge opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await w(200);await k('a');await w(200);await shot('77_marrow_forge.png');
ok(await ev(()=>DBG.G.eq.sunderblade>=1),'bought the Sunderblade');await k('b');await until(()=>DBG.UI.length===0,'b');
await ev(()=>{DBG.enterMap('causeway',10,5,'up');DBG.startBattle(['hollowhound','voidooze','crownbat'],'throne');});await w(1800);await shot('78_causeway_battle.png');
ok(await until(()=>DBG.scene==='map','a',500),'won a Causeway battle');
// --- Hollow Citadel
await ev(()=>{DBG.UI.length=0;DBG.enterMap('causeway',21,2,'up');});await stepUp('up');
ok(await until(()=>DBG.G.map==='citadel','x',30),'entered the Hollow Citadel');await w(2600);
await ev(()=>{DBG.enterMap('citadel',1,6,'up');});await w(200);await k('a');ok(await ev(()=>DBG.G.eq.lastmantle===2),'chest: Lastlight Mantle');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.startBattle(['throneguard','oathbound','shardling'],'throne');});await w(1800);await shot('79_citadel_battle.png');ok(await until(()=>DBG.scene==='map','a',500),'won a Citadel battle');
await ev(()=>{DBG.UI.length=0;DBG.enterMap('citadel',11,5,'up');});await w(2800);await shot('80_citadel_seneschal_on_map.png');
ok(await ev(()=>blocked(11,2)),'Seneschal blocks the way before the fight');
await ev(()=>{DBG.enterMap('citadel',11,4,'up');});await stepUp('up');
ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Hollow Seneschal battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(100);await shot('81_hollow_seneschal_battle.png');
ok(await ev(()=>DBG.B.en[0].n==='Hollow Seneschal'&&DBG.B.cave==='throne'),'throne backdrop + boss');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.scene==='map'&&DBG.G.flags.seneschal===1,'a',600),'Hollow Seneschal defeated');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',40),'chapter complete choice');await k('down');await k('a');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('lastlight',11,9,'left');});await w(200);await k('a');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.eq.seneschalaegis===1&&DBG.G.flags.aldwingift===1),'Aldwin gives the Seneschal\'s Aegis');
await ev(()=>{DBG.enterMap('causeway',7,8,'down');});await stepUp('down');
ok(await until(()=>DBG.scene==='skymap','x',20),'boarded the Cinderwing from the Causeway');ok(await ev(()=>SKY.nearPOI()&&SKY.nearPOI().id==='reach'),'ship starts at the Reach');
await ev(()=>{DBG.setScene('map');DBG.enterMap('lastlight',11,10,'up');DBG.save();});await p.reload();await w(1200);await k('down');await k('a');await w(1500);
ok(await ev(()=>DBG.scene==='map'&&DBG.G.map==='lastlight'&&DBG.G.flags.seneschal===1),'save/load in Lastlight Camp');
console.log('ERRORS',JSON.stringify(errs));await b.close();process.exit(errs.length?1:0);})();
