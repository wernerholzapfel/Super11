
angular.module('MetronicApp').service('saveScoreFormService', function ($http,API_ENDPOINT) {

    //Create new record
    this.post = function (playerList) {
        var req = $http.post(API_ENDPOINT.url + '/roundteamscoreforms', playerList);
        return req;

    }
});


angular.module('MetronicApp').service('findAndUpdatePlayerList', function($http,API_ENDPOINT) {
  this.put = function(playerList,id) {
    var req = $http.put(API_ENDPOINT.url + '/roundteamscoreforms/'+id, playerList);
        return req;
  }
});
