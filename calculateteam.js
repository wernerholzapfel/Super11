var teamRoundScore = require("./models/roundteamscoreformsModel");
var teamStand = require("./models/newTeamStandModel");
var predictions = require("./models/predictionModel");
var Teampredictions = require('./models/teamPredictionsModel');
var async = require("async");
var calculatetotaalstand = require("./calculatetotaalstand.js");
var _ = require('lodash');

var playedScore = 1;
var goalForGKScore = 10;
var goalForDFScore = 6;
var goalForMFScore = 4;
var goalForFWScore = 3;
var assistGKScore = 8;
var assistDFScore = 4;
var assistMFScore = 3;
var assistFWScore = 2;
var winScore = 2;
var drawScore = 1;
var penaltyStoppedScore = 6;
var penaltyMissedScore = -3;
var cleanSheetGKScore = 4;
var cleanSheetDFScore = 2;
var ownGoalScore = -4;
var redCardScore = -8;
var yellowCardScore = -2;
var secondYellowCardScore = -6;

var exports = module.exports = {};

exports.calculateTeamPredictionsPerRound = function (roundId) {

    async.waterfall([
        function (callback) {
            //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
            teamRoundScore.find({RoundId: roundId}).exec(function (err, playerRoundScore) {
                if (err) return console.error(err);
                callback(null, playerRoundScore[0], roundId);
            });
        },
        function (playerRoundScore, roundId, callback) {
            //hier worden alle voorspellingen ophgehaald van de deelnemers
            // console.log("playerRoundScore 2e lenght: " + playerRoundScore.length)
            Teampredictions.aggregate(
                [{$match: {RoundId: {$lte: parseInt(roundId)}}},
                    {$sort: {RoundId: -1}},
                    {
                        $group: {
                            _id: {
                                email: "$Participant.Email",
                                playerName: "$TeamScores.Name",

                            },
                            RoundId: {$first: '$RoundId'},
                            Participant: {$first: "$Participant"},
                            Formation: {$first: "$Formation"},
                            CaptainId: {$first: "$CaptainId"},
                            Team: {$first: "$Team"}
                        }
                    }
                ], function (err, predictions) {
                    // console.log("predictions length: " + predictions.length)
                    if (err) return console.error(err);
                    callback(null, playerRoundScore, predictions);
                });
        },
        function (playerRoundScore, predictions, callback) {
            async.each(predictions, function (prediction, callback) {
                    var stand = new teamStand;
                    stand.TotalTeamScore = 0;
                    // stand.TotalMatchesScore = 0;
                    // stand.TotalQuestionsScore = 0;
                    stand.RoundId = roundId;
                    stand.Participant = prediction.Participant;
                    stand.TeamScores = [];

                    async.each(prediction.Team, function (player, callback) {
                            var teamPlayer = _.find(playerRoundScore.Player, function (o) {
                                return o.Id === parseInt(player.PlayerId);
                            });

                            if (teamPlayer) {
                                var captainFactor = determineIfCaptain(player);
                                var playerScore = new Object;
                                playerScore.Id = player.Id;
                                playerScore.PlayerId = player.PlayerId;
                                playerScore.Name = teamPlayer.Name;
                                playerScore.Team = teamPlayer.Team;
                                playerScore.Position = teamPlayer.Position;
                                playerScore.RoundId = roundId;
                                playerScore.Captain = player.Captain;
                                playerScore.Won = setWinScore(teamPlayer, captainFactor);
                                playerScore.Draw = setDrawScore(teamPlayer, captainFactor);
                                playerScore.Played = setPlayedScore(teamPlayer, captainFactor);
                                playerScore.PenaltyStoppedScore = setPenaltyStoppedScore(teamPlayer, captainFactor);
                                playerScore.PenaltyMissed = setPenaltyMissedScore(teamPlayer, captainFactor);
                                playerScore.RedCard = setRedCardScore(teamPlayer, captainFactor);
                                playerScore.SecondYellowCard = setSecondYellowCardScore(teamPlayer, captainFactor);
                                playerScore.YellowCard = setYellowCardScore(teamPlayer, captainFactor);
                                playerScore.Assist = setAssistScore(teamPlayer, captainFactor);
                                playerScore.Goals = setGoalScore(teamPlayer, captainFactor);
                                playerScore.OwnGoals = setOwnGoalScore(teamPlayer, captainFactor);
                                playerScore.CleanSheetScore = setCleanSheetScore(teamPlayer, captainFactor);
                                playerScore.TotalScore = playerScore.Won + playerScore.Draw + playerScore.Played + playerScore.PenaltyStoppedScore + playerScore.PenaltyMissed + playerScore.SecondYellowCard + playerScore.RedCard + playerScore.YellowCard + playerScore.Assist + playerScore.OwnGoals + playerScore.Goals + playerScore.CleanSheetScore;

                                stand.TotalTeamScore = stand.TotalTeamScore + playerScore.TotalScore;

                                stand.TeamScores.push(playerScore);
                            }
                            else {
                                var playerScore = new Object;
                                playerScore.Name = player.PlayerName;
                                playerScore.Team = player.Team;
                                playerScore.Position = player.Position;
                                playerScore.Captain = player.Captain;
                                playerScore.Id = player.Id;
                                playerScore.PlayerId = player.PlayerId;
                                playerScore.RoundId = roundId;
                                playerScore.Won = 0;
                                playerScore.Draw = 0;
                                playerScore.Played = 0;
                                playerScore.PenaltyStoppedScore = 0;
                                playerScore.PenaltyMissed = 0;
                                playerScore.RedCard = 0;
                                playerScore.YellowCard = 0;
                                playerScore.SecondYellowCard = 0;
                                playerScore.Assist = 0;
                                playerScore.Goals = 0;
                                playerScore.OwnGoals = 0;
                                playerScore.CleanSheetScore = 0;

                                playerScore.TotalScore = 0;

                                stand.TeamScores.push(playerScore);
                            }
                            ;
                        },
                        function (err) {
                            console.log("err: " + err);
                        }
                    );
                    //necessary to overwrite teamStand
                    var standToUpdate = {};
                    standToUpdate = Object.assign(standToUpdate, stand._doc);
                    delete standToUpdate._id;

                    teamStand.findOneAndUpdate({
                        RoundId: roundId,
                        'Participant.Email': prediction.Participant.Email
                    }, standToUpdate, ({upsert: true}), function (err, stand) {
                        if (err) return console.error("error: " + err);
                        console.log("saved stand for round: " + roundId);
                        callback();
                    });
                },
                function (err) {
                    // if any of the file processing produced an error, err would equal that error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        console.log('A file failed to process');
                    } else {
                        console.log('Go calculate totaalstand');
                        calculatetotaalstand.calculatetotaalstand(roundId);
                    }
                });
        }
    ], function (err) {
        if (err) console.log("error occured");
    });
};

