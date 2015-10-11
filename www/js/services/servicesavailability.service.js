angular.module('intra42.services').service('ServicesAvailability', function ($rootScope, $ionicPopup) {
    this.check = function () {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE && !$rootScope.connectionAlert) {
                $rootScope.connectionAlert = true;
                $ionicPopup.alert({
                    title: "No internet connection",
                    content: "Internet is needed to use this application"
                }).then(function () {
                    $rootScope.connectionAlert = false;
                });
            }
        }
    };
});