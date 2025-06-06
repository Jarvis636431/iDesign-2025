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
          <div class="quote-section">
            <blockquote class="main-quote">
              {{
                isEnglish
                  ? '"Design is not just what it looks like and feels like. Design is how it works."'
                  : "「设计不仅仅是外观和感觉，设计是它如何工作。」"
              }}
            </blockquote>
            <cite class="quote-author">
              {{ isEnglish ? "— Steve Jobs" : "— 史蒂夫·乔布斯" }}
            </cite>
          </div>
          <div class="philosophy-text">
            <p>
              {{
                isEnglish
                  ? "In the realm of design, we explore the intersection of art and function, where every line, color, and form serves a purpose beyond aesthetics."
                  : "在设计的领域里，我们探索艺术与功能的交汇点，每一条线、每一种颜色、每一个形式都承载着超越美学的意义。"
              }}
            </p>
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
  width: 600vw !important; /* 扩展到600vw */
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
  width: 200vw; /* 第二部分：200vw */
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
  border: 2px solid #4a9d6f; /* 临时边框，用于调试 */
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

/* 第二部分：文字和背景图 (200vw宽度) */
.part-2 {
  background-image: url("/assets/images/backimg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 2px solid #2fa3b0; /* 临时边框，用于调试 */
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
  background: linear-gradient(135deg, #1a4d3a, #052a1b);
  border: 2px solid #ff6b6b; /* 临时边框，用于调试 */
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
  background: #ffffff;
  color: #333;
  border: 2px solid #ffa500; /* 临时边框，用于调试 */
}

.text-only-content {
  max-width: 800px;
  padding: 3rem;
  text-align: center;
}

.quote-section {
  margin-bottom: 3rem;
}

.main-quote {
  font-size: 2rem;
  font-style: italic;
  line-height: 1.4;
  margin-bottom: 1rem;
  color: #2fa3b0;
  border-left: 4px solid #2fa3b0;
  padding-left: 2rem;
  text-align: left;
}

.quote-author {
  font-size: 1.2rem;
  color: #666;
  display: block;
  text-align: right;
  margin-top: 1rem;
}

.philosophy-text {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #555;
  text-align: justify;
}

/* 第五部分：图片和文字组合 */
.part-5 {
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border: 2px solid #9c27b0; /* 临时边框，用于调试 */
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
  color: #333;
}

.section-title {
  font-size: 2.5rem;
  color: #2fa3b0;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.vision-text {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #555;
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
  color: #666;
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
