define([
    'app',
    'moment',
    'cssloader!safe/alarmcenter/css/index',
], function(app, moment) {

    app.controller('alarmCenterController', ['$scope', '$state', '$stateParams', 'safeMainTitle', 'iAjax', 'iMessage', '$rootScope', 'iToken', 'safeSound',
        function($scope, $state, $stateParams, safeMainTitle, iAjax, iMessage, $rootScope, iToken, safeSound) {
            safeMainTitle.title = '报警中心';

            $scope.$on('alarmCenterControllerOnEvent', function() {
            });

            function _remind(level, title, content) {
                var message = {
                    id: new Date(),
                    level: level,
                    title: (title || '消息提醒'),
                    content: content
                };
                iMessage.show(message, false);
            }

        }
    ]);
});
