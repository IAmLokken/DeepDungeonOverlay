'use strict'

;(function()
{

window.DDO = {};

DDO.SaveFiles = {
                    "the Palace of the Dead": [],
                    "Heaven-on-High": []
                };
DDO.Snapshot = {};
DDO.Beastiary = {};
DDO.DataElements = {};

DDO.ParsedLogNumbers = ['00', '12', '21', '22', '25', '26', '33', ];

DDO.playerName = "NULL";
DDO.playerJob = 0;
DDO.playerLevel = 1;

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

DDO.currentInstance = "NULL";
DDO.currentFloorStats = {};
DDO.currentFloorSetStats = {};
DDO.currentSaveFileIndex = 0;

DDO.currentTargetName = "NULL";
DDO.currentTargetID = "NULL";
DDO.currentTargetHPP = 100;

DDO.triggeredTraps = [];
DDO.enchantmentsApplied = [];

DDO.SetDefaultConfig = async function()
{
    DDO.Config = {};
    DDO.Config.scoreVisible = true;
    DDO.Config.pomandersVisible = true;
    DDO.Config.statsVisible = true;
    DDO.Config.beastiaryVisible = true;
    await callOverlayHandler({call: "saveData", key: "DDO_Config", data: JSON.stringify(DDO.Config)}); 
}

DDO.SaveConfig = async function()
{
    DDO.Config.scoreVisible = DDO.DataElements.ScoreCheckBoxValue.checked;
    DDO.Config.pomandersVisible = DDO.DataElements.PomandersCheckBoxValue.checked;
    DDO.Config.statsVisible = DDO.DataElements.StatisticsCheckBoxValue.checked;
    DDO.Config.beastiaryVisible = DDO.DataElements.BeastiaryCheckBoxValue.checked;
    await callOverlayHandler({call: "saveData", key: "DDO_Config", data: JSON.stringify(DDO.Config)}); 
}
DDO.LoadConfig = function(instanceName)
{
    DDO.currentInstance = instanceName;
    if (DDO.currentInstance.includes(DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceFloorsPOTD) ||
        DDO.currentInstance.includes(DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceFloorsHOH))
    {
        if (!DDO.isInGroup && !DDO.soloRunUnderway){
            DDO.LoadSoloConfig();
            DDO.currentFloorStats = {};
            DDO.currentFloorSetStats = {};
            DDO.soloRunUnderway = true;
            DDO.currentFloor = parseInt(DDO.currentInstance.substring(DDO.currentInstance.lastIndexOf(' ') + 1, DDO.currentInstance.lastIndexOf('-')));
            DDO.currentInstance = DDO.currentInstance.substring(0, DDO.currentInstance.indexOf('(')).trim();
            DDO.LoadSave();                    
        }else if (DDO.isInGroup && !DDO.groupRunUnderway){
            DDO.LoadPartyConfig();
            DDO.groupRunUnderway = true;
            DDO.currentFloor = parseInt(DDO.currentInstance.substring(DDO.currentInstance.lastIndexOf(' ') + 1, DDO.currentInstance.lastIndexOf('-')));
            DDO.currentInstance = DDO.currentInstance.substring(0, DDO.currentInstance.indexOf('(')).trim();
        }
        DDO.inbetweenArea = false;
    }
    else if (DDO.currentInstance == DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstancePOTD ||
            DDO.currentInstance == DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings.CurrentInstanceHOH){
        DDO.inbetweenArea = true;
    }
    else {
        DDO.soloRunUnderway = false;
        DDO.groupRunUnderway = false;
        DDO.LoadNonRunConfig(); 
        DDO.inbetweenArea = false;
    }
}
DDO.LoadSoloConfig = function()
{
    DDO.DataElements.ScoreCheckBoxValue.checked = DDO.Config.scoreVisible;
    DDO.DataElements.PomandersCheckBoxValue.checked = DDO.Config.pomandersVisible;
    DDO.DataElements.StatisticsCheckBoxValue.checked = DDO.Config.statsVisible;
    DDO.DataElements.BeastiaryCheckBoxValue.checked = DDO.Config.beastiaryVisible;

    DDO.EnableDisableElement(DDO.DataElements.ScoreCheckBoxValue.checked, 'score', false);
    DDO.EnableDisableElement(DDO.DataElements.PomandersCheckBoxValue.checked, 'pomanders', false);
    DDO.EnableDisableElement(DDO.DataElements.StatisticsCheckBoxValue.checked, 'statistics', false);
    DDO.EnableDisableElement(DDO.DataElements.BeastiaryCheckBoxValue.checked, 'targetinfo', false);

    DDO.EnableDisableElement(false, 'saveManager', false);
    DDO.EnableDisableElement(true, 'config', false);
}
DDO.LoadPartyConfig = function()
{
    DDO.DataElements.ScoreCheckBoxValue.checked = false;
    DDO.DataElements.PomandersCheckBoxValue.checked = false;
    DDO.DataElements.StatisticsCheckBoxValue.checked = false;
    DDO.DataElements.BeastiaryCheckBoxValue.checked = true;

    DDO.EnableDisableElement(DDO.DataElements.ScoreCheckBoxValue.checked, 'score', false);
    DDO.EnableDisableElement(DDO.DataElements.PomandersCheckBoxValue.checked, 'pomanders', false);
    DDO.EnableDisableElement(DDO.DataElements.StatisticsCheckBoxValue.checked, 'statistics', false);
    DDO.EnableDisableElement(DDO.DataElements.BeastiaryCheckBoxValue.checked, 'targetinfo', false);

    DDO.EnableDisableElement(false, 'saveManager', false);
}
DDO.LoadNonRunConfig = function()
{
    DDO.EnableDisableElement(false, 'config', false);
    DDO.EnableDisableElement(true, 'saveManager', false);
    DDO.EnableDisableElement(false, 'score', false);
    DDO.EnableDisableElement(false, 'pomanders', false);
    DDO.EnableDisableElement(false, 'statistics', false);
    DDO.EnableDisableElement(false, 'targetinfo', false);

    if (DDO.SaveFiles['the Palace of the Dead'].length > 0 )
        DDO.DataElements.POTDButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['POTDButton']} (${DDO.SaveFiles['the Palace of the Dead'].length})`;
    if (DDO.SaveFiles['Heaven-on-High'].length > 0 )
        DDO.DataElements.HOHButton.innerText = `${DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['HOHButton']} (${DDO.SaveFiles['Heaven-on-High'].length})`;
}

DDO.LoadSave = function()
{
    let saveFound = false;
    for (var i = 0; i < DDO.SaveFiles[DDO.currentInstance].length; i++)
    {
        if (DDO.SaveFiles[DDO.currentInstance][i].playerName == DDO.playerName &&
            DDO.SaveFiles[DDO.currentInstance][i].playerJob == DDO.playerJob &&
            DDO.SaveFiles[DDO.currentInstance][i].lastFloorCleared == DDO.currentFloor - 1)
        {
            DDO.currentSaveFileIndex = i;
            DDO.Snapshot = JSON.parse(JSON.stringify(DDO.SaveFiles[DDO.currentInstance][i]));
            saveFound = true;
        }
    }
    if (!saveFound){
        var newSave = {};
        newSave.playerName = DDO.playerName;
        newSave.playerJob = DDO.playerJob;
        newSave.deepDungeonName = DDO.currentInstance;
        newSave.lastFloorCleared = DDO.currentFloor - 1;
        newSave.floorStartedOn = DDO.currentFloor;
        newSave.totalKillCount = 0;
        newSave.floorKillCounts = new Array(20).fill(0);
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

        DDO.currentSaveFileIndex = DDO.SaveFiles[DDO.currentInstance].length;
        DDO.SaveFiles[DDO.currentInstance].push(newSave);        
        DDO.Snapshot = JSON.parse(JSON.stringify(newSave));
    }    

    let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];
    DDO.DataElements.MonstersFloorValue.innerText = 0;
    DDO.DataElements.MonstersSetValue.innerText = 0;
    DDO.DataElements.MonstersTotalValue.innerText = currentSave.totalKillCount;
    DDO.DataElements.MimicsFloorValue.innerText = 0;
    DDO.DataElements.MimicsSetValue.innerText = 0;
    DDO.DataElements.MimicsTotalValue.innerText = currentSave.currentMimicCount;
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

DDO.SaveRuns = function()
{
    callOverlayHandler({call: "saveData", key: "DDO_Saves", data: JSON.stringify(DDO.SaveFiles)});
}

DDO.EnableDisableElement = function(enabled, targetElement, saveConfig)
{
    var element = document.getElementById(targetElement);
    if (enabled)
        element.style.display = "";
    if (!enabled)
        element.style.display = "none";
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

DDO.UpdatePlayerInfo = async function()
{
    var combatants = await window.callOverlayHandler({ call: 'getCombatants', names: [DDO.playerName] });
    if (combatants.combatants.length > 0){
        DDO.playerJob = combatants.combatants[0].Job;
        DDO.playerLevel = combatants.combatants[0].Level;
        if (DDO.soloRunUnderway && !DDO.inbetweenArea)
            DDO.UpdateScore();
    }
}
DDO.TranslateUI = function()
{
    var translationElements = document.getElementsByClassName("Translate");

    for (var i=0; i<translationElements.length; i++){
        translationElements[i].innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings[translationElements[i].id];
    }

    if (DDO.SaveFiles['the Palace of the Dead'].length > 0 )
        DDO.DataElements.POTDButton.innerText += ` (${DDO.SaveFiles['the Palace of the Dead'].length})`;
    if (DDO.SaveFiles['Heaven-on-High'].length > 0 )
        DDO.DataElements.HOHButton.innerText += ` (${DDO.SaveFiles['Heaven-on-High'].length})`;
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

DDO.UpdateScore = function()
{
    console.log(DDO.playerLevel);
    console.log(DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex]);
    let score = DDO.ScoreCalculator.CalulcateCurrentScore(DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex], DDO.playerLevel, 101);

    let roomRevealAddition = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].deepDungeonName == "the Palace of the Dead" ? 
                             DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount * 316 : 
                             DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount * 211;
    score += roomRevealAddition;

    DDO.DataElements.ScoreValue.innerText = score.toLocaleString();
}

DDO.CalculateScoreNoRoomReveal = async function()
{
    let file = "DDT_TEST-HoH.DDT";
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
                console.log(json[0]);                       
            }
            catch(e)
            {
                return;
            }

            let score = DDO.ScoreCalculator.CalulcateCurrentScore(json[0], 70, 101);
            document.getElementById("debugScore").innerText = score.toLocaleString();
        }
    };

    xhttp.open('GET', file, true);
    xhttp.send();

    
}

})()