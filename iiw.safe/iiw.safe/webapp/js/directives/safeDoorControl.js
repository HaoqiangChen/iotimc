/**
 * 门禁严管
 *
 * @author - yjj
 * @date - 2016-05-31
 * @version - 1.0
 *
 *
 *
 * 门禁管控，包括门禁严管、防爆锁定和紧急逃生
 *
 * @author - yjj
 * @date - 2017-04-19
 * @version - 1.1
 */
define([
    'app',
    'cssloader!safe/css/doorcontrol'
], function(app) {

    function getTemplate(url) {
        var result = '';

        $.ajax({
            url: url,
            async: false,
            cache: false,
            dataType: 'text'
        }).success(function(data) {
            result = data;
        });

        return result;
    }

    var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/doorcontrol.html');

    app.directive('safeDoorControl', ['iAjax', 'iMessage', '$compile', '$rootScope',  function(iAjax, iMessage, $compile, $rootScope) {
        return {
            restrict: 'A',
            scope: true,
            replace: false,
            template: '<i class="fa fa-key"></i><p>门禁管控</p>',
            link: function(scope, $element) {
                var _mjygState = 1,
                    _confirmPassword = '123456',
                    _type;

                if(!$('body').find('.safe-doorControl-dialog').size()) {
                    var data = $compile(_template)(scope);
                    $('body').append(data);
                }

                var box = $('.safe-doorControl-dialog'),
                    password = $('.safe-doorPassword-dialog');

                $element.click(function() {
					$rootScope.$broadcast('hideImcsVideoObject');
                    box.show();
                });

                box.find('.safe-doorControl-box').click(function(e) {
                    if(e.target.className == 'safe-doorControl-row') {
						$rootScope.$broadcast('showImcsVideoObject');
                        box.hide();
                    }
                });

                box.find('.button-box .button.fbsd').click(function() {
                    password.find('h1').text('请输入密码，启动防爆锁定');
                    _type = 1;
                    $('.safe-doorPassword-field').val('');
                    password.show();
                    password.find('input').focus();
                });

                box.find('.button-box .button.jjts').click(function() {
                    password.find('h1').text('请输入密码，启动紧急逃生');
                    _type = 2;
                    $('.safe-doorPassword-field').val('');
                    password.show();
                    password.find('input').focus();
                });

                box.find('.button-box .button.mjyg').click(function() {
                    iAjax.post("sys/web/sycode.do?action=ygModeExchange", {
                        status: (_mjygState == 1) ? 0 : 1
                    }).then(getMjygSetting);
                });

                password.find('.safe-doorPassword-box').click(function(e) {
                    if(e.target.className == 'safe-doorPassword-row') {
                        password.hide();
                    }
                });

                scope.inputPassword = function(event) {
                    var _this = event.currentTarget;
                    if($(_this).attr('other')) {
                        switch($(_this).attr('other')) {
                        case 'back':
                            var value = $('.safe-doorPassword-field').val();
                            if(value) {
                                value = value.substr(0, value.length - 1);
                                $('.safe-doorPassword-field').val(value);
                            }
                            password.find('input').focus();
                            break;
                        case 'clean':
                            $('.safe-doorPassword-field').val('');
                            password.find('input').focus();
                            break;
                        case 'close':
                            password.hide();
                            break;
                        }
                    } else {
                        password.find('span').hide();
                        var value = $(_this).text();
                        $('.safe-doorPassword-field').val(($('.safe-doorPassword-field').val() || '') + value);
                    }
                };

                //password.find('.submit-button .button').click(submitContent);

                $('.safe-doorPassword-field').keydown(function(e) {
                    password.find('span').hide();
                    if(e.keyCode == 13) {
                        scope.submitContent();
                    }
                });

                scope.submitContent = function () {
                    var pwd = $('.safe-doorPassword-field').val();
                    if(pwd == _confirmPassword) {
                        var content = '',
                            cmd;
                        if(_type == 1) {
                            // 防爆锁定
                            content = '防爆锁定任务执行成功';
                            cmd = 'keepDoorClose';
                        } else {
                            // 紧急逃生
                            content = '紧急逃生任务执行成功';
                            cmd = 'keepDoorOpen';
                        }

                        iAjax.post('security/device/device.do?action=executeStrictDoor', {
                            filter: {
                                action: cmd,
                                cascade: 'Y'
                            }
                        }).then(function(data) {
                            if(data && data.status == '1') {
                                iMessage.show({
                                    level: 1,
                                    title: '成功',
                                    content: content
                                }, false);
								$rootScope.$broadcast('showImcsVideoObject');
                                password.hide();
                                box.hide();
                            }
                        });
                    } else {
                        password.find('span').show();
                    }
                }

                scope.cancel = function (action) {
                    var content = '',
                        cmd = action;
                    if(_type == 1) {
                        // 防爆锁定
                        content = '防爆锁定任务撤销成功!';
                    } else {
                        // 紧急逃生
                        content = '紧急逃生任务撤销成功!';
                    }
                    iAjax.post('security/device/device.do?action=executeStrictDoor', {
                        filter: {
                            action: cmd,
                            cascade: 'Y'
                        }
                    }).then(function(data) {
                        if(data && data.status == '1') {
                            iMessage.show({
                                level: 1,
                                title: content,
                                content: ''
                            }, false);
							$rootScope.$broadcast('showImcsVideoObject');
                            box.hide();
                        }
                    });
                }

                init();

                function init() {
                    getMjygSetting();
                    getPassword();
                }

                function getMjygSetting() {
                    iAjax.post('security/common/monitor.do?action=getSycodeDetail', {
                        filter: {
                            type: "isopendooryg"
                        }
                    }).then(function(data) {
                        _mjygState = (data && data.result && data.result.rows == "1") ? 1 : 2;
                        var button = box.find('.button-box .button.mjyg');
                        if(_mjygState == 1) {
                            // 严管
                            button
                                .removeClass('button-primary')
                                .addClass('button-highlight')
                                .text('门禁严管(开)');
                        } else {
                            // 普通
                            button
                                .removeClass('button-highlight')
                                .addClass('button-primary')
                                .text('门禁严管(关)');
                        }
                    });
                }

                function getPassword() {
                    iAjax.post('/security/common/monitor.do?action=getSycodeDetail', {filter: {type: 'JJTSMM'}}).then(function(data) {
                        if(data && data.result.rows) {
                            _confirmPassword = data.result.rows;
                        }
                    });
                }
            }
        }
    }]);

    //app.directive('safeDoorControl', ['iAjax', function(iAjax) {
    //	return {
    //		restrict: 'A',
    //		scope: true,
    //		replace: false,
    //		template: '<i class="fa" ng-class="{ \'fa-minus-square\': state == 1, \'fa-minus-square-o\': state != 1 }"></i><p>门禁严管(<span class="stateText" style="display:none;">{{(state == 1) ? \'开\' : \'关\'}}</span><span class="stateLoading"><i class="fa fa-spinner fa-pulse" style="font-size: 15px;"></i></span>)</p>',
    //		link: function($scope, $element) {
    //			// $scope.state; 1-->开; 2-->关
    //
    //			$element.click(saveSetting);
    //			getSetting();
    //
    //			function getSetting() {
    //				iAjax.post('security/common/monitor.do?action=getSycodeDetail',{
    //					filter:{
    //						type:"isopendooryg"
    //					}
    //				}).then(function(data) {
    //					$scope.state = (data && data.result && data.result.rows == "1") ? 1 : 2;
    //					$element.find('.stateLoading').hide();
    //					$element.find('.stateText').show();
    //
    //					if($scope.state == 1) {
    //						$element.removeClass('text-success');
    //						$element.addClass('text-danger');
    //					} else {
    //						$element.removeClass('text-danger');
    //						$element.addClass('text-success');
    //					}
    //				});
    //			}
    //
    //			function saveSetting() {
    //				$element.find('.stateText').hide();
    //				$element.find('.stateLoading').show();
    //
    //				iAjax.post("sys/web/sycode.do?action=ygModeExchange",{
    //					status: ($scope.state == 1) ? 0 : 1
    //				}).then(getSetting);
    //			}
    //		}
    //	}
    //}]);
});