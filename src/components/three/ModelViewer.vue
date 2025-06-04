<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const props = defineProps({
  modelUrl: {
    type: String,
    required: true
  }
});

const container = ref(null);
let scene, camera, renderer, controls;

// 初始化Three.js场景
// 清理现有场景
const cleanupScene = () => {
  if (scene) {
    while(scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }
  if (renderer && container.value) {
    // 彻底清理 container 的所有子节点
    while (container.value.firstChild) {
      container.value.removeChild(container.value.firstChild);
    }
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
};

const initThree = () => {
  // 如果已存在场景，先清理
  cleanupScene();
  
  scene = new THREE.Scene();
  
  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 设置渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setClearColor(0xeeeeee, 1);
  container.value.appendChild(renderer.domElement);

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  // 添加环境光和方向光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 配置 GLTFLoader 支持 Draco
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  // 推荐使用 three.js 官方 CDN
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);

  // 加载3D模型
  loader.load(
    props.modelUrl,
    (gltf) => {
      scene.add(gltf.scene);
      
      // 自动调整相机位置以适应模型大小
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
      
      camera.position.z = cameraZ * 1.5;
      
      // 将模型居中
      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;
      
      controls.update();
    },
    undefined,
    (error) => {
      console.error('模型加载失败:', error);
    }
  );
};

let animationId;

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  if (controls) controls.update();
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (camera && renderer && container.value) {
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  }
};

import { watch } from 'vue';

// 尝试初始化 Three.js
const tryInitThree = async () => {
  await nextTick();
  if (!container.value) return;
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;
  if (w === 0 || h === 0) {
    requestAnimationFrame(tryInitThree); // 容器未布局好，延迟重试
    return;
  }
  // 先清理所有子节点，防止canvas残留
  while (container.value.firstChild) {
    container.value.removeChild(container.value.firstChild);
  }
  initThree();
};

// 监听 modelUrl 的变化
watch(() => props.modelUrl, async () => {
  if (container.value) {
    cleanupScene(); // 先彻底清理
    await tryInitThree();
    setTimeout(() => {
      if (renderer && container.value) {
        renderer.setSize(container.value.clientWidth, container.value.clientHeight);
      }
    }, 120);
  }
}, { immediate: true });

onMounted(async () => {
  await tryInitThree();
  animate();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (animationId) cancelAnimationFrame(animationId);
  cleanupScene();
});
</script>

<template>
  <div ref="container" class="model-viewer"></div>
</template>

<style scoped>
.model-viewer {
  width: 100%;
  height: 100%;
  background: #eee;
  border-radius: 10px;
}
</style>
