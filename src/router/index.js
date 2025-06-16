import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/2025/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/2025/information",
    name: "Information",
    component: () => import("../views/Information.vue"),
  },
  {
    path: "/2025/hall",
    name: "Hall",
    component: () => import("../views/Hall.vue"),
  },
  // 添加根路径重定向
  {
    path: "/",
    redirect: "/2025/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
