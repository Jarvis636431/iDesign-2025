<script setup>
// 组件导入将在这里添加
</script>

<template>
    <main class="exhibition-content">
      <router-view></router-view>
    </main>
</template>

<style scoped>

.exhibition-content {
  flex-grow: 1; /* 让 main 区域占据剩余空间 */
  overflow-y: auto; /* 如果内容超出，允许垂直滚动 */
}
</style>
