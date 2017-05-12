var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");

var jwtDecode = require('jwt-decode');
var config = require('../config/database');
var MatchesScoreForm = require("../models/wedstrijdenScoreformsModel.js");
var VragenScoreForm = require("../models/vragenScoreformsModel.js");

var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
    //get users token read
    token: process.env.token || config.token,
    domain: process.env.domain || config.domain
});
var secret = process.env.secret || config.secret;

var User = require('../models/user');
var Predictions = require("../models/predictionModel");

apiRoutes.get('/predictionform', function (req, res) {
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
                Predictions.findOne({'Participant.Email': user.email}, {
                    'Participant.Email': 0,
                    createDate: 0
                }, function (err, prediction) {
                    if (err) {
                        handleError(res, err.message, "Failed to get prediction.");
                    }
                    callback(null, prediction)
                });
            },
            function (predictionForm, callback) {
                var form =
                    {
                        "Participant": {
                            "Id": 0,
                            "Name": "",
                            "Email": "",
                            "Location": "",
                            "Gender": "",
                            "PhoneNumber": ""
                        },
                        "Table": [
                            {
                                "Position": 1,
                                "SelectedTeam": "Ado Den Haag",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 2,
                                "SelectedTeam": "Ajax",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 3,
                                "SelectedTeam": "AZ",
                                "SelectedTeamId": ""
                            }
                            , {
                                "Position": 4,
                                "SelectedTeam": "Excelsior",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 5,
                                "SelectedTeam": "Feyenoord",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 6,
                                "SelectedTeam": "Go Ahead Eagles",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 7,
                                "SelectedTeam": "FC Groningen",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 8,
                                "SelectedTeam": "SC Heerenveen",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 9,
                                "SelectedTeam": "Heracles Almelo",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 10,
                                "SelectedTeam": "N.E.C.",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 11,
                                "SelectedTeam": "PEC Zwolle",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 12,
                                "SelectedTeam": "PSV",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 13,
                                "SelectedTeam": "Roda JC",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 14,
                                "SelectedTeam": "Sparta",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 15,
                                "SelectedTeam": "FC Twente",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 16,
                                "SelectedTeam": "FC Utrecht",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 17,
                                "SelectedTeam": "Vitesse",
                                "SelectedTeamId": ""
                            }, {
                                "Position": 18,
                                "SelectedTeam": "Willem II",
                                "SelectedTeamId": ""
                            }
                        ],
                        "Team": [
                            {
                                "Id": 1,
                                "Position": "K",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }, {
                                "Id": 2,
                                "Position": "V",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            },
                            {
                                "Id": 3,
                                "Position": "V",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            },
                            {
                                "Id": 4,
                                "Position": "V",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            },
                            {
                                "Id": 5,
                                "Position": "V",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            },
                            {
                                "Id": 6,
                                "Position": "M",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            },
                            {
                                "Id": 7,
                                "Position": "M",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }, {
                                "Id": 8,
                                "Position": "M",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }, {
                                "Id": 9,
                                "Position": "A",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }, {
                                "Id": 10,
                                "Position": "A",
                                "PlayerId": "",
                                "PlayerName": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }, {
                                "Id": 11,
                                "Position": "A",
                                "PlayerName": "",
                                "Name": "",
                                "TeamId": "",
                                "Team": "",
                                "Captain": false
                            }],

                    }
                form.Matches = [];
                form.Questions = [];
                MatchesScoreForm.findOne(function (err, matches) {
                    if (err) {
                        handleError(res, error.message, "failed tot get matches");
                    }
                    callback(null, predictionForm, form, matches)
                });
            },
            function (predictionForm, form, matches, callback) {
                async.each(matches.Matches, function (match, callback) {
                    match.Home = null;
                    match.Away = null;
                    form.Matches.push(match)
                });

                callback(null, predictionForm, form)
            },
            function (predictionForm, form, callback) {
                VragenScoreForm.findOne(function (err, vragen) {
                    if (err) {
                        handleError(res, error.message, "failed tot get matches");
                    }
                    else {
                        async.each(vragen.Questions, function (vraag, callback) {
                            vraag.Answer = null
                            form.Questions.push(vraag)
                        });

                        if (predictionForm) {
                            res.status(200).json(predictionForm)

                        }
                        else {
                            res.status(200).json(form)

                        }
                    }
                });
            }
        ])
    }
});


//todo create leegFormulier depending on database scoreforms


module.exports = apiRoutes;
