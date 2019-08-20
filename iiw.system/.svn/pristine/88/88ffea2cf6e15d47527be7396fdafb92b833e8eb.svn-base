/**
 * Created by ZJQ on 2015-10-21.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/unity3dsetting/css/index.css',
    'cssloader!system/unity3dsetting/css/unity3d.css',
    'system/unity3dsetting/js/directives/unity',
    'system/unity3dsetting/js/service/unityinit',
    'system/unity3dsetting/js/service/unityedit',
    'system/js/directives/systemTreeViewDirective'

], function (app, angularAMD) {
    var packageName = 'iiw.system.unity3dsetting';
    var m_scode;

    app.controller('unity3dsettingController', ['$scope',
        '$rootScope',
        '$location',
        '$state',
        '$timeout',
        '$filter',
        '$window',
        'iAjax',
        'iMessage',
        'mainService',
        'unityEdit',
        '$http',
        'iToken',
        'iConfirm',

        function($scope, $rootScope, $location, $state, $timeout, $filter, $window, iAjax, iMessage, mainService, unityEdit, $http, iToken, iConfirm) {
            $scope.title = '三维模型管理';
            mainService.moduleName = '三维模型管理';

            $scope.url = $.soa.getWebPath(packageName);
            $scope.pathurl = $.soa.getPath(packageName);
            $scope.hasInit = false;
            $scope.select = false;
            $scope.fileload = false;
            $scope.loadFileStatus = false;
            $scope.repeatModel = '';
            $scope.searchText = '';
            $scope.syoufk = null;
            $scope.mapList = [];
            $scope.deviceMonitorList = [];
            $scope.unity3dsetting = {
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                searchText: '',

                change: function(){
                    getDeviceMonitorList();
                },
                //loadFile: function(id){
                //    $('#export3DModel').val('');
                //    $('#export3DModel').click();
                //    iConfirm.close(id);
                //    $scope.fileload = true;
                //},
                confirmClose: function(){
                    $rootScope.$broadcast('hideCameraListEvent');
                    $scope.fileload = false;
                    return true;
                },
                confirmCancel : function(id) {
                    //$rootScope.$broadcast('hideCameraListEvent');
                    //$scope.fileload = false;
                    iConfirm.close(id);
                },
                export3DModel:function(file){
                    var url = iAjax.formatURL('/security/interunity.do?action=uploadInterunity&ptype=true&module=model&syouid=' + $scope.syoufk +'');
                    var form = new FormData();
                    form.append('modelFile',file.files[0],file.files[0].name);
                    $scope.loadFileStatus = true;
                    $scope.fileload = true;
                    $http({
                        method:'post',
                        url: url,
                        data: form,
                        headers:{
                            'Content-Type' : undefined
                        }
                    }).success(function(data){
                        if(data.status == '1'){
                            showMessage("模型上传成功!",1);
                            getMapList();
                            $scope.loadFileStatus = false;
                            //$scope.fileload = false;
                            $rootScope.$broadcast('hideCameraListEvent');
                        }else{
                            showMessage("模型上传失败!",4);
                            $scope.loadFileStatus = false;
                            $rootScope.$broadcast('hideCameraListEvent');
                        }
                    })
                },
                showOuList: function() {
                    $scope.fileload = true;
                },
                exportModel : function (syoufk) {
                    $scope.syoufk = syoufk;
                    $('#export3DModel').val('');
                    $('#export3DModel').click();
                    $scope.fileload = true;
                //    var data ={
                //        filter: {
                //            syouid: syoufk
                //        }
                //    };
                //    iAjax
                //        .post('/security/interunity.do?action=testingInterunity', data)
                //        .then(function (data) {
                //            if(data.status == 1){
                //                iConfirm.show({
                //                    scope: $scope,
                //                    title: '三维模型管理',
                //                    content: '此单位并未上传模型,是否要上传模型文件?',
                //                    buttons: [{
                //                        text: '确认',
                //                        style: 'button-primary',
                //                        action: 'unity3dsetting.loadFile'
                //                    }, {
                //                        text: '取消',
                //                        style: 'button-caution',
                //                        action: 'unity3dsetting.confirmCancel'
                //                    }]
                //                });
                //            }
                //        }, function() {
                //            $rootScope.$broadcast('showCameraListEvent');
                //            iConfirm.show({
                //                scope: $scope,
                //                title: '三维模型管理',
                //                content: '当前用户已有模型文件，是否要对此模型进行更新?',
                //                buttons: [{
                //                    text: '确认',
                //                    style: 'button-primary',
                //                    action: 'unity3dsetting.loadFile'
                //                }, {
                //                    text: '取消',
                //                    style: 'button-caution',
                //                    action: 'unity3dsetting.confirmCancel'
                //                }]
                //            });
                //        })
                }
            };

            var m_oPositionByCamera = {};
            var m_oJSON;
            var m_scode;
            var m_otreeNode = "";
            var m_oSyouObject = "";
            var m_oCameraObject = "";

            $scope.uploadModel = function() {
                $scope.fileload = true;
            };

            init();

            /**
             *
             * 初始化三维模型参数
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-23
             *
             */
            $scope.unityModel = {
                'beginload' : true,
                //'url' : $scope.pathurl + '/model.do?' + $scope.syoufk,
                'url' : iAjax.formatURL('model.do?').split('?')[0] + '?' + $scope.syoufk,
                'logourl' : $scope.url + '/img/logo.png',
                'unityurl' : $scope.url + '/img/unity.png',
                show : true
            }

            $scope.unity = {
                unity : {
                    show : true,
                    syoufk : $scope.syoufk
                },

                rightAare : {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : true,
                    positionContainer : false
                },

                rightAreaCamera : {
                    manager : true,
                    add : false,
                    position : false
                },

                rightAreaArea : {
                    manager : false,
                    add : false
                },

                rightAreaPosition : {
                    position : false
                },

                rightTopTitle : '监控管理'
            }

            function init(){
                getUserInfo();
                getSyouInfo();
                getCameraInfo();
                //checkModel();
                getMapList();
            }

            function getUserInfo(){
                var url,data;
                url = '/security/common/monitor.do?action=getSyouDetail';
                data = {};

                iAjax
                    .postSync(url, data)
                    .then(function(data){
                        if(data.result && data.result.rows){
                            var oRows = data.result.rows;
                            $scope.syoufk = oRows[0].id;
                            $scope.syouname =oRows[0].syouname;
                        }else{
                            showMessage("单位数据查询失败，请检查用户权限是否配置正确!", 4);
                        }
                    },
                    function(data){})
            }

            function getSyouInfo(){
                var url,data;
                url = '/sys/web/syou.do?action=getSyouAll';
                data = {};

                iAjax
                    .post(url, data)
                    .then(function(data){
                        if (data.result.rows && data.result.rows.length > 0) {
                            m_oSyouObject = data.result.rows;
                        }else{
                            m_oSyouObject = [];
                        }
                    });
            }

            function getMapList() {
                //var data = {
                //    filter: {
                //        cascade: "Y"
                //    }
                //};
                iAjax
                    .post('security/information/information.do?action=getSyou')
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $.each(data.result.rows, function(i, o) {
                                iAjax
                                    .post('security/interunity.do?action=testingInterunity', {filter: {syouid: o.id}})
                                    .then(function(data) {
                                        if(data.status == 1) {
                                            o.existModel = true;
                                        }
                                    }, function() {
                                        o.existModel = false;
                                    })
                            });
                            //var list = _.where(data.result.rows, {type: 'ou'});
                            $.each(data.result.rows, function(i, item) {
                                item.style = {
                                    'background-image': 'url(' + iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + (item.savepath) + ')',
                                    'background-size': 'contain',
                                    'background-position': 'center center',
                                    'background-repeat': 'no-repeat'
                                };
                            });
                            $scope.mapList = data.result.rows;
                        }
                    })
            }

            function getCameraInfo(){
                var url,data;
                url = 'security/device.do?action=getDeviceMapOuList';
                data = {};

                iAjax
                    .post(url, data)
                    .then(function(data){
                        if(data.result.rows && data.result.rows.length > 0){
                            m_oCameraObject = data.result.rows;

                            if(m_oCameraObject) {
                                $scope.treeNodes = {
                                    zNodes: m_oCameraObject
                                };
                                $rootScope.$broadcast('initTree', $scope.treeNodes);
                            }
                        }else{
                            m_oCameraObject = [];
                        }
                    },
                    function(data){})
            }

            function unityEnter(){
                if($scope.hasInit) {
                    $timeout(function() {
                        $scope.unityModel.beginload = true;
                    }, 1000);
                }
            }

            //function checkModel(){
            //    var data ={
            //        remoteip: '192.168.1.15',
            //        filter: {
            //            syouid: null
            //        }
            //    };
            //    iAjax
            //        .post('/security/interunity.do?action=testingInterunity', data)
            //        .then(function (data) {
            //            if(data.status == 0){
            //                $scope.repeatModel = 0;
            //            }else if(data.status == 1){
            //                $scope.repeatModel = 1;
            //            }
            //        })
            //}

            /**
             * 模块加载完成后事件
             *
             */
            $scope.$on('unity3dsettingControllerOnEvent', function() {
                $scope.hasInit = true;
                unityEnter();
            });
            /* ----三维模型初始化完成------ */

            $scope.cameraManger = function(){
                $scope.fileload = false;
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : true,
                    positionContainer : false
                };
                $scope.unity.rightAreaCamera = {
                    manager : true,
                    add : false,
                    position : false
                };

                $scope.unity.rightTopTitle = '监控管理';
            };

            $scope.areaManger = function(){
                $scope.fileload = false;
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : true,
                    cameraContainer : false,
                    positionContainer : false
                };

                $scope.unity.rightAreaArea = {
                    manager : true,
                    add : false
                };

                $scope.unity.rightTopTitle = '新增区域';
            };

            $scope.addCamera = function(){
                unityEdit.addCamera();
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : true,
                    positionContainer : false
                };

                $scope.unity.rightAreaCamera = {
                    manager : false,
                    add : true,
                    position : false
                }
            };

            $scope.addArea = function(){
                unityEdit.addArea();

                $scope.unity.rightAreaArea = {
                    manager : false,
                    add : true
                }
            };

            $scope.updatePosition = function(){
                unityEdit.getPersonPosition('2');
            };

            $scope.testPosition = function(){
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : false,
                    positionContainer : true
                };
                $scope.unity.rightAreaPosition = {
                    position : true
                };

                if(m_oCameraObject){
                    $scope.treeNodes = {
                        zNodes : m_oCameraObject
                    };
                    $timeout(function(){
                        $rootScope.$broadcast('initTree',$scope.treeNodes);
                    })
                }else{
                    getCameraInfo();
                }
            };

            $scope.gotoCameraPosition = function(){
                if(m_otreeNode != ""){
                    if(m_otreeNode.type == 'device'){
                        var json = $filter('filter')(Unity3D.m_xJSON, {type : 'C', name : m_otreeNode.id})[0];
                        if(json){
                            var config = splitArray(json.content);
                            if(config['ppx']){
                                config['px'] = config['ppx'];
                                config['py'] = config['ppy'];
                                config['pz'] = config['ppz'];
                                config['rx'] = config['prx'];
                                config['ry'] = config['pry'];
                                config['rz'] = config['prz'];
                            }else{
                                config['py'] = parseFloat(config['py'])+1.25;
                            }

                            var content = "viewtype=2|px="+config['px']+"|py="+config['py']+"|pz="+config['pz']+"|rx="+config['rx']+"|ry="+config['ry']+"|rz="+config['rz'];
                            unityEdit.gotoCameraPosition(content);

                        }else{
                            showMessage("选择监控点【"+ m_otreeNode.name +"】未绑定,请配置!", 2);
                        }

                    }else{
                        showMessage("选择节点不是监控节点，请选择一个监控节点!",2);
                    }
                }else{
                    showMessage("请选择一个设备节点!",2);
                }
            };

            $scope.saveCamera = function(){
                unityEdit.getEditAttr('saveCameraResult');
            };

            $scope.deleteCamera = function(){
                if(m_oJSON){
                    if($window.confirm('删除后无法还原，您确定要删除吗?')){
                        if(m_scode == 2){
                            var url,data;
                            url = '/security/interunity.do?action=delInterunity';

                            data = {
                                id : [m_oJSON.code]
                            }

                            if(save(data,url)){
                                //var json = $filter('filter')(Unity3D.m_xJSON, {type : 'C', id : m_oJSON.code});
                                var json = m_oJSON;
                                var index = Unity3D.m_xJSON.indexOf(json[0]);
                                Unity3D.m_xJSON.splice(index, 1);

                                unityEdit.deleteCamera(m_oJSON.code);
                                m_oPositionByCamera[m_oJSON.code] = null;
                                m_oJSON = null;

                                $scope.cameratitle = '';
                                $scope.cameraid = '';

                                showMessage("删除成功!",3);
                            }
                        }else{
                            unityEdit.deleteCamera(m_oJSON.code);
                            m_oPositionByCamera[m_oJSON.code] = null;
                            m_oJSON = null;

                            $scope.cameratitle = '';
                            $scope.cameraid = '';
                            showMessage("删除成功!",3);
                        }

                        $scope.unity.rightAreaCamera = {
                            manager : true,
                            add : false,
                            position : false
                        }
                    }
                }else{
                    showMessage("请选择需要删除的一个监控点!",2);
                }
            };

            $scope.showCamera = function(){
                $rootScope.$broadcast('showCameraListEvent');

                $('#cameraTreeModel').show();
                $('#cameraTreeModelCover').show();
                $('#cameraTreeModel').addClass('in');
                $('#cameraTreeModelCover').addClass('cameraCover');
                getDeviceMonitorList();
                if(m_oCameraObject){
                    $scope.treeNodes = {
                        zNodes : m_oCameraObject
                    };
                    $rootScope.$broadcast('initTree',$scope.treeNodes);
                }else{
                    getCameraInfo();
                }
            };

            $scope.getDeviceMonitorList = function(){
                getDeviceMonitorList();
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
                m_otreeNode = treeNode;
            };

            $scope.selectCameraPosition = function(treeNode){
                alert(treeNode.id);

            };

            $scope.cancle = function(){
                $('#cameraTreeModel').hide();
                $('#cameraTreeModelCover').hide();
                $('#cameraTreeModel').removeClass('in');
                $('#cameraTreeModelCover').removeClass('cameraCover');
                $rootScope.$broadcast('hideCameraListEvent');
            };

            $scope.selectMonitor = function(item){
                $scope.cameratitle = item.name;
                $scope.cameraid = item.id;
                $('#cameraTreeModel').hide();
                $('#cameraTreeModelCover').hide();
                $('#cameraTreeModel').removeClass('in');
                $('#cameraTreeModelCover').removeClass('cameraCover');
                $rootScope.$broadcast('hideCameraListEvent');
                if(m_otreeNode != ""){
                    if(m_otreeNode.type == 'device'){
                        var zrow = m_oJSON;
                        if(zrow){
                            showMessage("所选监控点【"+ m_otreeNode.name +"】已存在，请重新选择！",3);
                            return;
                        }else{
                            $scope.cameratitle = m_otreeNode.name;
                            $scope.cameraid = m_otreeNode.id;

                            $rootScope.$broadcast('hideCameraListEvent');

                            $('#cameraTreeModel').removeClass('in');
                            $timeout(function(){$('#cameraTreeModel').hide()},1000);
                        }
                    }else{
                        showMessage("选择节点不是监控节点，请选择一个监控节点!",2);
                    }
                }
            };

            function getDeviceMonitorList(){
                var data = {
                    filter:{
                        type: 'monitor',
                        searchText: $scope.unity3dsetting.searchText
                    },
                    params:{
                        pageNo : $scope.unity3dsetting.currentPage,
                        pageSize : $scope.unity3dsetting.pageSize
                    }
                };
                iAjax
                    .post('/security/device.do?action=getDevice',data)
                    .then(function (data) {
                        if(data.result && data.result.rows){
                            $scope.deviceMonitorList = data.result.rows;
                            $scope.unity3dsetting.totalPage = data.result.params.totalPage;
                            $scope.unity3dsetting.pageSize = data.result.params.pageSize;
                            $scope.unity3dsetting.currentPage = data.result.params.pageNo;
                            $scope.unity3dsetting.totalSize = data.result.params.totalSize;
                        }
                    });
            }

            function saveCameraResult(json){
                m_oJSON = json;
                var config = splitArray(m_oJSON.content);
                var contents = [];
                contents.push('px='+config['px']);
                contents.push('py='+config['py']);
                contents.push('pz='+config['pz']);
                contents.push('rx='+config['rx']);
                contents.push('ry='+config['ry']);
                contents.push('rz='+config['rz']);
                var s = m_oPositionByCamera[m_oJSON.code];
                if(s){
                    var temp = splitArray(s);
                    contents.push('ppx='+temp['px']);
                    contents.push('ppy='+temp['py']);
                    contents.push('ppz='+temp['pz']);
                    contents.push('prx='+temp['rx']);
                    contents.push('pry='+temp['ry']);
                    contents.push('prz='+temp['rz']);
                }else{
                    var zrow = m_oJSON;
                    if(zrow){
                        var temp = splitArray(zrow.content);
                        if(temp['ppx']){
                            contents.push('ppx='+temp['ppx']);
                            contents.push('ppy='+temp['ppy']);
                            contents.push('ppz='+temp['ppz']);
                            contents.push('prx='+temp['prx']);
                            contents.push('pry='+temp['pry']);
                            contents.push('prz='+temp['prz']);
                        }
                    }
                }
                contents.push('entityCode='+ $scope.cameraid);
                var datas,url;
                datas = {
                    row : {
                        id : m_oJSON.code,
                        title : $scope.cameratitle,
                        name : $scope.cameraid,
                        type : m_oJSON.type,
                        content : contents.join('|'),
                        syoufk : $scope.syoufk

                    }
                };
                if(m_scode == 2){
                    datas.row.id = m_oJSON.code;
                    url = '/security/interunity.do?action=upInterunity';

                }else if(m_scode == 1){
                    url = '/security/interunity.do?action=addInterunity';
                }

                iAjax
                    .post(url, datas)
                    .then(function(data) {
                        if (data && data.message) {
                            if (data.status == "1") {
                                m_oJSON = null;
                                m_otreeNode = '';
                                $scope.cameratitle = '';
                                $scope.cameraid = '';
                                showMessage('保存成功!',3);

                                datas.row.id = data.result.rows.id;
                                Unity3D.m_xJSON.unshift(datas.row);

                                $scope.unity.rightAreaCamera = {
                                    manager : true,
                                    add : false,
                                    position : false
                                }
                            }
                        }
                    },function(error){
                        showMessage('保存失败!',4);
                    });
            }

            function save(data, url){
                var result = null;
                iAjax
                    .postSync(url, data)
                    .then(function(data) {
                        if (data && data.message) {
                            if (data.status == "1") {
                                result = true;
                            }
                        }
                    },function(){
                        showMessage('保存失败!',4);
                        result = false;
                    });
                return result;
            }

            $scope.showOu = function(){
                $rootScope.$broadcast('showCameraListEvent');

                $('#ouTreeModel').show();
                $('#ouTreeModel').addClass('in');

                if(m_oSyouObject){
                    $scope.treeNodes = {
                        zNodes : m_oSyouObject
                    };
                    $rootScope.$broadcast('initTree',$scope.treeNodes);
                }else{
                    getSyouInfo();
                }
            }

            $scope.selectOu = function(){
                $scope.area.syouid = m_otreeNode.id;
                $scope.area.syouname = m_otreeNode.name;

                $rootScope.$broadcast('hideCameraListEvent');

                $('#ouTreeModel').removeClass('in');
                $timeout(function(){$('#ouTreeModel').hide()},1000);
            }

            $scope.saveArea = function(){
                unityEdit.getEditAttr('saveAreaResult');
            }

            $scope.setAreaScale = function(){
                unityEdit.setAreaScale('sx=' + $scope.area.areadepth + '|sy=' + $scope.area.areawidth + '|sz=' + $scope.area.areaheight);
            }

            function saveAreaResult(json){
                var datas,url;
                m_oJSON = json;
                datas = {
                    row : {
                        id : m_oJSON.code,
                        title : $scope.area.areatitle,
                        name : json.code,
                        type : m_oJSON.type,
                        content : json.content,
                        syoufk : $scope.area.syouid

                    }
                };
                if(m_scode == 2){
                    datas.row.id = m_oJSON.code;
                    url = '/security/interunity.do?action=upInterunity';

                }else if(m_scode == 1){
                    url = '/security/interunity.do?action=addInterunity';
                }

                iAjax
                    .post(url, datas)
                    .then(function(data){
                        if (data && data.message) {
                            if (data.status == "1") {
                                m_oJSON = null;
                                m_otreeNode = '';
                                $scope.area = {};

                                datas.row.id = data.result.rows.id;
                                Unity3D.m_xJSON.unshift(datas.row);

                                showMessage('保存成功!',3);

                                $scope.unity.rightAreaArea = {
                                    manager : true,
                                    add : false
                                }
                            }
                        }
                    },function(){
                        showMessage('保存失败!',4);
                    });
            }

            $scope.deleteArea = function(){
                if(m_oJSON){
                    if($window.confirm('删除后无法还原，您确定要删除吗?')){
                        if(m_scode == 2){
                            var url,data;
                            url = '/security/interunity.do?action=delInterunity';

                            data = {
                                id : [m_oJSON.code]
                            }

                            if(save(data,url)){
                                var json = $filter('filter')(Unity3D.m_xJSON, {type : 'A', id : m_oJSON.code});
                                var index = Unity3D.m_xJSON.indexOf(json[0]);
                                Unity3D.m_xJSON.splice(index, 1);

                                unityEdit.deleteArea(m_oJSON.code);
                                m_oJSON = null;

                                $scope.area = {};
                                showMessage("删除成功!",3);
                            }
                        }else{
                            unityEdit.deleteArea(m_oJSON.code);
                            m_oJSON = null;
                        }

                        $scope.unity.rightAreaArea = {
                            manager : true,
                            add : false
                        }
                    }
                }else{
                    showMessage("请选择需要删除的一个区域点!",2);
                }
            }

            $scope.canelArea = function(){
                $scope.unity.rightAreaArea = {
                    manager : true,
                    add : false
                }
            }

            $scope.canelCamera = function(){
                $scope.unity.rightAreaCamera = {
                    manager : true,
                    add : false,
                    position : false
                }
            }

            $scope.canelPosition = function(){
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : true,
                    positionContainer : false
                }
                $scope.unity.rightAreaCamera = {
                    manager : true,
                    add : false,
                    position : false
                }
            }

            function splitArray(content){
                var result = {};
                var contents = content.split('|');
                var values;
                $.each(contents, function(index, str){
                    values = str.split('=');
                    result[values[0]] = values[1];
                });
                return result;
            }

            function showMessage(content, level){
                var message = {};
                message.level = level;
                message.title = "三维模型";
                message.content = content;
                iMessage.show(message,false);
            }

            function getChannelTitle(cameraId){
                var url, data;
                url = '/security/common/monitor.do?action=getDeviceDetail';

                data = {
                    filter : {
                        id : cameraId
                    }
                }
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data.result && data.result.rows){
                            $scope.cameratitle = data.result.rows;
                        }
                    });
            }

            function getSyouName(syouid){
                var zrow = $filter('filter')(m_oSyouObject, {id : syouid})[0];
                return zrow.name;
            }

            $scope.$on('showMonitorItem', function(event, data){
                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : false,
                    cameraContainer : true,
                    positionContainer : false
                }
                $scope.unity.rightAreaCamera = {
                    manager : false,
                    add : true,
                    position : false
                }
                if(!(m_oJSON && m_oJSON.code == data.code)){
                    m_oJSON = data;
                    m_scode = data.m_scode;

                    $scope.unity.rightTopTitle = (m_scode == 1)?'新增监控':'修改监控';

                    var zrow = m_oJSON;
                    if(zrow){
                        var config = splitArray(zrow.content);
                        var entityCode = config["entityCode"];
                        if(entityCode){
                            getChannelTitle(entityCode);
                            $scope.cameraid = entityCode;
                        }
                    }
                }
            });

            $scope.$on('showAreaItem', function(event, data){
                var areatitle, syouid, syouname;

                $scope.unity.rightAare = {
                    normalContainer : false,
                    areaContainer : true,
                    cameraContainer : false,
                    positionContainer : false
                }

                $scope.unity.rightAreaArea = {
                    manager : false,
                    add : true
                }

                if(!(m_oJSON && m_oJSON.code == data.code)){
                    m_oJSON = data;
                    m_scode = data.m_scode;

                    $scope.unity.rightTopTitle = (m_scode == 1)?'新增区域':'修改区域';
                    var zrow = $filter('filter')(Unity3D.m_xJSON, {type : 'A', id : data.code})[0];

                    if(zrow){
                        areatitle = zrow.title;
                        syouid = zrow.syoufk;
                        syouname = getSyouName(zrow.syoufk);

                    }else{
                        areatitle = null;
                        syouid = null;
                        syouname = null;

                    }
                    var config = splitArray(m_oJSON.content);
                    $scope.area = {
                        areadepth: config['sx'],
                        areawidth: config['sy'],
                        areaheight: config['sy'],
                        areatitle : areatitle,
                        syouid : syouid,
                        syouname : syouname
                    }
                }
            });

            $scope.$on('saveCameraResult', function(event, data){
                saveCameraResult(data);
            });

            $scope.$on('saveAreaResult', function(event, data){
                saveAreaResult(data);
            });

            $scope.$on('saveCameraPersonPositionResult', function(event, data){
                if(m_oJSON){
                    m_oPositionByCamera[m_oJSON.code] = data;
                    showMessage("更新成功!",3);
                }
            });
        }
    ]);

    // 模块内部路由
    angularAMD.config(function($stateProvider) {
        $stateProvider
        .state('system.unity3dsetting.add', {
            url: '/add',
            controller : 'unity3dsettingItemController',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        })
        .state('system.unity3dsetting.mod', {
            url: '/mod',
            controller : 'unity3dsettingItemController',
            templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
        });
    });
});