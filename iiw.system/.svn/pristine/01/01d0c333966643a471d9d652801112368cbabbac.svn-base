/**
 * 日常事务 - 选择设备
 *
 * Created by YBW on 2017-1-10
 */
define(['app'],function(app) {
	app.controller('timelineChooseDeviceController', ['$scope', 'iAjax', 'iMessage', 'iTimeNow', '$rootScope', '$uibModalInstance',  function($scope, iAjax, iMessage, iTimeNow, $rootScope, $uibModalInstance) {

		if(!$rootScope.timelineFilter) {
			$rootScope.timelineFilter = {
				manufacturerList: {},
				type: '',
				manufacturer: '',
				filter: ''
			};
		}
		$scope.device = {
			pageSize: 12,
			pageNo: 0,
			totalSize: 0,
			list: [],
			typeList: [],

			/**
			 * 获取厂商列表
			 */
			getManufacturerList: function() {
				if($rootScope.timelineFilter && $rootScope.timelineFilter.type) {
					$rootScope.timelineFilter.manufacturerList = _.where(this.typeList, {content: $rootScope.timelineFilter.type})[0].child;
				}
				this.getList();
			},

			/**
			 * 获取设备列表
			 */
			getList: function() {
				var _this = this;

				iAjax.post('/security/device.do?action=getDevice', {
					params: {
						pageNo: _this.pageNo,
						pageSize: _this.pageSize
					},
					filter: {
						type: ($rootScope.timelineFilter.type || ''),
						company: ($rootScope.timelineFilter.manufacturer || ''),
						searchText: $rootScope.timelineFilter.filter
					}
				}).then(function(data) {
					if(data.result && data.result.rows) {
						_this.list = data.result.rows;
					}
					if(data.result && data.result.params) {

						var params = data.result.params;
						_this.pageNo = params.pageNo;
						_this.pageSize = params.pageSize;
						_this.totalSize = params.totalSize;
					}
				}, function() {
					remind(4, '网络连接失败');
				});
			},

			/**
			 * 选择设备
			 */
			choose: function(id, name, type) {
				$rootScope.timeline.id = id;
				$rootScope.timeline.name = name;
				$rootScope.timeline.type = type;

				$uibModalInstance.close();
			},

			getDeviceType: function() {

				iAjax.post('security/deviceCode.do?action=getDevicecodeType', {}).then(function(data) {

					if(data.result && data.result.rows) {
						$scope.device.typeList = data.result.rows;
					}

				}, function() {
					remind(4, '网络连接失败！');
				});
			}
		};

		/**
		 * 监控模糊过滤设备
		 */
		$scope.$watch('device.filter', function() {
			$scope.device.getList();
		});



		/**
		 * 消息提醒
		 */
		function remind(level, content, title) {

			var message = {
				id: iTimeNow.getTime(),
				level: level,
				content: content,
				title: (title || '消息提醒')
			};

			iMessage.show(message, false);
		}
		$scope.device.getDeviceType();
		$scope.device.getList();
	}]);
});
