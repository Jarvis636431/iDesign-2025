<template>
  <div class="exhibition-test-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-icon">
          <img
            :src="currentHallInfo?.icon"
            :alt="currentHallInfo ? t(`halls.${currentHallInfo.i18nKey}.name`) : ''"
            class="loading-hall-icon"
          />
          <div class="loading-text">Loading...</div>
        </div>
        <div class="loading-description" :style="{ color: currentHallInfo?.color }">
          <div class="loading-desc-text">
            <p
              v-for="(sentence, index) in formatDesc(currentHallInfo)"
              :key="index"
              class="loading-desc-line"
            >
              {{ sentence }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="hasError" class="error-overlay">
      <div class="error-content">
        <h2>模型加载失败</h2>
        <p>{{ errorMessage }}</p>
        <button @click="retryLoad" class="retry-btn">重新加载</button>
        <button @click="goBack" class="back-btn">返回主页</button>
      </div>
    </div>

    <!-- 模型展示区域 -->
    <div class="model-frame">
      <div v-show="!isLoading && !hasError" class="model-container" ref="modelContainer"></div>
    </div>
    <HallHud
      :is-mobile="isMobile"
      @back="goBack"
      @enter="enterInformation"
      @virtual-key="handleVirtualKey"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { cameraDefaults, controlsLimits } from "../constants/hallControls";
import { useEventListener } from "../composables/useEventListener";
import { fetchExhibitsByCategoryId } from "../api/exhibit";
import { useHallData } from "../composables/useHallData";
import { useHallScene } from "../composables/useHallScene";
import HallHud from "../components/hall/HallHud.vue";

const router = useRouter();
const route = useRoute();
const { t, tm } = useI18n();

const modelContainer = ref(null);

// 移动端检测
const isMobile = ref(false);

const checkMobile = () => {
  const userAgent = navigator.userAgent;
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const touchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const smallScreen = window.innerWidth <= 768;

  isMobile.value = mobileRegex.test(userAgent) || touchDevice || smallScreen;
};

const { halls, currentHallId, currentHallInfo, formatDesc, loadHalls } =
  useHallData(route, tm);

const {
  isLoading,
  hasError,
  errorMessage,
  loadingProgress,
  initScene,
  loadModel,
  clearModel,
  bindMouseEvents,
  startRenderLoop,
  stopRenderLoop,
  handleResize,
  handleVisibilityChange,
  handleVirtualKey,
  dispose,
} = useHallScene({
  modelContainer,
  currentHallInfo,
  cameraDefaults,
  controlsLimits,
  t,
  onResize: checkMobile,
});

// 进入展品展示
const enterInformation = async (targetExhibitId = null) => {
  // 直接使用当前展厅ID
  const hallId = currentHallId.value;
  if (!hallId) return;

  isLoading.value = true;
  try {
    // 如果指定了展品ID，直接跳转
    if (targetExhibitId) {
      router.push(`/information?id=${targetExhibitId}&hallId=${hallId}`);
    } else {
      // 否则获取第一个展品并跳转（保持原有逻辑）
      const res = await fetchExhibitsByCategoryId(hallId, {
        perPage: 1,
        currentPage: 1,
      });

      let firstExhibitId = "";
      if (res.data?.data?.[0]?.id) {
        firstExhibitId = res.data.data[0].id;
      }

      router.push(`/information?id=${firstExhibitId}&hallId=${hallId}`);
    }
  } catch {
    router.push(`/information?hallId=${hallId}`);
  } finally {
    isLoading.value = false;
  }
};

// 返回主页
const goBack = () => {
  router.push("/");
};

// 重试加载
const retryLoad = () => {
  loadModel();
};

// 监听展厅ID变化
watch(currentHallId, async (newId) => {
  if (!newId) return;
  if (!halls.value.length) {
    halls.value = await loadHalls();
  }

  // 重置状态
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = "";
  loadingProgress.value = 0;

  // 保存当前模型引用并彻底清理
  clearModel();

  // 加载新模型
  await loadModel();
});

// 生命周期钩子
onMounted(async () => {
  try {
    halls.value = await loadHalls();
    // 检测移动端设备
    checkMobile();

    await initScene();

    await loadModel();

    // 添加事件监听器
    useEventListener(window, "resize", handleResize);
    useEventListener(document, "visibilitychange", handleVisibilityChange);

    bindMouseEvents();

    // 启动智能渲染循环
    startRenderLoop();
  } catch (error) {
    hasError.value = true;
    errorMessage.value = `初始化失败: ${error.message || "未知错误"}`;
  }
});

onUnmounted(() => {
  dispose();
});
</script>

<style scoped>
/* 修改场景背景和基础样式 */
.exhibition-test-page {
  width: 100%;
  height: 100%;
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #fff;
}

.model-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  background: #fff;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  border: none;
  padding: 0;
  z-index: 1; /* 确保在按钮下层 */
}

.model-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 0;
  background: #fff;
  overflow: hidden;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  backdrop-filter: blur(20px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari兼容 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
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
  color: #fff;
  font-weight: normal;
  letter-spacing: 0.1em;
}

.loading-description {
  max-width: 600px;
  margin-top: 3rem;
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 错误状态 */
.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 2rem;
}

.error-content h2 {
  margin: 0 0 1rem 0;
  color: #ff6b6b;
  font-size: 1.5rem;
}

.error-content p {
  margin: 0 0 2rem 0;
  opacity: 0.8;
  line-height: 1.6;
}

.retry-btn,
.back-btn {
  padding: 0.8rem 1.5rem;
  margin: 0 0.5rem;
  border: 2px solid #fff;
  background: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #fff;
  color: #000;
}

.back-btn {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.back-btn:hover {
  background: #ff6b6b;
  color: white;
}

@media (max-width: 768px) {
  .loading-hall-icon {
    width: 80px;
    height: 80px;
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
