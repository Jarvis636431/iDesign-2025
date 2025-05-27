<script setup>
import { onMounted } from 'vue'
import { useExhibitionStore } from '../stores/exhibition'

const store = useExhibitionStore()

onMounted(() => {
  // 这里可以添加初始化逻辑
})
</script>

<template>
  <div class="home">
    <h1>虚拟展厅首页</h1>
    <div class="exhibition-list">
      <!-- 展厅列表将在这里显示 -->
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
}

.exhibition-list {
  margin-top: 2rem;
}
</style> 