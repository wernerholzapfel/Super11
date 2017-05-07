var express = require("express");
var apiRoutes = express.Router();
var mongoose = require('mongoose');
var async = require("async");

var jwtDecode = require('jwt-decode');
var config = require('../config/database');

var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
    //get users token read
    token: process.env.token || config.token,
    domain: process.env.domain || config.domain
});
var secret = process.env.secret || config.secret;

var User = require('../models/user');
var Predictions = require("../models/predictionModel");

apiRoutes.get('/predictionform', function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        async.waterfall([
            function (callback) {
                var decoded = jwtDecode(token, secret);
                management.getUser({id: decoded.sub}, function (err, user) {
                    callback(null, user);
                });
            },
            function (user, callback) {
                if (user.email_verified) {
                    Predictions.findOne({'Participant.Email': user.email}, {'Participant.Name': 1}, function (err, name) {
                        callback(null, user);
                    });
                }
                else {
                    res.status(200).json("Om wijzigingen door te kunnen voeren moet je eerst je mail verifieren. Kijk in je mailbox voor meer informatie.")
                }
            },
            function (user, callback) {
                Predictions.findOne({'Participant.Email': user.email}, {
                    'Participant.Email': 0,
                    createDate: 0
                }, function (err, prediction) {
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
        ])
    }
});

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
    };

module.exports = apiRoutes;
