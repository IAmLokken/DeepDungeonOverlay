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
            DDO.ParseLogLine(data.line);
        }
        else if (lineType == '12'){
            DDO.UpdatePlayerInfo(); 
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
        else if (nameOfMob == parseStrings.Korrigan || nameOfMob == parseStrings.Mandragora || nameOfMob == parseStrings.Pygmaioi){
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
            if (DDO.raisingActive){
                DDO.raisingActive = false;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRezCount++;
                DDO.UpdateScore();
            }
            else if (DDO.soloRunUnderway){                
                //DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex] = JSON.parse(JSON.stringify(DDO.Snapshot));
                //DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount--;
                //DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKOCount++;
                DDO.SaveFiles[DDO.currentInstance].splice(DDO.currentSaveFileIndex, 1);
                DDO.RunAbandoned = false;
                DDO.SaveRuns();
                //console.log("Run is over.");
            }
            else if (DDO.groupRunUnderway)
            {
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRezCount++;
                DDO.UpdateScore();
                //console.log("Death during group run.  Increment death count but run may not be over.");
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
                }
            }
        }
    }

    DDO.ParsePomsAndTraps = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let pomTrapName = data[5].toUpperCase();
        let pomTrapID = data[4];
        // Check for traps
        if (data[3].toUpperCase() == parseStrings.Trap && pomTrapID != DDO.TrapInfo.WeaponEnhancementTrapId && pomTrapID != DDO.TrapInfo.GearEnhancementTrapId){
            var trapID = data[2];
            if (!DDO.triggeredTraps.includes(trapID)){
                DDO.triggeredTraps.push(trapID);

                // If it is a detonator we dont want to add it as a trap, just decrement the chest count since it would have been incremented by opening the chest
                if (pomTrapID == DDO.TrapInfo.DetonatorTrapId)
                {
                    DDO.currentFloorStats.chestCount--;
                    DDO.currentFloorSetStats.chestCount--;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
                    console.log("Trapped chests give and take no points." + DDO.currentFloorStats.chestCount);
                    
                    DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                    DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                    DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
                }
                // Its an actual trap and we want to track it as such
                else
                {
                    DDO.currentFloorStats.trapsTriggered++;
                    DDO.currentFloorSetStats.trapsTriggered++;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered++;

                    DDO.DataElements.TrapsFloorValue.innerText = DDO.currentFloorStats.trapsTriggered;
                    DDO.DataElements.TrapsSetValue.innerText = DDO.currentFloorSetStats.trapsTriggered;
                    DDO.DataElements.TrapsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered;
                }                

                DDO.UpdateScore();
            }
        }
        // Check for Pomanders
        else if (pomTrapName.includes(parseStrings.Pomander)){
            if (pomTrapID == DDO.PomanderInfo.PomanderOfSight && !DDO.sightActive){
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
            else if(pomTrapID == DDO.PomanderInfo.PomanderOfSafety && !DDO.safetyActive){
                DDO.DataElements.PomSafetyDisabledImage.style.display = "none";
                DDO.DataElements.PomSafetyEnabledImage.style.display = "";
            }
            else if (pomTrapID == DDO.PomanderInfo.PomanderOfAffluence){
                DDO.affluenceActive = true;
            }
            else if (pomTrapID == DDO.PomanderInfo.PomanderOfAlteration){
                DDO.alterationActive = true;
            }
            else if (pomTrapID == DDO.PomanderInfo.PomanderOfFlight){
                DDO.flightActive = true;
            }
            // If a Serenity is used we decrement enchantment counts, assuming we have any
            else if (pomTrapID == DDO.PomanderInfo.PomanderOfSerenity && DDO.currentFloorStats.enchantmentCount){
                DDO.currentFloorSetStats.enchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.currentFloorStats.enchantmentCount = 0;

                DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
                DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
                DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
                DDO.UpdateScore();
            }
            else if (pomTrapID == DDO.PomanderInfo.PomanderOfRaising){
                DDO.raisingActive = true;
            }
        }
    }

    DDO.ParseEnchantments = function(data){
        if(!DDO.enchantmentsApplied.includes(data[2]) && DDO.EnchantmentIds.includes(data[2]) && data[5] == 'E0000000'){
            DDO.enchantmentsApplied.push(data[2]);

            DDO.currentFloorStats.enchantmentCount++;
            DDO.currentFloorSetStats.enchantmentCount++;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount++;

            DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
            DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
            DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;      
            DDO.UpdateScore();      
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
                console.log('Open chest.' + DDO.currentFloorStats.chestCount);
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
                DDO.UpdateScore();
            }
        }
        else if (data[0] == '34' && data[3].toUpperCase() == parseStrings.BandedCoffer)
        {
            DDO.currentFloorStats.chestCount--;
            DDO.currentFloorSetStats.chestCount--;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
            console.log("Intuition chests give no points." + DDO.currentFloorStats.chestCount);

            DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
            DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
            DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
            DDO.UpdateScore();
        }
    }

    DDO.ParseLogLine = function(data){
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

            DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
            DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
            DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
            DDO.UpdateScore();
        }
        else if (logMessage.includes(parseStrings.BaresItsFangsPOTD) || logMessage.includes(parseStrings.BaresItsFangsHOH)){
            DDO.currentFloorStats.chestCount--;
            DDO.currentFloorSetStats.chestCount--;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount--;
            console.log("Mimics don't count as chests." + DDO.currentFloorStats.chestCount);
            
            DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
            DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
            DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount;
            DDO.UpdateScore();
        }
        else if ((logMessage.includes(parseStrings.ZoneIn) || logMessage.includes(parseStrings.PotDFloor) || logMessage.includes(parseStrings.HoHFloor)) && logMessage.includes(DDO.currentFloor)){
            let val = DDO.currentFloor % 10;
            if (val > 0){
                if (val == 1){
                    DDO.InitiateTimer(0);
                }else {
                    DDO.InitiateTimer(-5);
                }
                DDO.EnableDisableElement(true, "timer", false);
            }
        }
        else if (logMessage.includes(parseStrings.EmpyreanReliquary) || logMessage.includes(parseStrings.GlassPumpkin) || logMessage.includes(parseStrings.Firecrest)){
            DDO.DataElements.SpeedRunsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpeedRunBonusCount;
            // Update the last floor cleared
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].lastFloorCleared = DDO.currentFloor;

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

            DDO.UpdateScore();
            DDO.RunAbandoned = false;

            // Save the run
            DDO.SaveRuns();
        }
        else if (logMessage.includes(parseStrings.Transference)){ 
            if (!DDO.sightActive){
                DDO.EvaluateMap(true);
            }
            DDO.currentFloor++; 

            DDO.DataElements.PomSafetyDisabledImage.style.display = "";
            DDO.DataElements.PomSafetyEnabledImage.style.display = "none";
            DDO.DataElements.PomSightDisabledImage.style.display = "";
            DDO.DataElements.PomSightEnabledImage.style.display = "none";

            DDO.sightActive = false;

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
    }

    DDO.AddKill = function(floorSet, isMimic, isRare){
        DDO.currentFloorStats.killCount++;
        DDO.currentFloorSetStats.killCount++;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].totalKillCount++;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].floorKillCounts[floorSet]++;
        if (isMimic)
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].mimicKillCounts[floorSet]++;
        if (isRare)
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].rareKillCounts[floorSet]++;

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