import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import RegisterView from '../views/RegisterView.vue';
import SignInView from '../views/SignInView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    {
      path: '/register',
      component: RegisterView
    },
    {
      path: '/login',
      component: SignInView
    }

  ]
})

export default router
