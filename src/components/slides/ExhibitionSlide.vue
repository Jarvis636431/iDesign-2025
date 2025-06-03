<template>
  <div class="slide exhibition-slide">
    <div class="exhibition-card">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <n-button type="primary" @click="enterExhibition">
        进入展厅
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const router = useRouter()

const enterExhibition = () => {
  router.push(`/exhibition/${props.id}`)
}
</script>

<style scoped>
.exhibition-slide {
  background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
  color: white;
}

.exhibition-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 80%;
}

h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}
</style> 