import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/exhibition/:id',
    name: 'Exhibition',
    component: () => import('../views/Exhibition.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 