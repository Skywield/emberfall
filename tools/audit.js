// Emberfall static audit: loads the game headless (server on :8765) and checks every map, warp, door, chest, shop,
// encounter pool, NPC and boss for broken references, unreachable exits/chests and missing dialogue.
// node tools/audit.js   -> prints problems, exit code 1 if any
const {chromium}=require('/tmp/pw/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1500);
const out=await p.evaluate(()=>{const bad=[];DBG.newGame();const G=DBG.G;
 const item=k=>ITEMS[k]||EQ[k];
 const flagSets=[{},{boss:1,harbor:1,corsair:1},{tyrant:1,wyrm:1,hydra:1},{warden:1,varraT:1,seneschal:1},{clear:1,vorthane:1}];
 for(const m in MAPS){const M=MAPS[m];
  if(!M.rows.every(r=>r.length===M.w))bad.push(m+': ragged rows');
  for(const w of M.warps||[]){if(w.to.startsWith('__'))continue;const T=MAPS[w.to];if(!T){bad.push(m+': warp to missing map '+w.to);continue;}
   if(w.tx<0||w.ty<0||w.tx>=T.w||w.ty>=T.h)bad.push(m+': warp target out of bounds '+w.to);else if(SOLID.has(T.rows[w.ty][w.tx]))bad.push(m+': warp lands on solid tile in '+w.to+' '+w.tx+','+w.ty);
   else if((T.warps||[]).some(v=>v.x===w.tx&&v.y===w.ty))bad.push(m+': warp lands on another warp in '+w.to);}
  for(const d in M.doors||{}){const h=M.doors[d];if(!['inn','shop','elder'].includes(h)&&!XDOOR[h])bad.push(m+': door '+d+' has no handler '+h);}
  for(const c in M.chests||{}){if(!item(M.chests[c]))bad.push(m+': chest '+c+' holds unknown '+M.chests[c]);const[x,y]=c.split(',').map(Number);if(M.rows[y][x]!=='c')bad.push(m+': chest '+c+' not on a chest tile');}
  for(const g of M.pool||[])for(const e of g){if(!EN[e])bad.push(m+': pool enemy '+e+' missing');else if(!EN_ART[e]&&!PAINT[e])bad.push(m+': no art for '+e);}
  // reachability from every arrival point (ignoring story gates/NPCs): all warps, door steps and chest fronts
  const arr=[];for(const k in MAPS)for(const w of MAPS[k].warps||[])if(w.to===m)arr.push([w.tx,w.ty]);if(!arr.length)continue;
  const solid=(x,y)=>x<0||y<0||x>=M.w||y>=M.h||(SOLID.has(M.rows[y][x])&&M.rows[y][x]!=='5');/* '5' = puzzle gates, open once solved */const seen={};const q=[arr[0]];seen[arr[0]]=1;
  while(q.length){const[x,y]=q.shift();if((M.doors||{})[x+','+y])continue;for(const[a,c]of Object.values(DIRS)){const k=[x+a,y+c];if(seen[k]||solid(...k))continue;seen[k]=1;q.push(k);}}
  for(const w of M.warps||[])if(!seen[[w.x,w.y]])bad.push(m+': warp '+w.x+','+w.y+' unreachable');
  for(const c in M.chests||{}){const[x,y]=c.split(',').map(Number);if(![[0,1],[1,0],[0,-1],[-1,0]].some(([a,b])=>seen[[x+a,y+b]]))bad.push(m+': chest '+c+' unreachable');}
  for(const d in M.doors||{}){const[x,y]=d.split(',').map(Number);if(!seen[[x,y+1]])bad.push(m+': door '+d+' unreachable');}}
 // NPC dialogue in several story states
 for(const fs of flagSets){G.flags=Object.assign({},fs);for(const m in NPCS){let L=[];try{L=NPCS[m];}catch(e){bad.push(m+': NPC getter throws');continue;}
  for(const n of L){if(!SPR[n.s])bad.push(m+': NPC sprite missing '+n.s);if(n.act)continue;let ln;try{ln=n.lines();}catch(e){bad.push(m+': NPC '+n.s+' lines throw '+e.message);continue;}
   if(!ln||!ln.length)bad.push(m+': NPC '+n.s+' has no lines in '+JSON.stringify(fs));else if(ln.some(l=>typeof l!=='string'||/undefined|NaN/.test(l)))bad.push(m+': NPC '+n.s+' bad line');}}}
 // shops
 const stocks={STOCK,ASTOCK,FSHOP,FSMITH,MSHOP,MSMITH,VSHOP,VSMITH,RSHOP:THRONE.RSHOP,RSMITH:THRONE.RSMITH,HSHOP,HSMITH,...Object.fromEntries(Object.entries(EX.EXSHOP))};
 for(const s in stocks){for(const k of stocks[s])if(!item(k))bad.push('shop '+s+': unknown '+k);if(stocks[s].length>9)bad.push('shop '+s+': '+stocks[s].length+' items but the shop window shows 9');}
 for(const k in EN)if(EN[k].boss&&!XWIN[k]&&!['boss','varra','vorthane','vorthane2','vorthane3','vasska'].includes(k))bad.push('boss '+k+' has no win handler');
 for(const k in EN){const e=EN[k];if(!(e.hp>0&&e.atk>=0&&e.xp>=0))bad.push('enemy '+k+' bad stats');}
 return bad;});
console.log(out.length?out.join('\n'):'audit clean');if(errs.length)console.log('page errors',errs);process.exitCode=out.length||errs.length?1:0;await b.close();})();
