<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const isEnglish = computed(() => locale.value === "en");
const graduateLabel = computed(() => t("transition.graduates"));
</script>

<template>
  <section
    class="content-section"
    id="transition-between-exhibition-and-graduates"
  >
    <div class="transition-content">
      <!-- 去掉文字内容 -->
    </div>
    <div class="gif-container">
      <img src="/assets/images/gifs/qfsg.gif" alt="zfhm" class="gif-item" />
      <img src="/assets/images/gifs/cltj.gif" alt="lzts" class="gif-item" />
      <img src="/assets/images/gifs/cfyy.gif" alt="cfyy" class="gif-item" />
      <img src="/assets/images/gifs/lzts.gif" alt="cltj" class="gif-item" />
      <img src="/assets/images/gifs/zfhm.gif" alt="qfsg" class="gif-item" />
    </div>
    <div class="repeating-text" :class="{ 'english-position': isEnglish }">
      <div class="text-container" :class="{ 'english-layout': isEnglish }">
        <div
          v-for="n in 8"
          :key="n"
          class="text-item"
          :class="{ 'english-text': isEnglish }"
        >
          {{ graduateLabel }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transition-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffe9d5;
}

.gif-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 80px;
}

.gif-item {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.repeating-text {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  margin-right: -55px; /* 中文默认右边距 */
}

/* 英文状态下的位置调整 */
.repeating-text.english-position {
  margin-right: -147px; /* 英文单词较长，需要更大的负边距来保持相同的视觉位置 */
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 5rem; /* 中文默认间距 */
}

/* 英文状态下的容器间距 */
.text-container.english-layout {
  gap: 18rem; /* 英文需要更大的间距，避免单词重叠 */
}

.text-item {
  color: #fff0ca;
  font-family: "SmileySans", sans-serif;
  font-size: 5rem;
  transform: rotate(-90deg);
  text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
}

/* 英文状态下的专用样式 */
.text-item.english-text {
  font-family: "Futura", "Arial", sans-serif; /* 英文字体 */
  font-size: 4rem; /* 稍小的字体，因为英文单词较长 */
  font-weight: 600; /* 稍微加粗，增强可读性 */
  text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw !important;
    height: calc(100vh - 60px) !important; /* 屏幕高度减去导航栏高度60px */
  }

  .transition-content {
    width: 100vw;
    height: calc(100vh - 60px); /* 屏幕高度减去导航栏高度60px */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffe9d5;
  }

  /* 移动端GIF容器 - 纵向排列 */
  .gif-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column; /* 改为纵向排列 */
    gap: 40px; /* 减小间距适合移动端 */
    align-items: center;
  }

  /* 移动端GIF尺寸调整 */
  .gif-item {
    width: 50px; /* 稍微减小尺寸 */
    height: 50px;
    object-fit: cover;
  }

  /* 移动端文字调整 - 水平排布在底部 */
  .repeating-text {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    right: auto; /* 重置PC端的right属性 */
    top: auto; /* 重置PC端的top属性 */
    margin-right: 0; /* 重置PC端的margin-right */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .repeating-text.english-position {
    margin-right: 0; /* 重置英文状态下的边距 */
  }

  /* 移动端文字容器 - 水平排列 */
  .text-container {
    display: flex;
    flex-direction: row; /* 改为水平排列 */
    gap: 1rem; /* 减小间距 */
    align-items: center;
    justify-content: center;
    overflow-x: auto; /* 如果文字过多，允许水平滚动 */
  }

  .text-container.english-layout {
    gap: 1.5rem; /* 英文稍大间距 */
  }

  /* 移动端文字样式调整 */
  .text-item {
    color: #fff0ca;
    font-family: "SmileySans", sans-serif;
    font-size: 3rem; /* 大幅减小字体 */
    transform: rotate(0deg); /* 移除旋转 */
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
    white-space: nowrap; /* 防止文字换行 */
    flex-shrink: 0; /* 防止文字被压缩 */
  }

  .text-item.english-text {
    font-family: "Futura", "Arial", sans-serif;
    font-size: 1.2rem; /* 英文稍小 */
    font-weight: 600;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
