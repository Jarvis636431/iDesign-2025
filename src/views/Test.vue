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
    <div
      v-show="!isLoading && !hasError"
      class="model-container"
      ref="modelContainer"
    >
      <!-- 控制面板 -->
      <div class="control-panel">
        <button @click="goBack" class="back-button"><span>←</span> 返回</button>
        <div class="model-info">
          <h3>{{ currentModel?.name || "展场模型" }}</h3>
          <p>{{ currentModel?.description || "虚拟展厅3D模型" }}</p>
        </div>
        <div class="view-controls">
          <button @click="resetView" class="control-btn">重置视角</button>
          <button @click="toggleFullscreen" class="control-btn">
            {{ isFullscreen ? "退出全屏" : "全屏" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const router = useRouter();

// 响应式数据
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const loadingProgress = ref(0);
const isFullscreen = ref(false);
const modelContainer = ref(null);
const currentModel = ref(null);

// Three.js 相关变量
let scene, camera, renderer, controls, model;

// 展场模型配置 - 使用现有的312.glb模型
const modelConfig = {
  name: "虚拟展厅",
  description: "3D展场模型展示",
  path: import.meta.env.BASE_URL + "assets/models/312.glb", // 使用现有的312.glb模型
  scale: 1,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
};

// 初始化Three.js场景
const initThreeJS = () => {
  if (!modelContainer.value) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  modelContainer.value.appendChild(renderer.domElement);

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
};

// 加载模型
const loadModel = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    loadingProgress.value = 0;

    const loader = new GLTFLoader();

    // 加载进度回调
    const onProgress = (progress) => {
      if (progress.lengthComputable) {
        loadingProgress.value = Math.round(
          (progress.loaded / progress.total) * 100
        );
      }
    };

    // 加载模型
    const gltf = await new Promise((resolve, reject) => {
      loader.load(modelConfig.path, resolve, onProgress, reject);
    });

    model = gltf.scene;

    // 设置模型属性
    model.scale.setScalar(modelConfig.scale);
    model.position.set(
      modelConfig.position.x,
      modelConfig.position.y,
      modelConfig.position.z
    );
    model.rotation.set(
      modelConfig.rotation.x,
      modelConfig.rotation.y,
      modelConfig.rotation.z
    );

    // 添加到场景
    scene.add(model);
    currentModel.value = modelConfig;

    // 自动调整相机位置
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    camera.position.set(center.x, center.y, center.z + cameraZ * 1.5);
    controls.target.copy(center);
    controls.update();

    isLoading.value = false;

    // 开始渲染循环
    animate();
  } catch (error) {
    console.error("模型加载失败:", error);
    hasError.value = true;
    errorMessage.value = `加载失败: ${error.message}`;
    isLoading.value = false;
  }
};

// 动画循环
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// 重置视角
const resetView = () => {
  if (model && controls) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    camera.position.set(center.x, center.y, center.z + cameraZ * 1.5);
    controls.target.copy(center);
    controls.update();
  }
};

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    modelContainer.value.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// 重新加载
const retryLoad = () => {
  hasError.value = false;
  loadModel();
};

// 返回主页
const goBack = () => {
  router.push("/2025/");
};

// 窗口大小调整
const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

// 全屏状态监听
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
  handleResize();
};

// 生命周期
onMounted(() => {
  initThreeJS();
  loadModel();

  window.addEventListener("resize", handleResize);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);

  // 清理Three.js资源
  if (renderer) {
    renderer.dispose();
  }
  if (scene) {
    scene.clear();
  }
});
</script>

<style scoped>
.exhibition-test-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  position: relative;
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

/* 模型容器 */
.model-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 控制面板 */
.control-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  color: white;
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

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-panel {
    padding: 0.8rem 1rem;
    flex-direction: column;
    gap: 0.8rem;
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
