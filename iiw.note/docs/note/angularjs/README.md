# 内置指令

## ng-app 定义页面中应用程序

- `ng-model` 做双向绑定的
- `ng-init` 定义作用域中初始化变量值的，属性值可以定义多个变量，通过分号;间隔
- `ng-bind` 对dom绑定内容的数据（插值）；另一种插值方式为 {{}}
- `Angular.module` 获取页面中应用程序的，第一个参数是应用程序的名称，ng-app的值；第二个参数是一个依赖集合，默认如果没有依赖集合，要传递一个[]

## ng-controller 定义控制器

定义控制器（创建一个作用域），写在html（即view层）  

`App.controller` 控制器逻辑，写在js里，  
第一个参数表示控制器名称，  
第二个参数表示处理函数或者数据逻辑（即model层），作用域是一个空对象，默认是没有参数的，如果我们想使用作用域就要传递作用域参数$scope  
参数注入：在一个函数中，我们想使用哪个模块，哪个功能，哪个服务，我们就传递哪些模块，功能，服务（注意在angularjs中这些功能模块都称之为服务）

`$scope` 定义angularjs中的作用域，它本质上是一种内置的服务(预使用先注入)

## angularjs表达式

AngularJS 表达式写在双大括号内：{{ expression }}。  
AngularJS 表达式可以把数据绑定到 HTML，也可以写到属性上。
```html
<div title="{{ item.status == 'P' ? '打开':'关闭' }}">{{ expression }}</div>
```

## ng-show和ng-hide用来显隐元素的

## ng-class 动态为元素绑定类

以下 4 种绑定方式  
- （1）变量，变量可以插入多个类，通过空格隔开
> ng-class="变量1 变量2 变量3"
- （2）用{{}} 包住的变量表达式
- （3）对象，属性名为类名，属性值为布尔值，也可以用表达式的结果true或false
> {'red': x>3, 'fa-circle': x<=3}
- （4）数组，数组的每个成员表示一个类
> ng-class="{true:'green',false:'red'}[item.active]"

## ng-style 动态为元素添加样式

对象：
> {color: x.status === -1 ? '#f0ad4e' : x.status === 1?'#5cb85c':x.status === 2?'#f04124':'#a5a5a5'}

变量：
> 变量就是一个对象，就是把上面第一种方式拿到js中

## ng-if 条件模板指令

跟vue不同，没有ng-else

## ng-switch 多分支条件模板判断指令

指令根据表达式显示或隐藏对应的部分

对应的子元素使用`ng-switch-when`指令，如果匹配选中选择显示，其他为匹配的则移除。`ng-switch-default`指令设置默认选项，如果都没有匹配的情况，默认选项会显示。
```html
<element ng-switch="expression">
<element ng-switch-when="value"></element>
<element ng-switch-when="value"></element>
<element ng-switch-when="value"></element>
<element ng-switch-default></element>
</element>
```

## ng-repeat 循环模板指令

> ng-repeat="(key, type) in record.types track by key"

| $index | 索引值 | $middle | 中间 |
| :----: | :----: | :----: | :----: |
| $first | 第一次 | $last | 最后一次 |
| $even | 偶数次 | $odd | 奇数次 |

## ng-include 

指令用于包含外部的 HTML 文件 `ng-include="'myFile.html'"`

## ng-事件 

在dom中定义该事件,再到js里调用该回调函数，想传递事件对象用`$event`

## ng-href 动态为a标签创建href属性
```html
<a ng-href="{{myVar}}">{{myVar}}</a>
```

## ng-src 动态为img标签创建src属性
```html
<img ng-src="{{myVar}}">
```

## 脏值检测（表单验证）

表单元素 name 属性会映射到作用域上，Form 元素 name 属性会直接映射到作用域上，Input 等表单元素 name 属性会映射到 form 元素对应变量上。

每一个变量会有四个特殊属性，他们的组合可以表达我们表单是否可以验证成功

- $dirty 表单是否已经输入（true表示已输入）
- $pristine 表单是否没有输入过（true表示没输入）
- $valid 表单内容是否合法（true表示合法）
- $invalid 表单内容是否不合法（true表示不合法）

还有另外一些表单验证属性

- ng-required="true" 必填项
- ng-maxlength="11"，ng-minlength 长度检测
- ng-pattern="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$" 正则检测
- ng-disabled 表单是否可操作
- ng-readyonly 表单是否只读
- ng-checked 表单是否被选中
- ng-change 为表单元素绑定一个change事件，必须绑定ng-model，而且无法获取事件对象，即使传递 $event 也无法获取
- ng-submit 表单提交事件


