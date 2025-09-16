/**
 * 展品数据处理工具函数
 */

/**
 * 处理URL，确保返回完整的URL
 * @param {string} path - 相对路径或完整URL
 * @returns {string} 完整的URL
 */
export function fullUrl(path) {
  if (!path) return ''
  return path.startsWith('http')
    ? path
    : `http://idesign.tju.edu.cn/upload/${path.replace(/^\//, '')}`
}

/**
 * 处理展品信息，提取并格式化展品详情
 * @param {Object} item - 原始展品数据
 * @returns {Object|null} 格式化后的展品信息
 */
export function processExhibitInfo(item) {
  if (!item) return null

  // 优先展示视频，没有视频再展示图片，兼容对象数组
  let imageUrl = ''
  let videoUrl = ''
  
  if (item.more) {
    if (item.more.files && item.more.files.length > 0) {
      const file = item.more.files[0]
      videoUrl = fullUrl(file.url)
    } else if (item.more.photos && item.more.photos.length > 0) {
      const photo = item.more.photos[0]
      imageUrl = fullUrl(photo.url)
    } else if (item.more.thumbnail) {
      imageUrl = fullUrl(item.more.thumbnail)
    }
  }

  // 处理所有作者
  let authors = []
  if (Array.isArray(item.more?.authors)) {
    authors = item.more.authors.map((author) => ({
      zh_names: author.zh_names,
      grade: author.grade || '未知年级',
      avatar: author.url ? fullUrl(author.url) : null
    }))
  }

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

/**
 * 生成展品幻灯片数据
 * @param {Object} item - 展品数据
 * @param {Object} exhibitModels - 展品模型映射
 * @param {string|number} currentId - 当前展品ID
 * @returns {Array} 幻灯片数组
 */
export function generateExhibitSlides(item, exhibitModels, currentId) {
  const slides = []

  // 1. 模型
  const file = exhibitModels[currentId]
  if (file) {
    slides.push({ type: 'model', src: 'assets/models/' + file })
  }

  // 2. 所有视频
  if (
    item &&
    item.more &&
    Array.isArray(item.more.files) &&
    item.more.files.length > 0
  ) {
    item.more.files.forEach((f) => {
      if (f.url) slides.push({ type: 'video', src: fullUrl(f.url) })
    })
  }

  // 3. 所有图片
  if (item && item.more) {
    if (Array.isArray(item.more.photos) && item.more.photos.length > 0) {
      item.more.photos.forEach((photo) => {
        if (photo.url) slides.push({ type: 'image', src: fullUrl(photo.url) })
      })
    } else if (item.more.thumbnail) {
      slides.push({ type: 'image', src: fullUrl(item.more.thumbnail) })
    }
  }

  return slides
}

/**
 * 生成模型文件路径
 * @param {Object} exhibitModels - 展品模型映射
 * @param {string|number} currentId - 当前展品ID
 * @returns {string} 模型文件路径
 */
export function generateModelFile(exhibitModels, currentId) {
  if (!currentId) return ''
  const file = exhibitModels[currentId]
  // 适配 Vite base 配置，确保开发和生产都能加载模型
  return file ? import.meta.env.BASE_URL + 'assets/models/' + file : ''
}