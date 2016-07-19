var https = require('https');
var defer = require('node-promise').defer;
var moment = require('moment');
require('moment-timezone');

var RESULT_IDS = {
  '2016-07-02': 163713, // stage 1
  '2016-07-03': 163714,
  '2016-07-04': 163715,
  '2016-07-05': 163716,
  '2016-07-06': 163717,
  '2016-07-07': 163718,
  '2016-07-08': 163719,
  '2016-07-09': 163720,
  '2016-07-10': 163721,
  '2016-07-11': 163721, // rest day
  '2016-07-12': 163723,
  '2016-07-13': 163724,
  '2016-07-14': 163725,
  '2016-07-15': 163726,
  '2016-07-16': 163727,
  '2016-07-17': 163728,
  '2016-07-18': 163729,
  '2016-07-19': 163729, // rest day
  '2016-07-20': 163731,
  '2016-07-21': 163732,
  '2016-07-22': 163733,
  '2016-07-23': 163734,
  '2016-07-24': 163735
};

function getResults(daySlot, successCallback, errorCallback) {
  var raceDate;

  if (daySlot && daySlot.value) {
    raceDate = moment(daySlot.value);
  } else {
    raceDate = moment();
    raceDate.tz('America/Los_Angeles');
  }

  var id = RESULT_IDS[raceDate.format('YYYY-MM-DD')];
  if (!id) {
    errorCallback('Sorry, no race results.');
    return;
  }

  var path = '/api/app/v2/race_results.php?id=' + id;
  var requestOptions = {
    hostname: 'www.procyclingstats.com',
    port: 443,
    path: path,
    method: 'GET',
    headers: {
      'User-Agent': 'pcs/1.4.2 (iPhone; iOS 9.3.2; Scale/2.00)',
      'Accept-Language': 'en-US;q=1'
    }
  };

  https.get(requestOptions, function(response) {
    var body = '';

    response.setEncoding('utf8');

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      successCallback(body);
    });
  }).on('error', function(e) {
    console.log('Got error: ', e);
    errorCallback(e);
  });
}

function parseResults(response, deferred) {
  if (response === undefined) {
    deferred.reject('Error, no response.');
    return;
  }

  var json = JSON.parse(response);
  if (json.results && json.results.length > 0) {
    var result = json.results[0];
    deferred.resolve('Stage winner, ' + result.rider + ' of ' + result.team);
  } else {
    deferred.reject('Error, no results.');
  }
}

exports.getResults = function(daySlot) {
  var deferred = defer();

  getResults(
    daySlot,
    function(response) {
      parseResults(response, deferred);
    },
    function(error) {
      deferred.reject(error);
    }
  );

  return deferred.promise;
};
