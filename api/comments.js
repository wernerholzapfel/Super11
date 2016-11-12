var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

var Comments = require("../models/commentsModel");
var User = require("../models/user");
var Predictions = require("../models/predictionModel");

apiRoutes.get("/comments/", function (req, res, next) {
  Comments.find({}, {}, { sort: { createdAt: -1 } }, function (err, comments) {
    if (err) {
      handleError(res, err.message, "failed to get comments");
    }
    else {
      res.status(200).json(comments);
    }
  });
});

apiRoutes.post("/comments/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      else {
        Predictions.findOne({ 'Participant.Email': decoded.name }, { 'Participant.Name': 1 }, function (err, name) {
          if (name) {
            var comments = new Comments(req.body);
            comments.createdAt = new Date().toUTCString()
            comments.name = name.Participant.Name;
            comments.save(function (err, newComment) {
              if (err) {
                handleError(res, err.message, "Failed to create new newComment.");
              } else {
                console.log(newComment);
                res.status(200).json(newComment);
              }
            });
          }
        });
      }
    });
  }
});

module.exports = apiRoutes;