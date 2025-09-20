import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cameraDefaults } from "../constants/halls";

// 相机控制器配置常量
const CAMERA_CONFIG = {
  // OrbitControls 配置
  MIN_DISTANCE: 0.01,
  MAX_DISTANCE: 0.5,
  POLAR_ANGLE: Math.PI / 2, // 90度，固定水平视角
  
  // 移动边界配置
  MOVEMENT_BOUNDS: {
    minX: -50,
    maxX: 50,
    minZ: -50,
    maxZ: 50
  }
};

/**
 * 相机控制器类
 * 提供第一人称视角的相机控制功能，支持鼠标旋转和键盘移动
 */
export class CameraController {
  /**
   * 构造函数
   * @param {THREE.Camera} camera - Three.js相机对象
   * @param {HTMLElement} domElement - DOM元素，用于绑定事件
   */
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.moveState = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    };

    // 复用的向量对象，减少GC压力
    this.forwardVector = new THREE.Vector3();
    this.rightVector = new THREE.Vector3();
    this.tempVector = new THREE.Vector3();

    // 绑定事件处理函数，确保正确的this上下文
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);

    this.setupControls();
    this.setupEventListeners();
  }

  /**
   * 设置OrbitControls的各项参数
   */
  setupControls() {
    // 基本设置
    this.controls.enableDamping = false; // 禁用阻尼效果
    this.controls.dampingFactor = 0;

    // 启用鼠标旋转
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = cameraDefaults.rotateSpeed; // 使用配置中的旋转速度

    // 禁用缩放
    this.controls.enableZoom = false;
    this.controls.minDistance = CAMERA_CONFIG.MIN_DISTANCE;
    this.controls.maxDistance = CAMERA_CONFIG.MAX_DISTANCE;

    // 固定视角
    this.controls.minPolarAngle = CAMERA_CONFIG.POLAR_ANGLE; // 90度，固定水平视角
    this.controls.maxPolarAngle = CAMERA_CONFIG.POLAR_ANGLE; // 90度，固定水平视角

    // 禁用平移
    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 键盘事件监听，使用预绑定的函数引用
    window.addEventListener("keydown", this.boundHandleKeyDown);
    window.addEventListener("keyup", this.boundHandleKeyUp);
  }

  /**
   * 处理键盘按下事件
   * @param {KeyboardEvent} event - 键盘事件对象
   */
  handleKeyDown(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveState.moveForward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.moveState.moveBackward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.moveState.moveLeft = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.moveState.moveRight = true;
        break;
    }
  }

  /**
   * 处理键盘释放事件
   * @param {KeyboardEvent} event - 键盘事件对象
   */
  handleKeyUp(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveState.moveForward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.moveState.moveBackward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.moveState.moveLeft = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.moveState.moveRight = false;
        break;
    }
  }

  /**
   * 约束相机位置在指定边界内
   */
  clampCameraPosition() {
    const pos = this.camera.position;
    const target = this.controls.target;
    const bounds = CAMERA_CONFIG.MOVEMENT_BOUNDS;
    
    // 约束相机位置
    pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x));
    pos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.z));
    
    // 约束目标位置
    target.x = Math.max(bounds.minX, Math.min(bounds.maxX, target.x));
    target.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, target.z));
  }

  /**
   * 更新相机位置和控制器状态
   * 每帧调用此方法来处理键盘输入和相机移动
   * @returns {boolean} 是否发生了变化，需要重新渲染
   */
  update() {
    if (!this.camera || !this.controls) return false;

    let hasChanged = false;

    // 复用向量对象，减少GC压力
    // 获取相机前进方向（去掉y分量，保持水平移动）
    this.forwardVector.set(0, 0, -1);
    this.forwardVector.applyQuaternion(this.camera.quaternion);
    this.forwardVector.y = 0;
    this.forwardVector.normalize();

    // 计算右方向
    this.rightVector.set(1, 0, 0);
    this.rightVector.applyQuaternion(this.camera.quaternion);
    this.rightVector.y = 0;
    this.rightVector.normalize();

    // 记录相机位置变化前的状态
    const oldPosition = this.camera.position.clone();
    const oldTarget = this.controls.target.clone();

    // 根据按键状态更新相机位置
    if (this.moveState.moveForward) {
      this.tempVector.copy(this.forwardVector).multiplyScalar(cameraDefaults.moveSpeed);
      this.camera.position.add(this.tempVector);
      this.controls.target.add(this.tempVector);
      hasChanged = true;
    }
    if (this.moveState.moveBackward) {
      this.tempVector.copy(this.forwardVector).multiplyScalar(-cameraDefaults.moveSpeed);
      this.camera.position.add(this.tempVector);
      this.controls.target.add(this.tempVector);
      hasChanged = true;
    }
    if (this.moveState.moveLeft) {
      this.tempVector.copy(this.rightVector).multiplyScalar(-cameraDefaults.moveSpeed);
      this.camera.position.add(this.tempVector);
      this.controls.target.add(this.tempVector);
      hasChanged = true;
    }
    if (this.moveState.moveRight) {
      this.tempVector.copy(this.rightVector).multiplyScalar(cameraDefaults.moveSpeed);
      this.camera.position.add(this.tempVector);
      this.controls.target.add(this.tempVector);
      hasChanged = true;
    }

    // 约束相机位置在边界内
    this.clampCameraPosition();

    // 检查 OrbitControls 是否有变化
    const controlsChanged = this.controls.update();
    if (controlsChanged) {
      hasChanged = true;
    }

    // 检查位置是否真的发生了变化（考虑边界约束）
    if (!hasChanged) {
      hasChanged = !oldPosition.equals(this.camera.position) || !oldTarget.equals(this.controls.target);
    }

    return hasChanged;
  }

  /**
   * 清理资源，移除事件监听器
   * 在组件销毁时调用，防止内存泄漏
   */
  dispose() {
    // 使用预绑定的函数引用正确移除事件监听器
    window.removeEventListener("keydown", this.boundHandleKeyDown);
    window.removeEventListener("keyup", this.boundHandleKeyUp);
    
    // 清理OrbitControls
    this.controls.dispose();
    
    // 清理引用
    this.camera = null;
    this.controls = null;
    this.forwardVector = null;
    this.rightVector = null;
    this.tempVector = null;
  }
}
