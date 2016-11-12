var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

var RoundTeamScoreForms = require("../models/roundteamscoreformsModel");
var MatchesScoreForm = require("../models/wedstrijdenScoreformsModel.js");
var QuestionsScoreForm = require("../models/vragenScoreformsModel.js");
var Eindstandscoreform = require("../models/eindstandScoreformsModel.js");
var User = require("../models/user");

var calculateteam = require("../calculateteam.js");
var calculatevragen = require("../calculatevragen.js");
var calculatewedstrijden = require("../calculatewedstrijden.js");
var calculatetotaalstand = require("../calculatetotaalstand.js");
var calculateeindstand = require("../calculateeindstand.js");

apiRoutes.get("/roundteamscoreforms/:roundId", function (req, res, next) {
  RoundTeamScoreForms.findOne({ RoundId: + req.params.roundId }, function (err, playersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(playersList);
    }
  });
});

apiRoutes.put("/roundteamscoreforms/:id", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        var updateScoreForm = {};
        updateScoreForm = Object.assign(updateScoreForm, req.body);
        delete updateScoreForm._id;

        RoundTeamScoreForms.findOneAndUpdate({ RoundId: req.params.id }, updateScoreForm, ({ upsert: true }), function (err, roundteamscoreforms) {
          if (err) return handleError(res, err.message, "Failed to Update Players");
          res.status(200).json(roundteamscoreforms);
          console.log("put for roundId " + req.params.id)

          calculateteam.calculateTeamPredictionsPerRound(req.params.id);
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

apiRoutes.get("/questionsScoreform/", function (req, res, next) {
  QuestionsScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get questions");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

apiRoutes.put("/questionsScoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        QuestionsScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, questionsScoreForm) {
          if (err) return handleError(res, err.message, "Failed to Update questions");
          res.status(200).json(questionsScoreForm);
          console.log("saved questions")
          calculatevragen.calculateQuestions();
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

apiRoutes.get("/matchesScoreform/", function (req, res, next) {
  MatchesScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get matches");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

apiRoutes.put("/matchesScoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        MatchesScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, matchesScoreform) {
          if (err) return handleError(res, err.message, "Failed to Update questions");
          res.status(200).json(matchesScoreform);
          console.log("saved matches")
          calculatewedstrijden.calculateWedstrijdScore();
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

apiRoutes.get("/eindstandscoreform", function (req, res, next) {
  Eindstandscoreform.findOne(function (err, eindstand) {
    if (err) {
      handleError(res, error.message, "failed tot get eindstandscoreform");
    }
    else {
      res.status(200).json(eindstand);
    }
  });
});

apiRoutes.put("/eindstandscoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        Eindstandscoreform.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, eindstandscoreform) {
          if (err) return handleError(res, err.message, "Failed to Update eindstand");
          res.status(200).json(eindstandscoreform);
          console.log("saved eindstand")
          //todo calculate eindstand
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

module.exports = apiRoutes;