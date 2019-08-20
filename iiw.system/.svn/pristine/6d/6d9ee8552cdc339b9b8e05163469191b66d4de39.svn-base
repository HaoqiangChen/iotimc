
/**
 * 过滤生效日期
 *
 * @author - dwt
 * @date - 2016-05-26
 * @version - 0.1
 */
define([
    'app'
], function(app) {
    var format = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    app.filter('filterWeek', [
        function() {
            return function(input) {
                var out = '';
                var arr = input.split(',');
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i] == 1) {
                        out += (format[i] + '、');
                    }
                }
                if(out.length > 0) {
                    out = out.substring(0, out.length - 1);
                }
                return out;
            }
        }
    ]);
});