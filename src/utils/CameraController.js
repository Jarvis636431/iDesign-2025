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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = cameraDefaults.dampingFactor;

    // 设置旋转速度
    this.controls.rotateSpeed = cameraDefaults.rotateSpeed;

    // 允许缩放，但限制范围
    this.controls.enableZoom = true;
    this.controls.minDistance = 0.01; // 允许非常近的观察距离
    this.controls.maxDistance = 0.5; // 限制最远距离以保持视角

    // 限制垂直旋转，但给予一定自由度
    this.controls.minPolarAngle = Math.PI / 6; // 30度
    this.controls.maxPolarAngle = (Math.PI * 5) / 6; // 150度

    // 启用平移，但限制垂直平移
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
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
