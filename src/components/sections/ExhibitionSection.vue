<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { halls } from "../../constants/halls";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const activeHallIndex = ref(0);
const activeHall = computed(() => halls[activeHallIndex.value]);

// 计算轮播的transform值
const carouselTransform = computed(() => {
  const translateValue = (activeHallIndex.value * 100) / 5;
  return `translateX(-${translateValue}%)`;
});
const isSwiping = ref(false);
const router = useRouter();
const isLoading = ref(false); // 加载状态
const isMobile = ref(false); // 移动端检测

// 动态光标样式
const customCursor = computed(() => {
  const backgroundColor = activeHall.value.color.replace("#", "%23"); // URL编码展厅颜色作为底色
  const triangleColor = "%23FFE29A"; // 三角形保持黄色
  return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="${backgroundColor}"/><polygon points="25,22 25,38 37,30" fill="none" stroke="${triangleColor}" stroke-width="2"/></svg>') 30 30, pointer`;
});

// 处理文本换行
const formatText = (text) => {
  // 中英文都使用 | 作为分隔符
  return text
    .split("|")
    .filter(Boolean)
    .map((line) => line.trim());
};

// 切换到下一个展厅
const nextHall = () => {
  activeHallIndex.value = (activeHallIndex.value + 1) % halls.length;
};

// 切换到上一个展厅
const prevHall = () => {
  activeHallIndex.value =
    (activeHallIndex.value - 1 + halls.length) % halls.length;
};

// 触摸事件处理
const touchStartX = ref(0);
const touchStartY = ref(0);

const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
  touchStartY.value = event.touches[0].clientY;
  isSwiping.value = true;
};

const handleTouchMove = (event) => {
  if (!isSwiping.value) return;
  event.preventDefault(); // 防止页面滚动
};

const handleTouchEnd = (event) => {
  if (!isSwiping.value) return;

  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX.value;
  const deltaY = touchEndY - touchStartY.value;

  // 移动端使用横向滑动，PC端使用纵向滑动
  if (isMobile.value) {
    // 移动端：横向滑动切换
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // 向右滑动，上一个展厅
        prevHall();
      } else {
        // 向左滑动，下一个展厅
        nextHall();
      }
    }
  } else {
    // PC端：纵向滑动切换
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // 向下滑动时，设置反向动画
        document.querySelector(".logo-container")?.classList.add("reverse");
        prevHall();
      } else {
        // 向上滑动时，移除反向动画
        document.querySelector(".logo-container")?.classList.remove("reverse");
        nextHall();
      }
    }
  }

  isSwiping.value = false;
};

// 触摸板事件处理
const handleWheel = (event) => {
  // 确保是触摸板事件
  if (Math.abs(event.deltaY) < 50) return;

  if (event.deltaY > 0) {
    document.querySelector(".logo-container").classList.remove("reverse");
    nextHall();
  } else {
    document.querySelector(".logo-container").classList.add("reverse");
    prevHall();
  }

  event.preventDefault();
};

// 进入展厅
const enterExhibition = (hall) => {
  // 显示加载状态
  isLoading.value = true;

  // 2秒后执行跳转
  setTimeout(() => {
    axios
      .get("http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists", {
        params: { per_page: 1, current_page: 1, category_id: hall.id },
      })
      .then((res) => {
        let firstExhibitId = null;
        if (res.data && res.data.data && res.data.data.length > 0) {
          firstExhibitId = res.data.data[0].id;
        }
        // 跳转到information页面，带上展厅id和展品id
        router.push(
          `/2025/information/${firstExhibitId || ""}?hallId=${hall.id}`
        );
      })
      .catch(() => {
        // 请求失败也跳转，只带hallId
        router.push(`/2025/information/?hallId=${hall.id}`);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }, 2000);
};

// 移动端检测
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 生命周期钩子
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// 轮播专用的触摸事件处理
const carouselTouchStartX = ref(0);
const carouselTouchStartY = ref(0);
const carouselIsSwiping = ref(false);

const handleCarouselTouchStart = (event) => {
  carouselTouchStartX.value = event.touches[0].clientX;
  carouselTouchStartY.value = event.touches[0].clientY;
  carouselIsSwiping.value = true;
  event.stopPropagation(); // 阻止事件冒泡到父级
};

const handleCarouselTouchMove = (event) => {
  if (!carouselIsSwiping.value) return;

  // 计算滑动方向
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const deltaX = Math.abs(currentX - carouselTouchStartX.value);
  const deltaY = Math.abs(currentY - carouselTouchStartY.value);

  // 只有当横向滑动距离大于纵向滑动距离时，才阻止默认行为
  if (deltaX > deltaY && deltaX > 10) {
    event.preventDefault(); // 防止页面滚动
    event.stopPropagation(); // 阻止事件冒泡
  }
};

const handleCarouselTouchEnd = (event) => {
  if (!carouselIsSwiping.value) return;

  const touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchEndX - carouselTouchStartX.value;

  // 滑动距离超过50像素才触发切换
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // 向右滑动，上一个展厅
      prevHall();
    } else {
      // 向左滑动，下一个展厅
      nextHall();
    }
  }

  carouselIsSwiping.value = false;
  event.stopPropagation(); // 阻止事件冒泡
};
</script>

