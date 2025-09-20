<template>
  <section class="content-section" id="end">
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
  </section>
</template>

<script setup>
</script>

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
  width: 800px;
  height: auto;
  position: absolute;
  transform: translateX(-90%);
}

.colorful-backimg {
  height: 100vh;
  position: absolute;
  right: 0;
}

.mobile-backimg {
  height: 60vh;
  width: auto;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
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
  right: 20px;
  top: 46%;
  transform: translateY(-50%);
  text-align: right;
}

.chinese-text-1 {
  font-size: 48px;
  font-family: "mfxihei", sans-serif;
  color: white;
  line-height: 1.2;
}

.chinese-text-2 {
  font-size: 80px;
  font-family: "mfxihei", sans-serif;
  color: white;
  line-height: 1.2;
}

.english-text {
  font-size: 38px;
  color: white;
  font-family: "futura", sans-serif;
  line-height: 1.2;
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

  /* 移动端Logo */
  .main-logo {
    width: 400px;
    height: auto;
    position: absolute;
    top: -150px;
    left: 50%;
    transform: translate(-50%, 0) rotate(90deg);
  }

  /* 移动端文字 */
  .text-content {
    position: absolute;
    bottom: 80px;
    left: 50%;
    right: auto;
    top: auto;
    transform: translateX(-50%);
    text-align: center;
    width: 90%;
    max-width: 350px;
    padding-bottom: 15px;
  }

  .chinese-text-1 {
    font-size: 20px;
    margin-bottom: 8px;
    letter-spacing: 2px;
    color: white;
  }

  .chinese-text-2 {
    font-size: 32px;
    margin-bottom: 15px;
    letter-spacing: 3px;
    color: white;
  }

  .english-text {
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 1px;
    color: white;
  }
}
</style>
