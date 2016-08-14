
angular.module('MetronicApp').controller('HeadlinesApiController', function (headlinesApi, saveHeadlinesService, deleteHeadlinesService, $scope) {
  // Call the async method and then do stuff with what is returned inside our own then function
  $scope.alerts = [];
  $scope.data = { "content": "" }

  headlinesApi.async().then(function (data) {
    $scope.headlines = data;
  });


  $scope.deleteHeadline = function (idx) {
    var headline = $scope.headlines[idx];
    var deletedHeadline = deleteHeadlinesService.post(headline._id)
    
    deletedHeadline.success(function() {
      $scope.headlines.splice(idx, 1);
    });
  };

  $scope.saveHeadlines = function () {
    $scope.showConfirm = true;
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de headlines" });

    var headline = saveHeadlinesService.post($scope.data);

    headline.success(function (data) {
      $scope.data = { "content": "" }
      $scope.headlines.push(data);
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!' });
    });
    headline.error(function () {
      $scope.showConfirm = false;

      //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
      $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
    });
  };
});


angular.module('MetronicApp').filter('dateFormat', function ($filter) {
  return function (input) {
    if (input == null) { return ""; }

    var _date = $filter('date')(new Date(input), 'dd MMM yyyy');

    return _date;

  };
});
