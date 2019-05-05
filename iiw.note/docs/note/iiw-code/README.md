# 最频繁使用

安防平台平时工作笔记，记录一些安防项目的业务逻辑，业务配置和常用代码块

- 公司内网SVN仓库：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.safe>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## 单位

### 3、获取当前单位及以下单位数据
**接口：/security/information/information.do?action=getSyouDis
```
#请求参数：
{
	"data": {}
}
```
### 4、获取当前所有单位
**接口：/sys/web/syou.do?action=getSyouAll
```
#请求参数：
{
	"data": {filter: {cascade: 'Y'}}
}
```

## 监控
