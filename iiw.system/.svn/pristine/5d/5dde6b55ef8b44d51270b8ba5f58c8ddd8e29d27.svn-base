/**
 * Created by ZJQ on 2015-10-21.
 */
define([
    'app',
    'cssloader!system/syou/css/index.css',
    'system/syou/js/directives/tree'

], function (app) {
    var m_scode;

    app.controller('syouController', [
        '$scope',
        '$state',
        'iAjax',
        'mainService',
        'iMessage',
        'iTimeNow',
        'iConfirm',

        function ($scope, $state, iAjax, mainService, iMessage, iTimeNow, iConfirm) {

            mainService.moduleName = '系统基础设置';
            $scope.title = "单位管理";
            $scope.m_sMode = 'view';
            var m_xtreeSelNode;

            $scope.$on('syouControllerOnEvent', function () {
                init();
            });

            /**
             * 单位树型结构初始化
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            function init() {
                var url, data;
                url = '/sys/web/syou.do?action=getSyouAll';
                data = {};

                $scope.reset();

                iAjax
                    .postSync(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.treeNodes = {
                                zNodes: data.result.rows
                            };
                        } else {
                            $scope.treeNodes = {
                                zNodes: []
                            };
                        }
                        $scope.$broadcast('initTree', $scope.treeNodes);

                    }, function () {
                        var message = {};
                        message.level = 4;
                        message.title = "消息提醒";
                        message.content = "数据查询失败，请检查是否有权限!";
                        iMessage.show(message, false);
                    });
            }

            /**
             * 树节点点击事件
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.selectEvent = function (treeNode) {
                m_xtreeSelNode = treeNode;
                $scope.entityItem = treeNode;
                $scope.entityItem.name = treeNode.name;
                $scope.entityItem.alias = treeNode.alias;
                $scope.entityItem.status = treeNode.status;
                $scope.entityItem.type = treeNode.type;
                $scope.entityItem.code = treeNode.code;
                var parentNode = _.filter($scope.treeNodes.zNodes, {id: treeNode.pId});
                $scope.entityItem.parentname = parentNode.length > 0 ? parentNode[0].name : '';
                $scope.entityItem.codeid = '';
            };

            /**
             * 添加单位
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.add = function () {
                $scope.m_sMode = 'add';
                m_scode = '';
                $scope.entityItem = {};
                if (m_xtreeSelNode) {
                    $scope.entityItem.codeid = m_xtreeSelNode.id;
                    $scope.entityItem.parentname = m_xtreeSelNode.name;
                    $scope.entityItem.name = null;
                    $scope.entityItem.alias = null;
                    $scope.entityItem.status = "P";
                    $scope.entityItem.status = "JQ";
                    $scope.entityItem.code = null;
                } else {
                    var message = {};
                    message.level = 3;
                    message.title = "单位管理";
                    message.content = "请选择需要添加单位的上级节点!";
                    iMessage.show(message, false);
                }
            };

            /**
             * 修改单位
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.mod = function () {
                $scope.m_sMode = 'mod';
                m_scode = m_xtreeSelNode.id;
                $scope.entityItem.codeid = m_xtreeSelNode.id;
            };

            /**
             * 删除单位
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.delete = function () {
                if (m_xtreeSelNode.children != null && m_xtreeSelNode.children.length > 0) {
                    var message = {};
                    message.level = 3;
                    message.title = "单位删除";
                    message.content = "本单位还存在下级单位，请先删除下级单位!";
                    iMessage.show(message, false);
                } else {

                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '删除信息后将无法还原，是否确认删除？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    });
                }
            };


            $scope.confirmSuccess = function(id) {
                iConfirm.close(id);
                var url, data;
                url = '/sys/web/syou.do?action=delSyou';
                data = {
                    id: [m_xtreeSelNode.id]
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == "1") {
                                var message = {};
                                message.level = 1;
                                message.title = "单位删除";
                                message.content = "删除单位成功!";
                                iMessage.show(message, false);

                                init();
                            } else {
                                var message = {};
                                message.level = 4;
                                message.title = "单位删除";
                                message.content = "删除单位失败!";
                                iMessage.show(message, false);
                            }
                        }
                    });
            };

            $scope.confirmClose = function(id) {

                iConfirm.close(id);
            };

            /**
             * 保存单位
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.save = function () {
                var aSelect = [];
                $.each($scope.treeNodes.zNodes, function (i, item) {
                    if(item.code == $scope.entityItem.code || item.name == $scope.entityItem.name) {
                        aSelect.push(item)
                    }
                });
                if(aSelect.length && !m_scode) {
                    iMessage.show({
                        level: 4,
                        title: '单位管理',
                        content: '单位编号或者单位名称已存在,请确认后在进行保存!'
                    });
                } else {
                    var url, data;
                    data = {
                        row: {
                            code: $scope.entityItem.code,
                            name: $scope.entityItem.name,
                            alias: $scope.entityItem.alias,
                            status: $scope.entityItem.status,
                            type: $scope.entityItem.type,
                            lead: $scope.entityItem.lead,
                            leadphone: $scope.entityItem.leadphone,
                            leads: $scope.entityItem.leads,
                            leadphones: $scope.entityItem.leadphones
                        }

                    };

                    if (m_scode) {
                        data.row.id = m_xtreeSelNode.id;
                        data.row.parentid = m_xtreeSelNode.pId ? m_xtreeSelNode.pId : null;
                        url = '/sys/web/syou.do?action=upSyou';
                    } else {
                        data.row.parentid = m_xtreeSelNode.id;
                        url = '/sys/web/syou.do?action=addSyou';
                    }

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data && data.message) {
                                if (data.status == "1") {

                                    var message = {};
                                    message.level = 1;
                                    message.title = "单位管理";
                                    message.content = m_scode ? "修改" : "添加";
                                    message.content = message.content + "单位【" + $scope.entityItem.name + "】成功!";
                                    iMessage.show(message, false);

                                    init();
                                }
                            }
                        },
                        function () {
                            var message = {};
                            message.level = 4;
                            message.title = "消息提醒";
                            message.content = "提交失败!";
                            iMessage.show(message, false);
                        })
                }
            };

            $scope.reset = function () {
                m_xtreeSelNode = null;
                m_scode = null;
                $scope.entityItem = null;
            };

            $scope.cancel = function () {
                $scope.m_sMode = 'view';
                $scope.reset();
            };
        }
    ]);
});