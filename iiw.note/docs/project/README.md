# 项目开发

公司除了安防平台项目，还有很多其他的大小项目。

## 安防平台

### 平时开发测试

> 用webstorm开发

![webstorm nodejs调试](/iotimc/debug-webstorm.png)

欲了解更多信息，请百度

> 用vscode开发

欲了解更多信息，请访问: <https://go.microsoft.com/fwlink/?linkid=830387>

```json5
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "hardware",
            "cwd": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiw.safe\\iiw.safe.hardware",
            "program": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiwlib\\server.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "hardware.list",
            "cwd": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiw.safe\\iiw.safe.hardware\\modules\\iiw.safe.hardware.list",
            "program": "C:\\Users\\iotimc\\Desktop\\iotimc\\iiwlib\\server.js"
        }
    ]
}
```

### 在本机部署一套安防平台测试服务

### 首先安装 oracle 数据库

首先在网上下载 oracle 软件包，以下介绍安装 oracle11g 安装教程

1. 直接去`oracle`官网<http://www.oracle.com/>进行相应版本下载，之后会有两个压缩包，下载完成后将两个文件解压到同一个目录下

::: danger 注意
路径名称最好不要出现中文和空格等不规则符号，否则之后可能出现不可预知的错误
:::

2. 解压缩文件，将两个压缩包解压到同一个文件夹中

![oracle11g安装包解压到同一目录](/iotimc/oracle11g.png)

3. 将其解压到同一个路径后，找到`database\stage\cvu\cvu_prereq.xml`用文本打开编辑添加win10适配；

```xml
<OPERATING_SYSTEM RELEASE="6.2">
    <VERSION VALUE="3"/>
    <ARCHITECTURE VALUE="64-bit"/>
    <NAME VALUE="Windows 10"/>
    <ENV_VAR_LIST>
        <ENV_VAR NAME="PATH" MAX_LENGTH="1023" />
    </ENV_VAR_LIST>
</OPERATING_SYSTEM>
```
![添加win10适配](/iotimc/oracle-setup1.png)

之后在解压文件夹中找到可执行文件【setup.exe】双击安装，配置安全更新操作，出现如下界面，点击下一步即可

![setup.exe](/iotimc/oracle-setup2.png)

4. 选择安装方式，选择仅安装数据库软件，如下图所示

![选择仅安装数据库软件](/iotimc/oracle-step4.png)

5. 网络安装选项、产品语言、数据库版本中三个步骤都默认选择即可，点击下一步

6. 安装位置中的软件位置必须安装在D盘，在软件位置中输入安装路径（默认目录：D:\oracle\product\11.2.0\dbhome_1）

![安装位置中的软件位置必须安装在D盘](/iotimc/oracle-step6.png)

7. 先决条件检查，等待检查完成查看安装环境是否允许安装，允许安装即会自动跳转至概要选项中

8. 概要选项中，点击完成按钮开始安装，如下图所示

![概要选项中，点击完成按钮开始安装](/iotimc/oracle-step8.png)

9. 开始安装oracle程序，如下图所示

![开始安装oracle程序](/iotimc/oracle-step9.png)

10. 安装完成oracle程序，点击关闭即可。

### 安防平台服务管理

1. 以系统管理员身份运行DOS命令行，如下图所示

![以系统管理员身份运行DOS命令行](/iotimc/services-step1.png)

2. 在命令行输入命令`lsnrctl start`中创建监听服务，如下图所示

![在命令行输入命令（lsnrctl start）中创建监听服务](/iotimc/services-step2.png)

3. 创建成功后，打开系统服务（可运行`services.msc`打开服务），查看是否有`OracleOraDb11g_home1TNSListener`服务，成功的状态是已启动，如下图所示

![查看是否有`OracleOraDb11g_home1TNSListener`服务](/iotimc/services-step3.png)

4. 把`OracleOraDb11g_home1TNSListener`服务的启动类型改成自动，如下图所示

