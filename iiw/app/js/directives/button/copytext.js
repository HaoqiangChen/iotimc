define(["angular","zeroClipboard"],function(e,i){e.directive("iCopyText",[function(){return{restrict:"A",compile:function(e){new i(e.get(0))}}}])});