<template>
  <div class="exhibition-switch-container">
    <n-carousel
      :show-arrow="false"
      :show-dots="true"
      :autoplay="false"
      :touchable="true"
      :draggable="true"
      @update:current-index="handleSlideChange"
    >
      <div v-for="exhibition in exhibitions" :key="exhibition.id" class="slide">
        <div class="exhibition-card">
          <h3>{{ exhibition.title }}</h3>
          <p>{{ exhibition.description }}</p>
          <n-button type="primary" @click="enterExhibition(exhibition.id)">
            进入展厅
          </n-button>
        </div>
      </div>
    </n-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NButton } from 'naive-ui'

const router = useRouter()

const exhibitions = ref([
  {
    id: 1,
    title: '数字艺术展厅',
    description: '探索数字艺术的无限可能'
  },
  {
    id: 2,
    title: '互动体验展厅',
    description: '沉浸式互动体验空间'
  },
  {
    id: 3,
    title: '未来科技展厅',
    description: '展示前沿科技与创新'
  }
])

const handleSlideChange = (index) => {
  // 可以在这里添加额外的滑动逻辑
}

const enterExhibition = (id) => {
  router.push(`/exhibition/${id}`)
}
</script>

<style scoped>
.exhibition-switch-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.slide {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
}

.exhibition-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  color: white;
  max-width: 80%;
}

h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}
</style> 