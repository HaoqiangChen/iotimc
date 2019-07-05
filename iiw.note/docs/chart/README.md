# 大数据平台

公司大数据平台主要用angularjs + echarts + less
- `echarts` <https://www.echartsjs.com/zh/index.html>
- `echarts API` <https://www.echartsjs.com/zh/api.html#echarts>
- `echarts 官方实例` <https://www.echartsjs.com/examples/zh/index.html>
- `less 中文文档` <https://less.bootcss.com/tools/>

![大数据平台](/iotimc/chart.png)

## 新建大数据平台模块

1. 首先在`iiw.safe.datavisual` 仿照着其他子模块新建个子模块，注意命名，比如`iiw.safe.datavisual.jxjyj`
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
图表命名切记是小数点`.`拼接，而不是横杆`-`：`gxdsj.prison.map`
:::
