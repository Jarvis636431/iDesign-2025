<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInformationStore } from '../stores/information'
import ModelViewer from '../components/three/ModelViewer.vue'

const route = useRoute()
const router = useRouter()
const store = useInformationStore()

const currentId = computed(() => parseInt(route.params.id) || 1)
const totalExhibits = computed(() => store.getTotalExhibits)
const exhibitInfo = computed(() => store.getExhibitById(currentId.value) || {
  title: '加载中...',
  description: '',
  imageUrl: '',
  details: { author: '', year: '', medium: '' }
})

const goToExhibit = (direction) => {
  let newId
  if (direction === 'next') {
    newId = currentId.value < totalExhibits.value ? currentId.value + 1 : 1
  } else {
    newId = currentId.value > 1 ? currentId.value - 1 : totalExhibits.value
  }
  router.push(`/information/${newId}`)
}
</script>

<template>
  <div class="information-page">
    <div class="background-blur"></div>

    <div class="navigation-container">
      <button class="nav-button prev" @click="goToExhibit('prev')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div class="exhibit-container">
        <img class="border-image" src="/src/assets/images/borders/border-blue.png" alt="边框" />
        <div class="exhibit-content">
          <div class="exhibit-image">
            <!-- 图片展示 -->
            <img v-if="exhibitInfo.imageUrl && !exhibitInfo.modelUrl" 
                 :src="exhibitInfo.imageUrl" 
                 :alt="exhibitInfo.title">
            <!-- 3D模型展示 -->
            <ModelViewer v-if="exhibitInfo.modelUrl" 
                        :modelUrl="exhibitInfo.modelUrl" />
          </div>
          <div class="exhibit-details">
            <h1>
              <img class="hall-icon" src="/src/assets/images/icons/icon-blue.png" alt="icon" />
              <span class="hall-text-group">
                <span class="hall-text">启风山谷</span>
                <span class="hall-subtext">FIRST WHISPER</span>
              </span>
            </h1>
            <div class="desc-section">
              <div class="desc-header">
                <span class="desc-title">{{ exhibitInfo.title }}</span>
                <button class="share-btn">
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

.exhibit-image {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: #eee;
  width: 100%;
  aspect-ratio: 1 / 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 新增：最大宽高限制，可根据需要调整 */
  max-width: 480px;
  max-height: 480px;
  margin: 0 auto;
}

.exhibit-image img,
.exhibit-image video,
.exhibit-image model-viewer {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background: #eee;
}

.exhibit-details {
  display: flex;
  flex-direction: column;
  justify-content: top;
  /* 向上整体移动内容（可选，按需调整） */
  padding-top: 0;
}

.exhibit-details h1 {
  color: #2FA3B0;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -1rem; /* 向左移动标题 */
}

.hall-icon {
  width: 4rem;
  height: 4rem;
  object-fit: contain;
  display: inline-block;
  flex-shrink: 0;
}

.hall-text-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 右对齐 */
  flex: 1;
  min-width: 0;
    margin-top: 0.2rem; /* 保持与图标的间距 */
 
}

.hall-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  font-size: 24px;
  font-weight: bold;
  color: #2FA3B0;
}

.hall-subtext {
  font-size: 16px;
  color: #2FA3B0;
  font-weight: normal;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: -0.5rem; /* 向上移动子标题 */
}

.description {
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
    margin-left: 1rem;
}

.details-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
  color: #555;
}

.desc-section {
  margin-top: 1.2rem;
  margin-left: -0.6rem; /* 向左移动描述部分 */
  display: flex;
  flex-direction: column;
}

.desc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.desc-title {
  font-size: 48px;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-btn {
  background: #2FA3B0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 50%;
  /* 可选：设置最小宽高，保证圆形更大 */
  min-width: 3rem;
  min-height: 3rem;
  justify-content: center;
}

.share-btn img {
  width: 1.4rem;   /* 图标也适当变大 */
  height: 1.4rem;
  object-fit: contain;
}

.desc-content {
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.desc-footer {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #888;
  margin-top: 0.5rem;
}

.footer-divider {
  color: #ccc;
  font-size: 1.1em;
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
  }
  .exhibit-image {
    min-height: 200px;
  }
}
</style>