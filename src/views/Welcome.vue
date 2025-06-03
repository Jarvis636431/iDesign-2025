<template>
  <div class="welcome-container">
    <n-carousel
      :show-arrow="false"
      :show-dots="false"
      :autoplay="false"
      :touchable="true"
      :draggable="true"
      @update:current-index="handleSlideChange"
    >
      <div class="slide">
        <h1>欢迎来到数字展厅</h1>
        <p>向左滑动开始探索</p>
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
    router.push('/transition')
  }
}
</script>

<style scoped>
.welcome-container {
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  opacity: 0.8;
}
</style> 