<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExhibitionStore } from '../stores/exhibition'

// 暂时不需要 store 和 router
onMounted(() => {
  // 这里可以添加初始化逻辑
})
</script>

<template>
  <div class="home">
    <h1>虚拟展厅首页</h1>
    <div class="exhibition-list">
      <!-- 展厅导航 -->
      <div class="section">
        <h2>展厅导航</h2>
        <div class="items">
          <router-link to="/halls" class="item">
            查看所有展厅
          </router-link>
        </div>
      </div>

      <!-- 展品信息入口 -->
      <div class="section">
        <h2>展品信息</h2>
        <div class="items">
          <router-link to="/information/1" class="item special">
            浏览展品信息
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
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
  color: #2FA3B0;
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
  background-color: #2FA3B0;
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

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .section {
    padding: 1.5rem;
  }
}
</style>