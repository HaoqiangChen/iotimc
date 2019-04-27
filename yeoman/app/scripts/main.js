require.config({
  paths: {
    //一些库文件
    'jquery': '//cdn.staticfile.org/jquery/1.10.2/jquery.min',
    'angular': '//cdn.staticfile.org/angular.js/1.2.10/angular.min',
    'angular-route': '//cdn.staticfile.org/angular-ui-router/0.2.8/angular-ui-router.min',
    'domReady': '//cdn.staticfile.org/require-domReady/2.0.1/domReady.min',
    //js文件
    'bootstrap': "../scripts/init",
    'app': "../scripts/app",
    'router': "../scripts/router"
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular'],
      exports: 'angular-route'
    }
  },
  deps: ['bootstrap'],
  urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});
