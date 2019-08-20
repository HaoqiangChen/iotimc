/**
 * 公告信息提醒
 * 功能描述：在后台预警信息管理，添加一条预警信息，则对应的用户就会弹出公告信息
 *
 * @author - dwt
 * @date - 2016-08-03
 * @version - 1.0
 */
define([
    'app'
], function(app) {

    app.directive('safeNoticePanel', ['iAjax', '$filter', function(iAjax, $filter) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: [
                '<div class="safe-notice-panel layout-full">',
                '<div class="layout-full" hm-tap="closeNoticePanel()"></div>',
                '<div class="layout-full">',
                '<div class="layout-full">',
                '<div ui-layout="{ flow: \'row\'}" options="{dividerSize:\'0\'}">',
                '<div ui-layout-container size="50px" class="safe-notice-panel-title">{{title}}</div>',
                '<div ui-layout-container class="safe-notice-panel-body">{{content}}</div>',
                '<div ui-layout-container size="30px" class="safe-notice-panel-foot">发布人：{{noticeUser}} - 发布时间：{{noticeTime}}</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>'
            ].join(''),
            link: function($scope, $element) {
                $scope.id = '';
                $scope.title = '';
                $scope.content = '';
                $scope.noticeUser = '';
                $scope.noticeTime = '';

                $scope.closeNoticePanel = function() {
                    $element.hide('fade');
                };

                $scope.$on('ws.sendNoticeInfodtl', function(e, data) {
                    try {
                        $scope.id = data.id;
                        $scope.title = data.title;
                        $scope.content = data.content;
                        $scope.noticeUser = data.creuser || '';

                        if(data.cretime) {
                            $scope.noticeTime = $filter('date')(data.cretime, 'yyyy-MM-dd HH:mm:ss');
                        }

                        $element.show('fade');
                    } catch(e) {
                        //日期转换可能报错
                    }
                });

                //当后台删除对应的预警公告时，会关闭还在显示的预警公告
                $scope.$on('ws.delsendNoticeInfodtl', function(e, data) {
                    if(data && data.ids) {
                        _.each(data.ids, function(id) {
                            if(id == $scope.id) {
                                $element.hide('fade');
                            }
                        });
                    }
                })

            }
        }
    }]);

});