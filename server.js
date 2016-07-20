//This file contains all of our server-side code, which implements our REST API.
//It’s written in Node.js, using the Express framework and the MongoDB Node.js driver.

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var assert = require("assert");
var db = require("./db.js");
var calculate = require("./calculate.js");
var determineifplayerisselected = require("./determineifplayerisselected");
var app = express();
var Predictions = require("./predictionModel");
var Players = require("./playersModel");
var EredivisiePlayers = require("./eredivisiePlayersModel");
var teamStand = require("./teamStandModel");

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

app.post("/api/players", function (req, res) {
  var players = new Players(req.body);

  players.save(function (err, newPlayers) {
    if (err) {
      handleError(res, err.message, "Failed to create new players.");
    } else {
      res.status(201).json(newPlayers);
    }
  });
});

app.get("/api/players", function (req, res, next) {
  Players.find(function (err, playersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(playersList);
    }
  });
});

app.put("/api/players/:id", function (req, res) {

  Players.findOneAndUpdate({ RoundId: req.params.id }, req.body, ({ upsert: true }), function (err, playersList) {
    if (err) return handleError(res, err.message, "Failed to Update Players");
    res.status(200).json(playersList);
    console.log("put for roundId " + req.params.id)

    calculate.calculateTeamPredictionsPerRound(req.params.id);
  });
});

app.get("/api/teamStand/:roundId", function (req, res, next) {
  console.log("log api call roundTable/" + req.params.roundId);
  teamStand.find({ RoundId: req.params.roundId }, function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get roundTable");
    }
    else {
      res.status(200).json(roundTable);
    }
  });
});

app.get("/api/teamStand/", function (req, res, next) {
  console.log("log api call roundTable/");
  teamStand.find(function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get roundTable");
    }
    else {
      res.status(200).json(roundTable);
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

app.get("/api/eredivisieplayers", function (req, res, next) {
  EredivisiePlayers.find(function (err, eredivisieplayersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(eredivisieplayersList);
    }
  });
});


//todo remove this
// calculate.calculateTeamPredictionsPerRound(1);
determineifplayerisselected.setNumberOfTimesAplayerIsSelected();

// calculate.calculateTeamPredictionsPerRound(2);
