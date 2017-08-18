var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

// var Predictions = require("../models/predictionModel");
var Teampredictions = require("../models/teamPredictionsModel");


apiRoutes.get("/teamstatistieken/", function (req, res, next) {
    Teampredictions.aggregate([
            {$unwind: "$Team"},
            {
                $group: {
                    _id: {
                        playerId: "$Team.PlayerId"
                    },
                    Count: {$sum: 1},
                    Team: {$first: "$Team.Team"},
                    Position: {$first: "$Team.Position"},
                    PlayerName: {$first: "$Team.PlayerName"},
                    PlayerId: {$first: "$Team.PlayerId"},
                }
            }
            , {
                $project: {
                    _id: 0,
                    Count: 1,
                    Team: 1,
                    Position: 1,
                    PlayerName: 1,
                    PlayerId: 1
                }
            },
            {$sort: {Count: -1}}
        ], function (err, teamstatistieken) {
            if (err) {
                handleError(res, err.message, "failed to get teamstatistieke ")
            }
            else {
                res.status(200).json(teamstatistieken);
            }
        }
    )
});


apiRoutes.get("/welkedeelnemershebbendezespeler/:Id", function (req, res, next) {

    Teampredictions.find({'Team.PlayerId': req.params.Id}, {'_id': 0, 'Participant.Name': 1}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to get prediction.");
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = apiRoutes;
