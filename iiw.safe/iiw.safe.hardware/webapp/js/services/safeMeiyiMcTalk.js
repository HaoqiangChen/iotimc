/**
 * 美一对讲虚拟终端
 *
 * Created by chq on 2019-12-01.
 */
define([
  'app'
], function (app) {
  app.factory('safeMeiyiMcTalk', ['$rootScope', '$timeout', 'iAjax', 'iMessage', 'iConfirm', '$state', 'iTimeNow', 'safeHardware', 'safeSound', 'safeImcsPlayer',
    function ($rootScope, $timeout, iAjax, iMessage, iConfirm, $state, iTimeNow, safeHardware, safeSound, safeImcsPlayer) {
      var _type = 'meiyimc',
        _device, // 当前主机
        _sdkid,
        _active, // 正呼叫的分机
        _scope,
        _list = {},
        _callID,
        _callinID,
        _imcsProcessInitStatus = false, // 视频插件初始化，等待事件 onImcsProcessInit 回调 .在此事件回调前,请不要调用其他接口!!! 此过程可能需要等待 5-20秒时间.
        _intercomStatus = false, // =false 空闲 =true 工作中
        _isVideo = true, // 是否启动对讲画面
        _window, // 视频窗口
        window_w = 640,
        window_h = 480,
        window_x = 0,
        window_y = 0,
        window_opaque = 200;

      function init(callback) { // 获取对讲设备信息
        iAjax.post('sys/web/role.do?action=getVmInitInfo', {
          filter: {
            company: _type
          }

        }).then(function (data) {
          if (data && data.result) {
            callback(data.result);
          }
        });
      }

      function talk(source, target) { // 呼叫
        if (!_intercomStatus) {
          _active = target;
          _callID = target.deviceid;
          if (!_isVideo) {
            var cmd = {
              "cmd": "sdkExec",
              "sdkid": _sdkid,
              "req": {
                "sdkcmd": "WR_MC_Call",
                "deviceID": target.deviceid,
                "hwnd": "0"
              }
            };
            safeImcsPlayer.sendCmd(cmd);
          } else {
            SdkCreateWindow();
            $timeout(function () {
              var cmd = {
                "cmd": "sdkExec",
                "sdkid": _sdkid,
                "req": {
                  "sdkcmd": "WR_MC_Call",
                  "deviceID": target.deviceid,
                  "hwnd": _window.window_id2
                }
              };
              safeImcsPlayer.sendCmd(cmd);
            }, 500)
          }

        }
      }

      function zhuanyi() {
        if (!_intercomStatus) {
          var cmd = {
            "cmd": "sdkExec",
            "sdkid": _sdkid,
            "req": {
              "sdkcmd": "WR_MC_Call",
              "deviceID": target.deviceid,
              "hwnd": "0"
            }
          };
          safeImcsPlayer.sendCmd(cmd);

        }
      }

      function listen(source, target) { // 监听
        if (!_intercomStatus) {
          _isVideo = false;
          _callID = target.deviceid;
          _active = target;
          var cmd = {
            "cmd": "sdkExec",
            "sdkid": _sdkid,
            "req": {
              "sdkcmd": "WR_MC_Listen",
              "deviceID": target.deviceid,
              "hwnd": "0"
            }
          };
          safeImcsPlayer.sendCmd(cmd);

        }
      }

      function monitor(source, target) { // 监视
        if (!_intercomStatus) {
          _callID = target.deviceid;
          _active = target;
          SdkCreateWindow();
          $timeout(function () {
            var cmd = {
              "cmd": "sdkExec",
              "sdkid": _sdkid,
              "req": {
                "sdkcmd": "WR_MC_See",
                "deviceID": target.deviceid,
                "hwnd": _window.window_id2
              }
            };
            safeImcsPlayer.sendCmd(cmd);
          }, 500);

        }
      }

      function answer() {
        if (!_isVideo) {
          safeImcsPlayer.sendCmd({
            "cmd": "sdkExec",
            "sdkid": _sdkid,
            "req": {
              "sdkcmd": "WR_MC_JieTing",
              "hwnd": "0"
            }
          });
        } else {
          SdkCreateWindow();
          $timeout(function () {
            safeImcsPlayer.sendCmd({
              "cmd": "sdkExec",
              "sdkid": _sdkid,
              "req": {
                "sdkcmd": "WR_MC_JieTing",
                "hwnd": _window.window_id2
              }
            });
          }, 500)
        }
      }

      function callBack() {
        if (!_intercomStatus) {
          _callID = _active.deviceid;
          if (!_isVideo) {
            var cmd = {
              "cmd": "sdkExec",
              "sdkid": _sdkid,
              "req": {
                "sdkcmd": "WR_MC_Call",
                "deviceID": _active.deviceid,
                "hwnd": "0"
              }
            };
            safeImcsPlayer.sendCmd(cmd);
          } else {
            SdkCreateWindow();
            $timeout(function () {
              var cmd = {
                "cmd": "sdkExec",
                "sdkid": _sdkid,
                "req": {
                  "sdkcmd": "WR_MC_Call",
                  "deviceID": _active.deviceid,
                  "hwnd": _window.window_id2
                }
              };
              safeImcsPlayer.sendCmd(cmd);
            }, 500)
          }

        }
      }

      function hangup() {
        var cmd = {
          "cmd": "sdkExec",
          "sdkid": _sdkid,
          "req": {
            "sdkcmd": "WR_MC_HangUp"
          }
        };
        safeImcsPlayer.sendCmd(cmd);
      }

      function resBusy(DeviceID) {
        var cmd = {
          "cmd": "sdkExec",
          "sdkid": _sdkid,
          "req": {
            "sdkcmd": "WR_MC_CallIn_Response_Busy",
            "DeviceID": DeviceID
          }
        };
        safeImcsPlayer.sendCmd(cmd);
      }

      function broadcast(source, target) { // 广播
        if (_intercomStatus) {
          var cmd = {
            "cmd": "sdkExec",
            "sdkid": _sdkid,
            "req": {
              "sdkcmd": "WR_MC_GuangBo_Start",
              "gbType": 0,
              "clientID": source.deviceid,
              "clientIP": _device.serverip
            }
          };
          safeImcsPlayer.sendCmd(cmd);
          addBroadCastDevice(source, target);
        }
      }

      function addBroadCastDevice(source, target) { // 增加广播设备
        var cmd = {
          "cmd": "sdkExec",
          "sdkid": _sdkid,
          "req": {
            "sdkcmd": "WR_MC_GuangBo_AddCall",
            "deviceID": target.deviceid,
            "hwnd": "0"
          }
        };
        safeImcsPlayer.sendCmd(cmd);
      }

      var _hardware = { // 主机呼分机事件，安防平台点击发起事件，自定义，在数据表 devicecomm 里增删改动作
        execute: function (defer, data) {
          if (data && data.action && _imcsProcessInitStatus) {
            switch (data.action) {
              case 'talk':
              case 'mainTalk':
                talk(data.source, data.target);
                break;
              case 'reply_talk':
              case 'reply_alarm':
              case 'mainReply':
                answer();
                break;
              case 'hangup':
              case 'mainHangup':
              case 'stopVoice':
                hangup();
                break;

              case 'listen':
                listen(data.source, data.target);
                break;
              case 'monitor':
                monitor(data.source, data.target);
                break;
              case 'broadcast':
              case 'broadcastVoice':
                broadcast(data.source, data.target);
                break;
            }
          }
          defer.resolve(data);
        }
      };

      function _init(scope) {
        _scope = scope;

        safeHardware.register(_type, _hardware);
        // 连接成功推送 NotifyConnSuccess
        // safeImcsPlayer.listenCmd('NotifyConnSuccess', function (data) {});
        if (safeImcsPlayer.isconnect) {
          init(function (intercom) {
            if (intercom) {
              _device = intercom;
              // 创建sdk对象 sdkCreate
              var cmd = {
                cmd: 'sdkCreate',
                devkey: 'imcsCtrlerMeiyi',
                devtype: 'MeiyiMcTalk',
                autodestroy: '30',
                userparam: 'meiyi'
              };
              safeImcsPlayer.sendCmd(cmd);
            }
          });
        } else {
          _remind('', '3', '未打开IMCS插件', '请打开imcsCsPlayer视频插件')
        }

        _scope.callActiveFn = function (message, data) {
          iMessage.remove(data.id);
          hangup();
        };

        _scope.CallingEventFn = function (message, data) {
          iMessage.remove(data.id);
          _active = data.data;
          answer();

        };

        _scope.CallingBackEventFn = function (message, data) {
          if (!_intercomStatus) {
            iMessage.remove(data.id);
            _active = data.data;
            callBack();
          }

        };

        // sdk消息推送 NotifySdkMsg: 当第三方sdk对象需要上报消息时,会主动推送此消息.
        safeImcsPlayer.listenCmd('NotifySdkMsg', function (data) {
          console.log(data);
          _sdkid = data.sdkid;
          if (data.event === 'onImcsProcessInit') { // 进程初始化成功(从此时开始,可开始接受命令)
            Login(_sdkid);
            _imcsProcessInitStatus = true;

          } else if (data.event === 'onImcsCmdInitFinish') { // 第三方sdk进程已经完成执行初始化命令，可以执行其他命令

          } else if (data.event === 'onNewCallIn' && data.msg.event_id === 5000) { // onNewCallIn 5000 说明:新通话呼入;
            if (!_intercomStatus) {
              _intercomStatus = true;
              talkback(data.msg.deviceID, function (device) {
                _list[data.msg.deviceID] = _active = device;
                safeSound.playMessage(device.name + '呼叫中,点击应答!' + device.name + '呼叫中,点击应答!');
                _remind(data.msg.deviceID, 2, '呼叫中', device.name + '呼叫中,点击应答!', '0', device, 'CallingEventFn', _scope);
              });
            } else {
              talkback(data.msg.deviceID, function (device) {
                _list[data.msg.deviceID] = device;
                resBusy(data.msg.deviceID);
                _remind(data.msg.deviceID, 2, '排队中', device.name + '排队中,点击回呼!', '0', device, 'CallingBackEventFn', _scope);
              });
            }

          } else if (data.event === 'onLogin' && data.msg.event_id === 5001) { // onLogin id:5001 说明:注册成功
            _remind('', 1, '对讲初始化', '美一对讲服务登录成功！', 1000);
            sdkFinishInit(_sdkid);

          } else if (data.event === 'onLoseLogin' && data.msg.event_id === 5002) { // onLoseLogin 5002 说明:注册失败
            console.warn('美一对讲登录失败，请排查是否网络原因');
            Login(_sdkid);

          } else if (data.event === 'onCallRinging' && data.msg.event_id === 5007) { // onCallRinging 5007 说明:正在振铃
            _intercomStatus = true;
            // _remind(_callID, '2', '正在振铃...', '正在呼叫' + _active.name, '0')

          } else if (data.event === 'onRemoteCallOn' && data.msg.event_id === 5003) { // onRemoteCallOn 5003 说明:对方接听
            _intercomStatus = true;
            iMessage.remove(_callID);
            _remind(_callID, 2, '通话中...', _active.name + '通话中,点击挂机!', '0', _active, 'callActiveFn', _scope);

          } else if (data.event === 'onRemoteHangUp' && data.msg.event_id === 5004) { // onRemoteHangUp 5004 说明:对方挂断
            _intercomStatus = false;
            iMessage.remove(data.msg.deviceID);
            CloseWindow();
            _remind(data.msg.deviceID, 2, '通话结束', _active.name + '对方已挂断!', 0);
            if (_list[data.msg.deviceID]) delete _list[data.msg.deviceID];

          } else if (data.event === 'onTimeout' && data.msg.event_id === 5005) { // onTimeout 5005 说明:呼叫超时
            _intercomStatus = false;
            iMessage.remove(_callID);
            _remind('', 3, '呼叫超时', '呼叫超时，请重新呼叫！');
            CloseWindow();

          } else if (data.event === 'onCallError' && data.msg.event_id === 5006) { // onCallError 5006 说明:呼叫错误
            _intercomStatus = false;
            _remind('', 4, '呼叫错误', '呼叫错误，请确认该设备信息是否配置正确！');
            CloseWindow();

          } else if (data.event === 'onTransBreak' && data.msg.event_id === 5008) { // onTransBreak 5008 说明:传输中断
            _intercomStatus = false;
            _remind('', 4, '传输中断', '传输中断，请重新呼叫！');
            CloseWindow();

          } else if (data.event === 'onTalkEnsure' && data.msg.event_id === 5009) { // onTalkEnsure 5009 说明:传输中断
            // _remind('', 4, '广播确认', '传输中断，请重新呼叫！');

          } else if (data.event === 'onMp3State' && data.msg.event_id === 1342177280) { // onMp3State 1342177280 说明:mp3广播状态回调

          } else if (data.event === 'onMsgOther' && data.msg.event_id === 1342177281) { // onTalkEnsure 1342177281 说明:消息回调(未知事件)

          } else if (data.event === 'onImcsProcessInitFail') { // 进程初始化失败 一般情况下不应该出现此错误

          } else if (data.event === 'onImcsProcessCrash') { // 第三方sdk进程意外崩溃，前端收到此消息时,必须主动调用sdkDestroy关闭sdk对象,且不可再调用其他接口去操作sdk资源，由于各个sdk差异太大,且无法统一,故不提供自动恢复逻辑
            _remind('', 4, '美一对讲终端意外断开崩溃', '请关闭平台重新打开登录', '0');
            iConfirm.show({
              scope: $rootScope,
              title: '美一对讲终端意外断开崩溃',
              content: '美一对讲终端意外断开崩溃,请关闭平台重新打开登录!',
              buttons: [{
                text: '确认',
                style: 'button-primary',
                action: 'confirmRefresh'
              }]
            });
            sdkDestroy();

          } else if (data.event === 'onImcsProcessDestroy') { // 第三方sdk对象销毁，特别注意:如果此消息不是主动调用sdkDestroy 命令触发的,请在收到消息后,主动调用 sdkDestroy() 以清理资源
            sdkDestroy();
          }
        });

        safeImcsPlayer.listenCmd('SdkCreateWindow', function (data) {
          if (data.result === 'ok') _window = data.window;
        });

        // 执行sdk命令 sdkExec，通知第三方sdk执行一条命令
        // 如果是复用一个已经存在的sdk对象,请确保已经收到 onImcsCmdInitFinish 事件后再调用.否则,所有调用均不会被执行(直接返回错误)
        safeImcsPlayer.listenCmd('sdkExec', function (data) {
          // console.log(data);
          if (data.result === 'ok' && data.resp.sdkcmd === 'WR_MC_JieTing') { // 接听成功
            iMessage.remove(_active.deviceid);
            safeSound.playMessage(_active.name + '通话中,点击挂机!');
            _remind(_active.deviceid, 2, '通话中', _active.name + '通话中,点击挂机!', '0', _active, 'callActiveFn', _scope);

          } else if (data.result === 'ok' && data.resp.sdkcmd === 'WR_MC_HangUp') { // 挂机成功
            _intercomStatus = false;
            if (_list[_callID]) delete _list[_callID];
            CloseWindow();

          } else if (data.result === 'error,-1004' || data.result === 'error,-1005') {
            _remind('', 4, '操作有误', data.error);

          } else if (data.result === 'ok' && data.resp.sdkcmd === 'WR_MC_Listen') { // 监听呼叫
            _remind(_callID, 2, '监听呼叫中', _active.name + '监听呼叫中!', '0');

          } else if (data.result === 'ok' && data.resp.sdkcmd === 'WR_MC_See') { // 监视呼叫
            safeSound.playMessage(_active.name + '监视呼叫中!');
            _remind(_callID, 2, '监视呼叫中', _active.name + '监视呼叫中!', '0');
          }

        });

        $(window).unload(function () {
          _unload();
        })
      }

      $rootScope.confirmRefresh = function (id) {
        iConfirm.close(id);
        location.reload();
      };

      // 初始化服务器
      function Login(sdkid) {
        if (_device.relatedip && _device.relatedip === _device.remoteip) { // 绑定对讲客户端电脑ip，在后台对讲主机设备特有属性配置，必填
          var cmd = {
            "cmd": "sdkExec",
            "sdkid": sdkid,
            "req": {
              "sdkcmd": "WR_MC_Login",
              "ip": _device.serverip,
              "deviceID": _device.deviceid,
              "seeX": 0,
              "seeY": 0,
              "talkX": 20,
              "talkY": 20,
              "width": 640,
              "height": 480,
              "LanOrWan": 0
            }
          };
          safeImcsPlayer.sendCmd(cmd);
        }

      }

      function _unload() {
        var cmd = {
          "cmd": "sdkExec",
          "sdkid": _sdkid,
          "req": {
            "sdkcmd": "WR_MC_Exit"
          }
        };
        safeImcsPlayer.sendCmd(cmd);
        sdkDestroy();
      }

      function sdkFinishInit(sdkid) { // 告知sdk初始化命令调用完毕 sdkFinishInit;请在所有初始化命令发送完毕之后调用此命令.(这个主要为了避免特殊情况下重复初始化的问题).
        safeImcsPlayer.sendCmd({
          "cmd": "sdkFinishInit",
          "sdkid": sdkid
        });
      }

      function SdkCreateWindow() {
        var cmd = {
          "cmd": "SdkCreateWindow",
          "window_w": window_w,
          "window_h": window_h,
          "window_x": window_x,
          "window_y": window_y,
          "window_isshow": 1,
          "window_istop": 1,
          "window_ismousetrans": 1,
          "window_opaque": window_opaque,
          "sdkid": _sdkid,
        };
        safeImcsPlayer.sendCmd(cmd);
      }

      function CloseWindow() {
        if (_isVideo) safeImcsPlayer.sendCmd({cmd: 'CloseWindow', window_id: _window.window_id2});

        _isVideo = true;
      }

      function sdkDestroy() {
        safeImcsPlayer.sendCmd({cmd: 'sdkDestroy', sdkid: _sdkid});
      }

      function talkback(id, callback) {
        var url, data;
        url = '/security/device.do?action=getDeviceDetail4Dtl';
        data = {
          filter: {
            keyvalue: id,
            type: 'talk',
            content: 'meiyimc'
          }
        };
        iAjax.post(url, data).then(function (data) {
          if (data.result && data.result.rows.length) {
            callback(data.result.rows[0]);
          } else {
            callback({deviceid: id, name: id + ' 对讲'})
          }
        }, function (err) {
          _remind(id, 4, '获取对讲信息失败，请重新登录获取查看对讲设备配置是否正确', err.message);
        })
      }

      function callpolice(id) {
        talkback(id, function (device) {
          // console.log(id, device);

          iAjax.post('/security/device.do?action=doAlarm4Detail', {
            filter: {
              keyvalue: id,
              type: 'alarm',
              content: 'huixun',
              alarmStr: device + '报警设备发生警情'
            }
          }).then(function (data) {
            if (data.status === 1) {
              safeSound.playMessage(device.name + '报警设备发生警情!');
              _remind(id, 1, '报警设备发生警情', device.name + '报警设备发生警情!');
            } else {
              _remind(id, 4, '对讲报警失败', device.name + '报警设备发出警情失败!');
            }
          }, function (err) {
            _remind(id, 4, '对讲报警失败', err.message);
          })
        });

      }

      // 全局的消息提醒服务
      function _remind(id, level, title, content, timeout, data, fn, scope) {
        var message = {
          id: (id || iTimeNow.getTime()),
          title: (title || '呼叫提醒！'),
          level: level,
          content: (content || ''),
          timeout: timeout,
          drag: true,
          data: data,
          fn: fn
        };
        for (let v in message) {
          if (message[v] === 'v') delete message[v]
        }
        iMessage.show(message, false, scope);
      }

      return {
        init: _init,
        unload: _unload
      }
    }]);
});