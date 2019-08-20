/**
 * 税务厅管理
 *
 * Created by llx on 2017/12/19.
 */
define([
    'app',
    'system/tax/ebook/lib/magazine/modernizr',
    'cssloader!system/tax/ebook/css/index.css'
], function(app) {
    app.controller('taxEbookController', [
        '$scope',
        'mainService',
        'iConfirm',
        'iMessage',
        '$state',
        'iAjax',
        'iToken',
        function($scope, mainService, iConfirm, iMessage, $state, iAjax, iToken) {
            var url = $.soa.getWebPath('iiw.system.tax.ebook');
            var delItem = null;
            mainService.moduleName = '电子书管理';
            $scope.title = '电子书管理';
            $scope.taxEbook = {
                list: [],
                bookDetail: [],
                filterValue: '',
                currentPage: 1,
                pageSize: 12,
                totalSize: 0,
                totalPage: 0,
                add: function() {
                    var params = {
                        data:''
                    };
                    $state.params = params;
                    $state.go('system.tax.ebook.item', params)
                },
                mod: function(item) {
                    //var aSelect = _.where($scope.taxEbook.list, {checked: true});
                    //if(aSelect.length > 1) {
                    //    showMessage(3, '请选择1本电子书进行修改!');
                    //    return;
                    //} else {
                    //    var params = {
                    //        data:aSelect[0]
                    //    };
                    //    $state.params = params;
                    //    $state.go('system.tax.ebook.item', params)
                    //}

                    if(!item) {
                        showMessage(3, '请选择1本电子书进行修改!');
                        return;
                    } else {
                        var params = {
                            data:item
                        };
                        $state.params = params;
                        $state.go('system.tax.ebook.item', params)
                    }
                },
                del: function(item) {
                    //var aSelect = _.where($scope.taxEbook.list, {checked: true});
                    //if(aSelect.length) {
                    //    iConfirm.show({
                    //        scope: $scope,
                    //        title: '确认删除？',
                    //        content: '删除信息后将无法还原，是否确认删除？',
                    //        buttons: [{
                    //            text: '确认',
                    //            style: 'button-primary',
                    //            action: 'taxEbook.confirmSuccess'
                    //        }, {
                    //            text: '取消',
                    //            style: 'button-caution',
                    //            action: 'taxEbook.confirmClose'
                    //        }]
                    //    });
                    //} else {
                    //    showMessage(3, '请选择删除的电子书!')
                    //}


                    if(item) {
						delItem = item;
						
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '删除信息后将无法还原，是否确认删除？',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'taxEbook.confirmSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'taxEbook.confirmClose'
                            }]
                        });
                    } else {
                        showMessage(3, '请选择删除的电子书!')
                    }
                },
                confirmSuccess: function(id) {
                    iConfirm.close(id);
                    //var aSelect = _.where($scope.taxEbook.list, {checked: true});
                    //var list = [];
                    //$.each(aSelect, function(i, o) {
                    //    list.push(o.name);
                    //});
                    var data = {
                        filter: {
                            names: [delItem.name]
                        }
                    };
                    iAjax
                        .post('taxation/manage.do?action=delEbook', data)
                        .then(function(data) {
                            if(data && data.status == 1) {
								delItem = null;
                                showMessage(1, '删除成功!');
                                $scope.taxEbook.getList();
                            }
                        })
                },
                confirmClose: function(id) {
					delItem = null;
                    iConfirm.close(id);
                },
                select: function(item, event) {
                    if(event.target.tagName != 'BUTTON') {
                        item.checked = !item.checked;
                    }
                },
                getList: function() {
                    var data = {
                        filter: {
                            name: $scope.taxEbook.filterValue
                        },
                        params: {
                            pageNo: $scope.taxEbook.currentPage,
                            pageSize: $scope.taxEbook.pageSize
                        }
                    };
                    iAjax
                        .post('taxation/manage.do?action=getEbook', data)
                        .then(function(data) {
                            if(data.result && data.result.rows) {
                                $.each(data.result.rows, function(i, o) {
									if(!o.filepooldtl) {
										o.filepooldtl = [];
									}
                                    o.filepooldtl.push({path: o.tail});
                                    o.filepooldtl.unshift({path: o.first});
                                    o.first = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.first;
                                });
                                $scope.taxEbook.list = data.result.rows;
                                $scope.taxEbook.currentPage = data.result.params.pageNo;
                                $scope.taxEbook.pageSize = data.result.params.pageSize;
                                $scope.taxEbook.totalSize = data.result.params.totalSize;
                                $scope.taxEbook.totalPage = data.result.params.totalPage;
                            }
                        })
                },
                showBook: function(item) {
                    $.each(item.filepooldtl, function(i, o) {
                        o.photoPath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                        o._photoPath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                    });
                    $scope.taxEbook.bookDetail = item.filepooldtl;
                    $scope.toggleEbook = true;
                    setTimeout(function() {
                        loadApp();

                    }, 300)
                },
                hideBook: function(event) {
                    $scope.toggleEbook = false;
                }
            };

        $scope.$on('taxEbookControllerOnEvent', function() {
            $scope.taxEbook.getList();
        });

        function loadApp() {
            // Create the flipbook
            $('.flipbook').turn({
                // Width

                width:1366,

                // Height

                height:768,

                // Elevation

                elevation: 50,

                // Enable gradients

                gradients: true,

                // Auto center this flipbook

                autoCenter: true,

                acceleration: true

            });
        }

        yepnope({
            test : Modernizr.csstransforms,
            yep: [url + '/lib/magazine/turn.js'],
            nope: [url + '/lib/magazine/turnhtml.js'],
            both: [url + '/css/magazine.css']
        });

        function showMessage(level, content) {
            var json = {
                title: $scope.title,
                content: content,
                level: level
            };
            iMessage.show(json);
        }

        }])
});

