/**
 * Created by llx on 2017/2/10.
 */
define(['app'],
    function(app) {
        app.filter('filterYear', [
            function() {
                return function(year) {
                    var item = '';
                    if(year.length > 1){
                        item = year[0] + '-' + year[year.length - 1];
                    }else{
                        item = year[0];
                    }
                    return item;
                }
            }
        ])
    });