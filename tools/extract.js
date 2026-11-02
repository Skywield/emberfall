// Dumps live game data (EN, EQ, ITEMS, MAPS pools, HERO_DEF, SKYEN, shops) from the running game to tools/data.json. Needs server on :8765.
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1200);
const d=await p.evaluate(()=>{const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>typeof v==='function'?'fn':v));
 const maps={};for(const k in MAPS){const m=MAPS[k];maps[k]={w:m.w,h:m.h,enc:m.enc||0,pool:m.pool||[],bbg:m.bbg};}
 return {SK:strip(SK),EN:strip(EN),EQ:strip(EQ),ITEMS:strip(ITEMS),HERO_DEF:strip(HERO_DEF),SKYEN:strip(SKYEN),maps,
  shops:{c1:STOCK,c3:ASTOCK,c4:[...FSHOP,...FSMITH],c5:[...MSHOP,...MSMITH],c6:[...VSHOP,...VSMITH],c7:[...THRONE.RSHOP,...THRONE.RSMITH],c8:[...HSHOP,...HSMITH]}};});
require('fs').writeFileSync(__dirname+'/data.json',JSON.stringify(d,null,1));console.log(Object.keys(d.EN).length,'enemies');await b.close();})();
