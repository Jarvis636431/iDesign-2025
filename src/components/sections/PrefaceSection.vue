<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

// 第三部分的引用
const part3Ref = ref(null);

// 鼠标位置
const cursorX = ref(0);
const cursorY = ref(0);
const showCursor = ref(false);

// 圆盘半径
const circleRadius = 75;

// 计算clip-path样式
const clipPathStyle = computed(() => {
  if (!showCursor.value) return "circle(0px at 50% 50%)";
  return `circle(${circleRadius}px at ${cursorX.value}px ${cursorY.value}px)`;
});

// 鼠标移动处理
const handleMouseMove = (event) => {
  if (!part3Ref.value) return;

  const rect = part3Ref.value.getBoundingClientRect();
  cursorX.value = event.clientX - rect.left;
  cursorY.value = event.clientY - rect.top;
};

// 鼠标进入第三部分
const handleMouseEnter = () => {
  showCursor.value = true;
  document.body.style.cursor = "none"; // 隐藏默认光标
};

// 鼠标离开第三部分
const handleMouseLeave = () => {
  showCursor.value = false;
  document.body.style.cursor = "auto"; // 恢复默认光标
};

onMounted(() => {
  if (part3Ref.value) {
    part3Ref.value.addEventListener("mousemove", handleMouseMove);
    part3Ref.value.addEventListener("mouseenter", handleMouseEnter);
    part3Ref.value.addEventListener("mouseleave", handleMouseLeave);
  }
});

onUnmounted(() => {
  if (part3Ref.value) {
    part3Ref.value.removeEventListener("mousemove", handleMouseMove);
    part3Ref.value.removeEventListener("mouseenter", handleMouseEnter);
    part3Ref.value.removeEventListener("mouseleave", handleMouseLeave);
  }
  document.body.style.cursor = "auto"; // 确保恢复光标
});
</script>

