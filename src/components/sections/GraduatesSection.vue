<script setup>
import { ref } from 'vue'
import { graduates } from '../../constants/graduates'
import GraduateCard from '../graduates/GraduateCard.vue'

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
        <div class="graduate-info" v-if="selectedGraduate">
          <div class="info-header">
            <h2 class="graduate-name">{{ isEnglish ? selectedGraduate.name.en : selectedGraduate.name.zh }}</h2>
            <div class="graduate-title">{{ isEnglish ? selectedGraduate.destination.en : selectedGraduate.destination.zh }}</div>
          </div>
          
          <div class="info-description">
            {{ isEnglish ? selectedGraduate.thoughts.en : selectedGraduate.thoughts.zh }}
          </div>
        </div>
      </div>

      <!-- 右侧头像列表 -->
      <div class="avatars-list">
        <GraduateCard
          v-for="graduate in graduates" 
          :key="graduate.id"
          :name="graduate.name"
          :destination="graduate.destination"
          :is-english="isEnglish"
          :avatar="graduate.avatar"
          :class="{ 'active': selectedGraduate?.id === graduate.id }"
          @click="handleSelectGraduate(graduate)"
        />
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
  border: #000 solid 12px;
    border-radius: 24px;
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

  :deep(.graduate-card) {
    width: 80px;
    height: 80px;
    opacity: 0.6;
    transition: all 0.3s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.05);
    }

    &.active {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}
</style>
