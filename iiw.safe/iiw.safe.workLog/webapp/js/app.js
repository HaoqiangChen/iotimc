/**
 * 值班日志
 *
 * Created by chq on 2019/12/24.
 */
define([
  'app',
  'cssloader!safe/workLog/css/index'
], function (app) {
  app.controller('workLogController', ['$scope', '$state', 'safeMainTitle', 'iMessage', 'iConfirm', 'iTimeNow', 'iAjax', '$filter',
    function ($scope, $state, safeMainTitle, iMessage, iConfirm, iTimeNow, iAjax, $filter) {
      safeMainTitle.title = '值班日志';

      $scope.worklog = {
        path: $.soa.getWebPath('iiw.safe'),
        types: [],
        list: [],
        delId: '',
        filter: {
          searchText: '',
          type: '',
          dutytime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd')
        },
        params: {
          pageNo: 0,
          pageSize: 10
        },
        getTypes: function () {
          iAjax.post('/iotiead/common.do?action=getSycodeList', {
            filter: {type: 'DUTYLOG'}
          }).then(function (data) {
            if (data.result && data.result.rows.length) {
              $scope.worklog.types = data.result.rows;
              console.log($scope.worklog.types)
            }
          });
        },
        getList: function () {
          iAjax.post('information/rota/rota.do?action=getdutylist', {
            filter: this.filter,
            params: this.params
          }).then(function (data) {
            if (data.result && data.result.rows.length) {
              $scope.worklog.list = data.result.rows;
              if (data.result.params) {
                $scope.worklog.params = data.result.params;
              }
            }
          });
        },
        keyup: function (e) {
          if (e.keyCode == 13) {
            this.getList();
          }
        },
        back: function () {
          window.history.back()
        },
        state: function (path, rows) {
          if (rows) {
            $state.params = {data: rows};
            $state.go(path, $state.params);
          } else {
            $state.params = {data: null};
            $state.go(path, $state.params);
          }
        },
        del: function (id) {
          $scope.worklog.delId = id;
          iConfirm.show({
            scope: $scope,
            title: '确认删除？',
            content: '',
            buttons: [{
              text: '取消',
              style: 'btn-danger',
              action: 'worklog.confirmClose'
            }, {
              text: '确认',
              style: 'btn-primary',
              action: 'worklog.confirmDel'
            }]
          });

        },
        confirmDel: function (id) { 
          iConfirm.close(id);
          iAjax.post('information/rota/rota.do?action=deletedutylist', {filter: {ids: [$scope.worklog.delId]}}).then(function () {
            _remind(1, '删除日志记录成功')
            $scope.worklog.getList();
          }, function () {
            _remind(4, '网络连接失败')
          })
        },
        confirmClose: function (id) {
          iConfirm.close(id);
        }
      };

      $scope.$on('workLogControllerOnEvent', function () {
        $scope.worklog.getTypes();
        $scope.worklog.getList();
      });

      function _remind(level, title, content) {
        var message = {
          id: new Date(),
          level: level,
          title: (title || '消息提醒'),
          content: content
        };
        iMessage.show(message, false);
      }

    }
  ]);
});
