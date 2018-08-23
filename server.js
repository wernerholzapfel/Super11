//This file contains all of our server-side code, which implements our REST API.
//It’s written in Node.js, using the Express framework and the MongoDB Node.js driver.

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var dotenv = require('dotenv');


var path = require("path");
var assert = require("assert");
var config = require('./config/database');
var db = require("./db.js");
var _ = require('lodash');
var async = require("async");

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Pragma, Expires, Cache-Control,');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

dotenv.load();

app.use(allowCrossDomain);
app.use(express.static(__dirname + "/public"));

// get our request parameters
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//log to consolea
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// Initialize the app.
var server = app.listen(process.env.PORT || 8200, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});


var authenticateCall = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
});

var apiRoutes = express.Router();

var comments = require('./api/comments');
var postcomments = require('./api/postcomments');

// var signup = require('./api/signup');
// app.use('/api',signup);

var predictionform = require('./api/predictionform');
app.use('/api', predictionform);

var homepagestats = require('./api/homepagestats');
var scoreforms = require('./api/scoreforms');
var standen = require('./api/standen');
var totalscoreperuser = require('./api/totalscoreperuser');
var headlines = require('./api/headlines');
var postheadlines = require('./api/postheadlines');
var statistieken = require('./api/statistieken');
var eredivisieplayers = require('./api/eredivisieplayers');
var predictions = require('./api/predictions');
var istransfermarktopen = require('./api/istransfermarktopen');
var rounds = require('./api/rounds');
var getlatestteam = require('./api/getlatestteam');
var savetransfers = require('./api/savetransfers');
var participants = require('./api/participants');


app.use('/api', homepagestats, comments, headlines, eredivisieplayers, predictions, rounds, istransfermarktopen);
app.use('/api', standen, statistieken, participants);
app.use('/api', authenticateCall, totalscoreperuser, scoreforms, postheadlines, postcomments, getlatestteam, savetransfers);


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
handleError = function (res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
};

var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
            type: process.env.type,
            project_id: process.env.project_id,
            private_key_id: process.env.private_key_id,
        // private_key: process.env.private_key,
        private_key: JSON.parse(process.env.private_key),
            client_email: process.env.client_email,
            client_id: process.env.client_id,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://accounts.google.com/o/oauth2/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            client_x509_cert_url: process.env.client_x509_cert_url
        }
    )
    , databaseURL: process.env.firebaseDatabaseUrl,
});

//
// var copy = require('./copyTeamsToNewTable');
//
// copy.copyTeamsToNewTable();
