<template>
  <section class="content-section" id="home">
    <img
      src="/assets/images/logos/main.png"
      alt="Main Logo"
      class="main-logo"
    />
    <img
      src="/assets/images/colorful-backimg.png"
      alt="Colorful Background"
      class="colorful-backimg desktop-only"
    />
    <img
      src="/assets/images/mobile-backimg.png"
      alt="Mobile Background"
      class="mobile-backimg mobile-only"
    />
    <div class="text-content">
      <p class="chinese-text-1">天津大学2025年度</p>
      <p class="chinese-text-2">第11届设计年展</p>
      <p class="english-text">
        2025 the 11th Annual Design Exhibition<br />of Tianjing University
      </p>
    </div>

    <!-- 移动端向下滚动指示器 -->
    <div class="scroll-indicator">
      <div class="arrow-down">
        <span></span>
        <span></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  width: calc(100% - 90px);
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: white;
}

.main-logo {
  opacity: 0;
  animation: fadeInAndMove 2.5s forwards;
  width: 800px;
  height: auto;
  position: absolute;
  transform: rotate(-45deg);
}

.colorful-backimg {
  height: 100vh;
  position: absolute;
  right: -100%; /* 初始位置在页面右侧 */
  animation: slideIn 2.5s forwards 2.5s; /* 延迟 2.5 秒后开始动画 */
}

.mobile-backimg {
  height: 60vh;
  width: auto;
  position: absolute;
  bottom: -60vh; /* 初始位置在页面下方 */
  left: 50%;
  transform: translateX(-50%) rotate(90deg); /* 预先旋转90度 */
  animation: mobileSlideUp 2s forwards 3s; /* Logo动画完成后开始 */
}

/* 桌面端和移动端显示控制 */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.text-content {
  position: absolute;
  right: 20px; /* 距离右侧的距离 */
  top: 46%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中 */
  text-align: right; /* 文本右对齐 */
  opacity: 0; /* 初始透明度为 0 */
  animation: fadeIn 1s forwards 5s; /* 延迟 5 秒后开始淡入 */
}

.chinese-text-1 {
  font-size: 48px; /* 第一行中文字号 */
  font-family: "mfxihei", sans-serif; /* 使用 mfxihei 字体 */
  color: white; /* 设置为白色 */
  line-height: 1.2; /* 减小行距 */
}

.chinese-text-2 {
  font-size: 80px; /* 第二行中文字号 */
  font-family: "mfxihei", sans-serif; /* 使用 mfxihei 字体 */
  color: white;
  line-height: 1.2; /* 减小行距 */
}

.english-text {
  font-size: 38px; /* 英文字号 */
  color: white; /* 设置为白色 */
  font-family: "futura", sans-serif; /* 使用 futura 字体 */
  line-height: 1.2; /* 减小行距 */
}

@keyframes fadeInAndMove {
  0% {
    opacity: 0;
    transform: translateX(0) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: translateX(0) rotate(-45deg);
  }
  100% {
    opacity: 1;
    transform: translateX(-90%) rotate(0deg);
    animation-timing-function: ease-in-out;
  }
}

@keyframes slideIn {
  0% {
    right: -100%;
  }
  100% {
    right: 0%; /* 到达 0% 的位置 */
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 滚动指示器样式 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: fadeInIndicator 1s forwards 6s; /* 在文字出现后1秒显示 */
  display: none; /* 桌面端默认隐藏 */
}

.arrow-down {
  position: relative;
  width: 30px;
  height: 30px;
}

.arrow-down span {
  position: absolute;
  width: 20px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  opacity: 0.8;
}

.arrow-down span:first-child {
  transform: rotate(45deg);
  left: 5px;
  top: 10px;
  animation: arrowBounce 2s infinite;
}

.arrow-down span:last-child {
  transform: rotate(-45deg);
  right: 5px;
  top: 10px;
  animation: arrowBounce 2s infinite 0.2s;
}

@keyframes fadeInIndicator {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes arrowBounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 移动端样式 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw;
    padding: 0;
    justify-content: flex-start;
    background: white;
  }

  /* 移动端显示控制 */
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  /* 移动端Logo动画：中间淡入后滑动到顶部 */
  .main-logo {
    width: 400px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    animation: mobileLogoAnimation 3s forwards;
  }

  /* 移动端文字：更靠上的位置浮现 */
  .text-content {
    position: absolute;
    bottom: 80px; /* 更靠上的位置 */
    left: 50%;
    right: auto; /* 重置桌面端的right属性 */
    top: auto; /* 重置桌面端的top属性 */
    transform: translateX(-50%);
    text-align: center; /* 改为居中对齐 */
    opacity: 0;
    animation: mobileTextFadeIn 1s forwards 5s; /* mobile-back进入后开始 */
    width: 90%; /* 增加整体宽度 */
    max-width: 350px; /* 设置最大宽度 */
    padding-bottom: 15px; /* 添加底部内边距，避免完全贴边 */
  }

  .chinese-text-1 {
    font-size: 20px; /* 移动端字体大小 */
    margin-bottom: 8px;
    letter-spacing: 2px;
    color: white; /* 改为白色 */
  }

  .chinese-text-2 {
    font-size: 32px; /* 移动端字体大小 */
    margin-bottom: 15px;
    letter-spacing: 3px;
    color: white; /* 改为白色 */
  }

  .english-text {
    font-size: 16px; /* 移动端字体大小 */
    line-height: 1.5;
    letter-spacing: 1px;
    color: white; /* 改为白色 */
  }

  /* 移动端显示滚动指示器 */
  .scroll-indicator {
    display: block;
    bottom: 20px; /* 调整到文字下方 */
  }

  /* 移动端Logo动画 */
  @keyframes mobileLogoAnimation {
    0% {
      opacity: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    30% {
      opacity: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      opacity: 1;
      top: -150px;
      left: 50%;
      transform: translate(-50%, 0) rotate(90deg);
    }
  }

  /* 移动端mobile-back上滑动画 */
  @keyframes mobileSlideUp {
    0% {
      bottom: -60vh;
      opacity: 0;
      transform: translateX(-50%);
    }
    100% {
      bottom: 0px;
      opacity: 1;
      transform: translateX(-50%);
    }
  }

  /* 移动端文字淡入动画 */
  @keyframes mobileTextFadeIn {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  /* 修复箭头动画 */
  .arrow-down span:first-child {
    animation: mobileArrowBounce1 2s infinite;
  }

  .arrow-down span:last-child {
    animation: mobileArrowBounce2 2s infinite 0.2s;
  }

  @keyframes mobileArrowBounce1 {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0) rotate(45deg);
    }
    40% {
      transform: translateY(-8px) rotate(45deg);
    }
    60% {
      transform: translateY(-4px) rotate(45deg);
    }
  }

  @keyframes mobileArrowBounce2 {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0) rotate(-45deg);
    }
    40% {
      transform: translateY(-8px) rotate(-45deg);
    }
    60% {
      transform: translateY(-4px) rotate(-45deg);
    }
  }
}
</style>
