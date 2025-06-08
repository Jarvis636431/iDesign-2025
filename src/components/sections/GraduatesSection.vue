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

// 移动端相关函数 - 与ExhibitionSection保持一致的检测逻辑
const checkMobile = () => {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();

  // 检测移动设备用户代理
  const isMobileUserAgent =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );

  // 只有在真正的移动设备或者非常小的屏幕时才启用移动端模式
  isMobile.value = isMobileUserAgent || width <= 768;
};

// 更新卡片位置（支持无限滚动）
const updateCardPosition = () => {
  if (cardsContainerRef.value) {
    const cardWidth = window.innerWidth; // 使用窗口宽度作为卡片宽度
    const totalCards = graduates.length;

    // 确保索引在有效范围内
    if (currentIndex.value >= totalCards) {
      currentIndex.value = 0;
    } else if (currentIndex.value < 0) {
      currentIndex.value = totalCards - 1;
    }

    const translateX = -currentIndex.value * cardWidth;
    cardsContainerRef.value.style.transform = `translateX(${translateX}px)`;
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
      // 向右滑动，显示上一个
      currentIndex.value--;
    } else {
      // 向左滑动，显示下一个
      currentIndex.value++;
    }

    // 更新卡片位置
    updateCardPosition();

    // 更新选中的毕业生
    selectedGraduate.value = graduates[currentIndex.value % graduates.length];
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
                <h3 class="section-title">
                  {{
                    selectedGraduate.isTeacher
                      ? isEnglish
                        ? "Class Advisor"
                        : "班导师"
                      : isEnglish
                      ? "Graduate"
                      : "毕业生"
                  }}
                </h3>
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
          <!-- 卡片列表 -->
          <div
            v-for="(graduate, index) in graduates"
            :key="graduate.id"
            class="mobile-graduate-card"
            :class="{ active: index === currentIndex }"
          >
            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 左侧区域 -->
              <div class="card-left">
                <!-- 卡片标题（左上角） -->
                <div class="card-title">
                  {{
                    graduate.isTeacher
                      ? isEnglish
                        ? "Class Advisor"
                        : "班导师寄语"
                      : isEnglish
                      ? "Graduate"
                      : "毕业生"
                  }}
                </div>

                <!-- 头像（标题下方） -->
                <div class="avatar-section">
                  <img
                    :src="graduate.avatar"
                    :alt="graduate.name.zh"
                    class="graduate-avatar"
                  />
                </div>

                <!-- 名字（底部） -->
                <div class="name-section">
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

              <!-- 右侧：毕业感言（中间位置） -->
              <div class="card-right">
                <div class="thoughts-section">
                  <p class="thoughts-text">
                    {{
                      isEnglish ? graduate.thoughts.en : graduate.thoughts.zh
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
    border-radius: 0; /* 方形卡片，无圆角 */
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
    justify-content: flex-start; /* 改为左对齐，配合transform定位 */
    padding: 0; /* 移除内边距，让卡片完全控制自己的位置 */
  }

  .mobile-carousel-container {
    display: flex;
    width: calc(100vw * 25); /* 25个毕业生卡片的总宽度 */
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
    padding: 40px 20px; /* 增加上下内边距 */
    box-sizing: border-box;
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
  }

  /* 卡片主体 */
  .card-body {
    background: white;
    border-radius: 20px; /* 增大圆角，匹配UI图 */
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row; /* 左右布局 */
    gap: 24px;
    border: 4px solid #052a1b; /* 增加边框宽度 */
    height: 320px; /* 增加高度以匹配UI图 */
    width: 100%;
    max-width: 600px; /* 限制最大宽度，避免过宽 */
    overflow: hidden;
    position: relative;
    margin: 0 auto; /* 水平居中 */
  }

  /* 左侧区域 */
  .card-left {
    flex: 0 0 180px; /* 增加宽度以匹配UI图 */
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  /* 卡片标题（左上角） */
  .card-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-bottom: 16px;
    text-align: left;
  }

  /* 头像区域（标题下方） */
  .avatar-section {
    display: flex;
    justify-content: flex-start;
    margin-bottom: auto; /* 推送名字到底部 */
  }

  .graduate-avatar {
    width: 140px;
    height: 140px;
    border-radius: 8px; /* 匹配UI图的圆角 */
    object-fit: cover;
  }

  /* 名字区域（底部） */
  .name-section {
    text-align: left;
    margin-top: auto; /* 确保在底部 */
  }

  /* 右侧区域（毕业感言中间位置） */
  .card-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
  }

  /* 毕业感言区域 */
  .thoughts-section {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thoughts-text {
    font-size: 14px;
    line-height: 1.8; /* 增加行高，匹配UI图 */
    color: #333;
    text-align: justify; /* 两端对齐，匹配UI图 */
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 12; /* 增加显示行数 */
    line-clamp: 12;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 名字区域样式 */
  .graduate-name {
    font-size: 24px; /* 增大字体，匹配UI图 */
    font-weight: bold;
    color: #333;
    margin: 0 0 4px 0;
    text-align: left;
  }

  .graduate-destination {
    font-size: 14px;
    color: #666;
    margin: 0;
    text-align: left;
    line-height: 1.4;
  }

  /* 隐藏桌面端元素 */
  .bg-image,
  .avatars-container,
  .right-rect-bg {
    display: none;
  }
}
</style>
