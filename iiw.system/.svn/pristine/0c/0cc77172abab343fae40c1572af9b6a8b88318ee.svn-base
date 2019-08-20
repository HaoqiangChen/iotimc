/**
 * 过滤数据项的数据格式
 *
 * @author : dwt
 * @date : 2016-12-23
 * @version : 0.1
 */
define([
    'app'
], function(app) {
    app.filter('infocardFilterItem', [
        function() {
            return function(input) {
                var out = '';
                if(typeof(input) == 'string') {
                    out = input;
                }else {
                    var arr = [];
                    _.each(input, function(v) {
                        arr.push(v.name);
                    });
                    out = arr.join('、');
                }
                return out;
            }
        }
    ]);
});