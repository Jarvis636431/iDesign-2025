<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import CustomCarousel from "@/components/slides/CustomCarousel.vue"; // Import CustomCarousel
import AuthorCards from "@/components/exhibition/AuthorCards.vue";
import { halls as hallConfigs } from "@/constants/halls";
import axios from "axios";
import { exhibitModels } from "@/constants/exhibitModels";

const route = useRoute();
const router = useRouter();

const carouselRef = ref(null); // Add carouselRef
const showShareModal = ref(false); // 分享弹窗状态
const showFullscreen = ref(false); // 全屏展示状态
const isMobile = ref(false); // 移动端检测

const hallId = computed(() => parseInt(route.query.hallId));
const currentId = computed(() => parseInt(route.query.id));
const hallInfo = computed(() => hallConfigs.find((h) => h.id === hallId.value));
const hallColor = computed(() => hallInfo.value?.color || "#2FA3B0");
const hallBackgroundColor = computed(
  () => hallInfo.value?.backgroundColor || "#D5f7ec"
);
const hallBackgroundImage = computed(
  () => hallInfo.value?.backgroundImage || ""
);

const exhibits = ref([]);
const loading = ref(false);
const error = ref("");

// 获取展厅所有展品
async function fetchExhibits() {
  if (!hallId.value) return;
  loading.value = true;
  error.value = "";
  try {
    const res = await axios.get(
      "http://idesign.tju.edu.cn/portal/api_v1/get_cates_lists",
      {
        params: { per_page: 9999, current_page: 1, category_id: hallId.value },
      }
    );
    exhibits.value = res.data?.data || [];
  } catch (e) {
    error.value = "展品数据加载失败";
    exhibits.value = [];
  } finally {
    loading.value = false;
  }
}

// 移动端检测
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
  fetchExhibits();
  checkMobile();
  window.addEventListener("resize", checkMobile);

  // 确保页面滚动到顶部
  await nextTick();
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

watch(hallId, fetchExhibits);

// 监听路由变化，确保滚动到顶部
watch([currentId, hallId], async () => {
  await nextTick();
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 50);
});

const exhibitInfo = computed(() => {
  if (!currentId.value || !Array.isArray(exhibits.value)) return null;
  // id 强制转为数字，避免类型不一致导致找不到
  const item = exhibits.value.find(
    (e) => Number(e.id) === Number(currentId.value)
  );
  if (!item) return null;
  // 优先展示视频，没有视频再展示图片，兼容对象数组
  let imageUrl = "";
  let videoUrl = "";
  if (item.more) {
    if (item.more.files && item.more.files.length > 0) {
      const file = item.more.files[0];
      videoUrl = fullUrl(file.url);
    } else if (item.more.photos && item.more.photos.length > 0) {
      const photo = item.more.photos[0];
      imageUrl = fullUrl(photo.url);
    } else if (item.more.thumbnail) {
      imageUrl = fullUrl(item.more.thumbnail);
    }
  }
  // 处理所有作者
  let authors = [];
  if (Array.isArray(item.more?.authors)) {
    authors = item.more.authors.map((author) => ({
      zh_names: author.zh_names,
      grade: author.grade || "未知年级",
      avatar: author.url ? fullUrl(author.url) : null, // 作者头像URL需要通过fullUrl处理
    }));
  }
  return {
    title: item.post_title,
    description: item.intro_zh,
    imageUrl,
    videoUrl,
    details: {
      authors,
      teacher: item.tutors_zh || "",
      year: "",
      medium: "",
    },
  };
});

const modelFile = computed(() => {
  if (!currentId.value) return "";
  const file = exhibitModels[currentId.value];
  // 适配 Vite base 配置，确保开发和生产都能加载模型
  return file ? import.meta.env.BASE_URL + "assets/models/" + file : "";
});

function fullUrl(path) {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `http://idesign.tju.edu.cn/upload/${path.replace(/^\//, "")}`;
}

