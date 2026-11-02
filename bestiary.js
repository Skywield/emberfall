// Painted bestiary: every battle / sky enemy that used to be clean pixel art or a palette recolor now has its own
// hand-painted, green-screen-keyed sprite (art/painted/sheetNN_src.jpg -> art/key_bestiary.py -> art/game/*.png).
// The old EN_ART pixel sprites / tinted SKYART stay only as a load-time fallback.
const BESTIARY={slime:'mire_slime',bat:'dusk_bat',goblin:'thorn_imp',wisp:'grave_wisp',
 ashbat:'ash_bat',aslime:'slag_slime',ewisp:'ember_wisp',sbat:'storm_bat',rslime:'rime_slime',fwisp:'frost_wisp',yeti:'tundra_yeti',gsentry:'glacier_sentry',
 mmoth:'mire_moth',bogslime:'bog_slime',lizard:'fen_lizardman',drowned:'drowned_knight',shade:'hollow_shade',veilbat:'veil_bat',gloomling:'gloomling',stalker:'dusk_stalker',
 umbral:'umbral_knight',mwraith:'mirror_wraith',varra:'varra_kade',crownbat:'crown_bat',voidooze:'void_ooze',hollowhound:'hollow_hound',shardling:'shardling',throneguard:'throne_guard',
 oathbound:'oathbound_keeper',heartwisp:'heartfire_wisp',crownknight:'crown_knight',hollowseraph:'hollow_seraph',embermaw:'ember_maw',kingshade:'kings_shade',
 reefcrab:'reef_crab',tidewisp:'tide_wisp',brineslime:'brine_slime',cogbat:'cog_bat',gearknight:'gear_knight',sparkling:'sparkling',
 lampghost:'lamp_ghost',boneknight:'ossuary_knight',gravemoth:'grave_moth',starmoth:'star_moth',voidling:'voidling',astral:'astral_eye'};
for(const k in BESTIARY)loadPaint(k,BESTIARY[k]);
// sky battles: each airship / drake gets its own painting instead of sharing the tinted Cinderwing / wyvern / seraph
const SKYPAINT={skiff:'sky_skiff',corsair:'sky_corsair',stormbreaker:'sky_stormbreaker',tempest:'sky_tempest',nightfall:'sky_nightfall',crownwing:'sky_crownwing',heartwyrm:'sky_heartwyrm'};
for(const k in SKYPAINT){const a='p_'+k,im=new Image();im.onload=()=>{SKYART[a]=im;if(SKYEN[k])SKYEN[k].art=a;};im.src='art/game/'+SKYPAINT[k]+'.png';}
