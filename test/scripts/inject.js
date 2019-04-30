!(function () {
    'use strict';
    //当然了这个scripts的数据完全可以从服务器上动态获取回来加载
    var scripts = ['scripts/test'];

    //依赖脚本加载
    require(scripts, function () {
        //渲染
        angular.bootstrap(document, ['app']);
    });
}());
