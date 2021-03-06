angular.module('intra42.services', []).service('API42Interactions', function ($q, $http, $rootScope, $ionicAnalytics, ServicesAvailability) {
    this.run = function (method, route, datas) {
        ServicesAvailability.check();
        //Session.check();

        $ionicAnalytics.track('API42Interaction', {
                method: method,
                route: route,
                datas: datas
            }
        );

        console.log('run API42Interactions with token ' + $rootScope.Authentication.tokens.access_token);
        return $http({
            method: method,
            url: config.api42.baseUrl + route,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ($rootScope.Authentication.tokens.access_token || null)
            },
            withCredentials: true,
            data: datas
        }).error(function (data, status) {
            console.log("API42Interractions Error. Code : " + status + ". Data : " + data);
            console.log(data);
        });
    };

    this.oAuthenticate = function () {
        var deferred = $q.defer();
        var that = this;


        if (window.cordova) {
            var browserRef = window.open(config.api42.baseUrl + '/oauth/authorize?client_id=' + config.api42.client_id + '&redirect_uri=' + config.api42.callback + '&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
            browserRef.addEventListener('loadstart', function (event) {
                if ((event.url).indexOf(config.api42.callback) === 0) {
                    var code = (event.url).split('code=')[1];
                    console.log(code);

                    var authData = {
                        code: code,
                        grant_type: 'authorization_code',
                        client_id: config.api42.client_id,
                        client_secret: config.api42.client_secret,
                        redirect_uri: config.api42.callback
                    };

                    that.run('POST', '/oauth/token', authData).success(function (data) {
                        deferred.resolve(data);
                    }).error(function (data, status) {
                        deferred.reject('Problem authenticating');
                    }).finally(function () {
                        setTimeout(function () {
                            browserRef.close();
                        }, 10);
                    });
                }
            });
            browserRef.addEventListener('exit', function (event) {
                deferred.reject('The sign in flow was canceled');
            });
        } else {
            if (config.tmp.access_token) {
                deferred.resolve({access_token: config.tmp.access_token});
            } else {
                deferred.reject('Cannot authenticate via a web browser');
            }
        }
        return deferred.promise;
    };
});