﻿MetronicApp.controller('TeamTableApiController', function (teamTableApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    teamTableApi.async().then(function (data) {
        $scope.teamTable = data;
    });
});