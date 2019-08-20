/**
 * Created by llx on 2017/2/8.
 */
define([
    'app'
], function(app) {
    app.filter('filterDate', [
        function() {
            return function(date) {
                var item = '';
                if(date.length){
                    item = [];
                    for(var i = 0; i < date.length; i++){
                        item = (item + date[i] + '、')
                    }
                    if(item.length > 0){
                        item = item.substring(0, item.length - 1)
                    }
                }
                return item;
            }
        }
    ])
});