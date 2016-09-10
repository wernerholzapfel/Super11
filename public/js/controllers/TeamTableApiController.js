
angular.module('MetronicApp').controller('TeamTableApiController', function (teamTableApi, vragenStandApi, wedstrijdenStandApi, totalTeamTableApi, roundsApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function

    roundsApi.async().then(function (roundsdata) {

        $scope.rounds = roundsdata;
       if ($scope.rounds.length < 1) {
            $scope.selectedRound = 0;
            $scope.hideTable = true;
        }
        else {
            $scope.selectedRound = _.last($scope.rounds).RoundId;
        }

        teamTableApi.async($scope.selectedRound).then(function (data) {
            $scope.teamTable = data;
        });

    });
    totalTeamTableApi.async().then(function (data) {
        $scope.totalTeamTable = data;
    });

    vragenStandApi.async().then(function (data) {
        $scope.vragenstand = data;
    });

    wedstrijdenStandApi.async().then(function (data) {
        $scope.wedstrijdenstand = data;
    });
    // $scope.selectedRound.RoundId = 1;
    $scope.getnewround = function (roundId) {
        teamTableApi.async(roundId).then(function (data) {
            $scope.teamTable = data;
        });

    };


     $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

});