const goToExhibit = (direction) => {
  if (!exhibits.value.length) return;
  const idx = exhibits.value.findIndex((e) => e.id === currentId.value);
  let newIdx;
  if (direction === "next") {
    newIdx = idx < exhibits.value.length - 1 ? idx + 1 : 0;
  } else {
    newIdx = idx > 0 ? idx - 1 : exhibits.value.length - 1;
  }
  const nextId = exhibits.value[newIdx]?.id;
  router.push({
    path: "/information",
    query: {
      id: nextId,
      hallId: hallId.value,
    },
  });

  // 切换展品后滚动到顶部
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 100);
};

// const currentSlide = ref(0) // Remove old currentSlide

const exhibitSlides = computed(() => {
  const slides = [];
  // 1. 模型
  const file = exhibitModels[currentId.value];
  if (file) {
    slides.push({ type: "model", src: "assets/models/" + file });
  }
  // 2. 所有视频
  const item = exhibits.value.find(
    (e) => Number(e.id) === Number(currentId.value)
  );
  if (
    item &&
    item.more &&
    Array.isArray(item.more.files) &&
    item.more.files.length > 0
  ) {
    item.more.files.forEach((f) => {
      if (f.url) slides.push({ type: "video", src: fullUrl(f.url) });
    });
  }
  // 3. 所有图片
  if (item && item.more) {
    if (Array.isArray(item.more.photos) && item.more.photos.length > 0) {
      item.more.photos.forEach((photo) => {
        if (photo.url) slides.push({ type: "image", src: fullUrl(photo.url) });
      });
    } else if (item.more.thumbnail) {
      slides.push({ type: "image", src: fullUrl(item.more.thumbnail) });
    }
  }
  return slides;
});

// Remove old prevSlide and nextSlide methods
// function prevSlide() {
//   if (exhibitSlides.value.length === 0) return
//   currentSlide.value = (currentSlide.value - 1 + exhibitSlides.value.length) % exhibitSlides.value.length
// }
// function nextSlide() {
//   if (exhibitSlides.value.length === 0) return
//   currentSlide.value = (currentSlide.value + 1) % exhibitSlides.value.length
// }
// watch([exhibits, currentId], () => { currentSlide.value = 0 }) // Remove old watcher

// 返回home页面并定位到exhibitionsection
const goToHome = () => {
  router.push("/#exhibition");
};

// 移动端触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  if (!isMobile.value) return;
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  if (!isMobile.value) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50; // 最小滑动距离
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // 向右滑动，显示上一个
      goToExhibit("prev");
    } else {
      // 向左滑动，显示下一个
      goToExhibit("next");
    }
  }
};

// 分享功能
const shareExhibit = () => {
  if (!exhibitInfo.value) return;
  showShareModal.value = true;
};

// 关闭分享弹窗
const closeShareModal = () => {
  showShareModal.value = false;
};

// 全屏展示功能
const openFullscreen = () => {
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
};

// 复制链接
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("链接已复制到剪贴板！");
  } catch (error) {
    prompt("请复制以下链接进行分享：", window.location.href);
  }
};

