var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");

var jwtDecode = require('jwt-decode');
var config = require('../config/database');

var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
    //get users token read
    token: process.env.token || config.token,
    domain: process.env.domain || config.domain
});
var secret = process.env.secret || config.secret;


var Predictions = require("../models/predictionModel");
var Teampredictions = require("../models/teamPredictionsModel");

apiRoutes.get("/predictions/:Id", function (req, res, next) {
    Predictions.findOne({'Participant.Name': req.params.Id}, {createDate: 0}, function (err, prediction) {
        if (err) {
            handleError(res, err.message, "Failed to get prediction.");
        } else {
            //overwrite team with latestteam
            Teampredictions.findOne({'Participant.Email': prediction.Participant.Email},
                {'Participant.Email': 0, createDate: 0, Table: 0, __v: 0, _id: 0},
                {sort: {RoundId: -1}},
                function (err, teamprediction) {
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

apiRoutes.get("/participants", function (req, res, next) {
    Predictions.find({}, {
        'Participant.Email': 0,
        "Team": 0,
        "Questions": 0,
        "Table": 0,
        "Matches": 0,
        createDate: 0
    }, function (err, predictionsList) {
        if (err) {
            handleError(res, err.message, "Failed to get predictions.");
        } else {
            res.status(200).json(predictionsList);
        }
    });
});


apiRoutes.get("/predictions", function (req, res, next) {

    Teampredictions.aggregate(
        [{$match: {RoundId: {$lte: 100}}},
            {$sort: {RoundId: -1}},
            {
                $group: {
                    _id: {
                        email: "$Participant.Email",
                        playerName: "$TeamScores.Name"

                    },
                    Id: {$first: '$_id'},
                    RoundId: {$first: '$RoundId'},
                    Name: {$first: "$Participant.Name"},
                    Location: {$first: "$Participant.Location"},
                    Gender: {$first: "$Participant.Gender"},
                    Formation: {$first: "$Formation"},
                    CaptainId: {$first: "$CaptainId"},
                    Team: {$first: "$Team"}
                }
            },
            {
                $project: {
                    Id: 1,
                    _id: 0,
                    // id: 1,
                    RoundId: 1,
                    Name: 1,
                    Gender: 1,
                    Location: 1,
                    Formation: 1,
                    CaptainId: 1,
                    Team: 1
                }
            }

        ],
        function (err, predictionsList) {
            if (err) {
                handleError(res, err.message, "Failed to get predictions.");
            } else {
                res.status(200).json(predictionsList);
            }
        });
});

var determineifplayerisselected = require("../determineifplayerisselected");

apiRoutes.post("/predictions", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.email_verified) {
                    Predictions.findOne({'Participant.Email': user.email}, {'Participant.Name': 1}, function (err, name) {
                        callback(null, user);
                    });
                }
                else {
                    res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                }
            },
            function (user, callback) {
                var predictions = new Predictions(req.body);
                predictions.Participant.Email = user.email;
                Predictions.findOneAndUpdate({'Participant.Email': user.email}, predictions, ({upsert: true}), function (err, newPrediction) {
                    if (err) {
                        handleError(res, err.message, "Failed to create new prediction.");
                    } else {
                        res.status(201).json(predictions);
                        determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
                    }
                });
            }
        ])
    }
});

module.exports = apiRoutes;
