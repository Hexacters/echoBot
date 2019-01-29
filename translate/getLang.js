"use strict";

var request = require("request");
var translateLang = require('./translateLang');

//get Language Code
function getLang (lang, speech, tokens) {
	var url = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?"
	var params = "key=" +tokens.translate + "&ui=en"
	console.log("---", speech);
	var options = {
        url: url+params
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
            	const langC = JSON.parse(body);
			    var langCodes = langC.langs;
			    var langCode = '';
				for(var key in langCodes){
					if (langCodes[key].toLowerCase() === lang.toLowerCase()) {
					  langCode = key;
					}
				}
                resolve(langCode ? translateLang(langCode, speech, tokens) : null);
            }
        })
    });

}

module.exports = getLang;
