/**
 * @module iiw.safe.services
 */
define([
  'app',
  'safe/js/directives/safeVideoPanel',
  'safe/js/directives/safeVideoMaxPanel',
  'safe/js/services/safePolling',
  'safe/js/services/safeImcsPlayer',
], function (app) {
  /**
   * ### safeCamera
   * 监控接口服务类，提供监控播放界面、监控实况、录像回放及相关联设备控制等方法。
   * 1. 安防平台框架已载入，无法重复加载。
   * 2. 其它框架框架需加载，请加载'safe/js/services/safeCamera'。
   * 3. 此类为服务，需要依赖注入才能使用。
   * ***
   *      JS:
   *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
   *          // TODO
   *      }]);
   * ***
   * ### safeCamera.create
   * 监控控件构造器。
   * 1. 通过safeCamera.create方法创建一个构造实体，实况监控等接口通过返回的实体调用。
   * 2. 构造器必须传递el参数，el为监控界面依赖的element，如一个div。
   * 3. 建议传递模块scope，否则将采用$rootScope，并且无法销毁部分资源。
   *
   * @class safeCamera.create
   * @constructor
   * @param config {JSON Object}
   *      el          null        监控控件inner到el下。如<div></div>，初始化后将会变为<div><camera></camera></div>
   *      scope       null        控件依赖的作用域，建议传递本模块作用域，不传递则使用全局的作用域
   *      type        0           自动布局，0->auto；1->固定，自动布局指自动从单画面变为四画面再变为九画面一直到maxsize
   *      maxsize     9           默认最大支持9画面
   *      keeplast    false       是否保留最后一帧，避免轮巡切换时出现黑屏情况
   *      viewmode    0           显示模式，0->受暂停控制；1->不受暂停控制，默认为0；暂停时，播放内容的视频停止播放，并且切换也不会播放，但恢复时再重新连接（主要作用于报警联动时，避免资源的过多消耗且无法打开更多的视频等问题）
   *      toolbar     0           状态栏模式：
   *                                  0->自动；
   *                                  1->不显示控制栏；
   *                                  2->什么都不显示；
   *                                  3->只显示放大、上墙和云台控制；
   *                                  4->只显示放大；
   *                                  5->普通状态下，只显示放大、上墙和云台控制，最大化后显示所有
   *                                  6->只隐藏关闭按钮
   *                                  7->只显示本机截图、上墙、最大化、声音控制
   *                                  8->普通状态下，只显示放大，最大化以后显示所有
   *
   * @return {camera} 监控实体对象
   * @example
   *      HTML:
   *      <div id="safe_camera_panel"></div>
   *
   *      JS:
   *      app.controller('***Controller', ['$scope', 'safeCamera', function($scope, safeCamera) {
   *          var camera = safeCamera.create({
   *              'el': $('#safe_camera_panel'),
   *              'scope': $scope
   *          });
   *
   *          // TODO camera method
   *      }]);
   *
   *
   * @author : yjj
   * @version : 1.0
   * @Date : 2015-11-10
   */
  app.factory('safeCamera', ['$rootScope', '$compile', 'iAjax', 'iTimeNow', 'iMessage', 'safePolling', '$filter', 'safeVideoObject', 'safeHardware', 'safeImcsPlayer', '$http', function ($rootScope, $compile, iAjax, iTimeNow, iMessage, safePolling, $filter, safeVideoObject, safeHardware, safeImcsPlayer, $http) {
    // $('body').append('<div class="layout-full safe-video-max-panel"><div class="layout-full safe-video-max-box"></div></div>');
    $('body').append($compile('<safe-video-max-panel></safe-video-max-panel>')($rootScope.$new()));
    $('body').append('<div class="layout-full safe-video-full-panel"></div>');

    $(document).keydown(function (e) {
      // if(e.keyCode == 27) {
      //     $rootScope.$broadcast('videoKeyDownEscEvent', e);
      // }
      switch (e.keyCode) {
        // Esc
        case 27:
          $rootScope.$broadcast('videoKeyDownEscEvent', e);
          break;
        default:
          $rootScope.$broadcast('videoKeyDownEvent', e);
      }

      if (e.ctrlKey && e.keyCode == 46) {
        // Ctrl + Del
        safeImcsPlayer.exit();
      }
    });

    $(document).keyup(function (e) {
      $rootScope.$broadcast('videoKeyUpEvent', e);
    });

    var cache = {};                 // 通道信息缓存。
    var names = {};                 // 通道名称缓存。
    var hardware = {};              // 通道关联信息缓存。
    var network = [];               // 网络映射替换信息缓存。
    var _p_channel = 1;             // 动态端口号，详情请看formatVideoSrc接口
    var linkage = {};

    /*iAjax.post('security/device/device.do?action=getIpReflection', {}).then(function(data) {
        if(data && data.result && data.result.rows) {
            network = data.result.rows;
        }
    });*/
    safeImcsPlayer.init();

    function Camera(config) {
      var setting = {
        // web最大支持9画面，c/s模式下，默认支持16画面；
        maxsize: (!window.__IIWHOST) ? 9 : 16,

        el: null,               // 注入的element
        type: 0,                // 自动布局，0->auto；1->固定
        matrix: [],             // 布局的二维数组
        keeplast: false,        // 是否保留最后一帧，避免轮巡切换时出现黑屏情况，仅满屏模式时支持
        viewmode: 0,            // 显示模式，0->受暂停控制；1->不受暂停控制，默认为0
        toolbar: 0,             // 状态栏模式，0->自动；1->不显示控制栏；2->什么都不显示；3->只显示放大、上墙和云台控制；4->只显示放大；5 -> 普通状态下，只显示只显示放大、上墙和云台控制，最大化后显示所有
        streamtype: 0,           // 全局码流控制：0->自动， 1->全主码流, 2->全副码流；
        canvas: false   		//是否显示监控截图，默认不显示
      };

      $.extend(setting, config);

      var $scope;                 // 当前作用域。
      var events = {};            // 事件监听。
      var _imcs = (!window.__IIWHOST) ? null : safeVideoObject.getImcs();

      var layout = {
        auto: true,             // 自动播放下一个窗格
        maxsize: setting.maxsize,
        size: 0,                // 当前画面数
        row: 1,                 // 当前布局行数
        column: 1               // 当前布局列数
      };

      var rcallbackFN = null;     // 当前类的单一回调函数。

      if (!setting.el) {
        throw '缺少el参数，无法初始化Camrea类';
      } else {
        setting.el = angular.element(setting.el);
      }

      if (setting.scope) {
        $scope = setting.scope.$new();
      } else {
        $scope = $rootScope.$new();
      }

      $scope.setting = setting;
      $scope.layout = layout;
      $scope.polling = [];
      $scope.select = 0;
      $scope.ismax = false;
      $scope.isPauseMode = false;
      $scope.screenList = [];

      $scope.$on('iiw.safe.camera.pauseEvent', function (e, data) {
        $scope.isPauseMode = true;
        if (safeImcsPlayer.isconnect()) {
          var keeps = [];
          if (data.keeps) {
            if (_.isObject(data.keeps)) {
              keeps = [data.keeps.$id];
            } else if (_.isArray(data.keeps)) {
              keeps = _.pluck(data.keeps, '$id');
            }
          }

          if (_.indexOf(keeps, $scope.$id) < 0) {
            $scope.imcsPlayer.pause();
          }
        }
      });

      $scope.$on('iiw.safe.camera.recoveryEvent', function () {
        $scope.isPauseMode = false;
        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.restore();
        }
      });

      /**
       * 初始化，向el注入videoPanel指令；
       *
       * @author : yjj
       * @version : 1.0
       * @Date : 2015-11-11
       */
      init();

      function init() {
        setting.el.html('<safe-video-panel></safe-video-panel>');
        var link = $compile(setting.el.contents());
        link($scope);

        $scope.$on('safeVideoAllCloseEvent', function () {
          call('allclose');
        });

        $scope.$on('safeVideoSelectEvent', function (e, data) {
          call('select', data);

          $.each($scope.screenList, function (i, o) {
            if (o.win && o.win.window && o.win.window.camera) {
              o.win.window.camera.hideSelect();
            }
          })
        });

        $scope.$on('videoKeyDownEscEvent', function () {
          $scope.exitFull();
          if (safeImcsPlayer.isconnect()) {
            $scope.imcsPlayer.exitFull();
            $scope.imcsPlayer.min();
          }
        });

        $scope.$on('videoMinEvent', function () {
          if (safeImcsPlayer.isconnect()) {
            $scope.imcsPlayer.min();
          }
        });

        $scope.$on('videoResizeEvent', function () {
          if (safeImcsPlayer.isconnect()) {
            $scope.imcsPlayer.resetLayout();
          }
        });

        $scope.imcsPlayer = safeImcsPlayer.create({
          scope: $scope,
          el: setting.el
        });
      }

      function call(event, data) {
        if (events[event]) {
          $.each(events[event], function (i, callback) {
            callback(data);
          });
        }
      }

      function _autoPicture(id, nocheck) {
        if (!$scope.screenList || !$scope.screenList.length) {
          todo();
        } else {
          var selIndex,
            camera;

          selIndex = $scope.getSelect();

          if (!selIndex) {
            selIndex = 0;

            $.each($scope.screenList, function (i, o) {
              if (o && o.win && o.win.window.camera) {
                camera = o.win.window.camera;
                selIndex = camera.getSelect();
                if (selIndex) {
                  camera.autoPicture(id, nocheck);
                  return false;
                }
              }
            });

            if (!selIndex) todo();
          } else {
            todo();
          }
        }

        function todo() {
          var o = $scope.getAutoNextObject(nocheck);
          if (o) {
            $scope.objectInit(o.get());
            picture(o, id);
          }
        }
      }

      function _picture(id, index) {
        index = index || 1;
        _layout(index);
        var o = $scope.getObject(index);
        if (o) {
          $scope.objectInit(o.get());
          picture(o, id);
        }
      }

      function picture(video, id) {
        if (setting.canvas) {
          iAjax.post('security/device/device.do?action=getMonitorCurrentPhoto', {
            filter: {id: id}
          }).then(function (data) {
            if (data.result.rows) {
              var url = formatVideoSrc(data.result.rows);
              video.pic(url, true);
            }
          });
        }

        video.code(id);
        video.type('picture');
      }


      /**
       * 自动化布局显示监控；
       *
       * @author : yjj
       * @version : 1.0
       * @Date : 2015-11-11
       */
      function _autoShow(id, nocheck) {
        if (!$scope.screenList || !$scope.screenList.length) {
          todo();
        } else {
          var selIndex,
            camera;

          selIndex = $scope.getSelect();

          if (!selIndex) {
            selIndex = 0;

            $.each($scope.screenList, function (i, o) {
              if (o && o.win && o.win.window.camera) {
                camera = o.win.window.camera;
                selIndex = camera.getSelect();
                if (selIndex) {
                  camera.autoShow(id, nocheck);
                  return false;
                }
              }
            });

            if (!selIndex) todo();
          } else {
            todo();
          }
        }

        function todo() {
          var o = $scope.getAutoNextObject(nocheck);
          if (o) {
            $scope.objectInit(o.get());
            play(o, id);
          }
        }
      }


      function _show(id, index, isPolling) {
        index = index || 1;
        if (!isPolling) {
          _layout(index);
        }
        var o = $scope.getObject(index);
        if (o) {
          $scope.objectInit(o.get());
          play(o, id);
        }
      }

      function playSetout(video, type) {
        switch (type) {
          case null:
            removeVideo();
            removeImcs();
            break;

          case 'imcs':
            removeVideo();
            break;

          case 'video':
            removeImcs();
            break;

        }

        function removeVideo() {
          video.get().find('.video-tips').remove();
          video.src('');
          //video.get().find('video').hide();
          video.get().find('canvas').hide();
        }

        function removeImcs() {
          video.get().find('.video-tips').remove();
          var code = video.get().attr('code');
          if (code && $scope.imcsPlayer) {
            $scope.imcsPlayer.close(code);
          }
        }
      }

      function play(video, id) {
        var isconnect = safeImcsPlayer.isconnect();

        if (isconnect && $scope.imcsPlayer) {
          $scope.imcsPlayer.setAllWindow($scope.imcsPlayer);
        }

        if (cache[id]) {
          if (isconnect && cache[id].detail) {
            playSetout(video, 'imcs');
            $scope.imcsPlayer.play(video, id, cache[id].detail);
          } else {
            if (cache[id].snap) {
              setVideoSnap(video, cache[id].snap);
            } else {
              getVideoSnap(video, id);
            }

            if (cache[id].src) {
              setVideoSrc(video, cache[id].src);
            } else {
              getVideoSrc(video, id);
            }
          }
        } else {
          cache[id] = {};
          !isconnect && getVideoSnap(video, id);
          getVideoSrc(video, id);
        }
        video.code(id);
        video.name(_getname(id));
        video.type('live');
      }

      function getVideoSnap(o, id) {
        if (!setting.canvas) {
          return false;
        }
        // 获取快照地址
        iAjax.post('security/device/device.do?action=getMonitorLivePhoto', {
          filter: {id: id}
        }).then(function (data) {
          if (!safeImcsPlayer.isconnect() && data.result.rows) {
            cache[id].snap = iAjax.formatURL(data.result.rows);
            setVideoSnap(o, cache[id].snap);
          }
        });
      }

      function getVideoSrc(o, id) {
        // 获取直播地址
        iAjax.post('security/device/device.do?action=getMonitorLiveUrl', {
          //remoteip: '192.168.11.39',
          filter: {id: id, protocol: (!window.__IIWHOST) ? 'httpwebm' : 'httpimcs'}
        }).then(function (data) {
          if (data.result.detail && safeImcsPlayer.isconnect()) {
            playSetout(o, 'imcs');
            cache[id].detail = data.result.detail;
            if ($scope.imcsPlayer) {
              $scope.playType[id] = 'imcs';
              $scope.imcsPlayer.play(o, id, data.result.detail);
            }
          } else {
            if (data.result.rows) {
              $scope.playType[id] = 'video';
              cache[id].src = data.result.rows;
              setVideoSrc(o, cache[id].src);
            } else {
              console.error('iiw.safe: 获取[' + id + ']实况地址失败，请检查以下原因\n1、流媒体是否正常运行，流媒体ip是否配置正确；\n2、设备表与设备子表数据是否配置正确；\n3、尝试情况数据库中的通道同步i信息，然后重新同步');
            }
          }
        });
      }

      function setVideoSnap(o, url) {
        if (setting.canvas) {
          o.pic(url);
        }
      }

      function setVideoSrc(o, url) {
        playSetout(o, 'video');
        var id = _.findKey(cache, function (obj) {
          return obj.src == url;
        });
        o.get().find('video').show();
        //url = (!window.__IIWHOST) ? formatVideoSrc(url) : url;
        url = formatVideoSrc(url + '?time=' + iTimeNow.getTime());
        o.src(url);

        // 视频准备好，发送通知
        $(o.get().data('data-video')).off('canplay').on('canplay', function () {
          $rootScope.$broadcast('video.information.url', {
            id: id,
            url: url
          });
        });
      }

      function getChannel() {
        if (_p_channel >= 32) {
          _p_channel = 1;
        }
        return _p_channel++;
      }

      function formatVideoSrc(url) {
        //var a = document.createElement('a');
        //a.href = url;
        //
        //var port = parseInt(a.port);
        //port += getChannel();
        //
        //a.port = port;
        //
        //return a.href;

        var sa = document.createElement('a'),
          la = document.createElement('a');

        sa.href = url;

        if (!window.__IIWHOST) {
          la.href = location.href;

          // B/S的情况下，端口每点一次自动增加+1；
          // 因为chrome认为ip:port相同为同一个链接，相同链接只允许同时打开6条，所以改变端口可以突破这个限制，但同时链接数不能超过10，故B/S限制最多为9画面。
          var port = parseInt(sa.port);
          port += getChannel();
          sa.port = port;
        } else {
          la.href = window.__IIWHOST;
        }

        $.each(network, function (i, row) {
          if (row.aim && la.hostname.match(new RegExp(row.aim)) && row.localip == sa.hostname && row.localport == sa.port) {
            sa.hostname = row.remoteip;
            sa.port = row.remoteport;
            return false;
          }
        });

        return sa.href;
      }


      function _shows(ids, userLayout, timeout) {
        timeout = timeout || 15;
        if (userLayout) {
          _layout(userLayout);
        } else {
          // 缺省使用单画面
          if (ids.length < 4) {
            _layout(1);
          } else if (ids.length < 9) {
            _layout(4);
          } else {
            _layout(9);
          }

        }
        $scope.hideSelect();
        _stopPolling();

        var size = layout.size,
          count = ids.length;

        layout.auto = false;
        $scope.select = 1;
        if (count <= size) {
          $.each(ids, function (i, id) {
            _autoShow(id);
          });
          return null;
        } else {
          // 启动轮巡
          var p = safePolling.create(ids, size, timeout);
          p.on('polling', function (array) {
            var oldSelect = _getSelectIndex();
            layout.auto = false;
            $scope.select = 1;
            $.each(array, function (i, id) {
              _autoShow(id, true);
            });
            _setSelectIndex(oldSelect);
          });
          var old = setting.keeplast;
          p.on('start', function () {
            setting.keeplast = true;
          });
          p.on('stop', function () {
            setting.keeplast = old;
          });
          p.start();
          $scope.polling.push(p);

          return p;
        }
      }


      function _record(id, index, start, end, now, errorCb, statusCb) {
        index = index || 1;

        if (safeImcsPlayer.isconnect()) {
          $scope.getDevParam(id, function (data) {
            if (data && data.detail) {
              var o = $scope.getObject(index);
              o.code(id);
              $scope.imcsPlayer.record(id, index, start, end, now, errorCb, data.detail);
              o.record({id: id, start: start, end: end, now: now});
              o.type('record');
            } else {
              worn();
            }
          });

        } else {
          worn();
        }

        function worn() {
          var record = getRecordObject(index);
          if (record) {
            recordplayDtl(record, index, now);
          } else {
            var video = $scope.getObject(index);
            if (video) {
              getRecordSrc(video, id, index, start, end, now, errorCb, statusCb);
            }
            video.code(id);
            video.type('record');
          }
          var o = $scope.getObject(index);
          $scope.objectInit(o.get());
        }
      }


      function _recordplay(index) {
        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.recordResume(index);
          return;
        }

        var record = getRecordObject(index);
        if (record) recordplayDtl(record, index);
      }

      function recordplayDtl(record, index, now) {
        if (record) {
          iAjax.post('security/common/monitor.do?action=executeVideo', {
            filter: {
              rcid: record.rcid,
              ctrl: 'play',
              id: record.id
            }
          });
          //var video = getVideoObject(index);
          //video.attr('src', formatVideoSrc(record.src) + ((!now) ? '' : '?setpos='+now));
          var o = $scope.getObject(index);
          o.src(formatVideoSrc(record.src) + ((!now) ? '' : '?setpos=' + now));
          record['state'] = 'play';
        }
      }


      function _recorddownload(id, start, end, pathName, callback) {
          console.log(isImcs(id));
        if (safeImcsPlayer.isconnect() && isImcs(id)) {
          $scope.imcsPlayer.recordDownload(id, pathName, callback);
          return;
        }

        console.log(_imcs);
        if (_imcs) {
          getRecordDownloadSrc(id, start, end, function (data) {
            var streamUrl = data.streamurl;

            if (streamUrl) {

              var dlid = _imcs.StartRecordDownload(streamUrl, pathName, 0, 1);

              if (callback) {
                callback(dlid);
              }

            } else {
              iMessage.show({
                level: 3,
                title: '警告',
                content: '录像下载URL未生成'
              });
            }
          });
        }
      }


      function _stopRecordDownload(dlid, devicefk) {
        if (safeImcsPlayer.isconnect() && isImcs(devicefk)) {
          $scope.imcsPlayer.stopRecordDownload(devicefk);
          return;
        }

        if (_imcs) {
          _imcs.StopRecordDownload(dlid);
        }
      }


      function _getRecordDownloadStatus(dlid) {
        return (_imcs ? _imcs.GetRecordDownloadStatus(dlid) : 0);
      }


      function getRecordSrc(o, id, index, start, end, now, errorCb, statusCb) {
        // 获取回放地址
        iAjax.post('security/common/monitor.do?action=playbackVideo', {
          filter: {
            id: id,
            start: start,
            end: end,
            protocol: (!window.__IIWHOST) ? 'httpwebm' : 'httpimcs'
          }
        }).then(function (data) {
          if (data.result.rows && data.result.rows.rcid) {
            var object = {
              rcid: data.result.rows.rcid,
              src: data.result.rows.streamurl,
              id: id,
              event: (function () {
                var event = new EventSource(formatVideoSrc(data.result.rows.statusurl));
                event.addEventListener('pbstat', function (e) {
                  e.devicefk = id;
                  if (rcallbackFN) rcallbackFN(e);
                  if (statusCb) statusCb(e);
                });
                return event;
              })()
            };
            o.record(object);
            recordplayDtl(object, index, now);
          } else {
            if (errorCb) {
              errorCb();
            }

            $scope.objectInit(o.get(), '没有录像');
          }
        });
      }


      function getRecordDownloadSrc(id, start, end, callback) {
        // 获取录像下载地址
        iAjax.post('security/common/monitor.do?action=playbackVideo', {
          filter: {
            id: id,
            start: start,
            end: end,
            protocol: (!window.__IIWHOST) ? 'httpwebm' : 'httpimcs',
            sdkdownload: '1'
          }
        }).then(function (data) {
          if (data.result.rows && data.result.rows.rcid && callback) {
            callback(data.result.rows);
          }
        });
      }


      function _recordstop(index) {
        var record = getRecordObject(index);
        var video = getVideoObject(index);

        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.recordStop(index);
          video.data('record', null);
          video.attr('code', '');
          video.attr('type', '');
          return;
        }

        if (record) {

          if (record.event) {
            record.event.close();
            record.event = null;
          }

          video.data('record', null);
          video.attr('src', '');

          iAjax.post('security/common/monitor.do?action=executeVideo', {
            filter: {
              rcid: record.rcid,
              ctrl: 'stop',
              id: record.id
            }
          });
        }

        video.attr('videoreplyed', 'false');
        if (video[0] && video[0].replyObj) {
          video[0].replyObj.hidePanel();
        }

      }


      function _recordstopall() {

        var list = _getplays();
        $.each(list, function (i, id) {
          if (id) {
            _recordstop((i + 1));
          }
        });
      }


      function _recordpause(index) {
        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.recordPause(index);
          return;
        }

        // 暂停先截取最后一桢，避免web模块暂停后黑屏或显示最新的快照
        keepLastFream(index);

        var record = getRecordObject(index);
        if (record) {
          var video = getVideoObject(index);
          video.attr('src', '');
          iAjax.post('security/common/monitor.do?action=executeVideo', {
            filter: {
              rcid: record.rcid,
              ctrl: 'pause',
              id: record.id
            }
          });
          record['state'] = 'pause';
        }
      }


      function _recordpos(index, time) {
        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.recordSetPos(index, time);
          return;
        }

        // 暂停先截取最后一桢，避免web模块定位时黑屏或显示最新的快照
        keepLastFream(index);

        var record = getRecordObject(index);
        if (record) {
          var video = getVideoObject(index);
          video.attr('src', formatVideoSrc(record.src) + '?setpos=' + time);
        }
      }


      function _recordspeed(index, speed) {
        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.recordSetSpeed(index, speed);
          return;
        }

        var record = getRecordObject(index);
        if (record) {
          iAjax.post('security/common/monitor.do?action=executeVideo', {
            filter: {
              rcid: record.rcid,
              ctrl: 'setspeed',
              id: record.id,
              speed: speed
            }
          });
        }
      }


      function _playoneFrame(index) {
        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {
          $scope.imcsPlayer.playoneFrame(index);
          return;
        }

        var record = getRecordObject(index);
        if (record) {
          iAjax.post('security/common/monitor.do?action=executeVideo', {
            filter: {
              rcid: record.rcid,
              ctrl: 'playoneframe',
              id: record.id
            }
          });
        }
      }


      function keepLastFream(index) {
        var videoBox = $scope.getObject(index);
        if (videoBox) {
          var object = videoBox.get();
          if (object) {
            var video = object.data('data-video'),
              canvas = object.find('canvas').get(0);

            if ($scope.ismax && !canvas) {
              canvas = $('.safe-video-max-panel .safe-video-max-box').find('canvas').get(0);
            }

            var ctx = canvas.getContext('2d');

            try {
              ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, $(canvas).width(), $(canvas).height());
            } catch (e) {
              // 避免出现偶尔性无法渲染的错误。
            }
          }
        }
      }


      function _recordCallbackFN(fn) {
        rcallbackFN = fn;
        $scope.imcsPlayer.recordCallback(rcallbackFN);
      }


      function getVideoObject(index) {
        var result = null;
        index = index || 1;
        var videoBox = $scope.getObject(index);
        if (videoBox) {
          var object = videoBox.get();
          if (object) {
            result = $(object.data('data-video'));
          }
        }
        return result;
      }


      function getRecordObject(index) {
        var result = null;
        var video = getVideoObject(index);
        if (video.attr('type') == 'record') {
          var record = video.data('record');
          if (record) {
            result = record;
          }
        }
        return result;
      }


      /**
       * 是否采用imcs
       */
      function isImcs(id) {
        var result = false;
        if (cache[id] && cache[id].detail) {
          result = true;
        }
        return result;
      }

      function _layout(value) {
        if (value) {
          $scope.setting.type = 1;
          $scope.resetLayout(value);

          if (safeImcsPlayer.isconnect()) {
            $scope.imcsPlayer.resetLayout();
          }

          call('layout', layout.size);
        } else {
          $scope.setting.type = 0;
          $scope.closeall();

          if (safeImcsPlayer.isconnect()) {
            $scope.imcsPlayer.closeAll();
          }

          call('layout', 0);
        }
      }

      function _close(index) {
        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.close();
        }
        $scope.close(index);
        $scope.hideSelect();
      }

      function _closeAll() {
        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.closeAll();
        }

        $scope.closeall();
        _stopPolling();

        $.each($scope.screenList, function (i, s) {
          if (s && s.win && s.win.window && s.win.window.camera) {
            s.win.window.camera.closeAll();
          }
        });
      }

      function _stopPolling() {
        $.each($scope.polling, function (i, p) {
          p.stop();
        });

        $scope.polling = [];
      }


      function _getSelectIndex() {
        return $scope.select;
      }


      function _setSelectIndex(index) {
        $scope.layout.auto = false;
        $scope.select = index;
      }


      function _selectByIndex(index) {
        $scope.selectByIndex(index);
      }

      function _getSelect() {
        return $scope.getSelect();
      }

      function _hideSelect() {
        $scope.hideSelect();
      }


      function _full(isFull) {
        $scope.full(isFull);

        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.full();
        }
      }


      function _addview(id) {
        iAjax.post('security/device/device.do?action=checkMonitor', {
          rows: [{devicefk: id}]
        });
      }


      function _getplays() {
        return $scope.getplays();
      }


      function _getname(id) {
        var result = '';
        if (names[id]) {
          result = names[id];
        } else {
          iAjax.postSync('security/common/monitor.do?action=getDeviceDetail', {
            filter: {id: id}
          }).then(function (data) {
            result = data.result.rows;
            names[id] = result;
          });
        }
        return result;
      }


      /**
       * 监听监控控件相关事件；
       *
       * allclose：所有的监控都被关闭后
       * layout: 布局变化
       *
       * @author : yjj
       * @version : 1.0
       * @Date : 2015-11-11
       */
      function _on(event, fn) {
        if (events[event]) {
          events[event].push(fn);
        } else {
          events[event] = [fn];
        }
      }

      function _destroy() {
        $.each($scope.screenList, function (i, s) {
          if (s && s.win) {
            if (s.win.window.camera) {
              s.win.window.camera.destroy();
            }
            s.win.close();
          }
        });

        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.destroy();
        }

        $scope.$destroy();
        setting.el.find('video').attr('src', '');
        setting.el.html('');
      }


      function _setKeeplast(value) {
        setting.keeplast = value;
      }


      function _getKeeplast() {
        return setting.keeplast;
      }


      function _screen(size) {
        if (window.__IIWHOST) {
          if (size == 1) {
            $.each($scope.screenList, function (i, s) {
              if (s && s.win) {
                if (s.win.window.camera) {
                  s.win.window.camera.destroy();
                }
                s.win.close();
              }
            });
            $scope.screenList = [];
          } else if (size > 1) {
            var gui = requireNW('nw.gui');

            var box_w = $(window).width(),
              box_h = $(window).height(),
              win;

            for (var i = 0; i < size - 1; i++) {
              win = gui.Window.open(location.href.split('#')[0] + '#/camera', {
                kiosk: true,
                toolbar: false,
                x: box_w * (i + 1),
                y: 0,
                width: box_w,
                height: box_h
              });

              // 使用闭包存在内存泄露风险；
              (function (index) {
                win.on('loaded', function () {
                  if (win.window.camera) {
                    win.window.camera.on('select', function () {
                      // 清除主屏选中；
                      _hideSelect();

                      // 清除其它屏幕选中，确保只有一个屏幕存在选中；
                      $.each($scope.screenList, function (i, o) {
                        if (i != index) {
                          o.win.window.camera.hideSelect();
                        }
                      });

                      // 设置index；
                      // TODO
                    });
                  }
                });
              })(i);


              $scope.screenList.push({
                index: i + 1,
                size: 9,
                win: win
              });
            }
          }
        } else {
          console.log('iiw.safe: b/s is not support multi screen!')
        }
      }


      function _openSound(index) {
        $scope.openSound(index);
      }


      function _closeSound(index) {
        $scope.closeSound(index);
      }

      function _max() {
        $scope.max();
      }

      function _min() {
        $scope.min();
      }

      function _ptzControl(ctrl, speed, open, preset) {
        if (safeImcsPlayer.isconnect()) {
          $scope.imcsPlayer.ptzControl(ctrl, speed, open, preset)
        } else {
          $scope.ptzControl(ctrl, speed, open, preset);
        }
      }

      function _snapshot(index) {

        if ($scope.select != index && index) {
          _setSelectIndex(index);
        } else {
          index = $scope.select;
        }

        $scope.selectByIndex($scope.select);

        if (safeImcsPlayer.isconnect() && isImcs($scope.getObject(index).getCode())) {

          if ($scope.imcsPlayer) {

            $scope.imcsPlayer.snapshot(function (image, devicefk) {
              var imageData = image.replace(/^data:image\/\w+;base64,/, '');
              var fileBlob = b64toBlob(imageData, "image/jpeg");

              var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=localsnap');
              var formData = new FormData();
              formData.append("imageFile", fileBlob);

              $http({
                method: 'post',
                url: url,
                data: formData,
                headers: {
                  'Content-Type': undefined
                }
              }).success(function (data) {
                if (data && data.result && data.result.rows) {
                  iAjax.post('security/common/monitor.do?action=saveMonitorImage', {
                    devicefk: devicefk,
                    photo: data.result.rows.savepath
                  }).then(function (data) {
                    if (data && data.status == 1) {
                      remind(1, '本地截图成功，历史本地截图可在统计分析中查看！', '本地截图成功');
                    }
                  });
                }
              });
            });

            // 消息提醒
            function remind(level, content, title) {
              var message = {
                id: iTimeNow.getTime(),
                title: (title || '消息提醒！'),
                level: level,
                content: (content || '')
              };
              iMessage.show(message, false);
            }


            // 将base64编码格式的字符串解码并生成blob对象
            function b64toBlob(b64Data, contentType, sliceSize) {
              contentType = contentType || '';
              sliceSize = sliceSize || 512;

              var byteCharacters = atob(b64Data);
              var byteArrays = [];

              for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
              }

              var blob = new Blob(byteArrays, {type: contentType});
              return blob;
            }

          }

        } else {
          $scope.snap($scope.select);
        }
      }

      $scope.getHardware = function (id, callback) {
        if (hardware[id]) {
          if (callback) callback(hardware[id]);
        } else {
          iAjax.post('security/device/device.do?action=getDeviceRelatedList', {
            filter: {id: id}
          }).then(function (data) {
            var videoBox = setting.el.find('safe-video:eq(' + ($scope.select - 1) + ')'),
              video = $(videoBox.data('data-video')),
              code = video.attr('code');

            if (code == data.result.id && data.result.rows.length) {
              hardware[id] = data.result.rows;
              if (callback) callback(hardware[id]);
            }
          });
        }
      };


      $scope.doHardware = function (id, type, code, value) {
        safeHardware.execute(id, type, code, value);
        // if(type != 'telephone') {
        //     iAjax.post('security/device/device.do?action=executeDeviceAction', {
        //         filter: {
        //             id: id,
        //             type: type,
        //             action: code,
        //             value: value
        //         }
        //     });
        // }else {
        //     if(code == 'call') {
        //         if(value) {
        //             safeDispatcher.startAdvConf([value]);
        //         }
        //     }else if(code == 'hangup') {
        //         safeDispatcher.hangUp();
        //     }
        // }
      };


      $scope.getHardwareStatus = function (id, callback) {
        iAjax.post('security/device/device.do?action=getDeviceStatus', {
          filter: {
            id: id
          }
        }).then(function (data) {
          if (callback) callback(data);
        });
      };


      $scope.ptzControl = function (ctrl, speed, open, preset) {
        var object = $scope.getObject($scope.select);
        if (object) {
          var code = object.getCode();
          if (code) {
            //console.log(code, ctrl, speed);
            iAjax.post('security/common/monitor.do?action=executePTZ', {
              filter: {
                id: code,
                ctrl: ctrl,
                speed: speed,
                open: open,
                preset: preset
              }
            });
          }
        }
      };

      // 获取设备参数
      $scope.getDevParam = function (id, callback) {
        iAjax.post('security/device/device.do?action=getMonitorLiveUrl', {
          //remoteip: '192.168.11.39',
          filter: {id: id, protocol: 'httpwebm'}
        }).then(function (data) {
          if (data.result) {
            if (callback) callback(data.result);

            if (!cache[id]) {
              cache[id] = {};
            }

            if (data.result.detail) {
              cache[id].detail = data.result.detail;
            } else {
              cache[id].src = data.result.rows;
            }
            //if(data.result.detail) {
            //	$scope.playType[id] = 'imcs';
            //} else {
            //	$scope.playType[id] = 'video';
            //}
          }
        });
      }

      $scope.getCameraLinkage = function (id) {
        $scope.isCameraLinkage = false;
        if (linkage[id] == id) {
          $scope.isCameraLinkage = true;
        } else {
          iAjax.post('/security/polling/polling.do?action=monitorPolling', {
            filter: {
              monitorfk: id
            }
          }).then(function (data) {
            if (data.result && data.result.rows) {
              $scope.isCameraLinkage = data.result.rows;
              linkage[id] = id;
            }
          });
        }
      };

      $scope.show = _show;


      $scope.record = _record;


      $scope.recordStop = _recordstop;


      $scope.recordSetPos = _recordpos;

      $scope.isImcs = isImcs;


      return {
        /**
         * 截图
         */
        snapshot: _snapshot,


        /**
         * 设置监控截图是否开启
         * true： 开启
         * false：禁用
         */
        setCanvas: function (value) {
          if (typeof value == 'boolean') {
            setting.canvas = value;
          }
        },


        /**
         * 在指定的窗格上打开监控的快照。
         * * 调用该方法会停止正在播放的轮巡组（包括临时组和轮巡组）
         *
         * @method picture
         *
         * @param id {String} 监控id
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.picture('CAMERAID', '1'); // 在1号窗格上显示CAMERAID对应的监控快照
         *      }]);
         */
        picture: function () {
          _stopPolling();
          _picture.apply(this, arguments);
        },

        /**
         * 自动查找窗格并显示监控快照。
         * * 调用该方法会停止正在播放的轮巡组（包括临时组和轮巡组）
         * * 自动查找具有一下几种情况：
         * * 情景一：自动布局模式，用户未选中窗格，调用该方法后，变为单画面并在此窗格上显示，再次调用该方法，变为四画面，在2号窗格上显示。
         * * 情景二：自动布局模式，用户选中了3号窗格，调用该方法后，在3号窗格上显示，再次调用，还是在3号窗格。
         * * 情景三：非自动布局模式，四画面，调用该方法五次，依次在1、2、3、4、1号窗格上显示。
         * * 情景四：调用该方法是参数necheck为true，只在当前选中或setSelectIndex窗格上显示。
         *
         * @method autoPicture
         *
         * @param id {String} 监控id
         * @param nocheck {Boolean} 是否不自动查找，默认否
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.autoPicture('CAMERAID');
         *      }]);
         */
        autoPicture: function () {
          _stopPolling();
          _autoPicture.apply(this, arguments);
        },

        /**
         * 在指定的窗格上打开监控的实况。
         * * 调用该方法会停止正在播放的轮巡组（包括临时组和轮巡组）
         *
         * @method show
         *
         * @param id {String} 监控id
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.show('CAMERAID', '1'); // 在1号窗格上显示CAMERAID对应的监控实况
         *      }]);
         */
        show: function () {
          _stopPolling();
          _show.apply(this, arguments);
        },

        /**
         * 自动查找窗格并显示监控实况。
         * * 调用该方法会停止正在播放的轮巡组（包括临时组和轮巡组）
         * * 自动查找具有一下几种情况：
         * * 情景一：自动布局模式，用户未选中窗格，调用该方法后，变为单画面并在此窗格上显示，再次调用该方法，变为四画面，在2号窗格上显示。
         * * 情景二：自动布局模式，用户选中了3号窗格，调用该方法后，在3号窗格上显示，再次调用，还是在3号窗格。
         * * 情景三：非自动布局模式，四画面，调用该方法五次，依次在1、2、3、4、1号窗格上显示。
         * * 情景四：调用该方法是参数necheck为true，只在当前选中或setSelectIndex窗格上显示。
         *
         * @method autoShow
         *
         * @param id {String} 监控id
         * @param nocheck {Boolean} 是否不自动查找，默认否
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.autoShow('CAMERAID');
         *      }]);
         */
        autoShow: function () {
          _stopPolling();
          _autoShow.apply(this, arguments);
        },

        /**
         * 打开多个监控，当监控数大于maxsize或者大于layout设置值时，启动临时轮巡组。
         * * 调用该方法会停止正在播放的轮巡组（包括临时组和轮巡组）
         *
         * @method shows
         *
         * @param ids {Array} 监控[id]数组
         * @param userLayout {Integer|Array[Array]} 画面数值或二维数组，具体参数看layout方法
         * @param timeout {Integer} 轮巡间隔
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          // 设置三画面显示，且在1号画面上每个15秒切换播放camera_1和camera_4
         *          camera.autoShow(['camera_1', 'camera_2', 'camera_3', 'camera_4'], [[1,1,2], [1,1,3]]);
         *      }]);
         */
        shows: _shows,

        /**
         * 查找录像，并在指定的窗格上自动开始回放。
         *
         * @method record
         *
         * @param id {String} 监控id
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         * @param start {long} 查询录像的开始时间，getTime
         * @param end {long} 查询录像的结束时间，getTime
         * @param pos {long} 开始回放定位的时间点，getTime，如查询一天的录像，但需要从2点开始，就需要配置该参数，否则就从开始时间播放
         */
        record: _record,

        /**
         * 开始（恢复）指定窗格的回放，主要用于暂停后恢复播放使用。
         *
         * @method recordPlay
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         */
        recordPlay: _recordplay,

        /**
         * 停止指定窗格的回放。
         *
         * @method recordStop
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         */
        recordStop: _recordstop,

        /**
         * 停止所有的回放。
         *
         * @method recordStopAll
         */
        recordStopAll: _recordstopall,

        /**
         * 暂停指定窗格的回放。
         *
         * @method recordPause
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         */
        recordPause: _recordpause,

        /**
         * 定位指定窗格回放中的进度。
         *
         * @method recordSetPos
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         * @param time {long} 需要定位到的时间点，getTime
         */
        recordSetPos: _recordpos,

        /**
         * 设置指定窗格回放中的播放速度。
         *
         * @method recordSetSpeed
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         * @param speed {string} 速度值，如 "1/16x","1/8x","1/4x","1/2x","1x","2x","4x","8x","16x"
         */
        recordSetSpeed: _recordspeed,

        /**
         * 单帧回放。
         *
         * @method playoneFrame
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         */
        playoneFrame: _playoneFrame,

        /**
         * 获取录像下载地址。
         *
         * @method recordGetDownloadUrl
         *
         * @param id {String} 监控id
         * @param start {long} 查询录像的开始时间
         * @param end {long} 查询录像的结束时间
         * @param callback {Function}
         */
        recordGetDownloadUrl: _recorddownload,

        /**
         * 停止录像下载，具体回调参数详见流媒体开发手册。
         *
         * @method stopRecordDownload
         *
         * @param dlid {String} 录像下载ID
         */
        stopRecordDownload: _stopRecordDownload,

        /**
         * 回放状态回调，具体回调参数详见流媒体开发手册。
         *
         * @method recordCallbackFN
         *
         * @param fn {Function} 回调函数
         */
        recordCallbackFN: _recordCallbackFN,

        /**
         * 录像下载状态回调，具体回调参数详见流媒体开发手册。
         *
         * @method getRecordDownloadStatus
         *
         * @param dlid {String} 录像下载ID
         */
        getRecordDownloadStatus: _getRecordDownloadStatus,

        /**
         * 设置当前布局，支持简单的数值布局及复杂的二维数组布局。
         *
         * @method layout
         *
         * @param layout {int|Array} 布局参数，详细见demo
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.layout(1); // 单画面
         *          camera.layout(4); // 四画面
         *          camera.layout(9); // 九画面
         *
         *          camera.layout([1,1,2], [1,1,3]); // 三画面
         *      }]);
         */
        layout: _layout,

        /**
         * 关闭指定窗格的实况。
         *
         * @method close
         *
         * @param index {int} 窗格序号，下标为1，1对应1号窗格
         */
        close: _close,

        /**
         * 关闭所有窗格的实况，包括临时轮巡组和轮巡组。
         *
         * @method closeAll
         */
        closeAll: _closeAll,

        /**
         * 停止轮巡组（包括临时）。
         *
         * @method closeAll
         */
        stopPolling: _stopPolling,

        /**
         * 设置选中窗格，1代表1号窗格。
         * * 选中窗格指由用户点击或本方法触发选中，在指定的窗格上显示选中边框。
         *
         * @method selectByIndex
         *
         * @param index {int} 窗格序号，下标为1
         */
        selectByIndex: _selectByIndex,

        /**
         * 获取选中的窗格序号，返回1代表1号窗格。
         * * 选中窗格指由用户点击或selectByIndex方法触发选中，在指定的窗格上显示选中边框。
         *
         * @method getSelect
         *
         * @return {int} 窗格序号，下标为1
         */
        getSelect: _getSelect,

        /**
         * 清除选中。
         *
         * @method hideSelect
         *
         * @param index {int} 窗格序号，下标为1
         */
        hideSelect: _hideSelect,

        /**
         * 设置聚焦窗格，1代表1号窗格。
         * * 注意是聚焦窗格，不是选中窗格，选中窗格是可以看到有选中边框的，而聚焦窗格把焦点隐藏的移动到对应的窗格，但播放视频时，可以自动的在该窗格上播放。
         * * 调用该方法后，将会取消自动布局模式，既播放的视频只能在制定的窗格上播放。
         *
         * @method setSelectIndex
         *
         * @param index {int} 窗格序号，下标为1
         */
        setSelectIndex: _setSelectIndex,

        /**
         * 获取当前聚焦的窗格序号，返回1代表1号窗格。
         * * 选中的情况下返回选中的窗格。
         * * 未选中的情况下，返回setSelectIndex方法配置的序号。
         * * 该方法建议与setSelectIndex配套使用。
         *
         * @method getSelectIndex
         *
         * @return {int} 窗格序号，下标为1
         */
        getSelectIndex: _getSelectIndex,

        /**
         * 设置监控控件是否全屏。
         *
         * @method full
         *
         * @param isFull {Boolean} 是否全屏，true为设置全屏，false为退出全屏
         */
        full: _full,

        /**
         * 记录手动查看监控记录。
         * * 当用户手动点击监控时，调用该方法，查看记录+1
         * * 用于数据分析统计使用
         *
         * @method addView
         *
         * @param id {String} 监控通道id
         */
        addView: _addview,

        /**
         * 获取所有正在播放的通道id，以数组形式返回。
         *
         * @method getplays
         *
         * @return {Array} 正在播放的通道数组
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          console.log(camera.getplays()); // ['ID1', '', 'ID2', ''] 以上案例为四画面，画面一和三分别在播放ID1和ID2的监控，画面二和四空闲
         *      }]);
         */
        getplays: _getplays,

        /**
         * 根据通道ID，获取通道名称。
         *
         * @method getname
         *
         * @param id {String} 通道的唯一id
         *
         * @return {String} 通道名称
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          console.log(camera.getname('ID')); // 西北围墙监控-1
         *      }]);
         */
        getname: _getname,

        /**
         * 监听控件相关回调事件；
         *
         * @event on
         *
         * @param event {String}
         *      allclose            所有的监控都被关闭后触发
         *      layout              布局变化触发
         * @param fn {Function} 回调方法
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.on('layout', function(size) {
         *              // 对应的布局，int | Array。
         *              console.log(size);
         *          });
         *      }]);
         */
        on: _on,

        /**
         * *** 销毁对象，在退出模块前必须调用该方法，否则会导致播放中的视频一直占用内存和cpu。**。
         *
         * @method destroy
         *
         * @param eventName {String} 发送的消息名称
         * @param data {JSON Object} 发送的数据内容，具体看模块数据接口文档。
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          // 监听模块控制器退出事件，退出模块时，销毁创建的camera对象，释放占用资源
         *          $scope.$on('***ControllerExitEvent', function() {
         *              if(camera) {
         *                  camera.destroy();
         *              }
         *          });
         *      }]);
         */
        destroy: _destroy,

        /**
         * 设置播放界面是否在停止后保留最后一帧，用于轮巡组等场景，避免出现画面切换时黑屏的现象出现；
         *
         * @method setKeeplast
         *
         * @param value {Boolean} 是否保留最后一帧
         *
         */
        setKeeplast: _setKeeplast,

        /**
         * 获取是否保留最后一帧的属性配置；
         *
         * @method getKeeplast
         *
         * @return value {Boolean} 是否保留最后一帧
         *
         */
        getKeeplast: _getKeeplast,


        /**
         * 设置一机多屏数量。
         *
         * @method screen
         *
         * @param layout {int} 分屏参数，详细见demo
         *
         * @example
         *      app.controller('***Controller', ['safeCamera', function(safeCamera) {
         *          var camera = safeCamera.create({
         *              'el': $('#ID'),
         *              'scope': $scope
         *          });
         *
         *          camera.screen(1); // 一机单屏
         *          camera.screen(2); // 一机双屏
         *          camera.screen(3); // 一机三屏
         *      }]);
         */
        screen: _screen,


        /**
         * 开启声音。
         *
         * @method openSound
         *
         * @param index {int}
         *
         */
        openSound: _openSound,


        /**
         * 关闭声音。
         *
         * @method closeSound
         *
         * @param index {int}
         *
         */
        closeSound: _closeSound,


        /**
         * 视频窗口最大化。
         *
         * @method max
         *
         */
        max: _max,


        /**
         * 视频窗口最小化。
         *
         * @method max
         *
         */
        min: _min,

        /**
         * 云台控制
         *
         * @method ptzControl
         *
         * @param ctrl {string} 控制命令
         * @param speed {int} 速度
         * @param open {boolean} 电源开关
         * @param preset {int} 预置点
         *
         */
        ptzControl: _ptzControl

      }
    }

    return {
      create: Camera
    }
  }]);
});