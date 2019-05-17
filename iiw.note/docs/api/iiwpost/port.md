# 前后台接口

## 设备

> 获取不同类型设备厂家
```js
iAjax.post('/security/device/device.do?action=getTypeCompanys', {filter: {type: "alarm"}})
    .then(function (data) { // 用 type 参数传不同类型标识过滤
})
```
