/**
 * 文本编辑显示框指令
 * Created by gdj on 2015-11-24.
 */
define(['app'], function(app) {
    app.directive('doorSettingInputClick', ['$compile', '$timeout',
        function($compile) {
            return {
                restrict: 'A',
                link: function(scope, $element, attr) {
                    $element.addClass('ds-input');
                    var modelName = attr['doorSettingInputClick'],
                        input = '<input class="input-content" type="text" class="form-control" ng-model="' + modelName + '">',
                        title = '<div class="input-title">{{' + modelName + '}}</div>',
                        text = $element.text();

                    var inputObj = $compile(input)(scope),
                        titleObj = $compile(title)(scope);
                    scope[modelName] = text;

                    $element.html(inputObj).append(titleObj);
                    $element.bind('click', function(e) {
                        e.stopPropagation();
                        show();
                        $(document).one('click', function() {
                            hide();
                        });
                    }).bind('keypress', function(e) {
                        if (e.keyCode == 13) {
                            hide();
                        }
                    });

                    function show() {
                        inputObj.addClass('show').focus();
                        titleObj.css('display', 'none');
                    }

                    function hide() {
                        inputObj.removeClass('show');
                        titleObj.css('display', 'block');
                        scope.$emit('ds-input-event', $element);
                    }
                }
            };
        }
    ]);
});