// 下载分享卡片
const downloadShareCard = async () => {
  await generateShareCard();
  const canvas = document.getElementById("shareCanvas");
  if (canvas) {
    const link = document.createElement("a");
    link.download = `${exhibitInfo.value.title}-分享卡片.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
};

// 生成分享卡片
const generateShareCard = () => {
  return new Promise((resolve) => {
    if (!exhibitInfo.value) {
      resolve();
      return;
    }

    const canvas = document.getElementById("shareCanvas");
    const ctx = canvas.getContext("2d");

    // 设置画布尺寸 (类似手机屏幕比例)
    canvas.width = 400;
    canvas.height = 600;

    // 绘制背景
    ctx.fillStyle = "#f5e6e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制卡片背景
    ctx.fillStyle = "#ffffff";
    const cardX = 20;
    const cardY = 20;
    const cardWidth = canvas.width - 40;
    const cardHeight = canvas.height - 40;

    // 绘制圆角矩形
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 16);
    ctx.fill();

    // 绘制头部区域
    ctx.fillStyle = "#333333";
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.fillText("天津大学第11届设计年展", cardX + 60, cardY + 35);

    // 绘制三个点
    ctx.fillStyle = "#999999";
    ctx.font = "20px Arial";
    ctx.fillText("⋯", cardX + cardWidth - 30, cardY + 35);

    let iconLoaded = false;
    let mainImageLoaded = false;

    const checkComplete = () => {
      if (iconLoaded && mainImageLoaded) {
        drawBottomContent();
        resolve();
      }
    };

    // 绘制头部图标 (使用固定的PNG图片)
    const iconImg = new Image();
    // 移除crossOrigin，因为是本地图片
    iconImg.onload = () => {
      console.log("头部图片加载成功:", iconImg.src);
      // 绘制固定的PNG图片 (保持原始比例)
      ctx.drawImage(iconImg, cardX + 15, cardY + 10, 40, 40);

      iconLoaded = true;
      checkComplete();
    };
    iconImg.onerror = (error) => {
      console.error("头部图片加载失败:", error);
      // 图片加载失败，绘制圆形占位符和文字标识
      ctx.fillStyle = hallColor.value || "#2FA3B0";
      ctx.beginPath();
      ctx.arc(cardX + 35, cardY + 30, 20, 0, 2 * Math.PI);
      ctx.fill();

      // 添加文字标识，确认这个区域被绘制了
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("LOGO", cardX + 35, cardY + 35);
      ctx.textAlign = "left";

      iconLoaded = true;
      checkComplete();
    };
    // 尝试多种路径格式
    const possiblePaths = [
      "/assets/images/avatar-border.png",
      "./assets/images/avatar-border.png",
      window.location.origin + "/assets/images/avatar-border.png",
      import.meta.env.BASE_URL + "assets/images/avatar-border.png",
    ];

    iconImg.src = possiblePaths[0]; // 先尝试第一个路径
    console.log("尝试加载头部图片:", iconImg.src);

    // 绘制图片区域
    const imageY = cardY + 60;
    const imageHeight = 200;

    if (exhibitInfo.value.imageUrl) {
      const img = new Image();
      // 只对外部图片设置crossOrigin
      if (exhibitInfo.value.imageUrl.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        console.log("主图片加载成功");
        ctx.drawImage(img, cardX, imageY, cardWidth, imageHeight);
        mainImageLoaded = true;
        checkComplete();
      };
      img.onerror = (error) => {
        console.error("主图片加载失败:", error);
        drawImagePlaceholder();
        mainImageLoaded = true;
        checkComplete();
      };
      img.src = exhibitInfo.value.imageUrl;
    } else {
      drawImagePlaceholder();
      mainImageLoaded = true;
      checkComplete();
    }

    function drawImagePlaceholder() {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(cardX, imageY, cardWidth, imageHeight);

      ctx.fillStyle = "#666666";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        exhibitInfo.value.title,
        cardX + cardWidth / 2,
        imageY + imageHeight / 2
      );
      ctx.textAlign = "left";
    }

    function drawBottomContent() {
      const bottomY = imageY + imageHeight + 20;

      // 绘制图标行 - 使用图片图标
      const iconSize = 20;
      const iconY = bottomY + 5;

      // 创建图标图片
      const iconImg = new Image();
      iconImg.onload = () => {
        // 绘制四个图标，增加间距
        const iconSpacing = 50; // 增加图标间距
        ctx.drawImage(iconImg, cardX + 30, iconY, iconSize, iconSize);
        ctx.drawImage(
          iconImg,
          cardX + 30 + iconSpacing,
          iconY,
          iconSize,
          iconSize
        );
        ctx.drawImage(
          iconImg,
          cardX + 30 + iconSpacing * 2,
          iconY,
          iconSize,
          iconSize
        );
        ctx.drawImage(
          iconImg,
          cardX + cardWidth - 50,
          iconY,
          iconSize,
          iconSize
        );
      };
      iconImg.src = "/assets/images/icons/share.png";

      // 绘制作品标题
      ctx.fillStyle = "#333333";
      ctx.font = "bold 16px Arial";
      ctx.fillText(exhibitInfo.value.title, cardX + 20, bottomY + 50);

      // 绘制标签
      ctx.fillStyle = "#4a90e2";
      ctx.font = "14px Arial";
      const tags = `#${
        hallInfo.value?.name || ""
      } #${exhibitInfo.value.details.authors
        .map((a) => a.zh_names)
        .join(" #")}`;
      ctx.fillText(tags, cardX + 20, bottomY + 75);

      // 绘制描述
      ctx.fillStyle = "#333333";
      ctx.font = "12px Arial";
      const description = exhibitInfo.value.description;
      const lines = wrapText(ctx, description, cardWidth - 40);
      lines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, cardX + 20, bottomY + 100 + index * 18);
      });

      // 绘制底部信息
      ctx.fillStyle = "#999999";
      ctx.font = "11px Arial";
      ctx.fillText("1分钟", cardX + 20, bottomY + 170);
      ctx.fillText("查看翻译", cardX + cardWidth - 60, bottomY + 170);
    }
  });
};

// 文字换行辅助函数
const wrapText = (ctx, text, maxWidth) => {
  const words = text.split("");
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
};
</script>

<template>
  <div class="information-page">
    <button class="back-button" @click="goToHome">返回</button>
    <div
      class="background-blur"
      :style="{
        backgroundImage: hallBackgroundImage
          ? `url(${hallBackgroundImage})`
          : undefined,
        filter: 'blur(20px) saturate(1.2) brightness(1.1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    ></div>
    <div v-if="loading">展品加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!exhibitInfo">
      <div
        style="
          text-align: center;
          padding: 4rem;
          font-size: 1.5rem;
          color: #888;
        "
      >
        无效的展品ID
      </div>
    </div>
    <div v-else class="navigation-container">
      <button class="nav-button prev" @click="goToExhibit('prev')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <div
        class="exhibit-container"
        :class="{ 'mobile-container': isMobile }"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <img
          v-if="
            hallInfo && (isMobile ? hallInfo.mobileBorder : hallInfo.border)
          "
          class="border-image"
          :src="isMobile ? hallInfo.mobileBorder : hallInfo.border"
          alt="边框"
        />
        <div class="exhibit-content" :class="{ 'mobile-content': isMobile }">
          <div class="exhibit-image-wrapper">
            <div class="exhibit-image-inner">
              <!-- Replace old carousel content with CustomCarousel component -->
              <CustomCarousel
                :slides="exhibitSlides"
                :hallColor="hallColor"
                ref="carouselRef"
                style="width: 100%; height: 100%"
              />
              <!-- 放大镜按钮 -->
              <button
                class="fullscreen-btn"
                :style="{ backgroundColor: hallColor }"
                @click="openFullscreen"
                title="全屏查看"
              >
                <svg viewBox="0 0 24 24" class="magnify-icon">
                  <path
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="exhibit-details">
            <div class="hall-info">
              <img
                v-if="hallInfo && hallInfo.icon"
                class="hall-icon"
                :src="hallInfo.icon"
                alt="icon"
              />
              <span class="hall-text-group">
                <span class="hall-text" :style="{ color: hallColor }">{{
                  hallInfo?.name || ""
                }}</span>
                <span class="hall-subtext" :style="{ color: hallColor }">{{
                  hallInfo?.enName || ""
                }}</span>
              </span>
            </div>
            <div class="desc-section">
              <div class="desc-header">
                <span class="desc-title">{{ exhibitInfo.title }}</span>
                <button
                  class="share-btn"
                  :style="{ backgroundColor: hallColor }"
                  @click="shareExhibit"
                >
                  <img src="/assets/images/icons/share.png" alt="分享" />
                </button>
              </div>
              <div class="desc-content">
                {{ exhibitInfo.description }}
              </div>
              <div class="desc-footer">
                <div class="authors-section">
                  <AuthorCards
                    :authors="exhibitInfo.details.authors || []"
                    :hallColor="hallColor"
                  />
                </div>
                <div class="teacher-section">
                  <div class="section-label">指导教师</div>
                  <div class="teacher-name">
                    {{ exhibitInfo.details.teacher || "无" }}
                  </div>
                  <!-- 移动端展厅图标 -->
                  <img
                    v-if="isMobile && hallInfo && hallInfo.icon"
                    class="mobile-hall-icon"
                    :src="hallInfo.icon"
                    alt="展厅图标"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端导航指示器 -->
        <div v-if="isMobile && exhibits.length > 1" class="mobile-indicators">
          <div
            v-for="exhibit in exhibits"
            :key="exhibit.id"
            class="mobile-indicator"
            :class="{ active: exhibit.id === currentId }"
          ></div>
        </div>
      </div>
      <button class="nav-button next" @click="goToExhibit('next')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>

    <!-- 分享弹窗 -->
    <div
      v-if="showShareModal"
      class="share-modal-overlay modal"
      @click="closeShareModal"
    >
      <div class="share-modal" @click.stop>
        <!-- 分享卡片 -->
        <div class="share-card">
          <!-- 卡片头部 -->
          <div class="share-card-header">
            <div class="share-card-logo">
              <img src="/assets/images/avatar.png" alt="展厅图标" />
            </div>
            <div class="share-card-title">
              <div class="share-card-main-title">天津大学第11届设计年展</div>
              <div class="share-card-dots">⋯</div>
            </div>
          </div>

          <!-- 卡片图片区域 -->
          <div class="share-card-image">
            <img
              v-if="exhibitInfo.imageUrl"
              :src="exhibitInfo.imageUrl"
              alt="作品图片"
            />
            <div v-else class="share-card-image-placeholder">
              <span>{{ exhibitInfo.title }}</span>
            </div>
          </div>

          <!-- 卡片底部信息 -->
          <div class="share-card-footer">
            <div class="share-card-icons">
              <div class="share-icon">
                <img
                  src="/assets/images/icons/heart.png"
                  alt="喜欢"
                  class="icon-img"
                />
              </div>
              <div class="share-icon">
                <img
                  src="/assets/images/icons/message.png"
                  alt="评论"
                  class="icon-img"
                />
              </div>
              <div class="share-icon">
                <img
                  src="/assets/images/icons/send.png"
                  alt="分享"
                  class="icon-img"
                />
              </div>
              <div class="share-icon bookmark">
                <img
                  src="/assets/images/icons/bookmark.png"
                  alt="收藏"
                  class="icon-img"
                />
              </div>
            </div>

            <div class="share-card-info">
              <div class="share-card-work-title">
                <strong>{{ exhibitInfo.title }}</strong>
                <span class="share-card-tags">
                  #{{ hallInfo?.name || "" }}
                  <span
                    v-for="author in exhibitInfo.details.authors"
                    :key="author.zh_names"
                  >
                    #{{ author.zh_names }}
                  </span>
                </span>
              </div>

              <div class="share-card-description">
                {{ exhibitInfo.description }}
              </div>

              <div class="share-card-meta">
                <span class="share-card-time">1分钟</span>
                <span class="share-card-translate">查看翻译</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="share-actions">
          <button
            class="share-action-btn download-btn"
            @click="downloadShareCard"
          >
            下载照片
          </button>
          <button class="share-action-btn copy-btn" @click="copyLink">
            复制链接
          </button>
        </div>

        <!-- 隐藏的Canvas用于生成图片 -->
        <canvas id="shareCanvas" style="display: none"></canvas>
      </div>
    </div>

    <!-- 全屏展示弹窗 -->
    <div
      v-if="showFullscreen"
      class="fullscreen-modal-overlay"
      @click="closeFullscreen"
    >
      <div class="fullscreen-modal" @click.stop>
        <!-- 关闭按钮 -->
        <button class="fullscreen-close-btn" @click="closeFullscreen">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </button>

        <!-- 全屏展示内容 -->
        <div class="fullscreen-content">
          <CustomCarousel
            :slides="exhibitSlides"
            :hallColor="hallColor"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.information-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 3vw;
}

.background-blur {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transform: scale(1.1);
}

.navigation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1vw; /* 减小间距，从 2vw 改为 1vw */
  position: relative;
  z-index: 1;
}

.exhibit-container {
  position: relative;
  background: white;
  border-radius: 50px;
  max-width: 1300px; /* 增加最大宽度，从 1100px 改为 1300px */
  width: 80vw; /* 增加宽度比例，从 70vw 改为 80vw */
  min-width: 900px; /* 增加最小宽度，从 800px 改为 900px */
  min-height: 680px; /* 增加最小高度，从 600px 改为 680px */
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px; /* 你可以根据需要调整大小 */
}

.border-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% - 40px); /* 比container小一圈，和padding对应 */
  height: calc(100% - 40px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

.exhibit-content {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1.3fr 1fr; /* 左侧更大 */
  gap: 2.5rem;
  width: 100%;
  padding: 3.5rem 3rem;
  box-sizing: border-box;
  align-items: start; /* 由center改为start，防止右侧内容撑高左侧 */
  height: 100%;
  min-height: 0;
}

.nav-button {
  background: none;
  border: none;
  padding: 0.8rem; /* 减小内边距，从 1rem 改为 0.8rem */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px; /* 适当调整按钮大小，从 56px 改为 48px */
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.arrow-icon {
  width: 28px; /* 适当调整图标大小，从 32px 改为 28px */
  height: 28px;
  fill: #4a90e2;
}

.exhibit-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 0px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);
  width: 580px; /* 增加宽度，从 480px 改为 580px */
  height: 580px; /* 增加高度，从 480px 改为 580px */
  min-width: 360px; /* 增加最小宽度，从 320px 改为 360px */
  min-height: 360px; /* 增加最小高度，从 320px 改为 360px */
  max-width: 620px; /* 增加最大宽度，从 520px 改为 620px */
  max-height: 620px; /* 增加最大高度，从 520px 改为 620px */
  margin: 0 auto;
  position: relative;
  flex-shrink: 0;
  align-self: flex-start; /* 保证左侧区域高度只受自身内容影响 */
}

.exhibit-image-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  position: relative;
}

/* 放大镜按钮 */
.fullscreen-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.fullscreen-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.magnify-icon {
  width: 18px;
  height: 18px;
  fill: white;
}

.exhibit-main-image,
.exhibit-main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1/1;
  border-radius: 8px; /* 从24px改为8px，圆角更小 */
  background: #f8f8f8;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.exhibit-main-image:hover,
.exhibit-main-video:hover {
  box-shadow: 0 4px 24px 0 rgba(47, 163, 176, 0.18);
}

.exhibit-image-empty {
  width: 100%;
  height: 100%;
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 8px; /* 从24px改为8px，圆角更小 */
}

.desc-section {
  flex: 1 1 auto; /* 可伸缩，占据剩余空间 */
  overflow-y: auto; /* 内容过多时可滚动 */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0;
  padding-right: 0.5rem;
}

.desc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.desc-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  border-radius: 50%;
  box-sizing: border-box;
  overflow: hidden;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin-left: 1rem;
}

.share-btn:focus {
  outline: none;
}

.share-btn img {
  width: 20px;
  object-fit: contain;
}

.desc-content {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  flex: 1;
  overflow-y: auto;
}

.desc-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end; /* 改为底部对齐 */
  justify-content: space-between;
  margin-left: 0.5rem;
  gap: 2rem;
}

.authors-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 内容底部对齐 */
}

.teacher-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end; /* 内容底部对齐 */
}

.teacher-section h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.teacher-section p {
  color: #666;
  font-size: 1rem;
  text-align: right;
  margin: 0.25rem 0;
}

.section-label {
  color: #666;
  font-size: 0.9rem;
}

.teacher-name {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  text-align: right;
  margin-bottom: 0.3rem;
}

.hall-info {
  flex: 0 0 auto; /* 不会被压缩 */
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.hall-icon {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}

.hall-text-group {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end; /* 右对齐 */
  vertical-align: middle;
  padding-right: 0.6rem; /* 右侧留白 */
}

.hall-text {
  font-size: 1.4rem;
  font-weight: bold;
}
.hall-subtext {
  font-size: 1.1rem;
}

.exhibit-details {
  max-height: 580px; /* 与左侧图片区域高度一致 */
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  margin-left: -1rem; /* 向左偏移，和图片区域对齐 */
}
.slide-arrow {
  display: none;
}
/* Remove old carousel specific styles, as they are now in CustomCarousel.vue */
/*
.slide-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}
.slide-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  display: inline-block;
  cursor: pointer;
  transition: background 0.2s;
}
*/
@media (max-width: 1200px) {
  .exhibit-container {
    min-width: 0;
    width: 95vw;
    max-width: 98vw;
  }
  .exhibit-content {
    padding: 2rem 1rem;
    gap: 1.2rem;
  }
}
/* 移动端适配 */
@media (max-width: 768px) {
  .information-page {
    min-height: 100vh;
    height: auto;
    padding: 1rem;
    padding-top: 3rem;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
  }

  /* 移动端背景模糊优化 */
  .background-blur {
    filter: blur(15px) saturate(1.1) brightness(1.05);
    transform: scale(1.05); /* 移动端稍微减少缩放 */
  }

  .navigation-container {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 1rem;
  }

  .nav-button {
    display: none; /* 隐藏左右导航按钮 */
  }

  .exhibit-container.mobile-container {
    width: 100%;
    max-width: none;
    min-width: 0;
    min-height: 0;
    border-radius: 20px;
    padding: 0.8rem;
    margin: 0;
    position: relative;
  }

  .exhibit-container.mobile-container .border-image {
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    border-radius: 20px;
  }

  .exhibit-content.mobile-content {
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    gap: 1.2rem;
    width: 100%;
    height: auto;
    min-height: 0;
  }

  /* 移动端图片区域 - 上方正方形 */
  .exhibit-image-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 100%; /* 创建正方形比例 */
    min-width: 0;
    min-height: 0;
    max-width: none;
    max-height: none;
    margin: 0;
    border-radius: 8px; /* 从16px改为8px，圆角更小 */
    order: 1;
    position: relative;
  }

  .exhibit-image-inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px; /* 从12px改为6px，圆角更小 */
  }

  /* 移动端详情区域 - 下方 */
  .exhibit-details {
    max-height: none;
    overflow-y: visible;
    margin-left: 0;
    order: 2;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  /* 隐藏展厅信息 */
  .hall-info {
    display: none;
  }

  .desc-section {
    gap: 0.8rem;
    padding-right: 0;
    flex: 1;
  }

  /* 标题和分享按钮 - 两端对齐 */
  .desc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 0;
  }

  .desc-title {
    font-size: 1.2rem;
    text-align: left;
    flex: 1;
  }

  .share-btn {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    margin-left: 1rem;
    order: 2;
  }

  .share-btn img {
    width: 16px;
  }

  /* 展品描述 */
  .desc-content {
    font-size: 0.9rem;
    text-align: left;
    line-height: 1.5;
    margin: 0.3rem 0;
    max-height: 100px;
  }

  /* 底部作者和教师信息 - 两端对齐 */
  .desc-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    margin-left: 0;
    margin-top: 0.8rem;
  }

  .authors-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    margin-left: 0.5rem;
  }

  .teacher-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    position: relative;
    padding-bottom: 0.3rem;
    padding-right: 2.5rem; /* 为图标留出空间 */
    justify-content: flex-start; /* 改为顶部对齐 */
    margin-top: -0.3rem; /* 向上移动 */
  }

  .teacher-name {
    text-align: right;
  }

  /* 移动端展厅图标 */
  .mobile-hall-icon {
    position: absolute;
    top: 5px;
    right: 0;
    width: 32px;
    height: 32px;
    opacity: 0.8;
  }

  /* 移动端导航指示器 */
  .mobile-indicators {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 10;
  }

  .mobile-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }

  .mobile-indicator.active {
    background: #fff;
    transform: scale(1.2);
  }
}

@media (max-width: 900px) and (min-width: 769px) {
  .exhibit-content {
    grid-template-columns: 1fr;
    padding: 1.2rem 0.5rem;
    gap: 1.2rem;
  }
  .exhibit-image-wrapper {
    width: 90vw;
    height: 90vw;
    min-width: 0;
    min-height: 0;
    max-width: 100vw;
    max-height: 100vw;
    align-self: flex-start;
  }
  .exhibit-details {
    max-height: none;
    overflow-y: visible;
  }
  .hall-icon {
    width: 28px;
    height: 28px;
    max-width: 28px;
    max-height: 28px;
  }
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
}

/* 移动端返回按钮优化 */
@media (max-width: 768px) {
  .back-button {
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

/* 分享弹窗样式 */
.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-in-out;
}

.share-modal {
  background: transparent;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 移动端分享弹窗优化 */
@media (max-width: 768px) {
  .share-modal {
    padding: 1rem;
    width: 95%;
    max-width: 350px;
  }

  .share-card-image {
    height: 250px;
  }

  .share-actions {
    flex-direction: row;
    gap: 0.75rem;
  }

  .share-action-btn {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
}

.share-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.share-card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.share-card-logo img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.share-card-title {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-card-main-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.share-card-dots {
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.share-card-image {
  width: 100%;
  height: 300px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.share-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  color: #666;
  font-size: 1.2rem;
  font-weight: 500;
}

.share-card-footer {
  padding: 1rem;
}

.share-card-icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.8rem;
}

.share-icon {
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon .icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: grayscale(0.3);
  transition: all 0.2s ease;
}

.share-icon:hover {
  transform: scale(1.1);
}

.share-icon:hover .icon-img {
  filter: grayscale(0);
}

.share-icon.bookmark {
  margin-left: auto;
}

.share-card-work-title {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.share-card-work-title strong {
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 0.25rem;
}

.share-card-tags {
  font-size: 0.9rem;
  color: #4a90e2;
  font-weight: normal;
}

.share-card-description {
  font-size: 0.9rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.share-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
}

.share-card-translate {
  color: #4a90e2;
  cursor: pointer;
}

.share-actions {
  display: flex;
  gap: 1rem;
}

.share-action-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.download-btn {
  background: #4a90e2;
  color: white;
}

.download-btn:hover {
  background: #357abd;
  transform: translateY(-2px);
}

.copy-btn {
  background: #f0f0f0;
  color: #333;
}

.copy-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

/* 全屏展示模态框 */
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: fadeIn 0.3s ease-in-out;
}

.fullscreen-modal {
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  max-height: 800px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.fullscreen-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.fullscreen-close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.close-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端全屏优化 */
@media (max-width: 768px) {
  .fullscreen-modal {
    width: 95vw;
    height: 95vh;
    border-radius: 8px;
  }

  .fullscreen-close-btn {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }

  .close-icon {
    width: 18px;
    height: 18px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
