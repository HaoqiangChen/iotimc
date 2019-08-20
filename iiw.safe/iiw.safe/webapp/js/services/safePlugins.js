/**
 * safe框架插件载入服务。
 *
 * TEST 测试性，加载插件，运行加载模块的初始化参数（js/init.js）。
 * 允许需要注入主框架监听事件并处理，可在内置方法里面加载指令和服务等实现更多的功能。
 *
 * Created by YJJ on 2016-12-07.
 */
(function() {
    var modules = ['app'];

    $.each($.soa.getInfo(), function(i, module) {
        if(module && module.init) {
            modules.push(module.route.requirename + '/js/init');
        }
    });

    define(modules, function() {
        var app = arguments[0],
            size = arguments.length;

        var modulesNames = [];
        for(var i = 1; i < size; i++) {
            modulesNames.push(arguments[i]);
        }

        app.factory('safePlugins', ['$compile', function($compile) {
            function _init(scope) {
                $.each(modulesNames, function(i, moduleName) {
                    if(moduleName) {
                        var _parentEl = $('.safe-main-plugins'),
                            _id = 'safeMainPlugin-' + moduleName,
                            _el;
                        _parentEl.append('<div id="' + _id + '" ng-controller="' + moduleName + '"></div>');
                        _el = _parentEl.find('#' + _id);
                        $compile(_el)(scope);
                    }
                });
            }

            return {
                init: _init
            };
        }]);
    });
})();
