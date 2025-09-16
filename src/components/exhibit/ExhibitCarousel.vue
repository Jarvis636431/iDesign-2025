<template>
  <div class="exhibit-carousel-wrapper">
    <div class="exhibit-image-inner">
      <!-- CustomCarousel组件 -->
      <CustomCarousel
        :slides="slides"
        :hallColor="hallColor"
        ref="carouselRef"
        style="width: 100%; height: 100%"
      />
      <!-- 放大镜按钮 -->
      <button
        class="fullscreen-btn"
        :style="{ backgroundColor: hallColor }"
        @click="handleFullscreen"
        title="全屏查看"
      >
        <svg viewBox="0 0 24 24" class="magnify-icon">
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomCarousel from '@/components/slides/CustomCarousel.vue'

// Props定义
const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  },
  hallColor: {
    type: String,
    default: '#000000'
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

// Events定义
const emit = defineEmits(['fullscreen'])

// 轮播图引用
const carouselRef = ref(null)

// 处理全屏事件
const handleFullscreen = () => {
  emit('fullscreen')
}

// 暴露轮播图方法供父组件调用
defineExpose({
  carouselRef
})
</script>

<style scoped>
.exhibit-carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.exhibit-image-inner {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

/* 放大镜按钮样式 */
.fullscreen-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.fullscreen-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.magnify-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .fullscreen-btn {
    width: 36px;
    height: 36px;
    top: 12px;
    right: 12px;
  }
  
  .magnify-icon {
    width: 18px;
    height: 18px;
  }
}
</style>