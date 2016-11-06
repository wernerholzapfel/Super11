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

//berekeningen
var calculateteam = require("./calculateteam.js");
var calculatevragen = require("./calculatevragen.js");
var calculatewedstrijden = require("./calculatewedstrijden.js");
var calculatetotaalstand = require("./calculatetotaalstand.js");
var calculateeindstand = require("./calculateeindstand.js");
var determineifplayerisselected = require("./determineifplayerisselected");
//models
var Predictions = require("./models/predictionModel");
var RoundTeamScoreForms = require("./models/roundteamscoreformsModel");
var EredivisiePlayers = require("./models/eredivisiePlayersModel");
var teamStand = require("./models/teamStandModel");
var vragenStand = require("./models/vragenStandModel");
var wedstrijdenStand = require("./models/wedstrijdenStandModel");
var newteamStand = require("./models/newTeamStandModel");
var totaalStand = require("./models/totaalStandModel");
var eindstandStand = require("./models/eindstandStandModel");

var Headlines = require("./models/headlinesModel");
var Comments = require("./models/commentsModel");
var User = require("./models/user");
var MatchesScoreForm = require("./models/wedstrijdenScoreformsModel.js");
var QuestionsScoreForm = require("./models/vragenScoreformsModel.js");
var Eindstandscoreform = require("./models/eindstandScoreformsModel.js");

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

// CONTACTS API ROUTES BELOW

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();

//apiRoutes.post('/signup', function (req, res) {
//  if (!req.body.name || !req.body.password) {
//    res.json({ success: false, msg: 'Please pass name and password.' });
//  } else {
//    var newUser = new User({
//      name: req.body.name.toLowerCase(),
//      password: req.body.password
//    });
//    // save the user
//    newUser.save(function (err) {
//      if (err) {
//        return res.json({ success: false, msg: 'Username already exists.' });
//      }
//      var token = jwt.encode(newUser, config.secret);
//      res.json({ success: true, msg: 'Successful created new user.', token: 'JWT ' + token });
//    });
//  }
//});

// route to authenticate a user
apiRoutes.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name.toLowerCase()
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

apiRoutes.get('/predictionform', passport.authenticate('jwt', { session: false }), function (req, res) {
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
        console.log(user);
        Predictions.findOne({ 'Participant.Email': user.name }, { 'Participant.Email': 0, createDate: 0 }, function (err, prediction) {
          if (err) {
            handleError(res, err.message, "Failed to get prediction.");
          }
          if (!prediction) {
            res.status(200).json(leegFormulier)
          }
          else {
            res.status(200).json(prediction);
          }
        });
      }
    });
  }
  else {
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

// inschrijven uitgezet.
// apiRoutes.post("/predictions", passport.authenticate('jwt', { session: false }), function (req, res) {
//   var token = getToken(req.headers);
//   if (token) {
//     var decoded = jwt.decode(token, config.secret);
//     User.findOne({
//       name: decoded.name
//     }, function (err, user) {
//       if (err) throw err;
//       if (!user) {
//         return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
//       }
//       else {
//         var predictions = new Predictions(req.body);
//         predictions.Participant.Email = user.name;
//         Predictions.findOneAndUpdate({ 'Participant.Email': user.name }, predictions, ({ upsert: true }), function (err, newPrediction) {
//           if (err) {
//             handleError(res, err.message, "Failed to create new prediction.");
//           } else {
//             res.status(201).json(predictions);
//             determineifplayerisselected.setNumberOfTimesAplayerIsSelected()
//           }
//         });
//       }
//     })
//   }
// });

apiRoutes.get("/roundteamscoreforms/:roundId", function (req, res, next) {
  RoundTeamScoreForms.findOne({ RoundId: + req.params.roundId }, function (err, playersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(playersList);
    }
  });
});

// apiRoutes.post("/roundteamscoreforms", function (req, res) {
//   var roundteamscoreforms = new RoundTeamScoreForms(req.body);

//   roundteamscoreforms.save(function (err, newroundteamscoreforms) {
//     if (err) {
//       handleError(res, err.message, "Failed to create new roundteamscoreforms.");
//     } else {
//       res.status(201).json(newPlayers);
//       console.log("put for roundId " + req.body.RoundId)
//       calculateteam.calculateTeamPredictionsPerRound(req.body.RoundId);
//     }
//   });
// });

