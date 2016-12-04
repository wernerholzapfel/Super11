var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var config = require('../config/database');

var Headlines = require("../models/headlinesModel");


apiRoutes.get("/headlines/", function (req, res, next) {
  Headlines.find({}, { createdAt: 1, content: 1, _id: 1 }, { sort: { createdAt: -1 } }, function (err, headlines) {
    if (err) {
      handleError(res, err.message, "failed to get headlines");
    }
    else {
      res.status(200).json(headlines);
    }
  });
});


module.exports = apiRoutes;