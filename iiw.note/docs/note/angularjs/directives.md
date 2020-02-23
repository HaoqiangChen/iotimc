# 自定义指令

首先在 js 中通过`directive`方法创建自定义指令，然后再 dom 中调用

## directive 方法

第一个参数为自定义指令的名称（这里用驼峰式命名，页面中用-）  
第二个参数是处理函数：参数是空数组，因此想使用什么服务就要传递什么服务，作用域是 window，返回值是一个对象，描述自定义指令的对象，这个函数只执行一次。

> app.directive(name,function(){return {} })

该自定义指令返回值对象可以有一下属性设置：

## restrict 定义类型

有四种类型`ECMA`，举例自定义指令`my-directive`

- E 自定义元素，语法：`<my-directive></my-directive>`
- C 类的自定义指令，语法：`<div class="my-directive"></div>`
- M 注释指令，语法：`<!-- directive: my-directive -->`
- A 属性指令，语法：`<div my-directive></div>`

## template

定义内部模板，值为字符串，在字符串中我们可以使用 angular 指令，也可以使用插值语法等等

## templateUrl 定义外部模板

## replace

是否替换该元素（dom 中的元素是否删除），true 的话会用模板内容替换指令元素，flase 会将模板内容插入到指令元素内

## transclude

将自定义指令上的已知内容插入到模板中（与 replace 类似），故必须要与模板配合使用，使用方法是将设置  
transclude:true，然后在模板内容想插入的位置那里加上 ng-transclude 指令

## controller 方法

为自定义指令定义一个控制器，在控制器中通常会创建一个作用域

> controller: function($scope,$element,\$attrs){}

### \$scope 提供做作用域服务

### \$element

提供获取元素的服务，如果没有引入`jquery`，这个元素是`jqlite`对象，如果引入 jq，这个元素是 jquery 实例化对象

### \$attrs 提供获取自定义指令元素上属性的服务，

对象上每一个属性对应一个指令元素上的属性（通过驼峰式命名处理的属性名称），对象上属性值就是指令元素上的属性值

### \$attr

表示指令元素上的真实属性名称，是对\$attrs 的映射

### scope 隔离作用域配置，值有三种配置

- `scope:true`，此时自定义指令的作用域是独立的，不会受到父作用域的影响
- `scope:false`（默认），此时数据双向绑定，会互相影响
- `scope:{}`，为模板作用域，此时自定义指令会创建一个独立的作用域，并且根据是否有模板 template 属性而决定作用域效果，有 template 时效果为`scope:true`，没有 template 时效果为`scope:false`

## 作用域修饰符

跟 vue 中 props 属性很像，在 angularjs 中，想使用父作用域中的数据，可以通过属性的传递方式来实现

### @修饰符

@修饰符：实现父作用域向子作用域传递数据并覆盖的一种方式（单向的）

```html
<my-directive msg-data="{{msg}}"></my-directive> // 注意需用{{}}插值符号
scope:{msg: '@msgData'}
```

### =修饰符

=修饰符：实现父作用域与子作用域数据的一个双向绑定，这里子作用域数据会覆盖父作用域数据，以子作用域数据为准

```html
<my-directive msg-data="msg"></my-directive> // 注意不需用{{}}插值符 scope:{msg:
'=msgData'}
```

## link 方法

link 方法：对自定义指令的编译功能方法。即该自定义指令的具体功能实现。  
有三个参数：`link: function(scope,element,attrs){}`

### scope:作用域；jqlite:获取自定义指令元素 jqlite 对象；attrs:指令元素上的属性对象

### compile 方法：对指令模板 DOM 进行转换。

### compile:function(jqlite, attrs, transclude){return function(scope,jqlite,attrs){}}

同 link 方法一样的作用效果，在 link 前面执行。这两个方法不可同时使用。
angularjs 指令中的 compile 与 link 函数的区别：https://www.jianshu.com/p/e10ba0927ef1

## require

为自定义指令添加依赖服务集合，值为一个数组，将多个服务传递进来，  
当添加这个属性的时候，link 函数会增加第四个参数来表示它，如果依赖服务只有一个，可以不用数组直接书写，此时 link 方法第四个参数就是该服务

### require:['ngModel']，一个时也可这样写 require: 'ngModel'

## 作用域

Run 是应用程序的执行（启动）方法，当该方法执行之后，应用程序启动起来，在该方法中我们可以使用根作用域 \$rootScope
`ng-controller` 控制器指令，作用是用来创建作用域的

### 作用域基于原型式继承

- 1、子作用域通过继承可以使用父作用域中的数据
- 2、父作用域不能使用子作用域中的数据（原型式模式是单向的）
- 3、子作用域中定义一个与父作用域相同的变量，子作用域就不会再使用父作用域中的变量，并且也会影响到作用域中的变量，这一现象称之为覆盖

### 作用域对象

- `$parent` 表示父作用域  
  下面这三个工作中尽量不要使用
- `$$childScope` 表示子作用域
- `$$nextSibling` 下一个兄弟作用域
- `$$pervSibling` 前一个兄弟作用域

::: danger 自定义指令 如需在 页面渲染完成后执行方法：
将代码放到 `$timeout(function() {}, 0)` 里面
:::

## 例子

### 自定义 echarts 指令

```html
<letter-chart option="letter.option"></letter-chart>
```

**代码**

```js
define(['app', 'familyphone/lib/echarts.min'], function(app, echarts) {
  app.directive('letterChart', [
    'iAjax',
    'iTimeNow',
    'iMessage',
    function(iAjax, iTimeNow, iMessage) {
      return {
        restrict: 'EA',
        template: '<div style="width: 100%;height: 400px;"></div>',
        replace: true,
        scope: {
          option: '='
        },
        link: function(scope, element, array) {
          var MyChart = null
          init()
          function init(data) {
            if (MyChart) {
              MyChart.dispose()
            }
            MyChart = echarts.init(element.get(0), 'dark')
            MyChart.setOption(scope.option)
          }
        }
      }
    }
  ])
})
```

### 自定义 dialog 指令

可借鉴我在 视讯亲情电话`iiw.familyphone\modules\iiw.familyphone.homepage` 里面弄得 `tableDialog.js`指令

### 自定义 下拉框弹窗，可列表分页选择和搜索 指令

可借鉴我在 视讯亲情电话`iiw.familyphone\modules\iiw.familyphone.homepage` 里面弄得 `selectQueryModalDirectives.js`指令
