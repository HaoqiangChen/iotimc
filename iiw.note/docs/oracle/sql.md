# 脚本

## 安防数据库初始化

一、处理空表问题

--由于oracle10是默认不导出空表，所以需修改它各表的配置，让它设置成非空

select 'alter table ' || owner ||  '.' ||table_name||' allocate extent;' from all_tables where owner like 'IOT%'

二、导出数据库

exp ioticore/imcsoft.12345 file=E:/iotimc/backup/gx201910301640.dmp full=y

三、执行如下脚本，然后复制查询结果执行

select 'drop table ' || table_name || ';' from all_tables where owner = 'IOTICORE';

四、导入数据库

imp ioticore/imcsoft.12345 file=E:/iotimc/backup/xj201910301530.dmp full=y ignore=Y

## 添加业务权限

查找表`symenu`过滤`type = 'role'`  
然后 在字段`code`最大的基础上往上加多一条数据

Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('EDD3742CDE564CB79D78D6AB553A7F48','005000010306','595543FC55164C7389247876ED35A25F','消息通知发布权限',2,null,null,'messageSend',null,'role','P',null,'DE64C89F78E64260B450A69DF64ADEC3','00000000000000000000000000000000',to_date('31-8月 -16','DD-MON-RR'),null,null,null,null,null,'是否有权限发布消息通知');

其中`messageSend`为权限标识，用于 接口获取某个固定权限所用到的参数值

之后请求接口：`security/check/check.do?action=getSpecialrole`  
传递的参数`filter: {url: ['权限标识']}`
