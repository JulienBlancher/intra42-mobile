angular.module('intra42.services').service('Session', function ($localStorage, $rootScope, $state) {
    this.create = function (data) {
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
        var session = $localStorage.get('Session');

        console.log(session);
        if (!session) {
            $state.go('login');
            return null;
        } else if (session && (!$rootScope.Authentication || !Object.keys($rootScope.Authentication).length)) {
            $rootScope.Authentication = session;
        } else {
            return session;
        }
    };
});