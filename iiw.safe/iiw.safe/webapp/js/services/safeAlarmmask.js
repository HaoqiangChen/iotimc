/**
 * 统一音频播放服务。
 *
 * Created by YJJ on 2015-12-11.
 */
define([
    'app'
], function(app) {
    app.factory('safeAlarmmask', ['$timeout', '$rootScope', function($timeout, $rootScope) {
        $('body').append('<div class="safe-main-alarm layout-full"><div class="table layout-full"><div class="table-cell"><div><p></p></div></div></div></div>');

        var $e = $('.safe-main-alarm'),
            target = null;

        $e.click(function() {
            _hide();
        });

        function _show(text, color, timeout) {
            if(!timeout && timeout != 0) {
                timeout = 5000;
            }

            $rootScope.$broadcast('safeAlarmMaskShowEvent');

            $e.find('style').remove();
            if(color) {
                var bg = 'linear-gradient(135deg, ' + color + ' 25%, black 0, black 50%, ' + color + ' 0, ' + color + ' 75%, black 0)';
                $e.append('<style> .safe-main-alarm::before {  background-image: ' + bg + '; } </style>')
            }

            $e.find('p').html(text);

            $e.stop(true).fadeIn(500);

            if(target) $timeout.cancel(target);
            if(timeout != 0) {
                target = $timeout(function() {
                    target = null;
                    _hide();
                }, timeout);
            }
        }

        function _hide() {
            $e.stop(true).fadeOut(1000);
            if(target) $timeout.cancel(target);
            target = null;

            $rootScope.$broadcast('safeAlarmMaskHideEvent');
        }

        return {
            show: _show,
            hide: _hide
        };
    }]);
});