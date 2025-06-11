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
          <button @click="goBack" class="back-button"><span>←</span> 返回</button>
          <div class="model-info">
            <h3>{{ currentModel?.name || "展场模型" }}</h3>
            <p>{{ currentModel?.description || "虚拟展厅3D模型" }}</p>
          </div>
          <div class="view-controls">
            <!-- 模型选择器 -->
            <div class="model-selector">
              <label for="hall-select">选择展厅:</label>
              <select
                id="hall-select"
                v-model="currentHallId"
                @change="switchHall"
                class="hall-select"
              >
                <option v-for="(hall, id) in hallModels" :key="id" :value="id">
                  {{ hall.name }} - {{ hall.description }}
                </option>
              </select>
            </div>

            <button @click="switchToTestScene" class="control-btn">
              程序化场景
            </button>
            <button @click="setPresetView('front')" class="control-btn">
              正视图
            </button>
            <button @click="setPresetView('top')" class="control-btn">
              俯视图
            </button>
            <button @click="setPresetView('side')" class="control-btn">
              侧视图
            </button>
            <button @click="rotateModel(180)" class="control-btn">
              旋转180°
            </button>
            <button @click="demonstratePositionDifference" class="control-btn">
              演示位置差异
            </button>
            <button @click="toggleAxes" class="control-btn">
              {{ showAxes ? "隐藏坐标轴" : "显示坐标轴" }}
            </button>
            <button @click="toggleBoundingBox" class="control-btn">
              {{ showBoundingBox ? "隐藏边界框" : "显示边界框" }}
            </button>
            <button @click="resetView" class="control-btn">重置视角</button>
            <button @click="logCurrentConfig" class="control-btn">
              输出配置
            </button>
            <button @click="saveCurrentConfig" class="control-btn save-btn">
              保存当前配置
            </button>
            <button @click="toggleFullscreen" class="control-btn">
              {{ isFullscreen ? "退出全屏" : "全屏" }}
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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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
const showBoundingBox = ref(false);
const showAxes = ref(true); // 默认显示坐标轴

// Three.js 相关变量
let scene, camera, renderer, controls, model, boundingBoxHelper, axesHelper, raycaster, mouse;

// 响应式状态 - 当前选中的物体
const selectedObject = ref(null);

// 多展场模型配置系统
const hallModels = {
  // 第一个展厅 - 你当前调试好的最佳配置
  hall1: {
    id: "hall1",
    name: "第一展厅",
    description: "First Whisper 展厅模型",
    path:
      import.meta.env.BASE_URL +
      "assets/models/hall-models/1-first-whisper-with-exhibits-edited.glb",
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    camera: {
      position: { x: -0.7, y: 1, z: -23 }, // 你调试好的最佳方向
      target: { x: 0, y: 0, z: 0 },
      fov: 20,
      autoFit: true,
      fitMultiplier: 0.2, // 你调试好的最佳距离
    },
  },

  // 第二个展厅 - 待调试配置
  hall2: {
    id: "hall2",
    name: "第二展厅",
    description: "Second Hall 展厅模型",
    path:
      import.meta.env.BASE_URL +
      "assets/models/hall-models/1-first-whisper-with-exhibits-edited.glb",
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    camera: {
      position: { x: 180, y: 0, z: 180 }, // 默认配置，需要调试
      target: { x: 0, y: 0, z: 0 },
      fov: 75,
      autoFit: true,
      fitMultiplier: 2.0,
    },
  },

  // 第三个展厅 - 待调试配置
  hall3: {
    id: "hall3",
    name: "第三展厅",
    description: "Third Hall 展厅模型",
    path:
      import.meta.env.BASE_URL +
      "assets/models/hall-models/1-first-whisper-with-exhibits-edited.glb",
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    camera: {
      position: { x: -100, y: 50, z: 100 }, // 默认配置，需要调试
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: true,
      fitMultiplier: 1.5,
    },
  },
};

// 当前选择的模型ID
const currentHallId = ref("hall1"); // 默认加载第一个展厅

// 当前模型配置（计算属性）
const modelConfig = computed(() => hallModels[currentHallId.value]);

