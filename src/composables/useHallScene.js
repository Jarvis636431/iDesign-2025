import { ref } from "vue";
import * as THREE from "three";
import { SceneManager } from "../utils/SceneManager";
import { CameraController } from "../utils/CameraController";

export const useHallScene = ({
  modelContainer,
  currentHallInfo,
  cameraDefaults,
  controlsLimits,
  t,
  onResize,
}) => {
  // Three.js 实例变量
  let sceneManager, cameraController, camera, renderer, model;

  // 鼠标交互相关
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let clickableObjects = []; // 存储可点击的对象

  // 响应式状态
  const isLoading = ref(true);
  const hasError = ref(false);
  const errorMessage = ref("");
  const loadingProgress = ref(0);
  const currentModel = ref(null);

  // 渲染优化状态
  const needsRender = ref(true);
  const isPageVisible = ref(true);
  let animationId = null;
  let lastRenderTime = 0;
  const RENDER_THROTTLE = 16; // 约60fps

  const requestRender = () => {
    needsRender.value = true;
  };

  const updateModelInfo = () => {
    if (!currentHallInfo.value) return;
    currentModel.value = {
      name: t(`halls.${currentHallInfo.value.i18nKey}.name`),
      description: t(`halls.${currentHallInfo.value.i18nKey}.subTitle`),
      ...currentHallInfo.value.model,
    };
  };

  const setupCameraView = () => {
    if (!camera || !model || !currentHallInfo.value?.model) {
      return;
    }

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
    }
  };

  const setupClickableObjects = () => {
    if (!model) return;

    // 清空之前的可点击对象
    clickableObjects = [];

    let objectIndex = 0;

    // 遍历模型的所有子对象，将它们添加到可点击对象列表中
    model.traverse((child) => {
      if (child.isMesh) {
        // 为每个网格对象添加用户数据，用于识别
        child.userData.clickable = true;
        child.userData.originalColor = child.material.color
          ? child.material.color.clone()
          : null;

        // 添加唯一标识符
        child.userData.objectId = `object_${objectIndex++}`;
        child.userData.objectType = child.material?.name || "unknown";
        child.userData.meshIndex = objectIndex - 1;

        // 如果对象没有名称，给它一个默认名称
        if (!child.name) {
          child.name = `Mesh_${objectIndex - 1}`;
        }

        // 添加对象的几何信息
        child.userData.geometryInfo = {
          vertices: child.geometry?.attributes?.position?.count || 0,
          faces: child.geometry?.index ? child.geometry.index.count / 3 : 0,
          boundingBox: child.geometry?.boundingBox || null,
        };

        clickableObjects.push(child);
      }
    });
  };

  const setupModel = () => {
    if (!model || !currentHallInfo.value?.model) {
      return;
    }

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

    // 设置可点击对象
    setupClickableObjects();
  };

  const initScene = async () => {
    if (!modelContainer.value) {
      throw new Error("模型容器未就绪");
    }

    // 创建场景管理器
    sceneManager = new SceneManager(modelContainer.value);
    // 设置白色背景
    sceneManager.scene.background = new THREE.Color(0xffffff);

    // 创建相机
    camera = new THREE.PerspectiveCamera(
      cameraDefaults.fov,
      window.innerWidth / window.innerHeight,
      cameraDefaults.near,
      cameraDefaults.far
    );
    camera.position.set(0, cameraDefaults.eyeHeight, 5);

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xffffff, 1); // 设置白色背景

    if (sceneManager) {
      sceneManager.setRenderer(renderer);
    }

    // 清除之前的渲染器
    if (modelContainer.value.children.length > 0) {
      modelContainer.value.innerHTML = "";
    }

    modelContainer.value.appendChild(renderer.domElement);

    // 创建相机控制器
    cameraController = new CameraController(camera, renderer.domElement);

    // 设置控制器初始配置
    if (controlsLimits) {
      Object.assign(cameraController.controls, controlsLimits);
    }

    return Promise.resolve();
  };

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
      hasError.value = true;
      errorMessage.value = `模型加载失败: ${error.message || "未知错误"}`;
      isLoading.value = false;
    }
  };

  const onMouseClick = (event) => {
    if (!renderer || !camera) return;
    // 计算鼠标位置（标准化设备坐标）
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 更新射线
    raycaster.setFromCamera(mouse, camera);

    // 检测与可点击对象的交集
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      handleObjectClick(clickedObject);
      // 点击后需要重新渲染以显示效果
      requestRender();
    }
  };

  const handleObjectClick = (object) => {
    // 根据对象ID执行不同的交互逻辑
    handleObjectInteraction(object);

    // 添加点击效果 - 改变颜色
    if (object.material && object.material.color) {
      // 保存原始颜色
      if (!object.userData.originalColor) {
        object.userData.originalColor = object.material.color.clone();
      }

      // 根据对象类型使用不同的高亮颜色
      const highlightColor = getHighlightColorByType(object.userData.objectType);
      object.material.color.setHex(highlightColor);

      // 1秒后恢复原始颜色
      setTimeout(() => {
        if (object.userData.originalColor) {
          object.material.color.copy(object.userData.originalColor);
        }
      }, 1000);
    }

    // 显示对象信息
    showObjectInfo(object);
  };

  const getHighlightColorByType = (objectType) => {
    const colorMap = {
      unknown: 0xff6b6b, // 红色
      metal: 0x6b9eff, // 蓝色
      wood: 0xffb366, // 橙色
      glass: 0x66ffb3, // 绿色
      fabric: 0xff66ff, // 紫色
      plastic: 0xffff66, // 黄色
    };
    return colorMap[objectType] || 0xff6b6b;
  };

  const handleObjectInteraction = (object) => {
    const objectId = object.userData.objectId;
    const objectType = object.userData.objectType;

    // 根据对象ID或类型执行不同的逻辑
    switch (objectType) {
      case "metal":
        break;
      case "wood":
        break;
      case "glass":
        break;
      default:
    }

    // 也可以根据具体的对象ID执行特定逻辑
    if (objectId === "object_0") {
      // 
    }
  };

  const showObjectInfo = (object) => {
    const objectInfo = {
      name: object.name || "未命名对象",
      id: object.userData.objectId,
      type: object.userData.objectType,
      index: object.userData.meshIndex,
      uuid: object.uuid,
      vertices: object.userData.geometryInfo.vertices,
      faces: object.userData.geometryInfo.faces,
    };

    const message = `您点击了: ${objectInfo.name} (ID: ${objectInfo.id})`;

    // 这里可以显示一个信息提示
    // 可以使用 Vue 的响应式数据来显示信息面板

    // 示例：显示浏览器原生提示（实际项目中可以用更好的UI组件）
    // alert(message);
    void message;
  };

  // 节流处理鼠标移动事件
  let mouseMoveThrottleId = null;
  const MOUSE_MOVE_THROTTLE = 50; // 50ms节流

  const handleMouseMove = (event) => {
    if (!renderer || !camera) return;
    // 计算鼠标位置
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 更新射线
    raycaster.setFromCamera(mouse, camera);

    // 检测悬停对象
    const intersects = raycaster.intersectObjects(clickableObjects);

    let hasChanges = false;

    // 重置所有对象的悬停状态
    clickableObjects.forEach((obj) => {
      if (obj.userData.isHovered) {
        obj.userData.isHovered = false;
        // 恢复原始颜色（如果不是被点击状态）
        if (obj.userData.originalColor && obj.material && obj.material.color) {
          obj.material.color.copy(obj.userData.originalColor);
          hasChanges = true;
        }
      }
    });

    // 设置悬停对象的高亮效果
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      hoveredObject.userData.isHovered = true;

      // 改变鼠标样式
      renderer.domElement.style.cursor = "pointer";

      // 轻微高亮效果
      if (hoveredObject.material && hoveredObject.material.color) {
        if (!hoveredObject.userData.originalColor) {
          hoveredObject.userData.originalColor =
            hoveredObject.material.color.clone();
        }
        // 轻微提亮
        const brightColor = hoveredObject.userData.originalColor.clone();
        brightColor.multiplyScalar(1.2); // 提亮20%
        hoveredObject.material.color.copy(brightColor);
        hasChanges = true;
      }
    } else {
      // 恢复默认鼠标样式
      renderer.domElement.style.cursor = "default";
    }

    // 只有在有变化时才请求重新渲染
    if (hasChanges) {
      requestRender();
    }
  };

  const onMouseMove = (event) => {
    // 节流处理，避免过度计算射线检测
    if (mouseMoveThrottleId) {
      clearTimeout(mouseMoveThrottleId);
    }

    mouseMoveThrottleId = setTimeout(() => {
      handleMouseMove(event);
    }, MOUSE_MOVE_THROTTLE);
  };

  const animate = (currentTime = 0) => {
    if (!isPageVisible.value) {
      // 页面不可见时暂停渲染
      animationId = null;
      return;
    }

    // 节流渲染，避免过度渲染
    if (currentTime - lastRenderTime < RENDER_THROTTLE) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    let shouldRender = needsRender.value;

    // 检查相机控制器是否需要更新
    if (cameraController) {
      const cameraChanged = cameraController.update();
      if (cameraChanged) {
        shouldRender = true;
      }
    }

    // 只在需要时渲染
    if (shouldRender && renderer && sceneManager && camera) {
      renderer.render(sceneManager.scene, camera);
      needsRender.value = false;
      lastRenderTime = currentTime;
    }

    // 继续动画循环
    animationId = requestAnimationFrame(animate);
  };

  const startRenderLoop = () => {
    if (!animationId) {
      animationId = requestAnimationFrame(animate);
    }
  };

  const stopRenderLoop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const handleResize = () => {
    if (!camera || !renderer || !modelContainer.value) return;

    if (onResize) {
      onResize();
    }

    // 更新相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // 更新渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 窗口大小变化时需要重新渲染
    requestRender();
  };

  const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden;
    if (isPageVisible.value) {
      // 页面变为可见时恢复渲染
      requestRender();
      startRenderLoop();
    } else {
      // 页面隐藏时停止渲染
      stopRenderLoop();
    }
  };

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

    // 虚拟按键操作后请求重新渲染
    requestRender();
  };

  const clearModel = () => {
    // 保存当前模型引用并彻底清理
    const oldModel = model;
    model = null;

    if (oldModel) {
      // 清空可点击对象数组
      clickableObjects = [];

      // 使用增强的模型清理方法
      sceneManager.removeModel(oldModel);

      // 强制垃圾回收提示
      if (window.gc) {
        window.gc();
      }
    }
  };

  const dispose = () => {
    stopRenderLoop();

    if (mouseMoveThrottleId) {
      clearTimeout(mouseMoveThrottleId);
      mouseMoveThrottleId = null;
    }

    // 移除鼠标事件监听器
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener("click", onMouseClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
    }

    // 清理Three.js资源
    if (cameraController) {
      cameraController.dispose();
    }
    if (sceneManager) {
      sceneManager.dispose();
    }
    if (renderer) {
      renderer.dispose();
    }

    // 清理可点击对象数组
    clickableObjects = [];
  };

  const bindMouseEvents = () => {
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener("click", onMouseClick);
      renderer.domElement.addEventListener("mousemove", onMouseMove);
    }
  };

  return {
    isLoading,
    hasError,
    errorMessage,
    loadingProgress,
    currentModel,
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
    requestRender,
  };
};
