/**
 * 监控面板指令，用于管理多个监控组件的布局和相关操作方法。
 *
 * Created by YJJ on 2015-11-10.
 */
define([
    'app',
    'safe/js/directives/safeVideoTool',
    'safe/js/directives/safeVideo',
    'safe/js/directives/safeScrawlEditWidget',
    'safe/js/services/safeImcsPlayer',
], function(app) {
    app.directive('safeVideoPanel', ['$timeout', 'iAjax', 'iMessage', 'iToken', '$http', '$filter', 'iTimeNow', 'safeRecordDownload', 'safeImcsPlayer', function($timeout, iAjax, iMessage, iToken, $http, $filter, iTimeNow, safeRecordDownload, safeImcsPlayer) {

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

        var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/videopanel.html');

        return {
            restrict: 'E',
            replace: true,
            template: _template,
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $scope.isCs = window.__IIWHOST ? true : false;
                        $scope.bFull = false;
                        $scope.maxArray = new Array($scope.setting.maxsize - 9);
                        $scope.showContinuationPhotograph = false;

                        $element.find('.video-panel-toolbox').click(function() {
                            if(!$scope.ismax && !$scope.ismove) {
                                $(this).hide();
                            } else {
                                $(this).find('.control-panel').hide();
                            }
                        });

                        $scope.safePanelResize = function() {
                            $scope.resetLayout();
                        };

                        $scope.$on('safeVideoCloseEvent', function() {
                            if($scope.setting.type == 0) {
                                var layout = $scope.layout;
                                layout.size = $element.find('safe-video:visible').size();
                                layout.row = 0;
                                layout.column = 0;

                                if(layout.size) {
                                    $scope.formatAutoLayout();
                                } else {
                                    $scope.$broadcast('safeVideoAllCloseEvent');
                                }
                            }
                        });


                        $scope.resetLayout = function(value) {
                            if($scope.setting.type == 1) {
                                if(value) $scope.setting.matrix = value;
                                if(!$scope.setting.el.parent().height()) return;
                                switch (typeof($scope.setting.matrix)) {
                                case 'number':
                                    $scope.layout.row = 0;
                                    $scope.layout.column = 0;
                                    $scope.formatSizeLayout($scope.setting.matrix);
                                    break;
                                case 'object':
                                    if($.isArray($scope.setting.matrix)) {
                                        $scope.formatArrayLayout($scope.setting.matrix);
                                    }
                                    break;
                                }
                                if($scope.select > $scope.layout.size) {
                                    $scope.select = $scope.layout.size;
                                }
                                if($scope.getSelect()) {
                                    $scope.moveSelectByIndex();
                                }
                            } else {
                                setVideoBoxSize();
                            }
                        };


                        /**
                         * 自动化栅格布局；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        $scope.formatAutoLayout = function() {
                            var layout = $scope.layout;

                            if($scope.setting.type == 0 && layout.size > layout.row * layout.column && layout.size < layout.maxsize) {
                                if(layout.column <= layout.row) {
                                    layout.column++;
                                } else {
                                    layout.row++;
                                }

                                if(layout.size > layout.row * layout.column) {
                                    $scope.formatAutoLayout();
                                    return;
                                }

                                setVideoBoxSize();
                            }
                        };


                        /**
                         * 表格化布局；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        $scope.formatSizeLayout = function(size) {
                            var layout = $scope.layout;

                            layout.size = size;
                            if(layout.size > layout.maxsize) layout.size = layout.maxsize;

                            if(layout.size > layout.row * layout.column) {
                                if(layout.column <= layout.row) {
                                    layout.column++;
                                } else {
                                    layout.row++;
                                }

                                if(layout.size > layout.row * layout.column) {
                                    $scope.formatSizeLayout(size);
                                    return;
                                }

                                setVideoBoxSize();

                                $element.find('safe-video:gt(' + (size - 1) + ')').hide();
                                $element.find('safe-video:lt(' + size + ')').show();
                            }
                        };


                        /**
                         * 二维数组布局；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        $scope.formatArrayLayout = function(array) {
                            var layout = $scope.layout,
                                size = 0,
                                cell;

                            layout.row = array.length;
                            layout.column = array[0].length;

                            setVideoBoxSize();

                            for(var i = 0; i < layout.row; i++) {
                                for(var j = 0; j < layout.column; j++) {
                                    cell = $element.find('safe-video:eq(' + (array[i][j] - 1) + ')');
                                    if(!cell.attr('layout_init')) {
                                        cell.attr('layout_init', true);
                                        cell.attr('layout_w', cell.width());
                                        cell.attr('layout_h', cell.height());
                                        cell.attr('layout_x', (j + 1));
                                        cell.attr('layout_y', (i + 1));
                                        size++;
                                    } else {
                                        if(parseInt(cell.attr('layout_y')) == (i + 1)) {
                                            cell.width(cell.width() + parseInt(cell.attr('layout_w')));
                                        } else if(parseInt(cell.attr('layout_x')) == (j + 1)) {
                                            cell.height(cell.height() + parseInt(cell.attr('layout_h')));
                                        }
                                    }
                                }
                            }
                            layout.size = size;

                            $element.find('safe-video:lt(' + size + ')').each(function(i, o) {
                                o = $(o);
                                o.attr('index', (i + 1));
                                o.find('.video-loading').width(o.width()).height(o.height());
                            });

                            $element.find('safe-video:gt(' + (size - 1) + ')').hide();
                            $element.find('safe-video:lt(' + size + ')').removeAttr('layout_init').show();
                        };

                        function setVideoBoxSize() {
                            if(!checkElementIsHidden($element)) {
                                var layout = $scope.layout,
                                    w = $element.parent().width() - 1,
                                    h = $element.parent().height() - 1,
                                    temp_w,
                                    temp_h;

                                //temp_h = Math.floor(h / layout.row);
                                //temp_w = Math.floor(w / layout.column);

                                temp_h = h / layout.row;
                                temp_w = w / layout.column;

                                $element.find('safe-video .video-loading').width(temp_w).height(temp_h);
                                $element.find('safe-video').width(temp_w).height(temp_h);

                                $element.find('safe-video').each(function(i, o) {
                                    $(o).attr('index', (i + 1));
                                });
                            }
                        }

                        function checkElementIsHidden(el) {
                            var $el = $(el),
                                el = $el.get(0);
                            if(el && el.tagName !== 'BODY') {
                                if($el.is(':hidden')) {
                                    return true;
                                } else {
                                    return checkElementIsHidden($el.parent());
                                }
                            } else {
                                return false;
                            }
                        }


                        /**
                         * 获取自动布局下一个监控对象；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        $scope.getAutoNextObject = function(nocheck) {
                            var layout = $scope.layout,
                                videoBox;

                            if(!$scope.getSelect() || nocheck) {
                                if($scope.setting.type == 0) {
                                    layout.size = $element.find('safe-video:visible').size() + 1;
                                    $scope.formatAutoLayout();

                                    videoBox = $element.find('safe-video:last');
                                    $element.find('.safe-video-panel').prepend(videoBox);

                                    $element.find('safe-video').each(function(i, o) {
                                        $(o).attr('index', (i + 1));
                                    });

                                    $scope.select = 1;
                                } else {
                                    if($scope.layout.auto) {
                                        $scope.select++;
                                    } else {
                                        $scope.layout.auto = true;
                                    }
                                    if($scope.select > $scope.layout.size) {
                                        $scope.select = 1;
                                    }
                                    videoBox = $element.find('safe-video:eq(' + ($scope.select - 1) + ')');
                                }
                            } else {
                                videoBox = $element.find('safe-video:eq(' + ($scope.select - 1) + ')');
                            }

                            return createResultObject(videoBox);
                        };


                        /**
                         * 获取指定序号的监控对象；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        $scope.getObject = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            return createResultObject(videoBox);
                        };


                        $scope.objectInit = function(object, text) {
                            if(!$scope.setting.keeplast) object.find('canvas').hide();
                            var html = (text) ? '<span>' + text + '</span>' : '<div style="position:absolute;right:3px;bottom:6px;font-size:11px;"><i class="fa fa-spinner fa-pulse" style="margin-right:2px;"></i><span>loading...</span></div>';
                            object.find('.video-loading .video-loading-cell').html(html);
                            object.find('.video-loading').show();
                            object.show();
                        };


                        /**
                         * 创建返回的监控对象；
                         *
                         * @author : yjj
                         * @version : 1.0
                         * @Date : 2015-11-11
                         */
                        function createResultObject(object) {
                            return {
                                code: function(id) {
                                    $(object.data('data-video')).attr('code', id);
                                },
                                name: function(name) {
                                    $(object.data('data-video')).attr('name', name);
                                },
                                type: function(type) {
                                    $(object.data('data-video')).attr('type', type);
                                },
                                record: function(o) {
                                    $(object.data('data-video')).data('record', o);
                                },
                                src: function(url) {
                                    if(!$scope.setting.viewmode) {
                                        if(!$scope.isPauseMode) {
                                            $(object.data('data-video')).attr('src', url);
                                        } else {
                                            $(object.data('data-video')).attr('liveSrc', url);
                                        }
                                    } else {
                                        $(object.data('data-video')).attr('src', url);
                                    }
                                },
                                pic: function(url, hideLoad) {
                                    var img = new Image();

                                    img.crossOrigin = 'anonymous';
                                    img.onload = function() {
                                        var canvas = object.find('canvas').get(0),
                                            ctx = canvas.getContext('2d'),
                                            p = canvas.parentElement,
                                            w = $(p).width(),
                                            h = $(p).height();
                                        $(canvas).attr('width', w).attr('height', h);
                                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
                                        //$(canvas).show();
                                        canvas.style.display = 'block';

                                        if(hideLoad) {
                                            object.find('.video-loading').hide();
                                        }
                                    };
                                    img.src = url + '&' + new Date().getTime();
                                },
                                get: function() {
                                    return object;
                                },
                                getCode: function() {
                                    return $(object.data('data-video')).attr('code');
                                },
                                getName: function() {
                                    return $(object.data('data-video')).attr('name');
                                }
                            }
                        }


                        /**
                         * 将base64编码格式的字符串解码并生成blob对象；
                         *
                         * @author : dwt
                         * @version : 1.0
                         * @Date : 2016-09-27
                         */
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


                        $scope.close = function(index, isCloseAll) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var canvas = videoBox.find('canvas'),
                                    video = $(videoBox.data('data-video')),
                                    loading = videoBox.find('.video-loading');

                                var record = video.data('record');
                                if(record && record.event) {
                                    record.event.close();
                                    record.event = null;
                                    video.data('record', null);
                                }

                                video.attr('videoreplyed', 'false');
                                if(video[0] && video[0].replyObj) {
                                    video[0].replyObj.hidePanel();
                                }

                                video.attr('src', '');
                                video.attr('muted', true);
                                videoBox.stop(true).hide('fade', function() {
                                    if(!$scope.setting.keeplast) {
                                        canvas.hide();
                                    }
                                    loading.hide();

                                    if($scope.setting.type != 0) {
                                        videoBox.show();
                                    } else {
                                        $scope.hideSelect();
                                    }
                                    video.attr('code', '');
                                    if(!isCloseAll) $scope.$emit('safeVideoCloseEvent', videoBox);
                                });
                            }
                        };


                        $scope.closeall = function() {
                            for(var i = 0; i < $scope.layout.maxsize; i++) {
                                $scope.close(i + 1, true);
                            }
                            $timeout(function() {
                                $scope.$emit('safeVideoCloseEvent');
                            }, 1000);
                        };

                        $scope.closeRecord = function(index, isCloseAll) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var canvas = videoBox.find('canvas'),
                                    video = $(videoBox.data('data-video')),
                                    loading = videoBox.find('.video-loading');

                                var record = video.data('record');
                                if(record && record.event) {
                                    record.event.close();
                                    record.event = null;
                                    video.data('record', null);
                                }

                                video.attr('videoreplyed', 'false');
                                if(video[0] && video[0].replyObj) {
                                    video[0].replyObj.hidePanel();
                                }

                                video.attr('src', '');
                                video.attr('muted', true);
                                videoBox.stop(true).hide('fade', function() {
                                    canvas.hide();

                                    loading.hide();

                                    if($scope.setting.type != 0) {
                                        videoBox.show();
                                    } else {
                                        $scope.hideSelect();
                                    }
                                    video.attr('code', '');

                                    $scope.$emit('safeRecordCloseEvent', index);
                                    if(!isCloseAll) $scope.$emit('safeVideoCloseEvent', videoBox);
                                });
                            }
                        };

                        $scope.closeallRecord = function() {
                            for(var i = 0; i < $scope.layout.maxsize; i++) {
                                $scope.closeRecord(i + 1, true);
                            }
                            $timeout(function() {
                                $scope.$emit('safeVideoCloseEvent');
                            }, 1000);
                        };

                        $scope.selectByIndex = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox) {
                                $scope.select = parseInt(videoBox.attr('index'));
                                $scope.layout.auto = false;

                                var dom = $element.find('.video-panel-toolbox');

                                dom.show();
                                $scope.moveSelectByIndex(index);

                                $scope.$broadcast('safeVideoSelectEvent', index);
                            }
                        };


                        $scope.moveSelectByIndex = function(index) {
                            index = index || $scope.select;
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            var dom = $element.find('.video-panel-toolbox');

                            if($element.find('.video-panel-toolbox:visible').size()) {
                                dom.stop(true).animate({
                                    left: videoBox.position().left,
                                    top: videoBox.position().top,
                                    width: videoBox.width(),
                                    height: videoBox.height()
                                }, 'fast');
                            } else {
                                dom.width(videoBox.width()).height(videoBox.height()).css('left', videoBox.position().left).css('top', videoBox.position().top);
                            }
                            $scope.showHideToolBar(index);
                        };


                        $scope.showHideToolBar = function(index) {
                            index = index || $scope.select;

                            var dom;
                            if(!$scope.ismax) {
                                dom = $element.find('.video-panel-toolbox:visible');
                            } else {
                                dom = $('.safe-video-max-panel .safe-video-max-box').find('.video-panel-toolbox:visible');
                            }

                            if(dom.size()) {
                                var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                                var video = $(videoBox.data('data-video'));

                                $scope.isVideoreplyed = $scope.isVideoreply(index);

                                $scope.toolbar.menu([]);
                                if(videoBox.data('data-play') && !$scope.isVideoreplyed) {
                                    $scope.getHardware(video.attr('code'), function(data) {
                                        $scope.toolbar.menu(data, $scope.ismove, $scope.isVideoreplyed);
                                    });

                                    dom.find('.toolbar').show();
                                } else {
                                    if($scope.isVideoreplyed) {
                                        dom.find('.control-panel').hide();
                                        dom.find('.toolbar .video, .toolbar .move').hide();
                                    } else {
                                        dom.find('.toolbar, .control-panel').hide();
                                    }
                                }

                                $scope.isSound = $scope.isPlaySound(index);
                                $scope.isVideotaped = $scope.isVideotape(index);
                                $scope.getCameraLinkage(video.attr('code'));
                            }
                        };


                        $scope.getSelect = function() {
                            if($element.find('.video-panel-toolbox:visible').size()) {
                                return $scope.select;
                            } else {
                                return 0;
                            }
                        };


                        $scope.hideSelect = function() {
                            $element.find('.video-panel-toolbox').hide();
                        };


                        $scope.max = function(index) {
                            if(!$scope.ismax) {
                                index = index || $scope.select;
                                var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
								
								if(safeImcsPlayer.isconnect()) {
                                    $scope.imcsPlayer.max(index);
                                }

                                if(videoBox.data('data-play')) {
                                    $scope.ismax = true;
                                    var content = $(videoBox.find('video').get(0) || videoBox.find('canvas').get(0));
                                    var videotape = $(videoBox.find('.video-object-videotape').get(0));
                                    var timeline = $(videoBox.find('.video-object-reply').get(0));
                                    var tool = $element.find('.video-panel-toolbox');
                                    var scrawl = $element.find('.scrawl-edit-widget');

                                    tool.hide();
                                    $('.safe-video-max-panel .safe-video-max-box').html(content);
                                    $('.safe-video-max-panel .safe-video-max-box').append(videotape);
                                    $('.safe-video-max-panel .safe-video-max-box').append(timeline);
                                    $('.safe-video-max-panel .safe-video-max-box').append(tool);
                                    $('.safe-video-max-panel .safe-video-max-box').append(scrawl);

                                    $('.safe-video-max-panel').data('videoBox', videoBox);

                                    $('.safe-video-max-panel').show('fade', function() {
                                        tool
                                            .stop(true)
                                            .css('left', 0)
                                            .css('top', 0)
                                            .width($('.safe-video-max-panel').width())
                                            .height($('.safe-video-max-panel').height())
                                            .show('fade');
                                        $scope.selectByIndex(index);
                                    });

                                    content.attr('src', content.attr('src'));
                                    $scope.$emit('camera.maxEvent');
                                }
                            }
                        };


                        $scope.min = function() {
                            if($scope.ismax) {
                                $scope.ismax = false;
                                //移除canvas对象
                                $('#maxVideoCanvas').remove();
                                var $p = $('.safe-video-max-panel'),
                                    videoBox = $p.data('videoBox'),
                                    content = $($p.find('video').get(0) || $p.find('canvas').get(0)),
                                    videotape = $($p.find('.video-object-videotape').get(0)),
                                    timeline = $($p.find('.video-object-reply').get(0)),
                                    tool = $p.find('.video-panel-toolbox'),
                                    scrawl = $p.find('.scrawl-edit-widget');

                                tool.find('.control-panel').hide();

                                $('.safe-video-max-panel').hide('fade');

                                videoBox.append(content);
                                videoBox.append(videotape);
                                videoBox.append(timeline);
                                $element.append(tool);
                                $element.append(scrawl);

                                $scope.moveSelectByIndex();

                                content.attr('src', content.attr('src'));

                                $scope.$emit('camera.minEvent');
                            }
                        };


                        $scope.full = function(isFull) {
                            if(isFull) {
                                if(!$scope.bFull) {
                                    $scope.bFull = true;
                                    $('.safe-video-full-panel').html($element).show('fade', function() {
                                        $scope.moveSelectByIndex();
                                        $(this).focus();

                                        $('.safe-video-full-panel').find('video').each(function() {
                                            $(this).attr('src', $(this).attr('src'));
                                        });
                                    });
                                }
                            } else {
                                $scope.exitFull();
                            }
                        };


                        $scope.exitFull = function() {
                            if($scope.bFull) {
                                $scope.bFull = false;
                                $scope.setting.el.append($element);
                                $('.safe-video-full-panel').hide('fade', function() {
                                    $scope.moveSelectByIndex();

                                    $element.find('video').each(function() {
                                        $(this).attr('src', $(this).attr('src'));
                                    });
                                });
                            }
                        };


                        $scope.getplays = function() {
                            var result = [];
                            $element.find('safe-video').each(function(i, o) {
                                var video = $($(o).data('data-video'));
                                result.push(video.attr('code'));
                            });
                            return result;
                        };


                        $scope.openSound = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                video.attr('muted', false);
                                video.removeAttr('muted');
                            }

                            $scope.isSound = true;
                        };


                        $scope.closeSound = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                video.attr('muted', true);
                            }

                            $scope.isSound = false;
                        };


                        $scope.isPlaySound = function(index) {
                            var result = true;
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                if(video.attr('muted') == true || video.attr('muted') == 'true') {
                                    result = false;
                                }
                            }
                            return result;
                        };


                        $scope.isVideotape = function(index) {
                            var result = false;
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                if(video.attr('videotaped') == true || video.attr('videotaped') == 'true') {
                                    result = true;
                                }
                            }
                            return result;
                        };

                        $scope.isVideoreply = function(index) {
                            var result = false;
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');

                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                if(video.attr('videoreplyed') == true || video.attr('videoreplyed') == 'true') {
                                    result = true;
                                }
                            }
                            return result;
                        };

                        /**
                         * 本地截图快照抓拍；
                         *
                         * @author : hj
                         * @version : 1.0
                         * @Date : 2018-02-26
                         */

                        $scope.snapImageShow = false;
                        var snapIndex = null;

                        $scope.snapHide = function() {
                            $scope.snapImageShow = false;
                        }

                        $scope.snapSubmit = function() {
                            var videoBox = $('.scrawl-edit-widget');
                            var index = null;
                            var canvas = null;

                            if(snapIndex) {
                                index = snapIndex;
                            }

                            if(videoBox.size()) {
                                var canvasArr = videoBox.find('.canvas');

                                _.each(canvasArr, function(v, i) {
                                    if(v.clientHeight > 0) {
                                        canvas = videoBox.find('.canvas').get(i);
                                    }
                                });

                                var imageData = canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, '');
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
                                            devicefk: $scope.getObject(index).getCode(),
                                            photo: data.result.rows.savepath
                                        }).then(function(data) {
                                            if(data && data.status == 1) {
                                                iMessage.show({
                                                    level: 1,
                                                    title: '本地截图成功',
                                                    content: '本地截图成功，历史本地截图可在统计分析中查看！'
                                                });

                                                $scope.snapHide();
                                            }
                                        });
                                    }
                                });
                            }

                        };

                        $scope.continuationPhotograph = function(index) {
                            $scope.snapImageList = [];
                            for(var i = 0; i < 10; i++) {
                                setTimeout(function() {
                                    $scope.snapImageList.push($scope.getSnapData(index));
                                }, 100)
                            }
                            setTimeout(function () {
                                $scope.showContinuationPhotograph = true;
                            }, 1000)
                        };
                        $scope.continuationPhotographCancel = function() {
                            $scope.snapImageList = [];
                            $scope.showContinuationPhotograph = false;
                        };

                        $scope.continuationPhotographSave = function () {
                            var time = $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd H:m:s');
                            var random = randomWord(16);
                            for(var i = 0; i < $scope.snapImageList.length; i++) {
                                var formData = new FormData();
                                formData.append('upLoadContinuationPhotograph',dataURLtoBlob($scope.snapImageList[i]));
                                $http({
                                    method: 'post',
                                    data: formData,
                                    url: iAjax.formatURL('security/uploading.do?action=uploadingMonitorImage&ptype=true') + '&keyid=' + random + '&code=' + i + '&time=' + time + '&authorization=' + iToken.get(),
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }).success(function (data) {

                                })
                            }
                            iMessage.show({
                                level: 1,
                                title: '保存成功',
                                content: '本地截图成功，历史本地截图可在统计分析中查看！'
                            });
                            $scope.showContinuationPhotograph = false;

                        };

                        function randomWord(num){
                            var random = '',
                                temp = 0,
                                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                            for(var i=0; i<num; i++){
                                temp = Math.round(Math.random() * (arr.length-1));
                                random += arr[temp];
                            }
                            return random;
                        }

                        function dataURLtoBlob(dataurl) {
                            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                            while(n--){
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new Blob([u8arr], {type:mime});
                        }

                        $scope.snap = function(index) {
                            snapIndex = index;
                            $scope.snapImageShow = true;
                            $scope.snapImage = $scope.getSnapData(index);
							$timeout(function() {
								$scope.$broadcast('safe.scrawl.open.img', $scope.snapImage);
							}, 0);
                        };

                        // $scope.$on('videoKeyDownEscEvent', function() {
                        //     $scope.$broadcast('safe.scrawl.open.img.restore', $scope.snapImage);
                        // });

                        $scope.getSnapData = function(index) {
                            if(safeImcsPlayer.isconnect()) {
                                var scope = $element.scope();
                                if(scope.imcsPlayer) {
                                    return new Promise(function (resolve, reject) {
                                        scope.imcsPlayer.snapshot(function (data) {
                                            if (data) {
                                                resolve(data);
                                            } else {
                                                reject();
                                            }
                                        });
                                    });
                                }
                            } else {
                                var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                                if (videoBox.size()) {
                                    var canvas = videoBox.find('canvas').get(0);
                                    //解决cs模式下监控窗口放大后无法显示异常情况登记截图问题
                                    if (!canvas) {
                                        var canvas = document.createElement('canvas');
                                        canvas.id = "maxVideoCanvas";
                                        $('.safe-video-max-panel').append(canvas);
                                        canvas = $('.safe-video-max-panel').find('canvas').get(0);
                                    }
                                    var ctx = canvas.getContext('2d');
                                    var video = videoBox.data('data-video');
                                    if (!window.__IIWHOST) {
                                        $(canvas).attr('width', $(canvas).width()).attr('height', $(canvas).height());
                                        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, $(canvas).width(), $(canvas).height());
                                    }
                                    return canvas.toDataURL('image/png');
                                }
                            }
                        };


                        // 本地录像
                        $scope.videotape = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                if(!$scope.isVideotaped) {
                                    video.attr('videotaped', true);
                                    video.removeAttr('videotaped');
                                    $scope.isVideotaped = true;
                                } else {
                                    video.attr('videotaped', false);
                                    $scope.isVideotaped = false;
                                    var videotapedPath = video[0] ? video[0].videotapedPath : '';
                                    if(videotapedPath) {
                                        iMessage.show({
                                            level: 1,
                                            title: '本地录像成功',
                                            content: '【' + video[0].videotapedPath + '】！'
                                        });
                                        video[0].videotapedPath = '';
                                    }
                                }
                            }

                        };

                        $scope.cameraLinkage = function(index) {
                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {
                                var video = $(videoBox.data('data-video'));
                                var monitorfk = video.attr('code');

                                iAjax.post('/security/polling/polling.do?action=runPolling', {
                                    filter: {
                                        monitorfk: monitorfk,
                                        order: 'start'
                                    }
                                }).then(function(data) {
                                    if(data && data.status == 1) {
                                        iMessage.show({
                                            level: 1,
                                            title: '图像联动',
                                            content: '图像联动调用成功！'
                                        });
                                    }

                                });
                            }
                        };

                        $scope.startDownload = function(id, start, end) {
                            //委托safeRecordDownload服务进行录像下载
                            safeRecordDownload.addDownload(id, start, end);
                        };


                        $scope.onFastReply = function(index, start, end) {

                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {

                                var video = $(videoBox.data('data-video'));
                                var monitorfk = video.attr('code');
                                if(video.attr('type') == 'live') {

                                    video.attr('videoreplyed', true);
                                    if(video[0].replyObj) {
                                        video[0].replyObj.showPanel();
                                    }

                                    video.attr('src', '');
                                    video.attr('muted', true);

                                    $scope.record(monitorfk, index, start, end, start, function() {
                                        if(video[0].replyObj) {
                                            video[0].replyObj.hidePanel();
                                        }
                                    }, function(e) {
                                        if(video[0].replyObj) {
                                            video[0].replyObj.statusCb(e, end - start, start);
                                        }
                                    });

                                }
                            }

                        };


                        $scope.fastReplyByTime = function(index, start, end) {

                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {

                                var video = $(videoBox.data('data-video'));
                                var monitorfk = video.attr('code');
                                if(video.attr('type') == 'record') {

                                    $scope.recordStop(index);

                                    video.attr('videoreplyed', true);
                                    if(video[0].replyObj) {
                                        video[0].replyObj.showPanel();
                                    }

                                    $scope.record(monitorfk, index, start, end, start, function() {
                                        if(video[0].replyObj) {
                                            video[0].replyObj.hidePanel();
                                        }
                                    }, function(e) {
                                        if(video[0].replyObj) {
                                            video[0].replyObj.statusCb(e, end - start, start);
                                        }
                                    });

                                }
                            }

                        };


                        /**
                         * 设置回放进度
                         * @param index 窗格号
                         * @param now 要回放的时间点（毫秒）
                         */
                        $scope.fastReplyInTime = function(index, now) {

                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {

                                var video = $(videoBox.data('data-video'));
                                if(video.attr('type') == 'record') {

                                    $scope.recordSetPos(index, now);

                                }
                            }

                        };


                        $scope.offFastReply = function(index) {

                            var videoBox = $element.find('safe-video:eq(' + (index - 1) + ')');
                            if(videoBox.size()) {

                                var video = $(videoBox.data('data-video'));
                                var monitorfk = video.attr('code');
                                if(video.attr('type') == 'record') {

                                    $scope.recordStop(index);

                                    $scope.show(monitorfk, index, true);

                                }
                            }

                        };


                    }
                }
            }
        }
    }]);
});