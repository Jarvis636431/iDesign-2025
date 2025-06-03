<template>
  <div class="hall-list-page">
    <h1 class="hall-list-title">展厅列表</h1>
    <div v-if="loading" class="hall-list-loading">加载中...</div>
    <div v-else-if="error" class="hall-list-error">{{ error }}</div>
    <div v-else class="hall-list-container">
      <div v-for="hall in halls" :key="hall.id" class="hall-card" @click="goFirstExhibit(hall)">
        <div class="hall-card-img-wrap">
          <img
            v-if="hall.cover"
            :src="hall.cover"
            class="hall-card-img"
            @error="e => e.target.src = defaultCover"
            alt="展厅封面"
          />
          <div v-else class="hall-card-img-placeholder">无封面</div>
        </div>
        <h2 class="hall-card-title">{{ hall.name }}</h2>
        <p class="hall-card-desc">{{ hall.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { halls as hallConfigs } from '@/constants/halls'

const router = useRouter()
const halls = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    loading.value = true
    error.value = ''
    const results = await Promise.all(hallConfigs.map(async (hall) => {
      const res = await axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
        params: { per_page: 1, current_page: 1, category_id: hall.id }
      })
      let cover = ''
      let firstExhibitId = null
      if (res.data && res.data.data && res.data.data.length > 0) {
        cover = 'http://idesign.tju.edu.cn/' + res.data.data[0].more.thumbnail
        firstExhibitId = res.data.data[0].id
      }
      return { ...hall, cover: cover || hall.cover, firstExhibitId }
    }))
    halls.value = results
  } catch (e) {
    error.value = '展厅数据加载失败，请稍后重试。'
  } finally {
    loading.value = false
  }
})

function goFirstExhibit(hall) {
  if (hall.firstExhibitId) {
    router.push(`/information/${hall.firstExhibitId}`)
  }
}
</script>

<style scoped>
.hall-list-page {
  padding: 2rem;
  min-height: 100vh;
  background: #f7fafd;
}
.hall-list-title {
  margin-bottom: 2rem;
  color: #2FA3B0;
  font-size: 2.2rem;
  font-weight: bold;
  letter-spacing: 2px;
}
.hall-list-loading, .hall-list-error {
  font-size: 1.3rem;
  color: #888;
  text-align: center;
  margin-top: 4rem;
}
.hall-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: flex-start;
}
.hall-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #e0eafc;
  width: 320px;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.hall-card:hover {
  box-shadow: 0 6px 24px #b3d8f7;
  transform: translateY(-4px) scale(1.03);
}
.hall-card-img-wrap {
  width: 100%;
  height: 180px;
  border-radius: 0.7rem;
  overflow: hidden;
  background: #eaf6fb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.hall-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.7rem;
  transition: opacity 0.2s;
}
.hall-card-img-placeholder {
  color: #bbb;
  font-size: 1.1rem;
}
.hall-card-title {
  font-size: 1.3rem;
  color: #2FA3B0;
  margin-bottom: 0.5rem;
  font-weight: bold;
  text-align: center;
}
.hall-card-desc {
  color: #666;
  font-size: 1rem;
  min-height: 3em;
  text-align: center;
  line-height: 1.6;
}
</style>
