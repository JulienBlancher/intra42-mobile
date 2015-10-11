angular.module('intra42.controllers')
    .controller('ProjectsCtrl', function ($scope, $localStorage, API42Interactions) {
        var user = $localStorage.getObject('user');

        $scope.getProjectSlug = function (url) {
            // Url looks like https://api.42.fr/projects/project-slug
            return url.match(new RegExp("^https?:\/\/[a-z0-9\.]+\/projects\/(.*)\/?$"))[1];
        };

        $scope.projects = [];
        $scope.getProjects = function() {
            var cursusId = user.cursus[0].id;
            API42Interactions.run('GET', '/cursus/' + cursusId + '/projects').then(function (res) {
                var projects = res.data;
                projects.forEach(function (project) {
                    var projectSlug = $scope.getProjectSlug(project.url);
                    API42Interactions.run('GET', '/projects/' + projectSlug).then(function (res) {
                        res.data.slug = projectSlug;
                        $scope.projects.push(res.data);
                    })
                });
            });
            $scope.$broadcast('scroll.refreshComplete');
        }
    });