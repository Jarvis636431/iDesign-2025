<script setup>
import { onMounted, onUnmounted, ref } from "vue";

// 全局滚轮转换功能
let wheelHandler = null;
const wheelEnabled = ref(false);

onMounted(() => {
  // 立即修复光标问题
  document.body.style.cursor = "auto";
  document.documentElement.style.cursor = "auto";

  // 等待DOM完全加载
  setTimeout(() => {
    // 查找滚动容器
    const scrollContainer = document.querySelector(".scroll-container");

    if (!scrollContainer) {
      console.warn("未找到滚动容器，滚轮转换无法设置");
      return;
    }

    // 设置全局滚轮转换
    wheelHandler = (e) => {
      // 检查是否为移动端
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        return; // 移动端不转换滚轮，允许正常垂直滚动
      }

      // 检查是否在需要排除的元素内
      const target = e.target;
      const isInModal = target.closest(
        ".modal, .popup, .dropdown, .n-modal, .share-modal-overlay"
      );
      const isInVerticalScroll = target.closest(
        ".vertical-scroll, .allow-vertical"
      );
      const isInExhibitionLogo = target.closest(
        ".hall-logo-area, .exhibition-section"
      );
      const isInTeamSection = target.closest(
        ".team-container, .content-section"
      );

      // 如果在弹窗、明确需要垂直滚动的区域、展厅logo区域或团队section，不转换
      if (
        isInModal ||
        isInVerticalScroll ||
        isInExhibitionLogo ||
        isInTeamSection
      ) {
        return;
      }

      // 防止默认滚动
      e.preventDefault();

      // 获取滚动增量并转换为水平滚动
      const delta = e.deltaY;
      scrollContainer.scrollLeft += delta * 1.5;
    };

    // 添加全局滚轮监听
    document.addEventListener("wheel", wheelHandler, { passive: false });
    wheelEnabled.value = true;
  }, 1000); // 延迟确保DOM完全加载
});

onUnmounted(() => {
  // 清理事件监听
  if (wheelHandler) {
    document.removeEventListener("wheel", wheelHandler);
    wheelEnabled.value = false;
  }
});
</script>

<template>
  <main class="exhibition-content">
    <router-view></router-view>
  </main>
</template>

<style>
/* 全局光标修复 */
html,
body,
* {
  cursor: auto !important;
}

/* 交互元素的光标 */
button,
a,
.nav-item,
.language-switch,
[role="button"],
.clickable {
  cursor: pointer !important;
}

/* 确保整个应用占满视口 */
:root {
  height: 100%;
}

.exhibition-content {
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  cursor: auto !important;
}
</style>
