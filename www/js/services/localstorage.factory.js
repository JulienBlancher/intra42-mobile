angular.module('intra42.services').factory('$localStorage', ['$window', function ($window) {
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