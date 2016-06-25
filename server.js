//This file contains all of our server-side code, which implements our REST API.
//It’s written in Node.js, using the Express framework and the MongoDB Node.js driver.

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var ObjectID = mongodb.ObjectID;
var assert = require("assert");
var Predictions = require("./predictionModel.js")

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

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

app.post("/api/predictions", function (req, res) {
  var predictions = new Predictions(req.body);

  predictions.save(function (err, newPrediction) {
    if (err) {
      handleError(res, err.message, "Failed to create new prediction.");
    } else {
      res.status(201).json(predictions);
    }
  });
});

app.get("/api/predictions", function (req, res, next) {
  Predictions.find({}, { Participant: 1, _id: 0 }, function (err, predictionsList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(predictionsList);
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