/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */


angular.module('MetronicApp').controller('RegistrationApiController', function ($scope, registrationService, teamListService, eredivisiePlayersApi) {

  $scope.alerts = [];
  $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in. Daarna kan je op volgende klikken om de rest van je voorspellingen in te vullen';
  $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
  $scope.teamMsg = 'Kies je team';
  $scope.questionMsg = 'Met deze vragen kan je extra bonuspunten verdienen'

  $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
  $scope.playerPositions = [{ Id: 1, Position: "K" }, { Id: 2, Position: "V" }, { Id: 3, Position: "M" }, { Id: 4, Position: "A" }];
  $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }, { Id: 3, Formation: "343" }]

  eredivisiePlayersApi.async().then(function (data) {
    $scope.players = data[0].Player;
  });

  $scope.teams = teamListService;

  $scope.setFormation = function (formation) {
    switch (formation) {
      case "433":
        $scope.data.Team[4].Position = "V";
        $scope.data.Team[4].PlayerId = "";
        $scope.data.Team[4].PlayerName = "";
        $scope.data.Team[8].Position = "A";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      case "442":
        $scope.data.Team[4].Position = "V";
        $scope.data.Team[4].PlayerId = "";
        $scope.data.Team[4].PlayerName = "";
        $scope.data.Team[8].Position = "M";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      case "343":
        $scope.data.Team[4].Position = "M";
        $scope.data.Team[4].PlayerId = "";
        $scope.data.Team[4].PlayerName = "";
        $scope.data.Team[8].Position = "A";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;

      default:
        $scope.data.Team[4].Position = "V";
        $scope.data.Team[4].PlayerId = "";
        $scope.data.Team[4].PlayerName = "";
        $scope.data.Team[8].Position = "A";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;

    }
  };

  $scope.SelectedTeamId = $scope.teams[0].Team;

  $scope.updateTablePrediction = function (newId, position) {
    var oldId = $scope.data.Table[position - 1].SelectedTeamId

    if (newId === 'empty') {
      if (oldId) {
        $scope.teams[(oldId - 1)].Selected = false;
      }
      return;
    }

    if (oldId) {
      $scope.teams[(oldId - 1)].Selected = false;
    }
    $scope.teams[(newId - 1)].Selected = true;
    $scope.data.Table[position - 1].SelectedTeamId = newId
    $scope.data.Table[position - 1].SelectedTeam = $scope.teams[(newId - 1)].Team;

  };

  $scope.unSelectPlayersOfThisTeam = function (playerIdInput, activePlayer) {

    SCOPE = $scope.$root.$new();

    for (var i = 0; i < $scope.data.Team.length; i += 1) {
      var playerId = $scope.data.Team[i].PlayerId
      var predictionId = $scope.data.Team[i].Id

      if (playerId == playerIdInput && predictionId == activePlayer.Id) {
        $scope.data.Team[i].Captain = false;
        var TeamId = $scope.players[(playerId - 1)].TeamId
        for (var i = 0; i < $scope.players.length; i += 1) {
          if ($scope.players[i].TeamId === TeamId) {
            $scope.players[i].PreSelected = false;
          }
        }
      }
    }
    SCOPE.$apply
  };

  $scope.selectPlayersOfThisTeam = function (playerIdInput, activePlayer) {

    SCOPE = $scope.$root.$new();

    for (var i = 0; i < $scope.data.Team.length; i += 1) {
      var playerId = $scope.data.Team[i].PlayerId
      var predictionId = $scope.data.Team[i].Id

      if (playerId == playerIdInput && predictionId == activePlayer.Id) {
        var TeamId = $scope.players[(playerId - 1)].TeamId
        for (var i = 0; i < $scope.players.length; i += 1) {
          if ($scope.players[i].TeamId === TeamId) {
            $scope.players[i].PreSelected = true;
          }
        }
      }
    }

    SCOPE.$apply
  };

  $scope.updateCaptain = function (captainId) {
    SCOPE = $scope.$root.$new();

    for (var i = 0; i < $scope.data.Team.length; i += 1){
          var playerId = $scope.data.Team[i].PlayerId
        var predictionId = $scope.data.Team[i].Id

        if (playerId == captainId){
          $scope.data.Team[i].Captain = true;
        }
        else{
          $scope.data.Team[i].Captain = false;
          
        }
    }
   SCOPE.$apply
  };

  $scope.updateTeamPrediction = function (playerId, t) {

    //set prediction fields
    $scope.data.Team[t.Id - 1].PlayerId = playerId
    $scope.data.Team[t.Id - 1].PlayerName = $scope.players[(playerId - 1)].Name
    $scope.data.Team[t.Id - 1].Team = $scope.players[(playerId - 1)].Team
		};

  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.save = function () {
    $scope.showConfirm = true;
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de voorspellingen van " + $scope.data.Participant.Name });

    var registration = registrationService.post($scope.data);

    registration.success(function () {
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt! Veel plezier met Super 11 ' + $scope.data.Participant.Name });
    });
    registration.error(function () {
      $scope.showConfirm = false;

      //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
      $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
    });
  };

  $scope.hide = false;
  $scope.orderByField = 'ts';
  $scope.reverseSort = true;

  $scope.formationChosen = false;

  $scope.showParticipant = true;
  $scope.showTable = false;
  $scope.showTeam = false;
  $scope.showQuestions = false;
  $scope.showMatches = false;


  $scope.participantView = function () {
    $scope.showParticipant = true;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = false;
    $scope.showMatches = false;

  };

  $scope.tableView = function () {
    $scope.showParticipant = false;
    $scope.showTable = true;
    $scope.showTeam = false;
    $scope.showQuestions = false;
    $scope.showMatches = false;

  };

  $scope.teamView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = true;
    $scope.showQuestions = false;
    $scope.showMatches = false;

  };

  $scope.questionsView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = true;
    $scope.showMatches = false;

  };

  $scope.matchesView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = false;
    $scope.showMatches = true;

  };

  $scope.data =
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
        "SelectedTeam": "",
        "SelectedTeamId": ""
      }, {
          "Position": 2,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 3,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 4,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 5,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 6,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 7,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 8,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 9,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 10,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 11,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 12,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 13,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 14,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 15,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 16,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 17,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }, {
          "Position": 18,
          "SelectedTeam": "",
          "SelectedTeamId": ""
        }],
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
          "PlayerId": "",
          "PlayerName": "",
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
          "Id": 1,
          "Match": "Manchester United - Manchester  City",
          "Home": "",
          "Away": ""
        },
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
          "Id": 30,
          "Match": "AS Monaco - PSG",
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
});



