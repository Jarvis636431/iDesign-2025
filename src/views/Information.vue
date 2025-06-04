<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModelViewer from '../components/three/ModelViewer.vue'
import { halls as hallConfigs } from '@/constants/halls'
import axios from 'axios'
import { exhibitModels } from '@/constants/exhibitModels'

const route = useRoute()
const router = useRouter()

const hallId = computed(() => parseInt(route.query.hallId))
const currentId = computed(() => parseInt(route.params.id))
const hallInfo = computed(() => hallConfigs.find(h => h.id === hallId.value))
const hallColor = computed(() => hallInfo.value?.color || '#2FA3B0')

const exhibits = ref([])
const loading = ref(false)
const error = ref('')

// 获取展厅所有展品
async function fetchExhibits() {
  if (!hallId.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
      params: { per_page: 9999, current_page: 1, category_id: hallId.value }
    })
    console.log('接口返回数据:', res.data)
    exhibits.value = res.data?.data || []
    console.log('exhibits.value:', exhibits.value)
  } catch (e) {
    error.value = '展品数据加载失败'
    exhibits.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchExhibits)
watch(hallId, fetchExhibits)

const exhibitInfo = computed(() => {
  if (!currentId.value || !Array.isArray(exhibits.value)) return null
  // id 强制转为数字，避免类型不一致导致找不到
  const item = exhibits.value.find(e => Number(e.id) === Number(currentId.value))
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
  console.log('exhibitInfo computed:', { imageUrl, videoUrl })
  return {
    title: item.post_title,
    description: item.intro_zh,
    imageUrl,
    videoUrl,
    details: {
      author: item.more?.authors?.[0]?.zh_names || '',
      teacher: item.tutors_zh || '',
      year: '',
      medium: ''
    }
  }
})

const modelFile = computed(() => {
  if (!currentId.value) return ''
  const file = exhibitModels[currentId.value]
  return file ? `/models/${file}` : ''
})

function fullUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `http://idesign.tju.edu.cn/upload/${path.replace(/^\//, '')}`
}

const goToExhibit = (direction) => {
  if (!exhibits.value.length) return
  const idx = exhibits.value.findIndex(e => e.id === currentId.value)
  let newIdx
  if (direction === 'next') {
    newIdx = idx < exhibits.value.length - 1 ? idx + 1 : 0
  } else {
    newIdx = idx > 0 ? idx - 1 : exhibits.value.length - 1
  }
  const nextId = exhibits.value[newIdx]?.id
  router.push(`/information/${nextId}?hallId=${hallId.value}`)
}
</script>

<template>
  <div class="information-page">
    <div class="background-blur"></div>
    <div v-if="loading">展品加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!exhibitInfo">
      <div style="text-align:center;padding:4rem;font-size:1.5rem;color:#888;">无效的展品ID</div>
    </div>
    <div v-else class="navigation-container">
      <button class="nav-button prev" @click="goToExhibit('prev')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <div class="exhibit-container">
        <img v-if="hallInfo && hallInfo.border" class="border-image" :src="hallInfo.border" alt="边框" />
        <div class="exhibit-content">
          <div class="exhibit-image-wrapper">
            <div class="exhibit-image-inner">
              <ModelViewer
                v-if="modelFile"
                :modelUrl="modelFile"
                style="width:100%;height:100%;border-radius:24px;overflow:hidden;"
              />
              <img
                v-else-if="exhibitInfo.imageUrl && !exhibitInfo.videoUrl"
                :src="exhibitInfo.imageUrl"
                :alt="exhibitInfo.title"
                class="exhibit-main-image"
                @error="alert('图片加载失败！\n'+exhibitInfo.imageUrl)"
                @click="e => e.target.requestFullscreen && e.target.requestFullscreen()"
                style="cursor:pointer;"
              />
              <video
                v-else-if="exhibitInfo.videoUrl"
                :src="exhibitInfo.videoUrl"
                controls
                class="exhibit-main-video"
                @error="alert('视频加载失败！\n'+exhibitInfo.videoUrl)"
                @click="e => { if(e.target.requestFullscreen) e.target.requestFullscreen(); }"
                style="cursor:pointer;"
              >
                您的浏览器不支持 video 标签，或视频加载失败。
              </video>
              <div v-else class="exhibit-image-empty">无可用图片或视频资源</div>
            </div>
          </div>
          <div class="exhibit-details">
            <div class="hall-info">
              <img v-if="hallInfo && hallInfo.icon" class="hall-icon" :src="hallInfo.icon" alt="icon" />
              <span class="hall-text-group">
                <span class="hall-text" :style="{ color: hallColor }">{{ hallInfo?.name || '' }}</span>
                <span class="hall-subtext" :style="{ color: hallColor }">{{ hallInfo?.enName || '' }}</span>
              </span>
            </div>
            <div class="desc-section">
              <div class="desc-header">
                <span class="desc-title">{{ exhibitInfo.title }}</span>
                <button class="share-btn" :style="{ backgroundColor: hallColor }">
                  <img src="/src/assets/images/icons/share.png" alt="分享" />
                </button>
              </div>
              <div class="desc-content">
                {{ exhibitInfo.description }}
              </div>
              <div class="desc-footer">
                <span>作者：{{ exhibitInfo.details.author }}</span>
                <span class="footer-divider">|</span>
                <span>指导教师：{{ exhibitInfo.details.teacher || '无' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="nav-button next" @click="goToExhibit('next')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.information-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 3vw;
}

.background-blur {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('/src/assets/images/background.jpg') no-repeat center center;
  background-size: cover;
  filter: blur(16px);
  pointer-events: none;
}

.navigation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2vw;
  position: relative;
  z-index: 1;
}

