# echarts

echarts 完整教程和文档可到 官方去看

- `echarts` <https://echarts.apache.org/v4/zh/index.html>
- `echarts API` <https://echarts.apache.org/v4/zh/api.html#echarts>
- `echarts 官方实例` <https://echarts.apache.org/v4/examples/zh/index.html>

## 入门

```html
<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: 900px;height: 600px;"></div>

<script>
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'))

  // 指定图表的配置项和数据
  var option = {}

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option)
</script>
```

## 常用 API

### echarts 布满 div

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

- 横纵坐标

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
$scope.doorYesterday = [
  { name: '二师乌鲁克监狱', num: 8728 },
  { name: '三师盖米里克监狱', num: 7489 },
  { name: '三师其盖麦旦监狱', num: 7134 },
  { name: '一师幸福城监狱', num: 5281 },
  { name: '一师阿拉尔监狱', num: 4677 },
  { name: '二师库尔勒监狱', num: 3874 },
  { name: '六师芳草湖监狱', num: 1915 },
  { name: '二师且末监狱', num: 24 }
]
var barOption = {
  backgroundColor: '#2c343c',
  color: ['#02c6ff'],
  tooltip: {
    trigger: 'axis'
  },
  // grid: { // echarts布满div
  //   top: '80px',
  //   left: '80px',
  //   right: '20px',
  //   bottom: '30px'
  // },
  axisLabel: {
    textStyle: {
      fontSize: 16,
      color: function(name) {
        return name == $scope.device.unit.name ? '#f9d74e' : '#fff'
      }
    }
  },
  xAxis: [
    {
      type: 'category',
      splitLine: {
        // 去掉网格线
        show: false
      },
      axisLine: {
        // 坐标线
        show: false,
        lineStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        // 坐标刻度
        show: false
      },
      axisPointer: {
        // 去掉指示器中线
        type: 'none'
      },
      data: _.pluck($scope.doorYesterday, 'name')
    }
  ],
  yAxis: [
    {
      type: 'value',
      inverse: true, // 反向
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: '门禁类设备统计',
      type: 'bar',
      // barWidth: '60%',
      label: {
        normal: {
          show: true,
          position: 'right'
        }
      },
      itemStyle: {
        normal: {
          color: function(params) {
            return params.name == $scope.device.unit.name
              ? '#f9d74e'
              : '#ff3939'
          }
        }
      },
      data: _.pluck($scope.doorYesterday, 'num')
    }
  ]
}

var barChart = echarts.init(document.getElementById('barChart'))
// 点击柱状图才能触发点击事件
// barChart.on('click',function(params){
// console.log(params.data)
// });
// 点击柱状图阴影也能触发点击事件
// barChart.getZr().off('click');
// barChart.getZr().on('click',function(params){
// console.log(params)
// var pointInPixel = [params.offsetX, params.offsetY];
// if (barChart.containPixel('grid', pointInPixel)) {
//	 取[0]还是取[1]取决于 哪个坐标轴是 value
//   var xIndex = barChart.convertFromPixel({seriesIndex: 0}, [params.offsetX, params.offsetY])[0];
//   console.log(xIndex)
//	 barChart.setOption(barOption); // 点击重新渲染
// }
// });

// 阴影光标显示手掌
// barChart.getZr().on('mousemove', function(params) {
//   var pointInPixel = [params.offsetX, params.offsetY];
//   if (barChart.containPixel('grid', pointInPixel)) {
//     barChart.getZr().setCursorStyle('pointer');
//   }
// });
barChart.setOption(barOption)
```

### 饼图 Pie

```js
$scope.deviceBrand = [
  { name: '大华NVR通道', value: 2059 },
  { name: '大华NVR', value: 780 },
  { name: '海康解码器电视墙（DS-65XX-B20）', value: 1000 }
]
var pieOption = {
  tooltip: {
    trigger: 'item',
    // formatter: '{a} <br/>{b} : {c} ({d}%)'
    formatter: function(params) {
      return (
        params.seriesName +
        '<br/>' +
        params.name +
        ': ' +
        params.data.value +
        '个' +
        ' (' +
        params.percent +
        '%)'
      )
    }
  },
  color: [
    '#42d286',
    '#00c7ff',
    '#f59040',
    '#fa5858',
    '#fff',
    '#f7d358',
    '#fa58f4'
  ],
  series: [
    {
      name: $scope.device.unit.tname,
      type: 'pie',
      minAngle: 10, // 设置最小扇区角度防止太小看不到
      startAngle: 0,
      radius: '80%', // 设置画面占比, grid属性对饼图无效
      center: ['50%', '50%'],
      data: $scope.deviceBrand,
      roseType: 'radius', // 南丁格尔图
      label: {
        normal: {
          // position: 'inner',
          formatter: function(params) {
            // 防止文字重叠换行
            var text = ''
            var num = 5
            var rowNum = Math.ceil(params.name.length / num)
            if (rowNum > 1) {
              for (var i = 0; i < rowNum; i++) {
                if (i == rowNum - 1) {
                  text += params.name.substring(num * i, num * (i + 1)) + ':\n'
                } else {
                  text += params.name.substring(num * i, num * (i + 1)) + '\n'
                }
              }
              console.log(text)
              return text + params.data.value + ' 个'
            } else {
              return params.name + ':\n' + params.data.value + ' 个'
            }
          }
        }
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function(idx) {
        return Math.random() * 200
      }
    }
  ]
}
```

### 环形图

```js
option = {
  backgroundColor: '',
  color: ['#D6B636', '#26924E', '#A70411'],
  title: {
    zlevel: 0,
    text: ['{name|信件数量}', '{value|10000}'].join('\n'),
    rich: {
      value: {
        color: '#ffffff',
        fontSize: 36
        // fontWeight: 'bold'
      },
      name: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 50
      }
    },
    top: 'center',
    left: '50%',
    textAlign: 'center',
    textStyle: {
      rich: {
        value: {
          color: '#ffffff',
          fontSize: 36
          // fontWeight: 'bold'
        },
        name: {
          color: '#fff',
          fontSize: 16,
          lineHeight: 50
        }
      }
    }
  },
  tooltip: {
    // show: false, // 关闭悬浮提示
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['父母', '子女', '夫妻'],
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 50
  },
  series: [
    {
      name: '信件数量',
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      // hoverAnimation: false, // 是否开启 hover 在扇区上的放大动画效果
      // silent: false, // 图形是否不响应和触发鼠标事件，默认为false响应和触发
      label: {
        formatter: '{b}: {d}%\n{c}人'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        smooth: true
      },
      data: [
        { value: 6000, name: '父母' },
        { value: 1500, name: '子女' },
        { value: 2500, name: '夫妻' }
      ]
    }
  ]
}
```
