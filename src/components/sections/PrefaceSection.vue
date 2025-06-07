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
// 第二部分的引用
const part2Ref = ref(null);

// 鼠标位置
const cursorX = ref(0);
const cursorY = ref(0);
const showCursor = ref(false);

// 视差滚动相关
const scrollY = ref(0);
const part2ScrollOffset = ref(0);

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

// 滚动处理函数
const handleScroll = () => {
  scrollY.value = window.scrollY;

  if (part2Ref.value) {
    const rect = part2Ref.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 计算第二部分在视窗中的位置
    const elementTop = rect.top;
    const elementHeight = rect.height;

    // 当元素在视窗中时计算视差偏移
    if (elementTop < windowHeight && elementTop + elementHeight > 0) {
      // 视差因子：文字移动速度是背景的0.5倍（更慢）
      const parallaxFactor = 0.5;
      const scrollProgress =
        (windowHeight - elementTop) / (windowHeight + elementHeight);
      part2ScrollOffset.value = scrollProgress * 100 * (1 - parallaxFactor);
    }
  }
};

// 计算文字的transform样式
const textTransformStyle = computed(() => {
  return {
    transform: `translateY(${part2ScrollOffset.value}px)`,
    transition: "transform 0.1s ease-out",
  };
});

onMounted(() => {
  if (part3Ref.value) {
    part3Ref.value.addEventListener("mousemove", handleMouseMove);
    part3Ref.value.addEventListener("mouseenter", handleMouseEnter);
    part3Ref.value.addEventListener("mouseleave", handleMouseLeave);
  }

  // 添加滚动监听
  window.addEventListener("scroll", handleScroll);
  // 初始计算一次
  handleScroll();
});

onUnmounted(() => {
  if (part3Ref.value) {
    part3Ref.value.removeEventListener("mousemove", handleMouseMove);
    part3Ref.value.removeEventListener("mouseenter", handleMouseEnter);
    part3Ref.value.removeEventListener("mouseleave", handleMouseLeave);
  }

  // 移除滚动监听
  window.removeEventListener("scroll", handleScroll);
  document.body.style.cursor = "auto"; // 确保恢复光标
});
</script>

