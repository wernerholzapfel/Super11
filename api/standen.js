var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var async = require("async");
var _ = require('lodash');

var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var teamStand = require("../models/teamStandModel");
var vragenStand = require("../models/vragenStandModel");
var wedstrijdenStand = require("../models/wedstrijdenStandModel");
var newteamStand = require("../models/newTeamStandModel");
var totaalStand = require("../models/totaalStandModel");
var eindstandStand = require("../models/eindstandStandModel");

apiRoutes.get("/newteamStand/:roundId", function (req, res, next) {
    console.log("log api call roundTable/" + req.params.roundId);
    newteamStand.find({RoundId: req.params.roundId}, {}, {sort: {TotalTeamScore: -1}}, function (err, roundTable) {
        if (err) {
            handleError(res, error.message, "failed tot get roundTable");
        }
        else {
            res.status(200).json(roundTable);
        }
    });
});


var QuestionsScoreForm = require("../models/vragenScoreformsModel.js");

apiRoutes.get("/test/", function (req, res, next) {
    QuestionsScoreForm.aggregate([
        {
            $project: {
                Questions: {
                    $filter: {
                        input: "$Questions",
                        as: "item",
                        cond: {$eq: ["$$item.Id", 20]}
                    }
                }
            }
        }
    ], function (err, questions) {
        if (err) {
            handleError(res, err.message, "failed to get rounds");

        }
        res.status(200).json(questions);

    })

});


var vragenstand = require('../models/vragenStandModel');

apiRoutes.get("/questionsPrediction/:id", function (req, res, next) {
    vragenstand.aggregate([
        {
            $project: {
                Participant: 1,
                TotalQuestionsScore: 1,
                QuestionsScore: {
                    $filter: {
                        input: "$QuestionsScore",
                        as: "item",
                        cond: {$eq: ["$$item.Id", parseInt(req.params.id)]}
                    }
                }
            }
        }
    ], function (err, questions) {
        if (err) {
            handleError(res, err.message, "failed to get rounds");

        }
        res.status(200).json(questions);

    })
});

apiRoutes.get("/totaalstand/", function (req, res, next) {
    console.log("log api call roundTable/");
    async.waterfall([
        function (callback) {
            totaalStand.find({}, {RoundId: 1, _id: 0}, {sort: {RoundId: -1}}, function (err, rounds) {
                if (err) {
                    handleError(res, err.message, "failed to get rounds");
                }
                else {
                    var maxRoundId = (rounds[0]) ? rounds[0].RoundId : 0;
                    callback(null, maxRoundId)
                }
            });
        },
        function (maxRoundId, callback) {
            //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
            totaalStand.find({RoundId: maxRoundId}, {Email: 0}, {sort: {TotalScore: -1}}).lean().exec(function (err, roundTable) {
                if (err) return console.error(err);
                callback(null, roundTable, maxRoundId);
            })
        },
        function (roundTable, maxRoundId, callback) {
            totaalStand.find({RoundId: (maxRoundId - 1)}, {Email: 0}, {sort: {TotalScore: -1}}).lean().exec(function (err, previousRoundTable) {
                if (err) return console.error(err);
                callback(null, roundTable, previousRoundTable)

            })
        },
        function (roundTable, previousRoundTable, callback) {
            var totstand = {}

            totstand.updatedAt = (roundTable[0]) ? roundTable[0].updatedAt : false;
            totstand.deelnemers = []
            async.each(roundTable, function (regel, callback) {
                var stand = new totaalStand;
                stand = regel;
                if (previousRoundTable.length > 0) {
                    var previous = _.find(previousRoundTable, function (o) {
                        return o.Name === regel.Name
                    });
                    stand.previousPositie = previous.Positie;
                    stand.deltaPositie = previous.Positie - stand.Positie;
                    stand.deltaTotalQuestionsScore = stand.TotalQuestionsScore - previous.TotalQuestionsScore;
                    stand.deltaTotalMatchesScore = stand.TotalMatchesScore - previous.TotalMatchesScore;
                    stand.deltaTotalTeamScore = stand.TotalTeamScore - previous.TotalTeamScore;
                    stand.deltaTotalscore = stand.TotalScore - previous.TotalScore;
                }
                totstand.deelnemers.push(stand);
            }, function (err) {
                return console.error("error: " + err);
            });
            res.status(200).json(totstand);
        }
    ]);
});

apiRoutes.get("/wedstrijdenstand/", function (req, res, next) {
    console.log("log api call roundTable/" + req.params.roundId);
    wedstrijdenStand.find({}, {}, {sort: {TotalMatchesScore: -1}}, function (err, roundTable) {
        if (err) {
            handleError(res, error.message, "failed tot get wedstrijdenstand");
        }
        else {
            //todo positie toevoegen?
            res.status(200).json(roundTable);
        }
    });
});

apiRoutes.get("/vragenstand/", function (req, res, next) {
    console.log("log api call roundTable/" + req.params.roundId);
    vragenStand.find({}, {}, {sort: {TotalQuestionsScore: -1}}, function (err, roundTable) {
        if (err) {
            handleError(res, error.message, "failed tot get vragenstand");
        }
        else {
            //todo positie toevoegen?
            res.status(200).json(roundTable);
        }
    });
});

apiRoutes.get("/eindstandstand/", function (req, res, next) {
    console.log("log api call roundTable/");
    eindstandStand.find({}, {}, {sort: {TotalEindstandScore: -1}}, function (err, roundTable) {
        if (err) {
            handleError(res, error.message, "failed tot get eindstand stand");
        }
        else {
            //todo positie toevoegen?
            res.status(200).json(roundTable);
        }
    });
});

module.exports = apiRoutes;
