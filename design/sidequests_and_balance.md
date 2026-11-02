# Balance pass + side content

## Balance (tools/balance_sim.js, numbers live in balance.js)
`python3 -m http.server 8765` then `node tools/extract.js && node tools/balance_sim.js [--super]`.
The sim walks each chapter "naturally" (about 3×(w+h) steps per field/dungeon map, plus the chapter's sky fights), buys the
best affordable shop gear, then runs 300 Monte-Carlo ATB boss fights with the game's own damage formulas.

| Ch | natural Lv | boss | boss HP before → after | sim win rate before → after |
|---|---|---|---|---|
| 1 | 6 | Gravemaw | 1100 → 1100 (untouched) | ~98% → ~98% |
| 3 | 13 | Slag Tyrant | 2600 → 3900 (+10% atk/mag) | 100% → 100% (still gentle) |
| 4 | 16 | Rime Wyrm | 4200 → 6720 (+14% atk/mag) | ~100% → ~93% |
| 5 | 21 | Mire Hydra | 6400 → 10240 (+14%) | ~100% → ~93% |
| 6 | 25 | Eclipse Warden | 8800 → 13200 (+12%) | ~100% → ~89% |
| 7 | 30 | Hollow Seneschal | 12500 → 18125 (+12%) | ~99% → ~89% |
| 8 | 38 | Vorthane (2 phases) | 16000+22000 → 17600+22000 | ~76% → ~78% |

Boss fights now last about 1.5–2× as long (sim: Ch4–7 went from 8–10 s to 15–16 s of ATB time).
Random enemies Ch3–8: +12–20% HP, +5–7% ATK/MAG, +5–10% EXP; gold drops ×0.95 (Ch5) down to ×0.7 (Ch8).
Late shops: Ch6 gear +15%, Ch7 gear +25%, Ch8 gear +30%; Crown Salve / Heart Draught / Phoenix Ember +20% (gold was piling up unspent).
Ch1 and Ch2 are not changed at all.

## Side quests (sidequests.js; MENU > Quests)
1. Bats by the River (Thornwick, Farmer Odo) - hunt 6 Dusk Bats - Batwing Charm + 150 G
2. Feathers for the Nets (Galewright Point, Netmaker Bess) - fetch 4 Gale Feathers - Galeweave Vest + 2 Hi-Potions
3. Mira: The Ashen Shrine (Cinderholt, Sister Cael) - lay 6 Ember Wisps to rest - Cinder Censer
4. Lyra: Master Orrel's Journal (Hollowfrost, Archivist Fen) - find the journal in the Glacier Spire - Orrel's Codex
5. Mirewood Cull (Reedhaven, Frogcatcher Dill) - hunt 6 Mire Lizards - Reedwoven Cloak + 3 Mire Draughts
6. Varra: Colours of the Tempest (Duskhollow, Quartermaster Bly; only if Varra was trusted) - recover her flag from the Eclipse Bastion - Red Gale Cutlass
7. Kael: The Last Lamp (Lastlight Camp, Lamp-keeper Senna) - break 5 Throne Guards - Thornwick Heirloom
8. The Buried Sun (Cinderholt, Old Miner Gorrim; after Ch5) - hidden vent in Ashen Vale -> Emberdeep Grotto -> superboss Buried Sun Cindral - Rod of the Buried Sun + Buried Sun Mail
9. Eye of the Storm (Galewright Point, Old Captain Rook; after Ch6) - sky superboss Tempest Sovereign - Stormcrown Crook + ship iron
10. The Seventh Shade (Founders' Hearth, Archivist Sable; post-game, needs the Clear save) - the Hollow Rift -> superboss The Seventh Shade (Omen) - Dawn of Thornwick + Seventh Veil

Superboss art: art/painted/*_src.jpg (green screen) keyed by art/key_sq.py (same method as key_ch8.py).
Superboss sim: Cindral ~38% at Lv34 / ~73% at Lv40 / ~97% at Lv46; Omen ~4% at Lv45 / ~46% at Lv52 / ~86% at Lv60.
