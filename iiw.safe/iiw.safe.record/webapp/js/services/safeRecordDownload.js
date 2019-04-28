/**
 * 录像下载服务
 *
 * @author - dwt
 * @date - 2016-08-31
 * @version - 0.1
 */
define(['app'], function(app) {
    app.service('safeRecordDownload', [
        '$interval',
        '$filter',
        'iMessage',
        'iAjax',

        function($interval, $filter, iMessage, iAjax) {

            var camera = null;
            var iplayer = null;
            var path = (window.localStorage ? window.localStorage.getItem('safeRecordDownloadPath') || 'D:/IOTIMC/download/' : 'D:/IOTIMC/download/');

            var aDownload = [];
            var aDownloadStatusEvents = [];                 //监听下载进度的注册事件
            var aAddDownloadEvents = [];                    //监听开始下载的注册事件
            var downloadStatus = {
                '-18': '写文件错误',
                '-14': 'rcid无效(回放url失效)',
                '-13': '找不到录像通道',
                '12': '连接服务器失败',
                '11': '未知错误',
                '-1': 'dlid 无效',
                '1': '正在与流媒体服务器协商数据',
                '2': '准备下载',
                '3': '下载中',
                '5': '下载完成',
                '6': '下载中断'                                //自定义的类型
            };

            function _init(obj) {
                camera = obj;
            }

            function _setDownloadPath(p) {
                if(window.localStorage) {
                    window.localStorage.setItem('safeRecordDownloadPath', p);
                }
                path = p;
            }

            function _getDownloadPath() {
                return path;
            }

            function _listenDownloadStatus(callback) {
                aDownloadStatusEvents.push(callback);
            }

            function _listenAddDownloadEvent(callback) {
                aAddDownloadEvents.push(callback);
            }

            function _getDownloads() {
                return aDownload;
            }

            function _getDownloadings() {
                var result = _.filter(aDownload, function(download) {
                    return (download.percentage < 100 && (download.status == 3 || download.status == 6));
                });
                return result;
            }

            function _addDownload(devicefk, start, end, reload) {
                if(camera && camera.recordGetDownloadUrl) {

                    var name = camera.getname(devicefk),
                        sdate = $filter('date')(start, 'yyyyMMdd'),
                        stime = $filter('date')(start, 'HHmmss'),
                        edate = $filter('date')(end, 'yyyyMMdd'),
                        etime = $filter('date')(end, 'HHmmss'),
                        fileName = name + '_' + sdate + stime + '-' + edate + etime + '.mp4',
                        pathName = path + sdate + '/' + fileName;

                    var exitDownload = _.find(aDownload, {devicefk: devicefk, start: start, end: end});
                    console.log(!exitDownload);

                    if(!exitDownload) {

                        camera.recordGetDownloadUrl(devicefk, start, end, pathName, function(dlid) {
                            console.log(dlid);

                            console.log(aAddDownloadEvents);
                            _.each(aAddDownloadEvents, function(event) {
                                event();
                            });

                            console.log(fileName, start, end);
                            saveDownloadLog(fileName, start, end);

                            var oDownload = {
                                id: dlid,
                                devicefk: devicefk,
                                originPath: path,
                                path: path,
                                name: fileName,
                                start: start,
                                end: end,
                                status: 0,
                                percentage: 0,
                                files: 0,                               //下载文件数，若超过1G则自动创建新的文件保存下载内容
                                speed: null,
                                pos: null,
                                timer: null
                            };
                            aDownload.push(oDownload);

                            oDownload.timer = $interval(function() {
                                queryDownloadProgress(dlid);
                            }, 1000);

                        });
                    } else if(reload) {
                        pathName = exitDownload.path + sdate + '/' + fileName;
                        camera.recordGetDownloadUrl(devicefk, start, end, pathName, function(dlid) {
                            if(!(exitDownload.status > 0 && exitDownload.status < 5)) {
                                exitDownload.id = dlid;
                                exitDownload.status = 0;
                                exitDownload.percentage = 0;
                                exitDownload.files = 0;
                                exitDownload.speed = null;
                                exitDownload.pos = null;

                                if(exitDownload.timer) {
                                    $interval.cancel(exitDownload.timer);
                                }
                                exitDownload.timer = $interval(function() {
                                    queryDownloadProgress(exitDownload.id);
                                }, 1000);
                            }
                        });
                    } else {
                        iMessage.show({
                            level: 2,
                            title: '录像下载',
                            content: '【' + fileName + '】' + (exitDownload.percentage < 100 ? '已在下载队列' : '已完成下载')
                        });
                    }

                }
            }

            function _fastDownload(devicefk, start, end, player) {
                var date = $filter('date')(start, 'yyyyMMdd');
                var stime = $filter('date')(start, 'yyyyMMddHHmmss');
                var etime = $filter('date')(end, 'yyyyMMddHHmmss');
                var devicename = camera.getname(devicefk);

                var filepath = path + date + '/' + (devicename || devicefk) + '-';
                var name = filepath + stime + '-' + etime + '.mp4';

                var isExist = _.find(aDownload, {devicefk: devicefk, start: start, end: end});
                if(!isExist) {
                    aDownload.push({
                        id: devicefk,
                        devicefk: devicefk,
                        originPath: path + date,
                        path: path + date + '/',
                        name: name,
                        status: '',
                        start: start,
                        end: end,
                        percentage: 0,
                        files: 0,                               //下载文件数，若超过1G则自动创建新的文件保存下载内容
                        iplayer: player
                    });

                    saveDownloadLog(name, start, end);
                }

                iplayer = player;

                player.object.recordGetDownloadUrl(devicefk, start, end, filepath, function(e) {
                    var download = _.find(aDownload, {devicefk: e.devicefk, start: start, end: end});
                    if(download) {
                        var r = e.data.split(',');
                        download.status = r[0];
                        download.percentage = r[1]; //(download.percentage + r[1]) / r[4];
                        _.each(aDownloadStatusEvents, function(event) {
                            event(download);
                        });
                    }
                });
            }

            function _showVideoWindow() {
                if(iplayer) {
                    iplayer.showAll();
                }
            }

            function _hideVideoWindow() {
                if(iplayer) {
                    iplayer.hideAll();
                }
            }

            function _stopDownload(dlid) {
                var oDownload = _.find(aDownload, {id: dlid});

                if(oDownload) {
                    !iplayer && queryDownloadProgress(dlid);

                    if(oDownload.status > 0 || oDownload.status < 5) {
                        oDownload.status = 6;
                        oDownload.statusName = '下载中断';
                        stopDownload(dlid, oDownload.devicefk);

                        _.each(aDownloadStatusEvents, function(event) {
                            event(oDownload);
                        });
                    }
                }
            }

            function _getDownloadHistoryList(pageNo, pageSize, searchText, starttime, endtime, cb) {
                iAjax
                    .post('security/check/check.do?action=getVideoDownloadList', {
                        params: {
                            pageNo: pageNo,
                            pageSize: pageSize
                        },
                        filter: {
                            searchText: searchText,
                            starttime: starttime,
                            endtime: endtime
                        }
                    })
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(cb && typeof(cb) === 'function') {
                                cb(data.result.rows, data.result.params);
                            }
                        }
                    });
            }

            function stopDownload(dlid, devicefk) {
                if(camera || iplayer) {
                    if(iplayer) {
                        iplayer.object.stopRecordDownload(dlid, devicefk);
                    } else {
                        camera.stopRecordDownload(dlid, devicefk);
                    }

                    var oDownload = _.find(aDownload, {id: dlid});
                    if(oDownload && oDownload.timer) {
                        $interval.cancel(oDownload.timer);
                    }
                }
            }

            function queryDownloadProgress(dlid) {
                var oDownload = _.find(aDownload, {id: dlid});

                if(oDownload) {
                    var r = camera.getRecordDownloadStatus(dlid);

                    oDownload.status = r[0];
                    oDownload.statusName = downloadStatus[r[0]];

                    if(r[0] >= 3) {
                        oDownload.percentage = r[1] / 100;
                        oDownload.speed = r[2];
                        oDownload.pos = r[3];
                        oDownload.files = r[4];

                        if(r[0] == 5) {
                            oDownload.percentage = 100.00;
                        }

                        _.each(aDownloadStatusEvents, function(event) {
                            event(oDownload);
                        });
                    } else if(r[0] > 0) {
                        //此处状态为（1 : 正在与流媒体服务器协商数据，2 : 准备下载）
                    } else {
                        stopDownload(dlid, oDownload.devicefk);
                        iMessage.show({
                            level: 1,
                            title: '录像下载',
                            content: '错误码 【 ' + r[0] + ' 】：' + (downloadStatus[r[0]] || '未知错误')
                        });
                    }

                    if(r[0] == 5) {
                        stopDownload(dlid, oDownload.devicefk);
                        iMessage.show({
                            level: 1,
                            title: '录像下载',
                            content: '【' + oDownload.name + '】已完成下载'
                        });
                    }

                }
            }

            function saveDownloadLog(name, start, end) {
                console.log(name, start, end);
                iAjax
                    .post('security/check/check.do?action=addVideoDownload', {
                        filter: {
                            name: name,
                            starttime: $filter('date')(start, 'yyyy-MM-dd HH:mm:ss'),
                            endtime: $filter('date')(end, 'yyyy-MM-dd HH:mm:ss')
                        }
                    });
            }

            return {
                init: _init,
                setDownloadPath: _setDownloadPath,
                getDownloadPath: _getDownloadPath,
                listenDownloadsStatus: _listenDownloadStatus,
                listenAddDownloadEvent: _listenAddDownloadEvent,
                getDownloads: _getDownloads,
                getDownloadings: _getDownloadings,
                addDownload: _addDownload,
                fastDownload: _fastDownload,
                stopDownload: _stopDownload,
                getDownloadHistoryList: _getDownloadHistoryList,
                showVideoWindow: _showVideoWindow,
                hideVideoWindow: _hideVideoWindow
            }
        }
    ]);
});