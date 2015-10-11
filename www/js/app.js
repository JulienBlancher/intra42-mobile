// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('intra42', ['ngCordova', 'ionic', 'ionic.service.core', 'ionic.service.analytics', 'intra42.controllers', 'intra42.services', 'intra42.filters', 'intra42.directives', 'ngPDFViewer'])

    .run(function ($ionicPlatform, $ionicAnalytics, ServicesAvailability) {
        $ionicPlatform.ready(function () {

            // In-app update disabled for now because of Android issues .
            ServicesAvailability.check();
            $ionicAnalytics.register();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($compileProvider, $stateProvider, $urlRouterProvider, $ionicAppProvider) {

        // Define allowed links
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|sms)?:?/);

        // Identify app
        $ionicAppProvider.identify({
            app_id: '40583840',
            api_key: 'e48927b797124a8d21cb892c21002b26ffd503f1ae0147a2'
        });

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: "LoginCtrl"
            })

            .state('app.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/dashboard.html",
                        controller: "DashboardCtrl"
                    }
                }
            })

            .state('app.projects', {
                url: "/projects",
                views: {
                    'menuContent': {
                        templateUrl: "templates/projects.html",
                        controller: "ProjectsCtrl"
                    }
                }
            })

            .state('app.project', {
                url: "/projects/:projectSlug",
                views: {
                    'menuContent': {
                        templateUrl: "templates/project.html",
                        controller: "ProjectCtrl"
                    }
                }
            })

            .state('app.forum', {
                url: "/forum",
                views: {
                    'menuContent': {
                        templateUrl: "templates/forum.html",
                        controller: 'ForumCtrl'
                    }
                }
            })

            .state('app.topic', {
                url: "/forum/:topicId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/topic.html",
                        controller: 'TopicCtrl'
                    }
                }
            })

            .state('app.students-search', {
                url: "/students/search/:login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/students-search.html",
                        controller: 'StudentsSearchCtrl'
                    }
                },
                params: {
                    login: {value: null, squash: true} //The parameter's default value is omitted from the URL
                }
            })

            .state('app.students-favorites', {
                url: "/students/favorites",
                views: {
                    'menuContent': {
                        templateUrl: "templates/students-favorites.html",
                        controller: 'StudentsFavoritesCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
            })
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/dashboard');
    });
