// 展厅模型配置
export const hallModels = {
  // 第一个展厅
  hall1: {
    id: 73,
    name: "第一展厅",
    description: "First Whisper 展厅模型",
    path: "assets/models/hall-models/1.glb",
    scale: 50, // 增大整体模型的比例
    position: { x: -0.2, y: -0.4, z: -1 },
    rotation: { x: 0, y: -0.6, z: 0 },
    camera: {
      position: { x: 0.2, y: 2, z: -0.3 }, // 相机位置设置为更容易理解的实际尺寸
      target: { x: 0.2, y: 0, z: -0.3 }, // 看向展厅中心
      rotation: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: false, // 关闭自动适应，使用固定比例
      fitMultiplier: 1,
    },
  },
  // 第二个展厅
  hall2: {
    id: 74,
    name: "第二展厅",
    description: "Second Whisper 展厅模型",
    path: "assets/models/hall-models/2.glb",
    scale: 50, // 增大整体模型的比例
    position: { x: -0.2, y: -0.4, z: -1 },
    rotation: { x: 0, y: -0.6, z: 0 },
    camera: {
      position: { x: 0.2, y: 2, z: -0.3 }, // 相机位置设置为更容易理解的实际尺寸
      target: { x: 0.2, y: 0, z: -0.3 }, // 看向展厅中心
      rotation: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: false, // 关闭自动适应，使用固定比例
      fitMultiplier: 1,
    },
  },
  // 第三个展厅
  hall3: {
    id: 75,
    name: "第三展厅",
    description: "Unveiled Horizons 展厅模型",
    path: "assets/models/hall-models/3.glb",
    scale: 0.9, // 增大整体模型的比例
    position: { x: 0, y: -0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    camera: {
      position: { x: 0, y: 0, z: 0 }, // 相机位置设置为更容易理解的实际尺寸
      target: { x: 0.4, y: 0, z: 0 }, // 看向展厅中心
      rotation: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: false, // 关闭自动适应，使用固定比例
      fitMultiplier: 1,
    },
  },
  // 第四个展厅
  hall4: {
    id: 76,
    name: "第四展厅",
    description: "Winding Trails 展厅模型",
    path: "assets/models/hall-models/4.glb",
    scale: 100, // 增大整体模型的比例
    position: { x: 2, y: -0.4, z: 0 },
    rotation: { x: 0, y: -0.6, z: 0 },
    camera: {
      position: { x: 0.2, y: 2, z: -0.3 }, // 相机位置设置为更容易理解的实际尺寸
      target: { x: 0.2, y: 0, z: -0.3 }, // 看向展厅中心
      rotation: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: false, // 关闭自动适应，使用固定比例
      fitMultiplier: 1,
    },
  },
  // 第五个展厅
  hall5: {
    id: 77,
    name: "第五展厅",
    description: "Crowned Woods 展厅模型",
    path: "assets/models/hall-models/5.glb",
    scale: 0.05, // 增大整体模型的比例
    position: { x: 0.7, y: -0.3, z: -1 },
    rotation: { x: 0, y: -0.6, z: 0 },
    camera: {
      position: { x: 0.2, y: 0, z: -0.3 }, // 相机位置设置为更容易理解的实际尺寸
      target: { x: 0.2, y: 0, z: -0.3 }, // 看向展厅中心
      rotation: { x: 0, y: 0, z: 0 },
      fov: 45,
      autoFit: false, // 关闭自动适应，使用固定比例
      fitMultiplier: 1,
    },
  },
};

// 相机控制配置
export const cameraDefaults = {
  fov: 75, // 增大视场角以看到更多内容
  near: 0.001,
  far: 1000,
  eyeHeight: 1.6, // 保持标准人眼高度
  moveSpeed: 0.01, // 增加移动速度，使移动更流畅
  rotateSpeed: 0.5,
  dampingFactor: 0.05,
};

// 控制器限制配置
export const controlsLimits = {
  minPolarAngle: Math.PI / 2, // 90度，锁定视角水平
  maxPolarAngle: Math.PI / 2, // 90度，锁定视角水平
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,
  enableZoom: false, // 禁用缩放
  enablePan: false, // 禁用平移
  minDistance: 3, // 保持最小距离限制
  maxDistance: 30, // 保持最大距离限制
};
