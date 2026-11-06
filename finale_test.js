// Chapter 8 (FINALE, The Ember Crown): run with a static server on :8765 (python3 -m http.server 8765). Phone-size 412x915 touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await p.evaluate(k=>DBG.press(k),key);await w(40);await p.evaluate(k=>DBG.rel(k),key);await w(60);}};
const ev=f=>p.evaluate(f);const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;await k(key);await w(60);}return false;};
const shot=n=>p.screenshot({path:'shots/'+n});const step=async d=>{await p.evaluate(d=>DBG.press(d),d);await w(250);await p.evaluate(d=>DBG.rel(d),d);};
await w(1500);
// --- setup: end of Chapter 7, Varra trusted
const setup=()=>ev(()=>{DBG.newGame();DBG.UI.length=0;const G=DBG.G;G.sky=newSky();G.sky.tut=1;G.sky.flags.corsair=1;Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,rime:1,kade2:1,isolde:1,wyrm:1,verd:1,kade3:1,sefa:1,hydra:1,sefagift:1,gloaming:1,nightfall:1,seren:1,varra:1,varraT:1,warden:1,serengift:1,reach:1,seraph:1,aldwin:1,seneschal:1,aldwingift:1,noenc:1});Object.assign(G.sky.flags,{kade2:1,kade3:1,nightfall:1,seraph:1});
 G.party.forEach(m=>{m.lv=42;m.b.hp=1500;m.b.mp=320;m.b.atk=130;m.b.mag=130;m.b.def=84;m.b.spd=22;m.hp=1500;m.mp=320;});G.gold=12000;window.SKY_NOENC=1;});
await setup();
ok(await ev(()=>!!PAINT.vorthane&&!!PAINT.vorthane2&&!!SKYART.heartwyrm),'painted Vorthane (both forms) + Heartfire Wyrm art loaded');
ok(await ev(()=>['stair','hearth','heartspire'].every(m=>MAPS[m].rows.every(r=>r.length===MAPS[m].w))),'Chapter 8 maps are rectangular');
ok(await ev(()=>{for(const m in MAPS){const D=MAPS[m].doors||{};for(const n of NPCS[m]||[])for(const d in D){const[x,y]=d.split(',').map(Number);if(n.x===x&&(n.y===y||n.y===y+1))return false;}}return true;}),'no NPC (any town) on a door or its doorstep');
const reach=(map,sx,sy,tx,ty,doors)=>p.evaluate(([map,sx,sy,tx,ty,doors])=>{DBG.enterMap(map,sx,sy,'up');const D=MAPS[map].doors||{};const q=[[sx,sy]],seen={};seen[sx+','+sy]=1;while(q.length){const[x,y]=q.shift();if(x===tx&&(ty<0||y===ty))return true;
 for(const[a,b2]of Object.values(DIRS)){const k=(x+a)+','+(y+b2);if(seen[k]||blocked(x+a,y+b2)||(!doors&&D[k]))continue;seen[k]=1;q.push([x+a,y+b2]);}}return false;},[map,sx,sy,tx,ty,doors]);
