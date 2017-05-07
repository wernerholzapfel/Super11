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
var vragenStand = require("../models/vragenStandModel");


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
                    // if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.app_metadata.roles.indexOf('admin') > -1) {
                    console.log(user.name + " is admin");
                    var ionicPushServer = require('ionic-push-server');
                    console.log("this is the app id:" + ionicApplicationId)
                    var credentials = {
                        IonicApplicationID: ionicApplicationId,
                        IonicApplicationAPItoken: ionicApplicationAPItoken
                    };

                    var notification = {
                        "send_to_all": true,
                        "profile": "prod",
                        "notification": {
                            "ios": {
                                "badge": 1,
                                "sound": "ping.aiff"
                            },
                            "message": "De stand is weer geüpdated"
                        }
                    };
                    console.log("going to send push");
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

apiRoutes.put("/vragenstand/", function (req, res) {
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
                    console.log(req.body);
                    async.each(req.body, function (prediction, callback) {
                            var stand = new vragenStand;
                            stand.TotalQuestionsScore = 0;
                            stand.Participant = prediction.Participant;
                            stand.QuestionsScore = prediction.QuestionsScore;

                            async.each(prediction.QuestionsScore, function (question, callback) {
                                    stand.TotalQuestionsScore = stand.TotalQuestionsScore + question.Score;
                                    callback();
                                },
                                function (err) {
                                    console.log("err: " + err);
                                }
                            );
                            //necessary to overwrite vragenStand
                            var standToUpdate = {};
                            standToUpdate = Object.assign(standToUpdate, stand._doc);
                            delete standToUpdate._id;

                            vragenStand.findOneAndUpdate({'Participant.Email': prediction.Participant.Email}, standToUpdate, ({upsert: true}), function (err, stand) {
                                if (err) return console.error("error: " + err);
                                console.log("saved vragenstand for : " + prediction.Participant.Name);
                                callback();
                            });
                        },
                        function (err) {
                            // if any of the file processing produced an error, err would equal that error
                            if (err) {
                                console.log('A file failed to process');
                            } else {
                                console.log('Go calculate totaalstand');
                                calculatetotaalstand.calculatetotaalstand(50);
                            }
                        });

                    return res.status(200).json("stand opgeslagen");
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


apiRoutes.put("/updateQuestionsScoreform/", function (req, res) {
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

apiRoutes.put("/updateMatchesScoreform/", function (req, res) {
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
                        console.log("saved eindstand");
                        calculateeindstand.calculateEindstand(50);
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