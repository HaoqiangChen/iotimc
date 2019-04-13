/**
 * 访谈APP问卷设计
 * Created by chq on 2019-10-16.
 */
define([
    'app',
    'cssloader!system/ftappquestionnaire/css/index.css'
], function (app) {
    app.controller('ftappQuestionnaireController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '刑罚执行完毕后未重新犯罪者';
        var domain = 'http://iotimc8888.goho.co:17783';
        var wjId;
        if ($stateParams.data) {
            console.log($stateParams.data);
            wjId = $stateParams.data.id;
        } else {
            wjId = 'B701AB0474BE475B8CF22E6152B9FC01'
        }

        $scope.contentsList = [
            {name: "基本情况", qtypefk: "735F01B8E2A638499D853E022ABF7737", secondary: [
                {idx: "1 ", title: "年龄（A1 - A1）", typedtlid: "94159C5FA686307E88FEAAA3D7F4F431", questionlist: [
                    {classify: "基本情况", code: "A1", fatherclassifyid: "735F01B8E2A638499D853E022ABF7737", idx: 1, name: "首先，请告诉我你具体是哪一天出生的？",qclassify: "年龄",qtip: "（提示：记下具体日期）",type: "3",questionfk: "A03F3647708F422E96DD311F750FD558",option:[
                        {child: false, format: "3", isdesc: 0, label: "请告诉我你具体是哪一天出生的", optionfk: "0B086F34566B4A3AB9EC53B22F5A047B",questionfk: "261904B9D7AD48758A223439D6B6E0C5",type: "6",value: ""}
                    ]}
                ]},
                {idx: "2 ", title: "性别（A2 - A2）", typedtlid: "CE8707B808DE37958AFF42DCC65F6F04",questionlist:[]},
                {idx: "3 ", title: "民族（A3 - A3）", typedtlid: "E600905CF2823395B59C4CC7036D601A"},
                {idx: "4 ", title: "宗教（A4 - A4.3）", typedtlid: "14ED0878A37B34FB9B98E218598CC51C"},
                {idx: "8 ", title: "文化程度（A5 - A5.1）", typedtlid: "F6ECB776E79A31ACB32716E45D6AC16A"},
                {idx: "10 ", title: "婚姻状况（A6 - A6.5）", typedtlid: "99EEC5D5B6A9304FA8ABD727D4CDB60C"},
                {idx: "18 ", title: "身体状况（A7.1 - A7.4.1）", typedtlid: "1E7CE8B6C5533381BF5C79EA0E35DE63"},
                {idx: "25 ", title: "生活自理情况（A7.5 - A7.5）", typedtlid: "64B549CBA2A73DD09499AA57CD9ED848"},
                {idx: "26 ", title: "纹身情况（A7.6 - A7.6.3）", typedtlid: "CD9D8753F77F3D248E13BC8A21FE3A9C"}
            ], type: "A"},
            {name: "早期成长经历", qtypefk: "AD632D1027E533D1ADDB46F4FCA8055C", secondary: [
                {idx: "30 ", title: "独生子女（B1 - B1.1）", typedtlid: "74DED318E5FF362FB50D5EF9A5328487"},
                {idx: "32 ", title: "留守流浪经历（B2.1 - B2.2）", typedtlid: "F9946D6B319B302D92649DBDCED40C42"},
                {idx: "34 ", title: "家庭居住类型（B3 - B3.1）", typedtlid: "E73E4B4E6C9D3F0BBB3C310A21E8FABD"},
                {idx: "36 ", title: "家庭经济水平（B4 - B4）", typedtlid: "CD02BF7D4A673834A162B14814C08FDB"},
                {idx: "37 ", title: "成长家庭结构（B5 - B5.1）", typedtlid: "B70CA8FAE2103BBF847A00FB921FBA0F"},
                {idx: "39 ", title: "父母社会经济状况（B6.1 - B6.4）", typedtlid: "23353A3D57A2362A83B4028962ADF7BB"},
                {idx: "43 ", title: "父母生活榜样（B7.1 - B7.2）", typedtlid: "42C281BA40443D8F9D98518A26E94D3E"},
                {idx: "45 ", title: "父母教养方式（B8.1 - B8.2）", typedtlid: "E87548C636623C7F86804A1AB4E6072F"},
                {idx: "47 ", title: "早期成长家庭氛围（B9 - B9）", typedtlid: "268FE5AB074D382D9116F408488F41F6"},
                {idx: "48 ", title: "早期家庭受虐或受到溺爱（B10.1 - B10.4）", typedtlid: "5F89E893FE1A38289154B5764E9EA8E4"},
                {idx: "52 ", title: "早期学业成绩（B11 - B11.4）", typedtlid: "D83983A2CD163EDC9B78C512B8FB61DA"},
                {idx: "57 ", title: "早期越轨行为（B12.1 - B12.17）", typedtlid: "44D6756A5D7D3D04B1E8848CEC03A6FE"},
                {idx: "74 ", title: "早期社会交往（B13.1 - B13.2）", typedtlid: "A4271095CA7C3B74AB31D1208A3D3575"},
                {idx: "77 ", title: "早期犯罪受害（B14 - B14.1）", typedtlid: "20F65624B98D3B7AB21E5B530FB4A6DF"}
            ], type: "B"},
            {name: "第一次犯罪前情况第一次犯罪前情况（以主要罪名为准）", qtypefk: "066AD9417DCB3D5A936FE03D9D740DFF", secondary: [
                {idx: "79 ", title: "犯罪次数与第一次犯罪时间（C1 - C1.1.1）", typedtlid: "567FAC8FE47A3BB7BDCBE85AE40B3F19"},
                {idx: "82 ", title: "第一次犯罪前前科情况（C2 - C2）", typedtlid: "3380336C5F0A300592324B59789B197C"},
                {idx: "83 ", title: "家庭犯罪性（C3 - C3）", typedtlid: "F991BD211811308299A65243B955E280"},
                {idx: "84 ", title: "同伴犯罪性（C4 - C4）", typedtlid: "660F39BCC7203A60962CB915A8ABD80E"},
                {idx: "85 ", title: "第一次犯罪前身体状况（C5 - C5）", typedtlid: "8E0465C3573632689271B9FF8B2CE669"},
                {idx: "86 ", title: "第一次犯罪前文化程度（C6 - C6）", typedtlid: "0D3CFF63EEF63E928D871618C3A399E4"},
                {idx: "87 ", title: "第一次犯罪前家庭婚姻状况（C7 - C7.5）", typedtlid: "D82FA988BA7F3C2284E2B1FBCA002DE0"},
                {idx: "95 ", title: "第一次犯罪前遭受家庭暴力情况（C7.6 - C7.6.5）", typedtlid: "2B736759CA8B39EA8A78867A7CE9A512"},
                {idx: "101 ", title: "户籍类型（C8 - C8）", typedtlid: "70AA659E85CA3994ABF9A69E1425DD88"},
                {idx: "102 ", title: "第一次犯罪前异地（跨地区）流动情况（C9 - C9.4）", typedtlid: "BCF46DDC0E853D27B8C2E491FADF5300"},
                {idx: "107 ", title: "第一次犯罪前居住情况（C10.1 - C10.5）", typedtlid: "9AA60A8FCF9A39238484BA1164F1B32C"},
                {idx: "112 ", title: "第一次犯罪前交友情况（C11 - C11.6）", typedtlid: "6856A30E415C396B83D8FA710C478D37"},
                {idx: "121 ", title: "第一次犯罪前职业情况（C12 - C12.5）", typedtlid: "7671EF134B1135CB822C492C48072362"},
                {idx: "127 ", title: "第一次犯罪前收入支出情况（C13 - C13.3）", typedtlid: "E7DA2DA0480E35AC82133C8E5DB9F76B"},
                {idx: "131 ", title: "第一次犯罪前社会地位情况（C14.1 - C14.2）", typedtlid: "A510772C00A83406942171858760CB59"},
                {idx: "133 ", title: "第一次犯罪前不良行为习惯（C15.1 - C15.3.1）", typedtlid: "321BD2C2B8EF3E86B2743A6B9AA7C14D"},
                {idx: "158 ", title: "第一次犯罪前在校情况（C16 - C16.5）", typedtlid: "7C6CBF8EE93931098009BBC6C71D5D3A"},
                {idx: "164 ", title: "第一次犯罪前父母监护情况（C17 - C17.3）", typedtlid: "BEC33DE525D932E28A46FA6CD01F9838"},
                {idx: "168 ", title: "第一次犯罪前社会不公或挫折感（C18 - C18.1）", typedtlid: "3D845B541AB039839D4721F30C0A9D52"},
                {idx: "170 ", title: "第一次犯罪前遭受犯罪侵害（C19 - C19.3）", typedtlid: "93EFF0B3E2E036318526B3C098865598"}
            ], type: "C"},
            {name: "第一次犯罪有关情况", qtypefk: "16BA80324A313BCAA08FB0E50714F622", secondary: Array(13), type: "D"},
            {name: "第一次服刑情况", qtypefk: "2E22C64B3D5936658FBA229A32229FA5", secondary: Array(8), type: "E"},
            {name: "第二次犯罪前情况", qtypefk: "260CED4C8299343F8E67F2C5150290A0", secondary: Array(11), type: "F"},
            {name: "第二次犯罪有关情况", qtypefk: "05E44FFEA01D3C21BCD0088EBA111AD5", secondary: Array(14), type: "G"},
            {name: "本次服刑情况", qtypefk: "33EA5A5323CD3F35AF69E1C9E4559247", secondary: Array(2), type: "H"},
            {name: "吸毒有关情况", qtypefk: "83EAD6CEB2E33E87B092CD9D2C8DC73F", secondary: Array(6), type: "I"},
            {name: "一些看法和观点", qtypefk: "DD5C3BD11225300FB6D6B35740C62387", secondary: Array(1), type: "J"}
        ];

        $scope.getMenu = function () {
            $scope.loading = {
                isLoading: true,
                content: '问卷数据加载中'
            };

            var url, data;
            url = domain + '/terminal/interview/system.do?action=getQuestions';
            data = {
                filter: {
                    id: wjId
                }
            };

            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, data)
                    .then(function (data) {
                        console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.loading.isLoading = false;
                        } else {
                        }
                    })
            })
        };

        $scope.directory = function () {
            iConfirm.show({
                scope: $scope,
                title: '确认离开此页面？',
                content: '系统可能不会保存您所做的更改？',
                buttons: [{
                    text: '确认',
                    style: 'button-primary',
                    action: 'confirmSuccess'
                }, {
                    text: '取消',
                    style: 'button-caution',
                    action: 'confirmCancel'
                }]
            });
        };
        $scope.confirmSuccess = function(id) {
            iConfirm.close(id);
            $state.go('system.ftappdirectory')
        };

        $scope.confirmCancel = function(id) {
            iConfirm.close(id);
        };

        $scope.menuClick = function ($event) {
            $($event.currentTarget).find('ol.contents-fold').slideToggle();
        };
        $scope.secondaryClick = function ($event) {
            $event.stopPropagation();
        };
        $scope.back = function () {
          iConfirm.show({
            scope: $scope,
            title: '确认离开此页面？',
            content: '系统可能不会保存您所做的更改？',
            buttons: [{
              text: '确认',
              style: 'button-primary',
              action: 'confirmBack'
            }, {
              text: '取消',
              style: 'button-caution',
              action: 'confirmCancel'
            }]
          });
        };
        $scope.confirmBack = function(id) {
          iConfirm.close(id);
          window.history.back()
        };

        // 模块加载完成后初始化事件
        $scope.$on('ftappQuestionnaireControllerOnEvent', function () {
            // $scope.getMenu();
        });

        function getToken(callback) {
            iAjax.post(domain + '/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
        }

        function _remind(level, content, title) {
            var message = {
                id: new Date(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };

            iMessage.show(message, false);
        }
    }]);
});
