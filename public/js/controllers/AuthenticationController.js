angular.module('MetronicApp')
 
.controller('LoginCtrl', function($scope, AuthService, $window) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $window.location.href = '/#/registration.html';
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
      $window.location.href = '/#/registration.html';
    }, function(errMsg) {
      $scope.error = errMsg;
    });
  };
})