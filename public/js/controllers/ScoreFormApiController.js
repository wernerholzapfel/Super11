MetronicApp.controller('ScoreFormApiController', function ($scope, eredivisiePlayersApi, saveScoreFormService, getScoreFormService, findAndUpdatePlayerList) {
    $scope.alerts = [];


    eredivisiePlayersApi.async().then(function (data) {
        $scope.newScoreFormList = data[0];
        getScoreFormService.async().then(function (data) {
            $scope.oldScoreForms = data;
            $scope.newScoreFormList.RoundId = $scope.oldScoreForms.length + 1;

        });
    });

        $scope.updateScoreForm = function (selectedRound) {
            $scope.showConfirm = true;

            $scope.NewList = {
                RoundId: selectedRound.RoundId,
                Player: selectedRound.Player
            };

            console.log("het bericht dat gepost wordt: " + $scope.NewList);

            $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

            var playerList = findAndUpdatePlayerList.put($scope.NewList, selectedRound.RoundId);

            playerList.success(function () {
                $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
            });
            playerList.error(function () {
                $scope.showConfirm = false;

                //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
                $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
            });

        };

        $scope.saveNewScoreFormList = function () {
            $scope.showConfirm = true;

            $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan" });

            var playerList = saveScoreFormService.post($scope.newScoreFormList);

            playerList.success(function () {
                $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!' });
            });
            playerList.error(function () {
                $scope.showConfirm = false;

                //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
                $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
            });
        };

        $scope.showRoundScoreForm = true;
        $scope.showNewScoreForm = false;

        $scope.addNewRound = function () {
            $scope.showRoundScoreForm = false;
            $scope.showNewScoreForm = true;

        }
    });
