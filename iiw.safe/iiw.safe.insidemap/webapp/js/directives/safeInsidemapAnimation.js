
/**
 * 电子地图动画
 *
 * @author - dwt
 * @date - 2016-06-06
 * @version - 0.1
 */
define([
    'app'
], function(app) {

    //电子地图左侧信息面板的隐藏和显示
    app.animation('.safe-insidemap-info', [
        '$animateCss',

        function($animateCss) {
            return {
                enter: function(element) {
                    return $animateCss(element, {
                        from: {left: '-400px'},
                        to: {left: '0'},
                        duration: 1,
                        delay: 0.5
                    });
                },
                leave: function(element) {
                    return $animateCss(element, {
                        from: {left: '0'},
                        to: {left: '-400px'},
                        duration: 1
                    });
                }
            }
        }
    ]);


    //电子地图左侧展开按钮的隐藏和显示
    app.animation('.safe-insidemap-info-slider', [
        '$animateCss',

        function($animateCss) {
            return {
                enter: function(element) {
                    return $animateCss(element, {
                        from: {left: '-150px'},
                        to: {left: '-75px'},
                        duration: 1,
                        delay: 0.5
                    });
                },
                leave: function(element) {
                    return $animateCss(element, {
                        from: {left: '-75px'},
                        to: {left: '-150px'},
                        duration: 1
                    });
                }
            }
        }
    ]);
});