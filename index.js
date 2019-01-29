"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const restService = express();

var translate = require('./translate/index');

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

let defaultValues = ["doing", "hello", "hai", "hi", "date", "time", "status", "Hexa", "about you"];
restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  //var speech = req.body.tr ? req.body.tr.toLowerCase() : "Seems like some problem. Speak again.";
   console.log(req.body.originalDetectIntentRequest.payload.data);
   var speech =
       req.body.queryResult &&
       req.body.queryResult.parameters &&
       req.body.queryResult.parameters.echoText
         ? req.body.queryResult.parameters.echoText
         : "Seems like some problem. Speak again.";

  var element = '';
  let translateArray = ["translate", "say"];
  let conjectionArray = ["in"];
  if (translateArray.some(substring=>speech.includes(substring)) && conjectionArray.some(substring=>speech.includes(substring))) {

    var lang = '';
    conjectionArray.some(substring=> {
      if(speech.includes(substring)){
         var l = speech.lastIndexOf(substring);
         lang = speech.substring(l).replace(substring, '').trim();
         speech = speech.replace(speech.substring(l), '').trim();
      }
    });
    translateArray.some(substring=>{
      speech = speech.replace(substring, '');
    });

    speech = speech.replace(lang, '').trim();
    console.log(lang, speech);
    //Translate
    translate(lang, speech).then(function(speech){
      if (!speech) {
        speech = "Sorry! i can't Understand!.. :("
      }
      return res.json({
          fulfillmentText:speech,
          fulfillmentMessages:[
            {
              text: {
                  text: [
                     speech
                  ]
              }
            }
          ],
          source:"Copy Cat"
      });
    });
    
  } else {
      defaultValues.map(s => {
        if (speech.includes(s)) {
          element = s;
        }
      });
      console.log(element);
      switch (element) {
      //Speech Synthesis Markup Language 
      case "date":
        var datetime = new Date();
        speech =
          '<speak>Today is ' + datetime.toISOString().slice(0,10) + '</speak>';
        break;
      case "time":
          var currentTime = new Date();
          var currentOffset = currentTime.getTimezoneOffset();
          var ISTOffset = 330;   // IST offset UTC +5:30 
          var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
          // ISTTime now represents the time in IST coordinates
          var hours = ISTTime.getHours();
          var min = ISTTime.getMinutes();
          var ampm = hours >= 12 ? 'PM' : 'AM';
          hours = ((hours + 11) % 12 + 1);
          var time = new Date().getTime();
        speech =
          '<speak>It is ' + hours + ':' + min + ' ' + ampm + ' now</speak>';
        break;

      case "hai":
      case "hello":
      case "haii":
      case "hi":
        var userData = req.body.originalDetectIntentRequest.payload;
        speech =
          'Haii ' + (!!userData ? userData.data.user.name : '') + '...! :)';
        break;

      case "about you":
      case "status":
        if (req.body.originalDetectIntentRequest.source) {
        speech = 
          'Haii ' + req.body.originalDetectIntentRequest.payload.data.user.name + '..! :) \n' +
          'Now i am in ' + req.body.originalDetectIntentRequest.source + '\n' +
          'My status is Online';
        } else {
          speech = 'I am online Now';
        }
        break;
      case "doing":
        speech = 
          'I am doing Well what About You';
        break;
      }

      return res.json({
         fulfillmentText:speech,
         fulfillmentMessages:[
            {
                text: {
                    text: [
                       speech
                    ]
                }
            }
        ],
        source:"Hexa"
      });
  }

  
});

restService.listen(port, function() {
  console.log("Server up and listening");
});
