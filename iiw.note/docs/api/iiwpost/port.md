# 前后台接口

## 设备

> 获取不同类型设备厂家
```js
iAjax.post('/security/device/device.do?action=getTypeCompanys', {filter: {type: "alarm"}})
    .then(function (data) { // 用 type 参数传不同类型标识过滤
})
```
> 根据设备id获取设备明细
```js
iAjax.post('/security/device.do?action=getDeviceDetail', {row: {id: 'id'}}).then(function (data) {})
```
> 获取设备厂家
```js
iAjax.post('/sys/web/syou.do?action=getSyouAll', {"data": {filter: {cascade: 'Y'}}}).then(function (data) {})
```

## 民警
> 查询所有民警列表
```js
iAjax.post('/security/information/information.do?action=getpoliceall', {
	params: {pageNo: 1, pageSize: 20},
	filter: ""
}).then(function (data) {})
```

## 罪犯
> 查询所有罪犯列表
```js
iAjax.post('/security/information/information.do?action=getcriminalall', {
	params: {pageNo: 1, pageSize: 20},
	filter: ""
}).then(function (data) {})
```

