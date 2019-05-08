# 前端配置

常用账号`gzaf（安防）`, `zhzx（指挥中心）`, `1jq（1监区）`, `tb（图表）`等  
常用密码`123`

## 代码现场更新

前端包更新，旧包直接覆盖，新包的还需要在iiw里面的iiw.json加多配置
```json5
,"iiw.safe.noticePush":{"author":"chq","client":"192.168.0.29","date":"2019-11-13","host":"192.168.0.251","main":"noticePushController","name":"iiw.safe.noticePush","version":"0.0.1"}
```

## 安防平台测试服务器部署开发

查看安防平台项目_安装手册V1.0.doc（公司保密文件）

## 切换现场版本

出差如何将笔记本测试服务器切换现场版本  
首先将现场主服务`vigor`拷贝出来放到笔记本，然后打开`vigor/configuration/iotimc-config.xml`，将代码修改为以下  
最后将同样目录下`（vigor/configuration/）`的秘钥`reg.key`替换下就可以了。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<iotimc>
	<!-- <mq mqname="10.11.2.102.server"/> -->
	<context-name>security</context-name>
	<version>1.0</version>
	<!-- <address>10.11.2.102</address> -->

	<!-- <remote state="1" type="server">
		<delegate port="9100"/>
		<rmi ip="10.11.2.102" port="9111"/>
	</remote> -->
	<remote state="1" type="server">
		<delegate port="9100"/>
		<rmi ip="127.0.0.1" port="9111"/>
	</remote>

	<datasources>
		<datasource>
			<driver>oracle.jdbc.OracleDriver</driver>
			<driverUrl>jdbc:oracle:thin:@127.0.0.1:1521:iotimc</driverUrl>
			<user>ioticore</user>
			<password>imcsoft.12345</password>
		</datasource>
		<!-- <datasource>
			<driver>oracle.jdbc.OracleDriver</driver>
			<driverUrl>jdbc:oracle:thin:@10.11.2.102:1521:IOTIMC</driverUrl>
			<user>ioticore</user>
			<password>imcsoft.12345</password>
		</datasource> -->
		<!-- 提供客户端ioticore数据源 -->
		<!-- <datasource jndiName="ioticore" name="ioticore">
			<driver>oracle.jdbc.OracleDriver</driver>
			<driverUrl>jdbc:oracle:thin:@10.11.2.102:1521:IOTIMC</driverUrl>
			<user>ioticore</user>
			<password>imcsoft.12345</password>
		</datasource> -->
	</datasources>

	<log level="INFO">
		<appender name="defaultFile" />
		<appender name="defaultConsole" />
	</log>

</iotimc>
```

## 更新后台包后清缓存重启服务器

清缓存文件夹分别为项目`virgo`文件夹内的`iotimclog`, `serviceability`, `work`, `wrapper\logs`
