
angular.module('MetronicApp').controller('ScoreFormApiController', function ($scope, eredivisiePlayersApi, saveScoreFormService, getScoreFormService, findAndUpdatePlayerList) {
    $scope.alerts = [];

    //    $scope.selectedRound = 0;

    eredivisiePlayersApi.async().then(function (data) {
        $scope.newScoreFormList = data[0];
        getScoreFormService.async().then(function (data) {
            $scope.oldScoreForms = data;
            $scope.newScoreFormList.RoundId = $scope.oldScoreForms.length + 1;
            if ($scope.newScoreFormList.RoundId > 1) {
                $scope.newScoreFormList.Questions = $scope.oldScoreForms[$scope.oldScoreForms.length - 1].Questions;
                $scope.newScoreFormList.Matches = $scope.oldScoreForms[$scope.oldScoreForms.length - 1].Matches;
            }
        });
    });

    $scope.disableCleanSheat = function (position) {
        if (position == 'M' || position == "A") {
            return true;
        }
        else {
            return false;
        }
    };
    
    $scope.updateScoreForm = function (selectedRound) {
        $scope.showConfirm = true;

        $scope.NewList = {
            RoundId: selectedRound.RoundId,
            Player: selectedRound.Player,
            Questions: selectedRound.Questions,
            Matches: selectedRound.Matches
        };

        console.log("het bericht dat gepost wordt: " + $scope.NewList);

        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var playerList = findAndUpdatePlayerList.put($scope.NewList, selectedRound.RoundId);

        playerList.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });
        playerList.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });

    };

    $scope.saveNewScoreFormList = function () {
        $scope.showConfirm = true;

        $scope.NewList = {
            RoundId: $scope.newScoreFormList.RoundId,
            Player: $scope.newScoreFormList.Player,
            Matches: $scope.newScoreFormList.Matches,
            Questions: $scope.newScoreFormList.Questions

        };

        $scope.alerts.push({ type: 'warning', msg: "Bezig met opslaan" });

        var playerList = findAndUpdatePlayerList.put($scope.NewList, $scope.NewList.RoundId);

        playerList.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het opslaan is gelukt!' });
        });
        playerList.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });
    };

    $scope.showRoundScoreForm = false;
    $scope.showNewScoreForm = true;

    $scope.addNewRound = function () {
        $scope.showRoundScoreForm = false;
        $scope.showNewScoreForm = true;
    }

    $scope.changeOldRound = function () {
        $scope.showRoundScoreForm = true;
        $scope.showNewScoreForm = false;
    }

    $scope.setRoundForQuestion = function (question, roundId) {
        console.log(question)

        for (var i = 0; i < $scope.newScoreFormList.Questions.length; i += 1) {
            var questionId = $scope.newScoreFormList.Questions[i].Id
            if (questionId == question.Id) {
                if (question.Answer.length != 0) {
                    $scope.newScoreFormList.Questions[i].RoundId = roundId;
                }
                else {
                    $scope.newScoreFormList.Questions[i].Answer = null;
                    $scope.newScoreFormList.Questions[i].RoundId = null;
                }
            }
        }
    }
});

$(document).ready(function () {
    $('#newScoreTable').DataTable();
});
