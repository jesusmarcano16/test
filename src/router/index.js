import Carrera from '../pages/Carrera.vue'
import Facturar from '../pages/Facturar.vue'
import PageNotFound from '../pages/PageNotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Carrera, meta: { title: 'Imagenes del mundo' } },
  { path: '/facturar', component: Facturar, meta: { title: 'Facturar' } },
  { path: '/:pathMatch(.*)*', component: PageNotFound, meta: { title: '404' } }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Your Website Title'
  next()
})

export default router
