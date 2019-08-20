/**
 * 税务厅管理
 *
 * Created by llx on 2017/12/19.
 */
define([
    'app',
    'cssloader!system/tax/ebook/item/css/index.css'
], function(app) {
    app.controller('taxEbookItemController', [
        '$scope',
        'mainService',
        'iConfirm',
        'iMessage',
        '$state',
        'iAjax',
        'iToken',
        '$stateParams',
        '$filter',

        function($scope, mainService, iConfirm, iMessage, $state, iAjax, iToken, $stateParams, $filter) {
            mainService.moduleName = '电子书管理';
            $scope.title = '电子书管理';
            $scope.photoIndex = '';
            $scope.deletePhotoPath = '';
            $scope.deletePhotoIndex = '';
            $scope.taxEbookItem = {
                title: '',
                firstPhoto: {
                    name: '',
                    photoPath: '',
                    _photoPath: '',
                    idx: '99999'
                },
                lastPhoto: {
                    name: '',
                    photoPath: '',
                    _photoPath: '',
                    idx: '99998'
                },
                list: [
                    {
                        photoPath: '',
                        status: 'add'
                    }
                ],
                save: function() {
                    var list = [];
                    $.each($scope.taxEbookItem.list, function(i, o) {
                        list.push(o)
                    });
                    if($scope.taxEbookItem.firstPhoto.status && $scope.taxEbookItem.firstPhoto.status == 'add') {
                        var formData = new FormData();
                        formData.append('uploadBook', $scope.taxEbookItem.firstPhoto._photoPath, $scope.taxEbookItem.firstPhoto.name);
                        $.ajax({
                            type: 'post',
                            url: iAjax.formatURL('taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{name:"'+ $scope.taxEbookItem.title +'",type:"ebookDetail",issave:"ebookupdate", idx: '+ $scope.taxEbookItem.firstPhoto.idx +'}}'),
                            dataType: 'json',
                            data: formData,
                            async: true,
                            cache: false,
                            processData: false,
                            contentType: false,
                            enctype: 'multipart/form-data',
                            success: function() {
                            }
                        });
                    }
                    if($scope.taxEbookItem.lastPhoto.status && $scope.taxEbookItem.lastPhoto.status == 'add') {
                        var formData = new FormData();
                        formData.append('uploadBook', $scope.taxEbookItem.lastPhoto._photoPath, $scope.taxEbookItem.lastPhoto.name);
                        $.ajax({
                            type: 'post',
                            url: iAjax.formatURL('taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{name:"'+ $scope.taxEbookItem.title +'",type:"ebookDetail",issave:"ebookupdate", idx: '+ $scope.taxEbookItem.lastPhoto.idx +'}}'),
                            dataType: 'json',
                            data: formData,
                            async: true,
                            cache: false,
                            processData: false,
                            contentType: false,
                            enctype: 'multipart/form-data',
                            success: function() {
                            }
                        });
                    }
                    $.each(list, function(i, o) {
                        if(o.status == 'add') {
                            var formData = new FormData();
                            formData.append('uploadBook', o._photoPath, o._photoPath.name);
                            o.idx = i;
                            $.ajax({
                                type: 'post',
                                url: iAjax.formatURL('taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{name:"'+ $scope.taxEbookItem.title +'",type:"ebookDetail",issave:"ebookupdate", idx: '+ o.idx +'}}'),
                                dataType: 'json',
                                data: formData,
                                async: true,
                                cache: false,
                                processData: false,
                                contentType: false,
                                enctype: 'multipart/form-data',
                                success: function() {
                                }
                            });
                        }
                    });
                    showMessage(1, '保存成功!');
                },
                cancle: function() {
                    $state.go('system.tax.ebook');
                    $scope.$parent.taxEbook.getList();
                },
                addBookContent: function() {
                    $scope.taxEbookItem.list.push({
                        photoPath: '',
                        status: 'add'
                    })
                },
                deletePhoto: function(index) {
                    if($scope.taxEbookItem.list[index].id) {
                        $scope.deletePhotoPath = $scope.taxEbookItem.list[index].id;
                        $scope.deletePhotoIndex = index;
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '删除信息后将无法还原，是否确认删除？',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'taxEbookItem.confirmSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'taxEbookItem.confirmClose'
                            }]
                        });
                    } else {
                        $scope.taxEbookItem.list.splice(index, 1);
                    }
                },
                selectPhoto: function(index, event) {
                    if(event && event.target.tagName == 'IMG') {
                        $scope.photoIndex = index;
                        $('#uploadPhoto').click();
                    } else {
                        return;
                    }
                },
                confirmSuccess: function(id) {
                    iConfirm.close(id);
                    var data = {
                        filter: {
                            ids: [$scope.deletePhotoPath]
                        }
                    };
                    iAjax
                        .post('taxation/manage.do?action=delEbook', data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                showMessage(1, '删除成功!');
                                $scope.taxEbookItem.list.splice($scope.deletePhotoIndex, 1);
                            }
                        })
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                },
                uploadFile: function() {
                    var reader = new FileReader();
                    switch ($scope.photoIndex) {
                        case 'first':
                            reader.onload = function() {
                                $scope.taxEbookItem.firstPhoto.status = 'add';
                                $scope.taxEbookItem.firstPhoto.name = $('#uploadPhoto')[0].files[0].name;
                                $scope.taxEbookItem.firstPhoto.photoPath = reader.result;
                                $scope.taxEbookItem.firstPhoto._photoPath = $('#uploadPhoto')[0].files[0];
                            };
                            reader.readAsDataURL($('#uploadPhoto')[0].files[0]);
                            break;
                        case 'last':
                            reader.onload = function() {
                                $scope.taxEbookItem.lastPhoto.status = 'add';
                                $scope.taxEbookItem.lastPhoto.name = $('#uploadPhoto')[0].files[0].name;
                                $scope.taxEbookItem.lastPhoto.photoPath = reader.result;
                                $scope.taxEbookItem.lastPhoto._photoPath = $('#uploadPhoto')[0].files[0];
                            };
                            reader.readAsDataURL($('#uploadPhoto')[0].files[0]);
                            break;
                        default :
                            reader.onload = function() {
                                $scope.taxEbookItem.list[$scope.photoIndex].status = 'add';
                                $scope.taxEbookItem.list[$scope.photoIndex].photoPath = reader.result;
                                $scope.taxEbookItem.list[$scope.photoIndex]._photoPath = $('#uploadPhoto')[0].files[0];
                            };
                            reader.readAsDataURL($('#uploadPhoto')[0].files[0]);
                            break;
                    }
                }
            };

            if($stateParams.data) {
                if($stateParams.data.filepooldtl.length) {
                    $.each($stateParams.data.filepooldtl, function(i, o) {
                        o.photoPath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                        o._photoPath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                    });
                    var list = [];
                    $.each($stateParams.data.filepooldtl, function(index, item) {
                        list.push(item);
                    });
                    list.shift( );
                    list.pop( );
                    $scope.taxEbookItem.firstPhoto.photoPath = $stateParams.data.filepooldtl[0].photoPath;
                    $scope.taxEbookItem.firstPhoto._photoPath = $stateParams.data.filepooldtl[0]._photoPath;
                    $scope.taxEbookItem.lastPhoto.photoPath = $stateParams.data.filepooldtl[$stateParams.data.filepooldtl.length - 1].photoPath;
                    $scope.taxEbookItem.lastPhoto._photoPath = $stateParams.data.filepooldtl[$stateParams.data.filepooldtl.length - 1]._photoPath;
                    $scope.taxEbookItem.list = list;
                    $scope.taxEbookItem.title = $stateParams.data.name;
                }
            }

            function showMessage(level, content) {
                var json = {
                    title: $scope.title,
                    content: content,
                    level: level
                };
                iMessage.show(json);
            }
        }

    ])
});

