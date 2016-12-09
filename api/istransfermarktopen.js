var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');

apiRoutes.get("/istransfermarktopen", function (req, res, next) {
    // var datum = new time.Date()

    // datum.setTimezone('Europe/Kiev');
    // console.log(datum);
    var date = new Date;
    var startdatum = moment("2016-12-19");
    var einddatum = moment("2017-02-01");

    var nu = moment(date).tz("Europe/Amsterdam");
    // res.status(200).json(true);

    //check of transferperiode open is 
    if (nu >= startdatum && nu < einddatum) {
        //check of het zaterdag of zondag is (hele dag dicht)
        if (nu <= startdatum || nu.day() == 6 || nu.day() == 7) {
            res.status(200).json(false);
        }
        else {
            //check of het vrijdag na 18h is
            if (nu.day() == 5 && nu.hours() >= 18) {
                res.status(200).json(false);
            }
            else {
                //we zijn open.
                res.status(200).json(true);
            }
        }
    }
    else {
        //we zijn dicht
        res.status(200).json(false);
    }
});


module.exports = apiRoutes;