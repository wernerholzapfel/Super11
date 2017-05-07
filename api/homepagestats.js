var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var async = require("async");

var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var newteamStand = require("../models/newTeamStandModel");
var totaalStand = require("../models/totaalStandModel");


apiRoutes.get("/nummereentotaalstand", function (req, res, next) {
  async.waterfall([
    function (callback) {
      RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, { sort: { RoundId: -1 } }, function (err, rounds) {
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
      totaalStand.findOne({ RoundId: maxRoundId }, { TeamScores: 0, Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, roundTable) {
        if (err) return console.error(err);
        res.status(200).json(roundTable);
      })
    }])
});

apiRoutes.get("/nummereenteamstandlaatsteronde", function (req, res, next) {
  async.waterfall([
    function (callback) {
      RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, { sort: { RoundId: -1 } }, function (err, rounds) {
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
      newteamStand.findOne({ RoundId: maxRoundId }, { TeamScores: 0, _id: 0, __v: 0, 'Participant.PhoneNumber': 0, 'Participant.Email': 0 }, { sort: { TotalTeamScore: -1 } }, function (err, roundTable) {
        if (err) {
          handleError(res, error.message, "failed tot get roundTable");
        }
        else {
          res.status(200).json(roundTable);
        }
      });
    }
  ])
});

apiRoutes.get("/laatsteupdate", function (req, res, next) {
  async.waterfall([
    function (callback) {
      RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, { sort: { RoundId: -1 } }, function (err, rounds) {
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
      newteamStand.findOne({ RoundId: maxRoundId }, { updatedAt: 1 }, { sort: { TotalTeamScore: -1 } }, function (err, roundTable) {
        if (err) {
          handleError(res, error.message, "failed tot get roundTable");
        }
        else {
          res.status(200).json(roundTable);
        }
      });
    }
  ])
});

module.exports = apiRoutes;
