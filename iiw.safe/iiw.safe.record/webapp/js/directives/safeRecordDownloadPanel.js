
/**
 * 录像下载指令
 *
 * @author - dwt
 * @date - 2016-08-31
 * @version - 0.1
 */
define([
    'app',
    'hammer',
    'moment',
    'safe/record/js/services/safeRecordDownload',
    'safe/js/services/safeImcsPlayer',
    'cssloader!safe/record/css/download'
], function(app, Hammer, moment) {
    app.directive('safeRecordDownloadPanel', ['$rootScope', '$compile', 'safeCamera', 'safeRecordDownload', 'safeImcsPlayer', 'iConfirm', 'iMessage', function($rootScope, $compile, safeCamera, safeRecordDownload, safeImcsPlayer, iConfirm, iMessage) {

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

        return {
            restrict: 'E',
            scope: true,
            template: getTemplate($.soa.getWebPath('iiw.safe.record') + '/view/download/panel.html'),
            replace: true,
            link: function($scope, $element) {

                var eFly = $element.find('.safe-record-download-fly'),
                    ePermission = $element.find('.safe-record-download-permission'),
                    eMask = $element.find('.safe-record-download-permission-mask'),
                    eCamera = $element.find('.safe-record-download-camera');

                var camera = safeCamera.create({
                    scope: $scope,
                    el: eCamera.get(0)
                });
                safeRecordDownload.init(camera);

                var eFlyHammer = new Hammer(eFly.get(0));

                eFlyHammer.on('panstart', function() {
                    eFly.data('x', parseInt(eFly.css('left')));
                    eFly.data('y', parseInt(eFly.css('top')));
                });

                eFlyHammer.on('panmove', function(e) {
                    var x = eFly.data('x') + e.deltaX,
                        y = eFly.data('y') + e.deltaY,
                        maxWidth = $('body').width(),
                        maxHeight = $('body').height(),
                        l = 70;

                    if(x + l >= maxWidth) {
                        x = maxWidth - l;
                    }else if(x <= 5) {
                        x = 5;
                    }

                    if(y + l >= maxHeight) {
                        y = maxHeight - l;
                    }else if(y <= 5) {
                        y = 5;
                    }

                    eFly.css({
                        left: x + 'px',
                        top: y + 'px'
                    });
                    e.preventDefault();
                });

                eFlyHammer.on('panend', function() {
                    if(window.localStorage) {
                        window.localStorage.setItem('safe-record-download-fly-x', parseInt(eFly.css('left')));
                        window.localStorage.setItem('safe-record-download-fly-y', parseInt(eFly.css('top')));
                    }
                });

                eFly.dblclick(function() {
                    safeRecordDownload.hideVideoWindow();
                    eMask.show('fade');
                    ePermission.show('fade');
                });

                eMask.click(function() {
                    eMask.hide('fade');
                    ePermission.hide('fade');
                    safeRecordDownload.showVideoWindow();
                });

                $scope.permission = {
                    downloadPath: safeRecordDownload.getDownloadPath(),
                    downloadList: safeRecordDownload.getDownloads(),
                    allDownloadPercentage: 100,
                    reloadItem: null,
                    saveDownloadPath: function() {
                        safeImcsPlayer.sendCmd({
                            "cmd": "OpenFileSelectDialog",
                            "type": 0
                        });
                        safeImcsPlayer.listenCmd('OpenFileSelectDialog', function (res) {
                            if (res.result == "ok") {
                                $scope.permission.downloadPath = res.file;
                                var p = $scope.permission.downloadPath;
                                if(p.charAt(p.length - 1) != '\\') {
                                    p += '\\';
                                    $scope.permission.downloadPath = p;
                                }

                                safeRecordDownload.setDownloadPath(p);
                                iMessage.show({
                                    level: 1,
                                    title: '录像下载路径',
                                    content: '保存成功'
                                });
                            } else {
                                console.log('取消选择录像下载存储路径')
                            }

                        });
                    },
                    stopDownload: function(item) {
                        safeRecordDownload.stopDownload(item.id);
                    },
                    reDownload: function(item) {
                        $scope.reloadItem = item;
                        iConfirm.show({
                            scope: $scope,
                            title: '确认重新下载？',
                            content: '确认重新下载后，【' + item.name + '】</br>将被新的下载覆盖',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'permission.confirmReDownloadSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'permission.confirmReDownloadCancel'
                            }],
                            close: 'permission.confirmReDownloadClose'
                        });
                    },
                    confirmReDownloadSuccess: function(id) {
                        var item = $scope.reloadItem;
                        item.statusName = '';
                        item.iplayer ? safeRecordDownload.fastDownload(item.devicefk, item.start, item.end, item.iplayer) : safeRecordDownload.addDownload(item.devicefk, item.start, item.end, 'reload');
                        $scope.reloadItem = null;
                        iConfirm.close(id);
                    },
                    confirmReDownloadCancel: function(id) {
                        $scope.reloadItem = null;
                        iConfirm.close(id);
                    },
                    confirmReDownloadClose: function() {
                        $scope.reloadItem = null;
                        return true;
                    },
                    closePermissionListPanel: function() {
                        eMask.hide('fade');
                        ePermission.hide('fade');
                        safeRecordDownload.showVideoWindow();
                    }
                };

                $scope.history = {
                    list: [],
                    starttime: moment().format('YYYY-MM-DD 00:00:00'),
                    endtime: moment().format('YYYY-MM-DD 23:59:59'),
                    totalSize: 0,
                    currentPage: 1,
                    totalPage: 1,
                    pageSize: 13,
                    filterValue: '',
                    getList: function() {
                        var that = this,
                            pageNo = this.currentPage,
                            pageSize = this.pageSize,
                            searchText = this.filterValue,
                            starttime = this.starttime,
                            endtime = this.endtime;

                        this.list = [];
                        safeRecordDownload.getDownloadHistoryList(pageNo, pageSize, searchText, starttime, endtime, function(list, params) {
                            that.list = list;

                            that.totalSize = params.totalSize;
                            that.pageSize = params.pageSize;
                            that.totalPage = params.totalPage;
                            that.currentPage = params.pageNo;
                        });
                    },
                    getListByKeybroad: function(event) {
                        if(event.keyCode == 13) {
                            $scope.history.getList();
                        }
                    },
                    change: function() {
                        $scope.history.currentPage = this.currentPage;
                        $scope.history.getList();
                    }
                };

                $scope.navigate = {
                    url: 'list',
                    go: function(url) {
                        this.url = url;
                        if(url == 'history') {
                            $scope.history.getList();
                        }
                    }
                };

                function countPercentage() {
                    var allDownloadPercentage = 0;

                    var aDownloading = safeRecordDownload.getDownloadings();
                    _.each(aDownloading, function(download) {
                        allDownloadPercentage += download.percentage;
                    });
                    $scope.permission.allDownloadPercentage = allDownloadPercentage > 0 ? (allDownloadPercentage / aDownloading.length).toFixed(2) + '%' : '下载中';

                    if($scope.permission.allDownloadPercentage < 100 || $scope.permission.allDownloadPercentage  == '下载中') {
                        eFly.show('fade');
                    }else {
                        eFly.hide('fade');
                    }
                }

                function addDownloadEvent() {
                    var aDownloading = safeRecordDownload.getDownloadings();
                    if(aDownloading.length > 0) {
                        var allDownloadPercentage = 0;
                        _.each(aDownloading, function(download) {
                            allDownloadPercentage += download.percentage;
                        });
                        $scope.permission.allDownloadPercentage = allDownloadPercentage > 0 ? (allDownloadPercentage / aDownloading.length).toFixed(2) + '%' : '下载中';
                    }else {
                        $scope.permission.allDownloadPercentage = '0.00%';
                    }
                    eFly.show('fade');
                }

                //还原位置
                if(window.localStorage) {
                    eFly.css({
                        left: (window.localStorage.getItem('safe-record-download-fly-x') || '100') + 'px',
                        top: (window.localStorage.getItem('safe-record-download-fly-y') || '100') + 'px'
                    });
                }
                safeRecordDownload.listenDownloadsStatus(countPercentage);
                safeRecordDownload.listenAddDownloadEvent(addDownloadEvent);

            }
        }
    }]);
});
