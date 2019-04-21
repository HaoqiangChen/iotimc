/**
 * 通知推送
 *
 * Created by chq on 2019-11-12.
 */
define([
  'app',
  'angularAMD',
  'safe/noticePush/js/directives/monitorpatroltree',
  'safe/noticePush/js/services/safeFilePath',
  'cssloader!safe/noticePush/css/index.css',
], function (app) {
  var packageName = 'iiw.safe.noticePush';
  app.controller('noticePushController', ['$scope', '$state', 'iAjax', 'iToken', 'iMessage', 'iConfirm', 'iTimeNow', '$element', '$stateParams', '$uibModal', '$http', 'safeFilePath', '$filter',
    function ($scope, $state, iAjax, iToken, iMessage, iConfirm, iTimeNow, $element, $stateParams, $uibModal, $http, safeFilePath, $filter) {
      var cacheUserTreeList = [];
      var filesList = [];
      $scope.showList = true;
      $scope.showNotice = false;
      $scope.operate = '';
      $scope.role = true;
      $scope.getRole = function () {
        iAjax.post('/security/check/check.do?action=getSpecialrole', {filter: {url: ['messageSend']}}).then(function (data) {
          if (data.result.rows.messageSend === '1') $scope.role = true;
          else $scope.role = false;
        }, function (err) {
          showMessage(4, err.message, '请求失败，请查看网络状态！');
        })
      };

      $scope.syusername = '';
      $scope.syuser = [];
      $scope.noticeItem = {
        notice: {},
        filesList: [],
        userTree: {
          show: function () {
            getSyuserTree(function (list) {
              var modalInstance = $uibModal.open({
                templateUrl: 'userTreeDialog.html',
                controller: 'userTreeController',
                size: '',
                resolve: {
                  items: function () {
                    return list
                  },
                  initItems: function () {
                    return ($scope.syuser.map(function (o) {
                      return o.id;
                    }) || []);
                  }
                }
              });
              modalInstance.result.then(function (list) {
                if (list.length) {
                  $scope.syuser = list;
                  $scope.syusername = list.map(function (o) {
                    return o.name;
                  }).join('、');
                }
              });
            })
          }
        },
        upload: function () {
          $('#taxFile').click();
        },
        uploading: function (data) {
          $.each(data.files, function (i, o) {
            var size = '';
            if (o.size > 10240 && o.size < 1048576) {
              size = Math.floor(o.size / 1024) + 'KB';
            } else if (o.size > 1048576 && o.size < 1073741824) {
              size = Math.floor(o.size / 1024 / 1024) + 'MB';
            }

            $scope.noticeItem.filesList.push({
              file: o,
              name: o.name,
              size: size,
              image: '',
              temp: o.name,
              type: safeFilePath.getFileTypeByPath(o.name),
              icon: safeFilePath.getFileIconByType(o.name),
              date: $filter('date')(new Date().getTime(), 'yyyy-MM-dd MM:HH:ss'),
              font: null
            });
          });
          _.each(data.files, function (item) {
            var formData = new FormData();
            formData.append('file', item);
            uploadFile(formData, function (rows) {
              filesList.push(rows.result);
            })
          });
        },
        save: function () {
          var url = 'information/report/report.do?action=updateNoticeInfo';
          var data = {
            title: $scope.noticeItem.notice.title,
            content: $scope.noticeItem.notice.content,
            syuser: $scope.syuser.map(function (o) {
              return o.id;
            }),
            files: filesList,
            id: $scope.noticeItem.notice.id,
            reply: $scope.noticeItem.notice.reply
          };
          if ($scope.role) {
            delete data.id;
            delete data.reply;
          } else {
            data = {id: data.id, reply: data.reply}
          }
          iAjax
            .post(url, data)
            .then(function (data) {
              if (data.status === 1) {
                if ($scope.role) showMessage(1, '发布通知成功！', '发布通知成功');
                else showMessage(1, '回复通知成功！', '回复通知成功');
                $scope.showNotice = false;
                $scope.showList = true;
                $scope.notice.getNotices();
              }
            })
        },
        cancel: function () {
          $scope.showNotice = false;
          $scope.showList = true;
        },
        download: function (file) {
          window.open(file);
        }
      };

      $scope.notice = {
        filesList: [],
        noticeList: [],
        filter: {
          searchText: '',
        },
        params: {
          pageNo: 1,
          pageSize: 10
        },
        selectAll: false,

        getNotices: function () {
          var url = '/information/report/report.do?action=getNoticeInfo';
          var data = {
            filter: $scope.notice.filter,
            params: $scope.notice.params
          };

          iAjax.post(url, data).then(function (data) {
            // console.log(data)
            $scope.notice.noticeList = data.result.rows;
            $scope.notice.params = data.result.params;
          }, function (err) {
            showMessage(4, err.message, '请求失败，请查看网络状态！');
          })
        },

        showNoticeItem: function (operate, data) {
          $scope.noticeItem.notice = {};
          $scope.operate = operate;
          $scope.noticeItem.notice = data;
          if (operate === 'add') {
            $scope.syusername = '';
            $scope.syuser = [];
            $scope.noticeItem.filesList = [];
          } else if (operate === 'look') {
            let users = [];
            _.each($scope.noticeItem.notice.syuser, function (_user) {
              users.push(_user.name);
            });
            $scope.noticeItem.notice.syusers = users.join('、');
            if (data.sign === '1') {
              $scope.noticeItem.notice.reply = _.filter($scope.noticeItem.notice.syuser, function (_user) {
                return _user.sign === '1';
              })[0].reply;
            }
          }
          if ($scope.noticeItem.notice.files && $scope.noticeItem.notice.files.length) {
            $scope.noticeItem.notice.filesList = [];
            _.each($scope.noticeItem.notice.files, function (_f) {
              $scope.noticeItem.notice.filesList.push({
                name: safeFilePath.getFileNameByPath(_f),
                type: safeFilePath.getFileTypeByPath(_f),
                icon: safeFilePath.getFileIconByType(_f),
                url: iAjax.formatURL('/security/common/monitor.do?action=getFileDetail') + '&url=' + _f
              })
            })
          }
          $scope.showList = false;
          $scope.showNotice = true;
        },

        del: function () {
          var aSelect = _.where($scope.notice.noticeList, {checked: true});
          if (aSelect.length) {
            iConfirm.show({
              scope: $scope,
              title: '确认删除？',
              content: '共选择' + aSelect.length + '条数据',
              buttons: [{
                text: '确认',
                style: 'button-primary',
                action: 'notice.delConfirm'
              }, {
                text: '取消',
                style: 'button-caution',
                action: 'notice.confirmClose'
              }]
            });
          } else {
            showMessage(3, '请选择一条以上的数据进行删除!')
          }
        },

        delConfirm: function (id) {
          iConfirm.close(id);
          var aSelect = _.filter($scope.notice.noticeList, {checked: true});
          var url = '/information/report/report.do?action=delNoticeInfo',
            ids = [];

          if (aSelect.length > 0) {
            $.each(aSelect, function (i, o) {
              ids.push(o.id);
            });
            iAjax.post(url, {ids: ids}).then(function (data) {
              if (data.status === 1) {
                showMessage(1, '删除成功!');
                $scope.notice.getNotices();
              }
            }, function (data) {
              showMessage(4, '删除失败!');
            });
          }
        },

        confirmClose: function (id) {
          iConfirm.close(id);
        },

        select: function (item, event) {
          if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON')) {
            return;
          } else {
            item.checked = !item.checked;
          }
        },
        selAll: function () {
          $.each($scope.notice.noticeList, function (i, o) {
            o.checked = $scope.notice.selectAll;
          });
        }
      };

      //上传文件
      function uploadFile(formData, callback) {
        $.ajax({
          type: 'post',
          url: '/security/infolinkage.do?action=savepicture&ptype=true&authorization=' + iToken.get(),
          async: true,
          dataType: "json",
          enctype: 'multipart/form-data',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function (data) {
            console.log(data)
            callback(data)
          }
        });
      }

      $scope.$on('noticePushControllerOnEvent', function () {
        $scope.getRole();
        $scope.notice.getNotices();
        _refreshPage();
      });

      function getSyuserTree(cb) {
        if (cacheUserTreeList.length > 0) {
          if (cb && typeof (cb) === 'function') {
            cb(cacheUserTreeList);
          }
        } else {
          getData('sys/web/syou.do?action=getSyouAll', {}, function (ouList) {
            getData('sys/web/syuser.do?action=getSyuserAll', {}, function (userList) {

              $.each(userList, function (i, o) {
                o['isUser'] = true;
                o['iconSkin'] = 'userIcon';
              });

              $.each(ouList, function (i, o) {
                o['isOu'] = true;
                o['iconSkin'] = 'ouIcon';
                cacheUserTreeList.push(o);
                cacheUserTreeList = cacheUserTreeList.concat(_.filter(userList, {syoufk: o.id}));
              });

              if (cb && typeof (cb) === 'function') {
                cb(cacheUserTreeList);
              }
            });
          });
        }
      }

      function getData(url, data, cb) {
        iAjax
          .post(url, data)
          .then(function (data) {
            if (data && data.result && data.result.rows) {
              if (cb && typeof (cb) === 'function') {
                cb(data.result.rows);
              }
            }
          });
      }

      function _refreshPage() {
        var a = "注意！！\n您即将离开页面！离开后可能会导致数据丢失\n\n您确定要离开吗？";
        window.onbeforeunload = function (b) {
          b = b || window.event;
          b.returnValue = a;
          return a
        }
      }

      function showMessage(level, content, title) {
        var message = {
          id: iTimeNow.getTime(),
          title: (title || '消息提醒！'),
          level: level,
          content: (content || '')
        };
        iMessage.show(message, false);
      }
    }
  ]);

  app.controller('userTreeController', [
    '$scope',
    '$uibModalInstance',
    'items',
    'initItems',

    function ($scope, $uibModalInstance, items, initItems) {
      if (items && items.length > 0) {
        var index;
        $.each(items, function (i, o) {
          if (o.checked) {
            o.checked = false;
          }
        });
        $.each(initItems, function (i, id) {
          index = _.findIndex(items, {id: id});
          if (index > -1) {
            items[index].checked = true;
          }
        });
      }
      $scope.userTree = {
        setting: {
          check: {
            enable: true
          },
          data: {
            key: {
              title: 't'
            },
            simpleData: {
              enable: true
            }
          }
        },
        tree: {
          treeNodes: items
        }
      };

      $scope.ok = function () {
        var list = [];
        var nodes = $scope.userTree.oNode.getCheckedNodes();
        $.each(nodes, function (i, o) {
          if (o.checked && o['isUser']) {
            list.push({
              id: o.id,
              name: o.name
            });
          }
        });

        $uibModalInstance.close(list);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);

});
