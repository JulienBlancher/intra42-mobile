angular.module('intra42.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicUser, $location, $localStorage) {

        $scope.$on('$ionicView.enter', function () {
            // Is user logged in ?
            $scope.user = $localStorage.getObject('user');
            if (!$scope.user || !Object.keys($scope.user).length) {
                $location.path('/login');
            } else {
                $ionicUser.identify({
                    user_id: $scope.user.id.toString(),
                    last_log: new Date().toString()
                });
            }
        });

    });