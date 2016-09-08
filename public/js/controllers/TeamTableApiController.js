
angular.module('MetronicApp').controller('TeamTableApiController', function (teamTableApi, totalTeamTableApi, roundsApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    
    roundsApi.async().then(function (roundsdata) {

        $scope.rounds = roundsdata;
        $scope.selectedRound = _.last($scope.rounds).RoundId;

        teamTableApi.async($scope.selectedRound).then(function (data) {
            $scope.teamTable = data;
        });

    });
    totalTeamTableApi.async().then(function (data) {
        $scope.totalTeamTable = data;
    });

    // $scope.selectedRound.RoundId = 1;
    $scope.getnewround = function (roundId) {
        teamTableApi.async(roundId).then(function (data) {
            $scope.teamTable = data;
        });

    };
});


