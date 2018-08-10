var eindstandUitslag = require("./models/eindstandScoreformsModel");
var eindstandStand = require("./models/eindstandStandModel");
var predictions = require("./models/predictionModel");
var calculatetotaalstand = require("./calculatetotaalstand.js");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.calculateEindstand = function (roundId) {

  async.waterfall([
    function (callback) {
      //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
      eindstandUitslag.findOne({}).exec(function (err, eindstandscore) {
        if (err) return console.error(err);
        callback(null, eindstandscore);
      })
    },
    function (eindstandscore, callback) {
      //hier worden alle voorspellingen ophgehaald van de deelnemers
      // console.log("playerRoundScore 2e lenght: " + playerRoundScore.length)
      predictions.find({}, {}).exec(function (err, predictions) {
        // console.log("predictions length: " + predictions.length)
        if (err) return console.error(err);
        callback(null, eindstandscore, predictions);
      })
    },
      function (eindstandscore, predictions, callback) {
      async.each(predictions, function (prediction, callback) {
        var stand = new eindstandStand;
        stand.TotalEindstandScore = 0;
        stand.Participant = prediction.Participant;
        stand.TableScore = []

              async.each(prediction.Table, function (voorspelling, callback) {
                      var werkelijk = _.find(eindstandscore.Table, function (o) {
                          return o.SelectedTeam === voorspelling.SelectedTeam;
                      });

                      if (werkelijk) {
            var lineScore = new Object;
                          lineScore.Score = setLineScore(werkelijk, voorspelling),
                              lineScore.UitslagPosition = werkelijk.Position,
                              lineScore.UitslagSelectedTeam = werkelijk.SelectedTeam,
                              lineScore.SelectedTeam = voorspelling.SelectedTeam,
                              lineScore.Position = voorspelling.Position,
            stand.TotalEindstandScore = stand.TotalEindstandScore + lineScore.Score;

            stand.TableScore.push(lineScore);
          }
          else {
            var lineScore = new Object;
            lineScore.Score = 0,

              stand.TotalEindstandScore = stand.TotalEindstandScore + lineScore.Score;

            stand.TableScore.push(lineScore);
          }
        },
          function (err) {
            console.log("err: " + err);
          }
        );
        //necessary to overwrite vragenStand
        var standToUpdate = {};
        standToUpdate = Object.assign(standToUpdate, stand._doc);
        delete standToUpdate._id;

        eindstandStand.findOneAndUpdate({ 'Participant.Email': prediction.Participant.Email }, standToUpdate, ({ upsert: true }), function (err, stand) {
          if (err) return console.error("error: " + err);
          console.log("saved eindstandstand for : " + prediction.Participant.Name);
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
              calculatetotaalstand.calculatetotaalstand(roundId);
          }
        });
    }
  ], function (err) {
    if (err) console.log("error occured");
  });
};

var setLineScore = function (scoreLine, line) {
  var diff = scoreLine.Position - line.Position;
  var positiveDiff = Math.abs(diff);

  if (positiveDiff === 0 && scoreLine.Position === 1) {
      return 15;
  }
  if (positiveDiff === 0) {
    return 10;
  }
  if (positiveDiff === 1) {
      return 5;
  }
    if (positiveDiff === 2) {
        return 3;
  }
  else {
    return 0;
  }
};

