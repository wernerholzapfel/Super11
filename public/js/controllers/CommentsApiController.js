
angular.module('MetronicApp').controller('CommentsApiController', function (getCommentsApi, saveCommentsApi, $scope) {
  // Call the async method and then do stuff with what is returned inside our own then function
  $scope.alerts = [];
  $scope.data = { "content": "" }

  getCommentsApi.async().then(function (data) {
    $scope.comments = data;
  });


  $scope.saveComment = function () {
    $scope.showConfirm = true;
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan van de comment" });

    var comment = saveCommentsApi.post($scope.data);

    comment.success(function (data) {
      $scope.data = { "content": "" }
      $scope.comments.unshift(data);
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!' });
    });
    comment.error(function () {
      $scope.showConfirm = false;

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
