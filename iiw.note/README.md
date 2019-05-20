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

### VuePress 目录结构

VuePress 遵循 **“约定优于配置”** 的原则，推荐的目录结构如下：

.  
├── docs  
│   ├── .vuepress _(**可选的**)_  
│   │   ├── `components` _(**可选的**)_  
│   │   ├── `theme` _(**可选的**)_  
│   │   │   └── Layout.vue  
│   │   ├── `public` _(**可选的**)_  
│   │   ├── `styles` _(**可选的**)_  
│   │   │   ├── index.styl  
│   │   │   └── palette.styl  
│   │   ├── `templates` _(**可选的, 谨慎配置**)_  
│   │   │   ├── dev.html  
│   │   │   └── ssr.html  
│   │   ├── `config.js` _(**可选的**)_  
│   │   └── `enhanceApp.js` _(**可选的**)_  
│   │   
│   ├── README.md  
│   ├── guide  
│   │   └── README.md  
│   └── config.md  
│   
└── package.json  

请留意目录名的大写。

- `docs/.vuepress`: 用于存放全局的配置、组件、静态资源等。
- `docs/.vuepress/components`: 该目录中的 Vue 组件将会被自动注册为全局组件。
- `docs/.vuepress/theme`: 用于存放本地主题。
- `docs/.vuepress/styles`: 用于存放样式相关的文件。
- `docs/.vuepress/styles/index.styl`: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级。
- `docs/.vuepress/styles/palette.styl`: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量。
- `docs/.vuepress/public`: 静态资源目录。
- `docs/.vuepress/templates`: 存储 HTML 模板文件。
- `docs/.vuepress/templates/dev.html`: 用于开发环境的 HTML 模板文件。
- `docs/.vuepress/templates/ssr.html`: 构建时基于 Vue SSR 的 HTML 模板文件。
- `docs/.vuepress/config.js`: 配置文件的入口文件，也可以是 `YML` 或 `toml`。
- `docs/.vuepress/enhanceApp.js`: 客户端应用的增强。

当你想要去自定义 `templates/ssr.html` 或 `templates/dev.html` 时，最好基于 [默认的模板文件](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/core/lib/client/index.dev.html) 来修改，否则可能会导致构建出错。
