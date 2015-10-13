angular.module('intra42.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicUser, $location, $localStorage) {

        $scope.$on('$ionicView.enter', function () {
            // Is user logged in ?
            $rootScope.Authentication.user = $localStorage.getObject('user');
            if (!$rootScope.Authentication.user || !Object.keys($rootScope.Authentication.user).length) {
                $location.path('/login');
            } else {
                $ionicUser.identify({
                    user_id: $rootScope.Authentication.user.id.toString(),
                    last_log: new Date().toString()
                });
            }
        });

    });