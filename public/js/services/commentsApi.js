
angular.module('MetronicApp').factory('getCommentsApi', function ($http) {
    var myService = {
        async: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('http://localhost:8200/api/comments/').then(function (response) {
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

angular.module('MetronicApp').service('deleteCommentsApi', function ($http) {
    //Create new record
    this.post = function (id) {
        var req = $http.delete('https://safe-oasis-58234.herokuapp.com/api/comments/'+id);
        return req;
    }
});


angular.module('MetronicApp').service('saveCommentsApi', function ($http) {
    //Create new record
    this.post = function (comment) {
        var req = $http.post('https://safe-oasis-58234.herokuapp.com/api/comments', comment);
        return req;
    }
});
