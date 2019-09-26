# iiw.safe

## HTML

### 返回图标：fa-mail-reply-all

## 时间选择控件

```html
<input class="form-control ng-valid ng-dirty ng-valid-parse ng-touched" type="text" ng-model="starttime" safe-picker="" ng-change="timeFilter()" p!format="Y-m-d H:i" placeholder="请选择开始时间" style="">
```

## 下拉框

```html
<select class="form-control" ng-model="assessrecord.syoufk" ng-change="getRecord()" ng-options="row.id as row.name for row in assessrecord.syouAll"></select>

<select ng-change="changeType()" ng-model="types" class="form-control safe-backlog-filter-select">
	<option value="">全部</option>
	<option value="{{types.modouleName}}" ng-repeat="types in backlogRows">{{types.modouleName}}</option>
	<option ng-repeat="(key, type) in record.types track by key" value="{{type.status}}">{{type.statusname}}</option>
</select>
```

## ng-repeat的表格内容添加不同样式

```html
<tr ng-repeat="x in tableData">
    <td>{{x.networkName}}</td>
    <td>{{x.network}}</td>
    <td ng-style="{background: x.status === -1 ? '#f0ad4e' : x.status === 1?'#5cb85c':x.status === 2?'#f04124':'#a5a5a5'}">{{x.status | status }}</td>
</tr>
```

## 选择单位代码

- 方法一：这个是双击选择，并且样式有点low
```html
<div class="safe-workLog-add-form-group row">
	<div class="col-lg-4 safe-workLog-add-form-name">事件单位</div>
	<div class="col-lg-8">
		<input type="text" class="form-control" placeholder="选择汇报事件单位" ng-model="logItem.syouname" ng-click="worklogAdd.showSyouList()" onfocus="this.blur()" required/>
		<div class="safe-workLog-add-form-span" ng-if="!logItem.syouname">*</div>
	</div>
</div>
<script type="text/ng-template" id="ouTreeDialog.html">
    <div class="modal-header">
        <p class="modal-title">请选择单位：</p>
    </div>
    <div class="modal-body" style="height: 600px;overflow: hidden;">
        <safe-tree tv-data="ouTree" tv-click="clickNode" tv-load="load" ng-dblclick="select()"></safe-tree>
    </div>
</script>
```
```js
showSyouList: function() {
	getSyouTree(function(list) {
		var modalInstance = $uibModal.open({
			templateUrl: 'ouTreeDialog.html',
			controller: 'workLogOuTreeController',
			resolve: {
				data: function() {
					return list
				}
			}
		})
		modalInstance.result.then(function(list) {
			$scope.logItem.syouname = list.alias;
			$scope.logItem.syoufk = list.alias;
		})
	})
},
function getSyouTree(cb) {
	iAjax.post('/sys/web/syou.do?action=getSyouAll', { filter: { cascade: 'Y' } }).then(function(data) {
		if (data.result && data.result.rows) {
			var list = [];
			if ($scope.worklogAdd.ouList.length > 0) {
				$.each(data.result.rows, function(i, o) {
					o.parentid = o.pId;
					o.type = 'ou';
					$.each($scope.worklogAdd.ouList, function(y, item) {
						if (o.id == item.id) {
							o.check = true;
						}
						list.push(o);
					})
				})
			} else {
				$.each(data.result.rows, function(i, o) {
					o.parentid = o.pId;
					o.type = 'ou';
				});
				list = data.result.rows;
			}
			cb(list);
		}
	})
}
app.controller('workLogOuTreeController', ['$scope', 'data', '$uibModalInstance', function($scope, data, $uibModalInstance) {
	var _data = '';
	$scope.ouTree = data;
	$scope.select = function() { $uibModalInstance.close(_data); };
	$scope.clickNode = function(node) { _data = node; }
}])
```

- 方法二：这个是可先选择再确定，也可直接选择

```html
<input type="text" class="form-control" placeholder="选择汇报事件单位" ng-model="logItem.syouname" ng-click="syouTree.showOuTree()" required/>

<div style="display: none;" class="modal fade" id="syouTreeModal" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="syouTreeModal">
    <div class="modal-dialog" style="z-index: 99;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="syouTree.cancelOu()" style="color: #000;"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><i class="fa fa-bank"></i>选择单位</h4>
            </div>
            <div class="modal-body" style="height: 560px;overflow: auto;">
                <ul syou-tree-view ng-model="selectNode" id="sycodeTreeview" class="ztree"></ul>
            </div>
            <!-- <div class="modal-footer">
                <button class="btn btn-default btn-lg btn-larger" data-dismiss="modal" ng-click="syouTree.cancelOu()">取消</button>
                <button class="btn btn-primary btn-lg btn-larger" data-dismiss="modal" ng-click="syouTree.selectOu()">确定</button>
            </div> -->
        </div>
    </div>
    <div class="modal-mask" style="position: absolute;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,.5);" ng-click="syouTree.cancelOu()"></div>
</div>
```
```js
// 'safe/workLog/add/js/directives/syouTreeView' 引入模板

$scope.syouTree = {
	showOuTree: function() {
		$('#syouTreeModal').show();
		$('#syouTreeModal').addClass('in');
	},
	selectOu: function () {
		if (syoufk === '') {
			_remind(3, '请选择至少一个单位信息！', '请选择单位');
		} else {
			$scope.logItem.syouname = syouname;
			$scope.logItem.syoufk = syoufk;
			$('#syouTreeModal').removeClass('in');
			$('#syouTreeModal').hide();
		}
	},
	cancelOu: function () {
		$('#syouTreeModal').removeClass('in');
		$('#syouTreeModal').hide();
	},

}
$scope.selectEvent = function (treeNode) {
	// syouname = treeNode.name;
	// syoufk = treeNode.id;
	$scope.logItem.syouname = treeNode.name;
	$scope.logItem.syoufk = treeNode.id;
	$('#syouTreeModal').removeClass('in');
	$('#syouTreeModal').hide();
}
```

## 异步函数

```js
function _getRole () {
	var defer = $.Deferred();
	iAjax.post('/security/check/check.do?action=getSpecialrole', {filter: {url: ['isBCU']}}).then(function (data) {
		if (data.result.rows[0].isBCU) {
			defer.resolve(data.result.rows[0].isBCU);
		} else {
			defer.resolve('0');
		}
		return defer;
	})
}
// 调用
_getRole.then(function(data){})
```
