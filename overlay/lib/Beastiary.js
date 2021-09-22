'use strict'

;(function()
{
    const PATH = 'lang/';

    function LoadBeastiary(language, callback)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => 
        {
            if(xhttp.status == 404 && language == 'en')
            {
                console.log("ERROR: Cannot find beastiary file for: " + language);
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
                DDO.Beastiary = json;
                if (callback) callback();
            }
        };
    
        xhttp.open('GET', PATH + 'beastiary_' + language + '.json', true);
        xhttp.send();
    }

    window.DDO.LoadBeastiary = LoadBeastiary;

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
        let beastiaryIndex = DDO.currentFloor % 10 > 0 ? Math.floor(DDO.currentFloor / 10) : Math.floor(DDO.currentFloor / 10 - 1);
        var target = DDO.Beastiary[DDO.currentInstance][beastiaryIndex][targetName];
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
                DDO.DataElements.TargetInformationValue.innerHTML = DDO.Beastiary['Nothing Notable'];
            }
        }
        else{
            DDO.ClearTargetInfo();
        } 
    }

})()