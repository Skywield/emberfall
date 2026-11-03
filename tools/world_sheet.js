// World art audit: every field tile (TILES), every map (thumbnail), every battle backdrop and the sky map -> contact sheet + JSON.
// usage: node tools/world_sheet.js shots/NNN_name.png [audit.json]   (server on :8765)
const {chromium}=require('/tmp/pw/node_modules/playwright');const fs=require('fs');
(async()=>{const out=process.argv[2],aud=process.argv[3];const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:700}});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(4000);
const r=await p.evaluate(async()=>{const raf=()=>new Promise(r=>setTimeout(r,250));const use={};for(const m in MAPS)for(const row of MAPS[m].rows)for(const c of row)(use[c]=use[c]||new Set()).add(m);
 const isP=c=>!!(typeof PTILE!=='undefined'&&PTILE.has(c));const tiles=Object.keys(TILES).map(k=>({k,src:isP(k)?'painted':'procedural',maps:[...(use[k]||[])],img:(isP(k)&&ptCanvas(k))||TILES[k][0]}));
 const maps=Object.keys(MAPS).map(m=>{const M=MAPS[m],c=document.createElement('canvas'),s=4;c.width=M.w*s;c.height=M.h*s;const g=c.getContext('2d');g.imageSmoothingEnabled=true;
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){const t=M.rows[y][x],tl=TILES[t]||TILES['.'];g.drawImage((isP(t)&&ptCanvas(t))||tl[0],x*s,y*s,s,s);}
  const n=new Set(M.rows.join(''));return {k:m,name:M.name,w:M.w,h:M.h,painted:[...n].filter(isP).length,total:n.size,img:c};});
 const bds=[];for(const cv of [0,1,'ash','forge','snow','glacier','jungle','sunken','twilight','throne','heart']){DBG.newGame();DBG.startBattle(['slime'],cv,0);DBG.B.intro=0;DBG.B.swirl=0;await raf();await raf();
  const c=document.createElement('canvas');c.width=256;c.height=152;c.getContext('2d').drawImage(document.getElementById('c'),0,0,768,456,0,0,256,152);bds.push({k:String(cv||'field'),src:typeof WART!=='undefined'&&WART.bd[bdKey(cv)]?'painted':'procedural',img:c});}
 let sky=null;try{DBG.newGame();G.sky=newSky();G.sky.x=20*16;G.sky.y=22*16;UI=[];DBG.setScene('skymap');{await raf();await raf();sky=document.createElement('canvas');sky.width=256;sky.height=224;sky.getContext('2d').drawImage(document.getElementById('c'),0,0,768,672,0,0,256,224);}}catch(e){}
 const COLS=10,CW=80,CH=96,mw=200;const tr=Math.ceil(tiles.length/COLS);const mapRows=Math.ceil(maps.length/4);const Hh=30+tr*CH+30+mapRows*170+30+Math.ceil(bds.length/3)*180+(sky?260:0);
 const c=document.createElement('canvas');c.width=COLS*CW;c.height=Hh;const g=c.getContext('2d');g.fillStyle='#1b1626';g.fillRect(0,0,c.width,c.height);let y=0;
 const head=t=>{g.fillStyle='#ffd860';g.font='bold 16px sans-serif';g.fillText(t,6,y+20);y+=30;};
 head('Field tiles ('+tiles.length+')');tiles.forEach((t,i)=>{const x=(i%COLS)*CW,yy=y+Math.floor(i/COLS)*CH;g.fillStyle=t.src==='painted'?'#24304a':'#4a2430';g.fillRect(x+2,yy+2,CW-4,CH-4);
  g.imageSmoothingEnabled=t.src==='painted';g.drawImage(t.img,x+8,yy+6,64,64);g.fillStyle='#fff';g.font='11px sans-serif';g.fillText(JSON.stringify(t.k)+' '+t.maps.length+'m',x+6,yy+80);g.fillStyle=t.src==='painted'?'#8f8':'#f99';g.fillText(t.src,x+6,yy+92);});y+=tr*CH;
 head('Maps ('+maps.length+')');maps.forEach((m,i)=>{const x=(i%4)*mw,yy=y+Math.floor(i/4)*170;const s=Math.min((mw-8)/m.img.width,140/m.img.height);g.imageSmoothingEnabled=true;g.drawImage(m.img,x+4,yy,m.img.width*s,m.img.height*s);g.fillStyle=m.painted===m.total?'#8f8':'#f99';g.font='11px sans-serif';g.fillText(m.k+' '+m.painted+'/'+m.total,x+4,yy+156);});y+=mapRows*170;
 head('Battle backdrops');bds.forEach((d,i)=>{const x=(i%3)*266,yy=y+Math.floor(i/3)*180;g.drawImage(d.img,x+4,yy);g.fillStyle=d.src==='painted'?'#8f8':'#f99';g.font='12px sans-serif';g.fillText(d.k+' '+d.src,x+6,yy+166);});y+=Math.ceil(bds.length/3)*180;
 if(sky){head('Sky map');g.drawImage(sky,4,y);}
 return {png:c.toDataURL('image/png'),audit:{tiles:tiles.map(({k,src,maps})=>({k,src,maps})),maps:maps.map(({k,name,w,h,painted,total})=>({k,name,w,h,painted,total})),backdrops:bds.map(({k,src})=>({k,src})),sky:!!sky}};});
fs.writeFileSync(out,Buffer.from(r.png.split(',')[1],'base64'));if(aud)fs.writeFileSync(aud,JSON.stringify(r.audit,null,1));
const a=r.audit;console.log('tiles',a.tiles.length,'painted',a.tiles.filter(t=>t.src==='painted').length,'maps',a.maps.length,'backdrops painted',a.backdrops.filter(t=>t.src==='painted').length+'/'+a.backdrops.length);await b.close();})();
