angular.module('intra42.controllers')
    .controller('DashboardCtrl', function ($scope, $rootScope, $localStorage, $state, API42Interactions) {

        $scope.refresh = function () {
            $scope.$broadcast('scroll.refreshComplete');
        };

    });