<template>
  <section class="content-section" id="preface">
    <div class="preface-container">
      <!-- 第一部分：鼠标图片展示 -->
      <div class="section-part part-1">
        <div class="mouse-container">
          <img src="/assets/images/mouse.png" alt="Mouse" class="mouse-image" />
        </div>
      </div>

      <!-- 第二部分：文字和背景图 -->
      <div class="section-part part-2">
        <div class="text-with-bg">
          <!-- 左上角文字 -->
          <div class="text-top-left">
            <div class="vertical-text">
              {{ isEnglish ? "Wind from the South" : "南方来风" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "Wings for New Sprouts" : "不烈不喧却润物无声" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "A Symphony of Design" : "它唤醒沉潜的种子" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "A Symphony of Design" : "催动万物生长" }}
            </div>
          </div>

          <!-- 右下角文字 -->
          <div class="text-bottom-right">
            <div class="vertical-text">
              {{
                isEnglish ? "Every design tells a story" : "第十一届设计年展"
              }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "of growth and dreams" : "亦是新十年的序章" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "of growth and dreams" : "十年之后" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "of growth and dreams" : "我们回望教育历程" }}
            </div>
            <div class="vertical-text">
              {{ isEnglish ? "of growth and dreams" : "更怀想未来图景" }}
            </div>
          </div>
        </div>
      </div>

      <!-- 第三部分：logo和引导文字 -->
      <div class="section-part part-3" ref="part3Ref">
        <div class="logo-section">
          <!-- 背景logo -->
          <div class="logo-container">
            <img
              src="/assets/images/logos/grey-logo.svg"
              alt="Logo"
              class="grey-logo"
            />
          </div>

          <!-- 中间文字 - 正常层 -->
          <div class="guide-text-container">
            <div class="guide-text-line">
              {{ isEnglish ? "You are about to enter" : "您即将步入" }}
            </div>
            <div class="guide-text-line forest-text">
              {{ isEnglish ? "Forest in the Wind" : "风中之林" }}
            </div>
            <div class="guide-text-line">
              {{ isEnglish ? "Five Exhibition Areas" : "五方展区" }}
            </div>
          </div>

          <!-- 隐藏层 - 圆盘内显示的内容 -->
          <div class="hidden-layer" :style="{ clipPath: clipPathStyle }">
            <!-- 1. 大白色圆盘背景 (最底层) -->
            <div class="large-white-circle"></div>

            <!-- 2. color-logo (第二层) -->
            <div class="logo-container">
              <img
                src="/assets/images/logos/color-logo.svg"
                alt="Color Logo"
                class="color-logo"
              />
            </div>

            <!-- 3. 小白色圆盘 (第三层) -->
            <div class="small-white-circle"></div>

            <!-- 4. 文字 (最顶层) -->
            <div class="guide-text-container hidden-text">
              <div class="guide-text-line">既是风的旅程</div>
              <div class="guide-text-line">亦是思维与设计的演化足迹</div>
              <div class="guide-text-line">或穿行</div>
              <div class="guide-text-line">或驻足</div>
              <div class="guide-text-line">您可静听作品的生长故事</div>
            </div>
          </div>

          <!-- 自定义光标 -->
          <div
            class="custom-cursor"
            :style="{
              left: cursorX + 'px',
              top: cursorY + 'px',
              opacity: showCursor ? 1 : 0,
            }"
          ></div>
        </div>
      </div>

      <!-- 第四部分：纯文字展示 -->
      <div class="section-part part-4">
        <div class="text-only-content">
          <div class="belief-section">
            <div class="belief-header">
              {{ isEnglish ? "We Believe" : "我们相信" }}
            </div>
            <div class="belief-content">
              <div class="belief-line">
                {{ isEnglish ? "Truly powerful design" : "真正有力量的设计" }}
              </div>
              <div class="belief-line">
                {{ isEnglish ? "Is not born from noise" : "非因声势" }}
              </div>
              <div class="belief-line">
                <template v-if="isEnglish">
                  But in the
                  <span class="highlight-yellow">reverence of wind</span>
                </template>
                <template v-else>
                  而在<span class="highlight-yellow">风的敬畏</span>
                </template>
              </div>
              <div class="belief-line">
                {{ isEnglish ? "Not mere imitation" : "不唯模仿" }}
              </div>
              <div class="belief-line">
                <template v-if="isEnglish">
                  But in the
                  <span class="highlight-yellow">awakening of growth</span>
                </template>
                <template v-else>
                  而在<span class="highlight-yellow">生长自觉</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第五部分：图片和文字组合 -->
      <div class="section-part part-5">
        <div class="image-text-combo">
          <div class="image-section">
            <img
              src="/assets/images/colorful-backimg.png"
              alt="Design Inspiration"
              class="feature-image"
            />
          </div>
          <div class="text-section">
            <h3 class="section-title">
              {{ isEnglish ? "Our Vision" : "我们的愿景" }}
            </h3>
            <p class="vision-text">
              {{
                isEnglish
                  ? "To cultivate the next generation of designers who will shape the future through innovative thinking and creative solutions."
                  : "培养下一代设计师，他们将通过创新思维和创意解决方案塑造未来。"
              }}
            </p>
            <div class="highlight-stats">
              <div class="stat-item">
                <span class="stat-number">11</span>
                <span class="stat-label">{{ isEnglish ? "Years" : "届" }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">2025</span>
                <span class="stat-label">{{
                  isEnglish ? "Exhibition" : "年展"
                }}</span>
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
  width: 750vw !important; /* 扩展到750vw (150+250+150+100+100) */
  height: 100vh;
  position: relative;
  background: #052a1b;
  overflow: visible;
  padding: 0;
  margin: 0;
}

.preface-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  position: relative;
}

.section-part {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0; /* 防止压缩 */
}

/* 各部分的具体宽度设置 */
.part-1 {
  width: 150vw; /* 第一部分：150vw */
}

