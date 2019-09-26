# 大数据平台

公司大数据平台主要用angularjs + echarts + less
- `echarts` <https://www.echartsjs.com/zh/index.html>
- `echarts API` <https://www.echartsjs.com/zh/api.html#echarts>
- `echarts 官方实例` <https://www.echartsjs.com/examples/zh/index.html>
- `less 中文文档` <https://less.bootcss.com/tools/>

![大数据平台](/iotimc/chart.png)

## 开启商业智能可视化模块

1. 首先查看`virgo\release\datax`包里面是否有`com.iotimc.datax.datacenter-1.0.0.jar`和`datax.plan`，没有找包放进去
2. 查看`iiw\com.iotimc.iiw-1.0.0.jar`是否有以下包，没有找包放进去
    * iiw.datax
    * iiw.datax.charts
    * iiw.datax.charts.code
    * iiw.datax.charts.edit
    * iiw.datax.dataset
    * iiw.datax.dataset.edit
3. 权限哪里，查看是否有`商业智能可视化`，没有新建和运行脚本。

```
-- 记得执行和提交

Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('DE6135B9BCEE47E185FB1CBF9F7F802D','000000010002091','595543FC55164C7389247876ED35A23F','商业智能可视化',2,'fa-cubes',null,'datax.source',null,'fun','P',null,'DE64C89F78E64260B450A69DF64ADEC3','00000000000000000000000000000000',to_date('28-1月 -19','DD-MON-RR'),'00000000000000000000000000000000','DE64C89F78E64260B450A69DF64ADEC3',to_date('29-3月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('67E9B73CEC914FD2B8268B7A7DE10695','000000010009','595543FC55164C7389247876ED35A22F','商业智能模块',2,null,null,'dataxmodule',null,'dataxmodule','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),'547ABE978E014842BDDEAD3477345D5B','DE64C89F78E64260B450A69DF64ADEC3',to_date('29-7月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('4555E31A10074DF5A952B81D2FB81D4D','0000000100090001','67E9B73CEC914FD2B8268B7A7DE10695','数据源',3,'fa-database',null,'datax.source',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),'547ABE978E014842BDDEAD3477345D5B','DE64C89F78E64260B450A69DF64ADEC3',to_date('29-7月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('6D12C977EC134C64967914A5EC38B6A8','0000000100090002','67E9B73CEC914FD2B8268B7A7DE10695','数据作业',3,'fa-retweet',null,'datax.jobs',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('804243D169D54524B320A9149F466FED','0000000100090003','67E9B73CEC914FD2B8268B7A7DE10695','任务调度',3,'fa-tasks',null,'datax.dispatch',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('08B6DFF46F344250B663F84A8C1BF8AF','0000000100090004','67E9B73CEC914FD2B8268B7A7DE10695','数据规则',3,'fa-fire',null,'datax.datarule',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),'547ABE978E014842BDDEAD3477345D5B','DE64C89F78E64260B450A69DF64ADEC3',to_date('29-7月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('C2755487F2C84697BFD3343E7CE12385','00000001000900040001','08B6DFF46F344250B663F84A8C1BF8AF','变量库配置',4,null,null,'datax.datarule.variate',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),'0FD9D68B4D1E4062AEABEF3BDAA2B2A4','20000000000000000000000000000000',to_date('29-8月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('6DB9E63BF64448ACBD471683D97BF845','00000001000900042','08B6DFF46F344250B663F84A8C1BF8AF','常量库配置',4,null,null,'datax.datarule.constant',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('15-8月 -19','DD-MON-RR'),'547ABE978E014842BDDEAD3477345D5B','DE64C89F78E64260B450A69DF64ADEC3',to_date('15-8月 -19','DD-MON-RR'),null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('EF4C95C19D834A9B8A1BD1774A03C94D','0000000100090005','67E9B73CEC914FD2B8268B7A7DE10695','数据集',3,'fa-cubes',null,'datax.dataset',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('0ABD0904F7C64F60844140E289FD8755','0000000100090006','67E9B73CEC914FD2B8268B7A7DE10695','智能图表',3,'fa-diamond',null,'datax.charts',null,'datax','P',null,'DE64C89F78E64260B450A69DF64ADEC3','547ABE978E014842BDDEAD3477345D5B',to_date('29-7月 -19','DD-MON-RR'),null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('0CE33377559A4D1EAE85325383C75645','000000030089','C6A9C43752014EE78E05C1859EF14D45','Datax数据源',3,null,null,'/datax/datasource.do',null,'service','H',null,null,null,null,null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('74DB26C9C866457D8417D7B41829CFC9','000000030090','C6A9C43752014EE78E05C1859EF14D45','Datax ETL 模块接口',2,null,null,'/datax/etl/job.do',null,'service','H',null,null,null,null,null,null,null,null,null,'Datax ETL 模块接口');
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('56A87AA2A7D743DD96AE2E9E6A00C518','000000030090','C6A9C43752014EE78E05C1859EF14D45','Datax数据集',3,null,null,'/datax/dataset.do',null,'service','H',null,null,null,null,null,null,null,null,null,null);
Insert into SYMENU (ID,CODE,PARENTID,NAME,LEVELS,ICON,ALIAS,URL,METHOD,TYPE,STATUS,PAGE,CREUSER,CREOU,CRETIME,MODOU,MODUSER,MODTIME,SYS,COLOR,NOTES) values ('EAAEA853011F4D10B415B65433E64AA6','000000030091','C6A9C43752014EE78E05C1859EF14D45','Data View数据主题',3,null,null,'/datax/datatheme.do',null,'service','H',null,null,null,null,null,null,null,null,null,null);
```

