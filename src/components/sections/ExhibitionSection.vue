<script setup>
import { ref, computed } from "vue";
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
const touchStartY = ref(0);
const isSwiping = ref(false);
const router = useRouter();

// 动态光标样式
const customCursor = computed(() => {
  const backgroundColor = activeHall.value.color.replace("#", "%23"); // URL编码展厅颜色作为底色
  const triangleColor = "%23FFE29A"; // 三角形保持黄色
  return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="${backgroundColor}"/><polygon points="25,22 25,38 37,30" fill="none" stroke="${triangleColor}" stroke-width="2"/></svg>') 30 30, pointer`;
});

// 处理文本换行
const formatText = (text) => {
  return text
    .split("。")
    .filter(Boolean)
    .map((sentence) => sentence + "。");
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
const handleTouchStart = (event) => {
  touchStartY.value = event.touches[0].clientY;
  isSwiping.value = true;
};

const handleTouchMove = (event) => {
  if (!isSwiping.value) return;
  event.preventDefault(); // 防止页面滚动
};

const handleTouchEnd = (event) => {
  if (!isSwiping.value) return;

  const touchEndY = event.changedTouches[0].clientY;
  const deltaY = touchEndY - touchStartY.value;

  // 只有滑动距离超过50像素才触发切换
  if (Math.abs(deltaY) > 50) {
    if (deltaY > 0) {
      // 向下滑动时，设置反向动画
      document.querySelector(".logo-container").classList.add("reverse");
      prevHall();
    } else {
      // 向上滑动时，移除反向动画
      document.querySelector(".logo-container").classList.remove("reverse");
      nextHall();
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
    });
};
</script>

<template>
  <section
    class="exhibition-section"
    id="exhibition"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @wheel.passive="handleWheel"
    :style="{ backgroundColor: activeHall.backgroundColor }"
  >
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
</style>
