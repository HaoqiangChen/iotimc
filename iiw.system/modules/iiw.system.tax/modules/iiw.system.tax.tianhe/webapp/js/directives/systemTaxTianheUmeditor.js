/**
 * UMeditor网页编辑指令，由于此库对环境污染大，故不建议使用。
 * 此库目前仅提供演示使用。
 *
 * Created by zhs on 2018-01-22.
 */
define([
    'app',
    'system/tax/tianhe/lib/umeditor/1.2.2/third-party/template.min'
], function(app, etpl) {
    app.directive('systemTaxTianheUmeditor', [function() {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                window.etpl = etpl;
                window.UMEDITOR_HOME_URL = $.soa.getWebPath('iiw.system.tax.tianhe') + '/lib/umeditor/1.2.2/';

                var requirePath = 'system/tax/tianhe/lib/umeditor/1.2.2/';

                require([
                    requirePath + 'umeditor.config',
                    requirePath + 'umeditor.min',
                    'cssloader!' + requirePath + 'themes/default/css/umeditor.min'
                ], init);

                function init() {
                    var id = $element.attr('id');
                    if(!id) {
                        id = 'iiw_umeditor_' + parseInt(Math.random() * 10000);
                        $element.attr('id', id);
                    }

                    var object = UM.getEditor(id);

                    $element.data('iiw-umeditor', object);
                }
            }
        }
    }]);
});