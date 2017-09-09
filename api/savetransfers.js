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

apiRoutes.post("/saveteam", function (req, res) {
    saveTransfers(req, res)
})


apiRoutes.post("/savetransfers", function (req, res) {
    var date = new Date;
    var startdatum = moment("2017-12-25");
    var einddatum = moment("2018-02-02");
    var speeldatums = [];
    speeldatums.push("2018-1-19", "2018-1-20", "2018-1-21");
    speeldatums.push("2018-1-26", "2018-1-27", "2018-1-28");

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
        return res.status(403).json("De transfermarkt is geopend van " + startdatum.format('DD-MM-YYYY') + " tot " + einddatum.format('DD-MM-YYYY'));

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
                    teampredictions.RoundId = (req.body.RoundId) ? req.body.RoundId + 1 : 1;
                    delete teampredictions._id;
                    delete teampredictions.__v;

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
