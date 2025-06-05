<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="content-section" id="graduates">
    <h2>{{ isEnglish ? 'Graduates' : '毕业生' }}</h2>
    <div class="section-content">
      <!-- 毕业生展示组件将在这里添加 -->
      <div class="graduates-grid">
        <!-- 这里可以添加毕业生网格展示 -->
      </div>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #ffd3b6 100%);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2FA3B0;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.graduates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
</style>
