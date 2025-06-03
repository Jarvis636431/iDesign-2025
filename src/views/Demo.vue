<template>
  <div style="padding: 2rem;">
    <h2>{{ exhibit.post_title }}</h2>
    <p>{{ exhibit.intro_zh }}</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
      <img v-for="photo in exhibit.more.photos" :key="photo.url" :src="fullUrl(photo.url)" :alt="photo.name" style="max-width: 200px; border-radius: 8px;" />
    </div>
    <div v-if="exhibit.more.files && exhibit.more.files.length">
      <video v-for="file in exhibit.more.files" :key="file.url" :src="fullUrl(file.url)" controls style="max-width: 400px; border-radius: 8px; margin-bottom: 1rem;" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const exhibit = ref({ post_title: '', intro_zh: '', more: { photos: [], files: [] } })

function fullUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `http://idesign.tju.edu.cn/upload/${path.replace(/^\//, '')}`
}

onMounted(async () => {
  // 这里写死一个 category_id 示例
  const res = await axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
    params: {
      per_page: 1,
      current_page: 1,
      category_id: 75
    }
  })
  if (res.data && res.data.data && res.data.data.length > 0) {
    exhibit.value = res.data.data[0]
  }
})
</script>
