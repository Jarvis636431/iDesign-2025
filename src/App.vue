<script setup>
// 组件导入将在这里添加
</script>

<template>
    <main class="exhibition-content">
      <router-link to="/halls" style="position: absolute; top: 20px; left: 40px; z-index: 10; font-size: 18px; color: #2FA3B0;">展厅入口</router-link>
      <router-link to="/demo" style="position: absolute; top: 20px; right: 40px; z-index: 10; font-size: 18px; color: #2FA3B0;">Demo页面</router-link>
      <router-view></router-view>
    </main>
</template>

<style scoped>

.exhibition-content {
  flex-grow: 1; /* 让 main 区域占据剩余空间 */
  overflow-y: auto; /* 如果内容超出，允许垂直滚动 */
}
</style>