apiRoutes.put("/roundteamscoreforms/:id", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        var updateScoreForm = {};
        updateScoreForm = Object.assign(updateScoreForm, req.body);
        delete updateScoreForm._id;

        RoundTeamScoreForms.findOneAndUpdate({ RoundId: req.params.id }, updateScoreForm, ({ upsert: true }), function (err, roundteamscoreforms) {
          if (err) return handleError(res, err.message, "Failed to Update Players");
          res.status(200).json(roundteamscoreforms);
          console.log("put for roundId " + req.params.id)

          calculateteam.calculateTeamPredictionsPerRound(req.params.id);
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
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

apiRoutes.put("/questionsScoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        QuestionsScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, questionsScoreForm) {
          if (err) return handleError(res, err.message, "Failed to Update questions");
          res.status(200).json(questionsScoreForm);
          console.log("saved questions")
          calculatevragen.calculateQuestions();
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
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

apiRoutes.put("/matchesScoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        MatchesScoreForm.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, matchesScoreform) {
          if (err) return handleError(res, err.message, "Failed to Update questions");
          res.status(200).json(matchesScoreform);
          console.log("saved matches")
          calculatewedstrijden.calculateWedstrijdScore();
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

apiRoutes.get("/eindstandscoreform", function (req,res,next) {
    Eindstandscoreform.findOne(function (err, eindstand) {
    if (err) {
      handleError(res, error.message, "failed tot get eindstandscoreform");
    }
    else {
      res.status(200).json(eindstand);
    }
  });
});

apiRoutes.put("/eindstandscoreform/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        Eindstandscoreform.findOneAndUpdate({}, req.body, ({ upsert: true }), function (err, eindstandscoreform) {
          if (err) return handleError(res, err.message, "Failed to Update eindstand");
          res.status(200).json(eindstandscoreform);
          console.log("saved eindstand")
          //todo calculate eindstand
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});



apiRoutes.get("/newteamStand/:roundId", function (req, res, next) {
  console.log("log api call roundTable/" + req.params.roundId);
  newteamStand.find({ RoundId: req.params.roundId }, {}, { sort: { TotalTeamScore: -1 } }, function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get roundTable");
    }
    else {
      res.status(200).json(roundTable);
    }
  });
});


//twee keer stand ophalen om nieuwe punten te berekenen.
apiRoutes.get("/totaalstand/", function (req, res, next) {
  console.log("log api call roundTable/");

  async.waterfall([
  function(callback) {
    RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 },{sort : { RoundId : -1}}, function (err, rounds) {
      if (err) {
        handleError(res, err.message, "failed to get rounds");
      }
      else {
      var maxRoundId = rounds[0].RoundId;
      callback(null,maxRoundId)
      }

    });
  },
    function (maxRoundId,callback) {
      //hier worden de scores opgehaald die de voetballers hebben gehaald in 1 ronde
      totaalStand.find({ RoundId: maxRoundId }, {}, { sort: { TotalScore: -1 } }).lean().exec(function (err, roundTable) {
        if (err) return console.error(err);
        callback(null, roundTable,maxRoundId);
      })
    },
    function (roundTable,maxRoundId, callback) {
      totaalStand.find({ RoundId: (maxRoundId - 1) }, {}, { sort: { TotalScore: -1 } }).lean().exec(function (err, previousRoundTable) {
        if (err) return console.error(err);
        callback(null, roundTable, previousRoundTable)

      })
    },
    function (roundTable, previousRoundTable, callback) {
      var totstand = {}
      totstand.updatedAt = roundTable[0].updatedAt;      
      totstand.deelnemers = []
      async.each(roundTable, function (regel, callback) { 
        var stand = new totaalStand;
        stand = regel;
        if (previousRoundTable.length > 0) {
          var previous = _.find(previousRoundTable, function (o) { return o.Name === regel.Name });
          stand.previousPositie = previous.Positie;
          stand.deltaPositie = previous.Positie - stand.Positie ;
          stand.deltaTotalQuestionsScore = stand.TotalQuestionsScore - previous.TotalQuestionsScore;
          stand.deltaTotalMatchesScore = stand.TotalMatchesScore - previous.TotalMatchesScore;
          stand.deltaTotalTeamScore = stand.TotalTeamScore - previous.TotalTeamScore;
          stand.deltaTotalscore = stand.TotalScore - previous.TotalScore;
        }
        totstand.deelnemers.push(stand);
      }, function (err) {
        return console.error("error: " + err);
      });
      res.status(200).json(totstand);
    }
  ]);
});


