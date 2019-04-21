
/**
 * 搜索结果盒子
 *
 * 1、搜索结果分三类：犯人、警察、设备；均提供定位跳转功能（直接跳转到所在地图的区域）。
 * 1.1、犯人定位位置是根据犯人房间号和地图房间图形房间号匹配得到。
 * 1.2、警察定位位置是根据区域动态得到。
 * 1.3、设备定位位置是根据设备点图层绑定的设备匹配得到。
 *
 * @author - dwt
 * @date - 2016-02-17
 * @version - 0.1
 */
define([
    'app',
    'cssloader!../../css/searchbox.css'
], function(app) {
    app.directive('safeInsidemapSearchbox', [
        '$compile',

        function($compile) {
            return {
                restrict: 'A',
                scope: {
                    list: '=searchList'
                },
                compile: function() {
                    return {
                        post: function(scope, element) {

                            scope.isOpen = true;
                            scope.limitNum = 50;

                            scope.loadMore = function() {
                                scope.limitNum += 50;
                            };

                            var url = $.soa.getWebPath('iiw.safe.insidemap') + '/view/searchbox.html';
                            element.load(url, function() {
                                $compile(element.contents())(scope);
                            });

                            scope.$watch('list', function(list) {
                                if(list && list.length) {
                                    $('.safe-insidemap-searchbox').show('fade');
                                    if(!scope.isOpen) {
                                        scope.show();
                                    }
                                }else {
                                    $('.safe-insidemap-searchbox').hide('fade');
                                }
                            });

                            scope.locate = function(item) {
                                scope.$parent.$broadcast('locateInformation', item);
                                scope.hide();
                            };

                            scope.show = function() {
                                element.animate({
                                    height: '360px'
                                }, 300);
                                scope.isOpen = true;
                            };

                            scope.hide = function() {
                                element.animate({
                                    height: '30px'
                                }, 300);
                                scope.isOpen = false;
                            };

                            scope.close = function() {
                                $('.safe-insidemap-searchbox').hide('fade');
                                scope.list = [];
                                scope.$parent.$broadcast('locateInformationClose');
                            };

                            scope.showYJT = function(data) {
                                if(data.type == 'police') {
                                    scope.$emit('safeInfoCardPoliceEvent', {coding: data.coding});
                                }else if(data.type == 'criminal') {
                                    scope.$emit('map.showCriminalYJT', data.coding);
                                }
                            };
                        }
                    }
                }
            }
        }
    ]);
});