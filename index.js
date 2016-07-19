var proCyclingStats = require('./ProCyclingStats');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var TdfSkill = function() {
  AlexaSkill.call(this, process.env.APP_ID); // APP_ID must be defined in `deploy.env`
};

// Extend AlexaSkill
TdfSkill.prototype = Object.create(AlexaSkill.prototype);
TdfSkill.prototype.constructor = TdfSkill;


TdfSkill.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
 console.log("TdfSkill onSessionStarted requestId: " + sessionStartedRequest.requestId +
             ", sessionId: " + session.sessionId);

  // any session init logic would go here
};

TdfSkill.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  console.log("TdfSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " +
              session.sessionId);
  getWelcomeResponse(response);
};

TdfSkill.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " +
              session.sessionId);

  // any session cleanup logic would go here
};

TdfSkill.prototype.intentHandlers = {
  'GetTodayIntent': function(intent, session, response) {
    handleRequest(intent, session, response);
  },

  'GetDayIntent': function(intent, session, response) {
    handleRequest(intent, session, response);
  },

  // 'AMAZON.HelpIntent': function(intent, session, response) {
  //   var speechText = "With History Buff, you can get historical events for any day of the year.  " +
  //                    "For example, you could say today, or August thirtieth, or you can say exit. " +
  //                    "Now, which day do you want?";
  //   var repromptText = "Which day do you want?";
  //   var speechOutput = {
  //     speech: speechText,
  //     type: AlexaSkill.speechOutputType.PLAIN_TEXT
  //   };
  //   var repromptOutput = {
  //     speech: repromptText,
  //     type: AlexaSkill.speechOutputType.PLAIN_TEXT
  //   };
  //   response.ask(speechOutput, repromptOutput);
  // },

  'AMAZON.StopIntent': function(intent, session, response) {
    var speechOutput = {
      speech: "Goodbye",
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tell(speechOutput);
  },

  'AMAZON.CancelIntent': function(intent, session, response) {
    var speechOutput = {
      speech: "Goodbye",
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.tell(speechOutput);
  }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
  // If we wanted to initialize the session to have some attributes we could add those here.
  var cardTitle = "Tour de France";
  var repromptText = "With Tour de France, stay up to date with the race. Do you want today's results?";
  var speechText = "<p>Tour de France.</p> <p>Do you want today's results?</p>";
  var cardOutput = "Tour de France. Do you want today's results?";

  // If the user either does not reply to the welcome message or says something that is not
  // understood, they will be prompted again with this text.

  var speechOutput = {
    speech: "<speak>" + output + "</speak>",
    type: AlexaSkill.speechOutputType.SSML
  };
  var repromptOutput = {
    speech: output,
    type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.askWithCard(speechOutput, repromptOutput, cardTitle, output);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleRequest(intent, session, response) {
  var cardTitle = "Tour de France";

  function ask(output) {
    if (output === undefined || output === '') {
      output = 'There was an error, sorry';
    }

    var speechOutput = {
      speech: "<speak>" + output + "</speak>",
      type: AlexaSkill.speechOutputType.SSML
    };
    response.ask(speechOutput);
  }

  var daySlot;
  if (intent.slots) {
    daySlot = intent.slots.day;
  }

  proCyclingStats.getResults(daySlot).then(ask, ask);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function(event, context) {
  // Create an instance of the TdfSkill.
  var skill = new TdfSkill();
  skill.execute(event, context);
};
