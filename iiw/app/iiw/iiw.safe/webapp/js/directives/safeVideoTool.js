/**
 * 监控快捷控制菜单
 *
 * Created by YJJ on 2015-11-14.
 */
define([
    'app',
    'hammer',
    'moment',
    'safe/js/directives/safeVideoRecordUnusual'
], function(app, Hammer, moment) {
    app.directive('safeVideoTool', ['iAjax', '$timeout', 'iMessage', 'iGetLang', '$state', function(iAjax, $timeout, iMessage, iGetLang, $state) {
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

        var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/videotool.html');

        var _posInit = false,
            _position = 'TOP',
            _margin = 0;

        function getCameraPositionSetting(callback) {
            if(_posInit) {
                if(callback) callback();
            } else {
                iAjax.post('iotiead/common.do?action=getSycodeList', {filter: {type: 'CAMERAICONPOSITION'}}).then(function(data) {
                    if(data && data.result && data.result.rows && data.result.rows.length) {
                        _position = data.result.rows[0].content || 'TOP';
                    }

                    iAjax.post('iotiead/common.do?action=getSycodeList', {filter: {type: 'CAMERAICONMARGIN'}}).then(function(data) {
                        if(data && data.result && data.result.rows && data.result.rows.length) {
                            _margin = parseFloat(data.result.rows[0].content) || 0;

                            _posInit = true;

                            if(callback) callback();
                        }
                    });
                });
            }
        }

        function getCameraRoleSetting(callback) {
            iAjax.post('security/check/check.do?action=getSpecialrole', {filter: {url: ['videotape']}}).then(function(data) {
                if(data && data.result && data.result.rows) {
                    callback(data.result.rows);
                }
            });
        }

        function getRoleSetting(type, callback) {
            iAjax.post('security/check/check.do?action=getSpecialrole', {filter: {url: [type]}}).then(function(data) {
                if(data.result && data.result.rows) {
                    callback(data.result.rows);
                }
            });
        }

        function touchEvent($scope, $element) {
            var elementTouchHammer = new Hammer($element.get(0)),
                isTouchCloseEvent = false,
                isTouchCloseStart = false,
                isTouchMaxEvent = false,
                isTouchMinEvent = false,
                box_w,
                start_x,
                start_y,
                lastcommand;

            $scope.$on('$destroy', function() {
                if(elementTouchHammer) {
                    elementTouchHammer.destroy();
                    elementTouchHammer = null;
                }
            });

            $element.dblclick(function() {
                $scope.min();
            });

            elementTouchHammer.get('pinch').set({enable: true});

            elementTouchHammer.on('pinchstart', function() {
                if(!$scope.ismove) {
                    isTouchMaxEvent = false;
                    isTouchMinEvent = false;
                }
            });

            elementTouchHammer.on('pinchout', function(e) {
                if(!$scope.ismove) {
                    if(e.distance > 10) {
                        isTouchMaxEvent = true;
                    }
                } else {
                    if(e.distance > 25) {
                        $scope.ptzControl('ZoomOut');
                    }
                }
            });

            elementTouchHammer.on('pinchin', function(e) {
                if(!$scope.ismove) {
                    if(e.distance > 10) {
                        isTouchMinEvent = true;
                    }
                } else {
                    if(e.distance > 25) {
                        $scope.ptzControl('ZoomIn');
                    }
                }
            });

            elementTouchHammer.on('pinchend', function() {
                if(!$scope.ismove) {
                    if(isTouchMaxEvent) {
                        $scope.max();
                    } else if(isTouchMinEvent) {
                        $scope.min();
                    }
                } else {
                    $scope.ptzControl('Stop');
                }
            });

            elementTouchHammer.on('panstart', function(e) {
                if(!$scope.ismove) {
                    isTouchCloseEvent = false;
                    if(!$scope.ismax) isTouchCloseStart = true;
                } else {
                    box_w = $element.width();
                    start_x = e.deltaX;
                    start_y = e.deltaY;
                }
            });

            elementTouchHammer.on('panup', function(e) {
                if($scope.ismove) return;

                if(e.distance > 300) {
                    isTouchCloseEvent = true;
                }
            });

            elementTouchHammer.on('panend', function(e) {
                if(!$scope.ismove) {
                    if(isTouchCloseEvent && isTouchCloseStart) {
                        if(touchClose(e)) return;
                    }
                    isTouchCloseStart = false;
                } else {
                    $scope.ptzControl('Stop');
                }
            });

            elementTouchHammer.on('panmove', function(e) {
                if($scope.ismove) {
                    var direction = '',
                        speed = '',
                        angle;

                    angle = Math.abs(e.angle);

                    if(angle < 10 || (angle > 80 && angle < 110) || angle > 170) {
                        // 单方向
                        switch (e.offsetDirection) {
                            case 16:
                                // up
                                direction = 'MoveUp';
                                break;
                            case 2:
                                // right
                                direction = 'MoveRight';
                                break;
                            case 8:
                                // bottom
                                direction = 'MoveDown';
                                break;
                            case 4:
                                // left
                                direction = 'MoveLeft';
                                break;
                        }
                    } else {
                        // 复合方向
                        var temp1, temp2;
                        temp1 = (start_x > e.deltaX) ? 'left' : 'right';
                        temp2 = (start_y > e.deltaY) ? 'up' : 'down';

                        if(temp1 == 'left') {
                            if(temp2 == 'up') {
                                direction = 'MoveUpLeft';
                            } else {
                                direction = 'MoveDownLeft';
                            }
                        } else {
                            if(temp2 == 'up') {
                                direction = 'MoveUpRight';
                            } else {
                                direction = 'MoveDownRight';
                            }
                        }
                    }

                    speed = Math.ceil(e.distance / box_w * 16);
                    if(speed > 16) speed = 16;
                    if(speed < 1) speed = 1;

                    if(lastcommand != direction + '|' + speed) {
                        $scope.ptzControl(direction, speed);
                        lastcommand = direction + '|' + speed;
                    }
                }
            });

            function touchClose(e) {
                var p = e.center;
                var target = document.elementFromPoint(p.x, p.y);
                while (target.localName != 'body') {
                    if(target == $element.get(0)) {
                        return false;
                    } else {
                        target = target.parentElement;
                    }
                }

                $scope.close($scope.select);
                $scope.hideSelect();
                return true;
            }
        }

        function touchArrowEvent($scope, $element) {
            var defSpeed = 5;

            var speedPanelElement = $element.find('.speed-panel'),
                speedPanelTimer = null;

            speedPanelElement.html(defSpeed + '倍速');

            var upTouchElement = new Hammer($element.find('.move-panel-arrow-y.top').get(0)),
                bottomTouchElement = new Hammer($element.find('.move-panel-arrow-y.bottom').get(0)),
                leftTouchElement = new Hammer($element.find('.move-panel-arrow-x.left').get(0)),
                rightTouchElement = new Hammer($element.find('.move-panel-arrow-x.right').get(0)),
                zoomInTouchElement = new Hammer($element.find('.zoomin').get(0)),
                zoomOutTouchElement = new Hammer($element.find('.zoomout').get(0)),
                irisOpenTouchElement = new Hammer($element.find('.irisopen').get(0)),
                irisCloseTouchElement = new Hammer($element.find('.irisclose').get(0)),
                speedUpTouchElement = new Hammer($element.find('.speedup').get(0)),
                speedDownTouchElement = new Hammer($element.find('.speeddown').get(0));

            $scope.$on('$destroy', function() {
                if(upTouchElement) {
                    upTouchElement.destroy();
                    upTouchElement = null;
                }

                if(bottomTouchElement) {
                    bottomTouchElement.destroy();
                    bottomTouchElement = null;
                }

                if(leftTouchElement) {
                    leftTouchElement.destroy();
                    leftTouchElement = null;
                }

                if(rightTouchElement) {
                    rightTouchElement.destroy();
                    rightTouchElement = null;
                }

                if(zoomInTouchElement) {
                    zoomInTouchElement.destroy();
                    zoomInTouchElement = null;
                }

                if(zoomOutTouchElement) {
                    zoomOutTouchElement.destroy();
                    zoomOutTouchElement = null;
                }

                if(irisOpenTouchElement) {
                    irisOpenTouchElement.destroy();
                    irisOpenTouchElement = null;
                }

                if(irisCloseTouchElement) {
                    irisCloseTouchElement.destroy();
                    irisCloseTouchElement = null;
                }

                if(speedUpTouchElement) {
                    speedUpTouchElement.destroy();
                    speedUpTouchElement = null;
                }

                if(speedDownTouchElement) {
                    speedDownTouchElement.destroy();
                    speedDownTouchElement = null;
                }

                if(speedPanelTimer) {
                    $timeout.cancel(speedPanelTimer);
                    speedPanelTimer = null;
                }
            });

            upTouchElement.on('press', function() {
                $scope.ptzControl('MoveUp', defSpeed);
            });
            upTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            bottomTouchElement.on('press', function() {
                $scope.ptzControl('MoveDown', defSpeed);
            });
            bottomTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            leftTouchElement.on('press', function() {
                $scope.ptzControl('MoveLeft', defSpeed);
            });
            leftTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            rightTouchElement.on('press', function() {
                $scope.ptzControl('MoveRight', defSpeed);
            });
            rightTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            zoomInTouchElement.on('press', function() {
                $scope.ptzControl('ZoomIn', defSpeed);
            });
            zoomInTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            zoomOutTouchElement.on('press', function() {
                $scope.ptzControl('ZoomOut', defSpeed);
            });
            zoomOutTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            irisOpenTouchElement.on('press', function() {
                $scope.ptzControl('IrisOpen', defSpeed);
            });
            irisOpenTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            irisCloseTouchElement.on('press', function() {
                $scope.ptzControl('IrisClose', defSpeed);
            });
            irisCloseTouchElement.on('pressup', function() {
                $scope.ptzControl('Stop');
            });

            speedUpTouchElement.on('tap', function() {
                defSpeed = defSpeed >= 16 ? 16 : (defSpeed + 1);
                speedPanelElement.html(defSpeed + '倍速');
                speedPanelElement.show();

                if(speedPanelTimer) {
                    $timeout.cancel(speedPanelTimer);
                }

                speedPanelTimer = $timeout(function() {
                    speedPanelElement.hide('fade');
                }, 1000);
            });

            speedDownTouchElement.on('tap', function() {
                defSpeed = defSpeed <= 1 ? 1 : (defSpeed - 1);
                speedPanelElement.html(defSpeed + '倍速');
                speedPanelElement.show();

                if(speedPanelTimer) {
                    $timeout.cancel(speedPanelTimer);
                }

                speedPanelTimer = $timeout(function() {
                    speedPanelElement.hide('fade');
                }, 1000);
            });
        }

        return {
            restrict: 'E',
            template: _template,
            compile: function() {
                return {
                    post: function($scope, $element) {
                        touchEvent($scope, $element);

                        getCameraPositionSetting(function() {
                            var $toolbar = $element.find('.toolbar');
                            switch (_position.toUpperCase()) {
                                case 'TOP':
                                    $toolbar.removeClass('bottom');
                                    $toolbar.addClass('top');
                                    $toolbar.css('top', _margin);
                                    break;
                                case 'BOTTOM':
                                    $toolbar.removeClass('top');
                                    $toolbar.addClass('bottom');
                                    $toolbar.css('bottom', _margin);
                                    break;
                            }
                        });

                        getCameraRoleSetting(function(roles) {
                            var $toolbar = $element.find('.toolbar');

                            //没有监控录像权限，则不提供录像功能
                            if(roles['videotape'] != '1') {
                                $toolbar.find('.toolbutton.videotape').remove();
                                $toolbar.find('.toolbutton.videodownload').remove();

                            }
                        });

                        getRoleSetting('videorecord', function(roles) {
                            var $toolbar = $element.find('.toolbar');

                            //没有监控录像记录权限，则不提供录像记录功能
                            if(roles['videorecord'] != '1' && $state.current.name == 'safe.record') {
                                $toolbar.find('.toolbutton.record').remove();
                            }
                        });

                        // 云台控制权限
                        $scope.hasmove = true;
                        getRoleSetting('monitorcontrol', function(roles) {
                            if(roles['monitorcontrol'] != '1') {
                                $scope.hasmove = false;
                            }
                        });

                        // 预置点权限
                        $scope.haspreset = false;
                        getRoleSetting('monitorpreset', function(roles) {
                            if(roles['monitorpreset'] == '1') {
                                $scope.haspreset = true;
                            }
                        });

                        // 巡航路径权限
                        $scope.hascruise = false;
                        getRoleSetting('monitorcruiseroute', function(roles) {
                            if(roles['monitorcruiseroute'] == '1') {
                                $scope.hascruise = true;
                            }
                        });

                        $scope.safeToolResize = function($elem) {
                            $elem.find('.move-panel').css('font-size', $elem.width());
                            $scope.$broadcast('safeVideoPanel.resize');
                        };

                        touchArrowEvent($scope, $element);

                        $scope.$on('videoKeyDownEvent', function(e, data) {
                            var defSpeed = 5;
                            if($scope.select && $scope.hasmove && $element.css('display') != 'none') {
                                switch (data.keyCode) {
                                    case 38:
                                        // console.log('上');
                                        $scope.ptzControl('MoveUp', defSpeed);
                                        break;
                                    case 40:
                                        // console.log('下');
                                        $scope.ptzControl('MoveDown', defSpeed);
                                        break;
                                    case 37:
                                        // console.log('左');
                                        $scope.ptzControl('MoveLeft', defSpeed);
                                        break;
                                    case 39:
                                        // console.log('右');
                                        $scope.ptzControl('MoveRight', defSpeed);
                                        break;
                                }
                            }
                        });

                        $scope.$on('videoKeyUpEvent', function(e, data) {
                            if($scope.select && $scope.hasmove && $element.css('display') != 'none') {
                                if(data.keyCode == '37' || data.keyCode == '38' || data.keyCode == '39' || data.keyCode == '40') {
                                    // console.log('停');
                                    $scope.ptzControl('Stop');
                                }
                            }
                        });

                        $element.find('.control-panel').click(function(e) {
                            e.cancelBubble = true;
                            e.stopPropagation();
                        });

                        $scope.$on('ws.executeHandle', function(e, data) {
                            updateStatus(data.id, data.message);
                        });

                        $scope.dialect = {
                            OUN_MC: iGetLang.get('OUN_MC')
                        };

                        $scope.toolbar = {
                            last: null,
                            menu: function(list, isMove, isVideoReplyed) {
                                this.last = list;

                                if(isMove || isVideoReplyed) return;

                                $scope.ismove = false;

                                $element.find('.move-panel').hide();
                                $element.find('.toolbutton.left').remove();
                                $element.find('.toolbutton.right').show();
                                $element.find('.toolbar').show();

                                switch ($scope.setting.toolbar) {
                                    case 1:
                                        return;
                                    case 2:
                                        $element.find('.toolbar').hide();
                                        return;
                                    case 3:
                                        $element.find('.toolbar .toolbutton.close').hide();
                                        return;
                                    case 4:
                                        $element.find('.toolbutton.right').hide();
                                        $element.find('.toolbar .toolbutton.max, .toolbar .toolbutton.bigmonitor, .toolbar .toolbutton.move, .toolbar .toolbutton.video').show();
                                        return;
                                    case 5:
                                        $element.find('.toolbar .toolbutton.close').hide();
                                        $element.find('.reply-date-panel').hide();
                                        if(!$scope.ismax) {
                                            return;
                                        }
                                        break;
                                    case 6:
                                        $element.find('.toolbar .toolbutton.close').hide();
                                        break;
                                    case 7:
                                        $element.find('.toolbutton.right').hide();
                                        $element.find('.toolbar .toolbutton.snap, .toolbar .toolbutton.max, .toolbar .toolbutton.bigmonitor, .toolbar .toolbutton.video, .toolbar .toolbutton.record').show();
                                        return;
                                    case 8:
                                        if(!$scope.ismax) {
                                            $element.find('.toolbutton.right').hide();
                                            $element.find('.toolbar .toolbutton.max').show();
                                            return;
                                        }
                                        break;
                                }

                                var html = [];

                                $.each(list, function(i, o) {
                                    html.push('<div title="' + o.name + '" class="toolbutton hardware left" index="' + i + '"><i class="fa fa-' + o.icon + '"></i></div>');
                                });

                                $element.find('.toolbar').prepend(html.join(''));

                                $element.find('.toolbutton.hardware.left').click(function(e) {
                                    var o = list[parseInt($(this).attr('index'))],
                                        $e = $element.find('.control-panel');
                                    if(o) {
                                        showAction(o);
                                        $e.show('fade');
                                    } else {
                                        $e.hide();
                                    }
                                    e.stopPropagation();

                                    function showAction(root, parent) {
                                        var $e = $element.find('.control-panel'),
                                            html = [],
                                            scope = parent || root;

                                        if(!parent) {
                                            $e.data('hardwareid', root.id);
                                            $e.find('h4 b').text(root.name);
                                            updateStatus(root.id, '');
                                            $scope.getHardwareStatus(root.id, function(data) {
                                                if(data.result.rows) {
                                                    updateStatus(data.result.rows.id, data.result.rows.message);
                                                }
                                            });
                                        } else {
                                            $e.find('h4 b').html('<i class="fa fa-arrow-circle-left"></i>' + root.name + ' - ' + parent.name);
                                            $e.find('h4 b i').click(function() {
                                                showAction(root);
                                            });
                                        }

                                        if(scope.actions) {
                                            $.each(scope.actions, function(i, act) {
                                                // html.push('<div class="action actionbutton" index="' + i + '"><div>'+act.name+'</div></div>');
                                                html.push('<button class="action actionbutton" index="' + i + '">' + act.name + '</button>');
                                            });

                                            $element.find('.control-toolbar').width(scope.actions.length * 200);
                                        }

                                        if(scope.actions && scope.actions.length < Math.floor($element.width() / 200)) {
                                            $e.width(scope.actions.length * 200);
                                            $element.find('.control-box').width(scope.actions.length * 200);
                                        } else {
                                            $e.width(Math.floor($element.width() / 200) * 200);
                                            $element.find('.control-box').width(Math.floor($element.width() / 200) * 200);
                                        }

                                        //$element.find('.control-toolbar').width(scope.actions.length * 200);
                                        //$e.width(scope.actions.length * 200);
                                        $e.find('.control-toolbar').html(html.join(''));

                                        $e.find('.control-toolbar button').click(function() {
                                            var oAction = scope.actions[parseInt($(this).attr('index'))];
                                            if(oAction) {
                                                if(!oAction.actions) {
                                                    $scope.doHardware(root.id, root.type, (parent ? parent.action : oAction.action), oAction.value);
                                                } else {
                                                    showAction(root, oAction);
                                                }
                                            }
                                        });
                                    }
                                });

                                $element.find('.control-panel').hide();
                                $element.find('.reply-date-panel').hide();
                                $element.find('.fastdownload-date-panel').hide();
                            },

                            bigmonitor: {
                                clickMonitor: function() {
                                    var videoBox = $scope.getObject($scope.select);
                                    var cameraid = $(videoBox.get().data('data-video')).attr('code');
                                    this.play = {
                                        code: cameraid,
                                        index: this.select
                                    };
                                    $scope.toolbar.bigmonitor.el.stop(true).hide('fade');
                                },
                                show: function(e) {
                                    e.stopPropagation();
                                }
                            },

                            videoRecord: {
                                getCameraId: function() {

                                    var videoBox = $scope.getObject($scope.select);
                                    return $(videoBox.get().data('data-video')).attr('code');

                                },
                                getSnapData: function() {
                                    return $scope.getSnapData($scope.select);
                                }
                            },

                            max: function(e) {
                                $scope.max();
                                e.stopPropagation();
                            },

                            min: function(e) {
                                $scope.min();
                                e.stopPropagation();
                            },

                            move: function(e) {
                                $scope.ismove = true;

                                $element.find('.toolbar').hide();
                                $element.find('.move-panel').show();

                                //var panel_h = $element.find('.move-panel').height();

                                //$element.find('.move-panel-bg').stop(true).show().hide('fade', 5000);
                                //$element.find('.move-panel-bg').show('fade');

                                this.preset.getDatas();

                                e.stopPropagation();
                            },

                            hideMove: function(e) {
                                this.preset.reset();

                                this.menu(this.last || []);
                                e.stopPropagation();
                            },

                            close: function(e) {
                                $scope.close($scope.select);
                                e.stopPropagation();
                            },

                            openSound: function(e) {
                                $scope.openSound($scope.select);
                                e.stopPropagation();
                            },

                            closeSound: function(e) {
                                $scope.closeSound($scope.select);
                                e.stopPropagation();
                            },

                            snap: function(e) {
                                $scope.snap($scope.select);
                                e.stopPropagation();
                            },

                            continuationPhotograph: function(e) {
                                $scope.continuationPhotograph($scope.select);
                                e.stopPropagation();
                            },

                            // 本地录像
                            videotape: function(e) {
                                $scope.videotape($scope.select);
                                e.stopPropagation();
                            },

                            //图像联动策略
                            cameraLinkage: function(e) {
                                $scope.cameraLinkage($scope.select);
                                e.stopPropagation();
                            },

                            //录像快速下载
                            fastDownload: {
                                startTime: '',
                                endTime: '',

                                //显示下载时间框
                                showDowntime: function(e) {
                                    $element.find('.fastdownload-date-panel').show();
                                    e.stopPropagation();
                                },
                                //录像下载
                                startDownload: function() {
                                    $element.find('.fastdownload-date-panel').hide();

                                    var videoBox = $scope.getObject($scope.select),
                                        video = $(videoBox.get().data('data-video')),
                                        monitorfk = video.attr('code'),
                                        second, start, end;

                                    start = new Date(this.startDate + ':00').getTime();
                                    end = new Date(this.endDate + ':00').getTime();
                                    second = (end - start) / 1000;

                                    $scope.startDownload(monitorfk, start, end);
                                },
                                preventClick: function(e) {
                                    e.stopPropagation();
                                }
                            },

                            // 快速回放
                            fastReply: {
                                startDate: '',          //日期选择的开始日期
                                endDate: '',            //日期选择的结束时间
                                on: function(second, e) {
                                    var index = $scope.select,
                                        videoBox = $scope.getObject(index),
                                        video = $(videoBox.get().data('data-video')),
                                        now = moment(), start, end;

                                    if(video[0].replyObj) {
                                        video[0].replyObj.now = now;
                                        video[0].replyObj.second = second;
                                    }

                                    start = now.add(-second, 's')._d.getTime();
                                    end = now.add(second, 's')._d.getTime();

                                    this.getVideoList(video.attr('code'), start, end, video);

                                    $scope.onFastReply(index, start, end);
                                    e.stopPropagation();
                                },
                                off: function(e) {
                                    $scope.offFastReply($scope.select);
                                    e.stopPropagation();
                                },
                                time: function(second, e) {

                                    //若当前窗口不是激活窗口则需要判断
                                    var safeVideoEl = $(e.target).parent().parent().parent(),
                                        index = $scope.select;
                                    if(safeVideoEl[0] && safeVideoEl[0].nodeName == 'SAFE-VIDEO') {
                                        index = safeVideoEl.attr('index');
                                    }

                                    var videoBox = $scope.getObject(index),
                                        video = $(videoBox.get().data('data-video')),
                                        now = moment(), start, end;

                                    if(video[0].replyObj) {
                                        video[0].replyObj.now = now;
                                        video[0].replyObj.second = second;
                                    }

                                    start = now.add(-second, 's')._d.getTime();
                                    end = now.add(second, 's')._d.getTime();

                                    this.getVideoList(video.attr('code'), start, end, video);

                                    $scope.fastReplyByTime(index, start, end);
                                    e.stopPropagation();
                                },
                                goTime: function(e) {

                                    //若当前窗口不是激活窗口则需要判断
                                    var safeVideoEl = $(e.target).parent().parent().parent(),
                                        index = $scope.select;
                                    if(safeVideoEl[0] && safeVideoEl[0].nodeName == 'SAFE-VIDEO') {
                                        index = safeVideoEl.attr('index');
                                    }

                                    var videoBox = $scope.getObject(index),
                                        video = $(videoBox.get().data('data-video')),
                                        w = $(e.target).width(),
                                        now, second, start, end, offsetTime;

                                    if(video[0].replyObj) {
                                        now = video[0].replyObj.now;
                                        second = video[0].replyObj.second;
                                    }

                                    start = now.add(-second, 's')._d.getTime();
                                    end = now.add(second, 's')._d.getTime();
                                    offsetTime = e.offsetX / w * (end - start);
                                    $scope.fastReplyInTime(index, offsetTime);

                                    e.stopPropagation();
                                },
                                showDateRange: function(e) {
                                    $element.find('.reply-date-panel').show();
                                    e.stopPropagation();
                                },
                                goDateTime: function() {
                                    $element.find('.reply-date-panel').hide();

                                    var videoBox = $scope.getObject($scope.select),
                                        video = $(videoBox.get().data('data-video')),
                                        second, start, end;

                                    start = new Date(this.startDate + ':00').getTime();
                                    end = new Date(this.endDate + ':00').getTime();
                                    second = (end - start) / 1000;

                                    this.getVideoList(video.attr('code'), start, end, video);

                                    if(video[0].replyObj) {
                                        video[0].replyObj.second = second;
                                        video[0].replyObj.now = moment(end);
                                    }

                                    $scope.fastReplyByTime($scope.select, start, end);
                                },
                                getVideoList: function(id, start, end, video) {
                                    iAjax.post('security/common/monitor.do?action=getVideoList', {
                                        filter: {
                                            id: id,
                                            start: start,
                                            end: end
                                        }
                                    }).then(function(data) {
                                        if(video[0].replyObj) {
                                            video[0].replyObj.scope.files = data.result.rows;
                                            video[0].replyObj.scope.starttime = start;
                                            video[0].replyObj.scope.endtime = end;
                                        }
                                    });
                                },
                                preventClick: function(e) {
                                    e.stopPropagation();
                                }
                            },

                            // 预置点
                            preset: {
                                current: '',
                                list: [],
                                getDatas: function() {
                                    if($scope.haspreset) {
                                        var videoBox = $scope.getObject($scope.select);
                                        this.cameraid = $(videoBox.get().data('data-video')).attr('code');

                                        iAjax.post('/security/common/monitor.do?action=getPTZPresetList', {
                                            filter: {
                                                id: $scope.toolbar.preset.cameraid
                                            }
                                        }).then(function(data) {
                                            if(data.result && data.result.rows) {
                                                $scope.toolbar.preset.list = data.result.rows;
                                            }
                                        });
                                    }
                                },
                                set: function() {
                                    if(this.current) {
                                        $scope.toolbar.preset.excute('PresetGoto', $scope.toolbar.preset.current);
                                    }
                                },
                                reset: function() {
                                    if($scope.toolbar.preset.list.length > 0) {
                                        $scope.toolbar.preset.current = '' + $scope.toolbar.preset.list[0].index;
                                    } else {
                                        $scope.toolbar.preset.current = '';
                                    }

                                    $scope.toolbar.preset.excute('PresetGoto', $scope.toolbar.preset.current);

                                },
                                excute: function(ctrl, idx, callback) {
                                    var data = {
                                        id: $scope.toolbar.preset.cameraid,
                                        ctrl: ctrl
                                    }

                                    if(idx) {
                                        idx = parseInt(idx); // string类型强转number整数

                                        var row = _.find($scope.toolbar.preset.list, {index: idx});

                                        data.index = idx;
                                        data.name = row.name;
                                    }

                                    iAjax.post('/security/common/monitor.do?action=executePTZPreset', {
                                        filter: data
                                    }).then(function(data) {
                                        if(data.result.rows && data.result.rows.result == 'ok') {
                                            if(callback) {
                                                callback();
                                            }
                                        }
                                    }, function(error) {
                                        console.error(error);
                                    });
                                }
                            },

                            // 巡航路径
                            cruise: {
                                currentIndex: '', // 当前巡航线路序号
                                list: [{ // 默认配置16个巡航线路
                                    name: '选择巡航线路',
                                    value: ''
                                }, {
                                    name: '巡航线路1',
                                    value: '1'
                                }, {
                                    name: '巡航线路2',
                                    value: '2'
                                }, {
                                    name: '巡航线路3',
                                    value: '3'
                                }, {
                                    name: '巡航线路4',
                                    value: '4'
                                }, {
                                    name: '巡航线路5',
                                    value: '5'
                                }, {
                                    name: '巡航线路6',
                                    value: '6'
                                }, {
                                    name: '巡航线路7',
                                    value: '7'
                                }, {
                                    name: '巡航线路8',
                                    value: '8'
                                }, {
                                    name: '巡航线路9',
                                    value: '9'
                                }, {
                                    name: '巡航线路10',
                                    value: '10'
                                }, {
                                    name: '巡航线路11',
                                    value: '11'
                                }, {
                                    name: '巡航线路12',
                                    value: '12'
                                }, {
                                    name: '巡航线路13',
                                    value: '13'
                                }, {
                                    name: '巡航线路14',
                                    value: '14'
                                }, {
                                    name: '巡航线路15',
                                    value: '15'
                                }, {
                                    name: '巡航线路16',
                                    value: '16'
                                }],
                                controlList: [], // 单个巡航线路-控制内容列表
                                showCruise: function(e) {
                                    $scope.ismove = true;
                                    $element.find('.toolbar').hide();
                                    $element.find('.cruise-panel').show();
                                    e.stopPropagation();
                                },
                                hideCruise: function(e) {
                                    $scope.ismove = false;
                                    $element.find('.cruise-panel').hide();
                                    $element.find('.toolbar').show();
                                    e.stopPropagation();
                                },
                                getRoute: function() {
                                    var videoBox = $scope.getObject($scope.select);
                                    this.cameraid = $(videoBox.get().data('data-video')).attr('code');

                                    if($scope.toolbar.cruise.currentIndex) {
                                        iAjax.post('security/common/monitor.do?action=getPTZCruiseRouteList', {
                                            filter: {
                                                id: $scope.toolbar.cruise.cameraid,
                                                index: $scope.toolbar.cruise.currentIndex
                                            }
                                        }).then(function(data) {
                                            if(data.result && data.result.rows && data.result.rows.length > 0) {
                                                $scope.toolbar.cruise.controlList = data.result.rows;
                                            } else {
                                                iMessage.show({
                                                    level: 3,
                                                    title: '获取线路失败',
                                                    content: '查询无此巡航线路。'
                                                });
                                            }
                                        });
                                    }
                                },
                                start: function() {
                                    if($scope.toolbar.cruise.controlList.length > 0) {
                                        var videoBox = $scope.getObject($scope.select);
                                        this.cameraid = $(videoBox.get().data('data-video')).attr('code');

                                        iAjax.post('/security/common/monitor.do?action=executePTZPreset', {
                                            filter: {
                                                id: $scope.toolbar.cruise.cameraid,
                                                ctrl: 'CruiseStart',
                                                index: $scope.toolbar.cruise.currentIndex
                                            }
                                        }).then(function(data) {
                                            if(data.result.rows && data.result.rows.result == 'ok') {
                                                iMessage.show({
                                                    level: 1,
                                                    title: '云台控制成功',
                                                    content: '启动巡航线路成功！'
                                                });
                                            } else {
                                                iMessage.show({
                                                    level: 4,
                                                    title: '云台控制失败',
                                                    content: '启动巡航线路失败！'
                                                });
                                            }
                                        }, function(data) {
                                            if(data.status == '0') {
                                                iMessage.show({
                                                    level: 4,
                                                    title: '云台控制失败',
                                                    content: '启动巡航线路失败！'
                                                });
                                            }
                                        });
                                    }
                                },
                                stop: function() {
                                    if($scope.toolbar.cruise.controlList.length > 0) {
                                        var videoBox = $scope.getObject($scope.select);
                                        this.cameraid = $(videoBox.get().data('data-video')).attr('code');

                                        iAjax.post('/security/common/monitor.do?action=executePTZPreset', {
                                            filter: {
                                                id: $scope.toolbar.cruise.cameraid,
                                                ctrl: 'CruiseStop',
                                                index: $scope.toolbar.cruise.currentIndex
                                            }
                                        }).then(function(data) {
                                            if(data.result.rows && data.result.rows.result == 'ok') {
                                                iMessage.show({
                                                    level: 1,
                                                    title: '云台控制成功',
                                                    content: '停止巡航线路成功！'
                                                });
                                            } else {
                                                iMessage.show({
                                                    level: 4,
                                                    title: '云台控制失败',
                                                    content: '停止巡航线路失败！'
                                                });
                                            }
                                        }, function(data) {
                                            if(data.status == '0') {
                                                iMessage.show({
                                                    level: 4,
                                                    title: '云台控制失败',
                                                    content: '停止巡航线路失败！'
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        };

                        function updateStatus(id, text) {
                            var $e = $element.find('.control-panel');

                            if($e.data('hardwareid') == id) {
                                if(text) {
                                    text = '[状态：' + text + ']';
                                } else {
                                    text = '';
                                }
                                $e.find('h4 status').text(text);
                            }
                        }
                    }
                }
            }
        }
    }]);
});