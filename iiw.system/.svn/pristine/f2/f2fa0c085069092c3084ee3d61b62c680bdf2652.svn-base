/**
 * Created by ZJQ on 2015-10-21.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/syuser/css/index.css',
    'system/syuser/js/directives/exportExcel',
    'system/js/directives/systemTreeViewDirective'

], function (app, angularAMD) {
    var packageName = 'iiw.system.syuser';
    var m_scode;
    var syuserbject;

    app.controller('syuserController', [
        '$scope',
        '$rootScope',
        '$location',
        '$window',
        '$state',
        '$uibModal',
        '$timeout',
        'iAjax',
        'iMessage',
        'mainService',
        'iConfirm',
        'iToken',
        '$http',

        function($scope, $rootScope, $location, $window, $state, $uibModal, $timeout, iAjax, iMessage, mainService, iConfirm, iToken, $http) {
            $scope.title = '用户管理';
            $scope.currentPage = 1;
            $scope.totalPage = 1;
            $scope.pageSize = 10;
            mainService.moduleName = '系统基础设置';
            $scope.searchTitle = '';
            $scope.selectAll = false;

            var syoufk = '';
            var syouname = '';

            /**
             * 模块加载完成后事件
             *
             */
            $scope.$on('syuserControllerOnEvent', function() {
                init();
            });

            function init(){
                getUserInfo();
                getRoleInfo();
            }

            function getUserInfo(filterValue){
                var url,data;
                url = '/sys/web/syuser.do?action=getSyuserAll';
                data = {
                    filter: {
                        searchText: filterValue
                    },
                    params : {
                        pageNo : $scope.currentPage,
                        pageSize : $scope.pageSize
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function(data){
                        if(data.result && data.result.rows){
                            $scope.entityItem = data.result.rows;
                        }else{
                            $scope.entityItem=[];
                        }
                        if(data.result.params){
                            var params = data.result.params;
                            $scope.totalSize = params.totalSize;
                            $scope.pageSize = params.pageSize;
                            $scope.totalPage = params.totalPage;
                            $scope.currentPage = params.pageNo;
                        }
                    },
                    function(data){})
            }

            function getRoleInfo(){
                var url,data;
                url = '/sys/web/role.do?action=getSyroleAll';
                data = {
                    params : {
                        pageNo : '1',
                        pageSize : '150'
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function(data){
                        if(data.result && data.result.rows){
                            $scope.userRoleList = data.result.rows;
                        }else{
                            $scope.userRoleList=[];
                        }
                    },
                    function(data){})
            }

            $scope.getList = function() {
                $scope.searchText = this.searchTitle;
                getUserInfo($scope.searchText);
            };

            $scope.pageChanged = function(){
                $scope.currentPage = this.currentPage;
                getUserInfo();
            };

            $scope.add = function(){
                m_scode = null;
                $state.go('system.syuser.add');
            };

            $scope.mod = function(){
                var rows = _.where($scope.entityItem,{checked:true});
                if(rows.length > 0){
                    if(rows.length == 1){
                        m_scode = rows[0].id;

                        $state.go('system.syuser.mod');
                    }else{
                        var message = {};
                        message.id = new Date();
                        message.level = 3;
                        message.title = "用户修改";
                        message.content = "用户修改不能同时修改多条信息，请重新选择!";
                        iMessage.show(message,false,$scope);
                    }

                }else{
                    var message = {};
                    message.id = new Date();
                    message.level = 3;
                    message.title = "用户修改";
                    message.content = "请选择需要修改的一条用户信息!";
                    iMessage.show(message,false,$scope);
                }

            };

            $scope.del = function(){
                var aSelect = getAvailableSelect(),
                    aName = [];

                if(aSelect.length > 0) {

                    aName = aSelect.map(function(select, i) {
                        return ( i+1 + '、'+select.name);
                    });

                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '共选择'+aSelect.length+'条数据，分别为：<br>'+aName.join('<br>'),
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmDelUser'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    });

                }else {
                    var message = {};
                    message.level = 3;
                    message.title = $scope.title;
                    message.content = "请选择一条或以上状态不为【系统预设】的数据进行删除！";
                    iMessage.show(message, false);
                }
            };

            $scope.import = function() {
                $('#uploadFileExcle').click();
            };

            $scope.uploadExcleFile = function() {
                var form = new FormData();
                form.append('loadExcleFile', $('#uploadFileExcle')[0].files[0], $('#uploadFileExcle')[0].files[0].name);
                $http({
                    method: 'post',
                    url: iAjax.formatURL('security/information/information.do?action=setExcel&ptype=file&type=syuser'),
                    data: form,
                    enctype: 'multipart/form-data',
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    if(data.result && data.result.rows) {
                        var message = {};
                        message.level = 1;
                        message.title = $scope.title;
                        message.content = '导入成功!';
                        message.content = message.content + '成功数：' + data.result.rows.addSize + '失败数：' + data.result.rows.errorSize;
                        iMessage.show(message);
                        $('#uploadFileExcle')[0].value = '';
                        $scope.getList();
                    }
                })
                .error(function() {
                    var message = {};
                    message.level = 4;
                    message.title = $scope.title;
                    message.content = '导入失败!';
                    iMessage.show(message);
                })
            };

            $scope.export= function() {
                var url = iAjax.formatURL('security/information/information.do?action=writeSyuserMould&ptype=true');
                $scope.$broadcast('downExcel', url);
            };

            $scope.confirmDelUser = function(id){
                iConfirm.close(id);

                var aSelect = getAvailableSelect();

                var data = {id: []};
                $.each(aSelect, function(i, o){
                    data.id.push(o.id);
                });
                iAjax.post('sys/web/syuser.do?action=delSyuser', data).then(function(){
                    remind(1, '成功删除用户');
                    getUserInfo();
                }, function(){
                    remind(4, '网路连接失败');
                })
            }

            $scope.confirmClose = function(id){
                iConfirm.close(id);
            }


            function getAvailableSelect() {
                return _.filter($scope.entityItem, function(item) {
                    return item.checked && item.issys != 'Y';
                });
            }

            $scope.selAll = function()
            {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.entityItem,function(i,o){
                    o.checked = $scope.selectAll;
                });
            };

            $scope.selectOu = function(){
                if(syoufk == ""){
                    var message = {};
                    message.id = new Date();
                    message.level = 3;
                    message.title = "单位选择";
                    message.content = "请选择一个单位信息!";
                    iMessage.show(message,false,$scope);
                }else{
                    syuserbject.syouname = syouname;
                    syuserbject.syoufk = syoufk;

                    $('#syouTreeModel').removeClass('in');
                    $timeout(function(){$('#syouTreeModel').hide()},1000);
                }
            };

            $scope.cancel = function(){
                $('#syouTreeModel').removeClass('in');
                $timeout(function(){$('#syouTreeModel').hide()},1000);
            };

            /**
             * 树节点点击事件
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.selectEvent = function(treeNode)
            {
                syouname = treeNode.name;
                syoufk = treeNode.id;
            };

            $scope.keypresslist = function(event, searchTitle) {
                if(event.keyCode == 13) {
                    $scope.searchTitle = searchTitle;
                    $scope.getList();
                }
            };

            //$scope.$on('syuserControllerExitEvent', function() {
            //    console.log('syuserControllerExitEvent');
            //});

            $scope.$on('getUserInfoReList', function(){
                getUserInfo();
            });

            $scope.myimgsrc = $.soa.getWebPath(packageName) + '/img/logo.png';

            function remind(level, content, title){
                var message = {
                    id: new Date(),
                    level: level,
                    title: (title || '消息提醒'),
                    content: content
                };

                iMessage.show(message, false);
            }

        }
    ])
        .controller('syuserItemController', ['$scope',
            '$rootScope',
            '$location',
            '$state',
            'iAjax',
            'iMessage',

            function($scope, $rootScope, $location, $state, iAjax, iMessage) {

                var reg = '^([a-zA-z0-9]+){8,16}$';
                $scope.isexist = 0;
                $scope.pwdcheckfalg = 0;
                $scope.count = 1;
                $scope.isshow = true;
                $scope.entityUserItem = {};
                $scope.addressStatus = false;
                $scope.regPwd = '';
                var index = 0;

                if(m_scode){
                    init();
                }else{
                    $scope.entityUserItem = {
                        status : 'P',
                        islock : 'N',
                        isaddress : 'N',
                        pwd: ''
                    };

                    syuserbject = $scope.entityUserItem;
                }


                function init(){
                    var url,data;
                    url = '/sys/web/syuser.do?action=getSyuser';
                    data = {
                        row : {
                            id : m_scode
                        }
                    };
                    iAjax
                        .post(url, data)
                        .then(function(data){
                            if(data.result && data.result.rows){
                                if(!$scope.entityUserItem.photo) {
                                    $scope.entityUserItem.photo = '';
                                }
                                $scope.entityUserItem = data.result.rows[0];
                                $scope.entityUserItem.photo = data.result.rows[0].photo;
                                $scope.entityUserItem.syrole = data.result.rows[0].role[0].id;
                                if ($scope.entityUserItem.address.length) {
                                    index = $scope.entityUserItem.address.length;
                                } else {
                                    index = 1;
                                }
                                syuserbject = $scope.entityUserItem;
                                $scope.addressStatus = true;
                            }
                        })
                }


                /**
                 * 弹出单位框
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-22
                 */
                $scope.showOuTree = function(){
                    $('#syouTreeModel').show();
                    $('#syouTreeModel').addClass('in');

                    var url,data;
                    url = '/sys/web/syou.do?action=getSyouAll';
                    data = {};
                    iAjax
                        .post(url, data)
                        .then(function(data){
                            if(data.result.rows && data.result.rows.length > 0)
                            {
                                $scope.treeNodes = {
                                    zNodes : data.result.rows
                                };
                            }else
                            {
                                $scope.treeNodes = {
                                    zNodes : []
                                };
                            }

                            $rootScope.$broadcast('initTree',$scope.treeNodes);
                        },
                        function(data){})

                };

                $scope.showUpUserPhoto = function() {
                    $('#upUserPhoto').val('');
                    $('#upUserPhoto').click();
                };

                //选择用户图片
                $scope.changeUserPhoto = function() {
                    if(!/image\/\w+/.test($('#upUserPhoto')[0].files[0].type)) {//判断类型
                        sendMessage(3, '请确保选择的文件为图片类型!');
                        return false;
                    }
                    var reader = new FileReader();
                    reader.onload = function() {
                        $scope.entityUserItem.photo = reader.result;

                    };
                    reader.readAsDataURL($('#upUserPhoto')[0].files[0]);

                };

                $scope.addressBind = function(address){
                    if(address == 'Y' || address == 'Y' && index == 0){
                        index = 1;
                    }else{
                        index = 0;
                    }
                };

                $scope.addDress = function(){
                    var addDress = $('#addressInput');
                    if(m_scode != null){
                        index++;
                        addDress.append('<input type="text" ng-model="entityUserItem.isaddress'+ index + '" placeholder="输入绑定IP" class="form-control input-transparent" id="syuser_address'+ index +'" />')
                    }else{
                        $scope.count ++;
                        addDress.append('<input type="text" ng-model="entityUserItem.isaddress'+ $scope.count + '" placeholder="输入绑定IP" class="form-control input-transparent" id="syuser_address'+ $scope.count +'" />')
                    }
                };

                $scope.save = function(){

                    var url,data;

                    data = {
                        row : {
                            code : $scope.entityUserItem.code,
                            name : $scope.entityUserItem.name,
                            realname : $scope.entityUserItem.realname,
                            syoufk : $scope.entityUserItem.syoufk,
                            duty : $scope.entityUserItem.duty,
                            status : $scope.entityUserItem.status,
                            islock : $scope.entityUserItem.islock,
                            isaddress : $scope.entityUserItem.isaddress,
                            photo: $scope.entityUserItem.photo,
                            rows : [{
                                id :  $scope.entityUserItem.syrole
                            }]
                        }
                    };

                    var isaddressid = [];
                    if($scope.entityUserItem.isaddress == 'Y' && m_scode != null){
                        for(var i=1; i <= index; i++){
                            if($("#syuser_address"+ i).val() == ''){
                                isaddressid.splice(i,$("#syuser_address"+ i).val())
                            }else{
                                isaddressid.push($("#syuser_address"+ i).val());
                            }
                        }
                    }else{
                        for(var i=1; i <= $scope.count; i++){
                            if($("#syuser_address"+ i).val() == ''){
                                isaddressid.splice(i,$("#syuser_address"+ i).val())
                            }else{
                                isaddressid.push($("#syuser_address"+ i).val());
                            }
                        }
                    }
                    data.row.isaddressObj = isaddressid;
                    if(isaddressid.length == 0 && $scope.entityUserItem.isaddress == 'Y'){
                        data.row.isaddress = 'N';
                    }
                    if(m_scode){
                        data.row.id = m_scode;
                        if($scope.entityUserItem.pwd != null){
                            data.row.password = $scope.entityUserItem.pwd;
                        }
                        url = '/sys/web/syuser.do?action=upSyuser';
                    }else{
                        data.row.password = $scope.entityUserItem.pwd;
                        url = '/sys/web/syuser.do?action=addSyuser';
                    }
                    iAjax
                        .post(url, data)
                        .then(function(data){
                            if(data && data.message){
                                if(data.status == '1'){
                                    var message = {};
                                    message.id = new Date();
                                    message.level = 1;
                                    message.title = "用户管理";
                                    message.content = m_scode?"修改":"添加";
                                    message.content = message.content + "用户【" + $scope.entityUserItem.name + "】成功!";
                                    iMessage.show(message, false, $scope);
                                    $scope.$root.$broadcast('getUserInfoReList');
                                    $location.path('/system/syuser');
                                }
                            }
                        },
                        function(data){
                            if(data.status == 0){
                                sendMessage(4,'用户名称重复!')
                            }else{
                                sendMessage(4,'网络连接失败!')
                            }
                        })
                };

                $scope.back = function(){
                    $location.path('/system/syuser');
                };
                $scope.checkpwd = function(){
                    if($scope.entityUserItem.pwd) {
                        $scope.regPwd = $scope.entityUserItem.pwd.match(reg);
                        if($scope.entityUserItem.password3 != null){
                            if($scope.entityUserItem.pwd == $scope.entityUserItem.password3){
                                $scope.pwdcheckfalg = 0;
                            }else{
                                $scope.pwdcheckfalg = 1;
                            }
                        }
                    } else {
                        $scope.regPwd = '';
                        return;
                    }

                }

                function sendMessage(level,content){
                    var message = {};
                    message.title = $scope.title;
                    message.id = new Date();
                    message.level = level;
                    message.content = content;
                    iMessage.show(message,false);
                };
            }
        ]);

    // 模块内部路由
    angularAMD.config(function($stateProvider) {
        $stateProvider
        .state('system.syuser.add', {
            url: '/add',
            controller : 'syuserItemController',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        })
        .state('system.syuser.mod', {
            url: '/mod',
            controller : 'syuserItemController',
            templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
        });
    });
});