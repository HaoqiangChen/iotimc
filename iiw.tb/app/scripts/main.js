var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
  $scope.filePath = '/images';
  $scope.device = {
    unit: {
      id: '',
      name: '一师阿拉尔监狱',
      value: 0,
      tname: '监控类',
      cname: '',
      btScale: {}
    },
    scale: [{'id':'00000000000000000000000000000000','name':'新疆兵团监狱管理局','num':82205},{'id':'6A53E07DE9D84A9291B936809E029591','name':'一师南口监狱','num':7020},{'id':'40F34EC0F8614FD49AF2E91F7A35D412','name':'三师其盖麦旦监狱','num':6911},{'id':'E87CD350A0EE4E9B86E155DD4BD499ED','name':'三师图木舒克监狱','num':6763},{'id':'F013AE8AD6DB49BCB997F197CFD96BD6','name':'一师阿拉尔监狱','num':6686},{'id':'085C41DC7ADD48F5877863A3CB8E02FA','name':'二师且末监狱','num':6405},{'id':'4F09C4932187444180775A3086793894','name':'三师盖米里克监狱','num':5989},{'id':'79681BF41F2348598C7BCB1D4FA12971','name':'一师幸福城监狱','num':5958},{'id':'19079137FDD046B7832DBC17FD76B3A5','name':'一师花桥监狱','num':5928},{'id':'929BC48B0422448CA115EF6086A94D9E','name':'二师乌鲁克监狱','num':5796},{'id':'C0FC7C2620EA483BB747DA1F9984C117','name':'二师米兰监狱','num':5750},{'id':'643B17CFB01B4EE78C80B67944D7703D','name':'六师芳草湖监狱','num':4231},{'id':'AA9433862D5249F69AFE26DC0D591EC9','name':'二师库尔勒监狱','num':2886},{'id':'D609A85CBFF74DD3B9651CBDC7D031CA','name':'六师五家渠监狱','num':1477},{'id':'7C0E6F3B50734594B63D3CA74802CE80','name':'一师科克库勒监狱','num':1405},{'id':'5B2A5BAA17694F21A5C23F9576DB1E97','name':'八师石河子监狱','num':1355},{'id':'2095E8B5676C425E96728DF9C294C098','name':'兵团乌鲁木齐监狱','num':1252},{'id':'CC1D90CB89DE4725B1517E4D2B263B94','name':'八师北野监狱','num':1138},{'id':'63D5A287275840B6A635EC46CFCC9AF8','name':'八师新安监狱','num':1045},{'id':'BC07D06EA3854C90926F71E07207BF74','name':'一师沙河监狱','num':847},{'id':'47EC1984D5F449AF9D2B29B5CF3FBFB0','name':'一师塔门监狱','num':745},{'id':'8B0B69D9D67845F9A48965DA05DC9792','name':'三师金墩监狱','num':701},{'id':'1165539A895A4A5CA7CC30B37EBA6C68','name':'八师钟家庄监狱','num':547},{'id':'9FB1E974F23D41839BF69AD33AE76996','name':'七师高泉监狱','num':496},{'id':'3635E69C759B4233884072C42798EDF1','name':'六师新湖监狱','num':368},{'id':'A0804E9A7E3B4BC8B40A31397C58580A','name':'七师奎屯监狱','num':312},{'id':'2A98B2623B4241B29CECE1431CDF6C2E','name':'三师皮恰克松地监狱','num':133}],
    types: [{'num':35,'type':'对讲类'},{'num':611,'type':'监控类'},{'num':76,'type':'门禁类'},{'num':820,'type':'报警类'},{'num':133,'type':'其他类'},{'num':17,'type':'广播类'},{'num':10,'type':'电网类'}],
    brand: [{'name':'大华NVR通道','value':4059},{'name':'大华NVR','value':78},{'name':'海康解码器电视墙（DS-65XX-B20）','value':1}],
    searchScale(e) {
      if (e.keyCode == 13) {
        $scope.deviceScale = _.filter($scope.device.scale, function(item) {return item.name.search($scope.device.searchText) != -1})
        drawDeviceBar()
      }
    }
  };
  $scope.deviceline = [{name: '在线', value: 20}, {name: '离线', value: 25}];
  $scope.deviceBrand = [{'name':'大华NVR通道','value':2059},{'name':'大华NVR','value':78},{'name':'海康解码器电视墙（DS-65XX-B20）','value':1},{'name':'大华NV通道','value':2059},{'name':'大NVR','value':78},
  {'name':'海康码器电视墙（DS-65XX-B20）','value':1},{'name':'华NVR通道','value':2059},{'name':'华NVR','value':78},{'name':'康解码器电视墙（DS-65XX-B20）','value':1},{'name':'大华VR通道','value':2059},
  {'name':'大华VR','value':78},{'name':'海解码器电视墙（DS-65XX-B20）','value':1}];
  $scope.deviceTypes = [{'num':39063,'tname':'监控类'},{'num':16569,'tname':'门禁类'},{'num':16277,'tname':'报警类'},{'num':8356,'tname':'对讲类'},{'num':906,'tname':'广播类'},{'num':840,'tname':'其他类'},{'num':133,'tname':'电网类'}];
  $scope.deviceNumList = [{'id':'F013AE8AD6DB49BCB997F197CFD96BD6','num':1688,'syouname':'一师阿拉尔监狱'},{'id':'E87CD350A0EE4E9B86E155DD4BD499ED','num':1651,'syouname':'三师图木舒克监狱'},{'id':'79681BF41F2348598C7BCB1D4FA12971','num':1641,'syouname':'一师幸福城监狱'},{'id':'40F34EC0F8614FD49AF2E91F7A35D412','num':1633,'syouname':'三师其盖麦旦监狱'},{'id':'4F09C4932187444180775A3086793894','num':1504,'syouname':'三师盖米里克监狱'},{'id':'929BC48B0422448CA115EF6086A94D9E','num':1344,'syouname':'二师乌鲁克监狱'},{'id':'C0FC7C2620EA483BB747DA1F9984C117','num':1064,'syouname':'二师米兰监狱'},{'id':'6A53E07DE9D84A9291B936809E029591','num':1037,'syouname':'一师南口监狱'},{'id':'19079137FDD046B7832DBC17FD76B3A5','num':1010,'syouname':'一师花桥监狱'},{'id':'085C41DC7ADD48F5877863A3CB8E02FA','num':812,'syouname':'二师且末监狱'},{'id':'AA9433862D5249F69AFE26DC0D591EC9','num':689,'syouname':'二师库尔勒监狱'},{'id':'2095E8B5676C425E96728DF9C294C098','num':336,'syouname':'兵团乌鲁木齐监狱'},{'id':'5B2A5BAA17694F21A5C23F9576DB1E97','num':331,'syouname':'八师石河子监狱'},{'id':'BC07D06EA3854C90926F71E07207BF74','num':328,'syouname':'一师沙河监狱'},{'id':'7C0E6F3B50734594B63D3CA74802CE80','num':273,'syouname':'一师科克库勒监狱'},{'id':'D609A85CBFF74DD3B9651CBDC7D031CA','num':269,'syouname':'六师五家渠监狱'},{'id':'8B0B69D9D67845F9A48965DA05DC9792','num':254,'syouname':'三师金墩监狱'},{'id':'A0804E9A7E3B4BC8B40A31397C58580A','num':181,'syouname':'七师奎屯监狱'},{'id':'CC1D90CB89DE4725B1517E4D2B263B94','num':150,'syouname':'八师北野监狱'},{'id':'63D5A287275840B6A635EC46CFCC9AF8','num':132,'syouname':'八师新安监狱'},{'id':'643B17CFB01B4EE78C80B67944D7703D','num':115,'syouname':'六师芳草湖监狱'},{'id':'3635E69C759B4233884072C42798EDF1','num':99,'syouname':'六师新湖监狱'},{'id':'47EC1984D5F449AF9D2B29B5CF3FBFB0','num':28,'syouname':'一师塔门监狱'},{'id':'2A98B2623B4241B29CECE1431CDF6C2E','num':0,'syouname':'三师皮恰克松地监狱'},{'id':'1165539A895A4A5CA7CC30B37EBA6C68','num':0,'syouname':'八师钟家庄监狱'},{'id':'9FB1E974F23D41839BF69AD33AE76996','num':0,'syouname':'七师高泉监狱'},{'id':'BC27DEA906624D13A8A59EB91A61A474','num':0,'syouname':'兵团监狱局'}];

  $scope.doorYesterday = [{'name':'二师乌鲁克监狱','num':8728},{'name':'三师盖米里克监狱','num':7489},{'name':'三师其盖麦旦监狱','num':7134},{'name':'一师幸福城监狱','num':5281},{'name':'一师阿拉尔监狱','num':4677},{'name':'二师库尔勒监狱','num':3874},{'name':'六师芳草湖监狱','num':1915},{'name':'二师且末监狱','num':24}];

  // console.log(_.sortBy($scope.device.types, 'num').reverse())

  function drawDeviceBrandPie() {
      var pieOption = {
          tooltip: {
              trigger: 'item',
              // formatter: '{a} <br/>{b} : {c} ({d}%)'
              formatter: function(params) {
                return params.seriesName + '<br/>' + params.name + ': ' + params.data.value + '个' + ' ('+ params.percent +'%)';
              }
          },
          color: ['#42d286', '#00c7ff', '#f59040', '#fa5858', '#fff', '#f7d358', '#fa58f4'],
          series: [{
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
                      formatter: function(params) { // 防止文字重叠换行
                        var text = '';
                        var num = 5;
                        var rowNum = Math.ceil(params.name.length / num);
                        if (rowNum > 1) {
                          for(var i = 0; i < rowNum; i++) {
                            if (i==rowNum-1) {
                                text += params.name.substring(num*i, num*(i+1)) + ':\n';
                            }else {
                                text += params.name.substring(num*i, num*(i+1)) + '\n';
                            }
                          }
                          console.log(text);
                          return text + params.data.value + ' 个';
                        } else {
                          return params.name + ':\n' + params.data.value + ' 个';
                        }
                      }
                  }
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                  return Math.random() * 200;
              }
          }]
      };

      // var pieOption = {
      //     tooltip: {
      //         trigger: 'item',
      //     },
      //     color: ['#02c6ff', '#ff3939'],
      //     series: [{
      //         name: $scope.device.unit.name + '设备数',
      //         type: 'pie',
      //         minAngle: 36, // 设置最小扇区角度防止太小看不到
      //         startAngle: 0, // 改变起始生长角度
      //         radius: '100%', // 设置画面占比, grid属性对饼图无效
      //         center: ['50%', '50%'],
      //         data: $scope.deviceline,
      //         // roseType: 'area', // 南丁格尔图
      //         label: {
      //             normal: {
      //                 // position: 'inner',
      //                 formatter: '{b} : {c}',
      //                 textStyle: {
      //                   color: '#fff'
      //                 }
      //             }
      //         },

      //         animationType: 'scale',
      //         animationEasing: 'elasticOut',
      //         animationDelay: function (idx) {
      //             return Math.random() * 200;
      //         }
      //     }]
      // };

      var pieChart = echarts.init(document.getElementById('chartDom'));
      pieChart.on('click',function(params){
          console.log(params.data)
      });
      pieChart.setOption(pieOption);
  }
  drawDeviceBrandPie();

  function drawDeviceBar() {
    // var barOption = {
    //     backgroundColor: ['#000'],
    //     color: ['#02c6ff'],
    //     tooltip: {
    //         trigger: 'axis',
    //     },
    //     grid: {
    //         top: '5%',
    //         left: '5px',
    //         right: '5%',
    //         bottom: '13%',
    //         containLabel: true
    //     },
    //     xAxis: {
    //         type: 'category',
    //         axisLabel: {
    //           textStyle: {
    //             color: '#fff'
    //           },
    //           interval: 0,
    //           rotate: -20,
    //           // formatter: function(value) {
    //           //   console.log(value)
    //           //   var text = '';
    //           //   var rowNum = Math.ceil(value.length / 2);
    //           //   if (rowNum > 1) {
    //           //     for(var i = 0; i < rowNum; i++) {
    //           //       text += value.substring(2*i, 2*(i+1)) + '\n';
    //           //     }
    //           //     return text;
    //           //   } else {
    //           //     return value;
    //           //   }
    //           // }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             color: '#4d6974'
    //           }
    //         },
    //         splitLine: {
    //           show: false
    //         },
    //         axisTick: {
    //           show: false
    //         },
    //         data: _.pluck($scope.deviceNumList, 'syouname')
    //     },
    //     yAxis: {
    //         type: 'value',
    //         show: false
    //     },
    //     series: [{
    //         name: $scope.deviceUnit.tname + '设备统计',
    //         type: 'bar',
    //         // barWidth: '60%',
    //         label: {
    //             normal: {
    //                 show: true,
    //                 position: 'top',
    //                 textStyle: {
    //                   color: '#fff'
    //                 },
    //             }
    //         },
    //         data: _.pluck($scope.deviceNumList, 'num')
    //     }]
    // };
    $scope.device.btScale = $scope.device.scale[0];
    $scope.device.scale.shift();
    $scope.deviceScale = _.filter($scope.device.scale, function(item) {return item.name.search($scope.device.searchText) != -1})

    var barOption = {
        // color: ['#02c6ff'],
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '0',
            left: '0',
            right: '3%',
            bottom: '1%',
            containLabel: true,
        },
        xAxis: {
            type: 'log',
            axisLabel: {
              textStyle: {
                // color: '#fff',
                fontSize: 16
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
        },
        yAxis: {
            type: 'category',
            inverse: true, //反向
            axisLabel: {
                textStyle: {
                    color: function(name) {
                      return name == $scope.device.unit.name ? '#42d286' : '#fff'
                    },
                    fontSize: 16
                },
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: _.pluck($scope.deviceScale, 'name')
        },
        series: [{
            name: '设备基础建设规模',
            // barMaxWidth: '60%',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  return params.name == $scope.device.unit.name ? '#42d286' : '#02c6ff'
                }
              }
            },
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
            data: _.pluck($scope.deviceScale, 'num')
        }]
    };

    var barChart = echarts.init(document.getElementById('chartDom'));
    // barChart.getZr().off('click');
    barChart.getZr().on('click',function(params){
      var pointInPixel = [params.offsetX, params.offsetY];
      if (barChart.containPixel('grid', pointInPixel)) {
        var xIndex = barChart.convertFromPixel({seriesIndex: 0}, pointInPixel)[1];
        var deviceScale = $scope.device.scale[xIndex];
        if (deviceScale.id == $scope.device.unit.id) {return}
        $scope.device.unit = _.extend($scope.device.unit, deviceScale);
        barChart.setOption(barOption);  
      }
    });
    // 阴影光标显示手掌
    barChart.getZr().on('mousemove', function(params) {
      var pointInPixel = [params.offsetX, params.offsetY];
      if (barChart.containPixel('grid', pointInPixel)) {
        barChart.getZr().setCursorStyle('pointer');
      }
    });
    barChart.setOption(barOption);
  }
  // drawDeviceBar();

  var lhc = [];
  $scope.lhc = '';
  function random(times) {
    // lhc.push(Math.floor(Math.random() * (49 - 1)) + 1);
    // lhc = Array.from(new Set(lhc));
    // if (lhc.length !== times) {
    //   random(times);
    // } else {
    //   return lhc;
    // }
    var win = Math.floor(Math.random() * (49 - 1)) + 1;
    if (lhc.some(function(num) {return num == win})) {
      random();
    } else {
      return win;
    }
    // return Math.floor(Math.random() * (49 - 1)) + 1;
  }
  var times = 1;
  $scope.yaojiang = function() {
    if (times > 7) {return}
    if (times == 1) {
      lhc.push(random());
      $scope.lhc = lhc[0];
    } else {
      lhc.push(random());
      $scope.lhc = lhc.join(' + ');
    }
    times++;
  }

});

