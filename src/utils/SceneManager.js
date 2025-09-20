import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// 配置常量
const SCENE_CONFIG = {
  // 模型加载配置
  LOAD_TIMEOUT: 30000, // 30秒超时
  DRACO_DECODER_PATHS: [
    "https://www.gstatic.com/draco/v1/decoders/",
    "https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/draco/",
    "/draco/",
  ],
  
  // 光照配置
  LIGHTING: {
    AMBIENT: {
      color: 0xffffff,
      intensity: 0.8
    },
    DIRECTIONAL: {
      color: 0xffffff,
      intensity: 1,
      position: { x: 5, y: 5, z: 5 },
      shadow: {
        mapSize: { width: 2048, height: 2048 },
        camera: { near: 0.5, far: 500 }
      }
    },
    FILL_LIGHT: {
      color: 0xffffff,
      intensity: 0.3,
      position: { x: -5, y: 5, z: -5 }
    }
  }
};



export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    
    // 模型缓存系统
    this.modelCache = new Map();
    this.maxCacheSize = 5; // 最大缓存模型数量
    this.cacheAccessTime = new Map(); // 记录缓存访问时间，用于LRU清理
    
    this.setupScene();
  }

  setupScene() {
    // 移除默认背景色，使用透明背景
    this.scene.background = null;

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(
      SCENE_CONFIG.LIGHTING.AMBIENT.color,
      SCENE_CONFIG.LIGHTING.AMBIENT.intensity
    );
    this.scene.add(ambientLight);

    // 添加主方向光
    const directionalLight = new THREE.DirectionalLight(
      SCENE_CONFIG.LIGHTING.DIRECTIONAL.color,
      SCENE_CONFIG.LIGHTING.DIRECTIONAL.intensity
    );
    const dirPos = SCENE_CONFIG.LIGHTING.DIRECTIONAL.position;
    directionalLight.position.set(dirPos.x, dirPos.y, dirPos.z);
    directionalLight.castShadow = true;

    // 设置阴影属性
    const shadowConfig = SCENE_CONFIG.LIGHTING.DIRECTIONAL.shadow;
    directionalLight.shadow.mapSize.width = shadowConfig.mapSize.width;
    directionalLight.shadow.mapSize.height = shadowConfig.mapSize.height;
    directionalLight.shadow.camera.near = shadowConfig.camera.near;
    directionalLight.shadow.camera.far = shadowConfig.camera.far;
    this.scene.add(directionalLight);

    // 添加辅助光源
    const fillLight = new THREE.DirectionalLight(
      SCENE_CONFIG.LIGHTING.FILL_LIGHT.color,
      SCENE_CONFIG.LIGHTING.FILL_LIGHT.intensity
    );
    const fillPos = SCENE_CONFIG.LIGHTING.FILL_LIGHT.position;
    fillLight.position.set(fillPos.x, fillPos.y, fillPos.z);
    this.scene.add(fillLight);
  }

  /**
   * 管理缓存大小，使用LRU策略清理旧缓存
   */
  manageCacheSize() {
    if (this.modelCache.size <= this.maxCacheSize) {
      return;
    }

    // 找到最久未访问的缓存项
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, time] of this.cacheAccessTime) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      console.log(`清理缓存: ${oldestKey}`);
      const cachedModel = this.modelCache.get(oldestKey);
      if (cachedModel) {
        this.disposeObject(cachedModel, false);
      }
      this.modelCache.delete(oldestKey);
      this.cacheAccessTime.delete(oldestKey);
    }
  }

  /**
   * 克隆缓存的模型
   * @param {THREE.Object3D} originalModel - 原始模型
   * @returns {THREE.Object3D} 克隆的模型
   */
  cloneModel(originalModel) {
    const clonedModel = originalModel.clone(true);
    
    // 深度克隆材质，避免共享材质导致的问题
    clonedModel.traverse((child) => {
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map(mat => mat.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    });
    
    return clonedModel;
  }

  async loadModel(modelPath, onProgress) {
    // 检查缓存
    if (this.modelCache.has(modelPath)) {
      console.log(`从缓存加载模型: ${modelPath}`);
      const cachedModel = this.modelCache.get(modelPath);
      this.cacheAccessTime.set(modelPath, Date.now());
      
      // 模拟进度回调
      if (onProgress && typeof onProgress === "function") {
        setTimeout(() => onProgress({ loaded: 100, total: 100, lengthComputable: true }), 10);
      }
      
      return this.cloneModel(cachedModel);
    }

    console.log(`开始加载新模型: ${modelPath}`);
    
    const loader = new GLTFLoader();
    loader.manager.onError = () => {
      // 资源加载失败时的静默处理
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" }); // 使用JavaScript解码器

    // 优化 Draco 解码器配置
    dracoLoader.setWorkerLimit(4); // 设置工作线程数量
    dracoLoader.preload(); // 预加载解码器

    // 尝试设置Draco解码器路径
    for (const path of SCENE_CONFIG.DRACO_DECODER_PATHS) {
      try {
        dracoLoader.setDecoderPath(path);
        console.log(`使用 Draco 解码器路径: ${path}`);
        break;
      } catch {
        // 路径不可用时继续尝试下一个
      }
    }

    loader.setDRACOLoader(dracoLoader);

    try {
      const gltf = await new Promise((resolve, reject) => {
        let timeoutId = null;

        const cleanup = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        };

        const handleSuccess = (gltf) => {
          cleanup();
          if (!gltf.scene) {
            reject(new Error("加载的模型没有场景对象"));
            return;
          }
          resolve(gltf);
        };

        const handleProgress = (event) => {
          if (onProgress && typeof onProgress === "function") {
            try {
              onProgress(event);
            } catch {
              // 进度回调执行失败时的静默处理
            }
          }
        };

        const handleError = (error) => {
          cleanup();
          reject(new Error(`模型加载失败: ${error.message || "未知错误"}`));
        };

        loader.load(modelPath, handleSuccess, handleProgress, handleError);

        // 设置加载超时
        timeoutId = setTimeout(() => {
          reject(new Error("模型加载超时"));
        }, SCENE_CONFIG.LOAD_TIMEOUT);
      });

      if (!gltf.scene) {
        throw new Error("加载的模型没有场景对象");
      }

      // 将模型添加到缓存
      console.log(`模型加载成功，添加到缓存: ${modelPath}`);
      this.modelCache.set(modelPath, gltf.scene.clone(true));
      this.cacheAccessTime.set(modelPath, Date.now());
      
      // 管理缓存大小
      this.manageCacheSize();

      return gltf.scene;
    } finally {
      dracoLoader.dispose();
    }
  }

  // 递归处理模型属性
  traverseModel(object) {
    if (!object) return;

    // 设置模型及其子元素为可交互
    object.userData = object.userData || {};
    object.userData.clickable = true;

    // 递归处理子对象
    if (object.children && object.children.length > 0) {
      object.children.forEach((child) => this.traverseModel(child));
    }
  }

  /**
   * 释放单个材质的所有纹理资源
   * @param {THREE.Material} material - 要释放的材质
   */
  disposeMaterial(material) {
    if (!material) return;
    
    // 定义需要释放的纹理属性
    const textureProperties = [
      'map', 'lightMap', 'bumpMap', 'normalMap', 
      'specularMap', 'envMap', 'aoMap', 'emissiveMap',
      'metalnessMap', 'roughnessMap', 'alphaMap'
    ];
    
    // 释放所有纹理
    textureProperties.forEach(prop => {
      if (material[prop]) {
        material[prop].dispose();
      }
    });
    
    // 释放材质本身
    material.dispose();
  }

  /**
   * 递归清理资源但保留交互性
   * @param {THREE.Object3D} object - 要清理的3D对象
   * @param {boolean} preserveInteractivity - 是否保留交互性，默认为true
   */
  disposeObject(object, preserveInteractivity = true) {
    if (!object) return;

    // 保存交互相关的属性
    const userData = preserveInteractivity ? object.userData : null;
    const clickable = preserveInteractivity ? object.userData?.clickable : null;

    // 递归处理子对象
    if (object.children && object.children.length > 0) {
      // 创建子对象数组的副本，避免在遍历时修改原数组
      const children = [...object.children];
      children.forEach((child) => this.disposeObject(child, preserveInteractivity));
    }

    // 释放几何体
    if (object.geometry) {
      object.geometry.dispose();
      object.geometry = null;
    }

    // 释放材质
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => this.disposeMaterial(material));
      } else {
        this.disposeMaterial(object.material);
      }
      object.material = null;
    }

    // 清理纹理引用
    if (object.texture) {
      object.texture.dispose();
      object.texture = null;
    }

    // 恢复交互相关的属性（如果需要保留）
    if (preserveInteractivity) {
      object.userData = userData || {};
      if (clickable) {
        object.userData.clickable = clickable;
      }
    } else {
      object.userData = {};
    }
  }

  addObject(object) {
    if (!object || !this.scene) return;
    // 添加对象前设置交互属性
    this.traverseModel(object);
    this.scene.add(object);
  }

  removeObject(object) {
    if (!object || !this.scene) return;
    
    // 从场景中移除对象
    this.scene.remove(object);
    
    // 清理对象的所有资源
    this.disposeObject(object, false);
  }

  /**
   * 安全地移除和清理模型对象
   * @param {THREE.Object3D} model - 要移除的模型对象
   */
  removeModel(model) {
    if (!model || !this.scene) return;
    
    console.log('开始清理模型资源...');
    
    // 从场景中移除
    this.scene.remove(model);
    
    // 深度清理所有资源
    this.disposeObject(model, false);
    
    // 清理模型的父子关系
    if (model.parent) {
      model.parent.remove(model);
    }
    
    // 清空子对象数组
    model.children.length = 0;
    
    console.log('模型资源清理完成');
  }

  clear() {
    console.log('开始清理场景中的所有对象...');
    
    // 创建子对象数组的副本，避免在遍历时修改原数组
    const children = [...this.scene.children];
    
    children.forEach(object => {
      // 跳过光源等系统对象
      if (object.isLight || object.isCamera) {
        return;
      }
      this.removeObject(object);
    });
    
    console.log('场景清理完成');
  }

  /**
   * 清理所有缓存的模型
   */
  clearCache() {
    console.log('开始清理模型缓存...');
    
    for (const model of this.modelCache.values()) {
      this.disposeObject(model, false);
    }
    
    this.modelCache.clear();
    this.cacheAccessTime.clear();
    
    console.log('模型缓存清理完成');
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats() {
    return {
      size: this.modelCache.size,
      maxSize: this.maxCacheSize,
      paths: Array.from(this.modelCache.keys()),
      memoryUsage: this.modelCache.size > 0 ? 'cached models in memory' : 'no cached models'
    };
  }

  dispose() {
    console.log('开始销毁 SceneManager...');
    
    // 清理缓存
    this.clearCache();
    
    // 清理场景
    this.clear();
    
    // 清理场景本身
    if (this.scene) {
      this.scene.dispose?.();
      this.scene = null;
    }
    
    console.log('SceneManager 销毁完成');
  }
}
