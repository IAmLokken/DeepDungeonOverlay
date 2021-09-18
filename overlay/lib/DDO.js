'use strict'

;(function()
{

window.DDO = {};

DDO.SaveFiles = {};
DDO.Snapshot = {};
DDO.Beastiary = {};
DDO.DataElements = {};

DDO.ParsedLogNumbers = ['00', '21', '22', '25', '26', '33', ];

DDO.playerName = "NULL";
DDO.playerJob = 0;

DDO.triggerAffluence = true;
DDO.triggerAlteration = false;
DDO.triggerFlight = true;
DDO.safetyActive = false;
DDO.affluenceActive = false;
DDO.alterationActive = false;
DDO.flightActive = false;
DDO.sightActive = true;
DDO.raisingActive = false;

DDO.currentFloor = 0;
DDO.speedRunBonus = true;
DDO.isInGroup = false;
DDO.runUnderway = false;

DDO.currentInstance = "NULL";
DDO.currentFloorStats = {};
DDO.currentFloorSetStats = {};
DDO.currentSaveFileIndex = 0;

DDO.currentTargetName = "NULL";
DDO.currentTargetID = "NULL";
DDO.currentTargetHPP = 100;

DDO.triggeredTraps = [];

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

DDO.LoadConfig = async function()
{
    DDO.DataElements.ScoreCheckBoxValue.checked = DDO.Config.scoreVisible;
    DDO.DataElements.PomandersCheckBoxValue.checked = DDO.Config.pomandersVisible;
    DDO.DataElements.StatisticsCheckBoxValue.checked = DDO.Config.statsVisible;
    DDO.DataElements.BeastiaryCheckBoxValue.checked = DDO.Config.beastiaryVisible;

    DDO.EnableDisableElement(DDO.DataElements.ScoreCheckBoxValue, 'score', false);
    DDO.EnableDisableElement(DDO.DataElements.PomandersCheckBoxValue, 'pomanders', false);
    DDO.EnableDisableElement(DDO.DataElements.StatisticsCheckBoxValue, 'statistics', false);
    DDO.EnableDisableElement(DDO.DataElements.BeastiaryCheckBoxValue, 'targetinfo', false);
}

DDO.LoadSave = function()
{
    for (var i = 0; i < DDO.SaveFiles.length; i++)
    {
        if (DDO.SaveFiles[i].playerName == DDO.playerName &&
            DDO.SaveFiles[i].playerJob == DDO.playerJob &&
            DDO.SaveFiles[i].lastFloorCleared == DDO.currentFloor - 1 &&
            DDO.SaveFiles[i].deepDungeonName == DDO.currentInstance)
        {
            DDO.currentSaveFileIndex = i;
            DDO.Snapshot = JSON.parse(JSON.stringify(DDO.SaveFiles[i]));
        }
        else if (DDO.SaveFiles.length == 0 || i == DDO.SaveFiles.length -1 )
        {
            var newSave = {};
            newSave.playerName = DDO.playerName;
            newSave.playerJob = DDO.playerJob;
            newSave.deepDungeonName = DDO.currentInstance;
            newSave.lastFloorCleared = DDO.currentFloor - 1;
            newSave.floorStartedOn = DDO.currentFloor;
            newSave.totalKillCount = 0;
            newSave.floorKillCounts = new Array(20);
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

            DDO.SaveFiles.push(newSave);
            DDO.currentSaveFileIndex = i;
            DDO.Snapshot = JSON.parse(JSON.stringify(newSave));
        }
    }

    let currentSave = DDO.SaveFiles[DDO.currentSaveFileIndex];
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

DDO.EnableDisableElement = function(checkbox, targetElement, saveConfig)
{
    var element = document.getElementById(targetElement);
    if (checkbox.checked)
        element.style.display = "";
    if (!checkbox.checked)
        element.style.display = "none";
    if (saveConfig)
        DDO.SaveConfig();
}


})()