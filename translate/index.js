"use strict";

var getLang = require('./getLang');


function translate(lang, speech){
	var tokens = {
	  translate : "trnsl.1.1.20190121T114853Z.bb13b14c2fb8537f.ff83b8ea03a6c04e712181d5152536e30d16c5f5"
	};
	return getLang(lang, speech, tokens);
}

module.exports = translate;


