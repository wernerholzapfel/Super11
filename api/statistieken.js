var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var Predictions = require("../models/predictionModel");

apiRoutes.get("/teamstatistieken/", function (req, res, next) {
    Predictions.aggregate([

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

module.exports = apiRoutes;

// var express = require("express");
// var apiRoutes = express.Router();
// var mongoose = require('mongoose');
//
// var TeamPredictions = require("../models/teamPredictionsModel");
//
// apiRoutes.get("/teamstatistieken/", function (req, res, next) {
//   TeamPredictions.aggregate([
//     { $sort: { RoundId: -1 } },
//     {
//       $group: {
//         _id: {
//           email: "$Participant.Email",
//           playerName: "$TeamScores.Name",
//
//         },
//         RoundId: { $first: '$RoundId' },
//         Participant: { $first: "$Participant" },
//         Formation: { $first: "$Formation" },
//         CaptainId: { $first: "$CaptainId" },
//         Team: { $first: "$Team" },
//       },
//     },
//     { $unwind: "$Team" },
//     {
//       $group: {
//         _id: {
//           playerId: "$Team.PlayerId"
//         },
//         Count: { $sum: 1 },
//         Team: { $first: "$Team.Team" },
//         Position: { $first: "$Team.Position" },
//         PlayerName: { $first: "$Team.PlayerName" },
//         PlayerId: { $first: "$Team.PlayerId" },
//       }
//     }
//     , {
//       $project:
//       {
//         _id: 0,
//         Count: 1,
//         Team: 1,
//         Position: 1,
//         PlayerName: 1,
//         PlayerId: 1
//       }
//     },
//     { $sort: { Count: -1 } }
//   ], function (err, teamstatistieken) {
//     if (err) {
//       handleError(res, err.message, "failed to get teamstatistieke ")
//     }
//     else {
//       res.status(200).json(teamstatistieken);
//     }
//   }
//   )
// });
//
// module.exports = apiRoutes;