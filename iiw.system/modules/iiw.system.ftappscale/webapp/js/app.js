/**
 * 访谈APP量表设计
 * Created by chq on 2019-10-16.
 */
define([
    'app',
    'cssloader!system/ftappscale/css/index.css',
    'cssloader!system/ftappwjmanage/css/loading.css',
    'system/ftappwjmanage/js/directives/kindEditor'
], function (app) {
    var packageName = 'iiw.system.ftappscale';
    app.controller('ftappScaleController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '量表设计';
        var domain = 'http://iotimc8888.goho.co:17783';
        var wjId;
        if ($stateParams.data) {
            console.log($stateParams.data);
            wjId = $stateParams.data.id;
        } else {
            wjId = '0CFF778DCDD94C85BC67141E388E403E'
        }
        var indexQ = 0;

        $scope.batchOptions = '';
        $scope.questionlist = [];

        $scope.question = {
            "code": "002001",
            "id": "D23E7B09719740B1B3231DDC8784478F",
            "idx": 1,
            "ismust": "1",
            "ismustname": "必答",
            "name": "1.我时常做白日梦，幻想可能会发生在我身上的事情。",
            "option": [{"label": "完全不符合", "value": "AA7537B2399A4EA68F63B434EC28B8B6"}, {
                "label": "有点不符合",
                "value": "AA7537B2301A4EA68F63B434EC28B8B6"
            }, {"label": "不确定", "value": "AA7537B2302A4EA68F63B434EC28B8B6"}, {
                "label": "基本符合",
                "value": "AA7537B2303A4EA68F63B434EC28B8B6"
            }, {"label": "完全符合", "value": "AA7537B2304A4EA68F63B434EC28B8B6"}],
            "type": "1",
            "typename": "单选"
        };
        $scope.scaleData = {
            id: "0CFF778DCDD94C85BC67141E388E403E",
            name: "IRI （问卷二）",
            subtitle: '阿萨德噶华科大工行卡看开大会',
            describes: "下面所表述的一些想法和感受是我们每个人在不同情境下都可能会有的，对每一题目，请选择与你情况最符合的选项。",
            question: [{
                "code": "002001",
                "id": "D23E7B09719740B1B3231DDC8784478F",
                "idx": 1,
                "ismust": "1",
                "ismustname": "必答",
                "name": "1.我时常做白日梦，幻想可能会发生在我身上的事情。",
                "option": [{"label": "完全不符合", "value": "AA7537B2399A4EA68F63B434EC28B8B6"}, {
                    "label": "有点不符合",
                    "value": "AA7537B2301A4EA68F63B434EC28B8B6"
                }, {"label": "不确定", "value": "AA7537B2302A4EA68F63B434EC28B8B6"}, {
                    "label": "基本符合",
                    "value": "AA7537B2303A4EA68F63B434EC28B8B6"
                }, {"label": "完全符合", "value": "AA7537B2304A4EA68F63B434EC28B8B6"}],
                "type": "1",
                "typename": "单选"
            }, {
                "classify": "早期成长经历",
                "code": "B1.1",
                "fatherclassifyid": "1CA7D5765C6140A497CF33469AEF1B54",
                "formula": "1",
                "idx": 31,
                "name": "若回答否，",
                "option": [
                    {
                        "child": false,
                        "isdesc": 0,
                        "label": "那么家里共有",
                        "optionfk": "3E9C8129410E49389DB41743A911C889",
                        "prefix": "那么家里共有",
                        "questionfk": "10BD7B2983C04030B8A9377BC67395F4",
                        "suffix": "个兄弟姐妹",
                        "type": "2",
                        "value": ""
                    },
                    {
                        "child": false,
                        "isdesc": 0,
                        "label": "其中男孩",
                        "optionfk": "A8C4378B40374E7990B96277A2225576",
                        "prefix": "其中男孩",
                        "questionfk": "10BD7B2983C04030B8A9377BC67395F4",
                        "suffix": "个",
                        "type": "2",
                        "value": ""
                    },
                    {
                        "child": false,
                        "isdesc": 0,
                        "label": "女孩",
                        "optionfk": "866AC8E78E2B4F6D9D045EA0B065CFA2",
                        "prefix": "女孩",
                        "questionfk": "10BD7B2983C04030B8A9377BC67395F4",
                        "suffix": "个",
                        "type": "2",
                        "value": ""
                    },
                    {
                        "child": false,
                        "isdesc": 0,
                        "label": "你排行第",
                        "optionfk": "2B3EBE3D29AC484BA597909F0676E2FA",
                        "prefix": "你排行第",
                        "questionfk": "10BD7B2983C04030B8A9377BC67395F4",
                        "type": "2",
                        "value": ""
                    }
                ],
                "qclassify": "独生子女",
                "questionfk": "10BD7B2983C04030B8A9377BC67395F4",
                "type": "3"
            }, {
                "code": "002003",
                "id": "D23E7B09719740B1B3231DDC8784678F",
                "idx": 3,
                "ismust": "1",
                "ismustname": "必答",
                "name": "3.有时候我觉得很难从他人的角度看问题。",
                "option": [{"label": "完全不符合", "value": "3505E227AE8040B9A99C0D7D7063E055"}, {
                    "label": "有点不符合",
                    "value": "1C741B31D2DB45AB871FBA3B19C5D81B"
                }, {"label": "不确定", "value": "9FCAD5F3F2CE4DE3AE6D2792CD554AF0"}, {
                    "label": "基本符合",
                    "value": "2D22E0E8C5504376AF71313FF496992E"
                }, {"label": "完全符合", "value": "F41428760DA648C4BAE22207957EB6D3"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002004",
                "id": "D23E7B09719740B1B3231DDC8784778F",
                "idx": 4,
                "ismust": "1",
                "ismustname": "必答",
                "name": "4.当别人遇到困难时，有时我并不会很同情他们。",
                "option": [{"label": "完全不符合", "value": "A051C5A91B014292A4F9E91CDA9513CD"}, {
                    "label": "有点不符合",
                    "value": "AF865DC410164CEBB09BA0EE0B1A47E7"
                }, {"label": "不确定", "value": "6088DDC4A9684CE5A0948FA0CA7F140B"}, {
                    "label": "基本符合",
                    "value": "8EC7713E67454DF489A773B09B9F7FE3"
                }, {"label": "完全符合", "value": "B0A0369F9A464CF5AEE1CAEAC97B3C41"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002005",
                "id": "D23E7B09719740B1B3231DDC8784878F",
                "idx": 5,
                "ismust": "1",
                "ismustname": "必答",
                "name": "5.我确实会陷入小说人物的情感中。",
                "option": [{"label": "完全不符合", "value": "917F5E36696742689736433DCDF59145"}, {
                    "label": "有点不符合",
                    "value": "ECCE85BAC2174BE1B405AE0B0825CAF9"
                }, {"label": "不确定", "value": "04D8FA0D648048EE8400CB3804778B35"}, {
                    "label": "基本符合",
                    "value": "2B0D1B344F844BFDA4A5528CBA37B2A7"
                }, {"label": "完全符合", "value": "486173F73DC74943974394411B2BCB32"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002006",
                "id": "D23E7B09719740B1B3231DDC8784978F",
                "idx": 6,
                "ismust": "1",
                "ismustname": "必答",
                "name": "6.在紧急状况下，我会感到担心和不安。",
                "option": [{"label": "完全不符合", "value": "809E838F32C8459E933780B5B58C2058"}, {
                    "label": "有点不符合",
                    "value": "43C134727BBC4F89BB576D49C5D24C18"
                }, {"label": "不确定", "value": "1BA250F5C30248F1A336A46CC80B5C99"}, {
                    "label": "基本符合",
                    "value": "A15446BB5CB945618FF4415FA65E0AC8"
                }, {"label": "完全符合", "value": "452B8430D0A448C8B0F2D19762E4F279"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002007",
                "id": "D23E7B09719740B1B3231DDC8785078F",
                "idx": 7,
                "ismust": "1",
                "ismustname": "必答",
                "name": "7.欣赏电影或戏剧时，我往往会很客观，并不会完全陷入其中。",
                "option": [{"label": "完全不符合", "value": "6A331D08F73342CBABA5BE2667CA1F9C"}, {
                    "label": "有点不符合",
                    "value": "B04BD1B96E6E4A0D9BD4CC0F72E5C6E6"
                }, {"label": "不确定", "value": "EC379BAFB98949FBBE4E9F2A01DAE331"}, {
                    "label": "基本符合",
                    "value": "A9D4F6C4F27945D3A0A24CACF4316696"
                }, {"label": "完全符合", "value": "9D4D0D64181346059232B7275C7996A5"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002008",
                "id": "D23E7B09719740B1B3231DDC8785178F",
                "idx": 8,
                "ismust": "1",
                "ismustname": "必答",
                "name": "8.在做决定之前，我会去参考大家的不同意见。",
                "option": [{"label": "完全不符合", "value": "78D4F70FEB4246B09648A1C353C02406"}, {
                    "label": "有点不符合",
                    "value": "03F6C3F388C949B0993B854FD77629B8"
                }, {"label": "不确定", "value": "7E74C81602C14246A7CF6D839013E1BF"}, {
                    "label": "基本符合",
                    "value": "5D753E18E00741AEB38FDA4B490FA7CE"
                }, {"label": "完全符合", "value": "4117B12443314C4C81766F3D440941E1"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002009",
                "id": "D23E7B09719740B1B3231DDC8785278F",
                "idx": 9,
                "ismust": "1",
                "ismustname": "必答",
                "name": "9.看到有人被利用时，我就有保护他们的想法。",
                "option": [{"label": "完全不符合", "value": "BD6EF23F6AC54B0C8A3C931D0FEDC0AB"}, {
                    "label": "有点不符合",
                    "value": "EA5E27D2AFBF4C9B9076367A23E1D155"
                }, {"label": "不确定", "value": "D0CC7637A1834A65A398224DD3D87568"}, {
                    "label": "基本符合",
                    "value": "D04E806D7DDE40C1BDB97BF1525862D2"
                }, {"label": "完全符合", "value": "D9179EF158284D5EA2EF54A3D40C8744"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002010",
                "id": "D23E7B09719740B1B3231DDC8785378F",
                "idx": 10,
                "ismust": "1",
                "ismustname": "必答",
                "name": "10.当身处高度情绪化的情境中时，我有时会感到无助。",
                "option": [{"label": "完全不符合", "value": "60FCE9B1BD9048B3AB4028FEB7761C1D"}, {
                    "label": "有点不符合",
                    "value": "9EFCB9EB5F6641549AF95210C5CD5B21"
                }, {"label": "不确定", "value": "2BEE6B786E4B435CB0394138F5FE9A09"}, {
                    "label": "基本符合",
                    "value": "CBC8294D8FAD4305A492AF78F9986A01"
                }, {"label": "完全符合", "value": "1DB6E3C638C3440DA4E5770A6B257F73"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002011",
                "id": "D23E7B09719740B1B3231DDC8785478F",
                "idx": 11,
                "ismust": "1",
                "ismustname": "必答",
                "name": "11.有时我会想象朋友对事情的看法，从而更好地理解他们。",
                "option": [{"label": "完全不符合", "value": "A3481590B47E4CA79B0FD9E39C65F6B1"}, {
                    "label": "有点不符合",
                    "value": "55097CA8AEC44259B5D0493D609540C1"
                }, {"label": "不确定", "value": "4DA999A9C7A64709B9A9BEB0DC3188FA"}, {
                    "label": "基本符合",
                    "value": "E3FAB5FA271946A892D33CA364C19D5B"
                }, {"label": "完全符合", "value": "35853D4336694CA6B82C0B38D953C7FA"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002012",
                "id": "D23E7B09719740B1B3231DDC8785578F",
                "idx": 12,
                "ismust": "1",
                "ismustname": "必答",
                "name": "12.我很少会完全沉浸于一本好书或一部好电影中。",
                "option": [{"label": "完全不符合", "value": "F9264582FB4A418AAEBF4D5644325F7D"}, {
                    "label": "有点不符合",
                    "value": "08D39B43DEFD4D46B705EBF7D2D50759"
                }, {"label": "不确定", "value": "CEC0D5FAAE434001A310DB7ADE7C2D52"}, {
                    "label": "基本符合",
                    "value": "76CA6FCB19E7471A9B3C2747D27CB450"
                }, {"label": "完全符合", "value": "B399578417074A1FA3DE7CA84748EC97"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002013",
                "id": "D23E7B09719740B1B3231DDC8785678F",
                "idx": 13,
                "ismust": "1",
                "ismustname": "必答",
                "name": "13.看到有人受伤害时，我往往会保持平静。",
                "option": [{"label": "完全不符合", "value": "E79341062B6E4BFA8162B36AD0468701"}, {
                    "label": "有点不符合",
                    "value": "C844AE49F84842A4AC22B9243BAA9350"
                }, {"label": "不确定", "value": "443E5266A1E048459830E3B457FB6F09"}, {
                    "label": "基本符合",
                    "value": "E46FA4D4EEDE42B18290C39F0D77BC4F"
                }, {"label": "完全符合", "value": "9A51E440D08C4B528DA560D315C2C61B"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002014",
                "id": "D23E7B09719740B1B3231DDC8785778F",
                "idx": 14,
                "ismust": "1",
                "ismustname": "必答",
                "name": "14.对他人的不幸，我一般不同情。",
                "option": [{"label": "完全不符合", "value": "FF5DC986197C47338350B2EEB84D7885"}, {
                    "label": "有点不符合",
                    "value": "E896C29188B4428FAE42F5D8E026D182"
                }, {"label": "不确定", "value": "21FC686908C347BA904C97F7BBFCD297"}, {
                    "label": "基本符合",
                    "value": "120CB85E2408434DB8040BB5623BAF61"
                }, {"label": "完全符合", "value": "71B6D1D6D5D74ABBAA32DC548DB9E1F5"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002015",
                "id": "D23E7B09719740B1B3231DDC8785878F",
                "idx": 15,
                "ismust": "1",
                "ismustname": "必答",
                "name": "15.如果我肯定自己是对的，我就不会浪费许多时间去听别人的意见。",
                "option": [{"label": "完全不符合", "value": "BE24A34BF3204325BDDEDB47A674677C"}, {
                    "label": "有点不符合",
                    "value": "CE1584954F074A3796F02885F189B0CA"
                }, {"label": "不确定", "value": "ECE9F6C746DA404F8F177241845934E5"}, {
                    "label": "基本符合",
                    "value": "F55FF636DF7A4387BD510C432A60B9A3"
                }, {"label": "完全符合", "value": "CBAD7FB5A64B4C9680F009CF7957C410"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002016",
                "id": "D23E7B09719740B1B3231DDC8785978F",
                "idx": 16,
                "ismust": "1",
                "ismustname": "必答",
                "name": "16.看完戏剧或电影后，我感觉自己好像就是其中的一个角色。",
                "option": [{"label": "完全不符合", "value": "885CC963AE14420BAE438FA24E13AEB1"}, {
                    "label": "有点不符合",
                    "value": "D31565118AE54F158A7A1EB3EECA1FD2"
                }, {"label": "不确定", "value": "10B3529E827E4032B2AE9E0C229FB5EF"}, {
                    "label": "基本符合",
                    "value": "7855B42B1E0E4EA4BA40D10FF2382176"
                }, {"label": "完全符合", "value": "2609700DAC0A4F7DA61C51BA938EDFCC"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002017",
                "id": "D23E7B09719740B1B3231DDC8786078F",
                "idx": 17,
                "ismust": "1",
                "ismustname": "必答",
                "name": "17.身处紧张的情境中，我会感到恐惧。",
                "option": [{"label": "完全不符合", "value": "A46A9849D6B946F3839BF23D6E893BF8"}, {
                    "label": "有点不符合",
                    "value": "AD913A07CE354AE8BA9C8AC9EB3189EB"
                }, {"label": "不确定", "value": "418B19D6176845E39200E38FC2BDDA3D"}, {
                    "label": "基本符合",
                    "value": "609BEE0239A54D1A822843E562B63331"
                }, {"label": "完全符合", "value": "8AD0E96D1F6A40558C70F53391AB0CD2"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002018",
                "id": "D23E7B09719740B1B3231DDC8786178F",
                "idx": 18,
                "ismust": "1",
                "ismustname": "必答",
                "name": "18.看到他人受到不公平对待，我不一定会同情。",
                "option": [{"label": "完全不符合", "value": "6FA8B894BACD4B7CA749B53155054A43"}, {
                    "label": "有点不符合",
                    "value": "A39FED05B1144415809C71DD77536AE0"
                }, {"label": "不确定", "value": "803DDC8EC2DF4C648EFFF7755489E981"}, {
                    "label": "基本符合",
                    "value": "3577CA1673BA468084BC76ECDF66929F"
                }, {"label": "完全符合", "value": "7B95FCAD62BE470A8A0E7912082116CB"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002019",
                "id": "D23E7B09719740B1B3231DDC8786278F",
                "idx": 19,
                "ismust": "1",
                "ismustname": "必答",
                "name": "19.我经常会很有效地处理紧急事件。",
                "option": [{"label": "完全不符合", "value": "26F16553DC9B44388D0C417E9ACFFF0D"}, {
                    "label": "有点不符合",
                    "value": "1258DC3F3B6F48FFBAF0E3EE663C6558"
                }, {"label": "不确定", "value": "BEBC429526B44E72AE3C2B6C9375F342"}, {
                    "label": "基本符合",
                    "value": "C0D9ED030415408281CEFF0C2FD9782A"
                }, {"label": "完全符合", "value": "6B7AD2B16F1A48558CADA3A4A5661536"}],
                "type": "1",
                "typename": "单选"
            }, {
                "code": "002020",
                "id": "D23E7B09719740B1B3231DDC8786378F",
                "idx": 20,
                "ismust": "1",
                "ismustname": "必答",
                "name": "20.我经常容易被一些事情深深感动。",
                "option": [{"label": "完全不符合", "value": "C3238D14290F4A53B08972F6EAC548B1"}, {
                    "label": "有点不符合",
                    "value": "839BDB9D51EE49A381F36BD6F67604B4"
                }, {"label": "不确定", "value": "E3ED838826DC4561BAF4566FC8F0656B"}, {
                    "label": "基本符合",
                    "value": "90CAA8D2B53242CD8F3134E2CD195339"
                }, {"label": "完全符合", "value": "2710EFD35BF44523A2E0031E6FEEB8DA"}],
                "type": "1",
                "typename": "单选"
            }]
        };
        $scope.scaleData.question.splice(2, 15);
        console.log($scope.scaleData.question);
        $scope.getScale = function () {
            $scope.loading = {
                isLoading: true,
                content: '量表数据加载中'
            };

            var url, data;
            url = domain + '/security/wjdc/scale.do?action=getQuestionNaireDetail';
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
                        if (data.status === 1) {
                            $scope.loading.isLoading = false;
                            $scope.scaleData = data.result.rows[0];
                        } else {
                        }
                    })
            })
        };
        $scope.editQ = function (questionlist, $index) {
            questionlist.map(_ => _.editing = false);
            questionlist[$index].editing = true;
        };
        $scope.moveUp = function (arr, $index, type) {
            if ($index === 0) {
                if (type === 'question') _remind(3, '第一题不能再上移');
                else _remind(3, '第一个不能再上移');
                return;
            }
            _swapItems(arr, $index, $index - 1);
        };
        $scope.moveDown = function (arr, $index, type) {
            if ($index === arr.length - 1) {
                if (type === 'question') _remind(3, '最后一题不能再上移');
                else _remind(3, '最后一个不能再上移');
                return;
            }
            _swapItems(arr, $index, $index + 1);
        };
        $scope.copy = function ($index) {
            $scope.scaleData.question.splice($index, 0, $scope.scaleData.question[$index]);
        };
        $scope.del = function (arr, $index, type) {
            if (type === 'option' && arr.length <= 2) {
                _remind(3, '最少保留2个选项');
                return;
            }
            arr.splice($index, 1);
        };
        $scope.addOption = function (arr, $index) {
            let newLabel = {label: '选项' + ($index + 2)};
            arr.splice($index + 1, 0, newLabel);
        };
        $scope.setQ = function ($index) {
            indexQ = $index;
        };
        $scope.saveOption = function () {
            let newLabels = [],
                newOptions = [];
            if ($scope.batchOptions) newLabels = $scope.batchOptions.split(',');

            if (newLabels.length) {
                newOptions = [];
                newLabels.map(_ => {
                    newOptions.push({label: _});
                });
                $scope.scaleData.question[indexQ].option = $scope.scaleData.question[indexQ].option.concat(newOptions);
                $('#optionModal').modal('hide')
            } else $('#optionModal').modal('hide')
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
        $scope.confirmBack = function (id) {
            iConfirm.close(id);
            window.history.back()
        };
        $scope.confirmRefresh = function (id) {
            iConfirm.close(id);
            location.reload();
        };
        $scope.confirmCancel = function (id) {
            iConfirm.close(id);
        };

        $scope.$on('ftappScaleControllerOnEvent', function () {
            // $scope.getScale();
            // _refreshPage();
        });

        function _swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        }

        function _refreshPage() {
            document.onkeydown = function (e) { // 键盘按键控制
                e = e || window.event;
                if ((e.ctrlKey && e.keyCode == 82) || // ctrl+R
                    e.keyCode == 116) { // F5刷新，禁止
                    if (confirm('重新加载此网站？\n系统可能不会保存您所做的更改。')) {
                        location.reload();
                    } else {
                        console.log('取消重新刷新页面');
                        return false;
                    }
                }
            }
        }

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
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
