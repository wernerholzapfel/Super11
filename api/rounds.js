var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");

apiRoutes.get("/rounds", function (req, res, next) {
  RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, function (err, rounds) {
    if (err) {
      handleError(res, err.message, "failed to get rounds");
    }
    else {
      res.status(200).json(rounds);
    }

  })
});

module.exports = apiRoutes;