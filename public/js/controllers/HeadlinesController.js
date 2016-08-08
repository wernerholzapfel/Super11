'use strict';


angular.module('MetronicApp').controller('HeadlinesController', function($rootScope, $scope, $http, $timeout, AuthService) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_games')); // set link active in sidebar menu 
    });

    $scope.isLoggedIn = AuthService.isLoggedIn;
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
}); 
