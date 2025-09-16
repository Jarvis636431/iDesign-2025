# Information.vue 数据获取与处理逻辑重构文档

## 1. 重构背景和目的

### 重构前存在的问题
- **代码重复**：Information.vue 中直接使用 axios 调用 API，与 `api/exhibit.js` 中的封装重复
- **逻辑耦合**：数据获取、处理和 UI 逻辑混合在一个组件中，违反单一职责原则
- **维护困难**：API 调用分散在各个组件中，难以统一管理和维护
- **测试困难**：业务逻辑与 UI 逻辑耦合，难以进行单元测试
- **错误处理不统一**：各组件的错误处理方式不一致

### 重构目的
- 提高代码复用性，避免重复实现
- 实现业务逻辑与 UI 逻辑的分离
- 统一 API 调用和错误处理方式
- 提升代码的可测试性和可维护性
- 为后续功能扩展奠定良好基础

## 2. 修改前后对比

### 修改前的架构
```
Information.vue
├── 直接使用 axios 调用 API
├── 内部处理数据转换逻辑
├── 分散的错误处理
└── UI 渲染逻辑
```

### 修改后的架构
```
Information.vue
├── 使用 useExhibit composable
├── 使用 exhibitUtils 工具函数
└── 专注于 UI 渲染逻辑

api/exhibit.js (复用现有)
├── fetchExhibitsByCategoryId
└── fetchExhibitDetail

composables/useExhibit.js (新增)
├── 展品数据管理
├── 加载状态管理
└── 统一错误处理

utils/exhibitUtils.js (新增)
├── 数据转换函数
├── URL 处理函数
└── 幻灯片生成函数
```

## 3. 新创建的文件和功能

### 3.1 `src/composables/useExhibit.js`

**功能描述**：封装展品相关的业务逻辑和状态管理

**主要功能**：
- 展品数据的响应式管理
- 统一的加载状态和错误处理
- 复用 `api/exhibit.js` 中的 API 函数
- 提供清晰的接口供组件使用

**核心代码示例**：
```javascript
import { ref } from 'vue'
import { fetchExhibitsByCategoryId } from '@/api/exhibit'

export function useExhibit() {
  const exhibits = ref([])
  const loading = ref(false)
  const error = ref('')

  const fetchExhibits = async (hallId) => {
    if (!hallId) return
    
    loading.value = true
    error.value = ''
    
    try {
      const res = await fetchExhibitsByCategoryId(hallId)
      exhibits.value = res.data?.data || []
    } catch (e) {
      error.value = '展品数据加载失败'
      exhibits.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    exhibits,
    loading,
    error,
    fetchExhibits
  }
}
```

### 3.2 `src/utils/exhibitUtils.js`

**功能描述**：提供展品数据处理相关的纯函数

**主要功能**：
- URL 路径处理和转换
- 展品信息数据结构转换
- 幻灯片数据生成
- 作者信息处理

**核心代码示例**：
```javascript
/**
 * 处理完整URL路径
 * @param {string} path - 相对路径
 * @returns {string} 完整URL
 */
export function fullUrl(path) {
  if (!path) return ''
  return path.startsWith('http')
    ? path
    : `http://idesign.tju.edu.cn/upload/${path.replace(/^\//, '')}`
}

/**
 * 转换展品信息为标准格式
 * @param {Object} item - 原始展品数据
 * @returns {Object} 标准化的展品信息
 */