// 初始化Three.js场景
const initThreeJS = () => {
  if (!modelContainer.value) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 创建相机 - 使用默认FOV，稍后会根据模型配置更新
  camera = new THREE.PerspectiveCamera(
    75, // 默认视野角度，稍后会更新
    window.innerWidth / window.innerHeight, // 宽高比
    0.01, // 近平面（更小，可以更近距离观看）
    10000 // 远平面（更大，可以看到更远的物体）
  );
  // 设置初始相机位置 - 使用人眼高度
  camera.position.set(0, 1.6, 5); // 设置为标准人眼高度

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  modelContainer.value.appendChild(renderer.domElement);
  
  // 初始化射线检测器和鼠标向量
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // 添加点击事件监听
  renderer.domElement.addEventListener('click', onMouseClick);

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 启用阻尼效果，使移动更平滑
  controls.dampingFactor = 0.05;

  // 设置为第一人称模式
  controls.maxPolarAngle = Math.PI / 2; // 限制垂直旋转，不能看到地面以下
  controls.minPolarAngle = Math.PI / 2; // 锁定垂直高度

  // 设置移动限制
  controls.enableZoom = false; // 禁用缩放
  controls.enableRotate = true; // 允许水平旋转
  controls.rotateSpeed = 0.5; // 降低旋转速度

  // 启用平移但限制为水平移动
  controls.enablePan = true;
  controls.panSpeed = 0.5;
  
  // 添加平移限制回调
  controls.addEventListener('change', () => {
    // 锁定相机高度
    camera.position.y = 1.6; // 设置为标准人眼高度（约1.6米）
  });

  // 移除垂直角度限制（可以从任意角度观看）
  controls.minPolarAngle = 0; // 最小垂直角度
  controls.maxPolarAngle = Math.PI; // 最大垂直角度

  // 移除水平角度限制
  controls.minAzimuthAngle = -Infinity; // 最小水平角度
  controls.maxAzimuthAngle = Infinity; // 最大水平角度

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 添加坐标轴辅助器
  createAxesHelper();
};

// 加载外部模型
const loadExternalModel = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    loadingProgress.value = 0;

    // 创建GLTF加载器
    const loader = new GLTFLoader();

    // 创建并配置Draco加载器
    const dracoLoader = new DRACOLoader();

    // 尝试使用CDN路径，如果失败则使用备用路径
    try {
      // 优先使用Google CDN
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );
    } catch (error) {
      console.warn("CDN Draco路径不可用，尝试使用备用路径");
      // 备用：使用jsDelivr CDN
      dracoLoader.setDecoderPath(
        "https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/draco/"
      );
    }

    // 将Draco加载器设置到GLTF加载器
    loader.setDRACOLoader(dracoLoader);

    // 加载进度回调
    const onProgress = (progress) => {
      if (progress.lengthComputable) {
        loadingProgress.value = Math.round(
          (progress.loaded / progress.total) * 100
        );
      }
    };

    console.log("开始加载模型:", modelConfig.value.path);
    console.log("已配置Draco解码器支持");

    // 加载模型
    const gltf = await new Promise((resolve, reject) => {
      loader.load(modelConfig.value.path, resolve, onProgress, reject);
    });

    model = gltf.scene;

    // 设置模型属性
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

    // 添加到场景
    scene.add(model);
    currentModel.value = modelConfig.value;
    
    // 设置模型交互性
    setupModelInteractivity(model, `${currentHallId.value}_`);

    // 更新相机FOV为配置值
    camera.fov = modelConfig.value.camera.fov;
    camera.updateProjectionMatrix();

    // 设置相机视角 - 这是最终的视角设置
    console.log("🎯 模型加载完成，设置最终视角...");
    setupCameraView(model);

    // 根据模型大小调整坐标轴
    updateAxesSize(model);

    isLoading.value = false;

    console.log("模型加载成功!");

    // 自动输出当前配置信息
    setTimeout(() => {
      logCurrentConfig();
    }, 500); // 延迟500ms确保所有设置都完成

    // 清理Draco加载器（可选，释放内存）
    dracoLoader.dispose();

    // 开始渲染循环
    animate();
  } catch (error) {
    console.error("模型加载失败:", error);
    hasError.value = true;
    errorMessage.value = `加载失败: ${error.message}`;
    isLoading.value = false;
  }
};

