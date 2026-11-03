// Story pass (Grok review priorities 1 + 4).
//  * Distinct voices: Kael (terse, duty, quietly paying for the shard), Lyra (scholar - wants to STUDY the Crown),
//    Mira (healer - wants to HEAL with it), Varra (mercenary - wants to SELL it / buy freedom). Key lines are rewritten
//    through one table and party-banter scenes are spliced in where they disagree.
//  * The Hollow freezes memories and bonds, not just warmth: "frozen" townsfolk (frost-tinted) who have forgotten a
//    sister, a song, a friend, colour itself - and thaw when that chapter's shard is won.
//  * Seventh-shard foreshadowing in Chapters 1-5: Kael's chills, inn dreams, ember flickers on his field sprite.
//  * Concrete ending differences in Thornwick and the towns after the credits (keeper vs free).
const VOICE={
 "Lyra: One shard... six more to go.":"Lyra: One shard. It hums — a frequency I've never measured. I need a month with this. A YEAR.",
 "Mira: Then we'd better head back and tell Elder Bran.":"Mira: A year? Thornwick's well froze in midsummer, Lyra. If this warmth can mend it, it goes home first.",
 "Kael: Then we'll be the first. Let's follow it.":"Kael: Then we're the first. Bran asked. We go.",
 "Kael: Then we'll put it out.":"Kael: Then we put it out. Someone has to.",
 "Mira: Two of seven. Forgemaster Hale should hear about this.":"Mira: Two of seven. Hale's smiths have burns that won't close. I want to try the shards on them tonight.",
 "Mira: Fire. Good thing Kael never shuts up about his.":"Mira: Fire. And Kael's been running hot as a forge since the cave — haven't you noticed?",
 "Lyra: The third shard! It's cold... no, it's warming in my hands.":"Lyra: The third shard — look, it warms on contact. Heat flows from the holder. From ME. That's... a hypothesis I don't like.",
 "Kael: Warden Isolde will want to know.":"Kael: Isolde gets her report. That's what we promised.",
 "Kael: So the Hollow has a king. Good. Kings can be found.":"Kael: So the Hollow has a king. Good. Kings can be found. And answered.",
 "Kael: Then we'll make him regret it. Elder Sefa needs to hear this.":"Kael: Then he'll regret it. Sefa first. Duty first.",
 "Mira: You sold yourself to the Hollow?!":"Mira: You sold yourself to the Hollow?! Do you know what it does to people? I've held their hands while they forgot me.",
 "Mira: You sold the whole world, Varra.":"Mira: You sold the whole world, Varra. I nursed what you sold.",
 "Mira: The fifth shard. It's... beating.":"Mira: The fifth shard. It's beating — like a patient's pulse under my fingers.",
 "Kael: In me. That's why he calls me his heir.":"Kael: In me. That's the cold I've felt since Hollowdeep. The dreams. That's why he calls me his heir.",
 "Lyra: Kael, it's your choice. The founders never could make it.":"Lyra: Kael... it's your choice. The founders never could make it."};
const BANTER={
 "Mira: A year? Thornwick's well froze in midsummer, Lyra. If this warmth can mend it, it goes home first.":[
  "Lyra: And if it's not warmth? If it's a lure? You don't test an unknown on the people you love.",
  "Kael: It goes where Bran says. That's the job.","(For a breath, Kael's hand goes numb around his sword. He says nothing.)"],
 "Mira: Two of seven. Hale's smiths have burns that won't close. I want to try the shards on them tonight.":[
  "Lyra: Mira, we don't know what they DO. Give me one night with the pair — notes, measurements, anything.",
  "Mira: You'd keep a cure in a satchel for footnotes?","Lyra: I'd keep my friends from becoming footnotes!",
  "Kael: Enough. We carry them. We don't use them. Not until we know the cost.","Mira: ...And who decides the cost, Kael? You?","Kael: Somebody has to pay it. Better me."],
 "Kael: Isolde gets her report. That's what we promised.":["(Frost has rimed Kael's knuckles, though he never touched the shard.)","Mira: Kael, your hands — let me see.","Kael: It's the north. That's all."],
 "Kael: Then he'll regret it. Sefa first. Duty first.":[
  "Lyra: If he WANTED us to win, every shard we take helps him. We should stop and study the pattern before we take another.",
  "Mira: Stop? Reedhaven's children can't remember their mothers' faces. I'm not stopping for a pattern.",
  "Lyra: And if the cure is what freezes them next?","Kael: ...We keep going. And if it costs something, it costs me."],
 "Kael: Then we stop carrying them for him. We find a way to unmake that heart for good.":[
  "Lyra: Unmake it? Kael, it's the oldest working enchantment in the world. If we understood it we could learn how warmth itself is MADE.",
  "Mira: Or we use it. Five shards could thaw every frozen village from here to Hollowfrost. Tonight.",
  "Kael: And feed him while we do it. No. Duty first.","Lyra: Duty to WHOM? Bran? The founders? A thousand-year-old mistake?",
  "Kael: To whoever freezes next if we're wrong.","(Kael shivers. Seren watches him, and does not say what she sees.)"],
 "Varra Kade: I know the Bastion's back door. I know where the Warden sleeps. Take it or leave it.":[
  "Varra Kade: And when it's done? That Crown's worth a fleet. Freedom for every crew he ever chained. Think on it.",
  "Lyra: It's not a treasure, it's a primary source!","Mira: It's not a prize, Varra. It's medicine.",
  "Kael: It's a heart. Nobody's selling it.","Varra Kade: Everyone sells something, Thornwick. You're selling yourself to it, inch by inch. I can see the frost on you."],
 "Lyra: Kael... it's your choice. The founders never could make it.":[
  "Lyra: Whole, I could study a living Crown for the rest of my life. ...That's my want, not yours. I know that now.",
  "Mira: Whole, it could heal every hearth the Hollow froze. Broken, every hearth gets a spark of its own. Either way — people first.",
  ()=>G.flags.varraT?"Varra Kade (on the comm-horn): Smash it and nobody owns it, Thornwick. That's the only freedom I trust.":"Mira: ...I wish Varra were here. She'd tell you to break it and laugh.",
  "Kael: Duty says keep it. The cold in my chest says someone pays for it. Forever."]};
