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

var Comments = require("../models/commentsModel");
var User = require("../models/user");
var Predictions = require("../models/predictionModel");


apiRoutes.post("/comments/", function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function(callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({ id: decoded.sub }, function(err, user) {
                    callback(null, user);
                });
            },
            function(user, callback) {
                if (user.email_verified) {
                    Predictions.findOne({ 'Participant.Email': user.email }, { 'Participant.Name': 1 }, function(err, name) {
                        callback(null, name)
                    });
                }
                else {
                    res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                }
            },
            function(name, callback) {
                if (name) {
                    var comments = new Comments(req.body);
                    comments.createdAt = new Date().toUTCString()
                    comments.name = name.Participant.Name;
                    comments.save(function(err, newComment) {
                        if (err) {
                            handleError(res, err.message, "Failed to create new newComment.");
                        } else {
                            console.log(newComment);
                            return res.status(200).json(newComment);
                        }
                    });
                }
            }  
        ])
    }
});

module.exports = apiRoutes;
