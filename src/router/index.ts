import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/structural-equation',
      name: 'structural-equation',
      component: () => import('../views/StructuralEquationView.vue'),
    },
    {
      path: '/mind-map-test',
      name: 'mind-map-test',
      component: () => import('../views/MindMapTestView.vue'),
    },
    {
      path: '/theory-learning',
      name: 'theory-learning',
      component: () => import('../views/TheoryLearningView.vue'),
    },
    {
      path: '/TAT理论深度学习平台.html',
      redirect: '/theory-learning'
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('../views/DocumentsView.vue'),
    },
    {
      path: '/document/:path*',
      name: 'document-viewer',
      component: () => import('../views/DocumentViewerView.vue'),
    },
    {
      path: '/paper-reproduction',
      name: 'paper-reproduction',
      component: () => import('../components/paper-reproduction/PaperReproductionView.vue'),
    },
  ],
})

export default router
