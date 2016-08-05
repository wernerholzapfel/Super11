
angular.module('MetronicApp').controller('MatchesScoreFormApiController', function ($scope, getMatchesService, updateMatchesService) {
    $scope.alerts = [];

    getMatchesService.async().then(function (data) {
        $scope.matches = data;
        });
    
    $scope.updateMatchesService = function () {
        $scope.showConfirm = true;

        console.log("het bericht dat gepost wordt: " + $scope.showConfirm);

        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });


        var matchesList = updateMatchesService.put($scope.matches);

        matchesList.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });
        matchesList.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });
    };

});

$(document).ready(function() {
    $('#newScoreTable').DataTable();
} );