![服务的启动类型改成自动](/iotimc/services-step4.png)

### 创建oracle数据库

1. 选择【开始】-->【Oracle - OraDb11g_home1】-->【配置和移植工具】-->【Database Configuration Assistant】

2. 开始创建数据库，如下图所示

![开始创建数据库](/iotimc/oracle-create1.png)
![开始创建数据库](/iotimc/oracle-create2.png)

3. 在数据库标识步骤中的全局数据库名必须为（IOTIMC），且必须大写

4. 在数据库身份证明中选择所有账户使用统一管理口令，即密码（密码统一：imcsoft.12345）

![在数据库身份证明中选择所有账户使用统一管理口令](/iotimc/oracle-create4.png)

5. 步骤6、7、8直接下一步

6. 在初始化参数的内存项中选择默认典型类型即可，如下图所示

![在初始化参数的内存项中选择默认典型类型即可](/iotimc/oracle-create9.png)

7. 在初始化参数的字符集项中必须选择使用Unicode(AL32UTF8)模式，注：此项必须选择正确，如下图所示

![在初始化参数的字符集项中必须选择使用Unicode](/iotimc/oracle-create10.png)
![数据库存储](/iotimc/oracle-create11.png)

8. 在创建选项中点击完成即开始创建，如下图所示

![在创建选项中点击完成即开始创建](/iotimc/oracle-create12.png)
![确认开始创建数据库](/iotimc/oracle-create13.png)

9. 开始安装，等待安装完成，如下图所示

![等待安装完成](/iotimc/oracle-create14.png)

10. 在安装过程中会有个提示，点击【忽略】即可，如下图所示

![点击【忽略】即可](/iotimc/oracle-create15.png)

11. 在下一个步骤中也点击忽略即可，如下图所示

![点击【忽略】即可](/iotimc/oracle-create16.png)

12. 安装完成，点击退出按钮即可

13. 打开系统服务，把其它服务都停止，启动类型都改成手动，只剩下以下两个服务并配置成自动即可，如下所示

> OracleOraDb11g_home1TNSListener  
> OracleServcieIOTIMC

至此数据库已安装完成。

### 数据库卸载

> 数据库删除

1. 选择【开始】-->【Oracle - OraDb11g_home1】-->【配置和移植工具】-->【Database Configuration Assistant】，如下图所示

::: danger 注意
此操作会删除数据库中所有数据库数据，请谨慎操作。
:::

![数据库删除](/iotimc/oracle-delete1.png)

2. 在操作项中选择删除数据库，如下图所示：

![选择删除数据库](/iotimc/oracle-delete2.png)

3. 选择需要删除数据库、用户名（sys）、密码（imsoft.12345），此密码就是安装时的密码

![选择需要删除的数据库](/iotimc/oracle-delete3.png)

4. 点击完成按钮开始删除管理，如下图所示：

![点击完成按钮开始删除管理](/iotimc/oracle-delete4.png)

5. 点击【否】即可完成删除操作，如下图所示：

![点击【否】即可完成删除操作](/iotimc/oracle-delete5.png)

至此完成数据库的删除管理。

> oracle 程序卸载

需要完成所有数据库的删除管理后，才能按下面oracle步骤程序卸载。

1. 选择【开始】-->【Oracle - OraDb11g_home1】-->【Oracle安装产品】-->【Universal Installer】

2. 在卸载管理中选择卸载产品，如下图所示：

![oracle卸载](/iotimc/oracle-uninstall1.png)
![oracle卸载](/iotimc/oracle-uninstall2.png)
![oracle卸载](/iotimc/oracle-uninstall3.png)

3. 重新启动计算机，并手工删除 D:\oracle目录即可完成整个oracle程序的卸载。

### 验证安装

> SQLPlus验证

在命令行Dos下依次输入
```bash
set oracle_sid = IOTIMC

sqlplus "/ as sysdba"

select name from v$database;
```

![SQLPlus验证](/iotimc/SQLPlus.png)
如上图所示，没有错误信息，表示验证成功！

