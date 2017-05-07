/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ui.sortable",
    "angularModalService",
    'auth0.lock', 'angular-jwt'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);


/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    //   $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout3',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$window', function($scope, $window) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        $scope.navigateTo = function(url) {
            $window.location.href = url;
        }
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', 'lockProvider', '$urlRouterProvider', 'jwtOptionsProvider', '$httpProvider', function($stateProvider, lockProvider, $urlRouterProvider, jwtOptionsProvider, $httpProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            data: { pageTitle: 'Super 11' },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/AuthenticationController.js',
                            'js/controllers/DashboardController.js',
                            // 'js/controllers/LoginController.js',                            
                            'js/controllers/HeadlinesApiController.js',
                            'js/services/headlinesApi.js',
                            'js/controllers/CommentsApiController.js',
                            'js/services/commentsApi.js',
                            'js/services/homepagestats.js'
                        ]
                    });
                }]
            }
        })

        //login
        .state('login', {
            url: "/login.html",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/GeneralPageController.js',
                            'js/controllers/AuthenticationController.js',
                            'js/services/constants.js'
                        ]
                    });
                }]
            }
        })

        //registreer
        .state('registreer', {
            url: "/registreer.html",
            templateUrl: "views/registreer.html",
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/GeneralPageController.js',
                            'js/controllers/AuthenticationController.js',
                            'js/services/constants.js'
                        ]
                    });
                }]
            }
        })

        // Participants
        .state('participants', {
            url: "/participants.html",
            templateUrl: "views/participants.html",
            data: {
                pageTitle: 'De Deelnemers'
            },
            controller: "ParticipantController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/controllers/ParticipantController.js',
                            'js/controllers/ParticipantApiController.js',

                            'js/services/participantApi.js'
                        ]
                    });
                }]
            }
        })

        // scoreform
        .state('scoreform', {
            url: "/scoreform.html",
            templateUrl: "views/scoreform.html",
            data: {
                pageTitle: 'Score formulier'
            },
            controller: "ScoreFormController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/playerListService.js',
                            'js/services/scoreFormService.js',
                            'js/services/matchesService.js',
                            'js/services/questionsService.js',
                            'js/services/eredivisiePlayersApi.js',
                            'js/services/roundsApi.js',
                            'js/services/teamTableApi.js',

                            'js/controllers/ScoreFormController.js',
                            'js/controllers/ScoreFormApiController.js'
                        ]
                    });
                }]
            }
        })

        // voorbereiding
        .state('voorbereiding', {
            url: "/voorbereiding.html",
            templateUrl: "views/voorbereiding.html",
            data: {
                pageTitle: 'Seizoensvoorbereiding'
            },
            controller: "ScoreFormController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/playerListService.js',
                            'js/services/scoreFormService.js',
                            'js/services/matchesService.js',
                            'js/services/questionsService.js',
                            'js/services/eredivisiePlayersApi.js',
                            'js/services/roundsApi.js',
                            'js/services/teamTableApi.js',

                            'js/controllers/ScoreFormController.js',
                            'js/controllers/VoorbereidingApiController.js'
                        ]
                    });
                }]
            }
        })

        // tablescoreform
        .state('tablescoreform', {
            url: "/tablescoreform.html",
            templateUrl: "views/tablescoreform.html",
            data: {
                pageTitle: 'Eindstand scoreformulier'
            },
            controller: "ScoreFormController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/playerListService.js',
                            'js/services/scoreFormService.js',
                            'js/services/matchesService.js',
                            'js/services/questionsService.js',
                            'js/services/eredivisiePlayersApi.js',
                            'js/services/roundsApi.js',

                            'js/controllers/ScoreFormController.js',
                            'js/controllers/ScoreFormApiController.js'
                        ]
                    });
                }]
            }
        })
        // Registration
        .state('registration', {
            url: "/registration.html",
            templateUrl: "views/registration.html",
            data: {
                pageTitle: 'Inschrijven'
            },
            controller: "RegistrationController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',
                            'js/services/playerListService.js',
                            'js/services/teamListService.js',
                            'js/services/registrationApi.js',
                            'js/services/eredivisiePlayersApi.js',
                            'js/services/transferperiodeservices.js',

                            'js/controllers/RegistrationController.js',
                            'js/controllers/RegistrationApiController.js'
                        ]
                    });
                }]
            }
        })

        // Stand new
        .state('standen', {
            url: "/standen.html",
            templateUrl: "views/standen.html",
            data: {
                pageTitle: 'De Stand'
            },
            controller: "TeamTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/roundsApi.js',

                            'js/controllers/TeamTableController.js',
                            'js/controllers/TeamTableApiController.js',

                            'js/services/teamTableApi.js'
                        ]
                    });
                }]
            }
        })

        // Stand new
        .state('eredivisieeindstand', {
            url: "/eredivisieeindstand.html",
            templateUrl: "views/eredivisieeindstand.html",
            data: {
                pageTitle: 'De Stand'
            },
            controller: "TeamTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/roundsApi.js',

                            'js/controllers/TeamTableController.js',
                            'js/controllers/TeamTableApiController.js',

                            'js/services/teamTableApi.js'
                        ]
                    });
                }]
            }
        })

        // Headlines
        .state('headlines', {
            url: "/headlines.html",
            templateUrl: "views/headlines.html",
            data: {
                pageTitle: 'Headlines'
            },
            controller: "HeadlinesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/controllers/HeadlinesController.js',
                            'js/controllers/HeadlinesApiController.js',

                            'js/services/headlinesApi.js'
                        ]
                    });
                }]
            }
        })

        // statistieken
        .state('statistieken', {
            url: "/statistieken.html",
            templateUrl: "views/statistieken.html",
            data: {
                pageTitle: 'Statistieken'
            },
            controller: "HeadlinesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/controllers/HeadlinesController.js',
                            'js/controllers/StatistiekenApiController.js',

                            'js/services/statistiekenApi.js'
                        ]
                    });
                }]
            }
        })

        // Predictions
        .state('predictions', {
            url: "/predictions/{id}",
            templateUrl: "views/predictions.html",
            data: {
                pageTitle: 'De Voorspellingen'
            },
            controller: "PredictionController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/controllers/PredictionController.js',
                            'js/controllers/PredictionApiController.js',

                            'js/services/predictionApi.js'
                        ]
                    });
                }]
            }
        })

        // HallofFame
        .state('halloffame', {
            url: "/halloffame.html",
            templateUrl: "views/halloffame.html",
            data: { pageTitle: 'Hall of Fame' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // spelregels
        .state('spelregels', {
            url: "/spelregels.html",
            templateUrl: "views/spelregels.html",
            data: { pageTitle: 'Spelregels' },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

   // Predictions
        .state('transferperiode', {
            url: "/transferperiode.html",
            templateUrl: "views/transferperiode.html",
            data: {
                pageTitle: 'Transfers'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/pages/css/profile.css',
                            '../../../assets/pages/css/tasks.css',

                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/pages/scripts/profile.js',

                            'js/services/playerListService.js',
                            'js/services/teamListService.js',
                            'js/services/transferperiodeservices.js',
                            'js/services/eredivisiePlayersApi.js',
                            'js/services/roundsApi.js',
                            'js/services/istransfermarktopen.services.js',
                            'js/controllers/GeneralPageController.js',
                            'js/controllers/TransferApiController.js'
                            ]
                    });
                }]
            }
        })


    lockProvider.init({
        clientID: 'WNjXlR4ChTqf2azaWhPk4MPzViNqoQft',
        domain: 'werner.eu.auth0.com',
        //  clientID: AUTH0_CLIENT_ID,
        // domain: AUTH0_DOMAIN,
        options: {
            autofocus: true,
            rememberLastLogin: true,
            socialButtonStyle: 'small',
            theme: {
                logo: '',
                primaryColor: "#97bf12"
            },
            languageDictionary: {
                emailInputPlaceholder: "please enter you email",
                title: "Super Eleven"
            },
            additionalSignUpFields: [
                {
                    name: "name",
                    placeholder: "Voornaam",
                    validator: function(name) {
                        return {
                            valid: name.length >= 1,
                            hint: "Voornaam is verplicht" // optional
                        };
                    }
                }, {
                    name: "family_name",
                    placeholder: "Achternaam",
                     validator: function(family_name) {
                        return {
                            valid: family_name.length >= 1,
                            hint: "Achternaam is verplicht" // optional
                        };
                    }
                },
                {
                    name: "city",
                    placeholder: "Woonplaats",
                     validator: function(city) {
                        return {
                            valid: city.length >= 1,
                            hint: "Woonplaats is verplicht" // optional
                        };
                    }
                }]
        }

    });

    // $urlRouterProvider.otherwise('/home');

    // Configuration for angular-jwt
    jwtOptionsProvider.config({
        tokenGetter: function() {
            return localStorage.getItem('id_token');
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/login'
    });

    // Add the jwtInterceptor to the array of HTTP interceptors
    // so that JWTs are attached as Authorization headers
    $httpProvider.interceptors.push('jwtInterceptor');


}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", '$anchorScroll', 'authService', 'lock', 'authManager',
    function($rootScope, settings, $state, $anchorScroll, authService, lock, authManager) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
        $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels

        // Put the authService on $rootScope so its methods
        // can be accessed from the nav bar
        $rootScope.authService = authService;

        // Register the authentication listener that is
        // set up in auth.service.js
        authService.registerAuthenticationListener();

        // Use the authManager from angular-jwt to check for
        // the user's authentication state when the page is
        // refreshed and maintain authentication
        authManager.checkAuthOnRefresh();
        // Register the synchronous hash parser
        // when using UI Router
        lock.interceptHash();


    }]);