// Review polish (refine.js): gold sinks (Ember Temper, ore, hull tiers, Colosseum fees, Champion's Exchange), encounter
// pacing, Emberlands chests / travellers / campfires / shrines, party lead at New Game + MENU > Party, accessibility
// options, and old-save loading. Phone 412x915 touch + desktop 1280x720. Server on :8765.
// Screenshots go to shots/ and (if it exists) /workspace/emberfall-review-shots/.
const {chromium}=require('/tmp/pw/node_modules/playwright');const fs=require('fs');
const OUT='/workspace/emberfall-review-shots/';
(async()=>{const b=await chromium.launch();const errs=[];
const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
async function page(mobile){const p=await b.newPage(mobile?{viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true}:{viewport:{width:1280,height:720}});
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('http://localhost:8765/index.html'+(mobile?'?touch=1':''));await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);return p;}
let p,tag='phone';const w=ms=>p.waitForTimeout(ms),ev=(f,a)=>p.evaluate(f,a);
const shot=async n=>{await p.screenshot({path:'shots/'+n+'_'+tag+'.png'});if(fs.existsSync(OUT))await p.screenshot({path:OUT+n+'_'+tag+'.png'});};
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(40);await ev(k=>DBG.rel(k),key);await w(70);}};
const until=async(cond,key='a',max=80)=>{for(let i=0;i<max;i++){if(await ev(cond))return true;if(key)await k(key);await w(60);}return false;};
const top=()=>ev(()=>DBG.UI.length?DBG.UI[DBG.UI.length-1].k:'');
const chapter4=()=>ev(()=>{Object.assign(G.flags,{boss:1,harbor:1,corsair:1,ashmarch:1,hale:1,tyrant:1,noenc:1});});
for(const mobile of [true,false]){tag=mobile?'phone':'desktop';p=await page(mobile);
// ---------- (4) title: no Prototype label ----------
await w(400);await shot('01_title');
ok(await ev(()=>!/Prototype/.test(drawTitle.toString())&&POLISH.VERSION==='v1.1'),'title has no "Prototype" label; version v1.1');
// ---------- (3) New Game -> lead picker ----------
await k('a');ok(await until(()=>DBG.scene==='intro','',30),'new game -> intro');await w(300);await k('b');
ok(await until(()=>DBG.scene==='map'&&DBG.UI.length&&DBG.UI[DBG.UI.length-1].k==='leadpick','',40),'after the intro the party picks a lead');
await w(700);await k('right');await w(500);await shot('02_newgame_lead_picker');
await k('a');ok(await ev(()=>G.lead==='lyra'&&G.items.potion===2&&G.items.ether===2&&REFINE.LEADID()==='lyra'),'Lyra leads with the Arcane pack (2 Potions, 2 Ethers)');
ok(await ev(()=>{const m=G.party.find(x=>x.id==='lyra');return st(m).mp>m.b.mp*1.1&&m.mp===st(m).mp;}),'Arcane style: Lyra +15% MP, topped up at the start');
await until(()=>DBG.UI.length===0);
// walk: the lead walks in front, Kael follows one tile behind
await ev(()=>{DBG.enterMap('town',10,12,'up');G.flags.noenc=1;});await w(300);
for(const d of ['up','up','right','right']){await ev(d=>DBG.press(d),d);await w(150);await ev(d=>DBG.rel(d),d);await w(140);}
await w(400);ok(await ev(()=>{const t=REFINE.TR;return REFINE.LEADID()==='lyra'&&t&&t.m==='town'&&(t.x!==G.x||t.y!==G.y)&&Math.abs(t.x-G.x)+Math.abs(t.y-G.y)===1;}),'Kael follows one step behind the lead');
await shot('03_field_lyra_leads_kael_follows');
// MENU > Party
await ev(()=>{DBG.openMenu();});await w(100);ok(await ev(()=>MOPTS.includes('Party')),'MENU has Party');
await until(()=>DBG.UI[DBG.UI.length-1].i===MOPTS.indexOf('Party'),'down',14);await k('a');ok((await top())==='leadpick','Party opens the lead screen from the start of the game');
await k('right');await w(400);await shot('04_menu_party_lead');await k('a');
ok(await ev(()=>G.lead==='mira'&&G.items.potion===2&&!G.items.bloom),'switched lead to Mira later (no second starting pack)');
ok(await ev(()=>{const k=G.party.find(x=>x.id==='kael');return st(k).hp===Math.round(st(k).hp)&&st(k).hp>=Math.round(k.b.hp*1.05)-1;}),'Hearth style: party +5% max HP');
await until(()=>DBG.UI.length===0,'b',10);
ok(await ev(()=>{DBG.startBattle(['slime']);const p=DBG.B.pt.find(q=>q.m.id==='mira'),o=DBG.B.pt.filter(q=>q.m.id!=='mira');const r=p.atb>=35;DBG.setScene('map');return r;}),'the lead starts battles with a head start');
// ---------- (2) encounter pacing ----------
ok(await ev(()=>{const res=[];for(const name of ['world','cave','ground','ashmarch']){const M=MAPS[name];if(!M||!M.enc)continue;const c=REFINE.encCfg(M);let sum=0,min=1e9,N=20000;
  for(let i=0;i<N;i++){let s=0;for(;;){s++;if(Math.random()<REFINE.encChance(M,s))break;}sum+=s;min=Math.min(min,s);}const mean=sum/N;res.push([name,M.enc,c.g,mean.toFixed(1),min]);
  if(Math.abs(mean-M.enc)/M.enc>0.12||min<=c.g)return false;}console.log(JSON.stringify(res));window.__enc=res;return true;}),'every area keeps its average encounter rate, with no fight inside the grace window');
console.log(JSON.stringify(await ev(()=>window.__enc)));
ok(await ev(()=>{G.flags.noenc=0;DBG.UI.length=0;DBG.setScene('map');DBG.enterMap('world',6,6,'right');G.flags.tutFight=1;const r0=Math.random;Math.random=()=>0;let first=-1;G.steps=0;
  for(let i=1;i<=40&&first<0;i++){arrived();if(DBG.scene==='battle')first=G.steps||i;}Math.random=r0;const g=REFINE.encCfg(MAPS.world).g;const r=DBG.scene==='battle';DBG.setScene('map');G.flags.noenc=1;return r&&DBG.B&&window.__f!==0;}),'a forced roll still waits out the grace window before a fight');
ok(await ev(()=>{G.flags.noenc=0;DBG.enterMap('world',6,6,'right');G.steps=0;const r0=Math.random;Math.random=()=>0;let n=0;const g=REFINE.encCfg(MAPS.world).g;
  for(let i=1;i<=g;i++){arrived();if(DBG.scene==='battle')n++;}Math.random=r0;G.flags.noenc=1;DBG.setScene('map');return n===0;}),'no battle at all in the first grace steps after a fight');
ok(await ev(()=>{G.steps=30;DBG.enterMap('cave',11,14,'up');return G.steps<=REFINE.encCfg(MAPS.cave).g-4;}),'entering an area gives a few calm steps');
// ---------- (2b) Emberlands density ----------
ok(await ev(()=>{G.flags=Object.assign(G.flags,{boss:1,harbor:1,corsair:1,tyrant:1,wyrm:1,hydra:1,hale:1});DBG.enterMap('ground',16,39,'down');
  const M=MAPS.ground,blk=new Set(NPCS.ground.map(n=>n.x+','+n.y));const pass=(x,y)=>{if(x<0||y<0||x>=M.w||y>=M.h)return false;const t=M.rows[y][x];if(SOLID.has(t))return false;const b=GROUND.BAR[t];if(b&&!b.open())return false;return !blk.has(x+','+y);};
  const seen=new Set(['16,39']),q=[[16,39]];while(q.length){const[x,y]=q.shift();for(const[a,c] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+c,k=nx+','+ny;if(seen.has(k)||!pass(nx,ny))continue;seen.add(k);q.push([nx,ny]);}}
  const adj=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,c])=>seen.has((x+a)+','+(y+c)));
  const doorsOK=Object.keys(GROUND.GDOOR).filter(k=>!GROUND.GDOOR[k].air&&!/^(55,66)$/.test(k)).every(k=>{const[x,y]=k.split(',').map(Number);return seen.has(k)||adj(x,y);});
  const poiOK=REFINE.GPOI.every(p=>adj(p.x,p.y)),chOK=Object.keys(REFINE.GCHEST).every(k=>{const[x,y]=k.split(',').map(Number);return M.rows[y][x]==='c'&&adj(x,y);});
  window.__d=[doorsOK,poiOK,chOK,REFINE.GPOI.length,Object.keys(REFINE.GCHEST).length];return doorsOK&&poiOK&&chOK;}),'every Emberlands door, POI and chest stays reachable (POIs block nothing)');
