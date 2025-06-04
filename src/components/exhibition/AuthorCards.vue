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
    z-index: 10 !important;
  }

  &:nth-child(n+6) {
    display: none;
  }
}

.author-avatar {
  width: 50px;
  height: 50px;
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
  transition: all 0.3s ease;
  filter: grayscale(100%) brightness(1.1); /* 默认灰白色 */
  z-index: 6; /* 确保头像在信息框上方 */

  &:hover {
    filter: grayscale(0%); /* 悬浮时显示原色 */
    transform: scale(1.05);
  }
}

.author-initial {
  font-size: 1.2rem; /* 增大字体大小，从 1rem 改为 1.2rem */
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
  top: 50%;
  left: 25px; /* 让胶囊与头像重叠 */
  transform: translateY(-50%) scale(0.8);
  background: white;
  padding: 0.3rem 1.2rem 0.3rem 2rem; /* 减小上下内边距 */
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  pointer-events: none;
  z-index: 5; /* 降低层级，确保在头像下方 */
  min-width: 120px;
  display: flex;
  flex-direction: column; /* 文字上下排列 */
  align-items: flex-start;
  gap: 0px; /* 减小文字之间的间距 */

  &::after {
    content: none; /* 移除原来的箭头 */
  }

  &::before {
    content: none; /* 移除原来的箭头 */
  }
}

.author-info.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) scale(1);
  transition-delay: 0.1s;
}

.author-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
  line-height: 1.1; /* 减小行高 */
}

.author-grade {
  font-size: 0.8rem; /* 稍微减小字体 */
  color: #666;
  padding: 0;
  line-height: 1.1; /* 减小行高 */
}

.author-card:hover {
  transform: translateY(-5px);
}

</style>
