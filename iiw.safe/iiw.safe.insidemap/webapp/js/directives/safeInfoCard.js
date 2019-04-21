/**
 * 信息牌
 *
 * Created by YJJ on 2015-12-25.
 */
define([
    'app',
    'cssloader!../../css/infocard.css'
], function (app) {
    app.directive('safeInfoCard', ['$compile', 'iAjax', 'iGetLang', 'iMessage', '$timeout', function ($compile, iAjax, iGetLang, iMessage, $timeout) {
        var _oDialect = {
            'PTN_C': iGetLang.get('PTN_C'),
            'PTN_P': iGetLang.get('PTN_P')
        };

        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function (data) {
                result = data;
            });

            return result;
        }

        return {
            restrict: 'EA',
            scope: {
                code: '=icCode',
                refreshNum: '=refreshNum',
                iTime: '=iTime'
            },
            template: getTemplate($.soa.getWebPath('iiw.safe.insidemap') + '/view/infocard.html'),
            compile: function (element, attrs) {
                if (attrs['scrolltoggle'] == 'NO') {
                    element.find('div[i-scroll]').removeAttr('i-scroll');
                }
                return {
                    pre: function ($scope, $element, attrs) {
                        var mouseTimer = null;

                        $scope.type = attrs.type;
                        $scope.showDetails = false;
                        $scope.dialect = _oDialect;

                        $scope.$watch('code', function () {
                            if ($scope.code) {
                                if ($scope.type == 'P') {
                                    getPoliceData($scope.code);
                                } else {
                                    //getPositionData($scope.code);
                                    getCriminalData($scope.code);
                                }
                            }
                        });

                        $scope.$watch('refreshNum', function (num) {
                            if (num && num > 0) {
                                if ($scope.type == 'P') {
                                    getPoliceData($scope.code);
                                } else {
                                    getCriminalData($scope.code);
                                }
                            }
                        });

                        $scope.showPolice = function (item) {
                            $scope.$emit('safeInfoCardPoliceEvent', item);
                        };

                        $scope.mouseover = function (item) {
                            if (mouseTimer) {
                                $timeout.cancel(mouseTimer);
                                $scope.$emit('safeInfoCardPoliceMouseover', item);
                            }
                        };

                        $scope.mouseleave = function () {
                            mouseTimer = $timeout(function () {
                                $scope.$emit('safeInfoCardPoliceMouseleave');
                            }, 24);
                        };

                        function getPoliceData(code) {
                            var time = $scope.iTime ? $scope.iTime.split(' ')[0] : '';
                            //var list = [];
                            $scope.plist = [];
                            //iAjax.post('security/common/monitor.do?action=getMapOuList', {filter: {cascade: 'Y'}}).then(function(data) {
                            //    if(data.result.rows) {
                            //        $.each(data.result.rows, function(i, o) {
                            //            if(o.syoufk == code) {
                            //                list = [
                            //                    {name: '设备在线数:', value: o.on, inputtype:'string'},
                            //                    {name: '设备离线数:', value: o.off, inputtype:'string'}
                            //                ]
                            //            } else {
                            //                list = [
                            //                    {name: '设备在线数:', value: 0, inputtype:'string'},
                            //                    {name: '设备离线数:', value: 0, inputtype:'string'}
                            //                ]
                            //            }
                            //        });
                            //    }
                            //});
                            iAjax.post('security/map/map.do?action=getPoliceTypeList', {
                                filter: {
                                    syoufk: code
                                    //cretime: time
                                }
                            }).then(function (data) {
                                if (data && data.result && data.result.rows && $scope.code == code) {

                                    _.each(data.result.rows, function (row) {
                                        if (row['dialect']) {
                                            row['name'] = (row['prefix'] + iGetLang.get(row['dialect']) + row['suffix']);
                                        }
                                    });

                                    var arr = _.filter(data.result.rows, function (row) {
                                        return !row.cascade;
                                    });
                                    //arr = arr.concat(list);
                                    $scope.plist = arr;
                                }
                            });
                        }

                        function getCriminalData(code) {
                            var time = $scope.iTime ? $scope.iTime.split(' ')[0] : '';

                            $scope.clist = [];
                            iAjax.post('security/map/map.do?action=getCriminalTypeList', {
                                filter: {
                                    syoufk: code
                                    //cretime: time
                                }
                            }).then(function (data) {
                       
                                if (data && data.result && data.result.rows && $scope.code == code) {
                                    var arr = _.filter(data.result.rows, function (row) {
                                        return !row.cascade;
                                    });
                                    $scope.clist = arr;
                                }
                            });
                        }

                        $scope.showCriminalList = function (type) {
                            $scope.showDetails = true;
                            getCriminalList(type);
                        };

                        $scope.showCriminalCount = function () {
                            $scope.showDetails = false;
                        };

                        $scope.showCriminal = function (item) {
                            if (item.check == '1' && item.bm) {
                                $scope.$emit('map.showCriminalYJT', item.bm);
                            } else {
                                var message = {};
                                message.level = 3;
                                message.title = "罪犯一键通";
                                message.content = "没有权限查看";
                                iMessage.show(message, false, $scope);
                            }
                        };

                        function getCriminalList(type) {
                            $scope.criminalList = [];
                            if (type == 1) {
                                $scope.typeName = "实到";
                            } else {
                                $scope.typeName = "未到";
                            }
                            iAjax.postSync('security/map/map.do?action=getCriminalPositionDetail', {
                                filter: {
                                    syoufk: $scope.code,
                                    sign: type
                                }
                            }).then(function (data) {
                                if (data.result.rows) {
                                    $scope.criminalList = data.result.rows;
                                }
                            });
                        }

                        //人员进出区域事件
                        $scope.$on("ws.positionHandle", function () {
                            getCriminalData($scope.code);
                            event.stopPropagation();
                        });

                    }
                }
            },
            link: function ($scope, $element, attrs) {

                //$scope.type = attrs.type;
                //$scope.showDetails = false;
                //$scope.dialect = _oDialect;
                //
                //$scope.$watch('code', function() {
                //    if($scope.code) {
                //        if($scope.type == 'P') {
                //            getPoliceData($scope.code);
                //        } else {
                //            //getPositionData($scope.code);
                //            getCriminalData($scope.code);
                //        }
                //    }
                //});
                //
                //$scope.$watch('refreshNum', function(num) {
                //    if(num && num > 0) {
                //        if($scope.type == 'P') {
                //            getPoliceData($scope.code);
                //        } else {
                //            getCriminalData($scope.code);
                //        }
                //    }
                //});
                //
                //$scope.showPolice = function(item) {
                //    $scope.$emit('safeInfoCardPoliceEvent', item);
                //};
                //
                //function getPoliceData(code) {
                //    var time = $scope.iTime ? $scope.iTime.split(' ')[0] : '';
                //
                //    $scope.plist = [];
                //    iAjax.post('security/map/map.do?action=getPoliceTypeList', {
                //        filter: {
                //            syoufk: code,
                //            cretime: time
                //        }
                //    }).then(function(data) {
                //        if(data && data.result && data.result.rows && $scope.code == code) {
                //
                //            _.each(data.result.rows, function(row) {
                //                if(row['dialect']) {
                //                    row['name'] = (row['prefix'] + iGetLang.get(row['dialect']) + row['suffix']);
                //                }
                //            });
                //
                //            var arr = _.filter(data.result.rows, function(row) {
                //                return !row.cascade;
                //            });
                //
                //            $scope.plist = arr;
                //        }
                //    });
                //}
                //
                //function getCriminalData(code) {
                //    var time = $scope.iTime ? $scope.iTime.split(' ')[0] : '';
                //
                //    $scope.clist = [];
                //    iAjax.post('security/map/map.do?action=getCriminalTypeList', {
                //        filter: {
                //            syoufk: code,
                //            cretime: time
                //        }
                //    }).then(function(data) {
                //        if(data && data.result && data.result.rows && $scope.code == code) {
                //            var arr = _.filter(data.result.rows, function(row) {
                //                return !row.cascade;
                //            });
                //            $scope.clist = arr;
                //        }
                //    });
                //}
                //
                //$scope.showCriminalList = function(type) {
                //    $scope.showDetails = true;
                //    getCriminalList(type);
                //};
                //
                //$scope.showCriminalCount = function() {
                //    $scope.showDetails = false;
                //};
                //
                //$scope.showCriminal = function(item) {
                //    if(item.check == '1' && item.bm) {
                //        $scope.$emit('map.showCriminalYJT', item.bm);
                //    } else {
                //        var message = {};
                //        message.level = 3;
                //        message.title = "罪犯一键通";
                //        message.content = "没有权限查看";
                //        iMessage.show(message, false, $scope);
                //    }
                //};
                //
                //function getCriminalList(type) {
                //    $scope.criminalList = [];
                //    if(type == 1) {
                //        $scope.typeName = "实到";
                //    } else {
                //        $scope.typeName = "未到";
                //    }
                //    iAjax.postSync('security/map/map.do?action=getCriminalPositionDetail', {
                //        filter: {
                //            syoufk: $scope.code,
                //            sign: type
                //        }
                //    }).then(function(data) {
                //        if(data.result.rows) {
                //            $scope.criminalList = data.result.rows;
                //        }
                //    });
                //}
                //
                ////人员进出区域事件
                //$scope.$on("ws.positionHandle", function() {
                //    getCriminalData($scope.code);
                //    event.stopPropagation();
                //});
            }
        }
    }]);
});