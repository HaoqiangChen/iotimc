# 安防平台开发笔记

> 安防平台iiw前端框架开发指南
> 本文档是用`vuepress`极简静态网站生成器

## 启动
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## vuepress遇到的坑

### 背景

今天在给 VuePress 项目安装 @vuepress/back-to-top 插件时出了个小问题：在依赖和配置都没问题的情况下，插件没有正常显示。终端信息还提示“warning An error was encountered in plugin “@vuepress/back-to-top””，明显就是加载不到插件，那么这个问题如何解决呢？

### 解决办法

在项目下安装 vuepress 依赖 ：

```bash
yarn add -D vuepress
# 或者 npm install -D vuepress
```

个人觉得这很可能是`VuePress`的`BUG…`所以不建议直接使用全局`VuePress`哦~

要了解具体的工作原理，请参阅[指南](http://vuejs.templates.github.io/webpack/)和[vuepress的文档](https://www.vuepress.cn/)。
