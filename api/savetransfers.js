var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
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

var Teampredictions = require('../models/teamPredictionsModel');

apiRoutes.post("/savetransfers", function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        //todo user ophalen 
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({ id: decoded.sub }, function (err, user) {
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.email_verified) {
                    var teampredictions = new Teampredictions(req.body);
                    teampredictions.Participant.Email = user.email;
                    Teampredictions.findOneAndUpdate({ 'Participant.Email': user.email, RoundId: req.body.RoundId }, teampredictions, ({ upsert: true }), function (err, newPrediction) {
                        if (err) {
                            handleError(res, err.message, "Failed to create new prediction.");
                        } else {
                            res.status(201).json(teampredictions);
                            // determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
                        }
                    });
                }
            }
        ])
    }
});

module.exports = apiRoutes;
