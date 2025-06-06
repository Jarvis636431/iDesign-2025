<template>
  <div class="slide transition-slide">
    <div class="transition-content">
      <h2 :class="{ 'english-text': isEnglish }">
        {{ isEnglish ? "Balmy Breeze, New Growth" : "有风自南，翼彼新苗" }}
      </h2>
      <div class="rotating-image">
        <img src="/assets/images/chime.png" alt="chime" />
      </div>
    </div>
    <div class="repeating-text" :class="{ 'english-position': isEnglish }">
      <div class="text-container" :class="{ 'english-layout': isEnglish }">
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Exhibition Planners" : "年展组" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

let scrollHandler;
let animationFrame;
let rotationAngle = 0;

onMounted(() => {
  const image = document.querySelector(".rotating-image img");

  scrollHandler = () => {
    animationFrame = requestAnimationFrame(() => {
      rotationAngle += 1;
      if (image) {
        image.style.transform = `rotate(${rotationAngle}deg)`;
      }
    });
  };

  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrollHandler);
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
@font-face {
  font-family: "SmileySans";
  src: url("/assets/fonts/SmileySans-Oblique.ttf") format("truetype");
}

.transition-slide {
  min-height: 100vh;
  width: 130vw;
  background: #052a1b;
  position: relative;
  display: flex;
  align-items: center;
}

.transition-content {
  position: relative;
  left: 60%;
  transform: translateX(-60%);
  z-index: 2;
}

h2 {
  position: relative;
  font-family: "SmileySans", sans-serif;
  font-size: 6rem;
  color: #ffe29a;
  margin: 0;
  white-space: nowrap;
  letter-spacing: 3rem;
  z-index: 2;
}

/* 英文状态下的主体文字专用样式 */
h2.english-text {
  font-family: "Futura", "Arial", sans-serif; /* 英文使用Futura字体 */
  font-size: 5rem; /* 英文字体稍小，因为文字较长 */
  letter-spacing: 0.05em; /* 英文字母间距，比中文小很多 */
  white-space: nowrap; /* 确保不换行 */
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
  font-family: "SmileySans", sans-serif;
  font-size: 5rem;
  transform: rotate(-90deg);
}

/* 英文状态下的重复文字专用样式 */
.text-item.english-text {
  font-family: "Futura", "Arial", sans-serif; /* 英文使用Futura字体 */
  font-size: 4rem; /* 英文字体更小，适应长单词 */
  letter-spacing: 0.05em; /* 英文字母间距 */
  transform: rotate(-90deg) translateY(-10px); /* 旋转并微调位置 */
  white-space: nowrap; /* 确保单词不换行 */
}

/* 英文状态下的容器专用布局 */
.text-container.english-layout {
  gap: 35rem; /* 英文单词很长，需要更大间距避免重叠 */
}

/* 英文状态下的整体重复文字容器位置调整 */
.repeating-text.english-position {
  right: -8vw; /* 英文状态下向左移动，给长单词更多空间 */
}
</style>