// 创建程序化测试场景
const createTestScene = () => {
  try {
    isLoading.value = true;
    hasError.value = false;

    // 模拟加载进度
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      loadingProgress.value = progress;
      if (progress >= 100) {
        clearInterval(progressInterval);
        buildTestScene();
      }
    }, 100);
  } catch (error) {
    console.error("场景创建失败:", error);
    hasError.value = true;
    errorMessage.value = `创建失败: ${error.message}`;
    isLoading.value = false;
  }
};

// 构建测试场景
const buildTestScene = () => {
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // 创建展厅墙壁
  const wallHeight = 5;
  const wallThickness = 0.2;

  // 后墙
  const backWallGeometry = new THREE.BoxGeometry(20, wallHeight, wallThickness);
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
  backWall.position.set(0, wallHeight / 2, -10);
  backWall.receiveShadow = true;
  scene.add(backWall);

  // 左墙
  const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 20);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(-10, wallHeight / 2, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // 右墙
  const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  rightWall.position.set(10, wallHeight / 2, 0);
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // 创建一些展示台
  const pedestalGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);
  const pedestalMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

  // 展示台1
  const pedestal1 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal1.position.set(-5, 0.5, -5);
  pedestal1.castShadow = true;
  scene.add(pedestal1);

  // 展示台2
  const pedestal2 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal2.position.set(5, 0.5, -5);
  pedestal2.castShadow = true;
  scene.add(pedestal2);

  // 展示台3
  const pedestal3 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal3.position.set(0, 0.5, 0);
  pedestal3.castShadow = true;
  scene.add(pedestal3);

  // 在展示台上放置一些装饰物
  const decorGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const decorMaterials = [
    new THREE.MeshLambertMaterial({ color: 0xff6b6b }),
    new THREE.MeshLambertMaterial({ color: 0x4ecdc4 }),
    new THREE.MeshLambertMaterial({ color: 0x45b7d1 }),
  ];

  decorMaterials.forEach((material, index) => {
    const decor = new THREE.Mesh(decorGeometry, material);
    const pedestals = [pedestal1, pedestal2, pedestal3];
    decor.position.copy(pedestals[index].position);
    decor.position.y += 1.4;
    decor.castShadow = true;
    scene.add(decor);
  });

  // 创建一个组作为模型
  model = new THREE.Group();
  scene.children.forEach((child) => {
    if (child !== model) {
      model.add(child.clone());
    }
  });

  currentModel.value = modelConfig.value;

  // 设置相机位置
  camera.position.set(8, 6, 8);
  controls.target.set(0, 2, 0);
  controls.update();

  isLoading.value = false;

  // 开始渲染循环
  animate();
};

// 创建坐标轴辅助器
const createAxesHelper = (size = 10) => {
  if (axesHelper) {
    scene.remove(axesHelper);
  }

  // 创建坐标轴辅助器
  // 参数是轴的长度，可以根据模型大小调整
  axesHelper = new THREE.AxesHelper(size);

  // 设置轴的位置（默认在原点）
  axesHelper.position.set(0, 0, 0);

  if (showAxes.value) {
    scene.add(axesHelper);
    console.log(
      `坐标轴已添加 (长度: ${size}) - X轴(红色), Y轴(绿色), Z轴(蓝色)`
    );
  }
};

// 根据模型大小更新坐标轴
const updateAxesSize = (targetModel) => {
  if (!targetModel) return;

  const box = new THREE.Box3().setFromObject(targetModel);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // 坐标轴长度设为模型最大尺寸的一半
  const axesSize = maxDim * 0.5;

  console.log(`根据模型尺寸调整坐标轴长度: ${axesSize.toFixed(2)}`);
  createAxesHelper(axesSize);
};

