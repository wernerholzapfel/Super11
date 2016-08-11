'use strict';


angular.module('MetronicApp').controller('RegistrationController', function ($rootScope, $scope, $http, $timeout, AuthService, $window) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
        // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_registration')); // set link active in sidebar menu 
    });
  if (!AuthService.isAuthenticated()) {
    $window.location.href = '/#/login.html';
    };
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
