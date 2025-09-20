// 展厅基础信息和模型配置
export const halls = [
  {
    id: 73,
    i18nKey: "73",
    color: "#2FA3B0",
    backgroundColor: "#D5f7ec",
    icon:
      import.meta.env.BASE_URL + "assets/images/halls/hall-icons/icon73.png",
    logo:
      import.meta.env.BASE_URL + "assets/images/halls/hall-logos/hall-73.png",
    border:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/border73.png",
    mobileBorder:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/mobile-border73.png",
    backgroundImage:
      import.meta.env.BASE_URL + "assets/images/halls/hall-bgs/73.png",
    // 整合模型配置
    model: {
      path: "assets/models/hall-models/1.glb",
      scale: 50,
      position: { x: -0.2, y: -0.4, z: -1 },
      rotation: { x: 0, y: -0.6, z: 0 },
      camera: {
        position: { x: 0.2, y: 2, z: -0.3 },
        target: { x: 0.2, y: 0, z: -0.3 },
        rotation: { x: 0, y: 0, z: 0 },
        fov: 45,
        autoFit: false,
        fitMultiplier: 1,
      },
    },
  },
  {
    id: 74,
    i18nKey: "74",
    color: "#6CB130",
    backgroundColor: "#e6f2c6",
    icon:
      import.meta.env.BASE_URL + "assets/images/halls/hall-icons/icon74.png",
    logo:
      import.meta.env.BASE_URL + "assets/images/halls/hall-logos/hall-74.png",
    border:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/border74.png",
    mobileBorder:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/mobile-border74.png",
    backgroundImage:
      import.meta.env.BASE_URL + "assets/images/halls/hall-bgs/74.png",
    model: {
      path: "assets/models/hall-models/2.glb",
      scale: 250, // 增加模型大小
      position: { x: 40, y: -2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }, // 重置模型旋转
      camera: {
        position: { x: 3, y: 2, z: 0 }, // 将相机拉近，调整到更合适的观看距离
        target: { x: 0, y: 0, z: 0 }, // 将目标点对准模型中心
        rotation: { x: 0, y: 0, z: 0 },
        fov: 45,
        autoFit: false,
        fitMultiplier: 1,
      },
    },
  },
  {
    id: 75,
    i18nKey: "75",
    color: "#F6c345",
    backgroundColor: "#fefbe6",
    icon:
      import.meta.env.BASE_URL + "assets/images/halls/hall-icons/icon75.png",
    logo:
      import.meta.env.BASE_URL + "assets/images/halls/hall-logos/hall-75.png",
    border:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/border75.png",
    mobileBorder:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/mobile-border75.png",
    backgroundImage:
      import.meta.env.BASE_URL + "assets/images/halls/hall-bgs/75.png",
    model: {
      path: "assets/models/hall-models/3.glb",
      scale: 0.9, // 修正缩放比例
      position: { x: 0, y: -0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      camera: {
        position: { x: 0, y: 0, z: 0 },
        target: { x: 0.4, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        fov: 45,
        autoFit: false,
        fitMultiplier: 1,
      },
    },
  },
  {
    id: 76,
    i18nKey: "76",
    color: "#4950A0",
    backgroundColor: "#e2daf3",
    icon:
      import.meta.env.BASE_URL + "assets/images/halls/hall-icons/icon76.png",
    logo:
      import.meta.env.BASE_URL + "assets/images/halls/hall-logos/hall-76.png",
    border:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/border76.png",
    mobileBorder:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/mobile-border76.png",
    backgroundImage:
      import.meta.env.BASE_URL + "assets/images/halls/hall-bgs/76.png",
    model: {
      path: "assets/models/hall-models/4.glb",
      scale: 1000, // 增加模型大小
      position: { x: 0, y: 0, z: 0 }, // 模型居中
      rotation: { x: 0, y: -2.9, z: 0 }, // 水平面内顺时针旋转约45度
      camera: {
        position: { x: 0, y: 1, z: 0 }, // 进一步拉近相机距离，降低视角高度
        target: { x: 0, y: 0, z: 0 }, // 将视角对准模型中心
        rotation: { x: 0, y: 0, z: 0 },
        fov: 45,
        autoFit: false,
        fitMultiplier: 1,
      },
    },
  },
  {
    id: 77,
    i18nKey: "77",
    color: "#E77E37",
    backgroundColor: "#ffe9d5",
    icon:
      import.meta.env.BASE_URL + "assets/images/halls/hall-icons/icon77.png",
    logo:
      import.meta.env.BASE_URL + "assets/images/halls/hall-logos/hall-77.png",
    border:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/border77.png",
    mobileBorder:
      import.meta.env.BASE_URL +
      "assets/images/halls/hall-borders/mobile-border77.png",
    backgroundImage:
      import.meta.env.BASE_URL + "assets/images/halls/hall-bgs/77.png",
    model: {
      path: "assets/models/hall-models/5.glb",
      scale: 0.05, // 修正缩放比例
      position: { x: 0.7, y: -0.3, z: -1 },
      rotation: { x: 0, y: -0.6, z: 0 },
      camera: {
        position: { x: 0.2, y: 0, z: -0.3 },
        target: { x: 0.2, y: 0, z: -0.3 },
        rotation: { x: 0, y: 0, z: 0 },
        fov: 45,
        autoFit: false,
        fitMultiplier: 1,
      },
    },
  },
];

// 更新相机默认配置
export const cameraDefaults = {
  fov: 75, // 增大视场角以看到更多内容
  near: 0.001,
  far: 1000,
  eyeHeight: 1.6, // 保持标准人眼高度
  moveSpeed: 0.03, // 增加移动速度，使移动更流畅
  rotateSpeed: 0.5,
  dampingFactor: 0.05,
};

// 更新控制器限制配置
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

// 根据展厅编号获取展厅信息
export function getHallByNumber(number) {
  if (!number || number < 1 || number > halls.length) {
    return null;
  }
  return halls[number - 1];
}

// 根据展厅ID获取展厅信息
export function getHallById(id) {
  return halls.find((hall) => hall.id === id) || null;
}
