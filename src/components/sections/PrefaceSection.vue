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
    <div class="section-content">
      <div class="mouse-container">
        <img src="/assets/images/mouse.png" alt="Mouse" class="mouse-image" />
      </div>
      <div class="text-container">
        <p class="top-text">这里是左上角的文字</p>
        <p class="bottom-text">这里是右下角的文字</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  min-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 2rem;
  position: relative;
  background: #052A1B;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
}

.mouse-container {
  width: 1000px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 0;
}

.mouse-image {
  width: 100px;
  height: auto;
}

.text-container {
  width: 1000px;
  height: 100vh;
  background-image: url('/assets/images/backimg.png');
  background-size: cover;
  position: relative;
}

.top-text {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
}

.bottom-text {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: white;
}
</style>
