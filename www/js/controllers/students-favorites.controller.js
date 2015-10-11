angular.module('intra42.controllers')
    .controller('StudentsFavoritesCtrl', function ($scope, $stateParams, $localStorage, API42Interactions) {

        $scope.$on('$ionicView.enter', function () {
            $scope.favorites = $localStorage.getObject('favoritesStudents') || [];
            $scope.search = '';
            $scope.refreshFavorites();
            $scope.favoriteDetails = '';
        });

        $scope.refreshFavorites = function () {
            if (!$scope.favorites)
                $scope.favorites = $localStorage.getObject('favoritesStudents') || [];
            for (var i = 0; i < $scope.favorites.length; i++) {
                (function (i) {
                    API42Interactions.run('GET', '/users/' + $scope.favorites[i].login).then(function (favorite) {
                        $scope.favorites[i] = favorite.data;
                        $localStorage.setObject('favoritesStudents', $scope.favorites);
                    });
                })(i);
            }
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.isFavorite = function () {
            if (!$scope.favorites.length)
                return false;
            for (var i = 0; i < $scope.favorites.length; i++) {
                if ($scope.favorites[i].login == $scope.student.login)
                    return true;
            }
        };

        $scope.removeFromFavorites = function (login, $event) {

            if (typeof($event) != 'undefined')
                $event.stopPropagation();

            var favorites = $scope.favorites;
            for (var i in favorites) {
                if (favorites.hasOwnProperty(i) && favorites[i].login == login) {
                    favorites.splice(i, 1);
                    $localStorage.setObject('favoritesStudents', favorites);
                }
            }
        };

        $scope.addToFavorites = function () {
            $scope.favorites.push($scope.student);
            $localStorage.setObject('favoritesStudents', $scope.favorites);
        };
    });
