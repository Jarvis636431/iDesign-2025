<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});
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
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div class="text-item" :class="{ 'english-text': isEnglish }">
          {{ isEnglish ? "Graduates" : "毕业生" }}
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
</style>
