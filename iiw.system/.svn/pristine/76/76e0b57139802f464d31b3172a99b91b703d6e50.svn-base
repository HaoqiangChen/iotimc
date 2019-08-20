/**
 * Created by llx on 2016/12/2.
 */

define(['app'],
    function(app) {
        app.filter('filterServiceName', [
            function() {
                return function(service) {
                    var item = [];
                    for(var i = 0; i < service.length; i++) {
                        item = (item + service[i].servicename + '、');
                    }
                    if(item.length > 0) {
                        item = item.substring(0, item.length - 1)
                    }
                    return item;
                }
            }
        ])
    });