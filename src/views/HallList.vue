<template>
  <div style="padding: 2rem;">
    <h1 style="margin-bottom:2rem;">展厅列表</h1>
    <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
      <div v-for="hall in halls" :key="hall.id" style="background:#fff; border-radius:1rem; box-shadow:0 2px 8px #eee; width:320px; padding:1.5rem; cursor:pointer; transition:.2s;" @click="goDetail(hall.id)">
        <img v-if="hall.cover" :src="hall.cover" style="width:100%;height:180px;object-fit:cover;border-radius:0.7rem; margin-bottom:1rem;" />
        <h2 style="font-size:1.3rem; margin-bottom:0.5rem; color:#2FA3B0;">{{ hall.name }}</h2>
        <p style="color:#666; font-size:1rem; min-height:3em;">{{ hall.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const areaIds = [73, 74, 75, 76, 77]
const halls = ref([])

onMounted(async () => {
  // 这里可根据实际接口调整
  const names = ['启风山谷', '驰风原野', '融和万象', '艺无多彩', '日出环星']
  const descs = [
    '启风山谷展厅简介',
    '驰风原野展厅简介',
    '融和万象展厅简介',
    '艺无多彩展厅简介',
    '日出环星展厅简介'
  ]
  // 获取每个展厅的第一个展品图片作为封面
  const covers = await Promise.all(areaIds.map(async (id) => {
    const res = await axios.get('http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists', {
      params: { per_page: 1, current_page: 1, category_id: id }
    })
    if (res.data && res.data.data && res.data.data.length > 0) {
      return 'http://idesign.tju.edu.cn/' + res.data.data[0].more.thumbnail
    }
    return ''
  }))
  halls.value = areaIds.map((id, idx) => ({
    id,
    name: names[idx],
    desc: descs[idx],
    cover: covers[idx]
  }))
})

function goDetail(id) {
  router.push(`/halls/${id}`)
}
</script>
