<!-- TeamSection.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { staffGroups } from '../../constants/staff'

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})

const rectangles = ref([])
let observer = null

onMounted(() => {
  initializeRectangles()
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})

const initializeRectangles = () => {
  const topCount = Math.ceil(staffGroups.length / 2);
  const bottomCount = Math.floor(staffGroups.length / 2);
  
  rectangles.value = staffGroups.map((group, index) => {
    const isTop = index % 2 === 0;
    const positionIndex = Math.floor(index / 2);
    const totalInRow = isTop ? topCount : bottomCount;
    
    // 减小水平间距为40vw
    const horizontalOffset = (positionIndex - (totalInRow - 1) / 2) * 40;
    
    return {
      ...group,
      position: isTop ? 'top' : 'bottom',
      translateY: isTop ? -60 : 60, // 初始位置更靠近可视区域
      translateX: horizontalOffset
    }
  })
}

const setupIntersectionObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.intersectionRatio
          updateRectanglesPosition(progress)
        }
      })
    },
    {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      rootMargin: '0px'
    }
  )

  const teamSection = document.getElementById('team')
  if (teamSection) {
    observer.observe(teamSection)
  }
}

const updateRectanglesPosition = (progress) => {
  // 使用缓动函数使动画更平滑
  const easeProgress = easeInOutCubic(progress);
  
  rectangles.value = rectangles.value.map(rect => ({
    ...rect,
    translateY: rect.position === 'top'
      ? -60 + (easeProgress * 55) // 减小移动距离
      : 60 - (easeProgress * 55),
    translateX: rect.translateX
  }))
}

// 缓动函数
const easeInOutCubic = (x) => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
</script>

<template>
  <section class="content-section" id="team">
    <div class="team-container">
      <div v-for="rectangle in rectangles" 
           :key="rectangle.id"
           class="team-rectangle"
           :class="rectangle.position"
           :style="{
             transform: `translate(calc(${rectangle.translateX}vw + 50%), ${rectangle.translateY}%)`
           }">
        <h3>{{ rectangle.name }}</h3>
        <div class="members-grid">
          <div v-for="member in rectangle.members" 
               :key="member.id"
               class="member-card">
            <img :src="`/assets/images/staff/${member.avatar}`" 
                 :alt="member.name.zh"
                 class="member-avatar" />
            <div class="member-info">
              <h4>{{ isEnglish ? member.name.en : member.name.zh }}</h4>
              <p>{{ isEnglish ? member.role.en : member.role.zh }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  width: 200vw;
  height: 100vh;
  position: relative;
  background-color: #052a1b;
  overflow: visible;
}

.team-container {
  width: 200vw;
  height: 100vh;
  position: relative;
}

.team-rectangle {
  position: absolute;
  left: 100vw;
  width: 30vw; /* 减小宽度 */
  max-height: 85vh;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.5s ease-out;
  overflow-y: auto;
}

.team-rectangle.top {
  top: 2vh; /* 初始位置更靠近可视区域 */
  transform-origin: top center;
}

.team-rectangle.bottom {
  bottom: 2vh; /* 初始位置更靠近可视区域 */
  transform-origin: bottom center;
}

.team-rectangle h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.8rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 1.2rem;
  padding: 0.5rem;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  text-align: center;
}

.member-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.member-info {
  color: #ffffff;
  width: 100%;
}

.member-info h4 {
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
  font-weight: 500;
}

.member-info p {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.3;
}

/* 自定义滚动条样式 */
.team-rectangle::-webkit-scrollbar {
  width: 6px;
}

.team-rectangle::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.team-rectangle::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.team-rectangle::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
