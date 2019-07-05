# echarts

echarts 完整教程和文档可到 官方去看
- `echarts` <https://www.echartsjs.com/zh/index.html>
- `echarts API` <https://www.echartsjs.com/zh/api.html#echarts>
- `echarts 官方实例` <https://www.echartsjs.com/examples/zh/index.html>

## 入门

```html
<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: 900px;height: 600px;"></div>

<script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {};

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
</script>
```

## 常用API

### echarts布满div
```
grid: {
    top: '30px',
    left: '30px',
    right: '0px',
    bottom: '20px'
},
```

### 文字样式（颜色，大小等）
比较麻烦，没有整体设置，只能对应一个一个设置

* 横纵坐标
```
axisLabel: { // 坐标轴刻度标签的相关设置
  textStyle: { // 文字样式
    color: '#fff'
  }
}
```

## 常用实例

我这里仅列举几个 常用例子

### 柱状图 Bar
```js
option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
        }
    }]
};
```
