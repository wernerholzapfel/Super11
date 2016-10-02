var wedstrijdenUitslag = require("./models/wedstrijdenScoreformsModel");
var wedstrijdenStand = require("./models/wedstrijdenStandModel");
var predictions = require("./models/predictionModel");
var calculatetotaalstand = require("./calculatetotaalstand.js");

var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.calculateWedstrijdScore = function () {

  async.waterfall([
    function (callback) {
      //hier worden alle uitslagen opgehaald
      wedstrijdenUitslag.findOne({}).exec(function (err, wedstrijdScore) {
        if (err) return console.error(err);
        callback(null, wedstrijdScore);
      });
    },
    function (wedstrijdScore, callback) {
      //hier worden alle voorspellingen ophgehaald van de deelnemers
      predictions.find({}, {}).exec(function (err, predictions) {
        if (err) return console.error(err);
        callback(null, wedstrijdScore, predictions);
      });
    },
    function (wedstrijdScore, predictions, callback) {
      async.each(predictions, function (prediction, callback) {
        var stand = new wedstrijdenStand;
        stand.TotalMatchesScore = 0;
        stand.Participant = prediction.Participant;
        stand.MatchesScore = [];

        async.each(prediction.Matches, function (match, callback) {
          var scoreMatches = _.find(wedstrijdScore.Matches, function (o) { return o.Id === parseInt(match.Id); });

          if (scoreMatches.Home != null) {
            var matchScore = new Object;
            matchScore.Score = setMatchScore(scoreMatches, match);
            matchScore.Match = match.Match;
            matchScore.Home = match.Home;
            matchScore.Away = match.Away;
            matchScore.Id = match.Id;
            matchScore.Uitslag = scoreMatches.Home + "-" + scoreMatches.Away,
              matchScore.RoundId = scoreMatches.RoundId,
              stand.TotalMatchesScore = stand.TotalMatchesScore + matchScore.Score;
            stand.MatchesScore.push(matchScore);
          }
        },
          function (err) {
            console.log("err: " + err);
          }
        );
        //necessary to overwrite teamStand
        var standToUpdate = {};
        standToUpdate = Object.assign(standToUpdate, stand._doc);
        delete standToUpdate._id;

        wedstrijdenStand.findOneAndUpdate({ 'Participant.Email': prediction.Participant.Email }, standToUpdate, ({ upsert: true }), function (err, stand) {
          if (err) return console.error("error: " + err);
          console.log("saved wedstrijdenstand for : " + prediction.Participant.Name);
          callback();
        });
      },
        function (err) {
          // if any of the file processing produced an error, err would equal that error
          if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
          } else {
            console.log('Go calculate totaalstand');
            var latestRoundId = _.maxBy(wedstrijdScore.Matches, 'RoundId');
            for (var i = 0; i < latestRoundId.RoundId; i += 1) {
              calculatetotaalstand.calculatetotaalstand(parseInt(i+1));
            }
          }
        });
    }
  ], function (err) {
    if (err) console.log("error occured");
  });
};

var setMatchScore = function (uitslag, voorspelling) {
  var uitslagToto = determineToto(uitslag);
  var voorspellingToto = determineToto(voorspelling);

  if (uitslagToto == voorspellingToto) {
    if (uitslag.Home == voorspelling.Home && uitslag.Away == voorspelling.Away) {
      return 10;
    }
    else {
      return 3;
    }
  }
  else {
    return 0;
  }
};

var determineToto = function (match) {
  if (match.Home > match.Away) {
    return 1;
  }
  if (match.Home < match.Away) {
    return 2;
  }
  else {
    return 3;
  }
};


