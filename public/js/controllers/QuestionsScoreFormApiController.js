
angular.module('MetronicApp').controller('QuestionsScoreFormApiController', function ($scope, getQuestionsService, updateQuestionsService) {
    $scope.alerts = [];

    getQuestionsService.async().then(function (data) {
        $scope.questions = data[0];
        });
    
    $scope.updateQuestions = function () {
        $scope.showConfirm = true;

        console.log("het bericht dat gepost wordt: " + $scope.showConfirm);

        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var questionsList = updateQuestionsService.put($scope.questions);

        questionsList.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });
        questionsList.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });
    };

});

$(document).ready(function() {
    $('#newScoreTable').DataTable();
} );
