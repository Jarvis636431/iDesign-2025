<script setup>
// 组件导入将在这里添加
</script>

<template>
    <main class="exhibition-content">
      <nav class="top-navigation">
        <router-link to="/2025/halls">展厅入口</router-link>
        <router-link to="/2025/demo">Demo页面</router-link>
      </nav>
      <div class="router-view-container">
        <router-view></router-view>
      </div>
    </main>
</template>

<style scoped>
/* 确保整个应用占满视口 */
:root {
  height: 100%;
}

.exhibition-content {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.top-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.router-view-container {
  flex: 1;
  width: 100%;
  padding-top: 60px; /* 为顶部导航留出空间 */
  overflow-y: auto;
}

/* 导航链接样式 */
.exhibition-content a {
  text-decoration: none;
  transition: color 0.3s ease;
}

.exhibition-content a:hover {
  color: #1a7c85;
}
</style>
