// Chapter 6 (Beyond the Veil): run with a static server on :8765 (python3 -m http.server 8765). Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=f=>p.evaluate(f);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});const stepUp=async d=>{await p.evaluate(d=>DBG.press(d),d);await w(250);await p.evaluate(d=>DBG.rel(d),d);};
await w(1500);
// --- setup: end of Chapter 5
await ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,rime:1,kade2:1,isolde:1,wyrm:1,verd:1,kade3:1,sefa:1,hydra:1,sefagift:1,noenc:1});G.sky.flags.kade2=1;G.sky.flags.kade3=1;
 G.party.forEach(m=>{m.lv=30;m.b.hp=980;m.b.mp=220;m.b.atk=96;m.b.mag=96;m.b.def=62;m.b.spd=18;m.hp=980;m.mp=220;});G.gold=12000;window.SKY_NOENC=1;});
ok(await ev(()=>!!PAINT.warden&&!!SKYART.leviathan),'painted Eclipse Warden + Gloam Leviathan art loaded');
// --- all maps are rectangular, every door is reachable and no NPC stands on or in front of a door
ok(await ev(()=>['gloam','duskhollow','bastion'].every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'Chapter 6 maps are rectangular');
ok(await ev(()=>{for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC (any town) on a door or its doorstep');
ok(await ev(()=>{DBG.enterMap('duskhollow',11,10,'up');const reach=(tx,ty)=>{const q=[[G.x,G.y]],seen={};seen[G.x+','+G.y]=1;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)return true;
 for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2)||MAPS[G.map].doors[k])continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;};
 return Object.keys(MAPS.duskhollow.doors).every(d=>{const[x,y]=d.split(',').map(Number);return reach(x,y+1);});}),'every Duskhollow doorstep reachable');
// --- sky: Gloaming isle, Kade's Nightfall Dreadnought ambush
await ev(()=>{DBG.setScene('skymap');DBG.G.map='sky';});
const toPOI=async id=>{await p.evaluate(id=>{const q=SKY.POI.find(q=>q.id===id);SKY.S.x=q.x*16+8;SKY.S.y=q.y*16+30;SKY.S.alt=0;},id);await w(300);};
await toPOI('gloaming');await w(500);await shot('56_sky_gloaming_isle.png');
await k('a');ok(await until(()=>DBG.scene==='skybattle','a',40),'Nightfall Dreadnought ambushes');await w(1200);await shot('57_sky_nightfall.png');
ok(await ev(()=>SKY.SB.en.n==='Nightfall Dreadnought'),'sky boss is the Nightfall Dreadnought');
await ev(()=>{SKY.SB.en.hp=40;SKY.autoPlan();SKY.startExec();});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'Nightfall Dreadnought battle ends');
ok(await until(()=>DBG.scene==='skymap'&&DBG.G.flags.nightfall===1,'a',60),'Nightfall Dreadnought defeated');await until(()=>DBG.UI.length===0);
// --- storm wyvern random sky battle
await ev(()=>{SKY.startSkyBattle('leviathan');});await w(1400);await shot('58_sky_gloam_leviathan.png');
ok(await ev(()=>SKY.SB.en.n==='Gloam Leviathan'),'Gloam Leviathan sky battle');
await ev(()=>{SKY.SB.en.hp=30;SKY.autoPlan();SKY.startExec();});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'leviathan battle ends');await until(()=>DBG.scene==='skymap'&&DBG.UI.length===0,'a',60);
ok(await ev(()=>{DBG.G.sky.x=8*16;DBG.G.sky.y=6*16;const c={};for(let i=0;i<200;i++){const r=rollSkyEnemy();c[r]=1;}return c.leviathan;}),'gloam leviathans roam beyond the Veil');
// --- land: chapter card
await toPOI('gloaming');await k('a');ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='gloam'&&DBG.UI.length>0,'x',30),'landed in the Ashen Gloam with chapter card');
await w(500);await shot('59_veil_chapter_card.png');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('gloam',8,5,'up');});await w(2700);await shot('60_ashen_gloam.png');
// spire gate sealed
await ev(()=>{DBG.enterMap('gloam',21,2,'up');});await stepUp('up');await w(300);
ok(await ev(()=>DBG.G.map==='gloam'&&DBG.UI.length>0),'Bastion gate sealed without the Duskkey');await until(()=>DBG.UI.length===0);
// --- Duskhollow
await ev(()=>{DBG.enterMap('duskhollow',11,10,'up');});await w(2700);await shot('61_duskhollow.png');
await ev(()=>{DBG.enterMap('duskhollow',11,9,'left');});await w(200);await k('a');await w(500);await shot('62_seren_dialog.png');
await until(()=>DBG.UI.length===0);ok(await ev(()=>DBG.G.flags.seren===1),'Keeper Seren gives the Duskkey');
ok(await ev(()=>!!EN.varra&&typeof XWIN.varra==='function'),'Varra confrontation duel exists');
await ev(()=>{DBG.enterMap('duskhollow',5,9,'left');});await w(200);await k('a');await w(500);await shot('63_varra_dialog.png');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',30),'Varra offers redemption: trust or confront');await k('a');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.flags.varraT===1&&DBG.G.eq.dawnbrand===1),'trusted Varra: she gives the Dawnbrand');
// inn by walking into its door
await ev(()=>{DBG.G.party.forEach(m=>m.hp=1);DBG.enterMap('duskhollow',3,4,'up');});await stepUp('up');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'x',20),'Last Lantern Inn opens');await k('a');await w(900);await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.party.every(m=>m.hp>1)),'inn restores HP');
// trading post
await ev(()=>{DBG.enterMap('duskhollow',8,8,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Dusk Bazaar opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await k('b');await until(()=>DBG.UI.length===0,'b');
// smithy
await ev(()=>{DBG.enterMap('duskhollow',17,4,'up');});await stepUp('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Hask Starlight Forge opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await w(200);await k('a');await w(200);await shot('64_hask_forge.png');
ok(await ev(()=>DBG.G.eq.dawnbrand>=1),'bought Dawnbrand');await k('b');await until(()=>DBG.UI.length===0,'b');
// gloam battle
await ev(()=>{DBG.enterMap('gloam',8,5,'up');DBG.startBattle(['stalker','gloomling','veilbat'],'twilight');});await w(1800);await shot('65_gloam_battle.png');
ok(await until(()=>DBG.scene==='map','a',500),'won a Ashen Gloam battle');
// --- Eclipse Bastion
await ev(()=>{DBG.UI.length=0;DBG.enterMap('gloam',21,2,'up');});await stepUp('up');
ok(await until(()=>DBG.G.map==='bastion','x',30),'entered the Eclipse Bastion');await w(2600);
await ev(()=>{DBG.enterMap('bastion',1,6,'up');});await w(200);await k('a');ok(await ev(()=>DBG.G.eq.veilcloak===1),'chest: Veilwalker Cloak');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.startBattle(['umbral','mwraith'],'twilight');});await w(1800);await shot('66_bastion_battle.png');ok(await until(()=>DBG.scene==='map','a',500),'won a Bastion battle');
await ev(()=>{DBG.UI.length=0;DBG.enterMap('bastion',11,6,'up');});await w(600);await shot('67_bastion_warden_on_map.png');
ok(await ev(()=>blocked(11,2)),'Warden blocks the way before the fight');
await ev(()=>{DBG.enterMap('bastion',11,4,'up');});await stepUp('up');
ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Eclipse Warden battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(100);await shot('68_eclipse_warden_battle.png');
ok(await ev(()=>DBG.B.en[0].n==='Eclipse Warden'&&DBG.B.cave==='twilight'),'twilight backdrop + boss');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.scene==='map'&&DBG.G.flags.warden===1,'a',600),'Eclipse Warden defeated');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',40),'chapter complete choice');await k('down');await k('a');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('duskhollow',11,9,'left');});await w(200);await k('a');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.eq.wardenplate===1&&DBG.G.flags.serengift===1),'Seren gives Warden Plate');
// ship pad -> sky at Duskhollow
await ev(()=>{DBG.enterMap('gloam',7,8,'down');});await stepUp('down');
ok(await until(()=>DBG.scene==='skymap','x',20),'boarded the Cinderwing from the Ashen Gloam');ok(await ev(()=>SKY.nearPOI()&&SKY.nearPOI().id==='gloaming'),'ship starts at Duskhollow');
// save / load
await ev(()=>{DBG.setScene('map');DBG.enterMap('duskhollow',11,10,'up');DBG.save();});await p.reload();await w(1200);await k('down');await k('a');await w(1500);
ok(await ev(()=>DBG.scene==='map'&&DBG.G.map==='duskhollow'&&DBG.G.flags.warden===1),'save/load in Duskhollow');
console.log('ERRORS',JSON.stringify(errs));await b.close();process.exit(errs.length?1:0);})();
