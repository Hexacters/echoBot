"use strict";

var request = require("request");



function translateLang (langCode, speech, tokens) {
	//Translate Process
	var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?"
	var params = "key=" +tokens.translate + " &text=" + speech + "&lang=" + langCode
	console.log(speech, '--------' , langCode);
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
            	console.log(JSON.parse(body).text);
                resolve(JSON.parse(body).text);
            }
        })
    });

}

module.exports = translateLang;