export function transformExhibitInfo(item) {
  if (!item) return null
  
  // 处理媒体文件
  let imageUrl = ''
  let videoUrl = ''
  
  if (item.more) {
    if (item.more.files && item.more.files.length > 0) {
      videoUrl = fullUrl(item.more.files[0].url)
    } else if (item.more.photos && item.more.photos.length > 0) {
      imageUrl = fullUrl(item.more.photos[0].url)
    } else if (item.more.thumbnail) {
      imageUrl = fullUrl(item.more.thumbnail)
    }
  }
  
  // 处理作者信息
  const authors = Array.isArray(item.more?.authors)
    ? item.more.authors.map(author => ({
        zh_names: author.zh_names,
        grade: author.grade || '未知年级',
        avatar: author.url ? fullUrl(author.url) : null
      }))
    : []
  
  return {
    title: item.post_title,
    description: item.intro_zh,
    imageUrl,
    videoUrl,
    details: {
      authors,
      teacher: item.tutors_zh || '',
      year: '',
      medium: ''
    }
  }
}
```

## 4. 重构带来的优势

### 4.1 代码复用性提升
- **统一 API 调用**：所有展品相关的 API 调用都通过 `api/exhibit.js` 进行
- **可复用的 Composable**：`useExhibit` 可以在其他需要展品数据的组件中复用
- **通用工具函数**：`exhibitUtils` 中的函数可以在项目的任何地方使用

### 4.2 代码质量改善
- **职责分离**：UI 逻辑、业务逻辑、数据处理逻辑各司其职
- **更好的类型安全**：工具函数提供明确的输入输出类型
- **统一的错误处理**：所有 API 调用使用相同的错误处理模式

### 4.3 维护性提升
- **集中管理**：展品相关逻辑集中在特定文件中，便于维护
- **易于扩展**：新增展品相关功能时，可以直接扩展 composable 和工具函数
- **便于调试**：业务逻辑独立，更容易定位和修复问题

### 4.4 测试友好
- **单元测试**：纯函数和 composable 都可以独立进行单元测试
- **模拟测试**：可以轻松模拟 API 调用和数据处理逻辑
- **集成测试**：组件测试时可以专注于 UI 交互逻辑

## 5. 使用示例

### 5.1 在 Information.vue 中的使用

```vue
<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useExhibit } from '@/composables/useExhibit'
import { transformExhibitInfo, generateExhibitSlides } from '@/utils/exhibitUtils'

const route = useRoute()
const { exhibits, loading, error, fetchExhibits } = useExhibit()

const hallId = computed(() => route.query.hallId)
const currentId = computed(() => route.query.id)

// 使用工具函数转换展品信息
const exhibitInfo = computed(() => {
  const item = exhibits.value.find(e => Number(e.id) === Number(currentId.value))
  return transformExhibitInfo(item)
})

// 使用工具函数生成幻灯片数据
const exhibitSlides = computed(() => {
  const item = exhibits.value.find(e => Number(e.id) === Number(currentId.value))
  return generateExhibitSlides(item, currentId.value)
})

onMounted(() => {
  fetchExhibits(hallId.value)
})

watch(hallId, (newHallId) => {
  fetchExhibits(newHallId)
})
</script>
```

### 5.2 在其他组件中复用

```vue
<script setup>
// 在任何需要展品数据的组件中都可以这样使用
import { useExhibit } from '@/composables/useExhibit'
import { transformExhibitInfo } from '@/utils/exhibitUtils'

const { exhibits, loading, error, fetchExhibits } = useExhibit()

// 获取特定展厅的展品
fetchExhibits('hall-001')
</script>
```

## 6. 迁移指南

### 6.1 对于开发者
- 新的展品相关功能应优先使用 `useExhibit` composable
- 数据处理逻辑应添加到 `exhibitUtils.js` 中
- API 调用应通过 `api/exhibit.js` 进行

### 6.2 对于维护者
- 展品相关的 bug 修复应首先检查 composable 和工具函数
- 新增 API 接口应添加到 `api/exhibit.js` 中
- 数据格式变更应更新 `exhibitUtils.js` 中的转换函数

## 7. 总结

这次重构成功地将 Information.vue 中的数据获取与处理逻辑进行了模块化改造，实现了：

- ✅ **代码复用**：消除了重复的 API 调用代码
- ✅ **职责分离**：业务逻辑与 UI 逻辑清晰分离
- ✅ **统一管理**：API 调用和错误处理标准化
- ✅ **提升质量**：代码更易测试和维护
- ✅ **保持功能**：所有原有功能完全保留

这为项目的后续发展奠定了良好的架构基础，使得代码更加健壮、可维护和可扩展。