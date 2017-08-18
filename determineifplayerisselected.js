var eredivisiePlayers = require("./models/eredivisiePlayersModel");
var Teampredictions = require('./models/teamPredictionsModel');

// var predictions = require("./models/predictionModel");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.setNumberOfTimesAplayerIsSelected = function () {
    console.log("start determine if player is selected");
    async.waterfall([
        function (callback) {
            eredivisiePlayers.find({}, {}).exec(function (err, eredivisiePlayersList) {
                console.log("eredivisiePlayersList length: " + eredivisiePlayersList[0].Player.length)
                if (err) return console.error(err);

                callback(null, eredivisiePlayersList);
            });
        },
        function (eredivisiePlayersList, callback) {
            Teampredictions.aggregate(
                [{$match: {RoundId: {$gte: parseInt("0")}}},
                    {$sort: {RoundId: -1}},
                    {
                        $group: {
                            _id: {
                                email: "$Participant.Email",
                                playerName: "$TeamScores.Name"
                            },
                            RoundId: {$first: '$RoundId'},
                            Participant: {$first: "$Participant"},
                            Formation: {$first: "$Formation"},
                            CaptainId: {$first: "$CaptainId"},
                            Team: {$first: "$Team"}
                        }
                    }
                ], function (err, predictionsList) {
                    console.log("predictions length: " + predictionsList.length)
                    if (err) return console.error(err);
                    callback(null, eredivisiePlayersList, predictionsList);
                });
        },
        function (eredivisiePlayersList, predictionsList, callback) {
            async.each(eredivisiePlayersList[0].Player, function (player, callback) {
                if (player.Selected) {
                    eredivisiePlayers.update({'Player.Id': player.Id}, {
                        '$set': {
                            'Player.$.Selected': false
                        }
                    }, function (err, updatedPlayer) {
                        if (err) return console.error("error: " + err);
                        console.log("set player unselected ");
                    });
                }
            });
            callback(null, eredivisiePlayersList, predictionsList);
        },
        function (eredivisiePlayersList, predictionsList, callback) {
            async.each(predictionsList, function (predictionItem, callback) {
                async.each(predictionItem.Team, function (player, callback) {
                    //save to mongodb;
                    if (player && player.PlayerId) {
                        eredivisiePlayers.update({'Player.Id': parseInt(player.PlayerId)}, {
                            '$set': {
                                'Player.$.Selected': true
                            }
                        }, function (err, updatedPlayer) {
                            if (err) return console.error("error: " + err);
                            console.log("set player selected " + player);
                        });
                    }
                }, function (err) {
                    console.log("err" + err)
                });

            }, function (err) {
                console.log("err: " + err);
            });
        }
    ]);
};
