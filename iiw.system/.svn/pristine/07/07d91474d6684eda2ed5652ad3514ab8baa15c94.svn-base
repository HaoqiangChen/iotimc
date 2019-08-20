/**
 * 颜色选择器指令
 *
 * @author - dwt
 * @date - 2016-01-28
 * @version - 0.1
 */
define(['app'], function(app) {
    app.directive('colorPicker', function() {
        return {
            restrict: 'A',
            scope: {
                oColorPicker: '=oColorPicker'
            },
            link: function(scope, iElement, iAttrs) {
                var backgroundColor = iAttrs.color,
                    opacity = iAttrs.opacity || '0.7';

                scope.oColorPicker.setColorHook = function(color) {
                    iElement.find('div').css('backgroundColor', color);
                    $(this).ColorPickerSetColor(color);
                };

                iElement.ColorPicker({
                    color: backgroundColor,
                    onBeforeShow: function() {
                        var color = iAttrs.color.replace(/,\s'+opacity+'\d*\)/, ')');
                        var arr = color.match(/[0-9]{1,3}/g);
                        var rgb = {
                            r: arr[0],
                            g: arr[1],
                            b: arr[2]
                        };
                        $(this).ColorPickerSetColor(rgb);
                    },
                    onShow: function(colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function(colpkr) {
                        $(colpkr).fadeOut(500);
                        scope.oColorPicker.changedColor(iElement.find('div').css('backgroundColor'));
                        return false;
                    },
                    onChange: function(hsb, hex, rgb) {
                        iElement.find('div').css('backgroundColor', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
                        scope.oColorPicker.changeColor('rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')');
                    }
                });
            }
        }
    })
});