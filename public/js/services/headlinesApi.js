
angular.module('MetronicApp').factory('headlinesApi', function ($http) {
    var myService = {
        async: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('https://safe-oasis-58234.herokuapp.com/api/headlines/').then(function (response) {
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

angular.module('MetronicApp').service('deleteHeadlinesService', function ($http) {
    //Create new record
    this.post = function (id) {
        var req = $http.delete('http://localhost:8200/api/headlines/'+id);
        return req;
    }
});


angular.module('MetronicApp').service('saveHeadlinesService', function ($http) {
    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post('http://localhost:8200/api/headlines', registrationForm);
        return req;
    }
});
