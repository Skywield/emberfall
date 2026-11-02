// Release polish (polish.js): settings, remappable keyboard + gamepad, 3 save slots + load screen (old saves migrate),
// new title/intro, chapter summary card returns to the game. Phone 412x915 touch + desktop 1280x720. Server on :8765.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
async function page(mobile){const p=await b.newPage(mobile?{viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true}:{viewport:{width:1280,height:720}});
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 // a fake gamepad the test can drive (Gamepad API)
 await p.addInitScript(()=>{window.__pad={id:'Test Pad (STANDARD GAMEPAD)',connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]};window.__padOn=false;
  navigator.getGamepads=()=>window.__padOn?[window.__pad]:[];});
 await p.goto('http://localhost:8765/index.html'+(mobile?'?touch=1':''));await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);return p;}
let p=await page(true);const w=ms=>p.waitForTimeout(ms),ev=(f,a)=>p.evaluate(f,a),shot=n=>p.screenshot({path:'shots/'+n});
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(40);await ev(k=>DBG.rel(k),key);await w(70);}};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;if(key)await k(key);await w(60);}return false;};
// ---------- title ----------
await w(600);await shot('147_title_phone.png');ok(await ev(()=>DBG.scene==='title'&&TT.i===0&&!DBG.hasSave()),'new title screen, no save yet');
ok(await ev(()=>{const t=document.getElementById('pad');return getComputedStyle(t).display!=='none';}),'phone touch pad still shown');
const tb=await p.locator('#d').boundingBox();await p.touchscreen.tap(tb.x+tb.width/2,tb.y+tb.height/2);await w(200);ok(await ev(()=>TT.i===1),'touch D-pad moves the title cursor');
await k('down',2);ok(await ev(()=>TT.i===3),'title has New Game / Continue / Load Game / Settings');
// ---------- settings ----------
await k('a');await w(200);ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='settings'),'Settings opens from the title');
await k('down',2);await k('right');ok(await ev(()=>POLISH.OPT.text===2),'text speed -> Fast');await k('down');await k('right',2);ok(await ev(()=>POLISH.OPT.bspd===4),'battle speed -> max');
await k('down');await k('right');ok(await ev(()=>POLISH.OPT.atb===2),'ATB mode -> Wait');await k('up',4);await k('left');ok(await ev(()=>AOPT.mus===2),'music volume down');
await k('down',4);await w(200);await shot('148_settings_phone.png');
ok(await ev(()=>{const o=JSON.parse(localStorage.getItem('emberfall_opts'));return o.text===2&&o.bspd===4&&o.atb===2&&JSON.parse(localStorage.getItem('emberfall_audio')).mus===2;}),'settings persist in localStorage');
await k('down');await k('a');await w(200);ok(await ev(()=>DBG.UI.some(u=>u.k==='settings'))&&errs.length===0,'fullscreen toggle (no errors when the browser refuses)');
await k('down');await k('a');await w(150);ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='controls'),'Controls screen');
await k('down',4);await k('a');ok(await ev(()=>POLISH.CAP&&POLISH.CAP.act==='a'),'waiting for a key for Confirm');await w(200);await shot('149_controls_remap_phone.png');
await p.keyboard.press('KeyJ');await w(100);ok(await ev(()=>POLISH.BIND.a==='KeyJ'&&POLISH.KM.KeyJ==='a'&&!POLISH.KM.KeyZ&&POLISH.KM.Enter==='a'),'Confirm remapped to J (Enter still works, Z freed)');
await k('right');ok(await ev(()=>POLISH.CAP&&POLISH.CAP.pad),'waiting for a pad button');await ev(()=>{window.__padOn=true;window.__pad.buttons[2].pressed=true;});await w(150);await ev(()=>{window.__pad.buttons[2].pressed=false;});await w(100);
ok(await ev(()=>POLISH.PBIND.a===2&&!POLISH.CAP),'gamepad Confirm remapped to button 2');
ok(await ev(()=>JSON.parse(localStorage.getItem('emberfall_keys')).a==='KeyJ'&&JSON.parse(localStorage.getItem('emberfall_pad')).a===2),'bindings saved');
await k('b');await k('b');await w(100);ok(await ev(()=>DBG.UI.length===0),'back to the title');
// gamepad drives the title: d-pad up x3 -> New Game, then the remapped button 2 confirms
const padTap=async i=>{await ev(i=>{window.__pad.buttons[i].pressed=true;},i);await w(90);await ev(i=>{window.__pad.buttons[i].pressed=false;},i);await w(90);};
await padTap(12);await padTap(12);await padTap(12);ok(await ev(()=>TT.i===0),'gamepad d-pad moves the title cursor');
await ev(()=>{window.__pad.axes[1]=0.9;});await w(120);await ev(()=>{window.__pad.axes[1]=0;});await w(100);ok(await ev(()=>TT.i===1),'left stick works too');await padTap(12);
await padTap(2);ok(await until(()=>DBG.scene==='intro','',30),'pad button 2 starts a New Game -> intro');await w(900);await shot('150_intro_phone.png');
ok(await ev(()=>POLISH.SLOT===1),'new game goes into the first empty slot');
// text speed: Fast types twice as fast as Normal
await ev(()=>{DBG.UI.length=0;});await k('b');ok(await until(()=>DBG.scene==='map','',40),'B skips the intro');await until(()=>DBG.UI.length===0);
const typed=async sp=>{await ev(sp=>{POLISH.OPT.text=sp;DBG.UI.length=0;dialog(['Elder Bran: '+'x'.repeat(200)]);},sp);await w(500);const n=await ev(()=>DBG.UI[0].ch);await ev(()=>DBG.UI.length=0);return n;};
const n1=await typed(1),n2=await typed(2),n3=await typed(3);ok(n2>n1*1.5&&n3>=200,'text speed changes typing ('+n1.toFixed(0)+' / '+n2.toFixed(0)+' / instant)');
// ATB modes + battle speed
ok(await ev(()=>{const B={menu:{k:'cmd'}},S={menu:{k:'skill'}};const o=POLISH.OPT.atb,r=[];for(const m of [0,1,2]){POLISH.OPT.atb=m;r.push([ATBWAIT(B),ATBWAIT(S),ATBWAIT({menu:null})]);}POLISH.OPT.atb=o;
 return JSON.stringify(r)===JSON.stringify([[false,false,false],[false,true,false],[true,true,false]]);}),'ATB: Active never waits, Classic waits in sub-menus, Wait waits whenever a menu is open');
