
angular.module('MetronicApp').factory('getScoreFormService', function ($http) {
  var myService = {
    async: function (roundId) {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('https://safe-oasis-58234.herokuapp.com/api/roundteamscoreforms/'+roundId).then(function (response) {
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


angular.module('MetronicApp').factory('getwedstrijdenService', function ($http) {
  var myService = {
    async: function () {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('https://safe-oasis-58234.herokuapp.com/api/matchesScoreform').then(function (response) {
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
