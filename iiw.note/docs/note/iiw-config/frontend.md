# 前台配置

常用账号`gzaf（安防）`, `zhzx（指挥中心）`, `1jq（1监区）`, `tb（图表）`等  
常用密码`123`

## 代码现场更新

详情请看`iiw.note`文件夹下`安防平台包更新说明`
前端包更新，旧包直接覆盖，新包的还需要在iiw里面的iiw.json加多配置
```json5
,"iiw.safe.noticePush":{"author":"chq","client":"192.168.0.29","date":"2019-11-13","host":"192.168.0.251","main":"noticePushController","name":"iiw.safe.noticePush","version":"0.0.1"}
```

## 更新后台包后清缓存重启服务器

清缓存文件夹分别为项目`virgo`文件夹内的`iotimclog`, `serviceability`, `work`, `wrapper\logs`
