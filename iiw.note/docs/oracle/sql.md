# 脚本

## 安防数据库初始化

一、处理空表问题

--由于oracle10是默认不导出空表，所以需修改它各表的配置，让它设置成非空

select 'alter table ' || owner ||  '.' ||table_name||' allocate extent;' from all_tables where owner like 'IOT%'

二、导出数据库

打开cmd 执行， exp ioticore/imcsoft.12345 file=E:/iotimc/backup/gx201910301640.dmp full=y

三、执行如下脚本，然后复制查询结果执行
select 'drop table ' || table_name || ';' from all_tables where owner = 'IOTICORE';

四、导入数据库
imp ioticore/imcsoft.12345 file=E:/iotimc/backup/xj201910301530.dmp full=y ignore=Y

常用数据库字段或表查询记录

模糊查询 type like '%field%'