var teamScore = require("./playersModel");
var TeamTable = require("./teamTableModel");
var predictions = require("./predictionModel");
var async = require("async");

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
  //todo get all players
  var roundScores = [];

  predictions.find({}, {}).exec(function (err, voorspellingen) {
    if (err) return console.error(err);
    voorspellingen.forEach(function (voorspelling, index, array) {
      var teamScores = [];
      voorspelling.Team.forEach(function (speler, index, array) {

        var playerScore = new Object;

        var playerAchievement = getPlayerForRound(speler.Id, roundId);

        playerAchievement.then(function (player) {
          // console.log(player.Player);
          playerScore.Name = player.Player[0].Name;
          playerScore.Team = player.Player[0].Team;
          playerScore.Won = setWinScore(player.Player[0]);
          playerScore.Draw = setDrawScore(player.Player[0]);
          playerScore.Played = setPlayedScore(player.Player[0]);
          playerScore.RedCard = setRedCardScore(player.Player[0]);
          playerScore.YellowCard = setYellowCardScore(player.Player[0]);
          playerScore.Assist = setAssistScore(player.Player[0]);
          playerScore.Goals = setGoalScore(player.Player[0]);
          playerScore.OwnGoal = setOwnGoalScore(player.Player[0]);
          playerScore.TotalScore = playerScore.Won + playerScore.Draw + playerScore.Played + playerScore.RedCard + playerScore.YellowCard + playerScore.Assist + playerScore.OwnGoal + playerScore.Goals;
          teamScores.push(playerScore);
        });
      });
    });
  });
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

function getPlayerForRound(playerId, roundId) {
  var promise = teamScore.findOne({ RoundId: roundId, 'Player.Id': playerId }, { Player: { $elemMatch: { Id: playerId } } }).exec();
  return promise;
};

calculateTeamPredictionsPerRound(1);

