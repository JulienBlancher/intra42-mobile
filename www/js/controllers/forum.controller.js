angular.module('intra42.controllers')
    .controller('ForumCtrl', function ($scope, $localStorage, API42Interactions) {
        var oneMonthBefore = new Date();
        oneMonthBefore.setDate(oneMonthBefore.getDate() - 30);
        if (!$scope.topics)
            $scope.topics = [];

        var cursusId = $localStorage.getObject('user').cursus[0].id;
        //var cursusId = 1; // For now, topics are all under the same cursus
        API42Interactions.run('GET', '/cursus/' + cursusId + '/topics').then(function (res) {
            var topics = res.data;
            topics.forEach(function (topic) {
                if (new Date(topic.updated_at) > oneMonthBefore) {
                    API42Interactions.run('GET', '/users/' + topic.author.login).then(function (res) {
                        topic.author.image_url = res.data.image_url;
                        $scope.topics.push(topic);
                    });
                }
            });
        });
    });