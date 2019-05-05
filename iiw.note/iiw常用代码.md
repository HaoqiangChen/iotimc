HTML

时间选择控件
<input class="form-control ng-valid ng-dirty ng-valid-parse ng-touched" type="text" ng-model="starttime" safe-picker="" ng-change="timeFilter()" p!format="Y-m-d H:i" placeholder="请选择开始时间" style="">

下拉框
<select ng-change="changeType()" ng-model="types" class="form-control safe-backlog-filter-select">
	<option value="">全部</option>
	<option value="{{types.modouleName}}" ng-repeat="types in backlogRows">{{types.modouleName}}</option>
	<option ng-repeat="(key, type) in record.types track by key" value="{{type.status}}">{{type.statusname}}</option>
</select>

对ng-repeat的表格内容添加不同样式，html代码：
<tr ng-repeat="x in tableData">
    <td>{{x.networkName}}</td>
    <td>{{x.network}}</td>
    <td ng-style="{background: x.status === -1 ? '#f0ad4e' : x.status === 1?'#5cb85c':x.status === 2?'#f04124':'#a5a5a5'}">{{x.status | status }}</td>
</tr>

返回图标：fa-mail-reply-all

JavaScript

页面跳转
方式一：$state.go('system.ftappquestionnaire')
带参数例子：
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
跳转页面需注入$stateParams获取参数值$stateParams.data

监听$watch

上下级组件模块通信
websocket：
发送消息：$scope.sendMessage
广播：$rootScope.$broadcast('ws.' + data.event, data.data);
接收消息：$scope.$on('', function(){})

举例：接收到后端websocket之后自动弹出对应页面
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


常用选择单位代码



