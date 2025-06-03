<template>
  <div class="welcome-container">
    <div class="scroll-container" ref="scrollContainer">
      <div class="scroll-content">
        <WelcomeSlide />
        <TransitionSlide />
        <ExhibitionSlide
          v-for="exhibition in exhibitions"
          :key="exhibition.id"
          v-bind="exhibition"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WelcomeSlide from '../components/slides/WelcomeSlide.vue'
import TransitionSlide from '../components/slides/TransitionSlide.vue'
import ExhibitionSlide from '../components/slides/ExhibitionSlide.vue'

const scrollContainer = ref(null)
let isScrolling = false
let startX = 0
let scrollLeft = 0

const exhibitions = [
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
]

const handleMouseDown = (e) => {
  isScrolling = true
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

const handleMouseUp = () => {
  isScrolling = false
}

const handleMouseMove = (e) => {
  if (!isScrolling) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 2
  scrollContainer.value.scrollLeft = scrollLeft - walk
}

const handleWheel = (e) => {
  e.preventDefault()
  scrollContainer.value.scrollLeft += e.deltaX
}

onMounted(() => {
  const container = scrollContainer.value
  container.addEventListener('mousedown', handleMouseDown)
  container.addEventListener('mouseup', handleMouseUp)
  container.addEventListener('mouseleave', handleMouseUp)
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('wheel', handleWheel, { passive: false })
})
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #000;
}

.scroll-container {
  height: 100vh;
  width: 100vw;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-content {
  display: flex;
  height: 100vh;
  width: fit-content;
}

:deep(.slide) {
  height: 100vh;
  width: 100vw;
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style> 