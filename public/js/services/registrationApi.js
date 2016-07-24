
angular.module('MetronicApp').service('registrationService', function ($http) {
    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post('https://safe-oasis-58234.herokuapp.com/api/predictions', registrationForm);
        return req;

    }
});
