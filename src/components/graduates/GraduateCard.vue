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
      <div class="graduate-info" :class="{ 'show': isHovered }">
        <h3 class="name">{{ isEnglish ? name.en : name.zh }}</h3>
        <p class="destination">{{ isEnglish ? destination.en : destination.zh }}</p>
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
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  border: 2px solid #000000;
  
  &:hover {
    transform: translateY(-2px);
  }
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

.graduate-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  
  &.show {
    transform: translateY(0);
  }
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 4px 0;
}

.major {
  font-size: 0.9rem;
  margin: 0 0 4px 0;
  opacity: 0.9;
}

.mentor {
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
}
</style>
