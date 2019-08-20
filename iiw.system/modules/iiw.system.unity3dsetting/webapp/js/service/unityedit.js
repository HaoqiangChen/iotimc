/**
 * 三维模型服务。
 *
 * @author : zjq
 * @version : 1.0
 * @Date : 2015-11-26
 */
define(['app'], function(app) {
    app.factory('unityEdit', [
        '$rootScope',
        '$window',
        '$location',
        '$filter',
        'iAjax',

        function($rootScope, $window, $location, $filter, iAjax) {

            var m_xmode = 'main';
            var m_oGetEditAttrMethod;
            init();

            function init() {
                modelInterface();
            }

            function modelInterface() {
                /**
                 * 三维模型加载后的回调，用于初始化三维配置数据
                 *
                 */
                Unity3D.getData = function(){
                    var url,data, serverurl;
                    url = '/security/model/model.do?action=getInterunityList';
                    serverurl = window.location.href;
                    serverurl = serverurl.substring(0,serverurl.indexOf("imc")-1);

                    data = {
                        filter : {
                            searchText : '',
                            formatxml : 'Y',
                            level: ''
                        }
                    };
                    iAjax
                        .post(url, data)
                        .then(function(data){
                            Unity3D.m_xDoc = data.result.xml;
                            Unity3D.m_xJSON = data.result.rows;
                            Unity3D.player.SendMessage("WebControlsObject", "openEdit", null);

                            Unity3D.player.SendMessage("WebControlsObject", "setData", Unity3D.m_xDoc);
                            Unity3D.player.SendMessage("WebControlsObject", "getServicesURL", serverurl);
                        })
                }

                Unity3D.showEditAttr = function(json){
                    json = eval('('+json+')');
                    var zrow = $filter('filter')(Unity3D.m_xJSON, {id: json.code.split('|')[0]});
                    json.m_scode = (zrow.length>0) ? 2 : 1;
                    switch(json.type){
                        case 'C' :
                            $rootScope.$broadcast('showMonitorItem', json);
                            break;
                        case 'A' :
                            $rootScope.$broadcast('showAreaItem', json);
                            break;
                    }
                }

                Unity3D.saveEditAttr = function(json){
                    json = eval('('+ json +')');
                    $rootScope.$broadcast(m_oGetEditAttrMethod, json);
                }

                Unity3D.sendPersonPosition = function(value){
                    $rootScope.$broadcast('saveCameraPersonPositionResult', value);
                }



                Unity3D.hideUnity3DLoading = function(){}

                Unity3D.showInterface = function(){}


                /**
                 * 外部接口业务处理
                 */

                /**
                 * 新增摄像头。
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-24
                 */
                Unity3D.addCamera = function(){
                    Unity3D.player.SendMessage("WebControlsObject", "addCamera", null);
                }

                /**
                 * 删除摄像头。
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-24
                 */
                Unity3D.deleteCamera = function(id){
                    Unity3D.player.SendMessage("WebControlsObject", "deleteCameraModel", id);
                }

                /**
                 * 新增区域。
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-26
                 */
                Unity3D.addArea = function(){
                    Unity3D.player.SendMessage("WebControlsObject", "addArea", null);
                };

                /**
                 * 删除区域。
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-24
                 */
                Unity3D.deleteArea = function(id){
                    Unity3D.player.SendMessage("WebControlsObject", "deleteAreaModel", id);
                }

                Unity3D.setAreaScale = function(content){
                    Unity3D.player.SendMessage("WebControlsObject", "setAreaScale", content);
                }

                Unity3D.getEditAttr = function(method){
                    m_oGetEditAttrMethod = method;
                    Unity3D.player.SendMessage("WebControlsObject", "getEditAttr", null);
                }

                /**
                 * 获取当前人物坐标。
                 * @param viewtype
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-24
                 */
                Unity3D.getPersonPosition = function(viewtype){
                    Unity3D.player.SendMessage("WebControlsObject", "getPersonPosition", viewtype);
                }

                /**
                 * 监控点定位测试。
                 * @param content
                 *
                 * @author : zjq
                 * @version : 1.0
                 * @Date : 2016-03-24
                 */
                Unity3D.gotoCameraPosition = function(content){
                    var xml = Unity3D.loadXML(content);
                    Unity3D.goEntByXML(xml);
                }


                /**
                 * 全屏控制。
                 * @param type - 放大缩小参数
                 *
                 */
                Unity3D.fullScreen = function(type){
                    $rootScope.$broadcast('unity2fullscreen', type);
                }

                /**
                 * 字符串转XML格式
                 *
                 */
                Unity3D.loadXML = function(text){
                    var xml = '<?xml version="1.0" encoding="UTF-8"?><xml xmlns:s="uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:rs="urn:schemas-microsoft-com:rowset" xmlns:z="#RowsetSchema">'
                        + '<rs:data>'
                        +'<z:row content="'+ text +'"/>'
                        +'</rs:data>'
                        +'</xml>';
                    return xml;
                }

                /**
                 * 根据XML参数，在三维中进行定位。
                 * <?xml version="1.0" encoding="UTF-8"?><xml xmlns:s="uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:rs="urn:schemas-microsoft-com:rowset" xmlns:z="#RowsetSchema">
                 * 		<rs:data>
                 * 			<z:row content="viewtype=2|px=209.367|py=1.810984|pz=259.7791|rx=4|ry=176.0617|rz=1.337279E-08" />
                 * 		</rs:data>
                 * </xml>
                 *
                 */
                Unity3D.goEntByXML = function(xml){
                    Unity3D.player.SendMessage('WebControlsObject', 'goEnt', 'X@' + xml);
                }

            }

            /**
             *
             * @private
             *
             * 对外接口
             *
             */
            function _addCamera(){
                Unity3D.addCamera();
            }

            function _deleteCamera(id){
                Unity3D.deleteCamera(id);
            }

            function _addArea(){
                Unity3D.addArea();
            }

            function _deleteArea(id){
                Unity3D.deleteArea(id);
            }

            function _setAreaScale(content){
                Unity3D.setAreaScale(content);
            }

            function _getEditAttr(method){
                Unity3D.getEditAttr(method);
            }

            function _getPersonPosition(type){
                Unity3D.getPersonPosition(type);
            }

            function _gotoCameraPosition(content){
                Unity3D.gotoCameraPosition(content);

            }


            return{
                m_xJSON: Unity3D.m_xJSON,
                addCamera : _addCamera,
                deleteCamera : _deleteCamera,
                addArea : _addArea,
                deleteArea : _deleteArea,
                setAreaScale : _setAreaScale,
                getEditAttr : _getEditAttr,
                getPersonPosition : _getPersonPosition,
                gotoCameraPosition : _gotoCameraPosition
            }
        }
    ]);
});