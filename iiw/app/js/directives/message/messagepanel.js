define(["angular", "directives/message/messagebox", "directives/message/messagecontent", "directives/layout/drag"], function (e) {
  e.directive("iMessagePanel", [function () {
    function e(e) {
      var a = "";
      return $.ajax({url: e, async: !1, cache: !1, dataType: "text"}).success(function (e) {
        a = e
      }), a
    }

    // var a = e($.soa.root + "view/message.html");
    var a = e('/' + "view/message.html");
    return {restrict: "E", template: a, replace: !0}
  }])
});
