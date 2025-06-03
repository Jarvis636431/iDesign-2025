import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/exhibition/:id',
    name: 'Exhibition',
    component: () => import('../views/Exhibition.vue')
  },
  {
    path: '/information/:id',
    name: 'Information',
    component: () => import('../views/Information.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router