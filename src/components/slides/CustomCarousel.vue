<script setup>
import { ref, computed, watch, defineExpose } from 'vue';
import ModelViewer from '@/components/three/ModelViewer.vue';

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  },
  hallColor: {
    type: String,
    default: '#2FA3B0'
  }
});

const currentSlideIndex = ref(0);

const totalSlides = computed(() => props.slides.length);
const currentSlide = computed(() => {
  if (totalSlides.value === 0) return null;
  // Ensure index is always valid, even if slides array changes unexpectedly
  if (currentSlideIndex.value >= totalSlides.value) {
    currentSlideIndex.value = Math.max(0, totalSlides.value - 1);
  }
  return props.slides[currentSlideIndex.value];
});

function prevSlideExecute() { // Renamed to avoid conflict if we name the exposed one 'prev'
  if (totalSlides.value === 0) return;
  currentSlideIndex.value = (currentSlideIndex.value - 1 + totalSlides.value) % totalSlides.value;
}

function nextSlideExecute() { // Renamed to avoid conflict
  if (totalSlides.value === 0) return;
  currentSlideIndex.value = (currentSlideIndex.value + 1) % totalSlides.value;
}

function goToSlide(index) {
  if (index >= 0 && index < totalSlides.value) {
    currentSlideIndex.value = index;
  }
}

// Expose methods for parent component (Information.vue) to call
defineExpose({
  prev: prevSlideExecute,
  next: nextSlideExecute,
  goToSlide // Exposing goToSlide as well, might be useful
});

watch(() => props.slides, (newSlides, oldSlides) => {
  // Only reset if the actual content of slides might have changed identity,
  // or if the current index becomes invalid.
  // A simple heuristic: if length changes, or if current item's src changes.
  let resetIndex = false;
  if (newSlides.length !== oldSlides.length) {
    resetIndex = true;
  } else if (currentSlide.value && newSlides[currentSlideIndex.value] && newSlides[currentSlideIndex.value].src !== currentSlide.value.src) {
    // If the slide at the current index has a different src, likely a full content change
    resetIndex = true;
  }

  if (resetIndex || currentSlideIndex.value >= newSlides.length) {
     currentSlideIndex.value = 0;
  }
}, { deep: true });

</script>

<template>
  <div class="custom-carousel-wrapper">
    <div class="slide-display-area" v-if="currentSlide">
      <div :key="currentSlide.type + '-' + currentSlide.src" class="slide-content-inner">
        <template v-if="currentSlide.type === 'model'">
          <ModelViewer
            :modelUrl="currentSlide.src"
            :key="currentSlideIndex + '-' + currentSlide.src + '-model'"
            style="width:100%;height:100%;border-radius:24px;overflow:hidden;"
          ></ModelViewer>
        </template>
        <template v-else-if="currentSlide.type === 'video'">
          <video 
            :src="currentSlide.src" 
            controls 
            class="carousel-video" 
            @error="() => alert('视频加载失败！\n'+currentSlide.src)" 
            :key="currentSlideIndex + '-' + currentSlide.src + '-video'"
          ></video>
        </template>
        <template v-else-if="currentSlide.type === 'image'">
          <img 
            :src="currentSlide.src" 
            :alt="'Slide ' + currentSlideIndex" 
            class="carousel-image" 
            @error="() => alert('图片加载失败！\n'+currentSlide.src)" 
            :key="currentSlideIndex + '-' + currentSlide.src + '-image'"
          >
        </template>
        <div v-else class="slide-type-unknown">
          未知类型的幻灯片: {{ currentSlide.type }}
        </div>
      </div>
    </div>
    <div v-else class="no-slides-available">
      无可用幻灯片
    </div>

    <div class="slide-indicators" v-if="totalSlides > 1">
      <span
        v-for="(slide, index) in slides"
        :key="'dot-' + index"
        :class="['slide-dot', { active: index === currentSlideIndex }]"
        @click="goToSlide(index)"
        :style="{ background: index === currentSlideIndex ? hallColor : '#ccc' }"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.custom-carousel-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 24px; /* Consistent with .exhibit-image-inner */
  overflow: hidden;    /* Consistent with .exhibit-image-inner */
  background: #fff;    /* Consistent with .exhibit-image-inner */
}

.slide-display-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-video,
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 24px; /* Match ModelViewer style for consistency */
}

.no-slides-available,
.slide-type-unknown {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #888;
  font-size: 1.2rem;
  padding: 1rem;
  text-align: center;
}

.slide-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.slide-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  display: inline-block;
  cursor: pointer;
  transition: background 0.2s;
}

/* If ModelViewer.vue itself doesn't ensure 100% width/height for its root, this can help */
:deep(.model-viewer-container-class-if-any) { /* Replace with actual class if ModelViewer has one */
  width: 100%;
  height: 100%;
}
</style>
