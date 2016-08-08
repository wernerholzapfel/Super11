angular.module('MetronicApp')
 
.controller('LoginCtrl', function($scope, AuthService, $location) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $location.url('/#/scoreform.html');
    }, function(errMsg) {
      $scope.error = errMsg;
    });
  };
})
 
.controller('RegisterCtrl', function($scope, AuthService, $location) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $location.url('/#/signup.html');
    }, function(errMsg) {
      $scope.error = errMsg;
    });
  };
})