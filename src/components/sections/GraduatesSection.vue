<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { graduates } from "../../constants/graduates";
import GraduateCard from "../graduates/GraduateCard.vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const selectedGraduate = ref(graduates[0]);
const isHovering = ref(false);
const avatarsListRef = ref(null);
const avatarsContainerRef = ref(null);

// 移动端相关状态
const isMobile = ref(false);
const currentIndex = ref(0);
const cardsContainerRef = ref(null);

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

// 处理鼠标悬停
const handleMouseEnter = () => {
  isHovering.value = true;
  if (avatarsListRef.value) {
    // 暂停动画，启用滚动
    avatarsListRef.value.style.animationPlayState = "paused";
  }
};

const handleMouseLeave = () => {
  isHovering.value = false;
  if (avatarsListRef.value) {
    // 恢复动画
    avatarsListRef.value.style.animationPlayState = "running";
  }
};

// 处理滚轮事件
const handleWheel = (event) => {
  if (isHovering.value && avatarsListRef.value) {
    event.preventDefault(); // 阻止页面滚动
    event.stopPropagation(); // 阻止事件冒泡

    // 获取当前滚动位置
    const currentScrollTop = avatarsListRef.value.scrollTop || 0;
    const scrollDelta = event.deltaY;

    // 手动滚动
    avatarsListRef.value.scrollTop = currentScrollTop + scrollDelta;
  }
};

// 移动端相关函数
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 移动端切换到下一个毕业生
const nextGraduate = () => {
  if (currentIndex.value < graduates.length - 1) {
    currentIndex.value++;
    selectedGraduate.value = graduates[currentIndex.value];
    updateCardPosition();
    console.log(
      "Next graduate:",
      currentIndex.value,
      selectedGraduate.value.name.zh
    );
  }
};

// 移动端切换到上一个毕业生
const prevGraduate = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedGraduate.value = graduates[currentIndex.value];
    updateCardPosition();
  }
};

// 移动端跳转到指定卡片
const goToSlide = (index) => {
  currentIndex.value = index;
  selectedGraduate.value = graduates[currentIndex.value];
  updateCardPosition();
  console.log("Go to slide:", index, selectedGraduate.value.name.zh);
};

// 更新卡片位置
const updateCardPosition = () => {
  if (cardsContainerRef.value) {
    const cardWidth = window.innerWidth; // 使用窗口宽度作为卡片宽度
    const translateX = -currentIndex.value * cardWidth;
    cardsContainerRef.value.style.transform = `translateX(${translateX}px)`;
    console.log(
      "Update position:",
      currentIndex.value,
      "translateX:",
      translateX,
      "cardWidth:",
      cardWidth
    );
  }
};

// 移动端触摸滑动
let startX = 0;
let startY = 0;
let isDragging = false;

const handleTouchStart = (event) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
  isDragging = true;
};

const handleTouchMove = (event) => {
  if (!isDragging) return;
  event.preventDefault();
};

const handleTouchEnd = (event) => {
  if (!isDragging) return;
  isDragging = false;

  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // 判断是否为水平滑动（水平距离大于垂直距离）
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      prevGraduate(); // 向右滑动，显示上一个
    } else {
      nextGraduate(); // 向左滑动，显示下一个
    }
  }
};

onMounted(() => {
  // 检测移动端
  checkMobile();
  window.addEventListener("resize", () => {
    checkMobile();
    // 窗口大小变化时重新计算位置
    if (isMobile.value) {
      setTimeout(() => updateCardPosition(), 100);
    }
  });

  // 添加滚轮事件监听
  if (avatarsContainerRef.value) {
    avatarsContainerRef.value.addEventListener("wheel", handleWheel, {
      passive: false,
    });
  }

  // 初始化移动端卡片位置
  setTimeout(() => {
    if (isMobile.value) {
      updateCardPosition();
    }
  }, 200); // 延迟确保DOM完全渲染
});

onUnmounted(() => {
  // 清理事件监听
  if (avatarsContainerRef.value) {
    avatarsContainerRef.value.removeEventListener("wheel", handleWheel);
  }
  window.removeEventListener("resize", checkMobile);
});
</script>

