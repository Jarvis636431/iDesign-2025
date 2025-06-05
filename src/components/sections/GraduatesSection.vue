<script setup>
import { ref, computed } from 'vue'
import { graduates } from '../../constants/graduates'

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false
  }
})

const selectedGraduate = ref(graduates[0])

const handleSelectGraduate = (graduate) => {
  selectedGraduate.value = graduate
}
</script>

<template>
  <section class="content-section" id="graduates">
    <div class="graduates-layout">
      <!-- 左侧内容区域 -->
      <div class="left-content">
        <h1>毕业生</h1>
        
        <div class="graduate-info" v-if="selectedGraduate">
          <div class="info-header">
            <h2 class="graduate-name">{{ selectedGraduate.name }}</h2>
            <div class="graduate-title">{{ selectedGraduate.major }}</div>
          </div>
          
          <div class="info-description">
            毕业，是一段程程程程序序序序息息息息的结点,亦是新新新新生命命命命的起源。那些大大大大大大大大大大大大大的片刻，每每每每每每每每段段段段段段段段，我们总以为之前的经经经经经经经经验验验验验验验验会终其一生有用，但事经经经经经常常常常常常常常并非如此。新的事与物也在等待我们重新定义，重新解构，重新阐释。
          </div>
        </div>
      </div>

      <!-- 右侧头像列表 -->
      <div class="avatars-list">
        <div 
          v-for="graduate in graduates" 
          :key="graduate.id"
          class="avatar-item"
          :class="{ 'active': selectedGraduate?.id === graduate.id }"
          @click="handleSelectGraduate(graduate)"
        >
          <img 
            :src="graduate.avatar" 
            :alt="graduate.name"
            class="avatar-image"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  overflow: hidden;
}

.graduates-layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 40px;
  box-sizing: border-box;
}

.left-content {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

h1 {
  font-size: 56px;
  font-weight: normal;
  color: #000;
  margin: 0;
}

.graduate-info {
  max-width: 800px;
}

.info-header {
  margin-bottom: 40px;
}

.graduate-name {
  font-size: 48px;
  font-weight: normal;
  color: #000;
  margin: 0 0 8px 0;
}

.graduate-title {
  font-size: 24px;
  color: #666;
}

.info-description {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
  white-space: pre-line;
}

.avatars-list {
  width: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.avatar-item {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
  
  &.active {
    opacity: 1;
    transform: scale(1.1);
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
