angular.module('intra42.services', [])
    .service('API42Interactions', function ($http, $ionicAnalytics, ConnectionManager) {
        this.run = function (method, route, datas) {
            ConnectionManager.check();
            $ionicAnalytics.track('API42Interaction', {
                    method: method,
                    route: route,
                    datas: datas
                }
            );
            return $http({
                method: method,
                url: 'https://api.intrav2.42.fr' + route + '?token=' + config.api42.token,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
                data: datas
            }).error(function (data, status) {
                console.log("API42Interractions Error. Code : " + status + ". Data : " + data);
            });
        };
    })

    .service('LdapInteractions', function ($http, $ionicAnalytics, ConnectionManager) {
        this.run = function (method, route, datas) {
            ConnectionManager.check();
            $ionicAnalytics.track('LdapInteractions', {
                    method: method,
                    route: route,
                    datas: datas
                }
            );
            return $http({
                method: method,
                url: 'http://ldapapi.triche.io' + route,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
                data: datas
            }).error(function (data, status) {
                console.log("LdapInteraction Error. Code : " + status + ". Data : " + data);
                console.log(data);
            });
        };
    })

    .service('ConnectionManager', function ($rootScope, $ionicPopup) {
        this.check = function () {
            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE && !$rootScope.connectionAlert) {
                    $rootScope.connectionAlert = true;
                    $ionicPopup.alert({
                        title: "No internet connexion",
                        content: "Internet is needed to use this application"
                    }).then(function () {
                        $rootScope.connectionAlert = false;
                    });
                }
            }
        };
    })

    .factory('$localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key) {
                return $window.localStorage[key] || '';
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || null);
            },
            delete: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }])
;