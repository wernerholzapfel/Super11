
angular.module('MetronicApp').controller('PredictionApiController', function (predictionApi, $scope, $stateParams) {
    // Call the async method and then do stuff with what is returned inside our own then function
  
  $scope.Id = $stateParams.id;

    predictionApi.async($scope.Id).then(function (data) {
        $scope.predictions = data;
    });
});