/**
 * 模块开发测试
 * Created by chq on 2019/11/08.
 */
define([
  'app',
  'cssloader!system/test/css/index'
], function (app) {
  app.controller('testController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
    mainService.moduleName = '开发测试';
    $scope.title = '开发测试';

    $scope.modules = [
      {status: true, name: '测试开发', href: 'ftappuseraudit', icon: 'fa-newspaper-o'}
    ];

    $scope.filter = {
      content: 'huixun',
      // status: '',
      // name: '',
      // starttime: '',
      // endtime: '',
      type: 'talk',
      keyvalue: '8162',
    };
    $scope.params = {
      pageNo: 0,
      pageSize: 10
    };

    $scope.getList = function () {
      var url, data;
      url = '/security/device.do?action=getDeviceDetail4Dtl';
      data = {
        filter: $scope.filter,
        params: $scope.params
      };

      iAjax
        .post(url, data)
        .then(function (data) {
          console.log(data);
          if (data.result && data.result.rows) {
            $scope.list = data.result.rows;
          } else {
            $scope.list = [];
          }
          if (data.result.params) {
            $scope.params = data.result.params;
          }
        }, function (err) {
          _remind(4, err.message, '请求失败，请查看网络状态!');
        })
    };


    // 模块跳转
    $scope.jumpModule = function (router) {
      window.location = '#/system/' + router;
    };

    $scope.$on('testControllerOnEvent', function () {
      // $state.go('safe.sjposition');
      // $scope.getList();
    });

    // 全局的消息提醒服务
    function _remind(id, level, title, content, timeout, fn, scope) {
      var message = {
        id: (id || iTimeNow.getTime()),
        title: (title || '呼叫提醒！'),
        level: level,
        content: (content || ''),
        timeout: timeout,
        fn: fn
      };
      for (let v in message) {
        if (message[v] === '') delete message[v]
      }
      iMessage.show(message, false, scope);
    }


    // 全局的消息提醒服务
    function remind(level, content, title) {
      var message = {
        id: iTimeNow.getTime(),
        title: (title || '消息提醒！'),
        level: level,
        content: (content || '')
      };
      iMessage.show(message, false);
    }

    // 获取URL参数
    function getUrlParam(param) {
      return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
    }

  }]);
});
