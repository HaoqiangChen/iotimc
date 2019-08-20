/**
 * 表格中行选中指令
 * Created by zcl on 2016/3/8.
 */
define(['app'], function(app) {
    app.directive('systemRowCheck', [function() {
        return {
            restrict: 'E',
            template: '<input type="checkbox"/>',
            replace: true,
            link: function(scope, $element, attr) {
                var oRow = $element.parent().parent();
                oRow.bind('click', {'row': scope[attr.ngModel.split('.')[0]]}, function(e) {
                    var oRow = $(this),
                        rowscope = e.data.row,
                        checkbox = oRow.find(':checkbox'),
                        isSel = checkbox.is(':checked');

                    if (e.target != checkbox[0]) {
                        checkbox[0].checked = !isSel;
                        rowscope.checked = !isSel;
                        isSel = !isSel;
                    }
                });
            }
        }
    }]);
});