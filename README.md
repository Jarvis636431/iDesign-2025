# 天津大学第十一届设计年展官方网站

> 有风自南，翼彼新苗 —— 天津大学第十一届设计年展

一个基于 Vue.js 3 + Three.js 构建的沉浸式设计年展展示网站，提供 3D 交互展厅浏览、作品展示、毕业生信息管理等功能。

## ✨ 项目特色

- 🎨 **3D 交互展厅** - 使用 Three.js 构建沉浸式 3D 展厅浏览体验
- 📱 **响应式设计** - 完美适配 PC 端和移动端，支持触摸手势操作
- 🖼️ **多媒体展示** - 支持图片、视频、3D 模型等多种媒体格式
- ⚡ **性能优化** - 图片懒加载、代码分割、资源压缩等优化策略
- 🎭 **视觉效果** - 视差滚动、CSS3 动画、流畅的页面过渡
- 👥 **信息管理** - 动态展示毕业生作品和个人信息

## 🛠️ 技术栈

### 前端框架
- **Vue.js 3** - 渐进式 JavaScript 框架
- **Composition API** - Vue 3 组合式 API
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 状态管理库

### 3D 图形
- **Three.js** - 3D 图形库
- **WebGL** - 硬件加速的 3D 渲染

### UI 组件
- **Naive UI** - Vue 3 组件库
- **Xicons** - 图标库

### 构建工具
- **Vite** - 下一代前端构建工具
- **Vue DevTools** - Vue 开发者工具

### 网络请求
- **Axios** - HTTP 客户端

## 📁 项目结构

```
idesign-2025-web/
├── public/                 # 静态资源
│   ├── assets/            # 公共资源
│   │   ├── fonts/         # 字体文件
│   │   ├── images/        # 图片资源
│   │   ├── models/        # 3D 模型文件
│   │   └── videos/        # 视频文件
│   └── favicon.ico        # 网站图标
├── src/
│   ├── components/        # Vue 组件
│   │   ├── common/        # 通用组件
│   │   ├── exhibition/    # 展览相关组件
│   │   ├── graduates/     # 毕业生相关组件
│   │   ├── sections/      # 页面区块组件
│   │   ├── slides/        # 轮播组件
│   │   └── three/         # Three.js 相关组件
│   ├── views/             # 页面视图
│   │   ├── Home.vue       # 首页
│   │   ├── Hall.vue       # 展厅页面
│   │   └── Information.vue # 信息页面
│   ├── router/            # 路由配置
│   ├── utils/             # 工具函数
│   │   ├── CameraController.js  # 相机控制器
│   │   └── SceneManager.js      # 场景管理器
│   ├── constants/         # 常量配置
│   │   ├── graduates.js   # 毕业生数据
│   │   ├── halls.js       # 展厅数据
│   │   └── staff.js       # 工作人员数据
│   ├── api/               # API 接口
│   ├── assets/            # 样式资源
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
└── package.json           # 项目配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 [http://localhost:5173/2025/](http://localhost:5173/2025/) 查看网站

### 生产环境构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🎯 核心功能

### 3D 展厅浏览
- 沉浸式 3D 场景渲染
- 相机控制和场景导航
- 展品交互和信息展示
- 多个展厅切换浏览

### 响应式设计
- 移动端优先设计理念
- 触摸手势支持
- 自适应布局
- 跨设备兼容性

### 性能优化
- 图片懒加载
- 3D 模型按需加载
- 代码分割和压缩
- 资源缓存策略

## 🔧 开发指南

### 推荐 IDE 配置

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 禁用 Vetur 插件以避免冲突

### 代码规范

- 使用 Vue 3 Composition API
- 遵循 Vue 官方风格指南
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 自定义配置

查看 [Vite 配置参考](https://vite.dev/config/) 了解更多配置选项。

## 📄 许可证

本项目仅用于天津大学设计年展展示，版权归天津大学所有。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

---

**天津大学第十一届设计年展** © 2025
