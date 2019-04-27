define([], function () {
  return {
    defaultRoutePath: '/index',
    routes: {
      '/index': {
        templateUrl: 'tpls/index.html',
        controller: 'indexCtr',
        dependencies: ['js/controllers/index.js', 'js/directives/derective1.js']
        //这就是按需导入js文件
      },

    }
  };
});
