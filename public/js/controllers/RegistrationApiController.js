/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */


angular.module('MetronicApp').controller('RegistrationApiController', function ($scope, registrationService, teamListService, eredivisiePlayersApi) {

  $scope.alerts = [];
  $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in. Daarna kan je op volgende klikken om de rest van je voorspellingen in te vullen';
  $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
  $scope.teamMsg = 'Kies je team';
  $scope.questionMsg = 'Met deze vragen kan je extra bonuspunten verdienen'

  $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
  $scope.playerPositions = [{ Id: 1, Position: "K" }, { Id: 2, Position: "V" }, { Id: 3, Position: "M" }, { Id: 4, Position: "A" }];
  $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }]

 eredivisiePlayersApi.async().then(function (data) {
        $scope.players = data[0].Player;
    });

  $scope.teams =  teamListService;

  $scope.setFormation = function (formation) {
    switch (formation) {
      case "433":
        $scope.data.Team[8].Position = "A";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      case "442":
        $scope.data.Team[8].Position = "M";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;
        break;
      default:

        $scope.data.Team[8].Position = "A";
        $scope.data.Team[8].PlayerId = "";
        $scope.data.Team[8].PlayerName = "";
        $scope.formationChosen = true;

    }
  };

  $scope.SelectedTeamId = $scope.teams[0].Team;

  $scope.updateTablePrediction = function (newId, position) {
    var oldId = $scope.data.Table[position - 1].SelectedTeamId

    if (newId === 'empty'){
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

  $scope.updateTeamPrediction = function (playerId, t) {

    //set prediction fields
    $scope.data.Team[t.Id - 1].PlayerId = playerId
    $scope.data.Team[t.Id - 1].PlayerName = $scope.players[(playerId - 1)].Name
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

  $scope.participantView = function () {
    $scope.showParticipant = true;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = false;
  };

  $scope.tableView = function () {
    $scope.showParticipant = false;
    $scope.showTable = true;
    $scope.showTeam = false;
    $scope.showQuestions = false;
  };

  $scope.teamView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = true;
    $scope.showQuestions = false;
  };

  $scope.questionsView = function () {
    $scope.showParticipant = false;
    $scope.showTable = false;
    $scope.showTeam = false;
    $scope.showQuestions = true;
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
        "TeamId": ""
      }, {
          "Id": 2,
          "Position": "V",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 3,
          "Position": "V",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 4,
          "Position": "V",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 5,
          "Position": "V",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 6,
          "Position": "M",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 7,
          "Position": "M",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 8,
          "Position": "M",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 9,
          "Position": "A",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 10,
          "Position": "A",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }, {
          "Id": 11,
          "Position": "A",
          "PlayerId": "",
          "PlayerName": "",
          "TeamId": ""
        }],
      "Questions": [{
        "Id": 1,
        "Question": "Wie wordt er kampioen in de premier league?",
        "Answer": ""
      }]
    }
});



