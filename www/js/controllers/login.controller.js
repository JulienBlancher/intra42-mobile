angular.module('intra42.controllers')
    .controller('LoginCtrl', function ($rootScope, $scope, $state, $ionicLoading, $ionicUser, $ionicHistory, $localStorage, API42Interactions, Session) {

        console.log('Login Ctrl initialized');
        if ($state.current.name == 'login' && $rootScope.Authentication) {
            $state.go('app.dashboard');
        }

        $scope.showLoad = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple"></ion-spinner>'
            });
        };
        $scope.hideLoad = function () {
            $ionicLoading.hide();
        };

        $scope.doLogin = function () {
            $rootScope.Authentication = {
                tokens: {},
                user: {}
            };

            API42Interactions.oAuthenticate().then(function (tokens) {
                console.log("Response Object -> " + JSON.stringify(tokens));
                $rootScope.Authentication.tokens = tokens;
                API42Interactions.run('GET', '/me').then(function(user) {
                    var sessionData = {
                        user: user.data,
                        tokens: tokens
                    };

                    Session.create(sessionData);
                    $state.go('app.dashboard');
                }, function (err) {
                    $scope.error = 'There was an error getting your profile';
                });
            }, function (error) {
                $scope.hideLoad();
                $scope.error = 'There was an error logging you in :-(';
                console.log("Error -> " + error);
            });
        };

        // TODO revoque access token when implemented
        $scope.doLogout = function () {
            console.log('Logout requested');
            Session.destroy();
            $ionicHistory.clearCache();
            $state.go('login');
        };
    }
)
;