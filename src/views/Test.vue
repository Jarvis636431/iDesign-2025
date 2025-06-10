<template>
  <div class="test-page">
    <!-- 测试页面头部 -->
    <header class="test-header">
      <h1>功能测试页面</h1>
      <p>用于测试TeamSection移动端动画效果</p>
      <div class="test-controls">
        <button @click="toggleMobile" :class="{ active: forceMobile }">
          {{ forceMobile ? '切换到PC模式' : '切换到移动模式' }}
        </button>
        <button @click="scrollToTeam">滚动到TeamSection</button>
      </div>
    </header>

    <!-- 占位内容，用于创建滚动空间 -->
    <section class="placeholder-section">
      <h2>占位区域 1</h2>
      <p>这里是一些占位内容，用于创建足够的滚动空间来测试动画效果。</p>
      <div class="placeholder-content">
        <div class="placeholder-card" v-for="i in 6" :key="i">
          <h3>占位卡片 {{ i }}</h3>
          <p>这是第{{ i }}个占位卡片，用于填充页面高度。</p>
        </div>
      </div>
    </section>

    <!-- TeamSection组件 -->
    <TeamSection />

    <!-- 更多占位内容 -->
    <section class="placeholder-section">
      <h2>占位区域 2</h2>
      <p>TeamSection下方的占位内容，继续测试滚动效果。</p>
      <div class="placeholder-content">
        <div class="placeholder-card" v-for="i in 4" :key="i + 6">
          <h3>占位卡片 {{ i + 6 }}</h3>
          <p>这是第{{ i + 6 }}个占位卡片。</p>
        </div>
      </div>
    </section>

    <!-- 测试信息面板 -->
    <div class="test-info" :class="{ mobile: forceMobile }">
      <h3>测试信息</h3>
      <div class="info-item">
        <span>当前模式:</span>
        <span>{{ forceMobile ? '移动端' : 'PC端' }}</span>
      </div>
      <div class="info-item">
        <span>屏幕宽度:</span>
        <span>{{ screenWidth }}px</span>
      </div>
      <div class="info-item">
        <span>滚动位置:</span>
        <span>{{ scrollY }}px</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TeamSection from '@/components/sections/TeamSection.vue'

// 响应式数据
const forceMobile = ref(false)
const screenWidth = ref(window.innerWidth)
const scrollY = ref(window.scrollY)

// 切换移动/PC模式
const toggleMobile = () => {
  forceMobile.value = !forceMobile.value
  // 强制改变窗口宽度来触发移动端检测
  if (forceMobile.value) {
    document.body.style.width = '375px'
    document.body.style.margin = '0 auto'
    document.body.style.border = '2px solid #ccc'
  } else {
    document.body.style.width = ''
    document.body.style.margin = ''
    document.body.style.border = ''
  }
  // 触发resize事件
  window.dispatchEvent(new Event('resize'))
}

// 滚动到TeamSection
const scrollToTeam = () => {
  const teamSection = document.querySelector('#team')
  if (teamSection) {
    teamSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 更新屏幕信息
const updateScreenInfo = () => {
  screenWidth.value = window.innerWidth
  scrollY.value = window.scrollY
}

// 事件监听
onMounted(() => {
  window.addEventListener('resize', updateScreenInfo)
  window.addEventListener('scroll', updateScreenInfo)
  updateScreenInfo()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenInfo)
  window.removeEventListener('scroll', updateScreenInfo)
  // 恢复body样式
  document.body.style.width = ''
  document.body.style.margin = ''
  document.body.style.border = ''
})
</script>

<style scoped>
.test-page {
  min-height: 200vh;
  background: linear-gradient(180deg, #f0f8ff 0%, #e6f3ff 50%, #f0f8ff 100%);
}

.test-header {
  background: #052a1b;
  color: white;
  padding: 2rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.test-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.test-header p {
  margin: 0 0 1.5rem 0;
  opacity: 0.8;
}

.test-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.test-controls button {
  padding: 0.8rem 1.5rem;
  border: 2px solid #fff0ca;
  background: transparent;
  color: #fff0ca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.test-controls button:hover,
.test-controls button.active {
  background: #fff0ca;
  color: #052a1b;
}

.placeholder-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.placeholder-section h2 {
  color: #052a1b;
  margin-bottom: 1rem;
  text-align: center;
}

.placeholder-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.placeholder-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.placeholder-card:hover {
  transform: translateY(-5px);
}

.placeholder-card h3 {
  color: #052a1b;
  margin: 0 0 1rem 0;
}

.placeholder-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.test-info {
  position: fixed;
  top: 120px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  min-width: 200px;
  z-index: 999;
}

.test-info.mobile {
  position: relative;
  top: auto;
  right: auto;
  margin: 2rem;
}

.test-info h3 {
  margin: 0 0 1rem 0;
  color: #052a1b;
  font-size: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-item span:first-child {
  color: #666;
}

.info-item span:last-child {
  color: #052a1b;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .test-header {
    padding: 1.5rem 1rem;
  }
  
  .test-header h1 {
    font-size: 1.5rem;
  }
  
  .test-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .test-controls button {
    width: 200px;
  }
  
  .placeholder-section {
    padding: 2rem 1rem;
  }
  
  .placeholder-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .test-info {
    position: relative;
    top: auto;
    right: auto;
    margin: 1rem;
  }
}
</style>