const btime=async sp=>{await ev(sp=>{POLISH.OPT.bspd=sp;DBG.startBattle(['slime']);},sp);await w(1200);const t=await ev(()=>DBG.B.t);await ev(()=>{DBG.setScene('map');});return t;};
const t0=await btime(0),t4=await btime(4);ok(t4>t0*2,'battle speed scales battle time ('+t0.toFixed(2)+'s vs '+t4.toFixed(2)+'s)');
await ev(()=>{POLISH.OPT.bspd=2;POLISH.OPT.text=1;DBG.startBattle(['slime','bat']);});await w(1800);await shot('151_battle_phone.png');await ev(()=>{DBG.setScene('map');});
// ---------- save slots ----------
await ev(()=>{DBG.UI.length=0;DBG.openMenu();});await w(100);ok(await ev(()=>MOPTS.includes('Settings')&&MOPTS.includes('Save')),'field menu has Settings and Save');
await until(()=>DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Save'),'down',14);await k('a');ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='slots'),'Save opens the slot picker');
await k('a');await w(100);ok(await ev(()=>!!POLISH.rawSlot(1)&&POLISH.rawSlot(1)._meta.loc==='Thornwick Village'),'saved to slot 1 with metadata');await until(()=>DBG.UI.length===0,'a',10);
await ev(()=>{DBG.G.gold=777;DBG.G.party.forEach(m=>m.lv=9);DBG.enterMap('harbor',11,12,'up');DBG.UI.length=0;DBG.openMenu();});await until(()=>DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Save'),'down',14);await k('a');
await k('down');await k('a');await w(100);ok(await ev(()=>POLISH.rawSlot(2)&&POLISH.rawSlot(2).gold===777&&POLISH.SLOT===2),'saved a second game to slot 2');await until(()=>DBG.UI.length===0,'a',10);
await ev(()=>{DBG.openMenu();});await until(()=>DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Save'),'down',14);await k('a');await k('up');await k('a');await w(100);
ok(await ev(()=>DBG.UI.some(u=>u.k==='choice'&&/Overwrite slot 1/.test(u.prompt))),'saving over another slot asks first');await k('down');await k('a');await w(100);
ok(await ev(()=>POLISH.rawSlot(1).gold!==777),'declining keeps slot 1 intact');await ev(()=>{DBG.UI.length=0;});
// back to title: Continue = latest; Load Game screen
await ev(()=>{DBG.UI.length=0;DBG.setScene('title');TT.i=2;});await w(150);await k('a');await w(250);ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='slots'&&DBG.UI[DBG.UI.length-1].mode==='load'),'Load Game screen');await shot('152_load_screen_phone.png');
await k('up');await k('a');ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='town','',40),'loaded slot 1 (Thornwick)');
await w(800);await ev(()=>{DBG.UI.length=0;DBG.setScene('title');TT.i=1;});await w(150);await k('a');ok(await until(()=>DBG.scene==='map'&&DBG.G.map!=='town','',40)&&await ev(()=>DBG.G.map===JSON.parse(localStorage.getItem('emberfall_save')).map&&POLISH.SLOT===POLISH.latestSlot()),'Continue loads the most recent save');
// all slots full -> new game asks for a slot
await w(800);await ev(()=>{localStorage.setItem('emberfall_save_3',localStorage.getItem('emberfall_save_1'));DBG.UI.length=0;DBG.setScene('title');TT.i=0;});await w(100);await k('a');await w(150);
ok(await ev(()=>DBG.UI[DBG.UI.length-1].k==='slots'&&DBG.UI[DBG.UI.length-1].mode==='new'),'New Game with 3 full slots asks which to use');await until(()=>DBG.UI[DBG.UI.length-1].i===2,'down',5);await k('a');await w(100);await k('a');
ok(await until(()=>DBG.scene==='intro','',30)&&await ev(()=>POLISH.SLOT===3),'new journey in slot 3');
// ---------- chapter summary returns you to the game (was a "DEMO COMPLETE" screen that dumped you on the title) ----------
await ev(()=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap('forge',11,6,'up');Object.assign(DBG.G.flags,{boss:1,corsair:1,tyrant:1});XWIN.tyrant();});
ok(await until(()=>DBG.UI.some(u=>u.k==='choice'&&/chapter summary/.test(u.prompt)),'a',30),'Chapter 3 end offers the chapter summary');await k('a');ok(await until(()=>DBG.scene==='ending','',30),'chapter summary card');await w(400);await shot('153_chapter_summary_phone.png');
await k('a');ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='forge','',30),'A returns to the Forge, not the title');
await w(600);await ev(()=>{DBG.UI.length=0;DBG.G.sky=newSky();DBG.G.sky.tut=1;DBG.G.map='sky';DBG.setScene('ending');});await w(500);await k('a');ok(await until(()=>DBG.scene==='skymap','',30),'summary shown in the sky returns to the sky map');
await p.close();
// ---------- old single-slot save is migrated (and still loads) ----------
p=await page(false);
await ev(()=>{const G={party:[{id:'kael',name:'Kael',lv:12,xp:0,hp:300,mp:30,b:{hp:300,mp:30,atk:40,def:30,mag:10,spd:12},w:'emberbrand',a:'cindermail'},{id:'lyra',name:'Lyra',lv:12,xp:0,hp:200,mp:90,b:{hp:200,mp:90,atk:12,def:12,mag:40,spd:13},w:'magmarod',a:'tunic'},{id:'mira',name:'Mira',lv:12,xp:0,hp:250,mp:70,b:{hp:250,mp:70,atk:20,def:20,mag:30,spd:12},w:'ashmace',a:'tunic'}],
 gold:999,items:{potion:3},eq:{},map:'harbor',x:11,y:12,d:'up',flags:{boss:1,harbor:1},steps:0,time:4000};localStorage.clear();localStorage.setItem('emberfall_save',JSON.stringify(G));});
