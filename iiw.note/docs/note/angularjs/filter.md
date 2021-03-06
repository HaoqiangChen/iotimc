# 过滤器 

过滤器是一种对插入的数据进行处理的方法，比如常用的时间格式转换，可多次过滤器，多个过滤器之间用 | 隔开

在过滤器或者自定义过滤器，所传参数可以是一个值，或者作用域的变量或者作用域中的方法(方法的话后面不要加上( )括号)

## 内置过滤器

- `Json` 将对象转化json字符串
- `Uppercase` 字符串转大写字母
- `Lowercase` 字符串转小写字母
- `Date` 格式化日期
- `Number` 对数字做处理，对整数部分，每三位加逗号，方便阅读，添加可读性  
对小数部分，做截取，最后一位四舍五入，默认截取三位，这个过滤器参数表示小数的截取位数
- `limitTo` 截取字符串或者数组，参数表示截取位数
- `Filter` 过滤器的（类似es6的filter）  
参数可以是字符串，判断数组每个成员是否包含该字符串  
参数可以是变量，会根据作用域中该变量的值进行过滤  
参数可以是函数，后面如果有( )表示 返回值，相当于一个变量  
如果后面没有( )，这个函数是一个处理函数  
- `orderBy` 对数组排序，第一个参数表示排序字段，第二个参数表示正序还是倒序，默认正序
- `Currency` 金钱转换，将数字转换为一个美元格式的，前面加上$

## 自定义过滤器

`App.filter` 两个参数，第一个参数表示过滤器的名称，第二个参数表示处理函数，函数分为：

- 第一级函数：作用域是一个空对象，没有参数，返回值就是第二级函数
- 第二级函数：作用域是window，返回值为过滤后的输出数据，  
第二级函数第一个参数表示处理的数据，从第二个参数开始表示，使用过滤器时候传递的参数
