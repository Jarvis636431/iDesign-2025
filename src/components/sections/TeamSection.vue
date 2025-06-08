<!-- TeamSection.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { staffGroups } from "../../constants/staff";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const rectangles = ref([]);
const isMobile = ref(false);
let scrollHandler = null;

onMounted(() => {
  checkMobile();
  initializeRectangles();
  setupScrollHandler();
  window.addEventListener("resize", () => {
    checkMobile();
    initializeRectangles(); // 重新初始化卡片位置
  });

  // 调试信息
  console.log("TeamSection mounted, isMobile:", isMobile.value);
  console.log("Total rectangles:", rectangles.value.length);
});

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onBeforeUnmount(() => {
  if (scrollHandler) {
    document
      .querySelector(".scroll-container")
      .removeEventListener("scroll", scrollHandler);
  }
  window.removeEventListener("resize", checkMobile);
});

const initializeRectangles = () => {
  rectangles.value = staffGroups.map((group, index) => {
    if (isMobile.value) {
      // 移动端：简单的自上到下排列
      console.log(`Mobile card ${index}: vertical layout`);

      return {
        ...group,
        position: "mobile", // 使用新的position标识
        translateY: 0, // 不需要垂直偏移
        translateX: 0, // 不需要水平偏移
      };
    } else {
      // PC端：原有的上下错开布局
      const isTop = index % 2 === 1;
      const positionIndex = Math.floor(index / 2);
      const groupsInRow = Math.ceil(staffGroups.length / 2);

      // 基础间距设为35vw
      let horizontalOffset = (positionIndex - (groupsInRow - 1) / 2) * 35;
      // 整体向左偏移，让第一个矩形更靠左
      horizontalOffset -= 35;

      // 上下都向右错开，但错开距离不同
      horizontalOffset += isTop ? 24 : 6;

      return {
        ...group,
        position: isTop ? "top" : "bottom",
        translateY: isTop ? -60 : 60,
        translateX: horizontalOffset,
      };
    }
  });
};

const setupScrollHandler = () => {
  const scrollContainer = document.querySelector(".scroll-container");
  if (!scrollContainer) return;

  scrollHandler = () => {
    const containerWidth = window.innerWidth;

    // 更新每个矩形的位置
    rectangles.value = rectangles.value.map((rect) => {
      // 获取矩形元素
      const rectElement = document.querySelector(`#team-rect-${rect.id}`);
      if (!rectElement) return rect;

      const rectBounds = rectElement.getBoundingClientRect();
      let progress = 0;

      // 计算每个矩形自己的进度
      if (rectBounds.right > 0 && rectBounds.left < containerWidth) {
        // 当矩形开始进入视口，根据其位置计算进度
        progress = (containerWidth - rectBounds.left) / containerWidth;
        // 限制进度在 0-1 之间
        progress = Math.max(0, Math.min(1, progress));
      } else if (rectBounds.left >= containerWidth) {
        progress = 0;
      } else {
        progress = 1;
      }

      // 使用缓动函数使动画更平滑
      const easeProgress = easeInOutCubic(progress);

      if (isMobile.value) {
        // 移动端：横向滚动时卡片向对侧移动
        return {
          ...rect,
          translateY:
            rect.position === "top"
              ? -40 + easeProgress * 80 // 移动端减小移动范围
              : 40 - easeProgress * 80,
          translateX: rect.translateX,
        };
      } else {
        // PC端：原有逻辑
        return {
          ...rect,
          translateY:
            rect.position === "top"
              ? -60 + easeProgress * 120
              : 60 - easeProgress * 120,
          translateX: rect.translateX,
        };
      }
    });
  };

  scrollContainer.addEventListener("scroll", scrollHandler);
};

const easeInOutCubic = (x) => {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
</script>

<template>
  <section
    class="content-section"
    id="team"
    :class="{ 'mobile-layout': isMobile }"
  >
    <div class="team-container" :class="{ 'mobile-container': isMobile }">
      <div
        v-for="rectangle in rectangles"
        :key="rectangle.id"
        :id="`team-rect-${rectangle.id}`"
        class="team-rectangle"
        :class="[rectangle.position, { 'mobile-rectangle': isMobile }]"
        :style="
          isMobile
            ? {}
            : {
                transform: `translate(calc(${rectangle.translateX}vw + 50%), ${rectangle.translateY}%)`,
              }
        "
      >
        <h3>{{ rectangle.name }}</h3>
        <div class="members-grid" :class="{ 'mobile-grid': isMobile }">
          <div
            v-for="member in rectangle.members"
            :key="member.id"
            class="member-card"
            :class="{ 'mobile-card': isMobile }"
          >
            <img
              :src="`${member.avatar}`"
              :alt="member.name.zh"
              class="member-avatar"
              :class="{ 'mobile-avatar': isMobile }"
            />
            <div class="member-info">
              <h4>{{ isEnglish ? member.name.en : member.name.zh }}</h4>
              <p>{{ isEnglish ? member.role.en : member.role.zh }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  width: 200vw;
  height: 100vh;
  position: relative;
  background-color: #052a1b;
  overflow: visible;
}

.team-container {
  width: 200vw;
  height: 100vh;
  position: relative;
}

.team-rectangle {
  position: absolute;
  left: 100vw;
  width: 160px; /* 照片宽度 + 边距 */
  height: auto; /* 自适应内容高度 */
  background-color: #fff0ca;
  padding: 1.2rem;
  transition: all 0.3s ease-out;
  overflow: visible; /* 改为 visible */
}

.team-rectangle.top {
  top: 1vh;
}

.team-rectangle.bottom {
  bottom: 1vh;
}

.team-rectangle h3 {
  color: #333333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.6rem;
  white-space: nowrap;
}

.members-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.3rem;
}

