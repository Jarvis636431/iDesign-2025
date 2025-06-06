<script setup>
const props = defineProps({
  isEnglish: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <section class="content-section" id="video">
    <h2>{{ isEnglish ? "Video" : "宣传片" }}</h2>
    <div class="section-content">
      <video controls class="video-player">
        <source src="/assets/videos/preface.mp4" type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
      <p class="video-description">
        风起林间，记录设计生长的声音<br />
        在微光与风语中，看见一代人的筑梦足迹<br />
        每一帧，都是新苗破土的片刻<br />
        每一段影像，都是成长的年轮
      </p>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  min-width: 100%;
  height: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #052a1b;
  background-image: url("/assets/images/video-backimg.png");
  background-size: cover;
  background-position: center 20%;
}

.video-player {
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  border: 12px solid white;
  margin-bottom: 1rem;
  position: relative;
  top: -20px;
}

.video-description {
  margin-top: 1rem;
  text-align: left;
  color: #ffffff;
}
</style>
