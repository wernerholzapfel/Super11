angular.module('MetronicApp').controller('StatistiekenApiController',
    function (gekozenspelersstatistieken, welkedeelnemershebbendezespeler, spelerstotaalpunten, $uibModal, $scope) {


        gekozenspelersstatistieken.async().then(function (data) {

            $scope.gekozenspelers = data;
        });

        spelerstotaalpunten.async().then(function (data) {
            $scope.spelerstotaalpunten = data;
        });


        $scope.showDeelnemersMetSpeler = function (playerId) {

            welkedeelnemershebbendezespeler.async(playerId).then(function (data) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'deelnemersmetspeler.html',
                    controller: "statsController",
                    size: "lg",
                    resolve: {
                        items: function () {
                            return data;
                        },
                        gekozenspeler: function () {
                            return data[0].LatestTeam;
                        }
                    }
                });
            });
        };
    }
);


angular.module('MetronicApp').controller('statsController', function ($scope, $modalInstance, items, gekozenspeler) {
    $scope.sortType = 'TotalScore'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order

    $scope.sortTable = function (sortType) {
        if (this.sortType === sortType) {
            $scope.sortReverse = !$scope.sortReverse;
            return;
        }
        this.sortType = sortType;
    };

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.deelnemers = items;
    $scope.gekozenspeler = gekozenspeler;

});
