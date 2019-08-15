var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
  $scope.filePath = '/images';

  $scope.cases = [
    {value: 3836, name: '在监数'},
    {value: 3, name: '在逃数'},
    {value: 33, name: '禁闭数'},
    {value: 23, name: '监外就医'},
    {value: 135, name: '重点罪犯'},
  ];
function formatXData(arr, field) {
  var xdata = [];
  _.each(arr, function (item) {
    xdata.push(item[field]);
  })
  return xdata;
}

var mobstersBar = echarts.init(document.getElementById('mobstersData'));
var mobstersOption = {
  grid: {
    top: '30px',
    left: '50px',
    right: '0px',
    bottom: '20px'
  },
  xAxis: {
    type: 'category',
    data: formatXData($scope.cases, 'name'),
    axisLabel: { // 坐标轴刻度标签的相关设置
      textStyle: { // 文字样式
        color: '#fff'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '单位: 人',
    nameLocation: 'end',
    nameTextStyle: {
      color: '#fff'
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#3F444A'
      }
    }
  },
  series: [{
    data: formatXData($scope.cases, 'value'),
    type: 'bar',
    barWidth: 5,
    itemStyle: {
      normal: {
        barBorderRadius: 5,
        color: '#83F4F6',
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#83F4F6'
          }
        }
      }
    },
  }]
};
mobstersBar.setOption(mobstersOption);

$scope.outpeopleNum = 3500;
$scope.outcarNum = 0;

if ($scope.outpeopleNum) {
  animatePie($('#out-people-pie'), $scope.outpeopleNum);
}

