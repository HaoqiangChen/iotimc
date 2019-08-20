/**
 * 信息牌配置数据接口
 *
 * @author : dwt
 * @date : 2016-11-24
 * @version : 0.1
 */
define(['app'], function(app) {
    app.service('infocardData', [
        'iAjax',
        'iMessage',

        function(iAjax, iMessage) {

            function getMapOuList(callback) {
                var data = {},
                    url = 'security/common/monitor.do?action=getMapOuList';

                data.filter = {};
                data.filter.cascade = 'Y';

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(callback) {

                                var arr = data.result.rows;
                                _.each(arr, function(o) {
                                    if(o.type == 'ou') {
                                        o['isOu'] = true;
                                        o['iconSkin'] = 'ouIcon';
                                    }else if(o.type == 'map') {
                                        o['isMap'] = true;
                                        o['iconSkin'] = 'mapIcon';
                                    }
                                });

                                callback(data.result.rows);
                            }
                        }
                    });
            }

            function getInfocardList(type, callback) {
                var url = '/security/infocard.do?action=getInfocardList',
                    data = {
                        filter: {
                            type: type
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            callback(data.result.rows);
                        }
                    });
            }

            function getInfocardRelation(id, type, callback) {
                var data = {
                        filter: {
                            id: id,
                            type: type
                        }
                    },
                    url = 'security/infocard.do?action=getInfocardRelatedList';

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(callback) {
                                callback(data.result.rows);
                            }
                        }
                    });
            }

            function addInfocardRelation(id, infocardfk, successFn, errorFn) {
                var data = {
                        row: {
                            relationid: id,
                            infocardfk: infocardfk
                        }
                    },
                    url = 'security/infocard.do?action=addInfocardRelated';

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {

                            iMessage.show({
                                level: '1',
                                title: '信息牌',
                                content: '绑定成功'
                            });

                            if(successFn) {
                                successFn(data.result.rows);
                            }

                        }else {
                            if(errorFn) {
                                errorFn();
                            }
                        }
                    }, errorFn);
            }

            function delInfocardRelation(id, successFn, errorFn) {
                var data = {
                        row: {
                            id: id
                        }
                    },
                    url = 'security/infocard.do?action=delInfocardRelated';

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.status && data.status == '1') {
                            if(successFn) {
                                successFn();
                            }
                        }else {
                            if(errorFn) {
                                errorFn();
                            }
                        }
                    }, errorFn);
            }

            function saveInfocard(object, cb) {
                var url = object.id ? '/security/infocard.do?action=modInfocard' : '/security/infocard.do?action=addInfocard',
                    data = {
                        row: {
                            id: object.id,
                            name: object.name,
                            idx: parseInt(object.idx),
                            content: object.content,
                            type: object.type
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.status == '1') {
                            if(cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

            function getInfocardSourceItem(callback) {
                var url = 'security/infocard.do?action=getInfocardSourceItem';

                iAjax
                    .post(url)
                    .then(function(data) {
                        if(data && data.result && data.result.rows && callback) {
                            callback(data.result.rows);
                        }
                    });
            }

            function getInfocardSourceList(syoufk, id, callback) {
                var url = 'security/infocard.do?action=getInfocardSourceList',
                    data = {
                        filter: {
                            syoufk: syoufk,
                            id: id
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows && callback) {
                            callback(data.result.rows);
                        }
                    });
            }

            return {
                getMapOuList: getMapOuList,
                getInfocardList: getInfocardList,
                getInfocardRelation: getInfocardRelation,
                addInfocardRelation: addInfocardRelation,
                delInfocardRelation: delInfocardRelation,
                saveInfocard: saveInfocard,
                getInfocardSourceItem: getInfocardSourceItem,
                getInfocardSourceList: getInfocardSourceList
            }
        }
    ]);
});