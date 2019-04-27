define(["app"],
  function (app) {
    return app.run([
      '$rootScope',
      '$state',
      '$stateParams',
      function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams
      }
    ])
      .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
        //用于改变state时跳至顶部
        $uiViewScrollProvider.useAnchorScroll();
        // 默认进入先重定向
        $urlRouterProvider.otherwise('/home');
        $stateProvider
          .state('home', {
            //abstract: true,
            url: '/home',
            views: {
              'main@': {
                templateUrl: '../view/home.html'
              }
            }
          })
      })
  })
