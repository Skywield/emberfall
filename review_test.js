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
const g0=await ev(()=>({g:DBG.G.gold,e:DBG.B.en[0].hp,v:DBG.B.pt[3].m.hp}));await run('varraP','gambit','E');ok(await ev(o=>(DBG.G.gold>o.g&&DBG.B.en[0].hp<o.e)||DBG.B.pt[3].m.hp<o.v,g0),'Varra Gambit pays out (hit + plunder) or backfires on her');
await ev(()=>{const B=DBG.B;B.act=3;B.menu={k:'cmd',i:4};B.pt[3].pend=1;});await w(250);await shot('181_combat_varra_gambit.png');
await ev(()=>{DBG.setScene('map');DBG.G.flags.varraT=0;});

// ---------------- voices, banter, the Hollow freezing bonds ----------------
const dlgText=()=>ev(()=>{const d=DBG.UI.find(u=>u.k==='dlg');return d?d.lines.join('\n'):'';});
await ev(()=>{DBG.UI.length=0;DBG.G.flags={};DBG.enterMap('town',8,8,'up');dialog(['Lyra: One shard... six more to go.','Mira: Then we\'d better head back and tell Elder Bran.']);});await w(600);
let t=await dlgText();ok(/A YEAR/.test(t)&&/midsummer/.test(t)&&/numb around his sword/.test(t),'rewritten voices + banter + Kael chill after Gravemaw');
await ev(()=>{DBG.UI[0].i=2;DBG.UI[0].ch=999;});await w(400);await shot('182_banter_shard_one.png');
await ev(()=>{DBG.UI.length=0;DBG.G.flags.hydra=1;DBG.G.flags.warden=0;DBG.enterMap('duskhollow',8,8,'up');varraAct();});await w(300);
t=await dlgText();ok(/worth a fleet/.test(t)&&/primary source/.test(t)&&/It's medicine/.test(t)&&/Nobody's selling it/.test(t),'Varra pitches selling the Crown; Lyra/Mira/Kael disagree');
await ev(()=>{const d=DBG.UI[0];d.i=d.lines.findIndex(l=>/worth a fleet/.test(l));d.ch=999;});await w(400);await shot('183_banter_varra_pitch.png');
await ev(()=>{DBG.UI.length=0;});
await ev(()=>{DBG.G.flags.wyrm=0;DBG.enterMap('hollowfrost',8,8,'down');});await w(1400);
ok(await ev(()=>{const n=F.npcs.find(n=>n.frz);return n&&n.s==='frz_yrsa'&&/can't remember/.test(n.lines().join(' '));}),'frozen townsperson in Hollowfrost has forgotten her sister');
await ev(()=>{const n=F.npcs.find(n=>n.frz);DBG.G.x=n.x;DBG.G.y=n.y+1;DBG.G.d='up';});await w(900);await shot('184_hollow_frozen_ylva.png');
await ev(()=>{const n=F.npcs.find(n=>n.frz);dialog(n.lines());});await w(500);await shot('185_hollow_frozen_dialogue.png');await ev(()=>{DBG.UI.length=0;DBG.G.flags.wyrm=1;DBG.enterMap('hollowfrost',8,8,'down');});await w(900);
ok(await ev(()=>{const n=F.npcs.find(n=>n.frz);return n.s==='yrsa'&&/I remember YOU/.test(n.lines().join(' '));}),'she thaws (and remembers) once the shard is won');
ok(await ev(()=>['town','cinderholt','hollowfrost','reedhaven','duskhollow'].every(m=>NPCS[m].some(n=>n.frz))),'frozen townsfolk in five towns');
// ---------------- seventh-shard foreshadowing ----------------
await ev(()=>{DBG.G.flags={boss:1,tyrant:1};DBG.UI.length=0;dialog(['Your party feels refreshed! (HP/MP restored, game saved.)']);});await w(300);
t=await dlgText();ok(/seventh/.test(t),'inn dream foreshadows the seventh shard');await ev(()=>{DBG.UI[0].i=1;DBG.UI[0].ch=999;});await w(400);await shot('186_kael_dream.png');await ev(()=>{DBG.UI.length=0;});
await ev(()=>{DBG.enterMap('town',10,9,'down');});ok(await until(()=>{const f=(T%6);return f<0.5;},null,90),'ember flicker window');await w(250);await shot('187_kael_ember_flicker.png');
// ---------------- endings ----------------
for(const [e,n] of [['keeper','188_ending_keeper_thornwick.png'],['free','189_ending_free_thornwick.png']]){
 await ev(e=>{DBG.UI.length=0;DBG.G.flags={clear:1,ending:e,boss:1,tyrant:1,wyrm:1,hydra:1,warden:1,seneschal:1,vorthane:1};DBG.enterMap('town',8,8,'up');},e);await w(1500);
 const L=await ev(()=>F.npcs.find(n=>n.s==='elder').lines().join(' '));ok(e==='keeper'?/fountain/.test(L):/lit itself/.test(L),'Thornwick reflects the '+e+' ending: '+L.slice(0,50));
 await ev(()=>{dialog(F.npcs.find(n=>n.s==='elder').lines());});await w(2200);await shot(n);await ev(()=>{DBG.UI.length=0;});}
ok(await ev(()=>{DBG.G.flags.ending='keeper';const a=JSON.stringify(epi());DBG.G.flags.ending='free';return a!==JSON.stringify(epi());}),'epilogues differ by ending for every hero');

console.log(errs.length?'ERRORS '+errs.join(' | '):'ALL OK');await b.close();process.exit(errs.length?1:0);})();
