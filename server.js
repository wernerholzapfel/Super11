//This file contains all of our server-side code, which implements our REST API.
//It’s written in Node.js, using the Express framework and the MongoDB Node.js driver.

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var path = require("path");
var assert = require("assert");
var config = require('./config/database');
var db = require("./db.js");
var _ = require('lodash');
var async = require("async");

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain)
app.use(express.static(__dirname + "/public"));

// get our request parameters
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//log to consolea
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// Initialize the app.
var server = app.listen(process.env.PORT || 8200, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

require('./config/passport')(passport);

var apiRoutes = express.Router();

var comments = require('./api/comments');
app.use('/api', comments);

// var signup = require('./api/signup');
// app.use('/api',signup);

// var predictionform = require('./api/predictionform');
// app.use('/api', predictionform);

var authenticate = require('./api/authenticate');
app.use('/api', authenticate);

var homepagestats = require('./api/homepagestats');
app.use('/api', homepagestats);

var scoreforms = require('./api/scoreforms');
app.use('/api', scoreforms);

var standen = require('./api/standen');
app.use('/api',standen);

var totalscoreperuser = require('./api/totalscoreperuser')
app.use('/api',totalscoreperuser);

var headlines =require('./api/headlines');
app.use('/api',headlines);

var statistieken = require('./api/statistieken');
app.use('/api', statistieken);

var eredivisieplayers = require('./api/eredivisieplayers');
app.use('/api', eredivisieplayers);

var predictions = require('./api/predictions');
app.use('/api',predictions);

var rounds = require('./api/rounds');
app.use('/api',rounds);

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}