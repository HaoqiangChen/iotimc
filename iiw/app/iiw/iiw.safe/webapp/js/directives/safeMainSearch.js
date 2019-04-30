/**
 * 全局搜索指令
 *
 * Created by YJJ on 2015-11-06.
 */
define(['app'], function(app) {
    app.directive('safeMainSearch', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        return {
            restrict: 'A',
            compile: function($element) {
                var timeTarget;

                $element.attr('safemainsearchelement', true);
                $element.find('*').attr('safemainsearchelement', true);

                $element.on('click mouseover', function(e) {
                    if(e.currentTarget == $element.get(0)) {
                        show();
                    }
                });

                $element.find('input').on('focus', function() {
                    if(timeTarget) $timeout.cancel(timeTarget);
                });

                $element.find('input').on('blur', function() {
                    if(timeTarget) $timeout.cancel(timeTarget);
                    timeTarget = $timeout(hide, 2000);
                });

                // $element.on('mouseout', function(e) {
                //     if(e.currentTarget == $element.get(0) && !$(e.relatedTarget).attr('safemainsearchelement')) {
                //         hide();
                //     }
                // });

                $element.find('input').on('keydown', function(e) {
                    if(e.keyCode == 13) {
                        submit();
                    }
                });


                $element.find('.safe-main-search-ico').on('click', function() {
                    submit();
                });

                function show() {
                    $element.stop(true).animate({
                        width: '190px'
                    }, 300, function() {
                        $element.find('.safe-main-search-input').show();
                        $element.find('.safe-main-search-input input').focus();
                    });
                }

                function hide() {
                    $element.find('.safe-main-search-input').hide();
                    $element.stop(true).animate({
                        width: '46px'
                    }, 300);
                }

                function submit() {
                    var v = $element.find('input')[1].value;
                    $rootScope.$broadcast('globalSearchEvent', v || '');
                }

                return {
                    post: function($scope) {
                        var storage = window.localStorage;
                        if(storage) {
                            try {
                                var list = storage.getItem('iiw.safe.globalSearchHistoryList');
                                if(list) {
                                    list = JSON.parse(list);
                                } else {
                                    list = [];
                                }

                                $scope.globalSearchHistoryList = list;

                                $scope.$on('globalSearchEvent', function(event, value) {
                                    if(value && $.inArray(value, list) == -1) {
                                        list = [value].concat(list);

                                        if(list.length > 50) {
                                            list = list.slice(0, 50);
                                        }

                                        $scope.globalSearchHistoryList = list;

                                        storage.setItem('iiw.safe.globalSearchHistoryList', JSON.stringify(list));
                                    }
                                });
                            } catch(e) {
                                // 避免从localStorage获取的数据被改动导致无法被程序正确加载而出错。
                            }
                        }
                    }
                }
            }
        }
    }]);
});