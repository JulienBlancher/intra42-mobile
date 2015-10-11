angular.module('intra42.controllers')
    .controller('TopicCtrl', function ($scope, $stateParams, API42Interactions) {

        API42Interactions.run('GET', '/topics/' + $stateParams.topicId).then(function (res) {
            var topic = res.data;
            topic.mainMessage = topic.messages[0];
            topic.messages.splice(0, 1);
            $scope.topic = topic;
        });
    });