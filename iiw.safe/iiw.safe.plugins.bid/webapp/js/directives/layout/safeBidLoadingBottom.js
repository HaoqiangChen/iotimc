define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidLoadingBottom', [function() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: '<div class="safe-bid-loading-2-bottom"></div>',
            link: function($scope, $element) {
                var t = $element.get(0),
                    e = echarts.init(t),
                    i = e.getZr(),
                    a = e.getWidth(),
                    c = e.getHeight(),
                    o = new echarts.graphic.Group;
                i.add(o);
                var n = 3;
                800 > a && (n = 2);

                $scope.$on('safe.bid.loading.2', function() {
                    draw();
                });

                $scope.$on('$destroy', function() {
                    if(e) {
                        e.dispose();
                        e = null;
                    }
                });

                function draw() {
                    for(var r = 0; 3 > r; r++) {
                        for(var s = [], l = 0; n + 1 >= l; l++) {
                            var h = c / 10 * r + c / 6,
                                d = Math.random() * c / 8 + h,
                                g = c - Math.random() * c / 8 - h,
                                m = [[2 * l * a / n / 2, r % 2 ? d : g], [(2 * l + 1) * a / n / 2, r % 2 ? g : d]];
                            s.push(m[0], m[1])
                        }
                        var u = new echarts.graphic.Polyline({
                                shape: {
                                    points: s,
                                    smooth: .4
                                },
                                style: {
                                    stroke: "#fff",
                                    opacity: 1 / (r + 1),
                                    lineWidth: 1.2 / (r + 1) + .8
                                },
                                silent: !0,
                                position: [-r * a / 8, 35 * -(r - .5)]
                            }),
                            y = new echarts.graphic.Rect({
                                shape: {
                                    x: 0,
                                    y: 0,
                                    width: 0,
                                    height: c
                                },
                                position: [r * a / 8, 0]
                            });
                        o.add(u);
                        y.animateTo({
                            shape: {
                                width: a
                            }
                        }, 2e3, 800 * Math.random());
                        u.setClipPath(y);
                        n += 1;
                    }
                }
            }
        }
    }]);
});