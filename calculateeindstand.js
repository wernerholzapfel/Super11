var eindstandUitslag = require("./models/eindstandScoreformsModel");
var eindstandStand = require("./models/eindstandStandModel");
var predictions = require("./models/predictionModel");
// var calculatetotaalstand = require("./calculatetotaalstand.js");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.calculateEindstand = function () {

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
    function (playerRoundScore, predictions, callback) {
      async.each(predictions, function (prediction, callback) {
        var stand = new eindstandStand;
        stand.TotalEindstandScore = 0;
        stand.Participant = prediction.Participant;
        stand.TableScore = []

        async.each(prediction.Table, function (line, callback) {
          var predictedLine = _.find(playerRoundScore.Table, function (o) { return o.SelectedTeam === line.SelectedTeam; });

          if (predictedLine) {
            var lineScore = new Object;
            lineScore.Score = setLineScore(predictedLine, line),
            lineScore.UitslagPosition = line.Position,
            lineScore.UitslagSelectedTeam = line.SelectedTeam,
            lineScore.SelectedTeam = predictedLine.SelectedTeam,  
            lineScore.Position = predictedLine.Position
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
        });
      },
        callback());
    },
    function () {
      // calculatetotaalstand.calculatetotaalstand();
    },
    function (err) {
      console.log("err" + err)
    }

  ]);
};

var setLineScore = function (scoreLine, line) {
  var diff = scoreLine.Position - line.Position;
  var positiveDiff = Math.abs(diff);

  if (positiveDiff === 0 && scoreLine.Position === 1) {
    return 20;
  }
  if (positiveDiff === 0){
    return 10;
  }
  if (positiveDiff === 1) {
    return 3;
  }
  if (positiveDiff === 2) {
    return 1;
  }
  else {
    return 0;
  }
};