<template>
  <section class="content-section" id="graduates">
    <!-- 桌面端布局 -->
    <div class="desktop-layout" v-if="!isMobile">
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

          <!-- 卡片外面的文字 -->
          <div
            class="bottom-text"
            :class="{ 'english-text': isEnglish }"
            v-if="selectedGraduate"
          >
            <template v-if="isEnglish">
              <!-- 英文两行诗歌 -->
              <div class="text-line">A Southern breeze, so soft and low,</div>
              <div class="text-line">Awakens seeds, helps all things grow.</div>
            </template>
            <template v-else>
              <!-- 中文五行文字 -->
              <div class="text-line">南方来风</div>
              <div class="text-line">不烈不喧 却润物无声</div>
              <div class="text-line">它携带着方向、温度与节奏</div>
              <div class="text-line">唤醒沉潜的种子</div>
              <div class="text-line">也推动万物的生长</div>
            </template>
          </div>
        </div>

        <!-- 右侧头像列表容器 -->
        <div
          ref="avatarsContainerRef"
          class="avatars-container"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div
            ref="avatarsListRef"
            class="avatars-list"
            :class="{ 'manual-scroll': isHovering }"
          >
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
    </div>

    <!-- 移动端布局 -->
    <div class="mobile-layout" v-else>
      <!-- 移动端轮播卡片容器 -->
      <div
        class="mobile-carousel-wrapper"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div ref="cardsContainerRef" class="mobile-carousel-container">
          <div
            v-for="(graduate, index) in graduates"
            :key="graduate.id"
            class="mobile-graduate-card"
            :class="{ active: index === currentIndex }"
          >
            <!-- 卡片标题 -->
            <div class="card-title">
              {{ isEnglish ? "Graduate" : "毕业生" }}
            </div>

            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 头像 -->
              <div class="avatar-section">
                <img
                  :src="graduate.avatar"
                  :alt="graduate.name.zh"
                  class="graduate-avatar"
                />
              </div>

              <!-- 毕业感言 -->
              <div class="thoughts-section">
                <p class="thoughts-text">
                  {{ isEnglish ? graduate.thoughts.en : graduate.thoughts.zh }}
                </p>
              </div>

              <!-- 毕业生信息 -->
              <div class="graduate-info-section">
                <h2 class="graduate-name">
                  {{ isEnglish ? graduate.name.en : graduate.name.zh }}
                </h2>
                <p
                  class="graduate-destination"
                  v-if="graduate.destination.zh || graduate.destination.en"
                >
                  {{
                    isEnglish
                      ? graduate.destination.en
                      : graduate.destination.zh
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 轮播指示器 -->
      <div class="carousel-indicators">
        <div
          v-for="(graduate, index) in graduates"
          :key="graduate.id"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></div>
      </div>

      <!-- 导航按钮 -->
      <div class="carousel-nav">
        <button
          class="nav-btn prev-btn"
          @click="prevGraduate"
          :disabled="currentIndex === 0"
        >
          ‹
        </button>
        <button
          class="nav-btn next-btn"
          @click="nextGraduate"
          :disabled="currentIndex === graduates.length - 1"
        >
          ›
        </button>
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
  left: 35%; /* 从40%改为35%，向左移动一些，为右侧头像列表留出更多空间 */
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
  font-weight: bold; /* 中文加粗 */
  font-size: 16px;
  color: #333;
  line-height: 1.8;
}

/* 英文状态下使用苹方字体但不加粗 */
.bottom-text.english-text .text-line {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 英文也使用苹方字体 */
  font-size: 16px;
  color: #333;
  line-height: 1.8;
}

/* 英文状态下也使用苹方字体 */
.bottom-text.english-text .text-line {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 英文也使用苹方字体 */
  font-weight: bold;
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
  right: -60vw; /* 从15vw改为8vw，向右移动 */
  overflow: hidden;
  background: #ffffff;
  z-index: 2;
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" fill="%232FA3B0"/><polygon points="24,22 36,22 30,16" fill="none" stroke="%23ffffff" stroke-width="2"/><polygon points="24,38 36,38 30,44" fill="none" stroke="%23ffffff" stroke-width="2"/></svg>')
      30 30,
    pointer;
}

.avatars-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  position: relative;
  animation: scroll 40s linear infinite;
  height: 100%;
  overflow-y: auto; /* 允许垂直滚动 */

  &::-webkit-scrollbar {
    display: none;
  }

  /* 手动滚动模式 */
  &.manual-scroll {
    animation-play-state: paused;
    overflow-y: auto;
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

/* 悬停控制现在由JavaScript处理 */

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

/* 移动端样式 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw !important;
    height: calc(100vh - 60px); /* 减去导航栏高度 */
    background: #fff0ca; /* 保持原有背景颜色 */
    overflow: hidden;
  }

  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    width: 100vw;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* 移动端轮播容器 */
  .mobile-carousel-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .mobile-carousel-container {
    display: flex;
    width: 2500vw; /* 25个毕业生 * 100vw */
    height: 100%;
    transition: transform 0.3s ease;
  }

  /* 移动端毕业生卡片 */
  .mobile-graduate-card {
    width: 100vw;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;
  }

  /* 卡片标题 */
  .card-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    text-align: left;
    font-weight: 600;
  }

  /* 卡片主体 */
  .card-body {
    flex: 1;
    background: white;
    border-radius: 16px;
    padding: 24px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 3px solid #052a1b;
    overflow-y: auto;
  }

  /* 头像区域 */
  .avatar-section {
    display: flex;
    justify-content: flex-start;
  }

  .graduate-avatar {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
  }

  /* 毕业感言区域 */
  .thoughts-section {
    flex: 1;
  }

  .thoughts-text {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    text-align: left;
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* 毕业生信息区域 */
  .graduate-info-section {
    border-top: 1px solid #eee;
    padding-top: 16px;
  }

  .graduate-name {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0 0 8px 0;
    text-align: left;
  }

  .graduate-destination {
    font-size: 14px;
    color: #666;
    margin: 0;
    text-align: left;
  }

  /* 轮播指示器 */
  .carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 16px 0;
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator.active {
    background: #052a1b;
    transform: scale(1.2);
  }

  /* 导航按钮 */
  .carousel-nav {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    pointer-events: none;
    z-index: 10;
  }

  .nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #052a1b;
    color: #052a1b;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .nav-btn:hover:not(:disabled) {
    background: #052a1b;
    color: white;
    transform: scale(1.1);
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  /* 隐藏桌面端元素 */
  .bg-image,
  .avatars-container,
  .right-rect-bg {
    display: none;
  }
}
</style>
