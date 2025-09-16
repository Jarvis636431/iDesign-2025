import { ref, computed } from 'vue'
import { fetchExhibitsByCategoryId } from '@/api/exhibit'
import { handleError } from '@/utils/errorHandler'

/**
 * 展品相关的组合式函数
 * 封装展品数据获取、处理和状态管理逻辑
 */
export function useExhibit() {
  // 响应式状态
  const exhibits = ref([])
  const loading = ref(false)
  const error = ref('')

  /**
   * 获取指定展厅的所有展品
   * @param {string|number} categoryId - 展厅ID
   */
  async function fetchExhibits(categoryId) {
    if (!categoryId) return
    
    loading.value = true
    error.value = ''
    
    try {
      const response = await fetchExhibitsByCategoryId(categoryId)
      exhibits.value = response.data?.data || []
    } catch (e) {
      const handledError = handleError(e, 'fetchExhibits')
      error.value = handledError.message
      exhibits.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID查找展品
   * @param {string|number} exhibitId - 展品ID
   */
  function findExhibitById(exhibitId) {
    if (!exhibitId || !Array.isArray(exhibits.value)) return null
    return exhibits.value.find(e => Number(e.id) === Number(exhibitId))
  }

  /**
   * 获取展品在列表中的索引
   * @param {string|number} exhibitId - 展品ID
   */
  function getExhibitIndex(exhibitId) {
    if (!exhibitId || !Array.isArray(exhibits.value)) return -1
    return exhibits.value.findIndex(e => Number(e.id) === Number(exhibitId))
  }

  /**
   * 获取下一个展品ID
   * @param {string|number} currentId - 当前展品ID
   */
  function getNextExhibitId(currentId) {
    const currentIndex = getExhibitIndex(currentId)
    if (currentIndex === -1 || !exhibits.value.length) return null
    
    const nextIndex = currentIndex < exhibits.value.length - 1 ? currentIndex + 1 : 0
    return exhibits.value[nextIndex]?.id
  }

  /**
   * 获取上一个展品ID
   * @param {string|number} currentId - 当前展品ID
   */
  function getPrevExhibitId(currentId) {
    const currentIndex = getExhibitIndex(currentId)
    if (currentIndex === -1 || !exhibits.value.length) return null
    
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : exhibits.value.length - 1
    return exhibits.value[prevIndex]?.id
  }

  // 计算属性
  const exhibitCount = computed(() => exhibits.value.length)
  const hasExhibits = computed(() => exhibitCount.value > 0)

  return {
    // 状态
    exhibits,
    loading,
    error,
    
    // 计算属性
    exhibitCount,
    hasExhibits,
    
    // 方法
    fetchExhibits,
    findExhibitById,
    getExhibitIndex,
    getNextExhibitId,
    getPrevExhibitId
  }
}