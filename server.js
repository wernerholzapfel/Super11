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
var calculate = require("./calculate.js");
var determineifplayerisselected = require("./determineifplayerisselected");
var Predictions = require("./predictionModel");
var RoundTeamScoreForms = require("./roundteamscoreformsModel");
var EredivisiePlayers = require("./eredivisiePlayersModel");
var teamStand = require("./teamStandModel");
var Headlines = require("./headlinesModel");
var User = require("./models/user")

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//log to consolea
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());


// Initialize the app.
var server = app.listen(process.env.PORT || 8200, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// CONTACTS API ROUTES BELOW

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

apiRoutes.post('/signup', function (req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({ success: false, msg: 'Please pass name and password.' });
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Username already exists.' });
      }
      res.json({ success: true, msg: 'Successful created new user.' });
    });
  }
});

// route to authenticate a user
apiRoutes.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token });
        } else {
          res.send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      } else {
        res.json({ success: true, msg: 'Welcome in the member area ' + user.name + '!' });
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'No token provided.' });
  }
});

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

apiRoutes.post("/predictions", function (req, res) {
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

apiRoutes.get("/roundteamscoreforms", function (req, res, next) {
  RoundTeamScoreForms.find(function (err, playersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(playersList);
    }
  });
});

apiRoutes.post("/roundteamscoreforms", function (req, res) {
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

apiRoutes.put("/roundteamscoreforms/:id", function (req, res) {

  var updateScoreForm = {};
  updateScoreForm = Object.assign(updateScoreForm, req.body);
  delete updateScoreForm._id;


  RoundTeamScoreForms.findOneAndUpdate({ RoundId: req.params.id }, updateScoreForm, ({ upsert: true }), function (err, roundteamscoreforms) {
    if (err) return handleError(res, err.message, "Failed to Update Players");
    res.status(200).json(roundteamscoreforms);
    console.log("put for roundId " + req.params.id)

    calculate.calculateTeamPredictionsPerRound(req.params.id);
  });
});

apiRoutes.get("/questionsScoreform/", function (req, res, next) {
  QuestionsScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get questions");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

apiRoutes.put("/questionsScoreform/", function (req, res) {

  QuestionsScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, questionsScoreForm) {
    if (err) return handleError(res, err.message, "Failed to Update questions");
    res.status(200).json(questionsScoreForm);
    console.log("saved questions")

  });
});

apiRoutes.get("/matchesScoreform/", function (req, res, next) {
  MatchesScoreForm.findOne(function (err, questions) {
    if (err) {
      handleError(res, error.message, "failed tot get matches");
    }
    else {
      res.status(200).json(questions);
    }
  });
});

apiRoutes.put("/matchesScoreform/", function (req, res) {
  MatchesScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, matchesScoreform) {
    if (err) return handleError(res, err.message, "Failed to Update questions");
    res.status(200).json(matchesScoreform);
    console.log("saved matches")

  });
});



apiRoutes.get("/teamStand/:roundId", function (req, res, next) {
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

apiRoutes.get("/teamStand/", function (req, res, next) {
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

apiRoutes.get("/totalTeamStand/", function (req, res, next) {
  teamStand.aggregate([
    { $unwind: "$TeamScores" }
    // , { $unwind: "$MatchesScore" }
    // , { $unwind: "$QuestionsScore" }
    ,
    {
      $group: {
        _id: {
          email: "$Participant.Email",
          playerName: "$TeamScores.Name",

        },
        Id: { $first: "$TeamScores.Id" },
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
        OwnGoals: { $sum: "$TeamScores.OwnGoals" },
        CleanSheetScore: { $sum: "$TeamScores.CleanSheetScore" },
        TotalPlayerScore: { $sum: "$TeamScores.TotalScore" },
        QuestionsScore: { $last: "$QuestionsScore" },
        MatchesScore: { $last: "$MatchesScore" },
        TotalQuestionsScore: { $last: "$TotalQuestionsScore" },
        TotalMatchesScore: { $last: "$TotalMatchesScore" }
        // ,
        // TotalOverallScore: { $sum: "$TotalScore" }
      }
    }
    ,
    {
      $group:
      {
        _id: { email: "$_id.email" },
        Name: { $first: "$ParticipantName" },
        TotalTeamScore: { $sum: "$TotalPlayerScore" },
        TeamScores: {
          $push: {
            Id: '$Id',
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
            OwnGoals: "$OwnGoals",
            CleanSheetScore: "$CleanSheetScore",
            TotalScore: "$TotalPlayerScore",
          }
        },
        QuestionsScore: { $first: "$QuestionsScore" },
        MatchesScore: { $first: "$MatchesScore" },
        TotalQuestionsScore: { $first: "$TotalQuestionsScore" },
        TotalMatchesScore: { $first: "$TotalMatchesScore" }
      }
    },
    {
      $project:
      {
        _id: 0,
        Name: 1,
        TotalTeamScore: 1,
        TeamScores: 1,
        TotalMatchesScore: 1,
        TotalQuestionsScore: 1,
        QuestionsScore: 1,
        MatchesScore: 1,
        TotalScore: { $add: ["$TotalMatchesScore", "$TotalQuestionsScore", "$TotalTeamScore"] }
        // TotalScore: 1
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

apiRoutes.get("/headlines/", function (req, res, next) {
  Headlines.find(function (err, headlines) {
    if (err) {
      handleError(res, err.message, "failed to get headlines");
    }
    else {
      res.status(200).json(headlines);
    }
  });
});

apiRoutes.post("/headlines/", function (req, res) {
  var headlines = new Headlines(req.body);

  headlines.save(function (err, newheadlines) {
    if (err) {
      handleError(res, err.message, "Failed to create new headline.");
    } else {
      res.status(201).json(newheadlines);
    }
  });
});


apiRoutes.get("/predictions/:Id", function (req, res, next) {
  Predictions.findById(req.params.Id, { 'Participant.Email': 0, createDate: 0 }, function (err, prediction) {
    if (err) {
      handleError(res, err.message, "Failed to get prediction.");
    } else {
      res.status(200).json(prediction);
    }
  });
});


apiRoutes.get("/predictions", function (req, res, next) {
  Predictions.find({}, { 'Participant.Email': 0, "Team": 0, "Questions": 0, "Table": 0, createDate: 0 }, function (err, predictionsList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(predictionsList);
    }
  });
});

apiRoutes.get("/eredivisieplayers", function (req, res, next) {
  EredivisiePlayers.find(function (err, eredivisieplayersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(eredivisieplayersList);
    }
  });
});

app.use('/api', apiRoutes);
//todo remove this
// calculate.calculateTeamPredictionsPerRound(5);
// determineifplayerisselected.setNumberOfTimesAplayerIsSelected();
// calculate.calculateTeamPredictionsPerRound(1);
// calculate.calculateTeamPredictionsPerRound(2);
// calculate.calculateTeamPredictionsPerRound(3);
