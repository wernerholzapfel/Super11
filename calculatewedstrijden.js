var wedstrijdenUitslag = require("./wedstrijdenScoreformsModel");
var wedstrijdenStand = require("./wedstrijdenStandModel");
var predictions = require("./predictionModel");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.calculateWedstrijdScore = function () {

  async.waterfall([
    function (callback) {
      //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
      wedstrijdenUitslag.findOne({}).exec(function (err, wedstrijdScore) {
        if (err) return console.error(err);
        callback(null, wedstrijdScore);
      })
    },
    function (wedstrijdScore, callback) {
      //hier worden alle voorspellingen ophgehaald van de deelnemers
      // console.log("playerRoundScore 2e lenght: " + playerRoundScore.length)
      predictions.find({}, {}).exec(function (err, predictions) {
        // console.log("predictions length: " + predictions.length)
        if (err) return console.error(err);
        callback(null, wedstrijdScore, predictions);
      })
    },
    function (wedstrijdScore, predictions, callback) {
      async.each(predictions, function (prediction, callback) {
        var stand = new wedstrijdenStand;
        stand.TotalMatchesScore = 0;
        stand.Participant = prediction.Participant;
        stand.MatchesScore = []

        async.each(prediction.Matches, function (match, callback) {
          var scoreMatches = _.find(wedstrijdScore.Matches, function (o) { return o.Id === parseInt(match.Id); });

          if (scoreMatches.Home != null) {
            var matchScore = new Object;
            matchScore.Score = setMatchScore(scoreMatches, match);
            matchScore.Match = match.Match
            matchScore.Home = match.Home
            matchScore.Away = match.Away
            matchScore.Id = match.Id
            matchScore.Uitslag = scoreMatches.Home + "-" + scoreMatches.Away,

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

        wedstrijdenStand.findOneAndUpdate({'Participant.Email': prediction.Participant.Email }, standToUpdate, ({ upsert: true }), function (err, stand) {
          if (err) return console.error("error: " + err);
          console.log("saved wedstrijdenstand for : " + prediction.Participant.Name);
        });
      }, function (err) {
        console.log("err" + err)
      });
    }
  ]);
};

var setMatchScore = function (uitslag, voorspelling) {
  var uitslagToto = determineToto(uitslag);
  var voorspellingToto = determineToto(voorspelling)

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
}

var determineToto = function (match) {
  if (match.Home > match.Away) {
    return 1
  }
  if (match.Home < match.Away) {
    return 2
  }
  else {
    return 3
  }
};


