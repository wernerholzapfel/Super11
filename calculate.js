var teamRoundScore = require("./playersModel");
var teamStand = require("./teamStandModel");
var predictions = require("./predictionModel");
var async = require("async");
var _ = require('lodash');

var playedScore = 1;
var goalForGKScore = 10;
var goalForDFScore = 7;
var goalForMFScore = 5;
var goalForFWScore = 3;
var assistGKScore = 4;
var assistDFScore = 3;
var assistMFScore = 2;
var assistFWScore = 1;
var winScore = 3;
var drawScore = 1;
var hattrickScore = 3;
var cleanSheetGKScore = 4;
var cleanSheetDFScore = 2
var ownGoalScore = -4;
var redCardScore = -6;
var yellowCardScore = -2;


var calculateTeamPredictionsPerRound = function (roundId) {

  async.waterfall([
    function (callback) {
      //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
      teamRoundScore.find({ RoundId: roundId }, { Player: 1 }).exec(function (err, playerRoundScore) {
        if (err) return console.error(err);
        callback(null, playerRoundScore[0].Player);
      })
    },
    function (playerRoundScore, callback) {
      //hier worden alle voorspellingen ophgehaald van de deelnemers
      // console.log("playerRoundScore 2e lenght: " + playerRoundScore.length)
      predictions.find({}, {}).exec(function (err, predictions) {
        // console.log("predictions length: " + predictions.length)
        if (err) return console.error(err);
        callback(null, playerRoundScore, predictions);
      })
    },
    function (playerRoundScore, predictions, callback) {
      async.each(predictions, function (prediction, callback) {
        var stand = new teamStand;
        stand.RoundId = roundId;
        stand.Participant = prediction.Participant;
        stand.TeamScores = []

        async.each(prediction.Team, function (player, callback) {
          var teamPlayer = _.find(playerRoundScore, function (o) { return o.Id === parseInt(player.PlayerId); });

          if (teamPlayer) {
            var playerScore = new Object;
            playerScore.Name = teamPlayer.Name;
            playerScore.Team = teamPlayer.Team;
            playerScore.Won = setWinScore(teamPlayer);
            playerScore.Draw = setDrawScore(teamPlayer);
            playerScore.Played = setPlayedScore(teamPlayer);
            playerScore.RedCard = setRedCardScore(teamPlayer);
            playerScore.YellowCard = setYellowCardScore(teamPlayer);
            playerScore.Assist = setAssistScore(teamPlayer);
            playerScore.Goals = setGoalScore(teamPlayer);
            playerScore.OwnGoal = setOwnGoalScore(teamPlayer);
            playerScore.TotalScore = playerScore.Won + playerScore.Draw + playerScore.Played + playerScore.RedCard + playerScore.YellowCard + playerScore.Assist + playerScore.OwnGoal + playerScore.Goals;

            stand.TeamScores.push(playerScore);
          };
        },
          function (err) {
            console.log("err: " + err);
          }
        );

        stand.save(function (err, stand) {
          if (err) return console.error(err);
          console.log("saved stand for round: " + roundId);
        });


      }, function (err) {
        console.log("err" + err)
      });
    }
  ]);
};

var setPlayedScore = function (player) {
  if (player.Played) {
    return playedScore;
  }
  return 0;
};

var setGoalScore = function (player) {
  if (player.Goals > 0) {
    switch (player.Position) {
      case "GK":
        return player.Goals * goalForGKScore;
      case "DF":
        return player.Goals * goalForDFScore;
      case "MF":
        return player.Goals * goalForMFScore;
      case "FW":
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
      case "GK":
        return player.Assists * assistGKScore;
      case "DF":
        return player.Assists * assistDFScore;
      case "MF":
        return player.Assists * assistMFScore;
      case "FW":
        return player.Assists * assistFWScore;
      default:
        return 0;
    }
  }
  return 0;
};

var setWinScore = function (player) {
  if (player.Win) {
    return winScore;
  }
  return 0;
};

var setDrawScore = function (player) {
  if (player.Draw) {
    return drawScore;
  }
  return 0;
};

var setYellowCardScore = function (player) {
  if (player.Yellow > 0) {
    return player.Yellow * yellowCardScore;
  }
  return 0;
};

var setRedCardScore = function (player) {
  if (player.Red > 0) {
    return player.Red * redCardScore;
  }
  return 0;
};

var setCleanSheetScore = function (player) {
  if (player.cleanSheet) {
    switch (player.Position) {
      case "GK":
        return cleanSheetGKScore;
      case "DF":
        return cleanSheetDFScore;
      default:
        return 0;
    }
  }
};

var setOwnGoalScore = function (player) {
  if (player.OwnGoal > 0) {
    return player.OwnGoal * ownGoalScore;
  }
  return 0;
};

function getPredictionsForRound(roundId) {
  var promise = predictions.find({}, {}).exec();
  return promise;
};

// calculateTeamPredictionsPerRound(1);
