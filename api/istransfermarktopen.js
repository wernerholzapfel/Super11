var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');


apiRoutes.get("/isinschrijvingopen", function (req, res, next) {
    var date = new Date;
    var einddatum = moment("2018-09-14").tz("Europe/Amsterdam");
    const uren = 18;
    const minuten = 30;

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
    var startdatum = moment("2017-12-25");
    var einddatum = moment("2018-02-03");
    var speeldatums = [];
    speeldatums.push("2018-1-19", "2018-1-20", "2017-1-21");
    speeldatums.push("2018-1-26", "2018-1-27", "2018-1-28", "2018-2-2");

    var nu = moment(date).tz("Europe/Amsterdam");
    var nuInString = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    //check of transferperiode open is
    if (nu >= startdatum && nu < einddatum) {
        //check of speeldag is
        if (_.includes(speeldatums, nuInString)) {
            //check of het zaterdag of zondag is (hele dag dicht)
            //check of het vrijdag voor 18h is
            if (nu.day() == 5 && nu.hours() < 18) {
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