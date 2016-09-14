
angular.module('MetronicApp').controller('StatistiekenApiController', function (gekozenspelersstatistieken, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function

    gekozenspelersstatistieken.async().then(function (data) {

        $scope.gekozenspelers = data;
});

});
