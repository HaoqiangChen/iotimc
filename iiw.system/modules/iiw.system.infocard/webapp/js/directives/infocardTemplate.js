/**
 * 信息牌模板
 *
 * @author - dwt
 * @date - 2016-09-18
 * @version - 0.1
 */
define([
    'app',
    'cssloader!safe/insidemap/css/infocard.css',
    'cssloader!system/infocard/css/infocard.css'
], function(app) {
    app.directive('infocardTemplate', [
        '$compile',
        'iAjax',

        function($compile, iAjax) {
            return {
                restrict: 'A',
                scope: {
                    templateUrl: '=templateUrl',
                    templateHtml: '=templateHtml',
                    dsClick: '=dsClick',
                    time: '=time'
                },
                compile: function() {
                    return {
                        post: function(scope, element, attrs) {
                            var url = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=';

                            // 更换信息牌URL
                            scope.$watch('templateUrl', function(templateUrl) {
                                if(templateUrl) {
                                    var tUrl = templateUrl.indexOf('http') == -1 ? (url + templateUrl) : templateUrl;

                                    $.ajax({
                                        url: tUrl,
                                        async: false,
                                        cache: false,
                                        dataType: 'text'
                                    }).success(function(data) {

                                        loadTemplateHtml(data);

                                    });
                                }
                            });

                            // 更换信息牌HTML
                            scope.$watch('templateHtml', function(data) {
                                if(data) {
                                    loadTemplateHtml(data);
                                }
                            });

                            scope.showPolice = function(item) {
                                scope.$emit('safeInfoCardPoliceEvent', item);
                            };

                            scope.showCriminal = function(item) {
                                if(item.check == '1' && item.bm) {
                                    scope.$emit('map.showCriminalYJT', item.bm);
                                }
                            };

                            function loadTemplateHtml(data) {
                                var el = $compile(data)(scope);
                                element.html(el);
                                // 修改状态的信息牌
                                if(attrs['edittype'] == 'edit') {
                                    // 含有editable属性的元素
                                    var aEditable = $(element).find('[editable]');
                                    _.each(aEditable, function(edit) {
                                        $(edit).html('<input type="text" style="font-size:' + ($(edit).outerHeight() / 2) + 'px;height:' + ($(edit).outerHeight()) + 'px;line-height:' + ($(edit).outerHeight()) + 'px;width:100%;" value="' + $(edit).html() + '" />');
                                    });

                                    // 含有datasource属性的元素
                                    var aDatasource = $(element).find('[datasource]');
                                    _.each(aDatasource, function(source) {
                                        source = $(source);

                                        // 为每个数据项添加配置提示
                                        source.addClass('datasource');
                                        source.on('click', function(e) {
                                            if(scope.dsClick) {
                                                scope.dsClick(e, this);
                                            }
                                        });
                                    });

                                    // 含有editable属性的元素
                                    var aEditable = $(element).find('[fullscreentitle]');
                                    _.each(aEditable, function (edit) {
                                        $(edit).html('<input type="text" style="width:100%;" value="' + $(edit).html() + '" />');
                                    });
                                }



                                //若指令属性含有 loadds属性 则加载数据源
                                if(element.attr('loadds') !== undefined) {
                                    loadDataSource();
                                }

                                //查看是否为全屏版LED
                                var objLED = $(element).find('[fullscreenled]');
                                if(objLED.length) {
                                    loadFullLED(objLED);
                                }
                            }

                            //加载表格
                            function loadFullLED(el) {
                                scope.message = {
                                    content: [],
                                    syou: [],
                                    title: []
                                };

                                iAjax.post('security/map/map.do?action=getCriminalReportList').then(function(data) {
                                    if(data.result && data.result.rows && data.result.rows.length) {

                                        scope.message.content = data.result.rows[0].content;
                                        scope.message.syou = data.result.rows[0].syou;
                                        scope.message.title = data.result.rows[0].title;
                                        initNode();
                                    }
                                });

                                function initNode() {


                                    var titleEl = el.find('[fullscreenledclass]'),
                                        syouEl = el.find('[fullscreenledsyou]'),
                                        contentEl = el.find('[fullscreenledcontent]');

                                    ledInsert(titleEl, scope.message.title, 'width', 100 / scope.message.title.length, '', 'title');
                                    ledInsert(syouEl, scope.message.syou, 'height', 100 / scope.message.syou.length, '', '');
                                    ledInsert(contentEl, scope.message.content, 'height', 100 / scope.message.content.length, '', 'rows');

                                }
                            }

                            //插入内容
                            function ledInsert(element, array, target, value, child, _class, fun) {
                                var string = '';
                                if(element.length) {
                                    $.each(array, function(i, o) {
                                        string += '<div class="'+ _class +'" style="'+ target +': '+ value +'%">'+
                                        ((o instanceof Array) ? ledInsert('recursion', o, 'width', 100 / o.length, '', 'cols') : '<div><span>'+ (child ? o[child] : o) +'</span></div>')
                                        +'</div>'
                                    });

                                    string = fun ? fun(string) : string;

                                    if(element == 'recursion') {
                                        return string;
                                    } else {
                                        element.html($compile(string)(scope));
                                    }
                                }
                            }

                            function loadDataSource() {
                                var str = element.find('[ds-ou]').text();
                                var aSelect = element.find('[ds-item-id]');
                                var list = [];
                                if(aSelect.length) {
                                    _.each(aSelect, function(item) {
                                        list.push(item.getAttribute('ds-item-id'));
                                    });
                                }
                                if (str.length) {
                                    var syoufks = str.split('|'),
                                        time = scope.time ? scope.time.split(' ')[0] : '';

                                    _getInfocardDataList(syoufks, list, time, function (list) {
                                        _fillData(list);
                                    });
                                }
                            }

                            function _fillData(list) {
                                var sourceEl;
                                _.each(list, function(item) {

                                    sourceEl = element.find('[ds-item-id=' + item.sid + ']');
                                    if(item.value) {

                                        _.each(sourceEl, function(el) {
                                            el = $(el);

                                            if(typeof(item.value) == 'string') {
                                                el.text(item.value);
                                            }else {
                                                _.each(item.value, function(v) {
                                                    v.type = 'police';
                                                    if(v.type == 'police') {
                                                        el.append('<div class="info-items" ng-click="showPolice({coding:\'' + (v.coding) + '\'})" title="' + (v.name) + '">' + (v.name) + '</div>');
                                                    }else if(v.type == 'criminal') {
                                                        el.append('<div class="info-items" ng-click="showCriminal({bm:\'' + (v.bm) + '\', check:\'' + (v.check) + '\'})" title="' + (v.name) + '">' + (v.name) + '</div>');
                                                    }else {
                                                        el.append('<div class="info-items" title="' + (v.name) + '">' + (v.name) + '</div>');
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                                $compile(element.contents())(scope)
                            }

                            function _getInfocardDataList(syoufks, list, cretime, callback) {
                                var url = 'security/infocard.do?action=getImproveInfocardDataList',
                                    data = {
                                        filter: {
                                            syoufk: syoufks,
                                            sid: list,
                                            cretime: cretime
                                        }
                                    };

                                iAjax
                                    .post(url, data)
                                    .then(function (data) {
                                        if (data && data.result && data.result.rows && callback) {
                                            callback(data.result.rows);
                                        }
                                    });
                            }
                        }
                    }
                }
            }
        }
    ]);
});