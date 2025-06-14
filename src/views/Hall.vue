<template>
  <div class="exhibition-test-page">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h2>正在加载展场模型...</h2>
        <p>{{ loadingProgress }}%</p>
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
      <div
        v-show="!isLoading && !hasError"
        class="model-container"
        ref="modelContainer"
      >
        <!-- 控制面板 -->
        <div class="control-panel">
          <button @click="goBack" class="back-button">
            <span>←</span> 返回
          </button>
          <div class="model-info">
            <h3>{{ currentModel?.name || "展场模型" }}</h3>
            <p>{{ currentModel?.description || "虚拟展厅3D模型" }}</p>
          </div>
          <div class="view-controls">
            <!-- 模型选择器 -->
            <div class="model-selector">
              <select
                id="hall-select"
                v-model="currentHallId"
                @change="switchHall"
                class="hall-select"
              >
                <option v-for="(hall, id) in hallModels" :key="id" :value="id">
                  {{ hall.name }}
                </option>
              </select>
            </div>
            <button @click="resetView" class="control-btn">重置视角</button>
            <button
              @click="enterInformation"
              class="control-btn information-btn"
            >
              查看展品
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import * as THREE from "three";
import { SceneManager } from "../utils/SceneManager";
import { CameraController } from "../utils/CameraController";
import {
  halls,
  cameraDefaults,
  controlsLimits,
  getHallByNumber,
} from "../constants/halls";
import axios from "axios"; // 导入 axios

const router = useRouter();

// 响应式状态
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const loadingProgress = ref(0);
const modelContainer = ref(null);
const currentModel = ref(null);

// 获取当前展厅对应的信息
const currentHallInfo = computed(() => {
  const hallNumber = parseInt(currentHallId.value.replace("hall", ""));
  return getHallByNumber(hallNumber);
});

// 获取当前模型配置
const modelConfig = computed(() => currentHallInfo.value?.model);

// 当前选择的模型ID
const currentHallId = ref("hall1");

// 初始化场景
const initScene = () => {
  if (!modelContainer.value) return;

  // 创建场景管理器
  sceneManager = new SceneManager(modelContainer.value);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    cameraDefaults.fov,
    window.innerWidth / window.innerHeight,
    cameraDefaults.near,
    cameraDefaults.far
  );
  camera.position.set(0, cameraDefaults.eyeHeight, 5);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  modelContainer.value.appendChild(renderer.domElement);

  // 创建相机控制器
  cameraController = new CameraController(camera, renderer.domElement);
};

// 加载模型
const loadModel = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;

    // 正确处理路径
    const modelPath = modelConfig.value.path;
    const fullPath = modelPath.startsWith("http")
      ? modelPath
      : window.location.origin + import.meta.env.BASE_URL + modelPath;

    console.log("完整模型路径:", fullPath);
    console.log("BASE_URL:", import.meta.env.BASE_URL);
    console.log("原始路径:", modelPath);

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
    errorMessage.value = error.message || "未知错误";
    isLoading.value = false;
  }
};

// 设置模型
const setupModel = () => {
  if (!model) {
    console.error("模型未加载");
    return;
  }

  console.log("正在设置模型属性...");
  console.log("配置:", {
    scale: modelConfig.value.scale,
    position: modelConfig.value.position,
    rotation: modelConfig.value.rotation,
  });

  model.scale.setScalar(modelConfig.value.scale);
  model.position.set(
    modelConfig.value.position.x,
    modelConfig.value.position.y,
    modelConfig.value.position.z
  );
  model.rotation.set(
    modelConfig.value.rotation.x,
    modelConfig.value.rotation.y,
    modelConfig.value.rotation.z
  );

  sceneManager.addObject(model);
  currentModel.value = modelConfig.value;

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
  if (!camera || !cameraController) return;

  camera.position.set(
    modelConfig.value.camera.position.x,
    modelConfig.value.camera.position.y,
    modelConfig.value.camera.position.z
  );
  camera.lookAt(
    modelConfig.value.camera.target.x,
    modelConfig.value.camera.target.y,
    modelConfig.value.camera.target.z
  );
  cameraController.update();
};

