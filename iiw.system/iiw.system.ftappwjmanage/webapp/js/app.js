/**
 * 访谈APP问卷管理
 * Created by chq on 2019-10-15.
 */
define([
  'app',
  'cssloader!system/ftappwjmanage/css/loading',
  'cssloader!system/ftappwjmanage/css/index.css',
  'system/ftappwjmanage/js/directives/kindEditor'
], function (app) {
  app.controller('ftappWjmanageController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
    mainService.moduleName = '访谈APP管理';
    $scope.title = '问卷列表';
    $scope.keyword = '请输入问卷名进行搜索...';
    var domain = 'http://iotimc8888.goho.co:17783';
    var wjData = {};

    $scope.wjTypes = [
      {
        name: '访谈问卷',
        type: 'wjlx_ftwj',
        typeName: '访谈问卷',
        icon: 'fa-newspaper-o',
        info1: '重新犯罪问题调查',
        info2: '丰富题型，强大逻辑'
      },
      {name: '量表测试', type: 'wjlx_lb', typeName: '量表测试', icon: 'fa-list-ol', info1: '支持多级测评维度', info2: '呈现测评报告'}
    ];

    $scope.filter = {
      content: '',
      status: '',
      name: '',
      starttime: '',
      endtime: ''
    };
    $scope.params = {
      pageNo: 0,
      pageSize: 10
    };

    $scope.wjLists = [
        {name: '初犯', id: 'D64B236EA44046528699011C0258E9DE', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
      {name: '测试问卷', id: '0FB464990CFB480FA534AA3966FA791E', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '未发布', answersituation: '测试', cretime: 1566459855000, existed: '0'},
      {name: '测试量表', id: '574DBD507DB04A7C84AE46E142A22FB2', content: 'wjlx_lb', typename: '量表测试', runStatus: 0, runStatusName: '未发布', answersituation: '测试', cretime: 1566459855000},
      {name: '刑罚执行完毕后未重新犯罪者', id: '354DD9C8DD08460A83BDA9A06D874B86', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
      {name: '重犯', id: 'B701AB0474BE475B8CF22E6152B9FC01', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
        {name: '共情量表测试', id: '0CFF778DCDD94C85BC67141E388E403E', content: 'wjlx_lb', typename: '量表测试', runStatus: 0, runStatusName: '未发布', answersituation: '测试', cretime: 1566459855000}
    ];
    $scope.getList = function () {
      $scope.loading = {
        isLoading: true,
        content: '问卷列表加载中'
      };

      var url, filter, data;
      url = domain + '/terminal/interview/system.do?action=getNaireList';
      filter = JSON.parse(JSON.stringify($scope.filter));
      for (let v in filter) {
        if (filter[v] === '') delete filter[v]
      }
      data = {
        filter: filter,
        params: $scope.params
      };

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          // .post(url, data)
          .then(function (data) {
            console.log(data);
            if (data.result && data.result.rows) {
              $scope.wjList = data.result.rows;
              $scope.loading.isLoading = false;
            } else {
              $scope.wjList = [];
            }
            if (data.result.params) {
              $scope.params = data.result.params;
            }
          }, function (err) {
            _remind(4, err.message, '请求失败，请查看网络状态!');
            $scope.loading.content = '请求失败，请查看网络状态';
          })
      })
    };

    $scope.editWj = function (action, data) {
      $scope.hasEdit = true;
      $scope.wjDetails = {
        code: '',
        name: '',
        subtitle: '',
        describes: '',
        typefk: '',
        status: 'N',
        answersituation: '',
        iscommon: '0',
        question: '',
        ismust: '1',
        istotal: 'N',
      };
      $scope.wjDetails.action = action;
      switch (action) {
        case 'add':
          $('#newwjModal').modal('hide');
          if (data === 'wjlx_ftwj') $scope.wjDetails.typefk = '430DE5F396E94FA8B3CF56B5437D0DD9';
          else $scope.wjDetails.typefk = '1F0EE9C8AB7145C184B23283C5BE5B17';
          $scope.wjDetails.content = data;
          break;
        case 'mod':
          $scope.wjDetails = data;
          if (data === 'wjlx_ftwj') $scope.wjDetails.typefk = '430DE5F396E94FA8B3CF56B5437D0DD9';
          else $scope.wjDetails.typefk = '1F0EE9C8AB7145C184B23283C5BE5B17';
          break;
        case 'copy':
          _remind(3, '暂未开发');
          return false;
          $scope.wjDetails = data;
          break;
      }
    };
    $scope.goWj = function (item) {
      wjData = JSON.parse(JSON.stringify(item));
      if (item.existed === '0') {
        iConfirm.show({
          scope: $scope,
          title: '请先配置问卷目录',
          content: '该问卷尚未配置目录，是否前往问卷目录配置页面进行配置？',
          buttons: [{
            text: '确认',
            style: 'button-primary',
            action: 'directorySuccess'
          }, {
            text: '取消',
            style: 'button-caution',
            action: 'confirmCancel'
          }]
        });
        return false;
      }
      if (item) {
        $state.params = {
          data: item
        };
        switch (item.content) {
          case 'wjlx_ftwj':
            $state.go('system.ftappquestionnaire', $state.params);
            break;
          case 'wjlx_lb':
            $state.go('system.ftappscale', $state.params);
            break;
        }
      } else {
        $state.params = {
          data: null
        };
        _remind(4, '错误操作!');
      }
    };
    $scope.directory = function (item) {
      if (item) {
        $state.params = {
          data: item
        };
        $state.go('system.ftappdirectory', $state.params);
      } else {
        $state.params = {
          data: null
        };
        _remind(4, '错误操作!');
      }
    };
    $scope.directorySuccess = function (id) {
      iConfirm.close(id);
      if (wjData) {
        $state.params = {
          data: wjData
        };
        $state.go('system.ftappdirectory', $state.params);
      } else {
        $state.params = {
          data: null
        };
        _remind(4, '错误操作!');
      }
    };
    $scope.saveWj = function () {
      $('#wjconfigModal').modal('hide');
      $scope.loading = {
        isLoading: true,
        content: '提交中'
      };

      var url = domain + '/terminal/interview/system.do?action=saveAndUpdateNaire';

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, $scope.wjDetails)
          // .post(url, data)
          .then(function (data) {
            // console.log(data);
            if (data.status === 1) {
              _remind(1, data.message, data.message);
              $scope.getList();
              $scope.loading.isLoading = false;
            }
          }, function (err) {
            _remind(4, err.message, err.message);
            $scope.loading.isLoading = false;
          })
      })
    };
    $scope.release = function (data) {
      wjData = JSON.parse(JSON.stringify(data));
      let statusName = data.status === 'P' ? '停止' : '发布';
      iConfirm.show({
        scope: $scope,
        title: '确认' + statusName + '？',
        content: '未发布问卷将无法答题，是否确认' + statusName + '？',
        buttons: [{
          text: '确认',
          style: 'button-primary',
          action: 'releaseSuccess'
        }, {
          text: '取消',
          style: 'button-caution',
          action: 'confirmCancel'
        }]
      });
    };
    $scope.releaseSuccess = function (id) {
      iConfirm.close(id);
      let statusName = wjData.status === 'P' ? '停止' : '发布';
      $scope.loading = {
        isLoading: true,
        content: statusName + '中'
      };
      if (wjData.status === 'P') wjData.status = 'N';
      else wjData.status = 'P';
      if (wjData.content === 'wjlx_ftwj') wjData.typefk = '430DE5F396E94FA8B3CF56B5437D0DD9';
      else wjData.typefk = '1F0EE9C8AB7145C184B23283C5BE5B17';

      var url = domain + '/terminal/interview/system.do?action=saveAndUpdateNaire';

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization= ${token}`, wjData)
          // .post(url, data)
          .then(function (data) {
            // console.log(data);
            if (data.status === 1) {
              _remind(1, data.message, statusName + '问卷成功!');
              $scope.getList();
              $scope.loading.isLoading = false;
            }
          }, function (err) {
            _remind(3, err.message, statusName + '问卷失败!');
            $scope.loading.isLoading = false;
          })
      })
    };
    $scope.confirmCancel = function (id) {
      iConfirm.close(id);
    };
    $scope.delWj = function (data) {
      wjData = JSON.parse(JSON.stringify(data));
      iConfirm.show({
        scope: $scope,
        title: '确认删除？',
        content: '删除问卷后将无法还原，是否确认删除？',
        buttons: [{
          text: '确认',
          style: 'button-primary',
          action: 'delSuccess'
        }, {
          text: '取消',
          style: 'button-caution',
          action: 'confirmCancel'
        }]
      });
    };
    $scope.delSuccess = function (id) {
      iConfirm.close(id);
      $scope.loading = {
        isLoading: true,
        content: '删除问卷中'
      };
      if (wjData.content === 'wjlx_ftwj') wjData.typefk = '430DE5F396E94FA8B3CF56B5437D0DD9';
      else wjData.typefk = '1F0EE9C8AB7145C184B23283C5BE5B17';

      var url = domain + '/terminal/interview/system.do?action=deleteNaire',
      data = {ids: [wjData.id]};

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization= ${token}`, data)
          // .post(url, data)
          .then(function (data) {
            // console.log(data);
            if (data.status === 1) {
              _remind(1, data.message, '删除问卷成功!');
              $scope.getList();
              $scope.loading.isLoading = false;
            }
          }, function (err) {
            _remind(3, err.message, '删除问卷失败!');
            $scope.loading.isLoading = false;
          })
      })
    };

    $scope.$on('ftappWjmanageControllerOnEvent', function () {
      $scope.getList();
    });

    function getToken(callback) {
      iAjax.post(domain + '/terminal/interview/system.do?action=login&username=13712312312&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
        callback(data.token);
      }, function (err) {
        _remind(4, err.message, '请求失败，请查看网络状态!');
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
