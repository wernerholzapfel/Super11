﻿angular.module('MetronicApp').service('registrationService', function ($http, API_ENDPOINT) {
    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post(API_ENDPOINT.url + '/predictions', registrationForm);
        return req;
// 
    }
});


angular.module('MetronicApp').factory('getRegistrationForm', function ($http, API_ENDPOINT) {
  var myService = {
    async: function () {
      // $http returns a promise, which has a then function, which also returns a promise
        var promise = $http.get(API_ENDPOINT.url + '/predictionform').then(function (response) {
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

