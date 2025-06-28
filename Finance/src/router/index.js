import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue')
  },
  {
    path: '/register/success',
    name: 'RegisterSuccess',
    component: () => import('@/views/auth/RegisterSuccessView.vue')
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/auth/OnboardingView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/kyc',
    name: 'KYC',
    component: () => import('@/views/kyc/KYCView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/kyc/upload',
    name: 'KYCUpload',
    component: () => import('@/views/kyc/KYCUploadView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/kyc/onboarding',
    name: 'KYCOnboarding',
    component: () => import('@/views/kyc/KYCOnboardingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/kyc-review',
    name: 'KYCReview',
    component: () => import('@/views/admin/KYCReviewView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.user) {
      next('/login')
      return
    }
    
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!authStore.user?.isAdmin) {
        next('/dashboard')
        return
      }
    }
  }
  
  next()
})

export default router 