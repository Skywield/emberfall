// Emberfall automated playthrough: title -> New Game -> intro -> every story boss in order (walked into from the tile below
// its trigger row, at the balance sim's natural level) -> Vorthane -> ending -> credits -> title, then all optional bosses.
// Each fight is played by a bot for a few turns (Attack/skills through the real menus), then finished, so the run checks
// event dialogue, transitions, rewards, chapter cards, save/load and softlocks rather than balance (tools/balance_sim.js).
// node tools/playthrough.js [--shots]   (server on :8765)
const {chromium}=require('/tmp/pw/node_modules/playwright');
const LV={boss:6,tyrant:13,wyrm:16,hydra:21,warden:25,seneschal:30,vorthane:38,cindral:40,omen:50,colossus:17,sentinel:23,lqueen:29,seer:37};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const errs=[],log=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();const w=ms=>p.waitForTimeout(ms);const ev=(f,a)=>p.evaluate(f,a);
const k=async(key,n=1)=>{for(let i=0;i<n;i++){await ev(k=>DBG.press(k),key);await w(30);await ev(k=>DBG.rel(k),key);await w(45);}};
const ok=(c,m)=>{log.push((c?'ok   ':'FAIL ')+m);if(!c)errs.push('ASSERT '+m);console.log(c?'ok':'FAIL',m);};
// drive any UI / battle until we are back in control on the field (or a predicate holds)
async function settle(stop,max=900){const r=await settle_(stop,max);if(!r)console.log('  stuck:',await ev(()=>JSON.stringify({sc:DBG.scene,map:DBG.G&&DBG.G.map,xy:DBG.G&&[DBG.G.x,DBG.G.y],ui:DBG.UI.map(u=>u.k+':'+String(u.lines?u.lines[u.i]:u.prompt).slice(0,70)),B:DBG.B&&{end:DBG.B.end,menu:DBG.B.menu&&DBG.B.menu.k,en:DBG.B.en.map(e=>e.k+':'+e.hp)}})));return r;}
async function settle_(stop,max){let turns=0;for(let i=0;i<max;i++){const s=await ev(()=>({sc:DBG.scene,ui:DBG.UI.map(u=>u.k),B:DBG.B?{end:DBG.B.end,menu:DBG.B.menu&&DBG.B.menu.k}:null,SB:SKY.SB?SKY.SB.phase:null}));
  if(stop&&await ev(stop))return true;
  if(!stop&&(s.sc==='map'||s.sc==='skymap')&&!s.ui.length)return true;
  if(s.sc==='battle'&&s.B&&!s.B.end&&s.B.menu==='cmd'){turns++;if(turns>3)await ev(()=>DBG.B.en.forEach(e=>{if(e.hp>1)e.hp=1;}));}
  if(s.sc==='skybattle'){await ev(()=>{const S=SKY.SB;if(!S)return;if(S.en.hp>1)S.en.hp=1;if(S.phase==='plan'){SKY.autoPlan();SKY.startExec();}});}
  if(s.sc==='gameover'){errs.push('GAME OVER during '+JSON.stringify(s));return false;}
  await k('a');}return false;}
async function natural(lv){await ev(lv=>{const G=DBG.G;G.party.forEach(m=>{while(m.lv<lv)DBG.gainXP(xpNext(m.lv)-m.xp,1);const s=st(m);m.hp=s.hp;m.mp=s.mp;});G.items.tonic=(G.items.tonic||0)+5;},lv);}
async function walkInto(map,boss){const pos=await ev(([map,boss])=>{const M=MAPS[map],ty=map==='heartspire'||map.startsWith('ex_')?4:3;if(map.startsWith('ex_'))return [11,ty+1];for(const x of [11,12,10,13,9,14,8,15])if(!SOLID.has(M.rows[ty][x])&&!SOLID.has(M.rows[ty+1][x]))return [x,ty+1];return null;},[map,boss]);
 if(!pos)return ok(0,map+': no tile below the trigger');for(let i=0;i<60&&await ev(()=>fadeDir!==0||fade>0);i++)await w(50);await ev(([map,x,y])=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap(map,x,y,'up');},[map,...pos]);await w(150);await settle();
 for(let i=0;i<40&&await ev(()=>fadeDir!==0||fade>0);i++)await w(50);const y0=await ev(()=>DBG.G.y);await ev(()=>DBG.press('up'));for(let i=0;i<20&&await ev(y0=>DBG.G.y===y0,y0);i++)await w(30);await ev(()=>DBG.rel('up'));if(await ev(y0=>DBG.G.y===y0,y0))console.log('  no move:',await ev(()=>JSON.stringify({K,mv:F.mv,d:G.d,fade,fadeDir,sc:DBG.scene,ui:DBG.UI.length,bl:blocked(G.x,G.y-1),npc:!!npcAt(G.x,G.y-1)})));}
