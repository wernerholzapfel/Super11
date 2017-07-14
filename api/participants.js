var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var config = require('../config/database');

var Predictions = require("../models/predictionModel");


apiRoutes.get("/participants", function (req, res, next) {
    Predictions.find({}, {
        'Participant.Email': 0,
        "Team": 0,
        "Questions": 0,
        "Table": 0,
        "Matches": 0,
        createDate: 0
    }, function (err, predictionsList) {
        if (err) {
            handleError(res, err.message, "Failed to get predictions.");
        } else {
            res.status(200).json(predictionsList);
        }
    });
});


module.exports = apiRoutes;
