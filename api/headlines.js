var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

var headlines = require("../models/headlinesModel");
var User = require('../models/user');


apiRoutes.get("/headlines/", function (req, res, next) {
  Headlines.find({}, { createdAt: 1, content: 1, _id: 1 }, { sort: { createdAt: -1 } }, function (err, headlines) {
    if (err) {
      handleError(res, err.message, "failed to get headlines");
    }
    else {
      res.status(200).json(headlines);
    }
  });
});

apiRoutes.post("/headlines/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        var headlines = new Headlines(req.body);
        headlines.createdAt = new Date().toUTCString()

        headlines.save(function (err, newheadlines) {
          if (err) {
            handleError(res, err.message, "Failed to create new headline.");
          } else {
            console.log(newheadlines);
            res.status(200).json(newheadlines);
          }
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

apiRoutes.delete("/headlines/:id", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    console.log("delete is aangeroepen door: " + decoded.name);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        Headlines.find({ _id: req.params.id }).remove(function (err, item) {
          if (err) return handleError(res, err.message, "Failed to delete Item");
          res.status(200).json(item);
        })
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
    res.status(200);
  }
});

module.exports = apiRoutes;