<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExhibitionStore } from '../stores/exhibition'

const isEnglish = ref(false)

const toggleLanguage = () => {
  isEnglish.value = !isEnglish.value
}
</script>

<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <nav class="side-navigation">
      <div class="nav-logo">
        <img src="/assets/images/logos/logo2025.png" alt="天津大学设计学院">
      </div>
      <div class="nav-links">
        <router-link to="/2025/preface" class="nav-item">
          {{ isEnglish ? 'Preface' : '卷首语' }}
        </router-link>
        <router-link to="/2025/video" class="nav-item">
          {{ isEnglish ? 'Video' : '宣传片' }}
        </router-link>
        <router-link to="/2025/halls" class="nav-item">
          {{ isEnglish ? 'Exhibition' : '虚拟展厅' }}
        </router-link>
        <router-link to="/2025/graduates" class="nav-item">
          {{ isEnglish ? 'Graduates' : '毕业生' }}
        </router-link>
        <router-link to="/2025/team" class="nav-item">
          {{ isEnglish ? 'Team' : '年展组' }}
        </router-link>
      </div>
      <div class="language-switch" @click="toggleLanguage">
        {{ isEnglish ? 'CN' : 'EN' }}
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <h1>天津大学设计学院2025届毕业设计展</h1>
      <div class="exhibition-list">
        <!-- 展厅导航 -->
        <div class="section">
          <h2>展厅导航</h2>
          <div class="items">
            <router-link to="/2025/halls" class="item">
              查看所有展厅
            </router-link>
          </div>
        </div>

        <!-- 展品信息入口 -->
        <div class="section">
          <h2>展品信息</h2>
          <div class="items">
            <router-link to="/2025/information/1" class="item special">
              浏览展品信息
            </router-link>
          </div>
        </div>
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
}

.nav-item:hover {
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  font-weight: 500;
  position: relative;
}

.nav-item.router-link-active::after {
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
  padding: 2.5rem;
  margin-left: 120px;
  max-width: 1200px;
}

h1 {
  color: #333;
  font-size: 2.2rem;
  margin-bottom: 2.5rem;
  font-weight: bold;
}

.exhibition-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.items {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.item {
  display: inline-block;
  padding: 1rem 2rem;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.item:hover {
  background-color: #1a7c85;
  transform: translateY(-2px);
}

.item.special {
  background-color: #ff6b6b;
}

.item.special:hover {
  background-color: #ff5252;
}
</style>