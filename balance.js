'use strict';
// Emberfall — balance pass (see tools/balance_sim.js). Loaded after every chapter file, it only re-tunes data so the
// numbers live in one place. Ch1 is left untouched (gentle start). From Ch3 on, bosses had ~100% simulated win rates at
// the natural level and fell in a few seconds; random fights cost only ~5% party HP, and late-game gold piled up unspent.
(function(){
 const scale=(k,o)=>{const e=EN[k];if(!e)return;for(const s in o)e[s]=Math.round(e[s]*o[s]);};
 // random enemies: a little tougher per chapter (HP / ATK / MAG), slightly more EXP so grinding stays light
 const CHE={3:['ashbat','aslime','ewisp','magma','csentry'],4:['sbat','rslime','fwisp','yeti','gsentry'],5:['mmoth','bogslime','lizard','drowned','shade'],
  6:['veilbat','gloomling','stalker','umbral','mwraith'],7:['crownbat','voidooze','hollowhound','shardling','throneguard','oathbound'],8:['heartwisp','hollowseraph','embermaw','crownknight','kingshade']};
 const EF={3:[1.12,1.05,1.05,1.10,1.0],4:[1.15,1.06,1.06,1.10,1.0],5:[1.18,1.07,1.07,1.10,0.95],6:[1.2,1.07,1.07,1.10,0.9],7:[1.2,1.06,1.06,1.08,0.85],8:[1.15,1.05,1.05,1.05,0.7]};
 for(const c in CHE)CHE[c].forEach(k=>{const[h,a,m,x,g]=EF[c];scale(k,{hp:h,atk:a,mag:m,xp:x,g});});
 // bosses: more HP (longer, tenser fights) and a touch more bite from Ch4 on
 scale('tyrant',{hp:1.5,atk:1.1,mag:1.1});scale('wyrm',{hp:1.6,atk:1.14,mag:1.14});scale('hydra',{hp:1.6,atk:1.14,mag:1.14});
 scale('warden',{hp:1.5,atk:1.12,mag:1.12});scale('varra',{hp:1.2});scale('seneschal',{hp:1.45,atk:1.12,mag:1.12});scale('vorthane',{hp:1.1});
 // polish pass: the two-phase finale simulated at ~78% (every other boss 85-90%); trim the second phase a little
 scale('vorthane2',{hp:0.9,atk:0.97});
 // ...and the Slag Tyrant was a 100% / 9-second fight at its natural level (a dip between Ch2 and Ch4)
 scale('tyrant',{hp:1.3,atk:1.1,mag:1.1});
 // late shops: gold was piling up unspent (≈7k at Ch7, ≈22k at Ch8)
 ['dawnbrand','eclipserod','lunarmace','gloammail'].forEach(k=>{if(EQ[k])EQ[k].p=Math.round(EQ[k].p*1.15/10)*10;});
 ['sunderblade','crownrod','seraphmace','throneplate'].forEach(k=>{if(EQ[k])EQ[k].p=Math.round(EQ[k].p*1.25/10)*10;});
 ['foundersedge','starkindle','keeperscrook','hearthmail'].forEach(k=>{if(EQ[k])EQ[k].p=Math.round(EQ[k].p*1.3/10)*10;});
 ['crownsalve','heartdraught','phoenixember'].forEach(k=>{if(ITEMS[k])ITEMS[k].p=Math.round(ITEMS[k].p*1.2/10)*10;});
 window.BALANCE={v:1};
})();
