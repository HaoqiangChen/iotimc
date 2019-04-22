/**
 * 用来展示放大的监控
 * @author zhs
 * @date 2019-04-24
 */
define([
    'app'
], function(app) {
    app.directive('safeVideoMaxPanel', [
        '$rootScope',
        '$timeout',
        '$http',
        'iTimeNow',
        'iMessage',
        'iAjax',
        'safeHardware',

        function($rootScope, $timeout, $http, iTimeNow, iMessage, iAjax, safeHardware) {
            return {
                restrict: 'E',
                replace: true,
                template: [
                    '<div class="layout-full safe-video-max-panel">' +
                    '<div class="safe-video-max-tools" style="overflow-x: scroll;">' +
                    '<div class="safe-video-max-tools-content" ng-style="{\'width\': (735 + 350 + 80 + 12 * 70) + \'px\'}">'+
                    '<ul>' +
                    '<li>' +
                    '<div class="tool-name">云台</div>' +
                    '<div class="tool-buttons">' +
                    '<div class="tool-btn" ng-repeat="row in ptz.list track by $index" ng-mousedown="ptz.start(row.cmd)" ng-mouseup="ptz.stop()">{{ row.name }}</div>'+
                    '</div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="tool-name">功能</div>' +
                    '<div class="tool-buttons">' +
                    '<div class="tool-btn" ng-click="snapshot()">本地截图</div>' +
                        // '<div class="tool-btn">上墙</div>' +
                        // '<div class="tool-btn">回放</div>' +
                        // '<div class="tool-btn">录像</div>' +
                    '<div class="tool-btn">' +
                    '<div ng-if="volume.state == \'close\'" ng-click="volume.open()">音量开</div>' +
                    '<div ng-if="volume.state == \'open\'" ng-click="volume.close()">音量关</div>' +
                    '</div>' +
                    '<div class="tool-btn" ng-click="close()">关闭</div>' +
                    '</div>' +
                    '</li>' +
                    '<li ng-if="hardware.list.length > 0">' +
                    '<div class="tool-name">关联设备</div>' +
                    '<div class="tool-buttons" ng-if="hardware.mode == 1">' +
                    '<div class="tool-btn" ng-repeat="row in hardware.list track by $index" title="{{ row.name }}" ng-click="hardware.showAction(row, $event)">{{ row.typename }}</div>' +
                    '</div>' +
                    '<div class="tool-buttons" ng-if="hardware.mode == 2">' +
                    '<div class="tool-btn" ng-click="hardware.back()">返回</div>' +
                    '<div class="tool-btn" ng-repeat="row in hardware.detail.list track by $index" title="{{ row.name }}" ng-click="hardware.doAction(row)">{{ row.name }}</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>'+
                    '<div class="layout-full safe-video-max-box"></div>' +
                    '</div>'
                ].join(''),
                link: function ($scope, $element) {
                    var camera;

                    $scope.$on('imcs.maxEvent', function(e, data) {
                        if(data.camera) {
                            // console.log(data.camera);
                            camera = data.camera;
                            $scope.hardware.getData(data.video);
                        }
                    });

                    /**
                     * 云台控制
                     */
                    $scope.ptz = {
                        list: [{
                            name: '上', cmd: 'MoveUp'
                        }, {
                            name: '下', cmd: 'MoveDown'
                        }, {
                            name: '左', cmd: 'MoveLeft'
                        }, {
                            name: '右', cmd: 'MoveRight'
                        }, {
                            name: '左上', cmd: 'MoveUpLeft'
                        }, {
                            name: '左下', cmd: 'MoveDownLeft'
                        }, {
                            name: '右上', cmd: 'MoveUpRight'
                        }, {
                            name: '右下', cmd: 'MoveDownRight'
                        }, {
                            name: '放大', cmd: 'ZoomIn'
                        }, {
                            name: '缩小', cmd: 'ZoomOut'
                        }],
                        addEvent: function() {
                            var command = '', timer = null;

                            function handle(event) {
                                var delta = 0;
                                event = event || window.event;
                                if (event.preventDefault) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                } else {
                                    event.cancelBubble = true;
                                    event.returnValue = false;
                                }

                                delta = event.wheelDelta ? (event.wheelDelta / 120) : (- event.detail / 3);
                                if(delta > 0) {
                                    // 向上滚动，放大
                                    // console.log('zoom in');
                                    clearTimeout(timer);

                                    if(command == '') {
                                        $scope.ptz.start('ZoomIn');
                                        command = 'ZoomIn';
                                    }

                                    timer = setTimeout(function () {
                                        $scope.ptz.stop();
                                        command = '';
                                    }, 1500);
                                } else if(delta < 0) {
                                    // 向下滚动，缩小
                                    // console.log('zoom out');
                                    clearTimeout(timer);

                                    if(command == '') {
                                        $scope.ptz.start('ZoomOut');
                                        command = 'ZoomIn';
                                    }

                                    timer = setTimeout(function () {
                                        $scope.ptz.stop();
                                        command = '';
                                    }, 1500);
                                }
                            }

                            if (window.addEventListener) {
                                $element.get(0).addEventListener('mousewheel', handle);
                            } else if (window.attachEvent) {
                                $element.get(0).attachEvent("onDOMMouseScroll", handle);
                            }
                        },
                        start: function(cmd) {
                            if(camera) {
                                camera.ptzControl(cmd);
                            }
                        },
                        stop: function() {
                            if(camera) {
                                var cmd = 'Stop';
                                camera.ptzControl(cmd);
                            }
                        }
                    }
                    $scope.ptz.addEvent();

                    /**
                     * 音量控制
                     */
                    $scope.volume = {
                        state: 'close',
                        open: function() {
                            if(camera) {
                                camera.playSound(1);
                                this.state = 'open';
                            }
                        },
                        close: function() {
                            if(camera) {
                                camera.playSound(0);
                                this.state = 'close';
                            }
                        }
                    }

                    /**
                     * 截图
                     */
                    $scope.snapshot = function() {
                        if(camera) {
                            camera.snapshot(function(image, devicefk) {
                                var imageData = image.replace(/^data:image\/\w+;base64,/, '');
                                var fileBlob = b64toBlob(imageData, "image/jpeg");

                                var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=localsnap');
                                var formData = new FormData();
                                formData.append("imageFile", fileBlob);

                                $http({
                                    method: 'post',
                                    url: url,
                                    data: formData,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }).success(function(data) {
                                    if(data && data.result && data.result.rows) {
                                        iAjax.post('security/common/monitor.do?action=saveMonitorImage', {
                                            devicefk: devicefk,
                                            photo: data.result.rows.savepath
                                        }).then(function(data) {
                                            if(data && data.status == 1) {
                                                remind(1, '本地截图成功，历史本地截图可在统计分析中查看！', '本地截图成功');
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    }

                    /**
                     * 关联设备
                     */
                    $scope.hardware = {
                        list: [],
                        detail: {},
                        types: [],
                        mode: 1,
                        getDeviceTypes: function() {
                            iAjax.post('/security/device/device.do?action=getDeviceTypes').then(function(data) {
                                if(data.result && data.result.rows) {
                                    $scope.hardware.types = data.result.rows;
                                }
                            });
                        },
                        getData: function(video) {
                            var monitorid = video.userparam.split('-')[1];
                            iAjax.post('security/device/device.do?action=getDeviceRelatedList', {
                                filter: {id: monitorid}
                            }).then(function(data) {
                                if(monitorid == data.result.id && data.result.rows.length) {
                                    // console.log(data);
                                    $scope.hardware.list = data.result.rows.map(function(row) {
                                        var type = _.find($scope.hardware.types, {type: row.type});
                                        if(type) {
                                            row.typename = type.name;
                                        }
                                        return row;
                                    });
                                }
                            });
                        },
                        showAction: function (row) {
                            if (row.actions && row.actions.length) {
                                this.mode = 2;
                                this.detail.name = row.alias || row.name;
                                this.detail.childlist = [];
                                this.showDetail(row.actions);
                            }
                        },
                        showDetail: function(actions) {
                            this.detail.list = [].concat(actions);
                        },
                        doAction: function(row) {
                            if (row.actions && row.actions.length) {
                                this.detail.childlist.push(this.detail.list);
                                this.showDetail(row.actions);
                            } else if (row.action) {
                                safeHardware.execute(row.deviceid, row.type, row.action, row.value);
                            }
                        },
                        back: function() {
                            if (this.detail.childlist.length) {
                                var list = this.detail.childlist.pop();
                                this.showDetail(list);
                            } else {
                                this.mode = 1;
                            }
                        }
                    }
                    $scope.hardware.getDeviceTypes();

                    /**
                     * 关闭
                     */
                    $scope.close = function() {
                        $rootScope.$broadcast('videoMinEvent');
                        camera = null;
                        $scope.volume.close();
                        $scope.hardware.list = [];
                    }

                    /**
                     * 双击关闭
                     */
                    $element.find('.safe-video-max-box').dblclick(function(e) {
                        $scope.close();
                    });

                    // 消息提醒
                    function remind(level, content, title) {
                        var message = {
                            id: iTimeNow.getTime(),
                            title:( title || '消息提醒！'),
                            level: level,
                            content: ( content || '')
                        };
                        iMessage.show(message, false);
                    }

                    // 将base64编码格式的字符串解码并生成blob对象
                    function b64toBlob(b64Data, contentType, sliceSize) {
                        contentType = contentType || '';
                        sliceSize = sliceSize || 512;

                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];

                        for(var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            var slice = byteCharacters.slice(offset, offset + sliceSize);

                            var byteNumbers = new Array(slice.length);
                            for(var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }

                            var byteArray = new Uint8Array(byteNumbers);

                            byteArrays.push(byteArray);
                        }

                        var blob = new Blob(byteArrays, {type: contentType});
                        return blob;
                    }
                }
            }
        }
    ]);
});
