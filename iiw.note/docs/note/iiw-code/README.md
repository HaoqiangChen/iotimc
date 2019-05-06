# 最频繁使用

安防平台平时工作笔记，记录一些安防项目的业务逻辑，业务配置和常用代码块

- 公司内网SVN仓库：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.safe>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## 页面跳转

语法：$state.go('跳转模块', '参数')

**实例**
```js
if (item) {
   $state.params = {
      data: item
   };
   switch (item.type) {
      case 'wjlx_ftwj':
         $state.go('system.ftappquestionnaire', $state.params);
         break;
      case 'wjlx_lb':
         $state.go('system.ftappscale', $state.params);
         break;
   }
} else {
   $state.params = {
      data: null
   };
   _remind(4, '错误操作!');
}
```

::: tip 提示
跳转页面那里需注入`$stateParams`获取参数值`$stateParams.data`
:::

## 父子组件之间通信

发送消息：$scope.sendMessage  
广播：$rootScope.$broadcast('自命名一个通信字段', '参数');  
接收消息：$scope.$on('刚命名的通信字段', function(){})
