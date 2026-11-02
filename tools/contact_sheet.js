// Renders every enemy / sky enemy / party / NPC visual the game actually uses into a labelled contact sheet + audit JSON.
// usage: node tools/contact_sheet.js shots/NNN_name.png [audit.json]   (server on :8765)
const {chromium}=require('/tmp/pw/node_modules/playwright');const fs=require('fs');
(async()=>{const out=process.argv[2],aud=process.argv[3];const b=await chromium.launch();const p=await b.newPage();
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(3500);
const r=await p.evaluate(()=>{const items=[];const rowsOwner=new Map();for(const k in EN_ART){const r=EN_ART[k].rows;if(!rowsOwner.has(r))rowsOwner.set(r,k);}
 const src=k=>{if(PAINT[k])return 'painted';const o=rowsOwner.get(EN_ART[k].rows);return o!==k?'recolor:'+o:'pixel';};
 for(const k in EN)items.push({sec:'Battle enemies',k,n:EN[k].n,src:src(k),img:PAINT[k]?PAINT[k].im:EN_ART[k].c,px:!PAINT[k]});
 const skysrc={corsair:'recolor:cinderwing',crownwing:'recolor:storm_wyvern',heartwyrm:'recolor:throne_seraph'};
 for(const k in SKYEN){const a=SKYEN[k].art;const own=(SKYART.own&&SKYART.own[k]);items.push({sec:'Sky enemies',k,n:SKYEN[k].n,src:own?'painted':(skysrc[a]||'painted'),img:own||SKYART[a],px:false});}
 for(const k of ['kael','lyra','mira'])items.push({sec:'Party (battle)',k,n:k,src:PAINT[k]?'painted':'pixel',img:PAINT[k]?PAINT[k].im:SPR[k].left[0],px:!PAINT[k]});
 for(const k in SPR){const fp=typeof FPAINT!=='undefined'&&FPAINT[k];items.push({sec:'Field / NPC sprites',k,n:k,src:fp?'painted':'pixel(charSet palette)',img:fp?fp.down:SPR[k].down[0],px:!fp});}
 const CW=104,CH=124,COLS=8;let secs=[...new Set(items.map(i=>i.sec))],y=0,H=0;for(const s of secs)H+=26+Math.ceil(items.filter(i=>i.sec===s).length/COLS)*CH;
 const c=document.createElement('canvas');c.width=CW*COLS;c.height=H;const g=c.getContext('2d');g.fillStyle='#1b1626';g.fillRect(0,0,c.width,c.height);
 for(const s of secs){g.fillStyle='#ffd860';g.font='bold 16px sans-serif';g.fillText(s,6,y+19);y+=26;items.filter(i=>i.sec===s).forEach((it,i)=>{const x=(i%COLS)*CW,yy=y+Math.floor(i/COLS)*CH;
  g.fillStyle=it.src==='painted'?'#24304a':'#4a2430';g.fillRect(x+2,yy+2,CW-4,CH-4);const im=it.img;if(im){const w=im.width,h=im.height,sc=Math.min(92/w,88/h,it.px?6:9);g.imageSmoothingEnabled=!it.px;g.drawImage(im,x+(CW-w*sc)/2,yy+4+(88-h*sc),w*sc,h*sc);}
  g.fillStyle='#fff';g.font='10px sans-serif';g.fillText(it.k,x+5,yy+104);g.fillStyle=it.src==='painted'?'#8f8':'#f99';g.fillText(it.src,x+5,yy+117);});y+=Math.ceil(items.filter(i=>i.sec===s).length/COLS)*CH;}
 return {png:c.toDataURL('image/png'),audit:items.map(({sec,k,n,src})=>({sec,k,n,src}))};});
fs.writeFileSync(out,Buffer.from(r.png.split(',')[1],'base64'));if(aud)fs.writeFileSync(aud,JSON.stringify(r.audit,null,1));
const t={};r.audit.forEach(a=>{const s=a.src.split(':')[0];t[a.sec+' '+s]=(t[a.sec+' '+s]||0)+1;});console.log(t);await b.close();})();
