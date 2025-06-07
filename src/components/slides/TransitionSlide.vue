<template>
  <div class="slide transition-slide">
    <div class="transition-content">
      <h2
        :class="{ 'english-text': isEnglish }"
        :style="textTransformStyle"
        class="skew-text"
      >
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
import { onMounted, onUnmounted, ref, computed } from "vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

// 水平滚动相关状态
const isScrolling = ref(false);
const scrollVelocity = ref(0);
const lastScrollX = ref(0);
const scrollTimeout = ref(null);

// 计算文字倾斜角度
const textSkewAngle = computed(() => {
  if (!isScrolling.value) return 0;
  // 根据水平滚动速度计算倾斜角度，最大倾斜15度
  const maxSkew = 15;
  const clampedVelocity = Math.max(-30, Math.min(30, scrollVelocity.value));
  // 水平滚动：向左滚动(负值)文字向右倾斜，向右滚动(正值)文字向左倾斜
  const angle = (clampedVelocity / -30) * maxSkew;

  return angle;
});

// 计算文字transform样式
const textTransformStyle = computed(() => {
  return {
    transform: `skewX(${textSkewAngle.value}deg)`,
    transition: isScrolling.value
      ? "transform 0.1s ease-out"
      : "transform 0.5s ease-out",
  };
});

let scrollHandler;
let handleWheel;
let animationFrame;
let rotationAngle = 0;

onMounted(() => {
  const image = document.querySelector(".rotating-image img");

  // 查找正确的滚动容器
  const scrollContainer = document.querySelector(".scroll-container");

  if (!scrollContainer) {
    return;
  }

  scrollHandler = () => {
    // 获取滚动容器的水平滚动位置
    const currentScrollX = scrollContainer.scrollLeft;

    // 计算水平滚动速度
    const velocity = currentScrollX - lastScrollX.value;
    scrollVelocity.value = velocity;
    lastScrollX.value = currentScrollX;

    // 设置滚动状态
    isScrolling.value = true;

    // 清除之前的超时
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value);
    }

    // 设置超时，滚动停止后恢复正常
    scrollTimeout.value = setTimeout(() => {
      isScrolling.value = false;
      scrollVelocity.value = 0;
    }, 150); // 150ms后认为滚动停止

    // 图片旋转动画
    animationFrame = requestAnimationFrame(() => {
      rotationAngle += 1;
      if (image) {
        image.style.transform = `rotate(${rotationAngle}deg)`;
      }
    });
  };

  // 监听滚动容器的滚动事件
  scrollContainer.addEventListener("scroll", scrollHandler);

  // 初始化滚动位置
  lastScrollX.value = scrollContainer.scrollLeft;

  // 添加滚轮事件监听，将垂直滚动转换为水平滚动
  handleWheel = (e) => {
    // 防止默认滚动
    e.preventDefault();

    // 获取滚动增量
    const delta = e.deltaY;

    // 转换为水平滚动
    scrollContainer.scrollLeft += delta;
  };

  // 在滚动容器上添加滚轮监听
  scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
});

onUnmounted(() => {
  const scrollContainer = document.querySelector(".scroll-container");
  if (scrollContainer) {
    scrollContainer.removeEventListener("scroll", scrollHandler);
    scrollContainer.removeEventListener("wheel", handleWheel);
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
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

/* 倾斜文字样式 */
.skew-text {
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
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
