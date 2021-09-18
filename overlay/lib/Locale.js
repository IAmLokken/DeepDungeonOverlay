'use strict'

;(function()
{
    const PATH = 'lang/'

    class Locale
    {
        constructor(language, callback)
        {
            this.Languages = {}
            this.CurrentLanguage = language || 'en'
            this.LoadLanguage(language, callback);
        }

        LoadLanguage(language, callback)
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
            xhttp.open('GET', PATH + language + '.json', true);
            xhttp.send();
        }
    }

    window.DDO.Locale = Locale;
})()