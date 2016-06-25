//This file contains all of our server-side code, which implements our REST API.
//It’s written in Node.js, using the Express framework and the MongoDB Node.js driver.

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var assert = require("assert");
var Predictions = require("./predictionModel.js")

var PREDICTIONS_COLLECTION = "predictions";

var app = express();

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
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var uri = process.env.MONGOLAB_GOLD_URI;
var url = 'mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj'
// Connect to the database before starting the application server.
mongodb.MongoClient.connect('mongodb://heroku_kxnktwsj:9cbcg3g2r9defoist09f3vduu1@ds023902.mlab.com:23902/heroku_kxnktwsj', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
  console.log("db is: " + db)
  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

app.post("/api/predictions", function (req, res) {
  var newPrediction = req.body;

  predictions.save(function (err, newPrediction) {
    if (err) {
      handleError(res, err.message, "Failed to create new prediction.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/api/predictions", function (req, res) {
  console.log("db in server is: " + db)
  predictions.find({}, { Participant: 1, _id: 0 }).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(docs);
    }
  });
});


app.post('/api/boeken/', function (req, res, next) {
  var predictions = new Predictions({
    Participant: {
      Name: "naam",
      Email: "email",
      Location: "location",
      Gender: "Male",
      PhoneNumber: "06123"
    },
    Table: [
      {
        Position: 1,
        SelectedTeam: "Aja",
        SelectedTeamId: 2
      },
      {
        Position: 2,
        SelectedTeam: "ADO",
        SelectedTeamId: 1
      },
    ],
    Team: [
      {
        Id: 1,
        Position: "GK",
        PlayerId: "27",
        PlayerName: "Cillessen",
        TeamId: ""
      },
      {
        Id: 2,
        Position: "DF",
        PlayerId: "11",
        PlayerName: "Derijck",
        TeamId: ""
      }],
    Questions: [{
      Id: 1,
      Question: "Wie wordt er kampioen in de premier league?",
      Answer: "Arsenal"
    }]
  });

  predictions.save(function (err, predictions) {
    if (err) {
      return next(err)
    }
    res.send(201).json(predictions);
  })
});


var calculateTeamPredictionsPerRound = function () {

  Predictions.find(function (err, predictions) {
    if (err) return console.error(err);
    console.log(predictions);
  })


};

calculateTeamPredictionsPerRound();