<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="content-section" id="video">
    <h2>{{ isEnglish ? 'Video' : '宣传片' }}</h2>
    <div class="section-content">
      <!-- 视频播放器组件将在这里添加 -->
    </div>
  </section>
</template>

<style scoped>
.content-section {
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #d4e6f1 100%);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2FA3B0;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
</style>
