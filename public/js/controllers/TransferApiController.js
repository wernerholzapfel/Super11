
angular.module('MetronicApp').controller('TransferApiController',
  ['$anchorScroll', '$location', '$scope', "getlatestteamservice", "teamListService", "eredivisiePlayersApi", "roundsApi", 'istransfermarktopen', 'savetransfersservice',
    function ($anchorScroll, $location, $scope, getlatestteamservice, teamListService, eredivisiePlayersApi, roundsApi, istransfermarktopen, savetransfersservice) {

        $scope.selectedFormation = "433";

      istransfermarktopen.async().then(function (data) {
        $scope.istransfermarktopen = data;
      });

      getlatestteamservice.async().then(function (data) {
        $scope.teams = teamListService;
        $scope.data = data;
        if (data.Formation) {
          $scope.selectedFormation = data.Formation;
        }
        $scope.captainId = data.CaptainId;

        eredivisiePlayersApi.async().then(function (data) {
          $scope.players = data[0].Player;
          for (var i = 0; i < $scope.data.Team.length; i += 1) {
            $scope.selectPlayersOfThisTeam($scope.data.Team[i]);
            setTeamselected($scope.data.Team[i]);
          }
        }).then(function (data) {
          roundsApi.async().then(function (roundsdata) {

            $scope.rounds = roundsdata;
            if ($scope.rounds.length < 1) {
              $scope.data.RoundId;
            }
            else {
              $scope.data.RoundId = _.last($scope.rounds).RoundId;
            }

          });
        });
      });

      $scope.alerts = [];

      $scope.playerPositions = [{ Id: 1, Position: "K", PositionUi: "Keeper" }, { Id: 2, Position: "V", PositionUi: "Verdediger" }, { Id: 3, Position: "M", PositionUi: "Middenvelder" }, { Id: 4, Position: "A", PositionUi: "Aanvaller" }];
      $scope.formations = [{ Id: 1, Formation: "433" }, { Id: 2, Formation: "442" }, { Id: 3, Formation: "343" }]

      $scope.setFormation = function (formation) {
        if ($scope.data.Formation != formation) {
          switch (formation) {
            case "433":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[8].Position = "A";
                $scope.data.Formation = formation;
              $scope.formationChosen = true;
              break;
            case "442":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "M";
                $scope.data.Formation = formation;
              $scope.formationChosen = true;
              break;
            case "343":
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "M";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "A";
                $scope.data.Formation = formation;
              $scope.formationChosen = true;
              break;

            default:
              $scope.removeplayerfromteam($scope.data.Team[4]);
              $scope.data.Team[4].Position = "V";
              $scope.removeplayerfromteam($scope.data.Team[8]);
              $scope.data.Team[8].Position = "A";
                $scope.data.Formation = formation;
              $scope.formationChosen = true;

          }
        }
        $scope.formationChosen = true;
      };

      $scope.addPlayerToSelection = function (player) {
        SCOPE = $scope.$root.$new();
        setTeamselected(player);
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
        setTeamUnselected(player);
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

      var setTeamselected = function (player) {
        SCOPE = $scope.$root.$new();

        for (var i = 0; i < $scope.teams.length; i += 1) {
          if ($scope.teams[i].Id === parseInt(player.TeamId)) {
            $scope.teams[i].Selected = true;
          }
        }
        SCOPE.$apply

      };

      var setTeamUnselected = function (player) {
        SCOPE = $scope.$root.$new();

        for (var i = 0; i < $scope.teams.length; i += 1) {
          if ($scope.teams[i].Id === parseInt(player.TeamId)) {
            $scope.teams[i].Selected = false;
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

      // $scope.updateTeamPrediction = function (playerId, t) {

      //   //set prediction fields
      //   $scope.data.Team[t.Id - 1].PlayerId = playerId
      //   $scope.data.Team[t.Id - 1].PlayerName = $scope.players[(playerId - 1)].Name
      //   $scope.data.Team[t.Id - 1].Team = $scope.players[(playerId - 1)].Team
      // };

      $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.save = function () {
        $scope.showConfirm = true;
        $scope.showMatches = false;

        $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de voorspellingen van " + $scope.data.Participant.Name });

        SCOPE = $scope.$root.$new();

        SCOPE.$apply

        var registration = savetransfersservice.post($scope.data);

        registration.success(function () {
            $scope.alerts.push({
                type: 'success',
                msg: 'Het opslaan is gelukt! Je kan tot 1 februari je team nog wijzigen.'
            });
        });

          registration.error(function (message) {
          $scope.showConfirm = false;
          $scope.showMatches = true;
          //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
              $scope.alerts.push({type: 'danger', msg: message});
        });
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