4. 登录后台查看菜单管理菜单模块，是否已有`商业智能模块`文件夹，里面还有一些子模块在里面，如果没有，查看脚本是否成功运行，数据是否插入;
5. 新建个bi权限，勾选`商业智能模块`和全部`商业智能模块`里面的子模块;
![商业智能模块](/iotimc/business-module.png)
6. 新建个bi用户，选择bi权限。最后登录bi，查看是否成功登录打开;
![商业智能模块](/iotimc/datavisual-bi.png)

## 新建大数据平台模块

1. 首先在`iiw.safe.datavisual` 仿照着其他子模块新建个子模块，注意命名，比如`iiw.safe.datavisual.jxjyj`  
	建议仿照`iiw.safe.datavisual.btaf`和`iiw.safe.plugins.btaf`，`jxjyj`这个后面被别人改动过，多了很多不必要东西，导致包很大，开发时记得压缩图片和某些css。
2. 在`iiw.safe.plugins` 仿照着其他子模块新建个子模块，注意命名，比如`iiw.safe.plugins.jxjyj`
3. 登陆后台管理，新增或者修改 菜单 "大数据中心"，并且将路径配置好为 前两步新建的模块名
![大数据中心](/iotimc/datavisual-1.png)
4. 进行代码修改开发，其中几个注意点

__loading__
* 0%       初始化
* 20%      safeMainControllerOnEvent
* 40%      defaultStateChangeSuccess
* 60%      loadingAnimationSucccess
* 80%      mapLoadingSuccess
* 100%     chartsLoadingSuccess
分别对应地图和图表等，开发前可以先注释掉地图和图表`directives`，先将loading效果先注释掉进行主页面开发

### 大数据图表开发

1. 首先查看平台是否有`bi 智能图表系统`，有的话方便很多，一般对应两个接口`getDatatheme`或者`getDataxTheme`
![bi 智能图表系统](/iotimc/datavisual-bi.png)
2. 如果没有`bi 智能图表系统`，那么就麻烦多了，只能在数据库配置，一般对应接口是`getBindDataTheme`
    * `DATAX_SETTING_DATATHEME`这张表为`bi`账户配置主题
    * `SECTY_SCMP_DATATHEME`这张表配置主题
    * `SECTY_SCMP_DATAGRAPH`这张表配置数据主题下的图表
    * `SECTY_SCMP_DATATHEMEBIND`这张表配置用户有哪些主题
3. 步骤
    * 首先打开数据表 `syuser`，过滤`code = 'zhzx'`，复制查到的数据`id`  
    * 数据表`datathemebind` => `value = '180288CBE46244B2965E0514765F5245'` => 复制`datathemefk`  
    * 数据表`datatheme` => `id = '14637B8A9B724739ADD910131B5E357D'` => 复制`id`  
    * 数据表`datathemepath` => `datathemefk = '14637B8A9B724739ADD910131B5E357D'` => 就OK了，复制修改你所想修改的
4. 一般都是仿照`iiw.safe.plugins.gxdsj`里的`/directives/chart/safeGxdsjChart`弄多个对应的，然后对应的`chart.css`会是这个大数据图表所有图表的初始化样式。

5. 接着按照需求进行图表开发即可。

::: danger 注意
图表命名切记只能是小数点`.`拼接，而不是横杆`-`, 也不能用`_`：`gxdsj.prison.map`  
图表命名切记不能用骆驼峰命名，也就是不能用大写字母，默认好像都是小写字母：`gxdsj.prison.map`，不能用`gxdsj.prisonMap`
:::
