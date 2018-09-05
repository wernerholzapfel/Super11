(function () {

    'use strict';

    angular
        .module('MetronicApp')
        .service('authService', authService);

    authService.$inject = ['$rootScope', '$state', '$window', 'angularAuth0', 'authManager', '$timeout', '$q'];

    function authService($rootScope, $state, $window, angularAuth0, authManager, $timeout, $q) {

        $rootScope.$on('$stateChangeStart', function (event, nextRoute) {
            if (nextRoute.controller === 'ScoreFormController') {
                if (!isAdmin()) {
                    alert('You are not allowed to see the Admin content');
                    return event.preventDefault();
                }
            }
        });

        var userProfile = JSON.parse(localStorage.getItem('profile')) || null;
        var deferredProfile = $q.defer();

        if (userProfile) {
            deferredProfile.resolve(userProfile);
        }

        function login() {
            angularAuth0.authorize();
        }

        function handleAuthentication() {
            angularAuth0.parseHash(function (err, authResult) {
                if (authResult && authResult.accessToken && authResult.idToken) {
                    setSession(authResult);
                    getProfile();
                    $window.location.reload();
                    // $state.go('registration');
                } else if (err) {
                    $timeout(function () {
                        $state.go('dashboard');
                        $window.location.reload();
                    });
                    console.log(err);
                    alert('Error: ' + err.error + '. Check the console for further details.');
                }
            });
        }

        function setSession(authResult) {
            // Set the time that the access token will expire at
            var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);

            // schedule a token renewal
            scheduleRenewal();
        }

        function logout() {
            // Remove tokens and expiry time from localStorage
            deferredProfile = $q.defer();
            localStorage.removeItem('access_token');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('profile');
            authManager.unauthenticate();
            userProfile = null;
            isAdmin = isAdmin();
            clearTimeout(tokenRenewalTimeout);
            $state.go('dashboard');


        }

        function isAuthenticated() {
            // Check whether the current time is past the
            // access token's expiry time
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        }

        function isLoggedIn() {
            // Check whether the current time is past the
            // access token's expiry time
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        }

        var userProfile;

        function getProfile() {
            var accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('Access Token must exist to fetch profile');
            }
            angularAuth0.client.userInfo(accessToken, function (err, profile) {
                if (profile) {
                    localStorage.setItem('profile', JSON.stringify(profile));
                    deferredProfile.resolve(profile);
                    userProfile = profile;
                }
            });
        }

        function getProfileDeferred() {
            return deferredProfile.promise;
        }

        function getCachedProfile() {
            return userProfile;
        }

        function isAdmin() {
            return userProfile && userProfile.app_metadata
                && userProfile.app_metadata.roles
                && userProfile.app_metadata.roles.indexOf('admin') > -1;
        }

        function isVerified() {
            return userProfile && userProfile.email_verified;
        }

        function renewToken() {
            angularAuth0.checkSession({},
                function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        setSession(result);
                    }
                }
            );
        }

        var tokenRenewalTimeout

        function scheduleRenewal() {
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            var delay = expiresAt - Date.now();
            if (delay > 0) {
                tokenRenewalTimeout = setTimeout(function () {
                    renewToken();
                }, delay);
            }
        }

        return {
            login: login,
            handleAuthentication: handleAuthentication,
            getProfileDeferred: getProfileDeferred,
            logout: logout,
            isAdmin: isAdmin,
            isVerified: isVerified,
            scheduleRenewal: scheduleRenewal
        }
    }
})();
