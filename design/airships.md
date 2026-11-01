# Emberfall — Airship System (design draft)

## Getting the ship
After the Hollowdeep boss, the party follows the Ember Crown shard's pull to Galewright Point, a cliff-top harbor. There they meet Captain Orrin Vey, a grounded sky-sailor. Together they repair his wrecked skiff and christen it **the Cinderwing**. Its first sortie is a tutorial sky battle against a Hollow-corrupted sky ray.

## Flying the world map
- The Cinderwing flies freely over the overworld at two altitudes:
  - **Low:** you can land, and random encounters are on.
  - **High:** it's faster, but only reachable once you have the Updraft Sail.
- Storm walls and Hollow fog block regions until the right part is installed (Stormkeel, Lumen Lamp).
- Docks are your landing spots. Discoveries such as floating ruins and sunken wrecks pay out gold and parts.

## Ship stats
| Stat | Role |
|---|---|
| **Hull** | Ship HP. At 0 you retreat to the last dock. |
| **Armor** | Flat damage reduction. |
| **Speed** | Turn order within a round, and your escape chance. |
| **Cannons** | Up to 3 side-cannon slots, each with its own ammo type. |
| **Main Cannon** | Big gun that charges over turns (the Emberlance, later the Solar Lance). |
| **Spirit** | A shared crew pool spent on crew skills and on firing the main cannon. |

## Upgrades
- **Shipyard (Galewright Point):** upgrade the hull tier in 3 steps. Each step adds Hull, Armor and slots.
- **Parts:** buy cannons and gear at sky markets, or craft them from beast and wreck drops (Hollow Ichor, Gale Feathers, Cinder Iron). Example: an Ice Harpoon slows enemies.
- **Crew recruits:** found through side quests. Each one gives a passive bonus and unlocks a crew skill:
  - Bosun Tull: +Armor, unlocks Brace.
  - Pip the Lookout: shows telegraphs one turn earlier.
  - Gunner Saffa: +Cannon damage.
  - Navigator Ilse: +Speed, better escape chance.
  - Cook Marro: restores Spirit after each battle.

## Sky battles (turn-based)
- Each battle runs for up to about 6 rounds, laid out on a **command grid**. Rows are your 3 party members plus the ship; columns are turns 1–4 of the round.
- In the plan phase you fill the grid: Fire Cannon, Crew Skill, Item, Guard, or Charge the main cannon.
- Then the whole round plays out in Speed order.
- **Enemy telegraphs:** each turn's cell is tinted:
  - Red: heavy attack, so Guard against it.
  - Purple: a Hollow status effect.
  - Green: an opening, so attacks land as crits.
- Firing the **main cannon** needs 3 charges. It's devastating and best timed for green turns.
- Positioning is fore, side or aft. Shifting position changes which cannons can fire, and you can hit a weak point by matching its side.

**Enemies:**
- Hollow-corrupted sky beasts: Gloomray, Rotwing Roc, Hollow Leviathan.
- Rival pirates, the **Ashclaw Corsairs**, led by Captain Varra Kade. They sail ships that mirror yours, with boarding actions and their own crew skills.
