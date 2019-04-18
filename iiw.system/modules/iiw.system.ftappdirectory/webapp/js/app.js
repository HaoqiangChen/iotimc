/**
 * 访谈APP问卷目录设置
 * Created by chq on 2019-10-17.
 */
define([
  'app',
  'cssloader!system/ftappdirectory/css/index.css',
  'system/js/directives/systemTreeViewDirective'
], function (app) {
  app.controller('ftappDirectoryController', ['$scope', '$state', '$stateParams', 'iAjax', 'mainService', 'iMessage', function ($scope, $state, $stateParams, iAjax, mainService, iMessage) {
    mainService.moduleName = '访谈APP管理';
    var domain = 'http://iotimc8888.goho.co:17783';
    var wjId, wjName;
    if ($stateParams.data) {
      wjId = $stateParams.data.id;
      wjName = $stateParams.data.name;
    } else {
      wjId = '';
      wjName = '问卷';
      $scope.loading.content = '操作有误，至少有个前提问卷id才能设置对应目录';
    }
    $scope.title = wjName + '目录设置';
    var currentNode;
    $scope.m_sCode = null;
    $scope.m_sMode = 'view';

    function init() {
      $scope.reset();
      var url, data;
      url = domain + '/terminal/interview/system.do?action=getQuestiontypeList';
      data = {
        naireid: wjId
      };
      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          // .post(url, data)
          .then(function (data) {
            console.log(data);
            if (data.result.rows && data.result.rows.length > 0) {
              $scope.treeNodes = {
                zNodes: data.result.rows
              };
            } else {
              $scope.treeNodes = {
                zNodes: []
              };
            }
            $scope.$broadcast('initTree', $scope.treeNodes);
          }, function (err) {
            _remind(4, err.message, '请求失败，请查看网络状态!');
            $scope.loading.content = '请求失败，请查看网络状态';
          })
      })
    }

    // 树节点点击事件
    $scope.selectEvent = function (treeNode) {
      $scope.entityItem = treeNode;
      currentNode = treeNode;
      var parentNode = treeNode.getParentNode();
      if (parentNode) {
        $scope.entityItem.parentcode = parentNode.code ? parentNode.code : '0';
        $scope.entityItem.parentname = parentNode.name ? parentNode.name : '问卷目录';
        parentNode = null;
      } else {
        $scope.entityItem.parentcode = '0';
        $scope.entityItem.parentname = '问卷目录';
      }
    };

    // 添加问卷目录
    $scope.add = function () {
      $scope.m_sMode = 'add';
      $scope.m_sCode = '';
      $scope.entityItem = {};
      $scope.entityItem.id = '';
      $scope.entityItem.primaryid = '1';
      $scope.entityItem.questionnairefk = wjId;
      if (currentNode) {
        $scope.entityItem.parentname = currentNode.name;
        $scope.entityItem.parentid = currentNode.id;
        $scope.entityItem.parentcode = currentNode.coding;
        $scope.entityItem.type = currentNode.content;
        $scope.entityItem.content = '';
        $scope.entityItem.status = 'P';
      } else {
        $scope.entityItem.parentname = '问卷目录';
        $scope.entityItem.parentcode = '00';
        $scope.entityItem.parentid = null;
        $scope.entityItem.status = 'P';
      }
      $scope.entityItem.pid = $scope.entityItem.parentid;
    };

    // 保存问卷目录
    $scope.save = function () {
      var url;
      if ($scope.m_sCode) {
        // 更新接口
        url = domain + '/terminal/interview/system.do?action=questiontypeListController';
      } else {
        // 添加接口
        url = domain + '/terminal/interview/system.do?action=questiontypeListController';
      }

      var data = {
        type: 'addandupdate',
        questiontype: [$scope.entityItem]
      };
      console.log(data);

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          // .post(url, data)
          .then(function (data) {
            _remind(1, '提交成功!', '消息提醒');
            init();
          }, function (err) {
            _remind(4, '提交失败!', '消息提醒');
          })
      })
    };

    // 修改问卷目录
    $scope.mod = function () {
      $scope.m_sMode = 'mod';
      $scope.m_sCode = currentNode.id;
      $scope.entityItem = {};
      $scope.entityItem.primaryid = currentNode.id;
      var parentNode = currentNode.getParentNode();
      if (currentNode) {
        $scope.entityItem.parentname = parentNode ? parentNode.name : '问卷目录';
        $scope.entityItem.parentid = parentNode ? parentNode.id : '';
        $scope.entityItem.parentcode = parentNode ? parentNode.code : '0';
        $scope.entityItem.status = currentNode.status;
        $scope.entityItem.subtitle = currentNode.subtitle;
        $scope.entityItem.code = currentNode.code;
        $scope.entityItem.name = currentNode.name;
        $scope.entityItem.id = currentNode.id;
      }
    };

    // 删除问卷目录
    $scope.delete = function () {
      if ($scope.entityItem.children) {
        $scope.confirmMessage = '是否删除该记录以及该记录下所有的子节点？';
        $('.modal').modal();
      } else {
        var data = {
          type: 'delete',
          questiontype: [{id: $scope.entityItem.id}]
        };
        deleteRecord(data);
      }
    };

    $scope.reset = function () {
      currentNode = null;
      $scope.m_sCode = null;
      $scope.entityItem = null;
      $scope.m_sMode = 'view';
    };

    function deleteRecord(data) {
      // iAjax.post('security/deviceCode.do?action=delDeviceCode', data).then(function () {
      //   _remind(1, '删除成功!', '消息提醒');
      //   init();
      // }, function () {
      //   _remind(4, '删除失败!', '消息提醒');
      // });
      var url = domain + '/terminal/interview/system.do?action=questiontypeListController';
      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          // .post(url, data)
          .then(function (data) {
            _remind(1, '提交成功!', '消息提醒');
            init();
          }, function (err) {
            _remind(4, '提交失败!', '消息提醒');
          })
      })
    }

    $scope.confirm = function () {
      var data = {
        type: 'delete',
        questiontype: [{id: $scope.entityItem.id}]
      };
      deleteRecord(data);
    };

    $scope.cancel = function () {
      $scope.m_sMode = 'view';
    };

    $scope.back = function () {
      $state.go('system.ftappwjmanage');
    };

    $scope.$on('ftappDirectoryControllerOnEvent', function () {
      init();
    });

    function getToken(callback) {
      iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
        callback(data.token);
      }, function (err) {
        _remind(4, '请求失败，请查看网络状态!');
        $scope.loading.content = '请求失败，请查看网络状态';
      });
    }

    function _remind(level, content, title) {
      var message = {
        id: new Date(),
        level: level,
        title: (title || '消息提醒'),
        content: content
      };

      iMessage.show(message, false);
    }
  }]);
});
