var Predictions = require("./predictionModel.js")

var calculateTeamPredictionsPerRound = function () {
//todo get all players
//todo get all predictions
//loop through all predictions
//get all
  Predictions.find(function (err, predictions) {
    if (err) return console.error(err);
    console.log(predictions);
  })


};

calculateTeamPredictionsPerRound();