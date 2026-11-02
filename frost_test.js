// Chapter 4 (Frost and Thunder): run with a static server on :8765 (python3 -m http.server 8765). Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=f=>p.evaluate(f);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});const stepUp=async d=>{await p.evaluate(d=>DBG.press(d),d);await w(250);await p.evaluate(d=>DBG.rel(d),d);};
await w(1500);
// --- setup: end of Chapter 3
await ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,noenc:1});
 G.party.forEach(m=>{m.lv=18;m.b.hp=520;m.b.mp=140;m.b.atk=60;m.b.mag=60;m.b.def=40;m.b.spd=16;m.hp=520;m.mp=140;});G.gold=5000;window.SKY_NOENC=1;});
ok(await ev(()=>!!PAINT.wyrm&&!!SKYART.wyvern),'painted Rime Wyrm + Storm Wyvern art loaded');
// --- all maps are rectangular, every door is reachable and no NPC stands on or in front of a door
ok(await ev(()=>['tundra','hollowfrost','spire'].every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'Chapter 4 maps are rectangular');
ok(await ev(()=>{for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC (any town) on a door or its doorstep');
ok(await ev(()=>{DBG.enterMap('hollowfrost',11,10,'up');const reach=(tx,ty)=>{const q=[[G.x,G.y]],seen={};seen[G.x+','+G.y]=1;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)return true;
 for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2)||MAPS[G.map].doors[k])continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;};
 return Object.keys(MAPS.hollowfrost.doors).every(d=>{const[x,y]=d.split(',').map(Number);return reach(x,y+1);});}),'every Hollowfrost doorstep reachable');
// --- sky: Rimespire isle, Kade's Stormbreaker ambush
await ev(()=>{DBG.setScene('skymap');DBG.G.map='sky';});
const toPOI=async id=>{await p.evaluate(id=>{const q=SKY.POI.find(q=>q.id===id);SKY.S.x=q.x*16+8;SKY.S.y=q.y*16+30;SKY.S.alt=0;},id);await w(300);};
await toPOI('rime');await w(500);await shot('32_sky_rimespire_isle.png');
await k('a');ok(await until(()=>DBG.scene==='skybattle','a',40),'Varra Kade ambushes with the Stormbreaker');await w(1200);await shot('33_sky_stormbreaker.png');
ok(await ev(()=>SKY.SB.en.n==='Ashclaw Stormbreaker'),'sky boss is the Stormbreaker');
await ev(()=>{SKY.SB.en.hp=40;SKY.autoPlan();SKY.startExec();});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'Stormbreaker battle ends');
ok(await until(()=>DBG.scene==='skymap'&&DBG.G.flags.kade2===1,'a',60),'Stormbreaker defeated');await until(()=>DBG.UI.length===0);
// --- storm wyvern random sky battle
await ev(()=>{SKY.startSkyBattle('wyvern');});await w(1400);await shot('34_sky_storm_wyvern.png');
ok(await ev(()=>SKY.SB.en.n==='Storm Wyvern'),'Storm Wyvern sky battle');
await ev(()=>{SKY.SB.en.hp=30;SKY.autoPlan();SKY.startExec();});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'wyvern battle ends');await until(()=>DBG.scene==='skymap'&&DBG.UI.length===0,'a',60);
ok(await ev(()=>{DBG.G.sky.y=4*16;const c={};for(let i=0;i<200;i++){const r=rollSkyEnemy();c[r]=1;}return c.wyvern;}),'wyverns roam the northern skies');
// --- land: chapter card
await toPOI('rime');await k('a');ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='tundra'&&DBG.UI.length>0,'x',30),'landed in the Galeshear Tundra with chapter card');
await w(500);await shot('35_frost_chapter_card.png');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('tundra',8,5,'up');});await w(2700);await shot('36_galeshear_tundra.png');
// spire gate sealed
await ev(()=>{DBG.enterMap('tundra',21,2,'up');});await stepUp('up');await w(300);
ok(await ev(()=>DBG.G.map==='tundra'&&DBG.UI.length>0),'Spire gate sealed without the sigil');await until(()=>DBG.UI.length===0);
// --- Hollowfrost
await ev(()=>{DBG.enterMap('hollowfrost',11,10,'up');});await w(2700);await shot('37_hollowfrost.png');
await ev(()=>{DBG.enterMap('hollowfrost',11,9,'left');});await w(200);await k('a');await w(500);await shot('38_isolde_dialog.png');
await until(()=>DBG.UI.length===0);ok(await ev(()=>DBG.G.flags.isolde===1),'Warden Isolde gives the sigil');
// inn by walking into its door
await ev(()=>{DBG.G.party.forEach(m=>m.hp=1);DBG.enterMap('hollowfrost',3,4,'up');});await stepUp('up');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'x',20),'Hearthfrost Inn opens');await k('a');await w(900);await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.party.every(m=>m.hp>1)),'inn restores HP');
// trading post
await ev(()=>{DBG.enterMap('hollowfrost',8,8,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Trading Post opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await k('b');await until(()=>DBG.UI.length===0,'b');
// smithy
await ev(()=>{DBG.enterMap('hollowfrost',17,4,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Torvald\'s Smithy opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await w(200);await k('a');await w(200);await shot('39_torvald_smithy.png');
ok(await ev(()=>DBG.G.eq.sunbrand===1),'bought Sunforge Blade');await k('b');await until(()=>DBG.UI.length===0,'b');
// tundra battle
await ev(()=>{DBG.enterMap('tundra',8,5,'up');DBG.startBattle(['yeti','fwisp','sbat'],'snow');});await w(1800);await shot('40_tundra_battle.png');
ok(await until(()=>DBG.scene==='map','a',500),'won a tundra battle');
// --- Stormglass Spire
await ev(()=>{DBG.UI.length=0;DBG.enterMap('tundra',21,2,'up');});await stepUp('up');
ok(await until(()=>DBG.G.map==='spire','x',30),'entered the Stormglass Spire');await w(2600);
await ev(()=>{DBG.enterMap('spire',1,6,'up');});await w(200);await k('a');ok(await ev(()=>DBG.G.eq.frostfur===1),'chest: Frostfur Cloak');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.startBattle(['gsentry','rslime'],'glacier');});await w(1800);await shot('41_spire_battle.png');ok(await until(()=>DBG.scene==='map','a',500),'won a Spire battle');
await ev(()=>{DBG.UI.length=0;DBG.enterMap('spire',11,6,'up');});await w(600);await shot('42_spire_wyrm_on_map.png');
ok(await ev(()=>blocked(11,2)),'Wyrm blocks the way before the fight');
await ev(()=>{DBG.enterMap('spire',11,4,'up');});await stepUp('up');
ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Rime Wyrm battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(100);await shot('43_rime_wyrm_battle.png');
ok(await ev(()=>DBG.B.en[0].n==='Rime Wyrm'&&DBG.B.cave==='glacier'),'glacier backdrop + boss');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.scene==='map'&&DBG.G.flags.wyrm===1,'a',600),'Rime Wyrm defeated');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',40),'chapter complete choice');await k('down');await k('a');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('hollowfrost',11,9,'left');});await w(200);await k('a');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.eq.wyrmscale===1&&DBG.G.flags.isoldegift===1),'Isolde gives Wyrmscale Mail');
// ship pad -> sky at Hollowfrost
await ev(()=>{DBG.enterMap('tundra',7,8,'down');});await stepUp('down');
ok(await until(()=>DBG.scene==='skymap','x',20),'boarded the Cinderwing from the tundra');ok(await ev(()=>SKY.nearPOI()&&SKY.nearPOI().id==='rime'),'ship starts at Hollowfrost');
// save / load
await ev(()=>{DBG.setScene('map');DBG.enterMap('hollowfrost',11,10,'up');DBG.save();});await p.reload();await w(1200);await k('down');await k('a');await w(1500);
ok(await ev(()=>DBG.scene==='map'&&DBG.G.map==='hollowfrost'&&DBG.G.flags.wyrm===1),'save/load in Hollowfrost');
console.log('ERRORS',JSON.stringify(errs));await b.close();process.exit(errs.length?1:0);})();
