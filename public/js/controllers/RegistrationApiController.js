﻿/*global GetPouleIndex, GetTeamIndex,GetSecondRoundIndex */


angular.module('MetronicApp').controller('RegistrationApiController', function ($scope, getRegistrationForm, registrationService, teamListService, eredivisiePlayersApi) {

  $scope.selectedFormation = "433"

  getRegistrationForm.async().then(function (data) {
    $scope.data = data;
    if ($scope.data.Formation) {
      $scope.selectedFormation = $scope.data.Formation
      $scope.captainId = "53"
    }
  });


  $scope.alerts = [];
  $scope.participantMsg = 'Leuk dat je je wilt inschrijven. Vul alle velden in. Daarna kan je op volgende klikken om de rest van je voorspellingen in te vullen';
  $scope.tableMsg = 'Net zoals alle andere jaren voorspel je de eindstand van de eredivisie.';
  $scope.teamMsg = 'Kies je team';
  $scope.questionMsg = 'Met deze vragen kan je extra bonuspunten verdienen'

  $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
  $scope.playerPositions = [{ Id: 1, Position: "K", PositionUi: "Keeper" }, { Id: 2, Position: "V", PositionUi: "Verdediger" }, { Id: 3, Position: "M", PositionUi: "Middenvelder" }, { Id: 4, Position: "A", PositionUi: "Aanvaller" }];
  $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }, { Id: 3, Formation: "343" }]

  eredivisiePlayersApi.async().then(function (data) {
    $scope.players = data[0].Player;
  });

  $scope.teams = teamListService;

  $scope.setFormation = function (formation) {
    if ($scope.data.Formation != formation) {
      switch (formation) {
        case "433":
          $scope.data.Team[4].Position = "V";
          $scope.data.Team[4].PlayerId = "";
          $scope.data.Team[4].PlayerName = "";
          $scope.data.Team[8].Position = "A";
          $scope.data.Team[8].PlayerId = "";
          $scope.data.Team[8].PlayerName = "";
          $scope.data.Formation = formation
          $scope.formationChosen = true;
          break;
        case "442":
          $scope.data.Team[4].Position = "V";
          $scope.data.Team[4].PlayerId = "";
          $scope.data.Team[4].PlayerName = "";
          $scope.data.Team[8].Position = "M";
          $scope.data.Team[8].PlayerId = "";
          $scope.data.Team[8].PlayerName = "";
          $scope.data.Formation = formation
          $scope.formationChosen = true;
          break;
        case "343":
          $scope.data.Team[4].Position = "M";
          $scope.data.Team[4].PlayerId = "";
          $scope.data.Team[4].PlayerName = "";
          $scope.data.Team[8].Position = "A";
          $scope.data.Team[8].PlayerId = "";
          $scope.data.Team[8].PlayerName = "";
          $scope.data.Formation = formation
          $scope.formationChosen = true;
          break;

        default:
          $scope.data.Team[4].Position = "V";
          $scope.data.Team[4].PlayerId = "";
          $scope.data.Team[4].PlayerName = "";
          $scope.data.Team[8].Position = "A";
          $scope.data.Team[8].PlayerId = "";
          $scope.data.Team[8].PlayerName = "";
          $scope.data.Formation = formation
          $scope.formationChosen = true;

      }
    }
    $scope.formationChosen = true;
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

  $scope.addPlayerToSelection = function (player) {
    SCOPE = $scope.$root.$new();
    for (var i = 0; i < $scope.data.Team.length; i += 1) {
      if (player.Position == $scope.data.Team[i].Position && $scope.data.Team[i].PlayerName == '') {
        $scope.data.Team[i].PlayerName = player.Name;
        $scope.data.Team[i].TeamId = player.TeamId;
        $scope.data.Team[i].PlayerId = player.Id;
        $scope.data.Team[i].Team = player.Team;
        $scope.selectPlayersOfThisTeam(player);
        return;
      }
    }
    SCOPE.$apply
  };

  $scope.removeplayerfromteam = function (player) {
    SCOPE = $scope.$root.$new();
    for (var i = 0; i < $scope.data.Team.length; i += 1) {
      if (player.Id == $scope.data.Team[i].Id) {
        $scope.removePlayersOfThisTeam(player);
        $scope.data.Team[i].PlayerName = "";
        $scope.data.Team[i].TeamId = "";
        $scope.data.Team[i].PlayerId = "";
        $scope.data.Team[i].Team = "";
        return;
      }
    }
    SCOPE.$apply
  };

  $scope.removePlayersOfThisTeam = function (player) {

    SCOPE = $scope.$root.$new();
    for (var i = 0; i < $scope.players.length; i += 1) {
      if ($scope.players[i].TeamId === player.TeamId) {
        $scope.players[i].PreSelected = false;
      }
    }
    SCOPE.$apply
  };

  $scope.selectPlayersOfThisTeam = function (player) {

    SCOPE = $scope.$root.$new();

    for (var i = 0; i < $scope.players.length; i += 1) {
      if ($scope.players[i].TeamId === player.TeamId) {
        $scope.players[i].PreSelected = true;
      }
    }
    SCOPE.$apply
  };

  $scope.updateCaptain = function (captainId) {
    SCOPE = $scope.$root.$new();

    for (var i = 0; i < $scope.data.Team.length; i += 1) {
      var playerId = $scope.data.Team[i].PlayerId
      var predictionId = $scope.data.Team[i].Id

      if (playerId == captainId) {
        $scope.data.Team[i].Captain = true;
        $scope.data.CaptainId = captainId;
      }
      else {
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

    SCOPE = $scope.$root.$new();

    //loop door stand om positie te bepalen
    for (var i = 0; i < $scope.data.Table.length; i += 1) {
      $scope.data.Table[i].Position = i + 1
    }
    SCOPE.$apply


    var registration = registrationService.post($scope.data);

    registration.success(function () {
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt! Veel plezier met Super 11 ' + $scope.data.Participant.Name });
      $scope.showMatches = false;
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

  $scope.showParticipant = false;
  $scope.showTable = false;
  $scope.showTeam = true;
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
});



