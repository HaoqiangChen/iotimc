/**
 * require 主入口，相关配置依赖从这里配置
 */
require.config({
    baseUrl: "/",
    //每次新加载js，为了避免缓存
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        'jquery': 'lib/jquery.min',
        'angular': 'lib/angular.min',
        'angular-route': 'lib/angular-route.min',
        'app': 'scripts/app',
        //入口注入脚本
        'inject' : 'scripts/inject'
    },
    shim: {
        'angular': ['jquery'],
        'angular-route': ['angular']
    }
});
require(["inject"], function() {});
