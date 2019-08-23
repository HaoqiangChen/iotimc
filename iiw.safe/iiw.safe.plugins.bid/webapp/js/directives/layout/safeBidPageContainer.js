/**
 * 数据交换中心
 *
 * @author - zcl
 * @date - 2018-11-07
 * @version - 0.1
 */
define([
    'app',
    'cssloader!safe/plugins/bid/css/page',
    'cssloader!safe/plugins/bid/css/jstree/themes/default/style',
    'cssloader!safe/plugins/bid/css/select'
], function (app) {
    function getTemplate(url) {
        var result = '';

        $.ajax({
            url: url,
            async: false,
            cache: false,
            dataType: 'text'
        }).success(function(data) {
            result = data;
        });

        return result;
    }

    app.directive('safeBidPageContainer', ['$compile', 'iAjax', '$timeout', 'iMessage', 'yjtService',
        function ($compile, iAjax, $timeout, iMessage, yjtService) {
            return {
                restrict: 'AE',
                scope: {
                    templateHtml: '=templateHtml'
                },
                compile: function () {
                    return {
                        post: function (scope, element, attrs) {
                            scope.selectAllList = false;


                            scope.list = [
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '罪犯信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '社矫信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '检察院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'},
                                {name: '法院信息库', type: '关系型数据库', cretime: '2018-10-08 11:00:00', modtime: '2018-10-28 11:00:00', notes: '关系型数据库'}
                            ];

                            scope.jjDataList = [
                                {dataproject: '收监管理', dataset: '狱政数据库', unit: '监狱', countnum: '6131123', donenum: '6131123', undonum: '0'},
                                {dataproject: '罪犯考核', dataset: '狱政数据库', unit: '监狱', countnum: '3234112', donenum: '3234112', undonum: '0'},
                                {dataproject: '离监管理', dataset: '狱政数据库', unit: '监狱', countnum: '123123', donenum: '123123', undonum: '0'},
                                {dataproject: '减刑假释', dataset: '积分考评奖惩数据库', unit: '监狱', countnum: '123343', donenum: '123343', undonum: '0'},
                                {dataproject: '日常计分', dataset: '积分考评奖惩数据库', unit: '监狱', countnum: '1234562', donenum: '1234562', undonum: '0'},
                                {dataproject: '体检记录', dataset: '生活卫生数据库', unit: '监狱', countnum: '456223', donenum: '456223', undonum: '0'},
                                {dataproject: '档案基本信息', dataset: '教改数据库', unit: '监狱', countnum: '3354123', donenum: '3354123', undonum: '0'},
                                {dataproject: '受补助记录', dataset: '安置帮教系统', unit: '安置帮教', countnum: '565672', donenum: '565672', undonum: '0'},
                                {dataproject: '技能培训', dataset: '社区矫正人员数据库', unit: '社区矫正', countnum: '1202131', donenum: '1202131', undonum: '0'}
                            ];

                            scope.gjfDataList = [
                                {dataproject: '人口基本信息', dataset: '全国人口基本信息资源库', unit: '公安', countnum: '3234112', donenum: '3234112', undonum: '0'},
                                {dataproject: '在逃人员信息', dataset: '全国在逃人员信息资源库', unit: '公安', countnum: '123123', donenum: '123123', undonum: '0'},
                                {dataproject: '违法犯罪人员信息', dataset: '全国违法犯罪人员信息资源库', unit: '公安', countnum: '123343', donenum: '123343', undonum: '0'},
                                {dataproject: '法院办案相关信息', dataset: '法院办案相关信息系统', unit: '法院', countnum: '1234562', donenum: '1234562', undonum: '0'},
                                {dataproject: '监所监督、申诉控告、渎职贪污信息', dataset: '监所监督、申诉控告、渎职贪污等系统', unit: '检察', countnum: '456223', donenum: '456223', undonum: '0'}
                            ];

                            scope.imgPath = $.soa.getWebPath('iiw.safe.plugins.bid') + '/';

                            scope.$on('safe.datacollection.page.change', function(e, data) {
                                scope.templateUrl = data.params.url;
                                scope.moudleTitle = data.params.name;
                                scope.tableWidth = {
                                    width: 30 * 100
                                };
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + data.params.url + '.html');
                                loadTemplateHtml(htmlInfo);
                                if(scope.templateUrl == 'metadataCatalogManagement') {
                                    initMetaCatalogTree();
                                } else if(scope.templateUrl == 'yjtFile') {
                                    scope.searchCriminal();
                                }
                            });

                            function loadTemplateHtml(data) {
                                var el = $compile(data)(scope);
                                element.html(el);

                                if(scope.templateUrl == 'comprehensiveSituation') {
                                    setNumberStyle();
                                }
                            }

                            //数据治理与共享交换子平台首页
                            function init() {
                                scope.moudleTitle = "数据汇聚综合情况";
                                scope.templateUrl = 'comprehensiveSituation';
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '.html');
                                loadTemplateHtml(htmlInfo);
                            }

                            init();

                            scope.selectAllRow = function() {
                                scope.selectAllList = !scope.selectAllList;
                                $.each(scope.list, function(i, o) {
                                    o.checked = scope.selectAllList;
                                });
                            };

                            scope.add = function() {
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_mod.html');
                                loadTemplateHtml(htmlInfo);
                            };

                            scope.save = function() {
                                scope.entityItem = null;
                                goToIndexPage();
                            };

                            scope.back = function() {
                                scope.entityItem = null;
                                goToIndexPage();
                            };

                            function goToIndexPage() {
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '.html');
                                loadTemplateHtml(htmlInfo);
                            }

                            //查看汇聚模型明细
                            scope.showAggregationDetail = function(row) {
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_mod.html');
                                loadTemplateHtml(htmlInfo);
                                scope.detailsInfo = row.child;
                            };

                            scope.showQuestionDetail = function(row) {
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_mod.html');
                                loadTemplateHtml(htmlInfo);
                                scope.detailsInfo = row;
                            };

                            scope.testConnect = function() {
                                iMessage.show({
                                    level: 1,
                                    title: '消息提醒！',
                                    content: '连接正常'
                                }, false);
                            };

                            scope.tableDetailList = [
                                {name: 'daxx', notes: '档案信息', dbname: '罪犯信息库', totalRecord: '53122', columnTotal: '120'},
                                {name: 'shgx', notes: '社会关系', dbname: '罪犯信息库', totalRecord: '303122', columnTotal: '15'},
                                {name: 'bqjl', notes: '捕前简历', dbname: '罪犯信息库', totalRecord: '53122', columnTotal: '31'},
                                {name: 'fgdj', notes: '分管等级', dbname: '罪犯信息库', totalRecord: '123043', columnTotal: '8'},
                                {name: 'yzjc', notes: '狱政奖惩', dbname: '罪犯信息库', totalRecord: '123146', columnTotal: '6'},
                                {name: 'hjxx', notes: '会见信息', dbname: '罪犯信息库', totalRecord: '423342', columnTotal: '12'}
                            ];

                            scope.showDatabaseDetail = function(row) {
                                scope.dbname = row.name;
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_mod.html');
                                loadTemplateHtml(htmlInfo);
                            };

                            scope.showTableDetail = function(row) {
                                scope.tbname = row.notes;
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_recordList.html');
                                loadTemplateHtml(htmlInfo);
                                scope.tableWidth = {
                                    width: 20 * 100
                                };
                            };

                            scope.goToTablePage = function() {
                                scope.tbname = '';
                                var htmlInfo = getTemplate($.soa.getWebPath('iiw.safe.plugins.bid') + '/view/main/' + scope.templateUrl + '_mod.html');
                                loadTemplateHtml(htmlInfo);
                            };

                            scope.prisonList = [
                                /*{
                                    xm: '张X强',
                                    bm: '11000000001',
                                    xb: '男',
                                    csny: '1968-10-23',
                                    gj: '中国',
                                    jg: '河北',
                                    jtzz: '石家庄市XX区XX路24号',
                                    zm: '偷窃罪',
                                    szdw: '河北省XX监狱',
                                    whcd: '小学',
                                    zy: '无业',
                                    xq: '05_10_10',
                                    xqqr: '2017-10-20',
                                    xqzr: '2022-10-30',
                                    sflf: '否',
                                    jkzk: '良好',
                                    sfzdf: '否'
                                }, {
                                    name: '李X',
                                    bm: '11000000002',
                                    xb: '男',
                                    csny: '1968-10-23',
                                    gj: '中国',
                                    jg: '河北',
                                    jtzz: '石家庄市XX区XX路24号',
                                    zm: '偷窃罪',
                                    szdw: '河北省XX监狱',
                                    whcd: '小学',
                                    zy: '无业',
                                    xq: '05_10_10',
                                    xqqr: '2017-10-20',
                                    xqzr: '2022-10-30',
                                    sflf: '否',
                                    jkzk: '良好',
                                    sfzdf: '否'
                                }, {
                                    name: '洪X',
                                    bm: '11000000003',
                                    xb: '男',
                                    csny: '1968-10-23',
                                    gj: '中国',
                                    jg: '河北',
                                    jtzz: '石家庄市XX区XX路24号',
                                    zm: '偷窃罪',
                                    szdw: '河北省XX监狱',
                                    whcd: '小学',
                                    zy: '无业',
                                    xq: '05_10_10',
                                    xqqr: '2017-10-20',
                                    xqzr: '2022-10-30',
                                    sflf: '否',
                                    jkzk: '良好',
                                    sfzdf: '否'
                                }, {
                                    name: '王X强',
                                    bm: '11000000004',
                                    xb: '男',
                                    csny: '1968-10-23',
                                    gj: '中国',
                                    jg: '河北',
                                    jtzz: '石家庄市XX区XX路24号',
                                    zm: '偷窃罪',
                                    szdw: '河北省XX监狱',
                                    whcd: '小学',
                                    zy: '无业',
                                    xq: '05_10_10',
                                    xqqr: '2017-10-20',
                                    xqzr: '2022-10-30',
                                    sflf: '否',
                                    jkzk: '良好',
                                    sfzdf: '否'
                                }, {
                                    xm: '肖X',
                                    bm: '11000000005',
                                    xb: '男',
                                    csny: '1968-10-23',
                                    gj: '中国',
                                    jg: '河北',
                                    jtzz: '石家庄市XX区XX路24号',
                                    zm: '偷窃罪',
                                    szdw: '河北省XX监狱',
                                    whcd: '小学',
                                    zy: '无业',
                                    xq: '05_10_10',
                                    xqqr: '2017-10-20',
                                    xqzr: '2022-10-30',
                                    sflf: '否',
                                    jkzk: '良好',
                                    sfzdf: '否'
                                }*/
                            ];

                            function initMetaCatalogTree() {
                                var treeNodes = [];
                                var list1 = [], list2 = [];
                                var arr = {
                                    'id': '0',
                                    'parent': '#',
                                    'text': '源数据目录管理',
                                    'state': {'opened': true, 'selected': false}
                                };
                                list1.push(arr);

                                list2.push({
                                    'id': 1,
                                    'parent': '0',
                                    'text': '业务元数据',
                                    'type': 'BN',
                                    'state': {'opened': false, 'selected':true}
                                });

                                list2.push({
                                    'id': 101,
                                    'parent': '1',
                                    'text': '监狱业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 102,
                                    'parent': '1',
                                    'text': '社矫矫正业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 103,
                                    'parent': '1',
                                    'text': '安置帮教业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 104,
                                    'parent': '1',
                                    'text': '公安业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 105,
                                    'parent': '1',
                                    'text': '检察院业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 106,
                                    'parent': '1',
                                    'text': '法院业务元数据',
                                    'type': 'B',
                                    'state': {'opened': false, 'selected':false}
                                });

                                list2.push({
                                    'id': 2,
                                    'parent': '0',
                                    'text': '技术元数据',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 201,
                                    'parent': '2',
                                    'text': '监狱库',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 20101,
                                    'parent': '201',
                                    'text': '自然信息表',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 20102,
                                    'parent': '201',
                                    'text': '证件信息表',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 20103,
                                    'parent': '201',
                                    'text': '地址信息表',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 20104,
                                    'parent': '201',
                                    'text': '捕前简历表',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 202,
                                    'parent': '2',
                                    'text': '社矫库',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 203,
                                    'parent': '2',
                                    'text': '安置帮教库',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 204,
                                    'parent': '2',
                                    'text': '公安库',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 205,
                                    'parent': '2',
                                    'text': '检察院库',
                                    'state': {'opened': false, 'selected':false}
                                });
                                list2.push({
                                    'id': 206,
                                    'parent': '2',
                                    'text': '法院库',
                                    'type': 'T',
                                    'state': {'opened': false, 'selected':false}
                                });
                                treeNodes = _.union(list1, list2);

                                $("#safe-bid-metadata-tree-list").on('select_node.jstree', function (e, data) {
                                    treeNodeClickEvent(data);
                                }).jstree({
                                    "core" : {
                                        'animation': 0,
                                        'check_callback': true,
                                        'force_text': true,
                                        'themes': {'stripes':true},
                                        'data': treeNodes
                                    },
                                    'plugins': ['changed', 'search'],
                                    'checkbox': {
                                        'keep_selected_style': false,
                                        'three_state': true,
                                        'tie_selection': false
                                    },
                                    themes: {
                                        theme: 'classic',
                                        dots: true,
                                        icons: false
                                    }
                                });
                            }

                            scope.pageMode = 'list';
                            scope.showBusinessPage = true;
                            function treeNodeClickEvent(data) {
                                scope.pageMode = 'list';
                                if(data.node.original.type == 'BN') {
                                    scope.showModBtn = false;
                                    scope.showBusinessPage = true;
                                } else if(data.node.original.type == 'B') {
                                    scope.showBusinessPage = true;
                                    scope.showModBtn = true;
                                } else if(data.node.original.type == 'T') {
                                    scope.showBusinessPage = false;
                                } else {
                                    scope.showModBtn = 'hide';
                                    scope.showBusinessPage = 'hide';
                                }
                            }

                            scope.tableInfoList = [
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'BM', columnnotes: '编码', coltype: 'nvarchar', columnlength: '15'},
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'XM', columnnotes: '姓名', coltype: 'nvarchar', columnlength: '30'},
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'XB', columnnotes: '性别', coltype: 'nvarchar', columnlength: '2'},
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'CSNY', columnnotes: '出生年月', coltype: 'date', columnlength: ''},
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'JG', columnnotes: '籍贯', coltype: 'nvarchar', columnlength: '100'},
                                {tbname: 'zrxx', tbnotes:'自然信息', columnname: 'ZM', columnnotes: '罪名', coltype: 'nvarchar', columnlength: '100'}
                            ];
                        }
                    }
                }
            }
        }
    ]);
});