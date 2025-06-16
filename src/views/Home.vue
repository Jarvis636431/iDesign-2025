<script setup>
import { ref, onMounted } from "vue";
import HomeSection from "../components/sections/HomeSection.vue";
import PrefaceSection from "../components/sections/PrefaceSection.vue";
import VideoSection from "../components/sections/VideoSection.vue";
import ExhibitionSection from "../components/sections/ExhibitionSection.vue";
import GraduatesSection from "../components/sections/GraduatesSection.vue";
import TeamSection from "../components/sections/TeamSection.vue";
import EndSection from "../components/sections/EndSection.vue";
import TransitionSlide from "../components/slides/TransitionSlide.vue";
import TransitionSlideBetweenExhibitionAndGraduates from "../components/slides/TransitionSlideBetweenExhibitionAndGraduates.vue";

const isEnglish = ref(false);
const currentSection = ref("home");
const scrollContainerRef = ref(null);

// 移动端汉堡菜单状态
const isMobile = ref(false);
const isMenuOpen = ref(false);

const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value;
};

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 切换汉堡菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false;
};

// 滚动到指定区域
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    if (isMobile.value) {
      // 移动端垂直滚动
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // 桌面端水平滚动
      section.scrollIntoView({ behavior: "smooth" });
    }
    currentSection.value = sectionId;
    // 移动端点击导航后关闭菜单
    if (isMobile.value) {
      closeMenu();
    }
  }
};

// 跳转到展厅视图
const goToHall = () => {
  // 关闭移动端菜单
  if (isMobile.value) {
    closeMenu();
  }
  // 跳转到展厅视图页面，默认显示第一个展厅
  window.open("/2025/hall?id=73", "_blank");
};

// 使用 IntersectionObserver 监测每个 section 的可见性
onMounted(() => {
  // 初始检测移动端
  checkMobile();

  // 监听窗口大小变化
  window.addEventListener("resize", checkMobile);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          currentSection.value = entry.target.id;
        }
      });
    },
    {
      root: null, // 使用视口作为根
      threshold: [0.5],
      rootMargin: "0px",
    }
  );

  // 观察所有section
  document.querySelectorAll(".content-section").forEach((section) => {
    observer.observe(section);
  });

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", checkMobile);
  };
});
</script>

<template>
  <div class="home-container">
    <!-- 移动端汉堡菜单按钮 -->
    <div v-if="isMobile" class="mobile-header">
      <div class="mobile-logo" @click="scrollToSection('home')">
        <img src="/assets/images/logos/logo2025.png" alt="天津大学设计学院" />
      </div>
      <button
        class="hamburger-btn"
        @click="toggleMenu"
        :class="{ active: isMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 左侧导航栏 -->
    <nav
      class="side-navigation"
      :class="{
        'mobile-menu-open': isMenuOpen,
        'mobile-hidden': isMobile && !isMenuOpen,
      }"
    >
      <!-- 移动端遮罩层 -->
      <div
        v-if="isMobile && isMenuOpen"
        class="mobile-overlay"
        @click="closeMenu"
      ></div>

      <div class="nav-logo" @click="scrollToSection('home')" v-if="!isMobile">
        <img src="/assets/images/logos/logo2025.png" alt="天津大学设计学院" />
      </div>
      <div class="nav-links">
        <div
          class="nav-item"
          :class="{ active: currentSection === 'preface' }"
          @click="scrollToSection('preface')"
        >
          {{ isEnglish ? "Preface" : "卷首语" }}
        </div>
        <div
          class="nav-item"
          :class="{ active: currentSection === 'video' }"
          @click="scrollToSection('video')"
        >
          {{ isEnglish ? "Promotional Video" : "宣传片" }}
        </div>
        <div
          class="nav-item"
          :class="{ active: currentSection === 'exhibition' }"
          @click="scrollToSection('exhibition')"
        >
          {{ isEnglish ? "Virtual Exhibition" : "虚拟展厅" }}
        </div>
        <div
          class="nav-item"
          :class="{ active: currentSection === 'graduates' }"
          @click="scrollToSection('graduates')"
        >
          {{ isEnglish ? "Graduates" : "毕业生" }}
        </div>
        <div
          class="nav-item"
          :class="{ active: currentSection === 'team' }"
          @click="scrollToSection('team')"
        >
          {{ isEnglish ? "Exhibition Planner" : "年展组" }}
        </div>
      </div>
      <div class="language-switch" @click="toggleLanguage">
        {{ isEnglish ? "CN" : "EN" }}
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'mobile-content': isMobile }">
      <div
        class="scroll-container"
        :class="{ 'mobile-scroll': isMobile }"
        ref="scrollContainerRef"
      >
        <HomeSection id="home" class="content-section" />
        <PrefaceSection
          id="preface"
          class="content-section"
          :is-english="isEnglish"
        />
        <VideoSection
          id="video"
          class="content-section"
          :is-english="isEnglish"
        />
        <ExhibitionSection
          id="exhibition"
          class="content-section"
          :is-english="isEnglish"
        />
        <TransitionSlideBetweenExhibitionAndGraduates
          id="transition-between-exhibition-and-graduates"
          class="content-section"
          :is-english="isEnglish"
        />
        <GraduatesSection
          id="graduates"
          class="content-section"
          :is-english="isEnglish"
        />
        <TransitionSlide
          id="story"
          class="content-section"
          :is-english="isEnglish"
        />
        <TeamSection
          id="team"
          class="content-section"
          :is-english="isEnglish"
        />
        <EndSection id="end" class="content-section" :is-english="isEnglish" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.side-navigation {
  width: 90px;
  background-color: #fff;
  border-right: 1px solid #eee;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
}

