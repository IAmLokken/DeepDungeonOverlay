'use strict'

;(function()
{
    const PATH = 'lang/';

    function LoadBestiary(language, callback)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => 
        {
            if(xhttp.status == 404 && language == 'en')
            {
                console.log("ERROR: Cannot find bestiary file for: " + language);
                return;
            }
            if(xhttp.status === 404)
            {
                this.LoadLanguage('en');
                return;
            }
            if (xhttp.readyState === 4 && xhttp.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttp.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                DDO.Bestiary = json;
                if (callback) callback();
            }
        };
    
        xhttp.open('GET', PATH + 'bestiary_' + language + '.json', true);
        xhttp.send();
    }

    window.DDO.LoadBestiary = LoadBestiary;

    DDO.ClearTargetInfo = function()
    {
        DDO.DataElements.TargetNameValue.innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['NoTargetLabel'];
        DDO.DataElements.TargetHPPValue.innerText = "-";
        DDO.TurnTargetImagesOff();
        DDO.DataElements.TargetInformationValue.innerHTML = "-";
    }

    DDO.DisplayTargetInfo = function(data)
    {
        let targetName = data.Target.Name
        let bestiaryIndex = DDO.currentFloor % 10 > 0 ? Math.floor(DDO.currentFloor / 10) : Math.floor(DDO.currentFloor / 10 - 1);
        var target = DDO.Bestiary[DDO.currentInstance][bestiaryIndex][targetName];
        if(typeof(target) !== 'undefined'){
            
            DDO.DataElements.TargetNameValue.innerText = data.Target.Name;
            DDO.DataElements.TargetHPPValue.innerText = ((data.Target.CurrentHP / data.Target.MaxHP) * 100).toFixed(2) + '%';
            DDO.TurnTargetImagesOff();

            if(target.DangerLevel == 'Easy') DDO.DataElements.DangerEasyImage.style = "";
            else if(target.DangerLevel == 'Caution') DDO.DataElements.DangerCautionImage.style = "";
            else if(target.DangerLevel == 'Scary') DDO.DataElements.DangerScaryImage.style = "";
            else if(target.DangerLevel == 'Impossible') DDO.DataElements.DangerImpossibleImage.style = "";

            if(target.AggroType == 'Sight') DDO.DataElements.AggroSightImage.style = "";
            if(target.AggroType == 'Sound') DDO.DataElements.AggroSoundImage.style = "";
            if(target.AggroType == 'Proximity') DDO.DataElements.AggroProximityImage.style = "";

            
            if (target.Notes.length > 0){
                DDO.DataElements.TargetInformationValue.innerHTML = target.Notes;
            }
            else{
                DDO.DataElements.TargetInformationValue.innerHTML = DDO.Bestiary['Nothing Notable'];
            }
        }
        else{
            DDO.ClearTargetInfo();
        } 
    }

})()