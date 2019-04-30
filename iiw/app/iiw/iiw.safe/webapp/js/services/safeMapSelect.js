/**
 * 地图选择服务类。
 *
 * Created by YJJ on 2015-11-23.
 */
define([
    'app',
    'safe/js/directives/safeMapSelectPanel'
], function(app) {
    app.factory('safeMapSelect', ['$rootScope', '$compile', 'iAjax', function($rootScope, $compile, iAjax) {
        $(document).keydown(function(e) {
            if(e.keyCode == 8 && e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA') {
                $rootScope.$broadcast('mapSelectKeyDownBackEvent', e);
                return false;
            }
        });

        var cacheData = null;           // 缓存

        function MapSelect(config) {
            var setting = {
                scope: null,            // 父作用域
                showtext: false,        // 显示文本
                el: null,               // 注入的element
                data: null,             // 数据
                tree: null              // key=parentid(最顶级为root)，value=数组
            };

            $.extend(setting, config);

            var $scope;                 // 当期作用域。
            var events = {};            // 事件监听。

            if(!setting.el) {
                throw '缺少el参数，无法初始化MapSelect类';
            } else {
                setting.el = angular.element(setting.el);
            }

            if(setting.scope) {
                $scope = setting.scope.$new();
            } else {
                $scope = $rootScope.$new();
            }

            $scope.setting = setting;
            $scope.path = {
                paths: [],
                list: []
            };

            /**
             * 初始化，向el注入mapSelectPanel指令；
             *
             * @author : yjj
             * @version : 1.0
             * @Date : 2015-11-23
             */
            function _init() {
                getData();

                var html = [];
                html.push('<safe-map-select-panel class="layout-full safeMapSelectPanel"></safe-map-select-panel>');

                setting.el.html(html.join(''));
                var link = $compile(setting.el.contents());
                link($scope);

                $scope.$on('mapSelectKeyDownBackEvent', function() {
                    var paths = $scope.path.paths;
                    if(setting.el.width() && paths.length) {
                        var index = paths.length - 2;
                        if(index >= 0) {
                            $scope.gopath(index, paths[index]);
                        }
                    }
                });
            }


            function getData() {
                if(!setting.data) {
                    if(!cacheData) {
                        iAjax.post('security/common/monitor.do?action=getMapOuList', { filter: { cascade: 'Y' } }).then(function(data) {
                            setting.data = data.result.rows;
                            cacheData = setting.data;
                            formatData();
                        });
                    } else {
                        setting.data = cacheData;
                        formatData();
                    }
                } else {
                    formatData();
                }
            }


            function formatData() {
                if(setting.data) {
                    setting.tree = {};
                    $.each(setting.data, function(i, o) {
                        if(o.type == 'map') {
                            o['background-image'] = 'url(' + iAjax.formatURL('security/map/map.do?action=getFileDetail&url=' + o['savepath']) + ')';
                        }
                        if(o.parentid) {
                            if(setting.tree[o.parentid]) {
                                setting.tree[o.parentid].push(o);
                            } else {
                                setting.tree[o.parentid] = [o];
                            }
                        } else {
                            if(!setting.tree['$$root']) {
                                setting.tree['$$root'] = [o];
                            } else {
                                setting.tree['$$root'].push(o);
                            }
                        }
                    });

                    if(setting.tree['$$root']) {
                        $scope.select(setting.tree['$$root'][0]);
                    }
                }
            }

            $scope.select = function(object) {
                if(object.type != 'map') {
                    $scope.path.paths.push(object);
                    $scope.path.list = setting.tree[object.id];
                }
                call('select', object);
            };

            $scope.gopath = function(index, object) {
                $scope.path.paths = $scope.path.paths.slice(0, index+1);
                $scope.path.list = setting.tree[object.id];
                call('select', object);
            };


            function call(event, data) {
                if(events[event]) {
                    $.each(events[event], function(i, callback) {
                        callback(data);
                    });
                }
            }


            function _on(event, fn) {
                if(events[event]) {
                    events[event].push(fn);
                } else {
                    events[event] = [fn];
                }
            }


            function _destroy() {
                $scope.$destroy();
                setting.el.html('');
            }

            return {
                init: _init,
                on: _on,
                destroy: _destroy
            }
        }

        return {
            create: MapSelect
        }
    }]);
});