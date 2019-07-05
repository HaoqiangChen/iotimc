# APP

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

* [uniapp](https://uniapp.dcloud.io/README)ABP-434
* [git仓库](https://code.aliyun.com/iotimc-terminal/H5-APP.git)

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

