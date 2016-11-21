var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");

var async = require("async");
var jwtDecode = require('jwt-decode');
var config = require('../config/database');
var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
  //get users token read
  token: process.env.token || config.token,
  domain: process.env.domain || config.domain
});
var secret = process.env.secret || config.secret;

var Headlines = require("../models/headlinesModel");
var User = require('../models/user');

apiRoutes.post("/headlines/", function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    async.waterfall([
      function (callback) {
        var decoded = jwtDecode(token, secret);
        management.getUser({ id: decoded.sub }, function (err, user) {
          if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
          callback(null, user);
        });
      },
      function (user, callback) {
        if (user.app_metadata.roles.indexOf('admin') > -1) {
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
      }
    ])
  }
});


apiRoutes.delete("/headlines/:id", function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    async.waterfall([
      function (callback) {
        var decoded = jwtDecode(token, secret);
        management.getUser({ id: decoded.sub }, function (err, user) {
          if (!user.email_verified) return res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
          callback(null, user);
        });
      },
      function (user, callback) {
        if (user.app_metadata.roles.indexOf('admin') > -1) {
          Headlines.find({ _id: req.params.id }).remove(function (err, item) {
            if (err) return handleError(res, err.message, "Failed to delete Item");
            res.status(200).json(item);
          })
        }
        else {
          return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
        }
      }])
  }
});

module.exports = apiRoutes;
