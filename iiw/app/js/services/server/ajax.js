define(["angular", "services/util/token", "services/util/timenow"], function (t) {
  t.factory("iAjax", ["$http", "$q", "$interval", "iToken", "iTimeNow", function (t, n, e, o, r) {
    function i() {
      _ && a("sys/web/login.do?action=continue")
    }

    function s() {
      c(), O = e(function () {
        i()
      }, 3e5)
    }

    function c() {
      O && (e.cancel(O), O = null)
    }

    function u(e, o) {
      var r = n.defer();
      return e = y(e), o = {timeout: j, data: h(o)}, t.post(e, o).success(function (t) {
        p(t, r, e, o, "post")
      }).error(function (t, n) {
        m({data: t, status: n}, r)
      }), r.promise
    }

    function a(e, o) {
      var r = n.defer();
      return e = y(e), o = {timeout: j, params: h(o)}, t.get(e, o).success(function (t) {
        p(t, r, e, o, "get")
      }).error(function (t, n) {
        m({data: t, status: n}, r)
      }), r.promise
    }

    function f(t, n) {
      return d(t, n, "post")
    }

    function l(t, n) {
      return d(t, n, "get")
    }

    function d(t, n, e) {
      var o, r = "error";
      return t = y(t) + "&json=" + encodeURIComponent(JSON.stringify({data: n})), $.ajax({
        type: e,
        dataType: "json",
        async: !1,
        timeout: j,
        url: t
      }).success(function (n) {
        o = n, r = p(n, null, t, null, "sync")
      }).error(function (t) {
        o = t, r = m(t)
      }), {
        then: function (t, n) {
          return "success" == r ? t && t(o) : n && n(o), this
        }
      }
    }

    function p(t, n, e, i, s) {
      var c = "success";
      if (1 == t.status) t.token && (_ = t.token, o.set(_)), t.time && r.setSvrTime(t.time), n && n.resolve(t), c = "success"; else {
        if (window.__IIWDEBUGGER) {
          var u = "iiw.core: 请求异常，具体内容如下\nurl: " + e + "\ntype: " + s + "\ndata: " + JSON.stringify(i) + "\nresult: " + JSON.stringify(t);
          1 == window.__IIWDEBUGGER ? alert(u) : console.error(u)
        }
        t.exnum >= 9e3 ? I() : (1300 == t.exnum || 1403 == t.exnum) && I(), n && n.reject(t), c = "error"
      }
      return c
    }

    function m(t, n) {
      return n && n.reject(t), "error"
    }

    function h(t) {
      return t = t || {}, window.__IIWREMOTEIP && (t.remoteip = window.__IIWREMOTEIP), t.host = location.host, t
    }

    function y(t) {
      if (0 != t.indexOf("http://") && 0 != t.indexOf("https://")) {
        if (0 == t.indexOf("/") && (t = t.substr(1, t.length)), _) {
          var n = t.indexOf("?") > -1 ? "&" : "?";
          return $.soa.root + t + n + "authorization=" + _
        }
        return $.soa.root + t
      }
      return t
    }

    function v() {
      _ = null
    }

    function g() {
      _ = o.get()
    }

    function w() {
      var t = !1;
      return $.ajax({
        type: "get",
        dataType: "json",
        async: !1,
        timeout: 3e3,
        url: y("sys/web/dialect.do?action=getDialect")
      }).success(function (n) {
        n && 1 == n.status && (t = !0)
      }), t
    }

    function I() {
      window.__IIWHOST ? location = "index.html" : location = $.soa.root
    }

    function x(t) {
      var n = t;
      if (window.__IIWHOST) {
        var e = document.createElement("a");
        e.href = t;
        var o = e.host.split(":");
        n = ["main.html?isclient=1&host=", o[0], "&port=", o[1] || 80, "&path=", encodeURIComponent(e.hash)].join("")
      }
      return n
    }

    function T(t, n, e) {
      var o = $.soa.getWebPath(t) + n;
      if (!e) {
        var r = "";
        return $.ajax({url: o, async: !1, cache: !1, dataType: "text"}).success(function (t) {
          r = t
        }), r
      }
      $.ajax({url: o, async: !0, cache: !1, dataType: "text"}).success(function (t) {
        e(t)
      })
    }

    var _ = o.get(), j = 1e4, O = null;
    return s(), {
      post: u,
      postSync: f,
      get: a,
      getSync: l,
      formatURL: y,
      cleanToken: v,
      recoveryToken: g,
      checkToken: w,
      startKeepSession: s,
      stopKeepSession: c,
      formatFrameURL: x,
      getTemplate: T
    }
  }])
});
