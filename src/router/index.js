import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

import Home from '../views/HomeViews.vue'
import Login from '../views/LoginViews.vue'
import Favoritos from '../views/FavoritosViews.vue'
import DetalleLugar from '../views/DetalleLugar.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },

  {
    path: '/favoritos',
    component: Favoritos,
    meta: { requiresAuth: true }
  },

  { path: '/lugar/:id', component: DetalleLugar }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router