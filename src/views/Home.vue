<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExhibitionStore } from '../stores/exhibition'

const store = useExhibitionStore()
const router = useRouter()

const goToExhibition = (id) => {
  router.push(`/exhibition/${id}`)
}

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
          <router-link to="/exhibition/1" class="item">
            展厅 1
          </router-link>
          <button class="item" @click="goToExhibition(2)">
            展厅 2
          </button>
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
}

.exhibition-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #333;
}

.items {
  display: flex;
  gap: 1rem;
}

.item {
  padding: 1rem 2rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.item:hover {
  background-color: #f0f0f0;
}

.item.special {
  background-color: #4a90e2;
  color: white;
}

.item.special:hover {
  background-color: #357abd;
}
</style>