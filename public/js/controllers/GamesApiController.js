
angular.module('MetronicApp').controller('GamesApiController', function (gamesApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    gamesApi.async().then(function (data) {
        $scope.games = data;
    });

    $scope.poules = [{poule: 'A'},{poule: 'B'}];

});