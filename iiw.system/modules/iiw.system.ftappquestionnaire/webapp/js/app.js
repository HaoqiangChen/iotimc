/**
 * 访谈APP问卷设计
 * Created by chq on 2019-10-16.
 */
define([
  'app',
  'cssloader!system/ftappquestionnaire/css/index.css',
  'cssloader!system/ftappwjmanage/css/loading.css',
  'system/ftappwjmanage/js/directives/kindEditor'
], function (app) {
  app.filter(
    'ngHtml', ['$sce', function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text);
      }
    }]
  );
  app.controller('ftappQuestionnaireController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter) {
    mainService.moduleName = '访谈APP管理';

    var domain = 'http://iotimc8888.goho.co:17783';
    var wjId, wjName;
    if ($stateParams.data) {
      wjId = $stateParams.data.id;
      wjName = $stateParams.data.name;
    } else {
      wjId = '0FB464990CFB480FA534AA3966FA791E';
      wjName = '问卷'
    }
    $scope.title = wjName;
    var indexQ = 0;
    var muluId = '';
    var muluLen = 0;
    $scope.inputTypes = [
      {type: 0, typename: '多行文本框'},
      {type: 1, typename: '无属性'},
      {type: 2, typename: '整数'},
      {type: 3, typename: '百分数'},
      {type: 4, typename: '手机号'},
      {type: 5, typename: '邮箱'},
      {type: 6, typename: '时间选择控件'}
    ];

    $scope.data = {
      batchOptions: '',
      catalogIdx: 0
    };

    $scope.contentsList = [
      {
        name: "基本情况", qtypefk: "735F01B8E2A638499D853E022ABF7737", secondary: [
          {
            idx: "1 ", title: "年龄（A1 - A1）", typedtlid: "94159C5FA686307E88FEAAA3D7F4F431", questionlist: [
              {
                classify: "基本情况",
                code: "A1",
                fatherclassifyid: "735F01B8E2A638499D853E022ABF7737",
                idx: 1,
                name: "首先，请告诉我你具体是哪一天出生的？",
                qclassify: "年龄",
                qtip: "（提示：记下具体日期）",
                type: "3",
                questionfk: "A03F3647708F422E96DD311F750FD558",
                option: [
                  {
                    child: false,
                    format: "3",
                    isdesc: 0,
                    label: "请告诉我你具体是哪一天出生的",
                    optionfk: "0B086F34566B4A3AB9EC53B22F5A047B",
                    questionfk: "261904B9D7AD48758A223439D6B6E0C5",
                    type: "6",
                    value: ""
                  }
                ]
              }
            ]
          },
          {
            idx: "2 ", title: "性别（A2 - A2）", typedtlid: "CE8707B808DE37958AFF42DCC65F6F04", questionlist: [
              {
                "classify": "基本情况",
                "code": "A2",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 2,
                "name": "你的性别？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "男",
                    "optionfk": "5E76E8618F154ABAA53E03365734764D",
                    "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "女",
                    "optionfk": "F9D92D61EBFB41F69FA7E84F92253F17",
                    "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
                    "value": "2"
                  }
                ],
                "qclassify": "性别",
                "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
                "type": "1"
              }
            ]
          },
          {
            idx: "3 ", title: "民族（A3 - A3）", typedtlid: "E600905CF2823395B59C4CC7036D601A", questionlist: [
              {
                "classify": "基本情况",
                "code": "A3",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 3,
                "name": "你属于哪一个民族？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "汉族",
                    "optionfk": "4A89C81027754A259373C90C59A4855F",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 0
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "壮族",
                    "optionfk": "6C348167FFB84345A96172FDD4DF41F7",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 1
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "回族",
                    "optionfk": "5CEA2248D4504D4DAE663FF69970031A",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 2
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "满族",
                    "optionfk": "56D7D47BE9DA4925A3D25D3241762DE3",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 3
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "维吾尔族",
                    "optionfk": "013306A9C50F4B3C8268A99C72771D83",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 4
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "苗族",
                    "optionfk": "7587BC514DA64C9B8175AA5A1F39D5BC",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 5
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "彝族",
                    "optionfk": "2EA502D151F64A9789CB6893802B7DC4",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 6
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "土家族",
                    "optionfk": "56CBA6D3D1924C82B223E32DF156EA43",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 7
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "藏族",
                    "optionfk": "F6B8E6388CA64B68A3C414490368403B",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 8
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "蒙古族",
                    "optionfk": "8E20E443358F41BEB6E24D083685244E",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 9
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "侗族",
                    "optionfk": "B50080AC931C4D5EAFBD4D0806214DB4",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 10
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "布依族",
                    "optionfk": "AD26747603AB40399FDF187598C4191F",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 11
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "瑶族",
                    "optionfk": "4E196357CA194D7CB0D33CBD9E552A58",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 12
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "白族",
                    "optionfk": "EA1BDD0888544390B85689BA2AFFB1C4",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 13
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "朝鲜族",
                    "optionfk": "092F181CE7F944C59CD62BBB9C05F308",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 14
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "哈尼族",
                    "optionfk": "C514B41F16964B949F8CD27E99ACC6FD",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 15
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "黎族",
                    "optionfk": "7F587EE27DE14EE1845A8E91E92E6A05",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 16
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "哈萨克族",
                    "optionfk": "4B3E3DE65F5C4D2EB41B4C429D0C015F",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 17
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "傣族",
                    "optionfk": "FF6C60C76EE341C2BA30CF8F6241F13E",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 18
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "畲族",
                    "optionfk": "6D8383D0B6D84339A0A29186FF10D02C",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 19
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "傈僳族",
                    "optionfk": "647A4562F7F64F12B4673F2BBE122E9A",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 20
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "东乡族",
                    "optionfk": "48004348CBDF408EABAA4827C992FC56",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 21
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "仡佬族",
                    "optionfk": "D254437F8A9E4FD58D4AAD9C74909769",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 22
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "拉祜族",
                    "optionfk": "574D9836DF6F455F90D06E58F1F5C34A",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 23
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "佤族",
                    "optionfk": "2C3B05E8D31F484DA6CD436EEFAC929D",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 24
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "水族",
                    "optionfk": "71D858DB052D421EA56304ED46F30A3A",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 25
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "纳西族",
                    "optionfk": "E24C85333AE046A3AC439EC55BC93371",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 26
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "羌族",
                    "optionfk": "D14BFEF9FA0A47E7B911D52FF7278F3F",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 27
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "土族",
                    "optionfk": "D18A3471DBF740B692FA0C7F1FE7C9A6",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 28
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "仫佬族",
                    "optionfk": "BA2EE80A54D142A29440DA30CECC36C4",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 29
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "锡伯族",
                    "optionfk": "FC792646CB5F4227BC4C2C80BC57A269",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 30
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "柯尔克孜族",
                    "optionfk": "CF44978CB3AD4C848BC2C8008318A761",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 31
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "景颇族",
                    "optionfk": "6711AE8679C148038E7520B46734A17C",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 32
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "达斡尔族",
                    "optionfk": "F6910EE11C7C4426A872FB9A4CEFC8E5",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 33
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "撒拉族",
                    "optionfk": "2A90AB4EA7694B6894884E0C7885191D",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 34
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "布朗族",
                    "optionfk": "19071A44E8524F1EA4EEC818F528739E",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 35
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "毛南族",
                    "optionfk": "B111C61D249941D98012FC43C5525853",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 36
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "塔吉克族",
                    "optionfk": "B8A62BBE893241919525BCE2C4E514D7",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 37
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "普米族",
                    "optionfk": "7329FDE7440D4336A927FF4969BA31D8",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 38
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "阿昌族",
                    "optionfk": "AB9F93102D3E4A27852BE2FA26CFD981",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 39
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "怒族",
                    "optionfk": "241DF294831040E7936B8CED7DA5F70E",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 40
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "鄂温克族",
                    "optionfk": "9B0C9C11A7B441738A6025941FA3330D",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 41
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "京族",
                    "optionfk": "30B3DF44734E48AC90A197657CCF8DD6",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 42
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "基诺族",
                    "optionfk": "ECEB285511F241869ED452B0291DCFCB",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 43
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "德昂族",
                    "optionfk": "C22A304A0EB94CE98DE6B384DC3C973D",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 44
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "保安族",
                    "optionfk": "58C7EF6026764556BE97674D0951A210",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 45
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "俄罗斯族",
                    "optionfk": "CCC3A9F7037F458CBF76326107D9F0A2",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 46
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "裕固族",
                    "optionfk": "63E37D7AA2284345908D2A28CDFFDC48",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 47
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "乌孜别克族",
                    "optionfk": "9DB706692FF743FEB0F0F2DEAA2F3EBD",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 48
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "门巴族",
                    "optionfk": "28A11C299ECB4815A122369145B68162",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 49
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "鄂伦春族",
                    "optionfk": "E0842584E9C34F32BE2C2BCEC1F261D3",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 50
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "独龙族",
                    "optionfk": "C12A4B67C69F4A5BBC0864466DE726E9",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 51
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "赫哲族",
                    "optionfk": "931436F7A55D49BC9E1C3033E4A3B3A3",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 52
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "高山族",
                    "optionfk": "FD1106F2A30347FEA93FB757938F512A",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 53
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "珞巴族",
                    "optionfk": "641CF32AFC8349599A2C61E8B3A56EFA",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 54
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "塔塔尔族",
                    "optionfk": "621A904B068249468F6A4BA026D97028",
                    "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                    "value": 55
                  }
                ],
                "qclassify": "民族",
                "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
                "type": "4"
              }
            ]
          },
          {
            idx: "4 ",
            title: "宗教（A4 - A4.3）",
            typedtlid: "14ED0878A37B34FB9B98E218598CC51C",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A4",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 4,
                "name": "你有宗教信仰吗？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 5,
                    "label": "有",
                    "optionfk": "6126D4E0B81B4C20B68E3FA4034BF7D5",
                    "questionfk": "0333099C39A9403188383B44AD4684D8",
                    "relationid": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 8,
                    "label": "没有",
                    "optionfk": "16DEB07C9E68472894409B58238E2B13",
                    "questionfk": "0333099C39A9403188383B44AD4684D8",
                    "relationid": "859413F9936B466DAEA12EFE6D746A3C",
                    "value": "2"
                  }
                ],
                "qclassify": "宗教",
                "questionfk": "0333099C39A9403188383B44AD4684D8",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A4.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 5,
                "name": "若有的话，是何种宗教？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "天主教",
                    "optionfk": "B63A558811A54993AE1D6EDA552C73EA",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "基督教",
                    "optionfk": "CF2EB2DFF8474944895C382B78CCBA82",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "伊斯兰（穆斯林）教",
                    "optionfk": "CE9106A52FD54A5D9BC8D664E01F71C4",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "道教",
                    "optionfk": "A46F857566FC4728A956FCF92FBF925F",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "4"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "佛教",
                    "optionfk": "5B080367E7ED489BBFF73D16E079E09D",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "5"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "犹太教",
                    "optionfk": "158390235DFD464EA2AFF1A81520F869",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "6"
                  },
                  {
                    "child": true,
                    "descr": "（提示：记下名称）",
                    "isdesc": 1,
                    "label": "其它宗教",
                    "optionfk": "B3217D3AF9D44B468C9DE90D3640C9DA",
                    "qchild": [
                      {
                        "code": "A4.1",
                        "idx": 5,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其它宗教",
                            "optionfk": "9B3A69422EB04EE38CFA5DBE875DE4FB",
                            "questionfk": "41C5348545B44F6CBCCEDAE94F82A68C",
                            "suffix": "教",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "41C5348545B44F6CBCCEDAE94F82A68C",
                        "type": "3"
                      }
                    ],
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "7"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "不确定",
                    "optionfk": "8E06FD3B6CE6483CA8A61E5CE46FA6E0",
                    "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                    "value": "8"
                  }
                ],
                "qclassify": "宗教",
                "questionfk": "930998864F6C470C8D455BD01A7C4AB9",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A4.2",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 6,
                "name": "若有的话，你是什么时候开始宗教信仰的？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "自幼开始",
                    "optionfk": "E154DC2A33B04BA5BF5AE5BF599B6CC4",
                    "questionfk": "D998DC8B291E4436ADC198818B218982",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "青春期",
                    "optionfk": "11D03376E9C74E49A68871AC496EBE44",
                    "questionfk": "D998DC8B291E4436ADC198818B218982",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "成年",
                    "optionfk": "1E2BD0ED32324AFF8B69FEF6768E268C",
                    "questionfk": "D998DC8B291E4436ADC198818B218982",
                    "value": "3"
                  }
                ],
                "qclassify": "宗教",
                "questionfk": "D998DC8B291E4436ADC198818B218982",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A4.3",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 7,
                "name": "若有的话，你对你的信仰虔诚吗？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "虔诚",
                    "optionfk": "C5B100F7EBFB4332817F290D54735DC6",
                    "questionfk": "0BB2E27E9C7A40BCBDB7B85E682B489E",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "一般",
                    "optionfk": "98F01176039C4A88AEBA3A3A33CBE10B",
                    "questionfk": "0BB2E27E9C7A40BCBDB7B85E682B489E",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "不够虔诚",
                    "optionfk": "FFA80EC8B6EF4C26A9165154DB630D2D",
                    "questionfk": "0BB2E27E9C7A40BCBDB7B85E682B489E",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "说不清",
                    "optionfk": "6962B20FD303498E866FB0A98C9F34EC",
                    "questionfk": "0BB2E27E9C7A40BCBDB7B85E682B489E",
                    "value": "4"
                  }
                ],
                "qclassify": "宗教",
                "questionfk": "0BB2E27E9C7A40BCBDB7B85E682B489E",
                "type": "1"
              }
            ]
          },
          {
            idx: "8 ",
            title: "文化程度（A5 - A5.1）",
            typedtlid: "F6ECB776E79A31ACB32716E45D6AC16A",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A5",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 8,
                "name": "目前你的文化程度如何？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "文盲或半文盲",
                    "optionfk": "AFFB79EFB988480593A38F381E9FC7C6",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "小学未毕业",
                    "optionfk": "F133F86D07FB45B9BDCEECDD742E2D41",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "小学毕业",
                    "optionfk": "83F4A710EB7F43558896CCB31D68E5BC",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "初中未毕业",
                    "optionfk": "B00DD24342874D30B4B8157287C747F9",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "4"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "初中毕业",
                    "optionfk": "910A14BAB3164A858FC025ED45A3BCFE",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "5"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "高中/中专/职高/技校未毕业",
                    "optionfk": "C3F104610183456C8D246750AAFE9046",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "6"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 9,
                    "label": "高中/中专/职高/技校毕业",
                    "optionfk": "28C8FCF0183241D2BEAA0835A0944CA7",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "7"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 10,
                    "label": "大学专科及以上",
                    "optionfk": "A83DB8DDD40948A2A3BD8BF7C3365881",
                    "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                    "relationid": "1FA8FE982B244D11B72247477AF866BB",
                    "value": "8"
                  }
                ],
                "qclassify": "文化程度",
                "questionfk": "859413F9936B466DAEA12EFE6D746A3C",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A5.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 9,
                "name": "你为什么没有继续上学？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "自己觉得读书没用",
                    "optionfk": "339D76134950413D99875F3388993150",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "成绩不好",
                    "optionfk": "2117FB79D284444E9D1A74DAD0441C71",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "自己想挣钱",
                    "optionfk": "EDD867297E994544A4C2D3FFDDB47487",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "想见世面",
                    "optionfk": "72C5130F793F4F9489CB60B1C953F5B8",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "4"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "家庭经济较差",
                    "optionfk": "6B17D9301F8A44B5BEC04A2ACAEF2A29",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "5"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "家人觉得读书无用",
                    "optionfk": "71822A5626514523B8408AEFDFAED949",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "6"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "身边很多同龄人都这样",
                    "optionfk": "77D015FDEE8A4A05BE551F4844E5D60B",
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "7"
                  },
                  {
                    "child": true,
                    "isdesc": 0,
                    "label": "其他",
                    "optionfk": "756BD44B36964ACEA248F5B0BD239B27",
                    "parentid": "AE7742775F0A479493F76D5FFD9EA190",
                    "qchild": [
                      {
                        "code": "A5.1",
                        "idx": 9,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其他",
                            "optionfk": "72C4BFCFD55E4007B20432814FE90272",
                            "questionfk": "AE7742775F0A479493F76D5FFD9EA190",
                            "value": ""
                          }
                        ],
                        "questionfk": "AE7742775F0A479493F76D5FFD9EA190",
                        "type": "3"
                      }
                    ],
                    "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                    "value": "8"
                  }
                ],
                "qclassify": "文化程度",
                "qtip": "（有几项选几项）",
                "questionfk": "A5AC0D730C334DE39B625288D51C8899",
                "type": "2"
              }
            ]
          },
          {
            idx: "10 ",
            title: "婚姻状况（A6 - A6.5）",
            typedtlid: "99EEC5D5B6A9304FA8ABD727D4CDB60C",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A6",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 10,
                "name": "目前你的婚姻状况如何？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 12,
                    "label": "未婚",
                    "optionfk": "76583BBC01CB4A899B6F7E814A7FC853",
                    "questionfk": "1FA8FE982B244D11B72247477AF866BB",
                    "relationid": "E3A57DDD2395437BA6405C328757D0E9",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 11,
                    "label": "第一次婚姻",
                    "optionfk": "ED8583CC457E476397947BC96020BC8C",
                    "questionfk": "1FA8FE982B244D11B72247477AF866BB",
                    "relationid": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 13,
                    "label": "离婚",
                    "optionfk": "F829EF5FE9884CDFA55C05D8D8958BCC",
                    "questionfk": "1FA8FE982B244D11B72247477AF866BB",
                    "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 11,
                    "label": "再婚",
                    "optionfk": "563DEA98BC904A1BB7A8E5DE7377A882",
                    "questionfk": "1FA8FE982B244D11B72247477AF866BB",
                    "relationid": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "value": "4"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "1FA8FE982B244D11B72247477AF866BB",
                "type": "1"
              },
              {
                "anyjump": 13,
                "classify": "基本情况",
                "code": "A6.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 11,
                "name": "如果你是初婚或者再婚，是否存在以下情况？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 13,
                    "label": "丧偶",
                    "optionfk": "AD0438A633AC492082E0CDF606A97350",
                    "questionfk": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 13,
                    "label": "分居",
                    "optionfk": "21C513F5A6564045888BD8AA2E5AE808",
                    "questionfk": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 13,
                    "label": "失联",
                    "optionfk": "54D2B784B74141C8BC5F121E81CFD6B4",
                    "questionfk": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 13,
                    "label": "否",
                    "optionfk": "E60A78AC18A349E5B0071703C1F75E49",
                    "questionfk": "A0DEADC261364700AFD92D33D0E6DDE0",
                    "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                    "value": "4"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "A0DEADC261364700AFD92D33D0E6DDE0",
                "relationid": "F70A55C741BC4B0AAFEFE7751714341A",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A6.2",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 12,
                "name": "如果你未婚的话，你有没有谈过恋爱？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 17,
                    "label": "有",
                    "optionfk": "A3BD276D1FF0456889608BC8830D3D98",
                    "questionfk": "E3A57DDD2395437BA6405C328757D0E9",
                    "relationid": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 18,
                    "label": "没有",
                    "optionfk": "9AA5899734A0463ABAC23A5854C00877",
                    "questionfk": "E3A57DDD2395437BA6405C328757D0E9",
                    "relationid": "12015059AA5542EBAC40E488402AD058",
                    "value": "2"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "E3A57DDD2395437BA6405C328757D0E9",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A6.3",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 13,
                "name": "如果你已婚（包括离婚、再婚、第一次婚姻），第一次结婚时什么时候？",
                "option": [
                  {
                    "child": false,
                    "format": "1",
                    "isdesc": 0,
                    "optionfk": "54575B00C2C24004AF041DA876D3CB67",
                    "questionfk": "F70A55C741BC4B0AAFEFE7751714341A",
                    "type": "6",
                    "value": ""
                  }
                ],
                "qclassify": "婚姻状况",
                "qtip": "（提示：记下具体年月）",
                "questionfk": "F70A55C741BC4B0AAFEFE7751714341A",
                "type": "3"
              },
              {
                "classify": "基本情况",
                "code": "A6.4",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 14,
                "name": "如果你已婚（包括离婚、再婚、第一次婚姻、未婚同居），你是否有子女？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 15,
                    "label": "有",
                    "optionfk": "5B5DA00E17614611A022A6FC329D3B31",
                    "questionfk": "3F0ACD81238E4A928DBF3267D8305813",
                    "relationid": "542D66221FD94AEAB2BFE2FFD4C831F9",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 17,
                    "label": "没有",
                    "optionfk": "27A6121D024B4DA08BF2DADE6FAAB44C",
                    "questionfk": "3F0ACD81238E4A928DBF3267D8305813",
                    "relationid": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "2"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "3F0ACD81238E4A928DBF3267D8305813",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A6.4.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 15,
                "name": "如果有子女，有几个？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "maxnumber": "50",
                    "optionfk": "EAB007EA7AA1484C8E6BFE833717C4EC",
                    "questionfk": "542D66221FD94AEAB2BFE2FFD4C831F9",
                    "suffix": "个",
                    "type": "2",
                    "value": ""
                  }
                ],
                "qclassify": "婚姻状况",
                "qtip": "（记下数目）",
                "questionfk": "542D66221FD94AEAB2BFE2FFD4C831F9",
                "type": "3"
              },
              {
                "classify": "基本情况",
                "code": "A6.4.2",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 16,
                "name": "如果你有子女的话，目前你与他（她）的关系如何？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系密切",
                    "optionfk": "55767D39D4EB4682B6D0EA8BEA231422",
                    "questionfk": "8E56923827334060863C6CE7ECFC5AB3",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系一般",
                    "optionfk": "F5B4B131D95740718B2A8CC215A743FE",
                    "questionfk": "8E56923827334060863C6CE7ECFC5AB3",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系不好",
                    "optionfk": "AA3D226910E548519EFF1FBEDD0F48FE",
                    "questionfk": "8E56923827334060863C6CE7ECFC5AB3",
                    "value": "3"
                  },
                  {
                    "child": true,
                    "descr": "（如失联、死亡等情况）（注明）",
                    "isdesc": 1,
                    "label": "其他",
                    "optionfk": "41E0E98695944EFF906DD35986CDE931",
                    "parentid": "647291F62B3B4F3783B36FA784D716E0",
                    "qchild": [
                      {
                        "code": "A6.4.2",
                        "idx": 16,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其他",
                            "optionfk": "0D0EA2B31BFE4F6E837C07E5E89EECF0",
                            "questionfk": "647291F62B3B4F3783B36FA784D716E0",
                            "value": ""
                          }
                        ],
                        "questionfk": "647291F62B3B4F3783B36FA784D716E0",
                        "type": "3"
                      }
                    ],
                    "questionfk": "8E56923827334060863C6CE7ECFC5AB3",
                    "value": "4"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "8E56923827334060863C6CE7ECFC5AB3",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A6.5",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 17,
                "name": "如果你有配偶（含对象）的话，目前你与他（她）的关系如何？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系密切",
                    "optionfk": "217165394B13423A8C0B481B0D4EB1BE",
                    "questionfk": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系一般",
                    "optionfk": "DC44BAF165EC4AE2B08B8570E1A46137",
                    "questionfk": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "关系不好",
                    "optionfk": "663F1F51B6D84C7191CC3FA6D07B239B",
                    "questionfk": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "3"
                  },
                  {
                    "child": true,
                    "descr": "（如处在失联状态）（注明）",
                    "isdesc": 1,
                    "label": "其他",
                    "optionfk": "91F57367C2C540428E4B0BE73BC041AF",
                    "parentid": "04E1B52F74B24774876B29C450BF5E54",
                    "qchild": [
                      {
                        "code": "A6.5",
                        "idx": 17,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其他",
                            "optionfk": "F3F89F4F7A48420DB0BE8D5530D88E1E",
                            "questionfk": "04E1B52F74B24774876B29C450BF5E54",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "04E1B52F74B24774876B29C450BF5E54",
                        "type": "3"
                      }
                    ],
                    "questionfk": "CA09C14B0D514569AEC2DB21FB3E24C8",
                    "value": "4"
                  }
                ],
                "qclassify": "婚姻状况",
                "questionfk": "CA09C14B0D514569AEC2DB21FB3E24C8",
                "relation": "{\"option\":[\"10,ED8583CC457E476397947BC96020BC8C\",\"10,76583BBC01CB4A899B6F7E814A7FC853\",\"10,563DEA98BC904A1BB7A8E5DE7377A882\"]}",
                "type": "1"
              }
            ]
          },
          {
            idx: "18 ",
            title: "身体状况（A7.1 - A7.4.1）",
            typedtlid: "1E7CE8B6C5533381BF5C79EA0E35DE63",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A7.4",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 23,
                "name": "你以前是否看过心理医生或精神科大夫？得到了怎样的诊断？",
                "option": [
                  {
                    "child": true,
                    "descr": "（注明诊断的病名）",
                    "isdesc": 1,
                    "jumpto": 24,
                    "label": "看过",
                    "optionfk": "676D541FDD7C4453A21D7C8D6035D05A",
                    "parentid": "E04514573F5A4070B5907C67629B9F58",
                    "qchild": [
                      {
                        "code": "A7.4",
                        "idx": 23,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "看过",
                            "optionfk": "9202AD919A1B453AA722942980E970D1",
                            "questionfk": "E04514573F5A4070B5907C67629B9F58",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "E04514573F5A4070B5907C67629B9F58",
                        "type": "3"
                      }
                    ],
                    "questionfk": "E4B9A261F9444F02812C6BADE624BDAB",
                    "relationid": "0713911B1F0F407EB2184059113558F3",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 25,
                    "label": "没有",
                    "optionfk": "EA10E88AD6DB4C5CBE072BA9F9C929FC",
                    "questionfk": "E4B9A261F9444F02812C6BADE624BDAB",
                    "relationid": "1E8C8607F9434088AD69B84170E57479",
                    "value": "2"
                  }
                ],
                "qclassify": "身体状况",
                "questionfk": "E4B9A261F9444F02812C6BADE624BDAB",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A7.4.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 24,
                "name": "对于此病，你是否接受过治疗？效果如何？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "没有接受过",
                    "optionfk": "8DC9D2A3591C4EB18965263F38F942ED",
                    "questionfk": "0713911B1F0F407EB2184059113558F3",
                    "value": "1"
                  },
                  {
                    "child": true,
                    "descr": "（注明效果）",
                    "isdesc": 1,
                    "label": "接受过",
                    "optionfk": "40726CDC9C15426197B263D7AE6F67C4",
                    "parentid": "A345220AC92E4F8C95C1847397623A5B",
                    "qchild": [
                      {
                        "code": "A7.4.1",
                        "idx": 24,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "接受过",
                            "optionfk": "B95D69F085914FD9BEC7273237EAB10E",
                            "questionfk": "A345220AC92E4F8C95C1847397623A5B",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "A345220AC92E4F8C95C1847397623A5B",
                        "type": "3"
                      }
                    ],
                    "questionfk": "0713911B1F0F407EB2184059113558F3",
                    "value": "2"
                  }
                ],
                "qclassify": "身体状况",
                "questionfk": "0713911B1F0F407EB2184059113558F3",
                "type": "1"
              }
            ]
          },
          {
            idx: "25 ",
            title: "生活自理情况（A7.5 - A7.5）",
            typedtlid: "64B549CBA2A73DD09499AA57CD9ED848",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A7.5",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 25,
                "name": "目前你生活能否自理？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "生活不能自理",
                    "optionfk": "3CC704D8E739485C9B5F493C50C506D5",
                    "questionfk": "1E8C8607F9434088AD69B84170E57479",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "生活能自理，但无劳动能力",
                    "optionfk": "88F1626A170140419D72FFEDBC8BF6B0",
                    "questionfk": "1E8C8607F9434088AD69B84170E57479",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "生活能自理，且有劳动能力",
                    "optionfk": "4A9B37992D974F9A92BC4D9FAC3EA1E2",
                    "questionfk": "1E8C8607F9434088AD69B84170E57479",
                    "value": "3"
                  },
                  {
                    "child": true,
                    "descr": "（注明）",
                    "isdesc": 1,
                    "label": "其他",
                    "optionfk": "5253403190904104B39EDF44E1E61033",
                    "parentid": "4F478A052E314B30B609C0589357C353",
                    "qchild": [
                      {
                        "code": "A7.5",
                        "idx": 25,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其他",
                            "optionfk": "A8701CFB314B4F9AA0F46D161AF5AB56",
                            "questionfk": "4F478A052E314B30B609C0589357C353",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "4F478A052E314B30B609C0589357C353",
                        "type": "3"
                      }
                    ],
                    "questionfk": "1E8C8607F9434088AD69B84170E57479",
                    "value": "4"
                  }
                ],
                "qclassify": "生活自理情况",
                "questionfk": "1E8C8607F9434088AD69B84170E57479",
                "type": "1"
              }
            ]
          },
          {
            idx: "26 ",
            title: "纹身情况（A7.6 - A7.6.3）",
            typedtlid: "CD9D8753F77F3D248E13BC8A21FE3A9C",
            questionlist: [
              {
                "classify": "基本情况",
                "code": "A7.6",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 26,
                "name": "你有没有纹身？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 27,
                    "label": "有",
                    "optionfk": "B820AF4887DB489A98E1B595D1E2AA62",
                    "questionfk": "50588896E82A4225AEDFF22E276E3DCC",
                    "relationid": "3B8815939B8A409A8E4A0000E531678F",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 30,
                    "label": "没有",
                    "optionfk": "AEE08FAE895C422DB74039433DA34408",
                    "questionfk": "50588896E82A4225AEDFF22E276E3DCC",
                    "relationid": "B2F4E1A8012C4EB5A63E8EF8919692D3",
                    "value": "2"
                  }
                ],
                "qclassify": "纹身情况",
                "questionfk": "50588896E82A4225AEDFF22E276E3DCC",
                "type": "1"
              },
              {
                "classify": "基本情况",
                "code": "A7.6.1",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 27,
                "name": "如果你有纹身的话，你的纹身是：",
                "option": [
                  {
                    "child": true,
                    "descr": "（记下内容）",
                    "isdesc": 1,
                    "label": "文字",
                    "optionfk": "D0E1564F2A334B5F8474D7B869F03420",
                    "parentid": "C856E16CAF5041F8AF401FAFAC383EA3",
                    "qchild": [
                      {
                        "code": "A7.6.1",
                        "idx": 27,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "文字",
                            "optionfk": "F8401FD504054669AE09AEC805425371",
                            "questionfk": "C856E16CAF5041F8AF401FAFAC383EA3",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "C856E16CAF5041F8AF401FAFAC383EA3",
                        "type": "3"
                      }
                    ],
                    "questionfk": "3B8815939B8A409A8E4A0000E531678F",
                    "value": "1"
                  },
                  {
                    "child": true,
                    "descr": "（记下内容）",
                    "isdesc": 1,
                    "label": "图案",
                    "optionfk": "5A38CEB620114151B1AB61A07C68C15B",
                    "parentid": "870FD0EC77E34B2AA17BBACFEADF6DDD",
                    "qchild": [
                      {
                        "code": "A7.6.1",
                        "idx": 27,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "图案",
                            "optionfk": "092DC2B29CA742D789EE60EFD0D9C95A",
                            "questionfk": "870FD0EC77E34B2AA17BBACFEADF6DDD",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "870FD0EC77E34B2AA17BBACFEADF6DDD",
                        "type": "3"
                      }
                    ],
                    "questionfk": "3B8815939B8A409A8E4A0000E531678F",
                    "value": "2"
                  },
                  {
                    "child": true,
                    "descr": "（记下内容）",
                    "isdesc": 1,
                    "label": "部位",
                    "optionfk": "DBF6BCDEF63140D989EDA427A9AFCF30",
                    "parentid": "649CCEAEBD7D46A387CE0296423CB07B",
                    "qchild": [
                      {
                        "code": "A7.6.1",
                        "idx": 27,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "部位",
                            "optionfk": "159E68BD25544B3F9266985033809788",
                            "questionfk": "649CCEAEBD7D46A387CE0296423CB07B",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "649CCEAEBD7D46A387CE0296423CB07B",
                        "type": "3"
                      }
                    ],
                    "questionfk": "3B8815939B8A409A8E4A0000E531678F",
                    "value": "3"
                  }
                ],
                "qclassify": "纹身情况",
                "questionfk": "3B8815939B8A409A8E4A0000E531678F",
                "type": "2"
              },
              {
                "classify": "基本情况",
                "code": "A7.6.2",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 28,
                "name": "如果你有纹身的话，最早是什么时候开始有的?",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "maxnumber": "100",
                    "optionfk": "1D73D1F739E344A08EAF768C842D6580",
                    "questionfk": "06B9C5D702874910B844EDB4F023928C",
                    "suffix": "岁",
                    "type": "2",
                    "value": ""
                  }
                ],
                "qclassify": "纹身情况",
                "qtip": "（记下你当时的年龄）",
                "questionfk": "06B9C5D702874910B844EDB4F023928C",
                "type": "3"
              },
              {
                "classify": "基本情况",
                "code": "A7.6.3",
                "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
                "idx": 29,
                "name": "当时你纹身基于什么样的考虑？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "耍酷或炫耀",
                    "optionfk": "9F949DFD0B104A379D915CF96E9DEA1F",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "喜欢",
                    "optionfk": "FC4211946EEB4721B5EABEC186945A7A",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "2"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "模仿或从众",
                    "optionfk": "FD324373B4F642F581BE22DC243A1EEF",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "3"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "习俗",
                    "optionfk": "6EAE319CBEE54DEDBDDEFD2C459EE7F9",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "4"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "忠诚或信仰表达",
                    "optionfk": "509A48318A57406C96071E8B38C83192",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "5"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "纪念",
                    "optionfk": "C0B6EF18B3C0486392BEB9BC3CE2192F",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "6"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "伙伴影响",
                    "optionfk": "DCC320E3B6C84755A421458300E73CDD",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "7"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "label": "标榜或标新立异",
                    "optionfk": "C6A929421604476F9FBCA7DCECDD24E9",
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "8"
                  },
                  {
                    "child": true,
                    "descr": "（记下内容）",
                    "isdesc": 1,
                    "label": "其他",
                    "optionfk": "BF197EA75D984241B53BDB465169D803",
                    "parentid": "69FD74800B8D40D991AA9F32581732D6",
                    "qchild": [
                      {
                        "code": "A7.6.3",
                        "idx": 29,
                        "option": [
                          {
                            "isdesc": 0,
                            "label": "其他",
                            "optionfk": "F58C0031B69B455D83FC2718E6E895A8",
                            "questionfk": "69FD74800B8D40D991AA9F32581732D6",
                            "type": "1",
                            "value": ""
                          }
                        ],
                        "questionfk": "69FD74800B8D40D991AA9F32581732D6",
                        "type": "3"
                      }
                    ],
                    "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                    "value": "9"
                  }
                ],
                "qclassify": "纹身情况",
                "qtip": "（有几项选几项）",
                "questionfk": "A1BCABEF7ED746D9B30A03E0FFAA58AB",
                "type": "2"
              }
            ]
          }
        ], type: "A"
      },
      {
        name: "早期成长经历", qtypefk: "AD632D1027E533D1ADDB46F4FCA8055C", secondary: [
          {
            idx: "30 ",
            title: "独生子女（B1 - B1.1）",
            typedtlid: "74DED318E5FF362FB50D5EF9A5328487",
            questionlist: [
              {
                "classify": "早期成长经历",
                "code": "B1",
                "fatherclassifyid": "1CA7D5765C6140A497CF33469AEF1B54",
                "idx": 30,
                "name": "你是否是独生子女？",
                "option": [
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 32,
                    "label": "是",
                    "optionfk": "3AEBD61E28624CABB2B2797AA4E27298",
                    "questionfk": "B2F4E1A8012C4EB5A63E8EF8919692D3",
                    "relationid": "83B8679D369846F7BF5B165D43B33937",
                    "value": "1"
                  },
                  {
                    "child": false,
                    "isdesc": 0,
                    "jumpto": 31,
                    "label": "否",
                    "optionfk": "2793CB3779F64D4C9BD478584B894A25",
                    "questionfk": "B2F4E1A8012C4EB5A63E8EF8919692D3",
                    "relationid": "10BD7B2983C04030B8A9377BC67395F4",
                    "value": "2"
                  }
                ],
                "qclassify": "独生子女",
                "questionfk": "B2F4E1A8012C4EB5A63E8EF8919692D3",
                "type": "1"
              },
              {
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
              }
            ]
          },
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
        ], type: "B"
      },
      {
        name: "第一次犯罪前情况第一次犯罪前情况（以主要罪名为准）", qtypefk: "066AD9417DCB3D5A936FE03D9D740DFF", secondary: [
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
          {
            idx: "133 ",
            title: "第一次犯罪前不良行为习惯（C15.1 - C15.3.1）",
            typedtlid: "321BD2C2B8EF3E86B2743A6B9AA7C14D"
          },
          {idx: "158 ", title: "第一次犯罪前在校情况（C16 - C16.5）", typedtlid: "7C6CBF8EE93931098009BBC6C71D5D3A"},
          {idx: "164 ", title: "第一次犯罪前父母监护情况（C17 - C17.3）", typedtlid: "BEC33DE525D932E28A46FA6CD01F9838"},
          {idx: "168 ", title: "第一次犯罪前社会不公或挫折感（C18 - C18.1）", typedtlid: "3D845B541AB039839D4721F30C0A9D52"},
          {idx: "170 ", title: "第一次犯罪前遭受犯罪侵害（C19 - C19.3）", typedtlid: "93EFF0B3E2E036318526B3C098865598"}
        ], type: "C"
      }
    ];
    $scope.questionLis = [
      {
        "classify": "基本情况",
        "code": "A1",
        "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
        "idx": 1,
        "name": "首先，请告诉我你具体是哪一天出生的？",
        "option": [
          {
            "child": false,
            "format": "3",
            "isdesc": 0,
            "label": "请告诉我你具体是哪一天出生的",
            "optionfk": "CD36758F517F4270B5B63BE8C28D051F",
            "questionfk": "261904B9D7AD48758A223439D6B6E0C5",
            "type": "6",
            "value": ""
          }
        ],
        "qclassify": "年龄",
        "qtip": "（提示：记下具体日期）",
        "questionfk": "261904B9D7AD48758A223439D6B6E0C5",
        "type": "3"
      },
      {
        "classify": "基本情况",
        "code": "A2",
        "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
        "idx": 2,
        "name": "你的性别？",
        "option": [
          {
            "child": false,
            "isdesc": 0,
            "label": "男",
            "optionfk": "5E76E8618F154ABAA53E03365734764D",
            "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
            "value": "1"
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "女",
            "optionfk": "F9D92D61EBFB41F69FA7E84F92253F17",
            "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
            "value": "2"
          }
        ],
        "qclassify": "性别",
        "questionfk": "2ED000880A3D48D0ACB56D5571FE77A3",
        "type": "1"
      },
      {
        "classify": "基本情况",
        "code": "A7.2",
        "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
        "idx": 19,
        "name": "如果你有残疾，是哪种残疾？什么时候开始的？",
        "option": [
          {
            "child": false,
            "isdesc": 0,
            "isreject": "1",
            "label": "均无",
            "optionfk": "FD6F0D75CE0B4ED281F54A1C0F52A57B",
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "1"
          },
          {
            "child": true,
            "isdesc": 0,
            "label": "视力残疾（盲人）",
            "optionfk": "BC141D4156924A50B6634CD3264742C7",
            "parentid": "8FF7305F9B194AD2B155FDABBDC048C9",
            "qchild": [
              {
                "code": "A7.2",
                "idx": 19,
                "option": [
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "视力残疾（盲人）",
                    "optionfk": "5E26B487089A49B9BC42C1E193380909",
                    "prefix": "时间",
                    "questionfk": "8FF7305F9B194AD2B155FDABBDC048C9",
                    "type": "6",
                    "value": ""
                  }
                ],
                "questionfk": "8FF7305F9B194AD2B155FDABBDC048C9",
                "type": "3"
              }
            ],
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "2"
          },
          {
            "child": true,
            "isdesc": 0,
            "label": "听力和言语残疾（聋哑人）",
            "optionfk": "DA0F3A0846F64FDD8F0DAE5A808F0987",
            "parentid": "A356E33E5A1942AD813DF19AB2D4EAE6",
            "qchild": [
              {
                "code": "A7.2",
                "idx": 19,
                "option": [
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "听力和言语残疾（聋哑人）",
                    "optionfk": "E953E1B718624FCC903896D3D16900CB",
                    "prefix": "时间",
                    "questionfk": "A356E33E5A1942AD813DF19AB2D4EAE6",
                    "type": "6",
                    "value": ""
                  }
                ],
                "questionfk": "A356E33E5A1942AD813DF19AB2D4EAE6",
                "type": "3"
              }
            ],
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "3"
          },
          {
            "child": true,
            "isdesc": 0,
            "label": "智力残疾",
            "optionfk": "5A33D93C908E49C1806ED35E94098062",
            "parentid": "0A8D51DD8F07400CAAB692F39C4F3252",
            "qchild": [
              {
                "code": "A7.2",
                "idx": 19,
                "option": [
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "智力残疾",
                    "optionfk": "C9AD8FC6FA3D420A90CBC558337C39BB",
                    "prefix": "时间",
                    "questionfk": "0A8D51DD8F07400CAAB692F39C4F3252",
                    "type": "6",
                    "value": ""
                  }
                ],
                "questionfk": "0A8D51DD8F07400CAAB692F39C4F3252",
                "type": "3"
              }
            ],
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "4"
          },
          {
            "child": true,
            "isdesc": 0,
            "label": "肢体残疾",
            "optionfk": "A151BB97DD0B432FB58BE47694DEF588",
            "parentid": "083C5BEEB0D14DBD8FF49B875A265B44",
            "qchild": [
              {
                "code": "A7.2",
                "idx": 19,
                "option": [
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "肢体残疾",
                    "optionfk": "6141F854ACC149389B1F231BF8328C11",
                    "prefix": "时间",
                    "questionfk": "083C5BEEB0D14DBD8FF49B875A265B44",
                    "type": "6",
                    "value": ""
                  }
                ],
                "questionfk": "083C5BEEB0D14DBD8FF49B875A265B44",
                "type": "3"
              }
            ],
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "5"
          },
          {
            "child": true,
            "descr": "（注明）",
            "isdesc": 1,
            "label": "其他",
            "optionfk": "07C5509F58714076986DB5189384070E",
            "parentid": "EF1F92A64A52451BB9ED1E81CC5CBDBF",
            "qchild": [
              {
                "code": "A7.2",
                "idx": 19,
                "option": [
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "其他",
                    "optionfk": "46B37CDB94BB458ABE1E32266410A2F0",
                    "questionfk": "EF1F92A64A52451BB9ED1E81CC5CBDBF",
                    "type": "1",
                    "value": ""
                  },
                  {
                    "format": "1",
                    "isdesc": 0,
                    "label": "其他",
                    "optionfk": "B74621AD0F0E4CB2B8D0816C2CD77916",
                    "prefix": "时间",
                    "questionfk": "EF1F92A64A52451BB9ED1E81CC5CBDBF",
                    "type": "6",
                    "value": ""
                  }
                ],
                "questionfk": "EF1F92A64A52451BB9ED1E81CC5CBDBF",
                "type": "3"
              }
            ],
            "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
            "value": "6"
          }
        ],
        "qclassify": "身体状况",
        "qtip": "（有几项记几项，记下时间）",
        "questionfk": "A1EF8E4D0ADA4873B16C904C2CA5B128",
        "type": "2"
      },

      {
        "classify": "基本情况",
        "code": "A3",
        "fatherclassifyid": "00C54491D55E492E998FAB23D46DF457",
        "idx": 3,
        "name": "你属于哪一个民族？",
        "option": [
          {
            "child": false,
            "isdesc": 0,
            "label": "汉族",
            "optionfk": "4A89C81027754A259373C90C59A4855F",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 0
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "壮族",
            "optionfk": "6C348167FFB84345A96172FDD4DF41F7",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 1
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "回族",
            "optionfk": "5CEA2248D4504D4DAE663FF69970031A",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 2
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "满族",
            "optionfk": "56D7D47BE9DA4925A3D25D3241762DE3",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 3
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "维吾尔族",
            "optionfk": "013306A9C50F4B3C8268A99C72771D83",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 4
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "苗族",
            "optionfk": "7587BC514DA64C9B8175AA5A1F39D5BC",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 5
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "彝族",
            "optionfk": "2EA502D151F64A9789CB6893802B7DC4",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 6
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "土家族",
            "optionfk": "56CBA6D3D1924C82B223E32DF156EA43",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 7
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "藏族",
            "optionfk": "F6B8E6388CA64B68A3C414490368403B",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 8
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "蒙古族",
            "optionfk": "8E20E443358F41BEB6E24D083685244E",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 9
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "侗族",
            "optionfk": "B50080AC931C4D5EAFBD4D0806214DB4",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 10
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "布依族",
            "optionfk": "AD26747603AB40399FDF187598C4191F",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 11
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "瑶族",
            "optionfk": "4E196357CA194D7CB0D33CBD9E552A58",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 12
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "白族",
            "optionfk": "EA1BDD0888544390B85689BA2AFFB1C4",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 13
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "朝鲜族",
            "optionfk": "092F181CE7F944C59CD62BBB9C05F308",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 14
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "哈尼族",
            "optionfk": "C514B41F16964B949F8CD27E99ACC6FD",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 15
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "黎族",
            "optionfk": "7F587EE27DE14EE1845A8E91E92E6A05",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 16
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "哈萨克族",
            "optionfk": "4B3E3DE65F5C4D2EB41B4C429D0C015F",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 17
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "傣族",
            "optionfk": "FF6C60C76EE341C2BA30CF8F6241F13E",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 18
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "畲族",
            "optionfk": "6D8383D0B6D84339A0A29186FF10D02C",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 19
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "傈僳族",
            "optionfk": "647A4562F7F64F12B4673F2BBE122E9A",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 20
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "东乡族",
            "optionfk": "48004348CBDF408EABAA4827C992FC56",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 21
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "仡佬族",
            "optionfk": "D254437F8A9E4FD58D4AAD9C74909769",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 22
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "拉祜族",
            "optionfk": "574D9836DF6F455F90D06E58F1F5C34A",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 23
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "佤族",
            "optionfk": "2C3B05E8D31F484DA6CD436EEFAC929D",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 24
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "水族",
            "optionfk": "71D858DB052D421EA56304ED46F30A3A",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 25
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "纳西族",
            "optionfk": "E24C85333AE046A3AC439EC55BC93371",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 26
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "羌族",
            "optionfk": "D14BFEF9FA0A47E7B911D52FF7278F3F",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 27
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "土族",
            "optionfk": "D18A3471DBF740B692FA0C7F1FE7C9A6",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 28
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "仫佬族",
            "optionfk": "BA2EE80A54D142A29440DA30CECC36C4",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 29
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "锡伯族",
            "optionfk": "FC792646CB5F4227BC4C2C80BC57A269",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 30
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "柯尔克孜族",
            "optionfk": "CF44978CB3AD4C848BC2C8008318A761",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 31
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "景颇族",
            "optionfk": "6711AE8679C148038E7520B46734A17C",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 32
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "达斡尔族",
            "optionfk": "F6910EE11C7C4426A872FB9A4CEFC8E5",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 33
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "撒拉族",
            "optionfk": "2A90AB4EA7694B6894884E0C7885191D",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 34
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "布朗族",
            "optionfk": "19071A44E8524F1EA4EEC818F528739E",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 35
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "毛南族",
            "optionfk": "B111C61D249941D98012FC43C5525853",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 36
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "塔吉克族",
            "optionfk": "B8A62BBE893241919525BCE2C4E514D7",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 37
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "普米族",
            "optionfk": "7329FDE7440D4336A927FF4969BA31D8",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 38
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "阿昌族",
            "optionfk": "AB9F93102D3E4A27852BE2FA26CFD981",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 39
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "怒族",
            "optionfk": "241DF294831040E7936B8CED7DA5F70E",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 40
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "鄂温克族",
            "optionfk": "9B0C9C11A7B441738A6025941FA3330D",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 41
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "京族",
            "optionfk": "30B3DF44734E48AC90A197657CCF8DD6",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 42
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "基诺族",
            "optionfk": "ECEB285511F241869ED452B0291DCFCB",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 43
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "德昂族",
            "optionfk": "C22A304A0EB94CE98DE6B384DC3C973D",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 44
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "保安族",
            "optionfk": "58C7EF6026764556BE97674D0951A210",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 45
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "俄罗斯族",
            "optionfk": "CCC3A9F7037F458CBF76326107D9F0A2",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 46
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "裕固族",
            "optionfk": "63E37D7AA2284345908D2A28CDFFDC48",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 47
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "乌孜别克族",
            "optionfk": "9DB706692FF743FEB0F0F2DEAA2F3EBD",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 48
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "门巴族",
            "optionfk": "28A11C299ECB4815A122369145B68162",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 49
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "鄂伦春族",
            "optionfk": "E0842584E9C34F32BE2C2BCEC1F261D3",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 50
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "独龙族",
            "optionfk": "C12A4B67C69F4A5BBC0864466DE726E9",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 51
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "赫哲族",
            "optionfk": "931436F7A55D49BC9E1C3033E4A3B3A3",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 52
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "高山族",
            "optionfk": "FD1106F2A30347FEA93FB757938F512A",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 53
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "珞巴族",
            "optionfk": "641CF32AFC8349599A2C61E8B3A56EFA",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 54
          },
          {
            "child": false,
            "isdesc": 0,
            "label": "塔塔尔族",
            "optionfk": "621A904B068249468F6A4BA026D97028",
            "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
            "value": 55
          }
        ],
        "qclassify": "民族",
        "questionfk": "5D1DE8AFA28A42D4A02EAE1B39E8DE88",
        "type": "4"
      },

      {
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
      },
      {
        "classify": "早期成长经历",
        "code": "B2.1",
        "fatherclassifyid": "1CA7D5765C6140A497CF33469AEF1B54",
        "idx": 32,
        "name": "你是否为留守儿童？",
        "option": [
          {
            "child": false,
            "isdesc": 0,
            "label": "否",
            "optionfk": "10E7B677C50541BCBCBB51B0926924F8",
            "questionfk": "83B8679D369846F7BF5B165D43B33937",
            "value": "1"
          },
          {
            "child": true,
            "isdesc": 0,
            "label": "是",
            "optionfk": "7F3CFDF7E1D3425884FDC023B2ADB054",
            "parentid": "D3BBF1ED06C54E57A7B93B455B8B8389",
            "qchild": [
              {
                "code": "B2.1",
                "idx": 32,
                "option": [
                  {
                    "format": "2",
                    "isdesc": 0,
                    "label": "起始时间",
                    "optionfk": "8ECAF2DC881740B2A19E40C064F026E9",
                    "prefix": "起始时间：",
                    "questionfk": "D3BBF1ED06C54E57A7B93B455B8B8389",
                    "type": "6",
                    "value": ""
                  },
                  {
                    "isdesc": 0,
                    "label": "累计时间",
                    "maxnumber": "100",
                    "optionfk": "5E09F4A9E05F4ED79890E0A158A611F5",
                    "prefix": "累计时间：",
                    "questionfk": "D3BBF1ED06C54E57A7B93B455B8B8389",
                    "suffix": "年",
                    "type": "2",
                    "value": ""
                  },
                  {
                    "isdesc": 0,
                    "label": "累计时间",
                    "maxnumber": "11",
                    "optionfk": "35974EB471BB4E788EA6CD387BB79B1E",
                    "questionfk": "D3BBF1ED06C54E57A7B93B455B8B8389",
                    "suffix": "月",
                    "type": "2",
                    "value": ""
                  }
                ],
                "qpremise": "你14岁以前有过以下情况吗？",
                "questionfk": "D3BBF1ED06C54E57A7B93B455B8B8389",
                "type": "3"
              }
            ],
            "questionfk": "83B8679D369846F7BF5B165D43B33937",
            "value": "2"
          }
        ],
        "qclassify": "留守流浪经历",
        "qpremise": "你14岁以前有过以下情况吗？",
        "questionfk": "83B8679D369846F7BF5B165D43B33937",
        "type": "1"
      },
    ];
    $scope.allM = [];
    $scope.allQ = [];
    $scope.contentsList.map((_a, _ai) => {
      $scope.allM = $scope.allM.concat(_a.secondary);
      _a.secondary.map((_b, _bi) => {
        if (!_b.questionlist) _b.questionlist = [];
        _b.lenQ = _b.questionlist.length ? _b.questionlist.length : 0;
        if (_ai === 0 && _bi === 0) _b.idx = 0;
        $scope.allQ = $scope.allQ.concat(_b.questionlist);
      });
    });
    $scope.allM.map((_m, _mi) => {
      if (_mi) {
        muluLen = muluLen + parseInt(_m.lenQ);
        _m.idx = muluLen;
      }
    });

    $scope.getNaire = function () {
      $scope.loading = {
        isLoading: true,
        content: '问卷数据加载中'
      };

      var url, data;
      url = domain + '/terminal/interview/system.do?action=getQuestionListByTypeId';
      data = {
        id: wjId
      };

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          .then(function (data) {
            console.log(data);
            if (data.result && data.result.rows) {
              $scope.contentsList.map((_a, _ai) => {
                $scope.allM = $scope.allM.concat(_a.secondary);
                _a.secondary.map((_b, _bi) => {
                  if (!_b.questionlist) _b.questionlist = [];
                  _b.lenQ = _b.questionlist.length ? _b.questionlist.length : 0;
                  if (_ai === 0 && _bi === 0) _b.idx = 0;
                  $scope.allQ = $scope.allQ.concat(_b.questionlist);
                });
              });
              $scope.allM.map((_m, _mi) => {
                if (_mi) {
                  muluLen = muluLen + parseInt(_m.lenQ);
                  _m.idx = muluLen;
                }
              });
              console.log($scope.contentsList);
              console.log($scope.allM);
              $scope.loading.isLoading = false;
            } else {
              $scope.contentsList = [];
              _remind(4, '该问卷暂无目录，请前往目录设置');
              $scope.loading.isLoading = false;
            }
          })
      })
    };

    $scope.directory = function () {
      iConfirm.show({
        scope: $scope,
        title: '确认离开前往目录设置？',
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
    $scope.confirmSuccess = function (id) {
      iConfirm.close(id);
      $state.params = {
        data: {id: wjId, name: wjName}
      };
      $state.go('system.ftappdirectory', $state.params)
    };

    $scope.menuClick = function ($event, data) {
      $($event.currentTarget).find('ol.contents-fold').slideToggle();
      data.hasFold = !data.hasFold;
    };
    $scope.catalogClick = function ($event, data) {
      $event.stopPropagation();
      $scope.questionList = data.questionlist;
      muluId = data.typedtlid;
      $scope.data.catalogIdx = data.idx;
    };

    $scope.editQ = function (questionlist, $index) {
      let editingQ = _.where(questionlist, {editing: true});
      if (!editingQ.length) {
        questionlist[$index].editing = true;
      } else {
        _remind(3, '还有正在编辑的问题，请编辑完成后点击保存后再编辑其他问题！', '请保存正在编辑的问题')
      }
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
        if (type === 'question') _remind(3, '最后一题不能再下移');
        else _remind(3, '最后一个不能再下移');
        return;
      }
      _swapItems(arr, $index, $index + 1);
    };
    $scope.copy = function ($index) {
      let copyQ = JSON.parse(JSON.stringify($scope.questionList[$index]));
      copyQ.idx = copyQ.idx + 1;
      $scope.questionList.splice($index, 0, copyQ);
    };
    $scope.del = function (arr, $index, type) {
      if (type === 'option' && arr.length <= 2) {
        _remind(3, '最少保留2个选项');
        return;
      } else if (type === 'input' && arr.length <= 1) {
        _remind(3, '最少保留1个选项');
        return;
      }
      arr.splice($index, 1);
    };
    $scope.addOption = function (arr, $index) {
      let newLabel = {label: ''};
      arr.splice($index + 1, 0, newLabel);
    };
    $scope.addInput = function (arr, $index) {
      let newLabel = {type: '1'};
      arr.splice($index + 1, 0, newLabel);
    };
    $scope.setQ = function ($index) {
      indexQ = $index;
      $scope.question = $scope.questionList[$index];
      $scope.data.batchOptions = $scope.question.option.filter(_ => _.label).map(_ => _.label).join(',');
    };
    $scope.saveOption = function () {
      let newLabels = [],
        newOptions = [];
      if ($scope.data.batchOptions) newLabels = $scope.data.batchOptions.split(',').filter(_ => _ && _.trim());

      if (newLabels.length) {
        newOptions = [];
        newLabels.map(_ => {
          newOptions.push({label: _});
        });
        $scope.questionList[indexQ].option = newOptions;
        $('#optionModal').modal('hide')
      } else $('#optionModal').modal('hide')
    };
    $scope.setJumpQ = function ($index) {
      indexQ = $index;
      $scope.question = JSON.parse(JSON.stringify($scope.questionList[$index]));
    };
    $scope.setJump = function (question, type) {
      console.log($scope.allQ);
      $scope.jumpQlist = $scope.allQ.splice(question.idx, $scope.allQ.length - 1);
      switch (type) {
        case 1:
          question.jumpway === '1' ? question.jumpway = '' : question.jumpway = '1';
          delete question.anyjump;
          break;
        case 2:
          question.jumpway === '2' ? question.jumpway = '' : question.jumpway = '2';
          break;
      }
      if (!question.jumpway) {
        question.option.map(_ => {
          delete _.jumpto;
        })
      }
    };
    $scope.saveJumpQ = function () {
      // console.log($scope.question);
      $scope.questionList[indexQ] = $scope.question;
      $('#jumpModal').modal('hide')
    };

    $scope.addQ = function ($index, type, question) {
      if (!muluId) {
        _remind(3, '请先选择在哪个二级目录下添加问题,如果没有请前往目录设置配置目录！', '请选择对应二级目录');
        return false;
      }
      var newQ = {};
      switch (type) {
        case 1:
          newQ = {
            code: '',
            idx: parseInt($scope.data.catalogIdx) + $index,
            jumpway: '',
            name: '单选题目',
            type: '1',
            typename: '单选',
            editing: true,
            option: [{label: '', value: '1'}, {label: '', value: '2'}]
          };
          break;
        case 2:
          newQ = {
            code: '',
            idx: parseInt($scope.data.catalogIdx) + $index,
            jumpway: '',
            name: '多选题目',
            type: '2',
            typename: '多选',
            editing: true,
            option: [{label: '', value: '1'}, {label: '', value: '2'}]
          };
          break;
        case 3:
          newQ = {
            code: '',
            idx: parseInt($scope.data.catalogIdx) + $index,
            jumpway: '',
            name: '填空题目',
            type: '3',
            typename: '填空',
            editing: true,
            option: [{label: '', value: '', content: '', type: '1'}]
          };
          break;
        case 4:
          newQ = {
            code: '',
            idx: parseInt($scope.data.catalogIdx) + $index,
            jumpway: '',
            name: '下拉选择题目',
            type: '4',
            typename: '下拉选择',
            editing: true,
            option: [{label: '', value: '1'}, {label: '', value: '2'}]
          };
          break;
      }
      if (question) {
        newQ.idx = parseInt(question.idx) + 1;
        $scope.questionList.splice($index + 1, 0, newQ);
      } else {
        newQ.idx = $scope.data.catalogIdx + 1;
        $scope.questionList.splice($index, 0, newQ);
      }

    };
    $scope.saveQ = function (question) {
      console.log(question);
      if ((question.type !== '3' && question.option.some(_ => !_.label)) || (question.type === '3' && question.option.some(_ => !_.type))) {
        _remind(3, '请将题目编辑完善后提交', '请完善题目');
        return false;
      }
      if (question.option.length) {
        question.option.map((_, i) => _.idx = i + 1);
      }
      $scope.allM = [];
      $scope.allQ = [];
      $scope.contentsList.map((_a, _ai) => {
        $scope.allM = $scope.allM.concat(_a.secondary);
        _a.secondary.map((_b, _bi) => {
          if (!_b.questionlist) _b.questionlist = [];
          _b.lenQ = _b.questionlist.length ? _b.questionlist.length : 0;
          if (_ai === 0 && _bi === 0) _b.idx = 0;
          $scope.allQ = $scope.allQ.concat(_b.questionlist);
        });
      });
      $scope.allM.map((_m, _mi) => {
        if (_mi) {
          muluLen = muluLen + parseInt(_m.lenQ);
          _m.idx = muluLen;
        }
      });
      question.editing = false;
      return false;
      $scope.loading = {
        isLoading: true,
        content: '题目提交中'
      };
      var data = Object.assign({nairefk: wjId, typedtlid: muluId}, question);
      var url, data;
      url = domain + '/terminal/interview/system.do?action=saveQuestion';
      data = Object.assign({nairefk: wjId, typedtlid: muluId}, question);

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          .then(function (data) {
            _remind(1, data.message, '消息提醒');
            $scope.loading.isLoading = false;
            question.editing = false;
          }, function (err) {
            _remind(4, err.message, '消息提醒');
          })
      })
    };
    $scope.delQ = function (question, $index) {
      $scope.loading = {
        isLoading: true,
        content: '删除题目提交中'
      };

      var url, data;
      url = domain + '/terminal/interview/system.do?action=deleteQuestionOrOption';
      data = {
        nairefk: wjId,
        idx: question.idx,
        ids: [question.questionfk]
      };

      getToken(function (token) {
        iAjax
          .post(`${url}&authorization=${token}`, data)
          .then(function (data) {
            _remind(1, data.message, '消息提醒');
            $scope.questionList.splice($index, 1);
            $scope.loading.isLoading = false;
          }, function (err) {
            _remind(4, err.message, '消息提醒');
          })
      })
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

    $scope.$on('ftappQuestionnaireControllerOnEvent', function () {
      // $scope.getNaire();
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