<template>
  <!-- PC端section -->
  <section
    v-if="!isMobile"
    class="exhibition-section"
    id="exhibition"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @wheel.passive="handleWheel"
    :style="{ backgroundColor: activeHall.backgroundColor }"
  >
    <!-- 左上角标题 -->
    <!-- 左上角标题 -->
    <div class="hall-title-area">
      <h2 class="hall-title" :style="{ color: activeHall.color }">
        {{ isEnglish ? activeHall.enName : activeHall.name }}
      </h2>
    </div>

    <!-- 展厅Logo -->
    <div class="hall-logo-area">
      <transition-group name="slide-fade" tag="div" class="logo-container">
        <img
          :key="activeHall.logo"
          :src="activeHall.logo"
          :alt="isEnglish ? activeHall.enName : activeHall.name"
          class="hall-logo"
          :style="{ cursor: customCursor }"
          @click="enterExhibition(activeHall)"
        />
      </transition-group>
    </div>

    <!-- 左下角展厅Icon -->
    <div class="hall-icon-area">
      <img
        :key="activeHall.icon"
        :src="activeHall.icon"
        :alt="isEnglish ? activeHall.enName : activeHall.name"
        class="hall-icon"
      />
    </div>

    <!-- 右下角描述 -->
    <div class="hall-description" :style="{ color: activeHall.color }">
      <div class="hall-subtitle" :style="{ color: activeHall.color }">
        {{ isEnglish ? activeHall.enSubTitle : activeHall.subTitle }}
      </div>
      <div class="hall-text" :style="{ color: activeHall.color }">
        <p
          v-for="(sentence, index) in formatText(
            isEnglish ? activeHall.enDesc : activeHall.desc
          )"
          :key="index"
          class="text-line"
        >
          {{ sentence }}
        </p>
      </div>
    </div>
  </section>

  <!-- 移动端section -->
  <section
    v-else
    class="exhibition-section mobile-layout"
    id="exhibition"
    :style="{ backgroundColor: activeHall.backgroundColor }"
  >
    <div class="mobile-content">
      <!-- 标题 -->
      <div class="mobile-title-area">
        <h2 class="mobile-hall-title" :style="{ color: activeHall.color }">
          {{ isEnglish ? activeHall.enName : activeHall.name }}
        </h2>
      </div>

      <!-- 副标题 -->
      <div class="mobile-subtitle-area">
        <div class="mobile-hall-subtitle" :style="{ color: activeHall.color }">
          {{ isEnglish ? activeHall.enSubTitle : activeHall.subTitle }}
        </div>
      </div>

      <!-- 描述 -->
      <div class="mobile-description-area">
        <div class="mobile-hall-text" :style="{ color: activeHall.color }">
          <p
            v-for="(sentence, index) in formatText(
              isEnglish ? activeHall.enDesc : activeHall.desc
            )"
            :key="index"
            class="mobile-text-line"
          >
            {{ sentence }}
          </p>
        </div>
      </div>

      <!-- Logo轮播区域 -->
      <div
        class="mobile-logo-carousel"
        @touchstart="handleCarouselTouchStart"
        @touchmove="handleCarouselTouchMove"
        @touchend="handleCarouselTouchEnd"
      >
        <div class="carousel-container">
          <div class="carousel-track" :style="{ transform: carouselTransform }">
            <div
              v-for="(hall, index) in halls"
              :key="hall.id"
              class="carousel-slide"
              :class="{ active: index === activeHallIndex }"
            >
              <img
                :src="hall.logo"
                :alt="isEnglish ? hall.enName : hall.name"
                class="carousel-logo"
                @click="enterExhibition(hall)"
              />
            </div>
          </div>
        </div>

        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <div
            v-for="(hall, index) in halls"
            :key="hall.id"
            class="indicator"
            :class="{ active: index === activeHallIndex }"
            :style="{
              backgroundColor:
                index === activeHallIndex
                  ? activeHall.color
                  : 'rgba(255,255,255,0.5)',
            }"
            @click="activeHallIndex = index"
          ></div>
        </div>
      </div>
    </div>
  </section>

  <!-- 加载状态遮罩 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <!-- 展厅Icon -->
      <div class="loading-icon">
        <img
          :src="activeHall.icon"
          :alt="isEnglish ? activeHall.enName : activeHall.name"
          class="loading-hall-icon"
        />
        <!-- Loading文字 -->
        <div class="loading-text">Loading...</div>
      </div>
      <!-- 展厅描述 -->
      <div class="loading-description" :style="{ color: activeHall.color }">
        <div class="loading-desc-text">
          <p
            v-for="(sentence, index) in formatText(
              isEnglish ? activeHall.enDesc : activeHall.desc
            )"
            :key="index"
            class="loading-desc-line"
          >
            {{ sentence }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exhibition-section {
  position: relative;
  height: 100vh;
  width: calc(100%-90px);
  overflow: hidden;
  background-color: transparent;
  touch-action: none; /* 防止触摸设备上的默认滚动行为 */
}

.hall-title-area {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 2;
}

.hall-title {
  font-size: 96px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0;
  font-family: "MFXiHei", sans-serif; /* 添加自定义字体 */
}

@font-face {
  font-family: "MFXiHei";
  src: url("/assets/fonts/MFXiHei_Noncommercial-Regular.otf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.hall-logo-area {
  position: absolute;
  right: 50px; /* 留出一些间距 */
  top: 45%;
  transform: translateY(-50%);
  width: 65%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* 移除了cursor设置，现在使用动态光标 */
}

.logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hall-logo {
  position: absolute;
  max-height: 70vh;
  max-width: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* 向上滑动的动画 */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* 反向滑动的动画 */
.slide-fade-reverse-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-reverse-leave-active {
  transition: all 0.5s ease-in;
}

.slide-fade-reverse-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-fade-reverse-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* 左下角展厅Icon */
.hall-icon-area {
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 2;
}

.hall-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.hall-icon:hover {
  transform: scale(1.1);
}

.hall-description {
  position: absolute;
  bottom: 30px;
  right: 50px;
  max-width: 1000px;
  padding: 20px;
  text-align: right; /* 添加右对齐 */
}

.hall-subtitle {
  font-size: 22px;
  font-weight: bold;
  text-align: right; /* 添加右对齐 */
}

.hall-text {
  font-size: 22px;
  text-align: right;
}

.text-line {
  line-height: 1.4; /* 添加行高控制 */
}

/* 加载状态遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.loading-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

.loading-hall-icon {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.2));
}

.loading-text {
  font-size: 1.2rem;
  color: #666;
  font-weight: normal;
  letter-spacing: 0.1em;
}

.loading-description {
  max-width: 600px;
  margin-top: 6rem; /* 增加上边距，让描述更靠下 */
}

.loading-desc-text {
  max-width: 800px;
  text-align: center;
}

.loading-desc-line {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 0.8rem;
  opacity: 0.9;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .exhibition-section.mobile-layout {
    width: 100vw !important;
    height: auto !important; /* 改为自适应高度，允许滚动 */
    min-height: calc(100vh - 60px); /* 最小高度 */
    overflow-x: hidden;
    overflow-y: visible; /* 允许竖直滚动 */
    padding: 0;
  }

  .mobile-content {
    width: 100%;
    min-height: 100%; /* 改为最小高度 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
    text-align: center;
    gap: 2rem;
  }

  /* 移动端标题 */
  .mobile-title-area {
    width: 100%;
  }

  .mobile-hall-title {
    font-size: 3rem; /* 减小字体 */
    font-weight: bold;
    line-height: 1.2;
    margin: 0;
    font-family: "MFXiHei", sans-serif;
    text-align: center;
  }

  /* 移动端副标题 */
  .mobile-subtitle-area {
    width: 100%;
  }

  .mobile-hall-subtitle {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
    line-height: 1.4;
  }

  /* 移动端描述 */
  .mobile-description-area {
    width: 100%;
    max-width: 600px;
  }

  .mobile-hall-text {
    text-align: center;
  }

  .mobile-text-line {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 0.8rem;
    margin-top: 0;
  }

  /* 移动端Logo轮播 */
  .mobile-logo-carousel {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    touch-action: pan-x; /* 只允许横向平移，保持竖直滚动 */
  }

  .carousel-container {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 12px;
    position: relative;
  }

  .carousel-track {
    display: flex;
    width: 500%; /* 5个展厅，每个100% */
    height: 100%;
    transition: transform 0.4s ease-in-out;
    position: relative;
    left: 0;
  }

  .carousel-slide {
    width: calc(100% / 5); /* 每个slide占容器的1/5 */
    height: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
    position: relative;
  }

  .carousel-logo {
    max-height: 100%;
    max-width: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
  }

  .carousel-logo:hover {
    transform: scale(1.05);
  }

  /* 轮播指示器 */
  .carousel-indicators {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  .indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .indicator:hover {
    transform: scale(1.2);
  }

  .indicator.active {
    transform: scale(1.3);
    border: 2px solid rgba(255, 255, 255, 0.8);
  }

  /* 移动端加载状态适配 */
  .loading-overlay {
    padding: 1rem;
  }

  .loading-content {
    gap: 1.5rem;
  }

  .loading-hall-icon {
    width: 80px;
    height: 80px;
  }

  .loading-text {
    font-size: 1rem;
  }

  .loading-description {
    margin-top: 2rem;
  }

  .loading-desc-line {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
}
</style>
