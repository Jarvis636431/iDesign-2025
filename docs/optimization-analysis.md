# iDesign 2025 项目优化分析报告

## 一、架构层面

### 1. 组件过大，关注点混杂

多个组件文件严重膨胀，单文件承担过多职责（模板、样式、业务逻辑全部耦合）：

| 文件 | 行数 |
|---|---|
| [src/views/Information.vue](../src/views/Information.vue) | ~1395 行 |
| [src/components/sections/ExhibitionSection.vue](../src/components/sections/ExhibitionSection.vue) | ~912 行 |
| [src/components/sections/GraduatesSection.vue](../src/components/sections/GraduatesSection.vue) | ~832 行 |
| [src/views/Home.vue](../src/views/Home.vue) | ~586 行 |
| [src/components/sections/TeamSection.vue](../src/components/sections/TeamSection.vue) | ~518 行 |

**建议：** 将每个组件的逻辑抽到独立 composable（如 `useExhibitionCarousel`、`useGraduatesSwipe`、`useTeamScroll`），样式也可抽到独立的 CSS Module。

---

### 2. 移动端检测逻辑重复

`checkMobile()` 函数在至少 5 个组件中各自实现了一遍，且逻辑不完全一致（有的仅检查宽度，有的还检查 User Agent）：

- `ExhibitionSection.vue:207-219`
- `GraduatesSection.vue:85-97`
- `Hall.vue:71-78`
- `Information.vue:50-53`
- `Home.vue:32-34`

**建议：** 抽取一个 `useMobileDetection` composable，统一逻辑并全局共享。

---

### 3. 缺少状态管理层

README 声称使用了 Pinia，但 `package.json` 中并无 Pinia 依赖。当前展厅数据 (halls)、当前展厅信息 (currentHallInfo) 在 `useHallData` 和 `ExhibitionSection` 中各加载一次，存在重复请求。

**建议：** 引入 Pinia 做全局状态管理，统一管理 halls、locale、mobile 等共享状态，避免重复数据请求和 prop drilling。

---

### 4. 遗留注释代码

- `Information.vue:139-148` — 大段被注释的旧轮播方法
- `Information.vue:763-782` — 被注释的旧样式代码

**建议：** 使用版本管理回溯历史，删除这些已无用的注释代码。

---

## 二、性能层面

### 5. 全局滚轮事件性能问题

`App.vue:23-66` 在每次 `wheel` 事件中执行多次 `event.target.closest()` 调用（选择器字符串每次都要解析）。

**建议：**
- 用单一 `data-wheel-ignore` 属性标记需要排除的区域，一次 `closest('[data-wheel-ignore]')` 代替多次
- 或将选择器提前编译为数组，减少运行时字符串解析

---

### 6. 碎片化的 `setTimeout` 等待 DOM 就绪

多处使用硬编码的延迟等待 DOM 就绪：

- `App.vue:66` — 1000ms 延迟查找 `.scroll-container`
- `GraduatesSection.vue:195-199` — 200ms 延迟初始化卡片位置
- `Information.vue:91-96` — 50ms 延迟确保滚动到顶部

**建议：** 改用 `MutationObserver` 或 `nextTick` + `requestAnimationFrame` 组合，以事件驱动代替时间猜测。

---

### 7. Three.js 全量引入

- `SceneManager.js:1` — `import * as THREE from "three"`
- `useHallScene.js:2` — `import * as THREE from "three"`

**建议：** 按需引入具体使用的类（如 `import { Scene, Raycaster, Vector2 } from "three"`），配合 tree-shaking 减小打包体积。

---

### 8. 字体文件未优化

`public/assets/fonts/` 下有 5 个字体文件，均使用 `.ttf` 和 `.otf` 格式，体积较大。仅 `ExhibitionSection.vue:524-530` 中的 `MFXiHei` 设置了 `font-display: swap`。

**建议：**
- 全部转换为 `.woff2` 格式（体积通常可减少 60-70%）
- 统一添加 `font-display: swap` 避免 FOIT（Flash of Invisible Text）
- 考虑对不常用字体做子集化（subsetting），仅保留实际使用的字符

---

### 9. Vite 构建配置过于简单

`vite.config.js` 无任何构建优化配置。

