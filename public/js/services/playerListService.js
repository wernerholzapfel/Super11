
angular.module('MetronicApp').service('saveScoreFormService', function ($http) {

    //Create new record
    this.post = function (playerList) {
        var req = $http.post('https://safe-oasis-58234.herokuapp.com/api/roundteamscoreforms', playerList);
        return req;

    }
});


angular.module('MetronicApp').service('findAndUpdatePlayerList', function($http) {
  this.put = function(playerList,id) {
    var req = $http.put('http://localhost:8200/api/roundteamscoreforms/'+id, playerList);
        return req;
  }
});
