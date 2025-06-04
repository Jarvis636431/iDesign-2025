import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/information/:id',
    name: 'Information',
    component: () => import('../views/Information.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('../views/Demo.vue')
  },
  {
    path: '/halls',
    name: 'HallList',
    component: () => import('../views/HallList.vue')
  },
  {
    path: '/halls/:id',
    name: 'HallDetail',
    component: () => import('../views/HallDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router