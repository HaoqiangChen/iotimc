/**
 * 格式化安全指标
 *
 * @author : chq
 * @version : 1.0
 * @Date : 2019-11-13
 */
define(['app'], function(app) {
	app.filter('onlyFileName', function() {
		return function(path) {
			var path = JSON.parse(JSON.stringify(path));
      var index = path.lastIndexOf('/'); // lastIndexOf("/")  找到最后一个  /  的位置
      var fileName = path.substr(index + 1); // substr() 截取剩余的字符，即得文件名xxx.doc
			return fileName;
		}
	});
});
