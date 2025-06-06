<template>
  <section class="content-section" id="home">
    <img src="/assets/images/logos/main.png" alt="Main Logo" class="main-logo" />
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
  padding: 2rem;
  position: relative;
  background: white;
}

.main-logo {
  opacity: 0;
  animation: fadeInAndMove 2.5s forwards;
  width: 800px;
  height: auto;
  position: absolute;
  transform: rotate(-45deg);
}

@keyframes fadeInAndMove {
  0% {
    opacity: 0;
    transform: translateX(0) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: translateX(0) rotate(-45deg);
  }
  100% {
    opacity: 1;
    transform: translateX(-90%) rotate(0deg);
    animation-timing-function: ease-in-out;
  }
}

h1 {
  color: #333;
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.4;
}
</style>