// seventh-shard foreshadowing: inn dreams by shards held (Chapters 1-5 only, each shown once)
const DREAMS=["(Kael dreams of a cold throne. Someone on it is shivering, and says his name like a father would.)",
 "(Kael dreams of a forge with no fire. A voice: \"You carry the seventh, heir. You always have.\" He wakes with frost on his lashes.)",
 "(Kael dreams of seven embers in a ring. Six are in Lyra's satchel. The seventh is behind his own ribs, flickering.)",
 "(Kael dreams he is a lantern and the dark is leaning close to warm its hands. He wakes before it touches him.)",
 "(Kael dreams of Thornwick's founders holding a broken heart between them. One of them has his face.)"];
const shardsN=()=>['boss','tyrant','wyrm','hydra','warden','seneschal'].filter(k=>G.flags[k]).length;
const early=()=>!G.flags.warden;
const _dialog=dialog;
dialog=function(lines,cb){const out=[];for(const l0 of lines){const l=VOICE[l0]||l0;out.push(l);const b=BANTER[l];if(b)b.forEach(x=>out.push(typeof x==='function'?x():x));
  if(/HP\/MP restored|feels refreshed/.test(l)&&early()&&G&&G.flags){const n=Math.min(DREAMS.length-1,shardsN());if(!G.flags['dream'+n]){G.flags['dream'+n]=1;out.push(DREAMS[n]);}}}
 return _dialog(out,cb);};
window.dialog=dialog;
// --- the Hollow freezes memories and bonds: frozen townsfolk ---
const FROZEN={
 town:[{s:'bess',near:[13,13],thaw:'boss',n:'Mother Hesta',f:['Mother Hesta: There\'s a boy who keeps calling me "Mum". Tam, he says. I... I\'m sure he\'s lovely.','(Frost clings to her shawl. Her eyes slide off the child like he isn\'t there.)'],
  t:['Mother Hesta: TAM! Oh, Tam, how could I — come here. Come HERE.','Mother Hesta: It was like a window frosted over. I could see him and not feel him. Thank you.']}],
 cinderholt:[{s:'hale',near:[6,9],thaw:'tyrant',n:'Smith Garr',f:['Smith Garr: That man by the bellows says we fought side by side for twenty years. I believe him. I just can\'t feel it.','Mira: The Hollow doesn\'t only take warmth. It takes the threads between people.'],
  t:['Smith Garr: Brenn! You old goat — you pulled me out of the lava-field in the year of the falling ash!','Smith Garr: I remember all of it. Every year of it.']}],
 hollowfrost:[{s:'yrsa',near:[9,9],thaw:'wyrm',n:'Ylva',f:['Ylva: The woman at the well says she\'s my sister. Ingrid. I can see we have the same chin.','Ylva: ...I can\'t remember a single thing we ever did together. It\'s just cold where she should be.'],
  t:['Ylva: Ingrid! The sledding hill, the burnt honey-cakes — I remember YOU.','Lyra: The memories came back when the shard did. So it IS the Hollow, not time. I need to write this down.']}],
 reedhaven:[{s:'odo',near:[8,10],thaw:'hydra',n:'Old Pell',f:['Old Pell: I used to sing my girl to sleep every night. Thirty years. The tune\'s gone.','Old Pell: Not forgotten — FROZEN. Like a fish under the ice. I can see it moving and I can\'t reach it.'],
  t:['Old Pell: (humming, crying, laughing) Down by the reeds, my little heron... There it is. There it IS.','Mira: That\'s what I want the Crown for. Just that, a thousand times over.']}],
 duskhollow:[{s:'posy',near:[8,8],thaw:'warden',n:'Painter Ines',f:['Painter Ines: I\'ve stared at this canvas for a year. I can\'t remember what colours are FOR.','Painter Ines: The Hollow doesn\'t just steal warmth, you know. It steals the reason to make anything.'],
  t:['Painter Ines: Gold! Gold is for mornings! I have to — move, I have to paint before it goes!','Lyra: Creativity thawed with the shard too. Kael, are you listening? This matters.','Kael: I\'m listening. I\'m just cold.']}]};
