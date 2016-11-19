var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');


var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
  //get users token read

});

var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');
var jwtDecode = require('jwt-decode');

var async = require("async");
var _ = require('lodash');

var totaalStand = require("../models/totaalStandModel");
var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var User = require('../models/user');

apiRoutes.get("/totaalscoreuser/", function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwtDecode(token, config.secret);

    management.getUser({ id: decoded.sub }, function (err, user) {
      console.log(user);
   

    User.findOne({ name: user.email }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user) {
        async.waterfall([
          function (callback) {
            RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, { sort: { RoundId: -1 } }, function (err, rounds) {
              if (err) {
                handleError(res, err.message, "failed to get rounds");
              }
              else {
                var maxRoundId = rounds[0].RoundId;
                callback(null, maxRoundId)
              }

            });
          },
          function (maxRoundId, callback) {
            totaalStand.findOne({ RoundId: maxRoundId, 'Email': user.name }, { Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, roundTable) {
              if (err) return console.error(err);
              callback(null, roundTable, maxRoundId);
            })
          },
          function (roundTable, maxRoundId, callback) {
            // totaalStand.findOne({ RoundId: (maxRoundId - 1), 'Email': user.name }, { Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, previousRoundTable) {
            totaalStand.findOne({ RoundId: (maxRoundId - 1), 'Name': roundTable.Name }, { Email: 0 }, { sort: { TotalScore: -1 } }).lean().exec(function (err, previousRoundTable) {
              if (err) return console.error(err);
              callback(null, roundTable, previousRoundTable)
            })
          },
          function (roundTable, previousRoundTable, callback) {

            roundTable.previousPositie = previousRoundTable.Positie;
            roundTable.deltaPositie = previousRoundTable.Positie - roundTable.Positie;
            roundTable.Weekscore = roundTable.TotalScore - previousRoundTable.TotalScore;
            if (roundTable.deltaPositie > 0) roundTable.Tekst = "stijg je naar plek " + roundTable.Positie;
            if (roundTable.deltaPositie == 0) roundTable.Tekst = "blijf je op plek" + roundTable.Positie + " staan";
            if (roundTable.deltaPositie < 0) roundTable.Tekst = "zak je naar plek " + roundTable.Positie;

            res.status(200).json(roundTable)
          }
        ]);
      };
    }); 
  });
  }
});

module.exports = apiRoutes;