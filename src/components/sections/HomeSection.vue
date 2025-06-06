<template>
  <section class="content-section" id="home">
    <img src="/assets/images/logos/main.png" alt="Main Logo" class="main-logo" />
    <img src="/assets/images/colorful-backimg.png" alt="Colorful Background" class="colorful-backimg" />
    <div class="text-content">
      <p class="chinese-text">天津大学2025年度<br>第11届设计年展</p>
      <p class="english-text">2025 the 11th<br>annual Design Exhibition<br>of Tianjing University</p>
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

.text-content {
  position: absolute;
  right: 20px; /* 距离右侧的距离 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中 */
  text-align: right; /* 文本右对齐 */
}

.chinese-text {
  font-size: 1.5rem;
  margin-bottom: 1rem; /* 与英文文本的间距 */
}

.english-text {
  font-size: 1.2rem;
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

</style>
