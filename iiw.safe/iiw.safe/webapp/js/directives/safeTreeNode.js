/**
 * 简单属性控件节点指令
 *
 * Created by YJJ on 2016-08-09.
 */
define([
    'app'
], function(app) {
    function getTemplate(url) {
        var result = '';

        $.ajax({
            url: url,
            async: false,
            cache: false,
            dataType: 'text'
        }).success(function(data) {
            result = data;
        });

        return result;
    }

    var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/treeview.html');

    app.directive('safeTreeNode', ['$compile', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: _template,
            link: function($scope, $element) {
                var node = $scope.node;

                if(!node.__init) {
                    var el = $element.find('>.safe-tree-child');
                    el.html('<safe-tree-node ng-repeat="node in node.treeNodes | orderBy: [\'tree_index\', \'name\']"></safe-tree-node>');
                    $compile(el)($scope);
                    node.__init = true;
                }

                if(node.__isopen && !node.treeNodes) {
                    node.treeNodes = $scope.getChildNodes(node.id);
                }

                $element.find('>.safe-tree-node div[data-ripple]').ripple();
            }
        }
    }]);
});