> SQLDeveloper工具验证

1. 网上下载安装SQLDeveloper工具，之后打开SQLDevelpor工具，点击添加连接按钮弹出连接框

2. 在连接框中输入连接信息，如下图所示

![SQLDeveloper工具验证](/iotimc/SQLDeveloper1.png)

3. 输入信息完成后，点击test按钮，查看以上Status:状态如何，如果是Success状态则说明连接成功

<div id="createUserSql"></div>

4. 创建用户脚本.sql

```bash
-- ioticore
--***********************创建表空间***************************
CREATE SMALLFILE TABLESPACE IOTICORE DATAFILE 'IOTICORE.dbf' SIZE 1M AUTOEXTEND ON NEXT 1M MAXSIZE UNLIMITED LOGGING EXTENT MANAGEMENT LOCAL SEGMENT SPACE MANAGEMENT AUTO;

-- ***********************创建用户***************************
-- USER SQL
CREATE USER IOTICORE IDENTIFIED BY "imcsoft.12345" 
DEFAULT TABLESPACE IOTICORE
TEMPORARY TABLESPACE TEMP;

-- ***********************分配角色***************************
GRANT "DBA" TO IOTICORE;
GRANT "CONNECT" TO IOTICORE;
GRANT "RESOURCE" TO IOTICORE;
ALTER USER IOTICORE DEFAULT ROLE "DBA","CONNECT","RESOURCE";
GRANT UNLIMITED TABLESPACE TO IOTICORE;

EXIT;
```

### 安防平台系统程序部署

以下以部署新疆乌鲁木齐安防平台测试服务器说明

> 安防数据库初始化

1. 将现场数据库数据导出，首先进入现场数据库处理空表问题，执行以下脚本

```bash
--由于oracle10是默认不导出空表,所以需修改它各表的配置,让它设置成非空

select 'alter table ' || owner ||  '.' ||table_name||' allocate extent;' from all_tables where owner like 'IOT%'
```

2. 处理空表之后将数据全部导出到E盘备份目录下（也可导出到其他地方，改动下路径即可），打开DOS命令执行以下命令，之后耐心等待

```bash
exp ioticore/imcsoft.12345 file=E:/iotimc/backup/xj201910301530.dmp full=y
```

3. 拿到现场数据之后，导入到你要搭建的测试服务器中，先打开创建好的oracle IOTIMC数据库，执行以下脚本

```bash
--执行如下脚本,然后复制查询结果执行

select 'drop table ' || table_name || ';' from all_tables where owner = 'IOTICORE';
```

4. 打开DOS命令执行以下命令，命令中的路径为你在现场所拿到的现场数据dmp，如果不相同请修改，执行之后请耐心等待即可

```bash
imp ioticore/imcsoft.12345 file=E:/iotimc/backup/xj201910301530.dmp full=y ignore=Y
```

> 安防源码程序部署

1. 把部署程序IOTIMCSoft复制到D盘根目录

2. 运行D:\IOTIMCSoft\virgo\InstallVirgo.bat文件

3. 服务中将会多IOTIMC Service Application一个（主服务）

4. 运行D:\IOTIMCSoft\virgo-client\InstallVirgo.bat文件

5. 服务中将会多IOTIMC Client Service Application一个（分布式1），至于其他分布式服务也是如此操作

6、启动主服务IOTIMC Service Application，启动服务改为自动

7、进入D:\IOTIMCSoft\virgo\wrapper\logs\wrapper.log，找到注册信息
（DBA9DC590DE2317E881B8558A7191343.V2.0）填写注册申请表，等待注册key

> 修改安防系统配置文件

1. 用记事本或者notepad++ 打开`D:\IOTIMCSoft\virgo\configuration\ioticore-config.xml`

将里面的ip全部改成你准备部署的电脑的ip即可

分布式服务下的`ioticore-config.xml`也是同样修改

