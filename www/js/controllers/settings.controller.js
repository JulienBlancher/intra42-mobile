angular.module('intra42.controllers')
    .controller('SettingsCtrl', function ($scope, $ionicHistory, $cordovaFile) {

        $scope.clearViewsCache = function () {
            $ionicHistory.clearCache();
        };

        $scope.clearDataCache = function () {
            $cordovaFile.removeRecursively(cordova.file.cacheDirectory, "");
        };

        $scope.clearAllCaches = function () {
            $scope.clearViewsCache();
        }
    });