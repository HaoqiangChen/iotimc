# iiw数据主题

登录`tb`账号 管理安防大数据

## 图表常用代码

### 图表显示和隐藏
```js
$scope.$on('safe.jxjyj.prison.tags.select', function(e, data) {
	if(data.type == 'general') {
		show();
	} else {
		hide();
	}
});

function show() {
	if($element.parents('.datax-chart').length > 0) {
		$element.parents('.datax-chart').show();
	} else {
		$element.parent().show();
	}
}

function hide() {
	if($element.parents('.datax-chart').length > 0) {
		$element.parents('.datax-chart').hide();
	} else {
		$element.parent().hide();
	}
}
```

### 图表间交互
图表之间交互效果，一般都是使用angularjs广播即可。如
```js
$scope.sendMessage('safe.xxyp.nav', code);

$scope.$on('safe.xxyp.nav', function(e, code) {
    console.log(code);
});
```

### 图表做成一个公共小模块用于内嵌

首先按照平时开发那样，弄多个图表用来做公共小模块，例如`jxjyj.prison.list`

然后再随便另一个图表处引用内嵌，就只需要先在最上面`引入`这个填空里写上`plugins/igreport/downfile.do?code=jxjyj.prison.list&action=main.js`

最后在`html`里内嵌指令即可
```html
<safe-datacenter-chart.jxjyj.prison.list></safe-datacenter-chart.jxjyj.prison.list>
```
