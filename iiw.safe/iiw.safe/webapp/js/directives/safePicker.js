/**
 * @module iiw.safe.directives
 */
define(['app'], function(app) {
    /**
     * 日期选择控件。
     * 1. 安防平台框架已载入，无法重复加载。
     * 2. 其它框架框架需加载，请加载'safe/js/directives/safePicker'。
     * 3. 此类为指令，直接在html中使用，restrict: 'A'。
     * 4. 该控件引入了DateTimePicker，具体api请参考 http://xdsoft.net/jqplugins/datetimepicker/
     * 5. 参数引用可直接在html上配置，参数前需带“p!”，具体可参考demo。
     * ***
     *     HTML:
     *     <!-- 聚焦到input框后，弹出时间选择控件，包括年月日 时分 -->
     *     <input type="text" ng-model="starttime" safe-picker p!format="Y-m-d H:i" />
     *
     *     <!-- 聚焦到input框后，弹出时间选择控件，包括年月日 -->
     *     <input type="text" ng-model="endtime" safe-picker p!format="Y-m-d" />
     *
     * @class safePicker
     *
     *
     * @author : yjj
     * @version : 1.0
     * @Date : 2015-12-11
     */
    app.directive('safePicker', [function() {
        return {
            restrict: 'A',
            link: function($scope, $element, attrs) {
                var options = {};
                $.each(attrs, function(k, v) {
                    if(k.indexOf('p!') > -1) {
                        options[k.replace('p!', '')] = (v != 'false') ? v : false;
                    }
                });
                $element.datetimepicker(options);
            }
        }
    }]);
});