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
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    try {
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
      );
    } catch (error) {
      console.warn("CDN Draco路径不可用，尝试使用备用路径");
      dracoLoader.setDecoderPath(
        "https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/draco/"
      );
    }

    loader.setDRACOLoader(dracoLoader);

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(modelPath, resolve, onProgress, reject);
      });

      return gltf.scene;
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
