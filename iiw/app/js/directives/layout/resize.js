define(["angular"],function(i){i.directive("iResize",["$interval",function(i){var e=0,n=[];return i(function(){var i,e,t=[];$.each(n,function(n,h){i=$("."+h),i.size()?(e=i.data("i-resize-data"),e&&e.o&&e.fn&&e.o[e.fn]&&(e.w!=i.width()||e.h!=i.height())&&(e.o[e.fn](i,i.width(),i.height(),e.w,e.h),e.w=i.width(),e.h=i.height())):t.push(h)}),n=_.difference(n,t)},100),{restrict:"A",scope:{fn:"@iResize"},link:function(i,t){var h="i-resize-"+e++;t.data("i-resize-data",{id:h,w:t.width(),h:t.height(),o:i.$parent,fn:i.fn}),t.addClass(h),n.push(h)}}}])});