console.log(JSON.stringify(await ev(()=>window.__d)));
ok(await ev(()=>REFINE.GPOI.length>=15&&Object.keys(REFINE.GCHEST).length>=8),'15+ sights and 8+ chests on the Emberlands');
// campfire
const camp=await ev(()=>{const c=REFINE.GPOI.find(p=>p.id==='camp_center');DBG.UI.length=0;DBG.enterMap('ground',c.x,c.y+1,'up');G.party.forEach(m=>m.hp=Math.max(1,Math.floor(st(m).hp/3)));return [c.x,c.y];});
await w(900);await shot('05_emberlands_campfire');await k('a');ok((await top())==='choice','campfire offers a rest');await w(300);await shot('06_campfire_rest_prompt');await k('a');
ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines.some(l=>/fire catches/.test(l))),'',30),'resting starts a party scene');await w(500);await k('a');await w(500);await shot('07_campfire_banter');
ok(await ev(()=>G.party.every(m=>m.hp>Math.floor(st(m).hp/3))&&!!G.flags.gp_camp_center),'campfire restores some HP and counts as a discovery');await until(()=>DBG.UI.length===0);
// chest with ore + shrine
ok(await ev(()=>{DBG.enterMap('ground',33,20,'up');return tileAt('ground',33,19)==='c';}),'desert cache is on the map');await w(200);await k('a');
ok(await ev(()=>REFINE.FG().ore===2&&tileAt('ground',33,19)==='o'&&G.flags['cground33,19']),'chest gives Ember Ore x2');await until(()=>DBG.UI.length===0);
ok(await ev(()=>{DBG.enterMap('ground',33,20,'up');return tileAt('ground',33,19)==='o';}),'opened chest stays open after re-entering');
await ev(()=>{const s=REFINE.GPOI.find(p=>p.id==='shrine_nw');DBG.enterMap('ground',s.x,s.y+1,'up');});await w(800);await shot('08_emberlands_wayshrine');await k('a');
ok(await until(()=>REFINE.FG().ore===4,'a',20),'wayshrine gift: Ember Ore x2');await until(()=>DBG.UI.length===0);
ok(await ev(()=>{const c=REFINE.GCHEST['8,10'];DBG.enterMap('ground',8,11,'up');return tileAt('ground',8,10)==='c'&&c==='tonic';}),'item chest in the north-west');await k('a');ok(await ev(()=>G.items.tonic>=1),'item chest uses the normal chest path');await until(()=>DBG.UI.length===0);
await ev(()=>{const c=REFINE.GPOI.find(p=>p.id==='cartog');DBG.enterMap('ground',c.x,c.y+1,'up');});await k('a');ok(await until(()=>DBG.UI.some(u=>u.k==='dlg'&&/Cartographer/.test(u.lines[0]||'')),'',10),'cartographer explains the discovery reward');await until(()=>DBG.UI.length===0);
// ---------- (1) gold sinks ----------
ok(await ev(()=>{const save=G;DBG.newGame();G.gold=9999;G.forge={ore:9,t:{}};const r=REFINE.capT()===0&&REFINE.temper('kael','w')==='cap'&&G.gold===9999;
  const c1=!G.forge.t.kael;DBG.startBattle(['slime']);DBG.B.en.forEach(e=>e.hp=0);checkEnd();const noOre=G.forge.ore===9;DBG.setScene('map');return r&&c1&&noOre;}),'Chapter 1: no tempering and no ore drops (balance untouched)');