function tintFrost(c){const d=document.createElement('canvas');d.width=c.width;d.height=c.height;const g=d.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(170,215,255,0.5)';g.fillRect(0,0,d.width,d.height);
 g.fillStyle='rgba(255,255,255,0.85)';for(let i=0;i<14;i++)g.fillRect((i*29)%d.width,(i*17)%d.height,2,2);return d;}
function frozenSet(base){const s=SPR[base];if(!s)return null;const o={};for(const k of ['down','up','side','right','left'])o[k]=s[k].map(tintFrost);o._from=s.down[0];return o;}
function freeNear(m,x0,y0,taken){const M=MAPS[m],dr=M.doors||{},wp=(M.warps||[]).map(w=>w.x+','+w.y);
 const okT=(x,y)=>{const t=tileAt(m,x,y);if(SOLID.has(t)||t==='D')return false;if(dr[x+','+y]||dr[x+','+(y-1)]||wp.includes(x+','+y))return false;if(taken.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2))return false;return true;};
 for(let r=0;r<8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=x0+dx,y=y0+dy;if(okT(x,y))return [x,y];}return [x0,y0];}
for(const m in FROZEN){const d=Object.getOwnPropertyDescriptor(NPCS,m)||{value:[]};const base=()=>d.get?d.get():(d.value||[]);let placed=null;
 Object.defineProperty(NPCS,m,{enumerable:true,configurable:true,get(){const B0=base();if(!placed&&MAPS[m]){placed=FROZEN[m].map(f=>{const[x,y]=freeNear(m,f.near[0],f.near[1],B0);
   return {x,y,d:'down',frz:f,get s(){return G&&G.flags[f.thaw]?f.s:'frz_'+f.s;},lines:()=>G.flags[f.thaw]?f.t:f.f};});}return [...B0,...(placed||[])];}});
 FROZEN[m].forEach(f=>{SPR['frz_'+f.s]=SPR[f.s];});}
setInterval(()=>{for(const m in FROZEN)FROZEN[m].forEach(f=>{const k='frz_'+f.s,cur=SPR[k],src=SPR[f.s];if(src&&(!cur||!cur._from||cur._from!==src.down[0]))SPR[k]=frozenSet(f.s);});},600);
// --- Kael's ember flickers + chills on the field (Chapters 1-5), non-blocking ---
let TOAST=null,nextFl=6;const CHILLS=['Kael shivers. It isn\'t the weather.','A spark flickers in Kael\'s chest, then gutters.','Kael\'s breath frosts — just his.','For a heartbeat, Kael glows like a coal.'];
const _fspr=fspr;fspr=function(c,x,y){_fspr(c,x,y);if(scene!=='map'||!G||!early()||!SPR.kael)return;const s=SPR.kael;if(![s.down,s.up,s.right,s.left].some(a=>a&&a.includes(c)))return;
 const ph=(T%nextFl);if(ph<0.6){const a=Math.sin(ph/0.6*Math.PI);X.globalAlpha=a*0.8;X.fillStyle=ph<0.3?'#ffb040':'#a0e0ff';X.beginPath();X.arc(x+6,y+4,3+a*2,0,7);X.fill();
  for(let i=0;i<4;i++){X.fillRect(x+4+Math.sin(T*9+i)*5,y+6-i*3-ph*10,1,1);}X.globalAlpha=1;
  if(!TOAST||TOAST.t<=0){TOAST={s:CHILLS[Math.floor(T/nextFl)%CHILLS.length],t:2.4};}}};
const _dfS=drawField;drawField=function(){_dfS();if(TOAST&&TOAST.t>0&&!UI.length){TOAST.t-=1/60;X.globalAlpha=Math.min(1,TOAST.t);drawToastBar(TOAST);X.globalAlpha=1;}
 if(G&&G.flags.clear&&G.map==='town')drawEndingTown();};
