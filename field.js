// Painted field / overworld sprites: party + every NPC now use green-screen painted chibi art
// (art/painted/field_*_src.jpg -> art/key_field.py -> art/game/field/*.png, 48x64 = 16x21 logical).
// Heroes have stand + mid-stride paintings for front / back / side, so the walk cycle (frames 1/2) still animates.
// SPR[k] is replaced in place once its images load; the old charSet pixel frames remain the fallback until then.
const FPAINT={};
function fpLoad(src){return new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src='art/game/field/'+src+'.png';});}
function fpCanvas(im,mirror){const c=document.createElement('canvas');c.width=48;c.height=64;const g=c.getContext('2d');if(mirror){g.translate(48,0);g.scale(-1,1);}g.drawImage(im,0,0);return c;}
function fpApply(k,set){const s=SPR[k];if(!s)return;for(const d in set)s[d]=set[d];FPAINT[k]={down:set.down[0]};}
['kael','lyra','mira'].forEach(h=>Promise.all(['down_s','down_w','up_s','up_w','side_s','side_w'].map(v=>fpLoad(h+'_'+v))).then(([ds,dw,us,uw,ss,sw])=>{if(!ds||!sw)return;
 const C=fpCanvas;const right=[C(ss),C(sw),C(ss)];fpApply(h,{down:[C(ds),C(dw),C(dw,true)],up:[C(us),C(uw),C(uw,true)],side:right,right,left:[C(ss,true),C(sw,true),C(ss,true)]});}));
Object.keys(SPR).filter(k=>!HEROPAL[k]).forEach(k=>fpLoad(k).then(im=>{if(!im)return;const c=fpCanvas(im),f=[c,c,c];fpApply(k,{down:f,up:f,side:f,right:f,left:f});}));
