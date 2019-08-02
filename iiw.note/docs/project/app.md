# APP

## 问卷调查APP

![问卷调查APP](/iotimc/app-wenjuan.png)

主要功能是用于做问卷调查的一个APP里的一个页面。  
APP是曾于伟那边开发，然后我这边使用 vue框架架构了一个脚手架开发的一个页面，然后嵌套到 他那边APP去。但是由于是与APP对接，有些接口是需要在APP环境下开发才行，所以导致如果直接 浏览器运行，会报错。所以开发调试变得有点麻烦，要先跟大伟拿测试APP，在里面设置你这边运行的测试地址，然后将可以在app里面查看打印结果的
Vconsole，边开发边看Vconsole。

但是有些功能不需要跟APP对接的，倒是可以直接浏览器开发，npm install 之后，运行 npm run dev跑项目，然后询问后端一些必要参数，之后直接在运行之后的地址后面加上`?paperfk=354DD9C8DD08460A83BDA9A06D874B86&token=&recordfk=1e304d458a6a4fdc9afe029f912308b9&type=wjdc&isonline=3#/wjdc`  
其中`paperfk`为问卷ID，`recordfk`为记录ID，`type`为页面类型，`isonline`为在线问卷还是离线；  
`token`为token验证，需要先请求登陆接口获取，这些参数全部由APP，也就是大伟那边提供的，所以就没将获取token写死，测试时可以手动直接打开
`http://iotimc8888.goho.co:17783/sys/web/login.do?action=login&username=13712312312&password=XASR5G2454CW343C705E7141C9F793E`获取

里面有些页面，是为了方便开发调试而弄得，到时候打包的时候，不需要打包发出去。只需要在`router/index.js`里面注释掉`isonline=3`的页面

* [vue文档: https://cn.vuejs.org/](https://cn.vuejs.org/)
* [源码-git仓库: https://code.aliyun.com/iotimc_dev/APPProject.git](https://code.aliyun.com/iotimc_dev/APPProject.git) questionnaire目录

## 驿道APP

主要功能有有查询会见情况和记录以及审批会见申请、家属汇款和会见预约及查询记录功能等等,用于司法所的远程视频会见管理APP

主框架为 **uni-app** <https://uniapp.dcloud.io/>

## 值班管理APP

![值班管理APP](/iotimc/app-duty.png)

## 信息速报APP

![信息速报APP](/iotimc/app-infoReport.png)

## 要情上报APP

![要情上报APP](/iotimc/app-yaoqing.png)

### 项目开发

以上三个项目`值班管理APP` `信息速报APP` `要情上报APP` 用Hbuildx编辑器开发，使用uniapp框架搭建。

* [uniapp: https://uniapp.dcloud.io/README](https://uniapp.dcloud.io/README)
* [源码-git仓库: https://code.aliyun.com/iotimc-terminal/H5-APP.git](https://code.aliyun.com/iotimc-terminal/H5-APP.git)

### 运行调试和打包

先进行npm包安装，命令行运行 npm install

#### 调试

在Hbuildx中打开该项目，点击菜单栏“运行” => “运行到浏览器” 就可以进行 谷歌浏览器调试（H5开发）
在Hbuildx中打开该项目，点击菜单栏“运行” => “运行到手机或模拟器” 就可以进行 真机调试（APP开发）

需要注意的是，这几个APP是配合曾于伟那边的启动器运行的，打开之前会先进行他那边的数据获取，获取设备配置信息，比如服务器地址等。  
启动器APP包放在该项目`apk`目录下，电脑连接终端或者话机之后，命令行运行`adb install 启动器apk绝对路径`安装之后打开进行配置。  
如果没有获取到，为了个人调试方便，一旦获取不到数据，会有弹窗提醒，并且在右上角会有个设置图标，点击可手动配置服务器地址和设备唯一标识。

#### 打包

调试或打包时，根据APP使用对应APP首页，将首页放于`pages.json`中`pages数组`的第一个元素，比如打包调试值班APP时，将 `pages/duty/duty`页面放于`pages数组`第一个元素。
* 值班管理APP首页：`pages/duty/duty`
* 信息速报APP首页：`pages/info-report/info-report`
* 要情上报APP首页：`pages/yaoqing-record/yaoqing-record`

打包根据不同APP，需要将APP配置`manifest.json`进行修改，比如需要用3个不同`APPID`作为区分，名称和版本也需要调整修改。启动图和APP图标配置也一样。

![基础配置](http://8.129.6.47:8090/iiw/iiw.familymeeting_remote/webapp/html/image1.png)

以上信息修改好之后，点击菜单栏“发行” => “云打包”

![云打包](http://8.129.6.47:8090/iiw/iiw.familymeeting_remote/webapp/html/image2.png)

