var exports = module.exports = {};
var async = require("async");


var Predictions = require("./models/predictionModel");
var Teampredictions = require("./models/teamPredictionsModel");

exports.copyTeamsToNewTable = function () {

    async.waterfall([
        function (callback) {
            Predictions.find({}, {createDate: 0}, function (err, predictionsList) {
                if (err) {
                    handleError(res, err.message, "Failed to get predictions.");
                }
                callback(null, predictionsList)
            });
        },
        function (predictionsList, callback) {
            async.each(predictionsList, function (teampredictions, callback) {
                var updatedteamprediction = new Teampredictions;
                updatedteamprediction.RoundId = 0;
                updatedteamprediction.Team = teampredictions.Team;
                updatedteamprediction.Participant = teampredictions.Participant;
                updatedteamprediction.Formation = teampredictions.Formation;
                updatedteamprediction.CaptainId = teampredictions.CaptainId;

                Teampredictions.findOneAndUpdate({
                    'Participant.Email': updatedteamprediction.Participant.Email,
                    RoundId: 0
                }, updatedteamprediction, ({upsert: true}), function (err, newPrediction) {
                    if (err) {
                        console.log("er is iets misgegaan bij verhuizen van teams");
                    } else {
                        console.log("teampredictions opgeslagen");
                    }
                });
            });
        }


    ]);
};