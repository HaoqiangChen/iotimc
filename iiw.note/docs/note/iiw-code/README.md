# 最频繁使用

安防平台平时工作笔记，记录一些安防项目的业务逻辑，业务配置和常用代码块

- 公司内网SVN仓库：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.safe>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>
- Underscore：<https://www.html.cn/doc/underscore1.8.3/#each>
- moment：<http://momentjs.cn/docs/>

## Underscore.js

> each
```
_.each([1, 2, 3], alert);
=> alerts each number in turn...
_.each({one: 1, two: 2, three: 3}, alert);
=> alerts each number value in turn...
```
> map
```
_.map([1, 2, 3], function(num){ return num * 3; });
=> [3, 6, 9]
_.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
=> [3, 6, 9]
_.map([[1, 2], [3, 4]], _.first);
=> [1, 3]
```
> find
```
var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> 2
```
> filter
```
var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
=> [2, 4, 6]
```
> where
```
_.where(listOfPlays, {author: "Shakespeare", year: 1611});
=> [{title: "Cymbeline", author: "Shakespeare", year: 1611},
    {title: "The Tempest", author: "Shakespeare", year: 1611}]
```

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


## iMessage.show （类似 toast 提示）

`iMessage.show(json, checkSame, callScope, scope)`

name | type | description
- | - | - 
`json` | JSON Object | `json:{id:'',level:1,title:'标题',time:'时间',timeout:'超时消失',content:'内容',drag:false,opacity:1,fn:'fn'}`
`checkSame` | Boolean | 默认false，当输入true时，自动过滤重复项，重复项指与上一次一样既过滤不显示。
`callScope` | Object | 方法触发对象，用于点击事件时调用。
`scope` | Object | 作用域，用于content内容为html时，触发与作用域相关的方法。

```
json: {
	// 消息框id，默认可忽略，带有id参数的，可通过调用remove(id)方法去除消息显示。
	id: '',
	// 1->成功;2->消息；3->警告；4->异常。默认为2
	level: 1,
	title: '标题',
	// 默认取当前客户端时间。
	time: '时间',
	// 默认5秒（int类型）, '0'不自动消失（注意：'0'必须传递字符串）。
	timeout: '超时消失',
	content: '内容',
	// 是否允许拖动，true为允许拖动，默认不允许。
	drag: false,
	// 背景透明度，默认为1，既不透明。
	opacity: 1,
    // 点击消息框时响应的方法：callScope.fn，在json中传入方法名后还需传入callScope参数值：fn所属域对象
	fn: 'fn' 
}
```

`iMessage.remove(id);` 根据消息框id，删除消息框

```js
// 全局的消息提醒服务
function _remind(level, title, content, timeout, id, data, fn, scope) {
	var message = {
		id: (id || iTimeNow.getTime()),
		title: (title || '呼叫提醒！'),
		level: level,
		content: (content || ''),
		timeout: timeout || 5000,
		drag: true,
		data: data,
		fn: fn
	};
	for (let v in message) {
		if (message[v] === 'v') delete message[v]
	}
	iMessage.show(message, false, scope);
}
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

## 全局的确认弹出框服务 iConfirm

```js
// 需先注入iConfirm服务。
// 显示一个确认删除的弹出确认框。
iConfirm.show({
	scope: $scope,
	title: '确认删除？',
	content: '删除信息后将无法还原，是否确认删除？',
	buttons: [{
		text: '确认',
		style: 'button-primary',
		action: 'confirmSuccess'
	},
	{
		text: '取消',
		style: 'button-caution',
		action: 'confirmCancel'
	}],
	close: 'confirmClose'
});

$scope.confirmSuccess = function(id) {
	console.log('点击确认');
	iConfirm.close(id);
};

$scope.confirmCancel = function(id) {
	console.log('点击取消');
	iConfirm.close(id);
};

$scope.confirmClose = function(id) {
	console.log('弹出窗口将被关闭，如返回true，则关闭，如返回false，则无法关闭');
	return true;
};
```

## iAjax
```js
// get
iAjax.get('sys/test.do?action=userlist', {'username': 'admin'}).then(function(data) {
alert(1); // TODO SUCCESS
}, function(data) {
// TODO ERROR
});

// post
iAjax.post('sys/test.do?action=userlist', {
	filter: {},
	remoteip: '192.168.11.19' // 该字段可指向ip请求，比如常用的指向与后端Java工程师 李涛的ip 
}).then(function(data) {
alert(1); // TODO SUCCESS
}, function(data) {
// TODO ERROR
});

// iAjax.getTemplate
var template = iAjax.getTemplate('iiw.safe', '/view/test.html');
```

## 触摸滚动条 iScroll2

1. 主框架已加载，无需再次引入。
2. 此类为指令，直接在html中使用，restrict: 'A'。
3. iScroll2使用5.2.0版本，解决iScroll内存泄露的问题。
4. 不能与其它独立指令使用，如ui-layout-container，如遇到此情况请增加一级元素单独使用。

::: danger 注意
1. 必须指定高度，或上级指定高度; 必须设置position: relative;  
2. 必须设置多一个子元素div，编译会自动加上position: static;  
3. css上必须加上`i-scroll2`上的class后第一个子元素div的宽高百分百  
   .scroll2>div{width:100%;height:100%;}
:::

```html
<!-- 必须指定高度，或上级指定高度; 必须设置position: relative; -->
<div class="scroll2" i-scroll2 style="position: relative;height: 300px">
    <!-- 此为内容，高度超出i-scroll指令元素的高度，即可触摸和鼠标滚轮进行滚动 -->
    <!-- 必须设置多一个子元素div，编译会自动加上position: static; -->
    <div class="list">
        <div class="item"></div>
    </div> 
</div>
```
