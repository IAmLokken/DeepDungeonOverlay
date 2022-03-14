# Deep Dungeon Score Deep Dive

This document details how the overlay calculates its score estimate during a run.

**All credit for determining how the game calculates its score goes to Alpha and the overlay's algorithm is entirely based on his work.**

_Please review [Scoring explanation](https://github.com/IAmLokken/DeepDungeonOverlay#scoring-details) on the readme for assumptions and caveats the overlay makes when displaying its score._

# Score Components

We currently break down score in Deep Dungeon into 11 categories.  All categories are then combined additively to arrive at the final score.

* [Character Level and Aetherpool](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#character-level-and-aetherpool)
* [Floors Cleared](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#floors-cleared)
* [Maps Revealed](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#maps-revealed)
* [Chests Opened](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#chests-opened)
* [Rare Monsters Killed](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#rare-monsters-killed)
* [Mimics and Korrigans Killed](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#mimics-and-korrigans-killed)
* [Floor Enchantments](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#floor-enchantments)
* [Traps Triggered](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#traps-triggered)
* [Speed Run Bonuses](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#speed-run-bonuses)
* [Re-raisings Used](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#re-raisings-used)
* [Monsters Killed](https://github.com/IAmLokken/DeepDungeonOverlay/blob/main/overlay/docs/en/SCORE.md#monsters-killed)

A common multiplier used across all calculations is ``DutyClearFailed``.  For the purposes of the overlay this is always 101 since we assume no K.O. on the file.

# Character Level and Aetherpool

>Value for aetherpool and player level

+`((Aetherpool Arm + Aetherpool Armor) * 10) + (Player Level * 500)`

This is retroactive so the final score uses your current level and your current aetherpool levels.
  * _The overlay assumes max aetherpool arm and armor and does not account for finishing a run with less than 99/99._

# Floors Cleared

Floors Cleared is the largest contributor to score and thus the most complex calculation. 

First two important values are needed:

`` FloorsCleared = CurrentFloorNumber - FloorStartedOn ``

`` NumberOfBossesKilled = Math.Floor((CurrentFloorNumber - FloorStartedOn) / 10) ``

Due to how the overlay works, ``CurrentFloorNumber`` will always be 30, 100, or 200 and ``FloorStartedOn`` is expected to be 1, 21, or 51.

---

### Calculations for Both Deep Dungeons

>Value for floors completed adjusted by aetherpool.  This is normally reduced depending on aetherpool, but the overlay assumes 99/99.

+`` 430 * FloorsCleared ``

>Value for non-boss floors player arrives on

+`` (CurrentFloorNumber - (FloorStartedOn + NumberOfBossesKilled)) * 50 * 91 ``

>Value bonus for bosses.  Most are 300 but there are exceptions that are adjusted for further down

+`` NumberOfBossesKilled * DutyClearFailed * 300 ``

>We currently apply a 'bandaid' score reduction on floor 100 scorecards if the run starts at floor 1

+`` If FloorDifference == 100 -> -4500 ``

---

### Calculations for Heaven-on-High

>Bonus for reaching the last floor.  This is different from completion bonus as you keep this even if you duty fail on the last floor

+`` If CurrentFloorNumber == 100 -> DutyClearFailed * 50 ``

>Floor 30 boss is worth an additional 450.  Additionally the first boss of the run is worth 50 less

+`` DutyClearFailed * 400 ``

>We currently apply a 'bandaid' score reduction on floor 30 scorecards if the run starts at floor 1

+`` If FloorDifference == 30 -> -1000 ``

>320k bonus for duty complete

+`` If CurrentFLoorNumber == 100 -> DutyClearFailed * 3200 ``

---

### Calculations for the Palace of the Dead

>Bonus for reaching the last floor.  This is different from completion bonus as you keep this even if you duty fail on the last floor

+`` If CurrentFloorNumber == 200 -> DutyClearFailed * 50 ``

>First boss of the run is worth 50 less.

-`` DutyClearFailed * 50 ``

>Floor 50 and 100 bosses are worth an additional 450.

+`` If FloorStartedOn == 1 -> DutyClearFailed * 450``

+`` DutyClearFailed * 450``

>We currently apply a 'bandaid' score reduction on runs that start at floor 51

+`` If FloorStartedOn == 51 -> -2000``

>Similar to the floor 100 bandaid above we remove 500 per boss floor

+``If FloorDifference + 1 == 200 -> -9500``

+``If FloorDifference + 1 == 150 -> -7000``

>320k bonus for duty complete

+`` If CurrentFLoorNumber == 200 -> DutyClearFailed * 3200 ``

# Maps Revealed

Fully revealed floor maps give bonus points.  Since the overlay currently cannot tell if a map is fully revealed the option to assume all map reveals is assumed here.

> Value for all maps revealed (excluding boss and duty complete floors)

+`` DutyClearFailed * FullyRevealedFloors * 25``

# Chests Opened

Opened chests give points.  Exceptions are:
* Chests that turn into mimics.
* Chests that explode.
* Intuition chests.

> Value for all chests opened

+`` DutyClearFailed * NumberOfChestsOpened``

# Rare Monsters Killed

the Palace of the Dead contains rare spawn monsters.  These are worth additional points.

> Value for rare monster kills

+`` DutyClearFailed * NumberOfRareMonstersKilled * 20``

# Mimics and Korrigans Killed

Mimics and korrigans are worth additional points.

> Value for mimic and korrigan kills

+``DutyClearFailed * NumberofMimicsAndKorrigans * 5``

# Floor Enchantments

Floor Enchantments, both detrimental and beneficial, are worth points.  These points are removed if a Pomander of Serenity is used.

> Value for floor enchantments

+``DutyClearFailed * NumberOfFloorEnchantments * 5``

# Traps Triggered

Stepping on traps reduces score.  Exceptions are:
* Chests that explode.

> Value for traps triggered

-``DutyClearFailed * NumberOfTrapsTriggered * 2``

# Speed Run Bonuses

Finishing a floor set before receiving the '30 minute' warning awards bonus points.

>Value for speed run sets

+``DutyClearFailed * NumberOfSpeedRunSets * 150``

# Re-raisings Used

Dying and being resurrected by a Pomander of Raising reduces score.

> Value for re-raisings

-``DutyClearFailed * NumberOfResurrections * 50``

# Monsters Killed

Every monster killed including bosses, mimics/korrigans, and rares is worth a base value of 100 plus 1 for every two floors cleared. 

For floors 31-100 in Heaven-on-High and 101-200 in the Palace of the Dead, monster kils are worth an additional 101 points.  Exceptions are:
* Mimics & Korrigans
* Rare Monsters
* Bosses

> Value for all monsters killed

+``100 + (Math.floor((CurrentFloorNumber - FloorStartedOn + 1) / 2))) * NumberOfKills``

> Value for bonus floors excluding exceptions listed above

+``201 + (Math.floor((CurrentFloorNumber - FloorStartedOn + 1) / 2))) * (NumberOfKills - NumberOfNonBonusKills)``

---

[DeepDungeonOverlay](https://github.com/IAmLokken/DeepDungeonOverlay)





