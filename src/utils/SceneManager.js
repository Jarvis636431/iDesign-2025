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

  async loadModel(modelPath, onProgress) {
    const loader = new GLTFLoader();
    loader.manager.onError = (url) => {
      // 资源加载失败时的静默处理
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" }); // 使用JavaScript解码器

    // 尝试设置Draco解码器路径
    let dracoPathSet = false;
    for (const path of SCENE_CONFIG.DRACO_DECODER_PATHS) {
      try {
        dracoLoader.setDecoderPath(path);
        dracoPathSet = true;
        break;
      } catch (error) {
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
            } catch (error) {
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

      return gltf.scene;
    } catch (error) {
      throw error;
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
   */
  disposeObject(object) {
    if (!object) return;

    // 保存交互相关的属性
    const userData = object.userData;
    const clickable = object.userData?.clickable;

    // 递归处理子对象
    if (object.children && object.children.length > 0) {
      object.children.forEach((child) => this.disposeObject(child));
    }

    // 释放几何体
    if (object.geometry) {
      object.geometry.dispose();
    }

    // 释放材质
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => this.disposeMaterial(material));
      } else {
        this.disposeMaterial(object.material);
      }
    }

    // 恢复交互相关的属性
    object.userData = userData;
    if (clickable) {
      object.userData.clickable = clickable;
    }
  }

  addObject(object) {
    if (!object || !this.scene) return;
    // 添加对象前设置交互属性
    this.traverseModel(object);
    this.scene.add(object);
  }

  removeObject(object) {
    if (!object) return;
    this.scene.remove(object);
  }

  clear() {
    // 清理场景中的所有对象
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      this.removeObject(object);
    }
  }

  dispose() {
    this.clear();
    this.scene = null;
  }
}
