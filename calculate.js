var teamRoundScore = require("./roundteamscoreformsModel");
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

var exports = module.exports = {};

exports.calculateTeamPredictionsPerRound = function (roundId) {

  async.waterfall([
    function (callback) {
      //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
      teamRoundScore.find({ RoundId: roundId }).exec(function (err, playerRoundScore) {
        if (err) return console.error(err);
        callback(null, playerRoundScore[0]);
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
        stand.TotalTeamScore = 0;
        stand.TotalMatchesScore = 0;
        stand.TotalQuestionsScore = 0;
        stand.RoundId = roundId;
        stand.Participant = prediction.Participant;
        stand.TeamScores = []
        stand.QuestionsScore = []
        stand.MatchesScore = []

        async.each(prediction.Questions, function (question, callback) {
          var scoreQuestion = _.find(playerRoundScore.Questions, function (o) { return o.Id === parseInt(question.Id); });

          if (scoreQuestion.Answer) {
            var questionScore = new Object;
            questionScore.Score = setQuestionScore(scoreQuestion, question),
              questionScore.Question = question.Question,
              questionScore.Answer = question.Answer,
              questionScore.Id = question.Id,
              questionScore.Uitslag = scoreQuestion.Answer

            stand.TotalQuestionsScore = stand.TotalQuestionsScore + questionScore.Score;

            stand.QuestionsScore.push(questionScore);
          }
        });
        async.each(prediction.Matches, function (match, callback) {
          var scoreMatches = _.find(playerRoundScore.Matches, function (o) { return o.Id === parseInt(match.Id); });

          if (scoreMatches.Home != null) {
            var matchScore = new Object;
            matchScore.Score = setMatchScore(scoreMatches, match);
            matchScore.Match = match.Match
            matchScore.Home = match.Home
            matchScore.Away = match.Away
            matchScore.Id = match.Id
            matchScore.Uitslag = scoreMatches.Home + "-" + scoreMatches.Away,

            stand.TotalMatchesScore = stand.TotalMatchesScore + matchScore.Score;
            stand.MatchesScore.push(matchScore);
          }
        });
        async.each(prediction.Team, function (player, callback) {
          var teamPlayer = _.find(playerRoundScore.Player, function (o) { return o.Id === parseInt(player.PlayerId); });

          if (teamPlayer) {
            var captainFactor = determineIfCaptain(player)
            var playerScore = new Object;
            playerScore.Id = player.Id
            playerScore.Name = teamPlayer.Name;
            playerScore.Team = teamPlayer.Team;
            playerScore.Position = teamPlayer.Position;
            playerScore.Won = setWinScore(teamPlayer,captainFactor);
            playerScore.Draw = setDrawScore(teamPlayer,captainFactor);
            playerScore.Played = setPlayedScore(teamPlayer,captainFactor);
            playerScore.RedCard = setRedCardScore(teamPlayer,captainFactor);
            playerScore.YellowCard = setYellowCardScore(teamPlayer,captainFactor);
            playerScore.Assist = setAssistScore(teamPlayer,captainFactor);
            playerScore.Goals = setGoalScore(teamPlayer,captainFactor);
            playerScore.OwnGoals = setOwnGoalScore(teamPlayer,captainFactor);
            playerScore.CleanSheetScore = setCleanSheetScore(teamPlayer,captainFactor);
            playerScore.TotalScore = playerScore.Won + playerScore.Draw + playerScore.Played + playerScore.RedCard + playerScore.YellowCard + playerScore.Assist + playerScore.OwnGoals + playerScore.Goals + playerScore.CleanSheetScore;

            //todo test possible eachseries ipv each
            stand.TotalTeamScore = stand.TotalTeamScore + playerScore.TotalScore;

            stand.TeamScores.push(playerScore);
          }
          else {
            var playerScore = new Object;
            playerScore.Name = player.PlayerName;
            playerScore.Team = player.Team;
            playerScore.Position = player.Position;
            playerScore.Won = 0;
            playerScore.Draw = 0;
            playerScore.Played = 0;
            playerScore.RedCard = 0;
            playerScore.YellowCard = 0;
            playerScore.Assist = 0;
            playerScore.Goals = 0;
            playerScore.OwnGoals = 0;
            playerScore.CleanSheetScore = 0;

            playerScore.TotalScore = 0;

            stand.TeamScores.push(playerScore);
          };
        },
          function (err) {
            console.log("err: " + err);
          }
        );
        stand.TotalScore = stand.TotalTeamScore + stand.TotalMatchesScore + stand.TotalQuestionsScore;
        //necessary to overwrite teamStand
        var standToUpdate = {};
        standToUpdate = Object.assign(standToUpdate, stand._doc);
        delete standToUpdate._id;

        teamStand.findOneAndUpdate({ RoundId: roundId, 'Participant.Email': prediction.Participant.Email }, standToUpdate, ({ upsert: true }), function (err, stand) {
          if (err) return console.error("error: " + err);
          console.log("saved stand for round: " + roundId);
        });


      }, function (err) {
        console.log("err" + err)
      });
    }
  ]);
};

var setPlayedScore = function (player,factor) {
  if (player.Played) {
    return playedScore * factor;
  }
  return 0;
};

var setGoalScore = function (player,factor) {
  if (player.Goals > 0) {
    switch (player.Position) {
      case "K":
        return player.Goals * goalForGKScore * factor;
      case "V":
        return player.Goals * goalForDFScore  * factor;
      case "M":
        return player.Goals * goalForMFScore  * factor;
      case "A":
        return player.Goals * goalForFWScore  * factor;
      default:
        return 0;
    }
  }
  return 0;
};

var setAssistScore = function (player,factor) {
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

var setMatchScore = function (uitslag, voorspelling) {
  var uitslagToto = determineToto(uitslag);
  var voorspellingToto = determineToto(voorspelling)

  if (uitslagToto == voorspellingToto) {
    if (uitslag.Home == voorspelling.Home && uitslag.Away == voorspelling.Away) {
      return 10;
    }
    else {
      return 3;
    }
  }
  else {
    return 0;
  }
}

var determineToto = function (match) {
  if (match.Home > match.Away) {
    return 1
  }
  if (match.Home < match.Away) {
    return 2
  }
  else {
    return 3
  }
}

var determineIfCaptain = function (player) {
  if (player.Captain) {
    return 2;
  }
  else {
    return 1;
  }
}

var setWinScore = function (player,factor) {
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
        return cleanSheetDFScore* factor;
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

var setQuestionScore = function (scoreQuestion, question) {
  if (scoreQuestion.Answer === question.Answer) {
    return 10;
  }
  else {
    return 0;
  }
};

