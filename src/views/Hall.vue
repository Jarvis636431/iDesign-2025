<template>
  <div class="exhibition-test-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-icon">
          <img
            :src="currentHallInfo?.icon"
            :alt="currentHallInfo?.name"
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

    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button"><span>←</span> 返回</button>

    <!-- 查看展品按钮 -->
    <button @click="enterInformation" class="exhibit-button">查看展品</button>

    <!-- 模型展示区域 -->
    <div class="model-frame">
      <div
        v-show="!isLoading && !hasError"
        class="model-container"
        ref="modelContainer"
      ></div>
    </div>

    <!-- 操作提示 -->
    <div class="control-tips">
      <div class="tips-content">
        <div class="tips-title">操作提示</div>
        <div class="tips-item">
          <span class="tips-keys">WASD</span>
          <span class="tips-desc">移动视角</span>
        </div>
        <div class="tips-item">
          <span class="tips-keys">方向键</span>
          <span class="tips-desc">移动视角</span>
        </div>
        <div class="tips-item">
          <span class="tips-keys">鼠标</span>
          <span class="tips-desc">旋转视角</span>
        </div>
      </div>
    </div>

    <!-- 移动端虚拟方向键 -->
    <div class="virtual-controls">
      <div class="control-row">
        <button
          @touchstart="handleVirtualKey('KeyW', true)"
          @touchend="handleVirtualKey('KeyW', false)"
          class="control-btn up"
        >
          <span>↑</span>
        </button>
      </div>
      <div class="control-row">
        <button
          @touchstart="handleVirtualKey('KeyA', true)"
          @touchend="handleVirtualKey('KeyA', false)"
          class="control-btn left"
        >
          <span>←</span>
        </button>
        <button
          @touchstart="handleVirtualKey('KeyS', true)"
          @touchend="handleVirtualKey('KeyS', false)"
          class="control-btn down"
        >
          <span>↓</span>
        </button>
        <button
          @touchstart="handleVirtualKey('KeyD', true)"
          @touchend="handleVirtualKey('KeyD', false)"
          class="control-btn right"
        >
          <span>→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as THREE from "three";
import { SceneManager } from "../utils/SceneManager";
import { CameraController } from "../utils/CameraController";
import {
  halls,
  cameraDefaults,
  controlsLimits,
  getHallByNumber,
  getHallById,
} from "../constants/halls";
import axios from "axios"; // 导入 axios

const router = useRouter();
const route = useRoute();

// Three.js 实例变量
let sceneManager, cameraController, camera, renderer, model;

// 响应式状态
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const loadingProgress = ref(0);
const modelContainer = ref(null);
const currentModel = ref(null);

// 获取路由中的展厅ID参数
const currentHallId = computed(() => Number(route.query.id) || 73);

// 获取所有展厅配置
const hallList = computed(() => halls);

// 获取当前展厅对应的信息
const currentHallInfo = computed(() => {
  return getHallById(currentHallId.value);
});

// 展厅描述格式化
const formatDesc = (hall) => {
  if (!hall) return [];
  const desc = hall.desc || hall.enDesc || '';
  return desc.split('|').filter(Boolean).map(line => line.trim());
};

// 更新模型信息
const updateModelInfo = () => {
  if (!currentHallInfo.value) return;
  currentModel.value = {
    name: currentHallInfo.value.name,
    description: currentHallInfo.value.enName,
    ...currentHallInfo.value.model,
  };
};

// 初始化场景
const initScene = async () => {
  if (!modelContainer.value) {
    throw new Error("模型容器未就绪");
  }

  console.log("创建场景管理器...");
  // 创建场景管理器
  sceneManager = new SceneManager(modelContainer.value);
  // 设置白色背景
  sceneManager.scene.background = new THREE.Color(0xffffff);

  console.log("创建相机...");
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    cameraDefaults.fov,
    window.innerWidth / window.innerHeight,
    cameraDefaults.near,
    cameraDefaults.far
  );
  camera.position.set(0, cameraDefaults.eyeHeight, 5);

  console.log("创建渲染器...");
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xffffff, 1); // 设置白色背景

  // 清除之前的渲染器
  if (modelContainer.value.children.length > 0) {
    modelContainer.value.innerHTML = "";
  }

  modelContainer.value.appendChild(renderer.domElement);

  console.log("创建相机控制器...");
  // 创建相机控制器
  cameraController = new CameraController(camera, renderer.domElement);

  // 设置控制器初始配置
  if (controlsLimits) {
    Object.assign(cameraController.controls, controlsLimits);
  }

  console.log("场景初始化完成");
  return Promise.resolve();
};

