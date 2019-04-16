/**
 * 访谈APP问卷目录设置
 * Created by chq on 2019-10-17.
 */
define([
    'app',
    'cssloader!system/ftappdirectory/css/index.css',
    'system/js/directives/systemTreeViewDirective'
], function(app) {
    app.controller('ftappDirectoryController', ['$scope', '$state', '$stateParams', 'iAjax', 'mainService', 'iMessage', function($scope, $state, $stateParams, iAjax, mainService, iMessage) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷目录设置';
        var currentNode;
        $scope.m_sCode = null;
        $scope.m_sMode = 'view';
        var domain = 'http://iotimc8888.goho.co:17783';
        var wjId;
        if ($stateParams.data) {
            console.log($stateParams.data);
            wjId = $stateParams.data.id;
        } else {
            wjId = 'B701AB0474BE475B8CF22E6152B9FC01'
        }

        function init() {
            $scope.reset();
            var url, data;
            url = domain + '/terminal/interview/system.do?action=getQuestiontypeList';
            data = {
                naireid: wjId
            };
            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, data)
                    // .post(url, data)
                    .then(function (data) {
                        console.log(data);
                        if (data.result.rows && data.result.rows.length > 0) {
                            $scope.treeNodes = {
                                zNodes: data.result.rows
                            };
                        } else {
                            $scope.treeNodes = {
                                zNodes: []
                            };
                        }
                        $scope.$broadcast('initTree', $scope.treeNodes);
                    },function (err) {
                        _remind(4, err.message, '请求失败，请查看网络状态!');
                        $scope.loading.content = '请求失败，请查看网络状态';
                    })
            })
            // iAjax.post('security/deviceCode.do?action=getDeviceCode').then(function(data) {
            //     if (data.result.rows && data.result.rows.length > 0) {
            //         $scope.treeNodes = {
            //             zNodes: data.result.rows
            //         };
            //     } else {
            //         $scope.treeNodes = {
            //             zNodes: []
            //         };
            //     }
            //     $scope.$broadcast('initTree', $scope.treeNodes);
            // }, function() {
            //     var message = {};
            //     message.level = 4;
            //     message.title = '消息提醒';
            //     message.content = '网络连接失败!';
            //     iMessage.show(message, false);
            // });
        }

        // 树节点点击事件
        $scope.selectEvent = function(treeNode) {
            $scope.entityItem = treeNode;
            currentNode = treeNode;
            var parentNode = treeNode.getParentNode();
            if (parentNode) {
                $scope.entityItem.parentcode = parentNode.code ? parentNode.code : '0';
                $scope.entityItem.parentname = parentNode.name ? parentNode.name : '设备编码';
                parentNode = null;
            } else {
                $scope.entityItem.parentcode = '0';
                $scope.entityItem.parentname = '设备编码';
            }
        };

        // 添加设备编码
        $scope.add = function() {
            $scope.m_sMode = 'add';
            $scope.m_sCode = '';
            $scope.entityItem = {};
            $scope.entityItem.primaryid = '1';
            if (currentNode) {
                $scope.entityItem.parentname = currentNode.name;
                $scope.entityItem.parentid = currentNode.id;
                $scope.entityItem.parentcode = currentNode.coding;
                $scope.entityItem.type = currentNode.content;
                $scope.entityItem.content = '';
                $scope.entityItem.status = 'P';
            } else {
                $scope.entityItem.parentname = '设备编码';
                $scope.entityItem.parentcode = '00';
                $scope.entityItem.parentid = null;
                $scope.entityItem.status = 'P';
            }
        };

        // 保存设备编码
        $scope.save = function() {
            var url;
            if ($scope.m_sCode) {
                url = 'security/deviceCode.do?action=upDeviceCode';
            } else {
                url = 'security/deviceCode.do?action=addDeviceCode';
            }

            var data = {
                row: $scope.entityItem
            };

            iAjax.post(url, data).then(function() {
                var message = {};
                message.level = 1;
                message.title = '消息提醒';
                message.content = '提交成功!';
                iMessage.show(message, false);
                init();
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '提交失败!';
                iMessage.show(message, false);
            });
        };

        // 修改设备编码
        $scope.mod = function() {
            $scope.m_sMode = 'mod';
            $scope.m_sCode = currentNode.id;
            $scope.entityItem = {};
            $scope.entityItem.primaryid = currentNode.id;
            var parentNode = currentNode.getParentNode();
            if (currentNode) {
                $scope.entityItem.parentname = parentNode ? parentNode.name : '设备编码';
                $scope.entityItem.parentid = parentNode ? parentNode.id : '';
                $scope.entityItem.parentcode = parentNode ? parentNode.coding : '0';
                $scope.entityItem.type = currentNode.type;
                $scope.entityItem.status = currentNode.status;
                $scope.entityItem.content = currentNode.content;
                $scope.entityItem.coding = currentNode.coding;
                $scope.entityItem.name = currentNode.name;
                $scope.entityItem.id = currentNode.id;
            }
        };

        // 删除设备编码
        $scope.delete = function() {
            if ($scope.entityItem.children) {
                $scope.confirmMessage = '是否删除该记录以及该记录下所有的子节点？';
                $('.modal').modal();
            } else {
                var data = {
                    row: [{id: $scope.entityItem.id}]
                };
                deleteRecord(data);
            }
        };

        $scope.reset = function() {
            currentNode = null;
            $scope.m_sCode = null;
            $scope.entityItem = null;
            $scope.m_sMode = 'view';
        };

        function deleteRecord(data) {
            iAjax.post('security/deviceCode.do?action=delDeviceCode', data).then(function() {
                var message = {};
                message.level = 1;
                message.title = '消息提醒';
                message.content = '删除成功!';
                iMessage.show(message, false);
                init();
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '删除失败!';
                iMessage.show(message, false);
            });
        }

        $scope.confirm = function() {
            var data = {
                row: [{id: $scope.entityItem.id}]
            };
            deleteRecord(data);
        };

        $scope.cancel = function() {
            $scope.m_sMode = 'view';
        };

        $scope.back = function () {
            $state.go('system.ftappwjmanage');
        };

        // 模块加载完成后初始化事件
        $scope.$on('ftappDirectoryControllerOnEvent', function () {
            init();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
        }

        function _remind(level, content, title) {
            var message = {
                id: new Date(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };

            iMessage.show(message, false);
        }
    }]);
});
