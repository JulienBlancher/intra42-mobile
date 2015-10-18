angular.module('intra42.controllers')
    .controller('ProjectsCtrl', function ($rootScope, $scope, $localStorage, API42Interactions) {
        $scope.$watch('Authentication', function (n, o) {
            if (n === undefined) {
                return;
            }
            $scope.getProjects();
        }, true);

        $scope.projects = [];
        $scope.getProjects = function (page) {
            var user = $rootScope.Authentication.user;

            page = (page === undefined ? 1 : page);

            var cursusId = user.cursus[0].cursus.id;
            API42Interactions.run('GET', '/cursus/' + cursusId + '/projects?page=' + page).then(function (res) {
                // Handle pagination
                if (res.data.length) {
                    $scope.getProjects(page + 1);
                }
                console.log('Got projects');
                console.log(res);
                console.log(res.headers());
                var projects = res.data;
                projects.forEach(function (project) {
                    API42Interactions.run('GET', '/projects/' + project.slug).then(function (res) {
                        res.data.slug = project.slug;
                        $scope.projects.push(res.data);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            }).catch(function (err) {
                console.log(err);
            });
            $scope.$broadcast('scroll.refreshComplete');
        };

    });