// 加载模型
const loadModel = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;

    if (!currentHallInfo.value?.model) {
      throw new Error("当前展厅模型配置不存在");
    }

    // 正确处理路径
    const modelPath = currentHallInfo.value.model.path;
    const baseURL = import.meta.env.BASE_URL || "/";
    const fullPath = modelPath.startsWith("http")
      ? modelPath
      : `${baseURL}${modelPath}`;

    console.log("模型加载信息:", {
      baseURL,
      modelPath,
      fullPath,
      currentHallId: currentHallId.value,
      currentHallInfo: currentHallInfo.value,
    });

    // 加载模型
    model = await sceneManager.loadModel(fullPath, (event) => {
      // 确保即使 lengthComputable 为 false 也能显示进度
      if (event.lengthComputable) {
        loadingProgress.value = Math.round((event.loaded / event.total) * 100);
      } else if (event.loaded) {
        // 如果无法计算总大小，至少显示已加载的字节数
        loadingProgress.value = Math.min(
          Math.round((event.loaded / 1048576) * 10), // 假设平均模型大小约10MB
          99 // 保持在99%以防止提前显示100%
        );
      }
    });

    // 设置模型属性
    setupModel();

    isLoading.value = false;
    animate();
  } catch (error) {
    console.error("模型加载失败:", error);
    hasError.value = true;
    errorMessage.value = `模型加载失败: ${error.message || "未知错误"}`;
    isLoading.value = false;
  }
};

// 设置模型
const setupModel = () => {
  if (!model || !currentHallInfo.value?.model) {
    console.error("模型未加载或模型配置不存在");
    return;
  }

  console.log("正在设置模型属性...");
  console.log("配置:", {
    scale: currentHallInfo.value.model.scale,
    position: currentHallInfo.value.model.position,
    rotation: currentHallInfo.value.model.rotation,
  });

  model.scale.setScalar(currentHallInfo.value.model.scale);
  model.position.set(
    currentHallInfo.value.model.position.x,
    currentHallInfo.value.model.position.y,
    currentHallInfo.value.model.position.z
  );
  model.rotation.set(
    currentHallInfo.value.model.rotation.x,
    currentHallInfo.value.model.rotation.y,
    currentHallInfo.value.model.rotation.z
  );

  sceneManager.addObject(model);
  updateModelInfo();
  setupCameraView();
};

// 动画循环
const animate = () => {
  requestAnimationFrame(animate);
  if (cameraController) {
    cameraController.update();
  }
  renderer.render(sceneManager.scene, camera);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer || !modelContainer.value) return;

  // 更新相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // 更新渲染器大小
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 重置视角
const resetView = () => {
  if (!camera || !cameraController || !currentHallInfo.value?.model) return;

  camera.position.set(
    currentHallInfo.value.model.camera.position.x,
    currentHallInfo.value.model.camera.position.y,
    currentHallInfo.value.model.camera.position.z
  );
  camera.lookAt(
    currentHallInfo.value.model.camera.target.x,
    currentHallInfo.value.model.camera.target.y,
    currentHallInfo.value.model.camera.target.z
  );
  cameraController.update();
};

// 设置相机视图
const setupCameraView = () => {
  if (!camera || !model || !currentHallInfo.value?.model) {
    console.error("相机或模型未就绪或模型配置不存在");
    return;
  }

  console.log("正在设置相机视图...");
  console.log("相机配置:", {
    position: currentHallInfo.value.model.camera.position,
    target: currentHallInfo.value.model.camera.target,
    fov: currentHallInfo.value.model.camera.fov,
  });

  // 设置相机初始位置
  camera.position.set(
    currentHallInfo.value.model.camera.position.x,
    currentHallInfo.value.model.camera.position.y,
    currentHallInfo.value.model.camera.position.z
  );

  // 设置相机目标点
  camera.lookAt(
    currentHallInfo.value.model.camera.target.x,
    currentHallInfo.value.model.camera.target.y,
    currentHallInfo.value.model.camera.target.z
  );

  // 更新相机视场角
  if (currentHallInfo.value.model.camera.fov) {
    camera.fov = currentHallInfo.value.model.camera.fov;
    camera.updateProjectionMatrix();
  }

  if (cameraController) {
    // 设置控制器限制
    Object.assign(cameraController.controls, controlsLimits);
    cameraController.update();
    console.log("相机控制器更新完成");
  }
};

// 切换展厅
const switchHall = async () => {
  try {
    // 计算下一个展厅ID
    const currentIndex = halls.findIndex(
      (hall) => hall.id === currentHallId.value
    );
    const nextIndex = (currentIndex + 1) % halls.length;
    const nextHall = halls[nextIndex];

    // 跳转到下一个展厅
    router.push(`/hall?id=${nextHall.id}`);
  } catch (error) {
    console.error("切换展厅失败:", error);
    hasError.value = true;
    errorMessage.value = error.message || "切换展厅失败";
  }
};

