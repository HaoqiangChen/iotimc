/**
 * 杭州惠讯多媒体对讲系统
 *
 * 特别注意，惠讯对讲设备有两个按钮，民警按对讲和报警区分，其实说白了都是对讲，只是一个往监区拨打，一个往指挥中心拨打！！！
 * Created by chq on 2019-11-28
 */
define([
  'app',
  'safe/hardware/lib/hxccuapi-v3.2.3.min'
], function (app) {
  app.factory('safeHxccuapi', ['$compile', '$timeout', '$rootScope', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', '$state', 'iTimeNow',
    function ($compile, $timeout, $rootScope, iAjax, iMessage, safeHardware, safeSound, $state, iTimeNow) {
      var _type = 'huixun',
        _object, // theCCU 初始化对象
        _mainObject, // 当前主机设备信息
        _scope,
        _serverip,
        _list = {},
        _userID, // 当前主机设备号
        _isMain = false, // 是否指挥中心主机
        _peerUserID, // 通话中分机设备号
        _micID,
        _cameraID,
        _isClient = false, // 是否配置的对讲设备客户端
        _callStatus = 0, // =1 通话中 =0 空闲中
        _hasLogin = false;

      var compileFn = $compile('<div class="videoEle"><video autoplay="autoplay" id="videoEleLocal">' +
        '</video><video i-drag autoplay="autoplay" id="videoEleRemote"></video></div>');
      var $dom = compileFn($rootScope);
      $dom.appendTo('body');

      function init(callback) {
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

      function talk(source, target) { // 主机呼分机：邀请用户进入通话
        if (_object && !_callStatus) {
          // invite(calleeID) calleeIDs：被叫用户 ID
          _object.invite(source.devno);

          _list[source.devno] = source;
        } else {
          _remind('', 3, '通话中，请误操作', '请结束当前通话再呼叫另外对讲分机', 0)
        }
      }

      // 挂机
      function hangup() {
        if (_object) {
          _object.leave();
          if (_list[_peerUserID]) delete _list[_peerUserID];
          $timeout(function () {
            $("#videoEleRemote").hide();
          }, 1000)
        }
      }

      // 应答对讲通话
      function answer(callID) {
        if (_object) {
          _object.answer(callID);
        }
      }

      // 监听用户 theCCU .monitorUser(userID,enable); enable: 数据类型 boolean, true: 开始监听，false:退出监听，该方法已测试，不可用
      function monitorUser(userID, enable) {
        if (_object) {
          _object.monitorUser(userID, enable);
        }
      }

      // 禁止、允许用户视频接入 theCCU .cameraEn(userID,enable); enable: 数据类型 boolean, true: 接入用户视频，false:不接入用户视频
      function cameraEn(userID, enable) {
        if (_object) {
          _object.cameraEn(userID, enable);
        }
      }

      // 禁止、允许用户视频显示 theCCU .displayEn(userID,enable); enable: 数据类型 boolean,  true: 打开用户视频显示，false:关闭用户视频显示
      function displayEn(userID, enable) {
        if (_object) {
          _object.displayEn(userID, enable);
        }
      }

      var _hardware = {
        execute: function (defer, data) { // 主机呼分机事件，安防平台点击发起事件，自定义，在数据表 devicecomm 里增删改动作
          if (data && data.action) { // source为被叫分机； target为当前主机
            switch (data.action) {
              case 'talk':
              case 'mainTalk':
                talk(data.source, data.target);
                break;
              case 'hangup':
              case 'mainHangup':
                hangup();
                break;
              case 'answer':
                answer();
                break;
              case 'listen':
                monitorUser(data.source.devno, true);
                break;
            }
          }
          defer.resolve(data);
        }
      };

      function _init(scope) {
        _scope = scope;

        safeHardware.register(_type, _hardware);
        var videoEleLocal = document.getElementById('videoEleLocal');
        var videoEleRemote = document.getElementById('videoEleRemote');

        _object = new HxCCU(videoEleLocal.id, videoEleRemote.id, evtHdlr);
        // console.log(_object);

        init(function (row) {
          _mainObject = row;
          _userID = row.devno;
          if (row.devname === '指挥中心') _isMain = true;
          if (row.maindevno && row.maindevno === row.remoteip) {
            _isClient = true;
            _object.login(row.serverip, _userID, row.password, row.devname);
          }
        });

        // 消息框点击挂机事件
        _scope.callStatesActiveFn = function (message, data) {
          // console.log(message, data);
          iMessage.remove(data.id);
          if (_callStatus === 1) hangup();
        };

        // 消息框呼叫中,点击应答或监听事件
        _scope.lineStatesCallingEventFn = function (message, data) {
          // console.log(message, data);
          console.log(data);
          iMessage.remove(data.id);
          if (_callStatus === 0) answer(data.data.CallID);
          else {
            _callStatus = 2;
            monitorUser(data.data.CallID, true);
          }
        }
      }

      function evtHdlr(e) {
        console.log(e);

        switch (e.Evt) {
          case 0: // CCU 联机初始状态 CCU_PROFILE
            _remind('', 1, '对讲登录成功', '用户名：' + e.Name + ' 账号：' + e.ID + ' 登录成功！', 1000);
            break;
          case 1: // 用户线路状态更新 USER_STATE
            lineStatesEvent(e);
            break;
          case 2: // CCU 参与通话状态更新 CALL_STATE
            callStatesEvent(e);
            break;
          case 3: // CCU 参与通话详细状态数据更新(未更新的状态，没有相应字段返回) CALL_DETAIL
            callDetailEvent(e);
            break;
          case 4: // CCU 多方通话成员状态更新(未更新的状态，不返回相应字段) CALL_PARTY_STATE
            // console.warn(returnPartyStatu(e.PartyState));
            break;
          case 5: // CCU 多方通话新增成员 CALL_PARTY_ADD
            console.warn(returnPartyStatu(e.PartyState));
            break;
          case 6: // CCU 多方通话移除会议成员 CALL_PARTY_RMV
            break;
          case 10: // CCU 操作错误（失败）返回 OP_ERROR
            opErrorEvent(e);
            break;
          case 11: // CCU 登录联机状态更新 LOGON_STATE
            if (e.state === 0) { // 已登出注销
              $timeout(function () {
                if (!_hasLogin) _remind('HX_LOGINOUT', 3, '对讲登录失败', '原因一：其他地方已登录对讲平台；\n原因二：该电脑并不是配置的对讲设备客户端');
              }, 1000)
              // _remind('', 3, '对讲已登出注销', '原因一：其他地方已登录对讲平台；\n原因二：该电脑并不是配置的对讲设备客户端');
            } else if (e.state === 1) { // 正在登录，掉线后会每30秒重连，已测试，直接断网之后重连网络，会自动重新登录，但是还是存在一个bug，就是电脑睡眠的话，就会一直掉线不重新登录！
              if (_isClient && e.msg === 1006) { // 本身汇讯sdk没有重新登录方法，测试登录方法无反应，只能刷新页面重新加载才行！
                iMessage.remove('HX_LOGINOUT');
                _remind('HX_LOGINOUT', 3, '对讲登录失败', '其他地方已登录对讲平台!!! \n 对讲登录失败！！！', 0);
              }
            } else { // 已登录联机
              _hasLogin = true;
            }
            break;
          case 12: // CCU 终端本地预览视频状态更新 UPDATE_LOCAL_VIDEO
            break;
          case 13: // CCU 通话对方远端视频状态更新 UPDATE_REMOTE_VIDEO
            updateRemoteVideo(e);
            break;
          case 14: // 更新音视频输入设备列表(未更新的属性，不返回相应字段) UPDATE_MEDIA_DEVICES
            // updateMediaDevices(e);
            break;
        }
      }

      // 用户线路状态更新
      function lineStatesEvent(e) {
        switch (e.LineState) {
          case 0: // OFFLINE 离线
            break;
          case 1: // IDLE 空闲
            iMessage.remove(e.UserID);
            break;
          case 2: // CALLING 呼叫中
            // console.log('用户线路状态更新2：CALLING 呼叫中');
            iMessage.remove(e.UserID);
            break;
          case 3: // ALERT 振铃（回铃）
            // console.log('用户线路状态更新2：ALERT 振铃（回铃）');
            iMessage.remove(e.UserID);
            break;
          case 4: // CONNECTED 接通
            _callStatus = 1;
            break;
          case 5: // HOLDON 保持通话
            break;
        }
      }

      // CCU 参与通话状态更新
      function callStatesEvent(e) {
        switch (e.State) {
          case 0: // RELEASE 退出通话
            _callStatus = 0;
            $timeout(function () {
              $("#videoEleRemote").hide();
            }, 1000);
            break;
          case 1: // INCOMING 通话呼入排队;  分机呼主机; 绿色红色按钮都是这个事件，并不用特意区分
            // console.log('参与通话状态更新1：INCOMING 通话呼入排队');
            _peerUserID = e.PeerUserID;
            iMessage.remove(_peerUserID);
            if (_isMain) {
              // callpolice(_peerUserID); // 报警联动，不要可注释掉
              talkback(_peerUserID, function (device) {
                safeSound.playMessage(device.name + '报警呼叫中,点击应答!');
                _remind(_peerUserID, 2, '报警呼叫中', device.name + '报警呼叫中,点击应答!', '0', e, 'lineStatesCallingEventFn', _scope);
              });
            } else {
              talkback(_peerUserID, function (device) {
                safeSound.playMessage(device.name + '呼叫中,点击应答!');
                _remind(_peerUserID, 2, '呼叫中', device.name + '呼叫中,点击应答!', '0', e, 'lineStatesCallingEventFn', _scope);
              });
            }
            break;
          case 2: // ACTIVE 正在通话
            _peerUserID = e.PeerUserID;
            talkback(_peerUserID, function (device) {
              // safeSound.playMessage(device.name + '通话中,点击挂机!');
              _remind(_peerUserID, 2, '通话中', device.name + '通话中,点击挂机!', '0', _list[_peerUserID], 'callStatesActiveFn', _scope);
            });
            break;
          case 3: // HOLDON 保持通话
            break;
        }
      }

      // CCU 参与通话详细状态数据更新
      function callDetailEvent(e) {
        var CallDetail = e.CallDetail,
          PartiesState = CallDetail.PartiesState,
          CallDetailText = CallDetail.HostUserID + ' 通话混音方式：';
        switch (CallDetail.AudioMixStyle) {
          case 0:
            CallDetailText = CallDetailText + '交互自由发言 + ';
            break;
          case 1:
            CallDetailText = CallDetailText + '广播 + ';
            break;
          case 2:
            CallDetailText = CallDetailText + '对讲 + ';
            break;
        }
        if (!CallDetail.ForceInvite) CallDetailText = CallDetailText + '成员掉线不会自动强制重呼 + ';
        if (!CallDetail.IsRecording) CallDetailText = CallDetailText + '通话没有在录制媒体';
        console.warn(CallDetailText);
        _.each(PartiesState, function (item) {
          console.warn(returnPartyStatu(item));
        })
      }

      function updateRemoteVideo(e) {
        $("#videoEleRemote").show();
      }

      function opErrorEvent(e) {
        switch (e.ErrNo) {
          case -1:
            _remind('', 4, '错误操作', e.ErrInfo, 100);
            break;
        }
      }

      function updateMediaDevices(e) {
        _micID = e.defaultMicId;
        _cameraID = e.defaultCameraId;
      }

      function _unload() {
      }

      // 通话对讲状态提示框
      function talkback(id, callback) {
        var url, data;
        url = '/security/device.do?action=getDeviceDetail4Dtl';
        data = {
          filter: {
            keyvalue: id,
            type: 'talk',
            content: 'huixun'
          }
        };
        iAjax.post(url, data).then(function (data) {
          if (data.result && data.result.rows.length) {
            callback(data.result.rows[0]);
          } else {
            // console.log('查询不到该设备id相关信息');
            callback({name: id + ' 主机'})
          }
        }, function (err) {
          _remind(id, 3, '获取对讲信息失败', '获取对讲信息失败，请重新登录获取查看对讲设备配置是否正确');
        })
      }

      // 对讲报警状态提示框
      function callpolice(id) {
        talkback(id, function (device) {
          iAjax.post('/security/device.do?action=doAlarm4Detail', {
            filter: {
              keyvalue: id,
              type: 'alarm',
              content: 'huixun',
              alarmStr: device + '报警设备发生警情'
            }
          }).then(function (data) {
            if (data.status === 1) {
              console.warn(device.name + '报警设备发生警情!');
            } else {
              console.error(device.name + '报警设备发出警情失败!');
            }
          }, function (err) {
            console.error('对讲报警失败' + err.message);
          })
        });
      }

      // 返回多方通话新增成员对讲设备信息
      function returnPartyStatu(partyStatu) {
        var PartyStateText = partyStatu.UserID;
        if (!partyStatu.IsCCU) PartyStateText = PartyStateText + ' + 成员不是 CCU 调度终端 + ';
        if (partyStatu.InCom) PartyStateText = PartyStateText + '呼叫方向为 呼入 + ';
        else PartyStateText = PartyStateText + '呼叫方向为 呼出 + ';
        if (!partyStatu.IsRecording) PartyStateText = PartyStateText + '没有在录制媒体 + ';
        if (!partyStatu.MicEn) PartyStateText = PartyStateText + '没有接入麦克 + ';
        if (!partyStatu.SpeakerEn) PartyStateText = PartyStateText + '没有接入扬声器 + ';
        if (!partyStatu.CameraEn) PartyStateText = PartyStateText + '没有接入摄像 + ';
        if (!partyStatu.DisplayEn) PartyStateText = PartyStateText + '没有接入视频显示 + ';
        if (!partyStatu.HasMic) PartyStateText = PartyStateText + '成员终端没有接入麦克 + ';
        if (!partyStatu.HasSpeaker) PartyStateText = PartyStateText + '成员终端没有接入扬声器 + ';
        if (!partyStatu.HasCamera) PartyStateText = PartyStateText + '成员终端没有接入摄像 + ';
        if (!partyStatu.HasDisplay) PartyStateText = PartyStateText + '成员终端没有接入视频显示';
        return PartyStateText;
      }

      function pageRefresh() {
        window.location.reload();
      }

      // 全局的消息提醒服务
      function _remind(id, level, title, content, timeout, data, fn, scope) {
        var message = {
          id: (id || iTimeNow.getTime()),
          title: (title || '呼叫提醒！'),
          level: level,
          content: (content || ''),
          timeout: timeout || 5000,
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
