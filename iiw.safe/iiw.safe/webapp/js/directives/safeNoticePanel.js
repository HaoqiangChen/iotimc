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

    app.directive('safeNoticePanel', ['iAjax', 'iMessage', '$filter', function(iAjax, iMessage, $filter) {
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
                '<div ui-layout-container class="safe-notice-panel-body">',

                '<div class="notice-files">附件： ',
                    '<a class="item" ng-repeat="item in files" title="点击下载附件" ng-href="{{item.url}}" download="{{item.name}}" style="margin-right: 30px;cursor:pointer;">',
                        '<i class="fa fa-file-o"></i>{{item.name}}',
                    '</a>',
                '</div>',

                '<div class="notice-content">通知内容： {{content}}</div>',

                '<div class="form-group notice-reply">',
                '<textarea rows="6" name="reply" ng-model="reply" placeholder="请输入要回复的内容" style="padding-top: 10px;" class="form-control" required></textarea>',
                    '<label class="control-label text-danger" ng-show="reply.$error.required">回复内容不能为空</label>',
                '</div>',

                '<button class="btn btn-success btn-reply" type="button" ng-disabled="!reply" ng-click="noticeReply()">提交</button>',

                '</div>',
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
                $scope.files = [];
                $scope.reply = '';
                $scope.noticeUser = '';
                $scope.noticeTime = '';

                $scope.closeNoticePanel = function() {
                    $element.hide('fade');
                };

                $scope.noticeReply = function() {
                    iAjax
                        .post('information/report/report.do?action=updateNoticeInfo', {id: $scope.id, reply: $scope.reply})
                        .then(function (data) {
                          if (data.status === 1) {
                            var message = {
                              title: '回复通知成功',
                              level: 1,
                              content: '回复通知成功！'
                            };
                            iMessage.show(message, false);
                            $element.hide('fade');
                          }
                        })
                };

                $scope.$on('ws.sendNoticeInfodtl', function(e, data) {
                    try {
                        $scope.id = data.id;
                        $scope.title = data.title;
                        $scope.content = data.content;
                        $scope.noticeUser = data.creuser || '';

                        if (data.files && data.files.length) {
                            _.each(data.files, function (_f) {
                                $scope.files.push({
                                    name: _f.substr((_f.lastIndexOf('/')) + 1),
                                    url: iAjax.formatURL('/security/common/monitor.do?action=getFileDetail') + '&url=' + _f
                                })
                            })
                        }

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
