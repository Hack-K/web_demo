## 🔈 项目启动

```
# 克隆项目
git clone
# 进入项目目录
cd zn-admin-web
# 安装项目依赖
npm install 或 cnpm install
# 运行
npm run serve
```

```

#运行代码生成机
npm run template

 1.使用时尽量使用简单单词，不要使用驼峰，驼峰会被认定为多层目录
 2.使用时文件命名切勿与已存在的文件重复，否则可能导致文件丢失
 3.如需生成多层目录，使用/间隔即可
```

## 🔗 目录结构

- ├── .github # 自动化 ci 配置（可删除）
- ├── mock # 本地 mock 数据
- ├── node_modules # 项目依赖模块
- ├── public
- │ ├── img # 
- │ ├── static # 静态资源
- │ ├── favicon.ico # favicon 图标
- │ ├── favicon_backup.ico # 备份 favicon
- │ └── index.html # 入口 HTML
- ├── src
- │ ├── api # API 服务模块
- │ ├── assets # 本地静态资源
- │ │ ├── icon # 存放自定义 svg 图标 ，仅在 icon 属性为 isCustomSvg 时才会调用 svg 图标，如无必要建议使用内置图标
- │ ├── config # 项目配置
- │ │ ├── cli.config.js # vue/cli 配置
- │ │ ├── net.config.js # 网络配置
- │ │ ├── setting.config.js # 通用配置
- │ │ ├── theme.config.js # 主题配置
- │ │ └── index.js # 自定义配置合并（不建议修改）
- │ ├── extra # 封装的小工具
- │ ├── router # 路由配置
- │ ├── store # vuex 状态管理配置
- │ ├── utils # js 工具
- │ ├── zn # 核心模块
- │ │ |── components # 所有 zn 组件
- | | | ├── ZnAppMain # 内页
- | | | ├── ZnAvatar # 头像
- | | | ├── ZnBreadcrumb # 面包屑
- | | | ├── ZnFold # 展开合并
- | | | ├── ZnFullScreen # 全屏
- | | | ├── ZnLogo # logo
- | | | ├── ZnNav # 顶部 navBar
- | | | ├── ZnNotice # 通知
- | | | ├── ZnRefresh # 刷新
- | | | ├── ZnSearch # 搜索
- | | | ├── ZnSideBar # 左侧菜单
- | | | ├── ZnTabs # 多标签页
- | | | ├── ZnTheme # 主题
- | | | ├── ZnTopBar # 横向布局头部
- | | | ├── ZnLink # 链接跳转封装
- | | | ├── ZnMenu # 菜单封装
- │ │ | └── ZnQueryForm # 顶部查询条件布局封装
- │ │ ├── layouts # 界面布局(不需要主题可删除)
- | | | ├── LayoutColumn # 分栏布局
- | | | ├── LayoutCommon # 常规布局
- | | | ├── ZnLayoutComprehensive # 综合布局
- | | | ├── ZnLayoutHorizontal # 横向布局
- | | | ├── ZnLayoutFloat # 浮动布局
- | | | └── ZnLayoutVertical # 纵向布局
- │ │ ├── pulgin # zn 必要插件
- │ │ └── styles # zn 主题相关
- │ ├── views # 页面组件
- │ │ ├── index # 首页
- │ │ ├── callCenter # 呼叫中心
- │ │ ├── customer # 客户中心
- │ │ ├── dataCenter # 数据中心
- │ │ ├── knowledgeBase # 知识库
- │ │ ├── system # 系统管理
- │ │ ├── workOrder # 工单管理
- │ │ ├── login # 登录
- │ │ ├── register # 注册
- │ │ └── zn # 组件页
- │ ├── App.vue # 应用入口组件
- │ ├── registerServiceWorker.js # PWA 注册（支持 https 生产环境）
- │ └── main.js # 应用入口 js
- ├── .eslintrc.js # eslint 配置项
- ├── babel.config.js # babel-loader 配置
- ├── package.json # package.json
- ├── postcss.config.js # postcss 配置
- ├── prettier.config.js # prettier 配置
- ├── zn.config.js # zn 配置
- └── vue.config.js # vue-cli 配置

## 🌱 版权所有

上海市智脑科技有限公司
