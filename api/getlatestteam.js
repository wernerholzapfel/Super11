var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");

var config = require('../config/database');
var jwtDecode = require('jwt-decode');

var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
    //get users token read
    token: process.env.token || config.token,
    domain: process.env.domain || config.domain
});
var secret = process.env.secret || config.secret;

var User = require('../models/user');
var Teampredictions = require("../models/teamPredictionsModel");

apiRoutes.get('/getlatestteam', function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({ id: decoded.sub }, function (err, user) {
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.email_verified) {
                    Teampredictions.findOne({ 'Participant.Email': user.email },                    
                    { 'Participant.Email': 0, createDate: 0 ,Table:0, __v :0}, 
                    {sort:{RoundId:-1}},
                    function (err, prediction) {
                        if (err) {
                            handleError(res, err.message, "Failed to get prediction.");
                        }
                        else {
                            res.status(200).json(prediction);
                        }
                    });
                }
            }
        ])
    }
});


module.exports = apiRoutes;
