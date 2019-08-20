/**
 * Created by GDJ on 2015-10-21.
 *  时间选择插件
 */
define(['app'], function(app) {
    var html = '<div class="time-picker" ng-click="showTimePicker($event)">' +
        '<div class="time-picker-selector">' +
        '<div class="time-container"><div ng-click="preTime($event, \'TH\')" class="time-select fa fa-sort-asc"></div><div class="time-input"><input /></div><div ng-click="nextTime($event, \'TH\')" class="time-select fa fa-sort-desc"></div></div>' +
        '<div class="time-container"><div ng-click="preTime($event, \'H\')" class="time-select fa fa-sort-asc"></div><div class="time-input"><input /></div><div ng-click="nextTime($event, \'H\')" class="time-select fa fa-sort-desc"></div></div>' +
        '<div class="time-container dot">:</div>' +
        '<div class="time-container"><div ng-click="preTime($event, \'M\')" class="time-select fa fa-sort-asc"></div><div class="time-input"><input /></div><div ng-click="nextTime($event, \'M\')" class="time-select fa fa-sort-desc"></div></div>' +
        '<div class="time-container"><div ng-click="preTime($event, \'S\')" class="time-select fa fa-sort-asc"></div><div class="time-input"><input /></div><div ng-click="nextTime($event, \'S\')" class="time-select fa fa-sort-desc"></div></div>' +
        '</div>' +
        '</div>';

    function getScopeStr(astr) {
        return astr.match(/([a-z]|[A-Z]|\d)+/g);
    }

    function getScopeVal(str) {
        return str.match(/\d/g);
    }

    app.directive('iTimePicker', ['$compile', function($compile) {
        return {
            restrict: 'EAC',
            template: html,
            /*require: 'pTime',*/
            scope: false,
            replace: true,
            link: function(scope, $ele, attr) {

                $ele.append($compile('<div class="time-picker-show"><input ng-model="' + attr.pTime + '" disabled /></div>')(scope)); //动态管理ng-model
                $ele.data({'scope': scope, pTime: attr.pTime});
                var $timePick = $ele.find('>.time-picker-selector'),
                    $timePickShow = $ele.find('>.time-picker-show');

                function getValInShow($ele) {
                    var vals = $ele.find('.time-input input');
                    if (vals && vals.length == 4) {
                        return vals[0].value;
                    }
                    return null;
                }

                $ele.bind('click', function(e) {
                    e.stopPropagation();
                });

                $timePickShow.bind('click', function($event) {
                    $event.stopPropagation();
                    $timePick.addClass('show');
                    var val = $timePickShow.find('input').val(),
                        inputs = $timePick.find('.time-input input');

                    if (val) {
                        var vals = getScopeVal(val);
                        if (vals && vals.length == 4) {
                            $.each(inputs, function(i, input) {
                                $(input).val(vals[i]);
                            });
                        }
                    }

                    $ele.closest('div[ui-view]').one('click', function() {
                        var $parentNode = $timePick,
                            id = '';
                        if ($parentNode) {
                            $parentNode.removeClass('show');
                        }
                        var inputs = $timePick.find('.time-input input');
                        var val = $(inputs[0]).val() + $(inputs[1]).val() + ':' + $(inputs[2]).val() + $(inputs[3]).val();
                        var scope = $ele.data('scope');
                        var strs = getScopeStr($ele.data('pTime'));
                        if (strs.length > 1) { // 最多支持两层
                            scope[strs[0]][strs[1]] = val;
                            id = scope[strs[0]]['id'];
                        }
                        else {
                            scope[strs[0]] = val;
                            id = scope['id'];
                        }

                        scope.$emit('time-change-event', {id: id, val: val, type: strs[1] || strs[0]}, $timePick);
                    });
                });

                scope.preTime = function($event, type) {
                    var $self = $($event.target),
                        $timeInput = $self.find('~ .time-input input'),
                        timeVal = '';

                    if (type == 'H') {
                        var tH = getValInShow($self.closest('.time-picker'), 0);
                        if (tH == '2') {
                            timeVal = shiftNum('MH', 'A', $timeInput);
                        }
                        else {
                            timeVal = shiftNum(type, 'A', $timeInput);
                        }
                    }
                    else {
                        timeVal = shiftNum(type, 'A', $timeInput);
                    }

                    $timeInput.val(timeVal);
                    $event.stopPropagation();
                }

                scope.nextTime = function($event, type) {
                    var $self = $($event.target),
                        $timeInput = $self.siblings('.time-input').find('input'),
                        timeVal = '';

                    if (type == 'H') {
                        var tH = getValInShow($self.closest('.time-picker'), 0);
                        if (tH == '2') {
                            timeVal = shiftNum('MH', 'D', $timeInput);
                        }
                        else {
                            timeVal = shiftNum(type, 'D', $timeInput);
                        }
                    }
                    else {
                        timeVal = shiftNum(type, 'D', $timeInput);
                    }

                    $timeInput.val(timeVal);
                    $event.stopPropagation();
                }

                function shiftNum(type, numType, $obj) {
                    var fn = function() {
                        },
                        val = $obj.val();

                    switch (type) {
                        case 'TH' :
                            fn = function(numType) { //小时
                                switch (numType) {
                                    case 'A' :
                                        if (val == 2) {
                                            val = 0;
                                        }
                                        else {
                                            val++;
                                        }
                                        break;
                                    case 'D' :
                                        if (val == 0) {
                                            val = 2;
                                        }
                                        else {
                                            val--;
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'MH' :
                            fn = function(numType) {
                                switch (numType) {
                                    case 'A' :
                                        if (val >= 4) {
                                            val = 0;
                                        }
                                        else {
                                            val++;
                                        }
                                        break;
                                    case 'D' :
                                        if (val == 0 || val > 4) {
                                            val = 4;
                                        }
                                        else {
                                            val--;
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'H' :
                            fn = function(numType) {
                                switch (numType) {
                                    case 'A' :
                                        if (val == 9) {
                                            val = 0;
                                        }
                                        else {
                                            val++;
                                        }
                                        break;
                                    case 'D' :
                                        if (val == 0) {
                                            val = 9;
                                        }
                                        else {
                                            val--;
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'M' :
                            fn = function(numType) {
                                switch (numType) {
                                    case 'A' :
                                        if (val == 5) {
                                            val = 0;
                                        }
                                        else {
                                            val++;
                                        }
                                        break;
                                    case 'D' :
                                        if (val == 0) {
                                            val = 5;
                                        }
                                        else {
                                            val--;
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'S' :
                            fn = function(numType) {
                                switch (numType) {
                                    case 'A' :
                                        if (val == 9) {
                                            val = 0;
                                        }
                                        else {
                                            val++;
                                        }
                                        break;
                                    case 'D' :
                                        if (val == 0) {
                                            val = 9;
                                        }
                                        else {
                                            val--;
                                        }
                                        break;
                                }
                            }
                            break;
                    }
                    fn.call(this, numType);
                    return val;
                }
            }
        }
    }]);
});
