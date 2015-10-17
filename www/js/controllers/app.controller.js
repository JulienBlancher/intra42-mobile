angular.module('intra42.controllers', []).controller('AppCtrl', function (Session) {

    Session.check();
});