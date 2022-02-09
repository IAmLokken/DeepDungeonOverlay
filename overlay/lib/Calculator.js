'use strict'

;(function(){

    DDO.ScoreCalculator = {};

    DDO.ScoreCalculator.firstFloorTimeOut = false; // This is likely never going to change but there is an odd score difference if you timeout or die on the first set before revealing two floors.  Not relevant for actual score runs.

    DDO.ScoreCalculator.aetherpoolArm = 99; // Assuming full aetherpool
    DDO.ScoreCalculator.aetherpoolArmor = 99; // Assuming full aetherpool 

    DDO.ScoreCalculator.characterLevelScore = 0;
    DDO.ScoreCalculator.floorScore = 0;
    DDO.ScoreCalculator.revealedScore = 0;
    DDO.ScoreCalculator.chestScore = 0;
    DDO.ScoreCalculator.uniqueEnemyScore = 0;
    DDO.ScoreCalculator.mimicScore = 0;
    DDO.ScoreCalculator.enchantmentScore = 0;
    DDO.ScoreCalculator.trapScore = 0;
    DDO.ScoreCalculator.speedRunScore = 0;
    DDO.ScoreCalculator.rezScore = 0;
    DDO.ScoreCalculator.killScore = 0;

    
    DDO.ScoreCalculator.CalulcateCurrentScore = function(saveFile, playerLevel, dutyClearFailed)
    {
        if ((saveFile.deepDungeonName == "the Palace of the Dead" && saveFile.floorStartedOn != 1 && saveFile.floorStartedOn != 51) ||
            (saveFile.deepDungeonName == "Heaven-on-High" && saveFile.floorStartedOn != 1 && saveFile.floorStartedOn != 21))
             return -414;

        let score = 0;

        let floorStoppedOn = saveFile.floorStartedOn > saveFile.floorMaxScore ? saveFile.floorStartedOn : saveFile.floorMaxScore;

        DDO.ScoreCalculator.characterLevelScore = ((DDO.ScoreCalculator.aetherpoolArm + DDO.ScoreCalculator.aetherpoolArmor) * 10) + (playerLevel * 500);
        DDO.ScoreCalculator.floorScore = DDO.ScoreCalculator.CalculateFloorScore(saveFile.floorStartedOn, floorStoppedOn, dutyClearFailed, playerLevel);
        DDO.ScoreCalculator.revealedScore = DDO.ScoreCalculator.CalculateFullyRevealedFloorScore(saveFile.floorStartedOn, floorStoppedOn,  saveFile.currentMapRevealCount, dutyClearFailed);
        DDO.ScoreCalculator.chestScore = DDO.ScoreCalculator.CalculateChestScore(saveFile.currentChestCount, dutyClearFailed);
        DDO.ScoreCalculator.uniqueEnemyScore = DDO.ScoreCalculator.CalculateUniqueEnemyScore(saveFile.currentSpecialKillCount, dutyClearFailed);
        DDO.ScoreCalculator.mimicScore = DDO.ScoreCalculator.CalculateMimicKorriganScore(saveFile.currentMimicCount + saveFile.currentKorriganCount, dutyClearFailed);
        DDO.ScoreCalculator.enchantmentScore = DDO.ScoreCalculator.CalculateEnchantmentScore(saveFile.currentEnchantmentCount, dutyClearFailed);
        DDO.ScoreCalculator.trapScore = DDO.ScoreCalculator.CalculateTrapScore(saveFile.currentTrapsTriggered, dutyClearFailed);
        DDO.ScoreCalculator.speedRunScore = DDO.ScoreCalculator.CalculateSpeedRunScore(saveFile.currentSpeedRunBonusCount, dutyClearFailed);
        DDO.ScoreCalculator.rezScore = DDO.ScoreCalculator.CalculateRezScore(saveFile.currentRezCount, dutyClearFailed);

        let temp = DDO.ScoreCalculator.revealedScore +
                   DDO.ScoreCalculator.chestScore +
                   DDO.ScoreCalculator.uniqueEnemyScore +
                   DDO.ScoreCalculator.mimicScore +
                   DDO.ScoreCalculator.enchantmentScore +
                   DDO.ScoreCalculator.trapScore +
                   DDO.ScoreCalculator.speedRunScore +
                   DDO.ScoreCalculator.rezScore;

        if (temp / dutyClearFailed > 0)
            score += DDO.ScoreCalculator.characterLevelScore + DDO.ScoreCalculator.floorScore + temp;
        else
            score += DDO.ScoreCalculator.characterLevelScore + DDO.ScoreCalculator.floorScore;

        DDO.ScoreCalculator.killScore = DDO.ScoreCalculator.CalculateKillScore(saveFile.floorStartedOn, floorStoppedOn, saveFile.floorKillCounts, saveFile.mimicKillCounts, saveFile.deepDungeonName);

        score += DDO.ScoreCalculator.killScore;
        
        //returnValue = String.Format("{0:n0}", score);
        //return returnValue;
        return score;
    }


    DDO.ScoreCalculator.CalculateFloorScore = function(floorStartedOn, currentFloorNumber, dutyClearFailed, playerLevel)
    {
        let score = 0;

        score += 430 * (currentFloorNumber - floorStartedOn); // Aetherpool(99/99 assumed) times floor ended on minus floor started on

        if (playerLevel > 61 && currentFloorNumber - floorStartedOn + 1 > 20) // HoH only (61+ only possible in HoH).  Gain 4,949 bonus at floor 30 card if you start at 1, at floor 100 card if you start at 21
            score += (49 * dutyClearFailed);

        score += (currentFloorNumber - (floorStartedOn + Math.floor((currentFloorNumber - floorStartedOn) / 10))) * 50 * 91; // Score bonus for getting to each floor(minus bosses?)
        // 409, 500 for Hoh, 819,000 for potd

        score += Math.floor((currentFloorNumber - floorStartedOn) / 10) * dutyClearFailed * 250;  //multiplier for each boss?
        // 227,250 for HoH, 479,750 for potd

        if (currentFloorNumber % 10 == 0 && dutyClearFailed == 101)  //scorecard bonus? this is not duplicated per scorecard, applied once at current score card.
            score += dutyClearFailed * 250;
        // 25,250 for HoH and potd

        // HoH specific
        if (playerLevel > 61)
        {
            let val = Math.floor((currentFloorNumber - floorStartedOn) / 10) * dutyClearFailed * 250; // boss multiplier? 227,250
            // if we are on a boss floor (or last floor)
            if (currentFloorNumber % 10 == 0 && dutyClearFailed == 101)
                val += dutyClearFailed * 250; // add additional 25,250 to val
                
            if (val / (dutyClearFailed * 250) >= (3 - Math.floor(floorStartedOn / 10)))
                score += 450 * dutyClearFailed;
            if (val / (dutyClearFailed * 250) >= (5 - Math.floor(floorStartedOn / 10)))
                score += 100 * dutyClearFailed;

            if (currentFloorNumber - floorStartedOn + 1 == 30 && dutyClearFailed == 101)
                score += -1000;
            if (currentFloorNumber - floorStartedOn + 1 == 100 && dutyClearFailed == 101)
                score += -4500 + 350000;
        }
        else
        {
            score += Math.floor((currentFloorNumber - floorStartedOn) / 10) * dutyClearFailed * 50;

            if (currentFloorNumber % 10 == 0 && dutyClearFailed == 101)
                score += dutyClearFailed * 50;
            if (floorStartedOn == 1)
                score -= dutyClearFailed * 50 * Math.min(Math.floor(currentFloorNumber / 10), 1);
            if (floorStartedOn == 1)
            {
                if (currentFloorNumber > 30 || (currentFloorNumber == 30 && dutyClearFailed == 101))
                    score += dutyClearFailed * 0 * 0; 
                if (currentFloorNumber > 50 || (currentFloorNumber == 50 && dutyClearFailed == 101))
                    score += dutyClearFailed * 450;
            }
            if (currentFloorNumber > 100 || (currentFloorNumber == 100 && dutyClearFailed == 101))
                score += dutyClearFailed * 450;
            if (currentFloorNumber - floorStartedOn + 1 == 100 && dutyClearFailed == 101)
                score += -4500;
            if (currentFloorNumber - floorStartedOn + 1 == 50 && dutyClearFailed == 101)
                score += -2000;
            if (currentFloorNumber - floorStartedOn + 1 == 200 && dutyClearFailed == 101)
                score += 0;
                //score += -4500 + 500000;  
        }

        if (playerLevel < 61)
        {
            if (currentFloorNumber > 60 || (currentFloorNumber == 60 && dutyClearFailed == 101))
            {
                if (floorStartedOn == 51)
                    score += -50 * dutyClearFailed;
                else if (currentFloorNumber < 100)
                    score += -50 * dutyClearFailed;
            }
        }

        return score;
    }

    DDO.ScoreCalculator.CalculateFullyRevealedFloorScore = function(floorStartedOn, currentFloorNumber, fullyRevealedFloors, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            if (currentFloorNumber - floorStartedOn + 1 > 10)
                score += dutyClearFailed * fullyRevealedFloors * 25;
            else
            {
                if (dutyClearFailed == 101)
                    score += dutyClearFailed * fullyRevealedFloors * 25;
                else
                    score += dutyClearFailed * (fullyRevealedFloors - 2) * 25;
            }
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateChestScore = function(chestCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += chestCount * dutyClearFailed;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateUniqueEnemyScore = function(uniqueCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += uniqueCount * dutyClearFailed * 20;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateMimicKorriganScore = function(enemyCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += enemyCount * dutyClearFailed * 5;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateEnchantmentScore = function(enchantmentCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += enchantmentCount * dutyClearFailed * 5;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateTrapScore = function(trapCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += -trapCount * dutyClearFailed * 2;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateSpeedRunScore = function(currentSpeedRunBonusCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += currentSpeedRunBonusCount * dutyClearFailed * 150;
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateRezScore = function(rezCount, dutyClearFailed){
        let score = 0;
        if (!DDO.ScoreCalculator.firstFloorTimeOut)
        {
            score += -rezCount * dutyClearFailed * 50;
        }
        return score;
    }
    
    DDO.ScoreCalculator.CalculateKillScore = function(floorStartedOn, currentFloorNumber, floorKills, mimicKills, deepDungeonName){
        let score = 0;

        // On odd floor sets mobs are worth bonus points (except mimics and korrigans)
        if (deepDungeonName == 'Heaven-on-High'){
            for(var i = 0; i < 10; i++){
                let oddSet = (i + 1) % 2 != 0 ? true : false;
                if (oddSet){
                    score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * floorKills[i];
                }
                else{
                    score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * mimicKills[i];
                    score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * (floorKills[i] - mimicKills[i]);
                }
            }            
        }
        // Above floor 100 mobs are worth bonus points (except mimics and korrigans)
        else
        {
            for (var i = 0; i < 20; i++)
            {
                if (i < 10){
                    score += (100 + (Math.floor((currentFloorNumber - floorStartedOn + 1) / 2))) * floorKills[i];
                }
                else{
                    score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * mimicKills[i];
                    score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * (floorKills[i] - mimicKills[i]);
                }
            }
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateRoomRevealEstimate = function(roomRevealCounts, deepDungeonName){
        let score = 0;

        let floorSetIndex = Math.floor(DDO.currentFloor / 10);
        if (deepDungeonName == 'Heaven-on-High'){
            let range = DDO.RoomRangesHOH[floorSetIndex].split(':').map(Number);
            for (var i = 0; i < 10; i++){
                score += roomRevealCounts[i] * range[2];
            }
        }
        else
        {
            let range = DDO.RoomRangesPOTD[floorSetIndex].split(':').map(Number);
            for (var i = 0; i < 20; i++){
                score += roomRevealCounts[i] * range[2];
            }  
        }
        return score;
    }

    DDO.ScoreCalculator.CalculateMaxRoomReveal = function(currentSave, dutyClearFailed){
        let score = 0;
        let mapRevealsEarned = currentSave.currentMapRevealCount;
        let totalPossibleMapReveals = (currentSave.lastFloorCleared - currentSave.floorStartedOn + 1) - (Math.floor((currentSave.lastFloorCleared - currentSave.floorStartedOn + 1) / 10));

        let mapRevealsToAdd = totalPossibleMapReveals - mapRevealsEarned;

        return  dutyClearFailed * mapRevealsToAdd * 25;

    }

})()