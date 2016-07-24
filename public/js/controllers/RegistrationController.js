'use strict';


angular.module('MetronicApp').controller('RegistrationController', function ($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
        // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_registration')); // set link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
