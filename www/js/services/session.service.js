angular.module('intra42.services').service('Session', function ($localStorage, $rootScope, $state) {
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

    this.check = function () {
        console.log('Session check');

        var session = JSON.parse($localStorage.get('Session'));

        if (!session) {
            $state.go('login');
            return null;
        } else if (session && (!$rootScope.Authentication || !Object.keys($rootScope.Authentication).length)) {
            console.log('Session found and set');
            $rootScope.Authentication = session;
        } else {
            return session;
        }
    };
});