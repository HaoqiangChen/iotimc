define([
    'app',
    'cssloader!safe/plugins/bid/css/loading/1',
    'safe/plugins/bid/lib/gsap/TweenMax.min',
    'safe/plugins/bid/lib/gsap/TweenLite.min'
], function (app) {
    app.directive('safeBidLoading.0', ['iAjax', '$interval', '$timeout', function (iAjax, $interval, $timeout) {
        var _template = iAjax.getTemplate('iiw.safe.plugins.bid', '/view/layout/loading-layout-0.html');

        return {
            restrict: 'E',
            template: _template,
            replace: true,
            scope: true,
            link: function ($scope) {
                /*var value = 0,
                    target = null;

                $scope.sendMessage('safe.bid.loading.value', 20);

                 target = $interval(function() {
                 if(value < 100) {
                 if(value < $scope.layoutService.progress) {
                 $('.safe-bid-loading-1-content').text(++value + '%');
                 }
                 } else {
                 $('.safe-bid-menu').show();

                 $timeout(function() {
                 // $('.safe-bid-menu').show();

                 // $('.safe-bid-index').css('top', '0');

                 // $('.safe-bid-index-bg').show().addClass('animation');

                 $scope.sendMessage('safe.bid.loading.success');
                 }, 1000);

                 $interval.cancel(target);
                 }
                 }, 15);*/
                var preloaderArray = [];
                var timeFlag = null;
                var preloaderAnimationIn,
                    preloaderAnimationOut,
                    preloaderSplitText,
                    preloaderSplitTextWordTotal,
                    introAnimation,
                    preloaderAnimationInComplete = !1,
                    preloaderArray = [],
                    preloaderComplete = !1,
                    preloaderLoaded = 0,
                    preloaderTotal = 0,
                    isIntroDone = !1;

                function createPreloader() {
                    TweenMax.set("#safe-bid-loading-title", {
                        transformPerspective: 600,
                        perspective: 300,
                        transformStyle: "preserve-3d"
                    });
                    TweenMax.set("#safe-bid-loading-preloader-bar", {
                        scaleX: 0,
                        autoAlpha: 0,
                        transformOrigin: "center center"
                    });
                    TweenMax.set("#safe-bid-loading-preloader-bar-inner", {
                        scaleX: 0,
                        autoAlpha: 0,
                        transformOrigin: "center center"
                    });
                    changeTagline();
                    preloaderSplitText = new SplitText("#safe-bid-loading-title", {
                        type: "words"
                    });
                    preloaderSplitTextWordTotal = preloaderSplitText.words.length;
                    (preloaderAnimationIn = new TimelineMax({
                        paused: !0,
                        delay: .25,
                        onComplete: function () {
                            preloaderAnimationInComplete = !0,
                                startPreloader()
                        }
                    }));
                    preloaderAnimationIn.fromTo("#safe-bid-loading-preloader-inner", 1, {
                        autoAlpha: 0
                    }, {
                        autoAlpha: 1,
                        ease: Expo.easeOut
                    }, 1);
                    for (var a = 0; a < preloaderSplitTextWordTotal; a++)
                        preloaderAnimationIn.from(preloaderSplitText.words[a], 2, {
                            z: generateRandomNumber(-200, -50),
                            rotationX: 0,
                            autoAlpha: 0,
                            ease: Expo.easeOut
                        }, 1 + 1 * Math.random());
                    preloaderAnimationIn.fromTo("#safe-bid-loading-preloader-bar", 1, {
                        scaleX: .5,
                        autoAlpha: 0
                    }, {
                        scaleX: 1,
                        autoAlpha: 1,
                        ease: Expo.easeOut
                    }, 2);
                    /*TweenMax.staggerFromTo("#safe-bid-loading-title div", 3, {
                        color: "#FFFFFF"
                    }, {
                        color: "#FFFFFF",
                        delay: 6
                    }, .1);*/
                    preloaderAnimationIn.timeScale(1);
                    preloaderAnimationIn.play(0);
                }

                function changeTagline() {
                    $("#safe-bid-loading-title").html('');
                    $("#safe-bid-loading-title").html('司法部重新犯罪大数据监测分析平台');
                }

                function generateRandomNumber(e, a) {
                    return Math.floor(Math.random() * (a - e + 1)) + e;
                }

                function startPreloader() {
                    preloaderTotal = 10;
                    var i = 0;
                    timeFlag = window.setInterval(function () {
                        if (i + 1 > preloaderTotal) {
                            window.clearInterval(timeFlag);
                            timeFlag = null;
                        } else {
                            i++;
                            checkPreloader();
                        }
                    }, 200);
                    TweenMax.fromTo("#safe-bid-loading-preloader-bar-inner", 3, {
                        backgroundColor: "#25d053"
                    }, {
                        backgroundColor: "#25d053",
                        ease: Linear.easeNone
                    });

                    TweenMax.staggerTo("#safe-bid-loading-title div", 2, {
                        color: "#01defb",
                        immediateRender: !1,
                        ease: Linear.easeNone
                    }, .1);
                }

                function checkPreloader() {
                    var e = ++preloaderLoaded / preloaderTotal;
                    preloaderLoaded === preloaderTotal && (preloaderComplete = !0),
                        TweenMax.to("#safe-bid-loading-preloader-bar-inner", 1, {
                            scaleX: e,
                            autoAlpha: 1,
                            transformOrigin: "center center",
                            ease: Expo.easeOut,
                            onComplete: function () {
                                preloaderComplete && finishPreloader()
                            }
                        });
                }

                function finishPreloader() {
                    (preloaderAnimationOut = new TimelineMax({
                        paused: !0,
                        onComplete: function () {
                            //playIntro()
                        }
                    })).to("#safe-bid-loading-preloader-bar", 1, {
                        scaleX: 0,
                        autoAlpha: 0,
                        ease: Expo.easeIn,
                        immediateRender: !1,
                        transformOrigin: "center center"
                    }, 0),
                        preloaderAnimationOut.to("#safe-bid-loading-preloader-inner", 2, {
                            autoAlpha: 0
                        });
                    for (var e = 0; e < preloaderSplitTextWordTotal; e++)
                        preloaderAnimationOut.to(preloaderSplitText.words[e], 2, {
                            z: generateRandomNumber(-200, -50),
                            autoAlpha: 0,
                            immediateRender: !1,
                            ease: Expo.easeIn
                        }, 1 * Math.random());
                    preloaderAnimationOut.timeScale(1),
                        preloaderAnimationOut.play(0);


                    //$('.safe-bid-loading, .safe-bid-index').addClass('loadingAnimation');
                    $('.safe-bid-menu').show();
                    $timeout(function() {
                        //$('.safe-bid-loading-success').hide('fade', 1000);
                        $scope.sendMessage('safe.bid.loading.b.success');

                    }, 1000);

                    /*$('.safe-bid-menu').show();

                    $timeout(function () {
                        $scope.sendMessage('safe.bid.loading.success');
                    }, 1000);*/
                }

                createPreloader();
            }
        }
    }]);
});