// define(["angular", "css!../../../css/logo.css", "css!../../../sys/web/logo.do"], function (t) {
define(["angular", "css!../../../css/logo.css"], function (t) {
  t.directive("iLogo", ["$timeout", "iConfig", function (t, i) {
    return {
      scope: {notitle: "=logoNotitle", deftitle: "=logoTitle", defsubtitle: "=logoSubtitle"},
      template: '<div class="iiw-logo-panel"><div class="logo"></div><div class="titles"><h1>{{title}}</h1><h2>{{subtitle}}</h2></div></div>',
      restrict: "E",
      compile: function () {
        return {
          post: function (t, e) {
            function l(t) {
              var i = e.find(".iiw-logo-panel"), l = i.parent().parent().height();
              i.height(l), i.css("font-size", l);
              var n = (l - (.27 * l + 10 + .21 * l)) / 3;
              i.find("h1").css("margin-top", n + .06 * l / 2), i.find("h1").css("margin-bottom", n), o(t)
            }

            function n(i) {
              var e, l = a[i];
              return l && (t[i] = l.content, e = l.content), e
            }

            function o(i) {
              var l = n("company");
              if (s(l, i), t.deftitle || n("title"), t.defsubtitle || n("subtitle"), !t.subtitle) {
                var o = e.find(".iiw-logo-panel");
                o.find(".titles").height("100%").css("display", "table"), o.find(".titles h1").css("display", "table-cell").css("vertical-align", "middle")
              }
            }

            function s(t, i) {
              var l, n, o = e.find(".iiw-logo-panel"), s = o.height(), a = e.find(".logo");
              a.removeClass(t), a.addClass(t), i ? (l = a.width(), n = a.height(), a.attr("mywidth", l).attr("myheight", n)) : (l = a.attr("mywidth"), n = a.attr("myheight")), a.height(s), a.width(s / n * l)
            }

            t.title = t.deftitle || "　", t.subtitle = t.defsubtitle || "　";
            var a = {company: i.get("company"), title: i.get("title"), subtitle: i.get("subtitle")};
            l(!0), e.find(".iiw-logo-panel").parent().parent().on("resize", function () {
              l()
            }), t.notitle && e.find(".titles").hide()
          }
        }
      }
    }
  }])
});
