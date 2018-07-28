angular.module('MetronicApp').factory('getQuestionsService', function ($http, API_ENDPOINT) {
  var myService = {
    async: function () {
      // $http returns a promise, which has a then function, which also returns a promise
        var promise = $http.get(API_ENDPOINT.url + '/questionsScoreform').then(function (response) {
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


angular.module('MetronicApp').service('updateQuestionsService', function ($http, API_ENDPOINT) {
    this.put = function (questions) {
        var req = $http.put(API_ENDPOINT.url + '/vragenstand/', questions);
        return req;
  }
});

angular.module('MetronicApp').service('updateQuestionsScoreform', function ($http, API_ENDPOINT) {
    this.put = function (questions) {
        var req = $http.put(API_ENDPOINT.url + '/updateQuestionsScoreform/', questions);
        return req;
    }
});


angular.module('MetronicApp').factory('getGivenAnswersForQuestionService', function ($http, API_ENDPOINT) {
    var myService = {
        async: function (questionId) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(API_ENDPOINT.url + '/questionsPrediction/' + questionId).then(function (response) {
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

