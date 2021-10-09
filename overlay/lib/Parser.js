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
        else if (lineType == '33'){
            DDO.ParseChestsAndMap(data.line);
        }
        else if (lineType == '00'){
            DDO.ParseLogLine(data.line);
        }
        else if (lineType == '12'){
            DDO.UpdatePlayerInfo(); 
        }        
    }

    DDO.AddKill = function(floorSet){
        DDO.currentFloorStats.killCount = (DDO.currentFloorStats.killCount + 1) || 1;
        DDO.currentFloorSetStats.killCount = (DDO.currentFloorSetStats.killCount + 1) || 1;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].totalKillCount++;
        DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].floorKillCounts[floorSet]++;

        DDO.DataElements.MonstersFloorValue.innerText = DDO.currentFloorStats.killCount;
        DDO.DataElements.MonstersSetValue.innerText = DDO.currentFloorSetStats.killCount;
        DDO.DataElements.MonstersTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].totalKillCount;
    }
    
    DDO.ParseKill = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let nameOfMob = data[3].toUpperCase();
        // Check for mimic
        if (nameOfMob == parseStrings.QuiveringCoffer || nameOfMob == parseStrings.Mimic){
            DDO.currentFloorStats.mimicCount = (DDO.currentFloorStats.mimicCount + 1) || 1;
            DDO.currentFloorSetStats.mimicCount = (DDO.currentFloorSetStats.mimicCount + 1) || 1;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount ++;

            DDO.DataElements.MimicsFloorValue.innerText = `${DDO.currentFloorStats.mimicCount} (${DDO.currentFloorStats.korriganCount || 0})`;
            DDO.DataElements.MimicsSetValue.innerText = `${DDO.currentFloorSetStats.mimicCount} (${DDO.currentFloorSetStats.korriganCount || 0})`;
            DDO.DataElements.MimicsTotalValue.innerText = `${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount})`;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10));
            DDO.UpdateScore();
        }
        // Check for korrigan
        else if (nameOfMob == parseStrings.Korrigan || nameOfMob == parseStrings.Mandragora || nameOfMob == parseStrings.Pygmaioi){
            DDO.currentFloorStats.korriganCount = (DDO.currentFloorStats.korriganCount + 1) || 1;
            DDO.currentFloorSetStats.korriganCount = (DDO.currentFloorSetStats.korriganCount + 1) || 1;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount ++;

            DDO.DataElements.MimicsFloorValue.innerText = `${DDO.currentFloorStats.mimicCount || 0} (${DDO.currentFloorStats.korriganCount})`;
            DDO.DataElements.MimicsSetValue.innerText = `${DDO.currentFloorSetStats.mimicCount || 0} (${DDO.currentFloorSetStats.korriganCount})`;
            DDO.DataElements.MimicsTotalValue.innerText = `${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKorriganCount})`;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10));
            DDO.UpdateScore();
        }
        // Check for rare mob
        else if (DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].RareMonsterNames.includes(nameOfMob)){
            DDO.currentFloorStats.rareKillCount = (DDO.currentFloorStats.rareKillCount + 1) || 1;
            DDO.currentFloorSetStats.rareKillCount = (DDO.currentFloorSetStats.rareKillCount + 1) || 1;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpecialKillCount ++;

            DDO.DataElements.RareMonstersFloorValue.innerText = DDO.currentFloorStats.rareKillCount;
            DDO.DataElements.RareMonstersSetValue.innerText = DDO.currentFloorSetStats.rareKillCount;
            DDO.DataElements.RareMonstersTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentSpecialKillCount;

            DDO.AddKill(Math.floor(DDO.currentFloor / 10));
            DDO.UpdateScore();
        }
        // Check for player death
        else if (nameOfMob == DDO.playerName.toUpperCase()){
            if (DDO.raisingActive){
                DDO.raisingActive = false;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRezCount++;
                DDO.UpdateScore();
            }
            else{                
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex] = JSON.parse(JSON.stringify(DDO.Snapshot));
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentKOCount++;
                DDO.SaveRuns();
            }
            return;
        }
        // Check for normal kill or boss kill
        else{
            // Kills on non-boss floors
            if(DDO.currentFloor % 10 != 0){
                DDO.AddKill(Math.floor(DDO.currentFloor / 10));
                DDO.UpdateScore();
            }
            // Kills on boss floor
            else{
                if (DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].BossNames.includes(nameOfMob)){
                    
                    DDO.AddKill(Math.floor(DDO.currentFloor / 10) - 1);
                    
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

                    // Save the run
                    DDO.SaveRuns();

                    DDO.currentFloor++;
                }
            }
        }
    }

    DDO.ParsePomsAndTraps = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        var pomTrapName = data[5].toUpperCase();
        // Check for traps
        if (data[3].toUpperCase() == parseStrings.Trap && pomTrapName != parseStrings.WeaponEnhancement && pomTrapName != parseStrings.GearEnhancement){
            if (pomTrapName == parseStrings.Detonator)
            {
                DDO.currentFloorStats.chestCount = (DDO.currentFloorStats.chestCount - 1) || 0;
                DDO.currentFloorSetStats.chestCount = (DDO.currentFloorSetStats.chestCount - 1) || 0;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount = Math.max(0, DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount - 1);
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
                DDO.UpdateScore();
            }
            else{
                var trapID = data[0];
                if (!DDO.triggeredTraps.includes(trapID)){
                    DDO.triggeredTraps.push(trapID);

                    DDO.currentFloorStats.trapsTriggered = (DDO.currentFloorStats.trapsTriggered + 1) || 1;
                    DDO.currentFloorSetStats.trapsTriggered = (DDO.currentFloorSetStats.trapsTriggered + 1) || 1;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered ++;

                    DDO.DataElements.TrapsFloorValue.innerText = DDO.currentFloorStats.trapsTriggered;
                    DDO.DataElements.TrapsSetValue.innerText = DDO.currentFloorSetStats.trapsTriggered;
                    DDO.DataElements.TrapsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentTrapsTriggered;
                    DDO.UpdateScore();
                }
            }
        }
        // Check for Pomanders
        else if (pomTrapName.includes(parseStrings.Pomander)){
            if (pomTrapName == parseStrings.PomanderOfSight && !DDO.sightActive){
                DDO.sightActive = true;
                DDO.DataElements.PomSightDisabledImage.style.display = "none";
                DDO.DataElements.PomSightEnabledImage.style.display = "";
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMapRevealCount++;

                // Remove any revealed room credit for this floor since player will get full score for revealing map
                if(DDO.currentFloorStats.roomRevealCount){
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                    DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                }
                DDO.currentFloorStats.roomRevealCount = 0;
                DDO.UpdateScore();
            }
            else if(pomTrapName == parseStrings.PomanderOfSafety && !DDO.safetyActive){
                DDO.DataElements.PomSafetyDisabledImage.style.display = "none";
                DDO.DataElements.PomSafetyEnabledImage.style.display = "";
            }
            else if (pomTrapName == parseStrings.PomanderOfAffluence){
                DDO.affluenceActive = true;
            }
            else if (pomTrapName == parseStrings.PomanderOfAlteration){
                DDO.alterationActive = true;
            }
            else if (pomTrapName == parseStrings.PomanderOfFlight){
                DDO.flightActive = true;
            }
            // If a Serenity is used we decrement enchantment counts, assuming we have any
            else if (pomTrapName == parseStrings.PomanderOfSerenity && DDO.currentFloorStats.enchantmentCount){
                DDO.currentFloorSetStats.enchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.currentFloorStats.enchantmentCount = 0;

                DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
                DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
                DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
                DDO.UpdateScore();
            }
            else if (pomTrapName == parseStrings.PomanderOfRaising){
                DDO.raisingActive = true;
            }
        }
    }

    DDO.ParseEnchantments = function(data){
        if(!DDO.enchantmentsApplied.includes(data[2]) && DDO.EnchantmentIds.includes(data[2]) && data[5] == 'E0000000'){
            DDO.enchantmentsApplied.push(data[2]);

            DDO.currentFloorStats.enchantmentCount = (DDO.currentFloorStats.enchantmentCount + 1) || 1;
            DDO.currentFloorSetStats.enchantmentCount = (DDO.currentFloorSetStats.enchantmentCount + 1) || 1;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount++;

            DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
            DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
            DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;      
            DDO.UpdateScore();      
        }
    }

    DDO.ParseChestsAndMap = function(data){
        if(data[2].includes('8003')){
            if(data[3] == '10000004' && DDO.currentFloor % 10 > 0){
                if (!DDO.sightActive){                
                    DDO.currentFloorStats.roomRevealCount = (DDO.currentFloorStats.roomRevealCount + 1) || 1;
                    DDO.currentFloorSetStats.roomRevealCount = (DDO.currentFloorSetStats.roomRevealCount + 1) || 1;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount++;
                    
                    DDO.UpdateScore();
                }
            }
            else if (data[3] == '10000007' && data[6] == 'FF'){
                DDO.currentFloorStats.chestCount = (DDO.currentFloorStats.chestCount + 1) || 1;
                DDO.currentFloorSetStats.chestCount = (DDO.currentFloorSetStats.chestCount + 1) || 1;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount++;
                
                DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
                DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
                DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount; 
                DDO.UpdateScore();
            }
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
            
            DDO.currentFloorStats.enchantmentCount = (DDO.currentFloorStats.enchantmentCount + 1) || 1;
            DDO.currentFloorSetStats.enchantmentCount = (DDO.currentFloorSetStats.enchantmentCount + 1) || 1;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount++;

            DDO.DataElements.EnchantmentsFloorValue.innerText = DDO.currentFloorStats.enchantmentCount;
            DDO.DataElements.EnchantmentsSetValue.innerText = DDO.currentFloorSetStats.enchantmentCount;
            DDO.DataElements.EnchantmentsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentEnchantmentCount;
            DDO.UpdateScore();
        }
        else if (logMessage.includes(parseStrings.BaresItsFangs)){
            DDO.currentFloorStats.chestCount = (DDO.currentFloorStats.chestCount - 1) || 0;
            DDO.currentFloorSetStats.chestCount = (DDO.currentFloorSetStats.chestCount - 1) || 0;
            DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount = Math.max(0, DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount - 1);
            
            DDO.DataElements.ChestsFloorValue.innerText = DDO.currentFloorStats.chestCount;
            DDO.DataElements.ChestsSetValue.innerText = DDO.currentFloorSetStats.chestCount;
            DDO.DataElements.ChestsTotalValue.innerText = DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentChestCount;  
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

            // Save the run
            DDO.SaveRuns();
        }
        else if (logMessage.includes(parseStrings.Transference)){ 
            if (!DDO.sightActive){
                // If we are in POTD and on floor 1-9 and at room reveal count 4 its a full clear
                // Or if we have 12 rooms revealed we are in a big room in HOH so full clear
                // Or if we have 8 rooms revealed we are in a normal max room floor and award full clear (Not always 100% accurate in HoH)
                if ( (parseStrings.CurrentInstanceFloorsPOTD.includes(DDO.currentInstance) && DDO.currentFloor < 10 && DDO.currentFloorStats.roomRevealCount == 4) ||
                    DDO.currentFloorStats.roomRevealCount == 12 ||
                    DDO.currentFloorStats.roomRevealCount == 8 )
                {
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                    DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                    DDO.currentFloorStats.roomRevealCount = 0;
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentMapRevealCount++;
                }
                // If we have revealed less than 3 rooms or more than 8 but not 12 we know its not a full clear
                else if (DDO.currentFloorStats.roomRevealCount < 3 ||
                        DDO.currentFloorStats.roomRevealCount > 8)
                {
                    DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                    DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                    DDO.currentFloorStats.roomRevealCount = 0;
                }
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
            DDO.currentFloorStats = {};

            //Give credit for spawn room.
            if (DDO.currentFloor % 10 > 0){
                DDO.currentFloorStats.roomRevealCount = (DDO.currentFloorStats.roomRevealCount + 1) || 1;
                DDO.currentFloorSetStats.roomRevealCount = (DDO.currentFloorSetStats.roomRevealCount + 1) || 1;
                DDO.SaveFiles[DDO.currentInstance][DDO.currentSaveFileIndex].currentRoomRevealCount++;
            }


            DDO.DataElements.MonstersFloorValue.innerText = 0;
            DDO.DataElements.MimicsFloorValue.innerText = 0;
            DDO.DataElements.TrapsFloorValue.innerText = 0;
            DDO.DataElements.ChestsFloorValue.innerText = 0;
            DDO.DataElements.EnchantmentsFloorValue.innerText = 0;
            DDO.DataElements.RareMonstersFloorValue.innerText = 0;

            DDO.UpdateScore();
        }
    }

})()