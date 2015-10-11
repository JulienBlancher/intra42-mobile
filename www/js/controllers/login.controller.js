angular.module('intra42.controllers')
    .controller('LoginCtrl', function ($rootScope, $scope, $location, $ionicLoading, $ionicUser, $ionicHistory, $localStorage, API42Interactions) {

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
                $rootScope.access_token = result.access_token;
                API42Interactions.run('GET', '/me').then(function(res) {
                    $ionicUser.identify({
                        user_id: res.data.id.toString(),
                        name: res.data.login,
                        display_name: res.data.display_name,
                        image: res.data.image_url,
                        last_log: new Date().toString()
                    });
                    $localStorage.setObject('user', res.data);
                    $scope.hideLoad();
                    $location.path('/app/dashboard');
                }, function (err) {
                    $scope.error = 'There was an error getting your profile';
                });
            }, function (error) {
                $scope.hideLoad();
                $scope.error = 'There was an error logging you in :-(';
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