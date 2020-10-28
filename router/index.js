import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'none',
    meta: {auth: true, nones: true}
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/start',
    name: 'Start',
    meta: {auth: true},
    component: () => import('../views/Start.vue')
  },
  {
    path: '/connect-to',
    name: 'Connect',
    meta: {auth: true},
    component: () => import('../views/Connect.vue')
  },
  {
    path: '/game',
    name: 'Game',
    meta: {auth: true},
    component: () => import('../views/Game.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requireAuth = to.matched.some(rec => rec.meta.auth)
  const nones = to.matched.some(rec => rec.meta.nones)

  if ((requireAuth && !currentUser) || (requireAuth && !currentUser && nones)) {
    next('/login?message=login')
  } else if (!nones) {
    next()
  } else {
    next('/start')
  }
})



export default router
