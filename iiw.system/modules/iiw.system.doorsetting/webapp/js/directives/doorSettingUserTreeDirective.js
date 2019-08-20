/**
 * 树形列表指令
 * Created by GDJ on 2016/3/24.
 */
define(['app'], function(app) {
    app.directive('doorSettingUserTree', [function() {
        function getLvlRows(lvl, data, id, pid, defPid) {
            var results = [],
                root = [];
            var myData = $.extend(true, {}, data);
            for (var i = 0; i < myData.length; i++) {
                var obj = myData[i];
                if (!obj[pid] || obj[pid] == null || (defPid && obj[pid] == defPid)) {
                    root.push(obj);
                    myData.splice(i, 1);
                    i--;
                }
            }
            results.push(root);

            //获取首个数据
            (function getLvlRecursion(pRoot, lvl) {
                var root = pRoot,
                    lvl = lvl || 0,
                    sRoot = root[lvl],
                    pId = sRoot.id,
                    mArray = [];
                for (var i = 0; i < myData.length; i++) {
                    var obj = myData[i];
                    if (obj[pid] == pId) {
                        mArray.push(obj);
                        myData.splice(i, 1);
                        i--;
                    }
                }
                results = results.concat(mArray);
                if (mArray.length > 0) getLvlRecursion(mArray);
            })(root, lvl);

            return results;
        }

        return {
            restrict: 'E',
            replace: true,
            template: '<div class="ztree"></div>',
            scope: false,
            link: function(scope, $element, attr) {
                var treeName = attr.id;
                var setting = {
                    lvl: 0,
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'parentid'
                        }
                    }
                }

                if (attr.setting) { //一般不会使用
                    $.extend(setting, angular.toJson(attr.setting));
                }

                scope.$on(treeName + '-' + 'initTree', function(e, appSetting, data, fn) {

                    $.extend(setting, appSetting);

                    var lvl = setting.lvl,
                        isAsync = setting.isAsync || false;

                    delete setting.lvl;
                    delete setting.isAsync;

                    var myData = '';
                    if (isAsync) {
                        myData = getLvlRows(lvl, data, setting.data.simpleData.id, setting.data.simpleData.pIdKey, setting.defPid);
                    }
                    else {
                        myData = data;
                    }

                    scope[treeName] = $.fn.zTree.init($element, setting, myData);
                    if (fn && typeof fn == 'function') {
                        fn.call(scope);
                    }
                });
            }
        }
    }]);
});