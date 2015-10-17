angular.module('intra42.controllers')
    .controller('LoginCtrl', function ($rootScope, $scope, $location, $ionicLoading, $ionicUser, $ionicHistory, $localStorage, API42Interactions, Session) {

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
                    $scope.hideLoad();
                    $location.path('/app/dashboard');
                }, function (err) {
                    $scope.error = 'There was an error getting your profile';
                });
            }, function (error) {
                $scope.hideLoad();
                $scope.error = 'There was an error logging you in :-(';
                console.log("Error -> " + error);
            });
        };

        $scope.doLogout = function () {
            Session.destroy();

            $localStorage.delete('userProjects');
            $localStorage.delete('userSkills');
            $localStorage.delete('defenses');
            delete $scope.userProjects;
            delete $scope.userSkills;
            delete $scope.defenses;
            $ionicHistory.clearCache();
            $location.path('/login');
        };
    }
)
;