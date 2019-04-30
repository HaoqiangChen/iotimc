/**
 * 格式化安全指标
 * 
 * @author : yjj
 * @version : 1.0
 * @Date : 2015-11-26
 */
define(['app'], function(app) {
	app.filter('safeMainSafeFormat', function() {
		return function(object, type) {
			var result = '',
				score = 0;

			if(object && object.child) {
				$.each(object.child, function(i, o) {
					score += o.score;
				});
				score = parseInt(score / object.child.length);

				if(type == 'value') {
					result = score;
				} else if(type == 'type') {
					if(score >= 80) {
						result = 'success';
					} else if(score >= 60) {
						result = 'warning';
					} else {
						result = 'danger';
					}
				}
			}
			return result;
		}
	});
});