
angular.module('MetronicApp').controller('ParticipantApiController', function (participantApi, $scope) {
    // Call the async method and then do stuff with what is returned inside our own then function
    participantApi.async().then(function (data) {
        $scope.participants = data;
    });
});