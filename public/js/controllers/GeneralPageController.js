/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', 'AuthService', function ($rootScope, $scope, settings, AuthService) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.isLoggedIn = AuthService.isAuthenticated;
        $scope.isAdmin = AuthService.isAdmin;

        



    });
}]);
