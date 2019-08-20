/**
 * 信息牌添加/修改
 *
 * @author - dwt
 * @date - 2016-09-14
 * @version - 0.1
 */
define([
    'app',
    'system/infocard/js/directives/infocardTemplate',
    'system/infocard/js/services/infocardData',
    'system/infocard/item/js/directives/infocardFilterItem',
    'cssloader!system/infocard/css/index.css',
    'cssloader!system/infocard/item/css/index.css'
], function(app) {

    var path = $.soa.getWebPath('iiw.system.infocard.item');

    app.controller('infocardItemController', [
        '$scope',
        '$state',
        '$http',
        '$timeout',
        '$compile',
        'iAjax',
        'iMessage',
        'infocardData',
        '$stateParams',

        function($scope, $state, $http, $timeout, $compile, iAjax, iMessage, infocardData, $stateParams) {

            // templateEl: 模板所属元素
            // textareaEl: 编辑模板的textarea
            var templateEl = $('.system-infocard-item-main').find('.infocard-list-item-body.safe-infocard-panel'),
                textareaEl = $('.system-infocard-item-edit-template').find('textarea');

            var type;
            if ($stateParams && $stateParams.data && $stateParams.data.type) {
                type = $stateParams.data.type;
            }

            $scope.back = function() {
                var params = {
                    data: {
                        type: type
                    }
                };
                $state.params = params;
                $state.go('system.infocard.list', params);
            };

            $scope.object = $stateParams.data;              // 信息牌对象
            $scope.templateHtml = '';                       // 模板的HTML
            $scope.dsItem = null;                           // 当前选中的数据源编辑项
            $scope.oldDsItem = null;                        // 之前选中的数据源编辑项，当点击新的数据源编辑项时，将之前的数据源编辑项移除样式
            $scope.dsId = '';                               // 当前在右侧选中的数据源ID

            $scope.defaultTemplates = [
                {content: path + '/views/criminalInfo.html', name: '模板1', id: 'defaultTemplate_1'},
                {content: path + '/views/prisonPolice.html', name: '模板2', id: 'defaultTemplate_2'},
                {content: path + '/views/prisonHousePolice.html', name: '模板3', id: 'defaultTemplate_3'},
                {content: path + '/views/police.html', name: '模板4', id: 'defaultTemplate_4'},
                {content: path + '/views/criminal.html', name: '模板5', id: 'defaultTemplate_5'},
                {content: path + '/views/led.html', name: '模板6', id: 'defaultTemplate_6'},
                {content: path + '/views/importantDayMessage.html', name: '模板7', id: 'defaultTemplate_7'}
            ];

            // 单位下拉框
            $scope.ouData = {
                syoufk: '',
                list: [],
                getList: function(callback) {
                    infocardData.getMapOuList(function(list) {

                        $scope.ouData.list = _.filter(list, {'type': 'ou'});
                        $scope.ouData.syoufk = $scope.ouData.list[0].id;

                        if (callback) {
                            callback();
                        }

                    })
                }
            };

            // 数据源接口下拉框
            $scope.dataInterface = {
                id: '',
                list: [],
                getList: function(callback) {
                    infocardData.getInfocardSourceItem(function(list) {
                        $scope.dataInterface.list = list;

                        if (list.length > 0) {
                            $scope.dataInterface.id = list[0].id;
                        }

                        if (callback) {
                            callback();
                        }

                    });
                }
            };

            // 数据源列表
            $scope.dataSource = {
                list: [],
                getList: function() {
                    var syoufk = $scope.ouData.syoufk,
                        id = $scope.dataInterface.id;

                    if (!syoufk || !id) {
                        return;
                    }

                    infocardData.getInfocardSourceList(syoufk, id, function(list) {
                        $scope.dataSource.list = list;
                    });
                },
                select: function(item) {
                    if ($scope.dsItem) {
                        $scope.dsId = item.sid;
                        $scope.dsItem.attr('ds-item-id', item.sid);
                        $scope.dsItem.attr('ds-item-name', item.name);
                        $scope.dsItem.attr('ds-item-ou', $scope.ouData.syoufk);

                        $scope.dsItem.html('');
                        if(typeof(item.value) == 'string') {
                            $scope.dsItem.text(item.value);
                        }else {
                            var phoneID = null;
                            if($scope.dsItem.attr('phoneID')) {
                                phoneID = $scope.dsItem.attr('phoneID');
                            }

                            _.each(item.value, function(v, i) {
                                $scope.dsItem.append('<div class="info-items">' + v.name + '</div>');
                                //$scope.dsItem.append('<button class="info-items" title="' + (v.name) + '">' + (v.name) + '</button>');
                                if(phoneID) {
                                    $('#' + phoneID).html((i ? ',' : '') + v.cellphone);
                                }
                            });

                        }

                        $('.data-item-bind-btn').show();
                        $('.data-item-bind-btn').css('display', 'inline-block');
                    }
                },
                cancel: function() {
                    if ($scope.dsItem) {
                        $scope.dsId = '';
                        $scope.dsItem.removeAttr('ds-item-id');
                        $scope.dsItem.removeAttr('ds-item-name');
                        $scope.dsItem.removeAttr('ds-item-ou');
                        $scope.dsItem.html('');
                        $('.data-item-bind-btn').hide();
                    }
                }
            };

            // 左侧数据编辑项的点击事件
            $scope.dsClick = function(e, obj) {
                if ($scope.oldDsItem) {
                    $scope.oldDsItem.removeClass('select');
                }

                $scope.dsId = $(obj).attr('ds-item-id');
                $scope.dsItem = $(obj);
                $scope.dsItem.addClass('select');
                $scope.oldDsItem = $scope.dsItem;

                if ($scope.dsId) {
                    $('.data-item-bind-btn').show();
                    $('.data-item-bind-btn').css('display', 'inline-block');
                } else {
                    $('.data-item-bind-btn').hide();
                }
            };

            /**
             * 显示上传模板页面
             */
            $scope.showUploadDialogEvent = function() {
                $('.system-infocard-item-dialog').show();
            };

            /**
             * 隐藏上传模板页面
             */
            $scope.hideUploadDialogEvent = function() {
                $('.system-infocard-item-dialog').hide();
            };

            /**
             * 显示上传文件对话框
             */
            $scope.showUploadFileEvent = function() {
                $('#upInfocard').val('');
                $('#upInfocard').click();
            };

            /**
             * 显示模板编辑页面
             */
            $scope.showEditTemplateDialog = function() {
                $('.system-infocard-item-edit-template').show();
            };

            /**
             * 隐藏模板编辑页面
             */
            $scope.hideEditTemplateDialog = function() {
                $('.system-infocard-item-edit-template').hide();
            };

            /**
             * 编辑模板，先将已选中的编辑数据源和选中的数据源去掉，再将内容赋给texearea
             */
            $scope.editTemplate = function() {

                if ($scope.dsItem) {
                    $scope.dsItem.removeClass('select');
                    $scope.oldDsItem = $scope.dsItem;
                }

                if ($scope.dsId) {
                    $scope.dsId = '';
                    $('.data-item-bind-btn').hide();
                }

                var input = templateEl.find('input');
                _.each(input, function(o) {
                    $(o).attr('value', $(o).val());
                });

                var html = templateEl.html();
                html = html.replace(/&lt;/g, '<');
                html = html.replace(/&gt;/g, '>');
                textareaEl.val(html);

                $scope.showEditTemplateDialog();
            };

            /**
             * 保存编辑模板内容，保存后重新将编辑数据源赋予点击事件
             */
            $scope.saveEditTemplate = function() {
                var newText = textareaEl.val();
                var htmlEl = $compile(newText)($scope);
                templateEl.html(htmlEl);

                var aDatasource = templateEl.find('[datasource]');
                _.each(aDatasource, function(source) {
                    source = $(source);

                    // 为每个数据项添加配置提示
                    source.on('click', function(e) {
                        if ($scope.dsClick) {
                            $scope.dsClick(e, this);
                        }
                    });
                });

                $scope.hideEditTemplateDialog();
            };

            /**
             * 编辑模板时，若按TAB键则在当前光标处添加四个空格
             * @param $event
             */
            $scope.textareaKeydownEvent = function($event) {
                // TAB键
                if ($event.keyCode == '9') {
                    var textarea = textareaEl.get(0),
                        startPos = textarea.selectionStart,
                        endPos = textarea.selectionEnd,
                        tempStr = textarea.value;

                    var str = tempStr.substring(0, startPos) + '&nbsp;&nbsp;&nbsp;&nbsp;' + tempStr.substring(endPos, tempStr.length);
                    textareaEl.html(str);
                    textarea.selectionStart = startPos + 4;
                    textarea.selectionEnd = endPos + 4;
                    textarea.focus();
                    $event.preventDefault();
                }
            };

            /**
             * 读取本地模板
             * @param element
             */
            $scope.uploadInfocard = function(element) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.templateHtml = e.target.result;
                    $scope.hideUploadDialogEvent();
                };
                reader.readAsText(element.files[0]);
            };

            /**
             * 读取默认模板
             * @param item
             */
            $scope.selectDefaultTemplate = function(item) {
                $scope.templateHtml = $('#' + item.id).html();
                $scope.hideUploadDialogEvent();
            };

            $scope.saveData = function(invalid) {
                if (invalid) {
                    return;
                }

                var obj = $scope.object,
                    formData = getFormDataByTemplate(templateEl);

                saveTemplate(obj, formData, function() {
                    infocardData.saveInfocard(obj, function() {
                        iMessage.show({
                            level: '1',
                            title: '信息牌',
                            content: ($scope.title + '成功')
                        });
                        $scope.back();
                    });
                });

            };

            if ($stateParams && $stateParams.data) {
                if (!$stateParams.data.id) {
                    $scope.title = '信息牌添加';
                } else {
                    $scope.title = '信息牌修改';
                }
            } else {
                $scope.back();
            }

            $('.data-item-bind-btn').hide();
            $scope.ouData.getList(function() {
                $scope.dataInterface.getList(function() {
                    $scope.dataSource.getList();
                });
            });

            function saveTemplate(object, formData, callback) {
                var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=infocard');

                if ($scope.object.imageid) {
                    url += '&imageid=' + object.imageid;
                } else if ($scope.object.content) {
                    var temp = object.content.split('/');
                    url += '&imageid=' + temp[temp.length - 1];
                }

                $http({
                    method: 'post',
                    url: url,
                    data: formData,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(data) {
                    if (data.result.rows) {
                        object.content = '';
                        $timeout(function() {
                            object.content = data.result.rows.savepath;
                            object.imageid = data.result.rows.imageid;

                            if (callback) {
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
                if (!el.find('[ds-ou]').length) {
                    el.prepend('<div ds-ou style="display:none;"></div>');
                }

                var dsItemOus = el.find('[ds-item-ou]'),
                    oSyoufk = {}, key,
                    syoufk = '',
                    syoufks = [];

                _.each(dsItemOus, function(item) {
                    item = $(item);
                    syoufk = item.attr('ds-item-ou');
                    if (syoufk && !oSyoufk[syoufk]) {
                        oSyoufk[syoufk] = true;
                    }
                });

                for (key in oSyoufk) {
                    syoufks.push(key);
                }

                el.find('[ds-ou]').text(syoufks.join('|'));
            }

        }
    ]);

});