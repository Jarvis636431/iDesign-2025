<script setup>
import { ref, onMounted } from "vue";
import HomeSection from "../components/sections/HomeSection.vue";
import PrefaceSection from "../components/sections/PrefaceSection.vue";
import VideoSection from "../components/sections/VideoSection.vue";
import ExhibitionSection from "../components/sections/ExhibitionSection.vue";
import GraduatesSection from "../components/sections/GraduatesSection.vue";
import TeamSection from "../components/sections/TeamSection.vue";
import TransitionSlide from "../components/slides/TransitionSlide.vue";
import TransitionSlideBetweenExhibitionAndGraduates from "../components/slides/TransitionSlideBetweenExhibitionAndGraduates.vue";

const isEnglish = ref(false);
const currentSection = ref("home");
const scrollContainerRef = ref(null);

const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value;
};

// 滚动到指定区域
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    currentSection.value = sectionId;
  }
};

// 使用 IntersectionObserver 监测每个 section 的可见性
onMounted(() => {
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

  return () => observer.disconnect();
});
</script>

<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <nav class="side-navigation">
      <div class="nav-logo" @click="scrollToSection('home')">
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
          {{ isEnglish ? "Video" : "宣传片" }}
        </div>
        <div
          class="nav-item"
          :class="{ active: currentSection === 'exhibition' }"
          @click="scrollToSection('exhibition')"
        >
          {{ isEnglish ? "Exhibition" : "虚拟展厅" }}
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
          {{ isEnglish ? "Team" : "年展组" }}
        </div>
      </div>
      <div class="language-switch" @click="toggleLanguage">
        {{ isEnglish ? "CN" : "EN" }}
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="scroll-container" ref="scrollContainerRef">
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
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.8rem 0;
  position: relative;
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
  width: 100vw;
  height: 100vh;
  position: relative;
}

/* 特殊宽度section处理 */
:deep(#team) {
  width: 200vw;
}

:deep(#graduates) {
  width: 120vw;
}

:deep(#video) {
  width: 150vw;
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
</style>
