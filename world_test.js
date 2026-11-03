// Painted world: tile atlas + manifest load and cover every tile char used by any map; every battle backdrop and the
// sky-map islands / clouds / cloud sea are painted; collision and doors are untouched (same SOLID set, same rows);
// before/after shots per area on a 412x915 phone (the "before" frame = procedural fallback with the painted art switched off).
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const errs=[];const ok=(c,m)=>{if(!c){errs.push('ASSERT: '+m);console.log('FAIL',m);}else console.log('ok',m);};
const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('requestfailed',r=>{if(r.url().includes('/art/'))errs.push('404 '+r.url());});p.on('response',r=>{if(r.status()>=400&&r.url().includes('/art/'))errs.push(r.status()+' '+r.url());});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();
const ev=(f,a)=>p.evaluate(f,a),w=ms=>p.waitForTimeout(ms);
await p.waitForFunction(()=>window.WART&&WART.atlas&&Object.keys(WART.bd).length===11&&WART.sea&&Object.keys(WART.isle).length>=15&&WART.cloud.white,null,{timeout:15000}).catch(()=>{});
ok(await ev(()=>WART.atlas&&WART.atlas.naturalWidth===432&&WART.atlas.naturalHeight%48===0),'painted tile atlas loads (48px cells, 9 variants)');
ok(await ev(()=>PTILE.size===Object.keys(PTILE_MAN).length&&PTILE.size>=80),'manifest: every painted tile registered');
const miss=await ev(()=>{const u=new Set();for(const m in MAPS)for(const r of MAPS[m].rows)for(const c of r)u.add(c);return [...u].filter(c=>!PTILE.has(c));});
ok(miss.length===0,'every tile char used by any map is painted (missing: '+miss.join('')+')');
ok(await ev(()=>Object.keys(TILES).every(k=>PTILE.has(k))),'every TILES entry has a painted replacement');
ok(await ev(()=>{const r=PTILE_MAN;return Object.values(r).every(v=>(v.row+v.frames)*48<=WART.atlas.naturalHeight);}),'manifest rows inside the atlas');
ok(await ev(()=>['~','L','K','l','k','#'].every(c=>PTILE.get(c).frames===2)),'water / lava / void tiles animate (2 frames)');
ok(await ev(()=>Object.keys(WART.bd).length===11&&['field','cave','ash','forge','snow','glacier','jungle','sunken','twilight','throne','heart'].every(k=>WART.bd[k].naturalWidth===768)),'11 painted battle backdrops load');
ok(await ev(()=>['dock','wreck','ruin','hide','ash','frost','mire','veil','throne','storm'].every(k=>WART.isle[k])&&WART.sea&&WART.cloud.storm),'painted sky islands, clouds and cloud sea load');
// a painted tile actually reaches the screen: drawPT draws from the atlas and returns true
ok(await ev(()=>{DBG.setStage('town');const c=document.createElement('canvas');return drawPT('.',3,4,0,0)===true&&drawPT('\u0001',0,0,0,0)===false;}),'drawPT draws painted cells and falls back for unknown chars');
// collision is untouched: SOLID chars and map rows did not change, a tree still blocks and grass does not
ok(await ev(()=>{DBG.setStage('town');return blocked(0,0)===true&&SOLID.has('T')&&!SOLID.has('.')&&MAPS.town.rows[0][0]==='T';}),'collision unchanged (tree blocks, grass walkable)');
// before / after per area
const off=()=>ev(()=>{window.__pt=[new Map(PTILE),{...WART.bd},WART.sea,{...WART.isle},{...WART.cloud}];PTILE.clear();for(const k in WART.bd)delete WART.bd[k];WART.sea=null;for(const k in WART.isle)delete WART.isle[k];for(const k in WART.cloud)delete WART.cloud[k];});
const on=()=>ev(()=>{const[a,b2,s,i,c]=window.__pt;a.forEach((v,k)=>PTILE.set(k,v));Object.assign(WART.bd,b2);WART.sea=s;Object.assign(WART.isle,i);Object.assign(WART.cloud,c);});
let n=191;const pair=async(name,setup)=>{await ev(setup);await w(350);await off();await w(150);await p.screenshot({path:`shots/${n}_${name}_before.png`});await on();await w(150);await p.screenshot({path:`shots/${n+1}_${name}_after.png`});n+=2;};
const map=(m,x,y)=>`()=>{DBG.setStage('${m}');DBG.enterMap('${m}',${x},${y},'down');DBG.UI.length=0;}`;
const areas=[['town','town',10,9],['world','world',6,4],['cave','cave',11,12],['harbor','harbor',10,8],['ashmarch','ashmarch',12,6],['cinderholt','cinderholt',10,7],['tundra','tundra',12,6],['hollowfrost','hollowfrost',10,7],
 ['mirewood','mirewood',12,6],['reedhaven','reedhaven',10,7],['gloam','gloam',12,6],['duskhollow','duskhollow',10,7],['causeway','causeway',12,6],['citadel','citadel',12,8],['heartspire','heartspire',12,10],['ex_saltmere','ex_saltmere',10,8],['ex_obs','ex_obs',12,7]];
