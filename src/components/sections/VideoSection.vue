<!-- TODO：文字堆砌 -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const videoRef = ref(null);
const isVideoLoaded = ref(false);
const videoError = ref(false);

const { t, tm } = useI18n();

// 计算属性：视频描述文字
const videoDescriptionLines = computed(() => {
  const lines = tm("video.description");
  return Array.isArray(lines) ? lines : [];
});

// 修复视频初始尺寸问题
onMounted(() => {
  if (videoRef.value) {
    const video = videoRef.value;

    // 监听视频元数据加载完成
    video.addEventListener("loadedmetadata", () => {
      isVideoLoaded.value = true;
      // 确保视频尺寸正确显示
      video.style.width = "100%";
      video.style.height = "auto";
    });

    // 监听视频加载错误
    video.addEventListener("error", () => {
      videoError.value = true;
    });

    // 监听视频可以播放
    video.addEventListener("canplay", () => {
      isVideoLoaded.value = true;
    });

    // 如果视频已经加载了元数据，立即应用样式
    if (video.readyState >= 1) {
      isVideoLoaded.value = true;
      video.style.width = "100%";
      video.style.height = "auto";
    }
  }
});
</script>

<template>
  <section class="content-section" id="video">
    <div class="section-content">
      <div class="video-container">
        <!-- 加载状态 -->
        <div v-if="!isVideoLoaded && !videoError" class="video-loading">
          <div class="loading-spinner"></div>
          <p>{{ t("video.loading") }}</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="videoError" class="video-error">
          <p>{{ t("video.error") }}</p>
        </div>

        <!-- 视频播放器 -->
        <video
          ref="videoRef"
          controls
          class="video-player"
          :class="{ 'video-loaded': isVideoLoaded }"
          preload="metadata"
          @loadstart="isVideoLoaded = false"
        >
          <source src="/assets/videos/preface.mp4" type="video/mp4" />
          {{ t("video.fallback") }}
        </video>
      </div>

      <p class="video-description">
        <template v-for="(line, index) in videoDescriptionLines" :key="index">
          <span>{{ line }}</span>
          <br v-if="index !== videoDescriptionLines.length - 1" />
        </template>
      </p>
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
  position: relative;
  background: #052a1b;
  background-image: url("/assets/images/video-backimg.png");
  background-size: cover;
  background-position: center 20%;
}

.video-player {
  width: 100%;
  max-width: 1000px; /* 从800px增加到1000px */
  min-height: 560px; /* 从450px增加到560px，保持16:9比例 */
  border-radius: 12px;
  border: 12px solid white;
  position: relative;
  top: -20px;
  background-color: #000; /* 添加黑色背景，视频加载时显示 */
  object-fit: contain; /* 确保视频比例正确 */
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="%23052a1b"/><polygon points="25,22 25,38 37,30" fill="none" stroke="%23FFE29A" stroke-width="2"/></svg>')
      30 30,
    pointer;
}

/* 视频容器 */
.video-container {
  position: relative;
  width: 100%;
  max-width: 1000px; /* 与视频播放器保持一致 */
}

/* 自定义视频光标已在 .video-player 中设置 */

/* 加载状态 */
.video-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.video-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #ff6b6b;
  z-index: 10;
}

/* 视频加载完成状态 */
.video-loaded {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 视频描述 */
.video-description {
  margin-top: 0.3rem; /* 从1rem减少到0.3rem，进一步缩小间隔 */
  text-align: left;
  color: #ffffff;
  line-height: 1.6;
  font-weight: 600; /* semibold字重 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw !important;
    min-height: 100vh;
    padding: 2rem 1rem;
    /* 移动端背景图旋转90度并缩小 */
    background-image: url("/assets/images/mobile-video-bg.png");
    background-position: center center;
    background-repeat: no-repeat;
    transform-origin: center center; /* 以中心为旋转点 */
  }

  .section-content {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 改为左对齐 */
    gap: 1.5rem;
    transform-origin: center center;
    padding: 0 5vw; /* 添加左右内边距 */
  }

  /* 移动端视频容器 */
  .video-container {
    width: 100%;
    max-width: 90vw;
    margin: 0;
  }

  /* 移动端视频播放器 */
  .video-player {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    height: auto;
    aspect-ratio: 16/9; /* 保持16:9比例 */
    border-radius: 8px; /* 减小圆角 */
    border: 6px solid white; /* 减小边框 */
    top: 0; /* 重置位置偏移 */
    font-size: 14px; /* 调整控制栏字体大小 */
  }

  /* 移动端视频描述 */
  .video-description {
    width: 100%;
    max-width: 90vw;
    margin-top: 1rem;
    text-align: left; /* 左对齐 */
    font-size: 0.9rem; /* 稍微减小字体 */
    line-height: 1.5;
    padding: 0; /* 移除内边距，与视频对齐 */
    color: #ffffff;
  }

  /* 移动端加载状态 */
  .video-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 10;
  }

  .loading-spinner {
    width: 30px; /* 减小加载动画尺寸 */
    height: 30px;
    border-width: 3px;
  }

  /* 移动端错误状态 */
  .video-error {
    font-size: 0.9rem;
    padding: 1rem;
  }

  /* 移动端视频光标调整 */
  .video-player {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23052a1b"/><polygon points="16,14 16,26 26,20" fill="none" stroke="%23FFE29A" stroke-width="2"/></svg>')
        20 20,
      pointer;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw !important;
    min-height: 100vh;
    padding: 2rem 1rem;
    background-position: center center; /* 调整背景图位置 */
    background-size: cover;
  }

  .section-content {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  /* 移动端视频容器 */
  .video-container {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }

  /* 移动端视频播放器 */
  .video-player {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    height: auto;
    aspect-ratio: 16/9; /* 保持16:9比例 */
    border-radius: 8px; /* 减小圆角 */
    border: 6px solid white; /* 减小边框 */
    top: 0; /* 重置位置偏移 */
    font-size: 14px; /* 调整控制栏字体大小 */
  }

  /* 移动端视频描述 */
  .video-description {
    width: 100%;
    max-width: 100%;
    margin-top: 1rem;
    text-align: center; /* 移动端居中对齐 */
    font-size: 0.9rem; /* 稍微减小字体 */
    line-height: 1.5;
    padding: 0 0.5rem;
    color: #ffffff;
  }

  /* 移动端加载状态 */
  .video-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    z-index: 10;
  }

  .loading-spinner {
    width: 30px; /* 减小加载动画尺寸 */
    height: 30px;
    border-width: 3px;
  }

  /* 移动端错误状态 */
  .video-error {
    font-size: 0.9rem;
    padding: 1rem;
  }

  /* 移动端视频光标调整 */
  .video-player {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23052a1b"/><polygon points="16,14 16,26 26,20" fill="none" stroke="%23FFE29A" stroke-width="2"/></svg>')
        20 20,
      pointer;
  }
}
</style>