// 设置相机视图
const setupCameraView = () => {
  if (!camera || !model) {
    console.error("相机或模型未就绪");
    return;
  }

  console.log("正在设置相机视图...");
  console.log("相机配置:", {
    position: modelConfig.value.camera.position,
    target: modelConfig.value.camera.target,
    fov: modelConfig.value.camera.fov,
  });

  // 设置相机初始位置
  camera.position.set(
    modelConfig.value.camera.position.x,
    modelConfig.value.camera.position.y,
    modelConfig.value.camera.position.z
  );

  // 设置相机目标点
  camera.lookAt(
    modelConfig.value.camera.target.x,
    modelConfig.value.camera.target.y,
    modelConfig.value.camera.target.z
  );

  // 更新相机视场角
  if (modelConfig.value.camera.fov) {
    camera.fov = modelConfig.value.camera.fov;
    camera.updateProjectionMatrix();
  }

  if (cameraController) {
    // 设置控制器限制
    Object.assign(cameraController.controls, controlsLimits);
    cameraController.update();
    console.log("相机控制器更新完成");
  }
};

// 切换场景
const switchHall = async () => {
  try {
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
  } catch (error) {
    console.error("切换展厅失败:", error);
    hasError.value = true;
    errorMessage.value = error.message || "切换展厅失败";
  } finally {
    if (hasError.value) {
      isLoading.value = false;
    }
  }
};

// 进入展品展示
const enterInformation = async () => {
  if (!currentHallInfo.value) return;

  isLoading.value = true;
  try {
    const res = await axios.get(
      "http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists",
      {
        params: {
          per_page: 1,
          current_page: 1,
          category_id: currentHallInfo.value.id,
        },
      }
    );

    let firstExhibitId = "";
    if (res.data?.data?.[0]?.id) {
      firstExhibitId = res.data.data[0].id;
    }

    router.push(
      `/2025/information/${firstExhibitId}?hallId=${currentHallInfo.value.id}`
    );
  } catch {
    router.push(`/2025/information/?hallId=${currentHallInfo.value.id}`);
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

// 生命周期钩子
onMounted(() => {
  initScene();
  loadModel();
  window.addEventListener("resize", handleResize);
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
.exhibition-test-page {
  width: 100%;
  height: 100%;
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000;
}

/* 修改模型框架样式，去掉边距和圆角 */
.model-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  border: none;
  padding: 0;
}

.model-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 0;
  background: transparent;
  overflow: hidden;
}

/* 加载状态 */
.loading-overlay {
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

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-content h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 300;
}

.loading-content p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.8;
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

/* 控制面板 */
.control-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  z-index: 100;
  color: white;
  max-height: 80vh;
  overflow-y: auto;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.back-button span {
  font-size: 1.2rem;
}

.model-info {
  flex: 1;
  text-align: center;
  margin: 0 2rem;
}

.model-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.model-info p {
  margin: 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

/* 模型选择器样式 */
.model-selector {
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.model-selector {
  margin: 0;
  padding: 0;
  flex: 1;
}

.hall-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hall-select:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #007bff;
}

.hall-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 100%;
  overflow-x: hidden;
}

.control-btn {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.save-btn {
  background: rgba(40, 167, 69, 0.9) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(40, 167, 69, 0.5) !important;
}

.save-btn:hover {
  background: rgba(40, 167, 69, 1) !important;
}

.information-btn {
  background: rgba(47, 163, 176, 0.8) !important;
  border-color: rgba(47, 163, 176, 0.5) !important;
  font-weight: 500;
}

.information-btn:hover {
  background: rgba(47, 163, 176, 1) !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-panel {
    padding: 0.8rem;
    margin: 0;
    border-radius: 0;
    max-height: 50vh;
    overflow-y: auto;
  }

  .model-info {
    margin: 0;
    order: -1;
  }

  .model-info h3 {
    font-size: 1rem;
  }

  .model-info p {
    font-size: 0.8rem;
  }

  .view-controls {
    justify-content: center;
  }

  .back-button {
    position: absolute;
    top: 0.8rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .loading-content h2 {
    font-size: 1.2rem;
  }

  .loading-content p {
    font-size: 1rem;
  }

  .error-content {
    padding: 1rem;
  }

  .error-content h2 {
    font-size: 1.2rem;
  }

  .retry-btn,
  .back-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