var setPlayedScore = function (player, factor) {
    if (player.Played) {
        return playedScore * factor;
    }
    return 0;
};

var setGoalScore = function (player, factor) {
    if (player.Goals > 0) {
        switch (player.Position) {
            case "K":
                return player.Goals * goalForGKScore * factor;
            case "V":
                return player.Goals * goalForDFScore * factor;
            case "M":
                return player.Goals * goalForMFScore * factor;
            case "A":
                return player.Goals * goalForFWScore * factor;
            default:
                return 0;
        }
    }
    return 0;
};

var setAssistScore = function (player, factor) {
    if (player.Assists > 0) {
        switch (player.Position) {
            case "K":
                return player.Assists * assistGKScore * factor;
            case "V":
                return player.Assists * assistDFScore * factor;
            case "M":
                return player.Assists * assistMFScore * factor;
            case "A":
                return player.Assists * assistFWScore * factor;
            default:
                return 0;
        }
    }
    return 0;
};

var determineIfCaptain = function (player) {
    if (player.Captain) {
        return 2;
    }
    else {
        return 1;
    }
};

var setWinScore = function (player, factor) {
    if (player.Win) {
        return winScore * factor;
    }
    return 0;
};

var setDrawScore = function (player, factor) {
    if (player.Draw) {
        return drawScore * factor;
    }
    return 0;
};

var setYellowCardScore = function (player, factor) {
    if (player.Yellow > 0) {
        return player.Yellow * yellowCardScore * factor;
    }
    return 0;
};
var setSecondYellowCardScore = function (player, factor) {
    if (player.SecondYellow) {
        return player.SecondYellow * secondYellowCardScore * factor;
    }
    return 0;
};


var setPenaltyStoppedScore = function (player, factor) {
    if (player.PenaltyStopped && player.Position == "K") {
        return player.PenaltyStopped * penaltyStoppedScore * factor;
    }
    return 0;
};
var setPenaltyMissedScore = function (player, factor) {
    if (player.PenaltyMissed) {
        return player.PenaltyMissed * penaltyMissedScore * factor;
    }
    return 0;
};

var setRedCardScore = function (player, factor) {
    if (player.Red > 0) {
        return player.Red * redCardScore * factor;
    }
    return 0;
};

var setCleanSheetScore = function (player, factor) {
    if (player.CleanSheet) {
        switch (player.Position) {
            case "K":
                return cleanSheetGKScore * factor;
            case "V":
                return cleanSheetDFScore * factor;
            default:
                return 0;
        }
    }
    return 0;
};

var setOwnGoalScore = function (player, factor) {
    if (player.OwnGoal > 0) {
        return player.OwnGoal * ownGoalScore * factor;
    }
    return 0;
};

function getPredictionsForRound(roundId) {
    var promise = predictions.find({}, {}).exec();
    return promise;
};

