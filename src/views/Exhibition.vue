<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useExhibitionStore } from '../stores/exhibition'

const route = useRoute()
const store = useExhibitionStore()

onMounted(() => {
  // 初始化 Three.js 场景
})

onUnmounted(() => {
  // 清理 Three.js 资源
})
</script>

<template>
  <div class="exhibition-view">
    <div id="three-container" class="three-container"></div>
    <div class="exhibition-controls">
      <!-- 控制面板将在这里添加 -->
    </div>
  </div>
</template>

<style scoped>
.exhibition-view {
  width: 100%;
  height: 100vh;
  position: relative;
}

.three-container {
  width: 100%;
  height: 100%;
}

.exhibition-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 4px;
}
</style> 