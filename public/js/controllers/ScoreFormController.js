'use strict';


angular.module('MetronicApp').controller('ScoreFormController', function ($rootScope, $scope, $http, $timeout, authService, $window) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
        // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_scoreform')); // set scoreform link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;

    // if (authService.isAdmin()) {
    // $window.location.href = '/#/login.html';
    // };
}); 
