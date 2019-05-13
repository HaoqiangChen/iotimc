<!-- @author chenhaoqiang (chenhaoqiang.irxk@gmail.com) -->
<!-- @date    2019-04-01 10:30:36 -->
# 说明

公司智能安防集成平台项目

由于公司代码保密原则，全部完整的代码在公司，并且公司有自己内网布的 SVN 代码版本管理。  
只是为了方便我个人工作开发，`家里台式 ↔ 公司电脑 ↔ 出差笔记本`  之间代码同步，我将一部分工作内容放到 git远程仓库上，方便几台电脑之间同步更新。  
拿需要工作的代码内容，做完之后放到公司，之后再将git上的删除。  

## 项目地址

- Git仓库：<https://github.com/HaoqiangChen/iotimc>
- 个人工作开发笔记：<https://haoqiangchen.github.io/iotimc/>
- 内网SVN仓库(safe)：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.safe>
- 内网SVN仓库(system)：<http://192.168.0.250:2233/svn/iiw/trunk/iiw.system>
- 内网项目地址：<http://192.168.0.251/>
- 内网API文档：<http://192.168.0.251:7001/>
- 本地API文档：<a href="file://C:/Users/iotimc/Desktop/iotimc/iiw.api/192.168.0.251_7001/index.html" target="_blank">双击打开本项目`iiw.api`下`index.html`</a>

## 目录说明

.
├── iiw _(**仿公司安防平台自己搭建的一个简陋脚手架**)_
│   └── app
├── iiw.api _(**安防平台API文档本地版**)_
├── iiw.note _(**个人工作开发笔记，文档是用`vuepress`极简静态网站生成器**)_
│   └── docs _(**vuePress docs**)_
├── iiw.command _(**command模块**)_
│   └── iiw.command.xxx _(**command子模块**)_
├── iiw.safe _(**安防平台前台页面模块**)_
│   └── iiw.safe.xxx _(**safe子模块**)_
├── iiw.system _(**安防后台前台页面模块**)_
│   └── iiw.system.xxx _(**system子模块**)_
├── iiwlib _(**项目本地开发端口指定node.js**)_
│ 
└── package.json
