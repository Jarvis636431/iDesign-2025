<script setup>
import { ref, computed } from 'vue'
import { halls } from '../../constants/halls'

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})

const activeHallIndex = ref(0)
const isTransitioning = ref(false)

const activeHall = computed(() => halls[activeHallIndex.value])

const setActiveHall = async (index) => {
  if (isTransitioning.value || index === activeHallIndex.value) return
  isTransitioning.value = true
  activeHallIndex.value = index
  await new Promise(resolve => setTimeout(resolve, 1000)) // 等待过渡动画完成
  isTransitioning.value = false
}

const getHallPosition = (index) => {
  const position = index - activeHallIndex.value
  return `translateX(${position * 100}%)`
}
</script>

<template>
  <section 
    class="exhibition-section" 
    id="exhibition"
    :style="{ backgroundColor: activeHall.backgroundColor }">
    <!-- 左侧装饰线条和导航 -->
    <div class="left-navigation">
      <div class="decorative-lines">
        <div class="line line-1"></div>
        <div class="line line-2"></div>
        <div class="line line-3"></div>
      </div>
      <div class="hall-nav-list">
        <button v-for="(hall, index) in halls"
                :key="hall.id"
                :class="['hall-nav-item', { active: index === activeHallIndex }]"
                @click="setActiveHall(index)">
          <img :src="hall.icon" :alt="isEnglish ? hall.enName : hall.name">
          <span class="hall-nav-name">{{ isEnglish ? hall.enName : hall.name }}</span>
        </button>
      </div>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="main-content">
      <!-- 顶部横向导航 -->
      <div class="top-navigation">
        <div class="nav-track">
          <div v-for="(hall, index) in halls"
               :key="hall.id"
               :class="['nav-item', { active: index === activeHallIndex }]"
               @click="setActiveHall(index)">
            <div class="nav-dot"></div>
            <span class="nav-label">{{ isEnglish ? hall.enName : hall.name }}</span>
          </div>
        </div>
      </div>

      <!-- 展厅预览区域 -->
      <div class="exhibition-preview">
        <div class="preview-container"
             :style="{ transform: `translateX(-${activeHallIndex * 100}%)` }">
          <div v-for="(hall, index) in halls"
               :key="hall.id"
               class="hall-preview"
               :style="{ transform: getHallPosition(index) }">
            <img :src="hall.logo" :alt="isEnglish ? hall.enName : hall.name"
                 class="hall-image">
            <img :src="hall.border" class="hall-border">
          </div>
        </div>
      </div>

      <!-- 展厅描述区域 -->
      <div class="hall-description" :class="{ transitioning: isTransitioning }">
        <h3 class="hall-title">
          {{ isEnglish ? activeHall.enName : activeHall.name }}
        </h3>
        <div class="hall-subtitle">
          {{ isEnglish ? activeHall.enSubTitle : activeHall.subTitle }}
        </div>
        <p class="hall-text">
          {{ isEnglish ? activeHall.enDesc : activeHall.desc }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.exhibition-section {
  display: flex;
  height: 100vh;
  color: #333;
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s ease;
  background-color: #fff;
}

/* 左侧导航样式 */
.left-navigation {
  width: 180px;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
}

.decorative-lines {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.line {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  height: 1px;
  width: 100%;
  transform-origin: left center;
}

.line-1 { top: 25%; transform: rotate(-15deg); }
.line-2 { top: 50%; transform: rotate(10deg); }
.line-3 { top: 75%; transform: rotate(-20deg); }

.hall-nav-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 100px;
}

.hall-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hall-nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.hall-nav-item img {
  width: 24px;
  height: 24px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.hall-nav-item.active img {
  opacity: 1;
}

/* 主要内容区域样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
}

/* 顶部导航样式 */
.top-navigation {
  height: 60px;
  margin-bottom: 40px;
}

.nav-track {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.nav-item.active {
  opacity: 1;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* 展厅预览区域样式 */
.exhibition-preview {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.preview-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.hall-preview {
  min-width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.hall-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hall-border {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.3;
}

/* 展厅描述区域样式 */
.hall-description {
  position: absolute;
  bottom: 40px;
  right: 40px;
  max-width: 400px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: opacity 0.5s ease;
}

.hall-description.transitioning {
  opacity: 0;
}

.hall-title {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.hall-subtitle {
  font-size: 16px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.hall-text {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}
</style>
