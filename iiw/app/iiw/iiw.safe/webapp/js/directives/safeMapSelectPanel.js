/**
 * 地图选择面板指令。
 *
 * Created by YJJ on 2015-11-23.
 */
define([
    'app'
], function(app) {
    app.directive('safeMapSelectPanel', ['$compile', function($compile) {
        return {
            restrict: 'E',
            compile: function() {
                return {
                    post: function($scope, $element) {
                        var html = [];
                        html.push('<div class="overflow-h" ui-layout options="{dividerSize:\'0\'}">');
                        html.push('<div class="overflow-h" ui-layout-container size="100px">');
                        html.push('<div class="safe-map-select-title fz-5">');
                        html.push('<ol class="breadcrumb">');
                        html.push('<li ng-repeat="item in path.paths" ng-class="{active: $last}" ng-click="gopath($index, item)"><button class="button button-glow button-rounded"><i class="fa" ng-class="{\'fa-home\': $first, \'fa-folder-open\': !$first}"></i>{{item.name}}</button></li>');
                        html.push('</ol>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('<div class="overflow-h" ui-layout-container i-scroll>');
                        html.push('<div style="position: absolute;">');
                        html.push('<div class="safe-map-select-boxs" ng-repeat="box in path.list" hm-tap="select(box)">');
                        html.push('<div class="box-image" ng-style="box" ng-show="box.type == \'map\'"><p style="position: absolute; left: 5px; bottom: 0px;">{{box.on || 0}}/{{(box.off + box.on) || 0}}</p></div>');
                        html.push('<div class="box-image" ng-show="box.type != \'map\'"><i class="fa fa-folder"></i><div class="text" ng-show="setting.showtext"><p>在线：{{box.on || 0}}</p><p>离线：{{box.off || 0}}</p></div></div>');
                        html.push('<div class="box-text">{{box.name}}</div>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</div>');

                        $element.html(html.join(''));
                        var link = $compile($element.contents());
                        link($scope);
                    }
                }
            }
        }
    }]);
});