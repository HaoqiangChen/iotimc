define(["angular"],function(n){n.directive("iMessageBox",[function(){return{restrict:"A",link:function(n,i){if(n.row&&n.row.json){var o=n.row.json;i.hover(function(){$(i).find(".messageBg").stop(!0).animate({opacity:1},"fast")},function(){$(i).find(".messageBg").stop(!0).animate({opacity:o.opacity},"fast")}),n.tap=function(){o.fn&&n.row.call?n.row.call[o.fn](i,o):n.row.istimeout=!0}}}}}])});