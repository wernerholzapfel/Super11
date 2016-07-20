var eredivisiePlayers = require("./eredivisiePlayersModel")
var predictions = require("./predictionModel");
var async = require("async");
var _ = require('lodash');

var exports = module.exports = {};

exports.setNumberOfTimesAplayerIsSelected = function () {
    console.log("start determine if player is selected")
    async.waterfall([
        function (callback) {
            eredivisiePlayers.find({}, {}).exec(function (err, eredivisiePlayersList) {
                console.log("eredivisiePlayersList length: " + eredivisiePlayersList[0].Player.length)
                if (err) return console.error(err);

                callback(null, eredivisiePlayersList);
            });
        },
        function (eredivisiePlayersList, callback) {
            predictions.find({}, {}).exec(function (err, predictionsList) {
                console.log("predictionsList length: " + predictionsList.length)
                if (err) return console.error(err);
                callback(null, eredivisiePlayersList, predictionsList);
            });
        },
        function (eredivisiePlayersList, predictionsList, callback) {
            async.each(predictionsList, function (predictionItem, callback) {
                async.each(predictionItem.Team, function (player, callback) {
                    
                    if(player) {
                    eredivisiePlayers.update({ 'Player.Id': parseInt(player.PlayerId) }, {
                        '$set': {
                            'Player.$.Selected': true
                        }
                    }, function (err, updatedPlayer) {
                        if (err) return console.error("error: " + err);
                        console.log("saved eredivisiePlayersList " + updatedPlayer);
                    });
                }}, function (err) {
                    console.log("err" + err)
                });


                //save to mongodb;
            }, function (err) {
                console.log("err: " + err);
            });


        },
    ]);
};