.exhibit-container {
  position: relative;
  background: white;
  border-radius: 50px;
  max-width: 1100px;
  width: 70vw;
  min-width: 800px;
  min-height: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px; /* 你可以根据需要调整大小 */
}

.border-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% - 40px); /* 比container小一圈，和padding对应 */
  height: calc(100% - 40px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

.exhibit-content {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1.3fr 1fr; /* 左侧更大 */
  gap: 2.5rem;
  width: 100%;
  padding: 3.5rem 3rem;
  box-sizing: border-box;
  align-items: start; /* 由center改为start，防止右侧内容撑高左侧 */
  height: 100%;
  min-height: 0;
}

.nav-button {
  background: none;
  border: none;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.arrow-icon {
  width: 32px;
  height: 32px;
  fill: #4a90e2;
}

.exhibit-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 32px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  width: 480px;
  height: 480px;
  min-width: 320px;
  min-height: 320px;
  max-width: 520px;
  max-height: 520px;
  margin: 0 auto;
  position: relative;
  flex-shrink: 0;
  align-self: flex-start; /* 保证左侧区域高度只受自身内容影响 */
}

.exhibit-image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
}

.exhibit-main-image,
.exhibit-main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
  border-radius: 24px;
  background: #f8f8f8;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.exhibit-main-image:hover,
.exhibit-main-video:hover {
  box-shadow: 0 4px 24px 0 rgba(47,163,176,0.18);
}

.exhibit-image-empty {
  width: 100%;
  height: 100%;
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 24px;
}

.desc-section {
  margin-top: 1.5rem;
}

.desc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.desc-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
}

.share-btn:focus {
  outline: none;
}

.share-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.desc-content {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
}

.desc-footer {
  margin-top: 1rem;
  font-size: 1rem;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.footer-divider {
  height: 12px;
  width: 1px;
  background: #ddd;
}

.hall-info {
  display: flex;
  align-items: center;
  gap: rem;
  justify-content: space-between;
}

.hall-icon {
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
  vertical-align: middle;
  margin-right: 0.6em;
}

.hall-text-group {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end; /* 右对齐 */
  vertical-align: middle;
}

.hall-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
}
.hall-subtext {
  font-size: 1.1rem;
  color: #666;
}

.exhibit-details {
  max-height: 480px;
  overflow-y: auto;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

@media (max-width: 1200px) {
  .exhibit-container {
    min-width: 0;
    width: 95vw;
    max-width: 98vw;
  }
  .exhibit-content {
    padding: 2rem 1rem;
    gap: 1.2rem;
  }
}
@media (max-width: 900px) {
  .exhibit-content {
    grid-template-columns: 1fr;
    padding: 1.2rem 0.5rem;
    gap: 1.2rem;
  }
  .exhibit-image-wrapper {
    width: 90vw;
    height: 90vw;
    min-width: 0;
    min-height: 0;
    max-width: 100vw;
    max-height: 100vw;
    align-self: flex-start;
  }
  .exhibit-details {
    max-height: none;
    overflow-y: visible;
  }
  .hall-icon {
    width: 28px;
    height: 28px;
    max-width: 28px;
    max-height: 28px;
  }
}
</style>