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
      position: { x: -0.7, y: 1.6, z: -22 },
      target: { x: 0, y: 1.6, z: 0 },
      fov: 50,
      autoFit: true,
      fitMultiplier: 0.52,
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
  moveSpeed: 0.05,
  rotateSpeed: 0.5,
  dampingFactor: 0.05
};

// 控制器限制配置
export const controlsLimits = {
  minPolarAngle: Math.PI / 2,  // 90度
  maxPolarAngle: Math.PI / 2,  // 90度
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,
  enableZoom: false,
  enablePan: false
};
