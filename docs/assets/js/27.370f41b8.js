(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{356:function(t,a,r){"use strict";r.r(a);var e=r(12),_=Object(e.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#app"}},[t._v("#")]),t._v(" APP")]),t._v(" "),r("h2",{attrs:{id:"驿道app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#驿道app"}},[t._v("#")]),t._v(" 驿道APP")]),t._v(" "),r("p",[t._v("主要功能有有查询会见情况和记录以及审批会见申请、家属汇款和会见预约及查询记录功能等等,用于司法所的远程视频会见管理APP")]),t._v(" "),r("p",[t._v("主框架为 "),r("strong",[t._v("uni-app")]),t._v(" "),r("a",{attrs:{href:"https://uniapp.dcloud.io/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://uniapp.dcloud.io/"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"值班管理app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#值班管理app"}},[t._v("#")]),t._v(" 值班管理APP")]),t._v(" "),r("p",[r("img",{attrs:{src:"/iotimc/app-duty.png",alt:"值班管理APP"}})]),t._v(" "),r("h2",{attrs:{id:"信息速报app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#信息速报app"}},[t._v("#")]),t._v(" 信息速报APP")]),t._v(" "),r("p",[r("img",{attrs:{src:"/iotimc/app-infoReport.png",alt:"信息速报APP"}})]),t._v(" "),r("h2",{attrs:{id:"要情上报app"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#要情上报app"}},[t._v("#")]),t._v(" 要情上报APP")]),t._v(" "),r("p",[r("img",{attrs:{src:"/iotimc/app-yaoqing.png",alt:"要情上报APP"}})]),t._v(" "),r("h3",{attrs:{id:"项目开发"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#项目开发"}},[t._v("#")]),t._v(" 项目开发")]),t._v(" "),r("p",[t._v("以上三个项目"),r("code",[t._v("值班管理APP")]),t._v(" "),r("code",[t._v("信息速报APP")]),t._v(" "),r("code",[t._v("要情上报APP")]),t._v(" 用Hbuildx编辑器开发，使用uniapp框架搭建。")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://uniapp.dcloud.io/README",target:"_blank",rel:"noopener noreferrer"}},[t._v("uniapp"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("a",{attrs:{href:"https://code.aliyun.com/iotimc-terminal/H5-APP.git",target:"_blank",rel:"noopener noreferrer"}},[t._v("git仓库"),r("OutboundLink")],1)])]),t._v(" "),r("h3",{attrs:{id:"运行调试和打包"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#运行调试和打包"}},[t._v("#")]),t._v(" 运行调试和打包")]),t._v(" "),r("p",[t._v("先进行npm包安装，命令行运行 npm install")]),t._v(" "),r("h4",{attrs:{id:"调试"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#调试"}},[t._v("#")]),t._v(" 调试")]),t._v(" "),r("p",[t._v("在Hbuildx中打开该项目，点击菜单栏“运行” => “运行到浏览器” 就可以进行 谷歌浏览器调试（H5开发）\n在Hbuildx中打开该项目，点击菜单栏“运行” => “运行到手机或模拟器” 就可以进行 真机调试（APP开发）")]),t._v(" "),r("p",[t._v("需要注意的是，这几个APP是配合曾于伟那边的启动器运行的，打开之前会先进行他那边的数据获取，获取设备配置信息，比如服务器地址等。"),r("br"),t._v("\n启动器APP包放在该项目"),r("code",[t._v("apk")]),t._v("目录下，电脑连接终端或者话机之后，命令行运行"),r("code",[t._v("adb install 启动器apk绝对路径")]),t._v("安装之后打开进行配置。"),r("br"),t._v("\n如果没有获取到，为了个人调试方便，一旦获取不到数据，会有弹窗提醒，并且在右上角会有个设置图标，点击可手动配置服务器地址和设备唯一标识。")]),t._v(" "),r("h4",{attrs:{id:"打包"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#打包"}},[t._v("#")]),t._v(" 打包")]),t._v(" "),r("p",[t._v("调试或打包时，根据APP使用对应APP首页，将首页放于"),r("code",[t._v("pages.json")]),t._v("中"),r("code",[t._v("pages数组")]),t._v("的第一个元素，比如打包调试值班APP时，将 "),r("code",[t._v("pages/duty/duty")]),t._v("页面放于"),r("code",[t._v("pages数组")]),t._v("第一个元素。")]),t._v(" "),r("ul",[r("li",[t._v("值班管理APP首页："),r("code",[t._v("pages/duty/duty")])]),t._v(" "),r("li",[t._v("信息速报APP首页："),r("code",[t._v("pages/info-report/info-report")])]),t._v(" "),r("li",[t._v("要情上报APP首页："),r("code",[t._v("pages/yaoqing-record/yaoqing-record")])])]),t._v(" "),r("p",[t._v("打包根据不同APP，需要将APP配置"),r("code",[t._v("manifest.json")]),t._v("进行修改，比如需要用3个不同"),r("code",[t._v("APPID")]),t._v("作为区分，名称和版本也需要调整修改。启动图和APP图标配置也一样。")]),t._v(" "),r("p",[r("img",{attrs:{src:"http://8.129.6.47:8090/iiw/iiw.familymeeting_remote/webapp/html/image1.png",alt:"基础配置"}})]),t._v(" "),r("p",[t._v("以上信息修改好之后，点击菜单栏“发行” => “云打包”")]),t._v(" "),r("p",[r("img",{attrs:{src:"http://8.129.6.47:8090/iiw/iiw.familymeeting_remote/webapp/html/image2.png",alt:"云打包"}})])])}),[],!1,null,null,null);a.default=_.exports}}]);