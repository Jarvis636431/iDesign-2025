<!-- TeamSection.vue -->
<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="content-section" id="team">
    <h2>{{ isEnglish ? 'Team' : '年展组' }}</h2>
    <div class="section-content">
      <!-- 团队成员展示组件将在这里添加 -->
      <div class="team-grid">
        <!-- 这里可以添加团队成员展示 -->
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
  background: linear-gradient(135deg, #f5f7fa 0%, #dac9e3 100%);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2FA3B0;
}

.section-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
</style>
