var proCyclingStats = require('./ProCyclingStats');
var Alexa = require('alexa-sdk');

var handlers = {
  'GetTodayIntent': function() {
    handleRequest.call(this);
  },

  'GetDayIntent': function() {
    handleRequest.call(this);
  },
  'AMAZON.StopIntent': function() {
    this.emit(':tell', 'Goodbye');
  },

  'AMAZON.CancelIntent': function() {
    this.emit(':tell', 'Goodbye');
  }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = process.env.APP_ID; // APP_ID must be defined in `deploy.env`
  alexa.registerHandlers(handlers);
  alexa.execute();
};

function getWelcomeResponse(response) {
  // If we wanted to initialize the session to have some attributes we could add those here.
  var cardTitle = "Tour de France";
  var repromptText = "With Tour de France, stay up to date with the race. Do you want today's results?";
  var speechText = "<p>Tour de France.</p> <p>Do you want today's results?</p>";
  var cardOutput = "Tour de France. Do you want today's results?";

  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.

  response.askWithCard(speechOutput, repromptOutput, cardTitle, output);
}

function ask(output) {
  if (output === undefined || output === '') {
    output = 'There was an error, sorry';
  }

  this.emit(':tell', output);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleRequest() {
  var daySlot;
  if (this.event.request.intent.slots) {
    daySlot = this.event.request.intent.slots.day;
  }

  var that = this;
  proCyclingStats.getResults(daySlot).then(
    function(output) {
      ask.call(that, output);
    },
    function(output) {
      ask.call(that, output);
    }
  );
}