async function bossRun(map,boss,flag,lv){await natural(lv);await walkInto(map,boss);
 ok(await settle(()=>DBG.scene==='battle'&&DBG.B&&DBG.B.boss,120),`${boss}: event dialogue leads into the boss fight`);
 await w(400);await settle(null);ok(await ev(f=>!!DBG.G.flags[f],flag),`${boss}: defeated, flag ${flag} set, back in control`);
 const r=await ev(()=>{DBG.save();const a=JSON.stringify(DBG.G.flags);DBG.load();return a===JSON.stringify(DBG.G.flags)&&!!MAPS[DBG.G.map]||DBG.G.map==='sky';});ok(r,`${boss}: save/load round-trip`);}
await w(1500);
// title -> new game -> intro -> Thornwick
await k('a');for(let i=0;i<40&&await ev(()=>DBG.scene!=='map');i++)await k('a');await settle();ok(await ev(()=>DBG.G.map==='town'&&DBG.scene==='map'),'New Game -> intro -> Thornwick');
await ev(()=>{DBG.G.flags.noenc=1;window.SKY_NOENC=1;});
await bossRun('cave','boss','boss',LV.boss);
await ev(()=>{const G=DBG.G;if(!G.sky){G.sky=newSky();}G.sky.tut=1;Object.assign(G.flags,{harbor:1,corsair:1,ashmarch:1,hale:1});G.sky.flags.corsair=1;});
await bossRun('forge','tyrant','tyrant',LV.tyrant);
await ev(()=>Object.assign(DBG.G.flags,{rime:1,kade2:1,isolde:1}));await bossRun('spire','wyrm','wyrm',LV.wyrm);
await ev(()=>Object.assign(DBG.G.flags,{verd:1,kade3:1,sefa:1}));await bossRun('sanctum','hydra','hydra',LV.hydra);
await ev(()=>Object.assign(DBG.G.flags,{gloaming:1,nightfall:1,seren:1,varra:1,varraT:1}));await bossRun('bastion','warden','warden',LV.warden);
await ev(()=>Object.assign(DBG.G.flags,{reach:1,seraph:1,aldwin:1}));await bossRun('citadel','seneschal','seneschal',LV.seneschal);
// finale: Vorthane (two phases) -> choice -> epilogues -> credits -> title
await ev(()=>Object.assign(DBG.G.flags,{stair:1,heartwyrm:1,elowen:1}));await natural(LV.vorthane);await walkInto('heartspire','vorthane');
ok(await settle(()=>DBG.scene==='battle',120),'Vorthane: throne dialogue -> battle');ok(await settle(()=>DBG.scene==='finale_end',1500),'Vorthane (both phases) -> Kael\'s choice -> epilogues');
ok(await settle(()=>DBG.scene==='title',600),'epilogues -> credits -> title');ok(await ev(()=>{const s=JSON.parse(localStorage.getItem('emberfall_save'));return s.flags.clear===1&&s.flags.vorthane===1;}),'Clear save written');
// continue the clear save and do the optional content
await ev(()=>{DBG.load();DBG.setScene('map');DBG.UI.length=0;DBG.enterMap(DBG.G.map,DBG.G.x,DBG.G.y,'up');DBG.G.flags.noenc=1;});
await ev(()=>{const s=DBG.G.sq=DBG.G.sq||{};s.grotto={s:1,n:0};s.omen={s:1,n:0};});await bossRun('sq_grotto','cindral','cindral',LV.cindral);await bossRun('sq_rift','omen','omen',LV.omen);
for(const [m,bk,lv] of [['ex_grotto','colossus',LV.colossus],['ex_vault','sentinel',LV.sentinel],['ex_crypt','lqueen',LV.lqueen],['ex_obs','seer',LV.seer]]){
 await ev(m=>{EX.pz(m).open=1;},m);await bossRun(m,bk,'ex_'+bk,lv);}
await ev(()=>{DBG.UI.length=0;DBG.setScene('map');DBG.enterMap('ex_valor',10,8,'up');DBG.G.ex.arena=0;});await w(1200);
for(let r=0;r<4;r++){await ev(r=>{DBG.UI.length=0;EX.arenaRound(r,0);},r);await w(300);ok(await settle(()=>EX.EXS().arena===r+1&&DBG.scene==='map'&&!DBG.UI.length,1500),'Colosseum: '+['Bronze','Silver','Gold','Champion'][r]+' cup');}
ok(await ev(()=>EX.records().dn===4&&EX.records().arena===4),'Records: all optional dungeons + cups');
console.log(errs.length?'PLAYTHROUGH PROBLEMS:\n'+errs.join('\n'):'PLAYTHROUGH CLEAN');process.exitCode=errs.length?1:0;await b.close();})();
