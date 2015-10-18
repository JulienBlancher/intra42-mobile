angular.module('intra42.services').service('Session', function ($q, $localStorage, $rootScope, $state, API42Interactions) {
    this.create = function (data) {
        console.log('Create Session');
        console.log(data);
        $localStorage.setObject('Session', data);
        $rootScope.Authentication = data;
    };

    this.destroy = function () {
        $localStorage.delete('Session');
        delete $rootScope.Authentication;
    };

    this.get = function () {
        $rootScope.Authentication = $localStorage.get('Session') || null;
        return $rootScope.Authentication;
    };

    this.update = function (key, data) {
        $rootScope.Authentication[key] = data;
        $localStorage.setObject('Session', $rootScope.Authentication);
        return $rootScope.Authentication;
    };

    this.check = function () {
        var that = this;
        var deferred = $q.defer();

        console.log('Session check');

        var session = $localStorage.get('Session');

        if (session) {
            session = JSON.parse(session);

            if (!$rootScope.Authentication || !Object.keys($rootScope.Authentication).length) {
                console.log('Session found and set');
                $rootScope.Authentication = session;
            }

            // Check server-side session
            API42Interactions.run('GET', '/oauth/token/info').then(function (res) {
                console.log('token info');
                console.log(res);
                deferred.resolve(session);
            }).catch(function (err) {
                console.log('error validating token');
                console.log(err);
                // Token not valid anymore
                if (err.status == 401) {
                    console.log('token invalid, refreshing...');
                    if ($rootScope.Authentication.tokens.refresh_token) {
                        var refreshData = {
                            refresh_token: $rootScope.Authentication.tokens.refresh_token,
                            grant_type: "refresh_token",
                            client_id: config.api42.client_id,
                            client_secret: config.api42.client_secret,
                            redirect_uri: config.api42.callback
                        };
                        API42Interactions.run('POST', '/oauth/token', refreshData).then(function (tokens) {
                            that.update('tokens', tokens);
                            that.check();
                        }).catch(function (err) {
                            that.destroy();
                            deferred.reject('No session');
                        });
                    } else {
                        that.destroy();
                        deferred.reject('No session');
                    }
                }
            });

        } else {
            console.log('No session');
            $state.go('login');
            deferred.reject('No session');
        }
        return deferred.promise;
    };

});