.part-2 {
  width: 250vw; /* 第二部分：250vw */
}

.part-3 {
  width: 150vw; /* 第三部分：150vw */
}

.part-4 {
  width: 100vw; /* 第四部分：100vw */
}

.part-5 {
  width: 100vw; /* 第五部分：100vw */
}

/* 第一部分：鼠标图片 */
.part-1 {
  background: #052a1b;
}

.mouse-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.mouse-image {
  width: 120px;
  height: auto;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.mouse-image:hover {
  transform: scale(1.1);
}

/* 第二部分：文字和背景图 (250vw宽度) */
.part-2 {
  background-image: url("/assets/images/backimg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #052a1b; /* 统一背景色 */
}

.text-with-bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(5, 42, 27, 0.7); /* 半透明遮罩 */
}

/* 左上角文字容器 */
.text-top-left {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 30rem;
  padding-top: 3rem;
  display: flex;
  gap: 2rem;
}

/* 右下角文字容器 */
.text-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
  padding-right: 60rem;
  padding-bottom: 3rem;
  display: flex;
  gap: 2rem;
}

/* 竖直文字样式 */
.vertical-text {
  writing-mode: vertical-rl; /* 竖直排列，从右到左 */
  text-orientation: upright; /* 文字保持正立 */
  color: white;
  font-size: 2.2rem;
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: 0.5em;
  white-space: nowrap; /* 防止换行 */
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
}

/* 第三部分：logo和引导文字 */
.part-3 {
  background: #052a1b;
}

.logo-section {
  width: 100%;
  height: 100vh; /* 明确设置高度 */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible; /* 确保不会裁剪内容 */
}

.logo-container {
  position: absolute;
  width: 100%;
  height: 100vh; /* 明确设置为100vh */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  overflow: visible; /* 确保内容不会被裁剪 */
}

.grey-logo {
  max-width: 100%;
  max-height: 100vh; /* 限制最大高度，确保不会被截断 */
  width: auto;
  height: auto;
  opacity: 0.3; /* 让logo作为背景，透明度较低 */
  object-fit: contain; /* 保持比例，完整显示 */
}

.guide-text-container {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  margin-left: 8%; /* 向右挪移一点 */
}

.guide-text-line {
  font-size: 2.8rem;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.95;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
}

.guide-text-line:last-child {
  margin-bottom: 0;
}

/* 隐藏层样式 */
.hidden-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

/* 隐藏层中的color-logo样式 */
.color-logo {
  max-width: 152%; /* 放大color-logo */
  max-height: 152vh; /* 放大color-logo */
  width: auto;
  height: auto;
  opacity: 1;
  object-fit: contain;
  z-index: 2;
  position: relative;
  margin-top: -6%; /* 向上移动10% */
}

/* 1. 大白色圆盘背景 (z-index: 1) */
.large-white-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vw;
  background: #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

/* 2. color-logo 保持原有z-index: 2 */

/* 3. 小白色圆盘 (z-index: 3) */
.small-white-circle {
  position: absolute;
  top: 50%;
  left: 53.8%; /* 向右移动 */
  width: 500px;
  height: 500px;
  background: #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

/* 4. 文字样式 (z-index: 4) */
.hidden-text {
  position: absolute;
  top: 50%;
  left: 46%; /* 与小圆盘保持一致 */
  transform: translate(-50%, -50%);
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 350px;
  padding: 2rem;
  box-sizing: border-box;
}

.hidden-text .guide-text-line {
  color: #333333; /* 深色文字，适合白色背景 */
  text-shadow: none;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 统一使用苹方字体 */
  text-align: center; /* 文字居中 */
  margin-bottom: 0.5rem; /* 减少行间距以适应更多行 */
  font-size: 1.4rem; /* 调整字体大小以适应更多行文字 */
  line-height: 1.3; /* 调整行高 */
}

/* 自定义光标样式 */
.custom-cursor {
  position: absolute;
  width: 10px; /* 调小光标尺寸 */
  height: 150px; /* 调小光标尺寸 */
  border-radius: 50%;
  pointer-events: none;
  z-index: 4;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
}

/* 特殊样式：风中之林 */
.forest-text {
  font-family: "slidefu", sans-serif !important;
  font-size: 144px !important;
  color: #ffe29a !important; /* 设置为黄色 */
  margin-bottom: 2rem !important; /* 增加下边距 */
}

/* 第四部分：纯文字展示 */
.part-4 {
  background: #052a1b;
  color: white;
}

.text-only-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center; /* 居中对齐 */
  align-items: center;
  padding: 3rem;
  padding-right: 20%; /* 整体向右偏移 */
}

