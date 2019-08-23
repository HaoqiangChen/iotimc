define([
    'app'
], function(app) {
    app.directive('safeBidUserContent', [function() {
        return {
            restrict: 'A',
            scope: true,
            link: function($scope) {
                $scope.imgStyle = {
                    'background-image': 'url(' + $.soa.getWebPath('iiw.safe.plugins.bid') + '/img/user.jpg' + ')'
                };
                if($scope.userInfo) {
                    $scope.username = $scope.userInfo.name;

                    if($scope.userInfo.photo) {
                        $scope.imgStyle = {
                            'background-image': 'url(' + $scope.userInfo.photo + ')'
                        }
                    }
                }
            }
        }
    }]);
});