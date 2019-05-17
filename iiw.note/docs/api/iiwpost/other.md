# 其他接口

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

> 获取设备厂家
  ```js
  iAjax.post('/sys/web/syou.do?action=getSyouAll', {"data": {filter: {cascade: 'Y'}}}).then(function (data) {})
  ```
