var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var Predictions = require("../models/predictionModel");
var Teampredictions = require("../models/teamPredictionsModel");

apiRoutes.get("/predictions/:Id", function(req, res, next) {
    Predictions.findById(req.params.Id, { createDate: 0 }, function(err, prediction) {
        if (err) {
            handleError(res, err.message, "Failed to get prediction.");
        } else {
            //overwrite team with latestteam
            Teampredictions.findOne({ 'Participant.Email': prediction.Participant.Email },
                { 'Participant.Email': 0, createDate: 0, Table: 0, __v: 0, _id: 0 },
                { sort: { RoundId: -1 } },
                function(err, teamprediction) {
                    if (err) {
                        handleError(res, err.message, "Failed to get prediction.");
                    }
                    else {
                        prediction.Team = teamprediction.Team;
                        prediction.Formation = teamprediction.Formation;
                        prediction.CaptainId = teamprediction.CaptainId;
                        prediction.Participant = teamprediction.Participant;
                        res.status(200).json(prediction);
                    }
                });
        }
    });
});

apiRoutes.get("/predictions", function(req, res, next) {

    Teampredictions.aggregate(
        [{ $match: { RoundId: { $lte: 8 } } },
        { $sort: { RoundId: -1 } },
        {
            $group: {
                _id: {
                    email: "$Participant.Email",
                    playerName: "$TeamScores.Name",

                },
                RoundId: { $first: '$RoundId' },
                Participant: { $first: "$Participant" },
                Formation: { $first: "$Formation" },
                CaptainId: { $first: "$CaptainId" },
                Team: { $first: "$Team" },


            },
        }
        ],
        function(err, predictionsList) {
            if (err) {
                handleError(res, err.message, "Failed to get predictions.");
            } else {
                res.status(200).json(predictionsList);
            }
        });
});

var determineifplayerisselected = require("../determineifplayerisselected");

// inschrijven uitgezet.
// apiRoutes.post("/predictions", passport.authenticate('jwt', { session: false }), function (req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     var decoded = jwt.decode(token, config.secret);
//     User.findOne({
//       name: decoded.name
//     }, function (err, user) {
//       if (err) throw err;
//       if (!user) {
//         return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
//       }
//       else {
//         var predictions = new Predictions(req.body);
//         predictions.Participant.Email = user.name;
//         Predictions.findOneAndUpdate({ 'Participant.Email': user.name }, predictions, ({ upsert: true }), function (err, newPrediction) {
//           if (err) {
//             handleError(res, err.message, "Failed to create new prediction.");
//           } else {
//             res.status(201).json(predictions);
//             determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
//           }
//         });
//       }
//     })
//   }
// });
module.exports = apiRoutes;
