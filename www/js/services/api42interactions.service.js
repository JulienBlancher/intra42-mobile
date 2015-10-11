angular.module('intra42.services', []).service('API42Interactions', function ($q, $http, $rootScope, $ionicAnalytics, ServicesAvailability) {
    this.run = function (method, route, datas) {
        ServicesAvailability.check();
        $ionicAnalytics.track('API42Interaction', {
                method: method,
                route: route,
                datas: datas
            }
        );
        return $http({
            method: method,
            url: config.api42.baseUrl + route + '?token=' + config.api42.token,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + $rootScope.access_token || null
            },
            withCredentials: true,
            data: datas
        }).error(function (data, status) {
            console.log("API42Interractions Error. Code : " + status + ". Data : " + data);
        });
    };

    this.oAuthenticate = function () {
        var deferred = $q.defer();
        var that = this;

        if (window.cordova) {
            var browserRef = window.open(config.api42.baseUrl + '/oauth/authorize?client_id=' + config.api42.client_id + '&redirect_uri=' + config.api42.callback + '&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
            browserRef.addEventListener('loadstart', function (event) {
                if ((event.url).indexOf(config.api42.callback) === 0) {
                    var requestToken = (event.url).split('code=')[1];
                    console.log(requestToken);

                    var authData = {
                        code: requestToken,
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
            deferred.reject('Cannot authenticate via a web browser');
        }
        return deferred.promise;
    };
});