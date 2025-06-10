import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/2025/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/2025/information/:id?",
    name: "Information",
    component: () => import("../views/Information.vue"),
  },
  {
    path: "/2025/test",
    name: "Test",
    component: () => import("../views/Test.vue"),
  },
  // 添加根路径重定向
  {
    path: "/",
    redirect: "/2025/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