.nav-logo {
  padding: 1rem;
  text-align: center;
  justify-self: center;
}

.nav-logo img {
  width: 60px;
  height: auto;
}

.nav-links {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
  font-size: 0.85rem; /* 减小字体以适应英文 */
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.8rem 0.1rem; /* 增加少量左右内边距 */
  position: relative;
  text-align: center; /* 确保文本居中 */
  line-height: 1.2; /* 调整行高 */
  word-break: break-word; /* 允许单词内换行 */
  hyphens: auto; /* 自动连字符 */
}

.nav-item:hover {
  transform: translateY(-2px);
  color: #2fa3b0;
}

.nav-item.active {
  font-weight: 500;
  color: #2fa3b0;
  position: relative;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  border-radius: 2px;
}

.nav-item.hall-link {
  color: #ff6b6b;
  font-weight: 500;
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  margin: 0 0.5rem;
  padding: 0.5rem 0.3rem;
}

.nav-item.hall-link:hover {
  background-color: #ff6b6b;
  color: white;
}

.language-switch {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  padding: 8px 12px;
  font-size: 1.2rem;
  color: #666;
  background-color: #fff;
  transition: all 0.3s ease;
}

.language-switch:hover {
  transform: translateX(-50%) translateY(-2px);
}

.main-content {
  flex: 1;
  margin-left: 90px;
  overflow: hidden;
  position: relative;
}

.scroll-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  position: relative;
  width: 100%;
}

/* 隐藏滚动条但保持功能 */
.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* 确保每个section都能完整显示 */
:deep(.content-section) {
  flex-shrink: 0;
  width: 100%;
  height: 100vh;
  position: relative;
}

/* 特殊宽度section处理 */
:deep(#team) {
  width: 200vw;
}

:deep(#preface) {
  width: 950vw;
}

:deep(#graduates) {
  width: 120vw;
}
:deep(#exhibition) {
  width: 100vw;
}

:deep(#video) {
  width: 200vw;
}

h1 {
  color: #333;
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.4;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2fa3b0;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.enter-button {
  display: inline-block;
  padding: 1rem 3rem;
  background-color: #2fa3b0;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.enter-button:hover {
  background-color: #1a7c85;
  transform: translateY(-2px);
}

/* 特殊处理过渡区域宽度 */
:deep(#story) {
  width: 150vw;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }

  /* 移动端头部 */
  .mobile-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 1000;
  }

  .mobile-logo img {
    height: 40px;
    width: auto;
  }

  /* 汉堡菜单按钮 */
  .hamburger-btn {
    background: none;
    border: none;
    width: 30px;
    height: 30px;
    position: relative;
    cursor: pointer;
    padding: 0;
  }

  .hamburger-btn span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: #333;
    margin: 5px 0;
    transition: 0.3s;
    transform-origin: center;
  }

  .hamburger-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }

  .hamburger-btn.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  /* 移动端导航菜单 */
  .side-navigation.mobile-hidden {
    transform: translateX(-100%);
  }

  .side-navigation {
    position: fixed;
    top: 60px;
    left: 0;
    width: 280px;
    height: calc(100vh - 60px);
    background-color: #fff;
    border-right: 1px solid #eee;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 999;
    padding: 2rem 0;
  }

  .side-navigation.mobile-menu-open {
    transform: translateX(0);
  }

  /* 移动端遮罩层 */
  .mobile-overlay {
    position: fixed;
    top: 60px;
    left: 280px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }

  /* 移动端导航项样式 */
  .nav-links {
    padding: 1rem 0;
    gap: 1rem;
  }

  .nav-item {
    font-size: 1.1rem;
    padding: 1rem 2rem;
    text-align: left;
    justify-content: flex-start;
  }

  .nav-item.active::after {
    display: none;
  }

  .nav-item.active {
    background-color: #f0f9fa;
    border-left: 3px solid #2fa3b0;
  }

  .language-switch {
    position: relative;
    bottom: auto;
    left: auto;
    transform: none;
    margin: 2rem;
    text-align: center;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  /* 移动端主内容区域 */
  .main-content.mobile-content {
    margin-left: 0;
    margin-top: 60px;
  }

  /* 移动端滚动容器 - 垂直滚动 */
  .scroll-container.mobile-scroll {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 60px);
  }

  /* 移动端section样式 */
  .scroll-container.mobile-scroll :deep(.content-section) {
    width: 100vw !important;
    min-height: calc(100vh - 60px);
    height: auto;
  }

  /* 特殊section在移动端的处理 */
  .scroll-container.mobile-scroll :deep(#preface) {
    width: 100vw !important;
  }

  .scroll-container.mobile-scroll :deep(#team) {
    width: 100vw !important;
  }

  .scroll-container.mobile-scroll :deep(#graduates) {
    width: 100vw !important;
  }

  .scroll-container.mobile-scroll :deep(#video) {
    width: 100vw !important;
  }

  .scroll-container.mobile-scroll :deep(#story) {
    width: 100vw !important;
  }
}
</style>
