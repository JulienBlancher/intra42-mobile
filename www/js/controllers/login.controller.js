angular.module('intra42.controllers')
    .controller('LoginCtrl', function ($scope, $location, $ionicLoading, $ionicUser, $ionicHistory, $localStorage, API42Interactions) {

        $scope.showLoad = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple"></ion-spinner>'
            });
        };
        $scope.hideLoad = function () {
            $ionicLoading.hide();
        };

        $scope.doLogin = function () {

            API42Interactions.oAuthenticate().then(function (result) {
                console.log("Response Object -> " + JSON.stringify(result));
                //$ionicUser.identify({
                    //                        user_id: res.data.id.toString(),
                    //                        name: res.data.login,
                    //                        display_name: res.data.display_name,
                    //                        image: res.data.image_url,
                    //                        last_log: new Date().toString()
                    //                    });
                    //                    $localStorage.setObject('user', res.data);
                    //                    $location.path('/app/dashboard');
            }, function (error) {
                console.log("Error -> " + error);
            });
        };

        $scope.doLogout = function () {
            $localStorage.delete('user');
            $localStorage.delete('userProjects');
            $localStorage.delete('userSkills');
            $localStorage.delete('defenses');
            delete $scope.user;
            delete $scope.userProjects;
            delete $scope.userSkills;
            delete $scope.defenses;
            $ionicHistory.clearCache();
            $location.path('/login');
        };
    }
)
;