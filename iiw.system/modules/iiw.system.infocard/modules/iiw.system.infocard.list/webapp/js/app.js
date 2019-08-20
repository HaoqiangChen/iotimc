/**
 * 信息牌模板
 *
 * @author - dwt
 * @date - 2016-09-14
 * @version - 0.1
 */
define([
    'app',
    'system/infocard/js/directives/infocardTemplate',
    'system/infocard/js/services/infocardData'
], function(app) {

    app.controller('infocardListController', [
        '$scope',
        '$state',
        '$http',
        '$timeout',
        '$uibModal',
        'mainService',
        'iAjax',
        'iConfirm',
        'iMessage',
        'infocardData',
        '$stateParams',

        function($scope, $state, $http, $timeout, $uibModal, mainService, iAjax, iConfirm, iMessage, infocardData, $stateParams) {


            mainService.moduleName = '信息牌模板';

            $scope.back = function() {
                var params = {'data': null};
                $state.params = params;
                $state.go('system.infocard', params);
            };

            $scope.template = {};
            $scope.template.type = 'list';
            $scope.template.typeList = [
                {name: '罪犯', type: 'criminal'},
                {name: '警察', type: 'police'},
                {name: 'LED', type: 'led'}
            ];

            // 还原之前选择的类型
            if($stateParams && $stateParams.data && $stateParams.data.type) {
                $scope.template.typeItem = _.filter($scope.template.typeList, {type: $stateParams.data.type})[0];
            }else {
                $scope.template.typeItem = $scope.template.typeList[0];
            }

            $scope.template.list = {
                items: [],
                filterValue: '',
                getList: function() {

                    $scope.template.list.items = [];

                    infocardData.getInfocardList($scope.template.typeItem.type, function(list) {
                        $scope.template.list.items = list;
                    });

                },
                select: function(item) {
                    if(item.select) {
                        item.select = false;
                    }else {
                        item.select = true;
                    }
                },
                add: function() {
                    var params = {
                        data: {
                            type: $scope.template.typeItem.type
                        }
                    };
                    $state.params = params;
                    $state.go('system.infocard.item', params);
                },
                mod: function() {
                    var object = _.find($scope.template.list.items, {select: true});

                    var params = {
                        data: object
                    };
                    $state.params = params;
                    $state.go('system.infocard.item', params);
                },
                copyName: '',
                copy: function() {

                    iConfirm.show({
                        scope: $scope,
                        title: '输入新的信息牌文件名',
                        templateUrl: $.soa.getWebPath('iiw.system.infocard.list') + '/views/copyName.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'template.list.confirmCopy'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'template.list.confirmClose'
                        }]
                    });

                },
                confirmCopy: function(id) {
                    iConfirm.close(id);

                    var object = _.find($scope.template.list.items, {select: true});
                    var formData = getFormDataByTemplate($('#list_' + object.id));

                    var newObject = _.extend({}, object);
                    newObject.name = $scope.template.list.copyName || (newObject.name + '_复制');
                    delete newObject.id;

                    saveTemplate(newObject, formData, function() {
                        infocardData.saveInfocard(newObject, function() {
                            iMessage.show({
                                level: '1',
                                title: '信息牌',
                                content: '复制成功'
                            });
                            $scope.template.list.getList();
                        });
                    });

                },
                del: function() {
                    var selectTemplates = _.filter($scope.template.list.items, {select: true});

                    var aName = selectTemplates.map(function(select, i) {
                        return (i + 1 + '、' + select.name);
                    });

                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '共选择' + selectTemplates.length + '条数据，分别为：<br>' + aName.join('<br>'),
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'template.list.confirmDel'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'template.list.confirmClose'
                        }]
                    });

                },
                confirmDel: function(id) {
                    iConfirm.close(id);

                    var url = '/security/infocard.do?action=delInfocard',
                        selectTemplates = _.filter($scope.template.list.items, {select: true}),
                        aId = [];

                    _.each(selectTemplates, function(o) {
                        aId.push(o.id);
                    });

                    iAjax
                        .post(url, {
                            id: aId
                        })
                        .then(function() {

                            iMessage.show({
                                level: '1',
                                title: '信息牌',
                                content: '删除成功'
                            });

                            $scope.template.list.getList();
                        });
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                }
            };

            $scope.template.list.getList();

            function saveTemplate(object, formData, callback) {
                var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=infocard');

                $http({
                    method: 'post',
                    url: url,
                    data: formData,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(data) {
                    if(data.result.rows) {
                        object.content = '';
                        $timeout(function() {
                            object.content = data.result.rows.savepath;
                            object.imageid = data.result.rows.imageid;

                            if(callback) {
                                callback();
                            }
                        });
                    }
                });
            }

            function getFormDataByTemplate(el) {

                revertTemplateData(el);

                var html = el.html();
                var blob = new Blob([html], {type: 'text/html'});
                var formData = new FormData();
                formData.append('htmlFile', blob, 'template.html');

                return formData;
            }

            function revertTemplateData(el) {
                // 还原edit时的input框
                var input = el.find('input');
                _.each(input, function(o) {
                    $(o).replaceWith($(o).val());
                });

                // 还原数据源元素的效果
                var aDatasource = el.find('[datasource]');
                _.each(aDatasource, function(source) {
                    source = $(source);

                    source.html('');
                    source.removeClass('datasource select');
                    source.off('click');
                });

                // 在每个数据项找出要获取数据的单位
                if(!el.find('[ds-ou]').length) {
                    el.prepend('<div ds-ou style="display:none;"></div>');
                }

                var dsItemOus = el.find('[ds-item-ou]'),
                    oSyoufk = {}, key,
                    syoufk = '',
                    syoufks = [];

                _.each(dsItemOus, function(item) {
                    item = $(item);
                    syoufk = item.attr('ds-item-ou');
                    if(syoufk && !oSyoufk[syoufk]) {
                        oSyoufk[syoufk] = true;
                    }
                });

                for(key in oSyoufk) {
                    syoufks.push(key);
                }

                el.find('[ds-ou]').text(syoufks.join('|'));
            }

        }
    ]);

});