.belief-section {
  text-align: center; /* 文字居中对齐 */
  max-width: 600px;
}

.belief-header {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: 300;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
}

.belief-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.belief-line {
  font-size: 2.2rem;
  color: white;
  line-height: 1.4;
  font-weight: 300;
  opacity: 0.95;
  text-align: center;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
}

/* 特定文字的黄色高亮 */
.highlight-yellow {
  color: #ffe29a;
}

/* 第五部分：图片和文字组合 */
.part-5 {
  background: #052a1b;
}

.image-text-combo {
  display: flex;
  align-items: center;
  max-width: 1200px;
  gap: 4rem;
  padding: 3rem;
}

.image-section {
  flex: 1;
}

.feature-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-image:hover {
  transform: scale(1.02);
}

.text-section {
  flex: 1;
  color: white; /* 改为白色以适应深绿背景 */
}

.section-title {
  font-size: 2.5rem;
  color: #ffe29a; /* 改为黄色以保持一致性 */
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.vision-text {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: white; /* 改为白色 */
}

.highlight-stats {
  display: flex;
  gap: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #2fa3b0;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 1.1rem;
  color: white; /* 改为白色 */
  margin-top: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-section {
    width: 100vw !important;
  }

  .preface-container {
    flex-direction: column;
    width: 100vw;
    height: 500vh; /* 5个部分垂直排列 */
  }

  .part-1,
  .part-2,
  .part-3,
  .part-4,
  .part-5 {
    width: 100vw; /* 移动端所有部分都是100vw */
    height: 100vh;
  }

  .text-only-content {
    padding-right: 3rem; /* 移动端减少右偏移 */
  }

  .belief-section {
    text-align: center; /* 移动端保持居中对齐 */
  }

  .belief-line {
    font-size: 1.8rem; /* 移动端字体稍小 */
    font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 移动端也使用苹方字体 */
  }

  .vertical-text {
    font-size: 1.8rem; /* 移动端字体稍小 */
    writing-mode: horizontal-tb; /* 移动端改为水平排列 */
    text-orientation: mixed;
    font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 移动端也使用苹方字体 */
  }

  .text-top-left,
  .text-bottom-right {
    padding: 2rem; /* 移动端减少padding */
  }

  .text-top-left {
    flex-direction: column; /* 移动端垂直排列 */
  }

  .text-bottom-right {
    flex-direction: column; /* 移动端垂直排列 */
  }

  .grey-logo {
    width: 80%; /* 移动端logo稍大一些 */
  }

  .guide-text-line {
    font-size: 2rem; /* 移动端字体稍小 */
    margin-bottom: 1rem;
    font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 移动端也使用苹方字体 */
  }

  .forest-text {
    font-size: 72px !important; /* 移动端"风中之林"字体大小 */
  }

  /* 移动端禁用圆盘效果 */
  .hidden-layer {
    display: none;
  }

  .custom-cursor {
    display: none;
  }

  .image-text-combo {
    flex-direction: column;
    gap: 2rem;
  }

  .main-quote {
    font-size: 1.5rem;
  }

  .highlight-stats {
    justify-content: center;
  }
}
</style>
