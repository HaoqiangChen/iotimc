# 服务

是给控制器使用的（这一类服务是需要参数注入的），服务是在js中使用的，服务就是封装的一组功能

## 内建服务

## $timeout服务
$timeout服务，封装setTimeout方法，实现定时器功能。为什么要用这个，因为一般异步操作，会造成作用域丢失。即在作用域中绑定新的数据，没有渲染到页面中，这种问题就叫做作用域丢失。

解决作用域丢失问题方法有四种：
- 方法一：`$timeout(function(){}, 1000)`
- 方法二：通过`$digest()`方法进行作用域检测，只能检测在该方法调用的前面的数据。`$rootScope.date = '11月20日'; $rootScope.$digest();`
- 方法三：通过`$apply()`方法进行检测，效果同`$digest()`方法一样
- 方法四：通过`$apply`传递回调函数，在回调函数中修改作用域，该方法前面一级回调函数内数据没有丢失，在$apply()方法后面的数据丢失了。
> $rootScope.$apply(function(){$rootScope.date = '11月20日';});

## $location 
返回当前页面的 URL 地址：
> $scope.myUrl = $location.absUrl();

## $http服务
服务向服务器发送请求，应用响应服务器传送过来的数据。
```js
$http.get("welcome.htm").then(function (response) {
    $scope.myWelcome = response.data;
});
```
## $interval 循环计时器服务
```js
$interval(function(){console.log(111)},1000)
```
## $watch 方法，可以实现对属性值的监听。
```js
$scope.$watch('name',function(newValue, oldValue){}) // 当要监听对象里的每一个属性变化时，要加上第三个参数true
$scope.$watch('obj',function(newValue, oldValue){},true)
```
# 五种服务用法
## constant服务
> app.constant('name',obj)

name为服务的名字,obj为一个对象。  
举例：`app.constant('APP_KEY','a1s2d3f4')`
`constant`用于定义常量，一旦定义就不能被改变。可以被注入到任何地方，但是不能被装饰器(decorator)装饰。

## value服务
> app.value('name',obj)

name为服务的名字,obj为一个对象。  
举例：`app.value('version', '1.0')  `
与 `constant` 一样，可以用来定义值。但与 constant 的区别是：可以被修改，可以被 decorator 装饰，不能被注入到 config 中。

## factory服务
> app.factory('name',function(){return obj})

`name`为服务的名字,第二个参数传入一个函数,函数需要有一个返回值obj,返回一个对象。实际被注入的服务就是这个对象。
```js
app.factory('myFactory', function () {
    var fac = {};
    fac.a = 'hello world';
    fac.foo = function () {};
    return fac;
})
```
`factory`服务是最常见最常用的服务类型,几乎可以满足90%的自己开发的需求,使用它可以编写一些逻辑,通过这些逻辑最后返回所需要的对象. 它和`constant,value`最大的区别是,factory服务是有一个处理过程,经过这个过程,才返回结果的.  
factory 是一个函数用于返回值,通常我们使用 factory 函数来计算或返回值。(factory使用上，与service差距不大)

## service服务
> app.service('name',constructor)

`name`为服务的名字,`constructor`是一个构造函数。
```js
app.service('myService', function () {
    var a = '';
    this.setA = function () {};
    this.getA = function () {};
    this.foo = function () {};
})
```
`service`和`factory`的区别在于,它第二个参数传入的是一个构造函数,最后被注入的服务是这个构造函数实例化以后的结果.所以基本上使用service创建的服务的,也都可以使用factory来创建。

## provider服务
> app.provider('name',function(){})

`name`为服务的名字,第二个参数接受一个函数,函数由两部分组成。第一部分的变量和函数是可以在`app.config`函数中访问的。第二部分的变量和函数是通过`$get()`函数返回的
```js
app.provider('myProvider', function () {
    var a = '';
    var func = function () {};
    return {
        $get: function () {
            foo: function () {},
            a: a
        }
    }
})
```
$get方法就相当于factory服务的第二个参数,最后要返回一个对象,这个对象就是真正被注入的服务。

怎么选择这些服务的使用？  
一些固定的参数和方法,使用constant  
可能被修改的参数和方法,使用value  
通过逻辑处理后得到的参数或方法,使用factory  
可以使用factory的也可以使用service,反之亦然(一般就是用factory)  
可以手动配置参数的服务,使用provider
