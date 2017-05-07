angular.module('MetronicApp').controller('VoorbereidingApiController',
    function ($scope, eredivisiePlayersApi,
              getQuestionsService, updateQuestionsScoreform, getMatchesService,
              updateMatchesScoreform) {

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

    });

$(document).ready(function () {
    $('#newScoreTable').DataTable();
});
