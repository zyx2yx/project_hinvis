import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homePage.vue'
import DetailView from '../views/detailPage.vue'
import HINPage from '../views/HINPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'hinhome',
      component: HINPage
    },
    {
      path: '/deprecated',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about/:id',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: DetailView
    }
  ]
})

export default router
