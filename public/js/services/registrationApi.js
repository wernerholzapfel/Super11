MetronicApp.service('registrationService', function ($http) {


    //Create new record
    this.post = function (registrationForm) {
        var req = $http.post('https://localhost:80808/api/predictions', registrationForm);
        return req;

    }
});


MetronicApp.factory('registrationApi', function ($http) {
    var myService = {
        async: function () {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get('http://localhost:58887/api/predictions/1').then(function (response) {
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
