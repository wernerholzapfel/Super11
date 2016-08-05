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
var RoundTeamScoreForms = require("./roundteamscoreformsModel");
var EredivisiePlayers = require("./eredivisiePlayersModel");
var teamStand = require("./teamStandModel");
var Headlines = require("./headlinesModel");
var QuestionsScoreForm = require("./questionsscoreformsModel");
var MatchesScoreForm = require("./matchesscoreformsModel");

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
var server = app.listen(process.env.PORT || 8200, function () {
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
      determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
    }
  });
});



app.get("/api/roundteamscoreforms", function (req, res, next) {
  RoundTeamScoreForms.find(function (err, playersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(playersList);
    }
  });
});

app.post("/api/roundteamscoreforms", function (req, res) {
  var roundteamscoreforms = new RoundTeamScoreForms(req.body);

  roundteamscoreforms.save(function (err, newroundteamscoreforms) {
    if (err) {
      handleError(res, err.message, "Failed to create new roundteamscoreforms.");
    } else {
      res.status(201).json(newPlayers);
      console.log("put for roundId " + req.body.RoundId)
      calculate.calculateTeamPredictionsPerRound(req.body.RoundId);
    }
  });
});

app.put("/api/roundteamscoreforms/:id", function (req, res) {

  RoundTeamScoreForms.findOneAndUpdate({ RoundId: req.params.id }, req.body, ({ upsert: true }), function (err, roundteamscoreforms) {
    if (err) return handleError(res, err.message, "Failed to Update Players");
    res.status(200).json(roundteamscoreforms);
    console.log("put for roundId " + req.params.id)

    calculate.calculateTeamPredictionsPerRound(req.params.id);
  });
});

app.get("/api/questionsScoreform/", function (req, res, next) {
  QuestionsScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get questions");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

app.put("/api/questionsScoreform/", function (req, res) {

  QuestionsScoreForm.findOneAndUpdate({},req.body, ({ upsert: true }), function (err, questionsScoreForm) {
    if (err) return handleError(res, err.message, "Failed to Update questions");
    res.status(200).json(questionsScoreForm);
    console.log("saved questions")

  });
});

app.get("/api/matchesScoreform/", function (req, res, next) {
  MatchesScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get matches");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

app.put("/api/matchesScoreform/", function (req, res) {
  MatchesScoreForm.findOneAndUpdate({},req.body, ({ upsert: true }), function (err, matchesScoreform) {
    if (err) return handleError(res, err.message, "Failed to Update questions");
    res.status(200).json(matchesScoreform);
    console.log("saved matches")

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
      handleError(res, err.message, "failed to get roundTable");
    }
    else {
      res.status(200).json(roundTable);
    }
  });
});

app.get("/api/totalTeamStand/", function (req, res, next) {
  teamStand.aggregate([
    { $unwind: "$TeamScores" },
    {
      $group: {
        _id: {
          email: "$Participant.Email",
          playerName: "$TeamScores.Name",

        },
        ParticipantName: { $first: "$Participant.Name" },
        playerName: { $first: "$TeamScores.Name" },
        Team: { $first: "$TeamScores.Team" },
        Position: { $first: "$TeamScores.Position" },
        Won: { $sum: "$TeamScores.Won" },
        Draw: { $sum: "$TeamScores.Draw" },
        Played: { $sum: "$TeamScores.Played" },
        RedCard: { $sum: "$TeamScores.RedCard" },
        YellowCard: { $sum: "$TeamScores.YellowCard" },
        Assist: { $sum: "$TeamScores.Assist" },
        Goals: { $sum: "$TeamScores.Goals" },
        CleanSheetScore: { $sum: "$TeamScores.CleanSheetScore" },
        TotalScore: { $sum: "$TeamScores.TotalScore" },
      }
    },
    {
      $group:
      {
        _id: { email: "$_id.email" },
        Name: { $first: "$ParticipantName" },
        TotalTeamScore: { $sum: "$TotalScore" },
        TeamScores: {
          $push: {
            Name: '$playerName',
            Position: "$Position",
            Team: "$Team",
            Won: "$Won",
            Draw: "$Draw",
            Played: "$Played",
            RedCard: "$RedCard",
            YellowCard: "$YellowCard",
            Assist: "$Assist",
            Goals: "$Goals",
            CleanSheetScore: "$CleanSheetScore",
            TotalScore: "$TotalScore"
          }
        }
      }
    },
    {
      $project:
      {
        _id: 0,
        Name: 1,
        TotalTeamScore: 1,
        TeamScores: 1
      }
    }
  ], function (err, roundTable) {
    if (err) {
      handleError(res, err.message, "failed to get roundTable");
    }
    else {
      res.status(200).json(roundTable);
    }
  });
});

app.get("/api/headlines/", function (req, res, next) {
  Headlines.find(function (err, headlines) {
    if (err) {
      handleError(res, err.message, "failed to get headlines");
    }
    else {
      res.status(200).json(headlines);
    }
  });
});

app.post("/api/headlines/", function (req, res) {
  var headlines = new Headlines(req.body);

  headlines.save(function (err, newheadlines) {
    if (err) {
      handleError(res, err.message, "Failed to create new headline.");
    } else {
      res.status(201).json(newheadlines);
    }
  });
});



app.get("/api/predictions/:Id", function (req, res, next) {
  Predictions.findById(req.params.Id, { 'Participant.Email': 0, createDate: 0 }, function (err, prediction) {
    if (err) {
      handleError(res, err.message, "Failed to get prediction.");
    } else {
      res.status(200).json(prediction);
    }
  });
});


app.get("/api/predictions", function (req, res, next) {
  Predictions.find({}, { 'Participant.Email': 0, "Team": 0, "Questions": 0, "Table": 0, createDate: 0 }, function (err, predictionsList) {
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
// calculate.calculateTeamPredictionsPerRound(5);
// determineifplayerisselected.setNumberOfTimesAplayerIsSelected();
// calculate.calculateTeamPredictionsPerRound(2);
