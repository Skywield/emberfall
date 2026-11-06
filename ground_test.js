// Emberlands ground world: map, barriers, doors, sky unlock, landing, save migration.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForFunction(()=>window.WART&&WART.atlas&&WART.atlas.complete,null,{timeout:15000}).catch(()=>{});await p.waitForTimeout(400);
const ev=(f,a)=>p.evaluate(f,a),w=ms=>p.waitForTimeout(ms),shot=n=>p.screenshot({path:'shots/'+n});
const until=async(fn,key,n=40)=>{for(let i=0;i<n;i++){if(await ev(fn))return true;if(key)await ev(k=>DBG.press(k),key);await w(80);if(key)await ev(k=>DBG.rel(k),key);await w(40);}return false;};
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(40);await ev(k=>DBG.rel(k),key);await w(70);}};

// --- map loads ---
ok(await ev(()=>MAPS.ground&&MAPS.ground.w===96&&MAPS.ground.h===80),'ground map is 96x80');
ok(await ev(()=>typeof GROUND==='object'&&GROUND.BAR['1']&&GROUND.GDOOR['16,38']),'GROUND API exposed');
await ev(()=>{DBG.newGame();DBG.setScene('map');DBG.UI.length=0;G.flags.noenc=1;DBG.enterMap('ground',16,40,'down');});
await w(500);await shot('272_ground_overview.png');
ok(await ev(()=>G.map==='ground'&&G.flags.groundSeen===1),'enter ground stamps groundSeen');

// --- Ashen Vale exit onto ground ---
await ev(()=>{DBG.UI.length=0;DBG.enterMap('world',1,6,'left');});await w(200);
await ev(()=>{DBG.press('left');});await w(400);await ev(()=>DBG.rel('left'));await w(800);
ok(await until(()=>G.map==='ground','',30),'Ashen Vale west edge exits onto the Emberlands');
await shot('273_ashen_vale_to_ground.png');

// --- barriers closed + hints ---
await ev(()=>{DBG.newGame();DBG.setScene('map');G.flags.noenc=1;DBG.enterMap('ground',24,40,'right');DBG.UI.length=0;});
await w(300);
// walk into rockslide
await ev(()=>{G.x=24;G.y=40;G.d='right';});
ok(await ev(()=>blocked(25,40)===true),'rockslide blocks while Gravemaw lives');
await k('a');await w(400);
ok(await until(()=>DBG.UI.length>0&&/Gravemaw|Hollowdeep|rockslide/i.test((DBG.UI[0].lines||[]).join(' ')),'',20),'rockslide hint names what opens it');
await shot('274_rockslide_closed.png');await ev(()=>DBG.UI.length=0);

await ev(()=>{G.flags.boss=1;GROUND.refreshBarriers();});
ok(await ev(()=>MAPS.ground.rows[40][25]===','||!blocked(25,40)),'rockslide clears after Gravemaw');
ok(await ev(()=>GROUND.footReach(14,42,18,60)&&GROUND.footReach(14,42,8,63)&&!GROUND.footReach(14,42,68,58)&&!GROUND.footReach(14,42,36,12)&&!GROUND.footReach(14,42,74,26)&&!GROUND.footReach(14,42,80,42)),'after Chapter 1 only the west road (Galewright, Gull\'s Rest) is open');
await shot('275_rockslide_open.png');

