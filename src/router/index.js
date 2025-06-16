import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/information",
    name: "Information",
    component: () => import("../views/Information.vue"),
  },
  {
    path: "/hall",
    name: "Hall",
    component: () => import("../views/Hall.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
