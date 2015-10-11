angular.module('intra42.controllers')
    .controller('DashboardCtrl', function ($scope, $localStorage, API42Interactions) {

        $scope.$on('$ionicView.enter', function () {

            // Is user logged in ?
            $scope.user = $localStorage.getObject('user');
            if (!$scope.user || !Object.keys($scope.user).length) {
                $location.path('/login');
            } else {
                $scope.getSkills();
                $scope.getProjects();
                $scope.getDefenses();
                $scope.getUser(); // refresh user
            }
        });

        $scope.refresh = function () {
            $scope.getDefenses();
            $scope.getUser();
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.getUser = function () {
            // Update user
            API42Interactions.run('GET', '/users/' + $scope.user.login).then(function (res) {
                if (!angular.equals($scope.user, res.data)) {
                    $scope.user = res.data;
                    $localStorage.setObject('user', res.data);
                    $localStorage.setObject('userSkills', res.data.cursus[0].skills);
                    $scope.getSkills();
                    $scope.getProjects();
                }
            });
        };

        $scope.getDefenses = function () {
            $scope.defenses = $localStorage.getObject('defenses') || [];

            API42Interactions.run('GET', '/users/' + $scope.user.login + '/scale_teams').then(function (res) {
                var defenses = res.data;
                for (var i = 0, len = defenses.length; i < len; i++) {
                    var defense = defenses[i];
                    if (defense.final_mark && !defense.truant) {
                        (function (defense) {
                            API42Interactions.run('GET', '/projects/' + defense.team.project_id).then(function (res) {
                                defense.project = res.data;
                                API42Interactions.run('GET', '/teams/' + defense.team.id).then(function (res) {
                                    defense.team.users = res.data.users;
                                    if (!angular.equals($scope.defenses, defenses)) {
                                        $scope.defenses = defenses;
                                        $localStorage.setObject('defenses', $scope.defenses);
                                    }
                                });
                            });
                        })(defense);
                    }
                }
            });
        };

        $scope.getSkills = function () {
            $scope.skills = $localStorage.getObject('userSkills') || [];
        };

        $scope.getProjects = function () {
            $scope.projects = $localStorage.getObject('userProjects') || [];

            var userProjects = angular.copy($scope.user.cursus[0].projects);

            for (var i = 0, len = userProjects.length; i < len; i++) {
                // 115 is for the "Partnerships" project, which is always open
                if (userProjects[i].final_mark === null && userProjects[i].id != 115) {
                    var project = userProjects[i];
                    for (var j = 0, len2 = project.teams.length; j < len2; j++) {
                        if (project.teams[j].closed_at === null || project.teams[j].final_mark === null) {
                            (function (project) {
                                var projectUrl = project.url.match(new RegExp("https?://[a-z0-9\.]+(.*)"))[1];
                                API42Interactions.run('GET', projectUrl).then(function (res) {
                                    project = {
                                        id: project.id,
                                        name: res.data.name,
                                        parent: res.data.parent,
                                        url: project.url
                                    };
                                    if (!project.parent) { // main project
                                        var found = false;
                                        for (var k = 0, len3 = $scope.projects.length; k < len3; k++) {
                                            if ($scope.projects[k].id == project.id && !angular.equals($scope.projects[k], project)) {
                                                console.log('same project');
                                                $scope.projects[k] = project;
                                            } else if ($scope.projects[k].id == project.id) {
                                                found = true;
                                            }
                                        }
                                        if (!$scope.projects.length || !found)
                                            $scope.projects.push(project);
                                        $localStorage.setObject('userProjects', $scope.projects)
                                    }
                                });
                            })(project);
                            break;
                        }
                    }
                }
            }
            // ! Find Current Projects
        };

        $scope.getProjectSlug = function (url) {
            // Url looks like https://api.42.fr/projects/project-slug
            return url.match(new RegExp("^https?:\/\/[a-z0-9\.]+\/projects\/(.*)\/?$"))[1];
        };
    });