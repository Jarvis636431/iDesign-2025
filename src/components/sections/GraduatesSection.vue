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
    <img class="bg-image" src="/assets/images/backimage.png" alt="背景" />
    <div class="graduates-layout">
      <!-- 左侧内容区域 -->
      <div class="left-content">
        <!-- 白色卡片 -->
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
              <div class="quote">风已至<br /><span>新苗起</span></div>
            </div>
          </div>
        </div>

        <!-- 卡片外面的五行文字 -->
        <div class="bottom-text" v-if="selectedGraduate">
          <div class="text-line">
            {{ isEnglish ? "Wind from the south" : "南方来风" }}
          </div>
          <div class="text-line">
            {{
              isEnglish
                ? "Neither fierce nor clamorous, yet silently nourishing all things"
                : "不烈不喧 却润物无声"
            }}
          </div>
          <div class="text-line">
            {{
              isEnglish
                ? "It carries direction, temperature and rhythm"
                : "它携带着方向、温度与节奏"
            }}
          </div>
          <div class="text-line">
            {{ isEnglish ? "Awakening dormant seeds" : "唤醒沉潜的种子" }}
          </div>
          <div class="text-line">
            {{
              isEnglish
                ? "And propelling the growth of all things"
                : "也推动万物的生长"
            }}
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

.bg-image {
  position: absolute;
  top: 0;
  left: 29%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
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
  top: 10%; /* 将整个内容区域上移 */
  /* 移除背景和padding，因为现在文字在卡片外面 */
}

.graduate-info {
  width: 100%;
  padding: 40px;
  background: #ffffff; /* 白色背景只应用于卡片 */
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
  min-height: 450px; /* 从500px减少到400px，减少100px高度 */
}

.section-title {
  font-size: 28px;
  color: #000;
  margin: 0 0 10px 0;
}

.thoughts-section {
  font-size: 18px;
  line-height: 1.8; /* 从2减少到1.8，减少行高 */
  color: #333;
  white-space: pre-line;
  flex: 1;
  margin: 24px 0; /* 从32px减少到24px，减少上下边距 */
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
  gap: 16px; /* 从20px减少到16px，减少间距 */
  width: 280px; /* 从320px减少到280px，与头像宽度一致 */
}

.portrait-wrapper {
  width: 280px; /* 从320px减少到280px */
  height: 280px; /* 从320px减少到280px */
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
  line-height: 1.5;
  justify-content: end;
}

.quote br + span {
  display: inline-block;
  margin-left: 100px;
}

/* 卡片外面的五行文字 */
.bottom-text {
  margin-top: 10px; /* 与白色卡片的间距 */
  width: 100%;
}

.bottom-text .text-line {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 苹方字体 */
  font-weight: bold; /* 加粗 */
  font-size: 16px;
  color: #333;
  line-height: 1.8;
}

.box-container {
  width: 200px;
  right: 15vw;
  height: 100vh;
  background: #052a1b;
  position: absolute;
  z-index: 1;
}

.avatars-container {
  width: 150px;
  min-height: 100vh;
  position: absolute;
  right: 15vw;
  overflow: hidden;
  background: #ffffff;
  z-index: 2;
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

.right-rect-bg {
  position: fixed;
  right: 0;
  top: 0;
  width: 150px;
  height: 100vh;
  background: #052a1b;
  z-index: 1000;
  pointer-events: none;
}
</style>
