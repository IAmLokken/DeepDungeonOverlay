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
        DDO.ScoreCalculator.floorScore = DDO.ScoreCalculator.CalculateFloorScore(saveFile.floorStartedOn, floorStoppedOn, dutyClearFailed, saveFile.deepDungeonName);
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

        DDO.ScoreCalculator.killScore = DDO.ScoreCalculator.CalculateKillScore(saveFile.floorStartedOn, floorStoppedOn, saveFile.floorKillCounts, saveFile.mimicKillCounts, saveFile.rareKillCounts, saveFile.deepDungeonName);

        score += DDO.ScoreCalculator.killScore;

        /*
        console.log('character level score: ' + DDO.ScoreCalculator.characterLevelScore);
        console.log('floor score: ' + DDO.ScoreCalculator.floorScore);
        console.log('floor reveal score: ' + DDO.ScoreCalculator.revealedScore);
        console.log('chest score: ' + DDO.ScoreCalculator.chestScore);
        console.log('rare enemy score: ' + DDO.ScoreCalculator.uniqueEnemyScore);
        console.log('mimic score: ' + DDO.ScoreCalculator.mimicScore);
        console.log('enchantment score: ' + DDO.ScoreCalculator.enchantmentScore);
        console.log('trap score: ' + DDO.ScoreCalculator.trapScore);
        console.log('speedrun score: ' + DDO.ScoreCalculator.speedRunScore);
        console.log('rez score: ' + DDO.ScoreCalculator.rezScore);
        console.log('kill score: ' + DDO.ScoreCalculator.killScore);
        */
        //returnValue = String.Format("{0:n0}", score);
        //return returnValue;
        return score;
    }


    DDO.ScoreCalculator.CalculateFloorScore = function(floorStartedOn, currentFloorNumber, dutyClearFailed, deepDungeonName)
    {
        let score = 0;
        let floorDifference = currentFloorNumber - floorStartedOn;
        let lastBossFloorCompleted =  Math.floor((currentFloorNumber - floorStartedOn) / 10);

        score += 430 * floorDifference; // Aetherpool(99/99 assumed) times floor ended on minus floor started on

        score += (currentFloorNumber - (floorStartedOn + lastBossFloorCompleted)) * 50 * 91; // Score bonus for getting to each floor(minus bosses?)
        // 409, 500 for Hoh, 819,000 for potd

        score += lastBossFloorCompleted * dutyClearFailed * 300;  //multiplier for each boss (minimum 300, some are worth more/less, adjusted further down)
        // 227,250 for HoH, 479,750 for potd

        // floor 100 scoreboard bandaid; only applicable if starting at 1
        if (floorDifference + 1 == 100 && dutyClearFailed == 101)
        score -= 4500;

        if (deepDungeonName == 'Heaven-on-High')
        {
            // Give bonus for floor 30 boss
            if (currentFloorNumber == 30){
                score += dutyClearFailed * 300;
            }

            // 5050 bonus for reaching last floor (separate from completion bonus.  You get this if you timeout on last floor rip)
            if (currentFloorNumber == 100){
                score += 50 * dutyClearFailed;
            }
            
            // adding additional 450 for floor 30 boss
            // removing 50 for first boss (weather thats floor 10 or 30)
            score += 400 * dutyClearFailed;

            // Floor 30 scoreboard bandaid; only applicable if starting at 1
            if (floorDifference + 1 == 30)
                score -= 1000;

            // Clear bonus
            if (currentFloorNumber == 100)
                score += 3200 * dutyClearFailed;
        }


        if (deepDungeonName == 'the Palace of the Dead')
        {
            // Give base bonus for floor 100 boss
            if (currentFloorNumber == 100){
                score += dutyClearFailed * 300;
            }

            // 5050 bonus for reaching last floor (separate from completion bonus.  You get this if you timeout on last floor rip)
            if (currentFloorNumber == 200){
                score += 50 * dutyClearFailed;
            }
            
            // removing 50 for first boss (weather thats floor 10 or 60)
            score -= 50 * dutyClearFailed;

            // Floor 50 boss bonus
            if (floorStartedOn == 1)
                score += 450 * dutyClearFailed;
            // Floor 100 boss bonus
            score += 450 * dutyClearFailed;

            // 2000 point deduction for starting floor 51
            if (floorStartedOn == 51)
                score -= 2000;
            
            // Clear bonus
            if (currentFloorNumber == 200)
            {
                if (floorDifference + 1 == 200)
                    score += -9500 + 3200 * dutyClearFailed;
                if (floorDifference + 1 == 150)
                    score += -7000 + 3200 * dutyClearFailed;
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
    
    DDO.ScoreCalculator.CalculateKillScore = function(floorStartedOn, currentFloorNumber, floorKills, mimicKills, rareKillCounts, deepDungeonName){
        let score = 0;

        // HoH floor 1-30 are normal kill values
        // HoH floor 31-100 are bonus kill values excluding mimics and bosses
        if (deepDungeonName == 'Heaven-on-High'){
            for(var i = 0; i < 10; i++){
                let nonBonusMobs = i < 9 ? mimicKills[i] + 1 : mimicKills[i];
                if (i < 3){
                    score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * floorKills[i];
                }
                else{
                    if (floorKills[i] > 0){
                        score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * (nonBonusMobs);
                        score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2)) * 2) * (floorKills[i] - nonBonusMobs);
                    }
                }
            }            
        }
        
        // Potd floor 1-100 are normal kill values
        // Potd floor 101-200 are bonus kill values excluding mimics, rare monsters, and bosses
        if (deepDungeonName == 'the Palace of the Dead')
        {
            for (var i = 0; i < 20; i++)
            {
                let nonBonusMobs = i < 19 ? mimicKills[i] + rareKillCounts[i] + 1 : mimicKills[i] + rareKillCounts[i];
                //let nonBonusMobs = i < 19 ? mimicKills[i] + 1 : mimicKills[i];
                if (i < 10){
                    score += (100 + (Math.floor((currentFloorNumber - floorStartedOn + 1) / 2))) * floorKills[i];
                }
                else{
                    if (floorKills[i] > 0){
                        score += (100 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * (nonBonusMobs);
                        score += (201 + Math.floor(((currentFloorNumber - floorStartedOn + 1) / 2))) * (floorKills[i] - nonBonusMobs);
                    }
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
        let totalPossibleMapReveals = (currentSave.floorMaxScore - currentSave.floorStartedOn + 1) - (Math.floor((currentSave.floorMaxScore - currentSave.floorStartedOn + 1) / 10));

        let mapRevealsToAdd = totalPossibleMapReveals - mapRevealsEarned;

        return  dutyClearFailed * mapRevealsToAdd * 25;
    }

})()