'use strict'

;(function()
{
    const PATH = 'lang/'

    class Locale
    {
        constructor(path, language, callback)
        {
            this.Languages = {}
            this.CurrentLanguage = language || 'en'
            this.LoadLanguage(path, language, callback);
        }

        LoadLanguage(path, language, callback)
        {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = ()=> 
            {
                if(xhttp.status == 404 && language == 'en')
                {
                    console.log("ERROR: Cannot find locale file for: " + language);
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
                    this.Languages[language] = json;
                    if (callback) callback();
                }
            };
            xhttp.open('GET', path + language + '.json', true);
            xhttp.send();
        }
    }

    window.DDO.Locale = Locale;

    DDO.TranslateUI = function()
    {
        var translationElements = document.getElementsByClassName("Translate");

        for (var i=0; i<translationElements.length; i++)
        {
            translationElements[i].innerText = DDO.localeInformation.Languages[DDO.localeInformation.CurrentLanguage].UIStrings[translationElements[i].id];
        }

        if (DDO.SaveFiles['the Palace of the Dead'].length > 0)
            DDO.DataElements.POTDButton.innerText += ` (${DDO.SaveFiles['the Palace of the Dead'].length})`;
        if (DDO.SaveFiles['Heaven-on-High'].length > 0)
            DDO.DataElements.HOHButton.innerText += ` (${DDO.SaveFiles['Heaven-on-High'].length})`;
        if (DDO.SaveFiles['Eureka Orthos'] && DDO.SaveFiles['Eureka Orthos'].length > 0)
            DDO.DataElements.EOButton.innerText += ` (${DDO.SaveFiles['Eureka Orthos'].length})`;
    }

})()