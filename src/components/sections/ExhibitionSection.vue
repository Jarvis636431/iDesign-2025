<script setup>
import { ref, computed } from 'vue'
import { halls } from '../../constants/halls'

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})

const activeHallIndex = ref(0)
const activeHall = computed(() => halls[activeHallIndex.value])

const handleWheel = (event) => {
  if (event.deltaY > 0) {
    // 向下滚动
    activeHallIndex.value = (activeHallIndex.value + 1) % halls.length
  } else {
    // 向上滚动
    activeHallIndex.value = (activeHallIndex.value - 1 + halls.length) % halls.length
  }
}
</script>

<template>
  <section 
    class="exhibition-section" 
    id="exhibition"
    @wheel="handleWheel"
    :style="{ backgroundColor: activeHall.backgroundColor }">
    
    <!-- 左上角标题 -->
    <div class="hall-title-area">
      <h2 class="hall-title" :style="{color:activeHall.color}" >{{ isEnglish ? activeHall.enName : activeHall.name }}</h2>
    </div>

    <!-- 右侧中间Logo -->
    <div class="hall-logo-area">
      <img :src="activeHall.logo" :alt="isEnglish ? activeHall.enName : activeHall.name"
           class="hall-logo">
    </div>

    <!-- 右下角描述 -->
    <div class="hall-description">
      <div class="hall-subtitle">
        {{ isEnglish ? activeHall.enSubTitle : activeHall.subTitle }}
      </div>
      <p class="hall-text">
        {{ isEnglish ? activeHall.enDesc : activeHall.desc }}
      </p>
    </div>
    
  </section>
</template>

<style scoped>
.exhibition-section {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: transparent;
}

.hall-title-area {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 2;
}

.hall-title {
  font-size: 96px;
  font-weight: bold;
  line-height: 1.4;
  margin: 0;
  font-family: "MFXiHei", sans-serif; /* 添加自定义字体 */
}

@font-face {
  font-family: "MFXiHei";
  src: url("/assets/fonts/MFXiHei_Noncommercial-Regular.otf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.hall-logo-area {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hall-logo {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.hall-description {
  position: absolute;
  bottom: 40px;
  right: 40px;
  max-width: 420px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.hall-subtitle {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.hall-text {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
  text-align: justify;
}
</style>
