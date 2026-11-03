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
// @@END
ok(errs.length===0,'no page errors ('+errs.slice(0,3).join(' | ')+')');console.log(errs.length?'ERRORS '+errs.join(' | '):'ALL OK');await b.close();process.exit(errs.length?1:0);})();