<template>
  <section class="content-section" id="preface">
    <div class="preface-container">
      <!-- 第一部分：鼠标图片展示 -->
      <div class="section-part part-1">
        <div class="mouse-container">
          <!-- 黄色底色背景 -->
          <div class="yellow-background">
            <img
              src="/assets/images/mouse.png"
              alt="Mouse"
              class="mouse-image"
            />
            <!-- 文字说明 -->
            <div class="mouse-text">
              {{ isEnglish ? "Scroll" : "滚动滚轮" }}
            </div>
          </div>
        </div>
      </div>

      <!-- 第二部分：文字和背景图 -->
      <div class="section-part part-2" ref="part2Ref">
        <div class="text-with-bg">
          <!-- 左上角文字 -->
          <div
            class="text-top-left parallax-text"
            :class="{ 'horizontal-layout': isEnglish }"
            :style="textTransformStyle"
          >
            <div
              class="vertical-text english-poem"
              :class="{ 'horizontal-text': isEnglish }"
              v-if="isEnglish"
            >
              A Southern breeze, so soft and low,<br />
              Awakens seeds, helps all things grow.
            </div>
            <template v-else>
              <div class="vertical-text">南方来风</div>
              <div class="vertical-text">不烈不喧却润物无声</div>
              <div class="vertical-text">它唤醒沉潜的种子</div>
              <div class="vertical-text">催动万物生长</div>
            </template>
          </div>

          <!-- 右下角文字 -->
          <div
            class="text-bottom-right parallax-text"
            :class="{ 'horizontal-layout': isEnglish }"
            :style="textTransformStyle"
          >
            <div
              class="vertical-text english-poem"
              :class="{ 'horizontal-text': isEnglish }"
              v-if="isEnglish"
            >
              A Southern breeze, so soft and low,<br />
              Awakens seeds, helps all things grow.
            </div>
            <template v-else>
              <div class="vertical-text">第十一届设计年展</div>
              <div class="vertical-text">亦是新十年的序章</div>
              <div class="vertical-text">十年之后</div>
              <div class="vertical-text">我们回望教育历程</div>
              <div class="vertical-text">更怀想未来图景</div>
            </template>
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
            <div class="guide-text-line" :class="{ 'english-text': isEnglish }">
              {{ isEnglish ? "step inside the" : "您即将步入" }}
            </div>
            <div
              class="guide-text-line forest-text"
              :class="{ 'english-text': isEnglish }"
            >
              {{ isEnglish ? "Forest in Wind" : "风中之林" }}
            </div>
            <div class="guide-text-line" :class="{ 'english-text': isEnglish }">
              {{ isEnglish ? "exhibition" : "五方展区" }}
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
              <div
                class="guide-text-line"
                :class="{ 'english-text': isEnglish }"
              >
                {{ isEnglish ? "Wind's journey" : "既是风的旅程" }}
              </div>
              <div
                class="guide-text-line"
                :class="{ 'english-text': isEnglish }"
              >
                {{
                  isEnglish
                    ? "design's evolving stride"
                    : "亦是思维与设计的演化足迹"
                }}
              </div>
              <div
                class="guide-text-line"
                :class="{ 'english-text': isEnglish }"
              >
                {{ isEnglish ? "Or pause and hear" : "或穿行" }}
              </div>
              <div
                class="guide-text-line"
                :class="{ 'english-text': isEnglish }"
              >
                {{ isEnglish ? "if you so please" : "或驻足" }}
              </div>
              <div
                class="guide-text-line"
                :class="{ 'english-text': isEnglish }"
              >
                {{
                  isEnglish
                    ? "Each growing tale upon the breeze."
                    : "您可静听作品的生长故事"
                }}
              </div>
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
              <template v-if="isEnglish">
                <!-- 英文四行诗歌 -->
                <div class="belief-line english-line-1">
                  True design's strength, not loud acclaim,
                </div>
                <div class="belief-line english-line-2">
                  But wind's keen sense, and growth's true flame.
                </div>
                <div class="belief-line english-line-3">
                  Not mimicry's art, so quickly past,
                </div>
                <div class="belief-line english-line-4">
                  But self-aware growth, meant to last.
                </div>
              </template>
              <template v-else>
                <!-- 中文原有内容 -->
                <div class="belief-line">真正有力量的设计</div>
                <div class="belief-line">非因声势</div>
                <div class="belief-line">
                  而在<span class="highlight-yellow">风的敬畏</span>
                </div>
                <div class="belief-line">不唯模仿</div>
                <div class="belief-line">
                  而在<span class="highlight-yellow">生长自觉</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 第五部分：蒲公英主题展示 -->
      <div class="section-part part-5">
        <div class="dandelion-section">
          <!-- 中心蒲公英背景图片 -->
          <div class="center-dandelion">
            <img
              src="/assets/images/dandelion-background.png"
              alt="Dandelion Background"
              class="dandelion-bg"
            />

            <!-- 中心文字内容 -->
            <div
              class="center-text-content"
              :class="{ 'english-layout': isEnglish }"
            >
              <!-- 第一部分：今天/Now (靠上) -->
              <div class="text-part-1" :class="{ 'english-text': isEnglish }">
                {{ isEnglish ? "Now" : "今天" }}
              </div>

              <!-- 第二部分：中间两行 (居中，最大字号，黄色) -->
              <div class="text-part-2" :class="{ 'english-text': isEnglish }">
                <template v-if="isEnglish">
                  The Wind is Here<br />
                  New shoots Aspire
                </template>
                <template v-else> 风已致，新苗起 </template>
              </div>

              <!-- 第三部分：下方三行文字 (靠下) -->
              <div class="text-part-3" :class="{ 'english-text': isEnglish }">
                <template v-if="isEnglish">
                  <div class="text-line">
                    Come feel the "Wind in Forest" fire.
                  </div>
                  <div class="text-line">With us behold, a vision bright,</div>
                  <div class="text-line">
                    New talent dawning, pure and light.
                  </div>
                </template>
                <template v-else>
                  <div class="text-line">诚邀您一同感受这</div>
                  <div class="text-line highlight">"林中之风"</div>
                  <div class="text-line">见证</div>
                  <div class="text-line">新设计人的萌发与远望</div>
                </template>
              </div>
            </div>
          </div>

          <!-- 精选蒲公英分布 -->
          <div class="floating-dandelions">
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-1"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-2"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-3"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-4"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-5"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-6"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-7"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-8"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-9"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-10"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-11"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-12"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-13"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-14"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-15"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-16"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-17"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-18"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-19"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-20"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-21"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-22"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-23"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-24"
              alt="Dandelion"
            />
            <!-- 新增16个蒲公英，总计40个 -->
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-25"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-26"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-27"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-28"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-29"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-30"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-31"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-32"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-33"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-34"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-35"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-36"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-37"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-38"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-39"
              alt="Dandelion"
            />
            <img
              src="/assets/images/dandelion.png"
              class="floating-dandelion dandelion-40"
              alt="Dandelion"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 加载Voyage字体 */
