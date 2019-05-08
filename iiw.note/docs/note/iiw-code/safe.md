# iiw.safe

## HTML

### 返回图标：fa-mail-reply-all

## 时间选择控件

```html
<input class="form-control ng-valid ng-dirty ng-valid-parse ng-touched" type="text" ng-model="starttime" safe-picker="" ng-change="timeFilter()" p!format="Y-m-d H:i" placeholder="请选择开始时间" style="">
```

## 下拉框

```html
<select ng-change="changeType()" ng-model="types" class="form-control safe-backlog-filter-select">
	<option value="">全部</option>
	<option value="{{types.modouleName}}" ng-repeat="types in backlogRows">{{types.modouleName}}</option>
	<option ng-repeat="(key, type) in record.types track by key" value="{{type.status}}">{{type.statusname}}</option>
</select>
```

## ng-repeat的表格内容添加不同样式

```html
<tr ng-repeat="x in tableData">
    <td>{{x.networkName}}</td>
    <td>{{x.network}}</td>
    <td ng-style="{background: x.status === -1 ? '#f0ad4e' : x.status === 1?'#5cb85c':x.status === 2?'#f04124':'#a5a5a5'}">{{x.status | status }}</td>
</tr>
```

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