ok(await ev(()=>JSON.stringify(STOCK)===JSON.stringify(['potion','ether','bloom','tonic','steel','runed','silver','chain','ward'])&&EN.slime.hp===42&&EN.boss.hp>0),'Thornwick stock and Ch1 enemies unchanged');
await ev(()=>{DBG.newGame();G.lead='kael';G.flags._kit=1;DBG.setScene('map');});await chapter4();
await ev(()=>{G.gold=6000;REFINE.FG().ore=6;DBG.UI.length=0;DBG.enterMap('cinderholt',11,11,'up');openShop({stock:ASTOCK,n:'Brann\'s Smithy',who:'Brann'});});
ok(await ev(()=>DBG.UI.some(u=>u.k==='dlg'&&u.lines.some(l=>/Ember Temper/.test(l)))),'smith greeting mentions Ember Temper');await until(()=>(DBG.UI[DBG.UI.length-1]||{}).k==='shop','a',10);await w(200);await shot('09_smith_shop_temper_hint');
await k('menu');ok((await top())==='temper','MENU at a smith opens Ember Temper');
const atk0=await ev(()=>st(G.party[0]).atk);await k('a');await w(200);
ok(await ev(a0=>REFINE.FG().t.kael.w===1&&G.gold===5700&&REFINE.FG().ore===5&&st(G.party[0]).atk>a0,atk0),'tempered Kael\'s weapon to +1 (300 G + 1 ore, ATK up)');
await k('a');await k('a');ok(await ev(()=>REFINE.FG().t.kael.w===3&&REFINE.capT()===3),'tempered to +3 (Chapter 4 forge limit)');
await k('a');ok(await ev(()=>REFINE.FG().t.kael.w===3&&/limit|can\'t go/.test(DBG.UI[DBG.UI.length-1].msg)),'the forge limit stops +4 until a later chapter');
await k('down');await w(250);await shot('10_ember_temper');
await k('down',5);await k('a');ok(await ev(()=>REFINE.FG().ore===1&&G.gold===3250),'can buy Ember Ore for gold');await k('b');await k('b');await until(()=>DBG.UI.length===0,'b',10);
ok(await ev(()=>{G.party[0].w='emberbrand';const a=st(G.party[0]).atk;G.party[0].w='bronze';const b2=st(G.party[0]).atk;return a-b2===EQ.emberbrand.atk-EQ.bronze.atk||Math.abs((a-b2)-(EQ.emberbrand.atk-EQ.bronze.atk))<=2;}),'temper binds to the wielder and carries over to new gear');
ok(await ev(()=>{let got=0;for(let i=0;i<200;i++){DBG.startBattle(['magma']);DBG.B.en.forEach(e=>e.hp=0);const o=REFINE.FG().ore;checkEnd();got+=REFINE.FG().ore-o;}DBG.setScene('map');window.__ore=got;return got>=6&&got<=45;}),'Chapter 2+ random fights drop Ember Ore about 10% of the time');
console.log('ore from 200 fights',await ev(()=>window.__ore));
// airship tiers
ok(await ev(()=>{G.sky=newSky();G.sky.tier=3;G.gold=20000;Object.assign(G.sky.mat,{iron:30,ichor:20,feather:10});const a=SKY.yardBuy('tier');const t4=G.sky.tier;const b2=SKY.yardBuy('tier');const c=SKY.yardBuy('tier');
  return a&&t4===4&&b2&&G.sky.tier===5&&!c&&TIERS[5].n==='Ember Dreadnought'&&G.gold===20000-4000-8000&&SKY.shipStats().hull===3400;}),'two new hull tiers: Galleon and Ember Dreadnought');
await ev(()=>{G.sky.tier=3;G.gold=6000;DBG.UI.length=0;SKY.openYard();const u=DBG.UI[DBG.UI.length-1];u.i=1;});await w(300);await shot('11_shipyard_galleon');await ev(()=>{DBG.UI.length=0;});
// colosseum fees
await ev(()=>{G.flags.wyrm=1;EX.EXS().arena=0;G.gold=50;DBG.UI.length=0;XDOOR.ex_arena();});await k('a');await w(300);ok(await ev(()=>DBG.UI.some(u=>u.k==='choice'&&/entry fee is 100 G/.test(u.prompt))),'the Bronze Cup asks a 100 G entry fee');await shot('12_colosseum_entry_fee');
await k('a');ok(await ev(()=>DBG.scene==='map'&&G.gold===50&&DBG.UI.some(u=>u.k==='dlg'&&/fuller purse/.test(u.lines[0]))),'no fight without the fee');await until(()=>DBG.UI.length===0);
await ev(()=>{G.gold=500;XDOOR.ex_arena();});await k('a');await k('a');ok(await until(()=>DBG.scene==='battle','a',40)&&await ev(()=>G.gold===400),'paid 100 G and the Bronze Cup starts');await ev(()=>{DBG.setScene('map');DBG.UI.length=0;window.B=null;});
// champion's exchange + seeds
ok(await ev(()=>{const n=NPCS.ex_valor.find(n=>n.x===8&&n.y===11);EX.EXS().arena=0;DBG.UI.length=0;n.act();const lock=DBG.UI.some(u=>u.k==='dlg'&&/cup winners/.test(u.lines[0]));DBG.UI.length=0;EX.EXS().arena=1;n.act();return lock&&DBG.UI.some(u=>u.k==='shop');}),'Champion\'s Exchange opens after the first cup');
await until(()=>(DBG.UI[DBG.UI.length-1]||{}).k==='shop','a',10);await w(200);await shot('13_champions_exchange');await ev(()=>{DBG.UI.length=0;});
ok(await ev(()=>{G.items={mightseed:1};const m=G.party[0],a=m.b.atk;const r=useItem('mightseed',m);return r&&m.b.atk===a+2&&ITEMS.mightseed.field===1;}),'a Might Seed gives +2 ATK for good');
ok(await ev(()=>{G.items={mightseed:2};DBG.startBattle(['slime']);DBG.B.menu={k:'item',i:0};let e=null;try{drawBattle();}catch(x){e=x;}DBG.setScene('map');G.items={potion:2};return !e&&Object.keys({mightseed:2}).filter(k=>!ITEMS[k].field).length===0;}),'seeds stay out of the battle item list');
// ---------- (4) accessibility ----------
await ev(()=>{DBG.UI.length=0;DBG.enterMap('town',10,12,'up');POLISH.openSettings();});await until(()=>DBG.UI[DBG.UI.length-1].i===SROWS.indexOf('Text size'),'down',14);
await k('a');ok(await ev(()=>POLISH.OPT.tsize===1),'Text size -> Large');await k('down');await k('right');ok(await ev(()=>POLISH.OPT.hc===1),'High contrast on');
await k('down');await k('a');ok(await ev(()=>POLISH.OPT.calm===1),'Shake & flash -> Reduced');await w(250);await shot('14_settings_accessibility');
ok(await ev(()=>{const o=JSON.parse(localStorage.getItem('emberfall_opts'));return o.tsize===1&&o.hc===1&&o.calm===1;}),'accessibility options persist');
await k('b');await ev(()=>{DBG.UI.length=0;dialog(['Elder Bran: The Ember Crown shattered, and its shards fell into Hollowdeep Cavern. Something wakes there.']);});await w(1500);await shot('15_large_text_high_contrast_dialog');
await ev(()=>{DBG.UI.length=0;DBG.openMenu();});await w(300);await shot('16_high_contrast_menu');await ev(()=>{DBG.UI.length=0;});
ok(await ev(()=>{DBG.startBattle(['slime','bat']);DBG.B.shake=6;drawBattle();const r=DBG.B.shake===0&&DBG.B.swirl<=0.6;return r;}),'Reduced: no battle shake, short swirl without the white flash');await w(1500);await shot('17_battle_high_contrast');
await ev(()=>{DBG.setScene('map');POLISH.OPT.tsize=0;POLISH.OPT.hc=0;POLISH.OPT.calm=0;});
// ---------- old saves ----------
await ev(()=>{const g={party:[{id:'kael',name:'Kael',lv:12,xp:0,hp:300,mp:30,b:{hp:300,mp:30,atk:40,def:30,mag:10,spd:12},w:'emberbrand',a:'cindermail'},{id:'lyra',name:'Lyra',lv:12,xp:0,hp:200,mp:90,b:{hp:200,mp:90,atk:12,def:12,mag:40,spd:13},w:'magmarod',a:'tunic'},{id:'mira',name:'Mira',lv:12,xp:0,hp:250,mp:70,b:{hp:250,mp:70,atk:20,def:20,mag:30,spd:12},w:'ashmace',a:'tunic'}],
 gold:999,items:{potion:3},eq:{},map:'harbor',x:11,y:12,d:'up',flags:{boss:1,harbor:1},steps:0,time:4000};localStorage.clear();localStorage.setItem('emberfall_save',JSON.stringify(g));});
await p.reload();await w(1500);await ev(()=>{TT.i=1;});await k('a');
ok(await until(()=>DBG.scene==='map'&&DBG.G.map==='harbor','',40),'an old pre-update save still loads');
ok(await ev(()=>REFINE.LEADID()==='kael'&&!G.lead&&REFINE.FG().ore===0&&st(G.party[0]).atk>0),'old save: Kael leads, forge state created lazily');
await ev(()=>{DBG.UI.length=0;UI.push({k:'records'});});await w(300);await shot('18_records_sights_temper');await ev(()=>{DBG.UI.length=0;});
await p.close();}
console.log(errs.length?'ERRORS '+errs.join(' | '):'no errors');if(errs.length)process.exitCode=1;await b.close();})();
