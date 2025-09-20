<template>
  <div
    class="graduate-card"
    :style="{ '--color': color }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="photo-container">
      <img
        v-if="avatar"
        :src="avatar"
        :alt="t(`graduates.items.${i18nKey}.name`)"
        class="avatar"
        @error="handleImageError"
      />
      <div v-else class="avatar-placeholder">
        {{ (t(`graduates.items.${i18nKey}.name`) || '?')[0] || '?' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineProps({
  i18nKey: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#2FA3B0",
  },
});

const { t } = useI18n();
const isHovered = ref(false);

const handleImageError = (e) => {
  e.target.style.display = "none";
  e.target.nextElementSibling.style.display = "flex";
};
</script>

<style scoped>
.graduate-card {
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="%232FA3B0"/><polygon points="24,22 36,22 30,16" fill="none" stroke="%23ffffff" stroke-width="2"/><polygon points="24,38 36,38 30,44" fill="none" stroke="%23ffffff" stroke-width="2"/></svg>')
      30 30,
    pointer;
}

.photo-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.graduate-card:hover .avatar {
  transform: scale(1.05);
}

.avatar-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  font-size: 2rem;
  font-weight: bold;
}
</style>
