window.__IIWHOST && require.config({baseUrl: $.soa.root + "js"}), require.config({
  paths: $.soa.getRequireConfig({
    angularLib: "../lib/angular/1.4.6/angular.min",
    animate: "../lib/angular/1.4.6/angular-animate.min",
    angularMessage: "../lib/angular/1.4.6/angular-messages.min",
    angularLocale: "../lib/angular/1.4.6/angular-locale_zh",
    angularAMD: "../lib/angular/plugins/angularAMD/0.2.1/angularAMD.min",
    ngload: "../lib/angular/plugins/angularAMD/0.2.1/ngload.min",
    angularHammer: "../lib/angular/plugins/angularHammer/2.1.10/angular.hammer.min",
    "ui-bootstrap": "../lib/angular/plugins/ui-bootstrap/1.3.2/ui-bootstrap-tpls-1.3.2.min",
    "ui-router": "../lib/angular/plugins/ui-router/0.2.15/angular-ui-router.min",
    "ui-layout": "../lib/angular/plugins/ui-layout/1.3.1/ui-layout",
    "ui-event": "../lib/angular/plugins/ui-event/1.0.0/event.min",
    "ui-sortable": "../lib/angular/plugins/ui-sortable/0.13.4/sortable.min",
    "infinite-scroll": "../lib/angular/plugins/infinite-scroll/1.0.0/ng-infinite-scroll.min",
    bootstrap: "../lib/bootstrap/3.3.5/js/bootstrap.min",
    underscore: "../lib/underscore/1.8.3/underscore-min",
    hammer: "../lib/hammer/2.0.4/hammer.min",
    iscroll: "../lib/iscroll/5.1.2/iscroll",
    iscroll2: "../lib/iscroll/5.2.0/iscroll",
    json: "../lib/json/json2",
    zeroClipboard: "../lib/ZeroClipboard/2.2.0/ZeroClipboard.min",
    moment: "../lib/moment/2.10.6/moment.min",
    "moment-zh-cn": "../lib/moment/2.10.6/locale/zh-cn",
    easing: "../lib/jquery/plugins/easing/jquery.easing.1.3",
    resize: "../lib/jquery/plugins/resize/jquery.ba-resize.min",
    animateColor: "../lib/jquery/plugins/animate-colors/jquery.animate-colors-min",
    vs: "../lib/monaco-editor/0.9.0/vs"
  }),
  map: {
    "*": {
      cssloader: "../lib/requirejs/2.1.20/css/css.min",
      css: "../lib/requirejs/2.1.20/css/css.min",
      less: "../lib/requirejs/2.1.20/less/less"
    }
  },
  shim: {
    animate: ["angularLib"],
    angularLocale: ["angularLib"],
    angularMessage: ["angularLib"],
    bootstrap: {deps: ["css!../lib/bootstrap/3.3.5/css/bootstrap.min.css"]},
    angularAMD: ["angularLib", "animate", "angularLocale", "angularMessage", "angularHammer", "easing", "resize", "animateColor"],
    ngload: ["angularAMD"],
    angularHammer: ["angularLib", "hammer"],
    "ui-bootstrap": ["angularLib", "bootstrap"],
    "ui-router": ["angularLib"],
    "ui-layout": ["angularLib"],
    "ui-event": ["angularLib"],
    "ui-sortable": ["angularLib"],
    "infinite-scroll": ["angularLib"],
    app: ["routes", "controllers/main"]
  },
  config: {moment: {noGlobal: !0}},
  deps: ["app", "css!../lib/font-awesome/4.4.0/css/font-awesome.min", "css!../lib/angular/plugins/ui-layout/1.3.1/ui-layout", "css!../lib/jquery/plugins/ui/jquery-ui.min", "css!../lib/animate/animate.min", "css!../css/buttons", "css!../css/patternsbg", "css!../css/fonts/opan-sans/opansans", "css!../css/fonts/msyh/msyh", "css!../css/fonts/font", "css!../css/main", "less!../less/main"]
});
