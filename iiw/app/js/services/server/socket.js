define(["angular","services/server/ajax","services/util/token"],function(n){n.factory("iSocket",["$rootScope","$location","$timeout","iAjax","iToken",function(n,t,o,e,i){function c(n){function t(){return{validation:[function(n){"0"==n.status&&r.send(JSON.stringify({authorization:i.get()}))}],request:[function(n){"authentication"==n.status&&r.send(JSON.stringify({authorization:i.get()}))}]}}function e(){r.onopen=function(){l=!0,a("connect"),u()},r.onclose=function(){l=!1,a("disconnect"),u(),c()},r.onerror=function(n){l=!1,a("error",n.data),u(),c()},r.onmessage=function(n){var t=JSON.parse(n.data),o=t.event,e=t.data;if(window.__IIWDEBUGGER){var i="iiw.core: 收到服务端的ws消息，内容如下\n"+JSON.stringify(t);1==window.__IIWDEBUGGER?alert(i):console.log(i)}a(o,e),a("__ALL.WS.EVENT",{event:o,data:e})}}function c(){!s&&r&&(s=o(function(){r=new WebSocket(n),e()},1e3))}function u(){s&&(o.cancel(s),s=null)}function a(n,t){f[n]&&$.each(f[n],function(n,o){o(t)})}var s,r=new WebSocket(n),f=t(),l=!1;return e(),{on:function(n,t){f[n]||(f[n]=[]),f[n].push(t)},emit:function(n,t){l&&r.send(JSON.stringify({event:n,data:t}))},close:function(){r&&(r.close(),r=null)}}}function u(n){function t(t){n&&n(t)}s?t(s):e.postSync("sys/web/config.do?action=getWebSocketPort").then(function(n){t(n&&n.result?n.result.port:2048)})}var a,s;return{connect:function(){a&&a.close(),u(function(n){if("/"==$.soa.defaultHost)a=new c("ws://"+t.$$host+":"+n+"/ws");else{var o=document.createElement("a");o.href=$.soa.defaultHost,a=new c("ws://"+o.hostname+":"+n+"/ws")}})},close:function(){a&&a.close()},on:function(t,o){a&&a.on(t,function(){var t=arguments;n.$apply(function(){o.apply(a,t)})})},emit:function(n,t){a&&a.emit(n,t)}}}])});