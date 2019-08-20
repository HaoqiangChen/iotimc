/**
 * 电视墙模式管理—添加
 *
 * Created by YBW on 2016-7-6
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/bigmonitortheme/css/index'
], function(app) {
    app.controller('bigmonitorthemeAddController', [
        '$scope',
        'iAjax',
        '$state',
        'iTimeNow',
        'iMessage',
        '$stateParams',
        '$element',
        function($scope, iAjax, $state, iTimeNow, iMessage, $stateParams,$element) {

            if(!$stateParams.data) {
                $state.go('system.bigmonitortheme');
            }

            $scope.generateModel = {
                chooce: '',
                row: 2,
                list: 2,
                input: false,
                animated: {},
                bigmonitorName: '',

                /**
                 * 保存序号
                 */
                saveTheme: function(data, $event) {

                    var temporary = $scope.generateModel.inputArry;
                    var index = data.$index;

                    if(!temporary[data.$parent.$index][index].change && !$event) {

                        temporary[data.$parent.$index][index].change = true;
                        $scope.generateModel.theme[data.$parent.$index][index] = temporary[data.$parent.$index][index].tem;

                    } else if(!temporary[data.$parent.$parent.$index][index].change && $event.keyCode == 13) {

                        temporary[data.$parent.$parent.$index][index].change = true;
                        $scope.generateModel.theme[data.$parent.$parent.$index][index] = temporary[data.$parent.$parent.$index][index].tem;
                    }
                },

                /**
                 * 更改序号
                 */
                updateTheme: function(data) {
                    $scope.generateModel.inputArry[data.$parent.$parent.$index][data.$index].tem = data.list;
                },

                /**
                 * 将序号改为输入状态
                 */
                inputCut: function(data) {
                    $scope.generateModel.inputArry[data.$parent.$parent.$index][data.$index].change = false;
                    setTimeout(function() {
                        $('.getOrder').select();
                    }, 10);
                },
                test: {
                    button: true,
                    theme: [],
                    begin: function() {
                        if(this.button) {
                            var theme = createTable($scope.generateModel.theme);
                            if(theme.error != 'error') {
                                orderRemind();
                                this.theme = theme;
                                this.button = !this.button;
                            } else {
                                orderRemind(theme);
                            }
                        } else {
                            this.button = !this.button;
                        }
                    }
                },

                /**
                 * 提交电视墙模式
                 */
                submit: function() {
                    var theme = createTable($scope.generateModel.theme);
                    if(theme.error != 'error') {
                        orderRemind();
                        try {
                            var content = JSON.parse($scope.generateModel.content);
                        } catch(e) {
                            console.log('error');
                        }
                        if(typeof content == 'object') {
                            var data = {
                                filter: {
                                    devicefk: $stateParams.data.bigmonitorId,
                                    code: $scope.generateModel.number,
                                    name: $scope.generateModel.name,
                                    theme: JSON.stringify($scope.generateModel.theme),
                                    modecontent: $scope.generateModel.content
                                }
                            };
                            if($stateParams.data.aperate == 'mod') {
                                data.filter.id = $stateParams.data.modObj.id;
                            }
                            iAjax.post('security/devicemonitor.do?action=updateBigMonitorTheme', data).then(function() {
                                remind(1, '提交成功！');
                                $scope.cancel();
                            }, function() {
                                remind(4, '网络连接失败！');
                            });
                        } else {
                            $scope.generateModel.animated.content = 'shake remind';
                            setTimeout(function() {
                                $scope.generateModel.animated.content = 'remind';
                            }, 1000)
                        }
                    } else {
                        orderRemind(theme);
                    }
                }
            };

            /**
             * 若是mod，初始化修改参数
             */
            $scope.init = function() {
                if($stateParams && $stateParams.data && $stateParams.data.aperate == 'mod') {
                    var modObj = $stateParams.data.modObj;
                    var generateModel = $scope.generateModel;
                    generateModel.content = modObj.modecontent;
                    generateModel.name = modObj.name;
                    generateModel.number = modObj.code;
                    generateModel.theme = modObj.theme;
                    generateModel.row = modObj.theme.length;
                    generateModel.list = modObj.theme[0].length;
                    initGenerate(generateModel);
                    generateModel.inputArry = newArray(generateModel.row, generateModel.list);
                    $.each(generateModel.theme, function(i, o) {
                        $.each(o, function(j, p) {
                            generateModel.inputArry[i][j] = {tem: p, change: true, preview: '', color: ''};
                        });
                    });
                }
            };
            $scope.init();

            /**
             * 提醒出错的序号
             * @param theme
             */
            function orderRemind(theme) {
                if(!theme) {
                    theme = {
                        value: 'complete'
                    };
                }
                $.each($scope.generateModel.theme, function(i, o) {
                    $.each(o, function(j, k) {
                        if(k == theme.value) {
                            $scope.generateModel.inputArry[i][j].color = 'animated shake remind2';
                            setTimeout(function() {
                                $scope.generateModel.inputArry[i][j].color = 'remind2';
                            }, 1000)

                        } else {
                            $scope.generateModel.inputArry[i][j].color = '';
                        }
                    });
                });
            }

            /**
             *  取消按钮
             */
            $scope.cancel = function() {
                $scope.$parent.title = '电视墙模式管理—列表';
                $state.go('system.bigmonitortheme');
                $scope.generateModel.name = '';
                $scope.generateModel.number = '';
                $scope.generateModel.content = '';
                $scope.generateModel.row = 2;
                $scope.generateModel.list = 2;
                $scope.generateMonitor();
                $scope.$parent.modelManage.getModelList($stateParams.data.bigmonitorId);
            };

            /**
             * 若是add,初始化模式
             */
            $scope.generateMonitor = function(data, $event) {
                var generateModel = $scope.generateModel;
                var row = generateModel.row;
                var list = generateModel.list;
                if($event && $event.clientX == 0) {
                    return false;
                }
                if(row == null || list == null) {
                    if(row === undefined || list === undefined) {
                        remind(3, '行和列不能超过99！');
                    } else {
                        remind(3, '行和列不能为空！');
                    }
                } else {
                    if(row < 1 || list < 1) {
                        remind(3, '行和列不能低于1！');
                    } else {
                        generateModel.theme = newArray(row, list);
                        generateModel.inputArry = newArray(row, list);
                        $.each(generateModel.inputArry, function(i, o) {
                            $.each(o, function(j, p) {
                                generateModel.inputArry[i][j] = {tem: p, change: true, preview: '', color: ''};
                            });
                        });
                        initGenerate(generateModel);
                    }
                }
            };

            if($stateParams.data && $stateParams.data.aperate == 'add') {
                $scope.generateMonitor();
            }

            /**
             *  弹出消息框
             */
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    level: level,
                    title: title || '消息提醒',
                    content: content
                };
                iMessage.show(message, false);
            }


            /**
             *  计算高宽和字体大小
             */
            function initGenerate(generateModel) {
                generateModel.width = 100 / generateModel.list;
                generateModel.height = 100 / generateModel.row;
                generateModel.fontSize = 100 / (generateModel.list * generateModel.row);
            }

            /**
             *  生成二维数组
             */
            function newArray(row, list) {

                var arr = [];
                for(var i = 0; i < row; i++) {
                    arr[i] = newOneBed(list, (i * list) + 1);
                }

                function newOneBed(list, number) {
                    var arr = [];
                    for(var i = 0; i < list; i++) {
                        arr[i] = number + i;
                    }
                    return arr;
                }

                return arr;
            }


            /**
             *  生成预览状态下的电视墙模式
             */
            function createTable(json) {
                var run = true,
                    row = 0,
                    col = 0,
                    obj = {},
                    result = [];

                while(run) {

                    var value = json[row][col];
                    if(!obj[value]) {

                        //生成需要的数据
                        obj[value] = {
                            col: 1,
                            row: 1,
                            left: 100 / json[0].length,
                            top: 100 / json.length,
                            index: col + 1,
                            style: {
                                height: 100 / json.length,
                                width: 100 / json[0].length
                            },
                            value: value,
                            indexRow: row,
                            indexLeft: col,
                            indexRight: col,
                            allNumber: 1
                        };

                    } else {

                        //相同序号则相应变化参数
                        var target = obj[value];
                        if(row == target.indexRow) {

                            target.col++;
                            target.style.width += target.left;
                            target.indexRight++;

                        } else {

                            target.row = row + 1;
                            target.style.height = target.top * (row - target.indexRow + 1);

                        }

                        target.allNumber++;


                        var height = (Math.ceil(target.allNumber / target.col) - 1);

                        //判断是否有不合法序号
                        if(
                            (row == target.indexRow && target.indexRight != col) ||
                            (row > target.indexRow && (col < target.indexLeft || col > target.indexRight || (target.indexRow + height) != row))
                        ) {
                            return {
                                error: 'error',
                                value: value
                            };

                        }


                    }

                    col++;
                    //控制循环
                    if(col >= json[row].length) {
                        col = 0;
                        row++;
                        if(row == json.length) {
                            run = false;
                        }
                    }

                }

                var record = [];
                //将对象转换为数组
                for(var i in obj) {

                    if((obj[i].allNumber % obj[i].col) != 0) {
                        return {
                            error: 'error',
                            value: obj[i].value
                        };

                    }

                    if(record[obj[i].indexRow] == undefined) {
                        record[obj[i].indexRow] = true;
                        result[obj[i].indexRow] = [];
                    }

                    result[obj[i].indexRow].push(obj[i]);
                }

                return result;
            }

            $scope.$on('bigmonitorthemeAddControllerOnEvent', function() {
                $scope.generateModel.bigmonitorName = $stateParams.data.bigmonitorName;
            });

            $element.on('keydown', function(e) {
                var keyCode = e.keyCode || e.which || e.charCode;
                var ctrlKey = e.ctrlKey || e.metaKey;
                if(ctrlKey && keyCode == 65) {
                    document.activeElement.select();
                }
            });
        }]);
});