**建议：**
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        three: ['three'],
        vue: ['vue', 'vue-router', 'vue-i18n'],
      },
    },
  },
  target: 'es2020',
}
```
- 拆分 vendor chunks，提高缓存命中率
- 可引入 `vite-plugin-compression` 做 gzip/brotli 预压缩

---

### 10. 图片资源未优化

大量 `.png` 背景图、头像等未转换为现代格式。

**建议：**
- 将 `.png` / `.jpg` 转为 `.webp`（体积通常减少 50-80%）
- 对大型背景图使用响应式图片（`srcset` + 多尺寸）
- 对非首屏图片使用 `loading="lazy"` 原生懒加载

---

### 11. Canvas 动画帧未在不可见时彻底停止

`useHallScene.js:413-445` 的 `animate` 函数在页面不可见时会 `return`，但 `animationId` 设为 `null` 后仍会继续下一帧的 `requestAnimationFrame` 调用。

**建议：** 在 `handleVisibilityChange` 中明确停止和恢复渲染循环，当前实现逻辑正确但可在 `animate` 开头直接 return 而不重新请求帧。

---

## 三、代码质量

### 12. `useEventListener` 不必要的响应式开销

`useEventListener.js:10` 使用 `watchEffect` 自动追踪 target 变化，但所有调用方传入的都是静态 DOM 元素（`window`、`document`），`watchEffect` 的响应式追踪是不必要的。

**建议：** 为静态 target 提供一个轻量版本，直接调用 `addEventListener` 并在 `onBeforeUnmount` 中清理。

---

### 13. SceneManager 重复创建 DRACOLoader/KTX2Loader

`SceneManager.js:166-195` 每次 `loadModel` 都新建 loader 实例并在 finally 中 dispose。这些 loader 的解码器初始化开销较大。

**建议：** 在 SceneManager 构造函数中创建一次 loader 实例，整个生命周期复用，仅在 `dispose()` 时销毁。

---

### 14. 不稳定的 `v-for` key

`GraduatesSection.vue:294` 使用 `graduate.id + Math.random()` 作为 `v-for` 的 key，这会导致每次渲染都强制重建 DOM 节点。

**建议：** 对于重复渲染的列表（用于无限滚动效果），使用 `graduate.id + '-' + index` 或直接用 `graduate.id`。

---

## 四、工程层面

### 15. `.DS_Store` 文件混入仓库

多个目录存在 `.DS_Store` 文件：
- `public/`
- `public/assets/images/`
- `public/assets/images/halls/`
- `public/assets/models/`
- `src/`

**建议：** 将 `.DS_Store` 加入 `.gitignore`，并执行 `find . -name '.DS_Store' -delete` 清理。

---

### 16. 硬编码的 API 地址

- `src/api/exhibit.js:4` — `https://idesign.tju.edu.cn/portal/api_v1`
- `src/utils/exhibitUtils.js:14` — `http://idesign.tju.edu.cn/upload/`

**建议：** 使用环境变量 `VITE_API_BASE_URL` 统一管理，支持不同环境切换。

---

### 17. ShareCardGenerator 单例的预加载时机

`ShareCardGenerator.js:373` 在模块加载时立即创建单例并触发 `preloadCommonImages()`。这些图片可能永远不会被用到（用户可能不点击分享），造成带宽浪费。

**建议：** 延迟预加载到用户首次点击分享按钮时触发。

---

## 五、优先级汇总

| 优先级 | 优化项 | 影响范围 |
|--------|--------|----------|
| **高** | 统一移动端检测为 composable | 减少 5 处重复，统一行为 |
| **高** | 清理 `.DS_Store` 和注释代码 | 仓库整洁 |
| **高** | 字体转 woff2 + `font-display: swap` | 首屏加载速度 |
| **高** | 图片转 WebP | 资源体积显著减少 |
| **中** | Vite build 配置优化 (chunk split) | JS 包体积，缓存命中率 |
| **中** | 组件拆分 / 逻辑抽离 | 可维护性 |
| **中** | 引入 Pinia 统一状态管理 | 避免重复请求 |
| **中** | Three.js 按需引入 | 打包体积 |
| **低** | DRACOLoader / KTX2Loader 复用 | 模型加载性能 |
| **低** | `setTimeout` 换 MutationObserver | 健壮性 |
| **低** | 修复不稳定的 `v-for` key | 渲染性能 |
