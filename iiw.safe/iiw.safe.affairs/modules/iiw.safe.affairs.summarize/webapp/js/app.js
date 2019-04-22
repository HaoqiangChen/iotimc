/**
 * 日常事务-执行反馈统计
 *
 * Created by YBX on 2019-10-14
 */
define([
    'app',
    'angularAMD',
    'cssloader!safe/affairs/summarize/css/index',
    'cssloader!sage/affairs/summarize/css/safeSummarizeUnusual'
], function (app, angularAMD) {
    var packageName = 'iiw.safe.affairs.summarize';

    app.controller('affairsSummarizeController', [
        '$scope',
        'iAjax',
        '$rootScope',
        '$state',
        'iTimeNow',
        '$filter',
        'iToken',
        function ($scope, iAjax, $rootScope, $state, iTimeNow, $filter, iToken) {
            $scope.summarize = {
                time: iTimeNow,
                syouname: '',  //单位名称
                syoufk: '',  //单位id
                undername:'',  //当前选择的下属单位名称
                underfk: '',  //当前选择的下属单位id
                underList: [],  //下属单位列表
                searchtime: $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd'),  //过滤日期
                affairsList: [],

                //获取当前单位信息
                getSyou: function(){
                    var url = '/sys/web/syuser.do?action=getSyuser';
                    iAjax.post(url).then(function (data) {
                        if(data && data.result.rows){
                            $scope.summarize.syouname = data.result.rows[0].syouname;
                            $scope.summarize.syoufk = data.result.rows[0].syoufk;
                            $scope.summarize.underfk = $scope.summarize.syoufk;  //加载时设置当前请求单位id为当前单位id
                            $scope.summarize.getList($scope.summarize.syoufk);  //获取下属单位列表
                            $scope.summarize.getUnderAffairs($scope.summarize.syoufk);  //加载获取本级单位事务
                        }
                    })
                },

                //获取当前单位的下属单位列表
                getList: function(unitId){
                    var url = 'http://192.168.11.42:8180/security/zjsuploading.do?action=getdw&authorization=' + iToken.get();
                    var data = {
                        filter: {
                            dwid: unitId
                        }
                    }
                    iAjax.post(url, data).then(function (data) {
                        if(data && data.result.rows){
                            $scope.summarize.underList = data.result.rows;
                        }
                    })
                },

                //返回日常事务管理
                goBack: function() {
                    $state.go('safe.affairs');
                },

                getUnusual: function() {
                    var fkid = $scope.summarize.underfk;
                    $state.go('safe.affairs.summarizeUnusual', { id : fkid});
                },

                //选择下属单位
                selectUnder: function () {
                    var underName = $scope.summarize.undername;
                    if(underName == $scope.summarize.syouname){
                        $scope.summarize.underfk = $scope.summarize.syoufk;
                        $scope.summarize.getUnderAffairs($scope.summarize.underfk);
                    } else {
                        $.each($scope.summarize.underList, function (index, data) {
                            if(underName == data.name){
                                $scope.summarize.underfk = data.id;
                                $scope.summarize.getUnderAffairs($scope.summarize.underfk);
                            }
                        })
                    }
                },

                //获取下属单位事务
                getUnderAffairs: function (underId) {
                    var underId = underId;
                    var searchTime = $scope.summarize.searchtime;
                    if(underId){
                        var url = 'http://192.168.11.42:8180/security/zjsuploading.do?action=getshiwu&authorization=' + iToken.get();
                        var data = {
                            filter: {
                                dwid: underId,
                                exedate: searchTime
                            }
                        }
                        iAjax.post(url, data).then(function (data) {
                            if(data && data.result.rows){
                                $scope.summarize.affairsList = data.result.rows;
                            }
                        })
                    }
                }
            }

            init();

            //加载方法
            function init() {
                $scope.summarize.getSyou();  //获取当前单位信息
            }
        }
    ])

    app.controller('affairsSummarizeUnusualController', [
        '$scope',
        '$state',
        '$stateParams',
        'iAjax',
        function ($scope, $state, $stateParams, iAjax) {
            $scope.unusual = {
                syoufk : '',
                affairsList: '',
                goBack: function(){
                    $state.go('safe.affairs.summarize');
                },

                getUnusualList: function () {
                    if($scope.unusual.syoufk != '' && $scope.unusual.syoufk.length != 0){
                        var url = 'http://192.168.11.42:8180/sys/web/Sydispatcher.do?action=getabnormal';
                        var data = {
                            filter: {
                                dwid: $scope.unusual.syoufk
                            }
                        }
                        iAjax.post(url, data).then(function (data) {
                            console.log(data);
                            if(data && data.result.rows){
                                $scope.unusual.affairsList = data.result.rows;
                            }
                        })
                    }
                }

            }

            init();

            function init() {
                $scope.unusual.syoufk = $stateParams.id;
                $scope.unusual.getUnusualList();
            }
        }
    ])

    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('safe.affairs.summarizeUnusual', {
                url: '/summarizeUnusual',
                templateUrl: $.soa.getWebPath(packageName) + '/view/unusual.html',
                controller: 'affairsSummarizeUnusualController',
                params: { id : null }
            })
    })
})