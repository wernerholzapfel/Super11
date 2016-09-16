var vragenStand = require("./vragenStandModel");
var wedstrijdenStand = require("./wedstrijdenStandModel");
var newteamStand = require("./newTeamStandModel");
var totaalStand = require("./totaalStandModel");
var async = require("async");
var _ = require('lodash');


var exports = module.exports = {};

exports.calculatetotaalstand = function () {


newteamStand.aggregate([
    { $unwind: "$TeamScores" },
    {
      $group: {
        _id: {
          email: "$Participant.Email",
          playerName: "$TeamScores.Name",

        },
        Id: { $first: "$TeamScores.Id" },
        RoundId: { $max: "$RoundId" },
        ParticipantName: { $first: "$Participant.Name" },
        playerName: { $first: "$TeamScores.Name" },
        Team: { $first: "$TeamScores.Team" },
        Position: { $first: "$TeamScores.Position" },
        Won: { $sum: "$TeamScores.Won" },
        Draw: { $sum: "$TeamScores.Draw" },
        Played: { $sum: "$TeamScores.Played" },
        RedCard: { $sum: "$TeamScores.RedCard" },
        YellowCard: { $sum: "$TeamScores.YellowCard" },
        Assist: { $sum: "$TeamScores.Assist" },
        Goals: { $sum: "$TeamScores.Goals" },
        OwnGoals: { $sum: "$TeamScores.OwnGoals" },
        CleanSheetScore: { $sum: "$TeamScores.CleanSheetScore" },
        TotalPlayerScore: { $sum: "$TeamScores.TotalScore" }
        // ,
        // TotalOverallScore: { $sum: "$TotalScore" }
      }
    }
    ,
    {
      $group:
      {
        _id: { email: "$_id.email" },
        Email: { $first: "$_id.email" },
        Name: { $first: "$ParticipantName" },
        RoundId: { $max: "$RoundId" },
        TotalTeamScore: { $sum: "$TotalPlayerScore" },
        TeamScores: {
          $push: {
            Id: '$Id',
            Name: '$playerName',
            Position: "$Position",
            Team: "$Team",
            Won: "$Won",
            Draw: "$Draw",
            Played: "$Played",
            RedCard: "$RedCard",
            YellowCard: "$YellowCard",
            Assist: "$Assist",
            Goals: "$Goals",
            OwnGoals: "$OwnGoals",
            CleanSheetScore: "$CleanSheetScore",
            TotalScore: "$TotalPlayerScore",
          }
        }
      }
    },
    {
      $project:
      {
        _id: 0,
        Name: 1,
        RoundId: 1,
        TotalTeamScore: 1,
        TeamScores: 1,
        Email: 1
      }
    },
    { $sort: { TotalScore: -1 } }
  ], function (err, roundTable) {
    if (err) {
      handleError(res, err.message, "failed to get roundTable");
    }
    else {
      vragenStand.find({}, function (err, vragen) {
        if (err) {
          handleError(res, err.message, "failed to get vragenstand");
        }
        else {
          wedstrijdenStand.find({}, function (err, wedstrijden) {

            for (var i = 0; i < roundTable.length; i += 1) {
              var scorewedstrijden = _.find(wedstrijden, function (o) { return o.Participant.Email === roundTable[i].Email });
              if (scorewedstrijden) {
                roundTable[i].TotalMatchesScore = scorewedstrijden.TotalMatchesScore;
              }

              var scorequestion = _.find(vragen, function (o) { return o.Participant.Email === roundTable[i].Email });
              if (scorequestion) {
                roundTable[i].TotalQuestionsScore = scorequestion.TotalQuestionsScore;
                roundTable[i].TotalScore = roundTable[i].TotalQuestionsScore + roundTable[i].TotalTeamScore + roundTable[i].TotalMatchesScore;
                delete roundTable[i].Email;
              }
              else {
                roundTable[i].TotalQuestionsScore = 0;
                roundTable[i].TotalScore = roundTable[i].TotalQuestionsScore + roundTable[i].TotalTeamScore + roundTable[i].TotalMatchesScore;
                delete roundTable[i].Email;
              }
            }

            roundTable = _.sortBy(roundTable, 'TotalScore').reverse();

            for (var i = 0; i < roundTable.length; i += 1) {

              if (i === 0) {
                roundTable[i].Positie = i + 1;
              }
              else {
                if (roundTable[i].TotalTeamScore === roundTable[i - 1].TotalTeamScore) {
                  roundTable[i].Positie = roundTable[i - 1].Positie;
                }
                else {
                  roundTable[i].Positie = i + 1;
                }
              }
               totaalStand.findOneAndUpdate({RoundId : roundTable[i].RoundId, Name : roundTable[i].Name }, roundTable[i], ({ upsert: true }), function (err, totaalStand) {
               if (err) return handleError(res, err.message, "Failed to save totaalstand");
               });
            }
          })
        }
      })
    }
  });
  }