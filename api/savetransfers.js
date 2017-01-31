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
var _ = require('lodash');

var determineifplayerisselected = require("../determineifplayerisselected");
var Teampredictions = require('../models/teamPredictionsModel');

apiRoutes.post("/savetransfers", function (req, res) {
    var date = new Date;
    var startdatum = moment("2016-12-19");
    var einddatum = moment("2017-02-04");
    var speeldatums = [];
    speeldatums.push("2017-1-13", "2017-1-14", "2017-1-15");
    speeldatums.push("2017-1-20", "2017-1-21", "2017-1-22");
    speeldatums.push("2017-1-27", "2017-1-28", "2017-1-29");
    speeldatums.push("2017-2-03", "2017-2-04", "2017-2-05");

    var nu = moment(date).tz("Europe/Amsterdam");
    var nuInString = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    //check of transferperiode open is
    if (nu >= startdatum && nu < einddatum) {
        //check of speeldag is
        if (_.includes(speeldatums, nuInString)) {
            //check of het vrijdag voor 18h is
            if (nu.day() == 5 && nu.hours() < 18) {
                saveTransfers(req, res);
            }
            else {
                //we zijn gesloten.
                return res.status(403).json("Tijdens speelrondes is de transfermarkt vanaf vrijdag 18h tot zondag middernacht gesloten");
            }
        }
        else {
            //we zijn open op
            saveTransfers(req, res);
        }
    }
    else {
        //we zijn dicht
        return res.status(403).json("De transfermarkt is geopend van " + startdatum + "tot " + einddatum);

    }
});

var saveTransfers = function (req, res) {
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
                    teampredictions.RoundId = req.body.RoundId + 1;
                    delete teampredictions._id;

                    // var teampredictions = new Teampredictions(req.body);
                    Teampredictions.findOneAndUpdate({
                        'Participant.Email': user.email,
                        RoundId: teampredictions.RoundId
                    }, teampredictions, ({upsert: true}), function (err, newTeampredictions) {
                        if (err) {
                            handleError(res, err.message, "Failed to create new prediction.");
                        } else {
                            res.status(201).json(newTeampredictions);
                            determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
                        }
                    });
                }
            }
        ])
    }
};

module.exports = apiRoutes;
