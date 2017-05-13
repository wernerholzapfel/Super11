
angular.module('MetronicApp').factory('getMatchesService', function ($http,API_ENDPOINT) {
  var myService = {
    async: function () {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get(API_ENDPOINT.url +'/matchesScoreform').then(function (response) {
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


angular.module('MetronicApp').service('updateMatchesService', function($http,API_ENDPOINT) {
  this.put = function(questions) {
    var req = $http.put(API_ENDPOINT.url +'/matchesScoreform/', questions);
        return req;
  }
});

angular.module('MetronicApp').service('updateMatchesScoreform', function ($http, API_ENDPOINT) {
    this.put = function (questions) {
        var req = $http.put(API_ENDPOINT.url + '/updateMatchesScoreform/', questions);
        return req;
    }
});

angular.module('MetronicApp').service('updatePlayersScoreform', function ($http, API_ENDPOINT) {
    this.put = function (questions) {
        var req = $http.put(API_ENDPOINT.url + '/updatePlayersScoreform/', questions);
        return req;
    }
});
