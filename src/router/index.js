import { createRouter, createWebHashHistory } from 'vue-router'
import OnBoarding from "@/pages/OnBoarding";

const routes = [
  {
    path: '/',
    name: 'home',
    component: OnBoarding
  },
  {
    path: '/chernov',
    name: 'chernov',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/pages/Chernoff.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
