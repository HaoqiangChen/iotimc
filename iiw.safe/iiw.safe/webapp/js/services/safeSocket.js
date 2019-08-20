/**
 * socket接收转发类。
 *
 * Created by YJJ on 2015-12-07.
 */
define([
    'app'
], function(app) {
    app.factory('safeSocket', ['$rootScope', 'iSocket', function($rootScope, iSocket) {
        function _init() {
            // 登陆后自动连接ws；
            iSocket.connect();

            /*
            // system
            listener('systemStartError');

            // module
            listener('alarmHandle');
            listener('talkHandle');
            listener('doorChangeRequest');
            listener('remindReportHandle');
            listener('updateToDo');
            listener('exeTimelineBefore');
            listener('exeTimeline');
            listener('stargetUpdate');
            listener('executeHandle');
            listener('bigmonitorthemeUpdate');
            listener('informationHandle');
            listener('htjrHandle');
            listener('roomfacediscern');
            listener('ExcDuty');
            listener('openDoorApp');
            listener('areaPersonChange');
            listener('swipeCardEvent');
            listener('positionHandle');
            listener('rollcallHandle');
            listener('monitorPatrolCall');

            // temp
            listener('tmpReqeuestOpenDoor');

            function listener(eventName) {
                iSocket.on(eventName, function(data) {
                    broadcast(eventName, data);
                });
            }
            */

            // 2016-06-03
            // yjj
            // 屏蔽以上ws监听方式，默认采用全接收并转发到Angular消息队列中，再由各业务模块监听处理（业务模块不需要改动，跟原来一样）。
            // 1.减少因不记得在这里增加监听方法而导致浪费调试时间的问题；
            // 2.减少该文件的维护，避免多人对此文件维护或多版本维护所导致的风险；
            // 3.以后服务端与前端的ws通讯，应由服务端开发的业务人员与前端业务开发人员维护，此模块不需要再修改；
            iSocket.on('__ALL.WS.EVENT', function(data) {
                $rootScope.$broadcast('ws.' + data.event, data.data);
            });
        }

        return {
            init: _init
        };
    }]);
});