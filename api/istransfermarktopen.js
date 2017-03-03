var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');

apiRoutes.get("/istransfermarktopen", function (req, res, next) {
    var date = new Date;
    var startdatum = moment("2016-12-19");
    var einddatum = moment("2017-02-04");
    var speeldatums = [];
    speeldatums.push("2017-1-13", "2017-1-14", "2017-1-15");
    speeldatums.push("2017-1-20", "2017-1-21", "2017-1-22");
    speeldatums.push("2017-1-27", "2017-1-28", "2017-1-29");
    speeldatums.push("2017-2-3", "2017-2-4", "2017-2-5");

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