@font-face {
  font-family: "Voyage";
  src: url("assets/fonts/Voyage.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.content-section {
  width: 950vw !important; /* 扩展到950vw (150+250+150+100+300) */
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
  width: 300vw; /* 第五部分：300vw */
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
  width: 30px; /* 从120px缩小到80px */
  height: auto;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.mouse-image:hover {
  transform: scale(1.1);
}

/* 黄色背景容器 */
.yellow-background {
  background-color: #ffe29a; /* 黄色背景 */
  border-radius: 50%; /* 改为圆形 */
  width: 90px; /* 设置固定宽度 */
  height: 90px; /* 设置固定高度，与宽度相等形成圆形 */
  display: flex;
  gap: 0.3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.yellow-background:hover {
  transform: translateY(-5px); /* 悬停时轻微上移 */
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15); /* 悬停时加深阴影 */
}

/* 鼠标文字样式 */
.mouse-text {
  font-size: 1rem; /* 减小字体以适应圆形容器 */
  font-weight: bold;
  color: #052a1b; /* 深色文字，在黄色背景上清晰可见 */
  text-align: center;
}

/* 中文字体 */
.mouse-text:not([lang="en"]) {
  font-family: "MFXiHei", "PingFang SC", -apple-system, BlinkMacSystemFont,
    sans-serif;
}

/* 英文字体 */
.mouse-text[lang="en"] {
  font-family: "Futura", "Arial", sans-serif;
}

/* 根据语言动态设置字体 */
[lang="zh"] .mouse-text {
  font-family: "MFXiHei", "PingFang SC", -apple-system, BlinkMacSystemFont,
    sans-serif;
}

[lang="en"] .mouse-text {
  font-family: "Futura", "Arial", sans-serif;
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

/* 左上角文字容器 - 默认中文布局 */
.text-top-left {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 30rem;
  padding-top: 3rem;
  display: flex;
  flex-direction: row; /* 中文竖直文字横向排列 */
  align-items: flex-start; /* 向上对齐 */
  gap: 2rem;
  transition: all 0.3s ease;
}

/* 英文状态下的左上角布局 */
.text-top-left.horizontal-layout {
  flex-direction: column; /* 英文水平文字纵向排列 */
  max-width: 600px; /* 限制最大宽度 */
}

/* 右下角文字容器 - 默认中文布局 */
.text-bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
  padding-right: 60rem; /* 中文状态下的右边距 */
  padding-bottom: 3rem;
  display: flex;
  flex-direction: row; /* 中文竖直文字横向排列 */
  align-items: flex-end; /* 向下对齐 */
  gap: 2rem;
  transition: all 0.3s ease;
}

/* 英文状态下的右下角布局 */
.text-bottom-right.horizontal-layout {
  flex-direction: column; /* 英文水平文字纵向排列 */
  max-width: 600px; /* 限制最大宽度 */
  text-align: right; /* 右对齐 */
  padding-right: 30rem; /* 英文状态下恢复原来的右边距 */
}

/* 竖直文字样式 - 默认中文竖直排列 */
.vertical-text {
  writing-mode: vertical-rl; /* 竖直排列，从右到左 */
  text-orientation: upright; /* 文字保持正立 */
  color: white;
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 0.5em;
  white-space: nowrap; /* 防止换行 */
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
  transition: all 0.3s ease; /* 添加过渡动画 */
}

/* 英文状态下的水平排列 */
.horizontal-text {
  writing-mode: horizontal-tb; /* 水平排列 */
  text-orientation: mixed; /* 文字正常方向 */
  font-family: "Futura", "Arial", sans-serif; /* 英文字体 */
  letter-spacing: 0.1em; /* 英文字母间距调整 */
  margin-bottom: 1rem; /* 英文状态下添加下边距 */
}

/* 英文诗歌专用样式 */
.english-poem.horizontal-text {
  font-family: "Futura Heavy", "Futura", "Arial Black", sans-serif; /* Futura Heavy字体 */
  font-weight: 900; /* 确保字体粗细 */
  font-size: 2.5rem; /* 稍微增大字体 */
  line-height: 1.4; /* 调整行高 */
  letter-spacing: 0.05em; /* 调整字母间距 */
  text-align: left; /* 左对齐 */
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
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.95;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em; /* 中文默认字间距 */
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
  transition: letter-spacing 0.3s ease;
}

/* 英文状态下的guide-text-line样式 */
.guide-text-line.english-text {
  letter-spacing: 0.02em; /* 英文字间距更小 */
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

/* 特殊样式：风中之林 - 中文默认 */
.forest-text {
  font-family: "slidefu", sans-serif !important;
  font-size: 144px !important;
  color: #ffe29a !important; /* 设置为黄色 */
  margin-bottom: 3rem !important; /* 增加下边距 */
}

/* 英文状态下的forest-text样式 */
.forest-text.english-text {
  font-family: "Voyage", "slidefu", sans-serif !important; /* 英文使用Voyage字体 */
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
  max-width: 1000px;
}

.belief-header {
  font-size: 1.8rem;
  color: white;
  margin-top: -2rem; /* 向上挪移 */
  margin-bottom: 3rem;
  opacity: 0.9;
  font-weight: bold;
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
  font-weight: bold;
  text-align: center;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif; /* 使用苹方字体 */
}

/* 特定文字的黄色高亮 */
.highlight-yellow {
  color: #ffe29a;
  font-weight: bold;
}

/* 英文诗歌行颜色设置 */
.english-line-1,
.english-line-3 {
  color: white; /* 第一行和第三行为白色 */
}

.english-line-2,
.english-line-4 {
  color: #ffe29a; /* 第二行和第四行为黄色 */
}

/* 英文状态下的样式调整 */
.english-line-1,
.english-line-2,
.english-line-3,
.english-line-4 {
  font-family: "Futura Heavy", "Futura", "Arial Black", sans-serif; /* 使用Futura Heavy字体 */
  font-weight: 900; /* 设置字重为Heavy */
  line-height: 1.6; /* 调整行高 */
}

/* 最后一行不需要下边距 */
.english-line-4 {
  margin-bottom: 0;
}

/* 第五部分：蒲公英主题展示 */
.part-5 {
  background: #052a1b;
}

.dandelion-section {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 中心蒲公英背景 */
.center-dandelion {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.dandelion-bg {
  width: 600px;
  height: auto;
  opacity: 0.8;
}

/* 中心文字内容 */
.center-text-content {
  position: absolute;
  top: 50%;
  left: 48%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  width: 700px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 第一部分：今天 (靠上) */
.text-part-1 {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5.5rem;
}

/* 第二部分：风已致，新苗起 (居中，最大字号，黄色) */
.text-part-2 {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 4rem;
  color: #ffe29a;
  font-weight: bold;
  align-self: center;
  margin-bottom: 4rem;
}

/* 第三部分：四行文字 (靠下) */
.text-part-3 {
  align-self: center;
}

.text-part-3 .text-line {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
}

/* 第五部分英文状态下的Futura Heavy字体设置 */
.text-part-1.english-text {
  font-family: "Futura Heavy", "Futura", "Arial Black", sans-serif;
  font-weight: 900; /* Heavy字重 */
}

.text-part-2.english-text {
  font-family: "Futura Heavy", "Futura", "Arial Black", sans-serif;
  font-weight: 900; /* Heavy字重 */
}

.text-part-3.english-text .text-line {
  font-family: "Futura Heavy", "Futura", "Arial Black", sans-serif;
  font-weight: 900; /* Heavy字重 */
}

/* 文字周围的蒲公英 */
.floating-dandelions {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vw; /* 矩形区域宽度 */
  height: 100vh; /* 矩形区域高度 */
  transform: translate(-50%, -50%);
  z-index: 0;
}

.floating-dandelion {
  position: absolute;
  transition: transform 0.3s ease;
  transform: rotate(-15deg); /* 统一倾斜角度 */
}

.floating-dandelion:hover {
  transform: rotate(-15deg) scale(1.1); /* 悬停时保持角度 */
}

/* 40个蒲公英 - 100px左右尺寸，只避开文字区域 */
/* 左侧区域 (1-10) */
.dandelion-1 {
  top: 8%;
  left: 5%;
  width: 95px;
}
.dandelion-2 {
  top: 25%;
  left: 3%;
  width: 105px;
}
.dandelion-3 {
  top: 45%;
  left: 8%;
  width: 90px;
}
.dandelion-4 {
  top: 65%;
  left: 5%;
  width: 110px;
}
.dandelion-5 {
  top: 85%;
  left: 10%;
  width: 100px;
}
.dandelion-6 {
  top: 12%;
  left: 15%;
  width: 95px;
}
.dandelion-7 {
  top: 35%;
  left: 18%;
  width: 105px;
}
.dandelion-8 {
  top: 75%;
  left: 20%;
  width: 90px;
}
.dandelion-9 {
  top: 55%;
  left: 12%;
  width: 100px;
}
.dandelion-10 {
  top: 92%;
  left: 18%;
  width: 95px;
}

/* 左中区域 (11-20) - 避开文字中心区域 */
.dandelion-11 {
  top: 5%;
  left: 25%;
  width: 105px;
}
.dandelion-12 {
  top: 88%;
  left: 28%;
  width: 90px;
}
.dandelion-13 {
  top: 15%;
  left: 32%;
  width: 100px;
}
.dandelion-14 {
  top: 72%;
  left: 30%;
  width: 95px;
}
.dandelion-15 {
  top: 3%;
  left: 35%;
  width: 105px;
}
.dandelion-16 {
  top: 95%;
  left: 38%;
  width: 90px;
}
.dandelion-17 {
  top: 22%;
  left: 25%;
  width: 100px;
}
.dandelion-18 {
  top: 62%;
  left: 35%;
  width: 95px;
}
.dandelion-19 {
  top: 42%;
  left: 28%;
  width: 105px;
}
.dandelion-20 {
  top: 82%;
  left: 32%;
  width: 90px;
}

/* 右中区域 (21-30) - 避开文字中心区域 */
.dandelion-21 {
  top: 8%;
  left: 68%;
  width: 100px;
}
.dandelion-22 {
  top: 85%;
  left: 70%;
  width: 95px;
}
.dandelion-23 {
  top: 18%;
  left: 72%;
  width: 105px;
}
.dandelion-24 {
  top: 65%;
  left: 68%;
  width: 90px;
}
.dandelion-25 {
  top: 2%;
  left: 65%;
  width: 100px;
}
.dandelion-26 {
  top: 92%;
  left: 72%;
  width: 95px;
}
.dandelion-27 {
  top: 28%;
  left: 65%;
  width: 105px;
}
.dandelion-28 {
  top: 48%;
  left: 70%;
  width: 90px;
}
.dandelion-29 {
  top: 75%;
  left: 65%;
  width: 100px;
}
.dandelion-30 {
  top: 38%;
  left: 72%;
  width: 95px;
}

/* 右侧区域 (31-40) */
.dandelion-31 {
  top: 12%;
  left: 78%;
  width: 105px;
}
.dandelion-32 {
  top: 32%;
  left: 75%;
  width: 90px;
}
.dandelion-33 {
  top: 52%;
  left: 80%;
  width: 100px;
}
.dandelion-34 {
  top: 75%;
  left: 78%;
  width: 95px;
}
.dandelion-35 {
  top: 5%;
  left: 85%;
  width: 105px;
}
.dandelion-36 {
  top: 28%;
  left: 88%;
  width: 90px;
}
.dandelion-37 {
  top: 48%;
  left: 85%;
  width: 100px;
}
.dandelion-38 {
  top: 68%;
  left: 82%;
  width: 95px;
}
.dandelion-39 {
  top: 88%;
  left: 85%;
  width: 105px;
}
.dandelion-40 {
  top: 15%;
  left: 82%;
  width: 90px;
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

  /* 移动端禁用视差效果 */
  .parallax-text {
    transform: none !important;
    transition: none !important;
  }
}

/* 视差滚动样式 */
.parallax-text {
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* 确保第二部分有相对定位 */
.part-2 {
  position: relative;
  overflow: hidden;
}
</style>
