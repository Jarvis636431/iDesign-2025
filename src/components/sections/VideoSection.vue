<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const videoRef = ref(null);
const isVideoLoaded = ref(false);
const videoError = ref(false);

// 计算属性：视频描述文字
const videoDescription = computed(() => {
  if (props.isEnglish) {
    return "Wind rises in the forest, recording the sound of design growth<br />In the twilight and wind whispers, witness the footprints of a generation's dreams<br />Every frame is a moment of new sprouts breaking through the soil<br />Every segment of footage is a ring of growth";
  } else {
    return "风起林间，记录设计生长的声音<br />在微光与风语中，看见一代人的筑梦足迹<br />每一帧，都是新苗破土的片刻<br />每一段影像，都是成长的年轮";
  }
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
          <p>视频加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="videoError" class="video-error">
          <p>视频加载失败，请刷新页面重试</p>
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
          您的浏览器不支持视频播放。
        </video>
      </div>

      <p class="video-description" v-html="videoDescription"></p>
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
}
</style>
