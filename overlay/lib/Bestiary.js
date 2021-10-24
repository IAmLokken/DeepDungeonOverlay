'use strict'

;(function()
{
    const PATH = 'lang/';

    function LoadBestiary(path, language, callback)
    {
        var xhttpNotes = new XMLHttpRequest();
        var xhttpInfo = new XMLHttpRequest();
        xhttpNotes.onreadystatechange = () => 
        {
            if(xhttpNotes.status == 404 && language == 'en')
            {
                console.log("ERROR: Cannot find bestiary file for: " + language);
                return;
            }
            if(xhttpNotes.status === 404)
            {
                this.LoadLanguage('en');
                return;
            }
            if (xhttpNotes.readyState === 4 && xhttpNotes.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttpNotes.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                DDO.Bestiary.Notes = json;
                if (callback) callback();
            }
        };

        xhttpInfo.onreadystatechange = () => 
        {
            if(xhttpInfo.status == 404 && language == 'en')
            {
                console.log("ERROR: Cannot find bestiary file for: " + language);
                return;
            }
            if(xhttpInfo.status === 404)
            {
                this.LoadLanguage('en');
                return;
            }
            if (xhttpInfo.readyState === 4 && xhttpInfo.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttpInfo.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                DDO.Bestiary.Info = json;
                if (callback) callback();
            }
        };
    
        xhttpNotes.open('GET', path + 'bestiary_' + language + '.json', true);
        xhttpNotes.send();
        xhttpInfo.open('GET', path + 'enemy_info.json', true);
        xhttpInfo.send();
    }

    window.DDO.LoadBestiary = LoadBestiary;

    DDO.ClearTargetInfo = function()
    {
        DDO.DataElements.TargetNameValue.innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings['NoTargetLabel'];
        DDO.DataElements.TargetHPPValue.innerText = "-";
        DDO.TurnTargetImagesOff();
        DDO.DataElements.TargetInformationValue.innerHTML = "-";
        if (DDO.DataElements.MainBody){
            DDO.DataElements.MainBody.style.display = "none";
        }
    }

    DDO.CheckCCAgainstJob = function(){

    }

    DDO.DisplayTargetInfo = function(data)
    {
        let targetName = data.Target.Name;
        let bestiaryIndex = DDO.currentFloor % 10 > 0 ? Math.floor(DDO.currentFloor / 10) : Math.floor(DDO.currentFloor / 10 - 1);
        var target = DDO.Bestiary.Notes[DDO.currentInstance][bestiaryIndex][targetName.toUpperCase()];
        
        if(typeof(target) !== 'undefined'){
            var targetInfo = DDO.Bestiary.Info[DDO.currentInstance][bestiaryIndex][target.EnglishName];
           
            DDO.DataElements.TargetNameValue.innerText = data.Target.Name;
            DDO.DataElements.TargetHPPValue.innerText = ((data.Target.CurrentHP / data.Target.MaxHP) * 100).toFixed(2) + '%';
            DDO.TurnTargetImagesOff();

            if(targetInfo.DangerLevel == 'Easy') DDO.DataElements.DangerEasyImage.style = "";
            else if(targetInfo.DangerLevel == 'Caution') DDO.DataElements.DangerCautionImage.style = "";
            else if(targetInfo.DangerLevel == 'Scary') DDO.DataElements.DangerScaryImage.style = "";
            else if(targetInfo.DangerLevel == 'Impossible') DDO.DataElements.DangerImpossibleImage.style = "";

            if(targetInfo.AggroType == 'Sight') DDO.DataElements.AggroSightImage.style = "";
            else if(targetInfo.AggroType == 'Sound') DDO.DataElements.AggroSoundImage.style = "";
            else if(targetInfo.AggroType == 'Proximity') DDO.DataElements.AggroProximityImage.style = "";

            if (DDO.DataElements.StunImage){
                //if (DDO.Bestiary.Info["JobCC"][DDO.playerJob]["Stun"]){
                    DDO.DataElements.StunImage.style.display = targetInfo.Stun ? "" : "none";
                    DDO.DataElements.StunDisabledImage.style.display = targetInfo.Stun ? "none" : "";
                //}
                //else{
                //    DDO.DataElements.StunImage.style.display = "none";
                //    DDO.DataElements.StunDisabledImage.style.display = "none";
                //}
            }
            if (DDO.DataElements.SleepImage){
                //if (DDO.Bestiary.Info["JobCC"][DDO.playerJob]["Sleep"]){
                    DDO.DataElements.SleepImage.style.display = targetInfo.Sleep ? "" : "none";
                    DDO.DataElements.SleepDisabledImage.style.display = targetInfo.Sleep ? "none" : "";
                //}
                //else{
                //    DDO.DataElements.SleepImage.style.display = "none";
                //    DDO.DataElements.SleepDisabledImage.style.display = "none";
                //}
            }
            if (DDO.DataElements.SlowImage){
                //if (DDO.Bestiary.Info["JobCC"][DDO.playerJob]["Slow"]){
                    DDO.DataElements.SlowImage.style.display = targetInfo.Slow ? "" : "none";
                    DDO.DataElements.SlowDisabledImage.style.display = targetInfo.Slow ? "none" : "";
                //}
                //else{
                //    DDO.DataElements.SlowImage.style.display = "none";
                //    DDO.DataElements.SlowDisabledImage.style.display = "none";
                //}
            }
            if (DDO.DataElements.HeavyImage){
                //if (DDO.Bestiary.Info["JobCC"][DDO.playerJob]["Heavy"]){
                    DDO.DataElements.HeavyImage.style.display = targetInfo.Heavy ? "" : "none";
                    DDO.DataElements.HeavyDisabledImage.style.display = targetInfo.Heavy ? "none" : "";
                //}
                //else{
                //    DDO.DataElements.HeavyImage.style.display = "none";
                //    DDO.DataElements.HeavyDisabledImage.style.display = "none";
                //}
            }
            if (DDO.DataElements.BindImage){
                //if (DDO.Bestiary.Info["JobCC"][DDO.playerJob]["Heavy"]){
                    DDO.DataElements.BindImage.style.display = targetInfo.Bind ? "" : "none";
                    DDO.DataElements.BindDisabledImage.style.display = targetInfo.Bind ? "none" : "";
                //}
                //else{
                //    DDO.DataElements.BindImage.style.display = "none";
                //    DDO.DataElements.BindDisabledImage.style.display = "none";
                //}
            }
            if (DDO.DataElements.ResolutionImage){
                if (DDO.currentInstance.includes('Heaven-on-High')){
                    DDO.DataElements.ResolutionImage.style.display = "none";
                    DDO.DataElements.ResolutionDisabledImage.style.display = "none";                    
                }
                else{
                    DDO.DataElements.ResolutionImage.style.display = targetInfo.Resolution ? "" : "none";
                    DDO.DataElements.ResolutionDisabledImage.style.display = targetInfo.Resolution ? "none" : "";
                }
            }
            
            if (target.Notes.length > 0){
                if (target.Notes.startsWith('*')){
                    let notes = target.Notes.replace(/\*/g, '').trim();
                    DDO.DataElements.TargetInformationValue.innerHTML = DDO.Bestiary.Notes[notes];
                }
                else
                    DDO.DataElements.TargetInformationValue.innerHTML = target.Notes;
            }
            else{
                DDO.DataElements.TargetInformationValue.innerHTML = DDO.Bestiary.Notes['Nothing Notable'];
            }

            if (DDO.DataElements.MainBody){
                DDO.DataElements.MainBody.style.display = "";
            }
        }
        else{
            DDO.ClearTargetInfo();
        }         
    }
})()