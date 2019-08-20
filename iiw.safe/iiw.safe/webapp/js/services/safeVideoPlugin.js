/**
 * 视频播放
 *
 * Created by ybw on 2017/11/28.
 */
define([
    'app',
    'safe/lib/videoCT/videoCT',
    'cssloader!safe/lib/videoCT/videoCT'
], function(app) {
    app.factory('safeVideoPlugin', ['$compile', function($compile) {

        function _init(scope, place) {
            var videoID = 'safVideoPlugin' + Math.ceil(Math.random() * 1000) + (new Date().getTime());
            var html = '<div class="safe-video-plugin" id="' + videoID + '" ng-show="video.toggle">' +
                '<div class="safe-video-plugin-close" hm-tap="video.stop()">' +
                '<i class="fa fa-close"></i>' +
                '</div>' +
                '<section></section>' +
                '</div>';

            if(place) {
                this.place = place;
            } else {
                this.place = 'body';
            }
            $(this.place).append($compile(html)(scope));

            scope.video = {
                toggle: false,
                path: {
                    type: ['默认'],            //清晰度
                    src: []      //链接地址
                },
                videoID: videoID,
                play: function(path) {
                    if(path instanceof Array) {
                        this.path = path;
                    } else if(path){
                        this.path['src'] = [path]
                    }

                    if(this.path.src.length) {
                        this.toggle = true;
                        var obj = $('#' + scope.video.videoID).find('section').append('<video width="100%" height="100%" id="safVideoPlugin"></video>').find('#safVideoPlugin');
                        obj.videoCt({
                            title: '',              //标题
                            volume: 0.5,                //音量
                            barrage: false,              //弹幕开关
                            comment: false,              //弹幕
                            reversal: false,             //镜像翻转
                            playSpeed: true,            //播放速度
                            update: true,               //下载
                            autoplay: true,            //自动播放
                            clarity: this.path
                        });
                    }
                },
                stop: function() {
                    this.toggle = false;
                    $('#' + scope.video.videoID).find('section').empty();
                }
            };
        }

        return {
            init: _init
        }
    }]);
});
