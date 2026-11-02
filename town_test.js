// Regression: new game -> walk to Thornwick inn & shop doors (and talk to Marla/Tessa) and use both, on desktop keyboard and on mobile touch.
const {chromium}=require('/tmp/pw/node_modules/playwright');
const assert=(c,m)=>{if(!c){console.error('FAIL',m);process.exitCode=1;throw new Error(m);}console.log('ok',m);};
async function run(mobile){const b=await chromium.launch();
 const p=await b.newPage(mobile?{viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true}:{viewport:{width:1024,height:768}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));const tag=mobile?'mobile':'desktop';
 await p.goto('http://localhost:8765/index.html'+(mobile?'?touch=1':''));await p.evaluate(()=>localStorage.clear());await p.reload();
 const w=ms=>p.waitForTimeout(ms);const cdp=mobile?await p.context().newCDPSession(p):null;
 const SEL={up:'#u',down:'#d',left:'#l',right:'#r',a:'#a',b:'#b'},KEY={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',a:'KeyZ',b:'KeyX'};
 async function down(k){if(mobile){const bb=await p.locator(SEL[k]).boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:bb.x+bb.width/2,y:bb.y+bb.height/2}]});}else await p.keyboard.down(KEY[k]);}
 async function up(k){if(mobile)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await p.keyboard.up(KEY[k]);}
 const tap=async(k,n=1)=>{for(let i=0;i<n;i++){await down(k);await w(50);await up(k);await w(90);}};
 const st=()=>p.evaluate(()=>({scene:DBG.scene,x:DBG.G&&DBG.G.x,y:DBG.G&&DBG.G.y,ui:DBG.UI.map(u=>u.k),gold:DBG.G&&DBG.G.gold,mv:F.mv}));
 async function step(d){const s0=await st();await down(d);for(let i=0;i<40;i++){await w(25);const s=await st();if((s.x!==s0.x||s.y!==s0.y)||s.ui.length)break;}await up(d);
  for(let i=0;i<40;i++){if((await st()).mv===0)break;await w(25);}await w(60);}
 async function walk(tx,ty){for(let g=0;g<60;g++){const s=await st();if(s.x===tx&&s.y===ty)return;
  const path=await p.evaluate(([tx,ty])=>{const q=[[G.x,G.y]],prev={};prev[G.x+','+G.y]=null;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)break;
   for(const[d,[a,b]]of Object.entries(DIRS)){const k=(x+a)+','+(y+b);if(k in prev||blocked(x+a,y+b)||MAPS[G.map].doors[k])continue;prev[k]=[x+','+y,d];q.push([x+a,y+b]);}}
   let k=tx+','+ty,out=[];if(!(k in prev))return null;while(prev[k]){out.unshift(prev[k][1]);k=prev[k][0];}return out;},[tx,ty]);
  if(!path)assert(0,`${tag}: path to ${tx},${ty} exists`);await step(path[0]);}
  throw new Error('walk timeout');}
 const clear=async()=>{for(let i=0;i<40&&(await st()).ui.length;i++){const u=(await st()).ui;if(u[u.length-1]!=='dlg')break;await tap('a');}};
 // title -> intro -> town
 await w(1200);await tap('a');await w(600);for(let i=0;i<60&&(await st()).scene!=='map';i++){await tap('a');}
 await w(500);await clear();let s=await st();assert(s.scene==='map'&&s.x===10&&s.y===13,`${tag}: new game starts in Thornwick at 10,13`);
 await p.evaluate(()=>DBG.G.party.forEach(m=>m.hp=1));
 // INN via door
 await walk(3,5);await step('up');s=await st();assert(s.ui.includes('choice'),`${tag}: inn door opens Marla's choice`);
 await w(300);await p.screenshot({path:`shots/inn_${tag}.png`});
 await tap('a');await w(900);await clear();s=await st();assert(s.gold===100,`${tag}: inn charged 20G (gold ${s.gold})`);
 assert(await p.evaluate(()=>DBG.G.party.every(m=>m.hp>1)),`${tag}: party healed`);
 // SHOP via door
 await walk(16,5);await step('up');s=await st();assert(s.ui.includes('shop'),`${tag}: shop door opens shop`);
 await clear();await tap('a');await w(100);s=await st();assert(s.gold===100-await p.evaluate(()=>priceOf('potion')),`${tag}: bought a potion (gold ${s.gold})`);
 await w(200);await p.screenshot({path:`shots/shop_${tag}.png`});await tap('b');await w(200);await clear();
 // talking to the keepers also opens their service (mobile: tap the canvas = A)
 await walk(16,6);await step('right');await step('up');s=await st();
 if(s.ui.length===0){if(mobile){await p.locator('#c').tap();}else await tap('a');}await w(200);s=await st();assert(s.ui.includes('shop'),`${tag}: talking to Tessa opens shop`);
 await clear();await tap('b');await w(200);await clear();
 await walk(2,6);await tap('up');await w(200);s=await st();assert(s.ui.length===0,'facing Marla');if(mobile)await p.locator('#c').tap();else await tap('a');await w(200);
 s=await st();assert(s.ui.includes('choice'),`${tag}: talking to Marla opens inn`);await tap('down');await tap('a');await clear();
 assert(errs.length===0,`${tag}: no page errors ${errs}`);await b.close();}
(async()=>{try{await run(false);await run(true);}catch(e){console.error(e.message);process.exitCode=1;}})();
