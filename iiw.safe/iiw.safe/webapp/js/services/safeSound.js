/**
 * 统一音频播放服务。
 *
 * Created by YJJ on 2015-12-11.
 */
define([
    'app'
], function(app) {
    app.factory('safeSound', ['iAjax', '$timeout', function(iAjax, $timeout) {
        var _ = new Audio(),
            target = null,
            targetLevel = 1,                    // 播放目标等级，若是播放报警声音，则等级为2，播放普通声音时不予处理，直到播放完报警声音
            isAlarm = false;                    // 是否正在报警

        _.autoplay = true;



        function _play(url) {
            _.src = '';
            _.src = url;
        }

        function _playText(text) {
            iAjax.post('sys/common/voice.do?action=buildVoice', {
                content: text
            }).then(function(data) {
                if(data.result.address) {
                    if(data.result.address.indexOf('http://') == -1) {
                        _play(iAjax.formatURL(data.result.address));
                    } else {
                        _play(data.result.address);
                    }
                }
            });
        }

        return {
            play: _play,
            playText: _playText,
            playMessage: function(text) {
                if(isAlarm) return;             // 如果正在报警语音中，就不播放普通语音；

                _play($.soa.getWebPath('iiw.safe') + '/music/remind.mp3');

                if(targetLevel < 2) {
                    if(target) $timeout.cancel(target);

                    target = $timeout(function() {
                        _playText(text);
                    }, 2200);
                }

            },
            playAlarm: function(text) {
                isAlarm = true;

                _play($.soa.getWebPath('iiw.safe') + '/music/alarm.mp3');

                targetLevel = 2;
                if(target) $timeout.cancel(target);

                target = $timeout(function() {
                    _playText('注意，注意，' + text);
                    targetLevel = 1;

                    isAlarm = false;
                }, 2500);
            },
            playAlarm2: function(soundPath, soundLength, text) {
                isAlarm = true;

                _play(soundPath);

                targetLevel = 2;
                if(target) $timeout.cancel(target);

                target = $timeout(function() {
                    _playText('注意，' + text);
                    targetLevel = 1;

                    isAlarm = false;
                }, soundLength || 2500);
            },
            stop: function() {
                _.stop();
            },
            playMp3: function() {
                _play($.soa.getWebPath('iiw.safe') + '/music/click.mp3');
            },
            stopPlayMp3: function() {
                _.currentTime = 0;
                _.pause();
            }
        };
    }]);
});