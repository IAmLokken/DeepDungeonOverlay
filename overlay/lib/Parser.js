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
            DDO.ParseChestAndMap(data.line);
        }
        else if (lineTYpe == '00'){
            DDO.ParseLogLine(data);
        }
    }
    
    DDO.ParseKill = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let nameOfMob = data[3];
        // Check for mimic
        if (nameOfMob == parseStrings.QuiveringCoffer || nameOfMob == parseStrings.Mimic){
            DDO.currentFloorStats.mimicCount = DDO.currentFloorStats.mimicCount ++ || 1;
            DDO.currentFloorSetStats.mimicCount = DDO.currentFloorSetStats.mimicCount ++ || 1;
            DDO.SaveFiles[DDO.currentSaveFileIndex].currentMimicCount ++;

            DDO.DataElements.MimicsFloorValue.innertText = `${DDO.currentFloorStats.mimicCount} (${DDO.currentFloorStats.korriganCount})`;
            DDO.DataElements.MimicsSetValue.innertText = `${DDO.currentSetStats.mimicCount} (${DDO.currentSetStats.korriganCount})`;
            DDO.DataElements.MimicsTotalValue.innertText = `${DDO.SaveFiles[DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentSaveFileIndex].currentKorriganCount})`;
        }
        // Check for korrigan
        else if (nameOfMob == parseStrings.Korrigan || nameOfMob == parseStrings.Mandragora || nameOfMob == parseStrings.Pygmaioi){
            DDO.currentFloorStats.korriganCount = DDO.currentFloorStats.korriganCount ++ || 1;
            DDO.currentFloorSetStats.korriganCount = DDO.currentFloorSetStats.korriganCount ++ || 1;
            DDO.SaveFiles[DDO.currentSaveFileIndex].currentKorriganCount ++;

            DDO.DataElements.MimicsFloorValue.innertText = `${DDO.currentFloorStats.mimicCount} (${DDO.currentFloorStats.korriganCount})`;
            DDO.DataElements.MimicsSetValue.innertText = `${DDO.currentSetStats.mimicCount} (${DDO.currentSetStats.korriganCount})`;
            DDO.DataElements.MimicsTotalValue.innertText = `${DDO.SaveFiles[DDO.currentSaveFileIndex].currentMimicCount} (${DDO.SaveFiles[DDO.currentSaveFileIndex].currentKorriganCount})`;
        }
        // Check for rare mob
        else if (DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].RareMonsterNames.includes(nameOfMob)){
            DDO.currentFloorStats.rareKillCount = DDO.currentFloorStats.rareKillCount ++ || 1;
            DDO.currentFloorSetStats.rareKillCount = DDO.currentFloorSetStats.rareKillCount ++ || 1;
            DDO.SaveFiles[DDO.currentSaveFileIndex].currentSpecialKillCount ++;

            DDO.DataElements.RareMonstersFloorValue.innertText = DDO.currentFloorStats.rareKillCount;
            DDO.DataElements.RareMonstersSetValue.innertText = DDO.currentFloorSetStats.rareKillCount;
            DDO.DataElements.RareMonstersTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].currentSpecialKillCount;
        }
        // Check for player death
        else if (nameOfMob == DDO.playerName){
            if (DDO.raisingActive){
                DDO.raisingActive = false;
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentRezCount++;
            }
            else{                
                DDO.SaveFiles[DDO.currentSaveFileIndex] = JSON.stringify(JSON.parse(DDO.Snapshot));
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentKOCount++;
                DDO.SaveRuns();
            }
        }
        // Check for normal kill or boss kill
        else{
            // Kills on non-boss floors
            if(DDO.currentFloor % 10 != 0){
                DDO.currentFloorStats.killCount = DDO.currentFloorStats.killCount ++ || 1;
                DDO.currentFloorSetStats.killCount = DDO.currentFloorSetStats.killCount ++ || 1;
                DDO.SaveFiles[DDO.currentSaveFileIndex].totalKillCount ++;
                DDO.SaveFiles[DDO.currentSaveFileIndex].floorKillCounts[Math.floor(currentFloor / 10)]++;

                DDO.DataElements.MonstersFloorValue.innertText = DDO.currentFloorStats.killCount;
                DDO.DataElements.MonstersSetValue.innertText = DDO.currentFloorSetStats.killCount;
                DDO.DataElements.MonstersTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].totalKillCount;
            }
            // Kills on boss floor
            else{
                if (DDO.localeInformation.Languages[DDO.CurrentLanguage].BossNames.includes(nameOfMob)){
                    DDO.currentFloorStats.killCount = DDO.currentFloorStats.killCount ++ || 1;
                    DDO.currentFloorSetStats.killCount = DDO.currentFloorSetStats.killCount ++ || 1;
                    DDO.SaveFiles[DDO.currentSaveFileIndex].totalKillCount ++;
                    DDO.SaveFiles[DDO.currentSaveFileIndex].floorKillCounts[Math.floor(currentFloor / 10) - 1]++;

                    DDO.DataElements.MonstersFloorValue.innertText = DDO.currentFloorStats.killCount;
                    DDO.DataElements.MonstersSetValue.innertText = DDO.currentFloorSetStats.killCount;
                    DDO.DataElements.MonstersTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].totalKillCount;

                    // Check for speed run bonus and apply
                    if(DDO.speedRunBonus){
                        DDO.SaveFiles[DDO.currentSaveFileIndex].currentSpeedRunBonusCount++;
                        DDO.DataElements.SpeedRunsTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].currentSpeedRunBonusCount;
                    }

                    // Update the last floor cleared
                    DDO.SaveFiles[DDO.currentSaveFileIndex].lastFloorCleared = DDO.currentFloor;

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

                    // Save the run
                    DDO.SaveRuns();
                }
            }
        }
    }

    DDO.ParsePomsAndTraps = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        var pomTrapName = data[5];
        // Check for traps
        if (data[3] == parseStrings.Trap && pomTrapName != parseStrings.WeaponEnhancement && pomTrapName != parseStrings.GearEnhancement){
            var trapID = data[0];
            if (!DDO.triggeredTraps.includes(trapID)){
                DDO.triggeredTraps.push(trapID);

                DDO.currentFloorStats.trapsTriggered = DDO.currentFloorStats.trapsTriggered ++ || 1;
                DDO.currentFloorSetStats.trapsTriggered = DDO.currentFloorSetStats.trapsTriggered ++ || 1;
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentTrapsTriggered ++;

                DDO.DataElements.TrapsFloorValue.innertText = DDO.currentFloorStats.trapsTriggered;
                DDO.DataElements.TrapsSetValue.innertText = DDO.currentFloorSetStats.trapsTriggered;
                DDO.DataElements.TrapsTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].currentTrapsTriggered;
            }
        }
        // Check for Pomanders
        else if (pomTrapName.includes(parseStrings.Pomander)){
            if (pomTrapName == parseStrings.PomanderOfSight && !DDO.sightActive){
                DDO.sightActive = true;
                DDO.DataElements.PomSightImage.innerHTML = '<img src="../img/PomSightEnabled.png" />';
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentMapRevealCount ++;

                // Remove any revealed room credit for this floor since player will get full score for revealing map
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentRoomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                DDO.currentFloorSetStats.roomRevealCount -= DDO.currentFloorStats.roomRevealCount;
                DDO.currentFloorStats.roomRevealCount = 0;
            }
            else if(pomTrapName == parseStrings.PomanderOfSafety && !DDO.safetyActive){
                DDO.safetyActive = true;
                DDO.DataElements.PomSafetyImage.innerHTML = '<img src="../img/PomSafetyEnabled.png" />';
            }
            else if (pomTrapName == parseStrings.PomanderOfAffluence && !DDO.triggerAffluence){
                DDO.triggerAffluence = true;
            }
            else if (pomTrapName == parseStrings.PomanderOfAlteration && !DDO.triggerAlteration){
                DDO.triggerAlteration = true;
            }
            else if (pomTrapName == parseStrings.PomanderOfFlight && !DDO.triggerFlight){
                DDO.triggerFlight = true;
            }
            // If a Serenity is used we decrement enchantment counts 
            else if (pomTrapName == parseStrings.PomanderOfSerenity){
                DDO.currentFloorSetStats.enchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.SaveFiles[DDO.currentSaveFileIndex].currentEnchantmentCount -= DDO.currentFloorStats.enchantmentCount;
                DDO.currentFloorStats.enchantmentCount = 0;

                DDO.DataElements.EnchantmentsFloorValue.innertText = DDO.currentFloorStats.enchantmentCount;
                DDO.DataElements.EnchantmentsSetValue.innertText = DDO.currentFloorSetStats.enchantmentCount;
                DDO.DataElements.EnchantmentsTotalValue.innertText = DDO.SaveFiles[DDO.currentSaveFileIndex].currentEnchantmentCount;
            }
            else if (pomTrapName == parseStrings.PomanderOfRaising){
                DDO.raisingActive = true;
            }
        }
    }

    DDO.ParseEnchantments = function(data){

    }

    DDO.ParseChestsAndMap = function(data){

    }

    DDO.ParseLogLine = function(data){

    }

})()