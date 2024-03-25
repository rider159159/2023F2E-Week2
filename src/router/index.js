import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue'),
      meta: {
        keepAlive: false,
      },
    },
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
    {
      path: '/update',
      name: 'update',
      component: () => import('../views/update.vue'),
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
