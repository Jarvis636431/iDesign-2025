<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { graduates } from "../../constants/graduates";
import GraduateCard from "../graduates/GraduateCard.vue";

const { t, tm, locale } = useI18n();
const isEnglish = computed(() => locale.value === "en");

const selectedGraduate = ref(graduates[0]);
const isHovering = ref(false);
const avatarsListRef = ref(null);
const avatarsContainerRef = ref(null);

// 移动端相关状态
const isMobile = ref(false);
const currentIndex = ref(0);
const cardsContainerRef = ref(null);

const normalizeIndex = (index, length) => {
  if (!length) return 0;
  return ((index % length) + length) % length;
};

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

// 更新卡片位置（支持轮播效果）
const updateCardPosition = () => {
  if (cardsContainerRef.value) {
    const cardWidth = window.innerWidth - 80; // 卡片宽度（减去左右边距）
    const totalCards = graduates.length;

    // 确保索引在有效范围内
    const normalizedIndex = normalizeIndex(currentIndex.value, totalCards);
    currentIndex.value = normalizedIndex;

    // 计算偏移量，让当前卡片居中
    const translateX = -normalizedIndex * cardWidth;
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
  
  const currentX = event.touches[0].clientX;
  const currentY = event.touches[0].clientY;
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;
  
  // 只有在水平滑动时才阻止默认行为
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    event.preventDefault();
  }
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

    currentIndex.value = normalizeIndex(currentIndex.value, graduates.length);
    // 更新卡片位置
    updateCardPosition();

    // 更新选中的毕业生
    const nextGraduateIndex = normalizeIndex(currentIndex.value, graduates.length);
    selectedGraduate.value = graduates[nextGraduateIndex];
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
                      ? t("graduates.labels.teacherDesktop")
                      : t("graduates.labels.graduate")
                  }}
                </h3>
                <div class="thoughts-section">
                  {{
                    t(
                      `graduates.items.${selectedGraduate.i18nKey}.thoughts`
                    )
                  }}
                </div>

                <div class="bottom-info">
                  <h2 class="graduate-name">
                    {{
                      t(`graduates.items.${selectedGraduate.i18nKey}.name`)
                    }}
                  </h2>
                  <div class="graduate-title">
                    {{
                      t(
                        `graduates.items.${selectedGraduate.i18nKey}.destination`
                      )
                    }}
                  </div>
                </div>
              </div>

              <div class="card-right">
                <div class="portrait-wrapper">
                  <img
                    :src="selectedGraduate.avatar"
                    :alt="
                      t(`graduates.items.${selectedGraduate.i18nKey}.name`)
                    "
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
            <div
              v-for="(line, index) in tm('graduates.poem') || []"
              :key="index"
              class="text-line"
            >
              {{ line }}
            </div>
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
              :i18n-key="graduate.i18nKey"
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
                      ? t("graduates.labels.teacherMobile")
                      : t("graduates.labels.graduate")
                  }}
                </div>

                <!-- 头像（标题下方） -->
                <div class="avatar-section">
                  <img
                    :src="graduate.avatar"
                    :alt="t(`graduates.items.${graduate.i18nKey}.name`)"
                    class="graduate-avatar"
                  />
                </div>

                <!-- 名字（底部） -->
                <div class="name-section">
                  <h2 class="graduate-name">
                    {{ t(`graduates.items.${graduate.i18nKey}.name`) }}
                  </h2>
                  <p
                    class="graduate-destination"
                    v-if="t(`graduates.items.${graduate.i18nKey}.destination`)"
                  >
                    {{ t(`graduates.items.${graduate.i18nKey}.destination`) }}
                  </p>
                </div>
              </div>

              <!-- 右侧：毕业感言（中间位置） -->
              <div class="card-right">
                <div class="thoughts-section">
                  <p class="thoughts-text">
                    {{ t(`graduates.items.${graduate.i18nKey}.thoughts`) }}
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
    overflow-x: hidden;
    overflow-y: visible; /* 允许竖直滚动 */
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
    width: calc((100vw - 80px) * 25); /* 调整总宽度，每张卡片左右留30px */
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更流畅的缓动 */
    padding: 0 40px; /* 左右内边距，让第一张和最后一张卡片也能居中 */
    box-sizing: border-box;
  }

  /* 移动端毕业生卡片 */
  .mobile-graduate-card {
    width: calc(100vw - 80px); /* 卡片宽度，左右各留30px */
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 40px 10px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 平滑过渡 */
    transform-origin: center; /* 缩放中心点 */
  }

  /* 当前激活的卡片 */
  .mobile-graduate-card.active {
    transform: scale(1.05); /* 放大当前卡片 */
    z-index: 10; /* 提高层级 */
  }

  /* 非激活的卡片 */
  .mobile-graduate-card:not(.active) {
    transform: scale(0.95); /* 缩小非当前卡片 */
    opacity: 0.7; /* 降低透明度 */
    z-index: 5; /* 较低层级 */
  }

  /* 卡片主体 */
  .card-body {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    border: 4px solid #052a1b;
    height: 500px; /* 恢复合适的高度 */
    width: 100%;
    max-width: 600px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    transition: all 0.3s ease; /* 添加过渡效果 */
  }

  /* 激活卡片的主体样式 */
  .mobile-graduate-card.active .card-body {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15); /* 增强阴影 */
    border-color: #052a1b;
  }

  /* 非激活卡片的主体样式 */
  .mobile-graduate-card:not(.active) .card-body {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* 减弱阴影 */
    border-color: rgba(5, 42, 27, 0.6); /* 淡化边框 */
  }

  /* 左侧区域 */
  .card-left {
    flex: 0 0 160px; /* 增加宽度以匹配UI图 */
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px; /* 确保有足够高度显示所有内容 */
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
    flex: 1; /* 占据剩余空间 */
    align-items: flex-start; /* 头像靠上对齐 */
    margin: 8px 0; /* 上下边距 */
  }

  .graduate-avatar {
    width: 140px;
    height: 140px;
    border-radius: 8px; /* 恢复圆角 */
    object-fit: cover;
  }

  /* 名字区域（底部） */
  .name-section {
    margin-top: auto; /* 确保在底部 */
    padding-top: 8px; /* 添加一些上边距 */
    min-height: 60px; /* 确保有足够高度显示名字 */
    display: flex;
    flex-direction: column; /* 垂直排列名字和去向 */
    justify-content: flex-end; /* 内容靠底部对齐 */
    align-items: flex-start; /* 内容靠左对齐 */
    width: 100%; /* 占满左侧区域宽度 */
  }

  /* 右侧区域（毕业感言中间位置） */
  .card-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 毕业感言区域 */
  .thoughts-section {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thoughts-text {
    margin-top: 80px;
    font-size: 12px;
    line-height: 1; /* 增加行高，匹配UI图 */
    color: #333;
    text-align: justify; /* 两端对齐，匹配UI图 */
    word-wrap: break-word;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: auto; /* 增加显示行数 */
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
    line-height: 1.2;
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
