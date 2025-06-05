<script setup>
import { ref, onMounted } from 'vue'
import { halls } from '../../constants/halls'

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})

const activeHallIndex = ref(0)
const intervalId = ref(null)

const startAutoPlay = () => {
  intervalId.value = setInterval(() => {
    activeHallIndex.value = (activeHallIndex.value + 1) % halls.length
  }, 3000)
}

const stopAutoPlay = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
}

const setActiveHall = (index) => {
  activeHallIndex.value = index
  stopAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})
</script>

<template>
  <section class="content-section" id="exhibition">
    <div class="exhibition-background"></div>
    <div class="exhibition-content">
      <h2>{{ isEnglish ? 'Virtual Exhibition' : '虚拟展厅' }}</h2>
      <div class="exhibition-preview">
        <div class="preview-container" 
             @mouseenter="stopAutoPlay"
             @mouseleave="startAutoPlay">
          <div class="halls-preview">
            <div v-for="(hall, index) in halls" 
                 :key="hall.id"
                 :class="['hall-card', { active: index === activeHallIndex }]"
                 @click="setActiveHall(index)">
              <img :src="hall.logo" :alt="hall.name" class="hall-logo" />
              <div class="hall-info">
                <img v-if="hall.icon" :src="hall.icon" class="hall-icon" />
                <img v-if="hall.border" :src="hall.border" class="hall-border" />
                <h3>{{ hall.name }}</h3>
                <p>{{ hall.desc }}</p>
              </div>
            </div>
          </div>
          <div class="preview-indicators">
            <span v-for="(hall, index) in halls" 
                  :key="index"
                  :class="['indicator', { active: index === activeHallIndex }]"
                  @click="setActiveHall(index)">
            </span>
          </div>
        </div>
        <router-link to="/2025/halls" class="enter-button">
          {{ isEnglish ? 'Enter Exhibition' : '进入展厅' }}
          <span class="button-arrow">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  min-width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.exhibition-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
}

.exhibition-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

h2 {
  font-size: 3rem;
  margin-bottom: 3rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.exhibition-preview {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.preview-container {
  margin-bottom: 2rem;
  position: relative;
}

.halls-preview {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.hall-card {
  width: 280px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  opacity: 0.6;
  transform: scale(0.95);
}

.hall-card.active {
  opacity: 1;
  transform: scale(1);
  background: rgba(255,255,255,0.2);
}

.hall-logo {
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.hall-info {
  text-align: center;
  color: #fff;
}

.hall-icon {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}

.hall-border {
  height: 32px;
}

.hall-info h3 {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.hall-info p {
  font-size: 0.9rem;
  opacity: 0.8;
}

.preview-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #fff;
  transform: scale(1.2);
}

.enter-button {
  display: inline-flex;
  align-items: center;
  padding: 1rem 3rem;
  background-color: rgba(47, 163, 176, 0.9);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.button-arrow {
  margin-left: 0.5rem;
  font-size: 1.4rem;
  transition: transform 0.3s ease;
}

.enter-button:hover {
  background-color: rgba(26, 124, 133, 0.9);
  transform: translateY(-2px);
}

.enter-button:hover .button-arrow {
  transform: translateX(5px);
}
</style>
