angular.module('intra42.controllers')
    .controller('DashboardCtrl', function ($scope, $rootScope, $localStorage, $state, API42Interactions) {
        $scope.$watch('Authentication', function (n, o) {
            if (n === undefined) {
                return;
            }
            $scope.skills = $rootScope.Authentication.user.cursus[0].skills;
            $scope.projects = getProjects();
        }, true);

        function getProjects() {
            var userProjects = $rootScope.Authentication.user.cursus[0].projects;
            var currentProjects = [];

            for (var i = 0; i < userProjects.length; i++) {
                if (userProjects[i].final_mark === null) {
                    currentProjects.push(userProjects[i]);
                }
            }
            return currentProjects;
        }

        $scope.refresh = function () {
            $scope.$broadcast('scroll.refreshComplete');
        };

    });