function animatePie(el, num) {
  var percent = 0;
  if (num > 100) {
    percent = Math.random() * (0.45 - 0.26) + 0.26
  } else {
    percent = num / 100
  }
  // var bottom = document.getElementsByClassName('circle-bottom')[0]
  var bottom = el.find('.circle-bottom')[0];
  var top = el.find('.circle-top')[0];
  if (percent <= 0.5) {  //红色区域不超过一半
    bottom.style.transform = `rotate(${percent * 360}deg)`
  } else {    //红色区域超过一半的情况，重点部分
    bottom.style.transform = 'rotate(-180deg)'
    bottom.style.transition = 'opacity 0s step-end 1s, transform 1s linear'
    bottom.style.opacity = 0

    top.style.transition = `transform ${(percent - 0.5) / 0.5}s linear 1s`
    top.style.transform = `rotate(${percent * 360 - 180}deg)`
  }
}

  $scope.criminals = {
    list: [{'aflb':'一般刑事犯','age':'52','bedno':'07','bm':'360*****309','bqjn':'水电','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********二队','bqzzxzqh':'江西省 赣州市 大余县','csdssdq':'江西省 赣州市 大余县','csrq':'1968-07-06','dah':'28309','dbrq':'2016-08-17','dw':'七监区','fd':'203组','fgdj':'普管','fzsj':'2016-02-26','hjgajg':'镇派出所','hjzz':'江西省 赣州市 大余县池江镇杨村十二队','hjzzcs':'江西省 赣州市 大余县','hklx':'农村','hyzk':'未婚','id':'5D3D8B4D33C24820B6AFD8851825760C','jg':'江西省 赣州市 大余县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05202','jtzz':'江西省 赣州市 大余县池江镇杨村十二队','jtzzcs':'江西省 赣州市 大余县','jyrq':'2016-07-12','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602028309_11.jpg','pjxq':' ','rjrq':'2017-01-05','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2017-01-05','syxq':' ','syxqq':'0年0个月','tc':'水电','xb':'男性','xm':'王*江','xwhcd':'初中','zjdcsd':'江西省 赣州市 大余县','zjhm':'362124196807062016','zjzt':'在押','zm':'诈骗罪','zxxq':'4年 ','zxxqqr':'2016-07-12','zxxqzr':'2020-07-11'},{'aflb':'一般刑事犯','age':'55','bedno':'07','bm':'360*****708','bqmm':'群众','bqwh':'小学','bqzz':'广东省 梅**********第二村民小组','bqzzxzqh':'广东省 梅州市 五华县','csdssdq':'广东省 梅州市 五华县','csrq':'1965-10-12','dah':'28708','dbrq':'2016-07-01','dw':'七监区','fd':'103组','fgdj':'二级严管','fzsj':'2016-04-02','gj':'中国','hjgajg':'镇派出所','hjzz':'广东省 梅州市 五华县水寨镇坝美村第二村民小组','hjzzcs':'广东省 梅州市 五华县','hklx':'农村','hyzk':'已婚','id':'CE9D6BBB3D4440EAB96E2DA4C8C01AF2','jg':'广东省 梅州市 五华县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05107','jtzz':'广东省 梅州市 五华县水寨镇坝美村第二村民小组','jtzzcs':'广东省 梅州市 五华县','jyrq':'2016-05-25','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602028708_11.jpg','pjxq':' ','rjrq':'2017-03-24','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2017-03-24','syxq':' ','syxqq':'1年1个月','xb':'男性','xm':'周*云','xwhcd':'小学','zjdcsd':'广东省 梅州市 五华县','zjhm':'441424196510120110','zjzt':'在押','zm':'诈骗罪','zxxq':'5年4个月','zxxqqr':'2016-05-25','zxxqzr':'2021-09-24'},{'aflb':'一般刑事犯','age':'28','bedno':'12','bm':'360*****182','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********号6楼出租房','bqzzxzqh':'江西省 赣州市 章贡区','csdssdq':'山东省 聊城市 冠县','csrq':'1992-07-25','dah':'26182','dbrq':'2014-07-25','dw':'七监区','fd':'301组','fgdj':'普管','fzsj':'2014-03-01','hjgajg':'镇派出所','hjzz':'山东省 聊城市 冠县东古城镇张查后东村7号','hjzzcs':'山东省 聊城市 冠县','hklx':'农村','hyzk':'未婚','id':'C4094240C0104314844CBB1F5037A307','jg':'山东省 聊城市 冠县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05304','jtzz':'江西省 赣州市 章贡区塘窝里134号6楼出租房','jtzzcs':'江西省 赣州市 章贡区','jyrq':'2014-06-20','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602026182_11.jpg','pjxq':' ','rjrq':'2015-11-25','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2015-11-25','syxq':' ','syxqq':'2年1个月','xb':'男性','xm':'赵*磊','xwhcd':'初中','zjdcsd':'山东省 聊城市 冠县','zjhm':'371525199207251035','zjzt':'在押','zm':'非法拘禁罪','zxxq':'8年3个月','zxxqqr':'2014-06-20','zxxqzr':'2022-09-29'},{'aflb':'重大刑事犯','age':'39','bedno':'04','bm':'360*****494','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********象咀头179号','bqzzxzqh':'江西省 赣州市 安远县','csdssdq':'江西省 赣州市 安远县','csrq':'1981-02-04','dah':'20494','dbrq':'2011-04-25','dw':'七监区','fd':'101组','fgdj':'二级严管','fzsj':'2011-03-30','gj':'中国','hjgajg':'镇派出所','hjzz':'江西省 赣州市 安远县欣山镇大胜村象咀头179号','hjzzcs':'江西省 赣州市 安远县','hklx':'农村','id':'ABE03531B8EC4A98A8063A69B20E748D','jg':'江西省 赣州市 安远县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05110','jtzz':'江西省 赣州市 安远县欣山镇大胜村象咀头179号','jtzzcs':'江西省 赣州市 安远县','jyrq':'2011-04-13','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602020494_11.jpg','pjxq':' ','rjrq':'2012-09-26','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2012-09-26','syxq':' ','syxqq':'22年8个月','xb':'男性','xm':'欧*明堂','xwhcd':'初中','zjdcsd':'江西省 赣州市 安远县','zjhm':'362127198102042638','zjzt':'在押','zm':'故意伤害罪','zxxq':'25年 ','zxxqqr':'2018-05-09','zxxqzr':'2043-05-08'},{'aflb':'重大刑事犯','age':'46','bedno':'10','bm':'360*****823','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********头塘2栋','bqzzxzqh':'江西省 赣州市 章贡区','csdssdq':'江西省 赣州市 赣县区','csrq':'1974-12-07','dah':'29823','dbrq':'2014-06-26','dw':'七监区','fd':'302组','fgdj':'二级严管','fzsj':'2014-06-17','hjgajg':'镇派出所','hjzz':'江西省 赣州市 赣县区梅林镇城南大道白鹭湾2区15栋132室','hjzzcs':'江西省 赣州市 赣县区','hklx':'城镇','hyzk':'未婚','id':'65D306D047554B8FA978A26DDC84A0A1','jg':'江西省 赣州市 赣县区','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05310','jtzz':'江西省 赣州市 章贡区水东镇七里胡头塘2栋','jtzzcs':'江西省 赣州市 章贡区','jyrq':'2014-06-17','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602029823_11.jpg','pjxq':' ','rjrq':'2017-10-16','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2017-10-16','syxq':' ','syxqq':'死刑缓期二年执行','xb':'男性','xm':'廖*镇','xwhcd':'初中','zjdcsd':'江西省 赣州市 赣县区','zjhm':'362121197412070033','zjzt':'在押','zm':'故意杀人罪','zxxq':'死刑缓期二年执行','zxxqqr':'2017-09-27'},{'aflb':'一般刑事犯','age':'31','bedno':'05','bm':'360*****990','bqjn':'电脑','bqmm':'群众','bqwh':'中专','bqzz':'河北省 邯**********组187号','bqzzxzqh':'河北省 邯郸市','csdssdq':'河北省 邯郸市 涉县','csrq':'1989-05-20','dah':'29990','dbrq':'2016-09-30','dw':'七监区','fd':'303组','fgdj':'二级严管','fzsj':'2016-08-11','hjgajg':'镇派出所','hjzz':'河北省 邯郸市涉县涉城镇上清凉村1组187号','hjzzcs':'河北省 邯郸市','hklx':'农村','hyzk':'离婚','id':'2D9BFEA00628415FA42DCA2ADFDD8DF5','jg':'河北省 邯郸市 涉县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05311','jtzz':'河北省 邯郸市涉县涉城镇上清凉村1组187号','jtzzcs':'河北省 邯郸市','jyrq':'2016-08-23','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602029990_11.jpg','pjxq':' ','rjrq':'2017-11-03','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2017-11-03','syxq':' ','syxqq':'8年6个月','tc':'电脑','xb':'男性','xm':'张*瑞','xwhcd':'中专','zjdcsd':'河北省 邯郸市','zjhm':'130426198905200017','zjzt':'在押','zm':'盗窃罪','zxxq':'12年6个月','zxxqqr':'2016-08-23','zxxqzr':'2029-02-22'},{'aflb':'一般刑事犯','age':'30','bedno':'01','bm':'360*****762','bqjn':'摄影','bqmm':'群众','bqwh':'大专','bqzz':'江西省 赣**********0号4栋232房','bqzzxzqh':'江西省 赣州市 兴国县','csdssdq':'江西省 赣州市 兴国县','csrq':'1990-10-15','dah':'29762','dbrq':'2016-12-13','dw':'七监区','fd':'102组','fgdj':'二级严管','fzsj':'2016-11-03','gj':'中国','hjgajg':'镇派出所','hjzz':'江西省 赣州市 兴国县潋江镇西街50号4栋232房','hjzzcs':'江西省 赣州市 兴国县','hklx':'城镇','hyzk':'已婚','id':'9C5EFC19D3C74323AA3956EBC85BE271','jg':'江西省 赣州市 兴国县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05103','jtzz':'江西省 赣州市 兴国县潋江镇西街50号4栋232房','jtzzcs':'江西省 赣州市 兴国县','jyrq':'2016-11-05','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602029762_11.jpg','pjxq':' ','rjrq':'2017-09-27','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2017-09-27','syxq':' ','syxqq':'6年2个月','tc':'摄影','xb':'男性','xm':'李*','xwhcd':'大专','zjdcsd':'江西省 赣州市 兴国县','zjhm':'360732199010150056','zjzt':'在押','zm':'盗窃罪','zxxq':'10年 ','zxxqqr':'2016-11-04','zxxqzr':'2026-11-03'},{'aflb':'一般刑事犯','age':'43','bedno':'01','bm':'360*****592','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********48号','bqzzxzqh':'江西省 赣州市 宁都县','csdssdq':'江西省 赣州市 宁都县','csrq':'1977-04-23','dah':'20592','dbrq':'2011-09-02','dw':'七监区','fd':'302组','fgdj':'普管','fzsj':'2011-03-01','hjgajg':'镇派出所','hjzz':'江西省 赣州市 宁都县梅江镇复兴路48号','hjzzcs':'江西省 赣州市 宁都县','hklx':'城镇','hyzk':'离婚','id':'8929D8E8C65B4AA08A5F2C8ED27F4DCC','jg':'江西省 赣州市 宁都县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05310','jtzz':'江西省 赣州市 宁都县梅江镇复兴路48号','jtzzcs':'江西省 赣州市 宁都县','jyrq':'2011-07-27','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602020592_11.jpg','pjxq':' ','rjrq':'2012-10-25','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2012-10-25','syxq':' ','syxqq':'15年10个月','xb':'男性','xm':'刘*强','xwhcd':'初中','zjdcsd':'江西省 赣州市 宁都县','zjhm':'362131197704230011','zjzt':'在押','zm':'运输毒品罪','zxxq':'20年9个月','zxxqqr':'2015-08-25','zxxqzr':'2036-06-24'},{'aflb':'一般刑事犯','age':'30','bedno':'11','bm':'360*****448','bqmm':'群众','bqwh':'初中','bqzz':'江西省 赣**********含水岗172号','bqzzxzqh':'江西省 赣州市 安远县','csdssdq':'江西省 赣州市 安远县','csrq':'1990-02-17','dah':'20448','dbrq':'2012-04-01','dw':'七监区','fd':'101组','fgdj':'普管','fzsj':'2011-06-15','gj':'中国','hjgajg':'镇派出所','hjzz':'江西省 赣州市 安远县孔田镇太平村含水岗172号','hjzzcs':'江西省 赣州市 安远县','hklx':'农村','hyzk':'未婚','id':'71C276D3198E471CBE8E61244A8CDEA3','jg':'江西省 赣州市 安远县','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05109','jtzz':'江西省 赣州市 安远县孔田镇太平村含水岗172号','jtzzcs':'江西省 赣州市 安远县','jyrq':'2012-02-25','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602020448_11.jpg','pjxq':' ','rjrq':'2012-09-14','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2012-09-14','syxq':' ','syxqq':'0年2个月','xb':'男性','xm':'胡*涛','xwhcd':'初中','zjdcsd':'江西省 赣州市 安远县','zjhm':'360726199002170914','zjzt':'在押','zm':'盗窃罪','zxxq':'8年7个月','zxxqqr':'2012-02-25','zxxqzr':'2020-10-14'},{'aflb':'一般刑事犯','age':'43','bedno':'05','bm':'360*****664','bqmm':'群众','bqwh':'初中','bqzz':'江西省 南**********号','bqzzxzqh':'江西省 南康市','csdssdq':'江西省 南康市','csrq':'1977-12-09','dah':'22664','dbrq':'2012-09-27','dw':'七监区','fd':'302组','fgdj':'普管','fzsj':'2010-02-01','hjgajg':'镇派出所','hjzz':'江西省 南康市唐江镇上坑村石及31号','hjzzcs':'江西省 南康市','hklx':'农村','hyzk':'已婚','id':'CCCB61CC8A5D4E119095E1181327FAB7','jg':'江西省 南康市','jgxt_jggj':'532FE42E63B64669A54154D9F5F78B5C','js':'05308','jtzz':'江西省 南康市唐江镇上坑村石及31号','jtzzcs':'江西省 南康市','jyrq':'2012-08-20','lts':0,'mz':'汉族','photo':'yuzheng/photoupload/import/3602022664_11.jpg','pjxq':' ','rjrq':'2013-12-09','sylb':'新犯收押','syouid':'04C2F6578B154A4BA9E77466879C35AB','syouname':'1#勤俭楼','syrq':'2013-12-09','syxq':' ','syxqq':'4年8个月','xb':'男性','xm':'朱*鑫','xwhcd':'初中','zjdcsd':'江西省 南康市','zjhm':'362122197712094113','zjzt':'在押','zm':'合同诈骗罪','zxxq':'12年7个月','zxxqqr':'2012-08-20','zxxqzr':'2025-04-19'}],
    pages: {
      pageNo: 1,
      pageSize: 10
    },
    filterText: '',
    isShowAvatar: false,
    getDatas: function() {
      iAjax.post('/security/information/information.do?action=getcriminalall', {
        params: {
          pageNo: $scope.criminals.pages.pageNo,
          pageSize: $scope.criminals.pages.pageSize
        },
        filter: $scope.criminals.filterText
      }).then(function(data) {
        console.log(data)
        if(data.result && data.result.rows) {
          /*if($scope.criminals.pages.pageNo > 1) {
              $scope.criminals.list = _.union($scope.criminals.list, data.result.rows);
          } else {
              $scope.criminals.list = data.result.rows;
          }*/
          $scope.criminals.list = data.result.rows;

          if(data.result.params) {
            $scope.criminals.pages.totalPage = data.result.params.totalPage;
            $scope.criminals.pages.totalSize = data.result.params.totalSize;
          }
        }
      })
    },
    search: function() {
      $scope.criminals.pages.pageNo = 1;
      $scope.criminals.getDatas();
    },
    showNextPage: function() {
      if(this.pages.pageNo + 1 <= this.pages.totalPage) {
        this.pages.pageNo++;
        this.getDatas();
      }
    },
    showYjt: function(data) {
      yjtService.show('criminal', data.bm);
    },
    reset: function() {
      $scope.criminals.list = [];
      $scope.criminals.pages.pageNo = 1;
      $scope.criminals.filterText = '';
    }
  }

});