// 设置相机视角
const setupCameraView = (targetModel) => {
  if (!targetModel || !camera || !controls) return;

  const box = new THREE.Box3().setFromObject(targetModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 调试信息：显示模型边界框
  console.log("模型边界框信息:");
  console.log("- 中心点:", center);
  console.log("- 尺寸:", size);
  console.log("- 边界框:", box);

  if (modelConfig.value.camera.autoFit) {
    // 自动调整到最佳视角
    const maxDim = Math.max(size.x, size.y, size.z);
    const fovDegrees = camera.fov; // 20度
    const fov = fovDegrees * (Math.PI / 180); // 转换为弧度
    const halfFov = fov / 2; // 一半的视野角度
    const halfFovDegrees = fovDegrees / 2; // 10度

    // 详细的计算过程
    console.log("📐 FOV角度计算详解:");
    console.log(`- 完整FOV: ${fovDegrees}°`);
    console.log(`- 半FOV: ${halfFovDegrees}° (${halfFov.toFixed(4)} 弧度)`);
    console.log(`- 模型最大尺寸: ${maxDim.toFixed(4)}`);
    console.log(`- 模型半尺寸: ${(maxDim / 2).toFixed(4)}`);
    console.log(`- tan(${halfFovDegrees}°) = ${Math.tan(halfFov).toFixed(4)}`);

    let cameraDistance = Math.abs(maxDim / 2 / Math.tan(halfFov));
    console.log(
      `- 基础距离 = ${(maxDim / 2).toFixed(4)} ÷ ${Math.tan(halfFov).toFixed(
        4
      )} = ${cameraDistance.toFixed(4)}`
    );

    // 应用距离倍数
    const originalDistance = cameraDistance;
    cameraDistance *= modelConfig.value.camera.fitMultiplier;
    console.log(
      `- 最终距离 = ${originalDistance.toFixed(4)} × ${
        modelConfig.value.camera.fitMultiplier
      } = ${cameraDistance.toFixed(4)}`
    );

    // 计算相机位置（保持相对方向，但调整距离）
    console.log("🔄 配置值 → 最终值的转换过程:");
    console.log(
      `- 配置的相机位置: (${modelConfig.value.camera.position.x}, ${modelConfig.value.camera.position.y}, ${modelConfig.value.camera.position.z})`
    );

    let direction = new THREE.Vector3(
      modelConfig.value.camera.position.x,
      modelConfig.value.camera.position.y,
      modelConfig.value.camera.position.z
    );

    console.log(
      `- 原始方向向量: (${direction.x.toFixed(2)}, ${direction.y.toFixed(
        2
      )}, ${direction.z.toFixed(2)})`
    );
    console.log(`- 方向向量长度: ${direction.length().toFixed(4)}`);

    direction.normalize();
    console.log(
      `- 标准化后方向: (${direction.x.toFixed(4)}, ${direction.y.toFixed(
        4
      )}, ${direction.z.toFixed(4)})`
    );
    console.log(
      `- 标准化后长度: ${direction.length().toFixed(4)} (应该是1.0000)`
    );

    // 如果有z轴旋转，应用旋转变换
    if (modelConfig.value.camera.rotationZ) {
      const rotationAngle =
        (modelConfig.value.camera.rotationZ * Math.PI) / 180;
      const cos = Math.cos(rotationAngle);
      const sin = Math.sin(rotationAngle);

      // 绕z轴旋转矩阵
      const newX = direction.x * cos - direction.y * sin;
      const newY = direction.x * sin + direction.y * cos;
      direction.set(newX, newY, direction.z);

      console.log(`应用z轴旋转 ${modelConfig.value.camera.rotationZ}度`);
    }

    console.log(`- 计算的距离: ${cameraDistance.toFixed(4)}`);
    console.log(
      `- 模型中心: (${center.x.toFixed(4)}, ${center.y.toFixed(
        4
      )}, ${center.z.toFixed(4)})`
    );

    const finalDirection = direction.multiplyScalar(cameraDistance);
    console.log(
      `- 最终偏移向量: (${finalDirection.x.toFixed(
        4
      )}, ${finalDirection.y.toFixed(4)}, ${finalDirection.z.toFixed(4)})`
    );

    camera.position.copy(center).add(finalDirection);
    controls.target.copy(center);

    console.log("✅ 最终相机位置:", {
      x: parseFloat(camera.position.x.toFixed(4)),
      y: parseFloat(camera.position.y.toFixed(4)),
      z: parseFloat(camera.position.z.toFixed(4)),
    });
    console.log("✅ 最终目标位置:", {
      x: parseFloat(controls.target.x.toFixed(4)),
      y: parseFloat(controls.target.y.toFixed(4)),
      z: parseFloat(controls.target.z.toFixed(4)),
    });
  } else {
    // 使用配置的固定位置
    camera.position.set(
      modelConfig.value.camera.position.x,
      modelConfig.value.camera.position.y,
      modelConfig.value.camera.position.z
    );
    controls.target.set(
      modelConfig.value.camera.target.x,
      modelConfig.value.camera.target.y,
      modelConfig.value.camera.target.z
    );

    console.log("使用配置的相机位置:", camera.position);
  }

  controls.update();
  console.log("控制器目标设置为:", controls.target);
};

// 动画循环
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// 设置预设视角
const setPresetView = (viewType) => {
  if (!model || !camera || !controls) return;

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 2; // 适当的观看距离

  switch (viewType) {
    case "front":
      // 正视图：从前方看
      camera.position.set(center.x, center.y, center.z + distance);
      controls.target.copy(center);
      break;
    case "top":
      // 俯视图：从上方看
      camera.position.set(center.x, center.y + distance, center.z);
      controls.target.copy(center);
      break;
    case "side":
      // 侧视图：从右侧看
      camera.position.set(center.x + distance, center.y, center.z);
      controls.target.copy(center);
      break;
    case "isometric":
      // 等轴视图：45度角
      camera.position.set(
        center.x + distance * 0.7,
        center.y + distance * 0.7,
        center.z + distance * 0.7
      );
      controls.target.copy(center);
      break;
  }

  controls.update();
  console.log(`切换到${viewType}视角:`, camera.position);
};

// 旋转模型
const rotateModel = (degrees) => {
  if (!model) return;

  const radians = (degrees * Math.PI) / 180;
  model.rotation.z += radians;

  console.log(`模型绕z轴旋转 ${degrees}度，当前旋转角度:`, {
    x: (model.rotation.x * 180) / Math.PI,
    y: (model.rotation.y * 180) / Math.PI,
    z: (model.rotation.z * 180) / Math.PI,
  });
};

// 演示相机位置和模型位置的区别
const demonstratePositionDifference = () => {
  if (!model || !camera || !controls) return;

  console.log("=".repeat(60));
  console.log("🎭 演示：相机位置 vs 模型位置的区别");
  console.log("=".repeat(60));

  // 保存当前状态
  const originalCameraPos = camera.position.clone();
  const originalModelPos = model.position.clone();
  const originalTarget = controls.target.clone();

  let step = 0;
  const steps = [
    {
      name: "初始状态",
      action: () => {
        console.log("📍 步骤1: 初始状态");
        console.log("- 相机位置:", camera.position);
        console.log("- 模型位置:", model.position);
        console.log("- 观察目标:", controls.target);
      },
    },
    {
      name: "移动相机",
      action: () => {
        console.log("📷 步骤2: 移动相机位置 (模型不动)");
        camera.position.set(
          originalCameraPos.x + 50,
          originalCameraPos.y + 30,
          originalCameraPos.z + 50
        );
        controls.target.copy(originalTarget);
        controls.update();
        console.log("- 新相机位置:", camera.position);
        console.log("- 模型位置(不变):", model.position);
        console.log("- 效果: 从不同角度观看同一个模型");
      },
    },
    {
      name: "恢复并移动模型",
      action: () => {
        console.log("🎯 步骤3: 移动模型位置 (相机不动)");
        // 恢复相机
        camera.position.copy(originalCameraPos);
        // 移动模型
        model.position.set(
          originalModelPos.x + 0.05,
          originalModelPos.y + 0.02,
          originalModelPos.z + 0.03
        );
        // 更新观察目标到新的模型位置
        controls.target.copy(model.position);
        controls.update();
        console.log("- 相机位置(不变):", camera.position);
        console.log("- 新模型位置:", model.position);
        console.log("- 新观察目标:", controls.target);
        console.log("- 效果: 模型在3D空间中移动了位置");
      },
    },
    {
      name: "恢复原状",
      action: () => {
        console.log("🔄 步骤4: 恢复到原始状态");
        camera.position.copy(originalCameraPos);
        model.position.copy(originalModelPos);
        controls.target.copy(originalTarget);
        controls.update();
        console.log("- 已恢复到初始状态");
      },
    },
  ];

  const executeStep = () => {
    if (step < steps.length) {
      steps[step].action();
      step++;
      if (step < steps.length) {
        setTimeout(executeStep, 2000); // 每2秒执行下一步
      } else {
        console.log("=".repeat(60));
        console.log("✅ 演示完成！");
        console.log("📝 总结:");
        console.log("- 移动相机 = 改变观察角度");
        console.log("- 移动模型 = 改变模型在世界中的位置");
        console.log("=".repeat(60));
      }
    }
  };

  executeStep();
};

// 输出当前配置信息
const logCurrentConfig = () => {
  console.log("=".repeat(60));
  console.log("📋 当前 ModelConfig 配置:");
  console.log("=".repeat(60));

  // 输出完整的modelConfig
  console.log("🔧 完整配置对象:");
  console.log(JSON.stringify(modelConfig, null, 2));

  console.log("\n📐 相机配置详情:");
  console.log("- 初始位置:", modelConfig.camera.position);
  console.log("- 目标点:", modelConfig.camera.target);
  console.log("- 视野角度:", modelConfig.camera.fov + "°");
  console.log("- 自动适配:", modelConfig.camera.autoFit ? "开启" : "关闭");
  console.log("- 距离倍数:", modelConfig.camera.fitMultiplier);
  console.log("- Z轴旋转:", modelConfig.camera.rotationZ + "°");

  console.log("\n🎯 模型配置详情:");
  console.log("- 名称:", modelConfig.name);
  console.log("- 描述:", modelConfig.description);
  console.log("- 文件路径:", modelConfig.path);
  console.log("- 缩放:", modelConfig.scale);
  console.log("- 位置:", modelConfig.position);
  console.log("- 旋转:", modelConfig.rotation);

  // 如果有当前相机信息，也输出
  if (camera && controls) {
    console.log("\n📷 当前相机状态:");
    console.log("- 当前位置:", {
      x: parseFloat(camera.position.x.toFixed(2)),
      y: parseFloat(camera.position.y.toFixed(2)),
      z: parseFloat(camera.position.z.toFixed(2)),
    });
    console.log("- 当前目标:", {
      x: parseFloat(controls.target.x.toFixed(2)),
      y: parseFloat(controls.target.y.toFixed(2)),
      z: parseFloat(controls.target.z.toFixed(2)),
    });
    console.log("- 当前视野角度:", camera.fov + "°");
  }

  // 如果有模型信息，也输出
  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log("\n📦 模型信息:");
    console.log("- 中心点:", {
      x: parseFloat(center.x.toFixed(2)),
      y: parseFloat(center.y.toFixed(2)),
      z: parseFloat(center.z.toFixed(2)),
    });
    console.log("- 尺寸:", {
      x: parseFloat(size.x.toFixed(2)),
      y: parseFloat(size.y.toFixed(2)),
      z: parseFloat(size.z.toFixed(2)),
    });
    console.log(
      "- 最大尺寸:",
      parseFloat(Math.max(size.x, size.y, size.z).toFixed(2))
    );
  }

  console.log("=".repeat(60));
  console.log("💡 提示: 你可以复制上面的配置值来调整 modelConfig");
  console.log("=".repeat(60));
};

