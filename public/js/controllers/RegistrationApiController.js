
angular.module('MetronicApp').controller('RegistrationApiController',
    ['$anchorScroll', '$location', '$scope', "getRegistrationForm", "registrationService", "teamListService", "eredivisiePlayersApi", "savetransfersservice",
        function ($anchorScroll, $location, $scope, getRegistrationForm, registrationService, teamListService, eredivisiePlayersApi, savetransfersservice) {

            $scope.selectedFormation = "433";

      getRegistrationForm.async().then(function (data) {
        $scope.data = data;
        if ($scope.data.Formation) {
            $scope.selectedFormation = $scope.data.Formation;
          $scope.captainId = $scope.data.CaptainId
        }
        eredivisiePlayersApi.async().then(function (data) {
          $scope.players = data[0].Player;
          for (var i = 0; i < $scope.data.Team.length; i += 1) {
            $scope.selectPlayersOfThisTeam($scope.data.Team[i]);
          }
            for (var i = 0; 1 < $scope.players.length; i += 1) {
                switch ($scope.players[i].Position) {
                    case "K":
                        $scope.players[i].PositionSort = 1;
                        break;
                    case "V":
                        $scope.players[i].PositionSort = 2;
                        break;
                    case "M":
                        $scope.players[i].PositionSort = 3;
                        break;
                    case "A":
                        $scope.players[i].PositionSort = 4;
                        break;
                    default:
                        $scope.players[i].PositionSort = 5;
                }
            }
        });
      });

      $scope.alerts = [];

      $scope.predictionTypes = [{ Id: 4, Title: "Halve Finale" }, { Id: 5, Title: "Finale" }];
      $scope.playerPositions = [{ Id: 1, Position: "K", PositionUi: "Keeper" }, { Id: 2, Position: "V", PositionUi: "Verdediger" }, { Id: 3, Position: "M", PositionUi: "Middenvelder" }, { Id: 4, Position: "A", PositionUi: "Aanvaller" }];
      $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }, { Id: 3, Formation: "343" }]



      $scope.teams = teamListService;

      $scope.setFormation = function (formation) {
        if ($scope.data.Formation != formation) {
          switch (formation) {
            case "433":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[8].Position = "A";
              $scope.data.Formation = formation
              $scope.formationChosen = true;
              break;
            case "442":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "M";
              $scope.data.Formation = formation
              $scope.formationChosen = true;
              break;
            case "343":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "M";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "A";
              $scope.data.Formation = formation
              $scope.formationChosen = true;
              break;

            default:
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "A";
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
          if ($scope.players[i].TeamId === parseInt(player.TeamId)) {
            $scope.players[i].PreSelected = false;
          }
        }
        SCOPE.$apply
      };

      $scope.selectPlayersOfThisTeam = function (player) {

        SCOPE = $scope.$root.$new();

        for (var i = 0; i < $scope.players.length; i += 1) {
          if ($scope.players[i].TeamId === parseInt(player.TeamId)) {
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

      $scope.saveTemp = function (){
         SCOPE = $scope.$root.$new();

              //loop door stand om positie te bepalen
              for (var i = 0; i < $scope.data.Table.length; i += 1) {
                $scope.data.Table[i].Position = i + 1
              }
              SCOPE.$apply
              var registration = registrationService.post($scope.data);
}

      $scope.save = function () {
        $scope.showConfirm = true;
        $scope.showMatches = false;

        $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de voorspellingen van " + $scope.data.Participant.Name });

        SCOPE = $scope.$root.$new();

        //loop door stand om positie te bepalen
        for (var i = 0; i < $scope.data.Table.length; i += 1) {
          $scope.data.Table[i].Position = i + 1
        }
        SCOPE.$apply


        var registration = registrationService.post($scope.data);
          savetransfersservice.post($scope.data);

        registration.success(function () {
            $scope.alerts.push({
                type: 'success',
                msg: 'Het opslaan is gelukt! Nadat het inschrijfgeld is ontvangen speel je definitief mee. Tot zaterdag 9 september 18:30 uur kun je jouw voorspellingen nog wijzigen. Veel plezier met Super 11!'
            });
        });

        registration.error(function () {
          $scope.showConfirm = false;
          $scope.showMatches = true;
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

        //scroll to id=contentPage
        $location.hash('contentPage');
        $anchorScroll();

      };

      $scope.tableView = function () {
        $scope.showParticipant = false;
        $scope.showTable = true;
        $scope.showTeam = false;
        $scope.showQuestions = false;
        $scope.showMatches = false;

        //scroll to id=contentPage
        $location.hash('contentPage');
        $anchorScroll();

      };

      $scope.teamView = function () {
        $scope.showParticipant = false;
        $scope.showTable = false;
        $scope.showTeam = true;
        $scope.showQuestions = false;
        $scope.showMatches = false;

        //scroll to id=contentPage
        $location.hash('contentPage');
        $anchorScroll();

      };

      $scope.questionsView = function () {
        $scope.showParticipant = false;
        $scope.showTable = false;
        $scope.showTeam = false;
        $scope.showQuestions = true;
        $scope.showMatches = false;

        //scroll to id=contentPage
        $location.hash('contentPage');
        $anchorScroll();

      };

      $scope.matchesView = function () {
        $scope.showParticipant = false;
        $scope.showTable = false;
        $scope.showTeam = false;
        $scope.showQuestions = false;
        $scope.showMatches = true;

        //scroll to id=contentPage
        $location.hash('contentPage');
        $anchorScroll();
      };
    }])

  .directive('custom', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function (scope, element, attrs, ctrls) {
        var model = ctrls[0], form = ctrls[1];

        scope.next = function () {
          return model.$valid
        }

        scope.$watch(scope.next, function (newValue, oldValue) {
          if (newValue && model.$dirty) {
            var nextinput = element.parent().next().children('input');
            if (nextinput.length === 1) {
              nextinput[0].focus();
            }
            else {
              var nextinput = element.parent().parent().next().find('input').first()
              if (nextinput.length === 1) {
                nextinput[0].focus();
              }
            }
          }
        })
      }
    }
  }]);