```xml
<?xml version="1.0" encoding="UTF-8"?>
<iotimc>
	<mq mqname="192.168.11.27.server"/>
	<address>192.168.11.27</address>
	
	<remote state="1" type="server">
		<delegate port="9100"/>
		<rmi ip="192.168.11.27" port="9111"/>
	</remote>
	
	<datasources>
		<datasource>
			<driver>oracle.jdbc.OracleDriver</driver>
			<driverUrl>jdbc:oracle:thin:@192.168.11.27:1521:IOTIMC</driverUrl>
			<user>ioticore</user>
			<password>imcsoft.12345</password>
		</datasource>
		<!-- 提供客户端ioticore数据源 -->
		<datasource jndiName="ioticore" name="ioticore">
			<driver>oracle.jdbc.OracleDriver</driver>
			<driverUrl>jdbc:oracle:thin:@192.168.11.27:1521:IOTIMC</driverUrl>
			<user>ioticore</user>
			<password>imcsoft.12345</password>
		</datasource>
	</datasources>
	
	<log level="INFO">
		<appender name="defaultFile" />
		<appender name="defaultConsole" />
	</log>
	
</iotimc>
```

2. 用记事本或者notepad++ 打开`D:\IOTIMCSoft\virgo\configuration\tomcat-server.xml`，修改网站端口

一般为`第29行代码`，可将`8080`改为其他未使用端口
```xml
<Service name="Catalina">
    <!--可将8080改为其他未使用端口-->
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />

    <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
               maxThreads="150" scheme="https" secure="true"
               clientAuth="false" sslProtocol="TLS"
               keystoreFile="configuration/keystore"
               keystorePass="changeit"/>
```

拿到公司发给的key文件之后重命名为`reg.key`，之后覆盖掉`D:\IOTIMCSoft\virgo\configuration`目录下的`reg.key`文件即可更新key。

至此，系统部署配置文件已完成，更新注册key；重启服务；即可运行系统。

> 部署多个安防平台测试环境

1. 首先，创建新用户表空间，运行上面的[创建用户脚本](#createUserSql)，不过要将`IOTICORE`全部替换成新的用户名，比如 乌鲁木齐可以改成`IMCWLMQ`

2. 然后导入现场数据到`IMCWLMQ`表空间

防止有多个oracle的sid，需要提前指定 `set ORACLE_SID=iotimc`
```bash
set ORACLE_SID=iotimc
imp imcwlmq/imcsoft.12345 file=E:/iotimc/backup/imcwlmq.dmp full=y ignore=Y
```

3. 按照上面教程修改安防系统配置文件

改ip，改端口9111要改，9100可以不用改，改数据库用户名，改tomcat-server端口
```xml
<remote state="1" type="server">
    <delegate port="9100"/>
    <rmi ip="" port="9111"/>
</remote>
<datasources>
    <datasource type="druid">
        <driver>oracle.jdbc.OracleDriver</driver>
        <driverUrl>jdbc:oracle:thin:@192.168.1.166:1521:iotimc</driverUrl>
        <user>imcwlmq</user>
        <password>imcsoft.12345</password>
    </datasource>
</datasources>
```

4. 修改服务名

用记事本或者notepad++ 打开`D:\IOTIMCSoft\virgo\wrapper\conf\virgo.conf`

第40行将`9797`加1  
`wrapper.java.additional.4=-Xrunjdwp:transport=dt_socket,suspend=n,address=9797,server=y`

第50行将`9875`加1  
`wrapper.java.additional.14=-Dcom.sun.management.jmxremote.port=9875`

将下面里面那几个服务名修改

```markdown
# Name of the service
wrapper.name=IOTIMCService

# Display name of the service
wrapper.displayname=IOTIMC Service Application

# Description of the service
wrapper.description=IOTIMC Service Application Description
```

5. 运行`InstallVirgo.bat`文件，替换`reg.key`
::: tip reg.key
同一台服务器多个安防平台测试环境均可用同个`reg.key`
:::

