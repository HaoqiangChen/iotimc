/**
 * Created by YBW on 2020/3/10.
 *
 * 消息提醒框
 */
define([
    'app'
], function(app) {
    app.service('showMessage', ['iMessage', function(iMessage) {

        var dispatcherDevice;

        return function(level, content, message) {

            if(message && message.setDispatcher) {

                dispatcherDevice = message.setDispatcher;

            } else if(message && message.getDispatcher) {

                return dispatcherDevice;

            }
            else {
                if (dispatcherDevice) {
                    iMessage.show({
                        level: level || 1,
                        title: '消息提醒',
                        content: content
                    }, false);
                }
            }
        }

    }]);
});

