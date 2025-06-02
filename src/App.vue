<script setup>
// 组件导入将在这里添加
</script>

<template>
  <div class="virtual-exhibition">
    
    
    <main class="exhibition-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.virtual-exhibition {
  width: 100%;
  min-height: 100vh;
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 子元素垂直排列 */
  background-color: #f5f5f5;
}

.exhibition-header {
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.home-link {
  text-decoration: none;
  color: inherit;
}

.home-link:hover h1 {
  color: #666;
}

.exhibition-content {
  padding: 2rem;
  flex-grow: 1; /* 让 main 区域占据剩余空间 */
  overflow-y: auto; /* 如果内容超出，允许垂直滚动 */
}
</style>
