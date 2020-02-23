define([
    'app',
    'moment',
    'cssloader!safe/webgl/css/index',
], function(app, moment) {

    app.controller('webGLController', ['$scope', '$state', '$stateParams', 'safeMainTitle', 'iAjax', 'iMessage', '$rootScope', 'iToken', 'safeSound',
        function($scope, $state, $stateParams, safeMainTitle, iAjax, iMessage, $rootScope, iToken, safeSound) {
            safeMainTitle.title = '三维模型';

            $scope.$on('webGLControllerOnEvent', function() {
            });

        }
    ]);
});
