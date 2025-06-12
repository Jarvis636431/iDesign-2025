import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cameraDefaults, controlsLimits } from "../constants/modelConfig";

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    this.moveState = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    };

    this.setupControls();
    this.setupEventListeners();
  }

  setupControls() {
    // 基本设置
    this.controls.enableDamping = false; // 禁用阻尼效果
    this.controls.dampingFactor = 0;

    // 禁用鼠标旋转
    this.controls.enableRotate = false;
    this.controls.rotateSpeed = 0;

    // 禁用缩放
    this.controls.enableZoom = false;
    this.controls.minDistance = 0.01;
    this.controls.maxDistance = 0.5;

    // 固定视角
    this.controls.minPolarAngle = Math.PI / 2; // 90度，固定水平视角
    this.controls.maxPolarAngle = Math.PI / 2; // 90度，固定水平视角

    // 禁用平移
    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;
  }

  setupEventListeners() {
    // 键盘事件监听
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

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

  update() {
    if (this.camera && this.controls) {
      // 获取相机前进方向（去掉y分量，保持水平移动）
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(this.camera.quaternion);
      forward.y = 0;
      forward.normalize();

      // 计算右方向
      const right = new THREE.Vector3(1, 0, 0);
      right.applyQuaternion(this.camera.quaternion);
      right.y = 0;
      right.normalize();

      // 根据按键状态更新相机位置
      if (this.moveState.moveForward) {
        this.camera.position.addScaledVector(forward, cameraDefaults.moveSpeed);
        this.controls.target.addScaledVector(forward, cameraDefaults.moveSpeed);
      }
      if (this.moveState.moveBackward) {
        this.camera.position.addScaledVector(
          forward,
          -cameraDefaults.moveSpeed
        );
        this.controls.target.addScaledVector(
          forward,
          -cameraDefaults.moveSpeed
        );
      }
      if (this.moveState.moveLeft) {
        this.camera.position.addScaledVector(right, -cameraDefaults.moveSpeed);
        this.controls.target.addScaledVector(right, -cameraDefaults.moveSpeed);
      }
      if (this.moveState.moveRight) {
        this.camera.position.addScaledVector(right, cameraDefaults.moveSpeed);
        this.controls.target.addScaledVector(right, cameraDefaults.moveSpeed);
      }

      this.controls.update();
    }
  }

  dispose() {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    this.controls.dispose();
  }
}
