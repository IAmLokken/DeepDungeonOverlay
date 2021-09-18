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

})()