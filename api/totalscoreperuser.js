
var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var config = require('../config/database');

var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
  //get users token read
  token: process.env.token || config.token,
  domain: process.env.domain || config.domain
});

var jwtDecode = require('jwt-decode');

var async = require("async");
var _ = require('lodash');

var totaalStand = require("../models/totaalStandModel");
var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var User = require('../models/user');

var secret = process.env.secret || config.secret;

apiRoutes.get("/totaalscoreuser/", function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    async.waterfall([
      function (callback) {
        var decoded = jwtDecode(token, secret);

        management.getUser({ id: decoded.sub }, function (err, user) {
          if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
          callback(null, user);
        })
      },
      function (user, callback) {
        RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, { sort: { RoundId: -1 } }, function (err, rounds) {
          if (err) {
            handleError(res, err.message, "failed to get rounds");
          }
          else {
              var maxRoundId = (rounds[0]) ? rounds[0].RoundId : 0;
              callback(null, user, maxRoundId)
          }

        });
      },
      function (user, maxRoundId, callback) {
        totaalStand.findOne({ RoundId: maxRoundId, 'Email': user.email }, { Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, roundTable) {
          if (err) return console.error(err);
          callback(null, user, roundTable, maxRoundId);
        })
      },
      function (user, roundTable, maxRoundId, callback) {
          if (!roundTable) return res.status(200).json(false);
        totaalStand.findOne({ RoundId: (maxRoundId - 1), 'Email': user.email }, { Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, previousRoundTable) {
          if (err) return console.error(err);
          callback(null, roundTable, previousRoundTable)
        })
      },
      function (roundTable, previousRoundTable, callback) {

          roundTable.previousPositie = (previousRoundTable) ? previousRoundTable.Positie : 1;
          roundTable.deltaPositie = roundTable.previousPositie - roundTable.Positie;
          roundTable.Weekscore = (previousRoundTable) ? roundTable.TotalScore - previousRoundTable.TotalScore : roundTable.TotalScore;
        if (roundTable.deltaPositie > 0) roundTable.Tekst = "stijg je naar plek " + roundTable.Positie;
        if (roundTable.deltaPositie == 0) roundTable.Tekst = "blijf je op plek" + roundTable.Positie + " staan";
        if (roundTable.deltaPositie < 0) roundTable.Tekst = "zak je naar plek " + roundTable.Positie;

        res.status(200).json(roundTable.Name + ", je weekscore is " + roundTable.Weekscore + " dat maakt je totaal " + roundTable.TotalScore + ". Hiermee " + roundTable.Tekst + " in de totaalstand.")
      }
    ]);
  };
});

module.exports = apiRoutes;