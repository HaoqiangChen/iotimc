/**
 * Created by ZJQ on 2015-11-24.
 */
define(['app'], function(app) {
    app.directive('unity', [
        '$timeout',

        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    unityModel: '=unityModel'
                },
                link: function (scope, $element, attr) {
                    scope.$watch('unityModel.beginload', function (value) {
                        if (value) {
                            $timeout(function () {
                                var html = [];
                                html.push('<OBJECT id="3DPlayer" classid="clsid:444785F1-DE89-4295-863A-D46C3A781394" width="100%" height="100%">');
                                html.push('<PARAM NAME="_cx" VALUE="15875">');
                                html.push('<PARAM NAME="_cy" VALUE="11906">');
                                html.push('<PARAM NAME="src" VALUE="' + scope.unityModel.url + '">');
                                html.push('<PARAM name="disableContextMenu" value="true" />');
                                html.push('<PARAM name="logoimage" value="'+ scope.unityModel.logourl +'" />');
                                html.push('<PARAM name="wmode" value="transparent" />');
                                //html.push('<PARAM name="progressbarimage" value="img/unity3d/pro3.png" />');
                                //html.push('<PARAM name="progressframeimage" value="img/unity3d/pro-w.png" />');
                                // progressbarimage="'+ scope.unityModel.logourl +'"  progressframeimage="'+ scope.unityModel.logourl +'"
                                html.push('<embed id="3DPlayerEm" src="' + scope.unityModel.url + '" type="application/vnd.unity" width="100%" height="100%" logoimage="'+ scope.unityModel.unityurl +'" backgroundcolor="red" enabledebugging="0" enablecontextmenu="false" disableContextMenu="true" clickoplay="0" style="display: block; width: 100%; height: 100%;">');
                                html.push('</OBJECT>');
                                $element.html(html.join(''));

                                if(!!window.ActiveXObject || "ActiveXObject" in window){
                                    Unity3D.player = $('#3DPlayer').get(0);   //IE加载时切换此方法
                                }else{
                                    Unity3D.player = $('#3DPlayerEm').get(0);
                                }
                            }, 100);
                        }
                    });

                    scope.$on('unityDestroy', function () {
                        Unity3D.player = null;
                        $element.html('');
                    });

                    scope.$on('safeMainMenuHideEvent', function(){
                        $element.removeClass('nav-fixed');
                    });

                    scope.$on('safeMainMenuShowEvent', function(){
                        $element.addClass('nav-fixed');
                    });

                    scope.$on('camera-minEvent', function(){
                        $element.removeClass('nav-fixed');
                    });

                    scope.$on('camera-maxEvent', function(){
                        $element.addClass('nav-fixed');
                    });

                    scope.$on('hideSafeInfoCardEvent', function(){
                        $element.removeClass('nav-fixed');
                    });

                    scope.$on('showSafeInfoCardEvent', function(){
                        $element.addClass('nav-fixed');
                    });

                    scope.$on('hideCameraListEvent', function(){
                        $element.removeClass('nav-fixed');
                    });

                    scope.$on('showCameraListEvent', function(){
                        $element.addClass('nav-fixed');
                    });


                    scope.$on('unity2fullscreen', function (event, data) {
                        if (data) {
                            if (data == 'True') {
                                $element.addClass('unity_fullscreen');
                            } else {
                                $element.removeClass('unity_fullscreen');
                            }
                        }
                    })
                }
            };
        }
    ]);
});