ok(await ev(()=>Object.keys(MAPS.hearth.doors).length===3)&&await reach('hearth',11,10,3,4)&&await reach('hearth',11,10,16,4)&&await reach('hearth',11,10,9,8)&&await reach('hearth',11,10,11,0,1),'every Hearth doorstep and the Spire gate reachable');
ok(await reach('stair',11,14,11,1),'Stair top reachable from its foot');ok(await reach('heartspire',11,14,11,4),'Spire throne landing reachable from the entrance');
ok(await reach('stair',11,14,11,6),'Stair save point reachable');
// --- Chapter card: climb from the Citadel summit
await ev(()=>{DBG.setScene('map');DBG.enterMap('citadel',11,2,'up');});await step('up');
ok(await until(()=>DBG.G.map==='stair'&&DBG.UI.length>0,'x',30),'Stair of Light opens with the chapter card');await w(700);await shot('82_finale_chapter_card.png');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('stair',11,9,'up');});await w(2600);await shot('83_stair_of_light.png');
// save point
await ev(()=>{DBG.G.party.forEach(m=>m.hp=5);localStorage.removeItem('emberfall_save');DBG.enterMap('stair',10,6,'right');});await step('right');
ok(await until(()=>DBG.UI.length>0,'x',10),'flame-stone save point speaks');await w(400);await shot('84_save_point.png');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.party.every(m=>m.hp>5)&&!!localStorage.getItem('emberfall_save')),'save point heals and saves');
await ev(()=>{DBG.enterMap('stair',3,4,'up');});await w(200);await k('a');ok(await ev(()=>DBG.G.eq.foundersveil===1),'chest: Founders\' Raiment');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.enterMap('stair',11,9,'up');DBG.startBattle(['crownknight','hollowseraph','heartwisp'],'heart');});await w(1800);await shot('85_stair_battle.png');
ok(await until(()=>DBG.scene==='map','a',600),'won a Stair battle');
// --- final sky battle: the Heartfire Wyrm, Varra on the flank
await ev(()=>{DBG.UI.length=0;DBG.enterMap('stair',11,2,'up');});await step('up');
ok(await until(()=>DBG.scene==='skybattle','a',40),'Heartfire Wyrm rises (sky battle)');await w(1200);
ok(await ev(()=>SKY.SB.en.n==='Heartfire Wyrm'&&SKY.SB.varra===true),'sky boss is the Heartfire Wyrm, Varra flies with you');
await ev(()=>{SKY.autoPlan();SKY.startExec();});await w(2600);await shot('86_sky_heartfire_wyrm.png');
ok(await until(()=>SKY.SB&&SKY.SB.log.some(l=>l.includes('Black Tempest')),'x',60),'Varra\'s Black Tempest joins the attack');
await ev(()=>{SKY.SB.en.hp=40;});ok(await until(()=>SKY.SB&&SKY.SB.phase!=='exec','x',120),'round ends');
await ev(()=>{if(SKY.SB.phase==='plan'){SKY.autoPlan();SKY.startExec();}});ok(await until(()=>SKY.SB&&SKY.SB.phase==='end','x',80),'Wyrm battle ends');
ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='hearth'&&DBG.G.flags.heartwyrm===1,'a',60),'Heartfire Wyrm defeated, landed at the Founders\' Hearth');await until(()=>DBG.UI.length===0);
// --- Founders' Hearth: last rest + shop
await ev(()=>{DBG.enterMap('hearth',11,10,'up');});await w(2600);await shot('87_founders_hearth.png');
await ev(()=>{DBG.enterMap('hearth',7,5,'up');});await w(200);await k('a');await w(600);await k('a');await w(400);await shot('88_elowen_dialog.png');await until(()=>DBG.UI.length===0);
ok(await ev(()=>DBG.G.flags.elowen===1&&DBG.G.eq.foundersveil===2&&DBG.G.items.phoenixember>=2),'Founder Elowen gives her gifts');
ok(await ev(()=>{DBG.G.flags.varraT=0;const n=NPCS.hearth.some(n=>n.s==='varra');DBG.G.flags.varraT=1;return !n&&NPCS.hearth.some(n=>n.s==='varra');}),'Varra rests at the Hearth only if trusted');
await ev(()=>{DBG.G.party.forEach(m=>m.hp=1);DBG.enterMap('hearth',3,4,'up');});await step('up');
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'x',20),'Hearth inn opens');await k('a');await w(900);await until(()=>DBG.UI.length===0);ok(await ev(()=>DBG.G.party.every(m=>m.hp>1)),'rest restores HP');
await ev(()=>{DBG.enterMap('hearth',9,8,'up');});await step('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Hearthside Sutler opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await k('b');await until(()=>DBG.UI.length===0,'b');
await ev(()=>{DBG.enterMap('hearth',16,4,'up');});await step('up');ok(await until(()=>DBG.UI.some(u=>u.k==='shop'),'x',20),'Founders\' Forge opens');
await until(()=>DBG.UI[DBG.UI.length-1].k==='shop');await w(200);await k('a');await w(200);await shot('89_founders_forge.png');
ok(await ev(()=>DBG.G.eq.foundersedge>=1),'bought the Founder\'s Edge');await k('b');await until(()=>DBG.UI.length===0,'b');
// --- the Heart Spire
await ev(()=>{DBG.enterMap('hearth',11,1,'up');});await step('up');ok(await until(()=>DBG.G.map==='heartspire','x',30),'entered the Heart Spire');await w(2400);
await ev(()=>{DBG.enterMap('heartspire',1,7,'up');});await w(200);await k('a');ok(await ev(()=>DBG.G.eq.emberheart===1),'chest: Emberheart (ultimate blade)');await until(()=>DBG.UI.length===0);
await ev(()=>{DBG.startBattle(['crownknight','kingshade','embermaw'],'heart');});await w(1800);await shot('90_spire_battle.png');ok(await until(()=>DBG.scene==='map','a',600),'won a Spire battle');
await ev(()=>{DBG.UI.length=0;const G=DBG.G;G.party[0].w='emberheart';G.party.forEach(m=>m.a='foundersveil');DBG.enterMap('heartspire',11,6,'up');});await w(2800);await shot('91_spire_vorthane_on_map.png');
ok(await ev(()=>blocked(11,3)),'Vorthane bars the throne before the fight');
// --- final boss: Vorthane, three phases
await ev(()=>{DBG.enterMap('heartspire',11,5,'up');});await step('up');
ok(await until(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,'a',40),'Vorthane battle starts');await w(2200);
for(let r=0;r<40;r++){const st=await ev(()=>DBG.B.menu?DBG.B.menu.k:null);if(st==='cmd'){await k('a');await w(100);await k('a');}await w(150);if(await ev(()=>DBG.B.nums.length>0))break;}
await w(100);await shot('92_vorthane_battle.png');
ok(await ev(()=>DBG.B.en[0].n==='Vorthane, the Hollow King'&&DBG.B.cave==='heart'),'heart backdrop + Hollow King');
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.B&&DBG.B.en[0].k==='vorthane2','a',300),'phase 2: Vorthane, Heart Unbound');
ok(await until(()=>DBG.UI.length===0,'a',30),'transformation scene plays');ok(await ev(()=>DBG.scene==='battle'&&DBG.B.en[0].hp>15000&&DBG.B.en[0].hp<22000),'Varra\'s broadside hits the King');
await w(900);await shot('93_vorthane_heart_unbound.png');
await ev(()=>{DBG.B.en[0].hp=Math.round(DBG.B.en[0].mhp*0.3);DBG.B.en[0].atb=99;});ok(await until(()=>{const e=DBG.B&&DBG.B.en[0];if(e&&!e.seventh){e.atb=Math.max(e.atb,99);e.stag=0;}return e&&e.seventh===1;},'x',200),'phase 3: the Seventh Calls');
await w(300);await shot('94_seventh_calls.png');await until(()=>DBG.UI.length===0,'a',20);
await ev(()=>{DBG.B.en[0].hp=1;});ok(await until(()=>DBG.UI.some(u=>u.k==='choice'),'a',600),'the choice of the seventh shard');await w(300);await shot('95_the_choice.png');
await k('a');ok(await until(()=>DBG.scene==='finale_end','a',60),'ending sequence begins');ok(await ev(()=>DBG.G.flags.ending==='keeper'&&DBG.G.flags.vorthane===1),'Kael made the Crown whole');
await w(1300);await shot('96_ending_crown_whole.png');
const shotsAt={1:'97_epilogue_kael.png',4:'98_epilogue_varra.png',7:'99_the_end.png'};
for(let i=1;i<8;i++){await w(900);await k('a');await w(1000);if(shotsAt[i])await shot(shotsAt[i]);}
ok(await ev(()=>FINALE.EN8.S[4].L.join(' ').includes('red sails')),'trusted Varra sails on in the epilogue');
await w(900);await k('a');ok(await ev(()=>FINALE.EN8&&FINALE.EN8.cr===0),'credits roll');await w(5500);await shot('100_credits.png');
ok(await ev(()=>FINALE.EN8.cy>-400),'credits still rolling');await w(9000);await shot('101_credits_title.png');
ok(await until(()=>DBG.scene==='title','b',40),'credits return to the title');await w(800);
ok(await ev(()=>JSON.parse(localStorage.getItem('emberfall_save')).flags.clear===1),'save carries the Clear flag');await shot('102_title_clear.png');
// --- confronted Varra: she climbs alone; free ending
await setup();await ev(()=>{const G=DBG.G;G.flags.varraT=0;G.flags.heartwyrm=1;G.flags.elowen=1;DBG.setScene('map');DBG.enterMap('heartspire',11,10,'up');});await step('up');
ok(await until(()=>DBG.UI.length>0,'x',10)&&await ev(()=>DBG.G.flags.varraalone===1&&DBG.G.eq.galecharm===1),'confronted Varra is found alone in the Spire');await until(()=>DBG.UI.length===0);
ok(await ev(()=>!NPCS.hearth.some(n=>n.s==='varra')),'no Varra at the Hearth when confronted');
await ev(()=>{DBG.G.flags.vorthane=1;DBG.G.flags.ending='free';FINALE.startEnding();});await w(800);
ok(await ev(()=>DBG.scene==='finale_end'&&FINALE.EN8.S[0].t==='The Crown Set Free'&&FINALE.EN8.S[4].L.join(' ').includes('not found')),'free ending + Varra\'s lone fate');
await ev(()=>{FINALE.EN8.i=4;FINALE.EN8.t=2;});await w(400);await shot('103_epilogue_varra_alone.png');
// --- save/load at the Hearth after clearing
await ev(()=>{DBG.setScene('map');DBG.enterMap('hearth',11,10,'up');DBG.G.flags.clear=1;DBG.save();});await p.reload();await w(1200);await k('down');await k('a');await w(1500);
ok(await ev(()=>DBG.scene==='map'&&DBG.G.map==='hearth'&&DBG.G.flags.clear===1),'save/load at the Founders\' Hearth');
console.log('ERRORS',JSON.stringify(errs));await b.close();process.exit(errs.length?1:0);})();
