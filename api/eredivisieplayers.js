var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var EredivisiePlayers = require("../models/eredivisiePlayersModel");

apiRoutes.get("/eredivisieplayers", function (req, res, next) {
  EredivisiePlayers.find(function (err, eredivisieplayersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(eredivisieplayersList);
    }
  });
});

apiRoutes.get("/gekozeneredivisieplayers", function (req, res, next) {
  EredivisiePlayers.find({}, { Player: 1 }, function (err, eredivisieplayersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(eredivisieplayersList);
    }
  });
});

module.exports = apiRoutes;