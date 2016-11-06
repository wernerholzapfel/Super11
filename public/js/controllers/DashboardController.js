angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, AuthService, getlaatsteupdate, getnummereentotaalstand, getnummereenteamstandlaatsteronde) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.isLoggedIn = AuthService.isAuthenticated;

    getlaatsteupdate.async().then(function (data) {
        $scope.laatsteupdate = data;
    });

    getnummereentotaalstand.async().then(function (data) {
        $scope.nummereentotaalstand = data;
    });
    getnummereenteamstandlaatsteronde.async().then(function (data) {
        $scope.nummereenteamstandlaatsteronde = data;
    });
});
