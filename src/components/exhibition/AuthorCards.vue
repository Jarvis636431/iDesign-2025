<template>
  <div class="author-cards-container">
    <div 
      v-for="(author, index) in visibleAuthors" 
      :key="index"
      class="author-card"
      :style="{ 
        zIndex: index,
        '--hall-color': hallColor
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
  },
  hallColor: {
    type: String,
    default: '#2FA3B0'
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
  transition: all 0.3s ease;
  margin-left: -10px; /* 改为右侧叠加，减小叠加面积 */
  
  &:last-child {
    margin-right: 0;
  }

  &:hover {
    z-index: 10 !important;

    .author-avatar {
      transform: scale(1.1);
      border: 2px solid var(--hall-color); /* 保持边框宽度一致 */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 悬浮时加强阴影 */
      
      &::before {
        opacity: 0; /* 悬浮时显示真实头像 */
      }
    }

    .author-info {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) scale(1);
    }
  }

  &:nth-child(n+6) {
    display: none;
  }
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #d9d9d9; /* 默认灰色圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff; /* 默认白色边框 */
  position: relative;
  background-size: cover;
  background-position: center;
  transition: all 0.3s ease;
  z-index: 6;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #d9d9d9;
    border-radius: 50%;
    transition: opacity 0.3s ease;
    opacity: 1;
  }
}

.author-initial {
  opacity: 0; /* 默认隐藏初始字母 */
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
  transition: opacity 0.3s ease;
}

.author-card:hover .author-initial {
  opacity: 1; /* 悬浮时显示初始字母 */
}

.author-info {
  position: absolute;
  top: 50%;
  left: 25px; /* 让胶囊与头像重叠 */
  transform: translateY(-50%) scale(0.8);
  background: white;
  padding: 0.3rem 0rem 0.3rem 2rem; /* 减小上下内边距 */
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  pointer-events: none;
  z-index: 5; /* 降低层级，确保在头像下方 */
  min-width: 90px;
  display: flex;
  flex-direction: column; /* 文字上下排列 */
  align-items: flex-start;
  gap: 0px; /* 减小文字之间的间距 */
  border: 1px solid var(--hall-color);

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
