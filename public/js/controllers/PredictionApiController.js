MetronicApp.controller('PredictionApiController', function (predictionApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    predictionApi.async().then(function (data) {
        $scope.predictions = data;
        $scope.poules = [{ poule: 'A' }, { poule: 'B' }];
        $scope.predictionTypes = [{ Id: 3, Title: "Halve Finalisten" },{ Id: 4, Title: "Finalisten" }, { Id: 5, Title: "Winnaar" }];

        $scope.orderByField = 'TablePosition';
        $scope.reverseSort = false;
    });
});