// walking-flavour toast: rendered once into a device-resolution canvas, then blitted in screen space at whole device
// pixels with the transform reset, so it can't shimmer while the camera pans (no sub-pixel text / shadow offsets).
function drawToastBar(t){if(!t.c||t.cs!==t.s){const c=document.createElement('canvas');c.width=W*SC;c.height=12*SC;const g=c.getContext('2d');g.fillStyle='#000a';g.fillRect(0,0,c.width,c.height);
  g.font=`bold ${6*SC}px "Courier New",monospace`;g.textAlign='center';g.textBaseline='top';const x=Math.round(c.width/2);g.fillStyle='#000';g.fillText(t.s,x+2,2*SC+2);g.fillStyle='#bfe6ff';g.fillText(t.s,x,2*SC);t.c=c;t.cs=t.s;}
 X.save();X.setTransform(1,0,0,1,0,0);X.imageSmoothingEnabled=false;X.drawImage(t.c,0,Math.round((H-26)*SC));X.restore();}
// --- endings: concrete differences in the towns after the credits ---
function drawEndingTown(){const cx=Math.max(0,Math.min(G.x*16+8-W/2,MAPS.town.w*16-W)),cy=Math.max(0,Math.min(G.y*16+8-H/2,MAPS.town.h*16-H));const keep=G.flags.ending==='keeper';
 if(keep){for(let i=0;i<10;i++){const x=10*16-cx+((i*7)%32),y=6*16-cy+28-((T*20+i*9)%30);X.globalAlpha=0.6;X.fillStyle=i%2?'#ffb040':'#ff6020';X.fillRect(x,y,2,3);}X.globalAlpha=1;}
 else{[[3,4],[16,4],[10,11],[6,9],[14,9]].forEach(([tx,ty],i)=>{const x=tx*16-cx+8,y=ty*16-cy-4+Math.sin(T*2+i)*1.5;X.globalAlpha=0.7+0.3*Math.sin(T*3+i);X.fillStyle='#ffe080';X.beginPath();X.arc(x,y,2.5,0,7);X.fill();X.globalAlpha=0.25;X.beginPath();X.arc(x,y,7,0,7);X.fill();X.globalAlpha=1;});}}
const END_LINES={keeper:{
  elder:['Elder Bran: The fountain\'s burned with the Crown\'s fire since you came home, Kael. Nobody\'s been cold a single night.','Elder Bran: Pilgrims line up at your door. I tell them you\'re mending fences. It\'s even true.'],
  kid:['Tam: Kael lets me warm my hands on him! He\'s like a stove that talks!'],
  guard:['Guard Hollis: Folk from every town walk in to see the Ember Keeper. I\'ve never had so much road to watch.'],
  merch:['Tessa: Ember-glass from the fountain sells for a fortune. I only take a little. Kael said a little.'],
  inn:['Marla: Full every night. They all want to sleep near the Crown\'s warmth. Who am I to argue?']},
 free:{
  elder:['Elder Bran: Every hearth in Thornwick lit itself the night the sparks fell. No crown. No king. Just us, keeping each other warm.','Elder Bran: We hold a lantern-walk each midwinter now. Lyra\'s students light the first one.'],
  kid:['Tam: A star landed in our chimney! Mum says it\'s ours to look after now.'],
  guard:['Guard Hollis: Quiet roads. The Hollow\'s gone and nobody\'s worshipping anybody. I like it.'],
  merch:['Tessa: Lanterns, lanterns, lanterns. Everyone wants one for their spark. Best year I\'ve ever had.'],
  inn:['Marla: The inn\'s hearth caught a spark too. It never needs wood. I still chop it out of habit.']}};
const TOWN_END={hollowfrost:{keeper:'The Ember Keeper\'s warmth reached even here. The Spire\'s ice is melting into a lake.',free:'A spark fell on the Spire. Ylva and Ingrid keep it together, in turns.'},
 reedhaven:{keeper:'The Crown made the mire bloom. Old Pell sings to the flowers.',free:'Every stilt-house has its own little star now. Old Pell taught them all his song.'},
 duskhollow:{keeper:'Painter Ines paints Kael\'s fire over and over. It never comes out the same.',free:'Painter Ines paints the falling sparks. She says no two were ever the same colour.'}};
const _ent=enterMap;enterMap=function(name,x,y,d){_ent(name,x,y,d);if(!G.flags.clear)return;const e=G.flags.ending==='keeper'?'keeper':'free';
 if(name==='town')F.npcs.forEach(n=>{const L=END_LINES[e][n.s];if(L){if(n.act){const a=n.act;n.act=()=>dialog(L,a);}else n.lines=()=>L;}});
 if(TOWN_END[name])F.npcs.forEach(n=>{if(n.frz){const t=TOWN_END[name][e];n.lines=()=>['('+t+')'];}});
 F.banner=2.5;};
window.enterMap=enterMap;if(window.DBG){DBG.enterMap=enterMap;}
window.STORY={VOICE,BANTER,DREAMS,FROZEN,END_LINES,TOWN_END};
