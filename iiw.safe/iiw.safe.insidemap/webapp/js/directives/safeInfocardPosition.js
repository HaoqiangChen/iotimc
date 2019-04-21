/**
 * 信息牌-实到未到-模板
 *
 * @author - dwt
 * @date - 2016-09-18
 * @version - 0.1
 */
define([
    'app'
], function(app) {
    app.directive('safeInfocardPosition', [
        '$compile',
        'iAjax',
        'iMessage',

        function($compile, iAjax, iMessage) {

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

            return {
                restrict: 'A',
                template: getTemplate($.soa.getWebPath('iiw.safe.insidemap') + '/view/infocardPosition.html'),
                scope: {
                    code: '=icCode',
                    type: '=positionType'
                },
                compile: function() {
                    return {
                        post: function($scope, element, attrs) {
                            $scope.type = attrs.type;

                            $scope.$watch('type', function(type) {
                                getCriminalList(type);
                            });

                            $scope.back = function() {
                                $scope.$parent.area.cInfocard.state = 'A';
                            };

                            $scope.showCriminal = function(item) {
                                if(item.check == '1' && item.bm) {
                                    $scope.$emit('map.showCriminalYJT', item.bm);
                                } else {
                                    var message = {};
                                    message.level = 3;
                                    message.title = '罪犯一键通';
                                    message.content = '没有权限查看';
                                    iMessage.show(message, false, $scope);
                                }
                            };

                            function getCriminalList(type) {
                                $scope.criminalList = [];
                                if(type == 1) {
                                    $scope.typeName = '实到';
                                } else {
                                    $scope.typeName = '未到';
                                }
                                iAjax.postSync('security/map/map.do?action=getCriminalPositionDetail', {
                                    filter: {
                                        syoufk: $scope.code,
                                        sign: type ? type : 0
                                    }
                                }).then(function(data) {
                                    if(data.result.rows) {
                                        $scope.criminalList = data.result.rows;
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    ]);
});