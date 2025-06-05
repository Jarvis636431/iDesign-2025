<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <section class="content-section" id="preface">
    <h2>{{ isEnglish ? 'Preface' : '卷首语' }}</h2>
    <div class="section-content">
      <p>这里是卷首语内容...</p>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%);
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
