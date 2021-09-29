# Introduction

Deep Dungeon Overlay is an in-development OverlayPlugin skin intended to give you relevant information during solo excursions into FFXIV Deep Dungeons.

# Requirements to use DDO

DDO requires the Advanced Combat Tracker (ACT) software.  Additionally it requires the FFXIV_ACT_Plugin as well as the OverlayPlugin library to be installed in ACT.
Instructions for installing ACT as well as FFXIV_ACT_Plugin can be found in written form here: [Install ACT](https://github.com/FFXIV-ACT/setup-guide)
Additionally Desperius FFXIV has a good video tutorial (current as of April 2021) here: [Video Guide](https://www.youtube.com/watch?v=urZTrF864x8&t=0s)

# Installation of DDO

- Within the OverlayPlugin create a new min-parse overlay
- Set the url to https://iamlokken.github.io/DeepDungeonOverlay/overlay/

# Current Features

* Score (Estimate)
	* The overlay will give you a real-time estimate on your current score.  Please see the Score Caveats section for more information.
	* Scoring algorithm is built from Alpha's scoring testing: [Scoring explanation](https://docs.google.com/document/d/1MnR2Xtj2lol1LESgscI6yi_1xcAeP3FBwJecbD-EiwE/edit)
	
* Satistics:
	* Monster kills
	* Mimic (Korrigan) kills
	* Traps triggered 
	* Floor enchantments applied (using a Serenity will decrement this count)
	* Rare monsters (PotD only)
	* Total floor sets completed in 30 minutes or less
	 
* Pomanders:
	* Safety (Enabled if one was used this floor)
	* Sight (Enabled if one was used this floor)
	* Affluence (Enabled if one was used last floor and currently active)
	* Alteration (Enabled if one was used last floor and currently active)
	* Flight (Enabled if one was used last floor and currently active)
	
* Beastiary Information:
    * Enemy Name
	* Enemy Current Health Percentage
	* Enemy Danger Level (Easy, Caution, Scary, Impossible)
	* Enemy Aggro Level (Sight, Sound, Proximity)
	* Enemy Info (Things to know about the enemy, if relevant)
	* __All beastiary information is pulled from Maygi's DD Handbooks with permission__.
		* [PotD Handbook](https://docs.google.com/document/d/e/2PACX-1vQpzFuhmSwTXuZSmtnKLNgQ0nRhumCFaB8NvCXFXSjrBHPRT5lXY8jMR4RaCK1aNfcl_G5ph5DNNwfl/pub)
		* [HoH Handbook](https://docs.google.com/document/d/1YVBSTOgJO-xOAB6YyKZEZRikjXFPle6Ihf_E7VdmQnI/edit)
		* [Maygi's twitch stream](https://www.twitch.tv/maygii)
	* **NOTE**: Beastiary information is the only section availble during group runs.

The Score, Pomander, Statistics, and Beastiary sections of the overlay can be hidden/shown via the checkboxes in the title bar of the overlay.

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
Since the overlay does not know when you delete a save file in game there are two buttons to clear its save files of any saves.  This is good to use when you plan on attempting a clear run that you want to make sure are properly tracked.
# Scoring Caveats

* The score will only be an estimate for a few reasons:
    * Magicite can kill monsters that are so far away that they were not loaded on the client and as a result no death message is received for them from the server.
    * The client currently does not receive a discernable notification that the current floor's map has been fully revealed so the only way to know if a map is 100% revealed is if a Sight pomander is used.
    * The overlay can discern when a room is revealed on the map so an average point value is added when a room is revealed.  This value depends on the dungeon and is determined by the max number of rooms a floor can have (8 in PotD, 12 in HoH).
