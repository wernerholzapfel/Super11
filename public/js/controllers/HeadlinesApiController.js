
angular.module('MetronicApp').controller('HeadlinesApiController', function (headlinesApi,saveHeadlinesService, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    $scope.alerts = [];

    headlinesApi.async().then(function (data) {
        $scope.headlines = data;
    });


    $scope.saveHeadlines = function () {
    $scope.showConfirm = true;
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de headlines" });

    var headlines = saveHeadlinesService.post($scope.content);

    headlines.success(function () {
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!'});
    });
    headlines.error(function () {
      $scope.showConfirm = false;

      //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
      $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
    });
  };
});


