angular.module('MetronicApp').controller('ScoreFormApiController', function ($scope, roundsApi, eredivisiePlayersApi, getQuestionsService, updateQuestionsService, getMatchesService, updateMatchesService, saveScoreFormService, getScoreFormService, eindstandscoreform, updateEindstandform, getGivenAnswersForQuestionService, findAndUpdatePlayerList) {
    $scope.alerts = [];
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.selectedQuestion = 1;
    roundsApi.async().then(function (roundsdata) {
        $scope.rounds = roundsdata;
        if ($scope.rounds.length < 1) {
            $scope.latestRound = 0;
            $scope.selectedRound = 0;
        }
        else {
            $scope.latestRound = _.last($scope.rounds).RoundId;
            $scope.selectedRound = _.last($scope.rounds).RoundId;
        }
        eredivisiePlayersApi.async().then(function (data) {
            $scope.newScoreFormList = data[0];
            $scope.newScoreFormList.RoundId = $scope.latestRound + 1;
        });

        getScoreFormService.async($scope.latestRound).then(function (data) {
            $scope.oldScoreForms = data;
        });

    });

    getGivenAnswersForQuestionService.async(1).then(function (data) {
        $scope.givenAnswersForQuestion = data;
    });


    eindstandscoreform.async().then(function (data) {
        $scope.eindstandscoreform = data;
    });

    getMatchesService.async().then(function (data) {
        $scope.wedstrijdenScoreform = data;
    });

    getQuestionsService.async().then(function (data) {
        $scope.vragenScoreform = data;
    });

    $scope.getscoreformbyroundid = function (roundId) {
        getScoreFormService.async(roundId).then(function (data) {
            $scope.oldScoreForms = data;
        });
    };

    $scope.getGivenAnswersForQuestion = function (questionId) {
        getGivenAnswersForQuestionService.async(questionId).then(function (data) {
            $scope.givenAnswersForQuestion = data;
        });
    };

    $scope.disableCleanSheat = function (position) {
        if (position == 'M' || position == "A") {
            return true;
        }
        else {
            return false;
        }
    };

    $scope.updateScoreForm = function () {
        $scope.showConfirm = true;
        console.log("het bericht dat gepost wordt: " + $scope.NewList);
        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var playerList = findAndUpdatePlayerList.put($scope.oldScoreForms, $scope.oldScoreForms.RoundId);

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
            Player: $scope.newScoreFormList.Player
            // Matches: $scope.newScoreFormList.Matches,
            // Questions: $scope.newScoreFormList.Questions

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

    $scope.updateVragenForm = function () {
        $scope.showConfirm = true;
        console.log("het bericht dat gepost wordt: " + $scope.NewList);
        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var vragenlijst = updateQuestionsService.put($scope.vragenScoreform);

        vragenlijst.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });
        vragenlijst.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });

    };

    $scope.updateWedstrijdenForm = function () {
        $scope.showConfirm = true;
        console.log("het bericht dat gepost wordt: " + $scope.NewList);
        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        var wedstrijdenlijst = updateMatchesService.put($scope.wedstrijdenScoreform);

        wedstrijdenlijst.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });
        wedstrijdenlijst.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });

    }

    $scope.saveEindstandForm = function () {
        $scope.showConfirm = true;
        console.log("het bericht dat gepost wordt: " + $scope.NewList);
        $scope.alerts.push({ type: 'warning', msg: "Bezig met updaten" });

        SCOPE = $scope.$root.$new();

        //loop door stand om positie te bepalen
        for (var i = 0; i < $scope.eindstandscoreform.Table.length; i += 1) {
            $scope.eindstandscoreform.Table[i].Position = i + 1
        }
        SCOPE.$apply

        var eindstand = updateEindstandform.put($scope.eindstandscoreform);

        eindstand.success(function () {
            $scope.alerts.push({ type: 'success', msg: 'Het updaten is gelukt!' });
        });

        eindstand.error(function () {
            $scope.showConfirm = false;

            //todo http://stackoverflow.com/questions/23086664/how-to-render-errors-to-client-angularjs-webapi-modelstate
            $scope.alerts.push({ type: 'danger', msg: "Er is iets misgegaan, controleer of alle velden zijn ingevuld en probeer het opnieuw" });
        });

    }
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

    $scope.setAnswer = function (selectedQuestion) {
        for (var i = 0; i < $scope.givenAnswersForQuestion.length; i += 1) {
            $scope.givenAnswersForQuestion[i].QuestionsScore[0].Uitslag = $scope.vragenScoreform.Questions[selectedQuestion - 1].Answer
        }
        console.log(selectedQuestion);
    }
});

$(document).ready(function () {
    $('#newScoreTable').DataTable();
});
