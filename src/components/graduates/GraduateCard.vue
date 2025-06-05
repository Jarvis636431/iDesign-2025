<template>
  <div 
    class="graduate-card" 
    :style="{ '--color': color }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="photo-container">
      <img 
        v-if="avatar" 
        :src="avatar" 
        :alt="name" 
        class="avatar"
        @error="handleImageError"
      />
      <div v-else class="avatar-placeholder">
        {{ name ? name.charAt(0) : '?' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: Object,
    required: true
  },
  destination: {
    type: Object,
    default: () => ({
      zh: '',
      en: ''
    })
  },
  isEnglish: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#2FA3B0'
  }
})

const isHovered = ref(false)

const handleImageError = (e) => {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}
</script>

<style scoped>
.graduate-card {
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.photo-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.graduate-card:hover .avatar {
  transform: scale(1.05);
}

.avatar-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  font-size: 2rem;
  font-weight: bold;
}
</style>
