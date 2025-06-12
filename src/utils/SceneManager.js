import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.setupScene();
  }

  setupScene() {
    this.scene.background = new THREE.Color(0xf0f0f0);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  async loadModel(modelPath, onProgress) {
    console.log("开始加载模型:", modelPath);

    const loader = new GLTFLoader();
    loader.manager.onError = (url) => {
      console.error("资源加载失败:", url);
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: "js" }); // 使用JavaScript解码器

    const DRACO_PATHS = [
      "https://www.gstatic.com/draco/v1/decoders/",
      "https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/draco/",
      "/draco/",
    ];

    // 尝试设置Draco解码器路径
    let dracoPathSet = false;
    for (const path of DRACO_PATHS) {
      try {
        console.log("尝试使用Draco解码器路径:", path);
        dracoLoader.setDecoderPath(path);
        dracoPathSet = true;
        console.log("成功设置Draco解码器路径:", path);
        break;
      } catch (error) {
        console.warn(`Draco解码器路径 ${path} 不可用:`, error);
      }
    }

    if (!dracoPathSet) {
      console.warn("所有Draco解码器路径都不可用，将尝试不使用Draco加载模型");
    }

    loader.setDRACOLoader(dracoLoader);

    try {
      const gltf = await new Promise((resolve, reject) => {
        const timeoutDuration = 30000; // 30秒超时
        let timeoutId = null;

        const cleanup = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        };

        const handleSuccess = (gltf) => {
          cleanup();
          console.log("模型加载成功:", modelPath);
          if (!gltf.scene) {
            reject(new Error("加载的模型没有场景对象"));
            return;
          }
          resolve(gltf);
        };

        const handleProgress = (event) => {
          if (onProgress && typeof onProgress === "function") {
            try {
              console.log(
                "加载进度:",
                Math.round(event.loaded / 1024),
                "KB /",
                event.total
                  ? Math.round(event.total / 1024) + "KB"
                  : "未知大小",
                event.lengthComputable
                  ? `(${Math.round((event.loaded / event.total) * 100)}%)`
                  : ""
              );
              onProgress(event);
            } catch (error) {
              console.warn("进度回调执行失败:", error);
            }
          }
        };

        const handleError = (error) => {
          cleanup();
          console.error("模型加载失败:", error);
          console.error("模型路径:", modelPath);
          reject(new Error(`模型加载失败: ${error.message || "未知错误"}`));
        };

        loader.load(modelPath, handleSuccess, handleProgress, handleError);

        // 设置加载超时
        timeoutId = setTimeout(() => {
          console.error("模型加载超时:", modelPath);
          reject(new Error("模型加载超时"));
        }, timeoutDuration);
      });

      if (!gltf.scene) {
        throw new Error("加载的模型没有场景对象");
      }

      console.log("成功获取模型场景对象");
      return gltf.scene;
    } catch (error) {
      console.error("模型加载过程出错:", error);
      throw error;
    } finally {
      dracoLoader.dispose();
    }
  }

  addObject(object) {
    this.scene.add(object);
  }

  removeObject(object) {
    this.scene.remove(object);
  }

  clear() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  dispose() {
    this.clear();
    // Add any additional cleanup here
  }
}
