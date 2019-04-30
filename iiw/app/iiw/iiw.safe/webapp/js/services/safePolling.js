/**
 * 数组轮播管理服务。
 *
 * Created by YJJ on 2015-11-13.
 */
define([
    'app'
], function(app) {
    app.factory('safePolling', ['$interval', function($interval) {

        function Polling(array, size, timeout) {
            var events = {},            // 事件监听。
                index = 0,              // 当前序号指针。
                target = null,          // 计时器。
                data = null;            // 自定义数据。

            timeout = timeout * 1000 || 15 * 1000;

            function call(event, data) {
                if(events[event]) {
                    $.each(events[event], function(i, callback) {
                        callback(data);
                    });
                }
            }

            function clean() {
                if(target) $interval.cancel(target);
            }

            function _start() {
                index = 0;
                _play();
                call('start');
            }

            function _play() {
                _next([], size);
                target = $interval(function() {
                    _next([], size);
                }, timeout);
            }

            function _stop() {
                clean();
                call('stop');
            }

            function _pause() {
                clean();
                call('pause');
            }

            function _next(result, step) {
                result = result || [];
                if(index < array.length) {
                    result.push(array[index++]);
                    if(step > 1) {
                        _next(result, --step);
                    } else {
                        call('polling', result);
                    }
                } else {
                    index = 0;
                    result.push(array[index++]);
                    call('polling', result);
                }
                call('next');
            }

            function _prev(result, step) {
                result = result || [];
                if(index >= 0) {
                    result.push(array[index--]);
                    if(step > 1) {
                        _prev(result, --step);
                    } else {
                        call('polling', result);
                    }
                } else {
                    index = array.length - 1;
                    call('polling', result);
                }
                call('prev');
            }

            function _setData(value) {
                data = value;
            }

            function _getData() {
                return data;
            }

            function _setSize(value) {
                size = value;
            }

            function _getSize() {
                return size;
            }

            function _getList() {
                return array;
            }

            function _getStep() {
                return timeout;
            }

            function _on(event, fn) {
                if(events[event]) {
                    events[event].push(fn);
                } else {
                    events[event] = [fn];
                }
            }

            return {
                start: _start,
                stop: _stop,
                pause: _pause,
                next: _next,
                prev: _prev,
                setData: _setData,
                getData: _getData,
                setSize: _setSize,
                getSize: _getSize,
                getList: _getList,
                getStep: _getStep,
                on: _on
            }
        }

        return {
            create: Polling
        }
    }]);
});