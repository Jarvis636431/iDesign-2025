export const cameraDefaults = {
  fov: 75, // 增大视场角以看到更多内容
  near: 0.001,
  far: 1000,
  eyeHeight: 1.6, // 保持标准人眼高度
  moveSpeed: 0.03, // 增加移动速度，使移动更流畅
  rotateSpeed: 0.5,
  dampingFactor: 0.05,
};

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
