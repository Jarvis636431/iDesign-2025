<script setup>
import { ref } from "vue";
import { graduates } from "../../constants/graduates";
import GraduateCard from "../graduates/GraduateCard.vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const selectedGraduate = ref(graduates[0]);

const handleSelectGraduate = (graduate, event) => {
  selectedGraduate.value = graduate;

  // 获取点击的卡片元素和列表容器
  const card = event.currentTarget;
  const list = document.querySelector(".avatars-list");
  const container = document.querySelector(".avatars-container");

  // 计算目标滚动位置：卡片位置减去容器高度的 25%（让卡片停在上方1/4处）
  const targetScroll = card.offsetTop - container.clientHeight * 0.25;

  // 平滑滚动到目标位置
  list.scrollTo({
    top: targetScroll,
    behavior: "smooth",
  });
};
</script>

<template>
  <section class="content-section" id="graduates">
    <div class="graduates-layout">
      <!-- 左侧内容区域 -->
      <div class="left-content">
        <div class="graduate-info" v-if="selectedGraduate">
          <div class="card-layout">
            <div class="card-left">
              <h3 class="section-title">毕业生</h3>
              <div class="thoughts-section">
                {{
                  isEnglish
                    ? selectedGraduate.thoughts.en
                    : selectedGraduate.thoughts.zh
                }}
              </div>

              <div class="bottom-info">
                <h2 class="graduate-name">
                  {{
                    isEnglish
                      ? selectedGraduate.name.en
                      : selectedGraduate.name.zh
                  }}
                </h2>
                <div class="graduate-title">
                  {{
                    isEnglish
                      ? selectedGraduate.destination.en
                      : selectedGraduate.destination.zh
                  }}
                </div>
              </div>
            </div>

            <div class="card-right">
              <div class="portrait-wrapper">
                <img
                  :src="selectedGraduate.avatar"
                  :alt="selectedGraduate.name.zh"
                  class="portrait"
                />
              </div>
              <div class="quote">风已至 新苗起</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧头像列表容器 -->
      <div class="avatars-container">
        <div class="avatars-list">
          <GraduateCard
            v-for="graduate in [...graduates, ...graduates]"
            :key="graduate.id + Math.random()"
            :name="graduate.name"
            :destination="graduate.destination"
            :is-english="isEnglish"
            :avatar="graduate.avatar"
            :class="{ active: selectedGraduate?.id === graduate.id }"
            @click="handleSelectGraduate(graduate, $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  width: 130%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff0ca;
  overflow: hidden;
}

.graduates-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  position: relative;
}

.left-content {
  position: absolute;
  left: 40%;
  transform: translateX(-50%);
  width: 1000px;
  padding: 48px;
  background: #ffffff;
}

.graduate-info {
  width: 100%;
}

.card-layout {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 500px;
}

.section-title {
  font-size: 28px;
  color: #000;
  margin: 0 0 32px 0;
}

.thoughts-section {
  font-size: 18px;
  line-height: 2;
  color: #333;
  white-space: pre-line;
  flex: 1;
  margin: 32px 0;
}

.bottom-info {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.graduate-name {
  font-size: 48px;
  font-weight: Semibold;
  color: #000;
  margin: 0;
}

.graduate-title {
  font-size: 18px;
  color: #666;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 320px;
}

.portrait-wrapper {
  width: 320px;
  height: 320px;
  overflow: hidden;
}

.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quote {
  font-size: 16px;
  color: #666;
  text-align: center;
}

.avatars-container {
  width: 150px;
  min-height: 100vh;
  position: absolute;
  right: 15vw;
  overflow: hidden;
  background: #ffffff;
}

.avatars-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  position: relative;
  animation: scroll 40s linear infinite;

  &::-webkit-scrollbar {
    display: none;
  }

  :deep(.graduate-card) {
    width: 120px;
    height: 120px;
    opacity: 0.6;
    transition: all 0.3s ease;
    border-radius: 16px;
    overflow: hidden;

    &:hover {
      opacity: 1;
      transform: scale(1.05);
    }

    &.active {
      opacity: 1;
      transform: scale(1.1);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.avatars-container:hover .avatars-list {
  animation-play-state: paused;
}
</style>
