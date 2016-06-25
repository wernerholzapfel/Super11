MetronicApp.controller('ScoreFormApiController', function ($scope, playerListService,saveScoreFormService,getScoreFormService) {
  $scope.alerts = [];

  $scope.newScoreFormList = playerListService;
  $scope.oldScoreForms = getScoreFormService;
  $scope.newScoreFormList.RoundId = $scope.oldScoreForm.length + 1;
  $scope.showRoundScoreForm = false;
  $scope.showNewScoreForm = true;

 $scope.save = function () {
    $scope.showConfirm = true;
   
    $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan"});

    var playerList = saveScoreFormService.post($scope.players);

    playerList.success(function () {
      $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!'});
    });
    playerList.error(function () {
      $scope.showConfirm = false;

      //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
      $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
    });
  };
});
