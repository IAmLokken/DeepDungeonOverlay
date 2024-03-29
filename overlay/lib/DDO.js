'use strict'

;(function()
{

    window.DDO = {};

    DDO.debug = true;

    DDO.SaveFiles = {
                        "the Palace of the Dead": [],
                        "Heaven-on-High": [],
                        "Eureka Orthos": []
                    };
    DDO.Snapshot = {};
    DDO.Bestiary = {};
    DDO.Data = {};
    DDO.DataElements = {};

    DDO.ParsedLogNumbers = ['00', '12', '21', '22', '25', '26', '33', '34', '41'];
    DDO.GroupParsedLogNumbers = ['00', '12', '21', '22'];
    DDO.EnchantmentIds = ['449', '440', '448', '446', '442', '443', '445', '441', '444', '447', '60C', '445', '60D', 'DA1'];
    DDO.TrapIDs = ['1884', '1893', '1894', '1883', '188C', '1887', '1886', '1885', '2C17', '7E77'];
    DDO.PomanderIDs = ['1873', '1874', '1876', '1877', '1878', '1879', '187A', '187B', '187C', '187D', '187E', '187F', '2C0B', '1880', '2C0C', '1AD6', '1AD4', '1AD5', '2C0D', '4000454A', '4001944A', '40004638', '4001FB18', '40002F3E','4001B237','400054A9'];
    DDO.AnimalIDs = ['2D05', '2D04', '2D06'];
    DDO.MagiciteIDs = ['4000454A', '4001944A', '40004638', '4001FB18'];
    DDO.LogLineIDs = ['1C34', '1C35', '23F6', '1C4D', '1C4A', '1C4E', '1C50', '1C37', '1C6B', '1C6F', '1C56', '282E', '282D', '2830'];
    DDO.RehabilitationID = "288";
    DDO.AnimalMap = {
        "2D05" : "Inugami",
        "2D04" : "Komainu",
        "2D06" : "Senri"
    };
    DDO.PomanderMap = {
        "1873" : "Safety",
        "1874" : "Sight",
        "1876" : "Strength",
        "1877" : "Steel",
        "1878" : "Affluence",
        "1879" : "Flight",
        "187A" : "Alteration",
        "187B" : "Purity",
        "187C" : "Fortune",
        "187D" : "Witching",
        "187E" : "Serenity",
        "187F" : "Rage",
        "2C0B" : "Frailty",
        "1880" : "Lust",
        "2C0C" : "Concealment",
        "1AD6" : "Intuition",
        "1AD4" : "Raising",
        "1AD5" : "Resolution",
        "2C0D" : "Petrification",
        "4000454A" : "Inferno",
        "4001944A" : "Vortex",
        "40004638" : "Crag",
        "4001FB18" : "Elder",
        "40002F3E" : "Unei",
        "4001B237" : "Doga",
        "400054A9" : "Onion Knight"
    };
    DDO.TrapMap = {
        "1884" : "Luring",
        "1893" : "Weapon Enhancement",
        "1894" : "Gear Enhancement",
        "1883" : "Landmine",
        "188C" : "Detonator",
        "1887" : "Toading",
        "1886" : "Impeding",
        "1885" : "Enfeebling",
        "2C17" : "Odder",
        "7E77" : "Owl"
    };
    DDO.EnchantmentMap = {
        "449" : "Auto-Heal Penalty",
        "440" : "Blind",
        "448" : "Knockback Penalty",
        "446" : "Item Penalty",
        "442" : "Damage Down",
        "443" : "Haste",
        "445" : "Hp & Mp Boost",
        "441" : "HP Penalty",
        "444" : "Inability",
        "447" : "Sprint Penalty",
        "60C" : "Sprint",
        "60D" : "Unmagicked",
        "GLOOM" : "Gloom",
        "DA1" : "Demiclone Penalty"
    };

    DDO.TrapInfo = {
        DetonatorTrapId: "188C",
        WeaponEnhancementTrapId: "1893",
        GearEnhancementTrapId: "1894"
    };
    DDO.PomanderInfo = {
        PomanderOfSafety: "1873",
        PomanderOfSight: "1874",
        PomanderOfAffluence: "1878",
        PomanderOfAlteration: "187A",
        PomanderOfFlight: "1879",
        PomanderOfSerenity: "187E",
        PomanderOfRaising: "1AD4"
    };

    DDO.RoomRangesPOTD = ['4:4:0:40', '3:6:421:60', '3:6:421:60', '3:6:421:60', '4:6:421:120', '3:6:421:60', '3:6:421:60', '3:6:421:60', '3:6:421:60', '4:6:421:120', '5:7:361:90', '5:7:361:90', '5:7:361:90', '5:7:361:90', '5:7:361:90', '5:8:316:300', '5:8:316:300', '5:8:316:300', '5:8:316:300', '5:8:316:300'];
    DDO.RoomRangesHOH  = ['3:6:421:60', '3:6:421:60', '3:6:421:60', '5:7:361:600', '5:7:361:600', '5:8:316:600', '5:8:316:600', '5:8:316:600', '5:8:316:600', '5:8:316:600'];
    DDO.RoomRangesEO  = ['3:6:421:60', '3:6:421:60', '3:6:421:60', '5:7:361:600', '5:7:361:600', '5:8:316:600', '5:8:316:600', '5:8:316:600', '5:8:316:600', '5:8:316:600'];

    DDO.playerName = "NULL";
    DDO.playerWorld = "NULL";
    DDO.playerJob = 0;
    DDO.playerLevel = 1;
    DDO.Players = {};

    DDO.affluenceActive = false;
    DDO.alterationActive = false;
    DDO.flightActive = false;
    DDO.sightActive = false;
    DDO.raisingActive = false;

    DDO.currentFloor = 0;
    DDO.speedRunBonus = true;
    DDO.isInGroup = false;
    DDO.soloRunUnderway = false;
    DDO.groupRunUnderway = false;
    DDO.inbetweenArea = false;
    DDO.keyOpen = false;

    DDO.currentInstance = "NULL";
    DDO.currentFloorStats = {};
    DDO.currentFloorSetStats = {};
    DDO.currentSaveFileIndex = 0;
    DDO.RunAbandoned = false;

    DDO.currentTargetName = "NULL";
    DDO.currentTargetID = "NULL";
    DDO.currentTargetHPP = 100;

    DDO.triggeredTraps = [];
    DDO.usedPomanders = [];
    DDO.enchantmentsApplied = [];

    DDO.SetDefaultConfig = async function()
    {
        DDO.Config = {};
        DDO.Config.scoreVisible = true;
        DDO.Config.pomandersVisible = true;
        DDO.Config.statsVisible = true;
        DDO.Config.bestiaryVisible = true;
        DDO.Config.assumeFullMapClear = false;        

        await callOverlayHandler({call: "saveData", key: "DDO_Config", data: JSON.stringify(DDO.Config)}); 
    }

    DDO.SaveConfig = async function()
    {
        DDO.Config.scoreVisible = DDO.DataElements.ScoreCheckBoxValue.checked;
        DDO.Config.pomandersVisible = DDO.DataElements.PomandersCheckBoxValue.checked;
        DDO.Config.statsVisible = DDO.DataElements.StatisticsCheckBoxValue.checked;
        DDO.Config.bestiaryVisible = DDO.DataElements.BestiaryCheckBoxValue.checked;
        DDO.Config.assumeFullMapClear = DDO.DataElements.MapClearCheckBoxValue.checked;
        await callOverlayHandler({call: "saveData", key: "DDO_Config", data: JSON.stringify(DDO.Config)}); 
    }

    DDO.InitializeConfig = function()
    {
        DDO.DataElements.ScoreCheckBoxValue.checked = DDO.Config.scoreVisible;
        DDO.DataElements.PomandersCheckBoxValue.checked = DDO.Config.pomandersVisible;
        DDO.DataElements.StatisticsCheckBoxValue.checked = DDO.Config.statsVisible;
        DDO.DataElements.BestiaryCheckBoxValue.checked = DDO.Config.bestiaryVisible;
        DDO.DataElements.MapClearCheckBoxValue.checked = DDO.Config.assumeFullMapClear;
    }

    DDO.LoadConfig = function(instanceName)
    {
        if (instanceName.includes(DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceFloorsPOTD) ||
            instanceName.includes(DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceFloorsHOH) ||
            instanceName.includes(DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceFloorsEO))
        {
            if((DDO.soloRunUnderway || DDO.groupRunUnderway) && !DDO.inbetweenArea){
                // At the end of cutscenes a new zone change message is received.  This is so we dont lose our current dungeon
                DDO.currentInstance = instanceName.substring(0, instanceName.indexOf('(')).trim();
            }
            // we just continued a run
            else if ((DDO.soloRunUnderway || DDO.groupRunUnderway) && DDO.inbetweenArea){
                DDO.currentFloor = parseInt(instanceName.substring(instanceName.lastIndexOf(' ') + 1,instanceName.lastIndexOf('-')));
                DDO.currentInstance = instanceName.substring(0, instanceName.indexOf('(')).trim();
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].floorMaxScore = DDO.GetMaxFloorScore();           
                DDO.currentFloorStats.roomRevealCount++;
                DDO.currentFloorSetStats.roomRevealCount++;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].roomRevealCounts[0]++;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount++;     
                DDO.StartFloorSetUI();
                DDO.ResetVariables();          
            }
            else if (!DDO.groupRunUnderway && !DDO.soloRunUnderway){
                DDO.currentFloor = parseInt(instanceName.substring(instanceName.lastIndexOf(' ') + 1,instanceName.lastIndexOf('-')));
                DDO.currentInstance = instanceName.substring(0, instanceName.indexOf('(')).trim();
                if (DDO.isInGroup)
                {
                    DDO.groupRunUnderway = true;
                    DDO.soloRunUnderway = false;
                    DDO.LoadPartyConfig();
                }
                else{
                    DDO.soloRunUnderway = true;
                    DDO.groupRunUnderway = false;
                    DDO.LoadSoloConfig();
                }
                DDO.ClearFloorValues();
                DDO.ClearFloorSetValues();         
                DDO.LoadSave();
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].floorMaxScore = DDO.GetMaxFloorScore();
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount++;                 
                DDO.currentFloorStats.roomRevealCount++;
                DDO.currentFloorSetStats.roomRevealCount++;
                DDO.StartFloorSetUI();
                DDO.ResetVariables();
            }/*
            else if (DDO.isInGroup && !DDO.groupRunUnderway){
                DDO.groupRunUnderway = true;
                DDO.LoadPartyConfig();
                DDO.currentFloor = parseInt(instanceName.substring(instanceName.lastIndexOf(' ') + 1, instanceName.lastIndexOf('-')));
                DDO.currentInstance = instanceName.substring(0, instanceName.indexOf('(')).trim();
            }
            else if (DDO.isInGroup && DDO.groupRunUnderway)
            {
                DDO.currentFloor = parseInt(instanceName.substring(instanceName.lastIndexOf(' ') + 1, instanceName.lastIndexOf('-')));
                DDO.currentInstance = instanceName.substring(0, instanceName.indexOf('(')).trim();
            }*/
            DDO.inbetweenArea = false;
        }
        else if (instanceName == DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstancePOTD ||
                instanceName == DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceHOH ||
                instanceName == DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceEO){
            if (!DDO.soloRunUnderway && !DDO.groupRunUnderway){
                // If they just logged in or reset the plugin/act treat this zone like any other zone
                DDO.soloRunUnderway = false;
                DDO.groupRunUnderway = false;
                DDO.inbetweenArea = false;
                DDO.currentInstance = instanceName;
                DDO.LoadNonRunConfig(); 
            }else{
                // Otherwise they just finished a set and we proceed like normal
                DDO.inbetweenArea = true;
                DDO.currentInstance = instanceName;
                DDO.ClearFloorValues();
                DDO.ClearFloorSetValues();
            }
        }
        else {
            if (DDO.RunAbandoned && DDO.SaveFiles[DDO.currentInstance].length > 0)
            {
                DDO.Console("Abandoned run, removing");
                DDO.SaveFiles[DDO.currentInstance].splice(DDO.currentSaveFileIndex, 1);
                DDO.SaveRuns();
                DDO.RunAbandoned = false;
            }
            DDO.soloRunUnderway = false;
            DDO.groupRunUnderway = false;
            DDO.inbetweenArea = false;
            DDO.currentInstance = instanceName;
            clearInterval(DDO.ticker);
            DDO.LoadNonRunConfig(); 
        }
    }

    DDO.LoadSoloConfig = function()
    {
        DDO.EnableDisableElement(false, 'saveManager', false);
        DDO.EnableDisableElement(false, 'ButtonInfo', false);
        DDO.EnableDisableElement(false, 'settings', false);
        DDO.EnableDisableElement(true, 'config', false);
        DDO.EnableDisableElement(true, 'timer', false);   
        DDO.EnableDisableElement(true, 'CheckBoxBestiary', false);
        DDO.EnableDisableElement(true, 'CheckBoxStatistics', false);
        DDO.EnableDisableElement(true, 'CheckBoxPomanders', false);
        DDO.EnableDisableElement(true, 'CheckBoxScore', false);
        let version = document.getElementById("VERSION");
        let divider = document.getElementById("divider");
        if (DDO.DisplayVersion()){
            version.style.display = "";
            divider.style.display = "";
        }
        else{
            version.style.display = "none";
            divider.style.display = "none";
        }

        DDO.DataElements.ScoreCheckBoxValue.checked = DDO.Config.scoreVisible;
        DDO.DataElements.PomandersCheckBoxValue.checked = DDO.Config.pomandersVisible;
        DDO.DataElements.StatisticsCheckBoxValue.checked = DDO.Config.statsVisible;
        DDO.DataElements.BestiaryCheckBoxValue.checked = DDO.Config.bestiaryVisible;

        DDO.EnableDisableElement(DDO.DataElements.ScoreCheckBoxValue.checked, 'score', false);
        DDO.EnableDisableElement(DDO.DataElements.PomandersCheckBoxValue.checked, 'pomanders', false);
        DDO.EnableDisableElement(DDO.DataElements.StatisticsCheckBoxValue.checked, 'statistics', false);
        DDO.EnableDisableElement(DDO.DataElements.BestiaryCheckBoxValue.checked, 'targetinfo', false);
        
        if (DDO.currentInstance.includes('Heaven-on-High')){
            DDO.DataElements.RareMonstersRow.style.display = "none";
        }
        else{
            let rareLabel = document.getElementById("RareMonstersLabel");
            let UIStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings;
            if (DDO.currentInstance.includes('the Palace of the Dead'))
                rareLabel.innerText = UIStrings.RareMonstersLabel;
            else
                rareLabel.innerText = UIStrings.DreadBeastLabel;
            
            DDO.DataElements.RareMonstersRow.style.display = "";
        }
    }

    DDO.LoadPartyConfig = function()
    {
        DDO.EnableDisableElement(false, 'ButtonInfo', false);
        DDO.EnableDisableElement(false, 'saveManager', false);
        DDO.EnableDisableElement(false, 'settings', false);
        DDO.EnableDisableElement(true, 'config', false);
        DDO.EnableDisableElement(true, 'timer', false);
        DDO.EnableDisableElement(false, 'score', false);
        DDO.EnableDisableElement(false, 'statistics', true);
        DDO.EnableDisableElement(false, 'CheckBoxScore', false);
        DDO.EnableDisableElement(true, 'CheckBoxStatistics', false);
        DDO.EnableDisableElement(true, 'CheckBoxBestiary', false);
        DDO.EnableDisableElement(true, 'CheckBoxPomanders', false);
        
        let version = document.getElementById("VERSION");
        let divider = document.getElementById("divider");
        if (DDO.DisplayVersion()){
            version.style.display = "";
            divider.style.display = "";
        }
        else{
            version.style.display = "none";
            divider.style.display = "none";
        }

        DDO.DataElements.StatisticsCheckBoxValue.checked = DDO.Config.statsVisible;
        DDO.DataElements.PomandersCheckBoxValue.checked = DDO.Config.pomandersVisible;
        DDO.DataElements.BestiaryCheckBoxValue.checked = DDO.Config.bestiaryVisible;

        DDO.EnableDisableElement(DDO.DataElements.StatisticsCheckBoxValue.checked, 'statistics', false);
        DDO.EnableDisableElement(DDO.DataElements.PomandersCheckBoxValue.checked, 'pomanders', false);
        DDO.EnableDisableElement(DDO.DataElements.BestiaryCheckBoxValue.checked, 'targetinfo', false);

        if (DDO.currentInstance.includes('Heaven-on-High')){
            DDO.DataElements.RareMonstersRow.style.display = "none";
        }
        else{
            let rareLabel = document.getElementById("RareMonstersLabel");
            let UIStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings;
            if (DDO.currentInstance.includes('the Palace of the Dead'))
                rareLabel.innerText = UIStrings.RareMonstersLabel;
            else
                rareLabel.innerText = UIStrings.DreadBeastLabel;
            
            DDO.DataElements.RareMonstersRow.style.display = "";
        }
    }

    DDO.LoadNonRunConfig = function()
    {
        DDO.EnableDisableElement(false, 'config', false);
        DDO.EnableDisableElement(true, 'ButtonInfo', false);
        DDO.EnableDisableElement(true, 'saveManager', false);
        DDO.EnableDisableElement(true, 'settings', false);
        DDO.EnableDisableElement(false, 'score', false);
        DDO.EnableDisableElement(false, 'pomanders', false);
        DDO.EnableDisableElement(false, 'statistics', false);
        DDO.EnableDisableElement(false, 'targetinfo', false);

        let version = document.getElementById("VERSION");
        let divider = document.getElementById("divider");
        version.style.display = "";
        divider.style.display = "";

        if (DDO.SaveFiles['the Palace of the Dead'].length > 0 )
            DDO.DataElements.POTDButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['POTDButton']} (${DDO.SaveFiles['the Palace of the Dead'].length})`;
        else
            DDO.DataElements.POTDButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['POTDButton']}`;

        if (DDO.SaveFiles['Heaven-on-High'].length > 0 )
            DDO.DataElements.HOHButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['HOHButton']} (${DDO.SaveFiles['Heaven-on-High'].length})`;
        else
            DDO.DataElements.HOHButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['HOHButton']}`;

        if (DDO.SaveFiles['Eureka Orthos'] && DDO.SaveFiles['Eureka Orthos'].length > 0 )
            DDO.DataElements.EOButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['EOButton']} (${DDO.SaveFiles['Eureka Orthos'].length})`;
        else
            DDO.DataElements.EOButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['EOButton']}`;

        DDO.DataElements.MapClearCheckBoxValue.checked = DDO.Config.assumeFullMapClear;
    }

    DDO.LoadSave = function()
    {
        let saveFound = false;
        for (var i = 0; i < DDO.SaveFiles[DDO.currentInstance].length; i++)
        {
            //console.log("Current Save: " + DDO.SaveFiles[DDO.currentInstance][i]);
            if ((!DDO.isInGroup &&
                DDO.SaveFiles[DDO.currentInstance][i].playerName == DDO.playerName &&
                DDO.SaveFiles[DDO.currentInstance][i].playerJob == DDO.playerJob &&
                DDO.SaveFiles[DDO.currentInstance][i].playerWorld == DDO.playerWorld &&
                DDO.SaveFiles[DDO.currentInstance][i].lastFloorCleared == DDO.currentFloor - 1)
                ||
                (DDO.isInGroup &&
                DDO.SaveFiles[DDO.currentInstance][i].Players &&
                JSON.stringify(DDO.SaveFiles[DDO.currentInstance][i].Players) == JSON.stringify(DDO.Players) &&
                DDO.SaveFiles[DDO.currentInstance][i].lastFloorCleared == DDO.currentFloor - 1)
                )
            {
                DDO.currentSaveFileIndex = i;
                // This if statement is to include items in the save file that may not have existed when a run was started
                if(!DDO.SaveFiles[DDO.currentInstance][i].mimicKillCounts || !DDO.SaveFiles[DDO.currentInstance][i].roomRevealCounts || !DDO.SaveFiles[DDO.currentInstance][i].rareKillCounts){
                    DDO.SaveFiles[DDO.currentInstance][i].mimicKillCounts = new Array(20).fill(0);
                    DDO.SaveFiles[DDO.currentInstance][i].roomRevealCounts = new Array(20).fill(0);
                    DDO.SaveFiles[DDO.currentInstance][i].rareKillCounts = new Array(20).fill(0);
                }
                if (!DDO.SaveFiles[DDO.currentInstance][i].ID)
                {
                    DDO.SaveFiles[DDO.currentInstance][i].ID = DDO.GenerateUUID();
                }
                if (!DDO.SaveFiles[DDO.currentInstance][i].StartDate)
                {
                    DDO.SaveFiles[DDO.currentInstance][i].StartDate = (new Date()).toISOString();
                }
                if (!DDO.SaveFiles[DDO.currentInstance][i].SaveSent)
                {
                    DDO.SaveFiles[DDO.currentInstance][i].SaveSent = false;
                }
                if(!DDO.SaveFiles[DDO.currentInstance][i].Players)
                {
                    DDO.SaveFiles[DDO.currentInstance][i].Players = DDO.Players;
                }
                DDO.Snapshot = JSON.parse(JSON.stringify(DDO.SaveFiles[DDO.currentInstance][i]));
                saveFound = true;
                DDO.RunAbandoned = true;
                //console.log("Found Save: " + DDO.SaveFiles[DDO.currentInstance][i]);
            }
        }
        if (!saveFound){
            var newSave = {};
            newSave.ID = DDO.GenerateUUID();
            newSave.StartDate = (new Date()).toISOString();
            newSave.EndDate = "";
            newSave.playerName = DDO.playerName;
            newSave.playerJob = DDO.playerJob;
            newSave.playerWorld = DDO.playerWorld;
            newSave.Players = DDO.Players;
            newSave.deepDungeonName = DDO.currentInstance;
            newSave.lastFloorCleared = DDO.currentFloor - 1;
            newSave.floorStartedOn = DDO.currentFloor;
            newSave.floorMaxScore = 0;
            newSave.totalKillCount = 0;
            newSave.floorKillCounts = new Array(20).fill(0);
            newSave.roomRevealCounts = new Array(20).fill(0);
            newSave.mimicKillCounts = new Array(20).fill(0);
            newSave.rareKillCounts = new Array(20).fill(0);
            newSave.currentSpecialKillCount = 0;
            newSave.currentTrapsTriggered = 0;
            newSave.currentMimicCount = 0;
            newSave.currentKorriganCount = 0;
            newSave.currentSpeedRunBonusCount = 0;
            newSave.currentChestCount = 0;
            newSave.currentMapRevealCount = 0;
            newSave.currentEnchantmentCount = 0;
            newSave.currentRoomRevealCount = 0;
            newSave.currentRezCount = 0;
            newSave.currentKOCount = 0;
            newSave.SaveSent = false;

            DDO.currentSaveFileIndex = DDO.SaveFiles[DDO.currentInstance].length;
            DDO.SaveFiles[DDO.currentInstance].push(newSave);        
            DDO.Snapshot = JSON.parse(JSON.stringify(newSave));
            DDO.RunAbandoned = true;
            
        }    
    }

    DDO.StartFloorSetUI = function()
    {
        let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];
        DDO.DataElements.MonstersFloorValue.innerText = 0;
        DDO.DataElements.MonstersSetValue.innerText = 0;
        DDO.DataElements.MonstersTotalValue.innerText = currentSave.totalKillCount;
        DDO.DataElements.MimicsFloorValue.innerText = 0;
        DDO.DataElements.MimicsSetValue.innerText = 0;
        DDO.DataElements.MimicsTotalValue.innerText = `${currentSave.currentMimicCount} (${currentSave.currentKorriganCount})`;
        DDO.DataElements.TrapsFloorValue.innerText = 0;
        DDO.DataElements.TrapsSetValue.innerText = 0;
        DDO.DataElements.TrapsTotalValue.innerText = currentSave.currentTrapsTriggered;
        DDO.DataElements.ChestsFloorValue.innerText = 0;
        DDO.DataElements.ChestsSetValue.innerText = 0;
        DDO.DataElements.ChestsTotalValue.innerText = currentSave.currentChestCount;
        DDO.DataElements.EnchantmentsFloorValue.innerText = 0;
        DDO.DataElements.EnchantmentsSetValue.innerText = 0;
        DDO.DataElements.EnchantmentsTotalValue.innerText = currentSave.currentEnchantmentCount;
        DDO.DataElements.RareMonstersFloorValue.innerText = 0;
        DDO.DataElements.RareMonstersSetValue.innerText = 0;
        DDO.DataElements.RareMonstersTotalValue.innerText = currentSave.currentSpecialKillCount;
        DDO.DataElements.SpeedRunsFloorValue.innerText = 0;
        DDO.DataElements.SpeedRunsSetValue.innerText = 0;
        DDO.DataElements.SpeedRunsTotalValue.innerText = currentSave.currentSpeedRunBonusCount;
    }
    DDO.ClearFloorValues = function()
    {
        DDO.currentFloorStats = {};
        DDO.currentFloorStats.killCount = 0;
        DDO.currentFloorStats.trapsTriggered = 0;
        DDO.currentFloorStats.mimicCount = 0;
        DDO.currentFloorStats.korriganCount = 0;
        DDO.currentFloorStats.chestCount = 0;
        DDO.currentFloorStats.magiciteUsed = 0;
        DDO.currentFloorStats.enchantmentCount = 0;
        DDO.currentFloorStats.roomRevealCount = 0;
        DDO.currentFloorStats.rareKillCount = 0;

    }
    DDO.ClearFloorSetValues = function()
    {
        DDO.currentFloorSetStats = {};
        DDO.currentFloorSetStats.killCount = 0;
        DDO.currentFloorSetStats.trapsTriggered = 0;
        DDO.currentFloorSetStats.mimicCount = 0;
        DDO.currentFloorSetStats.korriganCount = 0;
        DDO.currentFloorSetStats.chestCount = 0;
        DDO.currentFloorSetStats.magiciteUsed = 0;
        DDO.currentFloorSetStats.enchantmentCount = 0;
        DDO.currentFloorSetStats.roomRevealCount = 0;
        DDO.currentFloorSetStats.rareKillCount = 0;
    }
    DDO.ResetVariables = function(){
        DDO.triggerAffluence = false;
        DDO.triggerAlteration = false;
        DDO.triggerFlight = false;
        DDO.safetyActive = false;
        DDO.affluenceActive = false;
        DDO.alterationActive = false;
        DDO.flightActive = false;
        DDO.sightActive = false;
        DDO.raisingActive = false;

        DDO.DisablePomImages();
    }

    DDO.SaveRuns = function()
    {
        callOverlayHandler({call: "saveData", key: "DDO_Saves", data: JSON.stringify(DDO.SaveFiles)});
    }

    DDO.EnableDisableElement = function(enabled, targetElement, saveConfig)
    {
        var element = document.getElementById(targetElement);
        var version = document.getElementById("VERSION");
        let divider = document.getElementById("divider");
        if (enabled)
            element.style.display = "";
        if (!enabled)
            element.style.display = "none";

        if (saveConfig)
            DDO.SaveConfig();

        if (DDO.DisplayVersion()){
            version.style.display = "";
            divider.style.display = "";
        }
        else{
            version.style.display = "none";
            divider.style.display = "none";
        }
    }
    DDO.DisplayVersion = function()
    {
        if (DDO.groupRunUnderway){
            return DDO.Config.pomandersVisible || DDO.Config.bestiaryVisible || DDO.Config.statsVisible;
        }
        else{
            return DDO.Config.scoreVisible || DDO.Config.pomandersVisible || DDO.Config.statsVisible || DDO.Config.bestiaryVisible;
        }            
    }

    DDO.EnableDisableSetting = function(enabled, setting, saveConfig){
        DDO.Config[setting] = enabled;
        if (saveConfig)
            DDO.SaveConfig();
    }

    DDO.TurnTargetImagesOff = function()
    {
        DDO.DataElements.DangerEasyImage.style.display = "none";
        DDO.DataElements.DangerCautionImage.style.display = "none";
        DDO.DataElements.DangerScaryImage.style.display = "none";
        DDO.DataElements.DangerImpossibleImage.style.display = "none";
        DDO.DataElements.AggroSightImage.style.display = "none";
        DDO.DataElements.AggroSoundImage.style.display = "none";
        DDO.DataElements.AggroProximityImage.style.display = "none";
    }
    DDO.DisablePomImages = function()
    {
        DDO.DataElements.PomSafetyDisabledImage.style.display = "";
        DDO.DataElements.PomSightDisabledImage.style.display = "";
        DDO.DataElements.PomAffluenceDisabledImage.style.display = "";
        DDO.DataElements.PomAlterationDisabledImage.style.display = "";
        DDO.DataElements.PomFlightDisabledImage.style.display = "";

        DDO.DataElements.PomSafetyEnabledImage.style.display = "none";
        DDO.DataElements.PomSightEnabledImage.style.display = "none";
        DDO.DataElements.PomAffluenceEnabledImage.style.display = "none";
        DDO.DataElements.PomAlterationEnabledImage.style.display = "none";
        DDO.DataElements.PomFlightEnabledImage.style.display = "none";
    }

    DDO.UpdatePlayerInfo = async function(callback)
    {
        var combatants = await window.callOverlayHandler({ call: 'getCombatants' });
        if (combatants.combatants.length > 0){
            DDO.playerJob = combatants.combatants[0].Job;
            DDO.playerLevel = combatants.combatants[0].Level;
            DDO.playerWorld = combatants.combatants[0].WorldName;
            if (callback)
            {
                //console.log(arguments[1]);
                //console.log(callback);
                callback(arguments[1]);
            }
            if (DDO.soloRunUnderway && !DDO.inbetweenArea && DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex])
                DDO.UpdateScore();
        }
    }
    DDO.UpdateGroupInfo = function(data)
    {
        if (data.party.length > 0)
        {            
            let temp = JSON.stringify(data.party);
            console.log("Party updated: " + temp);
            DDO.Players = JSON.parse(temp);
            DDO.Players.forEach(element => {
                delete element.id;
                delete element.inParty;
                delete element.level;
            });
            DDO.Players.sort((a,b) => (a.name > b.name) ? 1 : -1);
        }
    }
    DDO.UpdateGroupJobs = async function(callback)
    {
        if (DDO.Players && DDO.Players.length > 1)
        {
            let playerList = [];
            DDO.Players.forEach(element => {
                playerList.push(element.name);
            });
            //console.log("Player List: " + playerList);
            var combatants = await window.callOverlayHandler({ call: 'getCombatants', names: playerList });
            //console.log("Combatant List: " + combatants.combatants);
            let ourCombatants = combatants.combatants.sort((a,b) => (a.Name > b.Name) ? 1 : -1);
            //console.log(JSON.stringify(ourCombatants));
            if (DDO.Players.length == ourCombatants.length)
            {
                for (var i = 0; i < DDO.Players.length; i++)
                {
                    DDO.Players[i].job = ourCombatants[i].Job;
                }
            }
        }
        if (callback)
        {
            //console.log(arguments[1]);
            //console.log(callback);
            callback(DDO.LoadConfig, arguments[1]);
        }
}

    DDO.PlayerInGroup = function(playerName)
    {
        for (var i = 0; i < DDO.Players.length; i++)
        {
            if (DDO.Players[i].name.toUpperCase() == playerName)
                return true;
        }
        return false;
    }

    DDO.ClearPOTDSaves = function()
    {
        DDO.SaveFiles['the Palace of the Dead'] = [];
        DDO.DataElements.POTDButton.innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['POTDButton'];
        DDO.SaveRuns();
    }

    DDO.ClearHOHSaves = function()
    {
        DDO.SaveFiles['Heaven-on-High'] = [];
        DDO.DataElements.HOHButton.innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['HOHButton'];
        DDO.SaveRuns();
    }

    DDO.ClearEOSaves = function()
    {
        DDO.SaveFiles['Eureka Orthos'] = [];
        DDO.DataElements.EOButton.innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['EOButton'];
        DDO.SaveRuns();
    }

    DDO.InitiateTimer = function(offset, floor){
        clearInterval(DDO.ticker);
        DDO.DataElements.TimerValue.innerText = '00:00';
        DDO.DataElements.TimerValue.style.color = "white";
        
        let floorSetIndex = Math.floor(floor / 10);
        let timerValue = -1;
        if (DDO.currentInstance == 'Heaven-on-High' || DDO.currentInstance == 'Eureka Orthos'){
            let range = DDO.RoomRangesHOH[floorSetIndex].split(':').map(Number);
            timerValue += range[3];
        }
        else{
            let range = DDO.RoomRangesPOTD[floorSetIndex].split(':').map(Number);
            timerValue += range[3];
        }

        var timeInSecs;

        function startTimer(secs){
            timeInSecs = parseInt(secs);
            DDO.ticker = setInterval(tick, 1000);
        }

        function tick( ){
            var secs = timeInSecs;
            if (secs > 0) {
                timeInSecs--; 
                }
            else {
                clearInterval(DDO.ticker);
                startTimer(timerValue); 
            }

            var mins = Math.floor(secs/60);
            secs %= 60;

            var output = ( (mins < 10) ? "0" : "" ) + mins + ":" + ( (secs < 10) ? "0" : "" ) + secs;
            if (secs < 15 && mins == 0)
                DDO.DataElements.TimerValue.style.color = "red";
            else
                DDO.DataElements.TimerValue.style.color = "white";

            DDO.DataElements.TimerValue.innerText = output;
        }
        
        startTimer(timerValue + offset);
    }

    DDO.UpdateScore = function()
    {
        let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];
        if (!currentSave) return;
        if (currentSave.floorStartedOn == 1 ||
            (currentSave.floorStartedOn == 21 && DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings['CurrentInstanceFloorsHOH'].includes(currentSave.deepDungeonName)) ||
            (currentSave.floorStartedOn == 51 && DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings['CurrentInstanceFloorsPOTD'].includes(currentSave.deepDungeonName)) ||
            (currentSave.floorStartedOn == 21 && DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings['CurrentInstanceFloorsEO'].includes(currentSave.deepDungeonName))
            ){
                let playerLevel = DDO.currentInstance == 'Eureka Orthos' ? 90 : DDO.currentInstance == 'Heaven-on-High' ? 70: 60;
                let score = DDO.ScoreCalculator.CalulcateCurrentScore(currentSave, playerLevel, 101);

                if (DDO.Config.assumeFullMapClear){
                    score += DDO.ScoreCalculator.CalculateMaxRoomReveal(currentSave, 101);
                }
                else{
                    score += DDO.ScoreCalculator.CalculateRoomRevealEstimate(currentSave.roomRevealCounts, currentSave.deepDungeonName);
                }

                DDO.DataElements.ScoreValue.innerText = score.toLocaleString();
        }
        else{
            DDO.DataElements.ScoreValue.innerText = '414';
        }
    }

    DDO.GetMaxFloorScore = function(){
        if (DDO.currentInstance == 'Heaven-on-High' || DDO.currentInstance == 'Eureka Orthos'){
            return DDO.currentFloor <= 30 ? 30 : 100;
        }
        else{
            return DDO.currentFloor <= 100 ? 100 : 200;
        }
    }

    DDO.AssignDataElements = function()
    {
        DDO.DataElements.POTDButton = document.getElementById("POTDButton");
        DDO.DataElements.HOHButton = document.getElementById("HOHButton");
        DDO.DataElements.EOButton = document.getElementById("EOButton");

        DDO.DataElements.ScoreValue = document.getElementById("Score");
        DDO.DataElements.MonstersFloorValue = document.getElementById("MonstersFloor");
        DDO.DataElements.MonstersSetValue = document.getElementById("MonstersSet");
        DDO.DataElements.MonstersTotalValue = document.getElementById("MonstersTotal");

        DDO.DataElements.MimicsFloorValue = document.getElementById("MimicsFloor");
        DDO.DataElements.MimicsSetValue = document.getElementById("MimicsSet");
        DDO.DataElements.MimicsTotalValue = document.getElementById("MimicsTotal");

        DDO.DataElements.TrapsFloorValue = document.getElementById("TrapsFloor");
        DDO.DataElements.TrapsSetValue = document.getElementById("TrapsSet");
        DDO.DataElements.TrapsTotalValue = document.getElementById("TrapsTotal");

        DDO.DataElements.ChestsFloorValue = document.getElementById("ChestsFloor");
        DDO.DataElements.ChestsSetValue = document.getElementById("ChestsSet");
        DDO.DataElements.ChestsTotalValue = document.getElementById("ChestsTotal");

        DDO.DataElements.EnchantmentsFloorValue = document.getElementById("EnchantmentsFloor");
        DDO.DataElements.EnchantmentsSetValue = document.getElementById("EnchantmentsSet");
        DDO.DataElements.EnchantmentsTotalValue = document.getElementById("EnchantmentsTotal");

        DDO.DataElements.RareMonstersFloorValue = document.getElementById("RareMonstersFloor");
        DDO.DataElements.RareMonstersSetValue = document.getElementById("RareMonstersSet");
        DDO.DataElements.RareMonstersTotalValue = document.getElementById("RareMonstersTotal");
        DDO.DataElements.RareMonstersRow = document.getElementById("RareMonstersRow");

        DDO.DataElements.SpeedRunsFloorValue = document.getElementById("SpeedRunsFloor");
        DDO.DataElements.SpeedRunsSetValue = document.getElementById("SpeedRunsSet");
        DDO.DataElements.SpeedRunsTotalValue = document.getElementById("SpeedRunsTotal");

        DDO.DataElements.TargetNameValue = document.getElementById("TargetName");
        DDO.DataElements.TargetHPPValue = document.getElementById("TargetHPP");
        DDO.DataElements.DangerEasyImage = document.getElementById("DangerEasy");
        DDO.DataElements.DangerCautionImage = document.getElementById("DangerCaution");
        DDO.DataElements.DangerScaryImage = document.getElementById("DangerScary");
        DDO.DataElements.DangerImpossibleImage = document.getElementById("DangerImpossible");
        DDO.DataElements.AggroSightImage = document.getElementById("AggroSight");
        DDO.DataElements.AggroSoundImage = document.getElementById("AggroSound");
        DDO.DataElements.AggroProximityImage = document.getElementById("AggroProximity");
        DDO.DataElements.TargetInformationValue = document.getElementById("TargetInformation");

        DDO.DataElements.TimerValue = document.getElementById("timer");
        DDO.DataElements.BestiaryCheckBoxValue = document.getElementById("CheckBoxBestiary");
        DDO.DataElements.StatisticsCheckBoxValue = document.getElementById("CheckBoxStatistics");
        DDO.DataElements.PomandersCheckBoxValue = document.getElementById("CheckBoxPomanders");
        DDO.DataElements.ScoreCheckBoxValue = document.getElementById("CheckBoxScore");
        DDO.DataElements.MapClearCheckBoxValue = document.getElementById("MapClearCheckBox");

        DDO.DataElements.PomSafetyDisabledImage = document.getElementById("PomSafetyDisabled");
        DDO.DataElements.PomSightDisabledImage = document.getElementById("PomSightDisabled");
        DDO.DataElements.PomAffluenceDisabledImage = document.getElementById("PomAffluenceDisabled");
        DDO.DataElements.PomAlterationDisabledImage = document.getElementById("PomAlterationDisabled");
        DDO.DataElements.PomFlightDisabledImage = document.getElementById("PomFlightDisabled");

        DDO.DataElements.PomSafetyEnabledImage = document.getElementById("PomSafetyEnabled");
        DDO.DataElements.PomSightEnabledImage = document.getElementById("PomSightEnabled");
        DDO.DataElements.PomAffluenceEnabledImage = document.getElementById("PomAffluenceEnabled");
        DDO.DataElements.PomAlterationEnabledImage = document.getElementById("PomAlterationEnabled");
        DDO.DataElements.PomFlightEnabledImage = document.getElementById("PomFlightEnabled");            
    }

    DDO.GenerateUUID = function()
    {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    DDO.Console = function(value)
    {
        DDO.debug ? console.log(value) : null;
    }

    DDO.ConvertMilisecondsToHoursMinutes = function(miliseconds)
    {
        const h = Math.floor(miliseconds / 1000 / 60 / 60);
        const m = Math.floor((miliseconds / 1000 / 60 / 60 - h) * 60);
        const s = Math.floor(((miliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
    
        // To get time format 00:00:00
        const seconds = s < 10 ? `0${s}` : `${s}`;
        const minutes = m < 10 ? `0${m}` : `${m}`;
        const hours = h < 10 ? `0${h}` : `${h}`;
    
        return `${minutes}:${seconds}`;
    }

    DDO.CalculateScoreNoRoomReveal = async function()
    {
        //let file = "DDT_TEST-HOH_FINH.DDT";
        let file = "DDT_TEST-EO.DDT";
        //let file = "LOKKEN-HOH-1-30.DDT";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => 
        {
            if(xhttp.status == 404)
            {
                console.log("ERROR: Cannot find save file");
                return;
            }
            if(xhttp.status === 404)
            {
                console.log("ERROR: Cannot find save file");
                return;
            }
            if (xhttp.readyState === 4 && xhttp.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttp.responseText);     
                    console.log(json);                       
                }
                catch(e)
                {
                    return;
                }
                let score = DDO.ScoreCalculator.CalulcateCurrentScore(json[0], 90, 101);
                score += DDO.ScoreCalculator.CalculateMaxRoomReveal(json[0], 101); 

                document.getElementById("debugScore").innerText = score.toLocaleString();
            }
        };
        xhttp.open('GET', file, true);
        xhttp.send();    
    }
})()