/**
 * Created by hsw on 2016-03-26.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/commenting/css/index.css',
    'system/js/directives/systemRowCheckDirective',
    //'system/commenting/js/directives/errSrc',
    'system/js/directives/systemTreeViewDirective'

], function (app, angularAMD) {
    var packageName = 'iiw.system.commenting';
    app.controller('commentingController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        'mainService',
        'iMessage',
        'iConfirm',
        '$http',
        '$timeout',
        'iToken',
        '$rootScope',

        function ($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, $timeout, iToken, $rootScope) {

            mainService.moduleName = '评价管理';
            $scope.title = '评价管理';
            //$scope.modBtnFlag = true;
            //$scope.delBtnFlag = true;
            var count=0;
            $scope.role = {
                list: [],
                statusList: {'P': '启用', 'C': '禁用', 'L': '系统预设'}
            }

            $scope.commenting = {
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                searchKeyword: '',
                photo: false,
                save:{},
                selectAll:false
            }

            $scope.searchText={};
            $scope.ppevalList=[];
            $scope.cpevalList=[];
            $scope.pnevalList=[];
            $scope.cnevalList=[];

            var timeout = null;

            //var rip='&remoteip=192.168.8.251:8184';
            var rip = '';

            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('commentingControllerOnEvent', function () {
                $scope.getList();
                //$scope.getroleList();
            });

            /**
             * 查询当天巡更登记次数
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */

            $scope.getList = function () {
                var data = {
                    filter: {
                        searchText: $scope.commenting.searchKeyword ? $scope.commenting.searchKeyword : '%'
                    },
                    params: {
                        pageNo: $scope.commenting.currentPage,
                        pageSize: 10
                    }
                };
                //iAjax.post('/terminal/system.do?action=getSysPersoncommentingList&remoteip=192.168.8.251:8183', data).then(function (data) {
                iAjax.post('sys/web/role.do?action=getSyroleAll', data).then(function (data) {
                    if (data.result && data.result.rows) {
                        $scope.commentingList = data.result.rows;
                        $scope.commenting.currentPage = data.result.params.pageNo;
                        $scope.commenting.totalPage = data.result.params.totalPage;
                        $scope.commenting.totalSize = data.result.params.totalSize;
                        $scope.commenting.pageSize = data.result.params.pageSize;

                    } else {
                        $scope.commentingList = [];
                    }
                }, function () {
                    showMessage(4, '网络连接失败！')
                });
            };

            $scope.positiveeval= function (flag) {
                var temp={
                    content:'',
                    type:'positive',
                    details:[]
                }
                if(flag=='P'){
                    temp.peopletype='police';
                    $scope.ppevalList.push(temp);
                    if(!$('#demo1').hasClass('in')){
                        $('#demo1').collapse('toggle');
                    }
                }else{
                    temp.peopletype='criminal';
                    $scope.cpevalList.push(temp);
                    if(!$('#demo').hasClass('in')){
                        $('#demo').collapse('toggle');
                    }
                }


            }

            $scope.negativeeval= function (flag) {
                var temp={
                    content:'',
                    type:'negative',
                    details:[]
                }
                if(flag=='P'){
                    temp.peopletype='police';
                    $scope.pnevalList.push(temp);
                    if($('#demo1').hasClass('in')){
                        $('#demo1').collapse('toggle');
                    }
                }else{
                    temp.peopletype='criminal';
                    $scope.cnevalList.push(temp);
                    if($('#demo').hasClass('in')){
                        $('#demo').collapse('toggle');
                    }
                }


            }

            //$scope.check= function (e) {
            //
            //
            //}
            
            $scope.check= function (e) {
                if(e.target.nodeName=="INPUT"){
                    e.stopPropagation();
                }

                var target=e.target;
                if(target.nodeName!='DIV'){
                    target=$(target).parent();
                }else{
                    target=$(target);
                }
               if(target.children('i').hasClass('rotate')&&target.children('i').hasClass('back')){
                    target.children('i').removeClass('back');
                }else if (!target.children('i').hasClass('rotate')){
                    target.children('i').addClass('rotate');
                }else if(target.children('i').hasClass('rotate')){
                    target.children('i').addClass('back');
                }

            }

            $scope.adddtl= function (idx,key) {
                var temp={
                    score:'',
                    content:''
                }
                $scope[key][idx].details.push(temp);

            }
            
            //$scope.collapse= function () {
            //    $('#demo').removeClass('in')
            //}




            $scope.removeOu=function(rid,i,flag){
                if(rid){
                    iConfirm.show({
                        scope: $scope,
                        title: '删除',
                        content: '确定要删除选中的内容?',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmDelete'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    });
                    $scope.confirmClose = function (id) {
                        iConfirm.close(id);
                        return true;
                    };


                    $scope.confirmDelete = function (id) {
                        iConfirm.close(id);

                            var data = {
                                evaluationids:[rid]
                            };


                            //iAjax.post('/terminal/system.do?action=deleteAttach'+rip, data).then(function (data) {
                            iAjax.post('/security/collection.do?action=delEvaluation', data).then(function (data) {

                                if (data.status == '1') {
                                    showMessage(1, '删除成功！');
                                    if(flag=='CP'){
                                        $scope.cpevalList.splice(i,1);
                                    }else if(flag=='CN'){
                                        $scope.cnevalList.splice(i,1);
                                    }else if(flag=='PP'){
                                        $scope.ppevalList.splice(i,1);
                                    }else{
                                        $scope.pnevalList.splice(i,1);
                                    }
                                }
                            }, function () {
                                showMessage(4, '网络连接失败！')
                            });
                        }


                }else{
                    if(flag=='CP'){
                        $scope.cpevalList.splice(i,1);
                    }else if(flag=='CN'){
                        $scope.cnevalList.splice(i,1);
                    }else if(flag=='PP'){
                        $scope.ppevalList.splice(i,1);
                    }else{
                        $scope.pnevalList.splice(i,1);
                    }
                }
                //$scope.evalList.splice(i,1);
                //if(!count){
                //    showMessage(2, '删除评价内容需保存后生效!');
                //}
                //count++;
            }

            $scope.removedtl=function(row,i){
                if(row.details[i].id){
                    iConfirm.show({
                        scope: $scope,
                        title: '删除',
                        content: '确定要删除选中的内容?',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmDelete'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    });
                    $scope.confirmClose = function (id) {
                        iConfirm.close(id);
                        return true;
                    };


                    $scope.confirmDelete = function (id) {
                        iConfirm.close(id);

                        var data = {
                            evaluationdetailids:[row.details[i].id]
                        };


                        //iAjax.post('/terminal/system.do?action=deleteAttach'+rip, data).then(function (data) {
                        iAjax.post('/security/collection.do?action=delEvaluation', data).then(function (data) {

                            if (data.status == '1') {
                                showMessage(1, '删除成功！');
                                    row.details.splice(i,1);

                            }
                        }, function () {
                            showMessage(4, '网络连接失败！')
                        });
                    }
                }else{
                    row.details.splice(i,1);
                }
                //$scope.evalList.splice(i,1);
                //if(!count){
                //    showMessage(2, '删除评价内容需保存后生效!');
                //}
                //count++;
            }







            $scope.pageChange = function() {
                //$scope.commenting.currentPage = this.currentPage;

                $scope.getList();
            };

            $scope.$watch('commenting.searchKeyword', function () {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function () {
                    $scope.commenting.currentPage= 1;
                    $scope.getList();

                }, 500);
            });

            $scope.checkBtnFlag = function (data) {
                if (data) {
                    if (data.checked) {
                        data.checked = false;
                    } else {
                        data.checked = true;
                    }
                }
                var nodes = _.where($scope.commentingList, {checked: true});
                if( nodes.length == $scope.commentingList.length){
                    $scope.commenting.selectAll = true;
                } else {
                    $scope.commenting.selectAll = false;
                }
            };

            $scope.choosefile = function () {
                var chooseFileID = document.getElementById('chooseFileCatalogue');
                if(chooseFileID.value){
                    chooseFileID.value='';
                }
                $('#chooseFileCatalogue').click();
                if (!chooseFileID.onchange) {
                    chooseFileID.onchange = function () {
                        var file = chooseFileID.files[0];
                        //var reg = RegExp('\\.mp3|\\.wav|\\.wma|\\.ogg|\\.cda|\\.vqf|\\.ra|\\.mid|\\.ape|\\.flac|\\.aac|\\.amr$');
                        var reg = RegExp('\\.png|\\.jpg|\\.jpeg|\\.gif|\\.bmp$');

                        if (!reg.test(file.name)) {
                            showMessage(4, '请选择图片格式的文件！', '图片格式错误');
                            return false;
                        }
                        $scope.commenting.value = chooseFileID.value;
                        $scope.commenting.img = file.name;
                        //$scope.music.save.name = $scope.music.name.substring(0,$scope.music.name.lastIndexOf("."));
                        $scope.commenting.file = file;
                        //$scope.music.upload = true;
                        $scope.upload();
                    }
                }
            }



            $scope.add = function () {
                $scope.ppevalList=[];
                $scope.cpevalList=[];
                $scope.pnevalList=[];
                $scope.cnevalList=[];
                $scope.searchText={};
                var node = _.where($scope.commentingList, {checked: true});
                $scope.commenting.save={syrolefk: node[0].id,evaluations: []};

                if(!node.length||node.length>1){
                    showMessage(3, '请选择单条数据添加评价！');
                    return;
                }
                var data = {
                    filter: {
                            syrolefk:node[0].id

                    }
                };
                iAjax.post('/security/collection.do?action=getEvaluation', data).then(function (data) {
                    if (data.result && data.result.rows.length>0) {
                        $scope.commentingList = data.result.rows;
                        $.each( data.result.rows, function (i,o) {
                            if(o.peopletype=='criminal'){
                                if(o.type=='positive'){
                                    $scope.cpevalList.push(o);
                                }else{
                                    $scope.cnevalList.push(o);
                                }
                            }else{
                                if(o.type=='positive'){
                                    $scope.ppevalList.push(o);
                                }else{
                                    $scope.pnevalList.push(o);
                                }
                            }
                        })
                        $state.go('system.commenting.mod');
                        $scope.title = '评价管理—修改';

                    } else {
                        $state.go('system.commenting.add');
                        $scope.title = '评价管理—添加';
                    }
                }, function () {
                    showMessage(4, '网络连接失败！')
                });


                //$scope.positiveeval();

            };


            $scope.mod = function (row) {
                if (row) {
                    $scope.commenting.save=row;
                } else {
                    var node = _.where($scope.commentingList, {checked: true});
                    if(node.length==0||node.length>1){
                        showMessage(3, '请选择单条数据进行修改！');
                        return;
                    }
                    $scope.commenting.save=node[0];
                }
                $state.go('system.commenting.mod');
                $scope.title = '评价管理—修改';
            }

            $scope.share = function (row) {
                //if (row) {
                //    $scope.commenting.save=row;
                //} else {
                    var node = _.where($scope.commentingList, {checked: true});
                //    if(node.length==0||node.length>1){
                //        showMessage(3, '请选择单条数据进行修改！');
                //        return;
                //    }
                //    $scope.commenting.save=node[0];
                //}
                $scope.shareList = _.filter($scope.commentingList, function(num){
                    return num.id!=node[0].id;
                });
                $state.go('system.commenting.share');
                $scope.title = '评价管理—共享配置';
            }




            $scope.selAll = function () {
                $.each($scope.commentingList, function (i, o) {
                    o.checked = $scope.commenting.selectAll;
                });
            };

            $scope.submit= function () {
                $scope.commenting.save.evaluations=$scope.ppevalList.concat($scope.pnevalList).concat($scope.cpevalList).concat($scope.cnevalList)
                iAjax.post('/security/collection.do?action=updateEvaluation'+rip, $scope.commenting.save).then(function (data) {
                    if (data &&data.status=='1') {
                        $state.go('system.commenting');
                        showMessage(1, '提交成功！');
                        $scope.title = "评价管理";
                        $scope.getList();
                        $scope.commenting.selectAll = false;
                    }
                }, function () {
                    showMessage(4, '网络连接失败！');
                });
            }

            $scope.cancel = function () {
                $state.go('system.commenting');
                $scope.title = "评价管理";
                $scope.getList();
                $scope.commenting.selectAll = false;
            };


            //$scope.chooseRow = function () {
            //    $scope.checkBtnFlag();
            //};




            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.level = level;
                json.title = $scope.title;
                json.content = content;
                iMessage.show(json);
            }
        }]);

    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('system.commenting.add', {
                url: '/add',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            })
    });
    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('system.commenting.mod', {
                url: '/mod',
                templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
            })
    });
    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('system.commenting.share', {
                url: '/share',
                templateUrl: $.soa.getWebPath(packageName) + '/view/share.html'
            })
    });
});
