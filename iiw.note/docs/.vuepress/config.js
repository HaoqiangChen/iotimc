module.exports = {
  title: '安防平台开发笔记',
  description: '安防平台iiw前端框架开发指南',
  base: '/iotimc/',
  port: '6683',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '安防平台开发笔记',
      description: '安防平台iiw前端框架开发指南'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Security platform development notes',
      description: 'Security platform iiw front-end framework development guidelines'
    },
  },
  head: [
    ['link', {rel: 'icon', href: `/logo.png`}],
  ],
  // configureWebpack: {
  //     resolve: {
  //         alias: {
  //             '@': '../.vuepress',
  //             '@public': './public',
  //         }
  //     }
  // },
  themeConfig: {
    logo: '/logo.png',
    navbar: true,
    sidebar: 'auto',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: '上次更新',
    repo: 'HaoqiangChen/iotimc',
    docsDir: 'iiw.note/docs',
    smoothScroll: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: require('./nav/zh'),
        sidebar: {
          '/note/': getNoteSidebar('常用代码', '业务配置', 'angularjs'),
          '/api/': getApiSidebar('iAjax', 'iiw API'),
          '/chart/': getChartSidebar('图表', '大数据平台'),
          '/oracle/': getSqlSidebar('数据库'),
          '/project/': getProjectSidebar('项目')
        }
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: {}
      }
    }
  },

  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    ['vuepress-plugin-code-copy', true],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }]
  ]
}

function getNoteSidebar(noteA, noteB, noteC) {
  return [
    {
      title: noteA,
      collapsable: false,
      children: [
        '/note/iiw-code/',
        '/note/iiw-code/safe',
        '/note/iiw-code/system',
      ]
    },
    {
      title: noteB,
      collapsable: false,
      children: [
        '/note/iiw-config/'
      ]
    },
    {
      title: noteC,
      collapsable: false,
      children: [
        '/note/angularjs/',
        '/note/angularjs/filter',
        '/note/angularjs/directives',
        '/note/angularjs/services'
      ]
    }
  ]
}

function getApiSidebar(apiA, apiB) {
  return [
    {
      title: apiA,
      collapsable: false,
      children: [
        '/api/iiwpost/',
        '/api/iiwpost/port',
        '/api/iiwpost/other',
      ]
    },
    {
      title: apiB,
      collapsable: false,
      children: [
        ['/api/iiwapi/', 'iiw.api']
      ]
    }
  ]
}

function getChartSidebar(groupA, introductionA) {
  return [
    {
      title: groupA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/chart/', introductionA],
        '/chart/theme',
        '/chart/echarts',
      ]
    }
  ]
}

function getSqlSidebar(sqlA) {
  return [
    {
      title: sqlA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        '/oracle/',
        '/oracle/sql'
      ]
    }
  ]
}

function getProjectSidebar(ItemA) {
  return [
    {
      title: ItemA,
      collapsable: false,
      sidebarDepth: 2,
      children: [
        '/project/',
        '/project/applet',
        '/project/app',
        '/project/terminal'
      ]
    }
  ]
}
