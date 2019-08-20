/**
 * IMCS视频权限配置
 *
 * Created by wuk on 2019-07-08
 */
define(['app'],function(app){
    app.directive('exportExcel',['iAjax',
        function(){
            return {
                reatrict:'E',
                template:'<iframe id="exportExcelFrame" style="display: none">'
                + '<html>'
                + '<head><meta http-equiv="content-type" content="text/html;chartset=utf-8"/></head>'
                + '<body>模板下载</body>'
                + '</html>'
                + '</iframe>',

                replace:true,
                compile:function(){
                    return {
                        post:function(scope,ele){
                            scope.$on('downExcel',function(even,url){
                                if(url){
                                    ele.attr('src',url);
                                }
                            })
                        }
                    }
                }
            }
        }
    ])
})