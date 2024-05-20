import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/vote',
      name: 'vote',
      component: () => import('../views/vote.vue'),
      meta: {
        keepAlive: false,
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      meta: {
        keepAlive: false,
      },
    },
  ],
})

export function setupRouter(AppInstance) {
  AppInstance.use(router)
}

export default router