// 切换展厅模型
const switchHall = async () => {
  console.log(`🏛️ 切换到展厅: ${currentHallId.value}`);

  // 清理当前场景
  if (scene && model) {
    scene.remove(model);
    model = null;
  }

  // 清理边界框和坐标轴
  if (boundingBoxHelper) {
    scene.remove(boundingBoxHelper);
    boundingBoxHelper = null;
    showBoundingBox.value = false;
  }

  if (axesHelper) {
    scene.remove(axesHelper);
  }

  // 重新初始化相机FOV（因为不同模型可能有不同的FOV）
  if (camera) {
    camera.fov = modelConfig.value.camera.fov;
    camera.updateProjectionMatrix();
  }

  // 重新加载新模型
  await loadExternalModel();
};

// 保存当前配置
const saveCurrentConfig = () => {
  if (!camera || !controls || !model) {
    console.warn("⚠️ 无法保存配置：模型或相机未初始化");
    return;
  }

  // 获取当前相机状态
  const currentCameraPos = camera.position.clone();
  const currentTarget = controls.target.clone();

  // 获取模型信息
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  // 计算方向向量
  const direction = currentCameraPos.clone().sub(center);
  const distance = direction.length();
  direction.normalize();

  // 计算理论距离和倍数
  const fov = camera.fov * (Math.PI / 180);
  const theoreticalDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  const calculatedMultiplier = distance / theoreticalDistance;

  // 生成新的配置
  const newConfig = {
    position: {
      x: parseFloat((direction.x * 100).toFixed(1)), // 放大100倍便于配置
      y: parseFloat((direction.y * 100).toFixed(1)),
      z: parseFloat((direction.z * 100).toFixed(1)),
    },
    target: { x: 0, y: 0, z: 0 },
    fov: camera.fov,
    autoFit: true,
    fitMultiplier: parseFloat(calculatedMultiplier.toFixed(2)),
  };

  console.log("=".repeat(60));
  console.log("💾 保存当前配置");
  console.log("=".repeat(60));
  console.log("📊 当前状态分析:");
  console.log("- 当前相机位置:", {
    x: parseFloat(currentCameraPos.x.toFixed(4)),
    y: parseFloat(currentCameraPos.y.toFixed(4)),
    z: parseFloat(currentCameraPos.z.toFixed(4)),
  });
  console.log("- 模型中心:", {
    x: parseFloat(center.x.toFixed(4)),
    y: parseFloat(center.y.toFixed(4)),
    z: parseFloat(center.z.toFixed(4)),
  });
  console.log("- 实际距离:", distance.toFixed(4));
  console.log("- 理论距离:", theoreticalDistance.toFixed(4));
  console.log("- 计算倍数:", calculatedMultiplier.toFixed(4));

  console.log("\n🔧 建议的新配置:");
  console.log("camera: {");
  console.log(
    `  position: { x: ${newConfig.position.x}, y: ${newConfig.position.y}, z: ${newConfig.position.z} },`
  );
  console.log(`  target: { x: 0, y: 0, z: 0 },`);
  console.log(`  fov: ${newConfig.fov},`);
  console.log(`  autoFit: true,`);
  console.log(`  fitMultiplier: ${newConfig.fitMultiplier},`);
  console.log("}");

  console.log(
    "\n📋 复制以下配置到 hallModels['" + currentHallId.value + "'].camera:"
  );
  console.log(JSON.stringify(newConfig, null, 2));
  console.log("=".repeat(60));
};

