# Emberfall: the ground world plan (Step 1, design only)

Status: built in ground.js (not deployed). The mock-up is `design/ground_world_mock.png` (also `shots/262_ground_world_mock.png`).

## 1. The idea in one paragraph
Under the sky sits one big continent, **the Emberlands**. For the first half of the story (Chapters 1 to 4) the party
crosses it on foot. Later they also use the low-flying Cinderwing as a "boat" that sails along the coast and rivers.
Story progress opens the way bit by bit: a rockslide, a broken bridge, a pirate blockade, a lava flow, a frozen strait,
a guarded pass and a shard seal. At the midpoint (the end of Chapter 4, after the Rime Wyrm) Orrin fits the
Galeweave Sail and the Stormkeel. The Cinderwing climbs through the cloud ceiling, and the **sky world opens**
(Chapters 5 to 8 plus the late optional islands). From then on the airship can fly over the ground world and land on
any open grass, beach or field tile. You can come and go freely between the two layers.

## 2. Where things are today (what I read)
| Ch | File | Region now | Boss / flag | How you reach it now |
|---|---|---|---|---|
| 1 | game.js | Thornwick Village, Ashen Vale (the field map `world`), Hollowdeep Cavern | first shard | on foot |
| 2 | sky.js | Galewright Point harbor; the Cinderwing is built here; sky map, Gloomray, Gull's Rest Wreck, Skyreach Ruins, Ashclaw Hideout (Varra Kade) | ship parts, Varra | airship |
| 3 | ashmarch.js | Cinderholt, Ashmarch Wastes, the Ember Forge | `tyrant` (shard 2) | sky island |
| 4 | frost.js | Hollowfrost, Galeshear Tundra, Stormglass Spire | `wyrm` (shard 3) | sky island |
| 5 | mire.js | Reedhaven, Mirewood, Drowned Sanctum | `hydra` (shard 4) | sky island |
| 6 | veil.js | the Gloaming: Duskhollow, Ashen Gloam, Eclipse Bastion | `warden` | sky island (behind the Veil) |
| 7 | throne.js | the Sundered Reach: Lastlight Camp, Causeway, Hollow Citadel | `seneschal` (shard 6) | sky island |
| 8 | finale.js | Stair of Light, Founders' Hearth, Heart Spire | `heartwyrm` | sky |
| opt | expansion.js | Saltmere (`tyrant`), Valorgate (`wyrm`), Lanternhaven (`hydra`), Starfall Observatory (`seneschal`) | | sky islands |
| opt | sidequests.js | Eye of the Storm, Emberdeep Grotto (under Ashen Vale), Hollow Rift | | sky / ground |

Today the airship arrives early in Chapter 2, so almost everything after Chapter 1 is reached from the sky. The plan
pushes "real flight" back to the midpoint.

## 3. Ground map layout
A single field map, `ground`, about **96 x 80 tiles**. That is roughly 6 x 5 screens on a phone, or 2 to 3 minutes to
walk corner to corner at the new walking speed. It is built from the existing painted atlas chars (grass, forest,
mountain, sand, snow, ash, swamp, water), so collision, doors and NPC placement keep working the same way. Towns and
dungeons are door tiles on it; each one still opens its existing interior map unchanged.

```
 N   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ~~ ^^^^^^ RIMESPIRE ^^^^^^ ~~~~~[F] frozen strait~~~   (clouds: sky
     ~~ ^ (Hollowfrost) (Stormglass Spire) ^~~~~~~~~~~~~~~      world above)
     ~~ ^^^^ Galeshear Tundra ^^^^^^^^~~~~ .............~~~
     ~~~~~~~~~~~~~~~~~ |    ............. [G] guarded pass
     ~~ THORNWICK  ====[B]broken bridge..   VALORGATE (opt)~~
     ~~ (village)  river   .........        ............~~~
     ~~  ASHEN VALE  |  ......  [S] SHARD SEAL ruin  ...~~~~
     ~~ (Hollowdeep)=|=  ......   ........  ## VERDANCE ##~~
     ~~  forest      |  .....[R] rockslide  ## swamp,    ##~~
     ~~ ......... ~~~~   mountain pass      ## cliffs:   ##~~
     ~~ ^^^^^^^^^ ~~~~  ........            ## air only  ##~~
     ~~  GALEWRIGHT ~~  ..........  ASHMARCH ~~[L] lava  SALTMERE~~
     ~~  POINT (port,shipyard) ...  volcano, Cinderholt,  (opt) ~~
     ~~ ~~~~~~~~~~ [P] Ashclaw blockade ~~ Ember Forge ~~~~~~~~~~~~~~
 S   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ~ sea  ^ mountain/snow  . grass/plain  = bridge  # cliff  [x] barrier
```

