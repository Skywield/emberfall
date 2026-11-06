// node tools/isle_shots.js <tag> <startNo>  -> shots of the four expansion islands on the sky map (412x915)
const {chromium}=require('/tmp/pw/node_modules/playwright');const tag=process.argv[2],n0=+process.argv[3];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:915},deviceScaleFactor:2,hasTouch:true,isMobile:true});
await p.goto('http://localhost:8765/index.html?touch=1');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
const L=['ex_salt','ex_valor','ex_lant','ex_obs'];
for(let i=0;i<4;i++){await p.evaluate(id=>{DBG.newGame();DBG.setStage&&0;G.sky=newSky();G.flags.noenc=1;const e=EX.EXPOI.find(q=>q.id===id);SKY.startSkyMap(e);G.sky.y-=10;DBG.UI.length=0;},L[i]);
 await p.waitForTimeout(600);await p.screenshot({path:`shots/${n0+i}_${L[i]}_${tag}.png`});}
await b.close();})();
