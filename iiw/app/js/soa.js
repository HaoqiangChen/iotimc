!function (e) {
  function t(e) {
    return e.replace("iiw.", "")
  }

  function n(e) {
    return t(e).replace(/\./g, "/")
  }

  function o(e) {
    var t = e.split(".");
    return "/" + t[t.length - 1]
  }

  function a(e) {
    var t = document.createElement("a");
    t.href = e;
    var n = t.href;
    return "/" == n.substr(n.length - 1, n.length) && (n = n.substr(0, n.length - 1)), n
  }

  function r() {
    var e;
    if (window.__IIWHOST) {
      var t = document.createElement("a");
      t.href = window.__IIWHOST, e = t.host
    } else e = location.host;
    return e
  }

  var s = {};
  s = {
    "iiw.login": {
      "active": true, "author": "yjj", "client": "/iiw", "date": "2015-10-27", "host": "/",
      "name": "iiw.login", "main": "loginController", "timestamp": 1585561107961, "version": "0.0.1",
      "route": { "statename": "login", "stateurl": "/login", "requirename": "login" }
    },
    "iiw.safe": {
      active: true, author: "yjj", client: "/iiw", date: "2015-10-21", host: "/",
      name: "iiw.safe", main: "safeMainController", timestamp: 1585565998558, version: "0.0.1",
      route: {statename: "safe", stateurl: "/safe", requirename: "safe"}
    }
  };
  e.soa = {}, e.extend(e.soa, {
    root: window.__IIWHOST || '/',
    api: 'http://localhost:8080/',
    defaultPath: "",
    defaultHost: window.__IIWHOST || '/',
    regkey: "",
    regtext: "系统未注册",
    configInfo: {
      status: "1",
      rows: [
        {code: "01", content: "广州畅驿有限公司", inputtype: "combo", key: "title", name: "标题", sign: "title"},
        {code: "02", content: "智能安防集成平台", inputtype: "combo", key: "subtitle", name: "副标题", notes: "9151EE561A2541E1A5DABC59B9AAA343", sign: "subtitle"},
        {code: "03", content: "jh", inputtype: "combo", key: "company", name: "公司logo", sign: "company"},
        {code: "04", content: "Copyright &#169; 2015-2018 畅驿 All Rights Reserved.", inputtype: "combo", key: "copyright", name: "版权声明", sign: "copyright"},
        {code: "10", content: "login", key: "webcontextpath", name: "前端初始化跳转地址", sign: "webcontextpath"},
        {code: "11", key: "webloading", name: "前端加载动画", sign: "webloading"}
      ]
    },
    init: function () {
      function i(t) {
        switch (e.soa.regkey = t.message.substring(t.message.indexOf("[") + 1, t.message.indexOf("]")), t.exnum) {
          case 9001:
            e.soa.regtext = "系统已过期";
            break;
          case 9003:
            e.soa.regtext = "系统授权错误"
        }
        console.error(JSON.stringify(t))
      }

      e.ajax({async: !1, dataType: "json", url: e.soa.root + "context/info"}).success(function (t) {
        t && (e.soa.contextInfo = t, t.baseContext && t.baseContext.iiwRoot && (e.soa.root += t.baseContext.iiwRoot + "/"))
      }), e.ajax({
        async: !1,
        dataType: "json",
        url: e.soa.root + "sys/web/config.do?action=getConfig"
      }).success(function (t) {
        // t && t.result && (e.soa.configInfo = t.result)
        // console.log(e.soa.configInfo)
      }), e.ajax({
        async: !1,
        dataType: "json",
        url: e.soa.root + "soa/getInfo?host=" + encodeURIComponent(r())
      }).success(function (r) {
        // r && "undefined" == typeof r.status ? (s = r, e.each(s, function (e, r) {
        //   r.route = {statename: t(e), stateurl: o(e), requirename: n(e)}, r.client = a(r.client)
        // })) : r.exnum >= 9e3 && i(r)
      }).error(function (e) {
        e && e.exnum >= 9e3 && i(e)
      });

    },
    getInfo: function () {
      return s
    },
    getPath: function (e) {
      var t = s[e];
      if (t) return t.client;
      throw e + "not init"
    },
    getWebPath: function (e) {
      var t = s[e];
      if (t) return t.client + "/" + e + "/webapp";
      throw e + "not init"
    },
    getRequireConfig: function (t) {
      return t = t || {}, e.each(s, function (e, o) {
        t[n(e)] = o.client + "/" + e + "/webapp"
      }), t
    }
  }), e.soa.init()
}(jQuery);
