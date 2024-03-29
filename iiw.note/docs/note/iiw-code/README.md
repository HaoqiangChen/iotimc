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
_.each([1, 2, 3], function (item, index) {});
=> 1,0 => 2,1 => 3,2
_.each({one: 1, two: 2, three: 3}, function (item, index) {});
=> 1,'one' => 2,'two' => 3,'three'
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
> pluck
```
var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
_.pluck(stooges, 'name');
=> ["moe", "larry", "curly"]
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
> partition -- `将 list 拆分为两个数组：第一个数组其元素都满足predicate迭代函数， 而第二个的所有元素均不能满足predicate迭代函数`
```
_.partition([0, 1, 2, 3, 4, 5], (i)=>{
	return _.contains(_.pluck([{id:1},{id:4}], 'id')), i);
});
=> [[1, 4], [0, 2, 3, 5]]
```
> groupBy -- 把一个集合分组为多个集合
```
_.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
=> {1: [1.3], 2: [2.1, 2.4]}
_.groupBy(['one', 'two', 'three'], 'length');
=> {3: ["one", "two"], 5: ["three"]}
```

## 表格列表

```html
<div class="table-wrap safe-vitalsigns-setting-table">
	<table class="table table-striped">
		<thead>
		<tr>
			<th width="5%" class="text-center">姓名</th>
			<th width="10%" class="text-center">编号</th>
			<th width="15%" class="text-center">腕带编号</th>
			<th width="20%" class="text-center">心率阈值</th>
			<th width="20%" class="text-center">血压阈值</th>
			<th width="30%" class="text-center">操作</th>
		</tr>
		</thead>
	</table>

	<div class="safe-vitalsigns-setting-table-nodata" ng-if="!settings.list.length">
		<div class="nodata-toast">
			<i class="nodata-icon fa fa-exclamation-circle fa-5x fa-fw"></i>
			<p class="nodata-content">暂无数据</p>
		</div>
	</div>
	<div class="safe-vitalsigns-setting-table-iscroll" ng-if="settings.list.length" i-scroll2>
		<table class="table table-striped">
			<col width="5%" />
			<col width="10%" />
			<col width="15%" />
			<col width="20%" />
			<col width="20%" />
			<col width="30%" />
			<tbody>
			<tr ng-repeat="row in settings.list">
				<td class="text-center">{{row.name}}</td>
				<td class="text-center">{{row.code}}</td>
				<td class="text-center">{{row.syouname}}</td>
				<td class="text-center">{{row.value}}</td>
				<td class="text-center">{{row.cretime}}</td>
				<td class="text-center">
					<button class="btn btn-sm btn-success" ng-click="settings.edit(row)">
						<i class="fa fa-edit"></i> 编辑
					</button>
				</td>
			</tr>

			</tbody>

		</table>
	</div>
	
	<div class="pagination-container">
		<uib-pagination class="pagination pull-right" boundary-links="true" first-text="&laquo;" last-text="&raquo;" total-items="settings.pagination.totalSize" ng-model="settings.pagination.pageNo"
						ng-change="settings.getList()" items-per-page="settings.pagination.pageSize" previous-text="上一页" next-text="下一页" max-size="5"></uib-pagination>
	</div>

</div>

```

### css
```css
.nodata-toast {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    margin-top: -150px;
    margin-left: -150px;
    /*background: rgba(17, 17, 17, 0.7);*/
    text-align: center;
    border-radius: 5px;
    color: #fff;
}
.nodata-toast .nodata-icon {
    font-size: 8em;
    margin: 50px 0 0;
}
.nodata-toast .nodata-content {
    margin-top: 20px;
    font-size: 20px;
}

.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table{
    position: relative;
    height: 100%;
    overflow: hidden;
    clear: both;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table table {
    width: 100%;
    margin-bottom: 0;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table .safe-vitalsigns-setting-table-iscroll {
    position: relative;
    width: 100%;
    height: calc(100% - 80px);
    overflow: hidden;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table table.table-iscroll tbody {
    width: 100%;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table thead {
    text-shadow: rgb(0 0 0 / 60%) 0 1px 1px;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table tr th {
    font-size: 18px;
    font-weight: bold;
    padding: 5px;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table tr td {
    font-size: 16px;
}
.safe-vitalsigns-setting-container .safe-vitalsigns-setting-table .pagination {
    margin: 0;
}
```

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
广播：  
* 同个js：$scope.$broadcast('自命名一个通信字段', '参数');  
* 不同js：$rootScope.$broadcast('自命名一个通信字段', '参数');  
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
function _remind(level, content, timeout, title, id, data, fn, scope) {
	var message = {
		id: (id || iTimeNow.getTime()),
		title: (title || '消息提醒！'),
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

function _remind(level, content, title, timeout) {
	iMessage.show({
		level: level,
		content: content,
		title: title || '消息提醒',
		timeout: timeout || 2000
	})
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
	templateUrl: '绝对地址',     // 引用的html模板地址，建议使用绝对地址，避免分布式后无法访问，此参数配置后，content无效；如：$.soa.getWebPath('iiw.safe.XXX') + '/view/test.html'
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

## 模块加载完成事件

```javascript
$scope.$on('workLogControllerOnEvent', function () {
    // todo
});
```

## cmd创建目录`mkdir`

单独打包前端修改的某个前端模块文件，可直接cmd输入命令：`mkdir iiw.safe\webapp\js\services`

## 模态框列表选择

## 获取地址参数`$location`

```javascript
$location.absUrl(); // 完整地址
$location.host(); // 域名
$location.path(); // '/safe/insidemap'
```

## $destroy销毁

### 模块路由销毁

```javascript
$scope.$on('$destroy', function () {
    // todo
});
```

### directives指令销毁

```javascript
$element.$on('$destroy', function () {
    // todo
});
```

## 本地资源获取

```javascript
$.soa.getWebPath('iiw.safe') + '/img/logo.png'

iAjax.formatURL('security/common/monitor.do?action=getFileDetail&url=' + item.photo)
```


