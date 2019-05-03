define(["angularAMD", "angular"], function (e, t) {
  function n() {
    var e = "/login";
    if ($.soa.configInfo && $.soa.configInfo.rows) {
      var t = _.findWhere($.soa.configInfo.rows || [], {key: "webcontextpath"});
      t && t.content && (e = t.content)
    }
    return e
  }

  function o(e, t) {
    var n = {url: t.route.stateurl, templateUrl: t.client + "/" + e + "/webapp/index.html"};
    return t.main && angular.extend(n, {
      controllerUrl: t.route.requirename + "/js/app",
      controller: t.main,
      params: {data: null},
      onEnter: ["$rootScope", function (e) {
        setTimeout(function () {
          e.$broadcast(t.main + "OnEvent")
        }, 100)
      }],
      onExit: ["$rootScope", function (e) {
        e.$broadcast(t.main + "ExitEvent")
      }]
    }), n
  }

  t.config(["$stateProvider", "$urlRouterProvider", function (t, r) {
    t.state("reg", e.route({
      url: "/reg",
      templateUrl: "view/reg.html",
      controllerUrl: "controllers/reg",
      controller: "regController"
    })), $.each($.soa.getInfo() || [], function (n, r) {
      // console.log(n, r)
      t.state(r.route.statename, e.route(o(n, r)))
    }), r.otherwise($.soa.regkey ? "/reg" : n())
  }])

});
