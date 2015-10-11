angular.module('intra42.controllers')
    .controller('StudentsSearchCtrl', function ($scope, $stateParams, $localStorage, API42Interactions) {

        $scope.$on('$ionicView.enter', function () {
            $scope.favorites = $localStorage.getObject('favoritesStudents') || [];
        });

        $scope.initSearch = function () {
            $scope.searchData = {};
            $scope.student = null;

            $scope.favorites = $localStorage.getObject('favoritesStudents') || [];

            $scope.$watch('searchData.login', function () {
                if ($scope.searchData.login)
                    $scope.searchData.login = $scope.searchData.login.toLowerCase().replace(/\s+/g, '');
            });

            if ($stateParams.login) {
                $scope.searchData.login = $stateParams.login;
                $scope.searchUser();
            }
        };

        $scope.addToFavorites = function () {
            $scope.favorites.push($scope.student);
            $localStorage.setObject('favoritesStudents', $scope.favorites);
        };

        $scope.isFavorite = function () {
            if (!$scope.favorites.length || !$scope.student)
                return false;
            for (var i = 0; i < $scope.favorites.length; i++) {
                if ($scope.favorites[i].login == $scope.student.login) {
                    return true;
                }
            }
        };

        $scope.removeFromFavorites = function () {

            for (var i = 0; i < $scope.favorites.length; i++) {
                if ($scope.favorites[i].login == $scope.student.login) {
                    $scope.favorites.splice(i, 1);
                    $localStorage.setObject('favoritesStudents', $scope.favorites);
                    $scope.isFavorite();
                    return;
                }
            }
        };

        $scope.searchUser = function () {
            $scope.error = null;
            $scope.student = null;
            $scope.searching = true;
            API42Interactions.run('GET', '/users/' + $scope.searchData.login).then(function (res) {
                if (typeof(res.data) != 'object') {
                    $scope.searching = false;
                    $scope.error = 'Wrong login'
                } else {
                    $scope.searching = false;
                    $scope.student = res.data;
                    $scope.searchData.login = null;
                }
            }, function () {
                $scope.searching = false;
                $scope.error = 'Wrong login'
            });
        };
    });