// 进入展品展示
const enterInformation = async () => {
  // 直接使用当前展厅ID
  const hallId = currentHallId.value;
  if (!hallId) return;

  isLoading.value = true;
  try {
    const res = await axios.get(
      "http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists",
      {
        params: {
          per_page: 1,
          current_page: 1,
          category_id: hallId,
        },
      }
    );

    let firstExhibitId = "";
    if (res.data?.data?.[0]?.id) {
      firstExhibitId = res.data.data[0].id;
    }

    router.push(`/information?id=${firstExhibitId}&hallId=${hallId}`);
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

// 处理虚拟按键事件
const handleVirtualKey = (keyCode, isKeyDown) => {
  if (!cameraController) return;

  // 创建一个模拟的键盘事件
  const event = {
    code: keyCode,
    preventDefault: () => {},
  };

  // 根据按键状态调用相应的处理方法
  if (isKeyDown) {
    cameraController.handleKeyDown(event);
  } else {
    cameraController.handleKeyUp(event);
  }
};

// 监听展厅ID变化
watch(currentHallId, async (newId) => {
  if (!newId) return;

  // 重置状态
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = "";
  loadingProgress.value = 0;

  // 保存当前模型引用并清理
  const oldModel = model;
  model = null;
  if (oldModel) {
    console.log("正在清理旧模型...");
    sceneManager.removeObject(oldModel);
  }

  // 加载新模型
  await loadModel();
});

// 生命周期钩子
onMounted(async () => {
  try {
    console.log("开始初始化...");
    console.log("BASE_URL:", import.meta.env.BASE_URL);
    console.log("当前路径:", window.location.pathname);
    console.log("完整URL:", window.location.href);

    await initScene();
    console.log("场景初始化完成");

    // 打印当前展厅信息
    console.log("当前展厅信息:", {
      currentHallId: currentHallId.value,
      currentHallInfo: currentHallInfo.value,
    });

    await loadModel();
    console.log("模型加载完成");
    window.addEventListener("resize", handleResize);
  } catch (error) {
    console.error("初始化失败:", error);
    hasError.value = true;
    errorMessage.value = `初始化失败: ${error.message || "未知错误"}`;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (cameraController) {
    cameraController.dispose();
  }
  if (sceneManager) {
    sceneManager.dispose();
  }
  if (renderer) {
    renderer.dispose();
  }
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
  0%, 100% {
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

/* 返回按钮样式 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: #e77e37;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  z-index: 100; /* 确保在模型上层 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(231, 126, 55, 0.2);
}

.back-button:hover {
  background: #d66b24;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(231, 126, 55, 0.3);
}

.back-button span {
  font-size: 1.2rem;
}

/* 查看展品按钮样式 */
.exhibit-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 0.5rem 1.5rem;
  background: #2fa3b0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  z-index: 100; /* 确保在模型上层 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(47, 163, 176, 0.2);
}

.exhibit-button:hover {
  background: #268d99;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(47, 163, 176, 0.3);
}

/* 操作提示样式 */
.control-tips {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 160px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tips-title {
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.3rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.3rem;
}

.tips-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}

.tips-keys {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 0.8rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 50px;
  text-align: center;
}

.tips-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
}

/* 虚拟方向键样式 */
.virtual-controls {
  display: none; /* 默认在PC端隐藏 */
  position: fixed;
  left: 20px;
  bottom: 180px; /* 调整位置避免与操作提示重叠 */
  z-index: 100;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 5px 0;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.control-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-button {
    top: 15px;
    left: 15px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .exhibit-button {
    top: 15px;
    right: 15px;
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }

  .control-tips {
    left: 15px;
    bottom: 15px;
    padding: 0.8rem;
    font-size: 0.8rem;
    min-width: 140px;
  }

  .tips-title {
    font-size: 0.9rem;
  }

  .tips-keys {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    min-width: 45px;
  }

  .tips-desc {
    font-size: 0.75rem;
  }

  .virtual-controls {
    display: block; /* 在移动端显示虚拟按键 */
    bottom: 160px; /* 在移动端调整位置避免与操作提示重叠 */
  }

  .control-row {
    display: flex;
    justify-content: center;
    margin: 0.2rem 0;
  }

  .control-btn {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .control-btn:active {
    transform: translateY(0);
    box-shadow: none;
  }

  .up {
    background: linear-gradient(180deg, #4caf50 0%, #81c784 100%);
  }

  .down {
    background: linear-gradient(0deg, #f44336 0%, #e57373 100%);
  }

  .left {
    background: linear-gradient(90deg, #2196f3 0%, #64b5f6 100%);
  }

  .right {
    background: linear-gradient(270deg, #ff9800 0%, #ffb74d 100%);
  }

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
