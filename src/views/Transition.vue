<template>
  <div class="transition-container">
    <n-carousel
      :show-arrow="false"
      :show-dots="false"
      :autoplay="false"
      :touchable="true"
      :draggable="true"
      @update:current-index="handleSlideChange"
    >
      <div class="slide">
        <h2>探索即将开始</h2>
        <p>向左滑动进入展厅选择</p>
      </div>
    </n-carousel>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { NCarousel } from 'naive-ui'

const router = useRouter()

const handleSlideChange = (index) => {
  if (index === 1) {
    router.push('/exhibition-switch')
  }
}
</script>

<style scoped>
.transition-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.slide {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  color: white;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  opacity: 0.8;
}
</style> 