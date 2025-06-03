<template>
  <div style="padding:2rem;">
    <h1 style="margin-bottom:2rem;">{{ hallName }} 展厅</h1>
    <div style="display:flex; flex-wrap:wrap; gap:2rem;">
      <div v-for="exhibit in exhibits" :key="exhibit.id" style="background:#fff; border-radius:1rem; box-shadow:0 2px 8px #eee; width:320px; padding:1.5rem; cursor:pointer; transition:.2s;" @click="goExhibit(exhibit.id)">
        <img v-if="exhibit.more && exhibit.more.thumbnail" :src="fullUrl(exhibit.more.thumbnail)" style="width:100%;height:180px;object-fit:cover;border-radius:0.7rem; margin-bottom:1rem;" />
        <h2 style="font-size:1.1rem; margin-bottom:0.5rem; color:#2FA3B0;">{{ exhibit.post_title }}</h2>
        <p style="color:#666; font-size:0.95rem; min-height:2.5em;">{{ exhibit.intro_zh }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const exhibits = ref([])
const hallName = ref('')

function fullUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `http://idesign.tju.edu.cn/${path.replace(/^\//, '')}`
}

onMounted(async () => {
  const id = route.params.id
  // 可根据 id 匹配展厅名
  const names = {73:'启风山谷',74:'驰风原野',75:'融和万象',76:'艺无多彩',77:'日出环星'}
  hallName.value = names[id] || id
  const res = await axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
    params: { per_page: 9999, current_page: 1, category_id: id }
  })
  if (res.data && res.data.data) {
    exhibits.value = res.data.data
  }
})

function goExhibit(id) {
  router.push(`/information/${id}`)
}
</script>
