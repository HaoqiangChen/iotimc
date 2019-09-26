(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{377:function(t,a,e){"use strict";e.r(a);var s=e(19),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"自定义指令"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#自定义指令"}},[t._v("#")]),t._v(" 自定义指令")]),t._v(" "),e("p",[t._v("首先在js中通过"),e("code",[t._v("directive")]),t._v("方法创建自定义指令，然后再dom中调用")]),t._v(" "),e("h2",{attrs:{id:"directive-方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#directive-方法"}},[t._v("#")]),t._v(" directive 方法")]),t._v(" "),e("p",[t._v("第一个参数为自定义指令的名称（这里用驼峰式命名，页面中用-）"),e("br"),t._v("\n第二个参数是处理函数：参数是空数组，因此想使用什么服务就要传递什么服务，作用域是window，返回值是一个对象，描述自定义指令的对象，这个函数只执行一次。")]),t._v(" "),e("blockquote",[e("p",[t._v("app.directive(name,function(){return {} })")])]),t._v(" "),e("p",[t._v("该自定义指令返回值对象可以有一下属性设置：")]),t._v(" "),e("h2",{attrs:{id:"restrict-定义类型"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#restrict-定义类型"}},[t._v("#")]),t._v(" restrict 定义类型")]),t._v(" "),e("p",[t._v("有四种类型"),e("code",[t._v("ECMA")]),t._v("，举例自定义指令"),e("code",[t._v("my-directive")])]),t._v(" "),e("ul",[e("li",[t._v("E 自定义元素，语法："),e("code",[t._v("<my-directive></my-directive>")])]),t._v(" "),e("li",[t._v("C 类的自定义指令，语法："),e("code",[t._v('<div class="my-directive"></div>')])]),t._v(" "),e("li",[t._v("M 注释指令，语法："),e("code",[t._v("\x3c!-- directive: my-directive --\x3e")])]),t._v(" "),e("li",[t._v("A 属性指令，语法："),e("code",[t._v("<div my-directive></div>")])])]),t._v(" "),e("h2",{attrs:{id:"template"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#template"}},[t._v("#")]),t._v(" template")]),t._v(" "),e("p",[t._v("定义内部模板，值为字符串，在字符串中我们可以使用angular指令，也可以使用插值语法等等")]),t._v(" "),e("h2",{attrs:{id:"templateurl-定义外部模板"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#templateurl-定义外部模板"}},[t._v("#")]),t._v(" templateUrl 定义外部模板")]),t._v(" "),e("h2",{attrs:{id:"replace"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#replace"}},[t._v("#")]),t._v(" replace")]),t._v(" "),e("p",[t._v("是否替换该元素（dom中的元素是否删除），true的话会用模板内容替换指令元素，flase会将模板内容插入到指令元素内")]),t._v(" "),e("h2",{attrs:{id:"transclude"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#transclude"}},[t._v("#")]),t._v(" transclude")]),t._v(" "),e("p",[t._v("将自定义指令上的已知内容插入到模板中（与replace类似），故必须要与模板配合使用，使用方法是将设置"),e("br"),t._v("\ntransclude:true，然后在模板内容想插入的位置那里加上ng-transclude指令")]),t._v(" "),e("h2",{attrs:{id:"controller方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#controller方法"}},[t._v("#")]),t._v(" controller方法")]),t._v(" "),e("p",[t._v("为自定义指令定义一个控制器，在控制器中通常会创建一个作用域")]),t._v(" "),e("blockquote",[e("p",[t._v("controller: function($scope,$element,$attrs){}")])]),t._v(" "),e("h3",{attrs:{id:"scope-提供做作用域服务"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#scope-提供做作用域服务"}},[t._v("#")]),t._v(" $scope 提供做作用域服务")]),t._v(" "),e("h3",{attrs:{id:"element"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#element"}},[t._v("#")]),t._v(" $element")]),t._v(" "),e("p",[t._v("提供获取元素的服务，如果没有引入"),e("code",[t._v("jquery")]),t._v("，这个元素是"),e("code",[t._v("jqlite")]),t._v("对象，如果引入jq，这个元素是 jquery 实例化对象")]),t._v(" "),e("h3",{attrs:{id:"attrs-提供获取自定义指令元素上属性的服务"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#attrs-提供获取自定义指令元素上属性的服务"}},[t._v("#")]),t._v(" $attrs 提供获取自定义指令元素上属性的服务，")]),t._v(" "),e("p",[t._v("对象上每一个属性对应一个指令元素上的属性（通过驼峰式命名处理的属性名称），对象上属性值就是指令元素上的属性值")]),t._v(" "),e("h3",{attrs:{id:"attr"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#attr"}},[t._v("#")]),t._v(" $attr")]),t._v(" "),e("p",[t._v("表示指令元素上的真实属性名称，是对$attrs的映射")]),t._v(" "),e("h3",{attrs:{id:"scope-隔离作用域配置-值有三种配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#scope-隔离作用域配置-值有三种配置"}},[t._v("#")]),t._v(" scope 隔离作用域配置，值有三种配置")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("scope:true")]),t._v("，此时自定义指令的作用域是独立的，不会受到父作用域的影响")]),t._v(" "),e("li",[e("code",[t._v("scope:false")]),t._v("（默认），此时数据双向绑定，会互相影响")]),t._v(" "),e("li",[e("code",[t._v("scope:{}")]),t._v("，为模板作用域，此时自定义指令会创建一个独立的作用域，并且根据是否有模板template属性而决定作用域效果，有template时效果为"),e("code",[t._v("scope:true")]),t._v("，没有template时效果为"),e("code",[t._v("scope:false")])])]),t._v(" "),e("h2",{attrs:{id:"作用域修饰符"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#作用域修饰符"}},[t._v("#")]),t._v(" 作用域修饰符")]),t._v(" "),e("p",[t._v("跟vue中props属性很像，在angularjs中，想使用父作用域中的数据，可以通过属性的传递方式来实现")]),t._v(" "),e("h3",{attrs:{id:"修饰符"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#修饰符"}},[t._v("#")]),t._v(" @修饰符")]),t._v(" "),e("p",[t._v("@修饰符：实现父作用域向子作用域传递数据并覆盖的一种方式（单向的）")]),t._v(" "),e("div",{staticClass:"language-html extra-class"},[e("pre",{pre:!0,attrs:{class:"language-html"}},[e("code",[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("my-directive")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("msg-data")]),e("span",{pre:!0,attrs:{class:"token attr-value"}},[e("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("{{msg}}"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("my-directive")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" // 注意需用{{}}插值符号\nscope:{msg: '@msgData'}\n")])])]),e("h3",{attrs:{id:"修饰符-2"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#修饰符-2"}},[t._v("#")]),t._v(" =修饰符")]),t._v(" "),e("p",[t._v("=修饰符：实现父作用域与子作用域数据的一个双向绑定，这里子作用域数据会覆盖父作用域数据，以子作用域数据为准")]),t._v(" "),e("div",{staticClass:"language-html extra-class"},[e("pre",{pre:!0,attrs:{class:"language-html"}},[e("code",[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("my-directive")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("msg-data")]),e("span",{pre:!0,attrs:{class:"token attr-value"}},[e("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("msg"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token tag"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("my-directive")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" // 注意不需用{{}}插值符\nscope:{msg: '=msgData'}\n")])])]),e("h2",{attrs:{id:"link方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#link方法"}},[t._v("#")]),t._v(" link方法")]),t._v(" "),e("p",[t._v("link方法：对自定义指令的编译功能方法。即该自定义指令的具体功能实现。"),e("br"),t._v("\n有三个参数："),e("code",[t._v("link: function(scope,element,attrs){}")])]),t._v(" "),e("h3",{attrs:{id:"scope-作用域-jqlite-获取自定义指令元素jqlite对象-attrs-指令元素上的属性对象"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#scope-作用域-jqlite-获取自定义指令元素jqlite对象-attrs-指令元素上的属性对象"}},[t._v("#")]),t._v(" scope:作用域；jqlite:获取自定义指令元素jqlite对象；attrs:指令元素上的属性对象")]),t._v(" "),e("h3",{attrs:{id:"compile方法-对指令模板dom进行转换。"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#compile方法-对指令模板dom进行转换。"}},[t._v("#")]),t._v(" compile方法：对指令模板DOM进行转换。")]),t._v(" "),e("h3",{attrs:{id:"compile-function-jqlite-attrs-transclude-return-function-scope-jqlite-attrs"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#compile-function-jqlite-attrs-transclude-return-function-scope-jqlite-attrs"}},[t._v("#")]),t._v(" compile:function(jqlite, attrs, transclude){return function(scope,jqlite,attrs){}}")]),t._v(" "),e("p",[t._v("同link方法一样的作用效果，在link前面执行。这两个方法不可同时使用。\nangularjs指令中的compile与link函数的区别：https://www.jianshu.com/p/e10ba0927ef1")]),t._v(" "),e("h2",{attrs:{id:"require"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#require"}},[t._v("#")]),t._v(" require")]),t._v(" "),e("p",[t._v("为自定义指令添加依赖服务集合，值为一个数组，将多个服务传递进来，"),e("br"),t._v("\n当添加这个属性的时候，link函数会增加第四个参数来表示它，如果依赖服务只有一个，可以不用数组直接书写，此时link方法第四个参数就是该服务")]),t._v(" "),e("h3",{attrs:{id:"require-ngmodel-一个时也可这样写require-ngmodel"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#require-ngmodel-一个时也可这样写require-ngmodel"}},[t._v("#")]),t._v(" require:['ngModel']，一个时也可这样写require: 'ngModel'")]),t._v(" "),e("h2",{attrs:{id:"作用域"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#作用域"}},[t._v("#")]),t._v(" 作用域")]),t._v(" "),e("p",[t._v("Run 是应用程序的执行（启动）方法，当该方法执行之后，应用程序启动起来，在该方法中我们可以使用根作用域 $rootScope\n"),e("code",[t._v("ng-controller")]),t._v(" 控制器指令，作用是用来创建作用域的")]),t._v(" "),e("h3",{attrs:{id:"作用域基于原型式继承"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#作用域基于原型式继承"}},[t._v("#")]),t._v(" 作用域基于原型式继承")]),t._v(" "),e("ul",[e("li",[t._v("1、子作用域通过继承可以使用父作用域中的数据")]),t._v(" "),e("li",[t._v("2、父作用域不能使用子作用域中的数据（原型式模式是单向的）")]),t._v(" "),e("li",[t._v("3、子作用域中定义一个与父作用域相同的变量，子作用域就不会再使用父作用域中的变量，并且也会影响到作用域中的变量，这一现象称之为覆盖")])]),t._v(" "),e("h3",{attrs:{id:"作用域对象"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#作用域对象"}},[t._v("#")]),t._v(" 作用域对象")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("$parent")]),t._v(" 表示父作用域"),e("br"),t._v("\n下面这三个工作中尽量不要使用")]),t._v(" "),e("li",[e("code",[t._v("$$childScope")]),t._v(" 表示子作用域")]),t._v(" "),e("li",[e("code",[t._v("$$nextSibling")]),t._v(" 下一个兄弟作用域")]),t._v(" "),e("li",[e("code",[t._v("$$pervSibling")]),t._v(" 前一个兄弟作用域")])])])}),[],!1,null,null,null);a.default=r.exports}}]);