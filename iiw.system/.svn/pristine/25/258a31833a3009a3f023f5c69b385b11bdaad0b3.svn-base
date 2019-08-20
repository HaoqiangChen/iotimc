/**
 * 设备图标指令
 * Created by hj in 2019-07-15.
 */
define(['app'], function(app) {
    app.directive('systemDataxIcon', [function() {
        return {
            restrict: 'E',
            template: '<i class="fa"></i>',
            replace: true,
            link: function(scope, element, tAttrs) {
                switch (tAttrs.type) {
                    case 'monitor':
                        $(element).addClass('fa-camera');
                        break;
                    case 'light':
                        $(element).addClass('fa-lightbulb-o');
                        break;
                    case 'door':
                        $(element).addClass('fa-unlock');
                        break;
                    case 'alarm':
                        $(element).addClass('fa-warning');
                        break;
                    case 'talk':
                        $(element).addClass('fa-microphone');
                        break;
                    case 'broadcast':
                        $(element).addClass('fa-bullhorn');
                        break;
                    case 'tv':
                        $(element).addClass('fa-tv');
                        break;
                    default:
                        $(element).addClass('fa-tag');
                        break;
                }
            }
        }
    }]);
});