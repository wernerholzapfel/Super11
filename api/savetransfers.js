var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");
var totaalStand = require("../models/totaalStandModel");

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
    var einddatum = moment("2019-05-12");
    var speeldatums = [];
    speeldatums.push("2018-8-10", "2018-8-11", "2018-8-12");
    speeldatums.push("2018-8-17", "2018-8-12", "2018-8-13");
    speeldatums.push("2018-8-24", "2018-8-12", "2018-8-13");
    speeldatums.push("2018-8-31", "2018-8-12", "2018-8-13");
    speeldatums.push("2018-9-15", "2018-9-16");
    speeldatums.push("2018-9-21", "2018-9-22", "2018-9-23");
    speeldatums.push("2018-9-29", "2018-9-30");
    speeldatums.push("2018-10-5", "2018-10-6", "2018-10-7");
    speeldatums.push("2018-10-20", "2018-10-21");
    speeldatums.push("2018-10-26", "2018-10-27", "2018-10-28");
    speeldatums.push("2018-11-2", "2018-11-3", "2018-11-4");
    speeldatums.push("2018-11-9", "2018-11-10", "2018-11-11");
    speeldatums.push("2018-11-24", "2018-11-25");
    speeldatums.push("2018-11-30", "2018-12-1", "2018-12-2");
    speeldatums.push("2018-12-7", "2018-12-8", "2018-12-9");
    speeldatums.push("2018-12-14", "2018-12-15", "2018-12-16");
    speeldatums.push("2018-12-21", "2018-12-22", "2018-12-23");
    speeldatums.push("2019-1-18", "2019-1-19", "2019-1-20");
    speeldatums.push("2019-1-25", "2019-1-26", "2019-1-27");
    speeldatums.push("2019-2-1", "2019-2-2", "2019-2-3");
    speeldatums.push("2019-2-8", "2019-2-9", "2019-2-10");
    speeldatums.push("2019-2-15", "2019-2-16", "2019-2-17");
    speeldatums.push("2019-2-22", "2019-2-23", "2019-2-24");
    speeldatums.push("2019-3-1", "2019-3-2", "2019-3-3");
    speeldatums.push("2019-3-8", "2019-3-9", "2019-3-10");
    speeldatums.push("2019-3-15", "2019-3-16", "2019-3-17");
    speeldatums.push("2019-3-30", "2019-3-31");
    speeldatums.push("2019-4-2", "2019-4-3", "2019-4-4");
    speeldatums.push("2019-4-6", "2019-4-7");
    speeldatums.push("2019-4-12", "2019-4-13", "2019-4-14");
    speeldatums.push("2019-4-19", "2019-4-20", "2019-4-21");
    speeldatums.push("2019-4-23", "2019-4-24", "2019-4-25");
    speeldatums.push("2019-4-28");
    speeldatums.push("2019-5-12");

    var nu = moment(date).tz("Europe/Amsterdam");
    var nuInString = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    //check of transferperiode open is
    if (nu >= startdatum && nu < einddatum) {
        //check of speeldag is
        if (_.includes(speeldatums, nuInString)) {
            //check of het vrijdag voor 18h is
            if ((nu.day() != 6 || nu.day() != 7) && nu.hours() < 18) {
                saveTransfers(req, res);
            }
            else {
                //we zijn gesloten.
                return res.status(403).json("Tijdens speelrondes is de transfermarkt op doordeweekse dagen vanaf 18:00 gesloten en op zaterdag en zondag de gehele dag.");
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
                    if (err) {
                        console.log(err);
                        callback(err)
                    }
                    else {
                        callback(null, user);
                    }
                });
            },
            function (user, callback) {
                totaalStand.find({}, {RoundId: 1, _id: 0}, {sort: {RoundId: -1}}, function (err, rounds) {
                    if (err) {
                        handleError(res, err.message, "failed to get rounds");
                    }
                    else {
                        var maxRoundId = (rounds[0] && rounds[0].RoundId) ? rounds[0].RoundId : 0;
                        callback(null, maxRoundId, user)
                    }
                });
            },
            function (maxRoundId, user, callback) {
                //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
                totaalStand.findOne({RoundId: maxRoundId, Email: user.email}).lean().exec(function (err, roundTable) {
                    if (err) return console.error(err);
                    callback(null, roundTable, maxRoundId, user);
                })
            },
            function (roundTable, maxRoundId, user, callback) {
                if (roundTable && roundTable.TeamScores) {
                    var allplayers = _.concat(roundTable.TeamScores, req.body.Team);
                    if (_.uniqBy(allplayers, 'PlayerId').length > 17) {
                        return res.status(403).json("Je kan nog maar maximaal " + (17 - roundTable.TeamScores.length) + " transfers doorvoeren");
                    } else {
                        callback(null, user);
                    }
                } else {
                    callback(null, user);
                }
            },
            function (user, callback) {
                console.log('ik ben stapje 5');

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
        ]),
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(400).json(err);
                }
            }
    }
};

module.exports = apiRoutes;
