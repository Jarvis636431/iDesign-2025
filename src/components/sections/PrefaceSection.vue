<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
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
          <div class="text-overlay">
            <h2 class="main-title">
              {{ isEnglish ? "Wind from the South" : "有风自南" }}
            </h2>
            <h3 class="sub-title">
              {{ isEnglish ? "Wings for New Sprouts" : "翼彼新苗" }}
            </h3>
            <p class="description">
              {{
                isEnglish
                  ? "Every design tells a story of growth and dreams, where creativity meets innovation in the journey of learning."
                  : "每一个设计，都诉说着成长与梦想的故事，在学习的旅程中，创意与创新相遇。"
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- 第三部分：待定区域 -->
      <div class="section-part part-3">
        <div class="placeholder-content">
          <div class="placeholder-text">
            <h3>{{ isEnglish ? "Coming Soon" : "敬请期待" }}</h3>
            <p>
              {{
                isEnglish
                  ? "This section is under development"
                  : "此区域正在开发中"
              }}
            </p>
          </div>
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
  width: 650vw !important; /* 扩展到650vw */
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
  width: 100vw; /* 第一部分：100vw */
}

.part-2 {
  width: 250vw; /* 第二部分：250vw */
}

.part-3 {
  width: 100vw; /* 第三部分：100vw */
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
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(5, 42, 27, 0.7); /* 半透明遮罩 */
}

.text-overlay {
  text-align: center;
  color: white;
  max-width: 1000px; /* 增加最大宽度以利用200vw空间 */
  padding: 3rem;
}

.main-title {
  font-size: 4.5rem; /* 增大字体以适应更大空间 */
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em; /* 增加字间距 */
}

.sub-title {
  font-size: 2.5rem; /* 增大字体 */
  margin-bottom: 3rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
}

.description {
  font-size: 1.4rem; /* 增大字体 */
  line-height: 1.8;
  opacity: 0.8;
  max-width: 800px; /* 限制描述文字的宽度以保持可读性 */
  margin: 0 auto;
}

/* 第三部分：待定区域 */
.part-3 {
  background: #052a1b;
}

.placeholder-content {
  text-align: center;
  color: white;
  opacity: 0.7;
}

.placeholder-text h3 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4a9d6f;
}

.placeholder-text p {
  font-size: 1.2rem;
  opacity: 0.8;
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
  }

  .main-title {
    font-size: 2.5rem;
  }

  .sub-title {
    font-size: 1.5rem;
  }

  .text-overlay {
    max-width: 90%;
    padding: 2rem;
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
