// 展厅模型配置
export const hallModels = {
  // 第一个展厅
  hall1: {
    id: "hall1",
    name: "第一展厅",
    description: "First Whisper 展厅模型",
    path: "assets/models/hall-models/1-first-whisper-with-exhibits-edited.glb",
    scale: 1,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    camera: {
      position: { x: -0.055, y: 0.004, z: -0.0055 }, // 把距离减半，更靠近模型
      target: { x: 0, y: 0, z: 0 },
      rotation: { x: -3.139, y: -1.046, z: -3.139 },
      fov: 85, // 稍微增加视场角
      autoFit: true,
      fitMultiplier: 2, // 增大显示尺寸
    },
  },
  // 其他展厅配置...
};

// 相机控制配置
export const cameraDefaults = {
  fov: 45,
  near: 0.1,
  far: 1000,
  eyeHeight: 1.6,
  moveSpeed: 0.005, // 减小移动速度，使移动更精确
  rotateSpeed: 0.5,
  dampingFactor: 0.05,
};

// 控制器限制配置
export const controlsLimits = {
  minPolarAngle: Math.PI / 6, // 30度，允许更高的视角
  maxPolarAngle: (Math.PI * 5) / 6, // 150度，允许更低的视角
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,
  enableZoom: true,
  enablePan: true,
  minDistance: 3, // 允许更近的距离
  maxDistance: 30, // 限制最远距离以防模型太小
};
