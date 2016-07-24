MetronicApp.controller('TeamTableApiController', function (teamTableApi, totalTeamTableApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    teamTableApi.async(1).then(function (data) {
        $scope.teamTable = data;
    });

    totalTeamTableApi.async().then(function (data) {
        $scope.totalTeamTable = data;
    });
});


