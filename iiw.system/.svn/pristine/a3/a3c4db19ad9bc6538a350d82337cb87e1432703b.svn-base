/**
 * 标签指令
 *
 * @author - dwt
 * @date - 2015-12-23
 * @version - 0.1
 */
define([
    'app',
    'cssloader!system/insidemapsetting/css/tag.css',
    'cssloader!safe/css/font/safeIcon/safeIcon'
], function(app) {
    app.directive('insidemapsettingTag', [
        '$timeout',
        '$compile',

        function($timeout, $compile) {

            return {
                restrict: 'A',
                template: [
                    '<div class="safe-map-tag animated" ng-show="!item.bHide" ng-click="tagClick($event)">',
                    '<div class="layout-full  safe-map-tag-panel {{item.tagtype}}-tag" >',
                    '<div class="layout-full safe-map-tag-content"></div>',
                    '</div>',
                    '</div>'
                ].join(''),
                replace: true,
                link: function($scope, $element) {

                    var eContent = $element.find('.safe-map-tag-content');

                    if($scope.item.tagtype == 'monitor') {
                        $element.width(25);
                        $element.height(25);
                    }else if($scope.item.tagtype == 'device') {
                        $element.width(25);
                        $element.height(25);
                    }

                    $scope.tagClick = function($event) {
                        $event.stopPropagation();
                        $scope.$parent.selectTag($scope.item);
                    };

                    init();
                    function init() {
                        locate();
                        if($scope.item.tagtype == 'monitor') {
                            createMonitorContent();
                        }else if($scope.item.tagtype == 'device') {
                            createDeviceContent();
                        }
                    }

                    function createMonitorContent() {
                        var html = [];
                        html.push('<div class="layout-full">');
                        html.push('<i class="fa fa-video-camera"></i>');
                        html.push('</div>');

                        var link = $compile(html.join(''));
                        var el = link($scope);
                        $timeout(function() {
                            eContent.html(el);
                        });
                    }

                    $scope.formatDeviceFa = {
                        'alarm': 'circle-o',
                        'door': 'columns',
                        'light': 'lightbulb-o',
                        'talkmain': 'microphone',
                        'talk': 'microphone',
                        'tv': 'tv',
                        'monitor': 'video-camera',
                        'broadcast': 'bullhorn',
                        'mattress': 'bed',
                        'telephone': 'fax'
                    };
                    $scope.formatMonitorIcon = {
                        '1': 'safe-icon safe-icon-video54',
                        '2': 'safe-icon safe-icon-webcam4',
                        '3': 'safe-icon safe-icon-video54 text-danger',
                        '4': 'fa fa-car'
                    };
                    function createDeviceContent() {
                        var html = [];
                        html.push('<div class="layout-full">');
                        if($scope.item && $scope.item.devicetype == 'monitor') {
                            html.push('<i ng-mouseenter="item.showLabel=true" ng-mouseleave="item.showLabel=false" class="{{formatMonitorIcon[item.monitortype]}}"></i>');
                        }else {
                            html.push('<i ng-mouseenter="item.showLabel=true" ng-mouseleave="item.showLabel=false" class="fa fa-{{formatDeviceFa[item.devicetype]}}"></i>');
                        }
                        html.push('<label ng-show="item.showLabel">{{item.devicename}}</label>');
                        html.push('</div>');

                        var link = $compile(html.join(''));
                        var el = link($scope);
                        eContent.html(el);
                    }

                    /**
                     * 将标签定位至图形位置处
                     */
                    function locate() {
                        $element.removeClass('bounceIn');

                        var rect = $scope.item.getRect($scope.item.style);
                        var shapeX = rect.x,
                            shapeY = rect.y,
                            shapeW = rect.width,
                            shapeH = rect.height,
                            tagX = $scope.item['tagX'],
                            tagY = $scope.item['tagY'],
                            tagH = $element.height(),
                            x, y;

                        if(tagX) {
                            y = tagY - tagH / 2;
                            x = tagX + 10;
                        }else {
                            x = shapeX + shapeW / 2 - $element.width() / 2;
                            y = shapeY + shapeH / 2 - $element.height() / 2;
                        }

                        if(!x) {
                            x = -20;
                        }
                        if(!y) {
                            y = -20;
                        }

                        $element.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                        $element.addClass('bounceIn');
                    }

                    $scope.$watch('item.reLocateNum', function(reLocateNum) {
                        if(reLocateNum > 0) {
                            locate();
                        }
                    });

                    $scope.$watch('item.devicename', function(devicename) {
                        if(devicename) {
                            var f = eContent.find('label').css('font-size').replace(/px/g, '');
                            if(f) {
                                f = parseInt(f);
                            }
                            var char1 = $scope.item.devicename.match(/[^\u4e00-\u9fa5\uf900-\ufa2d]/g);
                            var char2 = $scope.item.devicename.match(/[\u4e00-\u9fa5\uf900-\ufa2d]/g);

                            var w1 = 0, w2 = 0;
                            if(char1) {
                                w1 = char1.length * f / 2;
                            }
                            if(char2) {
                                w2 = char2.length * f;
                            }
                            eContent.find('label').css('left', -((w1 + w2) / 2 - 8));
                        }
                    });

                }
            }
        }
    ]);
});