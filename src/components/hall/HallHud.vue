<template>
  <!-- 返回按钮 -->
  <button @click="emit('back')" class="back-button"><span>←</span> 返回</button>

  <!-- 查看展品按钮 -->
  <button @click="emit('enter')" class="exhibit-button">查看展品</button>

  <!-- 操作提示 -->
  <div v-if="!isMobile" class="control-tips">
    <div class="tips-content">
      <div class="tips-title">操作提示</div>
      <div class="tips-item">
        <span class="tips-keys">WASD</span>
        <span class="tips-desc">移动视角</span>
      </div>
      <div class="tips-item">
        <span class="tips-keys">方向键</span>
        <span class="tips-desc">移动视角</span>
      </div>
      <div class="tips-item">
        <span class="tips-keys">鼠标</span>
        <span class="tips-desc">旋转视角</span>
      </div>
    </div>
  </div>

  <!-- 移动端虚拟方向键 -->
  <div class="virtual-controls">
    <div class="control-row">
      <button
        @touchstart="emit('virtual-key', 'KeyW', true)"
        @touchend="emit('virtual-key', 'KeyW', false)"
        class="control-btn up"
      >
        <span>↑</span>
      </button>
    </div>
    <div class="control-row">
      <button
        @touchstart="emit('virtual-key', 'KeyA', true)"
        @touchend="emit('virtual-key', 'KeyA', false)"
        class="control-btn left"
      >
        <span>←</span>
      </button>
      <button
        @touchstart="emit('virtual-key', 'KeyS', true)"
        @touchend="emit('virtual-key', 'KeyS', false)"
        class="control-btn down"
      >
        <span>↓</span>
      </button>
      <button
        @touchstart="emit('virtual-key', 'KeyD', true)"
        @touchend="emit('virtual-key', 'KeyD', false)"
        class="control-btn right"
      >
        <span>→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back", "enter", "virtual-key"]);
</script>

<style scoped>
/* 返回按钮样式 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: #e77e37;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  z-index: 100; /* 确保在模型上层 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(231, 126, 55, 0.2);
}

.back-button:hover {
  background: #d66b24;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(231, 126, 55, 0.3);
}

.back-button span {
  font-size: 1.2rem;
}

/* 查看展品按钮样式 */
.exhibit-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 0.5rem 1.5rem;
  background: #2fa3b0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  z-index: 100; /* 确保在模型上层 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(47, 163, 176, 0.2);
}

.exhibit-button:hover {
  background: #268d99;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(47, 163, 176, 0.3);
}

/* 操作提示样式 */
.control-tips {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 160px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tips-title {
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.3rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.3rem;
}

.tips-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}

.tips-keys {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 0.8rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 50px;
  text-align: center;
}

.tips-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
}

/* 虚拟方向键样式 */
.virtual-controls {
  display: none; /* 默认在PC端隐藏 */
  position: fixed;
  left: 20px;
  bottom: 20px; /* 默认位置 */
  z-index: 100;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 5px 0;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.control-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-button {
    top: 15px;
    left: 15px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .exhibit-button {
    top: 15px;
    right: 15px;
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }

  .control-tips {
    left: 15px;
    bottom: 15px;
    padding: 0.8rem;
    font-size: 0.8rem;
    min-width: 140px;
  }

  .tips-title {
    font-size: 0.9rem;
  }

  .tips-keys {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    min-width: 45px;
  }

  .tips-desc {
    font-size: 0.75rem;
  }

  .virtual-controls {
    display: block; /* 在移动端显示虚拟按键 */
    bottom: 20px; /* 调整到更靠近底部的位置 */
    padding-bottom: env(safe-area-inset-bottom); /* 适配安全区域 */
  }

  .control-row {
    display: flex;
    justify-content: center;
    margin: 0.2rem 0;
  }

  .control-btn {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .control-btn:active {
    transform: translateY(0);
    box-shadow: none;
  }

  .up {
    background: linear-gradient(180deg, #4caf50 0%, #81c784 100%);
  }

  .down {
    background: linear-gradient(0deg, #f44336 0%, #e57373 100%);
  }

  .left {
    background: linear-gradient(90deg, #2196f3 0%, #64b5f6 100%);
  }

  .right {
    background: linear-gradient(270deg, #ff9800 0%, #ffb74d 100%);
  }
}
</style>
