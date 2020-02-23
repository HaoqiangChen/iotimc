# 其他接口

## 获取登陆账号信息

* **接口：**  
sys/web/syuser.do?action=getLoginSyuser
* **响应：**  
```json5
{
	"message": "获取当前登录用户信息",
	"result": {
        "rows": {
            "birthday": 1483598661000,
            "code": "zhzx",
            "id": "B2B52AFE7F084B3A8E8CBAA61BE56F07",
            "isaddress": "N",
            "islock": "N",
            "issys": "N",
            "name": "指挥中心",
            "realname": "指挥中心",
            "status": "P",
            "syoufk": "00000000000000000000000000000000",
            "syouname": "赣州监狱"
        }
	},
	"status": 1,
	"time": 1586937786313,
	"token": ""
}
```

## 方言

* **接口：**  
/sys/web/dialect.do?action=getDialect
* **响应：**  
```json5
{
	"message": "方言获取成功",
	"result": {
		"IDL": "值班领导", "IDW": "值班干警", "MP": "重要人员", "OUN": "监", "OUN_B": "床位",
		"OUN_C": "监区", "OUN_G": "互监小组", "OUN_M": "监舍号", "OUN_MC": "督查",
		"OUN_N": "管区", "OUN_P": "监狱", "OUN_R": "监舍", "PC": "警号", "PS_C": "在册",
		"PS_R": "收押", "PS_S": "在押", "PTN_C": "罪犯", "PTN_CW": "罪犯", "PTN_L": "领导",
		"PTN_P": "干警", "PTN_PW": "警察", "PTN_W": "武警", "PTN_Z": "职工", "SC": "关押",
		"YJT_0": "减刑假释", "YJT_1": "分管等级", "YJT_11": "原判刑期", "YJT_12": "刑期起日",
        "YJT_13": "刑期止日", "YJT_14": "执行刑期", "YJT_16": "判决", "YJT_2": "罪名",
		"YJT_3": "刑期", "YJT_4": "逮捕", "YJT_5": "拘留", "YJT_6": "判决", "YJT_7": "入监",
		"YJT_8": "犯罪"
	},
	"status": 1,
	"time": 1586937786313,
	"token": ""
}
```

## 查询`sysetting表`配置

有时候像第三方等有些服务器地址或者其他啥的需要用到，但是不同单位不同配置，有些开发人员没有将信息放到后台可以查看修改的地方，而是直接就在  
数据库`sysetting表`里面添加一条数据来用，然后请求以下接口获取配置信息。

```js
iAjax.post('/security/infomanager/information.do?action=getSysettingList', {filter: {
        type: 'supergraph'
    }}).then(function (data) {
    if (data.result && data.result.rows) {}
});
```

## 查询终端V2.0配置信息

```js
// 查询终端V2.0配置信息
function getSysSetting(callback) {
	safeConfigService.getTerminalConfig(function(data) {
		terminalServerURL = data;
		if (subStringOne(terminalServerURL, '//', ':')) {
			m_sSvr = subStringOne(terminalServerURL, '//', ':') + ':7781'
		} else {
			m_sSvr = document.domain + ':7781'
		}
		if (callback) callback();
	});
}
```