apiRoutes.get("/wedstrijdenstand/", function (req, res, next) {
  console.log("log api call roundTable/" + req.params.roundId);
  wedstrijdenStand.find({}, {}, { sort: { TotalMatchesScore: -1 } }, function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get wedstrijdenstand");
    }
    else {
      //todo positie toevoegen?
      res.status(200).json(roundTable);
    }
  });
});

apiRoutes.get("/vragenstand/", function (req, res, next) {
  console.log("log api call roundTable/" + req.params.roundId);
  vragenStand.find({}, {}, { sort: { TotalQuestionsScore: -1 } }, function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get vragenstand");
    }
    else {
      //todo positie toevoegen?
      res.status(200).json(roundTable);
    }
  });
});

apiRoutes.get("/eindstandstand/", function (req, res, next) {
  console.log("log api call roundTable/");
  eindstandStand.find({}, {}, { sort: { TotalEindstandScore: -1 } }, function (err, roundTable) {
    if (err) {
      handleError(res, error.message, "failed tot get eindstand stand");
    }
    else {
      //todo positie toevoegen?
      res.status(200).json(roundTable);
    }
  });
});

apiRoutes.get("/teamstatistieken/", function (req, res, next) {
  Predictions.aggregate([

    { $unwind: "$Team" },
    {
      $group: {
        _id: {
          playerId: "$Team.PlayerId"
        },
        Count: { $sum: 1 },
        Team: { $first: "$Team.Team" },
        Position: { $first: "$Team.Position" },
        PlayerName: { $first: "$Team.PlayerName" },
        PlayerId: { $first: "Team.PlayerId" },
      }
    }
    , {
      $project:
      {
        _id: 0,
        Count: 1,
        Team: 1,
        Position: 1,
        PlayerName: 1,
        PlayerId: 1
      }
    },
     { $sort: { Count: -1 } }
  ], function (err, teamstatistieken) {
    if (err) {
      handleError(res, err.message, "failed to get teamstatistieke ")
    }
    else {
      res.status(200).json(teamstatistieken);
    }
  }
  )
});

apiRoutes.get("/rounds", function (req, res, next) {
  RoundTeamScoreForms.find({}, { RoundId: 1, _id: 0 }, function (err, rounds) {
    if (err) {
      handleError(res, err.message, "failed to get rounds");
    }
    else {
      res.status(200).json(rounds);
    }

  })
});

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

apiRoutes.post("/headlines/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        var headlines = new Headlines(req.body);
        headlines.createdAt = new Date().toUTCString()

        headlines.save(function (err, newheadlines) {
          if (err) {
            handleError(res, err.message, "Failed to create new headline.");
          } else {
            console.log(newheadlines);
            res.status(200).json(newheadlines);
          }
        });
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
  }
});

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

apiRoutes.post("/comments/", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      else {
        Predictions.findOne({ 'Participant.Email': decoded.name }, { 'Participant.Name': 1 }, function (err, name) {
          if (name) {
            var comments = new Comments(req.body);
            comments.createdAt = new Date().toUTCString()
            comments.name = name.Participant.Name;
            comments.save(function (err, newComment) {
              if (err) {
                handleError(res, err.message, "Failed to create new newComment.");
              } else {
                console.log(newComment);
                res.status(200).json(newComment);
              }
            });
          }
        });
      }
    });
  }
});

apiRoutes.delete("/headlines/:id", passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    console.log("delete is aangeroepen door: " + decoded.name);
    User.findOne({ name: decoded.name }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
      }
      if (user.name === "werner.holzapfel@gmail.com" || user.name === 'rverberkt') {
        Headlines.find({ _id: req.params.id }).remove(function (err, item) {
          if (err) return handleError(res, err.message, "Failed to delete Item");
          res.status(200).json(item);
        })
      }
      else {
        return res.status(403).send({ success: false, msg: 'Niet geautoriseerd om wijziging om headline toe te voegen' })
      }
    })
    res.status(200);
  }
});

//disabled during entry
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


apiRoutes.get("/gekozeneredivisieplayers", function (req, res, next) {
  EredivisiePlayers.find({}, { Player: 1 }, function (err, eredivisieplayersList) {
    if (err) {
      handleError(res, err.message, "Failed to get predictions.");
    } else {
      res.status(200).json(eredivisieplayersList);
    }
  });
});

apiRoutes.get("/nummereentotaalstand", function (req,res,next)
{
  
})

