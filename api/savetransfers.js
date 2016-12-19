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
var moment = require('moment-timezone');

var Teampredictions = require('../models/teamPredictionsModel');

apiRoutes.post("/savetransfers", function (req, res) {
    var date = new Date;
    var startdatum = moment("2016-11-19");
    var einddatum = moment("2017-02-01");

    var nu = moment(date).tz("Europe/Amsterdam");

    //check of transferperiode open is
    if (nu >= startdatum && nu < einddatum) {
        //check of het zaterdag of zondag is (hele dag dicht)
        if (nu <= startdatum || nu.day() == 6 || nu.day() == 7) {
            return res.status(403).json("Vanaf vrijdag 18h tot zondag middernacht is de transfermarkt gesloten");
        }
        else {
            //check of het vrijdag na 18h is
            if (nu.day() == 5 && nu.hours() >= 18) {
                return res.status(403).json("Vanaf vrijdag 18h tot zondag middernacht is de transfermarkt gesloten");
            }
            else {
                //we zijn open.
                var token = getToken(req.headers);
                if (token) {
                    async.waterfall([
                        function (callback) {
                            var decoded = jwtDecode(token, secret);
                            management.getUser({id: decoded.sub}, function (err, user) {
                                callback(null, user);
                            });
                        },
                        function (user, callback) {
                            if (user.email_verified) {

                                var teampredictions = {};
                                teampredictions = Object.assign(teampredictions, req.body);
                                teampredictions.Participant.Email = user.email;
                                delete teampredictions._id;

                                // var teampredictions = new Teampredictions(req.body);
                                Teampredictions.findOneAndUpdate({
                                    'Participant.Email': user.email,
                                    RoundId: req.body.RoundId
                                }, teampredictions, ({upsert: true}), function (err, newTeampredictions) {
                                    if (err) {
                                        handleError(res, err.message, "Failed to create new prediction.");
                                    } else {
                                        res.status(201).json(newTeampredictions);
                                        // determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
                                    }
                                });
                            }
                        }
                    ])
                }
            }
        }
    }
    else {
        //we zijn dicht
        return res.status(403).json("De transfermarkt is nog niet open");
    }
});

module.exports = apiRoutes;
