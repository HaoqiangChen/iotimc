/**
 * 杭州惠讯多媒体对讲系统
 *
 * Created by zjq on 2019-09-09.
 */
define([
  'app',
  'safe/hardware/lib/hxccuapi-v3.2.3.min'

], function(app) {
  app.factory('safeHxccuapi', ['$timeout', '$rootScope', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', function($timeout, $rootScope, iAjax, iMessage, safeHardware, safeSound) {
    var _type = 'huixun',
      _object,
      _mainObject,
      _scope,
      _serverip,
      _list = {},
      _micID,
      _temp,
      _cameraID,
      _callID,
      _conn = false;

    $('body').append('<div class="videoEle" style="display: none;"><video autoplay="autoplay" src="" id="videoEleLocal" width="0px" height="0px"></video><video autoplay="autoplay" src="" id="videoEleRemote" width="0px" height="0px"></video></div>');

    function init(callback) {
      iAjax.post('sys/web/role.do?action=getVmInitInfo', {
        filter: {
          company: _type
        }
      }).then(function(data) {
        if(data && data.result) {
          callback(data.result);
        }
      });
    }

    function talk(data) {
      if(_object) {
        _object.invite(data.source.devno);
      }
      _list[data.source.devno] = data.source;
    }

    function mainTalk(data) {
      if(_object) {
        _object.invite(data.source.devno);
      }
      _list[data.source.devno] = data.source;
    }

    function hangup() {
      if(_object) {
        _object.leave();
      }
    }

    function answer(callID){
      if(_object){
        _object.answer(callID);
      }
    }

    var _hardware = {
      execute: function(defer, data) {
        if(data && data.action) {
          switch(data.action) {
            case 'talk':
              talk(data);
              break;
            case 'mainTalk':
              mainTalk(data);
              break;
            case 'hangup':
            case 'mainHangup':
              hangup();
              break;
            case 'answer':
              answer();
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

      init(function(row) {
        _mainObject = row;
        _object.login(row.serverip, row.devno, row.password, row.devname);
      });

      _scope.callStatesActiveFn = function(message, data) {
        console.log('callStatesActiveFn', data);
        iMessage.remove(data.id);
        hangup();
      }

      _scope.lineStatesCallingEventFn = function(message, data){
        console.log('呼叫中,点击应答 lineStatesCallingEventFn', data);
        iMessage.remove(data.id);
        answer(data.data.CallID);
      }
    }

    function evtHdlr(e){
      console.log(e);

      switch(e.Evt){
        case 0:
          loginEvent(e);
          break;
        case 1:
          lineStatesEvent(e);
          break;
        case 2:
          callStatesEvent(e);
          break;
        case 4:
          //    callIngEvent(e);
          break;
        case 5:
          //    startcallEvent(e);
          break;
        case 14:
          //    updateMediaDevices(e);
          break;
      }
    }

    function loginEvent(e){
      iMessage.show({
        level : '1',
        title : '登录成功',
        timeout : 300,
        content : '用户名：' + e.Name + ' 账号：' + e.ID + ' 登录成功！'
      })
    }


    function lineStatesEvent(e){
      switch(e.LineState){
        case 1:
          lineStatesIdleEvent(e);
          break;
        case 2:
          lineStatesCallingEvent(e);
          break;
        case 3:
          //    callEvent(e);
          break;
        case 4:
          //    answerEvent(e);
          break;

      }
    }

    function callStatesEvent(e){
      switch(e.State){
        case 1:
          callStatesIncomingEvent(e);
          break;
        case 2:
          callStatesActiveEvent(e);
          break;

      }
    }

    function startcallEvent(e){
      switch(e.CallState){
        case 1:
          callEvent(e);
          break;

      }
    }

    function callIngEvent(e){
      switch(e.CallState){
        case 4:
          answerEvent(e);
          break;

      }
    }

    function updateMediaDevices(e){
      _micID = e.defaultMicId;
      _cameraID = e.defaultCameraId;
    }

    function lineStatesIdleEvent(e){
      iMessage.remove(e.UserID);
    }


    function lineStatesCallingEvent(e){
      iMessage.remove(e.UserID);

      talkback(e.UserID, function(device){
        console.log('UserID',device);
        safeSound.playMessage(device.name+'呼叫中,点击应答!');
        _remind(e.UserID, 2, '呼叫中', device.name+'呼叫中,点击应答!', '0', e, 'lineStatesCallingEventFn', _scope);
      })
      /*iMessage.show({
                id : e.UserID,
                level : '2',
                title : '呼叫中',
                timeout : '0',
                content : e.UserID + '呼叫中,点击应答!',
        data: e,
        fn : 'lineStatesCallingEventFn'
            }, false, _scope);*/
    }

    function callStatesIncomingEvent(e){
      iMessage.remove(e.PeerUserID);
      talkback(e.PeerUserID, function(device){
        console.log('PeerUserID',device);
        safeSound.playMessage(device.name+'呼叫中,点击应答!');
        _remind(e.PeerUserID, 2, '呼叫中', device.name+'呼叫中,点击应答!', '0', e, 'lineStatesCallingEventFn', _scope);
      })
      /*iMessage.show({
                id : e.PeerUserID,
                level : '2',
                title : '呼叫中',
                timeout : '0',
                content : e.PeerUserID + '呼叫中,点击应答!',
        data: e,
        fn : 'lineStatesCallingEventFn'
            }, false, _scope);*/

    }

    function callStatesActiveEvent(e){
      var object = _list[e.PeerUserID];

      talkback(e.PeerUserID, function(device){
        safeSound.playMessage(device.name+'通话中,点击挂机!');
        _remind(e.PeerUserID, 2, '通话中', device.name + '通话中,点击挂机!', '0', object, 'callStatesActiveFn', _scope);
      })

      /*iMessage.show({
                id : e.PeerUserID,
                level : '2',
                title : '通话中',
                timeout : '0',
                content : e.PeerUserID + ' 通话中,点击挂机!',
        data: object,
        fn : 'callStatesActiveFn'
            }, false, _scope);*/

    }


    function callEvent(json){
      var object = _list;
      /*
      if(object) {
          _scope.$broadcast('ws.executeHandle', {
              id: object.source.id,
              message: json.UserID + '呼叫中',
              type: object.type,
              actions: [{
                  action: 'answer',
                  deviceid: object.target.id,
                  devicename: object.target.name,
                  name: '应答',
                  type: object.type
              }]
          });
      } */

      safeSound.playMessage(object.target.name + ' 呼叫：' + object.source.name + '！');
      iMessage.show({
        id : object.target.id,
        level : '2',
        title : '呼叫中',
        timeout : 0,
        content : object.target.name + ' 呼叫：' + object.source.name + '！'
      })

    }

    function answerEvent(json){
      console.log(json)
      if(json) {
        var object = json;
      } else {
        var object = _list;
      }
      /*
      if(object) {
          _scope.$broadcast('ws.executeHandle', {
              id: object.source.id,
              message: '通话中',
              type: object.type,
              actions: [{
                  action: 'mainHangup',
                  deviceid: object.target.id,
                  devicename: object.target.name,
                  name: '挂机',
                  type: object.type
              }]
          });

          //    safeSound.playMessage(object.target.name + object.actionname);
      }
      */
      iMessage.remove(object.id);

      iMessage.show({
        id : object.id,
        level : '2',
        title : '通话中',
        timeout : 0,
        content : ' 与' + object.PeerUserID + '通话中！'
      })

    }

    function hangupIngEvent(json){
      var object = _list;
      /*
      if(object) {
          _scope.$broadcast('ws.executeHandle', {
              id: object.source.id,
              message: '通话中',
              type: object.type,
              actions: [{
                  action: 'mainHangup',
                  deviceid: object.target.id,
                  devicename: object.target.name,
                  name: '挂机',
                  type: object.type
              }]
          });

          //    safeSound.playMessage(object.target.name + object.actionname);
      }
      */

      iMessage.remove(object.target.id);

      iMessage.show({
        id : object.target.id,
        level : '2',
        title : '通话中',
        timeout : 0,
        content : ' 与' + object.source.name + '通话中！'
      })
    }

    function _unload() {

    }

    function talkback (id, callback) {
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
          console.log('查询不到该设备id相关信息');
          callback('')
        }
      }, function (err) {
        _remind(id, 4, '获取对讲信息失败，请重新登录获取查看对讲设备配置是否正确', err.message);
      })
    }

    function callpolice (id) {
      talkback(id, function(device){
        console.log(id, device);

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
            _remind(id, 1, '报警设备发生警情', device.name+'报警设备发生警情!');
          } else {
            _remind(id, 4, '对讲报警失败', device.name+'报警设备发出警情失败!');
          }
        }, function (err) {
          _remind(id, 4, '对讲报警失败', err.message);
        })
      });

    }

    // 全局的消息提醒服务
    function _remind (id, level, title, content, timeout, data, fn, scope) {
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