app.use('/api', apiRoutes);

// calculateeindstand.calculateEindstand();
// calculatetotaalstand.calculatetotaalstand();
// calculatewedstrijden.calculateWedstrijdScore();
// calculatevragen.calculateQuestions();
// calculateteam.calculateTeamPredictionsPerRound(1);
// determineifplayerisselected.setNumberOfTimesAplayerIsSelected();
var leegFormulier =
  {
    "Participant": {
      "Id": 0,
      "Name": "",
      "Email": "",
      "Location": "",
      "Gender": "",
      "PhoneNumber": ""
    },
    "Table": [{
      "Position": 1,
      "SelectedTeam": "Ado Den Haag",
      "SelectedTeamId": ""
    }, {
        "Position": 2,
        "SelectedTeam": "Ajax",
        "SelectedTeamId": ""
      }, {
        "Position": 3,
        "SelectedTeam": "AZ",
        "SelectedTeamId": ""
      }
      , {
        "Position": 4,
        "SelectedTeam": "Excelsior",
        "SelectedTeamId": ""
      }, {
        "Position": 5,
        "SelectedTeam": "Feyenoord",
        "SelectedTeamId": ""
      }, {
        "Position": 6,
        "SelectedTeam": "Go Ahead Eagles",
        "SelectedTeamId": ""
      }, {
        "Position": 7,
        "SelectedTeam": "FC Groningen",
        "SelectedTeamId": ""
      }, {
        "Position": 8,
        "SelectedTeam": "SC Heerenveen",
        "SelectedTeamId": ""
      }, {
        "Position": 9,
        "SelectedTeam": "Heracles Almelo",
        "SelectedTeamId": ""
      }, {
        "Position": 10,
        "SelectedTeam": "N.E.C.",
        "SelectedTeamId": ""
      }, {
        "Position": 11,
        "SelectedTeam": "PEC Zwolle",
        "SelectedTeamId": ""
      }, {
        "Position": 12,
        "SelectedTeam": "PSV",
        "SelectedTeamId": ""
      }, {
        "Position": 13,
        "SelectedTeam": "Roda JC",
        "SelectedTeamId": ""
      }, {
        "Position": 14,
        "SelectedTeam": "Sparta",
        "SelectedTeamId": ""
      }, {
        "Position": 15,
        "SelectedTeam": "FC Twente",
        "SelectedTeamId": ""
      }, {
        "Position": 16,
        "SelectedTeam": "FC Utrecht",
        "SelectedTeamId": ""
      }, {
        "Position": 17,
        "SelectedTeam": "Vitesse",
        "SelectedTeamId": ""
      }, {
        "Position": 18,
        "SelectedTeam": "Willem II",
        "SelectedTeamId": ""
      }
    ],
    "Team": [{
      "Id": 1,
      "Position": "K",
      "PlayerId": "",
      "PlayerName": "",
      "TeamId": "",
      "Team": "",
      "Captain": false
    }, {
        "Id": 2,
        "Position": "V",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 3,
        "Position": "V",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 4,
        "Position": "V",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 5,
        "Position": "V",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 6,
        "Position": "M",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 7,
        "Position": "M",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 8,
        "Position": "M",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 9,
        "Position": "A",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 10,
        "Position": "A",
        "PlayerId": "",
        "PlayerName": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }, {
        "Id": 11,
        "Position": "A",
        "PlayerName": "",
        "Name": "",
        "TeamId": "",
        "Team": "",
        "Captain": false
      }],
    "Questions": [
      {
        "Id": 1,
        "Question": "Wie wordt er topscorer in de Eredivisie?",
        "Answer": ""
      },
      {
        "Id": 2,
        "Question": "Hoeveel doelpunten maakt de topscorer?",
        "Answer": ""
      },
      {
        "Id": 3,
        "Question": "Welke scheidsrechter geeft dit seizoen de meeste  directe rode kaarten in de Eredivisie?",
        "Answer": ""
      },
      {
        "Id": 4,
        "Question": "Welke Eredivisieclub krijgt de meeste tegendoelpunten",
        "Answer": ""
      },
      {
        "Id": 5,
        "Question": "Welke ploeg in de Eredivisie maakte de meeste uitdoelpunten dit seizoen?",
        "Answer": ""
      },
      {
        "Id": 6,
        "Question": "Welke club wordt er kampioen in de Jupiler League?",
        "Answer": ""
      },
      {
        "Id": 7,
        "Question": "Welke club wordt er laatste in de Jupiler League?",
        "Answer": ""
      },
      {
        "Id": 8,
        "Question": "Welke club wordt er kampioen in de Tweede Divisie?",
        "Answer": ""
      },
      {
        "Id": 9,
        "Question": "Bij welke club voetbalt de topscorer van de Jupiler Leaugue?",
        "Answer": ""
      },
      {
        "Id": 10,
        "Question": "Welke Jupiler League cluB komt het verst in de KNVB beker?",
        "Answer": ""
      },
      {
        "Id": 11,
        "Question": "Welke twee clubs spelen de KNVB bekerfinale?",
        "Answer": ""
      },
      {
        "Id": 12,
        "Question": "Welke club wint de KNVB Bekerfinale?",
        "Answer": ""
      },
      {
        "Id": 13,
        "Question": "Welke 2 clubs spelen de Champions League finale? ",
        "Answer": ""
      },
      {
        "Id": 14,
        "Question": "Wie wint de Champions League?",
        "Answer": ""
      },
      {
        "Id": 15,
        "Question": "Welke twee clubs spelen de Europa League finale?",
        "Answer": ""
      },
      {
        "Id": 16,
        "Question": "Wie wint de Europa League?",
        "Answer": ""
      },
      {
        "Id": 17,
        "Question": "Wie wordt er 2e in Italië",
        "Answer": ""
      },
      {
        "Id": 18,
        "Question": "Wie wordt er 4e in Spanje",
        "Answer": ""
      },
      {
        "Id": 19,
        "Question": "Wie wordt er Kampioen van België",
        "Answer": ""
      },
      {
        "Id": 20,
        "Question": "Wie wordt er Kampioen van Engeland",
        "Answer": ""
      },
      {
        "Id": 21,
        "Question": "Wie wordt er 3e in Duitsland",
        "Answer": ""
      },
      {
        "Id": 22,
        "Question": "Wie wordt er 3e in Frankrijk",
        "Answer": ""
      },
      {
        "Id": 23,
        "Question": "Wie wordt er Kampioen van Turkije",
        "Answer": ""
      },
      {
        "Id": 24,
        "Question": "Wie wordt er 2e in Rusland",
        "Answer": ""
      },
      {
        "Id": 25,
        "Question": "Wie wordt er Kampioen van Portugal",
        "Answer": ""
      }
    ],
    "Matches": [
      {
        "Id": 2,
        "Match": "Manchester City - Manchester United",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 3,
        "Match": "FC Barcelona - Real Madrid",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 4,
        "Match": "Real Madrid - FC Barcelona",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 5,
        "Match": "AC Milan - Internazionale",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 6,
        "Match": "Internazionale - AC Milan",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 7,
        "Match": "Bayern Munchen - Bor. Dortmund",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 8,
        "Match": "Bor. Dortmund - Bayern Munchen",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 9,
        "Match": "Ajax - Feyenoord",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 10,
        "Match": "Feyenoord - Ajax",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 11,
        "Match": "PSV - Feyenoord ",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 12,
        "Match": "Feyenoord - PSV",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 13,
        "Match": "PSV - Ajax",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 14,
        "Match": "Ajax - PSV",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 15,
        "Match": "Fenerbahce - Galatasaray",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 16,
        "Match": "Galatasaray - Fenerbahce",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 17,
        "Match": "Vitesse - NEC",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 18,
        "Match": "NEC - Vitesse",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 19,
        "Match": "Sparta Rotterdam - Excelsior",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 20,
        "Match": "Excelsior - Sparta Rotterdam",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 21,
        "Match": "AS Roma - Lazio Roma",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 22,
        "Match": "Lazio Roma - AS Roma",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 23,
        "Match": "Atletico Madrid - Real Madrid",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 24,
        "Match": "Real Madrid - Atletico Madrid",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 25,
        "Match": "Tottenham Hotspur - Arsenal",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 26,
        "Match": "Arsenal - Tottenham Hotspur",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 27,
        "Match": "Liverpool - Everton",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 28,
        "Match": "Everton - Liverpool",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 29,
        "Match": "PSG - AS Monaco",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 31,
        "Match": "Benfica - Porto",
        "Home": "",
        "Away": ""
      },
      {
        "Id": 32,
        "Match": "Porto - Benfica",
        "Home": "",
        "Away": ""
      }
    ]
  }