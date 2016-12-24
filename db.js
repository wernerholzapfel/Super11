
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );

// Build the connection string
var dbURI = process.env.database || 'mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj';

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


// BRING IN YOUR SCHEMAS & MODELS
// For example
require("./models/predictionModel");
require("./models/roundteamscoreformsModel");
require("./models/eredivisiePlayersModel");
require("./models/eindstandScoreformsModel");
require("./models/teamStandModel");
require("./models/newTeamStandModel");
require("./models/headlinesModel"); 
require("./models/commentsModel");
require("./models/user");
require("./models/teamPredictionsModel");