// 重置视角
const resetView = () => {
  if (model && controls) {
    console.log("🔄 重置视角按钮被点击，重新计算最佳视角...");
    setupCameraView(model);
    console.log("✅ 视角已重置到配置的最佳位置");
  }
};

// 切换坐标轴显示
const toggleAxes = () => {
  showAxes.value = !showAxes.value;

  if (showAxes.value) {
    if (axesHelper) {
      scene.add(axesHelper);
    } else {
      createAxesHelper();
    }
    console.log("显示坐标轴 - X轴(红色), Y轴(绿色), Z轴(蓝色)");
  } else {
    if (axesHelper) {
      scene.remove(axesHelper);
    }
    console.log("隐藏坐标轴");
  }
};

// 切换边界框显示
const toggleBoundingBox = () => {
  if (!model) return;

  showBoundingBox.value = !showBoundingBox.value;

  if (showBoundingBox.value) {
    // 创建边界框辅助器
    const box = new THREE.Box3().setFromObject(model);
    boundingBoxHelper = new THREE.Box3Helper(box, 0xff0000); // 红色边界框
    scene.add(boundingBoxHelper);
    console.log("显示边界框");
  } else {
    // 移除边界框
    if (boundingBoxHelper) {
      scene.remove(boundingBoxHelper);
      boundingBoxHelper = null;
      console.log("隐藏边界框");
    }
  }
};

