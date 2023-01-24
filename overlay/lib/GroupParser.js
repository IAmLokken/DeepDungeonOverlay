'use strict'

;(function(){

    DDO.GroupProcessLogLine = function(data){
        let lineType = data.line[0];

        if (lineType == '21' || lineType == '22'){
            DDO.GroupParsePoms(data.line);
        }
        else if (lineType == '00'){
            DDO.GroupParseLogLine(data.line);
        }
        else if (lineType == '12'){
            DDO.UpdatePlayerInfo(); 
        }        
    }

    DDO.GroupParsePoms = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let pomName = data[5].toUpperCase();
        let pomID = data[4];
        // Check for Pomanders
        if (pomName.includes(parseStrings.Pomander)){
            if (pomID == DDO.PomanderInfo.PomanderOfSight && !DDO.sightActive){
                DDO.sightActive = true;
                DDO.DataElements.PomSightDisabledImage.style.display = "none";
                DDO.DataElements.PomSightEnabledImage.style.display = "";
            }
            else if(pomID == DDO.PomanderInfo.PomanderOfSafety && !DDO.safetyActive){
                DDO.DataElements.PomSafetyDisabledImage.style.display = "none";
                DDO.DataElements.PomSafetyEnabledImage.style.display = "";
            }
            else if (pomID == DDO.PomanderInfo.PomanderOfAffluence){
                DDO.affluenceActive = true;
            }
            else if (pomID == DDO.PomanderInfo.PomanderOfAlteration){
                DDO.alterationActive = true;
            }
            else if (pomID == DDO.PomanderInfo.PomanderOfFlight){
                DDO.flightActive = true;
            }            
        }
    }

    DDO.GroupParseLogLine = function(data){
        let parseStrings = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].ParseStrings;
        let logMessage = data[4].toUpperCase();
        if (logMessage.includes(parseStrings.ZoneIn) || 
        ((logMessage.includes(parseStrings.PotDFloor) || logMessage.includes(parseStrings.HoHFloor)) && /\d/.test(logMessage) && !/\d-/.test(logMessage) && !/\d~/.test(logMessage))){
            let val = parseInt(logMessage.replace(/\D/g,' ').trim().split(' ')[0]);
            if (val % 10 > 0){
                if (val % 10 == 1){
                    DDO.InitiateTimer(0, val);
                }else {
                    DDO.InitiateTimer(-5, val);
                }
                DDO.EnableDisableElement(true, "timer", false);
                //console.log("Timer started for floor: " + val + " log-> ( " + logMessage + ")");
            }
        }
        else if (logMessage.includes(parseStrings.EmpyreanReliquary) || logMessage.includes(parseStrings.GlassPumpkin) || logMessage.includes(parseStrings.Firecrest)){
            // Reset pomander settings
            DDO.triggerAffluence = false;
            DDO.triggerAlteration = false;
            DDO.triggerFlight = false;
            DDO.safetyActive = false;
            DDO.affluenceActive = false;
            DDO.alterationActive = false;
            DDO.flightActive = false;
            DDO.sightActive = false;
        }
        else if (logMessage.includes(parseStrings.Transference)){ 
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

            clearInterval(DDO.ticker);
            DDO.EnableDisableElement(false, "timer", false);
        }
    }
})()