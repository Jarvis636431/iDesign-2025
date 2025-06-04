<script setup>
// 组件导入将在这里添加
</script>

<template>
    <main class="exhibition-content">
      <router-view></router-view>
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
</style>