// 切换到程序化场景
const switchToTestScene = () => {
  // 清理当前场景
  if (scene) {
    scene.clear();
    // 重新添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
  }
  createTestScene();
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
  loadExternalModel(); // 改为加载外部模型
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

// 键盘事件监听
const handleKeyPress = (event) => {
  // Ctrl + L 或 Cmd + L: 输出配置
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
    event.preventDefault();
    logCurrentConfig();
  }
  // Ctrl + R 或 Cmd + R: 重置视角 (阻止默认刷新)
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
    event.preventDefault();
    resetView();
  }
  // 按键 'c': 输出配置
  if (event.key.toLowerCase() === "c" && !event.ctrlKey && !event.metaKey) {
    logCurrentConfig();
  }
};

// 处理鼠标点击
const onMouseClick = (event) => {
  // 计算鼠标在标准化设备坐标中的位置
  // (-1 到 +1)
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // 更新射线
  raycaster.setFromCamera(mouse, camera);

  // 获取与射线相交的对象
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    // 如果之前有选中的物体，恢复其材质
    if (selectedObject.value && selectedObject.value.originalMaterial) {
      selectedObject.value.material = selectedObject.value.originalMaterial;
    }

    // 保存新选中物体的原始材质
    if (!clickedObject.originalMaterial) {
      clickedObject.originalMaterial = clickedObject.material.clone();
    }

    // 创建高亮材质
    const highlightMaterial = clickedObject.originalMaterial.clone();
    highlightMaterial.emissive = new THREE.Color(0x666666);
    highlightMaterial.emissiveIntensity = 0.5;

    // 应用高亮材质
    clickedObject.material = highlightMaterial;
    selectedObject.value = clickedObject;

    console.log('点击了模型:', clickedObject.name || '未命名物体');
    // 这里可以添加你的点击处理逻辑
  } else {
    // 如果点击空白处，取消选中
    if (selectedObject.value && selectedObject.value.originalMaterial) {
      selectedObject.value.material = selectedObject.value.originalMaterial;
      selectedObject.value = null;
    }
  }
};

