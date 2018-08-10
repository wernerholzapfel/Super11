var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');


apiRoutes.get("/isinschrijvingopen", function (req, res, next) {
    var date = new Date;
    var einddatum = moment("2018-09-15").tz("Europe/Amsterdam");
    var uren = 18;
    var minuten = 30;

    var nuDateTime = moment(date).tz("Europe/Amsterdam");
    var nuDate = moment(date).startOf('Day').tz("Europe/Amsterdam");

    if (nuDate.isAfter(einddatum) ||
        (nuDate.isSame(einddatum) && nuDateTime.hours() == uren && nuDateTime.minutes() >= minuten) ||
        (nuDate.isSame(einddatum) && nuDateTime.hours() > uren)) {
        res.status(200).json(false);
    }
    else {
        res.status(200).json(true)
    }
});


apiRoutes.get("/istransfermarktopen", function (req, res, next) {
    var date = new Date;
    var startdatum = moment("2018-09-16");
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
    speeldatums.push("2019-1-18", "2018-1-19", "2018-1-20");
    speeldatums.push("2019-1-25", "2018-1-26", "2018-1-27");
    speeldatums.push("2019-2-1", "2018-2-2", "2018-2-3");
    speeldatums.push("2019-2-8", "2018-2-9", "2018-2-10");
    speeldatums.push("2019-2-15", "2018-2-16", "2018-2-17");
    speeldatums.push("2019-2-22", "2018-2-23", "2018-2-24");
    speeldatums.push("2019-3-1", "2018-3-2", "2018-3-3");
    speeldatums.push("2019-3-8", "2018-3-9", "2018-3-10");
    speeldatums.push("2019-3-15", "2018-3-16", "2018-3-17");
    speeldatums.push("2019-3-30", "2018-3-31");
    speeldatums.push("2019-4-2", "2018-4-3", "2018-4-4");
    speeldatums.push("2018-4-6", "2018-4-7");
    speeldatums.push("2019-4-12", "2018-4-13", "2018-4-14");
    speeldatums.push("2019-4-19", "2018-4-20", "2018-4-21");
    speeldatums.push("2019-4-23", "2018-4-24", "2018-4-25");
    speeldatums.push("2019-4-28");
    speeldatums.push("2019-5-12");


    var nu = moment(date).tz("Europe/Amsterdam");
    var nuInString = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    //check of transferperiode open is
    if (nu >= startdatum && nu < einddatum) {
        //check of speeldag is
        if (_.includes(speeldatums, nuInString)) {
            //check of het zaterdag of zondag is (hele dag dicht)
            //check of het vrijdag voor 18h is
            if ((nu.day() != 6 || nu.day() != 7) && nu.hours() < 18) {
                res.status(200).json(true);
            }
            else {
                //we zijn gesloten.
                res.status(200).json(false);
            }
        }
        else {
            //we zijn open op
            res.status(200).json(true);
        }
    }
    else {
        //we zijn dicht
        res.status(200).json(false);
    }
});


module.exports = apiRoutes;