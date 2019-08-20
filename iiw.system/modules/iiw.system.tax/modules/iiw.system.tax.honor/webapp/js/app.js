/**
 * 税务厅管理
 *
 * Created by llx on 2017/12/19.
 */
define([
    'app',
    'safe/js/directives/safeViewerDirective',
    'cssloader!system/tax/honor/css/index.css'
], function(app) {
    app.controller('taxHonorController', [
        '$scope',
        'mainService',
        'iConfirm',
        'iMessage',
        'iAjax',
        'iToken',
        'iTimeNow',
        '$filter',

        function($scope, mainService, iConfirm, iMessage, iAjax, iToken, iTimeNow, $filter) {
            mainService.moduleName = '时间轴管理';
            var tempVar = 0;
            var delItem = '';
            $scope.title = '时间轴管理';
            $scope.photoPath = '';
            $scope.savetype = '';
            $scope.tempmonth = '';
            $scope.tempyear = '';
            $scope.monthList = [
                {data: '01', type: 'month'},
                {data: '02', type: 'month'},
                {data: '03', type: 'month'},
                {data: '04', type: 'month'},
                {data: '05', type: 'month'},
                {data: '06', type: 'month'},
                {data: '07', type: 'month'},
                {data: '08', type: 'month'},
                {data: '09', type: 'month'},
                {data: '10', type: 'month'},
                {data: '11', type: 'month'},
                {data: '12', type: 'month'}
            ];
            $scope.systemTaxHonor = {
                addNum: '1',
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalSize: 0,
                list: [],
                filterValue: '',
                add: function() {
                    iConfirm.show({
                        scope: $scope,
                        title: '时间轴管理:',
                        content: '<div style="margin-top:30px;">' +
                                    '<span style="line-height: 39px;">添加数量:</span>' +
                                    '<input type="text" class="form-control" ng-model="systemTaxHonor.addNum" style="width:320px;float:right;"/>' +
                                '</div>',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'systemTaxHonor.addItem'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'systemTaxHonor.confirmClose'
                        }]
                    });
                },
                mod: function(item) {
                    //var aSelect = _.where($scope.systemTaxHonor.list, {checked: true});
                    //if(aSelect.length) {
                    //    $.each(aSelect, function(i, o) {
                    //        o.status = 'mod';
                    //    });
                    //    $scope.savetype = 'mod';
                    //} else {
                    //    showMessage('请选择需要修改的内容!', 3);
                    //}


                    if(item) {
                        item.status = 'mod';
                        $scope.savetype = 'mod';
                    } else {
                        showMessage('请选择需要修改的内容!', 3);
                    }
                },
                del: function(item) {
                    //var aSelect = _.where($scope.systemTaxHonor.list, {checked: true});
                    //if(aSelect.length) {
                    //    iConfirm.show({
                    //        scope: $scope,
                    //        title: '确认删除？',
                    //        content: '删除信息后将无法还原，是否确认删除？',
                    //        buttons: [{
                    //            text: '确认',
                    //            style: 'button-primary',
                    //            action: 'systemTaxHonor.delHonor'
                    //        }, {
                    //            text: '取消',
                    //            style: 'button-caution',
                    //            action: 'systemTaxHonor.confirmClose'
                    //        }]
                    //    });
                    //} else {
                    //    showMessage('请选择需要删除的内容!', 3);
                    //}

                    delItem = item;
                    if(item) {
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '删除信息后将无法还原，是否确认删除？',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'systemTaxHonor.delHonor'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'systemTaxHonor.confirmClose'
                            }]
                        });
                    } else {
                        showMessage('请选择需要删除的内容!', 3);
                    }
                },
                select: function(item, event) {
                    if(event.target.tagName != 'INPUT' && event.target.tagName != 'BUTTON'){
                        item.checked = !item.checked;
                    } else {
                        return;
                    }
                },
                addItem: function(id) {
                    iConfirm.close(id);
                    $scope.savetype = 'add';
                    for(var i = 0; i < $scope.systemTaxHonor.addNum; i++) {
                        $scope.systemTaxHonor.list.unshift(
                            {title: '', rq: $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd H:m:s'), content: '', photo: '', status: 'add'}
                        )
                    }
                },
                save: function() {
                    var list = _.where($scope.systemTaxHonor.list, {status: $scope.savetype});
                    var url = 'taxation/manage.do?action=updateHonor';
                    var data = {
                        rows: list
                    };
                    iAjax
                        .post(url, data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                $scope.savetype = '';
                                showMessage('保存成功!', 1);
                                $scope.systemTaxHonor.getList();
                            }
                        })
                },
                cancle: function() {
                    $scope.savetype = '';
                    $scope.systemTaxHonor.getList();
                },
                delHonor: function(id) {
                    //var aSelect = _.where($scope.systemTaxHonor.list, {checked: true});
                    //var list = [];
                    //$.each(aSelect, function(i, o) {
                    //    list.push(o.id);
                    //});
                    var data = {
                        filter: {
                            ids: [delItem.id]
                        }
                    };
                    iAjax
                        .post('taxation/manage.do?action=delHonorList', data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                iConfirm.close(id);
                                showMessage('删除成功!', 1);
                                $scope.systemTaxHonor.getList();
                            }
                        })
                },
                getList: function(type) {
                    switch (type) {
                        case 'year' :
                            $scope.systemTaxHonor.filterValue = '2018';
                            break;
                        case 'month' :
                            $scope.systemTaxHonor.filterValue = $scope.tempyear + '-' + $scope.tempmonth;
                            break;
                        default:
                            $scope.systemTaxHonor.filterValue = '';
                            type = '';
                    }
                    var data = {
                        filter: {
                            searchtext: '',
                            type: type,
                            time: $scope.systemTaxHonor.filterValue
                        },
                        params: {
                            pageNo: $scope.systemTaxHonor.currentPage,
                            pageSize: $scope.systemTaxHonor.pageSize
                        }
                    };
                    iAjax
                        .post('taxation/manage.do?action=getHonorList', data)
                        .then(function(data) {
                            if(data.result && data.result.rows) {
                                $.each(data.result.rows, function(i, o) {
                                    o.image = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.image;
                                });
                                $scope.systemTaxHonor.list = data.result.rows;
                                $scope.systemTaxHonor.currentPage = data.result.params.pageNo;
                                $scope.systemTaxHonor.pageSize = data.result.params.pageSize;
                                $scope.systemTaxHonor.totalPage = data.result.params.totalPage;
                                $scope.systemTaxHonor.totalSize = data.result.params.totalSize;
                            }
                        })
                },
                showPhoto: function(path) {
                    if(!path) {
                        $scope.photoPath = '';
                        showMessage('当前没有图片!', 3)
                    } else {
                        $scope.photoPath = path;
                        $('#taxHonorPhotoDialog').click();
                    }
                },
                uploadPhoto: function(index) {
                    $('#taxHonorUploadPhoto').click();
                    tempVar = index;
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                },
                uploadPhotoEvent: function() {
                    var reader = new FileReader();
                    reader.onload = function() {
                        $scope.systemTaxHonor.list[tempVar].image = reader.result;
                        $scope.systemTaxHonor.list[tempVar]._image = $('#taxHonorUploadPhoto')[0].files[0];
                    };
                    reader.readAsDataURL($('#taxHonorUploadPhoto')[0].files[0]);
                }
            };

            function showMessage(content, level) {
                var json = {
                    title: $scope.title,
                    content: content,
                    level: level
                };
                iMessage.show(json);
            }

            $scope.$on('taxHonorControllerOnEvent', function() {
                $scope.systemTaxHonor.getList();
                $scope.timeList = [];
                var date = new Date;
                var current = date.getFullYear();
                for (var i = 0; i <= 10; i++) {
                    $scope.timeList.unshift({data: (current - i).toString(), type: 'year'})
                }
            });
        }

    ])
});