## 4. What moves to the ground and what stays in the sky
**Moves to the ground (Chapters 1 to 4 plus nearby optional towns):**
- Thornwick Village, Ashen Vale and Hollowdeep Cavern (Ch1). Their maps stay as they are. "Ashen Vale" stays as the
  local field map around Thornwick, and its exit edges lead out onto `ground`.
- Galewright Point (Ch2). It becomes a coastal port and shipyard town.
- Gull's Rest Wreck. It becomes a beached wreck on the south coast.
- Ashclaw Hideout. It becomes a sea cave behind the pirate blockade.
- Cinderholt, the Ashmarch Wastes and the Ember Forge (Ch3): the volcano in the south-east.
- Hollowfrost, the Galeshear Tundra and the Stormglass Spire (Ch4): the snowy north.
- Saltmere (optional, `tyrant`) on the east coast, and Valorgate (optional, `wyrm`) behind the guarded pass.
- The Emberdeep Grotto stays under Ashen Vale.
- **Verdance / Reedhaven (Ch5)** sits on the ground, but inside a ring of cliffs. It is the first place you can only
  reach by landing the airship. That makes the new ship feel useful right away.

**Stays in the sky:**
- Skyreach Ruins.
- The Gloaming (Ch6, behind the Veil).
- The Sundered Reach (Ch7) and the finale (Ch8).
- The Eye of the Storm (sidequest).
- Lanternhaven (`hydra`) and the Starfall Observatory (`seneschal`).

The sky map loses the islands that moved down. Its free space can hold one or two new optional islands later. The
spare painted islands in `isles_c_src.jpg` (windmill, crystal, lighthouse, shrine, orchard) are ready for that.

## 5. Barriers, in chapter order
| # | Barrier (on the map) | Blocks | Opens when | In-game hint |
|---|---|---|---|---|
| R | Rockslide on the mountain pass east of Ashen Vale | the road to Galewright and the inland plains | the Hollowdeep boss falls (end of Ch1). The quake that frees shard 1 shakes it loose | Thornwick elder: "the quake last night... the east pass is clear?" |
| B | Broken bridge over the Thorn river | the north road to the Shard Seal ruin and beyond | Ch2: Orrin's shipwrights rebuild it after you first reach Galewright | sign: "Bridge out. Galewright crews coming." |
| P | Ashclaw pirate blockade in the south strait | Ashclaw Hideout and the sea route east to Ashmarch | Ch2: the low-flying Cinderwing (see section 6) is finished, and the blockade fight is won | Orrin: "Can't run the blockade on foot." |
| L | Lava flow across the Ashmarch road | the Ember Forge interior road | Ch3: the existing Ashmarch story steps (the forge quench) | already in Ch3 |
| F | Frozen strait to the north | Rimespire (Ch4) | `tyrant`: shard 2's heat lets Lyra melt a channel, and the Cinderwing sails through | Lyra: "This shard is warm... the ice might listen." |
| G | Guarded pass (gatehouse) | Valorgate (optional) | `wyrm` (same flag as today) | gate guard: "Valorgate opens to the one who felled the Rime Wyrm." |
| S | Shard seal on the central ruin | a shard-seal chest and lore room, plus a later post-game shortcut | each shard lights one rune; it opens at 3 shards (midpoint) | rune count shown on the seal |
| — | Saltmere squall (east coast road) | Saltmere (optional) | `tyrant` (same as today) | "Gulls wheel over the squall..." |
| ☁ | Cloud ceiling | the whole sky world | **the midpoint**: `wyrm` plus the Galeweave Sail and Stormkeel fitted | see section 6 |

