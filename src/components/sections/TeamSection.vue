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
    
    // 计算水平偏移
    const horizontalOffset = (positionIndex - (totalInRow - 1) / 2) * 90; // 90vw 作为水平间距
    
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
  left: 100vw; /* 设置初始位置在中心 */
  width: 70vw; /* 减小宽度，避免重叠 */
  max-height: 80vh;
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
  margin-bottom: 1rem;
  text-align: center;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.member-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.member-card:hover {
  transform: translateY(-5px);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.member-info {
  color: #ffffff;
}

.member-info h4 {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.member-info p {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}
</style>
