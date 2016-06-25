'use strict';

MetronicApp.controller('ScoreFormController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_scoreform')); // set scoreform link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
}); 
