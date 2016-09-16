
angular.module('MetronicApp').controller('TeamTableApiController', function (teamTableApi, vragenStandApi, newTotalTeamTableApi, wedstrijdenStandApi, totalTeamTableApi, roundsApi,$uibModal, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function

$scope.items = ['item1', 'item2', 'item3'];

   
 $scope.showTeamStand = function(data,template) {
       
       var modalInstance = $uibModal.open({
            templateUrl: 'teamstandmodal.html',
            controller: "ModalController",
            size: "lg",
            resolve: {
                items: function () {
                return data;
        }
        }});
    };

$scope.showTotalTeamStandModel= function(data) {
  var modalInstance = $uibModal.open({
            templateUrl: 'totalstandmodal.html',
            controller: "ModalController",
            size: "lg",
            resolve: {
                items: function () {
                return data;
        }
        }});
};

$scope.showVragenStandModel= function(data) {
  var modalInstance = $uibModal.open({
            templateUrl: 'vragenstandmodal.html',
            controller: "ModalController",
            size: "lg",
            resolve: {
                items: function () {
                return data;
        }
        }});
};

$scope.showWedstrijdenStandModel= function(data) {
  var modalInstance = $uibModal.open({
            templateUrl: 'wedstrijdenstandmodal.html',
            controller: "ModalController",
            size: "lg",
            resolve: {
                items: function () {
                return data;
        }
        }});
};


    roundsApi.async().then(function (roundsdata) {

        $scope.rounds = roundsdata;
       if ($scope.rounds.length < 1) {
            $scope.selectedRound = 0;
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

    newTotalTeamTableApi.async().then(function(data){
        $scope.newTotalTeamTable = data;
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
});


angular.module('MetronicApp').controller('ModalController', function($scope, $modalInstance, items) {
  
 
 $scope.close = function () {
   $modalInstance.close();
  };

 $scope.score = items;

});
