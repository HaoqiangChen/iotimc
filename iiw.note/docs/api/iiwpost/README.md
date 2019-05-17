# 常用接口

安防平台平时工作笔记，记录一些安防项目的常用后端接口

- Git仓库：<https://github.com/HaoqiangChen/iotimc>
- 个人工作开发笔记：<https://haoqiangchen.github.io/iotimc/>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## 单位

> 获取当前所有单位
```js
iAjax.post('/sys/web/syou.do?action=getSyouAll', {"data": {filter: {cascade: 'Y'}}}).then(function (data) {})
```

> 根据单位类型查询过滤
```js
iAjax.post('/sys/web/syou.do?action=getOu4Type',{filter: {type: ['JQ']}}).then(function (data) {})
```

> 查看当前用户单位接口
```js
iAjax.post('/security/common/monitor.do?action=getSyouDetail', {}).then(function (data) {
    if (data.result && data.result.rows) {
        $scope.syoufk = data.result.rows[0].id;
        $scope.syouname = data.result.rows[0].syouname;
    }
});
```

## 系统字典

> 查看后台配置的某个系统字典
```js
// 多个报警联动时是否启用新模式
function getIsNewAlarm() {
    var defer = $.Deferred();
    iAjax.post('security/common/monitor.do?action=getSycodeDetail', {filter: {type: 'isNewAlarm'}})
        .then(function (data) {
            if (data.status == 1 && data.result.rows == '1') {
                defer.resolve(true);
            } else {
                defer.resolve(false);
            }
        })
    return defer;
}
getIsNewAlarm().then(function(res) {})
```

## 监控

&authorization='+ iToken.get()