for(const[nm,m,x,y]of areas){const fn=eval(map(m,x,y));await pair('map_'+nm,fn);}
ok(await ev(()=>DBG.scene==='map'),'field scenes render');
for(const cv of ['field','cave','forge','glacier','sunken','twilight','throne','heart']){await pair('battle_'+cv,eval(`()=>{DBG.newGame();DBG.startBattle(['slime'],${cv==='field'?0:cv==='cave'?1:`'${cv}'`},0);DBG.B.intro=0;DBG.B.swirl=0;}`));}
ok(await ev(()=>DBG.scene==='battle'&&BDRAW(DBG.B.cave)===true),'battle draws the painted backdrop');
await pair('skymap',()=>{DBG.newGame();G.sky=newSky();G.sky.x=22*16;G.sky.y=24*16;DBG.UI.length=0;DBG.setScene('skymap');});
ok(await ev(()=>SKYSEA(0,0,0)===true),'sky map draws the painted cloud sea');
n=244;
// follow-up: soft ground edges, readable dark dungeons, repainted heart backdrop
ok(await ev(()=>{DBG.setStage('town');EDGE_C.clear();drawField();return EDGE_C.size>0&&typeof DARKFX==='function';}),'soft blended edges drawn between different ground types');
ok(await ev(()=>{DBG.setStage('town');const r=MAPS.town.rows;let g=null;for(let y=0;y<r.length&&!g;y++)for(let x=0;x<r[y].length;x++)if(r[y][x]===','&&!npcAt(x,y)){g=[x,y];break;}return blocked(0,0)===true&&g&&!blocked(g[0],g[1]);}),'edges are visual only: collision unchanged');
for(const[nm,m,x,y]of [['town','town',10,9],['world','world',6,4],['saltmere','ex_saltmere',10,8],['cave','cave',11,12],['citadel','citadel',12,8],['heartspire','heartspire',12,10],['obs','ex_obs',12,7]]){await ev(eval(map(m,x,y)));await w(350);await p.screenshot({path:`shots/${n++}_v2_${nm}.png`});}
await ev(()=>{DBG.newGame();DBG.startBattle(['slime'],'heart',0);DBG.B.intro=0;DBG.B.swirl=0;});await w(400);await p.screenshot({path:`shots/${n++}_v2_battle_heart.png`});
ok(await ev(()=>{DBG.setStage('town');DBG.UI.length=0;const t={s:"Kael's breath frosts — just his.",t:2};drawToastBar(t);const c1=t.c;G.x+=1;drawToastBar(t);return c1===t.c&&c1.width===W*SC;}),'walking toast is cached at device resolution and blitted in screen space (no shimmer)');
await ev(()=>{DBG.setStage('town');DBG.UI.length=0;TOAST={s:"Kael's breath frosts — just his.",t:2.4};});await w(300);await p.screenshot({path:`shots/${n++}_v2_toast_phone.png`});
// performance: 300 field frames with the painted atlas
const ms=await ev(()=>{DBG.setStage('town');const t0=performance.now();for(let i=0;i<300;i++)drawField();return (performance.now()-t0)/300;});
ok(ms<8,'painted field frame cost '+ms.toFixed(2)+'ms (<8ms)');
ok(errs.length===0,'no page errors / missing art ('+errs.slice(0,3).join(' | ')+')');
console.log(errs.length?'ERRORS '+errs.join(' | '):'ALL OK');await b.close();process.exit(errs.length?1:0);})();
