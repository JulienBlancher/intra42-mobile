angular.module('intra42.controllers')
    .controller('ProjectCtrl', function ($scope, $stateParams, $localStorage, $cordovaFileTransfer, API42Interactions, PDFViewerService) {

        var pdf = PDFViewerService;
        $scope.project = {};

        $scope.$watch('Authentication', function (n, o) {
            if (n === undefined) {
                return;
            }
            $scope.getProject();
        }, true);

        $scope.getProject = function () {
            $scope.pdfURL = null;
            $scope.instance = null;

            API42Interactions.run('GET', '/projects/' + $stateParams.projectSlug).then(function (res) {
                $scope.project = res.data;
                console.log(res.data);
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.getProjectTeam = function () {
            var user = $localStorage.getObject('user');
            //TODO. For now, all users in team in project in user are null
        };

        $scope.hasPDF = function () {
            console.log($scope.project.attachments);
            if (!$scope.project.attachments || !$scope.project.attachments.length) {
                return false;
            }
            for (var i = 0, len = $scope.project.attachments.length; i < len; i++) {
                var attachment = $scope.project.attachments[i];
                if (attachment.link.substr(attachment.link.length - 4) == '.pdf' && attachment.link.substr(attachment.link.length - 7) != '.ro.pdf') {
                    return true;
                }
            }
        };

        $scope.hasElearning = function () {
            if (!$scope.project.attachments) {
                return false;
            }
            for (var i = 0, len = $scope.project.attachments.length; i < len; i++) {
                var attachment = $scope.project.attachments[i];
                if (attachment.kind == 'link') {
                    return true;
                }
            }
        };

        $scope.getProjectSlug = function (url) {
            // Url looks like https://api.42.fr/projects/project-slug
            return url.match(new RegExp("^https?:\/\/[a-z0-9\.]+\/projects\/(.*)\/?$"))[1];
        };


        // Project PDF
        $scope.loadSubject = function () {
            if ($scope.instance)
                return;

            $scope.instance = pdf.Instance("viewer");

            console.log($scope.project);
            for (var i = 0, len = $scope.project.attachments.length; i < len; i++) {
                if ($scope.project.attachments[i].link.substr($scope.project.attachments[i].link.length - 4) == '.pdf' && $scope.project.attachments[i].link.substr($scope.project.attachments[i].link.length - 7) != '.ro.pdf') {
                    console.log('link: ' + $scope.project.attachments[i].link);
                    if ($scope.project.attachments[i].link[i] == '/') {
                        $scope.project.attachments[i].link = 'https://projects.intrav2.42.fr' + $scope.project.attachments[i].link;
                    }
                    $cordovaFileTransfer.download($scope.project.attachments[i].link, cordova.file.cacheDirectory + btoa($scope.project.name) + '.pdf', {}, true).then(function (res) {
                        $scope.pdfURL = res.nativeURL;
                        console.log('file downloaded');
                        console.log(res);
                    }, function (err) {
                        console.log('err downloading file');
                        console.log(err);
                    }, function (progress) {
                        $scope.progress = ((progress.loaded / progress.total) * 100).toFixed();
                        console.log((progress.loaded / progress.total) * 100);
                    });
                    return;
                }
            }
        };

        $scope.nextPage = function () {
            $scope.instance.nextPage();
        };

        $scope.prevPage = function () {
            $scope.instance.prevPage();
        };

        $scope.gotoPage = function (page) {
            $scope.instance.gotoPage(page);
        };

        $scope.pageLoaded = function (curPage, totalPages) {
            $scope.currentPage = curPage;
            $scope.totalPages = totalPages;
        };

        $scope.loadProgress = function (loaded, total, state) {
            $scope.progress = (loaded / total * 100).toFixed();
            console.log('loaded =', loaded, 'total =', total, 'state =', state);
        };
    });