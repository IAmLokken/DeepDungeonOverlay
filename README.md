# Introduction <code>&#124;</code> [紹介](overlay/docs/ja/README.md) <code>&#124;</code> [Einleitung](overlay/docs/de/README.md)

Deep Dungeon Overlay (DDO) and DDO Target Info (DDOTI) are in-development OverlayPlugin skins intended to give you real-time information during solo excursions into FFXIV Deep Dungeons.

|![DDOTI alt <](overlay/docs/en/DDOTI.png?raw=true) | ![DDOTI alt ><](overlay/docs/en/DDOTI_Dark.png?raw=true) |
| :-: | :-: |
|![DDO](overlay/docs/en/DetailsFull01.png?raw=true) | ![DDO](overlay/docs/en/DetailsFull01_Dark.png?raw=true) |

# Requirements to use DDO / DDOTI

DDO requires the Advanced Combat Tracker ([ACT](https://advancedcombattracker.com/)) software.  Additionally it requires the [FFXIV_ACT_Plugin](https://github.com/ravahn/FFXIV_ACT_Plugin) as well as the [OverlayPlugin](https://github.com/ngld/OverlayPlugin) library to be installed in ACT.

Instructions for installing ACT as well as FFXIV_ACT_Plugin can be found in written form here: [Install ACT](https://github.com/FFXIV-ACT/setup-guide)

Additionally Desperius FFXIV has a good video tutorial (current as of April 2021) here: [Video Guide](https://www.youtube.com/watch?v=urZTrF864x8&t=0s)

# Localization

Currently DDO supports English, French, Japanese, and German languages.  _This excludes most enemy notes. (English and Japanese only)_ 
* French translation and support provided by [Coccis77](https://twitter.com/Coccis77). 
* Japanese translation and support provided by [Chiela](https://twitter.com/HurricaneChiela). They also [stream](https://www.twitch.tv/hurricanechiela)!
* German translation and support provided by [Tancred](https://twitter.com/Tancred423). 



 _Please note:_ To use a supported locale both the game client *and* the FFXIV plugin setting *Game Language* must be set to the appropriate locale.

# Installation of DDO / DDOTI

Please see [Installation Instructions](overlay/docs/en/INSTALL.md). <code>&#124;</code> [Instructions d'installation](overlay/docs/fr/INSTALL_FR.md) 

# Setup For Streamers

Please see Setup For Streamers [Instructions](overlay/docs/en/STREAMER.md).

# Current Features

* Score (Estimate)
	* The overlay will give you a real-time estimate on your current score.  Please see the [Score Details](https://github.com/IAmLokken/DeepDungeonOverlay#scoring-details) section for more information.
	* Scoring algorithm is built from Alpha's scoring testing: [Scoring explanation](https://docs.google.com/document/d/1MnR2Xtj2lol1LESgscI6yi_1xcAeP3FBwJecbD-EiwE/edit)

* Monster Respawn Timer

* Pomanders:
	* Safety (Enabled if one was used this floor)
	* Sight (Enabled if one was used this floor)
	* Affluence (Enabled if one was used last floor and currently active)
	* Alteration (Enabled if one was used last floor and currently active)
	* Flight (Enabled if one was used last floor and currently active)

* Satistics:
	* Monster kills
	* Mimic (Korrigan) kills
	* Traps triggered 
	* Chests opened
	* Floor enchantments applied (using a Serenity will decrement this count)
	* Rare monsters (PotD only)
	* Total floor sets completed in 30 minutes or less
	
* Bestiary Information:
    * Enemy Name
	* Enemy Current Health Percentage
	* Enemy Danger Levels:
		Easy | Caution | Scary | Impossible
		:-: | :-: | :-: | :-: 
		<img src="overlay/img/Easy.png" alt="drawing" width="40"/> | <img src="overlay/img/Caution.png" alt="drawing" width="40"/> | <img src="overlay/img/Scary.png" alt="drawing" width="40"/> | <img src="overlay/img/Impossible.png" alt="drawing" width="40"/>
	* Enemy Aggro Types:	
		Sight | Sound | Proximity
		:-: | :-: | :-:
		![Sight](overlay/img/Sight.png) | ![Sound](overlay/img/Sound.png) | ![Proximity](overlay/img/Proximity.png)
	* Enemy Info (Things to know about the enemy, if relevant.)
	* __All bestiary information is pulled from Maygi's DD Handbooks with permission__.
	 	* Follow Maygi on [Twitch](https://www.twitch.tv/maygii), [Twitter](https://twitter.com/MaybeMaygi), and [Youtube](https://www.youtube.com/c/Maygi).
		* [PotD Handbook](https://docs.google.com/document/d/e/2PACX-1vQpzFuhmSwTXuZSmtnKLNgQ0nRhumCFaB8NvCXFXSjrBHPRT5lXY8jMR4RaCK1aNfcl_G5ph5DNNwfl/pub)
		* [HoH Handbook](https://docs.google.com/document/d/1YVBSTOgJO-xOAB6YyKZEZRikjXFPle6Ihf_E7VdmQnI/edit)
		* Additional mob aggro types tested with the help of Cloudburst's status spreadsheets [PotD](https://docs.google.com/spreadsheets/d/1nKI0-AApj-aiuUimrPkuQUJaa4DU8Ox7KqdC_ibme8E/edit#gid=12879293), [HoH](https://docs.google.com/spreadsheets/d/1aDlsiN3At6Fvfj_gg5weucDYqjQawQxGHFhJvzEUrek/edit#gid=375717345)
	* **NOTE**: Bestiary information is the only section availble during group runs.
	* **NOTE**: If any bestiary information is incorrect (or missing) please [open an issue](https://github.com/IAmLokken/DeepDungeonOverlay/issues).

The Score, Pomander, Statistics, and Bestiary sections of the overlay can be hidden/shown via the checkboxes in the title bar of the overlay. Examples:

![DDOS01](overlay/docs/en/DetailsSimple01.png?raw=true) ![DDOS02](overlay/docs/en/DetailsSimple02.png?raw=true)

# Save Files

DDO saves relevant information about the current run to the OverlayPlugin config file.

There are some caveats to be aware of when doing runs you want to track and having them saved:
* DDO will be unable to discern identical save files once the player has exited the deep dungeon instance (i.e. the floors or the inbetween floor areas) or closes FFXIV or ACT.
* Two save files are identical if:
	* Both are for the same deep dungeon.
	* Both are on the same character.
	* Both are on the same job. 
	* Both are on the same floor.

An example case of this is if you like to build two save files up to the same floor (i.e. two save files at floor 171 for RDM on the same character).  
When selecting the save slot in game the overlay does not have a way to know _which_ save file you clicked on and will just pick the first one it finds in its own save file that matches on dungeon, character, job, and floor.  Since there are two it may not pick the right one and the tracked data will be innacurate.
This is only an issue if you leave the dungeon instance with both save slots at the same floor.  If you continue one save slot past where another is currently at the overlay will not have an issue.

Since the overlay does not know when you delete a save file in game there are two buttons to clear its save files of any saves when not in a deep dungeon.  This is good to use when you plan on attempting a run that you want to make sure is properly tracked.

![DDOSM](overlay/docs/en/SaveManager.png?raw=true)

# Scoring Details

The score estimate you see when you start a run proactively assumes a few things in order to keep the displayed score as accurate as possible:
* You have max aetherpool (99/99).
* You are max level (60/70).
* You will successfully complete the current run to the next scorecard (30/100/200).
	
Speed run bonus is credited at the start of a floorset and removed if the '30 minutes remaining' message is detected.

Full points for floor reveal are credited at the start of a floor (if the 'assume full map clear' option is enabled).

A point estimate depending on the dungeon/floorset is added per room revealed (if the 'assume full map clear' option is disabled) unless:
* A Pomander of Sight is used. Full points are awarded.
* Total number of revealed rooms equals the maximum possible rooms for the current dungeon/floorset. Full points are awarded.
* Total number of revealed rooms is less than the minimum possible rooms for the current dungeon/floorset.  No points are awarded.

Magicite can kill monsters that are so far away from the player that they have not been loaded on their machine.  This means when they die no death notification is received.  As a result the kill count will be innacurate.

The score will display '414' if the run did not start on 1, 21 (HoH) or 51 (PotD).

# In Development

* An upgrade to the UI/UX is being worked on to improve readability and streamline the current implementation.
* The scoring algorithm is continuously being tweaked and tested.
