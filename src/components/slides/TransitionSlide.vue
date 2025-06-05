<template>
  <div class="slide transition-slide">
    <div class="transition-content">
      <h2>有风自南，翼彼新苗</h2>
      <div class="rotating-image">
        <img src="/assets/images/chime.png" alt="chime" />
      </div>
    </div>
    <div class="repeating-text">
      <div class="text-container">
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
        <div class="text-item"> 年展组 </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let scrollHandler;
let animationFrame;
let rotationAngle = 0;

onMounted(() => {
  const image = document.querySelector('.rotating-image img');
  
  scrollHandler = () => {
    animationFrame = requestAnimationFrame(() => {
      rotationAngle += 1;
      if (image) {
        image.style.transform = `rotate(${rotationAngle}deg)`;
      }
    });
  };

  window.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler);
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
@font-face {
  font-family: 'SmileySans';
  src: url('/assets/fonts/SmileySans-Oblique.ttf') format('truetype');
}

.transition-slide {
  min-height: 100vh;
  width: 130vw;
  background: #052A1B;
  position: relative;
  display: flex;
  align-items: center;
}

.transition-content {
  position: relative;
  left: 45%;
  transform: translateX(-50%);
  z-index: 2;
}

h2 {
  position: relative;
  font-family: 'SmileySans', sans-serif;
  font-size: 6rem;
  color: #FFE29A;
  margin: 0;
  white-space: nowrap;
  letter-spacing: 3rem;
  z-index: 2;
}

.rotating-image {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.rotating-image img {
  width: 300px;
  height: 300px;
  transition: transform 0.1s linear;
}

.repeating-text {
  position: absolute;
  right: 5vw;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.text-item {
  color: #ffffff;
  font-family: 'SmileySans', sans-serif;
  font-size: 5rem;
  transform: rotate(-90deg);
}
</style> 