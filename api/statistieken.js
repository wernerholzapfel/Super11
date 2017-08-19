var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");
var calculateteam = require('../calculateteam');
var _ = require('lodash');

// var Predictions = require("../models/predictionModel");
var Teampredictions = require("../models/teamPredictionsModel");
var Roundteamscoreforms = require("../models/roundteamscoreformsModel");
var TotaalStands = require("../models/totaalStandModel");

apiRoutes.get("/spelerstotaalpunten/", function (req, res, next) {
    Roundteamscoreforms.aggregate([
            {$unwind: "$Player"},
            {
                $project: {
                    Player: 1,
                    Cleansheet: {$cond: ["$Player.CleanSheet", 1, 0]},
                    Draw: {$cond: ["$Player.Draw", 1, 0]},
                    Win: {$cond: ["$Player.Win", 1, 0]},
                    Played: {$cond: ["$Player.Played", 1, 0]}
                }
            },
            {
                $group: {
                    _id: {
                        playerId: "$Player.Id"
                    },
                    CleanSheet: {$sum: "$Cleansheet"},
                    Draw: {$sum: "$Draw"},
                    Win: {$sum: "$Win"},
                    Played: {$sum: "$Played"},
                    OwnGoal: {$sum: "$Player.OwnGoal"},
                    Red: {$sum: "$Player.Red"},
                    Yellow: {$sum: "$Player.Yellow"},
                    Assists: {$sum: "$Player.Assists"},
                    Goals: {$sum: "$Player.Goals"},
                    Position: {$first: "$Player.Position"},
                    Team: {$first: "$Player.Team"},
                    Name: {$first: "$Player.Name"}
                }
            }
        ],
        function (err, spelersoverzicht) {
            if (err) {
                handleError(res, err.message, "failed to get spelersoverzicht " + err.message)
            }
            else {
                async.each(spelersoverzicht, function (player, callback) {

                    if (player) {
                        var playerScore = new Object;
                        player.Won = setWinScore(player);
                        player.Draw = setDrawScore(player);
                        player.Played = setPlayedScore(player);
                        player.RedCard = setRedCardScore(player);
                        player.YellowCard = setYellowCardScore(player);
                        player.Assist = setAssistScore(player);
                        player.Goals = setGoalScore(player);
                        player.OwnGoals = setOwnGoalScore(player);
                        player.CleanSheetScore = setCleanSheetScore(player);
                        player.TotalScore = player.Won + player.Draw + player.Played + player.RedCard + player.YellowCard + player.Assist + player.OwnGoals + player.Goals + player.CleanSheetScore;

                    }
                });
                res.status(200).json(_.orderBy(spelersoverzicht, ['TotalScore', 'Name'], ['desc', 'asc']));

            }
        }
    )

})
;

apiRoutes.get("/teamstatistieken/", function (req, res, next) {
    Teampredictions.aggregate([
        {$sort: {RoundId: 1}},
            {
                $group: {
                    _id: {
                        email: "$Participant.Email"
                    },
                    LatestTeam: {$last: "$Team"}
                }
            }, {
            $project: {
                _id: 0,
                LatestTeam: 1
            }
        }, {$unwind: "$LatestTeam"},
        {
            $group: {
                _id: {
                    playerId: "$LatestTeam.PlayerId"
                },
                Count: {$sum: 1},
                Team: {$first: "$LatestTeam.Team"},
                Position: {$first: "$LatestTeam.Position"},
                PlayerName: {$first: "$LatestTeam.PlayerName"},
                PlayerId: {$first: "$LatestTeam.PlayerId"},
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
    TotaalStands.aggregate([
            {$sort: {RoundId: 1}},
            {
                $group: {
                    _id: {
                        email: "$Name"
                    },
                    LatestTeam: {$last: "$TeamScores"},
                    Name: {$last: "$Name"},
                    TotalTeamScore: {$last: "$TotalTeamScore"},
                    TotalQuestionsScore: {$last: "$TotalQuestionsScore"},
                    TotalMatchesScore: {$last: "$TotalMatchesScore"},
                    TotalEindstandScore: {$last: "$TotalEindstandScore"},
                    TotalScore: {$last: "$TotalScore"},
                    Positie: {$last: "$Positie"}
                }
            }, {
                $project: {
                    _id: 0,

                }
            },
            {$unwind: "$LatestTeam"},
            {$match: {'LatestTeam.PlayerId': parseInt(req.params.Id)}},
        ],
        function (err, spelersoverzicht) {
            if (err) {
                handleError(res, err.message, "failed to get spelersoverzicht " + err.message)
            }
            else {
                res.status(200).json(spelersoverzicht);
            }
        });
});

module.exports = apiRoutes;


var setPlayedScore = function (player) {
    return player.Played * playedScore;
};

var setGoalScore = function (player) {
    if (player.Goals > 0) {
        switch (player.Position) {
            case "K":
                return player.Goals * goalForGKScore;
            case "V":
                return player.Goals * goalForDFScore;
            case "M":
                return player.Goals * goalForMFScore;
            case "A":
                return player.Goals * goalForFWScore;
            default:
                return 0;
        }
    }
    return 0;
};

var setAssistScore = function (player) {
    if (player.Assists > 0) {
        switch (player.Position) {
            case "K":
                return player.Assists * assistGKScore;
            case "V":
                return player.Assists * assistDFScore;
            case "M":
                return player.Assists * assistMFScore;
            case "A":
                return player.Assists * assistFWScore;
            default:
                return 0;
        }
    }
    return 0;
};


var setWinScore = function (player) {
    return winScore * player.Win;
};

var setDrawScore = function (player) {
    return drawScore * player.Draw;
};

var setYellowCardScore = function (player) {
    return player.Yellow * yellowCardScore;
};

var setRedCardScore = function (player) {
    return player.Red * redCardScore;
};

var setCleanSheetScore = function (player) {
    switch (player.Position) {
        case "K":
            return cleanSheetGKScore * player.CleanSheet;
        case "V":
            return cleanSheetDFScore * player.CleanSheet;
        default:
            return 0;
    }
};

var setOwnGoalScore = function (player) {
    return player.OwnGoal * ownGoalScore;
};

// todo remove to scoresheet;
var playedScore = 1;
var goalForGKScore = 10;
var goalForDFScore = 7;
var goalForMFScore = 5;
var goalForFWScore = 3;
var assistGKScore = 8;
var assistDFScore = 5;
var assistMFScore = 3;
var assistFWScore = 2;
var winScore = 3;
var drawScore = 1;
var hattrickScore = 3;
var cleanSheetGKScore = 4;
var cleanSheetDFScore = 2;
var ownGoalScore = -4;
var redCardScore = -6;
var yellowCardScore = -2;