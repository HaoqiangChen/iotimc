# 常用接口

安防平台平时工作笔记，记录一些安防项目的常用后端接口

- Git仓库：<https://github.com/HaoqiangChen/iotimc>
- 个人工作开发笔记：<https://haoqiangchen.github.io/iotimc/>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## iAjax

> post(url, data)

```js
iAjax.post('sys/test.do?action=login', {
	'username': 'admin',
	'password': '123'
}).then(function(data) {
	// TODO SUCCESS
}, function(data) {
	// TODO ERROR
});
```

> get(url, data)

```js
iAjax.get('sys/test.do?action=userlist', {
	'username': 'admin'
}).then(function(data) {
	// TODO SUCCESS
}, function(data) {
	// TODO ERROR
});
```

> getTemplate

获取对应模块路径下的资源文件内容。
```js
var template = iAjax.getTemplate('iiw.safe', '/view/test.html');
console.log(template);
```

> formatFrameURL

格式化frame的src url，根据b/s或c/s访问，返回对应可访问的资源地址。
```js
var url = 'http://192.168.0.251:80/#/autologin?username=1001&password=123';
var furl = iAjax.formatFrameURL(url);

console.log(furl);
// BS: http://192.168.0.251:80/#/autologin?username=1001&password=123
// CS: main.html?isclient=1&host=192.168.0.251&port=80&path=autologin?username=1001&password=123
```

> formatURL

格式化远程访问的url，在url中加入框架域名及token
```js
var url = 'sys/test.do?action=userlist';
var furl = iAjax.formatURL(url);
console.log(furl);  // /sys/test.do?action=userlist&token=token
```

## 用户

> 获取当前用户信息

获取当前用户信息，已写到iiw.safe模块下app.js，并且将数据放到$rootScope.__USERINFO__暴露给其他模块使用。
```js
iAjax.post('/sys/web/syuser.do?action=getSyuser', {}).then(function (data) {
	if(data.result.rows && data.result.rows.length) {
		$rootScope.__USERINFO__ = data.result.rows[0];
	}
})
```

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

> 查看后台配置的某个系统字典详细信息
```js
iAjax.post('security/common/monitor.do?action=getSycodeList', {filter: {type: 'isLaunch'}}).then(function (data) {})
```

> 修改后台配置的某个系统字典详细信息
```js
iAjax.post('sys/web/sycode.do?action=upSycode', {filter: {row: {id: id, content: $scope.content}}}).then(function (data) {
	if(data.status === 1) {
		iMessage.show({level: 1, title: '保存成功', content: '路径设置保存成功'});
	}
})
```

## 权限

> 获取是否具有某个权限
之后请求接口：security/check/check.do?action=getSpecialrole
传递的参数filter: {url: ['权限标识']}
```js
function getRoleSetting(type, callback) {
    iAjax.post('security/check/check.do?action=getSpecialrole', {filter: {url: [type]}}).then(function(data) {
        if(data.result && data.result.rows) {
            callback(data.result.rows);
        }
    })
}
getRoleSetting('type', function(role) {
    if(role['type'] != '1') {}
})
```


## 监控

&authorization='+ iToken.get()
