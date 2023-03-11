'use strict'

;(function()
{
    DDO.Data.CreateSaveFileDataSet = function()
    {
        let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];
        let dataBlock =
        {
            "RUNID": currentSave.ID,
            "GROUPRUN": DDO.groupRunUnderway,
            "PLAYERNAME": DDO.groupRunUnderway ? JSON.stringify(DDO.Players) : DDO.playerName,
            "STARTTIME": currentSave.StartDate,
            "ENDTIME": "",
            "DUNGEONNAME": currentSave.deepDungeonName,
            "JOB": DDO.Data.JobIDs[currentSave.playerJob],
            "FLOORSTARTED":currentSave.floorStartedOn,
            "FLOORENDED":"",
            "FLOOR30SCORE":"",
            "FLOOR100SCORE":"",
            "FLOOR200SCORE":"",
            "SERVER":currentSave.playerWorld,
            "REWARD": ""
        };

        DDO.CurrentDataBlock = {};
        DDO.CurrentDataBlock.SaveFileDataSet = dataBlock;
    }
    DDO.Data.CreateFloorsetDataSet = function(floorset)
    {
        let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];
        
        DDO.CurrentFloorSetDataSet =
        {
            "RUNID": currentSave.ID,
            "DUNGEONNAME:": currentSave.deepDungeonName,
            "FLOORSET": floorset,
            "FLOORDATA": {}
        }
    }

    DDO.Data.SetItemInFloorset = function(item, value)
    {
        let floorNumber = DDO.currentFloor % 10 > 0 ? DDO.currentFloor % 10 : 10;
        DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber][item] = value;
    }
    DDO.Data.IncrementItemInFloorset = function(item, count = 1)
    {
        let floorNumber = DDO.currentFloor % 10 > 0 ? DDO.currentFloor % 10 : 10;
        DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber][item] = !DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber][item] ? count : DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber][item] + count;
    }
    DDO.Data.ClearFloorEnchantments = function()
    {
        let floorNumber = DDO.currentFloor % 10 > 0 ? DDO.currentFloor % 10 : 10;
        let myFunction = function(item)
        {
            let enchantmentName = DDO.EnchantmentMap[item];
            DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber][enchantmentName.toUpperCase()] = 0;
        }
        DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber]["GLOOM"] = 0;
        DDO.EnchantmentIds.forEach(myFunction);
    }
    DDO.OutputCurrentFloorData = function()
    {
        let floorNumber = DDO.currentFloor % 10 > 0 ? DDO.currentFloor % 10 : 10;
        DDO.Console(JSON.stringify(DDO.CurrentFloorSetDataSet["FLOORDATA"][floorNumber]));
    }

    DDO.Data.GenerateDataObject = function()
    {
        return { "FILE" : DDO.CurrentDataBlock.SaveFileDataSet,
                 "FLOORS" : DDO.CurrentFloorSetDataSet};
    }

    DDO.Data.JobIDs = 
    {
        "1":"GLA",
        "2":"PGL",
        "3":"MRD",
        "4":"LNC",
        "5":"ARC",
        "6":"CNJ",
        "7":"THM",
        "19":"PLD",
        "20":"MNK",
        "21":"WAR",
        "22":"DRG",
        "23":"BRD",
        "24":"WHM",
        "25":"BLM",
        "26":"ACN",
        "27":"SMN",
        "28":"SCH",
        "29":"ROG",
        "30":"NIN",
        "31":"MCH",
        "32":"DRK",
        "33":"AST",
        "34":"SAM",
        "35":"RDM",
        "36":"BLU", //LOL
        "37":"GNB",
        "38":"DNC",
        "39":"RPR",
        "40":"SGE"
    }
})()    