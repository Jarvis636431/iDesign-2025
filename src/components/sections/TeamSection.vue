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
  // 获取上下各有多少个矩形
  const topCount = Math.ceil(staffGroups.length / 2);
  const bottomCount = Math.floor(staffGroups.length / 2);
  
  rectangles.value = staffGroups.map((group, index) => {
    const isTop = index % 2 === 0;
    const positionIndex = Math.floor(index / 2); // 在上/下序列中的位置
    const totalInRow = isTop ? topCount : bottomCount;
    
    // 计算水平偏移（减小间距为45vw，因为矩形宽度变小了）
    const horizontalOffset = (positionIndex - (totalInRow - 1) / 2) * 45;
    
    return {
      ...group,
      position: isTop ? 'top' : 'bottom',
      translateY: isTop ? -100 : 100,
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
  rectangles.value = rectangles.value.map(rect => ({
    ...rect,
    translateY: rect.position === 'top'
      ? -100 + (progress * 100)
      : 100 - (progress * 100),
    translateX: rect.translateX // 保持水平偏移不变
  }))
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
  width: 35vw; /* 减小宽度，适应竖直布局 */
  max-height: 85vh;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.5s ease-out;
  overflow-y: auto;
}

.team-rectangle.top {
  top: 5vh;
}

.team-rectangle.bottom {
  bottom: 5vh;
}

.team-rectangle h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.members-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.2rem;
  transition: transform 0.3s ease, background-color 0.3s ease;
  text-align: left;
}

.member-card:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.1);
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.member-info {
  color: #ffffff;
  flex-grow: 1;
}

.member-info h4 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.member-info p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}
</style>
