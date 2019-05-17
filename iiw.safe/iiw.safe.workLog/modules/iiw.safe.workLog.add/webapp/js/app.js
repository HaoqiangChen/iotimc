/**
 * 值班日志
 *
 * Created by chq on 2019/12/28.
 */
define([
  'app',
  'cssloader!safe/workLog/add/css/index',
  'safe/workLog/add/js/directives/syouTreeView'
], function (app) {
  app.controller('workLogAddController', ['$rootScope', '$scope', '$state', '$stateParams', 'safeMainTitle', 'iMessage', 'iTimeNow', 'iAjax', '$filter', '$uibModal', '$timeout',

    function ($rootScope, $scope, $state, $stateParams, safeMainTitle, iMessage, iTimeNow, iAjax, $filter, $uibModal, $timeout) {
      safeMainTitle.title = '值班日志';

      $scope.userRole = 0; // 0=分控中心 1=指挥中心

      if ($stateParams.data) {
        $scope.logItem = $stateParams.data
      } else {
        $scope.logItem = {
          type: '1',
          criminalnum: 0, // 罪犯参与数量
          policenum: 0, // 干警配备数量
          durationtime: '', // 持续时间
          movementarea: '', // 活动区域
          responsible: '', // 责任人
          registrar: '' // 登记人姓名
        }
      }

      $scope.worklogAdd = {
        path: $.soa.getWebPath('iiw.safe'),
        ouList: [],
        cancel: function (path) {
          $state.go(path);
        },
        submit: function () {
          // console.log($scope.logItem)
          iAjax.post('information/rota/rota.do?action=saveDutyLogList', {filter: $scope.logItem}).then(function (data) {
            if (data.status === 1) {
              _remind(1, '保存成功');
              $state.go('safe.workLog');
              $scope.$parent.worklog.getList();
            }
          }, function (err) {
            _remind(4, '网络连接失败')
          })
        }
      };

      $scope.syouTree = {
        showOuTree: function () {
          $('#syouTreeModal').show();
          $('#syouTreeModal').addClass('in');
        },
        selectOu: function () {
          if (syoufk === '') {
            _remind(3, '请选择至少一个单位信息！', '请选择单位');
          } else {
            $scope.logItem.syouname = syouname;
            $scope.logItem.syoufk = syoufk;
            $('#syouTreeModal').removeClass('in');
            $('#syouTreeModal').hide();
          }
        },
        cancelOu: function () {
          $('#syouTreeModal').removeClass('in');
          $('#syouTreeModal').hide();
        },

      }
      $scope.selectEvent = function (treeNode) {
        // syouname = treeNode.name;
        // syoufk = treeNode.id;
        $scope.logItem.syouname = treeNode.name;
        $scope.logItem.syoufk = treeNode.id;
        $('#syouTreeModal').removeClass('in');
        $('#syouTreeModal').hide();
      }

      $scope.getTypes = function () {
        iAjax.post('/iotiead/common.do?action=getSycodeList', {
          filter: {type: 'DUTYLOG'}
        }).then(function (data) {
          if (data.result && data.result.rows.length) {
            $scope.workTypes = data.result.rows;
          } else {
            $scope.workTypes = [];
          }
        });
      }

      function _init() {
        iAjax.post('/security/check/check.do?action=getSpecialrole', {filter: {url: ['isBCU']}}).then(function (data) {
          if (data.result.rows.isBCU) {
            $scope.userRole = parseInt(data.result.rows.isBCU);
          } else {
            $scope.userRole = 0;
          }

          if (!$scope.userRole) {
            iAjax.post('/security/information/information.do?action=getSyouDis', {}).then(function (data) {
              if (data.result && data.result.rows.length) {
                $scope.treeNodes = {
                  zNodes: data.result.rows
                }
              } else {
                $scope.treeNodes = {
                  zNodes: []
                }
              }

              $rootScope.$broadcast('initTree', $scope.treeNodes);
            }, function (err) {
              _remind(4, '网络故障，请求单位列表失败，请重新点击获取！');
            })
          } else {
            iAjax.post('/security/common/monitor.do?action=getSyouDetail', {}).then(function (data) {
              if (data.result && data.result.rows.length) {
                $scope.logItem.syouname = data.result.rows[0].syouname;
                $scope.logItem.syoufk = data.result.rows[0].id;
              } else {
                _remind(3, '获取当前单位失败，请手动填写');
              }
            }, function (err) {
              _remind(3, '获取当前单位失败，请手动填写');
            })
          }
        })
        $scope.getTypes()
      }

      $scope.$on('workLogAddControllerOnEvent', function () {
        _init()
      });

      function _remind(level, content, title) {
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
