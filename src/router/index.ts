import { createRouter, createWebHistory } from 'vue-router'

import IntroPage from '@/pages/Intro.vue'
import Dashboard from '@/pages/Dashboard.vue'
import DashboardHome from '@/pages/DashboardHome.vue'
import Topics from '@/pages/Topics.vue'
import DetailPage from '@/pages/[id].vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: IntroPage,
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: '', name: 'dashboard-home', component: DashboardHome },
        {
          path: 'subjects/:subjectSlug',
          name: 'subject-topics',
          component: Topics,
        },
        {
          path: 'subjects/:subjectSlug/topic/:topicSlug',
          name: 'topic-detail',
          component: DetailPage,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