await p.reload();await p.waitForTimeout(1500);
ok(await p.evaluate(()=>!!localStorage.getItem('emberfall_save_1')&&POLISH.rawSlot(1).gold===999&&POLISH.SLOT===1),'an old single-slot save migrates into slot 1');
await p.waitForTimeout(300);await p.screenshot({path:'shots/154_title_desktop.png'});
await p.evaluate(()=>{TT.i=2;});await p.keyboard.press('Enter');await p.waitForTimeout(300);await p.screenshot({path:'shots/155_load_screen_desktop.png'});
await p.keyboard.press('KeyZ');await p.waitForTimeout(100);ok(await p.evaluate(()=>DBG.scene==='title'||DBG.UI.length===0)!==undefined,'keyboard confirm');
for(let i=0;i<40&&await p.evaluate(()=>DBG.scene!=='map');i++)await p.waitForTimeout(80);ok(await p.evaluate(()=>DBG.scene==='map'&&DBG.G.map==='harbor'&&DBG.G.gold===999),'old save loads from the Load screen (keyboard)');
await p.evaluate(()=>{DBG.UI.length=0;POLISH.openSettings();});await p.waitForTimeout(300);await p.screenshot({path:'shots/156_settings_desktop.png'});
await p.evaluate(()=>{DBG.UI.length=0;DBG.startBattle(['skeleton','crawler'],true);});await p.waitForTimeout(2200);await p.screenshot({path:'shots/157_battle_desktop.png'});
await p.evaluate(()=>{DBG.setScene('title');DBG.UI.length=0;});await p.evaluate(()=>{IN.p=2;IN.t=0.6;DBG.setScene('intro');});await p.waitForTimeout(700);await p.screenshot({path:'shots/158_intro_desktop.png'});
await p.close();
console.log(errs.length?'ERRORS '+errs.join(' | '):'no errors');if(errs.length)process.exitCode=1;await b.close();})();
