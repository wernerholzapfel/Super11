MetronicApp.controller('ScoreFormApiController', function ($scope, playerListService, saveScoreFormService, getScoreFormService,findAnUpdatePlayerList) {
    $scope.alerts = [];

    $scope.newScoreFormList = playerListService;

    getScoreFormService.async().then(function (data) {
        $scope.oldScoreForms = data;
        $scope.newScoreFormList.RoundId = $scope.oldScoreForms.length+1;
    });
        

$scope.updateScoreForm = function(selectedRound) {
        $scope.showConfirm = true;

        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var playerList = findAnUpdatePlayerList.put(selectedRound);

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
