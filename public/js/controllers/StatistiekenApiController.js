angular.module('MetronicApp').controller('StatistiekenApiController',
    function (gekozenspelersstatistieken, welkedeelnemershebbendezespeler, spelerstotaalpunten, $uibModal, $scope) {

        gekozenspelersstatistieken.async().then(function (data) {

            $scope.gekozenspelers = data;
        });

        spelerstotaalpunten.async().then(function (data) {
            $scope.spelerstotaalpunten = data;
        });


        $scope.showDeelnemersMetSpeler = function (speler) {

            welkedeelnemershebbendezespeler.async(speler.PlayerId).then(function (data) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'deelnemersmetspeler.html',
                    controller: "ModalController",
                    size: "lg",
                    resolve: {
                        items: function () {
                            return data;
                        },
                        gekozenspeler: function () {
                            return speler;
                        }
                    }
                });
            });
        };
    }
);


angular.module('MetronicApp').controller('ModalController', function ($scope, $modalInstance, items, gekozenspeler) {


    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.deelnemers = items;
    $scope.gekozenspeler = gekozenspeler;

});
