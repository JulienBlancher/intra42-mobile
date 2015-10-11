angular.module('intra42.controllers')
    .controller('LoginCtrl', function ($scope, $location, $ionicLoading, $ionicUser, $ionicHistory, $localStorage, API42Interactions, LdapInteractions) {

        $scope.showLoad = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple"></ion-spinner>'
            });
        };
        $scope.hideLoad = function () {
            $ionicLoading.hide();
        };

        $scope.loginData = {
            login: '',
            autologin: '',
            password: '',
            year: '2013',
            pool: 'july'
        };
        $scope.$watch('loginData.login', function () {
            if ($scope.loginData.login)
                $scope.loginData.login = $scope.loginData.login.toLowerCase().replace(/\s+/g, '');
        });

        $scope.doLogin = function () {
            var login = $scope.loginData.login.trim();
            var autologin = $scope.loginData.autologin.trim();
            var password = $scope.loginData.password.trim();
            var year = $scope.loginData.year.trim();
            var pool = $scope.loginData.pool.trim();

            delete $scope.error;
            $scope.showLoad();

            // Apple demo account
            if (login == 'appledemo' && password == config.accounts.appledemo) {
                API42Interactions.run('GET', '/users/jblanche').then(function (res) {
                    $scope.hideLoad();
                    // IOS check. Because IOS always uses the success callback
                    if (typeof(res.data) != 'object') {
                        $scope.error = 'Unexpected error, please retry or contact us';
                    } else {
                        $ionicUser.identify({
                            user_id: '00000',
                            name: 'AppleDemo',
                            last_log: new Date().toString()
                        });
                        $localStorage.setObject('user', res.data);
                        $location.path('/app/dashboard');
                    }
                }, function () {
                    $scope.hideLoad();
                    $scope.error = 'Unexpected error, please retry or contact us';
                });
                return;
            }

            LdapInteractions.run('POST', '/tokens', 'login=' + login).then(function (res) {
                var encrypted = CryptoJS.AES.encrypt(password, res.data.token, {format: JsonFormatter});
                // convert CipherParams object to json string for transmission
                var encrypted_json_str = encrypted.toString();
                LdapInteractions.run('POST', '/auth', 'login=' + login + '&password=' + encrypted_json_str + '&pool=' + pool + '&year=' + year).then(function (res) {
                    if (!res.data.success) {
                        $scope.hideLoad();
                        $scope.error = 'Wrong Login';
                    } else {
                        API42Interactions.run('GET', '/users/' + (autologin == '' ? login : autologin)).then(function (res) {
                            $scope.hideLoad();
                            // IOS check. Because IOS always uses the success callback
                            if (typeof(res.data) != 'object') {
                                $scope.error = 'Unexpected error, please retry or contact us';
                            } else {
                                $ionicUser.identify({
                                    user_id: res.data.id.toString(),
                                    name: res.data.login,
                                    display_name: res.data.display_name,
                                    image: res.data.image_url,
                                    last_log: new Date().toString()
                                });
                                $localStorage.setObject('user', res.data);
                                $location.path('/app/dashboard');
                            }
                        }, function () {
                            $scope.hideLoad();
                            $scope.error = 'Unexpected error, please retry or contact us';
                        });
                    }
                }, function () {
                    $scope.hideLoad();
                    $scope.error = 'Wrong login'
                });
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
    });