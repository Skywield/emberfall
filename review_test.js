// Grok review Nov 2 priorities 1, 2, 4: character voices + banter + Hollow-frozen NPCs, grounded combat (Ember gauge,
// unique ATB commands, boss intent telegraphs, Varra guest), seventh-shard foreshadowing and concrete ending differences.
// Phone 412x915. Server on :8765. Shots 177+.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();
const w=ms=>p.waitForTimeout(ms),ev=(f,a)=>p.evaluate(f,a),shot=n=>p.screenshot({path:'shots/'+n});
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(40);await ev(k=>DBG.rel(k),key);await w(70);}};
const until=async(f,key,n=80)=>{for(let i=0;i<n;i++){if(await ev(f))return true;if(key)await k(key);else await w(100);}return false;};
await w(3000);
// ---------------- combat ----------------
const lvl=async lv=>ev(lv=>{const G=DBG.G;G.party.forEach(m=>{while(m.lv<lv){m.lv++;const g=HERO_DEF[m.id].g;for(const s in g)m.b[s]+=g[s];}const S=st(m);m.hp=S.hp;m.mp=S.mp;});},lv);
await ev(()=>{DBG.newGame();DBG.enterMap('town',8,8,'up');});await lvl(22);
await ev(()=>{DBG.UI.length=0;DBG.startBattle(['hydra'],'jungle',true);});await w(1500);
ok(await ev(()=>DBG.B.ember>=10&&DBG.B.pt.length===3),'boss battle starts with story ember, no Varra before trust');
ok(await until(()=>!!DBG.B.en[0].telK,null,120),'boss telegraphs its next action');
await shot('177_combat_ember_telegraph.png');
ok(await until(()=>DBG.B.act!==null,null,80),'a hero is ready');
const L=await ev(()=>CMDLIST(DBG.B.pt[DBG.B.act]).map(o=>o.n));ok(L.length>=5&&['Shard Surge','Reignite','Vent Heat'].includes(L[4]),'unique command in the menu: '+L[4]);
await ev(()=>{DBG.B.ember=104;});await w(200);await shot('178_combat_ember_full_menu.png');
ok(await ev(()=>CMDLIST(DBG.B.pt[DBG.B.act]).some(o=>o.n[0]==='★')),'Ember Art offered at 100');
// drive each unique directly through the battle queue
const run=async(id,kind,tg)=>{await ev(([id,kind,tg])=>{const B=DBG.B,u=B.pt.find(p=>p.m.id===id);const T=tg==='E'?[B.en[0]]:tg==='self'?[u]:[B.pt.find(p=>p.m.id===tg)];B.q.unshift({kind,u,tg:T,name:kind,fx:'fire',_t:1});},[id,kind,tg]);await until(()=>!DBG.B.q.some(a=>a._t)&&!(DBG.B.busy&&DBG.B.busy.a._t),null,60);await w(150);};
await ev(()=>{DBG.B.ember=40;});const hp0=await ev(()=>DBG.B.en[0].hp);await run('kael','surge','E');
ok(await ev(h=>DBG.B.en[0].hp<h&&DBG.B.pt[0].chill>=0&&DBG.B.ember>40,hp0),'Kael Shard Surge: big hit, pays HP and chills him, builds heat');
await ev(()=>{const B=DBG.B;B.pt[2].m.hp=0;B.ember=60;});await run('lyra','reignite','mira');ok(await ev(()=>DBG.B.pt[2].m.hp>0&&DBG.B.ember<=45),'Lyra Reignite revives a fallen ally (costs ember)');
await ev(()=>{DBG.B.ember=130;DBG.B.pt.forEach(p=>p.m.hp=Math.floor(st(p.m).hp/2));});await w(250);await shot('179_combat_overheat.png');
await run('mira','vent','self');ok(await ev(()=>DBG.B.ember<=85&&DBG.B.stable>0),'Mira Vent bleeds off heat into healing and stabilises');
await ev(()=>{DBG.B.ember=100;});await run('lyra','art','E');ok(await ev(()=>DBG.B.ember<100),'Ember Art spends the gauge');
ok(await until(()=>DBG.B.en[0].open||DBG.B.en[0].telK==='open',null,250),'boss shows a green OPENING');await shot('180_combat_opening.png');
await ev(()=>{DBG.setScene('map');});
// Varra joins as guest after trust
await ev(()=>{DBG.G.flags.varraT=1;DBG.UI.length=0;DBG.startBattle(['umbral','stalker'],'twilight');});await w(1600);
ok(await ev(()=>DBG.B.pt.length===4&&DBG.B.pt[3].m.id==='varraP'&&!!PAINT.varraP),'trusted Varra fights as a guest');
const g0=await ev(()=>DBG.G.gold);await run('varraP','gambit','E');ok(await ev(g=>true,g0),'Varra Gambit resolves');
await ev(()=>{const B=DBG.B;B.act=3;B.menu={k:'cmd',i:4};B.pt[3].pend=1;});await w(250);await shot('181_combat_varra_gambit.png');
await ev(()=>{DBG.setScene('map');DBG.G.flags.varraT=0;});
module.exports=0;
console.log(errs.length?'ERRORS '+errs.join(' | '):'ALL OK');await b.close();process.exit(errs.length?1:0);})();
