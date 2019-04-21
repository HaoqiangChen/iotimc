/**
 * 计算人员简卡信息牌的大小
 *
 * Created by YJJ on 2015-12-24.
 */
define([
    'app'
], function(app) {
    app.directive('safeInsidemapPeoplebox', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element, attrs) {
                        $element.ripple();

                        //普通人员的颜色
                        var normalColors = [
                            '#008D78',
                            '#006F5E',
                            '#006F5E',
                            '#004F43'
                        ];

                        //重点人员的颜色
                        var importantColors = [
                            '#AA0000',
                            '#880000',
                            '#660000',
                            '#440000'
                        ];
                        var selfObj = $scope.$parent.area.plist[$scope.$index];
                        var colors = (!selfObj['key'] || selfObj['key'] == '0') ? normalColors : importantColors;
                        $timeout(function() {
                            var parent = $element.parent().parent(),
                                box_w = parent.width(),
                                box_h = parent.height(),
                                size = $scope.$parent.area.plist.length,
                                height = 1,
                                limitColor,
                                eightColor = 0;

                            //if(size > 8 || (size > 1 && size <=4 )) {
                            //    size = 2;
                            //    height = 2;
                            //    limitColor = 4;
                            //} else if(size > 4 && size <= 8) {
                            //    size = 4;
                            //    height = 2;
                            //    limitColor = 2;
                            //} else if (size == 1) {
                            //    size = 1;
                            //    height = 1;
                            //    limitColor = 2;
                            //    $element.find('p:first-child').css('font-size', '25%');
                            //}

                            if(size == 1) {
                                size = 1;
                                height = 1;
                                limitColor = 2;
                                $element.find('p:first-child').css('font-size', '25%');
                            } else if(attrs['safeInsidemapPeoplebox'] == 'four') {
                                size = 2;
                                height = 2;
                                limitColor = 4;
                            } else if(attrs['safeInsidemapPeoplebox'] == 'eight') {
                                size = 4;
                                height = 2;
                                limitColor = 2;
                                eightColor = Math.floor($scope.$index / 4) % 2;
                            }

                            if($scope.$parent.area.codePeopleView == '1') {
                                if($scope.$parent.area.plist.length % 2 == 0) {
                                    height = $scope.$parent.area.plist.length / 2;
                                } else {
                                    height = ($scope.$parent.area.plist.length / 2) + 1;
                                }
                            }

                            if(attrs['peopleboxScroll'] == 'true') {
                                $element.width(Math.floor(box_w / size)).height(box_h / (height + 0.6));
                                $element.css('font-size', box_h / (size + 0.6));
                            } else {
                                $element.width(Math.floor(box_w / size)).height(box_h / height);
                                $element.css('font-size', box_h / size);
                            }

                            $element.css('background', colors[($scope.$index + eightColor) % limitColor]);
                            //for(var i = limitColor; i > 0; i--) {
                            //    if(($scope.$index + 1) % i == 0) {
                            //        $element.css('background', colors[i - 1]);
                            //        return;
                            //    }
                            //}
                        }, 300);
                    }
                }
            }
        }
    }]);
});