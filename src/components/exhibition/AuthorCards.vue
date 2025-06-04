<template>
  <div class="author-cards-container">
    <div 
      v-for="(author, index) in visibleAuthors" 
      :key="index"
      class="author-card"
      :style="{ 
        zIndex: index
      }"
      @mouseenter="activeCard = index"
      @mouseleave="activeCard = null"
    >
      <div 
        class="author-avatar"
        :style="author.avatar ? {
          backgroundImage: `url(${author.avatar})`
        } : {}"
      >
        <span v-if="!author.avatar" class="author-initial">{{ author.zh_names?.[0] || '?' }}</span>
      </div>
      <div class="author-info" :class="{ 'active': activeCard === index }">
        <div class="author-name">{{ author.zh_names }}</div>
        <div class="author-grade">{{ author.grade || '未知年级' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  authors: {
    type: Array,
    default: () => []
  }
})

const activeCard = ref(null)
const showAllAuthors = ref(false)

const visibleAuthors = computed(() => {
  return props.authors.slice(0, 5)
})

const hiddenAuthors = computed(() => {
  return props.authors.slice(5)
})

const hasMoreAuthors = computed(() => {
  return props.authors.length > 5
})
</script>

<style scoped>
.author-cards-container {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  min-height: 50px;
  margin-right: 10px;
}

.author-card {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ea2se;
  margin-left: -10px; /* 改为右侧叠加，减小叠加面积 */
  
  &:last-child {
    margin-right: 0;
  }
  
  &:hover {
    transform: translateY(-5px) !important;
    z-index: 10 !important;
  }

  &:nth-child(n+6) {
    display: none;
  }
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  background-size: cover;
  background-position: center;
}

.author-initial {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 50%;
}

.author-info {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  pointer-events: none;
  z-index: 20;
  min-width: 120px;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: white;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background: white;
    z-index: 1;
  }
}

.author-info.active {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.1s;
}

.author-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
}

.author-grade {
  font-size: 0.8rem;
  color: #666;
}

.author-card:hover {
  transform: translateY(-5px);
}

</style>