Every barrier is a single tile type (`rockslide`, `broken bridge`, `gate`, `ice`, `seal`) that `blocked()` checks
against one flag. A barrier tile always shows its hint as a dialog when you bump into it ("Opens after..."). This
follows the same rule now used on the sky islands.

## 6. The airship and the midpoint
- **Ch2 (about 20% of the story):** the Cinderwing is still built at Galewright. With only the first shard in its
  engine it can't climb. It works like the classic FF ship: it sails coast and river water tiles on the ground map
  at low altitude and can't cross land. The existing Ch2 sky battles (the Gloomray, Ashclaw raiders, the grid turn
  system, crew and upgrades) all still happen. They just trigger over the water, using the sea backdrop. Almost no
  Ch2 rewriting is needed beyond a few lines: "she can't climb yet" replaces "let's take her up".
- **The midpoint, end of Ch4 (about 50%):** after the Rime Wyrm (`wyrm`, shard 3), Orrin fits the Galeweave Sail and
  the Stormkeel. Those parts already exist in sky.js (`S.parts.sail` and `S.parts.keel`); they become story items you
  are given here. A short cutscene follows: the Cinderwing climbs through the cloud ceiling, and the sky map opens on
  the Skyreach Ruins. A new flag, `G.flags.skyOpen`, is set.
- **After the midpoint:** a "Descend / Ascend" command (B on the ship) moves between `ground` and `sky`. Over the
  ground, the ship flies freely and lands on open land tiles. Verdance (Ch5) is the first place where you must land
  this way.

## 7. Tying it into the story with minimal rewriting
- Interior maps, NPCs, bosses, shops and every `XWIN` story beat stay as they are. Only the way you **get to** each
  area changes. Each chapter's current "board the ship and fly to island X" becomes "walk or sail to door X on
  `ground`".
- Sky POIs for the regions that moved get `ground:{x,y}` door coordinates. `skyInteract` and `enterMap('__ship')`
  return you to the ground map door instead of the sky map when the region is on the ground.
- About 10 to 15 dialog lines change, mostly Orrin's lines in Ch2 and the start of Ch3/Ch4 ("set a course" becomes
  "follow the coast road").
- One new short scene is added at the midpoint ("Through the Clouds").
- All existing flags (`tyrant`, `wyrm`, `hydra`, `seneschal`, `heartwyrm`, etc.) are reused to open barriers, so no
  new story flags are needed except `skyOpen`.
- The new code lives in a new file, `ground.js`, loaded after expansion.js and before world.js. It uses the same
  "wrap the global" pattern as the other chapter files, so earlier chapters' files barely change.

## 8. Migrating existing saves
- Saves get a `G.v` version number. On load, `migrateGround(G)` runs once when `G.v` is below 2.
- If the save already has a ship (`G.sky` exists), it is treated as grandfathered: `skyOpen` is set, so no
  player who could already fly loses the sky. Every ground barrier whose flag is already set opens.
- If the save is on the sky map at an island that moved down, the party is placed on the ship over that island's
  `ground` door. If the save is inside an interior map, it stays exactly where it is, because those maps don't change.
- Chapter 1 saves (no ship yet) simply continue on the new rules.
- The autosave slot and all three manual slots go through the same migration. A test loads one fixture save per
  chapter (Ch1 to Ch8 and post-game) and checks that the party is not stuck and that no flag was lost.

## 9. Build order (later steps, not done yet)
1. Paint and author the `ground` map (atlas chars only) and the door table. Make walking the ground work in Ch1.
2. Add the barrier tiles and their hints, with a test per barrier.
3. Add Ch2 low-flight Cinderwing sailing and move the Ch2 sea battles over water.
4. Move the Ch3 and Ch4 doors onto the ground and rewrite the dialog lines.
5. Add the midpoint scene, Ascend/Descend, and landing.
6. Add save migration and its fixture tests, then a full playthrough with tools/playthrough.js.
