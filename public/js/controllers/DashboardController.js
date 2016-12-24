angular.module('MetronicApp').controller('DashboardController', function ($rootScope, authService, $scope, $http, $timeout, gettotalscoreuser, getlaatsteupdate, getnummereentotaalstand, getnummereenteamstandlaatsteronde) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.showUserScore = false;

    $scope.profile = authService.getProfileDeferred();

    gettotalscoreuser.async().then(function (data) {
        $scope.totalscoreuser = data;
        $scope.showUserScore = true;

    });

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
