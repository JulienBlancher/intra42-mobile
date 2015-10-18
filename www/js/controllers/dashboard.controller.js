angular.module('intra42.controllers')
    .controller('DashboardCtrl', function ($scope, $rootScope, $localStorage, $state, API42Interactions) {

        $scope.skills = $rootScope.Authentication.user.cursus[0].skills;

        $scope.refresh = function () {
            $scope.$broadcast('scroll.refreshComplete');
        };

    });