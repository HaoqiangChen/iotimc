# 前台接口

## 查看当前用户单位接口
**接口：**/security/common/monitor.do?action=getSyouDetail
```js
init: function (cb) {
	iAjax.post('/security/common/monitor.do?action=getSyouDetail', {}).then(function (data) {
		if (data.result && data.result.rows) {
			$scope.syoufk = data.result.rows[0].id;
			$scope.syouname = data.result.rows[0].syouname;
		}
	});
}
```

## 系统字典查询

**接口：**/iotiead/common.do?action=getSycodeList

### 请求参数
```json5
{
	"data": {
	    "filter": {
	        type: 'monitorNum'
	    }
	}
}
```
## 获取当前单位及以下单位数据

**接口：**/security/information/information.do?action=getSyouDis

### 请求参数
```json5
{
	"data": {}
}
```
## 获取当前所有单位

**接口：**/sys/web/syou.do?action=getSyouAll

### 请求参数
```json5
{
	"data": {filter: {cascade: 'Y'}}
}
```
