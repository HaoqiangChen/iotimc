define(["angular"],function(n){n.factory("iConfig",[function(){function n(){$.soa.configInfo&&$.soa.configInfo.rows&&$.each($.soa.configInfo.rows||[],function(n,f){o[f.key]=f})}var o={};return n(),{get:function(n){return o[n]||""}}}])});