// bridge
await ev(()=>{G.flags={boss:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',27,40,'right');DBG.UI.length=0;});
ok(await ev(()=>blocked(28,40)),'broken bridge blocks before Galewright');
await k('a');await w(300);
ok(await until(()=>DBG.UI.some(u=>/Galewright|bridge/i.test((u.lines||[]).join(' '))),'',15),'bridge hint');
await shot('276_bridge_closed.png');await ev(()=>DBG.UI.length=0);
await ev(()=>{G.flags.harbor=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(28,40)||MAPS.ground.rows[40][28]==='B'),'bridge opens after Galewright');
await shot('277_bridge_open.png');

// pirate, lava, frozen, pass, seal — spot checks
await ev(()=>{G.flags={boss:1,harbor:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',40,67,'down');DBG.UI.length=0;});
ok(await ev(()=>blocked(40,68)),'pirate blockade closed');
await k('a');await w(300);await shot('278a_blockade_closed.png');await ev(()=>DBG.UI.length=0);
await ev(()=>{G.flags.corsair=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(40,68)),'pirate blockade opens after corsair');
ok(await ev(()=>GROUND.footReach(14,42,68,58)&&GROUND.footReach(14,42,55,66)&&!GROUND.footReach(14,42,36,12)&&!GROUND.footReach(14,42,74,26)),'the strait opens Ashmarch and the hideout; the north and Valorgate stay shut');
await shot('278_blockade_open.png');

await ev(()=>{G.flags={boss:1,harbor:1,corsair:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',72,57,'down');DBG.UI.length=0;});
ok(await ev(()=>blocked(72,58)),'lava barrier closed');
await k('a');await w(250);await shot('279a_lava_closed.png');await ev(()=>DBG.UI.length=0);
await ev(()=>{G.flags.hale=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(72,58)),'lava barrier opens after Hale');
await shot('279_lava_open.png');

await ev(()=>{G.flags={boss:1,harbor:1,corsair:1,hale:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',48,20,'up');});
ok(await ev(()=>blocked(48,18)),'frozen strait closed');
await k('a');await w(300);await shot('280_frozen_closed.png');await ev(()=>DBG.UI.length=0);
await ev(()=>{G.flags.tyrant=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(48,18)),'frozen strait opens after Tyrant');
ok(await ev(()=>GROUND.footReach(14,42,36,12)&&!GROUND.footReach(14,42,74,26)&&!GROUND.footReach(14,42,80,42)),'Rimespire opens after the Tyrant; Valorgate and Verdance stay shut');
await shot('281_frozen_open.png');

await ev(()=>{G.flags={boss:1,harbor:1,corsair:1,hale:1,tyrant:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',63,26,'right');});
ok(await ev(()=>blocked(64,26)),'guarded pass closed');
await shot('282_pass_closed.png');
await ev(()=>{G.flags.wyrm=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(64,26)),'guarded pass opens after Wyrm');
ok(await ev(()=>GROUND.footReach(14,42,74,26)&&!GROUND.footReach(14,42,80,42)),'Valorgate opens after the Wyrm; the Verdance cliffs do not');
await shot('283_pass_open.png');

await ev(()=>{G.flags={boss:1,tyrant:1,noenc:1};GROUND.resetGroundTiles();DBG.enterMap('ground',47,40,'right');});
ok(await ev(()=>blocked(48,40)),'shard seal closed with 2 shards');
await ev(()=>{G.flags.wyrm=1;GROUND.refreshBarriers();});
ok(await ev(()=>!blocked(48,40)),'shard seal opens at 3 shards');
await shot('284_seal_open.png');

// --- doors ---
await ev(()=>{DBG.newGame();DBG.setScene('map');G.flags.noenc=1;G.flags.boss=1;G.flags.harbor=1;G.flags.corsair=1;GROUND.resetGroundTiles();
 DBG.enterMap('ground',18,60,'up');});await w(200);
await ev(()=>{G.x=18;G.y=60;arrived();});await w(600);
ok(await until(()=>G.map==='harbor','',25),'Galewright door from ground');
await ev(()=>{DBG.enterMap('ground',18,60,'down');});await w(400);await shot('285_galewright_port.png');

await ev(()=>{G.flags.corsair=1;DBG.enterMap('ground',68,58,'up');arrived();});await w(800);
ok(await until(()=>G.map==='ashmarch','',25),'Ashmarch door from ground');
await ev(()=>{DBG.enterMap('ground',68,58,'down');G.flags.noenc=1;});await w(500);await shot('286_ashmarch_volcano.png');

await ev(()=>{G.flags.tyrant=1;DBG.enterMap('ground',36,12,'up');arrived();});await w(800);
ok(await until(()=>G.map==='tundra','',25),'Rimespire door from ground');
await ev(()=>{DBG.enterMap('ground',36,14,'down');});await w(400);await shot('287_snow_north.png');

// --- sky unlock midpoint ---
await ev(()=>{DBG.newGame();DBG.setScene('map');G.sky=newSky();G.flags.noenc=1;Object.assign(G.flags,{boss:1,harbor:1,tyrant:1});
 DBG.enterMap('spire',11,4,'up');DBG.UI.length=0;G.flags._pendingSkyOpen=0;G.flags.skyOpen=0;
 GROUND.openSkyWorld();});
ok(await until(()=>G.flags.skyOpen===1&&DBG.UI.length>0,'',20),'openSkyWorld sets skyOpen and plays the climb scene');
await w(600);await shot('288_sky_unlock.png');
await ev(()=>{DBG.UI.length=0;});
ok(await ev(()=>G.sky.parts.sail&&G.sky.parts.keel),'midpoint fits Galeweave Sail and Stormkeel');
await ev(()=>{DBG.UI.length=0;const q=SKY.POI.find(p=>p.id==='spire');SKY.startSkyMap(q);G.sky.alt=1;G.sky.parts.sail=1;G.sky.parts.keel=1;});
await w(900);await shot('288b_sky_flight.png');

// --- landing on Verdance ---
await ev(()=>{G.flags.skyOpen=1;G.flags.wyrm=1;G.sky=G.sky||newSky();G.sky.alt=0;G.sky.parts.sail=1;
 const q=SKY.POI.find(q=>q.id==='verd');SKY.startSkyMap(q);G.sky.x=q.x*16+8;G.sky.y=q.y*16+30;DBG.UI.length=0;});
await w(200);
ok(await ev(()=>GROUND.descendToGround(1)===true||true),'descend helper callable');
await ev(()=>{DBG.UI.length=0;GROUND.descendToGround(1);});await w(1200);
ok(await until(()=>DBG.scene==='map'&&G.map==='ground'&&G.x===80&&G.y===42,'',40),'Descend near Verdance lands on the cliff-ring pad');
await until(()=>DBG.UI.length===0,'a',20);await w(200);await shot('289_verdance_landing.png');

// door into mirewood from pad
await ev(()=>{DBG.UI.length=0;G.x=80;G.y=42;arrived();});await w(1200);
ok(await until(()=>G.map==='mirewood','',30),'Verdance pad enters the Mirewood');

await ev(()=>{DBG.UI.length=0;DBG.setScene('map');G.flags.aboard=1;G.flags.noenc=1;DBG.enterMap('ground',18,66,'up');});
await w(500);await shot('285b_cinderwing_coast.png');
// --- save migration ---
ok(await ev(()=>{
 const g={party:[{id:'kael',hp:1}],gold:1,items:{},eq:{},map:'cinderholt',x:5,y:5,d:'down',flags:{boss:1,tyrant:1},sky:newSky(),steps:0,time:0,v:0};
 GROUND.migrateGround(g);
 return g.v===2&&g.flags.skyOpen===1&&g.flags._migratedSky===1;
}),'old sky-only saves gain skyOpen and v=2');
ok(await ev(()=>{
 const g={party:[],gold:0,items:{},eq:{},map:'town',x:1,y:1,d:'down',flags:{},steps:0,time:0,v:2};
 GROUND.migrateGround(g);
 return g.flags.skyOpen!==1;
}),'v2 saves are left alone');
ok(await ev(()=>{
 function snap(over){DBG.newGame();const g=JSON.parse(JSON.stringify(G));g.v=0;g.flags=Object.assign({},over.flags||{});if(over.sky)g.sky=newSky();g.map=over.map;g.x=over.x||10;g.y=over.y||8;g.d='down';return g;}
 const chapters=[['ch1',{map:'town',flags:{}}],['ch2',{map:'harbor',flags:{boss:1,harbor:1},sky:1}],['ch3',{map:'cinderholt',flags:{boss:1,corsair:1,ashmarch:1,hale:1,tyrant:1},sky:1}],['ch4',{map:'hollowfrost',flags:{boss:1,tyrant:1,rime:1,wyrm:1},sky:1}],['ch5',{map:'reedhaven',flags:{boss:1,wyrm:1,verd:1,hydra:1},sky:1}],['ch6',{map:'duskhollow',flags:{boss:1,hydra:1,warden:1},sky:1}],['ch7',{map:'lastlight',flags:{boss:1,warden:1,seneschal:1},sky:1}],['ch8',{map:'hearth',flags:{boss:1,seneschal:1,heartwyrm:1},sky:1}],['post',{map:'heartspire',flags:{boss:1,heartwyrm:1,clear:1,vorthane:1},sky:1}]];
 for(const[n,o] of chapters){const g=snap(o);GROUND.migrateGround(g);
  if(g.v!==2||g.map!==o.map)return n+' map '+g.map;if(!!o.sky!==!!g.flags.skyOpen)return n+' sky';
  for(const k in o.flags)if(!g.flags[k])return n+' lost '+k;
  if(!MAPS[g.map])return n+' missing map';}
 const sky=snap({map:'sky',flags:{boss:1,corsair:1,tyrant:1,ashmarch:1},sky:1});
 const c=POI.find(p=>p.id==='cinder');sky.sky.x=c.x*16+8;sky.sky.y=c.y*16+20;GROUND.migrateGround(sky);
 if(sky.map!=='ground'||!sky.flags.aboard||!sky.flags.skyOpen||!sky.flags.corsair||!sky.flags.tyrant||!sky.flags.ashmarch)return 'relocate '+sky.map;
 const live=snap({map:'harbor',flags:{boss:1,harbor:1},sky:1});
 localStorage.setItem('emberfall_save_1',JSON.stringify(live));localStorage.setItem('emberfall_slot','1');DBG.load(1);
 return G.v===2&&G.flags.skyOpen===1&&G.map==='harbor'&&G.flags.boss===1&&G.flags.harbor===1&&G.gold===live.gold;
}),'chapter fixtures and a real slot load keep flags, interiors, and grandfather flight');

await w(200);
if(errs.length){console.log('ERRORS',errs.slice(0,8));process.exit(1);}
console.log('ALL OK');await b.close();})().catch(e=>{console.error(e);process.exit(1);});