.member-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
}

.member-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.member-info {
  color: #333333;
  width: 100%;
}

.member-info h4 {
  font-size: 1rem;
  margin: 0 0 0.3rem 0;
  font-weight: 500;
  white-space: nowrap;
}

.member-info p {
  font-size: 0.85rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.3;
}

/* 移动端适配 */
@media (max-width: 768px) {
  /* 确保body不会出现横向滚动 */
  :global(body) {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }

  .content-section.mobile-layout {
    width: 100vw !important; /* 移动端恢复正常宽度 */
    height: auto !important; /* 自适应高度 */
    min-height: calc(100vh - 60px); /* 最小高度 */
    overflow-x: hidden !important; /* 隐藏横向滚动 */
    overflow-y: visible; /* 允许纵向滚动 */
    max-width: 100vw; /* 确保不超过视口宽度 */
  }

  .team-container.mobile-container {
    width: 100vw;
    height: auto;
    position: relative;
    display: flex;
    flex-direction: column; /* 纵向排列 */
    gap: 2rem; /* 卡片间距 */
    padding: 2rem 1rem; /* 容器内边距 */
    overflow-x: hidden; /* 隐藏横向滚动 */
    box-sizing: border-box; /* 确保padding不会增加总宽度 */
  }

  .team-rectangle.mobile-rectangle {
    position: relative !important; /* 改为相对定位 */
    left: auto !important;
    top: auto !important;
    bottom: auto !important;
    width: 100%; /* 占满容器宽度 */
    max-width: 100%; /* 限制最大宽度 */
    height: auto;
    background-color: #fff0ca;
    padding: 0; /* 移除内边距，让子元素控制 */
    transition: all 0.3s ease-out;
    overflow: hidden; /* 隐藏超出部分 */
    border-radius: 0; /* 去掉卡片圆角 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex; /* 使用flex布局 */
    flex-direction: row; /* 水平排列：侧边标题 + 内容区域 */
    box-sizing: border-box; /* 确保边框和内边距不增加宽度 */
  }

  .team-rectangle.mobile-rectangle h3 {
    font-size: 1rem; /* 减小标题字体 */
    margin-bottom: 0.8rem;
    color: #333333;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 0.5rem;
    white-space: nowrap;
  }

  .team-rectangle.mobile-rectangle h3 {
    font-size: 1rem;
    margin: 0;
    color: #333333; /* 深色文字 */
    text-align: center;
    white-space: nowrap;
    writing-mode: vertical-rl; /* 纵向文字，从右到左 */
    text-orientation: mixed; /* 文字方向 */
    background-color: #fff0ca; /* 米黄色背景 */
    padding: 1rem 0.8rem; /* 上下内边距大，左右内边距小 */
    border-radius: 0; /* 去掉圆角 */
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px; /* 最小宽度 */
    flex-shrink: 0; /* 不被压缩 */
    border-right: 2px solid rgba(5, 42, 27, 0.2); /* 添加右边框分割线 */
  }

  .members-grid.mobile-grid {
    display: flex;
    flex-direction: row; /* 横向排列成员 */
    gap: 1rem;
    padding: 1.5rem; /* 内容区域内边距 */
    overflow-x: auto; /* 支持横向滚动 */
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
    flex: 1; /* 占据剩余空间 */
    background-color: #fff0ca; /* 确保背景色 */
    border-radius: 0; /* 去掉圆角 */
    max-width: 100%; /* 限制最大宽度 */
    box-sizing: border-box; /* 确保padding不增加宽度 */
  }

  .member-card.mobile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
    text-align: center;
    flex-shrink: 0; /* 防止被压缩 */
    width: auto; /* 自适应宽度 */
    min-width: 100px; /* 最小宽度 */
    background: rgba(255, 255, 255, 0.1);
  }

  .member-card.mobile-card:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.2);
  }

  .member-avatar.mobile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 0; /* 完全方形，无圆角 */
    object-fit: cover;
    margin-bottom: 0.8rem;
    border: 2px solid rgba(5, 42, 27, 0.3);
  }

  .mobile-card .member-info {
    color: #333333;
    width: 100%;
  }

  .mobile-card .member-info h4 {
    font-size: 0.9rem;
    margin: 0 0 0.3rem 0;
    font-weight: 600;
    white-space: normal; /* 允许换行 */
    word-wrap: break-word; /* 长单词换行 */
    text-align: center;
    line-height: 1.3;
  }

  .mobile-card .member-info p {
    font-size: 0.75rem;
    opacity: 0.8;
    margin: 0;
    line-height: 1.2;
    white-space: normal; /* 允许换行 */
    word-wrap: break-word; /* 长单词换行 */
    text-align: center;
  }
}
</style>
