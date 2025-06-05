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
let scrollHandler = null

onMounted(() => {
  initializeRectangles()
  setupScrollHandler()
})

onBeforeUnmount(() => {
  if (scrollHandler) {
    document.querySelector('.scroll-container').removeEventListener('scroll', scrollHandler)
  }
})

const initializeRectangles = () => {
  rectangles.value = staffGroups.map((group, index) => {
    const isTop = index % 2 === 1;
    const positionIndex = Math.floor(index / 2);
    const groupsInRow = Math.ceil(staffGroups.length / 2);
    
    // 减小水平间距为25vw，因为矩形变窄了
    let horizontalOffset = (positionIndex - (groupsInRow - 1) / 2) * 25;
    horizontalOffset += isTop ? 10 : -10; // 减小错开距离
    
    return {
      ...group,
      position: isTop ? 'top' : 'bottom',
      translateY: isTop ? -60 : 60,
      translateX: horizontalOffset
    }
  })
}

const setupScrollHandler = () => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (!scrollContainer) return

  scrollHandler = () => {
    const teamSection = document.getElementById('team')
    if (!teamSection) return

    const rect = teamSection.getBoundingClientRect()
    const containerWidth = window.innerWidth
    const sectionWidth = teamSection.offsetWidth
    
    // 计算滚动进度：只要section出现在视口就开始计算
    let progress = 0
    // 当section开始进入视口
    if (rect.right > 0 && rect.left < containerWidth) {
      // 根据left位置计算进度，使整个section宽度作为计算基准
      progress = (containerWidth - rect.left) / sectionWidth
    } else if (rect.left >= containerWidth) {
      // section还未进入视口
      progress = 0
    } else {
      // section已完全滚过
      progress = 1
    }

    // 使用缓动函数使动画更平滑
    const easeProgress = easeInOutCubic(progress)
    
    // 更新矩形位置，增加移动距离到120（允许超出对面边界）
    rectangles.value = rectangles.value.map(rect => ({
      ...rect,
      translateY: rect.position === 'top'
        ? -60 + (easeProgress * 120) // 从-60移动到60
        : 60 - (easeProgress * 120), // 从60移动到-60
      translateX: rect.translateX
    }))
  }

  scrollContainer.addEventListener('scroll', scrollHandler)
}

const easeInOutCubic = (x) => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
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
  width: 160px; /* 照片宽度 + 边距 */
  height: auto; /* 自适应内容高度 */
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.2rem;
  transition: all 0.3s ease-out;
  overflow: visible; /* 改为 visible */
}

.team-rectangle.top {
  top: 1vh;
}

.team-rectangle.bottom {
  bottom: 1vh;
}

.team-rectangle h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.6rem;
  white-space: nowrap;
}

.members-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.3rem;
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
  width: 100%;
}

.member-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.8rem;
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
  white-space: nowrap;
}

.member-info p {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.3;
}
</style>
