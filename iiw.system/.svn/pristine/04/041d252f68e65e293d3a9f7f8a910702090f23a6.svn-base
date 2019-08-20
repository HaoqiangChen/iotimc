/**
 * Created by llx on 2016/12/2.
 */

define(['app'],
    function(app) {
        app.filter('filterService', [
            function() {
                return function(service) {
                    var item = [];
                    for(var i = 0; i < service.length; i++) {
                        item = (item + service[i].service + '、');
                    }
                    if(item.length > 0) {
                        item = item.substring(0, item.length - 1)
                    }
                    return item;
                }
            }
        ])
    });