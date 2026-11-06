// Grok review #2 pass: movement feel, early Ember tutorial fight, combat clarity, QoL, discoverability, consequences.
// Phone 412x915 touch. Server on :8765.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
const ev=(f,a)=>p.evaluate(f,a),w=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:'shots/'+n});
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(40);await ev(k=>DBG.rel(k),key);await w(70);}};
// ---------- movement ----------
await ev(()=>{DBG.setStage('world');G.flags.tutFight=1;G.flags.noenc=1;DBG.enterMap('world',3,3,'right');DBG.UI.length=0;});await w(300);
const x0=await ev(()=>G.x);await ev(()=>DBG.press('right'));await w(1000);await ev(()=>DBG.rel('right'));await w(300);const moved=await ev(()=>G.x)-x0;
ok(moved>=7,'holding right walks briskly ('+moved+' tiles in 1s, was ~6)');
// held walking chains: sample F.mv while walking - it never sits at 0 between tiles
await ev(()=>{DBG.enterMap('world',3,3,'right');DBG.UI.length=0;window.__z=0;window.__n=0;});await ev(()=>DBG.press('right'));
for(let i=0;i<25;i++){await ev(()=>{__n++;if(DBG.scene==='map'&&!DBG.UI.length&&!F.mv)__z++;});await w(16);}await ev(()=>DBG.rel('right'));
ok(await ev(()=>__z<=3),'walking chains between tiles without dead frames');
// touch D-pad: slide from left to up without lifting
const r=await p.locator('#dpad').boundingBox();const cx=r.x+r.width/2,cy=r.y+r.height/2;
const pe=(t,x,y)=>ev(([t,x,y])=>document.getElementById('dpad').dispatchEvent(new PointerEvent(t,{pointerId:7,clientX:x,clientY:y,bubbles:true,pointerType:'touch'})),[t,x,y]);
await pe('pointerdown',cx-50,cy);ok(await ev(()=>DPAD.cur==='left'&&DBG.G&&true),'D-pad press = left');
await pe('pointermove',cx,cy-50);ok(await ev(()=>DPAD.cur==='up'),'sliding the thumb switches to up without lifting');
await pe('pointerup',cx,cy-50);ok(await ev(()=>DPAD.cur===null),'lifting releases');
// ---------- early tutorial fight ----------
await ev(()=>{DBG.newGame();DBG.setScene('map');DBG.UI.length=0;DBG.enterMap('world',6,4,'right');G.flags.noenc=0;});
for(let i=0;i<6&&!(await ev(()=>DBG.UI.length>0||DBG.scene==='battle'));i++)await k('right');
ok(await ev(()=>DBG.UI.length>0&&G.flags.tutFight),'a few steps into Ashen Vale, slimes ambush the party');
for(let i=0;i<6&&(await ev(()=>DBG.scene!=='battle'));i++){await k('a');await w(150);}
await w(900);ok(await ev(()=>DBG.scene==='battle'&&DBG.B.tut&&DBG.B.ember===60&&DBG.B.en.every(e=>e.k==='slime')),'tutorial battle: 2 slimes, gauge starts warm');
ok(await ev(()=>DBG.B.tips&&DBG.B.tips.length===2&&DBG.B.tips[0].block),'Ember tips queued and blocking');
await w(1500);await shot('253_tutorial_ember_tip.png');const atb0=await ev(()=>DBG.B.pt[0].atb);await w(500);ok(await ev(a=>DBG.B.pt[0].atb===a,atb0),'battle pauses while a tutorial tip is up');
await k('a');await w(200);await shot('254_tutorial_weak_tip.png');await k('a');await w(200);ok(await ev(()=>!DBG.B.tips.length),'tips dismissed with A');
await ev(()=>COMBAT.heat(45));await w(200);ok(await ev(()=>DBG.B.tips.length&&DBG.B.tips[0].id==='full'),'Ember full -> tip explains the ★ Ember Art');await shot('255_tutorial_full_tip.png');await k('a');
// ---------- (1) combat clarity ----------
await ev(()=>{DBG.newGame();G.flags.tutFight=1;DBG.setScene('map');DBG.UI.length=0;DBG.startBattle(['boss'],true,true);DBG.B.intro=0;DBG.B.swirl=0;});await w(400);
await ev(()=>{const e=DBG.B.en[0];e.atb=60;});await w(300);
ok(await ev(()=>{const e=DBG.B.en[0];return !!e.tel&&!!e.telK;}),'boss winds up (intent badge + BREAK bar)');
await ev(()=>{const t=DBG.B.tips||[];t.length=0;});const e0=await ev(()=>{const e=DBG.B.en[0];e.hp-=Math.ceil(e.mhp*0.06);return e.hp;});await w(200);
await shot('256_boss_break_bar.png');
await ev(()=>{const e=DBG.B.en[0];e.hp-=Math.ceil(e.mhp*0.06);});await w(250);
ok(await ev(()=>{const B=DBG.B,e=B.en[0];return B.stagN===1&&e.open&&e.stagT>0&&/STAGGER/.test(B.lastStag)&&e.atb<45;}),'10% during the wind-up = STAGGER!: wind-up cancelled, ATB knocked back, boss OPEN, message says why');
ok(await ev(()=>DBG.B.tips.some(t=>t.id==='stagger')),'first stagger explains itself');await w(150);await shot('257_boss_stagger.png');
// ---------- (4) QoL: autosave, crash recovery, flavour throttle ----------
await ev(()=>{localStorage.removeItem(AUTOSAVE.AKEY);DBG.newGame();G.flags.tutFight=1;DBG.setScene('map');DBG.UI.length=0;enterMap('town',10,9,'down');});await w(200);
ok(await ev(()=>{const a=JSON.parse(localStorage.getItem(AUTOSAVE.AKEY)||'null');return a&&a.map==='town'&&a._ts>0;}),'entering a map autosaves (verified read-back)');
await w(100);await shot('258_autosave_phone.png');
ok(await ev(()=>{G.gold=4321;AUTOSAVE.autosave(true);const keep=G,bk={};for(const k of ['emberfall_save','emberfall_save_1','emberfall_save_2','emberfall_save_3']){bk[k]=localStorage.getItem(k);localStorage.setItem(k,'{broken');}G=null;DBG.load();const r=G&&G.gold===4321;for(const k in bk)bk[k]===null?localStorage.removeItem(k):localStorage.setItem(k,bk[k]);G=keep;return r;}),'Continue recovers the autosave when the slot save is unreadable (crash recovery)');
ok(await ev(()=>{const a=flavorOK(),b2=flavorOK();return b2===false;}),'ambient flavour text: at most one line per map visit / 90s');
// ---------- (2) discoverability ----------
ok(await ev(()=>{DBG.newGame();DBG.setStage('town');return NPCS.town.some(n=>n.s==='pell'&&n.x===12&&n.y===8)&&!SOLID.has(MAPS.town.rows[8][12])&&!(MAPS.town.doors||{})['12,8']&&!(MAPS.town.doors||{})['12,7'];}),'Wayfarer Pell stands in Thornwick on open ground (not a door/doorstep)');
await ev(()=>{DBG.newGame();G.flags.tutFight=1;DBG.setScene('map');DBG.UI.length=0;DBG.enterMap('town',12,9,'up');});await w(300);await k('a');await w(300);
ok(await ev(()=>DBG.UI.length&&JSON.stringify(DBG.UI[DBG.UI.length-1]).includes('Pell')),'talking to Pell lists the optional content');await shot('259_pell_hints.png');
for(let i=0;i<10&&(await ev(()=>!DBG.UI.some(u=>u.k==='choice')));i++){await k('a');await w(120);}await k('a');await w(200);for(let i=0;i<4;i++){await k('a');await w(120);}
ok(await ev(()=>SQ.qst('wayfarer').s===1),'Wayfarer\'s Rumours quest accepted (shows in the quest log)');
ok(await ev(()=>{G.sky=newSky();G.flags.tyrant=1;G.flags['rum_ex_salt']=0;TOAST=null;enterMap('harbor',10,8,'down');return TOAST&&/Saltmere/.test(TOAST.s);}),'a rumour appears when Saltmere becomes reachable');
await ev(()=>{DBG.UI.length=0;G.sky.x=6*16;G.sky.y=19*16;DBG.setScene('skymap');});await w(400);await shot('260_skymap_markers.png');
ok(await ev(()=>{const g0=G.gold;const e=EX.EXPOI[0];skyInteract(e);return EX.EXPOI[0]&&G.gold===g0+150;}),'first landing at a far town pays the Wayfarer bonus');
ok(await ev(()=>{const s=EXS().seen;s.ex_salt=s.ex_valor=s.ex_lant=1;return SQ.qReady(QBY.wayfarer)&&qKnown().some(q=>q.id==='wayfarer');}),'quest completes after all three far towns');
// ---------- (3) consequences ----------
ok(await ev(()=>{DBG.newGame();G.flags.tutFight=1;G.sq=G.sq||{};G.sq.lyra={s:2,n:0};DBG.setScene('map');DBG.UI.length=0;startBattle(['slime'],0);return EMBER.reignCost===20&&DBG.B.tips.some(t=>/Codex/.test(JSON.stringify(t.lines)));}),'finishing Lyra\'s quest changes how she fights (Reignite 20) and says so');
ok(await ev(()=>{DBG.newGame();startBattle(['slime'],0);return EMBER.reignCost===25;}),'perks only apply when the quest is done');
await ev(()=>{DBG.newGame();G.flags.tutFight=1;G.sq={mira:{s:2,n:0}};G.flags.varraT=1;DBG.setScene('map');DBG.UI.length=0;DBG.enterMap('town',10,9,'down');innTalk();});await w(300);
ok(await ev(()=>JSON.stringify(DBG.UI).includes('shrine hymn')),'resting after Mira\'s quest: the party reacts');await shot('261_party_reacts.png');
ok(await ev(()=>{DBG.UI.length=0;innTalk();return JSON.stringify(DBG.UI).includes('shadowing us');}),'trusting Varra is remembered around the fire');
ok(await ev(()=>{G.flags.ending='free';const a=epi().find(s=>s.s==='mira').L.join(' ');G.sq={};const b2=epi().find(s=>s.s==='mira').L.join(' ');return a.includes('hums the shrine hymn')&&!b2.includes('hums');}),'personal quests add to that hero\'s epilogue');
// ---------- expansion islands painted + clear gate hints ----------
ok(await ev(()=>['ex_salt','ex_valor','ex_lant','ex_obs'].every(k=>WART.isle[k]&&WART.isle[k].complete&&WART.isle[k].naturalWidth>0)),'Saltmere/Valorgate/Lanternhaven/Observatory islands use painted art');
ok(await ev(()=>EX.EXPOI.every(e=>/Opens after you defeat/.test(e.no))),'every sealed island says what opens it');
await ev(()=>{DBG.UI.length=0;G.sky=G.sky||newSky();G.flags.hydra=0;const e=EX.EXPOI[2];SKY.startSkyMap(e);skyInteract(e);});await w(3000);await shot('271_lantern_gate_hint.png');await ev(()=>{DBG.UI.length=0;});
// @@END
ok(errs.length===0,'no page errors ('+errs.slice(0,3).join(' | ')+')');console.log(errs.length?'ERRORS '+errs.join(' | '):'ALL OK');await b.close();process.exit(errs.length?1:0);})();
