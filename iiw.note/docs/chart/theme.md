# iiw数据主题

登录`tb`账号 管理安防大数据

## 修改数据主题

### 打开数据库
- `SECTY_SCMP_DATATHEME`这张表配置主题
- `SECTY_SCMP_DATAGRAPH`这张表配置数据主题下的图表
- `SECTY_SCMP_DATATHEMEBIND`这张表配置用户有哪些主题

### 步骤
1、首先打开数据表 syuser，过滤code = 'zhzx'，复制查到的数据id  
2、数据表datathemebind => value = '180288CBE46244B2965E0514765F5245' => 复制datathemefk  
3、数据表datatheme => id = '14637B8A9B724739ADD910131B5E357D' => 复制id  
4、数据表datathemepath => datathemefk = '14637B8A9B724739ADD910131B5E357D' => 就OK了，复制修改你所想修改的

你要看可视化首页加载的时候，调的接口是getBindDataTheme还是getDataxTheme，如果是getBindDataTheme，那就只能在数据库配了

## 图表常用代码

```html
plugins/igreport/downfile.do?code=tjga.judged.repeatedly.pie&action=main.js
<safe-datacenter-chart.tjga.judged.repeatedly.pie></safe-datacenter-chart.tjga.judged.repeatedly.pie>

$scope.sendMessage('safe.xxyp.nav', code);

$scope.$on('safe.xxyp.nav', function(e, code) {
    console.log(code);
});
```

### 图表点击事件
```js
myChart.on('click', function (params) {})
```