// 给模型的所有子物体添加名称（可选）
const setupModelInteractivity = (object, prefix = '') => {
  let index = 0;
  object.traverse((child) => {
    if (child.isMesh) {
      // 如果物体没有名字，给它一个默认名字
      if (!child.name) {
        child.name = `${prefix}object_${index++}`;
      }
    }
  });
};

// 生命周期
onMounted(() => {
  console.log("🚀 组件挂载，开始初始化...");
  console.log("📋 当前选择的展厅:", currentHallId.value);
  console.log("🏛️ 当前模型配置:", modelConfig.value);

  initThreeJS();
  loadExternalModel(); // 改为加载外部模型

  window.addEventListener("resize", handleResize);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("keydown", handleKeyPress);

  console.log("🎮 键盘快捷键:");
  console.log("- 按 'C' 键: 输出配置信息");
  console.log("- Ctrl/Cmd + L: 输出配置信息");
  console.log("- Ctrl/Cmd + R: 重置视角");
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("keydown", handleKeyPress);
  
  // 移除点击事件监听
  if (renderer) {
    renderer.domElement.removeEventListener('click', onMouseClick);
  }

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
.model-frame {
  position: relative;
  width: 90vw;
  height: 80vh;
  margin: 2rem auto;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.model-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  background: #f8f8f8;
  overflow: hidden;
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

/* 模型选择器样式 */
.model-selector {
  margin: 10px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.model-selector label {
  display: block;
  color: white;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
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

.save-btn {
  background: rgba(40, 167, 69, 0.9) !important;
  color: white !important;
  font-weight: bold;
  border-color: rgba(40, 167, 69, 0.5) !important;
}

.save-btn:hover {
  background: rgba(40, 167, 69, 1) !important;
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
