var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var config = require('../config/database');
var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
    //get users token read
    token: process.env.token || config.token,
    domain: process.env.domain || config.domain
});

var ionicApplicationAPItoken = process.env.IonicApplicationAPItoken;
var secret = process.env.secret || config.secret;
var ionicApplicationId = process.env.IonicApplicationID;

var async = require("async");
var jwtDecode = require('jwt-decode');

var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var MatchesScoreForm = require("../models/wedstrijdenScoreformsModel.js");
var QuestionsScoreForm = require("../models/vragenScoreformsModel.js");
var Eindstandscoreform = require("../models/eindstandScoreformsModel.js");
var User = require("../models/user");

var calculateteam = require("../calculateteam.js");
var calculatevragen = require("../calculatevragen.js");
var calculatewedstrijden = require("../calculatewedstrijden.js");
var calculatetotaalstand = require("../calculatetotaalstand.js");
var calculateeindstand = require("../calculateeindstand.js");

apiRoutes.get("/roundteamscoreforms/:roundId", function (req, res, next) {
    RoundTeamScoreForms.findOne({RoundId: +req.params.roundId}, function (err, playersList) {
        if (err) {
            handleError(res, err.message, "Failed to get predictions.");
        } else {
            res.status(200).json(playersList);
        }
    });
});

apiRoutes.post("/pushnotification/", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {

                    var ionicPushServer = require('ionic-push-server');

                    var credentials = {
                        IonicApplicationID: ionicApplicationId,
                        IonicApplicationAPItoken: ionicApplicationAPItoken
                    };

                    var notification = {
                        "send_to_all": true,
                        "profile": "superelevendev",
                        "notification": {
                            "ios": {
                                "badge": 1,
                                "sound": "ping.aiff"
                            },
                            "message": "De stand is weer geüpdated"
                        }
                    };

                    ionicPushServer(credentials, notification);
                    res.status(201).json("{push verzonden!}");


                }
            }
        ])
    }
});

apiRoutes.put("/roundteamscoreforms/:id", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);

                management.getUser({id: decoded.sub}, function (err, user) {
                    if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {
                    var updateScoreForm = {};
                    updateScoreForm = Object.assign(updateScoreForm, req.body);
                    delete updateScoreForm._id;

                    RoundTeamScoreForms.findOneAndUpdate({RoundId: req.params.id}, updateScoreForm, ({upsert: true}), function (err, roundteamscoreforms) {
                        if (err) return handleError(res, err.message, "Failed to Update Players");
                        res.status(200).json(roundteamscoreforms);
                        console.log("put for roundId " + req.params.id)

                        calculateteam.calculateTeamPredictionsPerRound(req.params.id);
                    });
                } else {
                    return res.status(403).send({success: false, msg: 'Niet geautoriseerd om wijziging door te voeren'})
                }
            }
        ])
    }
});

apiRoutes.get("/questionsScoreform/", function (req, res, next) {
    QuestionsScoreForm.findOne(function (err, questions) {
        if (err) {
            handleError(res, error.message, "failed tot get questions");
        }
        else {
            res.status(200).json(questions);
        }
    });
});


apiRoutes.put("/questionsScoreform/", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {
                    QuestionsScoreForm.findOneAndUpdate({}, req.body, ({upsert: true}), function (err, questionsScoreForm) {
                        if (err) return handleError(res, err.message, "Failed to Update questions");
                        res.status(200).json(questionsScoreForm);
                        console.log("saved questions")
                        calculatevragen.calculateQuestions();
                    });
                }
                else {
                    return res.status(403).send({
                        success: false,
                        msg: 'Niet geautoriseerd om wijziging om headline toe te voegen'
                    })
                }
            }
        ])
    }
});

apiRoutes.get("/matchesScoreform/", function (req, res, next) {
    MatchesScoreForm.findOne(function (err, questions) {
        if (err) {
            handleError(res, error.message, "failed tot get matches");
        }
        else {
            res.status(200).json(questions);
        }
    });
});

apiRoutes.put("/matchesScoreform/", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });

            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {
                    MatchesScoreForm.findOneAndUpdate({}, req.body, ({upsert: true}), function (err, matchesScoreform) {
                        if (err) return handleError(res, err.message, "Failed to Update questions");
                        res.status(200).json(matchesScoreform);
                        console.log("saved matches")
                        calculatewedstrijden.calculateWedstrijdScore();
                    });
                }
                else {
                    return res.status(403).send({
                        success: false,
                        msg: 'Niet geautoriseerd om wijziging om headline toe te voegen'
                    })
                }
            }
        ])
    }
});

apiRoutes.get("/eindstandscoreform", function (req, res, next) {
    Eindstandscoreform.findOne(function (err, eindstand) {
        if (err) {
            handleError(res, error.message, "failed tot get eindstandscoreform");
        }
        else {
            res.status(200).json(eindstand);
        }
    });
});

apiRoutes.put("/eindstandscoreform/", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {
                    Eindstandscoreform.findOneAndUpdate({}, req.body, ({upsert: true}), function (err, eindstandscoreform) {
                        if (err) return handleError(res, err.message, "Failed to Update eindstand");
                        res.status(200).json(eindstandscoreform);
                        console.log("saved eindstand")
                        //todo calculate eindstand
                    });
                }
                else {
                    return res.status(403).send({
                        success: false,
                        msg: 'Niet geautoriseerd om wijziging om headline toe te voegen'
                    })
                }
            }
        ])
    }
});

module.exports = apiRoutes;