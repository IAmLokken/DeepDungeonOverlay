'use strict'

;(function(){

    DDO.ProcessLogLine = function(data){

        let lineType = data.line[0];
        if(lineType == '25'){
            DDO.ParseKill(data.line);
        }
        else if (lineType == '21' || lineType == '22'){
            DDO.ParsePomsAndTraps(data.line);
        }
        else if (lineType == '26'){
            DDO.ParseEnchantments(data.line);
        }
        else if (lineType == '33' || lineType == '34'){
            DDO.ParseChestsAndMap(data.line);
        }
        else if (lineType == '00'){
            DDO.ParseLogLineLocalized(data.line);
        }
        else if (lineType == '12'){
            DDO.UpdatePlayerInfo(); 
        }
        else if (lineType == '41'){
            DDO.ParseLogLine(data.line);
        }     
    }
    
    DDO.ParseKill = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let nameOfMob = data[3].toUpperCase();
        // Check for mimic
        if (nameOfMob == parseStrings.QuiveringCoffer || nameOfMob == parseStrings.Mimic){
            DDO.currentFloorStats.mimicCount++;
            DDO.currentFloorSetStats.mimicCount++;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount++;

            DDO.DataElements.MimicsFloorValue.innerText = `${DDO.currentFloorStats.mimicCount} (${DDO.currentFloorStats.korriganCount || 0})`;
            DDO.DataElements.MimicsSetValue.innerText = `${DDO.currentFloorSetStats.mimicCount} (${DDO.currentFloorSetStats.korriganCount || 0})`;
            DDO.DataElements.MimicsTotalValue.innerText = `${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount})`;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10), true, false);
            DDO.UpdateScore();
        }
        // Check for korrigan
        else if (nameOfMob == parseStrings.Korrigan || nameOfMob == parseStrings.Mandragora || nameOfMob == parseStrings.Pygmaioi || nameOfMob == parseStrings.OrthosKorrigan){
            DDO.currentFloorStats.korriganCount++;
            DDO.currentFloorSetStats.korriganCount++;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount++;

            DDO.DataElements.MimicsFloorValue.innerText = `${DDO.currentFloorStats.mimicCount || 0} (${DDO.currentFloorStats.korriganCount})`;
            DDO.DataElements.MimicsSetValue.innerText = `${DDO.currentFloorSetStats.mimicCount || 0} (${DDO.currentFloorSetStats.korriganCount})`;
            DDO.DataElements.MimicsTotalValue.innerText = `${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount})`;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10), true, false);
            DDO.UpdateScore();
        }
        // Check for rare mob
        else if (DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].RareMonsterNames.includes(nameOfMob)){
            DDO.currentFloorStats.rareKillCount++;
            DDO.currentFloorSetStats.rareKillCount++;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpecialKillCount++;

            DDO.DataElements.RareMonstersFloorValue.innerText = DDO.currentFloorStats.rareKillCount;
            DDO.DataElements.RareMonstersSetValue.innerText = DDO.currentFloorSetStats.rareKillCount;
            DDO.DataElements.RareMonstersTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpecialKillCount;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10), false, true);
            DDO.UpdateScore();
        }
        // Check for player death
        //else if (nameOfMob == DDO.playerName.toUpperCase()){
        else if (DDO.PlayerInGroup(nameOfMob) || nameOfMob == DDO.playerName.toUpperCase()){
            if (DDO.soloRunUnderway)
            {
                DDO.Console("DATA:: Death added.");
                DDO.Data.IncrementItemInFloorset("DEATHS");
            }
            if (DDO.raisingActive){
                DDO.raisingActive = false;
                DDO.Console("PARSE:: Death added.");
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRezCount++;
                DDO.UpdateScore();
            }
            else if (DDO.soloRunUnderway){                
                DDO.SaveFiles[DDO.currentInstance].splice(DDO.currentSaveFileIndex, 1);
                DDO.RunAbandoned = false;
                DDO.SaveRuns();
                DDO.Console("PARSE:: Run ended.");

                DDO.Data.SetItemInFloorset("TIMETOEXIT", 0);
                DDO.Data.SetItemInFloorset("KILLSTOOPENEXIT", 0);
                DDO.Data.SetItemInFloorset("KILLSTOOPENRETURN", 0);

                let endDate = (new Date()).toISOString();
                DDO.Console("DATA:: Run end date added. " + endDate);
                DDO.CurrentDataBlock.SaveFileDataSet["ENDTIME"] = endDate;

                //TODO: SEND DATASET
                DDO.Console(JSON.stringify(DDO.Data.GenerateDataObject()));
            }
            else if (DDO.groupRunUnderway)
            {
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRezCount++;
                DDO.UpdateScore();
            }
            return;
        }
        // Check for normal kill or boss kill
        else{
            // Kills on non-boss floors
            if(DDO.currentFloor % 10 != 0){
                DDO.AddKill(Math.floor(DDO.currentFloor / 10), false, false);
                DDO.UpdateScore();
            }
            // Kills on boss floor
            else{
                if (DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].BossNames.includes(nameOfMob)){
                    
                    DDO.AddKill(Math.floor(DDO.currentFloor / 10) - 1, false, false);
                    
                    DDO.DataElements.SpeedRunsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount;

                    // Update the last floor cleared
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].lastFloorCleared = DDO.currentFloor;

                    // Reset pomander settings
                    DDO.speedRunBonus = true;
                    DDO.ResetVariables();

                    DDO.UpdateScore();

                    // Save the run
                    DDO.SaveRuns();
                    DDO.RunAbandoned = false;
                    DDO.Snapshot = JSON.parse(JSON.stringify(DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex]));

                    let timeToExit = DDO.ConvertMilisecondsToHoursMinutes(Date.now() - DDO.FloorStartTime);
                
                    DDO.Data.SetItemInFloorset("TIMETOEXIT", timeToExit);
                    DDO.Data.SetItemInFloorset("KILLSTOOPENEXIT", 0);
                    DDO.Data.SetItemInFloorset("KILLSTOOPENRETURN", 0);

                    if ((DDO.currentInstance == "Heaven-on-High" || DDO.currentInstance == "Eureka Orthos") && DDO.currentFloor == 30)
                    {
                        let currentScore = DDO.DataElements.ScoreValue.innerText;
                        DDO.Console("DATA:: Score added. " + currentScore);
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR30SCORE"] = currentScore;
                    }
                    else if (DDO.currentInstance == "the Palace of the Dead" && DDO.currentFloor == 100)
                    {
                        let currentScore = DDO.DataElements.ScoreValue.innerText;
                        DDO.Console("DATA:: Score added. " + currentScore);
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR100SCORE"] = currentScore;
                    }
                    //TODO: SEND DATASET
                    DDO.Console(JSON.stringify(DDO.Data.GenerateDataObject()));
                }
            }
        }
    }

    DDO.ParsePomsAndTraps = function(data){
        let ID = data[4];
        let DemiID = data[2];
        if (DDO.TrapIDs.includes(ID))
        {
            let trapID = data[2];
            let trapName = DDO.TrapMap[ID];
            if (DDO.triggeredTraps.includes(trapID)) return;

            DDO.triggeredTraps.push(trapID);

            // If it is a detonator we dont want to add it as a trap, just decrement the chest count since it would have been incremented by opening the chest
            if (ID == DDO.TrapInfo.DetonatorTrapId)
            {
                DDO.currentFloorStats.chestCount--;
                DDO.currentFloorSetStats.chestCount--;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
                DDO.Console("PARSE:: Chest removed." + DDO.currentFloorStats.chestCount);
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 

                DDO.Console("DATA:: Chest removed.");
                DDO.Console("DATA:: Detonator added.");
                DDO.Data.SetItemInFloorset("CHESTS", DDO.currentFloorStats.chestCount);
                DDO.Data.IncrementItemInFloorset("DETONATOR");
            }
            // If it is a weapon or armour enhancement then we only want to track data on it, no score adjustment needed
            else if (ID == DDO.TrapInfo.WeaponEnhancementTrapId || ID == DDO.TrapInfo.GearEnhancementTrapId)
            {
                DDO.Console("DATA:: Aetherpool added.");
                DDO.Data.IncrementItemInFloorset("AETHERPOOL");
            }
            // Otherwise process the trap
            else 
            {
                DDO.currentFloorStats.trapsTriggered++;
                DDO.currentFloorSetStats.trapsTriggered++;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered++;
                DDO.Console("PARSE:: Trap added.");

                DDO.DataElements.TrapsFloorValue.innerText = DDO.currentFloorStats.trapsTriggered;
                DDO.DataElements.TrapsSetValue.innerText = DDO.currentFloorSetStats.trapsTriggered;
                DDO.DataElements.TrapsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered;

                DDO.Console("DATA:: Trap added.");
                DDO.Console("DATA:: Trap " + trapName + " added.");
                DDO.Data.SetItemInFloorset("TRAPS", DDO.currentFloorStats.trapsTriggered);
                DDO.Data.IncrementItemInFloorset(trapName.toUpperCase());
            }  

            DDO.UpdateScore();
        }
        else if (DDO.PomanderIDs.includes(ID))
        {
            let pomanderTimeStamp = data[1];
            let pomanderName = DDO.PomanderMap[ID];
            if (DDO.usedPomanders.includes(pomanderTimeStamp)) return;

            DDO.usedPomanders.push(pomanderTimeStamp);

            if (ID == DDO.PomanderInfo.PomanderOfSight && !DDO.sightActive){
                DDO.sightActive = true;
                DDO.DataElements.PomSightDisabledImage.style.display = "none";
                DDO.DataElements.PomSightEnabledImage.style.display = "";
                
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMapRevealCount++;

                // Remove any revealed room credit for this floor since player will get full score for revealing map
                if(DDO.currentFloorStats.roomRevealCount){
                    DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                }
                DDO.currentFloorStats.roomRevealCount = 0;
                DDO.UpdateScore();
            }
            else if(ID == DDO.PomanderInfo.PomanderOfSafety && !DDO.safetyActive){
                DDO.DataElements.PomSafetyDisabledImage.style.display = "none";
                DDO.DataElements.PomSafetyEnabledImage.style.display = "";
            }
            else if (ID == DDO.PomanderInfo.PomanderOfAffluence){
                DDO.affluenceActive = true;
            }
            else if (ID == DDO.PomanderInfo.PomanderOfAlteration){
                DDO.alterationActive = true;
            }
            else if (ID == DDO.PomanderInfo.PomanderOfFlight){
                DDO.flightActive = true;
            }
            // If a Serenity is used we decrement enchantment counts, assuming we have any
            else if (ID == DDO.PomanderInfo.PomanderOfSerenity && DDO.currentFloorStats.enchantmentCount){
                DDO.currentFloorSetStats.enchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.currentFloorStats.enchantmentCount = 0;
                DDO.Console("PARSE:: Enchantment(s) removed.");

                DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
                DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
                DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
                DDO.UpdateScore();

                DDO.Data.SetItemInFloorset("ENCHANTMENTS", 0);
                DDO.Data.ClearFloorEnchantments();
                DDO.Console("DATA:: Enchantment(s) removed.");
            }
            else if (ID == DDO.PomanderInfo.PomanderOfRaising){
                DDO.raisingActive = true;
            }
            else if (DDO.MagiciteIDs.includes(ID))
            {
                DDO.Console("DATA:: Magicite used.");
                DDO.Console("DATA:: Magicite used. " + pomanderName)
                DDO.Data.IncrementItemInFloorset("MAGICITE-USED");    
                DDO.Data.IncrementItemInFloorset(pomanderName.toUpperCase() + "-USED");
            }

            DDO.Console("DATA:: Pomander used.");
            DDO.Console("DATA:: Pomander " + pomanderName + " used.");
            DDO.Data.IncrementItemInFloorset("POMANDERS-USED");
            DDO.Data.IncrementItemInFloorset(pomanderName.toUpperCase() + "-USED");
        }
        else if (DDO.AnimalIDs.includes(ID))
        {
            let animalName = DDO.AnimalMap[ID];
            DDO.Console("DATA:: Animal buff added.");
            DDO.Console("DATA:: Animal " + animalName + " added.")
            DDO.Data.IncrementItemInFloorset("ANIMALBUFF");
            DDO.Data.IncrementItemInFloorset(animalName.toUpperCase());
        }
    }

    DDO.ParseEnchantments = function(data){
        let ID = data[2];

        if(DDO.EnchantmentIds.includes(ID) && data[5] == 'E0000000')
        {
            if (DDO.enchantmentsApplied.includes(ID)) return;
            DDO.enchantmentsApplied.push(data[2]);

            let enchantmentName = DDO.EnchantmentMap[ID];

            DDO.currentFloorStats.enchantmentCount++;
            DDO.currentFloorSetStats.enchantmentCount++;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount++;
            DDO.Console("PARSE:: Enchantment added.");

            DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
            DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
            DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;    
            DDO.UpdateScore();   
            
            DDO.Console("DATA:: Enchantment added.");
            DDO.Console("DATA:: Enchantment " + enchantmentName + " added.");
            DDO.Data.SetItemInFloorset("ENCHANTMENTS", DDO.currentFloorStats.enchantmentCount);
            DDO.Data.IncrementItemInFloorset(enchantmentName.toUpperCase());
        }
        else if (ID == DDO.RehabilitationID)
        {
            DDO.Console("DATA:: Rehabilitation added.");
            DDO.Data.IncrementItemInFloorset("REHABILITATION");
        }
    }

    DDO.ParseChestsAndMap = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        if(data[2].includes('8003') && data[0] == '33'){
            if(data[3] == '10000004' && DDO.currentFloor % 10 > 0){
                if (!DDO.sightActive){                
                    DDO.currentFloorStats.roomRevealCount++;
                    DDO.currentFloorSetStats.roomRevealCount++;
                    DDO.EvaluateMap(false);
                    
                    DDO.UpdateScore();
                }
            }
            else if (data[3] == '10000007' && data[6] == 'FF'){
                DDO.currentFloorStats.chestCount++;
                DDO.currentFloorSetStats.chestCount++;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount++;
                DDO.Console("PARSE:: Chest added. " + DDO.currentFloorStats.chestCount);
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
                DDO.UpdateScore();

                DDO.Console("DATA:: Chest added.");
                DDO.Data.SetItemInFloorset("CHESTS", DDO.currentFloorStats.chestCount);
            }
        }
        else if (data[0] == '34' && data[3].toUpperCase() == parseStrings.BandedCoffer)
        {
            DDO.currentFloorStats.chestCount--;
            DDO.currentFloorSetStats.chestCount--;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
            DDO.Console("PARSE:: Remove intuition chest. " + DDO.currentFloorStats.chestCount);

            DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
            DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
            DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
            DDO.UpdateScore();

            DDO.Console("DATA:: Hoard looted.")
            DDO.Console("DATA:: Chest removed.");
            DDO.Data.SetItemInFloorset("CHESTS", DDO.currentFloorStats.chestCount);
            DDO.Data.IncrementItemInFloorset("HOARD");
        }
    }

    DDO.ParseLogLine = function(data){
        let param0 = data[3];
        let param2 = data[5];
        
        if (DDO.LogLineIDs.includes(param0))
        {
            // Beacon/Cairn of Passage is activated
            if (param0 == "1C4D")
            {
                let timeToOpen = DDO.ConvertMilisecondsToHoursMinutes(Date.now() - DDO.FloorStartTime);
                DDO.keyOpen = true;
                DDO.Data.SetItemInFloorset("TIMETOOPEN", timeToOpen);
                DDO.Data.SetItemInFloorset("KILLSTOOPENEXIT", DDO.currentFloorStats.killCount);
                DDO.Console("DATA:: Passage opened. " + " Kills to open: " + DDO.currentFloorStats.killCount + " Time to open: " + timeToOpen);
            }
            else if (param0 == "1C4A")
            {
                DDO.returnOpen = true;
                DDO.Console("DATA:: Return opened." + " Kills to open: " + DDO.currentFloorStats.killCount);
                DDO.Data.SetItemInFloorset("KILLSTOOPENRETURN", DDO.currentFloorStats.killCount);
            }
            else if (param0 == "1C37")
            {
                DDO.currentFloorStats.chestCount--;
                DDO.currentFloorSetStats.chestCount--;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
                DDO.Console("PARSE:: Mimics don't count as chests." + DDO.currentFloorStats.chestCount);
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount;
                DDO.UpdateScore();

                DDO.Data.SetItemInFloorset("CHESTS", DDO.currentFloorStats.chestCount);
                DDO.Console("DATA:: Mimic found, decrementing chests.");
            }
            else if (param0 == "1C6F")
            {
                DDO.DataElements.SpeedRunsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount;
                // Update the last floor cleared
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].lastFloorCleared = DDO.currentFloor;
                
                let timeToExit = DDO.ConvertMilisecondsToHoursMinutes(Date.now() - DDO.FloorStartTime);
                
                DDO.Data.SetItemInFloorset("TIMETOEXIT", timeToExit);
                DDO.Data.SetItemInFloorset("KILLSTOOPENEXIT", 0);
                DDO.Data.SetItemInFloorset("KILLSTOOPENRETURN", 0);

                // Reset pomander settings
                DDO.speedRunBonus = true;
                DDO.triggerAffluence = false;
                DDO.triggerAlteration = false;
                DDO.triggerFlight = false;
                DDO.safetyActive = false;
                DDO.affluenceActive = false;
                DDO.alterationActive = false;
                DDO.flightActive = false;
                DDO.sightActive = false;
                DDO.raisingActive = false;
                DDO.keyOpen = false;
                DDO.returnOpen = false;

                DDO.UpdateScore();
                DDO.RunAbandoned = false;

                // Save the run
                DDO.SaveRuns();

                let endDate = (new Date()).toISOString();
                let currentScore = DDO.DataElements.ScoreValue.innerText;
                DDO.Console("DATA:: Run end date added. " + endDate);
                DDO.Console("DATA:: Final score added. " + currentScore);
                DDO.CurrentDataBlock.SaveFileDataSet["ENDTIME"] = endDate;
                switch(param2)
                {
                    case "5A89":
                        DDO.Console("DATA:: Empyrian Reliquary obtained.");
                        DDO.Console("DATA:: Final floor set. 100");
                        DDO.CurrentDataBlock.SaveFileDataSet["REWARD"] = "Empyrian Reliquary";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOORENDED"] = "100";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR100SCORE"] = currentScore;
                        break;
                    case "3F29":
                        DDO.Console("DATA:: Glass Pumpkin obtained.");
                        DDO.Console("DATA:: Final floor set. 200");
                        DDO.CurrentDataBlock.SaveFileDataSet["REWARD"] = "Glass Pumpkin";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOORENDED"] = "200";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR200SCORE"] = currentScore;
                        break;
                    case "3F28":
                        DDO.Console("DATA:: Firecrest obtained.");
                        DDO.Console("DATA:: Final floor set. 200");
                        DDO.CurrentDataBlock.SaveFileDataSet["REWARD"] = "Firecrest";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOORENDED"] = "200";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR200SCORE"] = currentScore;
                        break;
                    case "981E":
                        DDO.Console("DATA:: Orthos Tomestone.");
                        DDO.Console("DATA:: Final floor set. 100");
                        DDO.CurrentDataBlock.SaveFileDataSet["REWARD"] = "Orthos Tomestone";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOORENDED"] = "100";
                        DDO.CurrentDataBlock.SaveFileDataSet["FLOOR100SCORE"] = currentScore;
                        break;
                    default:
                        break;
                }
                //TODO: SEND DATASET
                DDO.Console(JSON.stringify(DDO.Data.GenerateDataObject()));
            }
            else if (param0 == "1C50")
            {
                let timeToExit = DDO.ConvertMilisecondsToHoursMinutes(Date.now() - DDO.FloorStartTime);
                DDO.Data.SetItemInFloorset("TIMETOEXIT", timeToExit);
                DDO.Console("DATA:: Exiting Floor. " + timeToExit)
                DDO.OutputCurrentFloorData();

                if (!DDO.sightActive){
                    DDO.EvaluateMap(true);
                }
                DDO.currentFloor++;
                let nextFloor = DDO.currentFloor % 10 > 0 ? DDO.currentFloor % 10 : 10;
                DDO.CurrentFloorSetDataSet["FLOORDATA"][nextFloor] = {}; // create our floor object for the next floor
                DDO.CurrentFloorSetDataSet["FLOORDATA"][nextFloor]["RUNID"] = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].ID; // set the run id for this floorset 

                DDO.DataElements.PomSafetyDisabledImage.style.display = "";
                DDO.DataElements.PomSafetyEnabledImage.style.display = "none";
                DDO.DataElements.PomSightDisabledImage.style.display = "";
                DDO.DataElements.PomSightEnabledImage.style.display = "none";

                DDO.sightActive = false;
                DDO.keyOpen = false;
                DDO.returnOpen = false;

                if(DDO.flightActive){
                    DDO.flightActive = false;
                    DDO.DataElements.PomFlightEnabledImage.style.display = "";
                    DDO.DataElements.PomFlightDisabledImage.style.display = "none";
                }
                else{
                    DDO.DataElements.PomFlightEnabledImage.style.display = "none";
                    DDO.DataElements.PomFlightDisabledImage.style.display = "";
                }
                if(DDO.affluenceActive){
                    DDO.affluenceActive = false;
                    DDO.DataElements.PomAffluenceEnabledImage.style.display = "";
                    DDO.DataElements.PomAffluenceDisabledImage.style.display = "none";
                }
                else{
                    DDO.DataElements.PomAffluenceEnabledImage.style.display = "none";
                    DDO.DataElements.PomAffluenceDisabledImage.style.display = "";
                }
                if(DDO.alterationActive){
                    DDO.alterationActive = false;
                    DDO.DataElements.PomAlterationEnabledImage.style.display = "";
                    DDO.DataElements.PomAlterationDisabledImage.style.display = "none";
                }
                else{
                    DDO.DataElements.PomAlterationEnabledImage.style.display = "none";
                    DDO.DataElements.PomAlterationDisabledImage.style.display = "";
                }
                DDO.triggeredTraps = [];
                DDO.enchantmentsApplied = [];
                DDO.ClearFloorValues();

                //Give credit for spawn room.
                if (DDO.currentFloor % 10 > 0){
                    DDO.currentFloorStats.roomRevealCount++;
                    DDO.currentFloorSetStats.roomRevealCount++;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].roomRevealCounts[Math.floor(DDO.currentFloor / 10)]
                }
                clearInterval(DDO.ticker);
                DDO.EnableDisableElement(false, "timer", false);

                DDO.DataElements.MonstersFloorValue.innerText = 0;
                DDO.DataElements.MimicsFloorValue.innerText = 0;
                DDO.DataElements.TrapsFloorValue.innerText = 0;
                DDO.DataElements.ChestsFloorValue.innerText = 0;
                DDO.DataElements.EnchantmentsFloorValue.innerText = 0;
                DDO.DataElements.RareMonstersFloorValue.innerText = 0;

                DDO.UpdateScore();
            }
            else if (param0 == "1C34" || param0 == "1C35")
            {
                console.log(param2);
                let processPomander = function(pomander)
                {
                    DDO.Data.IncrementItemInFloorset(pomander + "-LOOTED");
                    DDO.Data.IncrementItemInFloorset("POMANDER-LOOTED");
                    DDO.Console("DATA:: Pomander looted.");
                    DDO.Console("DATA:: Pomander looted. " + pomander);
                }
                switch(param2){
                    case "01":
                    case "17":
                        processPomander("SAFETY");
                        break;
                    case "02":
                    case "18":
                        processPomander("SIGHT");
                        break;
                    case "03":
                    case "19":
                        processPomander("STRENGTH");
                        break;
                    case "04":
                    case "1A":
                        processPomander("STEEL");
                        break;
                    case "05":
                    case "1B":
                        processPomander("AFFLUENCE");
                        break;
                    case "06":
                    case "1C":
                        processPomander("FLIGHT");
                        break;
                    case "07":
                    case "1D":
                        processPomander("ALTERATION");
                        break;
                    case "08":
                    case "1E":
                        processPomander("PURITY");
                        break;
                    case "09":
                    case "1F":
                        processPomander("FORTUNE");
                        break;
                    case "0A":
                    case "20":
                        processPomander("WITCHING");
                        break;
                    case "0B":
                    case "21":
                        processPomander("SERENITY");
                        break;
                    case "0C":
                        processPomander("RAGE");
                        break;
                    case "11":
                        processPomander("FRAILTY");
                        break;
                    case "0D":
                        processPomander("LUST");
                        break;
                    case "12":
                        processPomander("CONCEALMENT");
                        break;
                    case "0E":
                    case "22":
                        processPomander("INTUITION");
                        break;
                    case "0F":
                    case "23":
                        processPomander("RAISING");
                        break;
                    case "10":
                        processPomander("RESOLUTION");
                        break;
                    case "13":
                        processPomander("PETRIFICATION");
                        break;
                    case "14":
                        processPomander("LETHARGY");
                        break;
                    case "15":
                        processPomander("STORMS");
                        break;
                    case "16":
                        processPomander("DREADNAUGHT");
                        break;
                    default:
                        break;
                }
            }
            else if (param0 == "1C56")
            {
                let param3 = data[6];
                let pomanderName = "";
                switch(param3)
                {
                    case "14": 
                        pomanderName = "Lethargy";
                        break;
                    case "15": 
                        pomanderName = "Storms";
                        break;
                    case "16": 
                        pomanderName = "Dreadnaught";
                        break;
                    default:
                        break;
                }
                
                DDO.Console("DATA:: Pomander used.");
                DDO.Console("DATA:: Pomander " + pomanderName + " used.");
                DDO.Data.IncrementItemInFloorset("POMANDERS-USED");
                DDO.Data.IncrementItemInFloorset(pomanderName.toUpperCase() + "-USED");

            }
            else if (param0 == "23F6")
            {
                let processPomander = function(magicite)
                {
                    DDO.Data.IncrementItemInFloorset(magicite + "-LOOTED");
                    DDO.Data.IncrementItemInFloorset("MAGICITE-LOOTED");
                    DDO.Data.IncrementItemInFloorset("POMANDER-LOOTED");
                    DDO.Console("DATA:: Pomander looted.");
                    DDO.Console("DATA:: Magicite looted.");
                    DDO.Console("DATA:: Magicite looted. " + magicite);
                }
                switch(param2){
                    case "01":
                        processPomander("INFERNO");
                        break;
                    case "02":
                        processPomander("CRAG");
                        break;
                    case "03":
                        processPomander("VORTEX");
                        break;
                    case "04":
                        processPomander("ELDER");
                        break;
                    default:
                        break;
                }
            }
            else if (param0 == "282E" || param0 == "282D")
            {
                let processPomander = function(demiclone)
                {
                    DDO.Data.IncrementItemInFloorset(demiclone + "-LOOTED");
                    DDO.Data.IncrementItemInFloorset("DEMICLONE-LOOTED");
                    DDO.Data.IncrementItemInFloorset("POMANDER-LOOTED");
                    DDO.Console("DATA:: Pomander looted.");
                    DDO.Console("DATA:: Demiclone looted.");
                    DDO.Console("DATA:: Demiclone looted. " + demiclone);
                }
                switch(param2){
                    case "01":
                        processPomander("UNEI");
                        break;
                    case "02":
                        processPomander("DOGA");
                        break;
                    case "03":
                        processPomander("ONIONKNIGHT");
                        break;
                    default:
                        break;
                }
            }
            else if (param0 == "2830")
            {
                let param3 = data[6];
                let pomanderName = "";
                switch(param3)
                {
                    case "01": 
                        pomanderName = "Unei";
                        break;
                    case "02": 
                        pomanderName = "Doga";
                        break;
                    case "03": 
                        pomanderName = "Onion Knight";
                        break;
                    default:
                        break;
                }

                DDO.Console("DATA:: Demiclone used.");
                DDO.Console("DATA:: Demiclone used. " + pomanderName)
                DDO.Data.IncrementItemInFloorset("DEMICLONE-USED");    
                DDO.Data.IncrementItemInFloorset(pomanderName.toUpperCase() + "-USED");
            }
        }
    }

    DDO.ParseLogLineLocalized = function(data){
        let ID = data[2];
        if (ID == "083E" || ID == "0839" || ID == "083C")
        {
            let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
            let logMessage = data[4].toUpperCase();

            if (logMessage.includes(parseStrings.ThirtyMinutesRemaining)){
                DDO.speedRunBonus = false;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount--;
                DDO.DataElements.SpeedRunsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount;
                DDO.UpdateScore();
            }
            else if (logMessage.includes(parseStrings.Gloom)){
                DDO.currentFloorStats.enchantmentCount++;
                DDO.currentFloorSetStats.enchantmentCount++;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount++;
                DDO.Console("PARSE:: Enchantment added.");

                DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
                DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
                DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
                DDO.UpdateScore();

                DDO.Console("DATA:: Enchantment added.");
                DDO.Console("DATA:: Enchantment Gloom added.");
                DDO.Data.SetItemInFloorset("ENCHANTMENTS", DDO.currentFloorStats.enchantmentCount);
                DDO.Data.IncrementItemInFloorset("GLOOM");
            }
            else if (logMessage.includes(parseStrings.ZoneIn) || ((logMessage.includes(parseStrings.PotDFloor) || logMessage.includes(parseStrings.HoHFloor)) && /\d/.test(logMessage) && !/\d-/.test(logMessage) && !/\d~/.test(logMessage))){
                let val = parseInt(logMessage.replace(/\D/g,' ').trim().split(' ')[0]);
                if ((val % 10 > 0 && DDO.currentInstance != 'Eureka Orthos') ||
                    (val % 10 > 0 && val < 99 && DDO.currentInstance == 'Eureka Orthos')
                ){
                    if (val % 10 == 1){
                        DDO.InitiateTimer(0, val);
                    }else {
                        DDO.InitiateTimer(-5, val);
                    }
                    DDO.EnableDisableElement(true, "timer", false);
                }

                if (logMessage.includes(parseStrings.ZoneIn))
                {
                    DDO.Data.CreateSaveFileDataSet(); // create the save data object with info about the current run
                    DDO.Data.CreateFloorsetDataSet(val + "-" + (val+9)); //create the floorset data object with info about the current floorset data
                    DDO.CurrentFloorSetDataSet["FLOORDATA"]["1"] = {}; // create our floor object for this next floor
                    DDO.CurrentFloorSetDataSet["FLOORDATA"]["1"]["RUNID"] = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].ID; // set the run id for this floorset 
                }

                DDO.FloorStartTime = Date.now();
            }
            else if (logMessage.includes(parseStrings.PossessPhoenixDown))
            {
                DDO.Console("DATA:: Phoenix down added (unlooted).");
                DDO.Data.IncrementItemInFloorset("PHOENIXDOWN");
            }
            else if (logMessage.includes(parseStrings.Obtain))
            {
                if (logMessage.includes(parseStrings.Potsherd) || logMessage.includes(parseStrings.Fragment))
                {
                    DDO.Console("DATA:: Potsherd added.");
                    DDO.Data.IncrementItemInFloorset("POTSHERD");
                }
                else if (logMessage.includes(parseStrings.Potion))
                {
                    let count = 1;
                    if (/\d/.test(logMessage))
                        count = parseInt(logMessage.replace(/\D/g,' ').trim().split(' ')[0]);
                    DDO.Console("DATA:: Potion added. " + count);
                    DDO.Data.IncrementItemInFloorset("POTION", count);
                }
                else if (logMessage.includes(parseStrings.PhoenixDown))
                {
                    DDO.Console("DATA:: Phoenix down added (looted).");
                    DDO.Data.IncrementItemInFloorset("PHOENIXDOWN");
                }
            }
        }
    }

    DDO.AddKill = function(floorSet, isMimic, isRare){
        DDO.currentFloorStats.killCount++;
        DDO.currentFloorSetStats.killCount++;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].totalKillCount++;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].floorKillCounts[floorSet]++;
        DDO.Console("PARSE:: Kill added.");
        DDO.Data.SetItemInFloorset("KILLS", DDO.currentFloorStats.killCount);
        DDO.Console("DATA:: Kill added.");
        if (!DDO.keyOpen){
            DDO.Data.SetItemInFloorset("KILLSTOOPENEXIT", DDO.currentFloorStats.killCount);
            DDO.Console("DATA:: Kills to open exit increased.");
        }
        if (!DDO.returnOpen){
            DDO.Data.SetItemInFloorset("KILLSTOOPENRETURN", DDO.currentFloorStats.killCount);
            DDO.Console("DATA:: Kills to open return increased.");
        }
        if (isMimic)
        {
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].mimicKillCounts[floorSet]++;
            DDO.Console("PARSE:: Mimic/Korrigan kill added.");
            DDO.Data.SetItemInFloorset("MIMICS", DDO.currentFloorStats.mimicCount);
            DDO.Data.SetItemInFloorset("KORRIGANS", DDO.currentFloorStats.korriganCount);
            DDO.Console("DATA:: Mimic/Korrigan kill added.");
        }
        if (isRare){
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].rareKillCounts[floorSet]++;
            DDO.Console("PARSE:: Rare kill added.");
            DDO.Data.SetItemInFloorset("RARE", DDO.currentFloorStats.rareKillCount);
            DDO.Console("DATA:: Rare kill added.");
        }

        DDO.DataElements.MonstersFloorValue.innerText = DDO.currentFloorStats.killCount;
        DDO.DataElements.MonstersSetValue.innerText = DDO.currentFloorSetStats.killCount;
        DDO.DataElements.MonstersTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].totalKillCount;
    }

    DDO.EvaluateMap = function(evaluateMin){
        if (DDO.currentFloorStats.roomRevealCount == 0 || DDO.sightActive) return; // this function shouldnt be called if these conditions are true but just in case

        let floorSetIndex = Math.floor(DDO.currentFloor / 10);
        let currentSave = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex];

        let range = currentSave.deepDungeonName == 'the Palace of the Dead' ? DDO.RoomRangesPOTD[floorSetIndex].split(':').map(Number) : DDO.RoomRangesHOH[floorSetIndex].split(':').map(Number);
        //if (!evaluateMin)
            //console.log('We have a map reveal with range: ' + range);
        //else
            //console.log('We have completed the floor with range: ' + range);
        
        if (DDO.currentFloorStats.roomRevealCount == range[1] || DDO.currentFloorStats.roomRevealCount == 12){
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].roomRevealCounts[floorSetIndex] = Math.max(0, currentSave.roomRevealCounts[floorSetIndex] - DDO.currentFloorStats.roomRevealCount);
            DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
            DDO.currentFloorStats.roomRevealCount = 0;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMapRevealCount++;
        }
        // Only pass evaluateMin as true when we are transfering and we know we will not uncover anymore rooms on the current floor
        else if (evaluateMin){
            if (DDO.currentFloorStats.roomRevealCount < range[0] || DDO.currentFloorStats.roomRevealCount > 8){
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].roomRevealCounts[floorSetIndex] = Math.max(0, currentSave.roomRevealCounts[floorSetIndex] - DDO.currentFloorStats.roomRevealCount);
            }
            else {
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].roomRevealCounts[floorSetIndex] += DDO.currentFloorStats.roomRevealCount;
            }
        }
    }

})()