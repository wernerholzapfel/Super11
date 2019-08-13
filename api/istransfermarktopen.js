var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');


apiRoutes.get("/isinschrijvingopen", function (req, res, next) {
    var date = new Date;
    var startdatum = moment("2019-09-01").tz("Europe/Amsterdam");
    var einddatum = moment("2019-09-14").tz("Europe/Amsterdam");
    var uren = 18;
    var minuten = 30;

    var nuDateTime = moment(date).tz("Europe/Amsterdam");
    var nuDate = moment(date).startOf('Day').tz("Europe/Amsterdam");

    if (nuDate.isBefore(startdatum) || nuDate.isAfter(einddatum) ||
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
    var startdatum = moment("2019-09-14");
    var einddatum = moment("2020-05-10");
    var speeldatums = [];
    speeldatums.push("2019-9-14", "2019-9-15");
    speeldatums.push("2019-9-20", "2019-9-21", "2019-9-22");
    speeldatums.push("2019-9-27", "2019-9-28", "2019-9-29");
    speeldatums.push("2019-10-4", "2019-10-5", "2019-10-6");
    speeldatums.push("2019-10-19", "2019-10-20");
    speeldatums.push("2019-10-25", "2019-10-26", "2019-10-27");
    speeldatums.push("2019-11-2", "2019-11-3");
    speeldatums.push("2019-11-8", "2019-11-9", "2019-11-10");
    speeldatums.push("2019-11-23", "2019-11-24");
    speeldatums.push("2019-11-29", "2019-11-30", "2019-12-1");
    speeldatums.push("2019-12-6", "2019-12-7", "2019-12-8");
    speeldatums.push("2019-12-13", "2019-12-14", "2019-12-15");
    speeldatums.push("2019-12-20", "2019-12-21", "2019-12-22");
    speeldatums.push("2020-1-17", "2020-1-18", "2020-1-19");
    speeldatums.push("2020-1-24", "2020-1-25", "2020-1-26");
    speeldatums.push("2020-1-31", "2020-2-1", "2020-2-2");
    speeldatums.push("2020-2-7", "2020-2-8", "2020-2-9");
    speeldatums.push("2020-2-14", "2020-2-15", "2020-2-16");
    speeldatums.push("2020-2-21", "2020-2-22", "2020-2-23");
    speeldatums.push("2020-2-28", "2020-2-29", "2020-3-1");
    speeldatums.push("2020-3-6", "2020-3-7", "2020-3-8");
    speeldatums.push("2020-3-13", "2020-3-14", "2020-3-15");
    speeldatums.push("2020-3-20", "2020-3-21", "2020-3-22");
    speeldatums.push("2020-4-4", "2020-4-5");
    speeldatums.push("2020-4-10", "2020-4-11", "2020-4-12");
    speeldatums.push("2020-4-21", "2020-4-22", "2020-4-23");
    speeldatums.push("2020-4-25", "2020-4-26");
    speeldatums.push("2020-5-3");
    speeldatums.push("2020-5-10");


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