@echo 设置中文显示，解决中文乱码
chcp 65001
title vuepress打包脚本
:: color 03 // 背景颜色以及字体颜色，它的值由两位十六进制的数组成，前面一位指的是背景颜色，后面一位指的是字体颜色。

:: mode con cols=40 lines=15 // 设置窗口大小

@echo vuepress 打包中…… 执行 vuepress build docs
call vuepress build docs

@echo vuepress 打包完成，将打包成功的dist目录移动到项目根目录…… 执行 move docs\.vuepress\dist ..
move docs\.vuepress\dist ..

@echo 返回项目根目录 执行 cd..
cd..

@echo 删除根目录docs文件夹 执行 rimraf docs
call rimraf docs

@echo 重命名dist目录为 docs 执行 rename dist docs
rename dist docs

@echo 将iiw.safe安防平台API文档复制到docs目录下 执行 xcopy /S/E/I iiw.api docs\docs
xcopy /S/E/I iiw.api docs\docs

@echo 完成，按任意键退出……

rem pause
