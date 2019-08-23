define([
    'app',
    'css!safe/plugins/bid/css/menu',
    'css!safe/plugins/bid/css/loading/1.css'
], function(app) {
    app.directive('safeBidMenu', ['$interval', '$timeout', 'iAjax', 'safeSound', function ($interval, $timeout, iAjax, safeSound) {
        return {
            restrict: 'E',
            template: iAjax.getTemplate('iiw.safe.plugins.bid', '/view/layout/menu-layout.html'),
            replace: true,
            link: function($scope, $element) {
                $scope.menus = [
                    {type: 'sjgx', icon: 'fa-database', name: '数据治理共享交换子平台', themeid: '6C771A599CA24115926F616FBFE75FBB', bottom: false},
                    {type: 'wjdc', icon: 'fa-edit', name: '重新犯罪结构化问卷调查子平台', themeid: '689D6CA815424FC1B2A8C8EAE814BC3A', bottom: false},
                    {type: 'fxyp', icon: 'fa-line-chart', name: '重新犯罪分析研判子平台', themeid: '421BA5574C954553AEC8B57F40463123', bottom: false}
                ];

                $scope.goModule = function(item) {
                    safeSound.playText(item.name);

                    $scope.sendMessage('safe.bid.chart.setvalue', {
                        type: item.type,
                        name: item.name
                    });

                    if(item.themeid) {
                        $scope.sendMessage('safe.bid.theme.reload', {
                            theme: {
                                id: item.themeid
                            }
                        });
                    } else {
                        $scope.sendMessage('safe.bid.theme.reload');
                    }

                };

                var isInit = false;

                $scope.go = function(type, name, e) {
                    switch(type) {
                        case 'sjgx':
                            $('.safe-bid-top-menu-panel').hide();
                            $scope.layoutService.modules.open('safe.bigdata');
                            $('.safe-bid-index').removeClass('hideAnimation').addClass('loadingAnimation');
                            $('.safe-bid-index-body-charts-panel').html('');
                            $('.safe-bid-view').hide();
                            $('.safe-bid-index-body-modlues').removeClass('animationShow').show().addClass('animationShow');
                            break;
                        case 'fxyp':
                            $scope.isHomePage = true;
                            $('.safe-bid-top-menu-panel').show();
                            //$scope.goModule($scope.menus[2]);
                            $scope.sendMessage('safe.bid.go.homepage');
                            $('.safe-bid-index').removeClass('hideAnimation').addClass('loadingAnimation');
                            $('.safe-bid-index-body-modlues').removeClass('animationShow animationHide').hide();
                            $('.safe-bid-index-body').removeClass('animationHide').addClass('animationShow').show();
                            break;
                        case 'wjdc':
                            /*$('.safe-bid-top-menu-panel').hide();
                            $scope.goModule($scope.menus[1]);
                            $('.safe-bid-index').removeClass('hideAnimation').addClass('loadingAnimation');
                            $('.safe-bid-index-body-modlues').removeClass('animationShow animationHide').hide();
                            $('.safe-bid-index-body').removeClass('animationHide').addClass('animationShow').show();*/

                            $('.safe-bid-top-menu-panel').hide();
                            $scope.layoutService.modules.open('safe.questionnaire');
                            $('.safe-bid-index').removeClass('hideAnimation').addClass('loadingAnimation');
                            $('.safe-bid-index-body-charts-panel').html('');
                            $('.safe-bid-view').hide();
                            $('.safe-bid-index-body-modlues').removeClass('animationShow').show().addClass('animationShow');
                            break;
                    }
                    e.stopPropagation();
                };

                $scope.$on('safe.bid.loading.b.success', function() {

                });

                $scope.$on('safe.bid.chart.show', function() {
                    $scope.goModule($scope.menus[2]);
                });

                function init() {
                    var url = 'security/recidivism/recidivism.do?action=getUserDwType';
                    iAjax.post(url).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.userMessageInfo = data.result.rows;
                            if(data.result.rows.type == 'JIANYU') {
                                $scope.isHomePage = true;
                                $('.safe-bid-top-menu-panel').show();
                                $scope.sendMessage('safe.bid.go.homepage', {params: data.result.rows});
                                $('.safe-bid-index').removeClass('hideAnimation').addClass('loadingAnimation');
                                $('.safe-bid-index-body-modlues').removeClass('animationShow animationHide').hide();
                                $('.safe-bid-index-body').removeClass('animationHide').addClass('animationShow').show();
                            }
                        }
                    });
                }

                init();
            }
        }
    }]);
});