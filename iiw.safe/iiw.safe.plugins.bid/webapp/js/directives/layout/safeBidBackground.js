define([
    'app'
], function(app) {
    app.directive('safeBidBackground', [function() {
        return {
            restrict: 'E',
            template: '<div class="safe-bid-index-bg"><div class="safe-bid-index-bg-static"></div><div class="safe-bid-index-bg-animation"></div></div>',
            replace: true,
            link: function($scope, $element) {
                var url = $.soa.getWebPath('iiw.safe.plugins.bid') + '/img/bg.mp4';

                $scope.$on('iiw.bid.switchAnimation', function(e, value) {
                    if(value) {
                        // 高画质
                        $element.find('.safe-bid-index-bg-animation').html('<video src="' + url + '" autoplay loop></video>');
                    } else {
                        // 低画质
                        $element.find('.safe-bid-index-bg-animation').html('');
                    }
                });
            }
        }
    }]);
});