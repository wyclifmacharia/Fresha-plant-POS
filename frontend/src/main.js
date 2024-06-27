import './assets/css/tabler.min.css'
import './assets/css/demo.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import "toastify-js/src/toastify.css"
import './assets/main.css'
import vSelect from 'vue-select'


import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import { routes } from './utils/Routes.js'
import { isTokenExpired } from './utils/helpers'

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

router.beforeEach((to, from, next) => {
  const tokenExpired = isTokenExpired()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!tokenExpired) {
      next()
    } else {
      next({ name: 'index' })
    }
  } else if (to.matched.some((record) => record.meta.public)) {
    next()
  } else {
    next({ name: 'index' })
  }
})

const app = createApp(App)
app.use(router)
app.component("v-select", vSelect)
app.mount('#app')
