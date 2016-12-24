var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');

var config = require('../config/database');

var Comments = require("../models/commentsModel");

apiRoutes.get("/comments/", function (req, res, next) {
  Comments.find({}, {}, { sort: { createdAt: -1 } }, function (err, comments) {
    if (err) {
      handleError(res, err.message, "failed to get comments");
    }
    else {
      res.status(200).json(comments);
    }
  });
});


module.exports = apiRoutes;