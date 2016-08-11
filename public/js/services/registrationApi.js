﻿
angular.module('MetronicApp').service('registrationService', function ($http) {
    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post('http://localhost:8200/api/predictions', registrationForm);
        return req;
// https://safe-oasis-58234.herokuapp.com
    }
});


angular.module('MetronicApp').factory('getRegistrationForm', function ($http) {
  var myService = {
    async: function () {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('http://localhost:8200/api/predictionform').then(function (response) {
        // The then function here is an opportunity to modify the response
        console.log(response);
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  return myService;
});

