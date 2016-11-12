
angular.module('MetronicApp').factory('headlinesApi', function ($http,API_ENDPOINT) {
    var myService = {
        async: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get(API_ENDPOINT.url +'/headlines/').then(function (response) {
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

angular.module('MetronicApp').service('deleteHeadlinesService', function ($http,API_ENDPOINT) {
    //Create new record
    this.post = function (id) {
        var req = $http.delete(API_ENDPOINT.url + '/headlines/'+id);
        return req;
    }
});


angular.module('MetronicApp').service('saveHeadlinesService', function ($http,API_ENDPOINT) {
    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post(API_ENDPOINT.url + '/headlines', registrationForm);
        return req;
    }
});
