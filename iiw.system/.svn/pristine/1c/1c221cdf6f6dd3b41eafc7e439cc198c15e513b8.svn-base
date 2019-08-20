/**
 * Created by GDJ on 2016/4/20.
 */
define(['app'], function(app) {
    app.filter('weekFilter', [function() {
        return function(val) {
            if (val) {
                var name = '星期';
                switch (val) {
                    case '1':
                        name = name + '一';
                        break;
                    case '2':
                        name = name + '二';
                        break;
                    case '3':
                        name = name + '三';
                        break;
                    case '4':
                        name = name + '四';
                        break;
                    case '5':
                        name = name + '五';
                        break;
                    case '6':
                        name = name + '六';
                        break;
                    case '7':
                        name = name + '日';
                        break;
                }
                return name;
            }
        }
    }]);
});