/**
 * 根据正负数，显示向上箭头或者向下箭头；
 * 
 * @author : zhs
 * @version : 1.0
 * @Date : 2018-03-09
 */
define(['app'], function(app) {
	app.filter('safeBidArrowValue', ['$filter', function($filter) {
		return function(value, type) {
			if(value > 0) {
				value = ((type) ? '+' : '↑') + Math.abs($filter('number')(value, 0));
			} else {
                value = ((type) ? '-' : '↓') + Math.abs($filter('number')(value, 0));
			}
			return value;
		}
	}]);
});