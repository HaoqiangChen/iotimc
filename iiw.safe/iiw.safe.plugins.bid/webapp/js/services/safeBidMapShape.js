/**
 * 地图图形管理接口。
 *
 * Created by zhs on 2018-03-09.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.factory('safeBidMapShape', ['$timeout', function($timeout) {
        function _bar(group, params, noAnimation) {
            if(group) {
                $.each(params.list, function(i, param) {
                    addBarShape(group, param, params.max);

                    if(!noAnimation) {
                        barAnimation(param);
                    }

                    param.showAnimation = function() {
                        barAnimation(param);
                    };

                    param.setColor = function(color) {
                        $.each(param.shapes, function(i, shape) {
                            shape.style.fill = color;
                        });
                    };

                    param.setText = function(text) {
                        param.shapes.top.style.text = text;
                    };

                    param.setSize = function(size) {
                        param.size = size;
                        param.height = parseInt(param.value / param.max * param.size * 10);

                        param.shapes.top.animateTo({
                            shape: {
                                points: getBarPoints('top', 'end', param)
                            }
                        }, 250);

                        param.shapes.bottom.animateTo({
                            shape: {
                                points: getBarPoints('bottom', 'end', param)
                            }
                        }, 250);

                        param.shapes.front.animateTo({
                            shape: {
                                points: getBarPoints('front', 'end', param)
                            }
                        }, 250);

                        param.shapes.right.animateTo({
                            shape: {
                                points: getBarPoints('right', 'end', param)
                            }
                        }, 250);
                    }
                });
            }
        }

        function addBarShape(group, param, max) {
            var front,
                right,
                top,
                bottom;

            param.size = param.size || 6;
            param.max = max;
            param.startColor = param.startColor || 'rgba(217, 83, 79, 0.75)';
            param.endColor = param.endColor || 'rgba(92, 184, 92, 0.75)';

            param.height = parseInt(param.value / max * param.size * 10);

            bottom = new echarts.graphic.Polygon({
                params: param,
                shape: {
                    points: getBarPoints('bottom', 'start', param)
                },
                style: {
                    fill: param.startColor,
                    shadowBlur: 3,
                    shadowOffsetX: 1,
                    shadowOffsetY: 1
                },
                zlevel: 100
            });

            top = new echarts.graphic.Polygon({
                params: param,
                shape: {
                    points: getBarPoints('top', 'start', param)
                },
                style: {
                    fill: param.startColor,
                    textFill: param.textFill || '#fff',
                    textPosition: 'top',
                    text: param.text || '',
                    textAlign: param.textAlign || 'left',
                    textFont: param.textFont || 'bolder 14px 微软雅黑'
                },
                zlevel: 101
            });

            front = new echarts.graphic.Polygon({
                params: param,
                shape: {
                    points: getBarPoints('front', 'start', param)
                },
                style: {
                    fill: param.startColor
                },
                zlevel: 100
            });

            right = new echarts.graphic.Polygon({
                params: param,
                shape: {
                    points: getBarPoints('right', 'start', param)
                },
                style: {
                    fill: param.startColor,
                    shadowBlur: param.size * 5,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0
                },
                zlevel: 100
            });

            group.add(bottom);
            group.add(top);
            group.add(front);
            group.add(right);

            param.shapes = {
                bottom: bottom,
                top: top,
                front: front,
                right: right
            };

        }

        function getBarPoints(pos, type, param) {
            var result = [];

            var x = param.x,
                y = param.y,
                size = param.size,
                height = param.height;

            switch(pos) {
            case 'bottom':
                result= [[x - size, y], [x + size, y], [x + size * 2, y - size / 2], [x, y - size / 2]];
                break;
            case 'top':
                if(type == 'start') {
                    result= [[x - size, y], [x + size, y], [x + size * 2, y - size / 2], [x, y - size / 2]];
                } else {
                    result= [[x - size, y - height], [x + size, y - height], [x + size * 2, y - size / 2 - height], [x, y - size / 2 - height]];
                }
                break;
            case 'front':
                if(type == 'start') {
                    result = [[x - size, y], [x + size, y], [x + size, y], [x - size, y]];
                } else {
                    result= [[x - size, y], [x + size, y], [x + size, y - height], [x - size, y - height]];
                }
                break;
            case 'right':
                if(type == 'start') {
                    result = [[x + size, y], [x + size * 2, y - size / 2], [x + size * 2, y - size / 2], [x + size, y]];
                } else {
                    result= [[x + size, y], [x + size * 2, y - size / 2], [x + size * 2, y - size / 2 - height], [x + size, y - height]];
                }
                break;
            }
            return result;
        }

        function barAnimation(param) {
            param.animationTime = param.animationTime || 2000;
            param.height = parseInt(param.value / param.max * param.size * 10);

            var front = param.shapes.front,
                right = param.shapes.right,
                top = param.shapes.top;

            front.animateTo({
                shape: {
                    points: getBarPoints('front', 'start', param)
                },
                style: {
                    fill: param.startColor
                }
            }, 10);

            right.animateTo({
                shape: {
                    points: getBarPoints('right', 'start', param)
                },
                style: {
                    fill: param.startColor
                }
            }, 10);

            top.animateTo({
                shape: {
                    points: getBarPoints('top', 'start', param)
                },
                style: {
                    fill: param.startColor
                }
            }, 10);

            if(param.barAnimationTarget) {
                $timeout.cancel(param.barAnimationTarget);
                param.barAnimationTarget = null;
            }
            param.barAnimationTarget = $timeout(function() {
                front.animateTo({
                    shape: {
                        points: getBarPoints('front', 'end', param)
                    },
                    style: {
                        fill: param.endColor
                    }
                }, param.animationTime);

                right.animateTo({
                    shape: {
                        points: getBarPoints('right', 'end', param)
                    },
                    style: {
                        fill: param.endColor
                    }
                }, param.animationTime);

                top.animateTo({
                    shape: {
                        points: getBarPoints('top', 'end', param)
                    },
                    style: {
                        fill: param.endColor
                    }
                }, param.animationTime);
            }, 100);
        }

        function _updateOption(option, name, key, value) {
            if(option[key]) {
                var selectIdx = _.findIndex(option[key], { name: name });
                if(selectIdx != -1) {
                    option[key][selectIdx] = value;
                } else {
                    option[key].push(value);
                }
            }
        }

        function _cleanSeriesData(option, name) {
            if(option.series) {
                var selectIdx = _.findIndex(option.series, { name: name });
                if(selectIdx != -1) {
                    option.series[selectIdx].data = [];
                }
            }
        }

        return {
            bar: _bar,
            updateOption: _updateOption,
            cleanSeriesData: _cleanSeriesData
        }
    }]);
});