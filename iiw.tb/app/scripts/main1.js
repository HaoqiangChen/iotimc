var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {

  var token = '';
  $scope.device = {
    url: 'http://10.10.2.66:8080',
    username: 'admin',
    password: '5CEUKHOJ64T711P3CB8E00AZE1B2F69',
    monitorPlats: [],
    platid: '4930271445964309B219902FDFE91010',
    list: [],
    getToken(callback) {
        $.post(`${$scope.device.url}/sys/web/login.do?action=login&host=10.10.2.187:8080&password=${$scope.device.password}&username=${$scope.device.username}`).then(function (data) {
            var res = JSON.parse(data);
            if (res.token) {
              token = res.token;
              callback(res.token);
            } else {
              alert(res.message);
            }
        })
    },
    getDeviceType() {
        var jsonData = {
          data: {
            filter: {
              type: 'monitorPlatform'
            }
          }
        }
        $.ajax({
          type: 'POST',
          url: `${$scope.device.url}/security/device.do?action=getDevice&authorization=${token}`,
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(jsonData),
          success: function(res) {
            if (res.result.rows && res.result.rows.length) {
                $scope.device.monitorPlats = res.result.rows;
                $scope.device.platid = $scope.device.monitorPlats[0].id;
                $scope.device.getDeviceList();
            }
          }
        })
    },
    changePlat(plat) {},
    getDeviceList() {
        $scope.device.list = [];
        $.get(`${$scope.device.url}/sys/provider.do?action=getMonitorStatus&authorization=${token}&deviceid=${$scope.device.platid}`).then(function (data) {
            var res = JSON.parse(data);
            if (res.result.rows && res.result.rows.length) {
                var streamString = JSON.stringify(res.result.rows[0]);
                var deviceList = streamString.slice(1).substr(0, streamString.length - 1);
                $scope.device.list = deviceList.split(',');
                // console.log($scope.device.list)
            }
        })
    },
    init() {
      var _this = this;
      _this.getToken(function(token) {
        token = token;
        _this.getDeviceType();
      })
      // var str = 'DhPlatformChannel:plat=14b17f6b67246b4091d0403d72ce2708&code=1001663_002$1$0$320&chl=320: "1"'
      // console.log(str.match(/(\w+):plat=(\w+)&code=(\w+)/g))
    }
  };
  $scope.device.init();

});

