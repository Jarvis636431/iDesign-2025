<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInformationStore } from '../stores/information'

const route = useRoute()
const router = useRouter()
const store = useInformationStore()

const currentId = computed(() => parseInt(route.params.id) || 1)
const totalExhibits = computed(() => store.getTotalExhibits)
const exhibitInfo = computed(() => store.getExhibitById(currentId.value) || {
  title: '加载中...',
  description: '',
  imageUrl: '',
  details: { author: '', year: '', medium: '' }
})

const goToExhibit = (direction) => {
  let newId
  if (direction === 'next') {
    newId = currentId.value < totalExhibits.value ? currentId.value + 1 : 1
  } else {
    newId = currentId.value > 1 ? currentId.value - 1 : totalExhibits.value
  }
  router.push(`/information/${newId}`)
}
</script>

<template>
  <div class="information-page">
    <div class="exhibit-container">
      <button class="nav-button prev" @click="goToExhibit('prev')">
        ← 上一个
      </button>
      
      <div class="exhibit-content">
        <div class="exhibit-image">
          <img :src="exhibitInfo.imageUrl" :alt="exhibitInfo.title">
        </div>
        <div class="exhibit-details">
          <h1>{{ exhibitInfo.title }}</h1>
          <p class="description">{{ exhibitInfo.description }}</p>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">作者：</span>
              <span>{{ exhibitInfo.details.author }}</span>
            </div>
            <div class="detail-item">
              <span class="label">年份：</span>
              <span>{{ exhibitInfo.details.year }}</span>
            </div>
            <div class="detail-item">
              <span class="label">材质：</span>
              <span>{{ exhibitInfo.details.medium }}</span>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-button next" @click="goToExhibit('next')">
        下一个 →
      </button>
    </div>
  </div>
</template>

<style scoped>
.information-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.exhibit-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.exhibit-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.nav-button {
  background: #f5f5f5;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background: #e5e5e5;
}

.exhibit-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.exhibit-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.exhibit-details h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.description {
  color: #666;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
}

.label {
  font-weight: bold;
  color: #555;
}
</style>
