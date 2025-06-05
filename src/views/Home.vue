<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExhibitionStore } from '../stores/exhibition'
import HomeSection from '../components/sections/HomeSection.vue'
import PrefaceSection from '../components/sections/PrefaceSection.vue'
import VideoSection from '../components/sections/VideoSection.vue'
import ExhibitionSection from '../components/sections/ExhibitionSection.vue'
import GraduatesSection from '../components/sections/GraduatesSection.vue'
import TeamSection from '../components/sections/TeamSection.vue'

const isEnglish = ref(false)
const currentSection = ref('home')
const scrollContainerRef = ref(null)

const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value
}

// 滚动到指定区域
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
    currentSection.value = sectionId
  }
}

// 监听滚动位置更新当前section
const handleScroll = (e) => {
  const container = e.target
  const scrollLeft = container.scrollLeft
  const width = container.clientWidth
  const sectionIndex = Math.round(scrollLeft / width)
  const sections = ['home', 'preface', 'video', 'exhibition', 'graduates', 'team']
  currentSection.value = sections[sectionIndex]
}

// 增加IntersectionObserver来精确检测当前可见section
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentSection.value = entry.target.id
      }
    })
  }, {
    root: scrollContainerRef.value,
    threshold: 0.7
  })

  // 观察所有section
  document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section)
  })
})
</script>

<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <nav class="side-navigation">
      <div class="nav-logo" @click="scrollToSection('home')">
        <img src="/assets/images/logos/logo2025.png" alt="天津大学设计学院">
      </div>
      <div class="nav-links">
        <div 
          class="nav-item"
          :class="{ 'active': currentSection === 'preface' }"
          @click="scrollToSection('preface')"
        >
          {{ isEnglish ? 'Preface' : '卷首语' }}
        </div>
        <div 
          class="nav-item"
          :class="{ 'active': currentSection === 'video' }"
          @click="scrollToSection('video')"
        >
          {{ isEnglish ? 'Video' : '宣传片' }}
        </div>
        <div 
          class="nav-item"
          :class="{ 'active': currentSection === 'exhibition' }"
          @click="scrollToSection('exhibition')"
        >
          {{ isEnglish ? 'Exhibition' : '虚拟展厅' }}
        </div>
        <div 
          class="nav-item"
          :class="{ 'active': currentSection === 'graduates' }"
          @click="scrollToSection('graduates')"
        >
          {{ isEnglish ? 'Graduates' : '毕业生' }}
        </div>
        <div 
          class="nav-item"
          :class="{ 'active': currentSection === 'team' }"
          @click="scrollToSection('team')"
        >
          {{ isEnglish ? 'Team' : '年展组' }}
        </div>
      </div>
      <div class="language-switch" @click="toggleLanguage">
        {{ isEnglish ? 'CN' : 'EN' }}
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="scroll-container" ref="scrollContainerRef" @scroll="handleScroll">
        <HomeSection />
        <PrefaceSection :is-english="isEnglish" />
        <VideoSection :is-english="isEnglish" />
        <ExhibitionSection :is-english="isEnglish" />
        <GraduatesSection :is-english="isEnglish" />
        <TeamSection :is-english="isEnglish" />

        <!-- 毕业生板块 -->
        <section class="content-section" id="graduates">
          <h2>毕业生</h2>
          <div class="section-content">
            <!-- 这里可以放毕业生列表 -->
          </div>
        </section>

        <!-- 年展组板块 -->
        <section class="content-section" id="team">
          <h2>年展组</h2>
          <div class="section-content">
            <!-- 这里可以放年展组介绍 -->
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  color: #2FA3B0;
}

.nav-item.active {
  font-weight: 500;
  color: #2FA3B0;
  position: relative;
}

.nav-item.active::after {
  content: '';
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
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.content-section {
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
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
  color: #2FA3B0;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.enter-button {
  display: inline-block;
  padding: 1rem 3rem;
  background-color: #2FA3B0;
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

/* 隐藏滚动条但保留功能 */
.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 为每个section添加不同的背景色或背景图 */
#home {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

#preface {
  background: linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%);
}

#video {
  background: linear-gradient(135deg, #f5f7fa 0%, #d4e6f1 100%);
}

#exhibition {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3e6cb 100%);
}

#graduates {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffd3b6 100%);
}

#team {
  background: linear-gradient(135deg, #f5f7fa 0%, #dac9e3 100%);
}
</style>