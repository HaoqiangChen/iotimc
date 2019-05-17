# 最频繁使用

安防平台平时工作笔记，记录一些安防项目的业务逻辑，业务配置和常用代码块

- 公司内网SVN仓库：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.safe>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## 表格列表

## 页面跳转

语法：$state.go('跳转模块', '参数')

**实例**
```js
if (item) {
   $state.params = {
      data: item
   };
   switch (item.type) {
      case 'wjlx_ftwj':
         $state.go('system.ftappquestionnaire', $state.params);
         break;
      case 'wjlx_lb':
         $state.go('system.ftappscale', $state.params);
         break;
   }
} else {
   $state.params = {
      data: null
   };
   _remind(4, '错误操作!');
}
```

::: tip 提示
跳转页面那里需注入`$stateParams`获取参数值`$stateParams.data`
:::

## 父子组件之间通信

发送消息：$scope.sendMessage  
广播：$rootScope.$broadcast('自命名一个通信字段', '参数');  
接收消息：$scope.$on('刚命名的通信字段', function(){})

## iMessage.show 点击事件

```js
// 举例：接收到后端websocket之后自动弹出对应页面
$scope.$on('ws.bringoutHandle', function(e, data) {
	showMessage(data.rows[0]);
});

function showMessage(data) {
	var content = '【' + data.policename + '】申请带出' + data.js + '【' + data.criminalname + '】进行【' + data.reason + '】<br>点击查看明细';
	safeSound.playMessage(data.policename + '申请带出' + data.js + data.criminalname + '进行' + data.reason);
	iMessage.show({
		id: data.id,
		level: 1,
		title: '罪犯带出提醒',
		timeout: '0',
		data: data,
		content: content,
		fn: 'handleRequest'
	}, false, $scope);
}

$scope.handleRequest = function($message, obj) {
	if ($state.current.url == '/bringout') {
		$state.params = {data: {type: 'reload'}};
		$state.go('safe.bringout', $state.params, {location: true, reload: true});
	} else {
		$state.params = {data: {type: 'reload'}};
		$state.go('safe.bringout', $state.params);
	}
	iMessage.remove(obj.data.id);
};
// 举例：监听报警事件并且显示报警联动界面
$scope.$on('ws.alarmHandle', function (e, data) {
    // console.log('ws.alarmHandle', data)
    if (!$scope.run) {
        showAlarmHandle(data)
    } else {
        iMessage.show({
            id: data.id,
            level: 2,
            title: data.devicename + '发生报警',
            content: '【'+data.lvlname+'】 '+data.content,
            timeout: '0',
            drag: true,
            data: data,
            fn: 'showAlarmHandle'
        }, false, $scope)
    }
    // showAlarmHandle(data)
});

$scope.showAlarmHandle = function (message, data) {
    iMessage.remove(data.data.id);
    showAlarmHandle(data.data)
}
```
