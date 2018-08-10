angular.module('MetronicApp').controller('VoorbereidingApiController',
    function ($scope, eredivisiePlayersApi,
              getQuestionsService, updateQuestionsScoreform, getMatchesService,
              updateMatchesScoreform, teamListService, updatePlayersScoreform) {

        $scope.alerts = [];
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };


        getMatchesService.async().then(function (data) {
            $scope.wedstrijdenScoreform = [];
            for (var i = 0; i < data.Matches.length; i++) {
                var date = new Date(data.Matches[i].Date);
                data.Matches[i].Date = date;
            }
            $scope.wedstrijdenScoreform = data;
        });

        //lijst van vragen
        getQuestionsService.async().then(function (data) {
            $scope.vragenScoreform = data;
        });

        eredivisiePlayersApi.async().then(function (data) {
            $scope.playersScoreform = data[0];
            $scope.playersScoreform.RoundId = null;
            $scope.nieuwPlayer = {
                Id: data[0].Player[data[0].Player.length - 1].Id + 1,
                Name: "",
                Team: "",
                TeamId: 1,
                Selected: false,
                PreSelected: false,
                Position: "",
                Played: false,
                Win: false,
                Draw: false,
                Goals: 0,
                Assists: 0,
                Yellow: false,
                SecondYellow: false,
                Red: false,
                CleanSheet: false,
                PenaltyStopped: 0,
                PenaltyMissed: 0,
                OwnGoal: 0,
                PositionSort: 1
            }
        });


        $scope.teams = teamListService.sort(function (a, b) {
            if (a.Team < b.Team) return -1;
            if (a.Team > b.Team) return 1;
            return 0;
        });
        $scope.Posities = [{
            positie: "K",
            positionSort: 1
        }, {
            positie: "V",
            positionSort: 2
        }, {
            positie: "M",
            positionSort: 3
        }, {
            positie: "A",
            positionSort: 4
        }];

        $scope.updateVragenForm = function () {
            console.log($scope.vragenScoreform);
            $scope.showConfirm = true;
            $scope.alerts.push({type: 'warning', msg: "Bezig met updaten"});

            var vragenlijst = updateQuestionsScoreform.put($scope.vragenScoreform);

            vragenlijst.success(function () {
                $scope.alerts.push({type: 'success', msg: 'Het updaten is gelukt!'});
            });
            vragenlijst.error(function () {
                $scope.showConfirm = false;

                $scope.alerts.push({
                    type: 'danger',
                    msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw"
                });
            });

        };

        $scope.updateWedstrijdenForm = function () {
            $scope.showConfirm = true;
            console.log("het bericht dat gepost wordt: " + $scope.NewList);
            $scope.alerts.push({type: 'warning', msg: "Bezig met updaten"});

            var wedstrijdenlijst = updateMatchesScoreform.put($scope.wedstrijdenScoreform);

            wedstrijdenlijst.success(function () {
                $scope.alerts.push({type: 'success', msg: 'Het updaten is gelukt!'});
            });
            wedstrijdenlijst.error(function () {
                $scope.showConfirm = false;

                $scope.alerts.push({
                    type: 'danger',
                    msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw"
                });
            });

        };

        $scope.updateSpelersForm = function (succesMessage) {
            $scope.showConfirm = true;
            console.log("het bericht dat gepost wordt: " + $scope.playersScoreform);
            $scope.alerts.push({type: 'warning', msg: "Bezig met updaten"});

            var spelersLijst = updatePlayersScoreform.put($scope.playersScoreform);

            spelersLijst.success(function () {
                $scope.alerts.push({type: 'success', msg: succesMessage});
            });
            spelersLijst.error(function () {
                $scope.showConfirm = false;

                $scope.alerts.push({
                    type: 'danger',
                    msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw"
                });
            });

        };

        $scope.setTeam = function (player, teamName) {

            for (var it = 0; it < $scope.teams.length; it += 1) {
                if (teamName == $scope.teams[it].Team) {
                    SCOPE = $scope.$root.$new();
                    for (var i = 0; i < $scope.playersScoreform.Player.length; i += 1) {
                        if (player.Id == $scope.playersScoreform.Player[i].Id) {
                            $scope.playersScoreform.Player[i].TeamId = $scope.teams[it].Id;
                            return;
                        }
                    }
                    SCOPE.$apply
                }
            }
        };

        $scope.setTeamNieuwPlayer = function (player, teamName) {

            for (var it = 0; it < $scope.teams.length; it += 1) {
                if (teamName == $scope.teams[it].Team) {
                    $scope.nieuwPlayer.TeamId = $scope.teams[it].Id;
                    return;
                }
            }
        };

        $scope.verwijderSpeler = function (speler) {
            var index = $scope.playersScoreform.Player.indexOf(speler);
            if (index > -1) {
                $scope.playersScoreform.Player.splice(index, 1);
                $scope.updateSpelersForm("speler succesvol verwijderd")
            }
        };

        $scope.voegSpelerToe = function (speler) {
            $scope.playersScoreform.Player.push(speler);

            $scope.updateSpelersForm("speler succesvol toegevoegd");

            $scope.nieuwPlayer = {
                Id: speler.Id + 1,
                Name: "",
                Team: "",
                TeamId: 1,
                Selected: false,
                PreSelected: false,
                Position: "",
                Played: false,
                Win: false,
                Draw: false,
                Goals: 0,
                Assists: 0,
                Yellow: false,
                SecondYellow: false,
                Red: false,
                CleanSheet: false,
                PenaltyStopped: 0,
                PenaltyMissed: 0,
                OwnGoal: 0,
                PositionSort: 1
            }
        };

        $scope.setPositie = function (player, positie) {

            for (var it = 0; it < $scope.Posities.length; it += 1) {
                if (positie == $scope.Posities[it].positie) {
                    SCOPE = $scope.$root.$new();
                    for (var i = 0; i < $scope.playersScoreform.Player.length; i += 1) {
                        if (player.Id == $scope.playersScoreform.Player[i].Id) {
                            $scope.playersScoreform.Player[i].PositionSort = $scope.Posities[it].positionSort;
                            return;
                        }
                    }
                    SCOPE.$apply
                }
            }
        };

        $scope.setPositieNieuwPlayer = function (player, positie) {
            for (var it = 0; it < $scope.Posities.length; it += 1) {
                if (positie == $scope.Posities[it].positie) {
                    $scope.nieuwPlayer.PositionSort = $scope.Posities[it].positionSort;
                    return
                }
            }
        };
    });

$(document).ready(function () {
    $('#newScoreTable').DataTable();
});
